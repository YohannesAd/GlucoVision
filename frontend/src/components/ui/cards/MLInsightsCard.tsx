import React from 'react';
import { View, Text, ScrollView } from 'react-native';

/**
 * MLInsightsCard - Advanced Machine Learning Insights Display
 * Shows ML clustering, predictions, anomaly detection, and advanced analytics
 */

interface MLInsightsCardProps {
  mlData: {
    clusters: any[];
    dominantPattern: string;
    predictions: any;
    anomalies: any;
  };
  advancedAnalytics: {
    variabilityScore: number;
    riskLevel: string;
    exerciseImpact: string;
    medicationEffectiveness: string;
    timePatterns: any;
  };
  className?: string;
}

export default function MLInsightsCard({
  mlData,
  advancedAnalytics,
  className = ''
}: MLInsightsCardProps) {

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getVariabilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatTime12Hour = (hour24: number) => {
    if (hour24 === 0) return '12:00 AM';
    if (hour24 === 12) return '12:00 PM';
    if (hour24 < 12) return `${hour24}:00 AM`;
    return `${hour24 - 12}:00 PM`;
  };

  return (
    <View className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
      {/* Header */}
      <View className="mb-6">
        <Text className="text-xl font-bold text-darkBlue mb-2">
           Advanced Glucose Analysis
        </Text>
        <Text className="text-textSecondary text-sm">
          Comprehensive insights from your glucose patterns
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Glucose Behavior Patterns */}
        {mlData?.clusters?.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-darkBlue mb-3">
               Glucose Behavior Patterns
            </Text>
            <Text className="text-sm text-textSecondary mb-3">
              We identified {mlData?.clusters?.length || 0} distinct patterns in your glucose behavior:
            </Text>

            {mlData?.clusters?.map((cluster, index) => (
              <View key={cluster.id} className="bg-softBlue rounded-lg p-4 mb-3">
                <Text className="font-semibold text-darkBlue mb-1">
                  Pattern {index + 1}: {cluster.name}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  <View className="bg-white px-2 py-1 rounded">
                    <Text className="text-xs text-darkBlue">
                      Avg: {cluster.avgGlucose} mg/dL
                    </Text>
                  </View>
                  <View className="bg-white px-2 py-1 rounded">
                    <Text className="text-xs text-darkBlue">
                      Frequency: {cluster.frequency}x
                    </Text>
                  </View>
                  <View className="bg-white px-2 py-1 rounded">
                    <Text className="text-xs text-darkBlue">
                      Time: {formatTime12Hour(cluster.commonTime)}
                    </Text>
                  </View>
                  <View className="bg-white px-2 py-1 rounded">
                    <Text className="text-xs text-darkBlue">
                      Type: {cluster.commonReadingType || 'Mixed'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
            
            <View className="bg-blue-50 rounded-lg p-3">
              <Text className="text-sm font-medium text-blue-800">
                 Dominant Pattern: {mlData?.dominantPattern || 'Analysis in progress'}
              </Text>
            </View>
          </View>
        )}

        {/* Glucose Predictions */}
        {mlData?.predictions && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-darkBlue mb-3">
              Glucose Forecasting
            </Text>

            <View className="bg-purple-50 rounded-lg p-4">
              <Text className="font-semibold text-purple-800 mb-2">
                Predicted Next Reading
              </Text>
              <Text className="text-2xl font-bold text-purple-600 mb-2">
                {mlData?.predictions?.nextReading || '--'} mg/dL
              </Text>
              <View className="flex-row items-center">
                <Text className="text-sm text-purple-600">
                  Confidence: {Math.round((mlData?.predictions?.confidence || 0) * 100)}%
                </Text>
                <View className={`ml-2 px-2 py-1 rounded ${
                  mlData.predictions.reliability === 'high' ? 'bg-green-100' :
                  mlData.predictions.reliability === 'moderate' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    mlData.predictions.reliability === 'high' ? 'text-green-600' :
                    mlData.predictions.reliability === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {mlData.predictions.reliability} reliability
                  </Text>
                </View>
              </View>
              
              {mlData.predictions.shortTerm && (
                <View className="mt-3">
                  <Text className="text-sm font-medium text-purple-700 mb-2">
                    Short-term Forecast:
                  </Text>
                  <View className="flex-row gap-2">
                    {mlData.predictions.shortTerm.map((pred: number, index: number) => (
                      <View key={index} className="bg-white px-3 py-2 rounded">
                        <Text className="text-xs text-gray-500">Reading {index + 1}</Text>
                        <Text className="text-sm font-semibold text-purple-600">
                          {pred} mg/dL
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Unusual Readings Detection */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-darkBlue mb-3">
            🚨 Unusual Reading Detection
          </Text>

          <View className="bg-red-50 rounded-lg p-4 mb-3">
            <Text className="font-semibold text-red-800 mb-2">
              Pattern Analysis
            </Text>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-sm text-red-600">
                  Unusual Readings: {mlData?.anomalies?.statistical?.count || 0}
                </Text>
                <Text className="text-xs text-red-500">
                  {mlData?.anomalies?.statistical?.percentage || 0}% of total readings
                </Text>
              </View>
              <View>
                <Text className="text-sm text-red-600">
                  Critical Events: {(mlData?.anomalies?.statistical?.severeHighs || 0) + (mlData?.anomalies?.statistical?.severeLows || 0)}
                </Text>
                <Text className="text-xs text-red-500">
                  {mlData?.anomalies?.statistical?.severeHighs || 0} very high, {mlData?.anomalies?.statistical?.severeLows || 0} very low
                </Text>
              </View>
            </View>
          </View>

          {mlData?.anomalies?.ml && (
            <View className="bg-orange-50 rounded-lg p-4">
              <Text className="font-semibold text-orange-800 mb-2">
                 Advanced Pattern Detection
              </Text>
              <Text className="text-sm text-orange-600 mb-2">
                Advanced analysis found {mlData?.anomalies?.ml?.count || 0} unusual patterns ({mlData?.anomalies?.ml?.percentage || 0}%)
              </Text>
              {mlData?.anomalies?.ml?.values?.length > 0 && (
                <View>
                  <Text className="text-xs text-orange-500 mb-1">Unusual glucose values:</Text>
                  <Text className="text-sm text-orange-600">
                    {mlData.anomalies.ml.values.slice(0, 5).join(', ')} mg/dL
                    {mlData.anomalies.ml.values.length > 5 && '...'}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Advanced Analytics */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-darkBlue mb-3">
             Advanced Analytics
          </Text>
          
          <View className="space-y-3">
            {/* Variability Score */}
            <View className="bg-gray-50 rounded-lg p-4">
              <View className="flex-row justify-between items-center">
                <Text className="font-medium text-darkBlue">Glucose Stability</Text>
                <View className={`px-3 py-1 rounded-full ${getVariabilityColor(advancedAnalytics?.variabilityScore || 0)}`}>
                  <Text className="text-sm font-semibold">
                    {advancedAnalytics?.variabilityScore || 0}/100
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-textSecondary mt-1">
                Higher scores indicate more stable glucose levels
              </Text>
            </View>

            {/* Risk Level */}
            <View className="bg-gray-50 rounded-lg p-4">
              <View className="flex-row justify-between items-center">
                <Text className="font-medium text-darkBlue">Risk Assessment</Text>
                <View className={`px-3 py-1 rounded-full ${getRiskColor(advancedAnalytics?.riskLevel || 'low')}`}>
                  <Text className="text-sm font-semibold capitalize">
                    {advancedAnalytics?.riskLevel || 'low'}
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-textSecondary mt-1">
                GlucoVision diabetes risk evaluation
              </Text>
            </View>

            {/* Exercise Impact */}
            <View className="bg-gray-50 rounded-lg p-4">
              <View className="flex-row justify-between items-center">
                <Text className="font-medium text-darkBlue">Exercise Impact</Text>
                <Text className="text-sm text-textSecondary">
                  {advancedAnalytics?.exerciseImpact || 'Not enough data'}
                </Text>
              </View>
              <Text className="text-xs text-textSecondary mt-1">
                How exercise affects your glucose levels
              </Text>
            </View>

            {/* Medication Effectiveness */}
            <View className="bg-gray-50 rounded-lg p-4">
              <View className="flex-row justify-between items-center">
                <Text className="font-medium text-darkBlue">Medication Effect</Text>
                <Text className="text-sm text-textSecondary">
                  {advancedAnalytics?.medicationEffectiveness || 'Not enough data'}
                </Text>
              </View>
              <Text className="text-xs text-textSecondary mt-1">
                Medication impact on glucose control
              </Text>
            </View>
          </View>
        </View>

        {/* Time Patterns */}
        {advancedAnalytics?.timePatterns && (
          <View className="mb-4">
            <Text className="text-lg font-semibold text-darkBlue mb-3">
               Daily Glucose Patterns
            </Text>
            
            <View className="bg-blue-50 rounded-lg p-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-blue-700">Highest Glucose Time:</Text>
                <Text className="text-sm font-semibold text-blue-800">
                  {formatTime12Hour(advancedAnalytics?.timePatterns?.peakHour || 12)}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-blue-700">Lowest Glucose Time:</Text>
                <Text className="text-sm font-semibold text-blue-800">
                  {formatTime12Hour(advancedAnalytics?.timePatterns?.lowestHour || 6)}
                </Text>
              </View>
              {advancedAnalytics?.timePatterns?.dawnPhenomenon && (
                <View className="bg-yellow-100 rounded p-2 mt-2">
                  <Text className="text-xs text-yellow-800">
                     Dawn phenomenon detected - morning glucose rise
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
