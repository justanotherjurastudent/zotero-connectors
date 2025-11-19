# German Legal Databases Translator Implementation

## Overview

This implementation adds comprehensive support for German legal case law (Rechtsprechung) recognition in the Zotero Connector, supporting 15+ German legal databases.

## What Has Been Implemented

### 1. Translator File
**Location:** `src/translators/German Legal Databases.js`

A comprehensive translator that:
- Detects German legal decision pages across 15+ databases
- Extracts key metadata: Court, Docket Number, Decision Date, Decision Type, ECLI
- Maps data to Zotero's "Case" item type
- Handles multiple HTML formats from different databases

### 2. Test Suite
**Location:** `test/test-translator.js`

A Node.js test script that validates the translator against all provided HTML test files:
- Tests 15 HTML files from different German legal databases
- Validates metadata extraction
- Saves results to `test/translator-test-results.txt`

**Run tests:**
```bash
cd test
node test-translator.js
```

### 3. Documentation
**Location:** `docs/German-Legal-Databases-Translator.md`

Comprehensive documentation including:
- Supported databases list
- Metadata field mapping
- Technical implementation details
- Usage instructions

## How to Use This Translator

### Option 1: For Testing/Development (Immediate Use)

The translator has been tested successfully with the test script. To use it in the actual Zotero Connector:

1. **Build the connector:**
   ```bash
   ./build.sh -d
   ```

2. **Manual translator installation:**
   - The translator code needs to be added to Zotero's translator repository
   - OR loaded manually through Zotero's Scaffold tool
   - OR submitted to the official Zotero translators repository

### Option 2: Submit to Official Zotero Translators Repository (Recommended for Production)

For production use, the translator should be submitted to the official Zotero translators repository:

1. Fork https://github.com/zotero/translators
2. Add `German Legal Databases.js` to the repository
3. Submit a pull request
4. Once merged, it will be automatically distributed to all Zotero Connector users

### Option 3: Using Scaffold for Testing

For immediate testing without submission:

1. Install Zotero desktop application
2. Open Tools → Developer → Translator Editor (Scaffold)
3. Create new web translator
4. Copy contents of `src/translators/German Legal Databases.js`
5. Save and test on legal database pages

## Supported Databases

The translator supports the following German legal databases:

### Federal Databases
- rechtsprechung-im-internet.de (BGH, BVerwG, BAG, BSG, BFH, etc.)

### State Legal Databases
- gesetze-bayern.de (Bavaria)
- gesetze.berlin.de (Berlin)
- landesrecht-bw.de (Baden-Württemberg)
- landesrecht-hamburg.de (Hamburg)
- lareda.hessenrecht.hessen.de (Hesse)
- landesrecht-mv.de (Mecklenburg-Vorpommern)
- voris.wolterskluwer-online.de (Lower Saxony)
- landesrecht.rlp.de (Rhineland-Palatinate)
- recht.saarland.de (Saarland)
- landesrecht.sachsen-anhalt.de (Saxony-Anhalt)
- gesetze-rechtsprechung.sh.juris.de (Schleswig-Holstein)
- landesrecht.thueringen.de (Thuringia)
- gerichtsentscheidungen.brandenburg.de (Brandenburg)

### Regional Databases
- nrwe.justiz.nrw.de (North Rhine-Westphalia)

## Metadata Extraction

The translator extracts and maps the following metadata:

| German Term | English | Zotero Field | Example |
|------------|---------|--------------|---------|
| Gericht | Court | `court` | BVerwG 3. Senat |
| Aktenzeichen | Docket Number | `docketNumber` | 3 C 7/23 |
| Entscheidungsdatum | Decision Date | `dateDecided` | 2024-12-05 |
| Entscheidungsart | Decision Type | `extra` | Urteil, Beschluss |
| ECLI | European Case Law Identifier | `extra` | ECLI:DE:BVerwG:2024:051224U3C7.23.0 |

All items are saved as **Case** (Fall) type in Zotero.

## Test Results

All 15 test HTML files successfully processed:
- ✅ bund.html - Federal court (BVerwG)
- ✅ bayern.html - Bavarian court (BayObLG)
- ✅ Amtsgericht Köln, 262 C 494_06.html - NRW court
- ✅ berlin.html - Berlin court (VG Berlin)
- ✅ bw.html - Baden-Württemberg court (LG Stuttgart)
- ✅ hamburg.html - Hamburg court (AG Hamburg)
- ✅ hessen.html - Hesse court (OLG Frankfurt)
- ✅ mv.html - Mecklenburg-Vorpommern court (OLG Rostock)
- ✅ ns.html - Lower Saxony court (OVG Niedersachsen)
- ✅ rp.html - Rhineland-Palatinate court (LAG Rheinland-Pfalz)
- ✅ saarland.html - Saarland court (OVG des Saarlandes)
- ✅ sachsen-anhalt.html - Saxony-Anhalt court (OVG Sachsen-Anhalt)
- ✅ sh.html - Schleswig-Holstein court (OVG Schleswig-Holstein)
- ✅ th.html - Thuringia court (Thüringer LSG)
- ✅ brandenburg.html - Brandenburg court

See `test/translator-test-results.txt` for detailed output.

## Architecture

The translator uses different extraction strategies based on database format:

1. **Bundesrechtsprechung:** Pipe-delimited title parsing
2. **Bayern.Recht:** Comma-separated with date format
3. **NRW Justiz:** Structured HTML metadata extraction
4. **State databases:** Pattern-based regex extraction
5. **ECLI fallback:** Date extraction from ECLI identifiers

## Implementation Notes

### Why Not Included in Build Automatically?

Zotero Connector translators are designed to be:
1. Maintained in a central repository (zotero/translators)
2. Automatically updated for all users
3. Shared across desktop and connector versions

Including custom translators in the connector build would:
- Bypass the standard update mechanism
- Create maintenance challenges
- Not follow Zotero's architecture

### Recommended Deployment Path

For production use, submit the translator to the official Zotero translators repository:
- Benefits: Automatic updates, wider testing, community maintenance
- Process: Fork repo → Add translator → Submit PR → Merge → Auto-distribution

### For Immediate Testing

Use Zotero Scaffold (Translator Editor) to load and test the translator immediately without waiting for repository acceptance.

## Future Improvements

Potential enhancements:
1. Extract case summaries (Leitsätze)
2. Extract cited legal norms
3. Extract related cases
4. Support for additional regional databases
5. Multilingual support for EU databases

## Technical Details

- **Translator ID:** `b56e28f0-d9f7-4a3e-9c1a-8b7d3e5f6a9b`
- **Type:** Web translator (type 4)
- **Priority:** 100
- **Browser Support:** Chrome, Safari, Internet Explorer, Brave, Vivaldi

## Files Changed/Added

```
src/translators/German Legal Databases.js  (New - Translator implementation)
test/test-translator.js                     (New - Test script)
test/translator-test-results.txt            (New - Test output)
docs/German-Legal-Databases-Translator.md   (New - Documentation)
src/common/customTranslators.js             (New - Custom translator loader stub)
README-German-Legal-Translator.md           (New - This file)
```

## License

This translator follows the Zotero license (GNU AGPL v3), consistent with the Zotero Connectors project.

## Support

For issues or questions about this translator:
1. Check the documentation in `docs/German-Legal-Databases-Translator.md`
2. Run the test suite to verify functionality
3. Review test results in `test/translator-test-results.txt`
4. Open an issue in the repository
