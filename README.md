## Todo List

最近给自己制定了一个大目标：**能够明白计算机的每个方面**。具体来说，就是让自己能回答以下的问题（同时列举出了我打算做的一些事情）：

- 如何进行软件设计？软件工程、软件设计
  - 专栏：[许式伟的架构课](https://time.geekbang.org/column/intro/166)
  - 书：《重构》
  - 书：《程序员修炼之道》
  - ...

- 计算机硬件是如何执行程序的？CPU、内存、IO
  - 课程：[Nand2Tetris Part 1](https://www.coursera.org/learn/build-a-computer)
  - 课程：[Nand2Tetris Part 2](https://www.coursera.org/learn/nand2tetris2)
  - 书：*The Elements of Computing Systems*
  - 专栏：[深入浅出计算机组成原理](https://time.geekbang.org/column/intro/170)
  - ...

- 编译器和程序静态分析是什么？编译、代码分析
  - 编译器实现：[LLVM](https://llvm.org)
  - 编译器实现：[Chez Scheme](https://github.com/cisco/ChezScheme)
  - 课程：[静态程序分析](https://pascal-group.bitbucket.io/teaching.html)
  - 课程：[Enflame编译优化培训(基于DCC888)](https://space.bilibili.com/482245901/video)
  - 书：《编译器设计》
  - [极客时间直播视频：从语言编译器源码入手，编译原理该这么学](https://www.bilibili.com/video/BV1Yz4y197Na)
  - ...

- 操作系统是什么？硬件管理、软件管理
  - 操作系统：Linux
  - 专栏：[趣谈 Linux 操作系统](https://time.geekbang.org/column/intro/164)
  - 实现一个最小操作系统
  - 熟练使用 Linux
  - ...
- 计算机网络是什么？TCP/IP协议、各种协议的优缺点
  - 专栏：[趣谈网络协议](https://time.geekbang.org/column/intro/85)
  - 专栏：[透视HTTP协议](https://time.geekbang.org/column/intro/189)
  - ...



计算机之外的学习计划

- 家庭
  - 陪伴的快乐
  - 陪妻子和儿子一起成长、共同做一些事情
  - 如果儿子喜欢的话，跟儿子讨论计算机和经济学
- 经济学
  - 科学方法论
  - 需求定律
  - 李俊慧的经济学
  - 李俊慧的经济学-第二季
  - 《经济学讲义》
  - 《经济解释》



## 文章计划

- 网络协议
  - TCP/UDP协议
  - HTTP协议
  - HTTPS协议
  - HTTP2协议
  - HTTP3协议
- LLVM
  - ABI
  - SSA and LLVM IR
  - LLVM Pass
  - 使用LLVM实现一门Lambda演算语言
    - https://cgnail.github.io/academic/lambda-1/
    - https://blog.csdn.net/g9yuayon/article/details/748684
- clang
  - 头文件搜索路径
  - 静态链接、动态链接
- QuickJS
- 《编译器设计（第2版）》
  - 词法解析算法
  - 语法解析算法
- 生产力工具
  - shell、命令行



## LLVM中发现的问题

- 分支master，文件：llvm/include/llvm/IR/Module.h，第342行中的Four应该为Three，三种可能性：

  ```
    /// Look up the specified function in the module symbol table. Four（这里）
    /// possibilities:
    ///   1. If it does not exist, add a prototype for the function and return it.
    ///   2. Otherwise, if the existing function has the correct prototype, return
    ///      the existing function.
    ///   3. Finally, the function exists but has the wrong prototype: return the
    ///      function with a constantexpr cast to the right prototype.
    ///
    /// In all cases, the returned value is a FunctionCallee wrapper around the
    /// 'FunctionType *T' passed in, as well as a 'Value*' either of the Function or
    /// the bitcast to the function.
    FunctionCallee getOrInsertFunction(StringRef Name, FunctionType *T,
                                       AttributeList AttributeList);
  
    FunctionCallee getOrInsertFunction(StringRef Name, FunctionType *T);
  ```


- `cmake --build . --target check-all` 报错

  ```
  lhtin@192 ~/P/l/build2> cmake --build . --target check-all
  [2/2244] Generating VCSRevision.h
  -- Found Git: /usr/local/bin/git (found version "2.10.1") 
  [239/2244] Linking CXX static library lib/libLLVMExtensions.a
  warning: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/libtool: warning for library: lib/libLLVMExtensions.a the table of contents is empty (no object file members in the library define global symbols)
  [2243/2244] Running all regression tests
  FAIL: LLVM :: Bindings/Go/go.test (5593 of 35322)
  ******************** TEST 'LLVM :: Bindings/Go/go.test' FAILED ********************
  Script:
  --
  : 'RUN: at line 1';   /Users/lhtin/Projects/llvm-project/build2/bin/llvm-go go=/usr/local/bin/go test llvm.org/llvm/bindings/go/llvm
  --
  Exit Code: 1
  
  Command Output (stdout):
  --
  FAIL	llvm.org/llvm/bindings/go/llvm [build failed]
  
  --
  Command Output (stderr):
  --
  # llvm.org/llvm/bindings/go/llvm
  In file included from /var/folders/wz/gs5c67q55zv122cgjn8cb_840000gn/T/gopath955212205/src/llvm.org/llvm/bindings/go/llvm/analysis.go:16:
  In file included from /Users/lhtin/Projects/llvm-project/llvm/include/llvm-c/Analysis.h:23:
  In file included from /Users/lhtin/Projects/llvm-project/llvm/include/llvm-c/Types.h:17:
  /Users/lhtin/Projects/llvm-project/llvm/include/llvm-c/DataTypes.h:30:10: fatal error: 'math.h' file not found
  #include <math.h>
           ^~~~~~~~
  1 error generated.
  
  --
  
  ********************
  
  Testing Time: 1237.14s
  ********************
  Failing Tests (1):
      LLVM :: Bindings/Go/go.test
  
    Expected Passes    : 20230
    Expected Failures  : 55
    Unsupported Tests  : 15036
    Unexpected Failures: 1
  FAILED: CMakeFiles/check-all 
  cd /Users/lhtin/Projects/llvm-project/build2 && /usr/local/opt/python/libexec/bin/python /Users/lhtin/Projects/llvm-project/build2/./bin/llvm-lit -sv /Users/lhtin/Projects/llvm-project/build2/utils/lit /Users/lhtin/Projects/llvm-project/build2/test
  ninja: build stopped: subcommand failed.
  ```



## 随记

- 如何给Chez Scheme添加新的后端：https://github.com/pmatos/ChezScheme/commit/2228269a012a5ad007f2104c26de4d200473f0c7