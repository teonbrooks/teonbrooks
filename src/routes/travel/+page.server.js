import { redirect } from '@sveltejs/kit';

export const prerender = true;

export const load = () => {
	redirect(308, 'https://passports.social/profile/teonbrooks.com/travel');
};
