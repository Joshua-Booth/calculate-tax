<div align="center" style="text-align:center">
  <h1 style="padding-top:0;margin-top:20px">Calculate Tax</h1>
  <p style="padding-top:20px">A PWA for calculating New Zealand personal tax.</p>

  <br />

[**Visit site**](https://calculatetax.nz/) ·
[**Documentation**][wiki]

  <br />

  <p>
    <a href="https://app.netlify.com/sites/calculatetax/deploys">
      <img
        alt="Netlify Build Status"
        src="https://img.shields.io/netlify/5dd901ac-5ae2-435d-863e-f7c4c9337a05?label=build&style=for-the-badge"
      />
    </a>
    <img 
      alt="GitHub package.json version" 
      src="https://img.shields.io/github/package-json/v/Joshua-Booth/calculate-tax?style=for-the-badge"
    />
    <img 
      alt="Dependencies"
      src="https://img.shields.io/david/Joshua-Booth/calculate-tax?style=for-the-badge"
    />
    <img 
      alt="GitHub last commit" 
      src="https://img.shields.io/github/last-commit/Joshua-Booth/calculate-tax?label=Last%20Update&style=for-the-badge"
    />
  </p>

  <br />

<sub>Developed by <a href="https://joshuabooth.nz">Joshua Booth</a></sub>

  <br />

  <hr />
  <p>
    <a href="#about">About</a> |
    <a href="#requirements">Requirements</a> |
    <a href="#installation">Installation</a> |
    <a href="#installation">Setup</a> |
    <a href="#installation">Usage</a> |
    <a href="#support">Support</a> |
    <a href="#license">License</a>
  </p>
  <hr />
</div>

[wiki]: https://github.com/Joshua-Booth/calculate-tax/wiki/Home/

## About

### The problem

Existing NZ tax calculators haven't been designed with the user in mind. They
often sacrifice UX for more features or have a poor UI design which negatively
influences people's perception of the UX.

### The solution

The goal of this progressive web app is have a minimal and easy to use interface
for calculating tax on your personal income.

<p style="padding-bottom: 20px">
 Check out the
  <a href="https://github.com/Joshua-Booth/calculate-tax/wiki/Home/">
    wiki
  </a>
  for more information about this project.
</p>

## Requirements

This project requires the following:

- [Git](https://git-scm.com/downloads)
- [Node.js 14.16+](https://nodejs.org/en/download/)
- [npm 7.0.0+](https://nodejs.org/en/download/)

### Other useful global dependencies

- [git-cz](https://www.npmjs.com/package/git-cz)
- [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)
- [prettier](https://www.npmjs.com/package/prettier)

## Installation

```sh
> git clone https://github.com/Joshua-Booth/calculate-tax.git   # Clone the repository

> cd calculate-tax     # Change into the 'calculate-tax' directory

> npm install   # Install all the project's dependencies
```

**Ensure the `NODE_ENV` environment variable is either undefined or set to `'development'` before installing dependencies.**

## Setup

Create three env files (.prod, .dev, .test) in an `env` directory in [config](/config).

```sh
> mkdir ./config/env
> cd ./config/env

> touch .prod .dev .test   # Windows: cd > .prod && cd > .dev && cd > .test
```

Add the following environment variables for development (.dev) and production (.prod):

| Variable name                      | Required | Description                                                                                            |
| ---------------------------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `NODE_VERSION`                     | False    | This app's Node version (should be equal or greater than `14.16`)                                      |
| `REACT_APP_ROOT_URL`               | True     | Your API's URL (e.g. `localhost:8000` for dev and `https://api.example.com/` for prod)                 |
| `REACT_APP_PUBLIC_URL`             | True     | This app's public URL (e.g. `localhost:8080/public` for dev and `https://example.com/public` for prod) |
| `REACT_APP_GA_TRACKING_ID`         | False    | Google Analytics tracking id (e.g. `UA-123456789-1`)                                                   |
| `REACT_APP_HOTJAR_SNIPPET_VERSION` | False    | Hotjar snippet version (Also called 'hjsv')                                                            |
| `REACT_APP_HOTJAR_TRACKING_ID`     | False    | Hotjar tracking id (Also called 'hjid')                                                                |
| `REACT_APP_SENTRY_DSN`             | False    | [Sentry DSN]                                                                                           |

[sentry dsn]: https://docs.sentry.io/product/sentry-basics/dsn-explainer/

## Usage

To use the application use the following commands:

### Production

Run `npm run build` to build the static files for production.

Run `npm start prod` to serve the production files.

:sparkles: Visit the site on the localhost URL.

### Development

Run `npm start dev` to start the webpack dev server for the web app.

:sparkles: Visit the site on the localhost URL.

### Testing

```sh
> npm t                # Unit tests

> npm start test.it    # Integration tests

> npm start test.e2e   # End-to-end tests

> npm start coverage   # Full test coverage report (unit, integration and e2e combined)
```

`npm t` starts the unit tests in watch mode, but you can also set the environment variable `CI`
to run the tests in continuous integration mode (this also works for integration and end-to-end tests).

### Other

Run `npm start help` for a full list of available commands.

## Support

Do you need some help? Check the out articles in the [wiki].

Check the [issues](https://github.com/Joshua-Booth/calculate-tax/issues) page to see if there is an open issue with a
potential workaround.

### Additional Support

Reach out to me for support through the following methods:

- Email: [contact@joshuabooth.nz](mailto:contact@joshuabooth.nz)
- Website: [joshuabooth.nz/contact](https://joshuabooth.nz/contact)

## License

This project is the sole property of Joshua Booth.

Copyright &copy; 2021 Joshua Booth

Please see individual licenses contained in the project where third-party
code was used, as this code is owned by it's respective authors.
