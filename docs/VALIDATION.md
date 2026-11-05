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

## Observed local results, 2026-11-05

- Chrome 157.0.8103.38, production HTTP preview, desktop 1440×1000 and mobile-sized 390×844 viewports.
- Keyboard Space filled the focused cell, X/Space marked its neighbor, and horizontal arrow movement stayed within the row.
- A real five-cell pointer drag produced five fills; one undo removed the whole stroke and redo restored it.
- Reset cancellation preserved marks; confirmed reset cleared marks/time. Pause obscured the board and disabled hints. Help dismissed cleanly.
- Puzzle 1 was completed through public inputs without marking every empty cell. The title/artwork and 1/12 completion persisted after reload.
- Enabling error checking on a completed unassisted puzzle did not rewrite its label.
- Hint cancellation left zero marks; a confirmed start hint produced nine row/column marks on a 5×5 board. Undo preserved the assisted flag. Error checking changed a known empty cell to a cross.
- The 20×15 board rendered 300 cells in the mobile viewport; fill/mark controls worked and the document had no horizontal overflow. The board and collection may scroll horizontally at small widths. A real touch device was not tested.
- No game-origin console errors were observed; Chrome extension warnings were unrelated.
- Two reviewed full-page genuine JPEG screenshots record the completed 5×5 and partially solved 10×10 states. No private information is present.
- Added one screenshot-integrity test after capture: 28 total tests.
