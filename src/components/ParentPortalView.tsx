import React, { useState } from 'react';
import { Language } from '../types';
import { PARENT_REPORT_MOCK, TEACHERS_LIST } from '../data/mockData';
import { soothingAudio } from '../utils/audio';

export const ParentPortalView: React.FC<{ language: Language }> = ({ language }) => {
  const isTh = language === 'th';
  const report = PARENT_REPORT_MOCK;
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState('t-1');
  const [appointmentTopic, setAppointmentTopic] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('2026-10-15');
  const [appointmentTime, setAppointmentTime] = useState('14:30');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Parent guidance expandable
  const [selectedGuidance, setSelectedGuidance] = useState<
    'exhaustion' | 'exam' | 'bullying' | 'depression' | 'family' | 'sleep'
  >('exhaustion');

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    soothingAudio.playGentleChime();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowAppointmentForm(false);
      setAppointmentTopic('');
    }, 3500);
  };

  return (
    <div className="w-full max-w-[1140px] mx-auto px-4 md:px-8 pt-6 pb-28 md:pb-16 flex flex-col gap-6 animate-fade-in">
      {/* Parent Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 soft-shadow border border-[#cfe7e6]">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e1f7ff] rounded-full text-[#006a65] text-xs font-bold mb-3 border border-[#cfe7e6]">
          <span className="material-symbols-outlined text-sm material-symbols-filled">family_restroom</span>
          <span>{isTh ? 'โหมดผู้ปกครอง (Official Parent Care Portal)' : 'Official Parent Care Portal'}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#001f26]">
          {isTh ? 'รายงานสุขภาวะและการดูแลความปลอดภัยของบุตรหลาน' : 'Child Mental Wellbeing & Behavioral Insights'}
        </h1>
        <p className="text-xs md:text-sm text-[#4d6262] mt-1">
          {isTh
            ? 'ข้อมูลติดตามสุขภาพจิต การคัดกรองภาวะทางอารมณ์ และช่องทางสื่อสารร่วมมือกับครูที่ปรึกษา'
            : 'Confidential psychiatric, behavioral, and academic wellbeing insights for parents.'}
        </p>
      </div>

      {/* STUDENT HEALTH DOSSIER CARD */}
      <div className="bg-white rounded-3xl p-6 md:p-8 soft-shadow border border-[#cfe7e6]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#cfe7e6]">
          <div>
            <span className="text-xs font-bold text-[#6c7a78] uppercase">{isTh ? 'ข้อมูลบุตรหลานในความดูแล' : 'Student Care Roster'}</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#001f26] mt-0.5">{report.studentAlias}</h2>
            <p className="text-xs text-[#006a65] font-semibold">{report.gradeLevel} • เลขประจำตัวนักเรียน: 48921</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
              {isTh ? 'ภาวะเฝ้าระวัง: ล้าสะสมและวิตกกังวลสอบ' : 'Watchlist: Fatigue & Exam Stress'}
            </span>
          </div>
        </div>

        {/* 5-DIMENSION WELLBEING METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 my-6">
          <div className="bg-[#f1fbff] p-4 rounded-2xl border border-[#cfe7e6]">
            <span className="text-[11px] font-bold text-[#6c7a78] block">{isTh ? 'ภาวะความเครียด' : 'Stress Index'}</span>
            <span className="text-xl md:text-2xl font-extrabold text-[#ba1a1a] block mt-1">74%</span>
            <span className="text-[10px] text-rose-700 font-semibold">{isTh ? 'สูงกว่าเกณฑ์ปกติ' : 'Elevated'}</span>
          </div>

          <div className="bg-[#f1fbff] p-4 rounded-2xl border border-[#cfe7e6]">
            <span className="text-[11px] font-bold text-[#6c7a78] block">{isTh ? 'สุขอนามัยการนอน' : 'Sleep Health'}</span>
            <span className="text-xl md:text-2xl font-extrabold text-[#001f26] block mt-1">5.2 ชม.</span>
            <span className="text-[10px] text-amber-700 font-semibold">{isTh ? 'ควรนอน 7-8 ชม.' : 'Deficit noted'}</span>
          </div>

          <div className="bg-[#f1fbff] p-4 rounded-2xl border border-[#cfe7e6]">
            <span className="text-[11px] font-bold text-[#6c7a78] block">{isTh ? 'สมาธิในการเรียน' : 'Focus Level'}</span>
            <span className="text-xl md:text-2xl font-extrabold text-[#006a65] block mt-1">ปานกลาง</span>
            <span className="text-[10px] text-teal-700 font-semibold">{isTh ? 'เหม่อลอยช่วงบ่าย' : 'Moderate'}</span>
          </div>

          <div className="bg-[#f1fbff] p-4 rounded-2xl border border-[#cfe7e6]">
            <span className="text-[11px] font-bold text-[#6c7a78] block">{isTh ? 'ความสัมพันธ์เพื่อน' : 'Social Life'}</span>
            <span className="text-xl md:text-2xl font-extrabold text-[#001f26] block mt-1">ปกติ</span>
            <span className="text-[10px] text-emerald-700 font-semibold">{isTh ? 'มีกลุ่มเพื่อนสนิท' : 'Stable'}</span>
          </div>

          <div className="bg-[#f1fbff] p-4 rounded-2xl border border-[#cfe7e6]">
            <span className="text-[11px] font-bold text-[#6c7a78] block">{isTh ? 'การเข้าเรียน' : 'Attendance'}</span>
            <span className="text-xl md:text-2xl font-extrabold text-[#006a65] block mt-1">{report.attendanceRate}</span>
            <span className="text-[10px] text-teal-700 font-semibold">{isTh ? 'ตรงเวลาสม่ำเสมอ' : 'Regular'}</span>
          </div>
        </div>

        {/* DETECTED STUDENT CONDITION & HOMEROOM NOTES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Left: What Condition Child Has */}
          <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase">
              <span className="material-symbols-outlined text-base">psychology</span>
              <span>{isTh ? 'ภาวะที่ตรวจพบในปัจจุบัน (Current Student Condition):' : 'Diagnosed Condition:'}</span>
            </div>
            <h4 className="font-extrabold text-base text-amber-950">
              {isTh ? 'ภาวะวิตกกังวลต่อการสอบ และล้าสะสมจากการอ่านหนังสือ' : 'Exam Stress & Cumulative Burnout'}
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed">
              {isTh
                ? 'นักเรียนมีความกังวลสูงเกี่ยวกับผลสอบและเกรดเฉลี่ย มักพูดคุยกับ AI ว่า "เราเหนื่อยมาก" ในช่วงค่ำ มีอาการนอนไม่หลับ และกดดันตนเองสูงเพื่อไม่ให้คนรอบข้างผิดหวัง'
                : 'Student expresses high concern regarding academic scores, frequently mentions fatigue to AI, and experiences insomnia before tests.'}
            </p>
          </div>

          {/* Right: Teacher Advice to Parents */}
          <div className="p-5 bg-[#e1f7ff] border border-[#2bb8b0]/40 rounded-2xl flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-[#006a65] font-bold text-xs uppercase">
              <span className="material-symbols-outlined text-base">support_agent</span>
              <span>{isTh ? 'ข้อแนะนำจากครูแนะแนวถึงผู้ปกครอง:' : 'Guidance from Counselor:'}</span>
            </div>
            <h4 className="font-extrabold text-base text-[#004340]">
              {report.teacherAdvisor} (ห้องแนะแนว)
            </h4>
            <p className="text-xs text-[#004340] leading-relaxed">
              {isTh
                ? 'แนะนำให้คุณพ่อคุณแม่ช่วยลดการสอบถามเรื่องคะแนนหรืออันดับที่ และเปลี่ยนเป็นการให้กำลังใจ เช่น "ทำเต็มที่ก็เก่งมากแล้ว พักผ่อนบ้างนะลูก" จะช่วยลดระดับความตึงเครียดของน้องได้มากค่ะ'
                : 'We advise parents to reduce pressure regarding test ranks and offer words of encouragement to help ease their anxiety.'}
            </p>
          </div>
        </div>
      </div>

      {/* PARENTAL PSYCHOEDUCATION GUIDANCE CARDS */}
      <div className="bg-white rounded-3xl p-6 md:p-8 soft-shadow border border-[#cfe7e6] flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#cfe7e6]">
          <div>
            <h3 className="text-lg font-bold text-[#001f26]">
              {isTh ? 'คู่มือสำหรับผู้ปกครอง: วิธีรับมือเมื่อลูกมีภาวะต่างๆ' : 'Parent Care Guides for Specific Student Conditions'}
            </h3>
            <p className="text-xs text-[#6c7a78]">
              {isTh ? 'เทคนิคการพูดคุยเชิงบวกที่จิตแพทย์และนักจิตวิทยาแนะนำ' : 'Positive communication techniques for parents'}
            </p>
          </div>
        </div>

        {/* 6 Comprehensive Condition Guide Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button
            onClick={() => setSelectedGuidance('exhaustion')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedGuidance === 'exhaustion' ? 'bg-[#006a65] text-white shadow-xs' : 'bg-[#f1fbff] text-[#3c4948]'
            }`}
          >
            {isTh ? '1. หมดไฟ / เหนื่อยล้าสะสม' : '1. Burnout & Fatigue'}
          </button>
          <button
            onClick={() => setSelectedGuidance('exam')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedGuidance === 'exam' ? 'bg-[#006a65] text-white shadow-xs' : 'bg-[#f1fbff] text-[#3c4948]'
            }`}
          >
            {isTh ? '2. วิตกกังวลสอบ & อนาคต' : '2. Exam & Future Anxiety'}
          </button>
          <button
            onClick={() => setSelectedGuidance('bullying')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedGuidance === 'bullying' ? 'bg-[#006a65] text-white shadow-xs' : 'bg-[#f1fbff] text-[#3c4948]'
            }`}
          >
            {isTh ? '3. ถูกบูลลี่ / โดดเดี่ยว' : '3. Bullying & Isolation'}
          </button>
          <button
            onClick={() => setSelectedGuidance('depression')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedGuidance === 'depression' ? 'bg-[#006a65] text-white shadow-xs' : 'bg-[#f1fbff] text-[#3c4948]'
            }`}
          >
            {isTh ? '4. ภาวะซึมเศร้า / เงียบเก็บตัว' : '4. Depression & Withdrawal'}
          </button>
          <button
            onClick={() => setSelectedGuidance('family')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedGuidance === 'family' ? 'bg-[#006a65] text-white shadow-xs' : 'bg-[#f1fbff] text-[#3c4948]'
            }`}
          >
            {isTh ? '5. ความกดดันในครอบครัว' : '5. Family Tension'}
          </button>
          <button
            onClick={() => setSelectedGuidance('sleep')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedGuidance === 'sleep' ? 'bg-[#006a65] text-white shadow-xs' : 'bg-[#f1fbff] text-[#3c4948]'
            }`}
          >
            {isTh ? '6. นอนไม่หลับ / ล้าเรื้อรัง' : '6. Insomnia & Physical Strain'}
          </button>
        </div>

        {/* Guidance Content */}
        <div className="p-5 bg-[#f1fbff] rounded-2xl border border-[#cfe7e6] text-xs text-[#3c4948] leading-relaxed flex flex-col gap-3">
          {selectedGuidance === 'exhaustion' && (
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[#001f26] text-sm">💡 ประโยคที่ควรพูดเมื่อลูกบอกว่า "เหนื่อยมาก":</span>
              <p className="bg-white p-3.5 rounded-xl border border-[#cfe7e6] text-[#004340] font-medium leading-relaxed">
                "พ่อ/แม่เห็นว่าลูกพยายามอย่างหนักมากเลยนะ วันนี้เหนื่อยใช่ไหม มานั่งพักก่อน ดื่มน้ำเย็นๆ หรืออยากเล่าอะไรให้ฟัง พ่อ/แม่พร้อมรับฟังเสมอนะ เดี๋ยวเราค่อยๆ วางแผนมองอนาคตไปด้วยกัน"
              </p>
              <span className="font-bold text-[#ba1a1a] text-xs mt-1">⚠️ สิ่งที่ควรหลีกเลี่ยง:</span>
              <p className="text-[#6c7a78]">
                หลีกเลี่ยงการพูดว่า "เหนื่อยแค่นี้ยังไม่ได้ครึ่งของพ่อแม่" หรือ "เด็กแค่นี้จะเหนื่อยอะไร" เพราะจะทำให้เด็กรู้สึกว่าความเหนื่อยของตนไม่มีค่าและปิดกั้นการคุย
              </p>
              <div className="pt-2 border-t border-[#cfe7e6] text-[11px] text-[#006a65] flex items-center gap-1 font-semibold">
                <span>☪️ ดุอาอ์และข้อคิด:</span>
                <span>ขอความช่วยเหลือจากอัลลอฮ์ให้ทรงแบ่งเบาภาระจิตใจ (Surah Ash-Sharh: อัลลอฮ์ทรงสัญญาว่าหลังความยากลำบากย่อมมีความง่ายดาย)</span>
              </div>
            </div>
          )}

          {selectedGuidance === 'exam' && (
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[#001f26] text-sm">💡 ประโยคที่ควรพูดเมื่อลูกเครียดเรื่องผลสอบ:</span>
              <p className="bg-white p-3.5 rounded-xl border border-[#cfe7e6] text-[#004340] font-medium leading-relaxed">
                "คะแนนสอบเป็นเพียงตัววัดหนึ่งจังหวะ ไม่ใช่ตัวกำหนดคุณค่าหรืออนาคตทั้งหมดของลูก ขอแค่ลูกพยายามเต็มกำลัง ไม่ว่าจะออกมาอย่างไร พ่อแม่ก็ภูมิใจและพร้อมสนับสนุนลูกเสมอ"
              </p>
              <span className="font-bold text-[#ba1a1a] text-xs mt-1">⚠️ สิ่งที่ควรหลีกเลี่ยง:</span>
              <p className="text-[#6c7a78]">
                ห้ามนำลูกไปเปรียบเทียบกับลูกของคนอื่น หรือขู่ว่าถ้าสอบไม่ติดจะไม่ส่งเรียน เพราะจะกระตุ้นภาวะแพนิกเฉียบพลัน
              </p>
            </div>
          )}

          {selectedGuidance === 'bullying' && (
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[#001f26] text-sm">💡 แนวทางสังเกตและช่วยเหลือเมื่อสงสัยว่าลูกถูกบูลลี่:</span>
              <p className="bg-white p-3.5 rounded-xl border border-[#cfe7e6] text-[#004340] font-medium leading-relaxed">
                สังเกตอาการไม่อยากไปโรงเรียน ข้าวของเสียหาย หรือมีอาการเงียบผิดปกติ พูดกับลูกว่า: "ลูกไม่ได้ทำอะไรผิดเลยนะ และพ่อแม่กับคุณครูจะปกป้องลูกอย่างถึงที่สุด เราจะไม่ยอมให้ใครมารังแกหรือทำให้ลูกไม่ปลอดภัย"
              </p>
              <span className="font-bold text-[#ba1a1a] text-xs mt-1">🚨 การดำเนินการ:</span>
              <p className="text-[#6c7a78]">
                ประสานครูประจำชั้นทันทีเพื่อตรวจสอบจุดเสี่ยงในโรงเรียน และประสานงานจุด Safe Point เพื่อเป็นพื้นที่พักฟื้น
              </p>
            </div>
          )}

          {selectedGuidance === 'depression' && (
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[#001f26] text-sm">💡 เมื่อสังเกตเห็นลูกเงียบผิดปกติ ไม่เพลิดเพลินกับสิ่งที่ชอบ:</span>
              <p className="bg-white p-3.5 rounded-xl border border-[#cfe7e6] text-[#004340] font-medium leading-relaxed">
                "พ่อแม่สังเกตว่าช่วงนี้ลูกดูเหนื่อยๆ และไม่ค่อยสดใส มีอะไรในใจที่แบกรับอยู่ไหมลูก ไม่ต้องรีบเล่าทั้งหมดก็ได้ แค่อยากให้รู้ว่าพ่อแม่รักและอยู่ตรงนี้ข้างๆ เสมอ"
              </p>
              <span className="font-bold text-[#ba1a1a] text-xs mt-1">⚠️ ข้อควรระวัง:</span>
              <p className="text-[#6c7a78]">
                อย่าบังคับให้ร่าเริงทันที และห้ามพูดว่า "คิดมากไปเอง" หากสังเกตพบว่าพูดถึงการไม่อยากอยู่ต่อ ให้ติดต่อครูแนะแนวหรือโทร 1323 ทันที
              </p>
            </div>
          )}

          {selectedGuidance === 'family' && (
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[#001f26] text-sm">💡 เมื่อมีความขัดแย้งหรือความกดดันเรื่องเศรษฐกิจในบ้าน:</span>
              <p className="bg-white p-3.5 rounded-xl border border-[#cfe7e6] text-[#004340] font-medium leading-relaxed">
                "ปัญหาของผู้ใหญ่ไม่ได้เป็นความผิดของลูกเลยนะ ลูกมีหน้าที่เรียนรู้และเติบโตอย่างมีความสุข เรื่องความกังวลในบ้านพ่อแม่จะพยายามจัดการเอง อย่าแบกไว้คนเดียวนะลูก"
              </p>
            </div>
          )}

          {selectedGuidance === 'sleep' && (
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[#001f26] text-sm">💡 เมื่อลูกนอนไม่หลับ หรือสะดุ้งตื่นกลางดึก:</span>
              <p className="bg-white p-3.5 rounded-xl border border-[#cfe7e6] text-[#004340] font-medium leading-relaxed">
                ชวนลูกปิดหน้าจอก่อนนอน 45 นาที เปิดเสียงอัลกุรอานซูเราะฮ์อัล-มุลก์ หรือเสียงคลื่นสงบจิตใจ ให้ดื่มนมอุ่นๆ และปรับอุณหภูมิห้องให้เย็นสบาย
              </p>
            </div>
          )}
        </div>
      </div>

      {/* APPOINTMENT BOOKING WITH HOMEROOM TEACHER */}
      <div className="bg-white rounded-3xl p-6 md:p-8 soft-shadow border border-[#cfe7e6] flex flex-col md:flex-row items-center justify-between gap-5">
        <div>
          <h3 className="text-lg font-bold text-[#001f26]">
            {isTh ? 'ต้องการปรึกษาครูประจำชั้นหรือครูแนะแนวเป็นการส่วนตัว?' : 'Need Personal Teacher Consultation?'}
          </h3>
          <p className="text-xs text-[#6c7a78] mt-1">
            {isTh
              ? 'ผู้ปกครองสามารถขอนัดพูดคุยแบบเป็นความลับผ่านห้องให้คำปรึกษา หรือโทรปรึกษาได้โดยตรง'
              : 'Confidential appointment booking with homeroom teachers and counselors.'}
          </p>
        </div>
        <button
          onClick={() => setShowAppointmentForm(!showAppointmentForm)}
          className="px-6 py-3 bg-[#006a65] hover:bg-[#004340] text-white rounded-full text-xs md:text-sm font-bold shadow-xs active:scale-95 transition-all shrink-0"
        >
          {showAppointmentForm
            ? isTh ? 'ปิดแบบฟอร์ม' : 'Close Form'
            : isTh ? 'นัดหมายพูดคุยกับครู' : 'Book Teacher Meeting'}
        </button>
      </div>

      {/* APPOINTMENT FORM MODAL / EXPAND */}
      {showAppointmentForm && (
        <form onSubmit={handleBook} className="bg-white rounded-3xl p-6 md:p-8 border border-[#2bb8b0] shadow-md flex flex-col gap-4 animate-fade-in">
          <h4 className="text-base font-bold text-[#001f26]">
            {isTh ? 'แบบฟอร์มนัดหมายปรึกษาครู' : 'Appointment Request Form'}
          </h4>

          {bookingSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
              {isTh ? '✓ ส่งคำขอนัดหมายเรียบร้อยแล้ว ครูจะติดต่อกลับภายใน 24 ชม.' : 'Appointment request dispatched!'}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#001f26] block mb-1">
                {isTh ? 'เลือกอาจารย์ที่ต้องการปรึกษา' : 'Select Teacher'}
              </label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full bg-[#f1fbff] border border-[#cfe7e6] rounded-xl p-2.5 text-xs text-[#001f26] outline-none"
              >
                {TEACHERS_LIST.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nameTh} ({t.roleTh})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#001f26] block mb-1">
                {isTh ? 'วันที่สะดวก' : 'Preferred Date'}
              </label>
              <input
                type="date"
                required
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full bg-[#f1fbff] border border-[#cfe7e6] rounded-xl p-2.5 text-xs text-[#001f26] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#001f26] block mb-1">
              {isTh ? 'ประเด็นที่ต้องการปรึกษา' : 'Topic of Discussion'}
            </label>
            <textarea
              required
              rows={3}
              value={appointmentTopic}
              onChange={(e) => setAppointmentTopic(e.target.value)}
              placeholder={isTh ? 'เช่น ต้องการปรึกษาเรื่องลูกเครียดกับการสอบเข้ามหาวิทยาลัยและนอนไม่หลับ...' : 'e.g. Discuss child insomnia and exam stress...'}
              className="w-full bg-[#f1fbff] border border-[#cfe7e6] rounded-xl p-3 text-xs text-[#001f26] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#006a65] text-white rounded-full text-xs font-bold shadow-xs hover:bg-[#004340] active:scale-95 transition-all"
          >
            {isTh ? 'ยืนยันการส่งคำขอนัดหมาย' : 'Submit Consultation Request'}
          </button>
        </form>
      )}
    </div>
  );
};
