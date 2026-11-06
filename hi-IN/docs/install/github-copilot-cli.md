# GitHub Copilot CLI पर Lagune को प्लगइन के रूप में इंस्टॉल करें

> GitHub Copilot CLI पर Lagune को प्लगइन के रूप में इंस्टॉल करें और उसे अपडेट रखें।

कैनोनिकल: https://lagune.ai/hi-IN/docs/install/github-copilot-cli
भाषा: hi-IN
मूल: https://lagune.ai/docs/install/github-copilot-cli
आख़िरी अपडेट: 2026-11-06

अपने टर्मिनल से प्लगइन इंस्टॉल करें:

```bash
copilot plugin marketplace add wellwelwel/lagune
copilot plugin install lagune@lagune
```

एडिटर में, **GitHub Copilot** के लिए **Lagune** को [**skills.sh**](https://lagune.ai/hi-IN/docs/install/universal) से इंस्टॉल करें।

## अपडेट

**Lagune** को अपडेट करने के लिए यह चलाएँ:

```bash
copilot plugin marketplace update lagune
copilot plugin update lagune@lagune
```

## कमांड

कमांड उनके नाम से टाइप करें, जैसे `/lagune-charter`।

## अक्सर पूछे जाने वाले सवाल

### GitHub Copilot CLI पर Lagune कैसे इंस्टॉल करें?

copilot plugin marketplace add wellwelwel/lagune चलाएँ, फिर copilot plugin install lagune@lagune चलाएँ।

### GitHub Copilot CLI पर Lagune को कैसे अपडेट करें?

copilot plugin marketplace update lagune चलाएँ, फिर copilot plugin update lagune@lagune चलाएँ।

### GitHub Copilot CLI पर Lagune की कमांड कैसे चलाएँ?

उन्हें उनके नाम से टाइप करें, जैसे /lagune-charter कमांड।

### क्या मैं VS Code में GitHub Copilot के साथ Lagune इस्तेमाल कर सकता हूँ?

हाँ। VS Code या किसी दूसरे एडिटर में, प्लगइन की जगह skills.sh से Lagune इंस्टॉल करें।
