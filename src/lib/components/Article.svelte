<script>
    import Card, { Content } from '@smui/card';
    import md from 'markdown-it';

    let { content } = $props();
</script>

<article>
    <Card padded>
        <Content>
            <!-- Content is from trusted static files — no XSS risk.
                 For untrusted input, use marked + DOMPurify instead:
                 {@html DOMPurify.sanitize(marked.parse(content))} -->
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html md().render(content)}
        </Content>
    </Card>
</article>

<style>
    article {
        display: inline-block
    }
</style>