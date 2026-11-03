# jwt hook'u: algoritması sabitlenmemiş JWT doğrulamasını tespit edin

> Kod tabanını algoritması sabitlenmemiş JWT doğrulamasına karşı tarayın ya da tek bir çağrıyı doğrudan komut satırından puanlayın.

Kanonik URL: https://lagune.ai/tr-TR/docs/hooks/jwt
Dil: tr-TR
Orijinal: https://lagune.ai/docs/hooks/jwt
Son güncelleme: 2026-11-03

`jwt` hook'u, **algoritması sabitlenmemiş JWT doğrulamasını**, yani doğrulayıcının token'ın kendi `alg` başlığına güvendiği algoritma karışıklığı açığını ve **tamamen kapatılmış doğrulamayı** işaretler. **Dile duyarlıdır**, her dosyayı kullandığı JWT kütüphanesine göre okur. [`federation` uzmanlığının](https://lagune.ai/tr-TR/docs/catalog) arkasındaki deterministik motordur ve onu **scan** veya **check** modunda kendiniz çalıştırabilirsiniz.

## Çalıştırma

**Kod tabanını tara**

```bash
npx lagune read jwt                # scans the whole project
npx lagune read jwt --dir src      # scans a directory
npx lagune read jwt --file auth.ts # scans a single file
```

**Bir çağrıyı kontrol et**

```bash
npx lagune read jwt --lang javascript --pattern 'jwt.verify(token, secret)'                         # => unpinned
npx lagune read jwt --lang python --pattern 'jwt.decode(t, k, options={"verify_signature": False})' # => unpinned
npx lagune read jwt --lang python --pattern 'jwt.decode(t, k, algorithms=["HS256"])'                # => safe
```

**Unpinned JWT verification found** altındaki her satır, `algorithms` izin listesi belirlemeyen (kütüphanenin buna ihtiyaç duyduğu yerde), güvensiz bir liste kabul eden (`none` ya da HMAC ile karıştırılmış asimetrik bir algoritma) veya imza kontrolünü tamamen devre dışı bırakan bir doğrulama çağrısıdır, dolayısıyla token'ın kendi `alg` değerine güvenir. Bu doğrulanmış bir açıklık olduğundan hook sıfırdan farklı bir kodla çıkar. Temiz bir çalıştırma `no unpinned JWT verification found` çıktısını verir.

## Kararı nasıl okumalı

| Karar      | Anlamı                                                                                                                            |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `unpinned` | Algoritma izin listesi olmayan (gerektiği yerde), güvensiz bir liste kullanan ya da doğrulaması kapatılmış bir doğrulama çağrısı. |
| `safe`     | Sağlam bir algoritma izin listesini sabitleyen ya da kütüphanesi bunu örtük olarak sabitleyen bir doğrulama çağrısı.              |
| `invalid`  | Kod parçası, değerlendirilebilecek tanınır bir doğrulama çağrısı içermiyor.                                                       |

### CLI seçenekleri

| Seçenek     | Değer           | Açıklama                                                                                                    |
| ----------- | --------------- | ----------------------------------------------------------------------------------------------------------- |
| `--pattern` | bir kod parçası | Tek bir çağrıyı kontrol eder. Birkaçını kontrol etmek için tekrarlayın, her satıra bir karar düşer.         |
| `--lang`    | bir dil         | `--pattern` ile zorunludur: javascript, python, go, java, kotlin, php, ruby, rust, csharp dillerinden biri. |
| `--dir`     | bir dizin       | Taramayı bir dizinle sınırlar. Tekrarlanabilir ve `--file` ile birleştirilebilir.                           |
| `--file`    | bir dosya       | Taramayı tek bir dosyayla sınırlar. Tekrarlanabilir ve `--dir` ile birleştirilebilir.                       |

Seçenek verilmezse tüm proje taranır. `--pattern`, `--lang` gerektirir ve `--dir` ya da `--file` ile birleştirilemez.

### Desteklenen diller

Tarama bu kütüphaneleri dosya uzantısına göre tanıyarak okur. Bazıları algoritmayı örtük olarak sabitlediğinden (açık bir listenin olmaması orada sağlamdır), "izin listesi yok ⇒ unpinned" kuralı yalnızca kütüphanenin açık bir liste beklediği yerde uygulanır, böylece doğru yapılandırılmış bir çağrı asla işaretlenmez.

| Dil                         | Kütüphane               | İzin listesinin yokluğunu unpinned olarak işaretler mi?                                   | Her zaman işaretler                                    |
| --------------------------- | ----------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **JavaScript / TypeScript** | jsonwebtoken, jose      | Evet                                                                                      | `none`, asimetrik algoritmanın HMAC ile karıştırılması |
| **Python**                  | PyJWT, python-jose      | Evet (PyJWT bunu zorunlu tutar, python-jose varsayılan olarak `algorithms=None` kullanır) | `none`, `verify_signature: False`                      |
| **Go**                      | golang-jwt              | Evet (`WithValidMethods` yoksa)                                                           | `none`, `ParseUnverified`                              |
| **Ruby**                    | ruby-jwt                | Evet                                                                                      | `none`, `verify = false`                               |
| **Java / Kotlin**           | jjwt, nimbus            | Hayır (anahtardan türetilir)                                                              | `none`, imzasız ya da `unsecured` bir ayrıştırıcı      |
| **PHP**                     | firebase/php-jwt        | Hayır (algoritmayı `Key` taşır)                                                           | `none`                                                 |
| **Rust**                    | jsonwebtoken            | Hayır (`Validation` bunu zorunlu tutar)                                                   | `none`, `insecure_disable_signature_validation`        |
| **C#**                      | Microsoft.IdentityModel | Hayır (çok satırlı parametreler)                                                          | `none`, `RequireSignedTokens = false`                  |

**İpucu**

Hook yalnızca algoritmanın sabitlenmesine karar verir: claim, anahtar ve akış kontrolleri, değerlendirme gerektiren konulardır ve onları [`federation` uzmanlığı](https://lagune.ai/tr-TR/docs/catalog) kapsamaya devam eder.

## Sıkça sorulan sorular

### JWT algoritma karışıklığı nedir?

Algoritmayı token başlığından okuyan bir doğrulayıcı, saldırganın RS256'yı HS256 ile değiştirip açık anahtarla imzalamasına izin verir. Kodda sağlam bir algoritma izin listesini sabitlemek bunu önler. jwt hook'u ise hiç izin listesi belirlemeyen ya da güvensiz bir liste belirleyen bir doğrulama çağrısını işaretler.
