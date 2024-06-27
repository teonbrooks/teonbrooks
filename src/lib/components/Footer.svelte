<script>
	import { siteAuthor } from '$lib/config';
	import NavItems from './NavItems.svelte';
</script>

<footer>
	<nav>
		<ul>
			<li>
				<a href="/api/rss.xml" data-sveltekit-reload>RSS</a>
			</li>
			<li>
				<a href="/">Home</a>
			</li>
		</ul>
	</nav>
	<nav>
		<NavItems />
	</nav>

	<div>
	<p>&copy;{new Date().getFullYear()} {siteAuthor}
	</p>
	<p><script async defer src="https://www.recurse-scout.com/loader.js?t=f302bbc7dd078998e52bc365f1f73fa1"></script></p>
	</div>
	<!-- <script async defer src="https://www.recurse-scout.com/loader.js?t=f302bbc7dd078998e52bc365f1f73fa1"></script> -->
</footer>
