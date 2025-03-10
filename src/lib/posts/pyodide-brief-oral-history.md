---
title: "Pyodide - Scientific Python on the web: A Brief Oral History"
slug: pyodide-brief-oral-history
authors:
  - Teon L Brooks
date: "2025-03-10"
categories:
  - tech
coverImage: /images/blog_images/pyodide-brief-oral-history/logo.svg
excerpt: "tl;dr: Pyodide gets its name from being the first language plug-in for a defunct data science notebook project called Iodide."
lang: en-US
---
A few weeks ago, I gave an oral history account of the Iodide and [Pyodide](https://pyodide.org) projects to some Recursers during Thursday presentations at the [Recurse Center](https://www.recurse.com/scout/click?t=f302bbc7dd078998e52bc365f1f73fa1). I worked at Mozilla at the time these projects were conceived and I served as their number one internal beta tester 😄

The talk also served as a primer for Scientific Python on the Web and gave the necessary background for a data science pet project that I finally got around to doing (TK blog coming soon™️). I figured I would write it up and have it serve as an artifact in case anyone ever wonders why the CPython implementation of Python compiled to <abbr title="Webassembly">WASM</abbr>  is called Pyodide.

tl;dr: Pyodide gets its name from being the first language plug-in for a defunct data science notebook project called Iodide.

## The Iodide project

The Iodide project was a skunkworks project inside of Mozilla Data org to create an experimental data science notebook that provided a full data exploration environment with modern editor capabilities. Its tagline was "View Source for Science".

<div style="text-align:center">
	<img src="/images/blog_images/pyodide-brief-oral-history/iodide-explore-to-report.gif" alt="Iodide notebook in action">
</div>

This project started roughly around 2018 and it was shuttered in 2021. The main contributors to the projects were Brendan Colloran, Hamilton Ulmer, Mike Droettboem, and William LaChance.

The team chose the name **`Iodide`** for a few reasons:
- It sounds very science-y
- High recognizability
- Low confusability -- Iodide had relatively low usage on the Internet already so this would make searching for the project easier

Aside: Check out this excellent [blog post](https://hacks.mozilla.org/2019/03/iodide-an-experimental-tool-for-scientific-communicatiodide-for-scientific-communication-exploration-on-the-web/) that introduced Iodide into the world.

## Problem Space

Here's the initial problem space Iodide was aiming to address:
- Data scientists often develop their work in a notebook environment
	- e.g. Jupyter Notebook or RMarkdown Notebook
- They then need to share their finding with their stakeholders but often have difficulty sharing it in the current form
	- e.g. Requires an export to PDF or Google Doc
- When exporting to these final states, the reports often lose any interactivity they had; it becomes a static asset
- Stakeholders are unable to ask further questions from the report since data are no longer accessible

Initially the Iodide notebook enabled easy access to Javascript libraries for data viz but it still lacked the toolkit many data scientists used for their analysis (e.g. dataframes, stats packages).

Realizing that a lot of data science analysis workflow is done in Python (and in R), the team strategized on ways to bring the necessary tools to the notebook experience. The team chatted with some of the WebAssembly folks who were at Mozilla at the time (Alon Zakai and friends) about the plausibility of getting Python to work in a browser context. The team took the advice and then [Mike Droetboom](https://www.linkedin.com/in/mdboom), famously worked on it over a weekend and brought back a proof-of-concept for getting Python to compile to WebAssembly using Emscripten. He spearheaded the work on bringing Python to the web and created the first language plugin for Iodide known affectionately as Pyodide \[[ref](https://droettboom.com/blog/2018/04/04/python-in-the-browser/)\].

<div style="text-align:center">
	<img src="/images/blog_images/pyodide-brief-oral-history/scientific-python-to-wasm.png" alt="Scientific Python to WebAssembly">
</div>

## Iodide Prototype
- Built on a flavor of Markdown (iomd)
- Interactive data visualization
- Easy to share
- No setup required
- No server for data processing
- See how everything is built (tagline: View Source for Science)
- Editor built on top of CodeMirror with a notebook parser
- Could send notebook in a report state with the rendered notebook
	- It would be rendered at load time though, no cache

<div style="text-align:center">
	<img src="/images/blog_images/pyodide-brief-oral-history/iodide-notebook.png" alt="Iodide Notebook">
</div>

## Iodide Instances

To pilot the notebook, the Iodide team stood up a public website `alpha.iodide.io`, and an internal instances which had the following:

Public service hosted
- Server to user accounts, notebook content
- User spaces for notebook deployment
- Notebooks could be forked to allow users to remix others' notebooks

Internal service
- Built connections to our datastore for query access
- Could host internal reports
- OAuth/LDAP-secured

## Life After Iodide

Fast forward, the Iodide Project was 86'd (RIP 😢) due to lack of executive leadership support at Mozilla to further develop it. But fortunately, Pyodide was spun out to become a community project ([Pyodide Spin Out and 0.17 Release - Mozilla Hacks - the Web developer blog](https://hacks.mozilla.org/2021/04/pyodide-spin-out-and-0-17-release/)), and many people and companies began to take an interest in the success. 

### Jupyterlite
[Jupyterlite](https://jupyterlite.readthedocs.io) seems to have finally solved a scenario of providing a self-contained interactive notebook environment that can be easily shared or hosted. This project is being worked on by the fine folks over at [Quantstack](https://quantstack.net/). Keenly, they see this as an excellent tool for education. A few related projects:
- [Basthon](https://basthon.fr/) - an early application of Pyodide, pre-Jupyterlite, developed to provide an in-browser Python environment for students without the need for computational support from servers
- [Capytale](https://capytale2.ac-paris.fr/) - a platform for delivering Python education to French public schools cost-effectively, and at scale

### Thebe
[Thebe](https://thebe.readthedocs.io), a part of the [ExecutableBooks Project](https://executablebooks.org/), has adopted Jupyterlite kernel implementation to provide in-context, interactive Python experience on the 

### Marimo
[Marimo](https://marimo.io/) is a reactive Python notebook with emphasis on reproducible execution.

### PyScript
[PyScript](https://pyscript.net/) allows for users to import PyScript as a js asset and declare a `<pyscript>` html element and write Python directly in HTML. The Python also has access to WebAPI all thanks to Pyodide.

### Cloudflare Python Isolate
[Cloudflare Python Workers](https://blog.cloudflare.com/python-workers) can now provide Python computations in its workers using Pyodide inside its V8 isolates.

### Bento
[Bento](https://engineering.fb.com/2024/06/10/data-infrastructure/serverless-jupyter-notebooks-bento-meta/) - Meta created their own version of a Jupyter-like computational notebook to handle the internal needs. Recently, they realized that offload some of their server requests for notebooks that didn't really need the full computational powerhouse but need to be hosted. This led their engineering team to support serverless Jupyter Notebooks within Bento.
