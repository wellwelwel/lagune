# วิธีติดตั้ง Lagune บน OpenCode แบบปลั๊กอิน

> ติดตั้ง Lagune บน OpenCode 1.x และ 2.x แบบปลั๊กอิน และอัปเดตให้เป็นเวอร์ชันล่าสุดเสมอ

Canonical: https://lagune.ai/th-TH/docs/install/opencode
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs/install/opencode
อัปเดตล่าสุด: 2026-11-07

**OpenCode 2.x**

ติดตั้งปลั๊กอินจากเทอร์มินัลของคุณ:

```bash
opencode plugin add lagune
```

หรือเพิ่มลงในรายการ `plugins` ของ `opencode.json`:

```json
{
  "plugins": ["lagune"]
}
```

**OpenCode 1.x**

ติดตั้งปลั๊กอินในโปรเจกต์ของคุณจากเทอร์มินัล หรือเพิ่ม `-g` เพื่อติดตั้งให้ทุกโปรเจกต์ของคุณ:

```bash
opencode plugin lagune
```

หรือเพิ่มลงในรายการ `plugin` ของ `opencode.json`:

```json
{
  "plugin": ["lagune"]
}
```

## การอัปเดต

**OpenCode 2.x**

หากต้องการอัปเดต **Lagune** ให้รัน:

```bash
opencode plugin update lagune
opencode reload
```

**OpenCode 1.x**

หากต้องการอัปเดต **Lagune** ให้ติดตั้งรีลีสใหม่ทับรีลีสเดิม โดยเพิ่ม `-g` หากคุณติดตั้งไว้ให้ทุกโปรเจกต์:

```bash
opencode plugin lagune@0.18.1 --force
```

## คำสั่ง

**OpenCode 2.x**

พิมพ์ `@` แล้วเลือกคำสั่ง เช่น `@lagune-charter` จากนั้นพิมพ์อินพุตของคุณในข้อความเดียวกัน

**OpenCode 1.x**

พิมพ์คำสั่งตามชื่อ เช่น `/lagune-charter` คำสั่งเหล่านี้แสดงอยู่ใน `/skills` ไม่ได้อยู่ในเมนู `/`

## คำถามที่พบบ่อย

### ติดตั้ง Lagune บน OpenCode ได้อย่างไร

ใน OpenCode 2.x ให้รัน opencode plugin add lagune ส่วนใน OpenCode 1.x ให้รัน opencode plugin lagune โดยเพิ่ม -g เพื่อติดตั้งให้ทุกโปรเจกต์ของคุณ

### อัปเดต Lagune บน OpenCode ได้อย่างไร

ใน OpenCode 2.x ให้รัน opencode plugin update lagune แล้วรัน opencode reload ส่วนใน OpenCode 1.x ให้รัน opencode plugin lagune@0.18.1 --force

### รันคำสั่งของ Lagune บน OpenCode ได้อย่างไร

ใน OpenCode 2.x ให้พิมพ์ @ แล้วเลือกคำสั่ง เช่น @lagune-charter จากนั้นพิมพ์อินพุตของคุณในข้อความเดียวกัน ส่วนใน OpenCode 1.x ให้พิมพ์คำสั่งตามชื่อ เช่น /lagune-charter หรือหาคำสั่งได้ใน /skills

### OpenCode ขออนุญาตก่อนรัน Lagune ไหม

ไม่ขอ OpenCode รัน tool 2 ตัวของเอนจิน คือ lagune_read และ lagune_write โดยไม่ถาม
