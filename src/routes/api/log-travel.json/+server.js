import { parse } from 'smol-toml';
import { json } from '@sveltejs/kit'

export const prerender = true

export const GET = async ({ fetch }) => {

    // fetch the file as a text and then parse it with the library    
    let res = await fetch('../content/logs/log-travel.toml');
    res = await res.text();
    const travel = parse(res);

    // create a proper Response object for the json
    return json(travel)
}