import { state, getSearchId, getTickets } from './actions.js';
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
  try {
    await getSearchId();
    await getTickets();
    renderTicketList(state.tickets.slice(0, state.numberOfRecords));
    state.currentNumberOfRecords = state.numberOfRecords;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
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
