# 📦 SomBox
**SomBox** is een moderne visualisatie-tool die jouw SomToday-data omzet in een prachtig, begrijpelijk dashboard. Geen saaie lijsten meer, maar direct inzicht in je voortgang.

Ontwikkeld door: Deze volledige applicatie, de scraping-logica en de browser-extensie zijn ontwikkeld door **Gemini** (Google AI) in nauwe samenwerking met de maker: [Sn0wwFox](https://github.com/Sn0wwFox). Alle bestanden zijn **openbaar** beschikbaar op deze GitHub repository.


# 🛡️ Privacy & Veiligheid (Prioriteit #1)
**Privacy** is de kern van SomBox. Veel leerlingen-apps sturen data naar externe servers; SomBox doet dit **niet**.

•  Geen Database: SomBox heeft geen backend of database. Jouw cijfers worden **nooit** opgeslagen op een server.

•  Lokale Opslag: Alle data die je importeert, wordt opgeslagen in de **localStorage** van jouw eigen browser. Alleen jij kunt het zien.

•  Open Source: De code is **100% openbaar**. Iedereen kan controleren dat er geen data wordt doorgestuurd.

•  Geen Login nodig: Je hoeft je SomToday-wachtwoord **nooit** in te vullen op de SomBox-site zelf.

•  Geen onnodige data: **alleen** je cijfer en de datum van je 15 meest recente cijfers worden omgezet in een code.


# 🛠️ Hoe krijg je jouw data in SomBox?
Er zijn **drie** manieren om je cijfers te importeren. Beide maken gebruik van dezelfde "onderhuidsche" logica, maar de ervaring verschilt:

### Optie A: De SomBox Extensie (Aanbevolen)
De extensie is de meest gebruiksvriendelijke manier. Het integreert een fysieke knop direct in de SomToday-interface.

1.  **Installatie**: Download de extension map van deze GitHub. Ga naar chrome://extensions/, zet 'Ontwikkelaarsmodus' aan en klik op 'Uitgepakt laden'. Selecteer de map.

2.  **Gebruik**: Zodra je inlogt op SomToday, zie je rechtsonderin het scherm een paarse knop: 📦.

Actie: Klik op de knop. De extensie klikt automatisch op 'Cijfers', scant de data en geeft je direct de import-code.

### Optie B: De Console-methode
Geen installatie nodig, maar je moet wel handmatig code plakken.

1.  Ga naar SomToday en druk op F12 (of rechtermuisknop -> Inspecteren).

2.  Ga naar het tabblad Console.

3.  Plak de volgende code en druk op Enter:

```
(async () => {
    const tab = [...document.querySelectorAll('sl-tab-item')].find(t => t.innerText.includes('Cijfers'));
    if (!tab) return alert("Cijferknop niet gevonden!");

    const b = document.body.appendChild(document.createElement('div'));
    b.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:9e9;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#00f2ff;font-family:sans-serif;";
    b.innerHTML = `<img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTZqdWV0N2thcXpzOG5xMmxsZjEzYmRrMW42ZWU3amlueGZ1cnltdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/um2kBnfo55iW4ZH1Fa/giphy.gif" style="width:200px"><h1>SomBox Scant...</h1>`;

    tab.click();

    setTimeout(() => {
        const res = [...document.querySelectorAll('sl-laatste-resultaat-item')].map(item => {
            const d = item.querySelector('div[role="text"]')?.getAttribute('aria-label').split(',') || [];
            return {
                v: d[0]?.trim() || "",
                c: (d[1] && d[2]) ? d[1].trim() + "," + d[2].trim() : "",
                d: d[3]?.split('•')[0].trim() || ""
            };
        });

        if (res.length) {
            prompt("Kopieer deze code naar SomBox:", btoa(unescape(encodeURIComponent(JSON.stringify(res)))));
        } else {
            alert("Scan mislukt. Zorg dat je op een pagina bent waar cijfers zichtbaar zijn.");
        }
        window.location.href = '/rooster';
    }, 1000);`
})();
```
### Optie C: Handmatig invullen
Wil je liever geen scripts draaien? Geen probleem.

Ga in het SomBox-dashboard naar Handmatige Invoer.

Voeg zelf je vakken en cijfers toe. Dit duurt iets langer, maar geeft je volledige controle over wat er in je grafieken verschijnt.

# 🔍 Stap-voor-stap: Hoe werkt het precies?
Hieronder leggen we uit wat er gebeurt tijdens het proces, zowel voor de gebruiker als in de code.

## Het Scraper-proces (De Data Ophalen)
**Jij** bent de brug tussen SomToday en SomBox, de "Scraper" haalt alleen je meest recente cijfers met vak en datum uit de visuele elementen van somtoday. Of je nu de extensie gebruikt of de console-code, het proces is hetzelfde:

Wat de **gebruiker** ziet:

Je klikt op de knop of voert de code uit.

Het scherm wordt direct zwart met een SomBox-logo en een Gif ([de "Blocker"](https://github.com/Sn0wwFox/SomBox/edit/Sn0wwFox-1/README.md#%EF%B8%8F-waarom-die-blocker)).

Na ongeveer een seconde verschijnt er een pop-up (prompt) met een lange reeks willekeurige tekens of als je de extensie gebruikt wordt het gelijk automatisch gekopieert.

Nadat je op 'OK' klikt, word je automatisch teruggestuurd naar je rooster.

Wat er op de **achtergrond** gebeurt:

Blocker: Het script plaatst het zwarte wachtscherm over alles heen. Bij [🛡️ Waarom die "Blocker"?](https://github.com/Sn0wwFox/SomBox/edit/Sn0wwFox-1/README.md#%EF%B8%8F-waarom-die-blocker) wordt uitgelegd waarom dit nodig is.

Activatie: Het script zoekt in de wirwar van SomToday-elementen (de Shadow DOM) naar de knop waar "Cijfers" op staat en geeft daar een virtuele 'klik' op.

Data Extractie: Zodra de cijferpagina opent, scant het script alle sl-laatste-resultaat-item elementen. Het leest de aria-label uit, waar SomToday de cijfers, vaknamen en data verstopt voor schermlezers.

Transformatie: De ruwe tekst ("Wiskunde, 7.5, 12 oktober...") wordt omgezet naar een gestructureerd JSON-object.

Inpakken: Dit object wordt door de btoa() functie gehaald. Dit maakt van de data een "Base64-string". Dit wordt gedaan om fouten te voorkomen en om te zorgen dat je je cijfers niet kan zien uit de code.

## Het SomBox Dashboard (De Data Visualiseren)
Zodra je de website opent en je code plakt, komt de site in actie.

Wat de **gebruiker** ziet:

Je opent [de SomBox website](https://sn0wwfox.github.io/SomBox/).

Je plakt de code in het import-veld.

Je krijgt een scherm met een verificatie van het aantal cases(cijfers).

Je kan beginnnen met **unboxen**

Wat er op de **achtergrond** gebeurt:

Uitpakken: De site vangt de geplakte Base64-string op en draait het proces om (atob). De onleesbare tekst wordt weer een lijst met vakken en cijfers.

Lokale Opslag: De site voert localStorage.setItem('cijfers', data) uit. Hierdoor onthoudt jouw browser de cijfers. **Belangrijk**: Deze data verlaat **nooit** jouw computer en wordt niet naar een server gestuurd.

Berekeningen: De JavaScript-motor van de site loopt door alle cijfers heen. Hij filtert dubbele vakken, berekent het gewogen gemiddelde en bepaalt de kleur (rood voor < 5.5, groen voor > 5.5).

Rendering: De browser gebruikt de berekende data om de HTML-elementen dynamisch aan te maken.

## 🛡️ Waarom die "Blocker"?
Sommige gebruikers schrikken als het scherm zwart wordt. Dit is echter juist voor jouw veiligheid en voor de stabiliteit:

Voorkomen van fouten: Als je tijdens het scrapen ergens anders klikt, kan het script de cijfers niet goed vinden. De blocker zorgt dat het script ongestoord zijn werk kan doen.

Feedback: Het laat je weten dat SomBox actief is, zodat je niet denkt dat je browser is vastgelopen.

Voorkomt spoilers: Om de data te vinden moet de scraper naar het cijfer tablad. als er geen blocker is zou je zelf ook de recente cijfers kunnen zien.


# 📂 Repository Structuur
/index.html: Het hoofd-dashboard van de SomBox website.

/style.css: De styling (Dark Mode & Glassmorphism design).

/script.js: De logica die de import verwerkt en de cijfers rendert.

/extension: De bronbestanden voor de Chrome/Edge extensie.

- manifest.json: De configuratie voor de browser.

- content.js: Het script dat de "📦" knop injecteert.
