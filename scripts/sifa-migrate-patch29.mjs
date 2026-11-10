#!/usr/bin/env node
/**
 * Restores the "the" in "Society for the Neurobiology of Language" (the
 * official name, per neurolang.org) in the issuer, agentRef.name and the two
 * travel award titles, after patch28 removed it to match Wikidata's label.
 * The Wikidata entityRef (Q105411280) is correct and stays.
 *
 * Usage:
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch29.mjs --dry-run
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch29.mjs
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

const WRONG = 'Society for Neurobiology of Language';
const RIGHT = 'Society for the Neurobiology of Language';

async function listHonors() {
	const url = new URL(`${PDS_URL}/xrpc/com.atproto.repo.listRecords`);
	url.searchParams.set('repo', DID);
	url.searchParams.set('collection', 'id.sifa.profile.honor');
	url.searchParams.set('limit', '100');
	const res = await fetch(url);
	if (!res.ok) throw new Error(`listRecords failed: ${res.status} ${await res.text()}`);
	return (await res.json()).records;
}

async function main() {
	console.log(DRY_RUN ? '=== DRY RUN — no writes will be made ===\n' : '=== LIVE RUN — writing to Sifa ===\n');
	const token = DRY_RUN ? null : await login();

	for (const { uri, value: honor } of await listHonors()) {
		if (!honor.title.includes(WRONG) && honor.issuer !== WRONG) continue;
		honor.title = honor.title.replace(WRONG, RIGHT);
		honor.issuer = RIGHT;
		if (honor.agentRef) honor.agentRef.name = RIGHT;
		await putRecord(token, 'id.sifa.profile.honor', uri.split('/').pop(), honor, `${honor.title} — restore "the" in issuer/title`);
	}

	console.log(`\n${opCount} operations ${DRY_RUN ? 'planned' : 'completed'}.`);
}

main().catch((err) => {
	console.error('\nPatch failed:', err.message);
	process.exit(1);
});
