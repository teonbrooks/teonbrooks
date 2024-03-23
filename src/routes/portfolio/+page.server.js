export const prerender = true

export const load = async ({ url, fetch }) => {
    const portfolioRes = await fetch(`${url.origin}/api/cv/portfolio.toml`)
    const portfolio = await portfolioRes.json()

    return { portfolio }
}
