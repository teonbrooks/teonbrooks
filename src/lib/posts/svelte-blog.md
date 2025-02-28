---
title: "Revamped Blog, powered by Svelte"
slug: svelte-blog
authors:
- Teon L Brooks
date: "2022-12-14"
tags:
- tech
coverImage: "/images/blog_images/svelte-blog/svelte.png"
excerpt: I'm now hosting my own blog, powered by Sveltekit 🎉
lang: en-US
---

First off, congrats to the Svelte team on getting [Sveltekit](https://kit.svelte.dev) to 1.0! 🎉

I wanted to write a ~~quick~~ piece about my blog migration. I'm currently writing a longer, broader piece about my digital migration.

> tl;dr, data sovereignty and data preservation are very important and I don't want to be locked into a platform. I'll put into practice a concept from the [IndieWeb](https://indieweb.org) community: POSSE -- Publish Own Site Syndicate Elsewhere. I will first post my content on here then I'll likely take a snippet of it and post it on a bigger platform (e.g. [my Medium page](https://teonbrooks.medium.com)) to point it back to my own blog.

---

I've finally bit the bullet to host my own blog instead of using a service. I've used Sveltekit to build my site. Many thanks to [Josh Collinsworth](https://joshcollinsworth.com/) for his [blog post](https://joshcollinsworth.com/blog/build-static-sveltekit-markdown-blog) on how to build a static Markdown blog from scratch using Sveltekit. The blog post is super insightful with great hand-holding which was exactly what I needed to get it done!

Also, special shoutout to [Hamilton](https://www.hamiltonulmer.com/) for putting me onto the world of Svelte.

## Framework: *Sveltekit*

My old site was built using a [ajlkn's](https://twitter.com/ajlkn) HTML5 UP [template](https://html5up.net/astral) (TY!). First I wanted to get it to parity with my old site in terms of look and feel, then I began moving my blog over.

I followed along with Josh's blog [post](https://joshcollinsworth.com/blog/build-static-sveltekit-markdown-blog) and downloaded the associated [starter kit](https://github.com/josh-collinsworth/sveltekit-blog-starter).

## Blog Migration: *medium2md*

Getting the content from my old blog was a bit of a bear to deal with. I first [exported](https://help.medium.com/hc/en-us/articles/115004745787-Export-your-account-data) my data from Medium, which comes as a zip file containing a bunch of things, but most importantly the blog pieces. These are saved as html files, but upon inspection, you quickly realize the images aren't downloaded with the content. I used [medium2md](https://github.com/gautamdhameja/medium-2-md) to convert the html to markdown. It also has the added benefit of downloaded the referenced images from Medium's CDN.

Then I made adjustments to the front-matter and referenced the images to static folder directory to host them. The images' title has a hash representation; I changed some of filenames but got lazy so 🤷🏾‍♂️. However, I **do** need to go back and add alt text the image to ensure accessibility.

> Note: I'm also thinking through how I want to deal with images more broadly. The [PublicAlbum](https://www.publicalbum.org/) project has given me some ideas of how I might want to deduplicate some of the work, especially for blog pieces like [2018-travel-in-review](/blog/2018-travel-in-review) but that'll likely be for another time.

## UI Components: *Svelte Material UI*

I wanted to get some basic things on the website up and running fast so I just looked for an existing component library and stumbled upon [Svelte Material UI](https://sveltematerialui.com/). I like it, it's working well-enough, and it allows for me to get to feature parity of my old site.

I'll likely begin looking into building my own components once I have an understanding of how I want my content to show up on my site. I'm learning a bit about it now and things like [Storybook](https://storybook.js.org/) and [Histoire](https://histoire.dev/) are starting to make sense.

## Host: *Netlify*

I'm deploying using Netlify. I could have made a GitHub action to build the files then host those directly on GitHub Pages, but it was easier to host the site on Netlify and it gives me the flexibility to expand my website's functionality in the future.

## Comments: *Giscus*

The commenting is powered by [Giscus](https://giscus.app). Initially, I had [Utterances](https://utteranc.es/), but then I saw that Russ Poldrack's [blog](https://poldrack.github.io/blog/) used Giscus and [did](https://shipit.dev/posts/from-utterances-to-giscus.html) some [digging](https://andrewlock.net/considering-replacing-disqus-with-giscus/) and I decided that using GitHub Discussions is more appropriate and attractive than using GitHub Issues and saw that Giscus is currently active so I went with that one.

## Analytics: *Plausible*

I used to have Google Analytics powering my old site, but I rarely checked it. I saw that the GA Universal Analytics I had on my site needed to be switched over to GA4 property. I didn't know what any of that meant. All I was really interested in was simple metrics like *how many visits did my site get?* And now since I ported over my blog, it would be nice to see how many people read a given blog post and perhaps how they found their way to my site.

I looked to see what the options were out there. It seems like the two main GA alternatives that were privacy-compliant were Plausible and Fathom. I did a cursory search and read this blog [post](https://littlemountainprinting.com/articles/fathom-vs-plausible-analytics-which-is-better/) that gave me the lay of the land. I saw that the Pyodide [blog](https://blog.pyodide.org/) used Plausible, it was also the cheaper option, so I just went with that one.

## Public Repo

I decided to use the special repo `username/username` to host my site for two main reasons ([Twitter 🧵](https://twitter.com/teonbrooks/status/1492658898989465602) for original inspiration):

(1) it contained my **README** file and really didn't want to make two repos that referenced the same file and a submodule would have been overkill

(2) I use a custom name for my website and also I'm deploying it with Netlify so I didn't really need the `username.github.io` repo

## Final Thoughts

All of this has been in preparation for a challenge I made to myself, one that I've made several times before and have failed spectacularly, but *THIS* time I'm going to do it: **I'm going to write** (also I'm going to learn and build new things).

The plan is to publish at least one blog post a week, typically on Wednesdays. It can be on anything, it'll likely be on some personal projects I've been trying to get out the door forever. This blog migration is one of those so at least I can check that one off the list ✅

Back in October, I was laid off from a startup I recently joined and found myself in a position I've never been in: I currently have no external responsibilities (no debt, no kids, no one who depends on me), I have lots free time because of the whole no job situation, I do have some savings, and I have tons of ideas.

It's daunting, I've been going full-steam ahead for the last 17 years: 4 years as an undergrad, 2 years working as a research lab manager, 5 years doing a PhD, a year as a postdoc, 4.5 years at Mozilla, 5 months at the startup, all without a real break in between. I want to take advantage of this opportunity. I've wavered back and forth on how long I will give myself to do this. Maybe 6 months? maybe a year? I'm also taking this as a chance to figure out ~~exactly~~ what I want to do next.

I have another post I'm working on (you should see the number of drafts I have in queue 😅😬🫣) that I'll link here from a recent cross-country train trip I did that coincidentally started the same day I was let go. A deeper dive into figuring my life out.

Let's wrap this up: 
- Svelte is really cool 😎
- It's fun playground that'll allow for me to tinker 🛝
- This website will likely host a lot of the ideas I'm prototyping so STAY TUNED! 👨🏾‍🔬
