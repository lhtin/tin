# Nanopass框架用户指南

作者：Andrew W. Keep
翻译：lhtin

注：本文档大部分

## 第一章 介绍

Nanopass框架是一个用于开发编译器的专用语言。框架提供两个主要的语法：`define-language`和`define-pass`。`define-language`用于定义一个中间语言的语法规则。`define-pass`用于定义过程，该过程接受一个输入语言，生成另一个输出语言（一般跟输入语言不同）。

### 1.1 Nanopass框架历史

Micropass编译器的想法一开始来自Dan Friedman，后来经过R. Ken Dybvig和Oscar Waddell加入Friedman的改进。Erik Hilsdale加入了模式匹配对catamorphisms的支持。