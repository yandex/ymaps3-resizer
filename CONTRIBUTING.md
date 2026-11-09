# Contributing

Use Node.js 24 and install the locked dependencies.

```sh
nvm use
npm ci
```

Set `APIKEY` in an untracked `.env` file or in your shell. The shared webpack
configuration in `@yandex/ymaps3-cli@0.0.25` requires it for both builds.
The Jest integration test loads the Maps JS API. Set `REFERRER` to a URL
allowed for your key. The test defaults to `http://ymaps3.localhost/`.

```sh
npm start        # Start the development server
```

```sh
npm run lint
npm run build
npm test
npm pack --dry-run
```

## Development loader

For development, load from `dist`:

```js
ymaps3.import.loaders.unshift(async (pkg) => {
    if (!pkg.startsWith('@yandex/ymaps3-resizer')) return;

    // Load script from dev server
    await ymaps3.import.script(`./dist/index.js`);

    return window['@yandex/ymaps3-resizer'];
});
```

## GitHub Actions

The `build` job runs lint, both builds, integration tests and package inspection
on pull requests targeting `main` and on pushes to `main`. Configure the Actions
secrets `APIKEY` and `REFERRER` for this repository. Fork pull requests require
a trusted maintainer to review the changes before running the full checks with
repository credentials.

## Releases

Configure a trusted publisher for the existing npm package
`@yandex/ymaps3-resizer`. Select GitHub Actions, owner `yandex`, repository
`ymaps3-resizer` and workflow filename `release.yml`. Leave the environment
empty and allow direct publishing.

From a clean, up-to-date `main` with `origin` pointing to this repository,
`npm run bump` increments the patch version, commits the two manifests, and
atomically pushes `main` and the new version tag. This starts publication.

The release workflow accepts a tag matching the version in `package.json`,
without a `v` prefix. The tagged commit must be reachable from `main`.
For a manual run select the same version tag. After the checks pass, npm
publishes stable versions to `latest` and prereleases to `next`.
