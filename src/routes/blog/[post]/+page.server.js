export const prerender = true

export const load = async ({ url, fetch, params }) => {
    let toml;
    const { post } = params;
    const tomls = import.meta.glob(`/static/blog_assets/*/*.toml`);

    const idx = Object.keys(tomls).findIndex(element => element.includes(post));

    // note that findIndex returns -1 if not found
    if (idx > -1) {
        try {
            const resp = await fetch(`${url.origin}/api/${post}.toml`)
            toml = await resp.json()
        }
        catch (error) {
            console.error(error);
        }
    }

    return { toml }
}
