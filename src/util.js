import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

export const sortData = (data) => {
  const sortedData = [...data];

  return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

export const transformChartData = (data, casesType = "cases") => {
  const chartData = [];
  let LastDataPoint;

  for (let date in data[casesType]) {
    if (LastDataPoint) {
      const newDataPoint = {
        x: date,
        y: data[casesType][date] - LastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    LastDataPoint = data[casesType][date];
  }
  return chartData;
};

const casesTypeColors = {
  cases: {
    hex: "#cc1034",
    selected: "#2b0000",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    selected: "#0e2a00",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    selected: "#2b0000",
    multiplier: 2000,
  },
};

export const showDataOnMap = (data, casesType, selectedCountry) =>
  data.map((country, index) => (
    <Circle
      key={index}
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={
        country.countryInfo.iso2 === selectedCountry
          ? casesTypeColors[casesType].selected
          : casesTypeColors[casesType].hex
      }
      fillColor={casesTypeColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{
              backgroundImage: `url(${country.countryInfo.flag})`,
            }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-cases">
            Cases: {numeral(country.cases).format("0.0a")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0.0a")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0.0a")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";
