import React, { useState } from 'react';
import { Language, HealingContent } from '../types';
import { HEALING_ITEMS } from '../data/mockData';
import { soothingAudio } from '../utils/audio';
import { QuranAudioPlayer } from './QuranAudioPlayer';

interface WellnessTabProps {
  language: Language;
}

export const WellnessTab: React.FC<WellnessTabProps> = ({ language }) => {
  const isTh = language === 'th';
  const [activeCategory, setActiveCategory] = useState<'all' | 'quran' | 'dua' | 'hadith' | 'reflection'>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<HealingContent | null>(null);
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  const [breathingStep, setBreathingStep] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(4);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(84); // 1:24
  const [savedReminder, setSavedReminder] = useState(false);
  const [personalPreference, setPersonalPreference] = useState<'islamic' | 'faith' | 'comfort'>('islamic');
  const [activeSubView, setActiveSubView] = useState<'overview' | 'islamic'>('islamic');

  const toggleBookmark = (id: string) => {
    soothingAudio.playGentleChime();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAudioToggle = () => {
    if (isPlayingAudio) {
      soothingAudio.pause();
      setIsPlayingAudio(false);
    } else {
      soothingAudio.play((sec) => setAudioSeconds(sec));
      setIsPlayingAudio(true);
    }
  };

  // Guided breathing loop
  const startBreathingSession = () => {
    setShowBreathingModal(true);
    soothingAudio.playGentleChime();
    setBreathingStep('inhale');
    setBreathingCount(4);
  };

  React.useEffect(() => {
    if (!showBreathingModal) return;
    const interval = setInterval(() => {
      setBreathingCount((prev) => {
        if (prev <= 1) {
          if (breathingStep === 'inhale') {
            setBreathingStep('hold');
            return 4;
          } else if (breathingStep === 'hold') {
            setBreathingStep('exhale');
            return 6;
          } else {
            setBreathingStep('inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showBreathingModal, breathingStep]);

  const filteredItems = HEALING_ITEMS.filter((item) =>
    activeCategory === 'all' ? true : item.category === activeCategory
  );

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full max-w-[1140px] mx-auto px-5 md:px-10 pt-6 pb-28 md:pb-16 flex flex-col gap-8 animate-fade-in">
      {/* Healing Space Header */}
      <section className="flex flex-col items-center text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#091e42] tracking-tight flex items-center justify-center gap-2">
          <span>💙</span> HEALING SPACE
        </h1>
        <p className="text-sm md:text-base text-slate-600">
          {isTh ? 'พื้นที่พักใจ เติมเต็มพลังบวกและความสงบ' : 'A sanctuary for rest and inner peace'}
        </p>

        {/* View Switcher Pills */}
        <div className="flex bg-blue-50 p-1 rounded-full border border-blue-200 mt-2">
          <button
            onClick={() => setActiveSubView('islamic')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeSubView === 'islamic'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-blue-900 hover:bg-blue-100'
            }`}
          >
            ☪️ {isTh ? 'Islamic Healing (คัมภีร์ & ดุอาอ์)' : 'Islamic Healing'}
          </button>
          <button
            onClick={() => setActiveSubView('overview')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeSubView === 'overview'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-blue-900 hover:bg-blue-100'
            }`}
          >
            🌿 {isTh ? 'หมวดหมู่พักใจทั้งหมด' : 'All Categories'}
          </button>
        </div>
      </section>

      {/* Main Quote Card: "วันนี้ พักได้ ไม่ผิดเลย" */}
      <section className="w-full">
        <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white flex items-center justify-center min-h-[160px] md:min-h-[190px] p-6 shadow-md border border-blue-700/50">
          <div className="pattern-overlay absolute inset-0 opacity-20 pointer-events-none"></div>
          <div className="z-10 relative text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide mb-2">
              "{isTh ? 'วันนี้ พักได้ ไม่ผิดเลย' : "Today, it's okay to rest"}"
            </h2>
            <p className="text-xs md:text-sm text-blue-200">
              {isTh
                ? 'หยุดพักสักนิด หายใจช้าๆ แล้วค่อยก้าวต่อไป'
                : 'Take a gentle breath, pause, and give yourself grace'}
            </p>
          </div>
        </div>
      </section>

      {/* If Overview view is selected, show Bento Grid Categories */}
      {activeSubView === 'overview' && (
        <section className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => {
                setActiveSubView('islamic');
                setActiveCategory('reflection');
              }}
              className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-xs hover:shadow-md border border-slate-200 active:scale-95 transition-all group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center text-2xl group-hover:bg-blue-800 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl material-symbols-filled">spa</span>
              </div>
              <span className="font-bold text-xs md:text-sm text-[#091e42]">
                {isTh ? 'ข้อคิดเยียวยาใจ' : 'Words of Comfort'}
              </span>
            </button>

            <button
              onClick={() => setActiveSubView('islamic')}
              className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-xs hover:shadow-md border border-slate-200 active:scale-95 transition-all ring-2 ring-blue-700/20 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center text-2xl group-hover:bg-blue-800 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl material-symbols-filled">mosque</span>
              </div>
              <span className="font-bold text-xs md:text-sm text-[#091e42]">Islamic Healing</span>
            </button>

            <button
              onClick={() => startBreathingSession()}
              className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-xs hover:shadow-md border border-slate-200 active:scale-95 transition-all group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center text-2xl group-hover:bg-blue-800 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl material-symbols-filled">self_improvement</span>
              </div>
              <span className="font-bold text-xs md:text-sm text-[#091e42]">
                {isTh ? 'ฝึกสติและพักใจ' : 'Mindfulness Rest'}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSubView('islamic');
                setActiveCategory('hadith');
              }}
              className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-xs hover:shadow-md border border-slate-200 active:scale-95 transition-all group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center text-2xl group-hover:bg-blue-800 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl material-symbols-filled">menu_book</span>
              </div>
              <span className="font-bold text-xs md:text-sm text-[#091e42]">
                {isTh ? 'ข้อคิดคุณธรรม' : 'Ethical Reflections'}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSubView('islamic');
                setActiveCategory('dua');
              }}
              className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-xs hover:shadow-md border border-slate-200 active:scale-95 transition-all col-span-2 md:col-span-1 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center text-2xl group-hover:bg-blue-800 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl material-symbols-filled">front_hand</span>
              </div>
              <span className="font-bold text-xs md:text-sm text-[#091e42]">
                {isTh ? 'คำภาวนาและดุอาอ์' : "Prayers & Du'a"}
              </span>
            </button>

            <button
              onClick={handleAudioToggle}
              className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-xs hover:shadow-md border border-slate-200 active:scale-95 transition-all col-span-2 md:col-span-1 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center text-2xl group-hover:bg-blue-800 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl material-symbols-filled">headphones</span>
              </div>
              <span className="font-bold text-xs md:text-sm text-[#091e42]">
                {isPlayingAudio
                  ? isTh
                    ? 'กำลังเปิดเสียงคลื่นบำบัด...'
                    : 'Playing Audio...'
                  : isTh
                  ? 'เสียงสงบจิตใจ'
                  : 'Calming Sounds'}
              </span>
            </button>

            <button
              onClick={() => startBreathingSession()}
              className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-xs hover:shadow-md border border-slate-200 active:scale-95 transition-all col-span-2 md:col-span-2 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center text-2xl group-hover:bg-blue-800 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl material-symbols-filled">psychology</span>
              </div>
              <span className="font-bold text-xs md:text-sm text-[#091e42]">
                {isTh ? 'กิจกรรมคลายความตึงเครียด (ฝึกหายใจ 4-7-8)' : 'De-stress Exercise (Breathing 4-7-8)'}
              </span>
            </button>
          </div>
        </section>
      )}

      {/* Islamic Healing Detailed Section (as shown in mockups) */}
      <section className="w-full flex flex-col gap-6">
        {/* Banner Section */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-[#0b1e3b] text-white p-6 md:p-10 border border-blue-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="pattern-overlay absolute inset-0 opacity-20 pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-xs rounded-full text-blue-200 font-semibold text-xs mb-3 shadow-2xs border border-white/20">
              <span>☪️</span> Islamic Healing & Guidance
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              {isTh ? 'ค้นพบความสงบและการชี้ทาง' : 'Find Peace & Guidance'}
            </h2>
            <p className="text-sm md:text-base text-blue-100/90 leading-relaxed">
              {isTh
                ? 'ค้นพบความสงบทางใจผ่านอายะฮ์ ดุอาอ์ และข้อคิดที่คัดสรรมาเพื่อเยียวยาหัวใจและจิตใจของคุณในช่วงเวลาที่ท้าทาย'
                : 'Discover tranquility through verses, prayers, and reflections tailored to bring solace to your heart and mind during challenging times.'}
            </p>
          </div>
          <div className="relative z-10 hidden md:flex w-36 h-36 rounded-full bg-blue-600/30 border border-blue-400/30 items-center justify-center shadow-inner shrink-0">
            <span className="material-symbols-outlined text-6xl text-blue-200 opacity-90">
              self_improvement
            </span>
          </div>
        </div>

        {/* Categories Row (Horizontal Pills) */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-blue-800 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50'
            }`}
          >
            <span>✨</span> {isTh ? 'ทั้งหมด' : 'All'}
          </button>
          <button
            onClick={() => setActiveCategory('quran')}
            className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
              activeCategory === 'quran'
                ? 'bg-blue-800 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50'
            }`}
          >
            <span>📖</span> {isTh ? 'อัลกุรอาน' : 'Quran'}
          </button>
          <button
            onClick={() => setActiveCategory('dua')}
            className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
              activeCategory === 'dua'
                ? 'bg-blue-800 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50'
            }`}
          >
            <span>🤲</span> {isTh ? 'ดุอาอ์' : "Du'a"}
          </button>
          <button
            onClick={() => setActiveCategory('hadith')}
            className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
              activeCategory === 'hadith'
                ? 'bg-blue-800 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50'
            }`}
          >
            <span>📜</span> {isTh ? 'หะดีษ' : 'Hadith'}
          </button>
          <button
            onClick={() => setActiveCategory('reflection')}
            className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
              activeCategory === 'reflection'
                ? 'bg-blue-800 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50'
            }`}
          >
            <span>🕌</span> {isTh ? 'ข้อคิด' : 'Reflection'}
          </button>
        </div>

        {/* Daily Reminder Banner */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-5 shadow-xs border border-blue-200">
          <div className="w-14 h-14 shrink-0 rounded-full bg-white flex items-center justify-center text-3xl shadow-xs border border-blue-100">
            🌙
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-lg text-[#091e42] mb-1">
              {isTh ? 'เตือนใจประจำวัน' : 'Daily Reminder'}
            </h3>
            <p className="text-sm md:text-base text-slate-600 italic font-medium">
              "Indeed, with hardship [will be] ease." - Surah Ash-Sharh (94:6)
            </p>
          </div>
          <button
            onClick={() => {
              setSavedReminder(!savedReminder);
              soothingAudio.playGentleChime();
            }}
            className={`shrink-0 px-6 py-2.5 rounded-full border-2 font-semibold text-xs md:text-sm transition-all active:scale-95 cursor-pointer ${
              savedReminder
                ? 'bg-blue-800 text-white border-blue-800'
                : 'border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white'
            }`}
          >
            {savedReminder
              ? isTh
                ? 'บันทึกแล้ว ✓'
                : 'Saved ✓'
              : isTh
              ? 'บันทึก'
              : 'Save'}
          </button>
        </div>

        {/* AUTHENTIC QURAN AUDIO RECITATIONS & THEMATIC EXPLANATION PLAYER */}
        <QuranAudioPlayer language={language} />

        {/* Bento Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Render filtered articles */}
          {filteredItems.map((item) => {
            const isBookmarked = bookmarkedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 soft-shadow border border-slate-200 flex flex-col h-full hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-md text-blue-800 font-semibold text-xs border border-blue-100">
                    <span className="material-symbols-outlined text-[16px]">
                      {item.category === 'quran'
                        ? 'menu_book'
                        : item.category === 'dua'
                        ? 'front_hand'
                        : item.category === 'hadith'
                        ? 'history_edu'
                        : 'lightbulb'}
                    </span>
                    <span>
                      {item.category === 'quran'
                        ? isTh ? 'อัลกุรอาน' : 'Quran'
                        : item.category === 'dua'
                        ? isTh ? 'ดุอาอ์' : "Du'a"
                        : item.category === 'hadith'
                        ? isTh ? 'หะดีษ' : 'Hadith'
                        : isTh ? 'ข้อคิด' : 'Reflection'}
                    </span>
                  </span>
                  <button
                    onClick={() => toggleBookmark(item.id)}
                    className="text-slate-400 hover:text-blue-800 transition-colors p-1 cursor-pointer"
                  >
                    <span
                      className={`material-symbols-outlined text-xl ${
                        isBookmarked ? 'material-symbols-filled text-blue-800' : ''
                      }`}
                    >
                      {isBookmarked ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>
                </div>

                <h3 className="font-bold text-lg text-[#091e42] mb-2 leading-snug">
                  {isTh ? item.titleTh : item.titleEn}
                </h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed flex-grow mb-4">
                  {isTh ? item.quoteTh || item.contentTh : item.quoteEn || item.contentEn}
                </p>

                <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500">
                    {isTh ? item.referenceTh : item.referenceEn}
                  </span>
                  <button
                    onClick={() => setSelectedArticle(item)}
                    className="font-semibold text-blue-800 flex items-center gap-1 group-hover:gap-1.5 transition-all cursor-pointer"
                  >
                    <span>{isTh ? 'อ่านต่อ' : 'Read More'}</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Large Card: Reconnecting with Your Inner Self */}
          <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-[#0b1e3b] rounded-3xl p-6 md:p-8 shadow-md text-white flex flex-col justify-between relative overflow-hidden md:col-span-2 lg:col-span-2 min-h-[260px] border border-blue-800">
            <div className="pattern-overlay absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"></div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-md text-white font-medium text-xs mb-3 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                  <span>{isTh ? 'ข้อคิดฝึกสติ' : 'Mindfulness Reflection'}</span>
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 max-w-lg">
                  {isTh ? 'การเชื่อมต่อกับตัวตนภายในของคุณ' : 'Reconnecting with Your Inner Self'}
                </h3>
                <p className="text-xs md:text-sm text-blue-100/90 max-w-lg leading-relaxed">
                  {isTh
                    ? 'หยุดพัก หายใจ และทบทวนถึงสิ่งดีๆ ที่อาจมองข้ามไปในชีวิตที่เร่งรีบ สัมผัสความสงบที่อยู่ภายใน'
                    : 'Take a moment to pause, breathe, and reflect on the blessings that often go unnoticed in the rush of daily life.'}
                </p>
              </div>

              <div>
                <button
                  onClick={startBreathingSession}
                  className="bg-white text-blue-950 px-6 py-2.5 rounded-full font-bold text-xs md:text-sm hover:bg-blue-50 transition-all shadow-xs inline-flex items-center gap-2 active:scale-95 cursor-pointer"
                >
                  <span>{isTh ? 'เริ่มทบทวนตัวเอง' : 'Start Reflection'}</span>
                  <span className="material-symbols-outlined text-base">play_arrow</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Listen Audio Card */}
          <div className="bg-white rounded-3xl p-6 soft-shadow border border-slate-200 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-800 border border-blue-100">
                  <span className="material-symbols-outlined text-2xl">headphones</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm md:text-base text-[#091e42]">
                    {isTh ? 'เสียงอ่านที่นุ่มนวล' : 'Soothing Recitation'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {isTh ? 'ซูเราะฮ์ อัร-เราะห์มาน' : 'Surah Ar-Rahman'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {isTh
                  ? 'คลื่นเสียงความถี่ 432Hz ช่วยกล่อมเกลาจิตใจและคลายความวิตกกังวล'
                  : 'Harmonic calming tones to soothe the heart and alleviate worry'}
              </p>
            </div>

            {/* Audio Player Bar */}
            <div className="mt-auto bg-blue-50 rounded-2xl p-3 flex items-center gap-3 border border-blue-200">
              <button
                onClick={handleAudioToggle}
                className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center shrink-0 hover:bg-blue-900 active:scale-90 transition-all shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">
                  {isPlayingAudio ? 'pause' : 'play_arrow'}
                </span>
              </button>
              <div className="flex-1 flex flex-col gap-1">
                <div className="h-1.5 bg-blue-200 rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-800 rounded-full transition-all"
                    style={{ width: `${(audioSeconds / 330) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-blue-950 shrink-0 font-medium">
                {formatTime(audioSeconds)} / 5:30
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Personalize Your Space Section (at bottom of mockups) */}
      <section className="w-full bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-blue-50/70 rounded-3xl p-6 md:p-8 soft-shadow flex flex-col gap-4 border border-blue-200">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-blue-800 text-3xl">psychology_alt</span>
          <h3 className="font-bold text-lg md:text-xl text-[#091e42]">
            {isTh ? 'ปรับแต่งมุมพักใจของคุณ' : 'Personalize Your Space'}
          </h3>
        </div>
        <p className="text-xs md:text-sm text-slate-600">
          {isTh
            ? 'เลือกมุมมองหรือแนวทางที่ช่วยปลอบประโลมใจคุณมากที่สุดในเวลานี้'
            : 'Select a perspective that resonates with you right now.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-1">
          <button
            onClick={() => {
              setPersonalPreference('islamic');
              soothingAudio.playGentleChime();
            }}
            className={`flex-1 rounded-full py-3 px-4 font-semibold text-xs md:text-sm text-center shadow-xs transition-all active:scale-95 cursor-pointer ${
              personalPreference === 'islamic'
                ? 'bg-blue-800 text-white border-transparent'
                : 'bg-white text-slate-800 border border-slate-200 hover:bg-blue-50'
            }`}
          >
            ☪️ Islamic Healing
          </button>
          <button
            onClick={() => {
              setPersonalPreference('faith');
              soothingAudio.playGentleChime();
            }}
            className={`flex-1 rounded-full py-3 px-4 font-semibold text-xs md:text-sm text-center shadow-xs transition-all active:scale-95 cursor-pointer ${
              personalPreference === 'faith'
                ? 'bg-blue-800 text-white border-transparent'
                : 'bg-white text-slate-800 border border-slate-200 hover:bg-blue-50'
            }`}
          >
            ✨ Faith & Reflection
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setPersonalPreference('comfort');
              soothingAudio.playGentleChime();
            }}
            className={`flex-1 rounded-full py-3 px-4 font-semibold text-xs md:text-sm text-center shadow-xs transition-all active:scale-95 cursor-pointer ${
              personalPreference === 'comfort'
                ? 'bg-blue-800 text-white border-transparent'
                : 'bg-white text-slate-800 border border-slate-200 hover:bg-blue-50'
            }`}
          >
            💌 Words of Comfort
          </button>
          <button
            onClick={() => soothingAudio.playGentleChime()}
            className="flex-1 text-slate-500 hover:text-blue-900 transition-colors py-3 px-4 font-medium text-xs md:text-sm text-center cursor-pointer"
          >
            {isTh ? 'ข้ามไปก่อน' : 'Skip for now'}
          </button>
        </div>
      </section>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-200 animate-fade-in relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 block">
              {isTh ? selectedArticle.referenceTh : selectedArticle.referenceEn}
            </span>
            <h3 className="text-xl font-bold text-[#091e42] mb-4">
              {isTh ? selectedArticle.titleTh : selectedArticle.titleEn}
            </h3>

            {selectedArticle.arabic && (
              <div className="p-4 bg-blue-50 rounded-2xl mb-4 text-center border border-blue-100">
                <p dir="rtl" className="text-xl font-bold text-blue-950 leading-loose font-serif">
                  {selectedArticle.arabic}
                </p>
              </div>
            )}

            <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-6 whitespace-pre-line">
              {isTh ? selectedArticle.contentTh : selectedArticle.contentEn}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  toggleBookmark(selectedArticle.id);
                  setSelectedArticle(null);
                }}
                className="flex-1 bg-blue-800 text-white py-3 rounded-full text-xs font-semibold hover:bg-blue-900 transition-colors cursor-pointer shadow-sm"
              >
                {bookmarkedIds.includes(selectedArticle.id)
                  ? isTh ? 'นำออกจากบุ๊กมาร์ก' : 'Remove Bookmark'
                  : isTh ? 'บันทึกบทความนี้' : 'Save to Bookmarks'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guided 4-7-8 Breathing Modal */}
      {showBreathingModal && (
        <div className="fixed inset-0 z-50 bg-[#091e42]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-slate-200 flex flex-col items-center">
            <h3 className="text-xl font-bold text-[#091e42] mb-1">
              {isTh ? 'การฝึกสติและหายใจคลายเครียด' : 'Guided 4-7-8 Breathing'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {isTh ? 'ตามจังหวะที่หัวใจค่อยๆ ผ่อนคลาย' : 'Follow the soothing breath rhythm'}
            </p>

            {/* Visual breathing circle */}
            <div className="relative w-44 h-44 flex items-center justify-center mb-6">
              <div
                className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                  breathingStep === 'inhale'
                    ? 'bg-blue-300/40 scale-110'
                    : breathingStep === 'hold'
                    ? 'bg-blue-400/50 scale-105'
                    : 'bg-blue-100/30 scale-90'
                }`}
              ></div>
              <div className="w-32 h-32 rounded-full bg-blue-800 text-white flex flex-col items-center justify-center z-10 shadow-lg">
                <span className="text-3xl font-extrabold">{breathingCount}</span>
                <span className="text-xs font-semibold uppercase tracking-wider mt-1">
                  {breathingStep === 'inhale'
                    ? isTh ? 'หายใจเข้า' : 'Inhale'
                    : breathingStep === 'hold'
                    ? isTh ? 'กลั้นไว้' : 'Hold'
                    : isTh ? 'ผ่อนลมออก' : 'Exhale'}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 italic max-w-xs mb-6">
              {breathingStep === 'inhale'
                ? isTh ? 'สูดอากาศบริสุทธิ์และความสงบเข้าสู่ปอด...' : 'Breathe in peace and calm...'
                : breathingStep === 'hold'
                ? isTh ? 'รู้สึกถึงความนิ่งสงบภายในใจ...' : 'Feel the stillness within...'
                : isTh ? 'ปล่อยความกังวลและความเหนื่อยล้าออกไป...' : 'Release all tension and stress...'}
            </p>

            <button
              onClick={() => setShowBreathingModal(false)}
              className="bg-blue-50 text-blue-900 hover:bg-blue-100 px-6 py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer"
            >
              {isTh ? 'เสร็จสิ้นการฝึก' : 'Finish Practice'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
