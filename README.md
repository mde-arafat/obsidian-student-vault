# Obsidian Student Vault

A calm, ready-to-use [Obsidian](https://obsidian.md) vault for students: courses, weekly study notes, deadlines, concepts, projects and career, in one simple system with a warm "paper" look.

Made for **IIT Madras BS** students (Qualifier and Foundation course pages included) and works for **any student** at any university.

## What you get

- **Home dashboard:** what's due next, active courses and projects in one place.
- **New tab page:** a calm picture with a greeting, today's date and your next deadline (click it to open the note).
- **Course pages** that collect their own weeks, quizzes and concepts automatically, with your average assignment score.
- **Templates** for courses, weeks, assessments, concepts, projects, career items, sources, weekly reviews and terms.
- **Databases** (Obsidian Bases) for courses, deadlines, concepts, projects (board view), career (pipeline) and sources.
- **Weekly note:** one plan-and-review note per week (calendar icon in the left ribbon).
- **Reading mode by default:** notes open in reading mode, and you click the pencil (or press Cmd+E) to edit.
- **One-click bookmark** button on every note.
- **Keyboard and trackpad:** Cmd+[ / Cmd+] or a two-finger swipe for back and forward, Cmd+\ and Cmd+Shift+\ to hide the left and right sidebars.
- **Soft Paper theme** with rainbow folders, New York serif and dark mode.
- **AI-ready:** `CLAUDE.md` / `AGENTS.md` explain the vault's rules to Claude Code or Codex, so AI-created notes follow the same structure.

## Folder structure

```
Home.md            your dashboard
Courses/           one folder per course: course page, week notes, quizzes and exams
Concepts/          one idea per note, shared across courses
Projects/          projects and portfolio work
Career/            internships, jobs, certificates, events
Sources/           books, videos, PDFs, articles
Reviews/           weekly notes (2026-W42) and term notes (2027 Jan Term)
Bases/             the database views
Templates/         note templates
Attachments/       images and files
```

## Setup (5 minutes)

1. Click **Use this template** at the top of this page to get your own copy, or **Code → Download ZIP** and unzip it.
2. In Obsidian: **Open folder as vault** and choose the folder.
3. When Obsidian asks, choose **Trust author and enable plugins** (or Settings → Community plugins → Turn on community plugins). The theme and plugins are already included.
4. **Your name:** Settings → **Vault essentials** → *Your name*, for the New tab greeting.
5. **Fonts (optional, for the intended look):**
   - [New York](https://developer.apple.com/fonts/) from Apple (Mac)
   - [JetBrains Mono](https://www.jetbrains.com/lp/mono/) for code
   - Without them Obsidian uses its default fonts, and everything still works.

## How to use it

- **Start of a term:** activate your courses (set `status: active` and the term on each course page) and create a week note per week from the **Week template**, with the assignment deadline in `due`. With Claude Code you can just say *"set up my Jan 2027 term with Maths 1, Stats 1, CT and English 1"*.
- **Every week:** open this week's note (calendar icon), plan, study, write each week's summary in your own words, and tick off what's done.
- **Deadlines:** set `status: done` when something is finished, and it disappears from *Up next* and the New tab page.
- **Not at IIT Madras?** Delete the folders inside `Courses/` and create your own course pages with the **Course template**.

## Credits and licences

This vault's own files (notes, templates, bases, `vault-style.css` and the *Vault essentials* plugin) are under the [MIT License](LICENSE).

The included theme and plugins belong to their authors and keep their own licences. Each one's licence file sits in its folder:

| Included | Author | Licence |
|---|---|---|
| [Soft Paper](https://github.com/nickmilo/soft-paper) theme (based on AnuPpuccin) | Nick Milo | GPL-3.0 |
| [Style Settings](https://github.com/mgmeyers/obsidian-style-settings) | mgmeyers | GPL-3.0 |
| [Iconic](https://github.com/gfxholo/iconic) | Holo | MIT-0 |
| [LaTeX Suite](https://github.com/artisticat1/obsidian-latex-suite) | artisticat | MIT |

Design inspired by Nick Milo's *Linking Your Thinking* and Steph Ango's vault approach.
