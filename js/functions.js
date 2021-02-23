export const createPath = (url, pathname, params = {}) => {
  const result = new URL(pathname, url);
  Object.keys(params).forEach(key => result.searchParams.append(key, params[key]));
  return result;
};

export const numberWithSpaces = x => {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join('.');
};

export const getTimeFromMins = mins => {
  const hours = Math.trunc(mins / 60);
  const minutes = mins % 60;
  const result = { hours, minutes };
  return result;
};

export const getFlightTime = (date, mins) => {
  const duration = getTimeFromMins(mins);
  const departureTime = new Date(date).toLocaleTimeString('en-GB').split(':');
  const [departureHour, departureMins] = departureTime;
  const arrivalHour = (+departureHour + duration.hours) % 24;
  const arrivalMins = (+departureMins + duration.minutes) % 60;
  const formatNumber = x => (x < 10 ? `0${x}` : `${x}`);
  const result = {
    departureTime: `${departureHour}:${departureMins}`,
    arrivalTime: `${formatNumber(
      arrivalHour + Math.trunc((+departureMins + duration.minutes) / 60),
    )}:${formatNumber(arrivalMins)}`,
  };
  return result;
};
