#!/usr/bin/env node
/**
 * Creates id.sifa.profile.course records (role: taught / teaching assistant)
 * for the six entries previously hand-maintained in teaching.toml, linking
 * each to the position it was part of where one exists. Sifa's course record
 * has no term/location/link fields, so the export keeps those as local
 * overlays.
 *
 * Usage:
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch26.mjs --dry-run
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch26.mjs
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

async function createRecord(token, collection, record, label) {
	opCount++;
	console.log(`[${opCount}] CREATE ${collection}: ${label}`);
	if (DRY_RUN) return;
	const res = await fetch(`${PDS_URL}/xrpc/com.atproto.repo.createRecord`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
		body: JSON.stringify({ repo: DID, collection, record })
	});
	if (!res.ok) throw new Error(`createRecord failed (${collection}, ${label}): ${res.status} ${await res.text()}`);
}

async function deleteRecord(token, collection, rkey, label) {
	opCount++;
	console.log(`[${opCount}] DELETE ${collection}/${rkey}: ${label}`);
	if (DRY_RUN) return;
	const res = await fetch(`${PDS_URL}/xrpc/com.atproto.repo.deleteRecord`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
		body: JSON.stringify({ repo: DID, collection, rkey })
	});
	if (!res.ok) throw new Error(`deleteRecord failed (${collection}/${rkey}, ${label}): ${res.status} ${await res.text()}`);
}

const nowIso = () => new Date().toISOString();
const positionUri = (rkey) => `at://${DID}/id.sifa.profile.position/${rkey}`;

const COURSES = [
	{
		name: 'Introduction to Scientific Python',
		number: 'G440',
		institution: 'MSKCC: Gerstner Sloan Kettering Graduate School of Biomedical Sciences',
		role: 'id.sifa.defs#courseTaught',
		startedAt: '2025',
		position: positionUri('3mvlmkhlfnx2o')
	},
	{
		name: 'Creative Computing in Education',
		number: 'EDD 642',
		institution: 'CUNY: College of Staten Island',
		role: 'id.sifa.defs#courseTaught',
		startedAt: '2026-01',
		endedAt: '2026-05',
		position: positionUri('3mizjdque232b')
	},
	{
		name: 'Statistical Programming using R',
		number: 'STAT 412/612',
		institution: 'American University',
		role: 'id.sifa.defs#courseTaught',
		startedAt: '2021-01',
		endedAt: '2021-05',
		position: positionUri('3mizjdquezi2b')
	},
	{
		name: 'Lab in Cognitive Neuroscience',
		number: 'PSYCH.UA.0300-007',
		institution: 'New York University',
		role: 'id.sifa.defs#courseTeachingAssistant',
		startedAt: '2012-09',
		endedAt: '2012-12',
		position: positionUri('3mvlmkhngze2k')
	},
	{
		name: 'Intro to R and Tidyverse for Data Science',
		institution: 'Mozilla (Internal Workshop)',
		role: 'id.sifa.defs#courseTaught',
		startedAt: '2019-12',
		endedAt: '2019-12',
		position: positionUri('3mvlr25nnab2g')
	},
	{
		name: 'Intro to R and Tidyverse for Data Science',
		institution: 'Atlanta Workshop',
		role: 'id.sifa.defs#courseTaught',
		startedAt: '2019-10',
		endedAt: '2019-10'
	}
];

async function main() {
	console.log(DRY_RUN ? '=== DRY RUN — no writes will be made ===\n' : '=== LIVE RUN — writing to Sifa ===\n');
	const token = DRY_RUN ? null : await login();

	for (const c of COURSES) {
		await createRecord(
			token,
			'id.sifa.profile.course',
			{ $type: 'id.sifa.profile.course', ...c, createdAt: nowIso() },
			`${c.number ? `${c.number}: ` : ''}${c.name} (${c.institution})`
		);
	}

	console.log(`\n${opCount} operations ${DRY_RUN ? 'planned' : 'completed'}.`);
}

main().catch((err) => {
	console.error('\nPatch failed:', err.message);
	process.exit(1);
});
