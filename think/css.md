# css问题及解决方法

## 元素居中问题



## 设置border-radius，overflow为hidden在transition过程中不会立即生效

### 问题

在使用过程中，会发现元素设置了`border-radius`同时要求元素内部的子元素不溢出而设置`overflow: hidden`后。在应用`transition`时，会发现渐变过程子元素会在四个角落溢出，渐变完之后又不会溢出了。该问题出现在Chrome和Safari浏览器中，Firefox浏览器不存在这个问题。

### 解决方法

google了下解决方法，参考下面的网址： http://stackoverflow.com/questions/17300806/overflow-hidden-with-border-radius-and-translate3d

方法是给元素设置`transform: translate3d(0, 0, 0)`。示例代码如下，先去掉`transform: translate3d(0, 0, 0)`试试，在加上试试。

目前原因还不明白。

```html
<div id="lab">
    <div id="line"></div>
</div>
<style>
    #lab {
        border: 1px solid black;
        border-radius: 50%;
        width: 100px;
        height: 100px;
        overflow: hidden;
        transform: translate3d(0,0,0);
    }
    #line {
        position: relative;
        top: 0;
        width: 100%;
        height: 50%;
        background-color: rgba(255,0,0,.5);
        opacity: 1;
        transition: opacity 3s ease;
    }
</style>
<script>
    var line = document.getElementById('line');
    var flag = false;
    setInterval(function () {
        line.style.opacity = flag ? '1' : '.3';
        flag = !flag;
    }, 5000)
</script>
```

## css之可缩放式雪碧图问题

### 问题

如何在可变大小的元素上使用雪碧图中的图标，使其缩放过程中依然完好的显示我们指定的那个图标？

### 解决

结合`background-size`使用。原理如下：

假设有一张雪碧图，用A（分辨率为40\*40，位置为0,0）和B（分辨率为80\*80，位置为0,40）两个图标。现有一个元素（类名为box，默认宽高40\*40）需要使用到A图片，则css可以设置如下。

```css
.box {
    width: 40px;
    height: 40px;
    background-image: url('sprite.png');
    background-repeat: no-repeat;
    background-position: 0 0;
}
```

![效果图-1](img/background-sprite-1.png)

但问题是，该元素是可以根据环境改变大小的。这里就需要保证各个尺寸下都能完好的显示该图标，不多也不少。比如将宽高改为`80px`和`80px`，则效果展示如下。

![效果图-2](img/background-sprite-2.png)

解决方法是设置`background-size`，使用`%`为单位。如何设置这个数字是重点，我想到的方法是**雪碧图的宽除以A图标的宽**。为什么要这样设置，是因为`background-size`设置的百分数字是相对于整个雪碧图来的（即雪碧图的宽缩放到与元素的宽一致），而我们需要的是A图标的宽缩放到与元素一致。然后反推，如果A图标以元素宽度一致，那么雪碧图应该是元素的多少呢？比如A图标是40px，而雪碧图是80px，那么雪碧图应该是元素宽度的200%才对。因为A图标是雪碧图的50%，**50% * 200% = 100%**。

