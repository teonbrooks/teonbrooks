export const prerender = true

export const load = async ({ url, fetch, params }) => {
    let toml;
    // this is a hard-coded path for data, consider generalizing it
    const tomls = import.meta.glob('/static/content/data/*.toml');

    const idx = Object.keys(tomls).findIndex(element => element.includes(params.post));

    // Fix the error. Likely need to look for a param in post to determine if there is data.
    if (idx) {
        try {
            const resp = await fetch(`${url.origin}/api/${params.post}.toml`)
            toml = await resp.json()
        }
        catch (error) {
            console.error(error);
        }
    }

    return { toml }
}
