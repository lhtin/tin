---
title: Nand2Tetris Part 2 课程总结
date: 2020/12/13
tag:
- nand2tetris
category:
- note
excerpt: 按：本文记录我在学习完Coursera上的 Nand2Tetris Part 2 课程之后的总结与思考。
---

距上次完成 [Nand2Tetris Part 1](https://tin.js.org/2020/07/17/nand2tetris-1/) 课程4个多月之后，最近终于把 [Part 2](https://www.coursera.org/learn/nand2tetris2) 也完成了，拿到证书。这次就没有上次那么顺利了，完成整个课程的6个项目的时间跨度为4个多月，而花在项目上面的时间肯定比课程1多得多。

其中Project9是启动最晚，耗时最长的项目。该项目我计划是实现一个俄罗斯方块，并且尽可能遵守 2009 Tetris Design Guideline。我分成两个步骤来完成，首先使用JS实现这个游戏，然后在使用Jack照着相同的逻辑实现一边。在使用JS开始发，将渲染部分做的尽可能独立，这样在迁移的时候，其他逻辑基本可以等价的转化，而渲染和按键部分基本上都进行重写。

[这里](https://github.com/lhtin/nand-2-tetris-labs)可以看到我完成的答案。

每个Project完成情况如下：

- 7-21 完成 [Project7](https://www.nand2tetris.org/project07)
- 7-24 完成 [Project8](https://www.nand2tetris.org/project08)
- 11-25 完成 [Project9](https://www.nand2tetris.org/project09)
- 8-16 完成 [Project10](https://www.nand2tetris.org/project10)
- 8-22 完成 [Project11](https://www.nand2tetris.org/project11)
- 11-16 完成 [Project12](https://www.nand2tetris.org/project12)

课程 Part 2 的侧重点是编译器和操作系统。首先引入了基于栈的字节码语言（VM Language），通过编写Translator，将其转化为 Part 1 中的机器码。然后引入类似Java的面向对象高级语言Jack，通过编写Compiler，将其编译为字节码，然后再通过Translator，转化为最终的机器码。此外，提供了一个及其简陋的OS API，提供基本的Memory、String、Screen、Keyboard、Math、Array等接口共应用程序调用。

### 项目总结

Project7、8分两步，实现一个VM语言（VM Language）到汇编语言（Hack Assembly Code，Project6实现了一个汇编语言到机器语言的汇编器）的转化器。其中字节码语言类似Java中的Bytecode，是一种基于栈的High Level IR。通过实现不同平台的VM，字节码可以在不修改的情况下在各个平台上执行，实现跨平台能力。

本项目实现的VM是堆栈机VM，数据使用一个后进先出的栈来存储，不同指令根据功能进行出栈入栈。Hack中的VM语言指令可以分成4类，分别是进行算术操作的指令、操作内存的指令、控制程序流程的指令和调用函数的指令。Project7实现前两类指令，Project8实现剩下的两类指令。

涉及的指令说明如下：

```
// 进行算术操作的指令
add     将栈顶两个整数出栈后相加，并将结果入栈
sub     将栈顶两个整数出栈后相减，并将结果入栈
neg     将栈顶的整数出栈后取负，并将结果入栈
eq      将栈顶两个整数出栈后进行相等比较，并将比较结果入栈
gt      将栈顶两个整数出栈后进行大于比较，并将比较结果入栈
lt      将栈顶两个整数出栈后进行小于比较，并将比较结果入栈
and     将栈顶两个元素出栈后进行按位与运算，并将结果入栈
or      将栈顶两个元素出栈后进行按位或运算，并将结果入栈
not     将栈顶的元素出栈后进行按位取反运算，并将结果入栈

// 操作内存的指令（TODO 需要详细说明，重新学习下）
push segment index
pop segment index

segment: argument, local, static, constant, this, that, pointer, temp

// 控制程序流程的指令
label symbol
goto symbol         无条件跳转
if-goto symbol      如果栈顶元素为true则跳转

// 调用子程序的指令
function functionName nLocals   函数声明
call functionName nArgs         调用函数
return                          函数返回
```

Project9首先介绍了Jack语言，它是一种面向对象高级编程语言，跟Java语言非常类似。然后让同学们使用该语言编写一个应用程序供其他同学进行评审以获得分数。根据我实际使用的情况，虽然Jack和Java类似，但是语法和库相比Java还是极其有限，对开发者并不友好。只能当作一个玩具语言进行学习。

Project10、11分两步，实现Jack语言到字节码语言的翻译。涉及到此法解析、语法解析、符号处理和字节码生产等，每一块的内容都非常的简单，但是需要完整做完才能够通过测试，还是非常的有意义。

Project12的目的是实现Jack中的操作系统提供的库，包括内存分配和释放、键盘事件监听、字符和图案输出到屏幕等功能。比较有挑战。
