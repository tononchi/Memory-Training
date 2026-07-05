// 速読・読解トレーニング（中高生むけ）
// 設計根拠: ../docs/reading-by-grade-band.md
//  - 目的に応じた読速の使い分け（スキミング/スキャニング/精読）＋読解方略＋理解の担保。
//  - 「理解できた時だけ読速を記録」する＝速度-正確性トレードオフ(Rayner 2016)への配慮。
//  - RSVP的な高速強制提示は採用しない。

const passages = window.SECONDARY_PASSAGES || [];

const TIPS = {
  skim:
    "🔎 ざっくり読み（スキミング）：題・最初と最後の文・くり返し出る語に注目し、全体の要旨をつかもう。細部は飛ばしてOK。読み終えたら主旨を答えます。",
  scan:
    "🎯 さがし読み（スキャニング）：先に「何を探すか」を確かめ、その語・数字だけを目で追って探そう。答えが見つかったら選択肢を押します。",
  careful:
    "📖 じっくり読み（精読）：段落ごとに頭の中で要約し、わからない語は前後から推測。理解を最優先に、細部と推論まで読み取ろう。"
};
const MODE_LABELS = { skim: "ざっくり読み", scan: "さがし読み", careful: "じっくり読み" };

// --- 状態 ---
let mode = "skim";
let phase = "idle"; // idle | reading | question | done
let passage = null;
let qList = []; // この回の設問
let qIndex = 0;
let correctCount = 0;
let readStartMs = 0;
let readMs = 0;
let timerId = null;
let order = []; // 出題順（毎ラウンド消費し、尽きたら作り直す）

// --- 永続記録 ---
function loadStore() {
  try {
    return JSON.parse(localStorage.getItem("secondaryReading") || "{}");
  } catch {
    return {};
  }
}
function saveStore(s) {
  try {
    localStorage.setItem("secondaryReading", JSON.stringify(s));
  } catch {
    /* 保存不可環境は無視 */
  }
}
let store = {
  best: { skim: 0, scan: 0, careful: 0 },
  compCorrect: 0,
  compTotal: 0,
  rounds: 0,
  ...loadStore()
};
store.best = { skim: 0, scan: 0, careful: 0, ...(store.best || {}) };

// --- DOM ---
const modeSelect = document.getElementById("modeSelect");
const startBtn = document.getElementById("startBtn");
const tipEl = document.getElementById("tip");
const passageTitleEl = document.getElementById("passageTitle");
const elapsedEl = document.getElementById("elapsed");
const passageEl = document.getElementById("passage");
const readBtn = document.getElementById("readBtn");
const quizEl = document.getElementById("quiz");
const quizQuestionEl = document.getElementById("quizQuestion");
const quizChoicesEl = document.getElementById("quizChoices");
const quizProgressEl = document.getElementById("quizProgress");
const resultEl = document.getElementById("result");

const cpmEl = document.getElementById("cpm");
const roundTimeEl = document.getElementById("roundTime");
const roundCompEl = document.getElementById("roundComp");
const effCpmEl = document.getElementById("effCpm");
const bestSkimEl = document.getElementById("bestSkim");
const bestScanEl = document.getElementById("bestScan");
const bestCarefulEl = document.getElementById("bestCareful");
const compRateEl = document.getElementById("compRate");
const roundsEl = document.getElementById("rounds");

// --- ユーティリティ ---
function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }
function charCount(text) { return [...text].length; }
function cpmOf(chars, ms) { return ms > 0 ? Math.round(chars / (ms / 60000)) : 0; }

function nextPassage() {
  if (!order.length) {
    // 並べ替えてラウンドを作り直す（Math.random は許可された通常のブラウザJS）
    order = passages.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  }
  return passages[order.shift()];
}

function startTimer() {
  readStartMs = Date.now();
  clearInterval(timerId);
  timerId = setInterval(() => {
    elapsedEl.textContent = ((Date.now() - readStartMs) / 1000).toFixed(1);
  }, 100);
}
function stopTimer() {
  clearInterval(timerId);
  readMs = Date.now() - readStartMs;
  elapsedEl.textContent = (readMs / 1000).toFixed(1);
}

function renderStore() {
  bestSkimEl.textContent = store.best.skim || "—";
  bestScanEl.textContent = store.best.scan || "—";
  bestCarefulEl.textContent = store.best.careful || "—";
  compRateEl.textContent = store.compTotal ? Math.round((store.compCorrect / store.compTotal) * 100) : "—";
  roundsEl.textContent = String(store.rounds);
}

// --- ラウンド進行 ---
function startRound() {
  mode = modeSelect.value;
  passage = nextPassage();
  correctCount = 0;
  qIndex = 0;
  qList = mode === "careful" ? passage.careful.slice() : [mode === "skim" ? passage.skimQ : passage.scanQ];

  tipEl.textContent = TIPS[mode];
  passageTitleEl.textContent = `「${passage.title}」（${MODE_LABELS[mode]}）`;
  elapsedEl.textContent = "0.0";
  hide(quizEl);
  hide(resultEl);
  startBtn.disabled = true;
  modeSelect.disabled = true;

  if (mode === "scan") {
    // さがし読み: 設問を先に見せ、本文と一緒に表示。選択で計測終了。
    passageEl.textContent = passage.text;
    show(passageEl);
    hide(readBtn);
    phase = "question";
    startTimer();
    renderQuestion();
    show(quizEl);
  } else {
    // ざっくり/じっくり: 本文を読み、「読み終えた」で計測終了→設問
    passageEl.textContent = passage.text;
    show(passageEl);
    show(readBtn);
    readBtn.disabled = false;
    phase = "reading";
    startTimer();
  }
}

function finishReading() {
  if (phase !== "reading") return;
  stopTimer();
  hide(readBtn);
  hide(passageEl); // 要旨・記憶から答えさせる（精読/スキミング）
  phase = "question";
  renderQuestion();
  show(quizEl);
}

function renderQuestion() {
  const q = qList[qIndex];
  quizQuestionEl.textContent = q.ask;
  quizChoicesEl.innerHTML = "";
  q.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.addEventListener("click", () => answer(i), { once: true });
    quizChoicesEl.appendChild(btn);
  });
  quizProgressEl.textContent = qList.length > 1 ? `設問 ${qIndex + 1} / ${qList.length}` : "";
}

function answer(choiceIndex) {
  // scan は最初の選択時点で計測を止める
  if (mode === "scan" && phase === "question" && qIndex === 0) stopTimer();

  const q = qList[qIndex];
  const correct = choiceIndex === q.answer;
  if (correct) correctCount += 1;

  [...quizChoicesEl.children].forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add("correct");
    else if (i === choiceIndex) btn.classList.add("wrong");
  });

  qIndex += 1;
  if (qIndex < qList.length) {
    setTimeout(() => renderQuestion(), 700);
  } else {
    setTimeout(() => finishRound(), 700);
  }
}

function finishRound() {
  hide(quizEl);
  phase = "done";
  startBtn.disabled = false;
  startBtn.textContent = "つぎへ";
  modeSelect.disabled = false;

  const chars = charCount(passage.text);
  const cpm = cpmOf(chars, readMs);
  const comprehended = correctCount === qList.length; // 全問正解で「理解できた」とみなす

  // 記録更新
  store.compTotal += qList.length;
  store.compCorrect += correctCount;
  store.rounds += 1;
  let effCpm = 0;
  if (comprehended) {
    effCpm = cpm;
    if (cpm > (store.best[mode] || 0)) store.best[mode] = cpm;
  }
  saveStore(store);

  // 表示
  cpmEl.textContent = String(cpm);
  roundTimeEl.textContent = (readMs / 1000).toFixed(1);
  roundCompEl.textContent = `${correctCount} / ${qList.length}${comprehended ? " ⭕" : ""}`;
  effCpmEl.textContent = comprehended ? String(effCpm) : "—";
  renderStore();

  resultEl.className = "result " + (comprehended ? "good" : "warn");
  resultEl.textContent = buildFeedback(mode, cpm, comprehended);
  show(resultEl);
}

function buildFeedback(m, cpm, comprehended) {
  if (!comprehended) {
    if (m === "careful") {
      return `理解が不十分でした（${cpm}文字/分）。精読は速さより理解が最優先。読み戻しながらていねいに。`;
    }
    if (m === "skim") {
      return `要旨を取り違えました（${cpm}文字/分）。題と最初・最後の文、くり返す語に注目して全体像をつかもう。`;
    }
    return `見つけられませんでした（${(readMs / 1000).toFixed(1)}秒）。探す語をしぼってから本文を追おう。`;
  }
  // 理解できた場合のモード別コメント
  if (m === "skim") {
    return `要旨をつかめました！${cpm}文字/分。ざっくり読みはこのくらい速くてOK。細部は精読で。`;
  }
  if (m === "scan") {
    return `見つけました！${(readMs / 1000).toFixed(1)}秒（${cpm}文字/分）。探す情報をしぼるほど速くなります。`;
  }
  return `しっかり理解できました！${cpm}文字/分。精読は速さより理解。読めたうえで速くなれば理想的。`;
}

// --- イベント ---
modeSelect.addEventListener("change", () => {
  tipEl.textContent = TIPS[modeSelect.value];
});
startBtn.addEventListener("click", () => {
  startBtn.textContent = "スタート";
  startRound();
});
readBtn.addEventListener("click", finishReading);

// 初期表示
tipEl.textContent = TIPS[modeSelect.value];
renderStore();
