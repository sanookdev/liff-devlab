import { createRichMenu } from "../src/services/richmenu.service.js";
import { readJson } from "./_common.js";

const payload = readJson("richmenu/richmenu.sample.json");
const res = await createRichMenu(payload);
console.log("OK createRichMenu:", res.data); // { richMenuId: "..." }
