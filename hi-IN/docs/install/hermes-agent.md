# Hermes Agent पर Lagune को प्लगइन के रूप में इंस्टॉल करें

> Hermes Agent पर Lagune को प्लगइन के रूप में इंस्टॉल करें और उसे अपडेट रखें।

कैनोनिकल: https://lagune.ai/hi-IN/docs/install/hermes-agent
भाषा: hi-IN
मूल: https://lagune.ai/docs/install/hermes-agent
आख़िरी अपडेट: 2026-11-06

अपने टर्मिनल से प्लगइन इंस्टॉल करें:

```bash
hermes plugins install wellwelwel/lagune --enable
```

- जब **Hermes Agent** अपने कैटलॉग से बाहर के प्लगइन की पुष्टि करने को कहे, तो **पुष्टि करें**।
- जब वह रिपॉज़िटरी की **Node.js** डिपेंडेंसी इंस्टॉल करने की पेशकश करे, तो **मना करें**।

## अपडेट

**Lagune** को अपडेट करने के लिए यह चलाएँ:

```bash
hermes plugins update lagune
```

## कमांड

कमांड प्लगइन के नाम के साथ टाइप करें, जैसे `/lagune:lagune-charter`, जो `/lagune-charter` कमांड है, और `/lagune:lagune`, जो `/lagune` कमांड है।

## अक्सर पूछे जाने वाले सवाल

### Hermes Agent पर Lagune कैसे इंस्टॉल करें?

hermes plugins install wellwelwel/lagune --enable चलाएँ। पूछे जाने पर प्लगइन की पुष्टि करें, और रिपॉज़िटरी की Node.js डिपेंडेंसी इंस्टॉल करने से मना करें।

### Hermes Agent पर Lagune को कैसे अपडेट करें?

hermes plugins update lagune चलाएँ।

### Hermes Agent पर Lagune की कमांड कैसे चलाएँ?

इन्हें प्लगइन के नाम के साथ टाइप करें, जैसे /lagune:lagune-charter और /lagune:lagune।
