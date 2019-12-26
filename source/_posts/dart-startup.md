---
title: Dart语言入门
date: 2019-12-26 23:54:19
tags:  [Dart]
---

之前在微信文章评论点赞收到了一本Flutter入门与实战，于是以此为契机来学习一把Flutter的技术栈。这篇文章主要是介绍Dart语言的一些基本语法。

# 1. 变量与基本数据类型

声明操作：
```Dart
var name='小明';`

var name2 // 未赋值默认值是null
if(name2 == null) // true
```

## 1.1 常量和固定值
以 `final` `const` 关键字声明：
```Dart
final username = '张三'; // final 的值只能被设定一次
username = '李四'; // 会报错

const pi = 3.1415926;
const area = pi*100*100;

final stars = const []; // const 关键字可以作为构造函数创建常量
const buttons = const [];
```

## 1.2 基本数据类型

Dart 常用基本数据类型包括：Number、String、Boolean、List、Map

### 1.2.1 Number类型
Number下面还包括int（整型）和double（浮点）
- 整型：取值范围-2^53 ~ 2^53
- 浮点型：64为长度的浮点型数据，双精度浮点型

基本操作四则运算（+ - * /）和位移操作 >>.

常用方法：abs、ceil、floot。

### 1.2.2 String 类型
```dart
var str = '字符串哈哈哈'
var str2 = "双引号也行"
var str3 = str +str2 // 合并字符串

var multi_line_string1 = '''这个是一个
多行的
文本
类似
JS的 ``'''
var multi_line_string1 = """这个是一个
双引号
也
可以"""
```

### 1.2.3 Boolean 类型
Boolean 是true or flase 的类型。在Dart当中，没有隐式转换，只有真的是true的bool类型才是这真的 true。
```dart
var sex = 'male'
if(sex) { // 实际上在编译的时候会报类型错误
  print('this people is a man') // 不会执行
}
```

### 1.2.4 List 类型
具有一系列相同类型的数据，称为List对象。类似于JS中的Array（不过JS的Array没要求内容一定要一样就是了）。索引那些也都一样，不多说了。

```dart
var list1 = [1,2,3];
print(list1.length); // 3
print(list1[0]); // 1
```