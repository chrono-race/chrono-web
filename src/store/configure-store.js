import { createStore } from 'redux';
import rootReducer from '../reducers/root-reducer';

export default initialState => createStore(rootReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()); // eslint-disable-line
