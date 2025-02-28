<script>
	import Card, { Content } from '@smui/card';

	let { posts = [] } = $props();
</script>

<ul class="posts-list">
	{#each posts as post}
		<li>
			<div class="blogCard">
				<div class="blogCardSize">
					<a href="/blog/{post.slug}">
						<Card padded>
							<Content>
								<div class="image">
									<img src={post.coverImage} alt="" width="400px" />
								</div>
								<h2>
									{post.title}
								</h2>
								<p>{post.excerpt}</p>
							</Content>
						</Card>
					</a>
				</div>
			</div>
		</li>
	{/each}
</ul>

<!-- width={post.coverWidth} -->
<!-- height={post.coverHeight} -->
<!-- style="ratio: {post.coverWidth} / {post.coverHeight}" -->

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
