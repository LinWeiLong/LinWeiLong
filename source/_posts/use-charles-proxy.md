---
title: 使用Charles进行抓包调试以及注意事项
date: 2019-07-09 00:13:05
tags: [调试, 抓包, 技巧指南]
---

# 什么是抓包
抓包，就是对某些设备进行正向代理，借此查看其发出的http/https请求。所抓的包就是http请求。抓包一般用于网络调试，观察程序运行状况等情况。抓包工具有很多，比如fiddler、Charles等等。下面以Charles为例进行介绍。

# Charles 的安装与配置
Charles的安装就比较简单了，一直按下一步就行了。需要注意的是配置，依次点击：（菜单栏）Proxy--Proxy Settings -- Proxies
![设置端口号和勾选Enable transparent HTTP proxying](http://ww4.sinaimg.cn/large/006tNc79gy1g5bce3trrvj30ww0s2n00.jpg)

# Charles 的使用
当我们需要对网页或者App进行抓包分析的时候，需要先将手机连接上跟电脑同一个局域网，然后打开手机的网络设置-高级-设置代理，IP填写电脑的IP，端口号填上面设置的端口号，一般是8888。然后在手机上操作，就可以看到http的请求了。但是还是看不到https的，因为https是加密过的请求。那我们要看怎么办呢？就需要安装一个证书才行。

# 证书安装
点击 Help - SSL Proxying，可以看到有多个选项，我们一般选择第三个，install Charles Root Certification on a mobile device or a remote broswer，表示在移动设备或者浏览器安装Charles根证书。点击之后，会提示访问 chls.pro/ssl，在不同平台下的设备有不同操作。

## iOS证书安装
在iOS下，用Safari访问后，会询问是否安装描述文件
![](http://ww1.sinaimg.cn/large/006tNc79gy1g5bcs4aozcj30ku112gpa.jpg)

选择是，然后打开设置-一般设置-描述文件，选择安装
![](http://ww2.sinaimg.cn/large/006tNc79gy1g5bct6q38sj30ku112gnw.jpg)

最后在一般设置-关于本机（拉到最下面）-证书信任设置-选择信任证书就好了
![](http://ww4.sinaimg.cn/large/006tNc79gy1g5bcusarf4j30ku112771.jpg)
![](http://ww3.sinaimg.cn/large/006tNc79gy1g5bcvacjyqj30ku1120ux.jpg)

## 安卓手机证书安装
安卓手机的话比较麻烦一些，同样是访问 shls.pro/ssl，但是需要使用非原厂浏览器访问，要下载到rem格式的证书文件，不能是crt（crt下载下来安装不了），然后在网络设置，高级选项，选择安装证书，然后去到下载rem证书文件的目录下选择rem文件进行安装。

我的是小米手机，有这个限制，不知道其他牌子的是不是也一定要rem文件了。
