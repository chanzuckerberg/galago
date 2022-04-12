const samplesOfInterestNames = (state: any = "", action: any) => {
  switch (action.type) {
    case "input string changed":
      let input_string: string = action.data;
      let sample_names: string[] = input_string
        .split(/[,\s]+/)
        .map((s: string) => s.trim());
      console.log("setting sample names to ", sample_names);
      return sample_names;
    default:
      return state;
  }
};

export default samplesOfInterestNames;
