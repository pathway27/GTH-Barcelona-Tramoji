import React from "react";
import styled from "styled-components";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  Point,
  GoogleMap,
  Marker,
  StreetViewPanorama
} from "react-google-maps";

import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";

import "./styles.css";
import googleMapsStyles from "./googleMapsStyles";

const StyledMapWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
`;

const Map = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(({ emojis, onClick, selectedPoi, onNothingClick }) => {
  const googleMap = window.google;

  const bestData = emojis.map(({ long, ...other }) => {
    return { lng: long, ...other };
  });

  return (
    <GoogleMap
      ref={map => (googleMap.current = map)}
      className={"gm-style"}
      onClick={onNothingClick}
      defaultZoom={5}
      defaultCenter={{ lng: 0, lat: 0 }}
      defaultOptions={{
        disableDefaultUI: true,
        keyboardShortcuts: false,
        styles: googleMapsStyles
      }}
      center={
        selectedPoi
          ? { lat: selectedPoi.lat, lng: selectedPoi.lng }
          : {
              lat: 41.387979,
              lng: 2.170081
            }
      }
      controlSize={20}
    >
      {bestData.map(poi => (
        <MarkerWithLabel
          key={"test"}
          opacity={0}
          position={{ lat: poi.lat, lng: poi.lng }}
          labelAnchor={new window.google.maps.Point(0, 0)}
          labelClass={"emojiContainer"}
          labelStyle={{
            fontSize: "32px"
          }}
          onClick={() => {
            onClick(poi);
          }}
        >
          <div>{poi.emojis}</div>
        </MarkerWithLabel>
      ))}

      <StreetViewPanorama defaultVisible={false} />
    </GoogleMap>
  );
});

const MapWrapper = props => {
  return (
    <StyledMapWrapper>
      <Map {...props} />
    </StyledMapWrapper>
  );
};

export default MapWrapper;
