<script>
    import md from 'markdown-it';

    let { content } = $props();
</script>

<article>
    <div class="card bg-base-100 shadow-sm">
        <div class="card-body">
            <!-- Content is from trusted static files — no XSS risk.
                 For untrusted input, use marked + DOMPurify instead:
                 {@html DOMPurify.sanitize(marked.parse(content))} -->
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html md().render(content)}
        </div>
    </div>
</article>

<style>
    article {
        display: inline-block
    }
</style>