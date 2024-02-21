import { json } from '@sveltejs/kit'

export const GET = async () => {
    const body = {
        "subject": "acct:teon@hachyderm.io",
        "aliases": [
            "https://data-folks.masto.host/@teon",
            "https://data-folks.masto.host/users/teon",
            "https://hachyderm.io/@teon",
            "https://hachyderm.io/users/teon"
        ],
        "links": [
            {
                "rel": "http://webfinger.net/rel/profile-page",
                "type": "text/html",
                "href": "https://hachyderm.io/@teon"
            },
            {
                "rel": "self",
                "type": "application/activity+json",
                "href": "https://hachyderm.io/users/teon"
            },
            {
                "rel": "http://ostatus.org/schema/1.0/subscribe",
                "template": "https://hachyderm.io/authorize_interaction?uri={uri}"
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
