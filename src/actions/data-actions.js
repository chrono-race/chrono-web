import * as types from './action-types';

export const backlogReceived = messages => ({
  type: types.BACKLOG_RECEIVED,
  messages,
});

export const eventsReceived = messages => ({
  type: types.EVENTS_RECEIVED,
  messages,
});
