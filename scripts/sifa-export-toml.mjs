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

// Sifa's employmentType is a real, structured field — display it as a
// "(Label)" suffix on the position title rather than leaving it unsurfaced.
// fullTime is the unremarkable default and omitted; every other value is
// worth flagging (contract, part-time, board seat, fellowship, etc.).
const EMPLOYMENT_TYPE_LABELS = {
	'id.sifa.defs#partTime': 'Part-time',
	'id.sifa.defs#temporary': 'Temporary',
	'id.sifa.defs#seasonal': 'Seasonal',
	'id.sifa.defs#contract': 'Contract',
	'id.sifa.defs#freelance': 'Freelance',
	'id.sifa.defs#selfEmployed': 'Self-employed',
	'id.sifa.defs#independentWork': 'Independent',
	'id.sifa.defs#internship': 'Internship',
	'id.sifa.defs#apprenticeship': 'Apprenticeship',
	'id.sifa.defs#fellowship': 'Fellowship',
	'id.sifa.defs#trainee': 'Trainee',
	'id.sifa.defs#volunteer': 'Volunteer',
	'id.sifa.defs#boardMember': 'Board Member',
	'id.sifa.defs#boardObserver': 'Board Observer',
	'id.sifa.defs#advisor': 'Advisor'
};

function withEmploymentTypeSuffix(title, employmentType) {
	const label = EMPLOYMENT_TYPE_LABELS[employmentType];
	return label ? `${title} (${label})` : title;
}

// ---------------------------------------------------------------------------
// portfolio.toml: [[positions]] + [skills]
// ---------------------------------------------------------------------------

// Portfolio card date ranges are always year-only for display, never
// year-month.
function yearOnly(s) {
	const m = (s ?? '').match(/\d{4}/);
	return m ? m[0] : s ?? '';
}

// Any group (by company for positions, by upstream for involvement) with
// more than one Sifa record — distinct stints, e.g. with a gap in between,
// or an employee stint plus a later consulting stint — collapses to ONE
// card, listing each stint by title/role and dates within the description.
// Teon wants one card per organization, not one per stint.
function mergeStintsBy(records, { groupKey, title, start, end, description }) {
	const merged = [];
	const groups = new Map();
	for (const r of records) {
		// An empty/missing group key (e.g. "Personal Sabbatical") never merges
		// with another empty-key entry — each gets its own unique key.
		const key = r[groupKey] || Symbol();
		if (!groups.has(key)) groups.set(key, []);
		groups.get(key).push(r);
	}
	for (const stints of groups.values()) {
		if (stints.length === 1) {
			merged.push(stints[0]);
			continue;
		}
		stints.sort((a, b) => (a[start] ?? '').localeCompare(b[start] ?? ''));
		const combinedDescription = stints
			.map((r) => {
				const s = yearOnly(r[start]);
				const e = r[end] ? yearOnly(r[end]) : 'Present';
				const range = s === e ? s : `${s}–${e}`;
				return `### ${r[title]} (${range})\n\n${r[description]}`;
			})
			.join('\n\n');
		// Stints can overlap or leave a gap (e.g. a board seat held, vacated,
		// then held again years later), so the true end date is the latest
		// across ALL stints, not just the one that started last. An ongoing
		// stint (no end date) always wins.
		const latestEndingStint = stints.reduce((best, r) => {
			if (!best[end]) return best;
			if (!r[end]) return r;
			return r[end] > best[end] ? r : best;
		});
		merged.push({
			...latestEndingStint,
			[start]: stints[0][start],
			[end]: latestEndingStint[end],
			[description]: combinedDescription
		});
	}
	return merged;
}

async function buildPortfolio(rawPositions, languages, skills) {
	const positions = mergeStintsBy(rawPositions, {
		groupKey: 'company',
		title: 'title',
		start: 'startedAt',
		end: 'endedAt',
		description: 'description'
	});
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

	const posBlocks = positions
		.map((p) => {
			const company = (p.company ?? '').toLowerCase();
			const title = (p.title ?? '').toLowerCase();
			const match = oldByCompanyTitle[`${company}|${title}`] ?? oldByCompany[company];
			const block = positionBlock({
				filename: match?.filename ?? '',
				organization: p.company ?? '',
				title: withEmploymentTypeSuffix(p.title ?? '', p.employmentType),
				timespan: `${p.startedAt ?? ''}${p.endedAt ? `-${p.endedAt}` : '-Present'}`,
				description: p.description,
				website: match?.website ?? '',
				category: toCategoryToml(match?.category)
			});
			return { sortKey: p.startedAt ?? '', block };
		})
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

// filename/category (and website, where Sifa has no equivalent) have no
// place in the corresponding Sifa lexicons, so — same pattern as positions —
// they're local-only fields preserved across re-exports by reading the
// current file and matching on name/title before it gets overwritten.
async function loadOldByKey(filename, tableKey, keyField) {
	const oldByKey = {};
	try {
		const oldRaw = await readFile(path.join(CONTENT_DIR, filename), 'utf-8');
		const old = parseToml(oldRaw);
		for (const row of old[tableKey] ?? []) {
			oldByKey[(row[keyField] ?? '').toLowerCase()] = row;
		}
	} catch {
		// no existing file yet
	}
	return oldByKey;
}

async function buildInvolvement(rawRecords) {
	const records = mergeStintsBy(rawRecords, {
		groupKey: 'upstream',
		title: 'role',
		start: 'startedAt',
		end: 'endedAt',
		description: 'description'
	});
	const oldByOrg = await loadOldByKey('involvement.toml', 'involvement', 'organization');
	const blocks = records
		.sort((a, b) => (a.startedAt ?? '').localeCompare(b.startedAt ?? ''))
		.map((v) => {
			const match = oldByOrg[(v.upstream ?? '').toLowerCase()];
			const links = (v.links ?? []).map((l) => l.url).filter(Boolean);
			const linksField = links.length === 0 ? '""' : links.length === 1 ? tomlString(links[0]) : JSON.stringify(links);
			return (
				`[[involvement]]\n` +
				`filename = ${tomlString(match?.filename ?? '')}\n` +
				`organization = ${tomlString(v.upstream ?? '')}\n` +
				`role = ${tomlString(v.role ?? '')}\n` +
				`kind = ${tomlString((v.kind ?? '').replace('id.sifa.defs#involvement', ''))}\n` +
				`started = ${tomlString(v.startedAt ?? '')}\n` +
				`ended = ${tomlString(v.endedAt ?? '')}\n` +
				`location = ${tomlString(v.location ? [v.location.locality, v.location.region, v.location.country].filter(Boolean).join(', ') : '')}\n` +
				`url = ${tomlString(v.upstreamUrl || match?.url || '')}\n` +
				`links = ${linksField}\n` +
				`category = ${match?.category ? JSON.stringify([].concat(match.category)) : '""'}\n` +
				`description = ${tomlMultilineString(v.description)}`
			);
		});
	return blocks.join('\n\n') + '\n';
}

async function buildHonors(records) {
	const oldByTitle = await loadOldByKey('honors.toml', 'honor', 'title');
	const blocks = records
		.sort((a, b) => (a.awardedAt ?? '').localeCompare(b.awardedAt ?? ''))
		.map((h) => {
			const match = oldByTitle[(h.title ?? '').toLowerCase()];
			return (
				`[[honor]]\n` +
				`filename = ${tomlString(match?.filename ?? '')}\n` +
				`title = ${tomlString(h.title ?? '')}\n` +
				`issuer = ${tomlString(h.issuer ?? '')}\n` +
				`awarded = ${tomlString(h.awardedAt ?? '')}\n` +
				`website = ${tomlString(match?.website ?? '')}\n` +
				`category = ${match?.category ? JSON.stringify([].concat(match.category)) : '""'}\n` +
				`description = ${tomlMultilineString(h.description)}`
			);
		});
	return blocks.join('\n\n') + '\n';
}

async function buildProjects(records) {
	const oldByName = await loadOldByKey('projects.toml', 'project', 'name');
	const blocks = records
		.sort((a, b) => (a.startedAt ?? '').localeCompare(b.startedAt ?? ''))
		.map((p) => {
			const match = oldByName[(p.name ?? '').toLowerCase()];
			return (
				`[[project]]\n` +
				`filename = ${tomlString(match?.filename ?? '')}\n` +
				`name = ${tomlString(p.name ?? '')}\n` +
				`role = ${tomlString(match?.role ?? '')}\n` +
				`url = ${tomlString(p.url ?? '')}\n` +
				`started = ${tomlString(p.startedAt ?? '')}\n` +
				`ended = ${tomlString(p.endedAt ?? '')}\n` +
				`category = ${match?.category ? JSON.stringify([].concat(match.category)) : '""'}\n` +
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

	await writeFile(path.join(CONTENT_DIR, 'involvement.toml'), await buildInvolvement(involvement));
	console.log(`involvement.toml: ${involvement.length} entries (new file)`);

	await writeFile(path.join(CONTENT_DIR, 'honors.toml'), await buildHonors(honors));
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
