#!/usr/bin/env node
/**
 * Sifa's presentationDelivery.date field requires a full YYYY-MM-DD (no
 * YYYY-MM option — confirmed from the lexicon schema: "the day-only shape
 * is enforced at the app layer"). 14 records only ever had month/year
 * precision from their original source and got the 1st of the month as a
 * placeholder day. This adds a short note to each saying so, appended to
 * whatever description already exists (poster author lists, in 8 cases).
 *
 * Usage:
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch7.mjs --dry-run
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch7.mjs
 */

const DID = 'did:plc:yl7wcldipsfnjdww2jg5mnrv';
const PDS_URL = process.env.SIFA_PDS_URL ?? 'https://inkcap.us-east.host.bsky.network';
const DRY_RUN = process.argv.includes('--dry-run');

const NOTE = 'Exact day unknown; the date above uses the 1st of the month as a placeholder.';

async function login() {
	const identifier = process.env.SIFA_IDENTIFIER;
	const password = process.env.SIFA_APP_PASSWORD;
	if (!identifier || !password) {
		throw new Error('Set SIFA_IDENTIFIER and SIFA_APP_PASSWORD env vars (an app password, not your main password).');
	}
	const res = await fetch(`${PDS_URL}/xrpc/com.atproto.server.createSession`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ identifier, password })
	});
	if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`);
	const { accessJwt, did } = await res.json();
	if (did !== DID) throw new Error(`Logged in as ${did}, expected ${DID} — wrong account?`);
	return accessJwt;
}

async function getRecord(collection, rkey) {
	const url = new URL(`${PDS_URL}/xrpc/com.atproto.repo.getRecord`);
	url.searchParams.set('repo', DID);
	url.searchParams.set('collection', collection);
	url.searchParams.set('rkey', rkey);
	const res = await fetch(url);
	if (!res.ok) throw new Error(`getRecord failed (${collection}/${rkey}): ${res.status} ${await res.text()}`);
	return (await res.json()).value;
}

let opCount = 0;

async function putRecord(token, collection, rkey, record, label) {
	opCount++;
	console.log(`[${opCount}] EDIT ${collection}/${rkey}: ${label}`);
	if (DRY_RUN) return;
	const res = await fetch(`${PDS_URL}/xrpc/com.atproto.repo.putRecord`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
		body: JSON.stringify({ repo: DID, collection, rkey, record })
	});
	if (!res.ok) throw new Error(`putRecord failed (${collection}/${rkey}, ${label}): ${res.status} ${await res.text()}`);
}

// All 14 records with a placeholder day: 8 posters + 2 workshops + 4 talks
const RKEYS = [
	'3mvlmkhaf4p2o', // Transparent Effects of Partial Priming on Compounds
	'3mvlmkhbbdj2d', // Sentential Support for Morpho-Orthographic Decomposition...
	'3mvlmkhc5ad2z', // Combinatorial Effects within Compound Words...
	'3mvlmkhczde2i', // Trends in MEG and EEG data processing using MNE
	'3mvlmkhdx5x2k', // OpenEXP: An open-source platform...
	'3mvlmkhhed326', // MEG and EEG data processing using MNE: News from the trenches
	'3mvlmkhi7ux2k', // MNE-BIDS: Making MEG BIDS compatible datasets easily
	'3mvlmkhj2z326', // MNE-BIDS: MNE-Python + BIDS = easy dataset interaction
	'3mvlscl6irr2n', // Intro to R and Tidyverse for Data Science (Atlanta)
	'3mvlscl5itu2i', // Intro to R and Tidyverse for Data Science (Mozilla Internal)
	'3mvlmkh7ky42i', // Doctoral Convocation: Student Speaker
	'3mvlmkh6pdt2n', // The Accessible Future of Neuroscience Panel
	'3mvlmkh5t5o2a', // Arrival
	'3mvlmkh44zk2g' // Scientist + Advocacy Panel
];

async function main() {
	console.log(DRY_RUN ? '=== DRY RUN — no writes will be made ===\n' : '=== LIVE RUN — writing to Sifa ===\n');
	const token = DRY_RUN ? null : await login();

	for (const rkey of RKEYS) {
		const record = await getRecord('id.sifa.profile.presentationDelivery', rkey);
		if ((record.description ?? '').includes(NOTE)) {
			console.log(`(skip) ${rkey}: ${record.title} — note already present`);
			continue;
		}
		record.description = record.description ? `${record.description}\n\n${NOTE}` : NOTE;
		await putRecord(token, 'id.sifa.profile.presentationDelivery', rkey, record, `${record.title} — add placeholder-day note`);
	}

	console.log(`\n${opCount} operations ${DRY_RUN ? 'planned' : 'completed'}.`);
}

main().catch((err) => {
	console.error('\nPatch failed:', err.message);
	process.exit(1);
});
