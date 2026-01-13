import { listRichMenus } from "../src/services/richmenu.service.js";

const res = await listRichMenus();
console.log(JSON.stringify(res.data, null, 2));
