import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const QUESTIONS = [
  { key: "job", ar: "المهنة أو الوظيفة", en: "Job or profession" },
  { key: "color", ar: "اللون المفضل", en: "Favorite color" },
  { key: "food", ar: "الأكلة المفضلة", en: "Favorite food" },
  { key: "style", ar: "شنو تلبس أغلب الوقت", en: "What you usually wear" },
];
const OPEN_QUESTIONS = [
  { key: "wish", ar: "لو تقدر تسوي شي وحد بس طول عمرك، شنو بيكون؟", en: "If you could only ever do one thing for the rest of your life, what would it be?" },
  { key: "funny", ar: "شنو أكثر موقف محرج أو مضحك صار لك؟", en: "What's the most embarrassing or funny thing that's happened to you?" },
];
const MAX_ORG_PHOTOS = 15;
const TIMER_DEFAULT = 30;
const FACEOFF_TIMER = 60;

const FACEOFF_QUESTIONS = [
  { ar: "قولنا موقف زلقت أو طحت قدام الناس — مضحك! 😬", en: "Tell us about a time you slipped or fell in front of people — make it funny! 😬" },
  { ar: "قولنا موقف دقيت على شخص بالغلط من زمان وتوهقت 📞", en: "Tell us about a time you accidentally called someone from long ago and got caught 📞" },
  { ar: "قولنا موقف مضحك — واحد خوّفك أو من حيوان 😱", en: "Tell us a funny story — someone scared you or an animal incident 😱" },
  { ar: "قولنا أحرج موقف صار لك قدام الناس 😳", en: "Tell us your most embarrassing moment in front of people 😳" },
  { ar: "سوِّ أي شي يضحك الفريق اللي ضدك! 🤣", en: "Do anything to make the opposing team laugh! 🤣" },
  { ar: "مكاسر باليد 💪 — أقوى واحد من كل فريق يتواجهون!", en: "Arm wrestling 💪 — strongest one from each team face off!" },
  { ar: "مكاسر بالإصبع 👆 — مواجهة بين الفريقين!", en: "Finger wrestling 👆 — teams face off!" },
  { ar: "خذ النقاط، تستاهل! 🎁", en: "Take the points — you deserve them! 🎁" },
  { ar: "الفريق الثاني ياخذ النقاط 😈", en: "Opposing team gets the points 😈" },
  { ar: "خِزني وأخِزك — لا ترمش! 👀", en: "Staring contest — don't blink! 👀" },
  { ar: "اكتب اسمك باليد الثانية وعيونك مسكّرة ✍️", en: "Write your name with your non-dominant hand — eyes closed! ✍️" },
  { ar: "قول: شنبك ده هحلق هولك — ٥ مرات متتالية! 👄", en: "Say the tongue twister 5 times fast! 👄" },
  { ar: "بطتنا بطّت بطن بطتكم، تقدر بطتكم تبط بطن بطتنا؟ — ٥ مرات! 🦆", en: "Say the duck tongue twister 5 times fast! 🦆" },
  { ar: "حوش خميس خوش حوش — ٥ مرات متتالية! 🏡", en: "Say 'Hawsh Khamees Khawsh Hawsh' 5 times fast! 🏡" },
  { ar: "اقلب السؤال! الفريق الثاني هو اللي يجاوب الحين 🔄", en: "Flip it! The opposing team answers this one 🔄" },
  { ar: "قول جملة طويلة بنفس واحد بدون توقف 🌬️", en: "Say a long sentence in one breath without stopping 🌬️" },
  { ar: "اشرح شي لفريقك بدون كلام وهم يخمنون 🙊", en: "Explain something to your team without words — they guess 🙊" },
  { ar: "واحد من فريقك يلبس سماعات وانت تقوله كلمة — لازم يعرفها! 🎧", en: "Someone from your team puts on headphones — say a word and they have to guess it! 🎧" },
  { ar: "حجرة ورقة مقص ✊📄✂️ — الفايز ياخذ النقاط!", en: "Rock Paper Scissors ✊📄✂️ — winner takes the points!" },
  { ar: "اشرح فلم أو مسلسل بدون كلام 🎬 — الفريق الضد يختار وفريقك يخمن!", en: "Act out a movie or show without talking 🎬 — opposing team picks, your team guesses!" },
  { ar: "اشرح أكلة أو جماد أو حيوان بدون كلام 🎭 — الفريق الضد يختار وفريقك يجاوب!", en: "Act out a food, object or animal without talking 🎭 — opposing team picks, your team guesses!" },
];

const TEAM_META = {
  1: { color: "#E8A33D", bg: "#3A2E17" },
  2: { color: "#3DB8A8", bg: "#123330" },
};

const STR = {
  ar: {
    title: "مين هذا؟",
    subtitle: "لعبة العائلة والأصدقاء — كل واحد يلعب",
    playersCount: "عدد اللاعبين",
    startRegistration: "ابدأ التسجيل الخاص",
    privacyNote: "كل شخص بيسجل بياناته لحاله بخصوصية. الجوال بيتمرر بينكم، وما يشوف أي أحد بيانات غيره.",
    passTo: "مرر الجوال إلى",
    playerFrom: (name) => `لاعب من ${name}`,
    privacyTurn: "تأكد إن باقي اللاعبين ما يشوفون الشاشة الحين — هذا وقتك الخاص",
    readyFill: "جاهز، عبّي بياناتك",
    yourName: "اسمك",
    doneStart: "خلصت — ابدأ اللعبة",
    donePass: "خلصت، مرر الجوال",
    chooseRound: "اختر الجولة",
    passAnyone: "مرّروا الجوال لأي شخص — الكل يقدر يشغّلها ويلعب",
    round1Title: "الجولة ١",
    round1Name: "التخمين",
    round1Desc: "يطلع اسم شخص وصفة، والفرق تخمن جوابه",
    round2Title: "الجولة ٢",
    round2Name: "تريفيا",
    round2Desc: "يطلع الجواب، والفرق تخمن مين صاحبه",
    round3Title: "الجولة ٣",
    round3Name: "المواجهة",
    round3Desc: "تحديات ومواجهات — ٦ جولات بين الفريقين",
    round4Title: "الجولة ٤",
    round4Name: "خمّن الصورة",
    round4Desc: "تطلع صورة غرض — شنو هذا الشيء؟",
    endGame: "إنهاء اللعبة والنتيجة",
    guessingLabel: "التخمين",
    triviaLabel: "تريفيا",
    triviaLocked: "تريفيا — تحتاج ٣+ لاعبين بكل فريق",
    noQuestions: "ما فيه أسئلة كافية معبّاة بالبطاقات.",
    personLabel: "الشخص",
    attrNeeded: "الصفة المطلوبة",
    revealAnswer: "كشف الجواب",
    whoseAnswer: "مين جوابه كذا؟",
    revealName: "كشف الاسم",
    correct: "صح",
    skipNoPoints: "تخطي بدون نقاط",
    photoGuessLabel: "خمّن الصورة",
    noPhotos: "المنظم ما رفع صور بعد.",
    photoQuestion: "شنو هذا الشيء؟",
    fastestWins: "أسرع فريق يجاوب يأخذ النقاط",
    faceoffLabel: "المواجهة",
    needOneEach: "محتاج لاعب واحد على الأقل بكل فريق.",
    faceoffWinnerPoints: "الفايز ياخذ نقطتين",
    faceoffChallenge: (name) => `${name} يحاولون ما يتفاعلون`,
    win: (name) => `${name} 🏆`,
    endRound: "إنهاء الجولة",
    tie: "تعادل!",
    wins: (name) => `${name} يفوز!`,
    newGame: "لعبة جديدة",
    defaultTeam1: "الفريق الأول",
    defaultTeam2: "الفريق الثاني",
    customizeQuestions: "الأسئلة والصفات (اختياري: عدّلها قبل البدء)",
    newQuestion: "سؤال جديد",
    questionFor: (name) => `السؤال لـ ${name}`,
    organizerTitle: "المنظم",
    organizerSubtitle: "المنظم يحمّل صور الجولة ٤ — اللاعبين ما يشوفون هذه الشاشة",
    organizerPhotosLabel: "صور الأغراض للجولة ٤",
    organizerDone: "خلصت — ابدأ تسجيل اللاعبين",
    passToOrganizer: "مرر الجوال إلى المنظم",
    back: "رجوع",
    continueReg: (done, total) => `كمّل التسجيل — ${done} / ${total} لاعب`,
    startOver: "ابدأ من جديد",
  },
  en: {
    title: "Who's Who?",
    subtitle: "Family & friends game — everyone plays",
    playersCount: "Number of players",
    startRegistration: "Start Private Sign-up",
    privacyNote: "Everyone fills in their own info privately. Pass the phone around — no one sees anyone else's answers.",
    passTo: "Pass the phone to",
    playerFrom: (name) => `A player from ${name}`,
    privacyTurn: "Make sure the others aren't watching the screen now — this is your private moment",
    readyFill: "Ready, fill in your info",
    yourName: "Your name",
    doneStart: "Done — start the game",
    donePass: "Done, pass the phone",
    chooseRound: "Choose a Round",
    passAnyone: "Pass the phone to anyone — everyone can run it and play",
    round1Title: "Round 1",
    round1Name: "Guess",
    round1Desc: "A name and trait show up, teams guess the answer",
    round2Title: "Round 2",
    round2Name: "Trivia",
    round2Desc: "The answer shows up, teams guess whose it is",
    round3Title: "Round 3",
    round3Name: "Face-Off",
    round3Desc: "Challenges & face-offs — 6 rounds between teams",
    round4Title: "Round 4",
    round4Name: "Guess the Photo",
    round4Desc: "A photo shows up — what is this thing?",
    endGame: "End Game & Show Results",
    guessingLabel: "Guess",
    triviaLabel: "Trivia",
    triviaLocked: "Trivia — needs 3+ players per team",
    noQuestions: "Not enough answers filled in the cards.",
    personLabel: "Person",
    attrNeeded: "Trait needed",
    revealAnswer: "Reveal Answer",
    whoseAnswer: "Whose answer is this?",
    revealName: "Reveal Name",
    correct: "Correct",
    skipNoPoints: "Skip, no points",
    photoGuessLabel: "Guess the Photo",
    noPhotos: "Organizer hasn't uploaded any photos yet.",
    photoQuestion: "What is this?",
    fastestWins: "Fastest team to answer wins",
    faceoffLabel: "Face-Off",
    needOneEach: "Need at least one player per team.",
    faceoffWinnerPoints: "Winner gets 2 points",
    faceoffChallenge: (name) => `${name} try not to react`,
    win: (name) => `${name} 🏆`,
    endRound: "End Round",
    tie: "It's a tie!",
    wins: (name) => `${name} wins!`,
    newGame: "New Game",
    defaultTeam1: "Team 1",
    defaultTeam2: "Team 2",
    customizeQuestions: "Questions & Attributes (optional: edit before starting)",
    newQuestion: "New Question",
    questionFor: (name) => `Question for ${name}`,
    organizerTitle: "Organizer",
    organizerSubtitle: "The organizer uploads Round 4 photos — players don't see this screen",
    organizerPhotosLabel: "Object photos for Round 4",
    organizerDone: "Done — start player registration",
    passToOrganizer: "Pass the phone to the Organizer",
    back: "Back",
    continueReg: (done, total) => `Continue Sign-up — ${done} / ${total}`,
    startOver: "Start Over",
  },
};

const defaultQLabels = (l) => QUESTIONS.map((q) => q[l]);
const defaultOpenQLabels = (l) => OPEN_QUESTIONS.map((q) => q[l]);

function uid() { return Math.random().toString(36).slice(2, 9); }
function emptyPlayerDraft(team) {
  return { id: uid(), team, name: "", job: "", color: "", food: "", style: "", wish: "", funny: "" };
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function WhosWhoLogo({ size = 64, mini = false }) {
  const fs = mini ? size * 0.6 : size;
  const divW = mini ? fs * 2 : fs * 2.5;
  return (
    <div style={{ lineHeight: 1, textAlign: "center" }}>
      <div style={{ fontFamily: "Bangers, Georgia, serif", fontSize: fs, letterSpacing: 3, color: "#E8A33D", textShadow: "0 2px 16px rgba(232,163,61,0.5)", direction: "ltr" }}>
        WHO'S
      </div>
      <div style={{ height: 2, margin: "1px auto 0", width: divW, background: "linear-gradient(to right,transparent,#E8A33D 35%,#3DB8A8 65%,transparent)", borderRadius: 4 }} />
      <div style={{ fontFamily: "Bangers, Georgia, serif", fontSize: fs, letterSpacing: 3, lineHeight: 1, direction: "ltr" }}>
        <span style={{ color: "#E8A33D", textShadow: "0 2px 16px rgba(232,163,61,0.5)" }}>WHO</span>
        <span style={{ color: "#3ECFBE", textShadow: "0 0 16px rgba(61,184,168,0.8)" }}>?</span>
      </div>
    </div>
  );
}

function WhosWho() {
  const [lang, setLang] = useState("ar");
  const t = STR[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const [appScale, setAppScale] = useState(1);
  useEffect(() => {
    function calcScale() {
      const mobileW = 448;
      const mobileH = 844;
      const scaleX = window.innerWidth / mobileW;
      const scaleY = window.innerHeight / mobileH;
      const s = Math.min(scaleX, scaleY);
      setAppScale(s > 1 ? s : 1);
    }
    calcScale();
    window.addEventListener("resize", calcScale);
    return () => window.removeEventListener("resize", calcScale);
  }, []);

  const [screen, setScreen] = useState("counts");
  const [teamNames, setTeamNames] = useState({ 1: STR.ar.defaultTeam1, 2: STR.ar.defaultTeam2 });
  const [qLabels, setQLabels] = useState({ ar: defaultQLabels("ar"), en: defaultQLabels("en") });
  const [openQLabels, setOpenQLabels] = useState({ ar: defaultOpenQLabels("ar"), en: defaultOpenQLabels("en") });
  const [counts, setCounts] = useState({ 1: 2, 2: 2 });
  const [queue, setQueue] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [players, setPlayers] = useState([]);
  const [draft, setDraft] = useState(null);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });

  const [deck, setDeck] = useState([]);
  const [deckIdx, setDeckIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const [faceoffOrder, setFaceoffOrder] = useState([]);
  const [faceoffPairIdx, setFaceoffPairIdx] = useState(0);
  const [faceoffLiveQIdx, setFaceoffLiveQIdx] = useState(0);
  const [faceoffShufflesLeft, setFaceoffShufflesLeft] = useState(3);

  const [organizer, setOrganizer] = useState({ photos: [] });
  const [timerSeconds, setTimerSeconds] = useState(TIMER_DEFAULT);
  const [timerRunning, setTimerRunning] = useState(false);

  // Timer: tick every second when running
  useEffect(() => {
    if (!timerRunning) return;
    if (timerSeconds <= 0) { setTimerRunning(false); return; }
    const id = setTimeout(() => setTimerSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(id);
  }, [timerRunning, timerSeconds]);

  // Auto-start timer when entering a round screen or advancing a card
  useEffect(() => {
    if (["round1", "round2", "round3", "round4"].includes(screen)) {
      setTimerSeconds(screen === "round3" ? FACEOFF_TIMER : TIMER_DEFAULT);
      setTimerRunning(true);
    } else {
      setTimerRunning(false);
    }
  }, [screen, deckIdx, faceoffPairIdx]);

  const timerMax = screen === "round3" ? FACEOFF_TIMER : TIMER_DEFAULT;
  function resetTimer() { setTimerSeconds(timerMax); setTimerRunning(true); }

  // ── Registration flow ────────────────────────────────────────────
  function startRegistration() { setScreen("organizer"); }

  function finishOrganizer() {
    const q = [];
    for (let i = 0; i < counts[1]; i++) q.push({ team: 1, order: i });
    for (let i = 0; i < counts[2]; i++) q.push({ team: 2, order: i });
    setQueue(q);
    setQIdx(0);
    setPlayers([]);
    setDraft(emptyPlayerDraft(q[0].team));
    setScreen("pass");
  }

  function beginCurrentEntry() {
    setDraft(emptyPlayerDraft(queue[qIdx].team));
    setScreen("collecting");
  }

  function saveDraftAndAdvance() {
    setPlayers((prev) => [...prev, draft]);
    const next = qIdx + 1;
    if (next >= queue.length) setScreen("rounds");
    else { setQIdx(next); setScreen("pass"); }
  }

  function updateDraft(field, value) { setDraft((d) => ({ ...d, [field]: value })); }

  function handleOrganizerPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setOrganizer((o) => ({ ...o, photos: [...o.photos, { id: uid(), src: reader.result }] }));
    reader.readAsDataURL(file);
    e.target.value = "";
  }
  function removeOrganizerPhoto(id) { setOrganizer((o) => ({ ...o, photos: o.photos.filter((p) => p.id !== id) })); }

  // ── Deck builders ────────────────────────────────────────────────
  function buildDeck() {
    const items = [];
    players.forEach((p) => {
      QUESTIONS.forEach((q, idx) => {
        if (p[q.key]?.trim()) items.push({ player: p, attrLabel: qLabels[lang][idx], value: p[q.key], askedTeam: p.team === 1 ? 2 : 1 });
      });
    });
    return shuffle(items);
  }
  function buildPhotoDeck() { return shuffle(organizer.photos.map((ph) => ({ src: ph.src }))); }

  // ── Round starters ───────────────────────────────────────────────
  function startRound1() { setDeck(buildDeck()); setDeckIdx(0); setRevealed(false); setScreen("round1"); }
  function startRound2() { setDeck(buildDeck()); setDeckIdx(0); setRevealed(false); setScreen("round2"); }
  function startRound4() { setDeck(buildPhotoDeck()); setDeckIdx(0); setScreen("round4"); }
  function startRound3() {
    const pick3 = (arr) => { const s = shuffle(arr); return [0,1,2].map((i) => s[i % s.length]); };
    const t1 = players.filter((p) => p.team === 1);
    const t2 = players.filter((p) => p.team === 2);
    if (!t1.length || !t2.length) { setFaceoffOrder([]); setFaceoffPairIdx(0); setScreen("round3"); return; }
    const p1 = pick3(t1), p2 = pick3(t2);
    const order = [];
    for (let i = 0; i < 3; i++) { order.push(p1[i]); order.push(p2[i]); }
    setFaceoffOrder(order);
    setFaceoffPairIdx(0);
    setFaceoffLiveQIdx(Math.floor(Math.random() * FACEOFF_QUESTIONS.length));
    setFaceoffShufflesLeft(3);
    setScreen("round3");
  }

  function nextFaceoffQ() {
    setFaceoffShufflesLeft((n) => n - 1);
    setFaceoffLiveQIdx((idx) => { let n = Math.floor(Math.random() * FACEOFF_QUESTIONS.length); if (n === idx) n = (idx + 1) % FACEOFF_QUESTIONS.length; return n; });
  }
  function randomFaceoffQ(currentIdx) {
    let n = Math.floor(Math.random() * FACEOFF_QUESTIONS.length);
    if (n === currentIdx) n = (currentIdx + 1) % FACEOFF_QUESTIONS.length;
    return n;
  }

  function award(points) { setScores((prev) => ({ 1: prev[1] + (points[1] || 0), 2: prev[2] + (points[2] || 0) })); }
  function nextCard() {
    if (deckIdx + 1 >= deck.length) setScreen("rounds");
    else { setDeckIdx((i) => i + 1); setRevealed(false); }
  }
  function resetGame() {
    setScreen("counts");
    setCounts({ 1: 2, 2: 2 });
    setTeamNames({ 1: t.defaultTeam1, 2: t.defaultTeam2 });
    setPlayers([]); setQueue([]); setQIdx(0);
    setScores({ 1: 0, 2: 0 });
    setDeck([]); setDeckIdx(0);
    setFaceoffOrder([]); setFaceoffPairIdx(0);
    setOrganizer({ photos: [] });
    setTimerRunning(false);
  }

  function backFromOrganizer() { setScreen("counts"); }
  function backFromPass() {
    if (qIdx === 0) setScreen("organizer");
    else setScreen("counts");
  }
  function backFromCollecting() {
    setDraft(emptyPlayerDraft(queue[qIdx].team));
    setScreen("pass");
  }
  function resetRegistration() {
    setPlayers([]); setQueue([]); setQIdx(0);
    setOrganizer({ photos: [] }); setDraft(null);
  }
  function continueRegistration() { setScreen("pass"); }

  const currentTeam = (screen === "pass" || screen === "collecting") ? queue[qIdx]?.team : null;
  const triviaOk = players.filter((p) => p.team === 1).length >= 3 && players.filter((p) => p.team === 2).length >= 3;

  const timerColor = timerSeconds <= 5 ? "#E85D5D" : timerSeconds <= 10 ? "#E8A33D" : "#3DB8A8";
  const timerBar = (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#1C1F30" }}>
        <div className="h-full rounded-full" style={{
          width: `${(timerSeconds / timerMax) * 100}%`,
          background: timerColor,
          transition: "width 0.95s linear, background 0.3s"
        }} />
      </div>
      <span className="font-black text-sm w-6 text-center" style={{ color: timerColor }}>{timerSeconds}</span>
      <button onClick={() => setTimerRunning((r) => !r)} className="w-7 h-7 rounded-full flex items-center justify-center text-xs active:scale-95" style={{ background: "#1C1F30" }}>
        {timerRunning ? "⏸" : "▶"}
      </button>
      <button onClick={resetTimer} className="w-7 h-7 rounded-full flex items-center justify-center active:scale-95" style={{ background: "#1C1F30", fontSize: 14 }}>↺</button>
    </div>
  );

  return (
    <div dir={dir} className="min-h-screen w-full" style={{ background: "#12141F", color: "#F2EDE3", fontFamily: "'Tajawal', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap');
        * { box-sizing: border-box; }
        .card-shadow { box-shadow: 0 8px 30px rgba(0,0,0,0.35); }
        .pulse { animation: pulse 1.6s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }
        .flip-in { animation: flipIn 0.4s ease-out; }
        @keyframes flipIn { from { opacity: 0; transform: scale(0.92) translateY(8px);} to { opacity: 1; transform: scale(1) translateY(0);} }
        input { outline: none; }
        input:focus { box-shadow: 0 0 0 2px #E8A33D; }
        .app-scaler { transform-origin: top center; }
        @media (min-width: 600px) {
          .app-scaler { transform: scale(var(--app-scale,1)); height: calc(var(--app-h,100vh)); }
        }
      `}</style>

      <button
        onClick={() => setLang((l) => {
          const nl = l === "ar" ? "en" : "ar";
          setTeamNames((prev) => ({
            1: prev[1] === STR[l].defaultTeam1 ? STR[nl].defaultTeam1 : prev[1],
            2: prev[2] === STR[l].defaultTeam2 ? STR[nl].defaultTeam2 : prev[2],
          }));
          return nl;
        })}
        className="active:scale-95"
        style={{ position: "fixed", top: 12, insetInlineEnd: 12, zIndex: 50, background: "#1C1F30", color: "#E8A33D", fontWeight: 900, fontSize: 12, padding: "6px 12px", borderRadius: 999, boxShadow: "0 4px 14px rgba(0,0,0,0.4)" }}
      >
        {lang === "ar" ? "EN" : "AR"}
      </button>

      <div className="app-scaler max-w-md mx-auto flex flex-col"
        style={{ "--app-scale": appScale, "--app-h": `${844}px`, minHeight: appScale > 1 ? 844 : "100vh", width: 448 }}>

        {/* Score header */}
        {["rounds","round1","round2","round3","round4"].includes(screen) && (
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#252840" }}>
            <button onClick={() => setScreen("rounds")} className="p-2 rounded-full active:scale-95" style={{ background: "#1C1F30" }}>
              <span style={{fontSize:18}}>{dir === "rtl" ? "◀" : "▶"}</span>
            </button>
            <div className="flex gap-3 text-sm font-bold">
              <div className="px-3 py-1 rounded-full" style={{ background: TEAM_META[1].bg, color: TEAM_META[1].color }}>{teamNames[1]} · {scores[1]}</div>
              <div className="px-3 py-1 rounded-full" style={{ background: TEAM_META[2].bg, color: TEAM_META[2].color }}>{teamNames[2]} · {scores[2]}</div>
            </div>
            <div style={{width:36}} />
          </div>
        )}

        {/* ── COUNTS ── */}
        {screen === "counts" && (
          <div className="flex-1 flex flex-col px-5 py-10 gap-8 justify-center">
            <div className="flex flex-col items-center mb-2 gap-3">
              <WhosWhoLogo size={64} />
              <div className="text-sm opacity-55">{t.subtitle}</div>
            </div>
            {[1, 2].map((team) => (
              <div key={team} className="rounded-2xl p-5 card-shadow flex flex-col gap-4" style={{ background: "#181B2A" }}>
                <div className="flex items-center gap-2">
                  <span style={{fontSize:18}}>👥</span>
                  <input value={teamNames[team]} onChange={(e) => setTeamNames((tn) => ({ ...tn, [team]: e.target.value }))}
                    className="bg-transparent font-bold text-lg flex-1 border-b pb-1" style={{ borderColor: TEAM_META[team].color, color: TEAM_META[team].color }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-70">{t.playersCount}</span>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setCounts((c) => ({ ...c, [team]: Math.max(1, c[team] - 1) }))} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95" style={{ background: "#12141F" }}><span style={{fontSize:18,fontWeight:900}}>−</span></button>
                    <span className="text-2xl font-black w-6 text-center">{counts[team]}</span>
                    <button onClick={() => setCounts((c) => ({ ...c, [team]: Math.min(12, c[team] + 1) }))} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95" style={{ background: "#12141F" }}><span style={{fontSize:18,fontWeight:900}}>+</span></button>
                  </div>
                </div>
              </div>
            ))}
            <div className="rounded-2xl p-4 card-shadow flex flex-col gap-2" style={{ background: "#181B2A" }}>
              <div className="text-xs font-bold opacity-50 mb-1">{t.customizeQuestions}</div>
              {QUESTIONS.map((q, i) => (
                <input key={q.key} value={qLabels[lang][i]} onChange={(e) => { const n=[...qLabels[lang]]; n[i]=e.target.value; setQLabels((p)=>({...p,[lang]:n})); }}
                  className="rounded-xl px-3 py-2 text-sm" style={{ background: "#12141F" }} />
              ))}
              {OPEN_QUESTIONS.map((q, i) => (
                <input key={q.key} value={openQLabels[lang][i]} onChange={(e) => { const n=[...openQLabels[lang]]; n[i]=e.target.value; setOpenQLabels((p)=>({...p,[lang]:n})); }}
                  className="rounded-xl px-3 py-2 text-sm" style={{ background: "#12141F" }} />
              ))}
            </div>
            {players.length > 0 ? (
              <div className="flex flex-col gap-3">
                <button onClick={continueRegistration} className="w-full py-4 rounded-2xl font-black text-lg active:scale-95" style={{ background: "#E8A33D", color: "#12141F" }}>
                  {t.continueReg(players.length, queue.length)}
                </button>
                <button onClick={resetRegistration} className="w-full py-3 rounded-2xl font-bold active:scale-95" style={{ background: "#1C1F30" }}>
                  {t.startOver}
                </button>
              </div>
            ) : (
              <button onClick={startRegistration} className="w-full py-4 rounded-2xl font-black text-lg active:scale-95" style={{ background: "#E8A33D", color: "#12141F" }}>{t.startRegistration}</button>
            )}
            <div className="text-center text-xs opacity-45 leading-relaxed">{t.privacyNote}</div>
          </div>
        )}

        {/* ── ORGANIZER ── */}
        {screen === "organizer" && (
          <div className="flex-1 flex flex-col px-5 py-6 gap-6">
            <button onClick={backFromOrganizer} className="self-start flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold active:scale-95" style={{ background: "#1C1F30" }}>
              <span style={{fontSize:13}}>{dir === "rtl" ? "▶" : "◀"}</span> {t.back}
            </button>
            <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="text-center">
              <span style={{fontSize:40}}>🎮</span>
              <div className="text-3xl font-black mt-2" style={{ color: "#E8A33D" }}>{t.organizerTitle}</div>
              <div className="text-xs opacity-50 mt-2 leading-relaxed max-w-xs mx-auto">{t.organizerSubtitle}</div>
            </div>
            <div className="rounded-2xl p-4 card-shadow flex flex-col gap-3" style={{ background: "#181B2A" }}>
              <div className="text-xs font-bold opacity-50">{t.organizerPhotosLabel}</div>
              <div className="flex gap-2 flex-wrap">
                {organizer.photos.map((p) => (
                  <div key={p.id} className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <img src={p.src} className="w-full h-full object-cover" />
                    <button onClick={() => removeOrganizerPhoto(p.id)} className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.65)" }}>
                      <span style={{fontSize:13}}>✕</span>
                    </button>
                  </div>
                ))}
                {organizer.photos.length < MAX_ORG_PHOTOS && (
                  <label className="w-16 h-16 rounded-lg flex items-center justify-center active:scale-95 cursor-pointer" style={{ background: "#12141F" }}>
                    <span style={{fontSize:22}}>📷</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleOrganizerPhoto} />
                  </label>
                )}
              </div>
            </div>
            <button onClick={finishOrganizer} className="w-full py-4 rounded-2xl font-black text-lg active:scale-95" style={{ background: "#E8A33D", color: "#12141F" }}>{t.organizerDone}</button>
            </div>
          </div>
        )}

        {/* ── PASS ── */}
        {screen === "pass" && (
          <div className="flex-1 flex flex-col px-6 py-6 gap-6">
            <button onClick={backFromPass} className="self-start flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold active:scale-95" style={{ background: "#1C1F30" }}>
              <span style={{fontSize:13}}>{dir === "rtl" ? "▶" : "◀"}</span> {t.back}
            </button>
            <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
              <span style={{fontSize:40}}>🔄</span>
              <div className="text-sm opacity-60">{t.passTo}</div>
              <div className="text-2xl font-black" style={{ color: TEAM_META[currentTeam].color }}>{t.playerFrom(teamNames[currentTeam])}</div>
              <div className="text-xs opacity-40 max-w-xs leading-relaxed">{t.privacyTurn}</div>
              <button onClick={beginCurrentEntry} className="mt-2 px-8 py-3 rounded-xl font-bold active:scale-95" style={{ background: TEAM_META[currentTeam].bg, color: TEAM_META[currentTeam].color }}>{t.readyFill}</button>
            </div>
          </div>
        )}

        {/* ── COLLECTING ── */}
        {screen === "collecting" && draft && (
          <div className="flex-1 flex flex-col px-5 py-6 gap-4">
            <button onClick={backFromCollecting} className="self-start flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold active:scale-95" style={{ background: "#1C1F30" }}>
              <span style={{fontSize:13}}>{dir === "rtl" ? "▶" : "◀"}</span> {t.back}
            </button>
            <div className="text-center text-xs font-bold opacity-50 mb-1" style={{ color: TEAM_META[currentTeam].color }}>
              {teamNames[currentTeam]} · {queue[qIdx].order + 1} / {counts[currentTeam]}
            </div>
            <input placeholder={t.yourName} value={draft.name} onChange={(e) => updateDraft("name", e.target.value)}
              className="rounded-xl px-4 py-3 font-bold text-lg placeholder-white/25" style={{ background: "#181B2A" }} />
            <div className="grid grid-cols-2 gap-2">
              {QUESTIONS.map((q, i) => (
                <input key={q.key} placeholder={qLabels[lang][i]} value={draft[q.key]} onChange={(e) => updateDraft(q.key, e.target.value)}
                  className="rounded-xl px-3 py-2.5 text-sm placeholder-white/25" style={{ background: "#181B2A" }} />
              ))}
            </div>
            {OPEN_QUESTIONS.map((q, i) => (
              <input key={q.key} placeholder={openQLabels[lang][i]} value={draft[q.key]} onChange={(e) => updateDraft(q.key, e.target.value)}
                className="rounded-xl px-3 py-2.5 text-sm placeholder-white/25" style={{ background: "#181B2A" }} />
            ))}
            <button disabled={!draft.name.trim()} onClick={saveDraftAndAdvance}
              className="w-full py-4 rounded-2xl font-black text-lg mt-2 active:scale-95 disabled:opacity-30" style={{ background: "#E8A33D", color: "#12141F" }}>
              {qIdx + 1 >= queue.length ? t.doneStart : t.donePass}
            </button>
          </div>
        )}

        {/* ── ROUNDS MENU ── */}
        {screen === "rounds" && (
          <div className="flex-1 flex flex-col px-5 py-8 gap-4">
            <div className="text-center mb-2">
              <div className="text-2xl font-black" style={{ color: "#E8A33D" }}>{t.chooseRound}</div>
              <div className="text-xs opacity-50 mt-1">{t.passAnyone}</div>
            </div>
            <button onClick={startRound1} className="rounded-2xl p-5 text-start card-shadow active:scale-95" style={{ background: "#181B2A" }}>
              <div className="text-xs font-bold opacity-50 mb-1">{t.round1Title}</div>
              <div className="text-xl font-black" style={{ color: "#E8A33D" }}>{t.round1Name}</div>
              <div className="text-xs opacity-60 mt-1">{t.round1Desc}</div>
            </button>
            {triviaOk ? (
              <button onClick={startRound2} className="rounded-2xl p-5 text-start card-shadow active:scale-95" style={{ background: "#181B2A" }}>
                <div className="text-xs font-bold opacity-50 mb-1">{t.round2Title}</div>
                <div className="text-xl font-black" style={{ color: "#3DB8A8" }}>{t.round2Name}</div>
                <div className="text-xs opacity-60 mt-1">{t.round2Desc}</div>
              </button>
            ) : (
              <div className="rounded-2xl p-5 card-shadow" style={{ background: "#181B2A", opacity: 0.35 }}>
                <div className="text-xs font-bold opacity-50 mb-1">{t.round2Title}</div>
                <div className="text-xl font-black" style={{ color: "#3DB8A8" }}>{t.round2Name}</div>
                <div className="text-xs opacity-60 mt-1">{t.triviaLocked}</div>
              </div>
            )}
            <button onClick={startRound3} className="rounded-2xl p-5 text-start card-shadow active:scale-95" style={{ background: "#181B2A" }}>
              <div className="text-xs font-bold opacity-50 mb-1">{t.round3Title}</div>
              <div className="text-xl font-black" style={{ color: "#E85D5D" }}>{t.round3Name}</div>
              <div className="text-xs opacity-60 mt-1">{t.round3Desc}</div>
            </button>
            <button onClick={startRound4} className="rounded-2xl p-5 text-start card-shadow active:scale-95" style={{ background: "#181B2A" }}>
              <div className="text-xs font-bold opacity-50 mb-1">{t.round4Title}</div>
              <div className="text-xl font-black" style={{ color: "#9B8CE8" }}>{t.round4Name}</div>
              <div className="text-xs opacity-60 mt-1">{t.round4Desc}</div>
            </button>
            <button onClick={() => setScreen("final")} className="mt-2 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2" style={{ background: "#1C1F30" }}>
              <span style={{fontSize:18}}>🏆</span> {t.endGame}
            </button>
            <button onClick={resetGame} className="py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2" style={{ background: "#1C1F30" }}>
              <span style={{fontSize:18}}>↺</span> {t.newGame}
            </button>
          </div>
        )}

        {/* ── ROUND 1 & 2 ── */}
        {(screen === "round1" || screen === "round2") && (
          <div className="flex-1 flex flex-col px-5 py-6 gap-4">
            <div className="text-center text-xs font-bold opacity-50">
              {screen === "round1" ? t.guessingLabel : t.triviaLabel} · {deck.length ? deckIdx + 1 : 0} / {deck.length}
            </div>
            {timerBar}
            {deck.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center opacity-60 text-sm px-6">{t.noQuestions}</div>
            ) : (
              <>
                <div className="rounded-2xl px-4 py-3 text-center font-black text-sm" style={{ background: TEAM_META[deck[deckIdx].askedTeam].bg, color: TEAM_META[deck[deckIdx].askedTeam].color }}>
                  {t.questionFor(teamNames[deck[deckIdx].askedTeam])}
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full rounded-3xl p-8 text-center card-shadow flip-in" style={{ background: "#181B2A", minHeight: 220 }} key={deckIdx}>
                    {screen === "round1" ? (
                      <>
                        <div className="text-sm font-bold opacity-50 mb-3">{t.personLabel}</div>
                        <div className="text-3xl font-black mb-5">{deck[deckIdx].player.name}</div>
                        <div className="text-sm font-bold opacity-50 mb-2">{t.attrNeeded}</div>
                        <div className="text-xl font-black" style={{ color: "#E8A33D" }}>{deck[deckIdx].attrLabel}</div>
                        {revealed ? (
                          <div className="mt-5 text-2xl font-black pulse" style={{ color: "#3DB8A8" }}>{deck[deckIdx].value}</div>
                        ) : (
                          <button onClick={() => setRevealed(true)} className="mt-6 mx-auto flex items-center gap-2 px-5 py-3 rounded-xl font-bold active:scale-95" style={{ background: "#E8A33D", color: "#12141F" }}>
                            <span style={{fontSize:18}}>👁️</span> {t.revealAnswer}
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-bold opacity-50 mb-3">{deck[deckIdx].attrLabel}</div>
                        <div className="text-2xl font-black leading-relaxed mb-2">{deck[deckIdx].value}</div>
                        <div className="text-lg opacity-70 mb-4">{t.whoseAnswer}</div>
                        {!revealed ? (
                          <button onClick={() => setRevealed(true)} className="mt-4 mx-auto flex items-center gap-2 px-5 py-3 rounded-xl font-bold active:scale-95" style={{ background: "#3DB8A8", color: "#12141F" }}>
                            <span style={{fontSize:18}}>👁️</span> {t.revealName}
                          </button>
                        ) : (
                          <div className="mt-5 text-3xl font-black pulse" style={{ color: "#3DB8A8" }}>{deck[deckIdx].player.name}</div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { award({ [deck[deckIdx].askedTeam]: 1 }); nextCard(); }}
                    className="py-3 rounded-xl font-bold active:scale-95"
                    style={{ background: TEAM_META[deck[deckIdx].askedTeam].bg, color: TEAM_META[deck[deckIdx].askedTeam].color }}>
                    {teamNames[deck[deckIdx].askedTeam]} {t.correct}
                  </button>
                  <button onClick={() => nextCard()} className="py-3 rounded-xl font-bold active:scale-95" style={{ background: "#1C1F30" }}>
                    {t.skipNoPoints}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── ROUND 4 ── */}
        {screen === "round4" && (
          <div className="flex-1 flex flex-col px-5 py-6 gap-4">
            <div className="text-center text-xs font-bold opacity-50">{t.photoGuessLabel} · {deck.length ? deckIdx + 1 : 0} / {deck.length}</div>
            {timerBar}
            {deck.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center opacity-60 text-sm px-6">{t.noPhotos}</div>
            ) : (
              <>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-full rounded-3xl overflow-hidden card-shadow flip-in" style={{ background: "#181B2A" }} key={deckIdx}>
                    <img src={deck[deckIdx].src} className="w-full h-64 object-cover" />
                    <div className="p-4 text-center">
                      <div className="text-xl font-black" style={{ color: "#9B8CE8" }}>{t.photoQuestion}</div>
                      <div className="text-xs opacity-40 mt-1">{t.fastestWins}</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { award({ 1: 1 }); nextCard(); }} className="py-3 rounded-xl font-bold active:scale-95" style={{ background: TEAM_META[1].bg, color: TEAM_META[1].color }}>{teamNames[1]} ✓</button>
                  <button onClick={() => { award({ 2: 1 }); nextCard(); }} className="py-3 rounded-xl font-bold active:scale-95" style={{ background: TEAM_META[2].bg, color: TEAM_META[2].color }}>{teamNames[2]} ✓</button>
                </div>
                <button onClick={() => nextCard()} className="py-2.5 rounded-xl font-bold text-sm active:scale-95" style={{ background: "#1C1F30" }}>{t.skipNoPoints}</button>
              </>
            )}
          </div>
        )}

        {/* ── ROUND 3 ── */}
        {screen === "round3" && (
          <div className="flex-1 flex flex-col px-5 py-6 gap-4">
            <div className="flex flex-col items-center gap-1">
              <WhosWhoLogo size={36} />
              <div className="text-xs font-bold opacity-50">{t.faceoffLabel} · {faceoffOrder.length ? faceoffPairIdx + 1 : 0} / {faceoffOrder.length}</div>
            </div>
            {timerBar}
            {faceoffOrder.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center opacity-60 text-sm px-6">{t.needOneEach}</div>
            ) : (() => {
              const storyteller = faceoffOrder[faceoffPairIdx];
              const opp = storyteller.team === 1 ? 2 : 1;
              function advanceFaceoff() {
                const ni = faceoffPairIdx + 1;
                setFaceoffLiveQIdx((idx) => randomFaceoffQ(idx));
                setFaceoffShufflesLeft(3);
                if (ni >= faceoffOrder.length) setScreen("rounds");
                else setFaceoffPairIdx(ni);
              }
              return (
                <>
                  <div className="rounded-2xl p-4 text-center card-shadow" style={{ background: TEAM_META[storyteller.team].bg }}>
                    <div className="font-black text-2xl" style={{ color: TEAM_META[storyteller.team].color }}>{storyteller.name}</div>
                    <div className="text-xs opacity-60 mt-0.5">{teamNames[storyteller.team]}</div>
                  </div>

                  <div className="rounded-2xl px-4 py-3 text-center font-black text-sm" style={{ background: TEAM_META[opp].bg, color: TEAM_META[opp].color }}>
                    {t.faceoffChallenge(teamNames[opp])}
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="w-full rounded-3xl p-6 text-center card-shadow flip-in" style={{ background: "#181B2A" }} key={faceoffLiveQIdx}>
                      <div className="text-xs font-bold opacity-40 mb-3">{t.faceoffLabel}</div>
                      <div className="text-xl font-black leading-relaxed" style={{ color: "#F2EDE3" }}>
                        {FACEOFF_QUESTIONS[faceoffLiveQIdx][lang]}
                      </div>
                    </div>
                    {faceoffShufflesLeft > 0 && (
                      <button onClick={nextFaceoffQ} className="px-6 py-2.5 rounded-xl font-bold text-sm active:scale-95 flex items-center gap-2" style={{ background: "#1C1F30" }}>
                        <span style={{fontSize:16}}>🔀</span> {t.newQuestion}
                        <span className="rounded-full w-5 h-5 flex items-center justify-center text-xs font-black" style={{ background: "#E8A33D", color: "#12141F" }}>{faceoffShufflesLeft}</span>
                      </button>
                    )}
                  </div>

                  <div className="text-center text-xs font-bold opacity-40">{t.faceoffWinnerPoints}</div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => { award({ [storyteller.team]: 2 }); advanceFaceoff(); }}
                      className="py-3 rounded-xl font-bold active:scale-95 text-sm"
                      style={{ background: TEAM_META[storyteller.team].bg, color: TEAM_META[storyteller.team].color }}>
                      {t.win(teamNames[storyteller.team])}
                    </button>
                    <button onClick={() => { award({ [opp]: 2 }); advanceFaceoff(); }}
                      className="py-3 rounded-xl font-bold active:scale-95 text-sm"
                      style={{ background: TEAM_META[opp].bg, color: TEAM_META[opp].color }}>
                      {t.win(teamNames[opp])}
                    </button>
                  </div>
                  {faceoffPairIdx + 1 < faceoffOrder.length ? (
                    <button onClick={() => {
                      setFaceoffShufflesLeft(3);
                      setFaceoffLiveQIdx((idx) => randomFaceoffQ(idx));
                      setFaceoffPairIdx((i) => i + 1);
                    }} className="py-2.5 rounded-xl font-bold text-sm active:scale-95" style={{ background: "#1C1F30" }}>{t.skipNoPoints}</button>
                  ) : (
                    <button onClick={() => setScreen("rounds")} className="py-2.5 rounded-xl font-bold text-sm active:scale-95" style={{ background: "#1C1F30" }}>{t.endRound}</button>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* ── FINAL ── */}
        {screen === "final" && (
          <div className="flex-1 flex flex-col px-6 py-6 gap-6">
            <button onClick={() => setScreen("rounds")} className="self-start flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold active:scale-95" style={{ background: "#1C1F30" }}>
              <span style={{fontSize:13}}>{dir === "rtl" ? "▶" : "◀"}</span> {t.back}
            </button>
            <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
              <span style={{fontSize:48}}>🏆</span>
              <div className="text-3xl font-black">
                {scores[1] === scores[2] ? t.tie : scores[1] > scores[2] ? t.wins(teamNames[1]) : t.wins(teamNames[2])}
              </div>
              <div className="flex gap-6 text-xl font-bold">
                <div style={{ color: TEAM_META[1].color }}>{teamNames[1]}: {scores[1]}</div>
                <div style={{ color: TEAM_META[2].color }}>{teamNames[2]}: {scores[2]}</div>
              </div>
              <button onClick={resetGame} className="mt-4 flex items-center gap-2 px-6 py-3 rounded-xl font-bold active:scale-95" style={{ background: "#E8A33D", color: "#12141F" }}>
                <span style={{fontSize:18}}>↺</span> {t.newGame}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<WhosWho />);
