---
title: "The Thing to Remember When Trying to Upgrade to iPadOS 16"
slug: ipados16-upgrade-woe
authors:
- Teon L Brooks
date: "2022-12-22"
categories:
- tech
coverImage: "/images/blog_images/ipados16-upgrade-woe/IPadOS_16_icon.webp"
excerpt: For the life of me, I couldn't figure out why it wouldn't upgrade.
lang: en-US
---

*tl;dr: If your iPad won't upgrade to the latest version, maybe you should check whether you're beta testing a previous version.*

iPadOS 16 has been out since October 24, and I've been patiently waiting for it to come to my iPad.

I would go check it periodically. The first week, I was like, "it's ok, the servers are just a little overwhelmed and it will eventually get pushed down to me." Fast-forward to December 15, and the highest version I can upgrade to is 15.7.2.

I read through many blogs including Apple's (paraphrasing) [So Your Device Won't Update, Huh?](https://support.apple.com/en-us/HT201435) piece.

I kept getting this error message. For the life of me, I couldn't figure out why it wouldn't upgrade.

<figure>
<img src='/images/blog_images/ipados16-upgrade-woe/ipados16_act2.PNG' alt="iPad failing to update. Says there's no wifi but clearly I'm connected to the wifi" />
<figcaption>Why won't you cooperate??</figcaption>
</figure>

I've uninstalled it the 15.7.2 update, reinstalled it, plugged it into my Mac to see if I can do an installation from it per the instructions.

Nope.

It told me I had the latest version, **it's lying**.

Back to the drawing board.

<img src='/images/blog_images/ipados16-upgrade-woe/ipados16_act1.PNG' alt="Settings screen only displaying iPadOS 15.7.2 as an upgrade option" />

I'm sitting here flustered, frustrated! I'm a techie, why is this happening to me? I've checked countless times to see if my iPad is [eligible](ttps://support.apple.com/guide/ipad/supported-models-ipad213a25b2/ipados) for an upgrade, short answer: **it is**.

Longer answer: It's a [iPad Pro 11"](https://support.apple.com/en-us/HT201471) right before the switch to the M1, still a powerhouse of a tablet, just not ARM-based.

## Lightbulb Moment

Then I remembered something...I *AM* a techie **AND** an early adopter. I was reading through this [article](https://www.macworld.com/article/673681/how-to-get-ipados-15-on-your-ipad.html), which honestly needs an update, and it reads like it was written for iPadOS 15 and just changed the headline, even the url slug has `ipados-15` in it, and it had a section about beta testing. I must have enrolled in the beta testing for iPadOS 15 last year and had forgotten about it. 

So I began searching for the profile configuration in the settings that lets you know whether you're enrolled or not. This is tucked away from prying eyes. Apple keeps this profile configuration in the same location as the VPN (I found it through exhaustive searching).

<figure>
<img src='/images/blog_images/ipados16-upgrade-woe/ipados16_act3.PNG' alt="Finding the beta testing configuration file. It's hidden under the VPN settings" />
<figcaption>There you are!</figcaption>
</figure>

The next thing I needed to do was delete the configuration file and pray that it would work.

<img src='/images/blog_images/ipados16-upgrade-woe/ipados16_act4.PNG' alt="Me deleting the configuration file" />

Huzzah! Success!! I'm now prompted with access to download iPadOS16. This took me a lot longer to figure out than it should have. I understand that the pool of people who do beta testing is smaller than the general population. And perhaps those beta testers would have already jumped into beta testing iPadOS 16 before the general release.

This is definitely one of those aha! *gotcha* moments. I couldn't find it anywhere on the web so I figured I would blog about it in case someone else came across the same problem and was tired of beating their head against the wall.

<img src='/images/blog_images/ipados16-upgrade-woe/ipados16_act5.PNG' alt="Settings now reveal that iPadOS16 is in fact now available" />
