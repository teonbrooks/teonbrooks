<script>
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<div class="my-8 mr-[-2rem] ml-0 w-[calc(50%+2rem)] max-w-none rounded-[0.125rem] bg-[lightblue] px-4 py-8 italic md:m-0 md:w-[calc(50%+4rem)] md:p-1">
	{@render children?.()}
</div>