<script>
import Article from "$lib/components/Article.svelte";
// TODO: consider creating a page.js similar to blog/[post]/+page.js for import
import MdRaw from "$lib/content/about/brooks_bio.md?raw";

</script>

<svelte:head>
	<title>About</title>
</svelte:head>
<Article content={MdRaw}/>
