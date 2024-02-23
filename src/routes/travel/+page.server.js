export const prerender = true

export const load = async ({ url, fetch }) => {
    const travelRes = await fetch(`${url.origin}/api/log-travel.json`)
    const logTravel = await travelRes.json()

    return { logTravel }
}
