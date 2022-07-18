export const sortDates = (dates: Date[]) => {
  return dates.sort((a, b) => a.getTime() - b.getTime());
};

export const getDateRange = (dates: Date[]) => {
  const sortedDates = sortDates(dates);
  const minDate = sortedDates[0];
  const maxDate = sortedDates.slice(-1)[0];
  return {
    minDate: minDate,
    maxDate: maxDate,
    dateSpan: maxDate.getTime() - minDate.getTime(),
  };
};

export const binWeeklyDate = (date: Date) => {
  // return the Saturday week ending date
  // "epi weeks" end on Saturdays per CDC
  const offsetToNextSaturday = 6 - date.getDay();
  const nextSaturdayDate = new Date(date);
  nextSaturdayDate.setDate(nextSaturdayDate.getDate() + offsetToNextSaturday);
  return nextSaturdayDate;
};

export const binMonthlyDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth());
};

export const getTimepoints = (
  startDate: Date,
  endDate: Date,
  scale: "weekly" | "monthly"
) => {
  const startBin =
    scale === "weekly" ? binWeeklyDate(startDate) : binMonthlyDate(startDate);

  const endBin =
    scale === "weekly" ? binWeeklyDate(endDate) : binMonthlyDate(endDate);

  let timePoints = [startBin];

  let thisTP: Date = startBin;

  while (thisTP < endBin) {
    let newTP = new Date(thisTP);
    if (scale === "weekly") {
      newTP.setDate(newTP.getDate() + 7);
    } else {
      newTP.setMonth(thisTP.getMonth() + 1);
    }
    timePoints.push(newTP);
    thisTP = newTP;
  }
  return timePoints;
};

//NOTE: isLeapYear and numericToDateObject borrowed from github.com/nextstrain/auspice with permission. Their license applies to reuse.
export const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const numericToDateObject = (numDate: number) => {
  if (isNaN(numDate)) {
    return NaN;
  }

  /* Beware: for `Date`, months are 0-indexed, days are 1-indexed */
  const fracPart = numDate % 1;
  const year = Math.floor(numDate);
  const nDaysInYear = isLeapYear(year) ? 366 : 365;
  const nDays = fracPart * nDaysInYear;
  const date = new Date(year, 0, 1);
  date.setDate(date.getDate() + nDays);
  return date;
};
