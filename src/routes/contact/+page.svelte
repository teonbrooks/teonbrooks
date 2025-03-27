<script>
	import { siteTitle, siteDescription, siteImage, siteImageWidth, siteAuthor, siteURL, faviconImage } from '$lib/config';	
	import ButtonDownSignUp from "$lib/components/ButtonDownSignUp.svelte";
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

<article id="contact" class="panel">
	<form action="https://formspree.io/f/xjvpopgr" method="POST">
		<div class="form-section">
			<label for="name">Name</label>
			<input class="field" type="text" id="name" placeholder="First name" />
		</div>
		
		<div class="form-section">
			<label for="email">Email</label>
			<input class="field" type="email" id="email" placeholder="Email address" />
		</div>
		
		<div class="form-section">
			<label for="subject">Subject</label>
			<input class="field" type="text" name="subject" placeholder="Subject" />
		</div>
			
		<div class="form-section">
			<label for="message">Message</label>
			<textarea name="message" placeholder="Message" rows="8"></textarea>
		</div>

		<input type="submit" value="Send Message">
	</form>
</article>

<h1>Subscribe</h1>
<ButtonDownSignUp />

<style>
	form {
		background-color: white;
		padding: 25px;
	}
	textarea {
		display: block;
		width: 100%;
	}
</style>