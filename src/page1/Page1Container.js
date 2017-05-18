import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Page1 from './Page1Component';

class Page1Container extends Component {
  render() {
    const { session } = this.props;
    
    return (
      <Page1 session={session}/>
    );
  }
}

Page1Container.propTypes = {
  session: PropTypes.object.isRequired,
};

function mapStateToProps(state, props) {
  return {
    session: state.session,
  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Page1Container);
