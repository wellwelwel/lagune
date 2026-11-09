# /lagune-repair: Reparer ødelagt sporing av funn

> Reparer kjeden når et nytt filnavn eller en flyttet fil forvirrer sporingen i Lagune.

Kanonisk URL: https://lagune.ai/no-NO/docs/commands/repair
Språk: no-NO
Original: https://lagune.ai/docs/commands/repair
Sist oppdatert: 2026-11-09

🧰 Reparer kjeden når et nytt filnavn eller en flyttet fil forvirrer den.

**Internt vedlikehold, ikke en sikkerhetsfase**

Repair er ikke en sjette fase i den lineære flyten. Jobben er å holde sporingen sammenhengende.

```prompt
# Kommandoen tar ingen inndata: Den reparerer alltid hele kjeden
/lagune-repair
```

## Slik fungerer det

Hvert funn fra detect er ett sporet element som plan, harden og verify tar videre, og hver av dem behandler det og rapporterer det på nytt under navnet. Dette navnet, skrevet likt som seksjonstittel i hver artefakt, er identiteten til elementet hele veien.

Det eneste foranderlige sporingen lagrer, er filstiene elementet peker på. Disse stiene finnes ingen andre steder, så et nytt filnavn eller en flyttet fil kan bare bryte koblingen der, aldri i to kopier som glir fra hverandre. Når det skjer, retter repair kartet (`.lagune/tracking.json`), slik at identiteten overlever navneendringen. Kommandoen leser artefaktene og sporingskartet, leser kildekoden din bare for å finne den nye stien til en fil som har fått nytt navn, og skriver aldri sikkerhetsinnhold selv.

I samme gjennomgang sjekker den hver minneartefakt mot malen og rapporterer hva som har drevet av, med henvisning til fasen som retter det.

**Tips**

- Den rører verken koden din eller tekstartefaktene, bare sporingen.
- Du kjører den sjelden for hånd. Når en fase merker at kjeden er inkonsekvent, kjører den repair for deg og fortsetter.
- Sporingen den vedlikeholder, ligger i `.lagune/tracking.json`, en intern tilstand du aldri redigerer for hånd.
