/* =============================================================
   heart-check-data.js — Heart Check (V1 Rebuild · 2026-05-30)

   12 emotional states. Each entry surfaces a:
     - verse  (scripture for the moment, with reference)
     - prayer (second-person, written as if the user is saying it)
     - action (one concrete physical thing to do in the next 5 min)
     - trait  (which Identity Trait the action grows when completed)

   Read by faith-zones.js (renderHeartCheckPicker /
   openHeartCheck). Pure data; no behavior lives here.
   Exposed on window for non-module consumers.
============================================================= */

const HEART_CHECK = {
  lost: {
    emoji:'😔', label:'Lost',
    headline:"WHEN YOU DON'T KNOW WHICH WAY TO GO",
    verse:'"Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths."',
    verseRef:'Proverbs 3:5-6',
    prayer:"God, I don't know what I'm doing. I don't know which way to go or what to choose. I'm tired of pretending I have it figured out. Show me. I'll listen. Amen.",
    action:'Sit still for 2 minutes. Don\'t scroll, don\'t plan. Just say: "God, I\'m here. Lead me." Then notice the first quiet thought that comes.',
    trait:'wisdom'
  },
  anxious: {
    emoji:'😰', label:'Anxious',
    headline:"WHEN YOUR MIND WON'T STOP RACING",
    verse:'"Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God."',
    verseRef:'Philippians 4:6',
    prayer:"God, my mind won't slow down. Every thought is a problem and I can't solve any of them. I'm handing this to you — not because I'm strong, but because I can't carry it. Help me breathe. Amen.",
    action:"Take 4 deep breaths. In for 4 seconds. Hold for 4. Out for 4. Hold for 4. Repeat 4 times. That's 64 seconds with God.",
    trait:'faith'
  },
  defeated: {
    emoji:'😞', label:'Defeated',
    headline:"WHEN YOU'VE TRIED AND FAILED",
    verse:'"He gives strength to the weary and increases the power of the weak."',
    verseRef:'Isaiah 40:29',
    prayer:"God, I'm tired. I tried and it didn't work. I don't have the strength for what's next. Be my strength when mine runs out. Help me get up. Amen.",
    action:'Get up. Drink water. Wash your face. Take one small step — not the big one. The small one. That counts.',
    trait:'courage'
  },
  angry: {
    emoji:'😡', label:'Angry',
    headline:'WHEN SOMEONE WRONGED YOU',
    verse:'"Be angry and do not sin; do not let the sun go down on your anger."',
    verseRef:'Ephesians 4:26',
    prayer:"God, I'm furious and I don't know what to do with it. I want to say things I'll regret. Help me hold this. Show me what's really going on inside. Soften my heart without making me weak. Amen.",
    action:"Write the angriest text you want to send. Don't send it. Read it back in 10 minutes. Then decide.",
    trait:'integrity'
  },
  doubting: {
    emoji:'❓', label:'Doubting',
    headline:'WHEN FAITH FEELS DISTANT',
    verse:'"I believe; help my unbelief!"',
    verseRef:'Mark 9:24',
    prayer:"God, I don't know if you're real right now. I don't know what I believe. But I'm here anyway. If you're real — meet me in this doubt. I'm not running. Amen.",
    action:"Read one chapter of the Gospel of John. Just one. Don't try to feel anything. Just read.",
    trait:'courage'
  },
  lonely: {
    emoji:'🥺', label:'Lonely',
    headline:'WHEN YOU FEEL FORGOTTEN',
    verse:'"The Lord himself goes before you and will be with you; he will never leave you nor forsake you."',
    verseRef:'Deuteronomy 31:8',
    prayer:'God, I feel invisible. Like no one would notice if I disappeared. But you see me. You know my name. Help me feel that — not just know it. Amen.',
    action:'Text one specific person right now. Anyone. "Hey, thinking of you." Don\'t wait for them to reach out first.',
    trait:'compassion'
  },
  heartbroken: {
    emoji:'💔', label:'Heartbroken',
    headline:'WHEN SOMETHING HAS BEEN LOST',
    verse:'"The Lord is close to the brokenhearted and saves those who are crushed in spirit."',
    verseRef:'Psalm 34:18',
    prayer:"God, this hurts more than I knew anything could. I don't want to feel this. Don't make me skip the grief — just hold me through it. I don't need it fixed yet. I just need you near. Amen.",
    action:"Let yourself cry if you need to. Don't apologize for it. Then drink a glass of water and breathe.",
    trait:'gratitude'
  },
  numb: {
    emoji:'😶', label:'Numb',
    headline:"WHEN YOU DON'T FEEL ANYTHING",
    verse:'"Create in me a clean heart, O God, and renew a right spirit within me."',
    verseRef:'Psalm 51:10',
    prayer:"God, I don't feel anything. Not bad, not good. Just nothing. That scares me a little. Wake something up in me — even if it hurts. I'd rather feel something than feel nothing. Amen.",
    action:"Go outside for 5 minutes. Look up. Breathe slowly. Touch something real — grass, bark, cold air. Just notice you're alive.",
    trait:'gratitude'
  },
  tempted: {
    emoji:'🔥', label:'Tempted',
    headline:"WHEN YOU'RE BEING PULLED SOMEWHERE WRONG",
    verse:'"No temptation has overtaken you that is not common to man. God is faithful, and he will not let you be tempted beyond your ability, but with the temptation he will also provide the way of escape."',
    verseRef:'1 Corinthians 10:13',
    prayer:"God, I want this thing I shouldn't want. Right now. Help me. I don't want to keep doing this. Give me a way out — even if it's ugly and hard. I'd rather be free than comfortable. Amen.",
    action:'Change your physical location right now. Stand up. Leave the room. Call or text someone you trust. Movement breaks the moment.',
    trait:'integrity'
  },
  stuck: {
    emoji:'😣', label:'Stuck',
    headline:'WHEN NOTHING SEEMS TO CHANGE',
    verse:'"Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up."',
    verseRef:'Galatians 6:9',
    prayer:"God, nothing is changing. I'm doing what I'm supposed to do and it doesn't feel like it matters. Show me the progress I can't see yet. Keep me from quitting today. Amen.",
    action:'Write down ONE small thing you can do today that future-you will thank you for. Then do it.',
    trait:'discipline'
  },
  grateful: {
    emoji:'🙏', label:'Grateful',
    headline:'WHEN YOU WANT TO GIVE THANKS',
    verse:'"Give thanks in all circumstances; for this is the will of God in Christ Jesus for you."',
    verseRef:'1 Thessalonians 5:18',
    prayer:'God, thank you. For breath. For this moment. For everything I usually miss. Help me notice you more. Keep my heart soft. Amen.',
    action:"Tell one specific person — out loud or in a text — exactly what you're grateful to them for. Be specific.",
    trait:'gratitude'
  },
  joyful: {
    emoji:'✨', label:'Joyful',
    headline:'WHEN YOU WANT TO CELEBRATE',
    verse:'"This is the day that the Lord has made; let us rejoice and be glad in it."',
    verseRef:'Psalm 118:24',
    prayer:"God, this is good. Whatever this is — you made it. Help me hold onto this when the hard days come. I'm not going to forget this moment. Amen.",
    action:'Mark this moment. Write what happened in 3 words and the date. Save it somewhere you\'ll find it on a hard day.',
    trait:'gratitude'
  }
};

if (typeof window !== 'undefined') {
  window.HEART_CHECK = HEART_CHECK;
}
