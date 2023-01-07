import React from 'react';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { useCrashEvent } from '../context/crashEvents';

const { InfoBox } = require('react-google-maps/lib/components/addons/InfoBox');

const MyMapComponent = compose(
  withProps({
    /**
     * Note: create and replace your own key in the Google console.
     * https://console.developers.google.com/apis/dashboard
     * The key "AIzaSyBkNaAGLEVq0YLQMi-PYEMabFeREadYe1Q" can be ONLY used in this sandbox (no forked).
     */
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyAw9xq9XaNT5mcucuuy7Mw7UylX6nM7j7M&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `600px`, width: '95vw', paddingBottom: '24px' }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  const { isLoading, crashEvents, getCrashEvent, crashEvent } = useCrashEvent();
  console.log(crashEvent?.reportNumber);
  if (!isLoading && crashEvents.length > 0) {
    return (
      <GoogleMap defaultZoom={12} defaultCenter={{ lat: crashEvents[0].LATITUDE, lng: crashEvents[0].LONGITUDE }}>
        {crashEvents.map((marker, index) => (
          <Marker
            onClick={() => getCrashEvent(marker.REPORT_NUMBER)}
            key={index}
            position={{ lat: marker.LATITUDE, lng: marker.LONGITUDE }}
          >
            {crashEvent && parseInt(crashEvent.reportNumber, 10) === parseInt(marker.REPORT_NUMBER, 10) && (
              <InfoBox onCloseClick={props.onToggleOpen} options={{ closeBoxURL: ``, enableEventPropagation: true }}>
                <div style={{ backgroundColor: `#f9f9f9`, opacity: 0.95, padding: `12px`, borderRadius: 10 }}>
                  <div style={{ fontSize: `16px`, fontColor: `#08233B` }}>
                    <h3>Crash Details:</h3>
                    <p>Report Number: {crashEvent?.reportNumber}</p>
                    <p>Crash Date: {crashEvent?.crashEvent?.CRASH_DATE}</p>
                    <p>Crash Time: {crashEvent?.crashEvent?.CRASH_TIME}</p>
                    <p>Location: {`${crashEvent?.crashEvent?.ON_STREET}, ${crashEvent?.crashEvent?.CITY}, ${crashEvent?.crashEvent?.COUNTY}`}</p>
                    <h4>Drivers:</h4>
                    {crashEvent?.drivers.map((driver, index) => (
                      <div key={index}>
                        <h5>Driver-{index+1}</h5>
                        <p>AGE: {driver.AGE}, SEX: {driver.SEX}</p>
                      </div>
                    ))}
                    <h4>Vehicles:</h4>
                    {crashEvent?.vehicles.map((driver, index) => (
                      <div key={index}>
                        <h5>Vehicle-{index+1}</h5>
                        <p>Year: {driver.YEAR}, Make: {driver.MAKE}, Model: {driver.MODEL}, Color: {driver.COLOR}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </InfoBox>
            )}
          </Marker>
        ))}
      </GoogleMap>
    );
  }
  return null;
});

export default MyMapComponent;
