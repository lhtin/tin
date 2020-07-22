# Git命令笔记

## 仓库、分支、提交、合并、推送、子模块

在执行这些操作时，把仓库和分支想清楚。不要使用简写的命令。

显示远端仓库

---

`git remote add upstream https://github.com/cisco/ChezScheme.git`

添加一个远端仓库，名字叫做`upstream`

---

`git fetch upstream master`

将远端仓库`upstream`上的`master`分支的更新拉取过来

---

`git checkout master`
`git merge upstream/master`

合并远端仓库`upstream`上的`master`分支到本地的`master`分支上来

---

`git push origin master:master`

推送本地仓库的`master`分支到远端仓库`origin`的`master`分支上去

---

`git config --global user.name "lhtin"`

`git config --global user.email lehuading@qq.com`

配置git所使用的账号名称和邮箱

---

`git submodule add https://github.com/OWNER/REPOSITORY.git`

在仓库中添加一个子模块，没有`.gitmodules`文件的话会生成，里面包含这个模块的相关信息。

---

`git submodule init`

`git submodule update`

初始化子模块目录和更新子模块的内容（空的话会去拉取）

---

`git config --global core.quotepath false`

支持`git status`等命令的输出中展示中文字符。