# Contribute

## Important: make sure you're in the right repo!

We have two `galago` repositories at CZI. `galago-labs` is only used for internal experimentation; [`galago` is where you want to be](https://github.com/chanzuckerberg/galago/blob/main/CONTRIBUTING.md) :\)

## Code of conduct

To ensure a welcoming experience for our entire community, this project adheres to the Contributor Covenant [code of conduct](https://github.com/chanzuckerberg/.github/tree/master/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [opensource@chanzuckerberg.com](mailto:opensource@chanzuckerberg.com).

If you have any questions about any of this stuff, just ask! :\)

## Contributing ideas and issues

We'd love to hear from you! If you're comfortable with Github, please submit bug reports and feature requests through [Github issues](https://github.com/chanzuckerberg/galago/issues) or our [discussion board](https://github.com/chanzuckerberg/galago/discussions). Otherwise, feel free to send us an email at [galago@chanzuckerberg.com](mailto:galago@chanzuckerberg.com)-- we'd love to hear from you.

## Direct contributions

We warmly welcome contributions from the community to Galago's content and/or code! If you have an idea for a contribution, we encourage you to open a [github issue](https://github.com/chanzuckerberg/galago/issues) or [discussion](https://github.com/chanzuckerberg/galago/discussions) to discuss your idea with our team and other community members. We'd love to collaborate with you.

### Getting started - scientific content

If you have an idea or a fix to contribute to the scientific content of Galago, but aren't familiar with Typescript, no worries! Please feel free to start a [discussion](https://github.com/chanzuckerberg/galago/discussions), where you can work together with someone on our scientific team to agree on the change and we'll help get it implemented.

### Getting started - code

If you are interested in working on `galago` development, you'll need to use git to make a copy of the [project repository](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/working-with-forks) and share your changes.

Please submit any direct contributions by [forking the repository](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/working-with-forks), creating a feature branch, and [submitting a Pull Request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

To install:

- Install node and npm \(we recommend using [nvm](https://github.com/creationix/nvm) if this is your first time with node\)
- `cd path/to/galago`
- `npm install --save`

You can start the app while developing by calling `npm run dev`.

If you have any questions about developing or contributing, come hang out with us by posting on the [discussion board](https://github.com/chanzuckerberg/galago/discussions).

### Contributing code

This project has made a few foundational design choices:

- The front-end is built with [`react`](https://reactjs.org/), [`redux`](https://redux.js.org/), [`d3`](https://github.com/d3/d3), and [`mui`](https://mui.com/core/)
- Galago is designed to be serverless. It is therefore hosted as a static web page, which means that any computation has to be limited to what can be executed in real-time in the browser.
