const passwordInput = document.getElementById("password");
const connectBtn = document.getElementById("connectBtn");
const fileSelect = document.getElementById("fileSelect");
const loadBtn = document.getElementById("loadBtn");
const saveBtn = document.getElementById("saveBtn");
const livePreviewBtn = document.getElementById("livePreviewBtn");
const iconUpload = document.getElementById("iconUpload");
const uploadBtn = document.getElementById("uploadBtn");
const addItemBtn = document.getElementById("addItemBtn");
const deleteItemBtn = document.getElementById("deleteItemBtn");
const applyItemBtn = document.getElementById("applyItemBtn");
const addContextBtn = document.getElementById("addContextBtn");
const applyRawBtn = document.getElementById("applyRawBtn");
const formatRawBtn = document.getElementById("formatRawBtn");
const itemList = document.getElementById("itemList");
const archiveList = document.getElementById("archiveList");
const archivePanel = document.getElementById("archivePanel");
const toggleArchiveBtn = document.getElementById("toggleArchiveBtn");
const contextList = document.getElementById("contextList");
const rawHighlight = document.getElementById("rawHighlight");
const rawEditor = document.getElementById("rawEditor");
const statusEl = document.getElementById("status");

const fieldName = document.getElementById("field-name");
const fieldImageUrl = document.getElementById("field-imageurl");
const fieldUrl = document.getElementById("field-url");
const previewIcon = document.getElementById("previewIcon");
const previewName = document.getElementById("previewName");
const previewUrl = document.getElementById("previewUrl");
const previewOpenBtn = document.getElementById("previewOpenBtn");
const previewMenu = document.getElementById("previewMenu");
const livePreview = document.getElementById("livePreview");
const previewFrame = document.getElementById("previewFrame");
const refreshPreviewBtn = document.getElementById("refreshPreviewBtn");
const closePreviewBtn = document.getElementById("closePreviewBtn");
const previewScale = document.getElementById("previewScale");
const previewScaleLabel = document.getElementById("previewScaleLabel");
const ratioScreenBtn = document.getElementById("ratioScreenBtn");
const ratioPhoneBtn = document.getElementById("ratioPhoneBtn");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const settingsBody = document.getElementById("settingsBody");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const resetSettingsBtn = document.getElementById("resetSettingsBtn");
const addJsonBtn = document.getElementById("addJsonBtn");

const ARCHIVE_FILE = "archive.json";
const GRADIENT_PRESETS = [
  { label: "None", value: "" },
  { label: "Teal Night", value: "linear-gradient(-20deg, #047272 0%, #1d1035 100%)" },
  { label: "Ocean Dark", value: "radial-gradient(ellipse farthest-corner at center top, #0b4a5b, #1b1f24)" },
  { label: "Midnight Blue", value: "radial-gradient(circle, #0b3a5a 0%, #12161c 100%)" },
  { label: "Purple Smoke", value: "linear-gradient(52deg, #5b2a6e 0%, #1b284f 100%)" },
  { label: "Forest Night", value: "radial-gradient(at center top, #355a2f, #0a0a0a)" },
  { label: "Amber Dusk", value: "linear-gradient(140deg, #6b3b00 0%, #241300 100%)" },
  { label: "Ruby Night", value: "linear-gradient(140deg, #5a1b2e 0%, #220a12 100%)" },
  { label: "Aurora Dark", value: "linear-gradient(120deg, #004a66 0%, #0a1b3a 100%)" },
  { label: "Violet Deep", value: "linear-gradient(120deg, #3c1a5a 0%, #120a24 100%)" },
  { label: "Lime Shadow", value: "linear-gradient(120deg, #1f4a1a 0%, #0b1a12 100%)" },
  { label: "Steel", value: "linear-gradient(120deg, #1a1c1f 0%, #2a2f36 100%)" },
  { label: "Sunset Dark", value: "linear-gradient(120deg, #4a1a12 0%, #1b0a12 100%)" }
];
const CONFIG_FILE = "config.json";

const configState = {
  default: "watchTV",
  items: [],
};

const state = {
  files: [],
  currentFile: null,
  data: [],
  archive: [],
  selectedIndex: -1,
};

let previewReady = false;
let pendingPreviewPayload = null;
let pendingPulse = null;

function setDragging(active) {
  itemList.classList.toggle("dragging", active);
  archiveList.classList.toggle("dragging", active);
}

function requestPulse(listType, index) {
  pendingPulse = { listType, index };
}

function applyPulse(container, listType) {
  if (!pendingPulse || pendingPulse.listType !== listType) {
    return;
  }
  const selector = `.list-item[data-list-type="${listType}"][data-index="${pendingPulse.index}"]`;
  const target = container.querySelector(selector);
  if (target) {
    target.classList.add("pulse");
    setTimeout(() => target.classList.remove("pulse"), 200);
  }
  pendingPulse = null;
}

function swapItems(listType, indexA, indexB) {
  const list = listType === "archive" ? state.archive : state.data;
  if (!Array.isArray(list)) {
    return;
  }
  if (indexA === indexB) {
    return;
  }
  if (
    indexA < 0 ||
    indexB < 0 ||
    indexA >= list.length ||
    indexB >= list.length
  ) {
    return;
  }
  const temp = list[indexA];
  list[indexA] = list[indexB];
  list[indexB] = temp;

  if (listType === "items") {
    if (state.selectedIndex === indexA) {
      state.selectedIndex = indexB;
    } else if (state.selectedIndex === indexB) {
      state.selectedIndex = indexA;
    }
    syncRawFromData();
    renderItemList();
    requestPulse("items", indexB);
  } else {
    renderArchiveList();
    requestPulse("archive", indexB);
  }
}

function moveItem(listType, fromIndex, toIndex) {
  const list = listType === "archive" ? state.archive : state.data;
  if (!Array.isArray(list)) {
    return;
  }
  if (fromIndex === toIndex) {
    return;
  }
  if (fromIndex < 0 || fromIndex >= list.length) {
    return;
  }
  if (toIndex < 0 || toIndex > list.length) {
    return;
  }
  const [item] = list.splice(fromIndex, 1);
  const insertIndex = Math.min(toIndex, list.length);
  list.splice(insertIndex, 0, item);

  if (listType === "items") {
    if (state.selectedIndex === fromIndex) {
      state.selectedIndex = insertIndex;
    } else if (fromIndex < state.selectedIndex && insertIndex >= state.selectedIndex) {
      state.selectedIndex -= 1;
    } else if (fromIndex > state.selectedIndex && insertIndex <= state.selectedIndex) {
      state.selectedIndex += 1;
    }
    syncRawFromData();
    renderItemList();
    requestPulse("items", insertIndex);
  } else {
    renderArchiveList();
    requestPulse("archive", insertIndex);
  }
}

function moveBetweenLists(sourceType, targetType, fromIndex, toIndex) {
  const sourceList = sourceType === "archive" ? state.archive : state.data;
  const targetList = targetType === "archive" ? state.archive : state.data;
  if (!Array.isArray(sourceList) || !Array.isArray(targetList)) {
    return;
  }
  if (fromIndex < 0 || fromIndex >= sourceList.length) {
    return;
  }
  const [item] = sourceList.splice(fromIndex, 1);
  const insertIndex = Math.min(Math.max(toIndex, 0), targetList.length);
  targetList.splice(insertIndex, 0, item);

  if (sourceType === "items") {
    if (state.selectedIndex === fromIndex) {
      state.selectedIndex = -1;
    } else if (fromIndex < state.selectedIndex) {
      state.selectedIndex -= 1;
    }
  }
  if (targetType === "items") {
    state.selectedIndex = insertIndex;
  }

  renderItemList();
  renderArchiveList();
  syncRawFromData();
  requestPulse(targetType, insertIndex);
  saveArchive();
  if (state.currentFile) {
    saveFile();
  }
}

function getDragPayload(event) {
  if (!event.dataTransfer) {
    return null;
  }
  const raw =
    event.dataTransfer.getData("application/json") ||
    event.dataTransfer.getData("text/plain");
  if (!raw) {
    return null;
  }
  try {
    const payload = JSON.parse(raw);
    if (
      payload &&
      (payload.list === "items" || payload.list === "archive") &&
      typeof payload.index === "number"
    ) {
      return payload;
    }
  } catch (error) {
    // ignore
  }
  return null;
}

function setStatus(message, isError) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", Boolean(isError));
}

function setArchiveCollapsed(collapsed) {
  if (!archivePanel) {
    return;
  }
  archivePanel.classList.toggle("collapsed", collapsed);
  if (toggleArchiveBtn) {
    toggleArchiveBtn.textContent = collapsed ? "Expand" : "Collapse";
  }
  localStorage.setItem("watchtv_archive_collapsed", collapsed ? "1" : "0");
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightJson(text) {
  const escaped = escapeHtml(text);
  const tokenRegex =
    /(\"(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\\"])*\"\\s*:|\"(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\\"])*\"|-?\\d+(?:\\.\\d+)?(?:[eE][+\\-]?\\d+)?|\\btrue\\b|\\bfalse\\b|\\bnull\\b|[{}\\[\\],:])/g;

  return escaped.replace(tokenRegex, (match) => {
    if (match.startsWith("\"") && match.endsWith(":")) {
      return `<span class=\"tok-key\">${match}</span>`;
    }
    if (match.startsWith("\"")) {
      return `<span class=\"tok-string\">${match}</span>`;
    }
    if (match === "true" || match === "false") {
      return `<span class=\"tok-boolean\">${match}</span>`;
    }
    if (match === "null") {
      return `<span class=\"tok-null\">${match}</span>`;
    }
    if (/^-?\\d/.test(match)) {
      return `<span class=\"tok-number\">${match}</span>`;
    }
    return `<span class=\"tok-punct\">${match}</span>`;
  });
}

function updateRawHighlight() {
  rawHighlight.innerHTML = highlightJson(rawEditor.value || "");
}

function updatePreview() {
  const image = fieldImageUrl.value.trim();
  const name = fieldName.value.trim();
  const url = fieldUrl.value.trim();

  if (image) {
    previewIcon.style.backgroundImage = `url("${image}")`;
    previewIcon.classList.remove("empty");
  } else {
    previewIcon.style.backgroundImage = "none";
    previewIcon.classList.add("empty");
  }

  if (previewName) {
    previewName.textContent = name || "(no name)";
  }
  if (previewUrl) {
    previewUrl.textContent = url || "(no url)";
  }
  if (previewOpenBtn) {
    previewOpenBtn.disabled = !url;
  }
  sendPreviewDraft();
}

function setPreviewScale(value) {
  if (!livePreview) {
    return;
  }
  const scale = Math.min(1.5, Math.max(0.3, Number(value) || 0.5));
  livePreview.style.setProperty("--preview-scale", scale);
  if (previewScaleLabel) {
    previewScaleLabel.textContent = `${scale.toFixed(1)}x`;
  }
  if (previewScale) {
    previewScale.value = String(scale);
  }
  localStorage.setItem("watchtv_preview_scale", String(scale));
}

function setPreviewRatio(mode) {
  if (!livePreview) {
    return;
  }
  const ratio = mode === "phone" ? "phone" : "screen";
  if (ratio === "phone") {
    livePreview.style.width = "320px";
    livePreview.style.height = "568px";
  } else {
    livePreview.style.width = "720px";
    livePreview.style.height = "405px";
  }
  if (ratioScreenBtn && ratioPhoneBtn) {
    ratioScreenBtn.classList.toggle("active", ratio === "screen");
    ratioPhoneBtn.classList.toggle("active", ratio === "phone");
  }
  localStorage.setItem("watchtv_preview_ratio", ratio);
}

function setupResizeHandle() {
  const handle = document.querySelector(".live-preview-resize");
  if (!handle || !livePreview) {
    return;
  }
  let startX = 0;
  let startY = 0;
  let startWidth = 0;
  let startHeight = 0;
  let startLeft = 0;
  let startTop = 0;

  handle.addEventListener("mousedown", (event) => {
    event.preventDefault();
    startX = event.clientX;
    startY = event.clientY;
    const rect = livePreview.getBoundingClientRect();
    startWidth = rect.width;
    startHeight = rect.height;
    startLeft = rect.left;
    startTop = rect.top;

    const onMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const newWidth = Math.max(240, startWidth - dx);
      const newHeight = Math.max(220, startHeight - dy);
      livePreview.style.width = `${newWidth}px`;
      livePreview.style.height = `${newHeight}px`;
      livePreview.style.left = `${startLeft + dx}px`;
      livePreview.style.top = `${startTop + dy}px`;
      livePreview.style.right = "auto";
      livePreview.style.bottom = "auto";
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });
}

function buildPreviewDraft() {
  const data = Array.isArray(state.data) ? state.data.map((item) => ({ ...item })) : [];
  if (state.selectedIndex >= 0 && data[state.selectedIndex]) {
    const draft = { ...data[state.selectedIndex] };
    draft.name = fieldName.value.trim() || draft.name || "";
    draft.imageurl = fieldImageUrl.value.trim();
    draft.url = fieldUrl.value.trim();
    draft["context-menu-item"] = readContextRows();
    data[state.selectedIndex] = draft;
  }
  return data;
}

function sendPreviewDraft() {
  if (!livePreview.classList.contains("active")) {
    return;
  }
  if (!state.currentFile) {
    return;
  }
  const payload = {
    type: "preview-data",
    name: state.currentFile,
    data: buildPreviewDraft(),
  };
  ensurePreviewFrame();
  if (previewReady && previewFrame.contentWindow) {
    previewFrame.contentWindow.postMessage(payload, "*");
  } else {
    pendingPreviewPayload = payload;
  }
}

function buildPreviewUrl() {
  if (!state.currentFile) {
    return "";
  }
  const cacheBuster = Date.now();
  return `/preview.html?file=${encodeURIComponent(state.currentFile)}&t=${cacheBuster}`;
}

function ensurePreviewFrame() {
  if (!previewFrame) {
    return;
  }
  if (!state.currentFile) {
    return;
  }
  if (previewFrame.dataset.file !== state.currentFile) {
    previewFrame.src = buildPreviewUrl();
    previewFrame.dataset.file = state.currentFile;
    previewReady = false;
  }
}

function sendPreviewData() {
  if (!livePreview.classList.contains("active")) {
    return;
  }
  if (!state.currentFile) {
    return;
  }
  const payload = {
    type: "preview-data",
    name: state.currentFile,
    data: state.data || [],
  };
  ensurePreviewFrame();
  if (previewReady && previewFrame.contentWindow) {
    previewFrame.contentWindow.postMessage(payload, "*");
  } else {
    pendingPreviewPayload = payload;
  }
}

function refreshPreview() {
  if (!state.currentFile) {
    setStatus("Load a file first.", true);
    return;
  }
  previewFrame.src = buildPreviewUrl();
  previewFrame.dataset.file = state.currentFile;
  previewReady = false;
}

function hidePreviewMenu() {
  previewMenu.classList.remove("active");
}

function showPreviewMenu(x, y) {
  const items = readContextRows();
  previewMenu.innerHTML = "";
  if (!items.length) {
    const emptyItem = document.createElement("div");
    emptyItem.className = "item";
    emptyItem.textContent = "No context items";
    previewMenu.appendChild(emptyItem);
  } else {
    items.forEach((item) => {
      const entry = document.createElement("div");
      entry.className = "item";
      entry.textContent = item.name || item.url || "Open";
      entry.addEventListener("click", () => {
        if (item.url) {
          window.open(item.url, "_blank");
        }
        hidePreviewMenu();
      });
      previewMenu.appendChild(entry);
    });
  }

  const maxX = window.innerWidth - 220;
  const maxY = window.innerHeight - 200;
  previewMenu.style.left = `${Math.min(x, maxX)}px`;
  previewMenu.style.top = `${Math.min(y, maxY)}px`;
  previewMenu.classList.add("active");
}

function getPassword() {
  return passwordInput.value.trim();
}

async function apiFetch(path, options = {}) {
  const password = getPassword();
  if (!password) {
    throw new Error("Password required");
  }
  const headers = Object.assign({}, options.headers || {}, {
    "x-admin-password": password,
  });
  const response = await fetch(path, { ...options, headers });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = payload.error || `Request failed: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}

function renderFileOptions() {
  fileSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select JSON";
  fileSelect.appendChild(placeholder);
  state.files.forEach((file) => {
    // Hide built-in files
    if (file === "archive.json" || file === "config.json") {
      return;
    }
    const option = document.createElement("option");
    option.value = file;
    option.textContent = file;
    fileSelect.appendChild(option);
  });
  if (state.currentFile) {
    fileSelect.value = state.currentFile;
  }
}

function setupListContainer(container, listType) {
  if (container.dataset.dragReady === "true") {
    return;
  }
  container.dataset.dragReady = "true";
  container.dataset.listType = listType;
  const isGrid = listType === "archive" || listType === "items";
  container.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (!isGrid) {
      highlightNearestDropZone(container, event.clientY);
    }
  });
  container.addEventListener("dragleave", (event) => {
    if (!container.contains(event.relatedTarget)) {
      if (isGrid) {
        clearGridHighlight(container);
      } else {
        clearDropHighlights(container);
      }
    }
  });
  container.addEventListener("drop", (event) => {
    event.preventDefault();
    const payload = getDragPayload(event);
    if (!payload) {
      return;
    }
    if (isGrid) {
      clearGridHighlight(container);
    } else {
      clearDropHighlights(container);
    }
    const listLength = getListByType(listType).length;
    const targetEntry = event.target.closest(".list-item");
    let targetIndex = Number.NaN;
    if (targetEntry && container.contains(targetEntry)) {
      targetIndex = Number(targetEntry.dataset.index);
    } else if (container.dataset.nearestIndex !== "") {
      targetIndex = Number(container.dataset.nearestIndex);
    }
    const hasNearest = !Number.isNaN(targetIndex);
    console.log("[drag] drop", {
      from: payload,
      toList: listType,
      targetIndex,
      hasNearest,
      listLength,
    });
    if (payload.list === listType) {
      if (isGrid) {
        const swapIndex = hasNearest ? targetIndex : listLength - 1;
        console.log("[drag] swap", {
          list: listType,
          from: payload.index,
          to: swapIndex,
        });
        if (swapIndex >= 0) {
          swapItems(listType, payload.index, swapIndex);
        }
      } else {
        const finalIndex = hasNearest ? targetIndex : listLength;
        let insertIndex = finalIndex;
        if (payload.index < insertIndex) {
          insertIndex -= 1;
        }
        moveItem(listType, payload.index, insertIndex);
      }
    } else {
      const finalIndex = hasNearest ? targetIndex : listLength;
      moveBetweenLists(payload.list, listType, payload.index, finalIndex);
    }
  });
}

function clearDropHighlights(container) {
  const zones = container.querySelectorAll(".drop-zone.active");
  zones.forEach((zone) => zone.classList.remove("active"));
}

function highlightNearestDropZone(container, clientY) {
  const zones = Array.from(container.querySelectorAll(".drop-zone"));
  if (!zones.length) {
    return;
  }
  let nearest = zones[0];
  let bestDistance = Infinity;
  zones.forEach((zone) => {
    const rect = zone.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    const dist = Math.abs(clientY - mid);
    if (dist < bestDistance) {
      bestDistance = dist;
      nearest = zone;
    }
  });
  zones.forEach((zone) => zone.classList.toggle("active", zone === nearest));
  container.dataset.nearestIndex = nearest.dataset.index || "";
}

function clearGridHighlight(container) {
  const items = container.querySelectorAll(".list-item.drop-target");
  items.forEach((item) => item.classList.remove("drop-target"));
  container.dataset.nearestIndex = "";
}

function setGridTarget(container, entry) {
  const current = container.querySelector(".list-item.drop-target");
  if (current && current !== entry) {
    current.classList.remove("drop-target");
  }
  entry.classList.add("drop-target");
  const nextIndex = entry.dataset.index || "";
  if (container.dataset.nearestIndex !== nextIndex) {
    console.log("[drag] target", {
      list: container.dataset.listType,
      index: nextIndex,
    });
  }
  container.dataset.nearestIndex = nextIndex;
}

function getListByType(listType) {
  return listType === "archive" ? state.archive : state.data;
}

function createDropZone(listType, index, isEmpty) {
  const zone = document.createElement("div");
  zone.className = `drop-zone${isEmpty ? " empty" : ""}`;
  zone.dataset.index = String(index);
  zone.dataset.listType = listType;
  if (listType === "archive") {
    zone.style.height = "100%";
  }

  zone.addEventListener("dragenter", (event) => {
    event.preventDefault();
    event.stopPropagation();
    zone.classList.add("active");
  });

  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.stopPropagation();
    zone.classList.add("active");
    event.dataTransfer.dropEffect = "move";
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("active");
  });

  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const payload = getDragPayload(event);
    if (!payload) {
      return;
    }
    const targetIndex = Number(zone.dataset.index);
    if (payload.list === listType) {
      let insertIndex = targetIndex;
      if (payload.index < insertIndex) {
        insertIndex -= 1;
      }
      moveItem(listType, payload.index, insertIndex);
    } else {
      moveBetweenLists(payload.list, listType, payload.index, targetIndex);
    }
    zone.classList.remove("active");
  });

  return zone;
}

function renderList(container, list, listType) {
  container.innerHTML = "";
  if (!Array.isArray(list)) {
    return;
  }
  const isGrid = listType === "archive" || listType === "items";
  if (isGrid) {
    container.classList.add("icon-grid");
  } else {
    container.classList.remove("icon-grid");
  }
  setupListContainer(container, listType);
  if (list.length === 0) {
    if (!isGrid) {
      container.appendChild(createDropZone(listType, 0, true));
    }
    return;
  }

  if (!isGrid) {
    container.appendChild(createDropZone(listType, 0, false));
  }
  list.forEach((item, index) => {
    const entry = document.createElement("div");
    const isActive = listType === "items" && index === state.selectedIndex;
    entry.className = "list-item" + (isActive ? " active" : "");
    entry.setAttribute("draggable", "true");
    entry.dataset.index = String(index);
    entry.dataset.listType = listType;

    const dragHandle = document.createElement("div");
    dragHandle.className = "list-drag";
    dragHandle.textContent = "≡";

    const thumb = document.createElement("div");
    thumb.className = "list-thumb";
    if (item && item.imageurl) {
      thumb.style.backgroundImage = `url("${item.imageurl}")`;
    }

    const label = item && item.name ? item.name : `item-${index + 1}`;
    const text = document.createElement("div");
    text.className = "list-text";
    text.textContent = `${index + 1}. ${label}`;
    entry.title = label;

    entry.appendChild(dragHandle);
    entry.appendChild(thumb);
    entry.appendChild(text);

    if (listType === "items") {
      entry.addEventListener("click", () => {
        selectItem(index);
      });
    }

    if (isGrid) {
      entry.addEventListener("dragenter", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setGridTarget(container, entry);
      });
      entry.addEventListener("dragover", (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = "move";
        setGridTarget(container, entry);
      });
      entry.addEventListener("dragleave", (event) => {
        if (!entry.contains(event.relatedTarget)) {
          entry.classList.remove("drop-target");
        }
      });
    }

    entry.addEventListener("dragstart", (event) => {
      entry.classList.add("dragging");
      entry.classList.add("drag-source");
      setDragging(true);
      const payload = { list: listType, index };
      const payloadText = JSON.stringify(payload);
      event.dataTransfer.setData("application/json", payloadText);
      event.dataTransfer.setData("text/plain", payloadText);
      event.dataTransfer.effectAllowed = "move";
    });

    entry.addEventListener("dragend", () => {
      entry.classList.remove("dragging", "drag-source");
      setDragging(false);
      if (isGrid) {
        clearGridHighlight(container);
      }
    });

    container.appendChild(entry);
    if (!isGrid) {
      container.appendChild(createDropZone(listType, index + 1, false));
    }
  });
  applyPulse(container, listType);
}

function renderItemList() {
  renderList(itemList, state.data, "items");
}

function renderArchiveList() {
  archiveList.classList.add("icon-only");
  renderList(archiveList, state.archive, "archive");
}

function clearForm() {
  fieldName.value = "";
  fieldImageUrl.value = "";
  fieldUrl.value = "";
  contextList.innerHTML = "";
  updatePreview();
}

function renderContextRows(items) {
  contextList.innerHTML = "";
  const safeItems = Array.isArray(items) ? items : [];
  safeItems.forEach((entry) => {
    addContextRow(entry);
  });
}

function addContextRow(entry = {}) {
  const row = document.createElement("div");
  row.className = "context-row";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "name";
  nameInput.value = entry.name || "";

  const urlInput = document.createElement("input");
  urlInput.type = "text";
  urlInput.placeholder = "url";
  urlInput.value = entry.url || "";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => {
    row.remove();
  });

  row.appendChild(nameInput);
  row.appendChild(urlInput);
  row.appendChild(removeBtn);
  contextList.appendChild(row);
}

function selectItem(index) {
  state.selectedIndex = index;
  const item = state.data[index];
  if (!item) {
    clearForm();
    renderItemList();
    return;
  }
  fieldName.value = item.name || "";
  fieldImageUrl.value = item.imageurl || "";
  fieldUrl.value = item.url || "";
  renderContextRows(item["context-menu-item"]);
  updatePreview();
  renderItemList();
}

function readContextRows() {
  const rows = Array.from(contextList.querySelectorAll(".context-row"));
  return rows
    .map((row) => {
      const inputs = row.querySelectorAll("input");
      const name = inputs[0].value.trim();
      const url = inputs[1].value.trim();
      if (!name && !url) {
        return null;
      }
      return { name, url };
    })
    .filter(Boolean);
}

function applyFormToItem() {
  if (state.selectedIndex < 0 || !Array.isArray(state.data)) {
    setStatus("Select an item first.", true);
    return;
  }
  const item = state.data[state.selectedIndex] || {};
  const nameValue = fieldName.value.trim();
  if (!nameValue) {
    setStatus("Name is required.", true);
    return;
  }
  item.name = nameValue;
  item.imageurl = fieldImageUrl.value.trim();
  item.url = fieldUrl.value.trim();
  item["context-menu-item"] = readContextRows();
  state.data[state.selectedIndex] = item;
  syncRawFromData();
  renderItemList();
  updatePreview();
  setStatus("Item updated.");
}

function syncRawFromData() {
  try {
    rawEditor.value = JSON.stringify(state.data, null, 2);
    updateRawHighlight();
    sendPreviewData();
  } catch (error) {
    setStatus("Failed to update raw JSON.", true);
  }
}

function parseRawToData() {
  try {
    const parsed = new Function(`"use strict"; return (${rawEditor.value});`)();
    if (!Array.isArray(parsed)) {
      setStatus("Raw JSON must be an array.", true);
      return;
    }
    state.data = parsed;
    state.selectedIndex = -1;
    renderItemList();
    clearForm();
    updateRawHighlight();
    sendPreviewData();
    setStatus("Raw JSON applied.");
  } catch (error) {
    setStatus("Raw JSON parse failed.", true);
  }
}

async function loadFiles() {
  setStatus("Loading files...");
  try {
    const result = await apiFetch("/api/files");
    state.files = result.files || [];
    renderFileOptions();
    await loadConfig();
    syncLocalStorageEntries(state.files);
    await loadArchive();
    setStatus("Files loaded.");
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function loadConfig() {
  try {
    const result = await apiFetch("/api/config");
    const data = result && result.data ? result.data : {};
    configState.default = data.default || "watchTV";
    configState.items = Array.isArray(data.items) ? data.items : [];
  } catch (error) {
    configState.default = "watchTV";
    configState.items = [];
  }
}

async function saveConfig() {
  const payload = {
    default: configState.default,
    items: configState.items,
  };
  await apiFetch("/api/config", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: payload }),
  });
}

function syncLocalStorageEntries(files) {
  if (!Array.isArray(files)) {
    return;
  }
  const existing = new Set(configState.items.map((item) => item.file));
  files.forEach((file) => {
    if (!file.endsWith(".json")) {
      return;
    }
    const name = file.replace(/\.json$/i, "");
    const key = `tv_${name}`;
    if (!existing.has(file)) {
      configState.items.push({
        key,
        file,
        alias: name,
        emoji: "📄",
        gradient: "",
        hidden: false,
      });
      existing.add(file);
    }
  });

  if (configState.items.length) {
    configState.items.forEach((item) => {
      const value = `${item.file}|${item.alias}|${item.emoji || "📄"}|${item.gradient || ""}|${item.hidden ? "1" : "0"}`;
      localStorage.setItem(item.key, value);
    });
    localStorage.setItem("_defaultjson", configState.default);
  }
}

function parseLocalStorageValue(value, fallbackFile, fallbackName) {
  const parts = String(value || "").split("|");
  return {
    file: parts[0] || fallbackFile,
    name: parts[1] || fallbackName,
    emoji: parts[2] || "📄",
    gradient: parts[3] || "",
    hidden: parts[4] === "1",
  };
}

function renderSettings() {
  if (!settingsBody) {
    return;
  }
  settingsBody.innerHTML = "";
  const items = Array.isArray(configState.items) ? configState.items : [];
  const visibleRows = [];
  const hiddenRows = [];

  const filteredItems = items.filter(
    (item) => item.file !== "archive.json" && item.file !== "config.json"
  );

  filteredItems.forEach((item) => {
    const name = item.alias || item.file.replace(/\.json$/i, "");
    const key = item.key || `tv_${name}`;
    const current = {
      file: item.file,
      name,
      emoji: item.emoji || "📄",
      gradient: item.gradient || "",
      hidden: Boolean(item.hidden),
    };

    const row = document.createElement("div");
    row.className = "settings-row";
    row.dataset.key = key;
    row.dataset.file = item.file;
    row.dataset.name = name;
    row.dataset.gradient = current.gradient;
    row.dataset.hidden = current.hidden ? "1" : "0";

    const icon = document.createElement("div");
    icon.className = "settings-icon";
    icon.textContent = current.emoji || "📄";
    row.dataset.emoji = current.emoji || "📄";
    icon.title = "Click to edit emoji";
    icon.addEventListener("click", () => {
      const next = prompt("Emoji", row.dataset.emoji || "📄");
      if (next === null) {
        return;
      }
      const value = next.trim() || "📄";
      row.dataset.emoji = value;
      icon.textContent = value;
    });

    const label = document.createElement("div");
    label.className = "settings-file";
    label.textContent = `${item.file}`;

    const aliasInput = document.createElement("input");
    aliasInput.type = "text";
    aliasInput.placeholder = "alias";
    aliasInput.value = current.name || name;
    aliasInput.className = "settings-alias";

    const gradientSelect = document.createElement("select");
    gradientSelect.className = "settings-gradient";
    const swatch = document.createElement("div");
    swatch.className = "settings-swatch";
    const gradientWrap = document.createElement("div");
    gradientWrap.className = "settings-gradient-wrap";
    let hasMatch = false;
    GRADIENT_PRESETS.forEach((preset) => {
      const option = document.createElement("option");
      option.value = preset.value;
      option.textContent = preset.label;
      if (preset.value === current.gradient) {
        option.selected = true;
        hasMatch = true;
      }
      gradientSelect.appendChild(option);
    });
    if (!hasMatch && current.gradient) {
      const option = document.createElement("option");
      option.value = current.gradient;
      option.textContent = "Custom";
      option.selected = true;
      gradientSelect.appendChild(option);
    }
    swatch.style.background = gradientSelect.value || "#1f252d";
    gradientSelect.addEventListener("change", () => {
      swatch.style.background = gradientSelect.value || "#1f252d";
    });

    const hideLabel = document.createElement("label");
    hideLabel.style.display = "inline-flex";
    hideLabel.style.alignItems = "center";
    hideLabel.style.gap = "6px";
    hideLabel.style.fontSize = "14px";
    hideLabel.style.color = "#c9d3dd";
    hideLabel.style.cursor = "pointer";
    const hideInput = document.createElement("input");
    hideInput.type = "checkbox";
    hideInput.checked = current.hidden;
    hideInput.style.display = "none";
    const hideIcon = document.createElement("span");
    hideIcon.textContent = current.hidden ? "🙈" : "👁️";
    hideLabel.appendChild(hideInput);
    hideLabel.appendChild(hideIcon);
    hideInput.addEventListener("change", () => {
      hideIcon.textContent = hideInput.checked ? "🙈" : "👁️";
      row.dataset.hidden = hideInput.checked ? "1" : "0";
      let divider = settingsBody.querySelector("#settingsHiddenDivider");
      if (hideInput.checked) {
        if (!divider) {
          divider = document.createElement("div");
          divider.id = "settingsHiddenDivider";
          divider.style.fontSize = "11px";
          divider.style.color = "#8f9aa6";
          divider.style.padding = "4px 2px";
          divider.textContent = "Hidden";
          settingsBody.appendChild(divider);
        }
        divider.after(row);
      } else if (divider) {
        settingsBody.insertBefore(row, divider);
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "settings-delete";
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      if (!confirm(`Delete ${item.file}?`)) {
        return;
      }
      deleteJsonConfig(item.file, row.dataset.key);
    });

    gradientWrap.appendChild(gradientSelect);
    gradientWrap.appendChild(swatch);

    row.appendChild(label);
    row.appendChild(icon);
    row.appendChild(aliasInput);
    row.appendChild(gradientWrap);
    row.appendChild(hideLabel);
    row.appendChild(deleteBtn);
    if (current.hidden) {
      hiddenRows.push(row);
    } else {
      visibleRows.push(row);
    }
  });

  visibleRows.forEach((row) => settingsBody.appendChild(row));
  if (hiddenRows.length) {
    const divider = document.createElement("div");
    divider.id = "settingsHiddenDivider";
    divider.style.fontSize = "11px";
    divider.style.color = "#8f9aa6";
    divider.style.padding = "4px 2px";
    divider.textContent = "Hidden";
    settingsBody.appendChild(divider);
    hiddenRows.forEach((row) => settingsBody.appendChild(row));
  }
}

function saveSettings() {
  if (!settingsBody) {
    return;
  }
  const rows = settingsBody.querySelectorAll(".settings-row");
  const nextItems = [];
  rows.forEach((row) => {
    const key = row.dataset.key;
    const file = row.dataset.file;
    const aliasInput = row.querySelector(".settings-alias");
    const gradientSelect = row.querySelector(".settings-gradient");
    const hideInput = row.querySelector('input[type="checkbox"]');
    const gradient = gradientSelect ? gradientSelect.value : "";
    const emoji = row.dataset.emoji || "📄";
    const alias = aliasInput && aliasInput.value.trim() ? aliasInput.value.trim() : file.replace(/\.json$/i, "");
    const hidden = hideInput && hideInput.checked ? "1" : "0";
    const value = `${file}|${alias}|${emoji}|${gradient}|${hidden}`;
    localStorage.setItem(key, value);
    nextItems.push({
      key,
      file,
      alias,
      emoji,
      gradient,
      hidden: hidden === "1",
    });
  });
  configState.items = nextItems;
  saveConfig();
}

function restoreDefaultLocalStorage() {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("tv_")) {
      localStorage.removeItem(key);
    }
  });
  localStorage.removeItem("_defaultjson");
}

async function createJsonFile(name) {
  if (!name) {
    setStatus("Filename required.", true);
    return;
  }
  const safe = name.endsWith(".json") ? name : `${name}.json`;
  await apiFetch(`/api/file/${safe}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [] }),
  });
  if (!state.files.includes(safe)) {
    state.files.push(safe);
    state.files.sort((a, b) => a.localeCompare(b));
  }
  const alias = safe.replace(/\.json$/i, "");
  configState.items.push({
    key: `tv_${alias}`,
    file: safe,
    alias,
    emoji: "📄",
    gradient: "",
    hidden: false,
  });
  await saveConfig();
  syncLocalStorageEntries(state.files);
  renderFileOptions();
  renderSettings();
  setStatus(`Created ${safe}.`);
}

async function deleteJsonConfig(file, key) {
  try {
    await apiFetch(`/api/file/${file}`, { method: "DELETE" });
  } catch (error) {
    setStatus(`Delete failed: ${error.message}`, true);
    return;
  }
  configState.items = configState.items.filter((item) => item.file !== file);
  if (state.currentFile === file) {
    state.currentFile = null;
  }
  Object.keys(localStorage).forEach((k) => {
    if (k === key || k === `tv_${file.replace(/\\.json$/i, "")}`) {
      localStorage.removeItem(k);
    }
  });
  state.files = state.files.filter((f) => f !== file);
  await saveConfig();
  renderFileOptions();
  renderSettings();
  setStatus(`Deleted ${file}.`);
}

async function loadArchive() {
  try {
    const result = await apiFetch(`/api/file/${ARCHIVE_FILE}`);
    if (result.parseError) {
      state.archive = [];
      renderArchiveList();
      setStatus(`Archive parse error: ${result.parseError}`, true);
      return;
    }
    state.archive = Array.isArray(result.data) ? result.data : [];
    renderArchiveList();
  } catch (error) {
    state.archive = [];
    renderArchiveList();
    setStatus("Archive not loaded.", true);
  }
}

async function loadFile(name) {
  if (!name) {
    setStatus("Select a file first.", true);
    return;
  }
  setStatus(`Loading ${name}...`);
  try {
    const result = await apiFetch(`/api/file/${name}`);
    state.currentFile = name;
    rawEditor.value = result.raw || "";
    updateRawHighlight();
    if (result.parseError) {
      state.data = [];
      state.selectedIndex = -1;
      renderItemList();
      clearForm();
      setStatus(`Loaded with parse error: ${result.parseError}`, true);
      return;
    }
    state.data = Array.isArray(result.data) ? result.data : [];
    state.selectedIndex = -1;
    renderItemList();
    clearForm();
    sendPreviewData();
    setStatus(`Loaded ${name}.`);
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function saveFile() {
  if (!state.currentFile) {
    setStatus("No file loaded.", true);
    return;
  }
  setStatus("Saving...");
  try {
    const payload = { data: state.data };
    await apiFetch(`/api/file/${state.currentFile}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    syncRawFromData();
    setStatus("Saved.");
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function saveArchive() {
  if (!Array.isArray(state.archive)) {
    return;
  }
  try {
    const payload = { data: state.archive };
    await apiFetch(`/api/file/${ARCHIVE_FILE}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    setStatus("Archive save failed.", true);
  }
}

async function uploadIcon() {
  const file = iconUpload.files && iconUpload.files[0];
  if (!file) {
    setStatus("Choose an icon file first.", true);
    return;
  }
  await uploadIconFile(file);
}

async function uploadIconFile(file, filenameOverride) {
  setStatus("Uploading icon...");
  try {
    const formData = new FormData();
    if (filenameOverride) {
      formData.append("icon", file, filenameOverride);
    } else {
      formData.append("icon", file);
    }
    const result = await apiFetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    fieldImageUrl.value = result.url;
    updatePreview();
    setStatus(`Uploaded ${result.filename}. Image URL set.`);
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function handleImagePaste(event) {
  const active = document.activeElement;
  if (active !== fieldImageUrl) {
    return;
  }
  const clipboard = event.clipboardData;
  if (!clipboard) {
    return;
  }
  let file = null;
  if (clipboard.files && clipboard.files.length) {
    for (const candidate of clipboard.files) {
      if (candidate.type && candidate.type.startsWith("image/")) {
        file = candidate;
        break;
      }
    }
  }
  if (!file && clipboard.items) {
    for (const item of clipboard.items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        file = item.getAsFile();
        break;
      }
    }
  }
  if (!file) {
    return;
  }
  event.preventDefault();
  const ext = file.type.split("/")[1] || "png";
  const nameValue = fieldName.value.trim() || "pasted-icon";
  const filename = `${nameValue}.${ext}`;
  await uploadIconFile(file, filename);
}

function formatRaw() {
  try {
    const parsed = new Function(`"use strict"; return (${rawEditor.value});`)();
    rawEditor.value = JSON.stringify(parsed, null, 2);
    updateRawHighlight();
    setStatus("Raw JSON formatted.");
  } catch (error) {
    setStatus("Format failed.", true);
  }
}

connectBtn.addEventListener("click", () => {
  const password = getPassword();
  if (!password) {
    setStatus("Password required.", true);
    return;
  }
  localStorage.setItem("watchtv_admin_password", password);
  loadFiles();
});

loadBtn.addEventListener("click", () => {
  loadFile(fileSelect.value);
});

saveBtn.addEventListener("click", saveFile);
uploadBtn.addEventListener("click", uploadIcon);
if (toggleArchiveBtn) {
  toggleArchiveBtn.addEventListener("click", () => {
    const isCollapsed = archivePanel.classList.contains("collapsed");
    setArchiveCollapsed(!isCollapsed);
  });
}

livePreviewBtn.addEventListener("click", () => {
  const isActive = livePreview.classList.toggle("active");
  livePreviewBtn.classList.toggle("active", isActive);
  if (isActive) {
    ensurePreviewFrame();
    sendPreviewData();
  }
});

refreshPreviewBtn.addEventListener("click", () => {
  refreshPreview();
});

closePreviewBtn.addEventListener("click", () => {
  livePreview.classList.remove("active");
  livePreviewBtn.classList.remove("active");
});

if (previewScale) {
  previewScale.addEventListener("input", (event) => {
    setPreviewScale(event.target.value);
  });
}

if (ratioScreenBtn && ratioPhoneBtn) {
  ratioScreenBtn.addEventListener("click", () => setPreviewRatio("screen"));
  ratioPhoneBtn.addEventListener("click", () => setPreviewRatio("phone"));
}

if (settingsBtn && settingsModal) {
  settingsBtn.addEventListener("click", () => {
    renderSettings();
    settingsModal.classList.add("active");
  });
}

if (closeSettingsBtn && settingsModal) {
  closeSettingsBtn.addEventListener("click", () => {
    settingsModal.classList.remove("active");
  });
}

if (saveSettingsBtn) {
  saveSettingsBtn.addEventListener("click", () => {
    saveSettings();
    if (settingsModal) {
      settingsModal.classList.remove("active");
    }
  });
}

if (resetSettingsBtn) {
  resetSettingsBtn.addEventListener("click", () => {
    restoreDefaultLocalStorage();
    loadConfig().then(() => {
      syncLocalStorageEntries(state.files);
      renderSettings();
    });
  });
}

if (addJsonBtn) {
  addJsonBtn.addEventListener("click", () => {
    const name = prompt("New JSON filename (e.g. newlist.json)");
    if (name === null) {
      return;
    }
    createJsonFile(name.trim());
  });
}
addItemBtn.addEventListener("click", () => {
  if (!Array.isArray(state.data)) {
    state.data = [];
  }
  const newItem = {
    name: "",
    imageurl: "",
    url: "",
    "context-menu-item": [],
  };
  state.data.push(newItem);
  selectItem(state.data.length - 1);
  syncRawFromData();
  sendPreviewData();
  setStatus("Item added.");
});

deleteItemBtn.addEventListener("click", () => {
  if (state.selectedIndex < 0) {
    setStatus("Select an item to delete.", true);
    return;
  }
  state.data.splice(state.selectedIndex, 1);
  state.selectedIndex = -1;
  renderItemList();
  clearForm();
  syncRawFromData();
  sendPreviewData();
  setStatus("Item deleted.");
});

applyItemBtn.addEventListener("click", applyFormToItem);
addContextBtn.addEventListener("click", () => addContextRow());
applyRawBtn.addEventListener("click", parseRawToData);
formatRawBtn.addEventListener("click", formatRaw);

contextList.addEventListener("input", () => {
  sendPreviewDraft();
});

previewIcon.addEventListener("click", () => {
  const url = fieldUrl.value.trim();
  if (url) {
    window.open(url, "_blank");
  }
});

if (previewOpenBtn) {
  previewOpenBtn.addEventListener("click", () => {
    const url = fieldUrl.value.trim();
    if (url) {
      window.open(url, "_blank");
    }
  });
}

[fieldName, fieldImageUrl, fieldUrl].forEach((field) => {
  field.addEventListener("input", updatePreview);
});

fieldImageUrl.addEventListener("paste", handleImagePaste);
document.addEventListener("paste", handleImagePaste);

previewIcon.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  showPreviewMenu(event.clientX, event.clientY);
});

document.addEventListener("click", (event) => {
  if (!previewMenu.contains(event.target)) {
    hidePreviewMenu();
  }
});

document.addEventListener(
  "scroll",
  () => {
    hidePreviewMenu();
  },
  true
);

rawEditor.addEventListener("input", updateRawHighlight);
rawEditor.addEventListener("scroll", () => {
  rawHighlight.scrollTop = rawEditor.scrollTop;
  rawHighlight.scrollLeft = rawEditor.scrollLeft;
});

fileSelect.addEventListener("change", () => {
  if (fileSelect.value) {
    loadFile(fileSelect.value);
  }
});

const savedPassword = localStorage.getItem("watchtv_admin_password");
if (savedPassword) {
  passwordInput.value = savedPassword;
}

const storedArchiveCollapsed = localStorage.getItem("watchtv_archive_collapsed");
setArchiveCollapsed(storedArchiveCollapsed !== "0");

const storedScale = localStorage.getItem("watchtv_preview_scale");
setPreviewScale(storedScale || 0.5);

const storedRatio = localStorage.getItem("watchtv_preview_ratio");
setPreviewRatio(storedRatio || "screen");

livePreview.classList.add("active");
livePreviewBtn.classList.add("active");
ensurePreviewFrame();
setupResizeHandle();

if (savedPassword) {
  loadFiles();
}

previewFrame.addEventListener("load", () => {
  previewReady = true;
  if (pendingPreviewPayload && previewFrame.contentWindow) {
    previewFrame.contentWindow.postMessage(pendingPreviewPayload, "*");
    pendingPreviewPayload = null;
  }
});

renderFileOptions();
renderItemList();
renderArchiveList();
clearForm();
updateRawHighlight();
