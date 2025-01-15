<script>
	import Card, { Content } from '@smui/card';

	let { posts = [] } = $props();
</script>


<ul class="posts-list">
	{#each posts as post}
		<li>
			<Card padded>
				<Content>
					<a href="/blog/{post.slug}">
						<img
						src={post.coverImage}
						alt=""
						style="auto"
						/>
						<h2>
							{post.title}
						</h2>
						<p>{post.excerpt}</p>
					</a>
				</Content>
			</Card>
		</li>
	{/each}
</ul>
<!-- width={post.coverWidth} -->
<!-- height={post.coverHeight} -->
<!-- style="ratio: {post.coverWidth} / {post.coverHeight}" -->
