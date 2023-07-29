// https://www.v2ex.com/t/957284#reply12
var hover_icon_name = ""
var onmobile = false
pagemax = 1; // 最大页面数量
//执行创建select 列表 
checkCookie()
createSelect();
var defaultvalue = document.querySelector("#selectContainer select").options[0].value;
loadCookie(defaultvalue)
//增加select 的 onchange trigger
document.querySelector("#selectContainer select").setAttribute("onchange","loadCookie(this.value)");
//cookie格式：xxx.json|Name|emoji|grabient(去除尾部分号)...
function loadCookie(value){
    values = value.split("|");
    loadJSON(values[0])
    document.querySelector("#bigName").innerHTML = values[1];
    document.querySelector("#emojiName").innerHTML = values[2];
    console.log(values[3])
    document.querySelector("body").style.background = values[3];
}
//如果没有cookie，则创建一个默认配置
function checkCookie(){
    if (document.cookie === ''){
        addCookie('icon_data.json','icon_data.json|视频站|📺|linear-gradient(-20deg, #047272 0%, #1d1035 100%)')
    }
}
function addCookie(name,value) {
    var expires = new Date();
    // expires.setDate(expires.getDate() + 1);// 设置过期时间为一天后
    expires.setFullYear(expires.getFullYear() + 10); // 设置为10年后过期
    document.cookie = name + "=" + value + ";expires=" + expires.toUTCString();
}
//从cookie创建select选项列表
function createSelect() {
    var cookies = document.cookie.split("; ");
    var selectContainer = document.getElementById("selectContainer");
    var selectElement = document.createElement("select");
    selectElement.id = "select-json-from-cookie";
    for (var i = 0; i < cookies.length; i++) {
        var optionText = cookies[i].split("=")[0];
        var optionValue = cookies[i].split("=")[1];
        var optionElement = document.createElement("option");
        optionElement.text = optionText;
        optionElement.value = optionValue;
        selectElement.appendChild(optionElement);
    }
    var optionLast = document.createElement("option");
    optionLast.text = '编辑cookie添加';
    optionLast.value = '';
    selectElement.appendChild(optionLast);

    selectContainer.appendChild(selectElement);
}


function loadJSON(fileName) {
    fetch(fileName)
    .then(async function(response) {
        return eval(`(${await response.text()})`); // 用eval解析json，可以兼容不太标准的json
        // return response.json();
    })
    .then(function(icons) {
        let totalPages = Math.ceil(icons.length / 10); // 计算总页数
        pagemax = totalPages;
        let placeholder = document.querySelector("#icon-holder");
        placeholder.innerHTML ='';//切换配置用，清理杂物
    
        // 创建页面占位符
        for (let i = 1; i <= totalPages; i++) {
            let out = `<div class="page-${i}"></div>`
            placeholder.innerHTML += out;
        }
        for (let i = 0; i < icons.length; i++) {
            let icon = icons[i];
            let pageIndex = Math.floor(i / 10) + 1; // 计算当前图标所在的页码
            placeholder = document.querySelector(`#icon-holder .page-${pageIndex}`);
            let out = `
                <div id="${icon["name"]}-icon" 
                class="icon" 
                onclick="gourl('${icon["url"]}','${icon["name"]}')"
                style="background-image: url(${icon["imageurl"]});"></div>
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
            <div id="${icon["name"]}-menu" class="context-menu">
            `
            icon["context-menu-item"].forEach(item => {
                out += `<div class="item" onclick="gourl('${item["url"]}')">${item["name"]}</div>`
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
function addContextMenuListener(item) {
    // 选中时在鼠标位置显示
    document.querySelector("#" + item + "-icon").oncontextmenu = function () {
        let contextElement = document.getElementById(item + "-menu");
        contextElement.style.top = (event.pageY - 10) + "px";
        contextElement.style.left = (event.pageX - 10) + "px";
        contextElement.classList.add("active");
        event.preventDefault();
    }
    //点击外部清除
    window.addEventListener("click", function () {
        if (!onmobile) {
            document.querySelector("#" + item + "-menu").classList.remove("active")
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


// 下列代码用于翻页功能
// 翻页功能
function setnum(x) {
    for (var i = 1; i <= pagemax; i++) {
        var page = document.getElementsByClassName("page-" + i)[0];
        if (i === x) {
            page.classList.remove('hide');
        } else {
            page.classList.add('hide');
        }
    }
    let obj = document.getElementById("pagenum");
    obj.innerHTML = x;
}

//设置当前页面为第一页
setnum(1);

function pageup() {
    let obj = document.getElementById("pagenum");
    let num = obj.innerHTML;
    if (--num == 0) num = pagemax;
    setnum(num);
}
function pagedown() {
    let obj = document.getElementById("pagenum");
    let num = obj.innerHTML;
    if(++ num > pagemax) num = 1;
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

function gourl(url,iconName){
    if (onmobile) {
        active_this(iconName,url);
    } 
    else{
        window.open(url);
    }
}
// 用于显示 xxxmenu ，如果显示失败，进入url
function active_this(iconName,url) {
    try {
        document.querySelector("#" + iconName + "-menu").classList.add('active');
    } catch (error) {
        window.open(url);
    }
}


//手机上无法使用右键时候可以
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

