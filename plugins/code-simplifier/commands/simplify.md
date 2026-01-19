---
name: simplify
description: Manually trigger code simplification on specific file(s)
allowed-tools:
  - Read
  - Edit
  - Grep
  - Task
argument-hint: "[file-path...]"
---

# Simplify Command

Invoke the code-simplifier agent to analyze and improve code in specified files.

## Usage

```
/simplify [file-path...]
```

**Examples:**
```
/simplify src/auth.ts
/simplify src/components/Button.tsx src/lib/helpers.js
/simplify .
```

## Command Behavior

When this command is invoked:

1. **Parse arguments**: Extract file paths from command arguments
   - If no arguments provided, show usage help
   - If single argument is ".", use git to find recently modified files
   - Otherwise, treat each argument as a file path

2. **Validate files exist**: For each file path, verify it exists
   - If file doesn't exist, report error and skip
   - Continue processing remaining files

3. **Invoke code-simplifier agent**: Use the Task tool to launch the code-simplifier agent
   - Pass the file path(s) as context
   - Agent will read project standards, analyze code, and apply simplifications
   - Agent handles all filtering (file type, exclusions, etc.)

4. **Report results**: After agent completes, summarize what was done

## Implementation Steps

**Step 1: Parse arguments**

Check if arguments were provided:
- If no arguments: Display usage message explaining the command accepts file paths
- If argument is ".": Use bash to find recently modified files with `git diff --name-only HEAD`
- Otherwise: Use arguments as file paths directly

**Step 2: Validate file paths**

For each file path provided:
- Check if file exists using Read tool or bash `test -f`
- If file doesn't exist, output error: "File not found: [path]"
- Collect valid file paths for processing

**Step 3: Invoke agent**

Use the Task tool with subagent_type matching the code-simplifier agent:
- Prompt: "Simplify code in these files: [file-paths]. Read project standards from CLAUDE.md and settings from .claude/code-simplifier.local.md, then apply appropriate simplifications while preserving functionality."
- The agent will handle all the actual simplification work

**Step 4: Report completion**

After agent completes:
- Output: "Code simplification complete. Review changes with git diff."

## Tips for Users

Provide these tips when users run the command:

- **Review changes**: Always review simplifications with `git diff` before committing
- **Run tests**: Ensure tests still pass after simplification
- **Selective simplification**: Target specific files rather than entire codebase
- **Settings control**: Configure behavior via `.claude/code-simplifier.local.md`

## Error Handling

Handle these error cases:

- **No arguments**: Display usage message, don't fail
- **File not found**: Report which file(s) don't exist, skip them
- **Not a code file**: Agent will filter appropriately, no action needed here
- **Agent failure**: Report if Task tool fails to launch agent

## Example Session

```
user: /simplify src/auth.ts

assistant: I'll simplify src/auth.ts using the code-simplifier agent.

[Uses Task tool to invoke code-simplifier agent with the file path]

assistant: Code simplification complete for src/auth.ts. The code-simplifier agent reduced nesting in 2 functions and extracted 1 magic number to a constant. Review changes with git diff.
```

## Notes

- This command provides manual control when automatic simplification is disabled
- Useful for one-off simplification of specific files
- Agent respects all settings and exclusion patterns
- All functionality checking and pattern application is handled by the agent
