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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md w-full border-b border-[#cfe7e6]/50 shadow-xs">
      <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-[1140px] mx-auto h-16">
        {/* Brand Logo & Title */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-transform shrink-0"
        >
          <img
            alt="Safe Phatna Logo"
            className="w-9 h-9 object-contain drop-shadow-xs"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuvnl9Til1F8-hA-UOfU40Xx0fofpvnHT45P_yQD9auzhI_exE2hyYDkYGBUjbcyhJU2f735uj9qIyLcsLil3eC0WuO-fY8T5OauJRAL-rKB42gExFdtNRhtyMcQdBgOvY_5GECKPfHA3TgDvnardcNfKNn5wKhdjPDv_KUp9QUZnlERvHOdfRrpybpd6gcNOUPA2HVW0RQJbnR5tks2eTPgMqeRLGc4FsYVypl0aolWEjohJd3xDl6w"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.fallback-icon')) {
                const span = document.createElement('span');
                span.className = 'material-symbols-outlined text-2xl text-[#006a65] fallback-icon material-symbols-filled';
                span.innerText = 'security';
                parent.prepend(span);
              }
            }}
          />
          <div className="flex flex-col">
            <h1 className="font-extrabold text-lg md:text-xl text-[#006a65] tracking-tight leading-none">
              SAFE PHATNA
            </h1>
            <span className="text-[10px] text-[#6c7a78] font-medium leading-tight hidden lg:block">
              {isTh ? 'พื้นที่ปลอดภัยสำหรับทุกความรู้สึก' : 'Institutional Safe Space'}
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => onTabChange('home')}
            className={`font-bold text-xs flex items-center gap-1.5 py-1.5 px-3 rounded-full transition-all ${
              currentTab === 'home'
                ? 'bg-[#d1f4ff] text-[#006a65] shadow-xs'
                : 'text-[#3c4948] hover:text-[#006a65] hover:bg-[#e1f7ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>{isTh ? 'หน้าหลัก' : 'Home'}</span>
          </button>

          <button
            onClick={() => onTabChange('chat')}
            className={`font-bold text-xs flex items-center gap-1.5 py-1.5 px-3 rounded-full transition-all ${
              currentTab === 'chat'
                ? 'bg-[#d1f4ff] text-[#006a65] shadow-xs'
                : 'text-[#3c4948] hover:text-[#006a65] hover:bg-[#e1f7ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
            <span>{isTh ? 'คุยด้วยเสียง' : 'Voice Chat'}</span>
          </button>

          <button
            onClick={() => onTabChange('wellness')}
            className={`font-bold text-xs flex items-center gap-1.5 py-1.5 px-3 rounded-full transition-all ${
              currentTab === 'wellness'
                ? 'bg-[#d1f4ff] text-[#006a65] shadow-xs'
                : 'text-[#3c4948] hover:text-[#006a65] hover:bg-[#e1f7ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">spa</span>
            <span>{isTh ? 'ดูแลใจ' : 'Wellness'}</span>
          </button>

          <button
            onClick={() => onTabChange('school')}
            className={`font-bold text-xs flex items-center gap-1.5 py-1.5 px-3 rounded-full transition-all ${
              currentTab === 'school'
                ? 'bg-[#d1f4ff] text-[#006a65] shadow-xs'
                : 'text-[#3c4948] hover:text-[#006a65] hover:bg-[#e1f7ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">school</span>
            <span>{isTh ? 'โรงเรียน' : 'School'}</span>
          </button>

          <button
            onClick={() => onTabChange('profile')}
            className={`font-bold text-xs flex items-center gap-1.5 py-1.5 px-3 rounded-full transition-all ${
              currentTab === 'profile'
                ? 'bg-[#d1f4ff] text-[#006a65] shadow-xs'
                : 'text-[#3c4948] hover:text-[#006a65] hover:bg-[#e1f7ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            <span>{isTh ? 'โปรไฟล์' : 'Profile'}</span>
          </button>
        </nav>

        {/* Right Section: Role Mode Switcher + Language + Emergency */}
        <div className="flex items-center gap-2">
          {/* Mode Selector Dropdown / Pills */}
          <div className="relative">
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as AppRole)}
              className="bg-[#e1f7ff] text-[#006a65] text-xs font-bold py-1.5 px-2.5 rounded-full border border-[#cfe7e6] outline-none cursor-pointer hover:bg-[#d1f4ff] shadow-xs transition-colors pr-6"
            >
              <option value="student">🎓 {isTh ? 'โหมดนักเรียน' : 'Student Mode'}</option>
              <option value="council">🏛️ {isTh ? 'โหมดสภานักเรียน' : 'Council Mode'}</option>
              <option value="teacher">👩‍🏫 {isTh ? 'โหมดอาจารย์' : 'Teacher Mode'}</option>
              <option value="parent">👨‍👩‍👧 {isTh ? 'โหมดผู้ปกครอง' : 'Parent Mode'}</option>
            </select>
          </div>

          {/* Language Toggle */}
          <div className="bg-[#e1f7ff] p-0.5 rounded-full flex items-center text-[11px] font-bold text-[#006a65] border border-[#cfe7e6] shrink-0">
            <button
              onClick={() => onLanguageChange('th')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                isTh ? 'bg-[#006a65] text-white shadow-2xs' : 'hover:text-[#004340]'
              }`}
            >
              TH
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                !isTh ? 'bg-[#006a65] text-white shadow-2xs' : 'hover:text-[#004340]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Emergency Alert Button */}
          <button
            onClick={onOpenEmergency}
            title={isTh ? 'แจ้งเหตุด่วนฉุกเฉิน' : 'Emergency Assistance'}
            className="w-9 h-9 rounded-full bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb4ab] transition-all flex items-center justify-center active:scale-90 shadow-xs border border-red-200 shrink-0"
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
