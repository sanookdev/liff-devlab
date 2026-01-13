import { uploadRichMenuImage } from "../src/services/richmenu.service.js";
import { getArg, } from "../src/utils/args.js";
import { printUsage } from "./_common.js";

const richMenuId = getArg(2);
const imagePath = process.env.RICHMENU_IMAGE_PATH || "assets/richmenu.jpg";

if (!richMenuId) {
  printUsage("npm run richmenu:upload --", "<RICHMENU_ID>");
  process.exit(1);
}

const res = await uploadRichMenuImage(richMenuId, imagePath);
console.log("OK uploadRichMenuImage:", res.status);
