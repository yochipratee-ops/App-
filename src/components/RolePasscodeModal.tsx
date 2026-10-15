import React, { useState } from 'react';
import { AppRole, Language } from '../types';
import { soothingAudio } from '../utils/audio';

interface RolePasscodeModalProps {
  isOpen: boolean;
  targetRole: AppRole | null;
  language: Language;
  onSuccess: (role: AppRole) => void;
  onCancel: () => void;
}

const ROLE_PASSCODES: Record<AppRole, string> = {
  teacher: '1234',
  council: '2345',
  parent: '3456',
  student: '0000',
};

export const RolePasscodeModal: React.FC<RolePasscodeModalProps> = ({
  isOpen,
  targetRole,
  language,
  onSuccess,
  onCancel,
}) => {
  const isTh = language === 'th';
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen || !targetRole || targetRole === 'student') return null;

  const roleConfig: Record<
    AppRole,
    {
      titleTh: string;
      titleEn: string;
      descTh: string;
      descEn: string;
      icon: string;
      badgeTh: string;
      badgeEn: string;
      color: string;
      demoPin: string;
    }
  > = {
    teacher: {
      titleTh: 'เข้าสู่โหมดอาจารย์และฝ่ายแนะแนว',
      titleEn: 'Faculty & Counselor Portal Access',
      descTh:
        'พื้นที่เฉพาะสำหรับอาจารย์ ที่ปรึกษา และนักจิตวิทยาโรงเรียน ในการติดตามดูแลสถิติสุขภาพจิตและการนัดหมายให้คำปรึกษา',
      descEn:
        'Restricted area for faculty advisors and counselors to review student wellbeing analytics and confidential requests.',
      icon: 'supervisor_account',
      badgeTh: 'อาจารย์ / ผู้ให้คำปรึกษา',
      badgeEn: 'Faculty / Counselor',
      color: 'bg-emerald-600',
      demoPin: '1234',
    },
    council: {
      titleTh: 'เข้าสู่โหมดสภานักเรียน',
      titleEn: 'Student Council Portal Access',
      descTh:
        'ศูนย์กลางการประสานงานกิจกรรมเพื่อนช่วยเพื่อน (Peer Support) และเฝ้าระวังจุดปลอดภัยร่วมกับโรงเรียน',
      descEn:
        'Coordination hub for student council leaders, peer support monitoring, and safe point readiness.',
      icon: 'account_balance',
      badgeTh: 'คณะกรรมการสภานักเรียน',
      badgeEn: 'Student Council Board',
      color: 'bg-indigo-600',
      demoPin: '2345',
    },
    parent: {
      titleTh: 'เข้าสู่โหมดผู้ปกครอง',
      titleEn: 'Parent & Guardian Portal Access',
      descTh:
        'ระบบติดตามภาพรวมความสุข สุขภาวะ และคำแนะนำการสื่อสารสร้างพลังบวกกับบุตรหลานที่บ้าน',
      descEn:
        'Portal for parents to observe wellbeing overview, attendance safety, and positive communication tips.',
      icon: 'family_restroom',
      badgeTh: 'ผู้ปกครองนักเรียน',
      badgeEn: 'Parent / Guardian',
      color: 'bg-amber-600',
      demoPin: '3456',
    },
    student: {
      titleTh: 'โหมดนักเรียน',
      titleEn: 'Student Mode',
      descTh: 'เข้าถึงพื้นที่ส่วนตัวของนักเรียน',
      descEn: 'Access student personal space',
      icon: 'school',
      badgeTh: 'นักเรียน',
      badgeEn: 'Student',
      color: 'bg-teal-600',
      demoPin: '0000',
    },
  };

  const currentConfig = roleConfig[targetRole];
  const requiredPin = ROLE_PASSCODES[targetRole];

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (passcode.trim() === requiredPin) {
      setIsVerifying(true);
      soothingAudio.playGentleChime();
      setTimeout(() => {
        setIsVerifying(false);
        setPasscode('');
        onSuccess(targetRole);
      }, 350);
    } else {
      soothingAudio.playDeepComfortChime();
      setErrorMsg(
        isTh
          ? `รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง (รหัสสาธิต: ${requiredPin})`
          : `Invalid access code. Please try again (Demo PIN: ${requiredPin})`
      );
    }
  };

  const handleUseDemoPin = () => {
    setPasscode(requiredPin);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-[#cfe7e6] overflow-hidden flex flex-col">
        {/* Academic Header Banner */}
        <div className="bg-[#004d47] text-white p-5 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                <span className="material-symbols-outlined text-2xl material-symbols-filled">
                  {currentConfig.icon}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/20 text-[#a5f3ed]">
                  {isTh ? currentConfig.badgeTh : currentConfig.badgeEn}
                </span>
                <h3 className="text-base font-extrabold text-white mt-1">
                  {isTh ? currentConfig.titleTh : currentConfig.titleEn}
                </h3>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-4">
          <div className="bg-[#f0fbfb] p-3.5 rounded-2xl border border-[#cfe7e6]">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#006a65] text-xl shrink-0 mt-0.5">
                lock
              </span>
              <p className="text-xs text-[#2c3d3c] leading-relaxed">
                {isTh ? currentConfig.descTh : currentConfig.descEn}
              </p>
            </div>
          </div>

          {/* Quick Demo Fill Helper */}
          <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-700 text-lg">
                key
              </span>
              <div className="text-xs text-amber-900 font-medium">
                <span className="font-bold">{isTh ? 'รหัสสาธิต: ' : 'Demo Code: '}</span>
                <span className="font-mono font-bold tracking-widest bg-amber-200/80 px-2 py-0.5 rounded text-amber-950">
                  {requiredPin}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleUseDemoPin}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 underline px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 transition-colors"
            >
              {isTh ? 'ใส่รหัสให้อัตโนมัติ' : 'Fill code'}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleVerify} className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-bold text-[#004d47] block mb-1.5">
                {isTh ? 'กรุณากรอกรหัสผ่านเพื่อเข้าใช้งาน:' : 'Enter Access Code / PIN:'}
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  autoFocus
                  placeholder={isTh ? 'เช่น 1234' : 'e.g. 1234'}
                  className="w-full px-4 py-3 bg-[#f1fbff] rounded-2xl border border-[#cfe7e6] focus:border-[#006a65] focus:ring-2 focus:ring-[#006a65]/20 text-center font-mono text-lg tracking-widest text-[#001f26] outline-none transition-all placeholder:tracking-normal placeholder:font-body placeholder:text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c7a78] hover:text-[#004d47] p-1"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPasscode ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

              {errorMsg && (
                <p className="text-xs font-medium text-red-600 mt-2 flex items-center gap-1.5 animate-shake">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{errorMsg}</span>
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 mt-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-full text-xs font-bold text-[#4d6262] hover:bg-[#f1fbff] border border-[#cfe7e6] transition-all"
              >
                {isTh ? 'ยกเลิก / อยู่โหมดเดิม' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isVerifying || !passcode.trim()}
                className="px-6 py-2.5 rounded-full bg-[#006a65] hover:bg-[#004d47] disabled:bg-[#cfe7e6] text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                {isVerifying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isTh ? 'กำลังยืนยัน...' : 'Verifying...'}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    <span>{isTh ? 'ยืนยันรหัสผ่าน' : 'Verify & Enter'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
