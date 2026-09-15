<script>
    import Ingredient from './Ingredient.svelte';

    let { ingredients } = $props();
</script>

{#if ingredients}
    <article>
        <h3>Ingredients:</h3>
        <ul>
            {#each ingredients as ingredient (ingredient.name)}
            <li>
                <Ingredient name={ingredient.name} bind:used={ingredient.used} />
            </li>
            {/each}
        </ul>
    </article>
{/if}

<style>
    ul {
        list-style-type: none !important;
    }

    article {
        background-color: #F0F0F4;
    }
</style>
