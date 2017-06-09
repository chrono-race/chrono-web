import React from 'react';
import Immutable from 'immutable';
import { PropTypes } from 'prop-types';

const RaceControlMessages = ({ messages }) => {
  const messageRows = messages.reverse().map(msg => <div>{msg}</div>);
  return (<div className="race-control-messages">{messageRows}</div>);
};

RaceControlMessages.propTypes = {
  messages: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default RaceControlMessages;
