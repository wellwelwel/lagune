# วิธีติดตั้ง Lagune ในเอเจนต์ใดก็ได้ด้วย skills.sh หรือ GitHub CLI

> ติดตั้ง Lagune ในเอเจนต์ AI ใดก็ได้ด้วย skills CLI หรือ GitHub CLI และอัปเดตให้เป็นเวอร์ชันล่าสุดเสมอ

Canonical: https://lagune.ai/th-TH/docs/install/universal
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs/install/universal
อัปเดตล่าสุด: 2026-11-09

**skills.sh**

ติดตั้งคำสั่งของ **Lagune** ในโปรเจกต์ของคุณจากเทอร์มินัลด้วย [**skills.sh**](https://www.skills.sh/wellwelwel/lagune):

```bash
npx skills add wellwelwel/lagune -y
```

หรือวาง prompt นี้ในเอเจนต์ของคุณ:

```md
รัน `npx --yes skills add wellwelwel/lagune --yes` แล้วเริ่มทำตามคำแนะนำของ skill ที่คำสั่งสร้างขึ้นทันที อ่านผลลัพธ์ให้ครบถ้วน หากจำเป็นให้ redirect ผลลัพธ์ไปยังไฟล์ชั่วคราวก่อน หา relative path โดยอิงจากไดเรกทอรีไฟล์ประกอบที่คำสั่งระบุไว้
```

**GitHub CLI**

ติดตั้งคำสั่งของ **Lagune** ในโปรเจกต์ของคุณจากเทอร์มินัลด้วย [**GitHub CLI**](https://cli.github.com/) เวอร์ชัน 2.90.0 ขึ้นไป:

```bash
gh skill install wellwelwel/lagune --all --scope project
```

หรือวาง prompt นี้ในเอเจนต์ของคุณ:

```md
รัน `gh skill install wellwelwel/lagune --all --scope project` แล้วอ่านผลลัพธ์ให้ครบถ้วน หากจำเป็นให้ redirect ผลลัพธ์ไปยังไฟล์ชั่วคราวก่อน
```

## การอัปเดต

**skills.sh**

หากต้องการอัปเดต **Lagune** ให้รัน:

```bash
npx skills update
```

หรือวาง prompt นี้ในเอเจนต์ของคุณ:

```md
รัน `npx --yes skills update -y` แล้วอ่านผลลัพธ์ให้ครบถ้วน หากจำเป็นให้ redirect ผลลัพธ์ไปยังไฟล์ชั่วคราวก่อน
```

**GitHub CLI**

หากต้องการอัปเดต **Lagune** ให้รัน:

```bash
gh skill update --all
```

หรือวาง prompt นี้ในเอเจนต์ของคุณ:

```md
รัน `gh skill update --all` แล้วอ่านผลลัพธ์ให้ครบถ้วน หากจำเป็นให้ redirect ผลลัพธ์ไปยังไฟล์ชั่วคราวก่อน
```

---

**Sandbox**

ใน sandbox ที่เข้าถึงเครือข่ายไม่ได้ คำสั่งต่าง ๆ จะดาวน์โหลดเอนจินไม่ได้ ให้ติดตั้งเอนจินในโปรเจกต์จากเทอร์มินัลของคุณเอง ครั้งแรกหนึ่งครั้งและทุกครั้งหลังอัปเดต:

```bash
npm i -D lagune@0.18.1
```

## คำถามที่พบบ่อย

### จะติดตั้ง Lagune ในเอเจนต์ AI ตัวไหนก็ได้ ต้องทำอย่างไร

รัน npx skills add wellwelwel/lagune -y หรือ gh skill install wellwelwel/lagune --all --scope project ในโปรเจกต์ของคุณ หรือวาง prompt สำหรับติดตั้งในเอเจนต์ของคุณ

### จะอัปเดต Lagune ในเอเจนต์ AI ตัวไหนก็ได้ ต้องทำอย่างไร

รัน npx skills update หากคุณติดตั้งด้วย skills.sh หรือรัน gh skill update --all หากคุณติดตั้งด้วย GitHub CLI นอกจากนี้คุณยังวาง prompt สำหรับอัปเดตในเอเจนต์ของคุณได้ด้วย

### ติดตั้ง Lagune มากกว่าหนึ่งช่องทางได้ไหม

ไม่ได้ หากติดตั้ง 2 ช่องทาง เอเจนต์จะแสดงทุกคำสั่งซ้ำ 2 ครั้ง หรือใช้ชุดหนึ่งและซ่อนอีกชุดไว้
