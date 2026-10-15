import React, { useState, useEffect, useRef } from 'react';
import { FormalMoodCheckIn, Language, VoiceGender, TabType, MoodDiaryEntry } from '../types';
import { generateDiaryReflection } from '../utils/aiService';
import { soothingAudio } from '../utils/audio';
import { voiceAssistant } from '../utils/speech';

interface MoodActionJournalProps {
  selectedScale: FormalMoodCheckIn;
  language: Language;
  aiName: string;
  voiceGender: VoiceGender;
  onNavigate: (tab: TabType) => void;
  onOpenEmergency: () => void;
  onOpenSafePoints: () => void;
  onSelectSurah?: (surahNumber: number) => void;
  onDiarySaved?: (entry: MoodDiaryEntry) => void;
}

export const MoodActionJournal: React.FC<MoodActionJournalProps> = ({
  selectedScale,
  language,
  aiName,
  voiceGender,
  onNavigate,
  onOpenEmergency,
  onOpenSafePoints,
  onSelectSurah,
  onDiarySaved,
}) => {
  const isTh = language === 'th';
  const [activeTab, setActiveTab] = useState<'journal' | 'breathing' | 'quran' | 'history'>('journal');
  const [journalContent, setJournalContent] = useState('');
  const [selectedPromptTag, setSelectedPromptTag] = useState<string | null>(null);
  const [shareWithCounselor, setShareWithCounselor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedEntry, setLastSubmittedEntry] = useState<MoodDiaryEntry | null>(null);
  const [isSpeakingReflection, setIsSpeakingReflection] = useState(false);
  const [diaryHistory, setDiaryHistory] = useState<MoodDiaryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('safe_phatna_mood_diaries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Breathing state
  const [breathingPhase, setBreathingPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [breathingSecondsLeft, setBreathingSecondsLeft] = useState(4);
  const [breathingCyclesCompleted, setBreathingCyclesCompleted] = useState(0);
  const breathingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Voice recording state
  const [isDictating, setIsDictating] = useState(false);

  // Sync entries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('safe_phatna_mood_diaries', JSON.stringify(diaryHistory));
    } catch (e) {
      console.warn('Failed to save diaries to localStorage:', e);
    }
  }, [diaryHistory]);

  // When selected scale changes, reset submission view for fresh interaction
  useEffect(() => {
    setLastSubmittedEntry(null);
    setSelectedPromptTag(null);
  }, [selectedScale.id]);

  // Dynamic Prompt Tags based on Level
  const getPromptTags = () => {
    if (selectedScale.level === 1) {
      return [
        { th: '🌟 เรื่องดีๆ ที่เกิดขึ้นวันนี้', en: '🌟 Good thing today' },
        { th: '🏆 ความสำเร็จเล็กๆ ที่ภูมิใจ', en: '🏆 Small win I am proud of' },
        { th: '🤝 คนที่ทำให้ฉันยิ้มได้', en: '🤝 Someone who made me smile' },
        { th: '💖 สิ่งที่อยากขอบคุณ (อัลฮัมดุลิลลาฮ์)', en: '💖 Gratitude (Alhamdulillah)' },
        { th: '🎯 เป้าหมายดีๆ สำหรับวันพรุ่งนี้', en: '🎯 Goal for tomorrow' },
      ];
    }
    if (selectedScale.level === 2) {
      return [
        { th: '📚 การบ้านและภาระงานวันนี้', en: '📚 Schoolwork & tasks' },
        { th: '🧘 สิ่งที่อยากพักผ่อนเย็นนี้', en: '🧘 How I want to relax' },
        { th: '💭 ความคิดที่วนเวียนในหัว', en: '💭 Lingering thoughts' },
        { th: '🌱 แผนการรับมือวันพรุ่งนี้', en: '🌱 Action plan for tomorrow' },
      ];
    }
    if (selectedScale.level === 3) {
      return [
        { th: '🌧️ สิ่งที่ทำให้กังวลใจมากที่สุด', en: '🌧️ Biggest worry right now' },
        { th: '💤 พลังงานกายและใจที่ลดลง', en: '💤 Depleted mental energy' },
        { th: '📋 งานหรือการสอบที่หนักอึ้ง', en: '📋 Overwhelming exams/deadlines' },
        { th: '🫂 ความรู้สึกที่อยากให้มีคนเข้าใจ', en: '🫂 Wanting to be understood' },
      ];
    }
    return [
      { th: '💔 ความรู้สึกอัดอั้นในใจ', en: '💔 Bottled up feelings' },
      { th: '👥 เรื่องเพื่อนหรือความเหงา', en: '👥 Relationship or loneliness' },
      { th: '🛡️ สิ่งที่อยากให้อาจารย์ช่วย', en: '🛡️ What I need help with' },
      { th: '🆘 สิ่งที่กำลังแบกไว้ไม่ไหว', en: '🆘 Burdens too heavy to carry' },
    ];
  };

  const handleSelectPromptTag = (tagTh: string, tagEn: string) => {
    const textToInsert = isTh ? tagTh : tagEn;
    setSelectedPromptTag(textToInsert);
    setJournalContent((prev) => {
      if (!prev.trim()) {
        return `${textToInsert}:\n`;
      }
      return `${prev}\n\n${textToInsert}:\n`;
    });
    soothingAudio.playGentleChime();
  };

  // Submit Journal
  const handleSubmitDiary = () => {
    if (!journalContent.trim()) return;

    setIsSubmitting(true);
    soothingAudio.playGentleChime();

    setTimeout(() => {
      const reflection = generateDiaryReflection(
        journalContent,
        selectedScale,
        aiName,
        voiceGender,
        language
      );

      const now = new Date();
      const timeFormatted = now.toLocaleDateString(isTh ? 'th-TH' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const newEntry: MoodDiaryEntry = {
        id: `diary-${Date.now()}`,
        timestamp: now.toISOString(),
        timeFormatted,
        moodId: selectedScale.id,
        moodLabelTh: selectedScale.labelTh,
        moodLabelEn: selectedScale.labelEn,
        moodLevel: selectedScale.level,
        moodIcon: selectedScale.icon,
        content: journalContent,
        promptTopic: selectedPromptTag || undefined,
        aiReflection: {
          replyTh: reflection.replyTh,
          replyEn: reflection.replyEn,
          keyThemeTh: reflection.keyThemeTh,
          keyThemeEn: reflection.keyThemeEn,
          actionAdviceTh: reflection.actionAdviceTh,
          actionAdviceEn: reflection.actionAdviceEn,
          recommendedSurahNumber: reflection.recommendedSurahNumber,
          recommendedSurahName: reflection.recommendedSurahName,
        },
        sharedWithCounselor: shareWithCounselor,
      };

      setDiaryHistory((prev) => [newEntry, ...prev]);
      setLastSubmittedEntry(newEntry);
      setIsSubmitting(false);

      if (onDiarySaved) {
        onDiarySaved(newEntry);
      }
    }, 400);
  };

  // Voice playback of AI reflection
  const handleToggleSpeakReflection = (text: string) => {
    if (isSpeakingReflection) {
      voiceAssistant.stopSpeaking();
      setIsSpeakingReflection(false);
    } else {
      soothingAudio.playGentleChime();
      setIsSpeakingReflection(true);
      voiceAssistant.speak(
        text,
        () => setIsSpeakingReflection(true),
        () => setIsSpeakingReflection(false)
      );
    }
  };

  // Speech-to-text dictation
  const handleToggleDictation = () => {
    if (isDictating) {
      voiceAssistant.stopListening();
      setIsDictating(false);
    } else {
      soothingAudio.playGentleChime();
      setIsDictating(true);
      voiceAssistant.listen(
        (transcript: string) => {
          setJournalContent((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsDictating(false);
        },
        (error: { type: string; message: string }) => {
          console.warn('Dictation error:', error);
          setIsDictating(false);
        }
      );
    }
  };

  // Breathing Box Exercise Timer Logic
  const startBreathing = () => {
    if (breathingPhase !== 'idle') {
      stopBreathing();
      return;
    }
    soothingAudio.playGentleChime();
    setBreathingPhase('inhale');
    setBreathingSecondsLeft(4);
    setBreathingCyclesCompleted(0);
  };

  const stopBreathing = () => {
    if (breathingTimerRef.current) {
      clearInterval(breathingTimerRef.current);
      breathingTimerRef.current = null;
    }
    setBreathingPhase('idle');
  };

  useEffect(() => {
    if (breathingPhase === 'idle') return;

    breathingTimerRef.current = setInterval(() => {
      setBreathingSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Transition phases
        if (breathingPhase === 'inhale') {
          setBreathingPhase('hold');
          return 4;
        } else if (breathingPhase === 'hold') {
          setBreathingPhase('exhale');
          return 4;
        } else if (breathingPhase === 'exhale') {
          setBreathingCyclesCompleted((c) => c + 1);
          setBreathingPhase('inhale');
          soothingAudio.playGentleChime();
          return 4;
        }
        return 4;
      });
    }, 1000);

    return () => {
      if (breathingTimerRef.current) {
        clearInterval(breathingTimerRef.current);
      }
    };
  }, [breathingPhase]);

  // Quran recommendation jump
  const handleJumpToRecommendedSurah = (surahNumber: number) => {
    soothingAudio.playGentleChime();
    if (onSelectSurah) {
      onSelectSurah(surahNumber);
    }
    const quranEl = document.getElementById('quran-audio-player-section');
    if (quranEl) {
      quranEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const recommendedSurahNum =
    selectedScale.level === 1 ? 1 : selectedScale.level === 2 ? 112 : selectedScale.level <= 4 ? 94 : 93;
  const recommendedSurahName =
    selectedScale.level === 1
      ? 'ซูเราะฮ์ อัล-ฟาติฮะฮ์ (Al-Fatihah)'
      : selectedScale.level === 2
      ? 'ซูเราะฮ์ อัล-อิคลาศ (Al-Ikhlas)'
      : selectedScale.level <= 4
      ? 'ซูเราะฮ์ อัช-ชัรห์ (Ash-Sharh: บรรเทาความเหนื่อยล้า)'
      : 'ซูเราะฮ์ อัฎ-ฎุฮา (Ad-Duha: ปลอบประโลมยามเศร้า)';

  return (
    <div className="w-full bg-gradient-to-br from-white via-blue-50/40 to-slate-50 rounded-3xl p-5 md:p-7 border-2 border-blue-200 shadow-md flex flex-col gap-5 animate-fade-in transition-all">
      {/* =========================================================================
          HEADER: Current Mood Identification & Action Pathway Announcement
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform ${
              selectedScale.level >= 4
                ? 'bg-rose-600 text-white'
                : selectedScale.level === 3
                ? 'bg-amber-600 text-white'
                : 'bg-blue-800 text-white'
            }`}
          >
            <span className="material-symbols-outlined text-2xl md:text-3xl material-symbols-filled">
              {selectedScale.icon}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  selectedScale.level === 1
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : selectedScale.level === 2
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : selectedScale.level === 3
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : selectedScale.level === 4
                    ? 'bg-orange-100 text-orange-800 border border-orange-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                Level {selectedScale.level} • {isTh ? 'สภาวะที่เลือก' : 'Active Level'}
              </span>
              <span className="text-xs font-bold text-blue-900">
                {isTh ? selectedScale.labelTh : selectedScale.labelEn}
              </span>
            </div>
            <h3 className="text-base md:text-lg font-extrabold text-[#091e42] mt-1">
              {isTh
                ? `ขั้นตอนการดูแลและแอคชั่นที่เหมาะสมกับ "${selectedScale.labelTh}"`
                : `Action & Care Pathways for "${selectedScale.labelEn}"`}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
              {isTh ? selectedScale.clinicalDescriptionTh : selectedScale.clinicalDescriptionEn}
            </p>
          </div>
        </div>

        {/* Action Pathway Tabs Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-blue-50 rounded-2xl border border-blue-200 shrink-0 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => {
              setActiveTab('journal');
              soothingAudio.playGentleChime();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'journal'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-blue-900 hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">edit_note</span>
            <span>{isTh ? 'เขียนไดอารี่ & เล่าเรื่อง' : 'Journal'}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('breathing');
              soothingAudio.playGentleChime();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'breathing'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-blue-900 hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">air</span>
            <span>{isTh ? 'ฝึกการหายใจ 2 นาที' : 'Breathing'}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('history');
              soothingAudio.playGentleChime();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-blue-900 hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">history_edu</span>
            <span>
              {isTh ? `ประวัติ (${diaryHistory.length})` : `History (${diaryHistory.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: JOURNALING & STORYTELLING WORKSPACE ("เขียนไดอารี่ / เล่าเรื่อง")
         ========================================================================= */}
      {activeTab === 'journal' && (
        <div className="flex flex-col gap-4">
          {/* Post-submission Result View */}
          {lastSubmittedEntry ? (
            <div className="bg-white rounded-2xl p-5 md:p-6 border-2 border-[#2bb8b0] shadow-sm flex flex-col gap-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#cfe7e6]">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                  </span>
                  <div>
                    <span className="text-xs font-bold text-emerald-800 block">
                      {isTh
                        ? 'บันทึกลงในไดอารี่ส่วนตัวของคุณเรียบร้อยแล้ว ✨'
                        : 'Saved to your personal reflection diary ✨'}
                    </span>
                    <span className="text-[11px] text-[#6c7a78]">
                      {lastSubmittedEntry.timeFormatted} • {isTh ? 'เฉพาะคุณที่มองเห็น' : 'Private to you'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleToggleSpeakReflection(
                        isTh
                          ? lastSubmittedEntry.aiReflection.replyTh
                          : lastSubmittedEntry.aiReflection.replyEn
                      )
                    }
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all border ${
                      isSpeakingReflection
                        ? 'bg-[#ba1a1a] text-white border-red-500 animate-pulse'
                        : 'bg-[#e1f7ff] text-[#006a65] border-[#006a65] hover:bg-[#c6f0ec]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isSpeakingReflection ? 'stop' : 'volume_up'}
                    </span>
                    <span>
                      {isSpeakingReflection
                        ? isTh
                          ? 'หยุดเสียงอ่าน'
                          : 'Stop'
                        : isTh
                        ? `ฟังเสียง AI (${aiName}) สะท้อนคิด`
                        : 'Listen to AI'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setLastSubmittedEntry(null);
                      setJournalContent('');
                    }}
                    className="px-3 py-1.5 bg-[#f1fbff] hover:bg-white text-[#4d6262] border border-[#cfe7e6] text-xs font-bold rounded-full transition-all"
                  >
                    {isTh ? 'เขียนเพิ่ม' : 'Write More'}
                  </button>
                </div>
              </div>

              {/* What the user wrote */}
              <div className="bg-[#f1fbff] rounded-xl p-3.5 border border-[#cfe7e6] text-xs text-[#2c3d3c] leading-relaxed">
                <span className="text-[10px] font-bold text-[#006a65] uppercase block mb-1">
                  {isTh ? 'ข้อความที่คุณบันทึกไว้:' : 'Your Diary Note:'}
                </span>
                <p className="whitespace-pre-wrap">{lastSubmittedEntry.content}</p>
              </div>

              {/* AI Psychological & Empathetic Reflection */}
              <div className="bg-gradient-to-r from-[#e6f8f6] to-[#edfcf9] rounded-2xl p-4 md:p-5 border border-[#2bb8b0]/60 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006a65] text-xl material-symbols-filled">
                      psychology
                    </span>
                    <span className="text-xs font-extrabold text-[#004d47]">
                      {isTh
                        ? `AI ${aiName} สะท้อนมุมมองจิตวิทยาและการดูแลใจ:`
                        : `AI ${aiName} Psychological Reflection:`}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#006a65] text-white">
                    {isTh
                      ? lastSubmittedEntry.aiReflection.keyThemeTh
                      : lastSubmittedEntry.aiReflection.keyThemeEn}
                  </span>
                </div>

                <p className="text-xs md:text-sm text-[#001f26] leading-relaxed">
                  {isTh
                    ? lastSubmittedEntry.aiReflection.replyTh
                    : lastSubmittedEntry.aiReflection.replyEn}
                </p>

                {/* Tangible Recommended Action & Pathways */}
                <div className="mt-2 pt-3 border-t border-[#2bb8b0]/30 flex flex-col gap-3">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#006a65] text-base shrink-0 mt-0.5">
                      tips_and_updates
                    </span>
                    <span className="text-xs font-semibold text-[#004d47]">
                      {isTh
                        ? `ข้อแนะนำเชิงจิตวิทยา: ${lastSubmittedEntry.aiReflection.actionAdviceTh}`
                        : `Psychological Advice: ${lastSubmittedEntry.aiReflection.actionAdviceEn}`}
                    </span>
                  </div>

                  {/* Immediate Action Buttons Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    {/* 1. Enter AI Studio / Chat */}
                    <button
                      onClick={() => onNavigate('chat')}
                      className="px-4 py-2.5 bg-gradient-to-r from-[#006a65] to-[#008f88] hover:from-[#004d47] hover:to-[#006a65] text-white rounded-2xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 text-left"
                    >
                      <span className="material-symbols-outlined text-base material-symbols-filled">
                        forum
                      </span>
                      <span>
                        {isTh
                          ? `เข้าไปคุยกับ AI (${aiName}) เพื่อปรึกษาต่อ`
                          : `Chat with AI (${aiName}) for Deep Guidance`}
                      </span>
                    </button>

                    {/* 2. Listen to recommended Quran Surah if present */}
                    {lastSubmittedEntry.aiReflection.recommendedSurahNumber && (
                      <button
                        onClick={() =>
                          handleJumpToRecommendedSurah(
                            lastSubmittedEntry.aiReflection.recommendedSurahNumber!
                          )
                        }
                        className="px-4 py-2.5 bg-white hover:bg-[#e1f7ff] text-[#006a65] border border-[#cfe7e6] rounded-2xl text-xs font-bold shadow-2xs flex items-center justify-center gap-2 transition-all active:scale-95 text-left"
                      >
                        <span className="material-symbols-outlined text-base">play_circle</span>
                        <span>
                          {isTh
                            ? `ฟัง ${lastSubmittedEntry.aiReflection.recommendedSurahName}`
                            : `Listen to ${lastSubmittedEntry.aiReflection.recommendedSurahName}`}
                        </span>
                      </button>
                    )}

                    {/* 3. Box Breathing */}
                    <button
                      onClick={() => {
                        setActiveTab('breathing');
                        soothingAudio.playGentleChime();
                      }}
                      className="px-4 py-2.5 bg-white hover:bg-[#e1f7ff] text-[#006a65] border border-[#cfe7e6] rounded-2xl text-xs font-bold shadow-2xs flex items-center justify-center gap-2 transition-all active:scale-95 text-left"
                    >
                      <span className="material-symbols-outlined text-base">air</span>
                      <span>
                        {isTh ? 'ฝึกการหายใจ Box Breathing 4-4-4' : 'Box Breathing 4-4-4'}
                      </span>
                    </button>

                    {/* 4. Consult Teacher */}
                    <button
                      onClick={() => onNavigate('school')}
                      className="px-4 py-2.5 bg-white hover:bg-[#e1f7ff] text-[#006a65] border border-[#cfe7e6] rounded-2xl text-xs font-bold shadow-2xs flex items-center justify-center gap-2 transition-all active:scale-95 text-left"
                    >
                      <span className="material-symbols-outlined text-base">supervisor_account</span>
                      <span>
                        {isTh ? 'นัดหมายปรึกษาอาจารย์แนะแนว' : 'Book Counselor Appointment'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Journal Editor View */
            <div className="flex flex-col gap-3">
              {/* Context Prompt & Guiding Question */}
              <div className="bg-[#f0fbfb] rounded-2xl p-4 border border-[#cfe7e6]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="material-symbols-outlined text-[#006a65] text-lg material-symbols-filled">
                    auto_awesome
                  </span>
                  <span className="text-xs font-bold text-[#006a65]">
                    {selectedScale.level === 1
                      ? isTh
                        ? 'พื้นที่เล่าเรื่องราวความสุข & บันทึกความขอบคุณ (Gratitude Journal)'
                        : 'Storytelling & Gratitude Space'
                      : selectedScale.level === 2
                      ? isTh
                        ? 'พื้นที่สำรวจความคิด & ปรับสมดุลประจำวัน (Mindful Check-in)'
                        : 'Mindful Daily Check-in'
                      : isTh
                      ? 'กล่องระบายความกังวล & ปลดเปลื้องภาระใจ (Decompression & Venting Box)'
                      : 'Decompression & Venting Box'}
                  </span>
                </div>
                <p className="text-xs text-[#2c3d3c] leading-relaxed">
                  {selectedScale.level === 1
                    ? isTh
                      ? 'วันนี้มีเรื่องดีๆ อะไร หรือโมเมนต์ไหนที่ทำให้รู้สึกอุ่นใจและมั่นคง? เขียนเล่าเรื่องราว ความสุข หรือสิ่งที่อยากขอบคุณได้เลย AI จะช่วยบันทึกเป็นพลังใจให้คุณ'
                      : 'What went well today? Write about moments that brought peace or gratitude.'
                    : selectedScale.level === 2
                    ? isTh
                      ? 'วันนี้รู้สึกอย่างไรบ้าง? มีเรื่องการเรียน เพื่อน หรือภาระงานอะไรที่อยากทบทวนให้ปลอดโปร่งขึ้นไหม เล่าให้ฟังได้เลยนะ'
                      : 'How is your routine going? Note down what is on your mind to organize your thoughts.'
                    : isTh
                    ? 'อะไรคือสิ่งที่ทำให้เรากังวลใจหรือเหนื่อยล้าอยู่ในตอนนี้? เขียนระบายลงในพื้นที่ปลอดภัยนี้ได้เลย ปลดปล่อยความหนักใจออกมา ไม่มีใครตัดสินคุณ'
                    : 'What is causing stress or fatigue? Write it down freely in this safe, private space.'}
                </p>

                {/* Quick Inspiration Tags */}
                <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-2.5 border-t border-[#cfe7e6]">
                  <span className="text-[10px] font-bold text-[#6c7a78] uppercase mr-1">
                    {isTh ? 'หัวข้อชวนเขียน:' : 'Prompts:'}
                  </span>
                  {getPromptTags().map((tag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPromptTag(tag.th, tag.en)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white hover:bg-[#e1f7ff] text-[#006a65] border border-[#cfe7e6] hover:border-[#006a65] transition-all active:scale-95 shadow-2xs"
                    >
                      {isTh ? tag.th : tag.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea Workspace */}
              <div className="relative">
                <textarea
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  placeholder={
                    selectedScale.level === 1
                      ? isTh
                        ? 'เขียนเล่าเรื่องราวความสุข หรือสิ่งที่อยากขอบคุณในวันนี้... (เช่น วันนี้ได้ทานอาหารอร่อย ทำการบ้านเสร็จ หรือเพื่อนทักทาย)'
                        : 'Write about happy moments or gratitude today...'
                      : selectedScale.level === 2
                      ? isTh
                        ? 'เขียนบันทึกสำรวจสิ่งที่พบเจอ หรือเป้าหมายที่อยากทำต่อในวันนี้...'
                        : 'Write your thoughts or daily tasks...'
                      : isTh
                      ? 'ระบายสิ่งที่อยู่ในใจ ความเหนื่อย หรือเรื่องที่ทำให้กังวล... (ที่นี่เป็นความลับ 100% ปลอดภัยสำหรับคุณ)'
                      : 'Vent your feelings and worries safely here...'
                  }
                  rows={4}
                  className="w-full p-4 rounded-2xl bg-white border border-[#cfe7e6] focus:border-[#006a65] focus:ring-2 focus:ring-[#006a65]/20 text-xs md:text-sm text-[#001f26] placeholder-[#6c7a78]/70 resize-none transition-all shadow-inner outline-none leading-relaxed"
                />

                {/* Bottom Bar: Character count, Voice dictation, Counselor share */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2 px-1">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleToggleDictation}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all border ${
                        isDictating
                          ? 'bg-red-500 text-white border-red-600 animate-pulse'
                          : 'bg-white text-[#006a65] border-[#cfe7e6] hover:bg-[#e1f7ff]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {isDictating ? 'mic_off' : 'mic'}
                      </span>
                      <span>
                        {isDictating
                          ? isTh
                            ? 'กำลังฟัง...'
                            : 'Listening...'
                          : isTh
                          ? 'กดเพื่อพูดเล่าเรื่อง'
                          : 'Dictate Voice'}
                      </span>
                    </button>

                    <label className="flex items-center gap-1.5 text-[11px] text-[#4d6262] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shareWithCounselor}
                        onChange={(e) => setShareWithCounselor(e.target.checked)}
                        className="rounded border-[#cfe7e6] text-[#006a65] focus:ring-[#006a65]"
                      />
                      <span>{isTh ? 'แชร์ให้อาจารย์แนะแนวดูด้วย' : 'Share with counselor'}</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-[10px] text-[#6c7a78]">
                      {journalContent.length} {isTh ? 'ตัวอักษร' : 'characters'}
                    </span>

                    <button
                      type="button"
                      disabled={!journalContent.trim() || isSubmitting}
                      onClick={handleSubmitDiary}
                      className="px-5 py-2.5 rounded-full bg-[#006a65] hover:bg-[#004340] disabled:bg-[#cfe7e6] disabled:text-[#8a9897] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined text-sm animate-spin">
                            progress_activity
                          </span>
                          <span>{isTh ? 'กำลังบันทึก & วิเคราะห์...' : 'Saving...'}</span>
                        </>
                      ) : (
                        <>
                          <span>{isTh ? 'บันทึกไดอารี่ & รับการสะท้อนคิด' : 'Save & Get Reflection'}</span>
                          <span className="material-symbols-outlined text-base">send</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Action Pathways Bar (รู้ว่าพอกดปุ๊บจะไปตรงไหนต่อ) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Quick Action 1: Recommended Quran Surah */}
            <div
              onClick={() => handleJumpToRecommendedSurah(recommendedSurahNum)}
              className="p-3.5 rounded-2xl bg-white border border-[#cfe7e6] hover:border-[#006a65] hover:shadow-md cursor-pointer transition-all flex items-center gap-3 active:scale-95 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#e1f7ff] group-hover:bg-[#006a65] text-[#006a65] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                <span className="material-symbols-outlined text-xl">menu_book</span>
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-[#006a65] uppercase block">
                  {isTh ? 'ซูเราะฮ์แนะนำตามสภาวะนี้' : 'Recommended Surah'}
                </span>
                <h4 className="text-xs font-bold text-[#001f26] truncate">
                  {recommendedSurahName}
                </h4>
                <span className="text-[10px] text-[#6c7a78] flex items-center gap-0.5 mt-0.5">
                  <span>{isTh ? 'กดเพื่อฟังเสียงจริงและคำแปล' : 'Play & read translation'}</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </span>
              </div>
            </div>

            {/* Quick Action 2: Breathing Exercise */}
            <div
              onClick={() => {
                setActiveTab('breathing');
                startBreathing();
              }}
              className="p-3.5 rounded-2xl bg-white border border-[#cfe7e6] hover:border-[#006a65] hover:shadow-md cursor-pointer transition-all flex items-center gap-3 active:scale-95 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#e1f7ff] group-hover:bg-[#006a65] text-[#006a65] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                <span className="material-symbols-outlined text-xl">air</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#006a65] uppercase block">
                  {isTh ? 'ปรับคลื่นสมอง' : 'Quick Calm'}
                </span>
                <h4 className="text-xs font-bold text-[#001f26]">
                  {isTh ? 'แบบฝึกหายใจลึก 2 นาที' : '2-Min Box Breathing'}
                </h4>
                <span className="text-[10px] text-[#6c7a78] flex items-center gap-0.5 mt-0.5">
                  <span>{isTh ? 'เริ่มฝึกทันที' : 'Start breathing'}</span>
                  <span className="material-symbols-outlined text-xs">play_arrow</span>
                </span>
              </div>
            </div>

            {/* Quick Action 3: Teacher / Safe Point Support */}
            <div
              onClick={() => {
                if (selectedScale.level >= 4) {
                  onOpenEmergency();
                } else {
                  onNavigate('school');
                }
              }}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 active:scale-95 group ${
                selectedScale.level >= 4
                  ? 'bg-rose-50 border-rose-300 hover:border-rose-500'
                  : 'bg-white border-[#cfe7e6] hover:border-[#006a65] hover:shadow-md'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  selectedScale.level >= 4
                    ? 'bg-rose-600 text-white'
                    : 'bg-[#e1f7ff] group-hover:bg-[#006a65] text-[#006a65] group-hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {selectedScale.level >= 4 ? 'emergency_home' : 'support_agent'}
                </span>
              </div>
              <div>
                <span
                  className={`text-[10px] font-bold uppercase block ${
                    selectedScale.level >= 4 ? 'text-rose-700' : 'text-[#006a65]'
                  }`}
                >
                  {selectedScale.level >= 4
                    ? isTh
                      ? 'ช่วยเหลือเร่งด่วน'
                      : 'Urgent'
                    : isTh
                    ? 'พูดคุยส่วนตัว'
                    : 'Consultation'}
                </span>
                <h4 className="text-xs font-bold text-[#001f26]">
                  {selectedScale.level >= 4
                    ? isTh
                      ? 'ติดต่ออาจารย์เวร / สายด่วน 1323'
                      : 'Hotline 1323 / On-duty staff'
                    : isTh
                    ? 'ปรึกษาอาจารย์แนะแนว'
                    : 'Counselor Booking'}
                </h4>
                <span className="text-[10px] text-[#6c7a78] flex items-center gap-0.5 mt-0.5">
                  <span>{isTh ? 'ดูรายชื่อครูและจุดปลอดภัย' : 'View counselors & safe spots'}</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: GUIDED BREATHING PACER ("ฝึกการหายใจ 2 นาที")
         ========================================================================= */}
      {activeTab === 'breathing' && (
        <div className="bg-white rounded-2xl p-6 border border-[#cfe7e6] flex flex-col items-center justify-center text-center gap-5 animate-fade-in">
          <div>
            <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-[#006a65] text-white">
              {isTh ? 'แบบฝึกการหายใจ 4-4-4 Box Breathing' : '4-4-4 Box Breathing'}
            </span>
            <h4 className="text-base md:text-lg font-extrabold text-[#001f26] mt-2">
              {breathingPhase === 'idle'
                ? isTh
                  ? 'กดเริ่มต้นเพื่อปรับคลื่นสมองและคืนความสงบสู่ใจ'
                  : 'Start to restore calmness and lower stress'
                : breathingPhase === 'inhale'
                ? isTh
                  ? 'หายใจเข้าช้าๆ ลึกๆ ผ่านจมูก...'
                  : 'Inhale slowly through your nose...'
                : breathingPhase === 'hold'
                ? isTh
                  ? 'กลั้นลมหายใจเบาๆ ให้จิตใจสงบ...'
                  : 'Hold gently, stay still...'
                : isTh
                ? 'ผ่อนลมหายใจออกช้าๆ ทางปาก ปล่อยความตึงเครียด...'
                : 'Exhale slowly through your mouth...'}
            </h4>
          </div>

          {/* Interactive Breathing Visual Circle */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Animated Outer Pulse */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                breathingPhase === 'inhale'
                  ? 'scale-110 bg-[#2bb8b0]/30 animate-pulse'
                  : breathingPhase === 'hold'
                  ? 'scale-105 bg-[#006a65]/20'
                  : breathingPhase === 'exhale'
                  ? 'scale-75 bg-[#cfe7e6]/40'
                  : 'scale-90 bg-gray-100'
              }`}
            />

            {/* Inner Core Circle */}
            <div
              className={`w-32 h-32 rounded-full flex flex-col items-center justify-center z-10 transition-all duration-1000 shadow-md ${
                breathingPhase === 'inhale'
                  ? 'bg-gradient-to-tr from-[#006a65] to-[#2bb8b0] text-white scale-105'
                  : breathingPhase === 'hold'
                  ? 'bg-[#004d47] text-white scale-100'
                  : breathingPhase === 'exhale'
                  ? 'bg-[#78f3eb] text-[#001f26] scale-90'
                  : 'bg-white border-2 border-[#006a65] text-[#006a65]'
              }`}
            >
              {breathingPhase === 'idle' ? (
                <span className="material-symbols-outlined text-4xl">air</span>
              ) : (
                <>
                  <span className="text-3xl font-extrabold">{breathingSecondsLeft}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">
                    {breathingPhase === 'inhale'
                      ? isTh
                        ? 'หายใจเข้า'
                        : 'Inhale'
                      : breathingPhase === 'hold'
                      ? isTh
                        ? 'กลั้นหายใจ'
                        : 'Hold'
                      : isTh
                      ? 'ผ่อนลมหายใจ'
                      : 'Exhale'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Controls & Cycle Counter */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              {breathingPhase === 'idle' ? (
                <button
                  onClick={startBreathing}
                  className="px-6 py-2.5 rounded-full bg-[#006a65] hover:bg-[#004340] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">play_arrow</span>
                  <span>{isTh ? 'เริ่มแบบฝึกหายใจ 2 นาที' : 'Start 2-Min Exercise'}</span>
                </button>
              ) : (
                <button
                  onClick={stopBreathing}
                  className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">stop</span>
                  <span>{isTh ? 'หยุดแบบฝึก' : 'Stop'}</span>
                </button>
              )}
            </div>

            {breathingCyclesCompleted > 0 && (
              <span className="text-xs font-semibold text-[#006a65]">
                {isTh
                  ? `สำเร็จแล้ว ${breathingCyclesCompleted} รอบ ✨ (ยอดเยี่ยมมาก)`
                  : `Completed ${breathingCyclesCompleted} cycles ✨`}
              </span>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: DIARY HISTORY & TIMELINE ("ประวัติไดอารี่สะท้อนอารมณ์")
         ========================================================================= */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl p-5 border border-[#cfe7e6] flex flex-col gap-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-[#cfe7e6]">
            <div>
              <h4 className="text-sm font-bold text-[#001f26]">
                {isTh ? 'สมุดบันทึกและประวัติไดอารี่สะท้อนอารมณ์' : 'My Emotional Reflection History'}
              </h4>
              <p className="text-[11px] text-[#6c7a78]">
                {isTh
                  ? 'รวบรวมทุกเรื่องราวที่คุณเขียนบันทึกไว้ พร้อมคำสะท้อนคิดจาก AI'
                  : 'All your personal reflections and AI responses'}
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#e1f7ff] text-[#006a65]">
              {diaryHistory.length} {isTh ? 'รายการ' : 'entries'}
            </span>
          </div>

          {diaryHistory.length === 0 ? (
            <div className="text-center py-8 text-[#6c7a78] flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-4xl text-[#cfe7e6]">edit_calendar</span>
              <p className="text-xs">
                {isTh
                  ? 'ยังไม่มีบันทึกไดอารี่ ลองเขียนเล่าเรื่องหรือความรู้สึกในแท็บ "เขียนไดอารี่" ได้เลย!'
                  : 'No diary entries yet. Start writing in the Journal tab!'}
              </p>
              <button
                onClick={() => setActiveTab('journal')}
                className="mt-1 px-4 py-2 bg-[#006a65] text-white rounded-full text-xs font-bold"
              >
                {isTh ? 'เริ่มเขียนบันทึกแรก' : 'Write First Entry'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
              {diaryHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl border border-[#cfe7e6] bg-[#f8fdff] flex flex-col gap-2.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white border border-[#cfe7e6] text-[#006a65] flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">{entry.moodIcon}</span>
                        <span>{isTh ? entry.moodLabelTh : entry.moodLabelEn}</span>
                      </span>
                      <span className="text-[10px] text-[#6c7a78]">{entry.timeFormatted}</span>
                    </div>

                    <button
                      onClick={() =>
                        handleToggleSpeakReflection(
                          isTh ? entry.aiReflection.replyTh : entry.aiReflection.replyEn
                        )
                      }
                      className="text-[11px] font-bold text-[#006a65] hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">volume_up</span>
                      <span>{isTh ? 'ฟังเสียง AI' : 'Listen'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-[#001f26] whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-lg border border-[#cfe7e6]/70">
                    {entry.content}
                  </p>

                  <div className="text-[11px] text-[#004d47] bg-[#e6f8f6] p-2.5 rounded-lg border border-[#2bb8b0]/30 leading-snug">
                    <span className="font-bold block mb-0.5">
                      {isTh ? `AI ${aiName} สะท้อนคิด:` : `AI ${aiName}:`}
                    </span>
                    <span>
                      {isTh ? entry.aiReflection.replyTh : entry.aiReflection.replyEn}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
