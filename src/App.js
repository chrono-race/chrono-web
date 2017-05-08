import React, { Component } from 'react';
import './App.css';
import DriverHistory from './driver-history/DriverHistoryContainer';
import DriverSelector from './driver-selector/DriverSelectorContainer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <DriverSelector/>
        <DriverHistory/>
      </div>
    );
  }
}

export default App;
