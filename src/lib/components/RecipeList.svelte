<script>
    import Ingredient from './Ingredient.svelte';

    export let ingredients;
</script>

<!-- <h2>Recipe Name</h2> -->
{#if ingredients}
    <h3>Ingredients:</h3>
    <ul>
        {#each ingredients as ingredient}
        <li>
            <Ingredient name={ingredient.name} bind:used={ingredient.used} />
        </li>
        {/each}
    </ul>
{/if}

<style>
    ul {
        list-style-type: none !important;
    }
</style>
