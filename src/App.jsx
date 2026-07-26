import { useState } from "react";
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
const MAX_PHOTOS = 3;

const FACEOFF_QUESTIONS = [
  { ar: "شنو أسوأ هدية استلمتها؟", en: "What's the worst gift you've ever received?" },
  { ar: "لو تعيش بلد ثاني غير بلدك، وين؟", en: "If you had to live in another country, where?" },
  { ar: "شنو أغرب شي أكلته؟", en: "What's the strangest thing you've ever eaten?" },
  { ar: "لو تغير اسمك، شنو تسويه؟", en: "If you could change your name, what would it be?" },
  { ar: "شنو أول شي تشتريه لو ربحت مليون؟", en: "What's the first thing you'd buy if you won a million?" },
  { ar: "شنو أكثر شي تكره تسويه بس مجبور؟", en: "What's something you hate doing but have to?" },
  { ar: "لو تقدر تتكلم لغة ثانية فجأة، أي لغة؟", en: "If you could suddenly speak another language, which one?" },
  { ar: "شنو أضحك كذبة قلتها؟", en: "What's the funniest lie you've ever told?" },
  { ar: "لو تلتقي أي شخص في التاريخ، مين؟", en: "If you could meet anyone in history, who?" },
  { ar: "لو عندك قدرة خارقة، شنو تختار؟", en: "If you had a superpower, what would you choose?" },
  { ar: "شنو أكثر شي تندم عليه من طفولتك؟", en: "What do you regret most from your childhood?" },
  { ar: "لو تعيش في فيلم، أي فيلم؟", en: "If you had to live inside a movie, which one?" },
  { ar: "شنو آخر شي خوّفك؟", en: "What's the last thing that scared you?" },
  { ar: "شنو أكثر تطبيق تفتحه على جوالك؟", en: "What app do you open the most on your phone?" },
  { ar: "لو ما فيه انترنت لأسبوع، شنو تسوي؟", en: "If there was no internet for a week, what would you do?" },
  { ar: "شنو أضحك موقف صار لك مع حيوان؟", en: "What's the funniest situation you've had with an animal?" },
  { ar: "لو تغير مهنتك لأي مهنة، شنو تختار؟", en: "If you could switch to any career, what would you choose?" },
  { ar: "شنو أغرب حلم شفته؟", en: "What's the strangest dream you've ever had?" },
  { ar: "لو تاخذ إجازة شهر كامل، وين تروح؟", en: "If you had a full month off, where would you go?" },
  { ar: "شنو أكثر شي يضحكك لو فكرت فيه؟", en: "What's something that always makes you laugh when you think about it?" },
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
    photosLabel: (max) => `صور أغراضك (لين ${max}) — ساعة، جوتي، سيارة، لعبة...`,
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
    round3Desc: "ممثل من كل فريق وجهاً لوجه",
    round4Title: "الجولة ٤",
    round4Name: "خمّن الصورة",
    round4Desc: "تطلع صورة غرض، مين صاحبه؟",
    endGame: "إنهاء اللعبة والنتيجة",
    guessingLabel: "التخمين",
    triviaLabel: "تريفيا",
    noQuestions: "ما فيه أسئلة كافية معبّاة بالبطاقات.",
    personLabel: "الشخص",
    attrNeeded: "الصفة المطلوبة",
    revealAnswer: "كشف الجواب",
    whoseAnswer: "مين جوابه كذا؟",
    revealName: "كشف الاسم",
    countdownNote: 'عد "٣.. ٢.. ١.. أشيروا!" ثم امنح النقاط',
    correct: "صح",
    bothCorrect: "الاثنين صح",
    skipNoPoints: "تخطي بدون نقاط",
    photoGuessLabel: "خمّن الصورة",
    noPhotos: "محد رفع صور بعد. رجعوا لتسجيل الأغراض.",
    faceoffLabel: "المواجهة",
    needOneEach: "محتاج لاعب واحد على الأقل بكل فريق.",
    faceoffWinnerPoints: "الفايز بالمواجهة ياخذ ٣ نقاط",
    win: (name) => `فوز ${name}`,
    endRound: "إنهاء الجولة",
    tie: "تعادل!",
    wins: (name) => `${name} يفوز!`,
    newGame: "لعبة جديدة",
    defaultTeam1: "الفريق الأول",
    defaultTeam2: "الفريق الثاني",
    customizeQuestions: "الأسئلة والصفات (اختياري: عدّلها قبل البدء)",
    newQuestion: "سؤال جديد",
    questionFor: (name) => `السؤال لـ ${name}`,
    faceoffInstruction: "احكِ موقفاً مضحكاً أو أي شي تختاره",
    faceoffChallenge: (name) => `${name} يحاولون ما يتفاعلون`,
    reacted: (name) => `${name} تفاعلوا! 😂`,
    noReaction: (name) => `${name} صمدوا 😐`,
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
    photosLabel: (max) => `Photos of your things (up to ${max}) — watch, shoes, car, toy...`,
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
    round3Desc: "A rep from each team, head to head",
    round4Title: "Round 4",
    round4Name: "Guess the Photo",
    round4Desc: "A photo shows up — whose is it?",
    endGame: "End Game & Show Results",
    guessingLabel: "Guess",
    triviaLabel: "Trivia",
    noQuestions: "Not enough answers filled in the cards.",
    personLabel: "Person",
    attrNeeded: "Trait needed",
    revealAnswer: "Reveal Answer",
    whoseAnswer: "Whose answer is this?",
    revealName: "Reveal Name",
    countdownNote: 'Count "3.. 2.. 1.. point!" then award points',
    correct: "Correct",
    bothCorrect: "Both correct",
    skipNoPoints: "Skip, no points",
    photoGuessLabel: "Guess the Photo",
    noPhotos: "No photos uploaded yet. Go back to add items.",
    faceoffLabel: "Face-Off",
    needOneEach: "Need at least one player per team.",
    faceoffWinnerPoints: "The face-off winner gets 3 points",
    win: (name) => `${name} wins`,
    endRound: "End Round",
    tie: "It's a tie!",
    wins: (name) => `${name} wins!`,
    newGame: "New Game",
    defaultTeam1: "Team 1",
    defaultTeam2: "Team 2",
    customizeQuestions: "Questions & Attributes (optional: edit before starting)",
    newQuestion: "New Question",
    questionFor: (name) => `Question for ${name}`,
    faceoffInstruction: "Tell a funny story or whatever you choose",
    faceoffChallenge: (name) => `${name} try not to react`,
    reacted: (name) => `${name} reacted! 😂`,
    noReaction: (name) => `${name} held it together 😐`,
  },
};

const defaultQLabels = (l) => QUESTIONS.map((q) => q[l]);
const defaultOpenQLabels = (l) => OPEN_QUESTIONS.map((q) => q[l]);

function uid() {
  return Math.random().toString(36).slice(2, 9);
}
function emptyPlayerDraft(team) {
  return { id: uid(), team, name: "", job: "", color: "", food: "", style: "", wish: "", funny: "", photos: [] };
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function WhosWho() {
  const [lang, setLang] = useState("ar");
  const t = STR[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const [screen, setScreen] = useState("counts"); // counts | pass | collecting | rounds | round1 | round2 | round3 | round4 | final
  const [teamNames, setTeamNames] = useState({ 1: STR.ar.defaultTeam1, 2: STR.ar.defaultTeam2 });
  const [qLabels, setQLabels] = useState({ ar: defaultQLabels("ar"), en: defaultQLabels("en") });
  const [openQLabels, setOpenQLabels] = useState({ ar: defaultOpenQLabels("ar"), en: defaultOpenQLabels("en") });
  const [counts, setCounts] = useState({ 1: 2, 2: 2 });
  const [queue, setQueue] = useState([]); // [{team, orderInTeam}]
  const [qIdx, setQIdx] = useState(0);
  const [players, setPlayers] = useState([]);
  const [draft, setDraft] = useState(null);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });

  const [deck, setDeck] = useState([]);
  const [deckIdx, setDeckIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const [faceoffOrder, setFaceoffOrder] = useState([]);
  const [faceoffPairIdx, setFaceoffPairIdx] = useState(0);
  const [faceoffRevealed, setFaceoffRevealed] = useState({});
  const [faceoffLiveQIdx, setFaceoffLiveQIdx] = useState(0);

  function startRegistration() {
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
    if (next >= queue.length) {
      setScreen("rounds");
    } else {
      setQIdx(next);
      setScreen("pass");
    }
  }

  function updateDraft(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  function handlePhotoPick(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDraft((d) => ({ ...d, photos: [...d.photos, { id: uid(), src: reader.result }] }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }
  function removePhoto(id) {
    setDraft((d) => ({ ...d, photos: d.photos.filter((p) => p.id !== id) }));
  }

  function buildDeck() {
    const items = [];
    players.forEach((p) => {
      QUESTIONS.forEach((q, idx) => {
        if (p[q.key] && p[q.key].trim()) items.push({
          player: p,
          attrLabel: qLabels[lang][idx],
          value: p[q.key],
          askedTeam: p.team === 1 ? 2 : 1,
        });
      });
    });
    return shuffle(items);
  }
  function buildPhotoDeck() {
    const items = [];
    players.forEach((p) => {
      p.photos.forEach((ph) => items.push({ player: p, src: ph.src }));
    });
    return shuffle(items);
  }

  function startRound1() { setDeck(buildDeck()); setDeckIdx(0); setRevealed(false); setScreen("round1"); }
  function startRound2() { setDeck(buildDeck()); setDeckIdx(0); setRevealed(false); setScreen("round2"); }
  function startRound4() { setDeck(buildPhotoDeck()); setDeckIdx(0); setRevealed(false); setScreen("round4"); }
  function startRound3() {
    const t1 = shuffle(players.filter((p) => p.team === 1));
    const t2 = shuffle(players.filter((p) => p.team === 2));
    if (!t1.length || !t2.length) { setFaceoffOrder([]); setFaceoffPairIdx(0); setScreen("round3"); return; }
    const order = [];
    const n = Math.max(t1.length, t2.length);
    for (let i = 0; i < n; i++) {
      if (i < t1.length) order.push(t1[i]);
      if (i < t2.length) order.push(t2[i]);
    }
    setFaceoffOrder(order);
    setFaceoffPairIdx(0);
    setFaceoffLiveQIdx(Math.floor(Math.random() * FACEOFF_QUESTIONS.length));
    setScreen("round3");
  }

  function nextFaceoffQ() {
    setFaceoffLiveQIdx((idx) => {
      let next = Math.floor(Math.random() * FACEOFF_QUESTIONS.length);
      if (next === idx) next = (idx + 1) % FACEOFF_QUESTIONS.length;
      return next;
    });
  }

  function award(points) {
    setScores((prev) => ({ 1: prev[1] + (points[1] || 0), 2: prev[2] + (points[2] || 0) }));
  }
  function nextCard() {
    if (deckIdx + 1 >= deck.length) setScreen("rounds");
    else { setDeckIdx((i) => i + 1); setRevealed(false); }
  }
  function resetGame() {
    setScreen("counts");
    setCounts({ 1: 2, 2: 2 });
    setTeamNames({ 1: t.defaultTeam1, 2: t.defaultTeam2 });
    setPlayers([]);
    setQueue([]);
    setQIdx(0);
    setScores({ 1: 0, 2: 0 });
    setDeck([]); setDeckIdx(0);
    setFaceoffOrder([]); setFaceoffPairIdx(0); setFaceoffRevealed({});
  }

  const currentTeam = screen === "pass" || screen === "collecting" ? queue[qIdx]?.team : null;

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
        input, select { outline: none; }
        input:focus { box-shadow: 0 0 0 2px #E8A33D; }
      `}</style>

      <button
        onClick={() => setLang((l) => {
          const newLang = l === "ar" ? "en" : "ar";
          setTeamNames((prev) => ({
            1: prev[1] === STR[l].defaultTeam1 ? STR[newLang].defaultTeam1 : prev[1],
            2: prev[2] === STR[l].defaultTeam2 ? STR[newLang].defaultTeam2 : prev[2],
          }));
          return newLang;
        })}
        className="active:scale-95"
        style={{ position: "fixed", top: 12, insetInlineEnd: 12, zIndex: 50, background: "#1C1F30", color: "#E8A33D", fontWeight: 900, fontSize: 12, padding: "6px 12px", borderRadius: 999, boxShadow: "0 4px 14px rgba(0,0,0,0.4)" }}
      >
        {lang === "ar" ? "EN" : "AR"}
      </button>

      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        {["rounds", "round1", "round2", "round3", "round4"].includes(screen) && (
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#252840" }}>
            <button onClick={() => setScreen("rounds")} className="p-2 rounded-full active:scale-95" style={{ background: "#1C1F30" }}>
              <span style={{fontSize:18}}>{dir === "rtl" ? "◀" : "▶"}</span>
            </button>
            <div className="flex gap-3 text-sm font-bold">
              <div className="px-3 py-1 rounded-full" style={{ background: TEAM_META[1].bg, color: TEAM_META[1].color }}>{teamNames[1]} · {scores[1]}</div>
              <div className="px-3 py-1 rounded-full" style={{ background: TEAM_META[2].bg, color: TEAM_META[2].color }}>{teamNames[2]} · {scores[2]}</div>
            </div>
            <div style={{ width: 36 }} />
          </div>
        )}

        {/* STEP 1: counts */}
        {screen === "counts" && (
          <div className="flex-1 flex flex-col px-5 py-10 gap-8 justify-center">
            <div className="text-center mb-2">
              <div className="text-4xl font-black tracking-tight" style={{ color: "#E8A33D" }}>{t.title}</div>
              <div className="text-sm mt-1 opacity-60">{t.subtitle}</div>
            </div>

            {[1, 2].map((team) => (
              <div key={team} className="rounded-2xl p-5 card-shadow flex flex-col gap-4" style={{ background: "#181B2A" }}>
                <div className="flex items-center gap-2">
                  <span style={{fontSize:18}}>👥</span>
                  <input
                    value={teamNames[team]}
                    onChange={(e) => setTeamNames((tn) => ({ ...tn, [team]: e.target.value }))}
                    className="bg-transparent font-bold text-lg flex-1 border-b pb-1"
                    style={{ borderColor: TEAM_META[team].color, color: TEAM_META[team].color }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-70">{t.playersCount}</span>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setCounts((c) => ({ ...c, [team]: Math.max(1, c[team] - 1) }))} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95" style={{ background: "#12141F" }}>
                      <span style={{fontSize:18,fontWeight:900}}>−</span>
                    </button>
                    <span className="text-2xl font-black w-6 text-center">{counts[team]}</span>
                    <button onClick={() => setCounts((c) => ({ ...c, [team]: Math.min(12, c[team] + 1) }))} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95" style={{ background: "#12141F" }}>
                      <span style={{fontSize:18,fontWeight:900}}>+</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-2xl p-4 card-shadow flex flex-col gap-2" style={{ background: "#181B2A" }}>
              <div className="text-xs font-bold opacity-50 mb-1">{t.customizeQuestions}</div>
              {QUESTIONS.map((q, i) => (
                <input
                  key={q.key}
                  value={qLabels[lang][i]}
                  onChange={(e) => {
                    const next = [...qLabels[lang]];
                    next[i] = e.target.value;
                    setQLabels((prev) => ({ ...prev, [lang]: next }));
                  }}
                  className="rounded-xl px-3 py-2 text-sm"
                  style={{ background: "#12141F" }}
                />
              ))}
              {OPEN_QUESTIONS.map((q, i) => (
                <input
                  key={q.key}
                  value={openQLabels[lang][i]}
                  onChange={(e) => {
                    const next = [...openQLabels[lang]];
                    next[i] = e.target.value;
                    setOpenQLabels((prev) => ({ ...prev, [lang]: next }));
                  }}
                  className="rounded-xl px-3 py-2 text-sm"
                  style={{ background: "#12141F" }}
                />
              ))}
            </div>

            <button onClick={startRegistration} className="w-full py-4 rounded-2xl font-black text-lg active:scale-95" style={{ background: "#E8A33D", color: "#12141F" }}>
              {t.startRegistration}
            </button>
            <div className="text-center text-xs opacity-45 leading-relaxed">
              {t.privacyNote}
            </div>
          </div>
        )}

        {/* STEP 2: pass phone transition */}
        {screen === "pass" && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-6 text-center">
            <span style={{fontSize:40}}>🔄</span>
            <div className="text-sm opacity-60">{t.passTo}</div>
            <div className="text-2xl font-black" style={{ color: TEAM_META[currentTeam].color }}>
              {t.playerFrom(teamNames[currentTeam])}
            </div>
            <div className="text-xs opacity-40 max-w-xs leading-relaxed">
              {t.privacyTurn}
            </div>
            <button onClick={beginCurrentEntry} className="mt-2 px-8 py-3 rounded-xl font-bold active:scale-95" style={{ background: TEAM_META[currentTeam].bg, color: TEAM_META[currentTeam].color }}>
              {t.readyFill}
            </button>
          </div>
        )}

        {/* STEP 2b: private collecting form */}
        {screen === "collecting" && draft && (
          <div className="flex-1 flex flex-col px-5 py-6 gap-4">
            <div className="text-center text-xs font-bold opacity-50 mb-1" style={{ color: TEAM_META[currentTeam].color }}>
              {teamNames[currentTeam]} · {queue[qIdx].order + 1} / {counts[currentTeam]}
            </div>

            <input
              placeholder={t.yourName}
              value={draft.name}
              onChange={(e) => updateDraft("name", e.target.value)}
              className="rounded-xl px-4 py-3 font-bold text-lg placeholder-white/25"
              style={{ background: "#181B2A" }}
            />

            <div className="grid grid-cols-2 gap-2">
              {QUESTIONS.map((q, i) => (
                <input
                  key={q.key}
                  placeholder={qLabels[lang][i]}
                  value={draft[q.key]}
                  onChange={(e) => updateDraft(q.key, e.target.value)}
                  className="rounded-xl px-3 py-2.5 text-sm placeholder-white/25"
                  style={{ background: "#181B2A" }}
                />
              ))}
            </div>

            {OPEN_QUESTIONS.map((q, i) => (
              <input
                key={q.key}
                placeholder={openQLabels[lang][i]}
                value={draft[q.key]}
                onChange={(e) => updateDraft(q.key, e.target.value)}
                className="rounded-xl px-3 py-2.5 text-sm placeholder-white/25"
                style={{ background: "#181B2A" }}
              />
            ))}

            <div className="rounded-xl p-3 flex flex-col gap-3" style={{ background: "#181B2A" }}>
              <div className="text-xs font-bold opacity-60">{t.photosLabel(MAX_PHOTOS)}</div>
              <div className="flex gap-2 flex-wrap">
                {draft.photos.map((p) => (
                  <div key={p.id} className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <img src={p.src} className="w-full h-full object-cover" />
                    <button onClick={() => removePhoto(p.id)} className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
                      <span style={{fontSize:14}}>✕</span>
                    </button>
                  </div>
                ))}
                {draft.photos.length < MAX_PHOTOS && (
                  <label className="w-16 h-16 rounded-lg flex items-center justify-center active:scale-95 cursor-pointer" style={{ background: "#12141F" }}>
                    <span style={{fontSize:22}}>📷</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoPick} />
                  </label>
                )}
              </div>
            </div>

            <button
              disabled={!draft.name.trim()}
              onClick={saveDraftAndAdvance}
              className="w-full py-4 rounded-2xl font-black text-lg mt-2 active:scale-95 disabled:opacity-30"
              style={{ background: "#E8A33D", color: "#12141F" }}
            >
              {qIdx + 1 >= queue.length ? t.doneStart : t.donePass}
            </button>
          </div>
        )}

        {/* ROUNDS MENU */}
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

            <button onClick={startRound2} className="rounded-2xl p-5 text-start card-shadow active:scale-95" style={{ background: "#181B2A" }}>
              <div className="text-xs font-bold opacity-50 mb-1">{t.round2Title}</div>
              <div className="text-xl font-black" style={{ color: "#3DB8A8" }}>{t.round2Name}</div>
              <div className="text-xs opacity-60 mt-1">{t.round2Desc}</div>
            </button>

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

        {/* ROUND 1 & 2 */}
        {(screen === "round1" || screen === "round2") && (
          <div className="flex-1 flex flex-col px-5 py-6 gap-4">
            <div className="text-center text-xs font-bold opacity-50">
              {screen === "round1" ? t.guessingLabel : t.triviaLabel} · {deck.length ? deckIdx + 1 : 0} / {deck.length}
            </div>
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
                        {revealed && (
                          <div className="mt-5 text-2xl font-black pulse" style={{ color: "#3DB8A8" }}>{deck[deckIdx].value}</div>
                        )}
                        {!revealed && (
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

                <div className="text-center text-xs font-bold opacity-40 mb-1">{t.countdownNote}</div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { award({ [deck[deckIdx].askedTeam]: 1 }); nextCard(); }}
                    className="py-3 rounded-xl font-bold active:scale-95"
                    style={{ background: TEAM_META[deck[deckIdx].askedTeam].bg, color: TEAM_META[deck[deckIdx].askedTeam].color }}
                  >
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

        {/* ROUND 4 - photo guess */}
        {screen === "round4" && (
          <div className="flex-1 flex flex-col px-5 py-6 gap-5">
            <div className="text-center text-xs font-bold opacity-50">{t.photoGuessLabel} · {deck.length ? deckIdx + 1 : 0} / {deck.length}</div>
            {deck.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center opacity-60 text-sm px-6">{t.noPhotos}</div>
            ) : (
              <>
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  <div className="w-full rounded-3xl overflow-hidden card-shadow flip-in" style={{ background: "#181B2A" }} key={deckIdx}>
                    <img src={deck[deckIdx].src} className="w-full h-64 object-cover" />
                    <div className="p-5 text-center">
                      {!revealed ? (
                        <button onClick={() => setRevealed(true)} className="mx-auto flex items-center gap-2 px-5 py-3 rounded-xl font-bold active:scale-95" style={{ background: "#9B8CE8", color: "#12141F" }}>
                          <span style={{fontSize:18}}>👁️</span> {t.revealName}
                        </button>
                      ) : (
                        <div className="text-3xl font-black pulse" style={{ color: "#9B8CE8" }}>{deck[deckIdx].player.name}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-center text-xs font-bold opacity-40 mb-1">{t.countdownNote}</div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { award({ 1: 1 }); nextCard(); }} className="py-3 rounded-xl font-bold active:scale-95" style={{ background: TEAM_META[1].bg, color: TEAM_META[1].color }}>{teamNames[1]} {t.correct}</button>
                  <button onClick={() => { award({ 2: 1 }); nextCard(); }} className="py-3 rounded-xl font-bold active:scale-95" style={{ background: TEAM_META[2].bg, color: TEAM_META[2].color }}>{teamNames[2]} {t.correct}</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { award({ 1: 1, 2: 1 }); nextCard(); }} className="py-2.5 rounded-xl font-bold text-sm active:scale-95" style={{ background: "#1C1F30" }}>{t.bothCorrect}</button>
                  <button onClick={() => nextCard()} className="py-2.5 rounded-xl font-bold text-sm active:scale-95" style={{ background: "#1C1F30" }}>{t.skipNoPoints}</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ROUND 3 - storyteller face off */}
        {screen === "round3" && (
          <div className="flex-1 flex flex-col px-5 py-6 gap-4">
            <div className="text-center text-xs font-bold opacity-50">{t.faceoffLabel} · {faceoffOrder.length ? faceoffPairIdx + 1 : 0} / {faceoffOrder.length}</div>
            {faceoffOrder.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center opacity-60 text-sm px-6">{t.needOneEach}</div>
            ) : (() => {
              const storyteller = faceoffOrder[faceoffPairIdx];
              const opposingTeam = storyteller.team === 1 ? 2 : 1;
              function advanceFaceoff() {
                const ni = faceoffPairIdx + 1;
                nextFaceoffQ();
                if (ni >= faceoffOrder.length) setScreen("rounds");
                else setFaceoffPairIdx(ni);
              }
              return (
                <>
                  <div className="rounded-2xl p-4 text-center card-shadow" style={{ background: TEAM_META[storyteller.team].bg }}>
                    <div className="font-black text-2xl" style={{ color: TEAM_META[storyteller.team].color }}>{storyteller.name}</div>
                    <div className="text-xs opacity-60 mt-0.5">{teamNames[storyteller.team]}</div>
                  </div>

                  <div className="text-center text-sm font-bold opacity-70">{t.faceoffInstruction}</div>

                  <div className="rounded-2xl px-4 py-3 text-center font-black text-sm" style={{ background: TEAM_META[opposingTeam].bg, color: TEAM_META[opposingTeam].color }}>
                    {t.faceoffChallenge(teamNames[opposingTeam])}
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="w-full rounded-3xl p-6 text-center card-shadow flip-in" style={{ background: "#181B2A" }} key={faceoffLiveQIdx}>
                      <div className="text-xs font-bold opacity-40 mb-3">{t.faceoffLabel}</div>
                      <div className="text-xl font-black leading-relaxed" style={{ color: "#F2EDE3" }}>
                        {FACEOFF_QUESTIONS[faceoffLiveQIdx][lang]}
                      </div>
                    </div>
                    <button onClick={nextFaceoffQ} className="px-6 py-2.5 rounded-xl font-bold text-sm active:scale-95 flex items-center gap-2" style={{ background: "#1C1F30" }}>
                      <span style={{fontSize:16}}>🔀</span> {t.newQuestion}
                    </button>
                  </div>

                  <div className="text-center text-xs font-bold opacity-40">{t.faceoffWinnerPoints}</div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => { award({ [storyteller.team]: 3 }); advanceFaceoff(); }}
                      className="py-3 rounded-xl font-bold active:scale-95 text-sm leading-tight"
                      style={{ background: TEAM_META[storyteller.team].bg, color: TEAM_META[storyteller.team].color }}
                    >
                      {t.reacted(teamNames[opposingTeam])}
                    </button>
                    <button
                      onClick={() => { award({ [opposingTeam]: 3 }); advanceFaceoff(); }}
                      className="py-3 rounded-xl font-bold active:scale-95 text-sm leading-tight"
                      style={{ background: TEAM_META[opposingTeam].bg, color: TEAM_META[opposingTeam].color }}
                    >
                      {t.noReaction(teamNames[opposingTeam])}
                    </button>
                  </div>
                  {faceoffPairIdx + 1 < faceoffOrder.length ? (
                    <button onClick={() => { setFaceoffPairIdx((i) => i + 1); nextFaceoffQ(); }} className="py-2.5 rounded-xl font-bold text-sm active:scale-95" style={{ background: "#1C1F30" }}>{t.skipNoPoints}</button>
                  ) : (
                    <button onClick={() => setScreen("rounds")} className="py-2.5 rounded-xl font-bold text-sm active:scale-95" style={{ background: "#1C1F30" }}>{t.endRound}</button>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* FINAL */}
        {screen === "final" && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-6 text-center">
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
        )}
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<WhosWho />);
