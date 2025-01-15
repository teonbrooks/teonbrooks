<script>
    import Card, { Content } from '@smui/card';
    import md from 'markdown-it';

    let { content } = $props();
</script>

<article>
    <Card padded>
        <Content>
            {@html md().render(content)}
        </Content>
    </Card>
</article>

<style>
    article {
        display: inline-block
    }
</style>