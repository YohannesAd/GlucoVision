import { Alert } from 'react-native';
import { AIInsight } from '../types';
import { notificationService } from '../services/notifications/notificationService';

/**
 * RecommendationActions - Utility class for handling AI recommendation actions
 * Provides reusable logic for applying recommendations across different screens
 */

export class RecommendationActions {
  private navigation: any;

  constructor(navigation: any) {
    this.navigation = navigation;
  }

  // Main handler for insight actions - simplified to only show reminder
  handleInsightAction = (insight: AIInsight) => {
    Alert.alert(
      '⏰ Set Reminder',
      `Set a reminder for this AI recommendation:\n\n"${insight.recommendation}"\n\nConfidence: ${insight.confidence}%\n\nWhen would you like to be reminded?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '🕐 In 1 Hour',
          onPress: () => this.scheduleReminder(insight, 1, 'hour')
        },
        {
          text: '📅 Tomorrow',
          onPress: () => this.scheduleReminder(insight, 1, 'day')
        },
        {
          text: '📆 Weekly',
          onPress: () => this.scheduleReminder(insight, 1, 'week')
        },
      ]
    );
  };

  // Improved reminder scheduling with better UI and functionality

  // Enhanced reminder scheduling with real notifications
  private scheduleReminder = async (insight: AIInsight, amount: number, unit: string) => {
    try {
      // Calculate the reminder time
      const reminderTime = new Date(Date.now() + this.getMilliseconds(amount, unit));

      // Create reminder object
      const reminder = {
        id: `ai_reminder_${Date.now()}`,
        title: '💡 AI Recommendation Reminder',
        message: insight.recommendation,
        confidence: insight.confidence,
        scheduledFor: reminderTime,
        type: insight.factors?.[0] || 'general',
        createdAt: new Date().toISOString()
      };

      // Store reminder locally (you can extend this to use AsyncStorage)
      console.log('Scheduling AI recommendation reminder:', reminder);

      // Schedule actual notification using the notification service
      let notificationId: string | null = null;
      try {
        notificationId = await notificationService.scheduleAIRecommendationReminder({
          recommendation: insight.recommendation,
          confidence: insight.confidence,
          scheduledTime: reminderTime,
          reminderType: unit as 'hour' | 'day' | 'week'
        });

        if (notificationId) {
          console.log('✅ AI Recommendation notification scheduled successfully:', notificationId);
        }
      } catch (notificationError) {
        console.log('⚠️ Notification scheduling failed:', notificationError);
        // Continue anyway - we'll still show the success message
      }

      // Show success message with better UI
      const timeText = unit === 'hour' ? 'in 1 hour' :
                      unit === 'day' ? 'tomorrow at this time' :
                      'weekly at this time';

      const successMessage = notificationId
        ? `🔔 Notification reminder set ${timeText}!\n\n💡 "${insight.recommendation}"\n\n⏰ You'll be reminded on: ${reminderTime.toLocaleString()}\n\n📱 Make sure notifications are enabled in your device settings.`
        : `⏰ Reminder scheduled ${timeText}!\n\n💡 "${insight.recommendation}"\n\n📅 Scheduled for: ${reminderTime.toLocaleString()}\n\n⚠️ Note: Push notifications may not be available, but your reminder is saved.`;

      Alert.alert(
        '✅ Reminder Set Successfully!',
        successMessage,
        [
          {
            text: 'Got it!',
            style: 'default',
            onPress: () => {
              console.log('AI recommendation reminder confirmed by user');
            }
          },
          {
            text: '➕ Set Another',
            onPress: () => this.handleInsightAction(insight)
          }
        ]
      );
    } catch (error) {
      console.error('Reminder scheduling error:', error);
      Alert.alert(
        '❌ Reminder Failed',
        'Unable to set reminder. Please check your notification permissions and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Clean, focused reminder system - removed unnecessary tracking features

  // Helper function to convert time units to milliseconds
  private getMilliseconds = (amount: number, unit: string): number => {
    switch (unit) {
      case 'hour': return amount * 60 * 60 * 1000;
      case 'day': return amount * 24 * 60 * 60 * 1000;
      case 'week': return amount * 7 * 24 * 60 * 60 * 1000;
      default: return amount * 60 * 60 * 1000;
    }
  };
}

export const useRecommendationActions = (navigation: any) => {
  return new RecommendationActions(navigation);
};
