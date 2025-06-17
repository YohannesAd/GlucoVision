import React from 'react';
import { View, Text } from 'react-native';
import Button from '../buttons/Button';

/**
 * PDFExportSection - PDF report generation options
 *
 * Features:
 * - Single export option for all data
 * - Professional medical report generation
 * - Clean button layout using existing UI components
 * - Structured for backend PDF service integration
 *
 * Props:
 * - onExportAll: Function to handle full data export
 */

interface PDFExportSectionProps {
  onExportAll?: () => void;
}

export default function PDFExportSection({
  onExportAll
}: PDFExportSectionProps) {
  return (
    <View className="px-6 py-4">
      <Text className="text-lg font-bold text-darkBlue mb-4">Export Reports</Text>

      <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <Text className="text-textSecondary text-sm mb-4">
          Generate comprehensive reports for your healthcare provider
        </Text>

        <Button
          title="Download All Data (PDF)"
          onPress={onExportAll || (() => console.log('Generate full PDF'))}
          variant="primary"
        />
      </View>
    </View>
  );
}
