export const prerender = true

export const load = async ({ url, fetch, params }) => {
    let toml;
    try {
        const resp = await fetch(`${url.origin}/api/${params.post}.toml`)
        toml = await resp.json()
    }
    catch (error) {
        console.error(error);
    }

    return { toml }
}
