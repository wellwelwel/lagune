# Pi पर Lagune को पैकेज के रूप में इंस्टॉल करें

> Pi पर Lagune को npm या GitHub से पैकेज के रूप में इंस्टॉल करें और उसे अपडेट रखें।

कैनोनिकल: https://lagune.ai/hi-IN/docs/install/pi
भाषा: hi-IN
मूल: https://lagune.ai/docs/install/pi
आख़िरी अपडेट: 2026-11-06

**npm**

अपने टर्मिनल से पैकेज इंस्टॉल करें:

```bash
pi install npm:lagune
```

**GitHub**

**GitHub** से लेटेस्ट कमिट इंस्टॉल करें, जो इंजन को **npx** के ज़रिए चलाता है:

```bash
pi install git:github.com/wellwelwel/lagune
```

## अपडेट

**npm**

**Lagune** को अपडेट करने के लिए यह चलाएँ:

```bash
pi update npm:lagune
```

**GitHub**

**Lagune** को अपडेट करने के लिए यह चलाएँ:

```bash
pi update git:github.com/wellwelwel/lagune
```

`pi update --extensions` कमांड आपके इंस्टॉल किए हर पैकेज को अपडेट करती है, जबकि सिर्फ़ `pi update` चलाने पर केवल **Pi** अपडेट होता है।

## कमांड

कमांड `skill:` प्रीफ़िक्स के साथ टाइप करें। जैसे, `/skill:lagune-charter` टाइप करने पर `/lagune-charter` कमांड चलती है।

## अक्सर पूछे जाने वाले सवाल

### Pi पर Lagune कैसे इंस्टॉल करें?

pi install npm:lagune चलाएँ, या GitHub से लेटेस्ट कमिट के लिए pi install git:github.com/wellwelwel/lagune चलाएँ।

### Pi पर Lagune को कैसे अपडेट करें?

pi update npm:lagune चलाएँ, या GitHub से इंस्टॉल करने पर pi update git:github.com/wellwelwel/lagune चलाएँ। pi update --extensions कमांड आपके इंस्टॉल किए हर पैकेज को अपडेट करती है।

### Pi पर Lagune की कमांड कैसे चलाएँ?

उन्हें skill: प्रीफ़िक्स के साथ टाइप करें, जैसे /skill:lagune-charter कमांड।
