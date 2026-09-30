# Task 5: Group Integration & Verification Report

## Group Verification Log

Document instances where the team **manually corrected or refined AI-generated output** to address errors, security flaws, missing requirements, or bad practices.

| Task # | Identified AI Flaw / Limitation | Manual Correction Applied | Member Responsible |
|--------|---------------------------------|---------------------------|--------------------|
| Task 1 | [Describe an error, limitation, or unrealistic recommendation in the AI-generated system architecture.] | [Describe the manual correction or refinement made by the team.] | [Member #] |
| Task 2 | The Prompt 1 stylesheet named its color tokens after colors (`--white`, `--navy`, `--royal`). A dark theme would have had to set `--white` to a dark color, which is misleading and hard to maintain. | **Applied (Prompt 3).** Added role tokens (`--color-surface`, `--color-text`, `--color-btn`, `--color-focus` …) that map to the palette, and changed every rule to use them. The dark theme now changes token values only. A grep confirmed no color codes remain outside the token blocks. | Member 2 |
| Task 2 | Prompt 3 had to add a card "lift" on hover. The Prompt 1 reduced-motion block only turned off transitions, so the card would still jump 2px for users who asked for reduced motion. | **Applied (Prompt 3).** Extended the `prefers-reduced-motion` block to set `--duration: 0ms` and `transform: none` on card hover/focus. | Member 2 |
| Task 2 | The Prompt 1 output had no contrast check for the skip link's focus ring. Its royal-blue outline (#1D4ED8) sits on the navy header (#1E3A8A) at **1.54:1**, below the WCAG 1.4.11 minimum of 3:1. Found in the Prompt 2 audit. | **Not yet applied.** Planned fix: `.skip-link:focus-visible { outline-color: var(--color-focus-on-header); }` (8.49:1 light, 12.04:1 dark). | Member 2 |
| Task 2 | The Prompt 1 output wrapped each card body in `<section aria-label="Event details">`, which creates **six region landmarks with the same name**. Found in the Prompt 2 audit. | **Applied (Prompt 4).** Removed the `aria-label`, so the inner `<section>` has no accessible name and is not a landmark; the `<article aria-labelledby>` still names each card. A headless Edge check found 0 named sections inside cards. | Member 2 |
| Task 2 | The Prompt 1 output put `aria-live="polite"` on the event grid. The grid is rebuilt on every registration, and filtering (Prompt 4) would rebuild it on every keystroke, so screen readers would re-read every card. Found in the Prompt 2 audit. | **Applied (Prompt 4).** Removed `aria-live` from the grid. Changes are now announced by one short live region ("Showing N events"), delayed 400ms while typing. | Member 2 |
| Task 2 | The Prompt 1 banner drew the event category as text inside the SVG image (an image of text, WCAG 1.4.5), so it could not be resized, recolored or found with search. Found in the Prompt 2 audit. | **Applied (Prompt 4).** Removed the text from the SVG and show the category as a real HTML chip on the banner. Alt text now describes the image ("Illustrated banner for {title}, a {category} event"). | Member 2 |
| Task 2 | The Prompt 1 output gave the inputs `aria-label`s that don't match their visible labels (visible "Show attendees for" vs. accessible name "Filter attendees by event"), which fails WCAG 2.5.3 Label in Name. It also repeated help text that `aria-describedby` already reads. | **Not yet applied.** Planned fix: make each `aria-label` start with its visible label text (`index.html:57, 66, 74, 92`). | Member 2 |
| Task 2 | The Prompt 1 output set `inputmode="numeric"` on the Student ID field. The iOS number keypad has no `-` key, so iPhone users can't type the required format `2021-00123`. | **Not yet applied.** Planned fix: remove `inputmode` in `index.html:56`. | Member 2 |
| Task 3 | The initial AI schema draft omitted non-clustered indexes on foreign key columns and lacked a composite UNIQUE constraint on (UserId, EventId) to enforce single registration per event at the database level. | **Applied (Prompt 6).** Added explicit non-clustered indexes (`IX_Users_RoleId`, `IX_Events_VenueId`, `IX_Registrations_UserId`, `IX_Registrations_EventId`) and the composite unique constraint `UQ_Registrations_UserId_EventId`. | Member 3 |
| Task 4 | [Example: AI refactored the database code without properly disposing of the connection.] | [Example: Added using statements to ensure proper resource disposal.] | [Member #] |

## Verification Notes

**Task 2 (Member 2):**

- **Validation logic:** `validateRegistration` was run in Node against valid input, empty fields, a bad student ID, a non-university email, a trick address (`x@evil.com@univ.edu.ph`), a full event and a duplicate registration. Every case returned the expected error or passed.
- **Color contrast:** every text, border and focus-ring color pair in the light and dark themes (55 pairs) was checked with a script using the WCAG relative-luminance formula. All meet 4.5:1 for text and 3:1 for UI borders and focus rings; the ratios are listed in `docs/prompts.md`, Prompt 3 output.
- **Token refactor:** a grep confirmed no raw hex colors remain outside the `:root` token blocks in `styles.css`.
- **Cards and filters (Prompt 4):** a copy of the page was driven in headless Microsoft Edge with a test script. It confirmed that no card sections are exposed as landmarks, that every `<meter>` has a label, that "Few seats left" appears only below 20% of seats, that search and category filters show the right cards and announce "Showing N events", that focus stays on the pressed filter button, and that the empty state and "Clear filters" work. Screenshots were checked in light and dark mode. The new color pairs (meter fills, date badge, pressed buttons) were added to the contrast script and all pass.
- **Still to do:** the three "Not yet applied" rows above must be fixed and then re-checked with a Chrome Lighthouse Accessibility audit and a keyboard-only pass before submission.

**Task 3 (Member 3 - Harvey):**

- **Schema Normalization (3NF):** Verified that all 5 tables satisfy 1NF (atomic columns, primary keys), 2NF (full functional dependency on primary keys), and 3NF (no transitive dependencies; venues and roles isolated to lookup tables; no derived seat counts stored).
- **Referential Integrity & Indexes:** Verified that all foreign keys have non-clustered indexes to prevent table scans during JOIN operations. Cascade deletion configured safely for user registrations.
- **Business Rule Constraints:** Verified CHECK constraints enforce `@univ.edu.ph` email domains, valid student ID format `YYYY-NNNNN`, positive max capacities, and confirmed status domains. Composite unique constraint `(UserId, EventId)` prevents duplicate student registration.
- **Query Verification:** Tested administrative attendee lookup query with explicit column projection and INNER JOINs across `Registrations`, `Events`, `Users`, and `Venues`.

