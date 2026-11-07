# OpenCode पर Lagune को प्लगइन के रूप में इंस्टॉल करें

> OpenCode 1.x और 2.x पर Lagune को प्लगइन के रूप में इंस्टॉल करें और उसे अपडेट रखें।

कैनोनिकल: https://lagune.ai/hi-IN/docs/install/opencode
भाषा: hi-IN
मूल: https://lagune.ai/docs/install/opencode
आख़िरी अपडेट: 2026-11-07

**OpenCode 2.x**

अपने टर्मिनल से प्लगइन इंस्टॉल करें:

```bash
opencode plugin add lagune
```

या इसे `plugins` लिस्ट में जोड़ें, जो `opencode.json` फ़ाइल में है:

```json
{
  "plugins": ["lagune"]
}
```

**OpenCode 1.x**

अपने टर्मिनल से प्लगइन को अपने प्रोजेक्ट में इंस्टॉल करें, या `-g` जोड़कर उसे अपने सभी प्रोजेक्ट के लिए इंस्टॉल करें:

```bash
opencode plugin lagune
```

या इसे `plugin` लिस्ट में जोड़ें, जो `opencode.json` फ़ाइल में है:

```json
{
  "plugin": ["lagune"]
}
```

## अपडेट

**OpenCode 2.x**

**Lagune** को अपडेट करने के लिए यह चलाएँ:

```bash
opencode plugin update lagune
opencode reload
```

**OpenCode 1.x**

**Lagune** को अपडेट करने के लिए नई रिलीज़ को पुरानी रिलीज़ के ऊपर इंस्टॉल करें, और अगर आपने उसे अपने सभी प्रोजेक्ट के लिए इंस्टॉल किया था, तो `-g` जोड़ें:

```bash
opencode plugin lagune@0.18.1 --force
```

## कमांड

**OpenCode 2.x**

`@` टाइप करें और कमांड चुनें, जैसे `@lagune-charter`, फिर उसी मैसेज में अपना इनपुट लिखें।

**OpenCode 1.x**

कमांड उनके नाम से टाइप करें, जैसे `/lagune-charter`। ये `/skills` के अंदर दिखती हैं, `/` मेन्यू में नहीं।

## अक्सर पूछे जाने वाले सवाल

### OpenCode पर Lagune कैसे इंस्टॉल करें?

OpenCode 2.x पर opencode plugin add lagune चलाएँ। OpenCode 1.x पर opencode plugin lagune चलाएँ, और उसे अपने सभी प्रोजेक्ट के लिए इंस्टॉल करने के लिए -g जोड़ें।

### OpenCode पर Lagune को कैसे अपडेट करें?

OpenCode 2.x पर opencode plugin update lagune चलाएँ, फिर opencode reload चलाएँ। OpenCode 1.x पर opencode plugin lagune@0.18.1 --force चलाएँ।

### OpenCode पर Lagune की कमांड कैसे चलाएँ?

OpenCode 2.x पर @ टाइप करें और कमांड चुनें, जैसे @lagune-charter, फिर उसी मैसेज में अपना इनपुट लिखें। OpenCode 1.x पर कमांड उनके नाम से टाइप करें, जैसे /lagune-charter, या उन्हें /skills के अंदर ढूँढें।

### क्या Lagune के चलने से पहले OpenCode अनुमति माँगता है?

नहीं। OpenCode इंजन के दोनों टूल, lagune_read और lagune_write, बिना पूछे चलाता है।
