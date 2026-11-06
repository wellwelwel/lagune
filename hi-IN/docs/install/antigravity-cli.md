# Antigravity CLI में Lagune को प्लगइन के रूप में इंस्टॉल करें

> Antigravity CLI में Lagune को प्लगइन के रूप में इंस्टॉल करें, उसे अपडेट रखें, और उसके इंजन को पहले से अनुमति दें।

कैनोनिकल: https://lagune.ai/hi-IN/docs/install/antigravity-cli
भाषा: hi-IN
मूल: https://lagune.ai/docs/install/antigravity-cli
आख़िरी अपडेट: 2026-11-06

अपने टर्मिनल से प्लगइन इंस्टॉल करें:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## अपडेट

**Lagune** को अपडेट करने के लिए उसे फिर से इंस्टॉल करें:

```bash
agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity
```

## कमांड

कमांड प्लगइन के नाम के साथ टाइप करें, जैसे `/lagune:lagune-charter`, जो `/lagune-charter` कमांड है।

---

**अनुमतियाँ**

इंजन दो टूल के ज़रिए चलता है: `lagune_read` टूल सिर्फ़ आपका प्रोजेक्ट पढ़ता है, और `lagune_write` टूल सिर्फ़ `.lagune/` फ़ोल्डर में लिखता है। सेशन के पहले मैसेज के रूप में भेजी गई कमांड इन टूल के लोड होने से पहले चलती है, इसलिए वह इनकी जगह **npx** का इस्तेमाल करती है। टूल और **npx** को पहले से अनुमति देने के लिए, ये नियम `~/.gemini/antigravity-cli/settings.json` फ़ाइल में जोड़ें:

```json
{
  "permissions": {
    "allow": [
      "mcp(lagune_lagune/lagune_read)",
      "mcp(lagune_lagune/lagune_write)",
      "command(regex:npx --yes lagune@[0-9.]+)"
    ]
  }
}
```

## अक्सर पूछे जाने वाले सवाल

### Antigravity CLI में Lagune कैसे इंस्टॉल करें?

agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity चलाएँ।

### Antigravity CLI में Lagune को कैसे अपडेट करें?

agy plugin install https://github.com/wellwelwel/lagune/tree/plugin-antigravity फिर से चलाएँ।

### Antigravity CLI में Lagune की कमांड कैसे चलाएँ?

इन्हें प्लगइन के नाम के साथ टाइप करें, जैसे /lagune:lagune-charter।

### क्या Antigravity CLI बिना अनुमति माँगे Lagune चला सकता है?

हाँ। Antigravity CLI की सेटिंग में mcp(lagune_lagune/lagune_read), mcp(lagune_lagune/lagune_write), और command(regex:npx --yes lagune@[0-9.]+) को अनुमति दें। npx वाला नियम उस कमांड के लिए है जो सेशन के पहले मैसेज के रूप में भेजी जाती है।
