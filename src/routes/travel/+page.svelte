<script>
    import TravelTag from '$lib/components/TravelTag.svelte'
    // import TOML from 'iarna-toml-esm';
    // import logTravel from '$lib/logs/log-travel.toml?raw';

    // export let travelLog = TOML.parse(logTravel);
    // config = toml.parse(Travel);
    import logTravel from '$lib/logs/log-travel.json';
</script>

<!-- // 1. this will be a page that pulls from the posts using the api for all the travel tagged posts
// 2. will store a private md file for each album that contains the album link and the narrative 
<svelte:head>
    <script defer data-domain="teonbrooks.com" src="https://plausible.io/js/script.js"></script>
	<title>Travel</title>
</svelte:head>

🚧 To Be Completed 🚧 -->

<h1>Places Visited</h1>
<div class="tags">
{#each logTravel['trip'] as trip}
    {#if trip['stay']}
        {#each trip['stay'] as stay}
        <TravelTag {...stay}/>
        {/each}
    {/if}
{/each}
</div>

<style>
    .tags {
        display: flex;
        justify-content: space-between;
        /* width: 1000px; */
        flex-wrap: wrap;
    }
</style>
    <!-- <TravelTag /> -->

<!-- {logTravel['id']['name']} -->

<!-- {travelLog['id']} -->

<!-- {#each } -->