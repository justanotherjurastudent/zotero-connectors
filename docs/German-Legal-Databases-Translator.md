# German Legal Databases Translator for Zotero

## Overview

This translator enables the Zotero Connector to automatically detect and extract metadata from German legal case decisions (Rechtsprechung) across all major public legal databases in Germany.

## Supported Databases

The translator supports the following German legal databases:

### Federal Databases
- **rechtsprechung-im-internet.de** - Federal court decisions (Bundesgerichtshof, Bundesverwaltungsgericht, etc.)

### State Legal Databases (Landesrecht)
- **gesetze-bayern.de** - Bavaria (Bayern.Recht)
- **gesetze.berlin.de** - Berlin
- **landesrecht-bw.de** - Baden-Württemberg
- **landesrecht-hamburg.de** - Hamburg
- **lareda.hessenrecht.hessen.de** - Hesse
- **landesrecht-mv.de** - Mecklenburg-Vorpommern
- **voris.wolterskluwer-online.de** - Lower Saxony (Niedersachsen)
- **landesrecht.rlp.de** - Rhineland-Palatinate (Rheinland-Pfalz)
- **recht.saarland.de** - Saarland
- **landesrecht.sachsen-anhalt.de** - Saxony-Anhalt (Sachsen-Anhalt)
- **gesetze-rechtsprechung.sh.juris.de** - Schleswig-Holstein
- **landesrecht.thueringen.de** - Thuringia (Thüringen)
- **gerichtsentscheidungen.brandenburg.de** - Brandenburg

### Regional Court Databases
- **nrwe.justiz.nrw.de** - North Rhine-Westphalia courts

## Extracted Metadata

The translator extracts the following metadata fields and maps them to Zotero's "Case" item type:

| German Term | English | Zotero Field | Example |
|------------|---------|--------------|---------|
| Gericht | Court | `court` | BVerwG 3. Senat |
| Aktenzeichen | Docket Number | `docketNumber` | 3 C 7/23 |
| Entscheidungsdatum | Decision Date | `dateDecided` | 2024-12-05 |
| Entscheidungsart | Decision Type | `extra` | Urteil, Beschluss |
| ECLI | European Case Law Identifier | `extra` | ECLI:DE:BVerwG:2024:051224U3C7.23.0 |

### Field Mapping Details

- **Court (Gericht)** → `court` field
- **Docket Number (Aktenzeichen)** → `docketNumber` field  
- **Decision Date (Entscheidungsdatum)** → `dateDecided` field
- **Decision Type (Entscheidungsart)** → stored in `extra` field as "Entscheidungsart: Urteil/Beschluss"
- **ECLI** → stored in `extra` field as "ECLI: ECLI:DE:..."
- **Case Name** → automatically generated from court + docket number
- **Language** → automatically set to "de" (German)

## How It Works

### Detection

The translator detects German legal decision pages using multiple criteria:

1. **ECLI Identifier**: Presence of "ECLI:DE:" in the page content
2. **URL Matching**: Known German legal database domains
3. **Keywords**: Decision type keywords (Urteil, Beschluss) in title
4. **Metadata Fields**: Specific HTML classes like `.feldbezeichnung`

### Extraction Strategies

The translator uses different extraction strategies based on the database format:

#### 1. Bundesrechtsprechung (rechtsprechung-im-internet.de)
- Parses title format: "Court | Docket | Type | Description"
- Example: "BVerwG 3. Senat | 3 C 7/23 | Urteil | ..."

#### 2. Bayern.Recht (gesetze-bayern.de)
- Parses title format: "Court, Type v. Date – Docket"
- Example: "BayObLG, Beschluss v. 19.11.2025 – 102 SchH 121/25 e"

#### 3. NRW Justiz (nrwe.justiz.nrw.de)
- Extracts from structured HTML with `.feldbezeichnung` and `.feldinhalt` classes
- Directly maps fields: Gericht, Aktenzeichen, Datum, Entscheidungsart

#### 4. State Legal Databases
- Parses title format: "Database - Docket | Court | Type"
- Example: "Landesrecht BW - 19 T 303/25 | LG Stuttgart | Beschluss"
- Uses regex patterns to extract clean docket numbers

#### 5. ECLI-based Extraction
- Extracts dates from ECLI format (ECLI:DE:Court:YYYY:MMDD...)
- Provides fallback when other date extraction fails

## Testing

The translator has been tested against HTML files from all major German legal databases. Test results are available in `test/translator-test-results.txt`.

### Test Files

All test files are located in the `test/` directory:
- `bund.html` - Federal court decision
- `bayern.html` - Bavarian court decision
- `Amtsgericht Köln, 262 C 494_06.html` - NRW court decision
- `berlin.html`, `bw.html`, `hamburg.html`, etc. - State court decisions

### Running Tests

```bash
cd test
node test-translator.js
```

## Installation

The translator file is located at:
```
src/translators/German Legal Databases.js
```

To use this translator in the Zotero Connector:

1. Build the connector: `./build.sh -d`
2. Load the extension in your browser (see main README.md)
3. Visit any supported German legal database
4. The Zotero connector icon will activate for legal decision pages

## Technical Details

- **Translator ID**: `b56e28f0-d9f7-4a3e-9c1a-8b7d3e5f6a9b`
- **Translator Type**: 4 (Web translator)
- **Priority**: 100
- **Item Type**: case
- **Browser Support**: gcsibv (Chrome, Safari, Internet Explorer, Brave, Vivaldi)

## Limitations and Future Improvements

1. **Brandenburg Database**: Currently uses generic title as case name due to non-standard format
2. **Date Extraction**: Some databases may require improved date parsing for edge cases
3. **Multi-lingual Support**: Currently German-only, could be extended for other languages
4. **Additional Fields**: Could extract more metadata like case summaries, legal norms cited, etc.

## Contributing

To improve this translator:

1. Add test cases for new legal database formats
2. Enhance metadata extraction patterns
3. Report issues with specific database pages
4. Submit improvements via pull requests

## License

This translator follows the Zotero license (GNU AGPL v3).
