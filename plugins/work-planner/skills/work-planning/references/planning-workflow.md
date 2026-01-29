# Planning Workflow Reference

This document provides detailed guidance for each step of the work planning process.

## Overview

The planning workflow consists of 5 interconnected steps that build upon each other:

1. **Understand the Request** - Parse and clarify what needs to be done
2. **Explore the Codebase** - Discover patterns and existing implementations
3. **Identify Implementation Points** - Map out where changes will occur
4. **Ask Clarifying Questions** - Resolve ambiguities and choose approaches
5. **Propose Detailed Plan** - Document comprehensive implementation strategy

## Step 1: Understand the Request

### Parse the Request

Break down the user's message into structured components:

**Task Type Classification:**
- Feature addition: New functionality
- Bug fix: Correcting incorrect behavior
- Refactoring: Improving code structure without changing behavior
- Integration: Connecting external services or systems
- Enhancement: Improving existing features
- Documentation: Adding or updating docs

**Scope Determination:**
- Single file: Changes isolated to one file
- Module: Changes within one module or directory
- Cross-module: Changes spanning multiple modules
- System-wide: Architectural or infrastructure changes

**Requirement Extraction:**
- Functional requirements: What the code must do
- Non-functional requirements: Performance, security, scalability
- User expectations: Implicit assumptions about behavior
- Edge cases: Boundary conditions and error scenarios

### Identify Constraints

Look for limitations that affect implementation:

**Technical Constraints:**
- Backward compatibility requirements
- API stability guarantees
- Performance requirements
- Browser or platform compatibility
- Framework or library limitations

**Business Constraints:**
- Timeline or deadline pressure
- Resource availability
- Budget limitations
- Regulatory compliance

**Project Constraints:**
- Coding standards and style guides
- Architecture patterns to follow
- Testing requirements
- Documentation standards

### Define Success Criteria

Determine how to verify the implementation works:

**Functional Verification:**
- Core functionality works as expected
- Edge cases are handled
- Error conditions produce correct behavior
- Integration points work correctly

**Non-Functional Verification:**
- Performance meets requirements
- Security vulnerabilities addressed
- Accessibility standards met
- Code quality standards maintained

**Testing Verification:**
- Unit tests pass
- Integration tests pass
- Manual testing scenarios defined
- Regression testing completed

### Clarify Ambiguities

Identify areas needing clarification:

**Common Ambiguities:**
- Exact behavior in edge cases
- UI/UX design specifics
- Error handling approach
- Data validation rules
- Backward compatibility needs
- Migration strategy for existing data

**When to Ask Questions:**
- Requirements are vague or incomplete
- Multiple valid interpretations exist
- User expectations unclear
- Technical approach needs confirmation
- Trade-offs need user input

## Step 2: Explore the Codebase

### Initial Survey

Start with a broad understanding:

**Project Structure:**
- Review top-level directory structure
- Identify main modules and their purposes
- Locate entry points (main files, routes, app initialization)
- Find configuration files

**Technology Stack:**
- Identify programming language and version
- Determine framework and major libraries
- Check build tools and package manager
- Review test framework

**Documentation:**
- Read README.md for project overview
- Check CLAUDE.md for coding standards
- Review CONTRIBUTING.md for guidelines
- Look for architecture docs

### Find Similar Implementations

Locate existing code that resembles the task:

**For Feature Additions:**
- Find similar features already implemented
- Search for related components or modules
- Look for parallel functionality in codebase
- Identify patterns to replicate

**For Bug Fixes:**
- Locate the buggy code
- Find related test files
- Search for similar bugs previously fixed
- Review issue tracker or comments

**For Refactoring:**
- Identify all code to be refactored
- Find dependencies on code to change
- Locate tests covering the code
- Map out data flows through the code

### Understand Patterns and Conventions

Learn how the project organizes code:

**Naming Conventions:**
- File naming patterns
- Variable and function naming styles
- Class and interface naming
- Constant naming

**Code Organization:**
- Directory structure patterns
- Module boundaries
- File size conventions
- Import/export patterns

**Design Patterns:**
- MVC, MVVM, or other architectural patterns
- Service layer patterns
- Repository patterns
- Factory or builder patterns
- Observer or pub/sub patterns

**Framework Patterns:**
- React: Component patterns, hooks usage, state management
- Vue: Component structure, composables, store usage
- Express: Middleware patterns, route organization
- Django: View patterns, model structure

### Map Dependencies

Understand how components relate:

**Import Chain Analysis:**
- What modules does target code import?
- What modules import target code?
- Are there circular dependencies?
- What shared utilities exist?

**Data Flow:**
- How does data enter the system?
- How is data transformed?
- Where is data stored or persisted?
- How is data returned or displayed?

**External Dependencies:**
- Third-party libraries used
- API integrations
- Database connections
- File system interactions

### Locate Test Structure

Understand how testing works:

**Test Organization:**
- Where are test files located?
- How are tests named?
- What test framework is used?
- What's the test coverage?

**Test Patterns:**
- Unit test patterns
- Integration test patterns
- E2E test patterns
- Mock and stub usage

**Test Infrastructure:**
- Test setup and teardown patterns
- Test data management
- Fixture usage
- Test utilities and helpers

## Step 3: Identify Implementation Points

### Map Critical Files

Determine exactly which files need changes:

**Primary Implementation Files:**
- Core logic files to modify
- New files to create
- Configuration files to update
- Migration files needed

**Supporting Files:**
- Test files to update or create
- Type definition files
- Documentation files
- Example or demo files

**Infrastructure Files:**
- Build configuration
- CI/CD pipeline configs
- Environment variable templates
- Database schema files

### Determine Change Order

Plan the sequence of changes:

**Dependency-Driven Order:**
1. Infrastructure changes first (database, config)
2. Low-level utility changes
3. Core business logic changes
4. API or interface changes
5. UI or presentation layer changes
6. Tests and documentation

**Risk-Driven Order:**
1. Safest changes first
2. Reversible changes before irreversible
3. Small changes before large
4. Well-understood changes before experimental

**Iterative Approach:**
1. Minimal working implementation
2. Add core functionality
3. Add edge case handling
4. Add optimizations
5. Add polish and refinements

### Assess Change Impact

Evaluate ripple effects:

**Breaking Changes:**
- Will this break existing APIs?
- Will this affect existing users?
- Will this require migration?
- Will this affect other systems?

**Performance Impact:**
- Will this affect response times?
- Will this increase resource usage?
- Will this affect database load?
- Will this change caching behavior?

**Security Impact:**
- Does this introduce vulnerabilities?
- Does this affect authentication?
- Does this handle sensitive data?
- Does this change access control?

**Maintenance Impact:**
- Does this increase complexity?
- Does this add technical debt?
- Does this improve maintainability?
- Does this affect debugging?

## Step 4: Ask Clarifying Questions

### Question Types

Different scenarios need different questions:

**Implementation Approach Questions:**
- "Should I use library X or implement custom solution?"
- "Should this be synchronous or asynchronous?"
- "Should errors throw exceptions or return error objects?"

**Feature Behavior Questions:**
- "Should this work offline?"
- "What should happen if validation fails?"
- "Should this be backward compatible?"

**Architecture Questions:**
- "Should this be a new module or part of existing?"
- "Should this use existing patterns or introduce new?"
- "Should this be configurable or hardcoded?"

**Priority Questions:**
- "Should I prioritize performance or readability?"
- "Should I handle all edge cases or common cases first?"
- "Should I add tests or focus on implementation?"

### Presenting Options

Frame questions effectively:

**Option Structure:**
```
Question: [Clear question statement]

Option 1: [Approach name]
- Description: [What this involves]
- Pros: [Advantages]
- Cons: [Disadvantages]
- Effort: [Relative effort level]

Option 2: [Approach name]
- Description: [What this involves]
- Pros: [Advantages]
- Cons: [Disadvantages]
- Effort: [Relative effort level]

Recommendation: [Your recommended approach and why]
```

**Good Question Examples:**
- Present 2-3 viable options
- Include trade-offs for each
- Provide recommendation with rationale
- Ask specific, focused questions

**Bad Question Examples:**
- Too many options (overwhelming)
- No context or rationale
- Asking user to make technical decisions without guidance
- Yes/no questions when options should be presented

## Step 5: Propose Detailed Plan

### Plan Components

Every plan should include:

**1. Understanding Section:**
- Restate user request in clear terms
- Confirm requirements understood
- State scope boundaries
- List success criteria

**2. Context Section:**
- Key patterns discovered in codebase
- Relevant existing implementations
- Project conventions to follow
- Constraints to respect

**3. Approach Section:**
- Chosen implementation strategy
- Rationale for approach
- Why alternatives weren't chosen
- High-level architecture

**4. Critical Files Section:**
- List each file to modify or create
- Explain purpose of each change
- Show file structure if creating new files
- Note any file deletions

**5. Implementation Steps:**
- Ordered, detailed steps
- Each step includes file, action, rationale
- Clear dependencies between steps
- Verification points throughout

**6. Dependencies Section:**
- External libraries to add
- Version requirements
- Installation commands
- Compatibility considerations

**7. Testing Strategy:**
- What tests to write
- How to verify manually
- Edge cases to test
- Regression testing approach

**8. Risks Section:**
- Potential issues identified
- Mitigation strategies
- Rollback plans
- Monitoring recommendations

**9. Alternatives Considered:**
- Other approaches evaluated
- Why not chosen
- Trade-offs analysis
- Future considerations

### Step Detail Level

Each implementation step should include:

**Step Template:**
```
### Step N: [Clear action description]

**File:** `path/to/file.ts`

**Action:**
[Detailed description of what will be done]

**Rationale:**
[Why this approach, why this location, why now]

**Dependencies:**
[What must be done before this step]

**Verification:**
[How to confirm this step worked]
```

**Good Step Examples:**
- Specific file paths
- Clear action verbs
- Sufficient detail to implement without guessing
- Rationale helps understand decisions

**Bad Step Examples:**
- Vague actions like "update the code"
- No file paths specified
- Missing rationale
- Steps that combine too many actions

### Plan Review Checklist

Before presenting the plan:

- [ ] All user requirements addressed
- [ ] Implementation approach clearly stated
- [ ] All critical files identified
- [ ] Steps are ordered correctly
- [ ] Dependencies are clear
- [ ] Risks are identified
- [ ] Testing strategy defined
- [ ] Rationale provided for decisions
- [ ] Plan is actionable and complete

## Decision Trees

### Task Type Decision Tree

```
Is it a feature addition?
├─ Yes: Focus on integration points and patterns
├─ No: Is it a bug fix?
   ├─ Yes: Focus on root cause and verification
   └─ No: Is it refactoring?
      ├─ Yes: Focus on behavior preservation
      └─ No: Treat as integration or enhancement
```

### Exploration Depth Decision Tree

```
Is the codebase small (<100 files)?
├─ Yes: Can explore more thoroughly
├─ No: Is the task localized?
   ├─ Yes: Focus exploration on relevant modules
   └─ No: Sample key areas, use search patterns
```

### Question Decision Tree

```
Are requirements clear?
├─ Yes: Proceed to exploration
├─ No: Are there multiple valid interpretations?
   ├─ Yes: Ask clarifying questions
   └─ No: Is user expertise needed?
      ├─ Yes: Ask for guidance
      └─ No: Make reasonable assumptions and note them
```

## Common Workflow Variations

### Quick Planning (Small Tasks)

For simple tasks, streamline:
1. Brief requirement check
2. Find similar code
3. Identify 1-3 files to change
4. Simple step list
5. Brief plan (can be verbal)

### Thorough Planning (Complex Tasks)

For complex tasks, expand:
1. Detailed requirement analysis
2. Extensive codebase exploration
3. Multiple questions to user
4. Detailed impact analysis
5. Comprehensive written plan

### Iterative Planning (Uncertain Tasks)

For uncertain tasks, iterate:
1. Initial high-level plan
2. Implement first phase
3. Learn from implementation
4. Refine plan for next phase
5. Repeat until complete

Follow these workflow patterns to create effective, actionable plans that lead to successful implementations.
