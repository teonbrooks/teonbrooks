#!/usr/bin/env node
/**
 * Follow-up corrections to the initial Sifa migration (see sifa-migrate.mjs):
 *  - CLEO Conference talk: add the archive PDF link
 *  - "Arrival" talk: link type linkEvent -> linkRecording (it's an interview/podcast)
 *  - datalus, LLC: relabel the OpenBCI and BrainWaves sub-roles
 *  - CUNY: add end date (May 2026) and mention College of Staten Island in the description
 *
 * Usage:
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch1.mjs --dry-run
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch1.mjs
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

	// 1. CLEO Conference talk: add archive link
	await putRecord(token, 'id.sifa.profile.presentationDelivery', '3mvlmkh44zk2g', {
		date: '2017-05-01',
		mode: 'community.lexicon.calendar.event#inperson',
		role: 'id.sifa.defs#panelist',
		$type: 'id.sifa.profile.presentationDelivery',
		title: 'Scientist + Advocacy Panel',
		location: 'San Jose, CA',
		createdAt: '2026-09-15T21:56:51.812Z',
		eventName: 'CLEO Conference',
		links: [
			{
				uri: 'https://cleoconference.org/wp-content/uploads/2024/11/CLEO-Archive-2017.pdf',
				type: 'id.sifa.defs#linkEvent'
			}
		]
	}, 'CLEO Conference — add archive PDF link');

	// 2. Arrival: link type linkEvent -> linkRecording
	await putRecord(token, 'id.sifa.profile.presentationDelivery', '3mvlmkh5t5o2a', {
		date: '2017-12-01',
		mode: 'community.lexicon.calendar.event#inperson',
		role: 'id.sifa.defs#presenter',
		$type: 'id.sifa.profile.presentationDelivery',
		links: [
			{
				uri: 'https://www.tested.com/podcasts/offworld/872230-offworld-arrival-2016/',
				type: 'id.sifa.defs#linkRecording'
			}
		],
		title: 'Arrival',
		location: 'San Francisco, CA',
		createdAt: '2026-09-15T21:56:51.869Z',
		eventName: 'Tested: Offworld'
	}, 'Arrival — link type -> linkRecording');

	// 3. datalus, LLC: relabel OpenBCI and BrainWaves sub-roles
	await putRecord(token, 'id.sifa.profile.position', '3mvlmkhlfnx2o', {
		$type: 'id.sifa.profile.position',
		title: 'Principal Consultant',
		company: 'datalus, LLC',
		createdAt: '2026-09-15T21:56:52.265Z',
		startedAt: '2015-08',
		description:
			'OpenBCI — Consultant: Research Scientist (2015-08 – 2016-06)\n' +
			'Establishing validation and testing protocols for EEG hardware. Developing SDKs and APIs for OpenBCI Hardware. Developing an open-source software platform for running experiments, stream data for real-time analytics. Advising on research applications of wireless EEG.\n\n' +
			'BrainWaves — Consultant: Product Manager (2017–2022)\n' +
			'Democratizing Cognitive Science.\n\n' +
			'Memorial Sloan Kettering, Gerstner Sloan Kettering — Consultant: Instructor (2025–Present)\n' +
			'Instructor for G440: Introduction to Scientific Python. https://github.com/datalus-dev/gsk-intro-scientific-python-course'
	}, 'datalus — relabel OpenBCI/BrainWaves sub-roles');

	// 4. CUNY: add end date + mention College of Staten Island
	await putRecord(token, 'id.sifa.profile.position', '3mizjdque232b', {
		$type: 'id.sifa.profile.position',
		title: 'Adjunct Assistant Professor',
		company: 'City University of New York',
		agentRef: {
			did: 'did:plc:effuh6qbrkdwp4rwyrlbyvyt',
			name: 'City University of New York',
			entityRef: 'http://www.wikidata.org/entity/Q762266'
		},
		createdAt: '2026-04-09T00:09:11.167Z',
		entityRef: 'http://www.wikidata.org/entity/Q762266',
		startedAt: '2026-01',
		endedAt: '2026-05',
		companyDid: 'did:plc:effuh6qbrkdwp4rwyrlbyvyt',
		onBehalfOf: null,
		description: 'College of Staten Island. Spring 2026 - EDD 642: Creative Computing in Education.',
		employmentType: 'id.sifa.defs#partTime'
	}, 'CUNY — add end date + College of Staten Island');

	console.log(`\n${opCount} operations ${DRY_RUN ? 'planned' : 'completed'}.`);
}

main().catch((err) => {
	console.error('\nPatch failed:', err.message);
	process.exit(1);
});
