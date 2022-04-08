const report = (state: number = 0, action: any) => {
  switch (action.type) {
    case "user submit samples of interest":
      return state + action.data;
    default:
      return state;
  }
};

export default report;
