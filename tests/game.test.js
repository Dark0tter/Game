import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CAMPAIGN_LEVELS,
  buildDailyChallenge,
  completeDaily,
  createGameState,
  evaluateArtifact,
  getWeeklyPackName,
  submitLevel,
  toggleSelection
} from '../game.js';

test('campaign ships 12 levels across the three rule families', () => {
  assert.equal(CAMPAIGN_LEVELS.length, 12);
  const families = new Set(CAMPAIGN_LEVELS.map((level) => level.family));
  assert.ok(families.has('Logic Rule'));
  assert.ok(families.has('Visual Pattern'));
  assert.ok(families.has('Interaction Behavior'));
});

test('each campaign level has a deterministic non-empty solution set', () => {
  CAMPAIGN_LEVELS.forEach((level) => {
    const accepted = level.candidates.filter((artifact) => evaluateArtifact(level.ruleKey, artifact));
    assert.ok(accepted.length >= 2, `${level.id} should have at least two valid answers`);
    assert.ok(accepted.length < level.candidates.length, `${level.id} should not accept every candidate`);
  });
});

test('daily challenge is deterministic for a given date', () => {
  const first = buildDailyChallenge(new Date('2026-07-14T00:00:00Z'));
  const second = buildDailyChallenge(new Date('2026-07-14T15:30:00Z'));
  assert.equal(first.ruleKey, second.ruleKey);
  assert.deepEqual(first.candidates.map((item) => item.id), second.candidates.map((item) => item.id));
});

test('submitting an exact solution marks the level completed', () => {
  const state = createGameState();
  const level = CAMPAIGN_LEVELS[0];
  level.candidates.filter((artifact) => evaluateArtifact(level.ruleKey, artifact)).forEach((artifact) => {
    toggleSelection(state, artifact.id);
  });
  const result = submitLevel(state);
  assert.equal(result.solved, true);
  assert.equal(state.completed[level.id], true);
});

test('daily completion increments streak and preserves same-day idempotence', () => {
  const state = createGameState();
  const first = completeDaily(state, new Date('2026-07-14T00:00:00Z'));
  const second = completeDaily(state, new Date('2026-07-14T12:00:00Z'));
  assert.equal(first.count, 1);
  assert.equal(second.count, 1);
});

test('weekly pack name rotates but remains stable inside the same week', () => {
  const first = getWeeklyPackName(new Date('2026-07-14T00:00:00Z'));
  const second = getWeeklyPackName(new Date('2026-07-15T00:00:00Z'));
  assert.equal(first, second);
});
