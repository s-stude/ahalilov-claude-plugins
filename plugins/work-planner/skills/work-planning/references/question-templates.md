# Question Templates Reference

This document provides templates for asking effective clarifying questions during the planning process.

## Overview

Asking the right questions at the right time ensures plans align with user expectations. This guide provides templates for different planning scenarios and decision points.

## General Question Principles

### When to Ask Questions

Ask questions when:
- Requirements are ambiguous or incomplete
- Multiple valid approaches exist
- User preferences affect implementation
- Trade-offs need user input
- Assumptions need confirmation

Don't ask when:
- Answer is obvious from context
- Industry standard approach exists
- Technical decision with clear best practice
- Question can be answered by exploring codebase

### Question Structure

Good questions follow this structure:

```markdown
**Question:** [Clear, specific question]

**Context:** [Why this question matters]

**Option 1:** [Approach name]
- Description: [What this involves]
- Pros: [Key advantages]
- Cons: [Key disadvantages]

**Option 2:** [Approach name]
- Description: [What this involves]
- Pros: [Key advantages]
- Cons: [Key disadvantages]

**Recommendation:** [Your suggested approach and rationale]
```

### Question Quality Guidelines

**Good Questions:**
- Present 2-3 viable options
- Include relevant trade-offs
- Provide clear recommendation
- Focus on decisions user should make
- Are specific and actionable

**Bad Questions:**
- Ask user to make purely technical decisions
- Present too many options (4+)
- Lack context or trade-offs
- Ask questions already answered in requirements
- Are too vague or open-ended

## Feature Implementation Questions

### Library Selection Questions

**Template:**
```markdown
**Question:** Which [library type] should I use for [functionality]?

**Context:** The implementation requires [capability]. The codebase currently uses [existing libraries].

**Option 1:** [Library A]
- Description: [What it does]
- Pros: [Advantages - features, community, size, compatibility]
- Cons: [Disadvantages - limitations, complexity, bundle size]

**Option 2:** [Library B]
- Description: [What it does]
- Pros: [Advantages]
- Cons: [Disadvantages]

**Recommendation:** I recommend [choice] because [rationale matching project needs].
```

**Example:**
```markdown
**Question:** Which date handling library should I use for the scheduling feature?

**Context:** The implementation requires date parsing, formatting, and timezone handling. The codebase doesn't currently use a date library.

**Option 1:** date-fns
- Description: Modern JavaScript date utility library
- Pros: Tree-shakeable, lightweight (only ~13KB with required functions), TypeScript support, immutable
- Cons: Requires importing multiple functions, less feature-rich than moment

**Option 2:** Day.js
- Description: Minimalist library with Moment.js-compatible API
- Pros: Very small (2KB), familiar API, plugin system for timezone support
- Cons: Smaller ecosystem, fewer advanced features

**Recommendation:** I recommend date-fns because it's lightweight, tree-shakeable (important for bundle size), and has excellent TypeScript support which matches your project's tech stack.
```

### Feature Behavior Questions

**Template:**
```markdown
**Question:** How should [feature] behave when [scenario]?

**Context:** [Description of the scenario and why it matters]

**Option 1:** [Behavior A]
- Users experience: [What users see/feel]
- Implementation: [Technical approach]

**Option 2:** [Behavior B]
- Users experience: [What users see/feel]
- Implementation: [Technical approach]

**Recommendation:** [Choice] because [user experience or technical rationale].
```

**Example:**
```markdown
**Question:** How should the form behave when validation fails?

**Context:** Users might submit the form with invalid data. We need to decide on the validation feedback approach.

**Option 1:** Inline validation (validate on blur)
- Users experience: See errors immediately after leaving each field, faster feedback
- Implementation: Add blur event handlers, show errors per field

**Option 2:** Submit validation (validate on submit)
- Users experience: See all errors at once after submission, less interruption
- Implementation: Validate on submit, show error summary at top

**Recommendation:** Inline validation provides better UX by catching errors early, preventing frustration of fixing multiple errors after submission.
```

### Integration Questions

**Template:**
```markdown
**Question:** How should [system A] integrate with [system B]?

**Context:** [Description of integration need and constraints]

**Option 1:** [Integration approach A]
- Architecture: [How systems communicate]
- Pros: [Performance, maintainability, scalability]
- Cons: [Complexity, coupling, limitations]

**Option 2:** [Integration approach B]
- Architecture: [How systems communicate]
- Pros: [Advantages]
- Cons: [Disadvantages]

**Recommendation:** [Choice] because [architectural rationale].
```

## Bug Fix Questions

### Root Cause Questions

**Template:**
```markdown
**Question:** I've identified [number] potential root causes for [bug]. Which should I investigate first?

**Context:** [Bug description and impact]

**Potential Cause 1:** [Description]
- Likelihood: [High/Medium/Low]
- Investigation effort: [Time/complexity]

**Potential Cause 2:** [Description]
- Likelihood: [High/Medium/Low]
- Investigation effort: [Time/complexity]

**Recommendation:** Investigate [cause] first because [rationale based on likelihood and impact].
```

### Fix Approach Questions

**Template:**
```markdown
**Question:** How should I fix [bug]?

**Context:** [Root cause and affected systems]

**Option 1:** [Quick fix]
- Approach: [What it does]
- Pros: Fast, low risk, minimal changes
- Cons: May not address root cause, potential technical debt

**Option 2:** [Comprehensive fix]
- Approach: [What it does]
- Pros: Addresses root cause, prevents similar bugs
- Cons: More changes, higher risk, more testing needed

**Recommendation:** [Choice] because [balance of risk, thoroughness, and project needs].
```

## Refactoring Questions

### Approach Questions

**Template:**
```markdown
**Question:** Should I refactor [component] using [approach A] or [approach B]?

**Context:** [Current structure and problems]

**Option 1:** [Approach A]
- Description: [New structure]
- Impact: [What changes, breaking changes]
- Benefits: [Improvements in maintainability, performance, etc.]

**Option 2:** [Approach B]
- Description: [New structure]
- Impact: [What changes]
- Benefits: [Improvements]

**Recommendation:** [Choice] because [alignment with codebase patterns and goals].
```

### Migration Strategy Questions

**Template:**
```markdown
**Question:** How should I migrate from [old pattern] to [new pattern]?

**Context:** [Number of affected files/components and usage patterns]

**Option 1:** Big bang migration
- Approach: Update all files at once
- Pros: Clean cutover, no mixed patterns
- Cons: Higher risk, harder to review, potential for breakage

**Option 2:** Gradual migration
- Approach: Update incrementally, allow both patterns temporarily
- Pros: Lower risk, easier to review, can pause if issues arise
- Cons: Mixed patterns temporarily, longer migration period

**Recommendation:** [Choice] because [risk tolerance and project constraints].
```

## Architecture Questions

### Pattern Selection Questions

**Template:**
```markdown
**Question:** Which architectural pattern should I use for [functionality]?

**Context:** [System requirements and constraints]

**Option 1:** [Pattern A]
- Structure: [How it organizes code]
- Fits project because: [Alignment with existing patterns]
- Trade-offs: [Benefits and costs]

**Option 2:** [Pattern B]
- Structure: [How it organizes code]
- Fits project because: [Alignment]
- Trade-offs: [Benefits and costs]

**Recommendation:** [Choice] because [architectural consistency and requirements].
```

### Modularity Questions

**Template:**
```markdown
**Question:** Should [feature] be a separate module or part of [existing module]?

**Context:** [Feature scope and relationships]

**Option 1:** New separate module
- Structure: [Module organization]
- Pros: Clear boundaries, independent testing, easier to remove
- Cons: More boilerplate, potential over-engineering

**Option 2:** Extend existing module
- Structure: [How it fits]
- Pros: Less boilerplate, leverages existing infrastructure
- Cons: Increases module complexity, tighter coupling

**Recommendation:** [Choice] because [module size and cohesion considerations].
```

## Implementation Detail Questions

### Error Handling Questions

**Template:**
```markdown
**Question:** How should [function/module] handle errors?

**Context:** [Error scenarios and impact]

**Option 1:** Throw exceptions
- Behavior: Errors propagate up call stack
- Use when: Errors are exceptional, caller should handle
- Project fit: [Match with existing error handling]

**Option 2:** Return error objects
- Behavior: Explicit error returns, caller must check
- Use when: Errors are expected, functional programming style
- Project fit: [Match with existing patterns]

**Recommendation:** [Choice] because [consistency with codebase error handling patterns].
```

### Performance Questions

**Template:**
```markdown
**Question:** Should I optimize [operation] for performance?

**Context:** [Current performance and requirements]

**Option 1:** Optimize now
- Approach: [Optimization technique]
- Benefits: [Performance improvements]
- Costs: [Complexity, maintainability trade-offs]

**Option 2:** Defer optimization
- Approach: Simple implementation first
- Benefits: Faster to implement, easier to maintain
- Costs: May need optimization later

**Recommendation:** [Choice] because [performance requirements and premature optimization concerns].
```

### State Management Questions

**Template:**
```markdown
**Question:** Where should [state] be stored?

**Context:** [State usage patterns and scope]

**Option 1:** Component state
- Scope: Local to component
- Use when: State used only in component tree
- Implementation: useState/ref

**Option 2:** Global state
- Scope: Application-wide
- Use when: State shared across app
- Implementation: Redux/Context/Pinia

**Recommendation:** [Choice] because [state scope and sharing requirements].
```

## Priority and Scope Questions

### Scope Questions

**Template:**
```markdown
**Question:** Should I implement [full scope] or [reduced scope]?

**Context:** [Full requirements vs. core requirements]

**Option 1:** Full scope
- Includes: [All features]
- Benefits: Complete solution, no follow-up needed
- Effort: [Relative effort]

**Option 2:** Reduced scope (MVP)
- Includes: [Core features only]
- Benefits: Faster delivery, gather feedback early
- Effort: [Relative effort]

**Recommendation:** [Choice] because [project timeline and feedback needs].
```

### Backward Compatibility Questions

**Template:**
```markdown
**Question:** Should this change maintain backward compatibility?

**Context:** [Existing API/interface usage and users]

**Option 1:** Maintain compatibility
- Approach: [How to preserve old interface]
- Pros: No breaking changes, smooth upgrade
- Cons: More complex, technical debt

**Option 2:** Breaking change
- Approach: [New interface, migration guide]
- Pros: Cleaner API, removes technical debt
- Cons: Users must migrate, potential disruption

**Recommendation:** [Choice] because [API stability needs and version policy].
```

## Question Anti-Patterns

### Avoid These Question Types

**Too Technical:**
```
❌ "Should I use a higher-order function or class inheritance?"
✅ "Should I structure the plugin system with hooks or classes?"
```

**Too Open-Ended:**
```
❌ "How should I implement this feature?"
✅ "Should the feature use real-time updates or periodic polling?"
```

**Already Answered:**
```
❌ Asking about requirements user already specified
✅ Asking about ambiguities or unstated requirements
```

**False Choices:**
```
❌ Presenting clearly inferior options
✅ Presenting genuinely viable alternatives
```

## Tips for Effective Questions

1. **Ask early**: Don't wait until plan is complete
2. **Be specific**: Focus questions on specific decisions
3. **Provide context**: Explain why the question matters
4. **Recommend**: Always provide your recommendation
5. **Limit options**: 2-3 options maximum
6. **Show trade-offs**: Help user understand implications
7. **Match expertise**: Ask user about domain/product decisions, not pure technical decisions
8. **Group related**: Ask related questions together

Use these templates to ask clear, actionable questions that help users guide the planning process toward successful implementations.
