/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { createPath } from './functions.js';

export const state = {
  url: 'https://front-test.beta.aviasales.ru',
  searchId: '',
  tickets: [],
  initialTickets: [],
  numberOfRecords: 5,
  currentNumberOfRecords: 0,
  filters: { all: true },
  selectedFilters: [],
  sort: {
    price: false,
    duration: false,
  },
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
  state.initialTickets = result.tickets;
};

export const getFilteredTickets = list => {
  const { selectedFilters } = state;

  if (!selectedFilters.length || selectedFilters.includes('all')) {
    state.tickets = list;
    return list;
  }
  const filterTickets = () =>
    list.filter(item => selectedFilters.includes(String(item.segments[0].stops.length)));
  const filteredTickets = filterTickets();
  state.tickets = filteredTickets;
  return filteredTickets;
};

export const getSortedTickets = list => {
  const { sort } = state;

  const selectedSort = Object.keys(sort).filter(key => sort[key])[0];
  if (!selectedSort) {
    const sortedTickets = list;
    state.tickets = sortedTickets;
    return sortedTickets;
  }
  const sortedTickets = [...list].sort((a, b) => {
    if (selectedSort === 'price') {
      return a[selectedSort] - b[selectedSort];
    }
    return a.segments[0][selectedSort] - b.segments[0][selectedSort];
  });
  state.tickets = sortedTickets;
  return sortedTickets;
};
