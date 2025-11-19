/**
 * Custom translators for the Zotero Connector
 * 
 * This file contains custom translators that are loaded in addition to
 * the standard translators from the Zotero repository.
 */

Zotero.CustomTranslators = {
	/**
	 * Initialize custom translators
	 */
	init: function() {
		// Load custom German Legal Databases translator
		var germanLegalTranslator = {
			"translatorID": "b56e28f0-d9f7-4a3e-9c1a-8b7d3e5f6a9b",
			"label": "German Legal Databases",
			"creator": "Zotero Community",
			"target": "^https?://(www\\.)?(rechtsprechung-im-internet\\.de|gesetze-bayern\\.de|gesetze\\.berlin\\.de|landesrecht-bw\\.de|landesrecht-hamburg\\.de|lareda\\.hessenrecht\\.hessen\\.de|landesrecht-mv\\.de|voris\\.wolterskluwer-online\\.de|landesrecht\\.rlp\\.de|recht\\.saarland\\.de|landesrecht\\.sachsen-anhalt\\.de|gesetze-rechtsprechung\\.sh\\.juris\\.de|landesrecht\\.thueringen\\.de|nrwe\\.justiz\\.nrw\\.de|gerichtsentscheidungen\\.brandenburg\\.de)",
			"minVersion": "3.0",
			"maxVersion": "",
			"priority": 100,
			"inRepository": false,
			"translatorType": 4,
			"browserSupport": "gcsibv",
			"lastUpdated": "2025-11-19 20:00:00"
		};
		
		return [germanLegalTranslator];
	},
	
	/**
	 * Inject custom translators into the translator cache
	 */
	injectIntoCache: async function() {
		// Wait for Translators to be initialized
		await Zotero.Translators.init();
		
		var customTranslators = this.init();
		
		// Get current metadata
		var currentMetadata = Zotero.Prefs.get("translatorMetadata") || [];
		
		// Add custom translators if not already present
		for (let customTranslator of customTranslators) {
			var exists = currentMetadata.some(t => t.translatorID === customTranslator.translatorID);
			if (!exists) {
				currentMetadata.push(customTranslator);
				Zotero.debug(`CustomTranslators: Added custom translator "${customTranslator.label}"`);
			}
		}
		
		// Save updated metadata
		Zotero.Prefs.set("translatorMetadata", currentMetadata);
		
		// Reload translators
		Zotero.Translators._load(currentMetadata);
	}
};
