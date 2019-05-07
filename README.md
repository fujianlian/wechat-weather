# 天气

本项目主要实现了获取当前位置，从服务器请求天气数据展示在页面上，适合小程序初学者（ps：天气数据为虚拟数据）

## 页面展示

![1](./images/1.png) | ![2](./images/2.png) | ![3](./images/3.png) |
| :--: | :--: | :--: |
| 1 | 2 | 3 |

## 运行项目

1. 安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

2. 下载源码，打开微信开发者，选择小程序导入源码，**AppID改为自己申请的**，或者手动在**project.config.json**文件中修改**appid**的值

3. 运行项目，如果遇到数据请求失败，点击右上角 **详情** ——> **项目设置**，将最底下 **不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书** 勾选上，自己注册的AppID可以在[微信公众平台](https://mp.weixin.qq.com/)添加合法域名，就无需勾选

4. 项目中使用到腾讯位置服务获取城市名，相关知识可以[参考](https://lbs.qq.com/qqmap_wx_jssdk/method-reverseGeocoder.html)这篇文章

## 进阶学习项目

* [闲读 ∙ 资讯(新闻类 项目实战)](https://github.com/fujianlian/leisure-news)

* [Mall(商城类 项目实战)](https://github.com/fujianlian/mall)

* [侃影评(影评类 项目实战)](https://github.com/fujianlian/movie)

## 后记

如果你觉得对你有帮助的话，顺手 **点个Star**，笔者需要您的支持