import { json } from '@sveltejs/kit'

export const prerender = true

export const GET = async () => {
    const body = {
        "subject": "acct:teon@data-folks.masto.host",
        "aliases": [
            "https://data-folks.masto.host/@teon",
            "https://data-folks.masto.host/users/teon"
        ],
        "links": [
            {
                "rel": "http://webfinger.net/rel/profile-page",
                "type": "text/html",
                "href": "https://data-folks.masto.host/@teon"
            },
            {
                "rel": "self",
                "type": "application/activity+json",
                "href": "https://data-folks.masto.host/users/teon"
            },
            {
                "rel": "http://ostatus.org/schema/1.0/subscribe",
                "template": "https://data-folks.masto.host/authorize_interaction?uri={uri}"
            }
        ]
    };

    const options = {
        headers: {
            'Content-Type': 'application/jrd+json',
        }
    }
    return new Response(
        body,
        options,
    )
}
