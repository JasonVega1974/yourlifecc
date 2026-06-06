/* =============================================================
   money-lessons.js — Tab 2 Money / Learn sub-tab content
                      (8 financial-literacy lessons for teens)
============================================================= */
//
// Lesson 5 (Taxes, TY2025) lives as STATIC HTML inside index.html
// because it carries the calcTax() interactive widget and ~220
// lines of layout that pre-date this template system. It's
// intentionally OMITTED from MONEY_LESSONS — the renderer routes
// lesson 5 to the static panel instead.
//
// Each lesson object renders through _renderLearnLesson() in
// finance.js. Field semantics:
//
//   num          1..8 (the lesson number, used for routing + UI)
//   title        Title shown on the card AND inside the lesson page
//   icon         Single emoji prefixing the title
//   readMinutes  Estimated read time. Honest — most are 2-3 min.
//   hook         1-2 sentences. Teen scenario or contrarian framing.
//                NOT preachy — talks to the reader, not at them.
//   conceptHtml  Core idea. ≤3 short paragraphs.
//   exampleHtml  Worked example with REAL numbers. The single most
//                important field — abstract concept lands when it's
//                multiplied by a dollar amount the teen recognizes.
//   takeaway     One sentence. The thing they'll remember in 3
//                months when they're holding a paycheck.
//   tryThis      Concrete next step the reader can do TODAY. Often
//                routes back into the app (Tab 2 sub-tabs).
//   faithFrame   Optional. Only included where stewardship lands
//                naturally (Tithe category exists in MONEY_CAT_EMOJI,
//                so faith and finance are already connected in the
//                app's data model). NEVER bolted on.
//
// The lesson voice across all 7: someone who actually cares about
// this generation, not a textbook. Specific. Honest about money
// being trade-offs. Doesn't dunk on teens for not knowing.

const MONEY_LESSONS = [

  // ─── Lesson 1 ─────────────────────────────────────────────────
  {
    num: 1,
    title: 'What money actually is',
    icon: '💵',
    readMinutes: 3,
    hook: 'You just got $40 mowing two lawns. So what is that $40 actually worth — and what did it cost you to get it?',
    conceptHtml:
      '<p>Money is a stand-in for <b>time and effort</b>. Every dollar you earn cost you something — minutes mowing, hours stocking shelves, brain cells on a tutoring gig. Every dollar you spend buys time + effort from someone else.</p>' +
      '<p>The unfair advantage you have at 14: your time is the <em>least</em> valuable it\'ll ever be financially (small allowance, no real job history) — but it\'s the <b>most</b> valuable for one thing: letting money grow. A dollar saved at 14 has 60+ years to multiply. A dollar saved at 40 has 25.</p>' +
      '<p>The first job of money is to teach you what your time is worth — and to make you weigh trade-offs you didn\'t know you were making.</p>',
    exampleHtml:
      '<p>Compare two summer gigs for the same 14-year-old:</p>' +
      '<ul>' +
        '<li><b>Job A — Lifeguard.</b> 20 hrs/week @ $15/hr. Gross: $300/week. After ~22% withheld for taxes: <b>~$234/week take-home</b>. Predictable, boss to deal with, looks good on a resume.</li>' +
        '<li><b>Job B — Mowing.</b> 5 lawns/week, ~7.5 hrs total, $25/lawn. Gross: $125/week. No withholding — but you owe ~$25 at tax time. Flexible, no boss, builds nothing on a resume.</li>' +
      '</ul>' +
      '<p>Job A pays more per hour. Job B pays less per hour but is flexible. The "right" pick depends on what you value: <b>money, flexibility, experience, or time</b>. There is no correct answer — only trade-offs you make on purpose.</p>',
    takeaway: 'Money is stored time. How you trade it shapes the next decade of your life.',
    tryThis: 'For the next $50 you receive (allowance, gift, gig), pause for 24 hours before spending any of it. Notice what you almost bought and didn\'t.',
    faithFrame: 'Money is a tool, not the goal. Proverbs 23:4 — "Do not wear yourself out to get rich." The point of getting good with money early isn\'t accumulation; it\'s freedom to live and give generously when it matters.'
  },

  // ─── Lesson 2 ─────────────────────────────────────────────────
  {
    num: 2,
    title: 'The budget rule (50 / 30 / 20)',
    icon: '📋',
    readMinutes: 3,
    hook: 'When my friend got his first $400 paycheck, he spent $380 on a controller, snacks, and Uber Eats. The other $20 disappeared somehow. We\'re going to make sure that doesn\'t happen to you.',
    conceptHtml:
      '<p>The 50/30/20 rule splits every dollar you earn into three buckets:</p>' +
      '<ul>' +
        '<li><b>50% Needs</b> — stuff you literally can\'t skip. Phone bill if you pay it. Gas. Lunches. School supplies.</li>' +
        '<li><b>30% Wants</b> — fun stuff. Friday night out, games, clothes you don\'t need, concert tickets.</li>' +
        '<li><b>20% Savings</b> — pay yourself <em>first</em>, before you see the money in your spending account.</li>' +
      '</ul>' +
      '<p>For a teen with no rent or phone bill, "Needs" might be near zero. That\'s fine — slide the extra into savings. The percentages are a starting frame, not a prison.</p>' +
      '<p>The non-negotiable: <b>the 20% leaves your spending account BEFORE you decide what to do with it.</b> Otherwise it disappears.</p>',
    exampleHtml:
      '<p>You earn $400/month (allowance + one babysitting gig per week):</p>' +
      '<ul>' +
        '<li>50% Needs = <b>$200</b> (gas + lunches out + phone if you pay it)</li>' +
        '<li>30% Wants = <b>$120</b> (Friday night + new shoes + a game)</li>' +
        '<li>20% Savings = <b>$80</b> (auto-transferred to savings the day allowance hits)</li>' +
      '</ul>' +
      '<p>After 12 months: <b>$960</b> saved. After 4 years of the same habit: <b>$3,840</b> — before any interest. If that $80/month went into a high-yield savings account at 4.5%, you\'d have closer to <b>$4,200</b>.</p>',
    takeaway: 'It is not how much you make — it is how much you keep. Pay yourself first.',
    tryThis: 'Open the Money tab → Budget sub-tab → punch in your real monthly income. See what 20% looks like in dollars for YOU.',
    faithFrame: null
  },

  // ─── Lesson 3 ─────────────────────────────────────────────────
  {
    num: 3,
    title: 'Saving with purpose',
    icon: '🎯',
    readMinutes: 2,
    hook: 'Saving for nothing is hard. Saving for the bike you\'ve wanted for 6 months is easy. The trick is matching every dollar you save to a goal you actually care about.',
    conceptHtml:
      '<p>There are three types of savings, in priority order:</p>' +
      '<ol>' +
        '<li><b>Emergency fund</b> — boring but critical. 1-3 months of basic expenses, sitting in a savings account, doing nothing fun. Untouched unless something breaks.</li>' +
        '<li><b>Specific goals</b> — that car. That concert. That trip. <em>Name them.</em> Put a photo on your phone lock screen. Saving for "stuff" is hard; saving for THAT specific stuff is way easier.</li>' +
        '<li><b>Long-term wealth</b> — Roth IRA, brokerage, index funds. We cover this in Lesson 8.</li>' +
      '</ol>' +
      '<p>The order matters. Don\'t start investing $50/month in stocks if a flat tire would wreck you. Emergency first, then goals, then long-term.</p>',
    exampleHtml:
      '<p>You want a $600 phone in 6 months:</p>' +
      '<ul>' +
        '<li>$600 ÷ 6 months = <b>$100/month savings</b></li>' +
        '<li>$100 ÷ 4 weeks = <b>$25/week</b> — that\'s one less DoorDash order</li>' +
        '<li>After 6 months: phone in cash, no loan from a parent, no payment plan, no interest</li>' +
      '</ul>' +
      '<p>The phone wasn\'t the win. The win was learning that a clear number + a clear deadline beats willpower every time.</p>',
    takeaway: 'A specific goal makes saving emotional. Emotion beats willpower every time.',
    tryThis: 'Money tab → Goals sub-tab → make ONE savings goal with a real number and a real target date. Watch the progress ring fill.',
    faithFrame: 'Saving for a goal is also stewardship — it means you\'re intentional about money rather than reactive. The Tithe category in this app exists for the same reason: giving on purpose, before there\'s nothing left to give.'
  },

  // ─── Lesson 4 ─────────────────────────────────────────────────
  {
    num: 4,
    title: 'Getting paid',
    icon: '💼',
    readMinutes: 3,
    hook: 'Your first "real" paycheck will be smaller than you expect. Like noticeably smaller. Here\'s why — and how to plan around it so the first one doesn\'t blindside you.',
    conceptHtml:
      '<p>Different income types have different rules:</p>' +
      '<ul>' +
        '<li><b>Allowance</b> — no taxes. Your parents already paid them.</li>' +
        '<li><b>W-2 job</b> (cashier, lifeguard, anyone with a real employer) — federal + state + FICA (Social Security + Medicare) come out automatically. You see about 70-85% of your gross pay.</li>' +
        '<li><b>1099 / freelance</b> (DJing, mowing, tutoring for cash, GrubHub) — NO withholding. You get the full amount, but YOU owe ~25-30% to the IRS at tax time.</li>' +
        '<li><b>Tips</b> — counts as taxable income, even when it\'s cash. The IRS knows about average tip rates by industry.</li>' +
      '</ul>' +
      '<p>The big mistake: spending all your 1099 income as it comes in, then owing taxes you don\'t have. The fix is mechanical — set aside 25% of every cash gig <em>the minute</em> you get paid.</p>',
    exampleHtml:
      '<p>You mow lawns for $400/month over the summer (1099 income):</p>' +
      '<ul>' +
        '<li>25% goes to a "tax jar" savings account = <b>$100/month</b></li>' +
        '<li>You spend or save the remaining <b>$300/month</b> as if it were normal income</li>' +
        '<li>April rolls around — you owe ~$1,000 in taxes for the year. You have <b>$1,200 already set aside.</b> Pay it. Smile.</li>' +
      '</ul>' +
      '<p>The Paycheck simulator in the Money tab shows you exactly what a W-2 paycheck looks like. Punch in $15/hour and 20 hours/week — your real take-home will surprise you, but at least it won\'t shock you.</p>',
    takeaway: '1099 income LOOKS bigger than W-2 — but you just haven\'t paid the tax yet. Set 25% aside on day one.',
    tryThis: 'Money tab → Paycheck simulator → punch in your hourly rate (or a hypothetical one) and see the breakdown of gross → take-home.',
    faithFrame: null
  },

  // ─── Lesson 5 ─────────────────────────────────────────────────
  // Lives as static HTML in index.html (#mzLearnLesson5Static).
  // The renderer routes lesson 5 to that container instead of
  // building from this array, so there's nothing to put here.

  // ─── Lesson 6 ─────────────────────────────────────────────────
  {
    num: 6,
    title: 'Banking 101',
    icon: '🏦',
    readMinutes: 3,
    hook: 'Your money in a sock drawer earns nothing. Your money in a normal checking account also earns nothing. We\'re going to fix both of those.',
    conceptHtml:
      '<p>Three accounts to know:</p>' +
      '<ul>' +
        '<li><b>Checking</b> — for money you\'ll spend in the next 30 days. Debit card. Almost zero interest.</li>' +
        '<li><b>Savings</b> — for money you won\'t touch for 6+ months. Limited withdrawals per month. Some interest, usually tiny.</li>' +
        '<li><b>High-yield savings (HYSA)</b> — same as savings but at an <em>online</em> bank. 4-5% interest as of 2025-2026. The single biggest piece of free money you can claim.</li>' +
      '</ul>' +
      '<p>Banks make money two ways: <b>fees</b> (avoid these) and <b>lending your money to other people at higher interest than they pay you</b>. The HYSA-vs-regular-savings gap exists because online banks have lower costs and pass some of that savings to you.</p>' +
      '<p>Fees to watch:</p>' +
      '<ul>' +
        '<li><b>Monthly maintenance</b> — $5-15/month if your balance drops below a threshold. Avoid by keeping the threshold.</li>' +
        '<li><b>Overdraft</b> — $30-35 per swipe when balance is negative. Avoid by checking your balance.</li>' +
        '<li><b>Out-of-network ATM</b> — $2-5 per withdrawal. Avoid by planning.</li>' +
      '</ul>',
    exampleHtml:
      '<p>Same $2,000, two different homes for it:</p>' +
      '<ul>' +
        '<li>Regular savings at 0.4% → <b>$8/year</b> earned</li>' +
        '<li>HYSA at 4.5% → <b>$90/year</b> earned</li>' +
      '</ul>' +
      '<p>That\'s $82 of free money for a 30-minute account switch. On the same money. Doing the same nothing.</p>',
    takeaway: 'Don\'t store wealth where it earns nothing. The 30-minute task of opening a HYSA is worth $80+/year for every $2,000 you save.',
    tryThis: 'Search "best high-yield savings accounts 2026" — Ally, Marcus, Discover, Wealthfront, SoFi are usually in the mix. Compare to what your current bank pays. Ask a parent to help open one (custodial under 18).',
    faithFrame: null
  },

  // ─── Lesson 7 ─────────────────────────────────────────────────
  {
    num: 7,
    title: 'Credit and debt',
    icon: '💳',
    readMinutes: 3,
    hook: 'Credit cards aren\'t free money. They\'re loans that compound against you faster than any investment compounds for you. Once you do the math, you\'ll never carry a balance.',
    conceptHtml:
      '<p>The number to know: <b>APR</b> (Annual Percentage Rate). That\'s the interest rate the credit card charges if you don\'t pay the FULL balance every month.</p>' +
      '<p>Average credit card APR in 2025-2026: <b>22-25%</b>. Some store cards push 30%+.</p>' +
      '<p>The debt trap is mechanical: carry a balance one month → pay interest the next month → balance grows → minimum payment barely covers the interest → repeat forever.</p>' +
      '<p>The average American carries ~$6,500 in credit card debt. At 24% APR, that\'s <b>~$130/month in interest alone</b>. $1,560/year just to borrow.</p>' +
      '<p>Good debt vs bad debt:</p>' +
      '<ul>' +
        '<li><b>Good</b> — low interest (under 7%), buys something that grows or compounds (mortgage, student loans with a real degree, business loans). Use carefully.</li>' +
        '<li><b>Bad</b> — high interest (15%+), buys something that loses value (credit cards, payday loans, financing a depreciating car). Avoid.</li>' +
      '</ul>',
    exampleHtml:
      '<p>$1,200 spring break trip. Two ways to pay:</p>' +
      '<ul>' +
        '<li><b>Option A — Credit card.</b> Pay $50/month at 24% APR. Total time to pay off: <b>33 months</b>. Total interest: <b>~$451</b>. You pay $1,651 for a $1,200 trip.</li>' +
        '<li><b>Option B — Save first.</b> $300/month for 4 months → cash, $0 interest, $1,200 trip costs $1,200.</li>' +
      '</ul>' +
      '<p>Same trip. Option A costs $451 more <em>for nothing</em> except the privilege of having it 4 months sooner. (Open the What-If simulator in the Goals sub-tab to confirm the math.)</p>',
    takeaway: 'When you eventually get a credit card (for credit-score reasons), use it only for things you\'d buy in cash. Pay it OFF every month. The card is a tool, not a loan.',
    tryThis: 'Money tab → Transactions sub-tab → if you ever pay credit card interest, log it as an expense category. Watching the dollars accumulate is the cure.',
    faithFrame: null
  },

  // ─── Lesson 8 ─────────────────────────────────────────────────
  {
    num: 8,
    title: 'Investing basics',
    icon: '🌱',
    readMinutes: 4,
    hook: 'Compound interest is the closest thing to magic in finance. The only catch: it needs TIME. You have something every adult investor desperately wishes they had — 60+ years of runway.',
    conceptHtml:
      '<p><b>Compound interest</b> = interest earning interest. Your money makes money, and that money makes more money, and that money makes more money. After about 20 years, the growth becomes ridiculous.</p>' +
      '<p>Average S&amp;P 500 return (US stock market index) over 30+ years: <b>~10% per year</b>. Some years up 25%, some down 20%, but the long average is around 10%.</p>' +
      '<p><b>The Roth IRA</b> is your secret weapon at 14:</p>' +
      '<ul>' +
        '<li>It\'s a retirement account, but the rules favor teens.</li>' +
        '<li>You pay tax NOW (you\'re in a low tax bracket as a teen — perfect time).</li>' +
        '<li>All the growth AND all the withdrawals later are <b>tax-free, forever</b>.</li>' +
        '<li>2025 contribution limit: $7,000/year, capped at your earned income.</li>' +
        '<li>Translation: if you earn $3,000 from a summer job, you can put up to $3,000 in a Roth IRA. Allowance doesn\'t count — must be earned income.</li>' +
      '</ul>',
    exampleHtml:
      '<p>The killer example. Two people, same return rate, very different timelines:</p>' +
      '<ul>' +
        '<li><b>Person A</b>: Invests $200/month for just 10 years (age 16 → 26), then STOPS forever. Total invested: <b>$24,000</b>.</li>' +
        '<li><b>Person B</b>: Invests $200/month for 39 years (age 26 → 65). Total invested: <b>$93,600</b>.</li>' +
      '</ul>' +
      '<p>At a 10% average annual return (S&amp;P 500 historical, compounded monthly), at age 65:</p>' +
      '<ul>' +
        '<li>Person A ends with <b>~$2.0M</b></li>' +
        '<li>Person B ends with <b>~$1.14M</b></li>' +
      '</ul>' +
      '<p>Person A invested <em>about a quarter</em> of what Person B did and ended with NEARLY DOUBLE the money — because Person A had <b>50 years of compounding</b> and Person B only had 39. Time, not the dollar amount, did most of the work.</p>' +
      '<p>(Open the What-If simulator in the Goals sub-tab and punch in $200/month, 10% rate, 10 years contributing, 39 years growing — it produces these exact numbers.)</p>',
    takeaway: 'The dollars you invest at 14-18 are worth 5-10x what the same dollars are worth at 30. The most valuable thing you own right now is not money — it is runway.',
    tryThis:
      '<b>1.</b> Ask a parent to help you open a custodial Roth IRA at Fidelity, Schwab, or Vanguard. Free, online, ~30 minutes.<br>' +
      '<b>2.</b> Set up a $25/month auto-investment into a low-cost S&amp;P 500 index fund (ticker VOO, FXAIX, SWPPX, or similar — they all track the same index).<br>' +
      '<b>3.</b> Forget about it for 50 years. Seriously.',
    faithFrame: 'Compound interest is one of the gifts of the world we\'ve been given to steward. The Parable of the Talents (Matthew 25:14-30) is literally about multiplying what you\'ve been entrusted with — Jesus tells the story with money on purpose. Wise stewardship + a 50-year time horizon does extraordinary things.'
  }
];

// Expose globally so finance.js's renderer can find it. The data
// file loads BEFORE the feature modules per the script order in
// index.html (see <script src="/app/js/data/money-lessons.js">
// adjacent to the other data/*.js entries).
if(typeof window !== 'undefined'){
  window.MONEY_LESSONS = MONEY_LESSONS;
}
