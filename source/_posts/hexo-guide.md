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

为了尽可能将时间花在写博客上面，我直接选择使用Hexo博客框架。这个框架非常灵活，除了基本的将Markdown编译为HTML能力之外，还提供了集中组织文章的方式。比如根据时间进行归档，根据标签和分类进行文章统计和检索。另外你也可以定义很多新的玩法，扩展性很好。下面介绍我的使用过程。

### 初始化博客项目

首先使用npm安装Hexo命令行工具，安装完之后初始化一个空的项目：

```shell
npm install -g hexo-cli

hexo init <name>

cd <name>
npm install
```

执行完了之后，项目默认使用landscape主题。初始化的项目中有以下几个脚本命名可以使用：

```shell
npm run server // 启动本地server
npm run build // 将项目打包成静态文件，存放在public目录
npm run deploy // 将public中的内容上传到指定的git仓库分支，需要在_config.yml中配置仓库信息，后面会介绍如何配置

hexo new post hexo-guide // 根据scaffolds中的post模版生成文章的基本结构，会自动设置title和日期，生成的文件会存放在source/_posts中
```

更多指南请前往[Hexo官方文档](https://hexo.io/zh-cn/docs)。

### 根据需要修改配置

在初始化完了项目之后，我做了一些修改，以满足我的需求。首先定义网站的相关信息（更多配置说明请参见[官方文档-配置](https://hexo.io/zh-cn/docs/configuration)）：

```yml
# 项目根目录下的_config.yml文件
title: 01的世界
subtitle: 计算机的世界没有秘密
description: 这里有关于计算机的方方面面
keywords: 01的世界
author: 钉子哥
language: zh-CN # 会影响主题中的语言选择
timezone: Asia/Shanghai

// 本博客部署的地址
url: https://lhtin.gitee.io
root: /
```

然后还需要根据我自己的要求，修改默认主题[landscape](https://github.com/hexojs/hexo-theme-landscape)的部分内容。所有修改的内容可以参见我fork出来的[仓库](https://gitee.com/lhtin/hexo-theme-landscape)。这里我列出主要的修改：

- 将一些英文翻译为中文，比如Home -> 首页，Read More -> 阅读全文
- 去掉tagcloud，调整widgets的顺序，打开展示分类和标签中对应的文章数量的flag
- 添加百度统计，并和Google统计合并到一个ejs文件
- 去掉文章头部的日期和分类展示。让文章标题居中展示，并且在文章下面展示文章作者和日期
- 去掉右上角的导航，固定展示为“首页”
- 修改首页展示文章摘抄的样式

### 构建和部署

当你写好了一篇博客文章之后，就需要构建成静态文件，以便上传到Gitee Pages上。Hexo在构建时，是根据所选主题中对应的[ejs模版](https://ejs.co)，填充所需参数（大部分来自yml文件和Markdown文件头部信息）和文章内容之后，就会生成HTML文件。

生成HTML文件后，可以通过使用部署插件hexo-deployer-git，将生成的public目录中的文件自动上传到指定的git上，上传之前需要先在_config.yml中配置Git相关信息。

```yml
# 项目根目录下的_config.yml文件
deploy:
  type: git
  repo: https://gitee.com/lhtin/lhtin.git
  branch: page
```

构建和部署的命令如下：

```
npm run build
npm install --save-dev hexo-deployer-git
npm run deploy
```

因为build和deploy经常一起用，于是我将两个命令整合成一个，取名d：

```json
{
  "scripts": {
    "d": "npm run clean && npm run build && npm run deploy"
  }
}
```

这样就完成了博客的构建和上传。上传完之后需要注意下，Gitee Pages并不支持自动更新你上传的内容，你需要手动进到项目中的Pages服务，点击更新进行手动更新。~~或许可以直接集成到d命令中，push完之后直接调用Pages的更新接口。这个等以后有时间了再来折腾下。~~目前已经可以通过命令行触发Pages自动部署了，更多内容可以参加[gitee](https://www.npmjs.com/package/gitee)这个npm模块。