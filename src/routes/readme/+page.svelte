<script>
import Article from "$lib/components/Article.svelte";
import MdRaw from "$lib/../../README.md?raw";

</script>

<svelte:head>
	<title>Readme</title>
</svelte:head>
<Article content={MdRaw}/>
