import { FC, useEffect, useState } from 'react';

import axios from 'axios';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import { Switch, Select, Tabs } from 'antd';
import 'chart.js/auto';

import ReportedCases from './ReportedCases';
import RankedCharts from './RankedCharts';

import { Container, Header, SpinnerContainer, Title, Wrapper } from './CovidVisualization.styles';

const { Option } = Select;
const { TabPane } = Tabs;

const CovidObservation: FC = () => {
  const { switcher, themes } = useThemeSwitcher();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [covidData, setCovidData] = useState<{ [key: string]: any }>({});
  const [countries, setCountries] = useState<Array<object>>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCountryData();
  }, []);

  useEffect(() => {
    if (covidData) {
      const countries = Object.keys(covidData).map((item) => {
        return {
          code: item,
          value: covidData[item].location,
        };
      });

      setCountries(countries);
    }
  }, [covidData]);

  const loadCountryData = () => {
    setIsLoading(true);
    axios
      .get('https://covid.ourworldindata.org/data/owid-covid-data.json')
      .then((response) => {
        setCovidData(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setIsLoading(false));
  };

  const onSelectChange = (value: string) => {
    setSelectedCountry(value);
  };

  const toggleTheme = (isChecked: boolean) => {
    setIsDarkMode(isChecked);
    switcher({ theme: isChecked ? themes.dark : themes.light });
  };

  if (isLoading) {
    return <SpinnerContainer>LOADING...</SpinnerContainer>;
  }

  return (
    <Container>
      <Header>
        <div></div>
        <Title>COVID-19 DATA VISULIZATION</Title>
        <Switch
          checkedChildren="Dark"
          unCheckedChildren="Light"
          checked={isDarkMode}
          onChange={toggleTheme}
        />
      </Header>

      <Wrapper>
        <Select
          showSearch
          loading={isLoading}
          placeholder="Select a country"
          optionFilterProp="children"
          onChange={onSelectChange}
          filterOption={(input, option) =>
            (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
          }
        >
          {countries.map((country: any) => (
            <Option value={country.code} key={country.code}>
              {country.value}
            </Option>
          ))}
        </Select>
      </Wrapper>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Reported Cases" key="1">
          <ReportedCases selectedCountryCode={selectedCountry} covidData={covidData} />
        </TabPane>
        <TabPane tab="Ranked Charts" key="2">
          <RankedCharts selectedCountryCode={selectedCountry} covidData={covidData} />
        </TabPane>
      </Tabs>
    </Container>
  );
};

export default CovidObservation;
