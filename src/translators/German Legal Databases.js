{
	"translatorID": "b56e28f0-d9f7-4a3e-9c1a-8b7d3e5f6a9b",
	"label": "German Legal Databases",
	"creator": "Zotero Community",
	"target": "^https?://(www\\.)?(rechtsprechung-im-internet\\.de|gesetze-bayern\\.de|gesetze\\.berlin\\.de|landesrecht-bw\\.de|landesrecht-hamburg\\.de|lareda\\.hessenrecht\\.hessen\\.de|landesrecht-mv\\.de|voris\\.wolterskluwer-online\\.de|landesrecht\\.rlp\\.de|recht\\.saarland\\.de|landesrecht\\.sachsen-anhalt\\.de|gesetze-rechtsprechung\\.sh\\.juris\\.de|landesrecht\\.thueringen\\.de|nrwe\\.justiz\\.nrw\\.de|gerichtsentscheidungen\\.brandenburg\\.de)",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2025-11-19 20:00:00"
}

function detectWeb(doc, url) {
	// Check if this is a German legal decision page
	if (isLegalDecisionPage(doc, url)) {
		return "case";
	}
	return false;
}

function isLegalDecisionPage(doc, url) {
	// Check for ECLI identifier (European Case Law Identifier)
	if (doc.body.textContent.includes('ECLI:DE:')) {
		return true;
	}
	
	// Check for known German legal database URLs
	var legalDatabasePatterns = [
		'rechtsprechung-im-internet.de',
		'gesetze-bayern.de',
		'gesetze.berlin.de',
		'landesrecht-bw.de',
		'landesrecht-hamburg.de',
		'lareda.hessenrecht',
		'landesrecht-mv.de',
		'voris.wolterskluwer-online.de',
		'landesrecht.rlp.de',
		'recht.saarland.de',
		'landesrecht.sachsen-anhalt.de',
		'gesetze-rechtsprechung.sh.juris.de',
		'landesrecht.thueringen.de',
		'nrwe.justiz.nrw.de',
		'gerichtsentscheidungen.brandenburg.de'
	];
	
	for (let pattern of legalDatabasePatterns) {
		if (url.includes(pattern)) {
			// On these sites, check for decision type keywords
			var title = doc.title.toLowerCase();
			if (title.includes('urteil') || title.includes('beschluss') || 
				title.includes('gerichtsentscheidung') || title.includes('entscheidung')) {
				return true;
			}
		}
	}
	
	// Check for typical German court decision keywords in title
	var title = doc.title.toLowerCase();
	if ((title.includes('urteil') || title.includes('beschluss') || 
		 title.includes('gerichtsentscheidung') || title.includes('entscheidung')) &&
		(title.includes('gericht') || url.includes('rechtsprechung') || 
		 url.includes('gerichtsentscheidung'))) {
		return true;
	}
	
	// Check for specific metadata fields
	if (doc.querySelector('.feldbezeichnung')) {
		var labels = doc.querySelectorAll('.feldbezeichnung');
		for (let label of labels) {
			var text = label.textContent.toLowerCase();
			if (text.includes('gericht') || text.includes('aktenzeichen')) {
				return true;
			}
		}
	}
	
	return false;
}

async function doWeb(doc, url) {
	var item = new Zotero.Item("case");
	
	// Extract metadata based on the source
	if (url.includes('rechtsprechung-im-internet.de')) {
		extractFromBundDatabase(doc, item);
	} else if (url.includes('gesetze-bayern.de')) {
		extractFromBayernDatabase(doc, item);
	} else if (url.includes('nrwe.justiz.nrw.de')) {
		extractFromNRWDatabase(doc, item);
	} else if (url.includes('gesetze.berlin.de') || 
			   url.includes('landesrecht-bw.de') ||
			   url.includes('landesrecht-hamburg.de') ||
			   url.includes('lareda.hessenrecht.hessen.de') ||
			   url.includes('landesrecht-mv.de') ||
			   url.includes('voris.wolterskluwer-online.de') ||
			   url.includes('landesrecht.rlp.de') ||
			   url.includes('recht.saarland.de') ||
			   url.includes('landesrecht.sachsen-anhalt.de') ||
			   url.includes('gesetze-rechtsprechung.sh.juris.de') ||
			   url.includes('landesrecht.thueringen.de') ||
			   url.includes('gerichtsentscheidungen.brandenburg.de')) {
		extractFromStateLegalDatabase(doc, item, url);
	} else {
		// Fallback: try to extract from common patterns
		extractFromGenericPattern(doc, item);
	}
	
	// Extract ECLI if available
	extractECLI(doc, item);
	
	// Set URL
	item.url = url;
	
	// Set language to German
	item.language = "de";
	
	// Complete the item
	item.complete();
}

function extractFromBundDatabase(doc, item) {
	// Title format: "BVerwG 3. Senat | 3 C 7/23 | Urteil | ..."
	var title = doc.title.trim();
	var parts = title.split('|').map(s => s.trim());
	
	if (parts.length >= 3) {
		// Court from first part
		item.court = parts[0];
		
		// Docket number from second part
		item.docketNumber = parts[1];
		
		// Decision type from third part
		var decisionType = parts[2];
		
		// Case name combines court and docket number
		item.caseName = parts[0] + ' ' + parts[1];
		
		// Add decision type to extra
		if (item.extra) {
			item.extra += '\nEntscheidungsart: ' + decisionType;
		} else {
			item.extra = 'Entscheidungsart: ' + decisionType;
		}
		
		// If there's a description, use it for abstract
		if (parts.length >= 4) {
			item.abstractNote = parts[3];
		}
	}
	
	// Try to extract date from ECLI or page content
	extractDateFromContent(doc, item);
}

function extractFromBayernDatabase(doc, item) {
	// Title format: "BayObLG, Beschluss v. 19.11.2025 – 102 SchH 121/25 e"
	var title = doc.title.trim();
	
	// Remove " - Bürgerservice" suffix
	title = title.replace(/\s*-\s*Bürgerservice.*$/, '');
	
	// Pattern: Court, Type v. Date – Docket
	var match = title.match(/^([^,]+),\s*(Urteil|Beschluss|Entscheidung)(?:\s+v\.\s+(\d{1,2}\.\d{1,2}\.\d{4}))?(?:\s*–\s*(.+))?/);
	
	if (match) {
		item.court = match[1].trim();
		var decisionType = match[2];
		var date = match[3];
		var docket = match[4];
		
		if (docket) {
			item.docketNumber = docket.trim();
		}
		
		if (date) {
			item.dateDecided = formatGermanDate(date);
		}
		
		// Case name
		item.caseName = item.court + (docket ? ' ' + docket : '');
		
		// Add decision type to extra
		item.extra = 'Entscheidungsart: ' + decisionType;
	} else {
		// Fallback: use title as case name
		item.caseName = title;
	}
	
	// Try to extract from page content
	var metaDiv = doc.querySelector('#doc-metadata');
	if (metaDiv) {
		var boldText = metaDiv.querySelector('b');
		if (boldText) {
			var text = boldText.textContent.trim();
			// Parse from bold text if not already extracted
			if (!item.court) {
				var parts = text.split(',');
				if (parts.length >= 1) {
					item.court = parts[0].trim();
				}
			}
		}
	}
}

function extractFromNRWDatabase(doc, item) {
	// This database uses feldbezeichnung/feldinhalt classes
	var labels = doc.querySelectorAll('.feldbezeichnung');
	
	for (let label of labels) {
		var labelText = label.textContent.trim().replace(':', '');
		var content = label.nextElementSibling;
		
		if (content && content.classList.contains('feldinhalt')) {
			var contentText = content.textContent.trim();
			
			switch (labelText.toLowerCase()) {
				case 'gericht':
					item.court = contentText;
					break;
				case 'aktenzeichen':
					item.docketNumber = contentText;
					break;
				case 'datum':
					item.dateDecided = formatGermanDate(contentText);
					break;
				case 'entscheidungsart':
					if (item.extra) {
						item.extra += '\nEntscheidungsart: ' + contentText;
					} else {
						item.extra = 'Entscheidungsart: ' + contentText;
					}
					break;
				case 'spruchkörper':
					if (item.court) {
						item.court += ' ' + contentText;
					}
					break;
			}
		}
	}
	
	// Build case name from available data
	if (item.court && item.docketNumber) {
		item.caseName = item.court + ' ' + item.docketNumber;
	} else if (doc.title) {
		item.caseName = doc.title.trim();
	}
}

function extractFromStateLegalDatabase(doc, item, url) {
	// Title format: "Database Name - Docket | Court | Type" or similar
	var title = doc.title.trim();
	
	// Special case for Brandenburg which has different format
	if (url && url.includes('gerichtsentscheidungen.brandenburg.de')) {
		// Look for docket number in ECLI
		var ecliMatch = doc.body.textContent.match(/ECLI:DE:[A-Za-z]+:\d+:\d+\.([0-9A-Za-z.]+)/);
		if (ecliMatch) {
			var ecliPart = ecliMatch[1];
			// Extract from ECLI: ECLI:DE:ARBGCOT:2022:0614.1CA726.21.00
			// Docket is embedded after date: 1CA726.21
			var docketMatch = ecliPart.match(/\d{4}\.(.+?)\.00$/);
			if (docketMatch) {
				var docketStr = docketMatch[1];
				// Format: 1CA726.21 -> 1 CA 726/21
				var formatted = docketStr.replace(/^(\d+)([A-Za-z]+)(\d+)\.(\d+)$/, '$1 $2 $3/$4');
				item.docketNumber = formatted;
			}
		}
		
		// Extract court name from elsewhere if needed
		item.caseName = title;
		extractDateFromContent(doc, item);
		return;
	}
	
	// Remove database prefix (e.g., "Landesrecht BW -", "VIS Berlin -", "Mecklenburg-Vorpommern -")
	title = title.replace(/^[^-]+-\s*/, '');
	
	// Split by pipe
	var parts = title.split('|').map(s => s.trim());
	
	if (parts.length >= 3) {
		// Usually: Docket | Court | Type
		var docketPart = parts[0];
		
		// Extract just the docket number (format: digits + letters + digits/digits)
		// Match patterns like "24 L 385/25", "3 U 42/20", "3 SLa 254/24", "3 L 116/25.Z", etc.
		var docketMatch = docketPart.match(/\b(\d+\s+[A-Za-z]+\s+\d+\/\d+[a-zA-Z.]*)\b/);
		if (docketMatch) {
			item.docketNumber = docketMatch[1];
		} else {
			item.docketNumber = docketPart;
		}
		
		item.court = parts[1];
		var decisionType = parts[2].split(/\s+/)[0]; // First word is usually the type
		
		item.caseName = item.court + ' ' + item.docketNumber;
		
		if (item.extra) {
			item.extra += '\nEntscheidungsart: ' + decisionType;
		} else {
			item.extra = 'Entscheidungsart: ' + decisionType;
		}
	} else if (parts.length >= 2) {
		var docketPart = parts[0];
		var docketMatch = docketPart.match(/\b(\d+\s+[A-Za-z]+\s+\d+\/\d+[a-zA-Z.]*)\b/);
		if (docketMatch) {
			item.docketNumber = docketMatch[1];
		} else {
			item.docketNumber = docketPart;
		}
		item.court = parts[1];
		item.caseName = item.court + ' ' + item.docketNumber;
	} else {
		item.caseName = title;
	}
	
	// Extract date from content
	extractDateFromContent(doc, item);
}

function extractFromGenericPattern(doc, item) {
	// Fallback extraction
	item.caseName = doc.title.trim();
	
	// Try to find court in title or content
	var courtMatch = doc.body.textContent.match(/\b(Bundesgerichtshof|BGH|Bundesverwaltungsgericht|BVerwG|Bundesarbeitsgericht|BAG|Bundessozialgericht|BSG|Bundesfinanzhof|BFH|Oberlandesgericht|OLG|Landgericht|LG|Amtsgericht|AG|Verwaltungsgericht|VG|Sozialgericht|SG|Arbeitsgericht|ArbG|Finanzgericht|FG)\b/);
	if (courtMatch) {
		item.court = courtMatch[0];
	}
	
	// Try to find docket number pattern
	var docketMatch = doc.body.textContent.match(/\b(\d+\s+[A-Z]+\s+\d+\/\d+)\b/);
	if (docketMatch) {
		item.docketNumber = docketMatch[0];
	}
	
	extractDateFromContent(doc, item);
}

function extractECLI(doc, item) {
	// Look for ECLI pattern
	var ecliMatch = doc.body.textContent.match(/ECLI:([A-Z]{2}:[A-Za-z0-9:\.]+)/);
	if (ecliMatch) {
		var ecli = ecliMatch[0];
		if (item.extra) {
			item.extra += '\nECLI: ' + ecli;
		} else {
			item.extra = 'ECLI: ' + ecli;
		}
		
		// Extract date from ECLI if not already set
		// ECLI format: ECLI:DE:Court:YYYY:MMDD...
		if (!item.dateDecided) {
			var parts = ecli.split(':');
			if (parts.length >= 4) {
				var dateStr = parts[3];
				// Try to parse YYYYMMDD format
				var yearMatch = dateStr.match(/^(\d{4})(\d{2})(\d{2})/);
				if (yearMatch) {
					item.dateDecided = yearMatch[1] + '-' + yearMatch[2] + '-' + yearMatch[3];
				}
			}
		}
	}
}

function extractDateFromContent(doc, item) {
	if (item.dateDecided) return; // Already have date
	
	// Look for common date patterns in German format
	var datePatterns = [
		/(\d{1,2})\.(\d{1,2})\.(\d{4})/,  // DD.MM.YYYY
		/(\d{4})-(\d{2})-(\d{2})/          // YYYY-MM-DD
	];
	
	var text = doc.body.textContent;
	for (let pattern of datePatterns) {
		var match = text.match(pattern);
		if (match) {
			if (pattern.source.includes('\\.')) {
				// German format DD.MM.YYYY
				item.dateDecided = formatGermanDate(match[0]);
			} else {
				// ISO format
				item.dateDecided = match[0];
			}
			break;
		}
	}
}

function formatGermanDate(dateStr) {
	// Convert DD.MM.YYYY to YYYY-MM-DD
	var match = dateStr.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
	if (match) {
		var day = match[1].padStart(2, '0');
		var month = match[2].padStart(2, '0');
		var year = match[3];
		return year + '-' + month + '-' + day;
	}
	return dateStr;
}

/** BEGIN TEST CASES **/
var testCases = []
/** END TEST CASES **/
