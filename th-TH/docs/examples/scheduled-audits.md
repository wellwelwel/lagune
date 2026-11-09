# การตรวจสอบตามกำหนดเวลา: รัน Lagune เป็นประจำตามรอบที่ตั้งไว้

> ตั้งเวลาให้ Lagune ตรวจสอบเป็นประจำใน GitHub Actions ด้วยคีย์ของคุณเอง หรือใน Claude Code, Codex, Cursor, Antigravity หรือ OpenCode โดยจะให้รายงานความเสี่ยงใหม่หรือรันขั้นตอนแบบ Blue Team ทั้งหมดก็ได้

Canonical: https://lagune.ai/th-TH/docs/examples/scheduled-audits
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs/examples/scheduled-audits
อัปเดตล่าสุด: 2026-11-09

ตั้งเวลาให้ **Lagune** ตรวจสอบโปรเจกต์ของคุณได้เอง โดยจะให้รายงานสิ่งที่พบ หรือรันขั้นตอนแบบ Blue Team ทั้งหมดก็ได้

## การตั้งเวลา

**Universal**

**GitHub Actions** รันการตรวจสอบบนคลาวด์ด้วย [**GitHub Agentic Workflows**](https://github.github.com/gh-aw/) ซึ่งใช้เอนจิน **Copilot CLI** เรียกผู้ให้บริการโมเดลที่คุณเลือกด้วยคีย์ของคุณเอง จึงไม่ต้องสมัครใช้บริการเอเจนต์ใด ๆ:

- ติดตั้งส่วนขยายด้วย `gh extension install github/gh-aw`
- เก็บคีย์ของผู้ให้บริการเป็น secret ของ repository ด้วย `gh secret set PROVIDER_API_KEY`
- บันทึกเวิร์กโฟลว์นี้เป็น `.github/workflows/lagune-audit.md` โดยแทนที่ `<model>` ด้วยโมเดลหนึ่งของผู้ให้บริการที่รองรับ tool calling และแทนที่ `<your-prompt>` ด้วย [ตัวอย่าง prompt](#prompt-examples) ตัวใดตัวหนึ่ง:

  ```md
  ---
  on:
    schedule:
      - cron: '0 9 * * 1'
  permissions:
    contents: read
  engine:
    id: copilot
    model: <model>
    env:
      COPILOT_PROVIDER_TYPE: <type>
      COPILOT_PROVIDER_BASE_URL: <url>
      COPILOT_PROVIDER_API_KEY: ${{ secrets.PROVIDER_API_KEY }}
  skills:
    - wellwelwel/lagune@v0.18.1
  network:
    allowed:
      - defaults
      - node
  tools:
    edit:
    bash: [npx]
  safe-outputs:
    create-pull-request:
  ---

  <your-prompt>

  จากนั้นเปิด pull request พร้อมการเปลี่ยนแปลงของคุณ
  ```

  | ผู้ให้บริการ                                               | `<type>`    | `<url>`                                                   |
  | ---------------------------------------------------------- | ----------- | --------------------------------------------------------- |
  | **OpenAI**                                                 | `openai`    | `https://api.openai.com/v1`                               |
  | **Anthropic**                                              | `anthropic` | `https://api.anthropic.com`                               |
  | API ใดก็ได้ที่เข้ากันได้กับ **OpenAI** เช่น **OpenRouter** | `openai`    | base URL ของ API นั้น เช่น `https://openrouter.ai/api/v1` |

- รัน `gh aw compile` แล้ว commit เวิร์กโฟลว์พร้อมไฟล์ `.lock.yml` ที่คำสั่งนี้สร้างขึ้น

**บนคลาวด์** การตรวจสอบจะรันได้แม้คอมพิวเตอร์ของคุณปิดอยู่:

- commit **Lagune** ด้วย [การติดตั้งแบบ universal](https://lagune.ai/th-TH/docs/install/universal) แทนปลั๊กอิน
- พิมพ์ `/schedule` ในเซสชัน **Claude Code** แล้วอธิบายการตรวจสอบที่ต้องการ หรือสร้างที่ [claude.ai/code/routines](https://claude.ai/code/routines)

**บนคอมพิวเตอร์ของคุณ** การตรวจสอบจะใช้ปลั๊กอินที่คุณติดตั้งไว้ใช้เอง:

- สร้างงานในเครื่องที่หน้า **Scheduled tasks** ของแอปเดสก์ท็อป
- อนุญาตเอนจินไว้ล่วงหน้าตามที่ [หน้าการติดตั้ง](https://lagune.ai/th-TH/docs/install/claude-code) แสดงไว้ เพราะไม่มีใครอยู่คอยอนุมัติ tool ของเอนจิน
- งานจะรันเฉพาะตอนที่แอปเปิดอยู่และคอมพิวเตอร์ไม่ได้อยู่ในโหมดพักเครื่อง

งานตามกำหนดเวลาต้องสร้างในแอปเดสก์ท็อป **ChatGPT** ไม่ใช่ใน **Codex CLI** และจะรันบนคอมพิวเตอร์ของคุณ:

- ในแชต **Codex** ให้อธิบายการตรวจสอบ เวลาที่ต้องการให้รัน และบอกให้แต่ละรอบเริ่มแชตใหม่ ผลลัพธ์จะไปอยู่ที่ **Scheduled**
- ใน prompt ให้ระบุแต่ละคำสั่งด้วย `$` เช่น `$lagune:lagune-detect` เพื่อให้แต่ละรอบเรียกใช้คำสั่งนั้นอย่างชัดเจน
- เลือกโปรเจกต์ในเครื่องของคุณแทน worktree ใหม่ เพราะ worktree ใหม่จะเริ่มโดยไม่มีเอนจินที่คุณ [ติดตั้งในโปรเจกต์](https://lagune.ai/th-TH/docs/install/codex)
- งานจะรันเฉพาะตอนที่แอปเปิดอยู่ คอมพิวเตอร์เปิดอยู่ และโปรเจกต์ยังอยู่ในดิสก์

Automations ของ **Cursor** รันบนคลาวด์ แม้คอมพิวเตอร์ของคุณปิดอยู่:

- commit **Lagune** ด้วย [การติดตั้งแบบ universal](https://lagune.ai/th-TH/docs/install/universal) แทนปลั๊กอิน
- สร้าง automation ที่ [cursor.com/automations](https://cursor.com/automations) หรืออธิบายด้วย `/automate` ในเซสชันของเอเจนต์ แล้วกำหนด trigger แบบตั้งเวลา
- เลือก repository ของคุณ เพราะ trigger แบบตั้งเวลาจะเริ่มโดยไม่มี repository

Automations ของ **Antigravity** รันบนคอมพิวเตอร์ของคุณ โดยแต่ละครั้งเริ่มในบทสนทนาใหม่:

- เปิดแท็บ **Automations** ในแอป **Antigravity** แล้วสร้าง automation แบบตั้งเวลาสำหรับโปรเจกต์ของคุณ หรือขอให้เอเจนต์ตั้งค่าให้
- อนุญาตเอนจินไว้ล่วงหน้าตามที่ [หน้าการติดตั้ง](https://lagune.ai/th-TH/docs/install/antigravity-cli) แสดงไว้ เพราะไม่มีใครอยู่คอยอนุมัติ tool ของเอนจิน
- ใช้ automation แทน `/schedule` ที่มีผลอยู่แค่ตลอดบทสนทนานั้น
- automation จะรันเฉพาะตอนที่ **Antigravity** ทำงานอยู่

**OpenCode** ไม่มีตัวตั้งเวลาของตัวเอง การตรวจสอบจึงรันจาก **GitHub Actions** บนคลาวด์:

- commit **Lagune** ไว้ใน `opencode.json` ของ repository ตามที่ [หน้าการติดตั้ง](https://lagune.ai/th-TH/docs/install/opencode) แสดงไว้
- รัน `opencode github install` เพื่อเชื่อมต่อแอป GitHub ของ **OpenCode** และเก็บคีย์ของผู้ให้บริการโมเดล
- เพิ่มเวิร์กโฟลว์ที่ส่ง prompt ให้ **OpenCode** ตามกำหนดเวลา ในตัวอย่างนี้คือทุกวันจันทร์เวลา 09:00 UTC โดยกรอก `<KEY>` และ `<provider>/<model>` ให้ตรงกับเวิร์กโฟลว์ที่ `opencode github install` สร้างไว้ และแทนที่ `<your-prompt>` ด้วย [ตัวอย่าง prompt](#prompt-examples) ตัวใดตัวหนึ่ง:

  ```yaml
  name: Lagune Audit

  on:
    schedule:
      - cron: '0 9 * * 1'

  jobs:
    audit:
      runs-on: ubuntu-latest
      permissions:
        id-token: write
        contents: read
      steps:
        - uses: actions/checkout@v6
          with:
            persist-credentials: false

        - uses: anomalyco/opencode/github@latest
          env:
            <KEY>: ${{ secrets.<KEY> }}
          with:
            model: <provider>/<model>
            prompt: |
              <your-prompt>
  ```

### ตัวอย่าง prompt \{#prompt-examples}

**💧 รายงานอย่างเดียว**

ระบุความเสี่ยงใหม่ให้ครบ วางแผนการแก้ไข และตรวจซ้ำมาตรการควบคุมที่นำไปใช้แล้ว โดยไม่เปลี่ยนโค้ดของคุณ:

```md
รันคำสั่งต่อไปนี้ทีละคำสั่ง: `/lagune-detect` และ `/lagune-plan` ถ้าโปรเจกต์มีบันทึก hardening ให้รัน `/lagune-verify` ด้วย

ห้ามเปลี่ยนโค้ดของโปรเจกต์ สุดท้าย สรุปข้อตรวจพบใหม่และมาตรการควบคุมที่นำไปใช้แล้วแต่ไม่ได้ผลอีกต่อไป
```

**🌊 ครบทั้งรอบ**

นำการแก้ไขที่วางแผนไว้ไปใช้และพิสูจน์ว่าแต่ละรายการยังได้ผลด้วย จึงควรตรวจทานการเปลี่ยนแปลงก่อนรวมเข้า branch หลักของคุณ:

```md
รันคำสั่งต่อไปนี้ทีละคำสั่ง: `/lagune-detect`, `/lagune-plan`, `/lagune-harden` และ `/lagune-verify`

สุดท้าย สรุปการแก้ไขที่นำไปใช้และข้อตรวจพบที่ยังเปิดอยู่
```
