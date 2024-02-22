<script>
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import Snackbar, {Actions as SBActions, Label as SBLabel} from '@smui/snackbar';
    import { mdiLink, mdiCloseCircle } from '@mdi/js';

    import Card, {
        Content,
        PrimaryAction,
        Actions,
        ActionButtons,
        ActionIcons,
    } from '@smui/card';
    import Button, { Label } from '@smui/button';
    import IconButton, { Icon } from '@smui/icon-button';
	import PortfolioCard from './PortfolioCard.svelte';

    let snackbarWithClose;
    export let items = [];
    // export let categories = items.map(x => x.category).filter((v, i, a) => a.indexOf(v) === i);
    export let path_icons = '/images/portfolio_icons';

</script>

<article id="portfolio" class="panel">
    <div style="display: flex; align-items: center;">
        <section id="page-portfolio" class="page-portfolio">
            <h3 class="section-subtitle">Collection of my work</h3>
            <div id="filters" class="button-group">
            <!-- console.log(Object.groupBy(items, ({ category }) => category)) -->
                <!-- <LayoutGrid>
                <Cell><button>Show All</button></Cell>
                {#each categories as category}
                    <Cell><button class="button" data-filter=".{category}">{category}</button></Cell>
                {/each}
            </LayoutGrid> -->
            </div>
        <LayoutGrid>
            {#each items as item}
                <Cell>
                    <PortfolioCard {item} {path_icons}/>
                </Cell>
            {/each}
        </LayoutGrid>
    </section>

</article>

<style>
    img {
        height: 150px;
    }
    .demo-cell {
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--mdc-theme-secondary, #333);
        color: var(--mdc-theme-on-secondary, #fff);
  }
</style>
