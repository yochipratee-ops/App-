import React, { useState } from 'react';
import { Language } from '../types';
import { soothingAudio } from '../utils/audio';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onNavigateToSafePoints: () => void;
  onNavigateToTeachers: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  language,
  onNavigateToSafePoints,
  onNavigateToTeachers,
}) => {
  const isTh = language === 'th';
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedIncident, setSelectedIncident] = useState<string>('');
  const [incidentDetail, setIncidentDetail] = useState('');
  const [reportedSuccess, setReportedSuccess] = useState(false);

  if (!isOpen) return null;

  const incidents = [
    { id: 'danger', icon: 'warning', labelTh: 'กำลังเกิดเหตุอันตราย', labelEn: 'Immediate Danger Occurring', bg: 'bg-[#ffdad6]', text: 'text-[#ba1a1a]' },
    { id: 'assault', icon: 'front_hand', labelTh: 'ถูกทำร้าย / ถูกข่มขู่', labelEn: 'Assaulted / Threatened', bg: 'bg-orange-100', text: 'text-orange-600' },
    { id: 'bullying', icon: 'comments_disabled', labelTh: 'ถูกบูลลี่', labelEn: 'Bullying / Harassment', bg: 'bg-amber-100', text: 'text-amber-700' },
    { id: 'family', icon: 'home', labelTh: 'ปัญหาครอบครัว', labelEn: 'Family Issues', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    { id: 'school', icon: 'school', labelTh: 'ปัญหาในโรงเรียน', labelEn: 'School Problem', bg: 'bg-teal-100', text: 'text-teal-700' },
    { id: 'friend', icon: 'group', labelTh: 'เพื่อนกำลังเดือดร้อน', labelEn: 'Friend in Distress', bg: 'bg-blue-100', text: 'text-blue-700' },
    { id: 'teacher', icon: 'support_agent', labelTh: 'ต้องการให้ครูช่วย', labelEn: 'Need Teacher Assistance', bg: 'bg-purple-100', text: 'text-purple-700' },
    { id: 'other', icon: 'more_horiz', labelTh: 'อื่น ๆ', labelEn: 'Other Matters', bg: 'bg-gray-100', text: 'text-gray-700' },
  ];

  const handleSelectIncident = (item: typeof incidents[0]) => {
    soothingAudio.playGentleChime();
    setSelectedIncident(item.labelTh);
    setStep(2);
  };

  const handleNonUrgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soothingAudio.playGentleChime();
    setReportedSuccess(true);
    setTimeout(() => {
      setReportedSuccess(false);
      setStep(1);
      onClose();
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#091e42]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl border border-slate-200 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* STEP 1: เกิดอะไรขึ้น? */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center">
            <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
              🚨 {isTh ? 'แจ้งเหตุด่วนและขอความช่วยเหลือ' : 'Emergency Alert Portal'}
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#091e42] mb-2">
              {isTh ? 'เกิดอะไรขึ้น?' : 'What is happening?'}
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mb-6 max-w-md">
              {isTh
                ? 'เลือกหัวข้อที่ตรงกับสิ่งที่คุณกำลังเผชิญหน้ามากที่สุด'
                : 'Select the category that best matches what you are experiencing.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {incidents.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectIncident(item)}
                  className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-blue-600 hover:shadow-md transition-all active:scale-95 text-left group cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined ${item.text} text-xl material-symbols-filled`}>
                      {item.icon}
                    </span>
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-[#091e42] group-hover:text-blue-800 transition-colors">
                    {isTh ? item.labelTh : item.labelEn}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: ตรวจสอบความปลอดภัยทันที */}
        {step === 2 && (
          <div className="flex flex-col items-center text-center py-2">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
              <span className="material-symbols-outlined text-3xl material-symbols-filled">
                health_and_safety
              </span>
            </div>
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
              {isTh ? 'ตรวจสอบความปลอดภัย' : 'Safety Check'}
            </p>
            <h3 className="text-lg md:text-xl font-bold text-[#091e42] mb-6 max-w-md leading-relaxed">
              {isTh
                ? 'ตอนนี้คุณหรือคนที่คุณกำลังแจ้งให้อยู่ในอันตรายทันทีหรือไม่?'
                : 'Are you or the person you are reporting for in immediate physical danger?'}
            </h3>

            <div className="flex flex-col w-full gap-3">
              {/* YES -> Critical Emergency Mode */}
              <button
                onClick={() => {
                  soothingAudio.playGentleChime();
                  setStep(3);
                }}
                className="w-full py-4 bg-red-600 text-white rounded-2xl text-base font-bold shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95 transition-all flex justify-center items-center gap-2 cursor-pointer"
              >
                <span>{isTh ? 'ใช่ อยู่ในอันตรายทันที' : 'Yes, in immediate danger'}</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>

              {/* MAYBE / NO -> Step 4 Form */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setStep(4)}
                  className="py-3 bg-slate-50 text-[#091e42] border border-slate-200 rounded-2xl text-xs md:text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {isTh ? 'ไม่แน่ใจ' : 'Not Sure'}
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="py-3 bg-slate-50 text-[#091e42] border border-slate-200 rounded-2xl text-xs md:text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {isTh ? 'ไม่ใช่' : 'No'}
                </button>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="mt-6 text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>{isTh ? 'ย้อนกลับ' : 'Back'}</span>
            </button>
          </div>
        )}

        {/* STEP 3: EMERGENCY MODE (Red Alert) */}
        {step === 3 && (
          <div className="bg-red-50 rounded-2xl p-6 text-center border-2 border-red-500/40 pulse-animation">
            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <span className="material-symbols-outlined text-base material-symbols-filled">
                crisis_alert
              </span>
              <span>EMERGENCY MODE</span>
            </div>

            <h3 className="text-base md:text-lg font-extrabold text-red-900 mb-6 leading-relaxed">
              {isTh
                ? 'สิ่งสำคัญที่สุดตอนนี้คือความปลอดภัยของคุณ อย่าเข้าไปเผชิญหน้ากับผู้ก่อเหตุด้วยตัวเอง'
                : 'Your immediate physical safety is paramount. Do not confront any aggressors alone.'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {/* ไปยังพื้นที่ปลอดภัย */}
              <button
                onClick={() => {
                  onClose();
                  onNavigateToSafePoints();
                }}
                className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all border border-slate-200 cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-800">
                  <span className="material-symbols-outlined text-2xl material-symbols-filled">
                    shield
                  </span>
                </div>
                <span className="text-xs font-bold text-[#091e42]">
                  {isTh ? 'ไปยังพื้นที่ปลอดภัย' : 'Go to Safe Point'}
                </span>
              </button>

              {/* ติดต่อครู/บุคลากร */}
              <button
                onClick={() => {
                  onClose();
                  onNavigateToTeachers();
                }}
                className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all border border-slate-200 cursor-pointer"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700">
                  <span className="material-symbols-outlined text-2xl material-symbols-filled">
                    record_voice_over
                  </span>
                </div>
                <span className="text-xs font-bold text-[#091e42]">
                  {isTh ? 'ติดต่อครู/บุคลากร' : 'Contact School Staff'}
                </span>
              </button>

              {/* ติดต่อผู้ใหญ่ที่ไว้ใจ */}
              <a
                href="tel:1300"
                className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all border border-slate-200"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                  <span className="material-symbols-outlined text-2xl material-symbols-filled">
                    handshake
                  </span>
                </div>
                <span className="text-xs font-bold text-[#091e42]">
                  {isTh ? 'ติดต่อสายด่วน 1300' : 'Call 1300 Helpline'}
                </span>
              </a>

              {/* ติดต่อบริการฉุกเฉิน 191 */}
              <a
                href="tel:191"
                className="bg-red-600 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-md hover:bg-red-700 text-white transition-all"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-2xl material-symbols-filled">
                    phone_in_talk
                  </span>
                </div>
                <span className="text-xs font-bold">
                  {isTh ? 'โทรบริการฉุกเฉิน (191)' : 'Emergency Services (191)'}
                </span>
              </a>
            </div>

            <button
              onClick={() => setStep(1)}
              className="mt-6 text-xs text-red-800 underline hover:opacity-80 cursor-pointer"
            >
              {isTh ? 'กลับไปหน้าหลักแจ้งเหตุ' : 'Back to report start'}
            </button>
          </div>
        )}

        {/* STEP 4: รายละเอียดเหตุการณ์ที่ไม่เร่งด่วน */}
        {step === 4 && (
          <div>
            <h3 className="text-lg font-bold text-[#091e42] mb-1">
              {isTh ? 'บันทึกข้อมูลและส่งเรื่อง' : 'Record Details & Escalate'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {isTh
                ? `เรื่อง: ${selectedIncident} • ข้อมูลจะถูกส่งต่อให้อาจารย์ที่ปรึกษาอย่างเป็นความลับ`
                : `Topic: ${selectedIncident} • All data kept 100% confidential.`}
            </p>

            {reportedSuccess ? (
              <div className="p-6 bg-blue-50 rounded-2xl text-center border border-blue-200 animate-fade-in">
                <span className="material-symbols-outlined text-4xl text-blue-700 mb-2 material-symbols-filled">
                  check_circle
                </span>
                <h4 className="font-bold text-sm text-[#091e42] mb-1">
                  {isTh ? 'ได้รับข้อมูลเรียบร้อยแล้ว' : 'Report Received Successfully'}
                </h4>
                <p className="text-xs text-slate-600">
                  {isTh
                    ? 'สภานักเรียนและอาจารย์ที่ปรึกษาจะตรวจสอบและประสานความช่วยเหลือให้เร็วที่สุด'
                    : 'Counselors and student council coordinators are reviewing this case.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleNonUrgentSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#091e42] block mb-1">
                    {isTh ? 'รายละเอียดเพิ่มเติม (ไม่บังคับ)' : 'Additional details (optional)'}
                  </label>
                  <textarea
                    rows={4}
                    value={incidentDetail}
                    onChange={(e) => setIncidentDetail(e.target.value)}
                    placeholder={
                      isTh
                        ? 'เล่ารายละเอียด สถานที่ หรือบุคคลที่เกี่ยวข้อง เพื่อให้เราช่วยเหลือได้ตรงจุด...'
                        : 'Provide any details, location, or context to help us address this...'
                    }
                    className="w-full bg-slate-50 rounded-2xl p-3 text-xs md:text-sm border border-slate-200 outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  ></textarea>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                  >
                    {isTh ? 'ย้อนกลับ' : 'Back'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-800 text-white rounded-full text-xs font-semibold hover:bg-blue-900 active:scale-95 transition-all shadow-sm cursor-pointer"
                  >
                    {isTh ? 'ส่งเรื่องทันที' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
