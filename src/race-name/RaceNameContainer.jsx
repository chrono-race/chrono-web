import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import RaceName from './RaceNameComponent';

const RaceNameContainer = ({ racename }) => (
  <RaceName racename={racename} />
);

RaceNameContainer.propTypes = {
  racename: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    racename: state.session.get('racename'),
  };
}

export default connect(mapStateToProps)(RaceNameContainer);
