<script>
	import { navItems } from '$lib/config';
	import NavItem from './NavItem.svelte';

	let { class: className = '', animate = false } = $props();
</script>

<ul class={className}>
	{#each navItems as page, i (page.route)}
		<NavItem href={page.route} index={i + 1} {animate}>
			{page.title}
		</NavItem>
	{/each}
</ul>
