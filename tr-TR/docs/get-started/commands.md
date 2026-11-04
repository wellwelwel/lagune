# Yapay zeka ajanları için güvenlik becerileri

> Yapay zeka ajanınızın Lagune ile kazandığı beceriler: mevcut bir projeyi denetleyin ya da yeni işi geliştirirken güvenli hale getirin, hepsi charter'ın yönetiminde.

Kanonik URL: https://lagune.ai/tr-TR/docs/get-started/commands
Dil: tr-TR
Orijinal: https://lagune.ai/docs/get-started/commands
Son güncelleme: 2026-11-04

**Lagune** [kurulduktan](https://lagune.ai/tr-TR/docs) sonra **yapay zeka** ajanınız bir dizi beceri kazanır. Bunları kullanmanın iki yolu vardır ve ikisi de **charter**'ın yönetimindedir: yeni işi geliştirirken güvenli hale getirmek ya da bir proje üzerinde tam denetimi çalıştırmak.

**⌨️ Oluşturma ve geliştirme**

İşinizi güvenli hale getirmeden önce bitirmeniz gerekmez. **Şu anda** yazdığınız iş için [**`/lagune`**](https://lagune.ai/tr-TR/docs/commands/lagune) komutunu kullanın:

| Beceri                                        | Sizin için ne yapar                                                                        |
| --------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [**/lagune-charter**](https://lagune.ai/tr-TR/docs/commands/charter) | Projenizin güvenlik kurallarını belirler, `/lagune` komutunun üzerine inşa ettiği temeldir |
| [**/lagune**](https://lagune.ai/tr-TR/docs/commands/lagune)          | İstediğinizi geliştirir ve charter'ın rehberliğinde, yazılırken sıkılaştırır               |

**İstediğiniz zaman kullanın**

[**`/lagune`**](https://lagune.ai/tr-TR/docs/commands/lagune) komutu, her çalıştığında charter kurallarınıza uyar. Her prompt'u kabul eder, istediğinizi geliştirir ve sonra değil, ilerledikçe güvenli varsayılanlarla sıkılaştırır.

---

#### Özel beceriler

| Beceri                                              | Ne yapar                                                                                        |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/tr-TR/docs/commands/specialize) | Makalelerden, exploit'lerden ya da konulardan **Lagune**'ye yeni bir güvenlik uzmanlığı öğretir |

**🔬 Denetim: Blue Team akışı**

Tam **Blue Team akışı**: bir projenin ne yaptığını okuyun, risklerini çıkarın ve onları kapatın. Her adım bir öncekinin üzerine kurulur, bu yüzden listeyi yukarıdan aşağıya izlemeniz yeterlidir:

| #   | Beceri                                        | Sizin için ne yapar                                                                                   |
| --- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1   | [**/lagune-charter**](https://lagune.ai/tr-TR/docs/commands/charter) | Projenizin güvenlik kurallarını belirler, sizin için önerir ya da söylediklerinize göre şekillendirir |
| 2   | [**/lagune-detect**](https://lagune.ai/tr-TR/docs/commands/detect)   | Kodunuzu okur, sisteminizin ne yaptığını ve risklerin nerede olduğunu çıkarır                         |
| 3   | [**/lagune-plan**](https://lagune.ai/tr-TR/docs/commands/plan)       | detect fazının bulduklarını, her bulgu için bir düzeltme içeren bir savunma planına çevirir           |
| 4   | [**/lagune-harden**](https://lagune.ai/tr-TR/docs/commands/harden)   | Planın düzeltmelerini kodunuza güvenli bir şekilde ve tek tek uygular                                 |
| 5   | [**/lagune-verify**](https://lagune.ai/tr-TR/docs/commands/verify)   | Uygulanan her düzeltmenin işe yaradığını kanıtlar ve yarayanları kapatır                              |

---

#### Özel beceriler

| Beceri                                              | Ne yapar                                                                                                    |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/tr-TR/docs/commands/specialize) | Makalelerden, exploit'lerden ya da konulardan **Lagune**'ye yeni bir güvenlik uzmanlığı öğretir             |
| [**/lagune-prove**](https://lagune.ai/tr-TR/docs/commands/prove)           | Tespit edilen her bulguyu, sorumlu ifşa için çalıştırılabilir ve yalnızca savunma odaklı bir ispata çevirir |

---

#### Dahili beceriler

| Beceri                                      | Ne yapar                              |
| ------------------------------------------- | ------------------------------------- |
| [**/lagune-repair**](https://lagune.ai/tr-TR/docs/commands/repair) | **Lagune**'nin dahili takibini onarır |

**İpucu**

Güvenlik bir maliyet değil, bir yatırımdır: en başta koyduğunuzu, hiç yaşamadığınız olaylarda kat kat geri kazanırsınız 🙋🏻‍♂️

## Sıkça sorulan sorular

### Lagune hangi becerileri ekler?

İşi geliştirirken sıkılaştırmak için /lagune ve beş fazlı Blue Team denetim akışı: /lagune-charter, /lagune-detect, /lagune-plan, /lagune-harden, /lagune-verify. Bunlara ek olarak /lagune-specialize ve /lagune-prove.

### Lagune Blue Team akışı nedir?

Beş fazlı bir denetim: charter (kuralları belirler), detect (riskleri çıkarır), plan (puanlar ve düzeltmeleri planlar), harden (düzeltmeleri uygular), verify (işe yaradıklarını kanıtlar ve onları kapatır).

### /lagune ile denetim akışı arasındaki fark nedir?

/lagune yeni işi siz yazarken, izlenecek bir akış olmadan güvenli hale getirir. Denetim akışı ise beş fazı mevcut bir proje üzerinde sırayla çalıştırır.
