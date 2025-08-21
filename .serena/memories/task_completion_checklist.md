# Task Completion Checklist

## MUST DO Before Marking Any Task Complete:

1. **Run Linting**
   ```bash
   pnpm lint
   ```
   Fix any linting errors before proceeding.

2. **Run Type Checking**
   ```bash
   pnpm --filter @coquinate/web typecheck
   ```
   Ensure no TypeScript errors.

3. **Format Code**
   ```bash
   pnpm format
   ```
   Apply consistent formatting.

4. **Run Tests**
   ```bash
   pnpm test:run
   ```
   Verify all tests pass.

5. **Check i18n**
   - No hardcoded strings in components
   - All user-facing text uses translation keys

6. **Verify Design Tokens**
   - No arbitrary Tailwind values (e.g., no `[100px]`)
   - Only use semantic tokens from design-tokens.js

7. **Test Manually**
   - Start dev server: `pnpm dev`
   - Test the feature works as expected
   - Check Romanian language displays correctly

8. **Update Task Status**
   ```bash
   task-master set-status --id=<task-id> --status=done
   ```

## Additional Checks for Specific Changes:

### For UI Components:
- Create/update Storybook stories
- Test responsive design
- Verify accessibility (keyboard navigation, ARIA labels)

### For Database Changes:
- Run migrations: `pnpm --filter @coquinate/web db:migrate`
- Update TypeScript types if needed

### For API Changes:
- Update OpenAPI documentation
- Test with Postman/Insomnia
- Verify error handling