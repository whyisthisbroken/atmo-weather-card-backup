# Changelog

## v6.5.5 - 2026-07-12

### Fixed
- clear-night is now strictly cloud-free. The night fallback cloud layer is no longer spawned for pure night atmosphere.
- sunny is now strictly cloud-free. Regular cloud count remains `0` and warm celestial sun-cloud decoration is disabled.

### Why
- `clear-night` and `sunny` should be semantically clear sky states.
- Decorative cloud overlays for these states caused confusing visuals and did not match the weather condition.
