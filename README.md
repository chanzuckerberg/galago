# Galago

## Status: unstable prototype

This is a prototype repository for research related to making genomic epidemiology more accessible and interpretable through narrative and visual reports. Currently, galago is a serverless, standalone web application that ingests phylogenetic trees and renders responsive reports containing insights about clades or outbreaks of interest. Contact sidneymbell@chanzuckerberg.com with any questions or comments.

## Usage

`npm install`  
`npm run dev`

## Architecture

#### Client

React, with vite  
Typescript (see `src/d.ts` for types)

#### Data

Galago currently ingests phylogenetic trees in the form of Nextstrain JSON files; we may extend to other formats in the future.
We also ingest a file of count data for the number of publicly available sequences contained in GISAID.

These files are currently stored locally for development. In the future, we will set up an API to enable user data ingestion (and possibly check in a demo dataset for development purposes).

## Security

Please note: If you believe you have found a security issue, please responsibly disclose by contacting us at security@chanzuckerberg.com

## Contributing

We warmly welcome contributions from the scientific and technical community! Please open an issue with suggestions, bug reports, and feature requests. We also welcome code contributions and PRs; please open an issue first describing the goal of your PR and your planned approach. Finally, we are in the process of transitioning all of our insight components to markdown to make direct contribution more accessible to fellow scientists -- stay tuned for updated contributor guidelines.

This project welcomes our whole community and is dedicated to preserving a constructive and inclusive culture. As such, we strictly adhere to the Contributor Covenant code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to opensource@chanzuckerberg.com and we will take immediate action.
