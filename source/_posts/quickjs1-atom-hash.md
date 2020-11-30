---
title: QuickJS源代码分析系列：QuickJS中的atom设计
date: 2020-11-28
categories:
- note
tags:
- js
- quickjs
excerpt: 本文介绍QuickJS源代码中的atom设计。
---

QuickJS源码中的atom（32位无符号整数）可以认为是字符串（覆盖的范围包括JS中的关键字、标识符、Symbol等）的别名。其中最高位为1的atom代表的是整数，为0代表字符串，所以atom可以表示的整数和字符串个数都是(2^31)-1个。引入atom的目的是为了减少内存使用（重复的字符串只存储一次）和提高字符串比较速度（在转换成atom之后，只需要比较两个atom的数值是否一致）。

其中内置了大概200多个常驻的atom（包括关键字、JS中常见的标识符、JS中内置的Symbol），在创建runtime的时候就被添加进去了，这些atom不会被清除。之后在解析JS代码过程中添加的atom，会根据引用计数进行清除。

字符串转换为atom的步骤如下（如果是Symbol，转化为atom就比较简单，只需要往`atom_array`添加并使用其index作为Symbol的atom值即可，并不涉及到`atom_hash`的添加）：

1. 根据字符串的ascii码和atom类型，按照一定规则计算出一个hash值`hash_index`（32位无符号整数）
2. 获取`atom_array`空闲位置`free_atom_index`，然后将字符串的指针添加进去（`atom_array[free_atom_index]=s`。如果`atom_array`空间不足，则还会涉及到`atom_array`的扩充，以3/2的倍数扩充，注意扩充前后已经存储的atom对应的`atom_index`保持不变）
3. 将原来`atom_hash`的`hash_index`位置对应的`atom_index`存放到`s.hash_next`中，再将其修改为`free_atom_index`（这一步如果atom的个数大于`atom_hash`可以存放的数量的两倍，则将`atom_hash`扩充到原来的2倍容量）
4. 将第二步添加到`atom_array`中的位置（`atom_index`）作为该字符串的atom值，在后续的程序中使用

接下来展示下上述内容在源代码中的具体展现：

首先涉及到的数据类型如下：

```c
/// atom类型
enum {
    JS_ATOM_TYPE_STRING = 1,
    JS_ATOM_TYPE_GLOBAL_SYMBOL,
    JS_ATOM_TYPE_SYMBOL,
    JS_ATOM_TYPE_PRIVATE, /// 代码中会将其跟SYMBOL类型一样的处理
};

enum {
    JS_ATOM_HASH_SYMBOL,
    JS_ATOM_HASH_PRIVATE,
};

/// 存储字符串的数据结构
struct JSString {
    JSRefCountHeader header;
    uint32_t len : 31;
    uint8_t is_wide_char : 1;
    uint32_t hash : 30; /// 计算出来的完整hash
    uint8_t atom_type : 2;
    uint32_t hash_next; /// 存放hash原来位置的atom_index，如果是SYMBOL或者PRIVATE，则固定为JS_ATOM_HASH_SYMBOL和JS_ATOM_HASH_PRIVATE
    union {
        uint8_t str8[0]; /// 存放ascii
        uint16_t str16[0];
    } u;
};

typedef uint32_t JSAtom;
typedef struct JSString JSAtomStruct;
struct JSRuntime {
    ...
    uint32_t *atom_hash; /// 存放hash表中的第一个元素
    JSAtomStruct **atom_array; /// 存放字符串指针的数组，目前只扩容不缩容
    ...
}

/// 可以直接使用的内置atom，对应的值跟atom_array所在的index保持一致
enum {
    __JS_ATOM_NULL = JS_ATOM_NULL, /// 0
    JS_ATOM_null,
    JS_ATOM_false,
    ...
    JS_ATOM_END,
};
```

将字符串添加到atom hash表中的代码如下：

```c
static JSAtom __JS_NewAtom(JSRuntime *rt, JSString *str, int atom_type)
{
    uint32_t h, h1, i;
    JSAtomStruct *p;
    int len;
    
    if (atom_type < JS_ATOM_TYPE_SYMBOL) {
        /// 处理string和global symbol类型的字符串，相同字符串的atom是一致的
        /// atom_type：JS_ATOM_TYPE_STRING、JS_ATOM_TYPE_GLOBAL_SYMBOL
        ....
        /* try and locate an already registered atom */
        len = str->len;
        /// 计算hash
        h = hash_string(str, atom_type);
        h &= JS_ATOM_HASH_MASK;
        /// h1用于保证作为索引在当前的hash_size范围内
        h1 = h & (rt->atom_hash_size - 1);
        i = rt->atom_hash[h1];
        /// 检查是否已经存在该atom
        while (i != 0) {
            p = rt->atom_array[i];
            if (p->hash == h &&
                p->atom_type == atom_type &&
                p->len == len &&
                js_string_memcmp(p, str, len) == 0) {
                if (!__JS_AtomIsConst(i))
                    p->header.ref_count++;
                goto done;
            }
            i = p->hash_next;
        }
    } else {
        /// 处理 JS_ATOM_TYPE_SYMBOL 和 JS_ATOM_HASH_PRIVATE 类型的字符串
        /// 这一类字符串，不管是否同名，都是不同的atom
        h1 = 0; /* avoid warning */
        if (atom_type == JS_ATOM_TYPE_SYMBOL) {
            h = JS_ATOM_HASH_SYMBOL;
        } else {
            h = JS_ATOM_HASH_PRIVATE;
            atom_type = JS_ATOM_TYPE_SYMBOL; ///!!! 注意这里将PRIVATE修改为了SYMBOL类型
        }
    }

    /// 如果没有更多空间存放atom，则扩充
    if (rt->atom_free_index == 0) {
        uint32_t new_size, start;
        JSAtomStruct **new_array;
        new_size = max_int(211, rt->atom_size * 3 / 2);
        if (new_size > JS_ATOM_MAX)
            goto fail;
        new_array = js_realloc_rt(rt, rt->atom_array, sizeof(*new_array) * new_size);
        if (!new_array)
            goto fail;
        start = rt->atom_size;
        if (start == 0) {
            /* JS_ATOM_NULL entry */
            p = js_mallocz_rt(rt, sizeof(JSAtomStruct));
            if (!p) {
                js_free_rt(rt, new_array);
                goto fail;
            }
            p->header.ref_count = 1;  /* not refcounted */
            p->atom_type = JS_ATOM_TYPE_SYMBOL;
            new_array[0] = p;
            rt->atom_count++;
            start = 1;
        }
        rt->atom_size = new_size;
        rt->atom_array = new_array;
        rt->atom_free_index = start;
        for(i = start; i < new_size; i++) {
            uint32_t next;
            if (i == (new_size - 1))
                next = 0;
            else
                next = i + 1;
            /// 给atom_array中空闲的位置设置next（高31位）和is_free（最低位）标志
            rt->atom_array[i] = atom_set_free(next);
        }
    }

    if (str) {
        if (str->atom_type == 0) {
            /// 未被使用的str，直接使用
            p = str;
            p->atom_type = atom_type;
        } else {
            p = js_malloc_rt(rt, sizeof(JSString) +
                             (str->len << str->is_wide_char) +
                             1 - str->is_wide_char);
            if (unlikely(!p))
                goto fail;
            p->header.ref_count = 1;
            p->is_wide_char = str->is_wide_char;
            p->len = str->len;
            memcpy(p->u.str8, str->u.str8, (str->len << str->is_wide_char) +
                   1 - str->is_wide_char);
            js_free_string(rt, str);
        }
    } else {
        p = js_malloc_rt(rt, sizeof(JSAtomStruct)); /* empty wide string */
        if (!p)
            return JS_ATOM_NULL;
        p->header.ref_count = 1;
        p->is_wide_char = 1;    /* Hack to represent NULL as a JSString */
        p->len = 0;
    }

    /// 将字符串添加到atom_array中去
    i = rt->atom_free_index;
    rt->atom_free_index = atom_get_free(rt->atom_array[i]);
    rt->atom_array[i] = p;

    p->hash = h;
    p->hash_next = i;   /* atom_index，对symbol类型的atom有效 */
    p->atom_type = atom_type;

    rt->atom_count++;

    if (atom_type != JS_ATOM_TYPE_SYMBOL) {
        /// 将原来在h1处的atom index替换为p，并且设置p的hash_next为原来的atom index，形成链表
        p->hash_next = rt->atom_hash[h1];
        rt->atom_hash[h1] = i;
        if (unlikely(rt->atom_count >= rt->atom_count_resize))
            /// atom_hash空间不足，进行扩充
            JS_ResizeAtomHash(rt, rt->atom_hash_size * 2);
    }

    return i;

 fail:
    i = JS_ATOM_NULL;
 done:
    if (str)
        js_free_string(rt, str);
    return i;
}
```

移除atom的代码如下，注意对于`atom_type`为SYMBOL的atom，只需将其从atom_array中移除即可：

```c
static void JS_FreeAtomStruct(JSRuntime *rt, JSAtomStruct *p)
{
    uint32_t i = p->hash_next;  /* atom_index */
    if (p->atom_type != JS_ATOM_TYPE_SYMBOL) {
        /// 这里只需处理string、global symbol两种类型的atom
        JSAtomStruct *p0, *p1;
        uint32_t h0;

        /// 从链表中移除p
        h0 = p->hash & (rt->atom_hash_size - 1);
        i = rt->atom_hash[h0];
        p1 = rt->atom_array[i];
        if (p1 == p) {
            rt->atom_hash[h0] = p1->hash_next;
        } else {
            for(;;) {
                assert(i != 0);
                p0 = p1;
                i = p1->hash_next;
                p1 = rt->atom_array[i];
                if (p1 == p) {
                    p0->hash_next = p1->hash_next;
                    break;
                }
            }
        }
    }
    /* insert in free atom list */
    /// 将p在atom_array中的位置标记为空闲，新atom可以添加到该位置
    rt->atom_array[i] = atom_set_free(rt->atom_free_index);
    rt->atom_free_index = i;
    /* free the string structure */
    js_free_rt(rt, p);
    rt->atom_count--;
    assert(rt->atom_count >= 0);
}
```

在将字符串转化为atom的过程中，形成了如下图1的结构：

![](/images/quickjs/atom-pass1.png)

当添加到`"while"`字符串时，出现了hash碰撞，跟`"null"`的hash一致，于是形成了链表结构：

![](/images/quickjs/atom-pass2.png)

以上是QuickJS中的atom设计，通过将字符串转化为`atom_array`中的index值，来达到节省内存和提高比较效率的目的。


