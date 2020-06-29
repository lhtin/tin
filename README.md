# Todo List

- 网络协议
  - TCP/UDP协议
  - HTTP协议
  - HTTPS协议
  - HTTP2协议
  - HTTP3协议
- LLVM
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


- 分支release/10.x，文件：llvm/docs/BugpointRedesign.md，第36行cluttered前面不应该有空格，需要去掉，否则编译文档时会报错。

  ```
  ### Command-Line Options
  We are proposing to reduce the plethora of bugpoint’s options to just two: an
  interesting-ness test and the arguments for said test, similar to other delta
  reduction tools such as CReduce, Delta, and Lithium; the tool should feel less
   cluttered（这里）, and there should also be no uncertainty about how to operate it.
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