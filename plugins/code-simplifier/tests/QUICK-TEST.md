# Quick Test Instructions

Fast testing guide for the code-simplifier plugin.

## 1. Install Plugin (30 seconds)

```bash
# From project root
cp -r agent-skills/code-simplifier ~/.claude/plugins/

# Start Claude Code
cc
```

## 2. Verify Plugin Loaded (10 seconds)

```
/help
```

**Look for:** `/simplify` command in the list

## 3. Quick Command Test (1 minute)

```bash
# Create test directory
mkdir -p .test-simplifier
cd .test-simplifier

# Copy test file
cp ../agent-skills/code-simplifier/tests/test-nested-conditionals.js .

# Initialize git for tracking
git init
git add .
git commit -m "initial"
```

In Claude Code:
```
/simplify .test-simplifier/test-nested-conditionals.js
```

**Expected:** Agent simplifies nested ifs to guard clauses

```bash
# Review changes
git diff
```

## 4. Quick Hook Test (1 minute)

In Claude Code, write a new file with nested code:
```
Create a new file .test-simplifier/nested.js with this code:

function validate(user) {
  if (user) {
    if (user.email) {
      if (user.age >= 18) {
        return true;
      }
    }
  }
  return false;
}
```

**Expected:**
- After Write completes, PostToolUse hook triggers
- Agent automatically simplifies the file
- See brief summary message

Check changes:
```bash
git diff .test-simplifier/nested.js
```

## 5. Quick Settings Test (2 minutes)

Create `.claude/code-simplifier.local.md`:
```markdown
---
enabled: true
verbosity: detailed
---
```

Edit a file:
```
/simplify .test-simplifier/nested.js
```

**Expected:** Detailed output showing each specific change

## Test Summary

**Total time:** ~5 minutes

**If all tests pass:**
- ✅ Plugin loaded successfully
- ✅ Command works
- ✅ Hook triggers automatically
- ✅ Settings control behavior
- ✅ Plugin is functional

## Troubleshooting

**Plugin not loading:**
```bash
# Check installation
ls ~/.claude/plugins/code-simplifier/

# Verify structure
cat ~/.claude/plugins/code-simplifier/.claude-plugin/plugin.json

# Restart Claude Code
exit
cc
```

**Hook not triggering:**
- Check `enabled: true` in settings
- Use `cc --debug` to see hook events
- Verify file is source code (.js, not .md)

**No simplifications applied:**
- File may already be simplified
- Check file not in excluded directory
- Review agent output for reasoning

## Full Test Suite

For comprehensive testing, see `TEST-GUIDE.md`

## Test Files Available

1. `test-nested-conditionals.js` - Deep nesting → guard clauses
2. `test-nested-ternaries.js` - Nested ternaries → if/else
3. `test-magic-numbers.js` - Numbers → named constants
4. `test-duplicate-logic.js` - Duplication → shared functions
5. `test-complex-conditionals.js` - Complex booleans → named variables
6. `test-array-patterns.js` - Loops → array methods
7. `test-functionality.js` - Verify behavior preserved
8. `test-config.json` - Should NOT be simplified (filter test)

## Quick Commands

```bash
# Copy all test files
cp agent-skills/code-simplifier/tests/test-*.js .test-simplifier/

# Simplify all
/simplify .test-simplifier/*.js

# Review all changes
git diff .test-simplifier/

# Run functionality tests
node .test-simplifier/test-functionality.js
```

## Success Criteria

✅ All test files simplified appropriately
✅ No functionality broken (test-functionality.js passes)
✅ Config files skipped (test-config.json unchanged)
✅ Changes visible in git diff
✅ Settings control behavior

**Result:** Plugin is working correctly!
