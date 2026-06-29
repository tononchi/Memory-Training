const passages = {
  1: [
    "きょうは あさから そらが ぴかぴか はれです。",
    "あかい くるまが みちを すいすい はしります。",
    "ねこが まどべで ひなたぼっこを しています。",
    "こうえんで ともだちと おにごっこを しました。",
    "おみせで あまい いちごを かいました。"
  ],
  2: [
    "しゅくだいを おえたら、じぶんで つぎの もんだいに ちょうせんします。",
    "はやく よむだけでなく、ないようを おもいだせるか たしかめます。",
    "ともだちと くらべるより きのうの じぶんより せいちょうするのが だいじです。",
    "みじかい ぶんを くりかえし よむと、しぜんに ながく よめるように なります。",
    "きょうの がんばりを ほしで ためて、れんぞく ちゃれんじを つづけましょう。"
  ]
};

const defaultState = {
  streak: 0,
  lastPlayedDate: "",
  totalStars: 0,
  bestScore: 0,
  lastStarsToday: 0
};

const MS_PER_MINUTE = 60000;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const WORDS_PER_PASSAGE = 2;
const MIN_INTERVAL_MS = 900;

let running = false;
let timerId = null;
let showId = null;
let timeLeft = 60;
let score = 0;
let combo = 0;
let count = 0;
let starsToday = 0;
let queue = [];
let current = "";

const gradeSelect = document.getElementById("gradeSelect");
const speedRange = document.getElementById("speedRange");
const speedValue = document.getElementById("speedValue");
const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const passageEl = document.getElementById("passage");
const timeLeftEl = document.getElementById("timeLeft");
const scoreEl = document.getElementById("score");
const comboEl = document.getElementById("combo");
const countEl = document.getElementById("count");
const starsTodayEl = document.getElementById("starsToday");
const streakEl = document.getElementById("streak");
const totalStarsEl = document.getElementById("totalStars");
const bestScoreEl = document.getElementById("bestScore");
const badgesEl = document.getElementById("badges");

function loadState() {
  try {
    return {
      ...defaultState,
      ...JSON.parse(localStorage.getItem("speedKidsState") || "{}")
    };
  } catch {
    return { ...defaultState };
  }
}

function saveState(state) {
  localStorage.setItem("speedKidsState", JSON.stringify(state));
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  function calcAutoAdvanceInterval(wordsPerMinute) {
    const passagesPerMinute = Math.max(wordsPerMinute / WORDS_PER_PASSAGE, 1);
    return Math.max(MIN_INTERVAL_MS, Math.floor(MS_PER_MINUTE / passagesPerMinute));
  }
  return copy;
}

function renderProgress() {
  scoreEl.textContent = String(score);
  comboEl.textContent = String(combo);
  countEl.textContent = String(count);
  starsTodayEl.textContent = String(starsToday);
  timeLeftEl.textContent = String(timeLeft);
}

function renderState(state) {
  streakEl.textContent = String(state.streak);
  totalStarsEl.textContent = String(state.totalStars);
  bestScoreEl.textContent = String(state.bestScore);

  badgesEl.innerHTML = "";
  const badgeDefs = [
    { label: "🌱 3日れんぞく", min: 3 },
    { label: "🚀 7日れんぞく", min: 7 },
    { label: "👑 14日れんぞく", min: 14 }
  ];

  badgeDefs
    .filter((badge) => state.streak >= badge.min)
    .forEach((badge) => {
      const div = document.createElement("div");
      div.className = "badge";
      div.textContent = badge.label;
      badgesEl.appendChild(div);
    });
}

function nextPassage() {
  if (!queue.length) {
    queue = shuffle(passages[gradeSelect.value]);
  }
  current = queue.shift();
  passageEl.textContent = current;
}

function awardRead() {
  if (!running) {
    return;
  }

  combo += 1;
  count += 1;
  const speedBonus = Math.floor((Number(speedRange.value) - 80) / 20);
  score += 10 + combo * 2 + speedBonus;
  renderProgress();
  nextPassage();
}

function applyDailyReward() {
  const state = loadState();
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - MS_PER_DAY).toISOString().slice(0, 10);

  if (state.lastPlayedDate === today) {
    starsToday = state.lastStarsToday || 0;
    return state;
  }

  if (state.lastPlayedDate === yesterday) {
    state.streak += 1;
  } else {
    state.streak = 1;
  }

  const streakBonus = state.streak >= 7 ? 1 : 0;
  starsToday = 1 + Math.floor(score / 200) + streakBonus;
  state.totalStars += starsToday;
  state.lastPlayedDate = today;
  state.bestScore = Math.max(state.bestScore, score);
  state.lastStarsToday = starsToday;
  saveState(state);
  return state;
}

function endSession() {
  running = false;
  clearInterval(timerId);
  clearInterval(showId);
  nextBtn.disabled = true;
  startBtn.disabled = false;

  const state = applyDailyReward();
  renderProgress();
  renderState(state);
  passageEl.textContent = `おつかれさま！ ${count}ぶん よんだよ。`;
}

function startSession() {
  running = true;
  clearInterval(timerId);
  clearInterval(showId);

  timeLeft = 60;
  score = 0;
  combo = 0;
  count = 0;
  starsToday = 0;
  queue = shuffle(passages[gradeSelect.value]);

  nextBtn.disabled = false;
  startBtn.disabled = true;

  nextPassage();
  renderProgress();

  const wordsPerMinute = Number(speedRange.value);
  const interval = calcAutoAdvanceInterval(wordsPerMinute);

  showId = setInterval(() => {
    if (running) {
      combo = 0;
      nextPassage();
      renderProgress();
    }
  }, interval);

  timerId = setInterval(() => {
    timeLeft -= 1;
    renderProgress();
    if (timeLeft <= 0) {
      endSession();
    }
  }, 1000);
}

speedRange.addEventListener("input", () => {
  speedValue.textContent = speedRange.value;
});

startBtn.addEventListener("click", startSession);
nextBtn.addEventListener("click", awardRead);

renderState(loadState());
renderProgress();
