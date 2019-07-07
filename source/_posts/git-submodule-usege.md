---
title: Git submodule使用指南
date: 2019-06-25 21:00:19
tags: [git, 工作/基础建设/技巧指南]
---

## 问题场景
相信任何开发，都会遇到一种情况。在做不同的项目，但是又都会使用到一些常用的方法/组件/代码块等等。
作为一个追求优雅的开发人员，肯定不能接受一段代码到处复制粘贴的操作。而且一旦这段代码日后需要更新，到处粘贴的话就需要全局搜索然后含泪修改了。
那么有没有一种办法，能够作为一些公共代码的“栖息地”，可以做到一处编写，到处使用呢？

*答案是有的。*
---

## 寻找工具
经过在知名404网站上一番搜寻，找到了Git内置的一个功能：submodule。

### 什么是submodule

> 有种情况我们经常会遇到：某个工作中的项目需要包含并使用另一个项目。 也许是第三方库，或者你独立开发的，用于多个父项目的库。 现在问题来了：你想要把它们当做两个独立的项目，同时又想在一个项目中使用另一个。
>
> Git 通过子模块来解决这个问题。 子模块允许你将一个 Git 仓库作为另一个 Git 仓库的子目录。 它能让你将另一个仓库克隆到自己的项目中，同时还保持提交的独立。
---

## 如何使用
### 添加子模块
```git
# 直接clone，会在当前目录生成一个someSubmodule目录存放仓库内容
git submodule add https://github.com/chaconinc/someSubmodule

# 指定文件目录
git submodule add https://github.com/chaconinc/someSubmodule  src/submodulePath
```

新增成功之后，运行`git status`会在父仓库发现增加了2个变化
1. new file:   .gitmodules
2. new file:   someSubmodule（实际上并不是一个file）

展开说说：
1. 什么是.submodules
.submodules是记录当前项目的子模块配置的文件，里面保存了项目 URL 与已经拉取的本地目录之间的映射。

2. 子模块目录
在新增完子模块之后，执行`git status`之后，会看到类似下面的信息
```
$ git diff --cached someSubmodule
diff --git a/someSubmodule b/someSubmodule
# 重点是下面这行的 160000
new file mode 160000
index 0000000..c3f01dc
--- /dev/null
+++ b/DbConnector
@@ -0,0 +1 @@
+Subproject commit c3f01dc8862123d317dd46284b05b6892c7b29bc
```
虽然someSubmodule是父仓库里面的一个目录，但是Git并不会列出里面所有的变化，而是会当做一个特殊的提交。
PS：160000模式。 这是 Git 中的一种特殊模式，它本质上意味着你是将一次提交记作一项目录记录的，而非将它记录成一个子目录或者一个文件。

### clone已经包含子模块的项目
正常clone包含子模块的函数之后，由于.submodule文件的存在someSubmodule已经自动生成。但是里面是空的。还需要执行2个命令。
```
# 用来初始化本地配置文件
git submodule init
# 从该项目中抓取所有数据并检出父项目中列出的合适的提交(指定的提交)。
git submodule update
------------------更好的方式---------------------
# clone 父仓库的时候加上 --recursive，会自动初始化并更新仓库中的每一个子模块
git clone --recursive https://github.com/chaconinc/MainProject
```

### git submodule 工作流
当一个项目里面包含子模块的时候，不仅仅需要对父仓库进行版本管理，子模块目录下也是存在版本的。那在不同的父仓库下面如何进行子模块的版本管理也成为新的问题。

最简单的办法，就是主项目只专注使用子模块的master分支上的版本，而不使用子模块内部的任何分支版本。

操作如下：
```git
cd submodulePath
git fetch
git merge origin/master
```
此时在主项目就能看到submodule目录已经更新了。
当然这也操作有点不方便，下面是更简便的方法：
```git
# Git 将会进入子模块然后抓取并更新，默认更新master分支
git submodule update --remote
```
如果需要更新其他分支的话，需要另外配置。
```
# 将git submodule update --remote 的分支设置为stable分支
git config -f .gitmodules submodule.DbConnector.branch stable
```
---

## 注意事项
我个人认为，子模块在使用的过程才是最值得注意的地方，所以也没有跟上面的内容一起作为“增删改查”系列写下去。
“改” 我认为是最重要的一环。其中又可以分为：
1. 对本地的子模块进行修改
2. 更新他人修改的子模块内容

### 对本地的子模块进行修改
上面提到更新子模块的操作
```
git submodule update --remote
```
但是此时的子模块是出于一个特殊的状态，虽然上游的变化被更新到了本地，但是本地子模块会处于一个*游离的HEAD*状态。

在HEAD状态下，如果将本地修改的内容进行commit，是不会“附着”到任何分支上的。*游离的内容，会在切换分支之后消失。*

*那怎么操作才是正确的呢？*
1. 先进入子模块，然后检出一个分支。
2. 再执行commit等本地操作
3. 执行`git submodule update —remote —merge`，将上游的变化合并到本地的这个分支上。如果你忘记—rebase或—merge，Git 会将子模块更新为服务器上的状态。并且会将项目重置为一个游离的 HEAD 状态。要弥补这个错误的话，重新执行1和3就可以了。

4. 如果本地的文件跟上游文件出现冲突，则按照普通解决办法解决了再提交就好了。
5. 发布改动（推送）：在父仓库执行`git push`时添加` --recure-submodule` 参数，此参数表示递归子模块，可以设置为2个值“check”和“on-demand”。check会使没推送子模块的父仓库本身推送失败。而on-demand会尝试自动推送子模块后再推送父仓库，如果子模块由于其他原因失败，那么父仓库也会推送失败。

### 合并子模块的改动
根据Gitbook的描述，这是当同一分支在本地和上游出现了不同分叉，需要进行合并的时候，并且二者不是祖先和后代的关系（或者说不是一条分子上的提交）。

操作方法如下：
1. 对上游的提交，进行检出分支
2. 将1检出的分支，合并到本地
3. 解决冲突
4. 回到主项目
5. 检查子模块的记录
6. 解决子模块冲突
7. 提交主仓库合并

### 一些我个人的理解
子模块的使用上面说得可能还是有点比较绕，我个人认为比较合适我们团队的子模块工作流应该比较简单。

1. 主项目需要在自模块上开发新功能时，需要在主项目内的子模块开新分支，然后进行开发
2. 子模块的代码需要独立提交，形成commit信息记录在主仓库
3. 由于主项目最终也是需要进行打包的，所以子模块的版本只要是基于master，就认为是可信的
4. 最后主项目的整个版本经过验证需要上线后，则将子模块的分支合并到子模块的master分支上，那么下一个进行子模块开发的人，就会包含到最新的代码


参考文档：
1. [Git - 子模块](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97)