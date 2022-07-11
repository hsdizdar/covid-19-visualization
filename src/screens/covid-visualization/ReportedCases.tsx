import { FC, useEffect, useState } from 'react';

import { Switch } from 'antd';
import { ChartData, ScatterDataPoint } from 'chart.js';
import { useThemeSwitcher } from 'react-css-theme-switcher';

import LineChart from '../../components/charts/LineChart';

import { ChartContainer, View } from './CovidVisualization.styles';

interface ReportedCasesProp {
  selectedCountryCode: string;
  covidData?: { [key: string]: any };
}

const ReportedCases: FC<ReportedCasesProp> = ({ selectedCountryCode, covidData }) => {
  const { currentTheme } = useThemeSwitcher();

  const [isDeathCount, setIsDeathCount] = useState(true);
  const [isNewCase, setIsNewCase] = useState(true);
  const [chartDataState, setChartDataState] =
    useState<ChartData<'line', (number | ScatterDataPoint | null)[], unknown>>();

  useEffect(() => {
    if (selectedCountryCode) {
      setChartDataState({
        labels: isDeathCount ? getDeaths() : getConfirmedCases(),
        datasets: [
          {
            label: `${isNewCase ? 'New Cases' : 'Cumulative'} - ${
              isDeathCount ? 'Deaths' : 'Confirmed Cases'
            }`,
            data: isNewCase ? getNewCases() : getCumulative(),
            borderColor: currentTheme === 'light' ? 'black' : 'white',
            borderWidth: 1,
          },
        ],
      });
    } else {
      setChartDataState({
        labels: isDeathCount ? getTotalDeaths() : getTotalConfirmedCases(),
        datasets: [
          {
            label: `${isNewCase ? 'New Cases' : 'Cumulative'} - ${
              isDeathCount ? 'Deaths' : 'Confirmed Cases'
            }`,
            data: isNewCase ? getTotalNewCases() : getTotalCumulative(),
            borderColor: currentTheme === 'light' ? 'black' : 'white',
            borderWidth: 1,
          },
        ],
      });
    }
  }, [selectedCountryCode, isDeathCount, isNewCase, currentTheme]);

  const getDeaths = () => {
    const deaths =
      covidData &&
      selectedCountryCode &&
      covidData[selectedCountryCode].data.map((item: any) => item.total_deaths).filter(Boolean);
    return deaths;
  };

  const getTotalDeaths = () => {
    const initialValue = 0;

    const totalDeaths =
      covidData &&
      Object.keys(covidData).map((item: any) => {
        return covidData[item].data
          .map((item: any) => item.total_deaths)
          .filter(Boolean)
          .reduce(
            (previousValue: number, currentValue: number) => previousValue + currentValue,
            initialValue
          );
      });

    return totalDeaths;
  };

  const getNewCases = () => {
    const newCases =
      covidData &&
      selectedCountryCode &&
      covidData[selectedCountryCode].data.map((item: any) => item.new_cases).filter(Boolean);
    return newCases;
  };

  const getTotalNewCases = () => {
    const initialValue = 0;

    const totalNewCases =
      covidData &&
      Object.keys(covidData).map((item: any) => {
        return covidData[item].data
          .map((item: any) => item.new_cases)
          .filter(Boolean)
          .reduce(
            (previousValue: number, currentValue: number) => previousValue + currentValue,
            initialValue
          );
      });

    return totalNewCases as (number | ScatterDataPoint | null)[];
  };

  const getConfirmedCases = () => {
    const confirmedCases =
      covidData &&
      selectedCountryCode &&
      covidData[selectedCountryCode].data.map((item: any) => item.total_cases).filter(Boolean);
    return confirmedCases;
  };

  const getTotalConfirmedCases = () => {
    const initialValue = 0;

    const totalConfirmedCases =
      covidData &&
      Object.keys(covidData).map((item: any) => {
        return covidData[item].data
          .map((item: any) => item.total_cases)
          .filter(Boolean)
          .reduce(
            (previousValue: number, currentValue: number) => previousValue + currentValue,
            initialValue
          );
      });

    return totalConfirmedCases;
  };

  const getCumulative = () => {
    const cumulative =
      covidData &&
      selectedCountryCode &&
      covidData[selectedCountryCode].data
        .map((item: any) => item.excess_mortality_cumulative_absolute)
        .filter(Boolean);
    return cumulative;
  };

  const getTotalCumulative = () => {
    const initialValue = 0;

    const totalCumulative =
      covidData &&
      Object.keys(covidData).map((item: any) => {
        return covidData[item].data
          .map((item: any) => item.excess_mortality_cumulative_absolute)
          .filter(Boolean)
          .reduce(
            (previousValue: number, currentValue: number) => previousValue + currentValue,
            initialValue
          );
      });

    return totalCumulative as (number | ScatterDataPoint | null)[];
  };

  const onSwitchDeathConfirmedChange = () => {
    setIsDeathCount(!isDeathCount);
  };

  const onSwitchNewCaseCumulativeChange = () => {
    setIsNewCase(!isNewCase);
  };

  return (
    <ChartContainer>
      {chartDataState && <LineChart chartData={chartDataState} />}
      <View>
        <Switch
          checkedChildren="Death"
          unCheckedChildren="Confirmed"
          defaultChecked
          onChange={onSwitchDeathConfirmedChange}
        />

        <Switch
          checkedChildren="New Cases"
          unCheckedChildren="Cumulative"
          defaultChecked
          onChange={onSwitchNewCaseCumulativeChange}
        />
      </View>
    </ChartContainer>
  );
};

export default ReportedCases;
