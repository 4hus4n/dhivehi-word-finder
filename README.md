# ބަސް ހޯދާ — Dhivehi Word Finder

A Dhivehi (Thaana) word search game with 10 levels, Google login and a leaderboard.
Static site for GitHub Pages; login and scores use Firebase (free Spark plan).

Crafted by clickandcraft in Milandhoo.

## Levels

| Level | Word length (cells) | Grid | Words | Directions | Par time |
|---|---|---|---|---|---|
| 1 | 2 | 7×7 | 5 | across, down | 1:30 |
| 2 | 2–3 | 8×8 | 6 | across, down | 1:50 |
| 3 | 3 | 8×8 | 6 | + diagonals | 2:10 |
| 4 | 3–4 | 9×9 | 7 | + diagonals | 2:30 |
| 5 | 4 | 9×9 | 7 | + diagonals | 2:50 |
| 6 | 4–5 | 10×10 | 8 | + diagonals | 3:10 |
| 7 | 5 | 10×10 | 7 | all 8, incl. backwards | 3:30 |
| 8 | 5–6 | 11×11 | 8 | all 8 | 4:00 |
| 9 | 6 | 11×11 | 8 | all 8 | 4:30 |
| 10 | 6–7 | 12×12 | 8 | all 8 | 5:00 |

Each level unlocks after the one before it. Words are picked at random every game. Edit `js/words.js` to add words or change levels.

## Points

- 10 points for every letter in every word found.
- Time bonus: 3 points for every second left before the level's par time.
- Only your best score per level counts. Leaderboard total = sum of best scores.
- Same total? The player with less total time ranks higher.

## Firebase setup (one time, ~5 minutes)

1. Go to https://console.firebase.google.com → **Add project** (e.g. `dhivehi-word-finder`). Analytics not needed.
2. **Build → Authentication → Get started → Sign-in method → Google → Enable** → Save.
3. **Authentication → Settings → Authorized domains → Add domain:** `4hus4n.github.io`
4. **Build → Firestore Database → Create database** → Production mode → any region (e.g. `asia-south1`).
5. **Firestore → Rules** → paste the contents of `firestore.rules` → Publish.
6. **Project settings (gear) → Your apps → Web (`</>`)** → register app → copy the `firebaseConfig` values into `js/firebase-config.js`.
7. Commit and push. Done.

Until step 6 is done the game works, but login and the leaderboard stay off.

## Font

Uses FreeFont Thaana (GNU FreeFont, GPL with font exception). To use another Thaana font
(Faruma, your own), save it as `fonts/custom.woff2` — the game tries it first.
