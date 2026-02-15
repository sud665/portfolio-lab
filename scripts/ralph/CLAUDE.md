# Ralph Iteration Prompt

Read the prd.json file in scripts/ralph/prd.json.
Read the progress.txt file in scripts/ralph/progress.txt (if it exists).
Read the CLAUDE.md in the project root for coding conventions.

## Your Task

1. Find the FIRST user story where "passes": false
2. Implement ONLY that one story
3. Run the quality checks specified in the story's acceptance criteria
4. If checks pass:
   - Stage and commit your changes with a descriptive message
   - Update prd.json to set that story's "passes": true
   - Append what you learned to progress.txt
5. If checks fail:
   - Fix the issues and retry
   - If stuck after 3 attempts, document the blocker in progress.txt

## Quality Gates
- npx tsc --noEmit must pass
- npm run build must pass

## Rules
- Implement ONE story per iteration only
- Follow the coding conventions in root CLAUDE.md strictly
- Keep changes small and focused
- Commit after eachy

When ALL stories have "passes": true, output:
<promise>COMPLETE</promise>
