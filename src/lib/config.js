/**
 * All of these values are used throughout the site – for example, 
 * in the <meta> tags, in the footer, and in the RSS feed.
 * 
 * PLEASE BE SURE TO UPDATE THEM ALL! Thank you!
 **/ 

export const siteTitle = 'Teon L Brooks'
export const siteDescription = 'Personal Website and Blog for Teon Brooks'
export const siteURL = 'teonbrooks.com'
export const siteLink = 'https://teonbrooks.com'
export const siteAuthor = 'Teon L Brooks'
export const siteImage = '/images/home.jpg'
export const siteImageWidth = '300px'
export const faviconImage = '/images/avatar.png'

// Controls how many posts are shown per page on the main blog index pages
export const postsPerPage = 5

// Edit this to alter the main nav menu. (Also used by the footer and mobile nav.)
export const navItems = [
	{
		title: 'Blog',
		route: '/blog'
	}, {
		title: 'Travel (wip)',
		route: '/travel'
	}, {
		title: 'Portfolio',
		route: '/portfolio'
	}, {		
		title: 'About',
		route: '/about'
	}, {
		title: 'Résumé',
		route: 'https://drive.google.com/file/d/19TksI7L3gvYQmi_UN_SSuuz6I0LqTDDk/view?usp=sharing'
	}, {
		title: 'Readme',
		route: '/readme'
	}, {
		title: 'Contact',
		route: '/contact' 
	},
]