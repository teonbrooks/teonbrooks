<script>
    import Card, { Content, Media } from '@smui/card';

    export let name;
    export let occupations;
    export let descriptors;
    export let src;
</script>

<article>
    <Card padded>
        <Content>
            <h1>{name}</h1>
            <h3>{descriptors.join(' | ')}</h3>
            <!-- <div class="descriptors">
                {#each descriptors as descriptor}
                    <h3>{descriptor}</h3>
                {/each}
            </div> -->
            {#each occupations as occupation}
                <p>{occupation.title}, {#if occupation.website}<a href="{occupation.website}">{occupation.organization}</a>{:else}{occupation.organization}{/if}</p>
            {/each}
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
