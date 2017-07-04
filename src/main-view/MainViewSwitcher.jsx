import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import MainView from './MainViewComponent';
import NotActive from './NotActiveComponent';

const MainViewContainer = ({ active }) => {
  if (active) {
    return (
      <MainView />
    );
  }
  return (<NotActive />);
};

MainViewContainer.propTypes = {
  active: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    active: state.session.get('active'),
  };
}

export default connect(mapStateToProps)(MainViewContainer);
