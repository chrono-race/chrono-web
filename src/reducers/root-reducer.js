import { combineReducers } from 'redux';
import selectedDriver from './selected-driver-reducer';
import session from '../session-data/session-reducer';

export default combineReducers({
  selectedDriver,
  session,
});
