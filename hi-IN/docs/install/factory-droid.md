# Factory Droid में Lagune को प्लगइन के रूप में इंस्टॉल करें

> Factory Droid में Lagune को प्लगइन के रूप में इंस्टॉल करें, उसे अपडेट रखें, और उसके इंजन के टूल को अनुमति दें।

कैनोनिकल: https://lagune.ai/hi-IN/docs/install/factory-droid
भाषा: hi-IN
मूल: https://lagune.ai/docs/install/factory-droid
आख़िरी अपडेट: 2026-11-06

अपने टर्मिनल से प्लगइन इंस्टॉल करें:

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

## अपडेट

**Lagune** को अपडेट करने के लिए यह चलाएँ:

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

## कमांड

कमांड उनके नाम से टाइप करें, जैसे `/lagune-charter`।

---

**अनुमतियाँ**

इंजन दो टूल के ज़रिए चलता है: `lagune_read` टूल सिर्फ़ आपका प्रोजेक्ट पढ़ता है, और `lagune_write` टूल सिर्फ़ `.lagune/` फ़ोल्डर में लिखता है। जब **Factory Droid** पूछे, तो हर टूल के लिए हमेशा अनुमति देने का विकल्प चुनें। `lagune` मार्केटप्लेस का नया कमिट सिंक करने के बाद यह फिर से पूछता है, और यह सिंक इसके शुरू होते समय भी हो सकता है।

## अक्सर पूछे जाने वाले सवाल

### Factory Droid में Lagune कैसे इंस्टॉल करें?

droid plugin marketplace add wellwelwel/lagune चलाएँ, फिर droid plugin install lagune@lagune चलाएँ।

### Factory Droid में Lagune को कैसे अपडेट करें?

droid plugin marketplace update lagune चलाएँ, फिर droid plugin update lagune@lagune चलाएँ।

### Factory Droid में Lagune की कमांड कैसे चलाएँ?

इन्हें उनके नाम से टाइप करें, जैसे /lagune-charter।

### क्या Factory Droid बिना अनुमति माँगे Lagune चला सकता है?

हाँ। जब Factory Droid पूछे, तो lagune_read और lagune_write के लिए हमेशा अनुमति देने का विकल्प चुनें। lagune मार्केटप्लेस का नया कमिट सिंक करने के बाद यह फिर से पूछता है।
