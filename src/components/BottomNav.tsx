import React from 'react';
import { TabType, Language } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  language,
}) => {
  const isTh = language === 'th';

  const items: { id: TabType; labelTh: string; labelEn: string; icon: string }[] = [
    { id: 'home', labelTh: 'หน้าหลัก', labelEn: 'Home', icon: 'home' },
    { id: 'chat', labelTh: 'พูดคุย', labelEn: 'Chat', icon: 'chat_bubble' },
    { id: 'wellness', labelTh: 'ดูแลใจ', labelEn: 'Wellness', icon: 'spa' },
    { id: 'school', labelTh: 'โรงเรียน', labelEn: 'School', icon: 'school' },
    { id: 'profile', labelTh: 'โปรไฟล์', labelEn: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md border-t border-[#cfe7e6]/50 shadow-[0_-4px_20px_0px_rgba(22,58,67,0.06)] rounded-t-2xl flex justify-around items-center px-2 py-2 pb-safe">
      {items.map((item) => {
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
              isActive
                ? 'bg-[#78f3eb] text-[#006f6a] rounded-full px-3.5 py-1 shadow-xs'
                : 'text-[#6c7a78] hover:text-[#006a65] py-1 px-2'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] leading-none mb-0.5 ${
                isActive ? 'material-symbols-filled' : ''
              }`}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-semibold tracking-tight">
              {isTh ? item.labelTh : item.labelEn}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
