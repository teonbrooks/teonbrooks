<script>
	import PostsList from '$lib/components/PostsList.svelte'
	import Pagination from '$lib/components/Pagination.svelte'
	import { siteDescription } from '$lib/config'
	import MailchimpSignUp from '$lib/components/MailchimpSignUp.svelte';

	export let data
</script>


<svelte:head>
	<title>Blog</title>
	<!-- RSS -->
	<link href="/api/rss.xml" type="application/atom+xml" rel="alternate" title="Teon's Blog Feed">
	<meta data-key="description" name="description" content={siteDescription}>
</svelte:head>

<h1>Blog</h1>

<PostsList posts={data.posts} />

<Pagination currentPage={1} totalPosts={data.total} />

<!-- Add a mailto button option -->

<MailchimpSignUp />
