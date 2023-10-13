// https://www.v2ex.com/t/957284#reply12
var hover_icon_name = ""
var onmobile = false
pagemax = 1;
// 最大页面数量
// 执行创建select 列表
checkCookie();
createSelect();

// 默认创建如下cookies
function checkCookie() {
    if (document.cookie === '') {
        addCookie('watchTV', 'icon_data.json|watchTV|📺|linear-gradient(-20deg, #047272 0%, #1d1035 100%)')
        addCookie('GPTS', 'icon_gpt.json|GPTS|🤖|linear-gradient(-200deg, #047272 0%, #1d1035 100%)')
        addCookie('lewd', 'lewd.json|lewd|🔥|radial-gradient(at center top, rgb(255 123 137), rgb(55 0 0))')
        addCookie('forum', 'forum.json|forum|📢|')
        addCookie('dengbao', 'dengbao.json|dengbao|🛡️|radial-gradient(ellipse farthest-corner at center top, #176980, #353333)')
        addCookie('_defaultjson', 'watchTV')
        console.log("🤖创建默认配置");
    }
}

// var defaultvalue = document.querySelector("#selectContainer select").options[0].value;//获取默认配置（第一个cookie）
// 获取_defaultjson cookie 中的 value
// =使用get获取name的内容，如果又则把他的内容作为value返回。如果没有加载_defaultjson
// 可访问 /?name=xxx 来加载制定cookie
function getUrlParamOrCookie() { 
    var queryString = window.location.search;
    // 使用 URLSearchParams 对象解析查询参数
    var urlParams = new URLSearchParams(queryString);
    // 获取特定参数的值并显示在页面上
    var name = urlParams.get('name');
    if (name != undefined) {
        return name;
    }
    else {return document.cookie.split("; ").find(row => row.startsWith("_defaultjson")).split("=")[1];}//如果url没有name参数，加载_defaultjson
}
var defaultvalue = getUrlParamOrCookie();
loadCookie(defaultvalue);
// 增加select 的 onchange trigger
document.querySelector("#selectContainer select").setAttribute("onchange", "redirectToURL(this.value)");
// select onchange 使用
function redirectToURL(value) {
    if(value === 'clear'){
        deleteAllCookies();
        return;
    }
    var curLinkName = value;
    window.location.href = `?name=${curLinkName}`;
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        deleteCookie(name);
    }
    alert("已删除全部Cookie,请刷新");
}
function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; ";
}

// cookie格式：xxx.json|Name|emoji|grabient(去除尾部分号)...
function loadCookie(value) { // 获取名为value 的 cookie 的内容
    console.log("🤖加载配置：" + value)
    try{cookie = document.cookie.split("; ").find(row => row.startsWith(value)).split("=")[1];} catch{console.log("🔥加载配置失败,cookie不存在"); return;} 
    var cookie = document.cookie.split("; ").find(row => row.startsWith(value)).split("=")[1];
    let values = cookie.split("|");
    // console.log("文件名：" + values[0]);
    loadJSON(values[0]); // 加载json
    document.querySelector("#bigName").innerHTML = values[1];
    // console.log("标题：" + values[1]);
    let curEmoji = '';
    if (values[2]!=undefined) {// 如果是safari，因为safari不允许在cookie中使用emoji,emoji 后面的所有内容会消失，所以用这个防止报错
        curEmoji = values[2];
    }
    if(navigator.vendor === 'Apple Computer, Inc.'){//如果是AppleSafari设备，因为无法显示emoji，所以清空。
        let emojitag = document.querySelector("#emojiName");
        emojitag.style.display = 'none';
    }
    let curLinkName = value;
    loadEmojiIcon(curEmoji, curLinkName);
    // console.log("emoji：" + values[2]);
    document.querySelector("body").style.background = values[3];
    // console.log("背景色：" + values[3]);
}
function loadEmojiIcon(curEmoji, curLinkName,){
    //将网页的名称metadata改成 curLinkName
    document.title = curLinkName;
    //将网页图标改成emoji curEmoji
    const favicon = document.querySelector('link[rel="icon"]');
    // favicon.href = `https://www.emojiall.com/en/header-svg/${curEmoji}.svg`;
    favicon.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${curEmoji}</text></svg>`;
}


//checkCookie 用，加cookie
function addCookie(name, value) {
    var expires = new Date();
    // expires.setDate(expires.getDate() + 1);// 设置过期时间为一天后
    expires.setFullYear(expires.getFullYear() + 10); // 设置为10年后过期
    document.cookie = name + "=" + value + ";expires=" + expires.toUTCString();
}
// 从cookie创建select选项列表
// 同时创建emoji选项 a link
function createSelect() {
    var cookies = document.cookie.split("; ");
    var selectContainer = document.getElementById("selectContainer");
    var selectElement = document.createElement("select");
    selectElement.id = "select-json-from-cookie";
    var optionFirst = document.createElement("option");
    // 添加一个编辑cookie的提示
    optionFirst.text = 'Choose Json';
    optionFirst.value = '';
    selectElement.appendChild(optionFirst);
    selectContainer.appendChild(selectElement);
    for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].split("=")[0] == "_defaultjson") {
            continue; // 跳过存储默认配置用的cookie
        }
        if (cookies[i].split("=")[0].startsWith("_")) {
            continue; // 跳过存储默认配置用的cookie
        }
        var optionText = cookies[i].split("=")[0];
        var optionValue = cookies[i].split("=")[0];
        var optionElement = document.createElement("option");
        let curEmoji = cookies[i].split("=")[1].split("|")[2];
        // 如果是safari，emoji用不能正常显示，因为safari不允许在cookie中使用emoji
        if (navigator.vendor === 'Apple Computer, Inc.') {
            curEmoji = '';
        }
        let curLinkName = optionText;
        document.querySelector("#emojiName").innerHTML += `<a href="?name=${curLinkName}">${curEmoji}</a> `;
        optionElement.text = optionText;
        optionElement.value = optionValue;
        selectElement.appendChild(optionElement);
    }
    // 添加一个清楚所有cookie的
    var optionLast = document.createElement("option");
    optionLast.text = '恢复默认cookie';
    optionLast.value = 'clear';
    selectElement.appendChild(optionLast);
    selectContainer.appendChild(selectElement);
}



function loadJSON(fileName) {
    fetch(fileName).then(async function (response) {
        return eval(`(${
            await response.text()
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
            if(i===1){
                let out = `<div class="page-${i}"></div>`
                placeholder.innerHTML += out;
                continue;
            }else{
                let out = `<div class="page-${i} hide"></div>`
                placeholder.innerHTML += out;
            }
        }
        for (let i = 0; i < icons.length; i++) {
            let icon = icons[i];
            let pageIndex = Math.floor(i / 10) + 1; // 计算当前图标所在的页码
            placeholder = document.querySelector(`#icon-holder .page-${pageIndex}`);
            let out = `
                <div id="${
                icon["name"]
            }-icon" 
                class="icon" 
                onclick="gourl('${
                icon["url"]
            }','${
                icon["name"]
            }')"
                style="background-image: url(${
                icon["imageurl"]
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
            <div id="${
                icon["name"]
            }-menu" class="context-menu">
            `
            icon["context-menu-item"].forEach(item => {
                out += `<div class="item" onclick="gourl('${
                    item["url"]
                }')">${
                    item["name"]
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
        if (! onmobile) {
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
    elements.forEach(function(element) {
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
            }catch{}
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
    if (-- num == 0) 
        num = pagemax;
    

    setnum(num);
}
function pagedown() {
    let obj = document.getElementById("pagenum");
    let num = obj.innerHTML;
    if (++ num > pagemax) 
        num = 1;
    

    setnum(num);
}
// 翻页按键监听
// https://www.freecodecamp.org/news/javascript-keycode-list-keypress-event-key-codes/
document.addEventListener("keydown", (event) => {
    key = event.key;
    if (key == "w" || key == "ArrowUp") {
        pageup();
    }
    if (key == "s" || key == "ArrowDown") {
        pagedown();
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
