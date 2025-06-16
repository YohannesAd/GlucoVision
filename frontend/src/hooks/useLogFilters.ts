import { useState, useMemo } from 'react';
import { GlucoseLog } from '../types';

/**
 * useLogFilters Hook
 * Professional hook for filtering and sorting glucose logs
 * Provides reusable filtering logic across multiple screens
 */

type DateFilter = 'today' | 'week' | 'month' | 'all';
type MealFilter = 'all' | 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'random';
type SortOrder = 'newest' | 'oldest';

interface UseLogFiltersProps {
  logs: GlucoseLog[];
}

interface UseLogFiltersReturn {
  // Filter states
  dateFilter: DateFilter;
  mealFilter: MealFilter;
  sortOrder: SortOrder;
  
  // Filter setters
  setDateFilter: (filter: DateFilter) => void;
  setMealFilter: (filter: MealFilter) => void;
  setSortOrder: (order: SortOrder) => void;
  
  // Filtered data
  filteredLogs: GlucoseLog[];
  
  // Statistics
  statistics: {
    average: number;
    count: number;
    normalCount: number;
    highCount: number;
    lowCount: number;
    timeInRange: number;
  };
}

export function useLogFilters({ logs }: UseLogFiltersProps): UseLogFiltersReturn {
  // Filter states
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [mealFilter, setMealFilter] = useState<MealFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  // Utility function to get glucose status
  const getGlucoseStatus = (value: number, logType: string): 'normal' | 'high' | 'low' => {
    if (logType === 'fasting') {
      if (value < 70) return 'low';
      if (value > 100) return 'high';
      return 'normal';
    } else if (logType === 'after_meal') {
      if (value < 70) return 'low';
      if (value > 140) return 'high';
      return 'normal';
    } else {
      if (value < 70) return 'low';
      if (value > 180) return 'high';
      return 'normal';
    }
  };

  // Filter and sort logs
  const filteredLogs = useMemo(() => {
    let filtered = [...logs];

    // Apply date filter
    const now = new Date();
    switch (dateFilter) {
      case 'today':
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        filtered = filtered.filter(log => new Date(log.timestamp) >= startOfDay);
        break;
      case 'week':
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(log => new Date(log.timestamp) >= startOfWeek);
        break;
      case 'month':
        const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(log => new Date(log.timestamp) >= startOfMonth);
        break;
      // 'all' doesn't filter
    }

    // Apply meal context filter
    if (mealFilter !== 'all') {
      filtered = filtered.filter(log => log.logType === mealFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [logs, dateFilter, mealFilter, sortOrder]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (filteredLogs.length === 0) {
      return {
        average: 0,
        count: 0,
        normalCount: 0,
        highCount: 0,
        lowCount: 0,
        timeInRange: 0,
      };
    }

    const total = filteredLogs.reduce((sum, log) => sum + log.value, 0);
    const average = Math.round(total / filteredLogs.length);

    let normalCount = 0;
    let highCount = 0;
    let lowCount = 0;

    filteredLogs.forEach(log => {
      const status = getGlucoseStatus(log.value, log.logType);
      switch (status) {
        case 'normal': normalCount++; break;
        case 'high': highCount++; break;
        case 'low': lowCount++; break;
      }
    });

    const timeInRange = Math.round((normalCount / filteredLogs.length) * 100);

    return {
      average,
      count: filteredLogs.length,
      normalCount,
      highCount,
      lowCount,
      timeInRange,
    };
  }, [filteredLogs]);

  return {
    // Filter states
    dateFilter,
    mealFilter,
    sortOrder,
    
    // Filter setters
    setDateFilter,
    setMealFilter,
    setSortOrder,
    
    // Filtered data
    filteredLogs,
    
    // Statistics
    statistics,
  };
}
