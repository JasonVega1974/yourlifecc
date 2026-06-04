// ═════════════════════════════════════════════════════════════
// QUICK_PRAYERS — Library of ready-to-pray example prayers used
// by the Quick Prayer destination and the Explore Faith Prayers
// pathway card. Schema per entry:
//   { id, topic, title, verse, text }
// Topics drive the filter pills; the renderer derives the distinct
// list at runtime, so adding a new entry with a new topic just
// adds a new pill.
// Loaded before /app/js/quick-prayers.js so the renderer can read
// window.QUICK_PRAYERS on first render.
// ═════════════════════════════════════════════════════════════

window.QUICK_PRAYERS = [
  { id:"p_anx",   topic:"Anxiety & Worry", title:"When My Mind Won't Slow Down", verse:"Philippians 4:6-7",
    text:"Father, my thoughts are racing and my chest feels tight. I'm handing You the things I keep trying to carry alone. Remind me that You see every detail of my life and haven't lost control of any of it. Trade my worry for Your peace, the kind that doesn't even make sense. I'm choosing to trust You right now. Amen." },
  { id:"p_test",  topic:"School & Tests", title:"Steady My Mind", verse:"Joshua 1:9",
    text:"Lord, I've done what I can to prepare, and now I'm asking for a clear head and a calm heart. Help me remember what I've learned and think without panic. Whatever the result, remind me my worth isn't a grade. Walk into this with me. Amen." },
  { id:"p_grat",  topic:"Gratitude", title:"Thank You", verse:"1 Thessalonians 5:18",
    text:"God, before I ask for anything, I just want to say thank You. Thank You for waking me up today, for the people who love me, for the small things I usually rush past. Open my eyes to how much I already have. Let gratitude be my first language. Amen." },
  { id:"p_forg1", topic:"Forgiveness", title:"Help Me Let Go", verse:"Colossians 3:13",
    text:"Father, You know what they did and how much it still stings. I don't feel like forgiving, but I'm choosing to start. Take the bitterness out of my heart before it grows roots. Help me release them the way You've released me. Set me free. Amen." },
  { id:"p_forg2", topic:"Forgiveness", title:"I Messed Up", verse:"1 John 1:9",
    text:"Lord, I blew it, and I'm not going to pretend I didn't. I'm sorry. Thank You that Your grace is bigger than my worst moment. Clean me up, help me make it right, and give me courage to do better. I'm starting fresh with You. Amen." },
  { id:"p_temp",  topic:"Temptation", title:"Give Me Strength", verse:"1 Corinthians 10:13",
    text:"God, You know exactly what I'm tempted by right now. I don't want to give in, even though part of me does. Give me a way out and the strength to take it. Remind me who I am and who I belong to. I want to choose You over this. Amen." },
  { id:"p_iden",  topic:"Identity", title:"Remind Me Who I Am", verse:"Ephesians 2:10",
    text:"Father, the world keeps telling me I'm not enough. I'm tired of trying to earn a worth You already gave me. Remind me that I'm Yours — chosen, loved, and made on purpose. Let that truth settle deeper than the voices around me. I am who You say I am. Amen." },
  { id:"p_frnd",  topic:"Friendship", title:"Bless My People", verse:"Proverbs 17:17",
    text:"Lord, thank You for the friends who stick around. Help me be the kind of friend I'd want to have — honest, loyal, quick to show up. Heal the friendships that are hurting right now. Surround me with people who point me toward You. Amen." },
  { id:"p_fam",   topic:"Family", title:"For My Home", verse:"Colossians 3:14",
    text:"God, You know it's not always easy under my roof. Bring peace where there's tension and patience where I run out. Help me love my family even when they're hard to love — and to be easier to live with too. Hold my home together. Amen." },
  { id:"p_grief", topic:"Grief & Loss", title:"When It Hurts", verse:"Psalm 34:18",
    text:"Father, this loss is heavier than I know how to carry. I don't have the right words, so I'm just bringing You my tears. Be close to me the way only You can. Hold the broken pieces of my heart until I can breathe again. I trust You even here. Amen." },
  { id:"p_guid",  topic:"Guidance", title:"Show Me the Way", verse:"Proverbs 3:5-6",
    text:"Lord, I'm standing at a crossroads and don't know which way to go. I don't want to lean on my own understanding — I want to follow You. Make the right path clear and give me peace about the next step. I'll go where You lead. Amen." },
  { id:"p_cour",  topic:"Courage", title:"Make Me Brave", verse:"Deuteronomy 31:6",
    text:"God, I'm scared, and I'm asking You to make me brave anyway. Quiet the fear that keeps me small. Remind me that You go before me and You've got my back. Help me step out, even with shaky hands. I won't do it alone. Amen." },
  { id:"p_morn",  topic:"Morning", title:"Start of the Day", verse:"Lamentations 3:22-23",
    text:"Father, before this day gets loud, I want to start it with You. Thank You for a new morning and fresh mercy. Lead my steps, guard my heart, and help me notice You in the ordinary. I'm Yours today. Amen." },
  { id:"p_night", topic:"Night", title:"End of the Day", verse:"Psalm 4:8",
    text:"Lord, the day is done and so am I. Thank You for getting me through it. Forgive what I got wrong, and help me let it go instead of replaying it. Quiet my mind and give me real rest. I'm safe with You. Amen." },
  { id:"p_lone",  topic:"Loneliness", title:"When I Feel Alone", verse:"Hebrews 13:5",
    text:"God, I feel unseen and far from everyone right now. Remind me that even when no one else is near, You never leave. Fill the empty space with Your presence. And when I'm ready, lead me to the people I need. I'm not as alone as I feel. Amen." },
  { id:"p_prai",  topic:"Praise", title:"You Are Good", verse:"Psalm 145:3",
    text:"Lord, I'm not asking for anything right now — I just want to tell You how good You are. You're faithful when I'm not, patient when I'm a mess, and kind in ways I don't deserve. You're worthy of every bit of my praise. My heart is Yours. Amen." }
];
