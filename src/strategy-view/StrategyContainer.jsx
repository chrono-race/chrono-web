import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';

const StrategyContainer = ({ session }) => {
  const isOffline = session.get('isOffline');
  // only show strategy container in live mode
  if (isOffline) {
    return (<div />);
  }

  return (
    <div>
      Strategy
    </div>
  );
};

StrategyContainer.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
};

function mapStateToProps(state) {
  return {
    session: state.session,
  };
}

export default connect(mapStateToProps)(StrategyContainer);
