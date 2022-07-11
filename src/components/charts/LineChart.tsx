import { FC } from 'react';

import { ChartData, ChartOptions, ScatterDataPoint } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

interface LineChartProps {
  chartData: ChartData<'line', (number | ScatterDataPoint | null)[], unknown>;
  options?: ChartOptions;
}

const LineChart: FC<LineChartProps> = ({ chartData, options }) => {
  return <Line data={chartData} options={options} />;
};

export default LineChart;
