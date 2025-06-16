import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

/**
 * GlucoseChart - Reusable glucose chart component
 * Used in AI Trends, Dashboard, and Reports screens
 */

interface GlucoseChartProps {
  data: any;
  title?: string;
  subtitle?: string;
  height?: number;
  showLegend?: boolean;
  isLoading?: boolean;
  className?: string;
}

export default function GlucoseChart({
  data,
  title = 'Glucose Trends',
  subtitle,
  height = 240,
  showLegend = true,
  isLoading = false,
  className = ''
}: GlucoseChartProps) {
  const screenWidth = Dimensions.get('window').width;

  // Chart configuration
  const getChartConfig = () => {
    if (!data?.datasets?.[0]?.data) {
      return {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
      };
    }

    const values = data.datasets[0].data;
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    return {
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
        r: '6',
        strokeWidth: '2',
        stroke: '#3B82F6',
      },
      propsForBackgroundLines: {
        stroke: '#E5E7EB',
        strokeWidth: 1,
      },
      yAxisMin: Math.max(50, minValue - 20),
      yAxisMax: Math.min(400, maxValue + 20),
      segments: 4,
      formatYLabel: (value: string) => `${Math.round(parseFloat(value))}`,
    };
  };

  return (
    <View className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
      {/* Header */}
      <Text className="text-lg font-bold text-darkBlue mb-2">{title}</Text>
      {subtitle && (
        <Text className="text-textSecondary text-sm mb-4">{subtitle}</Text>
      )}

      {/* Chart */}
      <View className="items-center">
        {data && !isLoading ? (
          <View className="w-full" style={{ paddingLeft: 50, paddingRight: 15 }}>
            <LineChart
              data={data}
              width={screenWidth - 85}
              height={height}
              chartConfig={getChartConfig()}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
                marginLeft: 10,
              }}
              withInnerLines={true}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={true}
              fromZero={false}
              yAxisSuffix=""
            />
          </View>
        ) : (
          <View className="w-full h-56 bg-gray-100 rounded-2xl items-center justify-center">
            <Text className="text-gray-500 text-lg">📊</Text>
            <Text className="text-gray-500 text-sm mt-2">
              {isLoading ? 'Loading chart data...' : 'No glucose data available'}
            </Text>
          </View>
        )}
      </View>

      {/* Legend */}
      {showLegend && data && !isLoading && (
        <View className="mt-4 pt-4 border-t border-gray-100">
          <Text className="text-sm font-medium text-darkBlue mb-3">Chart Legend:</Text>
          <View className="flex-row flex-wrap gap-4">
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-primary rounded-full mr-2" />
              <Text className="text-textSecondary text-xs">Your Readings</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-green-500 rounded-full mr-2" />
              <Text className="text-textSecondary text-xs">Target (120 mg/dL)</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-red-500 rounded-full mr-2" />
              <Text className="text-textSecondary text-xs">Range (80-180)</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
