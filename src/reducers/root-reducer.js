import { combineReducers } from 'redux';
import selectedDriver from './selected-driver-reducer';
import session from '../session-data/session-reducer';
import sessionList from './session-list-reducer';
import connection from './connection-reducer';
import modelling from '../pace-model/model-reducer';
import pitTime from '../pit-time/pit-time-reducer';

export default combineReducers({
  selectedDriver,
  session,
  sessionList,
  connection,
  modelling,
  pitTime,
});
