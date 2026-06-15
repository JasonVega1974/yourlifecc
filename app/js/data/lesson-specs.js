/* =============================================================
   lesson-specs.js — hand-authored block specs for the Life-Skills
   Academy redesign. Consumed by lesson-renderer.js; routed from
   openSkillCategory() in skills.js ONLY for categories present here
   (isolation — every other category stays on the legacy accordion).

   First module: taxes (proof of the spec-driven format). SK_DATA in
   skills.js is left untouched; this is a parallel, opt-in source.

   Block schema: see lesson-renderer.js header.
   ============================================================= */

const SK_SPECS = {
  taxes: {
    key: 'taxes',
    color: '#fbbf24',
    lessons: [
      // ── L1 — What Is Income Tax ──────────────────────────────
      {
        id: 'taxes-1',
        title: 'What Is Income Tax — And Why Everyone Must Understand It',
        duration: '6 min',
        blocks: [
          { type:'lead', text:"Income tax is the slice of your earnings that federal and state governments collect to fund roads, schools, the military, and Social Security. It is not optional and not negotiable — and it is one of the most consequential systems you will deal with your entire working life. Yet most people navigate it blindly: overpaying every year, or getting blindsided by a surprise bill." },
          { type:'keyIdea', title:'Progressive ≠ your top rate on everything', text:"The U.S. uses a progressive system. You pay each rate only on the slice of income that falls inside that bracket — never your highest rate on all of it. This is the single most misunderstood idea in personal finance." },
          { type:'viz', kind:'taxBrackets', data:{ status:'single' } },
          { type:'widget', kind:'taxCalculator', config:{ income:60000, status:'single' } },
          { type:'keyIdea', title:'Marginal vs. effective rate', text:"Your marginal rate is the top bracket you reach. Your effective rate is your real average across all your income — always meaningfully lower. That is why turning down a raise to 'avoid a higher bracket' is always a mistake: more income is always more money in your pocket." },
          { type:'takeaways', items:[
            "Tax is not optional — but the code rewards the people who understand it.",
            "You pay each rate only on the income inside that bracket.",
            "Your effective rate is always lower than your marginal rate.",
            "Deductions, credits, and tax-advantaged accounts are legal tools to pay less."
          ] },
          { type:'tip', text:"Every dollar you put into a Traditional 401(k) or IRA reduces your taxable income at your marginal rate. In the 22% bracket, a $5,000 contribution saves $1,100 in taxes immediately — the government is effectively subsidizing your retirement savings." },
          { type:'check', q:"You get a raise that moves part of your income into the 22% bracket. What happens to your take-home pay?", opts:[
            "It drops — the 22% now applies to all my income",
            "It rises — only the income above the threshold is taxed at 22%",
            "It stays exactly the same",
            "I should turn the raise down"
          ], ans:1, explain:"Only the slice above the threshold is taxed at the higher rate, so more income always means more take-home pay." }
        ]
      },

      // ── L2 — W-2 vs 1099 ─────────────────────────────────────
      {
        id: 'taxes-2',
        title: 'W-2 vs. 1099 — Employee or Self-Employed',
        duration: '6 min',
        blocks: [
          { type:'lead', text:"This one distinction decides how much you owe, when you owe it, and how much of every payment you should never touch. Getting it wrong is not just a surprise bill — it is penalties, interest, and a cash crunch at the worst possible time." },
          { type:'compare',
            left:{ title:'W-2 — Employee', points:[
              "Employer withholds federal + state income tax for you",
              "Social Security (6.2%) and Medicare (1.45%) withheld automatically",
              "You get a W-2 each January showing wages + everything withheld",
              "At filing you usually get a refund or owe a small amount"
            ] },
            right:{ title:'1099 — Self-employed', points:[
              "You get a 1099 if a payer gave you $600+; nothing is withheld",
              "You receive 100% of the payment and owe 100% of the taxes",
              "Self-employment tax of 15.3% on top of income tax",
              "Taxes are due quarterly, not just in April"
            ] } },
          { type:'keyIdea', title:'Self-employment tax: 15.3%', text:"As an employee your employer pays half of Social Security + Medicare. Self-employed, you pay the full 15.3% — on 92.35% of your net income, before income tax even applies." },
          { type:'stat', items:[
            { value:'$1,413', label:'SE tax alone on $10,000 freelance' },
            { value:'28–30%', label:'set aside per payment' },
            { value:'4×/yr', label:'quarterly deadlines' }
          ] },
          { type:'list', style:'check', items:[
            { strong:'Quarterly estimated taxes:', text:"due Apr 15, Jun 15, Sep 15, and Jan 15 — miss them and you owe an underpayment penalty even if you pay in full at filing." }
          ] },
          { type:'takeaways', items:[
            "W-2 income is withheld for you; 1099 income is not — you owe it all.",
            "Budget for self-employment tax (15.3%) before income tax.",
            "Self-employed means paying quarterly, not once a year."
          ] },
          { type:'tip', text:"The moment you start any self-employed income — gigs, freelance, Etsy, contract work — open a dedicated savings account and transfer 28–30% of every payment in immediately. Treat it as already spent. It belongs to the IRS, not you." },
          { type:'check', q:"You earn $10,000 as a 1099 contractor. Before income tax, what do you already owe?", opts:[
            "Nothing until April",
            "About $1,413 in self-employment tax",
            "Exactly 10%",
            "Only state tax"
          ], ans:1, explain:"$10,000 × 92.35% × 15.3% ≈ $1,413 in self-employment tax — before any income tax is added." }
        ]
      },

      // ── L3 — Filing the return ───────────────────────────────
      {
        id: 'taxes-3',
        title: 'Filing Your Taxes — The Complete Annual Process',
        duration: '7 min',
        blocks: [
          { type:'lead', text:"Filing is how you officially report your income and settle up on what you owe. The deadline is April 15 (or the next business day). Here is the whole process, start to finish." },
          { type:'steps', items:[
            { title:'Gather your documents (Jan–Feb)', text:"W-2s and 1099s arrive by Jan 31; 1098s for student-loan and mortgage interest; SSNs for everyone on the return; last year's return for your AGI; receipts for deductions." },
            { title:'Choose a filing method', text:"IRS Free File (free under ~$89k), FreeTaxUSA (free federal, $15 state), TurboTax/H&R Block for hand-holding, or a CPA if you're self-employed or had a big life change." },
            { title:'File electronically with direct deposit', text:"E-file is faster and more accurate; refunds land in 7–14 days vs 6–8 weeks for paper." },
            { title:'If you owe, pay by April 15', text:"Can't pay in full? Pay what you can and set up a plan at IRS.gov/OPA. Failure-to-file (5%/mo) is far worse than failure-to-pay (0.5%/mo) — always file on time." },
            { title:'Need more time? File an extension', text:"Form 4868 gives you until Oct 15 to file — but it is NOT an extension to pay. Estimate and pay by April 15 anyway." }
          ] },
          { type:'takeaways', items:[
            "The hard part is gathering documents — the filing itself is guided.",
            "E-file + direct deposit is the fastest, safest path to a refund.",
            "Always file on time, even if you can't pay in full."
          ] },
          { type:'tip', text:"After filing, save a PDF of the complete return and every supporting document for at least 7 years. The IRS can audit 3 years back (6 for substantial underreporting). Cloud storage is perfect." },
          { type:'check', q:"You can't pay your full bill by April 15. What's the smartest move?", opts:[
            "Don't file until you can pay",
            "File on time, pay what you can, set up a payment plan",
            "Ignore it until the IRS writes to you",
            "File an extension — that delays payment too"
          ], ans:1, explain:"The failure-to-file penalty dwarfs the failure-to-pay penalty, so always file on time and pay what you can." }
        ]
      },

      // ── L4 — Deductions ──────────────────────────────────────
      {
        id: 'taxes-4',
        title: 'Tax Deductions — Every Legal Way to Reduce What You Owe',
        duration: '7 min',
        blocks: [
          { type:'lead', text:"A deduction reduces your taxable income before your rate is applied. In the 22% bracket a $1,000 deduction saves you $220 — real money that compounds once you know every deduction you can take." },
          { type:'keyIdea', title:'Standard vs. itemize — take the bigger one', text:"You pick one or the other. About 90% of people take the standard deduction; only itemize if your specific deductible expenses (mortgage interest, big medical bills, large charitable gifts) add up to more." },
          { type:'stat', items:[
            { value:'$15,750', label:'standard — single (2025)' },
            { value:'$31,500', label:'standard — married jointly' },
            { value:'$23,625', label:'standard — head of household' }
          ] },
          { type:'list', style:'check', items:[
            { strong:'Above-the-line', text:"(these cut your income even if you take the standard deduction): Traditional IRA up to $7,000 · student-loan interest up to $2,500 · HSA up to $4,300/$8,550 · half of self-employment tax · self-employed health premiums · $300 educator expenses." }
          ] },
          { type:'list', style:'bullet', items:[
            { strong:'Self-employed (Schedule C):', text:"business phone + internet, equipment + supplies, software, mileage (70¢/mi in 2025), a dedicated home office, courses + conferences, marketing, business travel, client meals (50%)." }
          ] },
          { type:'takeaways', items:[
            "Compare your itemized total to the standard deduction and take the larger.",
            "Above-the-line deductions stack on top of the standard deduction.",
            "Self-employment unlocks a long list of Schedule C deductions."
          ] },
          { type:'tip', text:"Photograph every business receipt the moment you get it and drop it in one folder (Expensify or a Google Drive folder both work). At year-end those photos translate straight into deductions." },
          { type:'check', q:"Which lowers your taxable income even if you DON'T itemize?", opts:[
            "Mortgage interest",
            "A Traditional IRA contribution (above-the-line)",
            "State and local taxes",
            "Charitable donations"
          ], ans:1, explain:"Above-the-line deductions like a Traditional IRA contribution apply on top of the standard deduction; the others only count if you itemize." }
        ]
      },

      // ── L5 — Credits ─────────────────────────────────────────
      {
        id: 'taxes-5',
        title: 'Tax Credits — Dollar-for-Dollar Reductions',
        duration: '6 min',
        blocks: [
          { type:'lead', text:"Credits are far more valuable than deductions. A deduction shrinks your taxable income; a credit cuts your actual tax bill dollar-for-dollar." },
          { type:'keyIdea', title:'A credit beats a deduction', text:"A $1,000 credit saves you $1,000 no matter your bracket. A $1,000 deduction saves only $220 in the 22% bracket. Always chase credits first." },
          { type:'list', style:'check', items:[
            { strong:'Non-refundable:', text:"can take your tax to $0 but not below." },
            { strong:'Refundable:', text:"can go below $0 — the IRS sends you the difference even if you owed nothing." },
            { strong:'Partially refundable:', text:"a portion comes back, up to a limit." }
          ] },
          { type:'list', style:'bullet', items:[
            { strong:'EITC', text:"— refundable; up to $8,046 (3+ kids). Huge and frequently unclaimed." },
            { strong:'Child Tax Credit', text:"— $2,000/child under 17, up to $1,700 refundable." },
            { strong:'American Opportunity', text:"— up to $2,500/yr for the first 4 college years, 40% refundable." },
            { strong:'Lifetime Learning', text:"— up to $2,000 for any postsecondary or pro development." },
            { strong:"Saver's Credit", text:"— up to $1,000 ($2,000 married) for retirement contributions." },
            { strong:'EV Credit', text:"— up to $7,500 for an eligible electric vehicle." }
          ] },
          { type:'takeaways', items:[
            "Credits cut your bill dollar-for-dollar; deductions only cut taxable income.",
            "Refundable credits can pay you even if you owed nothing.",
            "EITC is the most-missed credit — check if you qualify."
          ] },
          { type:'tip', text:"Run your numbers through quality tax software or a CPA even if your situation feels simple. Eligible filers miss credits — especially the EITC — every year simply because they didn't know they qualified. The software prompts for each one automatically." },
          { type:'check', q:"Which is worth more in the 22% bracket?", opts:[
            "A $1,000 deduction",
            "A $1,000 credit",
            "They're identical",
            "It depends on your state"
          ], ans:1, explain:"The $1,000 credit saves the full $1,000; the $1,000 deduction saves only $220 (22% of $1,000)." }
        ]
      },

      // ── L6 — Smart habits ────────────────────────────────────
      {
        id: 'taxes-6',
        title: 'Smart Tax Habits That Compound Over a Lifetime',
        duration: '6 min',
        blocks: [
          { type:'lead', text:"The gap between someone who understands taxes and someone who doesn't isn't one year's savings — it compounds across an entire working life. These are the habits that separate financially sophisticated people from everyone else." },
          { type:'steps', items:[
            { title:'Tune your W-4 to a near-zero refund', text:"A big refund is just the IRS returning money you overpaid, interest-free. Match your withholding to your real liability with the IRS Withholding Estimator." },
            { title:'Max tax-advantaged accounts first', text:"They cut your taxable income at your marginal rate (or grow tax-free) — see the list below." },
            { title:'Track deductible expenses all year', text:"A 5-minute weekly habit of filing receipts beats an April scramble and is worth hundreds to thousands." },
            { title:'Keep records 7 years', text:"The IRS can audit 3 years back (6 for substantial underreporting). Cloud backup is plenty." },
            { title:'Never ignore IRS mail', text:"Most letters are automated notices, not audits, and are resolvable within 30 days. Open every one the day it arrives." },
            { title:'Get a CPA for complex income', text:"Self-employment, rentals, investments, inherited assets — a good CPA usually saves their fee many times over." }
          ] },
          { type:'list', style:'check', items:[
            { strong:'401(k):', text:"$23,500/yr — pre-tax, cuts taxable income at your marginal rate." },
            { strong:'Traditional IRA:', text:"$7,000/yr — also pre-tax (income limits apply)." },
            { strong:'HSA:', text:"triple tax advantage — pre-tax in, tax-free growth, tax-free medical withdrawals." },
            { strong:'Roth IRA:', text:"after-tax in, tax-free growth, no required withdrawals." }
          ] },
          { type:'takeaways', items:[
            "A near-zero refund means you kept your money all year instead of lending it free.",
            "Tax-advantaged accounts are the highest-leverage move you can make.",
            "Good records + opening IRS mail prevent almost every tax crisis."
          ] },
          { type:'tip', text:"The highest-ROI financial education you can get is understanding how taxes work. Most people leave thousands on the table every year — not through evasion, but through simple ignorance of legal deductions, credits, and strategies." },
          { type:'check', q:"Why is a giant tax refund not actually a win?", opts:[
            "Refunds are taxed again next year",
            "You lent the government your money interest-free all year",
            "It triggers an automatic audit",
            "Refunds reduce your credit score"
          ], ans:1, explain:"A $3,000 refund means you overpaid ~$250/month at 0% interest — money you could have used or invested all year." }
        ]
      }
    ]
  }
};

if(typeof window !== 'undefined'){ window.SK_SPECS = SK_SPECS; }
