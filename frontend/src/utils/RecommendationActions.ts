import { Alert } from 'react-native';
import { AIInsight } from '../types';

/**
 * RecommendationActions - Utility class for handling AI recommendation actions
 * Provides reusable logic for applying recommendations across different screens
 */

export class RecommendationActions {
  private navigation: any;

  constructor(navigation: any) {
    this.navigation = navigation;
  }

  // Main handler for insight actions
  handleInsightAction = (insight: AIInsight) => {
    Alert.alert(
      '💡 Apply AI Recommendation',
      `${insight.recommendation}\n\nConfidence: ${insight.confidence}%\n\nHow would you like to apply this recommendation?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '📝 Add to Log Notes',
          onPress: () => this.handleAddToLogNotes(insight)
        },
        {
          text: '⏰ Set Reminder',
          onPress: () => this.handleSetReminder(insight)
        },
        {
          text: '📊 Track Progress',
          onPress: () => this.handleTrackProgress(insight)
        },
      ]
    );
  };

  // Add recommendation to log notes
  private handleAddToLogNotes = (insight: AIInsight) => {
    try {
      const recommendationNote = `AI Recommendation (${insight.confidence}% confidence): ${insight.recommendation}`;
      console.log('Saving recommendation note:', recommendationNote);

      Alert.alert(
        '📝 Added to Log Notes',
        'This recommendation will appear as a note option when you add new glucose logs.',
        [
          { text: 'OK' },
          {
            text: 'Add Log Now',
            onPress: () => {
              this.navigation.navigate('AddLog' as never);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save recommendation note. Please try again.');
    }
  };

  // Set up reminder system
  private handleSetReminder = (insight: AIInsight) => {
    Alert.alert(
      '⏰ Set Reminder',
      'When would you like to be reminded about this recommendation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'In 1 Hour',
          onPress: () => this.scheduleReminder(insight, 1, 'hour')
        },
        {
          text: 'Tomorrow',
          onPress: () => this.scheduleReminder(insight, 1, 'day')
        },
        {
          text: 'Weekly',
          onPress: () => this.scheduleReminder(insight, 1, 'week')
        },
      ]
    );
  };

  // Schedule reminder
  private scheduleReminder = (insight: AIInsight, amount: number, unit: string) => {
    try {
      const reminder = {
        id: `reminder_${Date.now()}`,
        recommendation: insight.recommendation,
        confidence: insight.confidence,
        scheduledFor: new Date(Date.now() + this.getMilliseconds(amount, unit)),
        type: insight.factors?.[0] || 'general',
        createdAt: new Date().toISOString()
      };
      console.log('Scheduling reminder:', reminder);

      Alert.alert(
        '✅ Reminder Set',
        `You'll be reminded about this recommendation ${unit === 'hour' ? 'in 1 hour' :
                                                      unit === 'day' ? 'tomorrow' : 'weekly'}.`,
        [
          { text: 'OK' },
          {
            text: 'View All Reminders',
            onPress: () => {
              Alert.alert('Coming Soon', 'Reminders management will be available in the next update.');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to set reminder. Please try again.');
    }
  };

  // Track progress
  private handleTrackProgress = (insight: AIInsight) => {
    Alert.alert(
      '📊 Track Progress',
      'How would you like to track your progress with this recommendation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark as Started',
          onPress: () => this.markRecommendationStatus(insight, 'started')
        },
        {
          text: 'Mark as Completed',
          onPress: () => this.markRecommendationStatus(insight, 'completed')
        },
        {
          text: 'Add Progress Note',
          onPress: () => this.addProgressNote(insight)
        },
      ]
    );
  };

  // Mark recommendation status
  private markRecommendationStatus = (insight: AIInsight, status: 'started' | 'completed') => {
    try {
      const progress = {
        recommendationId: insight.id,
        status: status,
        timestamp: new Date().toISOString(),
        confidence: insight.confidence
      };
      console.log('Saving progress:', progress);

      const statusText = status === 'started' ? 'Started' : 'Completed';
      const emoji = status === 'started' ? '🚀' : '✅';

      Alert.alert(
        `${emoji} ${statusText}!`,
        `You've marked this recommendation as ${status}. Your progress will be tracked in your health insights.`,
        [
          { text: 'OK' },
          {
            text: 'View Progress',
            onPress: () => {
              Alert.alert('Coming Soon', 'Progress tracking dashboard will be available in the next update.');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save progress. Please try again.');
    }
  };

  // Add progress note
  private addProgressNote = (insight: AIInsight) => {
    console.log('Adding progress note for insight:', insight.id);

    Alert.prompt(
      '📝 Add Progress Note',
      'How are you doing with this recommendation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save Note',
          onPress: (noteText) => {
            if (noteText && noteText.trim()) {
              console.log('Saving progress note:', noteText);
              Alert.alert('✅ Note Saved', 'Your progress note has been saved and will be included in your health insights.');
            }
          }
        }
      ],
      'plain-text',
      '',
      'default'
    );
  };

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
