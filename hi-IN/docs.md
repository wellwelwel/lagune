# इंस्टॉल करें: किसी भी AI एजेंट के लिए सुरक्षा हार्डनिंग

> किसी भी प्रोजेक्ट में Lagune इंस्टॉल करें, जहाँ आपका एजेंट सपोर्ट करे वहाँ प्लगइन के रूप में और बाकी जगह skills CLI से, फिर अपने प्रोजेक्ट के हिसाब से सुरक्षा विशेषज्ञताएँ चुनें।

कैनोनिकल: https://lagune.ai/hi-IN/docs
भाषा: hi-IN
मूल: https://lagune.ai/docs
आख़िरी अपडेट: 2026-11-06

**Lagune** आपके AI एजेंट को प्रोजेक्ट ज़्यादा सुरक्षित बनाने में मदद करता है। आप इसे अपने कोड पर चलाते हैं, एजेंट समझता है कि आपका सिस्टम असल में क्या करता है, और फिर आपको वह सुरक्षा का काम कराता है जो उस सिस्टम के लिए मायने रखता है। **Lagune** [Security-Driven Hardening (SDH)](https://lagune.ai/hi-IN/docs/references/paper) पद्धति का पहला प्रोजेक्ट है।

**ओपन सोर्स का साथ दें**

**Lagune** पसंद आया? [**GitHub** पर हमें एक ⭐ दें](https://github.com/wellwelwel/lagune)

## अपना एजेंट चुनें

- [Claude Code](https://lagune.ai/hi-IN/docs/install/claude-code): Anthropic का एजेंटिक कोडिंग टूल
- [Codex](https://lagune.ai/hi-IN/docs/install/codex): OpenAI का कोडिंग एजेंट
- [Cursor](https://lagune.ai/hi-IN/docs/install/cursor): AI कोड एडिटर
- [GitHub Copilot](https://lagune.ai/hi-IN/docs/install/github-copilot-cli): GitHub का AI पेयर प्रोग्रामर
- [Gemini CLI](https://lagune.ai/hi-IN/docs/install/gemini-cli): Google का ओपन सोर्स टर्मिनल एजेंट
- [Antigravity](https://lagune.ai/hi-IN/docs/install/antigravity-cli): Google का एजेंटिक डेवलपमेंट प्लेटफ़ॉर्म
- [OpenCode](https://lagune.ai/hi-IN/docs/install/opencode): ओपन सोर्स कोडिंग एजेंट
- [Devin for Terminal](https://lagune.ai/hi-IN/docs/install/devin-cli): Cognition का टर्मिनल एजेंट
- [Factory Droid](https://lagune.ai/hi-IN/docs/install/factory-droid): Factory का सॉफ़्टवेयर डेवलपमेंट एजेंट
- [Grok Build](https://lagune.ai/hi-IN/docs/install/grok-build): xAI का कोडिंग एजेंट
- [Qwen Code](https://lagune.ai/hi-IN/docs/install/qwen-code): Qwen का टर्मिनल कोडिंग एजेंट
- [Kimi Code](https://lagune.ai/hi-IN/docs/install/kimi-code): Moonshot AI का कोडिंग एजेंट
- [Muse Code](https://lagune.ai/hi-IN/docs/install/muse-code): Meta का कोडिंग एजेंट
- [Pi](https://lagune.ai/hi-IN/docs/install/pi): एक मिनिमल टर्मिनल कोडिंग एजेंट
- [Hermes Agent](https://lagune.ai/hi-IN/docs/install/hermes-agent): Nous Research का ओपन सोर्स एजेंट
- [यूनिवर्सल](https://lagune.ai/hi-IN/docs/install/universal): Cline, Kiro CLI, Windsurf, Zed और 66 अन्य

**जानकारी**

- **Lagune** अंदर से **Node.js** पर चलता है, लेकिन आप अपनी पसंद की कोई भी भाषा इस्तेमाल कर सकते हैं।
- पूरी तरह ऑफ़लाइन चलाने के लिए `npm i -D lagune@0.18.0` से अपने प्रोजेक्ट में **Lagune** इंस्टॉल करें।

## श्रेणियाँ

**Lagune** का सुरक्षा ज्ञान [**विशेषज्ञताओं**](https://lagune.ai/hi-IN/docs/catalog) के रूप में आता है, जो [**श्रेणियों**](https://lagune.ai/hi-IN/docs/categories) में बँटी हैं।

- **OWASP** (`owasp`): OWASP जिन ऐप्लिकेशन सुरक्षा जोखिमों पर नज़र रखता है, उनके ख़िलाफ़ मज़बूत करें: इंजेक्शन, कमज़ोर एक्सेस कंट्रोल (Broken Access Control), ऑथेंटिकेशन और क्रिप्टो की विफलताएँ
- **इन्फ़्रास्ट्रक्चर** (`infra`): कंटेनर, वर्कलोड और सर्वरलेस कॉन्फ़िगरेशन को मज़बूत करें: Dockerfile, Compose, Pod सुरक्षा, FaaS IAM और ट्रिगर
- **AI / LLM** (`ai`): प्रॉम्प्ट इंजेक्शन और टूल, एजेंट, रिट्रीवल और MCP की असुरक्षित वायरिंग के ख़िलाफ़ AI और LLM इंटीग्रेशन को मज़बूत करें
- **Lovable** (`lovable`): AI से बने Supabase ऐप (Lovable और इसी तरह के) मज़बूत करें: RLS की कमियाँ, लीक हुई service_role कुंजियाँ और असुरक्षित डिफ़ॉल्ट
- **JavaScript** (`javascript`): JavaScript और उसके रनटाइम को eval और child_process RCE, पाथ ट्रैवर्सल और प्रोटोटाइप पॉल्यूशन के ख़िलाफ़ मज़बूत करें
- **Python** (`python`): Python को pickle और YAML डीसीरियलाइज़ेशन RCE, str.format स्ट्रिंग ट्रैवर्सल और क्लास पॉल्यूशन के ख़िलाफ़ मज़बूत करें
- **Rust** (`rust`): Rust को अनसाउंड unsafe API, transmute के ग़लत इस्तेमाल, इंटीजर ओवरफ़्लो और FFI बाउंड्री पर अपरिभाषित व्यवहार के ख़िलाफ़ मज़बूत करें
- **Java** (`java`): Java को ObjectInputStream डीसीरियलाइज़ेशन गैजेट चेन के ख़िलाफ़ मज़बूत करें, जो रिमोट कोड एक्ज़ीक्यूशन तक पहुँचती हैं
- **Ruby** (`ruby`): Ruby को Marshal.load और YAML डीसीरियलाइज़ेशन गैजेट चेन के ख़िलाफ़ मज़बूत करें, जो रिमोट कोड एक्ज़ीक्यूशन तक पहुँचती हैं
- **PHP** (`php`): PHP को टाइप जगलिंग से ऑथेंटिकेशन बायपास, ऑब्जेक्ट इंजेक्शन गैजेट चेन और असुरक्षित डिफ़ॉल्ट कॉन्फ़िगरेशन के ख़िलाफ़ मज़बूत करें
- **Go** (`go`): Go को typed-nil इंटरफ़ेस बग, goroutine डेटा रेस और सुरक्षा से जुड़े कोड पाथ पर असुरक्षित कॉन्करेंसी के ख़िलाफ़ मज़बूत करें
- **C / C++** (`c-cpp`): C और C++ को फ़ॉर्मैट-स्ट्रिंग बग, बफ़र ओवरफ़्लो और आउट-ऑफ़-बाउंड्स राइट के ख़िलाफ़ मज़बूत करें, जिनसे कोड एक्ज़ीक्यूशन मुमकिन होता है
- **.NET** (`dotnet`): .NET और C# को BinaryFormatter डीसीरियलाइज़ेशन RCE और XSS तक पहुँचने वाले एनकोडर बायपास के ख़िलाफ़ मज़बूत करें

आप जो श्रेणियाँ चुनें, उनकी कुंजियों के साथ `npx lagune write add --categories` चलाएँ।

**टिप**

हर प्रोजेक्ट `owasp` श्रेणी से शुरू होता है, और [`/lagune-charter`](https://lagune.ai/hi-IN/docs/commands/charter) कमांड प्रोजेक्ट को पढ़कर वे श्रेणियाँ जोड़ती है जिनका आधार उसे प्रोजेक्ट में मिलता है।

## ज़रूरतें

आपके सिस्टम पर [**Node.js (LTS)**](https://nodejs.org/en/download/package-manager) इंस्टॉल होना चाहिए।

## बैज लगाएँ ✨

**Lagune** इस्तेमाल कर रहे हैं? अपनी **README** में एक बैज जोड़ें:

**दो रंग**

![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)

```md
[![Secured By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Secured%20By&labelColor=303952)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security%20Powered%20By&labelColor=303952)](https://lagune.ai)
```

![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)

```md
[![Security-Driven Hardening with Lagune](https://img.shields.io/badge/Lagune-2f7bff?logo=springsecurity&logoColor=white&label=Security-Driven%20Hardening&labelColor=303952)](https://lagune.ai)
```

**एक रंग**

![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Secured By Lagune](https://img.shields.io/badge/Secured%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security Powered By Lagune](https://img.shields.io/badge/Security%20Powered%20By%20Lagune-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)

```md
[![Security-Driven Hardening](https://img.shields.io/badge/Security--Driven%20Hardening-2f7bff?logo=springsecurity&logoColor=white)](https://lagune.ai)
```

## आगे क्या

देखें कि **Lagune** की हर [**स्किल**](https://lagune.ai/hi-IN/docs/get-started/commands) क्या करती है।

## अक्सर पूछे जाने वाले सवाल

### Lagune क्या है?

Lagune एक ओपन सोर्स, केवल रक्षा के लिए बना सुरक्षा वर्कफ़्लो है, जो आपके AI एजेंट को किसी भी कोडबेस की सुरक्षा मज़बूत करने में मदद करता है। आप इसे अपने कोड पर चलाते हैं, यह पहचानता है कि आपका सिस्टम असल में क्या करता है, और फिर उस संदर्भ के लिए ज़रूरी सुरक्षा सुधारों में मार्गदर्शन करता है।

### Lagune कैसे इंस्टॉल करूँ?

अपना एजेंट चुनें: Claude Code, GitHub Copilot CLI, Muse Code, Antigravity CLI, Cursor, Kimi Code, OpenCode, Codex CLI, Factory Droid, Grok Build, Devin CLI और Hermes Agent में Lagune प्लगइन के रूप में इंस्टॉल होता है, Gemini CLI और Qwen Code में एक्सटेंशन के रूप में, Pi में पैकेज के रूप में, और बाकी किसी भी एजेंट में npx skills add wellwelwel/lagune से। यह नए और पुराने, दोनों तरह के प्रोजेक्ट में काम करता है।

### क्या Lagune को API कुंजी चाहिए?

नहीं। यह आपके अपने AI एजेंट के ज़रिए चलता है, इसलिए किसी API कुंजी की ज़रूरत नहीं है।

### इसकी ज़रूरतें क्या हैं?

आपके सिस्टम पर Node.js (LTS) इंस्टॉल होना चाहिए।

### Lagune कौन-सी प्रोग्रामिंग भाषाएँ सपोर्ट करता है?

सभी। Lagune अंदर से Node.js पर चलता है, लेकिन यह किसी भी प्रोग्रामिंग भाषा में लिखे प्रोजेक्ट का ऑडिट करता है और उसकी सुरक्षा मज़बूत करता है।

### Lagune मेरे प्रोजेक्ट में क्या जोड़ता है?

एक .lagune/ डायरेक्टरी, जिसमें आपके प्रोजेक्ट की सुरक्षा स्थिति रहती है। इसे वह पहली कमांड बनाती है जो कुछ लिखती है। skills CLI स्लैश कमांड भी प्रोजेक्ट में इंस्टॉल करता है, जहाँ से आपका एजेंट उन्हें पढ़ता है, जबकि प्लगइन उन्हें एजेंट के अंदर ही रखता है।

### Lagune को अपडेट कैसे करूँ?

जैसे इंस्टॉल किया था, वैसे ही। हर एजेंट का इंस्टॉल पेज बताता है कि वहाँ Lagune को कैसे अपडेट करें, और skills CLI इसे npx skills update से अपडेट करता है। आपके सुरक्षा सिद्धांत, चरणों के आर्टिफ़ैक्ट और आपकी अपनी विशेषज्ञताएँ जैसी हैं वैसी ही रहती हैं।

### कोई प्रोजेक्ट कौन-सी विशेषज्ञताएँ इस्तेमाल करता है?

उसकी श्रेणियों की बिल्ट-इन विशेषज्ञताएँ, और साथ में उसकी अपनी। charter चरण प्रोजेक्ट को पढ़कर वे श्रेणियाँ दर्ज करता है जिनका आधार उसे मिलता है, और npx lagune write add --categories से आप उन्हें बदल सकते हैं।

### क्या प्रोजेक्ट सुरक्षित करने से पहले मुझे उसे पूरा बना लेना होगा?

नहीं। /lagune कमांड काम लिखे जाते समय ही उसकी सुरक्षा मज़बूत करती है: यह कोई भी प्रॉम्प्ट लेती है, आपने जो माँगा वह बनाती है, और सुरक्षा सिद्धांतों के मार्गदर्शन में सुरक्षित डिफ़ॉल्ट के साथ उसे मज़बूत करती है। जो पहले से मौजूद है, उसका ऑडिट पाँच चरणों वाला Blue Team फ़्लो करता है।

### क्या Lagune किसी मौजूदा प्रोजेक्ट का ऑडिट कर सकता है?

हाँ। पाँच चरणों वाला Blue Team फ़्लो पहले से मौजूद कोड का ऑडिट करता है: charter आपके सुरक्षा नियम तय करता है, detect पहचानता है कि सिस्टम क्या करता है और जोखिम कहाँ हैं, plan हर निष्कर्ष को स्कोर देकर उसके साथ एक सुधार जोड़ता है, harden सुधार लागू करता है, और verify साबित करता है कि वे कारगर हैं, फिर उन्हें बंद करता है।

### Lagune इस्तेमाल करने और एजेंट से सीधे कमज़ोरियाँ और सुरक्षा खामियाँ ढूँढने को कहने में क्या फ़र्क है?

अपने आप कोड पढ़ने वाला एजेंट वह ढूँढ लेता है जो कमज़ोरी जैसा दिखता है, और जो नियंत्रण जैसा दिखता है उसे छोड़ देता है। ब्लॉक किए गए पतों की एक सूची देखकर लगता है कि किसी ने जोखिम पहले ही संभाल लिया है, इसलिए कोई नहीं जाँचता कि वह सूची ज़्यादातर पतों को छोड़ देती है, और कोड शिप हो जाता है। Lagune यह डिफ़ॉल्ट सोच उलट देता है: कोड में पहले से मौजूद कोई भी बचाव तब तक साबित नहीं माना जाता जब तक उसकी जाँच न हो जाए, कैटलॉग की हर विशेषज्ञता पर साफ़ फ़ैसला दिया जाता है, और verify चरण यह पूछता है कि जोखिम खत्म हुआ या नहीं, यह नहीं कि नियंत्रण मौजूद है या नहीं। हर निष्कर्ष कई रन के बाद भी एक ही ट्रैक किया गया आइटम रहता है, इसलिए उसे बंद हुआ साबित करके निपटाया जा सकता है, जबकि सीधे पूछने पर हर बार एक अलग रिपोर्ट मिलती है और तुलना करने को कुछ नहीं होता।

### Lagune के साथ डेवलप करने और एजेंट से सीधे सुरक्षित कोड लिखने को कहने में क्या फ़र्क है?

सिर्फ़ सुरक्षित कोड माँगने पर "सुरक्षित" का मतलब एजेंट तय करता है, और यह मान लिया जाता है कि आपको पता है क्या माँगना है। सुरक्षा की ज़रूरत अक्सर आपके अनुरोध में पहले से छिपी होती है, और न आप उसे देखते हैं न एजेंट: ऐसा पेज माँगना जो यूज़र को उसकी पहुँच वाले कोर्स दिखाए, अपने आप में एक ऑथराइज़ेशन नियम है, और जो जाँच कभी लिखी ही नहीं गई, उसका कोड में कोई निशान नहीं रहता जिस पर किसी की नज़र पड़े। /lagune कमांड पहली लाइन लिखे जाने से पहले आपके सुरक्षा सिद्धांत और जो बनने वाला है उससे मेल खाती विशेषज्ञताएँ लोड करती है, फिर नतीजे को उसी बचाव के आधार पर दोबारा पढ़ती है जिसका उसने इस्तेमाल किया। सुरक्षित तरीका असुरक्षित तरीके से शायद ही कभी महँगा पड़ता है, इसलिए नतीजा इस पर टिका है कि सही तरीका कौन-सा है, यह पता हो, और यही जानकारी शुरुआत में ही मिल जाती है।

### क्या Lagune DAST (Dynamic Application Security Testing) चलाता है या मेरे चल रहे एप्लिकेशन को टेस्ट करता है?

नहीं। Lagune सिर्फ़ कोड पढ़ता है, आपका सिस्टम कभी नहीं चलाता और न उसे जान-बूझकर गढ़े गए अनुरोध भेजता है। verify चरण पुष्टि करता है कि सोर्स कोड में नियंत्रण मौजूद है और सही है, और यह इस सवाल से अलग है कि वह किसी लाइव सिस्टम पर हमले के सामने टिकता है या नहीं, इसलिए "cannot tell from the code" (कोड से तय नहीं हो सकता) चुपचाप पास कर देने के बजाय एक जायज़ फ़ैसला है। DAST रनटाइम वाले सवाल का जवाब देता है और Lagune सोर्स कोड वाले सवाल का, इसलिए कोई भी दूसरे की जगह नहीं लेता। वैकल्पिक prove कमांड भी इसी सीमा में रहती है: उसके टेस्ट सुरक्षित व्यवहार की जाँच करते हैं, कभी किसी हमले के पेलोड की नहीं।

### क्या Lagune पेनटेस्ट (penetration test) की जगह ले सकता है?

नहीं, बिल्कुल नहीं! पेनटेस्ट एक अधिकृत काम है, जिसमें कोई पेशेवर आपके लाइव सिस्टम पर अपनी समझ से परखता है, निष्कर्षों को आपस में जोड़ता है और उस बिज़नेस लॉजिक की पड़ताल करता है जिसे अटैक सरफ़ेस के हिसाब से बना कोई नियम नहीं बताता। पेनटेस्ट के निष्कर्ष detect चरण को सौंपी गई चिंताओं के रूप में Lagune के Blue Team फ़्लो में आ सकते हैं, ताकि पेशेवर ने जो बताया उसकी योजना बने, उसकी सुरक्षा मज़बूत हो और उसका सत्यापन हो।

## सुरक्षा नीति

कृपया [SECURITY.md](https://github.com/wellwelwel/lagune/blob/main/SECURITY.md) देखें।

## लाइसेंस

**Lagune** [Apache License 2.0](https://github.com/wellwelwel/lagune/blob/main/LICENSE) के तहत उपलब्ध है।

Copyright © 2026-present [Weslley Araújo](https://github.com/wellwelwel) और [योगदानकर्ता](https://github.com/wellwelwel/lagune/graphs/contributors)।
