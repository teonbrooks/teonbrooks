#!/usr/bin/env node
/**
 * Restores links that were lost when descriptions got rewritten/consolidated
 * in earlier patches, formatted IEEE-style ([1] inline, references listed at
 * the end):
 *  - Stanford: the BIDS/MNE-BIDS mention had 4 hyperlinks (project sites +
 *    papers) in the old portfolio.toml that never carried over when this
 *    content was added to Sifa.
 *  - Mozilla Senior Data Scientist: the original combined 2017-2022
 *    description had a "Full Biosketch: https://github.com/teonbrooks/"
 *    line that got dropped when patch2 split it by title.
 *  - DIY Sci Thai: the old portfolio.toml had both a Photos link and a
 *    Project Summary link; only the Project Summary (as upstreamUrl/links)
 *    made it into Sifa.
 *
 * Usage:
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch8.mjs --dry-run
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch8.mjs
 */

const DID = 'did:plc:yl7wcldipsfnjdww2jg5mnrv';
const PDS_URL = process.env.SIFA_PDS_URL ?? 'https://inkcap.us-east.host.bsky.network';
const DRY_RUN = process.argv.includes('--dry-run');

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

let opCount = 0;

async function getRecord(collection, rkey) {
	const url = new URL(`${PDS_URL}/xrpc/com.atproto.repo.getRecord`);
	url.searchParams.set('repo', DID);
	url.searchParams.set('collection', collection);
	url.searchParams.set('rkey', rkey);
	const res = await fetch(url);
	if (!res.ok) throw new Error(`getRecord failed (${collection}/${rkey}): ${res.status} ${await res.text()}`);
	return (await res.json()).value;
}

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

async function main() {
	console.log(DRY_RUN ? '=== DRY RUN — no writes will be made ===\n' : '=== LIVE RUN — writing to Sifa ===\n');
	const token = DRY_RUN ? null : await login();

	// 1. Stanford: restore BIDS/MNE-BIDS links, IEEE-style
	const stanford = await getRecord('id.sifa.profile.position', '3mizjdquezj2b');
	stanford.description = stanford.description
		.replace(
			'core contributor to (1) the Brain Imaging Data Structure project for the inclusion of MEG into the specification, and to (2) the MNE-BIDS project to provide a software implementation.',
			'core contributor to [1] the Brain Imaging Data Structure project for the inclusion of MEG into the specification, and to [2] the MNE-BIDS project to provide a software implementation.'
		)
		.replace(
			'Advisor: Dr. Russell Poldrack.',
			'Advisor: Dr. Russell Poldrack.\n\n' +
				'[1] https://bids.neuroimaging.io/ ; https://www.nature.com/articles/sdata2018110\n' +
				'[2] https://github.com/mne-tools/mne-bids ; https://joss.theoj.org/papers/10.21105/joss.01896'
		);
	await putRecord(token, 'id.sifa.profile.position', '3mizjdquezj2b', stanford, 'Stanford — restore BIDS/MNE-BIDS links');

	// 2. Mozilla Senior Data Scientist: restore Full Biosketch link
	const mozilla = await getRecord('id.sifa.profile.position', '3mvlr25nnab2g');
	mozilla.description += '\n\nFull biosketch available [1].\n\n[1] https://github.com/teonbrooks/';
	await putRecord(token, 'id.sifa.profile.position', '3mvlr25nnab2g', mozilla, 'Mozilla Senior Data Scientist — restore Full Biosketch link');

	// 3. DIY Sci Thai: restore Photos link
	const diySciThai = await getRecord('id.sifa.profile.involvement', '3mvlmkhtkvd2y');
	diySciThai.description += '\n\nProject photos available [1].\n\n[1] https://photos.app.goo.gl/4zGBCM5C634B4nf9A';
	await putRecord(token, 'id.sifa.profile.involvement', '3mvlmkhtkvd2y', diySciThai, 'DIY Sci Thai — restore Photos link');

	console.log(`\n${opCount} operations ${DRY_RUN ? 'planned' : 'completed'}.`);
}

main().catch((err) => {
	console.error('\nPatch failed:', err.message);
	process.exit(1);
});
