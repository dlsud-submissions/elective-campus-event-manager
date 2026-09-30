# SUBMISSION

## Task 1: Requirements Analysis & Prompt Architecture

**Lead:** Member 1 (Systems Architect) **Duration:** 30 Minutes **Points:** 20

### 1. Production-Grade RCTC Prompts

Use the table below to document the production-grade prompts created using the **Role–Context–Task–Constraints (RCTC)** framework. Each row should correspond to **one prompt assigned to one member**.

| # | Assigned Member | Role / Persona | Context | Task | Constraints |
|---|-----------------|----------------|---------|------|-------------|
| 1 | Member 2 (Frontend Engineer) | Senior Frontend Engineer focused on accessible (WCAG 2.1 AA) web UI | Lab midterm, Online Campus Event Management System; Task 2 needs an Event Catalog + Registration Form in /frontend, using a given navy/blue color palette | Build a static HTML/CSS/JS prototype: event catalog, registration form, and a simple admin attendee list | Semantic HTML5 (header, main, section, article, footer); aria-label on inputs, real `<label>`s, alt text, only the listed palette colors. **Do NOT** use frameworks, build tools or third-party libraries; **do NOT** use `<div>` as a generic layout wrapper where a semantic tag fits |
| 2 | Member 2 (Frontend Engineer) | Senior UI/UX Designer and WCAG 2.2 accessibility auditor | /frontend prototype (index.html, styles.css, script.js) for the Campus Event Management System, graded on Semantic HTML5 and WCAG POUR; script.js exports validation functions for unit tests | Audit all three files and produce a prioritized design-improvement plan (problem, file/line, fix, effort S/M/L) covering hierarchy, typography, spacing, color, cards, form UX, admin table, responsiveness and accessibility | **Do NOT** edit any files; **do NOT** recommend CSS/UI/JS frameworks (Tailwind, Bootstrap, React); every recommendation must fit in under 2 hours total |
| 3 | Member 2 (Frontend Engineer) | Design Systems Engineer specializing in accessible CSS | /frontend/styles.css already defines color tokens with contrast ratios in comments; plain HTML/CSS/JS, no build step, must meet WCAG AA contrast | Add a modular type scale and spacing scale, one accent color per event category, a token-only dark theme, and 150–200ms hover/focus transitions | **Do NOT** add external fonts, CDNs or new files; **do NOT** use any pair below 4.5:1 (text) or 3:1 (borders/focus rings) and list every ratio; keep prefers-reduced-motion working; do not change HTML ids or JavaScript |
| 4 | Member 2 (Frontend Engineer) | UI Engineer specializing in accessible card layouts and filtering | `renderEvents()` in script.js builds `<article>` cards with an `el()` helper, an SVG banner from `bannerImage()`, meta list, description, seat count and Register button; `EVENTS` is a mock array | Add category-colored banners with a date badge, a native `<meter>` capacity bar with a "Few seats left" badge, search and `aria-pressed` category filters with a "Showing N events" live region, fix the duplicate card landmarks, add an empty state, and update the docs | **Do NOT** use `innerHTML` with event data; every new input needs a visible `<label>` and an `aria-label` containing it (WCAG 2.5.3); **do NOT** change the `EVENTS` data shape or the exported functions; keep alt text meaningful |
| 5 | None | [Persona] | [Context] | [Task] | [Constraints + negative constraint] |
| 6 | None | [Persona] | [Context] | [Task] | [Constraints + negative constraint] |
| 7 | None | [Persona] | [Context] | [Task] | [Constraints + negative constraint] |
| 8 | None | [Persona] | [Context] | [Task] | [Constraints + negative constraint] |

> **Requirement:** Each prompt must use the **Role–Context–Task–Constraints (RCTC)** framework, include a defined persona, and contain at least one negative constraint.

### 2. AI-Generated System Design Outputs

Record the **exact AI output corresponding to each prompt** above.

AI tool used for prompts 1–3: Claude Code (Claude Opus 5.5) in VS Code. Outputs are long, so each is recorded verbatim in its own section below the table.

| # | Exact Prompt | Corresponding Output |
|---|--------------|----------------------|
| 1 | read context folder, my task is  fornt end ai assisted development. use these color palettes <br>use this color palette<br>Role    Color    Hex    Contrast    Result<br>Header/footer background (white text)    Navy    <br>#1E3A8A    10.36:1    AAA<br>Buttons and links    Royal blue    <br>#1D4ED8    6.70:1 on white    AA<br>Button hover    Deep blue    <br>#1E40AF    8.72:1    AAA<br>Page background    Ice blue    <br>#EFF6FF    (background only)    —<br>Card and form background    White    <br>#FFFFFF    (background only)    —<br>Main body text    Near-black navy    <br>#0F172A    17.85:1    AAA<br>Secondary text (dates, venues)    Slate gray    <br>#475569    7.58:1    AAA<br>Light text on the navy header    Pale blue    <br>#DBEAFE    8.49:1 on navy    AAA<br>Error messages    Red    <br>#B91C1C    6.47:1    AA<br>Success messages    Green    <br>#15803D    5.02:1    AA | See [Prompt 1 — AI Output](#prompt-1--ai-output). Generated files: `frontend/index.html`, `frontend/styles.css`, `frontend/script.js` |
| 2 | ROLE: You are a Senior UI/UX Designer and WCAG 2.2 accessibility auditor.<br><br>CONTEXT: /frontend contains a prototype for an Online Campus Event Management System (index.html, styles.css, script.js). Students browse events and register; admins view attendees. It is a university lab exam graded on Semantic HTML5 and WCAG POUR accessibility. script.js exports validateRegistration, seatsLeft and countRegistrations for unit tests.<br><br>TASK: Read all three files and produce a prioritized design-improvement plan covering visual hierarchy, typography, spacing, color, card design, form UX, the admin table, responsiveness, and accessibility issues. For each item give: the problem, the file/line, the proposed fix, and effort (S/M/L). Flag any existing accessibility problems, e.g. the six identical "Event details" region landmarks created by &lt;section aria-label&gt; inside each card.<br><br>CONSTRAINTS:<br>- Do NOT edit any files in this step; output the plan only.<br>- Do NOT recommend CSS frameworks, UI libraries or JS frameworks (no Tailwind, Bootstrap, React).<br>- Keep every recommendation achievable in under 2 hours of total work. | See [Prompt 2 — AI Output](#prompt-2--ai-output) |
| 3 | ROLE: You are a Design Systems Engineer specializing in accessible CSS.<br><br>CONTEXT: /frontend/styles.css already defines color tokens in :root with contrast ratios in comments. The site is plain HTML/CSS/JS with no build step and must meet WCAG AA contrast.<br><br>TASK: Upgrade the design tokens in styles.css:<br>1. Add a modular type scale (--fs-sm through --fs-3xl) and a spacing scale (--space-1 through --space-8), then replace hard-coded rem values with them.<br>2. Add one accent color per event category (Career, Workshop, Sports, Seminar, Culture, Academic), each with its contrast ratio against white noted in a comment.<br>3. Add a dark theme under @media (prefers-color-scheme: dark) that redefines the tokens only.<br>4. Add subtle transitions (150–200ms) for hover/focus on buttons, links and cards.<br><br>CONSTRAINTS:<br>- Do NOT add external fonts, CDNs, or any new files; system font stack only.<br>- Do NOT use any color pair below 4.5:1 for text or 3:1 for UI borders/focus rings; verify and list every ratio.<br>- Keep the existing prefers-reduced-motion block working for all new transitions.<br>- Do not change any HTML ids or JavaScript. | See [Prompt 3 — AI Output](#prompt-3--ai-output). Modified file: `frontend/styles.css` |
| 4 | ROLE: You are a UI Engineer specializing in accessible card layouts and filtering.<br><br>CONTEXT: script.js renders event cards via renderEvents() using an el() helper. Each card is an &lt;article&gt; with an SVG data-URI banner from bannerImage(), meta list, description, seat count and Register button. EVENTS is a mock array in script.js.<br><br>TASK:<br>1. Give each card's banner the category accent color from the design tokens and add a calendar-style date badge (month + day) over the image.<br>2. Replace the "X of Y seats left" text with a visual capacity bar using a native &lt;meter&gt; element plus the existing text, and show a "Few seats left" badge when under 20% remain.<br>3. Add a search input and category filter buttons above the grid (buttons use aria-pressed). Filtering happens client-side and announces "Showing N events" in a polite live region.<br>4. Fix the landmark noise: the inner &lt;section aria-label="Event details"&gt; in every card must no longer create duplicate region landmarks.<br>5. Add a clear empty state when no events match.<br><br>CONSTRAINTS:<br>- Do NOT use innerHTML with event data; keep building nodes with el() / textContent.<br>- Every new input must have a visible &lt;label&gt; AND an aria-label that contains the visible label text (WCAG 2.5.3).<br>- Do NOT change the EVENTS data shape or the exported functions.<br>- Keep images' alt text meaningful.<br><br>Make sure to update files in docs | See [Prompt 4 — AI Output](#prompt-4--ai-output). Modified files: `frontend/index.html`, `frontend/script.js`, `frontend/styles.css`, `docs/prompts.md`, `docs/verification-logs.md` |
| 5 | [Prompt 5] | [PASTE THE EXACT AI-GENERATED OUTPUT FOR PROMPT 5 HERE.] |
| 6 | [Prompt 6] | [PASTE THE EXACT AI-GENERATED OUTPUT FOR PROMPT 6 HERE.] |
| 7 | [Prompt 7] | [PASTE THE EXACT AI-GENERATED OUTPUT FOR PROMPT 7 HERE.] |
| 8 | [Prompt 8] | [PASTE THE EXACT AI-GENERATED OUTPUT FOR PROMPT 8 HERE.] |

#### Prompt 1 — AI Output

```text
I built the Task 2 frontend in frontend/ and deleted the empty client/ folder. The form's checks passed a quick run in Node, but I haven't opened the page in a browser yet. Nothing is committed.

RCTC for this prompt (also in the approved plan):

| Field | Content |
|---|---|
| Role / Persona | Senior Frontend Engineer focused on accessible (WCAG 2.1 AA) web UI |
| Context | Lab midterm, Campus Event Management System; Task 2 needs an Event Catalog and Registration Form in /frontend, using the navy/blue palette |
| Task | Build a static HTML/CSS/JS prototype: event catalog, registration form, admin attendee list |
| Constraints | Semantic HTML5, aria-labels, real labels, alt text, only the listed colors. Do NOT use frameworks or third-party libraries; do NOT use generic <div> wrappers |

What's in the page:
- index.html:
  - The layout uses <header>, <nav>, <main>, <section>, <article> and <footer>, with no <div>s at all.
  - There's a skip link to the main content.
  - Every input has both a <label> and an aria-label.
  - Error messages are linked to their fields and read out by screen readers.
  - The attendee table has a caption and proper column headers.
- styles.css: your 10 colors are defined once at the top, and nothing else on the page uses other colors. Focus outlines are always visible, buttons and links are at least 44px tall, and the layout works on phones.
- script.js:
  - There are six sample events with generated banner images and alt text. The event list is placeholder data until a backend exists.
  - Each event's "Register" button fills in that event on the form.
  - Registrations are saved in the browser, so they survive a reload.
  - The attendee list can be filtered by event.
  - User input goes into the page as plain text, so nobody can inject HTML through the form.

Form checks I tested in Node:
- Valid input passes.
- Empty fields and a wrong student ID format are rejected.
- A non-@univ.edu.ph email is rejected, including a trick address like x@evil.com@univ.edu.ph.
- Registering for a full event is blocked. The Cybersecurity talk has only 3 seats so you can see this quickly.
- The same email can't register twice for one event.

The check function is exported so Task 4 can write unit tests against it directly.

To view it: open frontend/index.html in a browser; no server is needed. For the grade evidence, run the Lighthouse Accessibility audit in Chrome DevTools.

Want me to commit and push this?
```

#### Prompt 2 — AI Output

```text
RCTC for this prompt:

| Field | Content |
|---|---|
| Role / Persona | Senior UI/UX Designer and WCAG 2.2 accessibility auditor |
| Context | /frontend prototype (index.html, styles.css, script.js) for the Campus Event Management System, graded on Semantic HTML5 and WCAG POUR; script.js exports the validation functions for unit tests |
| Task | Audit all three files and give a prioritized improvement plan, with the problem, file/line, fix and effort for each item |
| Constraints | Do NOT edit files; do NOT recommend CSS, UI or JS frameworks; the whole plan must fit in under 2 hours |

# Design-improvement plan for /frontend

I read all three files and changed nothing. There are 27 items, estimated at about 1 hr 55 min in total. P1 and P2 together take about 1 hr 25 min, and P3 is optional polish.

Effort: S is 5 minutes or less, M is 10–15 minutes. No item is L.

## P1: Accessibility defects (fix first, about 38 min)

| # | Problem | Location | Fix | Effort |
|---|---|---|---|---|
| A1 | Six identical "Event details" landmarks. A <section aria-label> becomes a region landmark, so screen-reader landmark lists show six entries with the same name. | script.js:131 | Remove aria-label. A <section> with no name is not a landmark, and the <article aria-labelledby> already names the card. | S |
| A2 | The whole catalog gets re-read after every registration. aria-live sits on a list that refresh() rebuilds completely. | index.html:36 | Remove aria-live. The form's status message already announces the result. | S |
| A3 | Label in Name fails (WCAG 2.5.3). The visible label "Show attendees for" has the accessible name "Filter attendees by event". The visible "Event" becomes "Choose an event". Voice-control users say what they see, so the command misses. | index.html:74, :92 | Make each aria-label start with its visible text: "Show attendees for" and "Event". | S |
| A4 | Double announcements. The aria-label repeats the help text that aria-describedby also reads ("…for example 2021-00123 … Format: 2021-00123"). | index.html:57, :66 | Shorten to aria-label="Student ID" and "University email", and let aria-describedby read the hint. Keep the aria-labels because the rubric requires them. | S |
| A5 | Six buttons all named "Register" (WCAG 2.4.6 and 2.4.9). In a list of buttons they can't be told apart. | script.js:120-125 | Add a visually hidden span, " for {title}", so the name starts with "Register" and passes 2.5.3. | S |
| A6 | The skip link's focus ring fails contrast (WCAG 1.4.11). The royal outline lands on the navy header at about 1.5:1. | styles.css:51-62 | Add .skip-link:focus-visible { outline-color: var(--pale); }. Pale on navy is 8.49:1. | S |
| A7 | Keyboard users can't scroll the table sideways. The overflow-x container can't receive focus, and Safari doesn't make it focusable. | index.html:97 | Add tabindex="0" role="region" aria-labelledby="attendee-caption" to the wrapper. | S |
| A8 | iPhone users can't type a valid student ID. inputmode="numeric" shows a keypad with no - key. | index.html:56 | Remove inputmode, or keep it and insert the dash automatically after 4 digits. | S |
| A9 | A full event is shown as a disabled button. Keyboard users skip over disabled buttons, and it looks like an outlined secondary button. | script.js:120-126, styles.css:202-207 | When seats reach 0, render a non-interactive "Fully booked" badge (a <p> in the error color) instead of a button. | S |
| A10 | The .visually-hidden class is incomplete. It is missing margin:-1px; padding:0; border:0; clip-path:inset(50%). | styles.css:43-49 | Use the standard full recipe. | S |
| A11 | Silent change after clicking Register on a card. Focus jumps to the Name field, but nothing announces which event was selected. | script.js:193-197 | Write "Selected: {title}. Enter your details." into the status message. | S |
| A12 | Empty table with headers and "(0 attendees)" appears next to "No registrations yet". | script.js:189-190 | Hide the table wrapper when there are no rows; show only the message. | S |
| A13 | Image of text (WCAG 1.4.5). The category exists only as text drawn inside the SVG banner. | script.js:66-75, :130 | Show the category as a real text chip and remove it from the SVG. Trade-off: WCAG says the banner then becomes decorative (alt=""), but the rubric wants alt text. Keep a short alt such as "Career event illustration". | S |

## P2: High-impact UX (about 45 min)

| # | Problem | Location | Fix | Effort |
|---|---|---|---|---|
| V1 | Headings say the same thing twice. "Upcoming campus events" (h1) is followed immediately by "Event catalog" (h2). | index.html:29-37 | Turn the intro into a short hero: h1, subtitle and a "Browse events" link. Rename the h2 to "Event catalog (6)". | S |
| V2 | The date is hard to scan. It sits in a gray list with the venue, so every card looks the same. | script.js:133-136, styles.css:156-171 | Add a date block (large day, short month) over the image's top-left corner, still using <time datetime>. Add visually hidden "Date:" and "Venue:" labels. | M |
| V3 | Seat availability is text only, so a low-seat event doesn't stand out. | script.js:139, styles.css:183-184 | Add a thin fill bar (royal on pale, aria-hidden) beside the existing text. At 5 seats or fewer, change the text to "Only 3 seats left" in the error color, so the text carries the meaning as well as the color. | M |
| F1 | Awkward form layout. The auto-fit, minmax(240px) grid puts 4 fields in one row on desktop and leaves a 3+1 orphan at mid widths. | styles.css:210-217 | Use 1 column by default and repeat(2, 1fr) from 40rem. Move Event first so a preselected event is visible at the top. | S |
| F2 | Errors only update on submit. A red field stays red after the user fixes it. | script.js:199-232 | After the first submit, re-check each field on blur and input with the existing validateRegistration and update that field only. | M |

## P3: Polish (about 30 min, optional)

| # | Problem | Location | Fix | Effort |
|---|---|---|---|---|
| T1 | Font sizes and spacing are ad hoc. Sizes include 0.8, 0.9, 0.95, 1.1 and 1.15rem; spacing includes 0.3, 0.55, 0.6, 0.65, 1.1 and 1.2rem, plus a -0.5rem hack on .hint. | styles.css:2-16, :122-127, :221 | Add --fs-sm/base/lg/xl and a spacing scale --space-1…6 (4, 8, 12, 16, 24, 32px) and replace the literal values. | M |
| T2 | Long text lines in the intro and descriptions on wide screens. | styles.css:127, :173 | Add max-width: 65ch and text-wrap: balance on headings. | S |
| C1 | Panels barely stand out from the page (white on ice blue with a faint shadow). | styles.css:129-134 | Add border-top: 4px solid var(--royal) to .panel. This stays within the palette. | S |
| C2 | Buttons have no pressed state. | styles.css:201 | Add .btn:active { background: var(--navy); }. White on navy is 10.36:1. | S |
| K1 | Cards give no hover or focus feedback. | styles.css:146-154 | On :hover and :focus-within, raise the shadow and add translateY(-2px). The existing reduced-motion rule already turns the movement off. | S |
| K2 | Card footers get cramped. On 260px cards the seat text and button squeeze together. | styles.css:175-181 | Add flex-wrap: wrap, and make the button full-width when it wraps. | S |
| F3 | The success message stays while the next person fills in the form. | script.js:246-247 | Clear the status message on the form's first input event. | S |
| AD1 | Admin table is hard to read. Numbers don't line up, there are no row stripes, and the header scrolls away. | styles.css:267-271 | Add font-variant-numeric: tabular-nums, tbody tr:nth-child(even) striping in ice blue, and a sticky thead th. | S |
| AD2 | The "Registered" dates are long ("Wed, Oct 14, 2026, 9:05 AM") and widen the table. | script.js:60-64, :185 | Add a short format ("Oct 14, 9:05 AM") for the table only. | S |
| AD3 | The admin view is public because there is no login. | index.html:87-88 | Change the "Admin" tag to "Admin · demo, no login". Real authentication belongs to the backend and is out of scope. | S |

## What already passes

- All colors meet AA or better.
- Buttons and inputs are at least 44px tall.
- Focus outlines are always visible.
- The skip link works.
- User input is inserted as plain text, so the form can't inject HTML.
- The table has a <caption> and scope on its headers.
- Reduced motion is respected.
- The form uses <fieldset> and <legend>.

## Left out to stay under 2 hours

- An error summary with links to each field.
- Per-event registration-count chips for admins.
- A stacked table layout on phones. This is risky because changing display on table elements removes table semantics in Safari. Horizontal scrolling is allowed for data tables under WCAG 1.4.10.

If you'd like this as a shareable page for your team, I can publish it.
```

#### Prompt 3 — AI Output

```text
RCTC for this prompt:

| Field | Content |
|---|---|
| Role / Persona | Design Systems Engineer specializing in accessible CSS |
| Context | /frontend/styles.css already has palette tokens with contrast notes; plain HTML/CSS/JS, no build step, WCAG AA required |
| Task | Add a type scale, a spacing scale, category accent colors, a dark theme that only redefines tokens, and 150–200ms hover/focus transitions |
| Constraints | Do NOT add fonts, CDNs or new files; do NOT use any pair below 4.5:1 for text or 3:1 for borders/focus rings, and list every ratio; keep reduced motion working; don't change HTML ids or JS |

I rewrote styles.css with the new type and spacing scales, category accent colors, a dark theme and hover/focus transitions. I checked all 55 color pairs with a script and every one meets its minimum. No HTML or JS changed and no new files were added. I haven't opened the page in a browser yet, so the dark theme hasn't been checked by eye.

What changed:
- Named color roles. The styles now use role tokens such as --color-text, --color-btn and --color-focus, which point at your palette. That way the dark theme only swaps token values and doesn't touch a single rule. No color codes appear outside the token blocks.
- Type scale. --fs-sm to --fs-3xl use a 1.2 ratio from a 16px base: 13.3px, 16px, 19.2px, 23px, 27.6px, 33.2px and 39.8px.
- Spacing scale. --space-1 to --space-8 are 4, 8, 12, 16, 20, 24, 32 and 48px. The leftover rem values are layout sizes, not spacing: widths of 72, 36 and 22rem, the skip link's hidden position of -4rem, and one term in the h1's size formula.
- Dark theme. It sits under @media (prefers-color-scheme: dark), changes only tokens, and sets color-scheme: dark so form controls and scrollbars follow.
- Transitions. Links, buttons, inputs, table rows and cards animate over 180ms. Buttons get a pressed state and cards lift slightly on hover or focus. Focus outlines are not animated, so they appear instantly. The reduced-motion block now also sets the duration to 0 and turns off the card lift.

One thing doesn't show yet: the category accent colors. They're defined and ready, but no element uses them. The styles apply to elements with a data-category attribute, and the cards don't have one because that would mean editing script.js, which you ruled out. A one-line change to set data-category on each card would turn them on. For the same reason, the banner images keep their navy colors in dark mode, since they're drawn inside script.js.

Contrast ratios (text needs 4.5:1, borders and focus rings need 3:1):

| Pair | Light | Dark |
|---|---|---|
| Body text on card/form background | 17.85 | 13.35 |
| Body text on page background | 16.40 | 16.30 |
| Muted text on card / on page | 7.58 / 6.96 | 9.85 / 12.02 |
| Link on card, link hover | 6.70, 8.72 | 8.11, 10.30 (9.90 on page) |
| Button text: normal / hover / pressed | 6.70 / 8.72 / 10.36 | 9.90 / 12.56 / 14.63 |
| White text on header | 10.36 | 14.69 |
| Pale text on header | 8.49 | 12.04 |
| Error text, success text | 6.47, 5.02 | 7.71, 10.42 |
| Focus ring on card / page / header | 6.70 / 6.16 / 8.49 | 8.11 / 9.90 / 12.04 |
| Input border, invalid border | 7.58, 6.47 | 5.71, 7.71 |
| Career accent | 5.02 | 10.15 (dark text on it: 12.38) |
| Workshop accent | 7.10 | 7.92 (9.67) |
| Sports accent | 5.47 | 9.89 (12.07) |
| Seminar accent | 7.90 | 7.34 (8.96) |
| Culture accent | 6.04 | 8.07 (9.84) |
| Academic accent | 5.93 | 8.77 (10.71) |

The light-mode accent ratios work both ways: accent text on white, or white text on the accent.

Two things are exempt and have no minimum:
- Table row lines (--color-divider) are decorative, not borders that show where a control is.
- The disabled button is exempt from contrast rules, though its text still reaches 7.58:1 in light mode and 9.85:1 in dark.

To see the dark theme, turn on dark mode in your OS, or in Chrome DevTools use Rendering → "Emulate CSS prefers-color-scheme: dark".
```

#### Prompt 4 — AI Output

```text
RCTC for this prompt:

| Field | Content |
|---|---|
| Role / Persona | UI Engineer specializing in accessible card layouts and filtering |
| Context | renderEvents() builds <article> cards with el(); SVG banner from bannerImage(); mock EVENTS array |
| Task | Category-colored banners and a date badge, a <meter> capacity bar with a "Few seats left" badge, search and category filters with a live count, the landmark fix, an empty state, and docs updates |
| Constraints | Do NOT use innerHTML with event data; every new control has a visible label and an aria-label containing it; do NOT change the EVENTS shape or the exports; keep alt text meaningful |

I made all five changes to the event cards and updated both docs files. I tested the page in headless Edge, in light and dark mode.

What changed:
- Banners and date badge. Each banner is drawn in its category's accent color. The color is read from the CSS tokens, so it switches with light/dark mode. The category name is no longer drawn inside the image. It is now a real text chip in the top-right corner, and a calendar-style month/day badge sits top-left. Screen readers skip the badge, because the card's date line already reads the full date.
- Capacity bar. Each card has a native <meter> under the "X of Y seats left" text. That text is now the meter's visible <label>. The bar turns red and a "Few seats left" badge appears when fewer than 20% of seats remain.
- Search and category filters. A search box and one toggle button per category, plus "All", sit above the grid. Selecting several categories shows events from any of them. A polite live region reads "Showing N events". While you type, it waits 400ms so it doesn't announce on every keystroke. Pressed buttons get a ✓, so the state isn't shown by color alone. Focus stays on the button you pressed.
- Landmark fix. The card's inner <section> no longer has an aria-label, so it is no longer a region landmark. I also removed aria-live from the grid. Filtering rebuilds the grid, so screen readers would have re-read every card.
- Empty state. When nothing matches, a message replaces the grid and names the search and categories used. A "Clear filters" button resets everything and returns focus to the search box.

The changes are in index.html, script.js and styles.css. Everything is still built with el() and textContent, and EVENTS and the exports are unchanged. Every new control's aria-label starts with its visible text: "Search events…", "Career events", "Clear filters and show all events", and "5 of 30 seats left for Generative AI Workshop" on the meters.

Tested in headless Edge, with 25 of the 30 Workshop seats pre-registered:
- No card sections are exposed as landmarks, and every meter has a label.
- Only the Workshop card shows "Few seats left".
- Searching "lab" shows 1 card immediately and announces "Showing 1 event" after the delay.
- Career + Sports shows 2 cards, and focus stays on the pressed button.
- Searching "zzz" shows the empty state. "Clear filters" brings back all 6 and focuses the search box.
- Every new color pair passes: meter fills 5.95–9.90:1, the pressed "All" button 6.70:1 light and 9.90:1 dark.

Headless Edge won't go narrower than 481px, so I checked phone layout there. Nothing overflows and the filter buttons wrap. A true 400px check still needs a real browser.

Docs:
- docs/prompts.md: added this prompt as row 4 in both tables, with this output.
- docs/verification-logs.md: the duplicate-landmark row is now "Applied". I added two more applied rows: the grid's aria-live and the category drawn as image text. That makes 5 applied corrections. The other 3 audit findings are still "Not yet applied".

With the default data you won't see "Few seats left", because no event starts below 20% of its seats. To see it, register 25 people for the Workshop, as in my test.
```

### 3. Manual Grounding Evaluation

**Evaluation:**

[Write a 3–4 sentence evaluation verifying whether the AI-generated architecture is realistic for a 3-hour team prototype. Discuss the feasibility of the proposed architecture, technologies, features, and implementation scope.]
