// game.js: the rules and the numbers for the insurance game.
// No browser or network code lives here, so the same file runs on phones, on the
// scoreboard and in the test scripts.
//
// TO CHANGE A NUMBER OR A LINE OF TEXT: edit CONFIG below. Amounts are per year
// unless they are a one-time disaster cost.

export const CONFIG = {
  years: 10, // each round is ten years

  // Who sits on the board besides the students.
  house: [
    { id: "house_buy", name: "House: buys all", policy: "buy" },
    { id: "house_skip", name: "House: skips all", policy: "skip" },
    { id: "house_skip2", name: "House: skips all 2", policy: "skip" },
  ],
  houseBuyerId: "house_buy", // takes the buyer's disaster when no student bought
  houseSkipperId: "house_skip2", // takes the skipper's disaster when no student skipped

  decades: [
    {
      key: "20s",
      title: "Your 20s",
      endAge: 30,
      intro: "You're 26. You just aged off your parents' health plan.",
      payLabel: "You make",
      make: 50000,
      living: 45000,
      alreadyPaid: ["Car insurance (required by law)"],
      offers: [
        {
          id: "health",
          short: "Health",
          name: "Health insurance",
          premium: 3000,
          without: "Without it, a serious accident could cost $75,000.",
          withIt: "With it, your share would be about $10,000.",
          event: {
            id: "accident",
            big: true,
            text: "A serious accident: surgery and a week in the hospital.",
            skipCost: 75000,
            boughtCost: 10000,
          },
        },
        {
          id: "phone",
          short: "Phone",
          name: "Phone protection",
          premium: 150,
          without: "Without it, a broken phone costs about $800.",
          withIt: "With it, about $100.",
          event: {
            id: "phone",
            big: false,
            share: 0.5, // lands on this share of the class
            text: "Your phone broke.",
            skipCost: 800,
            boughtCost: 100,
          },
        },
      ],
    },
    {
      key: "30s",
      title: "Your 30s",
      endAge: 40,
      intro: "You have a partner now, and the two of you bought a home. Health insurance comes through work.",
      payLabel: "Together you make",
      make: 70000,
      living: 62000,
      alreadyPaid: ["Car insurance (required by law)", "Homeowners insurance (required by your lender)"],
      offers: [
        {
          id: "disability",
          short: "Disability",
          name: "Disability insurance",
          premium: 1500,
          without: "Without it, three years unable to work would cost $200,000 in lost pay.",
          withIt: "With it, you would still lose about $80,000.",
          event: {
            id: "disability",
            big: true,
            text: "You couldn't work for three years.",
            skipCost: 200000,
            boughtCost: 80000,
          },
        },
      ],
    },
    {
      key: "40s",
      title: "Your 40s",
      endAge: 50,
      intro: "Two kids now depend on the two of you.",
      payLabel: "Together you make",
      make: 90000,
      living: 78000,
      alreadyPaid: ["Car insurance (required by law)", "Homeowners insurance (required by your lender)"],
      offers: [
        {
          id: "life",
          short: "Life",
          name: "Life insurance, on you and your partner",
          premium: 1200,
          without: "Without it, losing your partner would mean losing $500,000 of income.",
          withIt: "With it, the policy replaces that income.",
          event: {
            id: "partner",
            big: true,
            text: "Your partner died. The household lost that income.",
            skipCost: 500000,
            boughtCost: 0,
          },
        },
      ],
    },
    {
      key: "50s",
      title: "Your 50s",
      endAge: 60,
      intro: "The mortgage is paid off. For the first time, nobody makes you insure the house.",
      payLabel: "Together you make",
      make: 100000,
      living: 84000,
      alreadyPaid: ["Car insurance (required by law)"],
      offers: [
        {
          id: "home",
          short: "Home",
          name: "Homeowners insurance",
          premium: 1500,
          without: "Without it, a house fire would cost $500,000.",
          withIt: "With it, your share would be about $5,000.",
          event: {
            id: "fire",
            big: true,
            text: "Your house burned down.",
            skipCost: 500000,
            boughtCost: 5000,
          },
        },
      ],
    },
  ],
};

export const N_DECADES = CONFIG.decades.length;

// ---------- small helpers ----------

export function money(n) {
  const v = Math.round(Math.abs(n)).toLocaleString("en-US");
  return (n < 0 ? "−$" : "$") + v;
}
export function signed(n) {
  const v = Math.round(Math.abs(n)).toLocaleString("en-US");
  return (n < 0 ? "−$" : "+$") + v;
}

export function canSave(dec) {
  return dec.make - dec.living;
}

// All offers in play order, each tagged with its decade number.
export function allOffers() {
  const out = [];
  CONFIG.decades.forEach((dec, d) => dec.offers.forEach((o) => out.push({ ...o, d })));
  return out;
}

export function housePlayers() {
  return CONFIG.house.map((h) => ({ id: h.id, name: h.name, house: true, policy: h.policy, joinedDecade: 0 }));
}

// What a player picked in decade d: { offerId: true (bought) | false (skipped) | undefined (never answered) }
// Once a decade is closed its choices are frozen inside the results, so a tap that
// arrives late (a phone that was offline) can't change a decade that was already dealt.
export function picksFor(player, d, choices, results) {
  const dec = CONFIG.decades[d];
  const out = {};
  if (player.house) {
    dec.offers.forEach((o) => (out[o.id] = player.policy === "buy"));
    return out;
  }
  const res = results && results[d];
  const mine = (choices && choices[player.id] && choices[player.id][d]) || {};
  const p = res && res.frozen ? (res.picks && res.picks[player.id]) || {} : mine.picks || {};
  dec.offers.forEach((o) => {
    if (p[o.id] === true || p[o.id] === false) out[o.id] = p[o.id];
  });
  return out;
}

export function yearlySaved(dec, picks) {
  let y = canSave(dec);
  dec.offers.forEach((o) => {
    if (picks[o.id] === true) y -= o.premium;
  });
  return y;
}

function decadeResult(results, d) {
  return (results && results[d]) || null;
}

function hitsFor(results, d, pid) {
  const r = decadeResult(results, d);
  return (r && r.hits && r.hits[pid]) || {};
}

export function hadBigDisaster(pid, results, beforeDecade) {
  for (let d = 0; d < beforeDecade; d++) {
    const h = hitsFor(results, d, pid);
    for (const o of CONFIG.decades[d].offers) if (o.event.big && h[o.event.id]) return true;
  }
  return false;
}

// ---------- scoring ----------
// Works out one player's whole history through the first `closed` decades.
// state = { choices, results }
export function scorePlayer(player, state, closed) {
  const { choices, results } = state;
  let savings = 0;
  let paidIn = 0;
  let gotBack = 0;
  let everInDebt = false;
  const decades = [];

  for (let d = 0; d < closed; d++) {
    const dec = CONFIG.decades[d];
    const res = decadeResult(results, d);
    const row = { d, key: dec.key, endAge: dec.endAge, status: "played", picks: {}, noAnswer: [], events: [], interest: 0, yearly: 0, saved: 0, premiums: 0 };

    // Debt costs extra: what you owe at the start of a decade doubles over it.
    if (savings < 0) {
      row.interest = savings; // a negative number
      savings += row.interest;
    }

    if (res && res.skipped) {
      // Chris skipped this decade: it passes quietly for everyone.
      row.status = "skipped";
      row.yearly = canSave(dec);
      row.saved = row.yearly * CONFIG.years;
    } else if (!player.house && (player.joinedDecade || 0) > d) {
      // Joined late: treated as having bought everything, with no disaster.
      row.status = "beforeJoin";
      dec.offers.forEach((o) => {
        row.picks[o.id] = true;
        row.premiums += o.premium * CONFIG.years;
      });
      row.yearly = yearlySaved(dec, row.picks);
      row.saved = row.yearly * CONFIG.years;
    } else {
      row.picks = picksFor(player, d, choices, results);
      // An offer a student never answered counts as bought (the cautious default), so
      // doing nothing can't put anyone at the top of the board. They are never dealt a disaster.
      row.noAnswer = [];
      dec.offers.forEach((o) => {
        if (row.picks[o.id] !== true && row.picks[o.id] !== false) {
          row.picks[o.id] = true;
          row.noAnswer.push(o.id);
        }
      });
      row.yearly = yearlySaved(dec, row.picks);
      row.saved = row.yearly * CONFIG.years;
      const hits = hitsFor(results, d, player.id);
      dec.offers.forEach((o) => {
        const bought = row.picks[o.id] === true;
        if (bought) row.premiums += o.premium * CONFIG.years;
        if (hits[o.event.id]) {
          const cost = bought ? o.event.boughtCost : o.event.skipCost;
          const insurerPaid = bought ? o.event.skipCost - o.event.boughtCost : 0;
          row.events.push({ id: o.event.id, big: !!o.event.big, text: o.event.text, bought, cost, insurerPaid, fullCost: o.event.skipCost });
          gotBack += insurerPaid;
        }
      });
    }

    paidIn += row.premiums;
    savings += row.saved;
    row.events.forEach((e) => (savings -= e.cost));
    row.end = savings;
    if (savings < 0) everInDebt = true;
    decades.push(row);
  }

  return { id: player.id, name: player.name, house: !!player.house, savings, paidIn, gotBack, everInDebt, decades };
}

export function activePlayers(players) {
  return Object.entries(players || {})
    .filter(([, p]) => p && !p.removed && p.name)
    .map(([id, p]) => ({ id, ...p, name: String(p.name).slice(0, 16) }));
}

// The answered choices of everyone present in decade d, to be stored when the decade closes.
export function freezePicks(d, players, choices) {
  const out = {};
  activePlayers(players)
    .filter((p) => (p.joinedDecade || 0) <= d)
    .forEach((p) => {
      const picks = picksFor(p, d, choices);
      if (Object.keys(picks).length) out[p.id] = picks;
    });
  return out;
}

// Everyone on the board, students and house, scored and sorted from most to least.
export function leaderboard(players, state, closed) {
  const everyone = [...activePlayers(players), ...housePlayers()];
  return everyone
    .map((p) => scorePlayer(p, state, closed))
    .sort((a, b) => b.savings - a.savings || a.name.localeCompare(b.name));
}

// What the class as a whole paid in and got back (students only, not the house).
export function classTotals(board) {
  let paidIn = 0;
  let gotBack = 0;
  board.filter((r) => !r.house).forEach((r) => {
    paidIn += r.paidIn;
    gotBack += r.gotBack;
  });
  return { paidIn, gotBack, kept: paidIn - gotBack };
}

// ---------- dealing the disasters ----------
// Called once when Chris closes a decade. Returns { playerId: { eventId: true } }.
// Each big disaster lands on exactly two rows: one who bought and one who skipped.
// A student who already had a big disaster is left alone. If no student bought (or
// no student skipped), a house player takes that side instead.
export function dealDecade(d, players, choices, results, rng = Math.random) {
  const dec = CONFIG.decades[d];
  const hits = {};
  const mark = (pid, eid) => {
    hits[pid] = hits[pid] || {};
    hits[pid][eid] = true;
  };
  const pick = (arr) => arr[Math.floor(rng() * arr.length)];
  const present = activePlayers(players).filter((p) => (p.joinedDecade || 0) <= d);

  dec.offers.forEach((o) => {
    // Only students who actually answered this offer can be chosen.
    const answered = present.filter((p) => {
      const v = picksFor(p, d, choices)[o.id];
      return v === true || v === false;
    });
    if (o.event.big) {
      const fresh = answered.filter((p) => !hadBigDisaster(p.id, results, d));
      const buyers = fresh.filter((p) => picksFor(p, d, choices)[o.id] === true);
      const skippers = fresh.filter((p) => picksFor(p, d, choices)[o.id] === false);
      mark(buyers.length ? pick(buyers).id : CONFIG.houseBuyerId, o.event.id);
      mark(skippers.length ? pick(skippers).id : CONFIG.houseSkipperId, o.event.id);
    } else {
      const n = Math.ceil(answered.length * (o.event.share || 0.5));
      const pool = answered.slice();
      for (let i = 0; i < n && pool.length; i++) {
        const k = Math.floor(rng() * pool.length);
        mark(pool[k].id, o.event.id);
        pool.splice(k, 1);
      }
    }
  });
  return hits;
}

// Solo mode: one phone on its own, no scoreboard. Odds are turned up the same way.
export function dealSolo(d, picks, alreadyHadBig, rng = Math.random) {
  const dec = CONFIG.decades[d];
  const mine = {};
  dec.offers.forEach((o) => {
    const chance = o.event.big ? (alreadyHadBig ? 0 : 0.12) : o.event.share || 0.5;
    if (rng() < chance) mine[o.event.id] = true;
  });
  return mine;
}

// Which decade a new player starts in, given where the game is.
export function joinDecadeFor(meta) {
  if (!meta || meta.phase === "lobby") return 0;
  if (meta.phase === "open") return meta.decade;
  if (meta.phase === "closed") return meta.decade + 1;
  return N_DECADES;
}

// How many decades are finished, given where the game is.
export function closedCount(meta) {
  if (!meta || meta.phase === "lobby") return 0;
  if (meta.phase === "open") return meta.decade;
  if (meta.phase === "closed") return meta.decade + 1;
  return N_DECADES;
}
