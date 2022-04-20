const range = (start, end) => {
  return Array(end - start + 1)
    .fill()
    .map((_, index) => start + index + ":00");
};

const getDateTimeZoneOffset = (date) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .substring(0, 16);
};

export const getFromHours = (selectedDate) => {
  const today = new Date();
  if (selectedDate.getDate() !== today.getDate()) {
    return range(0, 23);
  }
  if (today.getMinutes() > 45 && today.getHours() !== 23) {
    today.setHours(today.getHours() + 1);
  }
  return range(today.getHours(), 23);
};

export const getToHours = (timeString) => {
  let array = timeString.split(":");
  let start = Number(array[0]) + 1;
  if (start === 24) {
    return ["00:00"];
  }
  let timeRange = range(start, 23);
  timeRange.push("00:00");
  return timeRange;
};

export const parseDateFromTimeString = (selectedDate, timeString) => {
  let array = timeString.split(":");
  let date = new Date(selectedDate);
  date.setHours(array[0], 0, 0, 0);
  return date;
};

export const getParamsForUnitsCount = (
  startAt,
  endAt,
  serviceTypeId,
  date,
  isWholeDay
) => {
  let params = {};
  if (isWholeDay) {
    let start = new Date(date);
    start.setHours(0, 0, 0, 0);
    let end = new Date(date);
    end.setHours(23, 59, 0, 0);

    return (params = {
      startAt: getDateTimeZoneOffset(start),
      endAt: getDateTimeZoneOffset(end),
      serviceTypeId: serviceTypeId,
    });
  }

  let start = parseDateFromTimeString(date, startAt);
  let end = parseDateFromTimeString(date, endAt);

  if (end.getHours() === 0) {
    end.setHours(23, 59, 0, 0);
  }

  return (params = {
    startAt: getDateTimeZoneOffset(start),
    endAt: getDateTimeZoneOffset(end),
    serviceTypeId: serviceTypeId,
  });
};

export const getParamsForUserRentSubmit = (
  startAt,
  endAt,
  amount,
  serviceTypeId,
  roomId,
  isWholeDay,
  date
) => {
  let params = {};
  if (isWholeDay) {
    let start = new Date(date);
    start.setHours(0, 0, 0, 0);
    let end = new Date(date);
    end.setHours(23, 59, 0, 0);

    return (params = {
      startAt: getDateTimeZoneOffset(start),
      endAt: getDateTimeZoneOffset(end),
      amount: amount,
      serviceTypeId: serviceTypeId,
      roomId: roomId,
    });
  }

  let start = parseDateFromTimeString(date, startAt);
  let end = parseDateFromTimeString(date, endAt);

  if (end.getHours() === 0) {
    end.setHours(23, 59, 0, 0);
  }

  return (params = {
    startAt: getDateTimeZoneOffset(start),
    endAt: getDateTimeZoneOffset(end),
    amount: amount,
    serviceTypeId: serviceTypeId,
    roomId: roomId,
  });
};
