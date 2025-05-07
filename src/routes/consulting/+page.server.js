export const prerender = true

export const load = async ({ url, fetch }) => {
    const resp = await fetch(`${url.origin}/api/cv/portfolio.toml`)
    let portfolio = await resp.json()
    portfolio = portfolio.positions.reverse();
    portfolio = portfolio.filter(item => item.category.includes('Consulting'))

    const path = '/images/portfolio_icons';

    return { portfolio, path }
}
