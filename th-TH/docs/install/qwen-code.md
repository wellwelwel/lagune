# วิธีติดตั้ง Lagune บน Qwen Code แบบส่วนขยาย

> ติดตั้ง Lagune บน Qwen Code แบบส่วนขยาย อัปเดตให้เป็นเวอร์ชันล่าสุดเสมอ และอนุญาตเอนจินไว้ล่วงหน้า

Canonical: https://lagune.ai/th-TH/docs/install/qwen-code
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs/install/qwen-code
อัปเดตล่าสุด: 2026-11-07

ติดตั้งส่วนขยายจากเทอร์มินัลของคุณ:

```bash
qwen extensions install lagune
```

## การอัปเดต

หากต้องการอัปเดต **Lagune** ให้รัน:

```bash
qwen extensions update lagune
```

หากต้องการให้เป็นเวอร์ชันล่าสุดอยู่เสมอ ให้ติดตั้งด้วย `--auto-update`

## คำสั่ง

พิมพ์คำสั่งโดยมีชื่อส่วนขยายนำหน้า เช่น `/lagune:lagune-charter` แทน `/lagune-charter`

---

**สิทธิ์**

เอนจินทำงานผ่าน tool 2 ตัว: `lagune_read` อ่านโปรเจกต์ของคุณเท่านั้น และ `lagune_write` เขียนลงใน `.lagune/` เท่านั้น หากต้องการอนุญาต tool ทั้งสองไว้ล่วงหน้า ให้เพิ่มกฎเหล่านี้ลงใน `.qwen/settings.json` สำหรับโปรเจกต์เดียว หรือใน `~/.qwen/settings.json` สำหรับทุกโปรเจกต์:

```json
{
  "permissions": {
    "allow": ["mcp__lagune__lagune_read", "mcp__lagune__lagune_write"]
  }
}
```

เมื่อเอนจินทำงานผ่าน **npx** เช่นเมื่อติดตั้งด้วย **skills.sh** ให้อนุญาต `Shell(npx --yes lagune@*)`

## คำถามที่พบบ่อย

### ติดตั้ง Lagune บน Qwen Code ได้อย่างไร

รัน qwen extensions install lagune

### อัปเดต Lagune บน Qwen Code ได้อย่างไร

รัน qwen extensions update lagune หรือติดตั้งส่วนขยายด้วย --auto-update

### รันคำสั่งของ Lagune บน Qwen Code ได้อย่างไร

พิมพ์คำสั่งโดยมีชื่อส่วนขยายนำหน้า เช่น /lagune:lagune-charter

### Qwen Code รัน Lagune โดยไม่ต้องขออนุญาตได้ไหม

ได้ อนุญาต mcp__lagune__lagune_read และ mcp__lagune__lagune_write ในการตั้งค่าของ Qwen Code และอนุญาต Shell(npx --yes lagune@*) ด้วยเมื่อเอนจินทำงานผ่าน npx
