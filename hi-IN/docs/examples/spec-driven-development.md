# Spec-Driven Development: आपका स्पेक जो बनाए, उसे सुरक्षित रखें

> Lagune को Superpowers, Spec Kit या OpenSpec के साथ इस्तेमाल करें: अपने स्पेक से सुरक्षा सिद्धांत तय करें, फिर /lagune के साथ उसे लागू करें, ताकि कोड लिखते समय ही हर टास्क की सुरक्षा मज़बूत हो।

कैनोनिकल: https://lagune.ai/hi-IN/docs/examples/spec-driven-development
भाषा: hi-IN
मूल: https://lagune.ai/docs/examples/spec-driven-development
आख़िरी अपडेट: 2026-11-09

**Lagune** को किसी Spec-Driven Development टूल, जैसे [**Superpowers**](https://github.com/obra/superpowers), [**Spec Kit**](https://github.com/github/spec-kit) या [**OpenSpec**](https://github.com/Fission-AI/OpenSpec), के साथ इस्तेमाल करें: क्या बनाना है, यह आपका टूल तय करता है, और वह सुरक्षित कैसे रहे, यह **Lagune** तय करता है।

## यह कैसे जुड़ता है

**Lagune** आपके टूल के फ़्लो में सिर्फ़ दो जगह जुड़ता है, और बाक़ी सब वैसा ही रहता है:

1. जब आपका टूल स्पेक लिख देता है, तो कोई भी कोड बनने से पहले [`/lagune-charter`](https://lagune.ai/hi-IN/docs/commands/charter) कमांड उसे पढ़ती है और फ़ीचर के लिए ज़रूरी सुरक्षा सिद्धांत तय करती है।
2. आपके टूल की इम्प्लीमेंटेशन कमांड पर लगाई गई [`/lagune`](https://lagune.ai/hi-IN/docs/commands/lagune) कमांड, कोड लिखे जाने के साथ-साथ, उन्हीं सिद्धांतों के तहत हर टास्क की सुरक्षा मज़बूत करती है।

**टिप**

हर उदाहरण में स्पेक का पाथ बदलकर वह फ़ाइल लिखें जो आपके टूल ने बनाई है। अगर प्रोजेक्ट में पहले से सुरक्षा सिद्धांत तय हैं, तो यही चरण उन्हें नए फ़ीचर की ज़रूरतों के हिसाब से अपडेट कर देता है।

## प्रॉम्प्ट के उदाहरण

प्रॉम्प्ट क्रम से भेजें, हर एक तभी, जब पिछला पूरा हो जाए।

```prompt
/superpowers:brainstorming कार्ड पेमेंट के साथ गेस्ट चेकआउट।
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
/speckit.specify कार्ड पेमेंट के साथ गेस्ट चेकआउट।
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
