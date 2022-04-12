import { Node } from "../d";
import { ingestNextstrain } from "../utils/nextstrainAdapter";

const tree = (state: Node | null = null, action: any) => {
  switch (action.type) {
    case "tree file uploaded":
      const fileReader = new FileReader();

      fileReader.readAsText(action.data, "application/JSON");
      fileReader.onload = (event) => {
        if (event?.target?.result && typeof event.target.result === "string") {
          const tree: Node = ingestNextstrain(JSON.parse(event.target.result));
          console.log("ingested tree", tree);
          return tree;
        }
      };
    case "load demo tree":
      return ingestNextstrain(action.data);
    default:
      return state;
  }
};

export default tree;
