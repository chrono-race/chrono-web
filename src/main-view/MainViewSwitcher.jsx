import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import fetch from 'node-fetch';
import MainView from './MainViewComponent';
import NotActive from './NotActiveComponent';
import { sessionListReceived, backlogReceived } from '../actions/data-actions';

class MainViewContainer extends React.Component {
  constructor() {
    super();
    this.onSelectSession = this.onSelectSession.bind(this);
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_SERVER}sessions`)
    .then(res => res.json())
    .then((json) => {
      this.props.onSessionsReceived(json);
    })
    .catch((e) => {
      console.log(`Error fetching sessions ${e}`);
    });
  }

  onSelectSession(session) {
    console.log('Disconnecting socket');
    this.props.connection.socket.disconnect();
    console.log(`Loading ${session}...`);
    fetch(`${process.env.REACT_APP_SERVER}sessions/${session}`)
    .then(res => res.json())
    .then((json) => {
      console.log('Session loaded');
      this.props.onSessionLoaded(json);
    })
    .catch((e) => {
      console.log(`Error fetching sessions ${e}`);
    });
  }

  render() {
    const { active, secondsUntilConnect, sessionList } = this.props;

    if (active) {
      return (
        <MainView />
      );
    }
    return (
      <NotActive
        secondsUntilConnect={secondsUntilConnect}
        sessions={sessionList}
        onSelect={this.onSelectSession}
      />);
  }
}

MainViewContainer.propTypes = {
  active: PropTypes.bool.isRequired,
  secondsUntilConnect: PropTypes.number,
  onSessionsReceived: PropTypes.func.isRequired,
  onSessionLoaded: PropTypes.func.isRequired,
  sessionList: PropTypes.instanceOf(Immutable.List),
  connection: PropTypes.object,  // eslint-disable-line
};

MainViewContainer.defaultProps = {
  secondsUntilConnect: NaN,
  sessionList: Immutable.fromJS([]),
  connection: {},
};

function mapStateToProps(state) {
  return {
    active: state.session.get('active'),
    secondsUntilConnect: state.session.get('secondsUntilConnect'),
    sessionList: state.sessionList,
    connection: state.connection,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSessionsReceived: sessions => dispatch(sessionListReceived(sessions)),
    onSessionLoaded: events => dispatch(backlogReceived(events)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainViewContainer);
