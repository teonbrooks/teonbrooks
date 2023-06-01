<!-- This file renders each individual blog post for reading. Be sure to update the svelte:head below -->
<script>
<<<<<<< HEAD
	export let data;

	const { title, excerpt, date, updated, coverImage, coverWidth, coverHeight, categories } =
		data.meta;
	const { PostContent } = data;
=======
export let data
let { title, excerpt, date, updated, migrated, coverImage, coverWidth, coverHeight, categories, social } = data.meta
import Article from "$lib/components/Article.svelte";
import MailchimpSignUp from "$lib/components/MailchimpSignUp.svelte";
import Giscus from "@giscus/svelte";
import { siteImage } from "$lib/config";

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
	<meta property="og:image" content={siteImage} />
	<meta property="og:image:width" content={coverWidth} />
	<meta property="og:image:height" content={coverHeight} />
	<meta name="twitter:image" content={siteImage} />
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

	<!-- Add Signup Form -->
	<h2>Signup</h2>
	<MailchimpSignUp />
	
	<!-- Add commenting -->
	<h2>Comments</h2>
    <Giscus
      id="comments"
      repo="teonbrooks/teonbrooks"
      repoId="MDEwOlJlcG9zaXRvcnkzNjc1NjkwOQ=="
      category="Blog comments"
      categoryId="DIC_kwDOAjDdrc4CTFLR"
      mapping="pathname"
      term="Welcome to teonbrooks blog!"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="preferred_color_scheme"
      lang="en"
    />
	<!-- Quick fix to embed tweets properly -->
	<!-- This should be conditional on the blog post -->
	{#if social}
		{#if social.includes('twitter')}
			<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
		{/if}
		{#if social.includes('strava')}
			<script src="https://strava-embeds.com/embed.js"></script>
		{/if}
		{#if social.includes('googlePhotos')}
			<script src="https://cdn.jsdelivr.net/npm/publicalbum@latest/embed-ui.min.js" async></script>
		{/if}
	{/if}

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
