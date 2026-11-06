# Grok Build पर Lagune को प्लगइन के रूप में इंस्टॉल करें

> Grok Build पर Lagune को प्लगइन के रूप में इंस्टॉल करें, उसे अपडेट रखें, और उसके इंजन को पहले से अनुमति दें।

कैनोनिकल: https://lagune.ai/hi-IN/docs/install/grok-build
भाषा: hi-IN
मूल: https://lagune.ai/docs/install/grok-build
आख़िरी अपडेट: 2026-11-06

अपने टर्मिनल से प्लगइन इंस्टॉल करें:

```bash
grok plugin install wellwelwel/lagune@plugin-grok --trust
```

## अपडेट

**Lagune** को अपडेट करने के लिए यह चलाएँ:

```bash
grok plugin update lagune
```

## कमांड

कमांड उनके नाम से टाइप करें, जैसे `/lagune-charter`, या प्लगइन के नाम के साथ, जैसे `/lagune:lagune-charter`।

---

**अनुमतियाँ**

इंजन दो टूल के ज़रिए चलता है: `lagune_read` टूल सिर्फ़ आपका प्रोजेक्ट पढ़ता है, और `lagune_write` टूल सिर्फ़ `.lagune/` फ़ोल्डर में लिखता है। इन्हें पहले से अनुमति देने के लिए, `~/.grok/config.toml` फ़ाइल में ये नियम जोड़ें:

```toml
[permission]
allow = ["MCPTool(lagune__lagune_read)", "MCPTool(lagune__lagune_write)"]
```

जब इंजन **npx** के ज़रिए चलता है, जैसे **skills.sh** से इंस्टॉल करने पर, तो `Bash(npx --yes lagune@*)` नियम को अनुमति दें।

## अक्सर पूछे जाने वाले सवाल

### Grok Build पर Lagune कैसे इंस्टॉल करें?

grok plugin install wellwelwel/lagune@plugin-grok --trust चलाएँ।

### Grok Build पर Lagune को कैसे अपडेट करें?

grok plugin update lagune चलाएँ।

### Grok Build पर Lagune की कमांड कैसे चलाएँ?

इन्हें उनके नाम से टाइप करें, जैसे /lagune-charter, या प्लगइन के नाम के साथ, जैसे /lagune:lagune-charter।

### क्या Grok Build अनुमति माँगे बिना Lagune चला सकता है?

हाँ। Grok Build की कॉन्फ़िग में MCPTool(lagune__lagune_read) और MCPTool(lagune__lagune_write) को अनुमति दें, और जब इंजन npx के ज़रिए चलता है, तो Bash(npx --yes lagune@*) को भी।
