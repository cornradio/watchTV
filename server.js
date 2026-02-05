const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const ROOT_DIR = __dirname;
const PLAN_DIR = path.join(ROOT_DIR, "a-plan");
const UPLOAD_DIR = path.join(PLAN_DIR, "imgs");
const CONFIG_FILE = path.join(PLAN_DIR, "config.json");
const PASSWORD_FILE = path.join(ROOT_DIR, "password.txt");
const DEFAULT_PASSWORD = "1230";
const PORT = Number(process.env.PORT) || 8901;

function readPassword() {
  try {
    const value = fs.readFileSync(PASSWORD_FILE, "utf8").trim();
    if (value) {
      return value;
    }
  } catch (error) {
    // ignore and fall through
  }

  try {
    fs.writeFileSync(PASSWORD_FILE, DEFAULT_PASSWORD + "\n", "utf8");
  } catch (error) {
    // ignore write failures
  }
  return DEFAULT_PASSWORD;
}

function isSafeJsonFilename(name) {
  return /^[a-zA-Z0-9_.-]+\.json$/.test(name);
}

function isSafeImageFilename(name) {
  if (!/^[a-zA-Z0-9_.-]+$/.test(name)) {
    return false;
  }
  const ext = path.extname(name).toLowerCase();
  return allowedExtensions.has(ext);
}

function sanitizeBasename(name) {
  const base = name.replace(/[^a-zA-Z0-9_-]/g, "_");
  return base || "icon";
}

function parseLooseJson(text) {
  return new Function(`"use strict"; return (${text});`)();
}

function getJsonFiles() {
  return fs
    .readdirSync(PLAN_DIR)
    .filter((file) => file.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b));
}

function getImageFiles() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    return [];
  }
  return fs
    .readdirSync(UPLOAD_DIR)
    .filter((file) => allowedExtensions.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
}

const app = express();
app.use(express.json({ limit: "10mb" }));

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const allowedExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
]);

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
      const original = path.basename(file.originalname || "icon");
      const ext = path.extname(original).toLowerCase();
      const base = sanitizeBasename(path.basename(original, ext));
      let filename = `${base}${ext || ".png"}`;
      if (fs.existsSync(path.join(UPLOAD_DIR, filename))) {
        filename = `${base}-${Date.now()}${ext || ".png"}`;
      }
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    if (!allowedExtensions.has(ext)) {
      return cb(new Error("invalid file type"));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

function requirePassword(req, res, next) {
  const password =
    req.get("x-admin-password") ||
    req.query.password ||
    (req.body && req.body.password);
  const expected = readPassword();
  if (!password || password !== expected) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

app.get("/api/files", requirePassword, (req, res) => {
  try {
    const files = getJsonFiles();
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: "failed to list files" });
  }
});

app.get("/api/file/:name", requirePassword, (req, res) => {
  const name = req.params.name;
  if (!isSafeJsonFilename(name)) {
    return res.status(400).json({ error: "invalid filename" });
  }

  const filePath = path.join(PLAN_DIR, name);
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    let data = null;
    let parseError = null;
    try {
      data = parseLooseJson(raw);
    } catch (error) {
      parseError = String(error && error.message ? error.message : error);
    }
    res.json({ name, raw, data, parseError });
  } catch (error) {
    res.status(404).json({ error: "file not found" });
  }
});

app.put("/api/file/:name", requirePassword, (req, res) => {
  const name = req.params.name;
  if (!isSafeJsonFilename(name)) {
    return res.status(400).json({ error: "invalid filename" });
  }

  const filePath = path.join(PLAN_DIR, name);
  const { raw, data } = req.body || {};

  let output = "";
  if (typeof raw === "string") {
    try {
      parseLooseJson(raw);
    } catch (error) {
      return res.status(400).json({ error: "invalid json" });
    }
    output = raw;
  } else if (data !== undefined) {
    output = JSON.stringify(data, null, 2);
  } else {
    return res.status(400).json({ error: "missing body" });
  }

  try {
    fs.writeFileSync(filePath, output, "utf8");
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "failed to write file" });
  }
});

app.delete("/api/file/:name", requirePassword, (req, res) => {
  const name = req.params.name;
  if (!isSafeJsonFilename(name)) {
    return res.status(400).json({ error: "invalid filename" });
  }
  if (name === "archive.json" || name === "config.json") {
    return res.status(400).json({ error: "protected file" });
  }
  const filePath = path.join(PLAN_DIR, name);
  try {
    fs.unlinkSync(filePath);
    res.json({ ok: true });
  } catch (error) {
    res.status(404).json({ error: "file not found" });
  }
});

app.get("/api/config", requirePassword, (req, res) => {
  try {
    const raw = fs.readFileSync(CONFIG_FILE, "utf8");
    const data = JSON.parse(raw);
    res.json({ data });
  } catch (error) {
    res.status(404).json({ error: "config not found" });
  }
});

app.put("/api/config", requirePassword, (req, res) => {
  const { data } = req.body || {};
  if (!data) {
    return res.status(400).json({ error: "missing body" });
  }
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2), "utf8");
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "failed to write config" });
  }
});

app.post("/api/upload", requirePassword, upload.single("icon"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "no file" });
  }
  res.json({ filename: req.file.filename, url: `imgs/${req.file.filename}` });
});

app.get("/api/images", requirePassword, (req, res) => {
  try {
    const files = getImageFiles();
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: "failed to list images" });
  }
});

app.post("/api/images/delete", requirePassword, (req, res) => {
  const files = Array.isArray(req.body && req.body.files) ? req.body.files : [];
  if (!files.length) {
    return res.status(400).json({ error: "no files" });
  }
  const deleted = [];
  const failed = [];
  files.forEach((file) => {
    if (!isSafeImageFilename(file)) {
      failed.push(file);
      return;
    }
    const target = path.join(UPLOAD_DIR, file);
    try {
      fs.unlinkSync(target);
      deleted.push(file);
    } catch (error) {
      failed.push(file);
    }
  });
  res.json({ deleted, failed });
});

app.use((err, req, res, next) => {
  if (err && err.message === "invalid file type") {
    return res.status(400).json({ error: "invalid file type" });
  }
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "file too large" });
  }
  next(err);
});

app.use(express.static(PLAN_DIR));

app.listen(PORT, () => {
  console.log(`watchTV admin server listening on http://localhost:${PORT}`);
});
