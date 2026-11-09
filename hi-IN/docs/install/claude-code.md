# Claude Code में Lagune को प्लगइन के रूप में इंस्टॉल करें

> Claude Code में Lagune को प्लगइन के रूप में इंस्टॉल करें, चाहे टर्मिनल हो, एक्सटेंशन हो या डेस्कटॉप ऐप, उसे अपडेट रखें, और उसके इंजन को पहले से अनुमति दें।

कैनोनिकल: https://lagune.ai/hi-IN/docs/install/claude-code
भाषा: hi-IN
मूल: https://lagune.ai/docs/install/claude-code
आख़िरी अपडेट: 2026-11-09

**टर्मिनल**

अपने टर्मिनल से प्लगइन इंस्टॉल करें:

```bash
claude plugin install lagune --marketplace wellwelwel/lagune
```

या किसी **Claude Code** सेशन से:

```prompt
/plugin marketplace add wellwelwel/lagune
/plugin install lagune@lagune
```

**एक्सटेंशन**

- `/plugin` टाइप करें और **Manage plugins** चुनें।
- **Marketplaces** टैब में `wellwelwel/lagune` जोड़ें।
- **Plugins** टैब में `lagune` इंस्टॉल करें।

**डेस्कटॉप**

- **Lagune** को टर्मिनल या एक्सटेंशन से इंस्टॉल करें, और एक्सटेंशन में **Install for you** चुनें।
- डेस्कटॉप ऐप में नया सेशन शुरू करें। यह ऐप वे प्लगइन लोड करता है जिन्हें आप अपने लिए इंस्टॉल करते हैं।

## अपडेट

**टर्मिनल**

**Lagune** को अपडेट करने के लिए यह चलाएँ:

```bash
claude plugin marketplace update lagune
claude plugin update lagune@lagune
```

इसे हमेशा अपडेट रखने के लिए, `lagune` मार्केटप्लेस के लिए `/plugin` में **Enable auto-update** चुनें।

**एक्सटेंशन**

- `/plugin` टाइप करें और **Manage plugins** चुनें।
- **Marketplaces** टैब खोलें।
- `lagune` पर रिफ़्रेश आइकन चुनें।

**डेस्कटॉप**

- **Lagune** को टर्मिनल या एक्सटेंशन से अपडेट करें।
- डेस्कटॉप ऐप में नया सेशन शुरू करें।

## कमांड

कमांड उनके नाम से टाइप करें, जैसे `/lagune-charter`, या प्लगइन के नाम के साथ, जैसे `/lagune:lagune-charter`।

---

**अनुमतियाँ**

इंजन दो टूल के ज़रिए चलता है: `lagune_read` टूल सिर्फ़ आपका प्रोजेक्ट पढ़ता है, और `lagune_write` टूल सिर्फ़ `.lagune/` फ़ोल्डर में लिखता है। इन्हें पहले से अनुमति देने के लिए, ये नियम एक प्रोजेक्ट के लिए `.claude/settings.json` फ़ाइल में जोड़ें, या सभी प्रोजेक्ट के लिए `~/.claude/settings.json` फ़ाइल में:

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_lagune_lagune__lagune_read",
      "mcp__plugin_lagune_lagune__lagune_write"
    ]
  }
}
```

जब इंजन **npx** के ज़रिए चलता है, जैसे **skills.sh** से इंस्टॉल करने पर, तो `Bash(npx --yes lagune@*)` को अनुमति दें। सैंडबॉक्स चालू हो, तो `registry.npmjs.org` को `sandbox.network.allowedDomains` में भी जोड़ें।

## अक्सर पूछे जाने वाले सवाल

### Claude Code में Lagune कैसे इंस्टॉल करें?

claude plugin install lagune --marketplace wellwelwel/lagune चलाएँ। सेशन या एक्सटेंशन में, प्लगइन मैनेजर से wellwelwel/lagune मार्केटप्लेस जोड़ें और lagune इंस्टॉल करें। जब आप इसे टर्मिनल या एक्सटेंशन में अपने लिए इंस्टॉल कर लेते हैं, तो डेस्कटॉप ऐप भी इसे लोड कर लेता है।

### Claude Code में Lagune को कैसे अपडेट करें?

claude plugin marketplace update lagune चलाएँ, फिर claude plugin update lagune@lagune चलाएँ, या /plugin में lagune मार्केटप्लेस के लिए Enable auto-update चुनें। एक्सटेंशन में, /plugin से Manage plugins खोलें और lagune मार्केटप्लेस पर रिफ़्रेश आइकन चुनें। डेस्कटॉप ऐप अपने अगले सेशन में अपडेट लोड कर लेता है।

### Claude Code में Lagune की कमांड कैसे चलाएँ?

इन्हें उनके नाम से टाइप करें, जैसे /lagune-charter, या प्लगइन के नाम के साथ, जैसे /lagune:lagune-charter।

### क्या Claude Code बिना अनुमति माँगे Lagune चला सकता है?

हाँ। अपनी Claude Code सेटिंग में mcp__plugin_lagune_lagune__lagune_read और mcp__plugin_lagune_lagune__lagune_write को अनुमति दें, और जब इंजन npx के ज़रिए चलता है, तो Bash(npx --yes lagune@*) को भी।
