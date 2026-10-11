import React, { useState } from 'react';
import { Language, TeacherConsultRequest } from '../types';
import { TEACHER_REQUESTS_MOCK } from '../data/mockData';
import { soothingAudio } from '../utils/audio';

export interface StudentClinicalCase {
  id: string;
  studentCode: string;
  alias: string;
  grade: string;
  conditionType: 'depression' | 'exam_anxiety' | 'burnout' | 'bullying' | 'family_stress' | 'insomnia';
  conditionNameTh: string;
  conditionNameEn: string;
  riskTier: 'critical' | 'high' | 'moderate' | 'mild';
  symptomsTh: string[];
  phqScore: number; // 0-27
  stressScore: number; // %
  homeroomObservation: string;
  counselorActionPlan: string;
  latestAssessmentDate: string;
  lastContactDate: string;
  status: 'active_care' | 'monitoring' | 'referred' | 'resolved';
}

export const STUDENT_CLINICAL_CASES_MOCK: StudentClinicalCase[] = [
  {
    id: 'sc-1',
    studentCode: 'SP-6901',
    alias: 'นกนางนวลสีเทา (Student Seagull)',
    grade: 'ม.5/2',
    conditionType: 'bullying',
    conditionNameTh: 'ภาวะถูกกลั่นแกล้งและแยกตัวจากกลุ่มเพื่อน (Bullying & Social Alienation)',
    conditionNameEn: 'Bullying & Peer Alienation',
    riskTier: 'critical',
    symptomsTh: [
      'แยกตัวนั่งทานอาหารคนเดียวในโรงอาหาร',
      'ขอเข้าห้องพยาบาลบ่อยครั้งโดยไม่มีไข้',
      'มีร่องรอยความหวาดระแวงเมื่อต้องทำงานกลุ่ม',
      'ถูกกดดันในกลุ่มแชตห้องเรียน',
    ],
    phqScore: 21,
    stressScore: 92,
    homeroomObservation: 'สังเกตเห็นว่าไม่พูดคุยกับเพื่อนในห้อง มักก้มหน้าและรีบออกจากห้องเรียนทันทีหลังเลิกเรียน',
    counselorActionPlan: 'ประสานครูประจำชั้นแยกสังเกตการณ์ผู้เกี่ยวข้อง จัดพื้นที่คุ้มครองที่ Safe Point อาคาร 3 และนัดคุยเดี่ยวสัปดาห์ละ 2 ครั้ง',
    latestAssessmentDate: '10 ต.ค. 2026',
    lastContactDate: 'เมื่อวานนี้ 15:30 น.',
    status: 'active_care',
  },
  {
    id: 'sc-2',
    studentCode: 'SP-6902',
    alias: 'ดาวเหนือผู้เงียบสงบ (Polaris)',
    grade: 'ม.6/1',
    conditionType: 'exam_anxiety',
    conditionNameTh: 'ภาวะวิตกกังวลต่อการสอบและการเข้ามหาวิทยาลัย (Acute Exam & University Anxiety)',
    conditionNameEn: 'Exam & Future Admission Anxiety',
    riskTier: 'high',
    symptomsTh: [
      'หายใจเร็วและมือสั่นก่อนสอบวิชาการ',
      'กลัวทำให้ความคาดหวังของครอบครัวผิดหวัง',
      'นอนหลับเฉลี่ยเพียง 3 ชม./วัน',
      'รู้สึกว่าตนเองอ่านหนังสือไม่ทันและไร้ความสามารถ',
    ],
    phqScore: 17,
    stressScore: 84,
    homeroomObservation: 'มีความตั้งใจเรียนสูงมากแต่เริ่มมีอาการเหม่อลอยและร้องไห้ง่ายเมื่อคะแนนย่อยไม่ได้ตามเป้าหมาย',
    counselorActionPlan: 'ฝึกเทคนิคการหายใจ 4-4-6 (Box Breathing), ปรับ Mindset เรื่องคุณค่าในตัวเองที่ไม่ผูกกับคะแนน และนัดแนะแนวแผนสำรองการเข้ามหาวิทยาลัย',
    latestAssessmentDate: '09 ต.ค. 2026',
    lastContactDate: '08 ต.ค. 2026',
    status: 'active_care',
  },
  {
    id: 'sc-3',
    studentCode: 'SP-6903',
    alias: 'สายลมปลายฤดู (Autumn Breeze)',
    grade: 'ม.4/4',
    conditionType: 'depression',
    conditionNameTh: 'ภาวะซึมเศร้าและสูญเสียพลังใจ (Major Depressive Distress & Low Vitality)',
    conditionNameEn: 'Depressive State & Emotional Lethargy',
    riskTier: 'critical',
    symptomsTh: [
      'บอกกับ AI ว่า "เราเหนื่อยมาก หมดแรง ไม่อยากทำอะไรแล้ว"',
      'ไม่ส่งการบ้าน 4 รายวิชาติดต่อกัน',
      'เบื่ออาหาร น้ำหนักลดลงอย่างเห็นได้ชัด',
      'เก็บตัวในห้องนอน ไม่อยากพบใคร',
    ],
    phqScore: 23,
    stressScore: 88,
    homeroomObservation: 'ขาดเรียน 3 วันในรอบสองสัปดาห์ ไม่ตอบรับกิจกรรมในห้อง',
    counselorActionPlan: 'โทรศัพท์ประสานผู้ปกครองเพื่อวางแผนส่งต่อจิตแพทย์เด็ก รพ.ศูนย์ และเปิดช่องทางให้เด็กส่งข้อความหาครูได้ตลอด 24 ชม.',
    latestAssessmentDate: '11 ต.ค. 2026',
    lastContactDate: 'วันนี้ 09:15 น.',
    status: 'active_care',
  },
  {
    id: 'sc-4',
    studentCode: 'SP-6904',
    alias: 'ใบไม้สีเขียว (Green Leaf)',
    grade: 'ม.3/1',
    conditionType: 'family_stress',
    conditionNameTh: 'ภาวะตึงเครียดจากปัญหาครอบครัว (Domestic & Parental Stress)',
    conditionNameEn: 'Family Stress & Domestic Pressure',
    riskTier: 'moderate',
    symptomsTh: [
      'พ่อแม่มีความขัดแย้งรุนแรงในบ้าน',
      'ต้องแบกรับภาระดูแลน้องเล็กจนไม่มีเวลาทำการบ้าน',
      'มีภาวะวิตกกังวลเรื่องค่าใช้จ่ายการเรียน',
    ],
    phqScore: 14,
    stressScore: 68,
    homeroomObservation: 'มักขออยู่ทำการบ้านที่ห้องสมุดจนโรงเรียนปิด ไม่อยากกลับบ้านเร็ว',
    counselorActionPlan: 'ประสานงานฝ่ายทุนการศึกษาของโรงเรียน จัดพื้นที่ทำการบ้านและห้องพักใจ Safe Point ในช่วงเย็น',
    latestAssessmentDate: '07 ต.ค. 2026',
    lastContactDate: '06 ต.ค. 2026',
    status: 'monitoring',
  },
  {
    id: 'sc-5',
    studentCode: 'SP-6905',
    alias: 'แสงจันทร์สลัว (Dim Moonlight)',
    grade: 'ม.5/3',
    conditionType: 'burnout',
    conditionNameTh: 'ภาวะหมดไฟในการเรียนและล้าสะสม (Academic Burnout Syndrome)',
    conditionNameEn: 'Academic Burnout Syndrome',
    riskTier: 'moderate',
    symptomsTh: [
      'รู้สึกเหนื่อยล้าทางสมองตลอดเวลา',
      'หมดแรงจูงใจในการทำงานกลุ่ม',
      'ผลการเรียนตกลงอย่างกะทันหัน',
    ],
    phqScore: 11,
    stressScore: 62,
    homeroomObservation: 'หลับในคาบเรียนช่วงบ่ายบ่อยครั้ง แต่ไม่มีพฤติกรรมก้าวร้าว',
    counselorActionPlan: 'แนะนำการจัดตารางเวลาแบบ Pomodoro และส่งเสริมการฟังเสียงอัลกุรอานและการพักผ่อนที่ถูกสุขลักษณะ',
    latestAssessmentDate: '05 ต.ค. 2026',
    lastContactDate: '04 ต.ค. 2026',
    status: 'monitoring',
  },
  {
    id: 'sc-6',
    studentCode: 'SP-6906',
    alias: 'ต้นกล้าแห่งความหวัง (Sprout)',
    grade: 'ม.2/2',
    conditionType: 'insomnia',
    conditionNameTh: 'ภาวะนอนไม่หลับเรื้อรังและอาการทางกาย (Chronic Insomnia & Somatic Complaints)',
    conditionNameEn: 'Chronic Insomnia & Somatic Stress',
    riskTier: 'mild',
    symptomsTh: [
      'นอนไม่หลับ ใช้เวลากว่า 2 ชั่วโมงจึงจะหลับได้',
      'ตื่นกลางดึกบ่อยครั้งและไม่สดชื่น',
      'ปวดท้องและคลื่นไส้ในตอนเช้าก่อนมาโรงเรียน',
    ],
    phqScore: 8,
    stressScore: 50,
    homeroomObservation: 'ตื่นสายและมาโรงเรียนเฉียดเวลาเข้าแถว',
    counselorActionPlan: 'แนะนำสุขอนามัยการนอน (Sleep Hygiene) ลดการใช้หน้าจอก่อนนอน 1 ชม. และติดตามผลสัปดาห์หน้า',
    latestAssessmentDate: '04 ต.ค. 2026',
    lastContactDate: '02 ต.ค. 2026',
    status: 'monitoring',
  },
];

interface TeacherPortalViewProps {
  language: Language;
  onOpenSafePoints: () => void;
}

export const TeacherPortalView: React.FC<TeacherPortalViewProps> = ({
  language,
  onOpenSafePoints,
}) => {
  const isTh = language === 'th';
  const [requests, setRequests] = useState<TeacherConsultRequest[]>(TEACHER_REQUESTS_MOCK);
  const [clinicalCases, setClinicalCases] = useState<StudentClinicalCase[]>(STUDENT_CLINICAL_CASES_MOCK);
  const [isTeacherOnline, setIsTeacherOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'roster' | 'requests' | 'protocols'>('roster');
  const [selectedCase, setSelectedCase] = useState<StudentClinicalCase | null>(null);
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleUpdateRequestStatus = (id: string, newStatus: 'accepted' | 'completed') => {
    soothingAudio.playGentleChime();
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    setToastMsg(isTh ? 'อัปเดตสถานะคำขอเรียบร้อยแล้ว' : 'Request status updated');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredCases = clinicalCases.filter((c) => {
    if (filterCondition !== 'all' && c.conditionType !== filterCondition) return false;
    if (filterRisk !== 'all' && c.riskTier !== filterRisk) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.alias.toLowerCase().includes(q) ||
        c.studentCode.toLowerCase().includes(q) ||
        c.grade.toLowerCase().includes(q) ||
        c.conditionNameTh.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const criticalCount = clinicalCases.filter((c) => c.riskTier === 'critical').length;
  const highCount = clinicalCases.filter((c) => c.riskTier === 'high').length;
  const moderateCount = clinicalCases.filter((c) => c.riskTier === 'moderate').length;

  return (
    <div className="w-full max-w-[1140px] mx-auto px-4 md:px-8 pt-6 pb-28 md:pb-16 flex flex-col gap-6 animate-fade-in">
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#006a65] text-white px-5 py-3 rounded-2xl shadow-xl text-xs md:text-sm animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* Header Banner - Formal Medical/Educational Grade */}
      <div className="bg-white rounded-3xl p-6 md:p-8 soft-shadow border border-[#cfe7e6] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e1f7ff] rounded-full text-[#006a65] text-xs font-bold mb-3 border border-[#cfe7e6]">
            <span className="material-symbols-outlined text-sm material-symbols-filled">clinical_notes</span>
            <span>{isTh ? 'ศูนย์ให้คำปรึกษาและคัดกรองสุขภาวะจิตนักเรียน' : 'Student Psychological & Clinical Care'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#001f26]">
            {isTh ? 'ระบบเฝ้าระวังและวินิจฉัยภาวะเสี่ยงของนักเรียน' : 'Student Mental Health & Risk Management Console'}
          </h1>
          <p className="text-xs md:text-sm text-[#4d6262] mt-1">
            {isTh
              ? 'ระบบจำแนกและติดตามภาวะซึมเศร้า วิตกกังวล บูลลี่ หมดไฟ และปัญหาครอบครัวอย่างครอบคลุม'
              : 'Institutional diagnostic roster covering depression, exam anxiety, bullying, burnout, and domestic distress.'}
          </p>
        </div>

        {/* Teacher Status & Quick Safe Point trigger */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <div className="bg-[#f1fbff] p-3 rounded-2xl border border-[#cfe7e6] flex items-center gap-3">
            <div className="text-left">
              <span className="text-xs font-bold text-[#001f26] block">
                {isTh ? 'สถานะห้องแนะแนว' : 'Guidance Room'}
              </span>
              <span className={`text-[11px] font-semibold ${isTeacherOnline ? 'text-emerald-700' : 'text-amber-600'}`}>
                {isTeacherOnline ? (isTh ? '● พร้อมให้คำปรึกษา' : 'Online') : (isTh ? '● ติดภารกิจสอน' : 'Busy')}
              </span>
            </div>
            <button
              onClick={() => {
                setIsTeacherOnline(!isTeacherOnline);
                soothingAudio.playGentleChime();
              }}
              className="text-xs text-[#006a65] font-bold underline hover:opacity-80"
            >
              {isTh ? 'สลับสถานะ' : 'Toggle'}
            </button>
          </div>

          <button
            onClick={onOpenSafePoints}
            className="px-4 py-3 bg-[#006a65] hover:bg-[#004340] text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">shield</span>
            <span>{isTh ? 'ตรวจสอบจุด Safe Point' : 'Safe Points Map'}</span>
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-[#cfe7e6] flex flex-col justify-between shadow-2xs">
          <span className="text-[11px] font-bold text-[#6c7a78] uppercase">{isTh ? 'เคสทั้งหมดในความดูแล' : 'Total Active Cases'}</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl md:text-3xl font-extrabold text-[#001f26]">{clinicalCases.length}</span>
            <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-bold">100% ติดตามผล</span>
          </div>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-2xl border border-rose-200 flex flex-col justify-between shadow-2xs">
          <span className="text-[11px] font-bold text-rose-700 uppercase flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
            <span>{isTh ? 'ภาวะวิกฤต (Critical)' : 'Critical Risk'}</span>
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl md:text-3xl font-extrabold text-rose-700">{criticalCount}</span>
            <span className="text-[10px] text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full font-bold">เฝ้าระวัง 24 ชม.</span>
          </div>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-2xl border border-amber-200 flex flex-col justify-between shadow-2xs">
          <span className="text-[11px] font-bold text-amber-800 uppercase">{isTh ? 'ความเสี่ยงสูง (High Risk)' : 'High Risk'}</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl md:text-3xl font-extrabold text-amber-700">{highCount}</span>
            <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-bold">นัดสัปดาห์ละ 2 ครั้ง</span>
          </div>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-2xl border border-[#cfe7e6] flex flex-col justify-between shadow-2xs">
          <span className="text-[11px] font-bold text-[#006a65] uppercase">{isTh ? 'ความเสี่ยงปานกลาง/เฝ้าระวัง' : 'Moderate/Watchlist'}</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl md:text-3xl font-extrabold text-[#006a65]">{moderateCount}</span>
            <span className="text-[10px] text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full font-bold">นัดสัปดาห์ละครั้ง</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-[#cfe7e6] pb-2">
        <button
          onClick={() => setActiveTab('roster')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all ${
            activeTab === 'roster'
              ? 'bg-[#006a65] text-white shadow-xs'
              : 'text-[#3c4948] hover:bg-[#e1f7ff]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">groups</span>
          <span>{isTh ? 'ทำเนียบนักเรียนและภาวะสุขภาพจิต (6 ภาวะ)' : 'Student Condition Roster'}</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all ${
            activeTab === 'requests'
              ? 'bg-[#006a65] text-white shadow-xs'
              : 'text-[#3c4948] hover:bg-[#e1f7ff]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">event_available</span>
          <span>{isTh ? `คำขอนัดหมายคำปรึกษา (${requests.filter(r => r.status === 'pending').length})` : 'Consultation Requests'}</span>
        </button>

        <button
          onClick={() => setActiveTab('protocols')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all ${
            activeTab === 'protocols'
              ? 'bg-[#006a65] text-white shadow-xs'
              : 'text-[#3c4948] hover:bg-[#e1f7ff]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">menu_book</span>
          <span>{isTh ? 'คู่มือและแนวทางส่งต่อแพทย์ (Protocols)' : 'Clinical Protocols'}</span>
        </button>
      </div>

      {/* TAB 1: STUDENT CONDITION ROSTER */}
      {activeTab === 'roster' && (
        <div className="flex flex-col gap-5">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#cfe7e6] flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
            {/* Search */}
            <div className="w-full md:w-72 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isTh ? 'ค้นหานามแฝง รหัส หรือชื่อภาวะ...' : 'Search student or condition...'}
                className="w-full bg-[#f1fbff] border border-[#cfe7e6] rounded-xl py-2 pl-9 pr-3 text-xs text-[#001f26] outline-none focus:border-[#006a65]"
              />
              <span className="material-symbols-outlined text-sm text-[#6c7a78] absolute left-2.5 top-1/2 -translate-y-1/2">
                search
              </span>
            </div>

            {/* Condition Filter */}
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
              <span className="text-[11px] font-bold text-[#6c7a78]">{isTh ? 'กรองตามภาวะ:' : 'Filter Condition:'}</span>
              <select
                value={filterCondition}
                onChange={(e) => setFilterCondition(e.target.value)}
                className="bg-[#f1fbff] border border-[#cfe7e6] text-xs font-semibold text-[#001f26] py-1.5 px-3 rounded-xl outline-none"
              >
                <option value="all">{isTh ? 'ทั้งหมดทุกภาวะ' : 'All Conditions'}</option>
                <option value="bullying">🚨 {isTh ? 'ถูกบูลลี่/กลั่นแกล้ง' : 'Bullying'}</option>
                <option value="depression">🌧️ {isTh ? 'ภาวะซึมเศร้า/ท้อแท้' : 'Depression'}</option>
                <option value="exam_anxiety">📚 {isTh ? 'วิตกกังวลการสอบ' : 'Exam Anxiety'}</option>
                <option value="burnout">🔋 {isTh ? 'หมดไฟในการเรียน' : 'Burnout'}</option>
                <option value="family_stress">🏡 {isTh ? 'ความเครียดในครอบครัว' : 'Family Stress'}</option>
                <option value="insomnia">🌙 {isTh ? 'นอนไม่หลับเรื้อรัง' : 'Insomnia'}</option>
              </select>

              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="bg-[#f1fbff] border border-[#cfe7e6] text-xs font-semibold text-[#001f26] py-1.5 px-3 rounded-xl outline-none"
              >
                <option value="all">{isTh ? 'ทุกระดับความเสี่ยง' : 'All Risk Tiers'}</option>
                <option value="critical">{isTh ? 'วิกฤต (Critical)' : 'Critical'}</option>
                <option value="high">{isTh ? 'เสี่ยงสูง (High)' : 'High'}</option>
                <option value="moderate">{isTh ? 'ปานกลาง (Moderate)' : 'Moderate'}</option>
                <option value="mild">{isTh ? 'เล็กน้อย (Mild)' : 'Mild'}</option>
              </select>
            </div>
          </div>

          {/* Clinical Cases List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCases.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-3xl p-5 border border-[#cfe7e6] soft-shadow flex flex-col justify-between gap-4 hover:border-[#006a65] transition-all"
              >
                <div>
                  {/* Top Badge & Code */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#6c7a78] uppercase">{c.studentCode} • {c.grade}</span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        c.riskTier === 'critical'
                          ? 'bg-rose-50 text-rose-700 border-rose-300'
                          : c.riskTier === 'high'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-teal-50 text-teal-800 border-teal-300'
                      }`}
                    >
                      {c.riskTier === 'critical' ? '● วิกฤต (Critical)' : c.riskTier === 'high' ? '● เสี่ยงสูง' : '● ปานกลาง'}
                    </span>
                  </div>

                  {/* Student Alias */}
                  <h3 className="font-extrabold text-base text-[#001f26] mb-1">{c.alias}</h3>

                  {/* Condition diagnosed */}
                  <div className="p-2.5 bg-[#e1f7ff]/70 rounded-xl border border-[#cfe7e6] mb-3">
                    <span className="text-[10px] font-bold text-[#006a65] uppercase block mb-0.5">
                      {isTh ? 'ภาวะที่ตรวจพบ:' : 'Diagnosed Condition:'}
                    </span>
                    <span className="text-xs font-bold text-[#004340] block">{c.conditionNameTh}</span>
                  </div>

                  {/* Symptoms bullet list */}
                  <div className="flex flex-col gap-1 mb-3">
                    <span className="text-[10px] font-bold text-[#6c7a78] uppercase">{isTh ? 'อาการหลักที่พบ:' : 'Symptoms:'}</span>
                    {c.symptomsTh.slice(0, 3).map((sym, sIdx) => (
                      <span key={sIdx} className="text-xs text-[#3c4948] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#006a65] shrink-0"></span>
                        <span className="truncate">{sym}</span>
                      </span>
                    ))}
                  </div>

                  {/* Score pills */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#cfe7e6]/70 text-[11px]">
                    <span className="bg-[#f1fbff] px-2 py-1 rounded-lg border border-[#cfe7e6] text-[#006a65] font-semibold">
                      9Q Score: <strong>{c.phqScore}/27</strong>
                    </span>
                    <span className="bg-[#f1fbff] px-2 py-1 rounded-lg border border-[#cfe7e6] text-[#ba1a1a] font-semibold">
                      Stress: <strong>{c.stressScore}%</strong>
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  onClick={() => setSelectedCase(c)}
                  className="w-full py-2.5 bg-[#006a65] hover:bg-[#004340] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  <span>{isTh ? 'ดูแฟ้มประวัติและแผนช่วยเหลือ' : 'View Clinical Plan'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CONSULTATION REQUESTS */}
      {activeTab === 'requests' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-6 border border-[#cfe7e6] soft-shadow flex flex-col gap-4">
            <h3 className="text-lg font-bold text-[#001f26]">
              {isTh ? 'รายการคำขอรับคำปรึกษาจากนักเรียน' : 'Incoming Student Consultation Requests'}
            </h3>
            <div className="flex flex-col gap-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 bg-[#f1fbff] border border-[#cfe7e6] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-[#001f26]">{req.studentAlias}</span>
                      <span className="text-[10px] bg-[#e1f7ff] text-[#006a65] px-2 py-0.5 rounded-full font-bold">
                        {req.category}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        req.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {req.status === 'pending' ? (isTh ? 'รอยืนยัน' : 'Pending') : (isTh ? 'ยืนยันแล้ว' : 'Accepted')}
                      </span>
                    </div>
                    <p className="text-xs text-[#4d6262] italic">"{req.note}"</p>
                    <span className="text-[10px] text-[#6c7a78] mt-1 block">
                      {isTh ? `เวลาที่ขอ: ${req.timeRequested}` : `Requested: ${req.timeRequested}`} • โหมด: {req.mode}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {req.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateRequestStatus(req.id, 'accepted')}
                        className="px-4 py-2 bg-[#006a65] text-white rounded-xl text-xs font-bold hover:bg-[#004340] transition-all"
                      >
                        {isTh ? 'ยืนยันนัดหมาย' : 'Accept Request'}
                      </button>
                    )}
                    {req.status === 'accepted' && (
                      <button
                        onClick={() => handleUpdateRequestStatus(req.id, 'completed')}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all"
                      >
                        {isTh ? 'ปิดการให้คำปรึกษา' : 'Mark Completed'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CLINICAL REFERRAL PROTOCOLS */}
      {activeTab === 'protocols' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-[#cfe7e6] soft-shadow flex flex-col gap-3">
            <span className="text-xs font-bold text-[#ba1a1a] uppercase flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">emergency</span>
              <span>{isTh ? 'แนวปฏิบัติการส่งต่อภาวะวิกฤต (Crisis Referral Protocol)' : 'Crisis Referral Protocol'}</span>
            </span>
            <h4 className="text-base font-bold text-[#001f26]">{isTh ? 'เมื่อคะแนน 9Q สูงกว่า 19 คะแนน หรือพบสัญญาณทำร้ายตนเอง' : 'Critical Score Protocols'}</h4>
            <ul className="text-xs text-[#3c4948] space-y-2 list-disc list-inside">
              <li>ติดต่อผู้ปกครองทันทีอย่างสุภาพและให้ความมั่นใจเรื่องความปลอดภัย</li>
              <li>ไม่ปล่อยให้นักเรียนอยู่คนเดียว จัดให้อยู่ในห้องแนะแนวหรือ Safe Point ที่มีครูประจำ</li>
              <li>โทรประสานสายด่วนสุขภาพจิต 1323 หรือแผนกจิตเวชเด็กและวัยรุ่น โรงพยาบาลศูนย์ใกล้เคียง</li>
              <li>บันทึกลงแฟ้มประวัติโดยจำกัดสิทธิ์การเข้าถึงเฉพาะครูแนะแนวและผู้บริหาร</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#cfe7e6] soft-shadow flex flex-col gap-3">
            <span className="text-xs font-bold text-[#006a65] uppercase flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">school</span>
              <span>{isTh ? 'การประสานความร่วมมือระหว่างโรงเรียนและบ้าน' : 'Home-School Collaboration'}</span>
            </span>
            <h4 className="text-base font-bold text-[#001f26]">{isTh ? 'แนวทางแจ้งผู้ปกครองเมื่อเด็กมีภาวะหมดไฟหรือวิตกกังวลสอบ' : 'Parent Consultation Guidance'}</h4>
            <ul className="text-xs text-[#3c4948] space-y-2 list-disc list-inside">
              <li>เน้นการรับฟังความรู้สึกของเด็กก่อนการตักเตือนเรื่องผลการเรียน</li>
              <li>ปรับลดความกดดันและเปิดโอกาสให้เด็กได้พักผ่อนอย่างเพียงพอ</li>
              <li>จัดทำตารางเวลาเรียนและการบ้านร่วมกับครูประจำชั้นเพื่อลดภาระงานซ้ำซ้อน</li>
            </ul>
          </div>
        </div>
      )}

      {/* INDIVIDUAL STUDENT CLINICAL DOSSIER MODAL */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl border border-[#cfe7e6] relative text-left max-h-[90vh] overflow-y-auto animate-fade-in">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#f1fbff] flex items-center justify-center text-[#6c7a78] hover:text-[#001f26]"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#006a65] uppercase">{selectedCase.studentCode} • {selectedCase.grade}</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#001f26] mb-3">{selectedCase.alias}</h3>

            {/* Condition badge banner */}
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl mb-4">
              <span className="text-[10px] font-bold text-rose-800 uppercase block mb-0.5">{isTh ? 'การวินิจฉัยภาวะเสี่ยง:' : 'Clinical Diagnosis:'}</span>
              <p className="text-sm font-bold text-rose-950">{selectedCase.conditionNameTh}</p>
            </div>

            {/* Observation Notes */}
            <div className="p-3 bg-[#f1fbff] rounded-2xl border border-[#cfe7e6] mb-4">
              <span className="text-xs font-bold text-[#001f26] block mb-1">{isTh ? 'บันทึกการสังเกตของครูประจำชั้น:' : 'Homeroom Teacher Notes:'}</span>
              <p className="text-xs text-[#3c4948] leading-relaxed">{selectedCase.homeroomObservation}</p>
            </div>

            {/* Action Plan */}
            <div className="p-3 bg-white rounded-2xl border border-[#2bb8b0] mb-4">
              <span className="text-xs font-bold text-[#006a65] block mb-1">{isTh ? 'แผนการดูแลและให้คำปรึกษา (Counselor Action Plan):' : 'Action Plan:'}</span>
              <p className="text-xs text-[#004340] leading-relaxed">{selectedCase.counselorActionPlan}</p>
            </div>

            {/* Actions button row */}
            <div className="flex gap-2 pt-2 flex-wrap">
              <button
                onClick={() => {
                  soothingAudio.playGentleChime();
                  setToastMsg(isTh ? 'ส่งคำเชิญนัดหมายไปยังนักเรียนเรียบร้อย' : 'Consultation invitation dispatched');
                  setSelectedCase(null);
                  setTimeout(() => setToastMsg(null), 3000);
                }}
                className="flex-1 py-3 bg-[#006a65] hover:bg-[#004340] text-white rounded-full text-xs font-bold"
              >
                {isTh ? 'ส่งนัดหมายพบนักเรียนด่วน' : 'Schedule Session'}
              </button>
              <a
                href="tel:1323"
                className="px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">call</span>
                <span>{isTh ? 'สายด่วน 1323' : 'Call 1323'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
