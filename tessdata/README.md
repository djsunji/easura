# Sprachdaten für die Texterkennung (optional)

easura nutzt [Tesseract.js](https://github.com/naptha/tesseract.js) für die Texterkennung von Fotos und gescannten PDFs direkt im Browser.

Standardmässig lädt Tesseract.js die Sprachdaten (Deutsch, Französisch, Italienisch, Englisch) beim ersten Gebrauch von seiner eigenen Quelle und speichert sie im Browser-Cache.

Wenn du die Daten selbst hosten willst (z.B. für Datenschutz oder Offline-Betrieb):

1. Lade `deu.traineddata.gz`, `fra.traineddata.gz`, `ita.traineddata.gz` und `eng.traineddata.gz` herunter, z.B. aus den npm-Paketen `@tesseract.js-data/deu`, `@tesseract.js-data/fra`, `@tesseract.js-data/ita`, `@tesseract.js-data/eng` (Ordner `4.0.0_best_int`).
2. Lege die Dateien in diesen Ordner.
3. Setze in `index.html` `window.EASURA_TESSDATA = "tessdata";`
