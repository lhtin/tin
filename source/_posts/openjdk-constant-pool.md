---
title: HotSpot中的Run-Time Constant Pool实现
date: xxx
categories:
- note
tags:
- java
- openjdk
excerpt: 本文记录HotSpot实现运行时常量池的细节。
---



根据JVM规范（[jvms15-2.5.5](https://docs.oracle.com/javase/specs/jvms/se15/html/jvms-2.html#jvms-2.5.5)），JVM需要为每个类和接口维护一个运行时常量池（run-time constant pool）。这里面包含了类或接口中使用到的字面常量（比如数值、字符串，在静态编译时就可以确定）和符号引用（symbolic reference，比如类、字段、方法等的引用，这些信息要等到运行时才能确定）。class文件中包含的常量类型可以在这里（[jvms15-4.4](https://docs.oracle.com/javase/specs/jvms/se15/html/jvms-4.html#jvms-4.4)）查看，如果之前没有了解过class文件的格式，那么一定要先看一遍链接中的内容，再往下阅读。这些信息是Java程序运行的基石。JVM规范中（[jvms15-5.1](https://docs.oracle.com/javase/specs/jvms/se15/html/jvms-5.html#jvms-5.1)）粗略地规定了每个符号引用的构建方式。本文记录HotSpot实现运行时常量池的细节。

在HotSpot中，运行时常量池的构建和解析主要分成三个阶段，分别是**class文件解析阶段**、**class链接阶段**和**字节码执行阶段**。三个阶段主要做的事情如下：

1. class文件解析阶段将class文件中的常量池表的内容存储到`ConstantPool`对象中，另外还会对其内容做格式检查，确保其符合JVMS规范中的要求。同时对部分常量会进行处理，比如将CONSTANT_Utf8转化为Symbol，为CONSTANT_Class分配用于存储klass指针的索引，以及将CONSTANT_String直接转为Symbol等。
2. class链接阶段会对运行时常量池做两件事情，一是收集常量池中的符号引用类型的常量，这些常量都需要进一步的解析（resolve）。这一步主要是给需要进一步解析的常量分配存储空间，用于存储字节码执行阶段解析得到的内容。二是遍历class文件中的字节码，将符号引用操作数（即ConstantPool中的索引值）替换为ConstantPoolCache中的索引值。每个索引值指向的是一个`ConstantPoolCacheEntry`对象。
3. 字节码指向阶段就是真正的符号引用解析过程。比如在执行`getfield`字节码的时候，首先根据操作数获取ConstantPool中对应的CONSTANT_Class信息。首先看下ConstantPool中的\_resolved_klasses是否存在过，如果不存在的话就使用类加载器加载，然后存到\_resolve_klasses中去。下次遇到同一个class时就可以直接使用了。

下面详细介绍每个阶段做的事情。在讲解每个阶段之前，先给出一个HelloWorld Java程序和对应的class文件中的常量池，后面会使用到：

```java
public class HelloWorld {
    public static void main(String... args) {
        System.out.println("Hello World!");
    }
}
```

编译后的class文件中的常量池如下（可以使用`javap -v HelloWorld`查看，也可以使用我最近做的[Web小工具](https://tin.js.org/class-file-viewer/?useDefaultClass=true)查看class文件内容）：

```
   #1 = Methodref          #2.#3          // java/lang/Object."<init>":()V
   #2 = Class              #4             // java/lang/Object
   #3 = NameAndType        #5:#6          // "<init>":()V
   #4 = Utf8               java/lang/Object
   #5 = Utf8               <init>
   #6 = Utf8               ()V
   #7 = Fieldref           #8.#9          // java/lang/System.out:Ljava/io/PrintStream;
   #8 = Class              #10            // java/lang/System
   #9 = NameAndType        #11:#12        // out:Ljava/io/PrintStream;
  #10 = Utf8               java/lang/System
  #11 = Utf8               out
  #12 = Utf8               Ljava/io/PrintStream;
  #13 = String             #14            // Hello World!
  #14 = Utf8               Hello World!
  #15 = Methodref          #16.#17        // java/io/PrintStream.println:(Ljava/lang/String;)V
  #16 = Class              #18            // java/io/PrintStream
  #17 = NameAndType        #19:#20        // println:(Ljava/lang/String;)V
  #18 = Utf8               java/io/PrintStream
  #19 = Utf8               println
  #20 = Utf8               (Ljava/lang/String;)V
  #21 = Class              #22            // HelloWorld
  #22 = Utf8               HelloWorld
  #23 = Utf8               Code
  #24 = Utf8               LineNumberTable
  #25 = Utf8               main
  #26 = Utf8               ([Ljava/lang/String;)V
  #27 = Utf8               SourceFile
  #28 = Utf8               HelloWorld.java
```



### class文件解析阶段

在这个阶段，会根据class文件中的常量表（constant_pool table）创建一个对应的ConstantPool对象`cp`，供第二阶段和第三阶段使用。ConstantPool类中的部分字段如下面的ConstantPool类所示。在分配ConstantPool对象时，会根据常量表的大小`cp_size`，在对象后面多分配`cp_size * wordSize`字节的内存（wordSize为指针长度，即`sizeof(char*)`）。`cp`屁股后面的这部分内存用于存储class文件中每个常量的内容（PS：HotSpot中有大量这种存储方式，包括下面的ConstantPoolCache对象，比较灵活但是不容易理解）。

```c++
/* src/hotspot/share/oops/constantPool.hpp */
class ConstantPool : public Metadata {
  Array<u1>*           _tags;        // 描述每个常量的类型
  ConstantPoolCache*   _cache;       // 在第二阶段收集符号引用类型的常量信息，第三阶段会进行修改
  InstanceKlass*       _pool_holder; // 常量池所属的class
  Array<u2>*           _operands;    // 记录BootstrapMethods中的内容，供第三阶段所使用
  Array<Klass*>*       _resolved_klasses; // 存储常量池中所用到的class
  /* 紧跟着ConstantPool对象后面存储常量池表的信息，序号跟class文件中的常量表一一对应 */
  // #0
  // #1
  // #2
}

/* src/hotspot/share/oops/constantPool.cpp */
ConstantPool* ConstantPool::allocate(ClassLoaderData* loader_data, int length, TRAPS) {
  Array<u1>* tags = MetadataFactory::new_array<u1>(loader_data, length, 0, CHECK_NULL);
  int size = ConstantPool::size(length); // lenght即cp_size，再加上ConstantPool自身的size
  // new操作符是在MetaspaceObj中被重载的
  return new (loader_data, size, MetaspaceObj::ConstantPoolType, THREAD) ConstantPool(tags);
}
```

然后遍历class文件中常量表的每一项，根据其索引和类型存储到对应的位置。比如CONSTANT_Methodref方法符号引用常量，从class文件中获取`class_index`和`name_and_type_index`，然后存储到`cp`屁股后面对应的位置（`cp->method_at_put(index, class_index, name_and_type_index);`）。其中1～16位存储`class_index`，17~32位存储`name_and_type_index`。再比如CONSTANT_Utf8字符串常量，先将内容转化为`Symbol`对象，然后存储该符号对象地址到对应位置（`cp->symbol_at_put(index, result);`）。全部存储逻辑可以到`ClassFileParser::parse_constant_pool_entries`方法中查看，这里代码就不贴了。

将class文件中常量表的内容存储到`cp`屁股后面之后，会对其遍历两次。第一次遍历做常量之间引用的校验（比如CONSTANT_Class常量的内容必须是一个指向CONSTANT_Utf8常量的索引值）。这次校验中还会做两件额外的事情。一是会将CONSTANT_String常量中存储的string_index直接替换为对应的符号地址，如下图所示：

```c++
const int string_index = cp->string_index_at(index);
check_property(valid_symbol_at(string_index),
               "Invalid constant pool index %u in class file %s",
               string_index, CHECK);
Symbol* const sym = cp->symbol_at(string_index);
// tag由JVM_CONSTANT_StringIndex改为JVM_CONSTANT_String
cp->unresolved_string_at_put(index, sym); 
```

二是将CONSTANT_Class常量中的17～32位设置为对应的`_resolved_klasses`中的索引值：

```c++
const int class_index = cp->klass_index_at(index);
check_property(valid_symbol_at(class_index),
               "Invalid constant pool index %u in class file %s",
               class_index, CHECK);
// tag有JVM_CONSTANT_ClassIndex改为JVM_CONSTANT_UnresolvedClass
// num_klasses从0开始递增，目的是给每个class分配一个唯一的_resolved_klasses位置共后面存储
cp->unresolved_klass_at_put(index, class_index, num_klasses++);
```

第二次遍历做各种常量对应的字符串格式校验。比如CONSTANT_Class名称需要符合jvms（[jvms15-4.21](https://docs.oracle.com/javase/specs/jvms/se15/html/jvms-4.html#jvms-4.2.1)）中规定的格式，还有像方法名称和签名，都需要符合jvms中固定的格式。

最后在解析到class文件中的BootstrapMethods属性时，将其内容存储到`cp`的`_operands`中去。至此，第一阶段就算完成了。



### class链接阶段

这个阶段的目的主要有两个。一个是在ConstantPoolCache屁股后面为部分常量和字节码操作符分配对应的ConstantPoolCacheEntry（索引从0递增）。ConstantPoolCacheEntry的目的是存储执行的时候解析常量得到的内容。比如CONSTANT_Fieldref常量，会存储解析后对应的klass指针和字段的偏移量（field_offset），这样下次再使用到该常量时就可以直接使用。二是在ConstantPoolCache的\_resolved\_references中为解析为Java对象的常量分配空间（也是从0地址），在第一次解析成Java对象后存储到这里面，之后再次使用时就可以直接使用了。

以上过程由`Rewriter`对象完成，主要的字段和用意如下所示：

```c++
class Rewriter: public StackObj {
 private:
  InstanceKlass*      _klass; // ConstantPool所属的klass
  constantPoolHandle  _pool; // 第一阶段创建好的ConstantPool对象
  Array<Method*>*     _methods; // class中的方法列表
  GrowableArray<int>  _cp_map; // cp_index -> cache_index
  GrowableArray<int>  _cp_cache_map;  // cache_index -> cp_index（递增）
  /* 下面两个map存储ConstantPool中的常量与ConstantPoolCache中的_resolved_references对应关系 */
  GrowableArray<int>  _reference_map;  // cp_index -> resolved_reference_index
  GrowableArray<int>  _resolved_references_map; // resolved_reference_index -> cp_index（递增）
  
  GrowableArray<int>  _invokedynamic_references_map; // resolved_reference_index -> cache_index
  GrowableArray<int>  _invokedynamic_cp_cache_map; // _invokedynamic_cache_index -> cp_index
}
```

`_cp_cache_map`得目的在于，记录ConstantPoolCache中某个常量来自于ConstantPool中的哪一个，`_cp_cache_map`类似，不过是反过来。`_resolved_references_map`和`_reference_map`则是记录解析后的Java对象跟ConstantPool中的联系，跟前面的完全类似。`_invokedynamic_cp_cache_map`和`_invokedynamic_references_map`是专门为invokedynamic指令准备的，功能类似。

首先在遍历ConstantPool的时候，如果是CONSTANT_InterfaceMethodref、CONSTANT_Fieldref、CONSTANT_Methodref这几个常量，则添加到`_cp_cache_map`中。如果是CONSTANT_Dynamic、CONSTANT_String、CONSTANT_MethodHandle、CONSTANT_MethodType这几个常量，则添加到`_resolved_references_map`中

```c++
void Rewriter::compute_index_maps() {
  // _pool为ConstantPool对象，ConstantPool::lenght方法返回屁股后面常量表的长度
  const int length  = _pool->length();
  init_maps(length);
  bool saw_mh_symbol = false;
  for (int i = 0; i < length; i++) {
    int tag = _pool->tag_at(i).value();
    switch (tag) {
      case JVM_CONSTANT_InterfaceMethodref:
      case JVM_CONSTANT_Fieldref          : // fall through
      case JVM_CONSTANT_Methodref         : // fall through
        // 添加到_cp_map和_cp_cache_map中
        add_cp_cache_entry(i);
        break;
      case JVM_CONSTANT_Dynamic:
        // 添加到_reference_map和_resolved_references_map中
        add_resolved_references_entry(i);
        break;
      case JVM_CONSTANT_String            : // fall through
      case JVM_CONSTANT_MethodHandle      : // fall through
      case JVM_CONSTANT_MethodType        : // fall through
        // 添加到_reference_map和_resolved_references_map中
        add_resolved_references_entry(i);
        break;
    }
  }

  // 记录这时_cp_cache_map和_resolved_references_map的长度
  record_map_limits();
}
```

此外，在扫描类中的字节码时。如果遇到invokespecial指令且它的操作数是CONSTANT_InterfaceMethodref常量，也会再次增加一项到`_cp_cache_map`中，为得是和invokeinterface区分解析，即使他们对应同一个常量。此时`_cp_cache_map`中会有两项对应到同一个ConstantPool中的常量。如果遇到invokedynamic指令，首先会将其添加到`_invokedynamic_cp_cache_map`中，这里只要遇到该指令就添加一次，不管对应的常量池中的CONSTANT_InvokeDynamic常量是不是同一个。同时也会添加到`_resolved_references_map`中，主要用于存储appendix的值。在扫描字节码的过程中，除了记录上面的这些信息，还会根据记录的信息同步修改字节码的操作数。比如将执行ConstantPool中的索引`cp_index`改为执行ConstantPoolCache中的索引`cp_cache_index`或者执行`ConstantPoolCache::_resolved_references`中的索引。处理的代码如下图所示：

```c++
void Rewriter::scan_method(Thread* thread, Method* method, bool reverse, bool* invokespecial_error) {

  int nof_jsrs = 0;
  bool has_monitor_bytecodes = false;
  Bytecodes::Code c;

  const address code_base = method->code_base();
  const int code_length = method->code_size();
  int bc_length;
  for (int bci = 0; bci < code_length; bci += bc_length) {
    address bcp = code_base + bci;
    int prefix_length = 0;
    c = (Bytecodes::Code)(*bcp);

    // 计算操作符对应的操作数长度，方便寻找到下一个操作符
    bc_length = Bytecodes::length_for(c);
    if (bc_length == 0) {
      bc_length = Bytecodes::length_at(method, bcp);
      if (c == Bytecodes::_wide) {
        prefix_length = 1;
        c = (Bytecodes::Code)bcp[1];
      }
    }

    // 针对部分指令做处理
    switch (c) {
      case Bytecodes::_invokespecial  : {
        // 针对InterfaceMethodref做特殊处理
        // 然后将操作数修改为cp_cache_index
        rewrite_invokespecial(bcp, prefix_length+1, reverse, invokespecial_error);
        break;
      }
      case Bytecodes::_putstatic      :
      case Bytecodes::_putfield       :
      case Bytecodes::_getstatic      :
      case Bytecodes::_getfield       :
      case Bytecodes::_invokevirtual  :
      case Bytecodes::_invokestatic   :
      case Bytecodes::_invokeinterface:
      case Bytecodes::_invokehandle   :
        // 根据操作数（也就是cp_index）从_cp_map中获取cp_cache_index
        // 然后将操作数修改为cp_cache_index
        rewrite_member_reference(bcp, prefix_length+1, reverse);
        break;
      case Bytecodes::_invokedynamic:
        // 首先添加到_invokedynamic_cp_cache_map和_resolved_references_map中
        // 然后在_invokedynamic_references_map中收集cp_cache_index与resolved_reference_index的关系
        // 然后将操作数改为cp_cache_index（注意经过了特殊处理，并且操作数也扩展为4字节）
        rewrite_invokedynamic(bcp, prefix_length+1, reverse);
        break;
      case Bytecodes::_ldc:
      case Bytecodes::_fast_aldc:
        // 根据操作数（cp_index）从_reference_map中获取_resolved_reference_index
        // 然后将操作数修改为_resolved_reference_index
        maybe_rewrite_ldc(bcp, prefix_length+1, false, reverse);
        break;
      case Bytecodes::_ldc_w:
      case Bytecodes::_fast_aldc_w:
        // 根据操作数（cp_index）从_reference_map中获取resolved_reference_index
        // 然后将操作数修改为_resolved_reference_index
        maybe_rewrite_ldc(bcp, prefix_length+1, true, reverse);
        break;
      ...
    }
  }
}
```

最后就是根据前面收集到的各种对应关系生成ConstantPoolCache和ConstantPoolCacheEntry对象了。首先确定ConstantPoolCacheEntry的个数，数量为`_cp_cache_map`和`_invokedynamic_cp_cache_map`之和。创建的ConstantPoolCacheEntry数组也是放在ConstantPoolCache的屁股后面。

```c++
void Rewriter::make_constant_pool_cache(TRAPS) {
  ClassLoaderData* loader_data = _pool->pool_holder()->class_loader_data();
  // 创建ConstantPoolCache和ConstantPoolCacheEntry，
  // 长度为_cp_cache_map.length() + _invokedynamic_cp_cache_map.length()
  // 同时还会给每个ConstantPoolCacheEntry初始化部分内容，
  // 其中_indices设置为cp_index，另外给invokedynamic用的entry还会设置_f2为_resolved_reference_index
  ConstantPoolCache* cache =
      ConstantPoolCache::allocate(loader_data, _cp_cache_map,
                                  _invokedynamic_cp_cache_map,
                                  _invokedynamic_references_map, CHECK);

  _pool->set_cache(cache);
  cache->set_constant_pool(_pool());

  // 初始化_resolved_references和_reference_map
  _pool->initialize_resolved_references(loader_data, _resolved_references_map,
                                        _resolved_reference_limit,
                                        THREAD);
}
```

至此，运行时常量池涉及到的对象就创建完成了。包括ConstantPool、ConstantPoolCache、ConstantPoolCacheEntry。关系图如下：

![](/assets/hotspot/runtime-constant-pool.png)



### 字节码执行阶段

这个阶段的目的对常量进行解析（resolution），从而支撑字节码的执行，也就是将上图对应的NULL等确定好。不同字节码对运行时常量池的解析各不同。对常量池的解析主要包括字段操作、方法调用、引用常量加载三类。下面分别以getfield（字段操作）、invokevirtual（方法调用）、ldc（引用类型常量加载）来分析解析过程。

#### getfield

分两个步骤。第一步根据操作数（即对应的ConstantPoolCacheEntry索引），从对应的ConstantPoolCacheEntryList中获取ConstantPoolCacheEntry对象，再取出对应的cp_index，然后对其进行解析，得到类名、字段名和字段类型。根据类名对应的resolved\_klass\_index，在ConstantPool中的_resolved_klasses中检查对应的位置是否已经存在了解析好的，不存在则使用类加载器加载类名对应的类文件（`SystemDictionary::resolve_or_fail`）。找到了类之后，根据字段名和字段类型找到具体字段。最后 将解析到的信息设置到对应的ConstantPoolCacheEntry中。

```c++
/* src/hotspot/share/interpreter/interpreterRuntime.cpp */
// 支持getstatic、putstatic、getfield、putfield指令
void InterpreterRuntime::resolve_get_put(JavaThread* thread, Bytecodes::Code bytecode) {
  Thread* THREAD = thread;
  fieldDescriptor info;
  LastFrameAccessor last_frame(thread);
  constantPoolHandle pool(thread, last_frame.method()->constants());
  methodHandle m(thread, last_frame.method());
  bool is_put    = (bytecode == Bytecodes::_putfield  || bytecode == Bytecodes::_nofast_putfield ||
                    bytecode == Bytecodes::_putstatic);
  bool is_static = (bytecode == Bytecodes::_getstatic || bytecode == Bytecodes::_putstatic);

  {
    JvmtiHideSingleStepping jhss(thread);
    // 根据字段名称和类型从类中找到具体字段
    LinkResolver::resolve_field_access(info, pool, last_frame.get_index_u2_cpcache(bytecode),
                                       m, bytecode, CHECK);
  }

  ConstantPoolCacheEntry* cp_cache_entry = last_frame.cache_entry();
  if (cp_cache_entry->is_resolved(bytecode)) return;
  TosState state  = as_TosState(info.field_type());
  InstanceKlass* klass = info.field_holder();
  bool uninitialized_static = is_static && !klass->is_initialized();
  bool has_initialized_final_update = info.field_holder()->major_version() >= 53 &&
                                      info.has_initialized_final_update();
  Bytecodes::Code get_code = (Bytecodes::Code)0;
  Bytecodes::Code put_code = (Bytecodes::Code)0;
  if (!uninitialized_static) {
    get_code = ((is_static) ? Bytecodes::_getstatic : Bytecodes::_getfield);
    if ((is_put && !has_initialized_final_update) || !info.access_flags().is_final()) {
      put_code = ((is_static) ? Bytecodes::_putstatic : Bytecodes::_putfield);
    }
  }

  // 根据解析到的信息设置到ConstantPoolCacheEntry中
  cp_cache_entry->set_field(
    get_code,
    put_code,
    info.field_holder(),
    info.index(),
    info.offset(), /// 在解析class文件时，已经计算好了每个field的偏移值
    state,
    info.access_flags().is_final(),
    info.access_flags().is_volatile(),
    pool->pool_holder()
  );
}
```

#### invokevirtual

跟`getfield`指令类似，首选是确定操作数中指向的klass，之前没有加载过的话就先加载，加载好了存储到\_resolved\_klasses。然后根据方法的名称和签名，从对应的类中查找具体的方法。查找的顺序是首选从类自身查找，没有找到的话再从父类中查找。找到之后，根据一些规则确定该方法是否可以作为final方法进行调用，可以的话，则将该方法的地址设置到ConstantPoolCacheEntry的\_f2中。不能直接确定的话，则将方法的vtable_index记录到\_f2中，然后根据vtable_index从目标对象的vtable中取出实际的方法进行执行（即虚函数调用）。

```c++
/* src/hotspot/share/interpreter/interpreterRuntime.cpp */
// 支持invokevirutal、invokespecial、invokestatic、invokeinterface
void InterpreterRuntime::resolve_invoke(JavaThread* thread, Bytecodes::Code bytecode) {
  Thread* THREAD = thread;
  LastFrameAccessor last_frame(thread);
  Handle receiver(thread, NULL);
  if (bytecode == Bytecodes::_invokevirtual || bytecode == Bytecodes::_invokeinterface ||
      bytecode == Bytecodes::_invokespecial) {
    ResourceMark rm(thread);
    methodHandle m (thread, last_frame.method());
    Bytecode_invoke call(m, last_frame.bci());
    Symbol* signature = call.signature();
    /// 表示被调用方法的真实所有者，即this对象
    receiver = Handle(thread, last_frame.callee_receiver(signature));
  }

  CallInfo info;
  constantPoolHandle pool(thread, last_frame.method()->constants());

  methodHandle resolved_method;

  {
    JvmtiHideSingleStepping jhss(thread);
    LinkResolver::resolve_invoke(info, receiver, pool,
                                 last_frame.get_index_u2_cpcache(bytecode), bytecode,
                                 CHECK);
    if (JvmtiExport::can_hotswap_or_post_breakpoint() && info.resolved_method()->is_old()) {
      resolved_method = methodHandle(THREAD, info.resolved_method()->get_new_method());
    } else {
      resolved_method = methodHandle(THREAD, info.resolved_method());
    }
  }

  ConstantPoolCacheEntry* cp_cache_entry = last_frame.cache_entry();
  if (cp_cache_entry->is_resolved(bytecode)) return;

  InstanceKlass* sender = pool->pool_holder();
  sender = sender->is_unsafe_anonymous() ? sender->unsafe_anonymous_host() : sender;

  // 根据调用类型进行设置
  switch (info.call_kind()) {
  case CallInfo::direct_call:
    cp_cache_entry->set_direct_call(
      bytecode,
      resolved_method,
      sender->is_interface());
    break;
  case CallInfo::vtable_call:
    cp_cache_entry->set_vtable_call(
      bytecode,
      resolved_method,
      info.vtable_index());
    break;
  case CallInfo::itable_call:
    cp_cache_entry->set_itable_call(
      bytecode,
      info.resolved_klass(),
      resolved_method,
      info.itable_index());
    break;
  default:  ShouldNotReachHere();
  }
}

/* src/hotspot/share/oops/cpCache.cpp */
void ConstantPoolCacheEntry::set_direct_or_vtable_call(Bytecodes::Code invoke_code,
                                                       const methodHandle& method,
                                                       int vtable_index,
                                                       bool sender_is_interface) {
  bool is_vtable_call = (vtable_index >= 0);  // FIXME: split this method on this boolean

  int byte_no = -1;
  bool change_to_virtual = false;
  InstanceKlass* holder = NULL;  // have to declare this outside the switch
  switch (invoke_code) {
    ...
    case Bytecodes::_invokevirtual:
      {
        if (!is_vtable_call) {
          set_method_flags(as_TosState(method->result_type()),
                           (                             1      << is_vfinal_shift) |
                           ((method->is_final_method() ? 1 : 0) << is_final_shift)  |
                           ((change_to_virtual         ? 1 : 0) << is_forced_virtual_shift),
                           method()->size_of_parameters());
          set_f2_as_vfinal_method(method());
        } else {
          set_method_flags(as_TosState(method->result_type()),
                           ((change_to_virtual ? 1 : 0) << is_forced_virtual_shift),
                           method()->size_of_parameters());
          set_f2(vtable_index);
        }
        byte_no = 2;
        break;
      }
    ...
  }
  ...
}
```

#### ldc

注意在第二阶段，如果`ldc`加载的是引用类型数据，则会将操作符进一步改为`fast_aldc`。如果ConstantPoolCache的resovled_references中对应位置为NULL，说明还没有加载，需要调用`InterpreterRuntime::resolve_ldc`进行加载。以加载字符串为例：

```c++
oop ConstantPool::resolve_constant_at_impl(const constantPoolHandle& this_cp,
                                           int index, int cache_index,
                                           bool* status_return, TRAPS) {
  oop result_oop = NULL;
  Handle throw_exception;

  if (cache_index == _possible_index_sentinel) {
    cache_index = this_cp->cp_to_object_index(index);
  }
  if (cache_index >= 0) {
    result_oop = this_cp->resolved_references()->obj_at(cache_index);
    if (result_oop != NULL) {
      /// 已存在
      if (result_oop == Universe::the_null_sentinel()) {
        result_oop = NULL;
      }
      if (status_return != NULL)  (*status_return) = true;
      return result_oop;
    }
    index = this_cp->object_to_cp_index(cache_index);
  }

  jvalue prim_value;
  constantTag tag = this_cp->tag_at(index);
  ...
  switch (tag.value()) {
  ...
  case JVM_CONSTANT_String:
    if (this_cp->is_pseudo_string_at(index)) {
      result_oop = this_cp->pseudo_string_at(index, cache_index);
      break;
    }
    // 根据第一步创建的Symbol，调用StringTable::intern构建String实例，并存储到resolved_references中
    result_oop = string_at_impl(this_cp, index, cache_index, CHECK_NULL);
    break;
  }

  if (cache_index >= 0) {
    oop new_result = (result_oop == NULL ? Universe::the_null_sentinel() : result_oop);
    /// 存储加载好的内容
    oop old_result = this_cp->resolved_references()
      ->atomic_compare_exchange_oop(cache_index, new_result, NULL);
    if (old_result == NULL) {
      return result_oop;
    } else {
      if (old_result == Universe::the_null_sentinel())
        old_result = NULL;
      return old_result;
    }
  } else {
    return result_oop;
  }
}
```



至此，HelloWorld的整个运行时常量池的所有内容就都创建好了。

