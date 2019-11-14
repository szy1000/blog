# javascript高频面试题-this指向

回忆当初刚入门前端的时候，每次刷this的指向问题都是一脸蒙蔽，只想说：this老哥，你到底要闹哪样啊？随着学习的深入，我今天也来总结一番。这一前端领域的高频面试题。

## 默认绑定
先来看一个代码

```javascript
var name = 'global'
function foo(){
	console.log(this)
	console.log(this.name)
}

foo()  //输出什么？
```

答案是： window 和 global

原因如下：

一、当我们在全局声明一个变量(name)的时候，就好比给window添加了一个name的属性。我们可以在控制台输入(window.name)，看看输出。二、当我们执行 foo() 的时候， 其实使用了默认的window这个全局对象。foo() 仅是 window.foo() 的一种简写。
三、由此可见，函数执行的时候使用了默认绑定，将this绑定到了全局对象window上。this.name就指向了全局的 name 

tips: 注意一下：

### 默认绑定有一坑

#### 一、如果在严格模式下面会略有不同

```javascript
var name = 'global'
function foo(){
	'use strict'
	console.log(this)
	console.log(this.name)
}

foo()  //输出什么？

```

答案是： undefined 和 Uncaught TypeError: Cannot read property 'name' of undefined

小tips: 把var改成let的话，this.name是无法访问到的。这个应该属于作用域那一块的。这里碰到了，顺便提一下。

```javascript
let name = 'global'
function foo(){
	console.log(this)
	console.log(this.name)
}

foo()  //window 和  undefined
```

## 隐式绑定
我们对上面的代码进行一点点修改

```javascript
var name = 'global'

function foo(){
	console.log(this)
	console.log(this.name)
}

var obj = {
	name: 'obj',
	foo: foo
}

obj.foo() // 输出什么呢？
```
 
 答案是： { name: 'obj', fn: f } 和  obj
 
 一、当 foo函数执行时，函数引用上下文对象时，隐式绑定会把函数中的this绑定到obj对象上
 二、因此this就等于obj

### 隐式绑定有一坑
这个坑，我之前刷面试题的时候，也遇到过。后来看了解析之后，醍醐灌顶一般清醒了。我们对上面的代码进行修改

```javascript
var name = 'global'

function foo(){
	console.log(this)
	console.log(this.name)
}

var obj = {
	name: 'obj',
	foo: foo
}

var fn = obj.foo

fn() // 输出什么？
```

答案是： window 和 global
为什么不是{ name: 'obj', fn: f } 和  obj呢？

我们看到的是fn对obj.foo的一个引用，但是实际上是foo的本身。fn就是不带修饰的函数调用。使用默认绑定

## 显示绑定

既然默认绑定和隐式绑定都有不确定性，那么就有显示绑定call apply bind来固定this的指向问题。
我们的每个函数都是拥有 call apply 和 bind的方法

```javascript
function sum (a, b) {
	return a + b
}

sum(1,2). //平常我们都是这样使用 其实还可以这样

sum.call(window, 1, 2)
sum.apply(window, [1, 2])
var foo = sum.bind({obj: '沈志勇说'})
foo(1,2)
```


​​​​

https://segmentfault.com/a/1190000017510043


https://juejin.im/post/5dc529e8f265da4d2c5ea572


https://zhuanlan.zhihu.com/p/63655183