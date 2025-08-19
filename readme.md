## 项目简介
一个基于纯前端的「启动页」：
- 每个图标均可右键，前往快速菜单
- 图标很多时支持分页
- 支持手机宽度/ipad宽度/pc宽度自适应排列

## 在线预览
- 测试页面：https://tva.cornradio.org/
<img width="2853" height="1461" alt="image" src="https://github.com/user-attachments/assets/2186536c-0e04-4e30-9bcd-1a73b5d8930e" />


## 快速开始
1. 克隆或下载本仓库。
2. 进入项目根目录后启动本地静态服务器：
   - Windows：双击 `localhttpserver.bat`（基于 Python 内置 `http.server`，默认端口 8900）
   - macOS/Linux：运行 `./localhttpserver.sh`
3. 浏览器打开：`http://localhost:8900/a-plan/` 即可使用

## 部署建议
- 这是纯静态站点，可部署到 Nginx。

## 使用说明
- 点击图标打开站点；
- 右键图标打开对应的快捷菜单，快速前往相关站点。
- 下拉框/emoji 行 用于「切换」json 配置文件。（因为safari不支持emoji行，所以使用下拉框作为备选）
- 「💻/📱」按钮用于切换移动端模式（在手机上选择右键菜单时使用）。

## 程序结构
- /a-plan 目录是程序本体
- index.html 是主页
- xxx.json 是数据文件，包括图标、右键菜单的信息
- /a-plan/imgs 是图标文件夹，但是你也可以用在线图床
- 其他的文件夹都是测试 demo，可以删除

### 键鼠快捷操作
- 翻页：`W / ↑ ` 上一页；`S / ↓ ` 下一页；滚轮上下也可翻页。
- 切换配置：`← / A` 上一个；`→ / D` 下一个，`Enter` 确定。

## 配置管理（localStorage）
应用使用 `localStorage` 保存配置，每条配置对应一个键名：`tv_<配置名>`，值为一行字符串：

```text
<json_url>|<display_name>|<emoji>|<gradient>
```

示例：

```text
http://xxx/icon_data.json|test1|💍|linear-gradient(-20deg, #047272 0%, #1d1035 100%)
```

也可以不设置背景渐变：

```text
http://xxx/icon_data.json|test1|💍|
```

打开页面后会自动创建一组默认配置，并设置 `_defaultjson=watchTV` 作为默认加载项。你可以：
- 在左上角下拉框选择「➕ 增加配置」，按提示粘贴上述字符串快速添加；
- 选择「🗑️ 恢复默认 LS」清除以 `tv_` 开头的所有自定义配置并恢复默认；
- 通过链接参数直接指定配置：`/a-plan/?name=<配置名>`（便于分享/书签）。

背景渐变可参考 `https://www.grabient.com/`，建议选暗色方案以获得更好的对比度。

## JSON 数据格式
每个配置是一个json文件。
配置的 `json_url` 指向一个返回数组的 JSON 文件。数组元素代表一个图标项，字段如下：
- `name`：标识名（用于 DOM id 和右键菜单关联，必须唯一）
- `imageurl`：图标图片地址（相对或绝对路径均可）
- `url`：左键点击打开的链接
- `context-menu-item`：右键菜单数组（可选），每项包含：`name`、`url`
- `friendly-name`：可选，展示友好名（当前页面逻辑未直接使用）

最小示例：

```json
[
  {
    "name": "youtube",
    "imageurl": "imgs/yt.jpg",
    "url": "https://www.youtube.com/",
    "context-menu-item": [
      { "name": "history", "url": "https://www.youtube.com/feed/history" }
    ]
  }
]
```

注意：每页固定显示 10 个图标；不足 10 个，会自动补空位占位，保证布局整齐。




