import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GlucoseLog } from '../types';
import { API_BASE_URL } from '../services/api/config';

/**
 * GlucoseContext - Global glucose data management
 * 
 * Features:
 * - Glucose log storage and retrieval
 * - Real-time data updates
 * - Data synchronization with backend
 * - Local caching for offline access
 * - Statistics and trends calculation
 */

// Glucose State Interface
interface GlucoseState {
  logs: GlucoseLog[];
  isLoading: boolean;
  lastSync: string | null;
  error: string | null;
}

// Glucose Actions
type GlucoseAction =
  | { type: 'FETCH_LOGS_START' }
  | { type: 'FETCH_LOGS_SUCCESS'; payload: GlucoseLog[] }
  | { type: 'FETCH_LOGS_FAILURE'; payload: string }
  | { type: 'ADD_LOG_SUCCESS'; payload: GlucoseLog }
  | { type: 'UPDATE_LOG_SUCCESS'; payload: GlucoseLog }
  | { type: 'DELETE_LOG_SUCCESS'; payload: string }
  | { type: 'SYNC_SUCCESS'; payload: { logs: GlucoseLog[]; timestamp: string } };

// Initial State
const initialState: GlucoseState = {
  logs: [],
  isLoading: false,
  lastSync: null,
  error: null,
};

// Glucose Reducer
function glucoseReducer(state: GlucoseState, action: GlucoseAction): GlucoseState {
  switch (action.type) {
    case 'FETCH_LOGS_START':
      return { ...state, isLoading: true, error: null };
    
    case 'FETCH_LOGS_SUCCESS':
      return { 
        ...state, 
        isLoading: false, 
        logs: action.payload,
        error: null 
      };
    
    case 'FETCH_LOGS_FAILURE':
      return { 
        ...state, 
        isLoading: false, 
        error: action.payload 
      };
    
    case 'ADD_LOG_SUCCESS':
      return {
        ...state,
        logs: [action.payload, ...state.logs].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ),
      };
    
    case 'UPDATE_LOG_SUCCESS':
      return {
        ...state,
        logs: state.logs.map(log => 
          log.id === action.payload.id ? action.payload : log
        ),
      };
    
    case 'DELETE_LOG_SUCCESS':
      return {
        ...state,
        logs: state.logs.filter(log => log.id !== action.payload),
      };
    
    case 'SYNC_SUCCESS':
      return {
        ...state,
        logs: action.payload.logs,
        lastSync: action.payload.timestamp,
        error: null,
      };
    
    default:
      return state;
  }
}

// Context Interface
interface GlucoseContextType {
  state: GlucoseState;
  fetchLogs: (token: string) => Promise<void>;
  addLog: (log: Omit<GlucoseLog, 'id' | 'createdAt'>, token: string) => Promise<void>;
  updateLog: (id: string, updates: Partial<GlucoseLog>, token: string) => Promise<void>;
  deleteLog: (id: string, token: string) => Promise<void>;
  syncData: (token: string) => Promise<void>;
  getRecentLogs: (days: number) => GlucoseLog[];
  getAverageGlucose: (days: number) => number | null;
}

// Create Context
const GlucoseContext = createContext<GlucoseContextType | undefined>(undefined);

// Glucose Provider Component
interface GlucoseProviderProps {
  children: ReactNode;
}

export function GlucoseProvider({ children }: GlucoseProviderProps) {
  const [state, dispatch] = useReducer(glucoseReducer, initialState);

  // Fetch logs from API
  const fetchLogs = async (token: string) => {
    dispatch({ type: 'FETCH_LOGS_START' });

    try {
      // TODO: Implement actual API call
      // const logs = await glucoseService.fetchLogs(token);
      // dispatch({ type: 'FETCH_LOGS_SUCCESS', payload: logs });

      // Mock data for now
      dispatch({ type: 'FETCH_LOGS_SUCCESS', payload: [] });
    } catch (error) {
      dispatch({ type: 'FETCH_LOGS_FAILURE', payload: 'Failed to fetch logs' });
    }
  };

  // Add new glucose log
  const addLog = async (logData: Omit<GlucoseLog, 'id' | 'createdAt'>, token: string) => {
    dispatch({ type: 'ADD_LOG_START' });

    try {
      if (!token) {
        throw new Error('No authentication token');
      }

      // Map frontend log type to backend reading type
      const readingTypeMap: { [key: string]: string } = {
        'fasting': 'fasting',
        'before_meal': 'before_meal',
        'after_meal': 'after_meal',
        'bedtime': 'bedtime',
        'random': 'random',
      };

      // Prepare data for backend with all required fields
      const backendData = {
        glucose_value: logData.value,
        unit: logData.unit,
        reading_type: readingTypeMap[logData.logType] || logData.logType,
        meal_type: null, // Optional field
        reading_time: logData.timestamp,
        notes: logData.notes || null,
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

      // Save to backend
      const response = await fetch(`${API_BASE_URL}/api/v1/glucose/logs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', response.status, errorText);

        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.detail || `Backend error: ${response.status}`);
        } catch (parseError) {
          throw new Error(`Backend error: ${response.status} - ${errorText}`);
        }
      }

      const savedLog = await response.json();

      // Convert backend response to frontend format
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
    } catch (error) {
      console.error('Add glucose log error:', error);
      dispatch({ type: 'ADD_LOG_FAILURE', payload: 'Failed to add log' });
      throw error;
    }
  };

  // Update existing log
  const updateLog = async (id: string, updates: Partial<GlucoseLog>, token: string) => {
    try {
      // TODO: Implement actual API call
      // const updatedLog = await glucoseService.updateLog(id, updates);
      
      // Mock implementation
      const existingLog = state.logs.find(log => log.id === id);
      if (existingLog) {
        const updatedLog = { ...existingLog, ...updates };
        dispatch({ type: 'UPDATE_LOG_SUCCESS', payload: updatedLog });
      }
    } catch (error) {
      throw new Error('Failed to update log');
    }
  };

  // Delete log
  const deleteLog = async (id: string, token: string) => {
    try {
      // TODO: Implement actual API call
      // await glucoseService.deleteLog(id);
      
      dispatch({ type: 'DELETE_LOG_SUCCESS', payload: id });
    } catch (error) {
      throw new Error('Failed to delete log');
    }
  };

  // Sync data with backend
  const syncData = async (token: string) => {
    try {
      // TODO: Implement actual sync logic
      // const syncedLogs = await glucoseService.syncData();
      
      dispatch({ 
        type: 'SYNC_SUCCESS', 
        payload: { 
          logs: state.logs, 
          timestamp: new Date().toISOString() 
        } 
      });
    } catch (error) {
      throw new Error('Failed to sync data');
    }
  };

  // Get recent logs within specified days
  const getRecentLogs = (days: number): GlucoseLog[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return state.logs.filter(log => 
      new Date(log.timestamp) >= cutoffDate
    );
  };

  // Calculate average glucose for specified days
  const getAverageGlucose = (days: number): number | null => {
    const recentLogs = getRecentLogs(days);
    
    if (recentLogs.length === 0) return null;
    
    const total = recentLogs.reduce((sum, log) => sum + log.value, 0);
    return Math.round(total / recentLogs.length);
  };

  const value: GlucoseContextType = {
    state,
    fetchLogs,
    addLog,
    updateLog,
    deleteLog,
    syncData,
    getRecentLogs,
    getAverageGlucose,
  };

  return (
    <GlucoseContext.Provider value={value}>
      {children}
    </GlucoseContext.Provider>
  );
}

// Custom hook to use glucose context
export function useGlucose(): GlucoseContextType {
  const context = useContext(GlucoseContext);
  if (context === undefined) {
    throw new Error('useGlucose must be used within a GlucoseProvider');
  }
  return context;
}
