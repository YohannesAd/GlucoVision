/**
 * PDF Export Utilities for GlucoVision
 * 
 * Professional PDF generation utilities for glucose reports
 * Provides comprehensive report formatting and data processing
 * 
 * Features:
 * - Professional PDF layout with app branding
 * - User information and report metadata
 * - Glucose data formatting and statistics
 * - Date range filtering and validation
 * - Export file management
 */

import { GlucoseLog } from '../types';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface UserInfo {
  fullName: string;
  email: string;
  age?: number;
  gender?: string;
  dateOfBirth?: string;
}

export interface PDFReportData {
  userInfo: UserInfo;
  dateRange: DateRange;
  logs: GlucoseLog[];
  glucoseUnit: string;
  generatedDate: Date;
}

export interface GlucoseStatistics {
  totalReadings: number;
  averageGlucose: number;
  highestReading: number;
  lowestReading: number;
  readingsInRange: number;
  readingsAboveRange: number;
  readingsBelowRange: number;
  targetRangePercentage: number;
}

/**
 * Filter glucose logs by date range
 */
export const filterLogsByDateRange = (logs: GlucoseLog[], dateRange: DateRange): GlucoseLog[] => {
  return logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= dateRange.startDate && logDate <= dateRange.endDate;
  });
};

/**
 * Calculate glucose statistics for the report
 */
export const calculateGlucoseStatistics = (logs: GlucoseLog[], glucoseUnit: string = 'mg/dL'): GlucoseStatistics => {
  if (logs.length === 0) {
    return {
      totalReadings: 0,
      averageGlucose: 0,
      highestReading: 0,
      lowestReading: 0,
      readingsInRange: 0,
      readingsAboveRange: 0,
      readingsBelowRange: 0,
      targetRangePercentage: 0
    };
  }

  const values = logs.map(log => log.value);
  const totalReadings = logs.length;
  const averageGlucose = Math.round(values.reduce((sum, value) => sum + value, 0) / totalReadings);
  const highestReading = Math.max(...values);
  const lowestReading = Math.min(...values);

  // Target ranges (mg/dL) - adjust for mmol/L if needed
  const targetMin = glucoseUnit === 'mg/dL' ? 70 : 3.9;
  const targetMax = glucoseUnit === 'mg/dL' ? 180 : 10.0;

  const readingsInRange = logs.filter(log => log.value >= targetMin && log.value <= targetMax).length;
  const readingsAboveRange = logs.filter(log => log.value > targetMax).length;
  const readingsBelowRange = logs.filter(log => log.value < targetMin).length;
  const targetRangePercentage = Math.round((readingsInRange / totalReadings) * 100);

  return {
    totalReadings,
    averageGlucose,
    highestReading,
    lowestReading,
    readingsInRange,
    readingsAboveRange,
    readingsBelowRange,
    targetRangePercentage
  };
};

/**
 * Format date for display in reports
 */
export const formatReportDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format date range for display
 */
export const formatDateRange = (dateRange: DateRange): string => {
  const startFormatted = formatReportDate(dateRange.startDate);
  const endFormatted = formatReportDate(dateRange.endDate);
  
  if (startFormatted === endFormatted) {
    return startFormatted;
  }
  
  return `${startFormatted} – ${endFormatted}`;
};

/**
 * Calculate user age from date of birth
 */
export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Format user information for report header
 */
export const formatUserInfo = (userInfo: UserInfo): string => {
  const parts = [];
  
  if (userInfo.fullName) {
    parts.push(userInfo.fullName);
  }
  
  if (userInfo.email) {
    parts.push(userInfo.email);
  }
  
  const ageGender = [];
  if (userInfo.age || userInfo.dateOfBirth) {
    const age = userInfo.age || (userInfo.dateOfBirth ? calculateAge(userInfo.dateOfBirth) : null);
    if (age) {
      ageGender.push(`${age} years`);
    }
  }
  
  if (userInfo.gender) {
    ageGender.push(userInfo.gender);
  }
  
  if (ageGender.length > 0) {
    parts.push(ageGender.join(' / '));
  }
  
  return parts.join(' • ');
};

/**
 * Group logs by reading type for report sections
 */
export const groupLogsByType = (logs: GlucoseLog[]): Record<string, GlucoseLog[]> => {
  return logs.reduce((groups, log) => {
    const type = log.logType || 'other';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(log);
    return groups;
  }, {} as Record<string, GlucoseLog[]>);
};

/**
 * Sort logs by timestamp (newest first)
 */
export const sortLogsByDate = (logs: GlucoseLog[]): GlucoseLog[] => {
  return [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

/**
 * Validate PDF export data
 */
export const validatePDFData = (data: PDFReportData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.userInfo.fullName) {
    errors.push('User full name is required');
  }
  
  if (!data.userInfo.email) {
    errors.push('User email is required');
  }
  
  if (data.dateRange.startDate > data.dateRange.endDate) {
    errors.push('Start date must be before end date');
  }
  
  if (data.logs.length === 0) {
    errors.push('No glucose readings found for the selected date range');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate filename for PDF export
 */
export const generatePDFFilename = (userInfo: UserInfo, dateRange: DateRange): string => {
  const userName = userInfo.fullName.replace(/[^a-zA-Z0-9]/g, '_');
  const startDate = dateRange.startDate.toISOString().split('T')[0];
  const endDate = dateRange.endDate.toISOString().split('T')[0];
  
  return `GlucoVision_Report_${userName}_${startDate}_to_${endDate}.pdf`;
};

/**
 * Prepare data for PDF generation
 */
export const preparePDFData = (
  logs: GlucoseLog[],
  userInfo: UserInfo,
  dateRange: DateRange,
  glucoseUnit: string = 'mg/dL'
): PDFReportData => {
  const filteredLogs = filterLogsByDateRange(logs, dateRange);
  const sortedLogs = sortLogsByDate(filteredLogs);
  
  return {
    userInfo,
    dateRange,
    logs: sortedLogs,
    glucoseUnit,
    generatedDate: new Date()
  };
};
