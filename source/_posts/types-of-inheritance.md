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

【定义】通过将子类的构造函数原型指向父类的实例，来达到继承的目的。

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

## 二、借用构造函数继承

【定义】在子类构造函数的内部调用超类型构造函数。

【缺点】

1. 方法都在借用构造函数内声明，不复用
2. 方法都在超类内部，不透明

【实例】

```javascript
function SuperType() {
  this.color = ['red', 'blue', 'green']
  // 【缺点】方法们必须写在构造函数里面
  this.sayColor = function() {
    alert(this.color)
  }
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

## 三、组合继承/伪经典继承

【定义】组合继承，也叫伪经典继承。通过将借用构造函数和原型链两者的技术（优点）组合在一起，用原型链处理属性+方法，用借用构造函数的方法去实现对实例属性的继承。

【优点】

1. 用原型链实现对原型属性和方法的继承
2. 通过借用构造函数实现对实例属性的继承

【缺点】要执行 2 次超类的构造函数，一次是在构造函数里面，另一次是要生成被子类继承的实力的时候。

【实例】

```javascript
function SuperType (name) {
  this.name = name
  this.color = ['red', 'blue', 'black'],
}
SuperType.prototype.sayName = function () {
  return this.name
}

function SubType (name, age) {
  // 借用构造函数，对name属性的继承独立挂载
  SuperType.call(this, name)
  this.age = age
}
// 指向原型，建造原型链关系
SubType.prototype = new SuperType()
// 重新指定构造函数
SubType.prototype.constructor = SubType
// 重写sayName方法
SubType.prototpye.sayAge = function () {
  alert(this.age)
}

let instance1 = new SubType('Tome', 29)
instance1.color.push('yellow')
alert(instance1.color) // ['red', 'blue', 'black', 'yellow']
instance1.sayName() // Tom
instance1.sayAge() // 29

let instance2 = new SubType('Mary', 19)
instance2.color // ['red', 'blue', 'black']
instance2.sayName() // Mary
instance2.sayAge() // 19
```

## 四、原型式继承

【定义】原型可以基于已有的对象创建新的对象。创建一个空的方法，然后将要继承的实例给予空的方法，再用新的方法创建新的实例，就完成了对超类的继承。

【优点】不用创建一个超类的实例去给子类继承。

【缺点】跟原型链继承一样，实际上原型式继承就等于原型链继承的一个马甲。

```javascript
function Object(o) {
  // o 可以是一个实例或者一个原型，o被所有Object方法创建的饭实例所共享。
  function F() {}
  F.prototype = o
  return new F()
}
```

## 五、寄生式继承

【定义】在一个方法内部，借用另一个方法去复制原有的对象，然后对克隆体进行赋值，最后返回克隆体。

【特点】产生的克隆体跟构造函数没什么关系，克隆体是通过内部的方法复制出来的，原型链指向的是本体的原型。

```javascript
function createAnother(origin) {
  var clone = object(origin)
  clone.sayHi = function() {
    console.log(this.name)
  }
  return clone
}

var person = {
  name: 'tom',
  age: 18
}

var anotherPerson = createAnother(person)
anotherPerson.sayHi() // tom
```
