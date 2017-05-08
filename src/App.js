import React, { Component } from 'react';
import './App.css';
import DriverHistory from './driver-history/DriverHistoryContainer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <DriverHistory/>
      </div>
    );
  }
}

export default App;
