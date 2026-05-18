// app/js/bible-study-data.js
// YourLife CC — Bible Study Hub curriculum topics
// DO NOT DELETE — used by faith.js bibleStudy tab
// DO NOT ADD export — this codebase has no ES modules. Globals only.

window.BIBLE_STUDY_TRACKS = {
  family: {
    icon: '🏡',
    label: 'Family Study',
    badge: 'Ages 6–18',
    duration: '30 min',
    description: 'Parent-led studies the whole family can do together',
    topics: [
      'Faith & Trust in God', 'Prayer as a Family', 'Forgiveness & Grace',
      "God's Love for Us", 'Courage & Fear', 'Gratitude & Contentment',
      'Honesty & Integrity', 'Serving Others', 'Identity in Christ',
      'The Armor of God', 'Creation & Wonder', 'Jesus as Our Friend',
      'Handling Conflict', 'Money & Generosity', 'The Fruit of the Spirit',
      'Sabbath & Rest', 'Community & Belonging', 'Hope in Hard Times',
      'Obeying God (Even When Hard)', "God's Purpose for Our Family"
    ]
  },
  group: {
    icon: '🙏',
    label: 'Small Group',
    badge: 'Adults',
    duration: '45 min',
    description: 'Deep-dive studies for adult small groups and house churches',
    topics: [
      'Overcoming Anxiety', 'Purpose & Calling', 'Marriage & Relationships',
      'Accountability & Discipleship', 'Spiritual Disciplines', 'Stewardship & Finances',
      'Healing & Restoration', 'Bold Witness', 'Community & Fellowship',
      'The Holy Spirit', 'Spiritual Warfare', 'Kingdom Values',
      'Suffering & Sovereignty', 'Grace vs. Works', 'Racial Reconciliation',
      'Sabbath & Margin', 'Doubt & Faith', 'Sexual Integrity',
      "God's Justice", 'The Great Commission'
    ]
  },
  kids: {
    icon: '⭐',
    label: 'Kids Corner',
    badge: 'Ages 4–12',
    duration: '20 min',
    description: 'Fun, age-appropriate lessons with crafts and games',
    topics: [
      'God Made Me Special', 'Jesus Loves Me', 'Being Kind Like Jesus',
      'Trusting God When Scared', 'Saying Sorry & Forgiveness', 'Helping Others',
      'Being Thankful', 'Listening to God', 'Telling the Truth',
      'The Good Shepherd', "Noah's Ark & God's Promises", 'David & Goliath',
      'Daniel & the Lions Den', 'Zacchaeus (God Loves Everyone)', 'The Lost Sheep',
      'Jonah (Second Chances)', 'Esther (Brave for God)', 'The Fruit of the Spirit',
      'The Lord Is My Shepherd', "Jesus' Birth Story"
    ]
  },
  teens: {
    icon: '🔥',
    label: 'Teen Devotional',
    badge: 'Ages 13–19',
    duration: '30 min',
    description: 'Real-talk studies for youth groups and teen self-study',
    topics: [
      'Identity & Self-Worth', 'Peer Pressure & Integrity', 'Dating & Purity',
      'Social Media & Real Life', 'Dealing with Anxiety', 'Purpose & Future',
      'Forgiveness (Giving & Receiving)', 'Friendship & Loyalty', 'Mental Health & Hope',
      "Standing Up for What's Right", "God's Plan vs. My Plan", 'Worship in Everyday Life',
      'Addiction & Freedom', 'Grief & Loss', 'Comparison & Envy',
      'Sexual Identity & the Bible', 'Racism & Justice', 'Money Mindset',
      'The Hard Questions (Doubt)', 'Leadership & Influence'
    ]
  }
};

window.SERIES_PLANS = {
  'New Believers':   ['Faith & Trust in God', "God's Love for Us", 'Prayer as a Family', 'Identity in Christ'],
  'Summer Family':   ['Creation & Wonder', 'Gratitude & Contentment', 'Serving Others', 'Community & Belonging'],
  'Back to School':  ['Courage & Fear', 'Peer Pressure & Integrity', 'Identity & Self-Worth', 'Purpose & Future'],
  'Advent Series':   ["Jesus' Birth Story", "God's Love for Us", 'Hope in Hard Times', 'Worship in Everyday Life']
};
