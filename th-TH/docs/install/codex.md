# วิธีติดตั้ง Lagune บน Codex CLI แบบปลั๊กอิน

> ติดตั้ง Lagune บน Codex CLI แบบปลั๊กอิน อัปเดตให้เป็นเวอร์ชันล่าสุดเสมอ และรันเอนจินภายใน sandbox

Canonical: https://lagune.ai/th-TH/docs/install/codex
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs/install/codex
อัปเดตล่าสุด: 2026-11-07

ติดตั้งปลั๊กอินจากเทอร์มินัลของคุณ:

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

## การอัปเดต

หากต้องการอัปเดต **Lagune** ให้รัน:

```bash
codex plugin marketplace upgrade lagune
```

## คำสั่ง

พิมพ์ `$` ตามด้วยคำสั่งที่มีชื่อปลั๊กอินนำหน้า แล้วต่อด้วยอินพุตของคุณ เช่น `$lagune:lagune-charter` สำหรับ `/lagune-charter` เมื่อพิมพ์ `$` รายการคำสั่งจะปรากฏขึ้น และเมื่อคุณเลือกคำสั่งใด ระบบจะแทรกชื่อเต็มของคำสั่งนั้นให้

---

**Sandbox**

Sandbox ของ **Codex** เข้าถึงเครือข่ายไม่ได้ ให้ติดตั้งเอนจินในโปรเจกต์จากเทอร์มินัลของคุณเอง ครั้งแรกหนึ่งครั้งและทุกครั้งหลังอัปเดต:

```bash
npm i -D lagune@0.18.2
```

## คำถามที่พบบ่อย

### ติดตั้ง Lagune บน Codex CLI ได้อย่างไร

รัน codex plugin marketplace add wellwelwel/lagune แล้วรัน codex plugin add lagune@lagune

### อัปเดต Lagune บน Codex CLI ได้อย่างไร

รัน codex plugin marketplace upgrade lagune

### รันคำสั่งของ Lagune บน Codex CLI ได้อย่างไร

พิมพ์ $ ตามด้วยคำสั่งที่มีชื่อปลั๊กอินนำหน้า แล้วต่อด้วยอินพุตของคุณ เช่น $lagune:lagune-charter

### Lagune ทำงานใน sandbox ของ Codex ได้ไหม

ได้ เมื่อคุณติดตั้งเอนจินในโปรเจกต์ด้วย npm i -D lagune@0.18.2 จากเทอร์มินัลของคุณเอง ครั้งแรกหนึ่งครั้งและทุกครั้งหลังอัปเดต
