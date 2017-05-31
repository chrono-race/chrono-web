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

const socket = io.connect('http://localhost:8000/');
socket.on('backlog', (data) => {
  console.log('Got backlog:', data.events);
  store.dispatch(backlogReceived(data.events));
});
socket.on('events', (data) => {
  console.log('Got events:', data.events);
  store.dispatch(eventsReceived([data.events]));
});
