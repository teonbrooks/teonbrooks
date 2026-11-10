<script>
	import { siteTitle, siteDescription, siteImageWidth, siteURL, faviconImage } from '$lib/config';
	import KitSignUp from "$lib/components/KitSignUp.svelte";
</script>

<svelte:head>
	<!-- Open Graph -->
	<meta data-key="description" name="description" content={siteDescription} />
	<meta property="og:type" content="profile" />
	<meta property="og:url" content={siteURL}>
	<meta property="og:title" content={siteTitle} />
	<meta property="og:description" content={siteDescription} />
	<meta property="og:image" content={faviconImage} />
	<meta property="og:image:width" content={siteImageWidth} />
	<meta property="og:image:height" content={siteImageWidth} />
	<!-- Twitter -->
	<meta name="twitter:title" content={siteTitle}>
	<meta name="twitter:description" content={siteDescription}>
	<meta name="twitter:site" content="@teonbrooks">
	<meta name="twitter:image" content={faviconImage}>
	<meta name="twitter:card" content="summary_large_image">
	<title>Contact</title>
</svelte:head>

<h1>Contact</h1>

<article id="contact" class="panel align">
	<form action="https://formspree.io/f/xjvpopgr" method="POST" class="my-8 flex flex-col gap-6 [&>div:first-child]:mt-6">
		<div class="flex flex-col gap-1">
			<label class="font-bold" for="name">Name</label>
			<input class="input w-full border-primary [font-size:inherit]" type="text" id="name" name="name" placeholder="First name" />
		</div>

		<div class="flex flex-col gap-1">
			<label class="font-bold" for="email">Email</label>
			<input class="input w-full border-primary [font-size:inherit]" type="email" id="email" name="email" placeholder="Email address" />
		</div>

		<div class="flex flex-col gap-1">
			<label class="font-bold" for="subject">Subject</label>
			<input class="input w-full border-primary [font-size:inherit]" type="text" id="subject" name="subject" placeholder="Subject" />
		</div>

		<div class="flex flex-col gap-1">
			<label class="font-bold" for="message">Message</label>
			<textarea class="textarea w-full border-primary [font-size:inherit]" id="message" name="message" placeholder="Message" rows="5"></textarea>
		</div>

		<button type="submit" class="btn btn-primary mt-8 self-start text-base font-bold">Send Message</button>
	</form>
</article>

<h1>Subscribe</h1>
<KitSignUp />

<style>
	.align {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	form {
		width: 600px;
		max-width: 100%;
		background-color: white;
		padding: 25px;
	}
</style>