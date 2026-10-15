import React, { useState } from 'react';
import { Language, Teacher, SafePoint } from '../types';
import { TEACHERS_LIST, SAFE_POINTS, COUNCIL_CASES } from '../data/mockData';
import { soothingAudio } from '../utils/audio';

interface SchoolTabProps {
  language: Language;
  onOpenEmergency: () => void;
  onOpenSafePoints: () => void;
}

export const SchoolTab: React.FC<SchoolTabProps> = ({
  language,
  onOpenEmergency,
  onOpenSafePoints,
}) => {
  const isTh = language === 'th';
  const [schoolSubTab, setSchoolSubTab] = useState<'teachers' | 'safepoints' | 'council'>('teachers');
  const [filterRole, setFilterRole] = useState<'all' | 'online' | 'guidance' | 'advisor'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacherForContact, setSelectedTeacherForContact] = useState<Teacher | null>(null);
  const [contactMode, setContactMode] = useState<'chat' | 'appointment' | 'safepoint'>('chat');
  const [showAiMatchModal, setShowAiMatchModal] = useState(false);
  const [matchConcern, setMatchConcern] = useState<string>('study');
  const [matchedTeacher, setMatchedTeacher] = useState<Teacher | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [showPeerReportModal, setShowPeerReportModal] = useState(false);
  const [peerConditionType, setPeerConditionType] = useState('bullying');
  const [peerReportGrade, setPeerReportGrade] = useState('ม.4');
  const [peerReportDetail, setPeerReportDetail] = useState('');

  // Form states
  const [chatNote, setChatNote] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('2026-10-02');
  const [appointmentTime, setAppointmentTime] = useState('13:30');

  const filteredTeachers = TEACHERS_LIST.filter((t) => {
    const matchesSearch =
      t.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.specialtyTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.specialtyEn.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterRole === 'online') return t.status === 'online';
    if (filterRole === 'guidance') return t.roleTh.includes('แนะแนว');
    if (filterRole === 'advisor') return t.roleTh.includes('ประจำชั้น');
    return true;
  });

  const handleContactAction = (teacher: Teacher, mode: 'chat' | 'appointment' | 'safepoint') => {
    soothingAudio.playGentleChime();
    setSelectedTeacherForContact(teacher);
    setContactMode(mode);
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    soothingAudio.playGentleChime();
    const name = isTh ? selectedTeacherForContact?.nameTh : selectedTeacherForContact?.nameEn;

    if (contactMode === 'chat') {
      setActionSuccessMsg(
        isTh
          ? `ส่งข้อความถึง ${name} เรียบร้อยแล้ว อาจารย์จะตอบกลับผ่านระบบแจ้งเตือนส่วนตัว`
          : `Message sent to ${name}. They will reply through your private notification.`
      );
    } else if (contactMode === 'appointment') {
      setActionSuccessMsg(
        isTh
          ? `นัดหมายกับ ${name} ในวันที่ ${appointmentDate} เวลา ${appointmentTime} น. เรียบร้อยแล้ว`
          : `Appointment booked with ${name} on ${appointmentDate} at ${appointmentTime}.`
      );
    } else {
      setActionSuccessMsg(
        isTh
          ? `ส่งสัญญาณขอความช่วยเหลือที่ Safe Point ไปยัง ${name} แล้ว กรุณาไปยังจุดปลอดภัยใกล้ที่สุด`
          : `Safe Point alert dispatched to ${name}. Please proceed to the nearest quiet sanctuary.`
      );
    }

    setSelectedTeacherForContact(null);
    setChatNote('');
    setTimeout(() => setActionSuccessMsg(null), 6000);
  };

  const runAiMatching = () => {
    soothingAudio.playGentleChime();
    let best = TEACHERS_LIST[0];
    if (matchConcern === 'study') {
      best = TEACHERS_LIST.find((t) => t.id === 't-2') || TEACHERS_LIST[1];
    } else if (matchConcern === 'family') {
      best = TEACHERS_LIST.find((t) => t.id === 't-8') || TEACHERS_LIST[7];
    } else if (matchConcern === 'peer') {
      best = TEACHERS_LIST.find((t) => t.id === 't-3') || TEACHERS_LIST[0];
    } else {
      best = TEACHERS_LIST.find((t) => t.id === 't-1') || TEACHERS_LIST[0];
    }
    setMatchedTeacher(best);
  };

  return (
    <div className="w-full max-w-[1140px] mx-auto px-5 md:px-10 pt-6 pb-28 md:pb-16 flex flex-col gap-8 animate-fade-in">
      {/* Toast Alert */}
      {actionSuccessMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0b1e3b] text-white px-5 py-3 rounded-2xl shadow-xl border border-blue-400 text-sm max-w-lg w-[90%] text-center animate-bounce">
          {actionSuccessMsg}
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#091e42] tracking-tight">
          {isTh ? 'ปรึกษาอาจารย์และผู้เชี่ยวชาญ' : 'Teacher Counseling & Guidance'}
        </h1>
        <p className="text-sm md:text-base text-slate-600">
          {isTh
            ? 'เลือกอาจารย์ที่คุณรู้สึกสบายใจที่จะปรึกษา เราพร้อมรับฟังและช่วยเหลือคุณเสมอ'
            : 'Select a teacher you feel comfortable confiding in. We are always here to support you.'}
        </p>

        {/* Sub Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 border-b border-slate-200 pb-3">
          <button
            onClick={() => setSchoolSubTab('teachers')}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all cursor-pointer ${
              schoolSubTab === 'teachers'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50'
            }`}
          >
            👩‍🏫 {isTh ? 'รายชื่ออาจารย์ (16 ท่าน)' : 'Teachers Directory (16)'}
          </button>
          <button
            onClick={() => setSchoolSubTab('safepoints')}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all cursor-pointer ${
              schoolSubTab === 'safepoints'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50'
            }`}
          >
            🗺️ {isTh ? 'จุดปลอดภัยในโรงเรียน (Safe Points)' : 'Campus Safe Points'}
          </button>
          <button
            onClick={() => setSchoolSubTab('council')}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all cursor-pointer ${
              schoolSubTab === 'council'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50'
            }`}
          >
            📋 {isTh ? 'Dashboard สภานักเรียน' : 'Student Council Dashboard'}
          </button>
        </div>
      </div>

      {/* VIEW 1: TEACHERS DIRECTORY */}
      {schoolSubTab === 'teachers' && (
        <div className="flex flex-col gap-8">
          {/* AI Recommendation Banner */}
          <div className="bg-white rounded-3xl p-6 md:p-8 soft-shadow border border-slate-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-[#091e42] mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-2xl text-blue-800">psychology</span>
                  <span>{isTh ? 'ระบบแนะนำอาจารย์ที่เหมาะสม' : 'AI Counselor Matching'}</span>
                </h2>
                <p className="text-xs md:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {isTh
                    ? 'หากคุณต้องการ เราสามารถช่วยเชื่อมต่อคุณกับอาจารย์ที่คุณเลือกได้ หรือให้ระบบช่วยแนะนำผู้ที่เชี่ยวชาญตรงกับความกังวลของคุณ'
                    : 'We can match you with an experienced teacher specializing in your exact concerns.'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                <button
                  onClick={() => {
                    setShowAiMatchModal(true);
                    setMatchedTeacher(null);
                  }}
                  className="bg-blue-800 text-white font-semibold text-xs md:text-sm px-6 py-3 rounded-full hover:bg-blue-900 transition-colors shadow-sm active:scale-95 text-center cursor-pointer"
                >
                  {isTh ? 'ให้ระบบช่วยแนะนำ' : 'Get AI Recommendation'}
                </button>
                <button
                  onClick={() => {
                    setFilterRole('all');
                    document.getElementById('teacher-grid')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="border-2 border-blue-800 text-blue-800 font-semibold text-xs md:text-sm px-6 py-3 rounded-full hover:bg-blue-50 transition-colors active:scale-95 text-center cursor-pointer"
                >
                  {isTh ? 'เลือกอาจารย์เอง' : 'Browse All Teachers'}
                </button>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isTh ? 'ค้นหาชื่อ หรือปัญหาที่กังวล...' : 'Search teacher or specialty...'}
                className="w-full bg-white rounded-full py-2.5 pl-10 pr-4 text-xs md:text-sm border border-slate-200 outline-none focus:border-blue-600 shadow-xs"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto pb-1">
              <button
                onClick={() => setFilterRole('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filterRole === 'all'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'bg-white text-[#3c4948] border border-[#cfe7e6] hover:bg-[#e1f7ff]'
                }`}
              >
                {isTh ? 'ทั้งหมด' : 'All'}
              </button>
              <button
                onClick={() => setFilterRole('online')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  filterRole === 'online'
                    ? 'bg-[#006a65] text-white shadow-xs'
                    : 'bg-white text-[#3c4948] border border-[#cfe7e6] hover:bg-[#e1f7ff]'
                }`}
              >
                🟢 {isTh ? 'ออนไลน์ตอนนี้' : 'Online Now'}
              </button>
              <button
                onClick={() => setFilterRole('guidance')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  filterRole === 'guidance'
                    ? 'bg-[#006a65] text-white shadow-xs'
                    : 'bg-white text-[#3c4948] border border-[#cfe7e6] hover:bg-[#e1f7ff]'
                }`}
              >
                🎓 {isTh ? 'ครูแนะแนว' : 'Guidance'}
              </button>
              <button
                onClick={() => setFilterRole('advisor')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  filterRole === 'advisor'
                    ? 'bg-[#006a65] text-white shadow-xs'
                    : 'bg-white text-[#3c4948] border border-[#cfe7e6] hover:bg-[#e1f7ff]'
                }`}
              >
                🏫 {isTh ? 'ครูประจำชั้น' : 'Class Advisor'}
              </button>
            </div>
          </div>

          {/* Teacher Cards Grid */}
          <div id="teacher-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTeachers.map((teacher) => {
              const isOnline = teacher.status === 'online';
              return (
                <div
                  key={teacher.id}
                  className="bg-white rounded-3xl p-6 soft-shadow border border-[#cfe7e6] hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  {/* Top info */}
                  <div className="flex items-start gap-4 mb-5">
                    {/* Avatar with indicator */}
                    <div className="w-16 h-16 rounded-full bg-[#c4e9f4] flex items-center justify-center text-[#006a65] shrink-0 relative shadow-inner">
                      <span className="material-symbols-outlined text-3xl">person</span>
                      <div
                        className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                          isOnline ? 'bg-[#10b981]' : 'bg-[#f59e0b]'
                        }`}
                      ></div>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base md:text-lg font-bold text-[#001f26]">
                          {isTh ? teacher.nameTh : teacher.nameEn}
                        </h3>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isOnline
                              ? 'bg-[#10b981]/10 text-[#10b981]'
                              : 'bg-[#f59e0b]/10 text-[#f59e0b]'
                          }`}
                        >
                          {isOnline
                            ? isTh ? 'ออนไลน์' : 'Online'
                            : isTh ? 'ไม่ว่างชั่วคราว' : 'Temporarily Away'}
                        </span>
                      </div>

                      <p className="text-xs md:text-sm text-[#4d6262] font-medium mt-0.5">
                        {isTh ? teacher.roleTh : teacher.roleEn}
                      </p>

                      <div className="flex flex-col gap-1 mt-2.5 text-xs text-[#3c4948]">
                        <div className="flex items-center gap-1.5 text-[#6c7a78]">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          <span>{isTh ? teacher.locationTh : teacher.locationEn}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#6c7a78]">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          <span>{isTh ? teacher.availableHoursTh : teacher.availableHoursEn}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[#cfe7e6]/50">
                    <button
                      onClick={() => handleContactAction(teacher, 'chat')}
                      className="flex-1 bg-[#e1f7ff] text-[#006a65] hover:bg-[#d1f4ff] font-semibold text-xs px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors active:scale-95 shadow-2xs"
                    >
                      <span>💬</span> {isTh ? 'ขอคำปรึกษา' : 'Message'}
                    </button>
                    <button
                      onClick={() => handleContactAction(teacher, 'appointment')}
                      className="flex-1 bg-[#e1f7ff] text-[#006a65] hover:bg-[#d1f4ff] font-semibold text-xs px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors active:scale-95 shadow-2xs"
                    >
                      <span>📍</span> {isTh ? 'นัดพบ' : 'Book'}
                    </button>
                    <button
                      disabled={!teacher.safePointReady}
                      onClick={() => handleContactAction(teacher, 'safepoint')}
                      className={`w-full font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs ${
                        teacher.safePointReady
                          ? 'bg-[#ffdad6] text-[#93000a] hover:bg-[#ffb4ab] active:scale-95'
                          : 'bg-[#ffdad6]/40 text-[#93000a]/50 cursor-not-allowed'
                      }`}
                    >
                      <span>🛡️</span>
                      <span>
                        {teacher.safePointReady
                          ? isTh
                            ? 'ขอให้ช่วยที่ Safe Point'
                            : 'Request Help at Safe Point'
                          : isTh
                          ? 'ขอให้ช่วยที่ Safe Point (ไม่พร้อมให้บริการ)'
                          : 'Safe Point Unavailable'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: CAMPUS SAFE POINTS */}
      {schoolSubTab === 'safepoints' && (
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 soft-shadow border border-[#cfe7e6]">
            <h2 className="text-xl font-bold text-[#006a65] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl">location_on</span>
              <span>{isTh ? 'จุดปลอดภัยในโรงเรียน (Safe Points)' : 'Campus Safe Sanctuaries'}</span>
            </h2>
            <p className="text-xs md:text-sm text-[#3c4948] mb-6">
              {isTh
                ? 'พื้นที่สงบเงียบ ปลอดภัย ได้รับการออกแบบให้คุณสามารถเข้าไปนั่งพัก ปรับอารมณ์ หรือขอความช่วยเหลือจากอาจารย์และเพื่อนสภาได้ตลอดเวลา'
                : 'Quiet, peaceful sanctuaries designed for emotional reset, safety, and supportive counseling.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAFE_POINTS.map((sp) => (
                <div
                  key={sp.id}
                  className="bg-[#f1fbff] rounded-2xl p-5 border border-[#cfe7e6] flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#2bb8b0] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-2xl">{sp.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm md:text-base text-[#001f26]">
                        {isTh ? sp.nameTh : sp.nameEn}
                      </h4>
                      <p className="text-xs text-[#006a65] font-medium">
                        {isTh ? sp.locationTh : sp.locationEn}
                      </p>
                      <p className="text-xs text-[#4d6262] mt-2 leading-relaxed">
                        {isTh ? sp.descriptionTh : sp.descriptionEn}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#cfe7e6] flex justify-between items-center text-xs">
                    <span className="text-[#6c7a78]">
                      {isTh ? `ผู้ดูแล: ${sp.staffTh}` : `Staff: ${sp.staffEn}`}
                    </span>
                    <span className="bg-[#10b981]/15 text-[#10b981] px-2.5 py-0.5 rounded-full font-semibold">
                      {isTh ? sp.status : 'Open'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: STUDENT COUNCIL DASHBOARD */}
      {schoolSubTab === 'council' && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#001f26] mb-1">
                {isTh ? 'Dashboard สภานักเรียน' : 'Student Council Dashboard'}
              </h2>
              <p className="text-xs md:text-sm text-[#4d6262] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span>
                  {isTh
                    ? 'ข้อมูลถูกจำกัดการเข้าถึงตามนโยบายความเป็นส่วนตัว'
                    : 'Restricted access under school safety and privacy regulations'}
                </span>
              </p>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-orange-500 mt-0.5 material-symbols-filled">
              info
            </span>
            <div className="text-xs md:text-sm">
              <p className="font-bold text-orange-800">
                {isTh ? 'คำเตือนสำหรับสมาชิกสภา:' : 'Guideline for Student Council Members:'}
              </p>
              <p className="text-orange-700 mt-0.5">
                {isTh
                  ? 'คุณกำลังรับฟังเพื่อน ไม่ใช่นักบำบัด หากพบเหตุรุนแรงหรืออันตรายให้ส่งต่อครูทันที'
                  : 'You are listening as a peer mentor, not a therapist. Escalate serious crises to teachers immediately.'}
              </p>
            </div>
          </div>

          {/* Stats Bento Grid matching mockup */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-[#cfe7e6] soft-shadow flex flex-col justify-between h-24">
              <span className="material-symbols-outlined text-[#006a65] text-lg">inbox</span>
              <div>
                <p className="text-[11px] text-[#6c7a78] font-medium">
                  {isTh ? 'เรื่องที่ได้รับแจ้ง' : 'Cases Received'}
                </p>
                <p className="text-xl font-bold text-[#001f26]">124</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#cfe7e6] soft-shadow flex flex-col justify-between h-24">
              <span className="material-symbols-outlined text-[#f59e0b] text-lg material-symbols-filled">
                pending
              </span>
              <div>
                <p className="text-[11px] text-[#6c7a78] font-medium">
                  {isTh ? 'รอตรวจสอบ' : 'Pending'}
                </p>
                <p className="text-xl font-bold text-[#001f26]">12</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#cfe7e6] soft-shadow flex flex-col justify-between h-24">
              <span className="material-symbols-outlined text-[#2563eb] text-lg material-symbols-filled">
                sync
              </span>
              <div>
                <p className="text-[11px] text-[#6c7a78] font-medium">
                  {isTh ? 'กำลังประสานงาน' : 'Coordinating'}
                </p>
                <p className="text-xl font-bold text-[#001f26]">8</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#cfe7e6] soft-shadow flex flex-col justify-between h-24">
              <span className="material-symbols-outlined text-[#10b981] text-lg material-symbols-filled">
                forward
              </span>
              <div>
                <p className="text-[11px] text-[#6c7a78] font-medium">
                  {isTh ? 'ส่งต่อแล้ว' : 'Escalated'}
                </p>
                <p className="text-xl font-bold text-[#001f26]">34</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#cfe7e6] soft-shadow flex flex-col justify-between h-24 col-span-2 md:col-span-1">
              <span className="material-symbols-outlined text-[#4d6262] text-lg material-symbols-filled">
                task_alt
              </span>
              <div>
                <p className="text-[11px] text-[#6c7a78] font-medium">
                  {isTh ? 'ปิดเคส' : 'Resolved'}
                </p>
                <p className="text-xl font-bold text-[#001f26]">70</p>
              </div>
            </div>
          </div>

          {/* Cases Table matching mockup */}
          <div className="bg-white rounded-3xl border border-[#cfe7e6] soft-shadow overflow-hidden">
            <div className="p-5 border-b border-[#cfe7e6] flex justify-between items-center bg-[#f1fbff]">
              <h3 className="font-bold text-sm md:text-base text-[#001f26]">
                {isTh ? 'รายการแจ้งเหตุล่าสุด' : 'Recent Cases'}
              </h3>
              <span className="text-xs text-[#006a65] font-semibold">
                {isTh ? 'อัปเดตแบบเรียลไทม์' : 'Live updates'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-[#cfe7e6] text-[#6c7a78] uppercase tracking-wider bg-white">
                    <th className="p-4 pl-6 font-semibold">Case ID</th>
                    <th className="p-4 font-semibold">
                      {isTh ? 'หมวดหมู่ (Category)' : 'Category'}
                    </th>
                    <th className="p-4 font-semibold">
                      {isTh ? 'ระดับ (Priority)' : 'Priority'}
                    </th>
                    <th className="p-4 font-semibold">{isTh ? 'สถานะ (Status)' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#cfe7e6]/50">
                  {COUNCIL_CASES.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f1fbff]/60 transition-colors">
                      <td className="p-4 pl-6 font-mono font-medium text-[#006a65]">
                        {item.caseCode}
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-[#001f26]">{item.category}</span>
                        <p className="text-[11px] text-[#6c7a78] line-clamp-1">{item.summary}</p>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            item.priority === 'Critical'
                              ? 'bg-red-100 text-red-700'
                              : item.priority === 'High'
                              ? 'bg-orange-100 text-orange-700'
                              : item.priority === 'Medium'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          ● {item.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            item.status === 'รอตรวจสอบ'
                              ? 'bg-yellow-100 text-yellow-800'
                              : item.status === 'กำลังประสานงาน'
                              ? 'bg-blue-100 text-blue-800'
                              : item.status === 'ส่งต่อแล้ว'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CAMPUS STUDENT CONDITIONS BREAKDOWN & PEER SUPPORT DISPATCH */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
            {/* Student Condition Prevalence by Category */}
            <div className="bg-white p-6 rounded-3xl border border-[#cfe7e6] soft-shadow flex flex-col gap-3">
              <span className="text-xs font-bold text-[#006a65] uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">pie_chart</span>
                <span>{isTh ? 'สถิติภาวะทางอารมณ์ของเพื่อนนักเรียนในโรงเรียน' : 'Student Conditions Intelligence'}</span>
              </span>
              <p className="text-xs text-[#6c7a78]">
                {isTh ? 'รวบรวมจากแบบคัดกรองนิรนาม เพื่อวางแผนจัดกิจกรรมเยียวยาใจ' : 'Anonymized student wellbeing prevalence data'}
              </p>
              
              <div className="space-y-3 mt-1 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-[#001f26] mb-1">
                    <span>📚 ภาวะเครียดจากการสอบและการเรียน (ม.6 & ม.3)</span>
                    <span className="text-[#006a65]">42%</span>
                  </div>
                  <div className="w-full bg-[#f1fbff] h-2 rounded-full overflow-hidden border border-[#cfe7e6]">
                    <div className="bg-[#006a65] h-full rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-[#001f26] mb-1">
                    <span>🔋 ภาวะหมดไฟในการเรียนและล้าสะสม (ม.4 & ม.5)</span>
                    <span className="text-amber-700">28%</span>
                  </div>
                  <div className="w-full bg-[#f1fbff] h-2 rounded-full overflow-hidden border border-[#cfe7e6]">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-[#001f26] mb-1">
                    <span>🚨 ปัญหาการปรับตัว / ถูกบูลลี่ในกลุ่มเพื่อน (ม.1 & ม.2)</span>
                    <span className="text-rose-700">18%</span>
                  </div>
                  <div className="w-full bg-[#f1fbff] h-2 rounded-full overflow-hidden border border-[#cfe7e6]">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-[#001f26] mb-1">
                    <span>🏡 ปัญหาความตึงเครียดในครอบครัวและค่าใช้จ่าย</span>
                    <span className="text-teal-700">12%</span>
                  </div>
                  <div className="w-full bg-[#f1fbff] h-2 rounded-full overflow-hidden border border-[#cfe7e6]">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Peer Support Buddy Dispatch to Safe Points */}
            <div className="bg-white p-6 rounded-3xl border border-[#cfe7e6] soft-shadow flex flex-col justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#006a65] uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">diversity_1</span>
                  <span>{isTh ? 'หน่วยเพื่อนช่วยเพื่อนสภานักเรียน (Peer Support)' : 'Peer Support Unit'}</span>
                </span>
                <h4 className="text-base font-bold text-[#001f26] mt-2 mb-1">
                  {isTh ? 'ตารางเวรเพื่อนรับฟังประจำจุด Safe Point 4 อาคาร' : 'Safe Points Duty Schedule'}
                </h4>
                <p className="text-xs text-[#3c4948] leading-relaxed">
                  {isTh
                    ? 'สภานักเรียนจัดทีมรุ่นพี่และเพื่อนแกนนำที่ผ่านการอบรมการปฐมพยาบาลใจเบื้องต้น ประจำที่ห้อง Safe Point ในช่วงพักกลางวันและหลังเลิกเรียน เพื่อคอยรับฟังเพื่อนๆ อย่างเป็นกันเอง'
                    : 'Trained student council peer listeners stationed at campus safe spots to offer confidential comfort.'}
                </p>
              </div>

              <div className="p-3 bg-[#e1f7ff] rounded-2xl border border-[#cfe7e6] flex items-center justify-between text-xs font-semibold text-[#004340]">
                <span>{isTh ? '● เวรวันนี้: อาคาร 1 (ห้องพยาบาล) & อาคาร 3' : 'Active Today: Building 1 & 3'}</span>
                <span className="text-[#006a65] font-bold">12:00 - 16:30 น.</span>
              </div>

              <button
                onClick={() => setShowPeerReportModal(true)}
                className="w-full py-2.5 px-4 bg-[#006a65] hover:bg-[#004340] text-white rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">record_voice_over</span>
                <span>{isTh ? 'ส่งเรื่องแจ้งเตือนช่วยเหลือเพื่อน (นิรนาม)' : 'Submit Anonymous Peer Distress Alert'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANONYMOUS PEER DISTRESS ALERT MODAL */}
      {showPeerReportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-[#cfe7e6] relative text-left animate-fade-in">
            <button
              onClick={() => setShowPeerReportModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f1fbff] flex items-center justify-center text-[#6c7a78] hover:text-[#001f26]"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[#006a65] text-2xl material-symbols-filled">
                volunteer_activism
              </span>
              <h3 className="text-lg md:text-xl font-bold text-[#001f26]">
                {isTh ? 'กล่องรับแจ้งช่วยเหลือเพื่อน (นิรนาม)' : 'Anonymous Peer Distress Alert'}
              </h3>
            </div>
            <p className="text-xs text-[#4d6262] mb-4">
              {isTh
                ? 'หากคุณสังเกตเห็นเพื่อนมีอาการซึมเศร้า ถูกกลั่นแกล้ง หรือเครียดจัด สามารถส่งเรื่องถึงสภานักเรียนและครูแนะแนวได้โดยไม่ต้องระบุชื่อผู้ส่ง'
                : 'Alert counselors and peer council if a classmate is showing severe distress.'}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                soothingAudio.playGentleChime();
                setActionSuccessMsg(
                  isTh
                    ? 'สภานักเรียนและครูแนะแนวได้รับเรื่องแล้ว และจะเข้าประสานงานดูแลเพื่อนอย่างปลอดภัย'
                    : 'Peer report submitted securely.'
                );
                setShowPeerReportModal(false);
                setPeerReportDetail('');
                setTimeout(() => setActionSuccessMsg(null), 6000);
              }}
              className="flex flex-col gap-3.5 text-xs"
            >
              <div>
                <label className="font-bold text-[#001f26] block mb-1">
                  {isTh ? 'ภาวะที่สังเกตพบในตัวเพื่อน:' : 'Observed Student Condition:'}
                </label>
                <select
                  value={peerConditionType}
                  onChange={(e) => setPeerConditionType(e.target.value)}
                  className="w-full bg-[#f1fbff] border border-[#cfe7e6] rounded-xl p-2.5 font-medium outline-none focus:border-[#006a65]"
                >
                  <option value="bullying">ถูกกลั่นแกล้ง / ถูกบูลลี่ / กีดกันจากกลุ่ม</option>
                  <option value="depression">ซึมเศร้า / เงียบเก็บตัว / ไม่ทานข้าว</option>
                  <option value="exam">เครียดจัดเรื่องผลสอบ / ร้องไห้ในห้อง</option>
                  <option value="burnout">หมดไฟ / เหนื่อยล้าสะสม / หลับตลอดวัน</option>
                  <option value="crisis">พูดคำว่าไม่อยากมีชีวิตอยู่ / ส่งสัญญาณอันตราย</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#001f26] block mb-1">
                  {isTh ? 'ระดับชั้นของเพื่อน (โดยประมาณ):' : 'Class Grade Level:'}
                </label>
                <input
                  type="text"
                  value={peerReportGrade}
                  onChange={(e) => setPeerReportGrade(e.target.value)}
                  placeholder="เช่น ม.4/2 หรือ ม.5"
                  className="w-full bg-[#f1fbff] border border-[#cfe7e6] rounded-xl p-2.5 font-medium outline-none focus:border-[#006a65]"
                />
              </div>

              <div>
                <label className="font-bold text-[#001f26] block mb-1">
                  {isTh ? 'รายละเอียดหรือพฤติกรรมที่สังเกตได้ (ข้อมูลจะถูกปิดเป็นความลับ):' : 'Details:'}
                </label>
                <textarea
                  rows={3}
                  value={peerReportDetail}
                  onChange={(e) => setPeerReportDetail(e.target.value)}
                  placeholder="เช่น เพื่อนแยกตัวนั่งคนเดียวในโรงอาหาร ไม่ยอมส่งงานกลุ่ม และดูมีสีหน้าเครียดมาก..."
                  className="w-full bg-[#f1fbff] border border-[#cfe7e6] rounded-xl p-2.5 font-medium outline-none focus:border-[#006a65]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#006a65] hover:bg-[#004340] text-white rounded-full font-bold shadow-md transition-all active:scale-95"
                >
                  {isTh ? 'ส่งเรื่องเพื่อช่วยเหลือเพื่อน' : 'Submit Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Recommendation Matching Modal */}
      {showAiMatchModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#cfe7e6] relative">
            <button
              onClick={() => setShowAiMatchModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f1fbff] flex items-center justify-center text-[#6c7a78] hover:text-[#001f26]"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <h3 className="text-xl font-bold text-[#006a65] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl">psychology</span>
              <span>{isTh ? 'ค้นหาอาจารย์ที่เหมาะกับคุณ' : 'Find Your Matching Counselor'}</span>
            </h3>
            <p className="text-xs text-[#4d6262] mb-5">
              {isTh
                ? 'เลือกเรื่องที่ทำให้คุณรู้สึกไม่สบายใจมากที่สุด ระบบจะคัดสรรอาจารย์ที่เชี่ยวชาญให้'
                : 'Select the primary concern on your mind right now'}
            </p>

            <div className="flex flex-col gap-2.5 mb-6">
              {[
                { id: 'study', labelTh: 'ความเครียดการเรียน / ผลสอบ / กดดัน', labelEn: 'Study Stress & Exam Pressure' },
                { id: 'family', labelTh: 'ปัญหาครอบครัว / เรื่องที่บ้าน', labelEn: 'Family & Home Concerns' },
                { id: 'peer', labelTh: 'ปัญหาเพื่อน / การถูกบูลลี่ / ความสัมพันธ์', labelEn: 'Friendships & Bullying' },
                { id: 'general', labelTh: 'รู้สึกเหนื่อยล้า ไม่รู้จะเริ่มคุยเรื่องไหน', labelEn: 'General Exhaustion / Need Listening' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMatchConcern(opt.id)}
                  className={`text-left p-3.5 rounded-2xl text-xs md:text-sm transition-all border ${
                    matchConcern === opt.id
                      ? 'bg-[#e1f7ff] border-[#006a65] text-[#006a65] font-semibold'
                      : 'bg-[#f1fbff] border-[#cfe7e6] text-[#3c4948] hover:bg-white'
                  }`}
                >
                  {isTh ? opt.labelTh : opt.labelEn}
                </button>
              ))}
            </div>

            {matchedTeacher ? (
              <div className="p-4 bg-[#e1f7ff] rounded-2xl border border-[#2bb8b0] mb-5 animate-fade-in">
                <span className="text-[10px] font-bold text-[#006a65] uppercase tracking-wider block mb-1">
                  {isTh ? 'อาจารย์ที่แนะนำมากที่สุด' : 'Top Recommendation'}
                </span>
                <p className="font-bold text-sm text-[#001f26]">
                  {isTh ? matchedTeacher.nameTh : matchedTeacher.nameEn}
                </p>
                <p className="text-xs text-[#006a65] font-medium mt-0.5">
                  {isTh ? matchedTeacher.roleTh : matchedTeacher.roleEn}
                </p>
                <p className="text-xs text-[#3c4948] mt-1">
                  {isTh ? matchedTeacher.specialtyTh : matchedTeacher.specialtyEn}
                </p>
                <button
                  onClick={() => {
                    setShowAiMatchModal(false);
                    handleContactAction(matchedTeacher, 'chat');
                  }}
                  className="mt-3 w-full bg-[#006a65] text-white py-2 rounded-xl text-xs font-semibold hover:bg-[#004340]"
                >
                  {isTh ? 'เริ่มพูดคุยกับท่านนี้' : 'Connect with Teacher'}
                </button>
              </div>
            ) : (
              <button
                onClick={runAiMatching}
                className="w-full bg-[#006a65] text-white py-3 rounded-full text-xs md:text-sm font-semibold hover:bg-[#004340] active:scale-95 transition-all shadow-sm"
              >
                {isTh ? 'ประมวลผลคำแนะนำ' : 'Calculate Best Match'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Contact / Appointment / SafePoint Modal */}
      {selectedTeacherForContact && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#cfe7e6] relative">
            <button
              onClick={() => setSelectedTeacherForContact(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f1fbff] flex items-center justify-center text-[#6c7a78] hover:text-[#001f26]"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <span className="text-xs font-bold text-[#006a65] uppercase tracking-wider block mb-1">
              {contactMode === 'chat'
                ? isTh ? '💬 ขอคำปรึกษาส่วนตัว' : '💬 Private Message'
                : contactMode === 'appointment'
                ? isTh ? '📍 ขอนัดหมายพูดคุย' : '📍 Book Appointment'
                : isTh ? '🛡️ ขอให้ช่วยที่ Safe Point ทันที' : '🛡️ Request Help at Safe Point'}
            </span>

            <h3 className="text-lg font-bold text-[#001f26] mb-1">
              {isTh ? selectedTeacherForContact.nameTh : selectedTeacherForContact.nameEn}
            </h3>
            <p className="text-xs text-[#6c7a78] mb-4">
              {isTh ? selectedTeacherForContact.locationTh : selectedTeacherForContact.locationEn}
            </p>

            <form onSubmit={handleConfirmAction} className="flex flex-col gap-4">
              {contactMode === 'appointment' && (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-[#3c4948] block mb-1">
                      {isTh ? 'วันที่' : 'Date'}
                    </label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full bg-[#f1fbff] border border-[#cfe7e6] rounded-xl p-2.5 text-xs text-[#001f26]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-[#3c4948] block mb-1">
                      {isTh ? 'เวลา' : 'Time'}
                    </label>
                    <input
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full bg-[#f1fbff] border border-[#cfe7e6] rounded-xl p-2.5 text-xs text-[#001f26]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-[#3c4948] block mb-1">
                  {contactMode === 'safepoint'
                    ? isTh ? 'ระบุจุดปลอดภัยที่คุณอยู่ หรือห้องที่สะดวก' : 'Specify Safe Point location'
                    : isTh ? 'ข้อความเบื้องต้นที่อยากเล่า (ไม่บังคับ)' : 'Brief note for teacher'}
                </label>
                <textarea
                  rows={3}
                  value={chatNote}
                  onChange={(e) => setChatNote(e.target.value)}
                  placeholder={
                    contactMode === 'safepoint'
                      ? isTh ? 'เช่น อยู่ที่ห้องละหมาด อาคาร 2 หรือห้องพยาบาล...' : 'e.g. at Musalla Building 2...'
                      : isTh ? 'บอกความรู้สึกสั้นๆ เพื่อให้อาจารย์เตรียมพร้อมรับฟัง...' : 'Share what is on your mind...'
                  }
                  className="w-full bg-[#f1fbff] border border-[#cfe7e6] rounded-2xl p-3 text-xs md:text-sm text-[#001f26] outline-none focus:border-[#006a65]"
                ></textarea>
              </div>

              <div className="text-[11px] text-[#6c7a78] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#006a65]">lock</span>
                <span>{isTh ? 'ข้อความส่งตรงถึงอาจารย์อย่างเป็นความลับ 100%' : '100% confidential'}</span>
              </div>

              <button
                type="submit"
                className={`py-3 rounded-full text-xs md:text-sm font-semibold transition-all active:scale-95 shadow-sm text-white ${
                  contactMode === 'safepoint'
                    ? 'bg-[#ba1a1a] hover:bg-[#93000a]'
                    : 'bg-[#006a65] hover:bg-[#004340]'
                }`}
              >
                {contactMode === 'safepoint'
                  ? isTh ? 'ยืนยันแจ้งเหตุส่งสัญญาณ Safe Point' : 'Confirm Safe Point Alert'
                  : isTh ? 'ส่งข้อความยืนยัน' : 'Confirm & Send'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
