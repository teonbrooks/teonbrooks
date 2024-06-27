<script>
	export let path_icons;
	export let item;
	import { mdiLink, mdiClose } from '@mdi/js';
	import Card, { Content, Actions, ActionButtons, ActionIcons } from '@smui/card';
	import Button, { Label } from '@smui/button';
	import IconButton, { Icon } from '@smui/icon-button';
	import Dialog, { Content as DContent } from '@smui/dialog';
	import markdownit from 'markdown-it';

	const md = markdownit();
	let open = false;
</script>

<Card>
	<Content>
		{#if item.icon}
			<div class="image">
				<img src="{path_icons}/{item.icon}" alt='icon for {item.organization}' />
			</div>
		{/if}
	</Content>
	<Actions style="align-items:end">
		<ActionButtons>
			<Button on:click={() => (open = true)}>
				<Label>Details</Label>
			</Button>
		</ActionButtons>
		<ActionIcons>
			<IconButton on:click={() => window.open(item.website)} title="Open Link">
				<Icon tag="svg" viewBox="0 0 24 24">
					<path fill="currentColor" d={mdiLink} />
				</Icon>
			</IconButton>
		</ActionIcons>
	</Actions>
</Card>
<Dialog bind:open sheet aria-describedby="sheet-content">
	<DContent id="sheet-content">
		<IconButton action="close" class="material-icons">
			<Icon tag="svg" viewBox="0 0 24 24">
				<path fill="currentColor" d={mdiClose} />
			</Icon>
		</IconButton>
		<div>
			{#if item.icon}
				<img
					src="{path_icons}/{item.icon}"
					alt='icon for {item.organization}'
					width="100"
					height="100"
				/>
			{/if}
			<h1>{item.organization}</h1>
			<h2>{item.title}</h2>
			<p><em>{item.timespan}</em></p>
			<p>
				{@html md.render(item.description)}
			</p>
		</div>
	</DContent>
</Dialog>

<style>
	img {
		width: 150px;
		height: 150px;
	}

	.image {
		display: grid;
		place-items: center;
	}

	h1 {
		font-size: x-large;
	}
	h2 {
		font-size: large;
	}
</style>
