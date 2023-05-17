---
title: "New Pocket Feature"
slug: new-pocket-feature
authors:
- Teon L Brooks
date: "2023-05-17"
categories:
- tech
coverImage: "/images/blog_images/new-pocket-feature/pocket.png"
# coverWidth: 16
# coverHeight: 9
excerpt: Pocket just announced a new feature, Lists.
lang: en-US
---

Pocket just [announced](https://blog.getpocket.com/2023/05/pockets-new-features-make-it-even-easier-to-discover-and-organize-content/) a new feature, **Lists**. Soon, I suspect, we will be able to share these different lists to each other based on our saved Pocket items. I am truly delighted!

I'd been brainstorming a similar idea for a while but there wasn't a straightforward way to do so. Pocket does have an API that allows you to build an app using its service but it requires setting up a server, deal with account authentication, and host of other things that I, as a novice in web development, just haven't been able to tackle.
> Sidenote: Web development is one of the things I'll be working on during Recurse.

Yesterday, I noticed a new feature on the Pocket website that was only labeled *New* with no popup or tooltip. I played around with it, noticed that I could add items to a list, neat. And that it was marked *Private* with no option to change it, which is usually an interesting tell of a feature to come, also neat. It reminded me a lot of tags, actually strikingly similar to how I have been using tags, but with the added bonus of allowing us to share a description of the list.

This morning, I stumbled upon an [article](https://www.engadget.com/pocket-users-can-now-create-multiple-collections-of-articles-videos-and-websites-160043227.html?src=rss) on Engadget highlighting this new feature as well as several updates to Pocket.

## Pocket Wishes

1. I really hope there will be an easy way to embed a widget of our List to a website. This is easily win-win for them. Their devoted fans can show off their curated list, just like *Pocket Hits* but for the rest of us. They could then link back to Pocket and have an integrated *Save to Pocket* button right next to each of the source articles.

2. I hope there will be a way for people to subscribe to your list or feed. I'm often curious what others are reading. This feature could be like *GoodReads* for articles.

3. The *List* feature is currently pretty barebones and I suspect/hope that there will be a way to bulk add to a list especially a way that lets us use our tags.

I really love Pocket! I have used it for the past six or seven years and it has been a way for me to archive the web I read. It doesn't have the full fidelity of every article I've read, just ones I've remember to save, which I may or may have read yet.

Recently, I have been overwhelmed by Pocket. I've run into the classic problem: I've saved more articles than I have read and now I have a list of **1545** unread articles. I stumbled upon this support article when writing this post entitled [Tips and Tricks to Conquer Your Pocket List](https://help.getpocket.com/article/1137-tips-and-tricks-to-conquer-your-pocket-list). I feel like a need a Pocket support group 🥲.

I've set a personal goal of reading at least 10 articles a day from that list and anything new I add must be read and archived so nothing net new to the heap so I can widdle it down. You gotta start somewhere!

## Old Blog Post, forgot to publish lol

I found a blog post I wrote back in February 2022 that I somehow forgot to publish here entitled __Pocket Backlog__. It's also pretty relevant to this conversation so I'll just copy-paste here with a few light annotations:

# Knocking a Dint into my Pocket Reading List

I decided to put a moratorium on net new Pocket articles in my queue. *(this didn't happen)*

~~28 days to go through my backlog of Pocket articles~~ *(this didn't happen either, lol)*

let's go on a wild reading ride!

I've had a project idea for a while:

> add a reading list to my personal website for tagged articles, in particular:

- `black + america` is centered mostly on the Black experience in America, the celebrations, the frustrations, and unfortunately, the unrelenting racist institutions across the US, but occasionally it also includes the fucked up racist shit that happens abroad too, plus Idris Elba and Black Brits trying Popeyes for the first time.

- `queer america` is centered around all things gay and queer happening in the US. Also, a lot about how gay social apps can be weaponized against the very people they were meant to serve.
- `tech + data + society` is a mix of how technology and the data we generate, affect us as a society. This goes from open data about how cities and governments to the machine learning and AI products that companies create.

I've also had an idea for a while: what if there was a Goodreads for articles. There are several stumbling blocks to doing this. One, we read a lot across devices. Also it requires a very active approach to archive/marking what you've read. `Pocket` is a great option but there isn't a plug and play option to share what you've read from the app.

We don't have anything that works like magic. [Microfiche](https://github.com/hamilton/microfiche) is a very promising project and it's so simple in its concept, you read and we'll handle everything else. It's built on top of the WebScience library used in Mozilla Rally *(RIP 😢)* studies and it includes an `attention-model` module that looks at different events related to your reading: how far you scrolled, how long you spent on the article, when you switched away from the page. It uses the Readability package to see if the page you're on an article, this powers the experience of Reader mode for Firefox.

`Microfiche` files a text copy blob of the text with some metadata. This works via a webextension on the desktop. We currently miss out on doing this mobile. One major roadblock is that up until now with iOS15.3, WebExtensions were not supported. Now they are but with the caveat that it only supports Safari usage and the WebExtension has to go through Apple's process for approval, etc. So for now, let's focus on Desktop and Pocket.

I now read most of Pocket articles on my Kobo. There's a native integration and it's a nice distraction-free environment. One shortcoming is that you can't add tags to your reading material. That's not a big deal for some, but for me, I want to have these labels to power my reading collections. Currently I have to go into Pocket and add tags manually.

So here's my goal. As of the article being published, I have 1373 *(even more now)* articles in my Pocket that haven't been archived. Some of the articles, I might have read, some aren't really articles to read (recipes, reference manuals, etc.). So since February has 28 days, I have to get through roughly 50 articles a day. Let's see if I can do it. I'll end in the week with a weekly recap. This is part of a larger weekly roundup I'm starting that cover the aspects: 
- `What I'm reading`
- `What I'm Thinking`
- `What I'm Doing`

Off I go!
