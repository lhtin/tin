---
title: QuickJS源码分析系列：QuickJS中的垃圾回收器
date: 2020-11-30
categories:
- note
tags:
- js
- quickjs
excerpt: 本文介绍QuickJS源代码中的垃圾回收器。
---

在QuickJS中，内存的回收是使用的引用计数方法。大致的思路是维护数据的引用次数，需要使用某个数据的时候，给引用次数加1，用完了给引用计数减1，然后判断数据的引用计数是否为0，如果为0，说明没有地方会在使用到该数据了，对应的内存可以回收掉。

上述的方法，在存在数据之间的循环引用情况下，数据是没有办法被回收掉的。这时需要做一些特殊处理，比如QuickJS中

在QuickJS中，有以下几种需要被垃圾回收的数据：

```c 
typedef enum {
    JS_GC_OBJ_TYPE_JS_OBJECT, /// JS对象
    JS_GC_OBJ_TYPE_FUNCTION_BYTECODE, /// 函数对象
    JS_GC_OBJ_TYPE_SHAPE, /// JS对象对应的Shape
    JS_GC_OBJ_TYPE_VAR_REF, ///
    JS_GC_OBJ_TYPE_ASYNC_FUNCTION, /// 异步函数
    JS_GC_OBJ_TYPE_JS_CONTEXT, /// JS Context
} JSGCObjectTypeEnum;
```
