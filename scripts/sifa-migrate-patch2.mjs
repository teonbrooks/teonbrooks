#!/usr/bin/env node
/**
 * Second follow-up pass, from the 3-way reconciliation (Sifa / portfolio.toml /
 * the résumé PDF):
 *  - Gotham Data Clinic: President start date -> 2019-11 (matches Board Member)
 *  - datalus: fold the NYU Product Manager / BrainWaves platform work into
 *    the BrainWaves sub-entry description
 *  - Mozilla 2017-2022: split into "Senior Data Scientist" (2017-11 to
 *    2021-11) and "Senior Product Manager, Machine Learning" (2021-11 to
 *    2022-03), each with its own résumé-sourced description
 *  - Mozilla 2024: add description (title stays Staff Data Scientist)
 *  - Recurse Center: add the earlier May-June 2023 stint (distinct from the
 *    existing Nov 2024-Feb 2025 one)
 *  - Meta FAIR + Statespace: enrich descriptions from the résumé
 *  - self.about: replace with the reconciled short bio
 *
 * Usage:
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch2.mjs --dry-run
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch2.mjs
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

	// 1. Gotham Data Clinic: merge Board Member (involvement) into President (position)
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
			'Originally founded in 2019 as CiELabs, the nonprofit was on hiatus through the pandemic. In 2023, we rebranded and refocused our efforts.'
	}, 'Gotham Data Clinic — merge into President (employmentType: boardMember), start date -> 2019-11');

	await deleteRecord(token, 'id.sifa.profile.involvement', '3mvdrgbjaj422', 'Board Member @ Gotham Data Clinic (merged into position)');

	// Personal Sabbatical (no company — matches how the résumé itself lists it)
	await createRecord(token, 'id.sifa.profile.position', {
		$type: 'id.sifa.profile.position',
		title: 'Personal Sabbatical',
		startedAt: '2022-11',
		endedAt: '2023-12',
		description:
			'Undertook an extended period of personal time off for bereavement, and for personal development. Enhanced web development and machine learning skills through intensive professional development at the Recurse Center.',
		createdAt: nowIso()
	}, 'Personal Sabbatical, Nov 2022 - Dec 2023');

	// 2. datalus: fold NYU Product Manager / BrainWaves platform description into the BrainWaves sub-entry
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
			'Led the end-to-end development of a novel all-in-one experimentation platform and application designed for teaching, developing, and conducting EEG-based psychology and neuroscience experiments. Conducted co-design and co-development practices to create the app for high school students and their teachers. Implemented the app in the classroom, reaching 10 schools with 30 students in each class.\n\n' +
			'Memorial Sloan Kettering, Gerstner Sloan Kettering — Consultant: Instructor (2025–Present)\n' +
			'Instructor for G440: Introduction to Scientific Python. https://github.com/datalus-dev/gsk-intro-scientific-python-course'
	}, 'datalus — fold BrainWaves platform description into BrainWaves sub-entry');

	// 3. Mozilla 2017-2022: delete the single combined record, create two title-split records
	await deleteRecord(token, 'id.sifa.profile.position', '3mizjdquezh2b', 'Staff Data Scientist 2017-2022 (superseded by title split)');

	await createRecord(token, 'id.sifa.profile.position', {
		$type: 'id.sifa.profile.position',
		title: 'Senior Data Scientist',
		company: 'Mozilla Corporation',
		entityRef: 'http://www.wikidata.org/entity/Q169925',
		startedAt: '2017-11',
		endedAt: '2021-11',
		description:
			'Designed and executed A/B tests and other experiments to drive new product development and optimize the search experience within Firefox.\n' +
			'Leveraged non-parametric statistical methods to conduct large-scale data analysis and modeling on datasets of hundreds of millions of users to better understand how users engage with our search products.\n' +
			'Combined survey methods with observational studies of browser usage to understand how user sentiment maps onto user behavior with their interactions with search in Firefox.\n' +
			'Mentored two data scientist interns on exploratory data analysis and data science practices.\n' +
			'Launched and managed the Data@Mozilla blog.',
		createdAt: nowIso()
	}, 'Senior Data Scientist @ Mozilla, 2017-11 to 2021-11');

	await createRecord(token, 'id.sifa.profile.position', {
		$type: 'id.sifa.profile.position',
		title: 'Senior Product Manager, Machine Learning',
		company: 'Mozilla Corporation',
		entityRef: 'http://www.wikidata.org/entity/Q169925',
		startedAt: '2021-11',
		endedAt: '2022-03',
		description:
			'Led the strategic development and implementation of on-device machine learning capabilities within new browser products.\n' +
			'Designed robust telemetry instrumentation to enable contextual recommendation within Firefox.\n' +
			'Mentored students at the AUC Data Science Initiative on responsible and trustworthy AI within product development and design.',
		createdAt: nowIso()
	}, 'Senior Product Manager, ML @ Mozilla, 2021-11 to 2022-03');

	// 4. Mozilla 2024: add description (title stays Staff Data Scientist)
	await putRecord(token, 'id.sifa.profile.position', '3mizjdquezf2b', {
		$type: 'id.sifa.profile.position',
		title: 'Staff Data Scientist',
		company: 'Mozilla Corporation',
		endedAt: '2024-07',
		createdAt: '2026-04-09T00:09:11.167Z',
		entityRef: 'http://www.wikidata.org/entity/Q169925',
		isPrimary: false,
		startedAt: '2024-01',
		description:
			'Designed and implemented experimentation frameworks for novel machine-learning powered search suggestions and user experiences within Firefox Suggest, a novel first-party search product.\n' +
			'Conducted in-depth exploratory data analyses on datasets encompassing hundreds of millions of users, extracting critical insights to inform revenue and advertising strategies.\n' +
			'Designed and implemented derivative data tables to provide granular understanding and reporting on key performance indicators within the search and advertising business.'
	}, 'Mozilla 2024 — add description');

	// 5. Recurse Center: add the earlier May-June 2023 stint
	await createRecord(token, 'id.sifa.profile.position', {
		$type: 'id.sifa.profile.position',
		title: 'Recurser',
		company: 'Recurse Center',
		startedAt: '2023-05',
		endedAt: '2023-06',
		description: 'Summer 1 Half-Batch.',
		createdAt: nowIso()
	}, 'Recurser @ Recurse Center, May-June 2023');

	// 6. Meta FAIR: enrich description
	await putRecord(token, 'id.sifa.profile.position', '3mizjdque242b', {
		$type: 'id.sifa.profile.position',
		title: 'Data Scientist',
		company: 'Meta (United States)',
		location: { $type: 'community.lexicon.location.address', region: 'New York', country: 'US', locality: 'New York' },
		createdAt: '2026-04-09T00:09:11.167Z',
		entityRef: 'http://www.wikidata.org/entity/Q380',
		startedAt: '2025-08',
		description:
			'Leads the development of NeuralFetch and contributes to the NeuroAI open-source software suite to download, validate, and analyze multimodal neuroscience datasets (fMRI, MEG, EEG, iEEG, fNIRS, EMG).\n' +
			'Standardizes public datasets for ingestion and validates research studies using machine learning decoding techniques.\n' +
			'Develops an automated validation and replication framework for neuroscience research projects.\n\n' +
			'(Meta via Magnit)'
	}, 'Meta FAIR — enrich description');

	// 7. Statespace: enrich description
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
			'Launched and delivered a joint product venture between the core product team and R&D, to create a mouse sensitivity finder for first-person shooter gaming, based off of my team’s research.\n' +
			'• Led cross-functional product initiatives with product and engineering teams.\n' +
			'• Led and mentored a team of five research scientists and one research assistant to publish research on motor acuity and successfully integrate key research insights into Aim Lab, the flagship aim trainer product.\n' +
			'• Led and coordinated digital health initiatives in partnership with clinics and university football teams to develop cognitive assessments for altered states of consciousness, including concussion.\n' +
			'• Impacted by a substantial company-wide reduction of workforce, which led to the cancellation of the R&D function.'
	}, 'Statespace — enrich description');

	// 8. self.about: replace with the reconciled short bio
	await putRecord(token, 'id.sifa.profile.self', 'self', {
		$type: 'id.sifa.profile.self',
		about:
			'Teon L. Brooks, Ph.D is the co-founder of the nonprofit Gotham Data Clinic and a data scientist working with the Brain & AI team at Meta FAIR. He has expertise in data science, open-source software development, neuroimaging, and neuroinformatics, with a research background in psycholinguistics, cognitive science, and data science education.\n\n' +
			'Outside of research, Teon is working on passports.social (alpha), a new open social app focused on life logging and discovery. He posts on Bluesky at @teonbrooks.com.',
		openTo: ['id.sifa.defs#speakingEngagements'],
		headline: 'Neural Data Scientist | CogSci PhD',
		createdAt: '2026-04-15T21:04:41.684Z',
		industries: [
			{ domain: 'id.sifa.defs#domainDataScience', industry: 'id.sifa.defs#industryTechnology' },
			{ domain: 'id.sifa.defs#domainEdtech', industry: 'id.sifa.defs#industryEducation' },
			{ domain: 'id.sifa.defs#domainOpenSource', industry: 'id.sifa.defs#industryNonprofit' }
		],
		availableToUtc: 21,
		availableFromUtc: 13,
		preferredWorkplace: ['id.sifa.defs#remoteLocal', 'id.sifa.defs#remoteGlobal']
	}, 'self.about — replace with reconciled short bio');

	console.log(`\n${opCount} operations ${DRY_RUN ? 'planned' : 'completed'}.`);
}

main().catch((err) => {
	console.error('\nPatch failed:', err.message);
	process.exit(1);
});
