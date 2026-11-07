# วิธีติดตั้ง Lagune บน Devin CLI แบบปลั๊กอิน

> ติดตั้ง Lagune บน Devin CLI แบบปลั๊กอิน และอัปเดตให้เป็นเวอร์ชันล่าสุดเสมอ

Canonical: https://lagune.ai/th-TH/docs/install/devin-cli
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs/install/devin-cli
อัปเดตล่าสุด: 2026-11-07

ลงชื่อเข้าใช้ **Devin** แล้วติดตั้งปลั๊กอินจากเทอร์มินัลของคุณ:

```bash
devin auth login
devin plugins install wellwelwel/lagune
```

## การอัปเดต

หากต้องการอัปเดต **Lagune** ให้รัน:

```bash
devin plugins update lagune
```

## คำสั่ง

พิมพ์คำสั่งโดยมีชื่อปลั๊กอินนำหน้า เช่น `/lagune:lagune-charter` แทน `/lagune-charter` และเมนู `/` ก็แสดงรายการคำสั่งเหล่านี้ด้วย

## คำถามที่พบบ่อย

### ติดตั้ง Lagune บน Devin CLI ได้อย่างไร

ลงชื่อเข้าใช้ด้วย devin auth login แล้วรัน devin plugins install wellwelwel/lagune

### อัปเดต Lagune บน Devin CLI ได้อย่างไร

รัน devin plugins update lagune

### รันคำสั่งของ Lagune บน Devin CLI ได้อย่างไร

พิมพ์คำสั่งโดยมีชื่อปลั๊กอินนำหน้า เช่น /lagune:lagune-charter และเมนู / ก็แสดงรายการคำสั่งเหล่านี้ด้วย
