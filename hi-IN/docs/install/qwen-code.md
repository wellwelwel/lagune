# Qwen Code पर Lagune को एक्सटेंशन के रूप में इंस्टॉल करें

> Qwen Code पर Lagune को एक्सटेंशन के रूप में इंस्टॉल करें, उसे अपडेट रखें, और उसके इंजन को पहले से अनुमति दें।

कैनोनिकल: https://lagune.ai/hi-IN/docs/install/qwen-code
भाषा: hi-IN
मूल: https://lagune.ai/docs/install/qwen-code
आख़िरी अपडेट: 2026-11-06

अपने टर्मिनल से एक्सटेंशन इंस्टॉल करें:

```bash
qwen extensions install lagune
```

## अपडेट

**Lagune** को अपडेट करने के लिए यह चलाएँ:

```bash
qwen extensions update lagune
```

इसे हमेशा अपडेट रखने के लिए, इसे `--auto-update` के साथ इंस्टॉल करें।

## कमांड

कमांड एक्सटेंशन के नाम के साथ टाइप करें, जैसे `/lagune:lagune-charter`, जो `/lagune-charter` कमांड है।

---

**अनुमतियाँ**

इंजन दो टूल के ज़रिए चलता है: `lagune_read` टूल सिर्फ़ आपका प्रोजेक्ट पढ़ता है, और `lagune_write` टूल सिर्फ़ `.lagune/` फ़ोल्डर में लिखता है। इन्हें पहले से अनुमति देने के लिए, एक प्रोजेक्ट के लिए `.qwen/settings.json` फ़ाइल में, या सभी प्रोजेक्ट के लिए `~/.qwen/settings.json` फ़ाइल में ये नियम जोड़ें:

```json
{
  "permissions": {
    "allow": ["mcp__lagune__lagune_read", "mcp__lagune__lagune_write"]
  }
}
```

जब इंजन **npx** के ज़रिए चलता है, जैसे **skills.sh** से इंस्टॉल करने पर, तो `Shell(npx --yes lagune@*)` नियम को अनुमति दें।

## अक्सर पूछे जाने वाले सवाल

### Qwen Code पर Lagune कैसे इंस्टॉल करें?

qwen extensions install lagune चलाएँ।

### Qwen Code पर Lagune को कैसे अपडेट करें?

qwen extensions update lagune चलाएँ, या एक्सटेंशन को --auto-update के साथ इंस्टॉल करें।

### Qwen Code पर Lagune की कमांड कैसे चलाएँ?

इन्हें एक्सटेंशन के नाम के साथ टाइप करें, जैसे /lagune:lagune-charter।

### क्या Qwen Code अनुमति माँगे बिना Lagune चला सकता है?

हाँ। Qwen Code की सेटिंग में mcp__lagune__lagune_read और mcp__lagune__lagune_write को अनुमति दें, और जब इंजन npx के ज़रिए चलता है, तो Shell(npx --yes lagune@*) को भी।
