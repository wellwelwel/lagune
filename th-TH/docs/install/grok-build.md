# วิธีติดตั้ง Lagune บน Grok Build แบบปลั๊กอิน

> ติดตั้ง Lagune บน Grok Build แบบปลั๊กอิน อัปเดตให้เป็นเวอร์ชันล่าสุดเสมอ และอนุญาตเอนจินไว้ล่วงหน้า

Canonical: https://lagune.ai/th-TH/docs/install/grok-build
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs/install/grok-build
อัปเดตล่าสุด: 2026-11-07

ติดตั้งปลั๊กอินจากเทอร์มินัลของคุณ:

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

## การอัปเดต

หากต้องการอัปเดต **Lagune** ให้รัน:

```bash
grok plugin update lagune
```

## คำสั่ง

พิมพ์คำสั่งตามชื่อ เช่น `/lagune-charter` หรือพิมพ์โดยมีชื่อปลั๊กอินนำหน้า เช่น `/lagune:lagune-charter`

---

**สิทธิ์**

เอนจินทำงานผ่าน tool 2 ตัว: `lagune_read` อ่านโปรเจกต์ของคุณเท่านั้น และ `lagune_write` เขียนลงใน `.lagune/` เท่านั้น หากต้องการอนุญาต tool ทั้งสองไว้ล่วงหน้า ให้เพิ่มกฎเหล่านี้ลงใน `~/.grok/config.toml`:

```toml
[permission]
allow = ["MCPTool(lagune__lagune_read)", "MCPTool(lagune__lagune_write)"]
```

เมื่อเอนจินทำงานผ่าน **npx** เช่นเมื่อติดตั้งด้วย **skills.sh** ให้อนุญาต `Bash(npx --yes lagune@*)`

## คำถามที่พบบ่อย

### ติดตั้ง Lagune บน Grok Build ได้อย่างไร

รัน grok plugin install wellwelwel/lagune@plugin-grok --trust

### อัปเดต Lagune บน Grok Build ได้อย่างไร

รัน grok plugin update lagune

### รันคำสั่งของ Lagune บน Grok Build ได้อย่างไร

พิมพ์คำสั่งตามชื่อ เช่น /lagune-charter หรือพิมพ์โดยมีชื่อปลั๊กอินนำหน้า เช่น /lagune:lagune-charter

### Grok Build รัน Lagune โดยไม่ต้องขออนุญาตได้ไหม

ได้ อนุญาต MCPTool(lagune__lagune_read) และ MCPTool(lagune__lagune_write) ในการตั้งค่าของ Grok Build และอนุญาต Bash(npx --yes lagune@*) ด้วยเมื่อเอนจินทำงานผ่าน npx
