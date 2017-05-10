import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import configureStore from './store/configure-store';
import './index.css';
import io from 'socket.io-client';
import { backlogReceived, eventsReceived } from './actions/data-actions';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

const socket = io.connect('http://localhost:8000/');
socket.on('backlog', function(data) {
  console.log('Got backlog:', data.events);
  store.dispatch(backlogReceived(data.events));
});
socket.on('events', function(data) {
  console.log('Got events:', data.events);
  store.dispatch(eventsReceived([data.events]));
})
