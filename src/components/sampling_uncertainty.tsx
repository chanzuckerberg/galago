import { Node } from "../d";

// THIS KIND OF CARD DESCRIBES A DATASET
type DatasetProps = {
  // data: { [key: string]: Node };
};

// PACKAGE EACH INSIGHT AS ITS OWN REACT COMPONENT SO THAT WE CAN EMBED LOGIC AND DATA WITHIN THE TEXT AND UPDATE IT WHEN THE DATA INPUT CHANGES
function SamplingBias(props: DatasetProps) {
  // const { data } = props;

  return (
    <div
      style={{
        margin: "auto",
        maxWidth: "50em",
      }}
    >
      {/* SUBTITLE: WHAT QUESTION ARE WE ANSWERING? */}
      <h4>
        [WIP] How representative is your dataset relative to publicly available
        data?
        <br />
        (Should we be concerned about sampling bias changing the interpretations
        in this report?)
      </h4>

      {/* TITLE: TAKEHOME / BRIEF ANSWER TO THE QUESTION */}
      <h2>{`This dataset contains X% of publicly available data within X mutations of your samples.`}</h2>
      {/* BODY: SUMMARY OF SUPPORTING DATA AND DEFINITION OF TERMS */}
      <p>{`Inline plot of dataset distribution across space and time coming soon`}</p>
      <p>{`Write up some explanation of how we can only make inferences based on the data we know exists and missing data can skew our interpretations. `}</p>
      <div
        style={{ maxWidth: 400, overflow: "scroll", border: "5px solid black" }}
      >
        <div
          style={{
            border: "3px solid pink",
            display: "flex",
            flexDirection: "row",
            width: 2000,
          }}
        >
          <div
            style={{
              border: "1px solid blue",
              display: "flex",
              flexDirection: "column",
              margin: 0,
              padding: 0,
            }}
          >
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              Location
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              Humbolt County
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              Other counties in California
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              Other US states
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              Other countries
            </p>
          </div>
          <div
            style={{
              border: "1px solid red",
              display: "flex",
              flexDirection: "column",
              margin: 0,
              padding: 0,
            }}
          >
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              Last 4 weeks
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              53/274 (19.4%)
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              21/2,532
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              4/100k
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              3/1.4MM
            </p>
          </div>
          <div
            style={{
              border: "1px solid red",
              display: "flex",
              flexDirection: "column",
              margin: 0,
              padding: 0,
            }}
          >
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              Last 4 weeks
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              53/274 (19.4%)
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              21/2,532
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              4/100k
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              3/1.4MM
            </p>
          </div>
          <div
            style={{
              border: "1px solid red",
              display: "flex",
              flexDirection: "column",
              margin: 0,
              padding: 0,
            }}
          >
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              Last 4 weeks
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              53/274 (19.4%)
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              21/2,532
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              4/100k
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              3/1.4MM
            </p>
          </div>
          <div
            style={{
              border: "1px solid red",
              display: "flex",
              flexDirection: "column",
              margin: 0,
              padding: 0,
            }}
          >
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              Last 4 weeks
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              53/274 (19.4%)
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              21/2,532
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              4/100k
            </p>
            <p style={{ border: "1px solid green", width: 100, height: 200 }}>
              3/1.4MM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SamplingBias;
