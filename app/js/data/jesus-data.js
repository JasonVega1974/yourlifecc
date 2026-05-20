// YourLife CC — Who Is Jesus? Data
// Comprehensive profile: life, purpose, crucifixion, teachings, red-letter words
// Strong's Concordance keys included for key terms

const JESUS_DATA = {
  overview: {
    title: "Who Is Jesus?",
    subtitle: "Son of God. Son of Man. Savior of the World.",
    summary: `Jesus of Nazareth is the central figure of Christianity — and arguably the most influential person in human history. Christians believe He is fully God and fully man, the second Person of the Trinity, who entered human history around 4–6 BC in Bethlehem, Judea. His three-year public ministry, crucifixion, and resurrection from the dead form the foundation of the Christian faith.`,
    keyTitles: [
      { title: "Messiah / Christ", meaning: "The Anointed One — the promised deliverer of Israel", greek: "Christos (G5547)", hebrew: "Mashiach (H4899)" },
      { title: "Son of God", meaning: "The divine nature of Jesus — eternally begotten of the Father", greek: "Huios tou Theou (G5207)", hebrew: "Ben Elohim (H1121)" },
      { title: "Son of Man", meaning: "His full identification with humanity; also a messianic title from Daniel 7:13", greek: "Huios tou anthrōpou (G5207)", ref: "Daniel 7:13" },
      { title: "Lord (Kyrios)", meaning: "The Greek word used for YHWH in the Septuagint — applied to Jesus", greek: "Kyrios (G2962)" },
      { title: "Savior", meaning: "The One who delivers humanity from sin and its consequences", greek: "Sōtēr (G4990)" },
      { title: "Word (Logos)", meaning: "The eternal expression of God who became flesh — John's profound opening", greek: "Logos (G3056)", ref: "John 1:1-14" },
      { title: "Lamb of God", meaning: "The final, perfect sacrifice — foreshadowed by the Passover lamb", greek: "Amnos tou Theou (G286)", ref: "John 1:29" },
      { title: "High Priest", meaning: "Our mediator before God — interceding on our behalf", ref: "Hebrews 4:14-16" },
      { title: "King of Kings", meaning: "The ultimate authority over all earthly and cosmic powers", ref: "Revelation 19:16" },
      { title: "Alpha and Omega", meaning: "The beginning and the end — eternal, encompassing all of history", ref: "Revelation 1:8" }
    ]
  },

  life: {
    birth: {
      title: "The Incarnation — God Becomes Flesh",
      details: `Jesus was conceived by the Holy Spirit and born of the Virgin Mary (Matthew 1:18-25; Luke 1:26-38). He was born in Bethlehem of Judea, fulfilling the prophecy of Micah 5:2. The date was approximately 4–6 BC (the calendar was miscalculated). His birth was announced by angels to shepherds, and wise men (magi) from the East followed a star and brought gifts — gold (kingship), frankincense (priesthood), and myrrh (burial/death). King Herod attempted to kill the infant Jesus, so Joseph fled with Mary and Jesus to Egypt — fulfilling Hosea 11:1.`,
      propheciesFulfilled: [
        { prophecy: "Born of a virgin", reference: "Isaiah 7:14 → Matthew 1:23" },
        { prophecy: "Born in Bethlehem", reference: "Micah 5:2 → Matthew 2:1" },
        { prophecy: "Called out of Egypt", reference: "Hosea 11:1 → Matthew 2:15" },
        { prophecy: "Slaughter of innocents", reference: "Jeremiah 31:15 → Matthew 2:18" }
      ]
    },
    earlyLife: {
      title: "The Hidden Years",
      details: `Scripture gives us two glimpses of Jesus' early life. At eight days old He was circumcised and named (Luke 2:21). At forty days His parents brought Him to the Temple for purification — where Simeon and Anna the prophetess recognized Him as the Messiah (Luke 2:22-38). At age 12, Jesus was found in the Temple discussing theology with the teachers, astonishing them with His understanding (Luke 2:41-52). He then returned to Nazareth and "grew in wisdom and stature, and in favor with God and man" (Luke 2:52). He likely worked as a carpenter (tekton — craftsman) alongside Joseph until approximately age 30.`
    },
    baptism: {
      title: "Baptism by John",
      details: `At approximately age 30, Jesus came to the Jordan River to be baptized by His cousin John the Baptist. John initially refused — "I need to be baptized by you" — but Jesus insisted, saying it was "to fulfill all righteousness" (Matthew 3:15). As Jesus emerged from the water, the heavens opened, the Holy Spirit descended on Him as a dove, and the Father's voice declared: "This is my beloved Son, with whom I am well pleased" — a Trinitarian moment and the inauguration of Jesus' public ministry. (Matthew 3:13-17)`,
      significance: "The Trinity is revealed. Jesus is publicly anointed by the Spirit. His ministry begins."
    },
    temptation: {
      title: "Temptation in the Wilderness",
      details: `Immediately after His baptism, the Spirit led Jesus into the Judean wilderness for 40 days of fasting and testing by the devil. Satan presented three temptations: (1) Turn stones to bread — tempting Jesus to use His power for personal comfort. (2) Jump from the Temple so angels would catch Him — tempting Jesus to test the Father. (3) Bow to Satan in exchange for all the kingdoms of the world — offering a crown without a cross. Jesus answered each temptation with Scripture: "It is written..." He is our model for resisting temptation. (Matthew 4:1-11)`,
      scriptures: ["Deuteronomy 8:3", "Deuteronomy 6:16", "Deuteronomy 6:13"]
    },
    ministry: {
      title: "The Three-Year Ministry",
      details: `Jesus' ministry lasted approximately 3 years (AD 27–30), primarily in Galilee, Judea, and surrounding regions. He called 12 apostles, performed miracles, taught in synagogues and on hillsides, confronted religious hypocrisy, dined with sinners, healed the sick, raised the dead, and proclaimed the Kingdom of God. His ministry can be broadly divided into: Galilean Ministry (Matthew 4–18), Journey to Jerusalem (Matthew 19–20), and Jerusalem Ministry & Passion Week (Matthew 21–28).`,
      miracles: [
        "Water turned to wine (first miracle) — John 2:1-11",
        "Healing a paralyzed man — Mark 2:1-12",
        "Feeding 5,000 with 5 loaves and 2 fish — John 6:1-14",
        "Walking on water — Matthew 14:22-33",
        "Healing 10 lepers — Luke 17:11-19",
        "Opening blind eyes (multiple) — John 9:1-41",
        "Raising Lazarus from the dead — John 11:1-44",
        "Raising the widow's son — Luke 7:11-17",
        "Calming the storm — Mark 4:35-41",
        "Casting out demons — Mark 5:1-20"
      ]
    }
  },

  crucifixion: {
    title: "The Crucifixion — The Heart of the Gospel",
    overview: `The crucifixion of Jesus is the central event of human history for Christians. Jesus was arrested in the Garden of Gethsemane, tried illegally before the Sanhedrin and Pilate, tortured, crucified on Golgotha (Place of the Skull), and died around 3:00 PM on what Christians call Good Friday. He was buried in a new tomb owned by Joseph of Arimathea, sealed with a stone, and guarded by Roman soldiers.`,

    timeline: [
      { event: "Last Supper", detail: "Jesus institutes the Lord's Supper with His disciples, washes their feet, delivers the Upper Room Discourse (John 14-17)", ref: "John 13-17" },
      { event: "Garden of Gethsemane", detail: "Jesus prays in agony ('Not my will, but yours') sweating drops of blood (hematidrosis) under extreme distress", ref: "Luke 22:39-46" },
      { event: "Arrest", detail: "Judas betrays Jesus with a kiss. Soldiers arrest Him. Peter cuts off a servant's ear; Jesus heals it.", ref: "John 18:1-12" },
      { event: "Trial before Sanhedrin", detail: "Illegal nighttime trial. False witnesses. Jesus claims to be the Son of Man of Daniel 7:13. Charged with blasphemy.", ref: "Mark 14:53-65" },
      { event: "Peter's Denial", detail: "Peter denies knowing Jesus three times, just as Jesus predicted. The rooster crows. Peter weeps bitterly.", ref: "Luke 22:54-62" },
      { event: "Trial before Pilate", detail: "Pilate finds no guilt in Jesus. Sends Him to Herod. Herod mocks Him and sends Him back. Pilate offers to release one prisoner — the crowd chooses Barabbas.", ref: "Luke 23:1-25" },
      { event: "Flogging / Mocking", detail: "Roman soldiers flog Jesus with a flagellum (designed to tear flesh). They place a crown of thorns on His head, a purple robe, and mock Him as King.", ref: "John 19:1-3" },
      { event: "Via Dolorosa", detail: "Jesus carries His cross toward Golgotha. Simon of Cyrene is compelled to help carry it. Women mourn along the way.", ref: "Luke 23:26-31" },
      { event: "The Crucifixion", detail: "Jesus is nailed to the cross at approximately 9 AM (Mark) or noon (John). The charge reads 'Jesus of Nazareth, King of the Jews' in Hebrew, Greek, and Latin.", ref: "John 19:17-22" },
      { event: "The Seven Last Words", detail: "Jesus speaks 7 phrases from the cross over 6 hours. See below.", ref: "Luke 23:34, 43; John 19:26-27; Mark 15:34; John 19:28, 30; Luke 23:46" },
      { event: "Death", detail: "At ~3:00 PM the Temple veil tears from top to bottom, an earthquake shakes Jerusalem, the sun goes dark. Jesus cries 'It is finished!' and dies. A Roman soldier pierces His side with a spear.", ref: "Matthew 27:50-54" },
      { event: "Burial", detail: "Joseph of Arimathea and Nicodemus receive Jesus' body. They wrap it in linen with 75 lbs of spices and place it in a new garden tomb.", ref: "John 19:38-42" }
    ],

    sevenLastWords: [
      { words: "Father, forgive them, for they do not know what they do.", ref: "Luke 23:34", meaning: "Intercession for His executioners — even while dying, Jesus prays for the guilty." },
      { words: "Truly I say to you, today you will be with me in paradise.", ref: "Luke 23:43", meaning: "To the repentant thief — salvation is available until the last breath." },
      { words: "Woman, behold your son... Behold, your mother.", ref: "John 19:26-27", meaning: "Jesus entrusts Mary's care to the Apostle John — even in agony, He cares for family." },
      { words: "My God, my God, why have you forsaken me?", ref: "Matthew 27:46 / Psalm 22:1", meaning: "The deepest cry — Jesus bears the full weight of sin and separation from the Father that our sin deserves." },
      { words: "I thirst.", ref: "John 19:28", meaning: "Full humanity — fulfilling Psalm 22:15 and 69:21. He is offered sour wine (vinegar)." },
      { words: "It is finished.", ref: "John 19:30", meaning: "Tetelestai — a commercial term meaning 'paid in full.' The debt of sin is completely settled." },
      { words: "Father, into your hands I commit my spirit.", ref: "Luke 23:46 / Psalm 31:5", meaning: "His last breath — a prayer of total trust and surrender to the Father." }
    ],

    significance: {
      substitutionary: "Jesus died as our substitute — taking the punishment our sin deserved (2 Corinthians 5:21; Isaiah 53:5)",
      propitiation: "His death satisfied God's righteous wrath against sin (Romans 3:25; 1 John 2:2)",
      redemption: "He paid the ransom to purchase us out of slavery to sin (Mark 10:45; 1 Peter 1:18-19)",
      reconciliation: "The broken relationship between God and humanity is restored (Romans 5:10; Colossians 1:20)",
      justification: "We are declared righteous before God on the basis of Christ's righteousness (Romans 5:1; Galatians 2:16)"
    }
  },

  resurrection: {
    title: "The Resurrection — History's Turning Point",
    summary: `Three days after His death, Jesus rose bodily from the dead. This is the cornerstone of Christian faith (1 Corinthians 15:17). The tomb was found empty on Sunday morning. Jesus appeared to Mary Magdalene, to two disciples on the road to Emmaus, to Peter alone, to the Eleven, to 500 people at once (1 Corinthians 15:6), to James, and finally to the Apostle Paul (1 Corinthians 15:5-8). He appeared for 40 days, teaching about the Kingdom of God, before ascending to heaven from the Mount of Olives in the presence of His disciples (Acts 1:3-9).`,
    appearances: [
      "To Mary Magdalene (John 20:11-18)",
      "To Mary Magdalene and other women (Matthew 28:9-10)",
      "To Peter (1 Corinthians 15:5; Luke 24:34)",
      "To two on the Emmaus road (Luke 24:13-35)",
      "To the Ten (Thomas absent) (Luke 24:36-43; John 20:19-25)",
      "To the Eleven — Thomas present (John 20:26-29)",
      "To seven by the Sea of Galilee (John 21:1-14)",
      "To 500 at once (1 Corinthians 15:6)",
      "To James, the Lord's brother (1 Corinthians 15:7)",
      "To all apostles at the Ascension (Acts 1:3-9)",
      "To Paul on the Damascus road (Acts 9:1-6; 1 Corinthians 15:8)"
    ]
  },

  teachings: {
    title: "The Teachings of Jesus",
    categories: [
      {
        id: "kingdom",
        label: "The Kingdom of God",
        summary: "The Kingdom of God (or Kingdom of Heaven in Matthew) is the central theme of Jesus' preaching. It is both present now and coming in fullness. It is not a political kingdom but the reign of God in human hearts and ultimately over all creation.",
        keyPassages: ["Matthew 4:17", "Mark 1:15", "Luke 17:20-21", "Matthew 13 (Parables of the Kingdom)"]
      },
      {
        id: "sermon-mount",
        label: "The Sermon on the Mount",
        summary: "Matthew 5–7. The most famous ethical teaching in history. Includes the Beatitudes, the Lord's Prayer, teaching on anger, lust, divorce, oaths, loving enemies, giving, prayer, fasting, materialism, and judgment. Jesus radicalizes the law — it's not just behavior, it's the heart.",
        keyPassages: ["Matthew 5:3-12 (Beatitudes)", "Matthew 5:17-20", "Matthew 6:9-13 (Lord's Prayer)", "Matthew 7:12 (Golden Rule)", "Matthew 7:24-27 (Two Builders)"]
      },
      {
        id: "love",
        label: "Love & The Greatest Commandments",
        summary: "When asked the greatest commandment, Jesus said: 'Love the Lord your God with all your heart, soul, and mind' and 'Love your neighbor as yourself.' These two commands summarize the entire Law and Prophets. Jesus also commanded His disciples to love one another as He loved them — a new, sacrificial standard.",
        keyPassages: ["Matthew 22:36-40", "John 13:34-35", "John 15:12-13", "Luke 10:25-37 (Good Samaritan)"]
      },
      {
        id: "prayer",
        label: "Prayer & Fasting",
        summary: "Jesus modeled a life of prayer — He withdrew regularly to pray alone. He taught His disciples how to pray with the Lord's Prayer (Matthew 6:9-13) and gave principles: pray in secret, not to impress; be persistent (Luke 18:1-8); pray with faith (Mark 11:24). He fasted 40 days before His ministry and taught that some spiritual battles require fasting (Mark 9:29).",
        keyPassages: ["Matthew 6:5-13", "Luke 18:1-8", "Mark 11:24", "Luke 11:1-13"]
      },
      {
        id: "parables",
        label: "The Parables",
        summary: "Jesus taught in parables — short, vivid stories with spiritual meaning. He used ordinary life (farming, fishing, family, money) to reveal Kingdom truths. He said He spoke in parables so those with 'ears to hear' would understand.",
        parables: [
          { name: "The Prodigal Son", ref: "Luke 15:11-32", theme: "God's extravagant grace and forgiveness" },
          { name: "The Good Samaritan", ref: "Luke 10:25-37", theme: "Who is my neighbor — love in action" },
          { name: "The Lost Sheep", ref: "Luke 15:3-7", theme: "God's relentless pursuit of one lost person" },
          { name: "The Sower and the Seed", ref: "Matthew 13:1-23", theme: "Four types of heart responses to the Word" },
          { name: "The Mustard Seed", ref: "Matthew 13:31-32", theme: "The Kingdom starts small but grows enormous" },
          { name: "The Pearl of Great Price", ref: "Matthew 13:45-46", theme: "The Kingdom is worth everything" },
          { name: "The Talents", ref: "Matthew 25:14-30", theme: "Faithfulness with what God entrusts to us" },
          { name: "The Ten Virgins", ref: "Matthew 25:1-13", theme: "Readiness for Christ's return" },
          { name: "The Unforgiving Servant", ref: "Matthew 18:21-35", theme: "Forgiving others as we have been forgiven" },
          { name: "The Rich Man and Lazarus", ref: "Luke 16:19-31", theme: "Eternal consequences; compassion for the poor" },
          { name: "The Pharisee and the Tax Collector", ref: "Luke 18:9-14", theme: "Pride vs. humility in prayer" },
          { name: "The Prodigal Son", ref: "Luke 15:11-32", theme: "Restoration, grace, and a father's love" },
          { name: "The Two Sons", ref: "Matthew 21:28-32", theme: "Obedience vs. lip service" },
          { name: "The Wedding Banquet", ref: "Matthew 22:1-14", theme: "Many are called, few are chosen" },
          { name: "The Net", ref: "Matthew 13:47-50", theme: "Final judgment separates the righteous from the wicked" },
          { name: "The Shrewd Manager", ref: "Luke 16:1-13", theme: "Wisdom in stewardship; you cannot serve God and money" },
          { name: "The Vine and Branches", ref: "John 15:1-17", theme: "Abiding in Christ as the source of all fruitfulness" }
        ]
      },
      {
        id: "identity",
        label: "The 'I AM' Statements",
        summary: "In the Gospel of John, Jesus makes seven profound 'I AM' (Greek: egō eimi) declarations. The phrase echoes God's name revealed to Moses in Exodus 3:14. Each statement reveals a distinct aspect of who Jesus is and what He provides.",
        statements: [
          { statement: "I AM the Bread of Life", ref: "John 6:35", meaning: "Jesus satisfies the deepest hunger of the human soul" },
          { statement: "I AM the Light of the World", ref: "John 8:12", meaning: "Jesus dispels spiritual darkness and guides our path" },
          { statement: "I AM the Door (Gate) of the sheep", ref: "John 10:9", meaning: "Salvation comes through Him alone — He is the entry point" },
          { statement: "I AM the Good Shepherd", ref: "John 10:11", meaning: "He knows His sheep, protects them, and lays down His life for them" },
          { statement: "I AM the Resurrection and the Life", ref: "John 11:25", meaning: "He is the source of life — both now and eternally" },
          { statement: "I AM the Way, the Truth, and the Life", ref: "John 14:6", meaning: "The exclusive claim: no one comes to the Father except through Him" },
          { statement: "I AM the True Vine", ref: "John 15:1", meaning: "We only produce fruit when we remain connected to Him" }
        ]
      },
      {
        id: "secondcoming",
        label: "The Second Coming",
        summary: "Jesus taught clearly that He would return — literally, visibly, and with great power and glory. He described signs of the times (Matthew 24-25; Luke 21). He urged readiness: 'Watch therefore, for you do not know the day or the hour' (Matthew 25:13). His return will bring final judgment and the full establishment of God's Kingdom.",
        keyPassages: ["Matthew 24:30-31", "Matthew 25:31-46", "John 14:1-3", "Acts 1:11"]
      },
      {
        id: "eternal-life",
        label: "Eternal Life",
        summary: "Eternal life in Jesus' teaching is not merely future — it begins now. 'This is eternal life: that they know you, the only true God, and Jesus Christ whom you have sent' (John 17:3). He promised resurrection to all — to life for those who have done good, and to condemnation for those who have done evil (John 5:28-29). Heaven and hell are both real in His teaching.",
        keyPassages: ["John 3:16", "John 17:3", "John 5:24-29", "Matthew 25:31-46"]
      }
    ]
  },

  redLetterWords: [
    {
      category: "Salvation & New Birth",
      verses: [
        { ref: "John 3:3", words: "Truly, truly, I say to you, unless one is born again he cannot see the kingdom of God.", strongs: { "born again": "G509 anōthen — from above, from the beginning" } },
        { ref: "John 3:5-7", words: "Truly, truly, I say to you, unless one is born of water and the Spirit, he cannot enter the kingdom of God. That which is born of the flesh is flesh, and that which is born of the Spirit is spirit. Do not marvel that I said to you, 'You must be born again.'" },
        { ref: "John 3:16", words: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life." },
        { ref: "John 3:17-18", words: "For God did not send his Son into the world to condemn the world, but in order that the world might be saved through him. Whoever believes in him is not condemned, but whoever does not believe is condemned already, because he has not believed in the name of the only Son of God." },
        { ref: "John 5:24", words: "Truly, truly, I say to you, whoever hears my word and believes him who sent me has eternal life. He does not come into judgment, but has passed from death to life." },
        { ref: "John 10:9", words: "I am the door. If anyone enters by me, he will be saved and will go in and out and find pasture." },
        { ref: "John 11:25-26", words: "I am the resurrection and the life. Whoever believes in me, though he die, yet shall he live, and everyone who lives and believes in me shall never die. Do you believe this?" },
        { ref: "John 14:6", words: "I am the way, and the truth, and the life. No one comes to the Father except through me." },
        { ref: "Luke 19:10", words: "For the Son of Man came to seek and to save the lost." }
      ]
    },
    {
      category: "The Beatitudes (Matthew 5:3-12)",
      verses: [
        { ref: "Matthew 5:3", words: "Blessed are the poor in spirit, for theirs is the kingdom of heaven." },
        { ref: "Matthew 5:4", words: "Blessed are those who mourn, for they shall be comforted." },
        { ref: "Matthew 5:5", words: "Blessed are the meek, for they shall inherit the earth." },
        { ref: "Matthew 5:6", words: "Blessed are those who hunger and thirst for righteousness, for they shall be satisfied." },
        { ref: "Matthew 5:7", words: "Blessed are the merciful, for they shall receive mercy." },
        { ref: "Matthew 5:8", words: "Blessed are the pure in heart, for they shall see God." },
        { ref: "Matthew 5:9", words: "Blessed are the peacemakers, for they shall be called sons of God." },
        { ref: "Matthew 5:10", words: "Blessed are those who are persecuted for righteousness' sake, for theirs is the kingdom of heaven." },
        { ref: "Matthew 5:11-12", words: "Blessed are you when others revile you and persecute you and utter all kinds of evil against you falsely on my account. Rejoice and be glad, for your reward is great in heaven, for so they persecuted the prophets who were before you." }
      ]
    },
    {
      category: "Love & The Greatest Commands",
      verses: [
        { ref: "Matthew 22:37-40", words: "You shall love the Lord your God with all your heart and with all your soul and with all your mind. This is the great and first commandment. And a second is like it: You shall love your neighbor as yourself. On these two commandments depend all the Law and the Prophets." },
        { ref: "John 13:34-35", words: "A new commandment I give to you, that you love one another: just as I have loved you, you also are to love one another. By this all people will know that you are my disciples, if you have love for one another." },
        { ref: "John 15:12-13", words: "This is my commandment, that you love one another as I have loved you. Greater love has no one than this, that someone lay down his life for his friends." },
        { ref: "Matthew 5:44-45", words: "But I say to you, Love your enemies and pray for those who persecute you, so that you may be sons of your Father who is in heaven." },
        { ref: "Luke 6:27-28", words: "But I say to you who hear, Love your enemies, do good to those who hate you, bless those who curse you, pray for those who abuse you." }
      ]
    },
    {
      category: "Prayer & Faith",
      verses: [
        { ref: "Matthew 6:9-13", words: "Pray then like this: Our Father in heaven, hallowed be your name. Your kingdom come, your will be done, on earth as it is in heaven. Give us this day our daily bread, and forgive us our debts, as we also have forgiven our debtors. And lead us not into temptation, but deliver us from evil." },
        { ref: "Matthew 7:7-8", words: "Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you. For everyone who asks receives, and the one who seeks finds, and to the one who knocks it will be opened." },
        { ref: "Matthew 17:20", words: "For truly, I say to you, if you have faith like a grain of mustard seed, you will say to this mountain, 'Move from here to there,' and it will move, and nothing will be impossible for you." },
        { ref: "Matthew 21:22", words: "And whatever you ask in prayer, you will receive, if you have faith." },
        { ref: "John 16:23-24", words: "Truly, truly, I say to you, whatever you ask of the Father in my name, he will give it to you. Until now you have asked nothing in my name. Ask, and you will receive, that your joy may be full." },
        { ref: "Luke 18:1", words: "He told them a parable to the effect that they ought always to pray and not lose heart." }
      ]
    },
    {
      category: "The Holy Spirit",
      verses: [
        { ref: "John 14:16-17", words: "And I will ask the Father, and he will give you another Helper, to be with you forever, even the Spirit of truth, whom the world cannot receive, because it neither sees him nor knows him. You know him, for he dwells with you and will be in you." },
        { ref: "John 14:26", words: "But the Helper, the Holy Spirit, whom the Father will send in my name, he will teach you all things and bring to your remembrance all that I have said to you." },
        { ref: "John 15:26", words: "But when the Helper comes, whom I will send to you from the Father, the Spirit of truth, who proceeds from the Father, he will bear witness about me." },
        { ref: "John 16:13", words: "When the Spirit of truth comes, he will guide you into all the truth, for he will not speak on his own authority, but whatever he hears he will speak, and he will declare to you the things that are to come." },
        { ref: "Acts 1:8", words: "But you will receive power when the Holy Spirit has come upon you, and you will be my witnesses in Jerusalem and in all Judea and Samaria, and to the end of the earth." }
      ]
    },
    {
      category: "Forgiveness & Mercy",
      verses: [
        { ref: "Matthew 6:14-15", words: "For if you forgive others their trespasses, your heavenly Father will also forgive you, but if you do not forgive others their trespasses, neither will your Father forgive your trespasses." },
        { ref: "Matthew 18:21-22", words: "Then Peter came up and said to him, 'Lord, how often will my brother sin against me, and I forgive him? As many as seven times?' Jesus said to him, 'I do not say to you seven times, but seventy-seven times.'" },
        { ref: "Luke 6:37", words: "Judge not, and you will not be judged; condemn not, and you will not be condemned; forgive, and you will be forgiven." },
        { ref: "Luke 23:34", words: "Father, forgive them, for they know not what they do." },
        { ref: "Mark 11:25", words: "And whenever you stand praying, forgive, if you have anything against anyone, so that your Father also who is in heaven may forgive you your trespasses." }
      ]
    },
    {
      category: "Identity, Worth & Worry",
      verses: [
        { ref: "Matthew 6:25-26", words: "Therefore I tell you, do not be anxious about your life, what you will eat or what you will drink, nor about your body, what you will put on. Is not life more than food, and the body more than clothing? Look at the birds of the air: they neither sow nor reap nor gather into barns, and yet your heavenly Father feeds them. Are you not of more value than they?" },
        { ref: "Matthew 6:33", words: "But seek first the kingdom of God and his righteousness, and all these things will be added to you." },
        { ref: "Matthew 10:29-31", words: "Are not two sparrows sold for a penny? And not one of them will fall to the ground apart from your Father. But even the hairs of your head are all numbered. Fear not, therefore; you are of more value than many sparrows." },
        { ref: "John 10:10", words: "The thief comes only to steal and kill and destroy. I came that they may have life and have it abundantly." },
        { ref: "John 14:27", words: "Peace I leave with you; my peace I give to you. Not as the world gives do I give to you. Let not your hearts be troubled, neither let them be afraid." }
      ]
    },
    {
      category: "Discipleship & The Cost",
      verses: [
        { ref: "Matthew 16:24-25", words: "If anyone would come after me, let him deny himself and take up his cross and follow me. For whoever would save his life will lose it, but whoever loses his life for my sake will find it." },
        { ref: "Luke 9:23", words: "If anyone would come after me, let him deny himself and take up his cross daily and follow me." },
        { ref: "Matthew 28:19-20", words: "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all that I have commanded you. And behold, I am with you always, to the end of the age." },
        { ref: "John 8:31-32", words: "If you abide in my word, you are truly my disciples, and you will know the truth, and the truth will set you free." },
        { ref: "John 15:5", words: "I am the vine; you are the branches. Whoever abides in me and I in him, he it is that bears much fruit, for apart from me you can do nothing." },
        { ref: "Matthew 10:38-39", words: "And whoever does not take his cross and follow me is not worthy of me. Whoever finds his life will lose it, and whoever loses his life for my sake will find it." }
      ]
    },
    {
      category: "The Second Coming",
      verses: [
        { ref: "Matthew 24:30-31", words: "Then will appear in heaven the sign of the Son of Man, and then all the tribes of the earth will mourn, and they will see the Son of Man coming on the clouds of heaven with power and great glory. And he will send out his angels with a loud trumpet call, and they will gather his elect from the four winds, from one end of heaven to the other." },
        { ref: "Matthew 25:13", words: "Watch therefore, for you know neither the day nor the hour." },
        { ref: "John 14:1-3", words: "Let not your hearts be troubled. Believe in God; believe also in me. In my Father's house are many rooms. If it were not so, would I have told you that I go to prepare a place for you? And if I go and prepare a place for you, I will come again and will take you to myself, that where I am you may be also." },
        { ref: "Revelation 22:20", words: "Surely I am coming soon." }
      ]
    },
    {
      category: "From the Cross",
      verses: [
        { ref: "Luke 23:34", words: "Father, forgive them, for they know not what they do." },
        { ref: "Luke 23:43", words: "Truly, I say to you, today you will be with me in paradise." },
        { ref: "John 19:26-27", words: "Woman, behold, your son! ...Behold, your mother!" },
        { ref: "Matthew 27:46", words: "My God, my God, why have you forsaken me?" },
        { ref: "John 19:28", words: "I thirst." },
        { ref: "John 19:30", words: "It is finished." },
        { ref: "Luke 23:46", words: "Father, into your hands I commit my spirit!" }
      ]
    }
  ],

  crossReferences: [
    { topic: "Jesus as the fulfillment of the Law", refs: ["Matthew 5:17", "Romans 10:4", "Galatians 3:24-25", "Hebrews 8:13"] },
    { topic: "Jesus as High Priest", refs: ["Hebrews 4:14-16", "Hebrews 7:23-28", "1 Timothy 2:5", "Romans 8:34"] },
    { topic: "Jesus as the Lamb of God", refs: ["John 1:29", "Isaiah 53:7", "Revelation 5:6", "1 Peter 1:19"] },
    { topic: "Jesus' pre-existence", refs: ["John 1:1-3", "John 8:58", "Colossians 1:15-17", "Hebrews 1:1-3", "Micah 5:2"] },
    { topic: "Jesus' divinity", refs: ["John 10:30", "John 20:28", "Philippians 2:6", "Colossians 2:9", "Titus 2:13"] },
    { topic: "Jesus as the only way", refs: ["John 14:6", "Acts 4:12", "1 Timothy 2:5", "1 John 5:12"] },
    { topic: "The Resurrection", refs: ["1 Corinthians 15:3-8", "Romans 1:4", "Acts 2:24", "Matthew 28:5-7"] },
    { topic: "Jesus' return", refs: ["1 Thessalonians 4:16-17", "Revelation 19:11-16", "Acts 1:11", "Matthew 24:30"] }
  ],

  strongsKeyTerms: [
    { term: "Christ (Christos)", strongs: "G5547", definition: "Anointed one; the Greek equivalent of the Hebrew Mashiach (Messiah)" },
    { term: "Lord (Kyrios)", strongs: "G2962", definition: "Lord, Master, Owner; the word used to translate YHWH (God's personal name) in the Greek OT (LXX)" },
    { term: "Son (Huios)", strongs: "G5207", definition: "Son; used in 'Son of God' (divine nature) and 'Son of Man' (humanity/messianic title)" },
    { term: "Savior (Sōtēr)", strongs: "G4990", definition: "Savior, Deliverer, Preserver — one who rescues from danger and ruin" },
    { term: "Gospel (Euangelion)", strongs: "G2098", definition: "Good news, glad tidings; specifically the good news of Jesus Christ" },
    { term: "Grace (Charis)", strongs: "G5485", definition: "Grace, favor, the divine influence on the heart and its reflection in the life" },
    { term: "Faith (Pistis)", strongs: "G4102", definition: "Faith, belief, trust; the conviction of truth; moral conviction of religious truth" },
    { term: "Repent (Metanoeō)", strongs: "G3340", definition: "To change one's mind and purpose; to feel remorse and turn in a new direction" },
    { term: "Atonement (Hilasmos)", strongs: "G2434", definition: "Propitiation; an appeasing sacrifice that satisfies divine wrath against sin" },
    { term: "Resurrection (Anastasis)", strongs: "G386", definition: "A standing up again; the resurrection of the dead" },
    { term: "Kingdom (Basileia)", strongs: "G932", definition: "Royalty, rule, realm; the kingdom of God/heaven — God's reign and domain" },
    { term: "Holy Spirit (Pneuma Hagion)", strongs: "G4151 + G40", definition: "The Holy Spirit; pneuma = breath/spirit; hagion = holy, set apart" },
    { term: "Eternal Life (Zōē Aiōnios)", strongs: "G2222 + G166", definition: "Life of the age to come; the God-kind of life; both quality and duration" },
    { term: "Born Again (Anōthen)", strongs: "G509", definition: "From above, from the beginning; translated 'again' or 'from above' — both meanings apply" },
    { term: "Baptism (Baptisma)", strongs: "G908", definition: "Immersion, submersion; from baptizō (G907) — to dip, plunge, submerge" }
  ]
};
