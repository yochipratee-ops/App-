import React, { useState } from 'react';
import { TabType, Language, VoiceGender, FormalMoodCheckIn } from '../types';
import { FORMAL_MOOD_SCALES } from '../data/mockData';
import { VoiceAiHero } from './VoiceAiHero';
import { QuranAudioPlayer } from './QuranAudioPlayer';
import { MentalHealthAssessmentModal, AssessmentResult } from './MentalHealthAssessmentModal';
import { MoodActionJournal } from './MoodActionJournal';
import { soothingAudio } from '../utils/audio';

interface HomeTabProps {
  language: Language;
  onNavigate: (tab: TabType) => void;
  onOpenEmergency: () => void;
  onOpenSafePoints: () => void;
  currentGender: VoiceGender;
  onGenderChange: (gender: VoiceGender) => void;
  aiName: string;
  onUpdateAiName: (newName: string) => void;
  onSelectMood: (mood: FormalMoodCheckIn) => void;
  latestAssessment?: AssessmentResult | null;
  onSaveAssessment?: (result: AssessmentResult) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  language,
  onNavigate,
  onOpenEmergency,
  onOpenSafePoints,
  currentGender,
  onGenderChange,
  aiName,
  onUpdateAiName,
  onSelectMood,
  latestAssessment,
  onSaveAssessment,
}) => {
  const isTh = language === 'th';
  const [selectedScaleId, setSelectedScaleId] = useState<string>(FORMAL_MOOD_SCALES[0].id);
  const [activeQuranSurahNumber, setActiveQuranSurahNumber] = useState<number>(94);
  const [assessmentToast, setAssessmentToast] = useState<string | null>(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const selectedScale = FORMAL_MOOD_SCALES.find((s) => s.id === selectedScaleId) || FORMAL_MOOD_SCALES[0];

  const handleAssessmentComplete = (result: AssessmentResult) => {
    if (onSaveAssessment) {
      onSaveAssessment(result);
    }
    setAssessmentToast(
      isTh
        ? `บันทึกผลการประเมินสุขภาพจิตระดับ: ${result.titleTh} เรียบร้อยแล้ว`
        : `Assessment completed: ${result.titleEn}`
    );
    setTimeout(() => setAssessmentToast(null), 5000);
  };

  const handleScaleSelect = (scale: FormalMoodCheckIn) => {
    setSelectedScaleId(scale.id);
    soothingAudio.playGentleChime();
    onSelectMood(scale);

    // Smooth scroll to the mood action & reflection hub so student immediately sees where to go next
    setTimeout(() => {
      const suiteEl = document.getElementById('mood-action-suite-anchor');
      if (suiteEl) {
        suiteEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);

    if (scale.level >= 4) {
      setAssessmentToast(
        isTh
          ? `ระบบเลือกสภาวะ "${scale.labelTh}" — เลือกระบายความรู้สึก ฝึกหายใจ หรือส่งต่ออาจารย์ได้ทันทีด้านล่าง`
          : `Selected "${scale.labelEn}" — Choose your next care action below.`
      );
    } else {
      setAssessmentToast(
        isTh
          ? `ระบบเลือกสภาวะ "${scale.labelTh}" — พื้นที่เขียนเล่าเรื่องและไดอารี่พร้อมใช้งานแล้วด้านล่าง ✨`
          : `Selected "${scale.labelEn}" — Reflection journal and actions are ready below.`
      );
    }

    setTimeout(() => setAssessmentToast(null), 4000);
  };

  return (
    <div className="w-full max-w-[1180px] mx-auto px-4 md:px-8 pt-4 pb-28 md:pb-16 flex flex-col gap-6 md:gap-8 animate-fade-in">
      {/* Toast Notification */}
      {assessmentToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0b1e3b] text-white px-5 py-3 rounded-2xl shadow-xl border border-blue-400 text-xs md:text-sm max-w-lg w-[90%] text-center animate-bounce">
          {assessmentToast}
        </div>
      )}

      {/* =========================================================================
          SECTION 1: ACADEMIC INSTITUTIONAL MASTHEAD & SCHOOL CAMPUS EMBLEM
          (สไตล์นักวิชาการสีน้ำเงิน ทรงภูมิ น่าเชื่อถือ มาตรฐานโรงเรียนพัฒนศึกษา)
         ========================================================================= */}
      <section className="bg-gradient-to-r from-[#0a192f] via-[#0f2b5c] to-[#1e3a8a] text-white rounded-3xl p-5 md:p-8 shadow-xl border border-blue-500/30 relative overflow-hidden">
        {/* Subtle geometric pattern overlay */}
        <div className="pattern-overlay absolute inset-0 opacity-15 pointer-events-none"></div>

        {/* Ambient academic glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* School Building / Academy Crest Icon */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 p-0.5 shadow-lg shrink-0 flex items-center justify-center border border-blue-400/30">
              <div className="w-full h-full bg-[#0a192f]/90 rounded-[14px] flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl md:text-4xl text-blue-300 material-symbols-filled">
                  account_balance
                </span>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/40">
                  {isTh ? 'สถาบันการศึกษา • มาตรฐานการแนะแนวและจิตวิทยา' : 'Accredited Academic Guidance'}
                </span>
                <span className="text-[11px] text-blue-200/90 font-medium hidden sm:inline">
                  {isTh ? 'ภาคเรียนที่ 2/2569 • ข้อมูลความลับทางการแพทย์และสถานศึกษา' : 'Semester 2/2026 • Strictly Confidential'}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-snug">
                {isTh
                  ? 'โรงเรียนพัฒนศึกษา • ศูนย์สุขภาวะและจิตวิทยาการดูแลช่วยเหลือนักเรียน'
                  : 'SAFE PHATNA • Student Psychological Care & Guidance Center'}
              </h2>
              <p className="text-xs md:text-sm text-blue-100/90 mt-1 max-w-2xl leading-relaxed">
                {isTh
                  ? 'บูรณาการคุณธรรมอิสลาม หลักจิตวิทยาพัฒนาการวัยเรียน และระบบคุ้มครองความปลอดภัยในโรงเรียน พร้อมบริการดูแลและรับฟังตลอด 24 ชั่วโมง'
                  : 'Integrated Islamic moral ethics, developmental psychology, and campus safety sanctuary system available 24/7.'}
              </p>
            </div>
          </div>

          {/* Institutional Credential Badges */}
          <div className="flex items-center gap-2 flex-wrap shrink-0 border-t lg:border-t-0 lg:border-l border-blue-400/20 pt-3 lg:pt-0 lg:pl-6 text-[11px]">
            <div className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 backdrop-blur-xs rounded-xl border border-white/15 shadow-sm">
              <span className="material-symbols-outlined text-base text-blue-300">shield</span>
              <span className="font-bold text-white">{isTh ? '4 จุดปลอดภัยใน รร.' : '4 Sanctuaries'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 backdrop-blur-xs rounded-xl border border-white/15 shadow-sm">
              <span className="material-symbols-outlined text-base text-blue-300">group</span>
              <span className="font-bold text-white">{isTh ? '16 คณาจารย์พร้อมดูแล' : '16 Counselors'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 backdrop-blur-xs rounded-xl border border-white/15 shadow-sm">
              <span className="material-symbols-outlined text-base text-blue-300">clinical_notes</span>
              <span className="font-bold text-white">{isTh ? 'คัดกรอง 9Q มาตรฐาน' : '9Q Screener'}</span>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION 2: THE 4 CORE ACTION PILLARS (ตรงตาม Mockup สไตล์นักวิชาการสีน้ำเงิน!)
          1. สุขภาวะใจ  2. แผนที่จุดปลอดภัย  3. ติดตามสถานะ  4. ติดต่อผู้ให้คำปรึกษา
         ========================================================================= */}
      <section className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-blue-700 rounded-full"></span>
            <h3 className="text-base md:text-xl font-extrabold text-[#091e42] tracking-tight">
              {isTh ? '4 บริการหลักเพื่อสุขภาวะและความปลอดภัยของนักเรียน' : 'Primary Student Welfare & Safety Pillars'}
            </h3>
          </div>
          <span className="text-xs text-blue-800 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-200 hidden sm:block">
            {isTh ? 'เข้าถึงได้ทันที 24 ชม.' : 'Instant 24/7 Access'}
          </span>
        </div>

        {/* 4 Prominent Bento Hero Cards (Mockup Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* PILLAR 1: สุขภาวะใจ (Mental Well-being & Mindfulness Sanctuary) */}
          <div
            onClick={() => {
              soothingAudio.playGentleChime();
              onNavigate('wellness');
            }}
            className="group cursor-pointer bg-gradient-to-br from-white via-blue-50/50 to-slate-50 rounded-3xl p-6 border-2 border-blue-200 hover:border-blue-600 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between gap-4 relative overflow-hidden active:scale-[0.98]"
          >
            {/* Top Accent Icon & Badge */}
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-3xl material-symbols-filled">
                  spa
                </span>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                {isTh ? 'พักใจ & ฝึกสติ' : 'Sanctuary'}
              </span>
            </div>

            {/* Title & Body */}
            <div>
              <h4 className="text-lg font-extrabold text-[#091e42] group-hover:text-blue-800 transition-colors flex items-center gap-1.5">
                <span>{isTh ? 'สุขภาวะใจ' : 'Mental Well-being'}</span>
                <span className="material-symbols-outlined text-base opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                  arrow_forward
                </span>
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {isTh
                  ? 'แบบประเมินสภาวะอารมณ์รายวัน, ฝึกสติหายใจคลายเครียด 4-7-8, เสียงคลื่นบำบัด และฮีลใจด้วยอัลกุรอาน'
                  : 'Daily mood checks, 4-7-8 breathing exercises, calming audio, and mindfulness reflections.'}
              </p>
            </div>

            {/* Bottom Meta & Action */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-blue-800 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">self_improvement</span>
                <span>{isTh ? 'ดัชนีใจ & คลายเครียด' : 'Mindfulness'}</span>
              </span>
              <button
                type="button"
                className="px-3 py-1.5 rounded-full bg-blue-800 text-white text-xs font-bold shadow-2xs group-hover:bg-blue-900 transition-colors cursor-pointer"
              >
                {isTh ? 'เข้าสู่สุขภาวะใจ' : 'Enter'}
              </button>
            </div>
          </div>

          {/* PILLAR 2: แผนที่จุดปลอดภัย (Campus Safe Sanctuaries / Safe Points) */}
          <div
            onClick={() => {
              soothingAudio.playGentleChime();
              onOpenSafePoints();
            }}
            className="group cursor-pointer bg-gradient-to-br from-white via-sky-50/50 to-blue-50/40 rounded-3xl p-6 border-2 border-sky-200 hover:border-blue-600 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between gap-4 relative overflow-hidden active:scale-[0.98]"
          >
            {/* Top Accent Icon & Badge */}
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-3xl material-symbols-filled">
                  map
                </span>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200">
                {isTh ? '4 อาคารใน รร.' : '4 Campus Spots'}
              </span>
            </div>

            {/* Title & Body */}
            <div>
              <h4 className="text-lg font-extrabold text-[#091e42] group-hover:text-blue-800 transition-colors flex items-center gap-1.5">
                <span>{isTh ? 'แผนที่จุดปลอดภัย' : 'Safe Zone Map'}</span>
                <span className="material-symbols-outlined text-base opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                  arrow_forward
                </span>
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {isTh
                  ? 'แผนผังจุดพักใจฉุกเฉินและพื้นที่ปลอดภัย อาคาร 1 (ห้องพยาบาล), อาคาร 3, ห้องสมุด และห้องแนะแนว พร้อมครูเวรดูแล'
                  : 'Quiet campus sanctuaries for decompression and immediate physical protection.'}
              </p>
            </div>

            {/* Bottom Meta & Action */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-blue-800 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">location_on</span>
                <span>{isTh ? 'มีครูและสภาเวรดูแล' : 'Staffed On-Site'}</span>
              </span>
              <button
                type="button"
                className="px-3 py-1.5 rounded-full bg-blue-800 text-white text-xs font-bold shadow-2xs group-hover:bg-blue-900 transition-colors cursor-pointer"
              >
                {isTh ? 'ดูจุดปลอดภัย' : 'View'}
              </button>
            </div>
          </div>

          {/* PILLAR 3: ติดตามสถานะ (Status Tracking / Case Monitoring) */}
          <div
            onClick={() => {
              soothingAudio.playGentleChime();
              setIsStatusModalOpen(true);
            }}
            className="group cursor-pointer bg-gradient-to-br from-white via-indigo-50/50 to-blue-50/40 rounded-3xl p-6 border-2 border-indigo-200 hover:border-blue-600 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between gap-4 relative overflow-hidden active:scale-[0.98]"
          >
            {/* Top Accent Icon & Badge */}
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-700 to-blue-800 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-3xl material-symbols-filled">
                  timeline
                </span>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200">
                {isTh ? 'เคส & การช่วยเหลือ' : 'Active Cases'}
              </span>
            </div>

            {/* Title & Body */}
            <div>
              <h4 className="text-lg font-extrabold text-[#091e42] group-hover:text-blue-800 transition-colors flex items-center gap-1.5">
                <span>{isTh ? 'ติดตามสถานะ' : 'Status Tracking'}</span>
                <span className="material-symbols-outlined text-base opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                  arrow_forward
                </span>
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {isTh
                  ? 'ตรวจสอบสถานะคำร้องปรึกษาอาจารย์, ผลการคัดกรอง 9Q ล่าสุด และประวัติการบันทึกไดอารี่สะท้อนคิด'
                  : 'Track faculty consultation requests, standard 9Q screener updates, and reflection records.'}
              </p>
            </div>

            {/* Bottom Meta & Action */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-indigo-800 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">fact_check</span>
                <span>{isTh ? 'รายงานผล & สถิติ' : 'Status Reports'}</span>
              </span>
              <button
                type="button"
                className="px-3 py-1.5 rounded-full bg-blue-800 text-white text-xs font-bold shadow-2xs group-hover:bg-blue-900 transition-colors cursor-pointer"
              >
                {isTh ? 'ตรวจสอบสถานะ' : 'Check'}
              </button>
            </div>
          </div>

          {/* PILLAR 4: ติดต่อผู้ให้คำปรึกษา (Faculty & Guidance Counselors - Hands holding heart icon) */}
          <div
            onClick={() => {
              soothingAudio.playGentleChime();
              onNavigate('school');
            }}
            className="group cursor-pointer bg-gradient-to-br from-white via-blue-50/70 to-slate-50 rounded-3xl p-6 border-2 border-blue-300 hover:border-blue-700 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between gap-4 relative overflow-hidden active:scale-[0.98]"
          >
            {/* Top Accent Icon & Badge */}
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-800 to-blue-900 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-3xl material-symbols-filled">
                  volunteer_activism
                </span>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                ● {isTh ? '16 ท่านพร้อมรับฟัง' : '16 Active'}
              </span>
            </div>

            {/* Title & Body */}
            <div>
              <h4 className="text-lg font-extrabold text-[#091e42] group-hover:text-blue-800 transition-colors flex items-center gap-1.5">
                <span>{isTh ? 'ติดต่อผู้ให้คำปรึกษา' : 'Contact Advisors'}</span>
                <span className="material-symbols-outlined text-base opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                  arrow_forward
                </span>
              </h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {isTh
                  ? 'พูดคุยส่วนตัวกับครูแนะแนวและครูประจำชั้น ทั้งเรื่องการเรียน ความเครียด อนาคต และครอบครัว เป็นความลับ 100%'
                  : 'Confidential 1-on-1 counseling with accredited faculty on academics, stress, and life goals.'}
              </p>
            </div>

            {/* Bottom Meta & Action */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-blue-900 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">chat</span>
                <span>{isTh ? 'แชต / นัดพบส่วนตัว' : 'Chat & Booking'}</span>
              </span>
              <button
                type="button"
                className="px-3 py-1.5 rounded-full bg-blue-800 text-white text-xs font-bold shadow-2xs group-hover:bg-blue-900 transition-colors cursor-pointer"
              >
                {isTh ? 'เลือกอาจารย์' : 'Select'}
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Alert Quick Banner (Right underneath pillars for maximum student safety) */}
        <div className="bg-gradient-to-r from-red-50 via-rose-50 to-white rounded-2xl p-3.5 border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm pulse-animation">
              <span className="material-symbols-outlined text-xl material-symbols-filled">emergency_home</span>
            </div>
            <div>
              <span className="text-xs font-bold text-red-900 block">
                {isTh ? 'ศูนย์รับแจ้งเหตุด่วนและวิกฤตสุขภาพจิตฉุกเฉิน (สายด่วน 1323)' : 'Mental Health Crisis & Emergency Alert (Hotline 1323)'}
              </span>
              <span className="text-[11px] text-red-700">
                {isTh ? 'หากถูกคุกคาม บูลลี่รุนแรง หรือต้องการความช่วยเหลือด่วน สามารถกดแจ้งเหตุด่วนได้ทันทีตลอด 24 ชม.' : 'Instant urgent dispatch and 24/7 hotline support.'}
              </span>
            </div>
          </div>
          <button
            onClick={onOpenEmergency}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-full shadow-sm shrink-0 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">notifications_active</span>
            <span>{isTh ? 'แจ้งเหตุด่วนฉุกเฉิน' : 'Emergency Alert'}</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: TWO-WAY VOICE AI CONVERSATION (Male / Female Voice)
          ตอบตรงประเด็น วิเคราะห์อารมณ์ และพูดโต้ตอบด้วยเสียงทันที
         ========================================================================= */}
      <VoiceAiHero
        language={language}
        currentGender={currentGender}
        onGenderChange={onGenderChange}
        aiName={aiName}
        onUpdateAiName={onUpdateAiName}
        onNavigateToChat={() => onNavigate('chat')}
      />

      {/* =========================================================================
          SECTION 4: OFFICIAL INTAKE MENTAL HEALTH ASSESSMENT (Standard 9Q Screener)
          แบบคัดกรองสุขภาพจิตมาตรฐานตามเกณฑ์กรมสุขภาพจิต
         ========================================================================= */}
      <section className="bg-gradient-to-r from-blue-50/80 via-white to-blue-50/80 rounded-3xl p-6 md:p-8 soft-shadow border-2 border-blue-200 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-800 text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-2xl material-symbols-filled">
                clinical_notes
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-800 text-white">
                  {isTh ? 'เกณฑ์คัดกรองทางการ' : 'Official Intake'}
                </span>
                <span className="text-xs font-semibold text-blue-900">
                  {isTh ? 'แบบคัดกรอง 9Q มาตรฐานกรมสุขภาพจิต' : 'Standard 9Q Youth Screener'}
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-extrabold text-[#091e42] mt-1">
                {isTh
                  ? 'แบบทดสอบคัดกรองสุขภาพจิตก่อนเริ่มต้นการใช้งาน'
                  : 'Mental Health Clinical Intake Assessment'}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                {isTh
                  ? 'คัดกรองสภาวะซึมเศร้า วิตกกังวล และความเหนื่อยล้าสะสม เพื่อให้ AI และคณาจารย์คัดกรองภาวะสุขภาพจิตได้อย่างครอบคลุมและแม่นยำ'
                  : 'Measures depression, anxiety, burnout, and acute distress for accurate clinical care.'}
              </p>
            </div>
          </div>

          {/* Action button / Status badge */}
          <div className="shrink-0 flex items-center gap-3">
            {latestAssessment ? (
              <div className="flex flex-col sm:items-end gap-1.5">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    latestAssessment.tier === 'severe'
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : latestAssessment.tier === 'moderate'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : latestAssessment.tier === 'mild'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {isTh ? `ผลล่าสุด: ${latestAssessment.titleTh}` : `Score: ${latestAssessment.tier}`}
                  </span>
                  <span className="text-xs font-extrabold text-blue-900">
                    {latestAssessment.score} / {latestAssessment.maxScore}
                  </span>
                </div>
                <button
                  onClick={() => setIsAssessmentModalOpen(true)}
                  className="px-4 py-2 bg-white hover:bg-blue-50 text-blue-800 border border-blue-700 text-xs font-bold rounded-full transition-all active:scale-95 shadow-2xs cursor-pointer"
                >
                  {isTh ? 'ทำแบบประเมินซ้ำ / อัปเดต' : 'Retake Assessment'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAssessmentModalOpen(true)}
                className="px-6 py-3 bg-blue-800 hover:bg-blue-900 text-white text-xs md:text-sm font-bold rounded-full shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{isTh ? 'เริ่มทำแบบทดสอบสุขภาพจิต (2 นาที)' : 'Start Intake Screener'}</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            )}
          </div>
        </div>

        {/* If completed, show recommendation overview */}
        {latestAssessment && (
          <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-blue-800 text-lg shrink-0 mt-0.5">
                psychology
              </span>
              <div>
                <span className="font-bold text-[#091e42] block">
                  {isTh ? 'คำแนะนำทางสุขภาพจิตสำหรับคุณ:' : 'Clinical Guidance:'}
                </span>
                <span className="text-xs text-slate-600">
                  {isTh ? latestAssessment.recommendationTh : latestAssessment.recommendationEn}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 shrink-0 font-medium bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
              {isTh ? `ประเมินเมื่อ ${latestAssessment.date}` : `Assessed on ${latestAssessment.date}`}
            </span>
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 5: AUTHENTIC QURAN AUDIO RECITATIONS & THEMATIC EXPLANATION PLAYER
          เสียงอ่านอัลกุรอานจริง เลือกซูเราะห์ได้ พร้อมคำแปลและความหมาย
         ========================================================================= */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
          <div>
            <h3 className="text-lg md:text-xl font-extrabold text-[#091e42] flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-800 text-2xl material-symbols-filled">
                menu_book
              </span>
              <span>{isTh ? 'เสียงอัลกุรอานบำบัดจิตใจ & คำแปลความหมาย' : 'Quran Recitations & Meanings'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {isTh
                ? 'เลือกซูเราะฮ์เพื่อฟังเสียงอ่านจริง พร้อมคำแปลและความหมายว่าซูเราะฮ์นี้กำลังพูดถึงอะไร'
                : 'Listen to authentic recitations with complete Thai translations and thematic reflections.'}
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
            {isTh ? 'ฟังเสียงจริงและอ่านคำแปล' : 'Audio & Tafsir'}
          </span>
        </div>

        {/* Embedded Authentic Quran Audio Player */}
        <div id="quran-audio-player-section">
          <QuranAudioPlayer language={language} activeSurahNumber={activeQuranSurahNumber} />
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FORMAL WELLBEING SELF-ASSESSMENT
          ดัชนีระดับสภาวะอารมณ์และจิตใจรายวันตามเกณฑ์มาตรฐานสถานศึกษา
         ========================================================================= */}
      <section className="bg-white rounded-3xl p-6 md:p-8 soft-shadow border border-slate-200 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-800 text-xl material-symbols-filled">
                health_and_safety
              </span>
              <h3 className="text-lg md:text-xl font-bold text-[#091e42]">
                {isTh ? 'การประเมินสภาวะทางอารมณ์และจิตใจประจำวัน' : 'Formal Psychological & Wellbeing Index'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isTh
                ? 'เลือกสภาวะของคุณเพื่อเปิดระบบกิจกรรม ไดอารี่สะท้อนคิด และขั้นตอนการดูแลใจที่ตรงจุด'
                : 'Select your state to launch personalized care actions, reflection journaling, and clinical guidance'}
            </p>
          </div>
          <span className="text-[11px] text-blue-900 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
            {isTh ? 'ประเมินประจำวัน & เริ่มแอคชั่น' : 'Daily Check-in & Actions'}
          </span>
        </div>

        {/* Formal Scale Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FORMAL_MOOD_SCALES.map((scale) => {
            const isSelected = selectedScaleId === scale.id;
            return (
              <button
                key={scale.id}
                onClick={() => handleScaleSelect(scale)}
                className={`p-4 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between gap-3 shadow-2xs cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-700 ring-2 ring-blue-500/30 shadow-md scale-[1.01]'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-white hover:border-blue-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      scale.level >= 4
                        ? 'bg-rose-100 text-red-700'
                        : isSelected
                        ? 'bg-blue-800 text-white'
                        : 'bg-white text-blue-800 border border-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl material-symbols-filled">
                      {scale.icon}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      scale.level === 1
                        ? 'bg-green-100 text-green-800'
                        : scale.level === 2
                        ? 'bg-blue-100 text-blue-800'
                        : scale.level === 3
                        ? 'bg-amber-100 text-amber-800'
                        : scale.level === 4
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    Level {scale.level}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs md:text-sm text-[#091e42]">
                      {isTh ? scale.labelTh : scale.labelEn}
                    </h4>
                    {isSelected && (
                      <span className="material-symbols-outlined text-blue-700 text-sm material-symbols-filled">
                        check_circle
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                    {isTh ? scale.clinicalDescriptionTh : scale.clinicalDescriptionEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            SECTION 6.1: INTERACTIVE MOOD ACTION & REFLECTION JOURNAL WORKSPACE
            (แอคชั่นชัดเจน: เขียนเล่าเรื่อง, บันทึกไดอารี่, ฝึกหายใจ, ฟังซูเราะฮ์ฮีลใจ)
           ========================================================================= */}
        {selectedScale && (
          <div id="mood-action-suite-anchor" className="pt-2">
            <MoodActionJournal
              selectedScale={selectedScale}
              language={language}
              aiName={aiName}
              voiceGender={currentGender}
              onNavigate={onNavigate}
              onOpenEmergency={onOpenEmergency}
              onOpenSafePoints={onOpenSafePoints}
              onSelectSurah={(surahNum) => setActiveQuranSurahNumber(surahNum)}
            />
          </div>
        )}
      </section>


      {/* Institutional Reassurance Note */}
      <section className="text-center pt-2 pb-4">
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 max-w-xl mx-auto flex items-center justify-center gap-3">
          <span className="material-symbols-outlined text-blue-800 text-xl material-symbols-filled shrink-0">
            verified_user
          </span>
          <p className="text-xs text-slate-700 leading-relaxed">
            {isTh
              ? 'ข้อมูลทุกส่วนได้รับการคุ้มครองความปลอดภัยและความเป็นส่วนตัวตามมาตรฐานวิชาชีพการแนะแนวสถานศึกษา'
              : 'All interactions are securely protected and strictly confidential under school policy.'}
          </p>
        </div>
      </section>

      {/* Global Mental Health Assessment Modal */}
      <MentalHealthAssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        language={language}
        onCompleteAssessment={handleAssessmentComplete}
        onOpenSafePoints={onOpenSafePoints}
        onNavigateToTeachers={() => onNavigate('school')}
      />

      {/* Interactive Status Tracking Modal ("ติดตามสถานะ") */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-200 relative animate-fade-in text-left">
            <button
              onClick={() => setIsStatusModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-[#091e42] cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-2xl text-blue-800">timeline</span>
              <h3 className="text-lg font-bold text-[#091e42]">
                {isTh ? 'ติดตามสถานะการช่วยเหลือและสุขภาวะ' : 'Status Tracking & Care Monitoring'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              {isTh
                ? 'ติดตามความคืบหน้าของคำร้อง การนัดพบอาจารย์ และประวัติผลการดูแลสุขภาพจิตของคุณ'
                : 'Track the real-time progress of your requests, counselor bookings, and health records.'}
            </p>

            <div className="flex flex-col gap-3">
              {/* Item 1: Teacher Consultation Request */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">supervisor_account</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#091e42]">
                      {isTh ? 'การนัดหมายปรึกษาครูแนะแนว' : 'Guidance Counseling Request'}
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      {isTh ? 'ครูฟาฏิมะฮ์ สมานจิต • วันศุกร์นี้ 13:30 น.' : 'Teacher Fatima • Friday 13:30'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {isTh ? 'ยืนยันแล้ว' : 'Confirmed'}
                </span>
              </div>

              {/* Item 2: Latest 9Q Screener */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-800 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">clinical_notes</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#091e42]">
                      {isTh ? 'ผลการคัดกรองสุขภาพจิต 9Q' : 'Latest 9Q Assessment'}
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      {latestAssessment
                        ? isTh ? `ระดับ: ${latestAssessment.titleTh} (${latestAssessment.date})` : `Score: ${latestAssessment.tier}`
                        : isTh ? 'ยังไม่ได้ทำแบบทดสอบแรกเข้า' : 'Not yet taken'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                  {latestAssessment ? (isTh ? 'บันทึกแล้ว' : 'Completed') : (isTh ? 'รอการประเมิน' : 'Pending')}
                </span>
              </div>

              {/* Item 3: Campus Safe Points Readiness */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">shield</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#091e42]">
                      {isTh ? 'สถานะจุดปลอดภัยในโรงเรียน' : 'Safe Sanctuaries Status'}
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      {isTh ? '4 อาคารพร้อมให้บริการ มีครูเวรประจำการ' : '4 Spots Available with Staff'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {isTh ? 'พร้อมใช้งาน' : 'Ready'}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-5">
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                {isTh ? 'ปิดหน้าต่าง' : 'Close'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsStatusModalOpen(false);
                  onNavigate('profile');
                }}
                className="flex-1 py-2.5 bg-blue-800 text-white rounded-full text-xs font-semibold hover:bg-blue-900 active:scale-95 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
              >
                <span>{isTh ? 'ดูสถิติทั้งหมดในโปรไฟล์' : 'Full Status Profile'}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Emergency Button */}
      <button
        onClick={onOpenEmergency}
        aria-label="Emergency Report"
        className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-40 bg-red-600 text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center shadow-xl pulse-animation hover:scale-110 active:scale-90 transition-all border-2 border-white cursor-pointer"
      >
        <span className="material-symbols-outlined text-2xl md:text-3xl material-symbols-filled">
          emergency_home
        </span>
      </button>
    </div>
  );
};
