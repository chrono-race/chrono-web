import React from 'react';
import { PropTypes } from 'prop-types';
import Immutable from 'immutable';

const SessionListComponent = ({ sessions, onSelect }) => {
  const options = [];
  sessions.forEach((s) => {
    options.push((<option key={s}>{s}</option>));
  });
  return (
    <div className="session-list-selector">
      <select onChange={e => onSelect(e.target.value)}>
        <option>View a past session...</option>
        {options}
      </select>
    </div>
  );
};

SessionListComponent.propTypes = {
  sessions: PropTypes.instanceOf(Immutable.List).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default SessionListComponent;
