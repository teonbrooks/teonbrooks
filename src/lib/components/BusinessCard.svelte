<script>
    import Card, { Content, Media } from '@smui/card';

    export let name;
    export let title;
    export let organization;
    export let descriptors;
    export let src;
    export let website;
</script>

<article>
    <Card padded>
        <Content>
            <h1>{name}</h1>
            <h3>{descriptors.join(' | ')}</h3>
            <p>{title}, <a href="{website}">{organization}</a></p>
        </Content>
        <Media>
            <img {src} alt='Teon' />
        </Media>
    </Card>
</article>

<style>
    article {
        display: block;
        text-align: center;
    }
    img {
        width: 300px;
    }
</style>
