import React from 'react';
import { Text } from 'react-native';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
// import { BPMData } from '../types/bpm';
type BPMChartProps = {
  BPMdata: number[];
};
export default function BPMChart({ BPMdata }: BPMChartProps) {
  const labels = Array.from({ length: BPMdata.length }, (_, i) => (i + 1).toString());
  // const numericBPMData = BPMdata.data.map((bpm) => Number(bpm));
  const chartData = {
    // lables from 0 to 110s
    labels: labels,
    // labels: 'test',
    datasets: [{
      data: BPMdata,
      // color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`, // Optional: line color customization
      // strokeWidth: 2, // Line thickness
    }],
  };
  return (
    <LineChart
      data={chartData}
      width={Dimensions.get('window').width - 40}
      height={220}
      chartConfig={{
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
        style: {
          borderRadius: 16,
        },
      }}
      style={{
        marginVertical: 20,
        borderRadius: 16,
      }}
    />
  );
}