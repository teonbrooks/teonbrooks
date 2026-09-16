#!/usr/bin/env node
/**
 * Adds author lists to the 8 poster presentationDelivery records. Sifa's
 * schema has no "authors" field (only coSpeakers, which expects AT Protocol
 * DIDs for actual accounts — not a fit for arbitrary academic co-author
 * names), so this folds the author list into the description field as
 * plain text, the same way advisor names were added to positions earlier.
 *
 * Usage:
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch6.mjs --dry-run
 *   SIFA_IDENTIFIER=teonbrooks.com SIFA_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/sifa-migrate-patch6.mjs
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

const POSTERS = [
	{
		rkey: '3mvlmkhaf4p2o',
		title: 'Transparent Effects of Partial Priming on Compounds',
		eventName: '23rd Annual CUNY conference on Human Sentence Processing',
		date: '2010-03-01',
		location: 'New York, NY',
		authors: 'Brooks, T., Kim, J.; Gordon, P.',
		createdAt: '2026-09-15T21:56:51.957Z'
	},
	{
		rkey: '3mvlmkhbbdj2d',
		title: 'Sentential Support for Morpho-Orthographic Decomposition during Visual Word Recognition',
		eventName: '24th Annual CUNY conference on Human Sentence Processing',
		date: '2011-03-01',
		location: 'Stanford, CA',
		authors: 'Brooks, T.; Gordon, P.',
		createdAt: '2026-09-15T21:56:51.984Z'
	},
	{
		rkey: '3mvlmkhc5ad2z',
		title: 'Combinatorial Effects within Compound Words during Visual Word Recognition',
		eventName: '20th Annual Cognitive Neuroscience Society Meeting',
		date: '2013-04-01',
		location: 'San Francisco, CA',
		authors: 'Brooks, T., Garcia, D.; Marantz, A.; Pylkkänen, L.',
		createdAt: '2026-09-15T21:56:52.009Z'
	},
	{
		rkey: '3mvlmkhczde2i',
		title: 'Trends in MEG and EEG data processing using MNE',
		eventName: '21th Annual Meeting of the Organization for Human Brain Mapping',
		date: '2015-06-01',
		location: 'Honolulu, Hawaii',
		authors:
			'Gramfort, A.; Engemann, D.A.; Larson, E.; Luessi, M.; Brodbeck, C.; Jas, M.; Brooks, T.; Strohmeier, D.; Goj, R.; Vliet, M.; Leggitt, A.; Billinger, M.; Bharadwaj, H.; Parkkonen, L.; Hämäläinen, M.',
		createdAt: '2026-09-15T21:56:52.038Z'
	},
	{
		rkey: '3mvlmkhdx5x2k',
		title: 'OpenEXP: An open-source platform for running EEG and behavioral experiments in the wild',
		eventName: '2016 Context and Episodic Memory Symposium',
		date: '2016-05-01',
		location: 'Philadelphia, PA',
		authors: 'A.C. Heusser; T. Brooks; L. Davachi',
		createdAt: '2026-09-15T21:56:52.067Z'
	},
	{
		rkey: '3mvlmkhhed326',
		title: 'MEG and EEG data processing using MNE: News from the trenches',
		eventName: '22th Annual Meeting of the Organization for Human Brain Mapping',
		date: '2016-06-01',
		location: 'Geneva, Switzerland',
		authors:
			'A. Gramfort; D. Engemann; E. Larson; M. Jas; T. Brooks; J. Leppäkangas; M. van Vliet; C. Brodbeck; M. Wronkiewicz; D. Strohmeier; J. Sassenhagen; J.-R. King; C. Holdgraf; R. Trachel; Y. Bekhti; F. Raimondo; L. Parkkonen; M. Hämäläinen.',
		createdAt: '2026-09-15T21:56:52.180Z'
	},
	{
		rkey: '3mvlmkhi7ux2k',
		title: 'MNE-BIDS: Making MEG BIDS compatible datasets easily',
		eventName: 'OHBM',
		date: '2018-08-01',
		location: 'Montreal, Canada',
		authors: 'Brooks, Teon L; Jas, Mainak; Holdgraf, Chris; Appelhoff, Stefan; Sanderson, Matt; Gramfort, Alexandre.',
		createdAt: '2026-09-15T21:56:52.208Z',
		links: [{ uri: 'https://doi.org/10.5281/zenodo.3245427', type: 'id.sifa.defs#linkOther', label: 'DOI' }]
	},
	{
		rkey: '3mvlmkhj2z326',
		title: 'MNE-BIDS: MNE-Python + BIDS = easy dataset interaction',
		eventName: 'OHBM',
		date: '2020-06-01',
		location: 'Virtual',
		authors:
			'Appelhoff, Stefan; Sanderson, Matthew; Brooks, Teon L; van Vliet, Marijn; Quentin, Romain; Holdgraf, Chris; Chaumon, Maximilien; Mikulan, Ezequiel; Tavabi, Kambiz; Höchenberger, Richard; Welke, Dominik; Brunner, Clemens; Rockhill, Alexander P; Larson, Eric; Herbst, Sophie K; Luke, Robert; Li, Adam; Gramfort, Alexandre; Jas, Mainak.',
		createdAt: '2026-09-15T21:56:52.238Z',
		links: [{ uri: 'http://doi.org/10.5281/zenodo.3891836', type: 'id.sifa.defs#linkOther', label: 'DOI' }]
	}
];

async function main() {
	console.log(DRY_RUN ? '=== DRY RUN — no writes will be made ===\n' : '=== LIVE RUN — writing to Sifa ===\n');
	const token = DRY_RUN ? null : await login();

	for (const p of POSTERS) {
		const record = {
			$type: 'id.sifa.profile.presentationDelivery',
			title: p.title,
			eventName: p.eventName,
			date: p.date,
			location: p.location,
			role: 'id.sifa.defs#presenter',
			mode: 'community.lexicon.calendar.event#inperson',
			description: `Authors: ${p.authors}`,
			createdAt: p.createdAt
		};
		if (p.links) record.links = p.links;
		await putRecord(token, 'id.sifa.profile.presentationDelivery', p.rkey, record, `${p.title} — add authors`);
	}

	console.log(`\n${opCount} operations ${DRY_RUN ? 'planned' : 'completed'}.`);
}

main().catch((err) => {
	console.error('\nPatch failed:', err.message);
	process.exit(1);
});
