# Quiz

A personality quiz authored as one table. Visitors see an intro card, then one question at a
time, then the result their answers point to most.

| quiz | | |
| --- | --- | --- |
| Intro | image, optional credit | heading, button label (last paragraph, e.g. "Start") |
| Question | image (optional), credit | heading, optional "Choose up to 2", answer list |
| Result | image, credit | heading (the result title), body copy and links |

## Answers and scoring

Each answer is a list item: the answer text (or an image, for picture answers), with a nested
list naming the result(s) it counts toward. Names must match a result heading (case doesn't
matter).

- Solo
  - Take a Slower Vacation

Every selected answer adds a point to each result it names; add a number in parentheses to
weigh it more, e.g. `Take a Slower Vacation (3)` adds three points. The result with the most points
wins; a tie goes to the result that comes first in the table.

A question allows several answers when its hint paragraph contains a number, e.g.
"Choose up to 2".

## Options

- `Quiz (shuffle)` — answers appear in a random order on every visit (scoring is unaffected).
- `Question (columns)` in a row's first cell — that question's answers sit in two columns.
  Picture answers always use two columns.
- `grey` in a row's first cell, e.g. `Intro (grey)` or `Question (columns, grey)` — shows that
  screen's title in bold dark grey instead of black.
- Picture answers take an optional credit after the image (e.g. *Getty Images*), shown on the
  photo.

The result screen includes share links (Facebook, X, LinkedIn, WhatsApp, email, SMS) for the
page URL and the result title.
