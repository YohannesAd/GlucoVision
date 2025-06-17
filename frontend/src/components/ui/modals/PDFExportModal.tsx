import React, { useState, useMemo } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { GlucoseLog } from '../../../types';
import Button from '../buttons/Button';
import PDFExportDateSelector, { DateRange } from '../sections/PDFExportDateSelector';
import PDFReportGenerator from '../sections/PDFReportGenerator';
import {
  preparePDFData,
  validatePDFData,
  generatePDFFilename,
  UserInfo
} from '../../../utils/pdfExportUtils';
import { generatePDF, validatePDFGeneration } from '../../../services/pdfService';

/**
 * PDFExportModal Component
 * 
 * Professional modal interface for PDF export functionality
 * Provides date range selection, preview, and export controls
 * 
 * Features:
 * - Date range selection with presets
 * - Live report preview
 * - Export validation and error handling
 * - Professional modal design
 * - Loading states and feedback
 */

interface PDFExportModalProps {
  visible: boolean;
  onClose: () => void;
  logs: GlucoseLog[];
  userInfo: UserInfo;
  glucoseUnit?: string;
}

export default function PDFExportModal({
  visible,
  onClose,
  logs,
  userInfo,
  glucoseUnit = 'mg/dL'
}: PDFExportModalProps) {
  
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    now.setHours(23, 59, 59, 999);
    
    return { startDate: thirtyDaysAgo, endDate: now };
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Prepare report data
  const reportData = useMemo(() => {
    return preparePDFData(logs, userInfo, selectedDateRange, glucoseUnit);
  }, [logs, userInfo, selectedDateRange, glucoseUnit]);

  // Validate report data
  const validation = useMemo(() => {
    return validatePDFGeneration(reportData);
  }, [reportData]);

  // Generate filename
  const filename = useMemo(() => {
    return generatePDFFilename(userInfo, selectedDateRange);
  }, [userInfo, selectedDateRange]);

  // Handle export
  const handleExport = async () => {
    if (!validation.isValid) {
      Alert.alert(
        'Export Error',
        validation.errors.join('\n'),
        [{ text: 'OK' }]
      );
      return;
    }

    setIsExporting(true);

    try {
      // Generate PDF using the PDF service
      const result = await generatePDF({
        reportData,
        fileName: filename,
        shareAfterGeneration: true
      });

      if (result.success) {
        Alert.alert(
          'Export Successful! 🎉',
          `Your glucose report has been generated and shared!\n\n📄 File: ${result.fileName}\n📊 Contains: ${reportData.logs.length} readings\n📅 Period: ${selectedDateRange.startDate.toLocaleDateString()} - ${selectedDateRange.endDate.toLocaleDateString()}\n\n💡 The share dialog will help you save it to your preferred location!`,
          [
            {
              text: 'Great!',
              onPress: onClose
            }
          ]
        );
      } else {
        Alert.alert(
          'Export Failed',
          `There was an error generating your PDF report:\n\n${result.error}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Export Failed',
        'An unexpected error occurred while generating your report. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsExporting(false);
    }
  };

  // Handle close
  const handleClose = () => {
    if (!isExporting) {
      setShowPreview(false);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white border-b border-gray-200 px-6 py-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-bold text-darkBlue">
              Export PDF Report
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              disabled={isExporting}
              className="p-2"
            >
              <Text className="text-gray-500 text-lg">✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {!showPreview ? (
            /* Export Configuration */
            <View className="p-6">
              {/* Date Range Selector */}
              <PDFExportDateSelector
                selectedRange={selectedDateRange}
                onRangeChange={setSelectedDateRange}
                className="mb-6"
              />

              {/* Export Summary */}
              <View className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <Text className="text-lg font-bold text-darkBlue mb-4">Export Summary</Text>
                
                <View>
                  <View className="flex-row justify-between mb-3">
                    <Text className="text-gray-600">Report Period:</Text>
                    <Text className="text-darkBlue font-medium">
                      {Math.ceil((selectedDateRange.endDate.getTime() - selectedDateRange.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                    </Text>
                  </View>

                  <View className="flex-row justify-between mb-3">
                    <Text className="text-gray-600">Total Readings:</Text>
                    <Text className="text-darkBlue font-medium">
                      {reportData.logs.length}
                    </Text>
                  </View>

                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">File Name:</Text>
                    <Text className="text-darkBlue font-medium text-right flex-1 ml-2" numberOfLines={2}>
                      {filename}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Validation Errors */}
              {!validation.isValid && (
                <View className="bg-red-50 rounded-xl p-4 mb-6">
                  <Text className="text-red-800 font-medium mb-2">Export Issues:</Text>
                  {validation.errors.map((error, index) => (
                    <Text key={index} className="text-red-700 text-sm">
                      • {error}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ) : (
            /* Report Preview */
            <View className="p-6">
              <View className="bg-white rounded-xl shadow-sm overflow-hidden">
                <PDFReportGenerator reportData={reportData} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer Actions */}
        <View className="bg-white border-t border-gray-200 p-6">
          <View className="flex-row"
            style={{ gap: 12 }}>
            {!showPreview ? (
              <>
                <Button
                  title="Preview Report"
                  onPress={() => setShowPreview(true)}
                  variant="outline"
                  size="medium"
                  disabled={!validation.isValid || isExporting}
                  className="flex-1"
                />
                <Button
                  title={isExporting ? "Exporting..." : "Export PDF"}
                  onPress={handleExport}
                  variant="primary"
                  size="medium"
                  disabled={!validation.isValid || isExporting}
                  className="flex-1"
                />
              </>
            ) : (
              <>
                <Button
                  title="Back to Settings"
                  onPress={() => setShowPreview(false)}
                  variant="outline"
                  size="medium"
                  disabled={isExporting}
                  className="flex-1"
                />
                <Button
                  title={isExporting ? "Exporting..." : "Export PDF"}
                  onPress={handleExport}
                  variant="primary"
                  size="medium"
                  disabled={isExporting}
                  className="flex-1"
                />
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
