import React from 'react';
import { View, Text } from 'react-native';
import QuickActionButton from '../buttons/QuickActionButton';

/**
 * QuickActionsSection - Quick access buttons for main app features
 * 
 * Features:
 * - Primary action: Add Blood Sugar Reading
 * - Secondary actions: View All Logs, Generate PDF
 * - Professional button layout using existing UI components
 * - Structured for easy navigation integration
 * 
 * Props:
 * - onAddLog: Function to handle add log action
 * - onViewLogs: Function to handle view logs action
 * - onGeneratePDF: Function to handle PDF generation
 */

interface QuickActionsSectionProps {
  onAddLog?: () => void;
  onViewLogs?: () => void;
  onGeneratePDF?: () => void;
}

export default function QuickActionsSection({ 
  onAddLog, 
  onViewLogs, 
  onGeneratePDF 
}: QuickActionsSectionProps) {
  return (
    <View className="px-6 py-2">
      <Text className="text-lg font-bold text-darkBlue mb-4">Quick Actions</Text>
      
      <View className="space-y-3">
        {/* Primary Action - Add Blood Sugar */}
        <QuickActionButton
          title="Add Blood Sugar Reading"
          subtitle="Log your glucose levels"
          icon="📊"
          onPress={onAddLog || (() => console.log('Navigate to Add Log'))}
          variant="primary"
          size="large"
          fullWidth
        />

        {/* Secondary Actions */}
        <View className="flex-row space-x-3">
          <QuickActionButton
            title="View All Logs"
            subtitle="See history"
            icon="📋"
            onPress={onViewLogs || (() => console.log('Navigate to View Logs'))}
            variant="secondary"
            size="medium"
            fullWidth
          />
          <QuickActionButton
            title="Generate PDF"
            subtitle="Export data"
            icon="📄"
            onPress={onGeneratePDF || (() => console.log('Navigate to PDF options'))}
            variant="outline"
            size="medium"
            fullWidth
          />
        </View>
      </View>
    </View>
  );
}
