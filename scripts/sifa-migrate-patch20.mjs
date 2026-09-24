#!/usr/bin/env node
/**
 * Splits the Gotham Data Clinic involvement description's third paragraph
 * (five run-on achievement sentences) into one sentence per line, matching
 * the bullet-per-sentence convention used elsewhere (Mozilla, Statespace).
 * The first two paragraphs (mission statement, founding history) stay as
 * they are.
 *
 * Usage:
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch20.mjs --dry-run
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch20.mjs
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

const NEW_DESCRIPTION = [
	'We are the Gotham Data Clinic, and we are focused on researching, building, and sharing data science education tools for the next generation of scientists and technologists.',
	'',
	'Originally founded in 2019 as CiELabs, the nonprofit was on hiatus through the pandemic. In 2023, we rebranded and refocused our efforts.',
	'',
	'Founded and established the nonprofit from its incorporation through its application for federal tax exemption.',
	'Lead workshops on data literacy with partner organizations.',
	'Build new partnerships with NYC Public Schools and CUNY.',
	'Lead product development work for new digital infrastructure to teach data science at scale.',
	'Write scholarly work to support both our community and product development work.'
].join('\n');

async function main() {
	console.log(DRY_RUN ? '=== DRY RUN — no writes will be made ===\n' : '=== LIVE RUN — writing to Sifa ===\n');
	const token = DRY_RUN ? null : await login();

	const gdc = await getRecord('id.sifa.profile.involvement', '3mwbgtzucuq2a');
	gdc.description = NEW_DESCRIPTION;
	await putRecord(token, 'id.sifa.profile.involvement', '3mwbgtzucuq2a', gdc, 'Gotham Data Clinic — split achievements into separate bullets');

	console.log(`\n${opCount} operations ${DRY_RUN ? 'planned' : 'completed'}.`);
}

main().catch((err) => {
	console.error('\nPatch failed:', err.message);
	process.exit(1);
});
