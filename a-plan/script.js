var hover_icon_name = ""
var onmobile = false

// 翻页功能
// 下列代码用于翻页功能
function setnum(x) {
    if (x == 1) {
        var a = document.getElementsByClassName("page-1")[0];
        a.classList.remove('hide')
        var a = document.getElementsByClassName("page-2")[0];
        a.classList.add('hide')
    }
    if (x == 2) {
        var a = document.getElementsByClassName("page-1")[0];
        a.classList.add('hide')
        var a = document.getElementsByClassName("page-2")[0];
        a.classList.remove('hide')
    }
}
setnum(1);
// 最大页面数量
pagenummax = 2;
function pageup() {
    var num = document.getElementById("pagenum").innerHTML;
    num--;
    if (num == 0) 
        num = pagenummax;
    
    document.getElementById("pagenum").innerHTML = num;
    setnum(num)
}
function pagedown() {
    var num = document.getElementById("pagenum").innerHTML;
    ++ num;
    num = (num % (pagenummax + 1));
    if (num == 0) 
        num++;
    
    document.getElementById("pagenum").innerHTML = num;
    setnum(num)
}
// 按键监听
// https://www.freecodecamp.org/news/javascript-keycode-list-keypress-event-key-codes/
document.addEventListener("keydown", (event) => {
    key = event.key;
    if (key == "w" || key == "ArrowUp") {
        pageup()
    }
    if (key == "s" || key == "ArrowDown") {
        pagedown()
    }
})
// 滚轮监听（很好玩
document.addEventListener('wheel', (event) => {
    var whellup = event.deltaY;
    if (whellup < 0) {
        pageup()
    }
    if (whellup > 0) {
        pagedown()
    }
});


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

// 用于开启 xxxmenu
function active_this(strname) {
    document.querySelector("#" + strname + "-menu").classList.add('active')
}

// 用于前往网站
function go(str) {
    if (onmobile) {
        if (str.startsWith('cctv')) {
            if (str == 'cctv') 
                active_this(str);
            else 
                window.open('https://tv.cctv.com/live/' + str);
            
        } else 
            active_this(str);
    } else {
        switch (str) {
            case "youtube":
                window.open('https://www.youtube.com/');
                break;
            case "bilibili":
                window.open('https://www.bilibili.com/');
                break;
            case "cctv":
                window.open('https://tv.cctv.com/live/cctv13');
                break;
            case "xigua":
                window.open('https://www.ixigua.com/');
                break;
            case "ytmusic":
                window.open('https://music.youtube.com/');
                break;
            case "NF":
                window.open('https://netflix.com');
                break;
            case "ddrk":
                window.open('https://ddys.tv/');
                break;
            case "acfun":
                window.open('https://www.acfun.cn/');
                break;
            case "ponytown":
                window.open('https://pony.town/');
                break;
            case "douyin":
                window.open('https://www.douyin.com/');
                break;
            case "iqiyi":
                window.open('https://www.iqiyi.com/');
                break;
            case "courseora":
                window.open('https://www.coursera.org/');
                break;
            case "wallheaven":
                window.open('https://wallhaven.cc/toplist');
                break;
            default:
                window.open('https://tv.cctv.com/live/' + str);
                break;
        }
    }

}


// 在这里的所有项目都会被添加menu菜单linstener
var menulist = ["cctv", "bilibili"]

let ele = document.querySelector("#cctv-icon"); // This will not get any element because the page is not even loaded!


document.addEventListener("readystatechange", function () {
    if (this.readyState == "interactive") {


        var item = "cctv";
        // 右键监听
        document.querySelector("#" + item + "-icon").oncontextmenu = function () {
            let contextElement = document.getElementById(item + "-menu");
            contextElement.style.top = (event.pageY - 10) + "px";
            contextElement.style.left = (event.pageX - 10) + "px";
            contextElement.classList.add("active");
            event.preventDefault();
        }
        // 点击空白位置
        window.addEventListener("click", function () {
            if (! onmobile) {
                document.querySelector("#" + item + "-menu").classList.remove("active")
            }
        });


        var item2 = "bilibili";
        document.querySelector("#" + item2 + "-icon").oncontextmenu = function () {
            let contextElement = document.getElementById(item2 + "-menu");
            contextElement.style.top = (event.pageY - 10) + "px";
            contextElement.style.left = (event.pageX - 10) + "px";
            contextElement.classList.add("active");
            event.preventDefault();
        }
        window.addEventListener("click", function () {
            if (! onmobile) {
                document.querySelector("#" + item2 + "-menu").classList.remove("active")
            }
        });


        var item3 = "youtube";
        document.querySelector("#" + item3 + "-icon").oncontextmenu = function () {
            let contextElement = document.getElementById(item3 + "-menu");
            contextElement.style.top = (event.pageY - 10) + "px";
            contextElement.style.left = (event.pageX - 10) + "px";
            contextElement.classList.add("active");
            event.preventDefault();
        }
        window.addEventListener("click", function () {
            if (! onmobile) {
                document.querySelector("#" + item3 + "-menu").classList.remove("active")
            }
        });

        var item4 = "acfun";
        document.querySelector("#" + item4 + "-icon").oncontextmenu = function () {
            let contextElement = document.getElementById(item4 + "-menu");
            contextElement.style.top = (event.pageY - 10) + "px";
            contextElement.style.left = (event.pageX - 10) + "px";
            contextElement.classList.add("active");
            event.preventDefault();
        }
        window.addEventListener("click", function () {
            if (! onmobile) {
                document.querySelector("#" + item4 + "-menu").classList.remove("active")
            }
        });

        var item5 = "ddrk";
        document.querySelector("#" + item5 + "-icon").oncontextmenu = function () {
            let contextElement = document.getElementById(item5 + "-menu");
            contextElement.style.top = (event.pageY - 10) + "px";
            contextElement.style.left = (event.pageX - 10) + "px";
            contextElement.classList.add("active");
            event.preventDefault();
        }
        window.addEventListener("click", function () {
            if (! onmobile) {
                document.querySelector("#" + item5 + "-menu").classList.remove("active")
            }
        });

        var item6 = "music";
        document.querySelector("#" + item6 + "-icon").oncontextmenu = function () {
            let contextElement = document.getElementById(item6 + "-menu");
            contextElement.style.top = (event.pageY - 10) + "px";
            contextElement.style.left = (event.pageX - 10) + "px";
            contextElement.classList.add("active");
            event.preventDefault();
        }
        window.addEventListener("click", function () {
            if (! onmobile) {
                document.querySelector("#" + item6 + "-menu").classList.remove("active")
            }
        });
    }
});

document.onselectstart = function () {
    return false;
};
// 增加禁止选择功能希望可以让ipad能够实现右键

