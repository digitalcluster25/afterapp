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

## FATAL ERROR PREVENTION RULES (Added after critical incident)

1. **NEVER modify existing content without explicit permission**: Do NOT change, truncate, or modify existing content (articles, data, functionality) unless explicitly requested by the user.
2. **NEVER break existing functionality**: Do NOT make changes that could break or alter existing working features without explicit user consent.
3. **ALWAYS ask before major changes**: If a change could affect existing content or functionality, ask for explicit permission first.
4. **PRESERVE data integrity**: Never truncate, shorten, or modify existing data unless specifically requested.
5. **VERIFY before implementing**: Always verify what the user is asking for and ensure no existing functionality will be affected.

## DOCUMENTATION RULES (Added for project maintenance)

1. **Documentation as Single Source of Truth**: The `docs/` folder is the ONLY source of truth for project documentation. All project knowledge, specifications, and guidelines must be maintained in the `docs/` folder.

2. **Mandatory Documentation Updates**: Whenever ANY changes are made to project functionality or design, the corresponding documentation in the `docs/` folder MUST be updated immediately. This includes:
   - Changes to components or their behavior
   - UI/UX modifications or new design patterns
   - New features or functionality
   - Changes to data structures or APIs
   - Updates to project rules or guidelines

3. **Documentation Completeness**: Before marking any task as complete, verify that all relevant documentation has been updated to reflect the changes made.

4. **Documentation Structure**: Maintain the organized structure in `docs/` folder:
   - `PROJECT_DOCUMENTATION.md` - Main BRD documentation
   - `TECHNICAL_SPECIFICATION.md` - Technical details and architecture
   - `USER_SCENARIOS.md` - User flows and scenarios
   - `SETUP_INSTRUCTIONS.md` - Setup and deployment instructions
   - `DESIGN_SYSTEM.md` - Design system and styling rules
   - `README.md` - Documentation index

