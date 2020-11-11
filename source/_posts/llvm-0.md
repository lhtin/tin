---
title: 学习LLVM第0篇：LLVM项目介绍
date: 2020-06-25 21:55:21
categories:
- llvm
tags:
- llvm
excerpt: 本文学习LLVM的第0篇文章，介绍LLVM项目的一些内容，包括如何构建命令行工具和本地文档、常用LLVM命令的使用。目的是为了后续研究LLVM作准备。
---

更全面的内容请直接参考[官方文档](https://llvm.org/docs)，这里仅列出我在学习LLVM时用到的一些编译命令及遇到的问题，还会有些文档中没有提到的内容。



## 编译项目

1. 安装[CMake](https://cmake.org)、[Ninja](https://ninja-build.org)构建工具。
   
   这里除了Ninja构建系统，其实也可以选择其他的，比如Unix Makefiles。其中CMake可以理解为给开发者使用的构建工具接口，至于实际的构建系统，开发者可以显式指定让CMake去使用，比如下面在生成实际的构建系统时，就用了Ninja（默认为Unix Makefiles）。
   
   Mac系统建议使用[Brew](https://brew.sh)来安装，`brew install cmake ninja`，如果还需要编译文档，则需要安装doxygen、sphinx-doc，安装命令：`pip install sphinx=1.8.5`（使用brew安装时找不到这个版本的sphinx）、`brew install doxygen`。
   
2. 克隆LLVM仓库：`git clone https://github.com/llvm/llvm-project`

   如果国内clone太慢，也可以使用Gitee提供的镜像仓库 https://gitee.com/mirrors/LLVM （注意：镜像仓库目前每天同步一次，所以内容会有延后）

3. 创建构建目录，用于存放构建系统文件和构建出来的东西，比如在项目的根目录创建：`mkdir build`，然后进到构建目录： `cd build`

4. 生成构建系统：`cmake -G Ninja -DLLVM_ENABLE_PROJECTS="clang;libcxx" ../llvm`

   常用参数：

   - `LLVM_ENABLE_PROJECTS`：比如`"clang;libcxx"`。打算编译的项目列表，默认会编译LLVM，这里可以指定除LLVM之外的项目，比如`clang`、`clang-tools-extra`、`libcxx`、`libc`等。

     小提示：所有支持的项目可以去看`llvm/CMakeLists.txt`文件中的`LLVM_ALL_PROJECTS`变量的内容。当前的内容为：`clang;clang-tools-extra;compiler-rt;debuginfo-tests;libc;libclc;libcxx;libcxxabi;libunwind;lld;lldb;mlir;openmp;parallel-libs;polly;pstl`

   - `LLVM_TARGETS_TO_BUILD`：比如`"X86;RISCV"`。指定LLVM后端支持的目标架构，比如`X86`、`ARM`、`RISCV`、`WebAssembly`

     小提示：所有支持的目标架构可以去看`llvm/CMakeLists.txt`文件中的`LLVM_ALL_TARGETS`变量的内容。当前的内容为：`AArch64;AMDGPU;ARM;AVR;BPF;Hexagon;Lanai;Mips;MSP430;NVPTX;PowerPC;RISCV;Sparc;SystemZ;WebAssembly;X86;XCore`

   - `LLVM_ENABLE_SPHINX`：是否编译LLVM文档。`ON`表示启动。依赖[Sphinx](https://www.sphinx-doc.org)

   - `LLVM_ENABLE_DOXYGEN`：是否编译LLVM API文档。`ON`表示启动。依赖[Doxygen](https://www.doxygen.nl)

5. 进行构建：

   - `cmake --build .` 表示编译默认目标包括LLVM和`LLVM_ENABLE_PROJECTS`指定的项目

   - `cmake --build . --target docs-llvm-html` 表示只编译LLVM文档

     小提示：一开始我用的最新的3.1.1的Sphinx，运行这条命令会报错，在master分支上编译会提示：`llvm/docs/TableGen/LangRef.rst:270:duplicate token description of SimpleValue, other instance in TableGen/LangRef`，这是一个警告，但是因为编译的时候指定了`-W`，会将警告当作错误来对待，所以会直接退出。如果使用官方文档所用的Sphinx版本1.8.5（从文档的右下角可以看到），则会报`llvm/docs/CommandGuide/llvm-dwarfdump.rst:40:unknown option: --debug-info`。目前我的解决办法是去掉`-W`之后单独执行：`sphinx-build -b html -d docs/_doctrees-llvm-html -q ../llvm/docs docs/html`。不过打开生成的文档发现样式有点问题，每个文档的标题下面是一大块空白的，是CSS写的有问题。

     更新（2020-06-26）：后面又试了下，如果去当前最新的release/10.x分支，使用Sphinx 1.8.5编译，则可以编译通过。所以需要编译Sphinx文档，建议使用1.8.5版本的Sphinx，并且编译的是release/10.x分支。

   - `cmake --build . --target doxygen-llvm` 表示只编译LLVM API文档，试了下发现编译需要非常长的时间，做好心理准备。官方用的Doxygen版本是1.8.13，我用的1.8.18编译目前没有发现问题。
   
   小提示：1. 想要查看有哪些target可以去查看生成的`build/CMakeFiles/TargetDirectories.txt`文件。像这里的`doxygen-llvm`我就是通过这种方式找到的，文档上一直没有找到。2. 通过在本地编译文档，可以很方便后面学习LLVM时使用，在线的文档没有本地文档访问快。并且也可以添加一些中文注解，方便理解。

将前面的命令放在一起方便拷贝：

```shell
git clone https://github.com/llvm/llvm-project
// Gitee源：git clone https://gitee.com/mirrors/LLVM
cd llvm-project && mkdir build && cd build
cmake -G Ninja\
  -DLLVM_ENABLE_PROJECTS="clang;libcxx"\
  -DLLVM_TARGETS_TO_BUILD="X86"\
  -DLLVM_ENABLE_SPHINX=ON\
  -DLLVM_ENABLE_DOXYGEN=ON\
  ../llvm
cmake --build . // 编译llvm、clang、libcxx
cmake --build . --target docs-llvm-html // 编译LLVM文档
cmake --build . --target doxygen-llvm // 编译LLVM API文档
```

官方文档参考：

- [Getting Started with the LLVM System](https://llvm.org/docs/GettingStarted.html)：介绍了编译项目的基本步骤，常用参数
- [Building LLVM with CMake](https://llvm.org/docs/CMake.html)：更详细的介绍了CMake构建系统，包括CMake的基本使用和所有支持的参数



## 常用LLVM命令

- clang
  - `clang -S -emit-llvm input.c -o out.ll`：生成人可读的LLVM IR
  - `clang -c -emit-llvm input.c -o out.bc`：生成二进制LLVM IR，也可以不加`-c`，默认编译为二进制IR
- [opt](https://llvm.org/docs/CommandGuide/opt.html)
  - `opt -load-pass-plugin=libHelloWorld.dylib -passes="hello-world" a.ll`：使用HelloWorld Pass对`out.ll`进行处理。注意这是新的单独调用Pass的方式，老的方式为：`opt -load libHelloWorld.dylib -legacy-hello-world a.ll`
  - `opt -analyze -view-cfg a.ll` 生成控制流程图（Control-flow graph），可以很方便的查看函数中的各种BB及BB直接的跳转。
- [llvm-as](https://llvm.org/docs/CommandGuide/llvm-as.html)、[llvm-dis](https://llvm.org/docs/CommandGuide/llvm-dis.html)
  - `llvm-as a.ll -o a.bc`：将人可读的LLVM IR编译为二进制LLVM IR
  - `llvm-dis a.bc -o a.ll`：将二进制LLVM IR反编译为人可读的LLVM IR
- [llc](https://llvm.org/docs/CommandGuide/llc.html)
  - `llc a.ll -o a.out`：将LLVM IR编译为汇编代码，进而可以使用原生汇编器编译为可执行文件
- [lli](https://llvm.org/docs/CommandGuide/lli.html)
  - `lli a.ll`：直接解释执行LLVM IR
- [llvm-link](https://llvm.org/docs/CommandGuide/llvm-link.html)
  - `llvm-link -S add.ll main.ll -o all.ll`：链接多个LLVM IR为一个LLVM IR文件，`-S`表示输出的为人可读的LLVM IR，默认为二进制LLVM IR
- [llvm-config](https://llvm.org/docs/CommandGuide/llvm-config.html)：使用`llvm-config --help`查看帮助。给依赖LLVM的项目提供支持，输出LLVM库的头文件地址、库文件地址、库列表。
  - `llvm-config --cxxflags`：生成编译时的头文件库参数，比如在我电脑上会输出`-I/usr/local/Cellar/llvm/10.0.0_3/include -std=c++14 -stdlib=libc++  -D__STDC_CONSTANT_MACROS -D__STDC_FORMAT_MACROS -D__STDC_LIMIT_MACROS`
  - `llvm-config --ldflags`：生成链接时的LLVM库文件地址，比如在我电脑上会输出`-L/usr/local/Cellar/llvm/10.0.0_3/lib -Wl,-search_paths_first -Wl,-headerpad_max_install_names`
  - `llvm-config --libs`：生成LLVM提供的库名称，结合`llvm-config --ldflags`，就可以让链接器找到对应的库文件。在`--libs`后面还可以添加各种组件名称，不添加表示所有组件。比如`--libs core native`，则只会输出core和native组件相关的库。通过下面的`llvm-config --components`命令可以列举出所有的LLVM组件列表
  - `llvm-config --components`：输出所有的LLVM组件

官方文档参考：

- [LLVM Command Guide](https://llvm.org/docs/CommandGuide/index.html)：命令行工具使用说明


<!--
## LLVM项目结构简介

// TODO
-->
