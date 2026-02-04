let onmobile = false;
let pagemax = 1;

function getFileParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get("file");
}

function parseLooseJson(text) {
  return new Function(`"use strict"; return (${text});`)();
}

function renderIcons(icons, label) {
  if (!Array.isArray(icons)) {
    throw new Error("JSON is not an array");
  }
  document.querySelector("#bigName").textContent = label || "Preview";
  let totalPages = Math.ceil(icons.length / 10);
  pagemax = totalPages || 1;
  const placeholder = document.querySelector("#icon-holder");
  placeholder.innerHTML = "";

  for (let i = 1; i <= pagemax; i++) {
    const page = document.createElement("div");
    page.className = `page-${i}${i === 1 ? "" : " hide"}`;
    placeholder.appendChild(page);
  }

  const menuHolder = document.querySelector("#context-menu-holder");
  menuHolder.innerHTML = "";

  icons.forEach((icon, index) => {
    const pageIndex = Math.floor(index / 10) + 1;
    const page = placeholder.querySelector(`.page-${pageIndex}`);
    const iconId = `icon-${index}`;
    const menuId = `menu-${index}`;

    const iconElement = document.createElement("div");
    iconElement.id = iconId;
    iconElement.className = "icon";
    if (icon && icon.imageurl) {
      iconElement.style.backgroundImage = `url("${icon.imageurl}")`;
    }
    iconElement.addEventListener("click", () => {
      gourl(icon.url, icon.name);
    });
    page.appendChild(iconElement);

    const items = Array.isArray(icon["context-menu-item"])
      ? icon["context-menu-item"]
      : [];
    const menu = document.createElement("div");
    menu.id = menuId;
    menu.className = "context-menu";
    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "item";
      row.textContent = item.name || "";
      row.addEventListener("click", () => {
        gourl(item.url);
      });
      menu.appendChild(row);
    });
    menuHolder.appendChild(menu);
  });

  const lastPage = document.querySelector(`#icon-holder .page-${pagemax}`);
  if (lastPage && lastPage.children.length < 10) {
    const emptyIconsCount = 10 - lastPage.children.length;
    for (let k = 0; k < emptyIconsCount; k++) {
      lastPage.innerHTML += `<div class="icon empty-icon"></div>`;
    }
  }

  loadMenus(icons);
}

function loadJSON(fileName) {
  fetch(fileName)
    .then(async (response) => {
      return parseLooseJson(await response.text());
    })
    .then((icons) => {
      renderIcons(icons, fileName);
    })
    .catch((error) => {
      document.querySelector("#bigName").textContent = "Preview Error";
      console.error(error);
    });
}

function addContextMenuListener(item) {
  const iconitem = document.getElementById(`icon-${item}`);
  if (!iconitem) {
    return;
  }
  iconitem.oncontextmenu = function (event) {
    const contextElement = document.getElementById(`menu-${item}`);
    if (!contextElement) {
      return;
    }
    contextElement.style.top = event.pageY - 10 + "px";
    contextElement.style.left = event.pageX - 10 + "px";
    removeActiveMenus();
    contextElement.classList.add("active");
    event.preventDefault();
  };

  window.addEventListener("click", function () {
    if (!onmobile) {
      removeActiveMenus();
    }
  });
}

function loadMenus(icons) {
  icons.forEach((icon, index) => {
    if (icon) {
      addContextMenuListener(index);
    }
  });
}

function removeActiveMenus() {
  var elements = document.querySelectorAll('[id$="-menu"]');
  elements.forEach(function (element) {
    element.classList.remove("active");
  });
}

function setnum(x) {
  for (var i = 1; i <= pagemax; i++) {
    var page = document.getElementsByClassName("page-" + i)[0];
    if (!page) {
      continue;
    }
    if (i === x) {
      page.classList.remove("hide");
    } else {
      page.classList.add("hide");
    }
  }
  let obj = document.getElementById("pagenum");
  obj.innerHTML = x;
}

function pageup() {
  let obj = document.getElementById("pagenum");
  let num = Number(obj.innerHTML);
  if (--num <= 0) {
    num = pagemax;
  }
  setnum(num);
}

function pagedown() {
  let obj = document.getElementById("pagenum");
  let num = Number(obj.innerHTML);
  if (++num > pagemax) {
    num = 1;
  }
  setnum(num);
}

document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (key === "w" || key === "ArrowUp" || key === "k") {
    pageup();
  }
  if (key === "s" || key === "ArrowDown" || key === "j") {
    pagedown();
  }
});

document.addEventListener("wheel", (event) => {
  var whellup = event.deltaY;
  if (whellup < 0) {
    pageup();
  }
  if (whellup > 0) {
    pagedown();
  }
});

function gourl(url, iconName) {
  if (onmobile) {
    removeActiveMenus();
    active_this(iconName, url);
  } else if (url) {
    window.open(url);
  }
}

function active_this(iconName, url) {
  try {
    document.querySelector("#" + iconName + "-menu").classList.add("active");
  } catch (error) {
    if (url) {
      window.open(url);
    }
  }
}

function switch_onmoble() {
  if (onmobile === false) {
    onmobile = true;
    document.querySelector(".mobile").innerHTML = "📱";
  } else {
    onmobile = false;
    document.querySelector(".mobile").innerHTML = "💻";
  }
}

const file = getFileParam();
if (!file) {
  document.querySelector("#bigName").textContent = "No file";
} else {
  document.title = `Preview - ${file}`;
  loadJSON(file);
}

window.addEventListener("message", (event) => {
  const payload = event.data || {};
  if (payload.type !== "preview-data") {
    return;
  }
  try {
    const label = payload.name ? `Live - ${payload.name}` : "Live Preview";
    renderIcons(payload.data || [], label);
  } catch (error) {
    console.error(error);
  }
});
