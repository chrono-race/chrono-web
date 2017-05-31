import React from 'react';
import './App.css';
import DriverHistory from './driver-history/DriverHistoryContainer';
import DriverSelector from './driver-selector/DriverSelectorContainer';
import Page1 from './page1/Page1Container';

const App = () => (
  <div className="App container-fluid full-height">
    <div className="row full-height">
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
  </div>
);

export default App;
