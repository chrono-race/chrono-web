import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import RaceName from './RaceNameComponent';

const RaceNameContainer = ({ raceName }) => (
  <RaceName raceName={raceName} />
);

RaceNameContainer.propTypes = {
  raceName: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    raceName: state.session.get('raceName'),
  };
}

export default connect(mapStateToProps)(RaceNameContainer);
