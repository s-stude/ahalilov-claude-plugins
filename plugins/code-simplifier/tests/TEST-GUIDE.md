# Code Simplifier Plugin Test Guide

This guide walks through testing the code-simplifier plugin to verify all components work correctly.

## Prerequisites

1. Install the plugin:
   ```bash
   # From project root
   cp -r agent-skills/code-simplifier ~/.claude/plugins/
   ```

2. Start Claude Code:
   ```bash
   cc
   ```

3. Create a test directory in your project:
   ```bash
   mkdir -p .test-simplifier
   cd .test-simplifier
   git init  # For tracking changes
   ```

## Test 1: Nested Conditionals Simplification

**File:** Copy `tests/test-nested-conditionals.js` to `.test-simplifier/`

**Test with command:**
```
/simplify .test-simplifier/test-nested-conditionals.js
```

**Expected behavior:**
- Agent analyzes the file
- Converts nested if statements to guard clauses
- Reduces nesting from 5 levels to 1 level
- Provides summary: "Simplified test-nested-conditionals.js: reduced nesting in validateUser function"

**Verify:**
```bash
git diff .test-simplifier/test-nested-conditionals.js
```

**Expected changes:**
- Early returns for null/invalid checks
- Flat structure with guard clauses
- Same functionality preserved

## Test 2: Nested Ternaries Simplification

**File:** Copy `tests/test-nested-ternaries.js` to `.test-simplifier/`

**Test with automatic trigger:**
1. Use Write tool to create the file in `.test-simplifier/`
2. Hook should automatically trigger
3. Agent should run without manual invocation

**Expected behavior:**
- PostToolUse hook detects file write
- Agent automatically analyzes file
- Converts nested ternary to if/else chain or function
- Provides brief summary

**Verify:**
```bash
git diff .test-simplifier/test-nested-ternaries.js
```

**Expected changes:**
- Nested ternary replaced with clear if/else or function
- Named function if appropriate
- Improved readability

## Test 3: Magic Numbers Extraction

**File:** Copy `tests/test-magic-numbers.js` to `.test-simplifier/`

**Test:**
```
/simplify .test-simplifier/test-magic-numbers.js
```

**Expected behavior:**
- Extracts hardcoded numbers to named constants
- Uses SCREAMING_SNAKE_CASE for constants
- Places constants at appropriate scope

**Verify:**
```bash
git diff .test-simplifier/test-magic-numbers.js
```

**Expected changes:**
- Constants like `MAX_ITEMS = 100`
- Constants like `DISCOUNT_RATE = 0.15`
- Original numbers replaced with constant references

## Test 4: Duplicate Logic Extraction

**File:** Copy `tests/test-duplicate-logic.js` to `.test-simplifier/`

**Test:**
```
/simplify .test-simplifier/test-duplicate-logic.js
```

**Expected behavior:**
- Identifies repeated patterns
- Extracts to shared function
- Reduces duplication

**Verify:**
```bash
git diff .test-simplifier/test-duplicate-logic.js
```

**Expected changes:**
- New helper function created
- Duplicate code calls the helper
- DRY principle applied

## Test 5: File Filtering (Excluded Files)

**File:** Copy `tests/test-config.json` to `.test-simplifier/`

**Test:**
```
/simplify .test-simplifier/test-config.json
```

**Expected behavior:**
- Agent recognizes file is not source code (JSON config)
- Skips processing silently
- No changes made

**Verify:**
```bash
git diff .test-simplifier/test-config.json
```

**Expected:** No changes (file unchanged)

## Test 6: Settings Configuration

**Test custom verbosity:**

1. Create `.claude/code-simplifier.local.md`:
   ```markdown
   ---
   enabled: true
   verbosity: detailed
   ---
   ```

2. Edit a test file:
   ```
   /simplify .test-simplifier/test-nested-conditionals.js
   ```

3. **Expected:** Detailed output listing each specific change

**Test exclusion patterns:**

1. Update settings:
   ```markdown
   ---
   enabled: true
   verbosity: brief
   excludePatterns:
     - "**/test-*.js"
   ---
   ```

2. Edit a test file
3. **Expected:** File is skipped (matches exclusion pattern)

**Test custom rules:**

1. Update settings:
   ```markdown
   ---
   enabled: true
   customRules: |
     - Always extract any number > 10 to a named constant
     - Prefer function keyword over arrow functions
   ---
   ```

2. Edit a file with arrow functions and numbers
3. **Expected:** Arrow functions converted, numbers extracted

## Test 7: Skill Triggering

Ask questions to trigger the skill:

**Test 1:**
```
How do I simplify nested conditionals?
```
**Expected:** Skill loads and provides pattern guidance

**Test 2:**
```
Can you help me reduce code complexity?
```
**Expected:** Skill loads with complexity reduction techniques

**Test 3:**
```
What's the best way to refactor nested ternaries?
```
**Expected:** Skill loads with ternary simplification patterns

## Test 8: Agent Triggering

Create scenarios that should trigger the agent:

**Automatic trigger after Write:**
1. Use Claude to write a new file with complex code
2. After Write completes, hook should trigger
3. Agent should analyze and simplify
4. Check git diff for changes

**Manual trigger via command:**
1. Create a complex file manually
2. Run `/simplify path/to/file.js`
3. Agent should analyze and simplify
4. Verify changes applied

## Test 9: Error Handling

**Test non-existent file:**
```
/simplify .test-simplifier/does-not-exist.js
```
**Expected:** Error message about file not found

**Test no arguments:**
```
/simplify
```
**Expected:** Usage message showing command syntax

**Test directory (not file):**
```
/simplify .test-simplifier/
```
**Expected:** Error or appropriate handling

## Test 10: Hook Filtering

**Test with non-code file:**
1. Edit a `.md` file
2. **Expected:** Hook does not trigger agent (file not source code)

**Test with excluded directory:**
1. Create `node_modules/test.js`
2. Edit the file
3. **Expected:** Hook does not trigger (excluded directory)

**Test with source code file:**
1. Edit a `.js` or `.ts` file
2. **Expected:** Hook triggers agent automatically

## Test 11: Functionality Preservation

**Critical test:** Verify simplifications don't break code

1. Copy `tests/test-functionality.js` (has tests inline)
2. Run simplification
3. Execute the file to verify it still works:
   ```bash
   node .test-simplifier/test-functionality.js
   ```
4. **Expected:** All tests pass, no errors

## Test 12: Performance Testing

**Small file (< 100 lines):**
- Use `tests/test-nested-conditionals.js`
- **Expected:** < 5 seconds

**Medium file (100-500 lines):**
- Create or use a larger test file
- **Expected:** < 15 seconds

**Large file (500+ lines):**
- Create or use a very large file
- **Expected:** < 30 seconds

Time the simplification:
```bash
time cc --plugin-dir agent-skills/code-simplifier
# Then run /simplify command
```

## Test 13: Debug Mode

Run Claude Code in debug mode:
```bash
cc --debug
```

**What to look for:**
- Hook registration at startup
- Hook trigger events (PostToolUse)
- Agent invocation messages
- Detailed execution logs
- Input/output JSON from hooks

**Test:** Edit a file and watch debug output to see:
1. PostToolUse hook receives event
2. Prompt hook evaluates file
3. Decision to trigger agent
4. Agent starts execution
5. Agent completes with summary

## Test Checklist

Use this checklist to verify all functionality:

### Plugin Loading
- [ ] Plugin loads without errors
- [ ] `/help` shows `/simplify` command
- [ ] No warnings in console

### Skill
- [ ] Skill triggers on "simplify code" questions
- [ ] Skill triggers on "refactor" questions
- [ ] Skill triggers on "reduce complexity" questions
- [ ] Skill provides helpful pattern guidance

### Agent
- [ ] Agent analyzes files correctly
- [ ] Agent applies guard clause pattern
- [ ] Agent eliminates nested ternaries
- [ ] Agent extracts magic numbers
- [ ] Agent consolidates duplicate logic
- [ ] Agent preserves functionality
- [ ] Agent follows project standards (if CLAUDE.md exists)

### Hook
- [ ] Hook triggers on Write operations
- [ ] Hook triggers on Edit operations
- [ ] Hook filters non-code files correctly
- [ ] Hook skips excluded directories
- [ ] Hook invokes agent for valid files

### Command
- [ ] `/simplify file.js` works correctly
- [ ] `/simplify multiple files` works
- [ ] `/simplify` with no args shows usage
- [ ] Error handling for missing files

### Settings
- [ ] `enabled: false` disables auto-simplification
- [ ] `verbosity: silent` produces no output
- [ ] `verbosity: brief` shows one-line summary
- [ ] `verbosity: detailed` shows change list
- [ ] `excludePatterns` filters files correctly
- [ ] `customRules` are applied

### Edge Cases
- [ ] Handles files with syntax errors gracefully
- [ ] Skips files that don't need simplification
- [ ] Works with TypeScript files
- [ ] Works with Python files
- [ ] Handles very large files
- [ ] Preserves comments appropriately

## Troubleshooting

**Plugin doesn't load:**
- Check `.claude/plugins/code-simplifier/` exists
- Verify `plugin.json` is valid JSON
- Restart Claude Code

**Hook doesn't trigger:**
- Check settings `enabled: true`
- Verify file is source code (not .md, .json, etc.)
- Check file not in excluded directory
- Use `cc --debug` to see hook events

**Agent doesn't simplify:**
- Check file actually needs simplification
- Verify file matches criteria in hook prompt
- Check excludePatterns in settings
- Review agent output for reasoning

**Command not found:**
- Verify plugin loaded (check with `/help`)
- Check `commands/simplify.md` exists
- Restart Claude Code

## Success Criteria

The plugin is working correctly if:

1. ✅ All test files are simplified appropriately
2. ✅ Functionality is preserved in all cases
3. ✅ Filtering works (excludes non-code files)
4. ✅ Settings control behavior as expected
5. ✅ Hook triggers automatically on file changes
6. ✅ Command works for manual invocation
7. ✅ Skill provides helpful guidance
8. ✅ No errors or warnings in debug mode

## Next Steps

After successful testing:

1. Review all simplified code with `git diff`
2. Run existing test suites to verify no breakage
3. Document any unexpected behavior
4. Adjust settings for your project needs
5. Consider publishing the plugin if desired

## Reporting Issues

If you find issues during testing:

1. Note the exact steps to reproduce
2. Include the test file content
3. Include settings configuration
4. Capture debug output (`cc --debug`)
5. Note Claude Code version
6. Report via GitHub issues or appropriate channel
