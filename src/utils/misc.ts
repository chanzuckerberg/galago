export const random_sample = (n: number, array: Array<any>) => {
  if (n > array.length) {
    n = array.length;
  }

  let indices: Array<number> = []; // keep track of the indices previously selected

  for (let i = 0; i < n; i++) {
    // for each of n iterations...
    let index: number = NaN;
    while (!indices.includes(index)) {
      // choose a random index (redraw until you get one that has not been chosen before)
      index = Math.floor(Math.random() * array.length);
    }
    indices.push(index);
  }

  let selected: Array<any> = [];
  for (let i = 0; i < n; i++) {
    selected.push(array[i]);
  }
  return selected;
};

//NOTE: isLeapYear and numericToDateObject borrowed from github.com/nextstrain/auspice with permission. Their license applies to reuse.
export const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const numericToDateObject = (numDate: number) => {
  /* Beware: for `Date`, months are 0-indexed, days are 1-indexed */
  const fracPart = numDate % 1;
  const year = Math.floor(numDate);
  const nDaysInYear = isLeapYear(year) ? 366 : 365;
  const nDays = fracPart * nDaysInYear;
  const date = new Date(
    new Date(year, 0, 1).getTime() + nDays * 24 * 60 * 60 * 1000
  );
  // console.log(year, nDays);
  return date;
};
