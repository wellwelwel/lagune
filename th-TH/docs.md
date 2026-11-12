# ติดตั้ง: security hardening สำหรับเอเจนต์ AI ทุกตัว

> ติดตั้ง Lagune ในโปรเจกต์ใดก็ได้ เป็นปลั๊กอินเมื่อเอเจนต์ของคุณรองรับ หรือผ่าน skills CLI สำหรับเอเจนต์อื่น จากนั้นเลือกความรู้เฉพาะทางด้านความปลอดภัยที่เหมาะกับโปรเจกต์

Canonical: https://lagune.ai/th-TH/docs
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs
อัปเดตล่าสุด: 2026-11-09

**Lagune** ช่วยให้เอเจนต์ AI ของคุณทำให้โปรเจกต์ปลอดภัยขึ้น คุณเพียงชี้ไปที่โค้ด แล้วเอเจนต์จะค้นหาว่าระบบของคุณทำอะไรจริง ๆ จากนั้นพาคุณทำงานด้านความปลอดภัยที่สำคัญกับระบบนั้น **Lagune** เป็นโปรเจกต์แรกของระเบียบวิธี [Security-Driven Hardening (SDH)](https://lagune.ai/th-TH/docs/references/paper)

**สนับสนุนโอเพนซอร์ส**

ชอบ **Lagune** ไหม [ให้ ⭐ เราบน **GitHub**](https://github.com/wellwelwel/lagune)

## เลือกเอเจนต์ของคุณ

- [Claude Code](https://lagune.ai/th-TH/docs/install/claude-code): เครื่องมือเขียนโค้ดแบบ agentic จาก Anthropic
- [Codex](https://lagune.ai/th-TH/docs/install/codex): เอเจนต์เขียนโค้ดจาก OpenAI
- [Cursor](https://lagune.ai/th-TH/docs/install/cursor): โค้ดเอดิเตอร์ที่ขับเคลื่อนด้วย AI
- [GitHub Copilot](https://lagune.ai/th-TH/docs/install/github-copilot-cli): AI pair programmer จาก GitHub
- [Gemini CLI](https://lagune.ai/th-TH/docs/install/gemini-cli): เอเจนต์บนเทอร์มินัลแบบโอเพนซอร์สจาก Google
- [Antigravity](https://lagune.ai/th-TH/docs/install/antigravity-cli): แพลตฟอร์มพัฒนาแบบ agentic จาก Google
- [OpenCode](https://lagune.ai/th-TH/docs/install/opencode): เอเจนต์เขียนโค้ดแบบโอเพนซอร์ส
- [Devin for Terminal](https://lagune.ai/th-TH/docs/install/devin-cli): เอเจนต์บนเทอร์มินัลจาก Cognition
- [Factory Droid](https://lagune.ai/th-TH/docs/install/factory-droid): เอเจนต์พัฒนาซอฟต์แวร์จาก Factory
- [Grok Build](https://lagune.ai/th-TH/docs/install/grok-build): เอเจนต์เขียนโค้ดจาก xAI
- [Qwen Code](https://lagune.ai/th-TH/docs/install/qwen-code): เอเจนต์เขียนโค้ดบนเทอร์มินัลจาก Qwen
- [Kimi Code](https://lagune.ai/th-TH/docs/install/kimi-code): เอเจนต์เขียนโค้ดจาก Moonshot AI
- [Muse Code](https://lagune.ai/th-TH/docs/install/muse-code): เอเจนต์เขียนโค้ดจาก Meta
- [Pi](https://lagune.ai/th-TH/docs/install/pi): เอเจนต์เขียนโค้ดบนเทอร์มินัลแบบมินิมอล
- [Hermes Agent](https://lagune.ai/th-TH/docs/install/hermes-agent): เอเจนต์โอเพนซอร์สจาก Nous Research
- [Universal](https://lagune.ai/th-TH/docs/install/universal): Cline, Kiro CLI, Windsurf, Zed และอีก 66 ตัว

**ข้อมูล**

- เบื้องหลัง **Lagune** ทำงานบน **Node.js** แต่คุณใช้ภาษาใดก็ได้ตามต้องการ
- หากต้องการรันแบบออฟไลน์ทั้งหมด ให้ติดตั้ง **Lagune** ในโปรเจกต์ด้วย `npm i -D lagune@0.18.2`

## หมวดหมู่

ความรู้ด้านความปลอดภัยของ **Lagune** มาในรูปแบบ [**ความรู้เฉพาะทาง**](https://lagune.ai/th-TH/docs/catalog) ที่จัดกลุ่มเป็น [**หมวดหมู่**](https://lagune.ai/th-TH/docs/categories)

- **OWASP** (`owasp`): เสริมความปลอดภัยให้แอปพลิเคชันรับมือกับความเสี่ยงที่ OWASP ติดตาม: injection การควบคุมการเข้าถึงที่บกพร่อง (Broken Access Control) และความล้มเหลวด้านการยืนยันตัวตนและการเข้ารหัส
- **โครงสร้างพื้นฐาน** (`infra`): เสริมความปลอดภัยให้การตั้งค่า container, workload และ serverless: Dockerfile และ Compose ความปลอดภัยของ Pod รวมถึง IAM และ trigger ของ FaaS
- **AI / LLM** (`ai`): เสริมความปลอดภัยให้ระบบที่ผสานรวม AI และ LLM รับมือกับ prompt injection และการเชื่อมต่อ tool เอเจนต์ retrieval และ MCP ที่ไม่ปลอดภัย
- **Lovable** (`lovable`): เสริมความปลอดภัยให้แอป Supabase ที่สร้างด้วย AI (Lovable และเครื่องมือที่คล้ายกัน): ช่องโหว่ใน RLS คีย์ service_role ที่รั่วไหล และค่าเริ่มต้นที่ไม่ปลอดภัย
- **JavaScript** (`javascript`): เสริมความปลอดภัยให้ JavaScript และรันไทม์ของภาษานี้รับมือกับ RCE ผ่าน eval และ child_process ปัญหา path traversal และ prototype pollution
- **Python** (`python`): เสริมความปลอดภัยให้ Python รับมือกับ RCE จากการ deserialize ด้วย pickle และ YAML ปัญหา traversal ผ่านสตริงของ str.format และ class pollution
- **Rust** (`rust`): เสริมความปลอดภัยให้ Rust รับมือกับ API แบบ unsafe ที่ไม่ sound การใช้ transmute ผิดวิธี ปัญหา integer overflow และ undefined behavior ที่ขอบเขต FFI
- **Java** (`java`): เสริมความปลอดภัยให้ Java รับมือกับ gadget chain จากการ deserialize ด้วย ObjectInputStream ที่นำไปสู่การรันโค้ดจากระยะไกล
- **Ruby** (`ruby`): เสริมความปลอดภัยให้ Ruby รับมือกับ gadget chain จากการ deserialize ด้วย Marshal.load และ YAML ที่นำไปสู่การรันโค้ดจากระยะไกล
- **PHP** (`php`): เสริมความปลอดภัยให้ PHP รับมือกับการเลี่ยงการยืนยันตัวตนด้วย type juggling ปัญหา gadget chain จาก object injection และค่าเริ่มต้นของการตั้งค่าที่ไม่ปลอดภัย
- **Go** (`go`): เสริมความปลอดภัยให้ Go รับมือกับบั๊ก interface แบบ typed-nil ปัญหา data races ระหว่าง goroutine และ concurrency ที่ไม่ปลอดภัยในโค้ดส่วนที่เกี่ยวกับความปลอดภัย
- **C / C++** (`c-cpp`): เสริมความปลอดภัยให้ C และ C++ รับมือกับบั๊ก format string ปัญหา buffer overflow และการเขียนข้อมูลเกินขอบเขตที่เปิดทางให้รันโค้ดได้
- **.NET** (`dotnet`): เสริมความปลอดภัยให้ .NET และ C# รับมือกับ RCE จากการ deserialize ด้วย BinaryFormatter และการเลี่ยง encoder ที่นำไปสู่ XSS

รัน `npx lagune write add --categories` พร้อมคีย์ของหมวดหมู่ที่คุณเลือก

**เคล็ดลับ**

ทุกโปรเจกต์เริ่มต้นด้วย `owasp` แล้วคำสั่ง [`/lagune-charter`](https://lagune.ai/th-TH/docs/commands/charter) จะเพิ่มหมวดหมู่ที่ผลการอ่านโปรเจกต์รองรับ

## สิ่งที่ต้องมี

ระบบของคุณต้องติดตั้ง [**Node.js (LTS)**](https://nodejs.org/en/download/package-manager) ไว้แล้ว

## ใช้ badge ✨

ใช้ **Lagune** อยู่ใช่ไหม เพิ่ม badge สักอันลงใน **README** ของคุณ:

**สองโทนสี**

![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)

```md
[![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)](https://lagune.ai)
```

![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)

```md
[![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)](https://lagune.ai)
```

**สีเดียว**

![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

## ถัดไป

ดูว่า [**skill**](https://lagune.ai/th-TH/docs/get-started/commands) แต่ละตัวของ **Lagune** ทำอะไรได้บ้าง

## คำถามที่พบบ่อย

### Lagune คืออะไร

Lagune คือเวิร์กโฟลว์ด้านความปลอดภัยแบบโอเพนซอร์สที่ใช้เพื่อการป้องกันเท่านั้น ช่วยให้เอเจนต์ AI ของคุณเสริมความปลอดภัยให้โค้ดเบสใดก็ได้ คุณชี้ไปที่โค้ด Lagune จะตรวจจับว่าระบบของคุณทำอะไรจริง ๆ แล้วนำทางการแก้ไขด้านความปลอดภัยที่สำคัญกับบริบทนั้น

### ติดตั้ง Lagune อย่างไร

เลือกเอเจนต์ของคุณ: Claude Code, GitHub Copilot CLI, Muse Code, Antigravity CLI, Cursor, Kimi Code, OpenCode, Codex CLI, Factory Droid, Grok Build, Devin CLI และ Hermes Agent ติดตั้ง Lagune เป็นปลั๊กอิน Gemini CLI และ Qwen Code ติดตั้งเป็นส่วนขยาย Pi ติดตั้งเป็นแพ็กเกจ ส่วนเอเจนต์อื่นติดตั้งด้วย npx skills add wellwelwel/lagune -y โดย Lagune ใช้ได้ทั้งกับโปรเจกต์ใหม่และโปรเจกต์เดิม

### Lagune ต้องใช้คีย์ API ไหม

ไม่ต้อง Lagune ทำงานผ่านเอเจนต์ AI ของคุณเอง จึงไม่ต้องใช้คีย์ API

### ต้องมีอะไรบ้าง

ระบบของคุณต้องติดตั้ง Node.js (LTS) ไว้แล้ว

### Lagune รองรับภาษาโปรแกรมอะไรบ้าง

ทุกภาษา เบื้องหลัง Lagune ทำงานบน Node.js แต่ตรวจสอบและเสริมความปลอดภัยให้โปรเจกต์ที่เขียนด้วยภาษาโปรแกรมใดก็ได้

### Lagune เพิ่มอะไรลงในโปรเจกต์ของฉัน

ไดเรกทอรี .lagune/ ที่เก็บสถานะความปลอดภัยของโปรเจกต์ ซึ่งคำสั่งแรกที่เขียนข้อมูลจะสร้างขึ้น นอกจากนี้ skills CLI ยังติดตั้งคำสั่ง slash ไว้ในโปรเจกต์ให้เอเจนต์อ่าน ส่วนปลั๊กอินจะเก็บคำสั่งเหล่านั้นไว้ภายในเอเจนต์

### อัปเดต Lagune อย่างไร

ทำแบบเดียวกับตอนติดตั้ง หน้าการติดตั้งของแต่ละเอเจนต์บอกวิธีอัปเดต Lagune ในเอเจนต์นั้น ส่วน skills CLI อัปเดตด้วย npx skills update โดย charter อาร์ติแฟกต์ของแต่ละเฟส และความรู้เฉพาะทางของคุณเองจะไม่ถูกแตะต้อง

### โปรเจกต์หนึ่งใช้ความรู้เฉพาะทางอะไรบ้าง

ความรู้เฉพาะทางในตัวของหมวดหมู่ที่โปรเจกต์บันทึกไว้ รวมกับความรู้เฉพาะทางของโปรเจกต์เอง charter บันทึกหมวดหมู่ที่ผลการอ่านโปรเจกต์รองรับ และคุณเปลี่ยนหมวดหมู่ได้ด้วย npx lagune write add --categories

### ต้องสร้างโปรเจกต์ให้เสร็จก่อนจึงจะเสริมความปลอดภัยได้ไหม

ไม่ต้อง คำสั่ง /lagune เสริมความปลอดภัยให้งานไปพร้อมกับที่เขียน โดยรับ prompt ใดก็ได้ สร้างสิ่งที่คุณขอ และเสริมความปลอดภัยด้วยค่าเริ่มต้นที่ปลอดภัยตามแนวทางของ charter ส่วนขั้นตอนแบบ Blue Team ทั้ง 5 เฟสใช้ตรวจสอบสิ่งที่มีอยู่แล้ว

### Lagune ตรวจสอบโปรเจกต์ที่มีอยู่แล้วได้ไหม

ได้ ขั้นตอนแบบ Blue Team ทั้ง 5 เฟสตรวจสอบสิ่งที่มีอยู่แล้ว: charter กำหนดกฎความปลอดภัยของคุณ detect ทำแผนผังว่าระบบทำอะไรและความเสี่ยงอยู่ตรงไหน plan ให้คะแนนข้อตรวจพบแต่ละข้อและจับคู่กับการแก้ไข harden นำการแก้ไขไปใช้ และ verify พิสูจน์ว่าการแก้ไขใช้ได้จริงแล้วปิดให้จบ

### การใช้ Lagune ต่างจากการสั่งให้เอเจนต์หาช่องโหว่และจุดบกพร่องด้านความปลอดภัยเองอย่างไร

เอเจนต์ที่อ่านโค้ดเองจะเจอสิ่งที่ดูเหมือนช่องโหว่ และข้ามสิ่งที่ดูเหมือนมาตรการควบคุม รายการที่อยู่ที่ถูกบล็อกดูเหมือนมีคนจัดการความเสี่ยงไว้แล้ว จึงไม่มีใครตรวจว่ารายการนั้นพลาดที่อยู่ส่วนใหญ่ไป แล้วโค้ดก็ถูกปล่อยออกไป Lagune กลับค่าเริ่มต้นนั้น: กลไกป้องกันที่มีอยู่ในโค้ดถือว่ายังไม่ได้พิสูจน์จนกว่าจะได้ตรวจสอบ ความรู้เฉพาะทางทุกตัวในแคตตาล็อกได้รับผลตัดสินที่ชัดเจน และ verify ถามว่าความเสี่ยงหมดไปแล้วหรือยัง ไม่ใช่ถามว่ามีมาตรการควบคุมอยู่หรือไม่ ข้อตรวจพบแต่ละข้อยังคงเป็นรายการที่ติดตามรายการเดียวตลอดทุกการรัน จึงพิสูจน์ได้ว่าปิดแล้วและปิดออกจากห่วงโซ่ได้ ขณะที่คำขอธรรมดาให้รายงานที่ต่างกันทุกครั้งโดยไม่มีอะไรให้เทียบ

### การพัฒนาด้วย Lagune ต่างจากการสั่งให้เอเจนต์เขียนโค้ดที่ปลอดภัยอย่างไร

การขอโค้ดที่ปลอดภัยเป็นการปล่อยให้เอเจนต์นิยามคำว่าปลอดภัยเอง และถือว่าคุณรู้ว่าต้องขออะไร ข้อกำหนดมักแฝงอยู่ในคำขอของคุณแล้วโดยที่ทั้งคุณและเอเจนต์ไม่ทันเห็น: การขอหน้าที่แสดงคอร์สที่ผู้ใช้มีสิทธิ์เข้าถึงคือการระบุกฎการตรวจสอบสิทธิ์ และการตรวจที่ไม่เคยถูกเขียนก็ไม่ทิ้งอะไรไว้ในโค้ดให้สังเกตเห็น คำสั่ง /lagune โหลด charter ของคุณและความรู้เฉพาะทางที่ตรงกับสิ่งที่กำลังจะสร้างก่อนเขียนโค้ดบรรทัดแรก แล้วอ่านผลลัพธ์ซ้ำเทียบกับการป้องกันที่ใช้ รูปแบบที่ปลอดภัยแทบไม่เคยมีต้นทุนสูงกว่ารูปแบบที่ไม่ปลอดภัย สิ่งที่ตัดสินผลลัพธ์จึงอยู่ที่การรู้ว่าควรเลือกแบบไหน และนั่นคือสิ่งที่มาถึงตั้งแต่ต้น

### Lagune รัน DAST (Dynamic Application Security Testing) หรือทดสอบแอปพลิเคชันที่กำลังทำงานอยู่ได้ไหม

ไม่ได้ Lagune อ่านโค้ดและไม่เคยรันระบบของคุณหรือส่ง request ที่จงใจสร้างขึ้นไปยังระบบ ส่วนเฟส verify ยืนยันว่ามาตรการควบคุมมีอยู่และถูกต้องในซอร์สโค้ด ซึ่งเป็นคนละคำถามกับว่ามาตรการนั้นทนการโจมตีบนระบบที่กำลังทำงานได้หรือไม่ ดังนั้น "cannot tell from the code" จึงเป็นผลตัดสินที่ชอบธรรม ไม่ใช่การปล่อยผ่านอย่างเงียบ ๆ DAST ตอบคำถามขณะรันไทม์ ส่วน Lagune ตอบคำถามในซอร์สโค้ด จึงไม่มีฝ่ายใดแทนอีกฝ่ายได้ แม้แต่คำสั่ง prove ที่เป็นตัวเลือกเสริมก็ยึดเส้นนี้: การทดสอบของคำสั่งนี้ยืนยันพฤติกรรมที่ปลอดภัย และไม่เคยใช้ payload โจมตี

### Lagune ใช้แทน Pentest (penetration test) ได้ไหม

ไม่ได้อย่างแน่นอน! Pentest คือการทดสอบที่ได้รับอนุญาต ซึ่งผู้เชี่ยวชาญใช้วิจารณญาณของตนกับระบบที่กำลังทำงานจริงของคุณ ร้อยเรียงข้อตรวจพบเข้าด้วยกัน และเจาะลึกตรรกะทางธุรกิจที่ไม่มีกฎรายพื้นผิวการโจมตีข้อใดอธิบายไว้ ข้อตรวจพบจาก pentest เข้าสู่ขั้นตอนแบบ Blue Team ของ Lagune ได้ในฐานะข้อกังวลที่คุณส่งให้ detect เพื่อให้สิ่งที่ผู้เชี่ยวชาญรายงานได้รับการวางแผน เสริมความปลอดภัย และตรวจยืนยัน

## นโยบายความปลอดภัย

ดู [SECURITY.md](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md)

## สัญญาอนุญาต

**Lagune** เผยแพร่ภายใต้ [Apache License 2.0](https://github.com/wellwelwel/lagune/blob/main/LICENSE)

Copyright © 2026-ปัจจุบัน [Weslley Araújo](https://github.com/wellwelwel) และ [ผู้ร่วมพัฒนา](https://github.com/wellwelwel/lagune/graphs/contributors)
