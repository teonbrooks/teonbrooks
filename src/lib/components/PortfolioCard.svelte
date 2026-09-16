<script>
	import { mdiLink, mdiClose } from '@mdi/js';
	import Card, { Content, Actions, ActionButtons, ActionIcons } from '@smui/card';
	import Button, { Label } from '@smui/button';
	import IconButton, { Icon } from '@smui/icon-button';
	import Dialog, { Content as DContent } from '@smui/dialog';
	import md from 'markdown-it';

	let { path, item } = $props();
	let open = $state(false);

	// portfolio.toml stores timespan as a single pre-joined string like
	// "2008-01-2011-07" or "2015-08-Present" — display year-only ranges
	// ("2008-2011") rather than the raw year-month form.
	function formatTimespan(raw) {
		const m = raw.match(/^(\d{4}(?:-\d{2})?)-(\d{4}(?:-\d{2})?|Present)$/);
		if (!m) return raw;
		const [, start, end] = m;
		const startYear = start.slice(0, 4);
		if (end === 'Present') return `${startYear}-Present`;
		const endYear = end.slice(0, 4);
		return startYear === endYear ? startYear : `${startYear}-${endYear}`;
	}

	// Descriptions often list several points one per line with no blank line
	// between them (no bullet markup to lean on) — markdown-it then renders
	// them as one run-on paragraph. Treat every line break as a paragraph
	// break so each point gets its own line, regardless of whether the
	// source used single or double newlines.
	function withParagraphBreaks(description) {
		return description.replace(/\n+/g, '\n\n');
	}
</script>

<div id="card">
	<Card>
		<Content>
			{#if item.filename}
				<div class="image">
					<img src="{path}/{item.filename}" alt='icon for {item.organization}' />
				</div>
			{/if}
		</Content>
		<Actions style="align-items:end">
			<ActionButtons>
				<Button ripple={false} onclick={() => (open = true)}>
					<Label>Details</Label>
				</Button>
			</ActionButtons>
			{#if item.website}
				<ActionIcons>
					<IconButton onclick={() => window.open(item.website)} title="Open Link">
						<Icon tag="svg" viewBox="0 0 24 24">
							<path fill="currentColor" d={mdiLink} />
						</Icon>
					</IconButton>
				</ActionIcons>
			{/if}
		</Actions>
	</Card>
	<Dialog bind:open sheet aria-describedby="sheet-content">
		<DContent id="sheet-content">
			<IconButton action="close" class="material-icons">
				<Icon tag="svg" viewBox="0 0 24 24">
					<path fill="currentColor" d={mdiClose} />
				</Icon>
			</IconButton>
			<div>
				{#if item.filename}
					<img
						src="{path}/{item.filename}"
						alt='icon for {item.organization}'
						width="100"
						height="100"
					/>
				{/if}
				<h1>{item.organization}</h1>
				<h2>{item.title}</h2>
				<p><em>{formatTimespan(item.timespan)}</em></p>
				<div class="description">
					<!-- Content is from trusted static TOML files — no XSS risk.
					     For untrusted input, use marked + DOMPurify instead:
					     {@html DOMPurify.sanitize(marked.parse(content))} -->
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html md().render(withParagraphBreaks(item.description))}
				</div>
			</div>
		</DContent>
	</Dialog>
</div>

<style>

	#card {
		width: 12rem;
		height: 20rem;
	}

	img {
		width: 10rem;
		height: 10rem;
	}

	.image {
		display: grid;
		place-items: center;
	}

	h1 {
		font-size: x-large;
	}
	h2 {
		font-size: large;
	}

	/* h3 comes from {@html}-rendered markdown, so it needs :global to reach
	   it — scoped to .description so it doesn't affect h3 elsewhere on the
	   page. Sized to sit below h2 rather than the oversized browser default. */
	.description :global(h3) {
		font-size: medium;
		margin-bottom: 0.25em;
	}

	/* MDC's card-action button ripple mis-centers its hover/focus state layer,
	   so the highlight only ever covers the left half of the button. Disable
	   it and use a plain, correctly-sized hover/focus background instead. */
	:global(.mdc-card__action--button .mdc-button__ripple::before),
	:global(.mdc-card__action--button .mdc-button__ripple::after) {
		display: none !important;
	}
	:global(.mdc-card__action--button:hover),
	:global(.mdc-card__action--button:focus) {
		background-color: rgba(98, 0, 238, 0.08) !important;
	}
</style>
