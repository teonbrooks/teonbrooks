const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

function parse(date) {
	const m = (date ?? '').match(/^(\d{4})(?:-(\d{2}))?/);
	return m ? { year: m[1], month: m[2] ? Number(m[2]) : null } : null;
}

// Academic calendar: Spring Jan-May, Summer Jun-Aug, Fall Sep-Dec.
function season(month) {
	return month <= 5 ? 'Spring' : month <= 8 ? 'Summer' : 'Fall';
}

// Display label for a course's Sifa start/end dates (YYYY, YYYY-MM or
// YYYY-MM-DD), used only when teaching.toml has no hand-written term.
export function termLabel(startedAt, endedAt) {
	const start = parse(startedAt);
	if (!start) return '';
	const end = parse(endedAt);
	if (!start.month) return end && end.year !== start.year ? `${start.year}–${end.year}` : start.year;
	const label = (d) => `${season(d.month)} ${d.year}`;
	if (!endedAt) return `${label(start)} – Present`;
	if (!end?.month) return label(start);
	if (start.year === end.year && start.month === end.month) return `${MONTHS[start.month - 1]} ${start.year}`;
	return label(start) === label(end) ? label(start) : `${label(start)} – ${label(end)}`;
}
