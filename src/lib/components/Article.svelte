<script>
    import Card, { Content } from '@smui/card';

    export let content;
</script>

<article>
    <Card padded>
        <Content>
            {@html content}
        </Content>
    </Card>
</article>

<style>
    article {
        display: inline-block
    }
</style>