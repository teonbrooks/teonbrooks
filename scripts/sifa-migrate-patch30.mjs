#!/usr/bin/env node
/**
 * Fills in the structured `location` on the nine positions and three
 * education records that lack one, matching the seven positions that
 * already have it (community.lexicon.location.address, ISO country codes).
 * Personal Sabbatical is left without a location. Also adds the missing
 * state (California) to Stanford's existing Palo Alto location.
 *
 * Usage:
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch30.mjs --dry-run
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch30.mjs
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

const addr = (locality, region, country = 'US') => ({
	$type: 'community.lexicon.location.address',
	country,
	region,
	locality
});
const CHAPEL_HILL = addr('Chapel Hill', 'North Carolina');
const NYC = addr('New York', 'New York');

const UPDATES = [
	['position', '3mvlscl3adt2o', 'UNC — Research Assistant', CHAPEL_HILL],
	['position', '3mizjdquezo2b', 'UNC — Research Lab Manager', CHAPEL_HILL],
	['position', '3mvlr25qzt72d', 'Recurse Center — Recurser (2023)', addr('Brooklyn', 'New York')],
	['position', '3mvlr25nnab2g', 'Mozilla — Senior Data Scientist', NYC],
	['position', '3mvlr25p6hj2a', 'Mozilla — Senior Product Manager, ML', NYC],
	['position', '3mizjdquezf2b', 'Mozilla — Staff Data Scientist', NYC],
	['position', '3mvlmkhngze2k', 'NYU — Teaching Assistant', NYC],
	['position', '3mvlmkhlfnx2o', 'datalus — Principal Consultant', NYC],
	['position', '3mizjdque232b', 'CUNY — Adjunct Assistant Professor (College of Staten Island)', addr('Staten Island', 'New York')],
	['education', '3mizjdquezr2b', "NYU — Master's Degree", NYC],
	['education', '3mizjdquezp2b', 'NYU — Ph.D.', NYC],
	['education', '3mizjdquezq2b', 'UNC — B.S.', CHAPEL_HILL]
];

async function main() {
	console.log(DRY_RUN ? '=== DRY RUN — no writes will be made ===\n' : '=== LIVE RUN — writing to Sifa ===\n');
	const token = DRY_RUN ? null : await login();

	for (const [kind, rkey, label, location] of UPDATES) {
		const collection = `id.sifa.profile.${kind}`;
		const record = await getRecord(collection, rkey);
		if (record.location) {
			console.log(`SKIP ${collection}/${rkey} (${label}): already has a location`);
			continue;
		}
		record.location = location;
		await putRecord(token, collection, rkey, record, `${label} → ${location.locality}, ${location.region}`);
	}

	const stanford = await getRecord('id.sifa.profile.position', '3mizjdquezj2b');
	if (stanford.location && !stanford.location.region) {
		stanford.location.region = 'California';
		await putRecord(token, 'id.sifa.profile.position', '3mizjdquezj2b', stanford, 'Stanford — add region California to Palo Alto');
	}

	console.log(`\n${opCount} operations ${DRY_RUN ? 'planned' : 'completed'}.`);
}

main().catch((err) => {
	console.error('\nPatch failed:', err.message);
	process.exit(1);
});
