---
title: The Making of a Future Blog Post
slug: half-baked-data-and-versioning
authors:
  - Teon L Brooks
date: 2025-01-24
tags:
  - tech
coverImage: /images/blog_images/2018-travel-in-review/2018-travel-in-review.png
excerpt: Perfect truly is the enemy of good.
lang: en-US
---
<script>
    let { toml } = $props();
    import Timeline from '$lib/components/Timeline.svelte'
</script>

>> After chatting with some fellow [Recurser](https://recurse.com) about this blog piece, it has inspired me to write an explainer series on Python for the Web. TKTK


I had this idea to create a "data playground" on my blog for bite-sized data science projects back in 2022. The idea was the project to be something you would complete in an afternoon 😅

The setup was seemingly straightforward and my inaugural bite-sized project started off like most well-intended projects: 
- properly scoped
- MVP

But this *little project that could* ended up falling victim to scope-creep, perfectionism, grandiose plans, and multiple acts of abandonment. Recently I finally decided to just publish it and move on with my life, but before I did, I wanted to document the papercuts of being on the bleeding edge of using Python on the web, the eternal love-hate relationship of packaging, versioning, and dependency resolution in scientific computing.

tl;dr 
- Don't let **perfect** me the enemy of *good enough*. 
- Sometimes a simple solution is better than a fully correct solution.
- Share early, share often.

## Motivation

The idea I had was actually quite simple:

I'm a data scientist and often I have an idea for a project that I want to hack on for a little bit, to scratch that data science itch, but it's only minorly interesting or impactful. 

For the majority of data science projects in Python, it is simple to create a Jupyter Notebook and maybe host that notebook on GitHub, but one crucial aspect is that you often lose interactivity or the exploration ability. A key part of data science and reporting is that you answer questions with data, but what happens when you or the reader have another question? Do you have to setup new infrastructure to answer a follow-up question?

This has often been a frustrating point for data scientists. We share a report but if we want it to have a slider or reset with initial values or state, that would be a separate project endeavor in itself.

I wanted to have a place on the web for these simple explorations that I can easily share and also let folks explore it further if they wanted to. I named this project: `Half-baked Data` 🎉

This idea was finally coming to fruition. There was a new promising project that just landed that satisfied all the requirements I needed. This was [Jupyterlite](https://jupyterlite.readthedocs.io/), which is the Jupyterlab environment running fully in the browser with no server setup, all powered by [Pyodide](https://pyoidide.org). I could host all my data science explorations using Github Pages.

### My Data Science Notebook Requirements

✅ It has support for Python
✅ It runs in the browser
✅ It doesn't require any setup
✅ Maintains interactivity
✅ I can embed it in my blog

However, at the moment, it does have a few shortcoming:
❌ Notebooks are currently monolingual
❌ Not all libraries are supported
❌ Uses Notebook paradigm (I prefer RMarkdown/Quarto/MyST environments for writing reports)


## When the Rubber meets the Road

The Jupyterlite setup portion was pretty straightforward. I cloned the [demo template](https://github.com/jupyterlite/demo) and set up my repo. I deployed it to one of my subdomain so now I have https://data.teonbrooks.com as my very own Jupyterlite instance, which is pretty cool 😎

### Working with Photos in Python

One of the popular image libraries in Python is Pillow. It has broad support for some of the most common image formats. That seemed all well and good until I realized all the photos I had taken were saved with Apple's new file format, HEIC.

> Fucking Apple!

The HEIC format, is a special case of HEIF that is used by Apple for their mobile devices (cf. [ref](https://cloudinary.com/guides/image-formats/heif-vs-heic#differences)). This format is not natively supported in Pillow. After I did some searching, I came across the following different packages:
- `pillow-heif` - a library with bindings to `libheif`. It provides a plugin to Pillow
- `pi-heif` - a bite-sized version of `pillow-heif` that only offers HEIF decoding. Built from the `pillow-heif` repo
- `pyheif` - a different binding library to `libheif` that only supports reading HEIF, doesn't have a plugin for `Pillow`

Pyodide

I started doing some of the data explorations in a notebook locally and things seem to be working. It 

### Accessing files
%% TK: git-lfs of images %%

### Working with Photos


All I wanted to do was write a simple blog post but it turned into a whodunit.

I will leave the details of the blog post for the blog post itself, don't want to steal its thunder. The gist is that I had an idea and I wanted to do some interactive data science for the core part of the piece.




## Getting Versions Align

## Compile Time


## Version Hell

## Project
- half_baked_data
	- Quick data projects
	- Share early, share often
	- Just a couple of hours of exploration
	- Allows other to explore deeper
- Host on Github
- Embed in blog

## Getting the Package Right
- Timeline








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
