import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import RaceControlMessages from './RaceControlMessagesComponent';

const RaceControlMessagesContainer = ({ messages }) => (
  <RaceControlMessages messages={messages} />
);

RaceControlMessagesContainer.propTypes = {
  messages: PropTypes.instanceOf(Immutable.List).isRequired,
};

function mapStateToProps(state) {
  return {
    messages: state.session.get('messages'),
  };
}

export default connect(mapStateToProps)(RaceControlMessagesContainer);
