---
title: 学习LLVM第1篇：官方入门教程
date: 2020-06-29 22:54:27
categories:
- llvm
tags:
- llvm
excerpt: 本文是我学习LLVM官方入门教程（My First Language Frontend with LLVM Tutorial）时的一些笔记。
---



官方教程链接：

## 简介



## 遇到的问题

- 第4章节，编译时需要给`--libs`增加`orcjit`参数
  - 原来：`llvm-config --cxxflags --ldflags --system-libs --libs core mcjit native`
  - 改为：`llvm-config --cxxflags --ldflags --system-libs --libs core mcjit native orcjit` 