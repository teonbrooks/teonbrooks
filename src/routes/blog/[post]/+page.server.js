import { parse } from 'smol-toml'

export const prerender = true

export const load = async ({ params }) => {
    const { metadata } = await import(`../../../lib/posts/${params.post}.md`)
    if (!metadata.data) return { toml: null }

    const tomlFiles = import.meta.glob('/static/blog_assets/**/*.toml', { query: '?raw', import: 'default' })
    const getRaw = tomlFiles[`/static${metadata.data}`]
    if (!getRaw) return { toml: null }

    return { toml: parse(await getRaw()) }
}
