/**
 * Test script for German Legal Databases translator
 * 
 * This script tests the translator against the provided HTML test files
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Mock Zotero object for testing
global.Zotero = {
	Item: function(itemType) {
		this.itemType = itemType;
		this.complete = function() {
			console.log(JSON.stringify(this, null, 2));
		};
	}
};

// Load the translator code
const translatorCode = fs.readFileSync(
	path.join(__dirname, '../src/translators/German Legal Databases.js'),
	'utf-8'
);

// Extract the JavaScript functions (skip the JSON header)
const codeStart = translatorCode.indexOf('function detectWeb');
const code = translatorCode.substring(codeStart);

// Evaluate the translator code in global scope
eval(code);

// Test files
const testFiles = [
	'bund.html',
	'bayern.html',
	'Amtsgericht Köln, 262 C 494_06.html',
	'berlin.html',
	'bw.html',
	'hamburg.html',
	'hessen.html',
	'mv.html',
	'ns.html',
	'rp.html',
	'saarland.html',
	'sachsen-anhalt.html',
	'sh.html',
	'th.html',
	'brandenburg.html'
];

console.log('Testing German Legal Databases Translator\n');
console.log('=' . repeat(60));

for (const filename of testFiles) {
	const filepath = path.join(__dirname, filename);
	
	if (!fs.existsSync(filepath)) {
		console.log(`\nSkipping ${filename} (not found)`);
		continue;
	}
	
	console.log(`\n\nTesting: ${filename}`);
	console.log('-'.repeat(60));
	
	try {
		const html = fs.readFileSync(filepath, 'utf-8');
		const dom = new JSDOM(html);
		const doc = dom.window.document;
		
		// Extract URL from HTML comment
		const urlMatch = html.match(/saved from url=\(\d+\)(.*?)-->/);
		const url = urlMatch ? urlMatch[1].trim() : 'https://example.com';
		
		// Test detection
		const itemType = detectWeb(doc, url);
		console.log(`Detected type: ${itemType || 'none'}`);
		
		if (itemType) {
			// Test extraction
			console.log('\nExtracted metadata:');
			doWeb(doc, url);
		}
	} catch (error) {
		console.error(`Error testing ${filename}:`, error.message);
	}
}

console.log('\n\n' + '='.repeat(60));
console.log('Testing complete');
