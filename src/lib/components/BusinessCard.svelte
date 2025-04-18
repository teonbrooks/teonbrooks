<script>
    import Card, { Content, Media } from '@smui/card';
    import md from 'markdown-it';

    let {
        name,
        occupations,
        descriptors,
        src,
        short_bio
    } = $props();

</script>

<article>
    <Card padded>
        <Content>
            <h1>{name}</h1>
            <p>
                {#each descriptors as descriptor}
                    <a href={descriptor.website}>{descriptor.title}</a>{` | `}
                {/each}
                R+D
            </p>
            <!-- <div class="descriptors">
                {#each descriptors as descriptor}
                    <h3>{descriptor}</h3>
                {/each}
            </div> -->
        </Content>
        <Media>
            <img {src} alt='Teon' class="u-photo" />
        </Media>
        <p>
            {#each occupations as occupation}
                {occupation.title}, {#if occupation.website}<a href="{occupation.website}">{occupation.organization}</a>{:else}{occupation.organization}{/if}<br>
            {/each}
        </p>
        <p>{@html md().render(short_bio)}</p>
    </Card>
</article>

<style>
    article {
        display: block;
        text-align: center;
        max-width: 100dvh;
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
