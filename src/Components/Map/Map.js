import React from "react";
import "./Map.css";
import { Map as MapContainer, TileLayer, Marker } from "react-leaflet";
import { showDataOnMap } from "../../util";
import { divIcon } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";

function Map({ countries, casesType, center, zoom, selectedCountry }) {
  const iconMarkup = renderToStaticMarkup(
    <i className=" fa fa-map-marker-alt fa-3x" />
  );
  const customMarkerIcon = divIcon({
    html: iconMarkup,
  });
  return (
    <div className="map">
      <MapContainer center={center} zoom={zoom} animate={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showDataOnMap(countries, casesType, selectedCountry)}
        {selectedCountry !== "worldwide" && (
          <Marker position={center} icon={customMarkerIcon}></Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default Map;
