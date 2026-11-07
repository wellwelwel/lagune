# Hook cors: ตรวจสอบ origin ของ CORS

> สแกนซอร์สโค้ดหารายการ origin ที่อนุญาตของ CORS ที่ถูกเลี่ยงได้ หรือประเมินว่าค่า origin หนึ่งค่าเปิดสิทธิ์กว้างเกินไปหรือไม่ ได้จากบรรทัดคำสั่ง

Canonical: https://lagune.ai/th-TH/docs/hooks/cors
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs/hooks/cors
อัปเดตล่าสุด: 2026-11-07

hook `cors` คือเอนจินแบบ deterministic เบื้องหลัง [ความรู้เฉพาะทาง `http-request`](https://lagune.ai/th-TH/docs/catalog) และคุณรันเองได้ hook นี้ทำงานได้สองโหมดจากคำสั่งเดียว: โหมด **scan** ที่สแกนซอร์สโค้ดหา **รายการ origin ที่อนุญาตซึ่งถูกเลี่ยงได้** (regex ตรวจโฮสต์ที่โฮสต์ของผู้โจมตีเล็ดลอดผ่านไปได้) และโหมด **score** ที่ประเมินค่า **CORS origin** หนึ่งค่าว่าเป็น `wildcard`, `null` หรือ `safe`

## สแกนโค้ดเบส

หากไม่ใส่ flag hook จะสแกนทั้งโปรเจกต์

**ทั้งโปรเจกต์**

```bash
npx lagune read cors
```

**ไดเรกทอรีเดียว**

```bash
npx lagune read cors --dir src/server
```

**ไฟล์เดียว**

```bash
npx lagune read cors --file internal/auth/origin.go
```

hook จะแสดงรายการที่อนุญาตทุกรายการที่ถูกเลี่ยงได้ไว้ใต้หัวข้อเดียว โดยจัดกลุ่มตามไฟล์ validator ตรวจโฮสต์ที่มี `.+`/`.*` อยู่ในส่วน authority ก่อน suffix ของโฮสต์ที่เชื่อถือ (`^https?://.+\.trusted\.com`) จะปล่อยให้โฮสต์ของผู้โจมตีอย่าง `your-site.com.attacker.com` เล็ดลอดผ่านไปได้

```text
Origin-allowlist patterns with a greedy wildcard (bypassable, review):

internal/auth/origin.go
  ^https?://.+\.trusted\.com
```

รายการนี้เป็นเบาะแสให้ตรวจทาน ไม่ใช่ข้อตรวจพบที่ชี้ขาดแล้ว: จากข้อความเพียงอย่างเดียวตัดสินไม่ได้ว่า regex นั้นควบคุมการตัดสินใจเรื่องความน่าเชื่อถือจริงหรือไม่ การสแกนจึงไม่เปลี่ยน exit code อ่านแต่ละรายการและยืนยันว่ารายการที่อนุญาตเปรียบเทียบแบบตรงกันทั้งค่า เมื่อไม่พบอะไร hook จะพิมพ์ออกมาเพียงบรรทัดเดียว

```bash
npx lagune read cors --dir src/clean
# => no bypassable origin allowlist found
```

## ประเมิน origin

ส่ง origin แต่ละค่าด้วย `--origin` แล้ว hook จะพิมพ์คำหนึ่งคำต่อ origin หนึ่งค่า และจบการทำงานด้วย exit code ที่ไม่ใช่ศูนย์เมื่อพบ `wildcard` หรือ `null`

**origin เดียว**

```bash
npx lagune read cors --origin '*'                       # => wildcard
npx lagune read cors --origin 'null'                    # => null
npx lagune read cors --origin 'https://app.example.com' # => safe
```

**หลาย origin**

ใส่ `--origin` ซ้ำเพื่อประเมินรายการที่อนุญาตทั้งชุดในการเรียกครั้งเดียว โดยได้ผลตัดสินบรรทัดละหนึ่งรายการตามลำดับ

```bash
npx lagune read cors \
  --origin 'https://app.example.com' \
  --origin '*' \
  --origin 'null'
# => safe
# => wildcard
# => null
```

| ผลตัดสิน   | ความหมาย                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------- |
| `safe`     | ไม่ใช่ `*`, `null` หรือ glob แบบ `*` แต่ไม่ได้รับประกันว่า origin มีรูปแบบถูกต้อง            |
| `wildcard` | `*` หรือ glob แบบ subdomain/host/port: เว็บไซต์ใดก็ได้ (หรือกลุ่มที่กว้าง) อ่าน response ได้ |
| `null`     | origin `null` ซึ่ง iframe แบบ sandbox และการ redirect ปลอมขึ้นได้                            |

มีเพียง `safe` ที่หมายถึงอนุญาต และ `--origin` เป็นตัวตัดสินค่า (value oracle): ตัดสินที่ค่า ไม่ได้ตัดสินที่ handler ดังนั้นให้ยืนยัน handler ด้วยความรู้เฉพาะทาง `http-request`

### ตัวเลือก CLI

| ตัวเลือก   | ค่า       | คำอธิบาย                                                                      |
| ---------- | --------- | ----------------------------------------------------------------------------- |
| `--origin` | origin    | ประเมินค่า origin หนึ่งค่า ใส่ซ้ำเพื่อประเมินหลายค่า โดยได้ผลบรรทัดละหนึ่งค่า |
| `--dir`    | ไดเรกทอรี | จำกัดการสแกนไว้ที่ไดเรกทอรีเดียว ใช้ซ้ำได้และใช้ร่วมกับ `--file` ได้          |
| `--file`   | ไฟล์      | จำกัดการสแกนไว้ที่ไฟล์เดียว ใช้ซ้ำได้และใช้ร่วมกับ `--dir` ได้                |

หากไม่ระบุตัวเลือก hook จะสแกนทั้งโปรเจกต์ `--origin` คือโหมด score และใช้ร่วมกับ `--dir` หรือ `--file` ไม่ได้

### เลือกสิ่งที่จะสแกน

hook นี้ข้ามสิ่งที่ **Git** ละเว้นไว้ หากต้องการข้ามมากกว่านั้น หรือต้องการสแกนสิ่งที่ **Git** ละเว้นไว้ ให้กำหนดการตั้งค่าเฉพาะของ `cors` เอง:

```bash
npx lagune write add --ignore test/fixtures --checker cors
```

```json
{
  "checkers": {
    "cors": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

[กำหนดค่า hook](https://lagune.ai/th-TH/docs/hooks/configure) อธิบายการตั้งค่าทั้งหมด

**สิ่งที่ไม่ครอบคลุม**

การสแกนอ่านรูปแบบ **regex ที่ถูกเลี่ยงได้** และ `--origin` ประเมิน **ค่า** ของ origin ยังมีรูปแบบระดับซอร์สโค้ดสองแบบที่อยู่นอกการตรวจ: การสะท้อน `Origin` ของ request (เซิร์ฟเวอร์ส่ง `Origin` ที่เข้ามากลับไป หรือส่งคู่กับข้อมูลรับรอง) และรายการที่อนุญาตแบบ `endsWith`/substring ที่หละหลวม ให้มองหารูปแบบเหล่านี้ในโค้ด และจัดการตามที่ [ความรู้เฉพาะทาง `http-request`](https://lagune.ai/th-TH/docs/catalog) อธิบายไว้

## คำถามที่พบบ่อย

### ทำไม origin ของ CORS ที่เป็น null จึงอันตราย

iframe แบบ sandbox และการ redirect บางแบบส่ง Origin: null ออกไป รายการที่อนุญาตที่เชื่อถือ null จึงให้สิทธิ์อ่านแก่บริบทเหล่านั้น hook cors ชี้ว่าค่านี้เป็นปัญหาเช่นเดียวกับ wildcard

### ตรวจจับรายการ origin ที่อนุญาตของ CORS ที่ถูกเลี่ยงได้อย่างไร

รัน npx lagune read cors กับโค้ดเบส hook จะชี้ว่า regex ตรวจโฮสต์ที่มี wildcard แบบ greedy อยู่ก่อน suffix ที่เชื่อถือเป็นปัญหา เพราะโฮสต์ของผู้โจมตีอย่าง your-site.com.attacker.com จะเล็ดลอดผ่านไปได้
