# Gemini CLI में Lagune को एक्सटेंशन के रूप में इंस्टॉल करें

> Gemini CLI में Lagune को एक्सटेंशन के रूप में इंस्टॉल करें, उसे अपडेट रखें, और उसके इंजन को पहले से अनुमति दें।

कैनोनिकल: https://lagune.ai/hi-IN/docs/install/gemini-cli
भाषा: hi-IN
मूल: https://lagune.ai/docs/install/gemini-cli
आख़िरी अपडेट: 2026-11-06

अपने टर्मिनल से एक्सटेंशन इंस्टॉल करें:

```bash
gemini extensions install https://github.com/wellwelwel/lagune
```

## अपडेट

**Lagune** को अपडेट करने के लिए यह चलाएँ:

```bash
gemini extensions update lagune
```

इसे हमेशा अपडेट रखने के लिए, इसे `--auto-update` के साथ इंस्टॉल करें।

## कमांड

कमांड एक्सटेंशन के नाम के साथ टाइप करें, जैसे `/lagune:lagune-charter`, जो `/lagune-charter` कमांड है।

---

**अनुमतियाँ**

इंजन दो टूल के ज़रिए चलता है: `lagune_read` टूल सिर्फ़ आपका प्रोजेक्ट पढ़ता है, और `lagune_write` टूल सिर्फ़ `.lagune/` फ़ोल्डर में लिखता है। **Gemini CLI** इन्हें सिर्फ़ भरोसेमंद फ़ोल्डर में शुरू करता है। इन्हें पहले से अनुमति देने के लिए, यह नियम `~/.gemini/policies/lagune.toml` फ़ाइल के रूप में सेव करें:

```toml
[[rule]]
mcpName = "lagune"
toolName = ["lagune_read", "lagune_write"]
decision = "allow"
priority = 100
```

जब इंजन **npx** के ज़रिए चलता है, जैसे **skills.sh** से इंस्टॉल करने पर, तो उसी फ़ाइल में यह नियम भी जोड़ें:

```toml
[[rule]]
toolName = "run_shell_command"
commandRegex = 'npx --yes lagune@\d+\.\d+\.\d+\s'
decision = "allow"
priority = 100
```

## अक्सर पूछे जाने वाले सवाल

### Gemini CLI में Lagune कैसे इंस्टॉल करें?

gemini extensions install https://github.com/wellwelwel/lagune चलाएँ।

### Gemini CLI में Lagune को कैसे अपडेट करें?

gemini extensions update lagune चलाएँ, या एक्सटेंशन को --auto-update के साथ इंस्टॉल करें।

### Gemini CLI में Lagune की कमांड कैसे चलाएँ?

इन्हें एक्सटेंशन के नाम के साथ टाइप करें, जैसे /lagune:lagune-charter।

### क्या Gemini CLI बिना अनुमति माँगे Lagune चला सकता है?

हाँ। एक पॉलिसी नियम जोड़ें जो lagune सर्वर के lagune_read और lagune_write टूल को अनुमति दे, और साथ में run_shell_command के लिए एक नियम, जो npx --yes lagune@ और उसके बाद वर्शन वाली कमांड को अनुमति दे, जब इंजन npx के ज़रिए चलता है।
