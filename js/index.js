/* eslint-disable no-shadow */
import { state, getSearchId, getTickets, getFilteredTickets, getSortedTickets } from './actions.js';
import { numberWithSpaces, getTimeFromMins, getFlightTime } from './functions.js';

const renderTitleStops = stops => {
  if (!stops.length || stops.length >= 10) return `${stops.length} пересадок`;
  if (stops.length === 1) return `${stops.length} пересадка`;
  if (stops.length > 1) return `${stops.length} пересадки`;
};

const renderSegment = segment => {
  const { hours, minutes } = getTimeFromMins(segment.duration);
  const { departureTime, arrivalTime } = getFlightTime(segment.date, segment.duration);
  return `
    <div class="ticket-content-direction">
      <p class="content-title">${segment.origin} - ${segment.destination}</p>
      <p class="content-value">${departureTime} - ${arrivalTime}</p>
    </div>
    <div class="ticket-content-duration">
      <p class="content-title">В пути</p>
      <p class="content-value">${hours}ч ${minutes}м</p>
    </div>
    <div class="ticket-content-stops">
      <p class="content-title">${renderTitleStops(segment.stops)}</p>
      <p class="content-value">${segment.stops.join(', ')}</p>
    </div>
  `;
};

const renderTicketList = list => {
  const listEl = document.querySelector('.ticket-list');

  const tickets = list.map(
    ticket => `
    <li class="ticket-item">
      <div class="ticket-item-header">
        <p class="ticket-header-price">${numberWithSpaces(ticket.price)} P</p>
        <img class="ticket-header-logo" src="https://pics.avs.io/99/36/S7@2x.png">
      </div>
      <div class="ticket-item-content">
        ${ticket.segments.map(segment => renderSegment(segment)).join('')}
      </div>
    </li>
  `,
  );

  listEl.innerHTML = tickets.join('');
};

document.addEventListener('DOMContentLoaded', async () => {
  if (!localStorage.searchId) {
    await getSearchId();
  }
  await getTickets();
  renderTicketList(state.tickets.slice(0, state.numberOfRecords));
  state.currentNumberOfRecords = state.numberOfRecords;
});

const loadMoreBtn = document.querySelector('.ticket-list-more-btn');

loadMoreBtn.addEventListener('click', () => {
  const { currentNumberOfRecords, numberOfRecords, tickets } = state;
  const sliceNumber = currentNumberOfRecords + numberOfRecords;
  renderTicketList(tickets.slice(0, sliceNumber));
  state.currentNumberOfRecords = sliceNumber;

  if (sliceNumber >= tickets.length) {
    loadMoreBtn.style.display = 'none';
  }
});

const form = document.querySelector('.form-filters');

Array.from(form.elements).forEach(element => {
  element.addEventListener('input', e => {
    const { value, checked } = e.target;
    const { initialTickets, filters } = state;
    const filterByAll = document.getElementById('all');

    state.filters[value] = checked;

    if (value !== 'all') {
      filterByAll.checked = false;
      state.filters.all = false;
    }

    const selectedFilters = Object.keys(filters).filter(key => filters[key]);
    state.selectedFilters = selectedFilters;

    if (selectedFilters.includes('all')) {
      Array.from(form.elements)
        .slice(1)
        .forEach(element => {
          // eslint-disable-next-line no-param-reassign
          if (element.checked) element.checked = false;
        });
      selectedFilters.forEach(item => {
        if (item === 'all') return;
        state.filters[item] = false;
      });
    }

    const filteredTickets = getFilteredTickets(getSortedTickets(initialTickets));
    renderTicketList(filteredTickets.slice(0, state.numberOfRecords));
    state.currentNumberOfRecords = state.numberOfRecords;
  });
});

const sortItems = document.querySelectorAll('.sort-item');

sortItems.forEach(sortItem => {
  sortItem.addEventListener('click', e => {
    const { target } = e;
    const { initialTickets } = state;

    const list = target.closest('.sort-list');

    if (target.classList.contains('active')) {
      target.classList.remove('active');
      state.sort[target.id] = false;
    } else {
      const activeItem = list.querySelector('.active');
      if (activeItem) {
        activeItem.classList.remove('active');
        state.sort[activeItem.id] = false;
      }
      target.classList.add('active');
      state.sort[target.id] = true;
    }

    const sortedTickets = getSortedTickets(getFilteredTickets(initialTickets));
    renderTicketList(sortedTickets.slice(0, state.numberOfRecords));
    state.currentNumberOfRecords = state.numberOfRecords;
  });
});
