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
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#006a65] tracking-tight flex items-center justify-center gap-2">
          <span>💚</span> HEALING SPACE
        </h1>
        <p className="text-sm md:text-base text-[#4d6262]">
          {isTh ? 'พื้นที่พักใจ เติมเต็มพลังบวกและความสงบ' : 'A sanctuary for rest and inner peace'}
        </p>

        {/* View Switcher Pills */}
        <div className="flex bg-[#e1f7ff] p-1 rounded-full border border-[#cfe7e6] mt-2">
          <button
            onClick={() => setActiveSubView('islamic')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeSubView === 'islamic'
                ? 'bg-[#006a65] text-white shadow-xs'
                : 'text-[#006a65] hover:bg-[#d1f4ff]'
            }`}
          >
            ☪️ {isTh ? 'Islamic Healing (คัมภีร์ & ดุอาอ์)' : 'Islamic Healing'}
          </button>
          <button
            onClick={() => setActiveSubView('overview')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeSubView === 'overview'
                ? 'bg-[#006a65] text-white shadow-xs'
                : 'text-[#006a65] hover:bg-[#d1f4ff]'
            }`}
          >
            🌿 {isTh ? 'หมวดหมู่พักใจทั้งหมด' : 'All Categories'}
          </button>
        </div>
      </section>

      {/* Main Quote Card: "วันนี้ พักได้ ไม่ผิดเลย" */}
      <section className="w-full">
        <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-[#d1f4ff] via-[#e1f7ff] to-[#caeefa] flex items-center justify-center min-h-[160px] md:min-h-[190px] p-6 shadow-sm border border-[#cfe7e6]">
          <div className="pattern-overlay absolute inset-0 opacity-40 pointer-events-none"></div>
          <div className="z-10 relative text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#006a65] tracking-wide mb-2">
              "{isTh ? 'วันนี้ พักได้ ไม่ผิดเลย' : "Today, it's okay to rest"}"
            </h2>
            <p className="text-xs md:text-sm text-[#4d6262]">
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
              className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-xs hover:shadow-md border border-[#cfe7e6] active:scale-95 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#e1f7ff] text-[#006a65] flex items-center justify-center text-2xl group-hover:bg-[#2bb8b0] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl material-symbols-filled">spa</span>
              </div>
              <span className="font-bold text-xs md:text-sm text-[#001f26]">
                {isTh ? 'ข้อคิดเยียวยาใจ' : 'Words of Comfort'}
              </span>
            </button>

            <button
              onClick={() => setActiveSubView('islamic')}
              className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-xs hover:shadow-md border border-[#cfe7e6] active:scale-95 transition-all ring-2 ring-[#006a65]/20 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#e1f7ff] text-[#006a65] flex items-center justify-center text-2xl group-hover:bg-[#006a65] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl material-symbols-filled">mosque</span>
              </div>
              <span className="font-bold text-xs md:text-sm text-[#001f26]">Islamic Healing</span>
            </button>

            <button
              onClick={() => startBreathingSession()}
              className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-xs hover:shadow-md border border-[#cfe7e6] active:scale-95 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#e1f7ff] text-[#006a65] flex items-center justify-center text-2xl group-hover:bg-[#2bb8b0] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl material-symbols-filled">self_improvement</span>
              </div>
              <span className="font-bold text-xs md:text-sm text-[#001f26]">
                {isTh ? 'ฝึกสติและพักใจ' : 'Mindfulness Rest'}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSubView('islamic');
                setActiveCategory('hadith');
              }}
              className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-xs hover:shadow-md border border-[#cfe7e6] active:scale-95 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#e1f7ff] text-[#006a65] flex items-center justify-center text-2xl group-hover:bg-[#006a65] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl material-symbols-filled">menu_book</span>
              </div>
              <span className="font-bold text-xs md:text-sm text-[#001f26]">
                {isTh ? 'ข้อคิดคุณธรรม' : 'Ethical Reflections'}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSubView('islamic');
                setActiveCategory('dua');
              }}
              className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-xs hover:shadow-md border border-[#cfe7e6] active:scale-95 transition-all col-span-2 md:col-span-1 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#e1f7ff] text-[#006a65] flex items-center justify-center text-2xl group-hover:bg-[#006a65] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl material-symbols-filled">front_hand</span>
              </div>
              <span className="font-bold text-xs md:text-sm text-[#001f26]">
                {isTh ? 'คำภาวนาและดุอาอ์' : "Prayers & Du'a"}
              </span>
            </button>

            <button
              onClick={handleAudioToggle}
              className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-xs hover:shadow-md border border-[#cfe7e6] active:scale-95 transition-all col-span-2 md:col-span-1 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#e1f7ff] text-[#006a65] flex items-center justify-center text-2xl group-hover:bg-[#2bb8b0] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl material-symbols-filled">headphones</span>
              </div>
              <span className="font-bold text-xs md:text-sm text-[#001f26]">
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
              className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-xs hover:shadow-md border border-[#cfe7e6] active:scale-95 transition-all col-span-2 md:col-span-2 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#e1f7ff] text-[#006a65] flex items-center justify-center text-2xl group-hover:bg-[#006a65] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl material-symbols-filled">psychology</span>
              </div>
              <span className="font-bold text-xs md:text-sm text-[#001f26]">
                {isTh ? 'กิจกรรมคลายความตึงเครียด (ฝึกหายใจ 4-7-8)' : 'De-stress Exercise (Breathing 4-7-8)'}
              </span>
            </button>
          </div>
        </section>
      )}

      {/* Islamic Healing Detailed Section (as shown in mockups) */}
      <section className="w-full flex flex-col gap-6">
        {/* Banner Section */}
        <div className="relative rounded-3xl overflow-hidden bg-[#e1f7ff] p-6 md:p-10 border border-[#cfe7e6] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="pattern-overlay absolute inset-0 opacity-40 pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-[#006a65] font-semibold text-xs mb-3 shadow-2xs border border-[#cfe7e6]">
              <span>☪️</span> Islamic Healing
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#001f26] mb-3">
              {isTh ? 'ค้นพบความสงบและการชี้ทาง' : 'Find Peace & Guidance'}
            </h2>
            <p className="text-sm md:text-base text-[#3c4948] leading-relaxed">
              {isTh
                ? 'ค้นพบความสงบทางใจผ่านอายะฮ์ ดุอาอ์ และข้อคิดที่คัดสรรมาเพื่อเยียวยาหัวใจและจิตใจของคุณในช่วงเวลาที่ท้าทาย'
                : 'Discover tranquility through verses, prayers, and reflections tailored to bring solace to your heart and mind during challenging times.'}
            </p>
          </div>
          <div className="relative z-10 hidden md:flex w-36 h-36 rounded-full bg-gradient-to-tr from-[#2bb8b0]/30 to-[#f1fbff] items-center justify-center shadow-inner shrink-0">
            <span className="material-symbols-outlined text-6xl text-[#006a65] opacity-80">
              self_improvement
            </span>
          </div>
        </div>

        {/* Categories Row (Horizontal Pills) */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
              activeCategory === 'all'
                ? 'bg-[#006a65] text-white shadow-sm'
                : 'bg-white text-[#3c4948] border border-[#cfe7e6] hover:bg-[#e1f7ff]'
            }`}
          >
            <span>✨</span> {isTh ? 'ทั้งหมด' : 'All'}
          </button>
          <button
            onClick={() => setActiveCategory('quran')}
            className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
              activeCategory === 'quran'
                ? 'bg-[#006a65] text-white shadow-sm'
                : 'bg-white text-[#3c4948] border border-[#cfe7e6] hover:bg-[#e1f7ff]'
            }`}
          >
            <span>📖</span> {isTh ? 'อัลกุรอาน' : 'Quran'}
          </button>
          <button
            onClick={() => setActiveCategory('dua')}
            className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
              activeCategory === 'dua'
                ? 'bg-[#006a65] text-white shadow-sm'
                : 'bg-white text-[#3c4948] border border-[#cfe7e6] hover:bg-[#e1f7ff]'
            }`}
          >
            <span>🤲</span> {isTh ? 'ดุอาอ์' : "Du'a"}
          </button>
          <button
            onClick={() => setActiveCategory('hadith')}
            className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
              activeCategory === 'hadith'
                ? 'bg-[#006a65] text-white shadow-sm'
                : 'bg-white text-[#3c4948] border border-[#cfe7e6] hover:bg-[#e1f7ff]'
            }`}
          >
            <span>📜</span> {isTh ? 'หะดีษ' : 'Hadith'}
          </button>
          <button
            onClick={() => setActiveCategory('reflection')}
            className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
              activeCategory === 'reflection'
                ? 'bg-[#006a65] text-white shadow-sm'
                : 'bg-white text-[#3c4948] border border-[#cfe7e6] hover:bg-[#e1f7ff]'
            }`}
          >
            <span>🕌</span> {isTh ? 'ข้อคิด' : 'Reflection'}
          </button>
        </div>

        {/* Daily Reminder Banner */}
        <div className="bg-gradient-to-r from-[#cfe7e6]/50 via-[#d1f4ff] to-[#caeefa]/60 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-5 shadow-xs border border-[#cfe7e6]">
          <div className="w-14 h-14 shrink-0 rounded-full bg-white flex items-center justify-center text-3xl shadow-xs">
            🌙
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-lg text-[#001f26] mb-1">
              {isTh ? 'เตือนใจประจำวัน' : 'Daily Reminder'}
            </h3>
            <p className="text-sm md:text-base text-[#3c4948] italic font-medium">
              "Indeed, with hardship [will be] ease." - Surah Ash-Sharh (94:6)
            </p>
          </div>
          <button
            onClick={() => {
              setSavedReminder(!savedReminder);
              soothingAudio.playGentleChime();
            }}
            className={`shrink-0 px-6 py-2.5 rounded-full border-2 font-semibold text-xs md:text-sm transition-all active:scale-95 ${
              savedReminder
                ? 'bg-[#006a65] text-white border-[#006a65]'
                : 'border-[#006a65] text-[#006a65] hover:bg-[#006a65] hover:text-white'
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
                className="bg-white rounded-3xl p-6 soft-shadow border border-[#cfe7e6]/70 flex flex-col h-full hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e1f7ff] rounded-md text-[#006a65] font-semibold text-xs">
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
                    className="text-[#6c7a78] hover:text-[#006a65] transition-colors p-1"
                  >
                    <span
                      className={`material-symbols-outlined text-xl ${
                        isBookmarked ? 'material-symbols-filled text-[#006a65]' : ''
                      }`}
                    >
                      {isBookmarked ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>
                </div>

                <h3 className="font-bold text-lg text-[#001f26] mb-2 leading-snug">
                  {isTh ? item.titleTh : item.titleEn}
                </h3>
                <p className="text-xs md:text-sm text-[#4d6262] leading-relaxed flex-grow mb-4">
                  {isTh ? item.quoteTh || item.contentTh : item.quoteEn || item.contentEn}
                </p>

                <div className="mt-auto pt-3 border-t border-[#cfe7e6]/50 flex justify-between items-center text-xs">
                  <span className="text-[#6c7a78]">
                    {isTh ? item.referenceTh : item.referenceEn}
                  </span>
                  <button
                    onClick={() => setSelectedArticle(item)}
                    className="font-semibold text-[#006a65] flex items-center gap-1 group-hover:gap-1.5 transition-all"
                  >
                    <span>{isTh ? 'อ่านต่อ' : 'Read More'}</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Large Card: Reconnecting with Your Inner Self */}
          <div className="bg-gradient-to-br from-[#2bb8b0] to-[#006a65] rounded-3xl p-6 md:p-8 shadow-md text-white flex flex-col justify-between relative overflow-hidden md:col-span-2 lg:col-span-2 min-h-[260px]">
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
                <p className="text-xs md:text-sm text-white/90 max-w-lg leading-relaxed">
                  {isTh
                    ? 'หยุดพัก หายใจ และทบทวนถึงสิ่งดีๆ ที่อาจมองข้ามไปในชีวิตที่เร่งรีบ สัมผัสความสงบที่อยู่ภายใน'
                    : 'Take a moment to pause, breathe, and reflect on the blessings that often go unnoticed in the rush of daily life.'}
                </p>
              </div>

              <div>
                <button
                  onClick={startBreathingSession}
                  className="bg-white text-[#006a65] px-6 py-2.5 rounded-full font-semibold text-xs md:text-sm hover:bg-[#f1fbff] transition-all shadow-xs inline-flex items-center gap-2 active:scale-95"
                >
                  <span>{isTh ? 'เริ่มทบทวนตัวเอง' : 'Start Reflection'}</span>
                  <span className="material-symbols-outlined text-base">play_arrow</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Listen Audio Card */}
          <div className="bg-white rounded-3xl p-6 soft-shadow border border-[#cfe7e6]/70 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#e1f7ff] flex items-center justify-center text-[#006a65]">
                  <span className="material-symbols-outlined text-2xl">headphones</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm md:text-base text-[#001f26]">
                    {isTh ? 'เสียงอ่านที่นุ่มนวล' : 'Soothing Recitation'}
                  </h4>
                  <p className="text-xs text-[#6c7a78]">
                    {isTh ? 'ซูเราะฮ์ อัร-เราะห์มาน' : 'Surah Ar-Rahman'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#4d6262] leading-relaxed mb-4">
                {isTh
                  ? 'คลื่นเสียงความถี่ 432Hz ช่วยกล่อมเกลาจิตใจและคลายความวิตกกังวล'
                  : 'Harmonic calming tones to soothe the heart and alleviate worry'}
              </p>
            </div>

            {/* Audio Player Bar */}
            <div className="mt-auto bg-[#d1f4ff] rounded-2xl p-3 flex items-center gap-3 border border-[#cfe7e6]">
              <button
                onClick={handleAudioToggle}
                className="w-10 h-10 rounded-full bg-[#006a65] text-white flex items-center justify-center shrink-0 hover:bg-[#004340] active:scale-90 transition-all shadow-xs"
              >
                <span className="material-symbols-outlined text-xl">
                  {isPlayingAudio ? 'pause' : 'play_arrow'}
                </span>
              </button>
              <div className="flex-1 flex flex-col gap-1">
                <div className="h-1.5 bg-[#b4cbca]/40 rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 left-0 h-full bg-[#006a65] rounded-full transition-all"
                    style={{ width: `${(audioSeconds / 330) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-[#004340] shrink-0 font-medium">
                {formatTime(audioSeconds)} / 5:30
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Personalize Your Space Section (at bottom of mockups) */}
      <section className="w-full bg-[#d1f4ff]/70 rounded-3xl p-6 md:p-8 soft-shadow flex flex-col gap-4 border border-[#cfe7e6]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#006a65] text-3xl">psychology_alt</span>
          <h3 className="font-bold text-lg md:text-xl text-[#006a65]">
            {isTh ? 'ปรับแต่งมุมพักใจของคุณ' : 'Personalize Your Space'}
          </h3>
        </div>
        <p className="text-xs md:text-sm text-[#3c4948]">
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
            className={`flex-1 rounded-full py-3 px-4 font-semibold text-xs md:text-sm text-center shadow-xs transition-all active:scale-95 ${
              personalPreference === 'islamic'
                ? 'bg-[#006a65] text-white border-transparent'
                : 'bg-white text-[#001f26] border border-[#cfe7e6] hover:bg-[#e1f7ff]'
            }`}
          >
            ☪️ Islamic Healing
          </button>
          <button
            onClick={() => {
              setPersonalPreference('faith');
              soothingAudio.playGentleChime();
            }}
            className={`flex-1 rounded-full py-3 px-4 font-semibold text-xs md:text-sm text-center shadow-xs transition-all active:scale-95 ${
              personalPreference === 'faith'
                ? 'bg-[#006a65] text-white border-transparent'
                : 'bg-white text-[#001f26] border border-[#cfe7e6] hover:bg-[#e1f7ff]'
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
            className={`flex-1 rounded-full py-3 px-4 font-semibold text-xs md:text-sm text-center shadow-xs transition-all active:scale-95 ${
              personalPreference === 'comfort'
                ? 'bg-[#006a65] text-white border-transparent'
                : 'bg-white text-[#001f26] border border-[#cfe7e6] hover:bg-[#e1f7ff]'
            }`}
          >
            💌 Words of Comfort
          </button>
          <button
            onClick={() => soothingAudio.playGentleChime()}
            className="flex-1 text-[#6c7a78] hover:text-[#006a65] transition-colors py-3 px-4 font-medium text-xs md:text-sm text-center"
          >
            {isTh ? 'ข้ามไปก่อน' : 'Skip for now'}
          </button>
        </div>
      </section>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-[#cfe7e6] animate-fade-in relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f1fbff] flex items-center justify-center text-[#6c7a78] hover:text-[#001f26]"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <span className="text-xs font-semibold text-[#006a65] uppercase tracking-wider mb-2 block">
              {isTh ? selectedArticle.referenceTh : selectedArticle.referenceEn}
            </span>
            <h3 className="text-xl font-bold text-[#001f26] mb-4">
              {isTh ? selectedArticle.titleTh : selectedArticle.titleEn}
            </h3>

            {selectedArticle.arabic && (
              <div className="p-4 bg-[#e1f7ff] rounded-2xl mb-4 text-center">
                <p dir="rtl" className="text-xl font-bold text-[#006a65] leading-loose font-serif">
                  {selectedArticle.arabic}
                </p>
              </div>
            )}

            <p className="text-sm md:text-base text-[#3c4948] leading-relaxed mb-6 whitespace-pre-line">
              {isTh ? selectedArticle.contentTh : selectedArticle.contentEn}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  toggleBookmark(selectedArticle.id);
                  setSelectedArticle(null);
                }}
                className="flex-1 bg-[#006a65] text-white py-3 rounded-full text-xs font-semibold hover:bg-[#004340] transition-colors"
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
        <div className="fixed inset-0 z-50 bg-[#001f26]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-[#cfe7e6] flex flex-col items-center">
            <h3 className="text-xl font-bold text-[#006a65] mb-1">
              {isTh ? 'การฝึกสติและหายใจคลายเครียด' : 'Guided 4-7-8 Breathing'}
            </h3>
            <p className="text-xs text-[#6c7a78] mb-6">
              {isTh ? 'ตามจังหวะที่หัวใจค่อยๆ ผ่อนคลาย' : 'Follow the soothing breath rhythm'}
            </p>

            {/* Visual breathing circle */}
            <div className="relative w-44 h-44 flex items-center justify-center mb-6">
              <div
                className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                  breathingStep === 'inhale'
                    ? 'bg-[#78f3eb]/40 scale-110'
                    : breathingStep === 'hold'
                    ? 'bg-[#2bb8b0]/50 scale-105'
                    : 'bg-[#cfe7e6]/30 scale-90'
                }`}
              ></div>
              <div className="w-32 h-32 rounded-full bg-[#006a65] text-white flex flex-col items-center justify-center z-10 shadow-lg">
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

            <p className="text-sm text-[#3c4948] italic max-w-xs mb-6">
              {breathingStep === 'inhale'
                ? isTh ? 'สูดอากาศบริสุทธิ์และความสงบเข้าสู่ปอด...' : 'Breathe in peace and calm...'
                : breathingStep === 'hold'
                ? isTh ? 'รู้สึกถึงความนิ่งสงบภายในใจ...' : 'Feel the stillness within...'
                : isTh ? 'ปล่อยความกังวลและความเหนื่อยล้าออกไป...' : 'Release all tension and stress...'}
            </p>

            <button
              onClick={() => setShowBreathingModal(false)}
              className="bg-[#e1f7ff] text-[#006a65] hover:bg-[#d1f4ff] px-6 py-2.5 rounded-full text-xs font-semibold transition-colors"
            >
              {isTh ? 'เสร็จสิ้นการฝึก' : 'Finish Practice'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
