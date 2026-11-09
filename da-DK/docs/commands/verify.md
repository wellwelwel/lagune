# /lagune-verify: Påvis, at sikkerhedskontrollerne holder

> Påvis, at hver gennemført rettelse holder, og afslut derefter dem, der gør.

Kanonisk URL: https://lagune.ai/da-DK/docs/commands/verify
Sprog: da-DK
Original: https://lagune.ai/docs/commands/verify
Sidst opdateret: 2026-11-09

⚖️ Påvis, at hver gennemført rettelse holder, ved at læse koden og holde den op mod det, harden registrerede, og afslut derefter dem, der gør.

## Brug

**Verificér alt**

```prompt
/lagune-verify
```

**Angiv stier**

```prompt
/lagune-verify src/routes/upload.ts
```

**Efter prioritet**

```prompt
/lagune-verify Critical og High
```

## Sådan virker det

Den læser koden på hvert sted, harden registrerede, og bekræfter, at den virkelig svarer til påstanden. Beviset er netop den konfrontation, koden op mod loggen. Hver kontrol får én af tre afgørelser:

| Afgørelse                    | Betydning                                                        |
| ---------------------------- | ---------------------------------------------------------------- |
| ✅ Risk closed               | Koden gør præcis det, loggen påstår.                             |
| ❌ Risk not closed           | Kontrollen er stadig åben. Verify sender dig tilbage til harden. |
| ❓ Cannot tell from the code | Belægget kan ikke ses i koden alene.                             |

En risiko, der er påvist lukket, bliver derefter taget ud af kæden, med din bekræftelse. For eksempel:

- **Filupload** (afgørelse: **✅ Risk closed**)
  - _Sådan blev det påvist:_ læste upload-handleren og så, at den bestemmer filens reelle type ud fra indholdet, håndhæver en størrelsesgrænse og afviser alt andet, præcis som loggen påstår.
  - _Belæg:_ funktionen `handleUpload`, som bestemmer den reelle filtype ud fra indholdet.

Hvis risikoen ikke er lukket, siger verify det ligeud og sender dig tilbage til [`/lagune-harden`](https://lagune.ai/da-DK/docs/commands/harden), da rettelsen stadig er åben.

**Tip**

- Den bygger udelukkende på hærdningsloggen.
- Den læser kun din kode for at vurdere den og svækker aldrig en kontrol eller omskriver koden for at få en afgørelse igennem.
- Når du kører den igen, bliver afgørelserne afstemt: forældede afgørelser forsvinder, og en risiko, der ikke længere er lukket, bliver markeret igen.
- Når en risiko er påvist lukket, spørger den én gang og fjerner derefter fundet fra hele kæden (detect, plan, harden og sporingen).
- Den skriver ingen rapport af sin egen: hver afgørelse står i blokken for sin kontrol i `.lagune/memory/harden.md`, hvor harden læser den ved næste kørsel.

**Afhænger af harden**

Verify bygger på [`/lagune-harden`](https://lagune.ai/da-DK/docs/commands/harden).

## Cyklussen afsluttes

Når alt inden for omfanget er taget ud, er cyklussen i hvile. Den åbner kun igen, når koden ændrer sig. Sikkerhed kan afsluttes, så workflowet har en sluttilstand, ikke en endeløs løkke.

## Ofte stillede spørgsmål

### Hvordan verificerer Lagune en rettelse?

/lagune-verify læser koden og holder den op mod det, harden registrerede, og giver én af tre afgørelser: Risk closed, Risk not closed eller Cannot tell from the code.

### Hvad vil det sige at tage et fund ud?

Når verify påviser, at en risiko er lukket, bliver fundet taget ud: fjernet fra hele kæden, med din bekræftelse, så det ikke længere bliver behandlet igen.

### Kan sikkerhedsarbejde nogensinde blive færdigt?

Ja. SDH kan afsluttes: et fund, der er påvist lukket, bliver taget ud, så workflowet har en sluttilstand, ikke en endeløs løkke.
