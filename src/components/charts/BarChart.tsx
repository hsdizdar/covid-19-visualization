import { FC } from 'react';

import { ChartData, ScatterDataPoint, ChartOptions } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

interface BarChartProps {
  chartData: ChartData<'bar', (number | ScatterDataPoint | null)[], unknown>;
  options?: ChartOptions;
}

const BarChart: FC<BarChartProps> = ({ chartData, options }) => {
  return <Bar data={chartData} options={options} />;
};

export default BarChart;
