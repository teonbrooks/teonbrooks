#!/usr/bin/env node
/**
 * One-time migration: writes talks/posters/positions/involvement/honors/projects
 * into Sifa's AT Protocol records (id.sifa.profile.*) in Teon's own PDS.
 *
 * This is a personal-data write script, not part of the site build. It is meant
 * to be run manually, once, by Teon, with his own credentials.
 *
 * Usage:
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate.mjs --dry-run
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate.mjs
 *
 * Generate an app password at https://bsky.app/settings/app-passwords (or your
 * PDS's equivalent settings page) — never use your main account password here.
 *
 * --dry-run prints every planned operation without writing anything. Always
 * run with --dry-run first and review the output before running for real.
 */

import { parse as parseToml } from 'smol-toml';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '../static/content/cv');

const DID = 'did:plc:yl7wcldipsfnjdww2jg5mnrv';
const PDS_URL = process.env.SIFA_PDS_URL ?? 'https://inkcap.us-east.host.bsky.network';

const DRY_RUN = process.argv.includes('--dry-run');

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

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
	if (!res.ok) {
		throw new Error(`Login failed: ${res.status} ${await res.text()}`);
	}
	const { accessJwt, did } = await res.json();
	if (did !== DID) {
		throw new Error(`Logged in as ${did}, expected ${DID} — wrong account?`);
	}
	return accessJwt;
}

// ---------------------------------------------------------------------------
// Record CRUD helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const nowIso = () => new Date().toISOString();

/** Pad a "YYYY", "YYYY-MM", or "YYYY-MM-DD" string to a full YYYY-MM-DD. */
function toFullDate(d) {
	const parts = d.split('-');
	if (parts.length === 3) return d;
	if (parts.length === 2) return `${d}-01`;
	return `${d}-01-01`;
}

/** posters.toml dates are like "2010 March"; talks.toml dates are ISO-ish already. */
const MONTHS = {
	january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
	july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
};
function posterDateToIso(d) {
	const [year, monthName] = d.trim().split(/\s+/);
	const month = MONTHS[monthName.toLowerCase()];
	return `${year}-${month}-01`;
}

function classifyLink(url) {
	if (/zenodo\.org|doi\.org/.test(url)) return { uri: url, type: 'id.sifa.defs#linkOther', label: 'DOI' };
	if (/youtube\.com|youtu\.be|facebook\.com.*video|vimeo\.com/.test(url)) return { uri: url, type: 'id.sifa.defs#linkRecording' };
	if (/slides|slideshare|speakerdeck|zenodo.*23245441/.test(url)) return { uri: url, type: 'id.sifa.defs#linkSlides' };
	return { uri: url, type: 'id.sifa.defs#linkEvent' };
}

// ---------------------------------------------------------------------------
// Talks -> id.sifa.profile.presentationDelivery
// Role assigned per-entry by hand (title/format review), not heuristically.
// ---------------------------------------------------------------------------

const TALK_ROLE_OVERRIDES = {
	'The Many Pathways to a Data Science Career': 'presenter',
	'IU Neuroscience / Cognitive Science Joint Colloquium Series': 'presenter',
	'Cognition & Cognitive Neuroscience Area Forum': 'presenter',
	'Industry Careers Panel': 'panelist',
	'Data Science for Social Good Panel: Nonprofit': 'panelist',
	'Intro to Data Science Guest Lecture': 'presenter',
	'Panel on PhD Industry Job Search Panel': 'panelist',
	'How to Open Source Panel': 'panelist',
	'csv,conf,v4 Keynote': 'keynote',
	'CCN Colloquium Series': 'presenter',
	'Cognitive Talk Series': 'presenter',
	'FAIR Neuroscience: Sharing and Collaborating for Reproducible Data Workshop': 'workshop',
	'Organizing a national March for Science': 'presenter',
	'Scientist + Advocacy Panel': 'panelist',
	'March for Science chat with Mozilla Science Fellow, Teon Brooks': 'presenter',
	'Arrival': 'presenter',
	'The Accessible Future of Neuroscience Panel': 'panelist',
	'Doctoral Convocation: Student Speaker': 'presenter'
};

async function migrateTalks(token) {
	const raw = await readFile(path.join(CONTENT_DIR, 'talks.toml'), 'utf-8');
	const { engagements } = parseToml(raw);
	for (const talk of engagements) {
		if (!talk.title) continue; // skip the commented-out template entry
		const role = TALK_ROLE_OVERRIDES[talk.title];
		if (!role) throw new Error(`No role mapped for talk "${talk.title}" — add it to TALK_ROLE_OVERRIDES.`);
		const assets = talk.asset ? (Array.isArray(talk.asset) ? talk.asset : [talk.asset]) : [];
		const record = {
			$type: 'id.sifa.profile.presentationDelivery',
			title: talk.title,
			eventName: talk.organization,
			date: toFullDate(talk.date),
			location: talk.location,
			role: `id.sifa.defs#${role}`,
			mode: talk.location === 'Virtual'
				? 'community.lexicon.calendar.event#virtual'
				: 'community.lexicon.calendar.event#inperson',
			links: assets.filter(Boolean).map(classifyLink),
			createdAt: nowIso()
		};
		if (!record.links.length) delete record.links;
		await createRecord(token, 'id.sifa.profile.presentationDelivery', record, talk.title);
	}
}

// ---------------------------------------------------------------------------
// Posters -> id.sifa.profile.presentationDelivery (role: presenter)
// ---------------------------------------------------------------------------

async function migratePosters(token) {
	const raw = await readFile(path.join(CONTENT_DIR, 'posters.toml'), 'utf-8');
	const { poster } = parseToml(raw);
	for (const p of poster) {
		const links = p.asset ? [classifyLink(Array.isArray(p.asset) ? p.asset[0] : p.asset)] : [];
		const record = {
			$type: 'id.sifa.profile.presentationDelivery',
			title: p.title,
			eventName: p.conference,
			date: posterDateToIso(p.date),
			location: p.location,
			role: 'id.sifa.defs#presenter',
			mode: 'community.lexicon.calendar.event#inperson',
			createdAt: nowIso()
		};
		if (links.length) record.links = links;
		await createRecord(token, 'id.sifa.profile.presentationDelivery', record, p.title);
	}
}

// ---------------------------------------------------------------------------
// Positions
// ---------------------------------------------------------------------------

async function migratePositions(token) {
	// 1. Create datalus, LLC (folds in OpenBCI + BrainWaves consulting + MSK/Gerstner)
	await createRecord(token, 'id.sifa.profile.position', {
		$type: 'id.sifa.profile.position',
		title: 'Principal Consultant',
		company: 'datalus, LLC',
		startedAt: '2015-08',
		description:
			'OpenBCI (2015-08 – 2016-06)\n' +
			'Establishing validation and testing protocols for EEG hardware. Developing SDKs and APIs for OpenBCI Hardware. Developing an open-source software platform for running experiments, stream data for real-time analytics. Advising on research applications of wireless EEG.\n\n' +
			'BrainWaves — Consultant, Product Manager (2017–2022)\n' +
			'Democratizing Cognitive Science.\n\n' +
			'Memorial Sloan Kettering, Gerstner Sloan Kettering — Consultant: Instructor (2025–Present)\n' +
			'Instructor for G440: Introduction to Scientific Python. https://github.com/datalus-dev/gsk-intro-scientific-python-course',
		createdAt: nowIso()
	}, 'datalus, LLC — Principal Consultant');

	// 2. Delete standalone OpenBCI position (superseded by datalus)
	await deleteRecord(token, 'id.sifa.profile.position', '3mizjdquezm2b', 'Consultant @ OpenBCI (superseded)');

	// 3. Create NYU Teaching Assistant
	await createRecord(token, 'id.sifa.profile.position', {
		$type: 'id.sifa.profile.position',
		title: 'Teaching Assistant',
		company: 'New York University',
		startedAt: '2012-09',
		endedAt: '2012-12',
		description: 'PSYCH.UA.0300-007: Lab in Cognitive Neuroscience. Professor: Dr. David Poeppel.',
		createdAt: nowIso()
	}, 'NYU Teaching Assistant, Fall 2012');

	// 4. Edit Statespace title (full record required for putRecord)
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
			'• Led a team of research scientists to incorporate innovative research into Aim Lab, the flagship aim trainer product.\n' +
			'• Led and coordinated digital health initiatives to create cognitive assessments for altered states of consciousness.'
	}, 'Statespace title -> VP: Head of Product, Research and Development');
}

// ---------------------------------------------------------------------------
// Involvement
// ---------------------------------------------------------------------------

async function migrateInvolvement(token) {
	// Replace the single "Academic Tutor @ New York Cares" with 3 specific sub-roles
	await deleteRecord(token, 'id.sifa.profile.involvement', '3mvdrkh63v422', 'Academic Tutor @ New York Cares (replaced by 3 sub-roles)');

	await createRecord(token, 'id.sifa.profile.involvement', {
		$type: 'id.sifa.profile.involvement',
		kind: 'id.sifa.defs#involvementCharity',
		role: 'SAT Prep Tutor',
		upstream: 'New York Cares',
		location: { $type: 'community.lexicon.location.address', region: 'New York', country: 'US', locality: 'New York' },
		startedAt: '2013-01',
		endedAt: '2013-05',
		description: 'SAT Prep Tutor for tenth graders, in partnership with I Have a Dream Foundation.',
		createdAt: nowIso()
	}, 'New York Cares — SAT Prep Tutor');

	await createRecord(token, 'id.sifa.profile.involvement', {
		$type: 'id.sifa.profile.involvement',
		kind: 'id.sifa.defs#involvementCharity',
		role: 'Math Games Tutor',
		upstream: 'New York Cares',
		location: { $type: 'community.lexicon.location.address', region: 'New York', country: 'US', locality: 'New York' },
		startedAt: '2013-01',
		endedAt: '2013-06',
		description: 'Math games tutor for elementary school students, in partnership with The Educational Alliance.',
		createdAt: nowIso()
	}, 'New York Cares — Math Games Tutor');

	await createRecord(token, 'id.sifa.profile.involvement', {
		$type: 'id.sifa.profile.involvement',
		kind: 'id.sifa.defs#involvementCharity',
		role: 'Summer Science Camp Volunteer',
		upstream: 'New York Cares',
		location: { $type: 'community.lexicon.location.address', region: 'New York', country: 'US', locality: 'New York' },
		startedAt: '2015-07',
		endedAt: '2015-08',
		description: 'Summer Science Camp volunteer, in partnership with The Educational Alliance.',
		createdAt: nowIso()
	}, 'New York Cares — Summer Science Camp Volunteer');

	// BrainWaves (President, Advisory Board)
	await createRecord(token, 'id.sifa.profile.involvement', {
		$type: 'id.sifa.profile.involvement',
		kind: 'id.sifa.defs#involvementCommunity',
		role: 'President, Advisory Board',
		upstream: 'BrainWaves',
		upstreamUrl: 'https://wp.nyu.edu/brainwaves/',
		startedAt: '2017-09',
		endedAt: '2022-12',
		createdAt: nowIso()
	}, 'BrainWaves — President, Advisory Board');

	// DIY Sci Thai
	await createRecord(token, 'id.sifa.profile.involvement', {
		$type: 'id.sifa.profile.involvement',
		kind: 'id.sifa.defs#involvementCommunity',
		role: 'Workshop Creator; Co-organizer',
		upstream: 'DIY Sci Thai',
		upstreamUrl: 'https://github.com/teonbrooks/DIYSciThai',
		location: { $type: 'community.lexicon.location.address', country: 'TH', locality: 'Bangkok' },
		startedAt: '2016-06',
		endedAt: '2016-06',
		description:
			'DIYSciThai was an Open Science workshop taught in Bangkok, Thailand in June 2016, the basis of an open science initiative to provide an integrative curriculum to teach cognitive science through experiential learning. Featured building research electronics (eye-tracker and EEG) from open-source hardware and low-cost electronics. Supported by grants from Fulbright Thailand, the Open and Collaborative Science in Development Network (OCSDnet), and NYU.',
		createdAt: nowIso()
	}, 'DIY Sci Thai — Workshop Creator; Co-organizer');

	// Neuroscience Outreach
	await createRecord(token, 'id.sifa.profile.involvement', {
		$type: 'id.sifa.profile.involvement',
		kind: 'id.sifa.defs#involvementCommunity',
		role: 'Volunteer Instructor',
		upstream: 'Booker T. Washington Middle School',
		location: { $type: 'community.lexicon.location.address', region: 'New York', country: 'US', locality: 'New York' },
		startedAt: '2015-09',
		endedAt: '2015-11',
		createdAt: nowIso()
	}, 'Neuroscience Outreach — Volunteer Instructor');

	// braiNY-SFN
	await createRecord(token, 'id.sifa.profile.involvement', {
		$type: 'id.sifa.profile.involvement',
		kind: 'id.sifa.defs#involvementCommunity',
		role: 'Co-chair',
		upstream: 'Greater New York City Chapter of the Society for Neuroscience (braiNY)',
		startedAt: '2015-11',
		endedAt: '2016-05',
		createdAt: nowIso()
	}, 'braiNY-SFN — Co-chair');

	// Science Hack Day
	await createRecord(token, 'id.sifa.profile.involvement', {
		$type: 'id.sifa.profile.involvement',
		kind: 'id.sifa.defs#involvementCommunity',
		role: 'Co-Organizer',
		upstream: 'Science Hack Day',
		location: { $type: 'community.lexicon.location.address', region: 'New York', country: 'US', locality: 'New York' },
		startedAt: '2017-01',
		createdAt: nowIso()
	}, 'Science Hack Day — Co-Organizer');

	// QueerHack
	await createRecord(token, 'id.sifa.profile.involvement', {
		$type: 'id.sifa.profile.involvement',
		kind: 'id.sifa.defs#involvementCommunity',
		role: 'Co-founder',
		upstream: 'QueerHack',
		startedAt: '2017',
		endedAt: '2018',
		createdAt: nowIso()
	}, 'QueerHack — Co-founder');
}

// ---------------------------------------------------------------------------
// Honors
// ---------------------------------------------------------------------------

async function migrateHonors(token) {
	// New honors
	const newHonors = [
		{ title: 'Open and Collaborative Science in Development Network', issuer: 'OCSDNet', awardedAt: '2016', description: '$1,500 grant.' },
		{ title: 'NYU Prototyping Fund', issuer: 'New York University', awardedAt: '2015', description: '$500 grant.' },
		{ title: 'National Science Foundation Graduate Research Opportunities Worldwide', issuer: 'National Science Foundation', awardedAt: '2014', description: '$5,000 award.' },
		{ title: 'Society of Multivariate Experimental Psychology Travel Award', issuer: 'Society of Multivariate Experimental Psychology', awardedAt: '2013' },
		{ title: 'Society for the Neurobiology of Language Travel Award', issuer: 'Society for the Neurobiology of Language', awardedAt: '2011' },
		{ title: 'Society for the Neurobiology of Language Travel Award', issuer: 'Society for the Neurobiology of Language', awardedAt: '2013' },
		{ title: 'Mary and Maurice Julian Scholarship', issuer: 'University of North Carolina at Chapel Hill', awardedAt: '2006', description: '2006–2009.' },
		{ title: 'Carolina Covenant Scholarship', issuer: 'University of North Carolina at Chapel Hill', awardedAt: '2006', description: '2006–2009.' },
		{ title: 'NYU MacCracken Fellowship', issuer: 'New York University', awardedAt: '2011', description: '2011–2016.' },
		{ title: 'NYU Summer Research Fellowship', issuer: 'New York University', awardedAt: '2011', description: '2011–2014.' }
	];
	for (const h of newHonors) {
		await createRecord(token, 'id.sifa.profile.honor', {
			$type: 'id.sifa.profile.honor',
			title: h.title,
			issuer: h.issuer,
			awardedAt: h.awardedAt,
			...(h.description ? { description: h.description } : {}),
			createdAt: nowIso()
		}, h.title);
	}

	// Edit NSF GRF: add duration description
	await putRecord(token, 'id.sifa.profile.honor', '3mizjdqugzn2b', {
		$type: 'id.sifa.profile.honor',
		title: 'National Science Foundation Graduate Research Fellowship',
		issuer: 'National Science Foundation',
		agentRef: { name: 'National Science Foundation', entityRef: 'http://www.wikidata.org/entity/Q304878' },
		awardedAt: '2011-04',
		createdAt: '2026-04-09T00:09:11.167Z',
		entityRef: 'http://www.wikidata.org/entity/Q304878',
		description: '2011–2016.'
	}, 'NSF GRF — add "2011–2016" description');

	// Edit Mozilla Fellowship: add duration description
	await putRecord(token, 'id.sifa.profile.honor', '3mizjdqugzo2b', {
		$type: 'id.sifa.profile.honor',
		title: 'Mozilla Fellowship for Open Science',
		issuer: 'Mozilla Foundation',
		agentRef: { name: 'Mozilla Foundation', entityRef: 'http://www.wikidata.org/entity/Q55672' },
		awardedAt: '2016-09',
		createdAt: '2026-04-09T00:09:11.167Z',
		entityRef: 'http://www.wikidata.org/entity/Q55672',
		description: '2016–2017.'
	}, 'Mozilla Fellowship — add "2016–2017" description');
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

async function migrateProjects(token) {
	const projects = [
		{
			name: 'NeuroAI',
			url: 'https://github.com/facebookresearch/neuroai',
			startedAt: '2026',
			description: 'The Python suite for Neuro-AI including NeuralSet, NeuralFetch, NeuralBench.'
		},
		{
			name: 'Brain Imaging Data Structure (BIDS)',
			url: 'https://github.com/bids-standard/bids-specification',
			startedAt: '2017',
			endedAt: '2020',
			description: 'A community-driven data sharing standardization.'
		},
		{
			name: 'MNE-BIDS',
			url: 'https://github.com/mne-tools/mne-bids',
			startedAt: '2017',
			endedAt: '2020',
			description: 'Read and write BIDS-compatible datasets with the help of MNE-Python in Python.'
		},
		{
			name: 'MNE-Python',
			url: 'https://github.com/mne-tools/mne-python',
			startedAt: '2012',
			endedAt: '2019',
			description: 'MEG and EEG Data Processing and Analysis Package in Python.'
		},
		{
			name: 'Pyeparse',
			url: 'https://github.com/pyeparse/pyeparse',
			startedAt: '2015',
			endedAt: '2017',
			description: 'Tools related to analyzing eye tracking data from cognitive sciences experiments in Python.'
		}
	];
	for (const p of projects) {
		await createRecord(token, 'id.sifa.profile.project', {
			$type: 'id.sifa.profile.project',
			name: p.name,
			url: p.url,
			startedAt: p.startedAt,
			...(p.endedAt ? { endedAt: p.endedAt } : {}),
			description: p.description,
			createdAt: nowIso()
		}, p.name);
	}
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
	console.log(DRY_RUN ? '=== DRY RUN — no writes will be made ===\n' : '=== LIVE RUN — writing to Sifa ===\n');
	const token = DRY_RUN ? null : await login();

	await migrateTalks(token);
	await migratePosters(token);
	await migratePositions(token);
	await migrateInvolvement(token);
	await migrateHonors(token);
	await migrateProjects(token);

	console.log(`\n${opCount} operations ${DRY_RUN ? 'planned' : 'completed'}.`);
}

main().catch((err) => {
	console.error('\nMigration failed:', err.message);
	process.exit(1);
});
