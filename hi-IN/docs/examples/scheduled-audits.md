# शेड्यूल्ड ऑडिट: Lagune को तय समय पर बार-बार चलाएँ

> GitHub Actions में अपनी कुंजी से, या Claude Code, Codex, Cursor, Antigravity या OpenCode में, Lagune का नियमित ऑडिट शेड्यूल करें, जो या तो नए जोखिमों की रिपोर्ट देता है या पूरा Blue Team फ़्लो चलाता है।

कैनोनिकल: https://lagune.ai/hi-IN/docs/examples/scheduled-audits
भाषा: hi-IN
मूल: https://lagune.ai/docs/examples/scheduled-audits
आख़िरी अपडेट: 2026-11-09

**Lagune** को शेड्यूल करें, ताकि वह अपने आप आपके प्रोजेक्ट का ऑडिट करे और या तो जो मिले उसकी रिपोर्ट दे, या पूरा Blue Team फ़्लो चलाए।

## शेड्यूल करें

**Universal**

**GitHub Actions** [**GitHub Agentic Workflows**](https://github.github.com/gh-aw/) के साथ क्लाउड में ऑडिट चलाता है। इसका **Copilot CLI** इंजन आपके चुने हुए मॉडल प्रोवाइडर को आपकी अपनी कुंजी से कॉल करता है, इसलिए किसी एजेंट सब्सक्रिप्शन की ज़रूरत नहीं है:

- `gh extension install github/gh-aw` से एक्सटेंशन इंस्टॉल करें।
- `gh secret set PROVIDER_API_KEY` से अपने प्रोवाइडर की कुंजी को रिपॉज़िटरी सीक्रेट के रूप में सेव करें।
- इस वर्कफ़्लो को `.github/workflows/lagune-audit.md` के रूप में सेव करें, और `<model>` की जगह अपने प्रोवाइडर का कोई ऐसा मॉडल लिखें जो टूल कॉलिंग सपोर्ट करता हो, और `<your-prompt>` की जगह [प्रॉम्प्ट के उदाहरणों](#prompt-examples) में से कोई एक:

  ```md
  ---
  on:
    schedule:
      - cron: '0 9 * * 1'
  permissions:
    contents: read
  engine:
    id: copilot
    model: <model>
    env:
      COPILOT_PROVIDER_TYPE: <type>
      COPILOT_PROVIDER_BASE_URL: <url>
      COPILOT_PROVIDER_API_KEY: ${{ secrets.PROVIDER_API_KEY }}
  skills:
    - wellwelwel/lagune@v0.19.0
  network:
    allowed:
      - defaults
      - node
  tools:
    edit:
    bash: [npx]
  safe-outputs:
    create-pull-request:
  ---

  <your-prompt>

  फिर अपने बदलावों के साथ एक पुल रिक्वेस्ट खोलो।
  ```

  | प्रोवाइडर                                            | `<type>`    | `<url>`                                           |
  | ---------------------------------------------------- | ----------- | ------------------------------------------------- |
  | **OpenAI**                                           | `openai`    | `https://api.openai.com/v1`                       |
  | **Anthropic**                                        | `anthropic` | `https://api.anthropic.com`                       |
  | कोई भी **OpenAI**-कम्पैटिबल API, जैसे **OpenRouter** | `openai`    | उसका बेस URL, जैसे `https://openrouter.ai/api/v1` |

- `gh aw compile` चलाएँ, और वर्कफ़्लो को उससे बनी `.lock.yml` फ़ाइल के साथ कमिट करें।

**क्लाउड में**, आपका कंप्यूटर बंद होने पर भी ऑडिट चलता है:

- प्लगइन के बजाय [यूनिवर्सल इंस्टॉल](https://lagune.ai/hi-IN/docs/install/universal) से **Lagune** को कमिट करें।
- **Claude Code** सेशन में `/schedule` टाइप करें और ऑडिट के बारे में बताएँ, या इसे [claude.ai/code/routines](https://claude.ai/code/routines) पर बनाएँ।

**आपके कंप्यूटर पर**, ऑडिट वह प्लगइन इस्तेमाल करता है जो आपने अपने लिए इंस्टॉल किया है:

- डेस्कटॉप ऐप के **Scheduled tasks** पेज पर एक लोकल टास्क बनाएँ।
- इंजन को पहले से अनुमति दें, जैसा [इंस्टॉल पेज](https://lagune.ai/hi-IN/docs/install/claude-code) में दिखाया गया है, क्योंकि उसके टूल को मंज़ूरी देने के लिए वहाँ कोई नहीं होगा।
- टास्क तभी चलता है जब ऐप खुला हो और आपका कंप्यूटर स्लीप मोड में न हो।

शेड्यूल्ड टास्क **ChatGPT** डेस्कटॉप ऐप में बनते हैं, **Codex CLI** में नहीं, और आपके कंप्यूटर पर चलते हैं:

- **Codex** चैट में बताएँ कि ऑडिट क्या करे, कब चले, और यह कि हर रन एक नई चैट शुरू करे। इसके नतीजे **Scheduled** में आते हैं।
- प्रॉम्प्ट में हर कमांड का नाम `$` के साथ लिखें, जैसे `$lagune:lagune-detect`, ताकि रन उसे साफ़ तौर पर चलाए।
- नए वर्कट्री के बजाय अपना लोकल प्रोजेक्ट चुनें, क्योंकि नया वर्कट्री उस इंजन के बिना शुरू होता है जिसे आपने [अपने प्रोजेक्ट में इंस्टॉल किया](https://lagune.ai/hi-IN/docs/install/codex) है।
- टास्क तभी चलता है जब ऐप खुला हो, आपका कंप्यूटर चालू हो, और प्रोजेक्ट डिस्क पर मौजूद हो।

**Cursor** के Automations क्लाउड में चलते हैं, आपका कंप्यूटर बंद होने पर भी:

- प्लगइन के बजाय [यूनिवर्सल इंस्टॉल](https://lagune.ai/hi-IN/docs/install/universal) से **Lagune** को कमिट करें।
- [cursor.com/automations](https://cursor.com/automations) पर एक ऑटोमेशन बनाएँ, या किसी एजेंट सेशन में `/automate` से उसके बारे में बताएँ, और उसे एक शेड्यूल्ड ट्रिगर दें।
- अपनी रिपॉज़िटरी चुनें, क्योंकि शेड्यूल्ड ट्रिगर बिना रिपॉज़िटरी के शुरू होता है।

**Antigravity** के Automations आपके कंप्यूटर पर चलते हैं, हर बार एक नई बातचीत में:

- **Automations** टैब को **Antigravity** ऐप में खोलें और अपने प्रोजेक्ट के लिए एक शेड्यूल्ड ऑटोमेशन बनाएँ, या एजेंट से इसे सेट अप करने को कहें।
- इंजन को पहले से अनुमति दें, जैसा [इंस्टॉल पेज](https://lagune.ai/hi-IN/docs/install/antigravity-cli) में दिखाया गया है, क्योंकि उसके टूल को मंज़ूरी देने के लिए वहाँ कोई नहीं होगा।
- `/schedule` के बजाय ऑटोमेशन इस्तेमाल करें, क्योंकि वह सिर्फ़ अपनी बातचीत चलने तक ही टिकता है।
- ऑटोमेशन तभी चलता है जब **Antigravity** चल रहा हो।

**OpenCode** का अपना कोई शेड्यूलर नहीं है, इसलिए ऑडिट क्लाउड में **GitHub Actions** से चलता है:

- रिपॉज़िटरी की `opencode.json` फ़ाइल में **Lagune** को कमिट करें, जैसा [इंस्टॉल पेज](https://lagune.ai/hi-IN/docs/install/opencode) में दिखाया गया है।
- `opencode github install` चलाकर **OpenCode** GitHub ऐप जोड़ें और अपने मॉडल प्रोवाइडर की कुंजी सेव करें।
- एक वर्कफ़्लो जोड़ें जो शेड्यूल के हिसाब से प्रॉम्प्ट **OpenCode** तक पहुँचाए, यहाँ हर सोमवार 09:00 UTC पर। `<KEY>` और `<provider>/<model>` को वैसे ही भरें जैसे वे उस वर्कफ़्लो में हैं जो `opencode github install` ने बनाया, और `<your-prompt>` की जगह [प्रॉम्प्ट के उदाहरणों](#prompt-examples) में से कोई एक लिखें:

  ```yaml
  name: Lagune Audit

  on:
    schedule:
      - cron: '0 9 * * 1'

  jobs:
    audit:
      runs-on: ubuntu-latest
      permissions:
        id-token: write
        contents: read
      steps:
        - uses: actions/checkout@v6
          with:
            persist-credentials: false

        - uses: anomalyco/opencode/github@latest
          env:
            <KEY>: ${{ secrets.<KEY> }}
          with:
            model: <provider>/<model>
            prompt: |
              <your-prompt>
  ```

### प्रॉम्प्ट के उदाहरण \{#prompt-examples}

**💧 सिर्फ़ रिपोर्ट**

आपका कोड बदले बिना, नए जोखिम पहचानता है, उनके सुधारों की योजना बनाता है, और पहले से लागू नियंत्रणों को दोबारा जाँचता है:

```md
ये कमांड एक-एक करके चलाओ: `/lagune-detect` और `/lagune-plan`। अगर प्रोजेक्ट में हार्डनिंग रिकॉर्ड है, तो `/lagune-verify` भी चलाओ।

प्रोजेक्ट का कोड मत बदलना। आख़िर में, नए निष्कर्षों का और ऐसे हर लागू नियंत्रण का सार दो जो अब कारगर नहीं रहा।
```

**🌊 पूरा चक्र**

यह योजना में दिए सुधार भी लागू करता है और साबित करता है कि हर सुधार कारगर है, इसलिए इसके बदलावों को अपनी मुख्य ब्रांच तक पहुँचने से पहले जाँच लें:

```md
ये कमांड एक-एक करके चलाओ: `/lagune-detect`, `/lagune-plan`, `/lagune-harden` और `/lagune-verify`।

आख़िर में, लागू किए गए सुधारों और अब भी खुले निष्कर्षों का सार दो।
```
