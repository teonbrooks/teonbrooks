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
        {#each toml.events as event}
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <h3>{event.date}</h3>
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