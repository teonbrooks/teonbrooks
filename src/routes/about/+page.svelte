<script>
import Article from "$lib/components/Article.svelte";

    export let data;
</script>

<svelte:head>
    <!-- <script defer data-domain="teonbrooks.com" src="https://plausible.io/js/script.js"></script> -->
	<title>About</title>
</svelte:head>
<Article content={data.Md}/>
