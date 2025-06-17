/**
 * Filter Utilities for Glucose Logs
 * 
 * Professional utility functions for filtering glucose log data
 * Provides comprehensive filtering capabilities for the ViewLogsScreen
 * 
 * Features:
 * - Date range filtering (last 7 days, week, month, custom)
 * - Reading type filtering (fasting, after meal, etc.)
 * - Value range filtering (min/max glucose values)
 * - Sort order utilities
 * - Date calculation helpers
 */

import { GlucoseLog } from '../types';

// Filter types
export type DateFilter = 'last7days' | 'week' | 'month' | 'all';
export type MealFilter = 'all' | 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'random';
export type SortOrder = 'newest' | 'oldest';

export interface ValueRange {
  min?: number;
  max?: number;
}

export interface FilterOptions {
  dateFilter: DateFilter;
  mealFilter: MealFilter;
  sortOrder: SortOrder;
  valueRange: ValueRange;
}

/**
 * Get date range based on filter type
 */
export const getDateRange = (filter: DateFilter): { start: Date; end: Date } => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (filter) {
    case 'last7days':
      const last7Days = new Date(today);
      last7Days.setDate(today.getDate() - 7);
      return { start: last7Days, end: now };

    case 'week':
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      return { start: startOfWeek, end: now };

    case 'month':
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return { start: startOfMonth, end: now };

    case 'all':
    default:
      return { start: new Date(0), end: now };
  }
};

/**
 * Filter logs by date range
 */
export const filterByDateRange = (logs: GlucoseLog[], dateFilter: DateFilter): GlucoseLog[] => {
  if (dateFilter === 'all') return logs;

  const { start, end } = getDateRange(dateFilter);

  return logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= start && logDate <= end;
  });
};

/**
 * Filter logs by reading type
 */
export const filterByReadingType = (logs: GlucoseLog[], mealFilter: MealFilter): GlucoseLog[] => {
  if (mealFilter === 'all') return logs;
  
  return logs.filter(log => log.logType === mealFilter);
};

/**
 * Filter logs by glucose value range
 */
export const filterByValueRange = (logs: GlucoseLog[], valueRange: ValueRange): GlucoseLog[] => {
  if (!valueRange.min && !valueRange.max) return logs;
  
  return logs.filter(log => {
    if (valueRange.min && log.value < valueRange.min) return false;
    if (valueRange.max && log.value > valueRange.max) return false;
    return true;
  });
};

/**
 * Sort logs by timestamp
 */
export const sortLogs = (logs: GlucoseLog[], sortOrder: SortOrder): GlucoseLog[] => {
  return [...logs].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });
};

/**
 * Apply all filters to glucose logs
 */
export const applyFilters = (logs: GlucoseLog[], filters: FilterOptions): GlucoseLog[] => {
  let filteredLogs = logs;

  // Apply date filter
  filteredLogs = filterByDateRange(filteredLogs, filters.dateFilter);

  // Apply reading type filter
  filteredLogs = filterByReadingType(filteredLogs, filters.mealFilter);

  // Apply value range filter
  filteredLogs = filterByValueRange(filteredLogs, filters.valueRange);

  // Apply sort order
  filteredLogs = sortLogs(filteredLogs, filters.sortOrder);

  return filteredLogs;
};

/**
 * Separate logs into recent and older based on days threshold
 */
export const separateLogsByAge = (logs: GlucoseLog[], recentDaysThreshold: number = 14): { recent: GlucoseLog[]; older: GlucoseLog[] } => {
  const now = new Date();
  const thresholdDate = new Date(now.getTime() - (recentDaysThreshold * 24 * 60 * 60 * 1000));
  
  const recent: GlucoseLog[] = [];
  const older: GlucoseLog[] = [];
  
  logs.forEach(log => {
    const logDate = new Date(log.timestamp);
    if (logDate >= thresholdDate) {
      recent.push(log);
    } else {
      older.push(log);
    }
  });
  
  return { recent, older };
};

/**
 * Get filter summary text for display
 */
export const getFilterSummary = (filters: FilterOptions, totalLogs: number, filteredLogs: number): string => {
  const parts: string[] = [];
  
  if (filters.dateFilter !== 'all') {
    switch (filters.dateFilter) {
      case 'last7days':
        parts.push('last 7 days');
        break;
      case 'week':
        parts.push('this week');
        break;
      case 'month':
        parts.push('this month');
        break;

    }
  }
  
  if (filters.mealFilter !== 'all') {
    parts.push(`${filters.mealFilter.replace('_', ' ')} readings`);
  }
  
  if (filters.valueRange.min || filters.valueRange.max) {
    let rangeText = '';
    if (filters.valueRange.min && filters.valueRange.max) {
      rangeText = `${filters.valueRange.min}-${filters.valueRange.max} mg/dL`;
    } else if (filters.valueRange.min) {
      rangeText = `above ${filters.valueRange.min} mg/dL`;
    } else if (filters.valueRange.max) {
      rangeText = `below ${filters.valueRange.max} mg/dL`;
    }
    parts.push(rangeText);
  }
  
  if (parts.length === 0) {
    return `Showing all ${totalLogs} readings`;
  }
  
  return `Showing ${filteredLogs} of ${totalLogs} readings (${parts.join(', ')})`;
};

/**
 * Check if any filters are active
 */
export const hasActiveFilters = (filters: FilterOptions): boolean => {
  return (
    filters.dateFilter !== 'all' ||
    filters.mealFilter !== 'all' ||
    filters.valueRange.min !== undefined ||
    filters.valueRange.max !== undefined
  );
};

/**
 * Reset all filters to default state
 */
export const getDefaultFilters = (): FilterOptions => ({
  dateFilter: 'all',
  mealFilter: 'all',
  sortOrder: 'newest',
  valueRange: {}
});
