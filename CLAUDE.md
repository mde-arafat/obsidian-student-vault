# Vault rules for AI assistants

This Obsidian vault is a student's study system: courses, weekly study notes, deadlines, concepts, plus career and side projects. The owner values simple, useful and efficient over clever. Follow these rules whenever you create or edit notes.

## Folders
- `Courses/<Course>/` holds the course hub `<Course>.md`, week notes `<Course> W01.md` … and assessments such as `<Course> Quiz 1.md`, `<Course> Midterm.md`, `<Course> End Term.md`.
- `Concepts/` holds one idea per note, named in sentence case (`Bayes theorem.md`). Concepts are shared across courses.
- `Projects/`, `Career/` and `Sources/` hold one note per item.
- `Reviews/` holds weekly notes named `2026-W42.md` and term notes named `2027 Jan Term.md`.
- `Bases/` holds the `.base` database views, `Templates/` the templates, `Attachments/` images and PDFs.
- Never put notes in the vault root; only `Home.md`, `README.md`, `CLAUDE.md` and `AGENTS.md` live there.

## Course names
Use the short names the student uses for their courses (e.g. "Maths 1", "Physics 101"). Put the full name and the course code in `aliases`.

## Properties
Every note starts from its template in `Templates/` and has a `type`.

| type | properties |
|---|---|
| course | code, level, term, status, credits, score, grade, cover, aliases |
| week | course, week, status, due, score |
| assessment | course, kind, due, status, score |
| concept | courses |
| project | status, start, end, courses, skills, url, cover |
| career | kind, org, status, due, url |
| source | kind, author, url, courses |
| review | — |
| term | start, end |

Allowed values:
- course `status`: planned, active, passed, failed, dropped
- week, assessment and project `status`: todo, doing, done
- career `status`: interested, applied, interview, offer, closed
- assessment `kind`: quiz, midterm, end-term, lab, project, viva, oppe, qualifier
- career `kind`: internship, job, certificate, event
- source `kind`: book, video, pdf, article, course
- `level`: the student's own program stages (for IITM BS see below)

Rules:
- Dates are `YYYY-MM-DD`.
- Links in properties are quoted: `course: "[[Maths 1]]"`.
- `courses`, `skills` and `author` are always lists, even with one value.
- `due` on a week note is that week's assignment deadline; on an assessment it is the exam date.
- `cover` is a hex colour for card views.
- Leave unknown values empty. Never invent scores or dates.

## Set up a new term
When asked "set up my <term> with <courses>":
1. Activate each course hub (`status: active`, `term: "[[<YYYY Mon> Term]]"`); create the hub from the Course template if it doesn't exist.
2. Create `Reviews/<YYYY Mon> Term.md` from the Term template.
3. Create the week notes `<Course> W01` … for the number of weeks in the term, from the Week template, with `course` and `week` filled.
4. Create the assessment notes the course has (quizzes, midterm, end term, labs…), from the Assessment template.
5. Fill `due` only from dates the student gives. Never guess dates.

## Writing
- Link the first mention of a concept, e.g. `[[Function]]`. Create the concept note when the idea matters beyond one week.
- Math uses LaTeX: `$…$` inline, `$$…$$` for blocks.
- Use the callouts from the templates (`[!summary]`, `[!question]`, `[!tip]` …).
- The "In my own words" summary is the owner's. Don't fill it in unless asked; suggest questions instead.
- Academic integrity: don't solve graded assignments or exams. Explain concepts and give practice questions instead.
- Don't edit `.obsidian/` unless asked.

## IITM BS students
Only applies if the student is in the IIT Madras BS programme.
- Course short names: Maths 1, Stats 1, CT, English 1, Maths 2, Stats 2, Python, English 2 (Foundation); later PDSA, DBMS, MAD 1, MAD 2, Java, SC, MLF, BDM, MLT, MLP, TDS…
- `level`: Qualifier, Foundation, Diploma DS, Diploma Prog, BSc, BS.
- A term has 12 weeks with a weekly graded assignment, Quiz 1 after week 4, Quiz 2 after week 8, and an end-term exam. End-term eligibility depends on the graded-assignment average; check each course page for the exact rules.
- The qualifier covers weeks 1–4 of Maths 1, Stats 1, CT and English 1, then the qualifier exam (`Courses/Qualifier/`).
- Not at IITM? Delete the course folders inside `Courses/` and ignore this section.

## After an Obsidian update
Notes are plain files and are never affected. Only the look and the custom features can break, usually because Obsidian renamed an internal CSS class or API.

Where all custom work lives:
- `.obsidian/snippets/vault-style.css` holds every visual fix on top of the Soft Paper theme (corners, canvas lines, sidebar colours, dark-mode icons, title spacing, New tab look).
- `.obsidian/plugins/open-in-reading-mode/` is the local plugin "Vault essentials": reading mode by default, locked title in reading mode, one-click bookmark button, trackpad swipe back/forward, New tab greeting/date/next deadline and its pictures (`new-tab-light.svg`, `new-tab-dark.svg`). The greeting name is set in Settings → Vault essentials.
- `.obsidian/hotkeys.json` holds Cmd+[ / Cmd+] (back/forward), Cmd+\ (left sidebar) and Cmd+Shift+\ (right sidebar).

Quick check after a big update (about 30 seconds):
1. New tab (Cmd+T): picture, greeting, date and the next-deadline pill show; buttons are raised pills.
2. Open a note from the sidebar: it opens in reading mode, the title can't be edited, and the bookmark button sits next to the pencil and fills/empties on click.
3. Cmd+[ / Cmd+], a two-finger swipe, Cmd+\ and Cmd+Shift+\ all work.
4. Rounded corners on the left icon strip, rainbow sidebar colours with one icon per file, readable header icons in dark mode.
5. A canvas shows coloured connection lines with matching arrowheads.

If something broke:
- Compare the selector or API in these files with the new Obsidian version (on macOS the app's CSS and code are in `~/Library/Application Support/obsidian/obsidian-<version>.asar`) and update the name. Fixes are usually one line.
- Test risky changes in a copy of the vault first.
- Also check Settings → Community plugins → "Check for updates" for the Soft Paper theme and plugins.
