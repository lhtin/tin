---
title: homebrew国内安装指南
date: 2020-06-17 10:30:39
categories:
- software
tags:
- software
---

[Homebrew](https://brew.sh)是一款Mac上的包管理器，可以很方便的安装各种软件。

fishshell:

```
# 安装brew
/bin/bash -c (curl -fsSL https://gitee.com/lhtin/brew-install/raw/master/install.sh)

# 修改源为gitee
cd (brew --repo)
git remote set-url origin https://gitee.com/lhtin/brew.git

cd (brew --repo)/Library/Taps/homebrew/homebrew-core
git remote set-url origin https://gitee.com/lhtin/homebrew-core.git

# 安装了cask才有
cd (brew --repo)/Library/Taps/homebrew/homebrew-cask
git remote set-url origin https://gitee.com/lhtin/homebrew-cask.git

# 如还有其他源，也可以使用Gitee导入Github上的仓库，然后改为Gitee上的仓库地址

# 修改Bottles源
## 中科大源
set --export HOMEBREW_BOTTLE_DOMAIN https://mirrors.ustc.edu.cn/homebrew-bottles
## 清华源
set --export HOMEBREW_BOTTLE_DOMAIN https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles
```
