export const prerender = true

export const load = async ({ url, fetch }) => {
    const resp = await fetch(`${url.origin}/api/cv/portfolio.toml`)
    
    let portfolioFull = await resp.json()
    portfolioFull = portfolioFull.positions.reverse();
    
    let portfolio = portfolioFull.filter(item => item.category.includes('Consulting'))
    let projects = portfolioFull.filter(item => item.category.includes('Past Projects'))

    const path = '/images/portfolio_icons';

    return { portfolio, projects, path }
}
