import { unlinkRichMenuFromUser } from "../src/services/richmenu.service.js";
import { getArg } from "../src/utils/args.js";
import { printUsage } from "./_common.js";

const userId = getArg(2);
if (!userId) {
  printUsage("npm run richmenu:unlink --", "<USER_ID>");
  process.exit(1);
}

const res = await unlinkRichMenuFromUser(userId);
console.log("OK unlinkRichMenuFromUser:", res.status);
