import React from 'react';
import { Language } from '../types';
import { SAFE_POINTS } from '../data/mockData';
import { soothingAudio } from '../utils/audio';

interface SafePointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectSafePoint: (pointName: string) => void;
}

export const SafePointsModal: React.FC<SafePointsModalProps> = ({
  isOpen,
  onClose,
  language,
  onSelectSafePoint,
}) => {
  const isTh = language === 'th';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#091e42]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-blue-800 text-2xl material-symbols-filled">
            location_on
          </span>
          <h2 className="text-xl font-bold text-blue-950">
            {isTh ? 'จุดปลอดภัยในโรงเรียน (Safe Points)' : 'Campus Safe Points'}
          </h2>
        </div>

        <p className="text-xs md:text-sm text-slate-600 mb-5">
          {isTh
            ? 'พื้นที่สงบเงียบ ปลอดภัย ได้รับการดูแลจากอาจารย์และบุคลากร พร้อมให้คุณเข้าไปพักผ่อนหรือขอความช่วยเหลือได้ทันที'
            : 'Designated sanctuaries across the school campus where you can find rest, safety, and friendly counseling.'}
        </p>

        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {SAFE_POINTS.map((sp) => (
            <div
              key={sp.id}
              className="bg-blue-50/40 rounded-2xl p-4 border border-blue-100 flex flex-col gap-2 hover:border-blue-500/60 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-800 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">{sp.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs md:text-sm text-[#091e42]">
                      {isTh ? sp.nameTh : sp.nameEn}
                    </h4>
                    <span className="text-[11px] text-blue-800 font-semibold">
                      {isTh ? sp.locationTh : sp.locationEn}
                    </span>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {isTh ? sp.status : 'Open'}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                {isTh ? sp.descriptionTh : sp.descriptionEn}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-[10px] text-slate-500">
                  {isTh ? `ครูผู้ดูแล: ${sp.staffTh}` : `Staff: ${sp.staffEn}`}
                </span>
                <button
                  onClick={() => {
                    soothingAudio.playGentleChime();
                    onSelectSafePoint(isTh ? sp.nameTh : sp.nameEn);
                    onClose();
                  }}
                  className="bg-blue-800 text-white px-3.5 py-1 rounded-full text-[11px] font-semibold hover:bg-blue-900 active:scale-95 cursor-pointer shadow-2xs"
                >
                  {isTh ? 'แจ้งไปยังจุดนี้' : 'Request Here'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
