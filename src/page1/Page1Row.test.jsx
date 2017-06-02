import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import Page1Row from './Page1Row';

should();

describe('page1 row', () => {
  it('shows values', () => {
    const lastLap = fromJS({
      position: 4,
    });
    const driverBests = fromJS({});
    const sessionBests = fromJS({});
    const wrapper = shallow(<Page1Row
      lastLap={lastLap} driverBests={driverBests} sessionBests={sessionBests}
    />);
    assert(wrapper.find('tr > td').length.should.equal(8));
    assert(wrapper.find('tr > td.position').text().should.equal('4'));
  });
});
