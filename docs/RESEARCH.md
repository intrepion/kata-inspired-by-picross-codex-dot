# Picross research and implementation contract

Research date: 2026-11-05. Target: the Classic monochrome mode of **Picross S (2017)**. "Picross" is a family, not one uniform ruleset. Official pages and manuals were researched; no emulator-based frame/control parity audit was performed.

## Core rules

A row's clues describe consecutive filled runs from left to right; column clues run top to bottom. Each run has the indicated length. Same-color runs are separated by at least one empty square. Crosses are annotations, not filled squares. Logical solving combines constraints from both axes. Full lines and the overlap between possible placements are useful deductions.

[Puzzle Page developer support: Picture Cross rules](https://appynation.helpshift.com/hc/en/13-puzzle-page/faq/216-picture-cross/?p=ios/)

## Primary edition sources

- [Jupiter: Picross S](https://www.jupiter.co.jp/e/switch/picrosss/): Classic and Mega modes, 5×5 / 10×10 / 15×15 / 20×15 sizes, navigation and hint roulette.
- [Jupiter: Picross S2](https://www.jupiter.co.jp/e/switch/picrosss2/index.php): adds Clip Picross and cursor counting. These are not assumed to be universal Classic mechanics.
- [Jupiter: Picross S3](https://www.jupiter.co.jp/e/switch/picrosss3/): adds Color Picross, where different-color runs may touch. Not implemented here.
- [Jupiter: Picross S7](https://www.jupiter.co.jp/e/switch/picrosss7/index.php): touchscreen hold/toggle features are edition-specific.
- [Jupiter: Picross S9](https://www.jupiter.co.jp/e/switch/picrosss9/): Rewind is a later feature, not attributed to S1.
- [Nintendo: My Nintendo Picross: The Legend of Zelda: Twilight Princess manual](https://csassets.nintendo.com/noaext/image/private/t_KA_PDF/manual-3DS-my-nintendo-picross-the-legend-of-zelda-twilight-princess-en?_a=BATCtdAA0), pages 9–11: console cursor/fill/cross, stylus, optional answer autocheck, clue graying, and row/column hint roulette. The 3DS manual is supporting context, not proof that every Switch edition behaves identically.

## Fidelity matrix

| Mechanic | Quiet Grid implementation | Evidence / difference |
| --- | --- | --- |
| Ordered monochrome runs and mandatory gaps | Exact standard nonogram rule | Core rule source above |
| Cross-mark empty cells | Supported, optional for completion | Standard annotation; no extra win requirement |
| Complete the hidden picture | Exact filled pattern, including rejecting extras | Original artwork only |
| Grid sizes | 5×5, 10×10, 15×15, 20×15 | Picross S size family |
| Unique solvable puzzles | 12 original drawings, all deduced from clues alone | Solver assertions in tests |
| Fill / cross / erase | Mouse, keyboard, touch tools and drag | Browser control adaptation |
| Clue graying | Whole line when current runs match clues | Simpler explicit algorithm, not hidden-answer checking or claimed exact partial-clue algorithm |
| Optional error check | Wrong fill becomes cross, assistance recorded | Disclosed adaptation; no time penalties |
| Hint roulette | Start-only random row plus column | No roulette animation; undo keeps assisted status |
| Time | Elapsed active time; pauses during dialogs/blur | No countdown, hearts, loss, or penalties claimed |
| Undo/redo | Up to 100 local strokes | Convenience adaptation; not attributed to original S |
| Commercial content | None | Original code, pictures, UI, synthesized sound |

The original source pages do not fully specify every partial-clue or penalty algorithm. Community reports conflict. This project does not invent a certainty claim; its behavior is explicitly documented in the UI and README.
