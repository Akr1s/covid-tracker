import "./App.css";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import InfoBox from "./Components/InfoBox/InfoBox";
import Map from "./Components/Map/Map";
import Table from "./Components/Table/Table";
import LinearGraph from "./Components/LinearGraph/LinearGraph";
import { prettyPrintStat, sortData } from "./util";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("worldwide");
  const [mapCenter, setMapCenter] = useState([34.80746, 18.4796]);
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://disease.sh/v3/covid-19/countries");
        const data = await response.json();
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => setCountryInfo(data));
  }, []);

  //remove zoom problem
  useEffect(() => {
    if (selectedCountry === "worldwide") {
      setMapZoom(2);
    } else {
      setMapZoom(4);
    }
  }, [mapCenter, selectedCountry]);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    const response = await fetch(url);
    const data = await response.json();
    setSelectedCountry(countryCode);
    setCountryInfo(data);

    //remove worldwide select problem

    let centerArray;
    if (countryCode === "worldwide") {
      centerArray = [34.80746, 18.4796];
    } else {
      centerArray = [data.countryInfo.lat, data.countryInfo.long];
    }
    setMapCenter(centerArray);
  };
  return (
    <div className="app">
      <main>
        <header className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={selectedCountry}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country, index) => (
                <MenuItem key={index} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </header>
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(event) => setCasesType("cases")}
            title="Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(event) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(event) => setCasesType("deaths")}
            title="Deads"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
          selectedCountry={selectedCountry}
        />
      </main>
      <Card>
        <CardContent>
          <h3>Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="newCasesTitle">WorldWide new {casesType}</h3>
          <LinearGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
