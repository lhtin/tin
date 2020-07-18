---
title: 学习LLVM第1篇：官方入门教程笔记
date: 2020-07-09 00:18:02
categories:
- llvm
tags:
- llvm
excerpt: 按：本文是我学习LLVM官方教程My First Language Frontend with LLVM Tutorial时的一些笔记。
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

不过在解析表达式语法的时候，因为要处理二元操作符的优先级，使用了自底向上的操作符优先级判断的语法分析方法（[Operator-Precedence Parsing](http://en.wikipedia.org/wiki/Operator-precedence_parser)）。具体的原理大概是这样子的，比如对于`a + b * c`表达式，`+`的优先级为10，`*`的优先级为20。在解析到`+`号时，会再去判断是否后面还有操作符及优先级，如果后面的优先级更高，则会先让后面的表达式先解析，然后再回来解析`+`号。具体到这个例子，`*`号的优先级比`+`号的高，所以在解析到`a + b`的时候，并不是先解析成表达式之后再继续解析后面的，而是继续判断后面的`*`号是否优先级更高。因为`*`号的优先级较高，所以会让`a +`先等着，先解析`b * c`。得到一个表达式后作为一个完整的操作数（作为`+`号的第二个操作数），并回来解析`a +`。

语言BNF定义如下：

```
Program       -> FunDef | ExternFun | TopLevelExpr
FunDef        -> "def" ident "(" FormalArgs ")" Expr ";"
ExternFun     -> "extern" ident "(" FormalArgs ")" ";"
FormalArgs    -> ε | ident | ident FormalArgs
TopLevelExpr  -> Expr ";"
Expr          -> num | ident | ident "(" ActualArgs ")" 
              |  Expr Op Expr | "(" Expr ")"
Op            -> "<" | "-" | "+" | "*"
ActualArgs    -> ε | ident | ident "," ActualArgs
ident         -> [a-zA-Z][a-zA-Z0-9]*
num           -> [0-9.]+
comment       -> "#" [^\n\r]*
```

示例代码：

```
extern sin(arg); # 外部函数
sin(1);

def f(a b c)
  a + (b * c);
f(1, 2, 3);
```



### 第3章

这一章介绍如何将前面生成的抽象语法树，转化为LLVM IR的表示。主要做的事情就是根据AST的语义，等价调用LLVM IR的API，创建module。首先来看下Kaleidoscope语言的AST表示：

![](/images/llvm-1/AST.png)

接下来我们来看两个示例，看下他们对应的AST的样子：

1. 函数定义示例

   ```
   def add (a b)
     a + b;
   ```

   ![](/images/llvm-1/FuncDef.png)

2. 表达式示例

   ```
   add(1, 2);
   ```

   ![](/images/llvm-1/Expr.png)

有了AST之后，转换成LLVM IR就比较直接了。针对不同的AST节点，做对应的事情，最终将其转化为一个LLVM中的Value实例。比如针对NumExpr，调用`ConstantFP::get(TheContext, APFloat(Val))`即可。不熟悉的话可以去查看下LLVM IR的API文档。下面列下每种AST节点对应的创建LLVM IR的代码（来源于教程）：

```c++
// NumExpr:
ConstantFP::get(TheContext, APFloat(Val));

// VariableExpr:
// 根据名称从NamedValues Map中获取对应的Value
Value *V = NamedValues[Name];

// CallExpr:
// 1. 根据函数名称获取前面定义了的函数实例
Function *CalleeF = TheModule->getFunction(Callee);
// 2. 确定每个参数的Value
std::vector<Value *> ArgsV;
for (unsigned i = 0, e = Args.size(); i != e; ++i) {
  ArgsV.push_back(Args[i]->codegen());
  if (!ArgsV.back())
    return nullptr;
}
// 3. 创建Call指令
Builder.CreateCall(CalleeF, ArgsV, "calltmp");

// BinaryExpr:
// 1. 确定左右操作数的Value
Value *L = LHS->codegen();
Value *R = RHS->codegen();
// 2. 根据操作符，创建对应的操作
switch (Op) {
  case '+':
    return Builder.CreateFAdd(L, R, "addtmp");
  case '-':
    return Builder.CreateFSub(L, R, "subtmp");
  case '*':
    return Builder.CreateFMul(L, R, "multmp");
  case '<':
    L = Builder.CreateFCmpULT(L, R, "cmptmp");
    // Convert bool 0/1 to double 0.0 or 1.0
    return Builder.CreateUIToFP(L, Type::getDoubleTy(TheContext), "booltmp");
}

// FuncProto:
// 创建参数列表的类型
std::vector<Type *> Doubles(Args.size(), Type::getDoubleTy(TheContext));
// 函数原型
FunctionType *FT = FunctionType::get(Type::getDoubleTy(TheContext), Doubles, false);
// 生成函数实例
Function *F = Function::Create(FT, Function::ExternalLinkage, Name, TheModule.get());

// FuncDef:
Function *TheFunction = Proto->codegen();
// 收集参数变量，用于body中的访问
NamedValues.clear();
for (auto &Arg : TheFunction->args()) {
  NamedValues[Arg.getName()] = &Arg;
}
// 创建函数的body BB，并设置指令插入的位置为底部
BasicBlock *BB = BasicBlock::Create(TheContext, "entry", TheFunction);
Builder.SetInsertPoint(BB);
Value *RetVal = Body->codegen();
// 设置返回指定，指定返回的内容
Builder.CreateRet(RetVal);
```

在讲到FuncDef的LLVM IR的生成代码时，教程提到有一个bug，无法处理下面的代码：

```
extern foo(a);
def foo(b) b; // 两个函数原型的参数名称不一样
```

下面给出我的解决方法：

```c++
Function *TheFunction = TheModule->getFunction(Proto->getName());
if (!TheFunction) {
  TheFunction = Proto->codegen();
} else {
  // 如果TheFunction之前就创建过了，则更新参数的名称，这样之后就可以找到了
  unsigned idx = 0;
  for (auto &Arg : TheFunction->args()) {
    // getArgName是新增的根据idx获取参数名称的方法
    Arg.setName(Proto->getArgName(idx++));
  }
}
```



### 第4章

讲了两件事情，一是如何增加函数级别的优化，二是增加JIT编译功能，通过JIT编译之后为本地代码之后，可以在C++中直接调用Kaleidoscope中的函数进行执行。

关于增加函数级别的优化，只需要在初始化Module的时候，同时根据创建的module创建FunctionPassManager，有了FunctionPassManager之后，就可以给他添加你想要的优化Pass了。比如教程中就添加了四个：

```c++
void InitializeModuleAndPassManager(void) {
  TheModule = std::make_unique<Module>("my cool jit", TheContext);
  TheFPM = std::make_unique<FunctionPassManager>(TheModule.get());

  // 优化一：Do simple "peephole" optimizations and bit-twiddling optzns.
  TheFPM->add(createInstructionCombiningPass());
  // 优化二：Reassociate expressions.
  TheFPM->add(createReassociatePass());
  // 优化三：Eliminate Common SubExpressions.
  TheFPM->add(createGVNPass());
  // 优化四：Simplify the control flow graph (deleting unreachable blocks, etc).
  TheFPM->add(createCFGSimplificationPass());

  TheFPM->doInitialization();
}
```

对于JIT编译，本章并没有分享JIT模块的原理，而是假设已经写好了一个KaleidoscopeJIT模块，如何去使用它。通过创建一个JIT实例，然后将用户输入的代码转化为LLVM Module，然后将Module添加给JIT实例，就会对添加进去的模块进行编译。编译了之后，可以通过函数名称找到函数的内存地址，进而直接调用。核心代码如下：

```c++
  if (auto FnAST = ParseTopLevelExpr()) {
    if (FnAST->codegen()) {
      // 将TopLevelExpr所在的模块添加到JIT实例中
      auto H = TheJIT->addModule(std::move(TheModule));
      InitializeModuleAndPassManager();

      // 编译万之后找到__anon_expr的内存地址
      auto ExprSymbol = TheJIT->findSymbol("__anon_expr");
      // 转化为函数指针后进行调用
      double (*FP)() = (double (*)())(intptr_t)ExprSymbol.getAddress();
      fprintf(stderr, "Evaluated to %f\n", FP());
      // 执行完之后删除
      TheJIT->removeModule(H);
    }
```

另外需要注意，为了让用户输入的函数定义，在后面一直都可以被调用。需要将函数定义存放的模块跟TopLevelExpr所处的模块分开，这样在执行完之后进行删除时，不会同时把函数定义给删除了。



### 第5章

本章给Kaleidoscope添加了流程控制语句If/Then/Else和循环语句For/In。

扩展后语言的BNF定义如下：

```
...
Expr          -> num | ident | ident "(" ActualArgs ")" 
              |  Expr Op Expr | "(" Expr ")"
              |  "if" Expr "then" Expr "else" Expr
              |  "for" ident "=" Expr "," Expr "," Expr "in"
              |  "for" ident "=" Expr "," Expr "in"
...
```

示例代码：

```
# If语句
if 1 < 2 
then 3
else f(1, 2, 3);

# For语句，1.00增长步伐可以省略
for i = 0, i < 100, 1.00 in
  f(1, 2, i);
```

IR的生成，主要需要注意分支有哪些，以及分支汇集的地方PHI节点的创建。下面将教程中的核心代码加上注释展示出来。

生成条件语句的LLVM IR：

```c++
Value *CondV = Cond->codegen();
CondV = Builder.CreateFCmpONE(CondV, ConstantFP::get(TheContext, APFloat(0.0)), "ifcond");
Function *TheFunction = Builder.GetInsertBlock()->getParent();
BasicBlock *ThenBB = BasicBlock::Create(TheContext, "then", TheFunction); // 自动加到函数中
BasicBlock *ElseBB = BasicBlock::Create(TheContext, "else");
BasicBlock *MergeBB = BasicBlock::Create(TheContext, "ifcont");

Builder.CreateCondBr(CondV, ThenBB, ElseBB); // 插入条件分支语句的指令

// Then语句处理
Builder.SetInsertPoint(ThenBB);
Value *ThenV = Then->codegen();
Builder.CreateBr(MergeBB); // 插入跳转到Merge分支的指令
ThenBB = Builder.GetInsertBlock(); // 获取Then语句的出口

// Else语句处理
TheFunction->getBasicBlockList().push_back(ElseBB); // 添加到函数中去
Builder.SetInsertPoint(ElseBB);
Value *ElseV = Else->codegen();
Builder.CreateBr(MergeBB); // 插入跳转到Merge分支的指令
ElseBB = Builder.GetInsertBlock(); // 获取Else语句的出口

// PHI指令的生成
TheFunction->getBasicBlockList().push_back(MergeBB);
Builder.SetInsertPoint(MergeBB);
PHINode *PN = Builder.CreatePHI(Type::getDoubleTy(TheContext), 2, "iftmp");
PN->addIncoming(ThenV, ThenBB);
PN->addIncoming(ElseV, ElseBB);
```

生成For语句的LLVM IR：

```c++
Value *StartVal = Start->codegen();
Function *TheFunction = Builder.GetInsertBlock()->getParent();
BasicBlock *PreheaderBB = Builder.GetInsertBlock();
BasicBlock *LoopBB = BasicBlock::Create(TheContext, "loop", TheFunction);
Builder.CreateBr(LoopBB); // 跳转到Loop分支

Builder.SetInsertPoint(LoopBB);
// 创建PHI节点
PHINode *Variable = Builder.CreatePHI(Type::getDoubleTy(TheContext), 2, VarName.c_str());
Variable->addIncoming(StartVal, PreheaderBB);
NamedValues[VarName] = Variable; // 将for定义的变量添加到作用域中
Body->codegen();
Value *StepVal = Step->codegen();
Value *NextVar = Builder.CreateFAdd(Variable, StepVal, "nextvar");
Value *EndCond = End->codegen();
EndCond = Builder.CreateFCmpONE(EndCond, ConstantFP::get(TheContext, APFloat(0.0)), "loopcond");
BasicBlock *LoopEndBB = Builder.GetInsertBlock(); // 为啥不可以直接使用LoopBB，而是还要获取一次呢？
BasicBlock *AfterBB = BasicBlock::Create(TheContext, "afterloop", TheFunction);
Builder.CreateCondBr(EndCond, LoopBB, AfterBB);

Builder.SetInsertPoint(AfterBB);
Variable->addIncoming(NextVar, LoopEndBB);
```



### 第6章

本章讲解自定义操作符功能，主要的方式是通过新增特定的函数定义来实现，BNF表示如下：

```
...
FunDef        -> "def" ident "(" FormalArgs ")" Expr ";"
              |  "def" "unary" CustomOp "(" Expr ")" Expr ";"
              |  "def" "binary" CustomOp num "(" Expr Expr ")" Expr ";"
CustomOp      -> [.]+
...
```

示例代码：

```
# 取反
def unary ! (v)
  if v then 0 else 1;

# 或运算，5为二元操作符的优先级
def binary | 5 (LHS RHS)
  if LHS then
    1
  else 
    if RHS then
      1
    else
      0;
```

这章主要是新增了一些语法糖，并没有新增实质性的内容，并且也没有涉及新的LLVM的内容，所以就不细说了。



### 第7章

本章给Kaleidoscope语言引入了变量可赋值的功能。需要注意的是，LLVM IR是一种SSA（Static Single Assignment），也就是说每个变量只能被赋值一次。而变量可赋值意味着变量可以被赋值多次，所以需要有一个转化过程，将其转化为SSA格式。但是如果每个地方都需要这样手工处理的话，会相当的繁琐，你需要手工创建很多的PHI节点。幸运的是，LLVM提供了`mem2reg`的转化Pass，可以将栈变量（可以被修复多次）转化为寄存器变量（只可以被赋值一次）。因此，当我们遇到变量赋值时，我们只需要将其转化为IR中的栈变量，然后调用`mem2reg`Pass进行转化即可。

这里说下大致的代码逻辑。在根据函数定义和变量声明的AST生成IR时，首先在EntryBlock（因为`mem2reg`只会处理放在EntryBlock中的变量）的给每个变量创建一个栈变量，然后再对应的修改的地方创建Store指令，在需要获取的地方创建Load指令。同时因为可以定义新的变量，需要处理同名变量互相覆盖的问题。

语言最新的BNF表示（因为后面的章节没有再对语法有改动了，所以这里给出完整的语法，方便查看）：

```
Program       -> FunDef | ExternFun | TopLevelExpr
FunDef        -> "def" ident "(" FormalArgs ")" Expr ";"
              |  "def" "unary" CustomOp "(" Expr ")" Expr ";"
              |  "def" "binary" CustomOp num "(" Expr Expr ")" Expr ";"
CustomOp      -> [.]+
ExternFun     -> "extern" ident "(" FormalArgs ")" ";"
FormalArgs    -> ε | ident | ident FormalArgs
TopLevelExpr  -> Expr ";"
Expr          -> num | ident | ident "(" ActualArgs ")" 
              |  Expr Op Expr | "(" Expr ")"
              |  "if" Expr "then" Expr "else" Expr
              |  "for" ident "=" Expr "," Expr "," Expr "in"
              |  "for" ident "=" Expr "," Expr "in"
              |  ident "=" Expr
              |  "var" VarDef [ "," VarDef ] "in" Expr
VarDef        -> ident | ident "=" Expr
Op            -> "<" | "-" | "+" | "*"
ActualArgs    -> ε | ident | ident "," ActualArgs
ident         -> [a-zA-Z][a-zA-Z0-9]*
num           -> [0-9.]+
comment       -> "#" [^\n\r]*
```

新增语法对应的示例代码：

```
def binary : 1 (x y) y; # 取两个表达式中的后一个表达式

def fib(x)
  var a = 1, b = 1, c in
  (for i = 3, i < x in
     c = a + b :
     a = b :
     b = c) :
  b;

fib(10);
```



### 第8章

本章讲解如何将LLVM IR转化为目标文件。这章内容不多，主要包括如何设置和获取Target，如何创建TargetMachine，以及如何通过PassManager触发运行，生成目标文件。

```c++
auto TargetTriple = sys::getDefaultTargetTriple();
InitializeAllTargetInfos();
InitializeAllTargets();
InitializeAllTargetMCs();
InitializeAllAsmParsers();
InitializeAllAsmPrinters();
// 获取当前平台相关的Target
std::string Error;
auto Target = TargetRegistry::lookupTarget(TargetTriple, Error);
// 生成TargetMatchine
auto CPU = "generic";
auto Features = "";
TargetOptions opt;
auto RM = Optional<Reloc::Model>();
auto TargetMachine = Target->createTargetMachine(TargetTriple, CPU, Features, opt, RM);
// 生成目标代码
auto Filename = "output.o";
std::error_code EC;
raw_fd_ostream dest(Filename, EC, sys::fs::OF_None);
legacy::PassManager pass;
auto FileType = CGFT_ObjectFile;
TargetMachine->addPassesToEmitFile(pass, dest, nullptr, FileType)
pass.run(*TheModule);
dest.flush(); // 更新到磁盘
```



### 第9章

本章讲解如何添加Debug信息到IR中，用于后面的程序调试。大概的原理是这样子的，LLVM提供了DIBuilder，类似IRBuilder。然后在生成IR指令前，需要调用IRBuilder的SetCurrentDebugLocation方法，设置接下来的IR指令的代码行数和列数等信息。关于调试信息的作用域，分为了模块和函数两种，在设置调试信息时，需要确定好是处在模块层还是函数层。LLVM生成的是[DWARF](http://dwarfstd.org)标准格式的调试信息。

具体的代码可以直接看对应的章节。



### 第10章

本章是最后的总结。

首先提到可以对Kaleidoscope做的一些扩展，比如全局变量、含类型的变量、数组等结构体、内存管理、异常管理等各种功能。

然后是讲了下LLVM的一些属性：

- LLVM IR是目标架构无关的语言，你可以将它编译成任何支持的平台。
- LLVM IR本身并不是安全的语言，IR支持不安全的指针转换。可以在LLVM之上做一层安全的校验。
- 编程语言相关的优化。在将源码转成LLVM IR的时候，会丢失一些信息。不过你可以扩展LLVM来添加一些专门针对某一种语言的优化Pass

最后提到了两个避坑指令：

- 关于`offset/sizeof`的移植性问题，LLVM中的指针大小是平台相关的，不过有些方式可以避免这个问题。具体可以参考[这里](http://nondot.org/sabre/LLVMNotes/SizeOf-OffsetOf-VariableSizedStructs.txt)。

- 关于控制栈帧的方法（比如用于实现闭包），LLVM是提供了支持的，不过这需要前端先将代码转成CPS风格的尾递归调用才行。具体可以参考[这里](http://nondot.org/sabre/LLVMNotes/ExplicitlyManagedStackFrames.txt)



## 遇到的问题

- 第4章节（其实还包括后面所有需要用到JIT功能的章节），编译时需要给`--libs`增加`orcjit`参数
  - 原来：`llvm-config --cxxflags --ldflags --system-libs --libs core mcjit native`
  - 需改为：`llvm-config --cxxflags --ldflags --system-libs --libs core mcjit native orcjit` 
  - 或者直接改为`all`：`llvm-config --cxxflags --ldflags --system-libs --libs all`

