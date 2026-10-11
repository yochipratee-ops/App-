import React, { useEffect, useState } from 'react';
import { Language } from '../types';

export type VoiceState = 'idle' | 'listening' | 'generating' | 'speaking';

interface VisualWaveformProps {
  state: VoiceState;
  aiName: string;
  language: Language;
  onStopSpeaking?: () => void;
}

export const VisualWaveform: React.FC<VisualWaveformProps> = ({
  state,
  aiName,
  language,
  onStopSpeaking,
}) => {
  const isTh = language === 'th';
  // Dynamic simulated frequency amplitudes for visual organic bounce
  const [frequencies, setFrequencies] = useState<number[]>([
    12, 18, 26, 38, 48, 56, 42, 32, 22, 16, 28, 44, 52, 36, 20, 14,
  ]);

  useEffect(() => {
    if (state === 'idle') {
      setFrequencies([8, 10, 12, 14, 16, 14, 12, 10, 8, 10, 12, 14, 12, 10, 8, 6]);
      return;
    }

    // Organic animation intervals
    const interval = setInterval(() => {
      setFrequencies((prev) =>
        prev.map((_, i) => {
          if (state === 'listening') {
            // High energetic fluctuations when user talks
            const base = 20 + Math.sin(Date.now() / 150 + i * 0.6) * 15;
            return Math.max(10, Math.min(64, Math.round(base + Math.random() * 25)));
          }
          if (state === 'speaking') {
            // Rhythmic speech cadence for AI
            const base = 25 + Math.cos(Date.now() / 200 + i * 0.45) * 18;
            return Math.max(12, Math.min(60, Math.round(base + Math.random() * 20)));
          }
          if (state === 'generating') {
            // Wave rolling effect
            const wave = Math.sin(Date.now() / 250 + i * 0.4) * 16 + 24;
            return Math.round(wave);
          }
          return 10;
        })
      );
    }, 85);

    return () => clearInterval(interval);
  }, [state]);

  const getStateConfig = () => {
    switch (state) {
      case 'listening':
        return {
          labelTh: 'กำลังฟังเสียงของคุณ (พูดได้เลย)...',
          labelEn: 'Listening to your voice...',
          badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
          dotColor: 'bg-rose-500 animate-ping',
          icon: 'mic',
          barColor: 'bg-gradient-to-t from-rose-600 via-rose-500 to-amber-400',
          glowClass: 'voice-listen-glow border-rose-300',
        };
      case 'generating':
        return {
          labelTh: 'กำลังวิเคราะห์คำพูดและประมวลผล...',
          labelEn: 'Analyzing speech & emotions...',
          badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
          dotColor: 'bg-teal-500 animate-pulse',
          icon: 'hourglass_top',
          barColor: 'bg-gradient-to-t from-[#006a65] to-[#2bb8b0]',
          glowClass: 'border-teal-300 shadow-sm',
        };
      case 'speaking':
        return {
          labelTh: `กำลังพูดตอบกลับ: "${aiName}"`,
          labelEn: `${aiName} is speaking out loud...`,
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dotColor: 'bg-emerald-500 animate-ping',
          icon: 'volume_up',
          barColor: 'bg-gradient-to-t from-[#006a65] via-[#2bb8b0] to-[#78f3eb]',
          glowClass: 'voice-speak-glow border-emerald-300',
        };
      default:
        return {
          labelTh: `ผู้ช่วย "${aiName}" พร้อมรับฟังเสมอ`,
          labelEn: `Assistant "${aiName}" is ready`,
          badgeColor: 'bg-[#f1fbff] text-[#4d6262] border-[#cfe7e6]',
          dotColor: 'bg-[#2bb8b0]',
          icon: 'graphic_eq',
          barColor: 'bg-[#cfe7e6]',
          glowClass: 'border-[#cfe7e6]',
        };
    }
  };

  const config = getStateConfig();

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3.5 my-2">
      {/* State Status Badge */}
      <div
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 shadow-xs ${config.badgeColor}`}
      >
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${config.dotColor}`}></span>
        <span className="material-symbols-outlined text-sm shrink-0 material-symbols-filled">
          {config.icon}
        </span>
        <span className="tracking-wide">
          {isTh ? config.labelTh : config.labelEn}
        </span>
        {state === 'speaking' && onStopSpeaking && (
          <button
            onClick={onStopSpeaking}
            className="ml-2 text-[10px] bg-rose-600 hover:bg-rose-700 text-white px-2 py-0.5 rounded-full font-semibold transition-all active:scale-95"
          >
            {isTh ? 'หยุดเสียง' : 'Stop'}
          </button>
        )}
      </div>

      {/* Visual Waveform Frequency Equalizer Canvas */}
      <div
        className={`w-full max-w-md h-20 px-6 py-3 bg-white/95 backdrop-blur-md rounded-2xl border flex items-center justify-center gap-1.5 transition-all duration-300 ${config.glowClass}`}
      >
        {frequencies.map((height, i) => (
          <div
            key={i}
            className="flex-1 flex items-center justify-center h-full max-w-[12px]"
          >
            <div
              className={`w-full rounded-full transition-all duration-100 ${config.barColor} ${
                state !== 'idle' ? 'shadow-2xs' : ''
              }`}
              style={{
                height: `${Math.max(6, height)}px`,
                opacity: state === 'idle' ? 0.6 : 0.95,
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Auxiliary State Feedback Line */}
      <div className="flex items-center gap-3 text-[11px] font-semibold text-[#6c7a78]">
        {state === 'listening' && (
          <span className="text-rose-600 flex items-center gap-1 animate-pulse">
            <span className="material-symbols-outlined text-xs">hearing</span>
            <span>{isTh ? 'กำลังตรวจจับคลื่นเสียงของคุณ...' : 'Capturing audio stream...'}</span>
          </span>
        )}
        {state === 'generating' && (
          <span className="text-teal-700 flex items-center gap-1 animate-pulse">
            <span className="material-symbols-outlined text-xs">auto_awesome</span>
            <span>{isTh ? 'ประมวลผลอารมณ์และคำตอบที่ตรงประเด็น...' : 'Formulating on-point reply...'}</span>
          </span>
        )}
        {state === 'speaking' && (
          <span className="text-emerald-700 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">record_voice_over</span>
            <span>{isTh ? 'กำลังส่งเสียงผ่านลำโพงของเครื่องคุณ...' : 'Broadcasting audio reply...'}</span>
          </span>
        )}
        {state === 'idle' && (
          <span className="text-[#6c7a78] flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">mic</span>
            <span>{isTh ? 'แตะปุ่มไมค์ด้านล่างเพื่อเริ่มพูด' : 'Tap mic button below to talk'}</span>
          </span>
        )}
      </div>
    </div>
  );
};
