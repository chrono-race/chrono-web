import React from 'react';
import Immutable from 'immutable';
import { PropTypes } from 'prop-types';
import { toTimeOfDay } from '../session-data/timing-utils';

const RaceControlMessageRow = msg => (
  <div className="row" key={msg.get('timestamp')}>
    <div className="col-md-1 timestamp">{toTimeOfDay(msg.get('timestamp'))}</div>
    <div className="col-md-11 message">{msg.get('message')}</div>
  </div>
);

const RaceControlMessages = ({ messages }) => {
  const messageRows = messages.reverse().map(msg => RaceControlMessageRow(msg));
  return (<div className="race-control-messages container-fluid">{messageRows}</div>);
};

RaceControlMessages.propTypes = {
  messages: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default RaceControlMessages;
