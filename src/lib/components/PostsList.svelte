<script>

	let { posts = [] } = $props();
</script>

<ul class="posts-list">
	{#each posts as post (post.slug)}
		<li>
			<div class="blogCard">
				<div class="blogCardSize">
					<a href="/blog/{post.slug}">
						<div class="card bg-base-100 shadow-sm">
							<div class="card-body">
								{#if post.coverImage}
									<div class="image">
										<img src={post.coverImage} alt="Cover image for {post.title}" width="400px" />
									</div>
								{/if}
								<h2>
									{post.title}
								</h2>
								<p>{post.excerpt}</p>
							</div>
						</div>
					</a>
				</div>
			</div>
		</li>
	{/each}
</ul>

<style>
	.blogCard {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.blogCardSize {
		max-width: 600px;
	}

	.image {
		display: grid;
		place-items: center;
	}
</style>
