import React, { createContext, useContext, useState } from 'react';
import { VoiceAssistantModal } from '../components/VoiceAssistantModal';

interface VoiceAssistantContextType {
  openAssistant: () => void;
  closeAssistant: () => void;
  isAssistantOpen: boolean;
}

const VoiceAssistantContext = createContext<VoiceAssistantContextType | null>(null);

export const VoiceAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openAssistant = () => setIsOpen(true);
  const closeAssistant = () => setIsOpen(false);

  return (
    <VoiceAssistantContext.Provider
      value={{
        openAssistant,
        closeAssistant,
        isAssistantOpen: isOpen,
      }}
    >
      {children}
      <VoiceAssistantModal isOpen={isOpen} onClose={closeAssistant} />
    </VoiceAssistantContext.Provider>
  );
};

export const useVoiceAssistant = () => {
  const ctx = useContext(VoiceAssistantContext);
  if (!ctx) {
    throw new Error('useVoiceAssistant must be used within VoiceAssistantProvider');
  }
  return ctx;
};
