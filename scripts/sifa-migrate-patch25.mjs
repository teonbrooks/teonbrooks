#!/usr/bin/env node
/**
 * Restructures the Stanford / Mozilla Fellow position description around
 * two sub-headings (March for Science role; Neuroinformatics work), and adds
 * the same two items to the Mozilla Fellowship for Open Science honor (its
 * "2016–2017." time range stays).
 *
 * Usage:
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch25.mjs --dry-run
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch25.mjs
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

const STANFORD_DESCRIPTION = [
	'Open Science + Open Source',
	'I spent my tenure as a Mozilla Fellow for Open Science advocating for the use of open and transparent practices in science. I traveled globally teaching workshops on using open-source technologies, and speaking at conferences.',
	'',
	'### National Organizer, Co-Director of Partnerships — March for Science',
	'',
	'Served as a national organizer for the March for Science in Washington, DC. Directed partnerships, bringing in over 300 partner organizations to help mobilize scientists and science advocates. Brought together more than a million people in over 600 cities worldwide.',
	'',
	'### Neuroinformatics: BIDS-MEG, MNE-tools',
	'',
	'Core contributor to the Brain Imaging Data Structure project for the inclusion of MEG into the specification, and to the MNE-BIDS project to provide a software implementation.',
	'',
	'I also worked on a project to build software that enables experimental psychologists and neuroscientists to freely share the experiment protocols and execute their experiments using open-source, and web-based technologies.',
	'',
	'Through this project, I hope to build community and code that improve the state of brain science research.',
	'',
	'Advisor: Dr. Russell Poldrack.',
	'',
	'[1] https://bids.neuroimaging.io/ ; https://www.nature.com/articles/sdata2018110',
	'[2] https://github.com/mne-tools/mne-bids ; https://joss.theoj.org/papers/10.21105/joss.01896'
].join('\n');

const HONOR_DESCRIPTION = [
	'2016–2017.',
	'National Organizer and Co-Director of Partnerships, March for Science.',
	'Neuroinformatics: BIDS-MEG, MNE-tools.'
].join('\n');

async function main() {
	console.log(DRY_RUN ? '=== DRY RUN — no writes will be made ===\n' : '=== LIVE RUN — writing to Sifa ===\n');
	const token = DRY_RUN ? null : await login();

	const stanford = await getRecord('id.sifa.profile.position', '3mizjdquezj2b');
	stanford.description = STANFORD_DESCRIPTION;
	await putRecord(token, 'id.sifa.profile.position', '3mizjdquezj2b', stanford, 'Stanford / Mozilla Fellow — add March for Science and Neuroinformatics sub-headings');

	const honor = await getRecord('id.sifa.profile.honor', '3mizjdqugzo2b');
	honor.description = HONOR_DESCRIPTION;
	await putRecord(token, 'id.sifa.profile.honor', '3mizjdqugzo2b', honor, 'Mozilla Fellowship for Open Science honor — add March for Science and Neuroinformatics lines');

	console.log(`\n${opCount} operations ${DRY_RUN ? 'planned' : 'completed'}.`);
}

main().catch((err) => {
	console.error('\nPatch failed:', err.message);
	process.exit(1);
});
