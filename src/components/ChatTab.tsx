import React, { useState, useRef, useEffect } from 'react';
import { Language, ChatMessage } from '../types';
import { soothingAudio } from '../utils/audio';
import { getDirectAiResponse } from '../utils/aiService';
import { voiceAssistant } from '../utils/speech';
import { MicrophoneGuideModal } from './MicrophoneGuideModal';

interface ChatTabProps {
  language: Language;
  aiName: string;
  onUpdateAiName?: (newName: string) => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({ language, aiName, onUpdateAiName }) => {
  const isTh = language === 'th';
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'user',
      textTh: 'ฉันรู้สึกเหนื่อยล้าเกินไปในวันนี้ และยังไม่พร้อมจะเผชิญหน้ากับโลกภายนอก',
      textEn: "I'm feeling overwhelmed today, and not ready to face the world.",
      time: '10:02 AM',
    },
    {
      id: 'm-2',
      sender: 'ai',
      textTh: 'ขอความสันติจงมีแด่คุณ ฉันอยู่ที่นี่เพื่อรับฟัง โปรดจำไว้ว่า อัลลอฮ์ทรงอยู่กับผู้ที่อดทน',
      textEn: "Peace be upon you. I'm here to listen. Remember, Allah is with those who are patient.",
      time: '10:03 AM',
      healingCard: {
        id: 'hc-initial',
        category: 'quran',
        titleTh: 'การ์ดเยียวยาใจ - อายะฮ์และหะดีษ',
        titleEn: 'Healing Card - Verse & Hadith',
        arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
        referenceTh: 'سورة البقرة ٢:١٥٣ (ซูเราะฮ์ อัล-บะเกาะเราะฮ์ 2:153)',
        referenceEn: 'Surah Al-Baqarah (2:153)',
        contentTh: 'โอ้ผู้ศรัทธาทั้งหลาย จงขอความช่วยเหลือด้วยความอดทนและการละหมาด แท้จริงอัลลอฮ์ทรงอยู่ร่วมกับผู้อดทน',
        contentEn: 'O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.',
      },
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [showMicGuide, setShowMicGuide] = useState(false);
  const [tempName, setTempName] = useState(aiName);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query || isGenerating) return;

    soothingAudio.playGentleChime();

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      textTh: query,
      textEn: query,
      time: new Date().toLocaleTimeString(isTh ? 'th-TH' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsGenerating(true);
    setIsListening(false);
    setIsAiSpeaking(false);

    // Call direct AI response service (hits Gemini endpoint or contextual NLP)
    const result = await getDirectAiResponse(query, 'female', aiName, 'student');

    let card = undefined;
    const lower = query.toLowerCase();
    if (lower.includes('ดุอา') || lower.includes('dua') || lower.includes('ขอพร') || lower.includes('prayer')) {
      card = {
        id: 'card-' + Date.now(),
        category: 'dua' as const,
        titleTh: 'ดุอาอ์เพื่อความสงบและคลายกังวล',
        titleEn: 'Du’a for Inner Peace',
        arabic: 'اللَّهُمَّ رَحْمَتَكَ أَرْจُو فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
        referenceTh: 'สุนัน อบูดาวูด (Abu Dawud)',
        referenceEn: 'Sunan Abi Dawud',
        contentTh: 'โอ้อัลลอฮ์ ข้าพระองค์หวังในความเมตตาของพระองค์ ดังนั้นโปรดอย่าได้ปล่อยข้าพระองค์ให้อยู่กับตัวเองเพียงชั่วพริบตาเดียว',
        contentEn: 'O Allah, it is Your mercy that I hope for, so do not leave me in charge of my affairs even for the blink of an eye.',
      };
    } else if (lower.includes('เรียน') || lower.includes('สอบ') || lower.includes('study') || lower.includes('exam')) {
      card = {
        id: 'card-' + Date.now(),
        category: 'quran' as const,
        titleTh: 'ความง่ายดายหลังความยากลำบาก',
        titleEn: 'Ease After Hardship',
        arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا',
        referenceTh: 'ซูเราะฮ์ อัช-ชัรห์ 94:5-6',
        referenceEn: 'Surah Ash-Sharh (94:5-6)',
        contentTh: 'แท้จริงพร้อมกับความยากลำบากนั้นมีความง่ายดาย แท้จริงพร้อมกับความยากลำบากนั้นมีความง่ายดาย',
        contentEn: 'Indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.',
      };
    }

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      textTh: result.reply,
      textEn: result.reply,
      time: new Date().toLocaleTimeString(isTh ? 'th-TH' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      speechAnalysis: result.analysis,
      healingCard: card,
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsGenerating(false);
    setIsAiSpeaking(true);

    setTimeout(() => {
      setIsAiSpeaking(false);
    }, 4000);
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim() && onUpdateAiName) {
      onUpdateAiName(tempName.trim());
    }
    setShowEditName(false);
  };

  const toggleMic = () => {
    if (isListening) {
      voiceAssistant.stopListening();
      setIsListening(false);
      return;
    }

    soothingAudio.playGentleChime();
    setIsListening(true);

    voiceAssistant.listen(
      (transcript) => {
        setIsListening(false);
        handleSend(transcript);
      },
      (err) => {
        setIsListening(false);
        if (err?.type === 'not-allowed') {
          setShowMicGuide(true);
        }
      }
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full max-w-3xl mx-auto relative overflow-hidden bg-[#f1fbff]">
      {/* Context Sub-header */}
      <div className="w-full bg-[#d1f4ff] border-b border-[#cfe7e6] text-center py-2 px-4 shrink-0 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></div>
          <span className="text-xs md:text-sm font-semibold text-[#004340]">
            {isTh ? `พูดคุยกับ ${aiName}` : `Talking with ${aiName}`}
          </span>
          {onUpdateAiName && (
            <button
              onClick={() => {
                setTempName(aiName);
                setShowEditName(true);
              }}
              className="text-[11px] text-[#006a65] underline hover:opacity-80 ml-2"
            >
              ({isTh ? 'เปลี่ยนชื่อ' : 'Rename'})
            </button>
          )}
        </div>
      </div>

      {/* Edit AI Name Modal for Chat */}
      {showEditName && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#cfe7e6] text-left">
            <h4 className="font-bold text-sm text-[#001f26] mb-1">
              {isTh ? 'เปลี่ยนชื่อ AI ผู้ช่วย' : 'Change AI Name'}
            </h4>
            <p className="text-xs text-[#6c7a78] mb-3">
              {isTh ? 'ระบุชื่อที่ต้องการให้แสดงในระบบ' : 'Set preferred assistant name'}
            </p>
            <form onSubmit={handleSaveName} className="flex flex-col gap-3">
              <input
                type="text"
                required
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full bg-[#f1fbff] border border-[#cfe7e6] rounded-xl p-2.5 text-xs text-[#001f26] outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditName(false)}
                  className="flex-1 py-2 bg-[#f1fbff] text-[#4d6262] text-xs font-semibold rounded-full"
                >
                  {isTh ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#006a65] text-white text-xs font-semibold rounded-full hover:bg-[#004340]"
                >
                  {isTh ? 'บันทึก' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 flex flex-col gap-6 pb-60">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1 w-full animate-fade-in`}
            >
              {/* Message Bubble */}
              <div
                className={`rounded-2xl px-5 py-3.5 max-w-[90%] md:max-w-[85%] shadow-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#cfe7e6] text-[#091f1f] rounded-tr-xs border border-[#b4cbca]/40'
                    : 'bg-[#006a65] text-white rounded-tl-xs shadow-md'
                }`}
              >
                <p className="text-sm md:text-base font-normal">
                  {isTh ? msg.textTh : msg.textEn}
                </p>
              </div>

              {/* Speech Analysis Badge for AI message */}
              {msg.speechAnalysis && (
                <div className="max-w-[90%] md:max-w-[85%] bg-white border border-[#2bb8b0]/40 rounded-xl p-2.5 text-xs text-[#004340] shadow-xs flex flex-col gap-1">
                  <div className="flex items-center justify-between font-bold text-[11px] text-[#006a65]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">insights</span>
                      <span>{isTh ? 'วิเคราะห์การพูดและความรู้สึก:' : 'Speech & Emotion Analysis:'}</span>
                    </span>
                    <span className="bg-[#e1f7ff] text-[#006a65] px-2 py-0.5 rounded-full text-[10px]">
                      {msg.speechAnalysis.detectedMood}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#4d6262]">
                    <span className="font-semibold text-[#001f26]">{isTh ? 'ประเด็นหลัก: ' : 'Intent: '}</span>
                    {msg.speechAnalysis.detectedIntent}
                  </div>
                  {msg.speechAnalysis.encouragementFocus && (
                    <div className="text-[10px] text-[#006a65] font-medium">
                      ✨ {msg.speechAnalysis.encouragementFocus}
                    </div>
                  )}
                </div>
              )}

              {/* Timestamp & Speak Voice Button */}
              <div className={`flex items-center gap-2 ${isUser ? 'mr-1 justify-end' : 'ml-1 justify-start'}`}>
                <span className="text-[11px] text-[#6c7a78]">
                  {msg.time}
                </span>
                {!isUser && (
                  <button
                    type="button"
                    onClick={() => {
                      soothingAudio.playGentleChime();
                      voiceAssistant.speak(isTh ? msg.textTh : msg.textEn);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] text-[#006a65] hover:text-[#004340] font-semibold bg-[#e1f7ff] hover:bg-[#d1f4ff] px-2 py-0.5 rounded-full border border-[#cfe7e6] transition-colors"
                    title={isTh ? 'ฟังเสียงข้อความนี้' : 'Listen to this message'}
                  >
                    <span className="material-symbols-outlined text-xs material-symbols-filled">volume_up</span>
                    <span>{isTh ? 'ฟังเสียง' : 'Listen'}</span>
                  </button>
                )}
              </div>

              {/* Embedded Healing Card if available */}
              {msg.healingCard && (
                <div className="mt-2 w-full max-w-[92%] bg-white border border-[#2bb8b0]/40 rounded-2xl rounded-tl-xs shadow-md overflow-hidden animate-fade-in">
                  {/* Card Badge Header */}
                  <div className="bg-[#e1f7ff] px-4 py-2.5 flex items-center gap-2 border-b border-[#cfe7e6]">
                    <span className="material-symbols-outlined text-[#006a65] text-lg material-symbols-filled">
                      auto_awesome
                    </span>
                    <span className="text-xs md:text-sm font-semibold text-[#004340]">
                      {isTh ? msg.healingCard.titleTh : msg.healingCard.titleEn}
                    </span>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 flex flex-col gap-4 text-center pattern-overlay bg-[#ffffff]/90">
                    {/* Quran Verse */}
                    <div>
                      <p className="text-xs font-semibold text-[#6c7a78] mb-1.5">
                        {isTh ? msg.healingCard.referenceTh : msg.healingCard.referenceEn}
                      </p>
                      {msg.healingCard.arabic && (
                        <p
                          dir="rtl"
                          className="text-lg md:text-xl font-bold text-[#001f26] mb-3 leading-loose font-serif"
                        >
                          {msg.healingCard.arabic}
                        </p>
                      )}
                      <p className="text-sm md:text-base text-[#3c4948] leading-relaxed">
                        {isTh ? msg.healingCard.contentTh : msg.healingCard.contentEn}
                      </p>
                    </div>

                    {/* Hadith Section */}
                    <div className="w-full h-px bg-[#cfe7e6]/70 my-1"></div>

                    <div>
                      <p className="text-xs font-semibold text-[#6c7a78] mb-1">
                        صحيح البخاري (Sahih Al-Bukhari)
                      </p>
                      <p
                        dir="rtl"
                        className="text-base md:text-lg font-bold text-[#001f26] mb-2 leading-relaxed"
                      >
                        " مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلاَ وَصَبٍ... إِلَّا كَفَّرَ اللَّهُ بِهَا مِنْ خَطَايَاهُ "
                      </p>
                      <p className="text-xs md:text-sm text-[#3c4948] leading-relaxed">
                        {isTh
                          ? 'ไม่มีมุสลิมคนใดที่ประสบกับความเหน็ดเหนื่อย ความเจ็บป่วย ความวิตกกังวล ความโศกเศร้า อันตราย หรือความซึมเศร้า... เว้นแต่อัลลอฮ์จะทรงลบล้างบาปของเขาด้วยสิ่งนั้น'
                          : 'No Muslim is afflicted with distress, hardship, anxiety, sorrow, harm, or depression... but that Allah will expiate his sins.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex items-center gap-2 text-xs text-[#006a65] animate-pulse">
            <span className="material-symbols-outlined text-sm">graphic_eq</span>
            <span>{isTh ? `${aiName} กำลังคิดและเรียบเรียงคำตอบ...` : `${aiName} is thinking...`}</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Floating Voice & Input Panel matching mockups */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#f1fbff] via-[#f1fbff]/95 to-transparent pt-4 pb-20 md:pb-6 px-4 flex flex-col items-center gap-3">
        {/* Visual Speaking & Listening Indicator Badge */}
        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full shadow-sm border transition-all duration-300 ${
            isListening
              ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-rose-100'
              : isAiSpeaking
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-emerald-100'
              : isGenerating
              ? 'bg-teal-50 border-teal-300 text-teal-800'
              : 'bg-white/90 backdrop-blur-md border-[#cfe7e6] text-[#001f26]'
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              isListening
                ? 'bg-rose-500 animate-ping'
                : isAiSpeaking
                ? 'bg-emerald-500 animate-ping'
                : isGenerating
                ? 'bg-teal-500 animate-pulse'
                : 'bg-[#006a65]'
            }`}
          ></span>
          <span className="material-symbols-outlined text-sm material-symbols-filled">
            {isListening
              ? 'mic'
              : isAiSpeaking
              ? 'volume_up'
              : isGenerating
              ? 'hourglass_top'
              : 'graphic_eq'}
          </span>
          <span className="text-xs font-bold tracking-wide">
            {isListening
              ? isTh
                ? 'กำลังฟังเสียงของคุณ (พูดได้เลย)...'
                : 'Listening to your voice...'
              : isAiSpeaking
              ? isTh
                ? `${aiName} กำลังพูดตอบกลับ...`
                : `${aiName} is speaking...`
              : isGenerating
              ? isTh
                ? `${aiName} กำลังวิเคราะห์และเรียบเรียงคำตอบ...`
                : `${aiName} is formulating response...`
              : isTh
              ? `${aiName} พร้อมรับฟังเสมอ`
              : `${aiName} is ready to listen`}
          </span>
        </div>

        {/* Dynamic Multi-Frequency Waveform Visualization */}
        <div className="flex items-center justify-center gap-1.5 h-9 px-4 py-1.5 bg-white/80 rounded-full border border-[#cfe7e6]/70 shadow-2xs">
          {[12, 20, 28, 34, 26, 18, 14, 24, 32, 22, 16, 10].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isListening
                  ? 'bg-rose-500 wave-bar'
                  : isAiSpeaking
                  ? 'bg-[#006a65] wave-bar'
                  : isGenerating
                  ? 'bg-[#2bb8b0] wave-bar'
                  : 'bg-[#cfe7e6] h-1.5'
              }`}
              style={{
                height: isListening || isAiSpeaking || isGenerating ? `${h}px` : '6px',
                animationDelay: `${i * -0.12}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar max-w-full py-1">
          {[
            { th: '🌸 วันนี้รู้สึกเหนื่อยจัง', en: '🌸 Feeling overwhelmed today' },
            { th: '🤲 ขอดุอาอ์ให้สบายใจหน่อย', en: '🤲 Please share a du’a for peace' },
            { th: '📚 เครียดเรื่องเรียนมาก', en: '📚 Stressed about studies' },
            { th: '🌿 อยากหาข้อคิดพักใจ', en: '🌿 Need words of solace' },
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(isTh ? prompt.th : prompt.en)}
              className="shrink-0 text-xs bg-white text-[#006a65] border border-[#cfe7e6] hover:bg-[#e1f7ff] px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-2xs"
            >
              {isTh ? prompt.th : prompt.en}
            </button>
          ))}
        </div>

        {/* Text Input Row + Voice Base */}
        <div className="w-full max-w-xl flex items-center gap-2 bg-white rounded-2xl p-1.5 shadow-md border border-[#cfe7e6]">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              isTh ? `พิมพ์ข้อความเพื่อคุยกับ ${aiName}...` : `Type to talk with ${aiName}...`
            }
            className="flex-1 bg-transparent px-3 py-2 text-sm text-[#001f26] outline-none"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputVal.trim() || isGenerating}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              inputVal.trim() && !isGenerating
                ? 'bg-[#006a65] text-white hover:bg-[#004340] active:scale-90'
                : 'text-[#bbc9c7] cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-lg">send</span>
          </button>

          <button
            onClick={toggleMic}
            title={isListening ? 'หยุดบันทึกเสียง' : 'เริ่มบันทึกเสียง'}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
              isListening
                ? 'bg-[#ba1a1a] text-white mic-pulse'
                : 'bg-[#2bb8b0] text-white hover:bg-[#006a65]'
            }`}
          >
            <span className="material-symbols-outlined text-xl material-symbols-filled">
              {isListening ? 'mic' : 'mic_none'}
            </span>
          </button>
        </div>

        <p className="text-[11px] text-[#6c7a78]">
          {isListening
            ? isTh
              ? 'แตะปุ่มไมค์เพื่อหยุดบันทึก'
              : 'Tap mic button to stop recording'
            : isTh
            ? 'แตะปุ่มไมค์เพื่อเริ่มพูดคุยด้วยเสียง'
            : 'Tap mic button to start voice chat'}
        </p>
      </div>

      {/* Microphone Guide Modal */}
      <MicrophoneGuideModal
        isOpen={showMicGuide}
        onClose={() => setShowMicGuide(false)}
        language={language}
      />
    </div>
  );
};
