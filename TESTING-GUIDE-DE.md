# Anleitung: Testen des German Legal Databases Translators im Browser

## Übersicht

Der Translator wurde implementiert, aber da Zotero-Translatoren normalerweise über das offizielle Repository verteilt werden, gibt es mehrere Möglichkeiten zum Testen.

## Option 1: Sofortiges Testen mit Zotero Scaffold (EMPFOHLEN)

Dies ist der schnellste Weg, um den Translator zu testen, ohne den gesamten Connector neu zu bauen.

### Voraussetzungen
- Zotero Desktop-Anwendung installiert
- Browser mit Zotero Connector-Extension

### Schritte

1. **Zotero Desktop öffnen**

2. **Scaffold öffnen:**
   - Menü: `Tools` → `Developer` → `Translator Editor` (Scaffold)
   - Falls nicht sichtbar: `Edit` → `Preferences` → `Advanced` → `Config Editor` → `extensions.zotero.scaffold.enable` auf `true` setzen

3. **Neuen Translator erstellen:**
   - Klick auf "New Web Translator"
   - Kopiere den kompletten Inhalt aus `src/translators/German Legal Databases.js` in das Editor-Fenster
   - Speichern

4. **Testen:**
   - Öffne eine der unterstützten deutschen Rechtsprechungsdatenbanken im Browser:
     - https://www.rechtsprechung-im-internet.de
     - https://www.gesetze-bayern.de
     - https://www.landesrecht-bw.de
   - Suche nach einer Gerichtsentscheidung (Urteil oder Beschluss)
   - Das Zotero-Symbol in der Browserleiste sollte ein "Aktensymbol" für Rechtsfälle anzeigen
   - Klicke auf das Symbol, um die Metadaten zu importieren

5. **Überprüfen:**
   - In Zotero sollte ein neuer Eintrag vom Typ "Fall" erstellt werden
   - Überprüfe die Felder:
     - **Gericht** sollte gefüllt sein
     - **Aktenzeichen** sollte gefüllt sein
     - **Entscheidungsdatum** sollte gefüllt sein
     - **Extra** sollte Entscheidungsart und ggf. ECLI enthalten

## Option 2: Connector neu bauen und installieren

Diese Option ist komplexer und erfordert eine Entwicklungsumgebung.

### Voraussetzungen
- Node.js und npm installiert
- Git installiert
- Terminal/Kommandozeile

### Schritte

1. **Repository klonen (falls noch nicht geschehen):**
   ```bash
   git clone --recursive https://github.com/justanotherjurastudent/zotero-connectors.git
   cd zotero-connectors
   ```

2. **Zu diesem Branch wechseln:**
   ```bash
   git checkout copilot/improve-case-law-detection
   ```

3. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```

4. **Submodule initialisieren:**
   ```bash
   git submodule update --init --recursive
   ```

5. **Connector bauen:**
   ```bash
   ./build.sh -d
   ```
   
   Der Build-Prozess erstellt den Connector in `build/browserExt/`

6. **Im Browser installieren:**

   **Für Chrome/Chromium:**
   - Öffne `chrome://extensions/`
   - Aktiviere "Entwicklermodus" (oben rechts)
   - Klicke auf "Entpackte Erweiterung laden"
   - Wähle den Ordner `build/browserExt/`
   
   **Für Firefox:**
   - Öffne `about:debugging`
   - Klicke auf "Temporäres Add-on laden"
   - Wähle die Datei `build/browserExt/manifest.json`

**WICHTIG:** Der Translator wird NICHT automatisch mit dem Build geladen, da Translatoren normalerweise von Zotero-Servern abgerufen werden. Verwende stattdessen Option 1 (Scaffold).

## Option 3: Lokale Tests mit dem Test-Script

Um zu verifizieren, dass der Translator korrekt funktioniert, ohne einen Browser zu verwenden:

```bash
cd test
node test-translator.js
```

Dies testet den Translator gegen alle 15 HTML-Testdateien und zeigt die extrahierten Metadaten an.

## Unterstützte Datenbanken zum Testen

### Bundesebene
- https://www.rechtsprechung-im-internet.de/

### Landesebene
- https://www.gesetze-bayern.de/ (Bayern)
- https://gesetze.berlin.de/ (Berlin)
- https://www.landesrecht-bw.de/ (Baden-Württemberg)
- https://www.landesrecht-hamburg.de/ (Hamburg)
- https://www.lareda.hessenrecht.hessen.de/ (Hessen)
- https://www.landesrecht-mv.de/ (Mecklenburg-Vorpommern)
- https://voris.wolterskluwer-online.de/ (Niedersachsen)
- https://www.landesrecht.rlp.de/ (Rheinland-Pfalz)
- https://recht.saarland.de/ (Saarland)
- https://www.landesrecht.sachsen-anhalt.de/ (Sachsen-Anhalt)
- https://www.gesetze-rechtsprechung.sh.juris.de/ (Schleswig-Holstein)
- https://landesrecht.thueringen.de/ (Thüringen)
- https://gerichtsentscheidungen.brandenburg.de/ (Brandenburg)

### Regional
- https://nrwe.justiz.nrw.de/ (Nordrhein-Westfalen)

## Was wird erkannt?

Der Translator erkennt und extrahiert:

1. **Gericht** (z.B. "BVerwG 3. Senat", "BayObLG")
2. **Aktenzeichen** (z.B. "3 C 7/23", "102 SchH 121/25 e")
3. **Entscheidungsdatum** (automatisch konvertiert zu ISO-Format)
4. **Entscheidungsart** (Urteil, Beschluss, etc.)
5. **ECLI** (European Case Law Identifier, falls vorhanden)

Alle Einträge werden als Typ "Fall" in Zotero gespeichert.

## Fehlerbehebung

### Der Translator wird nicht erkannt

**Mögliche Ursachen:**
1. Scaffold ist nicht korrekt konfiguriert
2. Der Translator-Code wurde nicht vollständig kopiert
3. Die Website wird nicht erkannt (URL stimmt nicht mit der Target-Regex überein)

**Lösungen:**
- Überprüfe die Konsole in Scaffold auf Fehlermeldungen
- Stelle sicher, dass du auf einer unterstützten Rechtsprechungsseite bist
- Überprüfe, dass die Seite tatsächlich eine Gerichtsentscheidung zeigt

### Metadaten fehlen

**Wenn bestimmte Felder nicht gefüllt sind:**
- Überprüfe die HTML-Struktur der Seite (kann sich geändert haben)
- Prüfe die Test-Ergebnisse in `test/translator-test-results.txt`
- Melde das Problem im Repository

## Produktive Nutzung

Für die dauerhafte Nutzung sollte der Translator in das offizielle Zotero-Translators-Repository eingereicht werden:

1. Fork von https://github.com/zotero/translators erstellen
2. Translator-Datei hinzufügen
3. Pull Request einreichen
4. Nach Merge wird der Translator automatisch an alle Zotero-Nutzer verteilt

## Weitere Informationen

- Technische Dokumentation: `docs/German-Legal-Databases-Translator.md`
- Implementierungs-Details: `IMPLEMENTATION-SUMMARY.md`
- Test-Ergebnisse: `test/translator-test-results.txt`
