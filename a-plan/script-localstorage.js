// 默认创建如下localStorage item
function checkLS() {
    if (localStorage.length === 0 || localStorage.getItem('tv_archive') === null){
        localStorage.setItem('tv_archive', 'archive.json|archive|🗄️|')
        localStorage.setItem('tv_dengbao', 'dengbao.json|dengbao|🛡️|radial-gradient(ellipse farthest-corner at center top, #176980, #353333)')
        localStorage.setItem('tv_forum', 'forum.json|forum|📢|')
        localStorage.setItem('tv_game', 'game.json|game|🕹️|')
        localStorage.setItem('tv_gpts', 'icon_gpt.json|GPTS|🤖|linear-gradient(52deg, rgb(186 88 222) 0%, rgb(32 58 117) 100%)')
        localStorage.setItem('tv_lewd', 'lewd.json|lewd|🔥|radial-gradient(at center top, rgb(97 149 63), rgb(0 0 0))')
        localStorage.setItem('tv_tools', 'tools.json|tools|🔧|')
        localStorage.setItem('tv_watchTV', 'icon_data.json|watchTV|📺|linear-gradient(-20deg, #047272 0%, #1d1035 100%)')
        localStorage.setItem('_defaultjson', 'watchTV')
        console.log("🤖创建默认配置");
    }
}

// 可访问 /?name=xxx 来加载指定的LS
function getUrlParamOrLS() {
    // 使用 URLSearchParams 对象解析查询参数
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var name = urlParams.get('name');
    if (name != undefined) {
        return name;
    }
    // 如果未指定name，则加载默认配置
    else { return localStorage.getItem("_defaultjson"); }//如果url没有name参数，加载_defaultjson
}

// select onchange 使用
function redirectToURL(value) {
    if (value === 'clear') {
        Object.keys(localStorage).forEach( (key) => {
            if (key.startsWith("tv_")) {
                localStorage.removeItem(key);
            }
        });
        return;
    }
    var curLinkName = value;
    window.location.href = `?name=${curLinkName}`;
}

// LS格式：xxx.json|Name|emoji|grabient(去除尾部分号)...
function loadLS(value) {
    console.log("🤖加载配置：" + value)
    var ls = localStorage.getItem("tv_" + value);
    let values = ls.split("|");
    console.log("文件名：" + values[0]);
    loadJSON(values[0]); // 加载json
    document.querySelector("#bigName").innerHTML = values[1];
    let curEmoji = '';
    if (values[2] != undefined) {// 如果是safari，因为safari不允许在cookie中使用emoji,emoji 后面的所有内容会消失，所以用这个防止报错
        curEmoji = values[2];
    }
    if (navigator.vendor === 'Apple Computer, Inc.') {//如果是AppleSafari设备，因为无法显示emoji，所以清空。
        let emojitag = document.querySelector("#emojiName");
        emojitag.style.display = 'none';
    }
    let curLinkName = value;
    loadEmojiIcon(curEmoji, curLinkName);
    document.querySelector("body").style.background = values[3];
}
// website icon
function loadEmojiIcon(curEmoji, curLinkName,) {
    //将网页的名称metadata改成 curLinkName
    document.title = curLinkName;
    //将网页图标改成emoji curEmoji
    const favicon = document.querySelector('link[rel="icon"]');
    // favicon.href = `https://www.emojiall.com/en/header-svg/${curEmoji}.svg`;
    favicon.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${curEmoji}</text></svg>`;
}

// 从cookie创建select选项列表
// 同时创建emoji按钮
function createSelect() {
    var keys = Object.keys(localStorage);
    var selectContainer = document.getElementById("selectContainer");
    var selectElement = document.createElement("select");
    selectElement.id = "select-json-from-cookie";
    //循环创建option 
    for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        value = localStorage.getItem(key);
        if (!key.startsWith("tv_") ) {
            continue;
        }
        key = key.replace("tv_", "");
        var optionText = key;
        var optionValue = key;
        var optionElement = document.createElement("option");
        let curEmoji = value.split("|")[2];
        let curLinkName = optionText;
        document.querySelector("#emojiName").innerHTML += `<a href="?name=${curLinkName}">${curEmoji}</a> `;
        optionElement.text = curEmoji +" "+ optionText;
        optionElement.value = optionValue;
        selectElement.appendChild(optionElement);
    }
    // 添加一个清楚所有LS的按钮
    var optionLast = document.createElement("option");
    optionLast.text = '🗑️ 恢复默认 LS';
    optionLast.value = 'clear';
    selectElement.appendChild(optionLast);
    selectContainer.appendChild(selectElement);
}



function loadJSON(fileName) {
    fetch(fileName).then(async function (response) {
        return eval(`(${await response.text()
            })`);
        // 用eval解析json，可以兼容不太标准的json
        // return response.json();
    }).then(function (icons) {
        let totalPages = Math.ceil(icons.length / 10); // 计算总页数
        pagemax = totalPages;
        let placeholder = document.querySelector("#icon-holder");
        placeholder.innerHTML = '';
        // 切换配置用，清理杂物

        // 创建页面占位符
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1) {
                let out = `<div class="page-${i}"></div>`
                placeholder.innerHTML += out;
                continue;
            } else {
                let out = `<div class="page-${i} hide"></div>`
                placeholder.innerHTML += out;
            }
        }
        for (let i = 0; i < icons.length; i++) {
            let icon = icons[i];
            let pageIndex = Math.floor(i / 10) + 1; // 计算当前图标所在的页码
            placeholder = document.querySelector(`#icon-holder .page-${pageIndex}`);
            let out = `
                <div id="${icon["name"]
                }-icon" 
                class="icon" 
                onclick="gourl('${icon["url"]
                }','${icon["name"]
                }')"
                style="background-image: url(${icon["imageurl"]
                });"></div>
            `;
            // 这里用了百度下载图片过来，因为我之前用的微博图床，但是微博图床有防盗链，用百度下载一下转换
            // 国内上传可以用这个 http://tool.mkblog.cn/tuchuang/
            // 【百度图片】https://image.baidu.com/search/down?url=
            // 【Akamai节点，没有使用限制】https://imageproxy.pimg.tw/resize?url=
            // 【国内网宿节点，只能加载特定图床图片如imgur】https://search.pstatic.net/common/?src=
            // 【CloudFlare节点】https://images.weserv.nl/?url=
            // 未来可能要自建一个 https://chevereto.com/
            placeholder.innerHTML += out;
            // 创建每个icon的右键菜单
            let menuHolder = document.querySelector("#context-menu-holder");
            out = `        
            <div id="${icon["name"]
                }-menu" class="context-menu">
            `
            icon["context-menu-item"].forEach(item => {
                out += `<div class="item" onclick="gourl('${item["url"]
                    }')">${item["name"]
                    }</div>`
            });
            out += "</div>";
            menuHolder.innerHTML += out;
            console.log("icon and menus loaded");
        }
        // 如果最后一页图标数量不足10个，补充空白图标
        if (placeholder.children.length < 10) {
            let emptyIconsCount = 10 - placeholder.children.length;

            for (let k = 0; k < emptyIconsCount; k++) {
                let out = `<div class="icon empty-icon"></div>`;
                placeholder.innerHTML += out;
            }
        }
        loadMenus(icons);
    });
}


// 右键菜单功能
function addContextMenuListener(item) { // 选中时在鼠标位置显示
    let iconitem = document.querySelector("#" + item + "-icon")

    iconitem.oncontextmenu = function () {
        let contextElement = document.getElementById(item + "-menu");
        contextElement.style.top = (event.pageY - 10) + "px";
        contextElement.style.left = (event.pageX - 10) + "px";
        removeActiveMenus();
        contextElement.classList.add("active");
        event.preventDefault();
    }

    // 点击外部清除
    window.addEventListener("click", function () {
        if (!onmobile) {
            removeActiveMenus();
        }
    });
}
// 给每一个图标添加右键菜单监听器
function loadMenus(icons) {
    icons.forEach(icon => {
        let item = icon["name"];
        addContextMenuListener(item);
    });
}
//清除多余的右键菜单
function removeActiveMenus() {
    var elements = document.querySelectorAll('[id$="-menu"]');
    elements.forEach(function (element) {
        element.classList.remove('active');
    });
}


// 下列代码用于翻页功能
// 翻页功能
function setnum(x) {
    for (var i = 1; i <= pagemax; i++) {
        var page = document.getElementsByClassName("page-" + i)[0];
        if (i === x) {
            try {
                page.classList.remove('hide');
            } catch { }
        } else {
            page.classList.add('hide');
        }
    }
    let obj = document.getElementById("pagenum");
    obj.innerHTML = x;
}


function pageup() {
    let obj = document.getElementById("pagenum");
    let num = obj.innerHTML;
    if (--num == 0)
        num = pagemax;


    setnum(num);
}
function pagedown() {
    let obj = document.getElementById("pagenum");
    let num = obj.innerHTML;
    if (++num > pagemax)
        num = 1;


    setnum(num);
}
// 上下、ws = 翻页
// 键盘左右 = select的选项+-1
// enter = 打开select的选项

// https://www.freecodecamp.org/news/javascript-keycode-list-keypress-event-key-codes/
document.addEventListener("keydown", (event) => {
    key = event.key;

    if (key == "w" || key == "ArrowUp" || key == "k") {
        pageup();
    }
    if (key == "s" || key == "ArrowDown" || key == "j") {
        pagedown();
    }
    if (key == "ArrowLeft" || key == "a") {
        let select = document.querySelector("#selectContainer select")
        let index = select.selectedIndex;
        if (index > 0) {
            select.selectedIndex = index - 1;
        }
    }
    if (key == "ArrowRight" || key == "d") {
        let select = document.querySelector("#selectContainer select")
        let index = select.selectedIndex;
        if (index < select.options.length - 1) {
            select.selectedIndex = index + 1;
        }
    }
    //if enter hit
    if (key == "Enter") {
        let select = document.querySelector("#selectContainer select")
        redirectToURL(select.value);
    }
})
// 翻页滚轮监听（很好玩
document.addEventListener('wheel', (event) => {
    var whellup = event.deltaY;
    if (whellup < 0) {
        pageup()
    }
    if (whellup > 0) {
        pagedown()
    }
});

function gourl(url, iconName) {
    if (onmobile) {
        removeActiveMenus();
        active_this(iconName, url);
    } else {
        window.open(url);
    }
}
// 用于显示 xxxmenu ，如果显示失败，进入url
function active_this(iconName, url) {
    try {
        document.querySelector("#" + iconName + "-menu").classList.add('active');
    } catch (error) {
        window.open(url);
    }
}


// 手机上无法使用右键时候可以
function switch_onmoble() {
    if (onmobile == false) {
        onmobile = true
        document.querySelector(".mobile").innerHTML = "📱"
    } else {
        onmobile = false
        document.querySelector(".mobile").innerHTML = "💻"
    }
    console.log('onmobile' + onmobile)
}


//main
var onmobile = false
pagemax = 1;
checkLS();
createSelect();
var defaultvalue = getUrlParamOrLS();
loadLS(defaultvalue);
// 增加select 的 onchange trigger
document.querySelector("#selectContainer select").value = defaultvalue;
document.querySelector("#selectContainer select").setAttribute("onchange", "redirectToURL(this.value)");