/* =============================================================
   faith.js — 365 daily scripture verses, ESV Bible reader,
               Jesus & God's purpose, faith journey, 66 books,
               100 daily devotionals, Bible study
============================================================= */

// ── DAILY SCRIPTURE — 365 VERSES ─────────────────────────────
const DAILY_SCRIPTURES = [
// JAN — Foundation & New Beginnings
['Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!','2 Corinthians 5:17'],
['For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.','Jeremiah 29:11'],
['Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.','Proverbs 3:5-6'],
['Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.','Joshua 1:9'],
['I can do all this through him who gives me strength.','Philippians 4:13'],
['The Lord is my shepherd, I lack nothing.','Psalm 23:1'],
['For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.','John 3:16'],
['And we know that in all things God works for the good of those who love him, who have been called according to his purpose.','Romans 8:28'],
['The Lord is my light and my salvation — whom shall I fear?','Psalm 27:1'],
['Commit to the Lord whatever you do, and he will establish your plans.','Proverbs 16:3'],
['Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged.','Joshua 1:9b'],
['But those who hope in the Lord will renew their strength. They will soar on wings like eagles.','Isaiah 40:31'],
['The name of the Lord is a fortified tower; the righteous run to it and are safe.','Proverbs 18:10'],
['Delight yourself in the Lord, and he will give you the desires of your heart.','Psalm 37:4'],
['Cast all your anxiety on him because he cares for you.','1 Peter 5:7'],
['The Lord is close to the brokenhearted and saves those who are crushed in spirit.','Psalm 34:18'],
['Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God.','Philippians 4:6'],
['And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.','Philippians 4:7'],
['In the beginning God created the heavens and the earth.','Genesis 1:1'],
['God is our refuge and strength, an ever-present help in trouble.','Psalm 46:1'],
['The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you.','Zephaniah 3:17'],
['Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.','Colossians 3:23'],
['Be still, and know that I am God.','Psalm 46:10'],
['For we are God\'s handiwork, created in Christ Jesus to do good works.','Ephesians 2:10'],
['The fear of the Lord is the beginning of knowledge, but fools despise wisdom and instruction.','Proverbs 1:7'],
['He has made everything beautiful in its time.','Ecclesiastes 3:11'],
['Come to me, all you who are weary and burdened, and I will give you rest.','Matthew 11:28'],
['So do not fear, for I am with you; do not be dismayed, for I am your God.','Isaiah 41:10'],
['The grass withers and the flowers fall, but the word of our God endures forever.','Isaiah 40:8'],
['Every good and perfect gift is from above, coming down from the Father of the heavenly lights.','James 1:17'],
['This is the day the Lord has made; let us rejoice and be glad in it.','Psalm 118:24'],
['See, I am doing a new thing! Now it springs up; do you not perceive it?','Isaiah 43:19'],
// FEB — Love & Relationships
['Love is patient, love is kind. It does not envy, it does not boast, it is not proud.','1 Corinthians 13:4'],
['Above all, love each other deeply, because love covers over a multitude of sins.','1 Peter 4:8'],
['A friend loves at all times, and a brother is born for a time of adversity.','Proverbs 17:17'],
['Dear friends, let us love one another, for love comes from God.','1 John 4:7'],
['Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves.','Philippians 2:3'],
['Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.','Ephesians 4:32'],
['Two are better than one, because they have a good return for their labor.','Ecclesiastes 4:9'],
['Love your neighbor as yourself.','Mark 12:31'],
['Greater love has no one than this: to lay down one\'s life for one\'s friends.','John 15:13'],
['A gentle answer turns away wrath, but a harsh word stirs up anger.','Proverbs 15:1'],
['As iron sharpens iron, so one person sharpens another.','Proverbs 27:17'],
['Bear with each other and forgive one another. Forgive as the Lord forgave you.','Colossians 3:13'],
['Let all that you do be done in love.','1 Corinthians 16:14'],
['Honor your father and your mother, so that you may live long in the land.','Exodus 20:12'],
['Be completely humble and gentle; be patient, bearing with one another in love.','Ephesians 4:2'],
['The Lord is gracious and compassionate, slow to anger and rich in love.','Psalm 145:8'],
['Whoever walks with the wise becomes wise, but the companion of fools will suffer harm.','Proverbs 13:20'],
['Do to others as you would have them do to you.','Luke 6:31'],
['How good and pleasant it is when God\'s people live together in unity!','Psalm 133:1'],
['Husbands, love your wives, just as Christ loved the church and gave himself up for her.','Ephesians 5:25'],
['Children, obey your parents in the Lord, for this is right.','Ephesians 6:1'],
['A cord of three strands is not quickly broken.','Ecclesiastes 4:12'],
['Do not repay evil with evil or insult with insult. On the contrary, repay evil with blessing.','1 Peter 3:9'],
['Whoever is patient has great understanding, but one who is quick-tempered displays folly.','Proverbs 14:29'],
['Let us not become weary in doing good, for at the proper time we will reap a harvest.','Galatians 6:9'],
['Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes.','1 Corinthians 13:6-7'],
['Be devoted to one another in love. Honor one another above yourselves.','Romans 12:10'],
['If it is possible, as far as it depends on you, live at peace with everyone.','Romans 12:18'],

['Hatred stirs up conflict, but love covers over all wrongs.','Proverbs 10:12'],
['And over all these virtues put on love, which binds them all together in perfect unity.','Colossians 3:14'],
// MAR — Wisdom & Character
['If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault.','James 1:5'],
['The fear of the Lord is the beginning of wisdom, and knowledge of the Holy One is understanding.','Proverbs 9:10'],
['Get wisdom, get understanding; do not forget my words or turn away from them.','Proverbs 4:5'],
['Blessed is the one who perseveres under trial because, having stood the test, that person will receive the crown of life.','James 1:12'],
['But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.','Galatians 5:22-23'],
['Do not conform to the pattern of this world, but be transformed by the renewing of your mind.','Romans 12:2'],
['The integrity of the upright guides them, but the unfaithful are destroyed by their duplicity.','Proverbs 11:3'],
['Whoever walks in integrity walks securely, but whoever takes crooked paths will be found out.','Proverbs 10:9'],
['Watch your life and doctrine closely. Persevere in them.','1 Timothy 4:16'],
['Let the wise listen and add to their learning, and let the discerning get guidance.','Proverbs 1:5'],
['A wise son brings joy to his father, but a foolish son brings grief to his mother.','Proverbs 10:1'],
['Plans fail for lack of counsel, but with many advisers they succeed.','Proverbs 15:22'],
['The tongue has the power of life and death, and those who love it will eat its fruit.','Proverbs 18:21'],
['Set a guard over my mouth, Lord; keep watch over the door of my lips.','Psalm 141:3'],
['Whoever guards his mouth and tongue keeps his soul from troubles.','Proverbs 21:23'],
['Pride goes before destruction, a haughty spirit before a fall.','Proverbs 16:18'],
['Humility is the fear of the Lord; its wages are riches and honor and life.','Proverbs 22:4'],
['When pride comes, then comes disgrace, but with humility comes wisdom.','Proverbs 11:2'],
['Train up a child in the way he should go; even when he is old he will not depart from it.','Proverbs 22:6'],
['The plans of the diligent lead to profit as surely as haste leads to poverty.','Proverbs 21:5'],
['Whoever is faithful in very little is also faithful in much.','Luke 16:10'],
['Let your eyes look straight ahead; fix your gaze directly before you.','Proverbs 4:25'],
['Better a patient person than a warrior, one with self-control than one who takes a city.','Proverbs 16:32'],
['The heart of the discerning acquires knowledge, for the ears of the wise seek it out.','Proverbs 18:15'],
['Teach me your way, Lord, that I may rely on your faithfulness; give me an undivided heart.','Psalm 86:11'],
['Apply your heart to instruction and your ears to words of knowledge.','Proverbs 23:12'],
['Guard your heart above all else, for it determines the course of your life.','Proverbs 4:23'],
['A person\'s wisdom yields patience; it is to one\'s glory to overlook an offense.','Proverbs 19:11'],
['How much better to get wisdom than gold, to get insight rather than silver!','Proverbs 16:16'],
['Do not be deceived: Bad company ruins good morals.','1 Corinthians 15:33'],
['The wise store up knowledge, but the mouth of a fool invites ruin.','Proverbs 10:14'],

['Wisdom is supreme; therefore get wisdom. Though it cost all you have, get understanding.','Proverbs 4:7'],
// APR — Faith & Trust
['Now faith is confidence in what we hope for and assurance about what we do not see.','Hebrews 11:1'],
['For we walk by faith, not by sight.','2 Corinthians 5:7'],
['Jesus said, If you have faith as small as a mustard seed, you can say to this mountain, Move, and it will move.','Matthew 17:20'],
['Faith comes from hearing the message, and the message is heard through the word about Christ.','Romans 10:17'],
['Without faith it is impossible to please God.','Hebrews 11:6'],
['The righteous will live by faith.','Romans 1:17'],
['But when you ask, you must believe and not doubt.','James 1:6'],
['Blessed is she who has believed that the Lord would fulfill his promises to her!','Luke 1:45'],
['I have fought the good fight, I have finished the race, I have kept the faith.','2 Timothy 4:7'],
['The Lord is faithful, and he will strengthen you and protect you from the evil one.','2 Thessalonians 3:3'],
['Let us hold unswervingly to the hope we profess, for he who promised is faithful.','Hebrews 10:23'],
['Because of the Lord\'s great love we are not consumed, for his compassions never fail. They are new every morning.','Lamentations 3:22-23'],
['The Lord himself goes before you and will be with you; he will never leave you nor forsake you.','Deuteronomy 31:8'],
['Wait for the Lord; be strong and take heart and wait for the Lord.','Psalm 27:14'],
['Those who know your name trust in you, for you, Lord, have never forsaken those who seek you.','Psalm 9:10'],
['When I am afraid, I put my trust in you.','Psalm 56:3'],
['The Lord is my rock, my fortress and my deliverer; my God is my rock, in whom I take refuge.','Psalm 18:2'],
['He who began a good work in you will carry it on to completion until the day of Christ Jesus.','Philippians 1:6'],
['The Lord will fight for you; you need only to be still.','Exodus 14:14'],
['My grace is sufficient for you, for my power is made perfect in weakness.','2 Corinthians 12:9'],
['I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world.','John 16:33'],
['Taste and see that the Lord is good; blessed is the one who takes refuge in him.','Psalm 34:8'],
['The Lord is near to all who call on him, to all who call on him in truth.','Psalm 145:18'],
['Cast your cares on the Lord and he will sustain you; he will never let the righteous be shaken.','Psalm 55:22'],
['My God will meet all your needs according to the riches of his glory in Christ Jesus.','Philippians 4:19'],
['The Lord watches over you — the Lord is your shade at your right hand.','Psalm 121:5'],
['You will keep in perfect peace those whose minds are steadfast, because they trust in you.','Isaiah 26:3'],
['The eternal God is your refuge, and underneath are the everlasting arms.','Deuteronomy 33:27'],
['He gives strength to the weary and increases the power of the weak.','Isaiah 40:29'],
['For nothing will be impossible with God.','Luke 1:37'],

['The Lord is trustworthy in all he promises and faithful in all he does.','Psalm 145:13'],
// MAY — Purpose & Calling
['For we are God\'s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.','Ephesians 2:10'],
['Many are the plans in a person\'s heart, but it is the Lord\'s purpose that prevails.','Proverbs 19:21'],
['For I am the Lord your God who takes hold of your right hand and says to you, Do not fear; I will help you.','Isaiah 41:13'],
['The Lord will fulfill his purpose for me; your love, Lord, endures forever.','Psalm 138:8'],
['Before I formed you in the womb I knew you, before you were born I set you apart.','Jeremiah 1:5'],
['You did not choose me, but I chose you and appointed you so that you might go and bear fruit.','John 15:16'],
['For you created my inmost being; you knit me together in my mother\'s womb.','Psalm 139:13'],
['I praise you because I am fearfully and wonderfully made; your works are wonderful.','Psalm 139:14'],
['But you are a chosen people, a royal priesthood, a holy nation, God\'s special possession.','1 Peter 2:9'],
['Each of you should use whatever gift you have received to serve others.','1 Peter 4:10'],
['There are different kinds of gifts, but the same Spirit distributes them.','1 Corinthians 12:4'],
['Do not neglect your gift.','1 Timothy 4:14'],
['Whatever your hand finds to do, do it with all your might.','Ecclesiastes 9:10'],
['For the gifts and calling of God are irrevocable.','Romans 11:29'],
['Let your light shine before others, that they may see your good deeds and glorify your Father in heaven.','Matthew 5:16'],
['You are the light of the world. A town built on a hill cannot be hidden.','Matthew 5:14'],
['Whoever wants to become great among you must be your servant.','Matthew 20:26'],
['The greatest among you will be your servant.','Matthew 23:11'],
['Not so with you. Instead, whoever wants to become great among you must be your servant.','Mark 10:43'],
['Here am I. Send me!','Isaiah 6:8'],
['Go and make disciples of all nations.','Matthew 28:19'],
['The harvest is plentiful but the workers are few.','Matthew 9:37'],
['He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God.','Micah 6:8'],
['Seek first his kingdom and his righteousness, and all these things will be given to you as well.','Matthew 6:33'],
['For where your treasure is, there your heart will be also.','Matthew 6:21'],
['No one can serve two masters.','Matthew 6:24'],
['But store up for yourselves treasures in heaven.','Matthew 6:20'],
['What good is it for someone to gain the whole world, yet forfeit their soul?','Mark 8:36'],
['He must become greater; I must become less.','John 3:30'],
['I have been crucified with Christ and I no longer live, but Christ lives in me.','Galatians 2:20'],
['For to me, to live is Christ and to die is gain.','Philippians 1:21'],

['For such a time as this.','Esther 4:14'],
['The Lord will vindicate me; your love, Lord, endures forever — do not abandon the works of your hands.','Psalm 138:8'],
['Being confident of this, that he who began a good work in you will carry it on to completion.','Philippians 1:6'],
['In their hearts humans plan their course, but the Lord establishes their steps.','Proverbs 16:9'],
// JUN — Strength & Courage
['The Lord is my strength and my shield; my heart trusts in him, and he helps me.','Psalm 28:7'],
['God is within her, she will not fall; God will help her at break of day.','Psalm 46:5'],
['I sought the Lord, and he answered me; he delivered me from all my fears.','Psalm 34:4'],
['He gives power to the faint, and to him who has no might he increases strength.','Isaiah 40:29'],
['The joy of the Lord is your strength.','Nehemiah 8:10'],
['In all these things we are more than conquerors through him who loved us.','Romans 8:37'],
['If God is for us, who can be against us?','Romans 8:31'],
['No weapon forged against you will prevail.','Isaiah 54:17'],
['The Lord is my strength and my song; he has given me victory.','Exodus 15:2'],
['Be on your guard; stand firm in the faith; be courageous; be strong.','1 Corinthians 16:13'],
['Finally, be strong in the Lord and in his mighty power.','Ephesians 6:10'],
['Put on the full armor of God, so that you can take your stand against the devil\'s schemes.','Ephesians 6:11'],
['For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.','2 Timothy 1:7'],
['The Lord stood at my side and gave me strength.','2 Timothy 4:17'],
['I will strengthen you and help you; I will uphold you with my righteous right hand.','Isaiah 41:10'],
['Even though I walk through the darkest valley, I will fear no evil, for you are with me.','Psalm 23:4'],
['He who is in you is greater than he who is in the world.','1 John 4:4'],
['We are hard pressed on every side, but not crushed; perplexed, but not in despair.','2 Corinthians 4:8'],
['Consider it pure joy whenever you face trials of many kinds, because the testing of your faith produces perseverance.','James 1:2-3'],
['I press on toward the goal to win the prize for which God has called me heavenward in Christ Jesus.','Philippians 3:14'],
['Forget the former things; do not dwell on the past. See, I am doing a new thing!','Isaiah 43:18-19'],
['With man this is impossible, but with God all things are possible.','Matthew 19:26'],
['Be strong and take heart, all you who hope in the Lord.','Psalm 31:24'],
['The battle is not yours, but God\'s.','2 Chronicles 20:15'],
['Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken.','Ecclesiastes 4:12'],
['The Lord is good, a refuge in times of trouble. He cares for those who trust in him.','Nahum 1:7'],
['When you pass through the waters, I will be with you.','Isaiah 43:2'],
['My flesh and my heart may fail, but God is the strength of my heart and my portion forever.','Psalm 73:26'],
['But the Lord is faithful, and he will strengthen you.','2 Thessalonians 3:3'],
['Weeping may stay for the night, but rejoicing comes in the morning.','Psalm 30:5'],

['The Lord is my light and my salvation — whom shall I fear? The Lord is the stronghold of my life — of whom shall I be afraid?','Psalm 27:1'],
['Do not be overcome by evil, but overcome evil with good.','Romans 12:21'],
// JUL — Money & Stewardship
['The rich rule over the poor, and the borrower is slave to the lender.','Proverbs 22:7'],
['Whoever loves money never has enough; whoever loves wealth is never satisfied with their income.','Ecclesiastes 5:10'],
['For the love of money is a root of all kinds of evil.','1 Timothy 6:10'],
['Honor the Lord with your wealth, with the firstfruits of all your crops.','Proverbs 3:9'],
['Bring the whole tithe into the storehouse. Test me in this, says the Lord.','Malachi 3:10'],
['Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.','2 Corinthians 9:7'],
['It is more blessed to give than to receive.','Acts 20:35'],
['A generous person will prosper; whoever refreshes others will be refreshed.','Proverbs 11:25'],
['The wise store up choice food and olive oil, but fools gulp theirs down.','Proverbs 21:20'],
['Dishonest money dwindles away, but whoever gathers money little by little makes it grow.','Proverbs 13:11'],
['Whoever can be trusted with very little can also be trusted with much.','Luke 16:10'],
['Do not store up for yourselves treasures on earth, where moths and vermin destroy.','Matthew 6:19'],
['Keep your lives free from the love of money and be content with what you have.','Hebrews 13:5'],
['The blessing of the Lord brings wealth, without painful toil for it.','Proverbs 10:22'],
['A good person leaves an inheritance for their children\'s children.','Proverbs 13:22'],
['Lazy hands make for poverty, but diligent hands bring wealth.','Proverbs 10:4'],
['All hard work brings a profit, but mere talk leads only to poverty.','Proverbs 14:23'],
['Wealth gained hastily will dwindle, but whoever gathers little by little will increase it.','Proverbs 13:11'],
['The plans of the diligent lead surely to abundance.','Proverbs 21:5'],
['Give, and it will be given to you. A good measure, pressed down, shaken together and running over.','Luke 6:38'],
['Command those who are rich to do good, to be rich in good deeds, and to be generous and willing to share.','1 Timothy 6:18'],
['One person gives freely, yet gains even more; another withholds unduly, but comes to poverty.','Proverbs 11:24'],
['Better a little with the fear of the Lord than great wealth with turmoil.','Proverbs 15:16'],
['The earth is the Lord\'s, and everything in it.','Psalm 24:1'],
['Moreover, when God gives someone wealth and possessions, and the ability to enjoy them — this is a gift of God.','Ecclesiastes 5:19'],
['Godliness with contentment is great gain.','1 Timothy 6:6'],
['Where your treasure is, there your heart will be also.','Luke 12:34'],
['No one can serve two masters. You cannot serve both God and money.','Matthew 6:24'],
['Be sure you know the condition of your flocks, give careful attention to your herds.','Proverbs 27:23'],
['Owe no one anything, except to love each other.','Romans 13:8'],
['The Lord makes poor and makes rich; he brings low and he exalts.','1 Samuel 2:7'],

['The earth is the Lord\'s, and everything in it, the world, and all who live in it.','Psalm 24:1'],
['Remember this: Whoever sows sparingly will also reap sparingly, and whoever sows generously will also reap generously.','2 Corinthians 9:6'],
['Whoever trusts in his riches will fall, but the righteous will thrive like a green leaf.','Proverbs 11:28'],
// AUG — Work & Diligence
['Whatever you do, work at it with all your heart, as working for the Lord.','Colossians 3:23'],
['Commit your work to the Lord, and your plans will be established.','Proverbs 16:3'],
['In all toil there is profit, but mere talk tends only to poverty.','Proverbs 14:23'],
['The hand of the diligent will rule, while the slothful will be put to forced labor.','Proverbs 12:24'],
['Do you see someone skilled in their work? They will serve before kings.','Proverbs 22:29'],
['She watches over the affairs of her household and does not eat the bread of idleness.','Proverbs 31:27'],
['Go to the ant, you sluggard; consider its ways and be wise!','Proverbs 6:6'],
['The soul of the sluggard craves and gets nothing, while the soul of the diligent is richly supplied.','Proverbs 13:4'],
['Do not be slothful in zeal, be fervent in spirit, serve the Lord.','Romans 12:11'],
['Whatever your hand finds to do, do it with your might.','Ecclesiastes 9:10'],
['And let us not grow weary of doing good, for in due season we will reap, if we do not give up.','Galatians 6:9'],
['Be steadfast, immovable, always abounding in the work of the Lord, knowing that your labor is not in vain.','1 Corinthians 15:58'],
['She opens her arms to the poor and extends her hands to the needy.','Proverbs 31:20'],
['Sow your seed in the morning, and at evening let your hands not be idle.','Ecclesiastes 11:6'],
['The desires of the diligent are fully satisfied.','Proverbs 13:4'],
['A sluggard\'s appetite is never filled, but the desires of the diligent are fully satisfied.','Proverbs 13:4'],
['Whoever works his land will have plenty of bread, but he who follows worthless pursuits lacks sense.','Proverbs 12:11'],
['She considers a field and buys it; out of her earnings she plants a vineyard.','Proverbs 31:16'],
['Well done, good and faithful servant! You have been faithful with a few things; I will put you in charge of many things.','Matthew 25:21'],
['For even when we were with you, we gave you this rule: The one who is unwilling to work shall not eat.','2 Thessalonians 3:10'],
['She is clothed with strength and dignity; she can laugh at the days to come.','Proverbs 31:25'],
['The Lord blessed the latter part of Job\'s life more than the former part.','Job 42:12'],
['His master replied, Well done, good and faithful servant!','Matthew 25:23'],
['Serve wholeheartedly, as if you were serving the Lord, not people.','Ephesians 6:7'],
['Make it your ambition to lead a quiet life: You should mind your own business and work with your hands.','1 Thessalonians 4:11'],
['From the fruit of their lips people are filled with good things, and the work of their hands brings them reward.','Proverbs 12:14'],
['I have brought you glory on earth by finishing the work you gave me to do.','John 17:4'],
['She sets about her work vigorously; her arms are strong for her tasks.','Proverbs 31:17'],
['May the favor of the Lord our God rest on us; establish the work of our hands for us.','Psalm 90:17'],
['The blessing of the Lord makes rich, and he adds no sorrow with it.','Proverbs 10:22'],
['So whether you eat or drink or whatever you do, do it all for the glory of God.','1 Corinthians 10:31'],

['She is more precious than rubies; nothing you desire can compare with her.','Proverbs 3:15'],
['The reward for humility and fear of the Lord is riches and honor and life.','Proverbs 22:4'],
// SEP — Peace & Comfort
['Peace I leave with you; my peace I give you. I do not give to you as the world gives.','John 14:27'],
['The Lord gives strength to his people; the Lord blesses his people with peace.','Psalm 29:11'],
['You will keep in perfect peace those whose minds are steadfast, because they trust in you.','Isaiah 26:3'],
['Let the peace of Christ rule in your hearts, since as members of one body you were called to peace.','Colossians 3:15'],
['Now may the Lord of peace himself give you peace at all times and in every way.','2 Thessalonians 3:16'],
['Blessed are the peacemakers, for they will be called children of God.','Matthew 5:9'],
['The Lord is near. Do not be anxious about anything.','Philippians 4:5-6'],
['He heals the brokenhearted and binds up their wounds.','Psalm 147:3'],
['Blessed are those who mourn, for they will be comforted.','Matthew 5:4'],
['The Lord is my shepherd, I shall not want. He makes me lie down in green pastures.','Psalm 23:1-2'],
['He leads me beside quiet waters, he refreshes my soul.','Psalm 23:2-3'],
['God is our refuge and strength, a very present help in trouble.','Psalm 46:1'],
['Praise be to the God of all comfort, who comforts us in all our troubles.','2 Corinthians 1:3-4'],
['Come to me, all who labor and are heavy laden, and I will give you rest.','Matthew 11:28'],
['Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls.','Matthew 11:29'],
['The Lord is gracious and compassionate, slow to anger and rich in love.','Psalm 145:8'],
['He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain.','Revelation 21:4'],
['In peace I will lie down and sleep, for you alone, Lord, make me dwell in safety.','Psalm 4:8'],
['The Lord your God is in your midst, a mighty one who will save; he will rejoice over you with gladness; he will quiet you by his love.','Zephaniah 3:17'],
['Be anxious for nothing, but in everything by prayer and supplication, with thanksgiving, let your requests be made known to God.','Philippians 4:6'],
['And my God will supply every need of yours according to his riches in glory in Christ Jesus.','Philippians 4:19'],
['For I am convinced that neither death nor life, neither angels nor demons, can separate us from the love of God.','Romans 8:38-39'],
['The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you.','Numbers 6:24-25'],
['He who dwells in the shelter of the Most High will abide in the shadow of the Almighty.','Psalm 91:1'],
['Under his wings you will find refuge; his faithfulness will be your shield.','Psalm 91:4'],
['Because he loves me, says the Lord, I will rescue him; I will protect him.','Psalm 91:14'],
['Return to your rest, my soul, for the Lord has been good to you.','Psalm 116:7'],
['I have set the Lord always before me. Because he is at my right hand, I will not be shaken.','Psalm 16:8'],
['Therefore my heart is glad and my tongue rejoices; my body also will rest secure.','Psalm 16:9'],
['The Lord is my portion, says my soul, therefore I will hope in him.','Lamentations 3:24'],
// OCT — Gratitude & Joy
['Give thanks to the Lord, for he is good; his love endures forever.','Psalm 107:1'],
['Rejoice always, pray continually, give thanks in all circumstances.','1 Thessalonians 5:16-18'],
['The joy of the Lord is your strength.','Nehemiah 8:10'],
['Shout for joy to the Lord, all the earth. Worship the Lord with gladness.','Psalm 100:1-2'],
['This is the day the Lord has made; we will rejoice and be glad in it.','Psalm 118:24'],
['Rejoice in the Lord always. I will say it again: Rejoice!','Philippians 4:4'],
['A cheerful heart is good medicine, but a crushed spirit dries up the bones.','Proverbs 17:22'],
['Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name.','Psalm 100:4'],
['Every good and perfect gift is from above.','James 1:17'],
['I will praise you, Lord, with all my heart; I will tell of all your wonderful deeds.','Psalm 9:1'],
['Sing to the Lord a new song, for he has done marvelous things.','Psalm 98:1'],
['From the rising of the sun to the place where it sets, the name of the Lord is to be praised.','Psalm 113:3'],
['I will give thanks to you, Lord, with all my heart; I will tell of all your wonderful deeds.','Psalm 9:1'],
['The Lord has done great things for us, and we are filled with joy.','Psalm 126:3'],
['You make known to me the path of life; you will fill me with joy in your presence.','Psalm 16:11'],
['Though the fig tree does not bud and there are no grapes on the vines, yet I will rejoice in the Lord.','Habakkuk 3:17-18'],
['Oh give thanks to the Lord, for he is good, for his steadfast love endures forever!','Psalm 107:1'],
['I will be glad and rejoice in your love, for you saw my affliction and knew the anguish of my soul.','Psalm 31:7'],
['Let them give thanks to the Lord for his unfailing love and his wonderful deeds for mankind.','Psalm 107:8'],
['Let everything that has breath praise the Lord.','Psalm 150:6'],
['Great is the Lord and most worthy of praise; his greatness no one can fathom.','Psalm 145:3'],
['Praise the Lord, my soul; all my inmost being, praise his holy name.','Psalm 103:1'],
['I will extol the Lord at all times; his praise will always be on my lips.','Psalm 34:1'],
['Praise be to the God and Father of our Lord Jesus Christ! In his great mercy he has given us new birth into a living hope.','1 Peter 1:3'],
['Praise the Lord. Praise God in his sanctuary; praise him in his mighty heavens.','Psalm 150:1'],
['O Lord, you are my God; I will exalt you and praise your name.','Isaiah 25:1'],
['The heavens declare the glory of God; the skies proclaim the work of his hands.','Psalm 19:1'],
['Not to us, Lord, not to us but to your name be the glory.','Psalm 115:1'],
['I thank my God every time I remember you.','Philippians 1:3'],
['How great is your goodness, Lord, that you have stored up for those who fear you.','Psalm 31:19'],
['Thanks be to God for his indescribable gift!','2 Corinthians 9:15'],
// NOV — Service & Compassion
['Religion that God our Father accepts as pure and faultless is this: to look after orphans and widows in their distress.','James 1:27'],
['Speak up for those who cannot speak for themselves, for the rights of all who are destitute.','Proverbs 31:8'],
['Learn to do right; seek justice. Defend the oppressed. Take up the cause of the fatherless.','Isaiah 1:17'],
['Truly I tell you, whatever you did for one of the least of these brothers and sisters of mine, you did for me.','Matthew 25:40'],
['Carry each other\'s burdens, and in this way you will fulfill the law of Christ.','Galatians 6:2'],
['Do not withhold good from those to whom it is due, when it is in your power to act.','Proverbs 3:27'],
['If anyone has material possessions and sees a brother or sister in need but has no pity on them, how can the love of God be in that person?','1 John 3:17'],
['The King will reply, Truly I tell you, whatever you did for one of the least of these, you did for me.','Matthew 25:40'],
['And do not forget to do good and to share with others, for with such sacrifices God is pleased.','Hebrews 13:16'],
['Open your mouth for the mute, for the rights of all who are destitute.','Proverbs 31:8'],
['Defend the weak and the fatherless; uphold the cause of the poor and the oppressed.','Psalm 82:3'],
['He has told you, O man, what is good; and what does the Lord require of you but to do justice, love kindness, and walk humbly?','Micah 6:8'],
['Whoever is kind to the poor lends to the Lord, and he will reward them for what they have done.','Proverbs 19:17'],
['The generous will themselves be blessed, for they share their food with the poor.','Proverbs 22:9'],
['For I was hungry and you gave me something to eat, I was thirsty and you gave me something to drink.','Matthew 25:35'],
['If you spend yourselves in behalf of the hungry, then your light will rise in the darkness.','Isaiah 58:10'],
['As we have opportunity, let us do good to all people, especially to those who belong to the family of believers.','Galatians 6:10'],
['Be merciful, just as your Father is merciful.','Luke 6:36'],
['Blessed are the merciful, for they will be shown mercy.','Matthew 5:7'],
['Finally, all of you, be like-minded, be sympathetic, love one another, be compassionate and humble.','1 Peter 3:8'],
['Therefore, as God\'s chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience.','Colossians 3:12'],
['Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you.','Ephesians 4:32'],
['In everything I did, I showed you that by this kind of hard work we must help the weak.','Acts 20:35'],
['Is not this the kind of fasting I have chosen: to loose the chains of injustice?','Isaiah 58:6'],
['If your enemy is hungry, feed him; if he is thirsty, give him something to drink.','Romans 12:20'],
['Dear children, let us not love with words or speech but with actions and in truth.','1 John 3:18'],
['The Lord is righteous in all his ways and faithful in all he does.','Psalm 145:17'],
['But a Samaritan, as he traveled, came where the man was; and when he saw him, he took pity on him.','Luke 10:33'],
['Go and do likewise.','Luke 10:37'],
['A new command I give you: Love one another. As I have loved you, so you must love one another.','John 13:34'],

['And let us consider how we may spur one another on toward love and good deeds.','Hebrews 10:24'],
['Share with the Lord\'s people who are in need. Practice hospitality.','Romans 12:13'],
['Whoever oppresses the poor shows contempt for their Maker, but whoever is kind to the needy honors God.','Proverbs 14:31'],
// DEC — Hope & Eternal Things
['For God did not send his Son into the world to condemn the world, but to save the world through him.','John 3:17'],
['For unto us a child is born, unto us a son is given.','Isaiah 9:6'],
['Glory to God in the highest heaven, and on earth peace to those on whom his favor rests.','Luke 2:14'],
['The virgin will conceive and give birth to a son, and they will call him Immanuel — God with us.','Matthew 1:23'],
['For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.','Romans 6:23'],
['Jesus said, I am the way and the truth and the life. No one comes to the Father except through me.','John 14:6'],
['I am the resurrection and the life. The one who believes in me will live, even though they die.','John 11:25'],
['Surely goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever.','Psalm 23:6'],
['For our light and momentary troubles are achieving for us an eternal glory that far outweighs them all.','2 Corinthians 4:17'],
['So we fix our eyes not on what is seen, but on what is unseen, since what is seen is temporary, but what is unseen is eternal.','2 Corinthians 4:18'],
['And surely I am with you always, to the very end of the age.','Matthew 28:20'],
['In my Father\'s house are many rooms. I am going there to prepare a place for you.','John 14:2'],
['Blessed are those who hunger and thirst for righteousness, for they will be filled.','Matthew 5:6'],
['The Lord is not slow in keeping his promise. He is patient with you, not wanting anyone to perish.','2 Peter 3:9'],
['I am making everything new!','Revelation 21:5'],
['He will swallow up death forever. The Sovereign Lord will wipe away the tears from all faces.','Isaiah 25:8'],
['Now we see only a reflection as in a mirror; then we shall see face to face.','1 Corinthians 13:12'],
['Eye has not seen, nor ear heard, nor have entered into the heart of man the things which God has prepared for those who love Him.','1 Corinthians 2:9'],
['Brothers and sisters, I do not consider myself yet to have taken hold of it. But one thing I do: Forgetting what is behind and straining toward what is ahead.','Philippians 3:13'],
['Therefore we do not lose heart. Though outwardly we are wasting away, yet inwardly we are being renewed day by day.','2 Corinthians 4:16'],
['But our citizenship is in heaven. And we eagerly await a Savior from there, the Lord Jesus Christ.','Philippians 3:20'],
['Set your minds on things above, not on earthly things.','Colossians 3:2'],
['Blessed is the one who reads aloud the words of this prophecy.','Revelation 1:3'],
['The Lord reigns, let the earth be glad; let the distant shores rejoice.','Psalm 97:1'],
['Then I saw a new heaven and a new earth, for the first heaven and the first earth had passed away.','Revelation 21:1'],
['May the God of hope fill you with all joy and peace as you trust in him.','Romans 15:13'],
['Now to him who is able to do immeasurably more than all we ask or imagine.','Ephesians 3:20'],
['Being confident of this, that he who began a good work in you will carry it on to completion.','Philippians 1:6'],
['I am the Alpha and the Omega, the First and the Last, the Beginning and the End.','Revelation 22:13'],
['Grace and peace to you from God our Father and the Lord Jesus Christ.','Philippians 1:2'],
['The grace of the Lord Jesus be with God\'s people. Amen.','Revelation 22:21'],

['For a child is born to us, a son is given to us. The government will rest on his shoulders. And he will be called Wonderful Counselor, Mighty God.','Isaiah 9:6'],
['Thanks be to God for his indescribable gift!','2 Corinthians 9:15'],
];

let _scrCalFilter = 'all';

function getDayOfYear(){ return Math.floor((new Date()-new Date(new Date().getFullYear(),0,0))/(1000*60*60*24)); }

function getTodayScripture(){
  const day = getDayOfYear();
  const idx = (day-1) % DAILY_SCRIPTURES.length;
  return {day, text:DAILY_SCRIPTURES[idx][0], ref:DAILY_SCRIPTURES[idx][1], idx};
}

function initScripture(){
  if(!D.scrReadDays) D.scrReadDays = {};
  if(!D.scrPoints) D.scrPoints = 0;
  if(!D.scrNotes) D.scrNotes = [];
  if(!D.scrHighlight) D.scrHighlight = '#fef08a';
  renderScripturePage();
}

// Bible Study tab switcher
// Bible & Faith tab switcher
function bfTab(tab, btn){
  ['devotional','jesus','learnBible','reading','bible','journey'].forEach(t=>{
    const el = document.getElementById('bf-'+t);
    if(el) el.style.display = t===tab ? 'block' : 'none';
  });
  document.querySelectorAll('.scrTabs .tab').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  if(tab==='devotional') renderDevotionals();
  if(tab==='reading'){ populateBibleBooks(); renderBibleReadings(); }
  if(tab==='bible') initEsvBible();
  if(tab==='journey') renderFaithJourney();
  if(tab==='jesus') renderJesusGrid();
  if(tab==='learnBible') renderLearnBibleGrid();
}

// ── ESV BIBLE READER ─────────────────────────────────────────
const ESV_BOOK_SECTIONS = {
  OT: ['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi'],
  NT: ['Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation']
};

const ESV_ICONS = {
  'Genesis':'🌍','Exodus':'🔥','Leviticus':'🕊️','Numbers':'🔢','Deuteronomy':'📜',
  'Joshua':'⚔️','Judges':'⚖️','Ruth':'🌾','1 Samuel':'👑','2 Samuel':'👑',
  '1 Kings':'🏰','2 Kings':'🏰','1 Chronicles':'📚','2 Chronicles':'📚','Ezra':'🔨',
  'Nehemiah':'🧱','Esther':'👸','Job':'💪','Psalms':'🎵','Proverbs':'💎',
  'Ecclesiastes':'⏳','Song of Solomon':'🌹','Isaiah':'🔮','Jeremiah':'😢','Lamentations':'💔',
  'Ezekiel':'👁️','Daniel':'🦁','Hosea':'💑','Joel':'🦗','Amos':'🐑',
  'Obadiah':'⚡','Jonah':'🐋','Micah':'🎤','Nahum':'🌪️','Habakkuk':'❓',
  'Zephaniah':'🔥','Haggai':'🏗️','Zechariah':'🕊️','Malachi':'💰',
  'Matthew':'👑','Mark':'💪','Luke':'❤️','John':'✝️','Acts':'🔥',
  'Romans':'📖','1 Corinthians':'⛪','2 Corinthians':'⛪','Galatians':'🆓','Ephesians':'🏛️',
  'Philippians':'😊','Colossians':'⭐','1 Thessalonians':'🎺','2 Thessalonians':'🎺',
  '1 Timothy':'👨‍🏫','2 Timothy':'👨‍🏫','Titus':'🌱','Philemon':'🤝',
  'Hebrews':'⚓','James':'🔨','1 Peter':'🪨','2 Peter':'🪨',
  '1 John':'💗','2 John':'💗','3 John':'💗','Jude':'⚠️','Revelation':'📯'
};

let _esvInitialized = false;

function initEsvBible(){
  if(_esvInitialized) return;
  _esvInitialized = true;
  const sel = document.getElementById('esvBook'); if(!sel) return;
  BIBLE_BOOKS.forEach(b=>{
    const o = document.createElement('option');
    o.value = b.name; o.textContent = b.name;
    sel.appendChild(o);
  });
  renderEsvBookGrid();
}

function onEsvBookChange(){
  const sel = document.getElementById('esvBook'); if(!sel) return;
  const book = BIBLE_BOOKS.find(b=>b.name===sel.value);
  const chSel = document.getElementById('esvChapter'); if(!chSel) return;
  chSel.innerHTML = '';
  if(!book){ chSel.innerHTML='<option>—</option>'; return; }
  for(let i=1;i<=book.ch;i++){
    const o=document.createElement('option'); o.value=i; o.textContent='Chapter '+i; chSel.appendChild(o);
  }
}

function jumpToTestament(t){
  const first = ESV_BOOK_SECTIONS[t][0];
  const sel = document.getElementById('esvBook'); if(!sel) return;
  sel.value = first;
  onEsvBookChange();
}

function renderEsvBookGrid(){
  const el = document.getElementById('esvBookGrid'); if(!el) return;
  const allBooks = [...ESV_BOOK_SECTIONS.OT, ...ESV_BOOK_SECTIONS.NT];
  const ntSet = new Set(ESV_BOOK_SECTIONS.NT);
  el.innerHTML = allBooks.map(name=>{
    const isNT = ntSet.has(name);
    const icon = ESV_ICONS[name]||'📖';
    const book = BIBLE_BOOKS.find(b=>b.name===name);
    const ch = book ? book.ch : 1;
    return `<div onclick="quickOpenEsvBook('${name.replace(/'/g,"\\'")}',${ch})" style="background:rgba(255,255,255,.02);border:1px solid ${isNT?'rgba(56,189,248,.15)':'rgba(167,139,250,.15)'};border-radius:10px;padding:.5rem .6rem;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:.4rem;" onmouseenter="this.style.transform='translateY(-2px)'" onmouseleave="this.style.transform=''">
      <span style="font-size:1rem;">${icon}</span>
      <div>
        <div style="font-size:.72rem;font-weight:700;color:var(--tx);line-height:1.2;">${name}</div>
        <div style="font-size:.58rem;color:var(--tx3);">${ch} ch · ${isNT?'NT':'OT'}</div>
      </div>
    </div>`;
  }).join('');
}

function quickOpenEsvBook(name, chapters){
  const sel = document.getElementById('esvBook'); if(sel) sel.value = name;
  onEsvBookChange();
  const chSel = document.getElementById('esvChapter'); if(chSel) chSel.value = '1';
  openEsvReader();
}

async function openEsvReader(){
  const book = (document.getElementById('esvBook')||{}).value;
  const ch = (document.getElementById('esvChapter')||{}).value || '1';
  if(!book){ showToast('Please select a book first'); return; }
  const key = 'aaf4dd2ad7cb2e6aa19853ddd493136125afb18e';

  const icon = ESV_ICONS[book]||'📖';
  const bookData = BIBLE_BOOKS.find(b=>b.name===book);
  const totalCh = bookData ? bookData.ch : 1;
  const chNum = parseInt(ch,10);

  // Use charModal (same modal devotionals use)
  document.getElementById('charIcon').textContent = icon;
  document.getElementById('charTitle').textContent = book;
  document.getElementById('charSub').textContent = 'Chapter '+chNum+' · English Standard Version (ESV)';
  document.getElementById('charModalHeader').style.background = 'linear-gradient(135deg,#667eea,#764ba2)';
  document.getElementById('charBody').innerHTML = '<div style="text-align:center;padding:2rem;color:var(--tx2);font-size:.85rem;">⏳ Loading '+book+' '+chNum+'...</div>';
  document.getElementById('charQuiz').innerHTML = '';
  openModal('charModal');

  // Fetch ESV text
  try {
    const ref = encodeURIComponent(book+' '+chNum);
    const url = `https://api.esv.org/v3/passage/text/?q=${ref}&include-headings=true&include-footnotes=false&include-verse-numbers=true&include-short-copyright=false&include-passage-references=false`;
    const resp = await fetch(url, {headers:{'Authorization':'Token '+key}});
    if(!resp.ok) throw new Error('API error '+resp.status+'. Check your ESV API key.');
    const data = await resp.json();
    const text = (data.passages&&data.passages[0])||'No text returned.';

    // Navigation arrows
    const prevDisabled = chNum<=1;
    const nextDisabled = chNum>=totalCh;
    const navHtml = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.8rem;gap:.5rem;">
      <button onclick="navigateEsvChapter('${book.replace(/'/g,"\\'")}',${chNum-1},${totalCh})" ${prevDisabled?'disabled style="opacity:.3;cursor:not-allowed;"':''} style="background:rgba(102,126,234,.15);border:1px solid rgba(102,126,234,.3);color:#a78bfa;border-radius:8px;padding:.4rem .8rem;font-size:.75rem;font-weight:700;cursor:pointer;">‹ Prev</button>
      <span style="font-size:.72rem;color:var(--tx3);font-weight:600;">${book} ${chNum} / ${totalCh}</span>
      <button onclick="navigateEsvChapter('${book.replace(/'/g,"\\'")}',${chNum+1},${totalCh})" ${nextDisabled?'disabled style="opacity:.3;cursor:not-allowed;"':''} style="background:rgba(102,126,234,.15);border:1px solid rgba(102,126,234,.3);color:#a78bfa;border-radius:8px;padding:.4rem .8rem;font-size:.75rem;font-weight:700;cursor:pointer;">Next ›</button>
    </div>`;

    const formattedText = text.replace(/\[(\d+)\]/g,'<sup style="color:#a78bfa;font-size:.65em;font-weight:700;">[$1]</sup>');
    document.getElementById('charBody').innerHTML = navHtml +
      `<div style="font-family:'Georgia','Times New Roman',serif;font-size:.9rem;line-height:2;color:var(--tx);white-space:pre-wrap;">${formattedText}</div>
      <div style="margin-top:1.2rem;padding-top:.8rem;border-top:1px solid rgba(255,255,255,.06);font-size:.58rem;color:var(--tx3);line-height:1.6;">
        Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.
      </div>`;
  } catch(err){
    document.getElementById('charBody').innerHTML = `<div style="text-align:center;padding:1.5rem;color:#f87171;font-size:.82rem;">❌ ${err.message}</div>
      <div style="font-size:.75rem;color:var(--tx2);text-align:center;margin-top:.5rem;">Make sure your ESV API key is valid. Get one free at <span style="color:var(--c);">api.esv.org</span></div>`;
  }
}

function navigateEsvChapter(book, ch, totalCh){
  if(ch<1||ch>totalCh) return;
  const sel = document.getElementById('esvBook'); if(sel) sel.value=book;
  onEsvBookChange();
  const chSel = document.getElementById('esvChapter'); if(chSel) chSel.value=String(ch);
  openEsvReader();
}

// ── JESUS & GOD'S PURPOSE ────────────────────────────────────
const JESUS_LESSONS = [
  {icon:'✝️',title:'Who Is Jesus?',color:'#a78bfa',
    body:`<h4>The Central Figure of History</h4><p>Jesus of Nazareth is the most influential person who ever lived. Every calendar date is measured from his birth. But who did he claim to be?</p><p>Jesus claimed to be the Son of God — not just a good teacher, but God himself in human form. In John 14:6 he said, <i>"I am the way and the truth and the life."</i> In John 10:30, <i>"I and the Father are one."</i></p><h4>Liar, Lunatic, or Lord</h4><p>C.S. Lewis wrote that Jesus was either a <b>liar</b> (he knew he wasn't God and said it anyway), a <b>lunatic</b> (he genuinely believed it but was delusional), or he was telling the truth — he is <b>Lord</b>. What he cannot be is "just a nice teacher." Nice teachers don't claim to be God.</p><p>Christians believe Jesus is fully God and fully human — born of a virgin, lived a perfect life, performed miracles, was crucified, died, and rose from the dead three days later.</p>`},
  {icon:'🌍',title:'Why Did Jesus Come?',color:'#22c55e',
    body:`<h4>The Problem</h4><p>God created humans for relationship with him. But humans chose their own way — the Bible calls this sin. Sin separates us from a holy God the way darkness is separated from light.</p><h4>The Solution</h4><p>God could have left us in that separation. Instead, he entered the mess himself. Jesus came to live the perfect life we couldn't live, and to die the death we deserved.</p><p>On the cross, he took the punishment for every sin — past, present, and future — so that anyone who trusts in him can be forgiven and restored to relationship with God.</p><h4>What It Means for You</h4><p>You don't have to earn God's love. You can't. It's a gift — grace. <i>"For it is by grace you have been saved, through faith"</i> (Ephesians 2:8). All you have to do is receive it.</p>`},
  {icon:'🤲',title:'What Is Forgiveness?',color:'#60a5fa',
    body:`<h4>God's Forgiveness</h4><p>Imagine someone smashes your car window. Forgiveness doesn't mean the window wasn't broken — it means YOU pay for the repair instead of demanding they do. That is what Jesus did on the cross. He paid for what we broke.</p><h4>How It Changes Everything</h4><p>When you accept God's forgiveness: Your guilt is removed. Your relationship with God is restored. Your identity changes — you are no longer defined by your worst moments. Your future is secured.</p><h4>Forgiving Others</h4><p>Because God forgave us, we are called to forgive others. Not because they deserve it — but because holding onto unforgiveness is like drinking poison and expecting the other person to get sick. Forgiveness sets YOU free.</p>`},
  {icon:'❤️',title:'Loving Others — The Greatest Command',color:'#f472b6',
    body:`<h4>The Two Greatest Commandments</h4><p>Jesus said: <i>"Love the Lord your God with all your heart and with all your soul and with all your mind. And love your neighbor as yourself."</i> (Matthew 22:37-39). Every other command hangs on these two.</p><h4>What Love Looks Like</h4><p>Biblical love is not a feeling — it is a decision and an action. <i>"Love is patient, love is kind. It does not envy, it does not boast."</i> (1 Corinthians 13). This is not natural. It is supernatural.</p><h4>Practical Love</h4><p>Love your family by being present. Love your friends by being honest. Love your enemies by praying for them. Love strangers by seeing them as people made in God's image. Love is not what you feel — it is what you do.</p>`},
  {icon:'🎯',title:'Your Purpose in Life',color:'#fbbf24',
    body:`<h4>You Were Made on Purpose, for a Purpose</h4><p><i>"For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do"</i> (Ephesians 2:10).</p><h4>How to Find It</h4><p>Purpose is discovered at the intersection of three things: <b>What you're good at</b> (your gifts), <b>what breaks your heart</b> (the problems you can't ignore), and <b>what the world needs</b>. When all three overlap, you've found your purpose.</p><h4>Living with Purpose</h4><p>A nurse who treats every patient as made in God's image is living with purpose. An engineer who builds safe bridges is living with purpose. Whatever you do, do it as if you're doing it for God — because you are. <i>"Whatever you do, work at it with all your heart, as working for the Lord"</i> (Colossians 3:23).</p>`},
  {icon:'🕊️',title:'The Holy Spirit — God Living in You',color:'#06b6d4',
    body:`<h4>Who Is the Holy Spirit?</h4><p>The Holy Spirit is the third person of the Trinity — not a force or a feeling, but God himself living inside every believer. When Jesus left earth, he promised to send the Spirit as a helper, guide, and comforter.</p><h4>What the Spirit Does</h4><p><b>Guides you:</b> Have you ever felt a strong nudge to do the right thing, or a warning to stop? That's often the Spirit. <b>Convicts you:</b> That uncomfortable feeling when you've done something wrong? That's the Spirit's way of course-correcting. <b>Empowers you:</b> The courage to forgive, the strength to resist temptation, the ability to love people you normally couldn't — that's supernatural power.</p><h4>The Fruit of the Spirit</h4><p><i>"The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control"</i> (Galatians 5:22-23). These qualities grow in you as you walk with God.</p>`},
  {icon:'🛡️',title:'Spiritual Warfare — The Battle for Your Mind',color:'#ef4444',
    body:`<h4>You Are in a Battle</h4><p>Whether you realize it or not, there is a battle happening for your mind, your identity, and your purpose. The Bible says the enemy comes to steal, kill, and destroy (John 10:10) — but Jesus came to give life.</p><h4>The Armor of God</h4><p>Ephesians 6 describes spiritual armor: <b>Truth</b> protects your mind from lies. <b>Righteousness</b> guards your heart. <b>Peace</b> keeps you steady. <b>Faith</b> deflects attacks. <b>Salvation</b> protects your identity. <b>The Word of God</b> is your only offensive weapon.</p><h4>Practical Application</h4><p>When you feel anxious, fearful, or defeated — that's often a spiritual attack, not just emotions. Combat it with truth: "God has not given me a spirit of fear" (2 Timothy 1:7). Read scripture. Pray. Talk to someone you trust. You are not fighting alone.</p>`},
  {icon:'⛪',title:'The Church — Why Community Matters',color:'#38bdf8',
    body:`<h4>What Is the Church?</h4><p>The church is not a building — it's people. Every believer is part of one global family. The church exists to worship God together, learn together, serve together, and hold each other accountable.</p><h4>Why You Need It</h4><p>Faith was never meant to be a solo journey. You need people who will pray for you when you're struggling, celebrate with you when you're winning, and tell you the truth when you're off track. <i>"As iron sharpens iron, so one person sharpens another"</i> (Proverbs 27:17).</p><h4>Finding Your Place</h4><p>No church is perfect because churches are full of imperfect people. Look for a community that teaches the Bible, genuinely cares for people, and challenges you to grow. Your involvement doesn't have to start big — just show up consistently.</p>`},
  {icon:'🌊',title:'Baptism & Communion — What They Mean',color:'#22d3ee',
    body:`<h4>Baptism</h4><p>Baptism is a public declaration of an internal decision. When you go under the water, it symbolizes dying to your old life. When you come up, it symbolizes rising to new life in Christ. It doesn't save you — faith does — but it's an act of obedience and a powerful statement to the world.</p><h4>Communion (The Lord's Supper)</h4><p>Jesus shared bread and wine with his disciples the night before he was crucified. The bread represents his body, broken for us. The cup represents his blood, shed for our forgiveness. Communion is a regular reminder of what Jesus did and why it matters.</p><h4>Why They Matter</h4><p>Both are acts of remembrance and obedience. They connect you to 2,000 years of believers who did the same things. They're not rituals — they're responses to grace.</p>`},
  {icon:'🔮',title:'Heaven, Hell, and Eternity',color:'#8b5cf6',
    body:`<h4>What the Bible Says</h4><p>The Bible teaches that physical death is not the end. Every person will spend eternity somewhere. Heaven is described as being in God's presence forever — no pain, no tears, no death. Hell is described as eternal separation from God.</p><h4>Who Goes Where?</h4><p>The Bible is clear: salvation is through faith in Jesus, not through good works. <i>"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life"</i> (John 3:16). It's not about being good enough — it's about trusting the One who is.</p><h4>Why It Matters Now</h4><p>If eternity is real, it changes how you live today. It means your choices have weight beyond this life. It means every person you meet has an eternal soul. And it means the most important question you'll ever answer is: What will you do with Jesus?</p>`},
  {icon:'📖',title:'The Bible — God\'s Word to You',color:'#f59e0b',
    body:`<h4>What Is the Bible?</h4><p>The Bible is not just an ancient religious text — Christians believe it is God's direct communication to humanity. <i>"All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness"</i> (2 Timothy 3:16). God used approximately 40 human authors over 1,500 years — yet the message is unified.</p><h4>Why It Still Matters</h4><p>The Bible outsells every book in history every year. But more than popularity — it is the only book that has been proven historically accurate through archaeology, fulfilled prophecy, and manuscript evidence. The New Testament alone has over 5,800 Greek manuscripts, far more than any other ancient text.</p><h4>How to Read It</h4><p>Don't start at Genesis. Start with John — it tells you who Jesus is clearly. Then Proverbs for daily wisdom. Then Romans to understand the gospel deeply. Let it speak to your specific situation: search for what you need. It speaks to every human experience.`},
  {icon:'🙏',title:'How to Pray — Real Conversation with God',color:'#22c55e',
    body:`<h4>What Prayer Actually Is</h4><p>Prayer is not a religious ritual or magic formula. It is a conversation with God — the most powerful being in the universe who also knows every hair on your head and cares about your smallest worry.</p><h4>The Lord's Prayer as a Template</h4><p>Jesus gave his disciples a model prayer (Matthew 6:9-13): Start with <b>worship</b> ("Our Father in heaven, hallowed be your name"). Pray for <b>God's will</b> ("your kingdom come"). Bring your <b>needs</b> ("give us today our daily bread"). Ask for <b>forgiveness</b> and extend it. Ask for <b>protection</b> from temptation.</p><h4>Practical Tips</h4><p>Pray out loud or write it down — both help focus. Be honest. God already knows your thoughts, so pretending is pointless. Start with gratitude before requests. Set a specific time daily. Even 5 minutes changes your day. You don't need fancy words — just be real.`},
  {icon:'⚡',title:'The Resurrection — Everything Depends on It',color:'#ef4444',
    body:`<h4>The Central Claim</h4><p>Christianity rises or falls on one event: the resurrection of Jesus. Paul wrote, <i>"If Christ has not been raised, your faith is futile; you are still in your sins"</i> (1 Corinthians 15:17). No other religion makes this claim — a founder who died and physically came back.</p><h4>Evidence for the Resurrection</h4><p>The tomb was empty — even Jesus's enemies acknowledged this. Over 500 people saw Jesus alive after his death (1 Corinthians 15:6). The disciples were transformed from hiding in fear to dying for their testimony. People die for beliefs — but rarely for something they know is a lie.</p><h4>What It Means for You</h4><p>The resurrection means death is not the final word. It means Jesus has power over the very thing we fear most. And it means the same power that raised Jesus from the dead is available to you — to transform your life, restore broken things, and give you real hope.`},
  {icon:'🌱',title:'Growing in Your Faith — Discipleship',color:'#10b981',
    body:`<h4>What Is a Disciple?</h4><p>A disciple is not just someone who believes — it's someone who follows. Jesus said "Follow me" — not just "agree with me." The goal of Christian faith is not to check a box but to be transformed, day by day, into someone who thinks, loves, and acts more like Jesus.</p><h4>The Four Essentials</h4><p><b>Word:</b> Read the Bible regularly — it renews your mind. <b>Prayer:</b> Talk to God daily — it aligns your will with His. <b>Community:</b> Do life with other believers — it sharpens you. <b>Service:</b> Use your gifts to help others — it deepens your faith.</p><h4>The Long Game</h4><p>Discipleship is not a sprint. It's a lifetime of small choices — choosing truth over lies, love over selfishness, faith over fear — every single day. You won't be perfect. But you will grow. And the person you become in 10 years of walking with God is the most important investment you'll ever make.`},
  {icon:'💰',title:'Money, Generosity & God\'s Economy',color:'#fbbf24',
    body:`<h4>What Jesus Said About Money</h4><p>Jesus talked about money more than almost any other topic — because he knew it would compete for our hearts. <i>"No one can serve two masters. You cannot serve both God and money"</i> (Matthew 6:24). Money is not evil — the love of money is the root of all kinds of evil (1 Timothy 6:10).</p><h4>The Tithe and Generosity</h4><p>Tithing — giving 10% to the local church — is a biblical practice that started before the Law. But Jesus raised the bar beyond percentage: he commended the widow who gave everything she had. Generosity is a heart posture, not a math problem.</p><h4>God's Economic Principle</h4><p><i>"Give, and it will be given to you"</i> (Luke 6:38). This is not a prosperity gospel formula — it's a kingdom principle. When we hold money loosely, trusting God to provide, we experience a freedom that no bank account can give. Try giving before you feel you can afford it and watch what happens.`},
  {icon:'🧩',title:'Suffering — Why Does God Allow It?',color:'#64748b',
    body:`<h4>The Hardest Question</h4><p>If God is good and all-powerful, why is there suffering? This is the most honest and important question faith must face. The Bible doesn't give one simple answer — it gives something better: it shows God entering the suffering himself.</p><h4>What the Bible Does Say</h4><p>God can bring good from suffering (Romans 8:28). Suffering can produce character, perseverance, and hope (James 1:2-4). God is close to the brokenhearted (Psalm 34:18). And ultimately, suffering is not the last word — Jesus's resurrection guarantees that death, pain, and injustice will not win forever.</p><h4>When You Are Suffering</h4><p>Don't pretend it's fine. Be honest with God — the Psalms are full of lament and anger directed at God. He can handle your honesty. Cling to what you know is true about His character even when circumstances contradict it. And find one person to walk through it with you — isolation makes pain worse.`},
  {icon:'🏆',title:'The Christian Life — What Victory Looks Like',color:'#38bdf8',
    body:`<h4>Not a Self-Help Project</h4><p>Christianity is not about becoming a better version of yourself through discipline. It is about dying to the old self and being raised as a new creation. <i>"I have been crucified with Christ and I no longer live, but Christ lives in me"</i> (Galatians 2:20). The power source changes — from willpower to the Holy Spirit.</p><h4>What Victory Actually Looks Like</h4><p>It looks like forgiving someone who doesn't deserve it. Staying faithful when no one is watching. Choosing peace instead of anxiety. Loving difficult people. Getting back up after failure. These quiet, daily choices are the real trophies of a victorious faith.</p><h4>The Goal</h4><p>The goal is not a perfect life — it is a faithful one. A life where, at the end, you can say what Paul said: <i>"I have fought the good fight, I have finished the race, I have kept the faith"</i> (2 Timothy 4:7). That's the victory worth running for.`},
];

const LEARN_BIBLE_LESSONS = [
  {icon:'📚',title:'Old Testament vs New Testament',color:'#38bdf8',
    body:`<h4>The Big Picture</h4><p>The Bible has 66 books by about 40 authors over 1,500 years. It's divided into two sections:</p><p><b>Old Testament (39 books):</b> Written before Jesus. Covers creation, Israel's history, God's laws, poetry and wisdom (Psalms, Proverbs), and prophecies about the coming Messiah.</p><p><b>New Testament (27 books):</b> Written after Jesus. The four Gospels tell Jesus's life story. Acts records the early church. The Letters teach Christian living. Revelation describes the end times.</p><h4>How They Connect</h4><p>The Old Testament is the promise. The New Testament is the fulfillment. Everything in the OT points toward Jesus.</p>`},
  {icon:'🔍',title:'How to Interpret Scripture',color:'#a78bfa',
    body:`<h4>Context Is Everything</h4><p>The #1 mistake: pulling a single verse out of context. Before applying it to your life, ask:</p><p><b>Who wrote this?</b> Paul writing to a church vs. David writing a song vs. Moses recording history.</p><p><b>Who were they writing to?</b> First-century Christians vs. ancient Israelites.</p><p><b>What type of writing is it?</b> History? Poetry? Prophecy? Law? Letter?</p><h4>Practical Steps</h4><p>Read the whole chapter, not just one verse. Compare with other passages on the same topic. Use a study Bible with notes. Ask: "What did this mean to the original audience?" THEN ask: "What principle applies to my life?"</p>`},
  {icon:'✍️',title:'Taking Notes & Journaling Scripture',color:'#22c55e',
    body:`<h4>Why Write It Down</h4><p>You retain 10% of what you read and 70% of what you write. Writing notes about scripture processes it deeper and helps you remember and apply it.</p><h4>The SOAP Method</h4><p><b>S — Scripture:</b> Write out the verse that stood out.<br><b>O — Observation:</b> What does it say? What words stand out?<br><b>A — Application:</b> How does this apply to MY life TODAY?<br><b>P — Prayer:</b> Write a prayer based on what you read.</p><h4>Color Coding</h4><p>Many people highlight with colors: <span style="background:#fef08a;color:#000;padding:0 .3rem;border-radius:3px;">Yellow = promises</span> <span style="background:#bbf7d0;color:#000;padding:0 .3rem;border-radius:3px;">Green = growth</span> <span style="background:#bfdbfe;color:#000;padding:0 .3rem;border-radius:3px;">Blue = God's character</span> <span style="background:#fecaca;color:#000;padding:0 .3rem;border-radius:3px;">Red = warning</span> <span style="background:#e9d5ff;color:#000;padding:0 .3rem;border-radius:3px;">Purple = prophecy</span></p>`},
  {icon:'🙏',title:'Prayer Before Reading',color:'#f472b6',
    body:`<h4>Why Pray First</h4><p>The Bible is not an ordinary book. Christians believe it is inspired by God. Reading it without inviting God into the process is like having a letter from someone and never asking them what they meant.</p><h4>A Simple Prayer</h4><p style="background:rgba(244,114,182,.05);border-left:3px solid #f472b6;padding:.8rem 1rem;border-radius:0 8px 8px 0;font-style:italic;"><i>"God, open my eyes to see what you want to show me today. Open my heart to receive it. Open my mind to understand it. Give me the courage to apply it. Amen."</i></p><h4>What to Expect</h4><p>Sometimes a verse will jump off the page. Other times it'll feel like just reading words. Both are normal. Consistency matters more than feelings. Show up every day and trust that God is working.</p>`},
  {icon:'🏗️',title:'How God Structured the Bible',color:'#fb923c',
    body:`<h4>Old Testament Categories</h4><p><b>The Law (5):</b> Genesis–Deuteronomy — creation, exodus, God's laws.<br><b>History (12):</b> Joshua–Esther — Israel's conquests, kings, exile, return.<br><b>Poetry (5):</b> Job–Song of Solomon — songs, prayers, wisdom.<br><b>Prophets (17):</b> Isaiah–Malachi — God's messages and Messiah promises.</p><h4>New Testament Categories</h4><p><b>Gospels (4):</b> Matthew–John — Jesus's life, death, resurrection.<br><b>History (1):</b> Acts — birth of the early church.<br><b>Letters (21):</b> Romans–Jude — instruction for Christian living.<br><b>Prophecy (1):</b> Revelation — God's ultimate victory.</p><h4>Where to Start</h4><p>Don't start at Genesis (most people quit in Leviticus). Start with <b>John</b>, then <b>Proverbs</b>, then <b>Psalms</b>, then <b>Romans</b>.</p>`},
  {icon:'📖',title:'How to Do a Bible Study',color:'#22d3ee',
    body:`<h4>Three Approaches</h4><p><b>Book Study:</b> Pick one book and read through it over days/weeks. Start with a short one: James (5 chapters), Philippians (4 chapters), or 1 John (5 chapters). Read a chapter per day.</p><p><b>Topic Study:</b> Pick a topic (forgiveness, fear, purpose) and look up every verse about it. Use a concordance or search tool. Write down what you learn.</p><p><b>Character Study:</b> Pick a person (David, Ruth, Paul, Peter) and read their story. Note their strengths, weaknesses, how God used them, and what you can learn.</p><h4>The Right Pace</h4><p>Quality over quantity. It's better to deeply read 5 verses than to skim 5 chapters. Stop when something strikes you. Sit with it. Ask God what he's saying through it.</p>`},
  {icon:'🗓️',title:'Bible Reading Plans',color:'#f59e0b',
    body:`<h4>Popular Plans</h4><p><b>One Year Bible:</b> Read the entire Bible in 365 days — about 15 minutes/day. Covers OT, NT, Psalms, and Proverbs daily.</p><p><b>Chronological:</b> Read the Bible in the order events happened (not the order books appear). Helps you understand the timeline.</p><p><b>Gospel-First:</b> Start with all 4 Gospels, then Acts, then Letters, then OT. Helps you see everything through Jesus.</p><h4>Building the Habit</h4><p>Same time every day. Same place. Start small — even 5 minutes counts. Don't read to check a box; read to hear from God. If you miss a day, don't try to "catch up" — just pick up where you left off. Consistency beats perfection.</p>`},
  {icon:'🤔',title:'Hard Questions About the Bible',color:'#ef4444',
    body:`<h4>Is the Bible Reliable?</h4><p>The Bible has more manuscript evidence than any other ancient text. Over 5,800 Greek manuscripts of the New Testament exist, the earliest dating within decades of the originals. For comparison, most ancient texts have fewer than 10 copies.</p><h4>What About Contradictions?</h4><p>Most "contradictions" are differences in perspective (like eyewitness accounts of the same event). Some are translation nuances. Serious study resolves most. Some remain mysteries — and that's okay. Faith doesn't require understanding everything.</p><h4>Is It All Literal?</h4><p>The Bible contains multiple genres: history (meant literally), poetry (meant metaphorically), prophecy (symbolic imagery), proverbs (general wisdom, not promises), and letters (practical instruction). Reading everything the same way misses the point. Context determines how to read each passage.</p>`},
  {icon:'💬',title:'Memorizing Scripture — Why and How',color:'#10b981',
    body:`<h4>Why Memorize?</h4><p>When anxiety hits at 2am, you can't Google fast enough. When temptation comes, you need truth already loaded. When a friend is hurting, the right verse at the right time changes everything. Scripture in your memory is available anytime, anywhere.</p><h4>How to Do It</h4><p><b>Start with 5 power verses:</b> John 3:16, Philippians 4:13, Proverbs 3:5-6, Romans 8:28, Jeremiah 29:11. These cover love, strength, trust, purpose, and hope.</p><p><b>The method:</b> Write the verse on a card. Read it aloud 5 times. Cover it and try to recite. Review yesterday's verse before adding a new one. After a week, you'll know it for life.</p><p><b>Make it stick:</b> Set it as your phone wallpaper. Write it on your bathroom mirror. Say it before meals. Teach it to someone else — teaching is the fastest way to memorize.</p>`},
  {icon:'🌟',title:'Applying the Bible to Real Life',color:'#8b5cf6',
    body:`<h4>The Bridge</h4><p>Reading the Bible without applying it is like reading a recipe without cooking. The goal is not knowledge — it is transformation. Every time you read, ask: "So what? What do I DO with this?"</p><h4>Practical Examples</h4><p><b>Read about forgiveness?</b> → Text that person you've been avoiding. <b>Read about generosity?</b> → Give something away this week. <b>Read about patience?</b> → Next time you're frustrated, pause for 10 seconds before responding. <b>Read about loving enemies?</b> → Pray (actually pray) for someone who wronged you.</p><h4>The Transformation Cycle</h4><p><b>Read → Understand → Apply → Reflect → Repeat.</b> The Bible changes you not by reading more, but by doing what you've already read. Start with one thing this week. Just one. And watch what happens.</p>`},
  {icon:'🗺️',title:'The Story of the Bible in One Page',color:'#f59e0b',
    body:`<h4>One Unified Story</h4><p>The Bible is not a random collection of writings — it is one story told across 66 books. That story has four acts:</p><p><b>Creation:</b> God makes a perfect world and humans to share it with. They are made in His image with purpose and dignity. <b>Fall:</b> Humans choose independence from God. Sin, suffering, and death enter the world. Everything breaks.</p><p><b>Redemption:</b> God immediately begins a rescue plan. He calls Abraham, forms a nation (Israel), gives the Law, sends prophets — all pointing toward the ultimate rescue: Jesus. Jesus lives, dies, and rises to restore what was broken. <b>Restoration:</b> One day, everything is made new. No more suffering, death, or separation from God. The story ends where it began — humans and God together in a perfect world.</p><h4>Where You Are in the Story</h4><p>You are living in Act 3, between the resurrection and the final restoration. You are part of the rescue mission — a new creation called to bring glimpses of the restored world into the broken one.`},
  {icon:'🔑',title:'Key Verses Everyone Should Know',color:'#a78bfa',
    body:`<h4>The Gospel in One Verse</h4><p><b>John 3:16 —</b> "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."</p><h4>Identity</h4><p><b>Psalm 139:14 —</b> "I am fearfully and wonderfully made." <b>2 Corinthians 5:17 —</b> "If anyone is in Christ, the new creation has come."</p><h4>Strength and Peace</h4><p><b>Philippians 4:13 —</b> "I can do all this through him who gives me strength." <b>Philippians 4:6-7 —</b> "Do not be anxious about anything... the peace of God will guard your hearts."</p><h4>Trust and Purpose</h4><p><b>Proverbs 3:5-6 —</b> "Trust in the LORD with all your heart and lean not on your own understanding." <b>Jeremiah 29:11 —</b> "For I know the plans I have for you — plans to give you hope and a future." <b>Romans 8:28 —</b> "In all things God works for the good of those who love him."</p>`},
  {icon:'📜',title:'The 10 Commandments — Still Relevant?',color:'#ef4444',
    body:`<h4>The Original Ten</h4><p>God gave Moses ten commands that have shaped civilization more than any other document. They fall in two groups: the first four govern our relationship with God, the last six govern our relationships with people.</p><p><b>God-focused:</b> No other gods. No idols. Don't misuse God's name. Keep the Sabbath. <b>People-focused:</b> Honor your parents. Don't murder. Don't commit adultery. Don't steal. Don't lie. Don't covet.</p><h4>Jesus's Summary</h4><p>Jesus compressed all ten into two: Love God with everything you have. Love your neighbor as yourself. If you do both, all ten are covered.</p><h4>Are They Still Binding?</h4><p>Christians are not under the Law as a means of salvation — Jesus fulfilled the Law. But the moral principles (don't murder, don't steal, etc.) reflect God's unchanging character and are reinforced in the New Testament. They show us what love looks like in action.`},
  {icon:'🌊',title:'Major Themes Across the Whole Bible',color:'#06b6d4',
    body:`<h4>Covenant</h4><p>God makes binding promises — covenants — with his people. With Noah (never flood the whole earth again). With Abraham (a great nation and blessing to all peoples). With Moses (law and land). With David (an eternal king from his line). With everyone through Jesus (forgiveness and eternal life). Each covenant builds on the last.</p><h4>Redemption</h4><p>From Exodus (freeing slaves from Egypt) to the cross (freeing people from sin), redemption runs through every book. God is always in the business of rescuing people from bondage and restoring them to freedom.</p><h4>The Presence of God</h4><p>The central longing of the Bible is for God and humans to be together. Eden — they walked with God. Exodus — the tabernacle, God among the camp. Temple — God's house in Jerusalem. Jesus — God became human. Holy Spirit — God living inside believers. New Jerusalem — God with his people forever.`},
  {icon:'👑',title:'The Psalms — How to Pray Every Emotion',color:'#22c55e',
    body:`<h4>What the Psalms Are</h4><p>The Psalms are 150 ancient songs and prayers — and they cover every human emotion: joy, grief, anger, fear, doubt, worship, depression, gratitude, confusion, and hope. They were written primarily by David and show that talking to God honestly is always acceptable.</p><h4>Types of Psalms</h4><p><b>Praise:</b> Pure worship (Psalm 100, 150). <b>Lament:</b> Crying out in pain (Psalm 22, 88 — these are raw and honest). <b>Thanksgiving:</b> Gratitude for what God has done (Psalm 107). <b>Wisdom:</b> Teaching about life (Psalm 1, 37). <b>Messianic:</b> Prophecies pointing to Jesus (Psalm 22, 110).</p><h4>How to Use the Psalms</h4><p>Find a psalm that matches where you are emotionally and pray it as your own prayer. Angry? Psalm 13. Scared? Psalm 23. Grateful? Psalm 103. Overwhelmed? Psalm 46. The Psalms give you words when you have none.`},
  {icon:'⚓',title:'Promises of God — What You Can Stand On',color:'#60a5fa',
    body:`<h4>Why Promises Matter</h4><p>Life is unstable. Relationships change, health fails, jobs disappear. But the Bible is filled with promises from the only Being who never changes, never lies, and has the power to keep every word. These promises are not wishes — they are guarantees from the Creator of the universe.</p><h4>Promises to Stand On</h4><p><b>His presence:</b> "Never will I leave you; never will I forsake you" (Hebrews 13:5). <b>His provision:</b> "My God will meet all your needs" (Philippians 4:19). <b>His peace:</b> "The peace of God will guard your hearts" (Philippians 4:7). <b>His purpose:</b> "In all things God works for the good of those who love him" (Romans 8:28). <b>His power:</b> "I can do all things through Christ who strengthens me" (Philippians 4:13).</p><h4>Claiming Promises</h4><p>When anxiety or doubt hits, find the promise that addresses it specifically, say it out loud, and make it a prayer. "God, You promised never to leave me — I'm holding You to that right now." This is not presumption — it is faith.`},
  {icon:'🔥',title:'The Book of Acts — How the Church Was Born',color:'#fb923c',
    body:`<h4>The Story</h4><p>Acts is the sequel to Luke's Gospel — it picks up right where Jesus ascended into heaven and the disciples were left wondering what to do next. Then the Holy Spirit came at Pentecost and everything changed. 3,000 people believed in one day. The church was born.</p><h4>What Happened Next</h4><p>The early believers shared everything, met daily, performed miracles, and turned the known world upside down — with no buildings, no budgets, and no political power. Within 300 years, Christianity had spread to every corner of the Roman Empire and beyond.</p><h4>What It Means for Today</h4><p>Acts answers the question: what is the church supposed to look like? It looked like people in community, filled with the Spirit, fearless in sharing Jesus, generous with what they had, and willing to suffer for what they believed. That's still the blueprint. The same Spirit that powered the early church is available to every believer today.`},
];

// ── FAITH JOURNEY ────────────────────────────────────────────
function renderFaithJourney(){
  renderPrayerList();
  renderFaithMilestones();
  renderFavVerses();
}

function savePrayer(type){
  const input = document.getElementById('prayerInput');
  if(!input || !input.value.trim()){ showToast('Write your prayer first'); return; }
  if(!D.prayers) D.prayers = [];
  D.prayers.push({
    id:Date.now(), text:input.value.trim(), type,
    date:new Date().toISOString().slice(0,10), answered:false
  });
  input.value = '';
  save(); renderPrayerList();
  logActivity('faith', type==='praise'?'Praise report':'Prayer request');
  showToast(type==='praise'?'Praise logged! 🎉':'Prayer saved 🙏');
}

function renderPrayerList(){
  const el = document.getElementById('prayerList'); if(!el) return;
  const prayers = (D.prayers||[]).slice().reverse();
  if(!prayers.length){ el.innerHTML='<div style="text-align:center;font-size:.72rem;color:var(--tx3);padding:.5rem;">Start your prayer journal above.</div>'; return; }
  el.innerHTML = prayers.map(p=>`
    <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-left:4px solid ${p.type==='praise'?'#22c55e':p.answered?'#fbbf24':'#a78bfa'};border-radius:0 10px 10px 0;padding:.6rem .8rem;margin-bottom:.35rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.2rem;">
        <span style="font-size:.65rem;font-weight:700;color:${p.type==='praise'?'#22c55e':'#a78bfa'};">${p.type==='praise'?'🎉 Praise':'🙏 Prayer'}${p.answered?' · ✅ Answered':''}</span>
        <span style="font-size:.55rem;color:var(--tx3);">${p.date}</span>
      </div>
      <div style="font-size:.78rem;color:var(--tx2);line-height:1.5;">${p.text}</div>
      <div style="display:flex;gap:.3rem;margin-top:.3rem;">
        ${p.type==='request'&&!p.answered?`<button onclick="markPrayerAnswered(${p.id})" style="font-size:.5rem;color:#fbbf24;background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.15);border-radius:4px;padding:.12rem .3rem;cursor:pointer;">✅ Answered!</button>`:''}
        <button onclick="deletePrayer(${p.id})" style="font-size:.45rem;color:var(--tx3);background:none;border:none;cursor:pointer;">🗑</button>
      </div>
    </div>
  `).join('');
}

function markPrayerAnswered(id){
  const p = (D.prayers||[]).find(x=>x.id===id);
  if(p){ p.answered = true; p.answeredDate = new Date().toISOString().slice(0,10); save(); renderPrayerList(); showToast('Prayer answered! ✅'); }
}

function deletePrayer(id){
  D.prayers = (D.prayers||[]).filter(x=>x.id!==id);
  save(); renderPrayerList();
}

function renderFaithMilestones(){
  const el = document.getElementById('faithMilestones'); if(!el) return;
  const devotionalsRead = Object.keys(D.scrReadDays||{}).length;
  const bibleReadings = (D.bibleReadings||[]).length;
  const prayers = (D.prayers||[]).length;
  const answered = (D.prayers||[]).filter(p=>p.answered).length;
  const favVerses = (D.favVerses||[]).length;
  const studyNotes = (D.scrNotes||[]).length;
  
  const milestones = [
    {icon:'🕊️',label:'Devotionals Read',count:devotionalsRead,target:100,color:'#a78bfa'},
    {icon:'📕',label:'Bible Readings',count:bibleReadings,target:20,color:'#60a5fa'},
    {icon:'🙏',label:'Prayers Written',count:prayers,target:15,color:'#f472b6'},
    {icon:'✅',label:'Prayers Answered',count:answered,target:5,color:'#22c55e'},
    {icon:'💎',label:'Favorite Verses',count:favVerses,target:10,color:'#fbbf24'},
    {icon:'✍️',label:'Study Notes',count:studyNotes,target:10,color:'#38bdf8'},
  ];

  el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.4rem;">` +
    milestones.map(m=>{
      const pct = Math.min(100, (m.count/m.target)*100);
      return `<div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:8px;padding:.5rem;text-align:center;">
        <div style="font-size:1rem;">${m.icon}</div>
        <div style="font-size:1rem;font-weight:800;color:${m.color};">${m.count}</div>
        <div style="font-size:.55rem;color:var(--tx2);">${m.label}</div>
        <div style="height:3px;background:rgba(255,255,255,.06);border-radius:2px;margin-top:.3rem;overflow:hidden;"><div style="height:100%;width:${pct}%;background:${m.color};border-radius:2px;"></div></div>
      </div>`;
    }).join('') + `</div>`;
}

function saveFavVerse(){
  const input = document.getElementById('favVerseInput');
  if(!input || !input.value.trim()){ showToast('Type a verse'); return; }
  if(!D.favVerses) D.favVerses = [];
  D.favVerses.push({id:Date.now(), text:input.value.trim(), date:new Date().toISOString().slice(0,10)});
  input.value = '';
  save(); renderFavVerses();
  showToast('Verse saved 💎');
}

function renderFavVerses(){
  const el = document.getElementById('favVersesList'); if(!el) return;
  const verses = (D.favVerses||[]).slice().reverse();
  if(!verses.length){ el.innerHTML='<div style="font-size:.68rem;color:var(--tx3);">No favorite verses saved yet.</div>'; return; }
  el.innerHTML = verses.map(v=>`
    <div style="display:flex;align-items:center;gap:.4rem;padding:.3rem .4rem;border-bottom:1px solid rgba(255,255,255,.03);">
      <span style="font-size:.7rem;">💎</span>
      <span style="flex:1;font-size:.75rem;font-style:italic;color:var(--tx2);line-height:1.4;">${v.text}</span>
      <button onclick="D.favVerses=(D.favVerses||[]).filter(x=>x.id!==${v.id});save();renderFavVerses();" style="font-size:.4rem;color:var(--tx3);background:none;border:none;cursor:pointer;">✕</button>
    </div>
  `).join('');
}

// ── 66 BOOKS OF THE BIBLE ────────────────────────────────────
const BIBLE_BOOKS = [
  {name:'Genesis',ch:50},{name:'Exodus',ch:40},{name:'Leviticus',ch:27},{name:'Numbers',ch:36},{name:'Deuteronomy',ch:34},
  {name:'Joshua',ch:24},{name:'Judges',ch:21},{name:'Ruth',ch:4},{name:'1 Samuel',ch:31},{name:'2 Samuel',ch:24},
  {name:'1 Kings',ch:22},{name:'2 Kings',ch:25},{name:'1 Chronicles',ch:29},{name:'2 Chronicles',ch:36},{name:'Ezra',ch:10},
  {name:'Nehemiah',ch:13},{name:'Esther',ch:10},{name:'Job',ch:42},{name:'Psalms',ch:150},{name:'Proverbs',ch:31},
  {name:'Ecclesiastes',ch:12},{name:'Song of Solomon',ch:8},{name:'Isaiah',ch:66},{name:'Jeremiah',ch:52},{name:'Lamentations',ch:5},
  {name:'Ezekiel',ch:48},{name:'Daniel',ch:12},{name:'Hosea',ch:14},{name:'Joel',ch:3},{name:'Amos',ch:9},
  {name:'Obadiah',ch:1},{name:'Jonah',ch:4},{name:'Micah',ch:7},{name:'Nahum',ch:3},{name:'Habakkuk',ch:3},
  {name:'Zephaniah',ch:3},{name:'Haggai',ch:2},{name:'Zechariah',ch:14},{name:'Malachi',ch:4},
  {name:'Matthew',ch:28},{name:'Mark',ch:16},{name:'Luke',ch:24},{name:'John',ch:21},{name:'Acts',ch:28},
  {name:'Romans',ch:16},{name:'1 Corinthians',ch:16},{name:'2 Corinthians',ch:13},{name:'Galatians',ch:6},{name:'Ephesians',ch:6},
  {name:'Philippians',ch:4},{name:'Colossians',ch:4},{name:'1 Thessalonians',ch:5},{name:'2 Thessalonians',ch:3},{name:'1 Timothy',ch:6},
  {name:'2 Timothy',ch:4},{name:'Titus',ch:3},{name:'Philemon',ch:1},{name:'Hebrews',ch:13},{name:'James',ch:5},
  {name:'1 Peter',ch:5},{name:'2 Peter',ch:3},{name:'1 John',ch:5},{name:'2 John',ch:1},{name:'3 John',ch:1},
  {name:'Jude',ch:1},{name:'Revelation',ch:22}
];

function populateBibleBooks(){
  const sel = document.getElementById('brBook'); if(!sel) return;
  if(sel.options.length > 1) return;
  BIBLE_BOOKS.forEach(b=>{ const o=document.createElement('option'); o.value=b.name; o.textContent=b.name; sel.appendChild(o); });
  const filter = document.getElementById('brFilter'); if(!filter||filter.options.length>1) return;
  BIBLE_BOOKS.forEach(b=>{ const o=document.createElement('option'); o.value=b.name; o.textContent=b.name; filter.appendChild(o); });
}

function updateBrChapters(){
  const bookName = (document.getElementById('brBook')||{}).value;
  const chSel = document.getElementById('brChapter'); if(!chSel) return;
  chSel.innerHTML = '<option value="">Ch</option>';
  const book = BIBLE_BOOKS.find(b=>b.name===bookName); if(!book) return;
  for(let i=1;i<=book.ch;i++){ const o=document.createElement('option'); o.value=i; o.textContent=i; chSel.appendChild(o); }
}

let _brHL = '';
function setBrHL(c){ _brHL = c; }

function saveBibleReading(){
  const book=(document.getElementById('brBook')||{}).value;
  const ch=(document.getElementById('brChapter')||{}).value;
  const verse=(document.getElementById('brVerse')||{}).value.trim();
  const notes=(document.getElementById('brNotes')||{}).value.trim();
  if(!book){ showToast('Select a book'); return; }
  if(!D.bibleReadings) D.bibleReadings=[];
  D.bibleReadings.push({id:Date.now(),book,chapter:ch,verse,notes,highlight:_brHL,date:new Date().toISOString().slice(0,10)});
  save();
  if(document.getElementById('brNotes')) document.getElementById('brNotes').value='';
  if(document.getElementById('brVerse')) document.getElementById('brVerse').value='';
  renderBibleReadings();
  logActivity('bible','Read '+book+(ch?' '+ch:'')+(verse?':'+verse:''));
  showToast('Reading logged ✓');
}

function renderBibleReadings(){
  const el=document.getElementById('brHistory'); if(!el) return;
  const filter=(document.getElementById('brFilter')||{}).value||'all';
  let readings=(D.bibleReadings||[]).slice().reverse();
  if(filter!=='all') readings=readings.filter(r=>r.book===filter);
  const countEl=document.getElementById('brCount'); if(countEl) countEl.textContent=(D.bibleReadings||[]).length;
  if(!readings.length){ el.innerHTML='<div style="text-align:center;padding:1rem;font-size:.75rem;color:var(--tx3);">No readings logged yet.</div>'; return; }
  el.innerHTML=readings.map(r=>`<div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:10px;padding:.6rem .8rem;margin-bottom:.35rem;${r.highlight?'border-left:4px solid '+r.highlight:''}">
    <div style="display:flex;justify-content:space-between;margin-bottom:.2rem;"><span style="font-size:.78rem;font-weight:700;color:var(--c);">📕 ${r.book}${r.chapter?' '+r.chapter:''}${r.verse?':'+r.verse:''}</span><span style="font-size:.55rem;color:var(--tx3);">${r.date}</span></div>
    ${r.notes?`<div style="font-size:.75rem;color:var(--tx2);line-height:1.6;">${r.notes}</div>`:''}
    <button onclick="D.bibleReadings=(D.bibleReadings||[]).filter(x=>x.id!==${r.id});save();renderBibleReadings();" style="font-size:.45rem;color:var(--tx3);background:none;border:none;cursor:pointer;float:right;">🗑</button>
  </div>`).join('');
}

// ── 30 DAILY DEVOTIONALS ─────────────────────────────────────
const DEVOTIONALS = [
  {title:'A New Beginning',verse:'Lamentations 3:22-23',scripture:'Because of the Lord\'s great love we are not consumed, for his compassions never fail. They are new every morning.',body:'Every morning is a reset. Yesterday\'s failures do not define today. God\'s mercy renewed itself while you slept. Today is genuinely new. Act like it.',reflect:'What do you need to let go of from yesterday?',prayer:'Lord, help me release yesterday and embrace the fresh start You have given me today. Amen.'},
  {title:'You Are Not an Accident',verse:'Psalm 139:13-14',scripture:'For you created my inmost being; you knit me together in my mother\'s womb. I am fearfully and wonderfully made.',body:'You were handcrafted by the God who designed galaxies and DNA. Your personality, your gifts, even the things you think are flaws — intentional. The world needs the original version of you.',reflect:'What do you usually criticize about yourself that you could see as intentional?',prayer:'God, thank You for making me on purpose. Help me see myself the way You see me. Amen.'},
  {title:'When You Feel Afraid',verse:'Isaiah 41:10',scripture:'Do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.',body:'Courage is not the absence of fear — it is action in the presence of fear. The promise is not that the scary thing disappears. The promise is you will not face it alone.',reflect:'What are you afraid of right now? Can you picture God standing next to you in it?',prayer:'Father, when fear comes, remind me that You are standing right next to me. Give me courage. Amen.'},
  {title:'The Power of Your Words',verse:'Proverbs 18:21',scripture:'The tongue has the power of life and death.',body:'Your words build people up or tear them down. There is no neutral. The compliment you almost said but didn\'t — someone needed it. Words are your most powerful tool.',reflect:'Who can you encourage today? What specific thing can you say?',prayer:'Lord, guard my words today. Let everything I say build someone up. Amen.'},
  {title:'Trusting When You Cannot See',verse:'Proverbs 3:5-6',scripture:'Trust in the Lord with all your heart and lean not on your own understanding.',body:'You cannot see around the corner. This verse asks you to stop believing your limited perspective is the full picture. God sees the whole road. You see one step.',reflect:'Where are you trying to control something you need to release?',prayer:'God, I surrender my need to control. I trust Your plan even when I cannot see the road ahead. Amen.'},
  {title:'Real Strength',verse:'2 Corinthians 12:9',scripture:'My grace is sufficient for you, for my power is made perfect in weakness.',body:'The world says strength is never needing help. God says strength is knowing when to ask for it. Your weakness is the exact place where God\'s power shows up most clearly.',reflect:'What weakness might actually be an invitation for God to work?',prayer:'Father, I bring You my weakness. Show Your strength through the places I feel inadequate. Amen.'},
  {title:'Loving Difficult People',verse:'Matthew 5:44',scripture:'Love your enemies and pray for those who persecute you.',body:'This is the hardest command in the Bible. It means refusing to let someone else\'s actions turn you into someone you are not. Bitterness is a prison. Forgiveness is the key.',reflect:'Is there someone you are holding resentment toward?',prayer:'Lord, soften my heart toward the person I struggle to love. Help me see them through Your eyes. Amen.'},
  {title:'Purpose Over Performance',verse:'Ephesians 2:10',scripture:'For we are God\'s handiwork, created in Christ Jesus to do good works.',body:'You are not your GPA, your follower count, or your salary. You are God\'s workmanship. Stop performing for approval. Start living from identity.',reflect:'Where have you been confusing your worth with your performance?',prayer:'God, free me from performing for approval. Root my identity in who You say I am. Amen.'},
  {title:'When Life Feels Unfair',verse:'Romans 8:28',scripture:'In all things God works for the good of those who love him.',body:'This verse does not say all things are good. It says God can work through all of it to create something redemptive. Nothing in your story is wasted.',reflect:'What difficult experience can you now see God used for growth?',prayer:'Father, I trust that You are working even in the things I cannot understand right now. Amen.'},
  {title:'The Discipline of Rest',verse:'Psalm 46:10',scripture:'Be still, and know that I am God.',body:'God literally commanded rest. Sabbath is not optional. Stillness is not doing nothing — it is creating space for God to speak in a world that never stops screaming.',reflect:'When was the last time you were genuinely still? What would it take to do that today?',prayer:'Lord, teach me to be still. Quiet the noise in my mind. Let me hear Your voice. Amen.'},
  {title:'Choosing Friends Wisely',verse:'Proverbs 13:20',scripture:'Walk with the wise and become wise, for a companion of fools suffers harm.',body:'You become the average of the five people you spend the most time with. Sometimes the bravest thing is changing who you spend time with.',reflect:'Are your closest friends pulling you toward or away from who you want to become?',prayer:'God, give me wisdom to choose friends who sharpen me and courage to be that friend to others. Amen.'},
  {title:'Dealing with Doubt',verse:'Mark 9:24',scripture:'I do believe; help me overcome my unbelief!',body:'Doubt is not the opposite of faith. Apathy is. God is not threatened by your questions. Bring your doubts to him. He can handle them.',reflect:'What question about God have you been afraid to ask?',prayer:'Father, I bring You my doubts. I believe — help me overcome my unbelief. Amen.'},
  {title:'Guarding Your Heart',verse:'Proverbs 4:23',scripture:'Above all else, guard your heart, for everything you do flows from it.',body:'What you let into your mind shapes everything that comes out. What you watch, listen to, and scroll through is not neutral. It is forming you.',reflect:'What is one thing you regularly consume that is not building you up?',prayer:'Lord, guard my heart today. Help me choose what I let in carefully. Amen.'},
  {title:'The Gift of Today',verse:'Psalm 118:24',scripture:'This is the day the Lord has made; let us rejoice and be glad in it.',body:'You are not guaranteed tomorrow. Gratitude does not ignore problems — it refuses to let them blind you to blessings.',reflect:'Name three things you are grateful for right now.',prayer:'God, open my eyes to the gifts in this day. Help me notice what is good. Amen.'},
  {title:'When You Feel Alone',verse:'Deuteronomy 31:8',scripture:'The Lord himself goes before you. He will never leave you nor forsake you.',body:'God is present in the silence, in the waiting, in the empty room. His presence does not always feel dramatic. Sometimes it is the quiet certainty you will make it through.',reflect:'When you feel most alone, what would it look like to turn to God first?',prayer:'Father, in this lonely moment, remind me that You are here. You have not left me. Amen.'},
  {title:'Forgiveness is Freedom',verse:'Colossians 3:13',scripture:'Forgive one another. Forgive as the Lord forgave you.',body:'Unforgiveness is drinking poison and expecting the other person to get sick. Forgiveness means you refuse to carry their debt anymore. Release them so you can be free.',reflect:'Who do you need to forgive — not for their sake, but for yours?',prayer:'Lord, I choose to forgive. Not because they deserve it, but because You forgave me. Set me free. Amen.'},
  {title:'Using Your Gifts',verse:'1 Peter 4:10',scripture:'Each of you should use whatever gift you have received to serve others.',body:'Your gifts are not trophies to collect — they are tools to deploy. Whatever you are good at was given to you to serve others.',reflect:'What strength could you use to help someone this week?',prayer:'God, show me where to use my gifts this week. Let me serve someone who needs it. Amen.'},
  {title:'Patience in the Process',verse:'James 1:4',scripture:'Let perseverance finish its work so that you may be mature and complete.',body:'The waiting is not wasted time. It is when character is forged. Be patient with the process and be patient with yourself.',reflect:'What are you waiting for? How might God be using the wait?',prayer:'Father, give me patience with the process. Help me trust Your timing. Amen.'},
  {title:'Fighting Temptation',verse:'1 Corinthians 10:13',scripture:'God is faithful; he will not let you be tempted beyond what you can bear.',body:'There is always a way out. The escape route might be a phone call, leaving the room, turning off the device, or simply praying in the moment.',reflect:'What is your most common temptation? What is your escape route?',prayer:'Lord, when temptation comes, show me the way out. Give me strength in the moment. Amen.'},
  {title:'Serving in Secret',verse:'Matthew 6:3-4',scripture:'When you give to the needy, do not let your left hand know what your right hand is doing.',body:'God rewards the secret act of service nobody sees. Help someone today without telling anyone. That is where real character lives.',reflect:'Can you do one act of kindness today that nobody will ever know about?',prayer:'God, let me serve in secret today. No recognition, no credit — just love in action. Amen.'},
  {title:'God\'s Plan vs Yours',verse:'Proverbs 19:21',scripture:'Many are the plans in a person\'s heart, but it is the Lord\'s purpose that prevails.',body:'Hold your plans loosely. God\'s plan is often different from yours — and it is always better, even when it does not feel that way.',reflect:'Where has your life gone differently than planned? Can you see purpose in the redirection?',prayer:'Father, I release my plans to You. Your purpose is better than my blueprint. Amen.'},
  {title:'New Identity in Christ',verse:'2 Corinthians 5:17',scripture:'If anyone is in Christ, the new creation has come: The old has gone, the new is here!',body:'You are not defined by your past. In Christ, you are a new creation — present tense, not someday. Right now. As you are.',reflect:'What old label do you need to release? Who does God say you are?',prayer:'Lord, I am a new creation. Help me live from that identity today, not from my past. Amen.'},
  {title:'When God Seems Silent',verse:'Psalm 13:1',scripture:'How long, Lord? Will you forget me forever?',body:'David felt abandoned by God. Silence does not mean absence. Keep praying even when you feel nothing. Faithfulness in the silence is the deepest faith.',reflect:'What would it look like to keep praying even without an answer?',prayer:'God, even in Your silence, I trust You are working. I will keep praying. Amen.'},
  {title:'The Armor of God',verse:'Ephesians 6:11',scripture:'Put on the full armor of God, so that you can take your stand.',body:'You are in a battle for your mind, identity, purpose, and relationships. The armor is not optional — it is survival gear. Put it on daily.',reflect:'Which piece of armor do you need most today?',prayer:'Father, dress me in Your armor today. Protect my mind, my heart, and my purpose. Amen.'},
  {title:'Humility Over Pride',verse:'Proverbs 11:2',scripture:'When pride comes, then comes disgrace, but with humility comes wisdom.',body:'Humility is not thinking less of yourself — it is thinking of yourself less. The most respected people in any room listen more than they speak.',reflect:'Where has pride crept into your life recently?',prayer:'Lord, expose my pride gently. Replace it with the humility that leads to wisdom. Amen.'},
  {title:'Treasures That Last',verse:'Matthew 6:19-20',scripture:'Do not store up treasures on earth... but store up treasures in heaven.',body:'Nothing you own follows you past this life. What follows is the impact you had on people. Build a life rich in things that last.',reflect:'Are you investing in things that last?',prayer:'God, redirect my heart toward treasures that last — people, purpose, and Your kingdom. Amen.'},
  {title:'Joy in Suffering',verse:'James 1:2-3',scripture:'Consider it pure joy whenever you face trials, because testing produces perseverance.',body:'Joy is a deep confidence that God is working regardless of circumstances. The trial is not the end — it is the chapter that builds what the next chapter requires.',reflect:'What trial might be producing perseverance you cannot yet see?',prayer:'Father, in this trial, produce in me the perseverance I need for what is coming next. Amen.'},
  {title:'Being a Light',verse:'Matthew 5:14-16',scripture:'You are the light of the world. A town built on a hill cannot be hidden.',body:'Light is most needed in darkness. Wherever there is cynicism or hopelessness, that is where your light matters most. You do not have to preach. Just live differently.',reflect:'Where in your life is there darkness that needs your light?',prayer:'Lord, make me a light today. Not loud — just bright enough that someone sees hope. Amen.'},
  {title:'The Good Shepherd',verse:'Psalm 23:1-4',scripture:'The Lord is my shepherd, I lack nothing. Even though I walk through the darkest valley, I will fear no evil.',body:'A shepherd provides, protects, and guides. That is what God does for you — not someday, but right now. Especially when you feel lost.',reflect:'Where do you need to trust the Shepherd more — provision, protection, or guidance?',prayer:'Good Shepherd, I trust You to provide, protect, and guide me today. I lack nothing. Amen.'},
  {title:'Finishing Well',verse:'2 Timothy 4:7',scripture:'I have fought the good fight, I have finished the race, I have kept the faith.',body:'How you finish matters more than how you start. Paul wrote these words from prison, facing execution — and called it finishing well. Run your race. Finish strong.',reflect:'What race are you running? What would finishing well look like for you?'},
  // ── Devotionals 31–60 ─────────────────────────────────────
  {title:'Sacred Marriage',verse:'Ephesians 5:25',scripture:'Husbands, love your wives, just as Christ loved the church and gave himself up for her.',body:'Marriage is a sacred covenant that mirrors Christ\'s love for the Church. Just as Jesus sacrificed everything for us, we are called to sacrificial love. True marital love is patient, kind, and always seeks the other\'s good above our own comfort.',reflect:'What is one specific way you can choose sacrificial love toward your spouse — or future spouse — today?',prayer:'Lord, help me to love as You love the Church. Give me patience, kindness, and a servant\'s heart. Help our marriage reflect Your glory. Amen.'},
  {title:'A Healthy Temple',verse:'3 John 1:2',scripture:'Beloved, I pray that you may prosper in all things and be in health, just as your soul prospers.',body:'God cares about every aspect of our well-being — body, mind, and spirit. Taking care of your health isn\'t vanity — it is stewardship of a gift. Rest, nutrition, exercise, and seeking care when needed all honor the Creator who designed you.',reflect:'What is one small step you can take today to better steward your body?',prayer:'Father, thank You for my body. Help me be a good steward of this gift. Grant me wisdom in caring for my health and strength to honor You. Amen.'},
  {title:'Training Up Children',verse:'Proverbs 22:6',scripture:'Train up a child in the way he should go, and when he is old he will not depart from it.',body:'Parenting is one of God\'s greatest assignments. The foundation we build in a child\'s early years — teaching God\'s Word, modeling faith, showing unconditional love — creates a path they can return to throughout their lives. Even when they stray, the seeds planted in childhood remain.',reflect:'What truth are you planting in a child\'s life this week, by your words or your example?',prayer:'Lord, give me wisdom to raise children in Your ways. Help me to be patient, loving, and consistent. May my life point them to You. Amen.'},
  {title:'Near the Brokenhearted',verse:'Psalm 34:18',scripture:'The LORD is close to the brokenhearted and saves those who are crushed in spirit.',body:'Depression is not a sign of weak faith — it is a real struggle that even biblical heroes faced. David, Elijah, and Jeremiah all experienced dark seasons. God does not condemn you for feeling low; He draws near in your pain. It is okay to seek help — through prayer, community, counseling, or care.',reflect:'Is there a weight you have been carrying alone that you need to bring to God — or to a trusted person — today?',prayer:'God, I feel heavy and broken. Please be near to me. Lift this weight from my heart. Remind me that You are with me even in this valley. Amen.'},
  {title:'The Peace That Passes Understanding',verse:'Philippians 4:6-7',scripture:'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.',body:'Anxiety whispers lies about the future, but God invites us to bring every worry to Him. When we surrender our fears through prayer, He promises a peace that guards our hearts — not the removal of circumstances, but a supernatural calm in the midst of the storm.',reflect:'What worry have you been carrying that you need to release in prayer right now?',prayer:'Father, I give You my worries. I cannot carry them anymore. Replace my anxiety with Your peace. Help me trust You with tomorrow. Amen.'},
  {title:'Before the Fall',verse:'Proverbs 16:18',scripture:'Pride goes before destruction, a haughty spirit before a fall.',body:'Pride says, "I don\'t need God." It convinces us we are self-sufficient and deserve credit for what He gave us. Humility, on the other hand, acknowledges that every good thing comes from God and that we are all equally in need of His grace.',reflect:'Where has pride crept into your life this week? What would it look like to walk in humility instead?',prayer:'Lord, expose any pride in my heart. Help me walk in humility, knowing that apart from You I can do nothing. Keep me dependent on Your grace. Amen.'},
  {title:'The Freedom of Forgiveness',verse:'Colossians 3:13',scripture:'Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you.',body:'Forgiveness does not mean what happened was okay. It means releasing the person who hurt you from the debt they owe — just as Christ released you from yours. Unforgiveness is a prison we build for ourselves. When we forgive, we experience freedom.',reflect:'Who do you need to forgive — not for their sake, but for your own freedom?',prayer:'Jesus, You forgave me when I did not deserve it. Help me extend that same forgiveness to others. Free me from bitterness and give me a heart like Yours. Amen.'},
  {title:'Plans to Give You a Future',verse:'Jeremiah 29:11',scripture:'"For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future."',body:'You are not an accident. God created you with intentionality and has a specific purpose for your life. Even when you cannot see the path ahead, trust that God is directing your steps. Your purpose is not just about what you do — it is about who you become in Christ.',reflect:'Where do you feel most purposeless right now? Can you bring that specific area to God today?',prayer:'Father, reveal Your purpose for my life. Help me to trust Your plan even when I do not understand it. Use me for Your glory. Amen.'},
  {title:'The Slow Cooker',verse:'James 1:4',scripture:'Let perseverance finish its work so that you may be mature and complete, not lacking anything.',body:'We live in a microwave culture, but God often works in a slow cooker. Patience is not passive waiting — it is active trust in God\'s timing. The seasons of waiting are where character is forged and faith is deepened. What God is doing in you during the wait is just as important as what you are waiting for.',reflect:'What are you waiting for right now? How might God be forming you in the process?',prayer:'Lord, teach me to wait on Your timing. Help me trust that You are working even when I cannot see it. Develop patience and endurance in me. Amen.'},
  {title:'Eyes Open to Blessing',verse:'1 Thessalonians 5:18',scripture:'Give thanks in all circumstances; for this is God\'s will for you in Christ Jesus.',body:'Gratitude transforms our perspective. It shifts our focus from what we lack to what we have been given. Even in difficult seasons, there are gifts to find. When we cultivate thankfulness, we train our hearts to see God\'s goodness everywhere. Gratitude is not denying pain — it is choosing to acknowledge blessing alongside it.',reflect:'Name three specific things you are grateful for right now — things you might usually overlook.',prayer:'Thank You, Lord, for Your countless blessings. Open my eyes to see Your goodness even in hard times. Fill my heart with gratitude. Amen.'},
  {title:'Do Not Be Dismayed',verse:'Isaiah 41:10',scripture:'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.',body:'Fear is a natural human emotion, but it does not have to control us. God says "do not fear" throughout Scripture — not because there is nothing scary, but because He is with us. Whatever you are facing today, you do not face it alone. His presence is your comfort, His strength is your support.',reflect:'What specific fear is gripping you right now? Can you picture God standing with you in the middle of it?',prayer:'God, fear tries to grip my heart. Remind me that You are bigger than my fears. Give me courage to trust You completely. Amen.'},
  {title:'Ask for Wisdom',verse:'James 1:5',scripture:'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.',body:'Wisdom is more than knowledge — it is the ability to apply God\'s truth to real-life situations. When you face decisions or confusion, God promises to give wisdom generously. He does not scold you for asking. Seek His guidance through prayer, His Word, and godly counsel.',reflect:'What decision are you facing right now that you have not yet asked God for wisdom on?',prayer:'Father, I need Your wisdom. Guide my decisions and help me see clearly. Give me discernment to know Your will. Amen.'},
  {title:'Never Forsaken',verse:'Deuteronomy 31:6',scripture:'The LORD your God goes with you; he will never leave you nor forsake you.',body:'Loneliness can feel overwhelming, but you are never truly alone. Even when friends are absent, relationships fail, or you feel isolated, God is present. He knows your every thought, sees your every tear, and walks with you through every moment. He is the friend who never leaves.',reflect:'In what area of your life do you feel most alone right now? What would it mean to turn to God first in that space?',prayer:'Lord, I feel alone. Remind me of Your constant presence. Surround me with Your love and bring godly community into my life. Amen.'},
  {title:'Wings Like Eagles',verse:'Isaiah 40:31',scripture:'But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary.',body:'When you are exhausted — physically, emotionally, or spiritually — God offers supernatural strength. Not the strength to do everything on your own, but strength that comes from depending on Him. As you wait on the Lord, He renews you from the inside out.',reflect:'Where are you most exhausted right now? What would it look like to depend on God\'s strength instead of your own?',prayer:'Lord, I am weary and weak. Renew my strength. Help me rest in You and trust that Your power is made perfect in my weakness. Amen.'},
  {title:'Confidence in What We Hope For',verse:'Hebrews 11:1',scripture:'Now faith is confidence in what we hope for and assurance about what we do not see.',body:'Faith is not about having all the answers — it is about trusting the One who does. It is believing God is good even when circumstances are hard. Faith grows not in comfort, but in the trenches of life where we must choose trust over fear, hope over despair.',reflect:'Where in your life are you being asked to trust God without being able to see the outcome?',prayer:'God, increase my faith. Help me to trust You even when I cannot see the way forward. Strengthen my belief in Your goodness and power. Amen.'},
  {title:'A Way Out',verse:'1 Corinthians 10:13',scripture:'God is faithful; he will not let you be tempted beyond what you can bear. But when you are tempted, he will also provide a way out.',body:'Temptation is not sin — Jesus Himself was tempted. The struggle is universal and you are not alone in it. God promises He will not allow more than you can handle and He always provides an escape route. When temptation comes, cry out to God, flee the situation, and cling to His Word.',reflect:'What is your most persistent temptation? Have you identified your escape route?',prayer:'Father, temptation is strong. Give me the strength to resist and the wisdom to see the way out You provide. Keep me pure and holy. Amen.'},
  {title:'A Different Kind of Peace',verse:'John 14:27',scripture:'Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled.',body:'The world offers temporary peace based on circumstances — everything must be perfect for calm to exist. But Jesus offers peace that exists in the midst of chaos, that surpasses understanding, that guards our hearts even when life is falling apart. This peace comes from knowing God is in control.',reflect:'What would it look like today to receive the peace Jesus offers, rather than waiting for circumstances to change?',prayer:'Jesus, I receive Your peace. Calm my troubled heart and quiet my anxious mind. Let Your peace guard me today and always. Amen.'},
  {title:'Overflow With Hope',verse:'Romans 15:13',scripture:'May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.',body:'Hope is not wishful thinking — it is confident expectation in God\'s promises. Even when circumstances look bleak, hope reminds us that God is writing a story bigger than what we can see. This hope is a supernatural gift from the Holy Spirit that fills us with joy and peace.',reflect:'Where have you lost hope? Can you bring that specific area to God and ask Him to fill it with His hope?',prayer:'God of hope, fill me with Your joy and peace. When I am tempted to despair, remind me of Your promises. Let hope overflow in my life. Amen.'},
  {title:'He Will Supply',verse:'Philippians 4:19',scripture:'And my God will meet all your needs according to the riches of his glory in Christ Jesus.',body:'Financial stress is real, but God sees your needs and He is faithful to provide. He may not give you everything you want, but He promises to supply what you truly need. Trust Him with your finances, be a good steward of what He has given, and watch Him provide in unexpected ways.',reflect:'What financial worry are you carrying that you need to surrender to God today?',prayer:'Father, I trust You to provide for my needs. Help me be wise with money and generous with others. You are my provider. Amen.'},
  {title:'Working for the Lord',verse:'Colossians 3:23',scripture:'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.',body:'Your job is not just a paycheck — it is a ministry. Whether you are a CEO or a cashier, a student or a tradesperson, you represent Christ in your workplace. Excellence in your work is an act of worship. When you work with integrity and diligence, you shine God\'s light in dark places.',reflect:'How would your work change today if you truly saw Jesus as your audience?',prayer:'Lord, help me work with excellence and integrity. Let my attitude and effort honor You. Use me to be a light in my workplace. Amen.'},
  {title:'Blessed Are Those Who Mourn',verse:'Matthew 5:4',scripture:'Blessed are those who mourn, for they will be comforted.',body:'Grief is love with nowhere to go. When we lose someone or something precious, the pain is real and deep. Jesus does not tell us to suppress grief or get over it quickly. He blesses those who mourn and promises comfort. Allow yourself to grieve, but know that God is near and will heal your wounds in His time.',reflect:'Is there a loss — a person, a dream, a season — that you have not yet allowed yourself to grieve fully?',prayer:'God, my heart is breaking. Comfort me in this pain. Hold me close and heal my broken heart. Give me hope beyond this grief. Amen.'},
  {title:'We Love Because',verse:'1 John 4:19',scripture:'We love because he first loved us.',body:'True love is not something we manufacture — it flows from the love we have received from God. He loved you before you loved Him, before you were born, before you did anything to deserve it. This unconditional love transforms us and enables us to love others — even the unlovable, even our enemies.',reflect:'Is there someone in your life you have been struggling to love? How might God\'s love for you change how you see them?',prayer:'Father, thank You for loving me first. Fill me with Your love so I can love others well. Help me love sacrificially and unconditionally. Amen.'},
  {title:'If You Love Me',verse:'John 14:15',scripture:'If you love me, keep my commands.',body:'Obedience to God is not about earning His love — it is the natural response to receiving it. When we truly grasp how much God loves us, we want to honor Him with our lives. His commands are not burdensome restrictions — they are loving boundaries designed for our flourishing.',reflect:'Is there an area of your life where you know what God is asking but have been resistant? What is holding you back?',prayer:'Jesus, I want to obey You out of love, not obligation. Give me the desire and strength to follow Your commands faithfully. Amen.'},
  {title:'Lean Not on Your Own Understanding',verse:'Proverbs 3:5-6',scripture:'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',body:'Trust is releasing control and believing that God knows better than we do. Our human understanding is limited, but God sees the whole picture. When life does not make sense — when plans fall apart and the path is unclear — that is when trust matters most.',reflect:'Where are you leaning on your own understanding right now instead of submitting to God?',prayer:'Lord, I surrender my need to understand everything. I trust that You are good and that You are guiding my steps. Lead me. Amen.'},
  {title:'The Joy of the Lord',verse:'Nehemiah 8:10',scripture:'Do not grieve, for the joy of the LORD is your strength.',body:'Joy is different from happiness. Happiness depends on circumstances, but joy is rooted in the unchanging character of God. Even in trials, we can experience joy because we know God is faithful, His promises are true, and our ultimate destiny is secure. The joy of the Lord is not a forced smile — it is a deep well of strength.',reflect:'Where are you relying on circumstances to produce happiness rather than drawing from God\'s joy as your source of strength?',prayer:'Father, fill me with Your joy. When life is hard, remind me that my strength comes from You. Let joy be my anchor. Amen.'},
  {title:'The New Creation',verse:'2 Corinthians 5:17',scripture:'Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!',body:'Addiction feels like chains that bind, but Jesus came to set captives free. Recovery is not about willpower alone — it is about surrendering to God\'s transforming power. He does not just help you manage your struggle; He makes you a new creation. The old patterns, the shame, the bondage — they do not define you anymore.',reflect:'What old identity, habit, or label do you need to release today in light of who Christ says you are?',prayer:'Father, I cannot break these chains on my own. I surrender to You. Make me new. Give me strength for today and hope for tomorrow. Amen.'},
  {title:'Whoever Believes',verse:'John 3:16',scripture:'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',body:'This is the most important truth in all of Scripture: God loves you so much that He sent Jesus to die for your sins. Eternal life is not just about living forever — it is about knowing God personally, being reconciled to Him, and experiencing His love for all eternity.',reflect:'Have you ever personally accepted the gift described in this verse? If so, how has it changed you? If not, what is holding you back?',prayer:'Father, thank You for sending Jesus to save me. I believe He died for my sins and rose again. Forgive me and fill me with Your life. I surrender to You. Amen.'},
  {title:'Shining in the Dark',verse:'Matthew 5:16',scripture:'Let your light shine before others, that they may see your good deeds and glorify your Father in heaven.',body:'You were not saved to stay hidden. The light of Christ in you is meant to illuminate the rooms you walk into — your workplace, your home, your neighborhood. You do not have to preach. Simply live in a way that makes people curious about your God.',reflect:'Who in your life is watching you right now? What are they seeing? What does your light look like to them?',prayer:'Lord, let my life shine today. Not for my glory, but so that others see You through me. Make me a beacon of hope in someone\'s darkness. Amen.'},
  {title:'Rooted and Built Up',verse:'Colossians 2:6-7',scripture:'Just as you received Christ Jesus as Lord, continue to live your lives in him, rooted and built up in him, strengthened in the faith.',body:'A tree with shallow roots falls in the first storm. Spiritual depth is not built in a crisis — it is built in the ordinary days of consistent prayer, Scripture, and community. The storms will come. The question is how deep your roots go before they do.',reflect:'What daily practices are building your roots deeper right now? What is missing?',prayer:'God, help me build roots in You through the ordinary days. Make me a tree planted by living water that does not wither. Amen.'},
  {title:'The Spirit Within You',verse:'Romans 8:11',scripture:'The Spirit of him who raised Jesus from the dead is living in you.',body:'The same power that raised Jesus from the dead is not a distant force — it lives inside you. You are not facing your battles, your temptations, or your calling in your own strength. You carry resurrection power. Act like it.',reflect:'What in your life are you trying to accomplish in your own strength that you need to invite the Holy Spirit into?',prayer:'Holy Spirit, I invite You to work through me today. Remind me that Your power lives in me. Help me live from that reality. Amen.'},
  {title:'You Are Not an Accident',verse:'Psalm 139:13',scripture:'For you created my inmost being; you knit me together in my mother\'s womb.',body:'Before anyone knew your name, God did. Your personality, your quirks, your gifts — none of it was random. You were designed with intention by the most creative Being in the universe.',reflect:'Write down one thing about yourself you\'ve always seen as a flaw. Ask God today to show you how He sees it.',prayer:'Lord, help me see myself the way You see me — not as a mistake, but as a masterpiece in progress. Amen.'},
  {title:'Small Steps, Big Faith',verse:'Psalm 37:23',scripture:'The LORD makes firm the steps of the one who delights in him.',body:'You don\'t need to have the whole path figured out. God doesn\'t ask you to see the finish line — just to take the next right step. Every great journey in Scripture started with one obedient move.',reflect:'What is one small step of obedience or growth you\'ve been putting off? Take it today.',prayer:'God, I trust You with my next step. Even when I can\'t see the path ahead, help me walk in faith. Amen.'},
  {title:'The Comparison Trap',verse:'Galatians 6:4',scripture:'Each one should test their own actions. Then they can take pride in themselves alone, without comparing themselves to someone else.',body:'Comparison is the thief of joy — and it\'s been around since Cain and Abel. Social media makes it worse, but the trap is ancient. God gave you a lane. Run yours.',reflect:'Who have you been comparing yourself to lately? What would change if you focused only on your own growth?',prayer:'Lord, free me from the trap of comparison. Help me celebrate who You made me to be without measuring myself against others. Amen.'},
  {title:'Rest Is Not Weakness',verse:'Genesis 2:2',scripture:'By the seventh day God had finished the work he had been doing; so on the seventh day he rested.',body:'If God Himself rested, then rest is not laziness — it\'s wisdom. Our culture glorifies being busy, but burnout is not a badge of honor. Sabbath is a commandment, not a suggestion.',reflect:'When did you last truly rest — no phone, no hustle, just stillness? Schedule that this week.',prayer:'Father, teach me to rest without guilt. Help me trust that You are at work even when I stop. Amen.'},
  {title:'Taming Your Tongue',verse:'Proverbs 18:21',scripture:'The tongue has the power of life and death, and those who love it will eat its fruit.',body:'Your words carry weight you may not fully realize. The things you say about yourself and others shape reality. Words have launched wars and healed wounds. What kind of fruit is your tongue producing?',reflect:'Think of one person you could encourage with your words today. Do it — send the text, make the call.',prayer:'God, let the words of my mouth be life-giving. Guard my tongue from criticism, gossip, and negativity. Amen.'},
  {title:'When God Seems Silent',verse:'Psalm 46:10',scripture:'Be still, and know that I am God.',body:'Sometimes God\'s silence is not absence — it\'s invitation. He isn\'t ignoring you; He\'s inviting you to be still long enough to hear Him. Silence in prayer isn\'t failure; it\'s presence.',reflect:'Spend 5 minutes today in silence — no music, no phone. Just sit with God. Notice what comes up.',prayer:'Lord, help me be still in a world that never stops. Remind me that Your silence is often where growth happens. Amen.'},
  {title:'Integrity in the Small Things',verse:'Luke 16:10',scripture:'Whoever can be trusted with very little can also be trusted with much.',body:'Character is built in the unseen moments — when no one is watching, when it costs you something, when the easy path is also the dishonest one. Who you are in private eventually shows up in public.',reflect:'Is there an area of your life where you\'re cutting corners or being less than honest? Name it. Fix it.',prayer:'God, build in me a character that doesn\'t change based on who\'s watching. Let integrity be my default. Amen.'},
  {title:'Forgiving Yourself',verse:'Psalm 103:12',scripture:'As far as the east is from the west, so far has he removed our transgressions from us.',body:'God has a remarkable ability to forget what He has forgiven. The problem is we often rehearse what He has released. Holding on to past mistakes isn\'t humility — it\'s unbelief in the completeness of grace.',reflect:'What mistake are you still punishing yourself for that God has already forgiven? Declare it released today.',prayer:'Father, I receive Your forgiveness — not just in my head but in my heart. Help me let go of what You\'ve already erased. Amen.'},
  {title:'The Gift of Hard Times',verse:'Romans 5:3',scripture:'Not only so, but we also glory in our sufferings, because we know that suffering produces perseverance.',body:'Nobody asks for hard seasons. But looking back, most people will tell you that their greatest growth happened in their deepest pain. God wastes nothing — not even your worst year.',reflect:'What is a hard season from your past that shaped you for the better? Thank God for it today.',prayer:'Lord, I trust that You are at work even in the seasons that hurt. Use every hard thing to build something beautiful. Amen.'},
  {title:'Gratitude Changes Everything',verse:'1 Thessalonians 5:18',scripture:'Give thanks in all circumstances; for this is God\'s will for you in Christ Jesus.',body:'Gratitude isn\'t pretending hard things aren\'t hard. It\'s choosing to look for what God is still doing even when things aren\'t going the way you planned. It rewires your brain and your heart.',reflect:'Write down 10 specific things you\'re grateful for right now — not general things, but specific ones.',prayer:'God, thank You. Not because everything is perfect, but because You are present in everything. Amen.'},
  {title:'Standing Under Pressure',verse:'1 Corinthians 16:13',scripture:'Be on your guard; stand firm in the faith; be courageous; be strong.',body:'Peer pressure doesn\'t end in high school — it just changes shape. The pressure to compromise your values, lower your standards, or blend in will follow you your whole life. The question is whether your roots are deep enough to withstand the wind.',reflect:'Is there an area of your life where you\'re drifting from your values to fit in? What would standing firm look like?',prayer:'Lord, give me the courage to stand for what I believe in, even when it costs me something. Amen.'},
  {title:'Serving Without Recognition',verse:'Colossians 3:23',scripture:'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.',body:'The greatest acts of service often happen when no one sees them. Washing dishes, helping a stranger, staying late, encouraging someone who can do nothing for you — this is what greatness actually looks like.',reflect:'Do one act of service today that no one will know about. Do it for God, not for credit.',prayer:'God, help me serve with a heart that doesn\'t need applause. Let my work be an act of worship. Amen.'},
  {title:'Your Anger Has a Limit',verse:'Ephesians 4:26',scripture:'In your anger do not sin: Do not let the sun go down while you are still angry.',body:'Anger itself isn\'t a sin — Jesus got angry. But unprocessed anger left overnight becomes bitterness. The instruction is clear: feel it, process it, resolve it before the day ends.',reflect:'Is there someone you\'re currently angry with? What would it look like to take one step toward resolution today?',prayer:'Lord, help me process anger quickly and honestly. Don\'t let bitterness take root where resolution belongs. Amen.'},
  {title:'Who Are Your People?',verse:'Proverbs 13:20',scripture:'Walk with the wise and become wise, for a companion of fools suffers harm.',body:'You become like the people you spend the most time with. Your friend group is one of the most important decisions you\'ll ever make. Wisdom chooses community intentionally.',reflect:'Look at your closest five friends. Are they pulling you toward your best self or away from it?',prayer:'Father, send me the right people and give me wisdom to build relationships that make me better. Amen.'},
  {title:'When Doubt Creeps In',verse:'Mark 9:24',scripture:'I do believe; help me overcome my unbelief!',body:'This father is one of the most honest people in the Bible. He didn\'t fake confidence he didn\'t have — he brought his doubt to Jesus and asked for help with it. Doubt brought to God is not weakness; it\'s honesty.',reflect:'What do you doubt right now? Bring it to God honestly, like this father did. You don\'t have to pretend.',prayer:'God, I believe. Help me in the areas where I struggle to believe. I trust You with my questions. Amen.'},
  {title:'The Power of Consistency',verse:'Galatians 6:9',scripture:'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.',body:'Consistency is more powerful than intensity. The person who reads their Bible 5 minutes every day outpaces the one who reads for 2 hours once a month. Small, repeated acts of faithfulness compound into transformation.',reflect:'What one spiritual habit could you do consistently this week, even in a small way?',prayer:'Lord, help me be faithful in the small, daily things. Build my character through consistency, not just big moments. Amen.'},
  {title:'Created to Create',verse:'Genesis 1:1',scripture:'In the beginning, God created...',body:'The very first thing we learn about God is that He creates. And since we\'re made in His image, creativity is part of your spiritual DNA. Making things — art, meals, code, music, ideas — is an act of worship.',reflect:'What creative gift do you have that you haven\'t been using? Pick it back up this week.',prayer:'Creator God, ignite the creativity You placed in me. Help me use it for Your glory and others\' good. Amen.'},
  {title:'The Danger of Pride',verse:'Proverbs 16:18',scripture:'Pride goes before destruction, a haughty spirit before a fall.',body:'Pride is subtle. It rarely announces itself. It shows up as defensiveness, an inability to receive feedback, or always needing to be right. The antidote isn\'t self-deprecation — it\'s humility, which is simply seeing yourself accurately.',reflect:'In what area of your life are you most defensive? That\'s often where pride is hiding.',prayer:'God, give me genuine humility. Reveal where pride is operating in me before it causes damage. Amen.'},
  {title:'Fear Is Not Final',verse:'2 Timothy 1:7',scripture:'For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.',body:'Fear is a feeling, not a verdict. God hasn\'t given you a spirit that shrinks back from every hard thing. The same Spirit that raised Jesus from the dead lives in you. You don\'t have to be fearless — just faithful.',reflect:'What is one fear that\'s been keeping you from moving forward? Name it. Pray over it. Take one step through it.',prayer:'Lord, replace the fear I feel with faith in who You are. Help me move forward even when I\'m afraid. Amen.'},
  {title:'Honoring Your Parents',verse:'Exodus 20:12',scripture:'Honor your father and your mother, so that you may live long in the land the LORD your God is giving you.',body:'This commandment comes with a promise. Honoring your parents doesn\'t mean agreeing with everything they do — it means treating them with respect and dignity. Even imperfect parents are worth honoring.',reflect:'How have you been treating your parents lately? Is there something you owe them — an apology, more respect, a thank you?',prayer:'God, help me honor my parents even when it\'s hard. Give me a heart that is grateful, not resentful. Amen.'},
  {title:'You Can\'t Pour From Empty',verse:'Matthew 11:28',scripture:'Come to me, all you who are weary and burdened, and I will give you rest.',body:'You can\'t give what you don\'t have. If you\'re running on empty spiritually, emotionally, or physically, you\'ll eventually have nothing left to offer the people around you. Filling up is not selfish — it\'s necessary.',reflect:'What does your soul actually need right now? Rest? Connection? Prayer? Give yourself permission to pursue it.',prayer:'Jesus, I come to You weary. Fill me back up. Help me receive before I try to give. Amen.'},
  {title:'The Gift of an Apology',verse:'Matthew 5:23-24',scripture:'If you are offering your gift at the altar and remember that your brother or sister has something against you, go and be reconciled.',body:'Jesus was serious about reconciliation — serious enough to say it matters more than religious ritual. A genuine apology is one of the most powerful gifts you can give someone. It costs pride and buys peace.',reflect:'Is there someone you owe an apology to? Don\'t wait for the perfect moment. Go first.',prayer:'Lord, give me the humility to apologize well — not to make myself feel better, but to restore what was broken. Amen.'},
  {title:'Money Isn\'t Evil — Love of It Is',verse:'1 Timothy 6:10',scripture:'For the love of money is a root of all kinds of evil.',body:'The Bible never says money is bad. It says the love of money is the problem. When money becomes the goal instead of a tool, it begins to own you. Financial wisdom starts with holding money loosely.',reflect:'Is your relationship with money healthy? Do you spend, save, and give in a way that reflects your values?',prayer:'God, help me see money as a resource for good, not a substitute for security. Teach me generosity. Amen.'},
  {title:'The Habit of Prayer',verse:'1 Thessalonians 5:17',scripture:'Pray continually.',body:'Three words, enormous meaning. Prayer isn\'t just a scheduled event — it\'s a posture of the heart. Talking to God while you drive, while you work, while you wait. A life of prayer isn\'t about length; it\'s about constancy.',reflect:'What would it look like to make your day a running conversation with God instead of a scheduled appointment?',prayer:'Lord, make prayer as natural as breathing for me. Let my heart always be tuned to Yours. Amen.'},
  {title:'Trusting God with Your Future',verse:'Jeremiah 29:11',scripture:'For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.',body:'These words were written to people in exile — people who had lost everything and couldn\'t see a way forward. God\'s promise of a future isn\'t only for good times. It\'s especially for when you can\'t see the path.',reflect:'What part of your future are you most anxious about? Specifically hand that over to God in prayer today.',prayer:'Father, I trust that You hold my future even when I can\'t see it. Give me peace in the uncertainty. Amen.'},
  {title:'You Were Meant for Community',verse:'Ecclesiastes 4:9',scripture:'Two are better than one, because they have a good return for their labor.',body:'Lone wolf faith rarely survives the long haul. We were designed for community — for people who push us, pray for us, challenge us, and hold us up when we fall. Isolation is not strength; it\'s vulnerability.',reflect:'Who in your life functions as genuine community for you? If no one comes to mind, what\'s one step you could take toward building that?',prayer:'God, connect me to the right people. Help me be the kind of friend I also need. Amen.'},
  {title:'The Weight of Unforgiveness',verse:'Colossians 3:13',scripture:'Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you.',body:'Unforgiveness is like drinking poison and waiting for the other person to get sick. It only hurts you. Forgiveness doesn\'t excuse what happened — it releases you from carrying it. It\'s an act of self-liberation as much as anything else.',reflect:'Is there someone you haven\'t forgiven? Not to excuse them, but for your own freedom — begin the process today.',prayer:'Lord, I choose to forgive. Help my feelings follow my decision. Free me from the weight of bitterness. Amen.'},
  {title:'Hunger for Righteousness',verse:'Matthew 5:6',scripture:'Blessed are those who hunger and thirst for righteousness, for they will be filled.',body:'Jesus said people who crave righteousness like they crave food and water will be satisfied. The question is: what are you actually hungry for? What drives you? What are you pursuing with that kind of appetite?',reflect:'What are you most hungry for in your life right now? Does that hunger align with what God says will truly satisfy?',prayer:'God, give me a deep hunger for what is right and true. Fill me with what only You can provide. Amen.'},
  {title:'When You Don\'t Feel Like Worshipping',verse:'Habakkuk 3:18',scripture:'Yet I will rejoice in the LORD, I will be joyful in God my Savior.',body:'Habakkuk wrote this after describing utter devastation — no crops, no livestock, no food. The word "yet" carries everything. Worship is most powerful when it\'s hardest. It\'s a declaration of truth over feeling.',reflect:'Can you worship God today even if you don\'t feel like it? Write out one reason to praise Him right now.',prayer:'Lord, I choose to praise You even when my circumstances don\'t feel praise-worthy. You are still good. Amen.'},
  {title:'Three Months In — Keep Going',verse:'2 Chronicles 15:7',scripture:'But as for you, be strong and do not give up, for your work will be rewarded.',body:'You\'ve been on this journey for 90 days. That\'s not nothing — that\'s faithfulness. Most people quit long before now. Habits are being formed in you that will outlast any season. The reward belongs to those who don\'t quit.',reflect:'Look back at where you started and where you are now. What has changed in your thinking, your habits, or your heart?',prayer:'God, thank You for carrying me this far. I\'m not done growing. Keep going in me what You\'ve started. Amen.'},
  {title:'Guarding Your Eyes',verse:'Psalm 101:3',scripture:'I will not look with approval on anything that is vile.',body:'What you consistently look at shapes you over time. The media you consume, the accounts you follow, the content you scroll through — it all leaves a residue. Guarding your eyes isn\'t about fear; it\'s about protecting what\'s being built in you.',reflect:'Do an honest audit of your screen time this week. Is there content you\'re consuming that\'s working against who you want to become?',prayer:'Lord, help me guard my eyes. Let what I choose to look at reflect what I actually value. Amen.'},
  {title:'Contentment Is a Skill',verse:'Philippians 4:11',scripture:'I have learned, in whatsoever state I am, therewith to be content.',body:'Paul didn\'t say contentment came naturally — he said he learned it. That means it\'s a practice, a skill built over time through choosing gratitude in every season. Contentment isn\'t settling; it\'s trusting.',reflect:'In what area of your life are you most discontent right now? What would it look like to find peace there while still pursuing growth?',prayer:'God, teach me contentment. Not complacency — but the deep peace that says You are enough. Amen.'},
  {title:'You Are a Light',verse:'Matthew 5:14',scripture:'You are the light of the world. A town built on a hill cannot be hidden.',body:'Jesus didn\'t say you should try to be a light — He said you are one. The question is whether you\'re hiding it. Light doesn\'t argue with darkness; it just shows up. Your presence, your character, your kindness — they illuminate.',reflect:'In what relationship or environment could you be a more intentional light this week?',prayer:'Lord, help me shine — not for attention, but because that\'s what You put in me. Let my life point to You. Amen.'},
  {title:'When Life Doesn\'t Go as Planned',verse:'Proverbs 16:9',scripture:'In their hearts humans plan their course, but the LORD establishes their steps.',body:'You\'ll make plans. Some of them will work. Many of them won\'t. And sometimes what looks like a detour turns out to be the actual destination. God\'s redirects are not failures — they\'re navigation.',reflect:'Think of a time your plans fell apart and something better or different emerged. How do you see God\'s hand in that now?',prayer:'Lord, I hold my plans loosely. Lead me where You want me to go, even if it\'s not where I planned. Amen.'},
  {title:'Your Body Is a Temple',verse:'1 Corinthians 6:19',scripture:'Do you not know that your bodies are temples of the Holy Spirit, who is in you, whom you have received from God?',body:'Your physical health is a spiritual issue. How you sleep, eat, move, and treat your body matters to God. This isn\'t about vanity — it\'s about stewardship. You\'ve been given one body for this life. Take care of it.',reflect:'What is one area of physical health you\'ve been neglecting? Sleep, nutrition, movement? Take one step toward it today.',prayer:'God, help me honor You with my body — not just my words. Teach me to steward my health as an act of worship. Amen.'},
  {title:'Listening Before Speaking',verse:'James 1:19',scripture:'Everyone should be quick to listen, slow to speak and slow to become angry.',body:'Most conflict happens because people are waiting to respond rather than actually listening. Truly hearing someone — without formulating your comeback — is one of the most powerful gifts you can give them.',reflect:'Think of your last difficult conversation. Were you listening or waiting to talk? What would listening more deeply change?',prayer:'Lord, make me a better listener. Help me value understanding people over winning arguments. Amen.'},
  {title:'Radical Generosity',verse:'Luke 6:38',scripture:'Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap.',body:'Generosity is one of the most countercultural acts a person can do in a world that says hoard, accumulate, protect. Jesus promises a return on generosity — not just financial, but in every dimension of life.',reflect:'How generous are you, really — with money, time, energy, encouragement? Where could you give more this week?',prayer:'God, make me genuinely generous. Loosen my grip on what I have and help me give with joy. Amen.'},
  {title:'The Foundation That Holds',verse:'Matthew 7:24',scripture:'Everyone who hears these words of mine and puts them into practice is like a wise man who built his house on the rock.',body:'The storms in this parable hit both houses — the one on rock and the one on sand. The difference isn\'t whether life gets hard; it\'s whether your foundation holds when it does. Building on God\'s word isn\'t passive; it\'s active practice.',reflect:'What is your life actually built on? When storms hit, what holds you? Be honest with yourself today.',prayer:'Lord, let my life be built on You and Your word — not on comfort, achievement, or opinion. You are my foundation. Amen.'},
  {title:'Finishing Strong',verse:'2 Timothy 4:7',scripture:'I have fought the good fight, I have finished the race, I have kept the faith.',body:'Paul wrote these words at the end of his life, knowing he was about to die. He didn\'t say he won every battle or avoided every failure — he said he finished. That\'s the goal: not perfection, but perseverance.',reflect:'What does "finishing strong" look like in your life right now? In your faith, your relationships, your commitments?',prayer:'God, help me be someone who finishes. Not just starts well but runs all the way through. Give me endurance. Amen.'},
  {title:'One Hundred Days of Grace',verse:'Philippians 1:6',scripture:'Being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus.',body:'One hundred days. God has been at work in you every single one of them — in the days you felt it and the days you didn\'t. He started something in you and He has committed to finishing it. You are not a project He will abandon.',reflect:'How are you different than you were 100 days ago? What has God been building in you? Write it down — it deserves to be remembered.',prayer:'Father, thank You for 100 days of grace. For every moment You were working even when I couldn\'t see it. I trust You to keep going. Amen.'}
];

function renderJesusGrid(){
  const el = document.getElementById('jesusGrid'); if(!el) return;
  el.innerHTML = JESUS_LESSONS.map((l,i)=>`
    <div onclick="openBFLesson('jesus',${i})" style="background:rgba(255,255,255,.03);border:1px solid ${l.color}20;border-left:4px solid ${l.color};border-radius:12px;padding:.8rem 1rem;cursor:pointer;transition:all .15s;" onmouseenter="this.style.transform='translateY(-2px)'" onmouseleave="this.style.transform=''">
      <div style="display:flex;align-items:center;gap:.5rem;">
        <span style="font-size:1.3rem;">${l.icon}</span>
        <div style="font-size:.88rem;font-weight:800;">${l.title}</div>
      </div>
    </div>
  `).join('');
}

function renderLearnBibleGrid(){
  const el = document.getElementById('learnBibleGrid'); if(!el) return;
  el.innerHTML = LEARN_BIBLE_LESSONS.map((l,i)=>`
    <div onclick="openBFLesson('learn',${i})" style="background:rgba(255,255,255,.03);border:1px solid ${l.color}20;border-left:4px solid ${l.color};border-radius:12px;padding:.8rem 1rem;cursor:pointer;transition:all .15s;" onmouseenter="this.style.transform='translateY(-2px)'" onmouseleave="this.style.transform=''">
      <div style="display:flex;align-items:center;gap:.5rem;">
        <span style="font-size:1.3rem;">${l.icon}</span>
        <div style="font-size:.88rem;font-weight:800;">${l.title}</div>
      </div>
    </div>
  `).join('');
}

// old lessonModal functions removed - using charModal globally

function openBFLesson(type, idx){
  const banks = {jesus:JESUS_LESSONS, learn:LEARN_BIBLE_LESSONS};
  const l = banks[type][idx]; if(!l) return;
  const gradients = {jesus:'linear-gradient(135deg,#667eea,#764ba2)',learn:'linear-gradient(135deg,#4facfe,#00f2fe)'};
  document.getElementById('charIcon').textContent = l.icon;
  document.getElementById('charTitle').textContent = l.title;
  document.getElementById('charSub').textContent = type==='jesus'?'Jesus & God\'s Purpose':'Learning the Bible';
  document.getElementById('charModalHeader').style.background = gradients[type]||'linear-gradient(135deg,#667eea,#764ba2)';
  document.getElementById('charBody').innerHTML = l.body;
  document.getElementById('charQuiz').innerHTML = '';
  openModal('charModal');
  logActivity('faith', 'Read: '+l.title);
}

function getDailyDevotionalIdx(){
  // Seeded shuffle: each day gets a unique devotional, no repeats within 60-day cycle
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(),0,0)) / 86400000);
  const cyclePos = dayOfYear % 60;
  const seed = now.getFullYear() * 100 + Math.floor(dayOfYear / 60);
  const arr = Array.from({length:100},(_,i)=>i);
  let s = seed;
  for(let i=59;i>0;i--){ s=(s*1664525+1013904223)&0xffffffff; const j=Math.abs(s)%(i+1); [arr[i],arr[j]]=[arr[j],arr[i]]; }
  return arr[cyclePos];
}

function renderDevotionals(){
  const todayIdx = getDailyDevotionalIdx();
  const dev = DEVOTIONALS[todayIdx];

  // Populate today's card
  const dn = document.getElementById('devDayNum'); if(dn) dn.textContent = todayIdx+1;
  const dt = document.getElementById('devTitle'); if(dt) dt.textContent = dev.title;
  const ds = document.getElementById('devScripture'); if(ds) ds.innerHTML = '&ldquo;' + dev.scripture + '&rdquo;';
  const dr = document.getElementById('devRef'); if(dr) dr.textContent = '— '+dev.verse;
  const db = document.getElementById('devBody'); if(db) db.innerHTML = '<p style="line-height:1.8;margin:0;">' + dev.body + '</p>';
  const drf = document.getElementById('devReflect'); if(drf) drf.innerHTML = '<p style="line-height:1.8;margin:0;">' + dev.reflect + '</p>';
  const dp = document.getElementById('devPrayer'); if(dp) dp.innerHTML = '<p style="line-height:1.8;margin:0;font-style:italic;">' + (dev.prayer||'Lord, help me apply what I have read today. Open my heart and guide my steps. Amen.') + '</p>';

  // Mark complete button
  const da = document.getElementById('devAction');
  if(da){
    const today = new Date().toISOString().slice(0,10);
    if(D.scrReadDays && D.scrReadDays[today]){
      da.innerHTML = '<div style="color:#22c55e;font-weight:700;font-size:.85rem;">✅ Completed today! +5 pts</div>';
    } else {
      da.innerHTML = '<button class="btn bp" onclick="markDevotionalRead()" style="font-size:.9rem;padding:.6rem 1.5rem;">✅ I Read Todays Devotional (+5 pts)</button>';
    }
  }

  // Render stats
  renderScrStats();

  // All 30 as cards
  const el = document.getElementById('devList'); if(!el) return;
  const devColors = ['#a78bfa','#60a5fa','#22c55e','#fbbf24','#f472b6','#fb923c','#38bdf8','#ef4444','#06b6d4','#e879f9'];
  el.innerHTML = DEVOTIONALS.map((d,i)=>{
    const isToday = i===todayIdx;
    const c = devColors[i % devColors.length];
    return `<div style="background:${isToday?'rgba(245,166,35,.06)':'rgba(255,255,255,.02)'};border:1px solid ${isToday?'rgba(245,166,35,.25)':'rgba(255,255,255,.06)'};border-radius:12px;padding:.7rem .8rem;cursor:pointer;transition:all .15s;min-height:100px;${isToday?'box-shadow:0 0 12px rgba(245,166,35,.1);':''}" onclick="openDevotionalCard(${i})" onmouseenter="this.style.transform='translateY(-2px)'" onmouseleave="this.style.transform=''">
      <div style="display:flex;align-items:center;gap:.4rem;margin-bottom:.3rem;">
        <div style="width:28px;height:28px;border-radius:50%;background:${c}18;border:1.5px solid ${c};display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:800;color:${c};flex-shrink:0;">${i+1}</div>
        <div>
          <div style="font-size:.78rem;font-weight:700;color:var(--tx);">${d.title}</div>
          ${isToday?'<span style="font-size:.45rem;background:#f5a623;color:#000;padding:.06rem .25rem;border-radius:3px;font-weight:700;">TODAY</span>':''}
        </div>
      </div>
      <div style="font-size:.65rem;color:var(--p);font-style:italic;">${d.verse}</div>
      <div style="font-size:.62rem;color:var(--tx3);margin-top:.15rem;line-height:1.4;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${d.body}</div>
    </div>`;
  }).join('');
}

function openDevotionalCard(idx){
  const d = DEVOTIONALS[idx]; if(!d) return;
  const colors = ['#667eea,#764ba2','#f093fb,#f5576c','#4facfe,#00f2fe','#43e97b,#38f9d7','#fa709a,#fee140','#a18cd1,#fbc2eb','#fccb90,#d57eeb','#667eea,#764ba2','#e0c3fc,#8ec5fc','#f5576c,#ff8a65'];
  const gradient = colors[idx % colors.length];
  
  document.getElementById('charIcon').textContent = '🕊️';
  document.getElementById('charTitle').textContent = d.title;
  document.getElementById('charSub').textContent = 'Day ' + (idx+1) + ' · ' + d.verse;
  document.getElementById('charModalHeader').style.background = 'linear-gradient(135deg,' + gradient + ')';
  
  document.getElementById('charBody').innerHTML = `
    <div style="background:rgba(167,139,250,.05);border-left:3px solid #a78bfa;border-radius:0 10px 10px 0;padding:1rem 1.2rem;margin-bottom:1rem;">
      <div style="font-size:1.05rem;font-style:italic;color:#fff;line-height:1.8;">"${d.scripture}"</div>
      <div style="font-size:.78rem;color:#a78bfa;font-weight:700;margin-top:.4rem;">— ${d.verse}</div>
    </div>
    
    <div style="margin-bottom:1rem;">
      <div style="display:flex;align-items:center;gap:.3rem;margin-bottom:.4rem;">
        <span style="font-size:.9rem;">💭</span>
        <span style="font-size:.85rem;font-weight:800;color:var(--c);">Reflection</span>
      </div>
      <p style="margin:0;line-height:1.8;">${d.body}</p>
    </div>
    
    <div style="background:rgba(244,114,182,.04);border-left:3px solid #f472b6;border-radius:0 10px 10px 0;padding:.8rem 1rem;">
      <div style="display:flex;align-items:center;gap:.3rem;margin-bottom:.3rem;">
        <span style="font-size:.85rem;">🙏</span>
        <span style="font-size:.8rem;font-weight:800;color:#f472b6;">Prayer</span>
      </div>
      <p style="margin:0;font-style:italic;line-height:1.8;color:var(--tx2);">${d.prayer||''}</p>
    </div>
    
    <div style="background:rgba(34,197,94,.04);border-left:3px solid #22c55e;border-radius:0 10px 10px 0;padding:.8rem 1rem;margin-top:1rem;">
      <div style="display:flex;align-items:center;gap:.3rem;margin-bottom:.3rem;">
        <span style="font-size:.85rem;">🎯</span>
        <span style="font-size:.8rem;font-weight:800;color:#22c55e;">Apply It Today</span>
      </div>
      <p style="margin:0;line-height:1.8;">${d.reflect}</p>
    </div>
  `;
  document.getElementById('charQuiz').innerHTML = '';
  openModal('charModal');
}

function markDevotionalRead(){
  if(!D.scrReadDays) D.scrReadDays = {};
  const today = new Date().toISOString().slice(0,10);
  if(D.scrReadDays[today]){ showToast('Already marked today'); return; }
  D.scrReadDays[today] = true;
  D.scrPoints = (D.scrPoints||0) + 5;
  save();
  renderDevotionals();
  earnPB(2, 'Devotional reading');
  celebrateIfNeeded('scripture');
  logActivity('scripture', 'Read daily devotional');
}

function showDailyDevModal(){
  const idx = getDailyDevotionalIdx();
  const d = DEVOTIONALS[idx]; if(!d) return;
  const colors = ['linear-gradient(135deg,#667eea,#764ba2)','linear-gradient(135deg,#f093fb,#f5576c)','linear-gradient(135deg,#4facfe,#00f2fe)','linear-gradient(135deg,#43e97b,#38f9d7)','linear-gradient(135deg,#fa709a,#fee140)','linear-gradient(135deg,#a18cd1,#fbc2eb)'];
  const hdr = document.getElementById('ddmHeader'); if(hdr) hdr.style.background = colors[idx % colors.length];
  const el = document.getElementById('dailyDevModal'); if(!el) return;
  document.getElementById('ddmTitle').textContent = d.title;
  document.getElementById('ddmVerse').textContent = d.verse;
  document.getElementById('ddmScripture').innerHTML = '\u201c' + d.scripture + '\u201d';
  document.getElementById('ddmBody').textContent = d.body;
  document.getElementById('ddmReflect').textContent = d.reflect;
  document.getElementById('ddmPrayer').textContent = d.prayer || 'Lord, help me apply what I have read today. Open my heart and guide my steps. Amen.';
  // Show already-read state if completed today
  const today = new Date().toISOString().slice(0,10);
  const btn = el.querySelector('button[onclick*="markDevFromPopup"]');
  if(btn && D.scrReadDays && D.scrReadDays[today]){
    btn.textContent = '✅ Already Read Today!';
    btn.style.opacity = '.6';
    btn.style.cursor = 'default';
  }
  el.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeDailyDevModal(){
  const el = document.getElementById('dailyDevModal'); if(!el) return;
  el.style.display = 'none';
  document.body.style.overflow = '';
  // Mark as seen today so it won't show again until tomorrow
  const today = new Date().toISOString().slice(0,10);
  D.devPopupSeen = today;
  save();
}

function markDevFromPopup(){
  if(!D.scrReadDays) D.scrReadDays = {};
  const today = new Date().toISOString().slice(0,10);
  if(D.scrReadDays[today]){ showToast('Already marked today'); return; }
  D.scrReadDays[today] = true;
  D.scrPoints = (D.scrPoints||0) + 5;
  save();
  if(typeof renderDevotionals === 'function') renderDevotionals();
  earnPB(2, 'Devotional reading');
  celebrateIfNeeded('scripture');
  logActivity('scripture', 'Read daily devotional');
  showToast('Devotional read! +5 pts 🙏');
  closeDailyDevModal();
}

function renderScrStats(){
  const days = Object.keys(D.scrReadDays||{});
  const points = D.scrPoints||0;
  const streak = getScriptureStreak ? getScriptureStreak() : 0;
  const pct = Math.round((days.length/365)*100);
  
  const pe = document.getElementById('scrPoints'); if(pe) pe.textContent = points;
  const se = document.getElementById('scrStreak'); if(se) se.textContent = streak;
  const de = document.getElementById('scrDaysRead'); if(de) de.textContent = days.length;
  const pc = document.getElementById('scrPctComplete'); if(pc) pc.textContent = pct+'%';
  const pl = document.getElementById('scrProgressLabel'); if(pl) pl.textContent = days.length+'/365';
  const pb = document.getElementById('scrProgressBar'); if(pb) pb.style.width = pct+'%';
}

// Highlighter
let _studyHL = '#fef08a';
function setStudyHL(color){
  _studyHL = color;
  D.scrHighlight = color;
  save();
}

// Save study note
function saveStudyNote(){
  const input = document.getElementById('scrNoteInput');
  if(!input || !input.value.trim()){ showToast('Write something first'); return; }
  if(!D.scrNotes) D.scrNotes = [];
  const s = getTodayScripture();
  D.scrNotes.push({
    id: Date.now(),
    date: new Date().toISOString().slice(0,10),
    day: s.day,
    verse: s.text,
    ref: s.ref,
    note: input.value.trim(),
    highlight: _studyHL || ''
  });
  input.value = '';
  save();
  renderStudyNotes();
  logActivity('study', 'Bible study note saved: Day '+s.day);
  showToast('Study note saved ✓');
}

function renderStudyNotes(){
  const el = document.getElementById('scrNotesHistory'); if(!el) return;
  const notes = (D.scrNotes||[]).slice().reverse();
  const countEl = document.getElementById('scrNoteCount');
  if(countEl) countEl.textContent = notes.length;

  if(!notes.length){
    el.innerHTML = '<div style="font-size:.72rem;color:var(--tx3);padding:.5rem;text-align:center;">No study notes yet. Read today\'s verse and write your first reflection!</div>';
    return;
  }

  el.innerHTML = notes.map(n=>`
    <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:10px;padding:.7rem .8rem;margin-bottom:.4rem;${n.highlight?'border-left:4px solid '+n.highlight:''}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.25rem;">
        <span style="font-size:.6rem;font-weight:700;color:var(--p);">Day ${n.day} · ${n.ref}</span>
        <span style="font-size:.55rem;color:var(--tx3);">${n.date}</span>
      </div>
      <div style="font-size:.72rem;font-style:italic;color:var(--tx2);margin-bottom:.3rem;line-height:1.5;${n.highlight?'background:'+n.highlight+'20;padding:.2rem .3rem;border-radius:4px;':''}"><span style="font-size:.55rem;">📖</span> "${n.verse.substring(0,80)}${n.verse.length>80?'...':''}"</div>
      <div style="font-size:.78rem;color:var(--tx);line-height:1.6;">${n.note}</div>
      <button onclick="deleteStudyNote(${n.id})" style="font-size:.5rem;color:var(--tx3);background:none;border:none;cursor:pointer;margin-top:.2rem;float:right;">🗑</button>
    </div>
  `).join('');
}

function deleteStudyNote(id){
  if(!confirm('Delete this study note?')) return;
  D.scrNotes = (D.scrNotes||[]).filter(n=>n.id!==id);
  save(); renderStudyNotes();
}

function markScriptureRead(){
  const today = new Date().toISOString().slice(0,10);
  if(D.scrReadDays[today]) return;
  D.scrReadDays[today] = true;
  D.scrPoints = (D.scrPoints||0) + 5;
  save();
  renderScripturePage();
  updateDashCards();
  showToast('+5 scripture points ✓');
}

function getScriptureStreak(){
  let streak = 0;
  const d = new Date();
  while(true){
    const ds = d.toISOString().slice(0,10);
    if(D.scrReadDays && D.scrReadDays[ds]){ streak++; d.setDate(d.getDate()-1); }
    else break;
  }
  return streak;
}

function renderScripturePage(){
  const s = getTodayScripture();
  const today = new Date().toISOString().slice(0,10);
  const readToday = D.scrReadDays && D.scrReadDays[today];
  const streak = getScriptureStreak();
  const daysRead = D.scrReadDays ? Object.keys(D.scrReadDays).length : 0;
  const pct = Math.round((daysRead/365)*100);

  // Today's scripture
  const dn = document.getElementById('scrDayNum'); if(dn) dn.textContent = s.day;
  const dt = document.getElementById('scrDailyText'); if(dt) dt.textContent = s.text;
  const dr = document.getElementById('scrDailyRef'); if(dr) dr.textContent = '— '+s.ref;
  const da = document.getElementById('scrDailyAction');
  if(da) da.innerHTML = readToday ?
    '<div style="font-size:.8rem;color:#22c55e;font-weight:700;">✅ Read Today! +5 pts</div>' :
    '<button class="btn bp" onclick="markScriptureRead()" style="font-size:.85rem;">✅ Mark as Read (+5 pts)</button>';

  // Stats
  const sp = document.getElementById('scrPoints'); if(sp) sp.textContent = D.scrPoints||0;
  const ss = document.getElementById('scrStreak'); if(ss) ss.textContent = streak;
  const sd = document.getElementById('scrDaysRead'); if(sd) sd.textContent = daysRead;
  const sc = document.getElementById('scrPctComplete'); if(sc) sc.textContent = pct+'%';
  const sl = document.getElementById('scrProgressLabel'); if(sl) sl.textContent = daysRead+'/365';
  const sb = document.getElementById('scrProgressBar'); if(sb) sb.style.width = pct+'%';

  // Calendar
  renderScrCalendar();

  // Browse list
  renderScrBrowse();
  initScriptureTimer();
}

function scrCalMonth(m, btn){
  _scrCalFilter = m;
  document.querySelectorAll('#s-scripture .tab.bs').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderScrCalendar();
}

function renderScrCalendar(){
  const el = document.getElementById('scrCalGrid'); if(!el) return;
  const year = new Date().getFullYear();
  const today = new Date().toISOString().slice(0,10);
  let days = [];

  if(_scrCalFilter === 'all'){
    // Show all 365 days as tiny squares
    for(let m=0;m<12;m++){
      const daysInMonth = new Date(year,m+1,0).getDate();
      for(let d=1;d<=daysInMonth;d++){
        const ds = `${year}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        days.push({ds, d, m});
      }
    }
  } else {
    const m = parseInt(_scrCalFilter);
    const daysInMonth = new Date(year,m+1,0).getDate();
    for(let d=1;d<=daysInMonth;d++){
      const ds = `${year}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      days.push({ds, d, m});
    }
  }

  const size = _scrCalFilter === 'all' ? '10px' : '28px';
  const fontSize = _scrCalFilter === 'all' ? '.35rem' : '.65rem';

  el.innerHTML = days.map(day=>{
    const read = D.scrReadDays && D.scrReadDays[day.ds];
    const isToday = day.ds === today;
    const isPast = day.ds < today;
    return `<div style="width:${size};height:${size};border-radius:${_scrCalFilter==='all'?'2px':'6px'};background:${read?'#22c55e':isToday?'rgba(139,92,246,.3)':isPast?'rgba(239,68,68,.1)':'rgba(255,255,255,.04)'};display:flex;align-items:center;justify-content:center;font-size:${fontSize};color:${read?'#fff':isToday?'#a78bfa':'var(--tx3)'};font-weight:${isToday?'700':'400'};" title="${day.ds}${read?' ✓':''}">${_scrCalFilter!=='all'?day.d:''}</div>`;
  }).join('');
}

function renderScrBrowse(){
  const el = document.getElementById('scrBrowseList'); if(!el) return;
  const today = getDayOfYear();
  // Show nearby scriptures (today -3 to +7)
  const start = Math.max(0, today-4);
  const end = Math.min(364, today+7);
  el.innerHTML = '';
  for(let i=start;i<=end;i++){
    const s = DAILY_SCRIPTURES[i];
    if(!s) continue;
    const isToday = (i+1) === today;
    const ds = new Date(new Date().getFullYear(),0,i+1).toISOString().slice(0,10);
    const read = D.scrReadDays && D.scrReadDays[ds];
    el.innerHTML += `<div style="padding:.5rem .6rem;border-bottom:1px solid rgba(255,255,255,.04);${isToday?'background:rgba(139,92,246,.05);border-radius:8px;':''}">
      <div style="display:flex;align-items:center;gap:.4rem;margin-bottom:.15rem;">
        <span style="font-size:.6rem;font-weight:700;color:${isToday?'#a78bfa':'var(--tx3)'};">Day ${i+1}</span>
        ${read?'<span style="font-size:.55rem;color:#22c55e;">✅</span>':''}
        ${isToday?'<span style="font-size:.5rem;background:#a78bfa;color:#fff;padding:.1rem .3rem;border-radius:3px;">TODAY</span>':''}
      </div>
      <div style="font-size:.78rem;font-style:italic;color:var(--tx);line-height:1.5;">${s[0]}</div>
      <div style="font-size:.65rem;color:var(--p);font-weight:600;margin-top:.15rem;">— ${s[1]}</div>
    </div>`;
  }
}

function toggleDailyScripture(btn){
  const sec = document.getElementById('s-scripture');
  const navBtn = document.getElementById('ni-s-scripture');
  if(!sec) return;
  const hidden = sec.style.display === 'none';
  sec.style.display = hidden ? '' : 'none';
  if(navBtn) navBtn.style.display = hidden ? '' : 'none';
  if(btn) btn.classList.toggle('on', hidden);
}

