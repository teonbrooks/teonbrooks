export const prerender = true

export const load = async ({ url, fetch }) => {
    const portfolioRes = await fetch(`${url.origin}/api/portfolio.json`)
    const portfolio = await portfolioRes.json()

    return { portfolio }
}
