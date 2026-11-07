# Muse Code पर Lagune को प्लगइन के रूप में इंस्टॉल करें

> Muse Code पर Lagune को प्लगइन के रूप में इंस्टॉल करें, उसे अपडेट रखें, और उसका इंजन सैंडबॉक्स के अंदर चलाएँ।

कैनोनिकल: https://lagune.ai/hi-IN/docs/install/muse-code
भाषा: hi-IN
मूल: https://lagune.ai/docs/install/muse-code
आख़िरी अपडेट: 2026-11-07

अपने टर्मिनल से प्लगइन इंस्टॉल करें:

```bash
muse plugins marketplace add lagune wellwelwel/lagune
muse plugins install lagune@lagune
```

## अपडेट

**Lagune** को अपडेट करने के लिए मार्केटप्लेस को रीफ़्रेश करें और प्लगइन को दोबारा इंस्टॉल करें:

```bash
muse plugins marketplace update lagune
muse plugins remove lagune
muse plugins install lagune@lagune
```

## कमांड

कमांड उनके नाम से टाइप करें, जैसे `/lagune-charter`, या प्लगइन के नाम के साथ, जैसे `/lagune:lagune-charter`।

---

**सैंडबॉक्स**

**Muse Code** का सैंडबॉक्स इंजन डाउनलोड नहीं कर सकता। इसे अपने टर्मिनल से अपने प्रोजेक्ट में इंस्टॉल करें, पहली बार और हर अपडेट के बाद:

```bash
npm i -D lagune@0.18.0
```

## अक्सर पूछे जाने वाले सवाल

### Muse Code पर Lagune कैसे इंस्टॉल करें?

muse plugins marketplace add lagune wellwelwel/lagune चलाएँ, फिर muse plugins install lagune@lagune चलाएँ।

### Muse Code पर Lagune को कैसे अपडेट करें?

muse plugins marketplace update lagune चलाएँ, फिर muse plugins remove lagune और muse plugins install lagune@lagune से प्लगइन दोबारा इंस्टॉल करें।

### Muse Code पर Lagune की कमांड कैसे चलाएँ?

इन्हें उनके नाम से टाइप करें, जैसे /lagune-charter, या प्लगइन के नाम के साथ, जैसे /lagune:lagune-charter।

### क्या Lagune, Muse Code के सैंडबॉक्स में काम करता है?

हाँ, जब आप अपने टर्मिनल से npm i -D lagune@0.18.0 चलाकर इंजन को अपने प्रोजेक्ट में इंस्टॉल कर लें, पहली बार और हर अपडेट के बाद।
