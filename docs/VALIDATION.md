# Validation

## Automated checks

- `npm run check`: JavaScript syntax checks.
- `npm test`: 27 deterministic tests, including all twelve puzzles fully solved from clue constraints without guessing. That establishes a unique solution for each.
- `npm run build`: Vite production build, with relative asset URLs.
- CI performs the same checks and publishes only after they pass. CI does not automatically run browser gameplay.

## Browser checks

Gameplay is tested only through the production HTTP preview at `http://127.0.0.1:5214/`, never by opening files directly. Desktop Chrome is controlled through the supported browser runtime. Tests cover pointer/keyboard controls, crosses, erasing, undo/redo, completion, puzzle switching, persistence, pause/dialog interruption, hints, and responsive layouts. Actual findings and capture metadata are retained in the Arcade evidence records.

## Screenshot integrity

`public/arcade/manifest.json` uses schema version 3. The captured source JPEG and published screenshot have matching original bytes, plus SHA-256 hashes. Capture records preserve the actual browser runtime and browser version, viewport, source commit, HTTP URL, public interaction sequence, and production input hashes. There is no injected save, hidden solution shortcut, DOM modification, screenshot fabrication, or edited screenshot pixel.

Local captures are not CI captures and do not alone establish live deployment identity. Before Arcade sync, verify the deployed manifest, screenshots, records, and every production input hash. The capture source commit predates the screenshot publication commit; unchanged input hashes bind the images to the served source.

Limitations: not an exhaustive cross-browser/device/assist-parity audit. Responsive viewport testing is not a substitute for physical touch-device testing.
