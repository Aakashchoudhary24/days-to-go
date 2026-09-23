# days-to — Build Specification

## 1. Product

**Name:** days-to

**Type:** Minimal web app for creating, maintaining, and monitoring multiple countdowns to personal deadlines.

### Core idea

days-to answers one question:

> **How many days do I have left?**

A countdown can represent anything with a meaningful date:

- fitness goal
- wedding
- semester end
- job preparation deadline
- exam
- trip
- personal milestone
- project deadline
- arbitrary goal

The product should feel like a **personal countdown instrument**, not a task manager or productivity dashboard.

The user's attention should go primarily to the remaining time.

---

# 2. Primary User Flow

There are two major states.

### Empty state

When the user has no countdowns:

1. Open the app.
2. Immediately see the countdown creation flow.
3. Enter a goal name.
4. Select a deadline.
5. Select a priority.
6. Create the countdown.
7. Transition directly into the main countdown stage.

Do not show an empty dashboard first.

### Existing countdowns

When countdowns exist:

1. Open the app.
2. Show the primary/pinned countdown stage.
3. User can select countdowns from the task rail.
4. User can pin/unpin countdowns.
5. Up to 4 countdowns may be displayed simultaneously.
6. User can create, edit, archive/delete countdowns.

---

# 3. Design Philosophy

## Core principle

**Minimal as fuck.**

days-to should feel like a physical digital instrument:

- quiet
- precise
- typographic
- high contrast
- spacious
- architectural
- slightly futuristic without looking sci-fi

Think:

**Swiss typography + digital clock + personal deadline instrument.**

Do NOT make it look like:

- Notion
- Linear
- Trello
- Asana
- generic SaaS dashboard
- generic shadcn admin panel
- colorful productivity app
- card-heavy task manager

The countdown itself is the product.

---

# 4. Visual Language

## Color

Initial palette must be monochrome.

Primary:

```text
#000000
#FFFFFF
```

Supporting grayscale may be used for hierarchy:

```text
#111111
#222222
#666666
#999999
#CCCCCC
#EEEEEE
```

Do not introduce colored priority indicators.

Do not use:

- gradients
- colorful shadows
- neon accents
- glassmorphism
- unnecessary decorative backgrounds

Priority should be communicated through typography, opacity, weight, or a very subtle geometric indicator.

---

# 5. Typography

Typography is one of the primary design elements.

Use a modern sans-serif for the interface.

Preferred choices:

- Inter
- Geist
- system sans-serif fallback

Use a monospace font for the large countdown number if it creates a convincing digital-instrument feeling.

Possible choices:

- Geist Mono
- IBM Plex Mono
- JetBrains Mono

Do not use many font families.

Recommended:

```text
UI → Geist / Inter
Countdown numbers → Geist Mono / IBM Plex Mono
```

---

# 6. Layout

The application should occupy the entire viewport.

Desktop structure:

```text
┌───────────────────────────────────────────────────────────────┐
│ days-to                                           +    ○       │
│                                                               │
│                                                               │
│                                                               │
│                       MAIN STAGE                              │
│                                                               │
│                                                               │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

When multiple countdowns exist, a minimal vertical task rail may appear along the left side.

The rail is navigation, not a traditional sidebar.

The central stage is the primary experience.

---

# 7. Header

Keep the header extremely minimal.

Top-left:

```text
days-to
```

Top-right:

```text
+
○
```

Where:

- `+` = create countdown
- `○` = settings/preferences

Do not build a conventional navigation bar.

Avoid:

- hamburger menus on desktop
- large logo areas
- account-heavy headers
- navigation links that aren't necessary

The app should feel almost borderless.

---

# 8. Empty State / Creation Flow

When there are zero countdowns, immediately present the creation flow.

Do NOT display:

```text
No tasks yet
Create your first task
```

Instead, make the creation flow itself the page.

Conceptually:

```text
What are you working toward?

[ Get in shape                         ]


When does it end?

[ 24 December 2026                    ]


How important is it?

LOW       MEDIUM       HIGH


                         →
```

The flow should feel like a conversation with the interface rather than a large form.

## Fields

### Goal name

Required.

Examples:

```text
Get in shape
Semester ends
Prepare for placements
Wedding
Launch project
```

### Deadline

Required.

Use a native date input or a clean custom date picker.

The selected date should be extremely clear.

### Priority

Optional.

Values:

```text
LOW
MEDIUM
HIGH
```

Default:

```text
MEDIUM
```

Do not use red/yellow/green priority colors.

---

# 9. Countdown Stage

Once a countdown exists, the main stage should prioritize the remaining days.

Example:

```text
                         GET IN SHAPE


                              93


                          DAYS TO GO


                       21 : 14 : 07 : 32


                       24 DECEMBER 2026
```

Hierarchy:

1. Remaining day count
2. `DAYS TO GO`
3. live countdown
4. deadline
5. goal name
6. metadata

The number should be extremely large.

Use responsive sizing:

```css
font-size: clamp(...);
```

Do not use arbitrary fixed desktop sizes.

The remaining-day number should visually dominate the viewport.

---

# 10. Countdown Calculation

The app must calculate the remaining time from the user's deadline.

Use the user's local timezone.

The countdown should update live without requiring a page refresh.

Display:

```text
X DAYS TO GO
```

and a secondary live countdown such as:

```text
21 : 14 : 07 : 32
```

The exact secondary format may be:

```text
DD : HH : MM : SS
```

or, when days are already represented separately:

```text
HH : MM : SS
```

Choose whichever creates the cleanest visual hierarchy.

Do not allow the secondary clock to visually overpower the primary day count.

---

# 11. Deadline States

The countdown should have meaningful states.

## Normal

More than 30 days remaining.

Normal presentation.

## Approaching

30 days or fewer.

Subtle increase in visual urgency.

Do NOT immediately introduce bright warning colors.

## Final week

7 days or fewer.

The countdown becomes more visually prominent.

## Less than 24 hours

Prioritize the live clock.

For example:

```text
23 : 41 : 07 : 32
```

The interface should communicate that the deadline is imminent.

## Deadline day

```text
0

TODAY
```

## Past deadline

Do not simply say "completed."

Example:

```text
+1

DAY LATE
```

or:

```text
0

DEADLINE PASSED
```

Choose the state based on whether the countdown represents an ongoing goal or a completed event.

The implementation should keep the state system extensible.

---

# 12. Multiple Countdown Rail

When more than one countdown exists, display a minimal vertical rail on desktop.

The rail should not resemble a traditional dashboard sidebar.

Each countdown can be represented compactly:

```text
GET IN SHAPE
93D
```

or an even more minimal representation.

The selected countdown should be visually obvious through:

- typography
- opacity
- border
- inversion
- subtle indicator

Do not use colorful selected states.

The rail should remain secondary to the stage.

---

# 13. Pinning

Users can pin countdowns to the main stage.

Maximum:

```text
4
```

Pinned countdowns are displayed simultaneously.

Important:

**Pinned countdowns are not cards.**

They are sections of a single visual canvas.

---

# 14. Stage Layout Rules

## One pinned countdown

Use the entire stage.

```text
┌────────────────────────────────┐
│                                │
│              93                │
│                                │
│          DAYS TO GO            │
│                                │
└────────────────────────────────┘
```

## Two pinned countdowns

Split horizontally.

```text
┌──────────────────┬──────────────────┐
│                  │                  │
│       93         │       47         │
│                  │                  │
│    DAYS TO GO    │    DAYS TO GO    │
│                  │                  │
└──────────────────┴──────────────────┘
```

## Three pinned countdowns

Use an adaptive asymmetric layout.

Example:

```text
┌──────────────────────┬───────────────┐
│                      │               │
│         93           │      47       │
│                      │               │
├──────────────────────┤               │
│                      │               │
│         21           │               │
│                      │               │
└──────────────────────┴───────────────┘
```

The exact arrangement may be optimized during implementation.

## Four pinned countdowns

2x2 grid.

```text
┌──────────────────┬──────────────────┐
│                  │                  │
│       93         │       47         │
│                  │                  │
├──────────────────┼──────────────────┤
│                  │                  │
│       21         │        8         │
│                  │                  │
└──────────────────┴──────────────────┘
```

All four sections belong visually to one canvas.

---

# 15. Mobile Layout

The application must be fully responsive.

On mobile:

- remove the desktop vertical rail
- convert countdown navigation into a horizontal bottom selector/carousel
- preserve the giant countdown typography
- preserve whitespace
- never squeeze four countdowns into an unreadable grid

Example:

```text
┌──────────────────────┐
│ days-to           +  │
│                      │
│                      │
│        93            │
│                      │
│     DAYS TO GO       │
│                      │
│  GET IN SHAPE        │
│                      │
│──────────────────────│
│  93    47    21    8 │
└──────────────────────┘
```

For four pinned countdowns on a narrow screen, it is acceptable to stack them vertically rather than preserving the desktop grid.

---

# 16. Animation

Use motion sparingly.

Preferred behavior:

### Creating a countdown

Subtle transition from creation flow into countdown stage.

Example:

```text
opacity: 0 → 1
transform: scale(0.97) → scale(1)
```

Keep it fast and understated.

### Switching countdown

Avoid large page transitions.

The content should transition/morph smoothly.

### Pinning/unpinning

The stage layout should animate smoothly when moving between:

```text
1 → 2 → 3 → 4
```

countdowns.

This is an important place for layout animation.

If using Framer Motion / Motion, use it only where it adds real spatial continuity.

Avoid:

- bouncing
- excessive spring physics
- parallax
- flashy entrance animations
- scroll-triggered decoration
- animated gradients

---

# 17. Interaction Design

A user should be able to:

- create a countdown
- view a countdown
- switch between countdowns
- pin a countdown
- unpin a countdown
- edit a countdown
- delete/archive a countdown
- change priority
- change deadline
- create multiple countdowns

Keyboard shortcuts can be added if they don't complicate the UI.

Potential shortcuts:

```text
N → new countdown
P → pin/unpin selected countdown
ESC → close overlay
```

Do not expose keyboard shortcuts prominently unless useful.

---

# 18. Editing

Editing should not turn the application into a form-heavy dashboard.

Use a small focused panel/modal/sheet.

Editable properties:

- goal name
- deadline
- priority

Avoid adding unnecessary fields.

---

# 19. Persistence

For the first version, persistence can be client-side.

Preferred:

```text
localStorage
```

or another simple browser-local persistence mechanism.

The app should survive:

- refresh
- browser restart

Data model should be designed so a backend can be added later without rewriting the UI.

Suggested conceptual model:

```ts
type Priority = "low" | "medium" | "high";

type Countdown = {
  id: string;
  name: string;
  deadline: string;
  priority: Priority;
  createdAt: string;
  archived?: boolean;
};
```

Pinned IDs can be stored separately.

Maximum four pinned countdowns.

---

# 20. Accessibility

The minimal design must still be accessible.

Requirements:

- keyboard navigation
- visible focus states
- semantic HTML
- proper labels
- buttons must have accessible names
- sufficient contrast
- date picker accessible by keyboard
- no interaction should depend exclusively on hover
- reduced-motion preference should be respected

Do not sacrifice usability for minimalism.

---

# 21. Technical Direction

Use the existing project's stack if already established.

If starting from scratch, prefer:

```text
Next.js
TypeScript
Tailwind CSS
```

Use modern React patterns.

Avoid unnecessary dependencies.

Suggested dependencies only when justified:

- Motion / Framer Motion for layout transitions
- date-fns for date calculations

Do not install a large UI component library just to build this interface.

If shadcn/ui is already installed, use only components that genuinely help.

The final interface should NOT look like default shadcn.

---

# 22. Component Architecture

Keep components composable.

Possible structure:

```text
app/
  page.tsx

components/
  app-shell/
  countdown-stage/
  countdown-tile/
  countdown-rail/
  countdown-creator/
  countdown-editor/
  date-picker/
  priority-selector/
  header/
  empty-state/

lib/
  countdown/
    calculations.ts
    storage.ts
    types.ts
```

Do not blindly follow this structure if the existing project has a better architecture.

The important separation is:

- state/data
- countdown calculations
- persistence
- stage layout
- individual countdown presentation
- creation/editing UI

---

# 23. State Model

At minimum track:

```text
countdowns
selectedCountdownId
pinnedCountdownIds
creationFlowOpen
editingCountdownId
```

Derived state:

```text
remainingTime
countdownStatus
numberOfPinnedCountdowns
```

Do not duplicate derived countdown values in persistent storage.

Calculate remaining time from the deadline.

---

# 24. Error / Edge Cases

Handle:

- deadline in the past
- deadline equal to today
- invalid date
- empty goal name
- duplicate names
- deleting the currently selected countdown
- deleting a pinned countdown
- more than four pinned countdowns
- browser storage unavailable
- timezone differences
- page refresh while countdown is running

If the user tries to pin a fifth countdown:

```text
Maximum 4 countdowns on stage
```

Keep this message subtle.

---

# 25. Date Semantics

Be explicit about what "days to go" means.

The primary display should represent **calendar days remaining**, while the secondary clock represents the exact time remaining.

Example:

If the deadline is tomorrow, show:

```text
1

DAY TO GO
```

even if only a few hours remain.

When fewer than 24 hours remain, the exact clock becomes the dominant secondary indicator.

Avoid off-by-one errors caused by naive millisecond division.

Use local calendar semantics for the day count and exact timestamp arithmetic for the live timer.

---

# 26. Design Details

## Borders

Use borders sparingly.

A 1px black/gray border can define stage divisions when multiple countdowns are pinned.

Do not wrap every component in a rounded card.

## Radius

Prefer:

```text
0px
```

or very small radius.

Avoid:

```text
rounded-2xl
rounded-3xl
```

everywhere.

## Shadows

Avoid shadows almost entirely.

## Spacing

Use generous whitespace.

The interface should breathe.

## Icons

Use icons only where they communicate an action.

Avoid decorative iconography.

A simple `+` is preferable to a giant "Add Countdown" button.

---

# 27. Design Don'ts

Never introduce these unless there is a compelling functional reason:

- gradients
- glassmorphism
- colorful backgrounds
- huge rounded cards
- excessive shadows
- dashboard sidebars
- charts
- progress bars
- gamification
- streak counters unrelated to deadlines
- badges everywhere
- excessive icons
- decorative illustrations
- stock imagery
- unnecessary onboarding screens
- excessive modals
- generic SaaS copy
- giant CTA buttons
- excessive animations

---

# 28. Copy / Tone

Interface copy should be short.

Prefer:

```text
What are you working toward?
```

over:

```text
Let's get started by creating your first goal!
```

Prefer:

```text
When does it end?
```

over:

```text
Please select the date by which you want to complete this goal.
```

Prefer:

```text
DAYS TO GO
```

over:

```text
Number of days remaining until your selected deadline
```

The application should feel confident and quiet.

---

# 29. Initial Screens to Build

Build these states first.

## Screen A — Empty

```text
days-to


What are you working toward?

[ Get in shape ]


When does it end?

[ 24 December 2026 ]


LOW    MEDIUM    HIGH


                         →
```

## Screen B — One countdown

```text
days-to                                      +


                     GET IN SHAPE


                          93


                      DAYS TO GO


                    21 : 14 : 07


                    24 DEC 2026
```

## Screen C — Four countdowns

```text
days-to                                      +


┌──────────────────────┬──────────────────────┐
│                      │                      │
│         93           │         47           │
│                      │                      │
│      GET IN SHAPE    │    SEMESTER END      │
│                      │                      │
├──────────────────────┼──────────────────────┤
│                      │                      │
│         21           │          8           │
│                      │                      │
│    JOB PREPARATION   │       WEDDING        │
│                      │                      │
└──────────────────────┴──────────────────────┘
```

These three screens establish most of the visual system.

---

# 30. Implementation Strategy

Do not try to build every feature at once.

Implement in this order:

### Phase 1 — Visual foundation

- global typography
- monochrome color system
- viewport layout
- header
- spacing system
- responsive behavior

### Phase 2 — Empty state

- creation flow
- date selection
- priority selection
- validation

### Phase 3 — Countdown engine

- date calculations
- live timer
- calendar day calculation
- deadline states

### Phase 4 — Single countdown stage

- giant number
- goal name
- deadline
- secondary timer

### Phase 5 — Persistence

- localStorage
- hydration-safe loading
- create/update/delete

### Phase 6 — Multiple countdowns

- countdown rail
- selection
- pinning
- maximum four

### Phase 7 — Adaptive stage

- 1 layout
- 2 layout
- 3 layout
- 4 layout
- animated transitions

### Phase 8 — Editing / polish

- edit flow
- archive/delete
- keyboard interactions
- accessibility
- reduced motion
- edge cases

---

# 31. Definition of Done

The implementation is successful when:

1. A brand-new user immediately understands what the app does.
2. Creating the first countdown requires almost no explanation.
3. The remaining number is visually dominant.
4. The interface does not look like a generic task manager.
5. A single countdown feels almost like a digital clock/instrument.
6. Multiple countdowns can coexist without becoming cluttered.
7. Four countdowns form one coherent visual canvas rather than four unrelated cards.
8. The interface works cleanly on desktop and mobile.
9. The countdown updates live.
10. Data survives page refresh.
11. No unnecessary visual decoration exists.
12. The monochrome aesthetic feels intentional rather than unfinished.
13. Motion is subtle and spatially meaningful.
14. The user can understand the entire application without reading documentation.

---

# 32. Important Agent Instructions

Before coding:

1. Inspect the existing repository.
2. Understand its current stack and architecture.
3. Do not replace working infrastructure unnecessarily.
4. Reuse existing utilities/components where appropriate.
5. Inspect existing global styles before introducing new ones.
6. Keep the implementation simple.

Before considering the task complete:

1. Run the application.
2. Test the empty state.
3. Create multiple countdowns.
4. Test one, two, three, and four pinned countdowns.
5. Refresh the browser and verify persistence.
6. Test deadlines in the past.
7. Test today's deadline.
8. Test a future deadline.
9. Test mobile viewport behavior.
10. Check keyboard accessibility.
11. Check for hydration/runtime errors.
12. Remove unused dependencies and code.
13. Ensure the UI remains visually minimal.

Do not stop at a functional prototype that looks like a default component-library application.

The visual hierarchy and typography are core product requirements.

---

# 33. Final Design North Star

When making a design decision, ask:

> **Does this make the remaining time clearer, calmer, or more meaningful?**

If not, it probably doesn't belong.

days-to should make opening the app feel like looking at a clock that represents something personally important.

The product is not the task list.

**The product is the remaining time.**
