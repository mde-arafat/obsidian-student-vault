---
type: course
code:
level: Qualifier
term:
status: active
credits:
score:
grade:
cover: "#66800B"
aliases:
  - Qualifier Process
---
> [!info] What the qualifier is
> Four weeks of content from [[Maths 1]], [[Stats 1]], [[CT]] and [[English 1]], with weekly graded assignments, then an in-person qualifier exam. The qualifier score decides how many courses you can take in your first Foundation term. Check the official site for dates and cut-offs.

## Qualifier weeks
Weeks 1–4 of the four courses. The week notes you write now carry straight into the Foundation term.

```base
filters:
  and:
    - type == "week"
    - week <= 4
    - or:
        - course == link("Maths 1")
        - course == link("Stats 1")
        - course == link("CT")
        - course == link("English 1")
properties:
  file.name:
    displayName: Week
  note.status:
    displayName: Status
  note.due:
    displayName: Due
  note.score:
    displayName: Score
views:
  - type: table
    name: Qualifier weeks
    groupBy:
      property: note.course
      direction: ASC
    order:
      - file.name
      - status
      - due
      - score
    sort:
      - property: week
        direction: ASC
    summaries:
      note.score: Average
```

## Exam
![[Course.base#Assessments]]
