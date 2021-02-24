/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { createPath } from './functions.js';

export const state = {
  url: 'https://front-test.beta.aviasales.ru',
  searchId: '',
  tickets: [],
  copyTickets: [],
  numberOfRecords: 5,
  currentNumberOfRecords: 0,
  filters: { all: true },
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
  state.copyTickets = result.tickets;
};

export const getFilteredTickets = (e, form) => {
  const { value, checked } = e.target;
  const { copyTickets, filters } = state;
  const filterByAll = document.getElementById('all');

  state.filters[value] = checked;

  if (value !== 'all') {
    filterByAll.checked = false;
    state.filters.all = false;
  }

  const selectedFilters = Object.keys(filters).filter(key => filters[key]);
  if (!selectedFilters.length) {
    state.tickets = copyTickets;
    return copyTickets;
  }
  if (selectedFilters.includes('all')) {
    Array.from(form.elements)
      .slice(1)
      .forEach(element => {
        if (element.checked) element.checked = false;
      });
    selectedFilters.forEach(item => {
      if (item === 'all') return;
      state.filters[item] = false;
    });
    state.tickets = copyTickets;
    return copyTickets;
  }
  const filterTickets = () =>
    copyTickets.filter(item => selectedFilters.includes(String(item.segments[0].stops.length)));
  const filteredTickets = filterTickets();
  state.tickets = filteredTickets;
  return filteredTickets;
};
