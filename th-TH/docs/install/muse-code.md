# วิธีติดตั้ง Lagune บน Muse Code แบบปลั๊กอิน

> ติดตั้ง Lagune บน Muse Code แบบปลั๊กอิน อัปเดตให้เป็นเวอร์ชันล่าสุดเสมอ และรันเอนจินภายใน sandbox

Canonical: https://lagune.ai/th-TH/docs/install/muse-code
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs/install/muse-code
อัปเดตล่าสุด: 2026-11-07

ติดตั้งปลั๊กอินจากเทอร์มินัลของคุณ:

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

## การอัปเดต

หากต้องการอัปเดต **Lagune** ให้รีเฟรช marketplace แล้วติดตั้งปลั๊กอินใหม่:

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

## คำสั่ง

พิมพ์คำสั่งตามชื่อ เช่น `/lagune-charter` หรือพิมพ์โดยมีชื่อปลั๊กอินนำหน้า เช่น `/lagune:lagune-charter`

---

**Sandbox**

sandbox ของ **Muse Code** ดาวน์โหลดเอนจินไม่ได้ ให้ติดตั้งเอนจินในโปรเจกต์จากเทอร์มินัลของคุณเองหนึ่งครั้ง และติดตั้งอีกครั้งหลังการอัปเดตทุกครั้ง:

```bash
npm i -D lagune@0.18.1
```

## คำถามที่พบบ่อย

### ติดตั้ง Lagune บน Muse Code ได้อย่างไร

รัน muse plugins marketplace add lagune wellwelwel/lagune แล้วรัน muse plugins install lagune@lagune

### อัปเดต Lagune บน Muse Code ได้อย่างไร

รัน muse plugins marketplace update lagune แล้วติดตั้งใหม่ด้วย muse plugins remove lagune และ muse plugins install lagune@lagune

### รันคำสั่งของ Lagune บน Muse Code ได้อย่างไร

พิมพ์คำสั่งตามชื่อ เช่น /lagune-charter หรือพิมพ์โดยมีชื่อปลั๊กอินนำหน้า เช่น /lagune:lagune-charter

### Lagune ใช้งานใน sandbox ของ Muse Code ได้ไหม

ได้ เมื่อคุณติดตั้งเอนจินในโปรเจกต์ด้วย npm i -D lagune@0.18.1 จากเทอร์มินัลของคุณเองหนึ่งครั้ง และติดตั้งอีกครั้งหลังการอัปเดตทุกครั้ง
