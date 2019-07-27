---
title: 构造函数的发展和种类
date: 2019-07-26 23:51:48
tags: [javascript]
---

最近在重新翻阅《Javascript 高级程序设计》，读到了构造函数的种类的发展历程，发现自己之前只是有一个模糊的认识，停留在会用，或者知道怎么用，但是不知道个中原因或者发展历程，没有形成体系化的知识结构，现在借此机会来梳理一下。

# 创建对象的方法（构造函数种类）
1. 工厂模式
2. 构造函数模式
3. 原型模式
4. 组合模式：构造函数+原型模式
5. 动态原型
6. 寄生构造函数模式
7. 稳妥构造函数模式


## 一、工厂模式
工厂模式就是很简单的一个function里面生成一个对象，给对象赋予属性和方法之后return出来。

【缺点】生成的对象难以识别是什么类型。也就是说生成出来的东西不知道是什么class。

【示例】
```javascript
function createPersion(name, age, gender){
  let person = new Object()
  person.name = name
  person.age = age
  person.gender = gender
  person.sayHi = function(){
    console.log(`Hi, my name is ${this.name}`)
  }
  return person
}
```

## 二、构造函数模式
为了解决工厂模式的缺点，诞生了构造函数模式。

【原理】由于在JS的世界中，任何function在new操作符操作下，都会成为构造函数，用以创建特定类型的对象。构造函数中如果没有return语句，就会将构造函数的this（运行环境）return出来，如果有return语句的话，则是以return语句返回的内容为准。

new 操作符做了什么？

1. 创建一个新对象
2. 将构造函数的作用域赋给新对象
3. 执行构造函数的代码
4. return新对象

其实感觉就是将构造函数做的事情，包裹在new操作符里面做了。

---


【优点】
1. 方法内部无需显式创建对象
2. 直接将方法和属性赋值给this
3. 没有return
4. 可以通过实例的（ constructor属性 || isntanceof方法better ）来判断对象类型
   1. 通过instanceof方法，判断只要是实例中包含的继承过的类的都算true

【缺点】构造函数中的方法，会重复生成，每生成一个实例都会生成一堆对应的方法，而且互不相等。在下面的例子中，Tom和Li Lei都有sayHi方法，虽然做的都是一样的事情，但是都各自生成了一个。会造成浪费。

缺点的丑陋解决办法，将方法都挂在共享的作用域下，去读取，但是没有形成封装性。详见示例2。

【示例】
```javascript
function Person (name, age, gender) {
  this.name = name
  this.age = age
  this.gender = gender
  this.sayHi = function(){
    console.log(`Hi, my name is ${this.name}`)
  }
}

let person1 = new Person('Tom', 16, 'male')
let person2 = new Person('Li Lei', 18, 'male')

console.log(person1.sayHi === persion2.sayHi) // false

// 这样执行的话Mary等属性会在window下，因为Person执行的时候this在window上
Person('mary', 26, 'female')
```
【示例2】

```javascript
// 【缺点】的丑陋解决办法
function sayHi(){
    console.log(`Hi, my name is ${this.name}`)
  }
function Person (name, age, gender) {
  this.name = name
  this.age = age
  this.gender = gender

  // 使用挂在全局的共享方法，但是方法一多怎么办？
  this.sayHi = sayHi
  this.sayHi2 = sayHi2
  this.sayHi3 = sayHi3
  // ....无穷无尽，代码也丑陋......
}
```


## 三、原型继承
【原理】原型继承的思想就是将属性和方法都挂载在构造函数的prototype对象上，这个对象的作用就是包含这个构造函数的类型的所有共享属性和方法。其实名字叫“原型”已经挺好理解了，就是所有实例的一个母版，原型上有的，实例都有。

*了解原型继承需要对原型和原型链有所了解，这个段落不做介绍，日后写一个文章专门说明。*

【优点】封装在一起，可读性比较好，方法都可以共用。能设置默认值（书中认为是一个缺点，看各人理解吧）。

【缺点】prototype上挂载的属性或者方法，是所有实例所共享的。一旦其中示例中的一个引用类型被进行了修改，那么所有其他实例中的值也会被改动到（引用类型都是指针）。

【实例】
```javascript
function Person () {}
Person.prototype.name = 'Tom'
Person.prototype.age = 18
Person.prototype.gender = 'male'
Person.prototype.sayHi = function(){
  console.log(this.name)
}

let person1 = new Person()
console.log(person1.name) // 'Tom'
```


## 四、组合模式：构造函数+原型模式
组合继承很好理解，就是取构造函数模式和原型模式的优点作为类的一个构造模式，由于取了两种模式的优点，所以叫组合继承。

- 属性，由构造函数模式处理。
- 方法，由原型模式处理。

【优点】封装化（从前端角度看）。属性独立，方法公用。

【缺点】属性和方法分开声明，不是在同一个方法包裹（从其他OO语言角度）。

【实例】
```javascript
function Person(name, age, gender) {
  this.name = name
  this.age = age
  this.gender = gender
}
Person.prototype.sayHi = function(){
  console.log(this.name)
}

let person1 = new Person('Tom', 16, 'male')
let person2 = new Person('Li Lei', 18, 'male')

console.log(person1.sayHi === persion2.sayHi) // true
```

## 五、动态原型
动态原型是在组合模式上进行了一点小“优化”

【优点】优化封装。

```javascript
function Person (name, age, gender) {
  this.name = name
  this.age = age
  this.gender = gender
  // 这里判断条件是一个必须会有的方法就行，不用每个都判断
  if(typeof this.sayHi !== 'function') {
    // 开始给原型赋值方法们
    Person.prototype.sayHi = function (){
      console.log(this.name)
    }
  }
}
```

## 六、寄生构造函数模式


## 七、稳妥构造函数模式
