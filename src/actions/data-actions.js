import * as types from './action-types';

export const backlogReceived = (messages) => {
  return {
    type: types.BACKLOG_RECEIVED,
    messages,
  }
};

export const eventsReceived = (messages) => {
  return {
    type: types.EVENTS_RECEIVED,
    messages,
  }
};
