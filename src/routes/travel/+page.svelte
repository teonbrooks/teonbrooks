<script>
  import { siteTitle, siteDescription, siteImage, siteImageWidth, siteAuthor, siteURL, faviconImage } from '$lib/config';
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
// 2. will store a private md file for each album that contains the album link and the narrative  -->
<svelte:head>
    <!-- Open Graph -->
	<meta data-key="description" name="description" content={siteDescription} />
	<meta property="og:type" content="profile" />
	<meta property="og:url" content={siteURL}>
	<meta property="og:title" content={siteTitle} />
	<meta property="og:description" content={siteDescription} />
	<meta property="og:image" content={faviconImage} />
	<meta property="og:image:width" content={siteImageWidth} />
	<meta property="og:image:height" content={siteImageWidth} />
	<!-- Twitter -->
	<meta name="twitter:title" content={siteTitle}>
	<meta name="twitter:description" content={siteDescription}>
	<meta name="twitter:site" content="@teonbrooks">
	<meta name="twitter:image" content={faviconImage}>
	<meta name="twitter:card" content="summary_large_image">
	<title>Travel</title>
</svelte:head>

🚧 To Be Completed 🚧

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