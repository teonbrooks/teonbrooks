---
title: "The Making of a Future Blog Post"
slug: a-blog-about-a-blog
authors:
- Teon L Brooks
date: "2025-01-24"
categories:
- tech
coverImage: "/images/blog_images/2018-travel-in-review/2018-travel-in-review.png"
excerpt: Perfect truly is the enemy of good.
lang: en-US
---
<script>
    let { toml } = $props();
    console.log('toml', toml)
    import Timeline from '$lib/components/Timeline.svelte'
</script>

So this blog piece is ab

All I wanted to do was write a simple blog post but it turned into a whodunit.

I will leave the details of the blog post for the blog post itself, don't want to steal its thunder. The gist is that I had an idea and I wanted to do some interactive data science for the core part of the piece.
For the majority of data science projects in Python, it is simple to create a Jupyter Notebook and maybe host that notebook on GitHub, but one crucial aspect is that you often lose interactivity or the exploration ability. A key part of data science and reporting is that you answer questions with data, but what happens when you or the reader have another question? Do you have to setup new infrastructure to answer a follow-up question?

This has often been a frustrating point for data scientists. We share a report but if we want it to have a slider or reset with initial values or state, that would be a separate project endeavor in itself.

At Mozilla, we tried to tackle this issue and it birthed the Iodide Project. It was trying to solve the use of data-munging in Python and pretty plotting in Javascript. Pyodide ended up solving the issue of getting Python running in a browser with setting up the traditional server-client setup with Jupyterlab.

Fast forward, Iodide was 86'd (RIP 😢) but fortunately Pyodide was spun out to become a community project ([Pyodide Spin Out and 0.17 Release - Mozilla Hacks - the Web developer blog](https://hacks.mozilla.org/2021/04/pyodide-spin-out-and-0-17-release/)), and many people began to take an interest in the success. Jupyterlite seems to have finally solved a scenario of providing a self-contained interactive notebook environment that can be easily shared or hosted.

I decided to use Jupyterlab as the basis of my future blog post [LINK GOES HERE] and ventured down the well-worn path of compiling software and dependency resolution in Python. 

tl;dr version-control your work and hard-code dependencies in a requirements.txt

I initially started this three years ago and that it would be a simple afternoon project but who hasn't left a blog post unfinished for years with the promised to return to it 😅

Here's a timeline of how it all went down

I have been following 

- Pillow doesn't support HEIC natively. Need the extension Pillow-heif

## Things I could have done to speed the process along
- Convert all the images from JPG to HEIC
- Done everything locally and embedded images
- Write the piece three years ago when things worked
- Exported the metadata into a JSON and just use that



<Timeline {toml} />
