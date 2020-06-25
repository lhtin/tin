# Todo List

- 网络协议
  - TCP/UDP协议
  - HTTP协议
  - HTTPS协议
  - HTTP2协议
  - HTTP3协议
- LLVM
  - LLVM Pass
- QuickJS
- 《编译器设计（第2版）》
  - 词法解析算法
  - 语法解析算法



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

  