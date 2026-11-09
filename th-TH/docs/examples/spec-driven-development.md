# Spec-Driven Development: ทำให้สิ่งที่สร้างจากสเปกของคุณปลอดภัย

> ใช้ Lagune คู่กับ Superpowers, Spec Kit หรือ OpenSpec: ตั้ง charter จากสเปกของคุณ แล้วลงมือพัฒนาด้วย /lagune เพื่อให้ทุกงานได้รับการเสริมความปลอดภัยไปพร้อมกับตอนเขียนโค้ด

Canonical: https://lagune.ai/th-TH/docs/examples/spec-driven-development
ภาษา: th-TH
ต้นฉบับ: https://lagune.ai/docs/examples/spec-driven-development
อัปเดตล่าสุด: 2026-11-09

ใช้ **Lagune** คู่กับเครื่องมือ Spec-Driven Development เช่น [**Superpowers**](https://github.com/obra/superpowers), [**Spec Kit**](https://github.com/github/spec-kit) หรือ [**OpenSpec**](https://github.com/Fission-AI/OpenSpec): เครื่องมือของคุณกำหนดว่าจะสร้างอะไร ส่วน **Lagune** กำหนดว่าจะทำให้ปลอดภัยอย่างไร

## ทำงานร่วมกันอย่างไร

**Lagune** เข้าไปอยู่ในขั้นตอนของเครื่องมือคุณ 2 จุด โดยไม่เปลี่ยนส่วนที่เหลือ:

1. เมื่อเครื่องมือของคุณเขียนสเปกเสร็จ [`/lagune-charter`](https://lagune.ai/th-TH/docs/commands/charter) จะอ่านสเปกนั้นและตั้งหลักการด้านความปลอดภัยที่ฟีเจอร์ต้องการ ก่อนจะมีโค้ดใด ๆ
2. เมื่อใส่ไว้ในคำสั่ง implement ของเครื่องมือคุณ [`/lagune`](https://lagune.ai/th-TH/docs/commands/lagune) จะเสริมความปลอดภัยให้แต่ละงานตามหลักการเหล่านั้นไปพร้อมกับตอนเขียนโค้ด

**เคล็ดลับ**

แทนที่ path ของสเปกในแต่ละตัวอย่างด้วยไฟล์ที่เครื่องมือของคุณเขียน ถ้าโปรเจกต์มี charter อยู่แล้ว ขั้นตอนเดียวกันนี้จะอัปเดต charter ด้วยสิ่งที่ฟีเจอร์ใหม่ต้องการ

## ตัวอย่าง prompt

ส่ง prompt ตามลำดับ โดยส่งแต่ละ prompt เมื่อ prompt ก่อนหน้าทำงานเสร็จ

```prompt
/superpowers:brainstorming ระบบ checkout แบบไม่ต้องสมัครสมาชิก พร้อมการชำระเงินด้วยบัตร
```

```prompt
/lagune-charter docs/superpowers/specs/2026-11-09-guest-checkout-design.md
```

```prompt
/superpowers:writing-plans
```

```prompt
/superpowers:executing-plans /lagune
```

```prompt
/speckit.specify ระบบ checkout แบบไม่ต้องสมัครสมาชิก พร้อมการชำระเงินด้วยบัตร
```

```prompt
/lagune-charter specs/001-guest-checkout/spec.md
```

```prompt
/speckit.plan
```

```prompt
/speckit.tasks
```

```prompt
/speckit.implement /lagune
```

```prompt
/opsx:propose add-guest-checkout
```

```prompt
/lagune-charter openspec/changes/add-guest-checkout/proposal.md
```

```prompt
/opsx:apply /lagune
```

```prompt
/opsx:archive
```
