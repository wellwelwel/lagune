# Cursor में Lagune को प्लगइन के रूप में इंस्टॉल करें

> Cursor और Cursor CLI में Lagune को प्लगइन के रूप में इंस्टॉल करें, उसे अपडेट रखें, और उसके इंजन को पहले से अनुमति दें।

कैनोनिकल: https://lagune.ai/hi-IN/docs/install/cursor
भाषा: hi-IN
मूल: https://lagune.ai/docs/install/cursor
आख़िरी अपडेट: 2026-11-06

**Cursor**

- **Customize** खोलें।
- **From GitHub Repository** चुनें और `https://github.com/wellwelwel/lagune` डालें।
- **Lagune** पर **Install** चुनें, फिर दायरा चुनें: प्रोजेक्ट या यूज़र।

**Cursor CLI**

- अपने टर्मिनल से मार्केटप्लेस जोड़ें:

  ```bash
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- `/plugins` कमांड को `agent` सेशन में टाइप करें।
- **Lagune** इंस्टॉल करें।

अगर **Lagune** पहले से **Claude Code** में इंस्टॉल है, तो **Cursor CLI** उसे वहीं से लोड कर लेता है।

## अपडेट

**Cursor**

- **Customize** खोलें।
- `lagune` मार्केटप्लेस पर **Refresh** चुनें।

**Cursor CLI**

- अपने टर्मिनल से मार्केटप्लेस को बदलें:

  ```bash
  agent plugin marketplace remove lagune
  agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor
  ```

- `/plugins` कमांड को `agent` सेशन में टाइप करें।
- **Lagune** फिर से इंस्टॉल करें।

## कमांड

कमांड उनके नाम से टाइप करें, जैसे `/lagune-charter`।

---

**अनुमतियाँ**

**Cursor** में कमांड इंजन को **npx** के ज़रिए चलाती हैं, जिसे डिफ़ॉल्ट Auto-review मोड बिना पूछे अनुमति देता है।

**Cursor CLI** में इंजन दो टूल के ज़रिए चलता है: `lagune_read` टूल सिर्फ़ आपका प्रोजेक्ट पढ़ता है, और `lagune_write` टूल सिर्फ़ `.lagune/` फ़ोल्डर में लिखता है। इन्हें पहले से अनुमति देने के लिए, ये नियम एक प्रोजेक्ट के लिए `.cursor/cli.json` फ़ाइल में जोड़ें, या सभी प्रोजेक्ट के लिए `~/.cursor/cli-config.json` फ़ाइल में:

```json
{
  "permissions": {
    "allow": [
      "Mcp(plugin-lagune-lagune:lagune_read)",
      "Mcp(plugin-lagune-lagune:lagune_write)"
    ]
  }
}
```

जब इंजन **npx** के ज़रिए चलता है, जैसे **skills.sh** से इंस्टॉल करने पर, तो `Shell(npx:--yes lagune@*)` को अनुमति दें।

## अक्सर पूछे जाने वाले सवाल

### Cursor में Lagune कैसे इंस्टॉल करें?

Cursor में, Customize खोलें, From GitHub Repository चुनें, https://github.com/wellwelwel/lagune डालें, और Lagune इंस्टॉल करें। Cursor CLI में, agent plugin marketplace add https://github.com/wellwelwel/lagune --git-ref plugin-cursor चलाएँ, फिर /plugins से Lagune इंस्टॉल करें।

### Cursor में Lagune को कैसे अपडेट करें?

Cursor में, Customize में lagune मार्केटप्लेस पर Refresh चुनें। Cursor CLI में, lagune मार्केटप्लेस हटाएँ, उसे फिर से जोड़ें, और फिर /plugins से Lagune दोबारा इंस्टॉल करें।

### Cursor में Lagune की कमांड कैसे चलाएँ?

इन्हें उनके नाम से टाइप करें, जैसे /lagune-charter।

### क्या Cursor बिना अनुमति माँगे Lagune चला सकता है?

हाँ। Cursor का डिफ़ॉल्ट Auto-review मोड इसे पहले से अनुमति देता है। Cursor CLI में, Mcp(plugin-lagune-lagune:lagune_read) और Mcp(plugin-lagune-lagune:lagune_write) को अनुमति दें, और जब इंजन npx के ज़रिए चलता है, तो Shell(npx:--yes lagune@*) को भी।
