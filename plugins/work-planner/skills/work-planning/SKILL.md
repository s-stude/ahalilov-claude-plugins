---
name: Work Planning
description: Comprehensive pre-implementation planning and codebase analysis. Use when the user asks to implement a feature, fix a bug, or make changes to code. This skill analyzes the user's request, explores the codebase to understand context and existing patterns, determines what needs to be implemented, and proposes a detailed plan before any code is written. Trigger phrases include "add feature", "implement", "create", "build", "fix bug", "refactor", or when starting any non-trivial code task.
version: 0.1.0
---

# Work Planning

## Overview

Work planning ensures successful implementation by creating comprehensive plans before writing code. This skill systematically analyzes user requests, explores codebases, and proposes detailed implementation strategies that align with existing patterns and project standards.

**Core principle**: Plan before you code. Understanding the landscape prevents false starts and ensures changes integrate smoothly.

## When to Use Work Planning

Use this skill for non-trivial implementation tasks:

1. **Feature additions**: Adding meaningful new functionality
2. **Bug investigations**: Understanding and fixing complex issues
3. **Refactoring tasks**: Restructuring code architecture
4. **Integration work**: Connecting new services or APIs
5. **Multi-file changes**: Tasks affecting multiple components
6. **Architectural decisions**: Choosing between implementation approaches

Skip planning for simple tasks like typo fixes, one-line changes, or obvious modifications.

## Planning Workflow

Follow this 5-step process for effective planning:

### Step 1: Understand the Request

Parse the user's request to identify:

**Task type**: Feature, bug fix, refactoring, or integration
**Scope**: Single file, module, or system-wide changes
**Requirements**: Explicit and implicit expectations
**Constraints**: Performance, compatibility, or architectural limits
**Success criteria**: How to verify the implementation works

Ask clarifying questions if the request is ambiguous. Better to confirm intent early than implement the wrong solution.

**Example questions:**
- "Should this feature support offline mode?"
- "Do you want backward compatibility with the existing API?"
- "Which error cases should be handled?"

### Step 2: Explore the Codebase

Systematically explore to understand existing patterns:

**Architecture**: Identify key modules, dependencies, and data flows
**Patterns**: Find naming conventions, code organization, and design patterns
**Similar implementations**: Locate existing features to model after
**Test structure**: Understand how tests are organized
**Configuration**: Review project settings and environment variables

Use exploration techniques:
- **File discovery**: Find relevant files with glob patterns
- **Content search**: Search for keywords and patterns with grep
- **Dependency analysis**: Understand module relationships
- **Standard review**: Read CLAUDE.md and project documentation

See `references/analysis-patterns.md` for detailed exploration techniques.

### Step 3: Identify Implementation Points

Determine where changes will be made:

**Critical files**: Files that must be modified
**Test files**: Tests that need updating or creation
**Documentation**: Docs that need changes
**Configuration**: Settings that need updates
**Dependencies**: Libraries that need adding or updating

Map out the change impact:
- Which components are affected?
- What dependencies exist between changes?
- What order should changes happen in?
- What risks exist?

### Step 4: Ask Clarifying Questions

Present options when multiple approaches are valid:

Use the AskUserQuestion tool to:
- Choose between implementation strategies
- Determine feature behavior preferences
- Confirm assumptions about requirements
- Select libraries or frameworks
- Decide on architectural patterns

See `references/question-templates.md` for question patterns.

### Step 5: Propose Detailed Plan

Present a comprehensive implementation plan:

**Plan structure:**
1. **Understanding** - Summary of what user wants
2. **Context** - Relevant codebase patterns discovered
3. **Approach** - Chosen implementation strategy with rationale
4. **Critical Files** - List of files to modify or create
5. **Implementation Steps** - Ordered steps with descriptions
6. **Dependencies** - External libraries or tools needed
7. **Testing Strategy** - How to verify the implementation
8. **Risks** - Potential issues and mitigation strategies
9. **Alternatives Considered** - Other approaches and why not chosen

**Step format:**
```
Step N: [Clear action description]
- File: path/to/file.ts
- Action: What will be done
- Rationale: Why this approach
```

For detailed workflow guidance, see `references/planning-workflow.md`.

## Codebase Analysis Techniques

Effective planning requires thorough codebase understanding:

### File Discovery Patterns

**Find related files:**
- Feature files: `**/*{feature-name}*`
- Component files: `**/components/**/*.tsx`
- Test files: `**/*.{test,spec}.{js,ts}`
- Config files: `**/*.config.{js,ts}`

**Search strategies:**
- Start broad, then narrow
- Check common locations first
- Look for naming patterns
- Follow import chains

### Content Search Patterns

**Find implementation examples:**
- Similar features: Search for keywords in existing features
- API patterns: Search for HTTP client usage or route definitions
- State management: Search for store or context usage
- Error handling: Search for try/catch or error handling patterns

**Search techniques:**
- Keyword search for function names or class names
- Pattern search for similar code structures
- Import search to find usage examples
- Type search to understand data structures

### Architecture Understanding

**Map the system:**
- Entry points: Main files, route definitions, app initialization
- Module structure: Directory organization and boundaries
- Data flow: How data moves through the system
- External interfaces: APIs, databases, file systems

**Identify patterns:**
- Project conventions: Naming, file organization, code style
- Design patterns: MVC, service layer, repository pattern
- Framework usage: React, Vue, Express patterns
- Testing patterns: Unit, integration, e2e test structure

For comprehensive analysis patterns, see `references/analysis-patterns.md`.

## Reading Settings

Customize planning behavior using project-specific settings:

### Settings File Location

Settings live in `.claude/work-planner.local.md` with YAML frontmatter:

```markdown
---
enabled: true
verbosity: detailed
thoroughness: medium
maxFilesToExplore: 20
excludePatterns:
  - "**/node_modules/**"
  - "**/dist/**"
customGuidelines: |
  - Always consider backward compatibility
  - Check for existing patterns in /core directory
---

# Project-Specific Context

Additional context here...
```

### Settings Fields

**enabled**: Boolean controlling whether planning runs
**verbosity**: Output level (silent, brief, detailed)
**thoroughness**: Exploration depth (quick, medium, thorough)
**maxFilesToExplore**: Limit files read during exploration
**excludePatterns**: Glob patterns for files to skip
**customGuidelines**: Additional planning considerations

### Apply Custom Guidelines

Incorporate project-specific guidelines:
1. Read customGuidelines as markdown text
2. Combine with CLAUDE.md project standards
3. Apply throughout planning process
4. Reference in plan rationale

## Output Format

Present plans clearly and actionably:

### Plan Template

```markdown
# Implementation Plan: [Task Name]

## Understanding
[Clear summary of user request and requirements]

## Context
[Key codebase patterns and conventions discovered]

## Approach
[Chosen implementation strategy with rationale]

## Critical Files
- `path/to/file1.ts` - [Purpose]
- `path/to/file2.ts` - [Purpose]

## Implementation Steps

### Step 1: [Action]
- **File**: path/to/file.ts
- **Action**: What will be done
- **Rationale**: Why this approach

[Continue for each step]

## Dependencies
- [Library name]: [Purpose and version]

## Testing Strategy
[How to verify implementation works]

## Risks
- [Risk description]: [Mitigation approach]

## Alternatives Considered
- [Alternative approach]: [Why not chosen]
```

### Verbosity Levels

**Silent**: No output (plan saved to file)
**Brief**: High-level summary only
**Detailed**: Full plan with rationale and alternatives

## File and Directory Filtering

Skip files that shouldn't be explored:

### Default Exclusions

Always skip:
- `node_modules/`
- `.git/`
- `dist/`
- `build/`
- `coverage/`
- `.next/`
- `.nuxt/`
- `vendor/`
- `*.min.js`
- `*.bundle.js`

### Custom Exclusions

Apply excludePatterns from settings to avoid irrelevant files.

## Key Principles

Remember these core principles:

1. **Plan before code**: Always explore before implementing
2. **Understand context**: Learn existing patterns and conventions
3. **Ask questions**: Clarify ambiguities early
4. **Be thorough**: Better to over-plan than under-plan
5. **Stay focused**: Keep exploration relevant to task
6. **Document reasoning**: Explain why, not just what
7. **Consider alternatives**: Evaluate multiple approaches
8. **Identify risks**: Anticipate potential issues

## Common Planning Scenarios

### Feature Addition

**Focus areas:**
- Where does the feature fit architecturally?
- What existing patterns should be followed?
- What new files or modules are needed?
- How will the feature be tested?

**Example**: See `examples/feature-planning.md`

### Bug Investigation

**Focus areas:**
- Where is the bug manifesting?
- What is the root cause?
- What code is involved?
- How can the fix be verified?

**Example**: See `examples/bugfix-planning.md`

### Refactoring Task

**Focus areas:**
- What is the current structure?
- What is the target structure?
- What is the migration path?
- How to ensure no behavior changes?

**Example**: See `examples/refactoring-planning.md`

## Additional Resources

### Reference Files

Detailed guidance and techniques:
- **`references/planning-workflow.md`** - Step-by-step workflow details
- **`references/analysis-patterns.md`** - Codebase exploration techniques
- **`references/question-templates.md`** - User question patterns

### Example Files

Real-world planning examples:
- **`examples/feature-planning.md`** - Adding user authentication
- **`examples/refactoring-planning.md`** - Refactoring payment module
- **`examples/bugfix-planning.md`** - Fixing checkout error

## Quick Reference

### Planning Checklist

- [ ] Understand the user request
- [ ] Identify task type and scope
- [ ] Read project settings and CLAUDE.md
- [ ] Explore relevant codebase areas
- [ ] Identify critical files and patterns
- [ ] Ask clarifying questions if needed
- [ ] Choose implementation approach
- [ ] Document detailed steps
- [ ] Identify risks and alternatives
- [ ] Present comprehensive plan

### Decision Tree

**Before implementing, ask:**

1. Is the task non-trivial? → If no, skip planning
2. Do I understand the requirements? → If no, ask questions
3. Do I know the codebase patterns? → If no, explore
4. Are there multiple approaches? → If yes, evaluate and choose
5. Are there risks or unknowns? → If yes, document them
6. Is the plan detailed enough to implement? → If no, add detail

Follow this systematic approach to ensure effective planning that leads to successful implementation.
