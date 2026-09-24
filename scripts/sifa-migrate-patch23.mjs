#!/usr/bin/env node
/**
 * Fixes the datalus description's OpenBCI sentence to use past-tense verbs
 * (Established/Developed/Advised), matching the convention used by every
 * other bullet in the description (BrainWaves, MSK) and elsewhere on the
 * résumé (Statespace, Mozilla).
 *
 * Usage:
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch23.mjs --dry-run
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch23.mjs
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
	'### OpenBCI — Consultant: Research Scientist (2015–2016)',
	'Established validation and testing protocols for EEG hardware. Developed SDKs and APIs for OpenBCI Hardware. Developed an open-source software platform for running experiments, stream data for real-time analytics. Advised on research applications of wireless EEG.',
	'',
	'### BrainWaves — Consultant: Product Manager (2017–2022)',
	'Led the end-to-end development of a novel all-in-one experimentation platform and application designed for teaching, developing, and conducting EEG-based psychology and neuroscience experiments. Conducted co-design and co-development practices to create the app for high school students and their teachers. Implemented the app in the classroom, reaching 10 schools with 30 students in each class.',
	'',
	'### Memorial Sloan Kettering, Gerstner Sloan Kettering — Consultant: Instructor (2025–Present)',
	'Instructor for G440: Introduction to Scientific Python. https://github.com/datalus-dev/gsk-intro-scientific-python-course'
].join('\n');

async function main() {
	console.log(DRY_RUN ? '=== DRY RUN — no writes will be made ===\n' : '=== LIVE RUN — writing to Sifa ===\n');
	const token = DRY_RUN ? null : await login();

	const datalus = await getRecord('id.sifa.profile.position', '3mvlmkhlfnx2o');
	datalus.description = NEW_DESCRIPTION;
	await putRecord(token, 'id.sifa.profile.position', '3mvlmkhlfnx2o', datalus, 'datalus — OpenBCI sentence to past tense');

	console.log(`\n${opCount} operations ${DRY_RUN ? 'planned' : 'completed'}.`);
}

main().catch((err) => {
	console.error('\nPatch failed:', err.message);
	process.exit(1);
});
