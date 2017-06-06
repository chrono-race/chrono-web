import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import io from 'socket.io-client';
import App from './App';
import configureStore from './store/configure-store';
import './index.css';
import './css/main.css';
import { backlogReceived, eventsReceived } from './actions/data-actions';

const store = configureStore();

ReactDOM.render(
// eslint-disable-next-line
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

console.log(`connecting to ${process.env.REACT_APP_SERVER}`);
const socket = io.connect(process.env.REACT_APP_SERVER);
socket.on('backlog', (data) => {
  console.log('Got backlog:', data.events);
  store.dispatch(backlogReceived(data.events));
});
socket.on('events', (data) => {
  console.log('Got events:', data.events);
  store.dispatch(eventsReceived([data.events]));
});
