# Codex CLI में Lagune को प्लगइन के रूप में इंस्टॉल करें

> Codex CLI में Lagune को प्लगइन के रूप में इंस्टॉल करें, उसे अपडेट रखें, और उसका इंजन सैंडबॉक्स के अंदर चलाएँ।

कैनोनिकल: https://lagune.ai/hi-IN/docs/install/codex
भाषा: hi-IN
मूल: https://lagune.ai/docs/install/codex
आख़िरी अपडेट: 2026-11-07

अपने टर्मिनल से प्लगइन इंस्टॉल करें:

```bash
codex plugin marketplace add wellwelwel/lagune
codex plugin add lagune@lagune
```

## अपडेट

**Lagune** को अपडेट करने के लिए यह चलाएँ:

```bash
codex plugin marketplace upgrade lagune
```

## कमांड

`$` टाइप करें, फिर प्लगइन के नाम के साथ कमांड, और उसके बाद अपना इनपुट, जैसे `$lagune:lagune-charter`, जो `/lagune-charter` कमांड है। `$` टाइप करने पर कमांड की सूची दिखती है, और किसी एक को चुनने पर उसका पूरा नाम भर जाता है।

---

**सैंडबॉक्स**

**Codex** के सैंडबॉक्स में नेटवर्क एक्सेस नहीं है। इंजन को अपने टर्मिनल से अपने प्रोजेक्ट में इंस्टॉल करें, पहली बार और हर अपडेट के बाद:

```bash
npm i -D lagune@0.18.1
```

## अक्सर पूछे जाने वाले सवाल

### Codex CLI में Lagune कैसे इंस्टॉल करें?

codex plugin marketplace add wellwelwel/lagune चलाएँ, फिर codex plugin add lagune@lagune चलाएँ।

### Codex CLI में Lagune को कैसे अपडेट करें?

codex plugin marketplace upgrade lagune चलाएँ।

### Codex CLI में Lagune की कमांड कैसे चलाएँ?

$ टाइप करें, फिर प्लगइन के नाम के साथ कमांड, और उसके बाद अपना इनपुट, जैसे $lagune:lagune-charter।

### क्या Codex के सैंडबॉक्स के अंदर Lagune काम करता है?

हाँ, बशर्ते आप अपने टर्मिनल से npm i -D lagune@0.18.1 चलाकर इंजन को अपने प्रोजेक्ट में इंस्टॉल करें, पहली बार और हर अपडेट के बाद।
