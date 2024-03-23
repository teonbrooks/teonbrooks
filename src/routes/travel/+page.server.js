export const prerender = true

export const load = async ({ url, fetch }) => {
    const travelRes = await fetch(`${url.origin}/api/logs/log-travel.toml`)
    const recsRes = await fetch(`${url.origin}/api/logs/log-recommendations.toml`)

    const logTravel = await travelRes.json()
    const recs = await recsRes.json()

    return { logTravel, recs }
}
