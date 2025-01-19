---
title: "Brainstorming Vie"
slug: brainstorming-vie
authors:
- Teon L Brooks
date: "2022-02-22"
categories:
- tech
collection:
- cestlavie
coverImage: "/images/blog_images/brainstorming-vie/brainstorming-vie.png"
excerpt: Thinking through a new indieweb app called Vie based on Svelte.
lang: en-US
---

This year, I've been thinking about how I could fulfill one of my resolutions to write more and the year is already off to a stumbling start:

One plan was to write about my runs, which is another goal of mine, but I realized that daily debriefs were good for me but not particularly interesting for others. So after about two weeks I ditched the thread.

Also, I often spend my wheels thinking about where and how I should share my progress. Should it be here on Medium or should I set up my own blog. Should I create a Substack, etc. But, it really has been me bikeshedding and not actually writing so for now, I'm just gonna write. I can always reorganize and refactor my thoughts and writings later.

I then had the idea of putting out a Weekly Roundup, a periodical that featured three areas: *What I'm Reading*, *What I'm Thinking*, *What I'm Doing*. I actually wrote up a piece but kinda missed my intended goal to get it out on a Monday. Then another week passed and I was already backlogged on the two posts I wanted to get out. It also started to fall victim to a concern I had about the running thread: a good reflection time for me, but I doubted that it would it be interesting to others. It seems I wasn't really doing a good job at this whole writing business.

This all started to circle around another idea that I had for a little while, and what I think will help focus both my writing, running, and coding goals: I'm gonna build my first web app and the goal of the website is to help me do all the above goals. Here's the idea and my motivation.

## Motivation

I've been thinking a lot about social media, the things I like(d) about it, the things that piss me off, some missed opportunities, and projects I really liked that was ahead of its time (maybe in the future, I'll do a longer piece on why I love the concept of Google Plus). Also over the past couple of years, I've been learning more about the [Indieweb](https://indieweb.org) project and one principle stands out, **Selfdogfood**: show before tell.

I keep making notes after notes, scribbles after scribbles, of what I would like for my website, what I would like to share with others, and what I would like to see and learn from others. So I've decided I'm going to finally build it as a way to channel these thoughts, design the tool I want to use, and learn how to be a full-stack web developer in the process.

## Web Development
Web development is such an unknown and uncharted frontier for me. I often like to think of myself as a full-stack data scientist where I can do the whole stack from data model design, ETL, data engineering, and data insights. However, all my approaches are Python-centric and I haven't really learned how to build outside my personal dev environment.

The past few years I've been learning JavaScript, which has been a great skill to have improve my data viz skills, and chip away at me doing more web development. I got involved with the [Iodide project](https://github.com/iodide-project/iodide) at Mozilla where the team was trying to create a literate data notebook, bring the Python data science environment to the web, which would tackle the same issues I was trying to solve for myself. My involvement was more like a developer advocate, a complete fanboy, and their **#1** beta tester. I fixed a few bugs here and there, but I didn't really have the skills needed to help build the project. The Iodide project is no more, but the spirit of the project lives on through the [Pyodide project](https://github.com/pyodide/pyodide), [Jupyterlite](https://github.com/jupyterlite/jupyterlite), and few other offshoots.

Another webby project I've been involved with has been [BrainWaves](https://github.com/makebrainwaves/Brainwaves), which is an all-in-one experimentation Electron app for running and analyzing EEG cognitive neuroscience experiments. For this project, I worked as the product lead alongside [Dano Morrision](https://twitter.com/SequencedC), the lead developer and a frontend wiz! to build this [experience](https://wp.nyu.edu/brainwaves/) for high school students in NYC. I learned the principles of React and beefed up my web development skills a bit, but I mainly worked on the product requirements, and helped out the data analysis part, which is powered by Python (soon Pyodide). There was always an upper limit for what I could do to contribute to the project, and this was gated on web development skills.

My involvement in these projects really show me the power of the web and the tools I would need to be successful. So now, I'm finally investing in myself to be able to build the things I both want to use and to see in the world.

## Project Vie
Hence, I'm dubbing this **Project Vie** where *vie* en français means **life**. I'm a big fan of concise and in this case monosyllabic product names. I want to be able to share different parts of life whether it's a coffee shop recommendation to music I just heard to an article I just read. Essentially I want an aggregator across the different apps and tools I use and I want to be able to share them as I see fit.

I take some of my inspirations from the [Indieweb](https://indieweb.org) community, in particular [Tantek](https://tantek.com/) as well as the quantified self world, some notable examples for me being [Aaron Parecki](https://aaronparecki.com/) and [Mek](https://mek.fyi/).

The first thing I want to do is tackle the data problem and from there I'll be working out the product design aspects. Here are the first 3 things that I first want to create with Vie:

1. An indie Goodreads feed using [Open Library](https://openlibrary.org). I've been chatting with the Internet Archive/Open Library community and I'm super stoked to work on this with them.
2. Feeds from selected tagged articles from my [Pocket](https://getpocket.com) account. Three feeds in particular I would like to share based off of my tags are *black america*, *queer america*, *tech + data + society*
3. A Strava feed so I can keep myself accountable to my running and be publicly shamed if I don't 😅

Also it would be nice to tackle these feeds whenever I get my bearings:

- A Foursquare Swarm feed of my check-in data. I've been using it for over a decade and it's supremely helpful when I revisit a city or friends ask for recommendations.
- A list of my Spotify liked songs. This is how I keep track of a new song I just heard and liked, also old song I rediscovered.
- A public Calendar feed curated of music/dance-related events I've gone or will be going to
- A feed of journal articles I've read via [Zotero](https://zotero.org)

## Tech Stack

Many of my colleagues, particularly [Hamilton](https://twitter.com/hamiltonulmer) have given rave reviews of [Svelte](https://svelte.dev) for web development. I've been trying to simplify my coding (check out [MyST](https://jupyterbook.org/content/myst.html) and writing around markdown, and this seems like a means to do so.

Another important aspect I need to learn is how to handle web request, authentication, and storage. To begin, I think I will likely do this all locally, then gradually learn how a simple serverless architecture would work as a replacement. Also the data feeds should be formatted to be indieweb-compatible, interoperable, standards-supported, etc.

I'm not sure where this project will go, but that's part of the fun. So for now, I will regularly update this blog with my progress reports, new things I've learned, and hopefully share out when I've conquered one of my web dev fears. Wish me luck! Send sample code 😬! Join me on this new adventure :)

    Off to go build things!
