import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import Page1 from './Page1Component';

const Page1Container = ({ session }) => (
  <Page1 session={session} />
);

Page1Container.propTypes = {
  session: PropTypes.instanceOf(Immutable.Map).isRequired,
};

function mapStateToProps(state) {
  return {
    session: state.session,
  };
}

export default connect(mapStateToProps)(Page1Container);
