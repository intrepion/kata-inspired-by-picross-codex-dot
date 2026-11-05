/** Pure, dependency-free nonogram rules. Cell values: 0 unknown, 1 ink, 2 cross. */
export function cluesForLine(line) {
  const clues = [];
  let run = 0;
  for (const cell of line) {
    if (cell === 1) run++;
    else if (run) { clues.push(run); run = 0; }
  }
  if (run) clues.push(run);
  return clues.length ? clues : [0];
}

export function cluesForPuzzle(puzzle) {
  return {
    rows: puzzle.solution.map(cluesForLine),
    cols: Array.from({ length: puzzle.width }, (_, x) =>
      cluesForLine(puzzle.solution.map(row => row[x]))),
  };
}

export function createState(puzzle) {
  return { cells: Array(puzzle.width * puzzle.height).fill(0), elapsedMs: 0, solved: false, assisted: false };
}

export function isSolved(puzzle, cells) {
  if (!Array.isArray(cells) || cells.length !== puzzle.width * puzzle.height) return false;
  return Array.from(cells).every((cell, index) =>
    [0, 1, 2].includes(cell) &&
    (cell === 1) === (puzzle.solution[Math.floor(index / puzzle.width)][index % puzzle.width] === 1));
}

export function applyCell(puzzle, state, index, value) {
  if (!Number.isInteger(index) || index < 0 || index >= puzzle.width * puzzle.height ||
      ![0, 1, 2].includes(value) || state.cells[index] === value) return false;
  state.cells[index] = value;
  state.solved = isSolved(puzzle, state.cells);
  return true;
}

/** Reject corrupt, incompatible or unbounded saves. Never trust a saved completion flag. */
export function validateSave(puzzle, raw) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.cells) ||
      raw.cells.length !== puzzle.width * puzzle.height ||
      !Array.from(raw.cells).every(cell => Number.isInteger(cell) && cell >= 0 && cell <= 2) ||
      !Number.isFinite(raw.elapsedMs) || raw.elapsedMs < 0 || raw.elapsedMs > 315360000000 ||
      (raw.assisted !== undefined && typeof raw.assisted !== 'boolean')) return null;
  const cells = [...raw.cells];
  return { cells, elapsedMs: Math.floor(raw.elapsedMs), solved: isSolved(puzzle, cells), assisted: raw.assisted === true };
}

/** Enumerate line placements. Solver cells use -1 unknown, 0 empty, 1 filled. */
export function linePatterns(length, clues) {
  const runs = clues.length === 1 && clues[0] === 0 ? [] : clues;
  if (!Number.isInteger(length) || length < 0 || length > 30 ||
      !runs.every(n => Number.isInteger(n) && n > 0)) return [];
  if (!runs.length) return [Array(length).fill(0)];
  const result = [];
  function visit(runIndex, start, line) {
    const remaining = runs.slice(runIndex).reduce((a, b) => a + b, 0) + runs.length - runIndex - 1;
    for (let offset = start; offset <= length - remaining; offset++) {
      const next = [...line];
      next.fill(1, offset, offset + runs[runIndex]);
      if (runIndex === runs.length - 1) result.push(next);
      else visit(runIndex + 1, offset + runs[runIndex] + 1, next);
    }
  }
  visit(0, 0, Array(length).fill(0));
  return result;
}

/** Repeated line consensus only: no search, guessing, or access to the solution. */
export function solveByDeduction(width, height, rowClues, colClues) {
  const cells = Array(width * height).fill(-1);
  const lines = [
    ...rowClues.map((clue, y) => ({ indexes: Array.from({ length: width }, (_, x) => y * width + x), patterns: linePatterns(width, clue) })),
    ...colClues.map((clue, x) => ({ indexes: Array.from({ length: height }, (_, y) => y * width + x), patterns: linePatterns(height, clue) })),
  ];
  let changed = true;
  let passes = 0;
  while (changed) {
    changed = false;
    passes++;
    for (const line of lines) {
      line.patterns = line.patterns.filter(pattern =>
        line.indexes.every((index, offset) => cells[index] === -1 || cells[index] === pattern[offset]));
      if (!line.patterns.length) return { solved: false, contradiction: true, cells, passes };
      line.indexes.forEach((index, offset) => {
        if (cells[index] === -1 && line.patterns.every(pattern => pattern[offset] === line.patterns[0][offset])) {
          cells[index] = line.patterns[0][offset];
          changed = true;
        }
      });
    }
  }
  return { solved: cells.every(cell => cell !== -1), contradiction: false, cells, passes };
}
