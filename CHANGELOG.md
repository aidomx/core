# Changelog

All significant changes to this project will be documented here.

### Format:

- **Added**: New features
- **Changed**: Modifications in existing behavior or structure
- **Deprecated**: Features soon to be removed
- **Removed**: Features that have been removed
- **Fixed**: Bug fixes
- **Security**: Security-related updates
- **Notes**: Important notes on some system-related matters.

---

## [0.1.6] - May 24, 2025

### Added

- Added `benchmark.ts` and `conditional.ts` in `utils` for logic and performance measurement purposes.
- Added `reactive.ts` file for reactive state management.
- Added `flow.ts` and `flowSchedule` systems to support modular and structured execution.
- Added new modular structure support to `tasks/` and `config/`.
- Added payload system for more structured validation and parsing.

### Changed

- Rewrote `defineConfig` to be more flexible and optimized.
- Moved and tidied up `rulesKey`, removed obsolete keys like `ghostId`, `storeKey`, `cacheKey`.
- Major refactor of `src/_caches/` structure, removing deprecated `Initializer.ts`, `setMap.ts` and `getMap.ts` files.
- Optimized `rules/settings.ts`, `rules/store`, and `virtual/index.ts` to connect to each other more efficiently.
- Simplified `secureRules` and `secureData`.
- Major refactor of `types/rules`, moving types to modular directories (`types/tasks/`, `types/config/`).

### Removed

- Removed `useRules`, `hooks`, and related hooks files as they are no longer used after integration into `settings`.
- Removed obsolete constants: `ghostId`, `storeKey`, `cacheKey`.

## [0.1.2] - May 8, 2025

### Added

- Added support for external event handlers via the `use` property in `defineConfig`.
- Introduced new modular folders:
  - `src/_events/` for defining and managing internal events.
  - `src/rules/actions/` for rule-based logic actions.
  - `src/rules/hooks/` for composing logic such as `useRules`.
  - `src/rules/settings.ts` for dynamic rule management system.
  - `src/_caches/getMap.ts` and `setMap.ts` for granular cache abstraction.

### Changed

- Major refactor: `defineRules` is now `defineConfig` to support more flexible rule configuration.
- Removed and modularized `virtual/actions.ts` functionality.
- Improved modularity and stability in `virtual/index.ts`.
- Refactored and relocated types into clearer structures (`types/rules`, `types/events`, etc.).

### Removed

- `src/rules/virtual/actions.ts` has been removed and replaced with more modular handling.

### Fixed

- Stabilized the `rupa` system to support operations like `add`, `update`, `reset`, etc.
- Adjusted dynamic ID handling in `ghostId.ts`.

### Docs

- Documentation updated to reflect the new API structure (`use`, `connect`, `spawn`, etc.).
- Added `.env` setup example and configuration guide.

## [0.1.1] - 3 May, 2025

### Removed

- Deprecated `rules.routes` and `rules.debug` have been fully removed.
- Removed utilities: `normalizeRules.ts`, `resolvedPath.ts`, and `shallowEqual.ts` as they are no longer relevant.

### Changed

- Simplified rule handling logic, now fully scoped to `createVirtual` and component rendering.
- Updated internal typings to reflect removal of routes/debug.

### Notes

- System is now more predictable and minimal, focusing only on virtual-driven rendering.

## [0.1.0] - 2 May, 2025

### Added

- Added `theme` type in preparation for theme support in UI components.

### Fixed

- Fixed incorrect flat data returned when using `vr.pullGhost`.
- Resolved several internal compatibility issues.

### Deprecated

- `rules.routes` is deprecated due to unreliable behavior and should not be used.
- `rules.debug` is no longer recommended as it provides minimal benefit, but it remains available.

### Notes

- This is the initial version considered stable enough for limited production use.

## [0.0.1] - May 1, 2025

### Added

- Initial release of `@aidomx/core`
- Includes:
  - `createVirtual`, `createGhost`, `spawnGhosts`, `sortGhost`
  - `createStore`, `rupa`, `ctx`-based manipulation APIs
  - Identity-driven state and virtual structure system
- Fully decoupled from rendering logic
