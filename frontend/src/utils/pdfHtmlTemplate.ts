/**
 * PDF HTML Template Generator
 * 
 * Generates HTML templates for PDF generation using expo-print
 * Converts React component data to professional HTML/CSS layout
 * 
 * Features:
 * - Professional medical report styling
 * - App branding and logo
 * - Responsive layout for PDF
 * - Clean typography and spacing
 */

import { PDFReportData, GlucoseStatistics, calculateGlucoseStatistics, formatReportDate, formatDateRange, formatUserInfo, groupLogsByType } from './pdfExportUtils';

/**
 * Generate CSS styles for the PDF
 */
const generatePDFStyles = (): string => {
  return `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
        background: white;
        padding: 40px;
      }
      
      .header {
        text-align: center;
        margin-bottom: 40px;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 30px;
      }
      
      .logo {
        width: 60px;
        height: 60px;
        background: #3b82f6;
        border-radius: 50%;
        margin: 0 auto 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        font-weight: bold;
      }
      
      .app-name {
        font-size: 28px;
        font-weight: bold;
        color: #1e40af;
        margin-bottom: 10px;
      }
      
      .report-title {
        font-size: 22px;
        font-weight: bold;
        color: #374151;
        margin-bottom: 20px;
      }
      
      .user-info {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 10px;
      }
      
      .generation-date {
        font-size: 12px;
        color: #9ca3af;
      }
      
      .section {
        margin-bottom: 30px;
      }
      
      .section-title {
        font-size: 18px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 15px;
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        background: #f9fafb;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
      }
      
      .stat-item {
        text-align: center;
      }
      
      .stat-label {
        font-size: 12px;
        color: #6b7280;
        margin-bottom: 5px;
      }
      
      .stat-value {
        font-size: 20px;
        font-weight: bold;
        color: #1e40af;
      }
      
      .stat-value.high {
        color: #dc2626;
      }
      
      .stat-value.low {
        color: #2563eb;
      }
      
      .stat-value.normal {
        color: #059669;
      }
      
      .readings-section {
        margin-bottom: 25px;
      }
      
      .reading-type-title {
        font-size: 16px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 10px;
      }
      
      .readings-table {
        width: 100%;
        border-collapse: collapse;
        background: #f9fafb;
        border-radius: 8px;
        overflow: hidden;
      }
      
      .readings-table th {
        background: #e5e7eb;
        padding: 12px;
        text-align: left;
        font-weight: 600;
        color: #374151;
        font-size: 12px;
      }
      
      .readings-table td {
        padding: 10px 12px;
        border-bottom: 1px solid #e5e7eb;
        font-size: 12px;
      }
      
      .readings-table tr:last-child td {
        border-bottom: none;
      }
      
      .glucose-value {
        font-weight: 600;
      }
      
      .status-normal {
        color: #059669;
      }
      
      .status-high {
        color: #dc2626;
      }
      
      .status-low {
        color: #2563eb;
      }
      
      .footer {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
        text-align: center;
        font-size: 10px;
        color: #9ca3af;
      }
      
      .page-break {
        page-break-before: always;
      }
    </style>
  `;
};

/**
 * Get glucose status for styling
 */
const getGlucoseStatus = (value: number, glucoseUnit: string) => {
  const targetMin = glucoseUnit === 'mg/dL' ? 70 : 3.9;
  const targetMax = glucoseUnit === 'mg/dL' ? 180 : 10.0;
  
  if (value < targetMin) return { status: 'Low', class: 'status-low' };
  if (value > targetMax) return { status: 'High', class: 'status-high' };
  return { status: 'Normal', class: 'status-normal' };
};

/**
 * Format reading type for display
 */
const formatReadingType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'fasting': 'Fasting',
    'before_meal': 'Before Meal',
    'after_meal': 'After Meal',
    'bedtime': 'Bedtime',
    'random': 'Random',
    'other': 'Other'
  };
  return typeMap[type] || type;
};

/**
 * Generate HTML content for PDF
 */
export const generatePDFHTML = (reportData: PDFReportData): string => {
  const { userInfo, dateRange, logs, glucoseUnit, generatedDate } = reportData;
  const statistics = calculateGlucoseStatistics(logs, glucoseUnit);
  const groupedLogs = groupLogsByType(logs);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Blood Glucose Summary Report</title>
      ${generatePDFStyles()}
    </head>
    <body>
      <!-- Header Section -->
      <div class="header">
        <div class="logo">G</div>
        <div class="app-name">GlucoVision</div>
        <div class="report-title">Blood Glucose Summary Report</div>
        <div class="user-info">${formatUserInfo(userInfo)}</div>
        <div class="generation-date">Date Generated: ${formatReportDate(generatedDate)}</div>
      </div>

      <!-- Report Period -->
      <div class="section">
        <div class="section-title">Report Period</div>
        <p>Date Range: ${formatDateRange(dateRange)}</p>
      </div>

      <!-- Summary Statistics -->
      <div class="section">
        <div class="section-title">Summary Statistics</div>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">Total Readings</div>
            <div class="stat-value">${statistics.totalReadings}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Average Glucose</div>
            <div class="stat-value">${statistics.averageGlucose} ${glucoseUnit}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Highest Reading</div>
            <div class="stat-value high">${statistics.highestReading} ${glucoseUnit}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Lowest Reading</div>
            <div class="stat-value low">${statistics.lowestReading} ${glucoseUnit}</div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 15px;">
          <div class="stat-label">In Target Range</div>
          <div class="stat-value normal">${statistics.targetRangePercentage}% (${statistics.readingsInRange}/${statistics.totalReadings})</div>
        </div>
      </div>

      <!-- Readings by Type -->
      <div class="section">
        <div class="section-title">Detailed Readings</div>
        ${Object.entries(groupedLogs).map(([type, typeLogs]) => `
          <div class="readings-section">
            <div class="reading-type-title">${formatReadingType(type)} (${typeLogs.length} readings)</div>
            <table class="readings-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Glucose Value</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                ${typeLogs.slice(0, 10).map(log => {
                  const { status, class: statusClass } = getGlucoseStatus(log.value, glucoseUnit);
                  const date = new Date(log.timestamp);
                  return `
                    <tr>
                      <td>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</td>
                      <td class="glucose-value">${log.value} ${glucoseUnit}</td>
                      <td class="${statusClass}">${status}</td>
                      <td>${log.notes || '-'}</td>
                    </tr>
                  `;
                }).join('')}
                ${typeLogs.length > 10 ? `
                  <tr>
                    <td colspan="4" style="text-align: center; font-style: italic; color: #6b7280;">
                      ... and ${typeLogs.length - 10} more readings
                    </td>
                  </tr>
                ` : ''}
              </tbody>
            </table>
          </div>
        `).join('')}
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>This report was generated by GlucoVision on ${formatReportDate(generatedDate)}.</p>
        <p>For medical advice, please consult with your healthcare provider.</p>
      </div>
    </body>
    </html>
  `;

  return htmlContent;
};
