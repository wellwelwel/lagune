# Factory Droid için Lagune eklentisi kurulumu

> Lagune'yi Factory Droid için eklenti olarak kurun, güncel tutun ve motorunun araçlarına izin verin.

Kanonik URL: https://lagune.ai/tr-TR/docs/install/factory-droid
Dil: tr-TR
Orijinal: https://lagune.ai/docs/install/factory-droid
Son güncelleme: 2026-11-05

Eklentiyi terminalden kurun:

```bash
droid plugin marketplace add wellwelwel/lagune
droid plugin install lagune@lagune
```

## Güncelleme

**Lagune**'yi güncellemek için şunu çalıştırın:

```bash
droid plugin marketplace update lagune
droid plugin update lagune@lagune
```

## Komutlar

Komutları adlarıyla yazın, örneğin `/lagune-charter`.

---

**İzinler**

Motor iki araçla çalışır: `lagune_read` yalnızca projenizi okur, `lagune_write` ise yalnızca `.lagune/` klasörüne yazar. **Factory Droid** sorduğunda her biri için her zaman izin vermeyi seçin. `lagune` pazar yerinin yeni bir commit'ini eşitledikten sonra (bunu açılışta yapabilir) yeniden sorar.

## Sıkça sorulan sorular

### Factory Droid için Lagune nasıl kurulur?

droid plugin marketplace add wellwelwel/lagune ve ardından droid plugin install lagune@lagune komutlarını çalıştırın.

### Factory Droid kullanırken Lagune nasıl güncellenir?

droid plugin marketplace update lagune ve ardından droid plugin update lagune@lagune komutlarını çalıştırın.

### Factory Droid kullanırken Lagune komutları nasıl çalıştırılır?

Adlarıyla yazın, örneğin /lagune-charter.

### Factory Droid, Lagune'yi izin istemeden çalıştırabilir mi?

Evet. Factory Droid sorduğunda lagune_read ve lagune_write için her zaman izin vermeyi seçin. lagune pazar yerinin yeni bir commit'ini eşitledikten sonra yeniden sorar.
