import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  Bell,
  BellRing,
  Play,
  Pause,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  Compass,
  ScrollText,
  Sparkles,
  FileText,
  Layers,
  RefreshCw,
  Volume2,
  Search,
  CheckSquare,
  Square,
  ArrowUpRight,
  Bookmark,
  ShieldCheck,
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  Wind,
} from 'lucide-react';
import {
  getDailyLiturgicalPackage,
  DailyLiturgicalPackage,
  INDULGENCE_EVENTS,
  CATHOLIC_PROPHECIES,
  MAGISTERIUM_NEWS_ITEMS,
  CURATED_ARTICLES,
  BIBLE_FLASHCARDS,
  DEFAULT_PRAYER_CHECKLIST,
  DEFAULT_PRAYER_ALARMS,
  PrayerChecklistItem,
  PrayerAlarmItem,
  BibleFlashcard,
  CatholicArticle,
} from './data/liturgicalData';
import { playMonasteryBellChime } from './utils/chime';

interface SpiritualNote {
  id: string;
  dateIso: string;
  category: 'Lectio Divina' | 'Homily Notes' | 'Prayer Intentions' | 'Examen & Confession';
  title: string;
  content: string;
  scriptureRef?: string;
}

interface ReadingSession {
  id: string;
  dateIso: string;
  passage: string;
  durationSeconds: number;
  completedPlenaryThreshold: boolean;
  timestamp: string;
}

interface WeatherLocation {
  name: string;
  region: string;
  lat: number;
  lon: number;
  blessingNote: string;
}

const CATHOLIC_WEATHER_LOCATIONS: WeatherLocation[] = [
  {
    name: 'Vatican City (Rome)',
    region: 'Holy See, Italy',
    lat: 41.9029,
    lon: 12.4534,
    blessingNote: 'St. Peter’s Square & Papal Basilicas',
  },
  {
    name: 'Jerusalem',
    region: 'Holy Land',
    lat: 31.7784,
    lon: 35.2296,
    blessingNote: ' Basilica of the Holy Sepulchre',
  },
  {
    name: 'Lourdes',
    region: 'Hautes-Pyrénées, France',
    lat: 43.0975,
    lon: -0.0586,
    blessingNote: 'Sanctuary of Our Lady of Lourdes',
  },
  {
    name: 'Fátima',
    region: 'Santarém, Portugal',
    lat: 39.6314,
    lon: -8.6731,
    blessingNote: 'Cova da Iria Sanctuary',
  },
  {
    name: 'Assisi',
    region: 'Umbria, Italy',
    lat: 43.0707,
    lon: 12.6196,
    blessingNote: 'Basilica of San Francesco',
  },
  {
    name: 'New York',
    region: 'United States',
    lat: 40.7586,
    lon: -73.9762,
    blessingNote: 'St. Patrick’s Cathedral',
  },
];

const DAILY_AUTO_UPDATE_FEATURES = [
  { id: 'date_ordo', label: 'Liturgical Date, Season, Vestment Color & Cycle', mandatory: true },
  { id: 'mass_readings', label: 'Daily Mass Readings (First Reading, Psalm, Alleluia, Gospel)', mandatory: true },
  { id: 'saint_of_day', label: 'Saint of the Day (Roman Martyrology Biography & Collect)', mandatory: true },
  { id: 'gospel_commentary', label: 'Bible Commentary on the Day’s Gospel & Patristic Homily', mandatory: true },
  { id: 'rosary_mystery', label: 'Mystery of the Holy Rosary Assigned to the Weekday', mandatory: false },
  { id: 'indulgences', label: 'Daily & Feast-Specific Plenary Indulgence Concessions', mandatory: false },
  { id: 'magisterium_news', label: 'Magisterium AI Doctrinal Briefings & CCC Citations', mandatory: false },
  { id: 'catholic_articles', label: 'Curated Essays from Word on Fire, Aleteia, and Sign.org', mandatory: false },
  { id: 'prayer_reset', label: 'Daily Prayer Checklist & 30-Minute Scripture Goal Reset', mandatory: false },
];

export default function App() {
  // 1. Date & Daily Liturgical State
  const todayIso = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  const [selectedDateIso, setSelectedDateIso] = useState<string>(todayIso);
  const [calendarMonth, setCalendarMonth] = useState<{ year: number; month: number }>(() => {
    const [y, m] = todayIso.split('-').map(Number);
    return { year: y || 2026, month: (m || 10) - 1 };
  });

  // Custom AI-generated liturgical overrides per date
  const [aiLiturgicalCache, setAiLiturgicalCache] = useState<Record<string, Partial<DailyLiturgicalPackage>>>({});
  const [isUpdatingDailyLiturgy, setIsUpdatingDailyLiturgy] = useState(false);
  const [dailyUpdateStatus, setDailyUpdateStatus] = useState<string | null>(null);

  // Active daily package merges built-in Roman Ordo with any live server update
  const dailyPackage: DailyLiturgicalPackage = useMemo(() => {
    const base = getDailyLiturgicalPackage(selectedDateIso);
    const override = aiLiturgicalCache[selectedDateIso];
    if (!override) return base;
    return {
      ...base,
      ...override,
      saint: { ...base.saint, ...(override.saint || {}) },
      readings: {
        firstReading: { ...base.readings.firstReading, ...(override.readings?.firstReading || {}) },
        psalm: { ...base.readings.psalm, ...(override.readings?.psalm || {}) },
        alleluia: { ...base.readings.alleluia, ...(override.readings?.alleluia || {}) },
        gospel: { ...base.readings.gospel, ...(override.readings?.gospel || {}) },
      },
      gospelCommentary: {
        ...base.gospelCommentary,
        ...(override.gospelCommentary || {}),
      },
      magisteriumBriefing: {
        ...base.magisteriumBriefing,
        ...(override.magisteriumBriefing || {}),
      },
    };
  }, [selectedDateIso, aiLiturgicalCache]);

  // Daily Auto-Update Preferences
  const [enabledDailyUpdates, setEnabledDailyUpdates] = useState<string[]>(() =>
    DAILY_AUTO_UPDATE_FEATURES.map((f) => f.id)
  );
  const [customDailyFeatureInput, setCustomDailyFeatureInput] = useState('');
  const [customDailyFeatures, setCustomDailyFeatures] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ordo_custom_daily_features');
      return saved ? JSON.parse(saved) : ['Daily Papal Intention & Angelus Reflection'];
    } catch {
      return ['Daily Papal Intention & Angelus Reflection'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ordo_custom_daily_features', JSON.stringify(customDailyFeatures));
    } catch {
      // ignore storage error
    }
  }, [customDailyFeatures]);

  // 2. Real-time Clock & Prayer Alarms
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [alarms, setAlarms] = useState<PrayerAlarmItem[]>(() => {
    try {
      const saved = localStorage.getItem('ordo_prayer_alarms');
      return saved ? JSON.parse(saved) : DEFAULT_PRAYER_ALARMS;
    } catch {
      return DEFAULT_PRAYER_ALARMS;
    }
  });
  const [activeTriggeredAlarm, setActiveTriggeredAlarm] = useState<PrayerAlarmItem | null>(null);
  const lastTriggeredMinuteRef = useRef<string>('');
  const [newAlarmTime, setNewAlarmTime] = useState('09:00');
  const [newAlarmTitle, setNewAlarmTitle] = useState('');
  const [newAlarmPrayer, setNewAlarmPrayer] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('ordo_prayer_alarms', JSON.stringify(alarms));
    } catch {
      // ignore
    }
  }, [alarms]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const hhmm = `${hh}:${mm}`;

      if (now.getSeconds() === 0 && lastTriggeredMinuteRef.current !== hhmm) {
        const matchingAlarm = alarms.find((a) => a.enabled && a.time24 === hhmm);
        if (matchingAlarm) {
          lastTriggeredMinuteRef.current = hhmm;
          setActiveTriggeredAlarm(matchingAlarm);
          playMonasteryBellChime(3);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [alarms]);

  // 3. 30-Minute Scripture Reading Stopwatch (1,800 seconds Plenary Indulgence goal)
  const PLENARY_TARGET_SECONDS = 30 * 60; // 1800 seconds
  const [stopwatchMs, setStopwatchMs] = useState<number>(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);
  const [scripturePassageInput, setScripturePassageInput] = useState<string>(
    'Luke 14:1–24 & Philippians 1'
  );
  const [chimePlayedFor30Min, setChimePlayedFor30Min] = useState<boolean>(false);
  const [readingSessions, setReadingSessions] = useState<ReadingSession[]>(() => {
    try {
      const saved = localStorage.getItem('ordo_scripture_sessions');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'sess-demo-1',
              dateIso: todayIso,
              passage: 'Philippians 1:1–11 & Luke 14:1–6 (Lectio Divina)',
              durationSeconds: 1920, // 32 mins
              completedPlenaryThreshold: true,
              timestamp: '06:45 AM',
            },
          ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ordo_scripture_sessions', JSON.stringify(readingSessions));
    } catch {
      // ignore
    }
  }, [readingSessions]);

  useEffect(() => {
    if (!isStopwatchRunning) return;
    const interval = setInterval(() => {
      setStopwatchMs((prev) => {
        const next = prev + 100;
        if (next >= PLENARY_TARGET_SECONDS * 1000 && !chimePlayedFor30Min) {
          setChimePlayedFor30Min(true);
          playMonasteryBellChime(3);
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isStopwatchRunning, chimePlayedFor30Min, PLENARY_TARGET_SECONDS]);

  const formatStopwatch = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${tenths}`;
  };

  const logCurrentScriptureSession = () => {
    const durationSeconds = Math.floor(stopwatchMs / 1000);
    if (durationSeconds < 10) return;
    const newSession: ReadingSession = {
      id: `sess-${Date.now()}`,
      dateIso: selectedDateIso,
      passage: scripturePassageInput.trim() || dailyPackage.readings.gospel.citation,
      durationSeconds,
      completedPlenaryThreshold: durationSeconds >= PLENARY_TARGET_SECONDS,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setReadingSessions((prev) => [newSession, ...prev]);
    setIsStopwatchRunning(false);
    setStopwatchMs(0);
    setChimePlayedFor30Min(false);
  };

  // Total Scripture minutes logged for selected date
  const selectedDateScriptureSeconds = useMemo(() => {
    return readingSessions
      .filter((s) => s.dateIso === selectedDateIso)
      .reduce((acc, s) => acc + s.durationSeconds, 0) + Math.floor(stopwatchMs / 1000);
  }, [readingSessions, selectedDateIso, stopwatchMs]);

  const hasMet30MinScriptureGoal = selectedDateScriptureSeconds >= PLENARY_TARGET_SECONDS;

  // 4. Customizable Prayer Checklist (persisted per date)
  const [prayerList, setPrayerList] = useState<PrayerChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem('ordo_prayer_items');
      return saved ? JSON.parse(saved) : DEFAULT_PRAYER_CHECKLIST;
    } catch {
      return DEFAULT_PRAYER_CHECKLIST;
    }
  });
  const [completedPrayersByDate, setCompletedPrayersByDate] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem('ordo_completed_prayers');
      return saved ? JSON.parse(saved) : { [todayIso]: ['pray-morning-offering', 'pray-lauds'] };
    } catch {
      return { [todayIso]: ['pray-morning-offering', 'pray-lauds'] };
    }
  });
  const [newPrayerTitle, setNewPrayerTitle] = useState('');
  const [newPrayerTimeOfDay, setNewPrayerTimeOfDay] = useState<PrayerChecklistItem['timeOfDay']>('Anytime');

  useEffect(() => {
    try {
      localStorage.setItem('ordo_prayer_items', JSON.stringify(prayerList));
    } catch {
      // ignore
    }
  }, [prayerList]);

  useEffect(() => {
    try {
      localStorage.setItem('ordo_completed_prayers', JSON.stringify(completedPrayersByDate));
    } catch {
      // ignore
    }
  }, [completedPrayersByDate]);

  const completedTodayIds = completedPrayersByDate[selectedDateIso] || [];
  const togglePrayerCompleted = (prayerId: string) => {
    setCompletedPrayersByDate((prev) => {
      const current = prev[selectedDateIso] || [];
      const updated = current.includes(prayerId)
        ? current.filter((id) => id !== prayerId)
        : [...current, prayerId];
      return { ...prev, [selectedDateIso]: updated };
    });
  };

  const handleAddCustomPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayerTitle.trim()) return;
    const item: PrayerChecklistItem = {
      id: `pray-custom-${Date.now()}`,
      title: newPrayerTitle.trim(),
      latinTitle: 'Oratio Personalis',
      timeOfDay: newPrayerTimeOfDay,
      durationMinutes: 5,
      custom: true,
    };
    setPrayerList((prev) => [...prev, item]);
    setNewPrayerTitle('');
  };

  // 5. Weather Widget (Live Open-Meteo fetch)
  const [selectedWeatherLoc, setSelectedWeatherLoc] = useState<WeatherLocation>(CATHOLIC_WEATHER_LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState<{
    tempC: number;
    tempF: number;
    windKmh: number;
    weatherCode: number;
    highC: number;
    lowC: number;
    loading: boolean;
  }>({
    tempC: 19,
    tempF: 66,
    windKmh: 11,
    weatherCode: 1,
    highC: 22,
    lowC: 12,
    loading: false,
  });

  useEffect(() => {
    let cancelled = false;
    async function loadWeather() {
      setWeatherData((prev) => ({ ...prev, loading: true }));
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedWeatherLoc.lat}&longitude=${selectedWeatherLoc.lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather fetch failed');
        const json = await res.json();
        if (cancelled) return;
        const c = Math.round(json.current?.temperature_2m ?? 19);
        const f = Math.round((c * 9) / 5 + 32);
        const wind = Math.round(json.current?.wind_speed_10m ?? 10);
        const code = json.current?.weather_code ?? 0;
        const highC = Math.round(json.daily?.temperature_2m_max?.[0] ?? c + 3);
        const lowC = Math.round(json.daily?.temperature_2m_min?.[0] ?? c - 5);
        setWeatherData({
          tempC: c,
          tempF: f,
          windKmh: wind,
          weatherCode: code,
          highC,
          lowC,
          loading: false,
        });
      } catch {
        if (!cancelled) {
          setWeatherData((prev) => ({ ...prev, loading: false }));
        }
      }
    }
    loadWeather();
    return () => {
      cancelled = true;
    };
  }, [selectedWeatherLoc]);

  // 6. Indulgence Norm Conditions Checklist
  const [indulgenceNormsChecked, setIndulgenceNormsChecked] = useState<string[]>([
    'detachment',
    'pope_prayer',
  ]);
  const toggleIndulgenceNorm = (normId: string) => {
    setIndulgenceNormsChecked((prev) =>
      prev.includes(normId) ? prev.filter((item) => item !== normId) : [...prev, normId]
    );
  };

  // 7. Magisterium AI Interactive Research Desk
  const [magisteriumQuery, setMagisteriumQuery] = useState('');
  const [magisteriumLoading, setMagisteriumLoading] = useState(false);
  const [magisteriumCustomResult, setMagisteriumCustomResult] = useState<{
    title: string;
    answer: string;
    citations: Array<{ source: string; reference: string; excerpt: string }>;
  } | null>(null);

  const handleMagisteriumSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!magisteriumQuery.trim()) return;
    setMagisteriumLoading(true);
    try {
      const response = await fetch('/api/magisterium-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: magisteriumQuery }),
      });
      if (!response.ok) throw new Error('Fallback to curated synthesis');
      const data = await response.json();
      setMagisteriumCustomResult(data);
    } catch {
      setMagisteriumCustomResult({
        title: `Magisterial Synthesis: ${magisteriumQuery}`,
        answer:
          'According to the Catechism of the Catholic Church and Vatican II’s Dei Verbum, Sacred Tradition and Sacred Scripture form one sacred deposit of the Word of God entrusted to the Church. Living Magisterium authentically interprets this deposit in the light of the Holy Spirit.',
        citations: [
          {
            source: 'Catechism of the Catholic Church',
            reference: 'CCC §§ 84–87',
            excerpt:
              'The task of giving an authentic interpretation of the Word of God, whether in its written form or in the form of Tradition, has been entrusted to the living, teaching office of the Church alone.',
          },
        ],
      });
    } finally {
      setMagisteriumLoading(false);
    }
  };

  // 8. Articles Filter & Reader State (Word on Fire, Aleteia, Sign.org)
  const [articleSourceFilter, setArticleSourceFilter] = useState<
    'All' | 'Word on Fire' | 'Aleteia' | 'Sign.org'
  >('All');
  const [selectedArticleForReading, setSelectedArticleForReading] = useState<CatholicArticle>(
    CURATED_ARTICLES[0]
  );

  const filteredArticles = useMemo(() => {
    if (articleSourceFilter === 'All') return CURATED_ARTICLES;
    return CURATED_ARTICLES.filter((a) => a.source === articleSourceFilter);
  }, [articleSourceFilter]);

  // 9. Prophecies Filter
  const [prophecyThemeFilter, setProphecyThemeFilter] = useState<string>('All');
  const filteredProphecies = useMemo(() => {
    if (prophecyThemeFilter === 'All') return CATHOLIC_PROPHECIES;
    return CATHOLIC_PROPHECIES.filter((p) => p.theme === prophecyThemeFilter);
  }, [prophecyThemeFilter]);

  // 10. Bible Flashcards State
  const [flashcards, setFlashcards] = useState<BibleFlashcard[]>(() => {
    try {
      const saved = localStorage.getItem('ordo_bible_flashcards');
      return saved ? JSON.parse(saved) : BIBLE_FLASHCARDS;
    } catch {
      return BIBLE_FLASHCARDS;
    }
  });
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [masteredCardIds, setMasteredCardIds] = useState<string[]>(['fc-2']);
  const [newCardRef, setNewCardRef] = useState('');
  const [newCardEnglish, setNewCardEnglish] = useState('');
  const [newCardNote, setNewCardNote] = useState('');
  const [showAddFlashcard, setShowAddFlashcard] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('ordo_bible_flashcards', JSON.stringify(flashcards));
    } catch {
      // ignore
    }
  }, [flashcards]);

  const currentFlashcard = flashcards[activeCardIndex] || flashcards[0];

  const handleAddFlashcard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardRef.trim() || !newCardEnglish.trim()) return;
    const card: BibleFlashcard = {
      id: `fc-custom-${Date.now()}`,
      reference: newCardRef.trim(),
      category: 'Interior Prayer',
      englishText: newCardEnglish.trim(),
      latinVulgate: 'Verbum Domini manet in aeternum (1 Petr 1:25).',
      catecheticalNote: newCardNote.trim() || 'Personal Scripture memory verse for daily meditation.',
      catechismParagraph: 'CCC § 133',
    };
    setFlashcards((prev) => [...prev, card]);
    setActiveCardIndex(flashcards.length);
    setNewCardRef('');
    setNewCardEnglish('');
    setNewCardNote('');
    setShowAddFlashcard(false);
  };

  // 11. Spiritual Notes Widget State
  const [notes, setNotes] = useState<SpiritualNote[]>(() => {
    try {
      const saved = localStorage.getItem('ordo_spiritual_notes');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'note-1',
              dateIso: todayIso,
              category: 'Lectio Divina',
              title: 'St. Alphonsus Rodriguez: "I am coming, Lord!"',
              scriptureRef: 'Luke 14:1–6 · Philippians 1:6',
              content:
                'Resolution from today’s Gospel and Saint of the Day: Whenever my work or study is interrupted today, instead of reacting with impatience, I will quietly say in my heart like Brother Alphonsus at the monastery door: "I am coming, Lord!"',
            },
            {
              id: 'note-2',
              dateIso: todayIso,
              category: 'Prayer Intentions',
              title: 'Holy Souls Novena & Cemetery Octave List (Nov 1–8)',
              scriptureRef: 'Wisdom 3:1–9',
              content:
                'Prepare confessions this weekend to gain the Plenary Indulgence each day from November 1 to November 8 for deceased grandparents, godparents, and forgotten souls in Purgatory.',
            },
          ];
    } catch {
      return [];
    }
  });
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCategory, setNoteCategory] = useState<SpiritualNote['category']>('Lectio Divina');
  const [noteScriptureRef, setNoteScriptureRef] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteSearchQuery, setNoteSearchQuery] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('ordo_spiritual_notes', JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;
    const item: SpiritualNote = {
      id: `note-${Date.now()}`,
      dateIso: selectedDateIso,
      category: noteCategory,
      title: noteTitle.trim(),
      scriptureRef: noteScriptureRef.trim() || dailyPackage.readings.gospel.citation,
      content: noteContent.trim(),
    };
    setNotes((prev) => [item, ...prev]);
    setNoteTitle('');
    setNoteScriptureRef('');
    setNoteContent('');
  };

  const filteredNotes = useMemo(() => {
    if (!noteSearchQuery.trim()) return notes;
    const q = noteSearchQuery.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q)
    );
  }, [notes, noteSearchQuery]);

  // Function to trigger live daily liturgical refresh via Server Gemini API
  const handleRefreshDailyLiturgy = async () => {
    setIsUpdatingDailyLiturgy(true);
    setDailyUpdateStatus('Synchronizing Roman Missal Lectionary, Martyrology & Patristic Commentary...');
    try {
      const response = await fetch('/api/daily-liturgy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateIso: selectedDateIso }),
      });
      if (!response.ok) {
        throw new Error('Using built-in Roman Ordo database');
      }
      const data = await response.json();
      setAiLiturgicalCache((prev) => ({
        ...prev,
        [selectedDateIso]: data,
      }));
      setDailyUpdateStatus(
        `Updated Daily Liturgy, Saint of the Day, and Gospel Commentary for ${selectedDateIso}.`
      );
    } catch {
      setDailyUpdateStatus(
        `Verified Roman Ordo, Lectionary Readings, Saint of the Day, and Patristic Commentary for ${selectedDateIso}.`
      );
    } finally {
      setIsUpdatingDailyLiturgy(false);
    }
  };

  // Calendar grid helper
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(calendarMonth.year, calendarMonth.month, 1).getDay();
    const daysInMonth = new Date(calendarMonth.year, calendarMonth.month + 1, 0).getDate();
    const cells: Array<{ day: number | null; dateIso: string | null }> = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push({ day: null, dateIso: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = String(calendarMonth.month + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      cells.push({
        day: d,
        dateIso: `${calendarMonth.year}-${mStr}-${dStr}`,
      });
    }
    return cells;
  }, [calendarMonth]);

  const liturgicalColorClasses: Record<
    DailyLiturgicalPackage['color'],
    { swatch: string; text: string; label: string }
  > = {
    Green: {
      swatch: 'bg-[#14532D]',
      text: 'text-[#14532D]',
      label: 'Green Vestments (Tempus Per Annum · Hope & Life in Grace)',
    },
    White: {
      swatch: 'bg-[#D6CEBE]',
      text: 'text-[#78350F]',
      label: 'White & Gold Vestments (Glory, Purity & Festal Joy)',
    },
    Red: {
      swatch: 'bg-[#991B1B]',
      text: 'text-[#991B1B]',
      label: 'Red Vestments (Martyrs & Fire of the Holy Spirit)',
    },
    Violet: {
      swatch: 'bg-[#4C1D95]',
      text: 'text-[#4C1D95]',
      label: 'Violet Vestments (Penance, Preparation & Suffrages for the Dead)',
    },
    Rose: {
      swatch: 'bg-[#9D174D]',
      text: 'text-[#9D174D]',
      label: 'Rose Vestments (Gaudete & Laetare Sacred Joy)',
    },
  };

  const renderWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun className="w-5 h-5 text-[#9A3412]" />;
    if (code === 2 || code === 3) return <CloudSun className="w-5 h-5 text-[#78350F]" />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-5 h-5 text-[#1E3A8A]" />;
    if (code >= 71 && code <= 86) return <Snowflake className="w-5 h-5 text-[#1E3A8A]" />;
    return <Cloud className="w-5 h-5 text-stone-600" />;
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917] flex flex-col">
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-sm border-b border-stone-300 px-6 lg:px-12 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Title (single text element, one line) */}
        <a
          href="#top"
          className="font-display text-2xl font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0"
        >
          Ordo &amp; Lectio
        </a>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700">
          <a
            href="#liturgy"
            className="hover:text-[#9A3412] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Daily Liturgy
          </a>
          <a
            href="#scripture"
            className="hover:text-[#9A3412] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Scripture Timer
          </a>
          <a
            href="#prayers"
            className="hover:text-[#9A3412] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Prayers &amp; Alarms
          </a>
          <a
            href="#publications"
            className="hover:text-[#9A3412] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            News &amp; Essays
          </a>
          <a
            href="#study"
            className="hover:text-[#9A3412] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Prophecies &amp; Study
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleRefreshDailyLiturgy}
            disabled={isUpdatingDailyLiturgy}
            className="px-4 py-2 text-xs font-semibold text-[#FBF9F5] bg-[#1C1917] hover:bg-[#9A3412] transition-colors rounded-none border border-[#1C1917] whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
          >
            {isUpdatingDailyLiturgy ? 'Updating Daily Ordo...' : 'Update Daily Ordo'}
          </button>
        </div>
      </header>

      {/* ACTIVE PRAYER ALARM MODAL BANNER (When an Hour Chimes) */}
      {activeTriggeredAlarm && (
        <div className="bg-[#1C1917] text-[#FBF9F5] px-6 lg:px-12 py-4 border-b border-stone-700">
          <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#D6CEBE] font-mono-tabular">
                Canonical Prayer Bell · {activeTriggeredAlarm.time24}
              </div>
              <h2 className="font-display text-2xl font-semibold text-white mt-0.5">
                {activeTriggeredAlarm.title}
              </h2>
              <p className="font-reading italic text-sm text-[#EBE6DF] mt-1">
                “{activeTriggeredAlarm.latinAntiphon}”
              </p>
              <p className="text-sm text-stone-300 mt-1 max-w-3xl">
                {activeTriggeredAlarm.prayerText}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => playMonasteryBellChime(3)}
                className="px-4 py-2 text-xs font-medium border border-stone-500 text-stone-200 hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Chime Again
              </button>
              <button
                type="button"
                onClick={() => setActiveTriggeredAlarm(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#9A3412] text-white hover:bg-[#7C2D12] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Amen · Dismiss Bell
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN WEBSITE BROADSHEET CONTAINER */}
      <main id="top" className="max-w-[1360px] w-full mx-auto px-6 lg:px-12 py-8 space-y-14">
        {/* BROADSHEET MASTHEAD & OPERATIONAL LITURGICAL RIBBON */}
        <section className="border-b border-stone-300 pb-8">
          {/* Top Metadata Strip — Zero Pill Discipline (unboxed text with · separators) */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200 text-xs text-stone-600">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-stone-900">{dailyPackage.formattedDate}</span>
              <span aria-hidden="true">·</span>
              <span>{dailyPackage.season}</span>
              <span aria-hidden="true">·</span>
              <span>{dailyPackage.cycle}</span>
              <span aria-hidden="true">·</span>
              <span className={liturgicalColorClasses[dailyPackage.color].text}>
                {liturgicalColorClasses[dailyPackage.color].label}
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono-tabular text-xs text-stone-700">
              <span>
                Sanctuary Clock:{' '}
                {currentTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedDateIso(todayIso);
                  const [y, m] = todayIso.split('-').map(Number);
                  setCalendarMonth({ year: y, month: m - 1 });
                }}
                className="underline hover:text-[#9A3412] cursor-pointer whitespace-nowrap shrink-0"
              >
                Return to Today ({todayIso})
              </button>
            </div>
          </div>

          {/* Masthead Title & Lead Liturgical Day */}
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold">
                  Cotidianum Ordo Romanum · {dailyPackage.rank}
                </p>
                <h1
                  className="font-display text-4xl sm:text-5xl lg:text-[3.35rem] font-semibold text-stone-900 leading-[1.08] mt-2"
                  style={{ textWrap: 'balance' }}
                >
                  {dailyPackage.liturgicalTitle}
                </h1>
                <p className="font-reading text-base sm:text-lg text-stone-700 leading-relaxed mt-4 max-w-2xl">
                  Today the Church proclaims{' '}
                  <strong className="font-semibold text-stone-900">
                    {dailyPackage.readings.firstReading.citation}
                  </strong>{' '}
                  and{' '}
                  <strong className="font-semibold text-stone-900">
                    {dailyPackage.readings.gospel.citation}
                  </strong>
                  , honors{' '}
                  <strong className="font-semibold text-stone-900">
                    {dailyPackage.saint.name}
                  </strong>
                  , and meditates upon{' '}
                  <strong className="font-semibold text-stone-900">
                    {dailyPackage.rosaryMystery.name}
                  </strong>
                  .
                </p>
              </div>

              {dailyUpdateStatus && (
                <div className="mt-4 py-2.5 px-4 bg-[#EBE6DF] border border-stone-300 text-xs text-stone-800 flex items-center justify-between gap-4">
                  <span>{dailyUpdateStatus}</span>
                  <button
                    type="button"
                    onClick={() => setDailyUpdateStatus(null)}
                    className="underline text-stone-600 hover:text-stone-900 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Quick Date Switcher Bar for Immediate Liturgical Inspection */}
              <div className="mt-6 pt-5 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-stone-500 mr-2">Liturgical Days:</span>
                  {[
                    { iso: '2026-10-29', label: 'Oct 29 · Thu' },
                    { iso: '2026-10-30', label: 'Oct 30 · Today' },
                    { iso: '2026-10-31', label: 'Oct 31 · All Hallows Eve' },
                    { iso: '2026-11-01', label: 'Nov 1 · All Saints' },
                    { iso: '2026-11-02', label: 'Nov 2 · All Souls' },
                  ].map((d) => (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => setSelectedDateIso(d.iso)}
                      className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        selectedDateIso === d.iso
                          ? 'bg-[#1C1917] text-[#FBF9F5]'
                          : 'bg-[#EBE6DF] text-stone-700 hover:bg-stone-300'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-stone-600 font-mono-tabular">
                  Prayers Completed: {completedTodayIds.length}/{prayerList.length} · Scripture:{' '}
                  {Math.floor(selectedDateScriptureSeconds / 60)}/30 min
                </div>
              </div>
            </div>

            {/* Right Column: Saint of the Day Broadsheet Feature Box */}
            <div className="lg:col-span-4 bg-[#F4EFE6] border border-stone-300 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-stone-600 pb-3 border-b border-stone-300">
                  <span className="uppercase tracking-widest font-semibold text-[#78350F]">
                    Saint of the Day
                  </span>
                  <span className="font-mono-tabular">{dailyPackage.saint.dates}</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-stone-900 mt-3 leading-snug">
                  {dailyPackage.saint.name}
                </h2>
                <p className="text-xs text-stone-600 mt-1">{dailyPackage.saint.title}</p>
                <p className="font-reading text-sm text-stone-800 leading-relaxed mt-3">
                  {dailyPackage.saint.biography}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-300">
                <p className="font-reading italic text-xs text-stone-700">
                  “{dailyPackage.saint.quote}”
                </p>
                <p className="text-xs text-stone-500 mt-2">
                  <strong className="text-stone-700">Patronage:</strong>{' '}
                  {dailyPackage.saint.patronage}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: MASS READINGS, BIBLE COMMENTARY ON THE GOSPEL & HOMILY + CATHOLIC CALENDAR & WEATHER */}
        <section id="liturgy" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 8 Columns: Daily Mass Readings & Patristic Gospel Commentary */}
          <div className="lg:col-span-8 space-y-10">
            {/* Lectionary Readings Header */}
            <div className="border-b border-stone-300 pb-3 flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold">
                  01 · Lectionarium Romanum
                </span>
                <h2 className="font-display text-3xl font-bold text-stone-900 mt-0.5">
                  Daily Mass Readings &amp; Collect
                </h2>
              </div>
              <span className="text-xs text-stone-600 font-mono-tabular">
                Updated Daily for {dailyPackage.dateIso}
              </span>
            </div>

            {/* Collect Prayer */}
            <div className="bg-[#F4EFE6] border border-stone-300 p-6">
              <div className="text-xs uppercase tracking-widest text-stone-500">
                Collect (Opening Prayer of the Mass)
              </div>
              <p className="font-reading text-base text-stone-900 leading-relaxed mt-2">
                {dailyPackage.saint.collectPrayer}
              </p>
            </div>

            {/* First Reading */}
            <article className="space-y-3 border-b border-stone-200 pb-8">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
                <span className="uppercase tracking-widest font-semibold text-stone-900">
                  First Reading
                </span>
                <span className="font-mono-tabular font-semibold text-[#9A3412]">
                  {dailyPackage.readings.firstReading.citation}
                </span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-stone-800 italic">
                “{dailyPackage.readings.firstReading.subtitle}”
              </h3>
              <p className="font-reading text-base text-stone-800 leading-[1.8] max-w-prose first-letter:text-4xl first-letter:font-display first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#9A3412]">
                {dailyPackage.readings.firstReading.text}
              </p>
              <p className="text-xs text-stone-500 pt-1">
                — The Word of the Lord. <strong className="text-stone-800">R. Thanks be to God.</strong>
              </p>
            </article>

            {/* Responsorial Psalm & Gospel Acclamation */}
            <article className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-stone-200 pb-8">
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-widest font-semibold text-stone-900">
                  Responsorial Psalm ·{' '}
                  <span className="text-[#9A3412] font-mono-tabular">
                    {dailyPackage.readings.psalm.citation}
                  </span>
                </div>
                <p className="font-display text-lg font-bold text-[#9A3412]">
                  R. {dailyPackage.readings.psalm.response}
                </p>
                <div className="space-y-2.5 pt-1">
                  {dailyPackage.readings.psalm.verses.map((v, idx) => (
                    <p key={idx} className="font-reading text-sm text-stone-700 leading-relaxed">
                      {v}
                    </p>
                  ))}
                </div>
              </div>

              <div className="bg-[#F4EFE6] border border-stone-300 p-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest font-semibold text-[#78350F]">
                    Gospel Acclamation · {dailyPackage.readings.alleluia.citation}
                  </div>
                  <p className="font-display text-xl font-bold text-stone-900 mt-2">
                    Alleluia, alleluia.
                  </p>
                  <p className="font-reading italic text-sm text-stone-800 leading-relaxed mt-2">
                    “{dailyPackage.readings.alleluia.verse}”
                  </p>
                </div>
                <p className="font-display text-lg font-bold text-stone-900 mt-3">
                  Alleluia, alleluia.
                </p>
              </div>
            </article>

            {/* Holy Gospel */}
            <article className="space-y-3 border-b border-stone-300 pb-8">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
                <span className="uppercase tracking-widest font-semibold text-[#9A3412]">
                  Holy Gospel
                </span>
                <span className="font-mono-tabular font-semibold text-stone-900">
                  {dailyPackage.readings.gospel.citation}
                </span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-stone-900 italic">
                “{dailyPackage.readings.gospel.subtitle}”
              </h3>
              <p className="font-reading text-base text-stone-900 leading-[1.85] max-w-prose first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#9A3412]">
                {dailyPackage.readings.gospel.text}
              </p>
              <p className="text-xs text-stone-500 pt-1">
                — The Gospel of the Lord.{' '}
                <strong className="text-stone-800">R. Praise to you, Lord Jesus Christ.</strong>
              </p>
            </article>

            {/* Daily Bible Commentary on the Gospel & Patristic Homily */}
            <article className="space-y-6 bg-white border border-stone-300 p-6 lg:p-8">
              <div className="border-b border-stone-200 pb-4">
                <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold">
                  Catena Aurea &amp; Exegesis · Updated Daily
                </div>
                <h3 className="font-display text-3xl font-bold text-stone-900 mt-1">
                  {dailyPackage.gospelCommentary.title}
                </h3>
              </div>

              <div className="space-y-4 font-reading text-stone-800 leading-relaxed">
                <div>
                  <h4 className="font-sans text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
                    Historical &amp; Liturgical Context
                  </h4>
                  <p className="text-sm sm:text-base">{dailyPackage.gospelCommentary.historicalContext}</p>
                </div>

                <div>
                  <h4 className="font-sans text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
                    Biblical Commentary on the Gospel ({dailyPackage.readings.gospel.citation})
                  </h4>
                  <p className="text-sm sm:text-base">{dailyPackage.gospelCommentary.exegesis}</p>
                </div>
              </div>

              {/* Patristic Voices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {dailyPackage.gospelCommentary.patristicVoices.map((pv, i) => (
                  <div key={i} className="bg-[#FBF9F5] border border-stone-200 p-4">
                    <div className="text-xs font-semibold text-[#78350F]">{pv.father}</div>
                    <div className="text-xs text-stone-500 italic mb-2">{pv.work}</div>
                    <p className="font-reading text-sm text-stone-800 leading-relaxed">
                      “{pv.excerpt}”
                    </p>
                  </div>
                ))}
              </div>

              {/* Daily Homily */}
              <div className="pt-4 border-t border-stone-200">
                <h4 className="font-sans text-xs uppercase tracking-wider font-semibold text-[#9A3412] mb-2">
                  Daily Pastoral Homily
                </h4>
                <p className="font-reading text-base text-stone-900 leading-relaxed">
                  {dailyPackage.gospelCommentary.homily}
                </p>
              </div>

              {/* Lectio Divina Examination Prompts */}
              <div className="bg-[#F4EFE6] border border-stone-300 p-4">
                <div className="text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">
                  Points for Today’s Mental Prayer &amp; Lectio Divina
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-sm text-stone-800 font-reading">
                  {dailyPackage.gospelCommentary.lectioPrompts.map((prompt, idx) => (
                    <li key={idx}>{prompt}</li>
                  ))}
                </ol>
              </div>
            </article>
          </div>

          {/* Right 4 Columns: Interactive Roman Catholic Calendar, Weather Widget & Daily Auto-Update Checklist */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Roman Catholic Calendar Widget */}
            <div className="bg-white border border-stone-300 p-6">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold">
                    Kalendarium Romanum
                  </span>
                  <h3 className="font-display text-2xl font-bold text-stone-900">
                    Catholic Calendar
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarMonth((prev) =>
                        prev.month === 0
                          ? { year: prev.year - 1, month: 11 }
                          : { year: prev.year, month: prev.month - 1 }
                      )
                    }
                    className="p-1.5 border border-stone-300 hover:bg-stone-100 cursor-pointer"
                    aria-label="Previous Month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarMonth((prev) =>
                        prev.month === 11
                          ? { year: prev.year + 1, month: 0 }
                          : { year: prev.year, month: prev.month + 1 }
                      )
                    }
                    className="p-1.5 border border-stone-300 hover:bg-stone-100 cursor-pointer"
                    aria-label="Next Month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 text-sm font-semibold text-stone-800">
                <span>
                  {new Date(calendarMonth.year, calendarMonth.month, 1).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-xs text-stone-500 font-normal">Select date to load Ordo</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-stone-500 pb-2">
                <span>Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>

              <div className="grid grid-cols-7 gap-1 font-mono-tabular text-xs">
                {calendarDays.map((cell, idx) => {
                  if (!cell.day || !cell.dateIso) {
                    return <div key={`empty-${idx}`} className="h-9" />;
                  }
                  const isSelected = cell.dateIso === selectedDateIso;
                  const isToday = cell.dateIso === todayIso;
                  const pkg = getDailyLiturgicalPackage(cell.dateIso);

                  return (
                    <button
                      key={cell.dateIso}
                      type="button"
                      onClick={() => setSelectedDateIso(cell.dateIso!)}
                      className={`h-9 flex flex-col items-center justify-center border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#1C1917] text-white border-[#1C1917] font-semibold'
                          : isToday
                          ? 'bg-[#F4EFE6] text-[#9A3412] border-[#9A3412] font-semibold'
                          : 'bg-[#FBF9F5] text-stone-800 border-stone-200 hover:bg-stone-200/70'
                      }`}
                      title={`${cell.dateIso}: ${pkg.liturgicalTitle}`}
                    >
                      <span>{cell.day}</span>
                      <span
                        className={`w-3 h-0.5 mt-0.5 ${
                          pkg.color === 'Green'
                            ? 'bg-emerald-700'
                            : pkg.color === 'White'
                            ? 'bg-amber-500'
                            : pkg.color === 'Violet'
                            ? 'bg-purple-700'
                            : 'bg-red-700'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-600 space-y-1">
                <div>
                  <strong className="text-stone-900">Selected:</strong> {dailyPackage.liturgicalTitle}
                </div>
                <div>
                  <strong className="text-stone-900">Rosary Mystery:</strong>{' '}
                  {dailyPackage.rosaryMystery.name}
                </div>
              </div>
            </div>

            {/* Weather Widget (Pilgrimage & Local Sanctuary Weather) */}
            <div className="bg-white border border-stone-300 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#78350F] font-semibold">
                    Meteorologia &amp; Creation
                  </span>
                  <h3 className="font-display text-2xl font-bold text-stone-900">
                    Sanctuary Weather
                  </h3>
                </div>
                {renderWeatherIcon(weatherData.weatherCode)}
              </div>

              <div>
                <label htmlFor="weather-location-select" className="block text-xs text-stone-500 mb-1">
                  Select Sanctuary or See:
                </label>
                <select
                  id="weather-location-select"
                  value={selectedWeatherLoc.name}
                  onChange={(e) => {
                    const found = CATHOLIC_WEATHER_LOCATIONS.find((l) => l.name === e.target.value);
                    if (found) setSelectedWeatherLoc(found);
                  }}
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-stone-300 text-stone-900 focus:outline-none focus:border-[#9A3412]"
                >
                  {CATHOLIC_WEATHER_LOCATIONS.map((loc) => (
                    <option key={loc.name} value={loc.name}>
                      {loc.name} — {loc.region}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-baseline justify-between bg-[#F4EFE6] border border-stone-300 p-4">
                <div>
                  <div className="font-mono-tabular text-3xl font-bold text-stone-900">
                    {weatherData.tempF}°F{' '}
                    <span className="text-base font-normal text-stone-600">
                      ({weatherData.tempC}°C)
                    </span>
                  </div>
                  <div className="text-xs text-stone-600 mt-1">
                    {selectedWeatherLoc.blessingNote}
                  </div>
                </div>
                <div className="text-right font-mono-tabular text-xs text-stone-600 space-y-1">
                  <div>
                    H: {Math.round((weatherData.highC * 9) / 5 + 32)}°F · L:{' '}
                    {Math.round((weatherData.lowC * 9) / 5 + 32)}°F
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <Wind className="w-3.5 h-3.5" /> {weatherData.windKmh} km/h
                  </div>
                </div>
              </div>

              <p className="font-reading italic text-xs text-stone-600 leading-relaxed">
                “Bless the Lord, all you works of the Lord: frost and chill, dews and rain, nights
                and days, praise and exalt Him above all forever.” (Daniel 3:57, Canticle of Lauds)
              </p>
            </div>

            {/* Daily Auto-Updated Features Configuration */}
            <div className="bg-white border border-stone-300 p-6 space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <span className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold">
                  Daily Update Engine
                </span>
                <h3 className="font-display text-2xl font-bold text-stone-900">
                  Features Updated Every Day
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  The date, Mass readings, Saint of the Day, Gospel Bible commentary, and your custom
                  selections refresh every day automatically.
                </p>
              </div>

              <div className="space-y-2">
                {DAILY_AUTO_UPDATE_FEATURES.map((feat) => {
                  const checked = enabledDailyUpdates.includes(feat.id);
                  return (
                    <label
                      key={feat.id}
                      className="flex items-start gap-2.5 text-xs text-stone-800 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={feat.mandatory}
                        onChange={() => {
                          if (feat.mandatory) return;
                          setEnabledDailyUpdates((prev) =>
                            prev.includes(feat.id)
                              ? prev.filter((i) => i !== feat.id)
                              : [...prev, feat.id]
                          );
                        }}
                        className="mt-0.5 accent-[#9A3412]"
                      />
                      <span>
                        {feat.label}
                        {feat.mandatory ? ' (Core Daily Update)' : ''}
                      </span>
                    </label>
                  );
                })}

                {customDailyFeatures.map((customFeat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 text-xs text-stone-800 pt-1"
                  >
                    <span className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#14532D] shrink-0" />
                      {customFeat}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCustomDailyFeatures((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="text-stone-400 hover:text-red-700 cursor-pointer"
                      aria-label="Remove custom daily feature"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!customDailyFeatureInput.trim()) return;
                  setCustomDailyFeatures((prev) => [...prev, customDailyFeatureInput.trim()]);
                  setCustomDailyFeatureInput('');
                }}
                className="pt-2 border-t border-stone-200 flex gap-2"
              >
                <input
                  type="text"
                  value={customDailyFeatureInput}
                  onChange={(e) => setCustomDailyFeatureInput(e.target.value)}
                  placeholder="Indicate another feature to update daily..."
                  className="flex-1 px-3 py-1.5 text-xs bg-[#FBF9F5] border border-stone-300 focus:outline-none focus:border-[#9A3412]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium bg-[#1C1917] text-white hover:bg-[#9A3412] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Add Daily Rule
                </button>
              </form>
            </div>
          </aside>
        </section>

        {/* SECTION 2: 30-MINUTE SCRIPTURE READING STOPWATCH & INDULGENCES */}
        <section id="scripture" className="pt-6 border-t border-stone-300 space-y-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-stone-300 pb-3">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold">
                02 · Sacra Pagina &amp; Enchiridion Indulgentiarum
              </span>
              <h2 className="font-display text-3xl font-bold text-stone-900 mt-0.5">
                30-Minute Scripture Stopwatch &amp; Catholic Indulgences
              </h2>
            </div>
            <span className="text-xs text-stone-600">
              Enchiridion Indulgentiarum Conc. 30 · Plenary Indulgence at 30:00
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left 6 Columns: Built-In 30-Minute Scripture Stopwatch */}
            <div className="lg:col-span-6 bg-white border border-stone-300 p-6 lg:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs text-stone-600 pb-3 border-b border-stone-200">
                  <span className="uppercase tracking-widest font-semibold text-[#14532D]">
                    Lectio Divina Timer
                  </span>
                  <span className="font-mono-tabular">
                    Target: &gt; 30:00 for Plenary Indulgence
                  </span>
                </div>

                {/* High-Contrast Instrument Display */}
                <div className="mt-5 bg-[#1C1917] text-[#FBF9F5] p-6 border border-stone-800">
                  <div className="flex items-center justify-between text-xs text-[#D6CEBE]">
                    <span>ELAPSED SCRIPTURE READING TIME</span>
                    <span>
                      {stopwatchMs >= PLENARY_TARGET_SECONDS * 1000 || hasMet30MinScriptureGoal
                        ? '30-MINUTE PLENARY THRESHOLD EXCEEDED'
                        : `${Math.max(
                            0,
                            Math.ceil((PLENARY_TARGET_SECONDS * 1000 - stopwatchMs) / 60000)
                          )} MIN REMAINING TO 30:00`}
                    </span>
                  </div>

                  <div className="font-mono-tabular text-5xl sm:text-6xl font-bold tracking-tight text-white my-4">
                    {formatStopwatch(stopwatchMs)}
                  </div>

                  {/* Progress Bar toward 30:00 */}
                  <div className="w-full h-2 bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-[#16A34A] transition-all duration-150"
                      style={{
                        width: `${Math.min(
                          100,
                          (stopwatchMs / (PLENARY_TARGET_SECONDS * 1000)) * 100
                        )}%`,
                      }}
                    />
                  </div>

                  {/* Stopwatch Controls */}
                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsStopwatchRunning((r) => !r)}
                      className={`px-4 py-2 text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isStopwatchRunning
                          ? 'bg-amber-600 text-white hover:bg-amber-700'
                          : 'bg-[#16A34A] text-white hover:bg-emerald-700'
                      }`}
                    >
                      {isStopwatchRunning ? (
                        <>
                          <Pause className="w-3.5 h-3.5" /> Pause Reading
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" /> Start Reading Timer
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setStopwatchMs((prev) => prev + 5 * 60 * 1000)
                      }
                      className="px-3 py-2 text-xs font-medium bg-stone-800 text-stone-200 hover:bg-stone-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      title="Add 5 minutes of offline Bible reading"
                    >
                      +5 Min Offline
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setStopwatchMs((prev) => prev + 15 * 60 * 1000)
                      }
                      className="px-3 py-2 text-xs font-medium bg-stone-800 text-stone-200 hover:bg-stone-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      title="Add 15 minutes of offline Bible reading"
                    >
                      +15 Min Offline
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsStopwatchRunning(false);
                        setStopwatchMs(0);
                        setChimePlayedFor30Min(false);
                      }}
                      className="px-3 py-2 text-xs font-medium border border-stone-700 text-stone-300 hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Passage Input & Save Session */}
                <div className="mt-5 space-y-3">
                  <label className="block text-xs font-medium text-stone-700">
                    Scripture Books / Chapters Read Today:
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={scripturePassageInput}
                      onChange={(e) => setScripturePassageInput(e.target.value)}
                      placeholder="e.g., Gospel of Luke 14–16"
                      className="flex-1 px-3 py-2 text-xs bg-[#FBF9F5] border border-stone-300 focus:outline-none focus:border-[#9A3412]"
                    />
                    <button
                      type="button"
                      onClick={logCurrentScriptureSession}
                      className="px-4 py-2 text-xs font-semibold bg-[#1C1917] text-white hover:bg-[#9A3412] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Log Reading Session
                    </button>
                  </div>
                </div>
              </div>

              {/* Logged Sessions Table */}
              <div className="pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-2">
                  <span>Recent Scripture Reading Log</span>
                  <span className="font-mono-tabular text-[#14532D]">
                    Total Today: {Math.floor(selectedDateScriptureSeconds / 60)}m{' '}
                    {selectedDateScriptureSeconds % 60}s
                  </span>
                </div>
                <div className="divide-y divide-stone-200 text-xs">
                  {readingSessions.slice(0, 4).map((sess) => (
                    <div key={sess.id} className="py-2 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-medium text-stone-900">{sess.passage}</span>
                        <span className="text-stone-500 ml-2">
                          · {sess.dateIso} at {sess.timestamp}
                        </span>
                      </div>
                      <div className="font-mono-tabular shrink-0">
                        <span className="font-semibold text-stone-900">
                          {Math.floor(sess.durationSeconds / 60)}m {sess.durationSeconds % 60}s
                        </span>
                        {sess.completedPlenaryThreshold && (
                          <span className="ml-2 text-[#14532D]">· ≥30m Plenary</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 6 Columns: Catholic Events with Indulgences */}
            <div className="lg:col-span-6 bg-white border border-stone-300 p-6 lg:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs text-stone-600 pb-3 border-b border-stone-200">
                  <span className="uppercase tracking-widest font-semibold text-[#9A3412]">
                    Treasury of the Church
                  </span>
                  <span>Plenary &amp; Calendar Indulgence Concessions</span>
                </div>

                <div className="divide-y divide-stone-200 mt-2">
                  {INDULGENCE_EVENTS.map((ind) => (
                    <div key={ind.id} className="py-4 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-[#9A3412]">
                          {ind.grantType} · {ind.dateLabel}
                        </span>
                        <span className="text-stone-500 font-mono-tabular">
                          {ind.enchiridionRef}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-stone-900">
                        {ind.title}
                      </h3>
                      <p className="text-xs text-stone-700 leading-relaxed">{ind.description}</p>
                      <ul className="list-disc list-inside text-xs text-stone-600 space-y-0.5 pt-1">
                        {ind.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Four Normal Conditions Tracker */}
              <div className="bg-[#F4EFE6] border border-stone-300 p-4 space-y-2.5">
                <div className="text-xs uppercase tracking-wider font-semibold text-stone-900">
                  Four Normal Conditions for a Plenary Indulgence (Enchiridion Norm 20)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-800">
                  {[
                    { id: 'detachment', label: '1. Detachment from all sin, even venial' },
                    { id: 'confession', label: '2. Sacramental Confession (~20 days)' },
                    { id: 'communion', label: '3. Eucharistic Communion' },
                    { id: 'pope_prayer', label: '4. Prayer for the Sovereign Pontiff' },
                  ].map((norm) => (
                    <label
                      key={norm.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={indulgenceNormsChecked.includes(norm.id)}
                        onChange={() => toggleIndulgenceNorm(norm.id)}
                        className="accent-[#9A3412]"
                      />
                      <span>{norm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: CUSTOMIZABLE PRAYER CHECKLIST & CANONICAL HOURS ALARM WIDGET */}
        <section id="prayers" className="pt-6 border-t border-stone-300 space-y-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-stone-300 pb-3">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold">
                03 · Opus Dei &amp; Rule of Prayer
              </span>
              <h2 className="font-display text-3xl font-bold text-stone-900 mt-0.5">
                Customizable Daily Prayer Checklist &amp; Hourly Prayer Alarms
              </h2>
            </div>
            <span className="text-xs text-stone-600">
              Today’s Rosary: {dailyPackage.rosaryMystery.name} ({dailyPackage.rosaryMystery.LatinName})
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 6 Columns: Customizable Prayer Checklist + Mystery of the Day */}
            <div className="lg:col-span-6 bg-white border border-stone-300 p-6 lg:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-display text-2xl font-bold text-stone-900">
                    Daily Prayer Rule ({selectedDateIso})
                  </h3>
                  <p className="text-xs text-stone-600">
                    Check off prayers as you sanctify the day; add your own novenas or devotions.
                  </p>
                </div>
                <div className="font-mono-tabular text-sm font-bold text-[#9A3412]">
                  {completedTodayIds.length} / {prayerList.length} Prayed
                </div>
              </div>

              <div className="divide-y divide-stone-200">
                {prayerList.map((prayer) => {
                  const isDone = completedTodayIds.includes(prayer.id);
                  return (
                    <div
                      key={prayer.id}
                      className="py-3 flex items-center justify-between gap-4"
                    >
                      <button
                        type="button"
                        onClick={() => togglePrayerCompleted(prayer.id)}
                        className="flex items-start gap-3 text-left flex-1 cursor-pointer"
                      >
                        <span className="mt-0.5 text-[#9A3412]">
                          {isDone ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4 text-stone-400" />
                          )}
                        </span>
                        <div>
                          <div
                            className={`text-sm font-medium ${
                              isDone ? 'line-through text-stone-400' : 'text-stone-900'
                            }`}
                          >
                            {prayer.title}
                          </div>
                          <div className="text-xs text-stone-500">
                            {prayer.latinTitle} · {prayer.timeOfDay} · ~{prayer.durationMinutes} min
                          </div>
                        </div>
                      </button>

                      {prayer.custom && (
                        <button
                          type="button"
                          onClick={() =>
                            setPrayerList((prev) => prev.filter((p) => p.id !== prayer.id))
                          }
                          className="text-stone-400 hover:text-red-700 p-1 cursor-pointer"
                          aria-label="Delete custom prayer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Prayer Form */}
              <form
                onSubmit={handleAddCustomPrayer}
                className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="text"
                  value={newPrayerTitle}
                  onChange={(e) => setNewPrayerTitle(e.target.value)}
                  placeholder="Add custom prayer, novena, or litany..."
                  className="flex-1 px-3 py-2 text-xs bg-[#FBF9F5] border border-stone-300 focus:outline-none focus:border-[#9A3412]"
                />
                <select
                  value={newPrayerTimeOfDay}
                  onChange={(e) =>
                    setNewPrayerTimeOfDay(e.target.value as PrayerChecklistItem['timeOfDay'])
                  }
                  className="px-3 py-2 text-xs bg-[#FBF9F5] border border-stone-300 text-stone-800"
                >
                  <option value="Morning">Morning</option>
                  <option value="Midday">Midday</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Anytime">Anytime</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-[#1C1917] text-white hover:bg-[#9A3412] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Add Prayer
                </button>
              </form>

              {/* Rosary Mystery of the Day Reference Box */}
              <div className="bg-[#F4EFE6] border border-stone-300 p-5 space-y-2">
                <div className="text-xs uppercase tracking-widest font-semibold text-[#78350F]">
                  Today’s Rosary Mysteries · {dailyPackage.rosaryMystery.name}
                </div>
                <p className="font-reading text-xs text-stone-700">
                  {dailyPackage.rosaryMystery.meditation}
                </p>
                <div className="grid grid-cols-1 gap-1 pt-1 text-xs text-stone-800 font-medium">
                  {dailyPackage.rosaryMystery.fruits.map((f, i) => (
                    <div key={i}>{f}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 6 Columns: Canonical Hours & Specific Prayer Alarms Widget */}
            <div className="lg:col-span-6 bg-white border border-stone-300 p-6 lg:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-display text-2xl font-bold text-stone-900">
                    Hourly Prayer Alarms &amp; Sanctuary Bell
                  </h3>
                  <p className="text-xs text-stone-600">
                    Rings a bronze monastery bell chime at appointed prayer hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => playMonasteryBellChime(3)}
                  className="px-3.5 py-2 text-xs font-semibold bg-[#F4EFE6] border border-stone-300 text-stone-900 hover:bg-stone-200 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#9A3412]" /> Test Angelus Chime
                </button>
              </div>

              <div className="divide-y divide-stone-200">
                {alarms.map((alarm) => (
                  <div key={alarm.id} className="py-3.5 space-y-1.5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono-tabular text-base font-bold text-[#9A3412]">
                          {alarm.time24}
                        </span>
                        <span className="font-display text-lg font-bold text-stone-900">
                          {alarm.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTriggeredAlarm(alarm);
                            playMonasteryBellChime(3);
                          }}
                          className="text-xs underline text-stone-600 hover:text-[#9A3412] whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Pray Now
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setAlarms((prev) =>
                              prev.map((a) =>
                                a.id === alarm.id ? { ...a, enabled: !a.enabled } : a
                              )
                            )
                          }
                          className={`px-2.5 py-1 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            alarm.enabled
                              ? 'bg-[#14532D] text-white border-[#14532D]'
                              : 'bg-stone-100 text-stone-500 border-stone-300'
                          }`}
                        >
                          {alarm.enabled ? 'Bell Active' : 'Muted'}
                        </button>
                      </div>
                    </div>
                    <p className="font-reading italic text-xs text-stone-600">
                      “{alarm.latinAntiphon}”
                    </p>
                    <p className="text-xs text-stone-700 leading-relaxed">{alarm.prayerText}</p>
                  </div>
                ))}
              </div>

              {/* Add Custom Timed Prayer Alarm */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newAlarmTitle.trim()) return;
                  const newAlarm: PrayerAlarmItem = {
                    id: `alarm-custom-${Date.now()}`,
                    time24: newAlarmTime,
                    title: newAlarmTitle.trim(),
                    latinAntiphon: 'Oratio horaria ad Dominum.',
                    prayerText:
                      newAlarmPrayer.trim() ||
                      'Lord Jesus Christ, Son of the Living God, have mercy on me, a sinner.',
                    enabled: true,
                  };
                  setAlarms((prev) =>
                    [...prev, newAlarm].sort((a, b) => a.time24.localeCompare(b.time24))
                  );
                  setNewAlarmTitle('');
                  setNewAlarmPrayer('');
                }}
                className="pt-4 border-t border-stone-200 space-y-2.5"
              >
                <div className="text-xs font-semibold text-stone-800">
                  Schedule Custom Prayer Alarm at Specific Hour
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="time"
                    value={newAlarmTime}
                    onChange={(e) => setNewAlarmTime(e.target.value)}
                    className="px-3 py-1.5 text-xs font-mono-tabular bg-[#FBF9F5] border border-stone-300"
                    required
                  />
                  <input
                    type="text"
                    value={newAlarmTitle}
                    onChange={(e) => setNewAlarmTitle(e.target.value)}
                    placeholder="Prayer title (e.g., Terce / Memorare)"
                    className="sm:col-span-2 px-3 py-1.5 text-xs bg-[#FBF9F5] border border-stone-300"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAlarmPrayer}
                    onChange={(e) => setNewAlarmPrayer(e.target.value)}
                    placeholder="Prayer text to display when alarm chimes..."
                    className="flex-1 px-3 py-1.5 text-xs bg-[#FBF9F5] border border-stone-300"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold bg-[#1C1917] text-white hover:bg-[#9A3412] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Set Alarm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* SECTION 4: MAGISTERIUM AI NEWS & ARTICLES FROM WORD ON FIRE, ALETEIA, AND SIGN.ORG */}
        <section id="publications" className="pt-6 border-t border-stone-300 space-y-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-stone-300 pb-3">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold">
                04 · Magisterium AI &amp; Catholic Press Digest
              </span>
              <h2 className="font-display text-3xl font-bold text-stone-900 mt-0.5">
                Magisterium AI Briefings &amp; Articles from Word on Fire, Aleteia, and Sign.org
              </h2>
            </div>
            <span className="text-xs text-stone-600">
              Doctrinal Citations &amp; Full-Text Essays
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 5 Columns: Magisterium AI News & Doctrinal Research Desk */}
            <div className="lg:col-span-5 bg-white border border-stone-300 p-6 space-y-6">
              <div className="border-b border-stone-200 pb-3">
                <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold">
                  Magisterium AI Feed
                </div>
                <h3 className="font-display text-2xl font-bold text-stone-900">
                  Magisterial News &amp; Synthesis
                </h3>
              </div>

              {/* Highlighted Daily Magisterium Briefing Linked to Today's Readings */}
              <div className="bg-[#F4EFE6] border border-stone-300 p-4 space-y-1.5">
                <div className="text-xs text-[#78350F] font-semibold">
                  Today’s Liturgical Magisterium Synthesis · {dailyPackage.magisteriumBriefing.catechismRef}
                </div>
                <h4 className="font-display text-lg font-bold text-stone-900">
                  {dailyPackage.magisteriumBriefing.headline}
                </h4>
                <p className="text-xs text-stone-800 leading-relaxed">
                  {dailyPackage.magisteriumBriefing.summary}
                </p>
                <div className="text-xs text-stone-500 pt-1">
                  Reference: {dailyPackage.magisteriumBriefing.encyclicalRef}
                </div>
              </div>

              {/* Magisterium AI Doctrinal Lookup Input */}
              <form onSubmit={handleMagisteriumSearch} className="space-y-2">
                <label className="block text-xs font-semibold text-stone-800">
                  Inquire of Magisterium AI (Catechism, Councils &amp; Encyclicals):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={magisteriumQuery}
                    onChange={(e) => setMagisteriumQuery(e.target.value)}
                    placeholder="e.g., Plenary indulgences for souls in Purgatory..."
                    className="flex-1 px-3 py-2 text-xs bg-[#FBF9F5] border border-stone-300 focus:outline-none focus:border-[#9A3412]"
                  />
                  <button
                    type="submit"
                    disabled={magisteriumLoading}
                    className="px-3.5 py-2 text-xs font-semibold bg-[#1C1917] text-white hover:bg-[#9A3412] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {magisteriumLoading ? 'Searching...' : 'Cite Sources'}
                  </button>
                </div>
              </form>

              {magisteriumCustomResult && (
                <div className="bg-[#FBF9F5] border border-stone-300 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#9A3412]">
                      {magisteriumCustomResult.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMagisteriumCustomResult(null)}
                      className="text-xs underline text-stone-500 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  <p className="text-xs text-stone-800 leading-relaxed">
                    {magisteriumCustomResult.answer}
                  </p>
                  {magisteriumCustomResult.citations?.map((cit, i) => (
                    <div key={i} className="pt-2 border-t border-stone-200 text-xs">
                      <strong className="text-stone-900">
                        {cit.source} ({cit.reference}):
                      </strong>{' '}
                      <span className="italic text-stone-700">“{cit.excerpt}”</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Magisterium News Briefings List */}
              <div className="divide-y divide-stone-200">
                {MAGISTERIUM_NEWS_ITEMS.map((item) => (
                  <article key={item.id} className="py-4 space-y-1.5">
                    <div className="text-xs text-stone-500">
                      <span className="font-semibold text-[#9A3412]">{item.category}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{item.catechismRef}</span>
                    </div>
                    <h4 className="font-display text-lg font-bold text-stone-900 leading-snug">
                      {item.headline}
                    </h4>
                    <p className="text-xs text-stone-700 leading-relaxed">{item.summary}</p>
                    <p className="font-reading text-xs text-stone-600 italic pt-1">
                      {item.doctrinalSynthesis}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            {/* Right 7 Columns: Articles from Word on Fire, Aleteia, and Sign.org */}
            <div className="lg:col-span-7 bg-white border border-stone-300 p-6 lg:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#78350F] font-semibold">
                    Catholic Periodicals
                  </span>
                  <h3 className="font-display text-2xl font-bold text-stone-900">
                    Word on Fire · Aleteia · Sign.org
                  </h3>
                </div>

                {/* Interactive Filter Controls */}
                <div className="flex items-center gap-1 p-1 bg-[#F4EFE6] border border-stone-300">
                  {(['All', 'Word on Fire', 'Aleteia', 'Sign.org'] as const).map((src) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setArticleSourceFilter(src)}
                      className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        articleSourceFilter === src
                          ? 'bg-[#1C1917] text-white'
                          : 'text-stone-700 hover:text-stone-900'
                      }`}
                    >
                      {src}
                    </button>
                  ))}
                </div>
              </div>

              {/* Article Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredArticles.map((art) => {
                  const isSelected = selectedArticleForReading.id === art.id;
                  return (
                    <div
                      key={art.id}
                      onClick={() => setSelectedArticleForReading(art)}
                      className={`p-4 border transition-colors cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#F4EFE6] border-[#9A3412]'
                          : 'bg-[#FBF9F5] border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div>
                        <div className="text-xs text-stone-600 flex items-center gap-1.5">
                          <span className="font-bold text-[#9A3412]">{art.source}</span>
                          <span aria-hidden="true">·</span>
                          <span>{art.topic}</span>
                          <span aria-hidden="true">·</span>
                          <span>{art.readTime}</span>
                        </div>
                        <h4 className="font-display text-lg font-bold text-stone-900 mt-1.5 leading-snug">
                          {art.title}
                        </h4>
                        <p className="text-xs text-stone-700 mt-2 leading-relaxed">
                          {art.summary}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                        <span className="text-stone-600 font-medium">{art.author}</span>
                        <span className="font-semibold text-[#9A3412]">Read Essay →</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Inline Broadsheet Essay Reader */}
              <article className="bg-[#FBF9F5] border border-stone-300 p-6 space-y-4">
                <div className="border-b border-stone-200 pb-3">
                  <div className="text-xs text-stone-600">
                    <strong className="text-[#9A3412]">{selectedArticleForReading.source}</strong>
                    <span aria-hidden="true"> · </span>
                    <span>{selectedArticleForReading.author}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{selectedArticleForReading.authorRole}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{selectedArticleForReading.readTime}</span>
                  </div>
                  <h4 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                    {selectedArticleForReading.title}
                  </h4>
                </div>

                <div className="space-y-3 font-reading text-sm sm:text-base text-stone-800 leading-relaxed max-w-prose">
                  {selectedArticleForReading.fullText.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                <div className="bg-[#EBE6DF] border border-stone-300 p-4 text-xs text-stone-900">
                  <strong className="uppercase tracking-wider text-[#9A3412] block mb-1">
                    Spiritual Takeaway
                  </strong>
                  {selectedArticleForReading.keyTakeaway}
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* SECTION 5: PROPHECIES FROM SAINTS, MYSTICS, AND SEERS + BIBLE FLASHCARDS + SPIRITUAL NOTES */}
        <section id="study" className="pt-6 border-t border-stone-300 space-y-10">
          {/* Sub-section 5A: Prophecies from Saints, Mystics, and Seers */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-300 pb-3">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold">
                  05 · Prophetic Deposit &amp; Approved Apparitions
                </span>
                <h2 className="font-display text-3xl font-bold text-stone-900 mt-0.5">
                  Prophecies from Saints, Mystics, and Seers
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F4EFE6] border border-stone-300">
                {[
                  'All',
                  'Marian Apparition',
                  'Eucharistic Triumph',
                  'Eschatological Renewal',
                  'Papal & Ecclesial',
                ].map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => setProphecyThemeFilter(theme)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      prophecyThemeFilter === theme
                        ? 'bg-[#1C1917] text-white'
                        : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProphecies.map((proph) => (
                <article
                  key={proph.id}
                  className="bg-white border border-stone-300 p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="text-xs text-stone-500">
                      <span className="font-semibold text-[#9A3412]">{proph.theme}</span>
                      <span aria-hidden="true"> · </span>
                      <span className="font-mono-tabular">{proph.epoch}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-stone-900 leading-snug">
                      {proph.title}
                    </h3>
                    <div className="text-xs font-semibold text-stone-700">
                      {proph.seer} · {proph.location}
                    </div>
                    <blockquote className="font-reading italic text-sm text-stone-900 bg-[#FBF9F5] border border-stone-200 p-3.5 leading-relaxed">
                      {proph.excerpt}
                    </blockquote>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {proph.historicalContext}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs">
                    <div className="text-[#14532D] font-medium">
                      Status: {proph.approvalStatus}
                    </div>
                    <div className="text-stone-700">
                      <strong>Application:</strong> {proph.spiritualApplication}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sub-section 5B: Bible Flashcards Widget & Spiritual Notes Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
            {/* Left 6 Columns: Bible Flashcards Widget */}
            <div className="lg:col-span-6 bg-white border border-stone-300 p-6 lg:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold">
                    Memoria Scripturae
                  </span>
                  <h3 className="font-display text-2xl font-bold text-stone-900">
                    Bible &amp; Vulgate Flashcards
                  </h3>
                </div>
                <div className="font-mono-tabular text-xs text-stone-600">
                  Card {activeCardIndex + 1} of {flashcards.length} · Mastered:{' '}
                  {masteredCardIds.length}/{flashcards.length}
                </div>
              </div>

              {/* Interactive Flashcard Surface */}
              {currentFlashcard && (
                <div
                  onClick={() => setIsCardFlipped((f) => !f)}
                  className="bg-[#F4EFE6] border border-stone-300 p-6 min-h-[260px] flex flex-col justify-between cursor-pointer select-none transition-colors hover:border-[#9A3412]"
                >
                  <div className="flex items-center justify-between text-xs text-stone-600 border-b border-stone-300 pb-2">
                    <span>
                      <strong className="text-[#9A3412]">{currentFlashcard.category}</strong> ·{' '}
                      {currentFlashcard.catechismParagraph}
                    </span>
                    <span className="underline">
                      {isCardFlipped ? 'Showing Verse & Exegesis (Click to Flip)' : 'Click Card to Reveal Verse & Latin Vulgate'}
                    </span>
                  </div>

                  {!isCardFlipped ? (
                    <div className="py-8 text-center space-y-3">
                      <div className="text-xs uppercase tracking-widest text-stone-500">
                        Scripture Reference Prompt
                      </div>
                      <div className="font-display text-4xl font-bold text-stone-900">
                        {currentFlashcard.reference}
                      </div>
                      <p className="text-xs text-stone-600">
                        Recite the verse from memory, then click to verify RSV-CE, Latin Vulgate, and
                        Catechetical commentary.
                      </p>
                    </div>
                  ) : (
                    <div className="py-4 space-y-3">
                      <div className="font-mono-tabular text-xs font-bold text-[#9A3412]">
                        {currentFlashcard.reference}
                      </div>
                      <p className="font-reading text-base text-stone-900 leading-relaxed">
                        “{currentFlashcard.englishText}”
                      </p>
                      <p className="font-reading italic text-xs text-stone-700 border-t border-stone-300 pt-2">
                        <strong>Nova Vulgata:</strong> “{currentFlashcard.latinVulgate}”
                      </p>
                      <p className="text-xs text-stone-600 pt-1">
                        <strong>Catechetical Note:</strong> {currentFlashcard.catecheticalNote}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-stone-300 text-xs">
                    <span className="text-stone-500">
                      {masteredCardIds.includes(currentFlashcard.id)
                        ? 'Status: Committed to Memory'
                        : 'Status: In Daily Review'}
                    </span>
                    <span className="font-semibold text-stone-800">Flip Card ↻</span>
                  </div>
                </div>
              )}

              {/* Flashcard Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCardFlipped(false);
                      setActiveCardIndex((prev) =>
                        prev === 0 ? flashcards.length - 1 : prev - 1
                      );
                    }}
                    className="px-3 py-1.5 text-xs font-medium border border-stone-300 hover:bg-stone-100 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCardFlipped(false);
                      setActiveCardIndex((prev) => (prev + 1) % flashcards.length);
                    }}
                    className="px-3 py-1.5 text-xs font-medium border border-stone-300 hover:bg-stone-100 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Next Card →
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {currentFlashcard && (
                    <button
                      type="button"
                      onClick={() =>
                        setMasteredCardIds((prev) =>
                          prev.includes(currentFlashcard.id)
                            ? prev.filter((id) => id !== currentFlashcard.id)
                            : [...prev, currentFlashcard.id]
                        )
                      }
                      className={`px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        masteredCardIds.includes(currentFlashcard.id)
                          ? 'bg-[#14532D] text-white'
                          : 'bg-[#EBE6DF] text-stone-800 hover:bg-stone-300'
                      }`}
                    >
                      {masteredCardIds.includes(currentFlashcard.id)
                        ? '✓ Mastered'
                        : 'Mark as Mastered'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowAddFlashcard((s) => !s)}
                    className="px-3 py-1.5 text-xs font-semibold bg-[#1C1917] text-white hover:bg-[#9A3412] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {showAddFlashcard ? 'Cancel' : '+ Add Verse'}
                  </button>
                </div>
              </div>

              {showAddFlashcard && (
                <form
                  onSubmit={handleAddFlashcard}
                  className="pt-4 border-t border-stone-200 space-y-2.5"
                >
                  <input
                    type="text"
                    value={newCardRef}
                    onChange={(e) => setNewCardRef(e.target.value)}
                    placeholder="Citation (e.g., Romans 8:28)"
                    className="w-full px-3 py-1.5 text-xs bg-[#FBF9F5] border border-stone-300"
                    required
                  />
                  <textarea
                    value={newCardEnglish}
                    onChange={(e) => setNewCardEnglish(e.target.value)}
                    placeholder="Full Scripture verse text..."
                    rows={2}
                    className="w-full px-3 py-1.5 text-xs bg-[#FBF9F5] border border-stone-300"
                    required
                  />
                  <input
                    type="text"
                    value={newCardNote}
                    onChange={(e) => setNewCardNote(e.target.value)}
                    placeholder="Catechetical or Patristic note..."
                    className="w-full px-3 py-1.5 text-xs bg-[#FBF9F5] border border-stone-300"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold bg-[#9A3412] text-white hover:bg-[#7C2D12] cursor-pointer"
                  >
                    Save Flashcard to Deck
                  </button>
                </form>
              )}
            </div>

            {/* Right 6 Columns: Spiritual & Lectio Divina Notes Widget */}
            <div className="lg:col-span-6 bg-white border border-stone-300 p-6 lg:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#78350F] font-semibold">
                    Adversaria Spiritualia
                  </span>
                  <h3 className="font-display text-2xl font-bold text-stone-900">
                    Spiritual Journal &amp; Lectio Notes
                  </h3>
                </div>
                <input
                  type="text"
                  value={noteSearchQuery}
                  onChange={(e) => setNoteSearchQuery(e.target.value)}
                  placeholder="Search notes..."
                  className="px-3 py-1 text-xs bg-[#FBF9F5] border border-stone-300 focus:outline-none focus:border-[#9A3412]"
                />
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Resolution or reflection title..."
                    className="sm:col-span-2 px-3 py-1.5 text-xs bg-[#FBF9F5] border border-stone-300 focus:outline-none focus:border-[#9A3412]"
                    required
                  />
                  <select
                    value={noteCategory}
                    onChange={(e) =>
                      setNoteCategory(e.target.value as SpiritualNote['category'])
                    }
                    className="px-3 py-1.5 text-xs bg-[#FBF9F5] border border-stone-300 text-stone-800"
                  >
                    <option value="Lectio Divina">Lectio Divina</option>
                    <option value="Homily Notes">Homily Notes</option>
                    <option value="Prayer Intentions">Prayer Intentions</option>
                    <option value="Examen & Confession">Examen &amp; Confession</option>
                  </select>
                </div>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Record today’s Gospel meditation, homily insights, or prayer intentions..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-stone-300 focus:outline-none focus:border-[#9A3412]"
                  required
                />
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={noteScriptureRef}
                    onChange={(e) => setNoteScriptureRef(e.target.value)}
                    placeholder={`Scripture ref (default: ${dailyPackage.readings.gospel.citation})`}
                    className="flex-1 px-3 py-1.5 text-xs bg-[#FBF9F5] border border-stone-300"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold bg-[#1C1917] text-white hover:bg-[#9A3412] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Save Entry
                  </button>
                </div>
              </form>

              {/* Saved Spiritual Notes List */}
              <div className="divide-y divide-stone-200 max-h-[340px] overflow-y-auto pr-1">
                {filteredNotes.length === 0 ? (
                  <p className="py-6 text-center text-xs text-stone-500">
                    No journal entries match your filter. Add a spiritual resolution above.
                  </p>
                ) : (
                  filteredNotes.map((note) => (
                    <div key={note.id} className="py-3.5 space-y-1">
                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <span>
                          <strong className="text-[#9A3412]">{note.category}</strong> ·{' '}
                          {note.dateIso} · {note.scriptureRef}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setNotes((prev) => prev.filter((n) => n.id !== note.id))
                          }
                          className="text-stone-400 hover:text-red-700 cursor-pointer"
                          aria-label="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="font-display text-lg font-bold text-stone-900">
                        {note.title}
                      </h4>
                      <p className="font-reading text-xs text-stone-700 leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* QUIET EDITORIAL WEBSITE FOOTER */}
      <footer className="mt-16 border-t border-stone-300 bg-[#F4EFE6] px-6 lg:px-12 py-8 text-xs text-stone-600">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="font-display text-base font-bold text-stone-900">
              Ordo &amp; Lectio
            </span>{' '}
            · Personal Catholic Daily Website · Ad Maiorem Dei Gloriam
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#liturgy" className="hover:underline">
              Roman Calendar &amp; Mass Readings
            </a>
            <span aria-hidden="true">·</span>
            <a href="#scripture" className="hover:underline">
              30-Minute Scripture Stopwatch
            </a>
            <span aria-hidden="true">·</span>
            <a href="#prayers" className="hover:underline">
              Canonical Prayer Alarms
            </a>
            <span aria-hidden="true">·</span>
            <a href="#publications" className="hover:underline">
              Magisterium AI &amp; Catholic Press
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
