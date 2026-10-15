import React from 'react';
import { TabType, Language, AppRole } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentRole: AppRole;
  onRoleChange: (role: AppRole) => void;
  onOpenEmergency: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  language,
  onLanguageChange,
  currentRole,
  onRoleChange,
  onOpenEmergency,
}) => {
  const isTh = language === 'th';

  const roleLabels: Record<AppRole, { th: string; en: string; icon: string }> = {
    student: { th: 'นักเรียน', en: 'Student', icon: 'school' },
    council: { th: 'สภานักเรียน', en: 'Council', icon: 'account_balance' },
    teacher: { th: 'อาจารย์', en: 'Faculty', icon: 'supervisor_account' },
    parent: { th: 'ผู้ปกครอง', en: 'Parent', icon: 'family_restroom' },
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0b1e3b]/95 backdrop-blur-md w-full border-b border-blue-900/40 shadow-md text-white">
      <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-[1180px] mx-auto h-16">
        {/* Brand Logo & Title */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-transform shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 p-0.5 shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-[#0b1e3b] rounded-[10px] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-blue-400 material-symbols-filled">
                school
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base md:text-lg text-white tracking-tight leading-none flex items-center gap-1.5">
                <span>SAFE PHATNA</span>
              </h1>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider">
                {isTh ? 'สถาบันการศึกษา' : 'ACADEMIC'}
              </span>
            </div>
            <span className="text-[10px] text-slate-300 font-medium leading-tight hidden sm:block mt-0.5">
              {isTh ? 'ศูนย์สุขภาวะและจิตวิทยาโรงเรียนพัฒนศึกษา' : 'Student Psychological Care & Guidance Center'}
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5">
          <button
            onClick={() => onTabChange('home')}
            className={`font-semibold text-xs flex items-center gap-1.5 py-2 px-3.5 rounded-xl transition-all ${
              currentTab === 'home'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>{isTh ? 'หน้าหลัก' : 'Home'}</span>
          </button>

          <button
            onClick={() => onTabChange('chat')}
            className={`font-semibold text-xs flex items-center gap-1.5 py-2 px-3.5 rounded-xl transition-all ${
              currentTab === 'chat'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
            <span>{isTh ? 'คุยด้วยเสียง' : 'Voice Chat'}</span>
          </button>

          <button
            onClick={() => onTabChange('wellness')}
            className={`font-semibold text-xs flex items-center gap-1.5 py-2 px-3.5 rounded-xl transition-all ${
              currentTab === 'wellness'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">spa</span>
            <span>{isTh ? 'สุขภาวะใจ' : 'Wellness'}</span>
          </button>

          <button
            onClick={() => onTabChange('school')}
            className={`font-semibold text-xs flex items-center gap-1.5 py-2 px-3.5 rounded-xl transition-all ${
              currentTab === 'school'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
            <span>{isTh ? 'ที่ปรึกษา' : 'Counseling'}</span>
          </button>

          <button
            onClick={() => onTabChange('profile')}
            className={`font-semibold text-xs flex items-center gap-1.5 py-2 px-3.5 rounded-xl transition-all ${
              currentTab === 'profile'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">timeline</span>
            <span>{isTh ? 'ติดตามสถานะ' : 'Status'}</span>
          </button>
        </nav>

        {/* Right Section: Role Mode Switcher + Language + Emergency */}
        <div className="flex items-center gap-2">
          {/* Mode Selector Dropdown / Protected Badge */}
          {currentRole !== 'student' ? (
            <div className="flex items-center gap-1.5 bg-blue-950/80 border border-blue-400/40 px-2.5 py-1 rounded-full shadow-2xs">
              <span className="material-symbols-outlined text-xs text-blue-300">lock_open</span>
              <span className="text-[11px] font-extrabold text-blue-200">
                {roleLabels[currentRole][isTh ? 'th' : 'en']}
              </span>
              <button
                onClick={() => onRoleChange('student')}
                title={isTh ? 'ออกจากโหมดนี้ กลับสู่นักเรียน' : 'Exit to Student Mode'}
                className="text-[10px] font-bold text-red-300 hover:text-red-100 underline ml-1 cursor-pointer"
              >
                {isTh ? 'ออก' : 'Exit'}
              </button>
            </div>
          ) : (
            <div className="relative">
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as AppRole)}
                className="bg-white/10 text-white text-xs font-bold py-1.5 px-3 rounded-full border border-white/20 outline-none cursor-pointer hover:bg-white/15 transition-colors pr-6"
              >
                <option value="student" className="text-slate-900">🎓 {isTh ? 'โหมดนักเรียน' : 'Student Mode'}</option>
                <option value="council" className="text-slate-900">🏛️ {isTh ? 'โหมดสภานักเรียน 🔒' : 'Council Mode 🔒'}</option>
                <option value="teacher" className="text-slate-900">👩‍🏫 {isTh ? 'โหมดอาจารย์ 🔒' : 'Teacher Mode 🔒'}</option>
                <option value="parent" className="text-slate-900">👨‍👩‍👧 {isTh ? 'โหมดผู้ปกครอง 🔒' : 'Parent Mode 🔒'}</option>
              </select>
            </div>
          )}

          {/* Language Toggle */}
          <div className="bg-white/10 p-0.5 rounded-full flex items-center text-[11px] font-bold text-white border border-white/20 shrink-0">
            <button
              onClick={() => onLanguageChange('th')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                isTh ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              TH
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                !isTh ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Emergency Alert Button */}
          <button
            onClick={onOpenEmergency}
            title={isTh ? 'แจ้งเหตุด่วนฉุกเฉิน' : 'Emergency Assistance'}
            className="w-9 h-9 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all flex items-center justify-center active:scale-90 shadow-md border border-red-400 shrink-0"
          >
            <span className="material-symbols-outlined text-lg leading-none material-symbols-filled">
              emergency_home
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
