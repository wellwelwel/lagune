# วิธีติดตั้ง Lagune บน Factory Droid แบบปลั๊กอิน

> ติดตั้ง Lagune บน Factory Droid แบบปลั๊กอิน อัปเดตให้เป็นเวอร์ชันล่าสุดเสมอ และอนุญาต tool ของเอนจิน

Canonical: https://lagune.ai/th-TH/docs/install/factory-droid
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs/install/factory-droid
อัปเดตล่าสุด: 2026-11-07

ติดตั้งปลั๊กอินจากเทอร์มินัลของคุณ:

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

## การอัปเดต

หากต้องการอัปเดต **Lagune** ให้รัน:

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

## คำสั่ง

พิมพ์คำสั่งตามชื่อ เช่น `/lagune-charter`

## คำถามที่พบบ่อย

### ติดตั้ง Lagune บน Factory Droid ได้อย่างไร

รัน droid plugin marketplace add wellwelwel/lagune แล้วรัน droid plugin install lagune@lagune

### อัปเดต Lagune บน Factory Droid ได้อย่างไร

รัน droid plugin marketplace update lagune แล้วรัน droid plugin update lagune@lagune

### รันคำสั่งของ Lagune บน Factory Droid ได้อย่างไร

พิมพ์คำสั่งตามชื่อ เช่น /lagune-charter

### Factory Droid รัน Lagune โดยไม่ต้องขออนุญาตได้ไหม

ได้ เมื่อ Factory Droid ขออนุญาต ให้เลือกอนุญาต lagune_read และ lagune_write เสมอ แต่ Factory Droid จะขออนุญาตอีกครั้งหลังซิงก์ commit ใหม่ของ marketplace lagune
