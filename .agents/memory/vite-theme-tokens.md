---
    name: Vite artifact theme tokens
    description: How react-vite scaffold theme colors are declared and consumed
    ---

    The react-vite scaffold's `src/index.css` declares CSS custom properties as raw HSL triplets without the `hsl()` wrapper, e.g. `--primary: 212 79% 24%;`, then consumes them elsewhere as `hsl(var(--primary))` (and with alpha via `hsl(var(--primary) / 0.5)`).

    **Why:** This lets Tailwind v4's alpha-modifier syntax work correctly. If you paste a hex code or `oklch()` value directly into the variable, the alpha-modifier syntax breaks silently (colors render wrong/transparent).

    **How to apply:** When porting an existing design's theme (hex/oklch based) into a react-vite artifact scaffold, convert every color to an `H S% L%` triplet before writing it into `index.css`. Don't skip the `.dark` block — placeholder `red` values ship there too.
    