#!/usr/bin/env node
/**
 * Fifth pass, from a full line-by-line audit of the CV/résumé against Sifa:
 *  - Remove "•" bullets from Gotham Data Clinic and Statespace descriptions
 *    (making formatting consistent — plain paragraphs everywhere)
 *  - Add missing advisor names: Stanford (Poldrack), Télécom Paris
 *    (Gramfort), UNC Research Lab Manager (Gordon)
 *  - Split the Brooklyn Community Board 1 involvement into two accurate
 *    terms (Jun 2020-Jun 2022, then May 2025-Present) instead of one
 *    misleading continuous span
 *  - Add MNE-Realtime as its own project (was only mentioned in prose in
 *    the old portfolio.toml, never migrated)
 *  - Add three missing talks: Computational Education Commons on the
 *    Atmosphere, the QTPOC Alumni Panel, and rstudio::global(2021)
 *
 * Usage:
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch5.mjs --dry-run
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch5.mjs
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
const nowIso = () => new Date().toISOString();

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

async function main() {
	console.log(DRY_RUN ? '=== DRY RUN — no writes will be made ===\n' : '=== LIVE RUN — writing to Sifa ===\n');
	const token = DRY_RUN ? null : await login();

	// 1. Gotham Data Clinic: remove bullets
	await putRecord(token, 'id.sifa.profile.position', '3mizjdque222b', {
		$type: 'id.sifa.profile.position',
		title: 'President',
		company: 'Gotham Data Clinic',
		agentRef: { did: 'did:plc:34pb7avp5yrjan4n3pfzq26f', name: 'Gotham Data Clinic', entityRef: 'https://ror.org/03k0d2d56' },
		createdAt: '2026-04-09T00:09:11.167Z',
		entityRef: 'https://ror.org/03k0d2d56',
		isPrimary: true,
		startedAt: '2019-11',
		companyDid: 'did:plc:34pb7avp5yrjan4n3pfzq26f',
		employmentType: 'id.sifa.defs#boardMember',
		description:
			'We are the Gotham Data Clinic, and we are focused on researching, building, and sharing data science education tools for the next generation of scientists and technologists.\n\n' +
			'Originally founded in 2019 as CiELabs, the nonprofit was on hiatus through the pandemic. In 2023, we rebranded and refocused our efforts.\n\n' +
			'Founded and established the nonprofit from its incorporation through its application for federal tax exemption. Lead workshops on data literacy with partner organizations. Build new partnerships with NYC Public Schools and CUNY. Lead product development work for new digital infrastructure to teach data science at scale. Write scholarly work to support both our community and product development work.'
	}, 'Gotham Data Clinic — remove bullet points');

	// 2. Statespace: remove bullets
	await putRecord(token, 'id.sifa.profile.position', '3mizjdquezg2b', {
		$type: 'id.sifa.profile.position',
		title: 'VP: Head of Product, Research and Development',
		company: 'Statespace',
		endedAt: '2022-10',
		location: { $type: 'community.lexicon.location.address', region: 'New York', country: 'US', locality: 'New York' },
		createdAt: '2026-04-09T00:09:11.167Z',
		entityRef: 'https://sifa.id/company/kJ_q-NhnxfJ1UVK3Bdk_Z',
		isPrimary: false,
		startedAt: '2022-05',
		description:
			'Launched and delivered a joint product venture between the core product team and R&D, to create a mouse sensitivity finder for first-person shooter gaming, based off of my team’s research. Led cross-functional product initiatives with product and engineering teams. Led and mentored a team of five research scientists and one research assistant to publish research on motor acuity and successfully integrate key research insights into Aim Lab, the flagship aim trainer product. Led and coordinated digital health initiatives in partnership with clinics and university football teams to develop cognitive assessments for altered states of consciousness, including concussion. Impacted by a substantial company-wide reduction of workforce, which led to the cancellation of the R&D function.'
	}, 'Statespace — remove bullet points');

	// 3. Stanford: add advisor
	await putRecord(token, 'id.sifa.profile.position', '3mizjdquezj2b', {
		$type: 'id.sifa.profile.position',
		title: 'Mozilla Fellow for Open Science, Postdoctoral Scholar',
		company: 'Stanford University',
		endedAt: '2017-12',
		location: { $type: 'community.lexicon.location.address', country: 'US', locality: 'Palo Alto' },
		createdAt: '2026-04-09T00:09:11.167Z',
		entityRef: 'http://www.wikidata.org/entity/Q41506',
		isPrimary: false,
		startedAt: '2016-09',
		description:
			'Open Science + Open Source\n' +
			'I spent my tenure as a Mozilla Fellow for Open Science advocating for the use of open and transparent practices in science. I traveled globally teaching workshops on using open-source technologies, and speaking at conferences.\n\n' +
			'During the fellowship, I became one of the national organizers for the March for Science in Washington, DC. I worked as the Co-Director of Partnerships bringing in over 300 partner organizations to help mobilize scientists and science advocates. This event brought together more than a million people in over 600 cities worldwide.\n\n' +
			'I also worked on a project to build software that enables experimental psychologists and neuroscientists to freely share the experiment protocols and execute their experiments using open-source, and web-based technologies.\n\n' +
			'During my postdoc at Stanford, I was a core contributor to (1) the Brain Imaging Data Structure project for the inclusion of MEG into the specification, and to (2) the MNE-BIDS project to provide a software implementation.\n\n' +
			'Through this project, I hope to build community and code that improve the state of brain science research.\n\n' +
			'Advisor: Dr. Russell Poldrack.'
	}, 'Stanford — add advisor (Dr. Russell Poldrack)');

	// 4. Télécom Paris: add advisor
	await putRecord(token, 'id.sifa.profile.position', '3mizjdquezn2b', {
		$type: 'id.sifa.profile.position',
		title: 'Visiting Research Fellow',
		company: 'Télécom Paris',
		endedAt: '2015-07',
		agentRef: { name: 'Télécom Paris', entityRef: 'http://www.wikidata.org/entity/Q2311820' },
		location: { $type: 'community.lexicon.location.address', country: 'FR', locality: 'Paris' },
		createdAt: '2026-04-09T00:09:11.167Z',
		entityRef: 'http://www.wikidata.org/entity/Q2311820',
		isPrimary: false,
		startedAt: '2014-07',
		description:
			'Visiting research fellow sponsored by the French Embassy\'s Chateaubriand Graduate Research Fellowship. Acquired digital signal processing training. Acquired data analysis skills of electrophysiological data. Acquired machine learning training.\n\n' +
			'Advisor: Dr. Alexandre Gramfort.'
	}, 'Télécom Paris — add advisor (Dr. Alexandre Gramfort)');

	// 5. UNC Research Lab Manager: add advisor
	await putRecord(token, 'id.sifa.profile.position', '3mizjdquezo2b', {
		$type: 'id.sifa.profile.position',
		title: 'Research Lab Manager',
		company: 'University of North Carolina at Chapel Hill',
		endedAt: '2011-07',
		agentRef: { name: 'University of North Carolina at Chapel Hill', entityRef: 'http://www.wikidata.org/entity/Q192334' },
		createdAt: '2026-04-09T00:09:11.167Z',
		entityRef: 'http://www.wikidata.org/entity/Q192334',
		isPrimary: false,
		startedAt: '2008-01',
		description:
			'Manage a language comprehension research lab focused on eye-tracking research.\n\n' +
			'Perform research on word recognition while reading.\n\n' +
			'Advisor: Dr. Peter C. Gordon.'
	}, 'UNC Research Lab Manager — add advisor (Dr. Peter C. Gordon)');

	// 6. Brooklyn CB1: split into two accurate terms
	await deleteRecord(token, 'id.sifa.profile.involvement', '3mvdrfuu7l422', 'Community Board Member (single misleading continuous span, replaced by two terms)');

	await createRecord(token, 'id.sifa.profile.involvement', {
		$type: 'id.sifa.profile.involvement',
		kind: 'id.sifa.defs#involvementCharity',
		role: 'Community Board Member (Brooklyn Community Board 1)',
		agentRef: { name: 'Government of New York City', entityRef: 'http://www.wikidata.org/entity/Q3112559' },
		upstream: 'Government of New York City',
		upstreamUrl: 'https://nyc.gov',
		startedAt: '2020-06',
		endedAt: '2022-06',
		description:
			'Served on the Capital Budget Committee, the Board Budget Committee, the Education Committee, and the Outreach Committee. Created and managed the community board Twitter account (@BrooklynCB1).',
		createdAt: nowIso()
	}, 'Community Board Member, 2020-06 to 2022-06');

	await createRecord(token, 'id.sifa.profile.involvement', {
		$type: 'id.sifa.profile.involvement',
		kind: 'id.sifa.defs#involvementCharity',
		role: 'Community Board Member (Brooklyn Community Board 1)',
		agentRef: { name: 'Government of New York City', entityRef: 'http://www.wikidata.org/entity/Q3112559' },
		upstream: 'Government of New York City',
		upstreamUrl: 'https://nyc.gov',
		startedAt: '2025-05',
		description: 'Chair, Ad Hoc Committee for Social Media.',
		createdAt: nowIso()
	}, 'Community Board Member, 2025-05 to present');

	// 7. MNE-Realtime project
	await createRecord(token, 'id.sifa.profile.project', {
		$type: 'id.sifa.profile.project',
		name: 'MNE-Realtime',
		url: 'https://github.com/mne-tools/mne-realtime',
		startedAt: '2019',
		endedAt: '2023',
		description:
			'Supported realtime data analysis with support for LSL and FieldTrip clients. This project has been deprecated and superseded by mne-lsl.',
		createdAt: nowIso()
	}, 'MNE-Realtime, 2019-2023 (deprecated, superseded by mne-lsl)');

	// 8. Three missing talks
	await createRecord(token, 'id.sifa.profile.presentationDelivery', {
		$type: 'id.sifa.profile.presentationDelivery',
		title: 'Computational Education Commons on the Atmosphere',
		eventName: 'ATScience',
		date: '2026-03-27',
		location: 'Vancouver, B.C.',
		role: 'id.sifa.defs#presenter',
		mode: 'community.lexicon.calendar.event#inperson',
		links: [{ uri: 'https://atproto.science/events/atmosphere2026/', type: 'id.sifa.defs#linkEvent' }],
		createdAt: nowIso()
	}, 'Computational Education Commons on the Atmosphere, ATScience, Mar 2026');

	await createRecord(token, 'id.sifa.profile.presentationDelivery', {
		$type: 'id.sifa.profile.presentationDelivery',
		title: 'QTPOC Alumni Panel: Overcoming Imposter Syndrome',
		eventName: 'New York University Graduate School of Arts and Science',
		date: '2021-02-25',
		location: 'Virtual',
		role: 'id.sifa.defs#panelist',
		mode: 'community.lexicon.calendar.event#virtual',
		createdAt: nowIso()
	}, 'QTPOC Alumni Panel, NYU GSAS, Feb 2021');

	await createRecord(token, 'id.sifa.profile.presentationDelivery', {
		$type: 'id.sifa.profile.presentationDelivery',
		title: 'rstudio::global(2021)',
		eventName: 'RStudio',
		date: '2021-01-21',
		location: 'Virtual',
		role: 'id.sifa.defs#host',
		mode: 'community.lexicon.calendar.event#virtual',
		description: 'Invited co-host for the Language interop session.',
		createdAt: nowIso()
	}, 'rstudio::global(2021), RStudio, Jan 2021');

	console.log(`\n${opCount} operations ${DRY_RUN ? 'planned' : 'completed'}.`);
}

main().catch((err) => {
	console.error('\nPatch failed:', err.message);
	process.exit(1);
});
