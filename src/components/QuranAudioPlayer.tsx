import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { SURAH_DATABASE, SurahItem } from '../data/quranData';

interface QuranAudioPlayerProps {
  language: Language;
}

export const QuranAudioPlayer: React.FC<QuranAudioPlayerProps> = ({ language }) => {
  const isTh = language === 'th';
  const [selectedSurah, setSelectedSurah] = useState<SurahItem>(SURAH_DATABASE[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);
  const [isSurahListOpen, setIsSurahListOpen] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mirrorIndexRef = useRef(0);

  const getAudioSources = (surahNumber: number) => {
    const pad = String(surahNumber).padStart(3, '0');
    return [
      `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`,
      `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${pad}.mp3`,
      `https://server8.mp3quran.net/afs/${pad}.mp3`,
    ];
  };

  useEffect(() => {
    mirrorIndexRef.current = 0;
    const sources = getAudioSources(selectedSurah.surahNumber);
    const primaryUrl = selectedSurah.audioUrl || sources[0];

    if (!audioRef.current) {
      audioRef.current = new Audio(primaryUrl);
      audioRef.current.volume = volume;
    } else {
      audioRef.current.src = primaryUrl;
      audioRef.current.load();
      if (isPlaying) {
        setIsLoadingAudio(true);
        audioRef.current.play().then(() => {
          setIsLoadingAudio(false);
          setAudioError(null);
        }).catch(e => {
          console.warn('Audio play error, will attempt mirror on error event:', e);
          setIsLoadingAudio(false);
        });
      }
    }

    const audio = audioRef.current;

    const handleWaiting = () => setIsLoadingAudio(true);
    const handlePlaying = () => {
      setIsLoadingAudio(false);
      setIsPlaying(true);
      setAudioError(null);
    };

    const handleTimeUpdate = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
        // Estimate verse highlight based on time progress
        if (audio.duration && selectedSurah.verses.length > 0) {
          const ratio = audio.currentTime / audio.duration;
          const idx = Math.min(
            selectedSurah.verses.length - 1,
            Math.floor(ratio * selectedSurah.verses.length)
          );
          setActiveVerseIndex(idx);
        }
      }
    };

    const handleLoadedMetadata = () => {
      if (audio) {
        setDuration(audio.duration || 0);
        setIsLoadingAudio(false);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setActiveVerseIndex(0);
    };

    const handleError = () => {
      setIsLoadingAudio(false);
      const mirrors = getAudioSources(selectedSurah.surahNumber);
      mirrorIndexRef.current += 1;
      if (mirrorIndexRef.current < mirrors.length) {
        const nextUrl = mirrors[mirrorIndexRef.current];
        if (audio) {
          audio.src = nextUrl;
          audio.load();
          if (isPlaying) {
            audio.play().catch(e => console.warn('Mirror play error:', e));
          }
        }
      } else {
        setAudioError(isTh ? 'ไม่สามารถโหลดไฟล์เสียงได้ชั่วคราว กรุณาลองใหม่อีกครั้ง' : 'Failed to load audio stream');
        setIsPlaying(false);
      }
    };

    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [selectedSurah]);

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoadingAudio(true);
      setAudioError(null);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsLoadingAudio(false);
      }).catch(err => {
        console.warn('Playback error:', err);
        setIsLoadingAudio(false);
        // Try fallback mirror immediately
        const mirrors = getAudioSources(selectedSurah.surahNumber);
        if (mirrors.length > 1 && audioRef.current) {
          audioRef.current.src = mirrors[1];
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const handleSelectSurah = (surah: SurahItem) => {
    setSelectedSurah(surah);
    setIsSurahListOpen(false);
    setCurrentTime(0);
    setActiveVerseIndex(0);
    if (audioRef.current) {
      audioRef.current.src = surah.audioUrl;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => console.warn(e));
    }
  };

  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec)) return '0:00';
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 md:p-8 border border-[#cfe7e6] soft-shadow flex flex-col gap-6 relative overflow-hidden">
      {/* Pattern header background */}
      <div className="pattern-overlay absolute inset-0 opacity-15 pointer-events-none"></div>

      {/* Top Banner & Surah Selector Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#cfe7e6]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e1f7ff] rounded-full text-[#006a65] text-xs font-bold mb-2 border border-[#cfe7e6]">
            <span className="material-symbols-outlined text-sm material-symbols-filled">menu_book</span>
            <span>{isTh ? 'เสียงอัลกุรอานพร้อมคำแปลและความหมาย' : 'Authentic Quran Recitation with Meaning'}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-[#001f26] flex items-center gap-3">
            <span>{selectedSurah.nameTh}</span>
            <span className="font-arabic text-2xl text-[#006a65] font-normal" dir="rtl">
              {selectedSurah.nameArabic}
            </span>
          </h3>
          <p className="text-xs text-[#6c7a78] mt-1 flex items-center gap-2 flex-wrap">
            <span>{selectedSurah.nameEn}</span>
            <span>•</span>
            <span>{isTh ? `${selectedSurah.versesCount} อายะฮ์` : `${selectedSurah.versesCount} Verses`}</span>
            <span>•</span>
            <span className="text-[#006a65] font-semibold">{selectedSurah.reciterNameTh}</span>
          </p>
        </div>

        {/* Change Surah Button */}
        <div className="relative shrink-0">
          <button
            onClick={() => setIsSurahListOpen(!isSurahListOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#006a65] hover:bg-[#004340] text-white rounded-full text-xs md:text-sm font-bold shadow-xs active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">format_list_bulleted</span>
            <span>{isTh ? 'เลือกซูเราะฮ์อื่น' : 'Select Surah'}</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>

          {/* Surah Dropdown Modal / Picker */}
          {isSurahListOpen && (
            <div className="absolute right-0 top-12 z-30 w-72 md:w-80 bg-white rounded-2xl shadow-2xl border border-[#cfe7e6] p-2 flex flex-col gap-1 max-h-80 overflow-y-auto animate-fade-in">
              <span className="text-[11px] font-bold text-[#6c7a78] px-3 py-1 block uppercase">
                {isTh ? 'เลือกซูเราะฮ์เพื่อฟังเสียงและอ่านคำแปล:' : 'Select Surah:'}
              </span>
              {SURAH_DATABASE.map((surah) => (
                <button
                  key={surah.id}
                  onClick={() => handleSelectSurah(surah)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                    selectedSurah.id === surah.id
                      ? 'bg-[#006a65] text-white font-bold'
                      : 'hover:bg-[#f1fbff] text-[#001f26]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{surah.nameTh}</span>
                    <span className="text-[10px] opacity-75">{surah.healingBenefitTh.slice(0, 35)}...</span>
                  </div>
                  <span className="font-arabic text-base ml-2" dir="rtl">{surah.nameArabic}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* THEMATIC EXPLANATION BANNER (ซูเราะฮ์นี้กำลังพูดถึงอะไร) */}
      <div className="relative z-10 bg-gradient-to-r from-[#e1f7ff] via-[#f1fbff] to-white p-5 rounded-2xl border border-[#2bb8b0]/40 shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006a65] text-lg material-symbols-filled">
            lightbulb
          </span>
          <span className="text-xs md:text-sm font-bold text-[#004340] uppercase tracking-wide">
            {isTh ? 'ซูเราะฮ์นี้กำลังพูดถึงอะไร & เยียวยาจิตใจอย่างไร:' : 'What this Surah is about:'}
          </span>
        </div>
        <p className="text-xs md:text-sm text-[#001f26] leading-relaxed font-normal">
          {selectedSurah.thematicExplanationTh}
        </p>
        <div className="pt-2 border-t border-[#cfe7e6]/70 flex items-center gap-1.5 text-xs font-semibold text-[#006a65]">
          <span className="material-symbols-outlined text-sm">spa</span>
          <span>{isTh ? `คุณประโยชน์ทางใจ: ${selectedSurah.healingBenefitTh}` : `Benefit: ${selectedSurah.healingBenefitTh}`}</span>
        </div>
      </div>

      {/* AUDIO PLAYER CONTROLS & EQUALIZER */}
      <div className="relative z-10 bg-[#001f26] text-white p-5 md:p-6 rounded-2xl flex flex-col gap-4 shadow-lg">
        {/* Equalizer animation when playing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006a65] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl material-symbols-filled">
                {isPlaying ? 'graphic_eq' : 'music_note'}
              </span>
            </div>
            <div>
              <span className="text-xs md:text-sm font-bold block">{selectedSurah.nameTh}</span>
              <span className="text-[11px] text-[#78f3eb]">{selectedSurah.reciterNameTh}</span>
            </div>
          </div>

          {/* Equalizer bars */}
          <div className="flex items-center gap-1 h-6">
            {[10, 18, 24, 16, 22, 14, 20].map((h, i) => (
              <div
                key={i}
                className={`w-1 bg-[#2bb8b0] rounded-full transition-all duration-200 ${
                  isPlaying ? 'wave-bar' : 'h-1.5 opacity-50'
                }`}
                style={{
                  height: isPlaying ? `${h}px` : '4px',
                  animationDelay: `${i * -0.15}s`,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Progress Scrubber */}
        <div className="flex flex-col gap-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-[#4d6262] rounded-lg appearance-none cursor-pointer accent-[#2bb8b0]"
          />
          <div className="flex justify-between text-[11px] text-[#cfe7e6]">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Button Row */}
        <div className="flex items-center justify-between pt-1">
          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#cfe7e6]">volume_up</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 md:w-24 h-1.5 bg-[#4d6262] rounded-lg appearance-none cursor-pointer accent-[#2bb8b0]"
            />
          </div>

          {/* Play/Pause Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              disabled={isLoadingAudio}
              className="w-14 h-14 rounded-full bg-[#2bb8b0] hover:bg-[#78f3eb] text-[#001f26] flex items-center justify-center shadow-lg active:scale-95 transition-all relative disabled:opacity-80"
            >
              {isLoadingAudio ? (
                <span className="material-symbols-outlined text-2xl animate-spin">
                  progress_activity
                </span>
              ) : (
                <span className="material-symbols-outlined text-3xl material-symbols-filled">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              )}
            </button>
          </div>

          {/* Replay */}
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
                setIsPlaying(true);
              }
            }}
            title="Replay"
            className="text-[#cfe7e6] hover:text-white p-2"
          >
            <span className="material-symbols-outlined text-lg">replay</span>
          </button>
        </div>

        {audioError && (
          <div className="text-xs text-rose-300 bg-rose-950/60 p-2.5 rounded-xl border border-rose-500/40 text-center">
            {audioError}
          </div>
        )}
      </div>

      {/* VERSE BY VERSE TRANSCRIPTION & THAI TRANSLATION */}
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#cfe7e6]">
          <span className="text-xs font-bold text-[#006a65] uppercase flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">translate</span>
            <span>{isTh ? 'เนื้อหาอัลกุรอาน คำอ่าน และคำแปลความหมายภาษาไทย:' : 'Verses and Translation:'}</span>
          </span>
          <span className="text-[11px] text-[#6c7a78]">
            {isTh ? `อายะฮ์ที่ 1 ถึง ${selectedSurah.verses.length}` : `Verses 1 to ${selectedSurah.verses.length}`}
          </span>
        </div>

        <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
          {selectedSurah.verses.map((verse, idx) => {
            const isHighlighted = isPlaying && activeVerseIndex === idx;
            return (
              <div
                key={verse.verseNumber}
                className={`p-4 rounded-2xl border transition-all ${
                  isHighlighted
                    ? 'bg-[#e1f7ff] border-[#006a65] ring-2 ring-[#006a65]/20 shadow-xs'
                    : 'bg-[#f1fbff]/60 border-[#cfe7e6] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#006a65] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {verse.verseNumber}
                  </span>
                  {isHighlighted && (
                    <span className="text-[10px] font-bold text-[#006a65] bg-white px-2 py-0.5 rounded-full border border-[#006a65]/30 animate-pulse">
                      {isTh ? 'กำลังอ่านอายะฮ์นี้' : 'Reciting'}
                    </span>
                  )}
                </div>

                {/* Arabic Text */}
                <p
                  dir="rtl"
                  className="font-arabic text-xl md:text-2xl text-[#001f26] font-semibold text-right leading-loose mb-2"
                >
                  {verse.arabic}
                </p>

                {/* Transliteration */}
                <p className="text-xs text-[#6c7a78] italic mb-1">
                  "{verse.transliterationTh}"
                </p>

                {/* Translation */}
                <p className="text-xs md:text-sm font-medium text-[#004340] leading-relaxed">
                  {verse.translationTh}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
