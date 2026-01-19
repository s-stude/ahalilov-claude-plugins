---
name: Code Simplification
description: This skill should be used when the user asks to "simplify code", "refactor code", "clean up code", "improve readability", "make code clearer", "reduce complexity", "eliminate nesting", "follow project standards", or "apply best practices". Provides comprehensive guidance for simplifying and refining code while preserving functionality.
version: 0.1.0
---

# Code Simplification

## Overview

Code simplification enhances code clarity, consistency, and maintainability while preserving exact functionality. This skill provides systematic approaches for identifying simplification opportunities and applying improvements that align with project-specific best practices.

**Core principle**: Change HOW code works, never WHAT it does. All original features, outputs, and behaviors must remain intact.

## When to Apply Simplification

Apply code simplification when:

1. **After writing new code**: Review and refine immediately after implementation
2. **During refactoring**: Enhance clarity while restructuring
3. **Following code reviews**: Address feedback about complexity or readability
4. **Before committing**: Final polish to ensure code meets standards
5. **When requested**: User explicitly asks for simplification or cleanup

Focus on recently modified code unless explicitly instructed to review broader scope.

## Simplification Workflow

Follow this systematic process for effective code simplification:

### Step 1: Read Project Standards

Start by understanding project-specific coding standards:

1. **Check for CLAUDE.md**: Read the project's CLAUDE.md file if present
2. **Extract coding standards**: Identify patterns like:
   - Module system (ES modules, CommonJS, etc.)
   - Function style (function keyword vs arrow functions)
   - Type annotations (TypeScript, JSDoc, etc.)
   - Error handling patterns
   - Naming conventions
   - Component patterns (for React, Vue, etc.)
3. **Check plugin settings**: Read `.claude/code-simplifier.local.md` for custom rules
4. **Note exclusions**: Identify files and patterns to skip

**Example standards from CLAUDE.md:**
- Use ES modules with proper import sorting
- Prefer `function` keyword over arrow functions for top-level functions
- Use explicit return type annotations
- Avoid try/catch when possible, prefer error returns

### Step 2: Analyze Code for Opportunities

Examine the code for common simplification opportunities:

#### Complexity Indicators

Look for these signs of unnecessary complexity:

**Nesting depth**: Functions with 3+ levels of indentation
**Long functions**: Functions exceeding 50 lines
**Nested ternaries**: Multiple conditional operators chained together
**Magic numbers**: Hardcoded values without explanation
**Redundant code**: Duplicated logic or patterns
**Unclear names**: Variables or functions with ambiguous names
**Comments explaining code**: Comments that describe obvious behavior

#### Pattern Detection

Identify specific patterns that warrant simplification:

**Nested conditionals**: Can be flattened with guard clauses
**Nested ternaries**: Should be switch statements or if/else chains
**Duplicate logic**: Can be extracted to functions
**Complex boolean expressions**: Can be simplified or extracted to named variables
**Long parameter lists**: Can use object parameters
**Callback hell**: Can use async/await

See `references/patterns.md` for detailed pattern catalog.

### Step 3: Apply Simplifications

Make targeted improvements while preserving functionality:

#### Reduce Nesting

**Technique**: Use guard clauses to exit early

```javascript
// Before
function processUser(user) {
  if (user) {
    if (user.active) {
      if (user.permissions.includes('admin')) {
        return doAdminStuff(user);
      }
    }
  }
  return null;
}

// After
function processUser(user) {
  if (!user) return null;
  if (!user.active) return null;
  if (!user.permissions.includes('admin')) return null;
  return doAdminStuff(user);
}
```

#### Eliminate Nested Ternaries

**Technique**: Convert to switch statements or if/else chains

```javascript
// Before
const status = isValid ? (hasPermission ? (isActive ? 'granted' : 'inactive') : 'denied') : 'invalid';

// After
function determineStatus(isValid, hasPermission, isActive) {
  if (!isValid) return 'invalid';
  if (!hasPermission) return 'denied';
  if (!isActive) return 'inactive';
  return 'granted';
}
const status = determineStatus(isValid, hasPermission, isActive);
```

#### Improve Naming

**Technique**: Use descriptive, intention-revealing names

```javascript
// Before
function calc(a, b, t) {
  return a + (b - a) * t;
}

// After
function interpolate(start, end, progress) {
  return start + (end - start) * progress;
}
```

#### Extract Magic Numbers

**Technique**: Define named constants

```javascript
// Before
if (age >= 18 && age < 65) {
  // working age
}

// After
const WORKING_AGE_MIN = 18;
const WORKING_AGE_MAX = 65;

if (age >= WORKING_AGE_MIN && age < WORKING_AGE_MAX) {
  // working age
}
```

#### Consolidate Duplicate Logic

**Technique**: Extract to shared functions

```javascript
// Before
const userEmail = user && user.contact && user.contact.email;
const adminEmail = admin && admin.contact && admin.contact.email;

// After
function getEmail(person) {
  return person?.contact?.email;
}
const userEmail = getEmail(user);
const adminEmail = getEmail(admin);
```

For comprehensive pattern examples, see `references/patterns.md`.

### Step 4: Verify Functionality Preservation

Ensure changes don't alter behavior:

1. **Check inputs/outputs**: Verify function signatures unchanged
2. **Review edge cases**: Ensure edge cases still handled correctly
3. **Validate logic**: Confirm conditional logic produces same results
4. **Test assertions**: Run tests if available (don't create new tests)

**Critical**: If simplification changes behavior, revert and find alternative approach.

### Step 5: Apply Project Standards

Align code with project-specific conventions:

1. **Match existing style**: Follow patterns from CLAUDE.md
2. **Use consistent patterns**: Apply same approach throughout codebase
3. **Apply custom rules**: Honor settings from `.claude/code-simplifier.local.md`
4. **Maintain conventions**: Keep existing naming and structure patterns

**Example**: If CLAUDE.md specifies "prefer function keyword", convert arrow functions:

```javascript
// Before
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// After (if project standard requires function keyword)
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### Step 6: Balance Simplicity and Maintainability

Avoid over-simplification that harms code quality:

**Don't remove helpful abstractions**: Keep abstractions that improve organization
**Don't over-DRY**: Some duplication is better than premature abstraction
**Don't prioritize brevity over clarity**: Explicit code beats clever one-liners
**Don't combine unrelated concerns**: Keep functions focused on single responsibilities
**Don't sacrifice readability**: Longer, clearer code beats shorter, cryptic code

**Example of over-simplification to avoid:**

```javascript
// Over-simplified (too cryptic)
const v = d.filter(x => x.a && x.b > 5).map(x => x.c);

// Better (clear intent)
const validItems = data.filter(item => item.active && item.score > 5);
const itemNames = validItems.map(item => item.name);
```

## Reading Settings

Parse plugin settings to customize behavior:

### Settings File Location

Settings live in `.claude/code-simplifier.local.md` with YAML frontmatter:

```markdown
---
enabled: true
verbosity: brief
excludePatterns:
  - "**/*.test.js"
  - "**/legacy/**"
customRules: |
  - Always use async/await instead of .then() chains
  - Prefer named exports over default exports
---

# Project-Specific Rules

Additional context here...
```

### Parse Settings

Extract settings fields:

1. **enabled**: Boolean controlling whether simplification runs
2. **verbosity**: Output level (silent, brief, detailed)
3. **excludePatterns**: Glob patterns for files to skip
4. **customRules**: Additional simplification rules as markdown text

### Apply Custom Rules

Incorporate custom rules from settings:

1. **Parse as markdown**: Treat customRules as additional instructions
2. **Apply with project standards**: Combine with CLAUDE.md patterns
3. **Prioritize custom rules**: User-specified rules override defaults

## File and Directory Filtering

Skip files that shouldn't be simplified:

### Default Exclusions

Always skip these directories:
- `node_modules/`
- `.git/`
- `dist/`
- `build/`
- `coverage/`
- `.next/`
- `.nuxt/`
- `vendor/`

### File Type Filtering

Only process source code files:

**Process these extensions:**
- JavaScript: `.js`, `.jsx`, `.mjs`, `.cjs`
- TypeScript: `.ts`, `.tsx`
- Python: `.py`
- Go: `.go`
- Rust: `.rs`
- Java: `.java`
- C/C++: `.c`, `.cpp`, `.cc`, `.h`, `.hpp`
- Ruby: `.rb`
- PHP: `.php`

**Skip these file types:**
- Documentation: `.md`, `.txt`, `.rst`
- Config: `.json`, `.yaml`, `.yml`, `.toml`, `.ini`
- Data: `.csv`, `.xml`, `.sql`
- Assets: `.png`, `.jpg`, `.svg`, `.ico`

### Custom Exclusions

Apply excludePatterns from settings:

```javascript
// Example: Check if file matches exclusion pattern
const excludePatterns = settings.excludePatterns || [];
const shouldSkip = excludePatterns.some(pattern => minimatch(filePath, pattern));
```

## Output and Reporting

Provide feedback based on verbosity setting:

### Brief Mode (Default)

One-line summary of changes:

```
Simplified auth.ts: reduced nesting in 2 functions, extracted 1 constant
```

### Detailed Mode

List specific changes made:

```
Simplified auth.ts:
- validateUser: Converted nested conditionals to guard clauses
- checkPermissions: Extracted ADMIN_ROLE constant
- authenticate: Renamed variable 'u' to 'user'
```

### Silent Mode

No output, user reviews changes via git diff.

## Key Principles

Remember these core principles throughout simplification:

1. **Preserve functionality**: Never change what code does
2. **Follow project standards**: Honor CLAUDE.md and custom rules
3. **Enhance clarity**: Make code easier to understand
4. **Maintain balance**: Don't over-simplify
5. **Focus scope**: Recently modified code unless told otherwise
6. **Respect exclusions**: Skip filtered files and directories
7. **Document significant changes**: Note improvements in output

## Common Pitfalls to Avoid

**Changing behavior**: Always verify functionality preserved
**Ignoring project standards**: Must follow CLAUDE.md patterns
**Over-engineering**: Don't add unnecessary abstractions
**Breaking tests**: Ensure existing tests still pass
**Touching excluded files**: Honor excludePatterns settings
**Removing necessary comments**: Keep comments explaining WHY, not WHAT
**Creating inconsistency**: Match existing codebase patterns

## Additional Resources

### Reference Files

For comprehensive pattern catalogs and detailed techniques:

- **`references/patterns.md`** - Complete catalog of simplification patterns and anti-patterns
- **`references/anti-patterns.md`** - Common mistakes and how to fix them

### Example Files

Working before/after examples:

- **`examples/nested-conditionals.md`** - Guard clause transformations
- **`examples/ternary-operators.md`** - Converting nested ternaries
- **`examples/function-extraction.md`** - Eliminating duplication

## Quick Reference

### Simplification Checklist

- [ ] Read CLAUDE.md and settings
- [ ] Check file should be processed (type and exclusions)
- [ ] Identify complexity indicators
- [ ] Apply appropriate simplification patterns
- [ ] Verify functionality preserved
- [ ] Apply project standards
- [ ] Balance simplicity and maintainability
- [ ] Provide appropriate output

### Decision Tree

**Before simplifying, ask:**

1. Is this a source code file? → If no, skip
2. Is file in excluded directory or pattern? → If yes, skip
3. Does simplification preserve functionality? → If no, don't apply
4. Does change follow project standards? → If no, adjust
5. Does change improve clarity? → If no, reconsider
6. Does change maintain balance? → If no, revert

Follow this systematic approach to ensure effective, safe code simplification that enhances quality without introducing risks.
