// YourLife CC — Christian Podcasts Data
// Curated list of top Christian podcasters across categories
// All links verified as of 2025

const CHRISTIAN_PODCASTS = [
  {
    category: "Bible Study & Theology",
    icon: "📖",
    podcasts: [
      {
        id: "bible-project",
        name: "The Bible Project Podcast",
        host: "Tim Mackie & Jon Collins",
        description: "Deep, academic, and incredibly engaging deep dives into biblical themes, books, and Hebrew concepts. One of the most educational resources available — free.",
        tags: ["theology", "Old Testament", "Hebrew", "visual", "beginner-friendly"],
        listenLink: "https://bibleproject.com/podcasts/the-bible-project-podcast/",
        appleLink: "https://podcasts.apple.com/us/podcast/the-bible-project/id1113933177",
        spotifyLink: "https://open.spotify.com/show/1r9ycv4eTTpnlasv7prw1F",
        frequency: "Weekly",
        rating: 5
      },
      {
        id: "ask-pastor-john",
        name: "Ask Pastor John",
        host: "John Piper (Desiring God)",
        description: "Hundreds of Q&A episodes on every imaginable theological question. Reformed, evangelical, and deeply rooted in Scripture. Essential for serious Bible students.",
        tags: ["Reformed", "theology", "Q&A", "Reformed Baptist"],
        listenLink: "https://www.desiringgod.org/ask-pastor-john",
        appleLink: "https://podcasts.apple.com/us/podcast/ask-pastor-john/id551066885",
        spotifyLink: "https://open.spotify.com/show/4vFIKJrFfxuFIVQgqOaYxs",
        frequency: "Weekdays",
        rating: 5
      },
      {
        id: "rc-sproul",
        name: "Renewing Your Mind with R.C. Sproul",
        host: "R.C. Sproul / Ligonier Ministries",
        description: "Daily messages from one of the 20th century's greatest Reformed theologians. Classic teaching on holiness, the character of God, and systematic theology.",
        tags: ["Reformed", "systematic theology", "classic", "Presbyterian"],
        listenLink: "https://www.ligonier.org/podcasts/renewing-your-mind",
        appleLink: "https://podcasts.apple.com/us/podcast/renewing-your-mind-with-r-c-sproul/id110916880",
        spotifyLink: "https://open.spotify.com/show/3CJhsm1wEMRpGl2vmJj4qN",
        frequency: "Daily",
        rating: 5
      },
      {
        id: "bible-recap",
        name: "The Bible Recap",
        host: "Tara-Leigh Cobble",
        description: "Read the Bible in a year — and understand it. Warm, relatable daily summaries with the 'God Shot' — one thing that shows God's character every day. Perfect for teens and adults.",
        tags: ["Bible in a year", "daily", "beginner", "warm", "all ages"],
        listenLink: "https://thebiblerecap.com/",
        appleLink: "https://podcasts.apple.com/us/podcast/the-bible-recap/id1468262979",
        spotifyLink: "https://open.spotify.com/show/14y2PKlvRbQNbFwrjhiYXi",
        frequency: "Daily",
        rating: 5
      },
      {
        id: "nt-wright",
        name: "NTWrightOnline",
        host: "N.T. Wright",
        description: "One of the world's leading New Testament scholars. Deep dives into Paul, the Gospels, and the Jewish context of the New Testament. Academic but accessible.",
        tags: ["New Testament", "academic", "Anglican", "Paul"],
        listenLink: "https://www.ntwrightonline.org/",
        appleLink: "https://podcasts.apple.com/us/podcast/ntwright-online-podcast/id1092513433",
        frequency: "Occasional",
        rating: 5
      }
    ]
  },
  {
    category: "Preaching & Sermons",
    icon: "🎙️",
    podcasts: [
      {
        id: "john-macarthur",
        name: "Grace to You — John MacArthur",
        host: "John MacArthur",
        description: "Verse-by-verse expository preaching through entire books of the Bible. Conservative evangelical, Reformed, and deeply scriptural. Decades of archive available free.",
        tags: ["expository", "Reformed", "conservative", "verse-by-verse"],
        listenLink: "https://www.gty.org/",
        appleLink: "https://podcasts.apple.com/us/podcast/grace-to-you/id110903030",
        spotifyLink: "https://open.spotify.com/show/4Ah8GZnCQFZGm9K0Ux3V5T",
        frequency: "Daily",
        rating: 5
      },
      {
        id: "elevation-church",
        name: "Elevation Church with Steven Furtick",
        host: "Steven Furtick",
        description: "Dynamic, passionate preaching with a strong emphasis on identity in Christ, faith, and practical application. One of the most listened-to pastors in America.",
        tags: ["contemporary", "charismatic", "identity", "practical", "non-denom"],
        listenLink: "https://elevationchurch.org/sermons/",
        appleLink: "https://podcasts.apple.com/us/podcast/steven-furtick/id348330283",
        spotifyLink: "https://open.spotify.com/show/2R7KNFNXvgJbLmLZNNXcAz",
        frequency: "Weekly",
        rating: 4
      },
      {
        id: "rick-warren",
        name: "Daily Hope with Rick Warren",
        host: "Rick Warren",
        description: "Practical, encouraging daily devotionals and teaching from the author of The Purpose Driven Life. Accessible for all ages and backgrounds.",
        tags: ["devotional", "practical", "purpose driven", "daily", "non-denom"],
        listenLink: "https://pastorrick.com/daily-hope-podcast/",
        appleLink: "https://podcasts.apple.com/us/podcast/daily-hope-with-rick-warren/id1067849547",
        frequency: "Daily",
        rating: 4
      },
      {
        id: "andy-stanley",
        name: "Your Move with Andy Stanley",
        host: "Andy Stanley",
        description: "Culturally engaging, thoughtful preaching that meets people where they are. Known for brilliant communication and addressing faith and doubt honestly.",
        tags: ["contemporary", "non-denom", "cultural engagement", "practical"],
        listenLink: "https://northpoint.org/messages",
        appleLink: "https://podcasts.apple.com/us/podcast/your-move-with-andy-stanley/id342557536",
        spotifyLink: "https://open.spotify.com/show/5p0zCRBOqIWmNHk5uQKwTh",
        frequency: "Weekly",
        rating: 4
      },
      {
        id: "mark-batterson",
        name: "National Community Church with Mark Batterson",
        host: "Mark Batterson",
        description: "Author of The Circle Maker and In a Pit with a Lion on a Snowy Day. Faith-focused, bold, and creatively presented. Washington DC-based church with a unique culture.",
        tags: ["faith", "prayer", "creativity", "Assemblies of God"],
        listenLink: "https://theaterchurch.com/podcasts/",
        appleLink: "https://podcasts.apple.com/us/podcast/national-community-church-podcast/id191178782",
        frequency: "Weekly",
        rating: 4
      }
    ]
  },
  {
    category: "Faith for Teens & Young Adults",
    icon: "🌟",
    podcasts: [
      {
        id: "louie-giglio",
        name: "Passion City Church",
        host: "Louie Giglio",
        description: "Inspirational, visually driven, passion-focused teaching for the next generation. Giglio is a master communicator who reaches young people powerfully.",
        tags: ["youth", "college", "inspiring", "Passion Conferences", "non-denom"],
        listenLink: "https://passioncitychurch.com/sermons/",
        appleLink: "https://podcasts.apple.com/us/podcast/passion-city-church/id288065985",
        frequency: "Weekly",
        rating: 5
      },
      {
        id: "francis-chan",
        name: "Francis Chan",
        host: "Francis Chan",
        description: "Radical discipleship, simplicity, and serious Christianity. Chan challenges comfortable Christianity and calls young believers to an all-in faith. One of the most authentic voices in the church.",
        tags: ["discipleship", "radical", "authentic", "non-denom", "teens"],
        listenLink: "https://www.francischan.org/",
        appleLink: "https://podcasts.apple.com/us/podcast/francis-chan/id265638668",
        frequency: "Occasional",
        rating: 5
      },
      {
        id: "the-porch",
        name: "The Porch — Watermark Community Church",
        host: "Various (JP Pokluda, Todd Wagner)",
        description: "Specifically designed for young adults ages 18–29. Addresses real issues: sex, relationships, identity, purpose, and faith. One of the largest young adult gatherings in America.",
        tags: ["young adults", "18-29", "relationships", "identity", "practical"],
        listenLink: "https://theporch.live/",
        appleLink: "https://podcasts.apple.com/us/podcast/the-porch-podcast/id339601890",
        spotifyLink: "https://open.spotify.com/show/0wqJIgRxcQ8wWqjFRJUJUb",
        frequency: "Weekly",
        rating: 5
      },
      {
        id: "chosen-girls",
        name: "Grit and Grace — The Balanced Life",
        host: "Robin Long",
        description: "Faith, wellness, and purpose for young Christian women. Practical and encouraging.",
        tags: ["women", "teens", "faith", "wellness", "purpose"],
        listenLink: "https://thebalancedlifeonline.com/podcast/",
        frequency: "Weekly",
        rating: 4
      }
    ]
  },
  {
    category: "Prayer & Spiritual Life",
    icon: "🙏",
    podcasts: [
      {
        id: "pray-first",
        name: "Pray First with Chris Hodges",
        host: "Chris Hodges",
        description: "Teaching-focused podcast from the founder of Church of the Highlands (Alabama). Covers prayer, fasting, and walking in the Spirit daily.",
        tags: ["prayer", "fasting", "Holy Spirit", "practical", "ARC"],
        listenLink: "https://chrishodges.com/podcast/",
        appleLink: "https://podcasts.apple.com/us/podcast/pray-first-with-chris-hodges/id1457946893",
        frequency: "Weekly",
        rating: 4
      },
      {
        id: "rtm-prayer",
        name: "Intercessors for America",
        host: "Various",
        description: "Prayer-focused podcast encouraging Christians to intercede for the nation, communities, and the church. Deep prayer culture.",
        tags: ["intercession", "prayer", "nation", "spiritual warfare"],
        listenLink: "https://ifapray.org/podcast/",
        frequency: "Weekly",
        rating: 4
      },
      {
        id: "sadie-robertson",
        name: "WHOA That's Good Podcast",
        host: "Sadie Robertson Huff",
        description: "Warm, faith-filled conversations with notable Christians and leaders. Known for the signature closing question: 'What is the best advice you've ever been given?' Perfect for teen girls and young women.",
        tags: ["teens", "women", "faith", "encouragement", "interviews", "non-denom"],
        listenLink: "https://sadierobertsonhuff.com/podcast/",
        appleLink: "https://podcasts.apple.com/us/podcast/whoa-thats-good-podcast/id1451547898",
        spotifyLink: "https://open.spotify.com/show/3tnFkOJlF47bZ7mTOCd1qj",
        frequency: "Weekly",
        rating: 5
      },
      {
        id: "priscilla-shirer",
        name: "Going Beyond Ministries with Priscilla Shirer",
        host: "Priscilla Shirer",
        description: "Priscilla is a powerhouse Bible teacher and author (Armor of God, Fervent). Deep, practical, Spirit-led teaching particularly beloved by Christian women and teens.",
        tags: ["women", "Bible study", "prayer", "spiritual warfare", "teens"],
        listenLink: "https://www.goingbeyond.com/podcast/",
        appleLink: "https://podcasts.apple.com/us/podcast/going-beyond-ministries-with-priscilla-shirer/id1041168060",
        frequency: "Monthly",
        rating: 5
      }
    ]
  },
  {
    category: "Apologetics & Faith & Science",
    icon: "🔬",
    podcasts: [
      {
        id: "sean-mcdowell",
        name: "Think Biblically — Sean McDowell & Scott Rae",
        host: "Sean McDowell & Scott Rao",
        description: "Cultural engagement, apologetics, and worldview analysis. Great for teens asking hard questions about faith, science, ethics, and culture.",
        tags: ["apologetics", "worldview", "culture", "teens", "ethics"],
        listenLink: "https://www.biola.edu/talbot/ce/thinkbiblically",
        appleLink: "https://podcasts.apple.com/us/podcast/think-biblically/id1285141396",
        spotifyLink: "https://open.spotify.com/show/5p7lmHOT3kEp36WTpS1VY6",
        frequency: "Weekly",
        rating: 5
      },
      {
        id: "unbelievable",
        name: "Unbelievable? — Premier Christian Radio",
        host: "Justin Brierley",
        description: "Fascinating debates and conversations between Christians and atheists, skeptics, and different faith traditions. Excellent for understanding other worldviews.",
        tags: ["apologetics", "debate", "atheism", "dialogue", "British"],
        listenLink: "https://premierchristianradio.com/Shows/Saturday/Unbelievable",
        appleLink: "https://podcasts.apple.com/us/podcast/unbelievable/id267142101",
        frequency: "Weekly",
        rating: 5
      },
      {
        id: "crossexamined",
        name: "Cross Examined with Frank Turek",
        host: "Frank Turek",
        description: "Hard-hitting Christian apologetics. 'I Don't Have Enough Faith to Be an Atheist' author takes on tough objections to Christianity head-on.",
        tags: ["apologetics", "evidence", "atheism", "conservative", "debate"],
        listenLink: "https://crossexamined.org/podcast/",
        appleLink: "https://podcasts.apple.com/us/podcast/i-dont-have-enough-faith-to-be-an-atheist-podcast/id551437694",
        frequency: "Weekly",
        rating: 4
      }
    ]
  },
  {
    category: "Worship & Music",
    icon: "🎵",
    podcasts: [
      {
        id: "hillsong-channel",
        name: "Hillsong Channel Podcast",
        host: "Various Hillsong Pastors",
        description: "Teaching from the global Hillsong network. Mix of theology, church leadership, and worship culture. Home of Hillsong United and Hillsong Worship music.",
        tags: ["worship", "Pentecostal", "contemporary", "global", "charismatic"],
        listenLink: "https://hillsong.com/channel/",
        appleLink: "https://podcasts.apple.com/us/podcast/hillsong-channel-podcast/id1218499462",
        frequency: "Weekly",
        rating: 4
      },
      {
        id: "bethel-sermons",
        name: "Bethel Church Sermons",
        host: "Bill Johnson & team",
        description: "Charismatic, prophetic, healing-focused teaching from Redding, CA. Home of Bethel Music. Emphasis on supernatural Christianity and revival.",
        tags: ["charismatic", "healing", "prophetic", "worship", "Bethel Music"],
        listenLink: "https://bethel.tv/podcast",
        appleLink: "https://podcasts.apple.com/us/podcast/bethel-church-sermons/id378264045",
        frequency: "Weekly",
        rating: 4
      }
    ]
  },
  {
    category: "Recovery & Wholeness",
    icon: "💪",
    podcasts: [
      {
        id: "celebrate-recovery",
        name: "Celebrate Recovery Podcast",
        host: "Various CR Leaders",
        description: "Christ-centered recovery from addiction, trauma, and life's hurts, habits, and hang-ups. Based on the 8 recovery principles from the Beatitudes.",
        tags: ["addiction", "recovery", "trauma", "12-step", "Christ-centered"],
        listenLink: "https://www.celebraterecovery.com/resources/podcast",
        appleLink: "https://podcasts.apple.com/us/podcast/celebrate-recovery-podcast/id1361444861",
        frequency: "Weekly",
        rating: 5
      },
      {
        id: "joyce-meyer",
        name: "Enjoying Everyday Life — Joyce Meyer",
        host: "Joyce Meyer",
        description: "Practical, straight-talking teaching on emotional healing, overcoming the past, and living victoriously. Joyce is one of the most practical voices in Christianity.",
        tags: ["practical", "healing", "emotional health", "Charismatic", "women"],
        listenLink: "https://joycemeyer.org/everydayanswers/podcast/",
        appleLink: "https://podcasts.apple.com/us/podcast/enjoying-everyday-life-radio-audio/id273218820",
        frequency: "Daily",
        rating: 4
      }
    ]
  }
];
