# วิธีติดตั้ง Lagune บน GitHub Copilot CLI แบบปลั๊กอิน

> ติดตั้ง Lagune บน GitHub Copilot CLI แบบปลั๊กอิน และอัปเดตให้เป็นเวอร์ชันล่าสุดเสมอ

Canonical: https://lagune.ai/th-TH/docs/install/github-copilot-cli
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs/install/github-copilot-cli
อัปเดตล่าสุด: 2026-11-07

ติดตั้งปลั๊กอินจากเทอร์มินัลของคุณ:

```bash
copilot plugin marketplace add wellwelwel/lagune
copilot plugin install lagune@lagune
```

ใน editor ให้ติดตั้ง **Lagune** สำหรับ **GitHub Copilot** ด้วย [**skills.sh**](https://lagune.ai/th-TH/docs/install/universal)

## การอัปเดต

หากต้องการอัปเดต **Lagune** ให้รัน:

```bash
copilot plugin marketplace update lagune
copilot plugin update lagune@lagune
```

## คำสั่ง

พิมพ์คำสั่งตามชื่อ เช่น `/lagune-charter`

## คำถามที่พบบ่อย

### ติดตั้ง Lagune บน GitHub Copilot CLI ได้อย่างไร

รัน copilot plugin marketplace add wellwelwel/lagune แล้วรัน copilot plugin install lagune@lagune

### อัปเดต Lagune บน GitHub Copilot CLI ได้อย่างไร

รัน copilot plugin marketplace update lagune แล้วรัน copilot plugin update lagune@lagune

### รันคำสั่งของ Lagune บน GitHub Copilot CLI ได้อย่างไร

พิมพ์คำสั่งตามชื่อ เช่น /lagune-charter

### ใช้ Lagune กับ GitHub Copilot ใน VS Code ได้ไหม

ได้ ใน VS Code หรือ editor อื่น ให้ติดตั้ง Lagune ด้วย skills.sh แทนการติดตั้งแบบปลั๊กอิน
