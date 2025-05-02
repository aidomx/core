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
