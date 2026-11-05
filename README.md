# Quiet Grid

**A little logic. A lovely discovery.** An original collection of twelve nonogram pictures inspired by the **Classic Picross mode of Picross S (2017)**.

[Play Quiet Grid](https://intrepion.github.io/kata-inspired-by-picross-codex-dot/) · [Back to Kata Arcade](https://intrepion.github.io/)

## Gameplay

Each number describes the length of a continuous run of filled squares. Read row clues left to right and column clues top to bottom. Separate consecutive runs with at least one empty square. Extra empty squares may occur before, after, or between runs. Crosses are notes for known empty squares. A picture is complete when all and only its intended squares are filled; crosses are optional.

Twelve original pictures span 5 × 5, 10 × 10, 15 × 15, and 20 × 15 grids. Every puzzle has a unique solution proven by a line-consensus solver that uses only its clues, without guessing or looking at the artwork. Puzzle names remain hidden until completed.

### Controls

- Click/tap and drag to fill. Clicking a square matching your tool erases it; a drag applies that initial action to all visited squares.
- Right-click or Shift-click to mark ×. Use the on-screen **Fill / Mark / Erase** tools for touch.
- F / X / E selects fill / cross / erase. Arrow keys move the selected square; Space or Enter draws.
- Ctrl/⌘ Z undoes a stroke; Ctrl/⌘ Y or Ctrl/⌘ Shift Z redoes it.
- Escape or the pause control hides the board and stops the timer. Switching away from the page automatically pauses.
- Restart affects only the current puzzle and asks first. Selecting another puzzle saves current progress.

### Assistance

**Auto-gray completed lines** compares the current filled-run sequence with the clue sequence. It does not consult the answer and does not certify that a placement is globally correct. With auto-gray off, click a row or column's clues to mark it manually.

**Check incorrect fills** converts a wrong fill to ×. **Reveal one row + column** is available only before any marks are made and reveals a randomly selected row and column. Both mark a solve as assisted. Undoing assistance does not remove that label. No lives, countdown, or time penalties are used.

Progress is saved locally in this browser. No account, analytics, external fonts, server storage, or runtime CDN is required. Clearing site data removes progress. Sound is optional, off by default, and synthesized locally.

## Fidelity and deliberate limits

This faithfully implements the underlying monochrome nonogram rules. It is **not an exact reproduction of every Picross edition**. Research targets Classic Picross S, with browser-adapted controls, whole-line clue graying, simple start-only row/column hints, and reversible editing. Assist behavior and timing differ among editions; no unverified historical penalty system is claimed.

Not implemented: Mega Picross, Color Picross, Clip Picross, Extra, multiplayer, console control layouts, the commercial puzzle catalog, animation/audio, exact hint roulette presentation, partial-clue graying, or proprietary UI. Our undo is an explicit adaptation, not a claim that the original Picross S had Picross S9's Rewind feature. See [research and fidelity notes](docs/RESEARCH.md).

This is a two-dimensional logic puzzle. A 3D library would obscure clue alignment, so the implementation deliberately uses a crisp semantic HTML/CSS grid instead.

## Run locally

Requires Node.js 22.12+ or Node 24 and npm.

```sh
npm ci
npm run dev
# Open http://127.0.0.1:5214/
```

Production verification:

```sh
npm run check
npm test
npm run build
npm run preview
# Open http://127.0.0.1:5214/ (stop the dev server first)
```

**Always run an HTTP server. Never test gameplay by opening a file directly or using a file URL.** Relative asset paths support GitHub Pages subdirectories. CI runs syntax checks, 28 deterministic rules/save/solver and screenshot-integrity tests, and a production build before publishing via GitHub Pages. Browser gameplay testing is separately documented and is not implied by CI.

## Repository

- `src/engine.js`: pure clue generation, cell rules, save validation, and deduction solver.
- `src/puzzles.js`: twelve original binary drawings.
- `src/main.js`: accessible UI controls, history, pause, hints, timer, and persistence.
- `src/style.css`: responsive layout with reduced-motion support.
- `tests/engine.test.js`: rules and no-guess uniqueness proofs.
- `public/arcade/`: reviewed screenshots, source evidence, capture records, and manifest.
- `.github/workflows/deploy.yml`: exact-commit checks/build/Pages deployment.

## Screenshots and verification

See [validation notes](docs/VALIDATION.md). The Arcade screenshots are genuine local production-game browser captures from `http://127.0.0.1:5214/`, reached through public controls. Their original JPEG bytes are retained without pixel editing. Schema-v3 records name the actual `cua_repl` browser runtime, source commit, viewport, capture steps, and hashes of every served game input. They are not labeled as Playwright or CI captures. Publishing the screenshots does not by itself prove equivalence to a live build; published input and screenshot hashes are checked separately before the Arcade snapshot is synced.

## License

MIT, copyright 2026 Oliver Forral. Code, original puzzles, and original interface are covered by [LICENSE](LICENSE). Picross is a trademark associated with Nintendo; this independent educational project is not affiliated with or endorsed by Nintendo or Jupiter. No commercial puzzles, assets, source code, or logos are copied.

The combined `.gitignore` includes Linux, Windows, and macOS global templates from [github/gitignore](https://github.com/github/gitignore/tree/main/Global), plus Node/build outputs. The dependency lockfile is tracked.
