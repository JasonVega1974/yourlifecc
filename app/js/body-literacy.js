/* =============================================================
   body-literacy.js — Health Inc 6 (2026-06-08)
   ─────────────────────────────────────────────────────────────
   Educational body-literacy content for the Health → Body sub-tab.

   PRINCIPLES (locked):
   • Privacy-first. Reading is logged once per topic per kid lifetime
     to D.activityLog (for parent engagement visibility) — but parent
     never sees WHAT was read, only the topic title + count.
   • Age-appropriate, factual, calm. Tone target: trusted older
     sister explaining something. No euphemisms, no jargon dumps,
     no shame language.
   • Adapts by D.profile.sex ('M'/'F'/'O'/''). Sex-specific sections
     surface for matching profiles; 'O' or empty profiles see both.
     The full topic body is always available — adaptation is purely
     about which sub-section is emphasized first.
   • Faith sub-line per topic, optional, gated by D.faithMode !== false.
   • 👍/👎 micro-feedback stored in D.bodyLiteracyFeedback for
     content iteration (kid-private).

   Activity logging:
     logFamilyActivity('health', 'body_literacy_viewed',
                       topicTitle, { topicId })
     Fires on the FIRST open of each topic per kid lifetime so the
     parent feed gets exactly one entry per topic. Re-opens are
     silent.

   Inc 7 (gated period tracker) lives in a separate file and is NOT
   referenced here.
============================================================= */

(function(){
  'use strict';

  // ── Content ──────────────────────────────────────────────────
  // Each topic carries:
  //   id          stable string (used in D.bodyLiteracyViewed key)
  //   icon        emoji header
  //   title       short displayable title
  //   preview     1-line teaser shown on the grid card
  //   body        { general?: paragraphs[], bySex?: { F: paragraphs[],
  //                  M: paragraphs[] } } — body sections rendered in
  //                  order: bySex (matching sex) → general
  //   faithLine   { ref, text } | null — only renders when faithMode on
  //   tieIn       optional { label, sub } — points to another Health
  //                  sub-tab for related action
  //
  // Tone guardrails for any edit:
  //   - Specific over general ("oil production goes up" beats "skin changes")
  //   - No euphemism — say what it is in plain English
  //   - No "don't worry" / "totally fine" reflexes; ground reassurance
  //     in observation ("this is what your body is supposed to do at
  //     this age")
  //   - For "when to talk to a doctor" sections, be CONCRETE
  const BODY_TOPICS = [
    {
      id: 'puberty-basics',
      icon: '🌱',
      title: 'Puberty basics',
      preview: 'What\'s happening, why, and when',
      body: {
        general: [
          'Puberty is the body\'s natural shift from childhood to adulthood. It usually starts somewhere between 8 and 14, and lasts a few years. Everyone\'s timing is different — that\'s not a measure of anything important.',
          'You\'ll probably notice a growth spurt first, plus changes in skin (more oil, sometimes acne), hair in new places, sweat, and mood. Some changes are obvious. Others happen quietly over months.',
          'Hormones are the messengers driving all of it — mainly estrogen and testosterone, in different amounts. Both bodies produce both hormones; the ratio is what shifts.'
        ],
        bySex: {
          F: [
            'For girls, the first signs usually include breast buds (small tender lumps under the nipple area) and a growth spurt. Periods typically start about 2 years after those first signs.'
          ],
          M: [
            'For boys, the first signs usually include the testicles getting larger and a growth spurt. Voice changes, facial hair, and broader shoulders come over the next few years.'
          ]
        }
      },
      faithLine: { ref: 'Psalm 139:14', text: 'I praise you, for I am fearfully and wonderfully made.' }
    },

    {
      id: 'anatomy-primer',
      icon: '🫀',
      title: 'What\'s changing inside',
      preview: 'A simple map of what\'s growing and why',
      body: {
        general: [
          'Most of puberty\'s changes happen inside, not outside. Your reproductive system is maturing, your bones are getting denser, your brain is rewiring (especially the parts that handle planning and emotion), and your heart and lungs are getting more efficient.',
          'The internal changes are what drive the visible ones. The hormones doing the work are made in places you don\'t see — the brain\'s pituitary gland kicks it off, and the ovaries (girls) or testes (boys) produce most of the sex hormones.'
        ],
        bySex: {
          F: [
            'For girls: the ovaries start releasing one egg roughly once a month — that\'s the cycle. The uterus prepares a lining each month in case of pregnancy; if there\'s no pregnancy, the lining sheds (your period). Fallopian tubes connect the ovaries to the uterus. None of this requires you to think about it — it runs on its own.',
            'Breast tissue develops in stages and can be uneven for a while — one side often grows faster than the other before they catch up. That\'s normal.'
          ],
          M: [
            'For boys: the testicles start producing sperm and most of the body\'s testosterone. The voice box (larynx) grows larger, which is why the voice deepens and sometimes cracks while it\'s settling. Erections become more frequent at this age and are not a signal of anything you\'re doing or thinking — they\'re part of the system warming up.',
            'Shoulders broaden, muscle mass increases, and body hair fills in over a few years. Most of the change happens between ages 12 and 17, but the timeline varies.'
          ]
        }
      },
      faithLine: { ref: 'Psalm 139:13', text: 'For you formed my inward parts; you knitted me together in my mother\'s womb.' }
    },

    {
      id: 'is-this-normal',
      icon: '💭',
      title: 'Is this normal?',
      preview: 'Acne, sweat, voice, mood — the common stuff',
      body: {
        general: [
          'ACNE — Yes. Hormones boost oil production in your skin. Wash your face twice a day with a gentle cleanser, don\'t scrub hard, and don\'t pick. If it gets severe or painful, or if it\'s affecting your confidence, a doctor can help.',
          'BODY ODOR — Yes. Your sweat glands are activating. Daily showers and deodorant fix most of it. Antiperspirant adds a sweat-reducer on top of deodorant if you need it.',
          'GROWTH SPURTS — Yes. You might grow 3–4 inches in a year. Joints can ache (called growing pains), and you may feel clumsy because your brain hasn\'t caught up to your new arms and legs yet. That clumsiness usually settles within a few months.',
          'MOOD SWINGS — Yes. Hormones affect emotions just as much as the body. Big feelings are normal at this age. If you ever feel persistently low, hopeless, or like nothing matters for more than 2 weeks, that\'s when to talk to a trusted adult.',
          'HAIR IN NEW PLACES — Yes. Underarms, pubic area, and (for boys) face, chest, and legs. The amount and timing varies a lot between people.',
          'VOICE CHANGES — Mainly for boys. The voice gets deeper as the voice box grows. It may crack while it\'s settling. That\'s temporary and usually finishes within a year or two.'
        ]
      },
      faithLine: null
    },

    {
      id: 'when-to-talk',
      icon: '🩺',
      title: 'When to talk to a parent or doctor',
      preview: 'Specific things worth bringing up',
      body: {
        general: [
          'Most of what\'s happening to your body during puberty is normal and doesn\'t need a doctor. But some things ARE worth bringing up:',
          '• Periods that are extremely heavy (soaking a pad or tampon every hour), very long (more than 7 days), or extremely painful (interfering with school or activities).',
          '• Persistent pain anywhere — chest, back, joints, pelvis — that doesn\'t go away in a few days.',
          '• Severe acne that home care isn\'t helping after a month or two.',
          '• Feeling depressed, hopeless, or anxious most days for more than 2 weeks. This is medical, not a personality flaw.',
          '• Any thoughts of hurting yourself — call or text 988 right away (you don\'t need a parent\'s permission to do this), and also tell a trusted adult as soon as you can.',
          '• Anything that feels wrong, even if you can\'t put it into words. Trust the signal.',
          'Talking to your parent is usually the first step — they\'ve been through this. If you\'re not sure how to start the conversation, a simple text like "Hey, can we talk about something?" works. If you don\'t feel safe talking to your parent about something specific, a school nurse, counselor, doctor, or another trusted adult is a good fallback.'
        ]
      },
      faithLine: null
    },

    {
      id: 'sleep-and-body',
      icon: '💤',
      title: 'Sleep + your growing body',
      preview: 'Why teens need more sleep, not less',
      body: {
        general: [
          'During puberty, your body is doing major work — building bone, growing muscle, rewiring your brain. Most of that work happens during sleep, specifically the deep-sleep phases that come in the middle of the night.',
          'Teens need 8–10 hours per night for the system to fully repair and grow. Less than that and you\'ll feel groggy, your skin breaks out more easily, your mood gets harder to manage, and your athletic performance drops measurably.',
          'A few habits that help: keep a consistent bedtime (even on weekends — your body learns the schedule), avoid screens for the hour before bed because the blue light slows down melatonin (the sleep hormone), and don\'t drink caffeine after early afternoon.',
          'If you\'re consistently tired despite enough hours, talk to a doctor — there are real causes worth checking (iron levels, thyroid, sleep apnea).'
        ]
      },
      faithLine: null,
      tieIn: { label: 'Log tonight\'s sleep', sub: 'sleep' }
    },

    {
      id: 'nutrition-and-body',
      icon: '🥗',
      title: 'Fuel for a growing body',
      preview: 'What your body actually needs right now',
      body: {
        general: [
          'Your body needs more fuel during puberty than it did before. Skipping meals during this season leaves you exhausted, irritable, and slows your growth. Hunger is information, not a problem to fight.',
          'The basics:',
          '• Eat enough — your appetite went up for a reason.',
          '• Protein at every meal — eggs, chicken, fish, beans, tofu, yogurt. Helps muscles, hormones, and skin.',
          '• Vegetables and fruit, ideally something at every meal — these are what your skin, mood, and energy run on.',
          '• Calcium for bones — milk, yogurt, cheese, leafy greens, or fortified plant milks. Your skeleton hits about 90% of its adult density by age 18, so this window matters.',
          '• Iron — especially important for girls who\'ve started periods. Red meat, beans, lentils, spinach, fortified cereals. Pair with vitamin C (citrus, peppers) to absorb it better.',
          '• Water throughout the day. Your body uses more water during growth.',
          'Sugary drinks crash your energy and worsen acne for most people. Save them for occasional treats, not daily fuel.'
        ]
      },
      faithLine: null,
      tieIn: { label: 'Log today\'s meals', sub: 'meals' }
    }
  ];

  // ── Helpers ──────────────────────────────────────────────────
  function _esc(s){
    if(s == null) return '';
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function _today(){
    return new Date().toISOString().slice(0,10);
  }

  function _faithOn(){
    return D && D.faithMode !== false;
  }

  function _activeSex(){
    return (D && D.profile && D.profile.sex) || '';
  }

  // Compose the body paragraphs for a topic in the right order for the
  // current user. Sex-specific sub-sections come first (when the
  // profile is M or F); 'O' or empty profile sees both. General
  // paragraphs always render.
  function _composeBody(topic, sex){
    const out = [];
    if(topic.body && topic.body.bySex){
      if(sex === 'F' && topic.body.bySex.F) out.push.apply(out, topic.body.bySex.F);
      else if(sex === 'M' && topic.body.bySex.M) out.push.apply(out, topic.body.bySex.M);
      else {
        // 'O' or empty — show both, female first then male (alphabetical
        // by section header, not preference)
        if(topic.body.bySex.F) out.push.apply(out, topic.body.bySex.F);
        if(topic.body.bySex.M) out.push.apply(out, topic.body.bySex.M);
      }
    }
    if(topic.body && topic.body.general) out.push.apply(out, topic.body.general);
    return out;
  }

  // ── Renderers ────────────────────────────────────────────────
  function _renderIntro(){
    return ''
      + '<div style="background:linear-gradient(135deg,rgba(244,114,182,.06),rgba(34,211,238,.04));'
      +              'border:1px solid rgba(244,114,182,.22);border-left:4px solid var(--section-health,#22d3ee);'
      +              'border-radius:14px;padding:1.1rem 1.3rem;margin-bottom:1rem;">'
      +   '<div style="font-size:1.05rem;font-weight:700;color:var(--tx);margin-bottom:.4rem;">Your body is doing remarkable things.</div>'
      +   '<div style="font-size:.82rem;color:var(--tx2);line-height:1.6;">'
      +     'This is a space to learn what\'s happening, what\'s normal, and when to ask for help. '
      +     'Tap any card to read.'
      +   '</div>'
      + '</div>';
  }

  function _renderTopicCard(topic){
    const viewed = (D && D.bodyLiteracyViewed && D.bodyLiteracyViewed[topic.id]) ? true : false;
    const checkmark = viewed
      ? '<span style="position:absolute;top:.6rem;right:.7rem;font-size:.62rem;font-weight:700;color:#22c55e;background:rgba(34,197,94,.1);padding:.18rem .45rem;border-radius:999px;border:1px solid rgba(34,197,94,.25);">✓ Read</span>'
      : '';
    return ''
      + '<div class="topic-card accent-pink" style="position:relative;cursor:pointer;" onclick="_bodyOpenTopic(\'' + _esc(topic.id) + '\')">'
      +   checkmark
      +   '<div style="font-size:2rem;line-height:1;margin-bottom:.55rem;">' + topic.icon + '</div>'
      +   '<div class="topic-card-title" style="padding-top:0;">' + _esc(topic.title) + '</div>'
      +   '<div class="topic-card-desc">' + _esc(topic.preview) + '</div>'
      + '</div>';
  }

  function _renderTopicGrid(){
    const cards = BODY_TOPICS.map(_renderTopicCard).join('');
    return ''
      + '<div class="topic-card-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.8rem;">'
      +   cards
      + '</div>';
  }

  function renderBodyLiteracy(){
    const el = document.getElementById('ht-body');
    if(!el) return;
    el.innerHTML = _renderIntro() + _renderTopicGrid();
  }

  // ── Modal — full content reader ──────────────────────────────
  function _renderTopicModal(topic, sex){
    const paragraphs = _composeBody(topic, sex);
    const bodyHtml = paragraphs.map(function(p){
      return '<p style="font-size:.92rem;color:var(--tx);line-height:1.7;margin:0 0 .9rem;">' + _esc(p) + '</p>';
    }).join('');
    const faithHtml = (topic.faithLine && _faithOn())
      ? '<div style="margin-top:1.3rem;padding:.9rem 1.1rem;background:rgba(251,191,36,.06);border-left:3px solid #fbbf24;border-radius:0 8px 8px 0;">'
        + '<div style="font-style:italic;font-family:Georgia,serif;font-size:.92rem;color:var(--tx);line-height:1.6;margin-bottom:.35rem;">'
        +   '&ldquo;' + _esc(topic.faithLine.text) + '&rdquo;'
        + '</div>'
        + '<div style="font-size:.65rem;font-weight:700;letter-spacing:.12em;color:#fbbf24;">'
        +   '&mdash; ' + _esc(topic.faithLine.ref)
        + '</div>'
      + '</div>'
      : '';
    const tieInHtml = (topic.tieIn && topic.tieIn.sub)
      ? '<button type="button" onclick="_bodyCloseModal();hTab(\'' + _esc(topic.tieIn.sub) + '\',document.querySelector(\'.healthTabs .tab[onclick*=\\\'' + _esc(topic.tieIn.sub) + '\\\']\'))" '
        + 'style="margin-top:1.1rem;width:100%;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.3);'
        +        'color:#22d3ee;font-size:.78rem;font-weight:700;padding:.65rem;border-radius:10px;cursor:pointer;font-family:var(--fm);">'
        +   '&rarr; ' + _esc(topic.tieIn.label)
        + '</button>'
      : '';

    const fb = (D && D.bodyLiteracyFeedback) || {};
    const upSelected   = fb[topic.id] === 'up'   ? ' bl-fb-selected'   : '';
    const downSelected = fb[topic.id] === 'down' ? ' bl-fb-selected'   : '';
    const feedbackHtml = ''
      + '<div style="margin-top:1.4rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,.08);text-align:center;">'
      +   '<div style="font-size:.7rem;color:var(--tx3);margin-bottom:.55rem;letter-spacing:.05em;">Did this help?</div>'
      +   '<div style="display:flex;gap:.5rem;justify-content:center;">'
      +     '<button type="button" id="blFb-up-' + _esc(topic.id) + '" class="bl-fb-btn' + upSelected + '" '
      +            'onclick="_bodySetFeedback(\'' + _esc(topic.id) + '\',\'up\')">👍</button>'
      +     '<button type="button" id="blFb-down-' + _esc(topic.id) + '" class="bl-fb-btn' + downSelected + '" '
      +            'onclick="_bodySetFeedback(\'' + _esc(topic.id) + '\',\'down\')">👎</button>'
      +   '</div>'
      + '</div>';

    return ''
      + '<div id="bodyLiteracyModal" style="position:fixed;inset:0;z-index:10010;background:rgba(5,13,26,.85);'
      +                                    'display:flex;align-items:flex-start;justify-content:center;padding:1.5rem 1rem;overflow-y:auto;"'
      +      'onclick="if(event.target===this) _bodyCloseModal()">'
      +   '<div style="background:var(--card,#0f1a2e);border:1px solid rgba(255,255,255,.08);border-radius:16px;'
      +              'max-width:560px;width:100%;padding:1.5rem 1.4rem;max-height:90vh;overflow-y:auto;'
      +              'box-shadow:0 30px 80px rgba(0,0,0,.55);" onclick="event.stopPropagation()">'
      +     '<button type="button" onclick="_bodyCloseModal()" '
      +            'style="position:absolute;top:1.7rem;right:1.6rem;background:transparent;border:0;color:var(--tx2);'
      +                   'font-size:1.3rem;cursor:pointer;width:30px;height:30px;line-height:1;">&times;</button>'
      +     '<div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.7rem;">'
      +       '<span style="font-size:1.7rem;line-height:1;">' + topic.icon + '</span>'
      +       '<h2 style="margin:0;font-family:var(--fh);font-size:1.4rem;letter-spacing:.03em;color:var(--tx);">' + _esc(topic.title) + '</h2>'
      +     '</div>'
      +     '<div style="margin-top:1rem;">'
      +       bodyHtml
      +     '</div>'
      +     faithHtml
      +     tieInHtml
      +     feedbackHtml
      + '</div>'
      + '</div>';
  }

  function _bodyOpenTopic(id){
    const topic = BODY_TOPICS.find(function(t){ return t && t.id === id; });
    if(!topic) return;
    const sex = _activeSex();

    // Insert modal
    _bodyCloseModal(); // defensive — close any existing
    const wrap = document.createElement('div');
    wrap.innerHTML = _renderTopicModal(topic, sex);
    document.body.appendChild(wrap.firstChild);

    // Log first view per topic per kid lifetime — single feed entry,
    // no spam on re-opens.
    if(typeof D !== 'undefined' && D){
      if(!D.bodyLiteracyViewed || typeof D.bodyLiteracyViewed !== 'object'){
        D.bodyLiteracyViewed = {};
      }
      if(!D.bodyLiteracyViewed[id]){
        D.bodyLiteracyViewed[id] = _today();
        if(typeof logFamilyActivity === 'function'){
          logFamilyActivity('health', 'body_literacy_viewed', topic.title, { topicId: id });
        }
        if(typeof save === 'function') save();
        // Repaint the grid so the read-check badge appears on close
        // (only if the grid is currently visible).
        renderBodyLiteracy();
      }
    }
  }

  function _bodyCloseModal(){
    const m = document.getElementById('bodyLiteracyModal');
    if(m && m.parentNode) m.parentNode.removeChild(m);
  }

  function _bodySetFeedback(topicId, value){
    if(value !== 'up' && value !== 'down') return;
    if(typeof D === 'undefined' || !D) return;
    if(!D.bodyLiteracyFeedback || typeof D.bodyLiteracyFeedback !== 'object'){
      D.bodyLiteracyFeedback = {};
    }
    // Toggle off if same value pressed again
    if(D.bodyLiteracyFeedback[topicId] === value){
      delete D.bodyLiteracyFeedback[topicId];
    } else {
      D.bodyLiteracyFeedback[topicId] = value;
    }
    if(typeof save === 'function') save();
    // Repaint button states in the open modal
    const up   = document.getElementById('blFb-up-'   + topicId);
    const down = document.getElementById('blFb-down-' + topicId);
    if(up)   up.classList.toggle  ('bl-fb-selected', D.bodyLiteracyFeedback[topicId] === 'up');
    if(down) down.classList.toggle('bl-fb-selected', D.bodyLiteracyFeedback[topicId] === 'down');
  }

  // ── Public ───────────────────────────────────────────────────
  window.renderBodyLiteracy = renderBodyLiteracy;
  window._bodyOpenTopic     = _bodyOpenTopic;
  window._bodyCloseModal    = _bodyCloseModal;
  window._bodySetFeedback   = _bodySetFeedback;
  // Exposed for Parent Hub counts + Inc 7 to read shared content list
  window.BODY_LITERACY_TOPICS = BODY_TOPICS;
})();
