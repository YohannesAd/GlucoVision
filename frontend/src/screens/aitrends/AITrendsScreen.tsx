import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, AIInsight, TrendData, PredictionData } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ScreenContainer, Button } from '../../components/ui';
import { LineChart } from 'react-native-chart-kit';

/**
 * AITrendsScreen - AI-powered insights and trend analysis
 * 
 * Features:
 * - AI-generated insights and recommendations (main feature)
 * - Glucose trend visualization with charts
 * - Pattern recognition and analysis
 * - Predictive analytics and forecasting
 * - Interactive AI chat interface
 * - Personalized health recommendations
 * - Professional medical AI design
 * 
 * Sections:
 * 1. AI Insights Dashboard
 * 2. Trend Analysis Charts
 * 3. Predictions & Forecasting
 * 4. Pattern Recognition
 * 5. Interactive AI Chat
 * 
 * Accessible from:
 * - Hamburger menu "AI Trends"
 * - Dashboard AI insights "View Details" button
 * - Dashboard AI insights "Ask AI More" button
 */

type AITrendsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AITrends'>;

interface AITrendsScreenProps {
  navigation: AITrendsScreenNavigationProp;
}

export default function AITrendsScreen({ navigation }: AITrendsScreenProps) {
  const { state } = useAuth();
  const { user } = state;

  // State for different sections
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Get screen dimensions for charts
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32; // Account for margins

  // Mock AI insights data - will be replaced with real data
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'recommendation',
      title: 'Excellent glucose control this week',
      message: 'Your glucose levels have been consistently within target range. Your average of 118 mg/dL shows great management.',
      confidence: 94,
      actionable: true,
      recommendation: 'Continue your current routine and consider adding a 15-minute walk after dinner to further optimize levels.',
      severity: 'positive',
      createdAt: new Date().toISOString(),
      factors: ['consistent meal timing', 'regular exercise', 'medication adherence'],
    },
    {
      id: '2',
      type: 'trend',
      title: 'Post-meal spikes detected',
      message: 'AI analysis shows glucose spikes averaging 180 mg/dL after lunch over the past 5 days.',
      confidence: 87,
      actionable: true,
      recommendation: 'Consider reducing carbohydrate portions at lunch or taking a 10-minute walk after eating.',
      severity: 'warning',
      createdAt: new Date().toISOString(),
      factors: ['lunch composition', 'meal timing', 'activity level'],
    },
    {
      id: '3',
      type: 'prediction',
      title: 'Weekend pattern prediction',
      message: 'Based on historical data, your glucose levels tend to be 15% higher on weekends.',
      confidence: 78,
      actionable: true,
      recommendation: 'Plan lighter meals and maintain exercise routine during weekends.',
      severity: 'info',
      createdAt: new Date().toISOString(),
      factors: ['weekend routine', 'meal patterns', 'sleep schedule'],
    },
  ]);

  // Mock trend data
  const [trendData, setTrendData] = useState<TrendData>({
    period: 'week',
    direction: 'improving',
    percentage: 12,
    timeInRange: 78,
    averageGlucose: 118,
    readingsCount: 28,
    patterns: ['Morning levels stable', 'Post-lunch spikes', 'Evening control good'],
  });

  // Mock chart data
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [115, 122, 108, 134, 119, 125, 112],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Primary blue
        strokeWidth: 3,
      },
      {
        data: [100, 100, 100, 100, 100, 100, 100], // Target line
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Green
        strokeWidth: 2,
        withDots: false,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#3B82F6',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#E5E7EB',
      strokeWidth: 1,
    },
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'positive': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  // Get severity text color
  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'positive': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  // Get severity background color
  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case 'positive': return 'bg-green-50';
      case 'warning': return 'bg-yellow-50';
      case 'critical': return 'bg-red-50';
      case 'info': return 'bg-blue-50';
      default: return 'bg-gray-50';
    }
  };

  // Handle period change
  const handlePeriodChange = (period: 'week' | 'month' | 'quarter') => {
    setSelectedPeriod(period);
    // TODO: Fetch new data for the selected period
    console.log(`Fetching AI trends for ${period}`);
  };

  // Handle AI chat
  const handleAIChat = () => {
    setShowChat(true);
    // TODO: Navigate to AI chat interface or show modal
    Alert.alert(
      'AI Chat',
      'Interactive AI chat will be available in a future update. You can ask questions about your glucose patterns and get personalized advice.',
      [{ text: 'OK' }]
    );
  };

  // Handle insight action
  const handleInsightAction = (insight: AIInsight) => {
    Alert.alert(
      'AI Recommendation',
      `${insight.recommendation}\n\nConfidence: ${insight.confidence}%\n\nWould you like to set a reminder for this recommendation?`,
      [
        { text: 'Not Now', style: 'cancel' },
        { 
          text: 'Set Reminder', 
          onPress: () => {
            // TODO: Implement reminder functionality
            Alert.alert('Success', 'Reminder set! You\'ll be notified to follow this recommendation.');
          }
        },
      ]
    );
  };

  // Handle refresh insights
  const handleRefreshInsights = async () => {
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Insights Updated',
        'AI has analyzed your latest glucose data and updated your insights.',
        [{ text: 'OK' }]
      );
    }, 2000);
  };

  return (
    <ScreenContainer backgroundColor="bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
          >
            <Text className="text-darkBlue text-lg">← Back</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-darkBlue">AI Trends</Text>
          <TouchableOpacity
            onPress={handleAIChat}
            className="p-2 -mr-2"
          >
            <Text className="text-primary text-lg">🤖 Chat</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* AI Insights Hero Section */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="bg-primary rounded-full px-3 py-1 mr-3">
                <Text className="text-white text-xs font-semibold">AI POWERED</Text>
              </View>
              <Text className="text-lg font-bold text-darkBlue">Your Health Insights</Text>
            </View>
            <TouchableOpacity
              onPress={handleRefreshInsights}
              disabled={isLoading}
            >
              <Text className={`text-primary text-sm font-medium ${isLoading ? 'opacity-50' : ''}`}>
                {isLoading ? 'Updating...' : '🔄 Refresh'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text className="text-textSecondary text-sm mb-4">
            AI has analyzed {trendData.readingsCount} glucose readings to provide personalized insights
          </Text>

          {/* Quick Stats */}
          <View className="flex-row justify-between mb-4 p-4 bg-gray-50 rounded-lg">
            <View className="items-center">
              <Text className="text-2xl font-bold text-darkBlue">{trendData.averageGlucose}</Text>
              <Text className="text-textSecondary text-xs">Avg mg/dL</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">{trendData.timeInRange}%</Text>
              <Text className="text-textSecondary text-xs">Time in Range</Text>
            </View>
            <View className="items-center">
              <Text className={`text-2xl font-bold ${
                trendData.direction === 'improving' ? 'text-green-600' : 
                trendData.direction === 'declining' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {trendData.direction === 'improving' ? '↗' : 
                 trendData.direction === 'declining' ? '↘' : '→'} {trendData.percentage}%
              </Text>
              <Text className="text-textSecondary text-xs">Trend</Text>
            </View>
          </View>
        </View>

        {/* Period Selector */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-darkBlue mb-4">Analysis Period</Text>
          <View className="flex-row gap-3">
            {(['week', 'month', 'quarter'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                onPress={() => handlePeriodChange(period)}
                className={`flex-1 py-3 px-4 rounded-lg border ${
                  selectedPeriod === period
                    ? 'bg-primary border-primary'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Text className={`text-center font-medium capitalize ${
                  selectedPeriod === period ? 'text-white' : 'text-darkBlue'
                }`}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Glucose Trend Chart */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-darkBlue mb-4">Glucose Trends</Text>
          <Text className="text-textSecondary text-sm mb-4">
            Your glucose levels over the past {selectedPeriod}
          </Text>

          <View className="items-center">
            <LineChart
              data={chartData}
              width={chartWidth - 48} // Account for padding
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              withInnerLines={true}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={true}
              fromZero={false}
              yAxisSuffix=" mg/dL"
            />
          </View>

          <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-100">
            <View className="items-center">
              <View className="w-3 h-3 bg-primary rounded-full mb-1" />
              <Text className="text-textSecondary text-xs">Your Levels</Text>
            </View>
            <View className="items-center">
              <View className="w-3 h-3 bg-green-500 rounded-full mb-1" />
              <Text className="text-textSecondary text-xs">Target (100 mg/dL)</Text>
            </View>
          </View>
        </View>

        {/* AI Insights List */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm overflow-hidden">
          <View className="px-6 py-4 border-b border-gray-100">
            <Text className="text-lg font-bold text-darkBlue">AI Insights & Recommendations</Text>
            <Text className="text-textSecondary text-sm mt-1">
              Personalized insights based on your glucose patterns
            </Text>
          </View>

          {aiInsights.map((insight, index) => (
            <View
              key={insight.id}
              className={`p-6 ${index < aiInsights.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              {/* Insight Header */}
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  <View className={`w-3 h-3 rounded-full mr-3 ${getSeverityColor(insight.severity)}`} />
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-darkBlue">
                      {insight.title}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Text className="text-xs text-textSecondary mr-2">
                        {insight.confidence}% confidence
                      </Text>
                      <View className={`px-2 py-1 rounded-full ${getSeverityBgColor(insight.severity)}`}>
                        <Text className={`text-xs font-medium capitalize ${getSeverityTextColor(insight.severity)}`}>
                          {insight.type}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Insight Message */}
              <Text className="text-textSecondary text-base leading-6 mb-4">
                {insight.message}
              </Text>

              {/* Factors */}
              {insight.factors && insight.factors.length > 0 && (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-darkBlue mb-2">Key Factors:</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {insight.factors.map((factor, factorIndex) => (
                      <View key={factorIndex} className="bg-gray-100 px-3 py-1 rounded-full">
                        <Text className="text-xs text-darkBlue">{factor}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Actionable Recommendation */}
              {insight.actionable && insight.recommendation && (
                <View className={`rounded-lg p-4 mb-4 ${getSeverityBgColor(insight.severity)}`}>
                  <Text className="text-sm font-semibold text-darkBlue mb-2">
                    💡 AI Recommendation:
                  </Text>
                  <Text className="text-textSecondary text-sm leading-5">
                    {insight.recommendation}
                  </Text>
                </View>
              )}

              {/* Action Button */}
              {insight.actionable && (
                <Button
                  title="Apply Recommendation"
                  onPress={() => handleInsightAction(insight)}
                  variant="outline"
                  size="medium"
                />
              )}
            </View>
          ))}
        </View>

        {/* Pattern Recognition */}
        <View className="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-darkBlue mb-4">Pattern Recognition</Text>
          <Text className="text-textSecondary text-sm mb-4">
            AI has identified these patterns in your glucose data
          </Text>

          {trendData.patterns.map((pattern, index) => (
            <View key={index} className="flex-row items-center mb-3">
              <View className="w-2 h-2 bg-primary rounded-full mr-3" />
              <Text className="text-darkBlue text-sm flex-1">{pattern}</Text>
            </View>
          ))}
        </View>

        {/* AI Chat CTA */}
        <View className="bg-gradient-to-r from-primary to-blue-600 mx-4 mt-4 rounded-xl p-6 shadow-sm">
          <View className="flex-row items-center mb-4">
            <Text className="text-2xl mr-3">🤖</Text>
            <View className="flex-1">
              <Text className="text-white text-lg font-bold">Ask AI Anything</Text>
              <Text className="text-blue-100 text-sm">
                Get personalized advice about your glucose management
              </Text>
            </View>
          </View>

          <Button
            title="Start AI Chat"
            onPress={handleAIChat}
            variant="secondary"
            size="large"
          />
        </View>

        {/* Medical Disclaimer */}
        <View className="mx-4 mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <Text className="text-yellow-800 text-sm font-medium mb-2">⚠️ Medical Disclaimer</Text>
          <Text className="text-yellow-700 text-xs leading-4">
            AI insights are for informational purposes only and should not replace professional medical advice.
            Always consult your healthcare provider before making changes to your diabetes management plan.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
