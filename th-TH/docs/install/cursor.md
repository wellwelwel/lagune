# วิธีติดตั้ง Lagune บน Cursor แบบปลั๊กอิน

> ติดตั้ง Lagune บน Cursor และ Cursor CLI แบบปลั๊กอิน อัปเดตให้เป็นเวอร์ชันล่าสุดเสมอ และอนุญาตเอนจินไว้ล่วงหน้า

Canonical: https://lagune.ai/th-TH/docs/install/cursor
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs/install/cursor
อัปเดตล่าสุด: 2026-11-07

**Cursor**

- เปิด **Customize**
- เลือก **From GitHub Repository** แล้วป้อน `https://github.com/wellwelwel/lagune`
- เลือก **Install** ที่ **Lagune** แล้วเลือกขอบเขตระดับโปรเจกต์หรือระดับผู้ใช้

**Cursor CLI**

- เพิ่ม marketplace จากเทอร์มินัลของคุณ:

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- พิมพ์ `/plugins` ในเซสชัน `agent`
- ติดตั้ง **Lagune**

หากติดตั้ง **Lagune** ไว้ใน **Claude Code** อยู่แล้ว **Cursor CLI** จะโหลดจากที่นั่น

## การอัปเดต

**Cursor**

- เปิด **Customize**
- เลือก **Refresh** ที่ marketplace `lagune`

**Cursor CLI**

- แทนที่ marketplace จากเทอร์มินัลของคุณ:

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- พิมพ์ `/plugins` ในเซสชัน `agent`
- ติดตั้ง **Lagune** อีกครั้ง

## คำสั่ง

พิมพ์คำสั่งตามชื่อ เช่น `/lagune-charter`

---

**สิทธิ์**

ใน **Cursor** คำสั่งต่าง ๆ จะรันเอนจินผ่าน **npx** ซึ่งโหมด Auto-review ที่เป็นค่าเริ่มต้นอนุญาตโดยไม่ถาม

ใน **Cursor CLI** เอนจินทำงานผ่าน tool 2 ตัว: `lagune_read` อ่านโปรเจกต์ของคุณเท่านั้น และ `lagune_write` เขียนลงใน `.lagune/` เท่านั้น หากต้องการอนุญาตไว้ล่วงหน้า ให้เพิ่มกฎเหล่านี้ลงใน `.cursor/cli.json` สำหรับโปรเจกต์เดียว หรือใน `~/.cursor/cli-config.json` สำหรับทุกโปรเจกต์:

```json
{
  "permissions": {
    "allow": [
      "Mcp(plugin-lagune-lagune:lagune_read)",
      "Mcp(plugin-lagune-lagune:lagune_write)"
    ]
  }
}
```

เมื่อเอนจินทำงานผ่าน **npx** เช่นเมื่อติดตั้งด้วย **skills.sh** ให้อนุญาต `Shell(npx:--yes lagune@*)`

## คำถามที่พบบ่อย

### ติดตั้ง Lagune บน Cursor ได้อย่างไร

ใน Cursor ให้เปิด Customize เลือก From GitHub Repository ป้อน https://github.com/wellwelwel/lagune แล้วติดตั้ง Lagune ส่วนใน Cursor CLI ให้รัน agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor แล้วติดตั้ง Lagune จาก /plugins

### อัปเดต Lagune บน Cursor ได้อย่างไร

ใน Cursor ให้เลือก Refresh ที่ marketplace lagune ใน Customize ส่วนใน Cursor CLI ให้ลบ marketplace lagune แล้วเพิ่มกลับเข้าไปใหม่ จากนั้นติดตั้ง Lagune อีกครั้งจาก /plugins

### รันคำสั่งของ Lagune บน Cursor ได้อย่างไร

พิมพ์คำสั่งตามชื่อ เช่น /lagune-charter

### Cursor รัน Lagune โดยไม่ต้องขออนุญาตได้ไหม

ได้ โหมด Auto-review ที่เป็นค่าเริ่มต้นของ Cursor อนุญาตไว้อยู่แล้ว ส่วนใน Cursor CLI ให้อนุญาต Mcp(plugin-lagune-lagune:lagune_read) และ Mcp(plugin-lagune-lagune:lagune_write) รวมถึง Shell(npx:--yes lagune@*) เมื่อเอนจินทำงานผ่าน npx
