## 项目计划
这会是一个导航网站，提供（自定义）json文件加载的功能。

站点使用cookie存储配置文件信息，所以必须有一个[cookie-editor](https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm)才能正常使用本站,至于cookie格式还未定，目前建议参考提供的默认cookie。

icon 需要自行上传到图床，相信你有使用 figma 等网站自行绘制漂亮图标的能力。

![demo](https://i.ibb.co/0KTSQwY/Copy-Q-VZWv-Ov.png)
## 使用说明
- [示例站点站](http://124.223.57.166/watchTV2/watchTV/a-plan/) （定期每小时从github拉取最新代码）
- [json示例](http://124.223.57.166/watchTV2/watchTV/a-plan/icon_data.json) （亦可以参考本项目 `a-plan/icon_data.json`）
- [图床推荐](http://tool.mkblog.cn/tuchuang/) （第三方图床）

**如何添加自己的json?**

1. 上传自己的json文件到任意服务器，确保网络可以访问到。
2. 使用 [cookie-editor](https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm) 增加一个cookie，格式可以参考默认生成的 `icon_data.json` ，
3. 保存后刷新页面，即可在左上角下拉菜单看到自己的配置文件。

配置迁移可用使用 [cookie-editor](https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm) Export 功能。

---

cookie格式如下，不能包含分号
```
icon_data.json|视频站|📺|linear-gradient(-20deg, #047272 0%, #1d1035 100%)
json文件位置|h1标题名称|emoji|背景色
```
## 站点安全性

自建/分享json文件建议使用 github ，上传json文件后查看 raw 格式：比如 https://raw.githubusercontent.com/cornradio/watchTV/main/a-plan/icon_data.json 
是本项目的默认json配置 ，把这个网址链接作为json文件位置，书写在cookie中即可。

你可以在本项目的 issue 中分享自己的导航站点。
或者可以进行pull request，把自己的json文件添加到本项目中。

## 实现进度
- [x] 项目基础框架
- [x] 分页加载图标的功能
- [x] 右键菜单的功能
- [x] 手机端适配宽度支持
- [x] json文件加载功能
- [x] json配置切换功能
- [x] json配置存储功能（通过cookie）
- [x] 存储默认位置（修改_defaultjson的内容来实现）
- [x] 支持get url参数来加载json(访问http://127.0.0.1:5500/a-plan/?name=icon2_data.json即可加载icon2_data.json ，适合保存到书签)
- [x] 从 cookie 中加载 [grabient](https://www.grabient.com/) 背景色的功能
- [x] 点击emoji切换网站
- [x] 自动同步emoji和网站图标、网站名称
- [ ] 创作与分享json的mini社区（计划用github）

## 项目结构
文件夹|内容|
---|---
a-plan | 项目本体
👇测试👇 |👇测试👇 
cookie-editor | cookie编辑器
cookie-generate-select | 从cookie生成select菜单
json-data-in-table-with-javascript | js将json数据生成表格
select-on-change | select的onchange事件
