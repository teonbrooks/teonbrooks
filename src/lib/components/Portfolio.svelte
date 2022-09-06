<script>
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import Snackbar, {Actions as SBActions, Label as SBLabel} from '@smui/snackbar';
    import { Svg } from '@smui/common/elements';
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
            <!-- <LayoutGrid>
                <Cell><button>Show All</button></Cell>
                {#each categories as category}
                    <Cell><button class="button" data-filter=".{category}">{category}</button></Cell>
                {/each}
            </LayoutGrid> -->
        </div>
        <LayoutGrid>
            {#each items as item}
                <!-- <Cell on:click={() => snackbarWithoutClose.open()}>
                    <div class="mix {item.category}">
                        <button>
                            <img src="{path_icons}/{item.icon}" alt={item.organization} class={item.categories}>
                        </button>
                    </div>
                </Cell> -->
                <Cell>
                    <Card>
                        <Content>
                            <img src="{path_icons}/{item.icon}" alt={item.organization} class={item.categories}>
                        </Content>
                        <Actions>
                            <!-- <ActionButtons>
                                <Button on:click={() => snackbarWithClose.open()}>
                                    <Label>Action</Label>
                                </Button>
                            </ActionButtons> -->
                            <ActionIcons>    
                                <IconButton 
                                    on:click={() => window.open(item.website)}
                                    title="Open Link">
                                    <Icon component={Svg} viewBox="0 0 24 24">
                                        <path fill="currentColor" d={mdiLink} />
                                    </Icon>
                                </IconButton>
                            </ActionIcons>
                        </Actions>
                    </Card>
                </Cell>


            {/each}
        </LayoutGrid>

        <Snackbar bind:this={snackbarWithClose}>
            <SBLabel>This is a snackbar.</SBLabel>
            <SBActions>
                <IconButton title="Dismiss">
                    <Icon component={Svg} viewBox="0 0 24 24">
                        <path fill="currentColor" d={mdiCloseCircle} />
                    </Icon>
                </IconButton>
            </SBActions>
        </Snackbar>
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
