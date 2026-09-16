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

// ---------------------------------------------------------------------------
// portfolio.toml: [[positions]] + [skills]
// ---------------------------------------------------------------------------

// Organizations that appear on the live Portfolio page but have no
// corresponding Sifa `position` record — they're open-source *project*
// engagements (tracked in id.sifa.profile.project / projects.toml instead),
// not employment. Carried forward verbatim from the existing file on every
// re-export so they don't silently disappear (as happened once already: the
// first Sifa sync dropped them because this function only ever looked at
// Sifa's position records).
const MANUAL_PORTFOLIO_ORGANIZATIONS = new Set([
	'MNE-tools',
	'Brain Imaging Data Structure (BIDS)',
	'OpenEXP',
	'BrainWaves',
	'Carolina Covenant',
	'National Science Foundation Graduate Research Fellowship Program',
	'French Embassy to the U.S.',
	'Mozilla Science Lab'
]);

// Portfolio card date ranges are always year-only for display, never
// year-month.
function yearOnly(s) {
	const m = (s ?? '').match(/\d{4}/);
	return m ? m[0] : s ?? '';
}

// Any company with more than one Sifa position record (distinct employment
// stints for the same employer, e.g. with a gap in between, or an employee
// stint plus a later consulting stint) collapses to ONE portfolio card,
// listing each stint by title and dates within the description — Teon wants
// one card per organization, not one per stint.
function mergeStints(positions) {
	const merged = [];
	const groups = new Map();
	for (const p of positions) {
		// An empty company (e.g. "Personal Sabbatical") never merges with
		// another empty-company entry — each gets its own unique key.
		const key = p.company || Symbol();
		if (!groups.has(key)) groups.set(key, []);
		groups.get(key).push(p);
	}
	for (const stints of groups.values()) {
		if (stints.length === 1) {
			merged.push(stints[0]);
			continue;
		}
		stints.sort((a, b) => (a.startedAt ?? '').localeCompare(b.startedAt ?? ''));
		const description = stints
			.map((p) => {
				const start = yearOnly(p.startedAt);
				const end = p.endedAt ? yearOnly(p.endedAt) : 'Present';
				const range = start === end ? start : `${start}–${end}`;
				return `### ${p.title} (${range})\n\n${p.description}`;
			})
			.join('\n\n');
		// Stints can overlap (e.g. a PhD spanning years alongside a one-semester
		// TA role within it), so the true end date is the latest across ALL
		// stints, not just the one that started last. An ongoing stint
		// (no endedAt) always wins.
		const latestEndingStint = stints.reduce((best, p) => {
			if (!best.endedAt) return best;
			if (!p.endedAt) return p;
			return p.endedAt > best.endedAt ? p : best;
		});
		merged.push({
			...latestEndingStint,
			title: latestEndingStint.title,
			startedAt: stints[0].startedAt,
			endedAt: latestEndingStint.endedAt,
			description
		});
	}
	return merged;
}

async function buildPortfolio(rawPositions, languages, skills) {
	const positions = mergeStints(rawPositions);
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

	const toCategoryToml = (category) => (Array.isArray(category) ? JSON.stringify(category) : `"${category ?? ''}"`);

	function positionBlock({ filename, organization, title, timespan, description, website, category }) {
		return (
			`[[positions]]\n` +
			`filename = ${tomlString(filename)}\n` +
			`organization = ${tomlString(organization)}\n` +
			`title = ${tomlString(title)}\n` +
			`timespan = ${tomlString(timespan)}\n` +
			`description = ${tomlMultilineString(description)}\n` +
			`website = ${tomlString(website)}\n` +
			`category = ${category}`
		);
	}

	const sifaEntries = positions.map((p) => {
		const company = (p.company ?? '').toLowerCase();
		const title = (p.title ?? '').toLowerCase();
		const match = oldByCompanyTitle[`${company}|${title}`] ?? oldByCompany[company];
		const block = positionBlock({
			filename: match?.filename ?? '',
			organization: p.company ?? '',
			title: p.title ?? '',
			timespan: `${p.startedAt ?? ''}${p.endedAt ? `-${p.endedAt}` : '-Present'}`,
			description: p.description,
			website: match?.website ?? '',
			category: toCategoryToml(match?.category)
		});
		return { sortKey: p.startedAt ?? '', block };
	});

	const manualEntries = old.positions
		.filter((p) => MANUAL_PORTFOLIO_ORGANIZATIONS.has(p.organization))
		.map((p) => {
			const block = positionBlock({
				filename: p.filename ?? '',
				organization: p.organization ?? '',
				title: p.title ?? '',
				timespan: p.timespan ?? '',
				description: (p.description ?? '').trim(),
				website: p.website ?? '',
				category: toCategoryToml(p.category)
			});
			return { sortKey: (p.timespan ?? '').match(/^\d{4}/)?.[0] ?? '', block };
		});

	const posBlocks = sifaEntries
		.concat(manualEntries)
		.sort((a, b) => a.sortKey.localeCompare(b.sortKey))
		.map((e) => e.block);

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

async function buildProjects(records) {
	// `role` (Maintainer, Core Contributor, Project Lead, etc.) has no equivalent
	// in Sifa's id.sifa.profile.project lexicon, so it's a local-only field
	// preserved across re-exports by matching on project name, same as
	// filename/category/website for positions.
	let oldByName = {};
	try {
		const oldRaw = await readFile(path.join(CONTENT_DIR, 'projects.toml'), 'utf-8');
		const old = parseToml(oldRaw);
		for (const p of old.project ?? []) {
			oldByName[(p.name ?? '').toLowerCase()] = p;
		}
	} catch {
		// no existing file yet
	}

	const blocks = records
		.sort((a, b) => (a.startedAt ?? '').localeCompare(b.startedAt ?? ''))
		.map((p) => {
			const role = oldByName[(p.name ?? '').toLowerCase()]?.role ?? '';
			return (
				`[[project]]\n` +
				`name = ${tomlString(p.name ?? '')}\n` +
				`role = ${tomlString(role)}\n` +
				`url = ${tomlString(p.url ?? '')}\n` +
				`started = ${tomlString(p.startedAt ?? '')}\n` +
				`ended = ${tomlString(p.endedAt ?? '')}\n` +
				`description = ${tomlMultilineString(p.description)}`
			);
		});
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

	await writeFile(path.join(CONTENT_DIR, 'projects.toml'), await buildProjects(projects));
	console.log(`projects.toml: ${projects.length} entries (new file)`);

	await writeFile(path.join(CONTENT_DIR, 'education.toml'), buildEducation(education));
	console.log(`education.toml: ${education.length} entries (new file)`);

	console.log('\nDone. Review the generated files before committing.');
}

main().catch((err) => {
	console.error('Export failed:', err);
	process.exit(1);
});
