---
title: 俄罗斯方块游戏规则整理
date: 2020/07/xx
tag:
- 笔记
category:
- 笔记
excerpt: 按：本文记录我在完成 Nand2Tetris Part2 课程中的Project3，开发一个俄罗斯方块游戏时做的俄罗斯方块游戏规则整理。主要参考的是《2009 Tetris Design Guideline》。
---



1. 基本情况：

   1. 格子尺寸：10*20
   2. 方块种类：O、I、T、L、J、S、Z

2. 动作：

   1. 左右移动（Movement）：向左和向右方向键
   2. 软着陆（Soft Drop）：向下方向键
   3. 硬着陆（Hard Drop）：空格键
   4. 旋转（Rotation）：向上方向键（顺时间旋转）
   5. 暂停（Pause）：Esc

3. 超级旋转系统：

   方位：

   <img src="tetris.assets/image-20200728000757270.png" alt="image-20200728000757270" style="zoom:50%;" />

   1. 

4. 等级（15个等级，每个等级的目标为清除10行）：

   1. normal-fall-speed = (0.8 - ((level - 1) * 0.007))^ (level-1)
   2. soft-drop-speed = 20*normal-fall-speed
   3. hard-drop-speed = 0.0001
   4. lock delay = 0.50（如果是hard drop情况，则为0）
   5. generate time = 0.2

   ![image-20200726235018598](tetris.assets/image-20200726235018598.png)

5. 记分系统（level为当前等级，n为下落格子数）：

   1. 消除单行，Single：100*level
   2. 消除双行，Double：300*level
   3. 消除三行，Triple：500*level
   4. 消除四行，Tetris：800*level
   5. 软着陆：1*n
   6. 硬着陆：2*n

### 超级旋转系统（Super Rotation System）

![image-20200728001916873](tetris.assets/image-20200728001916873.png)

![image-20200728002438656](tetris.assets/image-20200728002438656.png)

![image-20200728002726065](tetris.assets/image-20200728002726065.png)



![image-20200728233251358](tetris.assets/image-20200728233251358.png)

![image-20200728233318286](tetris.assets/image-20200728233318286.png)

![image-20200728233340150](tetris.assets/image-20200728233340150.png)

![image-20200728233359263](tetris.assets/image-20200728233359263.png)

![image-20200728233415881](tetris.assets/image-20200728233415881.png)

![image-20200728233431364](tetris.assets/image-20200728233431364.png)

![image-20200728233447992](tetris.assets/image-20200728233447992.png)

![image-20200729002721907](tetris.assets/image-20200729002721907.png)