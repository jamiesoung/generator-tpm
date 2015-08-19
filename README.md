# 突破前端脚手架（基础版）

这是一个比较基础的脚手架，可以生成开发所需要的目录结构，使用方法如下。

## 背景

对于一个前端开发团队，开发的规范化尤为重要，在投入开发之前我们需要先确定开发的目录结构，以保证开发的代码具有可扩展性、可维护性。为了保证规范的开发，我们确定目录结构时，就会出现频繁的创建文件，Ctrl + C,Ctrl + V的情况，为了避免这一情况，编写了此脚手架，可以快速生成规范的目录结构。

## 介绍


目录结构

```
├── build
├── demo
│   └── index.html
├── src
│   ├── c
│   │	 └── lib
│   └── p
│   	 └── index
│  			  ├── index.js
│   		  └── index.less
├── package.json
├── README.md
└── gulpfile.js
```
## 使用方法

1. install npm

```
// install npm 
npm install -g yo
npm install -g generator-tpm

```

2. init

```
yo tpm
```

## 目录文件介绍

* build

  build 文件用来存放打包压缩后的文件，也是最后的线上版本。

* src

  开发文件，未打包未压缩的代码，用于本地开发与调试
  
* demo

  页面的静态模板，用于本地开发与调试
  
* gulpfile.js

  代码的打包压缩
  
* package.json

  包管理文件
  
* dev

  打包未压缩文件，默认不会提交
  
  
## 生成目录结构后如何开发

在生成目录结构后要投入开发需要怎么做？

- 执行相应的命令打包编译文件


```
// 手动打包
  gulp

// 实现自动打包
  gulp watch
  
// 起本地服务器(如果已经有本地服务器无需使用此命令)
 gulp dev
 
```
 - js 开发

 类似于 node 的开发方式
 
 - less

 可以自动编译，无需手动操作

