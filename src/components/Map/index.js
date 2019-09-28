import React from "react";
import styled from "styled-components";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  Point,
  GoogleMap,
  Marker,
  StreetViewPanorama,
  MarkerWithLabel
} from "react-google-maps";
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
)(({ data }) => {
  const googleMap = window.google;
  console.log(googleMap.Point);
  return (
    <GoogleMap
      ref={map => (googleMap.current = map)}
      className={"gm-style"}
      defaultZoom={5}
      defaultCenter={{ lng: 0, lat: 0 }}
      defaultOptions={{
        disableDefaultUI: true,
        keyboardShortcuts: false,
        styles: googleMapsStyles
      }}
      // center={coordinates}
      controlSize={20}
    >
      <MarkerWithLabel position={{ lat: -34.397, lng: 150.644 }} labelAnchor={new window.google.maps.Point(0, 0)} labelStyle={{backgroundColor: "yellow", fontSize: "32px", padding: "16px"}} />
      <StreetViewPanorama defaultVisible={false} />
    </GoogleMap>
  );
});

const MapWrapper = () => {
  return (
    <StyledMapWrapper>
      <Map />
    </StyledMapWrapper>
  );
};

export default MapWrapper;
