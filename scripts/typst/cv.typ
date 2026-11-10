#let data = json("data.json")

#set document(title: data.id.name + " — CV", author: data.id.name)
#set page(paper: "us-letter", margin: (x: 1.8cm, y: 1.6cm))
#set text(font: "Trebuchet MS", size: 10pt)
#set par(justify: true, leading: 0.6em)

// Matches the website's convention (PortfolioCard.svelte): every line is
// its own paragraph/block, and a "### Title" line is a sub-heading rather
// than literal text — previously this just split on blank lines and printed
// "### ..." lines verbatim, so multi-stint descriptions (e.g. Government of
// New York City, New York Cares) showed the raw "###" markers on the CV.
// entry() has parameters named left/right that shadow the alignment values.
#let align-left = left
#let align-right = right

#let show-paragraphs(s) = {
  let lines = s.trim().split(regex("\n+")).filter(p => p.trim() != "")
  for (i, line) in lines.enumerate() {
    let trimmed = line.trim()
    let heading = trimmed.match(regex("^###\s+(.+)$"))
    if heading != none {
      if i > 0 { v(2pt) }
      text(weight: "bold", style: "italic", size: 9.5pt, heading.captures.at(0))
      v(2pt)
    } else {
      trimmed
    }
    if i < lines.len() - 1 { parbreak() }
  }
}

#let bold-marked(s) = {
  let parts = s.split("**")
  for (i, p) in parts.enumerate() {
    if calc.rem(i, 2) == 1 { strong(p) } else { p }
  }
}

#let daterange(started, ended) = {
  if started == "" and ended == "" { "" }
  else if ended == "" { started + "–" }
  else if started == ended { started }
  else { started + "–" + ended }
}

// sticky keeps the heading on the same page as the first entry after it.
#let section(title) = block(sticky: true, above: 16pt, below: 8pt)[
  #text(size: 12pt, weight: "bold", tracking: 0.5pt, upper(title))
  #v(-4pt)
  #line(length: 100%, stroke: 0.5pt)
]

// With a location: org + location on the first row, title + dates on the
// second (no extra height when there is a subtitle).
#let entry(left, right, subtitle: none, body: none, location: "") = block(breakable: false)[
  #if location != "" {
    grid(
      columns: (1fr, auto),
      column-gutter: 1em,
      row-gutter: 4pt,
      align: (align-left, align-right),
      text(weight: "bold", left), text(location),
      if subtitle != none { text(style: "italic", size: 9.5pt, subtitle) } else { [] },
      text(style: "italic", right)
    )
  } else {
    grid(
      columns: (1fr, auto),
      column-gutter: 1em,
      text(weight: "bold", left), text(style: "italic", right)
    )
    if subtitle != none {
      text(style: "italic", size: 9.5pt, subtitle)
    }
  }
  #if body != none and body.trim() != "" {
    v(2pt)
    show-paragraphs(body)
  }
  #v(6pt)
]

// Header
#align(center)[
  #text(size: 20pt, weight: "bold", data.id.name)
  #v(1pt)
  #text(size: 10pt, style: "italic", data.id.location)
  #v(5pt)
  // Font Awesome Free icons (CC BY 4.0) — see scripts/typst/icons/.
  #let icon-for = (
    Bluesky: "bluesky",
    GitHub: "github",
    LinkedIn: "linkedin",
    ORCID: "orcid",
    Website: "globe",
  )
  #let social = data.id.social.at(0)
  #text(size: 9pt, grid(
    columns: (auto, auto),
    column-gutter: 2.5em,
    row-gutter: 5pt,
    align: left,
    ..social.pairs().map(((k, v)) => {
      box(image("icons/" + icon-for.at(k, default: "globe") + ".svg", height: 0.9em), baseline: 0.1em)
      h(4pt)
      link(v)[#v]
    })
  ))
]

#section("Positions")
#for p in data.positions {
  if p.organization != "" {
    entry(p.organization, p.timespan, subtitle: p.title, location: p.at("location", default: ""))
  } else {
    entry(p.title, p.timespan)
  }
}

#section("Education")
#for e in data.education {
  entry(e.institution, daterange(e.started, e.ended), subtitle: e.degree + ", " + e.field, body: e.description, location: e.at("location", default: ""))
}

#section("Teaching Experience")
#for t in data.teaching {
  block(breakable: false)[
    #let term = if type(t.term) == array { t.term.join(", ") } else { t.term }
    #entry(t.institution, term, subtitle: t.role + " — " + t.course + (if "location" in t and t.location != "" { ", " + t.location } else { "" }))
    #if t.link != "" {
      let links = if type(t.link) == array { t.link } else { (t.link,) }
      text(size: 9pt, links.map(l => link(l)[#l]).join(" · "))
      v(6pt)
    }
  ]
}

#section("Honors & Awards")
#for h in data.honors {
  entry(h.title, h.awarded, subtitle: h.issuer, body: h.description)
}

#section("Publications")
#for p in data.publications {
  block(breakable: false)[
    #bold-marked(p.authorsApa) (#p.year). #p.title. #emph(p.venue)#if p.venueDetail != "" [, #p.venueDetail]. #link(p.link)[#p.link]
    #if "preprint_date" in p {
      linebreak()
      text(style: "italic", size: 9pt)[Preprint: #p.preprint_date — #link(p.preprint_link)[#p.preprint_link]]
    }
    #v(6pt)
  ]
}

#section("Additional Research Products")
#for a in data.assets {
  block(breakable: false)[
    #a.authorsApa (#a.year). #a.title #[[#a.kindLabel]]. #emph(a.publisher). #link(a.link)[#a.link]
    #v(6pt)
  ]
}

#section("Invited Talks & Panels")
#for t in data.talks {
  entry(t.title, t.date, subtitle: t.organization + (if "location" in t and t.location != "" { ", " + t.location } else { "" }), body: t.at("details", default: none))
}

#section("Posters")
#for p in data.posters {
  entry(p.title, p.date, subtitle: p.authors + " — " + p.conference)
}

#section("Open-Source Contributions")
#for p in data.projects {
  block(breakable: false)[
    #entry(p.name, daterange(p.started, p.ended), subtitle: p.role, body: p.description)
    #if p.url != "" {
      text(size: 9pt, link(p.url)[#p.url])
      v(6pt)
    }
  ]
}

#section("Service and Volunteering")
#for v in data.involvement {
  entry(v.organization, daterange(v.started, v.ended), subtitle: v.role, body: v.description)
}

#section("Skills")
#text("Programming: " + data.skills.programming_languages.join(", "))
#linebreak()
#text("Languages: " + data.skills.natural_languages.join(", "))
