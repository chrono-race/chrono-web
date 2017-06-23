import React from 'react';
import './App.css';
import DriverHistory from './driver-history/DriverHistoryContainer';
import DriverSelector from './driver-selector/DriverSelectorContainer';
import Page1 from './page1/Page1Container';
import TimeOfDay from './time-of-day/TimeOfDayContainer';
import RaceName from './race-name/RaceNameContainer';
import RaceControlMessages from './race-control-messages/RaceControlMessagesContainer';

const App = () => (
  <div className="App container-fluid full-height">
    <div className="row first-row">
      <div className="col-md-1 left-pane">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2 left-pane">
              <DriverSelector choice="driver" />
            </div>
            <div className="col-md-1" />
            <div className="col-md-2 opponent-pane">
              <DriverSelector choice="opponent" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-5 data-pane">
        <DriverHistory />
      </div>
      <div className="col-md-5 data-pane">
        <Page1 />
      </div>
    </div>
    <div className="row second-row" />
    <div className="row third-row">
      <div className="col-md-6 pane">
        <RaceControlMessages />
      </div>
      <div className="col-md-2">
        <TimeOfDay />
      </div>
      <div className="col-md-4">
        <RaceName />
      </div>
    </div>
  </div>
);

export default App;
