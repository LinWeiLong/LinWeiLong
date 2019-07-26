---
title: vue-wechat-title使用注意事项
date: 2019-07-24 23:47:53
tags: [微信, Vue, 技巧指南]
---
# 什么是vue-wechat-title
vue-wechat-title是一个npm包，用来解决SPA项目在微信下（iOS only？）title不会变化的问题。原理是在SPA路由发生变化的时候，动态插入一个iframe去请求favor.ico，然后去修改document.title，而微信在发现有请求的时候，就会刷新页面的title。借助这一特征，vue-wechat-title 做了这么一件事情，也算是解决了大家的一个痛点。但是我在使用的过程中，也遇到了一些问题，所以记录下来。

# 不能“滥用”
当SPA项目需要使用vue-wechat-title时，正确的使用方法应该是在一个根元素上指定 v-wechat-title="someThing"，someThing这个地方填写一个computed出来的变量或者其他的响应式数据。而不是在每一个路由Page上都写上一个v-wechat-title。

# 为什么不能滥用
现在官方文档好像已经写了我上面那样的用法，但是其实我之前有一些项目有“滥用”，但是也没什么问题发生。直到后来：公司有一个App需要嵌套一个SSR的页面，然后我们的SSR在client阶段“滥用”了v-wechat-title，结果造成了页面在刷新的时候，vue执行会有一个报错：TypeError: undefined is not an object (evaluating 'n._enterCb')，通过接入Safari控制台，观察调用栈发现，是vue-wechat-title调用了插入DOM（iframe）之后发生的，之后尝试去掉所有使用v-wechat-ttile的地方后，问题解决。再之后，改成只使用一个v-wechat-title，也没有问题。

个人猜测，应该是iOS的是webview对多次快速插入这个iframe做了一些限制，导致vue后面的回调异常。
