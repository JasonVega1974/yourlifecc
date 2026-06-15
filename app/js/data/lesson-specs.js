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
          { type:'viz', kind:'valueBars', data:{ mode:'stack', money:true, caption:'Where a $100 freelance (1099) payment goes — before you spend any of it', items:[
            { label:'Self-employment tax (15.3%)', value:14, color:'#fb7185' },
            { label:'Income tax (set aside)', value:14, color:'#fbbf24' },
            { label:'Yours to keep', value:72, color:'#34d399' }
          ] } },
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
          { type:'viz', kind:'dateTimeline', data:{ caption:'The tax-year calendar', items:[
            { label:'Jan 31', sub:'W-2s & 1099s arrive' },
            { label:'Apr 15', sub:'File & pay', highlight:true },
            { label:'Oct 15', sub:'Extension deadline (file only)' }
          ] } },
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
          { type:'viz', kind:'valueBars', data:{ mode:'compare', money:true, caption:'Take whichever is bigger — for most people, the standard deduction', items:[
            { label:'Standard deduction (single)', value:15750, color:'#34d399', highlight:true, note:'Most people take this — no receipts needed.' },
            { label:'Example itemized total', value:9400, color:'#60a5fa', note:'Mortgage interest + SALT + charitable gifts.' }
          ] } },
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
          { type:'viz', kind:'valueBars', data:{ mode:'compare', money:true, caption:'What $1,000 actually saves you (22% bracket)', items:[
            { label:'$1,000 tax credit', value:1000, color:'#34d399', highlight:true, note:'Cuts your tax bill dollar-for-dollar.' },
            { label:'$1,000 deduction', value:220, color:'#60a5fa', note:'Only saves your rate — 22% of $1,000.' }
          ] } },
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
          { type:'diagram', kind:'marketLine' },
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
          { type:'viz', kind:'valueBars', data:{ mode:'stack', money:true, caption:'A 50%-up-to-6% match on a $60k salary — going into your 401(k) each year', items:[
            { label:'Your 6% contribution', value:3600, color:'#60a5fa' },
            { label:'Free employer match', value:1800, color:'#34d399', highlight:true }
          ] } },
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
          { type:'viz', kind:'valueBars', data:{ mode:'compare', money:true, caption:'$10,000 invested for 30 years at 8% — the only difference is the fee', items:[
            { label:'0.05% fee (index fund)', value:99500, color:'#34d399', highlight:true },
            { label:'1% fee (typical active)', value:76100, color:'#fb7185', note:'That 0.95% quietly costs $23,400.' }
          ] } },
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
      },

      // ── L2 — Engine Oil (procedural) ─────────────────────────
      {
        id:'car-oil', matchTitle:'Engine Oil — Why It Matters More Than Almost Any Other Maintenance',
        title:'Engine Oil — Why It Matters More Than Almost Any Other Maintenance', duration:'7 min',
        blocks:[
          { type:'lead', text:"Engine oil is the single most important fluid in your car. It lubricates, cools, cleans, prevents corrosion, and seals — all at once. When it breaks down it can't do any of them, and the engine quietly wears itself out." },
          { type:'keyIdea', title:'A $40 change prevents a $4,000 repair', text:"Skip oil changes and the oil turns thick, dark, and acidic until metal grinds on metal. An engine that could last 200,000+ miles can fail by 80,000 — often with no warning." },
          { type:'list', style:'check', items:[
            { strong:'Conventional:', text:"every 3,000–5,000 miles." },
            { strong:'Synthetic blend:', text:"every 5,000–7,500 miles." },
            { strong:'Full synthetic:', text:"every 7,500–10,000 miles (some up to 15,000)." },
            { strong:'Severe service', text:"(short trips, towing, extreme heat/cold): shorten by 20–30%. Always follow your owner's manual." }
          ] },
          { type:'illustratedSteps', steps:[
            { num:1, text:"Park on level ground and let the engine sit off for at least 10 minutes so the oil drains back down for an accurate reading." },
            { num:2, text:"Pull the dipstick, wipe it completely clean, reinsert it fully, then pull it again — that second pull is the real measurement." },
            { num:3, text:"Read the level (it should sit between MIN and MAX) and the color: amber to light brown is good, dark brown is due soon, black and gritty is overdue.", diagram:{ kind:'oilDipstick' } }
          ] },
          { type:'safety', title:"Milky or foamy oil — don't drive", text:"If the oil on the dipstick looks milky, foamy, or tan, that can mean coolant is leaking into it (a possible head-gasket failure). Don't keep driving — have it checked, because running it can destroy the engine." },
          { type:'keyIdea', title:'Match the viscosity exactly', text:"Your manual lists the exact grade, e.g. 5W-30 — the first number is cold-weather flow, the second is hot-running thickness. The wrong grade lubricates poorly. Correct viscosity and on-schedule changes matter more than the brand." },
          { type:'takeaways', items:[
            "Oil does five jobs at once; degraded oil does none of them.",
            "Check it monthly: wipe, reinsert, pull, then read level and color.",
            "Use the exact viscosity your manual specifies, and change on schedule."
          ] },
          { type:'tip', text:"When you get an oil change, note the odometer and set a phone reminder for your interval (e.g. +5,000 miles). Don't rely on memory — the reminder fires right when you're due." },
          { type:'check', q:"The oil on your dipstick looks milky and tan. What does that suggest?", opts:[
            "Totally normal — drive on",
            "Just time for a routine change",
            "Coolant may be leaking into the oil — stop driving and get it checked",
            "You simply overfilled it"
          ], ans:2, explain:"Milky/foamy oil can mean coolant is mixing in (a possible head-gasket leak). Continuing to drive risks serious engine damage — get it inspected." }
        ]
      },

      // ── L3 — Car Insurance (conceptual) ──────────────────────
      {
        id:'car-insurance', matchTitle:"Car Insurance — What You're Actually Buying and What to Skip",
        title:"Car Insurance — What You're Actually Buying and What to Skip", duration:'7 min',
        blocks:[
          { type:'lead', text:"Car insurance is legally required and financially critical everywhere — yet most people choose it on price alone without knowing what each part actually covers. Here's what you're buying and where to stop overpaying." },
          { type:'keyIdea', title:'You buy several separate coverages', text:"Liability, collision, comprehensive, uninsured-motorist, and medical/PIP are all distinct. Liability covers damage and injuries you cause to others — never your own car or injuries." },
          { type:'compare',
            left:{ title:'Collision', points:[
              "Damage to YOUR car from hitting a vehicle or object",
              "Pays regardless of fault",
              "Has a deductible ($500–$2,000)",
              "Required if you have a loan or lease"
            ] },
            right:{ title:'Comprehensive', points:[
              "Everything that isn't a collision",
              "Theft, vandalism, hail, flood, fire, hitting an animal",
              "Also has a deductible",
              "Optional once the car is paid off"
            ] } },
          { type:'keyIdea', title:'State minimums are dangerously low', text:"Liability is written as three numbers — 25/50/25 means $25k per injured person, $50k per accident, $25k property. A serious crash can top $100k, and a judgment beyond your limits exposes your savings and future wages. Consider 100/300/100 or higher if you have assets." },
          { type:'diagram', kind:'liabilityLimits' },
          { type:'list', style:'check', items:[
            { strong:'Uninsured/underinsured motorist:', text:"about 1 in 8 drivers is uninsured — this is cheap and covers a very real risk. Recommended." },
            { strong:'Medical payments / PIP:', text:"pays your and your passengers' medical bills regardless of fault; required in no-fault states." },
            { strong:'Drop collision & comprehensive', text:"on an older car worth less than ~10× the annual premium for that coverage." }
          ] },
          { type:'takeaways', items:[
            "Liability protects others; collision and comprehensive protect your car.",
            "State-minimum liability is a trap — raise it if you have assets to protect.",
            "On a low-value car, collision/comprehensive may cost more than they're worth."
          ] },
          { type:'tip', text:"Use a comparison site (The Zebra, NerdWallet, Policygenius) to price 10+ insurers at once. For identical coverage the cheapest vs priciest can differ $600–$1,500/year. Never auto-renew without checking competitors every couple of years." },
          { type:'check', q:"A liability policy of 25/50/25 means the property-damage limit per accident is:", opts:["$25,000","$50,000","$100,000","Unlimited"], ans:0, explain:"The three numbers are $25k per injured person / $50k per accident for injuries / $25k for property damage. The last number — $25,000 — is the property limit." }
        ]
      },

      // ── L4 — Jump-Starting (SAFETY-CRITICAL, procedural) ─────
      {
        id:'car-jumpstart', matchTitle:'Jump-Starting a Dead Battery — The Exact Correct Procedure',
        title:'Jump-Starting a Dead Battery — The Exact Correct Procedure', duration:'8 min',
        blocks:[
          { type:'lead', text:"Getting jumper-cable polarity or order wrong doesn't just fail to start the car — it can fry expensive electronics, destroy the battery, or ignite hydrogen gas right next to the battery. Done in the right order, it's safe and simple." },
          { type:'safety', title:'Before you connect anything', text:"Turn BOTH cars off and take the keys out while you attach the clamps. Don't jump a battery that's cracked, leaking, bulging, or frozen (slushy) — it can rupture; call for roadside help instead. Once one cable end is connected, never let the clamp ends touch each other or any metal." },
          { type:'diagram', kind:'jumperCables' },
          { type:'illustratedSteps', steps:[
            { num:1, text:"Connect the clamps in this exact order (see the diagram): red to the DEAD battery + , red to the GOOD battery + , black to the GOOD battery − , and finally black to bare unpainted metal on the DEAD car's engine — a bolt or bracket away from the battery, NOT the dead battery's − terminal.", diagram:{ kind:'jumperCables' } },
            { num:2, text:"Start the GOOD car and let it run 2–3 minutes, then try the dead car. Don't crank longer than 5 seconds at a time. If it won't start after 3–4 tries, stop — the battery may be beyond a jump or something else is wrong." },
            { num:3, text:"Disconnect in the REVERSE order: black off the engine ground, black off the good battery − , red off the good + , red off the now-running car + . Then drive 20–30 minutes at highway speed to let the alternator recharge." }
          ] },
          { type:'keyIdea', title:'Why clamp 4 goes on bare metal, not the battery', text:"That last connection is the one that sparks. Batteries vent hydrogen — especially while charging — and a spark at the dead battery's − terminal can ignite it. Grounding on bare engine metal away from the battery puts the spark somewhere harmless." },
          { type:'keyIdea', title:'Polarity is unforgiving', text:"Red is always positive (+), black always negative (−). Reversing them can instantly destroy electronics in both cars. If you're ever unsure which terminal is which, stop and get help rather than guess." },
          { type:'takeaways', items:[
            "Order: red→dead +, red→good +, black→good −, black→bare engine metal on the dead car.",
            "Both engines off and keys out while you connect the clamps.",
            "The final clamp goes on bare metal away from the battery — never the dead − terminal.",
            "Reversed polarity fries electronics; a cracked or frozen battery means call for help."
          ] },
          { type:'tip', text:"A portable jump starter (about the size of a thick paperback, $50–$80) lets you jump your own car with no second vehicle — and holds a charge for months. One of the best things you can keep in a glove box." },
          { type:'check', q:"Where does the FINAL (4th) clamp go?", opts:[
            "On the dead battery's − terminal",
            "On the good battery's − terminal",
            "On bare unpainted engine metal on the dead car, away from the battery",
            "On either positive terminal"
          ], ans:2, explain:"The last connection sparks, and batteries vent flammable hydrogen. Grounding on bare engine metal away from the dead battery keeps that spark away from the gas." }
        ]
      },

      // ── L5 — Tire Care (procedural-lite) ─────────────────────
      {
        id:'car-tire-care', matchTitle:'Tire Care — Safety, Savings, and When to Replace',
        title:'Tire Care — Safety, Savings, and When to Replace', duration:'7 min',
        blocks:[
          { type:'lead', text:"Tires are your car's only contact with the road — four roughly hand-sized patches handle all your accelerating, braking, and turning. Worn or underinflated tires lengthen your stopping distance and raise blowout risk." },
          { type:'keyIdea', title:'Set pressure to the door-jamb number', text:"Use the PSI on the sticker inside the driver's door jamb (or your manual) — not the bigger maximum number molded on the sidewall. Check when the tires are cold (driven under a mile), since heat inflates the reading." },
          { type:'list', style:'check', items:[
            { strong:'Tires lose 1–2 PSI a month', text:"and about 1 PSI per 10°F temperature drop — check monthly." },
            { strong:'Underinflation:', text:"outer-edge wear, worse fuel economy, sluggish handling, higher blowout risk." },
            { strong:'Overinflation:', text:"center wear, harsher ride, less traction." }
          ] },
          { type:'illustratedSteps', steps:[
            { num:1, text:"Check tread depth with the penny test: insert a penny upside down into a groove. If you can see the top of Lincoln's head, you're at or below 2/32\" — the legal minimum and genuinely dangerous in rain. Replace now.", diagram:{ kind:'treadPenny' } },
            { num:2, text:"Want earlier warning? Use a quarter: if you can see the top of Washington's head, you're around 4/32\" — still legal, but start budgeting for new tires." },
            { num:3, text:"Rotate your tires every 5,000–7,500 miles so all four wear evenly — it can add 15,000–25,000 miles to a set, and many shops do it free with an oil change." }
          ] },
          { type:'safety', title:'Replace regardless of tread if you see these', text:"Any sidewall bulge, crack, or cut; any tire over 6 years old (check the DOT date code on the sidewall); or new vibration/pulling after a hard pothole or curb strike. These signal structural failure and blowout risk — don't postpone, especially before a long or wet-weather trip." },
          { type:'takeaways', items:[
            "Inflate to the door-jamb PSI, checked cold, every month.",
            "Penny shows Lincoln's head = 2/32\" = replace now.",
            "Rotate every 5,000–7,500 miles to even out wear and stretch tire life."
          ] },
          { type:'tip', text:"Buy tires in pairs at minimum (all four is ideal). And put new tires on the REAR axle regardless of which wheels drive — it keeps the back from sliding out first in hard or wet braking." },
          { type:'check', q:"You do the penny test and can see the top of Lincoln's head in the groove. That means:", opts:[
            "Plenty of tread left",
            "About 2/32\" of tread — replace now",
            "The tire is overinflated",
            "It's just time to rotate"
          ], ans:1, explain:"Seeing the top of his head means the tread is down to ~2/32\" — the legal minimum and unsafe in the wet. Replace the tire." }
        ]
      },

      // ── L6 — Warning Lights & Monthly Checks (conceptual + safety) ──
      {
        id:'car-warning-lights', matchTitle:'Understanding Warning Lights and Monthly Car Checks',
        title:'Understanding Warning Lights and Monthly Car Checks', duration:'7 min',
        blocks:[
          { type:'lead', text:"Your dashboard lights are the car talking to you. Panicking at every light and ignoring them all are both wrong and costly. Here's what the big ones mean and what to do." },
          { type:'safety', title:'Red lights mean stop — now', text:"Red oil-pressure light: pull over and shut the engine off immediately — running with no oil pressure can destroy the engine in minutes. Temperature light (overheating): pull over and let it cool, and NEVER open a hot radiator cap — the pressurized steam causes severe burns. Red brake warning with the parking brake released: don't drive — get it towed or inspected." },
          { type:'diagram', kind:'dashLights' },
          { type:'compare',
            left:{ title:'🔴 Red — stop now', points:[
              "Oil pressure — pull over, engine off",
              "Temperature — overheating, pull over",
              "Battery/charging — alternator not charging",
              "Brake system — don't drive, inspect"
            ] },
            right:{ title:'🟡 Yellow — days to weeks', points:[
              "Check engine — scan it free at a parts store",
              "Flashing check engine — active misfire, stop",
              "TPMS — a tire 25%+ low on pressure",
              "Low fuel / traction-control off"
            ] } },
          { type:'list', style:'check', items:[
            { strong:'Monthly 5-minute check:', text:"oil level + color on the dipstick, tire pressure on all four, coolant in the reservoir (cold engine only), washer fluid, and a walk-around to confirm headlights, brake lights, and turn signals all work." }
          ] },
          { type:'takeaways', items:[
            "Red = stop and address now; yellow = handle within days to weeks.",
            "A flashing check-engine light means an active misfire — stop driving.",
            "Five minutes of monthly checks catches most problems before they're expensive."
          ] },
          { type:'tip', text:"Keep a $20–$40 OBD-II reader in the glove box. When the check-engine light comes on, read the code yourself first — it tells you whether you're looking at a $10 gas cap or a $400 sensor, and keeps you from being upsold repairs you don't need." },
          { type:'check', q:"The red oil-pressure light comes on while you're driving. You should:", opts:[
            "Top off the fuel and keep going",
            "Drive to the next exit and decide there",
            "Pull over and shut the engine off right away",
            "Ignore it if the car still feels fine"
          ], ans:2, explain:"No oil pressure means metal parts are running without lubrication — that can destroy an engine in minutes. Pull over and shut it off immediately, then check the oil or have it towed." }
        ]
      },

      // ── L7 — True Cost of Ownership (conceptual) ─────────────
      {
        id:'car-true-cost', matchTitle:'The True Cost of Car Ownership — Running the Real Numbers',
        title:'The True Cost of Car Ownership — Running the Real Numbers', duration:'6 min',
        blocks:[
          { type:'lead', text:"The most common car-buying mistake is looking only at the monthly payment. The payment is one of six costs — and sometimes not even the biggest. Add them all up before you commit." },
          { type:'keyIdea', title:'Six costs, not one', text:"Loan payment, insurance, fuel, maintenance & repairs, registration & taxes, and depreciation. The sticker payment hides most of them — and the hidden ones are often larger." },
          { type:'list', style:'check', items:[
            { strong:'Loan payment:', text:"$200–$700+/mo. A $25,000 car at 8% over 60 months is $507/mo and ~$5,400 in interest; longer terms lower the payment but raise total cost." },
            { strong:'Insurance:', text:"$100–$400+/mo (under-25 drivers pay the most)." },
            { strong:'Fuel:', text:"$80–$200/mo — monthly miles ÷ MPG × price per gallon." },
            { strong:'Maintenance & repairs:', text:"budget ~$100–$150/mo averaged (oil, tires, brakes, surprises)." },
            { strong:'Registration & taxes:', text:"$100–$700/year, varies a lot by state and value." }
          ] },
          { type:'viz', kind:'valueBars', data:{ mode:'stack', money:true, caption:'A typical new-car monthly cost — the loan payment is only part of it', items:[
            { label:'Depreciation', value:350, color:'#fb7185', highlight:true },
            { label:'Loan payment', value:450, color:'#60a5fa' },
            { label:'Insurance', value:200, color:'#fbbf24' },
            { label:'Fuel', value:140, color:'#34d399' },
            { label:'Maintenance', value:125, color:'#a78bfa' },
            { label:'Registration', value:30, color:'#22d3ee' }
          ] } },
          { type:'keyIdea', title:'Depreciation is the hidden giant', text:"A new car loses about 20–25% of its value in the first year and 50–60% over five years. You don't feel it monthly, but it's exactly what you've lost the day you sell." },
          { type:'keyIdea', title:'The 15–20% rule', text:"Keep all car costs combined under 15–20% of your take-home pay. At $3,500/month take-home, that's $525–$700 for everything car-related — not just the loan." },
          { type:'takeaways', items:[
            "Total realistic ownership often runs $700–$1,500+/month, all in.",
            "Depreciation usually dwarfs the payment on a new car.",
            "A 2–4 year-old reliable used car skips the worst depreciation."
          ] },
          { type:'tip', text:"Before buying anything, add up all six costs for the specific car. If the total tops 15–20% of your monthly take-home, it's outside your budget no matter how friendly the monthly payment looks." },
          { type:'check', q:"On a brand-new car, which cost is usually the biggest — and the easiest to overlook?", opts:["Fuel","The monthly loan payment","Depreciation","Registration fees"], ans:2, explain:"A new car can shed 20–25% of its value in year one — often more than a year of payments — yet it never shows up as a monthly bill. It's the hidden giant of ownership cost." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // COOKING & FOOD — full module elevated. L1 kitchen safety is the
  // safety-critical lesson (grease fire, USDA temps, knife claw grip);
  // L2–L6 are structured. Matched by title (per-lesson).
  // ═══════════════════════════════════════════════════════════════════
  cooking: {
    key: 'cooking',
    color: '#fb923c',
    lessons: [
      // ── L1 — Kitchen Safety (SAFETY-CRITICAL) ────────────────
      {
        id:'cooking-safety', matchTitle:'Kitchen Safety — The Rules That Prevent Real Harm',
        title:'Kitchen Safety — The Rules That Prevent Real Harm', duration:'8 min',
        blocks:[
          { type:'lead', text:"The kitchen is where most household accidents happen — burns, cuts, falls, and foodborne illness. The good news: nearly all of it is preventable. Before you learn to cook, learn to cook safely." },
          { type:'safety', title:'Grease fire: never water', text:"If oil or grease catches fire, never throw water on it — the water flashes to steam and blasts burning oil everywhere. Turn off the heat. Smother the pan by sliding a metal lid or a baking sheet over it and leave it covered. For a small flare-up you can dump baking soda on it — never flour, which can ignite. Don't try to carry a flaming pan anywhere. If the fire is spreading or you're unsure, get everyone out and call 911." },
          { type:'diagram', kind:'greaseFire' },
          { type:'keyIdea', title:'A sharp knife is safer than a dull one', text:"Dull knives need more force and slip more easily, causing worse cuts. Hone the edge before each use and sharpen every few months." },
          { type:'illustratedSteps', steps:[
            { num:1, text:"Steady the cutting board first — put a damp towel under it so it can't slide while you work." },
            { num:2, text:"Hold the food in a \"claw\" grip: fingertips curled under, knuckles guiding the side of the blade, so the edge never reaches your fingertips.", diagram:{ kind:'knifeClaw' } },
            { num:3, text:"Cut on a downward, away-from-your-body motion. Never drop a knife into a sink full of water — wash it right away, separately. And if a knife falls, step back and let it fall; don't try to catch it." }
          ] },
          { type:'safety', title:'The danger zone: 40–140°F', text:"Bacteria multiply fastest between 40°F and 140°F. Keep the fridge at or below 40°F and the freezer at 0°F. Never thaw meat on the counter — thaw it in the fridge, in a sealed bag under cold water (changed every 30 minutes), or in the microwave to cook immediately. Don't leave perishable food out longer than 2 hours (1 hour above 90°F)." },
          { type:'diagram', kind:'foodTempChart' },
          { type:'list', style:'check', items:[
            { strong:'Poultry — 165°F.', text:"Chicken, turkey, and all reheated leftovers." },
            { strong:'Ground meats — 160°F.', text:"Ground beef, pork, and similar." },
            { strong:'Fresh beef, pork, lamb — 145°F,', text:"then rest 3 minutes before cutting." },
            { strong:'Fish — 145°F.', text:"Until it flakes and is opaque." }
          ] },
          { type:'keyIdea', title:'Stop cross-contamination', text:"Use separate cutting boards for raw meat and for produce, and wash your hands, surfaces, and utensils right after they touch raw meat — bacteria spread invisibly from one food to another." },
          { type:'takeaways', items:[
            "Grease fire: turn off the heat and smother with a lid — never water; if it's spreading, get out and call 911.",
            "A sharp knife, a claw grip, and a towel-steadied board prevent most cuts.",
            "Cook to safe internal temps and keep perishables out of the 40–140°F danger zone."
          ] },
          { type:'tip', text:"Buy an instant-read thermometer ($10–$15) — it's the only reliable way to know meat is safe. Guessing by color or texture is exactly how people give themselves food poisoning." },
          { type:'check', q:"A pan of oil bursts into flames on the stove. What do you do?", opts:[
            "Throw a cup of water on it",
            "Turn off the heat and slide a metal lid over the pan",
            "Pick it up and carry it outside",
            "Fan the flames to blow them out"
          ], ans:1, explain:"Water makes a grease fire explode. Cut the heat and smother it with a metal lid or baking sheet (or baking soda for a small flare). If it's spreading or you're unsure, get out and call 911." }
        ]
      },

      // ── L2 — Five Foundational Meals (structured) ────────────
      {
        id:'cooking-meals', matchTitle:'5 Foundational Meals Every Adult Should Master',
        title:'5 Foundational Meals Every Adult Should Master', duration:'7 min',
        blocks:[
          { type:'lead', text:"You don't need to be a chef — you need to reliably feed yourself well. Master these five and you've got a foundation that covers most days, costs a fraction of takeout, and beats waiting for delivery." },
          { type:'list', style:'check', items:[
            { strong:'Scrambled eggs:', text:"low heat, butter in the pan, stir slowly and constantly, pull them off while still slightly wet — carryover heat finishes them creamy." },
            { strong:'Rice & protein bowl:', text:"rice in 1.5× water, simmer covered 18 min (don't lift the lid); sear a protein; add a sauce; build the bowl." },
            { strong:'Pasta with real sauce:', text:"salt the water like the sea, cook 1 minute short, then finish the pasta in the sauce with a splash of pasta water so it clings." },
            { strong:'Sheet-pan dinner:', text:"425°F, toss protein + vegetables in oil, salt, pepper; spread in a single layer (crowding steams instead of roasting)." },
            { strong:'Stir fry:', text:"everything cut and ready first; screaming-hot pan; aromatics, then protein, then vegetables by density, sauce last." }
          ] },
          { type:'keyIdea', title:'Skill comes from repetition', text:"Make the same dish five times and it becomes automatic — then it's yours forever and you can riff on it endlessly. Learn these five well before anything more complex." },
          { type:'takeaways', items:[
            "Five reliable meals cover most of your week for a fraction of takeout.",
            "The rice-bowl, sheet-pan, and stir-fry formats are endlessly variable.",
            "Repetition, not complexity, builds real cooking skill."
          ] },
          { type:'tip', text:"Pick ONE of the five and cook it three times this week. Locking in a single dish you can make without thinking is worth more than ten recipes you try once." },
          { type:'check', q:"When should you take scrambled eggs off the heat?", opts:[
            "When they're completely dry and firm",
            "While they still look slightly wet — carryover heat finishes them",
            "The moment you crack them in",
            "After they brown on the bottom"
          ], ans:1, explain:"Eggs keep cooking from residual heat after you pull the pan. Take them off slightly underdone and they finish soft and creamy instead of rubbery." }
        ]
      },

      // ── L3 — Meal Prep (structured) ──────────────────────────
      {
        id:'cooking-mealprep', matchTitle:'Meal Prep — Feed Yourself Well All Week for Under $60',
        title:'Meal Prep — Feed Yourself Well All Week for Under $60', duration:'6 min',
        blocks:[
          { type:'lead', text:"Meal prep isn't eating sad identical containers every day. It's doing the slow, boring parts of cooking once so that putting a meal together on a Tuesday night takes 5 minutes instead of 45." },
          { type:'keyIdea', title:'Cook components, not meals', text:"Spend ~90 minutes on Sunday cooking building blocks, then assemble different meals from them all week — you're never eating the same exact plate twice." },
          { type:'diagram', kind:'mealMatrix' },
          { type:'list', style:'check', items:[
            { strong:'1 grain or starch', text:"— a big batch of rice, quinoa, or roasted potatoes (keeps ~5 days)." },
            { strong:'1–2 proteins', text:"— a tray of chicken thighs (425°F, 25 min), ground beef, or hard-boiled eggs (keeps ~4 days)." },
            { strong:'2–3 vegetables', text:"— roast two sheet pans and prep some raw for snacking." },
            { strong:'1–2 sauces', text:"— teriyaki, tahini-lemon, peanut-ginger; a sauce turns the same parts into a different meal." }
          ] },
          { type:'list', style:'bullet', items:[
            { strong:'The grocery math:', text:"chicken thighs $8–12, ground beef $10–14, rice (5 lb) $6, frozen veg $8–12, eggs $4–6, pantry staples $10–15 — about $50–60 for the week vs $50–100 eating out at lunch alone." }
          ] },
          { type:'takeaways', items:[
            "Prep components on Sunday; weeknight meals become 5-minute assembly.",
            "Mix and match grain + protein + veg + sauce so meals never repeat exactly.",
            "A week of real food runs ~$50–60 — cheaper than takeout lunches."
          ] },
          { type:'tip', text:"The hardest part is starting. Commit to ONE 90-minute Sunday, and start simpler than you think — one protein and one grain is enough. Once there's ready food every night, the habit sells itself." },
          { type:'check', q:"What's the core idea of meal prep?", opts:[
            "Eat the exact same meal every day",
            "Do the slow prep once so weeknight meals are fast to assemble",
            "Only eat cold food from containers",
            "Cook every dinner completely from scratch each night"
          ], ans:1, explain:"You batch the slow components (grain, protein, veg, sauce) once, then assemble varied meals quickly all week." }
        ]
      },

      // ── L4 — Grocery Shopping (structured) ───────────────────
      {
        id:'cooking-grocery', matchTitle:'Grocery Shopping — Buy Smart, Waste Less, Spend Less',
        title:'Grocery Shopping — Buy Smart, Waste Less, Spend Less', duration:'6 min',
        blocks:[
          { type:'lead', text:"The average American wastes about 30–40% of the food they buy. Between that waste and impulse buys, most people quietly overspend on groceries. A few habits change everything." },
          { type:'list', style:'check', items:[
            { strong:'Plan first, then list.', text:"Decide on 4–5 meals and build your list from the plan — not from wandering the aisles." },
            { strong:'Check what you already have', text:"so you don't buy duplicates buried in the pantry." },
            { strong:'Never shop hungry', text:"— hungry shoppers reliably spend 20%+ more and grab high-calorie impulse items." }
          ] },
          { type:'list', style:'check', items:[
            { strong:'Store brands', text:"— 20–40% cheaper than name brands for nearly identical canned goods, grains, dairy, and frozen veg." },
            { strong:'Read the unit price', text:"(per ounce), not the package price — but only buy the bigger size if you'll use it before it spoils." },
            { strong:'Frozen vegetables', text:"are frozen at peak ripeness, keep nearly all their nutrients, and cost 40–60% less — perfect for cooked dishes." },
            { strong:'Buy protein in bulk and freeze;', text:"eggs and dried beans/lentils are cheap, complete nutrition." }
          ] },
          { type:'keyIdea', title:'Shop the perimeter first', text:"The outer ring — produce, meat, dairy, eggs — is where you build real meals. The center aisles hold the most-processed, highest-margin food. Fill your cart on the perimeter before you head into the middle." },
          { type:'diagram', kind:'storePerimeter' },
          { type:'takeaways', items:[
            "Plan meals, check your pantry, and never shop hungry.",
            "Store brands, unit pricing, and frozen veg cut the bill without cutting nutrition.",
            "First-in-first-out + one \"use what we have\" meal a week kills food waste."
          ] },
          { type:'tip', text:"Move older items to the front when you put groceries away (first-in, first-out), keep produce where you can see it, and plan one \"use what we have\" meal each week. Most waste is just food you forgot you had." },
          { type:'check', q:"Why is it a bad idea to grocery shop while hungry?", opts:[
            "Stores raise prices in the evening",
            "Hungry shoppers spend 20%+ more and grab impulse items",
            "Fresh food sells out by then",
            "You can't read unit prices on an empty stomach"
          ], ans:1, explain:"Shopping hungry reliably drives up spending and steers you toward high-calorie impulse buys. Eat first, then shop your list." }
        ]
      },

      // ── L5 — Reading Nutrition Labels (structured) ───────────
      {
        id:'cooking-labels', matchTitle:"Reading Nutrition Labels — Don't Get Fooled",
        title:"Reading Nutrition Labels — Don't Get Fooled", duration:'7 min',
        blocks:[
          { type:'lead', text:"Food packaging is one of the most effective marketing environments ever built. Front-of-box claims — \"natural,\" \"wholesome,\" \"made with real fruit,\" \"multigrain\" — are almost entirely unregulated. The label on the back is regulated, and it tells the real story." },
          { type:'diagram', kind:'nutritionLabel' },
          { type:'steps', items:[
            { title:'Serving size first', text:"Every number on the label is per serving. A bag that looks like one serving often holds 2.5 — so you'd multiply everything by 2.5. This is the #1 way people undercount calories." },
            { title:'Calories', text:"Your energy intake. A moderately active adult needs roughly 2,000–2,500 a day, so a 500-calorie snack is a fifth of the budget." },
            { title:'Protein', text:"Most people need about 0.7–1.0 g per pound of body weight daily; check whether a food meaningfully adds to that." },
            { title:'Fats', text:"Type matters more than total — limit saturated fat and avoid trans fat entirely (any amount is harmful)." },
            { title:'Sodium', text:"Aim under ~2,300 mg a day. A single can of soup can hold 800–1,200 mg; processed and restaurant food is the main source." },
            { title:'Added sugars', text:"Listed separately from total sugars — keep under ~25 g (women) / 36 g (men). One flavored yogurt can hit 20–25 g." },
            { title:'Ingredient list', text:"Listed by weight. If sugar, high-fructose corn syrup, or a refined grain is in the first three, that's mostly what it is. Shorter and more recognizable is better." }
          ] },
          { type:'keyIdea', title:'The serving-size trick', text:"Manufacturers shrink the \"serving\" so the calorie and sugar numbers look small. Always check servings-per-container and do the math for what you'll actually eat." },
          { type:'takeaways', items:[
            "Read serving size first — it scales every other number.",
            "Watch saturated/trans fat, sodium, and added sugars specifically.",
            "A short, recognizable ingredient list usually beats a long one."
          ] },
          { type:'tip', text:"Simplest heuristic: if a food needs an elaborate label to justify itself, it's probably not the best choice. Whole foods — chicken, broccoli, eggs, apples, rice — don't advertise their healthfulness." },
          { type:'check', q:"A chip bag says 150 calories per serving and \"2.5 servings per container.\" Eating the whole bag is about:", opts:["150 calories","250 calories","375 calories","500 calories"], ans:2, explain:"150 × 2.5 = 375. The label's numbers are per serving — always multiply by servings-per-container for what you actually eat." }
        ]
      },

      // ── L6 — Spices & Flavor (structured) ────────────────────
      {
        id:'cooking-spices', matchTitle:'Essential Spices and Flavor — Making Food You Actually Want to Eat',
        title:'Essential Spices and Flavor — Making Food You Actually Want to Eat', duration:'6 min',
        blocks:[
          { type:'lead', text:"Boiled chicken and plain rice isn't a nutrition plan — it's a punishment that sends people back to fast food. Seasoning food well is what makes home cooking sustainable. You don't need 50 spices; you need the right 10." },
          { type:'list', style:'check', items:[
            { strong:'Kosher salt', text:"— the foundation; properly salted food tastes like itself, more intensely. Most home cooks undersalt." },
            { strong:'Black pepper (fresh-ground)', text:"— pre-ground loses its punch fast; a grinder is a real upgrade." },
            { strong:'Garlic powder & onion powder', text:"— savory depth in nearly everything." },
            { strong:'Smoked paprika', text:"— smoky and slightly sweet; transforms chicken and roasted veg." },
            { strong:'Cumin', text:"— earthy and warm; Mexican, Indian, Middle-Eastern dishes, chili." },
            { strong:'Italian seasoning & chili powder', text:"— pasta/pizza, and chili/taco warmth." },
            { strong:'Cayenne & cinnamon', text:"— a little background heat; cinnamon adds warmth to chili and oatmeal, not just baking." }
          ] },
          { type:'keyIdea', title:'A universal seasoning formula', text:"For almost any protein or vegetable: salt + pepper + garlic powder + smoked paprika, plus cumin or Italian seasoning depending on the direction. It works on chicken, beef, pork, fish, and roasted veg every time." },
          { type:'list', style:'bullet', items:[
            { strong:'Umami boosters:', text:"soy sauce, Worcestershire, a few drops of fish sauce, parmesan, tomato paste, or miso amplify savory flavor in any dish that tastes \"flat.\"" }
          ] },
          { type:'takeaways', items:[
            "Ten spices cover almost everything you'll cook.",
            "Salt + pepper + garlic powder + smoked paprika is a reliable base for anything.",
            "A splash of an umami booster fixes \"flat\" savory dishes."
          ] },
          { type:'tip', text:"Season in layers — a little salt on the raw food, again while it cooks, and adjusted at the end — and taste as you go. Every taste trains your palate." },
          { type:'check', q:"Properly salted food tastes:", opts:[
            "Noticeably salty",
            "Like itself, only more intense",
            "Bland and flat",
            "Slightly sweet"
          ], ans:1, explain:"The right amount of salt doesn't read as \"salty\" — it makes the food taste more like itself. That's why undersalting, not oversalting, is the common mistake." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // BUDGETING & SAVING — both lessons elevated. Number-heavy, so each gets
  // an interactive widget (budgetSplitter, savingsGoal). Guidelines framed
  // as guidelines; general-education (not advice) note in L1.
  // ═══════════════════════════════════════════════════════════════════
  budgeting: {
    key: 'budgeting',
    color: '#34d399',
    lessons: [
      // ── L1 — Zero-Based Budget / 50-30-20 ────────────────────
      {
        id:'budget-zero', matchTitle:'The Zero-Based Budget — Every Dollar Has a Job',
        title:'The Zero-Based Budget — Every Dollar Has a Job', duration:'7 min',
        blocks:[
          { type:'lead', text:"A budget isn't a restriction on your freedom — it's a plan that puts you in control. The most reliable method for most people is zero-based budgeting: you assign every dollar of income to a category until income minus allocations equals zero, so nothing is unaccounted for." },
          { type:'keyIdea', title:'Give every dollar a job', text:"Zero-based doesn't mean spending everything — savings and investing are categories too. It means no dollar is left unassigned, which is how money quietly disappears." },
          { type:'widget', kind:'budgetSplitter', config:{ income:3500, needs:50, wants:30, goals:20 } },
          { type:'steps', items:[
            { title:'Add up your monthly take-home', text:"Your income after taxes — the real number you have to work with." },
            { title:'List every fixed expense', text:"Same amount each month: rent, car payment, insurance, subscriptions." },
            { title:'Estimate variable necessities', text:"Groceries, gas, utilities — average a few months if you can." },
            { title:"Assign what's left", text:"Split the remainder between wants and financial goals." },
            { title:'Make it total zero', text:"Add it up; if it doesn't equal your income, adjust until it does." }
          ] },
          { type:'keyIdea', title:'The #1 budget-killer: irregular expenses', text:"Annual subscriptions, car registration, and holiday gifts feel \"free\" because they aren't monthly — then they blindside you. Divide each annual cost by 12 and set that aside every month, so the money is already there when the bill lands." },
          { type:'takeaways', items:[
            "Assign every dollar — including savings — so nothing is unaccounted for.",
            "50/30/20 (needs / wants / goals) is a widely-used starting split to adjust from.",
            "Bank irregular expenses monthly (annual ÷ 12) so they never become emergencies."
          ] },
          { type:'tip', text:"Add up your irregular yearly costs and divide by 12: $600 car registration + $400 annual subscriptions + $800 holiday gifts = $1,800/year = $150/month set aside automatically. Then those bills never feel like emergencies." },
          { type:'check', q:"In the 50/30/20 guideline, what does the 20% go toward?", opts:[
            "Dining out and entertainment",
            "Housing and transportation",
            "Financial goals — emergency fund, retirement, debt paydown, saving",
            "Taxes and payroll deductions"
          ], ans:2, explain:"The 20% is for financial progress: building your emergency fund, contributing to retirement, paying debt beyond the minimums, and saving toward goals." },
          { type:'prose', html:'<p style="font-size:.72rem;color:var(--tx3);margin:0;">General financial education, not personalized financial advice. Figures like 50/30/20 are common guidelines — adjust them to your own situation.</p>' }
        ]
      },

      // ── L2 — Emergency Fund ──────────────────────────────────
      {
        id:'budget-emergency', matchTitle:'Emergency Fund — Why $1,000 Can Change Your Life',
        title:'Emergency Fund — Why $1,000 Can Change Your Life', duration:'6 min',
        blocks:[
          { type:'lead', text:"An emergency fund is the foundation of financial stability. Without it, any unexpected expense — a car repair, a medical bill, a lost job — becomes a crisis that forces debt and derails your goals. With it, the same event is merely an inconvenience." },
          { type:'keyIdea', title:'A two-stage approach', text:"Stage 1: a $1,000 starter fund handles most common emergencies and comes before any other saving or investing. Stage 2: once high-interest debt is paid, build toward 3–6 months of expenses. These are common guidelines — adjust to your situation." },
          { type:'widget', kind:'savingsGoal', config:{ target:1000, monthly:333, apy:4, expenses:2500 } },
          { type:'list', style:'check', items:[
            { strong:'Keep it in a high-yield savings account', text:"(HYSA) — these have recently paid around 4–5% APY, far more than a big-bank checking account." },
            { strong:'Separate from your checking', text:"so it's accessible within a day or two but not automatically spent." },
            { strong:'Not CDs or investments', text:"— an emergency fund has to stay liquid; you can't risk it being locked up or down when you need it." }
          ] },
          { type:'keyIdea', title:"It's mental-health infrastructure", text:"People with even a small savings cushion make better decisions across the board. The anxiety of zero savings affects thinking, relationships, and health — the fund protects far more than your wallet." },
          { type:'takeaways', items:[
            "Build a $1,000 starter fund first — it defuses most common emergencies.",
            "Then work toward 3–6 months of expenses in a liquid HYSA.",
            "Keep it at a separate bank so it isn't casually spent."
          ] },
          { type:'tip', text:"Keep the fund at a different bank from your checking, with no debit card attached. The 1–2 business-day transfer delay is a feature, not a bug — it stops the \"emergency\" fund from becoming the \"I really want this\" fund." },
          { type:'check', q:"A widely-recommended FIRST emergency-fund milestone is:", opts:[
            "$500",
            "$1,000 — enough to handle most common emergencies",
            "One month of expenses",
            "$5,000"
          ], ans:1, explain:"$1,000 is the common Stage-1 target: it covers most everyday emergencies (a car repair, a medical copay) and is built before other goals, which changes how you handle the unexpected." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // CREDIT & BANKING — full module elevated. cardPayoff (L4) is the
  // headline; utilizationMeter (L2); creditScoreBand (L1) + creditFactors
  // (L2) viz bars. Guidelines framed as guidelines; education-not-advice.
  // ═══════════════════════════════════════════════════════════════════
  credit: {
    key: 'credit',
    color: '#4ade80',
    lessons: [
      // ── L1 — What Is a Credit Score ──────────────────────────
      {
        id:'credit-score', matchTitle:'What Is a Credit Score — and Why It Controls More Than You Think',
        title:'What Is a Credit Score — and Why It Controls More Than You Think', duration:'6 min',
        blocks:[
          { type:'lead', text:"Your credit score is a three-digit number from 300 to 850 — a financial reputation score. Lenders use it to decide whether to approve you and at what interest rate, but its reach goes well beyond borrowing." },
          { type:'viz', kind:'creditScoreBand' },
          { type:'list', style:'check', items:[
            { strong:'Mortgage rate:', text:"a 760 might get 6.5% where a 620 gets 8.5% — about $180,000 more interest over 30 years on a $300k loan." },
            { strong:'Auto loans, rent, utilities:', text:"poor credit can add $100–$200/month to a car payment, trigger apartment rejections, and require utility deposits." },
            { strong:'Jobs and insurance:', text:"some finance/government/security roles check credit, and in most states your score affects car and home insurance rates." }
          ] },
          { type:'keyIdea', title:'FICO drives about 90% of lending', text:"You actually have several FICO versions — different ones for mortgages, auto loans, and cards — but they all come from the same underlying credit report." },
          { type:'takeaways', items:[
            "A 300–850 score quietly shapes borrowing, housing, some jobs, and insurance.",
            "Higher scores mean lower rates — worth tens of thousands over a lifetime.",
            "All your FICO versions trace back to one credit report."
          ] },
          { type:'tip', text:"Check your score free at CreditKarma or through your bank or card issuer — many now show a free FICO score. Checking your own is a \"soft inquiry\" and never affects your score; only a lender's \"hard inquiry\" causes a small temporary dip." },
          { type:'check', q:"Does checking your own credit score lower it?", opts:[
            "Yes, every check drops it a little",
            "No — checking your own is a soft inquiry that doesn't affect your score",
            "Only if you check more than once a month",
            "Only hard inquiries from checking raise it"
          ], ans:1, explain:"Looking at your own score is a soft inquiry with zero score impact. Only a lender's hard inquiry (when you apply for credit) causes a small, temporary dip." },
          { type:'prose', html:'<p style="font-size:.72rem;color:var(--tx3);margin:0;">General financial education, not personalized financial advice. Guidelines like “pay in full” and “utilization under 30%” are common rules of thumb — adjust to your situation.</p>' }
        ]
      },

      // ── L2 — The Five Factors ────────────────────────────────
      {
        id:'credit-factors', matchTitle:'The Five Factors That Build or Destroy Your Score',
        title:'The Five Factors That Build or Destroy Your Score', duration:'7 min',
        blocks:[
          { type:'lead', text:"Your score isn't mysterious — it's calculated from five specific, weighted factors. Knowing them lets you build your score on purpose instead of guessing why it moved." },
          { type:'viz', kind:'creditFactors' },
          { type:'list', style:'check', items:[
            { strong:'Payment history — 35%:', text:"on-time vs late, for up to 7 years. A single 30-day late can cost 50–100 points and lingers for years." },
            { strong:'Utilization — 30%:', text:"how much of your available credit you're using; it updates every billing cycle." },
            { strong:'Length of history — 15%:', text:"the age of your accounts — which is why closing old cards often hurts." },
            { strong:'Credit mix — 10% & new credit — 10%:', text:"a variety of credit types helps slightly; each new application is a small temporary dip." }
          ] },
          { type:'widget', kind:'utilizationMeter', config:{ balance:1500, limit:5000 } },
          { type:'keyIdea', title:'Utilization is the fastest lever you have', text:"Because it refreshes every cycle, paying a balance down (or raising a limit without spending more) can move your score within about 30 days. Aim under 30%; under 10% is excellent." },
          { type:'takeaways', items:[
            "Payment history (35%) and utilization (30%) are two-thirds of your score.",
            "Never pay late — autopay at least the minimum as a backstop.",
            "Lowering utilization is the quickest legitimate score boost."
          ] },
          { type:'tip', text:"The fastest honest improvement: drive utilization below 10% and make sure nothing is ever late. A 600 score can reach 720+ within about 12 months of consistent on-time payments and low utilization." },
          { type:'check', q:"Which factor carries the most weight in your FICO score?", opts:[
            "Credit utilization",
            "Length of credit history",
            "Payment history",
            "Credit mix"
          ], ans:2, explain:"Payment history is 35% — the single biggest factor. That's why even one missed payment hurts, and why on-time payments are the foundation of a good score." }
        ]
      },

      // ── L3 — Building Credit From Zero ───────────────────────
      {
        id:'credit-build', matchTitle:'Building Credit From Zero — A Step-by-Step Plan',
        title:'Building Credit From Zero — A Step-by-Step Plan', duration:'7 min',
        blocks:[
          { type:'lead', text:"Having no credit history is almost as limiting as bad credit — lenders have nothing to evaluate. Here's how to build from scratch, fastest and most effective first." },
          { type:'steps', items:[
            { title:'Become an authorized user', text:"Ask a trusted family member with good credit to add you to their card. You inherit their on-time history and account age — often a scoreable file within 1–2 billing cycles, even without using the card." },
            { title:'Get a secured card', text:"A $200–$500 deposit becomes your limit. Put one small recurring charge on it and pay the FULL balance every month. Most issuers upgrade you in 6–12 months and return the deposit (Discover It Secured, Capital One Secured — no annual fee)." },
            { title:'Consider a credit-builder loan', text:"Some credit unions let you \"borrow\" into a locked savings account; your payments build credit and you get the savings at the end (e.g. Self)." },
            { title:"Student card if you're in college", text:"Lower approval bar, real rewards, no annual fee — a solid first unsecured card." }
          ] },
          { type:'viz', kind:'dateTimeline', data:{ caption:'What building credit looks like over time', items:[
            { label:'Now', sub:'Authorized user added' },
            { label:'1–2 cycles', sub:'Scoreable file appears' },
            { label:'3–6 mo', sub:'Secured-card history building' },
            { label:'12–18 mo', sub:'670+ (Good)', highlight:true }
          ] } },
          { type:'keyIdea', title:'The cardinal rule', text:"Only charge what you already have the cash to pay off right now. Use the card like a debit card that also builds credit — never spend money you don't have for rewards or \"I'll pay it later.\"" },
          { type:'takeaways', items:[
            "Authorized-user status is the fastest way to a score from zero.",
            "A secured card paid in full monthly builds credit in 3–6 months; 670+ in 12–18.",
            "Treat the card like a debit card — charge only what you can already cover."
          ] },
          { type:'tip', text:"The one habit that protects your score forever: set autopay for the FULL statement balance on every card — not the minimum. It eliminates interest, keeps utilization low, and guarantees you never miss a payment." },
          { type:'check', q:"What's the cardinal rule for using a card to build credit?", opts:[
            "Carry a small balance to show activity",
            "Only charge what you already have the cash to pay off now",
            "Use as much of the limit as possible",
            "Pay only the minimum to keep cash free"
          ], ans:1, explain:"Use the card like a debit card — charge only what you can already cover and pay it in full. Carrying a balance just costs interest; it doesn't help your score." }
        ]
      },

      // ── L4 — Credit Cards: Interest, Minimums (headline) ─────
      {
        id:'credit-cards', matchTitle:'Credit Cards — Interest, Minimums, and How to Use Them Correctly',
        title:'Credit Cards — Interest, Minimums, and How to Use Them Correctly', duration:'8 min',
        blocks:[
          { type:'lead', text:"Used right, a credit card is an interest-free 30-day loan with rewards and fraud protection. Used wrong, it's 20–30% debt that takes years to escape. The difference is entirely in how you use it — and the math is stark." },
          { type:'keyIdea', title:'Pay in full and you pay zero interest', text:"When you pay the full statement balance every month, you owe no interest and keep the rewards. The moment you carry a balance, the interest dwarfs any cash back." },
          { type:'widget', kind:'cardPayoff', config:{ balance:3000, apr:22, payment:150 } },
          { type:'keyIdea', title:'The minimum-payment trap', text:"Minimum payments are designed to keep you in debt: most of each one is interest, so a few-thousand-dollar balance at a typical card APR can take well over a decade to clear and more than double what you paid for the purchases. Try the calculator above — switching from the minimum to a fixed higher payment collapses both the years and the interest." },
          { type:'list', style:'check', items:[
            { strong:'If you already carry a balance:', text:"stop using the card for new purchases, then attack the debt." },
            { strong:'Avalanche', text:"— highest interest rate first (mathematically optimal)." },
            { strong:'Snowball', text:"— smallest balance first (psychologically motivating). The method matters less than paying extra every month, consistently." }
          ] },
          { type:'takeaways', items:[
            "Paying the full statement balance monthly = zero interest + rewards.",
            "Paying only the minimum can turn $3,000 into ~$8,500 over ~19 years.",
            "Carrying a balance? Stop charging, then attack it (avalanche or snowball)."
          ] },
          { type:'tip', text:"Card rewards are funded largely by the interest paid by the ~55% of cardholders who carry a balance. Be in the ~45% who pay in full — they get the rewards without paying for them." },
          { type:'check', q:"What's the only way to use a credit card that costs you nothing in interest?", opts:[
            "Pay the minimum on time every month",
            "Pay the full statement balance every month",
            "Keep utilization under 30%",
            "Use a card with no annual fee"
          ], ans:1, explain:"Paying the full statement balance each month means zero interest — you're using the card as a free 30-day loan. The minimum still leaves a balance accruing interest." }
        ]
      },

      // ── L5 — Your Credit Report ──────────────────────────────
      {
        id:'credit-report', matchTitle:'Your Credit Report — Reading It and Disputing Errors',
        title:'Your Credit Report — Reading It and Disputing Errors', duration:'6 min',
        blocks:[
          { type:'lead', text:"Your score is calculated from your credit report — and about 1 in 4 people has an error big enough to hurt it, while most have never looked. You're legally entitled to check for free." },
          { type:'keyIdea', title:'The only official free source', text:"AnnualCreditReport.com is the federally mandated site — free reports from all three bureaus (Equifax, Experian, TransUnion), one each per year. Stagger them: pull one bureau every four months to monitor all year for free." },
          { type:'viz', kind:'dateTimeline', data:{ caption:'Stagger your 3 free reports — one every ~4 months, year-round', items:[
            { label:'Month 1', sub:'Equifax' },
            { label:'Month 5', sub:'Experian' },
            { label:'Month 9', sub:'TransUnion' }
          ] } },
          { type:'list', style:'check', items:[
            { strong:'Accounts you never opened', text:"— a red flag for identity theft." },
            { strong:'On-time payments marked late,', text:"wrong balances or limits, or closed accounts shown as open." },
            { strong:'Wrong personal info, duplicates,', text:"or negative items past the 7-year limit (bankruptcies, 10 years)." }
          ] },
          { type:'steps', items:[
            { title:'Dispute with the bureau', text:"Submit online at the bureau's site with any supporting documents; they must investigate within 30 days and remove or correct anything they can't verify." },
            { title:'Also dispute with the lender', text:"The company that reported the error reports to all three bureaus, so notify them too." }
          ] },
          { type:'keyIdea', title:'A freeze beats a fraud alert', text:"If you find accounts you never opened, a credit freeze (free, indefinite) is the strongest protection — no one can open new credit in your name. You freeze and unfreeze online in minutes at each bureau." },
          { type:'takeaways', items:[
            "Check free at AnnualCreditReport.com — the only official source.",
            "Look for unknown accounts, wrong late marks, and stale negatives.",
            "Dispute errors within 30 days; freeze your credit to block identity theft."
          ] },
          { type:'tip', text:"If you're not actively applying for credit, consider a freeze on all three bureaus. It's free, doesn't affect your score, and is the most effective identity-theft prevention there is — just unfreeze when you need to apply, then refreeze." },
          { type:'check', q:"What's the only official site for truly free credit reports?", opts:[
            "CreditKarma.com",
            "The three bureaus' marketing sites",
            "AnnualCreditReport.com",
            "Your bank's app"
          ], ans:2, explain:"AnnualCreditReport.com is the one federally mandated free source for reports from all three bureaus. Other sites may be useful but aren't the official free-report channel." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // COLLEGE & FUTURE — full module elevated. One calculator (Student Loan
  // Math); paths comparison (valueBars); FAFSA/Resume as steps; the rest
  // honest structured prose. Faithful to existing content — no new claims
  // or figures; aid/loan figures kept illustrative, not advice.
  // ═══════════════════════════════════════════════════════════════════
  college: {
    key: 'college',
    color: '#fde68a',
    lessons: [
      // ── L1 — Is College Right for You? (paths) ───────────────
      {
        id:'college-paths', matchTitle:'Is College Right for You?',
        title:'Is College Right for You?', duration:'5 min',
        blocks:[
          { type:'lead', text:"There's more than one good path after high school — the right one depends on where you want to end up, not on what everyone else is doing." },
          { type:'compare',
            left:{ title:'A 4-year degree is required for', points:['Medicine','Law','Engineering','Teaching'] },
            right:{ title:'Strong alternatives', points:['Community college — then transfer','Trade school — electricians/plumbers earn $60–100k+','Military — training plus the GI Bill'] } },
          { type:'viz', kind:'valueBars', data:{ mode:'compare', unit:'%', caption:'Relative cost of the first two years (illustrative)', items:[
            { label:'4-year college', value:100 },
            { label:'Community college, then transfer', value:35, highlight:true, note:'Roughly 60–70% cheaper for the first two years.' }
          ] } },
          { type:'takeaways', items:[
            "Some careers require a 4-year degree; many don't.",
            "Community college first can cut the cost of the early years sharply.",
            "Trade school and the military are real, well-paying paths too."
          ] },
          { type:'check', q:"Which path is required to become a doctor, lawyer, or engineer?", opts:[
            "A trade-school certificate",
            "A 4-year degree (and beyond)",
            "Military service",
            "Community college only"
          ], ans:1, explain:"Medicine, law, and engineering require a 4-year degree (and usually more). Many other good careers don't — trades, the military, and community-college routes are all strong options." }
        ]
      },

      // ── L2 — Choosing a Major Wisely (prose) ─────────────────
      {
        id:'college-major', matchTitle:'Choosing a Major Wisely',
        title:'Choosing a Major Wisely', duration:'5 min',
        blocks:[
          { type:'lead', text:"A major is a big bet on your future — make it with your eyes open, not just on what sounds interesting in the moment." },
          { type:'keyIdea', title:'Ask where it leads — before you commit', text:"What jobs does this major lead to? What's the starting salary? Will it cover your loan payments? Answer those first." },
          { type:'list', style:'check', items:[
            { strong:'Talk to 3 people', text:"who actually WORK in that field — not just professors or admissions." },
            { strong:'Follow the path to a job,', text:"not just the subject you enjoy in class." }
          ] },
          { type:'takeaways', items:[
            "Pick a major for where it leads, not just because it sounds interesting.",
            "Check the jobs and the starting salary it realistically opens.",
            "Talk to people doing the actual work before you commit."
          ] },
          { type:'tip', text:"Don't choose a major just because it sounds interesting. Know where it leads." },
          { type:'check', q:"Before committing to a major, the smartest move is to:", opts:[
            "Pick whatever sounds most interesting",
            "Ask what jobs and salary it leads to, and talk to people in the field",
            "Choose the one with the easiest classes",
            "Decide based on which has the nicest building"
          ], ans:1, explain:"Find out where the major actually leads — the jobs, the starting pay, whether it covers loan payments — and talk to people doing that work." }
        ]
      },

      // ── L3 — FAFSA (procedural / steps) ──────────────────────
      {
        id:'college-fafsa', matchTitle:'FAFSA',
        title:'FAFSA — The Form That Unlocks Aid', duration:'5 min',
        blocks:[
          { type:'lead', text:"The FAFSA is the form that unlocks financial aid — grants, work-study, and loans. Filing it is one of the highest-value things you can do for paying for college." },
          { type:'steps', items:[
            { title:'File every single year', text:"Aid isn't automatic — you re-file each year you're in school." },
            { title:'It opens October 1', text:"File as early as you can — some aid runs out." },
            { title:"It's based on family income", text:"That's what determines how much help you qualify for." },
            { title:'It decides your aid mix', text:"Grants (free money), work-study, and loans all flow from it." }
          ] },
          { type:'keyIdea', title:'Grants are free money', text:"The FAFSA can qualify you for grants you never repay — so file even if you assume you won't qualify." },
          { type:'takeaways', items:[
            "File the FAFSA every year, as early after October 1 as you can.",
            "It determines grants, work-study, and loans based on family income.",
            "Grants are free money — never skip the form that unlocks them."
          ] },
          { type:'check', q:"How often should you file the FAFSA, and when does it open?", opts:[
            "Once, ever — when it opens in January",
            "Every year — it opens October 1",
            "Only if you want loans — opens in spring",
            "Every two years — opens in summer"
          ], ans:1, explain:"File every single year, and do it as early as you can after it opens on October 1, since some aid runs out." }
        ]
      },

      // ── L4 — Student Loan Math (RICH: calculator) ────────────
      {
        id:'college-loans', matchTitle:'Student Loan Math',
        title:'Student Loan Math', duration:'6 min',
        blocks:[
          { type:'lead', text:"Loans can make college possible — but the monthly payment after graduation is real money. Know the math before you borrow." },
          { type:'widget', kind:'loanCalculator', config:{ amount:37000, rate:6.5, years:10 } },
          { type:'keyIdea', title:'The borrowing rule of thumb', text:"Try not to borrow more in total than you expect to earn in your first year out of school — that keeps the monthly payment manageable. (For example, about $37,000 at 6.5% over 10 years is roughly $420 a month.)" },
          { type:'takeaways', items:[
            "Every dollar borrowed comes back as a monthly payment plus interest.",
            "A common guideline: don't borrow more in total than your expected first-year salary.",
            "Federal loans usually beat private ones for rates and repayment options."
          ] },
          { type:'tip', text:"Always choose federal over private loans when you can — better rates, income-driven repayment, and forgiveness programs." },
          { type:'check', q:"A smart rule of thumb for how much to borrow in total is:", opts:[
            "Whatever the school will lend you",
            "No more than your expected first-year salary",
            "Double your expected first-year salary",
            "It doesn't matter — loans are deferred"
          ], ans:1, explain:"Keeping total borrowing at or below your expected first-year salary keeps the monthly payment manageable after graduation." },
          { type:'prose', html:'<p style="font-size:.72rem;color:var(--tx3);margin:0;">General information, not financial or admissions advice. The example figures ($37,000, 6.5%, 10 years) are illustrative only — not current rates.</p>' }
        ]
      },

      // ── L5 — Scholarships (prose) ────────────────────────────
      {
        id:'college-scholarships', matchTitle:'Scholarships',
        title:'Scholarships', duration:'5 min',
        blocks:[
          { type:'lead', text:"Scholarships are free money you never repay — and a lot of it goes unclaimed simply because people don't apply." },
          { type:'list', style:'check', items:[
            { strong:'Apply to every one', text:"you're eligible for — including the small $500 ones." },
            { strong:'Local foundation scholarships', text:"have way less competition than the big national ones." },
            { strong:'Search Fastweb.com and scholarships.com', text:"to find ones that match you." }
          ] },
          { type:'keyIdea', title:'Small + local = better odds', text:"Local and small-dollar scholarships get far fewer applicants, so your odds are much higher — and they add up." },
          { type:'takeaways', items:[
            "Scholarships are free money — apply widely, even to small ones.",
            "Local and small awards are the most winnable (less competition).",
            "Use Fastweb and scholarships.com to find matches."
          ] },
          { type:'check', q:"Why are local, small-dollar scholarships often the smartest to chase?", opts:[
            "They pay the most",
            "They have far less competition, and they add up",
            "They don't require an application",
            "They're the only ones that are free money"
          ], ans:1, explain:"Local and small ($500) scholarships get far fewer applicants, so your odds are much higher — and several of them add up." }
        ]
      },

      // ── L6 — Surviving First Year (prose) ────────────────────
      {
        id:'college-firstyear', matchTitle:'Surviving First Year',
        title:'Surviving First Year', duration:'5 min',
        blocks:[
          { type:'lead', text:"The first year sets the tone for everything after it. A few simple habits make the difference between thriving and drifting." },
          { type:'list', style:'check', items:[
            { strong:'Go to every class', text:"— attendance alone keeps most students on track." },
            { strong:'Visit professors in office hours', text:"— they remember the students who show up." },
            { strong:'Find your community in the first 2 weeks', text:"— it's much harder to do later." },
            { strong:'Find a church before you need it,', text:"and call home regularly." }
          ] },
          { type:'takeaways', items:[
            "Show up — to class and to office hours.",
            "Build your community early, in the first two weeks.",
            "Stay connected to home and to faith."
          ] },
          { type:'check', q:"When is the best time to find your community in your first year?", opts:[
            "Toward the end of the year",
            "In the first two weeks",
            "Only after grades come out",
            "It doesn't matter when"
          ], ans:1, explain:"Find your community in the first two weeks — it's much harder to break in once groups have already formed." }
        ]
      },

      // ── L7 — GPA Still Matters (prose) ───────────────────────
      {
        id:'college-gpa', matchTitle:'GPA Still Matters',
        title:'GPA Still Matters', duration:'4 min',
        blocks:[
          { type:'lead', text:"Your GPA isn't everything — but especially early on, it quietly opens or closes doors." },
          { type:'keyIdea', title:'A 3.5+ opens doors', text:"A 3.5 or higher opens graduate school, top internships, and competitive employers. Most ask for your GPA on first-job applications." },
          { type:'keyIdea', title:'…then it fades', text:"After 3–5 years of work experience, your GPA matters much less. Early grades buy you options; your experience takes over from there." },
          { type:'takeaways', items:[
            "Early on, a strong GPA (3.5+) unlocks internships, grad school, and first jobs.",
            "First-job applications usually still ask for it.",
            "After a few years of experience, it fades in importance."
          ] },
          { type:'check', q:"When does your GPA matter the MOST?", opts:[
            "Throughout your entire career equally",
            "Early — for internships, grad school, and first jobs",
            "Only after 5+ years of experience",
            "It never really matters"
          ], ans:1, explain:"Early on it gates internships, grad school, and first jobs; after 3–5 years of experience it matters much less." }
        ]
      },

      // ── L8 — Building Resume in College (steps) ──────────────
      {
        id:'college-resume', matchTitle:'Building Resume in College',
        title:'Building Your Resume in College', duration:'5 min',
        blocks:[
          { type:'lead', text:"By the time you graduate, what you DID matters more than your grades. Build the resume while you're still in school." },
          { type:'keyIdea', title:'Internships > grades after graduation', text:"On a post-graduation resume, internships beat GPA — employers want to see that you've actually done the work." },
          { type:'steps', items:[
            { title:'Start internships sophomore year', text:"Don't wait until senior year — begin pursuing them early." },
            { title:'Join 1–2 career-related clubs', text:"Pick ones tied to where you want to work." },
            { title:'Seek leadership roles', text:"Leading something — even small — stands out." },
            { title:'Build and update LinkedIn', text:"Keep it current every semester." }
          ] },
          { type:'takeaways', items:[
            "After graduation, internships outweigh grades on a resume.",
            "Start sophomore year; join a club or two and seek leadership.",
            "Keep LinkedIn updated every semester."
          ] },
          { type:'check', q:"When should you start pursuing internships?", opts:[
            "Senior year, right before graduating",
            "Sophomore year",
            "Only after you graduate",
            "Whenever you happen to have time"
          ], ans:1, explain:"Start sophomore year — internships matter more than grades on a post-graduation resume, so begin building them early." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════
  // HOME REPAIRS & DIY — full module elevated. This is the diagram-and-
  // steps module: every lesson is procedural, so each carries a schematic
  // diagram and (where there's a real sequence) animated illustratedSteps.
  // Electrical (L5) and water (L6) get safety blocks handled with the same
  // care as the Car jump-start / grease-fire warnings. Content is faithful
  // to SK_DATA.diy — no new claims.
  // ═══════════════════════════════════════════════════════════════════
  diy: {
    key: 'diy',
    color: '#78716c',
    lessons: [
      // ── L1 — Basic Tool Kit (identification) ─────────────────
      {
        id:'diy-toolkit', matchTitle:'Your Basic Tool Kit — What Every Person Should Own',
        title:'Your Basic Tool Kit — What Every Person Should Own', duration:'6 min',
        blocks:[
          { type:'lead', text:"You don't need a garage full of tools. About a dozen items handle the overwhelming majority of everyday home tasks — hanging things, tightening things, small repairs — and the whole kit fits in one box." },
          { type:'keyIdea', title:'Twelve items, ~90% of home jobs', text:"A solid starter kit runs about $50–80. The single most versatile piece is a cordless drill ($40–60) — it drives screws, drills holes, and saves you more time than anything else in the box." },
          { type:'diagram', kind:'toolGrid' },
          { type:'list', style:'check', items:[
            { strong:'Hammer', text:"and a tape measure — the two you'll reach for most." },
            { strong:'Screwdrivers:', text:"Phillips and flathead, or a single multi-bit driver." },
            { strong:'Adjustable wrench, pliers,', text:"and a set of Allen (hex) wrenches." },
            { strong:'Utility knife and a level', text:"— for clean cuts and hanging things straight." },
            { strong:'Duct tape, electrical tape, and WD-40', text:"— the three that fix or free almost anything." },
            { strong:'A cordless drill', text:"— your most versatile tool by far." }
          ] },
          { type:'tip', text:"You don't need professional-grade tools for home repairs. Buy basics cheap at Harbor Freight, or find quality used tools at estate sales and on Facebook Marketplace." },
          { type:'takeaways', items:[
            "A dozen tools cover almost every household job — you don't need more to start.",
            "A cordless drill is the highest-value tool in the kit.",
            "Buy basic-grade and used; you don't need pro tools for home repairs."
          ] },
          { type:'check', q:"What's the single most versatile tool in a starter kit?", opts:[
            "A hammer",
            "A cordless drill",
            "An adjustable wrench",
            "A level"
          ], ans:1, explain:"A cordless drill drives screws and bores holes — it does more, faster, than anything else in the box, which is why it's the one power tool worth buying first." }
        ]
      },

      // ── L2 — Unclog a Drain (procedural + escalation) ────────
      {
        id:'diy-drain', matchTitle:'Unclog a Drain — Without Calling a Plumber',
        title:'Unclog a Drain — Without Calling a Plumber', duration:'6 min',
        blocks:[
          { type:'lead', text:"A plumber can charge $150–300 for a clog you can often clear yourself in about ten minutes. The trick is knowing that bathroom and kitchen clogs have different causes — and different fixes." },
          { type:'keyIdea', title:'The clog lives in the trap', text:"Under every sink is a U-shaped pipe — the P-trap. It holds a little water that blocks sewer gas, and it's exactly where hair and grease collect. That's the spot you're clearing." },
          { type:'diagram', kind:'pTrap' },
          { type:'illustratedSteps', steps:[
            { num:1, text:"Bathroom sink or tub — the clog is almost always hair. Remove the drain cover and pull out the hair. For deeper clogs, work a $3 plastic drain snake (a \"Zip-It\") down and pull the gunk back up, then run hot water for 2 minutes." },
            { num:2, text:"Kitchen sink — grease and food. Pour half a cup of baking soda down the drain, then half a cup of white vinegar. Give it 15 minutes to fizz and break the grease down." },
            { num:3, text:"Flush with a kettle of boiling water. If it's still slow, work a flat-bottom sink plunger over the drain to push the clog free." }
          ] },
          { type:'safety', title:'When to stop and call a plumber', text:"Call a pro if several drains clog at the same time, water backs up into other drains or fixtures, you smell sewage, or you've already tried everything twice. Those point to a blockage deep in the main line — not the trap — and forcing it can make things worse." },
          { type:'takeaways', items:[
            "Bathroom clogs are hair; kitchen clogs are grease — clear them differently.",
            "Baking soda + vinegar + boiling water clears most kitchen drains for pennies.",
            "Multiple drains backing up at once means the main line — call a plumber."
          ] },
          { type:'check', q:"Which sign means you should call a plumber instead of trying again?", opts:[
            "One bathroom sink drains slowly",
            "Several drains back up at the same time",
            "The water is a little cloudy",
            "It took two tries to clear"
          ], ans:1, explain:"Several drains backing up together (or sewage smell, or water rising in other fixtures) points to a blockage in the main line — deeper than the trap, and a job for a plumber." }
        ]
      },

      // ── L3 — Fix a Running Toilet (procedural, water) ────────
      {
        id:'diy-toilet', matchTitle:'Fix a Running Toilet — The Most Common Home Repair',
        title:'Fix a Running Toilet — The Most Common Home Repair', duration:'6 min',
        blocks:[
          { type:'lead', text:"A running toilet is the most common home repair there is — and one of the cheapest to fix. Left alone it can waste around 200 gallons a day and add $100 or more to a monthly water bill." },
          { type:'keyIdea', title:'Usually a $5 flapper', text:"The flapper is the rubber seal at the bottom of the tank. When it stops sealing, water trickles past nonstop — that's the running sound. Replacing it takes about ten minutes and costs $5–15." },
          { type:'diagram', kind:'toiletTank' },
          { type:'illustratedSteps', steps:[
            { num:1, text:"Turn off the water at the shut-off valve on the supply line behind the toilet (clockwise to close)." },
            { num:2, text:"Flush to empty the tank so you can work dry." },
            { num:3, text:"Unhook the old flapper from the flush valve and unclip its chain from the handle lever." },
            { num:4, text:"Hook on the new flapper ($5), reconnect the chain, turn the water back on, and test a flush." }
          ] },
          { type:'tip', text:"If a new flapper doesn't fix it, the fill valve may need adjusting or replacing ($8–15). Search YouTube for your specific toilet model — someone has filmed the exact part." },
          { type:'takeaways', items:[
            "A running toilet is usually a worn flapper — a $5, ten-minute fix.",
            "Always shut off the supply valve and flush the tank empty before you start.",
            "If the flapper isn't it, look at the fill valve next."
          ] },
          { type:'check', q:"What's the most common cause of a running toilet?", opts:[
            "A cracked tank",
            "A worn flapper that no longer seals",
            "Low water pressure",
            "A clogged drain"
          ], ans:1, explain:"A worn flapper stops sealing the flush valve, so water trickles past continuously. Swapping it ($5) fixes the large majority of running toilets." }
        ]
      },

      // ── L4 — Patch a Wall Hole (procedural) ──────────────────
      {
        id:'diy-drywall', matchTitle:'Patch a Wall Hole — From Nail Holes to Fist-Sized Damage',
        title:'Patch a Wall Hole — From Nail Holes to Fist-Sized Damage', duration:'7 min',
        blocks:[
          { type:'lead', text:"Knowing how to patch drywall is what saves your security deposit. The method scales with the damage — a nail hole, a doorknob ding, and a fist-sized hole each need a different approach." },
          { type:'list', style:'check', items:[
            { strong:'Small (nail/screw):', text:"fill with lightweight spackle, let it dry ~30 min, sand smooth, touch up paint. About $5, five minutes." },
            { strong:'Medium (1–3 inches):', text:"use a drywall patch kit ($5–8) — spackle over the mesh in thin layers, sanding between, then paint." },
            { strong:'Large (3+ inches):', text:"this one needs a backer board and joint compound — the steps below." }
          ] },
          { type:'diagram', kind:'drywallPatch' },
          { type:'illustratedSteps', steps:[
            { num:1, text:"Cut a clean square around the damage, then cut a matching piece of drywall to fit the opening." },
            { num:2, text:"Slip a backer board behind the hole and screw it to the back of the existing drywall so it can't shift." },
            { num:3, text:"Screw the patch to the backer board, then cover the seams with mesh tape." },
            { num:4, text:"Spread joint compound in 2–3 thin coats, sanding between each and feathering it wider than the patch so it blends in. Prime, then paint." }
          ] },
          { type:'takeaways', items:[
            "Match the method to the hole — spackle for nails, a kit for mid-size, backer + compound for large.",
            "A fist-sized hole needs a backer board behind it before the patch goes on.",
            "Thin coats sanded and feathered wide are what make a patch disappear."
          ] },
          { type:'check', q:"For a fist-sized hole, what goes in first?", opts:[
            "Spackle smeared straight across the gap",
            "A backer board screwed behind the hole",
            "Mesh tape over the opening",
            "A coat of primer"
          ], ans:1, explain:"A large hole has nothing to hold filler, so you first screw a backer board behind it, then screw the patch to that backer before taping and compounding." }
        ]
      },

      // ── L5 — Circuit Breaker + Electrical Safety (SAFETY) ────
      {
        id:'diy-breaker', matchTitle:'Reset a Circuit Breaker and Basic Electrical Safety',
        title:'Reset a Circuit Breaker and Basic Electrical Safety', duration:'7 min',
        blocks:[
          { type:'lead', text:"When the power dies in one room while the rest of the house is fine, it's almost never an outage — it's a tripped breaker, and resetting it takes about thirty seconds once you know what to look for." },
          { type:'keyIdea', title:'One dark room = one tripped breaker', text:"A breaker trips to protect the circuit when it's overloaded, shorted, or hit by a ground fault. The power company isn't involved — the fix is at your own panel." },
          { type:'safety', title:'Resetting is safe — touching wiring is not', text:"Flipping a tripped breaker is safe; you're only moving a switch. But never touch wiring itself unless you've shut off its breaker AND confirmed the circuit is dead with a non-contact voltage tester — water and electricity kill. If a breaker trips again right after you reset it, or an outlet is warm or scorched, stop and call a licensed electrician instead of resetting it again." },
          { type:'diagram', kind:'breakerPanel' },
          { type:'illustratedSteps', steps:[
            { num:1, text:"Find your electrical panel — usually a grey metal door in a basement, garage, utility closet, or hallway." },
            { num:2, text:"Look for the one breaker sitting in the middle position, not lined up with its neighbors. That's the tripped one." },
            { num:3, text:"Flip it fully OFF first — you'll feel it click — then flip it back ON. A breaker only resets from the full-off position." }
          ] },
          { type:'list', style:'check', items:[
            { strong:'Never touch wires', text:"you're not certain are dead." },
            { strong:"Don't overload power strips", text:"— daisy-chaining strips together is a fire hazard." },
            { strong:'Replace frayed cords', text:"rather than taping over them." },
            { strong:'A warm outlet', text:"is a warning — stop using it and call an electrician." }
          ] },
          { type:'takeaways', items:[
            "A tripped breaker rests in the middle; reset it by flipping fully OFF, then ON.",
            "A breaker that keeps tripping is a problem to diagnose, not to keep resetting.",
            "Treat wiring as live until a voltage tester proves it dead — water and electricity kill."
          ] },
          { type:'check', q:"How do you reset a tripped breaker?", opts:[
            "Tap it gently toward ON",
            "Flip it fully OFF first, then back ON",
            "Hold it in the middle for ten seconds",
            "Turn off the main breaker first"
          ], ans:1, explain:"A tripped breaker sits in the middle and won't re-energize from there. Flip it all the way OFF (you'll feel the click), then back ON." }
        ]
      },

      // ── L6 — Stop a Leak + Shut-Off Valves (SAFETY/urgency) ──
      {
        id:'diy-shutoff', matchTitle:'Stop a Leak and Know Your Shut-Off Valves',
        title:'Stop a Leak and Know Your Shut-Off Valves', duration:'7 min',
        blocks:[
          { type:'lead', text:"Water damage is the #1 home insurance claim in America, and a burst line floods a room in minutes. The single most valuable thing you can do is find your main water shut-off before you ever need it." },
          { type:'safety', title:'Find your main shut-off now — before you need it', text:"Locate the main water shut-off today — it's usually near the meter, in a basement, crawl space, or outside. Turn it clockwise to stop all water to the house. Shut the water off before any plumbing repair, and make sure everyone in the home knows where that valve is." },
          { type:'diagram', kind:'shutoffValve' },
          { type:'illustratedSteps', steps:[
            { num:1, text:"For a leaking faucet — usually a worn washer — shut off the water at the stop valves under the sink before you take anything apart." },
            { num:2, text:"Disassemble the handle and find the small rubber washer that's worn out." },
            { num:3, text:"Replace the washer ($1), reassemble the handle, and turn the water back on to test." }
          ] },
          { type:'list', style:'check', items:[
            { strong:'Leaking pipe joint:', text:"tighten the fitting first; if it still weeps, wrap it with plumber's tape ($2) and retighten." },
            { strong:'Cracked pipe:', text:"wrap it with self-fusing silicone tape to hold it until a plumber arrives." },
            { strong:'Any major leak:', text:"shut the main valve first, then fix or call — stopping the water is always step one." }
          ] },
          { type:'takeaways', items:[
            "Know where your main shut-off is and which way it turns — clockwise to close.",
            "A dripping faucet is usually a $1 washer; shut off the under-sink valves first.",
            "For pipe leaks, stop the water before anything else — it's always step one."
          ] },
          { type:'check', q:"Which way do you turn the main valve to shut the water off?", opts:[
            "Counter-clockwise",
            "Clockwise",
            "Pull it straight out",
            "It doesn't matter"
          ], ans:1, explain:"Righty-tighty — turn the main shut-off clockwise to close it and stop all water to the house. Find it and try it once before an emergency makes you hunt for it." }
        ]
      }
    ]
  }
};

if(typeof window !== 'undefined'){ window.SK_SPECS = SK_SPECS; }
