# 笔记

## mac和linux上改变默认shell

假设fishshell程序的地址为：`usr/local/bin/fish`

1. 修改`/etc/shells`文件，将`/usr/local/bin/fish`加入其中。
2. sudo执行命令`chsh -s /usr/local/bin/fish`

## 给Mac添加字典

1. 首先下载后缀名为`.dictionary`的字典文件。
   - 比如langman5的字典地址（下载后解压）：https://pan.baidu.com/s/1bpgLHL1
2. 打开Mac上的**字典**应用，点击菜单栏上的**文件->打开字典文件**，将步骤1中的文件放入其中
3. 再点击菜单栏上的**字典->偏好设置**，列表后面应该就可以看到刚刚添加的字典文件了，勾选使其生效。

参考：
- http://www.makeuseof.com/tag/easily-expanding-apple-dictionary-mac-only
- https://www.zhihu.com/question/20428599

## WebStorm配置

字体：Andale Mono
字号：20
行间距：1.3
另外所有加粗的高亮设置都去掉了

## Git

像文件夹名称前后用空格的话，Mac上可以创建和提交到git上，但是windows下面拉的话就会有问题，因为windows下面无法创建这种前后含有空格的文件夹。所以最好是不要前后带有空格。

```VisualMe
1 -> 2 -> 3 -> 4
4 -> 5 -> 6
  -> 7 -> 8
       -> 9
```
