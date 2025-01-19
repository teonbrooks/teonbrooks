<script>
    import {
        Timeline,
        TimelineItem,
        TimelineSeparator,
        TimelineDot,
        TimelineConnector,
        TimelineContent
    } from 'svelte-vertical-timeline'

    const options = [{ title: 'Eat' }, { title: 'Sleep' }, { title: 'Code' }];
</script>

<article>
    <Timeline position="alternate">
        {#each options as option}
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <h3>{option.title}</h3>
                </TimelineContent>
            </TimelineItem>
        {/each}
    </Timeline>
</article>