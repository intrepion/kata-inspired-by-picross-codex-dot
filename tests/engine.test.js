import test from 'node:test';
import assert from 'node:assert/strict';
import { PUZZLES } from '../src/puzzles.js';
import { cluesForLine, cluesForPuzzle, createState, isSolved, applyCell, validateSave, linePatterns, solveByDeduction } from '../src/engine.js';

const sample = { width: 3, height: 2, solution: [[1, 0, 1], [0, 1, 0]] };

test('clues preserve run order and normalize empty lines to [0]', () => {
  assert.deepEqual(cluesForLine([0, 1, 1, 0, 1, 0, 1, 1, 1]), [2, 1, 3]);
  assert.deepEqual(cluesForLine([0, 0]), [0]);
  assert.deepEqual(cluesForLine([]), [0]);
  assert.deepEqual(cluesForLine([1, 1]), [2]);
});

test('row and column clues use the proper rectangular dimensions', () => {
  assert.deepEqual(cluesForPuzzle(sample), { rows: [[1, 1], [1]], cols: [[1], [1], [1]] });
});

test('new progress is independent and blank', () => {
  const a = createState(sample), b = createState(sample);
  assert.deepEqual(a, { cells: [0, 0, 0, 0, 0, 0], elapsedMs: 0, solved: false, assisted: false });
  a.cells[0] = 1;
  assert.equal(b.cells[0], 0);
});

test('completion requires exactly the solution ink; crosses are optional', () => {
  assert.equal(isSolved(sample, [1, 0, 1, 0, 1, 0]), true);
  assert.equal(isSolved(sample, [1, 2, 1, 2, 1, 2]), true);
  assert.equal(isSolved(sample, [1, 1, 1, 0, 1, 0]), false);
  assert.equal(isSolved(sample, [1, 0, 0, 0, 1, 0]), false);
  assert.equal(isSolved(sample, [1, 0, 2, 0, 1, 0]), false);
  assert.equal(isSolved(sample, [1, 0, 1, 0, 1]), false);
  assert.equal(isSolved(sample, Array(6)), false);
  assert.equal(isSolved(sample, [1, 3, 1, 0, 1, 0]), false);
  assert.equal(isSolved(sample, null), false);
});

test('cell edits reject invalid indexes and values without changing progress', () => {
  const state = createState(sample);
  for (const index of [-1, 6, 1.5, NaN, Infinity, '1']) assert.equal(applyCell(sample, state, index, 1), false);
  for (const value of [-1, 3, null, '1', NaN]) assert.equal(applyCell(sample, state, 0, value), false);
  assert.deepEqual(state, createState(sample));
  assert.equal(applyCell(sample, state, 0, 0), false);
});

test('cell edits support fills, crosses, clearing, and recompute completion', () => {
  const state = createState(sample);
  assert.equal(applyCell(sample, state, 0, 1), true);
  assert.equal(applyCell(sample, state, 0, 1), false);
  applyCell(sample, state, 2, 1);
  applyCell(sample, state, 4, 1);
  assert.equal(state.solved, true);
  applyCell(sample, state, 1, 2);
  assert.equal(state.solved, true);
  applyCell(sample, state, 0, 0);
  assert.equal(state.solved, false);
});

test('save validation copies data, normalizes time, and distrusts solved flags', () => {
  const raw = { cells: [1, 2, 1, 2, 1, 2], elapsedMs: 1234.9, solved: false, assisted: true };
  const normalized = validateSave(sample, raw);
  assert.deepEqual(normalized, { cells: [1, 2, 1, 2, 1, 2], elapsedMs: 1234, solved: true, assisted: true });
  raw.cells[0] = 0;
  assert.equal(normalized.cells[0], 1);
  assert.equal(validateSave(sample, { ...createState(sample), solved: true }).solved, false);
});

test('save validation rejects malformed and incompatible data', () => {
  const good = createState(sample);
  for (const raw of [null, [], {}, { ...good, cells: [] }, { ...good, cells: Array(6) },
    { ...good, cells: [0, 0, 0, 0, 0, 3] }, { ...good, cells: [0, 0, 0, 0, 0, '1'] },
    { ...good, elapsedMs: -1 }, { ...good, elapsedMs: Infinity }, { ...good, elapsedMs: '10' },
    { ...good, elapsedMs: 1e20 }, { ...good, assisted: 'true' }]) assert.equal(validateSave(sample, raw), null);
});

test('line placements agree with exhaustive binary enumeration through width eight', () => {
  for (let width = 1; width <= 8; width++) {
    const groups = new Map();
    for (let bits = 0; bits < 2 ** width; bits++) {
      const row = Array.from({ length: width }, (_, x) => (bits >> x) & 1);
      const key = JSON.stringify(cluesForLine(row));
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row.join(''));
    }
    for (const [key, patterns] of groups) {
      assert.deepEqual(linePatterns(width, JSON.parse(key)).map(row => row.join('')).sort(), patterns.sort());
    }
  }
  assert.deepEqual(linePatterns(3, [4]), []);
  assert.deepEqual(linePatterns(3, [1, 1, 1]), []);
});

test('solver detects contradictions and does not guess ambiguous cells', () => {
  assert.equal(solveByDeduction(1, 1, [[1]], [[0]]).contradiction, true);
  const ambiguous = solveByDeduction(2, 2, [[1], [1]], [[1], [1]]);
  assert.equal(ambiguous.solved, false);
  assert.equal(ambiguous.contradiction, false);
  assert.deepEqual(ambiguous.cells, [-1, -1, -1, -1]);
});

test('puzzle collection has original unique IDs, requested sizes and valid binary grids', () => {
  assert.equal(new Set(PUZZLES.map(p => p.id)).size, PUZZLES.length);
  const counts = {};
  for (const p of PUZZLES) {
    const size = `${p.width}x${p.height}`;
    counts[size] = (counts[size] || 0) + 1;
    assert.equal(p.solution.length, p.height);
    assert.ok(p.solution.every(row => row.length === p.width && row.every(cell => cell === 0 || cell === 1)));
    assert.ok(p.solution.flat().includes(0) && p.solution.flat().includes(1));
  }
  assert.ok(counts['5x5'] >= 4);
  assert.ok(counts['10x10'] >= 4);
  assert.ok(counts['15x15'] >= 3);
  assert.ok(counts['20x15'] >= 1);
  assert.equal(new Set(PUZZLES.map(p => JSON.stringify(p.solution))).size, PUZZLES.length);
});

for (const puzzle of PUZZLES) {
  test(`${puzzle.id}: clues alone deduce every cell, proving a unique solution without guessing`, () => {
    const { rows, cols } = cluesForPuzzle(puzzle);
    const result = solveByDeduction(puzzle.width, puzzle.height, rows, cols);
    assert.equal(result.contradiction, false);
    assert.equal(result.solved, true);
    assert.deepEqual(result.cells, puzzle.solution.flat());
  });
}

test('editing and restoring ink never removes assistance or changes elapsed time', () => {
  const state = { ...createState(sample), assisted: true, elapsedMs: 9876 };
  for (const index of [0, 2, 4]) applyCell(sample, state, index, 1);
  assert.equal(state.solved, true);
  applyCell(sample, state, 0, 0);
  assert.equal(state.solved, false);
  applyCell(sample, state, 0, 1);
  assert.equal(state.solved, true);
  assert.equal(state.assisted, true);
  assert.equal(state.elapsedMs, 9876);
  assert.equal(validateSave(sample, JSON.parse(JSON.stringify(state))).assisted, true);
});

test('all puzzle sessions survive JSON storage with exact ink and independent copies', () => {
  const sessions = Object.fromEntries(PUZZLES.map((p, index) => [p.id, {
    cells: p.solution.flat().map(value => value === 1 ? 1 : 2),
    elapsedMs: 1000 * index,
    solved: true,
    assisted: index % 2 === 0,
  }]));
  const saved = JSON.parse(JSON.stringify({ sessions }));
  for (const p of PUZZLES) {
    const restored = validateSave(p, saved.sessions[p.id]);
    assert.deepEqual(restored, sessions[p.id]);
    assert.notEqual(restored.cells, saved.sessions[p.id].cells);
    assert.equal(restored.solved, true);
  }
});

test('row-clue agreement alone cannot incorrectly complete a different picture', () => {
  const p = { width: 2, height: 2, solution: [[1, 0], [0, 1]] };
  const other = [0, 1, 1, 0];
  assert.deepEqual(cluesForLine(other.slice(0, 2)), cluesForLine(p.solution[0]));
  assert.deepEqual(cluesForLine(other.slice(2, 4)), cluesForLine(p.solution[1]));
  assert.equal(isSolved(p, other), false);
});

test('rectangular boundary cells map correctly and cannot mutate puzzle artwork', () => {
  const p = PUZZLES.find(p => p.width !== p.height);
  const original = JSON.stringify(p.solution);
  const state = createState(p);
  const target = p.solution.flat();
  for (let index = 0; index < target.length; index++) applyCell(p, state, index, target[index] ? 1 : 2);
  assert.equal(state.solved, true);
  for (const index of [p.width - 1, p.width, target.length - 1]) {
    const value = state.cells[index];
    applyCell(p, state, index, value === 1 ? 2 : 1);
    assert.equal(state.solved, false);
    applyCell(p, state, index, value);
    assert.equal(state.solved, true);
  }
  assert.equal(JSON.stringify(p.solution), original);
});
