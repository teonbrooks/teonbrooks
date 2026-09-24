import { parse } from 'smol-toml';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const CONTENT_DIR = path.join(import.meta.dirname, '..', '..', 'static', 'content', 'cv');

async function loadToml(filename) {
	const raw = await readFile(path.join(CONTENT_DIR, filename), 'utf-8');
	return parse(raw);
}

// Sifa stores everything oldest-first; CVs/résumés read newest-first.
const byNewest = (key) => (a, b) => (b[key] ?? '').localeCompare(a[key] ?? '');

// publications.toml dates mix "Month Year" and bare "Year" strings, which don't
// sort correctly as plain text (e.g. "2019" > "August 2017" alphabetically but
// also > "March 2024"), so sort by an actual computed year/month key instead.
const MONTHS = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
];
function dateSortKey(dateStr) {
	const year = parseInt((dateStr.match(/\d{4}/) ?? ['0'])[0], 10);
	const month = MONTHS.findIndex((m) => dateStr.includes(m));
	return year * 12 + Math.max(month, 0);
}
const byNewestDate = (key) => (a, b) => dateSortKey(b[key] ?? '') - dateSortKey(a[key] ?? '');

// term can be a single string or (for a course taught across multiple terms) a
// list of strings; sort on the most recent one.
const latestDateSortKey = (value) => {
	const values = Array.isArray(value) ? value : [value ?? ''];
	return Math.max(...values.map(dateSortKey));
};
const byNewestOfDates = (key) => (a, b) => latestDateSortKey(b[key]) - latestDateSortKey(a[key]);

// The CV shows year-only ranges, never months — strip any "-MM" component.
function yearOnly(s) {
	const m = (s ?? '').match(/\d{4}/);
	return m ? m[0] : s;
}

// positions.toml stores timespan as a single pre-joined string like
// "2008-01-2011-07" or "2015-08-Present" (see sifa-export-toml.mjs); reformat
// for display as e.g. "2008 – 2011" rather than showing it raw.
function formatTimespan(raw) {
	const m = raw.match(/^(\d{4}(?:-\d{2})?)-(\d{4}(?:-\d{2})?|Present)$/);
	if (!m) return raw;
	const [, start, end] = m;
	const startYear = yearOnly(start);
	if (end === 'Present') return `${startYear} – Present`;
	const endYear = yearOnly(end);
	return startYear === endYear ? startYear : `${startYear} – ${endYear}`;
}

// Education is ordered by degree level (PhD, then Master's, then Bachelor's)
// rather than strictly by start date, per Teon's preference.
const DEGREE_RANK = { 'Ph.D.': 0, "Master's Degree": 1, 'B.S.': 2 };
const byDegreeLevel = (a, b) => (DEGREE_RANK[a.degree] ?? 99) - (DEGREE_RANK[b.degree] ?? 99);

// Normalizes the ad-hoc "; " / "; and " / "; & " separators used in publications.toml
// into APA's ", " ... ", & " author-list style, regardless of source formatting.
function apaAuthors(raw) {
	const parts = raw
		.replace(/\s+/g, ' ')
		.trim()
		.split(';')
		.map((s) => s.trim().replace(/^(?:and|&)\s+/, ''));
	if (parts.length === 1) return parts[0];
	const last = parts.pop();
	return `${parts.join(', ')}, & ${last}`;
}

// APA's bracketed medium-type label, by assets.toml `kind`.
const KIND_LABELS = {
	'workshop kit': 'Workshop kit',
	standard: 'Standard',
	software: 'Computer software',
	dataset: 'Data set',
	lecture: 'Lecture'
};

function apaAsset(a) {
	const year = (a.date.match(/\d{4}/) ?? [''])[0];
	return {
		...a,
		authorsApa: apaAuthors(a.authors),
		year,
		kindLabel: KIND_LABELS[a.kind] ?? a.kind
	};
}

// Wraps Teon's own name in **markers** (parsed into bold by the Typst
// template) wherever it appears in an already-APA-formatted author list, so
// his contribution stands out among co-authors — a common CV convention.
function boldSelf(authorsApa) {
	return authorsApa.replace(/Brooks, T\.?\s*L?\.?/g, (m) => `**${m}**`);
}

function apaCitation(p) {
	const year = (p.date.match(/\d{4}/) ?? [''])[0];
	const title = p.title.replace(/\s+/g, ' ').trim();
	const venue = p.journal ?? p.publisher;
	const detailParts = [];
	if (p.volume != null) detailParts.push(String(p.volume));
	if (p.page != null) detailParts.push(String(p.page));
	if (p.article_no != null) detailParts.push(`Article ${p.article_no}`);
	return {
		...p,
		authorsApa: boldSelf(apaAuthors(p.authors)),
		year,
		title,
		venue,
		venueDetail: detailParts.join(', ')
	};
}

export async function loadCvData() {
	const [portfolio, education, honors, projects, involvement, talks, posters, publications, assets, teaching] = await Promise.all([
		loadToml('portfolio.toml'),
		loadToml('education.toml'),
		loadToml('honors.toml'),
		loadToml('projects.toml'),
		loadToml('involvement.toml'),
		loadToml('talks.toml'),
		loadToml('posters.toml'),
		loadToml('publications.toml'),
		loadToml('assets.toml'),
		loadToml('teaching.toml')
	]);

	return {
		id: portfolio.id,
		skills: portfolio.skills,
		positions: portfolio.positions
			.slice()
			.sort(byNewest('timespan'))
			.map((p) => ({ ...p, timespan: formatTimespan(p.timespan) })),
		education: education.education.slice().sort(byDegreeLevel),
		honors: honors.honor
			.slice()
			.sort(byNewest('awarded'))
			.map((h) => ({ ...h, awarded: yearOnly(h.awarded) })),
		projects: projects.project
			.slice()
			.sort(byNewest('started'))
			.map((p) => ({ ...p, started: yearOnly(p.started), ended: yearOnly(p.ended) })),
		involvement: involvement.involvement
			.slice()
			.sort(byNewest('started'))
			.map((v) => ({ ...v, started: yearOnly(v.started), ended: yearOnly(v.ended) })),
		talks: talks.engagements.slice().sort(byNewest('date')),
		posters: posters.poster
			.slice()
			.sort(byNewest('date'))
			.map((p) => ({ ...p, authors: apaAuthors(p.authors) })),
		publications: publications.publications.map(apaCitation).sort(byNewestDate('date')),
		assets: assets.assets.map(apaAsset).sort(byNewestDate('date')),
		teaching: teaching.teaching.slice().sort(byNewestOfDates('term'))
	};
}
