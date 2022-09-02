# Galago

## [Demo](https://galago.czgenepi.org/) | [Rough roadmap](https://github.com/orgs/chanzuckerberg/projects/14/views/7) | Status: prototype

This is a prototype repository for research related to making genomic epidemiology more accessible and interpretable through narrative and visual reports. Currently, galago is a serverless, standalone web application that ingests phylogenetic trees and renders responsive reports containing insights about clades or outbreaks of interest. Contact sidneymbell@chanzuckerberg.com with any questions or comments.

## Using a Public Data Source

If you have a publicly available Nextstrain JSON tree, you can automatically fetch and use it by accessing the site through the `fetch` path.

```
https://galago.czgenepi.org/#/fetch/YOUR_DATA_URL_HERE
 --- for example... ---
https://galago.czgenepi.org/#/fetch/example.com/sometree.json
```

The above example would load Galago using the tree file specified at `https://example.com/sometree.json`. When no `http[s]` schema is present in the given URL, it automatically assumes it is an `https` schema. If you would like to specify the schema, you can enter it in the URL. For example, `https://galago.czgenepi.org/#/fetch/http://example.com/another/tree/route` would also be valid.

## Development Process

```
git clone https://github.com/chanzuckerberg/galago.git
cd galago
npm install --save
```

Start up the development server:
`npm run dev`

Build for [deployment](https://dev.to/imomaliev/creating-vite-vue-ts-template-deploy-to-github-pages-4c88):
`npm run build`

## Data

Galago ingests the following data via user upload / input:

- A tree file, in Nextstrain JSON format.
- A list of sample IDs associated with a potential outbreak

In the future, we will also enable URL-based API ingestion and provide a demo dataset.

## Security

Please note: If you believe you have found a security issue, please responsibly disclose by contacting us at security@chanzuckerberg.com

## Contributing

We warmly welcome contributions from the scientific and technical community! Please open an issue with suggestions, bug reports, and feature requests. We also welcome code contributions and PRs; please open an issue first describing the goal of your PR and your planned approach. Finally, we are in the process of transitioning all of our insight components to markdown to make direct contribution more accessible to fellow scientists -- stay tuned for updated contributor guidelines.

This project welcomes our whole community and is dedicated to preserving a constructive and inclusive culture. As such, we strictly adhere to the Contributor Covenant code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to opensource@chanzuckerberg.com and we will take immediate action.
