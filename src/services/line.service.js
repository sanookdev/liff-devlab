import axios from "axios";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

const LINE_BASE = "https://api.line.me/v2/bot";

function headers() {
  return {
    Authorization: `Bearer ${env.LINE_CHANNEL_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };
}

async function lineRequest(endpoint, payload) {
  try {
    return await axios.post(`${LINE_BASE}${endpoint}`, payload, { headers: headers() });
  } catch (error) {
    const data = error.response?.data;
    const status = error.response?.status;

    // Suppress "Invalid reply token" error (likely from retries)
    if (status === 400 && data?.message === "Invalid reply token") {
      logger.warn("Ignored 'Invalid reply token' (likely expired or duplicate request)");
      return null;
    }

    logger.error(`LINE API Error (${status}):`, JSON.stringify(data || error.message));
    throw error; // Re-throw so the caller knows it failed
  }
}

export async function replyText(replyToken, text) {
  return lineRequest("/message/reply", {
    replyToken,
    messages: [{ type: "text", text }],
  });
}

export async function replyMessages(replyToken) {
  return lineRequest("/message/reply", {
    replyToken,
    messages: [
      {
        type: "sticker",
        packageId: "11537",
        stickerId: "52002747",
      },
      { type: "text", text: "ข้อความที่ 2" },
      { type: "text", text: "ข้อความที่ 3" },
      { type: "text", text: "ข้อความที่ 4" },
      { type: "text", text: "ข้อความที่ 5" },
    ],
  });
}

export async function replyFlexMessages(replyToken) {
  return lineRequest("/message/reply", {
    replyToken,
    messages: [
      {
        type: "flex",
        altText: "Test",
        contents: {
          type: "bubble",
          hero: {
            type: "image",
            url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_2_restaurant.png",
            size: "full",
            aspectRatio: "20:13",
            aspectMode: "cover",
            action: {
              type: "uri",
              label: "Action",
              uri: "https://linecorp.com",
            },
          },
          body: {
            type: "box",
            layout: "vertical",
            spacing: "md",
            action: {
              type: "uri",
              label: "Action",
              uri: "https://linecorp.com",
            },
            contents: [
              {
                type: "text",
                text: "Brown's Burger",
                weight: "bold",
                size: "xl",
                contents: [],
              },
              {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                contents: [
                  {
                    type: "box",
                    layout: "baseline",
                    contents: [
                      {
                        type: "icon",
                        url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/restaurant_regular_32.png",
                      },
                      {
                        type: "text",
                        text: "$10.5",
                        weight: "bold",
                        margin: "sm",
                        contents: [],
                      },
                      {
                        type: "text",
                        text: "400kcl",
                        size: "sm",
                        color: "#AAAAAA",
                        align: "end",
                        contents: [],
                      },
                    ],
                  },
                  {
                    type: "box",
                    layout: "baseline",
                    contents: [
                      {
                        type: "icon",
                        url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/restaurant_large_32.png",
                      },
                      {
                        type: "text",
                        text: "$15.5",
                        weight: "bold",
                        flex: 0,
                        margin: "sm",
                        contents: [],
                      },
                      {
                        type: "text",
                        text: "550kcl",
                        size: "sm",
                        color: "#AAAAAA",
                        align: "end",
                        contents: [],
                      },
                    ],
                  },
                ],
              },
              {
                type: "text",
                text: "Sauce, Onions, Pickles, Lettuce & Cheese",
                size: "xxs",
                color: "#AAAAAA",
                wrap: true,
                contents: [],
              },
            ],
          },
          footer: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "spacer",
                size: "xxl",
              },
              {
                type: "button",
                action: {
                  type: "uri",
                  label: "Add to Cart",
                  uri: "https://linecorp.com",
                },
                color: "#905C44",
                style: "primary",
              },
            ],
          },
        },
      },
    ],
  });
}

export async function replyQuick(replyToken) {
  return lineRequest("/message/reply", {
    replyToken,
    messages: [
      {
        type: "text",
        text: "🍽️ ยินดีต้อนรับสู่ร้านอาหารของเรา! เลือกหมวดที่สนใจได้เลยครับ",
        quickReply: {
          items: [
            {
              type: "action",
              imageUrl: "https://cdn-icons-png.flaticon.com/128/3176/3176266.png",
              action: {
                type: "message",
                label: "🍔 เมนูอาหารf",
                text: "menu",
              },
            },
            {
              type: "action",
              imageUrl: "https://cdn-icons-png.flaticon.com/128/3176/3176275.png",
              action: {
                type: "message",
                label: "🎉 โปรโมชั่น",
                text: "promotion",
              },
            },
            {
              type: "action",
              imageUrl: "https://cdn-icons-png.flaticon.com/128/724/724664.png",
              action: {
                type: "message",
                label: "📞 ติดต่อเรา",
                text: "contact",
              },
            },
          ],
        },
      },
    ],
  });
}

// ===== DEMO FLEX MESSAGES =====

// เมนูอาหาร - Carousel แสดงรายการอาหาร
export async function replyMenuFlex(replyToken) {
  return lineRequest("/message/reply", {
    replyToken,
    messages: [
      {
        type: "flex",
        altText: "🍔 เมนูอาหาร",
        contents: {
          type: "carousel",
          contents: [
            // === Bubble 1: Burger ===
            {
              type: "bubble",
              size: "micro",
              hero: {
                type: "image",
                url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
                size: "full",
                aspectRatio: "4:3",
                aspectMode: "cover",
              },
              body: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: "🍔 Cheese Burger",
                    weight: "bold",
                    size: "md",
                    wrap: true,
                  },
                  {
                    type: "text",
                    text: "เบอร์เกอร์เนื้อชีสเยิ้มๆ",
                    size: "xs",
                    color: "#8c8c8c",
                    wrap: true,
                  },
                  {
                    type: "text",
                    text: "฿159",
                    weight: "bold",
                    size: "lg",
                    color: "#e74c3c",
                  },
                ],
              },
              footer: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "button",
                    action: {
                      type: "message",
                      label: "สั่งเลย",
                      text: "สั่ง Cheese Burger",
                    },
                    style: "primary",
                    color: "#e74c3c",
                    height: "sm",
                  },
                ],
              },
            },
            // === Bubble 2: Pizza ===
            {
              type: "bubble",
              size: "micro",
              hero: {
                type: "image",
                url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
                size: "full",
                aspectRatio: "4:3",
                aspectMode: "cover",
              },
              body: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: "🍕 Pepperoni Pizza",
                    weight: "bold",
                    size: "md",
                    wrap: true,
                  },
                  {
                    type: "text",
                    text: "พิซซ่าเปปเปอโรนีสูตรเด็ด",
                    size: "xs",
                    color: "#8c8c8c",
                    wrap: true,
                  },
                  {
                    type: "text",
                    text: "฿249",
                    weight: "bold",
                    size: "lg",
                    color: "#e74c3c",
                  },
                ],
              },
              footer: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "button",
                    action: {
                      type: "message",
                      label: "สั่งเลย",
                      text: "สั่ง Pepperoni Pizza",
                    },
                    style: "primary",
                    color: "#e74c3c",
                    height: "sm",
                  },
                ],
              },
            },
            // === Bubble 3: Pasta ===
            {
              type: "bubble",
              size: "micro",
              hero: {
                type: "image",
                url: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400",
                size: "full",
                aspectRatio: "4:3",
                aspectMode: "cover",
              },
              body: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: "🍝 Carbonara",
                    weight: "bold",
                    size: "md",
                    wrap: true,
                  },
                  {
                    type: "text",
                    text: "พาสต้าคาโบนาร่าครีมข้น",
                    size: "xs",
                    color: "#8c8c8c",
                    wrap: true,
                  },
                  {
                    type: "text",
                    text: "฿189",
                    weight: "bold",
                    size: "lg",
                    color: "#e74c3c",
                  },
                ],
              },
              footer: {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "button",
                    action: {
                      type: "message",
                      label: "สั่งเลย",
                      text: "สั่ง Carbonara",
                    },
                    style: "primary",
                    color: "#e74c3c",
                    height: "sm",
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  });
}

// โปรโมชั่น - แสดงดีลพิเศษ
export async function replyPromotionFlex(replyToken) {
  return lineRequest("/message/reply", {
    replyToken,
    messages: [
      {
        type: "flex",
        altText: "🎉 โปรโมชั่นพิเศษ",
        contents: {
          type: "bubble",
          styles: {
            header: { backgroundColor: "#e74c3c" },
            body: { backgroundColor: "#fdf2f2" },
          },
          header: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "🎉 SPECIAL DEAL!",
                color: "#ffffff",
                weight: "bold",
                size: "xl",
                align: "center",
              },
            ],
          },
          hero: {
            type: "image",
            url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
            size: "full",
            aspectRatio: "16:9",
            aspectMode: "cover",
          },
          body: {
            type: "box",
            layout: "vertical",
            spacing: "md",
            contents: [
              {
                type: "text",
                text: "ซื้อ 1 แถม 1 🔥",
                weight: "bold",
                size: "xxl",
                align: "center",
                color: "#e74c3c",
              },
              {
                type: "text",
                text: "สั่งเบอร์เกอร์หรือพิซซ่า รับฟรีอีก 1 ชิ้น!",
                size: "sm",
                align: "center",
                wrap: true,
                color: "#666666",
              },
              {
                type: "separator",
                margin: "lg",
              },
              {
                type: "box",
                layout: "horizontal",
                margin: "lg",
                contents: [
                  {
                    type: "text",
                    text: "📅 หมดเขต:",
                    size: "sm",
                    color: "#888888",
                    flex: 1,
                  },
                  {
                    type: "text",
                    text: "31 ม.ค. 2026",
                    size: "sm",
                    weight: "bold",
                    color: "#e74c3c",
                    flex: 2,
                  },
                ],
              },
              {
                type: "text",
                text: "🎫 ใช้โค้ด: LINEDEMO",
                size: "md",
                weight: "bold",
                align: "center",
                margin: "lg",
                color: "#2ecc71",
              },
            ],
          },
          footer: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "button",
                action: {
                  type: "message",
                  label: "รับสิทธิ์เลย!",
                  text: "ใช้โค้ด LINEDEMO",
                },
                style: "primary",
                color: "#e74c3c",
              },
            ],
          },
        },
      },
    ],
  });
}

// ติดต่อเรา - ข้อมูลร้าน
export async function replyContactFlex(replyToken) {
  return lineRequest("/message/reply", {
    replyToken,
    messages: [
      {
        type: "flex",
        altText: "📞 ติดต่อเรา",
        contents: {
          type: "bubble",
          styles: {
            header: { backgroundColor: "#3498db" },
          },
          header: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "📍 ข้อมูลร้าน",
                color: "#ffffff",
                weight: "bold",
                size: "lg",
              },
            ],
          },
          body: {
            type: "box",
            layout: "vertical",
            spacing: "lg",
            contents: [
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "🏠", size: "lg", flex: 0 },
                  {
                    type: "text",
                    text: "123 ถ.สุขุมวิท กรุงเทพฯ 10110",
                    size: "sm",
                    wrap: true,
                    margin: "md",
                    flex: 5,
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "📞", size: "lg", flex: 0 },
                  {
                    type: "text",
                    text: "02-123-4567",
                    size: "sm",
                    margin: "md",
                    flex: 5,
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "⏰", size: "lg", flex: 0 },
                  {
                    type: "text",
                    text: "เปิดทุกวัน 10:00 - 22:00",
                    size: "sm",
                    margin: "md",
                    flex: 5,
                  },
                ],
              },
              {
                type: "separator",
                margin: "lg",
              },
              {
                type: "text",
                text: "ติดตามเราได้ที่",
                size: "sm",
                color: "#888888",
                margin: "lg",
              },
              {
                type: "box",
                layout: "horizontal",
                spacing: "md",
                contents: [
                  {
                    type: "button",
                    action: {
                      type: "uri",
                      label: "Facebook",
                      uri: "https://facebook.com",
                    },
                    style: "secondary",
                    height: "sm",
                  },
                  {
                    type: "button",
                    action: {
                      type: "uri",
                      label: "Instagram",
                      uri: "https://instagram.com",
                    },
                    style: "secondary",
                    height: "sm",
                  },
                ],
              },
            ],
          },
          footer: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "button",
                action: {
                  type: "uri",
                  label: "🗺️ ดูแผนที่",
                  uri: "https://maps.google.com",
                },
                style: "primary",
                color: "#3498db",
              },
            ],
          },
        },
      },
    ],
  });
}

export async function pushText(to, text) {
  return lineRequest("/message/push", {
    to,
    messages: [{ type: "text", text }],
  });
}

export async function multicastText(to, text) {
  return lineRequest("/message/multicast", {
    to,
    messages: [{ type: "text", text }],
  });
}
