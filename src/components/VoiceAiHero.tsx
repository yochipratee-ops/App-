import React, { useState, useEffect } from 'react';
import { Language, VoiceGender, SpeechAnalysis } from '../types';
import { voiceAssistant } from '../utils/speech';
import { soothingAudio } from '../utils/audio';
import { getDirectAiResponse } from '../utils/aiService';
import { MicrophoneGuideModal } from './MicrophoneGuideModal';
import { VisualWaveform, VoiceState } from './VisualWaveform';

interface VoiceAiHeroProps {
  language: Language;
  currentGender: VoiceGender;
  onGenderChange: (gender: VoiceGender) => void;
  aiName: string;
  onUpdateAiName: (newName: string) => void;
  onNavigateToChat: () => void;
}

export const VoiceAiHero: React.FC<VoiceAiHeroProps> = ({
  language,
  currentGender,
  onGenderChange,
  aiName,
  onUpdateAiName,
  onNavigateToChat,
}) => {
  const isTh = language === 'th';
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [typedInput, setTypedInput] = useState<string>('');
  const [speechAnalysis, setSpeechAnalysis] = useState<SpeechAnalysis | null>(null);
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const [isMicGuideOpen, setIsMicGuideOpen] = useState<boolean>(false);
  const [isContinuousMode, setIsContinuousMode] = useState<boolean>(true);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState<boolean>(true);

  const [aiResponse, setAiResponse] = useState<string>(
    isTh
      ? `สวัสดีค่ะ ฉันชื่อ "${aiName}" เพื่อนคู่คิดที่พร้อมรับฟังและตอบตรงประเด็นทุกความรู้สึก แตะปุ่มไมค์เพื่อเริ่มพูดคุย หรือพิมพ์ความรู้สึกลงในช่องได้เลยค่ะ`
      : `Hello, I am "${aiName}". I am here to listen and respond directly to your feelings. Tap the mic or type below.`
  );
  const [hasUserSpoken, setHasUserSpoken] = useState(false);

  // Edit AI Name modal state
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempNameInput, setTempNameInput] = useState(aiName);

  const speakCurrentResponse = (textToSpeak?: string) => {
    const text = textToSpeak || aiResponse;
    if (!text) return;
    soothingAudio.playGentleChime();
    voiceAssistant.speak(
      text,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  useEffect(() => {
    voiceAssistant.setGender(currentGender);
    voiceAssistant.setLanguage(language);
  }, [currentGender, language]);

  useEffect(() => {
    setTempNameInput(aiName);
  }, [aiName]);

  const handleGenderToggle = (newGender: VoiceGender) => {
    onGenderChange(newGender);
    voiceAssistant.setGender(newGender);
    soothingAudio.playGentleChime();

    const greet =
      newGender === 'female'
        ? isTh
          ? `สวัสดีค่ะ ฉันชื่อ "${aiName}" พร้อมรับฟัง วิเคราะห์ความรู้สึก และตอบตรงประเด็นด้วยความอบอุ่นค่ะ`
          : `Hello, I am "${aiName}". I am ready to converse and provide warm guidance.`
        : isTh
        ? `สวัสดีครับ ผมชื่อ "${aiName}" พร้อมรับฟัง วิเคราะห์ความรู้สึก และตอบตรงประเด็นด้วยความสุขุมและเป็นกำลังใจให้ครับ`
        : `Hello, I am "${aiName}". I am here to give direct and steadfast guidance.`;

    setAiResponse(greet);
    voiceAssistant.speak(
      greet,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleSaveAiName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = tempNameInput.trim();
    if (!trimmed) return;

    onUpdateAiName(trimmed);
    setIsEditingName(false);
    soothingAudio.playGentleChime();

    const ack = isTh
      ? currentGender === 'female'
        ? `เปลี่ยนชื่อผู้ช่วยเป็น "${trimmed}" เรียบร้อยแล้วค่ะ ฉันชื่อ "${trimmed}" พร้อมรับฟังและอยู่เคียงข้างคุณเสมอนะคะ`
        : `เปลี่ยนชื่อผู้ช่วยเป็น "${trimmed}" เรียบร้อยแล้วครับ ผมชื่อ "${trimmed}" พร้อมรับฟังและอยู่เคียงข้างคุณเสมอครับ`
      : `My name has been set to "${trimmed}". I am ready to converse with you.`;

    setAiResponse(ack);
    voiceAssistant.speak(
      ack,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const processInput = async (userInput: string) => {
    const clean = userInput.trim();
    if (!clean) return;

    setLiveTranscript(clean);
    setHasUserSpoken(true);
    setIsListening(false);
    setIsGenerating(true);
    setMicNotice(null);
    soothingAudio.playGentleChime();

    // Call service that performs real emotion/intent analysis & returns on-point reply
    const result = await getDirectAiResponse(clean, currentGender, aiName, 'student');
    setIsGenerating(false);
    setAiResponse(result.reply);
    setSpeechAnalysis(result.analysis);

    // Speak response out loud automatically via Web Speech API
    voiceAssistant.speak(
      result.reply,
      () => setIsSpeaking(true),
      () => {
        setIsSpeaking(false);
        if (isContinuousMode) {
          // Continuous Hands-Free Dialogue Loop: Resume listening for user's reply
          setTimeout(() => {
            handleStartVoice();
          }, 750);
        }
      }
    );
  };

  const handleStartVoice = () => {
    if (isSpeaking) {
      voiceAssistant.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    if (isListening) {
      voiceAssistant.stopListening();
      setIsListening(false);
      return;
    }

    soothingAudio.playGentleChime();
    setIsListening(true);
    setMicNotice(null);
    setLiveTranscript(
      isTh ? 'กำลังฟังเสียงของคุณ (พูดสิ่งที่คุณคิดหรือถามได้เลย)...' : 'Listening to your voice...'
    );

    voiceAssistant.listen(
      (transcript) => {
        processInput(transcript);
      },
      (err) => {
        setIsListening(false);
        const errorText = err?.message || (
          isTh
            ? 'ไมโครโฟนถูกปิดกั้นหรือยังไม่ได้รับอนุญาตในเบราว์เซอร์'
            : 'Microphone permission is blocked or not granted.'
        );
        setMicNotice(errorText);
        // Automatically open guidance modal if permission was denied
        if (err?.type === 'not-allowed') {
          setIsMicGuideOpen(true);
        }
      }
    );
  };

  const handleSubmitTyped = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim() || isGenerating) return;
    const toSend = typedInput.trim();
    setTypedInput('');
    processInput(toSend);
  };

  return (
    <section className="w-full bg-gradient-to-b from-white via-blue-50/30 to-white rounded-3xl p-6 md:p-8 border border-slate-200 soft-shadow relative overflow-hidden">
      {/* Background Institutional Pattern */}
      <div className="pattern-overlay absolute inset-0 opacity-15 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        {/* Top Header: Badge, Gender Toggle, and Edit AI Name */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
            <span className="text-xs font-bold text-blue-900 tracking-wide uppercase">
              {isTh ? 'AI สนทนาเสียงโต้ตอบตรงประเด็น (Two-Way Voice AI)' : 'Direct Voice AI Assistant'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Edit AI Name Button */}
            <button
              onClick={() => setIsEditingName(true)}
              title={isTh ? 'เปลี่ยนชื่อ AI' : 'Change AI Name'}
              className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-blue-50 text-blue-900 border border-slate-200 rounded-full text-xs font-bold transition-all shadow-2xs active:scale-95"
            >
              <span className="material-symbols-outlined text-sm text-blue-700">edit</span>
              <span>{isTh ? `เปลี่ยนชื่อ AI (${aiName})` : `Edit Name (${aiName})`}</span>
            </button>

            {/* Hands-Free Continuous Voice Dialogue Toggle */}
            <button
              onClick={() => {
                setIsContinuousMode(!isContinuousMode);
                soothingAudio.playGentleChime();
              }}
              title={isTh ? 'โหมดคุยโต้ตอบต่อเนื่องอัตโนมัติ (Hands-Free)' : 'Continuous Dialogue Mode'}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all border shadow-2xs active:scale-95 ${
                isContinuousMode
                  ? 'bg-blue-800 text-white border-blue-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-blue-50'
              }`}
            >
              <span className={`material-symbols-outlined text-sm ${isContinuousMode ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isTh ? 'โต้ตอบต่อเนื่อง' : 'Hands-Free'}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isContinuousMode ? 'bg-blue-300' : 'bg-gray-300'}`}></span>
            </button>

            {/* Voice Gender Switcher */}
            <div className="bg-blue-50 p-0.5 rounded-full flex items-center border border-blue-200 shadow-xs">
              <button
                onClick={() => handleGenderToggle('female')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  currentGender === 'female'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-blue-900 hover:bg-blue-100'
                }`}
              >
                <span className="material-symbols-outlined text-sm material-symbols-filled">female</span>
                <span>{isTh ? 'เสียงหญิง' : 'Female'}</span>
              </button>
              <button
                onClick={() => handleGenderToggle('male')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  currentGender === 'male'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-blue-900 hover:bg-blue-100'
                }`}
              >
                <span className="material-symbols-outlined text-sm material-symbols-filled">male</span>
                <span>{isTh ? 'เสียงชาย' : 'Male'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Persona Title with Direct Editable Badge */}
        <div className="flex items-center justify-center gap-2 mb-1 flex-wrap">
          <h3 className="text-xl md:text-2xl font-extrabold text-[#091e42]">
            {isTh ? `สนทนากับ "${aiName}"` : `Converse with "${aiName}"`}
          </h3>
          <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            {currentGender === 'female' ? (isTh ? 'เสียงหญิง' : 'Female Voice') : (isTh ? 'เสียงชาย' : 'Male Voice')}
          </span>
          <button
            onClick={() => setIsEditingName(true)}
            className="text-xs text-blue-700 hover:underline font-semibold flex items-center gap-0.5"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            <span>{isTh ? 'แก้ไขชื่อ' : 'Rename'}</span>
          </button>
        </div>

        <p className="text-xs md:text-sm text-slate-600 mb-5">
          {isTh
            ? 'วิเคราะห์คำพูดของคุณอย่างแท้จริง ไม่ตอบนอกประเด็น พร้อมให้กำลังใจและชวนมองอนาคตไปด้วยกัน'
            : 'Analyzes your true speech intent, answers directly to the point, and offers genuine empathy.'}
        </p>

        {/* Central Voice Visualizer & Speaking Indicator */}
        <div className="w-full flex flex-col items-center justify-center my-2 gap-4">
          {/* Dynamic Visual Waveform & Speaking Status */}
          <VisualWaveform
            state={
              isListening
                ? 'listening'
                : isGenerating
                ? 'generating'
                : isSpeaking
                ? 'speaking'
                : 'idle'
            }
            aiName={aiName}
            language={language}
            onStopSpeaking={() => {
              voiceAssistant.stopSpeaking();
              setIsSpeaking(false);
            }}
          />

          {/* Big Tap-to-Talk Mic Button with Soundwave Rings */}
          <div className="relative flex items-center justify-center">
            {/* Ambient Concentric Rings when Active */}
            {isListening && (
              <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping pointer-events-none scale-150"></div>
            )}
            {isSpeaking && (
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping pointer-events-none scale-150"></div>
            )}

            <button
              onClick={handleStartVoice}
              className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center shadow-xl transition-all active:scale-90 border-4 relative z-10 cursor-pointer ${
                isListening
                  ? 'bg-red-600 border-rose-200 text-white voice-listen-glow'
                  : isSpeaking
                  ? 'bg-blue-700 border-blue-400 text-white voice-speak-glow'
                  : isGenerating
                  ? 'bg-slate-600 border-white text-white animate-pulse'
                  : 'bg-blue-800 border-blue-400/40 text-white hover:bg-blue-900 hover:scale-105 shadow-md'
              }`}
            >
              <span className="material-symbols-outlined text-3xl md:text-4xl material-symbols-filled">
                {isListening ? 'mic' : isSpeaking ? 'volume_up' : isGenerating ? 'hourglass_top' : 'mic_none'}
              </span>
              <span className="text-[10px] font-bold mt-1 tracking-tight">
                {isListening
                  ? (isTh ? 'กำลังฟัง...' : 'Listening...')
                  : isSpeaking
                  ? (isTh ? 'กำลังพูด...' : 'Speaking...')
                  : isGenerating
                  ? (isTh ? 'กำลังคิด...' : 'Thinking...')
                  : (isTh ? 'แตะเพื่อพูด' : 'Tap to Talk')}
              </span>
            </button>
          </div>
        </div>

        {/* Mic notice if error */}
        {micNotice ? (
          <div className="w-full mt-3 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-left shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-amber-700 shrink-0">
                mic_off
              </span>
              <span className="font-medium">{micNotice}</span>
            </div>
            <button
              onClick={() => setIsMicGuideOpen(true)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-bold text-xs shrink-0 transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">build</span>
              <span>{isTh ? 'วิธีเปิดใช้งานไมค์' : 'Fix Microphone'}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsMicGuideOpen(true)}
            className="mt-2 text-[11px] text-blue-700 hover:underline font-semibold flex items-center gap-1 opacity-80 hover:opacity-100 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">settings_voice</span>
            <span>{isTh ? 'มีปัญหาไมโครโฟน? กดดูวิธีเปิดไมค์ / ทดสอบเสียง' : 'Mic issues? Click for setup guide'}</span>
          </button>
        )}

        {/* Live Speech Recognition & Analysis Display */}
        <div className="w-full mt-4 bg-white rounded-2xl p-4 md:p-5 border border-slate-200 text-left shadow-xs">
          {hasUserSpoken && (
            <div className="mb-3 pb-3 border-b border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                {isTh ? 'สิ่งที่คุณพูด (สิ่งที่ส่งให้ AI วิเคราะห์):' : 'What you said:'}
              </span>
              <p className="text-sm font-semibold text-[#091e42]">
                "{liveTranscript}"
              </p>

              {/* REAL-TIME SPEECH & EMOTION ANALYSIS CARD */}
              {speechAnalysis && (
                <div className="mt-2.5 p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm material-symbols-filled">insights</span>
                      <span>{isTh ? 'การวิเคราะห์การพูดและความรู้สึกของผู้ใช้:' : 'Speech & Emotion Analysis:'}</span>
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      speechAnalysis.energyLevel === 'low'
                        ? 'bg-rose-100 text-rose-700'
                        : speechAnalysis.energyLevel === 'high'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isTh
                        ? `ระดับพลังใจ: ${speechAnalysis.energyLevel === 'low' ? 'ต้องการเติมพลัง' : speechAnalysis.energyLevel === 'high' ? 'มีพลังบวก' : 'ปานกลาง'}`
                        : `Energy: ${speechAnalysis.energyLevel}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block font-medium">
                        {isTh ? 'สภาวะอารมณ์ที่ตรวจพบ:' : 'Detected Mood:'}
                      </span>
                      <span className="font-semibold text-[#091e42]">
                        {speechAnalysis.detectedMood}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block font-medium">
                        {isTh ? 'เจตนา / ประเด็นหลัก:' : 'Core Intent:'}
                      </span>
                      <span className="font-semibold text-[#091e42]">
                        {speechAnalysis.detectedIntent}
                      </span>
                    </div>
                  </div>

                  {speechAnalysis.encouragementFocus && (
                    <div className="pt-1 border-t border-blue-200/60 text-[11px] text-blue-800 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">emoji_objects</span>
                      <span>{isTh ? `แนวทางเยียวยา: ${speechAnalysis.encouragementFocus}` : `Focus: ${speechAnalysis.encouragementFocus}`}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* AI Verbal Response */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold text-blue-900 uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm material-symbols-filled">
                  record_voice_over
                </span>
                <span>{aiName} {isTh ? 'ตอบตรงประเด็น:' : 'Response:'}</span>
              </span>

              {/* Spoken Response Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakCurrentResponse()}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer ${
                    isSpeaking
                      ? 'bg-blue-600 text-white animate-pulse'
                      : 'bg-blue-800 hover:bg-blue-900 text-white'
                  }`}
                  title={isTh ? 'ฟังเสียง AI อ่านคำตอบนี้' : 'Listen to AI voice reply'}
                >
                  <span className="material-symbols-outlined text-sm material-symbols-filled">
                    {isSpeaking ? 'volume_up' : 'play_arrow'}
                  </span>
                  <span>
                    {isSpeaking
                      ? (isTh ? 'กำลังเปล่งเสียง...' : 'Speaking...')
                      : (isTh ? 'ฟังเสียง AI ตอบ' : 'Hear Voice')}
                  </span>
                </button>

                {isSpeaking && (
                  <button
                    type="button"
                    onClick={() => {
                      voiceAssistant.stopSpeaking();
                      setIsSpeaking(false);
                    }}
                    className="text-[11px] text-red-600 hover:underline font-bold flex items-center gap-0.5 px-2 py-1 rounded-full bg-rose-50 border border-rose-200 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">stop_circle</span>
                    <span>{isTh ? 'หยุดเสียง' : 'Stop'}</span>
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs md:text-sm text-[#091e42] leading-relaxed font-medium bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
              {aiResponse}
            </p>
          </div>
        </div>

        {/* Interactive Speech / Text Input Bar directly in Hero */}
        <form onSubmit={handleSubmitTyped} className="w-full mt-4 flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder={
                isTh
                  ? `พิมพ์หรือพูดคำว่า "เราเหนื่อย", "กังวลเรื่องสอบ", "เธอชื่ออะไร"...`
                  : `Type or speak what you feel (e.g. "I am tired", "anxious")...`
              }
              className="w-full bg-white border border-slate-300 rounded-2xl py-3 pl-4 pr-10 text-xs md:text-sm text-[#091e42] outline-none focus:border-blue-600 shadow-xs"
            />
            {typedInput && (
              <button
                type="button"
                onClick={() => setTypedInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined text-sm">cancel</span>
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={!typedInput.trim() || isGenerating}
            className={`px-4 py-3 rounded-2xl font-bold text-xs md:text-sm flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer ${
              typedInput.trim() && !isGenerating
                ? 'bg-blue-800 hover:bg-blue-900 text-white active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>{isTh ? 'ส่ง/วิเคราะห์' : 'Send'}</span>
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </form>

        {/* Quick Direct Discussion Prompts (Including the user's specific scenario) */}
        <div className="w-full mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] text-slate-500 font-medium mr-1">
            {isTh ? 'หัวข้อตรงประเด็นยอดนิยม:' : 'Quick topics:'}
          </span>
          {[
            {
              th: 'เราเหนื่อยมากเลยวันนี้',
              en: 'I am so tired today',
              badge: isTh ? 'ให้กำลังใจ & อนาคต' : 'Comfort & Future',
            },
            {
              th: 'กังวลเรื่องสอบและอนาคต',
              en: 'Anxious about exams and future',
              badge: isTh ? 'เป้าหมาย' : 'Goals',
            },
            {
              th: 'ทะเลาะกับเพื่อน รู้สึกโดดเดี่ยว',
              en: 'Dispute with friends, feeling lonely',
              badge: isTh ? 'เพื่อน' : 'Peer',
            },
            {
              th: `เธอชื่ออะไร แนะนำตัวหน่อย`,
              en: 'What is your name?',
              badge: isTh ? 'ทำความรู้จัก' : 'Intro',
            },
          ].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => processInput(isTh ? prompt.th : prompt.en)}
              className="text-xs bg-blue-50/80 hover:bg-blue-100 text-blue-900 font-semibold px-3 py-1.5 rounded-full border border-blue-200 transition-all active:scale-95 flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <span>{isTh ? prompt.th : prompt.en}</span>
              <span className="text-[9px] bg-blue-200/60 text-blue-950 px-1.5 py-0.2 rounded-full font-bold">
                {prompt.badge}
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={onNavigateToChat}
            className="text-xs text-blue-700 hover:underline font-bold px-2 py-1 ml-auto flex items-center gap-1 cursor-pointer"
          >
            <span>{isTh ? 'เปิดห้องแชตแบบเต็ม' : 'Full Chat View'}</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* EDIT AI NAME MODAL */}
      {isEditingName && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative animate-fade-in text-left">
            <button
              onClick={() => setIsEditingName(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-[#091e42] cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-2xl text-blue-700">smart_toy</span>
              <h3 className="text-lg font-bold text-[#091e42]">
                {isTh ? 'ตั้งชื่อผู้ช่วย AI ตามใจคุณ' : 'Customize AI Companion Name'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              {isTh
                ? 'เปลี่ยนชื่อผู้ช่วยส่วนตัวได้ทันที เมื่อเปลี่ยนแล้ว AI จะขานชื่อนี้และจดจำชื่อใหม่ของคุณเสมอ'
                : 'Give your AI assistant any personalized name you prefer.'}
            </p>

            <form onSubmit={handleSaveAiName} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-[#091e42] block mb-1">
                  {isTh ? 'ชื่อ AI ของคุณ' : 'AI Companion Name'}
                </label>
                <input
                  type="text"
                  required
                  value={tempNameInput}
                  onChange={(e) => setTempNameInput(e.target.value)}
                  placeholder="เช่น ซะกีนะฮ์, ซูลัยมาน, พัทนา, นูรียา, มีนา, Nova..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-sm text-[#091e42] outline-none focus:border-blue-600"
                />
              </div>

              {/* Quick Presets */}
              <div>
                <span className="text-[11px] text-slate-500 block mb-1.5 font-medium">
                  {isTh ? 'กดเลือกชื่อแนะนำยอดนิยมได้ทันที:' : 'Popular suggested names:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['ซะกีนะฮ์', 'ซูลัยมาน', 'มีนา', 'อารีฟ', 'นูรียา', 'พัทนา (Phatna)', 'พี่ฮีลใจ', 'Nova'].map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setTempNameInput(name)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        tempNameInput === name
                          ? 'bg-blue-800 text-white border-blue-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  {isTh ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-800 text-white rounded-full text-xs font-semibold hover:bg-blue-900 active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  {isTh ? 'บันทึกและให้ AI ขานชื่อ' : 'Save & Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MICROPHONE GUIDE & PERMISSIONS MODAL */}
      <MicrophoneGuideModal
        isOpen={isMicGuideOpen}
        onClose={() => setIsMicGuideOpen(false)}
        language={language}
        onMicReady={() => {
          setMicNotice(null);
        }}
      />
    </section>
  );
};
