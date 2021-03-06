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
      driver: 'VET',
      gap: 1.23,
      interval: 3.45,
      lapTime: 83.456,
      s1Time: 12.345,
      s2Time: 23.456,
      s3Time: 34.567,
    });
    const driver = fromJS({
      best: {},
      stints: [],
    });
    const sessionBests = fromJS({});
    const wrapper = shallow(<Page1Row
      lastLap={lastLap} driver={driver} sessionBests={sessionBests} totalLaps={20}
    />);
    assert(wrapper.find('tr > td').length.should.equal(9));
    assert(wrapper.find('tr > td.position').text().should.equal('4'));
    assert(wrapper.find('tr > td.driver').text().should.equal('VET'));
    assert(wrapper.find('tr > td.gap').text().should.equal('1.230'));
    assert(wrapper.find('tr > td.interval').text().should.equal('3.450'));
    assert(wrapper.find('tr > td.lapTime').text().should.equal('1:23.456'));
    assert(wrapper.find('tr > td.s1Time').text().should.equal('12.345'));
    assert(wrapper.find('tr > td.s2Time').text().should.equal('23.456'));
    assert(wrapper.find('tr > td.s3Time').text().should.equal('34.567'));
  });

  it('shows lap number for leader', () => {
    const lastLap = fromJS({
      lapNumber: 17,
      position: 1,
      driver: 'VET',
      gap: 1.23,
      interval: 3.45,
      s1Time: 12.345,
      s2Time: 23.456,
      s3Time: null,
    });
    const driver = fromJS({
      best: {},
      stints: [],
    });
    const sessionBests = fromJS({});
    const wrapper = shallow(<Page1Row
      lastLap={lastLap} driver={driver} sessionBests={sessionBests} totalLaps={20}
    />);
    assert(wrapper.find('tr > td').length.should.equal(9));
    assert(wrapper.find('tr > td.position').text().should.equal('1'));
    assert(wrapper.find('tr > td.driver').text().should.equal('VET'));
    assert(wrapper.find('tr > td.gap').text().should.equal('LAP'));
    assert(wrapper.find('tr > td.interval').text().should.equal('17/20'));
  });

  it('shows lap number + 1 for leader in sector 1', () => {
    const lastLap = fromJS({
      lapNumber: 17,
      position: 1,
      driver: 'VET',
      gap: 1.23,
      interval: 3.45,
      s1Time: 12.345,
      s2Time: 23.456,
      s3Time: 34.567,
    });
    const driver = fromJS({
      best: {},
      stints: [],
    });
    const sessionBests = fromJS({});
    const wrapper = shallow(<Page1Row
      lastLap={lastLap} driver={driver} sessionBests={sessionBests} totalLaps={20}
    />);
    assert(wrapper.find('tr > td').length.should.equal(9));
    assert(wrapper.find('tr > td.position').text().should.equal('1'));
    assert(wrapper.find('tr > td.driver').text().should.equal('VET'));
    assert(wrapper.find('tr > td.gap').text().should.equal('LAP'));
    assert(wrapper.find('tr > td.interval').text().should.equal('18/20'));
  });

  it('shows lap number == total laps for leader in sector 1', () => {
    const lastLap = fromJS({
      lapNumber: 20,
      position: 1,
      driver: 'VET',
      gap: 1.23,
      interval: 3.45,
      s1Time: 12.345,
      s2Time: 23.456,
      s3Time: 34.567,
    });
    const driver = fromJS({
      best: {},
      stints: [],
    });
    const sessionBests = fromJS({});
    const wrapper = shallow(<Page1Row
      lastLap={lastLap} driver={driver} sessionBests={sessionBests} totalLaps={20}
    />);
    assert(wrapper.find('tr > td').length.should.equal(9));
    assert(wrapper.find('tr > td.position').text().should.equal('1'));
    assert(wrapper.find('tr > td.driver').text().should.equal('VET'));
    assert(wrapper.find('tr > td.gap').text().should.equal('LAP'));
    assert(wrapper.find('tr > td.interval').text().should.equal('20/20'));
  });

  it('shows pit for driver in pits', () => {
    const lastLap = fromJS({
      position: 4,
      driver: 'VET',
      gap: 1.23,
      interval: 3.45,
      lapTime: 83.456,
      s1Time: 12.345,
      s2Time: 23.456,
      s3Time: 34.567,
    });
    const sessionBests = fromJS({});
    const driver = fromJS({
      best: {},
      currentStatus: 'pit',
      stints: [],
    });
    const wrapper = shallow(<Page1Row
      lastLap={lastLap} driver={driver} sessionBests={sessionBests} totalLaps={20}
    />);
    assert(wrapper.find('tr > td').length.should.equal(9));
    assert(wrapper.find('tr > td.pit').text().should.equal('pit'));
  });
});
