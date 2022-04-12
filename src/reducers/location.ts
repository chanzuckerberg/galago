const location = (state: string | null = null, action: any) => {
  switch (action.type) {
    case "location set":
      console.log("setting location to", action.data);
      return action.data;
    default:
      return state;
  }
};

export default location;
