// game.js: the rules and the numbers for the insurance game.
// No browser or network code lives here, so the same file runs on phones, on the
// scoreboard and in the test scripts.
//
// TO CHANGE A NUMBER OR A LINE OF TEXT: edit CONFIG below. Amounts are per year
// unless they are a one-time disaster cost.

export const CONFIG = {
  years: 10, // each round is ten years

  // true: each offer card states what the disaster costs with and without insurance.
  // false: the card only describes what the insurance covers, in words, with no dollar figures.
  showCosts: false,

  // The dashed "goal" line Chris can switch on in the scoreboard's Distribution view.
  goal: 250000,

  // The opening scene, played on the join screen before the 20s. Everyone has the same amount,
  // one person loses all of it, and the class is asked what it would pay not to be that person.
  scene: {
    stake: 50000, // what everyone has, and what the accident costs
    // The framing, shown on the scoreboard and on every phone before the first draw (Chris's words).
    organizer: "Chris", // who runs the pool; named on the outcome screen, in the question and on the covered phone
    setup: "You've worked very hard your entire life so far. You budgeted carefully, you spent less than you earned, and you've managed to save $50,000. You're proud of your hard work and that you've managed to save the beginning of a nice nest egg for you and your loved ones.",
    warning: "Unfortunately, something bad is about to happen to one of you in this room. And we can't say in advance who, exactly, it will be.", // under the framing, on the scoreboard only
    // The disaster is left unnamed on purpose: Chris names the possibilities aloud.
    disaster: "Something bad happened, and it cost you $50,000.", // on the unlucky phone
    // The scoreboard after the round 1 draw: the headline large, the next two lines at one smaller size.
    headline: "And there it is...something bad just happened to one of you.",
    hold: "Hold up your phones. Who was it?",
    board: "Even more unfortunate, that bad thing just wiped out your $50,000 nest egg.",
    // The proposal, on the scoreboard before the question opens: a heading, the offer, then the question in bold.
    offer: [
      "Let's rewind time and let me make you a proposal:",
      "Before anything bad happens to one of us, I want to offer you a chance to avoid losing your entire nest egg. If the bad thing happens to you, I'll pay you $50,000. For providing you this service, though, I expect to collect a fee.",
      "What would you pay me to guarantee that you can keep your $50,000 nest egg even if the bad thing happens to you?",
    ],
    // The scoreboard after the round 2 draw. Nothing else is on that screen.
    again: "Tragedy has struck once again and the bad thing happened.",
    hold2: "Hold up your phones. Who was it this time?",
    // The outcome screen: this heading over a table of what is left of each nest egg, without and with insurance.
    outcome: "The same tragedy struck our class, but with a very different outcome.",
    // The takeaway screen. The definition is a DRAFT until Chris settles it; the terms are his.
    takeaway: "Congratulations, you just invented insurance.",
    definition: "Insurance: you pay a small, certain fee so that someone else pays if a large, uncertain loss happens to you.",
    terms: [
      ["Policy", "an insurance contract"],
      ["Policyholder", "the buyer of insurance"],
      ["Coverage", "the protection provided by a policy"],
      ["Insured", "the person who bought insurance"],
    ],
    margin: 0.2, // the "even split plus" button adds this much on top of the even split
    prompt: "What would you pay Chris to guarantee that you can keep your $50,000 nest egg even if the bad thing happens to you?", // on the phones and over the answers
  },

  // Who sits on the board besides the students.
  house: [
    { id: "house_buy", name: "Jordan", policy: "buy" }, // always buys
    { id: "house_skip", name: "Stella", policy: "skip" }, // never buys, and is never hit
    { id: "house_skip2", name: "Tessa", policy: "skip" }, // never buys
  ],
  houseBuyerId: "house_buy", // takes the buyer's disaster when no student bought
  houseSkipperId: "house_skip2", // takes the skipper's disaster when no student skipped

  decades: [
    {
      key: "20s",
      title: "Your 20s",
      endAge: 30,
      intro: "You're 20 years old and you've just moved out and you're living on your own. You have a decent job that covers your taxes and living expenses, but your job doesn't provide health insurance, and you no longer qualify for your parents' health insurance due to a change in the law.",
      payLabel: "You make",
      make: 50000,
      living: 45000,
      // The paragraph between the pay numbers and the choices: what is already paid, then what is left to decide.
      already: "Since car insurance is required by law, you already pay monthly to insure your driving. But you have a couple of other choices to make when it comes to insurance in your 20s.",
      offers: [
        {
          id: "health",
          short: "Health",
          noun: "health insurance",
          name: "Health insurance",
          premium: 3000,
          plain: "Covers you if you have a serious accident or illness.",
          without: "Without it, a serious accident could cost $75,000.",
          withIt: "With it, your share would be about $10,000.",
          event: {
            id: "accident",
            big: true,
            text: "A serious accident: surgery and a week in the hospital.",
            happened: "A serious accident happened to two people",
            had: "had the accident",
            short: "Accident", // the word used on the scoreboard's column heading and row tags
            bill: "The hospital bill", // first line of the receipt
            ownNote: "their plan's out-of-pocket limit", // explains the insured person's share
            skipCost: 75000,
            boughtCost: 10000,
          },
        },
        {
          id: "phone",
          short: "Phone",
          name: "Phone protection",
          premium: 150,
          plain: "Covers a broken or lost phone.",
          without: "Without it, a broken phone costs about $800.",
          withIt: "With it, about $100.",
          event: {
            id: "phone",
            big: false,
            share: 0.5, // lands on this share of the class
            text: "Your phone broke.",
            short: "Phone",
            tally: "phones broke", // used on the summary: "11 phones broke."
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
      intro: "Welcome to your 30s, you have a partner now, and the two of you bought a home. Health insurance is now provided through your employer.",
      payLabel: "Together you make",
      make: 70000,
      living: 62000,
      already: "Once again, car insurance is required by law, and you already pay for it monthly. Now that you're a homeowner, your lender requires homeowners insurance, which you also pay for. Both are included in taxes and living above. You have one other insurance decision to make in your 30s: would you like disability insurance or not?",
      offers: [
        {
          id: "disability",
          short: "Disability",
          noun: "disability insurance",
          name: "Disability insurance",
          premium: 1500,
          plain: "Replaces part of your pay if an illness or injury keeps you from working.",
          without: "Without it, five years unable to work would cost $200,000 in lost pay.",
          withIt: "With it, you would still lose about $80,000.",
          event: {
            id: "disability",
            big: true,
            text: "A serious injury: you couldn't work for five years.",
            happened: "Two people couldn't work for five years",
            had: "couldn't work",
            short: "Couldn't work",
            bill: "Five years of lost pay",
            paidNote: "60% of their pay",
            ownVerb: "missed out on", // the insured person's share is pay that never came, not a bill they paid
            ownTail: " of pay",
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
      intro: "Welcome to your 40s, you're still partnered, but now you have two kids that depend on you.",
      payLabel: "Together you make",
      make: 90000,
      living: 78000,
      already: "You still have health insurance through work. Car and homeowners insurance are still required, and you still pay for both. You have one other insurance choice to make in your 40s: do you want to purchase life insurance for you and your partner?",
      offers: [
        {
          id: "life",
          short: "Life",
          noun: "life insurance",
          name: "Life insurance on you and your partner",
          premium: 1200,
          plain: "Pays the surviving partner if either of you dies.",
          without: "Without it, losing your partner would mean losing $500,000 of income.",
          withIt: "With it, the policy replaces that income.",
          event: {
            id: "partner",
            big: true,
            text: "Your partner died. The household lost that income.",
            happened: "Two people lost their partner",
            had: "lost their partner",
            short: "Partner died",
            bill: "The income the household lost",
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
      intro: "Welcome to your 50s. Congratulations, your mortgage is paid off! And for the first time, nobody requires that you insure your house.",
      payLabel: "Together you make",
      make: 100000,
      living: 84000,
      already: "You still have health insurance through work. Car insurance is still required by law, and you still pay for it. Taxes and living above no longer include homeowners insurance. You have another insurance choice to make in your 50s: do you want to continue to pay for homeowners insurance or not?",
      offers: [
        {
          id: "home",
          short: "Home",
          noun: "homeowners insurance",
          name: "Homeowners insurance",
          premium: 1500,
          plain: "Pays to repair or rebuild your house after things like a fire, a storm, a burst pipe or a break-in.",
          without: "Without it, a house fire would cost $500,000.",
          withIt: "With it, your share would be about $5,000.",
          event: {
            id: "fire",
            big: true,
            text: "Your house burned down.",
            happened: "Two people's houses burned down",
            had: "had the fire",
            short: "Fire",
            bill: "The cost to rebuild",
            ownNote: "the deductible",
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
          row.events.push({ id: o.event.id, big: !!o.event.big, text: o.event.text, short: o.event.short || "", bill: o.event.bill || "", paidNote: o.event.paidNote || "", ownNote: o.event.ownNote || "", ownVerb: o.event.ownVerb || "paid", ownTail: o.event.ownTail || "", bought, cost, insurerPaid, fullCost: o.event.skipCost });
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
// With unlucky = true (the instructor's demo link) nothing is left to chance for the big
// disasters: the first big insurance you skip is the one that hits, and no other big one does.
export function dealSolo(d, picks, alreadyHadBig, rng = Math.random, unlucky = false) {
  const dec = CONFIG.decades[d];
  const mine = {};
  dec.offers.forEach((o) => {
    if (unlucky && o.event.big) {
      if (!alreadyHadBig && picks[o.id] === false) mine[o.event.id] = true;
      return;
    }
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
