# WORKFLOW.md

## Round 1: Vague Prompt.

**Prompt used:** "Build a settings form for user style preferences."

With zero context about the actual project — no mention of the stack, the
capstone niche, or existing conventions — the AI assumed everything itself.
It scaffolded its own standalone project from scratch (HTML, CSS, and
JavaScript, via Vite) instead of fitting into the Next.js + TypeScript
project already in progress. The form it produced was simple and worked,
but it had no real understanding of what it was actually building for: no
connection to the accessories niche, no validation logic beyond the basics,
and no tests. Functionally it ran, but the result was roughly a 90% mismatch
from the desired outcome — the AI wasn't wrong so much as it was building
blind, filling every gap with its own default assumptions.

## Round 2: Precise Prompt

**Prompt used:** A plan-mode prompt specifying the exact fields, The HTML, Vanilla CSS and React Stack, WCAG 2.1 AA accessibility constraints, and a
required verification step (write tests, run them, confirm they pass).

This round achieved the desired outcome. It followed the stack and
conventions strictly instead of inventing its own, validated every field
correctly, and produced a form that matched the actual project structure.
The AI also optimized the UI layout and made it responsive without being
asked in explicit detail — a sign that a well-scoped prompt gives the model
enough shared context to make good judgment calls on the parts left
unspecified. The form ran completely, validated correctly end-to-end, and
its logic was covered by passing tests.

**AI mistake caught:** During review, the belt size number input initially
failed to accept typed values or respond to the increment/decrement arrows,
even though the schema and component looked correct on the surface. The
underlying issue was a mismatch between the controlled input's `onChange`
handling and how the value was being validated, which caused the field to
reset before a valid number could register. This wasn't caught by the
AI's own test suite — the tests validated the schema logic in isolation
but didn't exercise the actual rendered input, so they passed while the
real form was still broken. Catching this required manually testing the
form in the browser, not just trusting the automated verification step.

## Takeaway

The gap between the two rounds wasn't just code quality — it was context.
Round 1 defaulted to the simplest thing it could imagine because it had
no idea what project it was even part of. Round 2 succeeded because the
prompt supplied both the constraints and a verification step, though that
verification step itself had a blind spot: passing tests didn't guarantee
a working UI. Precise prompting reduces guesswork, but it doesn't replace
manually confirming the result actually works.
