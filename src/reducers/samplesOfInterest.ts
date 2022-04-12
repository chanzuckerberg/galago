const samplesOfInterest = (state: any, action: any) => {
  switch (action.type) {
    case "submit button clicked":
      console.log("setting samples of interest to", action.data);
      return action.data;

    default:
      return state;
  }
};

export default samplesOfInterest;
