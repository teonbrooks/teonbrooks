#!/usr/bin/env node
/**
 * Regenerates static/content/cv/*.toml from the live Sifa data (the public,
 * unauthenticated AT Protocol API — no credentials needed for this script).
 *
 * - portfolio.toml: [[positions]] regenerated from id.sifa.profile.position,
 *   reusing filename/category/website from the existing file where an entry
 *   matches by organization (those are local-only rendering fields with no
 *   Sifa equivalent). [skills] section regenerated from language + skill.
 * - talks.toml: regenerated from presentationDelivery, excluding the entries
 *   that belong in posters.toml (matched by title).
 * - posters.toml: regenerated from the same presentationDelivery collection,
 *   filtered to just the poster titles.
 * - involvement.toml, honors.toml, projects.toml, education.toml: new files,
 *   one collection each.
 *
 * Usage: node scripts/sifa-export-toml.mjs
 * (Read-only against Sifa; writes local files only. No login needed.)
 */

import { parse as parseToml } from 'smol-toml';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '../static/content/cv');

const DID = 'did:plc:yl7wcldipsfnjdww2jg5mnrv';
const PDS_URL = 'https://inkcap.us-east.host.bsky.network';

async function listAll(collection) {
	const records = [];
	let cursor;
	for (;;) {
		const url = new URL(`${PDS_URL}/xrpc/com.atproto.repo.listRecords`);
		url.searchParams.set('repo', DID);
		url.searchParams.set('collection', collection);
		url.searchParams.set('limit', '100');
		if (cursor) url.searchParams.set('cursor', cursor);
		const res = await fetch(url);
		if (!res.ok) throw new Error(`listRecords failed (${collection}): ${res.status} ${await res.text()}`);
		const data = await res.json();
		records.push(...data.records);
		if (!data.cursor || data.records.length === 0) break;
		cursor = data.cursor;
	}
	return records.map((r) => r.value);
}

// ---------------------------------------------------------------------------
// TOML formatting helpers
// ---------------------------------------------------------------------------

function tomlString(s) {
	if (s == null) return '""';
	if (/\n/.test(s)) return `"""\n${s}\n"""`;
	return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

// Always triple-quoted, regardless of whether the value has newlines —
// used for description-style fields so formatting is consistent whether
// the text is one line or several.
function tomlMultilineString(s) {
	return `"""\n${s ?? ''}\n"""`;
}

function tomlDate(...parts) {
	return parts.filter(Boolean).join('–') || '';
}

// ---------------------------------------------------------------------------
// portfolio.toml: [[positions]] + [skills]
// ---------------------------------------------------------------------------

// Categories for positions with no counterpart in the old portfolio.toml
// (nothing to reuse a category from), keyed by "company|title".
const NEW_ENTRY_CATEGORIES = {
	'City University of New York|Adjunct Assistant Professor': ['Current Orgs', 'Teaching'],
	'Meta (United States)|Data Scientist': ['Current Orgs'],
	'|Personal Sabbatical': ['Past Orgs']
};

// Fallback only: Sifa company name -> old-file shorthand, used ONLY when no
// direct company match exists (i.e. bootstrapping from a pre-Sifa file that
// used different names, e.g. "Mozilla Corporation" vs "Mozilla"). Once the
// file has been through one export it carries Sifa's own names, so this
// fallback stops mattering on subsequent runs.
const COMPANY_ALIASES = {
	'university of north carolina at chapel hill': 'university of north carolina',
	'télécom paris': 'telecom paristech',
	'datalus, llc': 'openbci', // datalus folds in the old OpenBCI entry
	'mozilla corporation': 'mozilla', // ambiguous: old file had 2 Mozilla entries; disambiguated by title below
	'statespace': 'state space labs',
	'recurse center': 'the recurse center'
};

// Old-file Mozilla title, keyed by which new title should use it. Old file
// had "Mozilla|Staff Data Scientist" (employee) and "Mozilla|Consultant".
const MOZILLA_TITLE_FALLBACK = {
	'senior data scientist': 'staff data scientist',
	'senior product manager, machine learning': 'staff data scientist',
	'staff data scientist': 'staff data scientist'
};

async function buildPortfolio(positions, languages, skills) {
	// Read the current file's own metadata before it gets overwritten, so
	// filename/category/website (local-only fields with no Sifa equivalent)
	// survive from one run to the next. Matches by company+title first (most
	// specific), then company alone, then the alias fallback for bootstrap.
	const oldRaw = await readFile(path.join(CONTENT_DIR, 'portfolio.toml'), 'utf-8');
	const old = parseToml(oldRaw);
	const oldByCompanyTitle = {};
	const oldByCompany = {};
	const oldHeader = oldRaw.slice(0, oldRaw.indexOf('[[positions]]'));
	for (const p of old.positions) {
		const company = (p.organization ?? '').toLowerCase();
		oldByCompanyTitle[`${company}|${(p.title ?? '').toLowerCase()}`] = p;
		if (!(company in oldByCompany)) oldByCompany[company] = p;
	}

	const posBlocks = positions
		.slice()
		.sort((a, b) => (a.startedAt ?? '').localeCompare(b.startedAt ?? ''))
		.map((p) => {
			const company = (p.company ?? '').toLowerCase();
			const title = (p.title ?? '').toLowerCase();
			const aliasCompany = COMPANY_ALIASES[company];
			const aliasTitle = MOZILLA_TITLE_FALLBACK[title];
			const match =
				oldByCompanyTitle[`${company}|${title}`] ??
				oldByCompany[company] ??
				(aliasCompany && aliasTitle ? oldByCompanyTitle[`${aliasCompany}|${aliasTitle}`] : undefined) ??
				(aliasCompany ? oldByCompany[aliasCompany] : undefined);
			const filename = match?.filename ?? '';
			const newCategory = NEW_ENTRY_CATEGORIES[`${p.company ?? ''}|${p.title ?? ''}`];
			const category = match?.category
				? Array.isArray(match.category)
					? JSON.stringify(match.category)
					: `"${match.category}"`
				: newCategory
					? JSON.stringify(newCategory)
					: '""';
			const website = match?.website ?? '';
			const timespan = `${p.startedAt ?? ''}${p.endedAt ? `-${p.endedAt}` : '-Present'}`;
			return (
				`[[positions]]\n` +
				`filename = ${tomlString(filename)}\n` +
				`organization = ${tomlString(p.company ?? '')}\n` +
				`title = ${tomlString(p.title ?? '')}\n` +
				`timespan = ${tomlString(timespan)}\n` +
				`description = ${tomlMultilineString(p.description)}\n` +
				`website = ${tomlString(website)}\n` +
				`category = ${category}`
			);
		});

	const langList = languages.map((l) => {
		const prof = { native: 'native', fullProfessional: 'C1', professionalWorking: 'B2', limitedWorking: 'B1', elementary: 'A2' };
		const level = prof[(l.proficiency ?? '').replace('id.sifa.defs#', '')] ?? '';
		return `"${l.name}${level ? ` (${level})` : ''}"`;
	});
	const skillList = skills.map((s) => `"${s.name}"`);

	const header =
		oldHeader.replace(
			/natural_languages =\t?\[[^\]]*\]/,
			`natural_languages =\t[${langList.join(', ')}]`
		) || oldHeader;

	return header.trimEnd() + '\n\n' + posBlocks.join('\n\n') + '\n';
}

// ---------------------------------------------------------------------------
// presentationDelivery -> talks.toml / posters.toml
// ---------------------------------------------------------------------------

const POSTER_TITLES = new Set([
	'Transparent Effects of Partial Priming on Compounds',
	'Sentential Support for Morpho-Orthographic Decomposition during Visual Word Recognition',
	'Combinatorial Effects within Compound Words during Visual Word Recognition',
	'Trends in MEG and EEG data processing using MNE',
	'OpenEXP: An open-source platform for running EEG and behavioral experiments in the wild',
	'MEG and EEG data processing using MNE: News from the trenches',
	'MNE-BIDS: Making MEG BIDS compatible datasets easily',
	'MNE-BIDS: MNE-Python + BIDS = easy dataset interaction'
]);

const PLACEHOLDER_DAY_NOTE = 'Exact day unknown; the date above uses the 1st of the month as a placeholder.';

// Splits a Sifa description into { rest, note }, pulling out the
// placeholder-day note (added by patch7) so it lands in its own field
// instead of bleeding into whatever else the description holds (e.g. an
// author list).
function splitPlaceholderNote(description) {
	if (!description) return { rest: '', hasNote: false };
	const idx = description.indexOf(PLACEHOLDER_DAY_NOTE);
	if (idx === -1) return { rest: description, hasNote: false };
	const rest = description.slice(0, idx).replace(/\n+$/, '');
	return { rest, hasNote: true };
}

function buildTalks(deliveries) {
	const talks = deliveries.filter((d) => !POSTER_TITLES.has(d.title));
	const blocks = talks
		.sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''))
		.map((t) => {
			const links = (t.links ?? []).map((l) => l.uri);
			const asset = links.length === 0 ? '""' : links.length === 1 ? tomlString(links[0]) : JSON.stringify(links);
			const { rest, hasNote } = splitPlaceholderNote(t.description);
			return (
				`[[engagements]]\n` +
				`organization = ${tomlString(t.eventName ?? '')}\n` +
				`title = ${tomlString(t.title ?? '')}\n` +
				`date = ${tomlString(t.date ?? '')}\n` +
				`location = ${tomlString(t.location ?? '')}\n` +
				`role = ${tomlString((t.role ?? '').replace('id.sifa.defs#', ''))}\n` +
				`asset = ${asset}` +
				(rest ? `\ndetails = ${tomlString(rest)}` : '') +
				(hasNote ? `\ndate_is_approximate = true` : '')
			);
		});
	return 'name = "Invited Talks and Panels"\n\n' + blocks.join('\n\n') + '\n';
}

function buildPosters(deliveries) {
	const posters = deliveries.filter((d) => POSTER_TITLES.has(d.title));
	const blocks = posters
		.sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''))
		.map((p) => {
			const doi = (p.links ?? []).find((l) => l.type === 'id.sifa.defs#linkOther')?.uri ?? '';
			const { rest, hasNote } = splitPlaceholderNote(p.description);
			const authors = rest.replace(/^Authors:\s*/, '');
			return (
				`[[poster]]\n` +
				`date = ${tomlString(p.date ?? '')}\n` +
				`authors = ${tomlString(authors)}\n` +
				`title = ${tomlString(p.title ?? '')}\n` +
				`conference = ${tomlString(p.eventName ?? '')}\n` +
				`location = ${tomlString(p.location ?? '')}` +
				(doi ? `\nasset = ${tomlString(doi)}` : '') +
				(hasNote ? `\ndate_is_approximate = true` : '')
			);
		});
	return blocks.join('\n\n') + '\n';
}

// ---------------------------------------------------------------------------
// involvement.toml, honors.toml, projects.toml, education.toml (new files)
// ---------------------------------------------------------------------------

function buildInvolvement(records) {
	const blocks = records
		.sort((a, b) => (a.startedAt ?? '').localeCompare(b.startedAt ?? ''))
		.map((v) => {
			const links = (v.links ?? []).map((l) => l.url).filter(Boolean);
			const linksField = links.length === 0 ? '""' : links.length === 1 ? tomlString(links[0]) : JSON.stringify(links);
			return (
				`[[involvement]]\n` +
				`organization = ${tomlString(v.upstream ?? '')}\n` +
				`role = ${tomlString(v.role ?? '')}\n` +
				`kind = ${tomlString((v.kind ?? '').replace('id.sifa.defs#involvement', ''))}\n` +
				`started = ${tomlString(v.startedAt ?? '')}\n` +
				`ended = ${tomlString(v.endedAt ?? '')}\n` +
				`location = ${tomlString(v.location ? [v.location.locality, v.location.region, v.location.country].filter(Boolean).join(', ') : '')}\n` +
				`url = ${tomlString(v.upstreamUrl ?? '')}\n` +
				`links = ${linksField}\n` +
				`description = ${tomlMultilineString(v.description)}`
			);
		});
	return blocks.join('\n\n') + '\n';
}

function buildHonors(records) {
	const blocks = records
		.sort((a, b) => (a.awardedAt ?? '').localeCompare(b.awardedAt ?? ''))
		.map(
			(h) =>
				`[[honor]]\n` +
				`title = ${tomlString(h.title ?? '')}\n` +
				`issuer = ${tomlString(h.issuer ?? '')}\n` +
				`awarded = ${tomlString(h.awardedAt ?? '')}\n` +
				`description = ${tomlMultilineString(h.description)}`
		);
	return blocks.join('\n\n') + '\n';
}

function buildProjects(records) {
	const blocks = records
		.sort((a, b) => (a.startedAt ?? '').localeCompare(b.startedAt ?? ''))
		.map(
			(p) =>
				`[[project]]\n` +
				`name = ${tomlString(p.name ?? '')}\n` +
				`url = ${tomlString(p.url ?? '')}\n` +
				`started = ${tomlString(p.startedAt ?? '')}\n` +
				`ended = ${tomlString(p.endedAt ?? '')}\n` +
				`description = ${tomlMultilineString(p.description)}`
		);
	return blocks.join('\n\n') + '\n';
}

function buildEducation(records) {
	const blocks = records
		.sort((a, b) => (a.startedAt ?? '').localeCompare(b.startedAt ?? ''))
		.map(
			(e) =>
				`[[education]]\n` +
				`institution = ${tomlString(e.institution ?? '')}\n` +
				`degree = ${tomlString(e.degree ?? '')}\n` +
				`field = ${tomlString(e.fieldOfStudy ?? '')}\n` +
				`started = ${tomlString(e.startedAt ?? '')}\n` +
				`ended = ${tomlString(e.endedAt ?? '')}\n` +
				`description = ${tomlMultilineString(e.description)}`
		);
	return blocks.join('\n\n') + '\n';
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

async function main() {
	const [positions, involvement, honors, projects, education, languages, skills, deliveries] = await Promise.all([
		listAll('id.sifa.profile.position'),
		listAll('id.sifa.profile.involvement'),
		listAll('id.sifa.profile.honor'),
		listAll('id.sifa.profile.project'),
		listAll('id.sifa.profile.education'),
		listAll('id.sifa.profile.language'),
		listAll('id.sifa.profile.skill'),
		listAll('id.sifa.profile.presentationDelivery')
	]);

	const portfolio = await buildPortfolio(positions, languages, skills);
	await writeFile(path.join(CONTENT_DIR, 'portfolio.toml'), portfolio);
	console.log(`portfolio.toml: ${positions.length} positions`);

	await writeFile(path.join(CONTENT_DIR, 'talks.toml'), buildTalks(deliveries));
	console.log(`talks.toml: ${deliveries.length - 8} talks/workshops`);

	await writeFile(path.join(CONTENT_DIR, 'posters.toml'), buildPosters(deliveries));
	console.log(`posters.toml: 8 posters`);

	await writeFile(path.join(CONTENT_DIR, 'involvement.toml'), buildInvolvement(involvement));
	console.log(`involvement.toml: ${involvement.length} entries (new file)`);

	await writeFile(path.join(CONTENT_DIR, 'honors.toml'), buildHonors(honors));
	console.log(`honors.toml: ${honors.length} entries (new file)`);

	await writeFile(path.join(CONTENT_DIR, 'projects.toml'), buildProjects(projects));
	console.log(`projects.toml: ${projects.length} entries (new file)`);

	await writeFile(path.join(CONTENT_DIR, 'education.toml'), buildEducation(education));
	console.log(`education.toml: ${education.length} entries (new file)`);

	console.log('\nDone. Review the generated files before committing.');
}

main().catch((err) => {
	console.error('Export failed:', err);
	process.exit(1);
});
