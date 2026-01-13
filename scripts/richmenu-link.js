import { linkRichMenuToUser } from "../src/services/richmenu.service.js";
import { getArg } from "../src/utils/args.js";
import { printUsage } from "./_common.js";

const richMenuId = getArg(2);
const userId = getArg(3);

if (!richMenuId || !userId) {
  printUsage("npm run richmenu:link --", "<RICHMENU_ID> <USER_ID>");
  process.exit(1);
}

const res = await linkRichMenuToUser(richMenuId, userId);
console.log("OK linkRichMenuToUser:", res.status);
