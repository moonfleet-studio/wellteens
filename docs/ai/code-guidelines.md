# Coding Guidelines

- Language & stack: TypeScript with React Native via Expo Router.
- Project structure: use file-based routing under `app/`; prefer colocating UI, hooks, and tests near their usage.
- Typing: favour explicit interfaces/types for component props and function params; leverage React Native types.
- Styling: prefer cross-platform styling via `StyleSheet` or utility helpers; ensure accessible color contrast and scalable typography for teen users.
- State: use React hooks or context; avoid untracked globals. Introduce state libraries only if complexity demands.
- Comments: only add concise comments that explain non-obvious intent or complex logic.
- Imports: maintain sorted, absolute/relative paths consistent with existing conventions; remove unused code.
- Performance & accessibility: minimize unnecessary re-renders, and respect reduced motion preferences.
