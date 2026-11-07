# วิธีติดตั้ง Lagune บน Pi แบบแพ็กเกจ

> ติดตั้ง Lagune บน Pi แบบแพ็กเกจ จาก npm หรือจาก GitHub และอัปเดตให้เป็นเวอร์ชันล่าสุดเสมอ

Canonical: https://lagune.ai/th-TH/docs/install/pi
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs/install/pi
อัปเดตล่าสุด: 2026-11-07

**npm**

ติดตั้งแพ็กเกจจากเทอร์มินัลของคุณ:

```bash
pi install npm:lagune
```

**GitHub**

ติดตั้ง commit ล่าสุดจาก **GitHub** ซึ่งรันเอนจินผ่าน **npx**:

```bash
pi install git:github.com/wellwelwel/lagune
```

## การอัปเดต

**npm**

หากต้องการอัปเดต **Lagune** ให้รัน:

```bash
pi update npm:lagune
```

**GitHub**

หากต้องการอัปเดต **Lagune** ให้รัน:

```bash
pi update git:github.com/wellwelwel/lagune
```

`pi update --extensions` อัปเดตทุกแพ็กเกจที่คุณติดตั้งไว้ ส่วน `pi update` เพียงอย่างเดียวจะอัปเดตแค่ **Pi**

## คำสั่ง

พิมพ์คำสั่งโดยมี `skill:` นำหน้า เช่น `/skill:lagune-charter` แทน `/lagune-charter`

## คำถามที่พบบ่อย

### ติดตั้ง Lagune บน Pi ได้อย่างไร

รัน pi install npm:lagune หรือรัน pi install git:github.com/wellwelwel/lagune เพื่อติดตั้ง commit ล่าสุดจาก GitHub

### อัปเดต Lagune บน Pi ได้อย่างไร

รัน pi update npm:lagune หรือรัน pi update git:github.com/wellwelwel/lagune หากติดตั้งจาก GitHub ส่วน pi update --extensions จะอัปเดตทุกแพ็กเกจที่คุณติดตั้งไว้

### รันคำสั่งของ Lagune บน Pi ได้อย่างไร

พิมพ์คำสั่งโดยมี skill: นำหน้า เช่น /skill:lagune-charter
