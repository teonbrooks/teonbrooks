<script>
    import Ingredient from './Ingredient.svelte';

    let { ingredients } = $props();
</script>

<!-- <h2>Recipe Name</h2> -->
{#if ingredients}
    <article>
        <h3>Ingredients:</h3>
        <ul>
            {#each ingredients as ingredient}
            <li>
                <Ingredient name={ingredient.name} bind:used={ingredient.used} />
            </li>
            {/each}
        </ul>
    </article>
{/if}

<!-- {#if preparation}
    <article>
        <h3>Ingredients:</h3>
        <ul>
            {#each ingredients as ingredient}
            <li>
                <Ingredient name={ingredient.name} bind:used={ingredient.used} />
            </li>
            {/each}
        </ul>
    </article>
{/if} -->

<style>
    ul {
        list-style-type: none !important;
    }

    article {
        background-color: #F0F0F4;
    }
</style>
