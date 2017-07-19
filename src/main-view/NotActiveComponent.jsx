import React from 'react';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';
import SessionList from './SessionListComponent';

function toSimpleTime(time) {
  let hours = Math.floor(time / 3600);
  let minutes = Math.floor((time - (hours * 3600)) / 60);
  let seconds = time - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = `0${hours}`; }
  if (minutes < 10) { minutes = `0${minutes}`; }
  if (seconds < 10) { seconds = `0${seconds}`; }
  return `${hours}:${minutes}:${seconds}`;
}

function getConnectMessage(time) {
  if (isNaN(time)) {
    return undefined;
  }
  return (<div>Connecting in <b>{toSimpleTime(time)}</b></div>);
}

const NotActiveComponent = ({ secondsUntilConnect, sessions, onSelect }) => (
  <div className="App container-fluid full-height">
    <div className="row">
      <div className="col-md-4" />
      <div className="col-md-4 panel not-active-timer">
        There is no session currently active <br /><br />
        {getConnectMessage(secondsUntilConnect)} <br /><br />
        <SessionList sessions={sessions} onSelect={onSelect} />
      </div>
    </div>
  </div>
);

NotActiveComponent.propTypes = {
  secondsUntilConnect: PropTypes.number.isRequired,
  sessions: PropTypes.instanceOf(Immutable.List).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default NotActiveComponent;

