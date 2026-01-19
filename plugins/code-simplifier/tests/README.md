# Code Simplifier Test Suite

This directory contains test files and guides for verifying the code-simplifier plugin functionality.

## Quick Start

**5-minute quick test:**
```bash
# See QUICK-TEST.md
cat QUICK-TEST.md
```

**Comprehensive testing:**
```bash
# See TEST-GUIDE.md
cat TEST-GUIDE.md
```

## Test Files

### Source Code Test Files

These files demonstrate patterns that should be simplified:

| File | Pattern | Expected Simplification |
|------|---------|------------------------|
| `test-nested-conditionals.js` | Deep nesting (5-7 levels) | Guard clauses with early returns |
| `test-nested-ternaries.js` | Nested ternary operators | If/else chains or functions |
| `test-magic-numbers.js` | Hardcoded numbers | Named constants |
| `test-duplicate-logic.js` | Repeated code patterns | Extracted shared functions |
| `test-complex-conditionals.js` | Complex boolean expressions | Named variables |
| `test-array-patterns.js` | Manual loops | Array methods (.filter, .map, etc.) |
| `test-functionality.js` | Mixed patterns + tests | Simplification with verification |

### Non-Code Test Files

These files should NOT be simplified (tests filtering):

| File | Type | Expected Behavior |
|------|------|-------------------|
| `test-config.json` | JSON config | Skip (not source code) |

## Usage

### 1. Copy Test Files

```bash
# Create test directory
mkdir -p .test-simplifier

# Copy all test files
cp agent-skills/code-simplifier/tests/test-*.js .test-simplifier/

# Initialize git for tracking changes
cd .test-simplifier
git init
git add .
git commit -m "initial test files"
cd ..
```

### 2. Test with Command

```bash
# Test single file
/simplify .test-simplifier/test-nested-conditionals.js

# Test multiple files
/simplify .test-simplifier/test-nested-conditionals.js .test-simplifier/test-magic-numbers.js

# Review changes
git diff .test-simplifier/
```

### 3. Test with Automatic Hook

In Claude Code, write a new file:
```
Create .test-simplifier/example.js with nested conditionals
```

The PostToolUse hook should automatically trigger simplification.

### 4. Verify Functionality Preserved

After simplification, run the functionality test:
```bash
node .test-simplifier/test-functionality.js
```

All tests should pass, proving functionality is preserved.

## Test Patterns

### Nested Conditionals
**Before:**
```javascript
if (user) {
  if (user.email) {
    if (user.age >= 18) {
      return true;
    }
  }
}
return false;
```

**After:**
```javascript
if (!user) return false;
if (!user.email) return false;
if (user.age < 18) return false;
return true;
```

### Nested Ternaries
**Before:**
```javascript
const access = isAdmin ? 'full' : (isModerator ? 'moderate' : 'limited');
```

**After:**
```javascript
function determineAccess(isAdmin, isModerator) {
  if (isAdmin) return 'full';
  if (isModerator) return 'moderate';
  return 'limited';
}
const access = determineAccess(isAdmin, isModerator);
```

### Magic Numbers
**Before:**
```javascript
if (age >= 18 && age < 65) {
  return true;
}
```

**After:**
```javascript
const WORKING_AGE_MIN = 18;
const WORKING_AGE_MAX = 65;

if (age >= WORKING_AGE_MIN && age < WORKING_AGE_MAX) {
  return true;
}
```

## Test Scenarios

### Scenario 1: Basic Simplification
1. Copy `test-nested-conditionals.js`
2. Run `/simplify` on it
3. Verify guard clauses applied
4. Check git diff shows improvements

### Scenario 2: Automatic Trigger
1. Write new file with complex code
2. Hook triggers automatically
3. Simplifications applied
4. Summary message shown

### Scenario 3: Settings Control
1. Configure `.claude/code-simplifier.local.md`
2. Test different verbosity levels
3. Test excludePatterns
4. Test customRules

### Scenario 4: Filtering
1. Edit `test-config.json`
2. Should NOT trigger simplification
3. File remains unchanged

## Success Criteria

✅ **All test files simplified appropriately**
- Nested conditionals → Guard clauses
- Nested ternaries → If/else or functions
- Magic numbers → Named constants
- Duplicate logic → Shared functions
- Complex conditions → Named variables
- Manual loops → Array methods

✅ **Functionality preserved**
- `test-functionality.js` passes all tests
- No behavior changes
- Only style improvements

✅ **Filtering works correctly**
- JSON files skipped
- Excluded directories skipped
- Only source code processed

✅ **Settings respected**
- Verbosity controls output
- Exclude patterns honored
- Custom rules applied

## Troubleshooting

**Test file not simplified:**
- Check file is actually complex (needs simplification)
- Verify not in excluded directory
- Check settings `enabled: true`
- Review agent output for reasoning

**Functionality test fails:**
- Simplification changed behavior (bug!)
- Review git diff to identify breaking change
- Report issue with specific example

**Config file simplified (shouldn't be):**
- Filtering not working (bug!)
- Check hook prompt criteria
- Report issue

## Reporting Results

After testing, document:
1. Which tests passed/failed
2. Unexpected behavior
3. Performance (time taken)
4. Quality of simplifications
5. Any bugs found

## Next Steps

After successful testing:
1. Review all changes carefully
2. Run your project's test suite
3. Configure settings for your needs
4. Use in production with confidence

## Additional Resources

- `QUICK-TEST.md` - 5-minute quick test
- `TEST-GUIDE.md` - Comprehensive test guide
- `../README.md` - Plugin documentation
- `../skills/code-simplification/examples/` - More examples
