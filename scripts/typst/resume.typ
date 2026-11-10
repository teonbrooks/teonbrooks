#let data = json("resume-data.json")

#set document(title: data.id.name + " — Résumé", author: data.id.name)
#set page(paper: "us-letter", margin: (x: 1.7cm, y: 1.5cm))
#set text(font: "Trebuchet MS", size: 9.7pt)
#set par(justify: true, leading: 0.5em)
#set list(spacing: 0.5em, indent: 0pt, body-indent: 0.4em)

// entry() has parameters named left/right that shadow the alignment values.
#let align-left = left
#let align-right = right

// sticky keeps the heading on the same page as the first entry after it.
#let section(title) = block(sticky: true, above: 12pt, below: 6pt)[
  #text(size: 12pt, weight: "bold", tracking: 0.5pt, upper(title))
  #v(-4pt)
  #line(length: 100%, stroke: 0.5pt)
]

// Bullets are left breakable across a page boundary (unlike the CV's
// entries) — a résumé position can run to a dozen bullets across several
// sub-roles, and forcing the whole thing to stay on one page wastes a lot
// of space by shoving the entire entry to the next page instead.
#let blocks-content(blocks) = {
  for b in blocks {
    if b.type == "heading" {
      v(2pt)
      text(weight: "bold", size: 9.5pt, style: "italic", b.text)
      v(2pt)
    } else if b.type == "note" {
      text(style: "italic", size: 9pt, "(" + b.text + ")")
    } else {
      for item in b.items {
        if type(item) == dictionary {
          if item.url != "" {
            list[#item.text #linebreak() #link(item.url)]
          } else {
            list(item.text)
          }
        } else {
          list(item)
        }
      }
    }
  }
}

// With a location: org + location on the first row, title + dates on the
// second, so the header takes no extra height when there is a subtitle.
#let header-rows(left, right, subtitle, location, subtitle-size: 9.5pt) = {
  if location != "" {
    grid(
      columns: (1fr, auto),
      column-gutter: 1em,
      row-gutter: 3pt,
      align: (align-left, align-right),
      text(weight: "bold", left), text(location),
      if subtitle != none { text(style: "italic", size: subtitle-size, subtitle) } else { [] },
      text(style: "italic", right)
    )
  } else {
    grid(
      columns: (1fr, auto),
      column-gutter: 1em,
      text(weight: "bold", left), text(style: "italic", right)
    )
    if subtitle != none {
      text(style: "italic", size: subtitle-size, subtitle)
    }
  }
}

#let entry(left, right, subtitle: none, blocks: none, location: "") = {
  block(breakable: false)[
    #header-rows(left, right, subtitle, location)
  ]
  if blocks != none {
    v(2pt)
    blocks-content(blocks)
  }
  v(6pt)
}

// Header (Font Awesome Free icons, CC BY 4.0 — see scripts/typst/icons/)
#let icon-link(icon, label, url) = {
  box(image("icons/" + icon + ".svg", height: 0.9em), baseline: 0.1em)
  h(4pt)
  link(url)[#label]
}
#align(center)[
  #text(size: 20pt, weight: "bold", data.id.name)
  #v(2pt)
  #text(size: 10pt, data.id.headline)
  #v(1pt)
  #text(size: 10pt, style: "italic", data.id.location)
  #v(5pt)
  #let social = data.id.social.at(0)
  #text(size: 9pt, grid(
    columns: (auto, auto),
    column-gutter: 2.5em,
    row-gutter: 5pt,
    align: align-left,
    icon-link("envelope", data.email, "mailto:" + data.email),
    icon-link("globe", social.Website, social.Website),
    icon-link("linkedin", social.LinkedIn, social.LinkedIn),
    icon-link("github", social.GitHub, social.GitHub),
  ))
]
#v(6pt)
#text(size: 9.5pt, style: "italic", data.summary)

#section("Professional Experience")
#for p in data.positions {
  if p.organization != "" {
    entry(p.organization, p.timespan, subtitle: p.title, blocks: p.blocks, location: p.at("location", default: ""))
  } else {
    entry(p.title, p.timespan, blocks: p.blocks)
  }
  // Teon wants page 1 to be exactly Meta + Mozilla, with everything else on
  // the following page(s) — enforced explicitly rather than left to however
  // the spacing happens to flow, so it stays stable as content changes.
  if p.organization == "Mozilla Corporation" {
    pagebreak()
  }
}

#section("Nonprofit Leadership Experience")
#entry(data.nonprofit.organization, data.nonprofit.timespan, subtitle: data.nonprofit.role, blocks: data.nonprofit.blocks)

// Teon wants Education + Skills to consistently start their own page,
// rather than drifting onto page 2 whenever earlier content shrinks.
#pagebreak()
#section("Education")
#for e in data.education {
  block(breakable: false)[
    #header-rows(e.institution, e.timespan, e.degree, e.at("location", default: ""), subtitle-size: 9pt)
    #v(4pt)
  ]
}

#section("Skills")
#blocks-content((
  (type: "heading", text: "Programming"),
  (type: "bullets", items: data.skills.programming_languages),
  (type: "heading", text: "Languages"),
  (type: "bullets", items: data.skills.natural_languages),
  (type: "heading", text: "Open-Source Contributor"),
  (type: "bullets", items: data.openSource),
))
