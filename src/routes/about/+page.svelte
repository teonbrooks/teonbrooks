<script>
import Article from "$lib/components/Article.svelte";
import MdRaw from "$lib/content/about/brooks_bio.md?raw";

</script>

<svelte:head>
	<title>About</title>
</svelte:head>
<Article content={MdRaw}/>
