---
title: 学习LLVM第1篇：官方入门教程
date: 2020-06-29 22:54:27
categories:
- llvm
tags:
- llvm
excerpt: 本文是我学习LLVM官方教程My First Language Frontend with LLVM Tutorial时的一些笔记。
---



官方教程地址：https://llvm.org/docs/tutorial/MyFirstLanguageFrontend/index.html


## 简介

这个教程介绍了如何使用LLVM来开发一门新的语言，主要包括手写的Lexer、Parser、以及如何将AST转化为LLVM IR、如何对转化后的IR进行JIT编译并执行、如何将IR编译为目标文件。

教程的第1～7章是一步步扩充Kaleidoscope语言的，从基本的功能，到JIT，再新增IF和FOR语句，再到用户可自定义的操作符，再到可重新赋值的变量。第8章讲解如何将IR编译为目标文件，并且跟其他语言的目标文件（比如C/C++）进行链接。第9章讲解了如何生存调试信息（主要就是源代码中各语句的位置信息），从而可以方便的进行调试。第10章做了总结，并且提出了很多可以继续开发的扩展点。

如果想直接看代码的话，可以只看第7、8、9三个章节的代码。1～6章节是一个迭代过程，在第7章都可以看到。



## 每个章节详解

下面对每一个章节进行细讲，主要是讲每个章节所做的事情，以及一些原理的重点介绍。

### 第1、2章

实现第一版不带控制流的Kaleidoscope语言的词法和语法解析部分，输出抽象语法树AST。

词法分析部分比较简单，直接一个个字符进行判断，生成对应的token。

语法解析部分使用了自顶向下的递归下降语法分析方法（[Recursive Descent Parsing](http://en.wikipedia.org/wiki/Recursive_descent_parser)），通过最多往前判断一个token进行语法的确认，简称LL(1)。这种方法一般会给每个产生式定义一个处理函数，通过判断当前的token所属类型确定属于哪一种语法，进而调用对应的处理函数。

不过在解析表达式语法的时候，因为要处理二元操作符的优先级，使用了自底向上的操作符优先级判断的语法分析方法（[Operator-Precedence Parsing](http://en.wikipedia.org/wiki/Operator-precedence_parser)）。具体的原理大概是这样子的，比如对于`a + b * c`表达式，`+`的优先级为10，`*`的优先级为20。在解析到`+`号时，会再去判断是否后面还有操作符及优先级，如果后面的优先级更高，则会先让后面的表达式先解析，然后在解析`+`号。具体到这个例子，`*`号的优先级比`+`号的高，所以在解析到`a + b`的时候，并不是先解析成表达式之后在继续解析后面的，而是继续判断后面的`*`号是否优先级更好。因为`*`号的优先级较高，所以会让`a +`先等着，先解析`b * c`，得到一个表达式后作为一个操作数，然后回来解析`a + expr`。

语言BNF定义如下：

```
Program 			-> FunDef | ExternFun | TopLevelExpr
FunDef 				-> "def" ident "(" FormalArgs ")" Expr ";"
ExternFun 		-> "extern" ident "(" FormalArgs ")" ";"
FormalArgs 		-> ε | ident | ident FormalArgs
TopLevelExpr  -> Expr ";"
Expr 					-> num | ident | ident "(" ActualArgs ")" 
              |  Expr Op Expr | "(" Expr ")"
Op 						-> "<" | "-" | "+" | "*"
ActualArgs 		-> ε | ident | ident "," ActualArgs
ident 				-> [a-zA-Z][a-zA-Z0-9]*
num 					-> [0-9.]+
comment 			-> "#" [^\n\r]*
```

示例代码：

```
extern sin(arg); # 外部函数
sin(1);

def f (a b c)
  a + (b * c);
add(1, 2, 3);
```



### 第3章

这一章介绍如何将前面生成的抽象语法树，转化为LLVM IR的表示。



## 遇到的问题

- 第4章节（其实还包括后面所有需要用到JIT功能的章节），编译时需要给`--libs`增加`orcjit`参数
  - 原来：`llvm-config --cxxflags --ldflags --system-libs --libs core mcjit native`
  - 改为：`llvm-config --cxxflags --ldflags --system-libs --libs core mcjit native orcjit` 
  - 或者直接改为`all`：`llvm-config --cxxflags --ldflags --system-libs --libs all`

