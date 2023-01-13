# Development

This document contains information on developing on this repository.

## Development

This repo is a mono-repo with all source code in one place:

- [. (root)](/) The root contains common configurations and meta-files
- [client](./client) — Frontend client
- [client](./server) — Backend server
- [config](./config) — Deployment configuration
- [static](./static) — Static export of the entire conference

### Setup

To develop on this repo you will need to have [Docker](https://www.docker.com/) and
[node.js](https://nodejs.org) (v18+) installed on your development computer.
This guide assumes you have the repo checked out and are on macOS/unix based system.

You'll only need to follow this setup once for your computer.

```sh
# cd to/this/folder

# Install root NPM dependencies
npm ci

# Setup git hooks (optional)
npx husky install

#
# Client setup
#
npm --prefix client install

#
# Server setup
#
cd server
npm install
cp .env.example .env # Then fill in credentials
```

### Regular use

These are the commands you'll regularly run to develop on this repo, in no particular order.

```sh
# cd to/this/folder

# Start up the docker-compose stack
# → Starts redis on localhost:6379
# → Starts postgres on localhost:5432
# → Both containers are backed by volumes so persist between recreation
docker-compose up -d

# Run the client in one terminal
cd client
npm run serve

# Run the server in another terminal
# → Will load settings in from app-config
# → Add -- --help to see available command line flags
cd server
npm run serve

# Run specific server commands
cd server
npm run dev # --help
npm run debug # same as above but adds --inspect-brk for live debugging
```

### Irregular use

These are commands you might need to run but probably won't, also in no particular order.

```sh
# cd to/this/folder

# Add useful commands that emerge here
```

### Code formatting

This repo uses [Prettier](https://prettier.io/),
[husky](https://www.npmjs.com/package/husky)
and [lint-staged](https://www.npmjs.com/package/lint-staged) to
automatically format code when it is staged for a commit.
So all code pushed to the repository is formatted to a consistent standard.

Prettier ignores files using [.prettierignore](/.prettierignore)
and skips lines after a `// prettier-ignore` comment.

### Commits

Commits to `main` **must** adhere to [ConventionalCommits](https://www.conventionalcommits.org/en/v1.0.0/)
in order to automatically generate useful releases.

### Releasing

This repo uses [GitHub Actions](https://docs.github.com/en/actions)
to build containers when you tag a commit release.
This is designed to be used with [npm version](https://docs.npmjs.com/cli/version)
so all container images are [semantically versioned](https://semver.org/).
The `:latest` docker tag is not used.

These jobs are defined in
[.github/workflows/container.yml](/.github/workflows/build-client.yml)
and [.github/workflows/container.yml](/.github/workflows/build-server.yml)
which builds a container according to the relavent [Dockerfile](/Dockerfile)
and **only** runs when you push a [tag](https://git-scm.com/book/en/v2/Git-Basics-Tagging).

This is further enhanced by [standard-version](https://github.com/conventional-changelog/standard-version)
which automates the tagging process based on the commits since the last release.
It generates the [CHANGELOG.md](./CHANGELOG.md)

```sh
# Generate a new release to be built by GitHub actions
npm run release
```

### Deployment

All deployment is managed through `kubectl`, [kubectx](https://github.com/ahmetb/kubectx) is reccomended.

The deployment relies on these components being installed in the cluster:

- An default IngressController
- An default StorageClass
- An external Postgres database
- [ExternalSecrets](https://external-secrets.io/)

```bash
# cd to/this/folder
# kubectx do-lon1-openlab-systems
# kubens pdc

# Deploy development instance
kubectl apply -k config/overlays/dev/

# Deploy production instance
kubectl apply -k config/overlays/prod/

# (optional) Setup alerting
kubectl apply -k config/alerts
```
