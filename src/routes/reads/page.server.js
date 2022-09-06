import { error } from '@sveltejs/kit';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';

export const load = async () => {
	// try {
	// 	const file = fileURLToPath(new URL('../../lib/reads/ril_export.html', import.meta.url));
	// 	const content = readFileSync(file);
	// 	const dom = new JSDOM(readFileSync(file)).window.document;

	// 	const body_dom = dom.querySelectorAll("h1").entries()
		
	// 	console.log('dom', body_dom);
		
	// 	// // const ReadMe = ReadMeFile.default.render().html
		
	// 	return {
	// 		file,
	// 		body_dom
	// 	}
	// }
	// catch(err) {
	// 	throw error(500, err)
	// }
}
