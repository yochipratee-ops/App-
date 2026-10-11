// Web Speech API & MediaDevices manager for two-way voice interaction with Male/Female voice options
export type VoiceGender = 'female' | 'male';

export interface MicCheckResult {
  supported: boolean;
  permissionGranted: boolean;
  errorType?: 'not-allowed' | 'no-speech' | 'audio-capture' | 'not-supported' | 'iframe-blocked' | 'unknown';
  errorMessage?: string;
}

class VoiceAssistantService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  public isListening: boolean = false;
  public isSpeaking: boolean = false;
  private currentGender: VoiceGender = 'female';
  private currentLang: 'th' | 'en' = 'th';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      // Pre-warm voices listener
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          // voices loaded
        };
      }
    }
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = false;
          this.recognition.interimResults = false;
          this.recognition.maxAlternatives = 1;
        } catch (e) {
          console.warn('SpeechRecognition initialization error:', e);
        }
      }
    }
  }

  public isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  public setGender(gender: VoiceGender) {
    this.currentGender = gender;
  }

  public setLanguage(lang: 'th' | 'en') {
    this.currentLang = lang;
    if (this.recognition) {
      this.recognition.lang = lang === 'th' ? 'th-TH' : 'en-US';
    }
  }

  /**
   * Request microphone permission explicitly via MediaDevices.
   * This triggers the native browser permission dialog if not yet prompted.
   */
  public async requestMicrophonePermission(): Promise<MicCheckResult> {
    if (!this.isSpeechRecognitionSupported()) {
      return {
        supported: false,
        permissionGranted: false,
        errorType: 'not-supported',
        errorMessage: 'เบราว์เซอร์นี้ยังไม่รองรับระบบสั่งการด้วยเสียง (Web Speech API) แนะนำให้ใช้ Google Chrome, Microsoft Edge หรือ Safari',
      };
    }

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return {
        supported: true,
        permissionGranted: false,
        errorType: 'audio-capture',
        errorMessage: 'อุปกรณ์หรือเบราว์เซอร์ไม่รองรับการดึงสัญญาณเสียงไมโครโฟน',
      };
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Release stream immediately after permission grant
      stream.getTracks().forEach((t) => t.stop());
      return {
        supported: true,
        permissionGranted: true,
      };
    } catch (err: any) {
      const errName = err?.name || '';
      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        return {
          supported: true,
          permissionGranted: false,
          errorType: 'not-allowed',
          errorMessage: 'เบราว์เซอร์ถูกปฏิเสธการเข้าถึงไมโครโฟน กรุณาคลิกไอคอนแม่กุญแจ 🔒 ที่แถบที่อยู่เว็บ (URL Bar) แล้วกด "อนุญาต" (Allow Microphone)',
        };
      }
      if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        return {
          supported: true,
          permissionGranted: false,
          errorType: 'audio-capture',
          errorMessage: 'ไม่พบอุปกรณ์ไมโครโฟน กรุณาเชื่อมต่อไมโครโฟนหรือหูฟังที่มีไมค์',
        };
      }
      return {
        supported: true,
        permissionGranted: false,
        errorType: 'unknown',
        errorMessage: err?.message || 'ไม่สามารถเปิดใช้งานไมโครโฟนได้ในขณะนี้',
      };
    }
  }

  public speak(text: string, onStart?: () => void, onEnd?: () => void) {
    if (!this.synth) {
      if (onStart) onStart();
      setTimeout(() => {
        if (onEnd) onEnd();
      }, 3000);
      return;
    }

    try {
      this.synth.cancel(); // Stop any pending speech
      if (this.synth.paused) {
        this.synth.resume();
      }
    } catch {
      // Ignore cancel error
    }

    const cleanText = text.replace(/[*#_~`]/g, '').trim();
    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = this.currentLang === 'th' ? 'th-TH' : 'en-US';

    // Configure pitch and rate for Male / Female persona
    if (this.currentGender === 'male') {
      utterance.pitch = 0.9;
      utterance.rate = 1.0;
    } else {
      utterance.pitch = 1.05;
      utterance.rate = 1.0;
    }

    // Try to pick matched system voices if available
    const voices = this.synth.getVoices();
    const targetLangPrefix = this.currentLang === 'th' ? 'th' : 'en';
    const langVoices = voices.filter((v) =>
      v.lang.toLowerCase().startsWith(targetLangPrefix)
    );

    if (langVoices.length > 0) {
      if (this.currentGender === 'male') {
        const maleVoice = langVoices.find(
          (v) =>
            v.name.toLowerCase().includes('male') ||
            v.name.toLowerCase().includes('man') ||
            v.name.toLowerCase().includes('david') ||
            v.name.toLowerCase().includes('george') ||
            v.name.toLowerCase().includes('niw')
        );
        if (maleVoice) utterance.voice = maleVoice;
        else utterance.voice = langVoices[0];
      } else {
        const femaleVoice = langVoices.find(
          (v) =>
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('zira') ||
            v.name.toLowerCase().includes('preem') ||
            v.name.toLowerCase().includes('siri')
        );
        if (femaleVoice) utterance.voice = femaleVoice;
        else utterance.voice = langVoices[0];
      }
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  public async listen(
    onResult: (transcript: string) => void,
    onError?: (err: { type: string; message: string }) => void
  ) {
    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      if (onError) {
        onError({
          type: 'not-supported',
          message:
            'เบราว์เซอร์นี้ยังไม่รองรับระบบรับเสียงพูด (Web Speech API) กรุณาใช้งานผ่าน Google Chrome หรือ Microsoft Edge',
        });
      }
      return;
    }

    this.stopSpeaking();
    this.recognition.lang = this.currentLang === 'th' ? 'th-TH' : 'en-US';

    // Step 1: Ensure microphone access is tested / permitted
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      }
    } catch (permErr: any) {
      this.isListening = false;
      const isDenied =
        permErr?.name === 'NotAllowedError' || permErr?.name === 'PermissionDeniedError';
      if (onError) {
        onError({
          type: isDenied ? 'not-allowed' : 'audio-capture',
          message: isDenied
            ? 'ไมโครโฟนยังไม่ได้รับอนุญาตในเบราว์เซอร์: กรุณากดไอคอนแม่กุญแจ 🔒 ที่แถบ URL และกด "อนุญาต" (Allow) หรือเปิดในแท็บใหม่'
            : 'ไม่สามารถเปิดไมโครโฟนได้ กรุณาตรวจสอบการเชื่อมต่อไมค์',
        });
      }
      return;
    }

    // Step 2: Start SpeechRecognition
    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event: any) => {
      this.isListening = false;
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript && onResult) {
        onResult(transcript);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      const errCode = event?.error || 'unknown';
      let friendlyMsg = 'เกิดข้อผิดพลาดในการรับเสียง';

      if (errCode === 'not-allowed') {
        friendlyMsg =
          'การเข้าถึงไมโครโฟนถูกปิดกั้น: กรุณากดรูปกุญแจ 🔒 ที่ช่อง URL ด้านบน แล้วเลือก "อนุญาตไมโครโฟน" (Allow)';
      } else if (errCode === 'no-speech') {
        friendlyMsg = 'ไม่ได้ยินเสียงพูด กรุณาแตะไมค์แล้วลองพูดอีกครั้งใกล้ๆ ไมโครโฟน';
      } else if (errCode === 'audio-capture') {
        friendlyMsg = 'ไม่พบสัญญาณจากไมโครโฟน ตรวจสอบว่าไมโครโฟนเชื่อมต่ออยู่หรือไม่';
      } else if (errCode === 'network') {
        friendlyMsg = 'ระบบแปลงเสียงพูดต้องการการเชื่อมต่ออินเทอร์เน็ต กรุณาตรวจสอบสัญญาณเน็ต';
      }

      if (onError) {
        onError({
          type: errCode,
          message: friendlyMsg,
        });
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
    } catch (e: any) {
      this.isListening = false;
      console.warn('SpeechRecognition start error:', e);
      if (onError) {
        onError({
          type: 'start-failed',
          message: 'ไม่สามารถเริ่มการรับฟังเสียงได้ในขณะนี้ กรุณากดใหม่อีกครั้ง',
        });
      }
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
      this.isListening = false;
    }
  }
}

export const voiceAssistant = new VoiceAssistantService();
