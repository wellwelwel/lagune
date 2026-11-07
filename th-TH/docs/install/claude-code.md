# วิธีติดตั้ง Lagune บน Claude Code แบบปลั๊กอิน

> ติดตั้ง Lagune บน Claude Code แบบปลั๊กอิน ทั้งในเทอร์มินัล ส่วนขยาย และแอปเดสก์ท็อป อัปเดตให้เป็นเวอร์ชันล่าสุดเสมอ และอนุญาตเอนจินไว้ล่วงหน้า

Canonical: https://lagune.ai/th-TH/docs/install/claude-code
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs/install/claude-code
อัปเดตล่าสุด: 2026-11-07

**เทอร์มินัล**

ติดตั้งปลั๊กอินจากเทอร์มินัลของคุณ:

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

หรือติดตั้งจากเซสชัน **Claude Code**:

```text
/plugin marketplace add wellwelwel/lagune
/plugin install lagune@lagune
```

**ส่วนขยาย**

- พิมพ์ `/plugin` แล้วเลือก **Manage plugins**
- เพิ่ม `wellwelwel/lagune` ในแท็บ **Marketplaces**
- ติดตั้ง `lagune` ในแท็บ **Plugins**

**เดสก์ท็อป**

- ติดตั้ง **Lagune** จากเทอร์มินัลหรือส่วนขยาย โดยเลือก **Install for you** เมื่อติดตั้งในส่วนขยาย
- เริ่มเซสชันใหม่ในแอปเดสก์ท็อป แอปจะโหลดปลั๊กอินที่คุณติดตั้งไว้สำหรับตัวคุณเอง

## การอัปเดต

**เทอร์มินัล**

หากต้องการอัปเดต **Lagune** ให้รัน:

```bash
claude plugin marketplace update lagune
claude plugin update lagune@lagune
```

หากต้องการให้อัปเดตเป็นเวอร์ชันล่าสุดเสมอ ให้เลือก **Enable auto-update** สำหรับ marketplace `lagune` ใน `/plugin`

**ส่วนขยาย**

- พิมพ์ `/plugin` แล้วเลือก **Manage plugins**
- เปิดแท็บ **Marketplaces**
- เลือกไอคอนรีเฟรชที่ `lagune`

**เดสก์ท็อป**

- อัปเดต **Lagune** จากเทอร์มินัลหรือส่วนขยาย
- เริ่มเซสชันใหม่ในแอปเดสก์ท็อป

## คำสั่ง

พิมพ์คำสั่งตามชื่อ เช่น `/lagune-charter` หรือพิมพ์โดยมีชื่อปลั๊กอินนำหน้า เช่น `/lagune:lagune-charter`

---

**สิทธิ์**

เอนจินทำงานผ่าน tool 2 ตัว: `lagune_read` อ่านโปรเจกต์ของคุณเท่านั้น และ `lagune_write` เขียนลงใน `.lagune/` เท่านั้น หากต้องการอนุญาตไว้ล่วงหน้า ให้เพิ่มกฎเหล่านี้ลงใน `.claude/settings.json` สำหรับโปรเจกต์เดียว หรือใน `~/.claude/settings.json` สำหรับทุกโปรเจกต์:

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_lagune_lagune__lagune_read",
      "mcp__plugin_lagune_lagune__lagune_write"
    ]
  }
}
```

เมื่อเอนจินทำงานผ่าน **npx** เช่นเมื่อติดตั้งด้วย **skills.sh** ให้อนุญาต `Bash(npx --yes lagune@*)` หากเปิด sandbox ไว้ ให้เพิ่ม `registry.npmjs.org` ลงใน `sandbox.network.allowedDomains` ด้วย

## คำถามที่พบบ่อย

### ติดตั้ง Lagune บน Claude Code ได้อย่างไร

รัน claude plugin install lagune --marketplace wellwelwel/lagune หากใช้เซสชันหรือส่วนขยาย ให้เพิ่ม marketplace wellwelwel/lagune จากตัวจัดการปลั๊กอินแล้วติดตั้ง lagune แอปเดสก์ท็อปจะโหลดปลั๊กอินเมื่อคุณติดตั้งไว้สำหรับตัวคุณเองในเทอร์มินัลหรือส่วนขยาย

### อัปเดต Lagune บน Claude Code ได้อย่างไร

รัน claude plugin marketplace update lagune แล้วรัน claude plugin update lagune@lagune หรือเลือก Enable auto-update สำหรับ marketplace lagune ใน /plugin หากใช้ส่วนขยาย ให้เปิด Manage plugins จาก /plugin แล้วเลือกไอคอนรีเฟรชที่ marketplace lagune แอปเดสก์ท็อปจะโหลดเวอร์ชันที่อัปเดตในเซสชันถัดไป

### รันคำสั่งของ Lagune บน Claude Code ได้อย่างไร

พิมพ์คำสั่งตามชื่อ เช่น /lagune-charter หรือพิมพ์โดยมีชื่อปลั๊กอินนำหน้า เช่น /lagune:lagune-charter

### Claude Code รัน Lagune โดยไม่ต้องขออนุญาตได้ไหม

ได้ อนุญาต mcp__plugin_lagune_lagune__lagune_read และ mcp__plugin_lagune_lagune__lagune_write ในการตั้งค่าของ Claude Code รวมถึง Bash(npx --yes lagune@*) เมื่อเอนจินทำงานผ่าน npx
