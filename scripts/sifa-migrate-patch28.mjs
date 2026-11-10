#!/usr/bin/env node
/**
 * Adds Sifa's structured issuing organization (agentRef + entityRef) to the
 * ten older honors that only have the plain-text `issuer`, matching the five
 * honors that already carry it. Identifiers are Wikidata Q-IDs, reused from
 * existing records where the issuer already appears (NYU, UNC, NSF) and
 * looked up for the rest. Also corrects "Society for the Neurobiology of
 * Language" to its official name, "Society for Neurobiology of Language",
 * in the issuer and in the two award titles that repeat it.
 *
 * Usage:
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch28.mjs --dry-run
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch28.mjs
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

const SNL_WRONG = 'Society for the Neurobiology of Language';
const SNL_RIGHT = 'Society for Neurobiology of Language';

const wd = (q) => `http://www.wikidata.org/entity/${q}`;
const ISSUER_ENTITY_REFS = {
	'New York University': wd('Q49210'),
	'University of North Carolina at Chapel Hill': wd('Q192334'),
	'National Science Foundation': wd('Q304878'),
	[SNL_RIGHT]: wd('Q105411280'),
	'Society of Multivariate Experimental Psychology': wd('Q7552567'),
	OCSDNet: wd('Q50352793')
};

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
		if (honor.agentRef || honor.entityRef) continue;
		honor.issuer = honor.issuer?.replace(SNL_WRONG, SNL_RIGHT);
		honor.title = honor.title.replace(SNL_WRONG, SNL_RIGHT);
		const entityRef = ISSUER_ENTITY_REFS[honor.issuer];
		if (!entityRef) {
			console.log(`SKIP ${honor.title}: no entityRef known for issuer "${honor.issuer}"`);
			continue;
		}
		honor.entityRef = entityRef;
		honor.agentRef = { name: honor.issuer, entityRef };
		await putRecord(token, 'id.sifa.profile.honor', uri.split('/').pop(), honor, `${honor.title} — issuer ${honor.issuer} → ${entityRef.split('/').pop()}`);
	}

	console.log(`\n${opCount} operations ${DRY_RUN ? 'planned' : 'completed'}.`);
}

main().catch((err) => {
	console.error('\nPatch failed:', err.message);
	process.exit(1);
});
