import { createPath } from './functions.js';

export const state = {
  url: 'https://front-test.beta.aviasales.ru',
  searchId: '',
  tickets: [],
  numberOfRecords: 5,
  currentNumberOfRecords: 0,
};

export const getSearchId = async () => {
  const res = await fetch(createPath(state.url, 'search'));
  const result = await res.json();
  state.searchId = result.searchId;
};

export const getTickets = async () => {
  const res = await fetch(createPath(state.url, 'tickets', { searchId: state.searchId }));
  const result = await res.json();
  state.tickets = result.tickets;
};
