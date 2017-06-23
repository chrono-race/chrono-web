import React from 'react';
import { PropTypes } from 'prop-types';

const Page1 = ({ raceName }) => (
  <div>{raceName}</div>
  );

Page1.propTypes = {
  raceName: PropTypes.string.isRequired,
};

export default Page1;
