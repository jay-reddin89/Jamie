```markdown
# Jamie Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns found in the "Jamie" JavaScript repository. You will learn the project's coding conventions, file organization, import/export styles, and testing approach. The guide also provides step-by-step instructions for common workflows and suggested commands to streamline your development process.

## Coding Conventions

### File Naming
- Use **camelCase** for all file names.
  - Example: `userProfile.js`, `dataFetcher.js`

### Import Style
- Use **relative imports** for modules within the project.
  - Example:
    ```javascript
    import { fetchData } from './dataFetcher';
    ```

### Export Style
- Use **named exports** for all exported functions or variables.
  - Example:
    ```javascript
    // In dataFetcher.js
    export function fetchData() { ... }
    ```

    ```javascript
    // In another file
    import { fetchData } from './dataFetcher';
    ```

### Commit Messages
- Freeform style, sometimes with prefixes.
- Average commit message length: 58 characters.
  - Example: `Add user authentication logic to login form`

## Workflows

### Adding a New Module
**Trigger:** When you need to add a new feature or utility.
**Command:** `/add-module`

1. Create a new file using camelCase naming (e.g., `newFeature.js`).
2. Implement your logic using named exports.
    ```javascript
    // newFeature.js
    export function newFeature() { ... }
    ```
3. Import your module where needed using a relative path.
    ```javascript
    import { newFeature } from './newFeature';
    ```
4. Write a corresponding test file (see Testing Patterns).

### Writing Tests
**Trigger:** When you add or modify functionality.
**Command:** `/write-test`

1. Create a test file with the pattern `*.test.*` (e.g., `newFeature.test.js`).
2. Write tests for each exported function.
    ```javascript
    // newFeature.test.js
    import { newFeature } from './newFeature';

    test('newFeature does something', () => {
      // test implementation
    });
    ```
3. Run your tests using the project's test runner (framework unknown; check project scripts).

### Refactoring Imports/Exports
**Trigger:** When reorganizing code or splitting modules.
**Command:** `/refactor-imports`

1. Ensure all imports are relative.
2. Use named exports consistently.
3. Update all import statements in dependent files.

## Testing Patterns

- Test files follow the pattern `*.test.*` (e.g., `module.test.js`).
- The specific testing framework is unknown; refer to project documentation or scripts for details.
- Example test file:
    ```javascript
    // exampleFunction.test.js
    import { exampleFunction } from './exampleFunction';

    test('exampleFunction returns expected result', () => {
      expect(exampleFunction()).toBe('expected');
    });
    ```

## Commands
| Command         | Purpose                                      |
|-----------------|----------------------------------------------|
| /add-module     | Scaffold and integrate a new module          |
| /write-test     | Create and implement tests for a module      |
| /refactor-imports | Standardize imports/exports across modules |
```
