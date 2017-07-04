import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import MainView from './MainViewComponent';
import NotActive from './NotActiveComponent';

const MainViewContainer = ({ active, secondsUntilConnect }) => {
  if (active) {
    return (
      <MainView />
    );
  }
  return (<NotActive secondsUntilConnect={secondsUntilConnect} />);
};

MainViewContainer.propTypes = {
  active: PropTypes.bool.isRequired,
  secondsUntilConnect: PropTypes.number,
};

MainViewContainer.defaultProps = {
  secondsUntilConnect: NaN,
};

function mapStateToProps(state) {
  return {
    active: state.session.get('active'),
    secondsUntilConnect: state.session.get('secondsUntilConnect'),
  };
}

export default connect(mapStateToProps)(MainViewContainer);
