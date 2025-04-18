---
title: "Dispatches from a Nomad: Recurse Week 04"
slug: nomad-recurse-week-04
authors:
  - Teon L Brooks
date: "2023-06-14"
tags:
  - recurse
  - nomad
  - travel
collections:
  - recurse-2023s1
  - cestlavie
coverImage: /blog_assets/recurse/week-04/nadal.jpg
excerpt: "Recurse Center Week 04: King of Clay, français, Sacré, Beyoncé"
lang: en-US
social:
  - strava
---
<script> 
    import Callout from '$lib/components/Callout.svelte';
    import Album from '$lib/components/Album.svelte';
</script>

*The week of June 5, 2023*

## Recap

Welcome to Week 4 edition of the Dispatches from a Nomad 🎒: the Recurse collection 💻

In case you missed last week's edition, you can find it [HERE](./dispatches-nomad-recurse-week-03).

## Nomadic Adventures

<!-- Section about travel -->

This week I'm highlighting the first half of my second cross-country American train tour I took back in March 2023. This trip features me traveling on the Crescent Line from NYC to Charlotte to Atlanta to New Orleans. On this trip, I learned that New Orleans is also known as the Crescent City 🌙 This trip also kicks off my life as a proper nomad. I moved out of my old apartment, packed everything up in storage, and made no definitive plans for when or if I would return.

In Charlotte, I got to see my family, and we all came together to redo the flower bed at the family house. We dug up the weeds, laid down new liners, and spread so much fresh mulch all over the space. What I learned with mulch is that you always underestimate exactly how much you need, even when you go back for more! 😅

We also planted two new rose bushes alongside the one my mom had planted before. Roses were her favorite flower 🌹
Since I wasn't going to be in town for the anniversary of her passing, which was March 28, I wanted to spend time with everyone and visit her grave before continuing my travels.

Last year, I had come down for Thanksgiving and for her birthday, which was November 29. We were hoping that her headstone would arrive by her birthday, but we were informed when buying it that there was more than a six month delay for headstones due to supply chain issues; this was both from the demand side and bottleneck in acquiring raw material, which is pretty fucking grim. Also I just stumbled upon this article that highlights the issues [here](https://edition.cnn.com/2022/02/21/politics/headstone-supply-chain-granite-shortage/index.html). The headstone did finally arrive a few days after her birthday, but I had already flown back home before I would have a chance to see it.

<Album 
    albumHref = "https://photos.app.goo.gl/iqGQCPB6YjrPPgVa9"
    imageHref = "/blog_assets/recurse/week-04/PXL_20230314_175047149~2.jpg"
    alt = "Me wearing a jean jacket sitting on a trolley with a leather satchel"
    caption = "🎒 Nomadic Adventures: Crescent Line"
/>

## Nomadic Note

This week I've experienced two different breakthroughs: I'm finally feeling like my French isn't complete crap, and I've actually started to really program again. These two issues will be the focus of my note.

### La langue française

I am finally feeling like my spoken French is improving. This has been a real revelatory feeling and moment for me over the past few weeks. Like I actually feel like I can communicate and understand somewhat without relying on English. There have been two main drivers I can point to that has helped with my improvement: audio lessons, and willingness to be embarrassed.

#### Pimsleur
I've been refreshing my French knowledge using audio lessons from Pimsleur. For the uninitiated, Paul Pimsleur was an applied linguist who developed what is now known as the [Pimsleur Method](https://www.pimsleur.com/the-pimsleur-method), which builds upon the memory research literature of spaced repetition and this method is used for the lesson construction. It also requires you to actively engage with the lesson.

<Callout>
Check out your local library, they may have copies of Pimsleur lessons you can check out.
</Callout>

The lessons is constructed as follows: a scenario is laid out to you in English then you are asked to engage in a conversation with another speaker in the target language. There are prompt questions in the target language you're learning and your job is to respond to these questions in that language. There's a delay period to allow you to struggle and think in that language to make your response.

After that delay period, the lesson continues and they prompt you with the answer in the language. So you both hear a question, and you make your response, and you hear the correct response all in that target language. Throughout the lesson, they teach you new words, phrases, or grammatical constructions, and this is all integrated into the lessons with all the knowledge you've learned from previous lessons.

I used this approach when I was learning Portuguese about a decade ago and I felt it greatly improved my conversation skills over using Duolingo because its focus area is on speaking and listening. The lessons are around 25 minutes and it requires active participation to truly get something out of it. My comfort level in speaking French now is somewhere in the [B2](https://www.service-public.fr/particuliers/vosdroits/F34739?lang=en) range.

I think a speech-first approach is the way to go if you're intending to speak with people. I mean that sounds very obvious but it's not how lots of language classes are set up, and how our performance has been measured. I feel that it's easier to grade someone's writing or to assign a reading exercise than it is to prepare listening comprehension or oral exams.

#### Willingness to be Embarrassed

I think for the longest time, I have resisted speaking French because I was afraid of all the errors I would make and the disfluencies I would produce, essentially, I was afraid of embarrassing myself. I was a pretty good French student in high school, and was known as the class grammarian, and I also studied it a bit in college, but I realized that I had only gained reading and writing proficiency in the language, but not really expressibility through speech. I don't remember where I saw this but someone said something like this: You gotta get over your fear of screwing up if you actually want to get better at a language.

When I arrived back in May, I made a pledge to myself to initiate all conversations in French, switch the conversation back to French if it switched to English, and struggle through conversations in French until there was a complete breakdown. I don't think I have ever felt this way about my French before, like I know I'm not fluent, but I feel empowered to speak now, and I feel completely comfortable making a fool out of myself. I think this writing process and running process have all kind of fed into my speaking French process of where I just have to do it and keep doing it because that's the only way to get better at it. Now, I wish I had even more time here, two months is not enough!

### Pushing Code
<!-- Summary of the week -->
So, I have realized it has taken me three full weeks to really get started coding during Recurse. I mean, I haven't been doing nothing, just that it hasn't been anything substantial toward my project goal so far. The past weeks have been a wonderful and necessary acclimation period because the transition from not-working to working has been a real doozy in humbling and surprising ways.

I've spent the past eight months of my sabbatical not working on anything, only minor code fixes to my website and the occasional lurking on GitHub. I hadn't written anything of substance but I did use that time to do a bunch of brainstorming.

I initially signed up for a half-batch but I am pretty confident that I need to extend my time at least to a full batch (12 weeks).

### Backend Architecture

I started the week with designing the skeleton of what I wanted out of my backend for my web app.

```
Tix
|
|-- SEG.py
|
|-- OCR.py
|
|-- NLP.py
```

There are three main components I will need for the image processing:

- `SEG`: for image segmentation, which will separate a page from my scrapbook into individual ticket images
- `OCR`: for extracting the textual information from the individual images
- `NLP`: for summarizing the textual information from the individual tickets

I spent the beginning of the week writing README docs for the modules I have in mind, and laying out the design of them. At the moment, there are SEVERAL different options for completing these tasks. Since I'm still in the exploration phase of this project, I would like to evaluate some of these different options to see what best suits my needs. As a result, part of the design philosophy has been to develop a thin abstract representation of these operations so that I will be able to swap them out and quickly compare.

This week I focused on `SEG` and I began to play around with [Segment Anything Model](https://segment-anything.com/) (SAM). SAM was just announced two months ago back in April so it's relatively fresh off the press, and it's a deep learning model built on 11 million of images with more than a billion masks. Its objective is to be a universal segmentation model.

When I first ran the model on a page from my scrapbook, I started it right before my meditation session and it had a NOTICEABLE impact on the Zoom call. The model is pretty intense, the call started VOIPing, the camera frames would freeze, all my compute resources were going to the segmentation process. This reminded me of the days when I used to run analyses of neuroscience data on my laptop. Oh were the days of whirling fans and burnt laps. After a few minutes, I killed the execution. I wanted to have a better look at it after the meditation session.

Once we finished, I re-ran it, and it still required the same amount of resources, but it did finish 🎉 I got a list of dictionaries containing individual masks generated from my scrapbook page. I'll say it took about 5 minutes. I realized that all the processing was taking place on the CPU, no real use of the GPU. It was a good first step getting this part working and now it was time for me to start chipping away on more parts of the project.

<figure>
    <img src="/blog_assets/recurse/week-04/segmented.png" alt="Segmented page from scrapbook"/>
    <figcaption style:text-align="center">Segmented page from scrapbook</figcaption>
</figure>

### GCP Gen AI

Last week, I stumbled upon a ~~nine~~ now ten module introductory [learning path](https://www.cloudskillsboost.google/journeys/118) to generative AI from Google Cloud. I decided I would create a study group on the Recurse calendar to drum up interest and also have an accountability time for working through the materials.

On the first day, it was just me. I realized that I didn't do much advertisement of the study group and didn't bring it to the attention of the cohort. I went through the first module and it was an overall introduction to the topic of generative AI and what makes it a generative model, which generates new content based off of input versus a discriminative model, which can distinguish between different categories in the input data.

<!-- At a very high level, machine learning is a subfield of artificial intelligence that focuses on training models from input data. Within machine learning   deep learning, which is a subset of machine learning. Deep learning models use artificial neural networks to process input data to generate an output, and within deep learning, generative AI uses transformers, which encodes and decodes information -->

<!-- kind an image to convey point -->
<figure style:text-align="center">
    <img src="https://storage.googleapis.com/gweb-cloudblog-publish/images/image1_EEK2CuV.max-900x900.png" alt= "Plot depicting the subfields of machine learning" />
</figure>

Later in the week, I was joined by two Recursers, and we briefly discussed the GCP learning path. The topic at hand was Introduction to Large Language Models, and how best to go about watching the videos in discussion. We decided to watch them individually and to come back afterwards for the quiz and have a discussion. 

I watched the second video and it was also pretty introductory but it eerily also just felt like a sale's pitch for GCP, to the extent it was mentioned that only few institutions have the resources to do this, so essentially: kids, don't try this at home, just use their offering lol. I knew that it would be a showcase of their offerings and solutions, but I thought there would be more in the content of the video. Then again, it is just the second video and it is labeled introductory so maybe I should just move through them faster.

After watching the video, I met up with one of the Recursers, Alan, and we discussed the video and began chatting about setting up our local development environment to be optimized for PyTorch on an M1 Mac. He had written a guide on how to do so from a fresh install and wanted to see if there were any steps missing since he had already set it up on his. We set some time aside on Friday to pair together to get the setup working. Also we planned to troubleshoot an issue I was running up against using the SegmentAnything library.

#### A brief bit about GPUs

Among the things revealed at Worldwide Developer Conference this week, Apple announced that it has finally completed its transition from Intel processors to their bespoke Apple Silicon-designed chips. One important consequence of this architectural change has been improved performance for computations, but with the caveat that applications are compiled to their targeted architecture. This is an important point and why it's been necessary to get the correct Python environment set up to take advantage of this speed-up.

 Last year, PyTorch [announced](https://pytorch.org/blog/introducing-accelerated-pytorch-training-on-mac/) that it had begun to support some of its operators for the M1. PyTorch's performance shines with its use of GPU as these units are devised of many smaller but specialized processing cores and are optimized for parallelism, which allows for multiple computations to occur concurrently as opposed to CPU architecture, which are composed of fewer, but more general-purpose processors.

Since Apple has moved all its components completely in-house, and this also includes its GPU, known as Metal Processing Shaders (MPS), which is comparable to other GPUs on the market (e.g. NVIDIA). Since doing so, not all operators in PyTorch are suited or optimized for MPS. In using SegmentAnything, I tried to enable the use of MPS for the computation, to reduce the meltdown my computer was having trying to complete the task, but I received an error message stating that MPS does not support float64 in its computations 😢

### Pairing

Alan shared with me the slide deck he made for setting up PyTorch, which led to a convo, which I like to call, *Lies, Damned Lies, and Virtual Environments*. We walked me through the different approaches to environments in Python. I've used environments in the past but didn't have this nuanced understanding about them. We talked about the difference in the default Python virtual environment, which uses a base Python and installs packages to its respective environment's site folder, and Conda environments, which allows you to create an environment with a specific version of Python and have all the packages bundled into that environment. And then there's Mamba, a re-implementation of Conda that can handle parallelism, which is great for downloading multiple large packages, and can be used to set up different conda environments as well.

After we set up the environment, we wanted to test it out on some real code. I had the beginnings of my project so we decided to use it as a test case. I quickly realized I hadn't really written a script first for the project, I kind of went headfirst in building the codebase for the whole shebang.

I had pretty much already worked out which libraries and functions I would be using for the segmentation submodule I was writing but I had been iterating on it in my iPython session so it didn't really offer a good way for someone else to jump in to understand what was going on.

A simple reminder, have a toy script available to test out new ideas quickly and to kick the tires of a new library. It'll be easier to debug than the newly constructed functions and objects you have on top of it.

We began debugging the error I was receiving in SegmentAnything but there was no simple way to replicate the error in the module yet. I spent a little time to write up that simple script I was just harping about and we were able to get the error to appear. I was then able to replicate the error. That's great! but the problem still remained even when after having set up the environment to take advantage of the new architecture. It seemed that the segmentation library hadn't yet been updated to support the needed functionality. I'm currently following a [pull request](https://github.com/facebookresearch/segment-anything/pull/122) someone made to try to remedy this. We decided that this would be a great time to break for the day, and call it quits.

Afterwards, I did some additional reading about SAM and I discovered that the model can be saved to the ONNX format, which means it can be deployed faster and run quickly. I also realized that I might be able to simplify some of the backend needs by using the ONNX-runtime for the segmentation work.

## Things of Note

- I went to a third round match of the French Open at Roland-Garros on Monday! I spent the afternoon refreshing the page constantly to get a ticket and managed!

<figure style:text-align="center">
    <img src="/blog_assets/recurse/week-04/PXL_20230605_211036856.jpg" width="300px" alt="Me holding the peace sign at Roland Garros" />
</figure>

- Micro.blog. I spent some time exploring different microblogging solutions and I decided to setup a micro.blog page at <https://teon.micro.blog> for now. There were easy plugins to import my old tweets and my Swarm data.

- Found a web app for making an RSS of [my runs](https://feedmyride.net/activities/38985017): <https://feedmyride.net/strava>

- Had lunch with my friend Adrien who was briefly in town.

- Had drinks and dinner with my friends Remy and Roman. A long wait but we had an awesome seat for the evening in front of the Sacré-Cœur.

<figure style:text-align="center">
    <img src="/blog_assets/recurse/week-04/IMG-20230608-WA0004.jpg" alt="Me and two friends on a rooftop bar with the view of the Sacré-Cœur" width=300px style:text-align="center" />
</figure>

(More on these next week, too much content for this week lol)

- I went to my first Boiler Room party. It was in collaboration with [La Creole](https://www.instagram.com/lacreole_/). Was pretty dope.

- I traveled down to the south of France to spend the weekend in Marseille.

- I went to the Beyoncé concert!

## Nomadic Recurse Runs of the Week

Here's a collection of my runs for the week. Monuments featured below are Bibliothèque nationale de France - François Mitterrand, Place de la Nation, and Fontaine Palais de Longchamp:

<!-- 10: Bibliothèque nationale de France - François Mitterrand -->

- <div class="strava-embed-placeholder" data-embed-type="activity" data-embed-id="9216284897"></div>

<!-- 11: Place de la Nation -->
- <div class="strava-embed-placeholder" data-embed-type="activity" data-embed-id="9228196104"></div>

<!-- 12: Fontaine du Palais Longchamp -->
- <div class="strava-embed-placeholder" data-embed-type="activity" data-embed-id="9240950218"></div>

## Nomadic Weekly Roundup

### Favorite Reads of the Week

- <https://www.wbez.org/stories/how-chicago-beaches-get-and-keep-that-nice-fine-sand/11920b0a-4044-4c3c-b554-659697dd59cd>

### Favorite Podcasts of the Week

- <https://www.npr.org/2023/06/11/1179648233/notre-dame-paris-fire-rebuild-roof>
- <https://www.npr.org/2023/06/09/1181396465/the-sunday-story-an-evangelical-superstar-left-her-church-but-kept-her-faith>
