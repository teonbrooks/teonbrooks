import { error } from '@sveltejs/kit'

export const load = async () => {
    try {
        const ReadMeFile = await import('$lib/cv/invited_talks.md');
        const ReadMe = ReadMeFile.default.render().html

        return {
            ReadMe
        }
    }
    catch (err) {
        throw error(500, err)
    }
}