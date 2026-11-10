<script>
	import { postsPerPage } from '$lib/config'

	/**
	 * @typedef {Object} Props
	 * @property {any} currentPage
	 * @property {any} totalPosts
	 * @property {string} [path]
	 */

	/** @type {Props} */
	let { currentPage, totalPosts, path = '/blog/page' } = $props();
	
	let pagesAvailable = $derived(Math.ceil(totalPosts / postsPerPage))
	

	const isCurrentPage = (page) => page == currentPage
</script>

<!-- For some reason, the pagination wasn't re-rendering properly during navigation without the #key block -->
{#key currentPage}
	{#if pagesAvailable > 1}
		<nav aria-label="Pagination navigation" class="mb-4">
			<ul class="m-0 flex list-none flex-wrap justify-start gap-2 p-0">
				{#each Array.from({length: pagesAvailable}, (_, i) => i + 1) as page (page)}
					<li class="m-0">
						<a
							href="{path}/{page}"
							aria-current="{isCurrentPage(page)}"
							class="flex h-[2em] w-[2em] items-center justify-center bg-base-300 leading-none font-bold text-primary no-underline transition-colors duration-100 hover:bg-primary hover:text-base-300 aria-[current=true]:border aria-[current=true]:border-current aria-[current=true]:bg-primary aria-[current=true]:text-base-300"
						>
							<span class="sr-only">
								{#if isCurrentPage(page)}
									Current page: 
								{:else}
									Go to page 
								{/if}
							</span>
							{page}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}
{/key}