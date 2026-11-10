<script>
	import { mdiLink, mdiClose } from '@mdi/js';
	import md from 'markdown-it';

	let { path, item } = $props();
	let open = $state(false);
	let dialog = $state();

	// Native <dialog> gives focus trapping and Escape-to-close for free; the
	// open flag stays the single source of truth.
	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		else if (!open && dialog.open) dialog.close();
	});

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
	<div class="card bg-base-100 h-full w-full shadow-sm">
		<div class="card-body grid flex-1 place-items-center p-4">
			{#if item.filename}
				<img
					class="size-40 object-contain"
					src="{path}/{item.filename}"
					alt="icon for {item.organization}"
				/>
			{/if}
		</div>
		<div class="card-actions items-center justify-between px-2 pb-2">
			<button class="btn btn-ghost btn-sm" onclick={() => (open = true)}>Details</button>
			{#if item.website}
				<button
					class="btn btn-ghost btn-circle btn-sm"
					onclick={() => window.open(item.website)}
					title="Open Link"
					aria-label="Open link"
				>
					<svg viewBox="0 0 24 24" class="size-5"><path fill="currentColor" d={mdiLink} /></svg>
				</button>
			{/if}
		</div>
	</div>

	<dialog bind:this={dialog} class="modal" onclose={() => (open = false)}>
		<div class="modal-box max-w-3xl">
			<button
				class="btn btn-ghost btn-circle btn-sm absolute top-2 right-2"
				aria-label="Close"
				onclick={() => (open = false)}
			>
				<svg viewBox="0 0 24 24" class="size-5"><path fill="currentColor" d={mdiClose} /></svg>
			</button>
			{#if item.filename}
				<img
					src="{path}/{item.filename}"
					alt="icon for {item.organization}"
					width="100"
					height="100"
				/>
			{/if}
			<h1 class="text-2xl">{item.organization}</h1>
			<h2 class="text-lg">{item.title}</h2>
			<p><em>{formatTimespan(item.timespan)}</em></p>
			<div class="description">
				<!-- Content is from trusted static TOML files — no XSS risk.
				     For untrusted input, use marked + DOMPurify instead:
				     {@html DOMPurify.sanitize(marked.parse(content))} -->
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html md().render(withParagraphBreaks(item.description))}
			</div>
		</div>
		<div class="modal-backdrop">
			<button
				class="m-0 h-full w-full cursor-default border-0 bg-transparent p-0 text-transparent"
				aria-label="Close"
				onclick={() => (open = false)}>close</button
			>
		</div>
	</dialog>
</div>

<style>
	#card {
		width: 12rem;
		height: 20rem;
	}

	/* h3 comes from {@html}-rendered markdown, so it needs :global to reach
	   it — scoped to .description so it doesn't affect h3 elsewhere on the
	   page. Sized to sit below h2 rather than the oversized browser default. */
	.description :global(h3) {
		font-size: medium;
		margin-bottom: 0.25em;
	}
</style>
