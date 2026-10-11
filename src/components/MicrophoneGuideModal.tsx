import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { voiceAssistant } from '../utils/speech';

interface MicrophoneGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onMicReady?: () => void;
}

export const MicrophoneGuideModal: React.FC<MicrophoneGuideModalProps> = ({
  isOpen,
  onClose,
  language,
  onMicReady,
}) => {
  const isTh = language === 'th';
  const [testingStatus, setTestingStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Clean up audio stream on unmount
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [audioStream]);

  if (!isOpen) return null;

  const handleTestMicrophone = async () => {
    setTestingStatus('requesting');
    setErrorMessage('');

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setTestingStatus('error');
        setErrorMessage(
          isTh
            ? 'เบราว์เซอร์ของคุณไม่รองรับการดึงสัญญาณไมโครโฟน แนะนำให้เปิดผ่าน Google Chrome หรือ Microsoft Edge'
            : 'Browser does not support getUserMedia. Please use Chrome or Edge.'
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      setTestingStatus('success');

      // Set up simple audio meter to show live volume
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkVolume = () => {
        if (stream.active) {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setVolumeLevel(Math.min(100, Math.round((avg / 128) * 100)));
          requestAnimationFrame(checkVolume);
        }
      };
      checkVolume();

      if (onMicReady) {
        onMicReady();
      }
    } catch (err: any) {
      setTestingStatus('error');
      const errName = err?.name || '';
      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        setErrorMessage(
          isTh
            ? 'สิทธิ์ถูกบล็อก: กรุณาคลิกไอคอนแม่กุญแจ 🔒 ที่แถบ URL ด้านบนของเบราว์เซอร์ แล้วเปลี่ยนการตั้งค่าไมโครโฟนเป็น "อนุญาต" (Allow)'
            : 'Permission denied: Click the lock 🔒 icon in the address bar and select Allow Microphone.'
        );
      } else if (errName === 'NotFoundError') {
        setErrorMessage(
          isTh
            ? 'ไม่พบอุปกรณ์ไมโครโฟน กรุณาเสียบสายไมโครโฟนหรือเชื่อมต่อหูฟังบลูทูธ'
            : 'No microphone found. Please connect a headset or microphone.'
        );
      } else {
        setErrorMessage(
          err?.message ||
            (isTh
              ? 'ไม่สามารถเปิดไมค์ได้ กรุณาลองเปิดใช้งานในแท็บใหม่เต็มจอ'
              : 'Could not access mic. Try opening in a new tab.')
        );
      }
    }
  };

  const handleOpenInNewTab = () => {
    // Open the current dev or shared app URL in a standalone full browser tab
    window.open(window.location.href, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-[#cfe7e6] relative animate-fade-in text-left max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#f1fbff] flex items-center justify-center text-[#6c7a78] hover:text-[#001f26] transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl material-symbols-filled">
              mic_external_off
            </span>
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-extrabold text-[#001f26]">
              {isTh ? 'วิธีเปิดใช้งานไมโครโฟน' : 'How to Enable Microphone'}
            </h3>
            <span className="text-xs text-[#6c7a78]">
              {isTh
                ? 'แก้ไขปัญหาไมโครโฟนไม่ทำงาน หรือติดสิทธิ์เบราว์เซอร์'
                : 'Fix microphone permissions and browser access'}
            </span>
          </div>
        </div>

        {/* Why this happens explanation */}
        <div className="mt-4 p-4 bg-[#f1fbff] border border-[#cfe7e6] rounded-2xl flex flex-col gap-2">
          <span className="text-xs font-bold text-[#006a65] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">help</span>
            <span>{isTh ? 'ทำไมจึงใช้ไมค์ไม่ได้ในตอนนี้?' : 'Why is the mic not working?'}</span>
          </span>
          <p className="text-xs text-[#3c4948] leading-relaxed">
            {isTh
              ? 'ระบบความปลอดภัยของเว็บเบราว์เซอร์ (Chrome, Safari, Edge) จะไม่อนุญาตให้อัดเสียงจนกว่าคุณจะกด "อนุญาต" (Allow) หรือหากเปิดผ่านหน้าต่างพรีวิว สิทธิ์ไมโครโฟนอาจถูกจำกัดไว้'
              : 'Web browsers require explicit permission to access audio for security reasons, especially within preview windows.'}
          </p>
        </div>

        {/* Live Test & Permission Action */}
        <div className="mt-5 p-4 border border-[#2bb8b0]/40 bg-white rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#001f26]">
              {isTh ? '1. ทดสอบขอสิทธิ์ไมโครโฟนทันที:' : '1. Test & Request Permission:'}
            </span>
            {testingStatus === 'success' && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">check_circle</span>
                <span>{isTh ? 'ไมค์พร้อมใช้งานแล้ว!' : 'Mic is working!'}</span>
              </span>
            )}
          </div>

          {testingStatus === 'success' ? (
            <div className="flex flex-col gap-2 bg-[#e1f7ff] p-3 rounded-xl">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#006a65] font-semibold">
                  {isTh ? 'ระดับเสียงพูดสด (ลองพูดใส่ไมค์):' : 'Live Volume Level:'}
                </span>
                <span className="font-bold text-[#006a65]">{volumeLevel}%</span>
              </div>
              {/* Volume bar */}
              <div className="w-full bg-white h-3 rounded-full overflow-hidden border border-[#bde9eb]">
                <div
                  className="bg-gradient-to-r from-[#2bb8b0] to-[#006a65] h-full transition-all duration-75"
                  style={{ width: `${Math.max(5, volumeLevel)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-[#004340] mt-1 font-medium">
                {isTh
                  ? '✨ สัญญาณเสียงเข้ามาแล้ว! คุณสามารถปิดหน้าต่างนี้แล้วกดปุ่มไมค์เพื่อคุยกับ AI ได้เลย'
                  : '✨ Sound detected! You can now use the mic with the AI.'}
              </p>
            </div>
          ) : (
            <button
              onClick={handleTestMicrophone}
              disabled={testingStatus === 'requesting'}
              className="w-full py-3 bg-[#006a65] text-white hover:bg-[#004340] active:scale-95 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <span className="material-symbols-outlined text-sm material-symbols-filled">
                mic
              </span>
              <span>
                {testingStatus === 'requesting'
                  ? isTh
                    ? 'กำลังเปิดขอสิทธิ์...'
                    : 'Requesting...'
                  : isTh
                  ? 'กดเพื่ออนุญาตสิทธิ์ไมค์ (Allow Mic)'
                  : 'Click to Grant Microphone Access'}
              </span>
            </button>
          )}

          {errorMessage && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              <p className="font-semibold">{errorMessage}</p>
            </div>
          )}
        </div>

        {/* Option 2: Open in Standalone Tab */}
        <div className="mt-4 p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
          <span className="text-xs font-bold text-amber-900 block mb-1">
            {isTh ? '2. ทางเลือกที่ได้ผล 100%: เปิดในแท็บใหม่เต็มจอ' : '2. Best Solution: Open in New Tab'}
          </span>
          <p className="text-xs text-amber-800 mb-3 leading-relaxed">
            {isTh
              ? 'การเปิดในแท็บใหม่โดยตรงจะข้ามข้อจำกัดของหน้าต่างพรีวิว ทำให้เบราว์เซอร์ถามขอสิทธิ์ไมโครโฟนได้ทันทีโดยไม่ติดขัด'
              : 'Opening in a direct browser tab removes iframe sandbox restrictions and triggers the microphone prompt immediately.'}
          </p>
          <button
            onClick={handleOpenInNewTab}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            <span>{isTh ? 'เปิดแอปในแท็บใหม่เต็มจอ' : 'Open App in New Tab'}</span>
          </button>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="mt-5 border-t border-[#cfe7e6] pt-4">
          <span className="text-xs font-bold text-[#001f26] block mb-2">
            {isTh ? 'วิธีปลดล็อกไมค์ในเบราว์เซอร์ด้วยตนเอง:' : 'Manual Browser Permission Steps:'}
          </span>
          <ol className="text-xs text-[#4d6262] space-y-2 list-decimal list-inside pl-1">
            <li>
              {isTh ? (
                <>
                  มองที่แถบที่อยู่เว็บด้านบนสุด คลิกที่ไอคอน <strong>แม่กุญแจ 🔒</strong> หรือ <strong>ไอคอนการตั้งค่าเว็บไซต์</strong>
                </>
              ) : (
                <>Click the <strong>Lock 🔒</strong> icon in your browser's address bar.</>
              )}
            </li>
            <li>
              {isTh ? (
                <>
                  หาหัวข้อ <strong>"ไมโครโฟน" (Microphone)</strong> แล้วเปลี่ยนเป็น <strong>"อนุญาต" (Allow)</strong>
                </>
              ) : (
                <>Locate <strong>Microphone</strong> and toggle it to <strong>Allow</strong>.</>
              )}
            </li>
            <li>
              {isTh ? (
                <>กด <strong>รีเฟรชหน้าเว็บ (Reload / F5)</strong> 1 ครั้งเพื่อใช้งานไมค์</>
              ) : (
                <>Refresh the page once to apply the changes.</>
              )}
            </li>
          </ol>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#f1fbff] hover:bg-[#e1f7ff] text-[#006a65] font-bold text-xs rounded-full border border-[#cfe7e6] transition-all"
          >
            {isTh ? 'เข้าใจแล้ว / ปิดหน้าต่าง' : 'Got it / Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
