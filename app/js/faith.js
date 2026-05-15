/* =============================================================
   faith.js — 365 daily scripture verses, ESV Bible reader,
               Jesus & God's purpose, faith journey, 66 books,
               365 daily devotionals, Bible study
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
  if(!D.scrReadDays || Array.isArray(D.scrReadDays)) D.scrReadDays = {};
  if(!D.scrPoints) D.scrPoints = 0;
  if(!D.scrNotes) D.scrNotes = [];
  if(!D.scrHighlight) D.scrHighlight = '#fef08a';
  renderScripturePage();
  renderScrStats();
}

// The Well tab switcher
// F2-A: added 'home' (default), 'plans', 'prayer', 'memorize', 'academy' alongside
// the original 6 tabs. New tabs without renderers are stubs awaiting later phases.
// btn is optional — when bfTab() is called programmatically (e.g., from a Quick
// Tile or stub-panel CTA), the matching button is found via [data-bf-tab].
const BF_TABS = ['home','devotional','jesus','learnBible','reading','bible','journey','plans','prayer','memorize','academy','bibleworld','stories','timeline'];

// Phase 5.8 v3 — Home-grid restorer. Defensive against any prior code
// that may have set .topic-card-grid display:none inside #bf-home. The
// canonical Home view is the navigation card-grid sitting above the
// dashboard (.fh-grid). Called whenever bfTab('home') runs — directly,
// via the Home tab button, or via a "← Back to Home" pill on a sub-tab.
function bfShowHomeGrid(){
  const home = document.getElementById('bf-home');
  if(!home) return;
  home.querySelectorAll('.topic-card-grid').forEach(el=>{ el.style.display = ''; });
  const dash = home.querySelector('.fh-grid');
  if(dash) dash.style.display = '';
}

// Phase 5.8 v3 — Back-to-Home pill management. Every The Well
// sub-tab gets a "← Back to Home" pill at the top so the navigation
// card-grid is always one click away. Idempotent — won't double-insert.
// ── DONATION PROMPT (faith-only users, The Well home tab) ────
// Subtle, dismissible card injected on first render of bf-home for
// users on the free faith path. Persists dismissal in D so it stays
// hidden across reloads / cloud sync. The card links out to
// faith.html#donate where the actual Stripe Checkout lives.
function dismissDonationPrompt(){
  if(typeof D !== 'undefined' && D){
    D.donationPromptDismissed = true;
    if(typeof save === 'function') save();
  }
  const el = document.getElementById('fhDonationPrompt');
  if(el) el.style.display = 'none';
}

function renderWellDonationPrompt(){
  // 2026-05-15 — Donation prompt card REMOVED from the Well home for
  // faith-free users. The function becomes a no-op + defensive cleanup
  // so any lingering DOM from a prior render disappears on next call.
  // Keep the function name + caller intact so other entry points (Stripe
  // Checkout, faith.html donation page) stay reachable through the
  // existing URL, just not via this in-app card.
  const stale = document.getElementById('fhDonationPrompt');
  if(stale && stale.parentNode) stale.parentNode.removeChild(stale);
  return;
  // ---- legacy gate kept below for reference; unreachable. ----
  if(!window._faithFree) return;
  if(typeof D !== 'undefined' && D && D.donationPromptDismissed) return;

  // Re-render: if the card already exists, just ensure it's visible.
  let card = document.getElementById('fhDonationPrompt');
  if(card){ card.style.display = ''; return; }

  // First render: build and insert the card. Placed at the top of the
  // bf-home flow (after the verse-of-the-day + welcome strip, before
  // fhFamilyVerseCard / the main card grid).
  const home = document.getElementById('bf-home');
  if(!home) return;

  card = document.createElement('div');
  card.id = 'fhDonationPrompt';
  card.style.cssText = 'background:rgba(245,166,35,.04);border:1px solid rgba(245,166,35,.22);border-radius:12px;padding:.85rem 1.1rem;margin-bottom:.85rem;position:relative;';
  card.innerHTML =
    '<button onclick="dismissDonationPrompt()" aria-label="Dismiss" style="position:absolute;top:.4rem;right:.5rem;background:none;border:none;color:var(--tx3);font-size:1.1rem;cursor:pointer;line-height:1;padding:.2rem .45rem;">×</button>' +
    '<div style="display:flex;align-items:center;gap:.7rem;padding-right:1.4rem;">' +
      '<span style="font-size:1.4rem;flex-shrink:0;">💛</span>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:.78rem;font-weight:800;color:#fbbf24;margin-bottom:.2rem;">Faith features are free — always.</div>' +
        '<div style="font-size:.72rem;color:var(--tx2);line-height:1.5;">If you’d like to support the mission, even $5 helps.</div>' +
      '</div>' +
      '<a href="https://yourlifecc.com/faith.html#donate" target="_blank" rel="noopener" style="background:rgba(245,166,35,.15);border:1px solid rgba(245,166,35,.35);color:#fbbf24;border-radius:8px;padding:.42rem .8rem;font-size:.74rem;font-weight:700;text-decoration:none;flex-shrink:0;white-space:nowrap;">Support →</a>' +
    '</div>';

  // Insert position: prefer just before fhFamilyVerseCard so the card
  // sits at the top of the home grid. Fall back to after .well-welcome.
  const familyCard = document.getElementById('fhFamilyVerseCard');
  if(familyCard && familyCard.parentNode === home){
    home.insertBefore(card, familyCard);
    return;
  }
  const welcome = home.querySelector('.well-welcome');
  if(welcome && welcome.parentNode === home){
    if(welcome.nextSibling) home.insertBefore(card, welcome.nextSibling);
    else home.appendChild(card);
    return;
  }
  home.appendChild(card);
}

// wellGoto(target) — single entry point for any external nav into The Well.
// Used by the expanded sidebar (13 items) so one click both opens the
// section and switches to the chosen tab. 'worship' and 'flashcards' are
// historically separate sections rather than bfTab targets, so they
// short-circuit to showSection on those section ids; everything else
// routes through bfTab inside #s-scripture.
function wellGoto(target){
  if(target === 'worship'){
    if(typeof showSection === 'function') showSection('s-worship');
    return;
  }
  if(target === 'flashcards'){
    if(typeof showSection === 'function') showSection('s-flashcards');
    return;
  }
  // Persist the chosen tab BEFORE showSection so its built-in
  // s-scripture handler reads the right value when it calls bfTab.
  // Belt-and-suspenders: also call bfTab directly after a short delay
  // in case D.wellLastTab persistence is missed.
  if(typeof D !== 'undefined' && D){
    D.wellLastTab = target;
    if(typeof save === 'function') save();
  }
  if(typeof showSection === 'function') showSection('s-scripture');
}

function bfRemoveAllBackPills(){
  document.querySelectorAll('.bf-back-btn').forEach(b => b.remove());
}
function bfInjectBackPill(panelId){
  const el = document.getElementById(panelId);
  if(!el) return;
  if(el.querySelector('.bf-back-btn')) return;
  const back = document.createElement('button');
  back.className = 'bf-back-btn topic-back-btn';
  back.type = 'button';
  back.innerHTML = '← Back to Home';
  back.onclick = function(){ bfTab('home'); };
  el.insertBefore(back, el.firstChild);
}

function bfTab(tab, btn){
  BF_TABS.forEach(t=>{
    const el = document.getElementById('bf-'+t);
    if(el) el.style.display = t===tab ? 'block' : 'none';
  });
  // Both top + bottom tab bars share the .scrTabs class, so this one
  // selector keeps them in sync. Activate ALL matching buttons (not just
  // the clicked one) so the other bar reflects the new active state.
  document.querySelectorAll('.scrTabs .tab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.scrTabs .tab[data-bf-tab="'+tab+'"]').forEach(b=>b.classList.add('active'));
  // Sidebar Well-tab items use data-well-tab for sync. Match the same
  // active state so the left sidebar, top tab bar, and bottom tab bar
  // all reflect the current tab simultaneously.
  document.querySelectorAll('#sideNav [data-well-tab]').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('#sideNav [data-well-tab="'+tab+'"]').forEach(b=>b.classList.add('active'));
  // F9: persist last-visited tab so showSection('s-scripture') can return
  // the user to where they left off instead of forcing the Home tab.
  if(typeof D !== 'undefined' && D){
    D.wellLastTab = tab;
    if(typeof save === 'function') save();
  }
  // Phase 5.8 v3 — Restore Home grid view + inject Back pill on every sub-tab.
  bfRemoveAllBackPills();
  if(tab === 'home') bfShowHomeGrid();
  else bfInjectBackPill('bf-' + tab);
  if(tab==='home') renderFaithHome();
  if(tab==='devotional') renderDevotionals();
  if(tab==='reading'){ populateBibleBooks(); renderBibleReadings(); }
  if(tab==='bible') initEsvBible();
  if(tab==='journey') renderFaithJourney();
  if(tab==='jesus') renderJesusGrid();
  if(tab==='learnBible') renderLearnBibleGrid();
  if(tab==='plans') renderPlanCatalog();
  if(tab==='prayer') renderPrayerPanel();
  if(tab==='memorize') renderMemorizePanel();
  if(tab==='academy') renderAcademyPanel();
  if(tab==='bibleworld') renderBibleWorld();
  if(tab==='stories') renderFaithHomeStories();
  if(tab==='timeline') renderBibleTimeline();
}

// ── FAITH HOME (F2-A) ────────────────────────────────────────
// Default landing tab. Pulls from existing data — DAILY_SCRIPTURES (VOTD),
// DEVOTIONALS + getDailyDevotionalIdx (today's devotional), D.scrReadDays
// (streak via getScriptureStreak), D.scrPoints (Faith XP).
// No new schema; F2-B/F2-C/F2-E swap each card to its richer version.
function renderFaithHome(){
  // Card 1 — Verse of the Day (uses existing 365-verse rotation)
  try {
    const s = getTodayScripture();
    const dEl = document.getElementById('fhVotdDay'); if(dEl) dEl.textContent = s.day;
    const tEl = document.getElementById('fhVotdText'); if(tEl) tEl.textContent = '“' + s.text + '”';
    const rEl = document.getElementById('fhVotdRef'); if(rEl) rEl.textContent = '— ' + s.ref;
  } catch(e){ /* DAILY_SCRIPTURES not loaded — leave placeholder */ }

  // Card 2 — Today's Devotional preview
  try {
    const idx = getDailyDevotionalIdx();
    const dev = DEVOTIONALS[idx];
    if(dev){
      const titleEl = document.getElementById('fhDevoTitle');
      const snipEl  = document.getElementById('fhDevoSnippet');
      if(titleEl) titleEl.textContent = 'Day ' + (idx+1) + ' · ' + dev.title;
      if(snipEl){
        const body = (dev.body || '').replace(/<[^>]+>/g,'');
        snipEl.textContent = body.length > 180 ? body.slice(0,180) + '…' : body;
      }
    }
    // Already-read state — disable the Mark button when today is checked off.
    const today = new Date().toISOString().slice(0,10);
    const markBtn = document.getElementById('fhDevoMark');
    if(markBtn){
      const read = D.scrReadDays && D.scrReadDays[today];
      if(read){
        markBtn.textContent = '✅ Read today';
        markBtn.disabled = true;
        markBtn.style.opacity = '.65';
        markBtn.style.cursor = 'default';
      } else {
        markBtn.textContent = '✅ Mark Read +5 XP';
        markBtn.disabled = false;
        markBtn.style.opacity = '';
        markBtn.style.cursor = 'pointer';
      }
    }
  } catch(e){ /* DEVOTIONALS missing */ }

  // Card 3 — Active Reading Plan (F2-B). Empty state stays from the static HTML
  // when no plan is active; otherwise, swap to a progress strip with "Read Today".
  const planBody = document.getElementById('fhPlanBody');
  if(planBody){
    const active = (typeof fhActivePlan === 'function') ? fhActivePlan() : null;
    if(active){
      const p = active.plan, prog = active.prog;
      const pct = Math.round(((prog.currentDay - 1) / prog.totalDays) * 100);
      const todayDay = prog.currentDay <= prog.totalDays ? prog.currentDay : prog.totalDays;
      const todayData = (p.daysData || []).find(d => d.day === todayDay);
      const firstRef = todayData && todayData.refs && todayData.refs[0];
      planBody.innerHTML = `
        <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.55rem;">
          <span style="font-size:1.4rem;">${p.badgeIcon}</span>
          <div style="flex:1;min-width:0;">
            <div style="font-size:.85rem;font-weight:800;color:var(--tx);line-height:1.25;">${p.title}</div>
            <div style="font-size:.66rem;color:var(--tx3);font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-top:.1rem;">Day ${prog.currentDay} of ${prog.totalDays} · ${pct}% complete</div>
          </div>
        </div>
        <div style="height:6px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden;margin-bottom:.7rem;">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#38bdf8,${p.brandColor});border-radius:99px;transition:width .5s;"></div>
        </div>
        <div style="display:flex;gap:.4rem;flex-wrap:wrap;">
          ${firstRef ? `<button class="fh-btn" onclick="planJumpToVerse(${JSON.stringify(firstRef).replace(/"/g,'&quot;')})">📖 Read Today’s Passage</button>` : ''}
          <button class="fh-btn-ghost" onclick="openPlanDetail('${p.id}')">View Plan</button>
        </div>
      `;
    } else {
      // Restore empty state — only re-render if currently in active-plan mode.
      // Cheap idempotency: rebuild the empty state every render; it's tiny.
      planBody.innerHTML = `
        <div class="fh-plan-empty">No plan started yet. Choose from 8 plans now (more land in F2 follow-ups) — topical, beginner, and through-the-Bible.</div>
        <button class="fh-btn" onclick="bfTab('plans')">Browse Plans →</button>
      `;
    }
  }

  // Card 4 — Streak ring + Faith XP (animated stroke-dashoffset)
  const streak = (typeof getScriptureStreak === 'function') ? getScriptureStreak() : 0;
  const xp     = (D && D.scrPoints) || 0;
  const numEl  = document.getElementById('fhStreakNum');
  const subEl  = document.getElementById('fhStreakSub');
  const arcEl  = document.getElementById('fhStreakArc');
  const xpEl   = document.getElementById('fhXpVal');
  if(numEl) numEl.textContent = streak;
  if(xpEl)  xpEl.textContent  = xp;
  if(subEl){
    if(streak === 0)      subEl.textContent = 'Read a devotional or verse to start.';
    else if(streak === 1) subEl.textContent = 'Day one — keep it going!';
    else                  subEl.textContent = streak + ' days · longest yet, push for ' + (streak+1);
  }
  if(arcEl){
    // Ring fills in 7-day visual cycle so the first week is rewarding,
    // then resets-with-momentum for week 2+. Caps at full circle on 7+.
    const C = 188.5; // 2*pi*r where r=30
    const pct = Math.min(streak / 7, 1);
    arcEl.style.strokeDashoffset = String(C - (C * pct));
  }

  // Streak shield indicator — F2-H forgiveness system surfaces the status:
  //   sabbath → 🕊️ today is Sunday, auto-protected
  //   ready   → 🛡 weekly skip available
  //   used    → ⚠️ no skip left, read today to keep streak
  //   done/0  → hidden (no shield needed when read or before streak starts)
  const shieldEl = document.getElementById('fhStreakShield');
  if(shieldEl){
    if(streak === 0){ shieldEl.style.display = 'none'; }
    else {
      const status = (typeof getStreakShieldStatus === 'function') ? getStreakShieldStatus() : 'ready';
      const inner  = shieldEl.querySelector('.fh-shield');
      if(status === 'done'){
        shieldEl.style.display = 'none';
      } else if(status === 'sabbath' && inner){
        shieldEl.style.display = '';
        inner.innerHTML = '🕊️ Sabbath rest';
        inner.style.background = 'rgba(251,191,36,.12)';
        inner.style.borderColor = 'rgba(251,191,36,.3)';
        inner.style.color = '#fbbf24';
      } else if(status === 'ready' && inner){
        shieldEl.style.display = '';
        inner.innerHTML = '🛡 Shield ready';
        inner.style.background = 'rgba(56,189,248,.12)';
        inner.style.borderColor = 'rgba(56,189,248,.3)';
        inner.style.color = '#38bdf8';
      } else if(inner){
        shieldEl.style.display = '';
        inner.innerHTML = '⚠️ Read today to keep streak';
        inner.style.background = 'rgba(239,68,68,.12)';
        inner.style.borderColor = 'rgba(239,68,68,.3)';
        inner.style.color = '#f87171';
      }
    }
  }

  // F4-G: Story Mode tile list (Faith Home Card 6).
  if(typeof renderFaithHomeStories === 'function') renderFaithHomeStories();

  // F6.2: Subtle donation prompt for faith_only users. Self-gates on
  // window._faithFree + D.donationPromptDismissed; safe to call always.
  renderWellDonationPrompt();

  // F2-H: Family Verse of the Week (only when family profiles exist).
  const fvEl = document.getElementById('fhFamilyVerseCard');
  if(fvEl){
    const hasFamily = (typeof _profiles !== 'undefined' && Array.isArray(_profiles) && _profiles.length >= 2);
    if(hasFamily){
      const fv = (typeof getFamilyVerseOfWeek === 'function') ? getFamilyVerseOfWeek() : null;
      if(fv){
        fvEl.style.display = '';
        const wkEl = document.getElementById('fhFamilyWeekNum');
        const txEl = document.getElementById('fhFamilyVerseText');
        const rfEl = document.getElementById('fhFamilyVerseRef');
        if(wkEl) wkEl.textContent = fv.week;
        if(txEl) txEl.textContent = '“' + fv.text + '”';
        if(rfEl) rfEl.textContent = '— ' + fv.ref;
      } else fvEl.style.display = 'none';
    } else fvEl.style.display = 'none';
  }
}

// ── FAITH HOME ACTIONS (F2-A) ────────────────────────────────
// VOTD context jump: opens the Bible reader at the verse's primary book/chapter
// when parseable; falls back to switching to the Bible tab. F2-D's reader upgrade
// will land us at the precise verse anchor.
function fhOpenContext(){
  let s; try { s = getTodayScripture(); } catch(e){}
  if(!s){ bfTab('bible'); return; }
  const m = String(s.ref).match(/^(\d?\s?[A-Za-z][A-Za-z ]+?)\s+(\d+)/);
  if(!m){ bfTab('bible'); return; }
  const book = m[1].trim(); const ch = m[2];
  bfTab('bible');
  setTimeout(function(){
    const sel = document.getElementById('esvBook');
    if(sel){
      const opt = Array.from(sel.options).find(o => o.value && o.value.toLowerCase() === book.toLowerCase());
      if(opt){ sel.value = opt.value; if(typeof onEsvBookChange === 'function') onEsvBookChange(); }
    }
    const chSel = document.getElementById('esvChapter');
    if(chSel) chSel.value = ch;
    if(typeof openEsvReader === 'function') openEsvReader();
  }, 60);
}

// Save VOTD into the user's existing favorite-verses list.
function fhSaveVotd(){
  let s; try { s = getTodayScripture(); } catch(e){}
  if(!s){ showToast('Verse not loaded yet'); return; }
  if(!D.favVerses) D.favVerses = [];
  const formatted = '"' + s.text + '" — ' + s.ref;
  const dup = D.favVerses.some(v => v && v.text === formatted);
  if(dup){ showToast('Already in your favorites 💎'); return; }
  D.favVerses.push({ id: Date.now(), text: formatted, date: new Date().toISOString().slice(0,10) });
  save();
  if(typeof renderFavVerses === 'function') renderFavVerses();
  showToast('Saved to favorites 💎');
}

// Share VOTD — opens the F2-C Verse Card Generator with today's verse.
// The image generator handles native share / download / copy itself, so the
// old text-only path is no longer the default.
function fhShareVotd(){
  let s; try { s = getTodayScripture(); } catch(e){}
  if(!s){ showToast('Verse not loaded yet'); return; }
  if(typeof openVerseCard === 'function'){
    openVerseCard(s.text, s.ref);
    return;
  }
  // Fallback if the F2-C module hasn't loaded for some reason.
  const text = '"' + s.text + '" — ' + s.ref + '\n\nyourlifecc.com';
  if(navigator.share){
    navigator.share({ title: 'Verse of the Day', text: text }).catch(function(){});
    return;
  }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(function(){ showToast('Verse copied to clipboard ✓'); });
    return;
  }
  showToast('Sharing not supported on this browser');
}

// ═════════════════════════════════════════════════════════════
// F2-C — VERSE CARD GENERATOR (Canvas, 1080×1080)
// ═════════════════════════════════════════════════════════════
// Three templates per spec §4.10:
//   Ocean   — brand cyan→violet gradient, white text
//   Sunrise — warm amber→orange gradient, dark navy text
//   Minimal — white card, black text, brand-cyan accent + wordmark
// All renderers share the same word-wrap path so the verse fits any length.
// Output: PNG blob → download / clipboard.write / Web Share Level 2 with files.

let _vcText = '';
let _vcRef  = '';
let _vcTemplate = 'ocean';

const VC_SIZE = 1080;
const VC_PAD  = 110; // outer breathing room

function openVerseCard(text, ref){
  _vcText = text || '';
  _vcRef  = ref  || '';
  _vcTemplate = 'ocean';
  // Reset chip active state so re-opens always start on Ocean.
  document.querySelectorAll('#verseCardModal .vc-tpl').forEach(function(b){
    const isOcean = b.getAttribute('data-vc-tpl') === 'ocean';
    b.classList.toggle('active', isOcean);
    if(isOcean){
      b.style.background = 'var(--cd-banner)';
      b.style.color      = 'var(--cd-banner-text)';
      b.style.border     = 'none';
      b.style.fontWeight = '800';
    } else {
      b.style.background = 'rgba(255,255,255,.06)';
      b.style.color      = 'var(--tx)';
      b.style.border     = '1px solid rgba(255,255,255,.12)';
      b.style.fontWeight = '700';
    }
  });
  // Hide the Share button if Web Share Level 2 (with files) isn't supported.
  const shareBtn = document.getElementById('vcShareBtn');
  if(shareBtn) shareBtn.style.display = vcCanShareFiles() ? '' : 'none';
  if(typeof openModal === 'function') openModal('verseCardModal');
  // Slight defer so the canvas is in the layout tree before drawing.
  setTimeout(vcRender, 30);
}

function closeVerseCard(){
  if(typeof closeModal === 'function') closeModal('verseCardModal');
}

function vcSetTemplate(tpl, btn){
  _vcTemplate = tpl;
  document.querySelectorAll('#verseCardModal .vc-tpl').forEach(function(b){
    const isActive = b === btn;
    b.classList.toggle('active', isActive);
    if(isActive){
      const bg = (tpl === 'ocean')   ? 'var(--cd-banner)'
              : (tpl === 'sunrise') ? 'linear-gradient(135deg,#fbbf24,#fb923c)'
              : '#fff';
      const color = (tpl === 'minimal') ? '#0b1220' : '#0b1220';
      b.style.background = bg;
      b.style.color      = color;
      b.style.border     = (tpl === 'minimal') ? '1px solid rgba(255,255,255,.4)' : 'none';
      b.style.fontWeight = '800';
    } else {
      b.style.background = 'rgba(255,255,255,.06)';
      b.style.color      = 'var(--tx)';
      b.style.border     = '1px solid rgba(255,255,255,.12)';
      b.style.fontWeight = '700';
    }
  });
  vcRender();
}

// Word-wrap a single string against a target maxWidth at the given font.
// Returns an array of lines.
function vcWrap(ctx, text, maxWidth){
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for(let i=0;i<words.length;i++){
    const test = line ? (line + ' ' + words[i]) : words[i];
    const w = ctx.measureText(test).width;
    if(w > maxWidth && line){
      lines.push(line);
      line = words[i];
    } else {
      line = test;
    }
  }
  if(line) lines.push(line);
  return lines;
}

// Pick a verse font size that fits N lines inside the available height.
// Returns { fontSize, lineHeight, lines }.
function vcFitVerse(ctx, text, maxWidth, maxHeight, family, weight){
  // Try sizes from large to small; aim for at most ~9 lines on long verses.
  const candidates = [78, 70, 64, 58, 52, 46, 42, 38, 34];
  for(let i=0;i<candidates.length;i++){
    const size = candidates[i];
    ctx.font = weight + ' ' + size + 'px ' + family;
    const lines = vcWrap(ctx, text, maxWidth);
    const lineHeight = Math.round(size * 1.32);
    if(lines.length * lineHeight <= maxHeight) return { fontSize:size, lineHeight, lines };
  }
  // Last resort — smallest.
  const size = 32;
  ctx.font = weight + ' ' + size + 'px ' + family;
  return { fontSize:size, lineHeight:Math.round(size*1.3), lines: vcWrap(ctx, text, maxWidth) };
}

function vcRender(){
  const c = document.getElementById('verseCardCanvas');
  if(!c) return;
  const ctx = c.getContext('2d'); if(!ctx) return;

  const tpl = _vcTemplate;
  const W = VC_SIZE, H = VC_SIZE;

  // Background
  ctx.clearRect(0,0,W,H);
  if(tpl === 'ocean'){
    const g = ctx.createLinearGradient(0,0,W,H);
    g.addColorStop(0, '#38bdf8');
    g.addColorStop(1, '#a78bfa');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);
    // Subtle radial highlight
    const r = ctx.createRadialGradient(W*0.25, H*0.18, 50, W*0.25, H*0.18, W*0.7);
    r.addColorStop(0, 'rgba(255,255,255,0.18)');
    r.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = r;
    ctx.fillRect(0,0,W,H);
  } else if(tpl === 'sunrise'){
    const g = ctx.createLinearGradient(0,0,W,H);
    g.addColorStop(0, '#fbbf24');
    g.addColorStop(1, '#fb923c');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);
    const r = ctx.createRadialGradient(W*0.78, H*0.22, 40, W*0.78, H*0.22, W*0.7);
    r.addColorStop(0, 'rgba(255,255,255,0.22)');
    r.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = r;
    ctx.fillRect(0,0,W,H);
  } else { // minimal
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,W,H);
    // Brand-cyan accent line bottom-left
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(VC_PAD, H - VC_PAD - 8, 90, 8);
  }

  // Decorative quote mark
  const quoteColor = (tpl === 'minimal') ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.18)';
  ctx.fillStyle = quoteColor;
  ctx.font = '900 280px "Bebas Neue", Inter, sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText('“', VC_PAD - 12, VC_PAD - 30);

  // Verse text
  const textColor = (tpl === 'minimal') ? '#0b1220'
                  : (tpl === 'sunrise') ? '#0b1220'
                  : '#ffffff';
  const refColor  = (tpl === 'minimal') ? '#38bdf8'
                  : (tpl === 'sunrise') ? '#7c2d12'
                  : 'rgba(255,255,255,0.9)';
  const wmColor   = (tpl === 'minimal') ? 'rgba(15,23,42,0.5)'
                  : (tpl === 'sunrise') ? 'rgba(11,18,32,0.55)'
                  : 'rgba(255,255,255,0.7)';

  ctx.fillStyle = textColor;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';

  const innerWidth  = W - (VC_PAD * 2);
  const refReserved = 130;       // space at bottom for ref + wordmark
  const verseTopY   = VC_PAD + 90;
  const verseMaxH   = H - verseTopY - VC_PAD - refReserved;

  const fitted = vcFitVerse(ctx, _vcText, innerWidth, verseMaxH,
                            '"Inter", system-ui, sans-serif', '600');
  ctx.font = '600 ' + fitted.fontSize + 'px "Inter", system-ui, sans-serif';

  // Vertical-centre the verse block within the available area.
  const verseBlockH = fitted.lines.length * fitted.lineHeight;
  let y = verseTopY + Math.max(0, (verseMaxH - verseBlockH) / 2);
  fitted.lines.forEach(function(ln){
    ctx.fillText(ln, VC_PAD, y);
    y += fitted.lineHeight;
  });

  // Reference (Bebas Neue display, smaller)
  ctx.fillStyle = refColor;
  ctx.font = '700 56px "Bebas Neue", Inter, sans-serif';
  ctx.textAlign = 'left';
  const refY = H - VC_PAD - 90;
  ctx.fillText('— ' + _vcRef, VC_PAD, refY);

  // Wordmark
  ctx.fillStyle = wmColor;
  ctx.font = '600 28px "Inter", system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('yourlifecc.com', W - VC_PAD, H - VC_PAD - 6);
}

function vcToBlob(){
  return new Promise(function(resolve, reject){
    const c = document.getElementById('verseCardCanvas');
    if(!c){ reject(new Error('Canvas not found')); return; }
    if(c.toBlob){
      c.toBlob(function(blob){
        if(!blob){ reject(new Error('Blob conversion failed')); return; }
        resolve(blob);
      }, 'image/png');
    } else {
      // Older Safari fallback: data URL → blob
      try {
        const url = c.toDataURL('image/png');
        const bin = atob(url.split(',')[1]);
        const arr = new Uint8Array(bin.length);
        for(let i=0;i<bin.length;i++) arr[i] = bin.charCodeAt(i);
        resolve(new Blob([arr], { type:'image/png' }));
      } catch(e){ reject(e); }
    }
  });
}

function vcDownload(){
  vcToBlob().then(function(blob){
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'yourlifecc-verse-' + (_vcRef || 'card').replace(/[^a-z0-9]+/gi,'-').toLowerCase() + '.png';
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 400);
    if(typeof logActivity === 'function') logActivity('faith', 'Downloaded verse card: ' + _vcRef);
    showToast('Verse card downloaded ✓');
  }).catch(function(){
    showToast('Could not generate image');
  });
}

function vcCopy(){
  if(!navigator.clipboard || typeof ClipboardItem === 'undefined' || !navigator.clipboard.write){
    // Fallback — copy plain text reference + verse so the click isn't a no-op.
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText('"' + _vcText + '" — ' + _vcRef + '\n\nyourlifecc.com')
        .then(function(){ showToast('Image copy not supported — text copied instead'); });
    } else {
      showToast('Copy not supported on this browser');
    }
    return;
  }
  vcToBlob().then(function(blob){
    return navigator.clipboard.write([ new ClipboardItem({ 'image/png': blob }) ]);
  }).then(function(){
    if(typeof logActivity === 'function') logActivity('faith', 'Copied verse card: ' + _vcRef);
    showToast('Image copied to clipboard ✓');
  }).catch(function(){
    // Some browsers block image-clipboard from non-user-activation contexts.
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText('"' + _vcText + '" — ' + _vcRef + '\n\nyourlifecc.com')
        .then(function(){ showToast('Image copy blocked — text copied instead'); });
    } else {
      showToast('Could not copy image');
    }
  });
}

// Web Share Level 2 — share the PNG directly to native share sheets.
function vcCanShareFiles(){
  if(!navigator.share || !navigator.canShare) return false;
  try {
    // Browsers without File constructor predate Web Share Level 2.
    if(typeof File === 'undefined') return false;
    const probe = new File(['x'], 'probe.png', { type:'image/png' });
    return navigator.canShare({ files: [probe] });
  } catch(e){ return false; }
}

function vcShare(){
  if(!vcCanShareFiles()){ vcDownload(); return; }
  vcToBlob().then(function(blob){
    const fname = 'yourlifecc-verse-' + (_vcRef || 'card').replace(/[^a-z0-9]+/gi,'-').toLowerCase() + '.png';
    const file = new File([blob], fname, { type:'image/png' });
    return navigator.share({
      files: [file],
      title: 'Verse of the Day',
      text:  '"' + _vcText + '" — ' + _vcRef + '\n\nyourlifecc.com',
    });
  }).then(function(){
    if(typeof logActivity === 'function') logActivity('faith', 'Shared verse card: ' + _vcRef);
  }).catch(function(){
    // User cancelled or share failed — silent. Don't toast on cancellation.
  });
}

// ═════════════════════════════════════════════════════════════
// F2-B — READING PLANS (catalog, progress, day completion)
// ═════════════════════════════════════════════════════════════
// Storage: D.faithPlans = { active: { [planId]: progress }, completed: [archive] }
//   progress     = { planId, currentDay, totalDays, completedDays:{}, startedAt }
//   archive      = { planId, totalDays, startedAt, completedAt, badgeIcon, title }
// Source of truth for plan content is window.FAITH_PLANS (from data/plans.js).
// Dedicated Supabase table is optional — see docs/migrations/F2-B-faith-plans.sql.

let _planCatFilter = 'all';

// Defensive accessor — guarantees the shape even if loaded from old cloud data
// where D.faithPlans wasn't yet in DEF.
function planStore(){
  if(!D.faithPlans || typeof D.faithPlans !== 'object') D.faithPlans = { active:{}, completed:[] };
  if(!D.faithPlans.active || typeof D.faithPlans.active !== 'object') D.faithPlans.active = {};
  if(!Array.isArray(D.faithPlans.completed)) D.faithPlans.completed = [];
  return D.faithPlans;
}

function planById(id){
  const all = (typeof window !== 'undefined' && window.FAITH_PLANS) ? window.FAITH_PLANS : [];
  return all.find(p => p && p.id === id) || null;
}

function planFilter(cat, btn){
  _planCatFilter = cat || 'all';
  document.querySelectorAll('#plFilters .pl-chip').forEach(c => c.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderPlanCatalog();
}

// ─── F6 redesign — Story-Mode-grade card palette per category ────
// Used by both the catalog grid and the day cards. Brand colors map
// to the gradient + accent the user picked for each category.
const PLAN_CAT_BRAND = {
  'topical':           { color:'#a78bfa', soft:'rgba(167,139,250,', name:'Violet' },
  'beginner':          { color:'#38bdf8', soft:'rgba(56,189,248,',  name:'Cyan'   },
  'through-the-bible': { color:'#fbbf24', soft:'rgba(251,191,36,',  name:'Amber'  },
  'family':            { color:'#22c55e', soft:'rgba(34,197,94,',   name:'Green'  },
  'life-topics':       { color:'#fbbf24', soft:'rgba(251,191,36,',  name:'Amber'  },
};
function _planBrand(p){ return PLAN_CAT_BRAND[p && p.category] || PLAN_CAT_BRAND.topical; }
function _planEsc(s){ if(typeof escapeHtml === 'function') return escapeHtml(String(s==null?'':s)); return String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
function _planParaHtml(text){
  if(!text) return '';
  return String(text).split(/\n\n+/).map(p => '<p style="margin:0 0 .7rem 0;">' + _planEsc(p.trim()) + '</p>').join('');
}

// ─── F6 redesign — Inline verse expand (no nav away) ─────────────
// Tap a ref button in a plan day → fetches ESV text once, caches in
// memory, and toggles the inline box open/closed. The plan modal
// stays put. No state lost.
const _planRefCache = {};
async function togglePlanRefInline(refId, ref){
  const box   = document.getElementById(refId + '-box');
  const caret = document.getElementById(refId + '-caret');
  if(!box) return;
  if(box.style.display === 'block'){
    box.style.display = 'none';
    if(caret) caret.textContent = '▸';
    return;
  }
  box.style.display = 'block';
  if(caret) caret.textContent = '▾';
  if(_planRefCache[ref]){
    box.innerHTML = _planRefBoxHtml(ref, _planRefCache[ref]);
    return;
  }
  box.innerHTML = '<div style="background:rgba(11,18,32,.55);border:1px solid rgba(254,243,199,.12);border-radius:10px;padding:.65rem .85rem;font-size:.72rem;color:rgba(254,243,199,.55);font-family:var(--fm);">⏳ Loading ' + _planEsc(ref) + '…</div>';
  try {
    const key = 'aaf4dd2ad7cb2e6aa19853ddd493136125afb18e';
    const url = 'https://api.esv.org/v3/passage/text/?q=' + encodeURIComponent(ref)
      + '&include-headings=false&include-footnotes=false&include-verse-numbers=true'
      + '&include-short-copyright=false&include-passage-references=false';
    const resp = await fetch(url, { headers: { 'Authorization': 'Token ' + key } });
    if(!resp.ok) throw new Error('ESV API ' + resp.status);
    const data = await resp.json();
    const text = (data.passages && data.passages[0]) || '';
    if(!text){ throw new Error('No passage text returned.'); }
    _planRefCache[ref] = text.trim();
    box.innerHTML = _planRefBoxHtml(ref, _planRefCache[ref]);
  } catch(err){
    box.innerHTML = '<div style="background:rgba(11,18,32,.55);border:1px solid rgba(248,113,113,.25);border-radius:10px;padding:.65rem .85rem;font-size:.72rem;color:#f87171;font-family:var(--fm);">❌ Could not load ' + _planEsc(ref) + '. <span style="color:rgba(254,243,199,.4);">' + _planEsc(err.message || '') + '</span></div>';
  }
}
function _planRefBoxHtml(ref, text){
  return '<div style="background:var(--cd-card-bg,rgba(11,18,32,.55));border:1px solid rgba(127,127,127,.18);border-radius:12px;padding:.85rem 1rem;font-family:Georgia,serif;font-size:.84rem;color:var(--tx);line-height:1.75;white-space:pre-wrap;">'
    +   _planEsc(text)
    +   '<div style="margin-top:.7rem;padding-top:.55rem;border-top:1px solid rgba(127,127,127,.16);font-size:.55rem;color:var(--tx3);font-style:italic;font-family:var(--fm);">Scripture from the ESV® Bible. © 2001 Crossway.</div>'
    + '</div>';
}

function renderPlanCatalog(){
  const all = (typeof window !== 'undefined' && window.FAITH_PLANS) ? window.FAITH_PLANS : [];
  const store = planStore();

  // Active-plans banner (only the single most-recently-started plan to keep it tight;
  // multiple-active rendering can come back later if users want it).
  const activeWrap = document.getElementById('plActive');
  if(activeWrap){
    const activeIds = Object.keys(store.active);
    if(!activeIds.length){
      activeWrap.innerHTML = '';
    } else {
      // Most-recent first.
      activeIds.sort((a,b) => (store.active[b].startedAt||'').localeCompare(store.active[a].startedAt||''));
      activeWrap.innerHTML = activeIds.map(id => {
        const prog = store.active[id];
        const plan = planById(id);
        if(!plan) return '';
        const brand = _planBrand(plan);
        const pct = Math.round(((prog.currentDay - 1) / prog.totalDays) * 100);
        return `<div class="pl-active-banner" style="background:linear-gradient(135deg,${brand.soft}0.16),${brand.soft}0.04));border:1px solid ${brand.soft}0.32);">
          <div style="font-size:1.5rem;flex-shrink:0;">${plan.badgeIcon}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-family:'Bebas Neue',var(--fm);letter-spacing:.06em;font-size:1.05rem;color:var(--tx);line-height:1.1;">${_planEsc(plan.title)}</div>
            <div class="pl-active-bar" style="background:rgba(127,127,127,.18);"><div class="pl-active-bar-fill" style="width:${pct}%;background:${brand.color};"></div></div>
            <div style="font-size:.66rem;font-weight:700;color:var(--tx2);">Day ${prog.currentDay} of ${prog.totalDays} · ${pct}%</div>
          </div>
          <button onclick="openPlanDetail('${id}')" style="background:${brand.color};color:#0b1220;border:none;border-radius:10px;padding:.55rem .95rem;font-size:.74rem;font-weight:800;cursor:pointer;font-family:var(--fm);flex-shrink:0;">Resume →</button>
        </div>`;
      }).join('');
    }
  }

  // Catalog grid
  const el = document.getElementById('plCatalog');
  if(!el) return;
  let plans = all.slice();
  if(_planCatFilter !== 'all') plans = plans.filter(p => p.category === _planCatFilter);
  // F10: dynamic header reflects current filter + total count (was static
  // copy: "All plans (8 to start · 16 more in F2 follow-ups)").
  const hdr = document.getElementById('plCatalogHdr');
  if(hdr){
    const catLabel = _planCatFilter === 'all' ? 'All Plans' : (typeof planCategoryLabel === 'function' ? planCategoryLabel(_planCatFilter) + ' Plans' : 'Plans');
    hdr.textContent = catLabel + ' (' + plans.length + ' of ' + all.length + ')';
  }
  if(!plans.length){
    el.innerHTML = `<div class="pl-empty">No plans match this filter yet.</div>`;
    return;
  }
  el.innerHTML = plans.map(p => {
    const brand = _planBrand(p);
    const progActive  = store.active[p.id];
    const isActive    = !!progActive;
    const isCompleted = store.completed.some(c => c && c.planId === p.id);
    // Completed-day count for the progress bar — active plans count via
    // completedDays; archived plans are 100%; never-started are 0.
    const doneCount = progActive
      ? Object.keys(progActive.completedDays || {}).length
      : (isCompleted ? p.days : 0);
    const pct = Math.round((doneCount / p.days) * 100);

    const statusBit = isActive
      ? `<span style="color:var(--tx3);">·</span><span style="color:var(--tx);">Day ${progActive.currentDay} of ${p.days}</span>`
      : isCompleted
        ? `<span style="color:var(--tx3);">·</span><span style="color:#22c55e;">✓ Done</span>`
        : '';
    const cta = isActive ? 'Resume →' : isCompleted ? 'Re-read →' : 'Start →';

    // Progress strip — only rendered when there is something to show.
    const progressStrip = doneCount > 0
      ? '<div style="margin-top:.55rem;height:5px;border-radius:99px;background:rgba(127,127,127,.22);overflow:hidden;">'
        +   '<div style="height:100%;width:' + pct + '%;background:' + brand.color + ';transition:width .35s ease;border-radius:99px;"></div>'
        + '</div>'
        + '<div style="margin-top:.3rem;font-size:.58rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--tx3);">'
        +   doneCount + ' / ' + p.days + ' days complete · ' + pct + '%'
        + '</div>'
      : '';

    return ''
      + '<button class="pl-card-v2" data-plan-id="' + _planEsc(p.id) + '" onclick="openPlanDetail(this.dataset.planId)" '
      +   'style="--accent:' + brand.color + ';">'
      + '<div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.5rem;">'
      +   '<span style="font-size:1.7rem;line-height:1;">' + _planEsc(p.badgeIcon || '📖') + '</span>'
      +   '<div style="font-family:\'Bebas Neue\',var(--fm);letter-spacing:.06em;font-size:1.18rem;color:var(--tx);line-height:1.05;flex:1;min-width:0;">' + _planEsc(p.title) + '</div>'
      +   '<span style="font-size:.56rem;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:' + brand.color + ';background:' + brand.soft + '0.18);border:1px solid ' + brand.soft + '0.35);padding:.18rem .55rem;border-radius:99px;white-space:nowrap;">' + _planEsc(planCategoryLabel(p.category)) + '</span>'
      + '</div>'
      + '<div style="font-family:Georgia,serif;font-style:italic;font-size:.78rem;color:var(--tx2);line-height:1.55;margin-bottom:.7rem;">' + _planEsc(p.short) + '</div>'
      + '<div style="display:flex;align-items:center;gap:.45rem;font-size:.6rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:' + brand.color + ';">'
      +   '<span>' + p.days + ' days</span>'
      +   statusBit
      +   '<span style="margin-left:auto;color:var(--tx);">' + cta + '</span>'
      + '</div>'
      + progressStrip
      + '</button>';
  }).join('');
}

function planCategoryLabel(cat){
  return ({
    'topical':'Topical',
    'beginner':'Beginner',
    'through-the-bible':'Through Bible',
    'family':'Family',
  })[cat] || cat;
}

// ─── F6 redesign — Per-day card (enriched schema + fallback) ─────
// Renders a single plan-day card. Recognizes the enriched fields
// (dayTitle, keyVerse, devotional, prayerStarter) and falls back
// gracefully when only the legacy {refs, prompt} are present.
function _planDayHtml(p, d, prog, completedArchive, todayDay){
  const brand = _planBrand(p);
  const completed = !!(prog && prog.completedDays && prog.completedDays[d.day]) || (!!completedArchive);
  const isToday   = !!prog && d.day === todayDay && !completed;
  const dayBg  = completed ? 'rgba(34,197,94,.06)' : isToday ? brand.soft + '0.08)' : 'rgba(127,127,127,.04)';
  const dayBdr = completed ? 'rgba(34,197,94,.32)' : isToday ? brand.color : brand.soft + '0.18)';
  const isEnriched = !!(d.dayTitle || d.devotional || d.keyVerse || d.prayerStarter);

  const dayBadge = '<span style="font-family:\'Bebas Neue\',var(--fm);font-size:.7rem;font-weight:800;background:' + (completed?'#22c55e':brand.color) + ';color:#0b1220;border-radius:99px;padding:.22rem .7rem;letter-spacing:.12em;">DAY ' + d.day + '</span>';
  const readMark = completed ? '<span style="font-size:.62rem;color:#22c55e;font-weight:800;letter-spacing:.1em;">✓ READ</span>' : '';
  const todayMark = isToday ? '<span style="font-size:.55rem;color:#0b1220;background:' + brand.color + ';font-weight:800;border-radius:4px;padding:.15rem .45rem;letter-spacing:.1em;">TODAY</span>' : '';
  const headerHtml = '<div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.65rem;">' + dayBadge + readMark + todayMark + '</div>';

  const dayTitleHtml = d.dayTitle
    ? '<div style="font-family:\'Bebas Neue\',var(--fm);letter-spacing:.05em;font-size:1.35rem;color:var(--tx);line-height:1.08;margin-bottom:.7rem;">' + _planEsc(d.dayTitle) + '</div>'
    : '';

  const keyVerseHtml = (d.keyVerse && d.keyVerse.text)
    ? '<div style="background:' + brand.soft + '0.08);border-left:3px solid ' + brand.color + ';border-radius:0 10px 10px 0;padding:.75rem .95rem;margin-bottom:.85rem;">'
        + '<div style="font-family:Georgia,serif;font-style:italic;font-size:.92rem;color:var(--tx);line-height:1.6;">' + _planEsc(d.keyVerse.text) + '</div>'
        + '<div style="margin-top:.4rem;font-family:\'Bebas Neue\',var(--fm);font-size:.7rem;font-weight:800;letter-spacing:.14em;color:' + brand.color + ';">— ' + _planEsc(d.keyVerse.ref || '') + '</div>'
      + '</div>'
    : '';

  const devotionalHtml = d.devotional
    ? '<div style="font-family:\'Bebas Neue\',var(--fm);font-size:.7rem;font-weight:800;letter-spacing:.18em;color:' + brand.color + ';margin-bottom:.45rem;">DEVOTIONAL</div>'
      + '<div style="font-family:Georgia,serif;font-size:.85rem;color:var(--tx);line-height:1.7;margin-bottom:.95rem;opacity:.92;">' + _planParaHtml(d.devotional) + '</div>'
    : '';

  const refsLabel = (d.devotional || d.keyVerse) ? 'ALSO READ' : "TODAY'S READING";
  const refsHtml = (d.refs && d.refs.length)
    ? '<div style="font-family:\'Bebas Neue\',var(--fm);font-size:.7rem;font-weight:800;letter-spacing:.18em;color:var(--tx3);margin-bottom:.45rem;">' + refsLabel + '</div>'
      + '<div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.85rem;">'
        + d.refs.map(function(r, i){
            const refId = 'planRef-' + p.id + '-d' + d.day + '-r' + i;
            const refJson = JSON.stringify(r).replace(/"/g,'&quot;');
            return '<button onclick="togglePlanRefInline(\'' + refId + '\', ' + refJson + ')" style="background:' + brand.soft + '0.12);border:1px solid ' + brand.soft + '0.32);color:var(--tx);border-radius:8px;padding:.35rem .7rem;font-size:.72rem;font-weight:700;cursor:pointer;font-family:var(--fm);">'
              + '📖 ' + _planEsc(r) + ' <span id="' + refId + '-caret" style="margin-left:.25rem;font-size:.6rem;opacity:.75;">▸</span>'
              + '</button>'
              + '<div id="' + refId + '-box" style="display:none;width:100%;margin-bottom:.4rem;"></div>';
          }).join('')
      + '</div>'
    : '';

  const promptHtml = d.prompt
    ? '<div style="font-family:\'Bebas Neue\',var(--fm);font-size:.7rem;font-weight:800;letter-spacing:.18em;color:' + brand.color + ';margin-bottom:.45rem;">REFLECT</div>'
      + '<div style="font-family:Georgia,serif;font-style:italic;font-size:.82rem;color:var(--tx2);line-height:1.65;margin-bottom:.95rem;">' + _planEsc(d.prompt) + '</div>'
    : '';

  const prayerHtml = d.prayerStarter
    ? '<div style="font-family:\'Bebas Neue\',var(--fm);font-size:.7rem;font-weight:800;letter-spacing:.18em;color:' + brand.color + ';margin-bottom:.45rem;">A PRAYER TO BEGIN</div>'
      + '<div style="background:' + brand.soft + '0.06);border:1px solid ' + brand.soft + '0.22);border-radius:10px;padding:.7rem .9rem;font-family:Georgia,serif;font-style:italic;font-size:.82rem;color:var(--tx);line-height:1.65;">' + _planEsc(d.prayerStarter) + '</div>'
    : '';

  // Completion toggle — always rendered. Styling + label change with state.
  // Completed state shows green "✓ COMPLETED · TAP TO UNDO". Untapped shows
  // the brand-gradient "MARK DAY N COMPLETE +10 XP". Same onclick =>
  // planMarkDayDone which now toggles either direction.
  const completeBtn = completed
    ? '<button onclick="planMarkDayDone(\'' + p.id + '\',' + d.day + ')" '
      + 'style="background:#22c55e;color:#fff;border:none;border-radius:12px;padding:.65rem 1.1rem;'
      + 'font-family:\'Bebas Neue\',var(--fm);font-size:.95rem;font-weight:800;letter-spacing:.08em;'
      + 'cursor:pointer;margin-top:1rem;display:block;width:100%;box-shadow:0 4px 14px rgba(34,197,94,.28);">'
      + '✓ COMPLETED · TAP TO UNDO</button>'
    : '<button onclick="planMarkDayDone(\'' + p.id + '\',' + d.day + ')" '
      + 'style="background:linear-gradient(135deg,' + brand.color + ',#fef3c7);color:#0b1220;border:none;'
      + 'border-radius:12px;padding:.65rem 1.1rem;font-family:\'Bebas Neue\',var(--fm);font-size:.95rem;'
      + 'font-weight:800;letter-spacing:.08em;cursor:pointer;margin-top:1rem;display:block;width:100%;">'
      + '✅ MARK DAY ' + d.day + ' COMPLETE  +10 XP</button>';

  // Padding scales with whether the day is rich or minimal so legacy
  // days still feel intentional, not anaemic.
  const pad = isEnriched ? '1.05rem 1.15rem' : '.85rem 1rem';
  return '<div style="background:' + dayBg + ';border:1px solid ' + dayBdr + ';border-radius:16px;padding:' + pad + ';box-shadow:0 2px 10px rgba(0,0,0,.08);">'
    + headerHtml + dayTitleHtml + keyVerseHtml + devotionalHtml + refsHtml + promptHtml + prayerHtml + completeBtn
    + '</div>';
}

function openPlanDetail(planId){
  const p = planById(planId);
  if(!p){ showToast('Plan not found'); return; }
  const store = planStore();
  const prog = store.active[planId];
  const completedArchive = store.completed.find(c => c && c.planId === planId);
  const brand = _planBrand(p);

  const headerEl = document.getElementById('planDetailHeader');
  if(headerEl) headerEl.style.background = 'linear-gradient(135deg,' + brand.color + ',#fef3c7)';
  document.getElementById('planDetailIcon').textContent = p.badgeIcon;
  document.getElementById('planDetailTitle').textContent = p.title;
  document.getElementById('planDetailShort').textContent = p.short;

  const body = document.getElementById('planDetailBody');
  const todayDay = prog ? prog.currentDay : 1;
  // F4-H — Mini-map for plans tied to a Bible Lands route. Renders the
  // polyline + a marker at progress = (currentDay-1) / totalDays.
  const routeMapHtml = (p.routeId && (typeof window !== 'undefined' && window.BIBLICAL_ROUTES))
    ? `<div id="planMiniMap" style="height:200px;border-radius:14px;overflow:hidden;margin-bottom:.85rem;border:1px solid rgba(167,139,250,.25);box-shadow:0 8px 24px rgba(15,23,42,.25);background:#0d1117;"></div>`
    : '';
  body.innerHTML = ''
    + routeMapHtml
    + '<div style="font-family:\'Bebas Neue\',var(--fm);font-size:.72rem;color:' + brand.color + ';text-transform:uppercase;letter-spacing:.2em;font-weight:800;margin-bottom:.65rem;">'
    +   _planEsc(planCategoryLabel(p.category)) + ' <span style="color:var(--tx3);">·</span> ' + p.days + ' days <span style="color:var(--tx3);">·</span> <span style="color:var(--tx2);">' + (p.audience === 'all' ? 'For everyone' : _planEsc(p.audience)) + '</span>'
    + '</div>'
    + '<div style="display:flex;flex-direction:column;gap:.55rem;">'
    +   p.daysData.map(function(d){ return _planDayHtml(p, d, prog, completedArchive, todayDay); }).join('')
    + '</div>';

  const footer = document.getElementById('planDetailFooter');
  if(prog){
    footer.innerHTML = `
      <button onclick="planQuit('${planId}')" style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#f87171;border-radius:10px;padding:.55rem .9rem;font-size:.74rem;font-weight:700;cursor:pointer;font-family:var(--fm);">Quit Plan</button>
      <button onclick="closePlanDetail()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:var(--tx);border-radius:10px;padding:.55rem .9rem;font-size:.74rem;font-weight:700;cursor:pointer;font-family:var(--fm);">Close</button>
    `;
  } else if(completedArchive){
    footer.innerHTML = `
      <button onclick="planStart('${planId}')" style="background:linear-gradient(135deg,#38bdf8,${p.brandColor});color:#0b1220;border:none;border-radius:10px;padding:.55rem .9rem;font-size:.78rem;font-weight:800;cursor:pointer;font-family:var(--fm);">Re-read from Day 1</button>
      <button onclick="closePlanDetail()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:var(--tx);border-radius:10px;padding:.55rem .9rem;font-size:.74rem;font-weight:700;cursor:pointer;font-family:var(--fm);">Close</button>
    `;
  } else {
    footer.innerHTML = `
      <button onclick="closePlanDetail()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:var(--tx);border-radius:10px;padding:.55rem .9rem;font-size:.74rem;font-weight:700;cursor:pointer;font-family:var(--fm);">Close</button>
      <button onclick="planStart('${planId}')" style="background:linear-gradient(135deg,#38bdf8,${p.brandColor});color:#0b1220;border:none;border-radius:10px;padding:.55rem .9rem;font-size:.78rem;font-weight:800;cursor:pointer;font-family:var(--fm);">Start ${p.days}-Day Plan →</button>
    `;
  }
  if(typeof openModal === 'function') openModal('planDetailModal');
  // F4-H — Init mini-map after modal is mounted so Leaflet sees real dimensions.
  if(p.routeId){
    setTimeout(function(){ _planMiniMapInit(p, prog); }, 80);
  }
}

// F4-H — Render route + progress marker in the plan detail mini-map.
let _planMiniMap = null;
function _planMiniMapInit(plan, prog){
  if(typeof L === 'undefined'){ setTimeout(() => _planMiniMapInit(plan, prog), 250); return; }
  const el = document.getElementById('planMiniMap');
  if(!el) return;
  const route = (window.BIBLICAL_ROUTES || []).find(r => r && r.id === plan.routeId);
  if(!route) return;
  // Resolve waypoints to lat/lng (sites + intermediate).
  const points = [];
  (route.waypoints || []).forEach(w => {
    if(typeof w.lat === 'number' && typeof w.lng === 'number'){
      points.push({ lat: w.lat, lng: w.lng, label: w.label });
    } else if(w.siteId){
      const s = (window.BIBLICAL_SITES || []).find(x => x && x.id === w.siteId);
      if(s) points.push({ lat: s.lat, lng: s.lng, label: w.label || s.name });
    }
  });
  if(points.length < 2) return;

  // Tear down any prior instance bound to a stale element.
  if(_planMiniMap){ try { _planMiniMap.remove(); } catch(_){} _planMiniMap = null; }

  _planMiniMap = L.map(el, {
    zoomControl: false, attributionControl: false,
    scrollWheelZoom: false, doubleClickZoom: false,
    dragging: true, touchZoom: false,
  });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 18, subdomains: 'abcd',
  }).addTo(_planMiniMap);

  // Route polyline (full path, slightly faded so the marker pops).
  const latlngs = points.map(p => [p.lat, p.lng]);
  const poly = L.polyline(latlngs, {
    color: route.color || plan.brandColor || '#a78bfa',
    weight: 4, opacity: .55, lineJoin: 'round', lineCap: 'round',
  }).addTo(_planMiniMap);

  // Soft pulse-ring waypoint dots — small, brand-tinted.
  points.forEach((pt, idx) => {
    const last = idx === points.length - 1;
    L.circleMarker([pt.lat, pt.lng], {
      radius: last ? 6 : 4,
      color: '#fff',
      weight: 2,
      fillColor: route.color || plan.brandColor || '#a78bfa',
      fillOpacity: .95,
    }).addTo(_planMiniMap).bindTooltip(pt.label || '', { direction: 'top', offset:[0,-6] });
  });

  // Progress marker — walking figure / ship / pin emoji at progress fraction.
  const totalDays = plan.days;
  const dayDone = prog ? Math.max(0, prog.currentDay - 1) : 0;
  const progFrac = Math.min(1, totalDays > 0 ? dayDone / totalDays : 0);
  const markerLatLng = _interpAlongPath(points, progFrac);
  const completed = (dayDone >= totalDays);
  const emoji = plan.markerEmoji || '📍';
  const ringColor = route.color || plan.brandColor || '#a78bfa';
  const markerIcon = L.divIcon({
    className: 'plan-mini-marker',
    html: '<div style="position:relative;width:42px;height:42px;display:flex;align-items:center;justify-content:center;">' +
            '<div style="position:absolute;inset:0;border-radius:50%;background:' + ringColor + ';opacity:.35;animation:planMarkerPulse 1.8s ease-in-out infinite;"></div>' +
            '<div style="position:relative;width:34px;height:34px;border-radius:50%;background:#0a0d1a;border:2.5px solid ' + ringColor + ';display:flex;align-items:center;justify-content:center;font-size:1.1rem;box-shadow:0 4px 12px rgba(0,0,0,.45),0 0 18px ' + ringColor + ';">' + (completed ? '🏆' : emoji) + '</div>' +
          '</div>',
    iconSize: [42,42], iconAnchor: [21,21],
  });
  L.marker(markerLatLng, { icon: markerIcon, zIndexOffset: 1000 }).addTo(_planMiniMap);

  // Fit bounds, then zoom in just slightly so the marker is the focus.
  _planMiniMap.fitBounds(poly.getBounds(), { padding: [22, 22] });
}

// Interpolate a point at fractional progress (0-1) along a polyline of latlng points.
// Uses straight-line distances between successive waypoints.
function _interpAlongPath(points, frac){
  if(!points.length) return [0,0];
  if(frac <= 0) return [points[0].lat, points[0].lng];
  if(frac >= 1) return [points[points.length-1].lat, points[points.length-1].lng];
  // Compute cumulative distances.
  const dists = [0];
  let total = 0;
  for(let i = 1; i < points.length; i++){
    const dx = points[i].lat - points[i-1].lat;
    const dy = points[i].lng - points[i-1].lng;
    const d = Math.sqrt(dx*dx + dy*dy);
    total += d;
    dists.push(total);
  }
  const target = total * frac;
  for(let i = 1; i < points.length; i++){
    if(dists[i] >= target){
      const segFrac = (target - dists[i-1]) / (dists[i] - dists[i-1]);
      const lat = points[i-1].lat + (points[i].lat - points[i-1].lat) * segFrac;
      const lng = points[i-1].lng + (points[i].lng - points[i-1].lng) * segFrac;
      return [lat, lng];
    }
  }
  return [points[points.length-1].lat, points[points.length-1].lng];
}

function closePlanDetail(){
  if(typeof closeModal === 'function') closeModal('planDetailModal');
  // F4-H — Tear down the mini-map so it doesn't leak Leaflet instances
  // across plan-modal opens.
  if(_planMiniMap){ try { _planMiniMap.remove(); } catch(_){} _planMiniMap = null; }
}

function planStart(planId){
  const p = planById(planId);
  if(!p){ showToast('Plan not found'); return; }
  const store = planStore();
  // If a previous archive exists for this plan, drop it so re-read starts fresh.
  store.completed = store.completed.filter(c => !c || c.planId !== planId);
  store.active[planId] = {
    planId,
    currentDay: 1,
    totalDays: p.days,
    completedDays: {},
    startedAt: new Date().toISOString(),
  };
  save();
  if(typeof logActivity === 'function') logActivity('faith', 'Started plan: ' + p.title);
  showToast(p.badgeIcon + ' Plan started! Day 1 ready.');
  openPlanDetail(planId); // refresh modal so DAY 1 shows TODAY tag + Mark Done CTA
  renderPlanCatalog();
  if(typeof renderFaithHome === 'function') renderFaithHome();
}

// Toggle a plan day between complete / incomplete. Same function name +
// signature so the line-5732 confetti wrapper and every existing inline
// onclick caller (rendered HTML) keep working without changes.
//
// Behavior:
//   1. Auto-starts the plan on first click if it's not already active.
//   2. If the plan is in store.completed and a day gets un-marked, the
//      plan is restored to store.active so progress can keep adjusting.
//   3. Recomputes currentDay = lowest un-completed day after each toggle.
//   4. +10 XP on mark, -10 on unmark (floored at 0). Streak read-day
//      stamp is set on mark only — once today counts, leave it.
function planMarkDayDone(planId, dayNum){
  const p = planById(planId);
  if(!p) return;
  const store = planStore();

  // Restore archived completion if user is un-marking a day on a finished plan.
  const archiveIdx = store.completed.findIndex(c => c && c.planId === planId);
  if(archiveIdx >= 0 && !store.active[planId]){
    const archived = store.completed[archiveIdx];
    const completedDays = {};
    const stamp = archived.completedAt || new Date().toISOString();
    for(let i = 1; i <= p.days; i++) completedDays[i] = stamp;
    store.active[planId] = {
      planId,
      currentDay: p.days + 1,
      totalDays: p.days,
      completedDays,
      startedAt: archived.startedAt || stamp,
    };
    store.completed.splice(archiveIdx, 1);
  }

  // Auto-start the plan on first day-toggle click if no active record exists.
  if(!store.active[planId]){
    store.active[planId] = {
      planId,
      currentDay: 1,
      totalDays: p.days,
      completedDays: {},
      startedAt: new Date().toISOString(),
    };
    if(typeof logActivity === 'function') logActivity('faith', 'Started plan: ' + p.title);
  }

  const prog = store.active[planId];
  if(!prog.completedDays) prog.completedDays = {};
  const wasCompleted = !!prog.completedDays[dayNum];

  if(wasCompleted){
    // ── Toggle OFF ──
    delete prog.completedDays[dayNum];
    D.scrPoints = Math.max(0, (D.scrPoints || 0) - 10);
    // Recompute currentDay = lowest un-completed day.
    let nextDay = 1;
    while(nextDay <= prog.totalDays && prog.completedDays[nextDay]) nextDay++;
    prog.currentDay = nextDay;
    save();
    showToast('Day ' + dayNum + ' un-marked (-10 XP)');
    if(typeof logActivity === 'function') logActivity('faith', p.title + ' · Day ' + dayNum + ' un-marked');
    openPlanDetail(planId);
    renderPlanCatalog();
    if(typeof renderFaithHome === 'function') renderFaithHome();
    if(typeof renderScrStats === 'function') renderScrStats();
    return;
  }

  // ── Toggle ON ──
  prog.completedDays[dayNum] = new Date().toISOString();
  D.scrPoints = (D.scrPoints || 0) + 10;
  if(!D.scrReadDays) D.scrReadDays = {};
  D.scrReadDays[new Date().toISOString().slice(0,10)] = true;

  // Recompute currentDay = lowest un-completed day.
  let nextDay = 1;
  while(nextDay <= prog.totalDays && prog.completedDays[nextDay]) nextDay++;
  prog.currentDay = nextDay;

  // Plan complete? (every day marked done)
  if(prog.currentDay > prog.totalDays){
    store.completed.push({
      planId,
      title: p.title,
      badgeIcon: p.badgeIcon,
      totalDays: prog.totalDays,
      startedAt: prog.startedAt,
      completedAt: new Date().toISOString(),
    });
    delete store.active[planId];
    D.scrPoints = (D.scrPoints || 0) + 50; // Completion bonus
    showToast(p.badgeIcon + ' Plan complete! +50 XP badge earned 🏆');
    if(typeof logActivity === 'function') logActivity('faith', 'Completed plan: ' + p.title);
    save();
    closePlanDetail();
    renderPlanCatalog();
    if(typeof renderFaithHome === 'function') renderFaithHome();
    if(typeof renderScrStats === 'function') renderScrStats();
    return;
  }

  save();
  showToast('Day ' + dayNum + ' complete! +10 XP 🙌');
  if(typeof logActivity === 'function') logActivity('faith', p.title + ' · Day ' + dayNum + ' done');
  openPlanDetail(planId);
  renderPlanCatalog();
  if(typeof renderFaithHome === 'function') renderFaithHome();
  if(typeof renderScrStats === 'function') renderScrStats();
}

function planQuit(planId){
  const p = planById(planId);
  if(!p) return;
  if(!confirm('Quit "' + p.title + '"? Your progress on this plan will be cleared.')) return;
  const store = planStore();
  delete store.active[planId];
  save();
  closePlanDetail();
  renderPlanCatalog();
  if(typeof renderFaithHome === 'function') renderFaithHome();
  showToast('Plan removed');
}

// Open the Bible reader at a given verse reference. Reuses the existing ESV
// reader path — same parsing as fhOpenContext but takes the ref as an arg.
function planJumpToVerse(ref){
  const m = String(ref).match(/^(\d?\s?[A-Za-z][A-Za-z ]+?)\s+(\d+)/);
  if(!m){ bfTab('bible'); return; }
  const book = m[1].trim(); const ch = m[2];
  closePlanDetail();
  bfTab('bible');
  setTimeout(function(){
    const sel = document.getElementById('esvBook');
    if(sel){
      const opt = Array.from(sel.options).find(o => o.value && o.value.toLowerCase() === book.toLowerCase());
      if(opt){ sel.value = opt.value; if(typeof onEsvBookChange === 'function') onEsvBookChange(); }
    }
    const chSel = document.getElementById('esvChapter');
    if(chSel) chSel.value = ch;
    if(typeof openEsvReader === 'function') openEsvReader();
  }, 60);
}

// Used by Faith Home Card 3 — returns the most-recent active plan or null.
function fhActivePlan(){
  const store = planStore();
  const ids = Object.keys(store.active);
  if(!ids.length) return null;
  ids.sort((a,b) => (store.active[b].startedAt||'').localeCompare(store.active[a].startedAt||''));
  const prog = store.active[ids[0]];
  const plan = planById(prog.planId);
  if(!plan) return null;
  return { plan, prog };
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

let _esvGridFilter = 'all';

function jumpToTestament(t){
  _esvGridFilter = t;
  const otBtn  = document.getElementById('esvOtBtn');
  const ntBtn  = document.getElementById('esvNtBtn');
  const allBtn = document.getElementById('esvAllBtn');
  if(otBtn)  otBtn.style.opacity  = t==='OT'  ? '1' : '.45';
  if(ntBtn)  ntBtn.style.opacity  = t==='NT'  ? '1' : '.45';
  if(allBtn) allBtn.style.opacity = t==='all' ? '1' : '.45';
  renderEsvBookGrid();
}

function renderEsvBookGrid(){
  const el = document.getElementById('esvBookGrid'); if(!el) return;
  const ntSet = new Set(ESV_BOOK_SECTIONS.NT);
  let books;
  if(_esvGridFilter === 'OT')      books = ESV_BOOK_SECTIONS.OT;
  else if(_esvGridFilter === 'NT') books = ESV_BOOK_SECTIONS.NT;
  else                              books = [...ESV_BOOK_SECTIONS.OT, ...ESV_BOOK_SECTIONS.NT];

  el.innerHTML = books.map(name=>{
    const isNT = ntSet.has(name);
    const icon = ESV_ICONS[name]||'📖';
    const book = BIBLE_BOOKS.find(b=>b.name===name);
    const ch = book ? book.ch : 1;
    const borderColor = isNT ? 'rgba(56,189,248,.25)'  : 'rgba(167,139,250,.25)';
    const badgeBg     = isNT ? 'rgba(56,189,248,.12)'  : 'rgba(167,139,250,.12)';
    const badgeColor  = isNT ? '#38bdf8' : '#a78bfa';
    return `<div onclick="quickOpenEsvBook('${name.replace(/'/g,"\\'")}',${ch})" style="background:rgba(255,255,255,.04);border:1px solid ${borderColor};border-radius:14px;padding:.85rem 1rem;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:.65rem;" onmouseenter="this.style.background='rgba(255,255,255,.08)';this.style.transform='translateY(-2px)'" onmouseleave="this.style.background='rgba(255,255,255,.04)';this.style.transform=''">
      <span style="font-size:1.5rem;flex-shrink:0;">${icon}</span>
      <div style="flex:1;min-width:0;">
        <div style="font-size:.82rem;font-weight:800;color:var(--tx);line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</div>
        <div style="display:flex;align-items:center;gap:.3rem;margin-top:.25rem;">
          <span style="font-size:.64rem;color:var(--tx2);">${ch} chapters</span>
          <span style="font-size:.6rem;font-weight:700;background:${badgeBg};color:${badgeColor};border-radius:4px;padding:.05rem .35rem;">${isNT?'NT':'OT'}</span>
        </div>
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

// Track the active chapter so the verse-tap menu and annotation lookups know
// the context after a fetch completes.
let _esvCurrentBook = '';
let _esvCurrentChapter = 0;
let _esvSelectedVerse = 0;

async function openEsvReader(){
  const book = (document.getElementById('esvBook')||{}).value;
  const ch = (document.getElementById('esvChapter')||{}).value || '1';
  if(!book){ showToast('Please select a book first'); return; }
  const key = 'aaf4dd2ad7cb2e6aa19853ddd493136125afb18e';

  const icon = ESV_ICONS[book]||'📖';
  const bookData = BIBLE_BOOKS.find(b=>b.name===book);
  const totalCh = bookData ? bookData.ch : 1;
  const chNum = parseInt(ch,10);

  _esvCurrentBook    = book;
  _esvCurrentChapter = chNum;
  _esvSelectedVerse  = 0;

  // Use charModal (same modal devotionals use). F2-D switches the header to
  // brand palette — replaces the leftover #667eea/#764ba2 KC gradient.
  document.getElementById('charIcon').textContent = icon;
  document.getElementById('charTitle').textContent = book;
  document.getElementById('charSub').textContent = 'Chapter '+chNum+' · English Standard Version (ESV)';
  // F9: gold register inside Well — was var(--cd-banner) purple
  document.getElementById('charModalHeader').style.background = 'radial-gradient(ellipse at top, rgba(251,191,36,.18), transparent 60%)';
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

    // Navigation arrows + chapter jump dropdown (brand-palette gradient)
    const prevDisabled = chNum<=1;
    const nextDisabled = chNum>=totalCh;
    const chapterOpts = Array.from({length:totalCh},(_,i)=>`<option value="${i+1}" ${i+1===chNum?'selected':''}>Chapter ${i+1}</option>`).join('');
    const navHtml = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem;gap:.5rem;">
      <button onclick="navigateEsvChapter('${book.replace(/'/g,"\\'")}',${chNum-1},${totalCh})" ${prevDisabled?'disabled style="opacity:.3;cursor:not-allowed;"':''} style="background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.28);color:#38bdf8;border-radius:8px;padding:.4rem .8rem;font-size:.75rem;font-weight:700;cursor:pointer;">‹ Prev</button>
      <select onchange="navigateEsvChapter('${book.replace(/'/g,"\\'")}',parseInt(this.value),${totalCh})" style="flex:1;margin:0 .4rem;padding:.3rem .5rem;border-radius:8px;background:rgba(56,189,248,.08);border:1px solid rgba(56,189,248,.2);color:var(--tx);font-size:.75rem;text-align:center;">
        ${chapterOpts}
      </select>
      <button onclick="navigateEsvChapter('${book.replace(/'/g,"\\'")}',${chNum+1},${totalCh})" ${nextDisabled?'disabled style="opacity:.3;cursor:not-allowed;"':''} style="background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.3);color:#a78bfa;border-radius:8px;padding:.4rem .8rem;font-size:.75rem;font-weight:700;cursor:pointer;">Next ›</button>
    </div>
    <div style="display:flex;gap:.4rem;margin-bottom:.6rem;flex-wrap:wrap;">
      <button onclick="esvListenChapter('${book.replace(/'/g,"\\'")}',${chNum})" style="background:rgba(56,189,248,.08);border:1px solid rgba(56,189,248,.2);color:#38bdf8;border-radius:8px;padding:.35rem .7rem;font-size:.7rem;font-weight:700;cursor:pointer;font-family:var(--fm);">🎧 Listen</button>
      <button onclick="openReaderSettings()" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);color:var(--tx2);border-radius:8px;padding:.35rem .7rem;font-size:.7rem;font-weight:700;cursor:pointer;font-family:var(--fm);">⚙️ Settings</button>
      <span style="margin-left:auto;font-size:.6rem;color:var(--tx3);font-weight:700;align-self:center;">Tap any verse to highlight, note, share</span>
    </div>`;

    // F2-D: process passage into verse spans, then apply annotations + place-tags.
    const passageHtml = renderEsvPassage(text, book, chNum);

    const settings = (D && D.faithReaderSettings) || { fontSize:'medium', lineHeight:'normal', fontFamily:'serif' };
    const fontSize   = settings.fontSize === 'small' ? '.82rem' : settings.fontSize === 'large' ? '1.05rem' : '.95rem';
    const lineHeight = settings.lineHeight === 'compact' ? '1.7' : settings.lineHeight === 'relaxed' ? '2.2' : '2';
    const fontFamily = settings.fontFamily === 'sans'
      ? "'Inter', system-ui, sans-serif"
      : "'Georgia','Times New Roman',serif";

    document.getElementById('charBody').innerHTML = navHtml +
      `<div id="esvPassageText" style="font-family:${fontFamily};font-size:${fontSize};line-height:${lineHeight};color:var(--tx);white-space:pre-wrap;">${passageHtml}</div>
      <div style="margin-top:1.2rem;padding-top:.8rem;border-top:1px solid rgba(255,255,255,.06);font-size:.58rem;color:var(--tx3);line-height:1.6;">
        Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.
      </div>`;

    // Mark this chapter as read for streak/XP. Lighter than a full devotional —
    // +2 XP per chapter, capped to once per day per chapter.
    awardEsvChapterXP(book, chNum);
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

function jumpToEsvVerse(verseNum){
  if(!verseNum) return;
  const target = document.getElementById('esv-v-'+verseNum);
  if(target){
    target.scrollIntoView({behavior:'smooth', block:'center'});
    // Briefly highlight the verse
    target.style.background = 'rgba(167,139,250,.3)';
    target.style.borderRadius = '3px';
    target.style.padding = '0 2px';
    setTimeout(()=>{ target.style.background=''; target.style.padding=''; }, 1500);
  }
}

// ═════════════════════════════════════════════════════════════
// F2-D — BIBLE READER UPGRADE
// Per-verse highlight / note / bookmark / share / copy / explain (F2-G stub),
// chapter audio (YouTube search), full-text search, reader settings,
// and F3 forward-compat place-tag attribute hooks.
// ═════════════════════════════════════════════════════════════

// Static map of place names → site IDs for F3 Biblical World. F2-D adds the
// data-place attribute only; F3 wires the tap handler to open a site profile.
// Keep small (high-precision known places); extending the map is part of F3.
const ESV_PLACE_MAP = {
  'Jerusalem':'jerusalem','Bethlehem':'bethlehem','Nazareth':'nazareth',
  'Capernaum':'capernaum','Bethel':'bethel','Hebron':'hebron','Jericho':'jericho',
  'Shechem':'shechem','Shiloh':'shiloh','Babylon':'babylon','Nineveh':'nineveh',
  'Damascus':'damascus','Antioch':'antioch','Ephesus':'ephesus','Corinth':'corinth',
  'Athens':'athens','Rome':'rome','Patmos':'patmos','Galilee':'galilee',
  'Judea':'judea','Samaria':'samaria','Jordan':'jordan-river','Sinai':'mt-sinai',
  'Carmel':'mt-carmel','Olives':'mt-olives','Egypt':'egypt','Ur':'ur',
  'Haran':'haran','Megiddo':'megiddo','Hazor':'hazor','Lachish':'lachish',
  'Qumran':'qumran','Masada':'masada','Caesarea':'caesarea-maritima',
};

// Build verse-by-verse HTML from raw ESV passage text. Splits on the [N] verse
// markers and wraps each verse's prose in a tappable span. Section headings
// before the first verse marker are kept as a small header line.
function renderEsvPassage(text, book, chNum){
  // Pull existing annotations for this chapter once.
  const allHl   = (D && D.faithHighlights) || [];
  const allNt   = (D && D.faithNotes) || [];
  const allBm   = (D && D.faithBookmarks) || [];
  const hlMap   = {}, ntMap = {}, bmMap = {};
  allHl.forEach(h => { if(h && h.book===book && h.chapter===chNum) hlMap[h.verse] = h; });
  allNt.forEach(n => { if(n && n.book===book && n.chapter===chNum) ntMap[n.verse] = n; });
  allBm.forEach(b => { if(b && b.book===book && b.chapter===chNum) bmMap[b.verse] = b; });

  const parts = String(text).split(/(\[\d+\])/);
  let html = '';
  let openVerse = false;
  let intro = '';
  let firstSeen = false;

  for(let i=0;i<parts.length;i++){
    const part = parts[i];
    if(/^\[\d+\]$/.test(part)){
      const verseNum = parseInt(part.slice(1,-1), 10);
      // Close prior verse span if open
      if(openVerse) html += '</span>';
      // First-marker arrival — flush any intro/heading text we accumulated.
      if(!firstSeen && intro.trim()){
        html += '<div style="font-family:Bebas Neue,sans-serif;font-size:.95rem;letter-spacing:.05em;color:var(--tx2);margin-bottom:.6rem;">' + escapeHtml(intro.trim()) + '</div>';
        firstSeen = true;
        intro = '';
      } else if(intro.trim()){
        // In-passage section heading between verses
        html += '<div style="font-family:Bebas Neue,sans-serif;font-size:.85rem;letter-spacing:.04em;color:var(--tx2);margin:.8rem 0 .4rem;">' + escapeHtml(intro.trim()) + '</div>';
        intro = '';
      }
      const hl = hlMap[verseNum];
      const nt = ntMap[verseNum];
      const bm = bmMap[verseNum];
      const hlBg = hl && hl.color ? hl.color : 'transparent';
      const hlAttr = hl && hl.color ? `background:${hl.color};color:#0b1220;border-radius:3px;padding:0 3px;` : '';
      html += `<span class="esv-v" data-verse="${verseNum}" data-book="${escapeHtml(book)}" data-chapter="${chNum}" onclick="esvVerseTap(${verseNum})" style="cursor:pointer;${hlAttr}">`;
      html += `<sup id="esv-v-${verseNum}" style="color:#a78bfa;font-size:.65em;font-weight:700;">${bm ? '🔖' : ''}[${verseNum}]</sup>`;
      if(nt) html += '<span title="You wrote a note on this verse" style="font-size:.7em;margin-left:2px;">📝</span>';
      openVerse = true;
      firstSeen = true;
    } else {
      if(!firstSeen) intro += part;
      else html += escapeHtml(part);
    }
  }
  if(openVerse) html += '</span>';

  // F3 place-tag hook — wrap known place names with data-place attribute.
  // No tap handler in F2-D; F3 wires it. Avoids re-touching the reader later.
  // Word-boundary regex ensures we don't mangle "Jerusalemite" or partial matches.
  const placeKeys = Object.keys(ESV_PLACE_MAP).sort((a,b) => b.length - a.length);
  const placeRegex = new RegExp('\\b(' + placeKeys.map(k => k.replace(/[.*+?^${}()|[\\]\\\\]/g,'\\\\$&')).join('|') + ')\\b','g');
  // Only run inside text nodes — avoid breaking attributes. Simplest safe pass:
  // since our generated HTML wraps verse prose in escaped text inside spans,
  // we can post-process by replacing within the assembled string but only in
  // segments outside any tag. We split on tags and replace text-only segments.
  html = html.replace(/(>)([^<]+)(<)/g, function(_, open, txt, close){
    return open + txt.replace(placeRegex, function(m){
      const id = ESV_PLACE_MAP[m];
      return `<span data-place="${id}" style="border-bottom:1px dotted rgba(167,139,250,.55);cursor:pointer;color:#a78bfa;" title="Open ${m} in Biblical Archaeology">${m}</span>`;
    }) + close;
  });

  return html;
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(c){
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c];
  });
}

// Verse-tap entry point. Opens the bottom sheet menu with all verse actions.
function esvVerseTap(verseNum){
  if(!_esvCurrentBook || !_esvCurrentChapter){ return; }
  _esvSelectedVerse = verseNum;
  const titleEl = document.getElementById('vtmTitle');
  if(titleEl) titleEl.textContent = _esvCurrentBook + ' ' + _esvCurrentChapter + ':' + verseNum;
  // Reflect bookmark state on the button
  const bmBtn = document.getElementById('vtmBookmarkBtn');
  if(bmBtn){
    const bm = (D && D.faithBookmarks || []).find(b => b && b.book===_esvCurrentBook && b.chapter===_esvCurrentChapter && b.verse===verseNum);
    bmBtn.innerHTML = bm ? '🔖 Remove' : '🔖 Bookmark';
  }
  const m = document.getElementById('verseTapMenu');
  if(m) m.style.display = 'block';
}

function closeVerseMenu(){
  const m = document.getElementById('verseTapMenu');
  if(m) m.style.display = 'none';
  _esvSelectedVerse = 0;
}

// Apply / replace / remove highlight for the currently-selected verse.
function vtmHighlight(color){
  if(!_esvSelectedVerse) return;
  if(!D.faithHighlights) D.faithHighlights = [];
  const idx = D.faithHighlights.findIndex(h => h && h.book===_esvCurrentBook && h.chapter===_esvCurrentChapter && h.verse===_esvSelectedVerse);
  if(!color){
    if(idx >= 0){ D.faithHighlights.splice(idx,1); save(); showToast('Highlight removed'); }
    rerenderEsvVerseInline(_esvSelectedVerse);
    closeVerseMenu();
    return;
  }
  if(idx >= 0){
    D.faithHighlights[idx].color = color;
    D.faithHighlights[idx].updatedAt = new Date().toISOString();
  } else {
    D.faithHighlights.push({
      id: Date.now(),
      book: _esvCurrentBook,
      chapter: _esvCurrentChapter,
      verse: _esvSelectedVerse,
      color: color,
      createdAt: new Date().toISOString(),
    });
  }
  // Faith action — counts toward streak.
  if(!D.scrReadDays) D.scrReadDays = {};
  D.scrReadDays[new Date().toISOString().slice(0,10)] = true;
  save();
  if(typeof logActivity === 'function') logActivity('faith', 'Highlighted ' + _esvCurrentBook + ' ' + _esvCurrentChapter + ':' + _esvSelectedVerse);
  rerenderEsvVerseInline(_esvSelectedVerse);
  if(typeof renderFaithHome === 'function') renderFaithHome();
  showToast('Highlight saved');
  closeVerseMenu();
}

// Toggle a bookmark on the current verse.
function vtmBookmark(){
  if(!_esvSelectedVerse) return;
  if(!D.faithBookmarks) D.faithBookmarks = [];
  const idx = D.faithBookmarks.findIndex(b => b && b.book===_esvCurrentBook && b.chapter===_esvCurrentChapter && b.verse===_esvSelectedVerse);
  if(idx >= 0){
    D.faithBookmarks.splice(idx,1);
    save();
    showToast('Bookmark removed');
  } else {
    D.faithBookmarks.push({
      id: Date.now(),
      book: _esvCurrentBook,
      chapter: _esvCurrentChapter,
      verse: _esvSelectedVerse,
      createdAt: new Date().toISOString(),
    });
    if(!D.scrReadDays) D.scrReadDays = {};
    D.scrReadDays[new Date().toISOString().slice(0,10)] = true;
    save();
    if(typeof logActivity === 'function') logActivity('faith', 'Bookmarked ' + _esvCurrentBook + ' ' + _esvCurrentChapter + ':' + _esvSelectedVerse);
    showToast('Bookmark saved 🔖');
  }
  rerenderEsvVerseInline(_esvSelectedVerse);
  if(typeof renderFaithHome === 'function') renderFaithHome();
  closeVerseMenu();
}

// Open note editor for the selected verse.
function vtmNote(){
  if(!_esvSelectedVerse) return;
  const verseEl = document.querySelector('.esv-v[data-verse="'+_esvSelectedVerse+'"]');
  const verseText = verseEl ? verseEl.textContent.replace(/^\s*🔖?\[\d+\]\s*/, '').replace(/📝/g,'').trim() : '';
  const titleEl = document.getElementById('vnmTitle');
  if(titleEl) titleEl.textContent = _esvCurrentBook + ' ' + _esvCurrentChapter + ':' + _esvSelectedVerse;
  const verseTextEl = document.getElementById('vnmVerseText');
  if(verseTextEl) verseTextEl.textContent = verseText || '(verse text unavailable)';
  const ta = document.getElementById('vnmTextarea');
  const existing = (D.faithNotes||[]).find(n => n && n.book===_esvCurrentBook && n.chapter===_esvCurrentChapter && n.verse===_esvSelectedVerse);
  if(ta) ta.value = existing ? existing.text : '';
  const delBtn = document.getElementById('vnmDelete');
  if(delBtn) delBtn.style.display = existing ? '' : 'none';
  if(typeof openModal === 'function') openModal('verseNoteModal');
  closeVerseMenu();
}

function closeVerseNote(){
  if(typeof closeModal === 'function') closeModal('verseNoteModal');
}

function saveVerseNote(){
  const ta = document.getElementById('vnmTextarea');
  const text = ta ? ta.value.trim() : '';
  if(!text){ showToast('Write a note first'); return; }
  if(!D.faithNotes) D.faithNotes = [];
  const idx = D.faithNotes.findIndex(n => n && n.book===_esvCurrentBook && n.chapter===_esvCurrentChapter && n.verse===_esvSelectedVerse);
  const now = new Date().toISOString();
  if(idx >= 0){
    D.faithNotes[idx].text = text;
    D.faithNotes[idx].updatedAt = now;
  } else {
    D.faithNotes.push({
      id: Date.now(),
      book: _esvCurrentBook,
      chapter: _esvCurrentChapter,
      verse: _esvSelectedVerse,
      text: text,
      createdAt: now,
      updatedAt: now,
    });
  }
  if(!D.scrReadDays) D.scrReadDays = {};
  D.scrReadDays[new Date().toISOString().slice(0,10)] = true;
  save();
  if(typeof logActivity === 'function') logActivity('faith', 'Note on ' + _esvCurrentBook + ' ' + _esvCurrentChapter + ':' + _esvSelectedVerse);
  rerenderEsvVerseInline(_esvSelectedVerse);
  if(typeof renderFaithHome === 'function') renderFaithHome();
  closeVerseNote();
  showToast('Note saved 📝');
}

function deleteVerseNote(){
  if(!confirm('Delete this note?')) return;
  if(!D.faithNotes) D.faithNotes = [];
  const idx = D.faithNotes.findIndex(n => n && n.book===_esvCurrentBook && n.chapter===_esvCurrentChapter && n.verse===_esvSelectedVerse);
  if(idx >= 0){
    D.faithNotes.splice(idx,1);
    save();
    rerenderEsvVerseInline(_esvSelectedVerse);
    closeVerseNote();
    showToast('Note deleted');
  } else closeVerseNote();
}

// Share the selected verse via the F2-C verse card generator.
function vtmShare(){
  if(!_esvSelectedVerse) return;
  const verseEl = document.querySelector('.esv-v[data-verse="'+_esvSelectedVerse+'"]');
  const verseText = verseEl ? verseEl.textContent.replace(/^\s*🔖?\[\d+\]\s*/, '').replace(/📝/g,'').trim() : '';
  const ref = _esvCurrentBook + ' ' + _esvCurrentChapter + ':' + _esvSelectedVerse;
  if(typeof openVerseCard === 'function'){
    closeVerseMenu();
    openVerseCard(verseText, ref);
  } else {
    showToast('Share generator unavailable');
  }
}

// Plain-text clipboard copy for the selected verse.
function vtmCopy(){
  if(!_esvSelectedVerse) return;
  const verseEl = document.querySelector('.esv-v[data-verse="'+_esvSelectedVerse+'"]');
  const verseText = verseEl ? verseEl.textContent.replace(/^\s*🔖?\[\d+\]\s*/, '').replace(/📝/g,'').trim() : '';
  const ref = _esvCurrentBook + ' ' + _esvCurrentChapter + ':' + _esvSelectedVerse;
  const out = '"' + verseText + '" — ' + ref + '\n\nyourlifecc.com';
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(out).then(function(){ showToast('Verse copied ✓'); });
  } else {
    showToast('Clipboard not supported');
  }
  closeVerseMenu();
}

// AI explain — opens the F2-G Ask the Bible modal pre-filled with the
// selected verse, so the answer is grounded in that specific passage.
function vtmExplain(){
  if(!_esvSelectedVerse) return;
  const verseEl = document.querySelector('.esv-v[data-verse="'+_esvSelectedVerse+'"]');
  const verseText = verseEl ? verseEl.textContent.replace(/^\s*🔖?\[\d+\]\s*/, '').replace(/📝/g,'').trim() : '';
  const ref = _esvCurrentBook + ' ' + _esvCurrentChapter + ':' + _esvSelectedVerse;
  closeVerseMenu();
  if(typeof openAskBible === 'function'){
    const seed = 'Explain ' + ref + ' — what is this verse saying, in context, and how should it shape my life?\n\n"' + verseText + '"';
    openAskBible(seed);
  } else {
    showToast('Ask the Bible unavailable');
  }
}

// Re-render a single verse span in place after an annotation change. Cheaper
// than re-running the whole passage, and keeps scroll position stable.
function rerenderEsvVerseInline(verseNum){
  const span = document.querySelector('.esv-v[data-verse="'+verseNum+'"]');
  if(!span) return;
  const hl = (D.faithHighlights||[]).find(h => h && h.book===_esvCurrentBook && h.chapter===_esvCurrentChapter && h.verse===verseNum);
  const nt = (D.faithNotes||[]).find(n => n && n.book===_esvCurrentBook && n.chapter===_esvCurrentChapter && n.verse===verseNum);
  const bm = (D.faithBookmarks||[]).find(b => b && b.book===_esvCurrentBook && b.chapter===_esvCurrentChapter && b.verse===verseNum);
  if(hl && hl.color){
    span.style.background = hl.color;
    span.style.color = '#0b1220';
    span.style.borderRadius = '3px';
    span.style.padding = '0 3px';
  } else {
    span.style.background = '';
    span.style.color = '';
    span.style.borderRadius = '';
    span.style.padding = '';
  }
  // Update the [N] / 🔖[N] / 📝 indicators.
  const sup = span.querySelector('sup');
  if(sup) sup.innerHTML = (bm ? '🔖' : '') + '[' + verseNum + ']';
  // Remove any existing 📝 marker, then re-add if note exists.
  const existingNote = span.querySelector('span[data-note-marker]');
  if(existingNote) existingNote.remove();
  if(nt){
    const marker = document.createElement('span');
    marker.setAttribute('data-note-marker','1');
    marker.title = 'You wrote a note on this verse';
    marker.style.cssText = 'font-size:.7em;margin-left:2px;';
    marker.textContent = '📝';
    if(sup && sup.nextSibling) sup.parentNode.insertBefore(marker, sup.nextSibling);
    else if(sup) sup.parentNode.appendChild(marker);
  }
}

// F2-D Listen: open YouTube search for "ESV Audio <book> <chapter>" in a new
// tab. Static per-chapter video map is a future-phase content build.
function esvListenChapter(book, ch){
  const q = encodeURIComponent('ESV Audio ' + book + ' chapter ' + ch);
  window.open('https://www.youtube.com/results?search_query=' + q, '_blank', 'noopener');
}

// Reader settings modal — font size, line height, font family.
function openReaderSettings(){
  const settings = (D && D.faithReaderSettings) || { fontSize:'medium', lineHeight:'normal', fontFamily:'serif' };
  document.querySelectorAll('#readerSettingsModal .rs-opt').forEach(function(b){
    b.style.background = 'rgba(255,255,255,.06)';
    b.style.borderColor = 'rgba(255,255,255,.14)';
    b.style.color = 'var(--tx)';
  });
  const map = { 'fontSize':'size', 'lineHeight':'line', 'fontFamily':'family' };
  Object.keys(map).forEach(function(prop){
    const v = settings[prop];
    const sel = document.querySelector('#readerSettingsModal .rs-opt[data-rs="'+map[prop]+':'+v+'"]');
    if(sel){
      sel.style.background = 'var(--cd-banner)';
      sel.style.borderColor = 'transparent';
      sel.style.color = '#0b1220';
    }
  });
  if(typeof openModal === 'function') openModal('readerSettingsModal');
}

function closeReaderSettings(){
  if(typeof closeModal === 'function') closeModal('readerSettingsModal');
}

function rsSet(prop, value, btn){
  if(!D.faithReaderSettings) D.faithReaderSettings = { fontSize:'medium', lineHeight:'normal', fontFamily:'serif' };
  D.faithReaderSettings[prop] = value;
  save();
  // Visually mark active option
  const groupKey = ({ 'fontSize':'size', 'lineHeight':'line', 'fontFamily':'family' })[prop];
  document.querySelectorAll('#readerSettingsModal .rs-opt[data-rs^="'+groupKey+':"]').forEach(function(b){
    if(b === btn){
      b.style.background = 'var(--cd-banner)';
      b.style.borderColor = 'transparent';
      b.style.color = '#0b1220';
    } else {
      b.style.background = 'rgba(255,255,255,.06)';
      b.style.borderColor = 'rgba(255,255,255,.14)';
      b.style.color = 'var(--tx)';
    }
  });
  // Apply live to the open passage if any
  const txt = document.getElementById('esvPassageText');
  if(txt){
    const s = D.faithReaderSettings;
    txt.style.fontSize   = s.fontSize === 'small' ? '.82rem' : s.fontSize === 'large' ? '1.05rem' : '.95rem';
    txt.style.lineHeight = s.lineHeight === 'compact' ? '1.7' : s.lineHeight === 'relaxed' ? '2.2' : '2';
    txt.style.fontFamily = s.fontFamily === 'sans' ? "'Inter', system-ui, sans-serif" : "'Georgia','Times New Roman',serif";
  }
}

// F2-D Search — runs both: (a) local lookup in user's notes/highlights/bookmarks,
// (b) ESV API passage/search. Results render in #esvSearchResults.
async function runEsvSearch(){
  const q = (document.getElementById('esvSearchInput')||{}).value || '';
  const term = q.trim();
  const out = document.getElementById('esvSearchResults');
  if(!out) return;
  if(!term){ out.style.display = 'none'; out.innerHTML = ''; return; }
  out.style.display = 'block';
  out.innerHTML = '<div style="font-size:.75rem;color:var(--tx2);padding:.5rem;">Searching…</div>';

  // Local pass — case-insensitive.
  const lcTerm = term.toLowerCase();
  const localNotes = (D.faithNotes||[]).filter(n => n && (String(n.text||'').toLowerCase().includes(lcTerm) ||
    (n.book + ' ' + n.chapter + ':' + n.verse).toLowerCase().includes(lcTerm)));
  const localBookmarks = (D.faithBookmarks||[]).filter(b => b && (b.book + ' ' + b.chapter + ':' + b.verse).toLowerCase().includes(lcTerm));

  let html = '';
  if(localNotes.length || localBookmarks.length){
    html += '<div style="font-size:.62rem;font-weight:800;color:var(--tx3);text-transform:uppercase;letter-spacing:.16em;margin:.3rem 0 .35rem;">Your notes &amp; bookmarks</div>';
    localNotes.slice(0,10).forEach(function(n){
      html += `<div onclick="esvJumpFromSearch('${encodeURIComponent(n.book)}',${n.chapter},${n.verse})" style="background:rgba(56,189,248,.06);border:1px solid rgba(56,189,248,.18);border-radius:8px;padding:.5rem .65rem;margin-bottom:.3rem;cursor:pointer;">
        <div style="font-size:.7rem;font-weight:800;color:#38bdf8;margin-bottom:.15rem;">📝 ${escapeHtml(n.book)} ${n.chapter}:${n.verse}</div>
        <div style="font-size:.74rem;color:var(--tx2);line-height:1.45;">${escapeHtml((n.text||'').slice(0,140))}${(n.text||'').length>140?'…':''}</div>
      </div>`;
    });
    localBookmarks.slice(0,5).forEach(function(b){
      html += `<div onclick="esvJumpFromSearch('${encodeURIComponent(b.book)}',${b.chapter},${b.verse})" style="background:rgba(167,139,250,.06);border:1px solid rgba(167,139,250,.18);border-radius:8px;padding:.5rem .65rem;margin-bottom:.3rem;cursor:pointer;">
        <div style="font-size:.7rem;font-weight:800;color:#a78bfa;">🔖 ${escapeHtml(b.book)} ${b.chapter}:${b.verse}</div>
      </div>`;
    });
  }

  // ESV-side full-text search.
  try {
    const key = 'aaf4dd2ad7cb2e6aa19853ddd493136125afb18e';
    const url = 'https://api.esv.org/v3/passage/search/?q=' + encodeURIComponent(term) + '&page-size=10';
    const resp = await fetch(url, { headers: { 'Authorization':'Token '+key } });
    if(resp.ok){
      const data = await resp.json();
      const results = (data && data.results) || [];
      if(results.length){
        html += '<div style="font-size:.62rem;font-weight:800;color:var(--tx3);text-transform:uppercase;letter-spacing:.16em;margin:.7rem 0 .35rem;">ESV results · ' + (data.total_results||results.length) + ' total</div>';
        results.forEach(function(r){
          html += `<div onclick="esvJumpFromRef('${encodeURIComponent(r.reference||'')}')" style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:.5rem .65rem;margin-bottom:.3rem;cursor:pointer;">
            <div style="font-size:.7rem;font-weight:800;color:var(--tx);margin-bottom:.15rem;">📖 ${escapeHtml(r.reference||'')}</div>
            <div style="font-size:.74rem;color:var(--tx2);line-height:1.5;">${escapeHtml((r.content||'').replace(/\s+/g,' ').slice(0,180))}${(r.content||'').length>180?'…':''}</div>
          </div>`;
        });
      } else if(!localNotes.length && !localBookmarks.length){
        html += '<div style="font-size:.74rem;color:var(--tx2);padding:.6rem;text-align:center;">No matches in ESV or your notes.</div>';
      }
    } else {
      html += '<div style="font-size:.7rem;color:#f87171;padding:.5rem;">ESV search failed (' + resp.status + ').</div>';
    }
  } catch(e){
    html += '<div style="font-size:.7rem;color:#f87171;padding:.5rem;">ESV search error — check connection.</div>';
  }
  out.innerHTML = html;
}

function esvJumpFromSearch(encodedBook, ch, verse){
  const book = decodeURIComponent(encodedBook);
  const sel = document.getElementById('esvBook');
  if(sel){ sel.value = book; if(typeof onEsvBookChange === 'function') onEsvBookChange(); }
  const chSel = document.getElementById('esvChapter');
  if(chSel) chSel.value = String(ch);
  openEsvReader();
  setTimeout(function(){ if(typeof jumpToEsvVerse === 'function') jumpToEsvVerse(verse); }, 600);
}

function esvJumpFromRef(encodedRef){
  const ref = decodeURIComponent(encodedRef);
  const m = String(ref).match(/^(\d?\s?[A-Za-z][A-Za-z ]+?)\s+(\d+)(?::(\d+))?/);
  if(!m){ showToast('Could not parse ' + ref); return; }
  const book = m[1].trim(), ch = m[2], verse = m[3] ? parseInt(m[3],10) : 0;
  const sel = document.getElementById('esvBook');
  if(sel){ sel.value = book; if(typeof onEsvBookChange === 'function') onEsvBookChange(); }
  const chSel = document.getElementById('esvChapter');
  if(chSel) chSel.value = String(ch);
  openEsvReader();
  if(verse) setTimeout(function(){ if(typeof jumpToEsvVerse === 'function') jumpToEsvVerse(verse); }, 600);
}

// +2 Faith XP per chapter, capped to one award per chapter per day so opening
// the same chapter repeatedly doesn't farm points. Also fires the streak.
function awardEsvChapterXP(book, ch){
  const today = new Date().toISOString().slice(0,10);
  if(!D.faithChapterReadLog) D.faithChapterReadLog = {};
  const key = today + '|' + book + '|' + ch;
  if(D.faithChapterReadLog[key]) return;
  D.faithChapterReadLog[key] = 1;
  D.scrPoints = (D.scrPoints||0) + 2;
  if(!D.scrReadDays) D.scrReadDays = {};
  D.scrReadDays[today] = true;
  save();
  if(typeof logActivity === 'function') logActivity('faith', 'Read ' + book + ' ' + ch);
  if(typeof renderFaithHome === 'function') renderFaithHome();
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
  if(typeof renderSermonNotes === 'function') renderSermonNotes();
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

// renderPrayerList: see canonical implementation later in this file (uses escapeHtml).
// Earlier duplicate definition removed 2026-05-09 — was XSS-vulnerable on p.text.

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
    {icon:'🕊️',label:'Devotionals Read',count:devotionalsRead,target:365,color:'#a78bfa'},
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
    ${r.notes?`<div style="font-size:.75rem;color:var(--tx2);line-height:1.6;">${escapeHtml(r.notes)}</div>`:''}
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
  {title:'One Hundred Days of Grace',verse:'Philippians 1:6',scripture:'Being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus.',body:'One hundred days. God has been at work in you every single one of them — in the days you felt it and the days you didn\'t. He started something in you and He has committed to finishing it. You are not a project He will abandon.',reflect:'How are you different than you were 100 days ago? What has God been building in you? Write it down — it deserves to be remembered.',prayer:'Father, thank You for 100 days of grace. For every moment You were working even when I couldn\'t see it. I trust You to keep going. Amen.'},
{title:'The God Who Sees You',verse:'Genesis 16:13',scripture:'She gave this name to the LORD who spoke to her: "You are the God who sees me."',body:'Hagar was alone, pregnant, rejected, and running. And God showed up — not in a temple, not to a king — but to a runaway slave in the desert. He sees the people everyone else overlooks. He sees you in your hidden places too.',reflect:'Where in your life do you feel unseen or overlooked? Tell God about it today.',prayer:'Lord, You are the God who sees me — all of me, even the parts I hide. Thank You for finding me in the desert. Amen.'},
  {title:'Walking Humbly',verse:'Micah 6:8',scripture:'What does the LORD require of you? To act justly and to love mercy and to walk humbly with your God.',body:'Three things. Not a long list of rules — just three. Justice, mercy, humility. Notice the order: you act justly toward others, you love mercy in how you treat people, and you walk humbly before God. This is the whole Christian life in one verse.',reflect:'Which of the three — justice, mercy, or humility — is hardest for you right now? Why?',prayer:'God, make me just, merciful, and humble. Not just occasionally — as a way of life. Amen.'},
  {title:'Salt of the Earth',verse:'Matthew 5:13',scripture:'You are the salt of the earth. But if the salt loses its saltiness, how can it be made salty again?',body:'Salt in the ancient world was precious — used to preserve food and add flavor. Jesus says you are that essential. But salt only works when it makes contact. You can\'t season from a distance. Your faith has to touch the real world.',reflect:'Where in your life are you keeping your faith safely contained instead of letting it make contact?',prayer:'Lord, don\'t let me lose my saltiness. Keep me sharp, flavorful, and useful in the world You\'ve placed me in. Amen.'},
  {title:'The Prodigal\'s Father',verse:'Luke 15:20',scripture:'While he was still a long way off, his father saw him and was filled with compassion for him; he ran to his son.',body:'The father in this story doesn\'t wait for his son to reach the door. He sees him from a distance and runs. This is who God is — not waiting for you to clean yourself up before He welcomes you. He runs toward repentance.',reflect:'Have you been keeping your distance from God, thinking you need to get better first? What would it look like to just start walking toward Him today?',prayer:'Father, I\'m coming home. I don\'t have it all together. But I\'m walking toward You. Please run to meet me. Amen.'},
  {title:'Armor Up',verse:'Ephesians 6:11',scripture:'Put on the full armor of God, so that you can take your stand against the devil\'s schemes.',body:'Paul wrote this from prison — chained to a Roman soldier, looking at actual armor. The image is deliberate. Spiritual warfare is real, and you need real protection: truth, righteousness, faith, salvation, the Word, and prayer. You don\'t fight for victory — you fight from it.',reflect:'Which piece of the armor do you most neglect? Truth? Prayer? The Word? Focus on that one today.',prayer:'God, I put on Your armor today. Help me stand firm in what is true when the enemy tries to convince me otherwise. Amen.'},
  {title:'Ask, Seek, Knock',verse:'Matthew 7:7',scripture:'Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.',body:'These are three different intensities of prayer. Asking is simple request. Seeking involves effort and pursuit. Knocking implies persistence — you\'re standing at the door and you\'re not leaving. God rewards all three, but especially the persistent ones.',reflect:'What have you stopped asking for because you gave up? Bring it back to God today.',prayer:'Lord, I\'m asking again. Seeking again. Knocking again. I trust that You hear and that You answer in Your perfect timing. Amen.'},
  {title:'The Eye of the Needle',verse:'Mark 10:27',scripture:'With man this is impossible, but not with God; all things are possible with God.',body:'The rich young ruler walked away sad because he couldn\'t let go of his wealth. Jesus says salvation is impossible by human effort — but God specializes in the impossible. The good news isn\'t that you have to try harder. It\'s that God does what you can\'t.',reflect:'What are you trying to accomplish in your own strength that only God can actually do?',prayer:'God, I release the impossible thing to You. Do what only You can do. I trust You. Amen.'},
  {title:'Fruit That Lasts',verse:'John 15:16',scripture:'I chose you and appointed you so that you might go and bear fruit — fruit that will last.',body:'You didn\'t choose God first — He chose you. And He didn\'t choose you to sit still. He appointed you to bear lasting fruit: changed lives, built character, acts of love that outlast the moment. Your life is supposed to produce something that matters beyond today.',reflect:'What lasting fruit is your life currently producing? What would you like it to produce?',prayer:'Lord, let my life bear fruit that lasts — not just impressive activity, but real impact that points people to You. Amen.'},
  {title:'Do Not Worry About Tomorrow',verse:'Matthew 6:34',scripture:'Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.',body:'Jesus doesn\'t say your worries are irrational. He says they\'re ineffective. Worry doesn\'t change tomorrow — it just steals today. You have enough on your plate right now. Handle today. Trust God with tomorrow.',reflect:'What tomorrow-worry is stealing your peace today? Write it down and physically hand it to God.',prayer:'Father, I give You my tomorrow-anxiety. Help me be fully present and faithful today. Amen.'},
  {title:'Love Is Patient',verse:'1 Corinthians 13:4',scripture:'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.',body:'This isn\'t a wedding poem — it was written to a church tearing itself apart. Paul describes love not as a feeling but as a behavior. Patient, kind, not envious, not proud. Run your relationships through this filter. Not your feelings — your actions.',reflect:'Pick one person in your life. Run your recent behavior toward them through 1 Corinthians 13. What do you notice?',prayer:'God, make Your love more than a feeling in me. Make it a daily choice. Help me love the way You describe. Amen.'},
  {title:'The Narrow Gate',verse:'Matthew 7:13-14',scripture:'Enter through the narrow gate. For wide is the gate and broad is the road that leads to destruction.',body:'The narrow gate isn\'t about being exclusive or religious. It\'s about intentionality. Most people drift — they take the path of least resistance, go where the crowd goes, make the easy choice. The narrow road requires deliberate decisions every day.',reflect:'Where in your life are you taking the wide road because it\'s easier? What would the narrow road look like?',prayer:'Lord, give me the courage to walk the narrow road — not the popular path, but the right one. Amen.'},
  {title:'Treasure in Heaven',verse:'Matthew 6:20',scripture:'Store up for yourselves treasures in heaven, where moths and vermin do not destroy.',body:'Everything you can accumulate here will eventually depreciate, break, or be taken. The only investments that survive eternity are people and obedience. How you love, serve, and sacrifice — those are the things that transfer.',reflect:'What are you most invested in right now — things that will last or things that won\'t? What needs to shift?',prayer:'God, recalibrate my investing. Help me put my best energy into what lasts. Amen.'},
  {title:'God\'s Thoughts Toward You',verse:'Psalm 139:17-18',scripture:'How precious to me are your thoughts, God! How vast is the sum of them! Were I to count them, they would outnumber the grains of sand.',body:'God thinks about you more than you can count. Not occasionally. Constantly. His attention never drifts from you. You are not an afterthought in the divine schedule — you are on His mind continuously.',reflect:'How does it change your day to know God is thinking about you right now?',prayer:'Lord, let this truth sink deep: You are thinking about me. Help me live in the security of Your constant attention. Amen.'},
  {title:'Rivers of Living Water',verse:'John 7:38',scripture:'Whoever believes in me, as Scripture has said, rivers of living water will flow from within them.',body:'Notice it\'s rivers — plural, and powerful. Not a trickle. Not a puddle. When the Holy Spirit is flowing freely in you, it overflows. People around you feel it. The overflow isn\'t for you alone — it\'s meant to reach others.',reflect:'Is the water flowing freely in you right now, or is something blocking it? What might be damming the flow?',prayer:'Holy Spirit, flow freely through me. Remove whatever is blocking You. Let Your life spill over into every relationship I have. Amen.'},
  {title:'The Helper',verse:'John 14:16',scripture:'I will ask the Father, and he will give you another advocate to help you and be with you forever.',body:'Before He left, Jesus made a promise: you won\'t be alone. The Holy Spirit isn\'t a force or a feeling — He\'s a person, and He\'s your advocate. Like a lawyer who stands with you, He argues your case, guides your steps, and never leaves.',reflect:'When was the last time you consciously asked the Holy Spirit for help with something specific?',prayer:'Holy Spirit, I invite You into every part of today. Be my helper, my guide, my advocate. I don\'t want to do this without You. Amen.'},
  {title:'Blessed Are the Peacemakers',verse:'Matthew 5:9',scripture:'Blessed are the peacemakers, for they will be called children of God.',body:'Peacemakers are not peacekeepers. Peacekeepers avoid conflict at all costs. Peacemakers step into conflict and work toward real resolution. It\'s harder, costlier, and rarer. That\'s why Jesus calls them blessed.',reflect:'Is there a conflict in your life you\'ve been keeping rather than making peace? What would one step toward resolution look like?',prayer:'Lord, make me a peacemaker — not someone who avoids hard conversations, but someone who has them with grace. Amen.'},
  {title:'He Restores My Soul',verse:'Psalm 23:3',scripture:'He refreshes my soul. He guides me along the right paths for his name\'s sake.',body:'The Hebrew word for refresh here means to bring back — to restore something to its original state. God doesn\'t just patch you up; He brings you back to who you were created to be. The Good Shepherd restores what life has worn down.',reflect:'What part of your soul feels worn down right now? Specifically invite God to restore it.',prayer:'Good Shepherd, restore what life has worn away in me. Bring me back to who You made me to be. Amen.'},
  {title:'Greater Love',verse:'John 15:13',scripture:'Greater love has no one than this: to lay down one\'s life for one\'s friends.',body:'Jesus said this the night before He did it. He wasn\'t speaking theoretically — He was describing what He was about to do. This is the gold standard of love: not what you feel, but what you sacrifice. Not what you gain, but what you give.',reflect:'Who in your life are you currently laying down your preferences, time, or comfort for? Who needs that from you?',prayer:'Jesus, thank You for the ultimate sacrifice. Help me love with that same self-giving spirit in the ordinary moments of my day. Amen.'},
  {title:'The Vine and the Branches',verse:'John 15:5',scripture:'I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.',body:'A branch isn\'t the source of fruit — it\'s the channel. The branch doesn\'t strain to produce fruit. It simply stays connected to the vine and fruit is the natural result. Striving without abiding is exhausting. Abiding without striving is the key.',reflect:'What does staying connected to Jesus look like practically in your daily routine?',prayer:'Lord, help me abide in You — not just when it\'s convenient, but as a constant, daily reality. Amen.'},
  {title:'Wisdom Begins Here',verse:'Proverbs 9:10',scripture:'The fear of the LORD is the beginning of wisdom, and knowledge of the Holy One is understanding.',body:'Fear of God isn\'t cowering terror — it\'s reverent awe. It\'s the posture that says: You are God and I am not. From that foundation everything else follows. Wisdom doesn\'t start with intelligence or experience — it starts with acknowledging who God is.',reflect:'How would your decisions today change if you approached each one with reverent awe of God?',prayer:'Lord, give me the fear of the LORD — not terror, but holy reverence that shapes every decision I make. Amen.'},
  {title:'He Knows Your Name',verse:'Isaiah 43:1',scripture:'Do not fear, for I have redeemed you; I have summoned you by name; you are mine.',body:'God doesn\'t relate to you in categories or demographics. He knows your name. He called it before you were born. You are not a number in a divine database — you are personally known by the Creator of everything.',reflect:'When you feel like just another face in the crowd, how does it change things to remember God called you by name?',prayer:'Father, thank You that You know my name. Help me live in the security of being personally known and loved by You. Amen.'},
  {title:'Seek First',verse:'Matthew 6:33',scripture:'But seek first his kingdom and his righteousness, and all these things will be given to you as well.',body:'The problem isn\'t that you want good things. The problem is the order. When God is first, everything else finds its right place. When anything else is first — success, relationships, comfort — everything gets distorted. First things first.',reflect:'If someone watched your calendar and spending this week, what would they say you\'re seeking first?',prayer:'God, help me genuinely put Your kingdom first — not just in my words but in my actual daily priorities. Amen.'},
  {title:'Signed and Sealed',verse:'Ephesians 1:13',scripture:'Having believed, you were marked in him with a seal, the promised Holy Spirit.',body:'A seal in the ancient world meant ownership and security — like a wax seal on a letter, guaranteeing its contents. The Holy Spirit is God\'s seal on your life. You belong to Him. Your salvation isn\'t on probation — it\'s sealed.',reflect:'Do you live with the security of someone who is sealed, or do you still feel like your standing with God is uncertain?',prayer:'Lord, let the reality of Your seal sink in. I am Yours — permanently, securely, fully. Help me live from that truth. Amen.'},
  {title:'The Table in the Wilderness',verse:'Psalm 23:5',scripture:'You prepare a table before me in the presence of my enemies.',body:'God doesn\'t wait until the battle is over to bless you. He sets a table in the middle of the fight. Provision, peace, and presence — right there in the conflict. You can feast even when you\'re surrounded.',reflect:'Where is God currently setting a table for you in the middle of a hard season?',prayer:'Lord, help me see the table You\'ve set for me even in the middle of my battles. You provide in the storm. Amen.'},
  {title:'Running the Race',verse:'Hebrews 12:1',scripture:'Let us run with perseverance the race marked out for us.',body:'Notice it says the race marked out for you — not someone else\'s race. You have a specific course. Running someone else\'s race is exhausting and pointless. Strip off what slows you down and run your lane with everything you have.',reflect:'What weight or sin is slowing your pace right now? What would it take to lay it down?',prayer:'God, help me run my race — not someone else\'s. Strip away what slows me and fix my eyes on Jesus. Amen.'},
  {title:'Known and Loved',verse:'1 John 4:19',scripture:'We love because he first loved us.',body:'You didn\'t earn His love. You didn\'t perform for it. He loved you first — before you were good enough, before you believed, before you cleaned up your act. That kind of love changes how you love others: not to earn something, but because you\'ve already received everything.',reflect:'How does knowing God loved you first change the way you love the difficult people in your life?',prayer:'Father, Your first-love frees me to love without conditions. Help me pass that on to everyone I encounter today. Amen.'},
  {title:'The God of All Comfort',verse:'2 Corinthians 1:3-4',scripture:'The God of all comfort, who comforts us in all our troubles, so that we can comfort those in any trouble.',body:'God comforts you not just for your sake but so you can become a comfort to others. Your hard seasons are preparation for ministry. The person who has been through grief can sit with the grieving in ways no one else can.',reflect:'What difficult experience have you been through that now equips you to help someone else?',prayer:'God of all comfort, use what I\'ve been through to help someone else get through their own hard season. Amen.'},
  {title:'A New Song',verse:'Psalm 40:3',scripture:'He put a new song in my mouth, a hymn of praise to our God. Many will see and fear the LORD and put their trust in him.',body:'When God rescues you, it becomes a song — and other people hear it. Your testimony isn\'t just for you. What God has brought you through has the power to move someone else toward faith. Your story is someone else\'s lifeline.',reflect:'What is the "new song" God has put in your mouth from a past season? Have you shared it with anyone?',prayer:'Lord, give me courage to share what You\'ve done in my life. Let my story be an invitation for others. Amen.'},
  {title:'Dwell in Safety',verse:'Proverbs 1:33',scripture:'But whoever listens to me will live in safety and be at ease, without fear of harm.',body:'Safety here isn\'t the absence of danger — it\'s the presence of wisdom. The person who listens to God navigates the same world everyone else does, but with a different internal compass. Wisdom is the skill of living well in a broken world.',reflect:'Where in your life do you need wisdom right now? Have you asked God for it specifically?',prayer:'Lord, I ask for wisdom in this specific situation: [name it]. Give me the discernment to navigate it well. Amen.'},
  {title:'He Carries the Lamb',verse:'Isaiah 40:11',scripture:'He tends his flock like a shepherd: He gathers the lambs in his arms and carries them close to his heart.',body:'The lambs — not the strong sheep — are carried. The weak ones, the vulnerable ones, the ones who can\'t keep up. God doesn\'t leave the struggling behind. He picks them up and carries them close to His chest. That\'s where you are when you\'re weak.',reflect:'Are you currently in a season where you need to be carried? Will you let Him carry you instead of pushing through alone?',prayer:'Good Shepherd, I\'m tired. Pick me up. Carry me close to Your heart. I trust You to get me where I need to go. Amen.'},
  {title:'Praise Before the Answer',verse:'Philippians 4:6',scripture:'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.',body:'Did you catch it? Thanksgiving comes before the answer. Not after God comes through — before. This is faith in action: praising God for who He is while the situation is still unresolved. Gratitude that isn\'t dependent on the outcome.',reflect:'Can you thank God today for something He hasn\'t answered yet? Try it — it changes your posture.',prayer:'Lord, I thank You in advance. Before I see the answer, I praise You for being a God who answers. Amen.'},
  {title:'He Intercedes for You',verse:'Romans 8:34',scripture:'Christ Jesus who died — more than that, who was raised to life — is at the right hand of God and is also interceding for us.',body:'Right now — at this moment — Jesus is praying for you. Not was praying. Is. His resurrection wasn\'t the end of His work; it was the beginning of His ongoing intercession. You have an advocate before the Father who never stops.',reflect:'How does knowing Jesus is currently praying for you change how you feel about your situation?',prayer:'Jesus, thank You that You are praying for me right now. What a gift. Help me rest in that assurance today. Amen.'},
  {title:'Chosen Before the Foundation',verse:'Ephesians 1:4',scripture:'For he chose us in him before the creation of the world to be holy and blameless in his sight.',body:'Before the first star was lit, God thought of you. You weren\'t an accident or an afterthought in the cosmic order — you were planned for. Chosen. The God who designed the universe designed a place for you in it.',reflect:'How would you live differently if you truly believed you were chosen before time began?',prayer:'Father, let the truth of being chosen before the foundation of the world settle into my identity today. I am Yours. Amen.'},
  {title:'He Makes All Things New',verse:'Revelation 21:5',scripture:'He who was seated on the throne said, "I am making everything new!"',body:'This is a present-tense statement about the future and the now. God is always in the business of renewal — new mercies every morning, new creations in Christ, and one day a new heaven and earth. Nothing is too broken for Him to remake.',reflect:'What in your life feels too broken or too far gone? Give it to the God who makes all things new.',prayer:'God, I believe You can make new what feels ruined. I give You the broken places. Do what only You can do. Amen.'},
  {title:'Strength in Weakness',verse:'2 Corinthians 12:10',scripture:'For when I am weak, then I am strong.',body:'Paul learned this the hard way — through a thorn he begged God to remove three times. God said no. Instead He offered something better: grace sufficient for the weakness. The weakness itself became the display case for God\'s power.',reflect:'What weakness have you been ashamed of that God might want to use as a showcase for His strength?',prayer:'Lord, I stop hiding my weakness. Use it. Display Your power through my insufficiency. Amen.'},
  {title:'The God Who Answers by Fire',verse:'1 Kings 18:24',scripture:'The god who answers by fire — he is God.',body:'Elijah set up the ultimate test: real God vs. fake god. The prophets of Baal screamed for hours. Nothing. Elijah prayed once. Fire fell. Sometimes faith requires the boldness to put God on display and trust He will show up.',reflect:'Where do you need to trust God to show up in a way that is undeniable? Have you asked Him?',prayer:'God, show up in a way I can\'t explain away. I want to see Your fire. I believe You are real and You answer. Amen.'},
  {title:'Cast Your Bread',verse:'Ecclesiastes 11:1',scripture:'Cast your bread upon the waters, for after many days you will find it again.',body:'This ancient wisdom says: give generously even when you can\'t see the return. Invest in people, sow good deeds, be generous with your resources — the return will come in ways and timelines you can\'t predict. Don\'t hold back what you\'ve been given.',reflect:'What have you been holding back from giving — money, time, encouragement — because you couldn\'t see the return?',prayer:'God, make me a generous giver who trusts the return to You. Help me cast my bread freely. Amen.'},
  {title:'Let Your Yes Be Yes',verse:'Matthew 5:37',scripture:'All you need to say is simply "Yes" or "No"; anything beyond this comes from the evil one.',body:'Integrity means your word is enough. You don\'t need elaborate promises or sworn oaths if you\'re consistently truthful. Say what you mean. Mean what you say. Be the kind of person whose yes is bankable.',reflect:'Are you a person of your word? Think of a recent commitment — did you follow through?',prayer:'Lord, make my yes mean yes. Build in me a reputation for integrity that doesn\'t need extra words to back it up. Amen.'},
  {title:'God Is Not Slow',verse:'2 Peter 3:9',scripture:'The Lord is not slow in keeping his promise, as some understand slowness. Instead he is patient with you.',body:'What feels like delay to you is patience from God — He\'s giving more people time to turn to Him. His timing isn\'t based on your clock. What you\'re waiting for, He hasn\'t forgotten. He\'s working in the waiting.',reflect:'What have you been interpreting as God being slow or absent? Could it be patience and purpose instead?',prayer:'Lord, help me trust Your timing. What I see as delay, You see as preparation. I trust Your pace. Amen.'},
  {title:'The Lord Goes Before You',verse:'Deuteronomy 31:8',scripture:'The LORD himself goes before you and will be with you; he will never leave you nor forsake you.',body:'Before you walk into the meeting, the conversation, the diagnosis, the unknown — God is already there. He doesn\'t send you ahead alone and meet you when you\'re done. He goes first, then walks beside you. You are never the first one in the room.',reflect:'What upcoming situation feels daunting? Picture God already there, waiting for you. How does that change it?',prayer:'Lord, You go before me. Into every hard thing I face today, You are already there. I walk in courage because of You. Amen.'},
  {title:'Slow to Anger',verse:'James 1:19-20',scripture:'Everyone should be quick to listen, slow to speak and slow to become angry, because human anger does not produce the righteousness that God desires.',body:'Human anger — the reactive, defensive, ego-driven kind — doesn\'t build anything good. It damages relationships, clouds judgment, and produces regret. Slowness to anger isn\'t weakness; it\'s one of the most difficult forms of self-mastery.',reflect:'In what situation or with what person do you most struggle to be slow to anger? What\'s one thing you could do differently?',prayer:'God, slow me down before I react. Give me the pause between feeling and speaking that prevents damage. Amen.'},
  {title:'Your Life Is a Letter',verse:'2 Corinthians 3:3',scripture:'You show that you are a letter from Christ, written not with ink but with the Spirit of the living God.',body:'Paul says believers are living letters — read by everyone around them. Your life communicates a message whether you intend it to or not. What is the letter of your life currently saying about the God you follow?',reflect:'If someone who doesn\'t know Jesus read the letter of your life this week, what would they conclude about Him?',prayer:'Lord, make my life a letter that clearly communicates Your love, grace, and truth. Let it be legible to everyone around me. Amen.'},
  {title:'By His Wounds',verse:'Isaiah 53:5',scripture:'But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.',body:'Written 700 years before Jesus, this passage describes the cross in precise detail. The punishment wasn\'t random — it was purposeful. Peace between God and humanity was purchased at the cost of pain. His wounds are the source of your healing.',reflect:'Sit with this verse today. Don\'t rush past it. What does it mean that your peace was purchased by His wounds?',prayer:'Jesus, thank You for the wounds You bore for me. I don\'t deserve the peace they purchased, but I receive it with gratitude. Amen.'},
  {title:'He Will Not Forget You',verse:'Isaiah 49:15-16',scripture:'Can a mother forget the baby at her breast? Though she may forget, I will not forget you! See, I have engraved you on the palms of my hands.',body:'God uses the strongest human bond — a mother and infant — to describe His commitment. And then He goes further: even if she forgets, I won\'t. Your name is engraved on His hands. Not written in pencil. Engraved.',reflect:'Where in your life have you felt forgotten — by people, by God? Bring that feeling to this verse today.',prayer:'Lord, I receive this: I am engraved on Your hands. You cannot forget me. Help me live from that truth. Amen.'},
  {title:'The Patience of Job',verse:'James 5:11',scripture:'You have heard of Job\'s perseverance and have seen what the Lord finally brought about. The Lord is full of compassion and mercy.',body:'Job\'s story is not just about suffering — it\'s about what God brings about on the other side. The end of the story matters. God\'s compassion and mercy show up. Not always quickly. But always.',reflect:'What Job-like season have you been through, or are you in? What has God brought about — or what might He be bringing?',prayer:'Lord of compassion, I trust that the end of my story is in Your hands. Give me Job\'s perseverance until I see what You bring about. Amen.'},
  {title:'Delight in the Law',verse:'Psalm 1:2',scripture:'But whose delight is in the law of the LORD, and who meditates on his law day and night.',body:'The happiest person in Psalm 1 is the one who delights in God\'s Word — not just reads it, not just follows it, but delights in it. Like someone who can\'t put down a great book. The Word becomes a pleasure, not a chore.',reflect:'Is reading God\'s Word a delight or a duty for you right now? What would make it more of a delight?',prayer:'Lord, make Your Word a delight to me. Give me the appetite to meditate on it morning and night. Amen.'},
  {title:'The Beatitudes',verse:'Matthew 5:3',scripture:'Blessed are the poor in spirit, for theirs is the kingdom of heaven.',body:'Jesus opens the most famous sermon ever preached by blessing the broken — the spiritually bankrupt, the mourners, the meek. The world blesses the confident, the successful, the powerful. Jesus inverts the whole ladder.',reflect:'Do you tend to see brokenness, mourning, or weakness as disqualifiers? How does Jesus\'s list challenge that?',prayer:'Lord, thank You that Your kingdom belongs to the poor in spirit. I qualify. Help me live in the blessing You\'ve declared over me. Amen.'},
  {title:'Sheep Without a Shepherd',verse:'Matthew 9:36',scripture:'When he saw the crowds, he had compassion on them, because they were harassed and helpless, like sheep without a shepherd.',body:'Jesus looked at the crowds — not with judgment, not with frustration — but with compassion. Harassed and helpless. If He looked at your city, your school, your neighborhood, He would see the same. And feel the same. Does it move you?',reflect:'Who in your world is harassed and helpless? How could you reflect the compassion of Jesus toward them this week?',prayer:'Jesus, give me Your eyes to see the people around me — not as problems, but as sheep who need a shepherd. Make me part of Your answer. Amen.'},
  {title:'The First Commandment',verse:'Matthew 22:37-38',scripture:'Love the Lord your God with all your heart and with all your soul and with all your mind. This is the first and greatest commandment.',body:'All. Heart. Soul. Mind. Not a portion of you — all of you. Most people give God a slice of their life and wonder why faith feels thin. Jesus demands totality because anything less is not love — it\'s a transaction.',reflect:'Which part of you — heart, soul, or mind — is most withheld from God right now? What would full surrender look like?',prayer:'Lord, I want to love You with all of me — not just the presentable parts. Take the withheld areas. They\'re Yours. Amen.'},
  {title:'Overflow',verse:'Romans 15:13',scripture:'May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.',body:'Joy, peace, hope — these aren\'t things you manufacture. They\'re things God fills you with. And the measure isn\'t just enough for yourself — it\'s overflow. Enough to spill onto everyone around you.',reflect:'On a scale of 1–10, how full of hope are you right now? What is draining it? What might refill it?',prayer:'God of hope, fill me so full that I overflow. Let hope spill out of me onto everyone I encounter today. Amen.'},
  {title:'First Love',verse:'Revelation 2:4',scripture:'Yet I hold this against you: You have forsaken the love you had at first.',body:'Jesus says this to a church that was doctrinally correct, morally upright, and hardworking — but had lost its first love. You can do all the right things with a cold heart. The fire of first love can go out quietly while everything looks fine from the outside.',reflect:'Think back to when your relationship with God was most alive. What was present then that is missing now?',prayer:'Lord, restore my first love. Reignite the fire. I don\'t want right behavior without a burning heart. Amen.'},
  {title:'Mercy Triumphs',verse:'James 2:13',scripture:'Mercy triumphs over judgment.',body:'James is talking about how we treat people, but it also describes how God has treated us. He would have been just to judge. He chose mercy. And people who have received that mercy tend to give it. People who forget they received it tend to judge.',reflect:'Is there someone in your life you\'re judging where mercy is actually called for? What would mercy look like?',prayer:'Lord, I\'ve received so much mercy. Make me generous with it toward others. Let mercy triumph in my relationships. Amen.'},
  {title:'Sanctified by Truth',verse:'John 17:17',scripture:'Sanctify them by the truth; your word is truth.',body:'This is Jesus praying for His disciples — and by extension, for you — the night before His death. His prayer is that truth would set you apart and make you holy. Not religion. Not ritual. Truth. The Word of God actively transforms.',reflect:'What truth from Scripture is currently doing the most work in your life? Are you letting it transform you or just inform you?',prayer:'Lord, let Your truth do its work in me. Not just inform me — transform me. Sanctify me by what is real and true. Amen.'},
  {title:'He Stood at the Door',verse:'Revelation 3:20',scripture:'Here I am! I stand at the door and knock. If anyone hears my voice and opens the door, I will come in.',body:'The most remarkable image in the Bible: God knocking on the door of a human heart and waiting. He doesn\'t force entry. He won\'t override your will. He knocks. He waits. And the latch is always on the inside.',reflect:'Is there an area of your life where Jesus is knocking and you haven\'t opened the door yet? What\'s stopping you?',prayer:'Lord, I open the door. Come in — into every room, even the ones I\'ve kept closed. You are welcome in all of me. Amen.'},
  {title:'A Cheerful Giver',verse:'2 Corinthians 9:7',scripture:'Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.',body:'Cheerful in Greek is hilaros — where we get the word hilarious. God loves a giver who gives with joy, almost laughing at the delight of it. Giving born from guilt or pressure misses the whole point. Generosity should come from abundance of heart.',reflect:'What is your posture when you give — grudging, dutiful, or genuinely cheerful? What would shift your attitude?',prayer:'God, make me a hilarious giver — someone who gives with such joy it almost seems over the top. Amen.'},
  {title:'The Rock That Follows',verse:'1 Corinthians 10:4',scripture:'They drank from the spiritual rock that accompanied them, and that rock was Christ.',body:'Paul describes Israel in the wilderness drinking from a rock that followed them. Wherever they went, provision went with them. Christ isn\'t just at church or in your quiet time — He\'s with you in the desert, at school, at work, in every ordinary moment.',reflect:'Do you practice the presence of Christ throughout your day, or does He stay in the "spiritual" compartment of your life?',prayer:'Lord, help me be aware of You following me through every moment of this day — in the mundane and the difficult. Amen.'},
  {title:'Not Ashamed',verse:'Romans 1:16',scripture:'For I am not ashamed of the gospel, because it is the power of God that brings salvation to everyone who believes.',body:'Paul wrote this to the capital of the empire — the most powerful, sophisticated city in the world. And he said: I am not ashamed. The gospel doesn\'t need the approval of the powerful. It is power. It needs only to be declared.',reflect:'Is there any context in your life where you feel ashamed of your faith? What is the shame protecting?',prayer:'God, free me from the shame that silences me. The gospel is the power of God — help me live and speak like I believe that. Amen.'},
  {title:'Faithful in Affliction',verse:'Lamentations 3:22-23',scripture:'Because of the LORD\'s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.',body:'These words were written in the rubble of Jerusalem\'s destruction. Jeremiah had lost everything. And from that devastation he writes about mercy that never fails and faithfulness that shows up fresh every morning. Not despite the pain — in the middle of it.',reflect:'What morning this week could you declare "great is Your faithfulness" — not because everything is fine, but because He hasn\'t left?',prayer:'Lord, great is Your faithfulness — even in my hardest season. Your mercies meet me every morning. Thank You. Amen.'},
  {title:'Do Justice',verse:'Isaiah 1:17',scripture:'Learn to do right; seek justice. Defend the oppressed. Take up the cause of the fatherless; plead the case of the widow.',body:'God\'s concern for justice isn\'t political — it\'s personal. He has always been on the side of those who can\'t defend themselves. Faith that doesn\'t move toward the vulnerable is incomplete. The orphan and widow are on God\'s heart. Are they on yours?',reflect:'Who in your community is vulnerable, overlooked, or without an advocate? What is one thing you could do this week?',prayer:'God, break my heart for what breaks Yours. Make me someone who defends the vulnerable and seeks justice for the oppressed. Amen.'},
  {title:'A Lamp to My Feet',verse:'Psalm 119:105',scripture:'Your word is a lamp for my feet, a light on my path.',body:'A lamp to your feet doesn\'t illuminate the whole road — just the next step. God rarely gives you the full plan. He gives you enough light for right now. The invitation is to trust Him one step at a time, one day at a time.',reflect:'What decision or direction are you asking God for the full picture on? What if He\'s only offering the next step?',prayer:'Lord, I trust Your lamp. I don\'t need to see the whole road. Give me light for my next step and I will follow. Amen.'},
  {title:'Sharpened by Community',verse:'Proverbs 27:17',scripture:'As iron sharpens iron, so one person sharpens another.',body:'Sharpening requires friction. If you only spend time with people who agree with you, affirm you, and never challenge you — you\'ll stay dull. Real community includes people who ask hard questions, call you higher, and love you enough to say what you need to hear.',reflect:'Who in your life sharpens you? Who do you sharpen? Is that relationship active right now?',prayer:'Lord, give me relationships that make me better. And make me the kind of friend who sharpens others with grace and truth. Amen.'},
  {title:'The God of the Valley',verse:'1 Kings 20:28',scripture:'Because the Arameans think the LORD is a god of the hills and not a god of the valleys, I will deliver this vast army into your hands.',body:'The enemy\'s strategy was to lure Israel down from the hills — reasoning that God only worked in high places. God\'s answer: I\'m the God of the valleys too. He is not only present in the mountaintop moments. He\'s equally powerful in the low places.',reflect:'Are you in a valley right now? What would it mean to trust that God is just as powerful here as He is on the mountaintop?',prayer:'God of the valley, remind me that You are not limited to my high seasons. Meet me here in this low place. Amen.'},
  {title:'The Weight of Glory',verse:'2 Corinthians 4:17',scripture:'For our light and momentary troubles are achieving for us an eternal glory that far outweighs them all.',body:'Paul calls his troubles "light and momentary" — yet he was beaten, shipwrecked, imprisoned, and left for dead. He\'s not minimizing pain. He\'s recalibrating perspective. Compared to eternity, even the heaviest suffering is brief. And it\'s producing something of infinite weight.',reflect:'How does an eternal perspective change how you view your current hardship?',prayer:'Lord, help me see my trials in light of eternity. Not to dismiss the pain, but to trust that You are using it. Amen.'},
  {title:'The Potter\'s Hands',verse:'Jeremiah 18:6',scripture:'"Can I not do with you, Israel, as this potter does?" declares the LORD. "Like clay in the hand of the potter, so are you in my hand."',body:'Clay doesn\'t resist the potter\'s hands. It yields. It takes the shape the potter intends. The invitation in this metaphor is surrender — letting God shape you into what He has in mind rather than fighting to hold the shape you chose for yourself.',reflect:'Where are you resisting the Potter\'s hands right now? What shape are you clinging to that God might be reshaping?',prayer:'Lord, I am clay in Your hands. Shape me. I stop resisting. Make me into what You\'ve always intended. Amen.'},
  {title:'No Condemnation',verse:'Romans 8:1',scripture:'Therefore, there is now no condemnation for those who are in Christ Jesus.',body:'Now. Present tense. Not someday when you\'re good enough — now. No condemnation means the verdict has been declared: not guilty. The court is closed. You can stop trying your own case. The Judge has already spoken.',reflect:'Do you live like someone who has been declared not guilty, or do you carry the weight of self-condemnation? What would change if you truly believed this?',prayer:'Father, I receive it: no condemnation. Help me stop rehearsing the case You\'ve already dismissed. Amen.'},
  {title:'Transformed by Renewal',verse:'Romans 12:2',scripture:'Do not conform to the pattern of this world, but be transformed by the renewing of your mind.',body:'Transformation isn\'t behavior modification — it starts in the mind. What you think shapes what you feel, which drives what you do. The world constantly patterns your thinking through media, culture, and comparison. The Bible rewires you from the inside out.',reflect:'What messages are you absorbing most this week — from the world or from the Word? What\'s being shaped by what?',prayer:'God, renew my mind daily. Interrupt the world\'s patterns with Your truth. Transform me from the inside out. Amen.'},
  {title:'The Lord\'s Prayer',verse:'Matthew 6:9',scripture:'This, then, is how you should pray: "Our Father in heaven, hallowed be your name."',body:'Jesus teaches prayer not as a ritual to perform but as a relationship to inhabit. The address alone is revolutionary: Our Father. Not a distant deity — a dad. The most powerful Being in the universe and He wants to be called Father.',reflect:'Pray through each line of the Lord\'s Prayer slowly today. Don\'t rush it. Let each phrase actually mean something.',prayer:'Our Father in heaven, hallowed be Your name. Your kingdom come, Your will be done. Give us today our daily bread. Forgive us our debts as we forgive our debtors. Lead us not into temptation. Deliver us from evil. Amen.'},
  {title:'Sufficient Grace',verse:'2 Corinthians 12:9',scripture:'My grace is sufficient for you, for my power is made perfect in weakness.',body:'God said this to Paul after Paul begged three times for relief. The answer wasn\'t yes. It was: My grace is enough. Sufficient doesn\'t mean just barely enough — it means more than adequate. Grace covers what strength cannot.',reflect:'Where in your life do you need to hear "My grace is sufficient"? Let God say it to you today.',prayer:'Lord, Your grace is enough. Even here, even now, even in this. I stop striving and I rest in Your sufficiency. Amen.'},
  {title:'The Fullness of Time',verse:'Galatians 4:4',scripture:'But when the set time had fully come, God sent his Son.',body:'The Incarnation happened at the precise moment in history God had chosen before time began. Not too early. Not too late. God operates on a perfect schedule. Whatever you\'re waiting for — He knows the right time, and His timing is never accidental.',reflect:'What are you waiting for that feels long overdue? Can you trust that God\'s timing is as precise as it was for the Incarnation?',prayer:'Lord, Your timing is perfect — even when it doesn\'t feel that way. Help me trust Your "set time" for what I\'m waiting for. Amen.'},
  {title:'Whoever Is Thirsty',verse:'Revelation 22:17',scripture:'Let the one who is thirsty come; and let the one who wishes take the free gift of the water of life.',body:'The last invitation in the Bible. Free. To anyone who is thirsty. Not the righteous, not the qualified — whoever is thirsty. The only requirement is want. The only barrier is not wanting it.',reflect:'What are you most thirsty for in your soul right now? Is it something God can fill?',prayer:'Lord, I\'m thirsty. I come to You with that thirst. Fill me with the water of life that actually satisfies. Amen.'},
  {title:'The Day of Small Things',verse:'Zechariah 4:10',scripture:'Who dares despise the day of small things?',body:'God is in the small things. The beginning of the temple reconstruction looked embarrassingly small — a pile of rubble and a handful of workers. But God said: don\'t despise this. Small faithful beginnings are how great things start.',reflect:'What small, faithful thing are you doing right now that feels insignificant? What if it\'s the foundation for something much larger?',prayer:'Lord, help me not despise the small beginnings. Faithful in little, faithful in much. I trust You with the small today. Amen.'},
  {title:'Made Alive',verse:'Ephesians 2:4-5',scripture:'But because of his great love for us, God, who is rich in mercy, made us alive with Christ even when we were dead in transgressions.',body:'You were spiritually dead — not sick, not wounded, not struggling. Dead. And God\'s response was not to wait for you to revive yourself. He made you alive. This is grace: life given to people who had no power to generate it.',reflect:'Do you tend to think of salvation as something you participated in, or something God did to you while you were dead? How does that change your view of grace?',prayer:'Father, I was dead. You made me alive. I take no credit for that — only gratitude. Thank You. Amen.'},
  {title:'The Spirit Searches',verse:'1 Corinthians 2:10',scripture:'The Spirit searches all things, even the deep things of God.',body:'You have access — through the Holy Spirit — to the deep things of God. Not the surface. The depths. Things angels desire to look into. The same Spirit that knows the mind of God lives inside every believer. This is extraordinary access.',reflect:'Are you taking advantage of the access you have to God through the Holy Spirit? How could your prayer life reflect this more?',prayer:'Holy Spirit, search the depths of God on my behalf. And search the depths of my heart — reveal what needs to change. Amen.'},
  {title:'The God Who Provides',verse:'Genesis 22:14',scripture:'Abraham called that place "The LORD Will Provide." And to this day it is said, "On the mountain of the LORD it will be provided."',body:'On the mountain where Abraham prepared to sacrifice his son, God provided the ram. Jehovah Jireh — the Lord who sees ahead and provides. He sees what you need before you get to the moment of need. His provision precedes your crisis.',reflect:'Think of a time God provided in a way you couldn\'t have arranged yourself. Let that build your faith for what you\'re currently facing.',prayer:'Jehovah Jireh, You have always provided. I trust You to provide again — in the way You know is best. Amen.'},
  {title:'Steadfast Love',verse:'Psalm 136:1',scripture:'Give thanks to the LORD, for he is good. His love endures forever.',body:'This psalm repeats "his love endures forever" twenty-six times. The repetition is intentional — it\'s hammering a truth into you. His love is not seasonal, not conditional, not dependent on your performance. It endures. Forever.',reflect:'What would your emotional life look like if you truly believed His love for you endures forever — unchanging, unshakeable?',prayer:'Lord, Your love endures forever. Not sometimes. Not when I deserve it. Forever. Help me build my life on that bedrock. Amen.'},
  {title:'A Broken and Contrite Heart',verse:'Psalm 51:17',scripture:'My sacrifice, O God, is a broken spirit; a broken and contrite heart you, God, will not despise.',body:'David wrote this after his greatest failure. He\'d lost everything worth presenting to God — and he offers the one thing God actually wants: honesty about the wreckage. God never turns away from genuine brokenness. It\'s the most powerful prayer posture there is.',reflect:'Are you carrying a failure or sin you\'ve been afraid to bring to God in full honesty? Bring it. He will not despise a contrite heart.',prayer:'Lord, here is my broken heart. I don\'t hide the mess. I offer it to You knowing You won\'t turn away. Amen.'},
  {title:'The Peace That Guards',verse:'Philippians 4:7',scripture:'And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',body:'This peace doesn\'t make sense by human logic. It shows up in circumstances where peace should be impossible — and it guards. Like a sentry at the gate of your heart and mind, keeping anxiety from storming in. It\'s not something you produce. It\'s something you receive.',reflect:'Is the peace of God guarding your heart right now, or is anxiety on patrol? What would it take to shift that?',prayer:'God, stand guard over my heart and mind. Give me the peace that doesn\'t make sense. I receive it by faith. Amen.'},
  {title:'Whatever You Do',verse:'1 Corinthians 10:31',scripture:'So whether you eat or drink or whatever you do, do it all for the glory of God.',body:'Whatever you do. Not just church. Not just Bible study. Whatever — eating, working, exercising, having a conversation, doing homework. Every ordinary action can be an act of worship when it\'s done with God in mind.',reflect:'What ordinary part of your day could you consciously offer to God as worship today?',prayer:'Lord, I offer You my ordinary today. The meals, the commute, the work, the conversations. Let all of it be for Your glory. Amen.'},
  {title:'Blessed to Be a Blessing',verse:'Genesis 12:2',scripture:'I will make you into a great nation, and I will bless you; I will make your name great, and you will be a blessing.',body:'God\'s promise to Abraham wasn\'t just personal blessing — it had a purpose clause: you will be a blessing. You\'re not the end point of God\'s generosity. You\'re a conduit. The blessing was always meant to flow through you to others.',reflect:'How are you currently a blessing to others — not just receiving from God, but passing it on?',prayer:'Lord, let everything You pour into me flow out to others. Make me a conduit, not just a container. Amen.'},
  {title:'The Great Commission',verse:'Matthew 28:19',scripture:'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.',body:'This is the last command Jesus gave before He ascended — which means it was the most pressing thing on His heart. Not go and be comfortable. Not go and build impressive buildings. Go and make disciples. This is the mission.',reflect:'Who in your life are you actively helping grow in their faith? Who could you be discipling?',prayer:'Lord, show me who I\'m supposed to be discipling. Give me the courage to invest in someone else\'s spiritual growth. Amen.'},
  {title:'He Hears the Cry',verse:'Exodus 3:7',scripture:'The LORD said, "I have indeed seen the misery of my people in Egypt. I have heard them crying out because of their slave drivers, and I am concerned about their suffering."',body:'Four hundred years. Israel had been in bondage for four centuries — and God says: I have heard. I have seen. I am concerned. Silence from heaven isn\'t indifference. He was preparing a deliverer the whole time. He hears your cry too.',reflect:'Have you felt like your cries to God have gone unheard? Bring them again — He sees, He hears, He is concerned.',prayer:'Lord, I believe You hear me. Even when the answer hasn\'t come, You are concerned about my suffering. I trust You. Amen.'},
  {title:'The Lord Is My Light',verse:'Psalm 27:1',scripture:'The LORD is my light and my salvation — whom shall I fear? The LORD is the stronghold of my life — of whom shall I be afraid?',body:'Two questions that answer themselves. If God is your light — darkness has no power. If God is your stronghold — your enemies have no ultimate authority. The logic of faith is: if God is for me, what can actually threaten me?',reflect:'What fear is currently biggest in your life? Walk it through the logic of this verse.',prayer:'Lord, You are my light and my salvation. I will not be afraid. Let this truth be louder than my fear today. Amen.'},
  {title:'Abraham\'s Faith',verse:'Romans 4:20-21',scripture:'Yet he did not waver through unbelief regarding the promise of God, but was strengthened in his faith and gave glory to God, being fully persuaded that God had power to do what he had promised.',body:'Abraham was 100 years old, his wife was 90, and he was fully persuaded God would do what He said. That\'s not naive optimism — that\'s faith that has thought through who God is and concluded: He can do it. Fully persuaded.',reflect:'What promise of God do you need to become "fully persuaded" about? What would it take to get there?',prayer:'God, strengthen my faith the way Abraham\'s was strengthened. Make me fully persuaded that You can do what You\'ve promised. Amen.'},
  {title:'The Way of Escape',verse:'1 Corinthians 10:13',scripture:'God is faithful; he will not let you be tempted beyond what you can bear. But when you are tempted, he will also provide a way out.',body:'The way of escape is always there — it\'s whether you take it. God doesn\'t remove temptation entirely; He provides an exit every time. The exit might be an early exit from the conversation, a call to a friend, a moment of prayer. Look for it.',reflect:'What is your most persistent temptation? What has God\'s provided "way of escape" looked like in those moments?',prayer:'Lord, in my next moment of temptation, help me see the way out You have provided. Give me the will to take it. Amen.'},
  {title:'The Spirit Groans',verse:'Romans 8:26',scripture:'The Spirit himself intercedes for us through wordless groans.',body:'When you don\'t have words — when the pain is too deep, the grief too heavy, the confusion too thick — the Holy Spirit translates your heart to the Father in groans that language can\'t carry. You never have to have the right words. Just show up.',reflect:'When is the last time you were in prayer and didn\'t know what to say? Did you know the Spirit was interceding even then?',prayer:'Holy Spirit, intercede for me today in the places I don\'t have words. Carry what I cannot express to the Father. Amen.'},
  {title:'Disciplined, Not Punished',verse:'Hebrews 12:6',scripture:'Because the Lord disciplines the one he loves, and he chastens everyone he accepts as his son.',body:'Discipline is one of the clearest signs of love. A parent who lets a child do whatever they want isn\'t loving — they\'re neglecting. When God disciplines you, it\'s proof of relationship, not rejection. The hard season might be His training, not His punishment.',reflect:'Is there a difficult season you\'re in that might be God\'s discipline rather than His abandonment? What might He be forming in you?',prayer:'Lord, if this is Your discipline, I receive it. Train me. I trust that You discipline those You love. Amen.'},
  {title:'The Fourth Man',verse:'Daniel 3:25',scripture:'He said, "Look! I see four men walking around in the fire, unbound and unharmed, and the fourth looks like a son of the gods."',body:'Three men were thrown into the fire for refusing to bow. And in the fire — someone else showed up. They didn\'t come out of the fire; they walked through it with company. That\'s the promise: not that you won\'t go through fire, but that you won\'t go alone.',reflect:'Where is the fire in your life right now? Can you sense the Fourth Man with you in it?',prayer:'Lord, be with me in the fire. I know I will not walk through it alone. I trust You are here in the heat. Amen.'},
  {title:'The Greatest in the Kingdom',verse:'Matthew 18:4',scripture:'Therefore, whoever takes the lowly position of this child is the greatest in the kingdom of heaven.',body:'A child in the ancient world had no status, no power, no rights. Jesus takes a child, puts them in the center, and says: this is the model of greatness in My kingdom. Not the powerful, the prominent, or the accomplished. The humble.',reflect:'Where in your life are you grasping for status or recognition? What would childlike humility look like there?',prayer:'Lord, make me great in Your kingdom — which means making me small in my own eyes. Give me genuine, childlike humility. Amen.'},
  {title:'Strength to Strength',verse:'Psalm 84:7',scripture:'They go from strength to strength, till each appears before God in Zion.',body:'The pilgrims on the road to Jerusalem didn\'t grow weaker as the journey went on — they grew stronger. This is the arc of the Christian life: not decline and exhaustion, but growing strength the further you go with God.',reflect:'Do you feel like you\'re going from strength to strength, or are you running on empty? What might need to change?',prayer:'Lord, let me be someone who grows stronger with each season, not weaker. Renew my strength as I keep walking toward You. Amen.'},
  {title:'The Hidden Manna',verse:'Revelation 2:17',scripture:'To the one who is victorious, I will give some of the hidden manna.',body:'Jesus promises His overcomers hidden sustenance — spiritual nourishment that the world around them can\'t see or access. Those who press through difficulty with faith receive a kind of provision that only comes through perseverance. You can\'t get it any other way.',reflect:'What spiritual nourishment have you received in a difficult season that you couldn\'t have received in comfort?',prayer:'Lord, feed me with the hidden manna that only comes through faithful endurance. Give me what can only be found in the hard places. Amen.'},
  {title:'Live Worthy',verse:'Ephesians 4:1',scripture:'I urge you to live a life worthy of the calling you have received.',body:'Paul writes from prison to urge believers to live worthy. Not to earn the calling — they already have it. But to walk in a way that reflects it. There\'s a calling on your life. The question is whether you\'re living up to the level of what you\'ve been given.',reflect:'What does a life "worthy of the calling" look like specifically for you — your relationships, work, habits, character?',prayer:'Lord, help me live in a way that is worthy of what You\'ve called me to. Not to earn it — but to honor it. Amen.'},
  {title:'Where Two or Three Gather',verse:'Matthew 18:20',scripture:'For where two or three gather in my name, there am I with them.',body:'You don\'t need a massive congregation for God to show up. Two people. Three people. Gathered in His name. He is there. The presence of Christ isn\'t reserved for large venues and professional worship teams — it\'s available wherever genuine believers gather.',reflect:'Who could you gather with this week for prayer, Scripture, or spiritual conversation? Could be just one other person.',prayer:'Lord, show up in my small gatherings. Remind me that where I meet in Your name, You are present. Amen.'},
  {title:'Seek the Lord While He May Be Found',verse:'Isaiah 55:6',scripture:'Seek the LORD while he may be found; call on him while he is near.',body:'There is an urgency in this verse. Not because God disappears — but because seasons of nearness, openness of heart, and spiritual responsiveness are precious and shouldn\'t be wasted. The moments when you feel drawn to God are invitations. Don\'t ignore them.',reflect:'Do you sense God drawing you toward something right now? Don\'t let that moment pass. Respond to it today.',prayer:'Lord, I hear the invitation. I seek You while You may be found. Meet me in this season of seeking. Amen.'},
  {title:'Spiritual Gifts',verse:'1 Corinthians 12:7',scripture:'Now to each one the manifestation of the Spirit is given for the common good.',body:'Spiritual gifts aren\'t trophies — they\'re tools for the common good. Every believer has one. Not just pastors and missionaries. You have a gift of the Spirit, and it was given specifically to help the people around you, not to impress them.',reflect:'Do you know what your spiritual gift is? How actively are you using it to serve others?',prayer:'Holy Spirit, show me my gifts. And show me who needs them. Help me stop sitting on what You\'ve given me to serve others. Amen.'},
  {title:'The High Priestly Prayer',verse:'John 17:21',scripture:'That all of them may be one, Father, just as you are in me and I am in you.',body:'The night before He died, Jesus prayed for unity among His followers. He knew the greatest threat to the church wasn\'t persecution from outside — it was division from within. Unity isn\'t uniformity. It\'s choosing love over being right.',reflect:'Is there a relationship in your faith community that is fractured or distant? What would one step toward unity look like?',prayer:'Jesus, I join Your prayer for unity. Help me prioritize it in my relationships — especially the hard ones. Amen.'},
  {title:'Mighty in Battle',verse:'Psalm 24:8',scripture:'Who is this King of glory? The LORD strong and mighty, the LORD mighty in battle.',body:'The God you follow is not passive or weak. He is mighty in battle. When you face opposition — spiritual, relational, circumstantial — you\'re not fighting alone and you\'re not fighting with weak reserves. The King of Glory is on your side.',reflect:'What battle are you currently in that you need to remember the King of Glory is fighting with you?',prayer:'King of Glory, fight for me today. I am not alone in this. You are strong and mighty — and You are mine. Amen.'},
  {title:'Abide in His Love',verse:'John 15:9',scripture:'As the Father has loved me, so have I loved you. Now remain in my love.',body:'The love Jesus has for you is the same quality of love the Father has for Jesus. The eternal, infinite, unshakeable love within the Trinity — that love has been extended to you. Remain in it. Don\'t wander out. Stay.',reflect:'What tends to pull you out of the awareness of God\'s love — busyness, failure, distraction? What helps you return?',prayer:'Lord, help me remain in Your love today. Not drift in and out — but stay, abide, rest in it all day long. Amen.'},
  {title:'Eternal Life, Now',verse:'John 17:3',scripture:'Now this is eternal life: that they know you, the only true God, and Jesus Christ, whom you have sent.',body:'Eternal life isn\'t just the quantity of life — it\'s the quality. It\'s not merely living forever; it\'s knowing God. That knowing starts now. Eternal life has already begun for every believer. The life of the age to come has broken into the present.',reflect:'Do you experience your relationship with God as eternal life beginning now, or do you think of eternal life as something that starts when you die?',prayer:'Lord, let the eternal life I have in You be alive and real today — not a future promise, but a present reality. Amen.'},
  {title:'The Throne of Grace',verse:'Hebrews 4:16',scripture:'Let us then approach God\'s throne of grace with confidence, so that we may receive mercy and find grace to help us in our time of need.',body:'Confidence. Not timidity, not groveling, not hoping you\'ve been good enough to get an audience. With confidence. The throne of the universe is called a throne of grace — and you are invited to approach it directly, boldly, any time you need help.',reflect:'What do you need from God right now? Go to the throne of grace with confidence and ask.',prayer:'Father, I approach Your throne with confidence — not because of who I am, but because of what Jesus has done. I need grace for [name it]. Amen.'},
  {title:'The Helmet of Salvation',verse:'Ephesians 6:17',scripture:'Take the helmet of salvation and the sword of the Spirit, which is the word of God.',body:'The helmet protects the mind — the place where spiritual battles are most often fought. Knowing your salvation is secure protects your thinking from the enemy\'s whispers of doubt, condemnation, and unworthiness. What you believe about your standing with God determines how you fight.',reflect:'Do you wear the helmet? Or do you fight with your mind exposed — doubting your salvation, entertaining condemnation?',prayer:'Lord, I put on the helmet of salvation. My standing is secure. Protect my mind from the lies of the enemy today. Amen.'},
  {title:'A Good Name',verse:'Proverbs 22:1',scripture:'A good name is more desirable than great riches; to be esteemed is better than silver or gold.',body:'Reputation is built slowly and lost quickly. A good name means people know they can trust you, that your character is consistent, that you are who you claim to be. That\'s worth more than any financial achievement.',reflect:'What does your reputation say about you — among your family, your friends, your coworkers? Is it the name you want?',prayer:'Lord, help me build a name worth having — not famous, but trustworthy. Known for integrity, love, and faithfulness. Amen.'},
  {title:'The Lord Watches Over You',verse:'Psalm 121:7-8',scripture:'The LORD will keep you from all harm — he will watch over your life; the LORD will watch over your coming and going both now and forevermore.',body:'Coming and going — all of it. The arriving and the leaving, the beginning and the ending, the ordinary movements of your ordinary life. God\'s watch is constant, comprehensive, and unending. You are never outside His sight.',reflect:'Is there an area of your life where you feel unprotected or exposed? Invite God\'s watchfulness over it specifically.',prayer:'Lord, I rest under Your watch. You see my coming and my going. Keep me — now and forevermore. Amen.'},
  {title:'Speaking Truth in Love',verse:'Ephesians 4:15',scripture:'Instead, speaking the truth in love, we will grow to become in every respect the mature body of him who is the head, that is, Christ.',body:'Truth without love is cruelty. Love without truth is flattery. Maturity holds both — caring enough to tell the truth and loving enough to do it with gentleness. The goal is always growth, not winning.',reflect:'Is there a truth you need to speak to someone that you\'ve been avoiding? Or a truth you\'ve been delivering without love?',prayer:'Lord, help me speak truth with love in every hard conversation. Give me both the courage and the gentleness to do it well. Amen.'},
  {title:'The Spirit of Adoption',verse:'Romans 8:15',scripture:'The Spirit you received does not make you a slave, so that you live in fear again; rather, the Spirit you received brought about your adoption to sonship. And by him we cry, "Abba, Father."',body:'Abba is an Aramaic term of family intimacy — like Daddy. The Spirit doesn\'t make you a religious performer trying to earn approval. He makes you a child who can run to the Father. That changes everything about how you relate to God.',reflect:'Do you relate to God more like a servant trying to earn favor, or like a child who knows they belong? What would the shift feel like?',prayer:'Abba, Father — I call You that. Not because I\'ve earned it, but because Your Spirit has made me Your child. Amen.'},
  {title:'Overcoming the World',verse:'1 John 5:4',scripture:'For everyone born of God overcomes the world. This is the victory that has overcome the world, even our faith.',body:'The victory isn\'t something you\'re working toward — it\'s something you\'ve been born into. Being born of God means you carry the overcoming nature of Christ. Faith is not a feeling — it\'s the substance by which the impossible becomes real.',reflect:'What in your life do you need to approach with the posture of an overcomer rather than a victim?',prayer:'Lord, remind me that I am born of God and the victory is already mine. Help me live from that position today. Amen.'},
  {title:'Make the Most of Every Opportunity',verse:'Ephesians 5:16',scripture:'Making the most of every opportunity, because the days are evil.',body:'Time is finite. Opportunities don\'t repeat. The conversation you didn\'t have, the kindness you postponed, the word of encouragement you meant to say — these windows open and close. Paul says: buy back the time. Seize it.',reflect:'What opportunity have you been letting pass — in a relationship, in your faith, in serving someone? When will you act on it?',prayer:'Lord, help me be awake to every opportunity You place in front of me. I don\'t want to waste the moments You\'ve given me. Amen.'},
  {title:'Springs of Water',verse:'Isaiah 58:11',scripture:'You will be like a well-watered garden, like a spring whose waters never fail.',body:'This is the promise to those who practice justice and care for the vulnerable. Not a garden that needs constant watering from outside — but a spring that generates from within. Internal, self-sustaining flourishing that comes from being rooted in righteousness.',reflect:'What does your soul\'s "garden" look like right now — dry and parched, or well-watered and fruitful?',prayer:'Lord, make me a well-watered garden. Let Your living water flow through me so I am a source for others. Amen.'},
  {title:'He Lifts My Head',verse:'Psalm 3:3',scripture:'But you, LORD, are a shield around me, my glory, the one who lifts my head high.',body:'David wrote this when his own son was trying to kill him — fleeing for his life with head literally bowed. And he says: You lift my head. When shame, defeat, and betrayal press your head down, God is the One who lifts it back up. He restores dignity.',reflect:'Is there something pressing your head down right now — shame, failure, grief? Let God lift it.',prayer:'Lord, lift my head. In the middle of what is crushing me, restore my dignity and remind me of who I am in You. Amen.'},
  {title:'The Lord Your Healer',verse:'Exodus 15:26',scripture:'I am the LORD, who heals you.',body:'Jehovah Rapha — the Lord who heals. This name for God was given in the desert right after a bitter water was made sweet. He is not just the God of dramatic miracles — He\'s the God who makes bitter things sweet, who heals what hurts, who restores what was lost.',reflect:'What needs healing in your life right now — physical, emotional, relational, spiritual? Bring it to Jehovah Rapha.',prayer:'Jehovah Rapha, You are my healer. I bring You [name what needs healing]. I trust You to restore what is broken. Amen.'},
  {title:'Speaking Life Over Your Future',verse:'Numbers 13:30',scripture:'Then Caleb silenced the people before Moses and said, "We should go up and take possession of the land, for we can certainly do it."',body:'Twelve spies saw the same land. Ten saw giants and reported impossibility. Two — Caleb and Joshua — saw giants and reported possibility. Same facts, different faith. The minority report was the right one. Be a Caleb. Speak possibility over what God has promised.',reflect:'Where in your life are you giving the majority report — impossibility — when God has said otherwise?',prayer:'Lord, make me a Caleb. Help me speak possibility over the promises You\'ve given me, even when the giants are real. Amen.'},
  {title:'Healing in His Wings',verse:'Malachi 4:2',scripture:'But for you who revere my name, the sun of righteousness will rise with healing in its rays.',body:'The last book of the Old Testament ends with a sunrise. Healing coming with the dawn for those who revere God. After four hundred years of prophetic silence, this sunrise came in Bethlehem. For those who fear His name, healing always comes with the new morning.',reflect:'What healing are you waiting for that feels like a long night? The sun of righteousness will rise — it always does.',prayer:'Lord, I wait for Your sunrise. Bring the healing You\'ve promised with the dawn of a new season. Amen.'},
  {title:'No One Can Snatch',verse:'John 10:28-29',scripture:'I give them eternal life, and they shall never perish; no one will snatch them out of my hand.',body:'This is the security of the believer: held in the hand of Christ, and held in the hand of the Father. No one — not the enemy, not your worst day, not your greatest failure — can extract you from that grip. You are held.',reflect:'Do you live with the security of someone held in God\'s hands, or do you carry the anxiety of someone who might be dropped?',prayer:'Lord, I rest in the knowledge that no one can snatch me from Your hand. I am secure. Help me live from that place. Amen.'},
  {title:'He Satisfies the Thirsty',verse:'Psalm 107:9',scripture:'For he satisfies the thirsty and fills the hungry with good things.',body:'He doesn\'t partially satisfy. He doesn\'t tease. He fills. The spiritually hungry who come to God don\'t leave half-satisfied — they leave full. The world offers things that create more thirst. Only God provides satisfaction that lasts.',reflect:'Where have you been going to satisfy spiritual thirst with something that only increases it? What would turning to God look like?',prayer:'Lord, You satisfy the thirsty and fill the hungry. I bring my hunger and thirst to You today. Fill me. Amen.'},
  {title:'The Lord Your Banner',verse:'Exodus 17:15',scripture:'Moses built an altar and called it The LORD is my Banner.',body:'After a battle won only by prayer — Moses\'s arms lifted, Israel prevailed — Moses names God as the banner. In battle, a banner was the rallying point, the identity marker, the flag troops ran toward. God is your banner — your identity, your cause, your victory.',reflect:'What is the banner you\'re currently rallying around — achievement, approval, a relationship? Is it God?',prayer:'Lord, You are my banner. My identity is in You. My victory comes from You. I rally to Your name. Amen.'},
  {title:'Blessed in the City and Field',verse:'Deuteronomy 28:3',scripture:'You will be blessed in the city and blessed in the country.',body:'God\'s blessing isn\'t limited to the sacred or the spiritual. He blesses in the city — in commerce, in relationships, in public life. He blesses in the country — in the private, the agricultural, the hidden. Every territory of your life is available for His blessing.',reflect:'In what area of your life do you most doubt God\'s blessing can reach — work, finances, relationships?',prayer:'Lord, let Your blessing reach every territory of my life. Nothing is too secular or too ordinary for Your touch. Amen.'},
  {title:'Taught by God',verse:'1 Thessalonians 4:9',scripture:'You yourselves have been taught by God to love each other.',body:'Love isn\'t just a command to follow — it\'s something God teaches. He is the instructor of love, and He teaches primarily through experience: how He has loved you becomes the curriculum for how you love others. The classroom is your own life.',reflect:'What has God\'s love for you specifically taught you about how to love others?',prayer:'Lord, teach me love — not just as a concept, but as a practice. Let what You\'ve given me flow freely to those around me. Amen.'},
  {title:'The Covenant God',verse:'Deuteronomy 7:9',scripture:'Know therefore that the LORD your God is God; he is the faithful God, keeping his covenant of love to a thousand generations.',body:'A thousand generations. The math: if each generation is 25 years, that\'s 25,000 years of covenant faithfulness. This is not a God who makes promises lightly or forgets them over time. His commitment runs deeper than time itself.',reflect:'What covenant promise of God are you currently trusting? Let the depth of His track record build your confidence.',prayer:'Faithful God, You have kept Your covenant for a thousand generations. I trust You to keep it for mine. Amen.'},
  {title:'The Bread of Life',verse:'John 6:35',scripture:'Then Jesus declared, "I am the bread of life. Whoever comes to me will never go hungry."',body:'Bread was the staple of survival in the ancient world — you couldn\'t live without it. Jesus says He is the bread of life. Not a side dish, not a supplement — the fundamental nourishment. Without Him you can survive, but you cannot truly live.',reflect:'What have you been eating spiritually this week — the bread of life, or junk food substitutes?',prayer:'Jesus, I come to You hungry. You are the bread of life. Feed me with Yourself — with Your Word, Your presence, Your truth. Amen.'},
  {title:'Appointed for This',verse:'Esther 4:14',scripture:'And who knows but that you have come to your royal position for such a time as this?',body:'Esther was an orphan, a minority, in a foreign land — and God placed her in the palace for a specific moment. Your background, your position, your season — none of it is accidental. You are where you are for a reason. For such a time as this.',reflect:'Where in your life are you positioned in a way that feels significant? What might God be calling you to do there?',prayer:'Lord, like Esther, I believe I\'m here for such a time as this. Show me what You\'ve positioned me for. I\'m available. Amen.'},
  {title:'The Lord Is There',verse:'Ezekiel 48:35',scripture:'And the name of the city from that time on will be: THE LORD IS THERE.',body:'The last words of Ezekiel\'s vision. The new Jerusalem — the eternal city — has one defining characteristic: the Lord is there. Everything else about the city is amazing. But the ultimate destination is His presence. Heaven is not primarily about streets of gold. It\'s about God being there.',reflect:'If God\'s presence is the defining feature of the best possible eternity, what does that say about prioritizing His presence now?',prayer:'Lord, let "You are here" be the most important thing about wherever I am. Your presence is my home. Amen.'},
  {title:'The Spirit of Wisdom',verse:'Isaiah 11:2',scripture:'The Spirit of the LORD will rest on him — the Spirit of wisdom and of understanding, the Spirit of counsel and of might.',body:'These attributes of the Spirit that rested on the Messiah are available to every believer. Wisdom, understanding, counsel, might — these are pneumatological gifts. You don\'t have to navigate life on your best guess. You have access to divine wisdom.',reflect:'What decision right now needs wisdom beyond your own? Have you specifically asked the Spirit for it?',prayer:'Holy Spirit, rest on me with wisdom and understanding. Give me counsel in the decisions I\'m facing. I need more than my own judgment. Amen.'},
  {title:'The Year of the Lord\'s Favor',verse:'Isaiah 61:2',scripture:'To proclaim the year of the LORD\'s favor and the day of vengeance of our God, to comfort all who mourn.',body:'Jesus read this passage in the synagogue and said: today this is fulfilled in your hearing. The year of the Lord\'s favor is now — not a future calendar year, but a posture of grace toward all who come. The door of favor stands open.',reflect:'Do you approach God as if you\'re in the year of His favor, or as if His favor has to be earned or awaited?',prayer:'Lord, I live in Your favor. Not based on what I\'ve done but on what You\'ve declared. Help me walk in that reality. Amen.'},
  {title:'Immanuel',verse:'Matthew 1:23',scripture:'"The virgin will conceive and give birth to a son, and they will call him Immanuel" (which means "God with us").',body:'The whole message of Christmas is contained in one name: Immanuel. God didn\'t send a message. He didn\'t send a representative. He came Himself. He became one of us so He could be with us. God with us — the most extraordinary claim in human history.',reflect:'How does it change your day to remember that the God of the universe has specifically chosen to be with you?',prayer:'Immanuel, thank You for coming. For not staying distant. For becoming human to be with me. Let me live in the awareness of Your presence. Amen.'},
  {title:'The Lord Reigns',verse:'Psalm 93:1',scripture:'The LORD reigns, he is robed in majesty; the LORD is robed in majesty and armed with strength; indeed, the world is established, firm and secure.',body:'On the day everything feels out of control — the world is still established. Firm. Secure. Because the Lord reigns. Not trying to reign. Not hoping to hold on. He reigns. The chaos around you has not dethroned the King.',reflect:'What feels most out of control in your world right now? Set it against this truth: the Lord reigns.',prayer:'Lord, You reign. Whatever I see on the news, whatever is happening in my life — You are still on the throne. I rest in that. Amen.'},
  {title:'Transformed by Beholding',verse:'2 Corinthians 3:18',scripture:'And we all, who with unveiled faces contemplate the Lord\'s glory, are being transformed into his image with ever-increasing glory.',body:'Transformation happens through beholding. You become like what you look at. Fix your gaze on the glory of God — in Scripture, in worship, in prayer — and the transformation is automatic. Not by striving. By seeing.',reflect:'What do you spend the most time looking at — screens, comparisons, achievements? What would it look like to spend more time beholding God\'s glory?',prayer:'Lord, I fix my eyes on You. As I behold Your glory, transform me. I don\'t have to work up change — I just have to look at You. Amen.'},
  {title:'The Song of Moses',verse:'Exodus 15:2',scripture:'The LORD is my strength and my defense; he has become my salvation. He is my God, and I will praise him.',body:'This song was sung at the shore of the Red Sea — the greatest rescue in Israel\'s history. Still wet from the parted waters, they sang. Praise that comes immediately after deliverance is one of the purest forms. Don\'t wait to praise. Start singing while still at the shore.',reflect:'What deliverance has God recently brought you through? Have you stopped to praise Him for it?',prayer:'Lord, You are my strength and my song. I praise You for every Red Sea You\'ve parted in my life. Amen.'},
  {title:'Obedience in the Small',verse:'Luke 16:12',scripture:'And if you have not been trustworthy with someone else\'s property, who will give you property of your own?',body:'Jesus teaches that how you handle what isn\'t yours reveals whether you can be trusted with what will be. Faithfulness in small responsibilities is the interview for larger ones. The way you treat borrowed things — borrowed time, borrowed authority, borrowed resources — shows your character.',reflect:'Are you being faithful with what you\'ve been entrusted with right now — even the small things?',prayer:'Lord, let me be trustworthy with what isn\'t mine yet. Prove my faithfulness in small things and I\'ll trust You with the increase. Amen.'},
  {title:'He Prepares the Way',verse:'Isaiah 40:3',scripture:'A voice of one calling: "In the wilderness prepare the way for the LORD; make straight in the desert a highway for our God."',body:'Before the King arrives, the road is prepared. Before the breakthrough comes, God is already preparing the way. What looks like wilderness to you may be God\'s construction zone — the road is being built even when you can\'t see it.',reflect:'Where in your life does it look like wilderness? Could God be building a highway there right now?',prayer:'Lord, prepare the way in my wilderness. I trust that what looks barren is actually under construction. Amen.'},
  {title:'The Name Above Every Name',verse:'Philippians 2:9-10',scripture:'God exalted him to the highest place and gave him the name that is above every name, that at the name of Jesus every knee should bow.',body:'Every name — every power, every authority, every diagnosis, every debt, every fear — bows at the name of Jesus. Not someday. The declaration is already true. When you pray in the name of Jesus, you invoke the highest authority in the universe.',reflect:'What name — disease, failure, debt, addiction — do you need to declare under the name of Jesus?',prayer:'Jesus, Your name is above every other name. I declare [my specific situation] under Your authority. Every knee bows — including this. Amen.'},
  {title:'The Suffering Servant',verse:'Isaiah 53:3',scripture:'He was despised and rejected by mankind, a man of suffering, and familiar with pain.',body:'Jesus knows what rejection feels like. He knows grief. He knows what it is to have people turn their backs on you. He wasn\'t sheltered from the human experience of pain — He walked directly into it. He is not a distant, unmoved God. He is familiar with what you\'re going through.',reflect:'What suffering or rejection are you carrying that you can bring to the One who is familiar with pain?',prayer:'Jesus, You understand my pain from the inside. Not from a distance. Thank You for being familiar with what I\'m going through. Amen.'},
  {title:'Contentment With Godliness',verse:'1 Timothy 6:6',scripture:'But godliness with contentment is great gain.',body:'Paul didn\'t say godliness is great gain. He said godliness with contentment is great gain. The pairing matters. You can be religious and miserable — striving, comparing, never satisfied. True godliness produces contentment. If you have God, you have the greatest wealth.',reflect:'Are you godly and content, or godly and striving? What would it mean to fully receive what you already have in Christ?',prayer:'Lord, the combination of knowing You and being satisfied in You — that\'s the wealth I want. Help me live there. Amen.'},
  {title:'He Bore Our Griefs',verse:'Isaiah 53:4',scripture:'Surely he took up our pain and bore our suffering, yet we considered him punished by God.',body:'He took it up — voluntarily, purposefully. The word means to lift and carry. Jesus didn\'t observe your grief from heaven. He picked it up and carried it. The cross was not just about sin — it was about suffering. He bore both.',reflect:'What grief or suffering are you carrying that you haven\'t let Jesus bear? Will you let Him take it today?',prayer:'Jesus, I give You this grief: [name it]. You bore it on the cross. I release it to You and refuse to carry what You\'ve already carried. Amen.'},
  {title:'The Plans of the Lord',verse:'Psalm 33:11',scripture:'But the plans of the LORD stand firm forever, the purposes of his heart through all generations.',body:'Governments rise and fall. Economic systems collapse. Human plans evaporate. But the plans of the Lord stand firm forever. Not shaken by elections, not derailed by pandemics, not surprised by what surprises us. His purposes are generationally stable.',reflect:'What is shaking your world right now? How does the eternal stability of God\'s plans create a different foundation to stand on?',prayer:'Lord, Your plans are firm when everything around me is shifting. I anchor myself in Your purposes. You are not shaken. Amen.'},
  {title:'Washed and Made White',verse:'Isaiah 1:18',scripture:'"Come now, let us settle the matter," says the LORD. "Though your sins are like scarlet, they shall be as white as snow."',body:'Scarlet was the most permanent dye in the ancient world — once stained, it couldn\'t be removed. And God says: I will make it white as snow. This is the audacity of grace. The most set-in stains of your life are within His bleaching power.',reflect:'What stain in your past have you assumed God can\'t fully clean? Bring it to this verse.',prayer:'Lord, wash me. Make me as white as snow. I believe Your grace is more powerful than my most permanent stain. Amen.'},
  {title:'The Morning Star',verse:'Revelation 22:16',scripture:'"I, Jesus, have sent my angel to give you this testimony for the churches. I am the Root and the Offspring of David, and the bright Morning Star."',body:'The morning star appears in the darkest hour — just before the dawn. It\'s the signal that night is ending. Jesus calls Himself the Morning Star — the One who appears in your darkest hour as the signal that the dawn is coming. The darkness is not the end of the story.',reflect:'What feels like your darkest hour right now? The Morning Star is rising. Dawn is coming.',prayer:'Jesus, Morning Star, appear in my darkness. Be the signal that the dawn is near. I trust that the night is not the end. Amen.'},
  {title:'Holy Ground',verse:'Exodus 3:5',scripture:'"Do not come any closer," God said. "Take off your sandals, for the place where you are standing is holy ground."',body:'Moses was in the middle of an ordinary workday — tending sheep in the desert — when suddenly the ground became holy. God can make any ordinary place holy ground by showing up. You don\'t have to go to a special location to encounter Him. He meets you where you are.',reflect:'Where has God met you in an unexpected, ordinary moment? Could the ground you\'re standing on right now be holy?',prayer:'Lord, meet me in the ordinary places. Make the ground where I stand holy by Your presence. I take off my shoes. Amen.'},
  {title:'The Gates of Hell',verse:'Matthew 16:18',scripture:'And I tell you that you are Peter, and on this rock I will build my church, and the gates of Hades will not overcome it.',body:'Gates are defensive structures. Gates don\'t attack — they hold. Jesus is saying the church is on offense. Hell is not advancing on the church. The church is advancing on the gates of hell — and they will not hold. You are on the winning side of history.',reflect:'Do you live like someone on the offensive or the defensive? What would bold, gate-crashing faith look like in your life?',prayer:'Lord, remind me that I\'m on offense. Your church advances and the gates of hell cannot hold. Give me that courage. Amen.'},
  {title:'The Lord My Shepherd',verse:'Psalm 23:1',scripture:'The LORD is my shepherd, I lack nothing.',body:'Everything in Psalm 23 flows from this first verse. The Shepherd\'s job is to ensure the sheep lack nothing. Not that the sheep try hard and figure it out themselves — the Shepherd provides. Your role is to follow. His role is to ensure you have what you need.',reflect:'What do you feel like you\'re lacking right now? Name it. Bring it to the Shepherd.',prayer:'Lord, You are my Shepherd. I bring You my sense of lack and ask You to provide. I trust that under Your care, I lack nothing essential. Amen.'},
  {title:'He Gives Sleep',verse:'Psalm 127:2',scripture:'He grants sleep to those he loves.',body:'Worry steals sleep. The anxious lie awake rehearsing problems they can\'t solve. But God gives sleep as a gift — to those He loves, to those who have learned to trust. Sleep is an act of surrender. Lying down is saying: I\'m not in control. You are.',reflect:'Are you sleeping well? What does your sleep say about your level of trust in God?',prayer:'Lord, grant me sleep — the sleep of someone who trusts that You are watching while they rest. I give You my anxious nights. Amen.'},
  {title:'The Lord My Rock',verse:'Psalm 18:2',scripture:'The LORD is my rock, my fortress and my deliverer; my God is my rock, in whom I take refuge.',body:'Rock is the most stable, unchanging geological feature. It doesn\'t shift with the weather, bend with the wind, or move with the tide. When David calls God his rock — he\'s contrasting God with everything else in his life that was unstable. God is the immovable beneath your feet.',reflect:'What in your life is currently unstable? What would it look like to consciously stand on the Rock instead?',prayer:'Lord, You are my rock. When everything around me shifts, I plant my feet on You. You do not move. Amen.'},
  {title:'Walking in the Light',verse:'1 John 1:7',scripture:'But if we walk in the light, as he is in the light, we have fellowship with one another, and the blood of Jesus, his Son, purifies us from all sin.',body:'Walking in the light means living honestly before God and others — no hidden compartments, no double life, no gap between Sunday and Monday. And the result is fellowship and ongoing cleansing. Light doesn\'t expose to shame; it enables relationship.',reflect:'Is there any area of your life you\'re keeping in darkness — from God, from others? What would it take to bring it into the light?',prayer:'Lord, I choose to walk in the light. No hidden places. What I bring into the open, You cleanse. I trust the light more than I fear the exposure. Amen.'},
  {title:'The Least of These',verse:'Matthew 25:40',scripture:'"Truly I tell you, whatever you did for one of the least of these brothers and sisters of mine, you did for me."',body:'The hungry, the stranger, the sick, the prisoner — Jesus identifies Himself with the most marginalized. To serve them is to serve Him. To ignore them is to ignore Him. How you treat the most vulnerable person in the room is how you\'re treating Jesus.',reflect:'Who is "the least of these" in your world right now? What is one thing you could do for them — and therefore for Jesus?',prayer:'Jesus, give me eyes to see You in the vulnerable, the forgotten, the overlooked. Help me serve them as I would serve You. Amen.'},
  {title:'The Law Written on Hearts',verse:'Jeremiah 31:33',scripture:'"I will put my law in their minds and write it on their hearts. I will be their God, and they will be my people."',body:'The old covenant was written on stone — external, imposed, breakable. The new covenant is written on hearts — internal, transformative, living. God doesn\'t want people who follow rules reluctantly. He wants people who want what He wants because He\'s changed what they want.',reflect:'Is your obedience to God more external compliance or internal desire? What might need to change about that?',prayer:'Lord, write Your law on my heart — not just my behavior. Change what I want so that I want what You want. Amen.'},
  {title:'Come to the Waters',verse:'Isaiah 55:1',scripture:'"Come, all you who are thirsty, come to the waters; and you who have no money, come, buy and eat!"',body:'Free. The most extravagant offer in Scripture: come if you\'re thirsty, even if you have nothing to pay with. Grace is not a transaction — you can\'t earn it, buy it, or deserve your way into it. You can only receive it. Come. That\'s the whole instruction.',reflect:'Are you trying to earn what God is offering for free? What would receiving instead of striving look like today?',prayer:'Lord, I come — empty-handed, thirsty, with nothing to pay. I receive what You\'ve offered freely. Thank You for the grace I cannot earn. Amen.'},
  {title:'Grow in Grace',verse:'2 Peter 3:18',scripture:'But grow in the grace and knowledge of our Lord and Savior Jesus Christ.',body:'The Christian life is growth. Not arriving — growing. Grace is not just the entrance to salvation; it\'s the atmosphere of the whole journey. Growing in grace means becoming more and more shaped by the undeserved love of God until it becomes the lens through which you see everything.',reflect:'In what specific way have you grown in grace in the last year? Where do you still need to grow?',prayer:'Lord, grow me in grace. Let Your undeserved love become so natural in me that I extend it to others without thinking. Amen.'},
  {title:'He Will Complete It',verse:'Philippians 1:6',scripture:'Being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus.',body:'God is not a project abandoner. He doesn\'t start things He doesn\'t finish. The work He began in you when you first believed is still in progress — and He will see it through to completion. You are unfinished, not abandoned.',reflect:'Where do you feel most unfinished or incomplete? How does it help to know the One who started the work hasn\'t stopped?',prayer:'Lord, I trust that You who began a good work in me will finish it. I am Your work in progress, and I rest in that. Amen.'},
  {title:'To Him Who Is Able',verse:'Ephesians 3:20',scripture:'Now to him who is able to do immeasurably more than all we ask or imagine, according to his power that is at work within us.',body:'Immeasurably more. Your biggest ask doesn\'t strain God. Your greatest imagination doesn\'t reach the ceiling of what He can do. And notice: the power is already at work within you. The question isn\'t whether God can — it\'s whether you\'ll believe He will.',reflect:'What is the biggest, most audacious thing you could ask God for right now? Ask it. He is able to do immeasurably more.',prayer:'Lord, immeasurably more than I ask or imagine. I believe that. So I ask boldly: [ask it]. You are able. I trust You. Amen.'},
  {title:'Three Hundred and Sixty-Five',verse:'Lamentations 3:22-23',scripture:'Because of the LORD\'s great love we are not consumed, for his compassions never fail. They are new every morning.',body:'Every day of this year — all three hundred and sixty-five — His mercies were new. Every morning you woke up, they were waiting. You may have missed many of them. But they were there. He never had a day where He ran out of compassion for you. Not one.',reflect:'Look back over this year of devotionals. What has God been doing in you, building in you, healing in you? Write it down.',prayer:'Lord, a full year. You were faithful to every single day of it. Your mercies never failed. As I begin again tomorrow — great is Your faithfulness. Amen.'},
  {title:'The Cloud by Day',verse:'Exodus 13:21',scripture:'By day the LORD went ahead of them in a pillar of cloud to guide their way.',body:'God guided Israel through the wilderness with visible, tangible signs — cloud by day, fire by night. He didn\'t drop a map and leave them to figure it out. He was present, leading, every step of every day. He still guides — through Scripture, prayer, community, and circumstance.',reflect:'How has God been guiding you recently? Are you following the cloud, or are you running ahead of it?',prayer:'Lord, go before me today. I follow Your leading. Help me to move when You move and wait when You wait. Amen.'},
  {title:'The God Who Fights for You',verse:'Exodus 14:14',scripture:'The LORD will fight for you; you need only to be still.',body:'Moses said this with the Red Sea in front of them and Pharaoh\'s army behind. The most impossible situation — and the command is: be still. Sometimes the most powerful thing you can do in a crisis is stop striving and let God fight.',reflect:'What situation are you currently fighting in your own strength that you need to let God fight?',prayer:'Lord, I step back. I let You fight this. I will be still and trust that You are fighting for me. Amen.'},
  {title:'Renewed Day by Day',verse:'2 Corinthians 4:16',scripture:'Therefore we do not lose heart. Though outwardly we are wasting away, yet inwardly we are being renewed day by day.',body:'The body ages. Strength fades. But the inner life — the spirit, the character, the soul — is being renewed every single day. The Christian life runs counter to physical decline. As the outside diminishes, the inside deepens.',reflect:'What does your inner renewal look like practically? What are the habits that keep you renewed day by day?',prayer:'Lord, renew me inwardly every day. As my body ages, let my spirit deepen, strengthen, and grow more alive. Amen.'},
  {title:'Where Your Treasure Is',verse:'Matthew 6:21',scripture:'For where your treasure is, there your heart will be also.',body:'The direction runs both ways: your heart follows your treasure, and your treasure reveals your heart. If you want to know what you actually love most, look at where you invest your time, money, and emotional energy. That\'s the real answer.',reflect:'Where is your treasure currently? Does your actual investment of time and money match what you claim to value most?',prayer:'God, align my treasure with what truly matters. Help me invest in eternal things, not just temporary ones. Amen.'},
  {title:'The Acceptable Year',verse:'Luke 4:18-19',scripture:'The Spirit of the Lord is on me, because he has anointed me to proclaim good news to the poor... to proclaim the year of the Lord\'s favor.',body:'Jesus stood in His hometown synagogue and declared that the waiting was over. The year of favor had arrived. In Him, release from captivity, sight to the blind, freedom for the oppressed — all of it had come. He is still proclaiming it over you today.',reflect:'What captivity, blindness, or oppression in your life needs to hear the proclamation of the Lord\'s favor?',prayer:'Jesus, proclaim Your favor over my life today. Where I am captive, set me free. Where I am blind, open my eyes. Amen.'},
  {title:'The Gift of Eternal Life',verse:'Romans 6:23',scripture:'For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.',body:'Wages are earned. Gifts are given. You earned one thing from your life before Christ — death. God gave you something completely unearned — life. That\'s the most important economic transaction in the universe, and it cost God everything and cost you nothing.',reflect:'Do you treat salvation more like wages you\'ve worked for, or a gift you\'ve received? How does that show up in how you live?',prayer:'Father, thank You for the gift I could never earn. Eternal life — free, complete, permanent. I receive it with gratitude. Amen.'},
  {title:'Confidence Before God',verse:'1 John 3:21',scripture:'Dear friends, if our hearts do not condemn us, we have confidence before God.',body:'Confidence before God is the fruit of a clean conscience — living in the light, confessing quickly, staying close. When your heart isn\'t condemning you, you can approach God without the anxiety of hiding. Confession is the path to confidence.',reflect:'Is there anything between you and God right now that needs to be confessed? Bring it now — and walk into confidence.',prayer:'Lord, I confess [whatever needs confessing]. I receive Your cleansing. Now I come to You with confidence, not condemnation. Amen.'},
  {title:'He Turns Mourning to Dancing',verse:'Psalm 30:11',scripture:'You turned my wailing into dancing; you removed my sackcloth and clothed me with joy.',body:'David wrote this as someone who had been in the pit — sick, desperate, crying out. And he\'s writing to say: He turned it. Not immediately. But completely. The God who allowed the mourning is the same God who converts it to dancing. The story isn\'t over until He says it is.',reflect:'Is there a mourning in your life that you\'ve stopped believing could become dancing? Tell God about it.',prayer:'Lord, I trust the turning. You can take my mourning and convert it to joy. I wait for the dance. Amen.'},
  {title:'The Shield of Faith',verse:'Ephesians 6:16',scripture:'In addition to all this, take up the shield of faith, with which you can extinguish all the flaming arrows of the evil one.',body:'Flaming arrows were designed to set fire to what they hit — panic, fear, doubt, lust, despair. The shield of faith doesn\'t just deflect them — it extinguishes them. Faith in God\'s character and promises puts out the fires the enemy tries to start.',reflect:'What flaming arrow is currently hitting you hardest — fear, doubt, temptation? What truth of faith extinguishes it?',prayer:'Lord, I raise the shield of faith. Extinguish the flaming arrows aimed at my heart today. I trust who You are. Amen.'},
  {title:'Every Good and Perfect Gift',verse:'James 1:17',scripture:'Every good and perfect gift is from above, coming down from the Father of the heavenly lights, who does not change like shifting shadows.',body:'Every good thing in your life — health, relationships, talent, opportunity, beauty, laughter — has one source: the Father of lights. He doesn\'t change moods. He doesn\'t have an off day. Every good thing flows consistently from His unchanging goodness.',reflect:'Name three specific good gifts in your life right now. Trace them back to the Father who gave them.',prayer:'Father of lights, thank You for every good thing in my life. I trace each gift back to You with gratitude. You are the source of all that is good. Amen.'},
  {title:'The Lost Coin',verse:'Luke 15:9',scripture:'And when she finds it, she calls her friends and neighbors together and says, "Rejoice with me; I have found my lost coin."',body:'One coin. Out of ten. And she searches until she finds it, then throws a party. This is God\'s posture toward one lost person — not indifferent, not too busy, not writing them off. Sweeping the whole house until He finds what was lost. That\'s how He pursued you.',reflect:'Is there someone in your life who is lost? How does Jesus\'s parable shape how you pray for and relate to them?',prayer:'Lord, thank You for sweeping the whole house to find me. Give me Your heart for the lost people in my world. Amen.'},
  {title:'The Abundant Life',verse:'John 10:10',scripture:'I have come that they may have life, and have it to the full.',body:'The thief steals and destroys. Jesus gives life to the full — overflowing, abundant, more than enough. This isn\'t about material wealth. It\'s the fullness of being fully alive in your soul — purposeful, connected, at peace, growing. This is what Jesus came to give.',reflect:'Are you experiencing the abundant life Jesus promised, or a diminished version? What\'s the difference, and what might need to change?',prayer:'Jesus, I want the abundant life You came to give. Not just survival, not just religion — fullness. Lead me into it. Amen.'},
  {title:'Chosen for Holiness',verse:'1 Peter 1:16',scripture:'"Be holy, because I am holy."',body:'Holiness isn\'t stuffy religion — it\'s the word for being set apart, distinct, different in the best way. God is set apart from everything else by His perfection. He calls you to the same distinctiveness — not identical to the world around you, but shaped by something better.',reflect:'In what area of your life do you look identical to the world around you? What would holiness look like there?',prayer:'Lord, make me holy — not just moral, but genuinely different because I\'ve been with You. Set me apart for Your purposes. Amen.'},
  {title:'By His Spirit',verse:'Zechariah 4:6',scripture:'"Not by might nor by power, but by my Spirit," says the LORD Almighty.',body:'Zerubbabel faced an impossible rebuilding project — a demolished city and a demoralized people. God\'s answer: not by military strength, not by human effort — by My Spirit. The things God calls you to are too large for your own capacity. That\'s intentional.',reflect:'What are you trying to accomplish by might and power that needs to be accomplished by the Spirit?',prayer:'Lord, not by my strength but by Your Spirit. I stop relying on my capacity and invite Yours. Do what only Your Spirit can do. Amen.'},
  {title:'The Righteous Will Flourish',verse:'Psalm 92:12',scripture:'The righteous will flourish like a palm tree, they will grow like a cedar of Lebanon.',body:'Palm trees are remarkable — they bend in hurricanes but don\'t break, and they\'re most productive in old age. Cedars are famous for strength and longevity. The righteous person isn\'t just surviving — they\'re built for long-term flourishing, storm-resistant and deeply rooted.',reflect:'Are you more like a palm tree (flexible but rooted) or a tumbleweed (moving wherever the wind blows)?',prayer:'Lord, make me a palm tree — deeply rooted, storm-resistant, and increasingly fruitful as the years go on. Amen.'},
  {title:'God\'s Dwelling Place',verse:'Psalm 90:1',scripture:'Lord, you have been our dwelling place throughout all generations.',body:'Before there was a temple, a tabernacle, or a church building — God Himself was the dwelling place of His people. He is the home that doesn\'t need an address. Through exile, wilderness, and wandering, He was the place they lived.',reflect:'Do you treat God as your dwelling place — the home you return to — or more like a place you visit occasionally?',prayer:'Lord, be my dwelling place. Not a destination I visit but the home I live in. I make my home in You. Amen.'},
  {title:'Patient Hope',verse:'Romans 8:25',scripture:'But if we hope for what we do not yet have, we wait for it patiently.',body:'Waiting patiently is not passive resignation. It\'s active trust — believing strongly enough in what God has promised that you can wait without anxiety for its arrival. Patience is hope with staying power.',reflect:'What are you currently hoping for that requires patient waiting? What helps you wait well?',prayer:'Lord, give me hope that has staying power — patient enough to wait for what I cannot yet see but fully believe is coming. Amen.'},
  {title:'Living Sacrifice',verse:'Romans 12:1',scripture:'Offer your bodies as a living sacrifice, holy and pleasing to God — this is your true and proper worship.',body:'Old covenant worship involved dead sacrifices laid on altars. New covenant worship involves living sacrifices that climb on the altar every morning. The problem with a living sacrifice is it keeps climbing off. Worship is the daily decision to get back on.',reflect:'What altar are you being called to climb onto today — what surrender is God asking for?',prayer:'Lord, I present myself as a living sacrifice. I choose worship over comfort, surrender over control. I get back on the altar. Amen.'},
  {title:'The Right Hand of God',verse:'Acts 7:55-56',scripture:'Stephen... saw the glory of God, and Jesus standing at the right hand of God.',body:'Jesus is described as seated at the right hand of God — but when Stephen was being stoned, He was standing. As if Jesus stood up at the sight of His servant\'s faithfulness. Your suffering and faithfulness do not go unnoticed. The Son of God stands for you.',reflect:'When you\'re going through the hardest moments, how does it help to know Jesus is standing — attentive, present, watching?',prayer:'Jesus, stand for me in my hardest moments. I know You see every moment of faithfulness and suffering. I am not alone. Amen.'},
  {title:'Pure Religion',verse:'James 1:27',scripture:'Religion that God our Father accepts as pure and faultless is this: to look after orphans and widows in their distress and to keep oneself from being polluted by the world.',body:'James strips religion down to two things: care for the vulnerable and personal holiness. Not impressive services or theological correctness — those have their place. But the acid test of genuine faith is what you do for the defenseless and how you live privately.',reflect:'How is your faith showing up in care for vulnerable people? And how is your private life holding up to the standard of holiness?',prayer:'Lord, make my religion real — visible in how I care for the vulnerable and how I live when no one is watching. Amen.'},
  {title:'He Keeps His Promises',verse:'Joshua 21:45',scripture:'Not one of all the LORD\'s good promises to Israel failed; every one was fulfilled.',body:'Joshua wrote this survey of God\'s faithfulness at the end of his life: every single promise — fulfilled. Not most. Not almost all. Every one. The track record of God\'s promise-keeping spans every generation. What He has said, He has done.',reflect:'What promise of God are you most tempted to doubt right now? Let this verse be the counter-evidence.',prayer:'Lord, Your track record is perfect. Not one promise has failed. I trust You to be faithful to what You\'ve spoken to me. Amen.'},
  {title:'Shout for Joy',verse:'Psalm 47:1',scripture:'Clap your hands, all you nations; shout to God with cries of joy.',body:'Joy is not always quiet and contemplative. Sometimes it\'s loud. Sometimes it involves clapping and shouting. Don\'t shrink your worship into what feels dignified. Bring what you actually feel — and sometimes what you choose to feel before you feel it.',reflect:'When was the last time your worship was physically expressive — not performance, but genuine joy overflowing? What would it take?',prayer:'Lord, I shout for joy — not because I always feel it, but because of who You are. You are worthy of the noise. Amen.'},
  {title:'The Good Portion',verse:'Luke 10:42',scripture:'"but few things are needed — or indeed only one. Mary has chosen what is better, and it will not be taken away from her."',body:'Martha was busy serving — which isn\'t bad. Mary was sitting at Jesus\'s feet — which Jesus calls the one necessary thing. You can be active in service and spiritually absent. The good portion is His presence, and it requires choosing it over the urgent.',reflect:'Are you more Martha or Mary right now? What urgent thing might be crowding out the one necessary thing?',prayer:'Lord, help me choose the better portion — time at Your feet — even when the urgent things are calling. Amen.'},
  {title:'Fear God Alone',verse:'Matthew 10:28',scripture:'Do not be afraid of those who kill the body but cannot kill the soul. Rather, be afraid of the One who can destroy both soul and body in hell.',body:'Perspective on fear: the worst anyone can do is end your physical life. That\'s significant — but it\'s not the final word. When you rightly fear God — revere His authority over eternity — every lesser fear shrinks. The right fear liberates you from all the wrong ones.',reflect:'What fear is currently controlling your decisions? How does a proper fear of God put it in perspective?',prayer:'Lord, let a right reverence for You be so large in my heart that every lesser fear becomes small. You alone are worthy of ultimate reverence. Amen.'},
  {title:'The Light of Men',verse:'John 1:4',scripture:'In him was life, and that life was the light of all mankind.',body:'Before Jesus said "I am the light of the world" — John declared it in the prologue. The life that is in Christ is the light that illuminates every human being. He is not a light for some people — He is the light of all mankind. The whole world was meant to see by Him.',reflect:'Who in your world is living in darkness that you could point toward the Light?',prayer:'Jesus, You are the light of the world. Shine through me so others can find their way to You. Amen.'},
  {title:'All Authority',verse:'Matthew 28:18',scripture:'Then Jesus came to them and said, "All authority in heaven and on earth has been given to me."',body:'All. Not most. Not spiritual authority while earthly authorities do what they please. All authority — in heaven and on earth — belongs to Jesus. This is the foundation of the Great Commission. We go because He has all authority behind the going.',reflect:'What situation in your life needs to be submitted to the authority of Christ — where you\'ve been acting like you\'re in charge?',prayer:'Jesus, You have all authority. I submit [name the situation] to Your authority. I stop trying to be the one in charge. Amen.'},
  {title:'Righteousness Like a River',verse:'Amos 5:24',scripture:'But let justice roll on like a river, righteousness like a never-failing stream!',body:'God is not interested in religious performances from people who ignore injustice. He wants justice like a river — constant, flowing, powerful, life-giving. Not occasional acts of charity but a lifestyle of righteousness that flows without stopping.',reflect:'Does righteousness flow consistently from your life, or does it come in occasional bursts? What would a more consistent flow look like?',prayer:'Lord, let righteousness flow from my life like a river — not a performance, but a continuous, natural current. Amen.'},
  {title:'The Lord of Hosts',verse:'Isaiah 6:3',scripture:'"Holy, holy, holy is the LORD Almighty; the whole earth is full of his glory."',body:'Isaiah saw the throne room — seraphim covering their faces, the temple shaking, smoke filling the room. The holiness of God is not a gentle concept. It\'s terrifying in its purity and magnificent in its glory. The whole earth is full of it, if you have eyes to see.',reflect:'When was the last time you were genuinely awestruck by God\'s holiness? What would cultivate more of that awe?',prayer:'Holy, holy, holy is the Lord Almighty. The whole earth is full of Your glory. Let me see it today. Amen.'},
  {title:'Adopted Into the Family',verse:'Galatians 4:7',scripture:'So you are no longer a slave, but God\'s child; and since you are his child, God has made you also an heir.',body:'Slave vs. child vs. heir — three completely different relationships. A slave does what they\'re told and earns what they get. A child belongs. An heir inherits. You are all three in reverse: you were a slave, you became a child, and you are now an heir of everything God owns.',reflect:'Do you relate to God as a slave (earning), a child (belonging), or an heir (inheriting)? What would moving toward the heir posture look like?',prayer:'Father, I am Your heir — a child who belongs and inherits. Help me stop working for what You\'ve already given me. Amen.'},
  {title:'God Sees the Heart',verse:'1 Samuel 16:7',scripture:'"The LORD does not look at the things people look at. People look at the outward appearance, but the LORD looks at the heart."',body:'Humans rank by what they can see — appearance, achievement, status. God looks at the heart. David was the youngest, least impressive son — and God chose him because the heart was what mattered. This cuts both ways: you can\'t fake it before God, and you\'re not disqualified by what others see.',reflect:'What is the current state of your heart — honestly, before God who sees it fully?',prayer:'Lord, You see my heart. I don\'t hide it from You. Search it, know it, and change what needs to change. Amen.'},
  {title:'The Testing of Faith',verse:'James 1:3',scripture:'Because you know that the testing of your faith produces perseverance.',body:'Tests don\'t threaten your faith — they prove it and strengthen it. Gold goes into the fire to come out purer. Your faith goes through trials to come out more resilient. The testing is not punishment — it\'s training.',reflect:'What test are you currently in? What might God be producing in you through it?',prayer:'Lord, I trust the test. Use it to build something in me that only comes through endurance. I submit to the training. Amen.'},
  {title:'A Willing Spirit',verse:'Psalm 51:12',scripture:'Restore to me the joy of your salvation and grant me a willing spirit, to sustain me.',body:'David asks for two things: restored joy and a willing spirit. You can obey with a reluctant spirit — doing the right thing resentfully. But a willing spirit obeys with desire. It\'s the difference between someone who has to and someone who wants to.',reflect:'Is your spirit willing right now, or reluctant? What has drained the willingness? What would restore it?',prayer:'Lord, restore my joy and give me a willing spirit. I don\'t want to obey reluctantly — I want to want what You want. Amen.'},
  {title:'No Longer I',verse:'Galatians 2:20',scripture:'I have been crucified with Christ and I no longer live, but Christ lives in me.',body:'The old self — the self-centered, sin-prone, ego-driven version of you — died with Christ at the cross. The life you now live is Christ\'s life, expressed through your personality and circumstances. This is the most radical identity statement in Scripture.',reflect:'Where in your life is the old self still acting like it didn\'t die? What area needs to be crucified again?',prayer:'Lord, let it be true in practice what is true in position: I no longer live. Christ lives in me. Express Your life through mine today. Amen.'},
  {title:'The Helper Is Here',verse:'John 16:7',scripture:'"But very truly I tell you, it is for your good that I am going away. Unless I go away, the Advocate will not come to you."',body:'Jesus said it\'s better that He physically left because then the Spirit would come — not to one geography, but to every believer, everywhere, always. The physical Jesus could only be in one place. The Spirit is in all places simultaneously. You have constant access.',reflect:'Do you take advantage of the constant, internal access you have to the Holy Spirit, or do you treat Him as distant?',prayer:'Holy Spirit, You are here — in me, with me, always. Help me walk in the awareness of Your constant presence today. Amen.'},
  {title:'His Thoughts Are Higher',verse:'Isaiah 55:9',scripture:'"As the heavens are higher than the earth, so are my ways higher than your ways and my thoughts than your thoughts."',body:'When God\'s ways don\'t make sense — when the path He\'s chosen seems wrong, too long, or too painful — remember: He is thinking at a level your mind cannot reach. This is not a reason to check out of faith. It\'s a reason to trust the One who is thinking infinitely higher.',reflect:'Where does God\'s way currently make no sense to you? Can you trust higher thoughts even when you can\'t see them?',prayer:'Lord, Your thoughts are higher than mine. In the places where I don\'t understand Your ways, help me trust Your wisdom. Amen.'},
  {title:'Seek the Things Above',verse:'Colossians 3:1',scripture:'Since, then, you have been raised with Christ, set your hearts on things above, where Christ is, seated at the right hand of God.',body:'You have been raised. Past tense — it already happened spiritually when you came to faith. Now live from that position. Set your heart — deliberately aim your affections — on what is above. Your citizenship has changed. Live like it.',reflect:'What are your affections most set on today — the things above or the things around you? How could you reorient?',prayer:'Lord, I set my heart on things above. Recalibrate my affections toward what is eternal and away from what is temporary. Amen.'},
  {title:'Faith in the Unseen',verse:'Hebrews 11:1',scripture:'Now faith is confidence in what we hope for and assurance about what we do not see.',body:'Faith is not a guess or a wish. It\'s confidence in things not yet seen — conviction solid enough to act on. The Hall of Faith in Hebrews 11 is filled with people who acted on what they couldn\'t see and changed history. Faith is the substance of the invisible.',reflect:'What unseen promise of God are you currently living in confidence toward?',prayer:'Lord, give me the kind of faith that acts on what it cannot see because it knows who made the promise. Amen.'},
  {title:'All the Days',verse:'Matthew 28:20',scripture:'"And surely I am with you always, to the very end of the age."',body:'Always. Not when you perform well. Not when your faith is strong. Not in the good seasons. Always — to the very end of the age. This is the closing promise of Matthew\'s Gospel: wherever you go, for however long, Jesus is with you. The mission comes with the Companion.',reflect:'What day this week has felt most like you faced it alone? Go back to it with this promise.',prayer:'Lord Jesus, You promised always. I take You at Your word. You are with me today, in this, right now. I am not alone. Amen.'}
,
  {title:'The Weight of Words',verse:'Proverbs 12:18',scripture:'The words of the reckless pierce like swords, but the tongue of the wise brings healing.',body:'Words are surgical instruments — they can cut or they can heal, depending on who wields them and how. The same topic, the same truth, can be delivered in a way that wounds or in a way that restores. Wisdom chooses healing every time.',reflect:'Think of the last hard thing you had to say to someone. Did it pierce or heal? What would wisdom have done differently?',prayer:'Lord, make my words instruments of healing. Give me wisdom about how to say hard things in ways that restore. Amen.'},
  {title:'Crucified to the World',verse:'Galatians 6:14',scripture:'May I never boast except in the cross of our Lord Jesus Christ, through which the world has been crucified to me, and I to the world.',body:'Paul says the cross changed his relationship to the world — it was crucified to him. The applause, the status, the accumulation — it lost its grip. The cross makes the world\'s prizes look cheap. When you boast in the cross, everything else loses its power over you.',reflect:'What is the world currently offering you that still has too much grip on your heart?',prayer:'Lord, let the cross so transform my values that the world\'s prizes lose their pull. I boast in nothing but You. Amen.'},
  {title:'He Is Risen',verse:'Matthew 28:6',scripture:'"He is not here; he has risen, just as he said."',body:'The most important sentence in human history. The tomb is empty — not broken into, but vacated from within. Everything Christianity claims rests on this moment. If He is not risen, the faith is empty. If He is risen — and He is — everything changes. Everything.',reflect:'How does the physical, historical resurrection of Jesus change how you face today — its fears, its disappointments, its possibilities?',prayer:'Risen Lord, You are alive. Not a memory, not a symbol — alive. Let that reality be the most alive thing in my day. Amen.'},
  {title:'The Refiner\'s Fire',verse:'Malachi 3:3',scripture:'He will sit as a refiner and purifier of silver; he will purify the Levites and refine them like gold and silver.',body:'A refiner sits — patient, attentive, not distracted. He keeps the metal in the fire long enough to remove the impurity, but not a moment longer. The heat is intentional. And the refiner\'s goal isn\'t destruction — it\'s purity. He wants to see his reflection in the surface.',reflect:'What impurity might God be refining in you through your current season?',prayer:'Lord, refine me. Keep me in the fire as long as it takes to see Your reflection clearly in my life. I trust the Refiner. Amen.'},
  {title:'Wisdom Builds the House',verse:'Proverbs 24:3-4',scripture:'By wisdom a house is built, and through understanding it is established; through knowledge its rooms are filled with rare and beautiful treasures.',body:'The house here isn\'t just a building — it\'s a life, a family, a legacy. Wisdom builds slowly, through understanding, through accumulated knowledge. Quick-built lives collapse. Wisdom-built lives fill with beauty over time.',reflect:'What are you building right now — your life, your family, your work? Are you building by wisdom or by impulse?',prayer:'Lord, give me wisdom to build well. Not fast and flashy — but solid, understanding-based, and filled with beauty over time. Amen.'},
  {title:'Not Conformed',verse:'Romans 12:2',scripture:'Do not be conformed to the pattern of this world, but be transformed by the renewing of your mind.',body:'Conformation is passive — it happens to you if you don\'t resist. Transformation is active — it happens through deliberate renewal. The default setting for a believer who doesn\'t intentionally renew their mind is slow, invisible drift toward the world\'s patterns.',reflect:'What pattern of the world are you most at risk of drifting into right now? What renewal combats it?',prayer:'Lord, I resist conformation. Actively transform my mind through Your Word, Your Spirit, and Your truth today. Amen.'},
  {title:'The God of Second Chances',verse:'Jonah 3:1',scripture:'Then the word of the LORD came to Jonah a second time.',body:'After the fish. After the running. After the spectacular failure. The word of the Lord came a second time. God didn\'t find a replacement prophet — He recommissioned the one who ran. He is the God of second chances, and sometimes thirds and fourths.',reflect:'What assignment or calling have you been running from or have failed at? Hear the word coming to you a second time.',prayer:'Lord, speak to me again. I ran. I failed. But I\'m listening now. Recommission me for what You originally called me to. Amen.'},
  {title:'Love Never Fails',verse:'1 Corinthians 13:8',scripture:'Love never fails. But where there are prophecies, they will cease; where there are tongues, they will be stilled; where there is knowledge, it will pass away.',body:'Everything passes away — gifts, knowledge, impressive abilities. Love is the only thing that is permanent. Not the feeling, but the agape — the committed, self-giving, other-centered choice. In eternity, love is the only currency that survives.',reflect:'What are you currently investing in that won\'t last? What investment in love would outlast everything else?',prayer:'Lord, let my life\'s greatest investment be in love — the kind that never fails and outlasts everything. Amen.'},
  {title:'The Spirit and the Bride',verse:'Revelation 22:17',scripture:'The Spirit and the bride say, "Come!" And let the one who hears say, "Come!"',body:'The last invitation in Scripture is a duet between the Holy Spirit and the Church, extended to anyone who is thirsty. The Church\'s job is to echo what the Spirit says — come. Not gatekeep, not qualify, not complicate. Just extend the invitation: come.',reflect:'Who in your life needs to hear the invitation — come? Are you saying it?',prayer:'Holy Spirit, I join the invitation. To every thirsty person in my world — come. Use me to say it. Amen.'},
  {title:'Confident in This',verse:'Psalm 27:13',scripture:'I remain confident of this: I will see the goodness of the LORD in the land of the living.',body:'David uses a specific phrase: the land of the living. Not just in heaven, not just in eternity — but here, now, in this life. He expects to see God\'s goodness while he\'s still alive. That\'s active faith, not resigned patience.',reflect:'Do you expect to see God\'s goodness in your current situation, in this life, before it\'s over? That expectation is faith.',prayer:'Lord, I am confident of this: I will see Your goodness — here, now, in this life. I watch for it with expectation. Amen.'},
  {title:'He Is Good',verse:'Psalm 34:8',scripture:'Taste and see that the LORD is good; blessed is the one who takes refuge in him.',body:'You don\'t arrive at the goodness of God through argument — you taste it through experience. The invitation is to try it: take refuge in Him and discover for yourself that He is good. Theology about God\'s goodness is no substitute for personal experience of it.',reflect:'When have you most personally "tasted" the goodness of God — not just believed it, but experienced it?',prayer:'Lord, let me taste Your goodness again today. Help me take refuge in You and discover it afresh. Amen.'},
  {title:'Running with Endurance',verse:'Hebrews 12:1',scripture:'Let us run with perseverance the race marked out for us, fixing our eyes on Jesus, the pioneer and perfecter of faith.',body:'Eyes on Jesus — not on the other runners, not on the crowd, not on how far you\'ve come or how far you have to go. The moment you take your eyes off Jesus and fix them on comparison or circumstance, the race becomes impossible. Keep looking at Him.',reflect:'What have your eyes been fixed on lately? What would refocusing on Jesus change about how you\'re running?',prayer:'Jesus, pioneer and perfecter of my faith — I fix my eyes on You. Not on the race, not on others. Just You. Amen.'},
  {title:'Light in the Darkness',verse:'John 1:5',scripture:'The light shines in the darkness, and the darkness has not overcome it.',body:'Present tense — the light shines. Not shone, not will shine. Shines. Right now, in the darkest corners of your world, of history, of your own heart — the light is actively shining. And the darkness has not, and cannot, overcome it. This is not a contest.',reflect:'Where does darkness seem most overwhelming to you right now? Let the present-tense light of this verse speak to it.',prayer:'Lord, Your light shines in my darkness. I trust that the darkness cannot overcome it. Shine here, shine now. Amen.'},
  {title:'The Lord\'s Supper',verse:'1 Corinthians 11:26',scripture:'For whenever you eat this bread and drink this cup, you proclaim the Lord\'s death until he comes.',body:'Communion is a proclamation — every time you take it, you\'re declaring the death and resurrection of Christ and the certainty of His return. It\'s not a ritual to endure; it\'s a declaration to make. The table is an announcement that the story isn\'t over.',reflect:'When you next take Communion, receive it consciously — as a proclamation of death, resurrection, and return.',prayer:'Lord Jesus, I proclaim Your death, I celebrate Your resurrection, and I wait for Your return. Come, Lord Jesus. Amen.'},
  {title:'Praying in the Spirit',verse:'Jude 1:20',scripture:'But you, dear friends, by building yourselves up in your most holy faith and praying in the Holy Spirit.',body:'Praying in the Spirit means praying in alignment with the Spirit\'s desires, guided by His leading, empowered by His intercession. It\'s not a technique — it\'s a posture of surrender in prayer. Spirit-led prayer moves past what you would think to ask for.',reflect:'What would it look like to pray less from your own agenda and more in alignment with what the Spirit is leading you toward?',prayer:'Holy Spirit, lead my prayers. Take me beyond my own requests into the things You want to intercede for. Pray through me. Amen.'},
  {title:'The Cheerful Heart',verse:'Proverbs 17:22',scripture:'A cheerful heart is good medicine, but a crushed spirit dries up the bones.',body:'Joy is not trivial — it\'s medicinal. The cheerful heart has physiological, psychological, and relational benefits that science confirms and Scripture proclaimed first. And the crushed spirit — the joyless, hopeless inner life — has the opposite effect. Joy is worth pursuing.',reflect:'On the spectrum from cheerful to crushed, where is your spirit today? What is one thing that genuinely lifts your heart?',prayer:'Lord, give me a cheerful heart — not forced optimism, but the deep joy that comes from knowing You. Be my good medicine. Amen.'},
  {title:'The Father of the Prodigal',verse:'Luke 15:22',scripture:'But the father said to his servants, "Quick! Bring the best robe and put it on him. Put a ring on his finger and sandals on his feet."',body:'The son rehearsed a servant speech. The father interrupted with a restoration party. The robe, the ring, the sandals — each one restoring full son-status. God doesn\'t welcome you back as a lesser version of what you were. He restores you completely.',reflect:'Is there any part of your identity as God\'s child you\'ve been living below? Let the Father restore what the distance cost you.',prayer:'Father, restore to me the full identity of a child — the robe, the ring, the sandals. I receive full restoration. Amen.'},
  {title:'Holy Spirit Fire',verse:'Acts 2:3-4',scripture:'They saw what seemed to be tongues of fire that separated and came to rest on each of them. All of them were filled with the Holy Spirit.',body:'Pentecost was not just a historical event — it was the inauguration of a new era. The Spirit didn\'t rest on a building or a priest. He came to rest on each of them. Individual, personal, available to every believer. The fire has not gone out.',reflect:'Are you currently experiencing the fire of the Holy Spirit, or have the embers cooled? What tends to fan the flame?',prayer:'Holy Spirit, set my heart on fire again. I want the warmth and power of Pentecost to be my daily experience. Come, fill me. Amen.'},
  {title:'Night and Day',verse:'Psalm 1:2',scripture:'But whose delight is in the law of the LORD, and who meditates on his law day and night.',body:'Day and night — not just morning devotions and Sunday services. The person described in Psalm 1 carries God\'s Word with them all day long, returning to it in thought and reflection throughout the waking hours and even into the night. It\'s a life-saturating practice.',reflect:'What would it look like to carry a verse or truth with you today — turning it over in your mind day and night?',prayer:'Lord, let Your Word be with me all day and through the night. I want to be someone who meditates, not just reads. Amen.'},
  {title:'He Who Has Ears',verse:'Matthew 11:15',scripture:'Whoever has ears, let them hear.',body:'Jesus said this repeatedly — because having physical ears and actually hearing are two different things. Spiritual hearing requires attentiveness, willingness, and humility. The Word falls on many people. Very few truly hear it.',reflect:'What has God been saying to you that you\'ve been hearing with your ears but not actually responding to?',prayer:'Lord, give me ears that truly hear — not just processing information but actually receiving and acting on what You say. Amen.'},
  {title:'The Lord Our Righteousness',verse:'Jeremiah 23:6',scripture:'In his days Judah will be saved and Israel will live in safety. This is the name by which he will be called: The LORD Our Righteous Savior.',body:'Jehovah Tsidkenu — the Lord our Righteousness. Your standing before God is not based on your performance. It\'s based on His righteousness credited to you. On your worst day, His righteousness covers you. On your best day, it\'s still His righteousness, not yours.',reflect:'Do you approach God based on your recent performance or based on His imputed righteousness? How would shifting affect your prayer life?',prayer:'Jehovah Tsidkenu, You are my righteousness. Not my good days — Your perfect record. I approach You on that basis today. Amen.'},
  {title:'Strengthen What Remains',verse:'Revelation 3:2',scripture:'"Wake up! Strengthen what remains and is about to die, for I have found your deeds unfinished in the sight of my God."',body:'Jesus writes to a church in Sardis with a reputation for being alive but actually dying. The call is urgent: wake up, strengthen what remains. Spiritual drift is real and it\'s quiet. It rarely announces itself. The time to strengthen is before the flame goes completely out.',reflect:'What in your spiritual life has been slowly dying that needs to be strengthened — before it\'s gone?',prayer:'Lord, wake me up. Show me what\'s fading before it disappears. Help me strengthen what remains and finish what\'s been left undone. Amen.'},
  {title:'More Than Conquerors',verse:'Romans 8:37',scripture:'No, in all these things we are more than conquerors through him who loved us.',body:'Not just surviving. Not just getting through. More than conquerors — hyper-nikaō in Greek — overwhelming victors. And the source of the victory is love: through him who loved us. Love is the power behind the conquest. Not willpower. Not strategy. Love.',reflect:'What are you currently trying to conquer in your own strength? What would leaning into the love of God look like as your power source?',prayer:'Lord, I am more than a conqueror — through Your love, not my effort. Let that love be the force behind my victory. Amen.'},
  {title:'A Door No One Can Shut',verse:'Revelation 3:8',scripture:'"I know your deeds. See, I have placed before you an open door that no one can shut."',body:'Jesus says this to a church with little strength — not the powerful, not the impressive. And He says: I have placed before you an open door that no one can shut. You don\'t have to be strong to walk through God\'s doors. You just have to be faithful.',reflect:'What door do you believe God has opened for you? Have you walked through it, or are you waiting until you feel stronger?',prayer:'Lord, I see the open door. Give me the faith to walk through it, even with little strength. What You open, no one can shut. Amen.'},
  {title:'According to His Riches',verse:'Philippians 4:19',scripture:'And my God will meet all your needs according to the riches of his glory in Christ Jesus.',body:'Not according to your need — according to His riches. The measure of supply is not the size of your need but the size of His wealth. And His wealth is described as the riches of His glory — infinite, inexhaustible, more than enough.',reflect:'What need are you currently anxious about? Set it against the measure of His riches — does it fit?',prayer:'God, meet my need according to Your riches — not my deficit, but Your abundance. I trust You have more than enough. Amen.'},
  {title:'Steadfast and Immovable',verse:'1 Corinthians 15:58',scripture:'Therefore, my dear brothers and sisters, stand firm. Let nothing move you. Always give yourselves fully to the work of the Lord.',body:'Stand firm. Let nothing move you. Always. These are strong words. The resurrection is the foundation for this — if Christ is risen, then your labor is not in vain and you have a reason to be unmovable. The resurrection makes perseverance rational.',reflect:'What is currently threatening to move you from your position of faith and commitment? What does "stand firm" look like today?',prayer:'Lord, make me steadfast and immovable. Because You rose, I have a reason to stand firm no matter what tries to move me. Amen.'},
  {title:'The Secret of Contentment',verse:'Philippians 4:12',scripture:'I know what it is to be in need, and I know what it is to have plenty. I have learned the secret of being content in any and every situation.',body:'Contentment has a secret. Paul learned it — it wasn\'t natural to him either. The secret is found in verse 13: through Christ who gives strength. Contentment isn\'t about having the right circumstances. It\'s about having the right source regardless of circumstances.',reflect:'In what situation do you struggle most with discontentment? What would "through Christ" look like as the source of contentment there?',prayer:'Lord, teach me the secret of contentment. In need and in plenty, let Christ be my sufficiency. Amen.'},
  {title:'Fruit of Righteousness',verse:'Philippians 1:11',scripture:'Filled with the fruit of righteousness that comes through Jesus Christ — to the glory and praise of God.',body:'The fruit of righteousness doesn\'t come from trying harder — it comes through Jesus Christ. He is both the source and the channel. When you are connected to Him, righteousness is the natural output. The goal of all that fruit is always God\'s glory, not your reputation.',reflect:'Is the fruit of your life bringing glory to God or credit to yourself? What\'s the difference in practice?',prayer:'Lord, fill me with the fruit of righteousness — through Jesus, for Your glory. Not my goodness on display, but Yours. Amen.'},
  {title:'The God Who Remembers',verse:'Genesis 8:1',scripture:'But God remembered Noah and all the wild animals and the livestock that were with him in the ark, and he sent a wind over the earth, and the waters receded.',body:'God remembered Noah. In the middle of the flood, in the silence of forty days of rain and then weeks of water — God remembered. He had not forgotten. The receding of the waters was the answer to being remembered. Being remembered by God always precedes the breakthrough.',reflect:'Do you feel forgotten right now? God\'s memory of you always precedes the recession of the flood. Trust the timing.',prayer:'Lord, remember me. As You remembered Noah, remember my situation. I trust that the waters will recede. Amen.'},
  {title:'His Presence Goes With Me',verse:'Exodus 33:14',scripture:'The LORD replied, "My Presence will go with you, and I will give you rest."',body:'Moses refused to go anywhere without God\'s presence. His logic: if You don\'t go with us, don\'t make us leave. God\'s presence was more valuable than the destination. The right destination without God\'s presence is still not where you want to be.',reflect:'Is there any direction you\'re heading — a decision, a plan, a relationship — where you haven\'t confirmed God\'s presence is going with you?',prayer:'Lord, I go nowhere without Your presence. If You don\'t go, I don\'t go. Lead me only where You are. Amen.'},
  {title:'Full of Years',verse:'Genesis 25:8',scripture:'Then Abraham breathed his last and died at a good old age, an old man and full of years; and he was gathered to his people.',body:'"Full of years" — not just long, but full. There is a difference between a life that is long and a life that is full. Abraham lived in such a way that at the end, he was satisfied. A life full of faith, obedience, and relationship with God is a full life.',reflect:'What would a "full of years" life look like for you? What would make your years full, not just long?',prayer:'Lord, help me live in a way that when I come to the end, I am full — full of faith, full of love, full of purpose. Amen.'},
  {title:'For His Name\'s Sake',verse:'Psalm 23:3',scripture:'He guides me along the right paths for his name\'s sake.',body:'God guides you partly for His own reputation. He has staked His name on your story. If He abandoned you halfway, it would reflect on Him. He leads you in right paths not just for your benefit but because His name is on the line — and He is faithful to it.',reflect:'How does knowing God\'s guidance is tied to His own reputation increase your confidence that He won\'t abandon you?',prayer:'Lord, guide me for Your name\'s sake. I trust that Your reputation as a faithful God means You will not leave me lost. Amen.'},
  {title:'The Covenant of Salt',verse:'Numbers 18:19',scripture:'It is an everlasting covenant of salt before the LORD for both you and your offspring.',body:'Salt in the ancient Near East was used to seal the most permanent agreements. A covenant of salt meant it was unbreakable, permanent, impossible to dissolve. God\'s covenant with His people — and with you through Christ — is a covenant of salt. It cannot be undone.',reflect:'How does the permanence and irrevocability of God\'s covenant with you affect how you live and what you fear?',prayer:'Lord, Your covenant with me is sealed. Permanent. I rest in the unbreakable nature of Your commitment to me. Amen.'},
  {title:'Working Together for Good',verse:'Romans 8:28',scripture:'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',body:'All things. Not some things, not only the pleasant things — all things. God is a master craftsman who takes every material, including the broken and ugly pieces, and weaves them into something good. The key words: for those who love him. It\'s a promise with a recipient.',reflect:'What is the most difficult thing in your life right now? How might God be working it toward good?',prayer:'Lord, I trust that You are working this — all of it — together for good. I can\'t see the pattern yet, but I trust the Weaver. Amen.'},
  {title:'The Lord Directs the Steps',verse:'Proverbs 16:9',scripture:'In their hearts humans plan their course, but the LORD establishes their steps.',body:'You make plans. That\'s appropriate — wisdom involves planning. But the Lord establishes the actual steps. The final route belongs to Him. Your plans and His direction often differ, and His version is always better — even when it doesn\'t feel that way in the moment.',reflect:'Where is God\'s established path currently diverging from your planned course? Can you trust His version?',prayer:'Lord, You establish my steps even when they differ from my plans. I trust Your route over my blueprint. Amen.'},
  {title:'Holy, Holy, Holy',verse:'Isaiah 6:3',scripture:'"Holy, holy, holy is the LORD Almighty; the whole earth is full of his glory."',body:'The repetition — holy three times — is the highest form of emphasis in Hebrew literature. Not just holy. Holy, holy, holy. His holiness is superlative beyond expression. And then: the whole earth is full of His glory. Not just the sacred spaces — the whole earth.',reflect:'Where in the ordinary world around you today could you see the glory of the holy God, if you looked?',prayer:'Holy, holy, holy Lord — open my eyes to see Your glory in the ordinary world today. You fill the whole earth. Amen.'},
  {title:'Hope Does Not Put to Shame',verse:'Romans 5:5',scripture:'And hope does not put us to shame, because God\'s love has been poured out into our hearts through the Holy Spirit, who has been given to us.',body:'Biblical hope never disappoints because it\'s not wishful thinking — it\'s grounded in the character of God and confirmed by the Holy Spirit\'s presence in your heart. The love you have received is the down payment on every hope you hold.',reflect:'What hope are you holding that feels fragile or at risk of disappointing? Ground it in the love that has been poured into your heart.',prayer:'Lord, my hope is in You — not in circumstances or outcomes. And this hope will not put me to shame. Amen.'},
  {title:'By Grace Through Faith',verse:'Ephesians 2:8-9',scripture:'For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God — not by works, so that no one can boast.',body:'The architecture of salvation: grace is the builder, faith is the door, and works are completely out of the equation as a means of entry. You can\'t boast because you didn\'t build it. You can only receive it — with open hands and a grateful heart.',reflect:'Is there any part of your relationship with God where you\'re trying to earn what has already been given?',prayer:'Father, I receive salvation as the gift it is — by grace, through faith. I bring nothing but open hands. Thank You. Amen.'},
  {title:'The Last Day',verse:'John 6:39',scripture:'"And this is the will of him who sent me, that I shall lose none of all those he has given me, but raise them up at the last day."',body:'The will of the Father is explicit: Jesus loses none. Not some. None. Every person the Father has entrusted to Jesus will be raised on the last day. Your eternal security isn\'t your grip on God — it\'s His grip on you.',reflect:'Does your sense of security in salvation rest on how tightly you hold on, or how tightly He holds you? Which is more reliable?',prayer:'Lord Jesus, I rest in the fact that You lose none. I am held by You — not holding on by my own effort. Amen.'},
  {title:'God Is Not Mocked',verse:'Galatians 6:7',scripture:'Do not be deceived: God cannot be mocked. A man reaps what he sows.',body:'The principle of sowing and reaping is built into the moral fabric of the universe. You cannot game the system, fool God, or escape the harvest of your choices. This is both a warning and a promise — sow faithfully and the harvest will be faithful too.',reflect:'What are you sowing right now in your habits, relationships, and character? What harvest are you setting yourself up for?',prayer:'Lord, help me sow what I want to reap. Give me the discipline to plant faithfully and trust You for the harvest. Amen.'},
  {title:'The Rock of Ages',verse:'Isaiah 26:4',scripture:'Trust in the LORD forever, for the LORD, the LORD himself, is the Rock eternal.',body:'Rock eternal — unchanging through every era of history, every shift of culture, every personal earthquake. Nations rise and fall, technologies emerge and obsolete, philosophies cycle in and out of fashion. The Rock eternal doesn\'t move. He cannot be shaken.',reflect:'What in your world is shifting most right now? What would it look like to consciously anchor yourself in the Rock eternal?',prayer:'Lord, You are the Rock eternal. I anchor myself in You — unchanging, unshakeable, the same yesterday, today, and forever. Amen.'},
  {title:'Eye Has Not Seen',verse:'1 Corinthians 2:9',scripture:'"What no eye has seen, what no ear has heard, and what no human mind has conceived" — the things God has prepared for those who love him.',body:'The best thing you can imagine about eternity — the most glorious, most beautiful, most satisfying thing your mind can construct — doesn\'t come close. What God has prepared is beyond the range of human imagination. And it\'s for those who love Him. It\'s for you.',reflect:'What is your imagination of eternity? How does it feel to know the reality will exceed it in ways you can\'t conceive?',prayer:'Lord, what You have prepared exceeds everything I can imagine. I hold my best dreams loosely, knowing the reality is incomparably better. Amen.'},
  {title:'A House of Prayer',verse:'Isaiah 56:7',scripture:'"for my house will be called a house of prayer for all nations."',body:'Jesus quoted this when He drove out the money changers — the temple had become a market instead of a prayer house. The church is meant to be, before anything else, a house of prayer. And by extension, you — as God\'s temple — are meant to be a person of prayer.',reflect:'Is prayer central or peripheral in your life? What would it mean to be primarily a person of prayer?',prayer:'Lord, make me a house of prayer. Let prayer be my first instinct, not my last resort. Amen.'},
  {title:'The Alpha and Omega',verse:'Revelation 1:8',scripture:'"I am the Alpha and the Omega," says the Lord God, "who is, and who was, and who is to come, the Almighty."',body:'First letter, last letter — and everything in between. Jesus is the beginning and the end of your story, and every chapter in between belongs to Him. He was before your birth, He will be after your death, and He is present in every moment in between.',reflect:'What chapter of your story feels most like it belongs to you instead of to Him? What would surrendering that chapter look like?',prayer:'Alpha and Omega, You bookend my life and fill every chapter. I give You every page — the beautiful ones and the messy ones. Amen.'},
  {title:'Dressed for Service',verse:'Luke 12:35',scripture:'"Be dressed ready for service and keep your lamps burning."',body:'The image is of servants awake and ready, lamps lit, waiting for the master\'s return. Not sleeping. Not unprepared. Ready for service. The Christian life is not a waiting room — it\'s an active post. You\'re on duty until He comes.',reflect:'Are you ready for service? Are your lamps burning? What does being dressed and ready look like in your daily life?',prayer:'Lord, I keep my lamp burning. I stay dressed for service. Use me — today, in ordinary ways, for extraordinary purposes. Amen.'},
  {title:'The God of Elijah',verse:'2 Kings 2:14',scripture:'He took the cloak that had fallen from Elijah and struck the water with it. "Where now is the LORD, the God of Elijah?" he asked. When he struck the water, it divided to the right and to the left.',body:'Elisha asked the right question: where is the God of Elijah? Not where is Elijah — the man is gone. But the God who worked through Elijah is still here. The waters parted again. The same God who showed up in previous generations shows up in yours.',reflect:'What moves of God in history or in your own past give you confidence that He will show up again?',prayer:'God of Elijah, You are still the same God. Do what You did then — in my generation, in my situation. I believe You still divide the waters. Amen.'},
  {title:'This Is the Day',verse:'Psalm 118:24',scripture:'The LORD has done it this very day; let us rejoice today and be glad.',body:'Not yesterday\'s mercies — today\'s. Not tomorrow\'s promises — today\'s reality. The invitation is to rejoice in the specific gift of this specific day. Not a general optimism but a particular joy in what God is doing right now, in this 24-hour gift.',reflect:'What has God done this very day — even something small — that deserves rejoicing?',prayer:'Lord, this is the day You have made. I choose to rejoice in it. Not despite everything — but because You made it. Amen.'},
  {title:'The Final Word',verse:'John 19:30',scripture:'When he had received the drink, Jesus said, "It is finished." With that, he bowed his head and gave up his spirit.',body:'Tetelestai — a single Greek word that carried the weight of eternity. It\'s finished, it\'s paid in full, it\'s accomplished, it\'s complete. Every debt, every sin, every barrier between you and God — finished. Not "it\'s started" or "it\'s ongoing." Finished. Done. Complete.',reflect:'What are you still trying to add to what Christ said is finished? What would fully trusting "It is finished" change about your striving?',prayer:'Jesus, I trust the finished work. Nothing to add, nothing left unpaid. I rest in the completeness of what You accomplished. It is finished. Amen.'}
,
  {title:'The Lord Is Near',verse:'Philippians 4:5',scripture:'The Lord is near.',body:'Three words dropped into the middle of instructions about gentleness and anxiety. As if Paul pauses to remind you: before you worry, before you panic, before you spiral — the Lord is near. His nearness is the foundation for everything else.',reflect:'Does the nearness of God affect how you handle stress today? How would it change your posture if you kept this truth front of mind?',prayer:'Lord, You are near. Right here, right now. Let that reality settle my anxiety and shape my gentleness. Amen.'},
  {title:'He Chose the Weak',verse:'1 Corinthians 1:27',scripture:'But God chose the foolish things of the world to shame the wise; God chose the weak things of the world to shame the strong.',body:'God has a bias toward the unlikely. Not because weakness is impressive, but because it leaves no room for human pride. When God works through someone with nothing to offer, no one can steal the glory. He uses the weak things on purpose.',reflect:'What weakness in your life might actually be the thing God wants to use to display His strength?',prayer:'Lord, use my weakness. I stop hiding it. Display Your power through the places where I have nothing to offer. Amen.'},
  {title:'The Promises Are Yes',verse:'2 Corinthians 1:20',scripture:'For no matter how many promises God has made, they are "Yes" in Christ Jesus.',body:'Every promise in Scripture — hundreds of them — has a single answer in Christ: yes. Not maybe. Not conditionally. Yes. In Him the answer is always affirmative. You\'re not waiting for God to decide — He already has, in Christ.',reflect:'What promise of God are you treating as uncertain? Name it and receive the yes that Christ has already spoken over it.',prayer:'Lord, Your promises are yes in Christ. I receive [name the promise] as yes — not as a question, but as a settled answer. Amen.'},
  {title:'Called Out of Darkness',verse:'1 Peter 2:9',scripture:'But you are a chosen people, a royal priesthood, a holy nation, God\'s special possession, that you may declare the praises of him who called you out of darkness into his wonderful light.',body:'Four identities in one verse: chosen, royal, holy, God\'s special possession. And one purpose: to declare the praises of the One who called you out. You didn\'t wander into the light — you were called out of the dark. That\'s worth declaring.',reflect:'Which of the four identities — chosen, royal, holy, special possession — is hardest for you to own? Why?',prayer:'Lord, I receive all four. Chosen, royal, holy, Yours. Let these identities shape how I live and what I declare. Amen.'},
  {title:'Even the Wind and Waves',verse:'Mark 4:39',scripture:'He got up, rebuked the wind and said to the waves, "Quiet! Be still!" Then the wind died down and it was completely calm.',body:'Jesus was asleep in the boat when the storm hit. His disciples were terrified. He spoke to the storm — and it obeyed. The storm didn\'t just quiet; it became completely calm. He has authority over the chaos, the unexpected, the terrifying. One word from Him is enough.',reflect:'What storm in your life needs one word from Jesus? Have you asked Him to speak to it?',prayer:'Lord, speak to the storm. Quiet — be still. I ask You to calm what is raging in my life right now. I trust Your authority over chaos. Amen.'},
  {title:'Run to Win',verse:'1 Corinthians 9:24',scripture:'Do you not know that in a race all the runners run, but only one gets the prize? Run in such a way as to get the prize.',body:'Paul doesn\'t say run so you don\'t embarrass yourself. He says run to win. The Christian life calls for the full exertion of a prize-seeking racer — not casual participation. Intentionality, discipline, sacrifice. Run to win.',reflect:'Are you running to participate or to win? What would a more intentional, prize-focused approach to your faith look like?',prayer:'Lord, I run to win. Give me the discipline and intentionality of someone who is actually going for the prize. Amen.'},
  {title:'Stand in the Gap',verse:'Ezekiel 22:30',scripture:'"I looked for someone among them who would build up the wall and stand before me in the gap on behalf of the land so I would not have to destroy it, but I found no one."',body:'God looked for an intercessor — just one — and found none. The gap-stander is the person who prays on behalf of others, who steps into the space between people and judgment, between need and provision, and prays. This is one of the most powerful things a human being can do.',reflect:'Who needs you to stand in the gap for them right now — someone who may not be praying for themselves?',prayer:'Lord, I stand in the gap for [name them]. I intercede on their behalf. Find someone when You look — find me. Amen.'},
  {title:'Rejoice Always',verse:'1 Thessalonians 5:16',scripture:'Rejoice always.',body:'Two words. The shortest verse in some translations, second only to "Jesus wept." But the simplest commands are often the hardest. Always — not just when things are good, not just in worship services, not just when you feel it. Always. This is a command, not a suggestion.',reflect:'What is one thing you can choose to rejoice in right now, regardless of your circumstances?',prayer:'Lord, I choose joy. Not because everything is fine — but because You are good, and You are here, and that is always enough. Amen.'},
  {title:'The Lord Bless You',verse:'Numbers 6:24-26',scripture:'The LORD bless you and keep you; the LORD make his face shine on you and be gracious to you; the LORD turn his face toward you and give you peace.',body:'The oldest blessing in Scripture — given by God Himself as the words Aaron was to speak over Israel. Three doublets: bless and keep, shine and be gracious, turn toward you and give peace. Each one a complete gift. This is God\'s heart for you.',reflect:'Receive this blessing personally today. Read it slowly with your own name in mind.',prayer:'Lord, bless me and keep me. Make Your face shine on me and be gracious to me. Turn Your face toward me and give me peace. Amen.'},
  {title:'The Author of Faith',verse:'Hebrews 12:2',scripture:'Fixing our eyes on Jesus, the pioneer and perfecter of faith.',body:'Jesus is both the author and the finisher of your faith. He wrote the first chapter when He called you, and He will write the last. In between, He is actively perfecting — completing, maturing — what He started. Your faith is His ongoing project.',reflect:'Where does your faith feel most incomplete or immature? Invite the Author and Finisher to work on that chapter.',prayer:'Jesus, pioneer and perfecter of my faith — I give You my incomplete faith. Author the missing chapters. Perfect what needs finishing. Amen.'},
  {title:'Deeper Than the Ocean',verse:'Micah 7:19',scripture:'You will again have compassion on us; you will tread our sins underfoot and hurl all our iniquities into the depths of the sea.',body:'Hurled into the sea. Not filed. Not archived. Not available for retrieval. Cast to the deepest place on earth where no one can recover them. This is what God does with forgiven sin. And He doesn\'t go fishing for them later.',reflect:'What sin has God already forgiven that you keep retrieving from the sea? Let it stay where He threw it.',prayer:'Lord, You have hurled my sins into the ocean. I stop fishing for what You\'ve thrown away. It\'s done. It\'s gone. Amen.'},
  {title:'The Lord Will Provide',verse:'Genesis 22:8',scripture:'Abraham answered, "God himself will provide the lamb for the burnt offering, my son."',body:'Abraham said this when he didn\'t know how it would happen. He said it before the ram appeared. This is faith speaking before the provision arrives — declaring the character of God before the evidence comes. Jehovah Jireh provides, even when you can\'t see how.',reflect:'What provision are you waiting for that you can declare in faith before you see it?',prayer:'Jehovah Jireh — God will provide. Before I see it, I declare it. You will provide what I need, when I need it. Amen.'},
  {title:'Called According to His Purpose',verse:'Romans 8:28',scripture:'We know that in all things God works for the good of those who love him, who have been called according to his purpose.',body:'The phrase "called according to His purpose" anchors the promise. Your life is not random — you have been called according to a design. That calling means the things that happen to you are being worked by a purposeful God toward a purposeful end.',reflect:'How does knowing you are called according to His purpose change how you interpret the difficult things in your life?',prayer:'Lord, I am called according to Your purpose. Nothing that happens to me is outside that calling. Work all of it toward Your end. Amen.'},
  {title:'Let the Children Come',verse:'Mark 10:14',scripture:'"Let the little children come to me, and do not hinder them, for the kingdom of God belongs to such as these."',body:'Jesus was indignant when His disciples pushed the children away. The children weren\'t a distraction — they were the lesson. The kingdom belongs to those who come like a child: trusting, dependent, unimpressed with their own resume.',reflect:'In what ways has adulthood made you less childlike in your faith — more skeptical, more self-reliant, less simply trusting?',prayer:'Jesus, restore my childlike faith. Let me come to You simply, trusting, without the complexity I\'ve added. Amen.'},
  {title:'Springs in the Desert',verse:'Isaiah 35:6',scripture:'Water will gush forth in the wilderness and streams in the desert.',body:'The desert is the last place you expect water. But Isaiah prophesies water gushing — not trickling, gushing — in the driest place. God specializes in bringing life where life seems impossible. The desert is not the end of the story.',reflect:'Where is the desert in your life right now? Can you believe that God can make water gush there?',prayer:'Lord, make springs in my desert. Where I see only dry ground, You see a place for water to gush. I trust the impossible provision. Amen.'},
  {title:'From Everlasting to Everlasting',verse:'Psalm 90:2',scripture:'Before the mountains were born or you brought forth the whole world, from everlasting to everlasting you are God.',body:'Before the universe existed — God was. After it\'s gone — God will be. He is not constrained by time; He contains it. You are a being of seventy or eighty years standing before the everlasting One. Let that recalibrate everything.',reflect:'How does the eternal nature of God change how you think about your most pressing problem right now?',prayer:'Everlasting God, You existed before my problem and You\'ll exist after it. Put my finite concerns in Your infinite perspective. Amen.'},
  {title:'Not What I Will',verse:'Mark 14:36',scripture:'"Abba, Father," he said, "everything is possible for you. Take this cup from me. Yet not what I will, but what you will."',body:'This is the prayer of Gethsemane — the most honest prayer ever prayed. Jesus didn\'t pretend. He asked for what He wanted. And then He surrendered to what God wanted. This is the model: honest request + surrendered will. Both together.',reflect:'What cup are you currently asking God to take from you? Can you add the second line — yet not what I will, but what You will?',prayer:'Abba, Father — take this cup from me. And yet, not what I will but what You will. I trust Your plan over my preference. Amen.'},
  {title:'The Beauty of Holiness',verse:'Psalm 29:2',scripture:'Worship the LORD in the splendor of his holiness.',body:'Holiness is not dreary and restrictive — it is splendid. The holiness of God is beautiful, majestic, awe-inspiring. Worshipping in the splendor of His holiness means meeting God as He actually is — not a domestic deity to manage, but a glorious King to behold.',reflect:'When you worship, do you encounter the splendor of God\'s holiness, or a more domesticated version? What would richer encounter look like?',prayer:'Lord, I worship You in the splendor of Your holiness. Not my comfort zone — Your actual glory. Bring me into that encounter. Amen.'},
  {title:'Counted as Righteous',verse:'Genesis 15:6',scripture:'Abram believed the LORD, and he credited it to him as righteousness.',body:'Abraham didn\'t perform righteousness — he believed, and it was counted. This is the seed of the gospel in the very first book of the Bible. Faith credited as righteousness — not earned, not achieved, not accumulated. Believed.',reflect:'What does your righteousness rest on — what you\'ve done, or what you believe about what God has done?',prayer:'Lord, I believe. And I trust that belief is credited as righteousness — not because of my performance, but because of Your promise. Amen.'},
  {title:'The Patience of God',verse:'2 Peter 3:15',scripture:'Bear in mind that our Lord\'s patience means salvation.',body:'God\'s delay in judgment is not weakness or forgetfulness. It is patience — and that patience is saving people. Every day the return is delayed is another day for someone to turn. His patience is an act of mercy on a cosmic scale. Don\'t mistake it for indifference.',reflect:'Is there someone in your life who is still far from God? God\'s patience is still their window. Pray for them today.',prayer:'Lord, thank You for Your patience — the patience that saved me and is still holding the door open for others. Give me patience in my praying for those who haven\'t yet come. Amen.'},
  {title:'Emmanuel Still',verse:'Isaiah 7:14',scripture:'Therefore the Lord himself will give you a sign: The virgin will conceive and give birth to a son, and will call him Immanuel.',body:'Prophecy and fulfillment: written 700 years before Bethlehem, perfectly fulfilled in a manger. The name Immanuel — God with us — is not a past event. It\'s a permanent reality. God came to be with us, and He has never left.',reflect:'How does the fulfillment of 700-year-old prophecy in Jesus strengthen your confidence in the promises of God that haven\'t yet been fulfilled?',prayer:'Immanuel — God with us — You kept the ancient promise perfectly. I trust You to keep every promise that is still coming. Amen.'},
  {title:'Every Knee Will Bow',verse:'Romans 14:11',scripture:'"As surely as I live," says the Lord, "every knee will bow before me; every tongue will acknowledge God."',body:'This is not a threat — it\'s a promise. Every knee. The humble who bow now do so in love. Those who wait until the end will bow in acknowledgment. Every story, every life, every power will ultimately confess that Jesus is Lord. The question is only when and how.',reflect:'Are you bowing now in love, or waiting until the moment of unavoidable acknowledgment? What does voluntary submission look like today?',prayer:'Lord, I bow now — not because I have to, but because I want to. You are Lord, and I gladly acknowledge it. Amen.'},
  {title:'Not by Sight',verse:'2 Corinthians 5:7',scripture:'For we live by faith, not by sight.',body:'Sight is limited to what is visible and present. Faith sees what is real but not yet seen, what is promised but not yet arrived, what is eternal but not yet visible. Living by faith means your navigation system uses a different map than everyone around you.',reflect:'Where in your life are you navigating primarily by sight — only responding to what you can see? What would faith-navigation look like?',prayer:'Lord, I choose to live by faith, not sight. Even when I can\'t see what You\'re doing, I trust that You are doing it. Amen.'},
  {title:'Blessed Peacemakers',verse:'Matthew 5:9',scripture:'Blessed are the peacemakers, for they will be called children of God.',body:'Peacemakers bear a family resemblance to the God who reconciled the world to Himself through Christ. When you work toward reconciliation — in your family, your friendships, your community — you look like your Father. Peacemaking is a family trait of the children of God.',reflect:'Where is there division in your relationships that you could step into as a peacemaker? What is one move you could make this week?',prayer:'Father, make me a peacemaker — someone who bears Your family resemblance by working toward reconciliation wherever I go. Amen.'},
  {title:'The Eternal Weight of Glory',verse:'2 Corinthians 4:17',scripture:'For our light and momentary troubles are achieving for us an eternal glory that far outweighs them all.',body:'Paul called his sufferings — beatings, shipwrecks, prison, rejection — light and momentary. Not because they weren\'t real, but because he was measuring them against an eternal weight of glory. The scale tips overwhelmingly toward glory.',reflect:'Put your hardest current suffering on one side of the scale and eternal glory on the other. How does Paul\'s math change your perspective?',prayer:'Lord, help me see my momentary troubles in light of an eternal glory that outweighs them infinitely. Fix my eyes on what is unseen and eternal. Amen.'},
  {title:'Strengthened in the Inner Man',verse:'Ephesians 3:16',scripture:'I pray that out of his glorious riches he may strengthen you with power through his Spirit in your inner being.',body:'Paul prays for inner strengthening — not circumstantial improvement, not outer blessing, but power in the inner being. The inner man is where the real battle is fought. A person with a strong inner life can face anything the outside world brings.',reflect:'How strong is your inner being right now? What practice builds the inner strength you need for what you\'re facing?',prayer:'Lord, strengthen me in the inner being. By Your Spirit, build in me what no external change can build. Make me strong where it counts most. Amen.'},
  {title:'The Whole Armor',verse:'Ephesians 6:13',scripture:'Therefore put on the full armor of God, so that when the day of evil comes, you may be able to stand your ground, and after you have done everything, to stand.',body:'After you have done everything — stand. Sometimes the only thing left to do is stand. Not advance, not retreat, not figure it out — just stand. The armor\'s purpose is to make standing possible when everything is pressing you to fall.',reflect:'Is there a situation where you\'ve done everything you can do, and now you simply need to stand? What does standing look like today?',prayer:'Lord, I put on the full armor. I\'ve done everything I know to do. Now I stand — and trust You for what happens next. Amen.'},
  {title:'Let Everything Praise',verse:'Psalm 150:6',scripture:'Let everything that has breath praise the LORD. Praise the LORD.',body:'The last verse of the last psalm. The whole book of Psalms — through every lament, every confession, every cry of abandonment — ends here. Everything that breathes. Not just the happy, not just the healed, not just the successful. Everything that has breath. You qualify.',reflect:'You have breath right now. That alone is a reason to praise. What else, beyond simply breathing, are you grateful for today?',prayer:'Lord, I have breath — and I use it to praise You. Let everything in me that lives, lift to You. Praise the LORD. Amen.'}
,
  {title:'The Crown of Life',verse:'James 1:12',scripture:'Blessed is the one who perseveres under trial because, having stood the test, that person will receive the crown of life that the Lord has promised to those who love him.',body:'The crown goes to those who endure. Not to those who never suffered, but to those who suffered and kept going. The trial is the test, and passing the test comes with a crown — the crown of life — promised by the One who wore a crown of thorns for you.',reflect:'What trial have you been enduring? How does the promise of the crown of life reframe your perseverance?',prayer:'Lord, I persevere. Not because it\'s easy, but because You\'ve promised the crown of life to those who love You and endure. Keep me in the race. Amen.'},
  {title:'Ask for Nations',verse:'Psalm 2:8',scripture:'"Ask me, and I will make the nations your inheritance, the ends of the earth your possession."',body:'This is God speaking to His Son — but by extension, to those who pray in His name. The scope of prayer is global. You are permitted to ask for nations. God\'s concern extends to the ends of the earth, and your prayers can reach there too.',reflect:'Is your prayer life primarily personal or does it extend to nations, peoples, and global movements of God? What would expanding it look like?',prayer:'Lord, I ask for the nations. Move in [name a country, a people, a movement]. Let Your kingdom come to the ends of the earth. Amen.'},
  {title:'Until the Day Dawns',verse:'2 Peter 1:19',scripture:'We also have the prophetic message as something completely reliable, and you will do well to pay attention to it, as to a light shining in a dark place, until the day dawns and the morning star rises in your hearts.',body:'Scripture is a lamp shining in darkness — reliable, steady, sufficient. And it\'s not permanent — only needed until the day dawns and the Morning Star rises. In the full light of eternity, we won\'t need the written word because we will see the Living Word face to face. Until then: the lamp.',reflect:'Are you treating Scripture as the reliable light it is — the thing you navigate by in the darkness?',prayer:'Lord, Your Word is my reliable light in this dark age. I pay close attention to it until the Day dawns and I see You face to face. Amen.'}
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
  // Brand-palette gradients (purple-purge from KC port). Per-module hue:
  // Foundations of Faith → cyan→violet, Bible Survey → cyan→green.
  // F9: gold register inside Well — was var(--cd-banner) purple
  const wellGold = 'radial-gradient(ellipse at top, rgba(251,191,36,.18), transparent 60%)';
  const gradients = {
    jesus: wellGold,
    learn: 'radial-gradient(ellipse at top, rgba(34,197,94,.18), transparent 60%)',
  };
  document.getElementById('charIcon').textContent = l.icon;
  document.getElementById('charTitle').textContent = l.title;
  document.getElementById('charSub').textContent = type==='jesus'?'Foundations of Faith':'Bible Survey';
  document.getElementById('charModalHeader').style.background = gradients[type] || wellGold;
  // Body + Mark-Complete CTA. The CTA fires academyMarkLesson() which records
  // completion in D.faithAcademyProgress and awards +5 Faith XP.
  const lessonId = type + ':' + idx;
  const done = !!(D.faithAcademyProgress && D.faithAcademyProgress.lessons && D.faithAcademyProgress.lessons[lessonId]);
  const ctaHtml = done
    ? `<div style="margin-top:1.2rem;padding:.75rem;background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.3);border-radius:10px;text-align:center;font-size:.78rem;font-weight:700;color:#10b981;">✅ Lesson complete · +5 XP earned</div>`
    : `<div style="margin-top:1.2rem;text-align:center;">
         <button onclick="academyMarkLesson('${type}',${idx})" style="background:var(--cd-banner);color:var(--cd-banner-text);border:none;border-radius:10px;padding:.6rem 1.4rem;font-size:.82rem;font-weight:800;cursor:pointer;font-family:var(--fm);">✅ Mark Lesson Complete +5 XP</button>
       </div>`;
  document.getElementById('charBody').innerHTML = l.body + ctaHtml;
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
  const arr = Array.from({length:365},(_,i)=>i);
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
    // faith_free users have no rewards/points system — strip the "+5 pts" caption.
    const _ptsCaption = window._faithFree ? '' : ' +5 pts';
    const _btnCaption = window._faithFree ? '' : ' (+5 pts)';
    if(D.scrReadDays && D.scrReadDays[today]){
      da.innerHTML = '<div style="color:#22c55e;font-weight:700;font-size:.85rem;">✅ Completed today!' + _ptsCaption + '</div>';
    } else {
      da.innerHTML = '<button class="btn bp" onclick="markDevotionalRead()" style="font-size:.9rem;padding:.6rem 1.5rem;">✅ I Read Todays Devotional' + _btnCaption + '</button>';
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
  // F9.1: every devotional now uses the same gold/navy register —
  // no more rotating purple/pink/cyan gradients per card. The modal
  // markup default in index.html already paints a gold radial header.
  document.getElementById('charIcon').textContent = '🕊️';
  document.getElementById('charTitle').textContent = d.title;
  document.getElementById('charSub').textContent = 'Day ' + (idx+1) + ' · ' + d.verse;
  document.getElementById('charModalHeader').style.background = 'radial-gradient(ellipse at top, rgba(251,191,36,.18), transparent 60%)';

  document.getElementById('charBody').innerHTML = ''
    + '<div style="background:rgba(251,191,36,.06);border-left:4px solid #fbbf24;border-radius:0 12px 12px 0;padding:1rem 1.15rem;margin-bottom:1.2rem;">'
    +   '<div style="font-family:Georgia,serif;font-style:italic;font-size:1.05rem;color:#fef3c7;line-height:1.75;font-weight:400;">&ldquo;' + d.scripture + '&rdquo;</div>'
    +   '<div style="font-family:\'Bebas Neue\',var(--fm);font-size:.85rem;letter-spacing:.16em;color:#fbbf24;font-weight:700;margin-top:.5rem;">&mdash; ' + d.verse + '</div>'
    + '</div>'
    + '<div style="margin-bottom:1.1rem;">'
    +   '<div style="font-family:var(--fm);font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;color:#fbbf24;font-weight:800;margin-bottom:.5rem;opacity:.9;">💭 Reflection</div>'
    +   '<p style="margin:0;font-family:Georgia,serif;font-size:.98rem;line-height:1.75;color:rgba(254,243,199,.92);font-weight:400;">' + d.body + '</p>'
    + '</div>'
    + '<div style="background:rgba(251,191,36,.06);border-left:4px solid #fbbf24;border-radius:0 12px 12px 0;padding:.95rem 1.1rem;margin-bottom:1rem;">'
    +   '<div style="font-family:var(--fm);font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;color:#fbbf24;font-weight:800;margin-bottom:.4rem;opacity:.9;">🙏 Prayer</div>'
    +   '<p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:.95rem;line-height:1.7;color:#fef3c7;font-weight:400;">' + (d.prayer || '') + '</p>'
    + '</div>'
    + '<div style="background:rgba(34,197,94,.06);border-left:4px solid #22c55e;border-radius:0 12px 12px 0;padding:.95rem 1.1rem;">'
    +   '<div style="font-family:var(--fm);font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;color:#22c55e;font-weight:800;margin-bottom:.4rem;">🎯 Apply It Today</div>'
    +   '<p style="margin:0;font-family:Georgia,serif;font-size:.95rem;line-height:1.7;color:rgba(254,243,199,.92);font-weight:400;">' + d.reflect + '</p>'
    + '</div>';
  document.getElementById('charQuiz').innerHTML = '';
  openModal('charModal');
}

function markDevotionalRead(){
  if(!D.scrReadDays) D.scrReadDays = {};
  const today = new Date().toISOString().slice(0,10);
  if(D.scrReadDays[today]){ showToast('Already marked today'); return; }
  D.scrReadDays[today] = true;
  D.devPopupSeen = today;
  try{ if(typeof _ylccUserKey === 'function') localStorage.setItem(_ylccUserKey('ylcc_devPopupSeen'), today); }catch(e){}
  D.scrPoints = (D.scrPoints||0) + 5;
  save();
  showToast('Devotional read! +5 pts 🙏');
  if(typeof renderDevotionals === 'function') renderDevotionals();
  if(typeof renderScrStats === 'function') renderScrStats();
  if(typeof renderFaithHome === 'function') renderFaithHome();
  if(typeof earnPB === 'function') earnPB(2, 'Devotional reading');
  if(typeof celebrateIfNeeded === 'function') celebrateIfNeeded('scripture');
  if(typeof logActivity === 'function') logActivity('scripture', 'Read daily devotional');
}

function showDailyDevModal(){
  // Don't show if already read today OR already dismissed today.
  // Per-user localStorage flag is authoritative — it survives cloudLoad() overwrites.
  const today = new Date().toISOString().slice(0,10);
  if(typeof _ylccUserKey === 'function' && localStorage.getItem(_ylccUserKey('ylcc_devPopupSeen')) === today) return;
  if(D.devPopupSeen === today) return;
  if(D.scrReadDays && D.scrReadDays[today]) return;
  const idx = getDailyDevotionalIdx();
  const d = DEVOTIONALS[idx]; if(!d) return;
  // F9.1: every popup uses the same gold/navy register — no rotating purples.
  const hdr = document.getElementById('ddmHeader');
  if(hdr) hdr.style.background = 'radial-gradient(ellipse at top, rgba(251,191,36,.18), transparent 60%)';
  const el = document.getElementById('dailyDevModal'); if(!el) return;
  document.getElementById('ddmTitle').textContent = d.title;
  document.getElementById('ddmVerse').textContent = d.verse;
  document.getElementById('ddmScripture').innerHTML = '\u201c' + d.scripture + '\u201d';
  document.getElementById('ddmBody').textContent = d.body;
  document.getElementById('ddmReflect').textContent = d.reflect;
  document.getElementById('ddmPrayer').textContent = d.prayer || 'Lord, help me apply what I have read today. Open my heart and guide my steps. Amen.';
  // Show already-read state if completed today
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
  // Mark as seen today so it won't show again until tomorrow.
  // Per-user localStorage flag survives cloudLoad() overwrites on refresh.
  const today = new Date().toISOString().slice(0,10);
  D.devPopupSeen = today;
  try{ if(typeof _ylccUserKey === 'function') localStorage.setItem(_ylccUserKey('ylcc_devPopupSeen'), today); }catch(e){}
  save();
}

function markDevFromPopup(){
  if(!D.scrReadDays) D.scrReadDays = {};
  const today = new Date().toISOString().slice(0,10);
  if(D.scrReadDays[today]){ showToast('Already marked today'); return; }
  D.scrReadDays[today] = true;
  D.devPopupSeen = today;
  try{ if(typeof _ylccUserKey === 'function') localStorage.setItem(_ylccUserKey('ylcc_devPopupSeen'), today); }catch(e){}
  D.scrPoints = (D.scrPoints||0) + 5;
  save();
  // Close and update UI first — guards ensure missing modules don't block this
  closeDailyDevModal();
  showToast('Devotional read! +5 pts 🙏');
  if(typeof renderDevotionals === 'function') renderDevotionals();
  if(typeof renderScrStats === 'function') renderScrStats();
  if(typeof renderFaithHome === 'function') renderFaithHome();
  if(typeof earnPB === 'function') earnPB(2, 'Devotional reading');
  if(typeof celebrateIfNeeded === 'function') celebrateIfNeeded('scripture');
  if(typeof logActivity === 'function') logActivity('scripture', 'Read daily devotional');
}

function renderScrStats(){
  const days = Object.keys(D.scrReadDays||{});
  const points = D.scrPoints||0;
  const streak = getScriptureStreak ? getScriptureStreak() : 0;
  const pct = Math.round((days.length/365)*100);
  const today = new Date().toISOString().slice(0,10);
  const readToday = D.scrReadDays && D.scrReadDays[today];

  const pe = document.getElementById('scrPoints'); if(pe) pe.textContent = points;
  const se = document.getElementById('scrStreak'); if(se) se.textContent = streak;
  const de = document.getElementById('scrDaysRead'); if(de) de.textContent = days.length;
  const pc = document.getElementById('scrPctComplete'); if(pc) pc.textContent = pct+'%';
  const pl = document.getElementById('scrProgressLabel'); if(pl) pl.textContent = days.length+'/365';
  const pb = document.getElementById('scrProgressBar'); if(pb) pb.style.width = pct+'%';

  // Update dashboard SCRIPTURE card
  const dashVal = document.getElementById('qsScrStreak');
  const dashLbl = document.getElementById('qsScrLabel');
  const dashStatus = document.getElementById('dcScrStatus');
  if(dashVal) dashVal.textContent = readToday ? '1' : '0';
  if(dashLbl) dashLbl.textContent = readToday ? '✅ Read today' : 'Not read today';
  if(dashStatus) dashStatus.style.background = readToday ? '#22c55e' : '';
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
      <div style="font-size:.78rem;color:var(--tx);line-height:1.6;">${escapeHtml(n.note)}</div>
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

// F2-H: Sunday auto-protect + 1 free weekday skip per calendar week.
// Spec §4.8 — streak forgiveness so a missed weekday doesn't kill momentum,
// and Sundays count as "Sabbath Rest" without requiring an action.
function getScriptureStreak(){
  let streak = 0;
  const d = new Date();
  const weekSkipsLeft = {};   // sundayWeekKey -> 1 (initialized lazily)
  while(true){
    const ds = d.toISOString().slice(0,10);
    const isSunday = d.getDay() === 0;
    const wk = sundayWeekKey(d);
    if(!(wk in weekSkipsLeft)) weekSkipsLeft[wk] = 1;

    if(D.scrReadDays && D.scrReadDays[ds]){
      streak++;
      d.setDate(d.getDate() - 1);
      continue;
    }
    if(isSunday){
      // Sabbath auto-protect — counts as streak day even with no action.
      streak++;
      d.setDate(d.getDate() - 1);
      continue;
    }
    if(weekSkipsLeft[wk] > 0){
      weekSkipsLeft[wk]--;
      streak++;
      d.setDate(d.getDate() - 1);
      continue;
    }
    break;
  }
  return streak;
}

// Sunday-anchored week key — Sundays start a new week per spec §4.8 ("resets Sunday").
function sundayWeekKey(date){
  const dt = new Date(date);
  dt.setHours(0,0,0,0);
  dt.setDate(dt.getDate() - dt.getDay()); // back to Sunday
  return dt.toISOString().slice(0,10);
}

// Status for the Faith Home shield badge:
//   'done'    — read today, shield not needed
//   'sabbath' — today is Sunday, streak auto-protected
//   'ready'   — current week's free skip still available
//   'used'    — already missed a non-Sunday day this week (skip consumed)
function getStreakShieldStatus(){
  const today = new Date();
  const todayDs = today.toISOString().slice(0,10);
  if(D.scrReadDays && D.scrReadDays[todayDs]) return 'done';
  if(today.getDay() === 0) return 'sabbath';
  const currentWk = sundayWeekKey(today);
  const cursor = new Date(today);
  cursor.setDate(cursor.getDate() - 1);
  // Walk back to the start of this week (last Sunday). Any missed weekday
  // means the skip is already consumed.
  while(cursor.getDay() !== 0 && sundayWeekKey(cursor) === currentWk){
    const ds = cursor.toISOString().slice(0,10);
    if(!D.scrReadDays || !D.scrReadDays[ds]) return 'used';
    cursor.setDate(cursor.getDate() - 1);
  }
  return 'ready';
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

// ═════════════════════════════════════════════════════════════
// F2-E — PRAYER MODULE
// Active / Answered prayer wall, 30-prompt daily rotation, privacy levels
// (private / family / community), category tags. Reuses D.prayers from the
// existing 🌟 Journey panel — schema is additive (category, privacy, answerText).
// Family-shared rendering on Parent Hub lands in F2-H.
// ═════════════════════════════════════════════════════════════

const PRAYER_PROMPTS = [
  "Pray for someone who's been on your mind lately.",
  "Thank God for one thing in your day so far.",
  "Confess one thing you'd rather not say out loud.",
  "Pray for the person you find hardest to love right now.",
  "Ask God for wisdom about a decision you're carrying.",
  "Pray for a leader — pastor, boss, parent, teacher, official.",
  "Pray for someone who is grieving today.",
  "Ask for joy that doesn't depend on circumstances.",
  "Pray for the youth in your church or community.",
  "Bring a fear to God by name.",
  "Thank Him for one provision you almost overlooked.",
  "Pray for your marriage — yours, or one you love.",
  "Pray for someone who doesn't know Jesus.",
  "Ask for patience with someone in your home.",
  "Pray for a missionary or persecuted church somewhere.",
  "Ask God to reveal a sin you've been excusing.",
  "Pray for healing — physical, emotional, or relational.",
  "Thank Him for a friendship that has shaped you.",
  "Pray for the next generation of your family by name.",
  "Ask for boldness to share your faith this week.",
  "Pray for the church to be more like Jesus.",
  "Bring a grief to God without trying to fix it.",
  "Pray for protection over your mind and your media intake.",
  "Pray for your enemies — actually pray a blessing.",
  "Ask for contentment in what God has already given.",
  "Pray for someone serving in the military or first response.",
  "Bring a hidden hope to God.",
  "Pray for endurance in something you're tempted to quit.",
  "Ask for a soft heart in a place you've gone hard.",
  "Pray that God's name would be honored in your day.",
];

// Form state (chip selections) and list view state.
let _prFormType    = 'request';     // request | praise
let _prFormCat     = 'self';        // self | family | friend | world
let _prFormPrivacy = 'private';     // private | family | community
let _prView        = 'active';      // active | answered
let _prAnswerId    = null;          // id of prayer being marked answered

function getTodayPrayerPrompt(){
  // Day-of-year mod 30 — every Apr 1 / Jul 1 / Oct 1 the cycle realigns. Same
  // prompt for everyone same day, which is fine — prayer prompts aren't private.
  const day = (typeof getDayOfYear === 'function') ? getDayOfYear() : Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return PRAYER_PROMPTS[(day - 1 + PRAYER_PROMPTS.length) % PRAYER_PROMPTS.length];
}

function renderPrayerPanel(){
  // Today's prompt
  const promptEl = document.getElementById('prPromptText');
  if(promptEl) promptEl.textContent = getTodayPrayerPrompt();

  // Stats — counts surface above the form so they update as you add/answer.
  const all = (D && D.prayers) || [];
  const active   = all.filter(p => p && !p.answered);
  const answered = all.filter(p => p && p.answered);
  const setStat = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
  setStat('prStatActive',   active.length);
  setStat('prStatAnswered', answered.length);
  setStat('prStatTotal',    all.length);
  setStat('prCountActive',  active.length);
  setStat('prCountAnswered', answered.length);

  renderPrayerList();
}

function renderPrayerList(){
  const el = document.getElementById('prList');
  if(!el) return;
  const all = (D && D.prayers) || [];
  let items;
  if(_prView === 'answered')      items = all.filter(p => p && p.answered);
  else if(_prView === 'family')   items = all.filter(p => p && (p.privacy === 'family' || p.privacy === 'community'));
  else                            items = all.filter(p => p && !p.answered);
  // Newest first.
  items = items.slice().sort((a,b) => {
    const ta = a.answered ? (a.answeredAt || a.answeredDate || a.date) : (a.date || '');
    const tb = b.answered ? (b.answeredAt || b.answeredDate || b.date) : (b.date || '');
    return String(tb).localeCompare(String(ta));
  });

  // Family-tab count (used by the tab badge).
  const famCount = all.filter(p => p && (p.privacy === 'family' || p.privacy === 'community')).length;
  const fc = document.getElementById('prCountFamily');
  if(fc) fc.textContent = famCount;

  if(!items.length){
    let empty;
    if(_prView === 'answered')    empty = 'No answered prayers yet — celebrate them as God shows up.';
    else if(_prView === 'family') empty = 'No family-shared prayers yet. Set Privacy → 👨‍👩‍👧 Family when adding one.<br><small style="opacity:.65;">Cross-account family wall lands in F3.</small>';
    else                          empty = 'No active prayers yet. Add one above to begin.';
    el.innerHTML = `<div class="pr-empty">${empty}</div>`;
    return;
  }

  el.innerHTML = items.map(p => {
    const type    = p.type || 'request';
    const cat     = p.category || 'self';
    const privacy = p.privacy  || 'private';
    const accent  = (type === 'praise') ? '#10b981' : (privacy === 'family' ? '#fbbf24' : '#a78bfa');
    const typeIcon = type === 'praise' ? '🎉' : '🙏';
    const privIcon = privacy === 'family' ? '👨‍👩‍👧' : privacy === 'community' ? '⛪' : '🔒';
    const created  = (p.date || '').slice(0,10);
    const answered = p.answered;
    const ansDate  = (p.answeredAt || p.answeredDate || '').slice(0,10);
    return `<div class="pr-item" style="border-left-color:${accent};">
      <div class="pr-item-meta">
        <span style="color:${accent};">${typeIcon} ${type === 'praise' ? 'Praise' : 'Request'}</span>
        <span>· ${escapeHtml(cat)}</span>
        <span>· ${privIcon} ${escapeHtml(privacy)}</span>
        ${created ? '<span style="margin-left:auto;">'+created+'</span>' : ''}
      </div>
      <div class="pr-item-text">${escapeHtml(p.text || '')}</div>
      ${answered && p.answerText ? '<div class="pr-item-answer"><strong style="color:#10b981;font-style:normal;">✅ Answered '+(ansDate||'')+'</strong> — '+escapeHtml(p.answerText)+'</div>' : ''}
      ${answered && !p.answerText ? '<div class="pr-item-answer" style="font-style:normal;"><strong style="color:#10b981;">✅ Answered '+(ansDate||'')+'</strong></div>' : ''}
      <div class="pr-item-actions">
        ${!answered ? `<button class="pr-item-btn" onclick="openPrayerAnswer(${p.id})">✅ Mark Answered</button>` : ''}
        <button class="pr-item-btn del" onclick="deletePrayerItem(${p.id})">🗑 Delete</button>
      </div>
    </div>`;
  }).join('');
}

function setPrayerView(view, btn){
  _prView = view;
  document.querySelectorAll('#bf-prayer .pr-tab').forEach(t => t.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderPrayerList();
}

function prayerSetChip(grp, val, btn){
  if(grp === 'type')      _prFormType = val;
  else if(grp === 'cat')  _prFormCat  = val;
  else if(grp === 'priv') _prFormPrivacy = val;
  document.querySelectorAll(`#bf-prayer .pr-chip[data-grp="${grp}"]`).forEach(c => c.classList.remove('active'));
  if(btn) btn.classList.add('active');
}

// "Pray About This" CTA on the daily prompt — pre-fills the textarea.
function prayerUsePrompt(){
  const ta = document.getElementById('prInput');
  if(!ta) return;
  if(!ta.value.trim()) ta.value = getTodayPrayerPrompt() + '\n\n';
  ta.focus();
  ta.scrollIntoView({ behavior:'smooth', block:'center' });
}

function addPrayerFromForm(){
  const ta = document.getElementById('prInput');
  const text = ta ? ta.value.trim() : '';
  if(!text){ showToast('Write your prayer first'); return; }
  if(!D.prayers) D.prayers = [];
  const now = new Date().toISOString();
  D.prayers.push({
    id: Date.now(),
    text: text,
    type: _prFormType,
    category: _prFormCat,
    privacy: _prFormPrivacy,
    date: now,
    answered: false,
  });
  // Streak protection — counts as today's faith action.
  if(!D.scrReadDays) D.scrReadDays = {};
  D.scrReadDays[new Date().toISOString().slice(0,10)] = true;
  if(ta) ta.value = '';
  save();
  if(typeof logActivity === 'function') logActivity('faith', _prFormType === 'praise' ? 'Praise report' : 'Prayer request');
  if(typeof renderFaithJourney === 'function') renderFaithJourney(); // legacy Journey list
  if(typeof renderFaithHome === 'function') renderFaithHome();
  renderPrayerPanel();
  showToast(_prFormType === 'praise' ? 'Praise saved 🎉' : 'Prayer saved 🙏');
}

function deletePrayerItem(id){
  if(!confirm('Delete this prayer?')) return;
  if(!D.prayers) D.prayers = [];
  D.prayers = D.prayers.filter(p => p && p.id !== id);
  save();
  if(typeof renderFaithJourney === 'function') renderFaithJourney();
  if(typeof renderFaithHome === 'function') renderFaithHome();
  renderPrayerPanel();
}

function openPrayerAnswer(id){
  _prAnswerId = id;
  const p = (D.prayers || []).find(x => x && x.id === id);
  const orig = document.getElementById('paOriginal');
  if(orig) orig.textContent = p ? (p.text || '') : '—';
  const story = document.getElementById('paStory');
  if(story) story.value = '';
  if(typeof openModal === 'function') openModal('prayerAnswerModal');
}

function closePrayerAnswer(){
  if(typeof closeModal === 'function') closeModal('prayerAnswerModal');
  _prAnswerId = null;
}

function confirmPrayerAnswered(){
  if(!_prAnswerId){ closePrayerAnswer(); return; }
  const p = (D.prayers || []).find(x => x && x.id === _prAnswerId);
  if(!p){ closePrayerAnswer(); return; }
  const story = document.getElementById('paStory');
  p.answered    = true;
  p.answerText  = story ? story.value.trim() : '';
  p.answeredAt  = new Date().toISOString();
  // Keep legacy field for older codepaths.
  p.answeredDate = p.answeredAt.slice(0,10);
  save();
  if(typeof logActivity === 'function') logActivity('faith', 'Prayer answered');
  if(typeof renderFaithJourney === 'function') renderFaithJourney();
  if(typeof renderFaithHome === 'function') renderFaithHome();
  renderPrayerPanel();
  closePrayerAnswer();
  showToast('Prayer answered! ✅ +5 XP');
  D.scrPoints = (D.scrPoints || 0) + 5;
  save();
}

// ═════════════════════════════════════════════════════════════
// F2-F — MEMORY VERSES + SPACED REPETITION (SM-2-lite)
// ═════════════════════════════════════════════════════════════
// Storage: D.memoryVerses[] entries with ease/intervalDays/nextDue.
// Library: window.MEMORY_VERSE_LIBRARY (50 verses across 9 categories,
// loaded from app/js/data/memory-verses.js before faith.js).
// Mastery: intervalDays >= 90 → marked mastered (still reviewable).

let _mvView   = 'queue';      // queue | library | mastered | custom
let _mvCustomCat = 'identity';
let _mvQuizMode  = 'cloze';   // cloze | recite | choice
let _mvQuizQueue = [];        // ids in current quiz session
let _mvQuizIdx   = 0;
let _mvQuizCorrect = 0;

function _mvCats(){
  return (typeof window !== 'undefined' && window.MEMORY_VERSE_CATEGORIES) ? window.MEMORY_VERSE_CATEGORIES : [];
}
function _mvLib(){
  return (typeof window !== 'undefined' && window.MEMORY_VERSE_LIBRARY) ? window.MEMORY_VERSE_LIBRARY : [];
}
function _mvCatLookup(catId){
  return _mvCats().find(c => c.id === catId) || { id:catId, label:catId, icon:'📖', color:'#a78bfa' };
}
function _mvTodayISO(){ return new Date().toISOString().slice(0,10); }

function _mvDueCount(){
  const t = _mvTodayISO();
  return ((D && D.memoryVerses) || []).filter(v => v && !v.mastered && (!v.nextDue || v.nextDue <= t)).length;
}

function renderMemorizePanel(){
  const all = (D && D.memoryVerses) || [];
  const due       = all.filter(v => v && !v.mastered && (!v.nextDue || v.nextDue <= _mvTodayISO())).length;
  const active    = all.filter(v => v && !v.mastered).length;
  const mastered  = all.filter(v => v && v.mastered).length;

  const setStat = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
  setStat('mvStatDue',      due);
  setStat('mvStatActive',   active);
  setStat('mvStatMastered', mastered);

  const sub  = document.getElementById('mvHeroSub');
  const btn  = document.getElementById('mvQuizBtn');
  if(sub){
    if(active === 0)  sub.textContent = 'Pick verses from the Library tab to start memorizing.';
    else if(due === 0) sub.textContent = 'All caught up — next review is tomorrow. Great work.';
    else              sub.textContent = due + (due === 1 ? ' verse' : ' verses') + ' due today · +25 XP per mastered verse.';
  }
  if(btn){
    btn.textContent = (due > 0 ? "Start Today's Review (" + due + ")" : 'Quick Practice');
    btn.disabled = active === 0;
    btn.style.opacity = active === 0 ? '.55' : '';
    btn.style.cursor  = active === 0 ? 'not-allowed' : 'pointer';
  }

  // Render the custom-cat chips once (idempotent).
  const catWrap = document.getElementById('mvCustomCats');
  if(catWrap && !catWrap.dataset.mvBuilt){
    catWrap.innerHTML = _mvCats().map(c =>
      `<button class="mv-cat-chip${c.id === _mvCustomCat ? ' active' : ''}" data-cat="${c.id}" onclick="mvSetCustomCat('${c.id}',this)">${c.icon} ${c.label}</button>`
    ).join('');
    catWrap.dataset.mvBuilt = '1';
  }

  // Show/hide the add form.
  const addForm = document.getElementById('mvAddForm');
  if(addForm) addForm.classList.toggle('open', _mvView === 'custom');

  // Render the body for the selected view.
  const body = document.getElementById('mvBody');
  if(!body) return;
  if(_mvView === 'queue')         body.innerHTML = _mvRenderQueue();
  else if(_mvView === 'library')  body.innerHTML = _mvRenderLibrary();
  else if(_mvView === 'mastered') body.innerHTML = _mvRenderMastered();
  else if(_mvView === 'custom')   body.innerHTML = '';
}

function mvSetView(view, btn){
  _mvView = view;
  document.querySelectorAll('#bf-memorize .mv-tab').forEach(t => t.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderMemorizePanel();
}

function mvSetCustomCat(catId, btn){
  _mvCustomCat = catId;
  document.querySelectorAll('#mvCustomCats .mv-cat-chip').forEach(c => c.classList.remove('active'));
  if(btn) btn.classList.add('active');
}

function _mvRenderQueue(){
  const t = _mvTodayISO();
  const all = ((D && D.memoryVerses) || []).filter(v => v && !v.mastered);
  if(!all.length){
    return '<div class="mv-empty">No verses yet. Add from the Library tab — 50 starter verses ready to go.</div>';
  }
  // Due first, then by next-due ascending.
  all.sort((a,b) => {
    const ad = (a.nextDue || '');
    const bd = (b.nextDue || '');
    return String(ad).localeCompare(String(bd));
  });
  return '<div class="mv-grid">' + all.map(v => _mvCardHtml(v, false)).join('') + '</div>';
}

function _mvRenderLibrary(){
  const lib = _mvLib();
  if(!lib.length) return '<div class="mv-empty">Library failed to load.</div>';
  const owned = new Set(((D && D.memoryVerses) || []).map(v => v && v.reference));
  const cats = _mvCats();
  return cats.map(c => {
    const inCat = lib.filter(l => l.category === c.id);
    const cards = inCat.map(l => {
      const isOwned = owned.has(l.reference);
      // Always call mvAddFromLibrary — it shows "Already in your queue" itself
      // when the verse is a duplicate, so we don't need nested quoting.
      const refAttr = escapeHtml(l.reference);
      return `<div class="mv-card" style="border-left-color:${c.color};${isOwned ? 'opacity:.6;' : ''}" data-mv-ref="${refAttr}" onclick="mvAddFromLibrary(this.getAttribute('data-mv-ref'))">
        <div class="mv-card-ref" style="color:${c.color};">${refAttr}${isOwned ? ' <span style="font-size:.55rem;color:var(--tx2);">✓ added</span>' : ''}</div>
        <div class="mv-card-text">${escapeHtml(l.text)}</div>
      </div>`;
    }).join('');
    return `<div class="mv-section-hdr" style="color:${c.color};">${c.icon} ${c.label} (${inCat.length})</div><div class="mv-grid">${cards}</div>`;
  }).join('');
}

function _mvRenderMastered(){
  const all = ((D && D.memoryVerses) || []).filter(v => v && v.mastered);
  if(!all.length) return '<div class="mv-empty">No mastered verses yet — keep reviewing! Mastery hits when interval reaches 90 days.</div>';
  return '<div class="mv-grid">' + all.map(v => _mvCardHtml(v, true)).join('') + '</div>';
}

function _mvCardHtml(v, isMastered){
  const c = _mvCatLookup(v.category);
  const t = _mvTodayISO();
  const due = !isMastered && (!v.nextDue || v.nextDue <= t);
  return `<div class="mv-card" style="border-left-color:${c.color};" onclick="mvOpenVerse(${v.id})">
    <div class="mv-card-ref" style="color:${c.color};">${escapeHtml(v.reference)}</div>
    <div class="mv-card-text">${escapeHtml(v.text)}</div>
    <div class="mv-card-meta">
      <span>${c.icon} ${escapeHtml(c.label)}</span>
      ${isMastered ? '<span class="mv-mastered-pill">🏆 Mastered</span>' : (due ? '<span class="mv-due-pill">Due today</span>' : '<span style="color:var(--tx2);">Next: ' + (v.nextDue || '—') + '</span>')}
    </div>
  </div>`;
}

function mvAddFromLibrary(reference){
  const lib = _mvLib();
  const found = lib.find(l => l.reference === reference);
  if(!found){ showToast('Verse not found'); return; }
  if(!D.memoryVerses) D.memoryVerses = [];
  if(D.memoryVerses.some(v => v && v.reference === reference)){ showToast('Already in your queue'); return; }
  const now = new Date().toISOString();
  D.memoryVerses.push({
    id: Date.now() + Math.floor(Math.random() * 1000),
    reference: found.reference,
    text: found.text,
    category: found.category,
    ease: 2.5,
    intervalDays: 1,
    nextDue: _mvTodayISO(), // due today by default
    lastReviewed: null,
    mastered: false,
    masteredAt: null,
    createdAt: now,
    totalReviews: 0,
    correctReviews: 0,
  });
  if(!D.scrReadDays) D.scrReadDays = {};
  D.scrReadDays[_mvTodayISO()] = true;
  save();
  if(typeof logActivity === 'function') logActivity('faith', 'Added memory verse: ' + reference);
  if(typeof renderFaithHome === 'function') renderFaithHome();
  showToast('Added to queue ✨');
  renderMemorizePanel();
}

function mvAddCustom(){
  const refEl  = document.getElementById('mvCustomRef');
  const textEl = document.getElementById('mvCustomText');
  const ref  = refEl ? refEl.value.trim() : '';
  const text = textEl ? textEl.value.trim() : '';
  if(!ref || !text){ showToast('Reference and text required'); return; }
  if(!D.memoryVerses) D.memoryVerses = [];
  if(D.memoryVerses.some(v => v && v.reference === ref)){ showToast('Already in your queue'); return; }
  const now = new Date().toISOString();
  D.memoryVerses.push({
    id: Date.now() + Math.floor(Math.random() * 1000),
    reference: ref,
    text: text,
    category: _mvCustomCat || 'identity',
    ease: 2.5,
    intervalDays: 1,
    nextDue: _mvTodayISO(),
    lastReviewed: null,
    mastered: false,
    masteredAt: null,
    createdAt: now,
    totalReviews: 0,
    correctReviews: 0,
  });
  if(!D.scrReadDays) D.scrReadDays = {};
  D.scrReadDays[_mvTodayISO()] = true;
  save();
  if(typeof logActivity === 'function') logActivity('faith', 'Added custom memory verse: ' + ref);
  if(refEl) refEl.value = '';
  if(textEl) textEl.value = '';
  if(typeof renderFaithHome === 'function') renderFaithHome();
  showToast('Custom verse added ✨');
  // Switch to queue so user sees what they just added.
  const queueTab = document.querySelector('#bf-memorize .mv-tab[data-mv-view="queue"]');
  mvSetView('queue', queueTab);
}

// Single-verse drill-down: opens the quiz modal seeded with just this verse.
function mvOpenVerse(id){
  _mvQuizQueue   = [id];
  _mvQuizIdx     = 0;
  _mvQuizCorrect = 0;
  _mvQuizMode    = 'cloze';
  _mvSyncQuizModeChips();
  if(typeof openModal === 'function') openModal('mvQuizModal');
  _mvRenderQuestion();
}

function mvStartQuiz(){
  const all = ((D && D.memoryVerses) || []).filter(v => v && !v.mastered);
  if(!all.length){ showToast('Add a verse to start memorizing'); return; }
  const t = _mvTodayISO();
  let due = all.filter(v => !v.nextDue || v.nextDue <= t);
  // If nothing due, do a "quick practice" sample of up to 5 active verses.
  if(!due.length){
    due = all.slice().sort(() => Math.random() - 0.5).slice(0, Math.min(5, all.length));
  }
  // Cap quiz length so it stays a reasonable session even if many are due.
  if(due.length > 20) due = due.slice(0, 20);
  _mvQuizQueue   = due.map(v => v.id);
  _mvQuizIdx     = 0;
  _mvQuizCorrect = 0;
  _mvSyncQuizModeChips();
  if(typeof openModal === 'function') openModal('mvQuizModal');
  _mvRenderQuestion();
}

function mvCloseQuiz(){
  if(typeof closeModal === 'function') closeModal('mvQuizModal');
  renderMemorizePanel();
  if(typeof renderFaithHome === 'function') renderFaithHome();
}

function mvSetQuizMode(mode, btn){
  _mvQuizMode = mode;
  document.querySelectorAll('#mvQuizModal .mvq-mode').forEach(b => {
    const isActive = b === btn;
    b.classList.toggle('active', isActive);
    if(isActive){
      b.style.background = 'var(--cd-banner)';
      b.style.color = 'var(--cd-banner-text)';
      b.style.border = 'none';
      b.style.fontWeight = '800';
    } else {
      b.style.background = 'rgba(255,255,255,.06)';
      b.style.color = 'var(--tx)';
      b.style.border = '1px solid rgba(255,255,255,.12)';
      b.style.fontWeight = '700';
    }
  });
  _mvRenderQuestion();
}

function _mvSyncQuizModeChips(){
  document.querySelectorAll('#mvQuizModal .mvq-mode').forEach(b => {
    const isActive = b.getAttribute('data-mvq-mode') === _mvQuizMode;
    b.classList.toggle('active', isActive);
    if(isActive){
      b.style.background = 'var(--cd-banner)';
      b.style.color = 'var(--cd-banner-text)';
      b.style.border = 'none';
      b.style.fontWeight = '800';
    } else {
      b.style.background = 'rgba(255,255,255,.06)';
      b.style.color = 'var(--tx)';
      b.style.border = '1px solid rgba(255,255,255,.12)';
      b.style.fontWeight = '700';
    }
  });
}

function _mvCurrentVerse(){
  const id = _mvQuizQueue[_mvQuizIdx];
  return ((D && D.memoryVerses) || []).find(v => v && v.id === id) || null;
}

function _mvNormalize(s){
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function _mvWordSimilarity(user, target){
  const u = _mvNormalize(user).split(/\s+/).filter(Boolean);
  const t = _mvNormalize(target).split(/\s+/).filter(Boolean);
  if(!t.length) return 0;
  // Track multiset of user words so duplicates aren't double-counted.
  const userBag = {};
  u.forEach(w => { userBag[w] = (userBag[w] || 0) + 1; });
  let matched = 0;
  t.forEach(w => { if(userBag[w] > 0){ matched++; userBag[w]--; } });
  return matched / t.length;
}

function _mvRenderQuestion(){
  const v = _mvCurrentVerse();
  const titleEl = document.getElementById('mvqTitle');
  const progressEl = document.getElementById('mvqProgress');
  const body = document.getElementById('mvqBody');
  const footer = document.getElementById('mvqFooter');
  if(!body || !footer) return;

  if(!v){
    // End of quiz
    titleEl.textContent = 'Session Complete';
    progressEl.textContent = '';
    const total = _mvQuizQueue.length;
    const pct = total ? Math.round((_mvQuizCorrect / total) * 100) : 0;
    body.innerHTML = `<div style="text-align:center;padding:1.5rem 1rem;">
      <div style="font-size:3rem;margin-bottom:.5rem;">${pct >= 80 ? '🏆' : pct >= 50 ? '✨' : '🌱'}</div>
      <div style="font-family:var(--fh,var(--fm));font-size:1.4rem;font-weight:800;color:var(--tx);margin-bottom:.4rem;">${_mvQuizCorrect} / ${total} correct</div>
      <div style="font-size:.85rem;color:var(--tx2);line-height:1.5;">${pct >= 80 ? 'Outstanding session — Scripture is sticking.' : pct >= 50 ? 'Solid work. Repetition is the key — come back tomorrow.' : 'Memorization is a long game. Show up again tomorrow.'}</div>
    </div>`;
    footer.innerHTML = `<button onclick="mvCloseQuiz()" style="background:var(--cd-banner);color:var(--cd-banner-text);border:none;border-radius:10px;padding:.55rem 1rem;font-size:.78rem;font-weight:800;cursor:pointer;font-family:var(--fm);">Done</button>`;
    return;
  }

  const c = _mvCatLookup(v.category);
  titleEl.textContent = v.reference;
  progressEl.textContent = (_mvQuizIdx + 1) + ' / ' + _mvQuizQueue.length;

  if(_mvQuizMode === 'cloze'){
    // Hide every 5th word.
    const words = String(v.text).split(/(\s+)/);
    const wordIdxList = [];
    words.forEach((w, i) => { if(/\S/.test(w)) wordIdxList.push(i); });
    const hiddenWordIdx = wordIdxList.filter((_, n) => (n + 1) % 5 === 0);
    const hiddenWords = hiddenWordIdx.map(i => words[i]);
    const display = words.map((w, i) => hiddenWordIdx.indexOf(i) !== -1
      ? `<span style="display:inline-block;min-width:60px;border-bottom:2px dashed ${c.color};text-align:center;padding:0 .25rem;color:${c.color};font-weight:800;">__</span>`
      : escapeHtml(w)).join('');

    body.innerHTML = `
      <div style="font-size:.66rem;font-weight:800;color:${c.color};text-transform:uppercase;letter-spacing:.16em;margin-bottom:.4rem;">${c.icon} Fill in the blanks</div>
      <div id="mvqVerseText" style="font-family:Georgia,serif;font-size:.95rem;line-height:1.85;color:var(--tx);background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:.7rem .85rem;margin-bottom:.75rem;">${display}</div>
      <div style="font-size:.62rem;font-weight:800;color:var(--tx2);text-transform:uppercase;letter-spacing:.12em;margin-bottom:.3rem;">${hiddenWords.length} blank${hiddenWords.length === 1 ? '' : 's'} — type the missing words (in order, space-separated)</div>
      <input type="text" id="mvqAnswer" placeholder="missing words…" style="font-size:.85rem;width:100%;" autofocus>
    `;
    footer.innerHTML = `
      <button onclick="mvCloseQuiz()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:var(--tx);border-radius:10px;padding:.5rem .85rem;font-size:.74rem;font-weight:700;cursor:pointer;font-family:var(--fm);">End Session</button>
      <button onclick="_mvSubmitAnswer(${JSON.stringify(hiddenWords).replace(/"/g,'&quot;')})" style="background:var(--cd-banner);color:var(--cd-banner-text);border:none;border-radius:10px;padding:.5rem 1rem;font-size:.78rem;font-weight:800;cursor:pointer;font-family:var(--fm);">Check ✓</button>
    `;
  } else if(_mvQuizMode === 'recite'){
    body.innerHTML = `
      <div style="font-size:.66rem;font-weight:800;color:${c.color};text-transform:uppercase;letter-spacing:.16em;margin-bottom:.4rem;">${c.icon} Recite from memory</div>
      <div style="font-size:1.4rem;font-family:var(--fh,var(--fm));font-weight:800;color:var(--tx);text-align:center;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin-bottom:.75rem;">${escapeHtml(v.reference)}</div>
      <textarea id="mvqAnswer" rows="5" placeholder="Type the verse from memory…" style="font-size:.85rem;font-family:Georgia,serif;line-height:1.6;"></textarea>
      <div style="font-size:.62rem;color:var(--tx2);font-style:italic;margin-top:.4rem;line-height:1.4;">Word-coverage match. Punctuation, capitalization, and small word order don't count against you.</div>
    `;
    footer.innerHTML = `
      <button onclick="mvCloseQuiz()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:var(--tx);border-radius:10px;padding:.5rem .85rem;font-size:.74rem;font-weight:700;cursor:pointer;font-family:var(--fm);">End Session</button>
      <button onclick="_mvSubmitAnswer(null)" style="background:var(--cd-banner);color:var(--cd-banner-text);border:none;border-radius:10px;padding:.5rem 1rem;font-size:.78rem;font-weight:800;cursor:pointer;font-family:var(--fm);">Check ✓</button>
    `;
  } else { // 'choice'
    // Build 3 distractors from other library/queue verses.
    const all = (D && D.memoryVerses || []).concat(_mvLib());
    const pool = all.filter(x => x.text !== v.text).map(x => x.text);
    const distractors = [];
    while(distractors.length < 3 && pool.length){
      const i = Math.floor(Math.random() * pool.length);
      const t = pool.splice(i, 1)[0];
      if(distractors.indexOf(t) === -1) distractors.push(t);
    }
    const choices = distractors.concat([v.text]).sort(() => Math.random() - 0.5);
    body.innerHTML = `
      <div style="font-size:.66rem;font-weight:800;color:${c.color};text-transform:uppercase;letter-spacing:.16em;margin-bottom:.4rem;">${c.icon} Pick the correct verse</div>
      <div style="font-size:1.4rem;font-family:var(--fh,var(--fm));font-weight:800;color:var(--tx);text-align:center;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:1rem;margin-bottom:.75rem;">${escapeHtml(v.reference)}</div>
      <div style="display:flex;flex-direction:column;gap:.4rem;">
        ${choices.map((t,i) => `<button class="mvq-choice" onclick="_mvSubmitAnswer(${JSON.stringify(t).replace(/"/g,'&quot;')})" style="text-align:left;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:var(--tx);border-radius:10px;padding:.65rem .8rem;font-family:Georgia,serif;font-size:.82rem;line-height:1.5;cursor:pointer;">${escapeHtml(t)}</button>`).join('')}
      </div>
    `;
    footer.innerHTML = `
      <button onclick="mvCloseQuiz()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:var(--tx);border-radius:10px;padding:.5rem .85rem;font-size:.74rem;font-weight:700;cursor:pointer;font-family:var(--fm);">End Session</button>
    `;
  }
}

function _mvSubmitAnswer(arg){
  const v = _mvCurrentVerse();
  if(!v){ return; }
  let correct = false;

  if(_mvQuizMode === 'cloze'){
    const expected = Array.isArray(arg) ? arg : [];
    const inp = (document.getElementById('mvqAnswer') || {}).value || '';
    // Match each blank in order, allowing minor punctuation/case differences.
    const userWords = _mvNormalize(inp).split(/\s+/).filter(Boolean);
    const expectedNorm = expected.map(w => _mvNormalize(w)).filter(Boolean);
    let matched = 0;
    for(let i = 0; i < expectedNorm.length; i++){
      if(userWords[i] === expectedNorm[i]) matched++;
    }
    correct = expectedNorm.length > 0 && matched / expectedNorm.length >= 0.7;
  } else if(_mvQuizMode === 'recite'){
    const inp = (document.getElementById('mvqAnswer') || {}).value || '';
    const sim = _mvWordSimilarity(inp, v.text);
    correct = sim >= 0.85;
  } else if(_mvQuizMode === 'choice'){
    correct = (typeof arg === 'string') && _mvNormalize(arg) === _mvNormalize(v.text);
  }

  // SR update + feedback.
  _mvApplySrUpdate(v, correct);
  _mvShowFeedback(v, correct);
}

function _mvShowFeedback(v, correct){
  const body = document.getElementById('mvqBody');
  const footer = document.getElementById('mvqFooter');
  if(!body || !footer) return;
  const c = _mvCatLookup(v.category);
  body.innerHTML = `
    <div style="text-align:center;padding:.4rem 0 .8rem;">
      <div style="font-size:2.4rem;margin-bottom:.3rem;">${correct ? '✅' : '❌'}</div>
      <div style="font-family:var(--fh,var(--fm));font-size:1.1rem;font-weight:800;color:${correct ? '#10b981' : '#f87171'};margin-bottom:.5rem;">${correct ? 'Correct!' : 'Not quite — here it is:'}</div>
    </div>
    <div style="background:rgba(${correct ? '16,185,129' : '239,68,68'},.06);border:1px solid rgba(${correct ? '16,185,129' : '239,68,68'},.25);border-radius:10px;padding:.7rem .85rem;margin-bottom:.7rem;">
      <div style="font-size:.66rem;font-weight:800;color:${c.color};margin-bottom:.25rem;letter-spacing:.04em;">${escapeHtml(v.reference)}</div>
      <div style="font-family:Georgia,serif;font-size:.9rem;line-height:1.7;color:var(--tx);">${escapeHtml(v.text)}</div>
    </div>
    <div style="font-size:.7rem;color:var(--tx2);text-align:center;line-height:1.5;">
      Next review in <strong style="color:var(--tx);">${v.intervalDays}</strong> day${v.intervalDays === 1 ? '' : 's'} · ease ${v.ease.toFixed(2)}${v.mastered ? ' · 🏆 Mastered' : ''}
    </div>
  `;
  footer.innerHTML = `
    <button onclick="mvCloseQuiz()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:var(--tx);border-radius:10px;padding:.5rem .85rem;font-size:.74rem;font-weight:700;cursor:pointer;font-family:var(--fm);">End Session</button>
    <button onclick="_mvNextQuestion()" style="background:var(--cd-banner);color:var(--cd-banner-text);border:none;border-radius:10px;padding:.5rem 1rem;font-size:.78rem;font-weight:800;cursor:pointer;font-family:var(--fm);">Next →</button>
  `;
}

function _mvNextQuestion(){
  _mvQuizIdx++;
  _mvRenderQuestion();
}

// ═════════════════════════════════════════════════════════════
// F2-G — ASK THE BIBLE (Claude-powered Q&A)
// ═════════════════════════════════════════════════════════════
// Calls /api/ai-summary with mode='ask-bible'. Renders pastoral answer +
// 3-5 ESV citations + concrete application. History stored in
// D.faithAiHistory (capped at 50).
//
// Crisis-keyword pre-check fires client-side before any API call so users
// in true distress get the 988 hotline immediately, not after a network
// roundtrip. Server-side guardrails are the second layer.

const ASK_BIBLE_CRISIS_KEYWORDS = [
  'kill myself','killing myself','end my life','ending my life','suicide','suicidal',
  'want to die','wanna die','no reason to live','worth living',
  'cut myself','cutting myself','hurt myself','self harm','self-harm',
  'end it all','take my life','better off dead',
];

const ASK_BIBLE_SUGGESTIONS = [
  "What does the Bible say about anxiety?",
  "Why did Jesus weep at Lazarus's tomb?",
  "How do I forgive someone who hasn't apologized?",
  "What does the Bible say about money and giving?",
  "How do I know if I'm hearing from God?",
  "What does Romans 8:28 actually mean?",
  "How should I think about doubt as a Christian?",
  "What does the Bible say about identity in Christ?",
  "Why is suffering allowed if God is good?",
  "How do I pray when I don't know what to say?",
];

function openAskBible(seedQuestion){
  const ta = document.getElementById('abQuestion');
  if(ta){
    if(typeof seedQuestion === 'string' && seedQuestion) ta.value = seedQuestion;
    setTimeout(function(){ try { ta.focus(); } catch(_){} }, 80);
  }
  // Clear any prior answer when opening fresh.
  const ans = document.getElementById('abAnswer');
  if(ans){ ans.style.display = 'none'; ans.innerHTML = ''; }
  _abRefreshHistoryCount();
  if(typeof openModal === 'function') openModal('askBibleModal');
}

function closeAskBible(){
  if(typeof closeModal === 'function') closeModal('askBibleModal');
}

function askBibleSuggest(){
  const ta = document.getElementById('abQuestion');
  if(!ta) return;
  const pick = ASK_BIBLE_SUGGESTIONS[Math.floor(Math.random() * ASK_BIBLE_SUGGESTIONS.length)];
  ta.value = pick;
  ta.focus();
}

function _abIsCrisis(q){
  const lc = String(q || '').toLowerCase();
  return ASK_BIBLE_CRISIS_KEYWORDS.some(k => lc.indexOf(k) !== -1);
}

function _abRenderCrisis(){
  const out = document.getElementById('abAnswer');
  if(!out) return;
  out.style.display = 'block';
  out.innerHTML = `
    <div style="background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.3);border-radius:14px;padding:1rem 1.1rem;margin-bottom:.6rem;">
      <div style="font-size:1.4rem;margin-bottom:.4rem;">🤍</div>
      <div style="font-family:var(--fh,var(--fm));font-size:1.05rem;font-weight:800;color:var(--tx);margin-bottom:.4rem;letter-spacing:.02em;">You are not alone — please reach out right now.</div>
      <div style="font-size:.85rem;color:var(--tx);line-height:1.55;margin-bottom:.7rem;">If you are in immediate danger, call <strong>911</strong>. To talk to someone right now, call or text <strong>988</strong> — the Suicide &amp; Crisis Lifeline (USA, 24/7, free, confidential).</div>
      <div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:.7rem;">
        <a href="tel:988" style="background:var(--cd-banner);color:var(--cd-banner-text);border:none;border-radius:10px;padding:.55rem 1rem;font-size:.78rem;font-weight:800;font-family:var(--fm);text-decoration:none;">📞 Call 988</a>
        <a href="sms:988" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);color:var(--tx);border-radius:10px;padding:.55rem 1rem;font-size:.78rem;font-weight:700;font-family:var(--fm);text-decoration:none;">💬 Text 988</a>
      </div>
      <div style="background:rgba(167,139,250,.05);border-left:3px solid #a78bfa;border-radius:0 8px 8px 0;padding:.6rem .8rem;font-style:italic;color:var(--tx2);font-size:.82rem;line-height:1.6;">"The LORD is near to the brokenhearted and saves the crushed in spirit." — Psalm 34:18</div>
      <div style="font-size:.78rem;color:var(--tx2);margin-top:.7rem;line-height:1.55;">Please also reach out to a parent, pastor, school counselor, or trusted adult today. You don't have to carry this alone.</div>
    </div>
  `;
}

async function askBibleSubmit(){
  const ta = document.getElementById('abQuestion');
  const q = ta ? ta.value.trim() : '';
  if(!q){ showToast('Type a question first'); return; }

  // Crisis short-circuit — never sends to API.
  if(_abIsCrisis(q)){
    _abRenderCrisis();
    if(typeof logActivity === 'function') logActivity('faith', 'Ask the Bible — crisis card shown');
    return;
  }

  const out = document.getElementById('abAnswer');
  const askBtn = document.getElementById('abAskBtn');
  if(askBtn){ askBtn.disabled = true; askBtn.style.opacity = '.6'; askBtn.textContent = '⟳ Asking…'; }
  if(out){
    out.style.display = 'block';
    out.innerHTML = `<div style="text-align:center;padding:1.2rem;color:var(--tx2);font-size:.85rem;">⏳ Searching Scripture…</div>`;
  }

  try {
    const resp = await fetch('/api/ai-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'ask-bible', prompt: q }),
    });
    if(!resp.ok){
      const status = resp.status;
      out.innerHTML = `<div style="text-align:center;padding:1rem;color:#f87171;font-size:.82rem;">❌ AI service unavailable (${status}). Try again in a moment.</div>`;
      return;
    }
    const data = await resp.json();

    // Server returned { crisis:true, ... } when the model triggered Rule 1.
    if(data && data.crisis){ _abRenderCrisis(); return; }

    // JSON parse failure — show degraded view if we can.
    if(data && data.ok === false){
      out.innerHTML = `<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:.85rem;color:var(--tx2);font-size:.85rem;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.raw || 'No answer returned.')}</div>`;
      return;
    }

    _abRenderAnswer(q, data);
    _abSaveHistory(q, data);
    if(typeof logActivity === 'function') logActivity('faith', 'Asked the Bible: ' + q.slice(0,80));
  } catch(e){
    out.innerHTML = `<div style="text-align:center;padding:1rem;color:#f87171;font-size:.82rem;">❌ Network error. Check your connection.</div>`;
  } finally {
    if(askBtn){ askBtn.disabled = false; askBtn.style.opacity = ''; askBtn.textContent = '🤖 Ask'; }
  }
}

function _abRenderAnswer(question, data){
  const out = document.getElementById('abAnswer');
  if(!out) return;
  const answer = (data && data.answer) || '';
  const verses = (data && Array.isArray(data.verses)) ? data.verses : [];
  const application = (data && data.application) || '';

  const versesHtml = verses.map(v => {
    if(!v || !v.reference) return '';
    const refAttr = escapeHtml(v.reference);
    return `<div style="background:rgba(56,189,248,.05);border:1px solid rgba(56,189,248,.18);border-left:4px solid #38bdf8;border-radius:10px;padding:.65rem .8rem;margin-bottom:.4rem;cursor:pointer;" data-ab-ref="${refAttr}" onclick="askBibleJumpRef(this.getAttribute('data-ab-ref'))">
      <div style="font-size:.74rem;font-weight:800;color:#38bdf8;margin-bottom:.2rem;letter-spacing:.04em;">📖 ${refAttr}</div>
      <div style="font-family:Georgia,serif;font-size:.84rem;line-height:1.6;color:var(--tx);">${escapeHtml(v.text || '')}</div>
      <div style="font-size:.6rem;color:var(--tx3);margin-top:.3rem;font-style:italic;">Tap to open in the Bible reader →</div>
    </div>`;
  }).join('');

  out.innerHTML = `
    <div style="background:rgba(167,139,250,.05);border:1px solid rgba(167,139,250,.18);border-radius:14px;padding:.85rem 1rem;margin-bottom:.7rem;">
      <div style="font-size:.66rem;font-weight:800;color:#a78bfa;text-transform:uppercase;letter-spacing:.16em;margin-bottom:.3rem;">Pastoral Answer</div>
      <div style="font-size:.92rem;line-height:1.7;color:var(--tx);">${escapeHtml(answer)}</div>
    </div>
    ${verses.length ? '<div style="font-size:.66rem;font-weight:800;color:var(--tx2);text-transform:uppercase;letter-spacing:.16em;margin:.5rem 0 .35rem;">Scripture (' + verses.length + ')</div>' + versesHtml : ''}
    ${application ? `<div style="background:rgba(16,185,129,.06);border:1px solid rgba(16,185,129,.25);border-left:4px solid #10b981;border-radius:10px;padding:.65rem .85rem;margin-top:.5rem;">
      <div style="font-size:.66rem;font-weight:800;color:#10b981;text-transform:uppercase;letter-spacing:.16em;margin-bottom:.2rem;">🎯 Apply It Today</div>
      <div style="font-size:.85rem;color:var(--tx);line-height:1.55;">${escapeHtml(application)}</div>
    </div>` : ''}
    <div style="font-size:.62rem;color:var(--tx3);margin-top:.7rem;line-height:1.5;font-style:italic;text-align:center;">For contested topics or personal crisis, please consult your pastor or a trusted Christian counselor.</div>
  `;
  if(!D.scrReadDays) D.scrReadDays = {};
  D.scrReadDays[new Date().toISOString().slice(0,10)] = true;
  save();
  if(typeof renderFaithHome === 'function') renderFaithHome();
}

function _abSaveHistory(question, data){
  if(!D.faithAiHistory) D.faithAiHistory = [];
  D.faithAiHistory.push({
    id: Date.now(),
    question: question,
    answer: (data && data.answer) || '',
    verses: (data && Array.isArray(data.verses)) ? data.verses : [],
    application: (data && data.application) || '',
    createdAt: new Date().toISOString(),
  });
  // Cap at 50 to keep the cloud blob lean.
  if(D.faithAiHistory.length > 50) D.faithAiHistory = D.faithAiHistory.slice(-50);
  save();
  _abRefreshHistoryCount();
}

function _abRefreshHistoryCount(){
  const countEl = document.getElementById('abHistoryCount');
  const list = (D && D.faithAiHistory) || [];
  if(countEl) countEl.textContent = String(list.length);
}

function askBibleToggleHistory(){
  const wrap = document.getElementById('abHistory');
  if(!wrap) return;
  const opening = wrap.style.display === 'none' || !wrap.style.display;
  wrap.style.display = opening ? 'block' : 'none';
  if(opening) _abRenderHistoryList();
}

function _abRenderHistoryList(){
  const wrap = document.getElementById('abHistory');
  if(!wrap) return;
  const list = ((D && D.faithAiHistory) || []).slice().reverse();
  if(!list.length){
    wrap.innerHTML = '<div style="font-size:.74rem;color:var(--tx3);font-style:italic;text-align:center;padding:.6rem;">No questions yet.</div>';
    return;
  }
  wrap.innerHTML = list.map(h => `<div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:.55rem .7rem;margin-bottom:.3rem;cursor:pointer;" onclick="askBibleReplay(${h.id})">
    <div style="font-size:.74rem;font-weight:700;color:var(--tx);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${escapeHtml(h.question || '')}</div>
    <div style="font-size:.6rem;color:var(--tx3);font-weight:700;letter-spacing:.06em;margin-top:.2rem;">${(h.createdAt || '').slice(0,10)} · ${(h.verses||[]).length} verse${(h.verses||[]).length === 1 ? '' : 's'}</div>
  </div>`).join('');
}

function askBibleReplay(id){
  const list = (D && D.faithAiHistory) || [];
  const h = list.find(x => x && x.id === id);
  if(!h) return;
  const ta = document.getElementById('abQuestion');
  if(ta) ta.value = h.question || '';
  _abRenderAnswer(h.question, { answer: h.answer, verses: h.verses, application: h.application });
}

// Tap a verse citation in an answer → open the Bible reader at that ref.
function askBibleJumpRef(ref){
  const m = String(ref).match(/^(\d?\s?[A-Za-z][A-Za-z ]+?)\s+(\d+)(?::(\d+))?/);
  if(!m){ showToast('Could not parse ' + ref); return; }
  const book = m[1].trim(), ch = m[2], verse = m[3] ? parseInt(m[3],10) : 0;
  closeAskBible();
  // Switch to Bible tab and open the chapter.
  bfTab('bible');
  setTimeout(function(){
    const sel = document.getElementById('esvBook');
    if(sel){
      const opt = Array.from(sel.options).find(o => o.value && o.value.toLowerCase() === book.toLowerCase());
      if(opt){ sel.value = opt.value; if(typeof onEsvBookChange === 'function') onEsvBookChange(); }
    }
    const chSel = document.getElementById('esvChapter');
    if(chSel) chSel.value = String(ch);
    if(typeof openEsvReader === 'function') openEsvReader();
    if(verse) setTimeout(function(){ if(typeof jumpToEsvVerse === 'function') jumpToEsvVerse(verse); }, 600);
  }, 80);
}

// ═════════════════════════════════════════════════════════════
// F2-H — SERMON NOTES + FAMILY VERSE (light Family Faith Mode)
// ═════════════════════════════════════════════════════════════
// Sermon Notes live in the 🌟 Journey tab. Family Verse of the Week
// surfaces on Faith Home when D._profiles holds a parent + at least one
// child profile. True cross-account family aggregation (family streak,
// shared prayer wall across kids' accounts) requires a families table
// and is part of F3.

// ── SERMON NOTES ──────────────────────────────────────────────
let _sermonEditingId = null;

function openSermonNote(id){
  _sermonEditingId = id || null;
  const today = new Date().toISOString().slice(0,10);
  const fields = {
    snDate: today, snChurch: '', snSpeaker: '', snTitle: '',
    snScriptures: '', snTakeaway: '', snNotes: '', snAction: '',
  };
  if(id){
    const existing = (D.sermonNotes || []).find(s => s && s.id === id);
    if(existing){
      fields.snDate       = existing.date || today;
      fields.snChurch     = existing.church || '';
      fields.snSpeaker    = existing.speaker || '';
      fields.snTitle      = existing.title || '';
      fields.snScriptures = existing.scriptures || '';
      fields.snTakeaway   = existing.takeaway || '';
      fields.snNotes      = existing.notes || '';
      fields.snAction     = existing.actionStep || '';
    }
  }
  Object.keys(fields).forEach(k => {
    const el = document.getElementById(k);
    if(el) el.value = fields[k];
  });
  const titleEl = document.getElementById('snmTitle');
  if(titleEl) titleEl.textContent = id ? 'Edit Sermon' : 'New Sermon';
  const delBtn = document.getElementById('snDeleteBtn');
  if(delBtn) delBtn.style.display = id ? '' : 'none';
  if(typeof openModal === 'function') openModal('sermonNoteModal');
}

function closeSermonNote(){
  if(typeof closeModal === 'function') closeModal('sermonNoteModal');
  _sermonEditingId = null;
}

function saveSermonNote(){
  const v = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const date    = v('snDate');
  const takeaway = v('snTakeaway');
  if(!date){ showToast('Date required'); return; }
  if(!takeaway){ showToast('Add the One Big Takeaway'); return; }

  const payload = {
    date: date,
    church:     v('snChurch'),
    speaker:    v('snSpeaker'),
    title:      v('snTitle'),
    scriptures: v('snScriptures'),
    notes:      v('snNotes'),
    takeaway:   takeaway,
    actionStep: v('snAction'),
    updatedAt:  new Date().toISOString(),
  };

  if(!D.sermonNotes) D.sermonNotes = [];
  if(_sermonEditingId){
    const idx = D.sermonNotes.findIndex(s => s && s.id === _sermonEditingId);
    if(idx >= 0) D.sermonNotes[idx] = Object.assign({}, D.sermonNotes[idx], payload);
  } else {
    payload.id = Date.now();
    payload.createdAt = payload.updatedAt;
    D.sermonNotes.push(payload);
    // Streak protection — capturing a sermon counts as a faith action.
    if(!D.scrReadDays) D.scrReadDays = {};
    D.scrReadDays[new Date().toISOString().slice(0,10)] = true;
    D.scrPoints = (D.scrPoints || 0) + 5;
  }
  save();
  if(typeof logActivity === 'function') logActivity('faith', 'Sermon: ' + (payload.title || takeaway).slice(0, 80));
  closeSermonNote();
  renderSermonNotes();
  if(typeof renderFaithHome === 'function') renderFaithHome();
  showToast(_sermonEditingId ? 'Sermon updated' : 'Sermon saved +5 XP 📝');
}

function deleteSermonNote(){
  if(!_sermonEditingId) return;
  if(!confirm('Delete this sermon note?')) return;
  D.sermonNotes = (D.sermonNotes || []).filter(s => s && s.id !== _sermonEditingId);
  save();
  closeSermonNote();
  renderSermonNotes();
  showToast('Sermon deleted');
}

function renderSermonNotes(){
  const el = document.getElementById('sermonNotesList');
  if(!el) return;
  const list = (D.sermonNotes || []).slice().sort((a,b) => String(b.date || '').localeCompare(String(a.date || '')));
  if(!list.length){
    el.innerHTML = '<div style="text-align:center;padding:1rem;color:var(--tx2);font-size:.78rem;font-style:italic;">No sermons yet. Tap "+ New Sermon" to capture today\'s message.</div>';
    return;
  }
  // Group by month label (YYYY-MM).
  const groups = {};
  list.forEach(s => {
    const k = (s.date || '').slice(0,7) || 'Undated';
    if(!groups[k]) groups[k] = [];
    groups[k].push(s);
  });

  const monthLabel = (k) => {
    if(k === 'Undated') return 'Undated';
    const [y,m] = k.split('-');
    const dt = new Date(parseInt(y,10), parseInt(m,10) - 1, 1);
    return dt.toLocaleDateString(undefined, { month:'long', year:'numeric' });
  };

  el.innerHTML = Object.keys(groups).sort().reverse().map(k => {
    const cards = groups[k].map(s => {
      const ref = [s.church, s.speaker].filter(Boolean).join(' · ');
      return `<div onclick="openSermonNote(${s.id})" style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-left:4px solid #38bdf8;border-radius:10px;padding:.65rem .8rem;margin-bottom:.4rem;cursor:pointer;">
        <div style="display:flex;align-items:center;gap:.4rem;flex-wrap:wrap;font-size:.6rem;color:var(--tx2);font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:.25rem;">
          <span>${s.date || ''}</span>
          ${ref ? '<span>·</span><span>'+escapeHtml(ref)+'</span>' : ''}
          ${s.title ? '<span>·</span><span style="color:var(--tx);text-transform:none;letter-spacing:0;font-weight:600;">'+escapeHtml(s.title)+'</span>' : ''}
        </div>
        <div style="font-size:.85rem;line-height:1.5;color:var(--tx);font-weight:600;margin-bottom:${s.scriptures||s.actionStep?'.3rem':'0'};">⭐ ${escapeHtml(s.takeaway || '')}</div>
        ${s.scriptures ? '<div style="font-size:.7rem;color:#a78bfa;font-weight:700;margin-bottom:.2rem;">📖 '+escapeHtml(s.scriptures)+'</div>' : ''}
        ${s.actionStep ? '<div style="font-size:.7rem;color:#10b981;font-weight:700;">🎯 '+escapeHtml(s.actionStep)+'</div>' : ''}
      </div>`;
    }).join('');
    return `<div style="font-size:.66rem;font-weight:800;color:var(--tx2);text-transform:uppercase;letter-spacing:.16em;margin:.5rem 0 .35rem;">${monthLabel(k)}</div>${cards}`;
  }).join('');
}

// ── FAMILY VERSE OF THE WEEK ──────────────────────────────────
// Picks a verse from DAILY_SCRIPTURES seeded by year+ISO week so the same
// verse shows for every family member (across profiles within the same
// account) the entire week, then rotates Sunday at midnight.
function getFamilyVerseOfWeek(){
  if(typeof DAILY_SCRIPTURES === 'undefined' || !DAILY_SCRIPTURES.length) return null;
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  // ISO-ish week index (Sunday-anchored to match the streak system).
  const dayOfYear = Math.floor((now - start) / 86400000);
  const week = Math.floor(dayOfYear / 7) + 1;
  // Stride by 7 to give variety across the year, mod-clamp to array length.
  const idx = (week * 7) % DAILY_SCRIPTURES.length;
  const v = DAILY_SCRIPTURES[idx];
  return { week: week, text: v[0], ref: v[1] };
}

// ═════════════════════════════════════════════════════════════
// F2-I — FAITH ACADEMY (full curriculum: 5 modules · 18 courses · 18 quizzes)
// ═════════════════════════════════════════════════════════════
// Curriculum lives in app/js/data/academy.js as window.FAITH_ACADEMY_CURRICULUM.
// Per spec §4.11:
//   Lesson read       → +5 XP
//   Quiz pass (≥80%)  → +25 XP, certificate auto-issued
//   Module badge      → +100 XP (when all courses certified)
//   Master badge      → +500 XP (all 5 module badges)

let _acExpanded = {};       // moduleId → bool
let _acExpandedCourse = {}; // courseId → bool
let _acQuizState = null;    // { courseId, questions[], idx, answers[], correctCount }
let _acCertId    = null;    // currently-displayed certificate id

function _acCurriculum(){
  return (typeof window !== 'undefined' && window.FAITH_ACADEMY_CURRICULUM) ? window.FAITH_ACADEMY_CURRICULUM : [];
}

function _acStore(){
  if(!D.faithAcademyProgress || typeof D.faithAcademyProgress !== 'object') D.faithAcademyProgress = { lessons:{}, courses:{}, badges:{} };
  if(!D.faithAcademyProgress.lessons || typeof D.faithAcademyProgress.lessons !== 'object') D.faithAcademyProgress.lessons = {};
  if(!D.faithAcademyProgress.courses || typeof D.faithAcademyProgress.courses !== 'object') D.faithAcademyProgress.courses = {};
  if(!D.faithAcademyProgress.badges  || typeof D.faithAcademyProgress.badges  !== 'object') D.faithAcademyProgress.badges  = {};
  return D.faithAcademyProgress;
}

function _acIsParent(){
  // For families-module gating. Treat as parent unless an active CHILD
  // profile is identified (mirrors the Mom-persona default-landing logic).
  if(typeof _profiles === 'undefined' || !Array.isArray(_profiles) || !_profiles.length) return true;
  if(typeof _activeProfileId === 'undefined' || !_activeProfileId) return true;
  const active = _profiles.find(p => p && p.id === _activeProfileId);
  if(!active) return true;
  return active.isParent === true;
}

function _acCourseDone(course){
  // A course counts as "done" when all lessons are read AND quiz is passed.
  const store = _acStore();
  const allLessonsRead = (course.lessons || []).every(l => l && store.lessons[l.id]);
  const courseProg = store.courses[course.id] || {};
  const quizPassed = !!courseProg.quizPassedAt;
  return allLessonsRead && quizPassed;
}

function _acModuleDone(mod){
  const courses = (mod.courses || []);
  if(!courses.length) return false;
  return courses.every(_acCourseDone);
}

function _acAllModulesDone(){
  const cur = _acCurriculum();
  return cur.length > 0 && cur.every(m => !m.parentOnly || _acIsParent() ? _acModuleDone(m) : true)
                       && cur.filter(m => !m.parentOnly || _acIsParent()).every(_acModuleDone);
}

// ═════════════════════════════════════════════════════════════════
// F8: Featured Academy lessons — 15 new lessons from
// window.ACADEMY_LESSONS (app/js/data/academy-lessons.js).
// Renders a card grid above the legacy module browser. Click a card
// to open #lessonModal with Story-Mode-style content + inline quiz.
// Progress saves to D.academyProgress['lesson-'+id] = {score,total,passed,date}.
// A lesson is "complete" when its quiz is passed at >= 80%.
// ═════════════════════════════════════════════════════════════════
function _acFeatured(){ return (typeof window !== 'undefined' && window.ACADEMY_LESSONS) ? window.ACADEMY_LESSONS : []; }
function _acCats(){     return (typeof window !== 'undefined' && window.ACADEMY_CATEGORIES) ? window.ACADEMY_CATEGORIES : {}; }
function _acSvgs(){     return (typeof window !== 'undefined' && window.ACADEMY_CATEGORY_SVGS) ? window.ACADEMY_CATEGORY_SVGS : {}; }
function _acFeaturedById(id){ return _acFeatured().find(l => l && l.id === id) || null; }
function _acLessonProgress(id){
  if(typeof D === 'undefined' || !D) return null;
  if(!D.academyProgress) D.academyProgress = {};
  return D.academyProgress['lesson-' + id] || null;
}
function _acEsc(s){
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function renderFeaturedAcademy(){
  const grid = document.getElementById('acFeaturedGrid');
  if(!grid) return;
  const lessons = _acFeatured();
  const cats = _acCats();
  if(!lessons.length){
    grid.innerHTML = '<div style="grid-column:1/-1;padding:1rem;text-align:center;color:var(--tx2);font-size:.78rem;font-style:italic;">Featured lessons unavailable.</div>';
    return;
  }
  grid.innerHTML = lessons.map(function(l){
    const cat = cats[l.category] || { label:'Lesson', color:'#fbbf24', soft:'rgba(251,191,36,', icon:'📖' };
    const prog = _acLessonProgress(l.id);
    const done = prog && prog.passed;
    const styleVars = '--ac-card-color:' + cat.color + ';'
                    + '--ac-card-border:' + cat.soft + '.35);'
                    + '--ac-card-tint:'   + cat.soft + '.22);'
                    + '--ac-card-glow:'   + cat.soft + '.25);';
    const checkHtml = done ? '<div class="ac-card-check">✓</div>' : '';
    const progPct = done ? 100 : (prog && prog.total ? Math.round(prog.score / prog.total * 100) : 0);
    const progHtml = (prog && !done && prog.total)
      ? '<div class="ac-card-progress"><div class="ac-card-progress-bar" style="width:' + progPct + '%;background:' + cat.color + ';"></div></div>'
      : '';
    return '<div class="ac-card' + (done ? ' done' : '') + '" data-academy-id="' + _acEsc(l.id) + '" '
         + 'onclick="openLessonModal(\'' + l.id + '\')" '
         + 'style="' + styleVars + '">'
         + '<div class="ac-card-tint"></div>'
         + checkHtml
         + '<div class="ac-card-body">'
         +   '<div class="ac-card-eye">' + _acEsc(cat.icon + ' ' + cat.label.toUpperCase()) + '</div>'
         +   '<div class="ac-card-title">' + _acEsc(l.title) + '</div>'
         +   '<div class="ac-card-desc">' + _acEsc(l.description) + '</div>'
         +   '<div class="ac-card-meta">'
         +     '<span class="ac-card-badge">⏱ ' + _acEsc(l.duration || '—') + '</span>'
         +     '<span class="ac-card-badge">❓ ' + ((l.quiz || []).length) + ' quiz Qs</span>'
         + (done ? '<span class="ac-card-badge" style="background:rgba(34,197,94,.18);border-color:rgba(34,197,94,.5);color:#22c55e;">✓ Complete</span>' : '')
         +   '</div>'
         + '</div>'
         + progHtml
         + '</div>';
  }).join('');
}

// ── Lesson modal ─────────────────────────────────────────────────
let _lmQuizState = null; // { lessonId, qIdx, score, answeredAt }

function openLessonModal(lessonId){
  const lesson = _acFeaturedById(lessonId);
  if(!lesson){ if(typeof showToast === 'function') showToast('Lesson not found'); return; }
  const cats = _acCats();
  const svgs = _acSvgs();
  const cat = cats[lesson.category] || { label:'Lesson', color:'#fbbf24', icon:'📖' };

  const svgEl = document.getElementById('lmSvg');
  if(svgEl) svgEl.innerHTML = svgs[lesson.category] || '';

  const eyeEl = document.getElementById('lmEye');
  if(eyeEl) eyeEl.textContent = (cat.label || '').toUpperCase() + ' · ' + (lesson.duration || '');
  const titleEl = document.getElementById('lmTitle');
  if(titleEl) titleEl.textContent = lesson.title || '';
  const subEl = document.getElementById('lmSub');
  if(subEl) subEl.textContent = lesson.description || '';

  _lmRenderLesson(lesson);

  const wrap = document.getElementById('lmBodyWrap');
  if(wrap) wrap.scrollTop = 0;
  if(typeof openModal === 'function') openModal('lessonModal');
  if(typeof logActivity === 'function') logActivity('faith', 'Academy lesson: ' + lesson.title);
}

function _lmRenderLesson(lesson){
  const content = document.getElementById('lmContent');
  if(!content) return;
  let html = '';
  (lesson.sections || []).forEach(function(s){
    html += '<div class="lm-section">';
    html += '<h4>' + _acEsc(s.heading) + '</h4>';
    (s.paragraphs || []).forEach(function(p){
      html += '<p>' + _acEsc(p) + '</p>';
    });
    html += '</div>';
  });
  if(lesson.keyVerse && lesson.keyVerse.text){
    html += '<div class="lm-keyverse">'
         +    '<div class="lm-keyverse-text">' + _acEsc('“' + lesson.keyVerse.text + '”') + '</div>'
         +    '<div class="lm-keyverse-ref">— ' + _acEsc(lesson.keyVerse.ref || '') + '</div>'
         +  '</div>';
  }
  if(lesson.whatThisMeans){
    html += '<div class="lm-callout">'
         +    '<div class="lm-callout-eye">What This Means For You</div>'
         +    '<p>' + _acEsc(lesson.whatThisMeans) + '</p>'
         +  '</div>';
  }
  const prog = _acLessonProgress(lesson.id);
  const btnLabel = (prog && prog.passed) ? '✓ Retake Quiz' : '▶ Start Quiz';
  html += '<div class="lm-cta">'
       +    '<button class="lm-quiz-btn" onclick="startLessonQuiz(\'' + lesson.id + '\')">' + btnLabel + '</button>'
       +  '</div>';
  content.innerHTML = html;
}

function closeLessonModal(){
  if(typeof closeModal === 'function') closeModal('lessonModal');
  _lmQuizState = null;
}

// ── Inline quiz ──────────────────────────────────────────────────
function startLessonQuiz(lessonId){
  const lesson = _acFeaturedById(lessonId);
  if(!lesson || !lesson.quiz || !lesson.quiz.length) return;
  _lmQuizState = { lessonId: lessonId, qIdx: 0, score: 0, answered: false };
  _lmRenderQuizQuestion(lesson);
}

function _lmRenderQuizQuestion(lesson){
  const content = document.getElementById('lmContent');
  if(!content || !_lmQuizState) return;
  const q = lesson.quiz[_lmQuizState.qIdx];
  if(!q) return;
  const total = lesson.quiz.length;
  let html = '<div class="lm-quiz">'
           +   '<div class="lm-quiz-progress">Question ' + (_lmQuizState.qIdx + 1) + ' of ' + total + '</div>'
           +   '<div class="lm-quiz-q">' + _acEsc(q.q) + '</div>'
           +   '<div class="lm-quiz-options">';
  (q.options || []).forEach(function(opt, i){
    html += '<button class="lm-quiz-opt" data-idx="' + i + '" '
         +  'style="animation-delay:' + (i * 90) + 'ms;" '
         +  'onclick="lessonQuizSelect(' + i + ',this)">' + _acEsc(opt) + '</button>';
  });
  html += '</div>'
       +  '<div class="lm-quiz-feedback" id="lmQuizFeedback"></div>'
       +  '<div class="lm-quiz-next" id="lmQuizNextWrap"></div>'
       + '</div>';
  content.innerHTML = html;
  requestAnimationFrame(function(){
    content.querySelectorAll('.lm-quiz-opt').forEach(function(b){ b.classList.add('in'); });
  });
  _lmQuizState.answered = false;
}

function lessonQuizSelect(idx, btn){
  if(!_lmQuizState || _lmQuizState.answered) return;
  const lesson = _acFeaturedById(_lmQuizState.lessonId);
  if(!lesson) return;
  const q = lesson.quiz[_lmQuizState.qIdx];
  if(!q) return;
  _lmQuizState.answered = true;
  const correct = (idx === q.correctIdx);
  if(correct) _lmQuizState.score++;
  const buttons = document.querySelectorAll('#lmContent .lm-quiz-opt');
  buttons.forEach(function(b, i){
    b.disabled = true;
    if(i === q.correctIdx) b.classList.add('correct');
    else if(b === btn) b.classList.add('wrong');
  });
  const fb = document.getElementById('lmQuizFeedback');
  if(fb){
    const msg = correct
      ? '<strong style="color:#22c55e;">✓ Correct.</strong> '
      : '<strong style="color:#f87171;">✕ Not quite.</strong> ';
    fb.innerHTML = msg + _acEsc(q.explanation || '');
    fb.classList.add('show');
  }
  const nextWrap = document.getElementById('lmQuizNextWrap');
  if(nextWrap){
    const isLast = (_lmQuizState.qIdx + 1) >= lesson.quiz.length;
    nextWrap.innerHTML = '<button onclick="lessonQuizNext()">' + (isLast ? 'See Result →' : 'Next Question →') + '</button>';
  }
}

function lessonQuizNext(){
  if(!_lmQuizState) return;
  const lesson = _acFeaturedById(_lmQuizState.lessonId);
  if(!lesson) return;
  _lmQuizState.qIdx++;
  if(_lmQuizState.qIdx >= lesson.quiz.length){
    _lmFinishQuiz(lesson);
    return;
  }
  _lmRenderQuizQuestion(lesson);
}

function _lmFinishQuiz(lesson){
  const content = document.getElementById('lmContent');
  if(!content || !_lmQuizState) return;
  const total = lesson.quiz.length;
  const score = _lmQuizState.score;
  const pct = score / total;
  const passed = pct >= 0.8;
  let stars;
  if(pct >= 0.95) stars = 3;
  else if(pct >= 0.8) stars = 2;
  else if(pct >= 0.6) stars = 1;
  else stars = 0;

  // Persist progress
  if(typeof D !== 'undefined' && D){
    if(!D.academyProgress) D.academyProgress = {};
    D.academyProgress['lesson-' + lesson.id] = {
      score: score,
      total: total,
      passed: passed,
      date: new Date().toISOString().slice(0,10),
    };
    if(typeof save === 'function') save();
    // Toast + XP for first-time pass
    const wasComplete = D.academyProgress['lesson-' + lesson.id + '-firstPass'];
    if(passed && !wasComplete){
      D.academyProgress['lesson-' + lesson.id + '-firstPass'] = true;
      D.scrPoints = (D.scrPoints || 0) + 15;
      if(typeof save === 'function') save();
      if(typeof showToast === 'function') showToast('Lesson complete +15 XP ✨');
    }
  }

  const passMsg = passed
    ? '<span class="lm-quiz-passmsg">Passed — lesson complete.</span>'
    : '<span class="lm-quiz-failmsg">Below 80%.</span> Review the lesson and try again.';
  let starsHtml = '';
  for(let i = 0; i < 3; i++){
    starsHtml += '<span class="lm-quiz-star ' + (i < stars ? 'filled' : 'empty') + '">★</span>';
  }
  content.innerHTML = '<div class="lm-quiz">'
    + '<div class="lm-quiz-result">'
    +   '<div class="lm-quiz-result-title">Quiz Complete</div>'
    +   '<div class="lm-quiz-result-score">' + score + ' / ' + total + '</div>'
    +   '<div class="lm-quiz-result-stars">' + starsHtml + '</div>'
    +   '<div class="lm-quiz-pass">' + passMsg + '</div>'
    +   '<div class="lm-quiz-actions">'
    +     '<button onclick="startLessonQuiz(\'' + lesson.id + '\')">Retake Quiz</button>'
    +     '<button class="secondary" onclick="_lmRenderLesson(_acFeaturedById(\'' + lesson.id + '\'))">Back to Lesson</button>'
    +     '<button class="secondary" onclick="closeLessonModal();renderFeaturedAcademy();">Done</button>'
    +   '</div>'
    + '</div>'
    + '</div>';
  _lmQuizState = null;
  // Refresh the card grid so the "Complete ✓" badge shows up on return
  renderFeaturedAcademy();
}

function renderAcademyPanel(){
  // F8: render the featured grid first (15 new lessons), then the
  // legacy module browser below.
  renderFeaturedAcademy();
  const cur = _acCurriculum();
  if(!cur.length){
    const wrap = document.getElementById('acModules');
    if(wrap) wrap.innerHTML = '<div style="padding:1rem;text-align:center;color:var(--tx2);font-size:.78rem;">Curriculum failed to load.</div>';
    return;
  }
  const store = _acStore();

  // Stats
  let totalLessons = 0, doneLessons = 0, certCount = 0;
  cur.forEach(m => {
    if(m.parentOnly && !_acIsParent()) return;
    (m.courses || []).forEach(c => {
      totalLessons += (c.lessons || []).length;
      (c.lessons || []).forEach(l => { if(store.lessons[l.id]) doneLessons++; });
      const cp = store.courses[c.id];
      if(cp && cp.certificateIssuedAt) certCount++;
    });
  });
  const visibleBadges = cur.filter(m => !m.parentOnly || _acIsParent()).filter(m => store.badges[m.badgeId]).length;

  const setStat = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
  setStat('acStatLessons', doneLessons + ' / ' + totalLessons);
  setStat('acStatCerts',   certCount);
  setStat('acStatBadges',  visibleBadges);

  // Master badge banner
  const mb = document.getElementById('acMasterBadge');
  if(mb){
    const masterEarned = !!store.badges['faith-foundations-graduate'];
    const allDone = _acAllModulesDone();
    if(masterEarned){
      mb.style.display = '';
      const dt = document.getElementById('acMasterDate');
      if(dt) dt.textContent = 'Earned ' + (store.badges['faith-foundations-graduate'] || '').slice(0,10);
    } else if(allDone){
      // Award now (idempotent)
      store.badges['faith-foundations-graduate'] = new Date().toISOString();
      D.scrPoints = (D.scrPoints || 0) + 500;
      save();
      if(typeof logActivity === 'function') logActivity('faith', 'Master badge earned: Faith Foundations Graduate');
      showToast('🏅 Faith Foundations Graduate earned! +500 XP');
      mb.style.display = '';
    } else {
      mb.style.display = 'none';
    }
  }

  // Render module cards
  const wrap = document.getElementById('acModules');
  if(!wrap) return;

  wrap.innerHTML = cur.map(m => {
    const isLocked = !!m.parentOnly && !_acIsParent();
    const courses = m.courses || [];
    let moduleLessons = 0, moduleDone = 0;
    courses.forEach(c => {
      moduleLessons += (c.lessons || []).length;
      (c.lessons || []).forEach(l => { if(store.lessons[l.id]) moduleDone++; });
    });
    const pct = moduleLessons ? Math.round((moduleDone / moduleLessons) * 100) : 0;
    const expanded = !!_acExpanded[m.id];
    const hasBadge = !!store.badges[m.badgeId];

    let coursesHtml = '';
    if(!isLocked && expanded){
      coursesHtml = courses.map(c => _acCourseHtml(m, c, store)).join('');
    }

    return `<div class="ac-module" style="border-left-color:${m.color};${isLocked?'opacity:.55;':''}">
      <div class="ac-module-hdr" onclick="${isLocked?'':`acToggleModule('${m.id}')`}">
        <span class="ac-module-icon">${m.icon}</span>
        <div style="flex:1;min-width:0;">
          <div class="ac-module-title" style="color:${m.color};">${escapeHtml(m.title)}${isLocked?' <span style="font-size:.6rem;font-weight:700;color:var(--tx3);text-transform:uppercase;letter-spacing:.1em;">· Parent only</span>':''}</div>
          <div class="ac-module-meta">${courses.length} course${courses.length===1?'':'s'} · ${moduleLessons} lessons · ${moduleDone} read · ${pct}%</div>
          ${hasBadge ? '<span class="ac-badge">🏆 '+escapeHtml(m.badgeLabel)+' earned</span>' : ''}
        </div>
        ${isLocked?'<span style="font-size:.95rem;color:var(--tx3);">🔒</span>':`<span class="ac-module-toggle">${expanded?'▼':'▶'}</span>`}
      </div>
      <div class="ac-bar"><div class="ac-bar-fill" style="width:${pct}%;background:linear-gradient(90deg,#38bdf8,${m.color});"></div></div>
      <div style="font-size:.72rem;color:var(--tx2);line-height:1.5;margin-bottom:${expanded&&!isLocked?'.6rem':'0'};">${escapeHtml(m.description||'')}</div>
      ${coursesHtml ? '<div style="display:flex;flex-direction:column;gap:.5rem;margin-top:.4rem;">'+coursesHtml+'</div>' : ''}
    </div>`;
  }).join('');
}

function _acCourseHtml(mod, course, store){
  const lessons = course.lessons || [];
  const done = lessons.filter(l => store.lessons[l.id]).length;
  const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
  const allLessonsDone = done === lessons.length && lessons.length > 0;
  const cp = store.courses[course.id] || {};
  const quizPassed = !!cp.quizPassedAt;
  const certIssued = !!cp.certificateIssuedAt;
  const expanded = !!_acExpandedCourse[course.id];

  let lessonsHtml = '';
  if(expanded){
    lessonsHtml = lessons.map(l => {
      const isDone = !!store.lessons[l.id];
      return `<div onclick="openAcademyLesson('${course.id}','${l.id}')" style="background:rgba(255,255,255,.04);border:1px solid ${isDone?'rgba(16,185,129,.3)':'rgba(255,255,255,.08)'};${isDone?'background:rgba(16,185,129,.06);':''}border-radius:9px;padding:.5rem .65rem;cursor:pointer;display:flex;align-items:center;gap:.4rem;">
        <span style="flex:1;font-size:.74rem;font-weight:700;color:${isDone?'var(--tx2)':'var(--tx)'};line-height:1.3;">${escapeHtml(l.title)}</span>
        ${l.duration ? '<span style="font-size:.6rem;color:var(--tx3);font-weight:700;">'+escapeHtml(l.duration)+'</span>' : ''}
        <span style="font-size:.85rem;flex-shrink:0;">${isDone?'✅':'○'}</span>
      </div>`;
    }).join('');
  }

  // Quiz button — locked until all lessons done.
  let quizCta;
  if(certIssued){
    quizCta = `<button onclick="openAcademyCertificate('${course.id}')" style="background:linear-gradient(135deg,#fbbf24,#fb923c);color:#0b1220;border:none;border-radius:8px;padding:.4rem .8rem;font-size:.7rem;font-weight:800;cursor:pointer;font-family:var(--fm);">🏆 View Certificate</button>`;
  } else if(quizPassed){
    quizCta = `<button onclick="acIssueCertificate('${course.id}')" style="background:linear-gradient(135deg,#10b981,#34d399);color:#0b1220;border:none;border-radius:8px;padding:.4rem .8rem;font-size:.7rem;font-weight:800;cursor:pointer;font-family:var(--fm);">🏆 Get Certificate</button>`;
  } else if(allLessonsDone){
    quizCta = `<button onclick="acStartQuiz('${course.id}')" style="background:var(--cd-banner);color:var(--cd-banner-text);border:none;border-radius:8px;padding:.4rem .8rem;font-size:.7rem;font-weight:800;cursor:pointer;font-family:var(--fm);">❓ Start Quiz</button>`;
  } else {
    quizCta = `<span style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:var(--tx3);border-radius:8px;padding:.4rem .8rem;font-size:.66rem;font-weight:700;cursor:not-allowed;">🔒 Finish lessons to unlock quiz</span>`;
  }

  return `<div style="background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08);border-radius:11px;padding:.7rem .85rem;">
    <div style="display:flex;align-items:center;gap:.4rem;cursor:pointer;" onclick="acToggleCourse('${course.id}')">
      <div style="flex:1;">
        <div style="font-size:.82rem;font-weight:800;color:var(--tx);line-height:1.3;">${escapeHtml(course.title)}</div>
        <div style="font-size:.62rem;color:var(--tx2);font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-top:.1rem;">${lessons.length} lessons · ${done} read · ${pct}%${quizPassed?' · Quiz passed '+(cp.quizBestScore?Math.round(cp.quizBestScore*100)+'%':''):''}</div>
      </div>
      <span style="font-size:.7rem;color:var(--tx3);">${expanded?'▼':'▶'}</span>
    </div>
    ${expanded ? `<div style="font-size:.7rem;color:var(--tx2);line-height:1.5;margin-top:.4rem;">${escapeHtml(course.description || '')}</div>
      <div style="display:flex;flex-direction:column;gap:.3rem;margin-top:.5rem;">${lessonsHtml}</div>
      <div style="display:flex;gap:.4rem;margin-top:.5rem;flex-wrap:wrap;align-items:center;">${quizCta}</div>` : ''}
  </div>`;
}

function acToggleModule(moduleId){
  _acExpanded[moduleId] = !_acExpanded[moduleId];
  renderAcademyPanel();
}

function acToggleCourse(courseId){
  _acExpandedCourse[courseId] = !_acExpandedCourse[courseId];
  renderAcademyPanel();
}

// Open a curriculum lesson in charModal with Mark-Complete CTA.
function openAcademyLesson(courseId, lessonId){
  const cur = _acCurriculum();
  let course=null, lesson=null, mod=null;
  for(const m of cur){
    for(const c of (m.courses || [])){
      const l = (c.lessons || []).find(x => x.id === lessonId);
      if(l && c.id === courseId){ course = c; lesson = l; mod = m; break; }
    }
    if(lesson) break;
  }
  if(!lesson){ showToast('Lesson not found'); return; }

  const store = _acStore();
  const isDone = !!store.lessons[lesson.id];

  document.getElementById('charIcon').textContent  = mod.icon;
  document.getElementById('charTitle').textContent = lesson.title;
  document.getElementById('charSub').textContent   = course.title + ' · ' + (lesson.duration || '');
  document.getElementById('charModalHeader').style.background = 'linear-gradient(135deg,#38bdf8,'+mod.color+')';
  const refsHtml = (lesson.scriptureRefs && lesson.scriptureRefs.length)
    ? '<div style="background:rgba(167,139,250,.05);border-left:3px solid #a78bfa;border-radius:0 8px 8px 0;padding:.6rem .8rem;margin-top:1rem;font-size:.75rem;color:var(--tx2);"><strong style="color:#a78bfa;">📖 Scripture:</strong> ' + lesson.scriptureRefs.map(r => escapeHtml(r)).join(', ') + '</div>'
    : '';
  const reflectHtml = lesson.reflectionPrompt
    ? '<div style="background:rgba(16,185,129,.05);border-left:3px solid #10b981;border-radius:0 8px 8px 0;padding:.6rem .8rem;margin-top:.6rem;font-size:.78rem;color:var(--tx2);font-style:italic;line-height:1.6;"><strong style="color:#10b981;font-style:normal;">💭 Reflection:</strong> ' + escapeHtml(lesson.reflectionPrompt) + '</div>'
    : '';
  const cta = isDone
    ? `<div style="margin-top:1.2rem;padding:.75rem;background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.3);border-radius:10px;text-align:center;font-size:.78rem;font-weight:700;color:#10b981;">✅ Lesson complete · +5 XP earned</div>`
    : `<div style="margin-top:1.2rem;text-align:center;"><button onclick="academyMarkLessonNew('${courseId}','${lesson.id}')" style="background:linear-gradient(135deg,#38bdf8,${mod.color});color:#0b1220;border:none;border-radius:10px;padding:.6rem 1.4rem;font-size:.82rem;font-weight:800;cursor:pointer;font-family:var(--fm);">✅ Mark Lesson Complete +5 XP</button></div>`;
  document.getElementById('charBody').innerHTML = (lesson.body || '') + refsHtml + reflectHtml + cta;
  document.getElementById('charQuiz').innerHTML = '';
  openModal('charModal');
  if(typeof logActivity === 'function') logActivity('faith', 'Academy lesson opened: ' + lesson.title);
}

function academyMarkLessonNew(courseId, lessonId){
  const store = _acStore();
  if(store.lessons[lessonId]){ showToast('Already complete'); return; }
  store.lessons[lessonId] = new Date().toISOString();
  D.scrPoints = (D.scrPoints || 0) + 5;
  if(!D.scrReadDays) D.scrReadDays = {};
  D.scrReadDays[new Date().toISOString().slice(0,10)] = true;
  save();
  if(typeof logActivity === 'function') logActivity('faith', 'Lesson complete: ' + lessonId);
  showToast('Lesson complete +5 XP ✓');
  // Refresh modal in place + panel.
  openAcademyLesson(courseId, lessonId);
  renderAcademyPanel();
  if(typeof renderFaithHome === 'function') renderFaithHome();
}

// ── QUIZ ─────────────────────────────────────────────────────
function acStartQuiz(courseId){
  const cur = _acCurriculum();
  let course=null;
  for(const m of cur){
    for(const c of (m.courses || [])){ if(c.id === courseId){ course = c; break; } }
    if(course) break;
  }
  if(!course || !course.quiz){ showToast('Quiz not available'); return; }
  _acQuizState = {
    courseId: courseId,
    questions: course.quiz.questions || [],
    idx: 0,
    answers: [],
    correctCount: 0,
    locked: false, // current question locked after answering
    passThreshold: course.quiz.passThreshold || 0.8,
  };
  document.getElementById('acqTitle').textContent = course.title + ' Quiz';
  if(typeof openModal === 'function') openModal('acQuizModal');
  _acRenderQuizQuestion();
}

function acCloseQuiz(){
  _acQuizState = null;
  if(typeof closeModal === 'function') closeModal('acQuizModal');
}

function _acRenderQuizQuestion(){
  if(!_acQuizState) return;
  const body = document.getElementById('acqBody');
  const footer = document.getElementById('acqFooter');
  const progressEl = document.getElementById('acqProgress');
  if(!body || !footer) return;

  const total = _acQuizState.questions.length;
  if(_acQuizState.idx >= total){
    // Quiz finished — show results + record.
    const score = _acQuizState.correctCount / total;
    const pct   = Math.round(score * 100);
    const passed = score >= _acQuizState.passThreshold;

    const store = _acStore();
    if(!store.courses[_acQuizState.courseId]) store.courses[_acQuizState.courseId] = {};
    const cp = store.courses[_acQuizState.courseId];
    cp.quizAttempts = (cp.quizAttempts || 0) + 1;
    if(!cp.quizBestScore || score > cp.quizBestScore){
      cp.quizBestScore = score;
    }
    if(passed && !cp.quizPassedAt){
      cp.quizPassedAt = new Date().toISOString();
      D.scrPoints = (D.scrPoints || 0) + 25;
      if(!D.scrReadDays) D.scrReadDays = {};
      D.scrReadDays[new Date().toISOString().slice(0,10)] = true;
      if(typeof logActivity === 'function') logActivity('faith', 'Quiz passed: ' + _acQuizState.courseId);
    }
    save();

    progressEl.textContent = '';
    body.innerHTML = `<div style="text-align:center;padding:1rem .5rem;">
      <div style="font-size:3rem;margin-bottom:.4rem;">${passed ? '🏆' : '📚'}</div>
      <div style="font-family:var(--fh,var(--fm));font-size:1.4rem;font-weight:800;color:${passed?'#10b981':'#fbbf24'};margin-bottom:.4rem;">${pct}%</div>
      <div style="font-size:.9rem;color:var(--tx);font-weight:700;margin-bottom:.5rem;">${passed ? 'Passed!' : 'So close — keep going.'}</div>
      <div style="font-size:.78rem;color:var(--tx2);line-height:1.55;">${passed
        ? 'Course quiz cleared at ' + Math.round(_acQuizState.passThreshold * 100) + '%+. Issue your certificate when you are ready.'
        : 'You need ' + Math.round(_acQuizState.passThreshold * 100) + '% to pass. Review the lessons and try again.'}</div>
      <div style="font-size:.7rem;color:var(--tx3);margin-top:.5rem;">${_acQuizState.correctCount} of ${total} correct · attempt ${cp.quizAttempts}</div>
    </div>`;
    footer.innerHTML = passed
      ? `<button onclick="acIssueCertificate('${_acQuizState.courseId}')" style="background:linear-gradient(135deg,#10b981,#34d399);color:#0b1220;border:none;border-radius:10px;padding:.55rem 1rem;font-size:.78rem;font-weight:800;cursor:pointer;font-family:var(--fm);">🏆 Get Certificate</button>
        <button onclick="acCloseQuiz()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:var(--tx);border-radius:10px;padding:.55rem 1rem;font-size:.74rem;font-weight:700;cursor:pointer;font-family:var(--fm);">Close</button>`
      : `<button onclick="acStartQuiz('${_acQuizState.courseId}')" style="background:var(--cd-banner);color:var(--cd-banner-text);border:none;border-radius:10px;padding:.55rem 1rem;font-size:.78rem;font-weight:800;cursor:pointer;font-family:var(--fm);">Try Again</button>
        <button onclick="acCloseQuiz()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:var(--tx);border-radius:10px;padding:.55rem 1rem;font-size:.74rem;font-weight:700;cursor:pointer;font-family:var(--fm);">Close</button>`;
    renderAcademyPanel();
    if(typeof renderFaithHome === 'function') renderFaithHome();
    return;
  }

  const q = _acQuizState.questions[_acQuizState.idx];
  progressEl.textContent = (_acQuizState.idx + 1) + ' / ' + total;
  const optionsHtml = (q.options || []).map((opt, i) =>
    `<button onclick="_acAnswerQuiz(${i})" style="text-align:left;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:var(--tx);border-radius:10px;padding:.6rem .85rem;font-family:var(--fm);font-size:.82rem;line-height:1.45;cursor:pointer;width:100%;margin-bottom:.35rem;">${String.fromCharCode(65+i)}. ${escapeHtml(opt)}</button>`
  ).join('');

  body.innerHTML = `<div style="font-size:.66rem;font-weight:800;color:#a78bfa;text-transform:uppercase;letter-spacing:.16em;margin-bottom:.45rem;">Question ${_acQuizState.idx + 1} of ${total}</div>
    <div style="font-size:.95rem;line-height:1.55;color:var(--tx);font-weight:600;margin-bottom:.85rem;">${escapeHtml(q.q || '')}</div>
    <div>${optionsHtml}</div>`;
  footer.innerHTML = `<button onclick="acCloseQuiz()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:var(--tx);border-radius:10px;padding:.5rem .85rem;font-size:.74rem;font-weight:700;cursor:pointer;font-family:var(--fm);">End Session</button>`;
  _acQuizState.locked = false;
}

function _acAnswerQuiz(choiceIdx){
  if(!_acQuizState || _acQuizState.locked) return;
  _acQuizState.locked = true;
  const q = _acQuizState.questions[_acQuizState.idx];
  const correct = (choiceIdx === q.correctIdx);
  if(correct) _acQuizState.correctCount++;
  _acQuizState.answers.push({ chosen: choiceIdx, correct: correct });

  // Re-render with feedback per Roady's Training fix: lock all options,
  // mark user's choice ✅ or ❌, ALWAYS highlight the correct answer in green,
  // reveal the explanation.
  const body = document.getElementById('acqBody');
  const footer = document.getElementById('acqFooter');
  const total = _acQuizState.questions.length;

  const optionsHtml = (q.options || []).map((opt, i) => {
    let bg = 'rgba(255,255,255,.04)';
    let bd = 'rgba(255,255,255,.1)';
    let badge = '';
    if(i === q.correctIdx){
      bg = 'rgba(16,185,129,.15)';
      bd = 'rgba(16,185,129,.45)';
      badge = ' <span style="float:right;color:#10b981;font-weight:800;">✅ Correct</span>';
    }
    if(i === choiceIdx && i !== q.correctIdx){
      bg = 'rgba(239,68,68,.12)';
      bd = 'rgba(239,68,68,.35)';
      badge = ' <span style="float:right;color:#f87171;font-weight:800;">❌ Your choice</span>';
    }
    return `<div style="background:${bg};border:1px solid ${bd};color:var(--tx);border-radius:10px;padding:.6rem .85rem;font-family:var(--fm);font-size:.82rem;line-height:1.45;width:100%;margin-bottom:.35rem;">${String.fromCharCode(65+i)}. ${escapeHtml(opt)}${badge}</div>`;
  }).join('');

  body.innerHTML = `<div style="font-size:.66rem;font-weight:800;color:#a78bfa;text-transform:uppercase;letter-spacing:.16em;margin-bottom:.45rem;">Question ${_acQuizState.idx + 1} of ${total}</div>
    <div style="font-size:.95rem;line-height:1.55;color:var(--tx);font-weight:600;margin-bottom:.85rem;">${escapeHtml(q.q || '')}</div>
    <div>${optionsHtml}</div>
    ${q.explanation ? '<div style="margin-top:.7rem;background:rgba(56,189,248,.06);border-left:3px solid #38bdf8;border-radius:0 8px 8px 0;padding:.6rem .8rem;font-size:.78rem;line-height:1.55;color:var(--tx2);"><strong style="color:#38bdf8;">Why:</strong> ' + escapeHtml(q.explanation) + '</div>' : ''}`;
  const isLast = (_acQuizState.idx + 1 >= total);
  footer.innerHTML = `<button onclick="acCloseQuiz()" style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:var(--tx);border-radius:10px;padding:.5rem .85rem;font-size:.74rem;font-weight:700;cursor:pointer;font-family:var(--fm);">End Session</button>
    <button onclick="_acQuizNext()" style="background:var(--cd-banner);color:var(--cd-banner-text);border:none;border-radius:10px;padding:.5rem 1rem;font-size:.78rem;font-weight:800;cursor:pointer;font-family:var(--fm);">${isLast?'See Results →':'Next →'}</button>`;
}

function _acQuizNext(){
  if(!_acQuizState) return;
  _acQuizState.idx++;
  _acRenderQuizQuestion();
}

// ── CERTIFICATES ─────────────────────────────────────────────
// Issue (or re-issue) a certificate for a passed course. Awards module
// badge if all courses in the module are now certified.
function acIssueCertificate(courseId){
  const store = _acStore();
  if(!store.courses[courseId]) store.courses[courseId] = {};
  const cp = store.courses[courseId];
  if(!cp.quizPassedAt){ showToast('Pass the quiz first'); return; }
  if(!cp.certificateId){
    cp.certificateId = _acGenCertId(courseId);
    cp.certificateIssuedAt = new Date().toISOString();
    D.scrPoints = (D.scrPoints || 0) + 50;
    if(typeof logActivity === 'function') logActivity('faith', 'Certificate issued: ' + courseId);
    showToast('🏆 Certificate issued! +50 XP');
    // Module-badge check
    const cur = _acCurriculum();
    for(const m of cur){
      const courses = m.courses || [];
      const allCertified = courses.every(c => {
        const ccp = store.courses[c.id];
        return ccp && ccp.certificateIssuedAt;
      });
      if(allCertified && courses.length && !store.badges[m.badgeId]){
        store.badges[m.badgeId] = new Date().toISOString();
        D.scrPoints += 100;
        if(typeof logActivity === 'function') logActivity('faith', 'Module badge: ' + m.badgeLabel);
        showToast('🏆 ' + m.badgeLabel + ' module badge! +100 XP');
      }
    }
    save();
  }
  openAcademyCertificate(courseId);
  renderAcademyPanel();
  if(typeof renderFaithHome === 'function') renderFaithHome();
}

function _acGenCertId(courseId){
  const slug = courseId.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8);
  const rnd  = Math.random().toString(36).slice(2,6).toUpperCase();
  return 'YLCC-FAITH-' + slug + '-' + rnd;
}

function openAcademyCertificate(courseId){
  const cur = _acCurriculum();
  let course=null, mod=null;
  for(const m of cur){
    for(const c of (m.courses || [])){ if(c.id === courseId){ course = c; mod = m; break; } }
    if(course) break;
  }
  if(!course){ showToast('Certificate not found'); return; }
  const store = _acStore();
  const cp = store.courses[courseId];
  if(!cp || !cp.certificateIssuedAt){ showToast('Certificate not yet issued'); return; }

  _acCertId = cp.certificateId;
  const idLabel = document.getElementById('acCertIdLabel');
  if(idLabel) idLabel.textContent = cp.certificateId || '';
  if(typeof openModal === 'function') openModal('acCertModal');
  setTimeout(function(){ _acCertRender(course, mod, cp); }, 30);
}

function acCloseCert(){
  if(typeof closeModal === 'function') closeModal('acCertModal');
  _acCertId = null;
}

function _acCertRender(course, mod, cp){
  const c = document.getElementById('acCertCanvas');
  if(!c) return;
  const ctx = c.getContext('2d'); if(!ctx) return;
  const W = c.width, H = c.height;
  ctx.clearRect(0,0,W,H);

  // Background — soft gradient
  const g = ctx.createLinearGradient(0,0,W,H);
  g.addColorStop(0, '#fdfdff');
  g.addColorStop(1, '#f1f5fb');
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);

  // Outer brand border
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#38bdf8';
  ctx.strokeRect(28, 28, W-56, H-56);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#a78bfa';
  ctx.strokeRect(56, 56, W-112, H-112);

  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';

  // Top wordmark
  ctx.font = '600 28px "Inter", system-ui, sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText('YOURLIFECC · FAITH ACADEMY', W/2, 130);

  // Title
  ctx.font = '900 64px "Bebas Neue", Inter, sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.fillText('CERTIFICATE OF COMPLETION', W/2, 220);

  // Sub
  ctx.font = '600 22px "Inter", system-ui, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('This certifies that', W/2, 280);

  // Recipient name
  const recipient = (D && D.name) ? D.name : (D && D.profile && D.profile.parentName) ? D.profile.parentName : 'Faith Hub Member';
  ctx.font = '900 56px "Bebas Neue", Inter, sans-serif';
  ctx.fillStyle = mod && mod.color ? mod.color : '#a78bfa';
  ctx.fillText(recipient, W/2, 360);

  // Course
  ctx.font = '600 22px "Inter", system-ui, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('has completed the course', W/2, 430);

  ctx.font = '900 44px "Bebas Neue", Inter, sans-serif';
  ctx.fillStyle = '#0f172a';
  // Wrap title if very long
  const courseTitle = (course && course.title) || '';
  const moduleTitle = (mod && mod.title) || '';
  ctx.fillText(courseTitle, W/2, 490);

  ctx.font = '600 22px "Inter", system-ui, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('within ' + moduleTitle, W/2, 530);

  // Date + ID footer
  const issued = (cp && cp.certificateIssuedAt) ? cp.certificateIssuedAt.slice(0,10) : new Date().toISOString().slice(0,10);
  ctx.font = '600 20px "Inter", system-ui, sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText('Awarded ' + issued, W/2, 660);

  ctx.font = '500 16px "Inter", system-ui, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Certificate ID: ' + (cp && cp.certificateId ? cp.certificateId : '—'), W/2, 700);

  ctx.font = '700 18px "Inter", system-ui, sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('yourlifecc.com', W/2, 740);
}

function _acCertBlob(){
  return new Promise(function(resolve, reject){
    const c = document.getElementById('acCertCanvas');
    if(!c){ reject(new Error('Canvas not found')); return; }
    if(c.toBlob){ c.toBlob(function(blob){ if(!blob) reject(new Error('Blob fail')); else resolve(blob); }, 'image/png'); }
    else {
      try {
        const url = c.toDataURL('image/png');
        const bin = atob(url.split(',')[1]);
        const arr = new Uint8Array(bin.length);
        for(let i=0;i<bin.length;i++) arr[i] = bin.charCodeAt(i);
        resolve(new Blob([arr], { type:'image/png' }));
      } catch(e){ reject(e); }
    }
  });
}

function acCertDownload(){
  _acCertBlob().then(function(blob){
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'yourlifecc-certificate-' + (_acCertId || 'cert').toLowerCase() + '.png';
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){ document.body.removeChild(a); URL.revokeObjectURL(url); }, 400);
    showToast('Certificate downloaded ✓');
  }).catch(function(){ showToast('Could not download'); });
}

function acCertPrint(){
  const c = document.getElementById('acCertCanvas');
  if(!c){ showToast('Certificate not loaded'); return; }
  const url = c.toDataURL('image/png');
  const w = window.open('', '_blank');
  if(!w){ showToast('Pop-ups blocked — try downloading instead'); return; }
  w.document.write('<!doctype html><html><head><title>Certificate</title><style>@page{margin:0;}body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#fff;}img{max-width:100%;height:auto;}</style></head><body><img src="' + url + '" onload="window.print();setTimeout(function(){window.close();},250);"></body></html>');
  w.document.close();
}

// ═════════════════════════════════════════════════════════════
// F3-B — BIBLICAL WORLD (foundation: map · sites · place-tag taps)
// ═════════════════════════════════════════════════════════════
// Leaflet map (CDN, MIT-licensed) with 30 site markers + 8 period filters.
// Site detail drawer wires up to F2-D's data-place taps in the Bible reader.
// Photos plug in once BiblePlaces.com (or alternative) licensing lands —
// each site has heroPhoto:null reserved.

let _bwMap = null;
let _bwMarkers = [];
let _bwEra = 'all';

function _bwSites(){ return (typeof window !== 'undefined' && window.BIBLICAL_SITES) ? window.BIBLICAL_SITES : []; }
function _bwPeriods(){ return (typeof window !== 'undefined' && window.BIBLICAL_PERIODS) ? window.BIBLICAL_PERIODS : []; }
function _bwSiteById(id){ return _bwSites().find(s => s && s.id === id) || null; }
function _bwPeriodById(id){ return _bwPeriods().find(p => p && p.id === id) || null; }

function renderBibleWorld(){
  // Build filter chips (idempotent — only build once).
  const filterWrap = document.getElementById('bwFilters');
  if(filterWrap && !filterWrap.dataset.bwBuilt){
    const periods = _bwPeriods();
    let html = '<button class="bw-chip active" data-bw-era="all" onclick="bwFilter(\'all\',this)">All eras</button>';
    periods.forEach(p => {
      html += '<button class="bw-chip" data-bw-era="'+p.id+'" style="--era-color:'+p.color+';" onclick="bwFilter(\''+p.id+'\',this)">'+escapeHtml(p.label)+'</button>';
    });
    filterWrap.innerHTML = html;
    filterWrap.dataset.bwBuilt = '1';
  }

  // Initialize map lazily — Leaflet may still be loading on first call.
  _bwInitMap();
  _bwRenderMarkers();
  _bwRenderGrid();
}

function _bwInitMap(){
  if(_bwMap) return;
  if(typeof L === 'undefined'){
    // Leaflet not loaded yet — retry after a short delay.
    setTimeout(_bwInitMap, 200);
    return;
  }
  const el = document.getElementById('bwMap');
  if(!el) return;
  // Center the initial view on Israel/Levant — most sites cluster here.
  _bwMap = L.map(el, {
    zoomControl: true,
    scrollWheelZoom: false,  // avoid hijacking page scroll on mobile
  }).setView([31.78, 35.21], 6);
  // CartoDB Voyager — clean, neutral basemap. MIT/free for non-commercial-ish use;
  // swap to OpenStreetMap (https://tile.openstreetmap.org/{z}/{x}/{y}.png) if needed.
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap, &copy; CARTO',
    maxZoom: 18,
    subdomains: 'abcd',
  }).addTo(_bwMap);
}

function _bwRenderMarkers(){
  if(!_bwMap) return;
  // Clear previous markers.
  _bwMarkers.forEach(m => { try { _bwMap.removeLayer(m); } catch(_){} });
  _bwMarkers = [];

  const sites = _bwSites().filter(s => s && (_bwEra === 'all' || (s.eras || []).indexOf(_bwEra) !== -1));
  sites.forEach(s => {
    if(typeof s.lat !== 'number' || typeof s.lng !== 'number') return;
    // Pick the marker color from the first matching era for the active filter,
    // or the most recent era if "all" is selected.
    const eraId = (_bwEra !== 'all' ? _bwEra : (s.eras && s.eras[s.eras.length-1])) || '';
    const period = _bwPeriodById(eraId);
    const color  = period ? period.color : '#38bdf8';
    const icon = L.divIcon({
      className: 'bw-marker',
      html: '<div style="width:18px;height:18px;border-radius:50%;background:'+color+';border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35);"></div>',
      iconSize: [18,18],
      iconAnchor: [9,9],
    });
    const m = L.marker([s.lat, s.lng], { icon: icon }).addTo(_bwMap);
    m.bindPopup('<b>'+_bwEsc(s.name)+'</b><br><span style="font-size:11px;color:#555;">'+_bwEsc(s.tagline||'')+'</span><br><a href="javascript:void(0)" onclick="openBwSite(\''+s.id+'\')">Read more →</a>');
    _bwMarkers.push(m);
  });
}

function _bwRenderGrid(){
  const el = document.getElementById('bwGrid');
  const hdr = document.getElementById('bwListHdr');
  if(!el) return;
  const sites = _bwSites().filter(s => s && (_bwEra === 'all' || (s.eras || []).indexOf(_bwEra) !== -1));
  if(hdr){
    if(_bwEra === 'all') hdr.textContent = 'All sites (' + sites.length + ')';
    else {
      const p = _bwPeriodById(_bwEra);
      hdr.textContent = (p ? p.label : _bwEra) + ' (' + sites.length + ')';
    }
  }
  if(!sites.length){
    el.innerHTML = '<div style="text-align:center;padding:1rem;color:var(--tx2);font-size:.78rem;font-style:italic;">No sites for this era yet.</div>';
    return;
  }
  el.innerHTML = sites.map(s => {
    const eraIds = s.eras || [];
    const firstEra = eraIds[0] || '';
    // Each era family gets its own warm tint, matching Reading Plans cards.
    // Two stops of low-opacity color blended diagonally.
    const eraTints = {
      'patriarchs':       'rgba(251,191,36,.08), rgba(251,191,36,.03)',
      'exodus-conquest':  'rgba(251,146,60,.08), rgba(251,191,36,.03)',
      'judges':           'rgba(167,139,250,.08), rgba(139,92,246,.04)',
      'united-kingdom':   'rgba(56,189,248,.08), rgba(167,139,250,.04)',
      'divided-kingdom':  'rgba(56,189,248,.08), rgba(167,139,250,.04)',
      'exile-return':     'rgba(167,139,250,.08), rgba(139,92,246,.04)',
      'second-temple':    'rgba(52,211,153,.08), rgba(34,197,94,.04)',
      'jesus-ministry':   'rgba(34,211,238,.08), rgba(56,189,248,.04)',
      'pauline-journeys': 'rgba(248,113,113,.08), rgba(251,146,60,.04)',
    };
    const tint = eraTints[firstEra] || 'rgba(251,191,36,.06), rgba(167,139,250,.04)';
    const firstPeriod = _bwPeriodById(firstEra);
    const accent = firstPeriod ? firstPeriod.color : '#fbbf24';
    // Pill badges per era — color-mix tinted bg + border (CSS handles fallback)
    const pills = eraIds.slice(0, 3).map(id => {
      const p = _bwPeriodById(id);
      const c = p ? p.color : '#38bdf8';
      const label = p ? p.label : id;
      return '<span class="bw-card-era" style="--era-c:'+c+';">'+_bwEsc(label)+'</span>';
    }).join('');
    // Photo thumbnail (40x40 rounded, gold hairline) or 🏺 emoji fallback
    const photo = s.heroPhoto
      ? '<div class="bw-card-photo"><img src="'+_bwEsc(s.heroPhoto)+'" alt="" loading="lazy"></div>'
      : '<div class="bw-card-photo bw-card-photo-fallback">🏺</div>';
    // First scripture ref as a small pill at the bottom
    const refPill = (s.scriptureRefs && s.scriptureRefs.length)
      ? '<span class="bw-card-ref">📖 '+_bwEsc(s.scriptureRefs[0])+'</span>'
      : '';
    return '<button class="bw-card" data-bw-id="'+_bwEsc(s.id)+'" '
         +   'onclick="openBwSite(this.dataset.bwId)" '
         +   'style="--era-tint:'+tint+';--era-c:'+accent+';">'
         + '<div class="bw-card-top">'
         +   '<div class="bw-card-head">'
         +     '<div class="bw-card-name">'+_bwEsc(s.name)+'</div>'
         +     (pills ? '<div class="bw-card-eras">'+pills+'</div>' : '')
         +   '</div>'
         +   photo
         + '</div>'
         + '<div class="bw-card-tagline">'+_bwEsc(s.tagline || '')+'</div>'
         + '<div class="bw-card-foot">'
         +   refPill
         +   '<span class="bw-card-cta">Explore →</span>'
         + '</div>'
         + '</button>';
  }).join('');
}

function bwFilter(eraId, btn){
  _bwEra = eraId;
  document.querySelectorAll('#bwFilters .bw-chip').forEach(c => {
    c.classList.remove('active');
    c.style.background = '';
    c.style.borderColor = '';
    c.style.color = '';
  });
  if(btn){
    btn.classList.add('active');
    if(eraId === 'all'){
      btn.style.background = 'var(--cd-banner)';
      btn.style.color = 'var(--cd-banner-text)';
      btn.style.borderColor = 'transparent';
    } else {
      const p = _bwPeriodById(eraId);
      const c = p ? p.color : '#38bdf8';
      btn.style.background = c;
      btn.style.color = '#0b1220';
      btn.style.borderColor = 'transparent';
    }
  }
  _bwRenderMarkers();
  _bwRenderGrid();
}

function openBwSite(siteId){
  const s = _bwSiteById(siteId);
  if(!s){ showToast('Site not found'); return; }
  const periods = _bwPeriods();
  const eraLabels = (s.eras || []).map(id => {
    const p = periods.find(x => x.id === id);
    return p ? p.label : id;
  }).join(' · ');
  document.getElementById('bwSiteEra').textContent = eraLabels || '—';
  document.getElementById('bwSiteName').innerHTML = _bwEsc(s.name);
  document.getElementById('bwSiteTagline').textContent = s.tagline || '';
  document.getElementById('bwSiteBody').innerHTML = (typeof renderInfographicFor === 'function' ? renderInfographicFor(siteId) : '') + (s.body || '');
  // Phase 5.6 — render the verified Wikimedia hero photo when one is set;
  // fall back to the placeholder text otherwise.
  const photoEl = document.getElementById('bwSitePhoto');
  if(photoEl){
    if(s.heroPhoto){
      photoEl.innerHTML = '<img loading="lazy" src="' + _bwEsc(s.heroPhoto) + '" alt="' + _bwEsc(s.name) + '" style="width:100%;height:220px;object-fit:cover;border-radius:8px;display:block;">';
      photoEl.style.height = 'auto';
      photoEl.style.background = 'transparent';
      photoEl.style.padding = '.6rem .6rem 0';
    } else {
      photoEl.innerHTML = '📷 Photo coming when image library lands';
      photoEl.style.height = '140px';
      photoEl.style.background = 'linear-gradient(135deg,rgba(56,189,248,.08),rgba(167,139,250,.08))';
      photoEl.style.padding = '';
    }
  }
  // Header gradient picks the FIRST matching era color for visual identity.
  const firstPeriod = periods.find(p => (s.eras || []).indexOf(p.id) !== -1);
  const c1 = '#38bdf8';
  const c2 = firstPeriod ? firstPeriod.color : '#a78bfa';
  document.getElementById('bwSiteHeader').style.background = 'linear-gradient(135deg,'+c1+','+c2+')';
  // Scripture refs — render as cyan chips that jump into the Bible reader.
  const refsEl = document.getElementById('bwSiteRefs');
  if(refsEl){
    if((s.scriptureRefs || []).length){
      refsEl.innerHTML = s.scriptureRefs.map(r =>
        '<button onclick="bwJumpToRef(\''+r.replace(/\'/g,"\\'")+'\')" style="background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.3);color:#38bdf8;border-radius:99px;padding:.25rem .65rem;font-size:.66rem;font-weight:800;cursor:pointer;font-family:var(--fm);">📖 '+_bwEsc(r)+'</button>'
      ).join('');
    } else refsEl.innerHTML = '';
  }
  // Meta — modern location + GPS + map link
  const metaEl = document.getElementById('bwSiteMeta');
  if(metaEl){
    const mapUrl = (typeof s.lat === 'number' && typeof s.lng === 'number')
      ? 'https://www.google.com/maps/search/?api=1&query=' + s.lat + ',' + s.lng
      : '';
    metaEl.innerHTML =
      '<div><div style="font-weight:800;color:var(--tx2);text-transform:uppercase;letter-spacing:.1em;font-size:.58rem;margin-bottom:.15rem;">Modern Location</div><div style="color:var(--tx);">'+_bwEsc(s.modernLocation || '—')+'</div></div>'
      + (mapUrl ? '<div><div style="font-weight:800;color:var(--tx2);text-transform:uppercase;letter-spacing:.1em;font-size:.58rem;margin-bottom:.15rem;">Coordinates</div><a href="'+mapUrl+'" target="_blank" rel="noopener" style="color:#38bdf8;text-decoration:none;">'+s.lat.toFixed(4)+', '+s.lng.toFixed(4)+' ↗</a></div>' : '');
  }
  if(typeof openModal === 'function') openModal('bwSiteModal');
  if(typeof logActivity === 'function') logActivity('faith', 'Biblical Archaeology site: ' + s.name);
  if(typeof _bwMarkVisited === 'function') _bwMarkVisited('site', siteId);
}

function bwCloseSite(){
  if(typeof closeModal === 'function') closeModal('bwSiteModal');
}

function bwJumpToRef(ref){
  // Reuse the existing parser/jumper from F2-G.
  if(typeof askBibleJumpRef === 'function'){
    bwCloseSite();
    askBibleJumpRef(ref);
    return;
  }
  // Fallback: switch to Bible tab.
  bwCloseSite();
  bfTab('bible');
}

function _bwEsc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[c]);
}

// ═════════════════════════════════════════════════════════════
// F3-D — ARCHAEOLOGICAL DISCOVERIES + F3-F (light) PILGRIMAGE BADGES
// ═════════════════════════════════════════════════════════════
let _bwView = 'sites';      // sites | discoveries | pilgrimage
let _bwDiscFilter = 'all';  // all | confirmed | consistent | contested

function _bwDiscoveries(){ return (typeof window !== 'undefined' && window.BIBLICAL_DISCOVERIES) ? window.BIBLICAL_DISCOVERIES : []; }
function _bwDiscById(id){ return _bwDiscoveries().find(d => d && d.id === id) || null; }

function bwSetView(view, btn){
  _bwView = view;
  // Toggle button styles.
  document.querySelectorAll('#bf-bibleworld .bw-vtab').forEach(b => {
    if(b === btn){
      b.classList.add('active');
      b.style.background = 'var(--cd-banner)';
      b.style.color = 'var(--cd-banner-text)';
      b.style.border = 'none';
      b.style.fontWeight = '800';
    } else {
      b.classList.remove('active');
      b.style.background = 'rgba(255,255,255,.04)';
      b.style.color = 'var(--tx)';
      b.style.border = '1px solid rgba(255,255,255,.1)';
      b.style.fontWeight = '700';
    }
  });
  const sites      = document.getElementById('bwSitesView');
  const discoveries = document.getElementById('bwDiscoveriesView');
  const pilgrim    = document.getElementById('bwPilgrimageView');
  if(sites)       sites.style.display       = (view === 'sites') ? '' : 'none';
  if(discoveries) discoveries.style.display = (view === 'discoveries') ? '' : 'none';
  if(pilgrim)     pilgrim.style.display     = (view === 'pilgrimage') ? '' : 'none';

  if(view === 'sites'){
    // Re-trigger map size recalc; Leaflet needs invalidate when re-shown.
    if(_bwMap){ try { _bwMap.invalidateSize(); } catch(_){} }
  } else if(view === 'discoveries'){
    bwRenderDiscoveries();
  } else if(view === 'pilgrimage'){
    bwRenderPilgrimage();
  }
}

function bwDiscFilter(cert, btn){
  _bwDiscFilter = cert;
  document.querySelectorAll('#bwDiscFilters .bw-chip').forEach(c => {
    c.classList.remove('active');
    c.style.background = '';
    c.style.color = '';
    c.style.borderColor = '';
  });
  if(btn){
    btn.classList.add('active');
    btn.style.background = 'var(--cd-banner)';
    btn.style.color = 'var(--cd-banner-text)';
    btn.style.borderColor = 'transparent';
  }
  bwRenderDiscoveries();
}

function bwRenderDiscoveries(){
  const grid = document.getElementById('bwDiscGrid');
  const hdr = document.getElementById('bwDiscHdr');
  if(!grid) return;
  let list = _bwDiscoveries();
  if(_bwDiscFilter !== 'all') list = list.filter(d => d && d.certainty === _bwDiscFilter);
  if(hdr){
    const label = (_bwDiscFilter === 'all' ? 'All discoveries' :
      _bwDiscFilter === 'confirmed' ? 'Confirmed' :
      _bwDiscFilter === 'consistent' ? 'Consistent with Scripture' : 'Contested');
    hdr.textContent = label + ' (' + list.length + ')';
  }
  if(!list.length){
    grid.innerHTML = '<div style="text-align:center;padding:1rem;color:var(--tx2);font-size:.78rem;font-style:italic;">No discoveries match this filter.</div>';
    return;
  }
  // Certainty colors — confirmed=green, consistent=cyan, contested=amber.
  const certColor = (c) => c === 'confirmed' ? '#10b981' : c === 'consistent' ? '#38bdf8' : '#fbbf24';
  const certIcon  = (c) => c === 'confirmed' ? '✓' : c === 'consistent' ? '≈' : '?';
  grid.innerHTML = list.map(d => {
    const c = certColor(d.certainty);
    return '<div class="bw-card" onclick="openBwDiscovery(\''+d.id+'\')">'
      + '<div class="bw-card-name">'+_bwEsc(d.name)+'</div>'
      + '<div class="bw-card-eras">'
      +   '<span class="bw-card-era" style="--era-c:'+c+';">'+certIcon(d.certainty)+' '+_bwEsc(d.certainty)+'</span>'
      +   '<span class="bw-card-era" style="--era-c:#fbbf24;">'+_bwEsc(String(d.yearFound))+'</span>'
      + '</div>'
      + '<div class="bw-card-tagline">'+_bwEsc(d.tagline||'')+'</div>'
      + '</div>';
  }).join('');
}

function openBwDiscovery(discId){
  const d = _bwDiscById(discId);
  if(!d){ showToast('Discovery not found'); return; }
  const certLabel = (d.certainty === 'confirmed') ? '✓ Confirmed' : d.certainty === 'consistent' ? '≈ Consistent with Scripture' : '? Contested';
  document.getElementById('bwDiscCert').textContent = certLabel + ' · Found ' + d.yearFound;
  document.getElementById('bwDiscName').textContent = d.name;
  document.getElementById('bwDiscTagline').textContent = d.tagline || '';
  document.getElementById('bwDiscBody').innerHTML = (typeof renderInfographicFor === 'function' ? renderInfographicFor(discId) : '') + (d.body || '');
  // Scripture refs
  const refsEl = document.getElementById('bwDiscRefs');
  if(refsEl){
    if((d.scriptureRefs || []).length){
      refsEl.innerHTML = d.scriptureRefs.map(r =>
        '<button onclick="bwJumpToRef(\''+r.replace(/\'/g,"\\'")+'\')" style="background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.3);color:#38bdf8;border-radius:99px;padding:.25rem .65rem;font-size:.66rem;font-weight:800;cursor:pointer;font-family:var(--fm);">📖 '+_bwEsc(r)+'</button>'
      ).join('');
    } else refsEl.innerHTML = '';
  }
  // Meta — current location + related sites
  const metaEl = document.getElementById('bwDiscMeta');
  if(metaEl){
    const relatedHtml = (d.relatedSiteIds || []).map(sid => {
      const site = _bwSiteById(sid);
      return site ? '<button onclick="openBwSite(\''+sid+'\')" style="background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.3);color:#a78bfa;border-radius:99px;padding:.18rem .55rem;font-size:.6rem;font-weight:700;cursor:pointer;font-family:var(--fm);margin-right:.2rem;">📍 '+_bwEsc(site.name)+'</button>' : '';
    }).filter(Boolean).join('');
    metaEl.innerHTML =
      '<div><div style="font-weight:800;color:var(--tx2);text-transform:uppercase;letter-spacing:.1em;font-size:.58rem;margin-bottom:.15rem;">Currently At</div><div style="color:var(--tx);">'+_bwEsc(d.currentLocation || '—')+'</div></div>'
      + (relatedHtml ? '<div><div style="font-weight:800;color:var(--tx2);text-transform:uppercase;letter-spacing:.1em;font-size:.58rem;margin-bottom:.15rem;">Related Sites</div><div>'+relatedHtml+'</div></div>' : '');
  }
  if(typeof openModal === 'function') openModal('bwDiscoveryModal');
  if(typeof logActivity === 'function') logActivity('faith', 'Discovery: ' + d.name);
  if(typeof _bwMarkVisited === 'function') _bwMarkVisited('discovery', discId);
}

function bwCloseDiscovery(){
  if(typeof closeModal === 'function') closeModal('bwDiscoveryModal');
}

// ── F3-F LIGHT — PILGRIMAGE BADGES ──────────────────────────
const PILGRIMAGE_BADGES = [
  { id:'holy-land-visitor',  icon:'🏛️', label:'Holy Land Visitor',  desc:'Read 10 site profiles', target:10, type:'sites' },
  { id:'archaeology-buff',   icon:'🏺', label:'Archaeology Buff',   desc:'Read 10 discovery profiles', target:10, type:'discoveries' },
  { id:'walked-with-jesus',  icon:'🚶', label:'Walked With Jesus',  desc:"Visit all Jesus-ministry sites", target:6, type:'sites-era', era:'jesus-ministry' },
  { id:'followed-paul',      icon:'✉️', label:'Followed Paul',      desc:"Visit all Pauline-journey sites", target:7, type:'sites-era', era:'pauline-journeys' },
  { id:'cultural-scholar',   icon:'📜', label:'Cultural Scholar',   desc:'Cross-link 5 discoveries to sites', target:5, type:'discovery-sites' },
  { id:'bible-lands-explorer',icon:'🏺',label:'Biblical Archaeology Explorer',desc:'All 30 sites + all 20 discoveries', target:50, type:'all' },
];

function _bwVisitedStore(){
  if(!D.faithBibleWorld || typeof D.faithBibleWorld !== 'object') D.faithBibleWorld = { sites:{}, discoveries:{}, badges:{} };
  if(!D.faithBibleWorld.sites)       D.faithBibleWorld.sites = {};
  if(!D.faithBibleWorld.discoveries) D.faithBibleWorld.discoveries = {};
  if(!D.faithBibleWorld.badges)      D.faithBibleWorld.badges = {};
  return D.faithBibleWorld;
}

function _bwBadgeProgress(b){
  const store = _bwVisitedStore();
  if(b.type === 'sites')         return Object.keys(store.sites).length;
  if(b.type === 'discoveries')   return Object.keys(store.discoveries).length;
  if(b.type === 'sites-era'){
    const sites = _bwSites().filter(s => (s.eras || []).indexOf(b.era) !== -1);
    return sites.filter(s => store.sites[s.id]).length;
  }
  if(b.type === 'discovery-sites'){
    // Discoveries the user has read AND that have related site IDs the user has also visited.
    return _bwDiscoveries().filter(d => store.discoveries[d.id] && (d.relatedSiteIds || []).some(sid => store.sites[sid])).length;
  }
  if(b.type === 'all'){
    return Object.keys(store.sites).length + Object.keys(store.discoveries).length;
  }
  return 0;
}

function bwRenderPilgrimage(){
  const grid = document.getElementById('bwBadgeGrid');
  if(!grid) return;
  const store = _bwVisitedStore();
  grid.innerHTML = PILGRIMAGE_BADGES.map(b => {
    const progress = _bwBadgeProgress(b);
    const target = b.target;
    const earned = !!store.badges[b.id] || progress >= target;
    if(earned && !store.badges[b.id]){
      // Award now (idempotent — only fires once).
      store.badges[b.id] = new Date().toISOString();
      D.scrPoints = (D.scrPoints || 0) + 50;
      save();
      if(typeof logActivity === 'function') logActivity('faith', 'Pilgrimage badge: ' + b.label);
      showToast('🏆 ' + b.label + ' earned! +50 XP');
    }
    const pct = Math.min(100, Math.round((progress / target) * 100));
    return '<div class="bw-card" style="border-left-color:'+(earned?'#fbbf24':'#a78bfa')+';cursor:default;'+(earned?'background:rgba(251,191,36,.06);':'')+'">'
      + '<div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.35rem;">'
      +   '<span style="font-size:1.5rem;">'+b.icon+'</span>'
      +   '<div style="flex:1;"><div class="bw-card-name">'+_bwEsc(b.label)+'</div>'
      +   '<div class="bw-card-meta" style="color:'+(earned?'#fbbf24':'var(--tx2)')+';">'+(earned?'🏆 Earned':progress + '/' + target)+'</div></div>'
      + '</div>'
      + '<div style="font-size:.74rem;color:var(--tx2);line-height:1.5;margin-bottom:.4rem;">'+_bwEsc(b.desc)+'</div>'
      + '<div style="height:5px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden;"><div style="height:100%;width:'+pct+'%;background:linear-gradient(90deg,'+(earned?'#fbbf24,#fb923c':'#38bdf8,#a78bfa')+');border-radius:99px;transition:width .5s;"></div></div>'
      + '</div>';
  }).join('');
}

// Track visits on site/discovery open. Called from openBwSite / openBwDiscovery.
function _bwMarkVisited(kind, id){
  const store = _bwVisitedStore();
  if(kind === 'site' && !store.sites[id]){
    store.sites[id] = new Date().toISOString();
    save();
  } else if(kind === 'discovery' && !store.discoveries[id]){
    store.discoveries[id] = new Date().toISOString();
    save();
  }
}

// ═════════════════════════════════════════════════════════════
// F4-A — ANIMATED ROUTE OVERLAYS on the Bible Lands map
// ═════════════════════════════════════════════════════════════
let _bwActiveRoutes = {}; // routeId → { polyline, markers[] }

function _bwRoutes(){ return (typeof window !== 'undefined' && window.BIBLICAL_ROUTES) ? window.BIBLICAL_ROUTES : []; }
function _bwRouteById(id){ return _bwRoutes().find(r => r && r.id === id) || null; }

function bwRenderRouteChips(){
  const wrap = document.getElementById('bwRoutes');
  if(!wrap || wrap.dataset.bwBuilt) return;
  const routes = _bwRoutes();
  wrap.innerHTML = routes.map(r =>
    '<button class="bw-chip" data-bw-route="'+r.id+'" onclick="bwToggleRoute(\''+r.id+'\',this)" title="'+_bwEsc(r.description)+'">'+_bwEsc(r.label)+'</button>'
  ).join('');
  wrap.dataset.bwBuilt = '1';
}

function bwToggleRoute(routeId, btn){
  if(!_bwMap){ showToast('Map still loading'); return; }
  const r = _bwRouteById(routeId);
  if(!r) return;

  // If already on, remove it.
  if(_bwActiveRoutes[routeId]){
    const a = _bwActiveRoutes[routeId];
    if(a.polyline) try { _bwMap.removeLayer(a.polyline); } catch(_){}
    (a.markers || []).forEach(m => { try { _bwMap.removeLayer(m); } catch(_){} });
    delete _bwActiveRoutes[routeId];
    if(btn){
      btn.classList.remove('active');
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
    }
    return;
  }

  // Resolve waypoint coords from siteId references.
  const points = [];
  (r.waypoints || []).forEach(w => {
    if(typeof w.lat === 'number' && typeof w.lng === 'number'){
      points.push({ lat: w.lat, lng: w.lng, label: w.label, ref: w.ref });
    } else if(w.siteId){
      const s = _bwSiteById(w.siteId);
      if(s) points.push({ lat: s.lat, lng: s.lng, label: w.label || s.name, ref: w.ref, siteId: s.id });
    }
  });
  if(points.length < 2){ showToast('Route data incomplete'); return; }

  // Polyline.
  const latlngs = points.map(p => [p.lat, p.lng]);
  const polyline = L.polyline(latlngs, {
    color: r.color || '#a78bfa',
    weight: 4,
    opacity: 0.92,
    lineJoin: 'round',
    lineCap: 'round',
  }).addTo(_bwMap);

  // Animate stroke-dashoffset → 0. Need to wait one tick for SVG to render.
  setTimeout(() => {
    const path = polyline.getElement();
    if(path && typeof path.getTotalLength === 'function'){
      const len = path.getTotalLength();
      path.style.setProperty('--bw-route-dur', (r.durationMs || 4500) + 'ms');
      path.setAttribute('stroke-dasharray', len);
      path.setAttribute('stroke-dashoffset', len);
      // Force reflow to ensure animation starts.
      void path.getBoundingClientRect();
      path.classList.add('bw-route-anim');
    }
  }, 30);

  // Waypoint markers — pulse in sequence as the line draws past them.
  const markers = [];
  const totalMs = r.durationMs || 4500;
  points.forEach((p, idx) => {
    const ratio = idx / Math.max(1, points.length - 1);
    const delay = Math.round(totalMs * ratio);
    setTimeout(() => {
      const wpIcon = L.divIcon({
        className: 'bw-route-waypoint',
        html: '<div style="width:14px;height:14px;border-radius:50%;background:'+(r.color||'#a78bfa')+';border:2.5px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.35);"></div>',
        iconSize: [14,14], iconAnchor: [7,7],
      });
      const m = L.marker([p.lat, p.lng], { icon: wpIcon }).addTo(_bwMap);
      const popup = '<b>'+_bwEsc(p.label || '')+'</b>'
        + (p.ref ? '<br><span style="font-size:11px;color:#555;">'+_bwEsc(p.ref)+'</span>' : '')
        + (p.siteId ? '<br><a href="javascript:void(0)" onclick="openBwSite(\''+p.siteId+'\')">Open site →</a>' : '');
      m.bindPopup(popup);
      markers.push(m);
    }, delay);
  });

  _bwActiveRoutes[routeId] = { polyline, markers };

  // Style chip as active.
  if(btn){
    btn.classList.add('active');
    btn.style.background = r.color || '#a78bfa';
    btn.style.color = '#0b1220';
    btn.style.borderColor = 'transparent';
  }

  // Fit bounds with a soft padding (wait until last waypoint marker drops in).
  setTimeout(() => {
    try { _bwMap.fitBounds(polyline.getBounds(), { padding: [40, 40], maxZoom: 8 }); }
    catch(_){}
  }, totalMs + 100);

  if(typeof logActivity === 'function') logActivity('faith', 'Played route: ' + r.label);
}

// Hook route chip rendering into the existing renderBibleWorld.
const _bwOriginalRenderBibleWorld = (typeof renderBibleWorld === 'function') ? renderBibleWorld : null;
if(_bwOriginalRenderBibleWorld){
  renderBibleWorld = function(){
    _bwOriginalRenderBibleWorld();
    setTimeout(bwRenderRouteChips, 100);
  };
}

// ═════════════════════════════════════════════════════════════
// F4-B — BIBLE PROJECT VIDEO EMBEDS
// ═════════════════════════════════════════════════════════════
// Curated YouTube IDs from BibleProject's "Read Scripture" series for
// each Old + New Testament book. Embeds are lazy — only the iframe URL
// is set when the user clicks Watch. CC-BY-SA license, free to use.
const BIBLE_PROJECT_VIDEOS = {
  // OT
  'Genesis':   { p1:'GQI72THyO5I', p2:'F4isSyennFo' },
  'Exodus':    { p1:'jH_aojNJM3E', p2:'b06QXgjvSjI' },
  'Leviticus': { p1:'IJ-FekWUZzE' },
  'Numbers':   { p1:'tp5MIrMZFqo' },
  'Deuteronomy':{ p1:'jVREoeUSrLM' },
  'Joshua':    { p1:'JqOqJlFF_eU' },
  'Judges':    { p1:'kOYy8iCfIJ4' },
  'Ruth':      { p1:'0h1eoBeR4Jk' },
  '1 Samuel':  { p1:'QJOju5Dw0V0' },
  '2 Samuel':  { p1:'YvoWDXNDJgs' },
  '1 Kings':   { p1:'bVFW3wbi9pk' },
  '2 Kings':   { p1:'bVFW3wbi9pk' },
  'Psalms':    { p1:'j9phNEaPrv8' },
  'Proverbs':  { p1:'AzmYV8GNAIM' },
  'Ecclesiastes':{ p1:'lrsQ1tc-2wk' },
  'Song of Solomon':{ p1:'4KC7xE4fgOw' },
  'Isaiah':    { p1:'d0A6Uchb1F8', p2:'_TzdEPuqgQg' },
  'Jeremiah':  { p1:'RSK36cHbrk0' },
  'Daniel':    { p1:'9cSC9uobtPM' },
  // NT
  'Matthew':   { p1:'3Dv4-n6OYGI', p2:'GGCF3OPWN14' },
  'Mark':      { p1:'HGHqu9-DtXk' },
  'Luke':      { p1:'26z_KhwNdD8', p2:'XGcZjdc1YIM' },
  'John':      { p1:'G-2e9mMf7E8', p2:'RUfh_wOsauk' },
  'Acts':      { p1:'CGbNw855ksw', p2:'Z-17KxpjL0Q' },
  'Romans':    { p1:'ej_6dVdJSIU', p2:'0SVTl4Xa5fY' },
  '1 Corinthians':{ p1:'yiHf8klCCc4' },
  '2 Corinthians':{ p1:'3lfPK2vfC54' },
  'Galatians': { p1:'vmx4UjRFp0M' },
  'Ephesians': { p1:'Y71r-T98E2Q' },
  'Philippians':{ p1:'oE9qqW1-BkU' },
  'Colossians':{ p1:'pXTXlDxQsvc' },
  'Hebrews':   { p1:'1fNWTZZwgbs' },
  'James':     { p1:'qn-hLHWwRYY' },
  '1 Peter':   { p1:'WhP7AZQlzCg' },
  'Revelation':{ p1:'5nvVVcYD-0w', p2:'QpnIrbq2bKo' },
};

function bibleProjectFor(book){ return BIBLE_PROJECT_VIDEOS[book] || null; }

function openBibleProjectVideo(book){
  const v = bibleProjectFor(book);
  if(!v || !v.p1){ showToast('No Bible Project video for this book yet'); return; }
  // Open in a fresh popup-style overlay using charModal's structure.
  document.getElementById('charIcon').textContent = '📺';
  document.getElementById('charTitle').textContent = book;
  document.getElementById('charSub').textContent = 'Bible Project · Free animated overview · CC-BY-SA';
  // F9: gold register inside Well — was var(--cd-banner) purple
  document.getElementById('charModalHeader').style.background = 'radial-gradient(ellipse at top, rgba(251,191,36,.18), transparent 60%)';
  const part2 = v.p2 ? '<div style="margin-top:.85rem;"><div style="font-size:.7rem;font-weight:800;color:var(--tx2);margin-bottom:.35rem;text-transform:uppercase;letter-spacing:.1em;">Part 2</div><div style="position:relative;padding-bottom:56.25%;height:0;border-radius:10px;overflow:hidden;background:#000;"><iframe src="https://www.youtube-nocookie.com/embed/'+v.p2+'?rel=0" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe></div></div>' : '';
  document.getElementById('charBody').innerHTML =
    '<div style="font-size:.78rem;color:var(--tx2);line-height:1.55;margin-bottom:.7rem;">A 5-10 minute animated overview of '+escapeHtml(book)+' from <a href="https://bibleproject.com" target="_blank" rel="noopener" style="color:#38bdf8;">The Bible Project</a> — free, CC-BY-SA, beautifully animated.</div>'
    + '<div style="position:relative;padding-bottom:56.25%;height:0;border-radius:10px;overflow:hidden;background:#000;">'
    + '<iframe src="https://www.youtube-nocookie.com/embed/'+v.p1+'?rel=0" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>'
    + '</div>' + part2;
  document.getElementById('charQuiz').innerHTML = '';
  openModal('charModal');
  if(typeof logActivity === 'function') logActivity('faith', 'Watched Bible Project: ' + book);
}

// Augment the ESV reader nav with a "📺 Watch overview" button when a
// Bible Project video exists for the current book.
const _origOpenEsvReader_F4 = openEsvReader;
openEsvReader = async function(){
  await _origOpenEsvReader_F4.apply(this, arguments);
  // After the reader paints, inject a Bible Project button if available.
  setTimeout(function(){
    const book = _esvCurrentBook;
    const v = bibleProjectFor(book);
    if(!v) return;
    // Find the Listen+Settings row and append.
    const charBody = document.getElementById('charBody');
    if(!charBody) return;
    const btnRow = charBody.querySelector('div[style*="display:flex"][style*="margin-bottom"]');
    if(btnRow && !btnRow.querySelector('[data-bp-btn]')){
      const btn = document.createElement('button');
      btn.setAttribute('data-bp-btn','1');
      btn.style.cssText = 'background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.3);color:#a78bfa;border-radius:8px;padding:.35rem .7rem;font-size:.7rem;font-weight:700;cursor:pointer;font-family:var(--fm);';
      btn.innerHTML = '📺 Watch Bible Project';
      btn.onclick = function(){ openBibleProjectVideo(book); };
      // Insert as third child so it appears next to Listen + Settings.
      const settingsBtn = btnRow.querySelector('button[onclick*="openReaderSettings"]');
      if(settingsBtn) settingsBtn.parentNode.insertBefore(btn, settingsBtn.nextSibling);
      else btnRow.appendChild(btn);
    }
  }, 100);
};

// ═════════════════════════════════════════════════════════════
// F4-C — CELEBRATION ANIMATIONS (CSS+SVG, no library dep)
// ═════════════════════════════════════════════════════════════
// playFx('dove' | 'sparkle' | 'confetti' | 'cross' | 'flame')
// Auto-clears the overlay after the animation. Respects reduced-motion.
function _fxReducedMotion(){
  try { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  catch(_){ return false; }
}

function playFx(type){
  if(_fxReducedMotion()) return; // Toast still fires from caller; just skip visuals.
  const overlay = document.getElementById('fxOverlay');
  if(!overlay) return;
  overlay.classList.add('fx-on');
  let html = '', clearAfter = 2000;
  if(type === 'dove'){
    html = '<svg class="fx-dove" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M44 12c-3 5-12 8-22 8 0 9 5 18 14 22 7 3 14 1 18-5 4-7 0-15-10-25z" fill="#fff" stroke="#a78bfa" stroke-width="1.2"/>'
      + '<path d="M28 22c-6 4-12 12-12 24" stroke="#a78bfa" stroke-width="2" fill="none" stroke-linecap="round"/>'
      + '<circle cx="46" cy="18" r="1.6" fill="#0f172a"/>'
      + '</svg>';
    clearAfter = 2700;
  } else if(type === 'sparkle'){
    html = '<svg class="fx-sparkle" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'
      + '<g fill="#fbbf24"><polygon points="50,5 56,40 90,50 56,60 50,95 44,60 10,50 44,40"/></g>'
      + '<g fill="#fef08a" opacity=".85"><polygon points="50,18 53,42 78,50 53,58 50,82 47,58 22,50 47,42"/></g>'
      + '</svg>';
    clearAfter = 1700;
  } else if(type === 'cross'){
    html = '<svg class="fx-cross" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'
      + '<defs><radialGradient id="fxCrossG"><stop offset="0%" stop-color="#fef08a"/><stop offset="100%" stop-color="#fbbf24" stop-opacity="0"/></radialGradient></defs>'
      + '<circle cx="50" cy="50" r="48" fill="url(#fxCrossG)"/>'
      + '<rect x="46" y="14" width="8" height="62" rx="1" fill="#fff"/>'
      + '<rect x="28" y="32" width="44" height="8" rx="1" fill="#fff"/>'
      + '</svg>';
    clearAfter = 1700;
  } else if(type === 'flame'){
    html = '<svg class="fx-flame" viewBox="0 0 64 96" xmlns="http://www.w3.org/2000/svg">'
      + '<defs><linearGradient id="fxFlameG" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stop-color="#fb923c"/><stop offset="60%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#fef08a"/></linearGradient></defs>'
      + '<path d="M32 96c-14 0-22-10-22-22 0-12 14-20 12-36 8 4 14 14 14 22 4-6 6-14 6-22 8 8 14 22 14 36 0 12-8 22-24 22z" fill="url(#fxFlameG)"/>'
      + '</svg>';
    clearAfter = 1900;
  } else if(type === 'confetti'){
    const colors = ['#38bdf8','#a78bfa','#10b981','#fbbf24','#f472b6','#fb923c'];
    const pieces = [];
    for(let i = 0; i < 60; i++){
      const left = Math.random() * 100;
      const delay = Math.random() * 600;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const dur = 2200 + Math.floor(Math.random() * 1200);
      pieces.push('<div class="fx-confetti-piece" style="left:'+left.toFixed(2)+'vw;background:'+color+';animation-delay:'+delay+'ms;animation-duration:'+dur+'ms;"></div>');
    }
    html = pieces.join('');
    clearAfter = 3500;
  }
  overlay.innerHTML = html;
  setTimeout(function(){
    overlay.innerHTML = '';
    overlay.classList.remove('fx-on');
  }, clearAfter);
}

// Hook celebrations into existing faith actions. Each wrapper reuses the
// original function and fires the appropriate visual on success.
(function wireFxToFaithActions(){
  // Prayer save → dove
  if(typeof addPrayerFromForm === 'function'){
    const _orig = addPrayerFromForm;
    addPrayerFromForm = function(){ const before = (D.prayers||[]).length; _orig.apply(this, arguments); if((D.prayers||[]).length > before) playFx('dove'); };
  }
  // Devotional read → cross
  if(typeof markDevotionalRead === 'function'){
    const _orig = markDevotionalRead;
    markDevotionalRead = function(){ const today = new Date().toISOString().slice(0,10); const wasRead = !!(D.scrReadDays && D.scrReadDays[today]); _orig.apply(this, arguments); if(!wasRead) playFx('cross'); };
  }
  if(typeof markDevFromPopup === 'function'){
    const _orig = markDevFromPopup;
    markDevFromPopup = function(){ const today = new Date().toISOString().slice(0,10); const wasRead = !!(D.scrReadDays && D.scrReadDays[today]); _orig.apply(this, arguments); if(!wasRead) playFx('cross'); };
  }
  // Memory verse mastered → sparkle (caught in _mvApplySrUpdate when intervalDays >= 90)
  if(typeof _mvApplySrUpdate === 'function'){
    const _orig = _mvApplySrUpdate;
    _mvApplySrUpdate = function(v, correct){ const wasMastered = !!(v && v.mastered); _orig.apply(this, arguments); if(v && v.mastered && !wasMastered) playFx('sparkle'); };
  }
  // Plan day done → confetti when plan completes
  if(typeof planMarkDayDone === 'function'){
    const _orig = planMarkDayDone;
    planMarkDayDone = function(planId, dayNum){
      const store = (typeof planStore === 'function') ? planStore() : { active:{} };
      const wasActive = !!(store.active && store.active[planId]);
      _orig.apply(this, arguments);
      const stillActive = !!(store.active && store.active[planId]);
      if(wasActive && !stillActive) playFx('confetti');
    };
  }
  // Quiz pass → confetti (acIssueCertificate first-time only)
  if(typeof acIssueCertificate === 'function'){
    const _orig = acIssueCertificate;
    acIssueCertificate = function(courseId){
      const store = _acStore();
      const wasIssued = !!(store.courses[courseId] && store.courses[courseId].certificateIssuedAt);
      _orig.apply(this, arguments);
      const nowIssued = !!(store.courses[courseId] && store.courses[courseId].certificateIssuedAt);
      if(!wasIssued && nowIssued) playFx('confetti');
    };
  }
  // Streak milestone (day 7, 30, 100) → flame. Check inside renderFaithHome.
  if(typeof renderFaithHome === 'function'){
    const _orig = renderFaithHome;
    let _lastStreakSeen = -1;
    renderFaithHome = function(){
      _orig.apply(this, arguments);
      const streak = (typeof getScriptureStreak === 'function') ? getScriptureStreak() : 0;
      const milestones = [7, 30, 100, 365];
      if(milestones.indexOf(streak) !== -1 && streak !== _lastStreakSeen){
        _lastStreakSeen = streak;
        playFx('flame');
      } else if(milestones.indexOf(streak) === -1){
        _lastStreakSeen = streak;
      }
    };
  }
})();

// ═════════════════════════════════════════════════════════════
// F4-D — VISUAL BIBLE TIMELINE
// ═════════════════════════════════════════════════════════════
// Cathedral-celestial aesthetic. Events grouped by era; era bands carry
// their own color glow; gold medallions for events; "You Are Here"
// pulses at the present moment node. Scroll-reveal via IntersectionObserver.

const TL_ERAS = [
  { id:'patriarchs',       label:'Patriarchs',         range:'~2000-1500 BC',   color:'#a78bfa', glow:'rgba(167,139,250,.22)' },
  { id:'exodus-conquest',  label:'Exodus & Conquest',  range:'~1450-1380 BC',   color:'#fbbf24', glow:'rgba(251,191,36,.22)' },
  { id:'judges',           label:'Judges',             range:'~1380-1050 BC',   color:'#c084fc', glow:'rgba(192,132,252,.22)' },
  { id:'united-kingdom',   label:'United Kingdom',     range:'~1050-931 BC',    color:'#10b981', glow:'rgba(16,185,129,.22)' },
  { id:'divided-kingdom',  label:'Divided Kingdom',    range:'931-586 BC',      color:'#fb923c', glow:'rgba(251,146,60,.22)' },
  { id:'exile-return',     label:'Exile & Return',     range:'586-430 BC',      color:'#f472b6', glow:'rgba(244,114,182,.22)' },
  { id:'second-temple',    label:'Intertestamental',   range:'~430 BC-5 BC',    color:'#38bdf8', glow:'rgba(56,189,248,.22)' },
  { id:'jesus-ministry',   label:"Jesus's Ministry",   range:'~5 BC-30 AD',     color:'#34d399', glow:'rgba(52,211,153,.30)' },
  { id:'pauline-journeys', label:'Apostolic Era',      range:'~30-100 AD',      color:'#f87171', glow:'rgba(248,113,113,.22)' },
  { id:'present',          label:'You Are Here',       range:'Now',             color:'#38bdf8', glow:'rgba(56,189,248,.32)' },
  { id:'future',           label:"Christ's Return",    range:'When?',           color:'#fbbf24', glow:'rgba(251,191,36,.32)' },
];

// Era SVG headers — one cathedral-blueprint illustration per era group.
// Each SVG uses viewBox="0 0 800 300", deep navy #0a0d1a base, gold #fbbf24
// accents, silhouette compositions. Shared by every event within the era.
const TL_ERA_SVGS = {
  'patriarchs': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">'
    + '<defs><linearGradient id="tlsvg-pat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0d1a"/><stop offset="55%" stop-color="#1a1233"/><stop offset="100%" stop-color="#3d2a5e"/></linearGradient>'
    + '<radialGradient id="tlsvg-pat-glow" cx="50%" cy="35%" r="35%"><stop offset="0%" stop-color="rgba(251,191,36,.4)"/><stop offset="100%" stop-color="rgba(251,191,36,0)"/></radialGradient></defs>'
    + '<rect width="800" height="300" fill="url(#tlsvg-pat)"/>'
    + '<g fill="#fef3c7" opacity="0.85"><circle cx="80" cy="40" r="0.9"/><circle cx="142" cy="80" r="1.1"/><circle cx="220" cy="30" r="0.8"/><circle cx="320" cy="70" r="1.0"/><circle cx="420" cy="35" r="1.3"/><circle cx="500" cy="60" r="0.9"/><circle cx="580" cy="40" r="1.0"/><circle cx="660" cy="90" r="1.0"/><circle cx="720" cy="55" r="0.8"/></g>'
    + '<rect width="800" height="300" fill="url(#tlsvg-pat-glow)"/>'
    + '<circle cx="420" cy="80" r="6" fill="#fef3c7"/><circle cx="420" cy="80" r="14" fill="rgba(251,191,36,.32)"/>'
    + '<path d="M 0 240 Q 200 200 400 215 T 800 230 L 800 300 L 0 300 Z" fill="#1e1638" opacity="0.92"/>'
    + '<path d="M 0 265 Q 250 245 500 258 T 800 265 L 800 300 L 0 300 Z" fill="#0a0d1a" opacity="0.95"/>'
    + '<path d="M 340 250 L 380 200 L 420 250 Z" fill="#0a0d1a" stroke="rgba(251,191,36,.55)" stroke-width="1.2"/>'
    + '<line x1="380" y1="200" x2="380" y2="180" stroke="#fbbf24" stroke-width="1"/><circle cx="380" cy="178" r="2" fill="#fbbf24"/>'
    + '</svg>',

  'exodus-conquest': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">'
    + '<defs><linearGradient id="tlsvg-ex" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0d1a"/><stop offset="60%" stop-color="#3a1414"/><stop offset="100%" stop-color="#5e2a0e"/></linearGradient>'
    + '<linearGradient id="tlsvg-ex-fire" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#fbbf24"/><stop offset="50%" stop-color="#f59e0b"/><stop offset="100%" stop-color="rgba(251,191,36,0)"/></linearGradient></defs>'
    + '<rect width="800" height="300" fill="url(#tlsvg-ex)"/>'
    + '<g fill="#fef3c7" opacity="0.6"><circle cx="100" cy="45" r="0.7"/><circle cx="250" cy="30" r="0.9"/><circle cx="520" cy="40" r="0.8"/><circle cx="680" cy="55" r="0.9"/></g>'
    + '<path d="M 380 280 Q 360 230 380 180 Q 410 130 390 70 Q 430 30 415 -10" fill="url(#tlsvg-ex-fire)" opacity="0.9"/>'
    + '<ellipse cx="395" cy="275" rx="55" ry="10" fill="rgba(251,191,36,.35)" filter="blur(4px)"/>'
    + '<path d="M 0 250 Q 200 235 400 245 T 800 250 L 800 300 L 0 300 Z" fill="#1a0a08" opacity="0.95"/>'
    + '<g fill="#0a0d1a" opacity="0.95">'
    + '<ellipse cx="90" cy="245" rx="6" ry="14"/><ellipse cx="120" cy="248" rx="5" ry="12"/><ellipse cx="155" cy="245" rx="6" ry="13"/><ellipse cx="190" cy="248" rx="5" ry="12"/>'
    + '<ellipse cx="600" cy="248" rx="5" ry="13"/><ellipse cx="635" cy="246" rx="6" ry="14"/><ellipse cx="670" cy="248" rx="5" ry="12"/><ellipse cx="705" cy="246" rx="6" ry="13"/>'
    + '</g>'
    + '<g stroke="rgba(251,191,36,.45)" stroke-width="1" fill="none"><path d="M 80 235 L 80 220 M 110 235 L 110 218 M 145 235 L 145 220"/></g>'
    + '</svg>',

  'judges': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">'
    + '<defs><linearGradient id="tlsvg-jdg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0d1a"/><stop offset="55%" stop-color="#2a1840"/><stop offset="100%" stop-color="#5d2e7e"/></linearGradient></defs>'
    + '<rect width="800" height="300" fill="url(#tlsvg-jdg)"/>'
    + '<g fill="#fef3c7" opacity="0.6"><circle cx="120" cy="40" r="0.8"/><circle cx="280" cy="55" r="1.0"/><circle cx="540" cy="30" r="0.9"/><circle cx="700" cy="60" r="0.8"/></g>'
    + '<circle cx="400" cy="100" r="38" fill="#0a0d1a" stroke="rgba(251,191,36,.5)" stroke-width="1.2"/>'
    + '<circle cx="400" cy="100" r="38" fill="rgba(251,191,36,.18)" opacity="0.6"/>'
    + '<g stroke="rgba(251,191,36,.7)" stroke-width="1.5" fill="none"><path d="M 380 92 L 400 80 L 420 92"/><path d="M 380 110 L 400 122"/><path d="M 420 110 L 400 122"/></g>'
    + '<path d="M 0 230 Q 80 210 160 225 L 200 225 L 200 280 L 0 280 Z" fill="#0a0d1a" opacity="0.95"/>'
    + '<path d="M 240 235 L 280 235 L 280 280 L 240 280 Z M 320 240 L 360 240 L 360 280 L 320 280 Z" fill="#0a0d1a" opacity="0.95"/>'
    + '<path d="M 440 240 L 480 240 L 480 280 L 440 280 Z M 520 235 L 560 235 L 560 280 L 520 280 Z M 620 240 L 800 245 L 800 280 L 620 280 Z" fill="#0a0d1a" opacity="0.95"/>'
    + '<g stroke="rgba(251,191,36,.35)" stroke-width="1" stroke-dasharray="3 4"><line x1="200" y1="240" x2="240" y2="240"/><line x1="280" y1="245" x2="320" y2="245"/><line x1="360" y1="248" x2="400" y2="250"/><line x1="400" y1="250" x2="440" y2="248"/><line x1="480" y1="245" x2="520" y2="240"/><line x1="560" y1="240" x2="620" y2="245"/></g>'
    + '<path d="M 386 200 Q 392 178 386 158 Q 380 138 388 118 L 400 100 L 412 118 Q 420 138 414 158 Q 408 178 414 200 Z" fill="#0a0d1a" stroke="rgba(251,191,36,.45)" stroke-width="1"/>'
    + '</svg>',

  'united-kingdom': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">'
    + '<defs><linearGradient id="tlsvg-uk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0d1a"/><stop offset="55%" stop-color="#0d2818"/><stop offset="100%" stop-color="#0f4030"/></linearGradient>'
    + '<radialGradient id="tlsvg-uk-glow" cx="50%" cy="55%" r="35%"><stop offset="0%" stop-color="rgba(251,191,36,.5)"/><stop offset="100%" stop-color="rgba(251,191,36,0)"/></radialGradient></defs>'
    + '<rect width="800" height="300" fill="url(#tlsvg-uk)"/>'
    + '<g fill="#fef3c7" opacity="0.7"><circle cx="80" cy="40" r="0.9"/><circle cx="180" cy="55" r="0.8"/><circle cx="260" cy="30" r="1.0"/><circle cx="540" cy="40" r="1.1"/><circle cx="640" cy="60" r="0.8"/><circle cx="720" cy="35" r="0.9"/></g>'
    + '<rect width="800" height="300" fill="url(#tlsvg-uk-glow)"/>'
    + '<path d="M 0 240 Q 200 200 400 220 T 800 230 L 800 300 L 0 300 Z" fill="#0a1a0e" opacity="0.95"/>'
    + '<rect x="320" y="155" width="160" height="95" fill="#0a0d1a" stroke="rgba(251,191,36,.6)" stroke-width="1.4"/>'
    + '<rect x="340" y="175" width="20" height="50" fill="rgba(251,191,36,.25)"/>'
    + '<rect x="370" y="175" width="20" height="50" fill="rgba(251,191,36,.4)"/>'
    + '<rect x="400" y="175" width="20" height="50" fill="rgba(251,191,36,.25)"/>'
    + '<rect x="430" y="175" width="20" height="50" fill="rgba(251,191,36,.4)"/>'
    + '<rect x="460" y="175" width="20" height="50" fill="rgba(251,191,36,.25)"/>'
    + '<path d="M 315 155 L 400 110 L 485 155 Z" fill="#0a0d1a" stroke="rgba(251,191,36,.55)" stroke-width="1.2"/>'
    + '<path d="M 370 85 L 380 95 L 390 80 L 400 95 L 410 80 L 420 95 L 430 85 L 425 105 L 375 105 Z" fill="#fbbf24" opacity="0.85"/>'
    + '<circle cx="380" cy="88" r="2" fill="#fef3c7"/><circle cx="400" cy="83" r="2" fill="#fef3c7"/><circle cx="420" cy="88" r="2" fill="#fef3c7"/>'
    + '</svg>',

  'divided-kingdom': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">'
    + '<defs><linearGradient id="tlsvg-dk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0d1a"/><stop offset="55%" stop-color="#3d1808"/><stop offset="100%" stop-color="#6b2810"/></linearGradient></defs>'
    + '<rect width="800" height="300" fill="url(#tlsvg-dk)"/>'
    + '<g fill="#fef3c7" opacity="0.6"><circle cx="100" cy="50" r="0.8"/><circle cx="200" cy="30" r="0.9"/><circle cx="600" cy="40" r="0.9"/><circle cx="720" cy="55" r="0.8"/></g>'
    + '<path d="M 380 0 Q 395 60 372 130 Q 410 200 388 280 L 412 280 Q 432 200 395 130 Q 418 60 405 0 Z" fill="#0a0d1a" stroke="rgba(251,191,36,.4)" stroke-width="0.8" opacity="0.85"/>'
    + '<path d="M 0 245 L 320 245 L 320 300 L 0 300 Z" fill="#1a0a04" opacity="0.95"/>'
    + '<path d="M 470 245 L 800 245 L 800 300 L 470 300 Z" fill="#1a0a04" opacity="0.95"/>'
    + '<g fill="#0a0d1a" stroke="rgba(251,191,36,.5)" stroke-width="1">'
    + '<path d="M 130 245 L 130 175 L 180 175 L 180 195 L 200 195 L 200 175 L 250 175 L 250 245 Z"/>'
    + '<path d="M 145 200 L 165 200 L 165 220 L 145 220 Z" fill="rgba(251,191,36,.3)"/>'
    + '<path d="M 215 200 L 235 200 L 235 220 L 215 220 Z" fill="rgba(251,191,36,.3)"/>'
    + '</g>'
    + '<g fill="#0a0d1a" stroke="rgba(251,146,60,.5)" stroke-width="1">'
    + '<path d="M 550 245 L 550 180 L 600 180 L 600 200 L 620 200 L 620 180 L 670 180 L 670 245 Z"/>'
    + '<path d="M 565 205 L 585 205 L 585 225 L 565 225 Z" fill="rgba(251,146,60,.3)"/>'
    + '<path d="M 635 205 L 655 205 L 655 225 L 635 225 Z" fill="rgba(251,146,60,.3)"/>'
    + '</g>'
    + '<line x1="160" y1="170" x2="160" y2="160" stroke="rgba(251,191,36,.6)" stroke-width="1"/><path d="M 155 158 L 165 158 L 162 152 L 158 152 Z" fill="#fbbf24" opacity="0.6"/>'
    + '<line x1="600" y1="175" x2="600" y2="165" stroke="rgba(251,146,60,.6)" stroke-width="1"/><path d="M 595 163 L 605 163 L 602 157 L 598 157 Z" fill="#fb923c" opacity="0.6"/>'
    + '</svg>',

  'exile-return': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">'
    + '<defs><linearGradient id="tlsvg-ex2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0d1a"/><stop offset="55%" stop-color="#1a1430"/><stop offset="100%" stop-color="#2a1840"/></linearGradient></defs>'
    + '<rect width="800" height="300" fill="url(#tlsvg-ex2)"/>'
    + '<g fill="#fef3c7" opacity="0.55"><circle cx="80" cy="35" r="0.8"/><circle cx="200" cy="55" r="1.0"/><circle cx="350" cy="40" r="0.9"/><circle cx="500" cy="35" r="1.0"/><circle cx="650" cy="55" r="0.9"/></g>'
    + '<g fill="#0a0d1a" stroke="rgba(244,114,182,.45)" stroke-width="0.8">'
    + '<rect x="500" y="180" width="220" height="20"/><rect x="520" y="155" width="180" height="25"/><rect x="540" y="130" width="140" height="25"/><rect x="560" y="105" width="100" height="25"/><rect x="580" y="80" width="60" height="25"/>'
    + '</g>'
    + '<rect x="606" y="65" width="8" height="15" fill="#fbbf24" opacity="0.5"/>'
    + '<path d="M 0 245 L 800 245 L 800 280 L 0 280 Z" fill="rgba(56,30,90,.6)"/>'
    + '<path d="M 0 245 Q 100 250 200 245 T 400 248 T 600 245 T 800 248 L 800 280 L 0 280 Z" fill="rgba(244,114,182,.18)"/>'
    + '<g stroke="rgba(244,114,182,.35)" stroke-width="0.8" fill="none">'
    + '<path d="M 80 245 Q 70 220 60 200 M 80 245 Q 90 215 95 200 M 80 245 Q 75 225 70 210"/>'
    + '<path d="M 180 245 Q 168 215 160 200 M 180 245 Q 192 220 195 205 M 180 245 Q 175 220 170 205"/>'
    + '<path d="M 280 245 Q 272 220 265 200 M 280 245 Q 288 220 295 205"/>'
    + '<path d="M 380 245 Q 372 220 365 200 M 380 245 Q 388 215 395 200 M 380 245 Q 375 220 370 210"/>'
    + '</g>'
    + '<rect x="60" y="180" width="3" height="65" fill="#0a0d1a" opacity="0.9"/><rect x="78" y="175" width="3" height="70" fill="#0a0d1a" opacity="0.9"/><rect x="170" y="178" width="3" height="67" fill="#0a0d1a" opacity="0.9"/><rect x="190" y="175" width="3" height="70" fill="#0a0d1a" opacity="0.9"/><rect x="280" y="180" width="3" height="65" fill="#0a0d1a" opacity="0.9"/><rect x="370" y="178" width="3" height="67" fill="#0a0d1a" opacity="0.9"/>'
    + '<path d="M 200 240 L 220 230 L 250 235 L 245 248 L 215 248 Z" fill="#0a0d1a" stroke="rgba(244,114,182,.4)" stroke-width="0.8"/>'
    + '</svg>',

  'second-temple': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">'
    + '<defs><linearGradient id="tlsvg-st" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0d1a"/><stop offset="55%" stop-color="#0e2030"/><stop offset="100%" stop-color="#143850"/></linearGradient></defs>'
    + '<rect width="800" height="300" fill="url(#tlsvg-st)"/>'
    + '<g fill="#fef3c7" opacity="0.65"><circle cx="100" cy="40" r="0.9"/><circle cx="250" cy="30" r="0.8"/><circle cx="380" cy="50" r="1.0"/><circle cx="540" cy="35" r="0.9"/><circle cx="680" cy="55" r="0.9"/></g>'
    + '<path d="M 0 250 L 800 250 L 800 300 L 0 300 Z" fill="#0a0d1a" opacity="0.92"/>'
    + '<g fill="#0a0d1a" stroke="rgba(56,189,248,.5)" stroke-width="1">'
    + '<rect x="120" y="120" width="22" height="130"/><path d="M 113 120 L 149 120 L 145 110 L 117 110 Z"/>'
    + '<rect x="170" y="120" width="22" height="130"/><path d="M 163 120 L 199 120 L 195 110 L 167 110 Z"/>'
    + '<rect x="220" y="120" width="22" height="130"/><path d="M 213 120 L 249 120 L 245 110 L 217 110 Z"/>'
    + '<path d="M 105 110 L 257 110 L 252 95 L 110 95 Z"/>'
    + '<path d="M 105 95 L 257 95 L 181 70 Z"/>'
    + '</g>'
    + '<g stroke="#fbbf24" stroke-width="2.2" fill="none" stroke-linecap="round">'
    + '<line x1="540" y1="140" x2="540" y2="240"/>'
    + '<line x1="500" y1="155" x2="500" y2="200" /><line x1="500" y1="155" x2="500" y2="200"/><line x1="500" y1="160" x2="500" y2="200"/>'
    + '<line x1="520" y1="150" x2="520" y2="200"/><line x1="560" y1="150" x2="560" y2="200"/><line x1="580" y1="155" x2="580" y2="200"/>'
    + '<path d="M 500 200 Q 500 220 520 220 L 560 220 Q 580 220 580 200"/>'
    + '<path d="M 520 200 Q 520 215 540 215 Q 560 215 560 200"/>'
    + '</g>'
    + '<g fill="#fbbf24" opacity="0.9"><circle cx="500" cy="150" r="3"/><circle cx="520" cy="145" r="3"/><circle cx="540" cy="135" r="3.5"/><circle cx="560" cy="145" r="3"/><circle cx="580" cy="150" r="3"/></g>'
    + '<g stroke="rgba(251,191,36,.5)" stroke-width="0.5" fill="none"><line x1="540" y1="130" x2="540" y2="115"/><line x1="500" y1="145" x2="500" y2="135"/><line x1="580" y1="145" x2="580" y2="135"/></g>'
    + '</svg>',

  'jesus-ministry': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">'
    + '<defs><linearGradient id="tlsvg-jm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0d1a"/><stop offset="40%" stop-color="#1e1450"/><stop offset="80%" stop-color="#5a2c80"/><stop offset="100%" stop-color="#c4724a"/></linearGradient>'
    + '<radialGradient id="tlsvg-jm-sun" cx="50%" cy="78%" r="32%"><stop offset="0%" stop-color="rgba(251,191,36,.85)"/><stop offset="60%" stop-color="rgba(251,146,60,.5)"/><stop offset="100%" stop-color="rgba(251,191,36,0)"/></radialGradient></defs>'
    + '<rect width="800" height="300" fill="url(#tlsvg-jm)"/>'
    + '<g fill="#fef3c7" opacity="0.55"><circle cx="80" cy="30" r="0.7"/><circle cx="160" cy="50" r="0.9"/><circle cx="260" cy="25" r="0.8"/><circle cx="600" cy="35" r="0.7"/></g>'
    + '<ellipse cx="400" cy="270" rx="280" ry="40" fill="url(#tlsvg-jm-sun)"/>'
    + '<path d="M 0 260 Q 100 230 200 245 Q 300 215 400 235 Q 500 205 600 240 Q 700 220 800 245 L 800 300 L 0 300 Z" fill="#3d2814" opacity="0.92"/>'
    + '<path d="M 0 275 Q 200 255 400 268 Q 600 248 800 268 L 800 300 L 0 300 Z" fill="#1a0d04" opacity="0.95"/>'
    + '<g fill="#0a0d1a">'
    + '<rect x="396" y="180" width="8" height="68"/><rect x="378" y="200" width="44" height="6"/>'
    + '<rect x="320" y="195" width="6" height="55"/><rect x="306" y="208" width="34" height="5"/>'
    + '<rect x="474" y="195" width="6" height="55"/><rect x="460" y="208" width="34" height="5"/>'
    + '</g>'
    + '<g stroke="rgba(251,191,36,.55)" stroke-width="0.8" fill="none">'
    + '<line x1="400" y1="245" x2="350" y2="265"/><line x1="400" y1="245" x2="450" y2="265"/><line x1="400" y1="245" x2="400" y2="275"/>'
    + '</g>'
    + '</svg>',

  'pauline-journeys': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">'
    + '<defs><linearGradient id="tlsvg-pj" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0d1a"/><stop offset="55%" stop-color="#1a0d20"/><stop offset="100%" stop-color="#3d1818"/></linearGradient></defs>'
    + '<rect width="800" height="300" fill="url(#tlsvg-pj)"/>'
    + '<g fill="#fef3c7" opacity="0.55"><circle cx="80" cy="35" r="0.8"/><circle cx="200" cy="55" r="0.9"/><circle cx="400" cy="30" r="1.0"/><circle cx="540" cy="60" r="0.8"/><circle cx="700" cy="40" r="0.9"/></g>'
    + '<path d="M 0 240 Q 200 230 400 245 T 800 240 L 800 300 L 0 300 Z" fill="rgba(56,30,40,.7)"/>'
    + '<path d="M 0 260 Q 200 252 400 264 T 800 258 L 800 300 L 0 300 Z" fill="#0a0512" opacity="0.92"/>'
    + '<g fill="#0a0d1a" stroke="rgba(248,113,113,.55)" stroke-width="1.2">'
    + '<path d="M 320 232 L 480 232 L 460 260 L 340 260 Z"/>'
    + '<rect x="395" y="160" width="3" height="72"/>'
    + '<path d="M 360 180 L 395 168 L 395 232 L 360 232 Z" fill="rgba(248,113,113,.18)"/>'
    + '<path d="M 398 168 L 435 180 L 435 232 L 398 232 Z" fill="rgba(248,113,113,.32)"/>'
    + '<line x1="395" y1="160" x2="395" y2="155"/>'
    + '</g>'
    + '<g fill="#fbbf24" opacity="0.9"><path d="M 393 145 Q 396 130 400 145 Q 404 130 408 145 Q 404 152 400 148 Q 396 152 393 145 Z"/><circle cx="400" cy="142" r="2" opacity="0.8"/></g>'
    + '<g stroke="rgba(251,191,36,.35)" stroke-width="0.7" fill="none" stroke-dasharray="2 4">'
    + '<path d="M 80 250 Q 200 235 320 250"/><path d="M 480 250 Q 600 235 720 250"/>'
    + '</g>'
    + '</svg>',

  'present': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">'
    + '<defs><linearGradient id="tlsvg-pr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0d1a"/><stop offset="55%" stop-color="#0e2a3d"/><stop offset="100%" stop-color="#143850"/></linearGradient></defs>'
    + '<rect width="800" height="300" fill="url(#tlsvg-pr)"/>'
    + '<g fill="#fef3c7" opacity="0.6"><circle cx="80" cy="40" r="0.8"/><circle cx="220" cy="60" r="0.9"/><circle cx="380" cy="35" r="0.8"/><circle cx="560" cy="55" r="0.9"/><circle cx="700" cy="40" r="0.8"/></g>'
    + '<g fill="#0a0d1a" opacity="0.92">'
    + '<rect x="60" y="200" width="50" height="80"/><rect x="115" y="180" width="40" height="100"/><rect x="160" y="215" width="55" height="65"/><rect x="220" y="160" width="35" height="120"/><rect x="260" y="195" width="45" height="85"/><rect x="310" y="220" width="50" height="60"/>'
    + '<rect x="440" y="190" width="40" height="90"/><rect x="485" y="170" width="45" height="110"/><rect x="535" y="200" width="35" height="80"/><rect x="575" y="155" width="40" height="125"/><rect x="620" y="210" width="50" height="70"/><rect x="675" y="195" width="45" height="85"/><rect x="725" y="225" width="55" height="55"/>'
    + '</g>'
    + '<g fill="rgba(56,189,248,.35)">'
    + '<rect x="125" y="195" width="4" height="4"/><rect x="135" y="210" width="4" height="4"/><rect x="230" y="180" width="4" height="4"/><rect x="240" y="200" width="4" height="4"/><rect x="495" y="190" width="4" height="4"/><rect x="585" y="175" width="4" height="4"/><rect x="595" y="200" width="4" height="4"/><rect x="685" y="215" width="4" height="4"/>'
    + '</g>'
    + '<g fill="#fef3c7" stroke="#fbbf24" stroke-width="1">'
    + '<path d="M 400 70 Q 388 60 384 75 Q 378 70 376 82 Q 372 80 374 92 L 388 92 Q 394 88 400 82 Q 406 88 412 92 L 426 92 Q 428 80 424 82 Q 422 70 416 75 Q 412 60 400 70 Z"/>'
    + '<circle cx="400" cy="80" r="2" fill="#fbbf24"/>'
    + '</g>'
    + '<g stroke="rgba(251,191,36,.4)" stroke-width="0.6" fill="none" stroke-dasharray="2 3">'
    + '<path d="M 400 105 Q 405 130 398 155 Q 392 175 400 195"/>'
    + '</g>'
    + '</svg>',

  'future': '<svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">'
    + '<defs><linearGradient id="tlsvg-fu" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fbbf24"/><stop offset="30%" stop-color="#f59e0b"/><stop offset="55%" stop-color="#7c2d12"/><stop offset="100%" stop-color="#0a0d1a"/></linearGradient>'
    + '<radialGradient id="tlsvg-fu-glow" cx="50%" cy="30%" r="50%"><stop offset="0%" stop-color="rgba(255,255,255,.9)"/><stop offset="30%" stop-color="rgba(251,191,36,.7)"/><stop offset="100%" stop-color="rgba(251,191,36,0)"/></radialGradient></defs>'
    + '<rect width="800" height="300" fill="url(#tlsvg-fu)"/>'
    + '<rect width="800" height="300" fill="url(#tlsvg-fu-glow)" opacity="0.85"/>'
    + '<g stroke="rgba(255,255,255,.55)" stroke-width="1.2" fill="none" opacity="0.7">'
    + '<line x1="400" y1="80" x2="120" y2="280"/><line x1="400" y1="80" x2="250" y2="290"/><line x1="400" y1="80" x2="400" y2="290"/><line x1="400" y1="80" x2="550" y2="290"/><line x1="400" y1="80" x2="680" y2="280"/><line x1="400" y1="80" x2="50" y2="240"/><line x1="400" y1="80" x2="750" y2="240"/>'
    + '</g>'
    + '<g fill="rgba(10,13,26,.55)" stroke="rgba(251,191,36,.7)" stroke-width="1.5">'
    + '<rect x="280" y="200" width="240" height="80"/>'
    + '<path d="M 280 200 L 320 165 L 480 165 L 520 200 Z"/>'
    + '<rect x="295" y="220" width="22" height="50" fill="rgba(251,191,36,.6)"/>'
    + '<rect x="328" y="220" width="22" height="50" fill="rgba(251,191,36,.4)"/>'
    + '<rect x="365" y="225" width="30" height="55" fill="rgba(251,191,36,.7)"/>'
    + '<rect x="405" y="225" width="30" height="55" fill="rgba(251,191,36,.7)"/>'
    + '<rect x="450" y="220" width="22" height="50" fill="rgba(251,191,36,.4)"/>'
    + '<rect x="483" y="220" width="22" height="50" fill="rgba(251,191,36,.6)"/>'
    + '</g>'
    + '<g fill="#fef3c7" opacity="0.95"><polygon points="400,55 405,72 422,72 408,82 414,99 400,89 386,99 392,82 378,72 395,72"/></g>'
    + '</svg>'
};

// Wikimedia Commons CC-licensed geographic photos — one per era.
// Fallback when a timeline event has no per-event image and no relatedSiteId.
// All URLs confirmed from biblical-sites.js asset set + same domain pattern.
const TL_ERA_PHOTOS = {
  'patriarchs':       'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/BTS_Hebron_Tour_280215_24.jpg/1280px-BTS_Hebron_Tour_280215_24.jpg',
  'exodus-conquest':  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Mount_Sinai_from_the_southwest.jpg/1280px-Mount_Sinai_from_the_southwest.jpg',
  'judges':           'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Ancient_Shiloh_IMG_2924.JPG/1280px-Ancient_Shiloh_IMG_2924.JPG',
  'united-kingdom':   'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Jerusalem-2013%282%29-Aerial-Temple_Mount-%28south_exposure%29.jpg/1280px-Jerusalem-2013%282%29-Aerial-Temple_Mount-%28south_exposure%29.jpg',
  'divided-kingdom':  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Tell_Balata.jpg/1280px-Tell_Balata.jpg',
  'prophets':         'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/2013-Aerial-Mount_of_Olives.jpg/1280px-2013-Aerial-Mount_of_Olives.jpg',
  'exilic':           'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/20100923_mer_morte13.JPG/1280px-20100923_mer_morte13.JPG',
  'second-temple':    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Jerusalem_Bethesda_BW_1.JPG/1280px-Jerusalem_Bethesda_BW_1.JPG',
  'intertestamental': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/%D7%94%D7%9E%D7%A6%D7%95%D7%93%D7%94_%D7%91%D7%9C%D7%99%D7%9C%D7%94.jpg/1280px-%D7%94%D7%9E%D7%A6%D7%95%D7%93%D7%94_%D7%91%D7%9C%D7%99%D7%9C%D7%94.jpg',
  'jesus-life':       'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Kinneret_cropped.jpg/1280px-Kinneret_cropped.jpg',
  'pauline-journeys': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Church_of_the_Holy_Sepulchre_by_Gerd_Eichmann_%28cropped%29.jpg/1280px-Church_of_the_Holy_Sepulchre_by_Gerd_Eichmann_%28cropped%29.jpg',
};

function _tlEvents(){ return (typeof window !== 'undefined' && window.BIBLE_TIMELINE_EVENTS) ? window.BIBLE_TIMELINE_EVENTS : []; }
function _tlEventById(id){ return _tlEvents().find(e => e && e.id === id) || null; }
function _tlEraById(id){ return TL_ERAS.find(e => e && e.id === id) || null; }

function renderBibleTimeline(){
  const rail = document.getElementById('tlRail');
  const legend = document.getElementById('tlLegend');
  if(!rail) return;
  if(rail.dataset.tlBuilt){
    // Re-trigger reveal on revisit so it feels alive each time.
    rail.querySelectorAll('.tl-event').forEach(el => {
      el.classList.remove('reveal');
      void el.offsetWidth;
      el.classList.add('reveal');
    });
    return;
  }

  const events = _tlEvents();

  // Group events by era, preserving curriculum order.
  const groups = {};
  events.forEach(ev => {
    const eraId = ev.era || 'patriarchs';
    if(!groups[eraId]) groups[eraId] = [];
    groups[eraId].push(ev);
  });

  // Build era bands in TL_ERAS order so visually they read left-to-right
  // through history. Skip eras with no events but keep ordering stable.
  rail.innerHTML = TL_ERAS.map(era => {
    const list = groups[era.id] || [];
    if(!list.length) return '';
    const eventsHtml = list.map((ev, idx) => {
      const isNow = ev.id === 'present';
      return `<div class="tl-event" tabindex="0" role="button" aria-label="${_tlEsc(ev.title)}" onclick="openTimelineEvent('${ev.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openTimelineEvent('${ev.id}')}" style="animation-delay:${(idx+1)*70}ms;">
        <div class="tl-medallion${isNow?' now':''}" aria-hidden="true">${ev.icon}</div>
        <div class="tl-year">${_tlEsc(ev.displayYear)}</div>
        <div class="tl-event-title">${_tlEsc(ev.title)}</div>
      </div>`;
    }).join('');
    return `<section class="tl-era-band" data-era="${era.id}" style="--era-color:${era.color};--era-glow:${era.glow};">
      <div class="tl-era-label">${_tlEsc(era.label)}</div>
      <div class="tl-era-range">${_tlEsc(era.range)}</div>
      <div style="position:relative;">
        <div class="tl-thread" aria-hidden="true"></div>
        <div class="tl-events">${eventsHtml}</div>
      </div>
    </section>`;
  }).join('');

  rail.dataset.tlBuilt = '1';

  // Legend below the stage — tappable era chips that scroll the rail.
  if(legend){
    legend.innerHTML = TL_ERAS.filter(era => groups[era.id] && groups[era.id].length).map(era =>
      `<button class="tl-legend-chip" onclick="scrollTimelineTo('${era.id}')">
        <span class="tl-legend-dot" style="background:${era.color};"></span>
        ${_tlEsc(era.label)}
      </button>`
    ).join('');
  }

  // IntersectionObserver — events fade up as they scroll into view.
  // Falls back gracefully on browsers without IO (animations just play immediately).
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('reveal');
          io.unobserve(entry.target);
        }
      });
    }, { root: document.getElementById('tlRailWrap'), threshold: 0.4 });
    rail.querySelectorAll('.tl-event').forEach(el => io.observe(el));
  } else {
    rail.querySelectorAll('.tl-event').forEach(el => el.classList.add('reveal'));
  }

  // Scroll the rail so "You Are Here" is centered on first render —
  // helps users orient immediately to where they live in the story.
  setTimeout(() => {
    const present = rail.querySelector('[data-era="present"]');
    const wrap = document.getElementById('tlRailWrap');
    if(present && wrap){
      const offset = present.offsetLeft - wrap.offsetWidth / 2 + present.offsetWidth / 2;
      wrap.scrollTo({ left: Math.max(0, offset - 80), behavior: 'smooth' });
    }
  }, 200);
}

function scrollTimelineTo(eraId){
  const rail = document.getElementById('tlRail');
  const wrap = document.getElementById('tlRailWrap');
  if(!rail || !wrap) return;
  const band = rail.querySelector('[data-era="'+eraId+'"]');
  if(!band) return;
  const offset = band.offsetLeft - 16;
  wrap.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
}

function openTimelineEvent(eventId){
  const ev = _tlEventById(eventId);
  if(!ev){ if(typeof showToast==='function') showToast('Event not found'); return; }
  const era = _tlEraById(ev.era) || { label:'—', color:'#a78bfa', glow:'rgba(167,139,250,.22)' };

  // Header image — prefer: per-event photo → relatedSite heroPhoto → era photo → era SVG.
  const svgEl = document.getElementById('tlEventSvg');
  if(svgEl){
    let photoUrl = ev.image || null;
    if(!photoUrl && ev.relatedSiteId){
      const site = (typeof _bwSiteById === 'function') ? _bwSiteById(ev.relatedSiteId) : null;
      if(site && site.heroPhoto) photoUrl = site.heroPhoto;
    }
    if(!photoUrl && TL_ERA_PHOTOS && TL_ERA_PHOTOS[ev.era]) photoUrl = TL_ERA_PHOTOS[ev.era];
    if(photoUrl){
      svgEl.innerHTML = '<img src="'+_tlEsc(photoUrl)+'" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy">';
    } else {
      svgEl.innerHTML = (TL_ERA_SVGS && TL_ERA_SVGS[ev.era]) ? TL_ERA_SVGS[ev.era] : '';
    }
  }

  // Era label + scripture year context.
  const eraEl = document.getElementById('tlEventEra');
  if(eraEl) eraEl.textContent = (era.label.toUpperCase()) + ' · ' + (ev.displayYear || '').toUpperCase();
  const yearEl = document.getElementById('tlEventYear');
  if(yearEl) yearEl.textContent = ev.displayYear || '';

  // Title + subtitle.
  const titleEl = document.getElementById('tlEventTitle');
  if(titleEl) titleEl.textContent = ev.title || '';
  const subEl = document.getElementById('tlEventSubtitle');
  if(subEl) subEl.textContent = ev.subtitle || '';

  // Main narrative body (3-4 paragraphs).
  const bodyEl = document.getElementById('tlEventBody');
  if(bodyEl) bodyEl.innerHTML = ev.body || '';

  // Why This Matters callout.
  const whyWrap = document.getElementById('tlEventWhyWrap');
  const whyEl = document.getElementById('tlEventWhy');
  if(whyWrap && whyEl){
    if(ev.whyMatters){
      // Strip outer <p> tags if present so the <p> in markup doesn't double-wrap.
      const cleaned = String(ev.whyMatters).replace(/^\s*<p>/, '').replace(/<\/p>\s*$/, '');
      whyEl.innerHTML = cleaned;
      whyWrap.style.display = '';
    } else {
      whyWrap.style.display = 'none';
    }
  }

  // Key verse pull-quote.
  const keyWrap = document.getElementById('tlEventKeyWrap');
  const keyText = document.getElementById('tlEventKeyText');
  const keyRef  = document.getElementById('tlEventKeyRef');
  if(keyWrap && keyText && keyRef){
    if(ev.keyVerse && ev.keyVerse.text && ev.keyVerse.ref){
      keyText.textContent = '“' + ev.keyVerse.text + '”';
      keyRef.textContent = '— ' + ev.keyVerse.ref;
      keyWrap.style.display = '';
    } else {
      keyWrap.style.display = 'none';
    }
  }

  // Scripture refs as cyan chips that jump into the Bible reader.
  const refsEl = document.getElementById('tlEventRefs');
  if(refsEl){
    if((ev.scriptureRefs || []).length){
      refsEl.innerHTML = ev.scriptureRefs.map(function(r){
        return '<button class="tlm-ref-chip" onclick="bwJumpToRef(\''+r.replace(/'/g,"\\'")+'\')">\u{1F4D6} '+_tlEsc(r)+'</button>';
      }).join('');
    } else refsEl.innerHTML = '';
  }

  // Related links: Story Mode + Bible Lands site.
  const relEl = document.getElementById('tlEventRelated');
  if(relEl){
    let html = '';
    if(ev.relatedStoryId){
      html += '<button class="tlm-related-link" onclick="closeTimelineEvent();if(typeof openStory===\'function\')openStory(\''+ev.relatedStoryId+'\')">'
           + '✨ <span style="flex:1;">See this in <strong>Story Mode</strong></span><span style="opacity:.7;">→</span>'
           + '</button>';
    }
    if(ev.relatedSiteId){
      const s = (typeof _bwSiteById === 'function') ? _bwSiteById(ev.relatedSiteId) : null;
      if(s){
        html += '<button class="tlm-related-link" onclick="closeTimelineEvent();openBwSite(\''+ev.relatedSiteId+'\')">'
             + '\u{1F4CD} <span style="flex:1;">Visit <strong>'+_tlEsc(s.name)+'</strong> in Biblical Archaeology</span><span style="opacity:.7;">→</span>'
             + '</button>';
      }
    }
    relEl.innerHTML = html;
  }

  // Scroll body to top whenever a new event is opened.
  const wrap = document.querySelector('#tlEventModal .tlm-body-wrap');
  if(wrap) wrap.scrollTop = 0;

  if(typeof openModal === 'function') openModal('tlEventModal');
  if(typeof logActivity === 'function') logActivity('faith', 'Timeline event: ' + ev.title);
}

function closeTimelineEvent(){
  if(typeof closeModal === 'function') closeModal('tlEventModal');
}

function _tlEsc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[c]);
}

// ═════════════════════════════════════════════════════════════
// F4-E — INFOGRAPHIC RENDERER (Bible Lands site + discovery modals)
// ═════════════════════════════════════════════════════════════
// Looks up window.BIBLICAL_INFOGRAPHICS by id and returns an HTML
// block that wraps the SVG diagram with a title + caption. Used by
// openBwSite and openBwDiscovery.
function renderInfographicFor(id){
  const map = (typeof window !== 'undefined' && window.BIBLICAL_INFOGRAPHICS) ? window.BIBLICAL_INFOGRAPHICS : {};
  const info = map[id];
  if(!info) return '';
  const title   = info.title   || '';
  const caption = info.caption || '';
  const svg     = info.svg     || '';
  return '<div style="background:rgba(10,13,26,0.55);border:1px solid rgba(251,191,36,0.18);border-radius:14px;padding:.7rem .8rem 1rem;margin-bottom:1rem;box-shadow:0 8px 24px rgba(15,23,42,.3);">'
    + '<div style="font-family:Bebas Neue, var(--fm);font-size:.78rem;letter-spacing:.22em;color:#fef3c7;margin-bottom:.2rem;">' + _tlEsc(title) + '</div>'
    + (caption ? '<div style="font-family:Georgia,serif;font-style:italic;font-size:.74rem;color:rgba(255,255,255,0.72);line-height:1.55;margin-bottom:.7rem;">' + _tlEsc(caption) + '</div>' : '')
    + '<div style="border-radius:10px;overflow:hidden;">' + svg + '</div>'
    + '</div>';
}

// ═════════════════════════════════════════════════════════════
// F4-I — FAITH HOME ENTRANCE ANIMATION
// ═════════════════════════════════════════════════════════════
// Add the .fh-enter class on first render of bf-home each session so
// CSS keyframe staggers fire. Removed after the animation completes.
let _fhEnteredThisSession = false;
(function wireFaithHomeEntrance(){
  if(typeof renderFaithHome !== 'function') return;
  const _orig = renderFaithHome;
  renderFaithHome = function(){
    _orig.apply(this, arguments);
    const home = document.getElementById('bf-home');
    if(!home || _fhEnteredThisSession) return;
    if(_fxReducedMotion()){ _fhEnteredThisSession = true; return; }
    home.classList.add('fh-enter');
    _fhEnteredThisSession = true;
    setTimeout(function(){ home.classList.remove('fh-enter'); }, 1100);
  };
})();

// ── F2-D place-tag taps → F3-B site drawer ──────────────────
// Activates the data-place attributes added in F2-D's renderEsvPassage.
// One-time delegated listener on document body so it works regardless of
// when chapters are loaded into the reader.
(function(){
  if(typeof document === 'undefined') return;
  if(document.body && document.body.dataset.bwPlaceTapWired) return;
  function handler(ev){
    const t = ev.target && ev.target.closest && ev.target.closest('[data-place]');
    if(!t) return;
    const placeId = t.getAttribute('data-place');
    if(!placeId) return;
    // F2-D added a "coming F3" title; remove it now.
    if(t.getAttribute('title') === 'Biblical World — coming F3') t.removeAttribute('title');
    ev.preventDefault();
    ev.stopPropagation();
    // Confirm we have a site for this id; otherwise let the click pass through.
    const site = _bwSiteById(placeId);
    if(site) openBwSite(placeId);
  }
  // Wire on DOMContentLoaded so document.body exists.
  if(document.body){
    document.body.addEventListener('click', handler, true);
    document.body.dataset.bwPlaceTapWired = '1';
  } else {
    document.addEventListener('DOMContentLoaded', function(){
      document.body.addEventListener('click', handler, true);
      document.body.dataset.bwPlaceTapWired = '1';
    });
  }
})();

// SM-2-lite update — adjusts ease and intervalDays in place, sets nextDue.
function _mvApplySrUpdate(v, correct){
  const today = _mvTodayISO();
  v.totalReviews   = (v.totalReviews || 0) + 1;
  v.lastReviewed   = new Date().toISOString();

  if(correct){
    v.correctReviews = (v.correctReviews || 0) + 1;
    if(_mvQuizCorrect !== undefined) _mvQuizCorrect++;
    if(!v.intervalDays || v.intervalDays < 1)      v.intervalDays = 1;
    else if(v.intervalDays === 1)                  v.intervalDays = 3;
    else                                            v.intervalDays = Math.round(v.intervalDays * (v.ease || 2.5));
    v.ease = Math.min(2.8, (v.ease || 2.5) + 0.1);
    if(v.intervalDays >= 90 && !v.mastered){
      v.mastered = true;
      v.masteredAt = new Date().toISOString();
      D.scrPoints = (D.scrPoints || 0) + 25;
      showToast('🏆 ' + v.reference + ' mastered! +25 XP');
      if(typeof logActivity === 'function') logActivity('faith', 'Memory verse mastered: ' + v.reference);
    }
  } else {
    v.intervalDays = 1;
    v.ease = Math.max(1.3, (v.ease || 2.5) - 0.2);
  }

  // Compute next due date.
  const next = new Date();
  next.setDate(next.getDate() + v.intervalDays);
  v.nextDue = next.toISOString().slice(0,10);

  // Streak protection — any review counts.
  if(!D.scrReadDays) D.scrReadDays = {};
  D.scrReadDays[today] = true;

  save();
  if(typeof renderFaithHome === 'function') renderFaithHome();
}

// ════════════════════════════════════════════════════════════════
// F4-G — STORY MODE
// Illustrated, narrated Bible stories. Data lives in
// /app/js/data/bible-stories.js as window.BIBLE_STORIES.
// ════════════════════════════════════════════════════════════════

let _storyState = { storyId:null, sceneIdx:0, narrating:false };

function _getStories(){
  return (typeof window !== 'undefined' && Array.isArray(window.BIBLE_STORIES)) ? window.BIBLE_STORIES : [];
}

function _storyEsc(s){
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function renderFaithHomeStories(){
  const list = document.getElementById('fhStoryList');
  if(!list) return;
  // Defensively pin openStory to window. `function` declarations at file scope
  // are normally global, but on cached PWAs and some bundlers this can drift.
  if(typeof window !== 'undefined' && typeof openStory === 'function' && window.openStory !== openStory){
    window.openStory = openStory;
  }
  const stories = _getStories();
  if(!stories.length){
    list.innerHTML = '<div style="font-size:.78rem;color:var(--tx3);font-family:Georgia,serif;font-style:italic;padding:.4rem .2rem;">More stories arriving in upcoming releases.</div>';
    return;
  }
  // Belt + suspenders click handling:
  //   1) Inline `onclick` reads from `this.dataset.storyId` — no string
  //      escaping risk, fires on every browser including iOS Safari.
  //   2) Delegated `click` on #fhStoryList catches if the inline fails.
  // Hover effect dropped — fragile and not required for the click bug.
  list.innerHTML = stories.map(function(s){
    const sceneCount = (s.scenes || []).length;
    const accent = s.color || '#fbbf24';
    return ''
      + '<button type="button" class="fh-story-tile" data-story-id="' + _storyEsc(s.id) + '" '
      + 'onclick="(typeof openStory===\'function\')&&openStory(this.dataset.storyId)" '
      + 'style="--accent:' + accent + ';">'
      + '<div style="display:flex;align-items:center;gap:.55rem;margin-bottom:.4rem;pointer-events:none;">'
      +   '<span style="font-size:1.4rem;line-height:1;">' + (s.icon || '⭐') + '</span>'
      +   '<div style="font-family:\'Bebas Neue\',var(--fm);letter-spacing:.06em;font-size:1.05rem;color:var(--tx);line-height:1.05;">' + _storyEsc(s.title) + '</div>'
      + '</div>'
      + '<div style="font-family:Georgia,serif;font-style:italic;font-size:.76rem;color:var(--tx2);line-height:1.5;margin-bottom:.55rem;pointer-events:none;">' + _storyEsc(s.subtitle || '') + '</div>'
      + '<div style="display:flex;align-items:center;gap:.5rem;font-size:.6rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:' + accent + ';pointer-events:none;">'
      +   '<span>' + sceneCount + ' scenes</span>'
      +   (s.duration ? '<span style="color:var(--tx3);">·</span><span style="color:var(--tx3);">' + _storyEsc(s.duration) + '</span>' : '')
      +   '<span style="margin-left:auto;color:var(--tx2);">Begin →</span>'
      + '</div>'
      + '</button>';
  }).join('');
  // Wire delegated click as the second safety net. Idempotent.
  if(!list.__storyClickBound){
    list.addEventListener('click', function(e){
      const btn = e.target && e.target.closest ? e.target.closest('[data-story-id]') : null;
      if(!btn) return;
      const id = btn.getAttribute('data-story-id');
      if(id && typeof openStory === 'function') openStory(id);
    });
    list.__storyClickBound = true;
  }
}

function openStory(storyId){
  const story = _getStories().find(function(s){ return s.id === storyId; });
  if(!story){ if(typeof showToast==='function') showToast('Story not found'); return; }
  _storyState = { storyId: storyId, sceneIdx: 0, narrating: false };
  if(typeof openModal === 'function') openModal('storyPlayerModal');
  _storyShowScene(0);
}

function closeStory(){
  _storyStopNarration();
  if(typeof closeModal === 'function') closeModal('storyPlayerModal');
}

function _storyCurrent(){
  return _getStories().find(function(s){ return s.id === _storyState.storyId; }) || null;
}

function _storyShowScene(idx){
  const story = _storyCurrent();
  if(!story) return;
  const scenes = story.scenes || [];
  const total  = scenes.length;
  const isClosing = idx >= total;

  const stage     = document.getElementById('spStage');
  const svgBox    = document.getElementById('spSvg');
  const eyebrowEl = document.getElementById('spEyebrow');
  const titleEl   = document.getElementById('spTitle');
  const bibleEl   = document.getElementById('spBibleText');
  const narrEl    = document.getElementById('spNarration');
  const prevBtn   = document.getElementById('spPrevBtn');
  const nextBtn   = document.getElementById('spNextBtn');

  _storyStopNarration();
  _storyState.sceneIdx = idx;

  // Lift the modal-level final-state class on/off the .md so the SVG collapses
  // into a thin gold strip and the closing text can fill the card.
  const modalEl = document.getElementById('storyPlayerModal');
  const mdEl    = modalEl ? modalEl.querySelector('.md') : null;

  if(isClosing){
    if(mdEl) mdEl.classList.add('sp-final');
    if(svgBox){ svgBox.innerHTML = ''; svgBox.classList.remove('sp-fade-in'); }
    if(eyebrowEl) eyebrowEl.textContent = '';
    if(titleEl)   titleEl.textContent   = '';
    if(bibleEl){
      bibleEl.innerHTML = '';
      bibleEl.style.display = 'none';
    }
    if(narrEl){
      narrEl.innerHTML = ''
        + '<div class="sp-closing sp-fade-in">'
        +   '<div class="sp-cl-story">' + _storyEsc(story.subtitle || '') + '</div>'
        +   '<div class="sp-cl-heading">' + _storyEsc(story.title || '') + '</div>'
        +   '<div class="sp-cl-eye">' + _storyEsc(story.scriptureRef || 'Closing') + '</div>'
        +   '<div class="sp-cl-body">' + _storyEsc(story.closing || '') + '</div>'
        +   (story.closingPrompt ? '<div class="sp-cl-prompt">' + _storyEsc(story.closingPrompt) + '</div>' : '')
        + '</div>';
    }
    if(stage) stage.style.background = '';
    if(prevBtn){ prevBtn.disabled = false; prevBtn.textContent = '‹ Previous'; }
    if(nextBtn){ nextBtn.textContent = '↻ Start Over'; nextBtn.onclick = function(){ _storyJumpScene(0); }; }
    _storyRenderProgress(idx, total);
    _storyAwardXp(story.id);
    return;
  }

  if(mdEl) mdEl.classList.remove('sp-final');

  const scene = scenes[idx];
  if(!scene) return;
  if(stage) stage.style.background = '#0a0d1a';
  if(svgBox){
    svgBox.classList.remove('sp-fade-in');
    void svgBox.offsetWidth;
    svgBox.innerHTML = scene.svg || '';
    svgBox.classList.add('sp-fade-in');
  }
  if(eyebrowEl) eyebrowEl.textContent = 'Scene ' + (idx+1) + ' · ' + (scene.title || '');
  if(titleEl)   titleEl.textContent   = story.title;
  if(bibleEl){
    bibleEl.style.display = '';
    bibleEl.innerHTML = _storyEsc(scene.bibleText || '') + '<span class="sp-ref">' + _storyEsc(scene.scriptureRef || '') + '</span>';
  }
  if(narrEl){
    narrEl.classList.remove('sp-fade-in');
    void narrEl.offsetWidth;
    narrEl.classList.add('sp-fade-in');
    narrEl.textContent = scene.narration || '';
  }
  if(prevBtn){ prevBtn.disabled = (idx === 0); prevBtn.textContent = '‹ Prev'; }
  if(nextBtn){
    nextBtn.disabled = false;
    nextBtn.textContent = (idx === total - 1) ? 'Reflect ›' : 'Next ›';
    nextBtn.onclick = storyNext;
  }
  _storyRenderProgress(idx, total);

  if(_storyState.narrating){
    _storySpeak(scene.narration || '');
  }
}

function _storyRenderProgress(idx, total){
  const progEl = document.getElementById('spProgress');
  if(!progEl) return;
  let html = '';
  for(let i=0;i<total;i++){
    const cls = i === idx ? 'sp-dot active' : (i < idx ? 'sp-dot done' : 'sp-dot');
    html += '<span class="' + cls + '" onclick="_storyJumpScene(' + i + ')" role="button" aria-label="Scene ' + (i+1) + '"></span>';
  }
  progEl.innerHTML = html;
}

function _storyJumpScene(i){
  const story = _storyCurrent(); if(!story) return;
  const total = (story.scenes || []).length;
  if(i < 0 || i > total) return;
  _storyShowScene(i);
}

function storyNext(){
  const story = _storyCurrent(); if(!story) return;
  const total = (story.scenes || []).length;
  if(_storyState.sceneIdx >= total) return;
  _storyShowScene(_storyState.sceneIdx + 1);
}

function storyPrev(){
  if(_storyState.sceneIdx <= 0) return;
  _storyShowScene(_storyState.sceneIdx - 1);
}

function storyToggleNarrate(){
  const btn = document.getElementById('spNarrateBtn');
  if(!('speechSynthesis' in window)){
    if(typeof showToast === 'function') showToast('Voice narration not supported on this device');
    return;
  }
  _storyState.narrating = !_storyState.narrating;
  if(btn) btn.classList.toggle('on', _storyState.narrating);
  if(_storyState.narrating){
    const story = _storyCurrent(); if(!story) return;
    const scene = (story.scenes || [])[_storyState.sceneIdx];
    _storySpeak(scene && scene.narration ? scene.narration : (story.closing || ''));
  } else {
    _storyStopNarration();
  }
}

function _storySpeak(text){
  if(!('speechSynthesis' in window)) return;
  if(!text) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.92; u.pitch = 1.0; u.volume = 1.0;
    const voices = window.speechSynthesis.getVoices() || [];
    const pref = voices.find(function(v){ return /en-(US|GB)/i.test(v.lang) && /female|samantha|karen|moira|google/i.test(v.name); })
              || voices.find(function(v){ return /^en/i.test(v.lang); });
    if(pref) u.voice = pref;
    window.speechSynthesis.speak(u);
  } catch(_){}
}

function _storyStopNarration(){
  if('speechSynthesis' in window){
    try { window.speechSynthesis.cancel(); } catch(_){}
  }
}

function _storyAwardXp(storyId){
  try {
    if(!D.faithStoriesViewed) D.faithStoriesViewed = {};
    const today = new Date().toISOString().slice(0,10);
    const key = today + '::' + storyId;
    if(D.faithStoriesViewed[key]) return;
    D.faithStoriesViewed[key] = true;
    D.scrPoints = (D.scrPoints || 0) + 10;
    if(typeof save === 'function') save();
    if(typeof renderFaithHome === 'function') renderFaithHome();
    if(typeof showToast === 'function') showToast('+10 XP — story completed ✨');
  } catch(_){}
}

document.addEventListener('keydown', function(e){
  const modal = document.getElementById('storyPlayerModal');
  if(!modal || !modal.classList.contains('open')) return;
  if(e.key === 'ArrowRight' || e.key === ' '){ e.preventDefault(); storyNext(); }
  else if(e.key === 'ArrowLeft'){ e.preventDefault(); storyPrev(); }
  else if(e.key === 'Escape'){ closeStory(); }
});

