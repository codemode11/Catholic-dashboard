export interface PatristicVoice {
  father: string;
  work: string;
  excerpt: string;
}

export interface DailyLiturgicalPackage {
  dateIso: string;
  formattedDate: string;
  liturgicalTitle: string;
  season: string;
  rank: string;
  color: 'Green' | 'White' | 'Red' | 'Violet' | 'Rose';
  cycle: string;
  rosaryMystery: {
    name: string;
    LatinName: string;
    fruits: string[];
    meditation: string;
  };
  saint: {
    name: string;
    title: string;
    dates: string;
    patronage: string;
    biography: string;
    collectPrayer: string;
    quote: string;
  };
  readings: {
    firstReading: {
      citation: string;
      subtitle: string;
      text: string;
    };
    psalm: {
      citation: string;
      response: string;
      verses: string[];
    };
    alleluia: {
      citation: string;
      verse: string;
    };
    gospel: {
      citation: string;
      subtitle: string;
      text: string;
    };
  };
  gospelCommentary: {
    title: string;
    historicalContext: string;
    exegesis: string;
    patristicVoices: PatristicVoice[];
    homily: string;
    lectioPrompts: string[];
  };
  magisteriumBriefing: {
    headline: string;
    summary: string;
    catechismRef: string;
    encyclicalRef: string;
  };
}

export interface IndulgenceEvent {
  id: string;
  title: string;
  latinTitle: string;
  dateLabel: string;
  monthDayMatch?: string[]; // e.g., ['11-01', '11-02'] or 'DAILY'
  grantType: 'Plenary Indulgence' | 'Partial Indulgence';
  enchiridionRef: string;
  requirements: string[];
  description: string;
  normConditions: string;
}

export interface CatholicProphecy {
  id: string;
  seer: string;
  title: string;
  epoch: string;
  location: string;
  approvalStatus: string;
  theme: 'Marian Apparition' | 'Papal & Ecclesial' | 'Eschatological Renewal' | 'Eucharistic Triumph';
  excerpt: string;
  historicalContext: string;
  spiritualApplication: string;
}

export interface MagisteriumNewsItem {
  id: string;
  category: string;
  headline: string;
  publishedRelative: string;
  catechismRef: string;
  sourceDoc: string;
  summary: string;
  doctrinalSynthesis: string;
}

export interface CatholicArticle {
  id: string;
  source: 'Word on Fire' | 'Aleteia' | 'Sign.org';
  title: string;
  author: string;
  authorRole: string;
  readTime: string;
  topic: string;
  summary: string;
  fullText: string[];
  keyTakeaway: string;
}

export interface BibleFlashcard {
  id: string;
  reference: string;
  category: 'Eucharist' | 'Christology' | 'Ecclesiology' | 'Marian Dogma' | 'Moral Life' | 'Interior Prayer';
  englishText: string;
  latinVulgate: string;
  catecheticalNote: string;
  catechismParagraph: string;
}

export interface PrayerChecklistItem {
  id: string;
  title: string;
  latinTitle: string;
  timeOfDay: 'Morning' | 'Midday' | 'Afternoon' | 'Evening' | 'Anytime';
  durationMinutes: number;
  custom?: boolean;
}

export interface PrayerAlarmItem {
  id: string;
  time24: string; // "06:00"
  title: string;
  latinAntiphon: string;
  prayerText: string;
  enabled: boolean;
}

export const ROSARY_MYSTERIES_BY_DAY: Record<
  number,
  { name: string; LatinName: string; fruits: string[]; meditation: string }
> = {
  0: {
    name: 'The Glorious Mysteries',
    LatinName: 'Mysteria Gloriosa',
    fruits: [
      '1. The Resurrection — Faith',
      '2. The Ascension — Hope & Desire for Heaven',
      '3. The Descent of the Holy Spirit — Wisdom & Love of God',
      '4. The Assumption of the Blessed Virgin Mary — Grace of a Happy Death',
      '5. The Coronation of Our Lady — Trust in Mary’s Intercession',
    ],
    meditation:
      'On Sundays we contemplate the triumph of the Risen Christ and the participation of the Blessed Virgin Mary in the glory of the New Creation.',
  },
  1: {
    name: 'The Joyful Mysteries',
    LatinName: 'Mysteria Gaudiosa',
    fruits: [
      '1. The Annunciation — Humility',
      '2. The Visitation — Love of Neighbor',
      '3. The Nativity of Our Lord — Poverty of Spirit',
      '4. The Presentation in the Temple — Obedience & Purity',
      '5. The Finding of the Child Jesus in the Temple — Joy in Finding Jesus',
    ],
    meditation:
      'On Mondays we enter the hidden life of Nazareth, contemplating the Word made flesh and the fiat of Mary.',
  },
  2: {
    name: 'The Sorrowful Mysteries',
    LatinName: 'Mysteria Dolorosa',
    fruits: [
      '1. The Agony in the Garden — Contrition for Sin',
      '2. The Scourging at the Pillar — Mortification of the Senses',
      '3. The Crowning with Thorns — Interior Humility',
      '4. The Carrying of the Cross — Patience in Trial',
      '5. The Crucifixion and Death of Our Lord — Perseverance & Love of Enemies',
    ],
    meditation:
      'On Tuesdays we keep watch with Christ in His Passion, learning the price of our redemption.',
  },
  3: {
    name: 'The Glorious Mysteries',
    LatinName: 'Mysteria Gloriosa',
    fruits: [
      '1. The Resurrection — Faith',
      '2. The Ascension — Christian Hope',
      '3. The Descent of the Holy Spirit — Apostolic Zeal',
      '4. The Assumption — Union with Christ',
      '5. The Coronation of Mary — Perseverance',
    ],
    meditation:
      'On Wednesdays we lift our hearts to the heavenly Jerusalem and the outpouring of the Paraclete.',
  },
  4: {
    name: 'The Luminous Mysteries',
    LatinName: 'Mysteria Luminosa',
    fruits: [
      '1. The Baptism in the Jordan — Openness to the Holy Spirit',
      '2. The Wedding Feast at Cana — To Jesus through Mary',
      '3. The Proclamation of the Kingdom — Repentance & Trust in God',
      '4. The Transfiguration — Desire for Holiness',
      '5. The Institution of the Holy Eucharist — Adoration & Eucharistic Gratitude',
    ],
    meditation:
      'On Thursdays we behold Christ the Light of the World in His public ministry and the gift of the Most Blessed Sacrament.',
  },
  5: {
    name: 'The Sorrowful Mysteries',
    LatinName: 'Mysteria Dolorosa',
    fruits: [
      '1. The Agony in the Garden — Conformity to the Father’s Will',
      '2. The Scourging at the Pillar — Purity of Body and Soul',
      '3. The Crowning with Thorns — Moral Courage',
      '4. The Carrying of the Cross — Self-Denial',
      '5. The Crucifixion — Forgiveness & Salvation of Souls',
    ],
    meditation:
      'On Fridays, the day of the Lord’s Passion, we stand beneath the Cross on Calvary alongside the Mother of Sorrows.',
  },
  6: {
    name: 'The Joyful Mysteries',
    LatinName: 'Mysteria Gaudiosa',
    fruits: [
      '1. The Annunciation — Marian Humility',
      '2. The Visitation — Fraternal Charity',
      '3. The Nativity — Detachment from the World',
      '4. The Presentation — Fidelity to Vows',
      '5. The Finding in the Temple — True Devotion to Mary',
    ],
    meditation:
      'On Saturdays, traditionally dedicated to the Blessed Virgin Mary, we meditate on the dawn of our salvation.',
  },
};

const CURATED_DAILY_PACKAGES: Record<string, Omit<DailyLiturgicalPackage, 'dateIso' | 'formattedDate' | 'rosaryMystery'>> = {
  '10-29': {
    liturgicalTitle: 'Thursday of the Thirtieth Week in Ordinary Time',
    season: 'Ordinary Time',
    rank: 'Ferial Day · Optional Memorial of St. Narcissus of Jerusalem',
    color: 'Green',
    cycle: 'Year B · Weekday Cycle II',
    saint: {
      name: 'St. Narcissus of Jerusalem & Bl. Chiara Luce Badano',
      title: 'Bishop and Confessor · Virgin of the Focolare Movement',
      dates: 'c. 99 – c. 216 AD · 1971–1990',
      patronage: 'Jerusalem, Falsely Accused, Youth and Athletes',
      biography:
        'St. Narcissus became Bishop of Jerusalem in his eighties and governed the Mother Church with apostolic holiness, famously turning water into oil for the Easter vigil lamps when the deacons ran short. Alongside him in modern memory stands Blessed Chiara Luce Badano, an Italian teenager who offered her painful osteosarcoma to Jesus with radiant joy: "If You want it, Jesus, so do I."',
      collectPrayer:
        'Almighty and ever-living God, increase our faith, hope, and charity, and make us love what You command, so that we may merit what You promise. Through our Lord Jesus Christ, Your Son, who lives and reigns with You in the unity of the Holy Spirit, God, for ever and ever. Amen.',
      quote: 'I have nothing left, but I still have my heart, and with that I can always love. — Bl. Chiara Luce Badano',
    },
    readings: {
      firstReading: {
        citation: 'Ephesians 6:10–20',
        subtitle: 'Put on the whole armor of God, that you may be able to stand.',
        text: 'Brethren: Be strong in the Lord and in the strength of his might. Put on the whole armor of God, that you may be able to stand against the wiles of the devil. For we are not contending against flesh and blood, but against the principalities, against the powers, against the world rulers of this present darkness, against the spiritual hosts of wickedness in the heavenly places. Therefore take the whole armor of God, that you may be able to withstand in the evil day, and having done all, to stand.',
      },
      psalm: {
        citation: 'Psalm 144:1b, 2, 9–10',
        response: 'Blessed be the Lord, my Rock!',
        verses: [
          'Blessed be the Lord, my rock, who trains my hands for war, and my fingers for battle.',
          'He is my steadfast love and my fortress, my stronghold and my deliverer, my shield and he in whom I take refuge.',
          'I will sing a new song to you, O God; upon a ten-stringed harp I will play to you, who gives victory to kings.',
        ],
      },
      alleluia: {
        citation: 'Luke 19:38; 2:14',
        verse: 'Blessed is the king who comes in the name of the Lord! Peace in heaven and glory in the highest!',
      },
      gospel: {
        citation: 'Luke 13:31–35',
        subtitle: 'It cannot be that a prophet should perish away from Jerusalem.',
        text: 'At that very hour some Pharisees came, and said to Jesus, "Get away from here, for Herod wants to kill you." And he said to them, "Go and tell that fox, \'Behold, I cast out demons and perform cures today and tomorrow, and the third day I finish my course. Nevertheless I must go on my way today and tomorrow and the day following; for it cannot be that a prophet should perish away from Jerusalem.\' O Jerusalem, Jerusalem, killing the prophets and stoning those who are sent to you! How often would I have gathered your children together as a hen gathers her brood under her wings, and you would not!"',
      },
    },
    gospelCommentary: {
      title: 'The Maternal Wing of Christ and the Prophetic Road to Jerusalem',
      historicalContext:
        'As Jesus journeys steadily through Perea toward Jerusalem, Herod Antipas—who had already beheaded John the Baptist—attempts to intimidate Christ out of his territory through Pharisee intermediaries.',
      exegesis:
        'Jesus calls Herod "that fox" (an ancient Semitic idiom for a cunning yet ultimately minor ruler contrasted with the Lion of Judah). Notice the triduum rhythm in Christ’s reply: "today, tomorrow, and the third day I finish my course" (teleioumai—I am perfected/consummated). Nothing can derail the Father’s salvific hour. Yet immediately after resolute courage comes tender lament: Jesus compares His divine longing for Jerusalem to a mother bird sheltering her young under her wings (cf. Psalm 91:4).',
      patristicVoices: [
        {
          father: 'St. Augustine of Hippo',
          work: 'Tractates on the Gospel of John, 15.25',
          excerpt:
            'Look at the hen: she becomes weak with her chicks; her feathers ruffle, her voice changes, she lowers herself entirely to protect her little ones. Thus the Eternal Wisdom of God humbled Himself in our flesh to gather us beneath the shadow of His Cross.',
        },
        {
          father: 'St. Cyril of Alexandria',
          work: 'Commentary on Luke, Homily 101',
          excerpt:
            'Christ declares that His Passion is not forced upon Him by Herod’s plots, but freely embraced in Jerusalem at the appointed time of the Father.',
        },
      ],
      homily:
        'Spiritual warfare (Ephesians 6) and tender mercy (Luke 13) meet in today’s Liturgy. We are called to wear the breastplate of righteousness and the shield of faith without fear of worldly powers—while never losing the compassionate heart of Christ who weeps over wandering souls.',
      lectioPrompts: [
        'Where in my daily duties is fear of human opinion ("Herod") tempting me to abandon the work God gave me today?',
        'Have I consciously taken refuge beneath the Eucharistic wings of Christ this week?',
      ],
    },
    magisteriumBriefing: {
      headline: 'Spiritual Warfare and Christian Perseverance in the Catechism',
      summary:
        'Drawing on Ephesians 6 and the Desert Fathers, the Magisterium teaches that the Christian life is a daily combat of prayer, vigilance, and sacramental grace.',
      catechismRef: 'CCC §§ 2846–2849 · The Battle of Prayer',
      encyclicalRef: 'Gaudete et Exsultate §§ 158–165',
    },
  },
  '10-30': {
    liturgicalTitle: 'Friday of the Thirtieth Week in Ordinary Time',
    season: 'Ordinary Time',
    rank: 'Ferial Day · Commemoration of St. Alphonsus Rodriguez & St. Marcellus the Centurion',
    color: 'Green',
    cycle: 'Year B · Weekday Cycle II',
    saint: {
      name: 'St. Alphonsus Rodriguez & St. Marcellus the Centurion',
      title: 'Jesuit Lay Brother & Porter · Roman Martyr of Tangier',
      dates: '1532–1617 · d. 298 AD',
      patronage: 'Lay Brothers, Doorkeepers, Majorca, Conscientious Soldiers',
      biography:
        'After losing his wife and three children, Alphonsus Rodriguez entered the Society of Jesus as a humble lay brother in Majorca, serving for forty-six years as the college porter. Every time the doorbell rang, he looked toward heaven and whispered, "I am coming, Lord!" imagining Christ Himself standing at the threshold. Through his spiritual counsel at the door, he formed St. Peter Claver for his heroic mission to enslaved souls in Cartagena. Today the Martyrology also honors St. Marcellus the Centurion, who cast down his military belt in 298 AD rather than offer pagan sacrifice.',
      collectPrayer:
        'O God, who adorned Saint Alphonsus Rodriguez with the grace of heroic humility and unceasing prayer in hidden service, grant that we may recognize Christ knocking in every neighbor and serve Him with undivided charity. Through our Lord Jesus Christ, Your Son, who lives and reigns with You in the unity of the Holy Spirit, God, for ever and ever. Amen.',
      quote: 'I am coming, O Lord! — St. Alphonsus Rodriguez’s prayer whenever the monastery bell rang',
    },
    readings: {
      firstReading: {
        citation: 'Philippians 1:1–11',
        subtitle: 'He who began a good work in you will bring it to completion at the day of Jesus Christ.',
        text: 'Paul and Timothy, servants of Christ Jesus, to all the saints in Christ Jesus who are at Philippi, with the bishops and deacons: Grace to you and peace from God our Father and the Lord Jesus Christ. I thank my God in all my remembrance of you, always in every prayer of mine for you all making my prayer with joy, thankful for your partnership in the gospel from the first day until now. And I am sure that he who began a good work in you will bring it to completion at the day of Jesus Christ. It is right for me to feel thus about you all, because I hold you in my heart, for you are all partakers with me of grace, both in my imprisonment and in the defense and confirmation of the gospel. For God is my witness, how I yearn for you all with the affection of Christ Jesus. And it is my prayer that your love may abound more and more, with knowledge and all discernment, so that you may approve what is excellent, and may be pure and blameless for the day of Christ, filled with the fruits of righteousness which come through Jesus Christ, to the glory and praise of God.',
      },
      psalm: {
        citation: 'Psalm 111:1–2, 3–4, 5–6',
        response: 'How great are the works of the Lord!',
        verses: [
          'I will give thanks to the Lord with my whole heart, in the company of the upright, in the congregation. Great are the works of the Lord, studied by all who have pleasure in them.',
          'Full of honor and majesty is his work, and his righteousness endures for ever. He has caused his wonderful works to be remembered; the Lord is gracious and merciful.',
          'He provides food for those who fear him; he is ever mindful of his covenant. He has shown his people the power of his works, in giving them the heritage of the nations.',
        ],
      },
      alleluia: {
        citation: 'John 10:27',
        verse: 'My sheep hear my voice, says the Lord; I know them, and they follow me.',
      },
      gospel: {
        citation: 'Luke 14:1–6',
        subtitle: 'Is it lawful to heal on the Sabbath, or not?',
        text: 'On a Sabbath, when Jesus went to dine at the house of a ruler who belonged to the Pharisees, they were watching him. And behold, there was a man before him who had dropsy. And Jesus spoke to the lawyers and Pharisees, saying, "Is it lawful to heal on the Sabbath, or not?" But they were silent. Then he took him and healed him, and let him go. And he said to them, "Which of you, having a son or an ox that has fallen into a well, will not immediately pull him out on a Sabbath day?" And they could not reply to this.',
      },
    },
    gospelCommentary: {
      title: 'The Sabbath of Mercy and the Healing of Spiritual Dropsy',
      historicalContext:
        'Jesus is invited to the Sabbath banquet of a prominent Pharisee—not out of hospitality, but under hostile surveillance ("they were watching him," parateroumenoi). A man suffering from dropsy (edema, an abnormal accumulation of fluid causing intense thirst) stands before Him.',
      exegesis:
        'Jesus seizes the initiative with a legal dilemma: "Is it lawful to heal on the Sabbath, or not?" Their silence betrays a hardened legalism that valued technical casuistry over divine mercy. By taking hold of the man (epilabomenos), healing him, and releasing him, Christ reveals that the true meaning of the Sabbath rest is the restoration of fallen humanity. The Fathers of the Church also saw in "dropsy"—where the more a person drinks, the more swollen and thirsty he becomes—an allegory of avarice and worldly disordered desire, which only the touch of Christ can cure.',
      patristicVoices: [
        {
          father: 'St. Bede the Venerable',
          work: 'In Lucae Evangelium Expositio, Book IV (Catena Aurea)',
          excerpt:
            'Dropsy is a disease in which the body swells with water while the patient burns with unquenchable thirst; fittingly does it signify the avaricious person who, the more worldly goods he accumulates, the more ardently he thirsts for what he does not possess.',
        },
        {
          father: 'St. Cyril of Alexandria',
          work: 'Commentary on the Gospel of Luke, Homily 102',
          excerpt:
            'The Law of the Sabbath commanded rest from servile wickedness, not rest from works of divine compassion. Christ frees the man on the Sabbath to show that He Himself is the Lord of the Sabbath and our true rest.',
        },
      ],
      homily:
        'In today’s First Reading from prison, St. Paul prays "that your love may abound more and more, with knowledge and all discernment, so that you may approve what is excellent." In the Gospel, the Pharisees possess legal knowledge without love—and therefore fall mute before the suffering man in front of them. Compare their calculating silence with St. Alphonsus Rodriguez at the porter’s lodge in Majorca: whenever a troubled student or beggar knocked, Alphonsus whispered, "I am coming, Lord!" True orthodoxy always blossoms into immediate, concrete charity.',
      lectioPrompts: [
        'When someone interrupts my schedule or comfort, do I watch from a distance like the Pharisees, or answer "I am coming, Lord" like St. Alphonsus Rodriguez?',
        'What worldly attachment ("spiritual dropsy") leaves me more restless the more I consume it, and how can I surrender it to Christ’s healing touch today?',
      ],
    },
    magisteriumBriefing: {
      headline: 'Charity as the Soul of the Sabbath and Liturgical Rest',
      summary:
        'In Dies Domini and the Catechism, the Church affirms that the Lord’s Day and sacred rest are ordered toward the worship of God and works of mercy toward the afflicted.',
      catechismRef: 'CCC §§ 2173, 2186 · The Lord’s Day & Works of Mercy',
      encyclicalRef: 'St. John Paul II, Dies Domini §§ 69–71',
    },
  },
  '10-31': {
    liturgicalTitle: 'Saturday of the Thirtieth Week in Ordinary Time · Vigil of All Saints',
    season: 'Ordinary Time',
    rank: 'Saturday Memorial of the Blessed Virgin Mary · St. Wolfgang of Ratisbon',
    color: 'White',
    cycle: 'Year B · Weekday Cycle II',
    saint: {
      name: 'St. Wolfgang of Ratisbon & Saturday of Our Lady',
      title: 'Benedictine Monk and Bishop of Regensburg',
      dates: 'c. 924 – 994 AD',
      patronage: 'Bavaria, Woodcarvers, Shepherds, Stroke Victims',
      biography:
        'Educated at the Abbey of Reichenau, St. Wolfgang became a monk at Einsiedeln before being appointed Bishop of Regensburg (Ratisbon). Wearing the rough habit of a monk beneath his episcopal vestments, he reformed monasteries, preached tirelessly to the poor, and personally tutored the future Emperor St. Henry II in holiness. On this Hallowtide Eve, the Church prepares at First Vespers for the Solemnity of All Saints.',
      collectPrayer:
        'Almighty ever-living God, who on the eve of the Solemnity of All Your Saints raise our minds to the heavenly city, grant through the intercession of the Blessed Virgin Mary and Saint Wolfgang that we may walk humbly as pilgrims toward eternal glory. Amen.',
      quote: 'Let our doors and our granaries never be locked while a single poor man hungers in the diocese. — St. Wolfgang of Ratisbon',
    },
    readings: {
      firstReading: {
        citation: 'Philippians 1:18b–26',
        subtitle: 'For to me to live is Christ, and to die is gain.',
        text: 'Brethren: Christ will be honored in my body, whether by life or by death. For to me to live is Christ, and to die is gain. If it is to be life in the flesh, that means fruitful labor for me. Yet which I shall choose I cannot tell. I am hard pressed between the two. My desire is to depart and be with Christ, for that is far better. But to remain in the flesh is more necessary on your account.',
      },
      psalm: {
        citation: 'Psalm 42:2, 3, 5cdef',
        response: 'My soul is thirsting for the living God.',
        verses: [
          'As a deer longs for flowing streams, so longs my soul for you, O God.',
          'My soul thirsts for God, for the living God. When shall I come and behold the face of God?',
          'I went with the throng, and led them in procession to the house of God, with glad shouts and songs of thanksgiving.',
        ],
      },
      alleluia: {
        citation: 'Matthew 11:29ab',
        verse: 'Take my yoke upon you, says the Lord, and learn from me, for I am gentle and humble of heart.',
      },
      gospel: {
        citation: 'Luke 14:1, 7–11',
        subtitle: 'Every one who exalts himself will be humbled, and he who humbles himself will be exalted.',
        text: 'On a Sabbath Jesus went to dine at the house of a ruler who belonged to the Pharisees. Now he told a parable to those who were invited, when he marked how they chose the places of honor, saying to them, "When you are invited by any one to a marriage feast, do not sit down in a place of honor, lest a more eminent man than you be invited by him; and he who invited you both will come and say to you, \'Give place to this man,\' and then you will begin with shame to take the lowest place. But when you are invited, go and sit in the lowest place, so that when your host comes he may say to you, \'Friend, go up higher\'; then you will be honored in the presence of all who sit at table with you. For every one who exalts himself will be humbled, and he who humbles himself will be exalted."',
      },
    },
    gospelCommentary: {
      title: 'Choosing the Lowest Place at the Wedding Banquet of the Lamb',
      historicalContext:
        'At Greco-Roman and Pharisaic banquets, guests jostled for the triclinium couches closest to the host to signal social rank.',
      exegesis:
        'Christ transforms a lesson in banquet etiquette into a law of the Kingdom of God. Only Christ Himself truly took the "lowest place"—descending from heaven to the manger, the washing of feet, and the Cross—so that the Father might say to humanity, "Friend, go up higher."',
      patristicVoices: [
        {
          father: 'St. John Chrysostom',
          work: 'Homilies on the Statutes, 15',
          excerpt:
            'Would you become great? Begin from the lowest place. Just as an architect who intends to raise a lofty basilica first digs deep into the earth for the foundation, so humility is the foundation of all heavenly philosophy.',
        },
        {
          father: 'St. Bernard of Clairvaux',
          work: 'Sermons on the Song of Songs, 34',
          excerpt:
            'God gives grace only to the humble; the valley receives the waters that run off the proud mountain peaks.',
        },
      ],
      homily:
        'On the eve of All Saints, St. Paul gives us the motto of every canonized and hidden saint: "For to me to live is Christ, and to die is gain." The saints did not scramble for worldly prestige; they sought the lowest place in service and were invited by the Divine Host into the heavenly banquet.',
      lectioPrompts: [
        'Where do I subtly seek recognition or the "place of honor" in conversation or work?',
        'How can I prepare my soul tonight for tomorrow’s Solemnity of All Saints and the Plenary Indulgence octave for the Holy Souls?',
      ],
    },
    magisteriumBriefing: {
      headline: 'The Communion of Saints and the Liturgical Meaning of Hallowtide',
      summary:
        'The Church Militant, Church Suffering, and Church Triumphant form one Mystical Body united in Eucharistic charity and intercessory prayer.',
      catechismRef: 'CCC §§ 946–962 · The Communion of Saints',
      encyclicalRef: 'Lumen Gentium §§ 49–51',
    },
  },
  '11-01': {
    liturgicalTitle: 'Solemnity of All Saints (Omnium Sanctorum)',
    season: 'Solemnity in Ordinary Time',
    rank: 'Solemnity · Holy Day of Obligation',
    color: 'White',
    cycle: 'Year B · Solemnity Proper',
    saint: {
      name: 'All Holy Men and Women of God (Church Triumphant)',
      title: 'The Great Cloud of Witnesses from Every Nation, Tribe, and Tongue',
      dates: 'Instituted Universally c. 609 AD (Pantheon Dedication) · Nov 1 Fixed by Pope Gregory III',
      patronage: 'The Universal Church, All the Baptized Called to Holiness',
      biography:
        'Today Mother Church celebrates in a single solemnity all the saints in heaven—both those officially canonized and the countless multitude known only to God ("a great multitude which no man could number, from every nation, from all tribes and peoples and tongues," Rev 7:9). Beginning at noon today through November 8, the faithful may also begin gaining the Plenary Indulgence applicable to the Holy Souls in Purgatory.',
      collectPrayer:
        'Almighty ever-living God, by whose gift we venerate in one celebration the merits of all the Saints, bestow on us, we pray, through the prayers of so many intercessors, an abundance of the reconciliation with You for which we earnestly long. Through our Lord Jesus Christ, Your Son. Amen.',
      quote: 'Do not weep, for I shall be more useful to you after my death and I shall help you then more effectively than during my life. — St. Dominic de Guzmán',
    },
    readings: {
      firstReading: {
        citation: 'Revelation 7:2–4, 9–14',
        subtitle: 'Behold, a great multitude which no man could number, standing before the throne and before the Lamb.',
        text: 'I, John, saw another angel ascending from the rising of the sun, with the seal of the living God, and he called with a loud voice to the four angels who had been given power to harm earth and sea, saying, "Do not harm the earth or the sea or the trees, till we have sealed the servants of our God upon their foreheads." After this I looked, and behold, a great multitude which no man could number, from every nation, from all tribes and peoples and tongues, standing before the throne and before the Lamb, clothed in white robes, with palm branches in their hands, and crying out with a loud voice, "Salvation belongs to our God who sits upon the throne, and to the Lamb!"',
      },
      psalm: {
        citation: 'Psalm 24:1bc–2, 3–4ab, 5–6',
        response: 'Lord, this is the people that longs to see your face.',
        verses: [
          'The earth is the Lord’s and the fulness thereof, the world and those who dwell therein; for he has founded it upon the seas, and established it upon the rivers.',
          'Who shall ascend the hill of the Lord? And who shall stand in his holy place? He who has clean hands and a pure heart, who does not lift up his soul to what is false.',
          'He will receive blessing from the Lord, and vindication from the God of his salvation. Such is the generation of those who seek him, who seek the face of the God of Jacob.',
        ],
      },
      alleluia: {
        citation: 'Matthew 11:28',
        verse: 'Come to me, all who labor and are heavy laden, and I will give you rest, says the Lord.',
      },
      gospel: {
        citation: 'Matthew 5:1–12a',
        subtitle: 'Rejoice and be glad, for your reward is great in heaven.',
        text: 'Seeing the crowds, Jesus went up on the mountain, and when he sat down his disciples came to him. And he opened his mouth and taught them, saying: "Blessed are the poor in spirit, for theirs is the kingdom of heaven. Blessed are those who mourn, for they shall be comforted. Blessed are the meek, for they shall inherit the earth. Blessed are those who hunger and thirst for righteousness, for they shall be satisfied. Blessed are the merciful, for they shall obtain mercy. Blessed are the pure in heart, for they shall see God. Blessed are the peacemakers, for they shall be called sons of God. Blessed are those who are persecuted for righteousness’ sake, for theirs is the kingdom of heaven. Blessed are you when men revile you and persecute you and utter all kinds of evil against you falsely on my account. Rejoice and be glad, for your reward is great in heaven."',
      },
    },
    gospelCommentary: {
      title: 'The Eight Beatitudes: Self-Portrait of Christ and Charter of the Saints',
      historicalContext:
        'Delivered on the Mount of Beatitudes overlooking the Sea of Galilee, Jesus promulgates the New Law of grace, fulfilling and surpassing Sinai.',
      exegesis:
        'As St. Ambrose and St. Thomas Aquinas teach, the Beatitudes are not merely ethical maxims; they are a spiritual biography of Jesus Himself and a portrait of the saints in glory. Those who washed their robes in the Blood of the Lamb (Rev 7:14) lived poverty of spirit, meekness, purity of heart, and heroic mercy on earth—and now behold the Beatific Vision ("they shall see God").',
      patristicVoices: [
        {
          father: 'St. Augustine of Hippo',
          work: 'On the Lord’s Sermon on the Mount, I.1',
          excerpt:
            'If anyone will piously and soberly consider the Sermon which our Lord Jesus Christ spoke on the mount, I think that he will find in it the perfect charter of the Christian life.',
        },
        {
          father: 'St. Bernard of Clairvaux',
          work: 'Sermon 2 for All Saints',
          excerpt:
            'Why should our praise and glorification matter to the Saints? They have no need of our honors, road-weary pilgrims as we are; rather, when we venerate their memory, it is we who are inflamed to imitate their longing for heaven.',
        },
      ],
      homily:
        'Sanctity is not a rare privilege reserved for an elite few; it is the normal vocation of every baptized soul. As Léon Bloy wrote, "The only real sadness, the only real failure, the only great tragedy in life, is not to become a saint."',
      lectioPrompts: [
        'Which of the Eight Beatitudes is the Holy Spirit inviting me to practice most concretely this month?',
        'Which patron saint am I calling upon today to intercede for my family and vocations?',
      ],
    },
    magisteriumBriefing: {
      headline: 'The Universal Call to Holiness and the Beatitudes',
      summary:
        'The Beatitudes depict the countenance of Jesus Christ and portray His charity; they express the vocation of the faithful associated with the glory of His Passion and Resurrection.',
      catechismRef: 'CCC §§ 1716–1729 · Christian Beatitude',
      encyclicalRef: 'Vatican II, Lumen Gentium §§ 39–42',
    },
  },
  '11-02': {
    liturgicalTitle: 'The Commemoration of All the Faithful Departed (All Souls’ Day)',
    season: 'Ordinary Time · Hallowtide Octave',
    rank: 'Solemnity-Ranked Commemoration',
    color: 'Violet',
    cycle: 'All Souls Proper Readings',
    saint: {
      name: 'The Holy Souls in Purgatory (Ecclesiaigens / Church Suffering)',
      title: 'All the Faithful Departed Marked with the Sign of Faith',
      dates: 'Universal Liturgical Commemoration Spread by St. Odilo of Cluny (998 AD)',
      patronage: 'All Departed Family, Friends, Benefactors, and Forgotten Souls',
      biography:
        'Following the celebration of the Church Triumphant on All Saints’ Day, Mother Church turns with maternal tenderness to the Church Suffering in Purgatory. Instituted across all Cluniac monasteries by Abbot St. Odilo of Cluny in 998 AD and adopted universally by Rome, All Souls’ Day reminds us that our prayers, almsgiving, indulgences, and above all the Holy Sacrifice of the Mass bring refreshment, light, and peace (locum refrigerii, lucis et pacis) to the departed.',
      collectPrayer:
        'Listen kindly to our prayers, O Lord, and, as our faith in Your Son, raised from the dead, is deepened, so may our hope of resurrection for Your departed servants also find fulfillment. Through our Lord Jesus Christ, Your Son. Amen.',
      quote: 'Have pity on me, have pity on me, at least you my friends, because the hand of the Lord has touched me. — Job 19:21',
    },
    readings: {
      firstReading: {
        citation: 'Wisdom 3:1–9',
        subtitle: 'As gold in the furnace, he tried them, and as sacrificial offerings he took them to himself.',
        text: 'The souls of the righteous are in the hand of God, and no torment will ever touch them. In the eyes of the foolish they seemed to have died, and their departure was thought to be an affliction, and their going from us to be their destruction; but they are at peace. For though in the sight of men they were punished, their hope is full of immortality. Having been disciplined a little, they will receive great good, because God tested them and found them worthy of himself; like gold in the furnace he tried them, and like a sacrificial burnt offering he accepted them.',
      },
      psalm: {
        citation: 'Psalm 23:1–3a, 3b–4, 5, 6',
        response: 'The Lord is my shepherd; there is nothing I shall want.',
        verses: [
          'The Lord is my shepherd, I shall not want; he makes me lie down in green pastures. He leads me beside still waters; he restores my soul.',
          'He leads me in paths of righteousness for his name’s sake. Even though I walk through the valley of the shadow of death, I fear no evil; for thou art with me.',
          'Surely goodness and mercy shall follow me all the days of my life; and I shall dwell in the house of the Lord for ever.',
        ],
      },
      alleluia: {
        citation: 'Matthew 25:34',
        verse: 'Come, you who are blessed by my Father, says the Lord; inherit the kingdom prepared for you from the foundation of the world.',
      },
      gospel: {
        citation: 'John 6:37–40',
        subtitle: 'This is the will of my Father, that every one who sees the Son and believes in him should have eternal life.',
        text: 'Jesus said to the crowds: "All that the Father gives me will come to me; and him who comes to me I will not cast out. For I have come down from heaven, not to do my own will, but the will of him who sent me; and this is the will of him who sent me, that I should lose nothing of all that he has given me, but raise it up at the last day. For this is the will of my Father, that every one who sees the Son and believes in him should have eternal life; and I will raise him up at the last day."',
      },
    },
    gospelCommentary: {
      title: 'The Furnace of Purifying Love and the Resurrection on the Last Day',
      historicalContext:
        'Taken from the Bread of Life Discourse in Capernaum, Jesus links our union with Him in faith and the Eucharist to the solemn promise of bodily resurrection.',
      exegesis:
        'Wisdom 3 compares the purification of the just after death to "gold in the furnace." Purgatory is not a place of despair, but the vestibule of Heaven where Christ’s merciful fire burns away the remaining dross of venial attachment so the soul may enter the all-holy presence of God.',
      patristicVoices: [
        {
          father: 'St. Cyril of Jerusalem',
          work: 'Mystagogical Catecheses, V.9',
          excerpt:
            'When we offer to God our supplications for those who have fallen asleep, while Christ the Victim of our sins lies upon the altar, we offer up Christ sacrificed for our sins, propitiating our merciful God both for them and for ourselves.',
        },
        {
          father: 'St. Catherine of Genoa',
          work: 'Treatise on Purgatory, Chapter 2',
          excerpt:
            'I do not believe it would be possible to find any joy comparable to that of a soul in Purgatory, except the joy of the saints in Paradise—and day by day this joy increases as God flows into these souls.',
        },
      ],
      homily:
        'Today every priest is permitted to celebrate three Masses: one for a particular intention, one for all the faithful departed, and one for the intentions of the Supreme Pontiff. Visit a church or cemetery today to gain a Plenary Indulgence for a departed soul.',
      lectioPrompts: [
        'Which deceased relatives, priests, or forgotten souls am I offering my prayers and Scripture reading for today?',
        'How does meditating on the Four Last Things (Death, Judgment, Heaven, Hell) purify my priorities today?',
      ],
    },
    magisteriumBriefing: {
      headline: 'The Final Purification (Purgatory) and Suffrages for the Dead',
      summary:
        'All who die in God’s grace and friendship, but still imperfectly purified, are assured of their eternal salvation; after death they undergo purification to achieve the holiness necessary to enter the joy of heaven.',
      catechismRef: 'CCC §§ 1030–1032 · The Final Purification, or Purgatory',
      encyclicalRef: 'Benedict XVI, Spe Salvi §§ 45–48',
    },
  },
};

const FALLBACK_ROTATION: Array<Omit<DailyLiturgicalPackage, 'dateIso' | 'formattedDate' | 'rosaryMystery'>> = [
  CURATED_DAILY_PACKAGES['10-30'],
  CURATED_DAILY_PACKAGES['10-29'],
  CURATED_DAILY_PACKAGES['10-31'],
  CURATED_DAILY_PACKAGES['11-01'],
  CURATED_DAILY_PACKAGES['11-02'],
];

export function getDailyLiturgicalPackage(dateIso: string): DailyLiturgicalPackage {
  const [yearStr, monthStr, dayStr] = dateIso.split('-');
  const year = Number(yearStr) || 2026;
  const month = Number(monthStr) || 10;
  const day = Number(dayStr) || 30;

  const dateObj = new Date(year, month - 1, day, 12, 0, 0);
  const dayOfWeek = dateObj.getDay();
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const monthDayKey = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const rosaryMystery = ROSARY_MYSTERIES_BY_DAY[dayOfWeek] || ROSARY_MYSTERIES_BY_DAY[5];

  if (CURATED_DAILY_PACKAGES[monthDayKey]) {
    return {
      dateIso,
      formattedDate,
      rosaryMystery,
      ...CURATED_DAILY_PACKAGES[monthDayKey],
    };
  }

  // Deterministic rotation for any other calendar day of the year
  const dayOfYear = Math.floor(
    (dateObj.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const template = FALLBACK_ROTATION[Math.abs(dayOfYear) % FALLBACK_ROTATION.length];

  return {
    ...template,
    dateIso,
    formattedDate,
    rosaryMystery,
  };
}

export const INDULGENCE_EVENTS: IndulgenceEvent[] = [
  {
    id: 'ind-scripture-30',
    title: 'Reading Sacred Scripture for At Least 30 Minutes',
    latinTitle: 'Lectio Divina Sacrae Scripturae (Conc. 30)',
    dateLabel: 'Daily Plenary Grant · Linked to Scripture Stopwatch',
    monthDayMatch: ['DAILY'],
    grantType: 'Plenary Indulgence',
    enchiridionRef: 'Enchiridion Indulgentiarum, 4th ed., Concession 30 §1',
    requirements: [
      'Read Sacred Scripture with the veneration due to the Divine Word as a spiritual reading',
      'Continue for at least thirty (30) minutes (partial indulgence if less than 30 minutes)',
      'Use an edition approved by competent ecclesiastical authority',
    ],
    description:
      'A Plenary Indulgence is granted every day to the faithful who read Sacred Scripture for at least half an hour with the reverence due to the Word of God. Use the built-in 30-Minute Scripture Stopwatch on this website to time and verify this daily indulgence.',
    normConditions:
      'Sacramental Confession (within ~20 days), Eucharistic Communion, Prayer for the Intentions of the Supreme Pontiff, and complete detachment from all sin, even venial.',
  },
  {
    id: 'ind-adoration-30',
    title: 'Eucharistic Adoration of the Blessed Sacrament (30 Minutes)',
    latinTitle: 'Adoratio Sanctissimi Sacramenti (Conc. 7 §1)',
    dateLabel: 'Daily Plenary Grant',
    monthDayMatch: ['DAILY'],
    grantType: 'Plenary Indulgence',
    enchiridionRef: 'Enchiridion Indulgentiarum, Concession 7 §1, 1°',
    requirements: [
      'Visit the Most Blessed Sacrament to adore It',
      'Remain in Eucharistic adoration for at least half an hour',
    ],
    description:
      'Granted to the faithful who visit the Most Blessed Sacrament for at least 30 minutes of adoration in a church or oratory.',
    normConditions:
      'Sacramental Confession, Eucharistic Communion, Prayer for the Sovereign Pontiff, detachment from all sin.',
  },
  {
    id: 'ind-rosary',
    title: 'Recitation of the Marian Rosary in Church or Family',
    latinTitle: 'Recitatio Rosarii Marialis (Conc. 17 §1)',
    dateLabel: 'Daily Plenary Grant',
    monthDayMatch: ['DAILY'],
    grantType: 'Plenary Indulgence',
    enchiridionRef: 'Enchiridion Indulgentiarum, Concession 17 §1',
    requirements: [
      'Devoutly recite five continuous decades of the Rosary in a church, oratory, or within a family/religious community',
      'Piously meditate on the Mysteries while vocalizing the prayers',
    ],
    description:
      'A Plenary Indulgence is granted when the Rosary is prayed in a church or oratory, or in a family, religious community, or pious association of the faithful.',
    normConditions:
      'Sacramental Confession, Eucharistic Communion, Prayer for the Sovereign Pontiff, detachment from all sin.',
  },
  {
    id: 'ind-all-souls-octave',
    title: 'Octave of All Souls: Visitation of a Cemetery (Nov 1–8)',
    latinTitle: 'In Commemoratione Omnium Fidelium Defunctorum (Conc. 29 §1)',
    dateLabel: 'Annual Octave · November 1 – November 8',
    monthDayMatch: ['10-30', '10-31', '11-01', '11-02', '11-03', '11-04', '11-05', '11-06', '11-07', '11-08'],
    grantType: 'Plenary Indulgence',
    enchiridionRef: 'Enchiridion Indulgentiarum, Concession 29 §1, 1°',
    requirements: [
      'Devoutly visit a cemetery between November 1 and November 8',
      'Pray, even if only mentally, for the departed',
      'Applicable ONLY to the Holy Souls in Purgatory (one Plenary Indulgence per day for 8 days)',
    ],
    description:
      'On each day from November 1 to November 8 inclusive, a Plenary Indulgence applicable exclusively to the souls in Purgatory is granted to the faithful who devoutly visit a cemetery and pray for the departed.',
    normConditions:
      'Sacramental Confession, Eucharistic Communion (for each day’s plenary grant), and Prayer for the Pope’s intentions.',
  },
  {
    id: 'ind-all-souls-church',
    title: 'All Souls’ Day Visit to a Church or Oratory (Nov 2)',
    latinTitle: 'Visitatio Ecclesiae in Commemoratione Omnium Fidelium Defunctorum',
    dateLabel: 'November 2 (or from Noon Nov 1 to Midnight Nov 2)',
    monthDayMatch: ['11-01', '11-02'],
    grantType: 'Plenary Indulgence',
    enchiridionRef: 'Enchiridion Indulgentiarum, Concession 29 §1, 2°',
    requirements: [
      'Devoutly visit a church or oratory on All Souls’ Day',
      'Recite one Our Father (Pater Noster) and the Apostles’ or Nicene Creed (Credo)',
      'Applicable exclusively to the Souls in Purgatory',
    ],
    description:
      'Designed so those unable to travel to a cemetery may still obtain a Plenary Indulgence for a soul in Purgatory by visiting any parish church or oratory on November 2.',
    normConditions:
      'Sacramental Confession, Eucharistic Communion, Prayer for the Sovereign Pontiff, detachment from all sin.',
  },
  {
    id: 'ind-via-crucis',
    title: 'Pious Exercise of the Way of the Cross (Via Crucis)',
    latinTitle: 'Exercitium Viae Crucis (Conc. 13)',
    dateLabel: 'Daily Plenary Grant · Especially Fridays',
    monthDayMatch: ['DAILY'],
    grantType: 'Plenary Indulgence',
    enchiridionRef: 'Enchiridion Indulgentiarum, Concession 13',
    requirements: [
      'Make the pious exercise before legitimately erected Stations of the Cross',
      'Move from one Station to the next while meditating on the Lord’s Passion and Resurrection',
    ],
    description:
      'Particularly suited for Fridays of the liturgical year to unite one’s sufferings with the Redeemer.',
    normConditions:
      'Sacramental Confession, Eucharistic Communion, Prayer for the Sovereign Pontiff, detachment from all sin.',
  },
];

export const CATHOLIC_PROPHECIES: CatholicProphecy[] = [
  {
    id: 'proph-fatima-1917',
    seer: 'Our Lady of Fatima (via Venerable Sr. Lúcia dos Santos, St. Jacinta & St. Francisco Marto)',
    title: 'The Triumph of the Immaculate Heart & Era of Peace',
    epoch: 'July 13, 1917',
    location: 'Cova da Iria, Fatima, Portugal',
    approvalStatus: 'Ecclesiastically Approved (Bishop José Alves Correia da Silva, 1930 · Liturgical Feast)',
    theme: 'Marian Apparition',
    excerpt:
      '"In the end, my Immaculate Heart will triumph. The Holy Father will consecrate Russia to me, and she shall be converted, and a period of peace will be granted to the world."',
    historicalContext:
      'Delivered during the third apparition at Fatima amidst the devastation of the First World War and just months before the October Bolshevik Revolution, Our Lady called for daily recitation of the Rosary, First Saturday Communions of reparation, and penance for the conversion of sinners.',
    spiritualApplication:
      'Calls the faithful not to speculative alarmism, but to daily fidelity to the Rosary, Eucharistic reparation on the First Saturday of five consecutive months, and joyful offering of daily duties.',
  },
  {
    id: 'proph-bosco-columns',
    seer: 'St. John Bosco',
    title: 'Prophetic Vision of the Two Columns: The Eucharist and Our Lady',
    epoch: 'May 30, 1862',
    location: 'Turin, Italy',
    approvalStatus: 'Recorded in the Biographical Memoirs of St. John Bosco (Canonized 1934)',
    theme: 'Eucharistic Triumph',
    excerpt:
      '"The flagship of the Church is buffeted by a violent storm and surrounded by enemy vessels... Then two mighty columns rise from the waves: upon the taller stands the Sacred Host with the inscription Salus Credentium (Salvation of Believers); upon the second stands the Virgin Mary with Auxilium Christianorum (Help of Christians). Once the Pope anchors the ship between these two pillars, a great calm covers the sea."',
    historicalContext:
      'Recounted by Don Bosco to five hundred boys at the Oratory of St. Francis de Sales in Turin during a turbulent period for the Papacy and the Risorgimento.',
    spiritualApplication:
      'In every trial of the Church and of the domestic family, anchor your life firmly to the Most Holy Eucharist and Marian devotion.',
  },
  {
    id: 'proph-akita-1973',
    seer: 'Our Lady of Akita (via Sr. Agnes Katsuko Sasagawa)',
    title: 'Call to Penance, Eucharistic Reparation, and the Rosary',
    epoch: 'October 13, 1973',
    location: 'Yuzawadai, Akita, Japan',
    approvalStatus: 'Ecclesiastically Approved by Bishop John Shojiro Ito of Niigata (April 22, 1984)',
    theme: 'Marian Apparition',
    excerpt:
      '"Prayer, penance and courageous sacrifices can soften the Father’s anger... Pray very much the prayers of the Rosary. I alone am able still to save you from the calamities which approach. Those who place their confidence in me will be saved."',
    historicalContext:
      'Delivered on the 56th anniversary of the Miracle of the Sun at Fatima, accompanied by 101 documented lachrymations of a wooden statue of Our Lady carved in Akita.',
    spiritualApplication:
      'Pray specifically for bishops, priests, and consecrated souls, offering daily prayer and fasting in reparation for indifference toward the Eucharist.',
  },
  {
    id: 'proph-montfort-apostles',
    seer: 'St. Louis-Marie Grignion de Montfort',
    title: 'Prophecy of the Apostles of the Latter Times',
    epoch: 'c. 1712 AD',
    location: 'Brittany & Vendée, France',
    approvalStatus: 'True Devotion to Mary · Examined by Rome for Beatification & Canonization (1947)',
    theme: 'Eschatological Renewal',
    excerpt:
      '"They shall be true disciples of Jesus Christ, walking in the footsteps of His poverty, humility, contempt of the world, and charity; teaching the narrow way of God in pure truth according to the holy Gospel... In one hand they shall carry the Crucifix and in the other the Rosary."',
    historicalContext:
      'Written in Treatise on True Devotion to the Blessed Virgin (§§ 47–59), describing how the Holy Spirit, acting through Mary, will form saints of extraordinary interior fire to renew the Church.',
    spiritualApplication:
      'Cultivate total Marian consecration (Totus Tuus) so that every prayer and work is offered through Mary’s spotless hands.',
  },
  {
    id: 'proph-hildegard-ages',
    seer: 'St. Hildegard of Bingen, Doctor of the Church',
    title: 'Purification and Apostolic Springtime of the Church',
    epoch: '1151–1173 AD',
    location: 'Rupertsberg Abbey, Rhineland',
    approvalStatus: 'Scivias & Liber Divinorum Operum · Proclaimed Doctor of the Universal Church (2012)',
    theme: 'Papal & Ecclesial',
    excerpt:
      '"After the season of laxity and tribulation, princes and peoples will return to the discipline of justice, and the Bride of Christ will shine with a purer dawn of contemplation and scriptural wisdom than before."',
    historicalContext:
      'Pope Gregory IX, St. Bernard of Clairvaux, and Pope Eugene III examined and praised Hildegard’s prophetic writings during the Synod of Trier.',
    spiritualApplication:
      'Respond to cultural darkness not with bitterness, but with viriditas—the greening, life-giving fidelity of prayer, sacred study, and liturgical beauty.',
  },
];

export const MAGISTERIUM_NEWS_ITEMS: MagisteriumNewsItem[] = [
  {
    id: 'mag-1',
    category: 'Sacred Scripture & Indulgences',
    headline: 'Magisterium AI Brief: Verbum Domini & the 30-Minute Scripture Indulgence',
    publishedRelative: 'Updated Today · Daily Doctrinal Synthesis',
    catechismRef: 'CCC §§ 131–133 · Dei Verbum § 25',
    sourceDoc: 'Apostolic Exhortation Verbum Domini (Benedict XVI) & Enchiridion Indulgentiarum Conc. 30',
    summary:
      'In Dei Verbum § 25, the Second Vatican Council urgently exhorts all the Christian faithful to learn "the surpassing knowledge of Jesus Christ" (Phil 3:8) by frequent reading of the divine Scriptures, quoting St. Jerome: "Ignorance of the Scriptures is ignorance of Christ."',
    doctrinalSynthesis:
      'Magisterium AI cross-references show that prayerful reading of Sacred Scripture (Lectio Divina) must always be accompanied by prayer so that a dialogue takes place between God and man: "for we speak to Him when we pray; we listen to Him when we read the divine oracles" (St. Ambrose). When practiced for 30 minutes with reverence, the Church attaches a daily Plenary Indulgence.',
  },
  {
    id: 'mag-2',
    category: 'Sacred Heart & Reparation',
    headline: 'Encyclical Spotlight: Dilexit Nos on the Human and Divine Love of the Heart of Jesus',
    publishedRelative: 'Updated Today · Papal Magisterium',
    catechismRef: 'CCC § 478 · Haurietis Aquas',
    sourceDoc: 'Encyclical Letter Dilexit Nos on the Sacred Heart of Jesus',
    summary:
      'Synthesizing the theological heritage of St. Margaret Mary Alacoque, St. Thérèse of Lisieux, and St. Charles de Foucauld, the Magisterium reaffirms that devotion to the Sacred Heart is not a peripheral piety, but a synthesis of the entire Gospel in a fragmented digital age.',
    doctrinalSynthesis:
      'Christ’s pierced Heart reveals the threefold love of the Redeemer: divine love, infused spiritual charity, and tender human affection (CCC § 478). Returning to the interior heart heals modern superficiality.',
  },
  {
    id: 'mag-3',
    category: 'Liturgy of the Hours',
    headline: 'Sanctifying the Hours of the Day: General Instruction of the Liturgy of the Hours',
    publishedRelative: 'Updated Today · Liturgical Theology',
    catechismRef: 'CCC §§ 1174–1178',
    sourceDoc: 'Institutio Generalis de Liturgia Horarum (GILH §§ 10–14)',
    summary:
      'From the Apostolic Church onward, Christians have dedicated fixed hours—Morning (Lauds), Midday (Angelus/Sext), Three O’Clock (None/Hour of Mercy), Evening (Vespers), and Night (Compline)—to fulfill the Lord’s command to pray without ceasing.',
    doctrinalSynthesis:
      'Lauds as Morning Prayer and Vespers as Evening Prayer are the two hinges (cardines) of the daily Office. Even lay faithful who pray brief canonical hours unite their voice with the High Priest Christ before the Father.',
  },
  {
    id: 'mag-4',
    category: 'Eschatology & Hallowtide',
    headline: 'Doctrinal Note on the Communion of Saints and Suffrages for the Dead',
    publishedRelative: 'Updated Today · Dicastery for the Doctrine of the Faith',
    catechismRef: 'CCC §§ 958, 1032',
    sourceDoc: 'Lumen Gentium § 50 · Catechism of the Catholic Church',
    summary:
      'Because all the faithful—those who are pilgrims on earth, the dead who are being purified, and the blessed in heaven—form one Church, there is a perennial exchange of spiritual goods (communio sanctorum).',
    doctrinalSynthesis:
      'Drawing on 2 Maccabees 12:46, the Church has honored the memory of the dead from the earliest catacombs, offering the Eucharistic Sacrifice, alms, indulgences, and works of penance on their behalf.',
  },
];

export const CURATED_ARTICLES: CatholicArticle[] = [
  {
    id: 'art-wof-1',
    source: 'Word on Fire',
    title: 'Why St. Paul’s Prison Letter to the Philippians Is the Antidote to Modern Anxiety',
    author: 'Bishop Robert Barron',
    authorRole: 'Founder, Word on Fire Catholic Ministries',
    readTime: '6 min read',
    topic: 'Biblical Theology',
    summary:
      'Writing in chains, Paul speaks of joy sixteen times in four short chapters. The secret is not stoic detachment, but the conviction that Christ who began a good work in us will bring it to completion.',
    fullText: [
      'In the daily Mass readings this week, the Church turns to St. Paul’s Letter to the Philippians. What strikes every attentive reader immediately is the sheer luminosity of the letter. Paul is not writing from a peaceful villa in Tusculum; he is chained to a Praetorian guard, awaiting a trial that could easily end in execution. Yet the recurring leitmotif of Philippians is chara—joy.',
      'How is this possible? Look at today’s opening lines: "I am sure that he who began a good work in you will bring it to completion at the day of Jesus Christ" (Phil 1:6). Modern anxiety almost always stems from the pelagian illusion that we are the sole authors, architects, and sustainers of our own lives.',
      'When we realize that our sanctification is fundamentally God’s project—an opus Dei begun in Baptism and nourished at the altar—our shoulders drop. We still labor strenuously with grace, of course, yet the ultimate burden of completion belongs to the Divine Artist.',
      'Notice too Paul’s prayer in verse 9: "that your love may abound more and more, with knowledge and all discernment, so that you may approve what is excellent." In authentic Catholic spirituality, love and intellectual rigor are never rivals. Charity sharpens the mind to discern what is truly noble, beautiful, and worthy of an immortal soul.',
    ],
    keyTakeaway:
      'Christian joy is anchored not in favorable external circumstances, but in the certainty that Christ Himself is completing the work of grace He began in our baptism.',
  },
  {
    id: 'art-wof-2',
    source: 'Word on Fire',
    title: 'The Architecture of the Liturgical Year: Living in Sacred Time',
    author: 'Dr. Matthew Petrusek',
    authorRole: 'Senior Director, Word on Fire Institute',
    readTime: '7 min read',
    topic: 'Sacred Liturgy',
    summary:
      'Secular time is a flat treadmill of ticking seconds (chronos); the Catholic Calendar transforms every twenty-four hours into kairos—an encounter with the mysteries of Christ.',
    fullText: [
      'Every culture organizes time around what it worships. In a purely commercial society, the calendar is structured around fiscal quarters, shopping cycles, and productivity sprints. Left to itself, this chronological treadmill exhausts the human spirit.',
      'The Roman Liturgical Calendar performs a quiet revolution in our relationship with time. By weaving together the temporal cycle of Christ’s Incarnation and Paschal Mystery with the sanctoral cycle of the martyrs, confessors, and virgins, the Church sanctifies the calendar itself.',
      'When you wake up and check the Ordo, you are never stepping into an anonymous Friday or Tuesday. You are stepping into a feast, a fast, or a ferial day accompanied by specific witnesses who walked this same road before you and now intercede for you before the throne of God.',
    ],
    keyTakeaway:
      'Aligning your morning and evening routines with the Roman Calendar converts ordinary clock-time into a spiral ascent toward eternity.',
  },
  {
    id: 'art-aleteia-1',
    source: 'Aleteia',
    title: 'The Jesuit Doorkeeper Who Formed One of History’s Greatest Missionaries',
    author: 'Philip Kosloski',
    authorRole: 'Liturgical & Hagiography Editor, Aleteia',
    readTime: '5 min read',
    topic: 'Lives of the Saints',
    summary:
      'St. Alphonsus Rodriguez never left the island of Majorca after becoming a Jesuit brother, yet his daily conversations at the porter’s lodge set St. Peter Claver ablaze for the New World.',
    fullText: [
      'By worldly standards, the life of St. Alphonsus Rodriguez looked like a string of tragedies followed by forty-six years of monotony. Born in Segovia in 1532, he inherited his family’s wool business, only to see his wife, two children, and mother die within a few years, followed by the collapse of his trade.',
      'Accepted at age thirty-nine as a Jesuit lay brother on the island of Majorca, he was assigned the humblest post in Montesión College: answering the front door. Whenever the heavy iron bell clanged, Alphonsus paused for a heartbeat, looked toward heaven, and said aloud, "I am coming, Lord!"',
      'Among the young Jesuit scholastics studying philosophy at Montesión in 1605 was a shy twenty-five-year-old Catalan named Peter Claver. Every afternoon for three years, Peter sat on the stone bench beside the old doorkeeper. Alphonsus spoke to him with burning intensity about the millions of souls arriving in the ports of the Americas with no one to bind their wounds or baptize them.',
      'Armed with Brother Alphonsus’s notebook and blessing, Peter Claver sailed for Cartagena, where he personally baptized and cared for over 300,000 enslaved men and women. Today both the hidden doorkeeper and the missionary apostle are canonized saints of the universal Church.',
    ],
    keyTakeaway:
      'No vocation or daily chore is small when performed with the habitual awareness that Christ Himself is knocking at our door.',
  },
  {
    id: 'art-aleteia-2',
    source: 'Aleteia',
    title: 'How to Gain Eight Plenary Indulgences for the Holy Souls During November’s Octave',
    author: 'Cerith Gardiner',
    authorRole: 'Senior Vatican & Faith Correspondent, Aleteia',
    readTime: '4 min read',
    topic: 'Devotions & Indulgences',
    summary:
      'A practical step-by-step guide to the Church’s treasury of grace during the November 1–8 cemetery octave and All Souls’ Day church visitation.',
    fullText: [
      'Each November, the Catholic Church opens wide her spiritual treasury for the relief of the Church Suffering in Purgatory. Under Concession 29 of the Enchiridion Indulgentiarum, any member of the faithful who devoutly visits a cemetery and prays for the departed between November 1 and November 8 may gain a Plenary Indulgence each day, applicable solely to the souls in Purgatory.',
      'To make the indulgence plenary rather than partial, four standard conditions apply: (1) complete detachment from all sin, even venial; (2) sacramental Confession within roughly twenty days before or after the act; (3) reception of Holy Communion (ideally on each day one wishes to gain the plenary indulgence); and (4) prayer for the intentions of the Holy Father (such as one Our Father and one Hail Mary).',
      'Even a ten-minute walk through a local parish churchyard after daily Mass or on your way home from work becomes an act of heroic spiritual mercy that can usher a departed soul into the Beatific Vision.',
    ],
    keyTakeaway:
      'One sacramental confession can cover the entire eight-day octave of plenary indulgences, provided Holy Communion and prayers for the Pope’s intentions are offered each day.',
  },
  {
    id: 'art-sign-1',
    source: 'Sign.org',
    title: 'Signs of Grace: Why 30 Minutes of Daily Scripture Transforms the Interior Life',
    author: 'Fr. Roger Landry',
    authorRole: 'Contributor, Sign of the Cross Media',
    readTime: '5 min read',
    topic: 'Lectio Divina',
    summary:
      'Why did the Apostolic Penitentiary set thirty minutes as the threshold for the daily Scripture Plenary Indulgence? Because the human heart needs time to quiet down before it can hear the Whisper of God.',
    fullText: [
      'Many Catholics know how to pray a five-minute morning offering or read a brief two-minute Gospel snippet on their commute. Those are praiseworthy habits, yet the Church in her wisdom offers a special daily Plenary Indulgence specifically when we cross the threshold of thirty full minutes of reading Sacred Scripture.',
      'Why thirty minutes? Spiritual directors from Cassian and St. Benedict to St. Teresa of Avila have observed that during the first ten to fifteen minutes of silent reading, our imagination is still buzzing with yesterday’s emails, household errands, and anxieties.',
      'It is usually between minute fifteen and minute thirty that the surface waves subside. We stop merely skimming the biblical text for information and begin letting the Holy Spirit read us. A single phrase in Luke or the Psalms suddenly illuminates a blind spot in our conscience or pours consolation into an old wound.',
      'Using a dedicated timer to honor that thirty-minute commitment is not spiritual legalism; it is building a fenced garden of silence where the Word can take root and bear a hundredfold.',
    ],
    keyTakeaway:
      'Crossing the 30-minute threshold in daily Scripture reading allows the mind to pass from hurried surface reading into deep contemplative dialogue with Christ.',
  },
  {
    id: 'art-sign-2',
    source: 'Sign.org',
    title: 'The Angelus Bell and the Three O’Clock Hour: Reclaiming Christian Timekeeping',
    author: 'Sr. Theresa Aletheia Noble',
    authorRole: 'Editorial Contributor, Sign.org',
    readTime: '5 min read',
    topic: 'Canonical Hours',
    summary:
      'Setting gentle prayer alarms at 6:00 AM, 12:00 Noon, and 3:00 PM anchors our body and soul in the Incarnation and the Passion of Christ.',
    fullText: [
      'In medieval Christendom, the entire landscape was acoustic. At dawn, noon, and dusk, the church bells of every village rang three triple strokes followed by nine peals, inviting farmers in the fields and artisans in their workshops to pause and pray the Angelus in memory of the Incarnation.',
      'Similarly, at 3:00 PM—the Ninth Hour when Jesus breathed His last upon the Cross—monasteries chanted None, a tradition enriched in our time by St. Faustina Kowalska’s revelation of the Hour of Great Mercy.',
      'In our noisy modern workplaces, setting deliberate liturgical alarms restores that sacred rhythm. When the noon bell chimes on your desk and you pray "The Angel of the Lord declared unto Mary," your work is no longer secularized; it is consecrated.',
    ],
    keyTakeaway:
      'Timed prayer bells at Noon (Angelus) and 3:00 PM (Hour of Mercy) punctuate the workday with the two central mysteries of our faith: the Incarnation and the Redemption.',
  },
];

export const BIBLE_FLASHCARDS: BibleFlashcard[] = [
  {
    id: 'fc-1',
    reference: 'John 6:53–54',
    category: 'Eucharist',
    englishText:
      'Jesus said to them, "Truly, truly, I say to you, unless you eat the flesh of the Son of man and drink his blood, you have no life in you; he who eats my flesh and drinks my blood has eternal life, and I will raise him up at the last day."',
    latinVulgate:
      'Dixit ergo eis Iesus: Amen, amen dico vobis: nisi manducaveritis carnem Filii hominis, et biberitis eius sanguinem, non habebitis vitam in vobis. Qui manducat meam carnem, et bibit meum sanguinem, habet vitam aeternam: et ego resuscitabo eum in novissimo die.',
    catecheticalNote:
      'In v. 54, St. John shifts the Greek verb from phagein (ordinary eating) to trogein (to gnaw/chew physically), confirming the realist, substantial presence of Christ in the Holy Eucharist.',
    catechismParagraph: 'CCC §§ 1384, 1406',
  },
  {
    id: 'fc-2',
    reference: 'Philippians 1:6',
    category: 'Interior Prayer',
    englishText:
      'And I am sure that he who began a good work in you will bring it to completion at the day of Jesus Christ.',
    latinVulgate:
      'Confidens hoc ipsum, quia qui coepit in vobis opus bonum, perficiet usque in diem Christi Iesu.',
    catecheticalNote:
      'From today’s First Reading: our justification and sanctification are initiated by God’s prevenient grace and brought to perfection through fidelity to Christ.',
    catechismParagraph: 'CCC §§ 1996, 2001',
  },
  {
    id: 'fc-3',
    reference: 'Matthew 16:18–19',
    category: 'Ecclesiology',
    englishText:
      'And I tell you, you are Peter, and on this rock I will build my church, and the powers of death shall not prevail against it. I will give you the keys of the kingdom of heaven.',
    latinVulgate:
      'Et ego dico tibi, quia tu es Petrus, et super hanc petram aedificabo Ecclesiam meam, et portae inferi non praevalebunt adversus eam. Et tibi dabo claves regni caelorum.',
    catecheticalNote:
      'Christ bestows upon Simon Kepha (Rock) the royal steward’s keys of the House of David (cf. Isaiah 22:22), establishing the perpetual Petrine office of unity.',
    catechismParagraph: 'CCC §§ 552–553, 881',
  },
  {
    id: 'fc-4',
    reference: 'Luke 1:28, 38',
    category: 'Marian Dogma',
    englishText:
      'And he came to her and said, "Hail, full of grace, the Lord is with you!" ... And Mary said, "Behold, I am the handmaid of the Lord; let it be to me according to your word."',
    latinVulgate:
      'Et ingressus angelus ad eam dixit: Ave gratia plena: Dominus tecum... Dixit autem Maria: Ecce ancilla Domini: fiat mihi secundum verbum tuum.',
    catecheticalNote:
      'Gabriel greets Mary with a new title in Greek: Kecharitomene ("she who has been perfected in grace from the beginning"), the scriptural foundation of the Immaculate Conception.',
    catechismParagraph: 'CCC §§ 490–494',
  },
  {
    id: 'fc-5',
    reference: 'John 20:22–23',
    category: 'Moral Life',
    englishText:
      'And when he had said this, he breathed on them, and said to them, "Receive the Holy Spirit. If you forgive the sins of any, they are forgiven; if you retain the sins of any, they are retained."',
    latinVulgate:
      'Hoc cum dixisset, insufflavit, et dixit eis: Accipite Spiritum Sanctum: quorum remiseritis peccata, remittuntur eis; et quorum retinueritis, retenta sunt.',
    catecheticalNote:
      'Using the same verb (insufflavit) used only once before in Genesis 2:7 when God breathed life into Adam, the Risen Christ breathes the New Creation into His Apostles, instituting the Sacrament of Penance.',
    catechismParagraph: 'CCC §§ 1441, 1485',
  },
  {
    id: 'fc-6',
    reference: 'Colossians 1:15–17',
    category: 'Christology',
    englishText:
      'He is the image of the invisible God, the first-born of all creation; for in him all things were created, in heaven and on earth, visible and invisible... He is before all things, and in him all things hold together.',
    latinVulgate:
      'Qui est imago Dei invisibilis, primogenitus omnis creaturae: quoniam in ipso condita sunt universa in caelis, et in terra, visibilia, et invisibilia... et ipse est ante omnes, et omnia in ipso constant.',
    catecheticalNote:
      'Christ the Eternal Logos is both the exemplary cause through whom the universe was created and the sustaining center in whom all reality coheres.',
    catechismParagraph: 'CCC §§ 291, 331',
  },
];

export const DEFAULT_PRAYER_CHECKLIST: PrayerChecklistItem[] = [
  {
    id: 'pray-morning-offering',
    title: 'Morning Offering (Apostleship of Prayer)',
    latinTitle: 'Oblatio Cotidiana',
    timeOfDay: 'Morning',
    durationMinutes: 3,
  },
  {
    id: 'pray-lauds',
    title: 'Liturgy of the Hours: Morning Prayer (Lauds)',
    latinTitle: 'Laudes Matutinae',
    timeOfDay: 'Morning',
    durationMinutes: 12,
  },
  {
    id: 'pray-angelus',
    title: 'The Angelus (Noon Commemoration of the Incarnation)',
    latinTitle: 'Angelus Domini',
    timeOfDay: 'Midday',
    durationMinutes: 4,
  },
  {
    id: 'pray-mercy-chaplet',
    title: 'Chaplet of the Divine Mercy (Three O’Clock Hour)',
    latinTitle: 'Corona Divinae Misericordiae',
    timeOfDay: 'Afternoon',
    durationMinutes: 8,
  },
  {
    id: 'pray-rosary',
    title: 'Most Holy Rosary (5 Decades + Mystery of the Day)',
    latinTitle: 'Sanctissimum Rosarium',
    timeOfDay: 'Evening',
    durationMinutes: 20,
  },
  {
    id: 'pray-vespers',
    title: 'Liturgy of the Hours: Evening Prayer (Vespers)',
    latinTitle: 'Vesperae',
    timeOfDay: 'Evening',
    durationMinutes: 12,
  },
  {
    id: 'pray-examen',
    title: 'Night Prayer (Compline) & General Examen of Conscience',
    latinTitle: 'Completorium & Examen Conscientiae',
    timeOfDay: 'Evening',
    durationMinutes: 10,
  },
];

export const DEFAULT_PRAYER_ALARMS: PrayerAlarmItem[] = [
  {
    id: 'alarm-lauds',
    time24: '06:00',
    title: 'Lauds & Morning Offering',
    latinAntiphon: 'Domine, labia mea aperies, et os meum annuntiabit laudem tuam.',
    prayerText:
      'O Jesus, through the Immaculate Heart of Mary, I offer You my prayers, works, joys, and sufferings of this day for all the intentions of Your Sacred Heart, in union with the Holy Sacrifice of the Mass throughout the world.',
    enabled: true,
  },
  {
    id: 'alarm-angelus',
    time24: '12:00',
    title: 'The Angelus Bell (Midday)',
    latinAntiphon: 'Angelus Domini nuntiavit Mariae, et concepit de Spiritu Sancto.',
    prayerText:
      'V. The Angel of the Lord declared unto Mary. R. And she conceived of the Holy Spirit. — Hail Mary... V. Behold the handmaid of the Lord. R. Be it done unto me according to thy word. — Hail Mary... V. And the Word was made flesh. R. And dwelt among us. — Hail Mary... Pour forth, we beseech Thee, O Lord, Thy grace into our hearts...',
    enabled: true,
  },
  {
    id: 'alarm-mercy',
    time24: '15:00',
    title: 'The Hour of Great Mercy (None)',
    latinAntiphon: 'O Sanguis et Aqua, quae e Corde Iesu scaturivistis ut fons misericordiae.',
    prayerText:
      'You expired, Jesus, but the source of life gushed forth for souls, and the ocean of mercy opened up for the whole world. O Fount of Life, unfathomable Divine Mercy, envelop the whole world and empty Yourself out upon us. Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world.',
    enabled: true,
  },
  {
    id: 'alarm-vespers',
    time24: '18:00',
    title: 'Evening Vespers & Magnificat',
    latinAntiphon: 'Dirigatur, Domine, oratio mea sicut incensum in conspectu tuo.',
    prayerText:
      'My soul magnifies the Lord, and my spirit rejoices in God my Savior, for He has regarded the lowliness of His handmaid; for behold, henceforth all generations will call me blessed.',
    enabled: true,
  },
  {
    id: 'alarm-compline',
    time24: '21:00',
    title: 'Compline, Examen & Salve Regina',
    latinAntiphon: 'Salva nos, Domine, vigilantes, custodi nos dormientes.',
    prayerText:
      'Protect us, Lord, as we stay awake; watch over us as we sleep, that awake, we may keep watch with Christ, and asleep, rest in His peace. Hail, Holy Queen, Mother of Mercy, our life, our sweetness, and our hope!',
    enabled: true,
  },
];
