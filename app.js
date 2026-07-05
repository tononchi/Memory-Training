// よむよむスピードトレーニング
// 設計根拠: docs/speed-reading-research.md
// 中核となる知見:
//  - 反復読み(Repeated Reading): 同じ短文を繰り返し読むと流暢性・理解が伸びる (NRP 2000 / Therrien 2004)
//  - お手本提示(Modeling / Listening Passage Preview): 先に流暢な読みを聞くと効果が増す (Lee & Yoon 2017)
//  - 速度は強制しない: 速度-正確性トレードオフ。子の眼球運動は発達段階の制約を受ける (Rayner 2016)
//    → 自動送り(強制ペース)は採用せず、「きのうの じぶん」より伸びたかを可視化する
//  - 正確さと理解を併記: 流暢性 = 正確性 × 自動化 × 韻律 (Rasinski 2006)
//  - 分散復習(Spacing): 数日あけて既習文を再提示すると定着が高まる
//  - ゲーミフィケーション: streak/ほし/バッジは動機づけに有効 (Kurnaz 2025 ほか)。報酬は正確さ・理解に重みづけ。

// 問題データは data/passages-*.js が window.PASSAGE_SETS に登録する。
// 学年/大人ごとに別ファイル（grade1 / grade2 / adult）へ分割。各短文に内容確認(2択)付き。
// 漢字込みは学年別漢字配当表に沿った漢字のみ（docs/kanji-by-grade.md）。
const passageSets = window.PASSAGE_SETS || {};

const defaultState = {
  streak: 0,
  lastPlayedDate: "",
  totalStars: 0,
  bestScore: 0,
  lastStarsToday: 0,
  // 分散復習・自己ベスト用: { [passageId]: { lastDate, bestMs, plays } }
  passageStats: {}
};

const MS_PER_MINUTE = 60000;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const REVIEW_DAYS = 2; // 何日あいたら「ふくしゅう」扱いにするか
const SESSION_PASSAGES = 3; // 1セッションで扱う短文数(やく1分)

// 永続状態(streak / ほし / 自己ベスト / 分散復習)は単一オブジェクトで保持し、
// 更新のたびに saveState する。ハンドラごとに読み直すと更新が失われるため。
let appState = null;

// --- セッション中の状態 ---
let running = false;
let elapsedTimerId = null;
let elapsedSec = 0;

let queue = []; // このセッションで読む短文(復習を優先して構成)
let passageIndex = 0; // 何文目か(0始まり)
let repeatTarget = 3; // くりかえす回数
let currentRepeat = 0; // いま何回目か(0始まり)
let readStartMs = 0; // この読みの計測開始時刻
let currentReadTimes = []; // この短文の各回の読み時間(ms)

let score = 0;
let combo = 0;
let count = 0; // 読んだ回数の合計
let fluentReads = 0; // 「すらすら」と自己申告できた回数
let totalWords = 0; // 正しく読めた語の合計(WCPM計算用)
let totalReadMs = 0; // 読みにかかった合計時間
let comprehensionCorrect = 0;
let comprehensionTotal = 0;
let starsToday = 0;

// --- DOM ---
const setSelect = document.getElementById("setSelect");
const repeatSelect = document.getElementById("repeatSelect");
const modelRange = document.getElementById("modelRange");
const modelValue = document.getElementById("modelValue");
const startBtn = document.getElementById("startBtn");

const passageIndexEl = document.getElementById("passageIndex");
const passageTotalEl = document.getElementById("passageTotal");
const repeatIndexEl = document.getElementById("repeatIndex");
const repeatTotalEl = document.getElementById("repeatTotal");
const reviewTagEl = document.getElementById("reviewTag");
const elapsedEl = document.getElementById("elapsed");
const passageEl = document.getElementById("passage");
const modelBtn = document.getElementById("modelBtn");
const readBtn = document.getElementById("readBtn");

const feedbackEl = document.getElementById("feedback");
const fluentBtn = document.getElementById("fluentBtn");
const stumbleBtn = document.getElementById("stumbleBtn");
const improveNoteEl = document.getElementById("improveNote");

const quizEl = document.getElementById("quiz");
const quizQuestionEl = document.getElementById("quizQuestion");
const quizChoicesEl = document.getElementById("quizChoices");
const quizResultEl = document.getElementById("quizResult");

const scoreEl = document.getElementById("score");
const comboEl = document.getElementById("combo");
const countEl = document.getElementById("count");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const comprehensionEl = document.getElementById("comprehension");
const starsTodayEl = document.getElementById("starsToday");

const streakEl = document.getElementById("streak");
const totalStarsEl = document.getElementById("totalStars");
const bestScoreEl = document.getElementById("bestScore");
const badgesEl = document.getElementById("badges");

// --- ユーティリティ ---
function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem("speedKidsState") || "{}");
    return { ...defaultState, ...parsed, passageStats: { ...(parsed.passageStats || {}) } };
  } catch {
    return { ...defaultState, passageStats: {} };
  }
}

function saveState(state) {
  try {
    localStorage.setItem("speedKidsState", JSON.stringify(state));
  } catch {
    // 保存できない環境(プライベートモード等)では無視する。
  }
}

function toLocalYMD(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysSince(ymd, todayYMD) {
  if (!ymd) return Infinity;
  const a = new Date(`${ymd}T00:00:00`);
  const b = new Date(`${todayYMD}T00:00:00`);
  return Math.round((b - a) / MS_PER_DAY);
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function show(el) {
  el.classList.remove("hidden");
}

function hide(el) {
  el.classList.add("hidden");
}

// お手本(Modeling): 流暢な読みを先に聞かせる。Web Speech APIが無い環境では静かに無効化。
// 聞き終えた時点で読みの計測を始め直し、聞いている時間を読み時間に含めない。
function speakModel(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text.replace(/\s+/g, ""));
  utter.lang = "ja-JP";
  utter.rate = Number(modelRange.value);
  utter.onend = () => {
    if (running && !readBtn.disabled) readStartMs = Date.now();
  };
  window.speechSynthesis.speak(utter);
}

// --- 分散復習を考慮したセッション構成 ---
// 「久しく読んでいない / 未読」の短文を優先して選び、自然に復習を織り込む。
function buildQueue(setKey, stats) {
  const today = toLocalYMD(new Date());
  const set = passageSets[setKey] || passageSets["1-hiragana"];
  const annotated = set.items.map((p) => {
    const rec = stats.passageStats[p.id];
    const since = daysSince(rec && rec.lastDate, today);
    return {
      ...p,
      isReview: Number.isFinite(since) && since >= REVIEW_DAYS,
      sinceDays: since
    };
  });
  // 間隔が大きい(=ひさしぶり/未読)ものを先頭に。Infinity(未読)が最優先。
  annotated.sort((a, b) => b.sinceDays - a.sinceDays);
  const picked = annotated.slice(0, Math.min(SESSION_PASSAGES, annotated.length));
  return shuffle(picked);
}

// --- 表示更新 ---
function renderProgress() {
  scoreEl.textContent = String(score);
  comboEl.textContent = String(combo);
  countEl.textContent = String(count);
  accuracyEl.textContent = count ? String(Math.round((fluentReads / count) * 100)) : "0";
  comprehensionEl.textContent = `${comprehensionCorrect}/${comprehensionTotal}`;
  starsTodayEl.textContent = String(starsToday);
  const minutes = totalReadMs / MS_PER_MINUTE;
  wpmEl.textContent = minutes > 0 ? String(Math.round(totalWords / minutes)) : "0";
  elapsedEl.textContent = String(elapsedSec);
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

// --- セッションの進行 ---
function showCurrentPassage() {
  const passage = queue[passageIndex];
  passageEl.textContent = passage.text;
  passageIndexEl.textContent = String(passageIndex + 1);
  repeatIndexEl.textContent = String(currentRepeat + 1);
  reviewTagEl.classList.toggle("hidden", !passage.isReview);

  hide(feedbackEl);
  hide(improveNoteEl);
  hide(quizEl);
  readBtn.disabled = false;
  modelBtn.disabled = false;
  readStartMs = Date.now();
}

// 「よめた！」→ 読み時間を確定し、自己申告(すらすら/つっかえた)を求める
function finishRead() {
  if (!running) return;
  const elapsed = Date.now() - readStartMs;
  currentReadTimes.push(elapsed);
  readBtn.disabled = true;
  modelBtn.disabled = true;
  show(feedbackEl);
}

// 自己申告を受けて得点・自己ベスト判定し、次の回 or 内容確認へ
function recordFluency(isFluent) {
  // 自己申告フォームが出ていない(=多重クリック等)ときは無視する。
  if (!running || feedbackEl.classList.contains("hidden")) return;
  const passage = queue[passageIndex];
  const readMs = currentReadTimes[currentReadTimes.length - 1];
  const words = wordCount(passage.text);

  count += 1;
  totalWords += words;
  totalReadMs += readMs;

  let gained = 5; // 読み切りの基礎点
  const messages = [];

  if (isFluent) {
    fluentReads += 1;
    combo += 1;
    gained += 5 + combo; // すらすら + れんぞくボーナス
    messages.push("😄 すらすら よめたね！");
  } else {
    combo = 0;
    messages.push("😅 ゆっくりで だいじょうぶ。もういちど！");
  }

  // 同じ短文の前の回より速ければ(かつ すらすらなら)称える: 自己ベース改善の可視化
  if (isFluent && currentReadTimes.length >= 2) {
    const prev = currentReadTimes[currentReadTimes.length - 2];
    if (readMs < prev) {
      const diff = ((prev - readMs) / 1000).toFixed(1);
      messages.push(`まえより ${diff}びょう はやい！⚡`);
    }
  }

  // 自己ベスト(過去の保存記録)更新。すぐ保存して次の回・次の文に引き継ぐ。
  // 過去に記録がある(=finite)ときだけ「こうしん」を称える。初回はそっと基準を作る。
  const rec = appState.passageStats[passage.id] || { bestMs: Infinity, plays: 0, lastDate: "" };
  const hadBest = Number.isFinite(rec.bestMs);
  if (isFluent && readMs < (rec.bestMs ?? Infinity)) {
    rec.bestMs = readMs;
    if (hadBest) {
      gained += 10;
      messages.push("🎉 じこベスト こうしん！");
    } else {
      messages.push("⭐ はじめての きろく！");
    }
  }
  appState.passageStats[passage.id] = rec;
  saveState(appState);

  score += gained;
  improveNoteEl.textContent = messages.join("　");
  show(improveNoteEl);
  hide(feedbackEl);
  renderProgress();

  currentRepeat += 1;
  if (currentRepeat < repeatTarget) {
    // 同じ短文をくりかえす(Repeated Reading)
    repeatIndexEl.textContent = String(currentRepeat + 1);
    readBtn.disabled = false;
    modelBtn.disabled = false;
    readStartMs = Date.now();
  } else {
    // くりかえし完了 → 内容確認(理解を落とさない運用)
    showQuiz(passage);
  }
}

function showQuiz(passage) {
  quizQuestionEl.textContent = passage.q.ask;
  quizChoicesEl.innerHTML = "";
  hide(quizResultEl);
  passage.q.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.className = "quiz-choice";
    btn.textContent = choice;
    btn.addEventListener("click", () => answerQuiz(i, passage), { once: true });
    quizChoicesEl.appendChild(btn);
  });
  show(quizEl);
  readBtn.disabled = true;
  modelBtn.disabled = true;
}

function answerQuiz(choiceIndex, passage) {
  comprehensionTotal += 1;
  const correct = choiceIndex === passage.q.answer;
  // 全選択肢を無効化し、正解を明示
  [...quizChoicesEl.children].forEach((btn, i) => {
    btn.disabled = true;
    if (i === passage.q.answer) btn.classList.add("correct");
    else if (i === choiceIndex) btn.classList.add("wrong");
  });
  if (correct) {
    comprehensionCorrect += 1;
    score += 15; // 理解に厚めの配点
    quizResultEl.textContent = "せいかい！⭕ ないようも バッチリ。";
  } else {
    combo = 0;
    quizResultEl.textContent = `おしい！こたえは「${passage.q.choices[passage.q.answer]}」だよ。`;
  }
  show(quizResultEl);

  // この短文の学習記録を更新(分散復習・自己ベスト用)
  const rec = appState.passageStats[passage.id] || { bestMs: Infinity, plays: 0, lastDate: "" };
  rec.plays = (rec.plays || 0) + 1;
  rec.lastDate = toLocalYMD(new Date());
  appState.passageStats[passage.id] = rec;
  saveState(appState);

  renderProgress();

  // 次の短文へ。少し間をおいて自動で進む(子が結果を見られるように)。
  setTimeout(() => {
    passageIndex += 1;
    if (passageIndex >= queue.length) {
      endSession();
    } else {
      currentRepeat = 0;
      currentReadTimes = [];
      showCurrentPassage();
    }
  }, 1200);
}

// --- ほし/streak の付与 ---
// 報酬は「すらすら度」「理解」に重みづけ。同日中は最大値を採用(やり直しても損しない)。
function computeSessionStars(state) {
  const fluentRate = count ? fluentReads / count : 0;
  const compRate = comprehensionTotal ? comprehensionCorrect / comprehensionTotal : 0;
  let stars = 1; // 参加のほし
  if (fluentRate >= 0.7) stars += 1; // すらすら度
  if (compRate >= 0.5) stars += 1; // 理解
  if (state.streak >= 7) stars += 1; // 継続ボーナス
  return stars;
}

function applyDailyReward() {
  const state = appState;
  const today = toLocalYMD(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = toLocalYMD(yesterdayDate);

  if (state.lastPlayedDate === today) {
    const prevStarsToday = state.lastStarsToday || 0;
    const sessionStars = computeSessionStars(state);
    starsToday = Math.max(prevStarsToday, sessionStars);
    state.totalStars += starsToday - prevStarsToday;
    state.bestScore = Math.max(state.bestScore, score);
    state.lastStarsToday = starsToday;
    saveState(state);
    return state;
  }

  if (state.lastPlayedDate === yesterday) {
    state.streak += 1;
  } else {
    state.streak = 1;
  }

  starsToday = computeSessionStars(state);
  state.totalStars += starsToday;
  state.lastPlayedDate = today;
  state.bestScore = Math.max(state.bestScore, score);
  state.lastStarsToday = starsToday;
  saveState(state);
  return state;
}

function endSession() {
  running = false;
  clearInterval(elapsedTimerId);
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();

  readBtn.disabled = true;
  modelBtn.disabled = true;
  startBtn.disabled = false;
  hide(feedbackEl);
  hide(quizEl);
  reviewTagEl.classList.add("hidden");

  const state = applyDailyReward();
  renderProgress();
  renderState(state);

  const minutes = totalReadMs / MS_PER_MINUTE;
  const wpm = minutes > 0 ? Math.round(totalWords / minutes) : 0;
  passageEl.textContent =
    `おつかれさま！ ${count}かい よんで、よむ はやさは やく ${wpm} ことば/ふん。` +
    ` すらすら ${count ? Math.round((fluentReads / count) * 100) : 0}%、` +
    ` りかい ${comprehensionCorrect}/${comprehensionTotal}！`;
  improveNoteEl.textContent = "あしたも つづけて、きのうの じぶんを こえよう！⭐";
  show(improveNoteEl);
}

function startSession() {
  appState = loadState();
  running = true;
  clearInterval(elapsedTimerId);
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();

  repeatTarget = Number(repeatSelect.value);
  queue = buildQueue(setSelect.value, appState);

  passageIndex = 0;
  currentRepeat = 0;
  currentReadTimes = [];
  elapsedSec = 0;

  score = 0;
  combo = 0;
  count = 0;
  fluentReads = 0;
  totalWords = 0;
  totalReadMs = 0;
  comprehensionCorrect = 0;
  comprehensionTotal = 0;
  starsToday = 0;

  passageTotalEl.textContent = String(queue.length);
  repeatTotalEl.textContent = String(repeatTarget);
  startBtn.disabled = true;

  showCurrentPassage();
  renderProgress();

  // 経過時間は「数えるだけ」。強制ペースや締切で急かさない(速度-正確性トレードオフ配慮)。
  elapsedTimerId = setInterval(() => {
    elapsedSec += 1;
    elapsedEl.textContent = String(elapsedSec);
  }, 1000);
}

// --- イベント ---
const modelRateLabels = { 0.6: "ゆっくり", 0.7: "ゆっくり", 0.8: "ふつう", 0.9: "ふつう", 1: "はやめ", 1.1: "はやめ" };
modelRange.addEventListener("input", () => {
  modelValue.textContent = modelRateLabels[modelRange.value] || "ふつう";
});

startBtn.addEventListener("click", startSession);
modelBtn.addEventListener("click", () => {
  if (running) speakModel(queue[passageIndex].text);
});
readBtn.addEventListener("click", finishRead);
fluentBtn.addEventListener("click", () => recordFluency(true));
stumbleBtn.addEventListener("click", () => recordFluency(false));

appState = loadState();
renderState(appState);
renderProgress();
