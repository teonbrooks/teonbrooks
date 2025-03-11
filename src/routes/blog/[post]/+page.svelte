<!-- This file renders each individual blog post for reading. Be sure to update the svelte:head below -->
<script>
	import ButtonDownSignUp from "$lib/components/ButtonDownSignUp.svelte"
	import { siteImage } from "$lib/config";
	import Card, { Content } from '@smui/card';
	import { CommentSection } from "bluesky-comments-svelte";
	
	const author = "teon.bsky.social";
	let { data } = $props();
	let { toml = {} } = data;
	let { PostContent, meta } = data;

	let { title, excerpt, date, updated, 
		  coverImage, coverWidth, coverHeight, 
		  tags, social, authors } = meta;
	// TODO: Currently if date is not presented as string, it becomes datetime
	// 		 For now, we will just wrap it as a string in the post
	//       Consider parsing it as a datetime and returning YYYY-MM-DD

</script>


<svelte:head>
	<!-- Be sure to add your image files and un-comment the lines below -->
	<title>{title}</title>
	<meta data-key="description" name="description" content={excerpt} />
	<meta property="og:author" content={authors} />
	<meta property="og:publish_time" content={date} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta name="twitter:title" content={title} />
	<meta property="og:description" content={excerpt} />
	<meta name="twitter:description" content={excerpt} />
	<meta property="og:image" content={coverImage} />
	<meta property="og:image:width" content={coverWidth} />
	<meta property="og:image:height" content={coverHeight} />
	<meta name="twitter:image" content={coverImage} />
</svelte:head>


<article class="post">
	<!-- You might want to add an alt frontmatter attribute. If not, leaving alt blank here works, too. -->
	<img
		class="cover-image"
		src="{coverImage}"
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

	<h1>{ title }</h1>
	
	<div class="meta">
		<b>Published:</b> {date}
		{#if updated}
			<br>
			<b>Updated:</b> {updated}
		{/if}
	</div>
	
	<article>
		<Card padded>
			<Content>
				<PostContent {toml} />
			</Content>
		</Card>
	</article>

	<!-- Add commenting -->
	<div class="comments">
		<div class="content">
			<h2>Comments</h2>
			<CommentSection {author} />
		</div>
	</div>

	<!-- Add Signup Form -->
	<h2>Signup</h2>
	<ButtonDownSignUp />
	<!-- Quick fix to embed content properly -->
	<!-- This should be conditional on the blog post -->
	{#if social}
		{#if social.includes('strava')}
			<script src="https://strava-embeds.com/embed.js"></script>
		{/if}
		{#if social.includes('googlePhotos')}
			<script src="https://cdn.jsdelivr.net/npm/publicalbum@latest/embed-ui.min.js" async></script>
		{/if}
		{#if social.includes('bluesky')}
			<script async src="https://embed.bsky.app/static/embed.js" charset="utf-8"></script>
		{/if}		
	{/if}

	{#if tags}
		<aside class="post-footer">
			<h2>Posted in: </h2>
			<ul class="post-footer__tags">
				{#each tags as tag}
					<li>
						<a href="/blog/tag/{tag}/">
							{ tag }
						</a>
					</li>
				{/each}
			</ul>
		</aside>
	{/if}
</article> 

<style>
	article {
		display: inline-block
	}

	.comments {
		background-color: white;
		
	}
	.content {
		margin: 1rem 1rem;
	}
</style>