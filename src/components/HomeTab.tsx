import React, { useState } from 'react';
import { TabType, Language, VoiceGender, FormalMoodCheckIn } from '../types';
import { FORMAL_MOOD_SCALES } from '../data/mockData';
import { VoiceAiHero } from './VoiceAiHero';
import { QuranAudioPlayer } from './QuranAudioPlayer';
import { MentalHealthAssessmentModal, AssessmentResult } from './MentalHealthAssessmentModal';
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
  const [selectedScaleId, setSelectedScaleId] = useState<string | null>(null);
  const [assessmentToast, setAssessmentToast] = useState<string | null>(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);

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

    if (scale.level >= 4) {
      setAssessmentToast(
        isTh
          ? `ระบบบันทึกสภาวะ "${scale.labelTh}" เรียบร้อยแล้ว หากต้องการให้ทีมอาจารย์หรือสายด่วนสุขภาพจิตช่วยเหลือ สามารถติดต่อได้ทันที 🛡️`
          : `State recorded: "${scale.labelEn}". Urgent support resources and counselors are available.`
      );
    } else {
      setAssessmentToast(
        isTh
          ? `ระบบบันทึกสภาวะ "${scale.labelTh}" เรียบร้อยแล้ว ขอบคุณสำหรับการประเมินตนเองอย่างสม่ำเสมอ ✨`
          : `State recorded: "${scale.labelEn}". Thank you for your daily self-reflection.`
      );
    }

    setTimeout(() => setAssessmentToast(null), 5000);
  };

  return (
    <div className="w-full max-w-[1140px] mx-auto px-4 md:px-8 pt-4 pb-28 md:pb-16 flex flex-col gap-6 md:gap-8 animate-fade-in">
      {/* Toast Notification */}
      {assessmentToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#006a65] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#2bb8b0] text-xs md:text-sm max-w-lg w-[90%] text-center animate-bounce">
          {assessmentToast}
        </div>
      )}

      {/* FEATURE 1: TWO-WAY VOICE AI CONVERSATION (Male / Female Voice) - FRONT AND CENTER */}
      <VoiceAiHero
        language={language}
        currentGender={currentGender}
        onGenderChange={onGenderChange}
        aiName={aiName}
        onUpdateAiName={onUpdateAiName}
        onNavigateToChat={() => onNavigate('chat')}
      />

      {/* FEATURE 2: OFFICIAL INTAKE MENTAL HEALTH ASSESSMENT (9Q Screening & Clinical Index) */}
      <section className="bg-gradient-to-r from-[#e1f7ff] via-white to-[#e1f7ff] rounded-3xl p-6 md:p-8 soft-shadow border-2 border-[#006a65]/30 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#cfe7e6]">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#006a65] text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-2xl material-symbols-filled">
                clinical_notes
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#006a65] text-white">
                  {isTh ? 'เกณฑ์คัดกรองทางการ' : 'Official Intake'}
                </span>
                <span className="text-xs font-semibold text-[#006a65]">
                  {isTh ? 'แบบคัดกรอง 9Q มาตรฐานกรมสุขภาพจิต' : 'Standard 9Q Youth Screener'}
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-extrabold text-[#001f26] mt-1">
                {isTh
                  ? 'แบบทดสอบคัดกรองสุขภาพจิตก่อนเริ่มต้นการใช้งาน'
                  : 'Mental Health Clinical Intake Assessment'}
              </h3>
              <p className="text-xs text-[#4d6262] mt-0.5 max-w-xl">
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
                      ? 'bg-teal-100 text-teal-800 border-teal-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {isTh ? `ผลล่าสุด: ${latestAssessment.titleTh}` : `Score: ${latestAssessment.tier}`}
                  </span>
                  <span className="text-xs font-extrabold text-[#006a65]">
                    {latestAssessment.score} / {latestAssessment.maxScore}
                  </span>
                </div>
                <button
                  onClick={() => setIsAssessmentModalOpen(true)}
                  className="px-4 py-2 bg-white hover:bg-[#e1f7ff] text-[#006a65] border border-[#006a65] text-xs font-bold rounded-full transition-all active:scale-95 shadow-2xs"
                >
                  {isTh ? 'ทำแบบประเมินซ้ำ / อัปเดต' : 'Retake Assessment'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAssessmentModalOpen(true)}
                className="px-6 py-3 bg-[#006a65] hover:bg-[#004340] text-white text-xs md:text-sm font-bold rounded-full shadow-md active:scale-95 transition-all flex items-center gap-2"
              >
                <span>{isTh ? 'เริ่มทำแบบทดสอบสุขภาพจิต (2 นาที)' : 'Start Intake Screener'}</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            )}
          </div>
        </div>

        {/* If completed, show recommendation overview */}
        {latestAssessment && (
          <div className="p-4 bg-white rounded-2xl border border-[#cfe7e6] text-xs text-[#3c4948] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#006a65] text-lg shrink-0 mt-0.5">
                psychology
              </span>
              <div>
                <span className="font-bold text-[#001f26] block">
                  {isTh ? 'คำแนะนำทางสุขภาพจิตสำหรับคุณ:' : 'Clinical Guidance:'}
                </span>
                <span className="text-xs text-[#4d6262]">
                  {isTh ? latestAssessment.recommendationTh : latestAssessment.recommendationEn}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-[#6c7a78] shrink-0 font-medium bg-[#f1fbff] px-2.5 py-1 rounded-full border border-[#cfe7e6]">
              {isTh ? `ประเมินเมื่อ ${latestAssessment.date}` : `Assessed on ${latestAssessment.date}`}
            </span>
          </div>
        )}
      </section>

      {/* FEATURE 3: FORMAL WELLBEING SELF-ASSESSMENT (No cartoon stickers) */}
      <section className="bg-white rounded-3xl p-6 md:p-8 soft-shadow border border-[#cfe7e6] flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#cfe7e6]/70 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006a65] text-xl material-symbols-filled">
                health_and_safety
              </span>
              <h3 className="text-lg md:text-xl font-bold text-[#001f26]">
                {isTh ? 'การประเมินสภาวะทางอารมณ์และจิตใจ' : 'Formal Psychological & Wellbeing Index'}
              </h3>
            </div>
            <p className="text-xs text-[#6c7a78] mt-0.5">
              {isTh
                ? 'แบบวัดระดับมาตรฐานสถาบันเพื่อคัดกรองความปลอดภัยและส่งต่อการดูแลอย่างเหมาะสม'
                : 'Standardized institutional assessment for early emotional support'}
            </p>
          </div>
          <span className="text-[11px] text-[#006a65] font-bold bg-[#e1f7ff] px-3 py-1 rounded-full border border-[#cfe7e6] self-start sm:self-auto">
            {isTh ? 'ประเมินประจำวัน' : 'Daily Check-in'}
          </span>
        </div>

        {/* Formal Scale Cards Grid (Replacing cartoon stickers) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FORMAL_MOOD_SCALES.map((scale) => {
            const isSelected = selectedScaleId === scale.id;
            return (
              <button
                key={scale.id}
                onClick={() => handleScaleSelect(scale)}
                className={`p-4 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between gap-3 shadow-2xs ${
                  isSelected
                    ? 'bg-[#e1f7ff] border-[#006a65] ring-2 ring-[#006a65]/20 shadow-xs'
                    : 'bg-[#f1fbff] border-[#cfe7e6] hover:bg-white hover:border-[#006a65]/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      scale.level >= 4
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : isSelected
                        ? 'bg-[#006a65] text-white'
                        : 'bg-white text-[#006a65] border border-[#cfe7e6]'
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
                  <h4 className="font-bold text-xs md:text-sm text-[#001f26]">
                    {isTh ? scale.labelTh : scale.labelEn}
                  </h4>
                  <p className="text-[11px] text-[#6c7a78] mt-1 leading-snug line-clamp-2">
                    {isTh ? scale.clinicalDescriptionTh : scale.clinicalDescriptionEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* CORE ACTION MODULES (Formal styling) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. ดูแลใจ */}
        <button
          onClick={() => onNavigate('wellness')}
          className="bg-white rounded-3xl p-5 md:p-6 flex flex-col items-center justify-center gap-3 soft-shadow border border-[#cfe7e6] hover:border-[#006a65] transition-all text-center group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#e1f7ff] flex items-center justify-center text-[#006a65] group-hover:scale-105 transition-transform shadow-2xs">
            <span className="material-symbols-outlined text-2xl material-symbols-filled">spa</span>
          </div>
          <span className="font-bold text-xs md:text-sm text-[#001f26]">
            {isTh ? 'พื้นที่พักใจ (Healing Space)' : 'Healing Space'}
          </span>
          <span className="text-[11px] text-[#6c7a78] hidden sm:block">
            {isTh ? 'ดุอาอ์ อายะฮ์ และการฝึกสติ' : 'Prayers, Quran & Reflections'}
          </span>
        </button>

        {/* 2. ปรึกษาอาจารย์ */}
        <button
          onClick={() => onNavigate('school')}
          className="bg-white rounded-3xl p-5 md:p-6 flex flex-col items-center justify-center gap-3 soft-shadow border border-[#cfe7e6] hover:border-[#006a65] transition-all text-center group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#e1f7ff] flex items-center justify-center text-[#006a65] group-hover:scale-105 transition-transform shadow-2xs">
            <span className="material-symbols-outlined text-2xl material-symbols-filled">supervisor_account</span>
          </div>
          <span className="font-bold text-xs md:text-sm text-[#001f26]">
            {isTh ? 'ปรึกษาคณาจารย์' : 'Faculty Counseling'}
          </span>
          <span className="text-[11px] text-[#6c7a78] hidden sm:block">
            {isTh ? 'อาจารย์ 16 ท่านพร้อมรับฟัง' : '16 qualified teachers'}
          </span>
        </button>

        {/* 3. จุดปลอดภัย */}
        <button
          onClick={onOpenSafePoints}
          className="bg-white rounded-3xl p-5 md:p-6 flex flex-col items-center justify-center gap-3 soft-shadow border border-[#cfe7e6] hover:border-[#006a65] transition-all text-center group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#e1f7ff] flex items-center justify-center text-[#006a65] group-hover:scale-105 transition-transform shadow-2xs">
            <span className="material-symbols-outlined text-2xl material-symbols-filled">shield</span>
          </div>
          <span className="font-bold text-xs md:text-sm text-[#001f26]">
            {isTh ? 'จุดปลอดภัยในโรงเรียน' : 'Safe Sanctuaries'}
          </span>
          <span className="text-[11px] text-[#6c7a78] hidden sm:block">
            {isTh ? 'พื้นที่พักฟื้นและขอความช่วยเหลือ' : 'Quiet campus rest points'}
          </span>
        </button>

        {/* 4. แจ้งเหตุด่วน */}
        <button
          onClick={onOpenEmergency}
          className="bg-[#ffdad6] rounded-3xl p-5 md:p-6 flex flex-col items-center justify-center gap-3 soft-shadow border border-red-200 hover:border-[#ba1a1a] transition-all text-center group pulse-animation"
        >
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#ba1a1a] group-hover:scale-105 transition-transform shadow-xs">
            <span className="material-symbols-outlined text-2xl material-symbols-filled">emergency_home</span>
          </div>
          <span className="font-extrabold text-xs md:text-sm text-[#93000a]">
            {isTh ? 'แจ้งเหตุด่วนฉุกเฉิน' : 'Emergency Report'}
          </span>
          <span className="text-[11px] text-[#ba1a1a] hidden sm:block">
            {isTh ? 'ขอความช่วยเหลือทันที 24 ชม.' : 'Immediate assistance'}
          </span>
        </button>
      </section>

      {/* FEATURE 4: AUTHENTIC QURAN AUDIO RECITATIONS & THEMATIC EXPLANATION PLAYER */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
          <div>
            <h3 className="text-lg md:text-xl font-extrabold text-[#001f26] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006a65] text-2xl material-symbols-filled">
                menu_book
              </span>
              <span>{isTh ? 'เสียงอัลกุรอานบำบัดจิตใจ & คำแปลความหมาย' : 'Quran Recitations & Meanings'}</span>
            </h3>
            <p className="text-xs text-[#6c7a78]">
              {isTh
                ? 'เลือกซูเราะฮ์เพื่อฟังเสียงอ่านจริง พร้อมคำแปลและความหมายว่าซูเราะฮ์นี้กำลังพูดถึงอะไร'
                : 'Listen to authentic recitations with complete Thai translations and thematic reflections.'}
            </p>
          </div>
          <span className="text-xs font-semibold text-[#006a65] bg-[#e1f7ff] px-3 py-1 rounded-full border border-[#cfe7e6] self-start sm:self-auto">
            {isTh ? 'ฟังเสียงจริงและอ่านคำแปล' : 'Audio & Tafsir'}
          </span>
        </div>

        {/* Embedded Player */}
        <QuranAudioPlayer language={language} />
      </section>

      {/* Institutional Reassurance Note */}
      <section className="text-center pt-2 pb-4">
        <div className="bg-[#e1f7ff]/70 border border-[#cfe7e6] rounded-2xl p-4 max-w-xl mx-auto flex items-center justify-center gap-3">
          <span className="material-symbols-outlined text-[#006a65] text-xl material-symbols-filled shrink-0">
            verified_user
          </span>
          <p className="text-xs text-[#3c4948] leading-relaxed">
            {isTh
              ? 'ข้อมูลทุกส่วนได้รับการคุ้มครองความปลอดภัยและความเป็นส่วนตัวตามมาตรฐานสถานศึกษา'
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

      {/* Floating Emergency Button */}
      <button
        onClick={onOpenEmergency}
        aria-label="Emergency Report"
        className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-40 bg-[#ba1a1a] text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center shadow-xl pulse-animation hover:scale-110 active:scale-90 transition-all border-2 border-white"
      >
        <span className="material-symbols-outlined text-2xl md:text-3xl material-symbols-filled">
          emergency_home
        </span>
      </button>
    </div>
  );
};
