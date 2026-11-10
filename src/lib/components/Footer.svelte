<script>
	import { siteAuthor } from '$lib/config';
	import NavItems from './NavItems.svelte';
</script>

<footer class="grid grid-cols-1 items-stretch gap-8 bg-primary px-8 py-10 text-base-300 md:grid-cols-[1fr_1fr_2fr]">
	<nav class="md:border-r md:border-secondary">
		<ul class="m-0 flex list-none flex-col gap-1 p-0">
			<li>
				<a href="/api/rss.xml" data-sveltekit-reload class="text-inherit no-underline hover:underline">RSS</a>
			</li>
			<li>
				<a href="/" class="text-inherit no-underline hover:underline">Home</a>
			</li>
		</ul>
	</nav>
	<nav class="md:border-r md:border-secondary">
		<NavItems class="m-0 flex list-none flex-col gap-1 p-0" />
	</nav>

	<div>
	<p class="m-0 text-[0.8rem]">&copy;{new Date().getFullYear()} {siteAuthor}
	</p>
	<p class="m-0 text-[0.8rem]"><script async defer src="https://www.recurse-scout.com/loader.js?t=f302bbc7dd078998e52bc365f1f73fa1"></script></p>
	</div>
</footer>
