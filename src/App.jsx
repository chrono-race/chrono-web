import React from 'react';
import './App.css';
import DriverHistory from './driver-history/DriverHistoryContainer';
import DriverSelector from './driver-selector/DriverSelectorContainer';
import Page1 from './page1/Page1Container';
import TimeOfDay from './time-of-day/TimeOfDayContainer';

const App = () => (
  <div className="App container-fluid full-height">
    <div className="row first-row">
      <div className="col-md-1 left-pane">
        <DriverSelector />
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
      <div className="col-md-4" />
      <div className="col-md-2">
        <TimeOfDay />
      </div>
    </div>
  </div>
);

export default App;
