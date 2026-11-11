const profile = 'https://passports.social/profile/teonbrooks.com/passports';

/** Cards for the home page fan; each one links to the matching passport on Teon's profile. */
export const passportCards = [
	{ type: 'travel-tag', href: `${profile}/travel`, label: 'Travel passport: walking from Oviedo to Santiago de Compostela', mode: 'Walking', city: 'Santiago de Compostela', code: 'SCQ', origin: 'OVD', date: '15 Jul 2025' },
	{ type: 'ticket-stub', href: `${profile}/tickets`, label: 'Tickets passport: Arc de Triomphe stub', overlap: 2.4, color: 'oklch(52% 0.14 200)', art: '🎟', title: 'Arc de Triomphe', venue: 'Arc de Triomphe, Paris', badge: 'MUSEUM/EXHIBITION' },
	{ type: 'state-stamp', href: `${profile}/united_states`, label: 'United States passport: Hawaii stamp, Honolulu', overlap: 2.8, code: 'US-HI', city: 'Honolulu', date: '26 Mar 2025' },
	{ type: 'boarding-pass', href: `${profile}/travel`, label: 'Travel passport: boarding pass from EWR to CDG', overlap: 1.6, kind: 'Flight', from: 'EWR', to: 'CDG', to_city: 'Paris', date: '21 Jul 2014' },
	{ type: 'ticket-stub', href: `${profile}/raver`, label: 'Raver passport: Honey Dijon at Knockdown Center', overlap: 1, color: 'oklch(52% 0.20 305)', art: '🧑‍🎤', title: 'Honey Dijon, Kilopatrah Jones', venue: 'Knockdown Center, Brooklyn', genres: 'house · disco', badge: 'RAVE' },
	{ type: 'beacon', href: `${profile}/beacon_bits`, label: 'Beacon Bits passport: AMS Nest check-in', overlap: 2.6, venue: 'AMS Nest', shout: '#ATmosphereConf!', date: '28 Mar 2026' },
	{ type: 'sello', href: `${profile}/camino`, label: 'Camino passport: Salas to Tineo on the Camino Primitivo', overlap: 2.6, route: 'Camino Primitivo', leg: 'Salas → Tineo', meta: '21.7 km', date: '17 Jul 2025', crosses: '✠✠✠✠', more: '+1' }
];
