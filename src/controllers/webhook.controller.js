import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { verifyLineSignature } from "../utils/signature.js";
import {
  replyText,
  pushText,
  replyMessages,
  replyFlexMessages,
  replyQuick,
  replyMenuFlex,
  replyPromotionFlex,
  replyContactFlex,
} from "../services/line.service.js";
import { listRichMenus, linkRichMenuToUser } from "../services/richmenu.service.js";

// Helper function to find rich menu by name
async function findRichMenuByName(searchName) {
  const response = await listRichMenus();
  const richmenus = response.data.richmenus || [];
  return richmenus.find(menu =>
    menu.name.toLowerCase().includes(searchName.toLowerCase())
  );
}


export async function handleWebhook(req, res) {
  const signature = req.headers["x-line-signature"];
  const ok = verifyLineSignature(req.rawBody || "", signature, env.LINE_CHANNEL_SECRET);

  if (!ok) {
    logger.warn("Invalid signature");
    return res.sendStatus(401);
  }

  const body = req.body || {};
  const events = body.events || [];

  for (const event of events) {
    await dispatchEvent(event);
  }

  return res.sendStatus(200);
}

async function dispatchEvent(event) {
  try {
    switch (event.type) {
      case "message":
        return onMessage(event);
      case "follow":
        return onFollow(event);
      case "unfollow":
        return onUnfollow(event);
      case "postback":
        return onPostback(event);
      case "beacon":
        return onBeacon(event);
      default:
        logger.info("Unhandled event type:", event.type);
        return;
    }
  } catch (e) {
    logger.error("dispatchEvent error:", e?.message || e);
  }
}

async function onMessage(event) {
  const text = event.message?.text?.toLowerCase() || "";
  const userId = event.source?.userId;

  // === Quick Menu Demo Commands ===
  if (text === "menu") {
    return replyMenuFlex(event.replyToken);
  }

  if (text === "promotion") {
    return replyPromotionFlex(event.replyToken);
  }

  if (text === "contact") {
    return replyContactFlex(event.replyToken);
  }

  // === Rich Menu Switch Commands ===
  if (text === "ร้านอาหาร" || text === "restaurant") {
    const menu = await findRichMenuByName("ร้านอาหาร");
    if (menu && userId) {
      await linkRichMenuToUser(menu.richMenuId, userId);
      return replyText(event.replyToken, "🍜 เปลี่ยนเป็นเมนูร้านอาหารแล้ว!");
    }
    return replyText(event.replyToken, "❌ ไม่พบเมนูร้านอาหาร");
  }

  if (text === "helpme" || text === "help me") {
    const menu = await findRichMenuByName("helpme");
    if (menu && userId) {
      await linkRichMenuToUser(menu.richMenuId, userId);
      return replyText(event.replyToken, "🆘 เปลี่ยนเป็นเมนู Help Me แล้ว!");
    }
    return replyText(event.replyToken, "❌ ไม่พบเมนู Help Me");
  }

  // === Switch Menu Command ===
  if (text === "switch" || text === "เปลี่ยนเมนู") {
    return replyMessages(event.replyToken, [{
      type: "text",
      text: "🔄 เลือกเมนูที่ต้องการ:",
      quickReply: {
        items: [
          {
            type: "action",
            action: {
              type: "message",
              label: "🍜 ร้านอาหาร",
              text: "ร้านอาหาร"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "🆘 Help Me",
              text: "helpme"
            }
          }
        ]
      }
    }]);
  }

  // === Other Commands ===
  if (text === "help") {
    return replyText(event.replyToken, "📌 คำสั่ง: menu | promotion | contact | switch | ping | pushme");
  }

  if (text === "ping") {
    return replyText(event.replyToken, "pong ✅");
  }

  if (text === "pushme" && userId) {
    await replyText(event.replyToken, "กำลังส่ง push ให้คุณ…");
    return pushText(userId, "นี่คือ Push Message จาก Backend ✅");
  }

  // Default: Show Quick Reply Menu
  return replyQuick(event.replyToken);
}

async function onFollow(event) {
  const userId = event.source?.userId;
  await replyText(event.replyToken, "ขอบคุณที่เพิ่มเพื่อนครับ ✅ พิมพ์ help เพื่อดูคำสั่ง");
  logger.info("FOLLOW userId:", userId);
}

async function onUnfollow(event) {
  const userId = event.source?.userId;
  logger.info("UNFOLLOW userId:", userId);
}

async function onPostback(event) {
  const data = event.postback?.data || "";
  // ตัวอย่าง: action=OPEN_MENU / action=HELLO
  await replyText(event.replyToken, `ได้รับ postback: ${data}`);
}

async function onBeacon(event) {
  await replyText(event.replyToken, "Beacon event received");
}
