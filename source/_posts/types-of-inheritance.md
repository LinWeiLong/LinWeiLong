---
title: JS 中的继承
date: 2019-08-01 23:47:50
tags: [javascript]
---

在其他 OO 语言当中，接口继承和实现继承。但是 JS 只支持实现继承。JS 的继承通过原型链来实现。

# JS 继承的几种方式

1. 原型链继承
2. 借用构造函数
3. 组合继承
4. 原型式继承
5. 寄生式继承
6. 寄生组合式继承

## 一、原型链继承

通过将子类的构造函数原型指向父类的实例，来达到继承的目的。

【缺点】

1. 构造函数被替换
2. 在子类上挂载方法，要在替换完原型之后，因为整个原型换掉了
3. 父类（父实例）上的引用类型的属性，会被子类的各种实例公用

【实例】：

```javascript
fucntion SuperType () {
    this.property = true
}

SuperType.prototype.getSuperValue = function () {
    return this.property
}

function SubType () {
    this.subproperty = false
}

SubType.prototype = new SuperType()

SubType.prototype.getSubValue = function () {
    return this.subproperty
}

var instance = new SubType()
// instance 从SuperType继承了方法和属性
instance.getSuperValue() // true
```

## 借用构造函数继承

定义：在子类构造函数的内部调用超类型构造函数。

【缺点】

1. 方法都在借用构造函数内声明，不复用
2. 方法都在超类内部，不透明

【实例】

```javascript
function SuperType() {
  this.color = ['red', 'blue', 'green']
}

function SubType(params) {
  // 将SuperType执行一遍，东西都挂在this上面
  SuperType.call(this, params)
}

var instance1 = new SubType(params)

instance1.color.push('black') // ['red', 'blue', 'green', 'black']

// 各自独立，因为各自用各自的this造的
var instance2 = new SubType(params)

instance2.color // ['red', 'blue', 'green']
```
