import React from 'react';
import DriverHistory from '../driver-history/DriverHistoryContainer';
import DriverSelector from '../driver-selector/DriverSelectorContainer';
import Page1 from '../page1/Page1Container';
import TimeOfDay from '../time-of-day/TimeOfDayContainer';
import RaceName from '../race-name/RaceNameContainer';
import RaceControlMessages from '../race-control-messages/RaceControlMessagesContainer';
import RaceTrace from '../race-trace/RaceTraceComponent';

const MainViewComponent = () => (
  <div className="full-height">
    <div className="driver-selection">
      <DriverSelector choice="driver" />
    </div>
    <div className="opponent-selection">
      <DriverSelector choice="opponent" />
    </div>
    <div className="race-meta-data">
      <div className="race-name">
        <RaceName />
      </div>
      <div className="clock">
        <TimeOfDay />
      </div>
    </div>
    <div className="driver-history-container">
      <DriverHistory />
    </div>
    <div className="race-control-messages">
      <RaceControlMessages />
    </div>
    <div className="page1">
      <Page1 />
    </div>
    <div className="race-trace">
      <RaceTrace />
    </div>
  </div>
);

export default MainViewComponent;

