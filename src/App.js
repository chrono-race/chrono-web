import React, { Component } from 'react';
import './App.css';
import DriverHistory from './driver-history/DriverHistoryContainer';
import DriverSelector from './driver-selector/DriverSelectorContainer';

class App extends Component {
  render() {
    return (
      <div className="App container-fluid">
        <div className="row">
          <div className="col-md-1">
            <DriverSelector/>
          </div>
          <div className="col-md-5">
            <DriverHistory/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
