import React from 'react';
import { View, Text } from 'react-native';
import Button from '../buttons/Button';

/**
 * PDFExportSection - PDF report generation options
 * 
 * Features:
 * - Multiple export options (All Data, Last 30 Days, Custom Range)
 * - Professional medical report generation
 * - Clean button layout using existing UI components
 * - Structured for backend PDF service integration
 * 
 * Props:
 * - onExportAll: Function to handle full data export
 * - onExport30Days: Function to handle 30-day export
 * - onExportCustom: Function to handle custom range export
 */

interface PDFExportSectionProps {
  onExportAll?: () => void;
  onExport30Days?: () => void;
  onExportCustom?: () => void;
}

export default function PDFExportSection({ 
  onExportAll, 
  onExport30Days, 
  onExportCustom 
}: PDFExportSectionProps) {
  return (
    <View className="px-6 py-4">
      <Text className="text-lg font-bold text-darkBlue mb-4">Export Reports</Text>
      
      <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <Text className="text-textSecondary text-sm mb-4">
          Generate comprehensive reports for your healthcare provider
        </Text>
        
        <View className="space-y-3">
          <Button
            title="Download All Data (PDF)"
            onPress={onExportAll || (() => console.log('Generate full PDF'))}
            variant="primary"
          />
          
          <View className="flex-row space-x-3">
            <View className="flex-1">
              <Button
                title="Last 30 Days"
                onPress={onExport30Days || (() => console.log('Generate 30-day PDF'))}
                variant="outline"
              />
            </View>
            <View className="flex-1">
              <Button
                title="Custom Range"
                onPress={onExportCustom || (() => console.log('Navigate to custom range selector'))}
                variant="outline"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
