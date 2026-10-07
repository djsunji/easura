# easura

**Versicherung. Einfach gemacht.**

easura ist eine Website für junge Leute in der Schweiz: Man lädt die eigenen Versicherungspolicen hoch und sieht auf einen Blick, welche Versicherungen aktiv sind, was sie kosten und was noch fehlt. Jede Versicherung wird in einfachen Worten erklärt.

> Status: **Prototyp.** Keine Versicherungsberatung. Daten werden nur im Browser gespeichert.

## Funktionen

- **Police hochladen** (PDF oder Foto, mehrere aufs Mal) mit automatischer Erkennung von Versicherer, Art, Prämie, Policennummer und Laufzeit
- **Erkennung ohne externe KI:**
  - Text-PDFs werden mit [pdf.js](https://mozilla.github.io/pdf.js/) im Browser gelesen
  - Fotos und gescannte PDFs werden mit [Tesseract.js](https://github.com/naptha/tesseract.js) (OCR) im Browser gelesen
  - Ein Regelwerk mit Stichworten (DE/FR/IT) erkennt 12 Versicherungsarten und über 100 Versicherer und Banken
  - Dokumente verlassen das Gerät nicht
- **Optionale KI-Analyse** über Claude, nur wenn die Seite als Claude-Artifact läuft (`window.claude`). Auf GitHub Pages ist dieser Teil automatisch aus.
- **Übersicht** mit Status-Farben: grün abgedeckt, rot fehlt oder abgelaufen, blau optional
- **Profil** (Wohnsituation, Arbeit, Fahrzeug, Haustier usw.) passt die Empfehlungen an, z.B. Unfall über den Arbeitgeber (UVG)
- **Registrierung** (Prototyp): E-Mail oder Apple, Google, Microsoft, Facebook (noch nicht angebunden), Profil kann aus einer Police vorausgefüllt werden
- **«Offen für Angebote»** pro Versicherung und eine **Angebotsleiste** für Partner (Beispiel-Inhalte)
- **Sprachen:** Deutsch, Französisch, Italienisch, Englisch
- **Tag- und Nachtmodus**

## Projektstruktur

```
index.html              Seite
assets/css/base.css     Grund-Reset
assets/css/style.css    Design (Farben, Layout, Tag/Nacht)
assets/js/i18n.js       Alle Texte in DE, FR, IT, EN
assets/js/app.js        App-Logik (Erkennung, Übersicht, Registrierung, Angebote)
assets/js/logos.js      Logos der Versicherer und Banken (eingebettet)
assets/img/             easura-Logo
tessdata/               Optional: eigene OCR-Sprachdaten
```

Es braucht keinen Build-Schritt und keine Installation.

## Lokal starten

Die Seite muss über einen kleinen Webserver laufen (nicht per Doppelklick), damit die Skripte korrekt laden:

```bash
cd easura
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
```

## Mit GitHub Pages veröffentlichen

1. Neues Repository auf GitHub erstellen, z.B. `easura`.
2. Auf der Repository-Seite **Add file → Upload files** wählen und den **Inhalt** des Ordners `easura` hineinziehen (`index.html`, `README.md`, `.gitignore` und die Ordner `assets` und `tessdata`). Es sind nur rund 10 Dateien, das passt in einen Upload.
3. Auf GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, Branch `main`, Ordner `/ (root)`.
4. Nach ca. einer Minute ist die Seite unter `https://<dein-name>.github.io/easura/` erreichbar.

```bash
git init
git add .
git commit -m "easura Prototyp"
git branch -M main
git remote add origin https://github.com/<dein-name>/easura.git
git push -u origin main
```

## Externe Bibliotheken (per CDN geladen)

| Bibliothek | Zweck | Lizenz |
|---|---|---|
| pdf.js 3.11.174 | Text aus PDFs lesen | Apache 2.0 |
| Tesseract.js 5.1.1 | Texterkennung (OCR) für Fotos und Scans | Apache 2.0 |
| Google Fonts: Outfit, Figtree | Schriften | SIL Open Font License |

## Wichtige Hinweise vor einem öffentlichen Start

- **Logos von Versicherern und Banken** (`assets/js/logos.js`): Die Markenrechte liegen bei den jeweiligen Firmen. Einige der aktuellen Bilder sind KI-generierte Annäherungen und weichen von den Originalen ab. Vor einem öffentlichen Start durch die offiziellen Logo-Dateien ersetzen und die Nutzung mit den Firmen abklären.
- **Markenname:** «easura» ist sehr ähnlich zum Krankenversicherer «Assura». Vor dem Start im Markenregister (Swissreg) prüfen lassen.
- **Datenschutz (revDSG):** Eine Datenschutzerklärung fehlt noch. Sie muss erklären, welche Daten wo verarbeitet werden.
- **Angebote** in der Angebotsleiste sind erfundene Beispiele und als solche markiert.
- **Übersetzungen** FR und IT von Muttersprachigen gegenlesen lassen, vor allem die Versicherungsbegriffe.

## Nächste Schritte

- Backend mit echtem Login (z.B. Supabase, Firebase oder Auth0) und Speicherung in der Schweiz
- Echte Anmeldung mit Apple, Google, Microsoft, Facebook inkl. offizieller Button-Grafiken
- Vorlagen pro Versicherer für noch genauere Erkennung
- Erinnerungen an Kündigungsfristen (z.B. Krankenkasse bis 30. November)
- Prämienvergleich und echte Partner-Angebote
