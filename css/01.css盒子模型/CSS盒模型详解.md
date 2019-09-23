# CSS盒模型详解

盒模型是CSS的基础中的基础。
因为它的重要性，所以很多面试中都会提到。它也成为了考察求职者基本素质的一道题。属于绝对的经典问题。这样描述，相信大家能意识到盒模型的重要性了吧。

然而，在面试的过程中，我发现还有不少求职者，回答的支支吾吾，嗯！是那个，对！就是那样。说实话，我真觉得有些不妥。 今天我就重新整理一下，希望能帮到大家。

##什么是盒模型呢？

我们先来看一种图：

![](./WechatIMG1.jpeg)

**当浏览器对一个HTML文档进行布局的时候，会把每一个元素都渲染成一个矩形的盒子，盒模型就是对这些元素的形状进行一个抽象。**

盒模型的组成部分是由四个部分组成：content(内容区域) padding(内边距) border(边框区域) margin(外边距区域)

如下图：
![](./WechatIMG2.jpeg)

##盒模型有多少种呢？它们的区别在哪里？

说到盒模型，就不得不说说IE盒模型和W3C标准盒模型（w3c盒模型又称标准盒模型）这两种盒模型。

它们主要的区别在与 width 属性所包含的大小

我们定义一个div 并将其宽高设置成200像素，内边距为10像素，边框为20像素， 外边距为30像素。代码如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<style>
		body{
			margin: 0
		}
		#box{
			margin: 30px;
			padding: 10px;
			border: 20px solid red;
			width: 200px;
			height: 200px;
			background-color: blue;
		}
	</style>
</head>
<body>
	<div id="box"></div>
</body>
</html>

```

我们先来看一下比对效果：

![](./WechatIMG3.jpeg)
![](./WechatIMG4.jpeg)


我们发现标准盒模型的计算方式是：

	width = content

而IE盒模型是：

	width = 2 * border + 2 * padding + content

一句话描述区别： IE盒模型的width属性包括两倍的宽和两倍的边框再加上内容区域的宽度，标准盒模型width就是等于内容区域的宽度，padding和border属性依次撑开。两者的height属性亦是如此。

![](./WechatIMG5.gif)

##盒子模型的计算有margin吗？两个盒模型怎么切换呢？

###首先确定的是marign是盒模型的一部分。由于margin是盒子外部，也是就是元素之间的间距，一般来说，计算盒子<font color="red">（注意我这里表述的是盒子，不是盒模型）</font>大小的时候。我们会扣除它。

一般来说，标准的盒模型实际占用空间计算公式为：

* 水平空间大小 = 2 * margin + 2 * border + 2 * padding + width
* 垂直空间大小 = 2 * margin + 2 * border + 2 * padding + height

盒子占用空间计算公式为：

* 水平空间大小 = 2 * border + 2 * padding + width
* 垂直空间大小 = 2 * border + 2 * padding + height

###盒子模型的切换是用到了：

	box-sizing: border-box(标准盒模型) content-box（IE盒模型）
	
###最后一问： outline属性会影响到盒子的计算吗？

不会！！！