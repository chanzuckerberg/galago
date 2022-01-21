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

  let selected: Node[] = [];
  for (let i = 0; i < n; i++) {
    selected.push(array[i]);
  }
  return selected;
};
