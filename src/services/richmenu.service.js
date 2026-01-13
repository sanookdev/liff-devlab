import axios from "axios";
import fs from "fs";
import path from "path";
import { env } from "../config/env.js";

const LINE_BASE = "https://api.line.me/v2/bot";
const LINE_DATA_BASE = "https://api-data.line.me/v2/bot";

function authHeaders(extra = {}) {
  return {
    Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`,
    ...extra,
  };
}

// 1) Create rich menu
export async function createRichMenu(richMenuObject) {
  return axios.post(`${LINE_BASE}/richmenu`, richMenuObject, {
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
}

// 2) List rich menus
export async function listRichMenus() {
  return axios.get(`${LINE_BASE}/richmenu/list`, {
    headers: authHeaders(),
  });
}

// 3) Get rich menu detail
export async function getRichMenu(richMenuId) {
  return axios.get(`${LINE_BASE}/richmenu/${richMenuId}`, {
    headers: authHeaders(),
  });
}

// 4) Upload image (PNG/JPEG)
export async function uploadRichMenuImage(richMenuId, imageFilePath) {
  const ext = path.extname(imageFilePath).toLowerCase();
  const contentType = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";

  const stream = fs.createReadStream(imageFilePath);

  return axios.post(`${LINE_DATA_BASE}/richmenu/${richMenuId}/content`, stream, {
    headers: authHeaders({ "Content-Type": contentType }),
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });
}


// 5) Set default rich menu
export async function setDefaultRichMenu(richMenuId) {
  return axios.post(`${LINE_BASE}/user/all/richmenu/${richMenuId}`, null, {
    headers: authHeaders(),
  });
}

// 6) Cancel default rich menu
export async function cancelDefaultRichMenu() {
  return axios.delete(`${LINE_BASE}/user/all/richmenu`, {
    headers: authHeaders(),
  });
}

// 7) Link rich menu to a user
export async function linkRichMenuToUser(richMenuId, userId) {
  return axios.post(`${LINE_BASE}/user/${userId}/richmenu/${richMenuId}`, null, {
    headers: authHeaders(),
  });
}

// 8) Unlink rich menu from a user
export async function unlinkRichMenuFromUser(userId) {
  return axios.delete(`${LINE_BASE}/user/${userId}/richmenu`, {
    headers: authHeaders(),
  });
}

// 9) Delete rich menu
export async function deleteRichMenu(richMenuId) {
  return axios.delete(`${LINE_BASE}/richmenu/${richMenuId}`, {
    headers: authHeaders(),
  });
}
