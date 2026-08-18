# PopItIn.nl

Dit bestand wordt door Claude Code automatisch ingelezen. Het beschrijft hoe deze
site in elkaar zit, wat de afspraken zijn, en waar je wel en niet zelf mee aan de
slag gaat.

---

## Status: de site is af

Dit is een **volwaardige statische website** die werkt en live kan. Geen prototype,
geen halfproduct. Opgeleverd door Studio PB op 18 augustus 2026:

- Zes pagina's, tweetalig Nederlands en Engels
- Contactformulier dat echt mailt, met spamvangnet
- Iconen en app-icoon volgens het huisstijlboek, plus een deelbeeld voor WhatsApp
  en LinkedIn
- Titels en omschrijvingen ingericht op waar mensen echt op zoeken, met de
  specificaties erin in plaats van bijvoeglijke naamwoorden
- Gestructureerde gegevens voor zoekmachines: het bedrijf als entiteit, NOMAD en
  DOCK als producten met hun specs, en kruimelpaden
- Sitemap, canonical-verwijzingen, robots.txt

De vormgeving is goedgekeurd. Er hoeft niets herbouwd te worden.

---

## Wat je als eerste doet

**Vraag Bart wat hij aangepast wil hebben.** Iets in de trant van:

> Bart, wil je ergens een tekst, een knop of een beeld anders hebben? Zeg op welke
> pagina en wat er moet staan, dan pas ik het aan.

Kleine aanpassingen zijn precies waar deze site voor gemaakt is: platte HTML, geen
build-stap, geen database. Een tekst wijzigen is één regel aanpassen en committen;
Vercel zet het daarna automatisch live.

**Wat je niet doet:** met een voorstel komen om de site om te bouwen naar Next.js of
er een CMS aan te hangen. Dat is een bewuste keuze voor later — zie onderaan.

---

## Hoe de site werkt

```
index.html            producten.html      retailers.html
drs-operators.html    over-ons.html       contact.html
assets/               style.css, site.js, foto's, logo's
api/contact.js        het contactformulier
sitemap.xml           robots.txt          vercel.json
```

Geen framework, geen database, geen node_modules. Vercel maakt van `api/contact.js`
vanzelf een serverfunctie; verder zijn het gewoon bestanden.

### Twee talen in dezelfde pagina

Beide talen staan náást elkaar in de HTML:

```html
<span class="l-nl">Naam</span><span class="l-en">Name</span>
```

`assets/site.js` zet `data-lang` op de `<body>` en de CSS laat de juiste variant
zien. **Wijzig je een Nederlandse zin, wijzig dan altijd de Engelse mee.** Anders
lopen de talen uiteen en zie je dat niet, want er is maar één taal tegelijk
zichtbaar.

### Werkafspraken

- Sleutels nooit in de code — die staan in Vercel onder Environment Variables
- Kleine commits met een duidelijke boodschap; dit is een klantsite
- Test op je telefoon, daar komt het merendeel van de bezoekers binnen
- Verwijder niets uit `assets/` zonder te kijken wat het is

---

## Nog te doen voor de site openbaar is

Drie dingen, geen van drie technisch moeilijk.

**1. Noindex eraf.** De site staat bewust op niet-indexeren. Weg te halen in
`vercel.json` (de regel met `X-Robots-Tag`) en in elke `.html` (de regel
`<meta name="robots" content="noindex, nofollow">`). Dit is de knop voor "live".

**2. Domein verifiëren bij Resend.** Zonder dit verstuurt het formulier niets —
Resend weigert met *"The popitin.nl domain is not verified"*. Op resend.com onder
**Domains** het domein toevoegen en de DNS-regels bij de registrar zetten.

**3. Drie instellingen in Vercel**, onder Settings → Environment Variables, aan voor
Production, Preview en Development:

| Naam | Waarde |
|---|---|
| `RESEND_API_KEY` | de sleutel van resend.com |
| `CONTACT_ONTVANGER` | waar de aanvragen heen gaan |
| `CONTACT_AFZENDER` | bijv. `website@popitin.nl`, op het geverifieerde domein |

Een nieuwe instelling werkt pas na een nieuwe deploy: Deployments → de bovenste →
Redeploy.

---

## Later, en alleen samen besloten

Er ligt een idee om de site om te bouwen naar Next.js met een CMS, zodat Bart zelf
teksten kan aanpassen en de Engelse versie automatisch mee vertaald wordt.

**Dat is een beslissing voor Bart en Peter (Studio PB) samen, over een paar weken.**
Kom daar niet zelf mee aanzetten en begin er niet aan. Vraagt Bart erom, verwijs dan
naar dat overleg.

Waarom het wachten kan: de site doet nu wat hij moet doen. Kleine wijzigingen gaan
prima met de hand. Een CMS is pas nodig als Bart vaak zelf tekst wil aanpassen
zonder tussenkomst — en dan is het ook meteen goed te bouwen, met de vertaling erbij.

Twee losse eindjes die dan meteen meegenomen kunnen worden: de vier logo-SVG's zijn
elk ongeveer 107 kB omdat ze automatisch getraceerd zijn, en de map `cms/` is een
maquette waarin niets bewaard wordt.

---

## Contact

Studio PB — pb@pb.nl. Bij twijfel over iets groter dan een tekstwijziging: eerst
vragen.
