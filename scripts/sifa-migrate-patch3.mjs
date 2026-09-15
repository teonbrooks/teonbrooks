#!/usr/bin/env node
/**
 * Third follow-up pass, closing the remaining gaps found in a full CV.pdf
 * section-by-section check:
 *  - American University: add the STAT 412/612 course code
 *  - Merge "Fellow for Open Science" (Mozilla Foundation) + "Mozilla Fellow,
 *    Postdoctoral Scholar" (Stanford) into one record, housed at Stanford,
 *    combining both descriptions
 *  - UNC Research Assistant in neurobiology (2007-2008) — never actually
 *    created despite being agreed on earlier
 *  - Doctoral Student @ NYU: add description (dissertation, committee, NYU
 *    Cog Collective)
 *  - Two workshops from the CV's Teaching Experience section, as
 *    presentationDelivery (role: workshop)
 *  - Professional Organizations, as involvement (kind: involvementOther —
 *    no dedicated "membership" kind exists in the schema)
 *  - Languages: add English (native), set proficiency on French/Portuguese
 *  - Skills: add JavaScript
 *
 * Usage:
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch3.mjs --dry-run
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch3.mjs
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

	// 1. American University: add STAT 412/612 course code
	await putRecord(token, 'id.sifa.profile.position', '3mizjdquezi2b', {
		$type: 'id.sifa.profile.position',
		title: 'Adjunct Senior Professorial Lecturer',
		company: 'American University',
		endedAt: '2021-05',
		location: { $type: 'community.lexicon.location.address', region: 'New York', country: 'US', locality: 'New York' },
		createdAt: '2026-04-09T00:09:11.167Z',
		entityRef: 'http://www.wikidata.org/entity/Q168000',
		isPrimary: false,
		startedAt: '2021-01',
		description:
			'STAT 412/612: Teaching graduate/advanced-undergraduate level Statistical Programming in R\n' +
			'- Foundations in R\n' +
			'- Foundation in Tidyverse\n' +
			'- Data Exploration, Transformation, Analysis, and Modeling'
	}, 'American University — add STAT 412/612 course code');

	// 2. Merge Fellow for Open Science (Mozilla Foundation) + Mozilla Fellow, Postdoctoral Scholar (Stanford)
	await deleteRecord(token, 'id.sifa.profile.position', '3mizjdquezk2b', 'Fellow for Open Science @ Mozilla Foundation (merged into Stanford record)');
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
			'Through this project, I hope to build community and code that improve the state of brain science research.'
	}, 'Mozilla Fellow for Open Science, Postdoctoral Scholar @ Stanford — merged record');

	// 3. UNC Research Assistant, neurobiology (2007-2008) — never actually created
	await createRecord(token, 'id.sifa.profile.position', {
		$type: 'id.sifa.profile.position',
		title: 'Research Assistant',
		company: 'University of North Carolina at Chapel Hill',
		startedAt: '2007',
		endedAt: '2008',
		description: 'Research Assistant in neurobiology. Advisor: Dr. Mohanish Deshmukh.',
		createdAt: nowIso()
	}, 'Research Assistant, neurobiology @ UNC, 2007-2008');

	// 4. Doctoral Student @ NYU: add description
	await putRecord(token, 'id.sifa.profile.position', '3mizjdquezl2b', {
		$type: 'id.sifa.profile.position',
		title: 'Doctoral Student',
		company: 'New York University',
		endedAt: '2017-05',
		agentRef: { did: 'did:plc:afmqbjilprvwue2qmlhvyfno', name: 'New York University', entityRef: 'http://www.wikidata.org/entity/Q49210' },
		location: { $type: 'community.lexicon.location.address', region: 'New York', country: 'US', locality: 'New York' },
		createdAt: '2026-04-09T00:09:11.167Z',
		entityRef: 'http://www.wikidata.org/entity/Q49210',
		isPrimary: false,
		startedAt: '2011-09',
		companyDid: 'did:plc:afmqbjilprvwue2qmlhvyfno',
		description:
			'Ph.D. in Experimental Psychology: Cognition and Perception. Dissertation: "Minding the Gap between Eye-tracking and Neurophysiology in Reading." Committee: Dr. Alec Marantz, Dr. David Poeppel, Dr. Brian McElree.\n\n' +
			'President, NYU Cog Collective (2015–2017) — cofounder of the student organization representing the Cognition and Perception program; organized workshops and hosted socials.'
	}, 'Doctoral Student @ NYU — add description');

	// 5. Two workshops from the CV's Teaching Experience section -> presentationDelivery (role: workshop)
	await createRecord(token, 'id.sifa.profile.presentationDelivery', {
		$type: 'id.sifa.profile.presentationDelivery',
		title: 'Intro to R and Tidyverse for Data Science',
		eventName: 'Mozilla Internal Workshop',
		date: '2019-12-01',
		role: 'id.sifa.defs#workshop',
		mode: 'community.lexicon.calendar.event#inperson',
		createdAt: nowIso()
	}, 'Intro to R and Tidyverse — Mozilla Internal Workshop, Dec 2019');

	await createRecord(token, 'id.sifa.profile.presentationDelivery', {
		$type: 'id.sifa.profile.presentationDelivery',
		title: 'Intro to R and Tidyverse for Data Science',
		eventName: 'Atlanta Workshop',
		date: '2019-10-01',
		role: 'id.sifa.defs#workshop',
		mode: 'community.lexicon.calendar.event#inperson',
		createdAt: nowIso()
	}, 'Intro to R and Tidyverse — Atlanta Workshop, Oct 2019');

	// 6. Professional Organizations -> involvement (kind: involvementOther)
	const orgs = ['Cognitive Science Society', 'Spark Society', 'Black In AI', 'Association for Computing Machinery'];
	for (const upstream of orgs) {
		await createRecord(token, 'id.sifa.profile.involvement', {
			$type: 'id.sifa.profile.involvement',
			kind: 'id.sifa.defs#involvementOther',
			role: 'Member',
			upstream,
			createdAt: nowIso()
		}, `${upstream} — Member`);
	}

	// 7. Languages: add English (native), set proficiency on French/Portuguese
	await createRecord(token, 'id.sifa.profile.language', {
		$type: 'id.sifa.profile.language',
		name: 'English',
		proficiency: 'id.sifa.defs#native',
		createdAt: nowIso()
	}, 'English (native)');

	await putRecord(token, 'id.sifa.profile.language', '3mizjdqugzp2b', {
		$type: 'id.sifa.profile.language',
		name: 'French',
		proficiency: 'id.sifa.defs#professionalWorking',
		createdAt: '2026-04-09T00:09:11.167Z'
	}, 'French — proficiency: professionalWorking (B2)');

	await putRecord(token, 'id.sifa.profile.language', '3mizjdqugzq2b', {
		$type: 'id.sifa.profile.language',
		name: 'Portuguese',
		proficiency: 'id.sifa.defs#limitedWorking',
		createdAt: '2026-04-09T00:09:11.167Z'
	}, 'Portuguese — proficiency: limitedWorking (B1)');

	// 8. Skills: add JavaScript
	await createRecord(token, 'id.sifa.profile.skill', {
		$type: 'id.sifa.profile.skill',
		name: 'JavaScript',
		createdAt: nowIso()
	}, 'JavaScript');

	console.log(`\n${opCount} operations ${DRY_RUN ? 'planned' : 'completed'}.`);
}

main().catch((err) => {
	console.error('\nPatch failed:', err.message);
	process.exit(1);
});
