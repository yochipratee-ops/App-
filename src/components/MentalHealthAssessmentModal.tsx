import React, { useState } from 'react';
import { Language } from '../types';
import { soothingAudio } from '../utils/audio';

export interface AssessmentResult {
  score: number;
  maxScore: number;
  tier: 'normal' | 'mild' | 'moderate' | 'severe';
  titleTh: string;
  titleEn: string;
  recommendationTh: string;
  recommendationEn: string;
  date: string;
}

interface MentalHealthAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onCompleteAssessment: (result: AssessmentResult) => void;
  onOpenSafePoints?: () => void;
  onNavigateToTeachers?: () => void;
}

const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    textTh: 'เบื่อ ไม่มีความสุข หรือไม่เพลิดเพลินในการทำสิ่งต่างๆ ในช่วง 2 สัปดาห์ที่ผ่านมา',
    textEn: 'Little interest or pleasure in doing things over the last 2 weeks',
  },
  {
    id: 2,
    textTh: 'รู้สึกไม่สบายใจ ซึมเศร้า ท้อแท้ หรือหมดพลังใจ',
    textEn: 'Feeling down, depressed, hopeless, or low energy',
  },
  {
    id: 3,
    textTh: 'หลับยาก หลับๆ ตื่นๆ หรือนอนหลับมากเกินปกติ',
    textEn: 'Trouble falling/staying asleep, or sleeping too much',
  },
  {
    id: 4,
    textTh: 'รู้สึกเหนื่อยล้า อ่อนเพลีย ไม่มีแรงแม้ทำกิจวัตรประจำวัน',
    textEn: 'Feeling tired or having very little energy',
  },
  {
    id: 5,
    textTh: 'เบื่ออาหาร หรือรับประทานอาหารมากเกินไปผิดปกติ',
    textEn: 'Poor appetite or overeating',
  },
  {
    id: 6,
    textTh: 'รู้สึกไม่ดีกับตนเอง รู้สึกว่าตนเองล้มเหลว หรือทำให้ผู้อื่นผิดหวัง',
    textEn: 'Feeling bad about yourself, or that you are a failure',
  },
  {
    id: 7,
    textTh: 'สมาธิในการเรียนหรือทำงานลดลง เช่น อ่านหนังสือ หรือฟังอาจารย์สอนไม่รู้เรื่อง',
    textEn: 'Trouble concentrating on things such as reading or studying',
  },
  {
    id: 8,
    textTh: 'เชื่องช้าลงจนผู้อื่นสังเกตเห็นได้ชัด หรือกระสับกระส่ายอยู่ไม่เป็นสุข',
    textEn: 'Moving or speaking noticeably slowly, or being restless',
  },
  {
    id: 9,
    textTh: 'รู้สึกท้อแท้ต่อชีวิต หรือมีความคิดอยากหนีไปให้พ้นจากปัญหา',
    textEn: 'Thoughts of giving up or wanting to escape life challenges',
  },
];

const SCORING_OPTIONS = [
  { score: 0, labelTh: 'ไม่มีเลย (0 วัน)', labelEn: 'Not at all' },
  { score: 1, labelTh: 'มีบางวัน (1-7 วัน)', labelEn: 'Several days' },
  { score: 2, labelTh: 'มีบ่อย (มากกว่า 7 วัน)', labelEn: 'More than half the days' },
  { score: 3, labelTh: 'มีเกือบทุกวัน (ตลอด 2 สัปดาห์)', labelEn: 'Nearly every day' },
];

export const MentalHealthAssessmentModal: React.FC<MentalHealthAssessmentModalProps> = ({
  isOpen,
  onClose,
  language,
  onCompleteAssessment,
  onOpenSafePoints,
  onNavigateToTeachers,
}) => {
  const isTh = language === 'th';
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentStep, setCurrentStep] = useState<'intro' | 'questions' | 'result'>('intro');
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  if (!isOpen) return null;

  const handleSelectOption = (questionId: number, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  const calculateResult = () => {
    let total = 0;
    ASSESSMENT_QUESTIONS.forEach((q) => {
      total += answers[q.id] ?? 0;
    });

    let tier: 'normal' | 'mild' | 'moderate' | 'severe' = 'normal';
    let titleTh = 'สุขภาพจิตอยู่ในเกณฑ์ปกติและสมดุล (Normal)';
    let titleEn = 'Normal Psychological Balance';
    let recommendationTh =
      'สภาวะทางอารมณ์ของคุณอยู่ในเกณฑ์ปกติ ดูแลสุขภาพใจต่อไปด้วยการพักผ่อน ทานอาหารที่มีประโยชน์ และทำกิจกรรมที่ชอบสม่ำเสมอ';
    let recommendationEn =
      'Your mental wellbeing is balanced. Maintain your healthy habits and self-care routine.';

    if (total >= 19) {
      tier = 'severe';
      titleTh = 'มีภาวะความเสี่ยงสูงที่ควรได้รับการดูแลอย่างใกล้ชิด (Severe Risk)';
      titleEn = 'Severe Psychological Risk - Clinical Attention Recommended';
      recommendationTh =
        'ระดับคะแนนบ่งชี้ว่าคุณกำลังแบกรับความทุกข์หรือความกดดันสูงมาก ขอให้รู้ว่าคุณไม่ต้องเผชิญเรื่องนี้คนเดียว แนะนำให้ติดต่อครูแนะแนว หรือเดินทางไปยังจุด Safe Point ทันทีเพื่อรับการสนับสนุนที่ปลอดภัย';
      recommendationEn =
        'Your scores indicate intense psychological distress. Please connect with a counselor or visit a campus Safe Point immediately.';
    } else if (total >= 13) {
      tier = 'moderate';
      titleTh = 'มีภาวะเครียดหรือซึมเศร้าปานกลาง (Moderate Distress)';
      titleEn = 'Moderate Distress Level';
      recommendationTh =
        'คุณกำลังเผชิญความเหนื่อยล้าหรือความวิตกกังวลสะสม แนะนำให้แบ่งปันความรู้สึกกับครูที่ปรึกษา หรือใช้บริการห้องพักใจ Safe Point เพื่อผ่อนคลาย';
      recommendationEn =
        'Moderate distress noted. Reaching out to faculty advisors or quiet campus spaces is strongly recommended.';
    } else if (total >= 7) {
      tier = 'mild';
      titleTh = 'มีภาวะเครียดหรือเหนื่อยล้าเล็กน้อย (Mild Fatigue/Distress)';
      titleEn = 'Mild Fatigue / Mild Stress';
      recommendationTh =
        'คุณมีความตึงเครียดหรือความเหนื่อยสะสมเล็กน้อย ลองจัดตารางพักผ่อน ฟังเสียงอัลกุรอาน หรือฝึกหายใจเพื่อฟื้นฟูพลังใจ';
      recommendationEn =
        'Mild strain detected. Prioritize sleep, listening to healing recitations, and pacing your daily tasks.';
    }

    const res: AssessmentResult = {
      score: total,
      maxScore: 27,
      tier,
      titleTh,
      titleEn,
      recommendationTh,
      recommendationEn,
      date: new Date().toLocaleDateString(isTh ? 'th-TH' : 'en-US'),
    };

    setAssessmentResult(res);
    setCurrentStep('result');
    soothingAudio.playGentleChime();
    onCompleteAssessment(res);
  };

  const isAllAnswered = ASSESSMENT_QUESTIONS.every((q) => answers[q.id] !== undefined);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-[#cfe7e6] relative animate-fade-in text-left max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#f1fbff] flex items-center justify-center text-[#6c7a78] hover:text-[#001f26] transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* STEP 1: INTRO SCREEN */}
        {currentStep === 'intro' && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#006a65] text-white flex items-center justify-center shrink-0 shadow-md">
                <span className="material-symbols-outlined text-2xl material-symbols-filled">
                  health_and_safety
                </span>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-extrabold text-[#001f26]">
                  {isTh ? 'แบบคัดกรองสุขภาพจิตมาตรฐาน (Standard 9Q Assessment)' : 'Official Mental Health Assessment'}
                </h3>
                <span className="text-xs text-[#6c7a78]">
                  {isTh
                    ? 'เครื่องมือประเมินระดับความเครียดและสุขภาพจิตตามเกณฑ์มาตรฐานกรมสุขภาพจิต'
                    : 'Standardized psychological screening tool for institutional student care'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#f1fbff] rounded-2xl border border-[#cfe7e6] flex flex-col gap-2">
              <span className="text-xs font-bold text-[#006a65] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                <span>{isTh ? 'ข้อมูลของคุณเป็นความลับสูงสุด (Confidential)' : '100% Confidential'}</span>
              </span>
              <p className="text-xs text-[#3c4948] leading-relaxed">
                {isTh
                  ? 'แบบประเมินนี้ประกอบด้วย 9 ข้อคำถาม ใช้เวลาเพียง 2-3 นาที เพื่อวิเคราะห์ระดับความตึงเครียด ภาวะอารมณ์ และความเหนื่อยล้าสะสม ช่วยให้ระบบปรับแต่งการดูแลและข้อความของ AI ให้ตรงกับคุณอย่างแท้จริง'
                  : 'Consists of 9 clinical questions taking 2-3 minutes to measure stress and emotional fatigue for tailored institutional support.'}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => setCurrentStep('questions')}
                className="w-full py-4 bg-[#006a65] hover:bg-[#004340] text-white rounded-full font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>{isTh ? 'เริ่มทำแบบประเมินสุขภาพจิต (9 ข้อ)' : 'Start 9-Question Assessment'}</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 text-xs text-[#6c7a78] hover:text-[#001f26] font-semibold"
              >
                {isTh ? 'ไว้ทำภายหลัง' : 'Skip for now'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: QUESTIONS LIST */}
        {currentStep === 'questions' && (
          <div className="flex flex-col gap-6">
            <div className="pb-3 border-b border-[#cfe7e6]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-bold text-[#001f26]">
                  {isTh ? 'แบบประเมินสภาวะทางอารมณ์และจิตใจ' : 'Psychological Questionnaire'}
                </h3>
                <span className="text-xs font-bold text-[#006a65] bg-[#e1f7ff] px-3 py-1 rounded-full border border-[#cfe7e6]">
                  {Object.keys(answers).length} / {ASSESSMENT_QUESTIONS.length} {isTh ? 'ข้อ' : 'answered'}
                </span>
              </div>
              <p className="text-xs text-[#6c7a78] mt-1">
                {isTh
                  ? 'โปรดเลือกคำตอบที่ตรงกับความรู้สึกของคุณมากที่สุดในช่วง 2 สัปดาห์ที่ผ่านมา'
                  : 'Select how often you have been bothered by these problems in the last 2 weeks.'}
              </p>
            </div>

            {/* Questions stream */}
            <div className="flex flex-col gap-5">
              {ASSESSMENT_QUESTIONS.map((q) => (
                <div
                  key={q.id}
                  className="p-4 bg-[#f1fbff]/60 border border-[#cfe7e6] rounded-2xl flex flex-col gap-3"
                >
                  <span className="text-xs md:text-sm font-bold text-[#001f26]">
                    {q.id}. {isTh ? q.textTh : q.textEn}
                  </span>

                  {/* 4 Score Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SCORING_OPTIONS.map((opt) => {
                      const isSelected = answers[q.id] === opt.score;
                      return (
                        <button
                          key={opt.score}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt.score)}
                          className={`p-2.5 rounded-xl text-xs text-left border transition-all ${
                            isSelected
                              ? 'bg-[#006a65] text-white border-[#006a65] font-bold shadow-xs'
                              : 'bg-white text-[#3c4948] border-[#cfe7e6] hover:bg-[#e1f7ff]'
                          }`}
                        >
                          <span className="block font-medium">{isTh ? opt.labelTh : opt.labelEn}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                disabled={!isAllAnswered}
                onClick={calculateResult}
                className={`w-full py-4 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  isAllAnswered
                    ? 'bg-[#006a65] hover:bg-[#004340] text-white active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>{isTh ? 'ประมวลผลคะแนนสุขภาพจิต' : 'Submit & Analyze Score'}</span>
                <span className="material-symbols-outlined text-base">analytics</span>
              </button>
              {!isAllAnswered && (
                <p className="text-[11px] text-center text-[#ba1a1a] mt-2 font-medium">
                  {isTh ? '* กรุณาตอบให้ครบทั้ง 9 ข้อเพื่อประมวลผลที่แม่นยำ' : '* Please answer all 9 questions'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: CLINICAL RESULT & REPORT */}
        {currentStep === 'result' && assessmentResult && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex items-center gap-3 pb-3 border-b border-[#cfe7e6]">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 ${
                  assessmentResult.tier === 'severe'
                    ? 'bg-[#ba1a1a]'
                    : assessmentResult.tier === 'moderate'
                    ? 'bg-[#f59e0b]'
                    : assessmentResult.tier === 'mild'
                    ? 'bg-[#2bb8b0]'
                    : 'bg-[#10b981]'
                }`}
              >
                <span className="material-symbols-outlined text-2xl material-symbols-filled">
                  clinical_notes
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#6c7a78]">
                  {isTh ? 'ผลการประเมินสุขภาพจิตอย่างเป็นทางการ' : 'Official Clinical Assessment Report'}
                </span>
                <h3 className="text-lg md:text-xl font-extrabold text-[#001f26]">
                  {isTh ? assessmentResult.titleTh : assessmentResult.titleEn}
                </h3>
              </div>
            </div>

            {/* Score Card */}
            <div className="bg-[#f1fbff] p-5 rounded-2xl border border-[#cfe7e6] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#6c7a78] block font-medium">
                  {isTh ? 'คะแนนรวมของคุณ:' : 'Total Assessment Score:'}
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl md:text-4xl font-extrabold text-[#006a65]">
                    {assessmentResult.score}
                  </span>
                  <span className="text-sm text-[#6c7a78]">/ {assessmentResult.maxScore}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={`px-4 py-2 rounded-2xl text-xs font-bold border ${
                  assessmentResult.tier === 'severe'
                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                    : assessmentResult.tier === 'moderate'
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : assessmentResult.tier === 'mild'
                    ? 'bg-teal-50 text-teal-800 border-teal-300'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                }`}
              >
                {isTh
                  ? `ระดับ: ${
                      assessmentResult.tier === 'severe'
                        ? 'วิกฤต/เฝ้าระวังสูงสุด'
                        : assessmentResult.tier === 'moderate'
                        ? 'ปานกลาง'
                        : assessmentResult.tier === 'mild'
                        ? 'เล็กน้อย'
                        : 'ปกติ'
                    }`
                  : `Tier: ${assessmentResult.tier}`}
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 bg-white rounded-2xl border border-[#2bb8b0]/40 flex flex-col gap-2 shadow-xs">
              <span className="text-xs font-bold text-[#006a65] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">psychology</span>
                <span>{isTh ? 'คำแนะนำสำหรับคุณ (Clinical Guidance):' : 'Recommendations:'}</span>
              </span>
              <p className="text-xs md:text-sm text-[#3c4948] leading-relaxed">
                {isTh ? assessmentResult.recommendationTh : assessmentResult.recommendationEn}
              </p>
            </div>

            {/* Immediate Support Actions if elevated */}
            {(assessmentResult.tier === 'moderate' || assessmentResult.tier === 'severe') && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col gap-2.5">
                <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">shield</span>
                  <span>{isTh ? 'ช่องทางช่วยเหลือเร่งด่วนสำหรับคุณ:' : 'Urgent Support Available:'}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {onNavigateToTeachers && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToTeachers();
                      }}
                      className="px-4 py-2 bg-[#006a65] text-white text-xs font-bold rounded-full hover:bg-[#004340]"
                    >
                      {isTh ? 'ปรึกษาครูแนะแนวทันที' : 'Consult Guidance Counselor'}
                    </button>
                  )}
                  {onOpenSafePoints && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenSafePoints();
                      }}
                      className="px-4 py-2 bg-white text-[#006a65] border border-[#cfe7e6] text-xs font-bold rounded-full hover:bg-[#e1f7ff]"
                    >
                      {isTh ? 'ไปยังห้องพักใจ Safe Point' : 'Visit Safe Point Room'}
                    </button>
                  )}
                  <a
                    href="tel:1323"
                    className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-full hover:bg-rose-700 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                    <span>{isTh ? 'สายด่วนสุขภาพจิต 1323 (โทรฟรี)' : 'Mental Health Hotline 1323'}</span>
                  </a>
                </div>
              </div>
            )}

            {/* Footer Finish */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-[#006a65] hover:bg-[#004340] text-white rounded-full font-bold text-xs md:text-sm shadow-md transition-all active:scale-95"
              >
                {isTh ? 'บันทึกผลและเข้าสู่การใช้งาน' : 'Save & Proceed to App'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
