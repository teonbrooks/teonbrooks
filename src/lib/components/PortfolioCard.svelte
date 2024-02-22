<script>
    export let path_icons;
    export let item;
    import { mdiLink, mdiClose } from '@mdi/js';
    import { Svg } from '@smui/common/elements';
    import Card, {
            Content,
            Actions,
            ActionButtons,
            ActionIcons,
        } from '@smui/card';
    import Button, { Label } from '@smui/button';
    import IconButton, { Icon } from '@smui/icon-button';
  import Dialog, { Content as DContent } from '@smui/dialog';
  let open = false;

</script>


<Card>
    <Content>
        {#if item.icon}
            <img src="{path_icons}/{item.icon}" alt={item.organization} class={item.categories}>    
        {/if}
    </Content>
    <Actions>
        <ActionButtons>
            <Button on:click={() => (open = true)}>
                <Label>Details</Label>
              </Button>
        </ActionButtons>
        <ActionIcons>    
            <IconButton 
                on:click={() => window.open(item.website)}
                title="Open Link">
                <Icon tag="svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d={mdiLink} />
                </Icon>
            </IconButton>
        </ActionIcons>
    </Actions>
    <Dialog bind:open sheet aria-describedby="sheet-content">
        <DContent id="sheet-content">
            <IconButton action="close" class="material-icons">
                <Icon tag="svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d={mdiClose} />
                </Icon>
            </IconButton>
            <div>
                {#if item.icon}
                    <img src="{path_icons}/{item.icon}" alt={item.organization} class={item.categories} width="100" height="100">    
                {/if}
                <p>
                    {item.description}
                </p>
            </div>
        </DContent>
      </Dialog>
</Card>
