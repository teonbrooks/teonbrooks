<svelte:head>
	<title>Contact</title>
</svelte:head>


<h1>Contact</h1>

<article id="contact" class="panel">
	<header>
		<h2>Contact Me</h2>
	</header>
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

<style>
	.field {
		background-color: var(--paper);
	}
	textarea {
		display: block;
		width: 100%;
	}
</style>