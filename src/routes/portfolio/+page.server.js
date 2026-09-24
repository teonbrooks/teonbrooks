export const prerender = true;

const CARD_SHAPE = ['filename', 'organization', 'title', 'timespan', 'description', 'website', 'category'];

// Builds a "timespan" string in the same convention positions already use
// (started[-ended|-Present]), so the existing year-only formatter in
// PortfolioCard.svelte handles it with no changes.
function daterange(started, ended) {
	if (!started) return '';
	return `${started}${ended ? `-${ended}` : '-Present'}`;
}

// Only projects/honors/involvement entries that have been given a curated
// logo (filename) become cards — otherwise every membership, travel award,
// and one-off contribution in those collections would flood the page.
// Positions render unconditionally, same as before.
function toCardShape(item) {
	return Object.fromEntries(CARD_SHAPE.map((key) => [key, item[key] ?? '']));
}

export const load = async ({ url, fetch }) => {
	const fetchToml = async (log) => {
		const resp = await fetch(`${url.origin}/api/cv/${log}.toml`);
		return resp.json();
	};

	const [portfolio, projects, honors, involvement] = await Promise.all([
		fetchToml('portfolio'),
		fetchToml('projects'),
		fetchToml('honors'),
		fetchToml('involvement')
	]);

	const positionItems = portfolio.positions.map(toCardShape);

	// An honor with no curated card of its own (no filename — e.g. a school's
	// internal fellowship or award, as opposed to something like the Carolina
	// Covenant Scholarship, which does get its own card) folds into the
	// existing position card for that same organization instead of vanishing
	// silently, when one exists.
	for (const h of honors.honor.filter((h) => !h.filename)) {
		const position = positionItems.find((p) => p.organization === h.issuer);
		if (!position) continue;
		const range = h.awarded ? `(${h.awarded})` : '';
		position.description += `\n\n### ${h.title} ${range}\n\n${h.description ?? ''}`.trimEnd();
	}

	const projectItems = projects.project
		.filter((p) => p.filename)
		.map((p) =>
			toCardShape({
				filename: p.filename,
				organization: p.name,
				title: p.role,
				timespan: daterange(p.started, p.ended),
				description: p.description,
				website: p.url,
				category: p.category
			})
		);

	const honorItems = honors.honor
		.filter((h) => h.filename)
		.map((h) =>
			toCardShape({
				filename: h.filename,
				organization: h.issuer,
				title: h.title,
				timespan: h.awarded,
				description: h.description,
				website: h.website,
				category: h.category
			})
		);

	const involvementItems = involvement.involvement
		.filter((v) => v.filename)
		.map((v) =>
			toCardShape({
				filename: v.filename,
				organization: v.organization,
				title: v.role,
				timespan: daterange(v.started, v.ended),
				description: v.description,
				website: v.url,
				category: v.category
			})
		);

	const path = '/images/portfolio_icons';

	return {
		portfolio: { positions: [...positionItems, ...projectItems, ...honorItems, ...involvementItems] },
		path
	};
};
