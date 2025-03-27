---
title: Half-Baked Data, Unfinished Blogs, and Dependency Resolution Hell
slug: half-baked-data
authors:
  - Teon L Brooks
date: 2025-03-27
tags:
  - tech
coverImage: /blog_assets/half-baked-data/liteWordmark.svg
excerpt: Perfect truly is the enemy of good. Just be good enough!
lang: en-US
---
<script>
    let { toml } = $props();
    import Timeline from '$lib/components/Timeline.svelte'
</script>

*Sorry in advance, the timeline below isn't working quite well on mobile. Will fix soon!*

## tl;dr

- Don't let **perfect** me the enemy of *good enough*. 
- Sometimes a simple solution is better than a fully correct solution.
- Share early, share often. 
- I have my own data playground now: https://data.teonbrooks.com

## How It Started

I initially began working on this *forthcoming blog* three years ago and thought that it would be a simple afternoon project, but who hasn't left a blog post unfinished for years with the promised to return to it 😅
 
So this all started because I had this idea to create a **simple** *data playground* on my blog for bite-sized data science projects. 

The setup was seemingly straightforward and my inaugural bite-sized project started off like most well-intended projects:

- properly scoped
- MVP

But this *little project that could* ended up falling victim to scope-creep, perfectionism, grandiose plans, and multiple acts of abandonment. 

Recently, I finally decided to just publish the damned thing and move on with my life, but before I did, I wanted to document the papercuts of being on the bleeding edge of using Python on the web using [Jupyterlite](https://jupyterlite.readthedocs.io/), powered by [Pyodide](https://pyodide.org), the eternal love-hate relationship of packaging, versioning, and dependency resolution in Python and scientific computing.

All I wanted to do was write a simple blog post but it turned into a whodunit 😶

I will leave the details of the blog post for the blog post itself, don't want to steal its thunder. The gist is that I had an idea and I wanted to do some interactive data science for the core part of the piece.

Also, I have learned a lot about how the Pyodide build processing and Python versioning works so you don't have to. Sit back, relax, and come join me on a adventure through dependency hell 😈  

## Motivation

The idea I had was actually quite simple:

I'm a data scientist and often I have an idea for a project that I want to hack on for a little bit, to scratch that data science itch, but it's only minorly interesting or impactful.

Data science is primarily done in one of two languages: Python or R, but special shoutout to Julia (I would like to explore using you more), and I tend to favor the former. The workflow typically goes something like this: you create a Jupyter Notebook and maybe host that notebook on GitHub, but one crucial aspect is that you often lose interactivity or the exploration ability.

A key part of data science and reporting is that you answer questions with data, but what happens when you or the reader have another question? Do you have to setup new infrastructure to answer a follow-up question?

This has often been a frustrating point for data scientists. We share a report but if we want it to have a slider or reset with initial values or state, that would be a separate project endeavor in itself.

I wanted to have a place on the web for these simple explorations that I can easily share and also let folks explore it further if they wanted to. I named this project: `Half-baked Data` 🎉

This idea was finally coming to fruition. There was a new promising project that just landed that satisfied all the requirements I needed. This was [Jupyterlite](https://jupyterlite.readthedocs.io/), which is the Jupyterlab environment running fully in the browser with no server setup, all powered by [Pyodide](https://pyoidide.org). I could host all my data science explorations using Github Pages with full interactivity.

### My Data Science Notebook Requirements

- ✅ It has support for Python
- ✅ It runs in the browser
- ✅ It doesn't require any setup
- ✅ Maintains interactivity
- ✅ I can embed it in my blog

However, at the moment, it does have a few shortcoming:
- ❌ Notebooks are currently monolingual
- ❌ Not all libraries are supported
- ❌ Uses Notebook paradigm (I prefer RMarkdown/Quarto/MyST environments for writing reports)

## When the Rubber meets the Road

The Jupyterlite setup portion was pretty straightforward: 
- I cloned the [demo template](https://github.com/jupyterlite/demo) and set up my repo. 
- I deployed it to one of my subdomain so now I have https://data.teonbrooks.com as my very own Jupyterlite instance, which is pretty cool 😎

### Working with Photos in Python

One of the popular image libraries in Python is Pillow. It has broad support for some of the most common image formats. That seemed all well and good until I realized all the photos I had taken were saved with Apple's new file format, HEIC.

> **Fucking Apple!**

The HEIC format, is a special case of HEIF that is used by Apple for their mobile devices (cf. [ref](https://cloudinary.com/guides/image-formats/heif-vs-heic#differences)). This format is not natively supported in Pillow. After I did some searching, I came across the following different packages:
- `pillow-heif` - a library with bindings to `libheif`. It provides a plugin to Pillow
- `pi-heif` - a bite-sized version of `pillow-heif` that only offers HEIF decoding. Built from the `pillow-heif` repo
- `pyheif` - a different binding library to `libheif` that only supports reading HEIF, doesn't have a plugin for `Pillow`

## Putting it All Together

I started doing some of the data explorations in a notebook locally and things seem to be working. This part really was quick. I was able to install the libraries, I had all the files local to my computer so I could easily iterate over them, and I manage to get locations added a map (I'm really burying the lead on the project).

Now I need to figure out to recreate this magic on the web.

### Accessing files

So file storage isn't (readily) free 😅. You need to find somewhere to host your photos/dataset. This is something worth noting when you want to get a project off the ground and you want someone to be able to recreate your steps exactly. 

One piece of advice I wish I had followed and listened to (I even told myself this early on), is reduce your data payload. You can do do this a few different ways:
1. Compress yodur images
2. Export the metadata if the metadata is really all you need

I ended up storing all the files with `git-lfs`. At first I stored a zip of the directory but then I had figure out how to read a zip into memory in Jupyterlite and I really went down the rabbit hole on that one. I later unzipped and `git-lfs` the individual images.

** Note**: Remember to fetch your files in your GitHub Actions when you're building your site otherwise they won't be there. 

### Getting the Package Right

Package in Pyodide, the Python distribution that powers Jupyterlite, works differently than traditional package in Python with tools such as `pip` and `conda`. It might be worth breaking this out into a separate post but here's the crux of it:

The core Pyodide functionality, which is the CPython implementation and its standard library, has to get compiled to Webassembly, and this is done via Emscripten, along with all the necessary patches to make it work.

The "Big Four" and core scientific computing libraries: `numpy`, `scipy`, `matplotlib`, and `pandas`, also has to be compiled to Webassembly via Emscripten, which their patches as well.

Back when all of this was coming together, there weren't elegant ways to get other packages included into the distribution other than to build it along with everything else. This means that there are a whole collection of packages that need to be builded when Pyodide is being built. This does lead to very long CI build times (~2hrs).

Fortunately there are so new and nifty solutions to help solve the building problem. For packages currently not being built with Pyodide, if it's a pure Python package, then it can now be installed via `micropip`. This is super neat!
The team has also worked to mirror the build process of the collection of packages that are currently built with Pyodide in a separate repo [pyodide-recipes](https://github.com/pyodide/pyodide-recipes), and they plan to unvendor those packages from the distribution with [0.28]() release ([issue](https://github.com/pyodide/pyodide/issues/4918), [pr](https://github.com/pyodide/pyodide/pull/4987)).

Since libraries that depend on C needs to be built with Pyodide, their updates and release are contingent on the distribution release. I learned firsthand that not all versions play nicely with each other and that's usually because of dependency resolution.

*tl;dr:*

1. version-control your work
2. hard-code dependencies ~~in a requirements.txt~~

> *Actually in the past few weeks, I started to use `uv` for package management for Python projects, and that's been a breeze. Use it, it's legit! You can define a `pyproject.toml` and it generates*

### Dependency Hell

With Pyodide (0.22), everything worked! \[*ship it 🚀* \] tbh, I probably should have written and release the blog post then. I naively bumped my Jupyterlite version and then everything came tumbling down.

It took me some time to figure out what went wrong. I spent some mapping out the time, place, and the murder weapon and decided a timeline would best highlights the events.

<Timeline {toml} />

## Lessons Learned

Here are some things I could have done to speed the process along:

- Convert all the images from HEIC to JPG
- Done everything locally and embedded images
- Write the piece three years ago when things worked
- Exported the metadata into a JSON and just use that
