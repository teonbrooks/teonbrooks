<script>
	import { currentPage, isMenuOpen } from '$lib/assets/js/store'

	let { href, index = 1, animate = false, children } = $props();
	let isCurrentPage = $derived($currentPage.startsWith(href))

	const maybeCloseMenu = () => {
		if (href != $currentPage) {
			isMenuOpen.set(false)
		}
	}
</script>


<li
	style="--i:{index}"
	class="mb-1 {animate && $isMenuOpen ? 'animate-slide-in-left opacity-0 [animation-delay:calc(0.1s*var(--i))]' : ''}"
>
	<a
		href={href}
		onclick={maybeCloseMenu}
		class="text-inherit decoration-secondary decoration-1 no-underline hover:underline"
		class:font-bold={isCurrentPage}
		aria-current={isCurrentPage ? 'page' : false}
	>
		{@render children?.()}
	</a>
</li>