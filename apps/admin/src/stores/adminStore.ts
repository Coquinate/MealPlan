import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ValidationStatus = 'valid' | 'warning' | 'error';
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AdminState {
  // State
  currentWeek: number;
  nextPublishDate: Date | null;
  validationStatus: ValidationStatus;
  emergencyMode: boolean;
  lastSaveTime: Date | null;
  saveStatus: SaveStatus;

  // Actions
  setSaveStatus: (status: SaveStatus) => void;
  toggleEmergencyMode: () => void;
  updateValidationStatus: (status: ValidationStatus) => void;
  updateCurrentWeek: (week: number) => void;
  updateNextPublishDate: (date: Date) => void;
  updateLastSaveTime: (time: Date) => void;
}

// Calculate current week number
const getCurrentWeek = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil(diff / oneWeek);
};

// Calculate next Thursday at 6 AM
const getNextThursday = () => {
  const next = new Date();
  const daysUntilThursday = (4 - next.getDay() + 7) % 7 || 7;
  next.setDate(next.getDate() + daysUntilThursday);
  next.setHours(6, 0, 0, 0);
  return next;
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      // Initial state
      currentWeek: getCurrentWeek(),
      nextPublishDate: getNextThursday(),
      validationStatus: 'warning',
      emergencyMode: false,
      lastSaveTime: null,
      saveStatus: 'idle',

      // Actions
      setSaveStatus: (status) => set({ saveStatus: status }),

      toggleEmergencyMode: () =>
        set((state) => ({
          emergencyMode: !state.emergencyMode,
        })),

      updateValidationStatus: (status) => set({ validationStatus: status }),

      updateCurrentWeek: (week) => set({ currentWeek: week }),

      updateNextPublishDate: (date) => set({ nextPublishDate: date }),

      updateLastSaveTime: (time) => set({ lastSaveTime: time }),
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({
        emergencyMode: state.emergencyMode,
      }),
    }
  )
);
