import { getRichMenu } from "../src/services/richmenu.service.js";
import { getArg } from "../src/utils/args.js";
import { printUsage } from "./_common.js";

const richMenuId = getArg(2);
if (!richMenuId) {
  printUsage("npm run richmenu:get --", "<RICHMENU_ID>");
  process.exit(1);
}

const res = await getRichMenu(richMenuId);
console.log(JSON.stringify(res.data, null, 2));
