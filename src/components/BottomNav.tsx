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
    { id: 'chat', labelTh: 'คุยเสียง', labelEn: 'Voice AI', icon: 'graphic_eq' },
    { id: 'wellness', labelTh: 'สุขภาวะใจ', labelEn: 'Wellness', icon: 'spa' },
    { id: 'school', labelTh: 'ที่ปรึกษา', labelEn: 'Counselor', icon: 'volunteer_activism' },
    { id: 'profile', labelTh: 'ติดตามสถานะ', labelEn: 'Status', icon: 'timeline' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_0px_rgba(16,42,78,0.08)] rounded-t-2xl flex justify-around items-center px-2 py-2 pb-safe">
      {items.map((item) => {
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
              isActive
                ? 'bg-blue-600 text-white rounded-2xl px-3.5 py-1.5 shadow-sm'
                : 'text-slate-500 hover:text-blue-700 py-1.5 px-2'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] leading-none mb-0.5 ${
                isActive ? 'material-symbols-filled' : ''
              }`}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-bold tracking-tight">
              {isTh ? item.labelTh : item.labelEn}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
