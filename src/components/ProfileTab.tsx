import React, { useState } from 'react';
import { Language, UserProfile } from '../types';
import { soothingAudio } from '../utils/audio';

interface ProfileTabProps {
  language: Language;
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenSafePoints: () => void;
  onNavigateToSchool: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  language,
  profile,
  onUpdateProfile,
  onOpenSafePoints,
  onNavigateToSchool,
}) => {
  const isTh = language === 'th';
  const [activeSubView, setActiveSubView] = useState<'wellbeing' | 'alias'>('wellbeing');
  const [graphPeriod, setGraphPeriod] = useState<'daily' | 'weekly'>('daily');
  const [aliasInput, setAliasInput] = useState(profile.alias);
  const [aiNameInput, setAiNameInput] = useState(profile.aiName);
  const [isDataSharingOn, setIsDataSharingOn] = useState(!profile.isPrivate);
  const [permissions, setPermissions] = useState(profile.sharingPermissions);
  const [saveToast, setSaveToast] = useState(false);

  const handleSaveSettings = () => {
    soothingAudio.playGentleChime();
    onUpdateProfile({
      alias: aliasInput,
      aiName: aiNameInput,
      isPrivate: !isDataSharingOn,
      sharingPermissions: permissions,
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 4000);
  };

  const togglePermission = (key: keyof typeof permissions) => {
    if (!isDataSharingOn) return;
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full max-w-[1140px] mx-auto px-5 md:px-10 pt-6 pb-28 md:pb-16 flex flex-col gap-8 animate-fade-in">
      {/* Toast Alert */}
      {saveToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#006a65] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#2bb8b0] text-sm max-w-md w-[90%] text-center animate-bounce">
          {isTh ? 'บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว ✨' : 'Settings saved successfully ✨'}
        </div>
      )}

      {/* Header & Sub-view Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#001f26] mb-1">
            {activeSubView === 'wellbeing'
              ? isTh ? 'การดูแลใจและการตั้งค่า' : 'My Wellbeing & Settings'
              : isTh ? 'โปรไฟล์และนามแฝง' : 'Profile & Alias'}
          </h1>
          <p className="text-xs md:text-sm text-[#4d6262]">
            {activeSubView === 'wellbeing'
              ? isTh
                ? 'ติดตามแนวโน้มทางอารมณ์ จัดการความเป็นส่วนตัว และเข้าถึงแหล่งช่วยเหลือ'
                : 'Review your emotional trends, manage your privacy, and access help resources.'
              : isTh
              ? 'จัดการข้อมูลส่วนตัวและผู้ช่วย AI ของคุณ เพื่อประสบการณ์ที่ปลอดภัยและเป็นส่วนตัว'
              : 'Customize your private nickname and AI companion name for safe communication.'}
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex bg-[#e1f7ff] p-1 rounded-full border border-[#cfe7e6] shrink-0">
          <button
            onClick={() => setActiveSubView('wellbeing')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeSubView === 'wellbeing'
                ? 'bg-[#006a65] text-white shadow-xs'
                : 'text-[#006a65] hover:bg-[#d1f4ff]'
            }`}
          >
            📊 {isTh ? 'การดูแลใจ & สถิติ' : 'Wellbeing & Trends'}
          </button>
          <button
            onClick={() => setActiveSubView('alias')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeSubView === 'alias'
                ? 'bg-[#006a65] text-white shadow-xs'
                : 'text-[#006a65] hover:bg-[#d1f4ff]'
            }`}
          >
            👤 {isTh ? 'โปรไฟล์ & นามแฝง' : 'Profile & Alias'}
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: WELLBEING & SETTINGS (GRAPH, PRIVACY, HELP CENTER) */}
      {activeSubView === 'wellbeing' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Emotion Graph & Privacy Control */}
          <div className="col-span-1 md:col-span-8 flex flex-col gap-8">
            {/* Emotion Graph Card */}
            <section className="bg-white rounded-3xl p-6 md:p-8 soft-shadow border border-[#cfe7e6]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a65] text-2xl">
                    monitoring
                  </span>
                  <h2 className="text-lg md:text-xl font-bold text-[#001f26]">
                    {isTh ? 'กราฟอารมณ์' : 'Emotion Graph'}
                  </h2>
                </div>
                <div className="flex bg-[#e1f7ff] rounded-lg p-1 border border-[#cfe7e6]">
                  <button
                    onClick={() => setGraphPeriod('daily')}
                    className={`px-3.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      graphPeriod === 'daily'
                        ? 'bg-[#006a65] text-white shadow-xs'
                        : 'text-[#3c4948] hover:text-[#006a65]'
                    }`}
                  >
                    {isTh ? 'รายวัน' : 'Daily'}
                  </button>
                  <button
                    onClick={() => setGraphPeriod('weekly')}
                    className={`px-3.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      graphPeriod === 'weekly'
                        ? 'bg-[#006a65] text-white shadow-xs'
                        : 'text-[#3c4948] hover:text-[#006a65]'
                    }`}
                  >
                    {isTh ? 'รายสัปดาห์' : 'Weekly'}
                  </button>
                </div>
              </div>

              {/* Abstract Graph Canvas matching mockup */}
              <div className="h-64 w-full bg-[#f1fbff] rounded-2xl border border-[#cfe7e6] relative flex items-end p-4 gap-4 mb-4">
                {/* Y-Axis Labels */}
                <div className="absolute left-3 top-4 bottom-4 flex flex-col justify-between text-xs font-medium text-[#6c7a78]">
                  <span>{isTh ? 'สูง' : 'High'}</span>
                  <span>{isTh ? 'กลาง' : 'Med'}</span>
                  <span>{isTh ? 'ต่ำ' : 'Low'}</span>
                </div>

                {/* Bars Container */}
                <div className="flex-1 flex items-end justify-around h-full ml-10 relative">
                  {/* Stress */}
                  <div className="flex-1 flex items-end justify-center h-full group relative">
                    <div
                      className="w-12 bg-gradient-to-t from-[#2bb8b0]/30 to-[#2bb8b0] rounded-t-xl transition-all duration-500 hover:opacity-80 cursor-pointer shadow-xs"
                      style={{ height: graphPeriod === 'daily' ? '58%' : '50%' }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#001f26] text-white text-[10px] px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                        {isTh ? 'ความเครียด: 58%' : 'Stress: 58%'}
                      </div>
                    </div>
                  </div>

                  {/* Anxiety */}
                  <div className="flex-1 flex items-end justify-center h-full group relative">
                    <div
                      className="w-12 bg-gradient-to-t from-[#78f3eb]/40 to-[#78f3eb] rounded-t-xl transition-all duration-500 hover:opacity-80 cursor-pointer shadow-xs"
                      style={{ height: graphPeriod === 'daily' ? '38%' : '42%' }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#001f26] text-white text-[10px] px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                        {isTh ? 'ความกังวล: 38%' : 'Anxiety: 38%'}
                      </div>
                    </div>
                  </div>

                  {/* Fatigue */}
                  <div className="flex-1 flex items-end justify-center h-full group relative">
                    <div
                      className="w-12 bg-gradient-to-t from-[#93aaa9]/40 to-[#93aaa9] rounded-t-xl transition-all duration-500 hover:opacity-80 cursor-pointer shadow-xs"
                      style={{ height: graphPeriod === 'daily' ? '76%' : '65%' }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#001f26] text-white text-[10px] px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                        {isTh ? 'ความเหนื่อยล้า: 76%' : 'Fatigue: 76%'}
                      </div>
                    </div>
                  </div>

                  {/* Safety */}
                  <div className="flex-1 flex items-end justify-center h-full group relative">
                    <div
                      className="w-12 bg-gradient-to-t from-[#ffdad6]/40 to-[#ffdad6] rounded-t-xl transition-all duration-500 hover:opacity-80 cursor-pointer shadow-xs"
                      style={{ height: graphPeriod === 'daily' ? '32%' : '45%' }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#001f26] text-white text-[10px] px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                        {isTh ? 'ความปลอดภัย: 32%' : 'Safety: 32%'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* X-Axis Labels */}
                <div className="absolute bottom-0 left-12 right-2 flex justify-around translate-y-full pt-2">
                  <span className="text-[11px] text-[#3c4948] font-medium">
                    {isTh ? 'ความเครียด' : 'Stress'}
                  </span>
                  <span className="text-[11px] text-[#3c4948] font-medium">
                    {isTh ? 'ความกังวล' : 'Anxiety'}
                  </span>
                  <span className="text-[11px] text-[#3c4948] font-medium">
                    {isTh ? 'ความเหนื่อยล้า' : 'Fatigue'}
                  </span>
                  <span className="text-[11px] text-[#3c4948] font-medium">
                    {isTh ? 'ความปลอดภัย' : 'Safety'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#6c7a78] mt-7 text-center">
                {isTh
                  ? 'ข้อมูลจะถูกอัปเดตโดยอัตโนมัติตามการเช็กอินรายวันของคุณ'
                  : 'Data is updated automatically based on your daily check-ins.'}
              </p>
            </section>

            {/* Privacy Control Card matching mockup */}
            <section className="bg-white rounded-3xl p-6 md:p-8 soft-shadow border border-[#cfe7e6]">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[#006a65] text-2xl">lock</span>
                <h2 className="text-lg md:text-xl font-bold text-[#001f26]">
                  {isTh ? 'การควบคุมความเป็นส่วนตัว' : 'Privacy Control'}
                </h2>
              </div>

              {/* Master toggle box */}
              <div className="bg-[#e1f7ff] rounded-2xl p-4 md:p-5 mb-6 flex justify-between items-center border border-[#cfe7e6]">
                <div>
                  <h3 className="font-semibold text-sm md:text-base text-[#001f26]">
                    {isTh ? 'ใครสามารถเห็นข้อมูลนี้?' : 'Who can view this data?'}
                  </h3>
                  <p className="text-xs text-[#4d6262] mt-0.5">
                    {isDataSharingOn
                      ? isTh
                        ? 'ขณะนี้เปิดการแชร์ข้อมูลตามผู้รับที่เลือก'
                        : 'Data sharing is currently ENABLED for selected roles'
                      : isTh
                      ? 'ขณะนี้การแชร์ข้อมูลเป็นแบบ ส่วนตัว (ไม่มีใครเห็น)'
                      : 'Data sharing is currently PRIVATE.'}
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDataSharingOn}
                    onChange={(e) => setIsDataSharingOn(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#bbc9c7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a65]"></div>
                </label>
              </div>

              {/* Sub Checkboxes */}
              <div className="space-y-3">
                <label
                  onClick={() => togglePermission('aiAnonymous')}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                    isDataSharingOn
                      ? 'border-[#cfe7e6] hover:bg-[#f1fbff] cursor-pointer'
                      : 'border-[#cfe7e6]/50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={!isDataSharingOn}
                    checked={permissions.aiAnonymous}
                    onChange={() => {}}
                    className="w-5 h-5 text-[#006a65] rounded border-[#bbc9c7]"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs md:text-sm font-semibold text-[#001f26]">
                      {isTh ? 'การวิเคราะห์โดย AI (ไม่ระบุตัวตน)' : 'AI Analysis (Anonymous)'}
                    </span>
                    <span className="text-[11px] text-[#6c7a78]">
                      {isTh
                        ? 'อนุญาตให้ AI วิเคราะห์แนวโน้มเพื่อแนะนำทรัพยากรช่วยเหลือ'
                        : 'Allow AI to identify trends to suggest helpful resources.'}
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => togglePermission('selectedTeacher')}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                    isDataSharingOn
                      ? 'border-[#cfe7e6] hover:bg-[#f1fbff] cursor-pointer'
                      : 'border-[#cfe7e6]/50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={!isDataSharingOn}
                    checked={permissions.selectedTeacher}
                    onChange={() => {}}
                    className="w-5 h-5 text-[#006a65] rounded border-[#bbc9c7]"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs md:text-sm font-semibold text-[#001f26]">
                      {isTh ? 'อาจารย์ที่เลือก' : 'Selected Teacher'}
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => togglePermission('counselor')}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                    isDataSharingOn
                      ? 'border-[#cfe7e6] hover:bg-[#f1fbff] cursor-pointer'
                      : 'border-[#cfe7e6]/50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={!isDataSharingOn}
                    checked={permissions.counselor}
                    onChange={() => {}}
                    className="w-5 h-5 text-[#006a65] rounded border-[#bbc9c7]"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs md:text-sm font-semibold text-[#001f26]">
                      {isTh ? 'ครูแนะแนว' : 'School Counselor'}
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => togglePermission('studentCouncil')}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                    isDataSharingOn
                      ? 'border-[#cfe7e6] hover:bg-[#f1fbff] cursor-pointer'
                      : 'border-[#cfe7e6]/50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={!isDataSharingOn}
                    checked={permissions.studentCouncil}
                    onChange={() => {}}
                    className="w-5 h-5 text-[#006a65] rounded border-[#bbc9c7]"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs md:text-sm font-semibold text-[#001f26]">
                      {isTh ? 'สภานักเรียน' : 'Student Council Support'}
                    </span>
                  </div>
                </label>
              </div>

              <p className="text-xs text-[#ba1a1a] mt-4 flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-base">info</span>
                <span>
                  {isTh
                    ? 'เปิดการแชร์ข้อมูลเพื่อเลือกผู้เข้าชมที่เฉพาะเจาะจง'
                    : 'Turn on data sharing to select specific viewers.'}
                </span>
              </p>

              <button
                onClick={handleSaveSettings}
                className="mt-6 w-full bg-[#006a65] text-white py-3 rounded-full text-xs md:text-sm font-semibold hover:bg-[#004340] active:scale-95 transition-all shadow-xs"
              >
                {isTh ? 'บันทึกการตั้งค่าความเป็นส่วนตัว' : 'Save Privacy Preferences'}
              </button>
            </section>
          </div>

          {/* Right Column: Help Center & Hotlines */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
            <section className="bg-white rounded-3xl p-6 md:p-8 soft-shadow border border-[#cfe7e6]">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[#ba1a1a] text-2xl">
                  support_agent
                </span>
                <h2 className="text-lg md:text-xl font-bold text-[#001f26]">
                  {isTh ? 'ศูนย์ช่วยเหลือ' : 'Help Center'}
                </h2>
              </div>

              {/* Emergency Numbers */}
              <div className="space-y-3 mb-6">
                <h3 className="text-xs font-bold text-[#6c7a78] uppercase tracking-wider border-b border-[#cfe7e6] pb-2">
                  {isTh ? 'เบอร์โทรฉุกเฉิน' : 'Emergency Numbers'}
                </h3>

                <a
                  href="tel:191"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#ffdad6] text-[#93000a] hover:bg-[#ffb4ab] transition-all group active:scale-95 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">local_police</span>
                    <span className="font-semibold text-xs md:text-sm">
                      {isTh ? 'ตำรวจ' : 'Police'}
                    </span>
                  </div>
                  <span className="font-bold text-base md:text-lg">191</span>
                </a>

                <a
                  href="tel:1669"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#ffdad6] text-[#93000a] hover:bg-[#ffb4ab] transition-all group active:scale-95 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">ambulance</span>
                    <span className="font-semibold text-xs md:text-sm">
                      {isTh ? 'รถพยาบาล' : 'Ambulance'}
                    </span>
                  </div>
                  <span className="font-bold text-base md:text-lg">1669</span>
                </a>

                <a
                  href="tel:1323"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#caeefa] text-[#001f26] hover:bg-[#c4e9f4] transition-all group active:scale-95 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#006a65] text-xl">
                      psychology
                    </span>
                    <span className="font-semibold text-xs md:text-sm">
                      {isTh ? 'สายด่วนสุขภาพจิต' : 'Mental Health Hotline'}
                    </span>
                  </div>
                  <span className="font-bold text-base md:text-lg text-[#006a65]">1323</span>
                </a>

                <a
                  href="tel:1300"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#caeefa] text-[#001f26] hover:bg-[#c4e9f4] transition-all group active:scale-95 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#006a65] text-xl">
                      family_restroom
                    </span>
                    <span className="font-semibold text-xs md:text-sm">
                      {isTh ? 'ศูนย์ช่วยเหลือสังคม' : 'Social Assistance'}
                    </span>
                  </div>
                  <span className="font-bold text-base md:text-lg text-[#006a65]">1300</span>
                </a>
              </div>

              {/* School Help */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#6c7a78] uppercase tracking-wider border-b border-[#cfe7e6] pb-2">
                  {isTh ? 'ความช่วยเหลือในโรงเรียน' : 'School Help'}
                </h3>

                <button
                  onClick={onOpenSafePoints}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#f1fbff] border border-[#cfe7e6] hover:border-[#006a65]/60 transition-all text-left shadow-2xs active:scale-95"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2bb8b0] flex items-center justify-center text-white shrink-0">
                      <span className="material-symbols-outlined text-xl">location_on</span>
                    </div>
                    <div>
                      <div className="font-bold text-xs md:text-sm text-[#001f26]">
                        {isTh ? 'จุดปลอดภัย' : 'Safe Points'}
                      </div>
                      <div className="text-[11px] text-[#4d6262]">
                        {isTh ? 'ค้นหาพื้นที่พักใจในโรงเรียน' : 'Find quiet sanctuaries on campus'}
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#6c7a78]">chevron_right</span>
                </button>

                <button
                  onClick={onNavigateToSchool}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#f1fbff] border border-[#cfe7e6] hover:border-[#006a65]/60 transition-all text-left shadow-2xs active:scale-95"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#78f3eb] flex items-center justify-center text-[#006f6a] shrink-0">
                      <span className="material-symbols-outlined text-xl">forum</span>
                    </div>
                    <div>
                      <div className="font-bold text-xs md:text-sm text-[#001f26]">
                        {isTh ? 'ส่งข้อความหาอาจารย์' : 'Message Counselor'}
                      </div>
                      <div className="text-[11px] text-[#4d6262]">
                        {isTh ? 'การส่งข้อความส่วนตัวโดยตรง' : 'Private direct messaging'}
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#6c7a78]">chevron_right</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: PROFILE & ALIAS CUSTOMIZATION */}
      {activeSubView === 'alias' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Avatar and basic badge */}
          <div className="md:col-span-4 flex flex-col items-center justify-start space-y-4 bg-white p-8 rounded-3xl border border-[#cfe7e6] soft-shadow">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-[#c4e9f4] flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                <span className="material-symbols-outlined text-6xl text-[#006a65]">
                  person
                </span>
              </div>
              <button
                onClick={() => soothingAudio.playGentleChime()}
                title="Change Photo"
                className="absolute bottom-0 right-0 bg-[#006a65] text-white rounded-full p-2.5 shadow-md hover:bg-[#2bb8b0] transition-colors"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-[#001f26]">{aliasInput || profile.alias}</h2>
              <p className="text-xs text-[#6c7a78] mt-0.5">{profile.email}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10b981]/15 text-[#10b981] text-xs font-semibold">
                <span>🛡️</span>
                <span>{isTh ? 'ผู้ใช้ที่ปลอดภัย' : 'Protected Student'}</span>
              </div>
            </div>
          </div>

          {/* Settings forms */}
          <div className="md:col-span-8 space-y-6">
            {/* นามแฝง (Alias) Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 soft-shadow border border-[#cfe7e6] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#006a65]"></div>
              <h3 className="text-xs font-bold text-[#006a65] uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">badge</span>
                <span>{isTh ? 'ข้อมูลส่วนตัว' : 'Personal Profile'}</span>
              </h3>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#001f26]">
                  {isTh ? 'นามแฝง (Alias)' : 'Nickname (Alias)'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={aliasInput}
                    onChange={(e) => setAliasInput(e.target.value)}
                    placeholder={isTh ? 'ระบุนามแฝงของคุณ' : 'Enter your nickname'}
                    className="w-full bg-[#f1fbff] rounded-2xl py-3.5 px-4 text-sm text-[#001f26] border border-[#cfe7e6] outline-none focus:border-[#006a65] transition-all pr-10"
                  />
                  {aliasInput && (
                    <button
                      onClick={() => setAliasInput('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#bbc9c7] hover:text-[#6c7a78]"
                    >
                      <span className="material-symbols-outlined text-lg">cancel</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-[#6c7a78]">
                  {isTh
                    ? 'ชื่อที่จะแสดงให้ผู้อื่นเห็นในชุมชน เพื่อความปลอดภัยของข้อมูลส่วนตัว'
                    : 'Your display name for the community to protect your identity.'}
                </p>
              </div>
            </div>

            {/* การตั้งค่า AI (AI Assistant) Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 soft-shadow border border-[#cfe7e6] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#2bb8b0]"></div>
              <h3 className="text-xs font-bold text-[#2bb8b0] uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">smart_toy</span>
                <span>{isTh ? 'การตั้งค่า AI ผู้ช่วย' : 'AI Companion Settings'}</span>
              </h3>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#001f26]">
                  {isTh ? 'ชื่อ AI ของฉัน' : 'AI Assistant Name'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={aiNameInput}
                    onChange={(e) => setAiNameInput(e.target.value)}
                    placeholder="e.g. Sakina AI, Phatna Guide, Nova"
                    className="w-full bg-[#f1fbff] rounded-2xl py-3.5 px-4 text-sm text-[#001f26] border border-[#cfe7e6] outline-none focus:border-[#006a65] transition-all pr-10"
                  />
                  {aiNameInput && (
                    <button
                      onClick={() => setAiNameInput('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#bbc9c7] hover:text-[#6c7a78]"
                    >
                      <span className="material-symbols-outlined text-lg">cancel</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-[#6c7a78]">
                  {isTh
                    ? 'มอบชื่อเฉพาะให้กับผู้ช่วย AI ส่วนตัวของคุณเพื่อความเป็นกันเอง'
                    : 'Give your personalized AI companion a unique friendly name.'}
                </p>
              </div>
            </div>

            {/* ความปลอดภัย Profile Status Toggle Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 soft-shadow border border-[#cfe7e6] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#4d6262]"></div>
              <h3 className="text-xs font-bold text-[#4d6262] uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">lock</span>
                <span>{isTh ? 'ความปลอดภัย' : 'Profile Status'}</span>
              </h3>

              <div className="flex items-center justify-between p-4 bg-[#f1fbff] rounded-2xl border border-[#cfe7e6]">
                <div>
                  <span className="block text-xs md:text-sm font-bold text-[#001f26]">
                    {isTh ? 'สถานะโปรไฟล์' : 'Profile Visibility'}
                  </span>
                  <span className="text-[11px] text-[#4d6262]">
                    {isTh ? 'เลือกให้โปรไฟล์เป็นส่วนตัวหรือสาธารณะ' : 'Choose private or visible mode'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDataSharingOn}
                    onChange={(e) => setIsDataSharingOn(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#bbc9c7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a65]"></div>
                  <span className="ml-3 text-xs font-semibold text-[#006a65]">
                    {isDataSharingOn
                      ? isTh ? 'สาธารณะ' : 'Public'
                      : isTh ? 'ส่วนตัว' : 'Private'}
                  </span>
                </label>
              </div>
            </div>

            {/* Save Changes CTA Button */}
            <button
              onClick={handleSaveSettings}
              className="w-full bg-gradient-to-r from-[#006a65] to-[#2bb8b0] text-white font-semibold text-sm md:text-base py-4 rounded-full shadow-md active:scale-95 transition-all hover:opacity-95"
            >
              {isTh ? 'บันทึกการเปลี่ยนแปลง' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
