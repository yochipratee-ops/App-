export type TabType = 'home' | 'chat' | 'wellness' | 'school' | 'profile';

export type Language = 'th' | 'en';

export type AppRole = 'student' | 'council' | 'teacher' | 'parent';

export type VoiceGender = 'female' | 'male';

export interface FormalMoodCheckIn {
  id: string;
  icon: string;
  labelTh: string;
  labelEn: string;
  clinicalDescriptionTh: string;
  clinicalDescriptionEn: string;
  level: number; // 1-5 scale (1: ปกติ, 5: วิกฤต/ต้องการความช่วยเหลือ)
  timestamp: string;
}

export interface Teacher {
  id: string;
  nameTh: string;
  nameEn: string;
  roleTh: string;
  roleEn: string;
  specialtyTh: string;
  specialtyEn: string;
  locationTh: string;
  locationEn: string;
  availableHoursTh: string;
  availableHoursEn: string;
  status: 'online' | 'busy';
  avatarBg?: string;
  safePointReady: boolean;
}

export interface HealingContent {
  id: string;
  category: 'quran' | 'dua' | 'hadith' | 'reflection';
  titleTh: string;
  titleEn: string;
  arabic?: string;
  referenceTh: string;
  referenceEn: string;
  contentTh: string;
  contentEn: string;
  quoteTh?: string;
  quoteEn?: string;
  bookmarked?: boolean;
}

export interface CouncilCase {
  id: string;
  caseCode: string;
  category: string;
  priority: 'High' | 'Medium' | 'Critical' | 'Low';
  status: 'รอตรวจสอบ' | 'กำลังประสานงาน' | 'ส่งต่อแล้ว' | 'ปิดเคส';
  date: string;
  summary: string;
}

export interface SafePoint {
  id: string;
  nameTh: string;
  nameEn: string;
  locationTh: string;
  locationEn: string;
  descriptionTh: string;
  descriptionEn: string;
  staffTh: string;
  staffEn: string;
  status: 'เปิดให้บริการ' | 'พร้อมใช้งาน';
  icon: string;
}

export interface SpeechAnalysis {
  detectedMood: string;
  detectedIntent: string;
  energyLevel: 'low' | 'moderate' | 'high';
  encouragementFocus: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  textTh: string;
  textEn: string;
  time: string;
  speechAnalysis?: SpeechAnalysis;
  healingCard?: HealingContent;
}

export interface UserProfile {
  alias: string;
  email: string;
  aiName: string;
  isPrivate: boolean;
  selectedFaith: 'islamic' | 'reflection' | 'comfort';
  voiceGender: VoiceGender;
  role: AppRole;
  sharingPermissions: {
    aiAnonymous: boolean;
    selectedTeacher: boolean;
    counselor: boolean;
    studentCouncil: boolean;
  };
  moodHistory: {
    stress: number;
    anxiety: number;
    fatigue: number;
    safety: number;
  };
  latestAssessment?: {
    score: number;
    maxScore: number;
    tier: 'normal' | 'mild' | 'moderate' | 'severe';
    titleTh: string;
    titleEn: string;
    recommendationTh: string;
    recommendationEn: string;
    date: string;
  };
}

export interface TeacherConsultRequest {
  id: string;
  studentAlias: string;
  category: string;
  timeRequested: string;
  mode: 'chat' | 'appointment' | 'safepoint';
  note: string;
  status: 'pending' | 'accepted' | 'completed';
}

export interface ParentStudentReport {
  studentAlias: string;
  gradeLevel: string;
  overallStatus: 'ปกติและปลอดภัย' | 'ควรได้รับการดูแล';
  attendanceRate: string;
  latestAssessmentDate: string;
  teacherAdvisor: string;
  recentNotes: string;
}
