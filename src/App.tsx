import { useState, useEffect } from 'react';
import { TabType, Language, UserProfile, FormalMoodCheckIn, AppRole, VoiceGender } from './types';
import { DEFAULT_USER_PROFILE } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { ChatTab } from './components/ChatTab';
import { WellnessTab } from './components/WellnessTab';
import { SchoolTab } from './components/SchoolTab';
import { ProfileTab } from './components/ProfileTab';
import { TeacherPortalView } from './components/TeacherPortalView';
import { ParentPortalView } from './components/ParentPortalView';
import { EmergencyModal } from './components/EmergencyModal';
import { SafePointsModal } from './components/SafePointsModal';
import { RolePasscodeModal } from './components/RolePasscodeModal';
import { soothingAudio } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [language, setLanguage] = useState<Language>('th');
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isSafePointsModalOpen, setIsSafePointsModalOpen] = useState(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState<AppRole | null>(null);

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleRoleChange = (newRole: AppRole) => {
    soothingAudio.playGentleChime();
    setProfile((prev) => ({ ...prev, role: newRole }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestRoleChange = (newRole: AppRole) => {
    if (newRole === 'student') {
      handleRoleChange('student');
      return;
    }
    setPendingRole(newRole);
    setIsPasscodeModalOpen(true);
  };

  const handlePasscodeSuccess = (role: AppRole) => {
    setIsPasscodeModalOpen(false);
    setPendingRole(null);
    handleRoleChange(role);
  };

  const handleGenderChange = (newGender: VoiceGender) => {
    setProfile((prev) => {
      const isDefault =
        prev.aiName.includes('ซะกีนะฮ์') ||
        prev.aiName.includes('ซูลัยมาน') ||
        prev.aiName.includes('Sakina') ||
        prev.aiName.includes('Sulaiman');
      return {
        ...prev,
        voiceGender: newGender,
        aiName: isDefault
          ? (newGender === 'female' ? 'ซะกีนะฮ์' : 'ซูลัยมาน')
          : prev.aiName,
      };
    });
  };

  const handleMoodSelect = (scale: FormalMoodCheckIn) => {
    setProfile((prev) => {
      const stressDelta = scale.level >= 4 ? 20 : -10;
      const safetyDelta = scale.level <= 2 ? 15 : -15;
      return {
        ...prev,
        moodHistory: {
          ...prev.moodHistory,
          stress: Math.max(10, Math.min(95, prev.moodHistory.stress + stressDelta)),
          safety: Math.max(15, Math.min(95, prev.moodHistory.safety + safetyDelta)),
        },
      };
    });
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleSelectSafePoint = (pointName: string) => {
    soothingAudio.playGentleChime();
    setToastMessage(
      language === 'th'
        ? `ระบบได้ส่งสัญญาณแจ้งเตือนไปยังครูผู้ดูแลจุด "${pointName}" เรียบร้อยแล้ว กรุณาเดินทางไปยังจุดนี้อย่างปลอดภัย`
        : `Safe Point alert sent to staff at "${pointName}". Please proceed to this location safely.`
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#091e42] flex flex-col font-body selection:bg-blue-600 selection:text-white">
      {/* Top Application Bar with Role Selector & Language */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
        onLanguageChange={setLanguage}
        currentRole={profile.role}
        onRoleChange={handleRequestRoleChange}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
      />

      {/* Main View Canvas (Role-Aware) */}
      <main className="flex-1 w-full">
        {/* If in Teacher Portal Mode */}
        {profile.role === 'teacher' && (
          <TeacherPortalView
            language={language}
            onOpenSafePoints={() => setIsSafePointsModalOpen(true)}
          />
        )}

        {/* If in Parent Portal Mode */}
        {profile.role === 'parent' && (
          <ParentPortalView language={language} />
        )}

        {/* If in Student Council Portal Mode */}
        {profile.role === 'council' && (
          <SchoolTab
            language={language}
            onOpenEmergency={() => setIsEmergencyModalOpen(true)}
            onOpenSafePoints={() => setIsSafePointsModalOpen(true)}
          />
        )}

        {/* Default Student Mode with standard Tab navigation */}
        {profile.role === 'student' && (
          <>
            {currentTab === 'home' && (
              <HomeTab
                language={language}
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenEmergency={() => setIsEmergencyModalOpen(true)}
                onOpenSafePoints={() => setIsSafePointsModalOpen(true)}
                currentGender={profile.voiceGender}
                onGenderChange={handleGenderChange}
                aiName={profile.aiName}
                onUpdateAiName={(newName) => handleUpdateProfile({ aiName: newName })}
                onSelectMood={handleMoodSelect}
                latestAssessment={profile.latestAssessment}
                onSaveAssessment={(res) => handleUpdateProfile({ latestAssessment: res })}
              />
            )}

            {currentTab === 'chat' && (
              <ChatTab
                language={language}
                aiName={profile.aiName}
                onUpdateAiName={(newName) => handleUpdateProfile({ aiName: newName })}
              />
            )}

            {currentTab === 'wellness' && <WellnessTab language={language} />}

            {currentTab === 'school' && (
              <SchoolTab
                language={language}
                onOpenEmergency={() => setIsEmergencyModalOpen(true)}
                onOpenSafePoints={() => setIsSafePointsModalOpen(true)}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileTab
                language={language}
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onOpenSafePoints={() => setIsSafePointsModalOpen(true)}
                onNavigateToSchool={() => {
                  setCurrentTab('school');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible in Student mode) */}
      {profile.role === 'student' && (
        <BottomNav
          currentTab={currentTab}
          onTabChange={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          language={language}
        />
      )}

      {/* Global Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        language={language}
        onNavigateToSafePoints={() => {
          setIsEmergencyModalOpen(false);
          setCurrentTab('school');
          setIsSafePointsModalOpen(true);
        }}
        onNavigateToTeachers={() => {
          setIsEmergencyModalOpen(false);
          setCurrentTab('school');
        }}
      />

      {/* Global Safe Points Modal */}
      <SafePointsModal
        isOpen={isSafePointsModalOpen}
        onClose={() => setIsSafePointsModalOpen(false)}
        language={language}
        onSelectSafePoint={handleSelectSafePoint}
      />

      {/* Role Access Passcode Authentication Modal */}
      <RolePasscodeModal
        isOpen={isPasscodeModalOpen}
        targetRole={pendingRole}
        language={language}
        onSuccess={handlePasscodeSuccess}
        onCancel={() => {
          setIsPasscodeModalOpen(false);
          setPendingRole(null);
        }}
      />


      {/* Floating Global Notification Toast */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] bg-[#0b1e3b] text-white px-4 py-3 rounded-2xl shadow-2xl border border-blue-400/40 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-blue-400 text-xl shrink-0 material-symbols-filled">
              check_circle
            </span>
            <span className="text-xs font-semibold leading-relaxed">
              {toastMessage}
            </span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0 text-white"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
