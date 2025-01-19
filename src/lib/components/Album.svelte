<script>
    let { albumHref, imageHref, caption, alt } = $props();
</script>

<figure>
    <a href={albumHref}>
        <!-- TODO: figure out why imageHref can't point to Google Photo src directly -->
        <img src={imageHref} alt={alt} width=300px />
    </a>
    <figcaption>{caption}</figcaption>
</figure>

<style>
    figcaption {
        text-align: center;
    }
    figure {
        background-color: #f0f4f9;
        padding: 20px;
        text-align: center;
    }
</style>