// Répétition espacée inspirée d'Anki (SM-2 simplifié).
const MIN = 60 * 1000, DAY = 24 * 60 * MIN;
const LEARN = [1 * MIN, 10 * MIN];

export const newState = () => ({ due: 0, ivl: 0, ease: 2.5, reps: 0, lapses: 0, step: 0, learning: true, seen: false });

// grade : 0 = À revoir, 1 = Difficile, 2 = Bien, 3 = Facile
export function schedule(st, grade, now = Date.now()) {
  const s = { ...(st || newState()), seen: true, reps: (st ? st.reps : 0) + 1, last: now };
  if (s.learning) {
    if (grade === 0) { s.step = 0; s.due = now + LEARN[0]; }
    else if (grade === 1) { s.due = now + LEARN[Math.min(s.step, LEARN.length - 1)] * 1.5; }
    else if (grade === 2) {
      s.step += 1;
      if (s.step >= LEARN.length) { s.learning = false; s.ivl = 1; s.due = now + DAY; }
      else s.due = now + LEARN[s.step];
    } else { s.learning = false; s.ivl = 4; s.due = now + 4 * DAY; }
    return s;
  }
  if (grade === 0) {
    s.lapses += 1; s.ease = Math.max(1.3, s.ease - 0.2); s.ivl = Math.max(1, Math.round(s.ivl * 0.5));
    s.learning = true; s.step = 1; s.due = now + LEARN[1];
  } else if (grade === 1) { s.ease = Math.max(1.3, s.ease - 0.15); s.ivl = Math.max(s.ivl + 1, Math.round(s.ivl * 1.2)); s.due = now + s.ivl * DAY; }
  else if (grade === 2) { s.ivl = Math.max(s.ivl + 1, Math.round(s.ivl * s.ease)); s.due = now + s.ivl * DAY; }
  else { s.ease += 0.15; s.ivl = Math.max(s.ivl + 2, Math.round(s.ivl * s.ease * 1.3)); s.due = now + s.ivl * DAY; }
  return s;
}

export function fmtDelay(ms) {
  if (ms < 60 * MIN) return Math.max(1, Math.round(ms / MIN)) + " min";
  if (ms < DAY) return Math.round(ms / (60 * MIN)) + " h";
  const d = Math.round(ms / DAY);
  if (d < 31) return d + " j";
  return Math.round(d / 30) + " mois";
}

export const isMature = st => st && !st.learning && st.ivl >= 21;
