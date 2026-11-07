# วิธีติดตั้ง Lagune บน Hermes Agent แบบปลั๊กอิน

> ติดตั้ง Lagune บน Hermes Agent แบบปลั๊กอิน และอัปเดตให้เป็นเวอร์ชันล่าสุดเสมอ

Canonical: https://lagune.ai/th-TH/docs/install/hermes-agent
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs/install/hermes-agent
อัปเดตล่าสุด: 2026-11-07

ติดตั้งปลั๊กอินจากเทอร์มินัลของคุณ:

```bash
hermes plugins install wellwelwel/lagune --enable
```

- เมื่อ **Hermes Agent** ขอให้คุณยืนยันปลั๊กอินที่มาจากนอกแคตตาล็อกของตัวเอง ให้ **ยืนยัน**
- เมื่อเอเจนต์เสนอให้ติดตั้ง dependency ของ **Node.js** ในรีโพสิทอรี ให้ **ปฏิเสธ**

## การอัปเดต

หากต้องการอัปเดต **Lagune** ให้รัน:

```bash
hermes plugins update lagune
```

## คำสั่ง

พิมพ์คำสั่งโดยมีชื่อปลั๊กอินนำหน้า เช่น `/lagune:lagune-charter` แทน `/lagune-charter` และ `/lagune:lagune` แทน `/lagune`

## คำถามที่พบบ่อย

### ติดตั้ง Lagune บน Hermes Agent ได้อย่างไร

รัน hermes plugins install wellwelwel/lagune --enable จากนั้นยืนยันปลั๊กอินเมื่อระบบถาม และปฏิเสธการติดตั้ง dependency ของ Node.js ในรีโพสิทอรี

### อัปเดต Lagune บน Hermes Agent ได้อย่างไร

รัน hermes plugins update lagune

### รันคำสั่งของ Lagune บน Hermes Agent ได้อย่างไร

พิมพ์คำสั่งโดยมีชื่อปลั๊กอินนำหน้า เช่น /lagune:lagune-charter และ /lagune:lagune
