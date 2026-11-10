<script>
	import { isMenuOpen } from '$lib/assets/js/store'
	import HamburgerSVG from './svg/HamburgerSVG.svelte'
	import XSVG from './svg/XSVG.svelte'

	/**
	 * @typedef {Object} Props
	 * @property {boolean} [closeOnly]
	 */

	/** @type {Props} */
	let { closeOnly = false } = $props();

	const toggleIsMenuOpen = () => {
		isMenuOpen.set(!$isMenuOpen)
	}
</script>

<button
	onclick={toggleIsMenuOpen}
	aria-pressed={$isMenuOpen}
	class="absolute top-8 right-8 m-0 block w-8 cursor-pointer border-0 bg-transparent p-0 text-inherit md:hidden"
	tabindex={($isMenuOpen || !closeOnly) ? '0' : '-1'}
>
	<span class="sr-only">Toggle hamburger menu</span>
	{#if closeOnly}
		<XSVG />
	{:else}
		<HamburgerSVG />
	{/if}
</button>
