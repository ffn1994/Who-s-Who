import { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import QRCode from "qrcode";

const supabase = createClient(
  "https://inqtttbxzjqvsjwnlmkf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlucXR0dGJ4empxdnNqd25sbWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NDAxNDUsImV4cCI6MjA5NzAxNjE0NX0.XcfVa0jYVyEMzomXBRKxOodKdjIQK0Y7vwmmO7WTXR4"
);

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
    qrRegister: "تسجيل بـ QR 📱",
    qrWaiting: "انتظار اللاعبين",
    qrScanInstruct: "كل لاعب يسكن الـ QR بتلفونه ويسجل بياناته بخصوصية",
    qrSlotEmpty: "فارغ",
    qrSlotTaken: "✅ سجّل",
    qrAllDone: "جميع اللاعبين سجلوا!",
    startGameNow: "ابدأ اللعبة",
    qrJoinTitle: "سجّل بياناتك",
    qrJoinPrivate: "بياناتك خاصة — ما يشوفها أحد غيرك",
    qrPickTeam: "من أي فريق أنت؟",
    qrPickSlot: "اختر رقمك في الفريق",
    qrSent: "تم الإرسال! ✅",
    qrSentDesc: "بياناتك وصلت للمنظم — استنى اللعبة تبدأ",
    qrSlotLoading: "جاري التحميل...",
    qrSessionNotFound: "رابط التسجيل غير صالح",
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
    qrRegister: "Register via QR 📱",
    qrWaiting: "Waiting for Players",
    qrScanInstruct: "Each player scans the QR with their phone and fills in their info privately",
    qrSlotEmpty: "Empty",
    qrSlotTaken: "✅ Registered",
    qrAllDone: "All players registered!",
    startGameNow: "Start the Game",
    qrJoinTitle: "Register Your Info",
    qrJoinPrivate: "Your info is private — no one else can see it",
    qrPickTeam: "Which team are you on?",
    qrPickSlot: "Pick your number in the team",
    qrSent: "Sent! ✅",
    qrSentDesc: "Your info reached the organizer — wait for the game to start",
    qrSlotLoading: "Loading...",
    qrSessionNotFound: "Invalid registration link",
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

// Shuffle avoiding back-to-back same person or same attribute type
function smartShuffle(items) {
  if (items.length <= 1) return [...items];
  const arr = shuffle(items);
  for (let i = 1; i < arr.length; i++) {
    const p = arr[i - 1];
    if (arr[i].player.id === p.player.id || arr[i].attrKey === p.attrKey) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j].player.id !== p.player.id && arr[j].attrKey !== p.attrKey) {
          [arr[i], arr[j]] = [arr[j], arr[i]]; break;
        }
      }
    }
  }
  return arr;
}

// Pre-build faceoff question sequence: 5 per team, no repeats, specials once each per team
const SPECIAL_Q_INDICES = [7, 8];
function buildFaceoffSequence() {
  const regular = FACEOFF_QUESTIONS.map((_, i) => i).filter(i => !SPECIAL_Q_INDICES.includes(i));
  const reg = shuffle(regular);
  const t1Qs = shuffle([...SPECIAL_Q_INDICES, ...reg.slice(0, 3)]);
  const t2Qs = shuffle([...SPECIAL_Q_INDICES, ...reg.slice(3, 6)]);
  const seq = [];
  for (let i = 0; i < 5; i++) { seq.push(t1Qs[i]); seq.push(t2Qs[i]); }
  return seq; // 10 items interleaved: t1turn, t2turn, ...
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

  const [isTVManual, setIsTVManual] = useState(false);
  const [isTVAuto, setIsTVAuto] = useState(false);
  const isTV = isTVManual || isTVAuto;
  useEffect(() => {
    function check() { setIsTVAuto(window.innerWidth >= 1024 && window.innerWidth > window.innerHeight); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  useEffect(() => {
    function onFSChange() {
      if (!document.fullscreenElement) setIsTVManual(false);
    }
    document.addEventListener("fullscreenchange", onFSChange);
    document.addEventListener("webkitfullscreenchange", onFSChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFSChange);
      document.removeEventListener("webkitfullscreenchange", onFSChange);
    };
  }, []);
  function toggleTV() {
    const next = !isTVManual;
    setIsTVManual(next);
    if (next) {
      (document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen || (() => {})).call(document.documentElement);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || (() => {})).call(document);
    }
  }

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
  const [faceoffQSequence, setFaceoffQSequence] = useState([]);
  const [faceoffUsedQSet, setFaceoffUsedQSet] = useState([]);

  const [r1UsedCombos, setR1UsedCombos] = useState([]);

  const [organizer, setOrganizer] = useState({ photos: [] });
  const [timerElapsed, setTimerElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // ── QR Registration state ──────────────────────────────────────────
  const joinSessionIdParam = useRef(new URLSearchParams(window.location.search).get("join")).current;
  const [joinSession, setJoinSession] = useState(null);
  const [joinSlots, setJoinSlots] = useState([]);
  const [joinScreen, setJoinScreen] = useState("pick-team");
  const [joinSelectedTeam, setJoinSelectedTeam] = useState(null);
  const [joinSelectedSlot, setJoinSelectedSlot] = useState(null);
  const [joinForm, setJoinForm] = useState({ name: "", job: "", color: "", food: "", style: "", wish: "", funny: "" });
  const [joinSubmitting, setJoinSubmitting] = useState(false);
  const [qrSessionId, setQrSessionId] = useState(null);
  const [qrImgUrl, setQrImgUrl] = useState(null);
  const [qrLivePlayers, setQrLivePlayers] = useState([]);
  const [qrCreating, setQrCreating] = useState(false);
  // Timer: count UP every second when running
  useEffect(() => {
    if (!timerRunning) return;
    const id = setTimeout(() => setTimerElapsed((s) => s + 1), 1000);
    return () => clearTimeout(id);
  }, [timerRunning, timerElapsed]);

  // Auto-reset timer when entering a round or advancing a card
  useEffect(() => {
    if (["round1", "round2", "round3", "round4"].includes(screen)) {
      setTimerElapsed(0);
      setTimerRunning(true);
    } else {
      setTimerRunning(false);
    }
  }, [screen, deckIdx, faceoffPairIdx]);

  function resetTimer() { setTimerElapsed(0); setTimerRunning(true); }

  // ── Join mode: load session + real-time ─────────────────────────
  useEffect(() => {
    if (!joinSessionIdParam) return;
    supabase.from("ww_sessions").select("*").eq("id", joinSessionIdParam).single()
      .then(({ data }) => { if (data) setJoinSession(data); });
    supabase.from("ww_players").select("*").eq("session_id", joinSessionIdParam).order("team").order("player_order")
      .then(({ data }) => { setJoinSlots(data || []); });
    const sub = supabase.channel("join-" + joinSessionIdParam)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "ww_players", filter: `session_id=eq.${joinSessionIdParam}` },
        (payload) => setJoinSlots(prev => prev.map(p => p.id === payload.new.id ? payload.new : p)))
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, [joinSessionIdParam]);

  // ── Organizer real-time: watch QR session players ────────────────
  useEffect(() => {
    if (!qrSessionId) return;
    const sub = supabase.channel("qr-org-" + qrSessionId)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "ww_players", filter: `session_id=eq.${qrSessionId}` },
        (payload) => setQrLivePlayers(prev => prev.map(p => p.id === payload.new.id ? payload.new : p)))
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, [qrSessionId]);
  // ── BroadcastChannel sync (DeX / multi-window) ───────────────────
  const myBCId = useRef(uid());
  const bcRef = useRef(null);
  const stateRef = useRef({});
  const bcReceiving = useRef(false);

  stateRef.current = { screen, teamNames, qLabels, openQLabels, counts, queue, qIdx, players, draft, scores, deck, deckIdx, revealed, faceoffOrder, faceoffPairIdx, faceoffLiveQIdx, faceoffShufflesLeft, faceoffQSequence, faceoffUsedQSet, r1UsedCombos, organizer, timerElapsed, timerRunning, lang };

  useEffect(() => {
    if (!("BroadcastChannel" in window)) return;
    const bc = new BroadcastChannel("who-s-who-v1");
    bcRef.current = bc;
    bc.onmessage = ({ data }) => {
      if (!data || data.from === myBCId.current) return;
      if (data.type === "sync") {
        bcReceiving.current = true;
        const s = data.state;
        setScreen(s.screen); setTeamNames(s.teamNames); setQLabels(s.qLabels); setOpenQLabels(s.openQLabels);
        setCounts(s.counts); setQueue(s.queue); setQIdx(s.qIdx); setPlayers(s.players); setDraft(s.draft);
        setScores(s.scores); setDeck(s.deck); setDeckIdx(s.deckIdx); setRevealed(s.revealed);
        setFaceoffOrder(s.faceoffOrder); setFaceoffPairIdx(s.faceoffPairIdx); setFaceoffLiveQIdx(s.faceoffLiveQIdx);
        setFaceoffShufflesLeft(s.faceoffShufflesLeft); setFaceoffQSequence(s.faceoffQSequence || []);
        setFaceoffUsedQSet(s.faceoffUsedQSet || []); setR1UsedCombos(s.r1UsedCombos || []);
        setOrganizer(s.organizer); setTimerElapsed(s.timerElapsed ?? 0); setTimerRunning(s.timerRunning);
        setLang(s.lang);
        setTimeout(() => { bcReceiving.current = false; }, 50);
      } else if (data.type === "request") {
        bc.postMessage({ from: myBCId.current, type: "sync", state: stateRef.current });
      }
    };
    bc.postMessage({ from: myBCId.current, type: "request" });
    return () => bc.close();
  }, []);

  useEffect(() => {
    if (bcReceiving.current) return;
    bcRef.current?.postMessage({ from: myBCId.current, type: "sync", state: stateRef.current });
  }, [screen, teamNames, qLabels, openQLabels, counts, queue, qIdx, players, draft, scores, deck, deckIdx, revealed, faceoffOrder, faceoffPairIdx, faceoffLiveQIdx, faceoffShufflesLeft, faceoffQSequence, faceoffUsedQSet, r1UsedCombos, organizer, timerElapsed, timerRunning, lang]);

  // ── QR Registration functions ────────────────────────────────────
  async function createQRSession() {
    setQrCreating(true);
    const sessionId = uid() + uid();
    await supabase.from("ww_sessions").insert({
      id: sessionId, team1_name: teamNames[1], team2_name: teamNames[2],
      team1_count: counts[1], team2_count: counts[2],
      q_labels: qLabels, open_q_labels: openQLabels, lang, status: "open"
    });
    const slots = [];
    for (let i = 0; i < counts[1]; i++) slots.push({ id: uid(), session_id: sessionId, team: 1, player_order: i });
    for (let i = 0; i < counts[2]; i++) slots.push({ id: uid(), session_id: sessionId, team: 2, player_order: i });
    await supabase.from("ww_players").insert(slots);
    const joinUrl = `${window.location.origin}${window.location.pathname}?join=${sessionId}`;
    const qrDataUrl = await QRCode.toDataURL(joinUrl, { width: 380, margin: 2, color: { dark: "#12141F", light: "#F2EDE3" } });
    setQrSessionId(sessionId);
    setQrImgUrl(qrDataUrl);
    setQrLivePlayers(slots);
    setQrCreating(false);
    setScreen("qr-wait");
  }

  function startGameFromQR() {
    const gamePlayers = qrLivePlayers
      .filter(p => p.name?.trim())
      .map(p => ({ id: p.id, team: p.team, name: p.name, job: p.job || "", color: p.color || "", food: p.food || "", style: p.style || "", wish: p.wish || "", funny: p.funny || "" }));
    setPlayers(gamePlayers);
    setScreen("rounds");
  }

  async function submitJoinForm() {
    if (!joinSelectedSlot || !joinForm.name.trim()) return;
    setJoinSubmitting(true);
    await supabase.from("ww_players").update({
      name: joinForm.name, job: joinForm.job, color: joinForm.color,
      food: joinForm.food, style: joinForm.style, wish: joinForm.wish,
      funny: joinForm.funny, submitted_at: new Date().toISOString()
    }).eq("id", joinSelectedSlot.id);
    setJoinSubmitting(false);
    setJoinScreen("done");
  }

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
  function buildDeck(excludeCombos = new Set()) {
    const byTeam = { 1: [], 2: [] };
    players.forEach((p) => {
      QUESTIONS.forEach((q, idx) => {
        const key = `${p.id}:${q.key}`;
        if (p[q.key]?.trim() && !excludeCombos.has(key)) {
          const askedTeam = p.team === 1 ? 2 : 1;
          byTeam[askedTeam].push({ player: p, attrKey: q.key, attrLabel: qLabels[lang][idx], value: p[q.key], askedTeam });
        }
      });
    });
    function limitItems(askedTeam) {
      const srcTeamSize = players.filter(p => p.team === (askedTeam === 1 ? 2 : 1)).length;
      const items = byTeam[askedTeam];
      if (srcTeamSize >= 3) {
        const target = Math.max(9, Math.min(15, Math.floor(items.length * 0.5)));
        return shuffle(items).slice(0, Math.min(target, items.length));
      }
      return [...items];
    }
    const t1 = smartShuffle(limitItems(1));
    const t2 = smartShuffle(limitItems(2));
    const result = [];
    let i = 0, j = 0;
    while (i < t1.length || j < t2.length) {
      if (i < t1.length) result.push(t1[i++]);
      if (j < t2.length) result.push(t2[j++]);
    }
    return result;
  }
  function countDeck(excludeCombos = new Set()) {
    const byTeam = { 1: 0, 2: 0 };
    players.forEach((p) => {
      QUESTIONS.forEach((q) => {
        const key = `${p.id}:${q.key}`;
        if (p[q.key]?.trim() && !excludeCombos.has(key)) byTeam[p.team === 1 ? 2 : 1]++;
      });
    });
    function limitCount(askedTeam, count) {
      const srcSize = players.filter(p => p.team === (askedTeam === 1 ? 2 : 1)).length;
      if (srcSize >= 3) return Math.min(count, Math.max(9, Math.min(15, Math.floor(count * 0.5))));
      return count;
    }
    return limitCount(1, byTeam[1]) + limitCount(2, byTeam[2]);
  }
  function buildPhotoDeck() { return shuffle(organizer.photos.map((ph) => ({ src: ph.src }))); }

  // ── Round starters ───────────────────────────────────────────────
  function startRound1() {
    const d = buildDeck();
    const combos = d.map(item => `${item.player.id}:${item.attrKey}`);
    setR1UsedCombos(combos);
    setDeck(d); setDeckIdx(0); setRevealed(false); setScreen("round1");
  }
  function startRound2() {
    setDeck(buildDeck(new Set(r1UsedCombos)));
    setDeckIdx(0); setRevealed(false); setScreen("round2");
  }
  function startRound4() { setDeck(buildPhotoDeck()); setDeckIdx(0); setScreen("round4"); }
  function startRound3() {
    const pick5 = (arr) => { const s = shuffle(arr); return [0,1,2,3,4].map((i) => s[i % s.length]); };
    const t1 = players.filter((p) => p.team === 1);
    const t2 = players.filter((p) => p.team === 2);
    if (!t1.length || !t2.length) { setFaceoffOrder([]); setFaceoffPairIdx(0); setFaceoffQSequence([]); setFaceoffUsedQSet([]); setScreen("round3"); return; }
    const p1 = pick5(t1), p2 = pick5(t2);
    const order = [];
    for (let i = 0; i < 5; i++) { order.push(p1[i]); order.push(p2[i]); }
    const seq = buildFaceoffSequence();
    setFaceoffOrder(order);
    setFaceoffQSequence(seq);
    setFaceoffPairIdx(0);
    setFaceoffLiveQIdx(seq[0]);
    setFaceoffUsedQSet([seq[0]]);
    setFaceoffShufflesLeft(3);
    setScreen("round3");
  }

  function nextFaceoffQ(currentUsed) {
    const usedSet = new Set(currentUsed);
    const candidates = FACEOFF_QUESTIONS.map((_, i) => i).filter(i => !usedSet.has(i));
    if (!candidates.length) return;
    const newQ = candidates[Math.floor(Math.random() * candidates.length)];
    setFaceoffLiveQIdx(newQ);
    setFaceoffUsedQSet(prev => [...new Set([...prev, newQ])]);
    setFaceoffShufflesLeft((n) => n - 1);
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
    setFaceoffOrder([]); setFaceoffPairIdx(0); setFaceoffQSequence([]); setFaceoffUsedQSet([]);
    setR1UsedCombos([]);
    setOrganizer({ photos: [] });
    setTimerRunning(false); setTimerElapsed(0);
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

  // ── JOIN MODE: player opened QR link on their phone ──────────────
  if (joinSessionIdParam) {
    const jt = joinSession ? (joinSession.lang === "en" ? STR.en : STR.ar) : STR.ar;
    const jdir = joinSession ? (joinSession.lang === "en" ? "ltr" : "rtl") : "rtl";
    const t1name = joinSession?.team1_name || STR.ar.defaultTeam1;
    const t2name = joinSession?.team2_name || STR.ar.defaultTeam2;
    const t1slots = joinSlots.filter(s => s.team === 1);
    const t2slots = joinSlots.filter(s => s.team === 2);

    if (!joinSession && joinSlots.length === 0) {
      return (
        <div dir={jdir} className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: "#12141F", color: "#F2EDE3", fontFamily: "'Tajawal', sans-serif" }}>
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');`}</style>
          <div className="pulse text-5xl">⏳</div>
          <div className="text-lg font-bold opacity-60">{jt.qrSlotLoading}</div>
        </div>
      );
    }

    if (joinScreen === "done") {
      return (
        <div dir={jdir} className="min-h-screen flex flex-col items-center justify-center gap-6 px-6" style={{ background: "#12141F", color: "#F2EDE3", fontFamily: "'Tajawal', sans-serif" }}>
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');`}</style>
          <div style={{ fontSize: 80 }}>✅</div>
          <div className="text-3xl font-black" style={{ color: "#3DB8A8" }}>{jt.qrSent}</div>
          <div className="text-base font-bold opacity-60 text-center">{joinForm.name}</div>
          <div className="text-sm opacity-45 text-center leading-relaxed">{jt.qrSentDesc}</div>
        </div>
      );
    }

    if (joinScreen === "form" && joinSelectedSlot) {
      const slotTeam = joinSelectedSlot.team;
      const tc = TEAM_META[slotTeam];
      const ql = joinSession?.q_labels?.[joinSession.lang] || defaultQLabels(joinSession?.lang || "ar");
      const oql = joinSession?.open_q_labels?.[joinSession.lang] || defaultOpenQLabels(joinSession?.lang || "ar");
      return (
        <div dir={jdir} className="min-h-screen flex flex-col px-5 py-8 gap-4" style={{ background: "#12141F", color: "#F2EDE3", fontFamily: "'Tajawal', sans-serif" }}>
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap'); * { box-sizing: border-box; } input { outline: none; } input:focus { box-shadow: 0 0 0 2px ${tc.color}; }`}</style>
          <button onClick={() => setJoinScreen("pick-slot")} className="self-start px-3 py-2 rounded-xl text-sm font-bold" style={{ background: "#1C1F30" }}>
            {jdir === "rtl" ? "▶" : "◀"} {jt.back}
          </button>
          <div className="text-center">
            <div className="text-2xl font-black" style={{ color: tc.color }}>{jt.qrJoinTitle}</div>
            <div className="text-xs opacity-45 mt-1">{jt.qrJoinPrivate}</div>
          </div>
          <input placeholder={jt.yourName} value={joinForm.name}
            onChange={e => setJoinForm(f => ({ ...f, name: e.target.value }))}
            className="rounded-xl px-4 py-3 font-bold text-lg placeholder-white/25"
            style={{ background: "#181B2A" }} />
          <div className="grid grid-cols-2 gap-2">
            {QUESTIONS.map((q, i) => (
              <input key={q.key} placeholder={ql[i] || q[joinSession?.lang || "ar"]}
                value={joinForm[q.key]}
                onChange={e => setJoinForm(f => ({ ...f, [q.key]: e.target.value }))}
                className="rounded-xl px-3 py-2.5 text-sm placeholder-white/25"
                style={{ background: "#181B2A" }} />
            ))}
          </div>
          {OPEN_QUESTIONS.map((q, i) => (
            <input key={q.key} placeholder={oql[i] || q[joinSession?.lang || "ar"]}
              value={joinForm[q.key]}
              onChange={e => setJoinForm(f => ({ ...f, [q.key]: e.target.value }))}
              className="rounded-xl px-3 py-2.5 text-sm placeholder-white/25"
              style={{ background: "#181B2A" }} />
          ))}
          <button disabled={!joinForm.name.trim() || joinSubmitting} onClick={submitJoinForm}
            className="w-full py-4 rounded-2xl font-black text-lg mt-2 disabled:opacity-30"
            style={{ background: tc.color, color: "#12141F" }}>
            {joinSubmitting ? "⏳" : jt.qrSent.replace(" ✅", "")}
          </button>
        </div>
      );
    }

    if (joinScreen === "pick-slot" && joinSelectedTeam) {
      const slots = joinSelectedTeam === 1 ? t1slots : t2slots;
      const tc = TEAM_META[joinSelectedTeam];
      const tname = joinSelectedTeam === 1 ? t1name : t2name;
      return (
        <div dir={jdir} className="min-h-screen flex flex-col px-5 py-8 gap-6" style={{ background: "#12141F", color: "#F2EDE3", fontFamily: "'Tajawal', sans-serif" }}>
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');`}</style>
          <button onClick={() => setJoinScreen("pick-team")} className="self-start px-3 py-2 rounded-xl text-sm font-bold" style={{ background: "#1C1F30" }}>
            {jdir === "rtl" ? "▶" : "◀"} {jt.back}
          </button>
          <div className="text-center">
            <div className="text-xl font-black" style={{ color: tc.color }}>{tname}</div>
            <div className="text-sm opacity-55 mt-1">{jt.qrPickSlot}</div>
          </div>
          <div className="flex flex-col gap-3">
            {slots.map((slot, i) => {
              const taken = slot.submitted_at || slot.name?.trim();
              return (
                <button key={slot.id} disabled={!!taken}
                  onClick={() => { setJoinSelectedSlot(slot); setJoinScreen("form"); }}
                  className="w-full py-4 rounded-2xl font-bold text-lg disabled:opacity-40"
                  style={{ background: taken ? "#1C1F30" : tc.bg, color: taken ? "#F2EDE3" : tc.color, border: `2px solid ${taken ? "transparent" : tc.color}` }}>
                  <span className="font-black">#{i + 1}</span>
                  {taken ? ` — ${jt.qrSlotTaken} ${slot.name ? `(${slot.name})` : ""}` : ` — ${jt.qrSlotEmpty}`}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // Default: pick-team screen
    return (
      <div dir={jdir} className="min-h-screen flex flex-col items-center justify-center px-6 gap-8" style={{ background: "#12141F", color: "#F2EDE3", fontFamily: "'Tajawal', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');`}</style>
        <WhosWhoLogo size={56} />
        <div className="text-center">
          <div className="text-2xl font-black">{jt.qrPickTeam}</div>
        </div>
        <div className="w-full flex flex-col gap-4">
          {[1, 2].map(team => {
            const tname = team === 1 ? t1name : t2name;
            const slots = team === 1 ? t1slots : t2slots;
            const filled = slots.filter(s => s.submitted_at || s.name?.trim()).length;
            const tc = TEAM_META[team];
            return (
              <button key={team} onClick={() => { setJoinSelectedTeam(team); setJoinScreen("pick-slot"); }}
                className="w-full py-5 rounded-2xl font-black text-xl"
                style={{ background: tc.bg, color: tc.color, border: `2px solid ${tc.color}` }}>
                {tname}
                <div className="text-sm font-bold mt-1" style={{ opacity: 0.7 }}>
                  {filled}/{slots.length} {jt.qrSlotTaken.replace("✅ ", "")}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const currentTeam = (screen === "pass" || screen === "collecting") ? queue[qIdx]?.team : null;
  const triviaOk = players.filter((p) => p.team === 1).length >= 3 && players.filter((p) => p.team === 2).length >= 3;

  const timerColor = timerElapsed >= 60 ? "#E85D5D" : timerElapsed >= 30 ? "#E8A33D" : "#3DB8A8";
  const timerBar = (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#1C1F30" }}>
        <div className="h-full rounded-full" style={{
          width: `${Math.min(100, (timerElapsed / 90) * 100)}%`,
          background: timerColor,
          transition: "width 0.95s linear, background 0.3s"
        }} />
      </div>
      <span className="font-black text-sm w-8 text-center" style={{ color: timerColor }}>{timerElapsed}s</span>
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
        .tv-screen { display:flex; flex-direction:column; width:100vw; height:100vh; overflow:hidden; }
        .tv-body { flex:1; display:flex; overflow:hidden; }
        .tv-card { background:#181B2A; border-radius:20px; box-shadow:0 8px 30px rgba(0,0,0,0.35); }
      `}</style>

      <div style={{ position: "fixed", top: 12, left: 12, zIndex: 50, display: "flex", flexDirection: "row", gap: 8 }}>
        <button onClick={toggleTV} className="active:scale-95"
          style={{ background: isTVManual ? "#E8A33D" : "#1C1F30", color: isTVManual ? "#12141F" : "#F2EDE3", fontWeight: 900, fontSize: 16, padding: "6px 12px", borderRadius: 999, boxShadow: "0 4px 14px rgba(0,0,0,0.4)" }}
          title="TV Mode">
          📺
        </button>
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
          style={{ background: "#1C1F30", color: "#E8A33D", fontWeight: 900, fontSize: 12, padding: "6px 12px", borderRadius: 999, boxShadow: "0 4px 14px rgba(0,0,0,0.4)" }}
        >
          {lang === "ar" ? "EN" : "AR"}
        </button>
      </div>

      <div className={isTV ? "" : "max-w-md mx-auto min-h-screen flex flex-col"}>

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
        {screen === "counts" && !isTV && (
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
              <div className="flex flex-col gap-3">
                <button onClick={startRegistration} className="w-full py-4 rounded-2xl font-black text-lg active:scale-95" style={{ background: "#E8A33D", color: "#12141F" }}>{t.startRegistration}</button>
                <button onClick={createQRSession} disabled={qrCreating} className="w-full py-3.5 rounded-2xl font-black text-base active:scale-95 disabled:opacity-50" style={{ background: "#181B2A", color: "#3DB8A8", border: "2px solid #3DB8A8" }}>
                  {qrCreating ? "⏳" : t.qrRegister}
                </button>
              </div>
            )}
            <div className="text-center text-xs opacity-45 leading-relaxed">{t.privacyNote}</div>
          </div>
        )}

        {/* ── COUNTS TV ── */}
        {screen === "counts" && isTV && (
          <div className="tv-screen" style={{ padding: "28px 56px", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
              <WhosWhoLogo size={48} />
              <div style={{ opacity: 0.45, fontSize: 22 }}>{t.subtitle}</div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "row", gap: 32, minHeight: 0 }}>
              {[1, 2].map((team) => (
                <div key={team} className="tv-card" style={{ flex: 1, padding: "44px 56px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 48, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <span style={{fontSize:36}}>👥</span>
                    <input value={teamNames[team]} onChange={(e) => setTeamNames((tn) => ({ ...tn, [team]: e.target.value }))}
                      style={{ background: "transparent", fontWeight: 900, fontSize: 60, flex: 1, borderBottom: `3px solid ${TEAM_META[team].color}`, color: TEAM_META[team].color, paddingBottom: 6, minWidth: 0 }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 28, opacity: 0.7 }}>{t.playersCount}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                      <button onClick={() => setCounts((c) => ({ ...c, [team]: Math.max(1, c[team] - 1) }))} style={{ width: 72, height: 72, borderRadius: "50%", background: "#12141F", fontSize: 36, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                      <span style={{ fontSize: 96, fontWeight: 900, width: 96, textAlign: "center", lineHeight: 1, color: TEAM_META[team].color }}>{counts[team]}</span>
                      <button onClick={() => setCounts((c) => ({ ...c, [team]: Math.min(12, c[team] + 1) }))} style={{ width: 72, height: 72, borderRadius: "50%", background: "#12141F", fontSize: 36, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="tv-card" style={{ padding: "24px 40px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 20, fontWeight: 700, opacity: 0.45 }}>{t.customizeQuestions}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {QUESTIONS.map((q, i) => (
                  <input key={q.key} value={qLabels[lang][i]} onChange={(e) => { const n=[...qLabels[lang]]; n[i]=e.target.value; setQLabels((p)=>({...p,[lang]:n})); }}
                    style={{ background: "#12141F", borderRadius: 12, padding: "14px 18px", fontSize: 22 }} />
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {OPEN_QUESTIONS.map((q, i) => (
                  <input key={q.key} value={openQLabels[lang][i]} onChange={(e) => { const n=[...openQLabels[lang]]; n[i]=e.target.value; setOpenQLabels((p)=>({...p,[lang]:n})); }}
                    style={{ background: "#12141F", borderRadius: 12, padding: "14px 18px", fontSize: 22 }} />
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              {players.length > 0 ? (
                <>
                  <button onClick={continueRegistration} style={{ flex: 1, padding: "22px 0", borderRadius: 16, fontWeight: 900, fontSize: 28, background: "#E8A33D", color: "#12141F" }}>{t.continueReg(players.length, queue.length)}</button>
                  <button onClick={resetRegistration} style={{ flex: 1, padding: "22px 0", borderRadius: 16, fontWeight: 700, fontSize: 24, background: "#1C1F30" }}>{t.startOver}</button>
                </>
              ) : (
                <>
                  <button onClick={startRegistration} style={{ flex: 1, padding: "24px 0", borderRadius: 16, fontWeight: 900, fontSize: 30, background: "#E8A33D", color: "#12141F" }}>{t.startRegistration}</button>
                  <button onClick={createQRSession} disabled={qrCreating} style={{ flex: 1, padding: "24px 0", borderRadius: 16, fontWeight: 900, fontSize: 26, background: "#181B2A", color: "#3DB8A8", border: "3px solid #3DB8A8", opacity: qrCreating ? 0.5 : 1 }}>{qrCreating ? "⏳" : t.qrRegister}</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── QR WAIT ── */}
        {screen === "qr-wait" && !isTV && (
          <div className="flex-1 flex flex-col px-5 py-6 gap-5">
            <button onClick={() => setScreen("counts")} className="self-start flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold active:scale-95" style={{ background: "#1C1F30" }}>
              <span style={{fontSize:13}}>{dir === "rtl" ? "▶" : "◀"}</span> {t.back}
            </button>
            <div className="text-center">
              <div className="text-2xl font-black mb-1" style={{ color: "#E8A33D" }}>{t.qrWaiting}</div>
              <div className="text-xs opacity-50 leading-relaxed">{t.qrScanInstruct}</div>
            </div>
            {qrImgUrl && (
              <div className="flex justify-center">
                <img src={qrImgUrl} alt="QR" className="rounded-2xl" style={{ width: 220, height: 220 }} />
              </div>
            )}
            {[1, 2].map(team => {
              const slots = qrLivePlayers.filter(p => p.team === team);
              const tc = TEAM_META[team];
              return (
                <div key={team} className="rounded-2xl p-4 card-shadow" style={{ background: "#181B2A" }}>
                  <div className="font-black mb-2" style={{ color: tc.color }}>
                    {teamNames[team]} — {slots.filter(p => p.submitted_at || p.name?.trim()).length}/{slots.length}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {slots.map((p, i) => {
                      const done = p.submitted_at || p.name?.trim();
                      return (
                        <div key={p.id} className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl" style={{ background: "#12141F" }}>
                          <span style={{ color: done ? "#3DB8A8" : "#555" }}>{done ? "✅" : "⏳"}</span>
                          <span className="flex-1 font-bold">{done ? p.name : `${lang === "ar" ? "لاعب" : "Player"} ${i + 1}`}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {qrLivePlayers.every(p => p.submitted_at || p.name?.trim()) && qrLivePlayers.length > 0 ? (
              <div className="flex flex-col gap-3">
                <div className="text-center text-sm font-bold" style={{ color: "#3DB8A8" }}>{t.qrAllDone}</div>
                <button onClick={startGameFromQR} className="w-full py-4 rounded-2xl font-black text-lg active:scale-95" style={{ background: "#3DB8A8", color: "#12141F" }}>{t.startGameNow}</button>
              </div>
            ) : (
              <div className="text-center text-xs opacity-40 leading-relaxed pulse">{lang === "ar" ? "ينتظر تسجيل اللاعبين..." : "Waiting for players to register..."}</div>
            )}
          </div>
        )}

        {/* ── QR WAIT TV ── */}
        {screen === "qr-wait" && isTV && (
          <div className="tv-screen" style={{ padding: "28px 64px", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <WhosWhoLogo size={44} />
              <div style={{ fontSize: 36, fontWeight: 900, color: "#E8A33D" }}>{t.qrWaiting}</div>
              <button onClick={() => setScreen("counts")} style={{ background: "#1C1F30", padding: "10px 24px", borderRadius: 12, fontWeight: 700, fontSize: 18 }}>{t.back}</button>
            </div>
            <div style={{ flex: 1, display: "flex", gap: 48, minHeight: 0 }}>
              {qrImgUrl && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                  <img src={qrImgUrl} alt="QR" style={{ width: 280, height: 280, borderRadius: 24 }} />
                  <div style={{ fontSize: 20, opacity: 0.55, textAlign: "center", maxWidth: 280 }}>{t.qrScanInstruct}</div>
                </div>
              )}
              <div style={{ flex: 1, display: "flex", gap: 32, minWidth: 0 }}>
                {[1, 2].map(team => {
                  const slots = qrLivePlayers.filter(p => p.team === team);
                  const tc = TEAM_META[team];
                  const doneCount = slots.filter(p => p.submitted_at || p.name?.trim()).length;
                  return (
                    <div key={team} className="tv-card" style={{ flex: 1, padding: "32px 40px", display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
                      <div style={{ fontSize: 32, fontWeight: 900, color: tc.color }}>{teamNames[team]} — {doneCount}/{slots.length}</div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
                        {slots.map((p, i) => {
                          const done = p.submitted_at || p.name?.trim();
                          return (
                            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 16, background: "#12141F", borderRadius: 16, padding: "16px 24px" }}>
                              <span style={{ fontSize: 28, color: done ? "#3DB8A8" : "#444" }}>{done ? "✅" : "⏳"}</span>
                              <span style={{ fontSize: 26, fontWeight: 700, flex: 1 }}>{done ? p.name : `${lang === "ar" ? "لاعب" : "Player"} ${i + 1}`}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {qrLivePlayers.every(p => p.submitted_at || p.name?.trim()) && qrLivePlayers.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ textAlign: "center", fontSize: 26, fontWeight: 900, color: "#3DB8A8" }}>{t.qrAllDone}</div>
                <button onClick={startGameFromQR} style={{ padding: "22px 0", borderRadius: 16, fontWeight: 900, fontSize: 30, background: "#3DB8A8", color: "#12141F" }}>{t.startGameNow}</button>
              </div>
            ) : (
              <div className="pulse" style={{ textAlign: "center", fontSize: 22, opacity: 0.45 }}>{lang === "ar" ? "ينتظر تسجيل اللاعبين..." : "Waiting for players to register..."}</div>
            )}
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

        {/* ── ROUNDS MENU TV ── */}
        {screen === "rounds" && isTV && (
          <div className="tv-screen" style={{ padding: "28px 64px", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <WhosWhoLogo size={44} />
              <div style={{ display: "flex", gap: 56, fontSize: 34, fontWeight: 900 }}>
                <span style={{ color: TEAM_META[1].color }}>{teamNames[1]}: {scores[1]}</span>
                <span style={{ color: TEAM_META[2].color }}>{teamNames[2]}: {scores[2]}</span>
              </div>
              <div style={{ fontSize: 20, opacity: 0.5 }}>{t.passAnyone}</div>
            </div>
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 24, minHeight: 0 }}>
              {(() => {
                const r1Count = countDeck();
                const r2Count = countDeck(new Set(r1UsedCombos));
                return [
                  { label: t.round1Title, name: t.round1Name, color: "#E8A33D", action: startRound1, enabled: true, desc: t.round1Desc, count: r1Count },
                  { label: t.round2Title, name: t.round2Name, color: "#3DB8A8", action: startRound2, enabled: triviaOk, desc: triviaOk ? t.round2Desc : t.triviaLocked, count: triviaOk ? r2Count : null },
                  { label: t.round3Title, name: t.round3Name, color: "#E85D5D", action: startRound3, enabled: true, desc: t.round3Desc, count: null },
                  { label: t.round4Title, name: t.round4Name, color: "#9B8CE8", action: startRound4, enabled: true, desc: t.round4Desc, count: null },
                ];
              })().map((r, i) => (
                <button key={i} onClick={r.enabled ? r.action : undefined}
                  className="tv-card" style={{ padding: "40px 56px", textAlign: "start", opacity: r.enabled ? 1 : 0.35, cursor: r.enabled ? "pointer" : "default", display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, opacity: 0.5 }}>{r.label}</div>
                  <div style={{ fontSize: 48, fontWeight: 900, color: r.color }}>{r.name}</div>
                  <div style={{ fontSize: 22, opacity: 0.6 }}>{r.desc}</div>
                  {r.count !== null && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 4, background: "#12141F", borderRadius: 10, padding: "6px 16px", alignSelf: "flex-start" }}>
                      <span style={{ fontSize: 26, fontWeight: 900, color: r.color }}>{r.count}</span>
                      <span style={{ fontSize: 16, opacity: 0.6 }}>{lang === "ar" ? "سؤال" : "questions"}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <button onClick={() => setScreen("final")} style={{ flex: 1, padding: "20px 0", borderRadius: 14, fontWeight: 700, fontSize: 22, background: "#1C1F30", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>🏆 {t.endGame}</button>
              <button onClick={resetGame} style={{ flex: 1, padding: "20px 0", borderRadius: 14, fontWeight: 700, fontSize: 22, background: "#1C1F30", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>↺ {t.newGame}</button>
            </div>
          </div>
        )}

        {/* ── ROUNDS MENU ── */}
        {screen === "rounds" && !isTV && (
          <div className="flex-1 flex flex-col px-5 py-8 gap-4">
            <div className="text-center mb-2">
              <div className="text-2xl font-black" style={{ color: "#E8A33D" }}>{t.chooseRound}</div>
              <div className="text-xs opacity-50 mt-1">{t.passAnyone}</div>
            </div>
            <button onClick={startRound1} className="rounded-2xl p-5 text-start card-shadow active:scale-95" style={{ background: "#181B2A" }}>
              <div className="text-xs font-bold opacity-50 mb-1">{t.round1Title}</div>
              <div className="text-xl font-black" style={{ color: "#E8A33D" }}>{t.round1Name}</div>
              <div className="text-xs opacity-60 mt-1">{t.round1Desc}</div>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1" style={{ background: "#12141F" }}>
                <span className="text-base font-black" style={{ color: "#E8A33D" }}>{countDeck()}</span>
                <span className="text-xs opacity-55">{lang === "ar" ? "سؤال" : "questions"}</span>
              </div>
            </button>
            {triviaOk ? (
              <button onClick={startRound2} className="rounded-2xl p-5 text-start card-shadow active:scale-95" style={{ background: "#181B2A" }}>
                <div className="text-xs font-bold opacity-50 mb-1">{t.round2Title}</div>
                <div className="text-xl font-black" style={{ color: "#3DB8A8" }}>{t.round2Name}</div>
                <div className="text-xs opacity-60 mt-1">{t.round2Desc}</div>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1" style={{ background: "#12141F" }}>
                  <span className="text-base font-black" style={{ color: "#3DB8A8" }}>{countDeck(new Set(r1UsedCombos))}</span>
                  <span className="text-xs opacity-55">{lang === "ar" ? "سؤال" : "questions"}</span>
                </div>
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

        {/* ── ROUND 1 & 2 TV ── */}
        {(screen === "round1" || screen === "round2") && isTV && (() => {
          const isR1 = screen === "round1";
          const label = isR1 ? t.guessingLabel : t.triviaLabel;
          return (
            <div className="tv-screen">
              {/* top bar */}
              <div style={{ background: "#181B2A", padding: "14px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1C1F30" }}>
                <WhosWhoLogo size={32} />
                <div style={{ fontSize: 16, fontWeight: 700, opacity: 0.5 }}>{label} · {deck.length ? deckIdx + 1 : 0} / {deck.length}</div>
                <div style={{ display: "flex", gap: 40, fontWeight: 900, fontSize: 30 }}>
                  <span style={{ color: TEAM_META[1].color }}>{teamNames[1]}: {scores[1]}</span>
                  <span style={{ color: TEAM_META[2].color }}>{teamNames[2]}: {scores[2]}</span>
                </div>
              </div>
              {/* timer */}
              <div style={{ height: 6, background: "#1C1F30" }}>
                <div style={{ height: "100%", background: timerElapsed >= 60 ? "#E85D5D" : timerElapsed >= 30 ? "#E8A33D" : "#3DB8A8", width: `${Math.min(100, (timerElapsed / 90) * 100)}%`, transition: "width 0.95s linear, background 0.3s" }} />
              </div>
              {/* start-of-round count banner */}
              {deckIdx === 0 && deck.length > 0 && (
                <div style={{ textAlign: "center", padding: "10px 0", background: "#181B2A", borderBottom: "1px solid #1C1F30", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: isR1 ? "#E8A33D" : "#3DB8A8" }}>{deck.length}</span>
                  <span style={{ fontSize: 20, opacity: 0.5 }}>{lang === "ar" ? "سؤال في هذه الجولة" : "questions this round"}</span>
                </div>
              )}
              {/* body */}
              <div className="tv-body" style={{ padding: "28px 48px", gap: 28, alignItems: "stretch" }}>
                {/* left: team banner + timer controls */}
                <div style={{ width: 300, display: "flex", flexDirection: "column", gap: 20, justifyContent: "center" }}>
                  {deck.length > 0 && (
                    <div className="tv-card" style={{ padding: "32px 24px", textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, opacity: 0.5, marginBottom: 10 }}>{t.questionFor(teamNames[deck[deckIdx].askedTeam])}</div>
                      <div style={{ fontSize: 44, fontWeight: 900, color: TEAM_META[deck[deckIdx].askedTeam].color }}>{teamNames[deck[deckIdx].askedTeam]}</div>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center" }}>
                    <span style={{ fontSize: 48, fontWeight: 900, color: timerElapsed >= 60 ? "#E85D5D" : timerElapsed >= 30 ? "#E8A33D" : "#3DB8A8" }}>{timerElapsed}s</span>
                    <button onClick={() => setTimerRunning((r) => !r)} style={{ width: 48, height: 48, borderRadius: "50%", background: "#1C1F30", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>{timerRunning ? "⏸" : "▶"}</button>
                    <button onClick={resetTimer} style={{ width: 48, height: 48, borderRadius: "50%", background: "#1C1F30", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>↺</button>
                  </div>
                </div>
                {/* center: card */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {deck.length === 0 ? (
                    <div style={{ opacity: 0.6, fontSize: 20, textAlign: "center" }}>{t.noQuestions}</div>
                  ) : (
                    <div className="tv-card flip-in" style={{ width: "100%", padding: "64px 72px", textAlign: "center" }} key={deckIdx}>
                      {isR1 ? (
                        <>
                          <div style={{ fontSize: 26, fontWeight: 700, opacity: 0.5, marginBottom: 16 }}>{t.personLabel}</div>
                          <div style={{ fontSize: 72, fontWeight: 900, marginBottom: 28 }}>{deck[deckIdx].player.name}</div>
                          <div style={{ fontSize: 26, fontWeight: 700, opacity: 0.5, marginBottom: 14 }}>{t.attrNeeded}</div>
                          <div style={{ fontSize: 56, fontWeight: 900, color: "#E8A33D", marginBottom: 28 }}>{deck[deckIdx].attrLabel}</div>
                          {revealed ? (
                            <div className="pulse" style={{ fontSize: 76, fontWeight: 900, color: "#3DB8A8" }}>{deck[deckIdx].value}</div>
                          ) : (
                            <button onClick={() => setRevealed(true)} style={{ margin: "0 auto", display: "flex", alignItems: "center", gap: 12, padding: "22px 44px", borderRadius: 14, fontWeight: 700, fontSize: 28, background: "#E8A33D", color: "#12141F" }}>
                              <span style={{fontSize:30}}>👁️</span> {t.revealAnswer}
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: 30, fontWeight: 700, opacity: 0.5, marginBottom: 16 }}>{deck[deckIdx].attrLabel}</div>
                          <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.3, marginBottom: 28 }}>{deck[deckIdx].value}</div>
                          <div style={{ fontSize: 30, opacity: 0.7, marginBottom: 28 }}>{t.whoseAnswer}</div>
                          {!revealed ? (
                            <button onClick={() => setRevealed(true)} style={{ margin: "0 auto", display: "flex", alignItems: "center", gap: 12, padding: "22px 44px", borderRadius: 14, fontWeight: 700, fontSize: 28, background: "#3DB8A8", color: "#12141F" }}>
                              <span style={{fontSize:30}}>👁️</span> {t.revealName}
                            </button>
                          ) : (
                            <div className="pulse" style={{ fontSize: 76, fontWeight: 900, color: "#3DB8A8" }}>{deck[deckIdx].player.name}</div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
                {/* right: win buttons */}
                {deck.length > 0 && (
                  <div style={{ width: 300, display: "flex", flexDirection: "column", gap: 20, justifyContent: "center" }}>
                    <button onClick={() => { award({ [deck[deckIdx].askedTeam]: 1 }); nextCard(); }}
                      style={{ padding: "28px 16px", borderRadius: 16, fontWeight: 900, fontSize: 26, background: TEAM_META[deck[deckIdx].askedTeam].bg, color: TEAM_META[deck[deckIdx].askedTeam].color }}>
                      {teamNames[deck[deckIdx].askedTeam]} {t.correct}
                    </button>
                    <button onClick={() => nextCard()} style={{ padding: "24px 16px", borderRadius: 16, fontWeight: 700, fontSize: 22, background: "#1C1F30" }}>{t.skipNoPoints}</button>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ── ROUND 1 & 2 ── */}
        {(screen === "round1" || screen === "round2") && !isTV && (
          <div className="flex-1 flex flex-col px-5 py-6 gap-4">
            <div className="text-center text-xs font-bold opacity-50">
              {screen === "round1" ? t.guessingLabel : t.triviaLabel} · {deck.length ? deckIdx + 1 : 0} / {deck.length}
            </div>
            {deckIdx === 0 && deck.length > 0 && (
              <div className="flex items-center justify-center gap-2 py-2 rounded-xl" style={{ background: "#181B2A" }}>
                <span className="text-2xl font-black" style={{ color: screen === "round1" ? "#E8A33D" : "#3DB8A8" }}>{deck.length}</span>
                <span className="text-sm opacity-60">{lang === "ar" ? "سؤال في هذه الجولة" : "questions this round"}</span>
              </div>
            )}
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

        {/* ── ROUND 4 TV ── */}
        {screen === "round4" && isTV && (
          <div className="tv-screen">
            <div style={{ background: "#181B2A", padding: "14px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1C1F30" }}>
              <WhosWhoLogo size={32} />
              <div style={{ fontSize: 16, fontWeight: 700, opacity: 0.5 }}>{t.photoGuessLabel} · {deck.length ? deckIdx + 1 : 0} / {deck.length}</div>
              <div style={{ display: "flex", gap: 32, fontWeight: 900, fontSize: 22 }}>
                <span style={{ color: TEAM_META[1].color }}>{teamNames[1]}: {scores[1]}</span>
                <span style={{ color: TEAM_META[2].color }}>{teamNames[2]}: {scores[2]}</span>
              </div>
            </div>
            <div style={{ height: 6, background: "#1C1F30" }}>
              <div style={{ height: "100%", background: timerElapsed >= 60 ? "#E85D5D" : timerElapsed >= 30 ? "#E8A33D" : "#3DB8A8", width: `${Math.min(100, (timerElapsed / 90) * 100)}%`, transition: "width 0.95s linear, background 0.3s" }} />
            </div>
            <div className="tv-body" style={{ padding: "28px 56px", gap: 40, alignItems: "stretch" }}>
              {deck.length === 0 ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.6, fontSize: 20 }}>{t.noPhotos}</div>
              ) : (
                <>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className="tv-card flip-in" style={{ overflow: "hidden", maxHeight: "calc(100vh - 200px)" }} key={deckIdx}>
                      <img src={deck[deckIdx].src} style={{ width: "100%", maxHeight: "55vh", objectFit: "cover" }} />
                      <div style={{ padding: "28px", textAlign: "center" }}>
                        <div style={{ fontSize: 38, fontWeight: 900, color: "#9B8CE8" }}>{t.photoQuestion}</div>
                        <div style={{ fontSize: 18, opacity: 0.4, marginTop: 8 }}>{t.fastestWins}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ width: 320, display: "flex", flexDirection: "column", gap: 20, justifyContent: "center" }}>
                    <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 48, fontWeight: 900, color: timerElapsed >= 60 ? "#E85D5D" : timerElapsed >= 30 ? "#E8A33D" : "#3DB8A8" }}>{timerElapsed}s</span>
                      <button onClick={() => setTimerRunning((r) => !r)} style={{ width: 48, height: 48, borderRadius: "50%", background: "#1C1F30", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>{timerRunning ? "⏸" : "▶"}</button>
                      <button onClick={resetTimer} style={{ width: 48, height: 48, borderRadius: "50%", background: "#1C1F30", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>↺</button>
                    </div>
                    <button onClick={() => { award({ 1: 1 }); nextCard(); }} style={{ padding: "28px", borderRadius: 16, fontWeight: 900, fontSize: 28, background: TEAM_META[1].bg, color: TEAM_META[1].color }}>{teamNames[1]} ✓</button>
                    <button onClick={() => { award({ 2: 1 }); nextCard(); }} style={{ padding: "28px", borderRadius: 16, fontWeight: 900, fontSize: 28, background: TEAM_META[2].bg, color: TEAM_META[2].color }}>{teamNames[2]} ✓</button>
                    <button onClick={() => nextCard()} style={{ padding: "20px", borderRadius: 14, fontWeight: 700, fontSize: 20, background: "#1C1F30" }}>{t.skipNoPoints}</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── ROUND 4 ── */}
        {screen === "round4" && !isTV && (
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

        {/* ── ROUND 3 TV ── */}
        {screen === "round3" && isTV && faceoffOrder.length > 0 && (() => {
          const storyteller = faceoffOrder[faceoffPairIdx];
          const opp = storyteller.team === 1 ? 2 : 1;
          function advanceFaceoff() {
            const ni = faceoffPairIdx + 1;
            if (ni >= faceoffOrder.length) { setScreen("rounds"); return; }
            const nextQ = faceoffQSequence[ni] ?? 0;
            setFaceoffPairIdx(ni);
            setFaceoffLiveQIdx(nextQ);
            setFaceoffUsedQSet(prev => [...new Set([...prev, nextQ])]);
            setFaceoffShufflesLeft(3);
          }
          return (
            <div className="tv-screen">
              <div style={{ background: "#181B2A", padding: "14px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1C1F30" }}>
                <WhosWhoLogo size={32} />
                <div style={{ fontSize: 16, fontWeight: 700, opacity: 0.5 }}>{t.faceoffLabel} · {faceoffPairIdx + 1} / {faceoffOrder.length}</div>
                <div style={{ display: "flex", gap: 40, fontWeight: 900, fontSize: 30 }}>
                  <span style={{ color: TEAM_META[1].color }}>{teamNames[1]}: {scores[1]}</span>
                  <span style={{ color: TEAM_META[2].color }}>{teamNames[2]}: {scores[2]}</span>
                </div>
              </div>
              <div style={{ height: 6, background: "#1C1F30" }}>
                <div style={{ height: "100%", background: timerElapsed >= 60 ? "#E85D5D" : timerElapsed >= 30 ? "#E8A33D" : "#3DB8A8", width: `${Math.min(100, (timerElapsed / 90) * 100)}%`, transition: "width 0.95s linear, background 0.3s" }} />
              </div>
              <div className="tv-body" style={{ padding: "28px 48px", gap: 28, alignItems: "stretch" }}>
                {/* left: storyteller */}
                <div style={{ width: 320, display: "flex", flexDirection: "column", gap: 20, justifyContent: "center" }}>
                  <div className="tv-card" style={{ padding: "36px 24px", textAlign: "center" }}>
                    <div style={{ fontSize: 18, opacity: 0.5, marginBottom: 12 }}>{teamNames[storyteller.team]}</div>
                    <div style={{ fontSize: 52, fontWeight: 900, color: TEAM_META[storyteller.team].color }}>{storyteller.name}</div>
                  </div>
                  <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center" }}>
                    <span style={{ fontSize: 48, fontWeight: 900, color: timerElapsed >= 60 ? "#E85D5D" : timerElapsed >= 30 ? "#E8A33D" : "#3DB8A8" }}>{timerElapsed}s</span>
                    <button onClick={() => setTimerRunning((r) => !r)} style={{ width: 48, height: 48, borderRadius: "50%", background: "#1C1F30", fontSize: 20 }}>{timerRunning ? "⏸" : "▶"}</button>
                    <button onClick={resetTimer} style={{ width: 48, height: 48, borderRadius: "50%", background: "#1C1F30", fontSize: 22 }}>↺</button>
                  </div>
                </div>
                {/* center: challenge card */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20, justifyContent: "center" }}>
                  <div className="tv-card flip-in" style={{ padding: "48px 56px", textAlign: "center" }} key={faceoffLiveQIdx}>
                    <div style={{ fontSize: 22, fontWeight: 700, opacity: 0.4, marginBottom: 20 }}>{t.faceoffLabel}</div>
                    <div style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.4 }}>{FACEOFF_QUESTIONS[faceoffLiveQIdx][lang]}</div>
                  </div>
                  {faceoffShufflesLeft > 0 && faceoffUsedQSet.length < FACEOFF_QUESTIONS.length && (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <button onClick={() => nextFaceoffQ(faceoffUsedQSet)} style={{ padding: "14px 28px", borderRadius: 14, fontWeight: 700, fontSize: 18, background: "#1C1F30", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{fontSize:20}}>🔀</span> {t.newQuestion}
                        <span style={{ borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, background: "#E8A33D", color: "#12141F" }}>{faceoffShufflesLeft}</span>
                      </button>
                    </div>
                  )}
                </div>
                {/* right: opponent + win buttons */}
                <div style={{ width: 320, display: "flex", flexDirection: "column", gap: 20, justifyContent: "center" }}>
                  <div className="tv-card" style={{ padding: "28px", textAlign: "center", background: TEAM_META[opp].bg }}>
                    <div style={{ fontSize: 18, opacity: 0.8, color: TEAM_META[opp].color }}>{t.faceoffChallenge(teamNames[opp])}</div>
                  </div>
                  <div style={{ fontSize: 16, textAlign: "center", fontWeight: 700, opacity: 0.4 }}>{t.faceoffWinnerPoints}</div>
                  <button onClick={() => { award({ [storyteller.team]: 2 }); advanceFaceoff(); }}
                    style={{ padding: "26px", borderRadius: 16, fontWeight: 900, fontSize: 26, background: TEAM_META[storyteller.team].bg, color: TEAM_META[storyteller.team].color }}>
                    {t.win(teamNames[storyteller.team])}
                  </button>
                  <button onClick={() => { award({ [opp]: 2 }); advanceFaceoff(); }}
                    style={{ padding: "26px", borderRadius: 16, fontWeight: 900, fontSize: 26, background: TEAM_META[opp].bg, color: TEAM_META[opp].color }}>
                    {t.win(teamNames[opp])}
                  </button>
                  {faceoffPairIdx + 1 < faceoffOrder.length ? (
                    <button onClick={advanceFaceoff}
                      style={{ padding: "18px", borderRadius: 14, fontWeight: 700, fontSize: 20, background: "#1C1F30" }}>{t.skipNoPoints}</button>
                  ) : (
                    <button onClick={() => setScreen("rounds")} style={{ padding: "18px", borderRadius: 14, fontWeight: 700, fontSize: 20, background: "#1C1F30" }}>{t.endRound}</button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
        {screen === "round3" && isTV && faceoffOrder.length === 0 && (
          <div className="tv-screen" style={{ alignItems: "center", justifyContent: "center" }}>
            <div style={{ opacity: 0.6, fontSize: 20 }}>{t.needOneEach}</div>
          </div>
        )}

        {/* ── ROUND 3 ── */}
        {screen === "round3" && !isTV && (
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
                if (ni >= faceoffOrder.length) { setScreen("rounds"); return; }
                const nextQ = faceoffQSequence[ni] ?? 0;
                setFaceoffPairIdx(ni);
                setFaceoffLiveQIdx(nextQ);
                setFaceoffUsedQSet(prev => [...new Set([...prev, nextQ])]);
                setFaceoffShufflesLeft(3);
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
                    {faceoffShufflesLeft > 0 && faceoffUsedQSet.length < FACEOFF_QUESTIONS.length && (
                      <button onClick={() => nextFaceoffQ(faceoffUsedQSet)} className="px-6 py-2.5 rounded-xl font-bold text-sm active:scale-95 flex items-center gap-2" style={{ background: "#1C1F30" }}>
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
                    <button onClick={advanceFaceoff} className="py-2.5 rounded-xl font-bold text-sm active:scale-95" style={{ background: "#1C1F30" }}>{t.skipNoPoints}</button>
                  ) : (
                    <button onClick={() => setScreen("rounds")} className="py-2.5 rounded-xl font-bold text-sm active:scale-95" style={{ background: "#1C1F30" }}>{t.endRound}</button>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* ── FINAL TV ── */}
        {screen === "final" && isTV && (
          <div className="tv-screen" style={{ alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <style>{`
              @keyframes ww-fall {
                0%   { opacity:0; transform:translateY(0) rotateZ(0deg); }
                6%   { opacity:1; }
                94%  { opacity:1; }
                100% { opacity:0; transform:translateY(102vh) rotateZ(540deg); }
              }
              @keyframes ww-sp {
                0%   { opacity:0; transform:translateY(0) scale(.6) rotate(0deg); }
                15%  { opacity:1; }
                85%  { opacity:1; }
                100% { opacity:0; transform:translateY(-110px) scale(1.3) rotate(360deg); }
              }
              @keyframes ww-bounce {
                from { transform:translateY(0) scale(1); }
                to   { transform:translateY(-20px) scale(1.12); }
              }
              @keyframes ww-glow {
                from { text-shadow:0 0 20px rgba(255,215,0,.5), 0 0 40px rgba(232,163,61,.3); }
                to   { text-shadow:0 0 60px rgba(255,215,0,1),  0 0 120px rgba(232,163,61,.8); }
              }
              @keyframes ww-pulse {
                from { transform:scale(1); }
                to   { transform:scale(1.06); }
              }
              .ww-c { position:fixed; top:-14px; width:12px; height:9px; border-radius:3px; animation:ww-fall linear infinite; }
              .ww-spark { position:fixed; font-size:28px; animation:ww-sp linear infinite; opacity:0; pointer-events:none; }
            `}</style>

            {/* confetti */}
            {[
              {l:"3%",  bg:"#E8A33D", d:3.1, dl:0,   w:14},
              {l:"8%",  bg:"#3ECFBE", d:2.7, dl:.4},
              {l:"14%", bg:"#E85D5D", d:3.5, dl:1.1},
              {l:"19%", bg:"#9B8CE8", d:2.9, dl:.2},
              {l:"25%", bg:"#FFD700", d:3.3, dl:1.8, w:15},
              {l:"31%", bg:"#E8A33D", d:2.5, dl:.7},
              {l:"37%", bg:"#3ECFBE", d:3.8, dl:.3},
              {l:"42%", bg:"#F2EDE3", d:2.6, dl:1.5, h:11},
              {l:"48%", bg:"#FFD700", d:3.2, dl:.9},
              {l:"54%", bg:"#E85D5D", d:2.8, dl:.1},
              {l:"59%", bg:"#9B8CE8", d:3.6, dl:1.3, w:13},
              {l:"65%", bg:"#3ECFBE", d:2.4, dl:.6},
              {l:"71%", bg:"#E8A33D", d:3.0, dl:1.9},
              {l:"76%", bg:"#FFD700", d:2.9, dl:.4,  h:13},
              {l:"82%", bg:"#E85D5D", d:3.4, dl:1.0},
              {l:"87%", bg:"#F2EDE3", d:2.7, dl:.8},
              {l:"92%", bg:"#9B8CE8", d:3.1, dl:1.6, w:11},
              {l:"97%", bg:"#3ECFBE", d:2.5, dl:.3},
              {l:"6%",  bg:"#FFD700", d:4.0, dl:2.2, w:10},
              {l:"22%", bg:"#E8A33D", d:3.7, dl:1.4},
              {l:"33%", bg:"#E85D5D", d:2.6, dl:2.5, h:10},
              {l:"45%", bg:"#9B8CE8", d:3.3, dl:.5},
              {l:"56%", bg:"#3ECFBE", d:2.9, dl:2.0, w:15},
              {l:"67%", bg:"#FFD700", d:3.5, dl:1.2},
              {l:"78%", bg:"#E8A33D", d:2.8, dl:2.8},
              {l:"89%", bg:"#F2EDE3", d:3.2, dl:.7,  h:8},
              {l:"12%", bg:"#3ECFBE", d:4.1, dl:1.7},
              {l:"50%", bg:"#E85D5D", d:2.5, dl:3.0, w:13},
              {l:"73%", bg:"#E8A33D", d:3.6, dl:.2},
              {l:"95%", bg:"#9B8CE8", d:2.7, dl:2.3},
            ].map((c, i) => (
              <span key={i} className="ww-c" style={{
                left: c.l, background: c.bg,
                width: c.w ? c.w : 12, height: c.h ? c.h : 9,
                animationDuration: c.d + "s", animationDelay: c.dl + "s"
              }} />
            ))}

            {/* sparkles */}
            {[
              {l:"10%", b:"18%", d:2.2, dl:0,   e:"✨"},
              {l:"25%", b:"8%",  d:2.8, dl:.6,  e:"⭐"},
              {l:"40%", b:"22%", d:2.0, dl:1.2, e:"✨"},
              {l:"60%", b:"12%", d:2.5, dl:.3,  e:"🌟"},
              {l:"75%", b:"20%", d:2.3, dl:.9,  e:"✨"},
              {l:"88%", b:"10%", d:2.7, dl:1.5, e:"⭐"},
            ].map((s, i) => (
              <span key={i} className="ww-spark" style={{
                left: s.l, bottom: s.b,
                animationDuration: s.d + "s", animationDelay: s.dl + "s"
              }}>{s.e}</span>
            ))}

            {/* center content */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:22, textAlign:"center", position:"relative", zIndex:1 }}>
              <div style={{ opacity:.5, fontSize:22, letterSpacing:6, color:"#E8A33D", direction:"ltr" }}>WHO'S WHO</div>

              <div style={{ fontSize:110, lineHeight:1, animation:"ww-bounce .85s ease-in-out infinite alternate", filter:"drop-shadow(0 0 32px rgba(232,163,61,.95))" }}>🏆</div>

              {scores[1] === scores[2] ? (
                <div style={{ fontSize:88, fontWeight:900, color:"#FFD700", animation:"ww-glow 1.2s ease-in-out infinite alternate" }}>
                  {t.tie}
                </div>
              ) : (
                <>
                  <div style={{ fontSize:88, fontWeight:900, letterSpacing:4, color:"#FFD700", animation:"ww-glow 1.2s ease-in-out infinite alternate" }}>
                    مبروك!
                  </div>
                  <div style={{ fontSize:20, letterSpacing:5, opacity:.5 }}>الفائز</div>
                  <div style={{ fontSize:62, fontWeight:900, color:"#3ECFBE", textShadow:"0 0 30px rgba(62,207,190,.8)", animation:"ww-pulse 1s ease-in-out infinite alternate" }}>
                    {scores[1] > scores[2] ? teamNames[1] : teamNames[2]}
                  </div>
                </>
              )}

              <div style={{ width:280, height:2, borderRadius:4, background:"linear-gradient(to right, transparent, #E8A33D 40%, #3ECFBE 60%, transparent)" }} />

              <div style={{ display:"flex", gap:80, fontSize:38, fontWeight:900 }}>
                <span style={{ color: TEAM_META[1].color }}>{teamNames[1]}: {scores[1]}</span>
                <span style={{ color: TEAM_META[2].color }}>{teamNames[2]}: {scores[2]}</span>
              </div>

              <div style={{ display:"flex", gap:20, marginTop:8 }}>
                <button onClick={() => setScreen("rounds")} style={{ padding:"16px 52px", borderRadius:999, fontWeight:700, fontSize:24, background:"#1C1F30", color:"#F2EDE3", border:"none", cursor:"pointer" }}>
                  {dir === "rtl" ? "▶" : "◀"} {t.back}
                </button>
                <button onClick={resetGame} style={{ padding:"16px 52px", borderRadius:999, fontWeight:900, fontSize:24, background:"#E8A33D", color:"#12141F", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{fontSize:26}}>↺</span> {t.newGame}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── FINAL ── */}
        {screen === "final" && !isTV && (
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
