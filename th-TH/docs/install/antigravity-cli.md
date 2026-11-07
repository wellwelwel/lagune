# วิธีติดตั้ง Lagune บน Antigravity CLI แบบปลั๊กอิน

> ติดตั้ง Lagune บน Antigravity CLI แบบปลั๊กอิน อัปเดตให้เป็นเวอร์ชันล่าสุดเสมอ และอนุญาตเอนจินไว้ล่วงหน้า

Canonical: https://lagune.ai/th-TH/docs/install/antigravity-cli
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs/install/antigravity-cli
อัปเดตล่าสุด: 2026-11-07

ติดตั้งปลั๊กอินจากเทอร์มินัลของคุณ:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## การอัปเดต

หากต้องการอัปเดต **Lagune** ให้ติดตั้งอีกครั้ง:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## คำสั่ง

พิมพ์คำสั่งโดยมีชื่อปลั๊กอินนำหน้า เช่น `/lagune:lagune-charter` สำหรับ `/lagune-charter`

---

**สิทธิ์**

เอนจินทำงานผ่าน tool 2 ตัว: `lagune_read` อ่านโปรเจกต์ของคุณเท่านั้น และ `lagune_write` เขียนลงใน `.lagune/` เท่านั้น คำสั่งที่ส่งเป็นข้อความแรกของเซสชันจะรันก่อนที่ tool ทั้งสองจะโหลด จึงใช้ **npx** แทน หากต้องการอนุญาต tool ทั้งสองและ **npx** ไว้ล่วงหน้า ให้เพิ่มกฎเหล่านี้ลงใน `~/.gemini/antigravity-cli/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp(lagune_lagune/lagune_read)",
      "mcp(lagune_lagune/lagune_write)",
      "command(regex:npx --yes lagune@[0-9.]+)"
    ]
  }
}
```

## คำถามที่พบบ่อย

### ติดตั้ง Lagune บน Antigravity CLI ได้อย่างไร

รัน agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity

### อัปเดต Lagune บน Antigravity CLI ได้อย่างไร

รัน agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity อีกครั้ง

### รันคำสั่งของ Lagune บน Antigravity CLI ได้อย่างไร

พิมพ์คำสั่งโดยมีชื่อปลั๊กอินนำหน้า เช่น /lagune:lagune-charter

### Antigravity CLI รัน Lagune โดยไม่ต้องขออนุญาตได้ไหม

ได้ อนุญาต mcp(lagune_lagune/lagune_read), mcp(lagune_lagune/lagune_write) และ command(regex:npx --yes lagune@[0-9.]+) ในการตั้งค่าของ Antigravity CLI กฎ npx ครอบคลุมคำสั่งที่ส่งเป็นข้อความแรกของเซสชัน
