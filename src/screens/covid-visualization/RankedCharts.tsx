import { FC, useState, useEffect } from 'react';

import { Select, Switch } from 'antd';
import { ChartData, ScatterDataPoint } from 'chart.js';
import { useThemeSwitcher } from 'react-css-theme-switcher';

import BarChart from '../../components/charts/BarChart';

import { ChartContainer, View } from './CovidVisualization.styles';

const { Option } = Select;

interface RankedChartsProp {
  selectedCountryCode: string;
  covidData?: { [key: string]: any };
}

const RankedCharts: FC<RankedChartsProp> = ({ selectedCountryCode, covidData }) => {
  const { currentTheme } = useThemeSwitcher();

  const [isDeathCount, setIsDeathCount] = useState(true);
  const [selectedCountryCount, setSelectedCountryCount] = useState(10);
  const [countryCount, setCountryCount] = useState<Array<number>>([]);
  const [chartDataState, setChartDataState] =
    useState<ChartData<'bar', (number | ScatterDataPoint | null)[], unknown>>();

  useEffect(() => {
    let count: Array<number> = [];

    for (let i = 1; i <= 244; i++) {
      count.push(i);
    }
    setCountryCount(count);
  }, []);

  useEffect(() => {
    setChartDataState({
      labels: getCountries(),
      datasets: [
        {
          label: isDeathCount ? 'Total Deaths' : 'Total Cases',
          data: isDeathCount ? getTotalDeaths() : getTotalCases(),
          borderColor: currentTheme === 'light' ? 'black' : 'white',
          borderWidth: 1,
        },
      ],
    });
  }, [selectedCountryCount, selectedCountryCode, isDeathCount, currentTheme]);

  const getCountries = () => {
    const filteredCountries =
      covidData &&
      Object.values(covidData)
        .map((item: any) => item.location)
        .slice(0, selectedCountryCount);

    return filteredCountries;
  };

  const getTotalCases = () => {
    const initialValue = 0;

    const totalCases =
      covidData &&
      Object.keys(covidData)
        .map((item: any) => {
          return covidData[item].data
            .map((item: any) => item.total_cases)
            .filter(Boolean)
            .reduce(
              (previousValue: number, currentValue: number) => previousValue + currentValue,
              initialValue
            );
        })
        .slice(0, selectedCountryCount);

    return totalCases as (number | ScatterDataPoint | null)[];
  };

  const getTotalDeaths = () => {
    const initialValue = 0;

    const totalDeaths =
      covidData &&
      Object.keys(covidData)
        .map((item: any) => {
          return covidData[item].data
            .map((item: any) => item.total_deaths)
            .filter(Boolean)
            .reduce(
              (previousValue: number, currentValue: number) => previousValue + currentValue,
              initialValue
            );
        })
        .slice(0, selectedCountryCount);

    return totalDeaths as (number | ScatterDataPoint | null)[];
  };

  const onSelectChange = (value: number) => {
    setSelectedCountryCount(value);
  };

  const onSwitchChange = () => {
    setIsDeathCount(!isDeathCount);
  };

  return (
    <ChartContainer>
      {chartDataState && <BarChart chartData={chartDataState} />}
      <View>
        <Switch
          checkedChildren="Deaths"
          unCheckedChildren="Cases"
          defaultChecked
          onChange={onSwitchChange}
        />
        {countryCount && (
          <Select
            defaultValue={10}
            placeholder="Select a country count"
            optionFilterProp="children"
            onChange={onSelectChange}
            filterOption={(input, option) =>
              (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            {countryCount?.map((count: number) => (
              <Option value={count} key={count}>
                {count}
              </Option>
            ))}
          </Select>
        )}
      </View>
    </ChartContainer>
  );
};

export default RankedCharts;
