import { error } from '@sveltejs/kit'
// import TOML from '@iarna/toml';
// import logTravel from `$lib/logs/log-travel.toml?raw`;


let travelLog;

export const load = async ({ fetch}) => {
	try {
        let logTravelFile = `/content/logs/log-travel.json`;
        let res = await fetch(logTravelFile);
        const travelLog = await res.json();
        // const travelLog = TOML.parse(logTravel);

		// return {
		// 	TravelLog: travelLog,
		// }
        return { travelLog }
	} catch(err) {
		throw error(404, err)
	}
}
