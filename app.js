import {
  buildDailyChallenge,
  completeDaily,
  createGameState,
  getCurrentLevel,
  getProgressSummary,
  getWeeklyPackName,
  nextLevel,
  probeArtifact,
  resolveHint,
  restartLevel,
  setMode,
  submitLevel,
  toggleSelection
} from './game.js';

const state = createGameState();

const elements = {
  campaignTab: document.getElementById('campaignTab'),
  dailyTab: document.getElementById('dailyTab'),
  storeButton: document.getElementById('storeButton'),
  storeDialog: document.getElementById('storeDialog'),
  levelFamily: document.getElementById('levelFamily'),
  levelTitle: document.getElementById('levelTitle'),
  levelPrompt: document.getElementById('levelPrompt'),
  levelTeaching: document.getElementById('levelTeaching'),
  acceptedExamples: document.getElementById('acceptedExamples'),
  rejectedExamples: document.getElementById('rejectedExamples'),
  candidateGrid: document.getElementById('candidateGrid'),
  statusMessage: document.getElementById('statusMessage'),
  hintText: document.getElementById('hintText'),
  sessionNotes: document.getElementById('sessionNotes'),
  progressValue: document.getElementById('progressValue'),
  streakValue: document.getElementById('streakValue'),
  weeklyPackValue: document.getElementById('weeklyPackValue'),
  probeButton: document.getElementById('probeButton'),
  hintButton: document.getElementById('hintButton'),
  submitButton: document.getElementById('submitButton'),
  restartButton: document.getElementById('restartButton'),
  rewardDialog: document.getElementById('rewardDialog'),
  rewardDialogText: document.getElementById('rewardDialogText'),
  rewardDialogAction: document.getElementById('rewardDialogAction')
};

let probeMode = false;

function render() {
  const levelData = getCurrentLevel(state);
  elements.levelFamily.textContent = levelData.family;
  elements.levelTitle.textContent = levelData.title;
  elements.levelPrompt.textContent = levelData.prompt;
  elements.levelTeaching.textContent = levelData.teaching;
  elements.progressValue.textContent = getProgressSummary(state);
  elements.streakValue.textContent = `${state.streak.count} day${state.streak.count === 1 ? '' : 's'}`;
  elements.weeklyPackValue.textContent = getWeeklyPackName();
  elements.hintText.textContent = 'Hints stay deterministic by default. If you later wire an AI hint endpoint, it can plug into this same button.';

  elements.campaignTab.classList.toggle('chip-active', state.mode === 'campaign');
  elements.dailyTab.classList.toggle('chip-active', state.mode === 'daily');
  elements.campaignTab.classList.toggle('chip', state.mode !== 'campaign');
  elements.dailyTab.classList.toggle('chip', state.mode !== 'daily');

  renderExamples(elements.acceptedExamples, levelData.acceptedExamples, true);
  renderExamples(elements.rejectedExamples, levelData.rejectedExamples, false);
  renderCandidates(levelData);
  renderNotes();

  elements.probeButton.textContent = probeMode ? 'Probe: tap an artifact' : state.usedProbe ? 'Probe spent' : 'Use Probe';
  elements.probeButton.disabled = state.usedProbe;
}

function renderExamples(target, artifacts, accepted) {
  target.innerHTML = '';
  artifacts.forEach((artifact) => {
    const card = artifactCard(artifact, accepted ? 'Accepted' : 'Rejected');
    card.classList.add(accepted ? 'revealed-accepted' : 'revealed-rejected');
    target.append(card);
  });
}

function renderCandidates(levelData) {
  elements.candidateGrid.innerHTML = '';
  levelData.candidates.forEach((artifact) => {
    const card = artifactCard(artifact, artifact.blurb, true);
    if (state.selectedIds.has(artifact.id)) {
      card.classList.add('selected');
    }

    const revealed = state.revealedIds.get(artifact.id);
    if (revealed === true) {
      card.classList.add('revealed-accepted');
    } else if (revealed === false) {
      card.classList.add('revealed-rejected');
    }

    card.addEventListener('click', () => {
      if (probeMode && !state.usedProbe) {
        const accepted = probeArtifact(state, artifact.id);
        probeMode = false;
        elements.statusMessage.textContent = `${artifact.label} ${accepted ? 'belongs' : 'does not belong'} in ${levelData.title}.`;
      } else {
        toggleSelection(state, artifact.id);
        elements.statusMessage.textContent = `${artifact.label} ${state.selectedIds.has(artifact.id) ? 'selected' : 'deselected'}.`;
      }
      render();
    });

    elements.candidateGrid.append(card);
  });
}

function artifactCard(artifact, badgeText, interactive = false) {
  const button = document.createElement(interactive ? 'button' : 'article');
  button.className = 'artifact';
  button.innerHTML = `
    <span class="artifact-icon">${artifact.icon}</span>
    <div>
      <div class="artifact-title">${artifact.label}</div>
      <p>${artifact.color} • ${artifact.shape} • ${artifact.pattern}</p>
    </div>
    <span class="badge ${badgeText === 'Accepted' ? 'badge-accepted' : badgeText === 'Rejected' ? 'badge-rejected' : ''}">${badgeText}</span>
  `;
  return button;
}

function renderNotes() {
  elements.sessionNotes.innerHTML = '';
  state.notes.forEach((note) => {
    const pill = document.createElement('div');
    pill.className = 'note-pill';
    pill.textContent = note;
    elements.sessionNotes.append(pill);
  });
}

async function unlockHint() {
  const levelData = getCurrentLevel(state);
  elements.rewardDialogText.textContent = 'Support the free campaign with a short sponsor reel. Your hint unlocks after 3 seconds.';
  elements.rewardDialog.showModal();
  elements.rewardDialogAction.disabled = true;
  await wait(3000);
  elements.rewardDialogAction.disabled = false;
  elements.rewardDialogAction.textContent = 'Reveal hint';

  await new Promise((resolve) => {
    const onClose = async () => {
      elements.rewardDialog.removeEventListener('close', onClose);
      const hint = await resolveHint(levelData);
      elements.hintText.textContent = hint;
      state.notes.unshift(`Hint unlocked for ${levelData.title}.`);
      state.notes = state.notes.slice(0, 6);
      render();
      elements.rewardDialogAction.textContent = 'Continue';
      resolve();
    };
    elements.rewardDialog.addEventListener('close', onClose, { once: true });
  });
}

function handleSubmit() {
  const result = submitLevel(state);
  if (result.solved) {
    elements.statusMessage.textContent = `${getCurrentLevel(state).title} solved.`;
    if (state.mode === 'daily') {
      const streak = completeDaily(state);
      elements.statusMessage.textContent += ` Daily streak: ${streak.count}.`;
    } else {
      nextLevel(state);
      const next = getCurrentLevel(state);
      elements.statusMessage.textContent += next ? ` Next up: ${next.title}.` : ' Campaign complete.';
    }
  } else {
    const misses = result.acceptedIds.filter((id) => !state.selectedIds.has(id)).length;
    elements.statusMessage.textContent = `Not quite. ${misses} museum-approved pieces are still missing.`;
  }
  render();
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

elements.campaignTab.addEventListener('click', () => {
  setMode(state, 'campaign');
  elements.statusMessage.textContent = 'Campaign restored.';
  render();
});

elements.dailyTab.addEventListener('click', () => {
  setMode(state, 'daily');
  state.levels = [buildDailyChallenge()];
  elements.statusMessage.textContent = 'Daily exhibit loaded.';
  render();
});

elements.storeButton.addEventListener('click', () => {
  elements.storeDialog.showModal();
});

elements.probeButton.addEventListener('click', () => {
  probeMode = true;
  elements.statusMessage.textContent = 'Probe armed. Tap one artifact to reveal whether it belongs.';
  render();
});

elements.hintButton.addEventListener('click', () => {
  unlockHint().catch(() => {
    elements.statusMessage.textContent = 'Hint unlock failed. Falling back to built-in clue.';
    elements.hintText.textContent = getCurrentLevel(state).hint;
    render();
  });
});

elements.submitButton.addEventListener('click', handleSubmit);

elements.restartButton.addEventListener('click', () => {
  restartLevel(state);
  probeMode = false;
  elements.statusMessage.textContent = 'Level reset. No ambiguity, fresh start.';
  render();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      state.notes.unshift('Offline cache registration failed in this browser.');
      state.notes = state.notes.slice(0, 6);
      render();
    });
  });
}

render();
