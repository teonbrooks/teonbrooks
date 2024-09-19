---
title: "RSS-to-Email"
slug: rss-to-email
authors:
- Teon L Brooks
date: "2023-05-25"
categories:
- tech
coverImage: "/images/blog_images/rss-to-email/rss-to-email.png"
excerpt: "Yesterday, I wrote my newsletter! Then I realized something very frustrating"
lang: en-US
---
<script> import Callout from '$lib/components/Callout.svelte'; </script>

Yesterday, I started my newsletter! Then I realized something very frustrating: I have it on my blog and for RSS users that's great because it automatically shows up there. I needed something for email users, the majority of the people I am trying to reach.

I had been hearing and seeing Substack as a way to start newsletter and had defaulted to giving it a try.
The first thing I did was copy and paste my blogpost, which was written in markdown, into the editor and bam, WYSIWYG, what you see is what you get. This reminded me of when I used Medium for the first time, great editor if you're writing in it, but nowadays I write everything in one editor, VSCode, for better or for worse.

I did some quick editing and formatting to get to work but then I noticed all the custom elements didn't render, which made me sad 😢 I had tinkered around with it to render on my blog and I liked how it showed up there, now it has been replaced with simply a link 🥲.

What I noticed is that the big idea of Substack is to get people onto its platform, secondarily, it's to help me as a writer get my message out. At least this is my impression so far. I'm currently just a casual writer and I don't have plans at the moment to build a business around me writing. I have finally just gotten over the fear of putting my thoughts out on the web and its original and unminced form. I don't think I have the stomach to manage a financial endeavor based on my written thoughts. And simultaneously, I just re-remembered why academia wasn't for me lol.

I began to see that managing this listserv was going to be more work than I wanted to do, tbh. I just wanted to write and publish and the way that I wanted to, but at the same time I want to reach my friends and family in the easiest manner possible. So I began to look around.

I saw that Mailchimp had the exact feature I needed, **RSS-to-Email**. Huzzah! I thought my issue was solved. After setting up a new account because my old one just doesn't work anymore 🤷🏾‍♂️ I kept going back to the [feature page](https://mailchimp.com/en/features/rss-to-email/) that kept telling me that yes, I can do it, while not finding this elusive *Classic Automations* option. At this point, I'm flustered, I went through all the Automations on the site, and this option was nowhere to be found. I scowled the whole way through the site, NOTHING. Then I did some more searching outside the site.

I then came across a [Help page](https://mailchimp.com/en/help/about-classic-automations/) about *Classic Automations* that greatly clarified what was going on: I can only create a Classic Automation if I've created a Classic Automation before. That's a little trippy and introspective. Have a created a Classic Automation before? Am I a Classic Automation? Is ChatGPT considered New Automation? Sidenote, they do have an AI-assisted templating thingy 🥴
So what I surmise is happening is that there used to be this feature, this great and singular feature that I am looking for and they're no longer supporting it for new MailChimp customers.

So no Mailchimp. Well, at least now I had language to look for the thing I was looking for, **RSS-to-Email**. I did some more digging and then I remembered that [Micro.blog](https://micro.blog) has a newsletter function. I haven't used Micro.blog yet but I do have an account. It is very much an indieweb company, which I definitely vibe with, and they make a nifty product that solve the use case of owning your content and not relying on some company that wants to be the new sherriff in town.

I found this [support page note](https://help.micro.blog/t/email-newsletter-subscriptions/731) that linked to this [announcement](https://www.manton.org/2021/12/06/introducing-email-newsletter.html) that Micro.blog supports my use-case. Currently, it will aggregate everything in your Micro.blog feed and send it out so that could be a mix of your short- and long-form writings. There's an option to select a particular category, but that's only offered for the monthly frequency option, but there's a note that it will be coming to the Weekly option soon 🤞🏾

Within the forum, I saw that there was a suggestion for another option, [ButtonDown](https://buttondown.email/). So I went over to that site, and to my surprise, I already had it bookmarked. Apparently, past Teon is more clever than present-day Teon. I must've considered all of this before, made note of it, and then immediately forgot it.

So I am now left with to options to consider, Micro.blog, and ButtonDown. I think I will give Micro.blog a go. I have been wanting to try it out properly but everything I began to, I kick the bucket down the street.

I'll report back on how it's working or not working for me.

## P.S.
 After I finished writing this up, I stumbled upon a YouTuber [explaining](https://youtu.be/IkKPFKnQbdg) how to use MailChimp for RSS-to-Email. The video was a few years old and it had an update in it. The update pointed to the new location of the RSS option but even that update is now dated. Deeper down in the comment sections (I actually browsed a comment section this time), I found a viewer's comment that actually solved the MailChimp issue. I'm not sure if it's official or not, if they'll continue to support it because they sure as hell obsfucated finding it. Here's the finding:

<Callout>
Lazard jin

1 year ago

The link from Renee did not work for me but I finally found it by going to Campaign > All Campaign > List View > View by type > Automations > Create > Share blog update

The URL should be [your admin mailchimp URL]/campaigns/#/create-campaign/explore/rss
</Callout>

Shout out to Lazard jin and Wade McMaster! 🎉

I'll likely check out both MailChimp and Micro.blog for now.
