---
title: 本站建造过程记录
comments: true
date: 2020/06/14
tag:
- guide
category:
- guide
excerpt: 本文详细记录了使用Hexo创建静态博客的过程。
---

本文记录了使用Hexo创建静态博客的过程。我的需求是为了学习的内容找一个地方系统的记录下来，并且可以很方便的查看，但是又不想自己去购买服务器。另外写作的语言要求为Markdown。我首先想到的是使用Gitee Pages服务，免费且在国内访问速度还不错。下面就来一一介绍这整个的过程。

## 使用Gitee Pages服务

在Gitee上创建一个账号，然后在创建一个名称跟账号同名的仓库。同名的作用是为了在访问时不需要指定仓库名称。比如说我的账户名是[lhtin](https://gitee.com/lhtin)，仓库名也为[lhtin](https://gitee.com/lhtin/lhtin)，这样就可以直接通过 https://lhtin.gitee.io 访问，而不需要加上仓库的名称作为访问的路径（ https://lhtin.gitee.io/lhtin ）。

创建了仓库之后，就可以对仓库启动Pages服务了，具体设置方式请直接参考[官方指南](https://gitee.com/help/articles/4136)。这样静态服务器就有了。

## 使用Hexo博客框架

为了尽可能将时间花在写博客上面，我直接选择使用Hexo博客框架。这个框架非常灵活，除了基本的将Markdown编译为HTML能力之外，还提供了集中组织文章的方式。比如根据时间进行归档，根据标签和分类进行文章统计和检索。另外你也可以定义很多新的玩法，扩展性很好。下面我介绍我的使用过程。

首先使用npm安装Hexo命令行工具，安装完之后初始化一个空的项目：

```shell
npm install -g hexo-cli

hexo init <name>

cd <name>
npm install
```

执行完了之后，项目默认使用landscape主题

更多指南请前往[Hexo官方文档](https://hexo.io/zh-cn/docs)。


