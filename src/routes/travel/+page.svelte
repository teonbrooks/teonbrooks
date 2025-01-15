<script>
    import TravelTag from '$lib/components/TravelTag.svelte'

    let { data } = $props();
    let { logTravel, recs } = $state(data);

    let { recommendations } = recs;
    
    logTravel.trips.forEach((trip, idx) => {
        if (trip.stays) {
            trip.stays.forEach((stay, idy) => {
                recommendations.filter(rec => stay.destination == stay.destination).pop()
                let rec = recommendations.filter(r => r.destination == stay.destination)[0];
                logTravel.trips[idx].stays[idy].linkRec = typeof rec === 'undefined' ? '' : rec['linkRec'];

                if (trip.linkAlbum) {
                    logTravel.trips[idx].stays[idy].linkAlbum = trip.linkAlbum
                }
            })
        }
    });

</script>

<!-- // 1. this will be a page that pulls from the posts using the api for all the travel tagged posts
// 2. will store a private md file for each album that contains the album link and the narrative 
<svelte:head>
	<title>Travel</title>
</svelte:head>

🚧 To Be Completed 🚧 -->

<h1>Places Visited</h1>
<div class="tags">
{#each logTravel['trips'] as trip}
    {#if trip['stays']}
        {#each trip['stays'] as stay}
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