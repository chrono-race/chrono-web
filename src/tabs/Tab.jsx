import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

class Tab extends React.Component {
  render() {
    const children = React.Children.map(this.props.children, child => React.cloneElement(child));
    return (
      <div>{children}</div>
    );
  }
}

Tab.propTypes = {
  title: PropTypes.string.isRequired,
};

export default connect()(Tab);
