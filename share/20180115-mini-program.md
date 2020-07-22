# 分享：小程序开发入门

## 小程序技术

- 小程序原理
  - 视图层(WebView) __<=>__ 逻辑层(JavaScriptCore)。两个层之间通过evaluateJavascript进行交互：逻辑层向视图层传递数据，视图层向逻辑层传递事件。
  - 视图层：wxml, wxss, [wxs](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxs/)
  - 逻辑层：JS环境+微信API
- 封装了一些通用组件，简化了很多标签
  - swiper, picker, map, ...
  - [小程序组件](https://mp.weixin.qq.com/debug/wxadoc/dev/component/)
  - [自定义组件](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/custom-component/)
- JS环境新增了原生相关API，减去了浏览器相关的API
  - 微信登录API，多媒体API，网络请求API，...
  - [小程序API](https://mp.weixin.qq.com/debug/wxadoc/dev/api/)
- 已知的一些问题（原生组件bug、能力缺失...）
  - 部分组件是通过原生实现：input, canvas, map
  - 原生组件层级最高无法被遮盖、input聚焦失焦字体不一致、input定位不准
- 微信开发工具
  - 预览、调试
  - 上传

## 小程序项目

- 项目目录结构介绍
- 兼容组件方案介绍
  - 为什么引入？
- 发布运营等介绍
  - 开发上传
  - 管理员提审发布
- 有待改进的地方
  - 代码ES6+化
  - 模块化

## 参考

- https://mp.weixin.qq.com/s/9PID6UJsQyB06xdyOkEVOA