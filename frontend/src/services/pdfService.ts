/**
 * PDF Generation Service
 * 
 * Professional PDF generation and file management service
 * Handles PDF creation, saving to device, and sharing functionality
 * 
 * Features:
 * - Generate PDF from HTML template
 * - Save to device Downloads folder
 * - Share PDF with other apps
 * - Error handling and validation
 * - Progress tracking
 */

import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';
import { PDFReportData, generatePDFFilename } from '../utils/pdfExportUtils';
import { generatePDFHTML } from '../utils/pdfHtmlTemplate';

export interface PDFGenerationResult {
  success: boolean;
  filePath?: string;
  fileName?: string;
  error?: string;
}

export interface PDFGenerationOptions {
  reportData: PDFReportData;
  fileName?: string;
  saveToDownloads?: boolean;
  shareAfterGeneration?: boolean;
}

/**
 * Generate PDF from report data
 */
export const generatePDF = async (options: PDFGenerationOptions): Promise<PDFGenerationResult> => {
  try {
    console.log('Starting PDF generation with options:', options);

    const { reportData, fileName, shareAfterGeneration = true } = options;

    // Generate filename if not provided
    const finalFileName = fileName || generatePDFFilename(reportData.userInfo, reportData.dateRange);
    console.log('Generated filename:', finalFileName);

    // Generate HTML content
    const htmlContent = generatePDFHTML(reportData);
    console.log('HTML content generated, length:', htmlContent.length);

    // Generate PDF using expo-print
    console.log('Starting PDF generation with expo-print...');
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
      margins: {
        left: 20,
        top: 20,
        right: 20,
        bottom: 20,
      },
    });
    console.log('PDF generated successfully at:', uri);

    // Share the PDF if requested
    if (shareAfterGeneration) {
      console.log('Sharing PDF...');
      await sharePDF(uri, finalFileName);
      console.log('PDF shared successfully');
    }

    return {
      success: true,
      filePath: uri,
      fileName: finalFileName
    };

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Save PDF to Downloads folder
 */
export const saveToDownloads = async (sourceUri: string, fileName: string): Promise<PDFGenerationResult> => {
  try {
    if (Platform.OS === 'android') {
      // For Android, save to Downloads folder
      const downloadDir = FileSystem.documentDirectory + 'Download/';
      
      // Ensure Downloads directory exists
      const dirInfo = await FileSystem.getInfoAsync(downloadDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
      }
      
      const destinationUri = downloadDir + fileName;
      await FileSystem.copyAsync({
        from: sourceUri,
        to: destinationUri
      });
      
      return {
        success: true,
        filePath: destinationUri,
        fileName
      };
    } else {
      // For iOS, the file is already in a accessible location
      return {
        success: true,
        filePath: sourceUri,
        fileName
      };
    }
  } catch (error) {
    console.error('Save to Downloads Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save to Downloads'
    };
  }
};

/**
 * Share PDF using device sharing capabilities
 */
export const sharePDF = async (filePath: string, fileName: string): Promise<void> => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (isAvailable) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/pdf',
        dialogTitle: `Share ${fileName}`,
        UTI: 'com.adobe.pdf'
      });
    } else {
      // Fallback for platforms where sharing is not available
      Alert.alert(
        'PDF Generated',
        `Your PDF report has been saved as ${fileName}`,
        [{ text: 'OK' }]
      );
    }
  } catch (error) {
    console.error('Share PDF Error:', error);
    Alert.alert(
      'Share Error',
      'Could not share the PDF, but it has been saved to your device.',
      [{ text: 'OK' }]
    );
  }
};

/**
 * Get file info for generated PDF
 */
export const getPDFInfo = async (filePath: string): Promise<FileSystem.FileInfo | null> => {
  try {
    const info = await FileSystem.getInfoAsync(filePath);
    return info;
  } catch (error) {
    console.error('Get PDF Info Error:', error);
    return null;
  }
};

/**
 * Delete PDF file
 */
export const deletePDF = async (filePath: string): Promise<boolean> => {
  try {
    await FileSystem.deleteAsync(filePath);
    return true;
  } catch (error) {
    console.error('Delete PDF Error:', error);
    return false;
  }
};

/**
 * List all PDF files in Downloads folder
 */
export const listPDFFiles = async (): Promise<string[]> => {
  try {
    const downloadDir = FileSystem.documentDirectory + 'Download/';
    const dirInfo = await FileSystem.getInfoAsync(downloadDir);
    
    if (!dirInfo.exists) {
      return [];
    }
    
    const files = await FileSystem.readDirectoryAsync(downloadDir);
    return files.filter(file => file.toLowerCase().endsWith('.pdf'));
  } catch (error) {
    console.error('List PDF Files Error:', error);
    return [];
  }
};

/**
 * Validate PDF generation requirements
 */
export const validatePDFGeneration = (reportData: PDFReportData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!reportData.userInfo.fullName) {
    errors.push('User name is required for PDF generation');
  }
  
  if (!reportData.userInfo.email) {
    errors.push('User email is required for PDF generation');
  }
  
  if (reportData.logs.length === 0) {
    errors.push('No glucose readings available for PDF generation');
  }
  
  if (reportData.dateRange.startDate > reportData.dateRange.endDate) {
    errors.push('Invalid date range for PDF generation');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get Downloads folder path
 */
export const getDownloadsPath = (): string => {
  if (Platform.OS === 'android') {
    return FileSystem.documentDirectory + 'Download/';
  } else {
    return FileSystem.documentDirectory || '';
  }
};

/**
 * Check if file exists
 */
export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    const info = await FileSystem.getInfoAsync(filePath);
    return info.exists;
  } catch (error) {
    return false;
  }
};
