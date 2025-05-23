export const prerender = true

export const load = async ({ url, fetch }) => {
    const resp = await fetch(`${url.origin}/api/cv/portfolio.toml`)
    const portfolio = await resp.json()

    const path = '/images/portfolio_icons';

    return { portfolio, path }
}
