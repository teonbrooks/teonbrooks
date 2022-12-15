<!-- This file renders each individual blog post for reading. Be sure to update the svelte:head below -->
<script>
<<<<<<< HEAD
	export let data;

	const { title, excerpt, date, updated, coverImage, coverWidth, coverHeight, categories } =
		data.meta;
	const { PostContent } = data;
=======
export let data
let { title, excerpt, date, updated, migrated, coverImage, coverWidth, coverHeight, categories } = data.meta
import Article from "$lib/components/Article.svelte";

>>>>>>> 40591a2 (finish migrated old blog posts)
</script>

<svelte:head>
	<!-- Be sure to add your image files and un-comment the lines below -->
	<title>{title}</title>
	<meta data-key="description" name="description" content={excerpt} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta name="twitter:title" content={title} />
	<meta property="og:description" content={excerpt} />
	<meta name="twitter:description" content={excerpt} />
	<meta property="og:image" content="https://teonbrooks.com/images/home.jpg" />
	<meta property="og:image:width" content={coverWidth} />
	<meta property="og:image:height" content={coverHeight} />
	<meta name="twitter:image" content="https://teonbrooks.com/images/home.jpg" />
</svelte:head>

<article class="post">
	<!-- You might want to add an alt frontmatter attribute. If not, leaving alt blank here works, too. -->
	<img
		class="cover-image"
		src={coverImage}
		alt=""
	/>
	<!-- Figure out how to images that don't conform to the aspect ratio -->
	<!-- <img
		class="cover-image"
		src="{coverImage}"
		alt=""
		style="aspect-ratio: {coverWidth} / {coverHeight};"
		width={coverWidth}
		height={coverHeight}
	/> -->

	<h1>{title}</h1>

	<div class="meta">
<<<<<<< HEAD
		<b>Published:</b>
		{date}
		<br />
		<b>Updated:</b>
		{updated}
=======
		<b>Published:</b> {date}
		{#if updated}
			<br>
			<b>Updated:</b> {updated}
		{/if}
		{#if migrated}
			<br>
			<b>Migrated:</b> {migrated}
		{/if}
>>>>>>> 40591a2 (finish migrated old blog posts)
	</div>

<<<<<<< HEAD
	<svelte:component this={PostContent} />
=======
	<Article content={data.PostContent} />
>>>>>>> 991d97b (ADD svelte-blog.md plus some blog enhancements)

	<!-- Add commenting -->
	<script src="https://giscus.app/client.js"
        data-repo="teonbrooks/teonbrooks"
        data-repo-id="MDEwOlJlcG9zaXRvcnkzNjc1NjkwOQ=="
        data-category="Blog comments"
        data-category-id="DIC_kwDOAjDdrc4CTFLR"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="en"
        data-loading="lazy"
        crossorigin="anonymous"
        async>
	</script>
	<!-- Quick fix to embed tweets properly -->
	<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

	{#if categories}
		<aside class="post-footer">
			<h2>Posted in:</h2>
			<ul class="post-footer__categories">
				{#each categories as category}
					<li>
						<a href="/blog/category/{category}/">
							{category}
						</a>
					</li>
				{/each}
			</ul>
		</aside>
	{/if}
<<<<<<< HEAD
</article>
=======
</article> 
>>>>>>> 991d97b (ADD svelte-blog.md plus some blog enhancements)
