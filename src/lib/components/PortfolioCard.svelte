<script>
    export let path_icons;
    export let item;
    import { mdiLink, mdiCloseCircle } from '@mdi/js';
    import { Svg } from '@smui/common/elements';
    import Card, {
            Content,
            PrimaryAction,
            Actions,
            ActionButtons,
            ActionIcons,
        } from '@smui/card';
    import Snackbar, {Actions as SBActions, Label as SBLabel} from '@smui/snackbar';
    import Button, { Label } from '@smui/button';
    import IconButton, { Icon } from '@smui/icon-button';

    let snackbarWithClose;

</script>


<Card>
    <Content>
        {#if item.icon}
            <img src="{path_icons}/{item.icon}" alt={item.organization} class={item.categories}>    
        {/if}
    </Content>
    <Actions>
        <ActionButtons>
            <Button on:click={() => snackbarWithClose.open()}>
                <Label>Details</Label>
            </Button>
        </ActionButtons>
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
    <Snackbar bind:this={snackbarWithClose} labelText={item.description}>
        <SBLabel />
        <SBActions>
            <IconButton title="Dismiss">
                <Icon component={Svg} viewBox="0 0 24 24">
                    <path fill="currentColor" d={mdiCloseCircle} />
                </Icon>
            </IconButton>
        </SBActions>
    </Snackbar>
</Card>
