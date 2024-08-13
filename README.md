```markdown
# MindSpeak Project

## Overzicht
MindSpeak is een webapplicatie die gebruikers in staat stelt om woorden en zinnen te voorspellen, aan te passen en op te slaan voor hergebruik. Het project bevat een dynamisch geluidenbord, personaliseerbare tegels en een voorspellingsfunctie op basis van AI.

## Functionaliteiten

### 1. Dynamische Tegels
- **Personaliseerbare Tegels:** Gebruikers kunnen tegels aanpassen door tekst en afbeeldingen toe te voegen via een bewerkingsmodus.
- **Toevoegen van Nieuwe Tegels:** Gebruikers kunnen nieuwe tegels toevoegen op specifieke pagina's zoals "Mijn Klas", "Lievelingseten", "Vrienden" en "Familienamen".
- **LocalStorage Opslag:** Tegelgegevens worden opgeslagen in de browser, zodat aanpassingen behouden blijven bij het herladen van de pagina.

### 2. Voorspellingsfunctie
- **AI-Voorspelling:** De applicatie gebruikt een AI-model om woorden te voorspellen op basis van de eerder ingevoerde zinnen.
- **Loader:** Een loader wordt weergegeven tijdens het ophalen van voorspellingen, wat de gebruiker informeert dat de voorspellingsfunctie bezig is.

### 3. Cookies
- **Output Persistentie:** De applicatie slaat de huidige zinnen in de output op in een cookie, zodat deze behouden blijft wanneer de gebruiker tussen pagina's navigeert.

### 4. Styling
- **Responsief Design:** De applicatie is ontworpen om goed te functioneren op verschillende schermformaten.
- **Blur en Donker Effect:** Een blur-effect met een donkere overlay wordt toegepast wanneer de bewerkingsmodus wordt geactiveerd, om de gebruiker te helpen zich te concentreren op het bewerken van tegels.

## Installatie

### Vereisten
- Node.js
- npm (Node Package Manager)

### Installatie Stappen
1. Clone de repository:
    ```bash
    git clone https://github.com/jouw-gebruikersnaam/mindspeak.git
    ```
2. Navigeer naar de projectmap:
    ```bash
    cd mindspeak
    ```
3. Installeer de benodigde npm-pakketten:
    ```bash
    npm install
    ```
4. Start de server:
    ```bash
    npm start
    ```

## Gebruik

### Tegels Bewerken
1. Activeer de bewerkingsmodus door op de pen-tool te klikken.
2. Klik op een tegel om deze te bewerken.
3. Pas de tekst of afbeelding aan in het pop-up venster.
4. Sla de wijzigingen op om ze te bewaren in LocalStorage.

### Voorspellingsfunctie
1. Typ een zin in de output-balk.
2. De AI voorspelt automatisch woorden op basis van de ingevoerde tekst (indien de voorspellingsfunctie is ingeschakeld).

### Navigeren tussen pagina's
- De ingevoerde zinnen worden opgeslagen in een cookie en blijven zichtbaar wanneer je naar andere pagina's gaat.

## Bestandenstructuur

```
mindspeak/
├── public/                # Bevat statische bestanden zoals afbeeldingen en CSS
├── src/                   # Bevat de bronbestanden van de applicatie
│   ├── js/                # JavaScript-bestanden voor functionaliteit
│   ├── styles/            # SCSS-bestanden voor styling
│   └── index.html         # Hoofdpagina van de applicatie
├── .env                   # Omgevingsvariabelen voor API-sleutels en configuratie
├── .gitignore             # Bestanden en mappen die moeten worden genegeerd door git
├── README.md              # Documentatie van het project
└── package.json           # Projectconfiguratie en afhankelijkheden
```

## API's

### Google Sheets API
- Wordt gebruikt om woorden en categorieën dynamisch te laden op basis van gegevens opgeslagen in Google Sheets.

### OpenAI API
- Gebruikt voor de voorspellingsfunctie en grammatica controle.

## Licentie
Dit project is gelicenseerd onder de MIT-licentie.

## Contact
Voor vragen of ondersteuning, neem contact op via [daniquelammertink@gmail.com](mailto:daniquelammertink@gmail.com).
```
