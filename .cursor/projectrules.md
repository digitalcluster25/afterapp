# Project Rules

## Core Principles

1. **Minimalism**: Strive for the simplest possible solution that meets the requirements. Avoid over-engineering.
2. **Quality**: Ensure code is clean, readable, maintainable, and well-tested.
3. **Adherence to Instructions**: Strictly follow all user instructions. Do not deviate or add functionality not explicitly requested.
4. **Shadcn/ui First**: Prioritize `shadcn/ui` components for UI elements. Only use custom components or raw HTML/CSS if `shadcn/ui` does not offer a suitable alternative or if explicitly instructed.

## Critical Operational Rules (Added after incident)

1. **Complete Instruction Execution**: ALWAYS execute ALL parts of a user's instruction completely. If an instruction involves multiple changes (e.g., "rename X to Y and remove Z"), ensure every part is addressed.
2. **Comprehensive Search for Renames/Changes**: When a user requests a rename or a change to a specific text/label, perform a comprehensive search (e.g., `grep -r "old_text" .`) across the entire codebase to identify ALL occurrences (e.g., page titles, navigation items, descriptions, content).
3. **Full Verification**: Before confirming completion, thoroughly verify that all aspects of the request have been implemented and that no unintended side effects have occurred.
4. **No Partial Implementation**: Avoid committing or reporting completion if any part of the instruction is pending or partially implemented.

## UI/UX Design Rules

### Component Library
- **ONLY use shadcn/ui library** for all UI components and elements
- Do not create custom components when shadcn/ui equivalents exist
- Use shadcn/ui MCP server for adding new components: `npx shadcn@latest add @shadcn/component-name`
- When shadcn/ui doesn't provide a specific component, use Tailwind CSS utilities for styling

### Color Scheme
- **Grayscale color palette ONLY** for the entire interface
- Use only shades of gray, black, and white
- Apply grayscale colors to ALL elements including:
  - Text and typography
  - Backgrounds and surfaces
  - Borders and dividers
  - Buttons and interactive elements
  - Icons and graphics
  - Charts and data visualizations
- No colored elements (no blues, greens, reds, etc.) except for semantic meanings (success/error states)
- Icons must be black, white, or grayscale only

### Visual Design
- Clean, minimalist aesthetic
- Consistent spacing and typography
- Smooth, gentle animations (fade, contour, background animations)
- No shadows for animations
- Sans-serif fonts (similar to Helvetica Pro)
- Professional, modern appearance
