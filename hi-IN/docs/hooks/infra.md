# infra हुक: IaC की ग़लत कॉन्फ़िगरेशन पकड़ें

> कमांड लाइन से Terraform, Dockerfile और GitHub Actions में ग़लत कॉन्फ़िगरेशन खोजें, या कोड के किसी एक टुकड़े को स्कोर दें।

कैनोनिकल: https://lagune.ai/hi-IN/docs/hooks/infra
भाषा: hi-IN
मूल: https://lagune.ai/docs/hooks/infra
आख़िरी अपडेट: 2026-11-06

`infra` हुक **इंफ़्रास्ट्रक्चर-ऐज़-कोड की ऐसी ग़लत कॉन्फ़िगरेशन** पकड़ता है जो फ़ाइल को देखकर ही तय की जा सकती है: पूरी दुनिया के लिए खुला नेटवर्क, वाइल्डकार्ड परमिशन, मैनिफ़ेस्ट में रखा सीक्रेट, root के रूप में चलने वाला कंटेनर, CI शेल में पहुँचने वाली अविश्वसनीय वैल्यू। यह सिर्फ़ IaC फ़ाइलें पढ़ता है (`.tf`/`.tf.json`/`.hcl`, `Dockerfile*`, `.github/workflows/**`)। यह [`infra` विशेषज्ञता](https://lagune.ai/hi-IN/docs/catalog) के पीछे का नियतात्मक इंजन है, जो **scan** या **check** मोड में चलता है।

## चलाएँ

**कोडबेस स्कैन करें**

```bash
npx lagune read infra                   # scans every IaC file
npx lagune read infra --dir infra       # scans a directory
npx lagune read infra --file Dockerfile # scans a single file
```

**कोड का टुकड़ा जाँचें**

कोड का टुकड़ा `--pattern` के साथ दें और उसका प्रकार `--kind` के साथ (`terraform`, `dockerfile` या `github-actions`)।

```bash
npx lagune read infra --kind terraform  --pattern 'actions = ["*"]' # => iam-wildcard
npx lagune read infra --kind dockerfile --pattern 'FROM node:20'    # => mutable-tag
```

स्कैन ज़्यादा से ज़्यादा दो सेक्शन छापता है। **Infrastructure risks found** नॉन-ज़ीरो एग्ज़िट कोड देता है और उसमें वे ख़ामियाँ होती हैं जो फ़ाइल से तय की जा सकती हैं (किसी संवेदनशील पोर्ट पर `0.0.0.0/0` इनग्रेस, वाइल्डकार्ड IAM स्टेटमेंट, मैनिफ़ेस्ट में रखा सीक्रेट, `encrypted = false`, बिना पिन किया गया git मॉड्यूल, साफ़ तौर पर root के रूप में चलने वाली इमेज, `curl | sh`, CI स्क्रिप्ट इंजेक्शन, `permissions: write-all`)। **Infrastructure hardening advisories** एग्ज़िट कोड नहीं बदलता (बदल सकने वाला बेस टैग, टैग से पिन किया गया action)। कुछ न मिलने पर यह `no infrastructure risks found` छापता है।

## फ़ैसला कैसे पढ़ें

check मोड मेल खाने वाले टैग में से सबसे ज़्यादा गंभीरता वाला टैग छापता है (जैसे `public-ingress`, `iam-wildcard`, `root-user`, `curl-pipe`, `script-injection`, `write-all`), या कोई एडवाइज़री टैग (`mutable-tag`, `unpinned-action`), या `safe`। सिर्फ़ निष्कर्ष के स्तर की गंभीरता वाले टैग पर ही हुक नॉन-ज़ीरो एग्ज़िट कोड देता है।

### CLI विकल्प

| विकल्प      | वैल्यू                                          | विवरण                                                                                             |
| ----------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `--pattern` | कोड का टुकड़ा                                   | कोड का एक टुकड़ा जाँचें। इसके साथ `--kind` ज़रूरी है। कई के लिए इसे दोहराएँ।                      |
| `--kind`    | `terraform` \| `dockerfile` \| `github-actions` | कोड के टुकड़े को किस प्रकार के रूप में आँका जाए।                                                  |
| `--dir`     | एक डायरेक्टरी                                   | स्कैन को एक डायरेक्टरी तक सीमित करें। इसे दोहराया जा सकता है और `--file` के साथ जोड़ा जा सकता है। |
| `--file`    | एक फ़ाइल                                        | स्कैन को एक फ़ाइल तक सीमित करें। इसे दोहराया जा सकता है और `--dir` के साथ जोड़ा जा सकता है।       |

कोई विकल्प न देने पर यह प्रोजेक्ट की हर IaC फ़ाइल स्कैन करता है। `--pattern` को `--dir` या `--file` के साथ नहीं जोड़ा जा सकता।

### चुनें कि यह क्या स्कैन करे

यह उन चीज़ों को छोड़ देता है जिन्हें **Git** अनदेखा करता है। और ज़्यादा छोड़ने के लिए, या **Git** की अनदेखी चीज़ों को भी स्कैन करने के लिए, `infra` को उसकी अपनी सेटिंग्स दें:

```bash
npx lagune write add --ignore examples --checker infra
```

```json
{
  "checkers": {
    "infra": { "gitignore": false, "ignore": ["examples"] }
  }
}
```

हर सेटिंग की जानकारी [हुक कॉन्फ़िगर करें](https://lagune.ai/hi-IN/docs/hooks/configure) पेज पर है।

**टिप**

हुक सीधे और तय किए जा सकने वाले मामले पकड़ता है: एन्क्रिप्शन का न होना, `pull_request_target` से होने वाला एक्सपोज़र और सही IAM दायरा ऐसे मामले हैं जिनमें विवेक चाहिए, और उन्हें अब भी [`infra` विशेषज्ञता](https://lagune.ai/hi-IN/docs/catalog) कवर करती है।

## अक्सर पूछे जाने वाले सवाल

### infra हुक कौन-सी इंफ़्रास्ट्रक्चर फ़ाइलें पढ़ता है?

Terraform/HCL (.tf, .tf.json, .hcl), Dockerfile, और .github/ के अंदर GitHub Actions की वर्कफ़्लो और action YAML फ़ाइलें। सोर्स स्कैनर इन फ़ाइलों को छोड़ देते हैं, फिर भी यह हुक इन तक पहुँचता है।
