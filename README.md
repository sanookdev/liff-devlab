# LINE Messaging API Backend (Node.js) — FULL (Webhook + Reply/Push/Multicast + Rich Menu API )

- Webhook (verify x-line-signature)
- Event routing: message / follow / unfollow / postback / beacon (ตัวอย่าง)
- Reply / Push / Multicast
- Rich Menu API : create / list / get / upload image / set default / link user / unlink user / delete
- Scripts สำหรับสั่งทำ Rich Menu แบบ CLI

---

## 1) เตรียมค่าใน LINE Developers
- Messaging API channel
- Copy: **Channel access token (long-lived)** และ **Channel secret**
- ใส่ใน `.env` (คัดลอกจาก `.env.example`)

## 2) ติดตั้ง/รัน
```bash
npm i
npm run dev
# เปิด webhook: POST http://localhost:3000/webhook
```

## 3) ทดสอบ API (Push)
> ต้องมี userId ก่อน (ได้จาก event follow/message)
```bash
curl -X POST http://localhost:3000/api/push \
  -H "Content-Type: application/json" \
  -d '{"to":"Uxxxxxxxx","text":"Hello push"}'
```

## 4) Rich Menu (แนะนำทำตามลำดับ)
### 4.1 Create
```bash
npm run richmenu:create
```
จะได้ richMenuId แสดงออกมา

### 4.2 Upload รูป (PNG หรือ JPEG)
ใส่ไฟล์รูปไว้ที่ `assets/richmenu.png` หรือระบุ env `RICHMENU_IMAGE_PATH`
```bash
npm run richmenu:upload -- <RICHMENU_ID>
```

### 4.3 Set Default
```bash
npm run richmenu:set-default -- <RICHMENU_ID>
```

### 4.4 Link ให้ user
```bash
npm run richmenu:link -- <RICHMENU_ID> <USER_ID>
```

### 4.5 Unlink
```bash
npm run richmenu:unlink -- <USER_ID>
```

### 4.6 Delete
```bash
npm run richmenu:delete -- <RICHMENU_ID>
```

> หมายเหตุ: ตัวอย่าง rich menu อยู่ที่ `richmenu/richmenu.sample.json`
