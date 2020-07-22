# Chez - Scheme语言的一个实现

## Introduction

`parameter`

## Using Chez Scheme

本章节描述使用Chez Scheme的几种典型方式。

`(compile-file "path")`：compile source file to object file
在RNRS top-level program里一个标识符只能被定义一次，在interaction environment里则可以被定义多次（方便测试）

interaction enviroment默认载入了`(chezscheme)`库

- 带UTF-8 BOM标识符（即开头加入了`\xFEFF`两个字节)的文件，通过`compile-file`编译后运行报如下错误：`Exception: variable \xFEFF; is not bound`，使用`compile-library`编译时报如下错误：`Exception in read: character \xFEFF in symbol syntax is not allowed in #!r6rs mode at line 1, char 1 of lab.s`

### expeditor(expression editor)

`^`: `control`

`^L`: show the entire expression
`^J`: excuting the code
`^D`: exit
`^C`: interrupt

`echo '(reset-handler abort) (compile-file "filename")' | scheme -q`