export const prerender = true

export const load = async ({ url, fetch }) => {
    const travelRes = await fetch(`${url.origin}/api/log-travel.json`)
    const travel = await travelRes.json()

    return { travel }
}
