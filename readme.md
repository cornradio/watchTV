## 项目计划
这会是一个导航网站，提供（自定义）json文件加载的功能。

站点使用cookie存储配置文件信息，所以必须有一个[cookie编辑器（插件）](https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm)才能正常使用本站,至于cookie格式还未定，目前建议参考提供的默认cookie。

icon 需要自行上传到图床，我们相信你有使用 figma 等网站自行绘制漂亮图标的能力。

## 使用说明
- [示例站点站](http://124.223.57.166/watchTV2/watchTV/a-plan/) （定期每小时从github拉取最新代码）
- [json示例](http://124.223.57.166/watchTV2/watchTV/a-plan/icon_data.json) （亦可以参考本项目 `a-plan/icon_data.json`）
- [图床推荐](http://tool.mkblog.cn/tuchuang/) （第三方图床）

## 实现进度
- [x] 项目基础框架
- [x] 分页加载图标的功能
- [x] 右键菜单的功能
- [x] 手机端适配宽度支持
- [x] json文件加载功能
- [x] json配置切换功能
- [x] json配置存储功能（通过cookie）
- [ ] 从 cookie 中加载 [grabient](https://www.grabient.com/) 背景色的功能
- [ ] 点击emoji切换网站
- [ ] 自动同步emoji和网站图标、网站名称
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
