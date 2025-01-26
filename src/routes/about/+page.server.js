import { error } from '@sveltejs/kit'

// export const load = async () => {
// 	try {
// 		const MdFile = await import('$lib/content/about/brooks_bio.md');
//      // NOTE: you can pass MdFile.default but not the rendered object
// 		// const Md = MdFile.default.render().html

// 		console.log(MdFile.default.render)
		
// 		return {
// 			MdFile
// 		}
// 	}
// 	catch(err) {
// 		error(500, err)
// 	}
// }
