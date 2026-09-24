#let data = json("resume-data.json")

#set document(title: data.id.name + " — Résumé", author: data.id.name)
#set page(paper: "us-letter", margin: (x: 1.7cm, y: 1.5cm))
#set text(font: "New Computer Modern", size: 9.7pt)
#set par(justify: true, leading: 0.5em)
#set list(spacing: 0.5em, indent: 0pt, body-indent: 0.4em)

#let section(title) = {
  v(9pt)
  text(size: 12pt, weight: "bold", tracking: 0.5pt, upper(title))
  v(-4pt)
  line(length: 100%, stroke: 0.5pt)
  v(2pt)
}

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

#let entry(left, right, subtitle: none, blocks: none) = {
  block(breakable: false)[
    #grid(
      columns: (1fr, auto),
      column-gutter: 1em,
      text(weight: "bold", left), text(style: "italic", right)
    )
    #if subtitle != none {
      text(style: "italic", size: 9.5pt, subtitle)
    }
  ]
  if blocks != none {
    v(2pt)
    blocks-content(blocks)
  }
  v(6pt)
}

// Header
#align(center)[
  #text(size: 20pt, weight: "bold", data.id.name)
  #v(2pt)
  #text(size: 10pt, data.id.headline)
  #v(2pt)
  #let website = data.id.social.at(0).Website
  #text(size: 9pt, (data.id.location, data.email, website).join("  |  "))
]
#v(6pt)
#text(size: 9.5pt, style: "italic", data.summary)

#section("Professional Experience")
#for p in data.positions {
  if p.organization != "" {
    entry(p.organization, p.timespan, subtitle: p.title, blocks: p.blocks)
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
    #grid(
      columns: (1fr, auto),
      column-gutter: 1em,
      text(weight: "bold", e.institution), text(style: "italic", e.timespan)
    )
    #text(style: "italic", size: 9pt, e.degree)
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
