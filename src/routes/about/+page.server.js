import { error } from '@sveltejs/kit'

export const load = async () => {
	try {
		const MdFile = await import('$lib/cv/brooks_bio.md');
		const Md = MdFile.default.render().html
		
		return {
			Md
		}
	}
	catch(err) {
		throw error(500, err)
	}
}
