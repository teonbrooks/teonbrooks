<script>
    import md from 'markdown-it';
    import {
        Timeline,
        TimelineItem,
        TimelineSeparator,
        TimelineDot,
        TimelineConnector,
        TimelineContent
    } from 'svelte-vertical-timeline'

    let { toml } = $props();

</script>

<article>
    <Timeline position="alternate">
        {#each toml.events as event (event.date)}
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <h3>{event.date}</h3>
                    <!-- Content is from trusted static TOML files — no XSS risk.
                         For untrusted input, use marked + DOMPurify instead:
                         {@html DOMPurify.sanitize(marked.parse(content))} -->
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    <p>{@html md().render(event.description)}</p>
                </TimelineContent>
            </TimelineItem>
        {/each}
    </Timeline>
</article>

<style>
    p {
        font-size: small;
    }
</style>