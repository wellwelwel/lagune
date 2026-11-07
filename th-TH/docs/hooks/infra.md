# Hook infra: ตรวจหาการตั้งค่า IaC ที่ผิดพลาด

> สแกน Terraform, Dockerfile และ GitHub Actions หาการตั้งค่าที่ผิดพลาด หรือประเมินโค้ดตัวอย่างชิ้นเดียว ได้จากบรรทัดคำสั่ง

Canonical: https://lagune.ai/th-TH/docs/hooks/infra
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs/hooks/infra
อัปเดตล่าสุด: 2026-11-07

hook `infra` ชี้ว่าเป็นปัญหาเมื่อพบ **การตั้งค่า infrastructure-as-code ที่ผิดพลาด** ซึ่งตัดสินได้จากไฟล์เพียงอย่างเดียว: เครือข่ายที่เปิดสู่ทั้งโลก สิทธิ์แบบ wildcard secret ใน manifest คอนเทนเนอร์ที่รันด้วย root หรือค่าที่ไม่น่าเชื่อถือใน shell ของ CI hook นี้อ่านเฉพาะไฟล์ IaC (`.tf`/`.tf.json`/`.hcl`, `Dockerfile*`, `.github/workflows/**`) และเป็นเอนจินแบบ deterministic เบื้องหลัง [ความรู้เฉพาะทาง `infra`](https://lagune.ai/th-TH/docs/catalog) ในโหมด **scan** หรือ **check**

## การรัน

**สแกนโค้ดเบส**

```bash
npx lagune read infra                   # scans every IaC file
npx lagune read infra --dir infra       # scans a directory
npx lagune read infra --file Dockerfile # scans a single file
```

**ตรวจโค้ดตัวอย่าง**

ส่งโค้ดตัวอย่างด้วย `--pattern` และระบุชนิดของโค้ดด้วย `--kind` (`terraform`, `dockerfile` หรือ `github-actions`)

```bash
npx lagune read infra --kind terraform  --pattern 'actions = ["*"]' # => iam-wildcard
npx lagune read infra --kind dockerfile --pattern 'FROM node:20'    # => mutable-tag
```

การสแกนพิมพ์ผลออกมาได้สูงสุดสองส่วน **Infrastructure risks found** ทำให้จบการทำงานด้วย exit code ที่ไม่ใช่ศูนย์ และแสดงข้อบกพร่องที่ตัดสินได้ (ingress `0.0.0.0/0` บนพอร์ตที่อ่อนไหว statement ของ IAM แบบ wildcard secret ใน manifest `encrypted = false` โมดูล git ที่ไม่ได้ตรึงเวอร์ชัน image ที่ระบุให้รันด้วย root อย่างชัดเจน `curl | sh` การ inject สคริปต์ใน CI และ `permissions: write-all`) ส่วน **Infrastructure hardening advisories** ไม่เปลี่ยน exit code (base tag ที่เปลี่ยนแปลงได้ หรือ action ที่ตรึงด้วย tag) การรันที่ไม่พบปัญหาจะพิมพ์ `no infrastructure risks found`

## วิธีอ่านผลตัดสิน

โหมด check พิมพ์ tag ที่มีระดับความรุนแรงสูงสุดที่ตรงกัน (เช่น `public-ingress`, `iam-wildcard`, `root-user`, `curl-pipe`, `script-injection`, `write-all`) tag ระดับคำแนะนำ (`mutable-tag`, `unpinned-action`) หรือ `safe` มีเพียง tag ระดับข้อตรวจพบเท่านั้นที่ทำให้จบการทำงานด้วย exit code ที่ไม่ใช่ศูนย์

### ตัวเลือก CLI

| ตัวเลือก    | ค่า                                             | คำอธิบาย                                                                 |
| ----------- | ----------------------------------------------- | ------------------------------------------------------------------------ |
| `--pattern` | โค้ดตัวอย่าง                                    | ตรวจโค้ดตัวอย่างหนึ่งชิ้น ต้องใช้คู่กับ `--kind` ใส่ซ้ำเพื่อตรวจหลายชิ้น |
| `--kind`    | `terraform` \| `dockerfile` \| `github-actions` | ชนิดที่ใช้ตัดสินโค้ดตัวอย่าง                                             |
| `--dir`     | ไดเรกทอรี                                       | จำกัดการสแกนไว้ที่ไดเรกทอรีเดียว ใช้ซ้ำได้และใช้ร่วมกับ `--file` ได้     |
| `--file`    | ไฟล์                                            | จำกัดการสแกนไว้ที่ไฟล์เดียว ใช้ซ้ำได้และใช้ร่วมกับ `--dir` ได้           |

หากไม่ระบุตัวเลือก hook จะสแกนไฟล์ IaC ทุกไฟล์ในโปรเจกต์ `--pattern` ใช้ร่วมกับ `--dir` หรือ `--file` ไม่ได้

### เลือกสิ่งที่จะสแกน

hook นี้ข้ามสิ่งที่ **Git** ละเว้นไว้ หากต้องการข้ามมากกว่านั้น หรือต้องการสแกนสิ่งที่ **Git** ละเว้นไว้ ให้กำหนดการตั้งค่าเฉพาะของ `infra` เอง:

```bash
npx lagune write add --ignore examples --checker infra
```

```json
{
  "checkers": {
    "infra": { "gitignore": false, "ignore": ["examples"] }
  }
}
```

[กำหนดค่า hook](https://lagune.ai/th-TH/docs/hooks/configure) อธิบายการตั้งค่าทั้งหมด

**เคล็ดลับ**

hook จับกรณีที่ชัดเจนและตัดสินได้: การไม่มีการเข้ารหัส ความเสี่ยงจาก `pull_request_target` และขอบเขต IAM ที่เหมาะสม เป็นเรื่องที่ต้องใช้วิจารณญาณ ซึ่ง [ความรู้เฉพาะทาง `infra`](https://lagune.ai/th-TH/docs/catalog) ยังคงดูแลอยู่

## คำถามที่พบบ่อย

### hook infra อ่านไฟล์ infrastructure อะไรบ้าง

Terraform/HCL (.tf, .tf.json, .hcl), Dockerfile และไฟล์ YAML ของ workflow และ action ของ GitHub Actions ใต้ .github/ hook นี้เข้าถึงไฟล์เหล่านั้นได้ แม้ตัวสแกนซอร์สโค้ดจะข้ามไฟล์เหล่านั้นไป
