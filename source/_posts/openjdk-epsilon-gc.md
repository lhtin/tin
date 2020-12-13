---
title: OpenJDK中的Epsilon GC
date: 2020-12-13
categories:
- note
tags:
- java
excerpt: 本文介绍OpenJDK中的Epsilon GC，包括内存分配方式、跟Runtime的对接。
---

原文地址：[https://tin.js.org/2020/12/13/openjdk-epsilon-gc/](https://tin.js.org/2020/12/13/openjdk-epsilon-gc/)

Epsilon GC实际上是一款no-op GC，即只进行内存分配，不进行内存回收。本文用于介绍Epsilon GC的内存分配方式，以及GC是如何与HotSpot JVM的其他部分打交道的。

通过 [JEP 304: Garbage Collector Interface](https://openjdk.java.net/jeps/304) 提案，HotSpot为各个GC抽象出了一套统一的GC接口。这使得新GC可以像插件一样很轻松地添加到JVM中。添加新GC时，除了自身的代码，对JVM中其他代码的改动非常小且很容易修改（改动其他地方的主要目的是为了让JVM能识别出新GC）。而后面添加到JVM中的Epsilon GC（[JEP 318](https://openjdk.java.net/jeps/318)）就是这个 JEP 304 提案的受益者，反过来也说明 JEP 304 提案实现的效果不错。这其实也方便了像我这种JVM小白阅读JVM的源代码。

每个GC都需要实现`GCArguments`、`CollectedHeap`等约定的接口。当运行JVM时，会通过参数和默认值选择本次要使用的GC，其实就是确定初始化哪个GC的`GCArguments`子类。比如通过参数`-XX:+UnlockExperimentalVMOptions -XX:+UseEpsilonGC`，就可以激活Epsilon GC，初始化`GCArguments`的子类`EpsilonArguments`。其中有一个`create_heap`方法必须实现：

```c++
class GCArguments {
public:
  virtual CollectedHeap* create_heap() = 0;
}

class EpsilonArguments : public GCArguments {
private:
  virtual CollectedHeap* create_heap();
}

CollectedHeap* EpsilonArguments::create_heap() {
  return new EpsilonHeap();
}
```

`create_heap`方法返回`CollectedHeap`子类实例，这个类是内存管理的核心类，要求子类必须实现统一的内存分配和回收接口：

```c++
class CollectedHeap : public CHeapObj<mtInternal> {
public:
  virtual HeapWord* mem_allocate(size_t size,
                                 bool* gc_overhead_limit_was_exceeded) = 0;
  virtual HeapWord* allocate_new_tlab(size_t min_size,
                                      size_t requested_size,
                                      size_t* actual_size);

  virtual void collect(GCCause::Cause cause) = 0;
  virtual void do_full_collection(bool clear_all_soft_refs) = 0;
}
```

下面来看下Epsilon GC中的这几个接口的实现。



### `mem_allocate`

功能：直接从堆内存分配，分配时需要加锁。这里有做优化，首先通过`_space->par_allocate(size)`分配，使用到了[CAS原子操作](https://en.wikipedia.org/wiki/Compare-and-swap)解决多线程分配问题。如果空间不足，再加锁扩充内存，然后再重新进行分配。

```c++
HeapWord* EpsilonHeap::mem_allocate(size_t size, bool *gc_overhead_limit_was_exceeded) {
  *gc_overhead_limit_was_exceeded = false;
  return allocate_work(size);
}

HeapWord* EpsilonHeap::allocate_work(size_t size) {
  HeapWord* res = _space->par_allocate(size);

  while (res == NULL) {
    MutexLocker ml(Heap_lock);

    size_t space_left = max_capacity() - capacity();
    size_t want_space = MAX2(size, EpsilonMinHeapExpand);

    if (want_space < space_left) {
      bool expand = _virtual_space.expand_by(want_space);
    } else if (size < space_left) {
      bool expand = _virtual_space.expand_by(space_left);
    } else {
      return NULL;
    }

    _space->set_end((HeapWord *) _virtual_space.high());
    res = _space->par_allocate(size);
  }

  return res;
}
```

这里的分配我觉得可以再优化下：

1. 进入锁的区域后，再尝试分配一次，因为有可能已经有空间了，可以减少堆空间的分配
2. 将`res = _space->par_allocate(size)`移出锁的区域，可以减少锁的阻塞时间

优化后的代码如下：

```c++
HeapWord* EpsilonHeap::allocate_work(size_t size) {
  HeapWord* res = _space->par_allocate(size);

  while (res == NULL) {
    {
      MutexLocker ml(Heap_lock);

      /// 进入锁区域之后，再尝试分配一次
      res = _space->par_allocate(size);
      if (res != NULL) {
        break;
      }

      size_t space_left = max_capacity() - capacity();
      size_t want_space = MAX2(size, EpsilonMinHeapExpand);

      if (want_space < space_left) {
        bool expand = _virtual_space.expand_by(want_space);
      } else if (size < space_left) {
        bool expand = _virtual_space.expand_by(space_left);
      } else {
        return NULL;
      }

      _space->set_end((HeapWord *) _virtual_space.high());
    }
    /// 移到了锁的外面，这里的分配可以并发进行了
    res = _space->par_allocate(size);
  }
  
  return res;
}
```



### `allocate_new_tlab`

功能：分配一个线程独享的内存块（TLAB，Thread Local Allocation Buffer），从这块内存块中分配内存时不需要加锁。主要的逻辑是先确认需要分配的TLAB内存的大小，然后调用前面的`allocate_work`方法进行分配。如果开启了`-XX:EpsilonElasticTLAB`等参数，TLAB的大小会动态进行调整。比如会根据设置的比例进行上调，如果超过某个时间，又会从`min_size`开始递增。这样做的目的是为了平衡TLAB块分配的次数和内存消耗。

JVM会调用GC提供的该方法获得TLAB块，然后在分配内存时，通过简单的指针移动进行快速的内存分配。

```c++
HeapWord* EpsilonHeap::allocate_new_tlab(size_t min_size,
                                         size_t requested_size,
                                         size_t* actual_size) {
  Thread* thread = Thread::current();

  bool fits = true;
  size_t size = requested_size;
  size_t ergo_tlab = requested_size;
  int64_t time = 0;

  if (EpsilonElasticTLAB) {
    ergo_tlab = EpsilonThreadLocalData::ergo_tlab_size(thread);

    if (EpsilonElasticTLABDecay) {
      int64_t last_time = EpsilonThreadLocalData::last_tlab_time(thread);
      time = (int64_t) os::javaTimeNanos();

      if (last_time != 0 && (time - last_time > _decay_time_ns)) {
        ergo_tlab = 0;
        EpsilonThreadLocalData::set_ergo_tlab_size(thread, 0);
      }
    }

    fits = (requested_size <= ergo_tlab);
    if (!fits) {
      size = (size_t) (ergo_tlab * EpsilonTLABElasticity);
    }
  }

  size = clamp(size, min_size, _max_tlab_size);
  size = align_up(size, MinObjAlignment);

  HeapWord* res = allocate_work(size);

  if (res != NULL) {
    *actual_size = size;
    if (EpsilonElasticTLABDecay) {
      EpsilonThreadLocalData::set_last_tlab_time(thread, time);
    }
    if (EpsilonElasticTLAB && !fits) {
      EpsilonThreadLocalData::set_ergo_tlab_size(thread, size);
    }
  } else {
    if (EpsilonElasticTLAB) {
      EpsilonThreadLocalData::set_ergo_tlab_size(thread, 0);
    }
  }

  return res;
}
```

其中，存储跟线程绑定的数据（`EpsilonThreadLocalData`）是在`EpsilonBarrierSet`类中初始化的。利用Runtime提供的`on_thread_create`和`on_thread_destroy`方法进行创建和销毁：

```c++
class EpsilonBarrierSet: public BarrierSet {
public:
  virtual void on_thread_create(Thread* thread);
  virtual void on_thread_destroy(Thread* thread);
};

void EpsilonBarrierSet::on_thread_create(Thread *thread) {
  EpsilonThreadLocalData::create(thread);
}

void EpsilonBarrierSet::on_thread_destroy(Thread *thread) {
  EpsilonThreadLocalData::destroy(thread);
}
```



### `collect`、`do_full_collection`

功能：这两个方法用于进行垃圾回收。因为Epsilon GC的定位就是只分配内存，不回收，所以并不会做啥具体的事情。

```c++
void EpsilonHeap::collect(GCCause::Cause cause) {
  switch (cause) {
    case GCCause::_metadata_GC_threshold:
    case GCCause::_metadata_GC_clear_soft_refs:
      log_info(gc)("GC request for \"%s\" is handled", GCCause::to_string(cause));
      MetaspaceGC::compute_new_size();
      print_metaspace_info();
      break;
    default:
      log_info(gc)("GC request for \"%s\" is ignored", GCCause::to_string(cause));
  }
  _monitoring_support->update_counters();
}

void EpsilonHeap::do_full_collection(bool clear_all_soft_refs) {
  collect(gc_cause());
}
```



## 总结

Epsilon GC涉及的所有类如下：

```
EpsilonArguments
	- create_heap 创建EspilonHeap对象

EpsilonHeap
  - allocate_new_tlab 分配新TLAB
  - mem_allocate 直接从堆上分配内存（大对象）
  - allocate_work 实际堆内存分配实现，供上面两个方法使用
  - collect 进行垃圾回收（实际上不会做任何事情，只是实现下接口）
  - do_full_collection 进行垃圾回收（实际上不会做任何事情，只是实现下接口）

EpsilonBarrierSet
  - on_thread_create 用户线程创建时的回调
  - on_thread_destroy 用户线程销毁时的回调

EpsilonThreadLocalData 存储动态TLAB块大小的信息

EpsilonMemoryPool 提供内存使用情况的接口
  - committed_in_bytes 申请了的内存
  - used_in_bytes 当前使用了的内存
  - max_size 最大内存

EpsilonInitLogger 日志输出相关
EpsilonMonitoringSupport 监控相关
```



## 参考

- [Do It Yourself (OpenJDK) Garbage Collector](https://shipilev.net/jvm/diy-gc/)

  这篇文章介绍了如何给Epsilon GC添加垃圾回收功能，主要内容集中在垃圾回收代码上，本文没有涉及到这块。

- [Writing your own Garbage Collector for JDK12](https://medium.com/@unmeshvjoshi/writing-your-own-garbage-collector-for-jdk12-8c83e3d0309b)

  这篇文章可以算作上一篇文章的补充，重点介绍了Epsilon是如何和HotSpot系统打交道的，包括如何将新的垃圾收集器注册进入HotSpot，使其可以通过参数启用该垃圾收集器。也包括对象的接口、TLAB分配方法等周边功能的介绍。
