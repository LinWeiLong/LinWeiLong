---
title: 算法学习之题目记录
date: 2019-10-10 23:25:45
tags: [算法]
---
# 开坑声明
之前买了极客时间的一个《算法面试通关40讲》的课程，里面有提到的题目，打算以笔记的形式记录下来，一个题目的思考分析过程和自己的实现结果。

废话不多说，马上开始。

# 第一题：链表反转
题目描述：反转一个**有序**单链表。
```
 输入: 1->2->3->4->5->NULL
 输出: 5->4->3->2->1->NULL
```

## 解题思路
像视频里面说的，链表的这个题目思路或者说肉眼看上去就感觉比较简单。就是将链表里面的指针都反转一次。

步骤细化：
1. 将大问题分成若干个小问题，整个链表的反转，实际上是每一个链表节点的next指针从本来指向的元素改成上一个元素。
2. 替换指针，
    1. 理解当前节点cur、当前节点的上一个节点prev、当前节点的下一个节点nextNode，三个概念和对应的临时变量
    2. 先将cur的next存起来，准备推进流程用
    3. 修改cur.next = prev
    4. prev 已经被用掉了，所以要更新 prev = cur，当前节点变成了别人的prev
    5. 最后更新cur = 第2步存的nextNode，将原来的下一个节点推为新的cur
3. 边界情况，当前节点没有next指针了

实际上我自己写的时候，是有问题的，没有用到prev这个临时变量去存储上一个的指针，自以为JS的引用类型，直接将cur和nextNode的next递归去修改，也没想着利用最后一个节点必然是null的情况去去占位prev。

下面是我在力扣上提交的代码，还有改进的空间。现在用的是while写的，还可以用递归去写一个版本，看下这周有没有时间去做。

## 我的代码
```javascript
// 初次成功版
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {ListNode}
 */

 reverseList = function(head) {
    // if(head.next === null) {
    //     // handle too short
    //     return head
    // }

    let prev = null,
        cur = head,
        nextNum,
        temp
    while(cur) {
        nextNum = cur.next
        cur.next = prev
        prev = cur
        cur = nextNum
        nextNum = nextNum? nextNum.next: null
    }
    return prev
};

reverseList()
```