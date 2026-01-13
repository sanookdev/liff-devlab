import { setDefaultRichMenu } from "../src/services/richmenu.service.js";
import { getArg } from "../src/utils/args.js";
import { printUsage } from "./_common.js";

const richMenuId = getArg(2);
if (!richMenuId) {
  printUsage("npm run richmenu:set-default --", "<RICHMENU_ID>");
  process.exit(1);
}

const res = await setDefaultRichMenu(richMenuId);
console.log("OK setDefaultRichMenu:", res.status);
