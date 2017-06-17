import React from 'react';
import { PropTypes } from 'prop-types';

const Page1 = ({ racename }) => (
  <div>{racename}</div>
  );

Page1.propTypes = {
  racename: PropTypes.string.isRequired,
};

export default Page1;
