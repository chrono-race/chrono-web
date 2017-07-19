import { combineReducers } from 'redux';
import selectedDriver from './selected-driver-reducer';
import session from '../session-data/session-reducer';
import sessionList from './session-list-reducer';

export default combineReducers({
  selectedDriver,
  session,
  sessionList,
});
