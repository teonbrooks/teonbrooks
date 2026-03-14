<script>
    import { getContext } from 'svelte';
    import md from 'markdown-it';

    const toml = getContext('toml');
</script>

<ul class="timeline">
    {#each toml.events as event (event.date)}
        <li>
            <div class="timeline-middle">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                </svg>
            </div>
            <div class="timeline-box">
                <h3 class="timeline-date">{event.date}</h3>
                <!-- Content is from trusted static TOML files — no XSS risk.
                     For untrusted input, use marked + DOMPurify instead:
                     {@html DOMPurify.sanitize(marked.parse(content))} -->
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                <div class="timeline-content">{@html md().render(event.description)}</div>
            </div>
            <hr />
        </li>
    {/each}
</ul>

<style>
    .timeline {
        list-style: none;
        padding: 0;
        margin: 0;
        position: relative;
    }

    .timeline li {
        display: grid;
        grid-template-columns: 2rem 1fr;
        column-gap: 1rem;
        position: relative;
        padding-bottom: 1.5rem;
    }

    /* Vertical connecting line */
    .timeline li > hr {
        position: absolute;
        left: calc(1rem - 1px);
        top: 1.5rem;
        bottom: 0;
        width: 2px;
        border: none;
        background-color: oklch(var(--color-base-300, 70% 0 0));
        margin: 0;
    }

    .timeline li:last-child > hr {
        display: none;
    }

    .timeline-middle {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 0.25rem;
        z-index: 1;
    }

    .timeline-middle svg {
        width: 1.25rem;
        height: 1.25rem;
        color: oklch(var(--color-primary, 60% 0.2 250));
        background: white;
    }

    .timeline-box {
        background-color: oklch(var(--color-base-100, 98% 0 0));
        border: 1px solid oklch(var(--color-base-300, 70% 0 0));
        border-radius: 0.5rem;
        padding: 0.75rem 1rem;
        margin-bottom: 0;
    }

    .timeline-date {
        font-size: 0.875rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
    }

    .timeline-content {
        font-size: 0.875rem;
    }

    .timeline-content :global(p) {
        margin: 0.25rem 0;
    }

    .timeline-content :global(ul) {
        margin: 0.25rem 0;
        padding-left: 1.25rem;
    }

    .timeline-content :global(h2),
    .timeline-content :global(h3) {
        font-size: 0.875rem;
        margin: 0.5rem 0 0.25rem;
    }

    .timeline-content :global(a) {
        word-break: break-word;
    }

    .timeline-content :global(code) {
        font-size: inherit;
    }
</style>
