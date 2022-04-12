const division = (state: string | null = null, action: any) => {
  switch (action.type) {
    case "division set":
      return action.data;
    default:
      return state;
  }
};

export default division;
