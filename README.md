# مين هذا؟ — Who's Who

لعبة اجتماعية للعائلة والأصدقاء. كل لاعب يسجل بياناته بسرية، واللعبة تحول هذي البيانات لأسئلة وتحديات بين فريقين.

A social party game for families and friends. Players register their personal info privately, and the game turns it into questions, trivia, and challenges between two teams.

---

## اللعب / How to Play

### التسجيل / Registration

**خاص (تمرير الجوال):** كل لاعب يأخذ الجوال بعيداً عن باقي اللاعبين ويعبّي بياناته.

**QR (عن بُعد):** المنظم يضغط زر QR، يطلع كود يسكنه اللاعبين على تلفوناتهم ويسجلون بياناتهم مباشرة.

### الجولات / Rounds

| الجولة | الاسم | الوصف |
|--------|-------|--------|
| ١ | التخمين | يطلع اسم لاعب وصفة — الفرق تخمن جوابه |
| ٢ | تريفيا | يطلع الجواب — مين صاحبه؟ (٣+ لاعبين بكل فريق) |
| ٣ | المواجهة | تحديات بين لاعبين من الفريقين (٢١ سؤال عشوائي) |
| ٤ | خمّن الصورة | المنظم يرفع صور أغراض — الفرق تتسابق على التخمين |

### TV Mode

اضغط زر **📺** لتفعيل وضع الشاشة الكبيرة. الجوال يتحكم باللعبة، والتلفزيون/اللابتوب يعرض الأسئلة عبر BroadcastChannel التلقائي بين النوافذ.

---

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview  # http://localhost:4173
```

Deployed on **Vercel** — push to `main` triggers auto-deploy.

## Tech Stack

- **React 18** — single-file SPA (`src/App.jsx`)
- **Vite** — build tool
- **Tailwind CSS** — via CDN
- **Supabase** — QR registration only (`ww_sessions` + `ww_players` tables, Realtime)
- **BroadcastChannel API** — multi-window state sync for TV mode
- **qrcode** npm package — QR code generation

## Supabase Schema

Used only for QR remote registration mode.

```sql
-- Sessions
create table ww_sessions (
  id text primary key,
  team1_name text, team2_name text,
  team1_count int, team2_count int,
  q_labels jsonb, open_q_labels jsonb,
  lang text, status text
);

-- Player slots
create table ww_players (
  id text primary key,
  session_id text references ww_sessions(id),
  team int, player_order int,
  name text, job text, color text,
  food text, style text, wish text,
  funny text, fear text,
  submitted_at timestamptz
);

-- RLS: public anon read/write on both tables
```
