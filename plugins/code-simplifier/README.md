# Code Simplifier Plugin

Autonomously simplifies and refines code for clarity, consistency, and maintainability while preserving all functionality. Focuses on recently modified code and applies project-specific best practices.

## Features

- **Autonomous Operation**: Automatically simplifies code after Write/Edit operations
- **Functionality Preservation**: Only changes HOW code works, never WHAT it does
- **Project Standards**: Reads and applies standards from CLAUDE.md
- **Smart Filtering**: Only processes source code files, skips common directories (node_modules, .git, etc.)
- **Customizable**: Configure via settings file for project-specific needs
- **Manual Control**: Use `/simplify` command for on-demand simplification

## Installation

1. Copy this plugin to your Claude Code plugins directory:
   ```bash
   cp -r code-simplifier ~/.claude/plugins/
   ```

2. Or use it as a project-local plugin by placing it in your project root

3. Restart Claude Code or start a new session

## Usage

### Automatic Simplification

The plugin runs automatically after you write or edit code files. It will:

1. Detect code file modifications (`.js`, `.ts`, `.py`, `.jsx`, `.tsx`, etc.)
2. Read project standards from `CLAUDE.md` (if present)
3. Apply simplifications while preserving functionality
4. Provide a brief summary of changes made

### Manual Simplification

Use the `/simplify` command to manually simplify specific files:

```
/simplify src/utils.ts
/simplify src/components/Button.tsx src/lib/helpers.js
```

### Configuration

Create `.claude/code-simplifier.local.md` in your project to customize behavior:

```markdown
---
enabled: true
verbosity: brief
excludePatterns:
  - "**/*.test.js"
  - "**/*.spec.ts"
  - "**/legacy/**"
customRules: |
  - Always use async/await instead of .then() chains
  - Prefer named exports over default exports
  - Extract magic numbers to named constants
---

# Code Simplifier Settings

Additional project-specific simplification rules and preferences.
```

### Settings Fields

- **enabled** (boolean, default: `true`): Master switch to enable/disable auto-simplification
- **verbosity** (string, default: `brief`): Output level - `silent`, `brief`, or `detailed`
- **excludePatterns** (array, default: `[]`): Additional glob patterns to skip
- **customRules** (string, default: `""`): Project-specific simplification rules

## How It Works

1. **PostToolUse Hook**: Monitors Write/Edit operations
2. **File Filtering**: Checks if file is source code and not in excluded directory
3. **Agent Activation**: Triggers code-simplifier agent with file context
4. **Standard Reading**: Agent reads CLAUDE.md and custom settings
5. **Analysis**: Identifies opportunities for simplification
6. **Application**: Applies changes using Edit tool
7. **Reporting**: Provides brief summary of improvements

## Simplification Principles

The plugin follows these core principles:

1. **Preserve Functionality**: Never change what code does, only how it does it
2. **Apply Project Standards**: Follow coding standards from CLAUDE.md
3. **Enhance Clarity**: Reduce complexity, eliminate redundancy, improve readability
4. **Maintain Balance**: Avoid over-simplification that reduces maintainability
5. **Focus Scope**: Only refine recently modified code

## Examples

### Before
```javascript
const result = isValid ? (hasPermission ? (isActive ? 'granted' : 'inactive') : 'denied') : 'invalid';
```

### After
```javascript
function determineAccess(isValid, hasPermission, isActive) {
  if (!isValid) return 'invalid';
  if (!hasPermission) return 'denied';
  if (!isActive) return 'inactive';
  return 'granted';
}

const result = determineAccess(isValid, hasPermission, isActive);
```

## Troubleshooting

**Plugin not triggering**: Check that `enabled: true` in settings and file is a source code file.

**Too many/few simplifications**: Adjust `customRules` in settings or add `excludePatterns`.

**Unexpected changes**: Review `verbosity: detailed` output to see what's being changed.

## License

MIT
