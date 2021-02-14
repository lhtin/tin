---
title: HotSpot中的Java类和对象
date: 2021-02-09
categories:
- note
tags:
- java
- openjdk
excerpt: 本文记录Java类和对象在HotSpot中的实现方式。
---

本文记录Java类和对象在HotSpot中的实现方式。

### Klass和oop

在HotSpot中，Java类使用Klass对象表示，Java对象使用oop（普通对象指针）对象表示。不过oop只存储Java对象的实例字段，实例方法还是存放在Klass对象中。根据源代码中的注释说明，如果将实例方法存放在Klass对象上，oop对象可以省去指向实例方法表（可以理解为C++中的虚函数表）的指针。不过可以这样做是因为oop对象头中持有了指向对应Klass对象的指针，所以当需要调用实例方法时，可以通过这个指针找到Klass对象，进而找到实例方法进行调用。

在HotSpot加载和解析类文件后，会创建InstanceKlass实例，紧接着实例的内存存放了vtable（虚函数表）和itable（接口和接口方法表）等信息。

Klass及其子类的继承关系如下面的代码所示。其中InstanceKlass实例为普通Java类的C++表示，InstanceMirrorKlass实例为java.lang.Class类的C++表示（因此InstanceMirrorKlass实例只有一个）。在HotSpot中，Java类的静态字段也使用oop对象表示（每个Java类只有一个，存储在InstanceKlass实例的_java_mirror字段），不过并不是由对应的InstanceKlass实例创建，而是由唯一的InstanceMirrorKlass实例根据传入的InstanceKlass实例来创建。_java_mirror是在InstanceKlass实例生成过程中创建的，这也说明静态字段跟实例字段一样，存储在Java堆中。

```cpp
 /* src/hotspot/share/oops/oopsHierarchy.hpp */
 class Klass;
 class   InstanceKlass;              // 普通Java类，有其生成的oop对象存储了类中的实例字段
 class     InstanceMirrorKlass;      // java.lang.Class类，除了Class类自身的实例字段，由其生成的oop还存储了对应Java类中的静态字段
 class     InstanceClassLoaderKlass; // 类加载器类
 class     InstanceRefKlass;         // 引用类
 class   ArrayKlass;
 class     ObjArrayKlass;
 class     TypeArrayKlass;
```

具体实现如下：

```cpp
 /* src/hotspot/share/oops/klass.hpp */
 class Klass {
   jint        _layout_helper; // 包含oop header和实例字段的长度，创建对应的oop时需要
   int         _vtable_len;    // 实例方法长度
   OopHandle   _java_mirror;   // 类对象的Class类实例
   Klass*      _super;         // 父类
   
   klassVtable vtable() const; // 虚函数表
 }
 
 /* src/hotspot/share/oops/instanceKlass.hpp */
 class InstanceKlass: public Klass {
   int             _nonstatic_field_size;  // 实例字段的长度
   int             _static_field_size;     // 静态字段的长度，生产mirror时用到
   int             _itable_len;            // 实现的接口个数
   Array<u2>*      _fields;                // 实例和静态字段信息，包括偏移值
   Array<Method*>* _methods;               // 实例和静态方法信息，有解释执行和编译执行的入口
	 Array<Method*>* _default_methods;       // 类所实现的接口中的默认实现方法
   
   // 根据类型分配InstanceKlass或者他的子类
   static InstanceKlass* allocate_instance_klass(const ClassFileParser& parser, TRAPS);
   // 生成类的实例对象oop，包含实例字段在内
   instanceOop allocate_instance(TRAPS);
   bool link_class_impl(TRAPS);  // 方法链接，包括方法链接（确定解释器入口和编译器入口），接口列表的初始化
   klassItable itable() const;   // 接口和其方法表
   // 紧接着存放类的实例方法列表（虚函数表，vtable）
   // 紧接着存放类的接口和接口方法列表（itable）
   // ...（还有其他信息，省略）
 }
 
 /* src/hotspot/share/oops/instanceMirrorKlass.hpp */
 class InstanceMirrorKlass: public InstanceKlass {
   static int _offset_of_static_fields;  // 静态字段在oop对象中的偏移量
   // 生产类对应的java.lang.Class类的实例oop对象
   // 相比InstanceKlass的allocate_instance，会把普通类的静态字段考虑进来
   instanceOop allocate_instance(Klass* k, TRAPS);
 }
```

当需要创建Java对象时，会调用InstanceKlass的allocate_instance方法生成instanceOop对象。注意各oop只是一个指向对应oopDesc对象的指针，不过为了保持前后描述的一致，当说到oop对象或实例时，其实是指对应的oopDesc实例。各oop之间的继承关系如下：

```cpp
 /* src/hotspot/share/oops/oopsHierarchy.hpp */
 typedef class oopDesc*                    oop;
 typedef class   instanceOopDesc*            instanceOop;
 typedef class   arrayOopDesc*               arrayOop;
 typedef class     objArrayOopDesc*            objArrayOop;
 typedef class     typeArrayOopDesc*           typeArrayOop;
```

oop实例本身只存储了两个字段。一个是_mark字段，用于存储各种信息，比如GC标记、锁标记等，可以根据需要使用。另一个是_metadata字段，存储指向InstanceKlass实例的指针。各oop的实现如下：

```cpp
 /* src/hotspot/share/oops/oop.hpp */
 class oopDesc {
  private:
   volatile markWord _mark;
   union _metadata {
     Klass*      _klass;
     narrowKlass _compressed_klass; // 压缩版本
   } _metadata;
   // 紧接着存放Java对象的实例字段
   // 紧接着存放Java类的静态字段（注意只有java.lang.Class类的实例才有这部分内容，也就是Klass中的_java_mirror字段）
 }
 
 /* src/hotspot/share/oops/instanceOop.hpp */
 class instanceOopDesc : public oopDesc {}
```

不管是Klass实例还是oop实例，紧跟着实例内存后面还会多出来一些东西，比如Klass实例中的虚函数表、接口表，oop实例中的实例字段、静态字段。

### vtable和itable

vtable的作用在于根据实例对象寻找所调用的函数，用于实现多态性。如下面的Java代码，虽然c被声明为Parent类变量，但是实例化的时候是使用的Child类，所以在调用f方法时，实际调用的是Child的。为了实现这个逻辑，在创建Klass对象时，会同时创建vtable，里面存储了所有虚方法（包括从父类继承过来的方法）。然后在调用实例的方法时，可以根据虚方法的索引，在oop对象对应的Klass对象的vtable中寻找。这个逻辑可以在下文的`invokevirtual`执行逻辑中看到。

```java
class Parent {
	public void f() {}
}

class Child extends Parent {
	public void f() {}
}

Parent c = new Child();
c.f();
```

而itable是为了实现Java中的接口功能，主要用于检查类是否有实现接口中要求的抽象方法，检查逻辑可以在下文的`invokeinterface`执行逻辑中看到。

```java
interface A {
	void f();
}
class B implements A {
	void f() {}
}

A b = new B();
b.f();
```

Klass对象、vatble和itable的内存布局如下：

![](/images/java-object-in-hotspot.png)

### **相关字节码执行逻辑**

了解了Java类和对象在HotSpot中的表示后，再来看下HotSpot对`new`、`getstatic`、`putstatic`、`getfield`、`putfield`、`invokevirtual`、`invokespecial`、`invokestatic`、`invokeinterface`这些字节码的解释执行过程。阅读代码的入口可以从`src/hotspot/share/interpreter/zero/bytecodeInterpreter.cpp`文件开始，在字节码前面加上下划线就可以在这里面搜索到对应的case语句。

注意讲解的字节码的执行逻辑是用的Zero字节码解释器，而不是模版解释器或者C1/C2即时编译器。

- `new index`

    创建一个实例，调用的InstanceKlass实例的allocate_instance方法。该方法会在堆中申请一片内存，用于存放oop头部和实例字段。

    ```cpp
    /* src/hotspot/share/interpreter/zero/bytecodeInterpreter.cpp */
     void BytecodeInterpreter::run(interpreterState istate) {
       ...
           switch (opcode)
           {
           ...
           CASE(_new): {
             // 获取new指令的操作数index
             u2 index = Bytes::get_Java_u2(pc+1);
             ConstantPool* constants = istate->method()->constants();
             // 1. 可以的话从TLAB中快速分配
             if (!constants->tag_at(index).is_unresolved_klass()) {
               Klass* entry = constants->resolved_klass_at(index);
               InstanceKlass* ik = InstanceKlass::cast(entry);
               if (ik->is_initialized() && ik->can_be_fastpath_allocated() ) {
                 size_t obj_size = ik->size_helper();
                 oop result = NULL;
                 if (UseTLAB) {
                   result = (oop) THREAD->tlab().allocate(obj_size);
                 }
                 if (result != NULL) {
                   // Initialize object (if nonzero size and need) and then the header.
                   // If the TLAB isn't pre-zeroed then we'll have to do it.
                   if (!ZeroTLAB) {
                     HeapWord* to_zero = cast_from_oop<HeapWord*>(result) + sizeof(oopDesc) / oopSize;
                     obj_size -= sizeof(oopDesc) / oopSize;
                     if (obj_size > 0 ) {
                       memset(to_zero, 0, obj_size * HeapWordSize);
                     }
                   }
                   assert(!UseBiasedLocking, "Not implemented");
                   result->set_mark(markWord::prototype());
                   result->set_klass_gap(0);
                   result->set_klass(ik);
                   // Must prevent reordering of stores for object initialization
                   // with stores that publish the new object.
                   OrderAccess::storestore();
                   SET_STACK_OBJECT(result, 0);
                   UPDATE_PC_AND_TOS_AND_CONTINUE(3, 1);
                 }
               }
             }
             // 2. 慢分配才用到了InstanceKlass::allocate_instance方法
             CALL_VM(InterpreterRuntime::_new(THREAD, METHOD->constants(), index),
                     handle_exception);
             // 防止指令重排
             OrderAccess::storestore();
             // 将分配的对象push到栈上
             SET_STACK_OBJECT(THREAD->vm_result(), 0);
             THREAD->set_vm_result(NULL);
    					// 
             UPDATE_PC_AND_TOS_AND_CONTINUE(3, 1);
           }
           ...
           }
       ...
     }
    ```

- `getstatic index`、`getfield index`

    先根据index确定对应的oop对象（实例字段和静态字段有区别），以及字段在oop中的偏移量，确定之后根据类型将对应的值复制到栈顶。

    ```cpp
    /* src/hotspot/share/interpreter/zero/bytecodeInterpreter.cpp */
          CASE(_getfield):
          CASE(_getstatic):
            {
              u2 index;
              ConstantPoolCacheEntry* cache;
              index = Bytes::get_native_u2(pc+1);

              cache = cp->entry_at(index);
              if (!cache->is_resolved((Bytecodes::Code)opcode)) {
                /// 解析字节码和操作数，比如将class字符确定为对象的klass对象，将字段名称解析为oop中的索引
                CALL_VM(InterpreterRuntime::resolve_from_cache(THREAD, (Bytecodes::Code)opcode),
                        handle_exception);
                cache = cp->entry_at(index);
              }

              oop obj;
              if ((Bytecodes::Code)opcode == Bytecodes::_getstatic) {
                /// 如果是静态字段，则取出class部分
                Klass* k = cache->f1_as_klass();
                /// 静态字段从_java_mirror中去
                obj = k->java_mirror();
                /// 目的是为了将后面取出的字段值存放在栈顶
                MORE_STACK(1);  // Assume single slot push
              } else {
                obj = (oop) STACK_OBJECT(-1); /// 后续会将该位置覆盖为实例字段值
                CHECK_NULL(obj);
              }

              //
              // Now store the result on the stack
              //
              TosState tos_type = cache->flag_state();
              // 取出字段相对oop对象偏移量
              int field_offset = cache->f2_as_index();
              if (cache->is_volatile()) {
                if (support_IRIW_for_not_multiple_copy_atomic_cpu) {
                  OrderAccess::fence();
                }
                if (tos_type == atos) {
                  VERIFY_OOP(obj->obj_field_acquire(field_offset));
                  SET_STACK_OBJECT(obj->obj_field_acquire(field_offset), -1);
                } else if (tos_type == itos) {
                  SET_STACK_INT(obj->int_field_acquire(field_offset), -1);
                } else if (tos_type == ltos) {
                  SET_STACK_LONG(obj->long_field_acquire(field_offset), 0);
                  /// long类型和下面的double类型占用两个slot
                  MORE_STACK(1);
                } else if (tos_type == btos || tos_type == ztos) {
                  SET_STACK_INT(obj->byte_field_acquire(field_offset), -1);
                } else if (tos_type == ctos) {
                  SET_STACK_INT(obj->char_field_acquire(field_offset), -1);
                } else if (tos_type == stos) {
                  SET_STACK_INT(obj->short_field_acquire(field_offset), -1);
                } else if (tos_type == ftos) {
                  SET_STACK_FLOAT(obj->float_field_acquire(field_offset), -1);
                } else {
                  SET_STACK_DOUBLE(obj->double_field_acquire(field_offset), 0);
                  MORE_STACK(1);
                }
              } else {
                if (tos_type == atos) {
                  VERIFY_OOP(obj->obj_field(field_offset));
                  SET_STACK_OBJECT(obj->obj_field(field_offset), -1);
                } else if (tos_type == itos) {
                  SET_STACK_INT(obj->int_field(field_offset), -1);
                } else if (tos_type == ltos) {
                  SET_STACK_LONG(obj->long_field(field_offset), 0);
                  MORE_STACK(1);
                } else if (tos_type == btos || tos_type == ztos) {
                  SET_STACK_INT(obj->byte_field(field_offset), -1);
                } else if (tos_type == ctos) {
                  SET_STACK_INT(obj->char_field(field_offset), -1);
                } else if (tos_type == stos) {
                  SET_STACK_INT(obj->short_field(field_offset), -1);
                } else if (tos_type == ftos) {
                  SET_STACK_FLOAT(obj->float_field(field_offset), -1);
                } else {
                  SET_STACK_DOUBLE(obj->double_field(field_offset), 0);
                  MORE_STACK(1);
                }
              }

              UPDATE_PC_AND_CONTINUE(3);
             }
    ```

- `putstatic index`**、**`putfield index`

    先根据index确定对应的oop对象（实例字段和静态字段有区别），以及字段在oop中的偏移量，确定之后根据类型将对应栈上的值存储到oop中。

    ```cpp
    /* src/hotspot/share/interpreter/zero/bytecodeInterpreter.cpp */
          CASE(_putfield):
          CASE(_putstatic):
            {
              u2 index = Bytes::get_native_u2(pc+1);
              ConstantPoolCacheEntry* cache = cp->entry_at(index);
              if (!cache->is_resolved((Bytecodes::Code)opcode)) {
                CALL_VM(InterpreterRuntime::resolve_from_cache(THREAD, (Bytecodes::Code)opcode),
                        handle_exception);
                cache = cp->entry_at(index);
              }

              oop obj;
              int count;
              TosState tos_type = cache->flag_state();

              count = -1;
              if (tos_type == ltos || tos_type == dtos) {
                --count;
              }
              if ((Bytecodes::Code)opcode == Bytecodes::_putstatic) {
                Klass* k = cache->f1_as_klass();
                obj = k->java_mirror();
              } else {
                --count;
                obj = (oop) STACK_OBJECT(count);
                CHECK_NULL(obj);
              }

              //
              // Now store the result
              //
              int field_offset = cache->f2_as_index();
              if (cache->is_volatile()) {
                if (tos_type == itos) {
                  obj->release_int_field_put(field_offset, STACK_INT(-1));
                } else if (tos_type == atos) {
                  VERIFY_OOP(STACK_OBJECT(-1));
                  obj->release_obj_field_put(field_offset, STACK_OBJECT(-1));
                } else if (tos_type == btos) {
                  obj->release_byte_field_put(field_offset, STACK_INT(-1));
                } else if (tos_type == ztos) {
                  int bool_field = STACK_INT(-1);  // only store LSB
                  obj->release_byte_field_put(field_offset, (bool_field & 1));
                } else if (tos_type == ltos) {
                  obj->release_long_field_put(field_offset, STACK_LONG(-1));
                } else if (tos_type == ctos) {
                  obj->release_char_field_put(field_offset, STACK_INT(-1));
                } else if (tos_type == stos) {
                  obj->release_short_field_put(field_offset, STACK_INT(-1));
                } else if (tos_type == ftos) {
                  obj->release_float_field_put(field_offset, STACK_FLOAT(-1));
                } else {
                  obj->release_double_field_put(field_offset, STACK_DOUBLE(-1));
                }
                OrderAccess::storeload();
              } else {
                if (tos_type == itos) {
                  obj->int_field_put(field_offset, STACK_INT(-1));
                } else if (tos_type == atos) {
                  VERIFY_OOP(STACK_OBJECT(-1));
                  obj->obj_field_put(field_offset, STACK_OBJECT(-1));
                } else if (tos_type == btos) {
                  obj->byte_field_put(field_offset, STACK_INT(-1));
                } else if (tos_type == ztos) {
                  int bool_field = STACK_INT(-1);  // only store LSB
                  obj->byte_field_put(field_offset, (bool_field & 1));
                } else if (tos_type == ltos) {
                  obj->long_field_put(field_offset, STACK_LONG(-1));
                } else if (tos_type == ctos) {
                  obj->char_field_put(field_offset, STACK_INT(-1));
                } else if (tos_type == stos) {
                  obj->short_field_put(field_offset, STACK_INT(-1));
                } else if (tos_type == ftos) {
                  obj->float_field_put(field_offset, STACK_FLOAT(-1));
                } else {
                  obj->double_field_put(field_offset, STACK_DOUBLE(-1));
                }
              }

              UPDATE_PC_AND_TOS_AND_CONTINUE(3, count);
            }
    ```

- `invokestatic index`、`invokevirtual index`、`invokespecial index`

    首先执行一个方法是从ZeroInterpreter.main_loop中的while无限循环开始，在循环里面会调用BytecodeInterpreter.run，依次执行每一条字节码。当执行到调用方法的字节码后，首先先确定需要调用的方法，然后设置当前执行栈的msg为call_method并返回到main_loop。在main_loop中发现msg为call_method之后，就去调用需要调用的那个方法，调用完成之后设置msg为method_resume，然后循环回去继续调用run方法接着执行后面的字节码。

    ```cpp
    /* src/hotspot/cpu/zero/zeroInterpreter_zero.cpp */
      while (true) {
        // We can set up the frame anchor with everything we want at
        // this point as we are thread_in_Java and no safepoints can
        // occur until we go to vm mode.  We do have to clear flags
        // on return from vm but that is it.
        thread->set_last_Java_frame();

        // Call the interpreter
        if (JvmtiExport::can_post_interpreter_events()) {
          BytecodeInterpreter::run<true>(istate);
        } else {
          BytecodeInterpreter::run<false>(istate);
        }
        fixup_after_potential_safepoint();

        // Clear the frame anchor
        thread->reset_last_Java_frame();

        // Examine the message from the interpreter to decide what to do
        if (istate->msg() == BytecodeInterpreter::call_method) {
          Method* callee = istate->callee();

          // Trim back the stack to put the parameters at the top
          stack->set_sp(istate->stack() + 1);

          // Make the call
          Interpreter::invoke_method(callee, istate->callee_entry_point(), THREAD);
          fixup_after_potential_safepoint();

          // Convert the result
          istate->set_stack(stack->sp() - 1);

          // Restore the stack
          stack->set_sp(istate->stack_limit() + 1);

          // Resume the interpreter
          istate->set_msg(BytecodeInterpreter::method_resume);
        } else ...
      }
    ```

    ```cpp
    /* src/hotspot/share/interpreter/zero/bytecodeInterpreter.cpp */
          CASE(_invokevirtual):
          CASE(_invokespecial):
          CASE(_invokestatic): {
            u2 index = Bytes::get_native_u2(pc+1);

            ConstantPoolCacheEntry* cache = cp->entry_at(index);
            if (!cache->is_resolved((Bytecodes::Code)opcode)) {
              CALL_VM(InterpreterRuntime::resolve_from_cache(THREAD, (Bytecodes::Code)opcode),
                      handle_exception);
              cache = cp->entry_at(index);
            }

            /// 设置下一步处理的消息类型
            istate->set_msg(call_method);
            {
              Method* callee;
              if ((Bytecodes::Code)opcode == Bytecodes::_invokevirtual) {
                /// 如果是实例方法调用，需要查虚函数表
                CHECK_NULL(STACK_OBJECT(-(cache->parameter_size())));
                if (cache->is_vfinal()) {
                  callee = cache->f2_as_vfinal_method();
                } else {
                  int parms = cache->parameter_size();
                  oop rcvr = STACK_OBJECT(-parms);
                  VERIFY_OOP(rcvr);
                  Klass* rcvrKlass = rcvr->klass();
                  callee = (Method*) rcvrKlass->method_at_vtable(cache->f2_as_index());
                }
              } else {
                if ((Bytecodes::Code)opcode == Bytecodes::_invokespecial) {
                  CHECK_NULL(STACK_OBJECT(-(cache->parameter_size())));
                }
                callee = cache->f1_as_method();
              }

              istate->set_callee(callee);
              istate->set_callee_entry_point(callee->from_interpreted_entry());
              if (JVMTI_ENABLED && THREAD->is_interp_only_mode()) {
                istate->set_callee_entry_point(callee->interpreter_entry());
              }
              istate->set_bcp_advance(3);
              /// 退出run方法，进入main_loop然后判断msg，为call_method则去执行对应的方法
              UPDATE_PC_AND_RETURN(0); // I'll be back...
            }
          }
    ```

- `invokeinterface index`

    接口方法的调用稍微复杂些，现需要找到方法所在的接口表，然后找到接口对应的方法入口，再根据方法索引找到对应的方法执行入口。接口相关的数据在两个阶段进行了初始化，首先在创建InstanceKlass阶段，会对itable的接口表部分进行初始化，将类实现的所有接口都存储在这里。然后在类链接阶段，将itable中每个接口对应的方法表给初始化。

    ```cpp
          CASE(_invokeinterface): {
            u2 index = Bytes::get_native_u2(pc+1);

            // QQQ Need to make this as inlined as possible. Probably need to split all the bytecode cases
            // out so c++ compiler has a chance for constant prop to fold everything possible away.

            ConstantPoolCacheEntry* cache = cp->entry_at(index);
            if (!cache->is_resolved((Bytecodes::Code)opcode)) {
              CALL_VM(InterpreterRuntime::resolve_from_cache(THREAD, (Bytecodes::Code)opcode),
                      handle_exception);
              cache = cp->entry_at(index);
            }

            istate->set_msg(call_method);

            // Special case of invokeinterface called for virtual method of
            // java.lang.Object.  See cpCache.cpp for details.
            Method* callee = NULL;
            if (cache->is_forced_virtual()) {
              CHECK_NULL(STACK_OBJECT(-(cache->parameter_size())));
              if (cache->is_vfinal()) {
                callee = cache->f2_as_vfinal_method();
              } else {
                // Get receiver.
                int parms = cache->parameter_size();
                // Same comments as invokevirtual apply here.
                oop rcvr = STACK_OBJECT(-parms);
                VERIFY_OOP(rcvr);
                Klass* rcvrKlass = rcvr->klass();
                callee = (Method*) rcvrKlass->method_at_vtable(cache->f2_as_index());
              }
            } else if (cache->is_vfinal()) {
              // private interface method invocations
              //
              // Ensure receiver class actually implements
              // the resolved interface class. The link resolver
              // does this, but only for the first time this
              // interface is being called.
              int parms = cache->parameter_size();
              oop rcvr = STACK_OBJECT(-parms);
              CHECK_NULL(rcvr);
              Klass* recv_klass = rcvr->klass();
              Klass* resolved_klass = cache->f1_as_klass();
              if (!recv_klass->is_subtype_of(resolved_klass)) {
                ResourceMark rm(THREAD);
                char buf[200];
                jio_snprintf(buf, sizeof(buf), "Class %s does not implement the requested interface %s",
                  recv_klass->external_name(),
                  resolved_klass->external_name());
                VM_JAVA_ERROR(vmSymbols::java_lang_IncompatibleClassChangeError(), buf);
              }
              callee = cache->f2_as_vfinal_method();
            }
            if (callee != NULL) {
              istate->set_callee(callee);
              istate->set_callee_entry_point(callee->from_interpreted_entry());
              if (JVMTI_ENABLED && THREAD->is_interp_only_mode()) {
                istate->set_callee_entry_point(callee->interpreter_entry());
              }
              istate->set_bcp_advance(5);
              UPDATE_PC_AND_RETURN(0); // I'll be back...
            }

            // this could definitely be cleaned up QQQ
            Method *interface_method = cache->f2_as_interface_method();
            /// 方法所在的接口
            InstanceKlass* iclass = interface_method->method_holder();

            // get receiver
            int parms = cache->parameter_size();
            oop rcvr = STACK_OBJECT(-parms);
            CHECK_NULL(rcvr);
            /// 实例对象对应的Klass
            InstanceKlass* int2 = (InstanceKlass*) rcvr->klass();

            // Receiver subtype check against resolved interface klass (REFC).
            {
              /// 检查声明变量所使用的接口类型是否被类实现了
              Klass* refc = cache->f1_as_klass();
              itableOffsetEntry* scan;
              for (scan = (itableOffsetEntry*) int2->start_of_itable();
                   scan->interface_klass() != NULL;
                   scan++) {
                if (scan->interface_klass() == refc) {
                  break;
                }
              }
              // Check that the entry is non-null.  A null entry means
              // that the receiver class doesn't implement the
              // interface, and wasn't the same as when the caller was
              // compiled.
              if (scan->interface_klass() == NULL) {
                VM_JAVA_ERROR(vmSymbols::java_lang_IncompatibleClassChangeError(), "");
              }
            }

            /// 寻找到方法所在接口的itable
            itableOffsetEntry* ki = (itableOffsetEntry*) int2->start_of_itable();
            int i;
            for ( i = 0 ; i < int2->itable_length() ; i++, ki++ ) {
              if (ki->interface_klass() == iclass) break;
            }
            // If the interface isn't found, this class doesn't implement this
            // interface. The link resolver checks this but only for the first
            // time this interface is called.
            if (i == int2->itable_length()) {
              CALL_VM(InterpreterRuntime::throw_IncompatibleClassChangeErrorVerbose(THREAD, rcvr->klass(), iclass),
                      handle_exception);
            }
            int mindex = interface_method->itable_index();

            /// 获取接口下的method表
            itableMethodEntry* im = ki->first_method_entry(rcvr->klass());
            callee = im[mindex].method();
            if (callee == NULL) {
              CALL_VM(InterpreterRuntime::throw_AbstractMethodErrorVerbose(THREAD, rcvr->klass(), interface_method),
                      handle_exception);
            }

            istate->set_callee(callee);
            istate->set_callee_entry_point(callee->from_interpreted_entry());
            if (JVMTI_ENABLED && THREAD->is_interp_only_mode()) {
              istate->set_callee_entry_point(callee->interpreter_entry());
            }
            istate->set_bcp_advance(5);
            UPDATE_PC_AND_RETURN(0); // I'll be back...
          }
    ```
