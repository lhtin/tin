---

title: 给OpenJDK中的Epsilon GC添加GC功能
date: 2020-12-26
categories:
- note
tags:
- Java
- OpenJDK
excerpt: 本文介绍如何给OpenJDK中的Epsilon GC增加一个简单的GC功能。核心内容（代码和原理解析）来做是Aleksey Shipilёv的*Do It Yourself (OpenJDK) Garbage Collector*文章。本文的目的是根据我自己的理解，用自己的话做一个总结。
---

之前写过一篇介绍OpenJDK中的Epsilon GC的[文章](https://tin.js.org/2020/12/13/openjdk-epsilon-gc/)，参考部分提到了Aleksey Shipilёv写的[*Do It Yourself (OpenJDK) Garbage Collector*](https://shipilev.net/jvm/diy-gc/)。不过Shipilёv那篇文章写的主要是有关如何给Epsilon GC添加真正的GC功能，而不是介绍Epsilon GC的。我当时计划后面出一篇对Shipilёv那篇文章的总结文章，于是有了本文。注意本文中的GC代码全部来自于那篇文章，只是移除了其中的英文注释并做了少量细微的调整。

在Shipilёv那篇文章中，作者给Epsilon GC添加了真正的GC功能，不过是一个极其简单的GC。它是一款基于标记-整理算法（Mark-Compact）的单线程无分代全堆GC。在进行垃圾回收时，需要阻塞用户线程（Stop The World）。

### 算法

目前OpenJDK中所有的GC都使用[追踪式垃圾回收算法](https://en.wikipedia.org/wiki/Tracing_garbage_collection)，本文介绍的GC也采用了该算法，并且在整理内存时采用了[LISP2-style Mark Compact](https://en.wikipedia.org/wiki/Mark-compact_algorithm#LISP2_algorithm)算法。为了使算法更加容易理解，引入一个小程序，算法中各个阶段的示例图片都来源于该程序：

```java
class C1 {
    private C2 c2;
    public C1() {
        c2 = new C2();
    }
}
class C2 {
    private C3 c3;
    public C2() {
        c3 = new C3();
    }
}
class C3 {}

public class Main {
    public static void newC2() {
        C2 c2 = new C2();
    }
    public static void main(String[] args) {
        C1 c1 = new C1();
        Main.newC2();
        C3 c3 = new C3();
        // 假设这个时候进行垃圾回收
    }
}
```

算法主要步骤如下（图中的内容为假设上面Java程序中的注释点为垃圾收集点时的呈现）：

0. 对象的初始状。GC Roots中的`c1`、`c3`表示引用，Heap中的`C1_1`表示类`C1`的一个实例。实线箭头表示引用，虚线箭头表示该对象将要移动的位置。

   <img src="/assets/openjdk-epsilon-add-gc/openjdk-epsilon-add-gc-snapshot.png" style="zoom:67%;" />

1. 标记可访问对象。从GC Roots（可以先简单理解为OpenJDK Runtime中引用的对象，比如局部变量）开始，递归遍历并标记每个可访问到的对象以及对象中为引用类型的字段指向的对象，直到所有可访问的对象都标记完成。另外还需要将标记的对象放到BitMap中去，BitMap是一个缩小版的Heap，只用于记录某个地址的对象是否被访问过。对象在BitMap的索引为对象地址除以64。

   <img src="/assets/openjdk-epsilon-add-gc/openjdk-epsilon-add-gc-mark.png" style="zoom:67%;" />

2. 计算标记对象的新地址。遍历标记的可访问对象，计算出对象将要移动的位置，并存储在对象的Mark Word处。计算的方式是：维护live指针和free指针，free指针初始时指向堆开头，live指针初始时执行第一个标记的对象（通过BitMap获取）。这时free指针指向的地址就是对象将要移动的位置，记录在对象的Mark Word中。然后给free指针加上根据对象的大小，表示下一个对象存放的位置，同时通过BitMap获取下一个标记的对象。一直下去直到所有标记的对象都处理了。

   <img src="/assets/openjdk-epsilon-add-gc/openjdk-epsilon-add-gc-calc.png" style="zoom:67%;" />

3. 修正引用地址。根据步骤2计算出的新地址，修正对象中为引用类型字段的指向和GC Roots中的指向。这一步会导致指向的内存地址错误，等待下一步移动对象之后才正常。

   <img src="/assets/openjdk-epsilon-add-gc/openjdk-epsilon-add-gc-adjust.png" style="zoom: 67%;" />

4. 移动对象。移动完之后需要更新堆内存顶部的指针，这样下次分配内存时候可以使用回收了的那部分内存。

   <img src="/assets/openjdk-epsilon-add-gc/openjdk-epsilon-add-gc-move.png" style="zoom: 67%;" />

### 代码解析

了解了算法的基本逻辑之后，再来看下具体到HotSpot JVM，要如何给它加上这个算法的GC。这里需要说明下，由于HotSpot JVM Runtime提供了大量现成的钩子，所以我们需要做的是实现一些Closure类（可以理解为回调函数），从而可以接触到GC Roots、对象中的引用，并进行各种处理。注意下面所有的代码均来自于Shipilëv在GitHub上的仓库，具体文件为[epsilonHeap.cpp](https://github.com/shipilev/jdk/blob/epsilon-mark-compact/src/hotspot/share/gc/epsilon/epsilonHeap.cpp)和[epsilonHeap.hpp](https://github.com/shipilev/jdk/blob/epsilon-mark-compact/src/hotspot/share/gc/epsilon/epsilonHeap.hpp)。对于没有定义的一些类和方法，可以从前面算法的演示和代码的注释中了解其大概内容，具体实现可以去源代码中看。

整个GC，都是在`EpsilonHeap::entry_collect`方法中实现，为了按照算法的步骤展示代码，我将该方法中的代码分成了4个主要部分，并且省略了其他非核心的代码。

- 标记过程

  ```c++
  void EpsilonHeap::entry_collect(GCCause::Cause cause) {
    ...
    {
      GCTraceTime(Info, gc) time("Step 1: Mark", NULL);
      
      /// 存放对象的栈数据结构
      EpsilonMarkStack stack;
      /// 将变量的对象进行标记并添加到stack中，并在_bitmap中记录下对应位置有对象
      EpsilonScanOopClosure cl(&stack, &_bitmap);
  
      /// 标记所有的GC Roots并添加到stack中
      process_roots(&cl);
  
      /// 将标记了的对象pop出来，然后对对象中引用的对象进行标记并添加到stack中
      /// 直到所有可访问的对象都标记完成了
      while (!stack.is_empty()) {
        oop obj = stack.pop();
        /// 遍历对象中的引用对象
        obj->oop_iterate(&cl);
      }
    }
    ...
  }
  
  void EpsilonHeap::process_roots(OopClosure* cl) { 
    do_roots(cl); 
  }
  
  void EpsilonHeap::do_roots(OopClosure* cl) {
    // Need to tell runtime we are about to walk the roots with 1 thread
    StrongRootsScope scope(1);
  
    /// 强引用Roots遍历
    for (OopStorageSet::Iterator it = OopStorageSet::strong_iterator(); !it.is_end(); ++it) {
      (*it)->oops_do(cl);
    }
    /// 目前没有对弱引用专门处理，所以当做强引用Roots一样进行遍历标记就好了
    for (OopStorageSet::Iterator it = OopStorageSet::weak_iterator(); !it.is_end(); ++it) {
      (*it)->oops_do(cl);
    }
  
    // Need to adapt oop closure for some special root types.
    CLDToOopClosure clds(cl, ClassLoaderData::_claim_none);
    MarkingCodeBlobClosure blobs(cl, CodeBlobToOopClosure::FixRelocations);
    
    /// 其他子系统
    ClassLoaderDataGraph::cld_do(&clds);
    Threads::possibly_parallel_oops_do(false, cl, &blobs);
  
    {
      MutexLocker lock(CodeCache_lock, Mutex::_no_safepoint_check_flag);
      CodeCache::blobs_do(&blobs);
    }
  }
  
  /// 进行标记的Closure
  class EpsilonScanOopClosure : public BasicOopIterateClosure {
  private:
    EpsilonMarkStack* const _stack;
    MarkBitMap* const _bitmap;
  
    template <class T>
    void do_oop_work(T* p) {
      T o = RawAccess<>::oop_load(p);
      if (!CompressedOops::is_null(o)) {
        oop obj = CompressedOops::decode_not_null(o);
        /// 对没有被标记过的对象进行标记并push到_stack中
        if (!_bitmap->is_marked(obj)) {
          _bitmap->mark(obj);
          _stack->push(obj);
        }
      }
    }
  
  public:
    EpsilonScanOopClosure(EpsilonMarkStack* stack, MarkBitMap* bitmap) :
                          _stack(stack), _bitmap(bitmap) {}
    virtual void do_oop(oop* p)       { do_oop_work(p); }
    virtual void do_oop(narrowOop* p) { do_oop_work(p); }
  };
  ```

- 计算新地址过程

  ```c++
  void EpsilonHeap::entry_collect(GCCause::Cause cause) {
    ...
    HeapWord* new_top;
    {
      GCTraceTime(Info, gc) time("Step 2: Calculate new locations", NULL);
      
      EpsilonCalcNewLocationObjectClosure cl(_space->bottom(), &preserved_marks);
      
      /// 对前面搜索到的可访问对象进行线性遍历
      walk_bitmap(&cl);
  
      /// 经过整理之后新的堆内存顶部，也就是没有被对象占用的位置，供后面移动完对象之后调整堆内存可用空间
      new_top = cl.compact_point();
    }
    ...
  }
  
  /// 遍历bitmap
  void EpsilonHeap::walk_bitmap(ObjectClosure* cl) {
     HeapWord* limit = _space->top();
     HeapWord* addr = _bitmap.get_next_marked_addr(_space->bottom(), limit);
     while (addr < limit) {
       oop obj = oop(addr);
       cl->do_object(obj);
       addr += 1;
       if (addr < limit) {
         addr = _bitmap.get_next_marked_addr(addr, limit);
       }
     }
  }
  
  class EpsilonCalcNewLocationObjectClosure : public ObjectClosure {
  private:
    HeapWord* _compact_point;
    PreservedMarks* const _preserved_marks;
  
  public:
    EpsilonCalcNewLocationObjectClosure(HeapWord* start, PreservedMarks* pm) :
                                        _compact_point(start),
                                        _preserved_marks(pm) {}
  
    void do_object(oop obj) {
      /// 只需要对前后位置变化了的对象进行计算
      if (obj != oop(_compact_point)) {
        markWord mark = obj->mark_raw();
        if (mark.must_be_preserved(obj->klass())) {
          _preserved_marks->push(obj, mark);
        }
        /// 存储移动后的地址到mark word中
        obj->forward_to(oop(_compact_point));
      }
      /// 根据对象的大小移动free pointer
      _compact_point += obj->size();
    }
  
    HeapWord* compact_point() {
      return _compact_point;
    }
  };
  ```

- 修改引用的地址

  ```c++
  void EpsilonHeap::entry_collect(GCCause::Cause cause) {
    ...
    {
      GCTraceTime(Info, gc) time("Step 3: Adjust pointers", NULL);
      
      EpsilonAdjustPointersObjectClosure cl;
      
      /// 遍历对象中的引用类型字段并修正引用地址为新地址
      walk_bitmap(&cl);
  
      /// 同时还需要修正GC Roots中的引用地址为新地址
      EpsilonAdjustPointersOopClosure cli;
      process_roots(&cli);
    }
    ...
  }
  
  class EpsilonAdjustPointersOopClosure : public BasicOopIterateClosure {
  private:
    template <class T>
    void do_oop_work(T* p) {
      T o = RawAccess<>::oop_load(p);
      if (!CompressedOops::is_null(o)) {
        oop obj = CompressedOops::decode_not_null(o);
        if (obj->is_forwarded()) {
          oop fwd = obj->forwardee();
          /// 更新引用地址
          RawAccess<>::oop_store(p, fwd);
        }
      }
    }
  
  public:
    virtual void do_oop(oop* p)       { do_oop_work(p); }
    virtual void do_oop(narrowOop* p) { do_oop_work(p); }
  };
  
  class EpsilonAdjustPointersObjectClosure : public ObjectClosure {
  private:
    EpsilonAdjustPointersOopClosure _cl;
  public:
    void do_object(oop obj) {
      obj->oop_iterate(&_cl);
    }
  };
  ```

- 移动对象

  ```c++
  void EpsilonHeap::entry_collect(GCCause::Cause cause) {
    ...
    {
      GCTraceTime(Info, gc) time("Step 4: Move objects", NULL);
      
      EpsilonMoveObjectsObjectClosure cl;
      
      /// 遍历并移动对象到新位置
      walk_bitmap(&cl);
      
      /// 设置堆内存的新堆顶地址
      _space->set_top(new_top);
    }
    ...
  }
  
  class EpsilonMoveObjectsObjectClosure : public ObjectClosure {
  public:
    void do_object(oop obj) {
      if (obj->is_forwarded()) {
        oop fwd = obj->forwardee();
        /// 移动对象到新位置
        Copy::aligned_conjoint_words(cast_from_oop<HeapWord*>(obj), cast_from_oop<HeapWord*>(fwd), obj->size());
        fwd->init_mark_raw();
      }
    }
  };
  ```

- 触发时机

  ```c++
  /// 内存分配不足的时候
  HeapWord* EpsilonHeap::allocate_or_collect_work(size_t size) {
    HeapWord* res = allocate_work(size);
    if (res == NULL && EpsilonSlidingGC) {
      vmentry_collect(GCCause::_allocation_failure);
      res = allocate_work(size);
    }
    return res;
  }
  
  /// 调用System.gc()的时候
  void EpsilonHeap::collect(GCCause::Cause cause) {
    switch (cause) {
      ...
      default:
        if (EpsilonSlidingGC) {
          if (SafepointSynchronize::is_at_safepoint()) {
            entry_collect(cause);
          } else {
            /// 非安全点，需要等待
            vmentry_collect(cause);
          }
        } else {
          log_info(gc)("GC request for \"%s\" is ignored", GCCause::to_string(cause));
        }
    }
  }
  ```

  

### 总结

通过学习Shipilëv的代码，可以让我（OpenJDK小白）比较快地熟悉HotSpot的其他子系统内容，可以为后面去了解HotSpot中的GC作些准备。



### 参考

- Do It Yourself (OpenJDK) Garbage Collector：https://shipilev.net/jvm/diy-gc/

- LISP2-style Mark Compact：https://en.wikipedia.org/wiki/Mark-compact_algorithm#LISP2_algorithm

  维基百科上关于本文提到的算法的介绍。
