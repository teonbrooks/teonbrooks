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
            <div class="descriptors">
                {#each descriptors as descriptor}
                    <h3>{descriptor}</h3>
                {/each}
            </div>
            <!-- <p>{title}, <a href="{website}">{organization}</a></p> -->
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

    /* .descriptors p {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
    } */
</style>
