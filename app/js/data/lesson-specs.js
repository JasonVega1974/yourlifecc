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
  },

  // ═══════════════════════════════════════════════════════════════════
  // INVESTING & RETIREMENT — hand-elevated (compound-growth + 4%-rule widgets)
  // ═══════════════════════════════════════════════════════════════════
  investing: {
    key: 'investing',
    color: '#10b981',
    lessons: [
      // ── L1 — Why investing matters ───────────────────────────
      {
        id: 'investing-1',
        title: "Why Investing Is the Most Important Financial Skill You'll Ever Learn",
        duration: '6 min',
        blocks: [
          { type:'lead', text:"Most people think investing is for the wealthy or for finance professionals. It isn't. It's for anyone who wants more money in the future than they have today." },
          { type:'keyIdea', title:'Compound growth is your money earning money', text:"Put money to work and it earns more money with no extra effort from you. Your earnings then generate their own earnings — growth on top of growth. It's the closest thing to a financial superpower that exists." },
          { type:'keyIdea', title:'The Rule of 72', text:"Divide 72 by your annual return to see how many years it takes to double your money. At 8% (roughly the S&P 500 average), your money doubles about every 9 years." },
          { type:'widget', kind:'compoundGrowth', config:{ monthly:150, startAge:16, retireAge:65, rate:8 } },
          { type:'keyIdea', title:'A 14-year head start changes everything', text:"Two people each invest $150/month until 65. The one who starts at 16 instead of 30 ends up with roughly three times as much — not from bigger deposits, but from extra years of compounding. Slide the start age in the projector above and watch the total swing." },
          { type:'keyIdea', title:'Not investing is a guaranteed loss', text:"Inflation runs about 3% a year, so cash sitting in a checking account loses purchasing power every year. Staying out isn't playing it safe — it's a slow, guaranteed loss." },
          { type:'takeaways', items:[
            "Compound growth is exponential — earnings earn their own earnings.",
            "Starting young beats contributing more later; time is the biggest lever.",
            "Cash left uninvested quietly loses to inflation every year."
          ] },
          { type:'tip', text:"Time in the market beats timing the market. The best time to start was yesterday; the second best time is today." },
          { type:'check', q:"At an 8% annual return, how long does it take to double your money (Rule of 72)?", opts:["4 years","6 years","9 years","12 years"], ans:2, explain:"72 ÷ 8 = 9 years. The Rule of 72 gives a quick doubling-time estimate for any rate." }
        ]
      },

      // ── L2 — Stocks ──────────────────────────────────────────
      {
        id: 'investing-2',
        title: 'Understanding Stocks — Owning a Piece of Real Companies',
        duration: '6 min',
        blocks: [
          { type:'lead', text:"When you buy a stock, you're buying a small ownership stake in a real company. If that company grows and becomes more valuable, your stake grows with it." },
          { type:'list', style:'check', items:[
            { strong:'Price appreciation:', text:"the share price rises as the company becomes more valuable." },
            { strong:'Dividends:', text:"some companies pay shareholders a slice of profits regularly (Apple, Coca-Cola, Johnson & Johnson)." }
          ] },
          { type:'compare',
            left:{ title:'Individual stocks', points:[
              "Higher risk, higher potential reward",
              "Requires real research",
              "Even most professionals fail to beat the market long-term"
            ] },
            right:{ title:'Index funds', points:[
              "Own a sliver of 500+ companies at once",
              "Lower fees, lower risk",
              "Beat most active traders on average"
            ] } },
          { type:'stat', items:[
            { value:'~10%', label:'S&P 500 avg / yr (100 yrs)' },
            { value:'$5–10', label:'buy fractional shares' },
            { value:'500+', label:'companies in one index fund' }
          ] },
          { type:'keyIdea', title:'The long-term trend is up', text:"The S&P 500 has averaged about 10% a year over a century. There have been crashes — 2008, 2020 — but anyone who stayed invested through them came out ahead." },
          { type:'takeaways', items:[
            "A share is part-ownership: you grow when the company grows.",
            "Index funds beat most stock-pickers thanks to low fees + diversification.",
            "Fractional shares mean you can start with a few dollars."
          ] },
          { type:'tip', text:"Most professional fund managers fail to beat a simple S&P 500 index fund over 10+ years. Simple, boring index investing usually wins." },
          { type:'check', q:"Why do index funds typically outperform most actively managed funds over 10+ years?", opts:["They own only the best stocks","Famous managers run them","Lower fees and broad diversification — most active managers can't consistently beat the market","The government guarantees returns"], ans:2, explain:"After fees, ~80–90% of active managers underperform the index over a decade-plus. Low cost + diversification compound into a big edge." }
        ]
      },

      // ── L3 — Retirement accounts ─────────────────────────────
      {
        id: 'investing-3',
        title: 'Retirement Accounts — Your Greatest Financial Tool',
        duration: '7 min',
        blocks: [
          { type:'lead', text:"A retirement account isn't just a place to save — it's a legal tax shelter that can add hundreds of thousands of dollars to your wealth over a lifetime. Not using one leaves real money on the table." },
          { type:'keyIdea', title:'Employer match = a guaranteed 100% return', text:"If your employer matches 50% of contributions up to 6% of salary, putting in 6% of a $60K salary adds $1,800 of free money. No market investment reliably beats free — never leave it uncollected." },
          { type:'compare',
            left:{ title:'401(k) — via employer', points:[
              "Contributions are pre-tax — lowers your taxable income now",
              "Often comes with an employer match (free money)",
              "2025 limit: $23,500/year"
            ] },
            right:{ title:'Roth IRA — best for the young', points:[
              "After-tax in; all growth is tax-free forever",
              "2025 limit: $7,000/year",
              "Your tax rate is likely the lowest it'll ever be"
            ] } },
          { type:'steps', items:[
            { title:'401(k) up to the match', text:"Free money always comes first." },
            { title:'Max the Roth IRA', text:"$7,000/year of tax-free growth." },
            { title:'Back to the 401(k)', text:"If you still have more to invest." }
          ] },
          { type:'takeaways', items:[
            "Always capture the full employer match first — it's a guaranteed return.",
            "A Roth is ideal young: pay low taxes now, never again on the growth.",
            "Follow the order: match → Roth → more 401(k)."
          ] },
          { type:'tip', text:"An employer match is a guaranteed 50–100% instant return on your contribution. It's the best investment you'll ever make." },
          { type:'check', q:"What's the correct contribution priority order?", opts:["Roth IRA first, then 401(k)","401(k) to the employer match → Roth IRA → more 401(k)","Max both at the same time","Savings account first, then retirement"], ans:1, explain:"Capture free match money first, then max the tax-free Roth, then return to the 401(k). That order squeezes the most from every dollar." }
        ]
      },

      // ── L4 — Funds, ETFs & fees ──────────────────────────────
      {
        id: 'investing-4',
        title: 'Mutual Funds, ETFs & the Power of Not Trying to Be Smart',
        duration: '6 min',
        blocks: [
          { type:'lead', text:"The investment industry spends billions convincing you that you need their experts to beat the market. The data disagrees: simple, low-cost index investing outperforms nearly every other strategy over 20+ years." },
          { type:'compare',
            left:{ title:'Mutual funds', points:[
              "Pooled money, manager picks stocks",
              "Usually higher fees (1–2% expense ratio)",
              "Priced once per day"
            ] },
            right:{ title:'ETFs', points:[
              "Trade like a stock all day",
              "Usually track an index automatically",
              "Low fees (0.03–0.20% for index ETFs)"
            ] } },
          { type:'keyIdea', title:'Fees are the silent wealth-killer', text:"$10,000 invested for 30 years at 8% grows to about $99,500 with a 0.05% fee — but only about $76,100 with a 1% fee. That tiny-sounding 0.95% costs you $23,400 on a single $10,000 investment." },
          { type:'keyIdea', title:'Dollar-cost averaging', text:"Invest the same amount every month no matter what the market does. High prices buy fewer shares, low prices buy more — and you automatically avoid the trap of trying to time the market." },
          { type:'takeaways', items:[
            "Index ETFs charge a fraction of what active mutual funds do.",
            "Fees compound against you exactly like returns compound for you.",
            "Automate steady monthly investing and ignore the headlines."
          ] },
          { type:'tip', text:"Lower fees are the only guaranteed return in investing. Every 1% you avoid keeps that 1% compounding for you instead." },
          { type:'check', q:"On a $10,000 investment over 30 years, a 1% annual fee vs a 0.05% fee costs roughly:", opts:["$500","$5,000","$23,000","$50,000"], ans:2, explain:"Fees compound against you — a ~1% drag quietly extracts tens of thousands over decades." }
        ]
      },

      // ── L5 — Planning for retirement ─────────────────────────
      {
        id: 'investing-5',
        title: 'Planning for Retirement — The Numbers That Actually Matter',
        duration: '6 min',
        blocks: [
          { type:'lead', text:"Retirement planning doesn't need a financial advisor to understand. It needs a few key numbers and an early-enough start for them to work." },
          { type:'keyIdea', title:'The 4% rule', text:"You can withdraw about 4% of your portfolio a year in retirement without running out over 30 years. Flip it around: your target number is your annual expenses × 25." },
          { type:'widget', kind:'retirementTarget', config:{ spending:50000 } },
          { type:'list', style:'check', items:[
            { strong:'Start at 20:', text:"about $200/month to reach $1M by 65." },
            { strong:'Start at 30:', text:"about $435/month — the 10-year delay more than doubles the cost." },
            { strong:'Start at 40:', text:"about $1,050/month for the same goal." }
          ] },
          { type:'keyIdea', title:'Social Security is not a retirement plan', text:"The average benefit is about $1,900/month — far less than most people need. Treat it as a bonus on top of your own savings, not a strategy." },
          { type:'takeaways', items:[
            "Your number is annual expenses × 25 — that's the whole formula.",
            "Every year you delay sharply raises the monthly amount you need.",
            "Aim to save 15–20% of gross income, automated so it happens first."
          ] },
          { type:'tip', text:"Your target retirement number is your annual expenses multiplied by 25. That's it — that's the math." },
          { type:'check', q:"Using the 4% rule, how much do you need to spend $50,000/year in retirement?", opts:["$500,000","$750,000","$1,250,000","$2,000,000"], ans:2, explain:"$50,000 × 25 = $1,250,000. Withdrawn at 4% a year, that historically lasts 30+ years." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // CAR & DRIVING — ONE lesson elevated (change-a-tire). The other car
  // lessons stay on the fromLegacy() baseline; matchTitle targets just
  // this lesson by its SK_DATA heading (per-lesson elevation).
  // ═══════════════════════════════════════════════════════════════════
  car: {
    key: 'car',
    color: '#60a5fa',
    lessons: [
      {
        id: 'car-change-tire',
        matchTitle: 'How to Change a Flat Tire — Every Step, Every Detail',
        title: 'How to Change a Flat Tire — Every Step, Every Detail',
        duration: '8 min',
        blocks: [
          { type:'lead', text:"Every driver faces a flat eventually — on a highway, at night, in the rain. Calling roadside assistance is always a fine choice, but knowing how to do this yourself means you're never stranded and helpless." },
          { type:'safety', title:'Get safe before you touch a single lug nut', text:"Signal, slow down, and pull completely off the road onto firm, level ground — never soft dirt, where the jack can sink. Turn on your hazard lights and set the parking brake. If you're on a narrow shoulder, in fast traffic, or anything feels unsafe, stay in the car with your seatbelt on and call roadside assistance instead. No tire is worth your life." },
          { type:'diagram', kind:'toolRow' },
          { type:'illustratedSteps', steps:[
            { num:1, text:"With the tire still on the ground, break each lug nut loose about a half turn counter-clockwise — in a star pattern, not a circle. Doing this before you lift keeps the wheel from spinning.", diagram:{ kind:'wheelLoosen' } },
            { num:2, text:"Place the jack under the manufacturer's reinforced jack point near the flat — check your owner's manual, because the exact spot is vehicle-specific and the wrong location can bend the frame. Raise until the flat is about 6 inches off the ground.", diagram:{ kind:'carJackPoint' } },
            { num:3, text:"Remove the loosened lug nuts the rest of the way and keep them together in your pocket or a cup. Pull the flat straight off, set it aside, then lift the spare on and push it flush against the hub." },
            { num:4, text:"Hand-tighten all the nuts first, then tighten firmly in a star pattern — each nut roughly opposite the last — so the wheel seats evenly. Never tighten them in a circle.", diagram:{ kind:'starPattern' } },
            { num:5, text:"Lower the car most of the way, do a final star-pattern tighten while the tire still can't spin, then lower fully. Stow the flat where the spare was and get it repaired soon.", diagram:{ kind:'carJackPoint' } }
          ] },
          { type:'safety', title:'A donut spare is temporary', text:"Compact “donut” spares are rated for roughly 50 mph and 50–70 miles — just enough to reach a shop. Get your real tire repaired or replaced right away, and re-check that the lug nuts are still tight after the first 25–50 miles." },
          { type:'takeaways', items:[
            "Loosen the lug nuts while the wheel is still on the ground.",
            "Jack only on the reinforced frame point your owner's manual shows.",
            "Hand-tighten first, then torque in a star pattern — never a circle.",
            "If the location or traffic feels unsafe, call for help instead."
          ] },
          { type:'tip', text:"Practice once in your driveway before you ever need it for real. A 20-minute dry run removes almost all the stress of doing it on a dark shoulder." },
          { type:'check', q:"Why do you loosen the lug nuts BEFORE jacking the car up?", opts:[
            "It's faster that way",
            "On the ground the wheel can't spin, so you have the traction to break them loose",
            "The jack is more stable with the nuts loose",
            "It prevents over-tightening later"
          ], ans:1, explain:"With the tire on the ground it can't spin freely, so the wheel holds still while you break each stuck lug nut loose. Once the car is lifted, the wheel just spins and you lose that traction." }
        ]
      }
    ]
  }
};

if(typeof window !== 'undefined'){ window.SK_SPECS = SK_SPECS; }
