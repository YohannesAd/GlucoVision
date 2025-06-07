import React, { createContext, useContext, useReducer, ReactNode } from 'react';

/**
 * AppContext - Global app settings and preferences
 * 
 * Features:
 * - Theme management (light/dark mode)
 * - Language/localization settings
 * - User preferences (units, notifications)
 * - App-wide loading states
 * - Error handling and notifications
 */

// App State Interface
interface AppState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  glucoseUnit: 'mg/dL' | 'mmol/L';
  notificationsEnabled: boolean;
  reminderTimes: string[];
  isOnline: boolean;
  globalLoading: boolean;
  notifications: AppNotification[];
}

// Notification Interface
interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// App Actions
type AppAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'SET_GLUCOSE_UNIT'; payload: 'mg/dL' | 'mmol/L' }
  | { type: 'TOGGLE_NOTIFICATIONS'; payload: boolean }
  | { type: 'UPDATE_REMINDER_TIMES'; payload: string[] }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'SET_GLOBAL_LOADING'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<AppNotification, 'id' | 'timestamp' | 'read'> }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'LOAD_PREFERENCES'; payload: Partial<AppState> };

// Initial State
const initialState: AppState = {
  theme: 'system',
  language: 'en',
  glucoseUnit: 'mg/dL',
  notificationsEnabled: true,
  reminderTimes: ['08:00', '12:00', '18:00', '22:00'],
  isOnline: true,
  globalLoading: false,
  notifications: [],
};

// App Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    
    case 'SET_GLUCOSE_UNIT':
      return { ...state, glucoseUnit: action.payload };
    
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, notificationsEnabled: action.payload };
    
    case 'UPDATE_REMINDER_TIMES':
      return { ...state, reminderTimes: action.payload };
    
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };
    
    case 'SET_GLOBAL_LOADING':
      return { ...state, globalLoading: action.payload };
    
    case 'ADD_NOTIFICATION':
      const newNotification: AppNotification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
      };
    
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    
    case 'LOAD_PREFERENCES':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

// Context Interface
interface AppContextType {
  state: AppState;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: string) => void;
  setGlucoseUnit: (unit: 'mg/dL' | 'mmol/L') => void;
  toggleNotifications: (enabled: boolean) => void;
  updateReminderTimes: (times: string[]) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  setGlobalLoading: (loading: boolean) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  loadPreferences: () => Promise<void>;
  savePreferences: () => Promise<void>;
}

// Create Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// App Provider Component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Theme management
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    dispatch({ type: 'SET_THEME', payload: theme });
    // TODO: Save to storage
  };

  // Language management
  const setLanguage = (language: string) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
    // TODO: Save to storage and update i18n
  };

  // Glucose unit preference
  const setGlucoseUnit = (unit: 'mg/dL' | 'mmol/L') => {
    dispatch({ type: 'SET_GLUCOSE_UNIT', payload: unit });
    // TODO: Save to storage
  };

  // Notification settings
  const toggleNotifications = (enabled: boolean) => {
    dispatch({ type: 'TOGGLE_NOTIFICATIONS', payload: enabled });
    // TODO: Update notification permissions
  };

  // Reminder times
  const updateReminderTimes = (times: string[]) => {
    dispatch({ type: 'UPDATE_REMINDER_TIMES', payload: times });
    // TODO: Update scheduled notifications
  };

  // Network status
  const setOnlineStatus = (isOnline: boolean) => {
    dispatch({ type: 'SET_ONLINE_STATUS', payload: isOnline });
  };

  // Global loading state
  const setGlobalLoading = (loading: boolean) => {
    dispatch({ type: 'SET_GLOBAL_LOADING', payload: loading });
  };

  // Notification management
  const addNotification = (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const markNotificationRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  // Load preferences from storage
  const loadPreferences = async () => {
    try {
      // TODO: Load from AsyncStorage or SecureStore
      // const preferences = await storage.getPreferences();
      // dispatch({ type: 'LOAD_PREFERENCES', payload: preferences });
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  // Save preferences to storage
  const savePreferences = async () => {
    try {
      // TODO: Save to AsyncStorage or SecureStore
      // await storage.savePreferences({
      //   theme: state.theme,
      //   language: state.language,
      //   glucoseUnit: state.glucoseUnit,
      //   notificationsEnabled: state.notificationsEnabled,
      //   reminderTimes: state.reminderTimes,
      // });
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const value: AppContextType = {
    state,
    setTheme,
    setLanguage,
    setGlucoseUnit,
    toggleNotifications,
    updateReminderTimes,
    setOnlineStatus,
    setGlobalLoading,
    addNotification,
    markNotificationRead,
    clearNotifications,
    loadPreferences,
    savePreferences,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use app context
export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
