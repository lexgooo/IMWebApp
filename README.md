# IMWebApp（第一版）
自己用来学习react 和 typeScript 的练习项目，目的是快速学会使用 react 和 typscript

## 第一版的指导方案  
- 尽快出成品。  
- 产品思路和设计稿能抄就抄别人的。
- im 后端相关尽量使用腾讯免费的 im sdk 。  
- 尽量少涉及后端功能。如果有使用 node js 写。可以使用框架，也尽量使用 typescript
- 前端代码使用 react + typescript 写。

## TODO List
- [ ] 画出产品原型
    - [ ] 画出简单的产品思维导图
    - [ ] 画出产品交互逻辑原型
    - [ ] 画出前后端的交互逻辑和技术选定
- [ ] 抄别人的或者设计出一个产品设计稿
- [ ] 开发
    - [x] 前后端分离
    - [ ] 在根目录配置启动命令
        - [x] 前端启动
    - [ ] 前端部分
        - [x] 初始化项目
        - [x] 使用 react-router
            - [x] 改变默认标签的样式
            - [x] 根据当前路由改变导航样式
        - [x] 新增标题条组件
        - [x] 新增导航栏组件
        - [ ] 消息页
            - [x] 实现部分 `border` 下划线效果
        - [ ] 联系人页
            - [x] 根据当前顶部联系人首字母显示其首字母
        - [ ] 个人中心页

## 疑问收集
- [ ] 如何区分类型和接口的用法？理解接口的使用
- [ ] 如果不用 window.location 怎么在 router 的子组件中获得当前路由对象
- [x] 外挂的 css 文件怎么自动加上前缀  
    样式使用 styled-components 和 styled-components-ts 来处理
- [ ] moment.js 的本地化设置没有起效
- [ ] 如何监听滚动事件