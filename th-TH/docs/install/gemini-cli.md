# วิธีติดตั้ง Lagune บน Gemini CLI แบบส่วนขยาย

> ติดตั้ง Lagune บน Gemini CLI แบบส่วนขยาย อัปเดตให้เป็นเวอร์ชันล่าสุดเสมอ และอนุญาตเอนจินไว้ล่วงหน้า

Canonical: https://lagune.ai/th-TH/docs/install/gemini-cli
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs/install/gemini-cli
อัปเดตล่าสุด: 2026-11-07

ติดตั้งส่วนขยายจากเทอร์มินัลของคุณ:

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

## การอัปเดต

หากต้องการอัปเดต **Lagune** ให้รัน:

```bash
gemini extensions update lagune
```

หากต้องการให้อัปเดตเป็นเวอร์ชันล่าสุดเสมอ ให้ติดตั้งพร้อม `--auto-update`

## คำสั่ง

พิมพ์คำสั่งโดยมีชื่อส่วนขยายนำหน้า เช่น `/lagune:lagune-charter` สำหรับ `/lagune-charter`

---

**สิทธิ์**

เอนจินทำงานผ่าน tool 2 ตัว: `lagune_read` อ่านโปรเจกต์ของคุณเท่านั้น และ `lagune_write` เขียนลงใน `.lagune/` เท่านั้น **Gemini CLI** จะเริ่ม tool ทั้งสองเฉพาะในโฟลเดอร์ที่เชื่อถือได้ หากต้องการอนุญาตไว้ล่วงหน้า ให้บันทึกกฎนี้เป็นไฟล์ `~/.gemini/policies/lagune.toml`:

```toml
[[rule]]
mcpName = "lagune"
toolName = ["lagune_read", "lagune_write"]
decision = "allow"
priority = 100
```

เมื่อเอนจินทำงานผ่าน **npx** เช่นเมื่อติดตั้งด้วย **skills.sh** ให้เพิ่มกฎนี้ลงในไฟล์เดียวกัน:

```toml
[[rule]]
toolName = "run_shell_command"
commandRegex = 'npx --yes lagune@\d+\.\d+\.\d+\s'
decision = "allow"
priority = 100
```

## คำถามที่พบบ่อย

### ติดตั้ง Lagune บน Gemini CLI ได้อย่างไร

รัน gemini extensions install https://github.com/wellwelwel/lagune

### อัปเดต Lagune บน Gemini CLI ได้อย่างไร

รัน gemini extensions update lagune หรือติดตั้งส่วนขยายพร้อม --auto-update

### รันคำสั่งของ Lagune บน Gemini CLI ได้อย่างไร

พิมพ์คำสั่งโดยมีชื่อส่วนขยายนำหน้า เช่น /lagune:lagune-charter

### Gemini CLI รัน Lagune โดยไม่ต้องขออนุญาตได้ไหม

ได้ เพิ่มกฎ policy ที่อนุญาต tool lagune_read และ lagune_write ของเซิร์ฟเวอร์ lagune รวมถึงกฎสำหรับ run_shell_command ที่มี npx --yes lagune@ ตามด้วยหมายเลขเวอร์ชัน เมื่อเอนจินทำงานผ่าน npx
