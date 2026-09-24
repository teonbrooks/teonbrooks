import { parse } from 'smol-toml';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const CONTENT_DIR = path.join(import.meta.dirname, '..', '..', 'static', 'content', 'cv');

async function loadToml(filename) {
	const raw = await readFile(path.join(CONTENT_DIR, filename), 'utf-8');
	return parse(raw);
}

// Sifa has no email field at all — this is the one piece of contact info
// with no SSOT to pull from, confirmed with Teon directly.
const RESUME_EMAIL = 'teon.brooks@gmail.com';

// Matches the summary line on Teon's existing reference résumé — no Sifa
// field holds résumé-style ad copy like this (self.headline/about are
// shorter/longer, different purposes).
const RESUME_SUMMARY =
	'Strategic leader and PhD Data Scientist with 10+ years of experience bridging the gap between R&D, product strategy, and data science at scale.';

// Positions are otherwise sorted newest-first, but Teon wants Mozilla (a
// multi-year staff-level tenure) to read as the second entry — an explicit
// editorial call, since datalus is also ongoing (no end date) and would
// otherwise outrank it under any date-based sort, the same way it outranks
// Personal Sabbatical and Statespace.
const RESUME_POSITION_ORDER = ['Meta (United States)', 'Mozilla Corporation'];

// The résumé is a curated, industry-facing subset of the CV — not just a
// shorter version of it. Pre-2016 academic/training-era positions and pure
// teaching stints are left off entirely (they stay on the full CV); the
// Stanford postdoc moves under Education instead of Professional Experience.
// Confirmed with Teon directly, matching his existing reference résumé.
const RESUME_EXCLUDED_ORGANIZATIONS = new Set([
	'University of North Carolina at Chapel Hill',
	'New York University',
	'Télécom Paris',
	'Stanford University',
	'American University',
	'Recurse Center',
	'City University of New York'
]);

function yearOnly(s) {
	const m = (s ?? '').match(/\d{4}/);
	return m ? m[0] : s ?? '';
}

function formatTimespan(raw) {
	const m = raw.match(/^(\d{4}(?:-\d{2})?)-(\d{4}(?:-\d{2})?|Present)$/);
	if (!m) return raw;
	const [, start, end] = m;
	const startYear = yearOnly(start);
	if (end === 'Present') return `${startYear} – Present`;
	const endYear = yearOnly(end);
	return startYear === endYear ? startYear : `${startYear} – ${endYear}`;
}

// Splits a description into an ordered list of {type: 'heading', text},
// {type: 'note', text}, and {type: 'bullets', items} blocks. A
// "### Title (date)" line (produced by sifa-export-toml.mjs's stint-merging
// for positions with multiple stints, e.g. Mozilla) becomes a heading; a
// line that's entirely wrapped in parentheses (e.g. "(Meta via Magnit)")
// becomes an italicized note rather than a bullet; everything else becomes
// a bullet point, grouped with whichever bullets immediately precede it.
function parseDescriptionBlocks(description) {
	const lines = (description ?? '')
		.trim()
		.split(/\n+/)
		.map((l) => l.trim())
		.filter(Boolean);
	const blocks = [];
	let currentBullets = null;
	for (const line of lines) {
		const headingMatch = line.match(/^###\s+(.+)$/);
		if (headingMatch) {
			blocks.push({ type: 'heading', text: headingMatch[1] });
			currentBullets = null;
			continue;
		}
		const noteMatch = line.match(/^\((.+)\)$/);
		if (noteMatch) {
			blocks.push({ type: 'note', text: noteMatch[1] });
			currentBullets = null;
			continue;
		}
		if (!currentBullets) {
			currentBullets = { type: 'bullets', items: [] };
			blocks.push(currentBullets);
		}
		currentBullets.items.push(line);
	}
	return blocks;
}

// Flagship open-source work only, as a condensed one-line skills entry
// rather than the CV's full Open-Source Contributions section. MNE-Python/
// MNE-BIDS/MNE-Realtime combine into one "MNE-tools" range, matching how
// the website's Portfolio page already groups them for display.
const RESUME_OPEN_SOURCE = {
	'MNE-tools': ['MNE-Python', 'MNE-BIDS', 'MNE-Realtime'],
	'Brain Imaging Data Structure (BIDS)': ['Brain Imaging Data Structure (BIDS)'],
	NeuroAI: ['NeuroAI']
};

function buildOpenSourceItems(projects) {
	return Object.entries(RESUME_OPEN_SOURCE)
		.map(([label, memberNames]) => {
			const members = memberNames.map((name) => projects.find((p) => p.name === name)).filter(Boolean);
			if (members.length === 0) return null;
			const started = members.map((p) => p.started).filter(Boolean).sort()[0];
			const stillOpen = members.some((p) => !p.ended);
			const ended = stillOpen ? '' : members.map((p) => p.ended).filter(Boolean).sort().at(-1);
			return `${label} (${formatTimespan(`${started}${ended ? `-${ended}` : '-Present'}`)})`;
		})
		.filter(Boolean);
}

export async function loadResumeData() {
	const [portfolio, education, involvement, projects] = await Promise.all([
		loadToml('portfolio.toml'),
		loadToml('education.toml'),
		loadToml('involvement.toml'),
		loadToml('projects.toml')
	]);

	const positions = portfolio.positions
		.filter((p) => !RESUME_EXCLUDED_ORGANIZATIONS.has(p.organization))
		.slice()
		.sort((a, b) => {
			const ai = RESUME_POSITION_ORDER.indexOf(a.organization);
			const bi = RESUME_POSITION_ORDER.indexOf(b.organization);
			if (ai !== -1 || bi !== -1) {
				if (ai === -1) return 1;
				if (bi === -1) return -1;
				return ai - bi;
			}
			return (b.timespan ?? '').localeCompare(a.timespan ?? '');
		})
		.map((p) => ({
			...p,
			timespan: formatTimespan(p.timespan),
			blocks: parseDescriptionBlocks(p.description)
		}));

	const stanford = portfolio.positions.find((p) => p.organization === 'Stanford University');
	const phd = education.education.find((e) => e.degree === 'Ph.D.');
	const bs = education.education.find((e) => e.degree === 'B.S.');

	const educationEntries = [
		stanford && { institution: stanford.organization, degree: stanford.title, timespan: formatTimespan(stanford.timespan) },
		phd && { institution: phd.institution, degree: `Ph.D., ${phd.field}`, timespan: formatTimespan(`${phd.started}-${phd.ended}`) },
		bs && { institution: bs.institution, degree: `B.S., ${bs.field}`, timespan: formatTimespan(`${bs.started}-${bs.ended}`) }
	].filter(Boolean);

	const nonprofitRaw = involvement.involvement.find((v) => v.organization === 'Gotham Data Clinic');
	const nonprofit = nonprofitRaw && {
		...nonprofitRaw,
		timespan: formatTimespan(`${nonprofitRaw.started}${nonprofitRaw.ended ? `-${nonprofitRaw.ended}` : '-Present'}`),
		blocks: parseDescriptionBlocks(nonprofitRaw.description)
	};

	return {
		id: portfolio.id,
		email: RESUME_EMAIL,
		summary: RESUME_SUMMARY,
		skills: portfolio.skills,
		openSource: buildOpenSourceItems(projects.project),
		positions,
		education: educationEntries,
		nonprofit
	};
}
