const STORAGE_KEYS = {
  progress: 'rule-museum-progress',
  streak: 'rule-museum-daily-streak',
  premium: 'rule-museum-premium-preview'
};

const RULE_DEFINITIONS = {
  prime: {
    family: 'Logic Rule',
    label: 'Prime numbers belong.',
    predicate: (artifact) => isPrime(artifact.number)
  },
  even: {
    family: 'Logic Rule',
    label: 'Even-valued artifacts belong.',
    predicate: (artifact) => artifact.number % 2 === 0
  },
  fibonacci: {
    family: 'Logic Rule',
    label: 'Only Fibonacci numbers belong.',
    predicate: (artifact) => [1, 2, 3, 5, 8, 13].includes(artifact.number)
  },
  warmPalette: {
    family: 'Visual Pattern',
    label: 'Warm-colored artifacts belong.',
    predicate: (artifact) => ['Crimson', 'Amber', 'Coral', 'Gold'].includes(artifact.color)
  },
  striped: {
    family: 'Visual Pattern',
    label: 'Striped artifacts belong.',
    predicate: (artifact) => artifact.pattern === 'Striped'
  },
  angular: {
    family: 'Visual Pattern',
    label: 'Angular silhouettes belong.',
    predicate: (artifact) => ['Triangle', 'Diamond', 'Hexagon'].includes(artifact.shape)
  },
  echo: {
    family: 'Interaction Behavior',
    label: 'Artifacts that echo on probe belong.',
    predicate: (artifact) => artifact.behavior === 'Echo'
  },
  pulse: {
    family: 'Interaction Behavior',
    label: 'Artifacts that pulse on probe belong.',
    predicate: (artifact) => artifact.behavior === 'Pulse'
  },
  orbit: {
    family: 'Interaction Behavior',
    label: 'Artifacts that orbit on probe belong.',
    predicate: (artifact) => artifact.behavior === 'Orbit'
  }
};

function artifact(id, label, options) {
  return {
    id,
    label,
    icon: options.icon,
    number: options.number,
    color: options.color,
    shape: options.shape,
    pattern: options.pattern,
    behavior: options.behavior,
    blurb: `${options.color} ${options.shape.toLowerCase()} • ${options.pattern.toLowerCase()} • ${options.behavior.toLowerCase()} probe`
  };
}

const ARTIFACTS = [
  artifact('a1', 'Ember 2', { icon: '🔶', number: 2, color: 'Amber', shape: 'Diamond', pattern: 'Striped', behavior: 'Pulse' }),
  artifact('a2', 'Mist 4', { icon: '🔵', number: 4, color: 'Azure', shape: 'Circle', pattern: 'Dotted', behavior: 'Echo' }),
  artifact('a3', 'Shard 5', { icon: '🔺', number: 5, color: 'Crimson', shape: 'Triangle', pattern: 'Striped', behavior: 'Orbit' }),
  artifact('a4', 'Grove 6', { icon: '🟩', number: 6, color: 'Moss', shape: 'Square', pattern: 'Solid', behavior: 'Pulse' }),
  artifact('a5', 'Nova 7', { icon: '🟣', number: 7, color: 'Violet', shape: 'Hexagon', pattern: 'Dotted', behavior: 'Echo' }),
  artifact('a6', 'Halo 8', { icon: '🟡', number: 8, color: 'Gold', shape: 'Circle', pattern: 'Solid', behavior: 'Orbit' }),
  artifact('a7', 'Coral 9', { icon: '🟠', number: 9, color: 'Coral', shape: 'Triangle', pattern: 'Striped', behavior: 'Pulse' }),
  artifact('a8', 'Slate 10', { icon: '⬛', number: 10, color: 'Slate', shape: 'Square', pattern: 'Striped', behavior: 'Echo' }),
  artifact('a9', 'Ivory 11', { icon: '⬜', number: 11, color: 'Ivory', shape: 'Hexagon', pattern: 'Solid', behavior: 'Orbit' }),
  artifact('a10', 'Bloom 12', { icon: '🟢', number: 12, color: 'Mint', shape: 'Circle', pattern: 'Dotted', behavior: 'Pulse' }),
  artifact('a11', 'Blaze 13', { icon: '🔺', number: 13, color: 'Crimson', shape: 'Triangle', pattern: 'Solid', behavior: 'Echo' }),
  artifact('a12', 'Auric 14', { icon: '💠', number: 14, color: 'Gold', shape: 'Diamond', pattern: 'Striped', behavior: 'Orbit' }),
  artifact('a13', 'Dawn 15', { icon: '🟧', number: 15, color: 'Amber', shape: 'Square', pattern: 'Solid', behavior: 'Pulse' }),
  artifact('a14', 'Tide 16', { icon: '🔷', number: 16, color: 'Azure', shape: 'Diamond', pattern: 'Dotted', behavior: 'Echo' }),
  artifact('a15', 'Rune 17', { icon: '🔮', number: 17, color: 'Violet', shape: 'Hexagon', pattern: 'Striped', behavior: 'Orbit' }),
  artifact('a16', 'Root 18', { icon: '🟫', number: 18, color: 'Moss', shape: 'Triangle', pattern: 'Solid', behavior: 'Pulse' }),
  artifact('a17', 'Sun 19', { icon: '🌕', number: 19, color: 'Gold', shape: 'Circle', pattern: 'Striped', behavior: 'Echo' }),
  artifact('a18', 'Beryl 20', { icon: '🟢', number: 20, color: 'Mint', shape: 'Hexagon', pattern: 'Dotted', behavior: 'Orbit' })
];

function getArtifacts(ids) {
  return ids.map((id) => ARTIFACTS.find((artifactItem) => artifactItem.id === id));
}

export const CAMPAIGN_LEVELS = [
  level('level-1', 'The Warm Wing', 'warmPalette', ['a1', 'a3'], ['a2', 'a5'], ['a6', 'a7', 'a8', 'a10', 'a13', 'a14'], 'Warm colors only.', 'Teaching level: focus on color first. Ignore number and shape.'),
  level('level-2', 'The Prime Archive', 'prime', ['a1', 'a3'], ['a2', 'a4'], ['a5', 'a6', 'a7', 'a9', 'a10', 'a11'], 'Prime values only.', 'Teaching level: the badge number matters more than appearance.'),
  level('level-3', 'The Echo Hall', 'echo', ['a2', 'a5'], ['a1', 'a3'], ['a8', 'a9', 'a10', 'a11', 'a12', 'a16'], 'Only pieces that echo on probe belong.', 'Teaching level: use your probe if a behavior-based rule is unfamiliar.'),
  level('level-4', 'The Stripe Salon', 'striped', ['a1', 'a3'], ['a4', 'a6'], ['a7', 'a8', 'a12', 'a14', 'a15', 'a17'], 'Pattern matters now.', 'Some visual rules ignore color entirely.'),
  level('level-5', 'The Even Atrium', 'even', ['a2', 'a4'], ['a3', 'a5'], ['a5', 'a6', 'a8', 'a10', 'a11', 'a14'], 'Even values only.', 'Probe is optional here; the rule can be solved from examples.'),
  level('level-6', 'The Orbit Passage', 'orbit', ['a3', 'a6'], ['a1', 'a2'], ['a9', 'a12', 'a15', 'a17', 'a18', 'a10'], 'Belonging is determined by probe orbit.', 'Interaction rules are fair if you check the museum examples first.'),
  level('level-7', 'The Angular Vault', 'angular', ['a3', 'a5'], ['a2', 'a6'], ['a1', 'a7', 'a8', 'a9', 'a12', 'a16'], 'Angular silhouettes only.', 'Triangle, diamond, and hexagon all count as angular.'),
  level('level-8', 'The Fibonacci Gallery', 'fibonacci', ['a1', 'a3'], ['a2', 'a4'], ['a6', 'a7', 'a9', 'a10', 'a11', 'a17'], 'Fibonacci values only.', 'This gallery rewards number pattern recognition.'),
  level('level-9', 'The Pulse Conservatory', 'pulse', ['a1', 'a4'], ['a2', 'a3'], ['a7', 'a10', 'a13', 'a16', 'a18', 'a12'], 'Pulse behavior only.', 'The probe is your fastest certainty tool.'),
  level('level-10', 'The Ember Logic Mix', 'warmPalette', ['a3', 'a6'], ['a5', 'a8'], ['a1', 'a2', 'a7', 'a11', 'a14', 'a17'], 'Warm palette returns with trickier overlap.', 'This one mixes warm colors with misleading prime badges.'),
  level('level-11', 'The Curator’s Cut', 'prime', ['a5', 'a11'], ['a8', 'a10'], ['a1', 'a3', 'a9', 'a12', 'a15', 'a17'], 'Prime values with louder decoys.', 'Count carefully before relying on appearance.'),
  level('level-12', 'The Final Rotation', 'orbit', ['a6', 'a9'], ['a5', 'a11'], ['a3', 'a12', 'a15', 'a17', 'a18', 'a2'], 'Probe orbit determines the final room.', 'You know the museum now: observe, test, infer, solve.')
];

const DAILY_ROTATION = ['prime', 'warmPalette', 'echo', 'striped', 'orbit', 'even', 'angular', 'pulse', 'fibonacci'];
const WEEKLY_PACKS = ['Curator\'s Cut', 'Neon Annex', 'Silent Geometry', 'Clockwork Echoes'];

export function createGameState(levels = CAMPAIGN_LEVELS) {
  return {
    mode: 'campaign',
    levelIndex: 0,
    levels,
    selectedIds: new Set(),
    revealedIds: new Map(),
    usedProbe: false,
    completed: loadProgress(),
    notes: ['Campaign is fully free. Rewarded hints are optional.'],
    streak: loadStreak(),
    premiumPreview: false
  };
}

export function level(id, title, ruleKey, acceptedExampleIds, rejectedExampleIds, candidateIds, prompt, teaching) {
  return {
    id,
    title,
    ruleKey,
    family: RULE_DEFINITIONS[ruleKey].family,
    prompt,
    teaching,
    hint: buildHint(ruleKey),
    acceptedExamples: getArtifacts(acceptedExampleIds),
    rejectedExamples: getArtifacts(rejectedExampleIds),
    candidates: getArtifacts(candidateIds)
  };
}

export function getCurrentLevel(state) {
  return state.levels[state.levelIndex];
}

export function toggleSelection(state, artifactId) {
  if (state.selectedIds.has(artifactId)) {
    state.selectedIds.delete(artifactId);
  } else {
    state.selectedIds.add(artifactId);
  }
}

export function probeArtifact(state, artifactId) {
  const levelData = getCurrentLevel(state);
  const artifactData = levelData.candidates.find((candidate) => candidate.id === artifactId);
  const accepted = evaluateArtifact(levelData.ruleKey, artifactData);
  state.revealedIds.set(artifactId, accepted);
  state.usedProbe = true;
  return accepted;
}

export function restartLevel(state) {
  state.selectedIds = new Set();
  state.revealedIds = new Map();
  state.usedProbe = false;
}

export function submitLevel(state) {
  const levelData = getCurrentLevel(state);
  const acceptedIds = levelData.candidates.filter((artifactData) => evaluateArtifact(levelData.ruleKey, artifactData)).map((artifactData) => artifactData.id);
  const selectedIds = [...state.selectedIds].sort();
  const solved = arraysEqual([...acceptedIds].sort(), selectedIds);
  if (solved) {
    state.completed[levelData.id] = true;
    saveProgress(state.completed);
    state.notes.unshift(`Solved ${levelData.title} with ${state.usedProbe ? 'a probe' : 'no probe'}.`);
    state.notes = state.notes.slice(0, 6);
  }
  return {
    solved,
    acceptedIds
  };
}

export function nextLevel(state) {
  if (state.levelIndex < state.levels.length - 1) {
    state.levelIndex += 1;
    restartLevel(state);
    return true;
  }
  return false;
}

export function setMode(state, mode) {
  state.mode = mode;
  state.levels = mode === 'daily' ? [buildDailyChallenge()] : CAMPAIGN_LEVELS;
  state.levelIndex = 0;
  restartLevel(state);
}

export function getProgressSummary(state) {
  const total = CAMPAIGN_LEVELS.length;
  const completedCount = Object.keys(state.completed).filter((levelId) => state.completed[levelId]).length;
  return `${completedCount} / ${total}`;
}

export function buildDailyChallenge(date = new Date()) {
  const seed = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
  const numericSeed = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const ruleKey = DAILY_ROTATION[numericSeed % DAILY_ROTATION.length];
  const pool = [...ARTIFACTS].sort((a, b) => (a.id > b.id ? 1 : -1));
  const offset = numericSeed % 6;
  const acceptedExamples = [];
  const rejectedExamples = [];
  const candidates = [];

  for (const item of pool) {
    const accepted = evaluateArtifact(ruleKey, item);
    if (accepted && acceptedExamples.length < 2) {
      acceptedExamples.push(item);
    } else if (!accepted && rejectedExamples.length < 2) {
      rejectedExamples.push(item);
    } else if (candidates.length < 6 && (pool.indexOf(item) + offset) % 2 === 0) {
      candidates.push(item);
    }
  }

  if (candidates.filter((item) => evaluateArtifact(ruleKey, item)).length < 2) {
    for (const item of pool) {
      if (!candidates.some((candidate) => candidate.id === item.id)) {
        candidates.push(item);
      }
      if (candidates.length === 6) break;
    }
  }

  return {
    id: `daily-${seed}`,
    title: 'Daily Exhibit',
    ruleKey,
    family: `${RULE_DEFINITIONS[ruleKey].family} • Daily`,
    prompt: 'A fresh curated room generated for today.',
    teaching: 'Complete the daily exhibit to extend your streak.',
    hint: `Daily hint: ${buildHint(ruleKey)}`,
    acceptedExamples,
    rejectedExamples,
    candidates: candidates.slice(0, 6)
  };
}

export function completeDaily(state, date = new Date()) {
  const today = isoDay(date);
  const streak = loadStreak();
  if (streak.lastCompleted === today) return streak;
  const yesterday = isoDay(new Date(date.getTime() - 86400000));
  const nextCount = streak.lastCompleted === yesterday ? streak.count + 1 : 1;
  const next = { count: nextCount, lastCompleted: today };
  saveStreak(next);
  state.streak = next;
  state.notes.unshift(`Daily streak extended to ${nextCount}.`);
  state.notes = state.notes.slice(0, 6);
  return next;
}

export function getWeeklyPackName(date = new Date()) {
  const week = Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000));
  return WEEKLY_PACKS[week % WEEKLY_PACKS.length];
}

export function evaluateArtifact(ruleKey, artifactData) {
  return RULE_DEFINITIONS[ruleKey].predicate(artifactData);
}

export function buildHint(ruleKey) {
  switch (ruleKey) {
    case 'prime':
      return 'Check whether each number has exactly two divisors.';
    case 'even':
      return 'Try splitting the badge number into pairs.';
    case 'fibonacci':
      return 'Think of numbers that grow by adding the previous two.';
    case 'warmPalette':
      return 'Ignore shape and study temperature in the color names.';
    case 'striped':
      return 'Surface pattern matters more than icon silhouette.';
    case 'angular':
      return 'Count corners instead of focusing on color.';
    case 'echo':
      return 'Use the probe—the museum cares how the artifact answers back.';
    case 'pulse':
      return 'Listen for the one behavior that feels like a heartbeat.';
    case 'orbit':
      return 'The correct pieces react like satellites circling a core.';
    default:
      return 'Compare what the accepted examples share and what the rejected ones do not.';
  }
}

export async function resolveHint(levelData) {
  if (typeof globalThis.RuleMuseumAI?.generateHint === 'function') {
    const generated = await globalThis.RuleMuseumAI.generateHint({
      id: levelData.id,
      title: levelData.title,
      family: levelData.family,
      prompt: levelData.prompt,
      acceptedExamples: levelData.acceptedExamples.map((artifactData) => artifactData.label),
      rejectedExamples: levelData.rejectedExamples.map((artifactData) => artifactData.label),
      fallbackHint: levelData.hint
    });
    if (generated && typeof generated === 'string') {
      return generated;
    }
  }
  return levelData.hint;
}

export function loadProgress() {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEYS.progress);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress) {
  globalThis.localStorage?.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
}

export function loadStreak() {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEYS.streak);
    return raw ? JSON.parse(raw) : { count: 0, lastCompleted: null };
  } catch {
    return { count: 0, lastCompleted: null };
  }
}

export function saveStreak(streak) {
  globalThis.localStorage?.setItem(STORAGE_KEYS.streak, JSON.stringify(streak));
}

function arraysEqual(left, right) {
  if (left.length !== right.length) return false;
  return left.every((value, index) => value === right[index]);
}

function isoDay(date) {
  return date.toISOString().slice(0, 10);
}

function isPrime(value) {
  if (value < 2) return false;
  for (let divisor = 2; divisor <= Math.sqrt(value); divisor += 1) {
    if (value % divisor === 0) return false;
  }
  return true;
}
