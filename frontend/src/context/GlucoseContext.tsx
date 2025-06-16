import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GlucoseLog } from '../types';
import { API_BASE_URL } from '../services/api/config';

interface GlucoseState {
  logs: GlucoseLog[];
  isLoading: boolean;
  lastSync: string | null;
  error: string | null;
}

type GlucoseAction =
  | { type: 'FETCH_LOGS_START' }
  | { type: 'FETCH_LOGS_SUCCESS'; payload: GlucoseLog[] }
  | { type: 'FETCH_LOGS_FAILURE'; payload: string }
  | { type: 'ADD_LOG_START' }
  | { type: 'ADD_LOG_SUCCESS'; payload: GlucoseLog }
  | { type: 'ADD_LOG_FAILURE'; payload: string }
  | { type: 'UPDATE_LOG_START' }
  | { type: 'UPDATE_LOG_SUCCESS'; payload: GlucoseLog }
  | { type: 'UPDATE_LOG_FAILURE'; payload: string }
  | { type: 'DELETE_LOG_START' }
  | { type: 'DELETE_LOG_SUCCESS'; payload: string }
  | { type: 'DELETE_LOG_FAILURE'; payload: string }
  | { type: 'SYNC_SUCCESS'; payload: { logs: GlucoseLog[]; timestamp: string } };

const initialState: GlucoseState = {
  logs: [],
  isLoading: false,
  lastSync: null,
  error: null,
};

function glucoseReducer(state: GlucoseState, action: GlucoseAction): GlucoseState {
  switch (action.type) {
    case 'FETCH_LOGS_START':
    case 'ADD_LOG_START':
    case 'UPDATE_LOG_START':
    case 'DELETE_LOG_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_LOGS_SUCCESS':
      return { ...state, isLoading: false, logs: action.payload, error: null };
    case 'FETCH_LOGS_FAILURE':
    case 'ADD_LOG_FAILURE':
    case 'UPDATE_LOG_FAILURE':
    case 'DELETE_LOG_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD_LOG_SUCCESS':
      return {
        ...state,
        isLoading: false,
        logs: [action.payload, ...state.logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        error: null,
      };
    case 'UPDATE_LOG_SUCCESS':
      return { ...state, isLoading: false, logs: state.logs.map(log => log.id === action.payload.id ? action.payload : log), error: null };
    case 'DELETE_LOG_SUCCESS':
      return { ...state, isLoading: false, logs: state.logs.filter(log => log.id !== action.payload), error: null };
    case 'SYNC_SUCCESS':
      return { ...state, logs: action.payload.logs, lastSync: action.payload.timestamp, error: null };
    default:
      return state;
  }
}

interface GlucoseContextType {
  state: GlucoseState;
  fetchLogs: (token: string) => Promise<void>;
  addLog: (log: Omit<GlucoseLog, 'id' | 'createdAt'>, token: string) => Promise<{ success: boolean; data?: GlucoseLog; error?: string }>;
  updateLog: (id: string, updates: Partial<GlucoseLog>, token: string) => Promise<void>;
  deleteLog: (id: string, token: string) => Promise<void>;
  syncData: (token: string) => Promise<void>;
  getRecentLogs: (days: number) => GlucoseLog[];
  getAverageGlucose: (days: number) => number | null;
}

const GlucoseContext = createContext<GlucoseContextType | undefined>(undefined);

export function GlucoseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(glucoseReducer, initialState);

  // Fetch logs from API
  const fetchLogs = async (token: string) => {
    dispatch({ type: 'FETCH_LOGS_START' });
    try {
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${API_BASE_URL}/api/v1/glucose/logs`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`Failed to fetch logs: ${response.status}`);

      const data = await response.json();
      const logs: GlucoseLog[] = data.logs.map((log: any) => ({
        id: log.id,
        userId: log.user_id,
        value: log.glucose_value,
        unit: log.unit,
        logType: log.reading_type,
        timestamp: log.reading_time,
        notes: log.notes,
        createdAt: log.created_at,
      }));

      dispatch({ type: 'FETCH_LOGS_SUCCESS', payload: logs });
    } catch (error) {
      dispatch({ type: 'FETCH_LOGS_FAILURE', payload: 'Failed to fetch logs' });
    }
  };

  // Add new glucose log
  const addLog = async (logData: Omit<GlucoseLog, 'id' | 'createdAt'>, token: string) => {
    dispatch({ type: 'ADD_LOG_START' });
    try {
      if (!token) throw new Error('No authentication token');

      const backendData = {
        glucose_value: logData.value,
        unit: logData.unit,
        reading_type: logData.logType,
        reading_time: logData.timestamp,
        notes: logData.notes || null,
        meal_type: null,
        symptoms: null,
        carbs_consumed: null,
        exercise_duration: null,
        exercise_type: null,
        insulin_taken: false,
        insulin_units: null,
        medication_taken: false,
        medication_notes: null,
        stress_level: null,
        sleep_hours: null,
        illness: false,
        illness_notes: null,
      };

      const response = await fetch(`${API_BASE_URL}/api/v1/glucose/logs`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) throw new Error(`Backend error: ${response.status}`);

      const savedLog = await response.json();
      const newLog: GlucoseLog = {
        id: savedLog.id,
        userId: logData.userId,
        value: savedLog.glucose_value,
        unit: savedLog.unit,
        logType: savedLog.reading_type,
        timestamp: savedLog.reading_time,
        notes: savedLog.notes,
        createdAt: savedLog.created_at,
      };

      dispatch({ type: 'ADD_LOG_SUCCESS', payload: newLog });

      // Return success result for useFormSubmission
      return { success: true, data: newLog };
    } catch (error) {
      dispatch({ type: 'ADD_LOG_FAILURE', payload: 'Failed to add log' });
      // Return error result for useFormSubmission
      return { success: false, error: error instanceof Error ? error.message : 'Failed to add log' };
    }
  };

  // Update existing log (mock implementation)
  const updateLog = async (id: string, updates: Partial<GlucoseLog>, _token: string) => {
    dispatch({ type: 'UPDATE_LOG_START' });
    try {
      const existingLog = state.logs.find(log => log.id === id);
      if (!existingLog) throw new Error('Log not found');
      const updatedLog = { ...existingLog, ...updates };
      dispatch({ type: 'UPDATE_LOG_SUCCESS', payload: updatedLog });
    } catch (error) {
      dispatch({ type: 'UPDATE_LOG_FAILURE', payload: 'Failed to update log' });
      throw error;
    }
  };

  // Delete log (mock implementation)
  const deleteLog = async (id: string, _token: string) => {
    dispatch({ type: 'DELETE_LOG_START' });
    try {
      dispatch({ type: 'DELETE_LOG_SUCCESS', payload: id });
    } catch (error) {
      dispatch({ type: 'DELETE_LOG_FAILURE', payload: 'Failed to delete log' });
      throw error;
    }
  };

  // Sync data with backend (mock implementation)
  const syncData = async (_token: string) => {
    try {
      dispatch({ type: 'SYNC_SUCCESS', payload: { logs: state.logs, timestamp: new Date().toISOString() } });
    } catch (error) {
      throw new Error('Failed to sync data');
    }
  };

  // Get recent logs within specified days
  const getRecentLogs = (days: number): GlucoseLog[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return state.logs.filter(log => new Date(log.timestamp) >= cutoffDate);
  };

  // Calculate average glucose for specified days
  const getAverageGlucose = (days: number): number | null => {
    const recentLogs = getRecentLogs(days);
    if (recentLogs.length === 0) return null;
    const total = recentLogs.reduce((sum, log) => sum + log.value, 0);
    return Math.round(total / recentLogs.length);
  };

  return (
    <GlucoseContext.Provider value={{
      state,
      fetchLogs,
      addLog,
      updateLog,
      deleteLog,
      syncData,
      getRecentLogs,
      getAverageGlucose,
    }}>
      {children}
    </GlucoseContext.Provider>
  );
}

export function useGlucose(): GlucoseContextType {
  const context = useContext(GlucoseContext);
  if (!context) throw new Error('useGlucose must be used within a GlucoseProvider');
  return context;
}
