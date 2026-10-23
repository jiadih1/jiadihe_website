# Jiadi He — personal website

A small Jekyll site with no theme: four pages behind a top navigation
(About · Ideas & Research · In the World), plus one page per paper. Her contact
details sit in the Contact block on the About page; there is no Contact page or menu item.
Each paper is typeset as an academic preprint (LaTeX), and its page shows the
PDF inline with an "Open PDF" button.

## Where things live

| What | File |
| --- | --- |
| About page text | `index.html` |
| About timeline, newest first: per year an Education & Roles lane and a Papers lane (dated photos join automatically) | `_data/timeline.yml` |
| Portrait on About | `assets/img/portrait.jpg` (4:5) and optional `portrait-face.jpg` (square, used in the phone circle); both appear automatically |
| Email and LinkedIn | `_config.yml` (`email:`, `linkedin:`) |
| The six research themes | `_data/themes.yml` |
| One research entry (title, tags, description, context, PDF) | `_research/<slug>.md` |
| Paper PDFs served by the site | `papers/<slug>.pdf` |
| LaTeX source for each paper | `paper-src/<slug>/main.tex` |
| Shared paper style (fonts, title block, references) | `paper-src/_shared/preprint.sty` |
| In the World photos and captions | `_data/world.yml` + `assets/img/world/` |
| Colours, fonts, layout | `assets/css/main.css` |

### Add or edit a research entry

Create `_research/<slug>.md` with front matter only:

```yaml
---
title: "Paper title"
theme: "03"                 # one of the ids in _data/themes.yml
order: 4                    # position inside the theme
tags: ["Assessment", "Education Policy"]
description: "One or two sentences."
authors: ["A. Person", "Jiadi He"]       # optional, for co-authored work
credit: "Co-authored research"           # optional
context:                                 # optional, shown as secondary metadata
  name: "Professor Name"
  institution: "Institution"
pdf: "/papers/<slug>.pdf"                # or  external: "https://…"  for a web project
---
```

### Rebuild a paper PDF

Needs TeX Live (XeLaTeX + latexmk).

```sh
paper-src/build.sh <slug>     # one paper
paper-src/build.sh            # all papers
```

The script compiles `paper-src/<slug>/main.tex` and copies the result to `papers/<slug>.pdf`.

### Add photos to In the World

Put images in `assets/img/world/`, then edit `_data/world.yml`. Each entry takes
`image`, `kicker`, `caption`, optional `alt`, and `size` (`l` wide, `m` narrow,
`w` half). Add `year:` (and a short `id:`) and the photo also appears on the
About timeline at the end of that year. The six entries there now are
placeholders; delete `placeholder: true` when you replace one.

## Run locally

```sh
bundle config set --local path vendor/bundle
bundle install
bundle exec jekyll serve      # http://localhost:4000
```

On recent Homebrew Ruby, put `/opt/homebrew/opt/ruby/bin` first on `PATH` and
set `LANG=en_US.UTF-8`.

## Deploy (GitHub Pages)

1. Create a **public**, empty repository on GitHub (no README or license, so the first push is clean).
   - Named `<username>.github.io`, the site lives at `https://<username>.github.io/`.
   - Any other name (e.g. `website`) puts it at `https://<username>.github.io/website/`.
     Links adapt automatically, because `url`/`baseurl` are left for GitHub to fill in.
2. Push this folder:
   ```sh
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
3. In the repository, open Settings → Pages. Under "Build and deployment" choose
   "Deploy from a branch", branch `main`, folder `/ (root)`, and save. The first build
   takes a minute or two. The Actions tab shows its progress.

`vendor/`, `_site/`, `.bundle/` and LaTeX build files are ignored by git. Only the
cleaned `main.tex` sources and the final PDFs are published.

The PDF preview uses PDF.js from cdnjs. Fonts are Newsreader and Inter from Google Fonts.
