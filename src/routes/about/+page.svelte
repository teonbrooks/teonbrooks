<script>
import Article from "$lib/components/Article.svelte";

    export let data;
</script>

<svelte:head>
	<title>About</title>
</svelte:head>
<Article content={data.Md}/>
