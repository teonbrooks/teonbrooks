import { parse } from 'smol-toml';
import { json } from '@sveltejs/kit'

export const prerender = true

export const GET = async ({ fetch, params }) => {

    // fetch the file as a text and then parse it with the library    
    let res = await fetch(`../../blog_assets/${params.post}/${params.post}.toml`);
    res = await res.text();
    const toml = parse(res);

    // create a proper Response object for the json
    return json(toml)
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {

    const tomls = import.meta.glob('/static/blog_assets/*/*.toml');
    let postData = [];

    Object.keys(tomls).forEach(toml => {
        toml = toml.split('/').slice(-1)[0].split('.')[0]
        postData.push({ 'post': toml })
    });
    
    return postData;
}
