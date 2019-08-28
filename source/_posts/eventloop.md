---
title: JS中的setTimeout和promise是怎么回事？详解event loop机制
date: 2019-08-28 22:19:01
tags: [javascript]
---

# 前言

在说内容之前，先发一道面试题，内容如下：
```javascript
//例题1
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('script end');
```

这个题目比较简单，应该能够看出来结果是：script start -> script end -> promise1 -> promise2 -> setTimeout

那为什么是这个顺序呢，结合一些网上的文章，我尝试用自己的理解或者说法去记录这个知识点。

# 浏览器内核渲染进程介绍

在浏览器的每一个Tab，都被认为是一个渲染进程，渲染进程内部分为多个线程，这多个线程之间相合作，各自管理着各自专注的领域的事情：
1. GUI渲染线程
   - 渲染页面，计算布局和绘制样式
   - 重绘和回流时会执行
   - 和JS引擎线程互斥 （防止结果混乱不可预期）
2. JS引擎线程
   - 解析和执行JS代码
   - 单线程
   - 和GUI渲染互斥（防止结果混乱不可预期）
3. 事件触发线程
   - 管理事件的循环，鼠标点击/滚动、setTimeout、ajax
   - 在达到条件时，将回调方法放入JS引擎的执行队列
4. 定时器触发线程
   - setTimeout和setInterval的管理线程
   - 定时任务由定时器触发线程计时（如果定时器不多的页面，这个线程岂不是很空闲）
   - 当计时完毕，通知事件触发线程
5. 异步http请求线程
   - 发起和处理异步请求的线程
   - 当请求完成，有回调时，通知事件触发线程干活

# Event loop机制介绍

![Eventloop 介绍](http://ww3.sinaimg.cn/large/006y8mN6gy1g6frdhv7ecj30k00bmmxw.jpg)

首先我们要明确一个点，JS是从上而下执行的，然后遇到异步的方法的时候，再去进行一些处理，这个异步处理的机制就是要去了解的Event loop。

在JS执行过程中，浏览器分配堆内存去存储数据，而JS方法的执行上下文（调用栈）则是如同其名，是用栈结构存储的。

在浏览器JS执行的过程中，遵守一种策略：
1. 执行栈里面的任务，遇到异步的任务，先交给对应的线程去处理
2. 执行完栈内的任务后，询问事件触发线程，是否有新的回调（来自多处）可执行，有的话，执行栈被重新添加任务执行
3. 重复1-2步

# 那什么是宏任务、什么是微任务呢？

我觉得说这两个之前，得先解释一下浏览器的JS引擎线程跟GUI线程之间的执行顺序先。上面提到这两个线程是互斥的，那么就有一个机制，让他们能够有序地执行。这个机制，就是轮流...对就是这么简单。JS引擎执行完，轮到GUI引擎执行一下，如此往复：JS -> GUI -> JS -> GUI。那么又有新的问题了，JS引擎怎么才叫执行完一次呢？其实就是上面Event loop机制提到的第一步执行完了就算一次执行完。

一个执行栈的同步执行的代码，被认为是`宏任务`。

eg1：
```javascript
document.body.style = 'background:black';
document.body.style = 'background:red';
document.body.style = 'background:blue';
document.body.style = 'background:grey';
// body的颜色只会变一次，因为都是同步的，同一个宏任务内执行完成。
// 去到GUI引擎那里只会认为是要把背景色变成灰色
```

eg2:
```javascript
document.body.style = 'background:blue';
setTimeout(function(){
    document.body.style = 'background:black'
},0)
// body背景色先变蓝然后马上变黑
// 说明是分成2次宏任务执行，第一次变蓝，然后GUI执行了，第二次宏任务设置变黑，然后GUI再执行
```

那说完宏任务，*什么是微任务*?

`微任务`是在宏任务执行指挥立即执行的任务。包括Promise.then process.nextTick

微任务在宏任务和GUI之间执行。所以上面的JS -> GUI -> JS -> GUI流程可以改成：宏任务 -> 微任务 -> GUI -> 宏任务 -> 微任务 -> GUI ···

eg3:
```javascript
document.body.style = 'background:blue'
console.log(1);
Promise.resolve().then(()=>{
    console.log(2);
    document.body.style = 'background:black'
});
console.log(3);
// 输出1 、 3、 2
// GUI : 背景直接变黑，没有变蓝
```


图示：

![任务流程](http://ww2.sinaimg.cn/large/006y8mN6gy1g6ftkm4jztj30at0gpmxk.jpg)


# 参考文章
[从多线程到Event Loop全面梳理](https://juejin.im/post/5d5b4c2df265da03dd3d73e5)
[JS(浏览器)事件环 (宏、微任务)](https://juejin.im/post/5d552275e51d456201486e24)
