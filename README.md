# @eclass/semantic-release-ssh-commands

[![npm](https://img.shields.io/npm/v/@eclass/semantic-release-ssh-commands.svg)](https://www.npmjs.com/package/@eclass/semantic-release-ssh-commands)
[![build](https://img.shields.io/travis/eclass/semantic-release-ssh-commands.svg)](https://travis-ci.org/eclass/semantic-release-ssh-commands)
[![downloads](https://img.shields.io/npm/dt/@eclass/semantic-release-ssh-commands.svg)](https://www.npmjs.com/package/@eclass/semantic-release-ssh-commands)
[![dependencies](https://img.shields.io/david/eclass/semantic-release-ssh-commands.svg)](https://david-dm.org/eclass/semantic-release-ssh-commands)
[![devDependency Status](https://img.shields.io/david/dev/eclass/semantic-release-ssh-commands.svg)](https://david-dm.org/eclass/semantic-release-ssh-commands#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/github/eclass/semantic-release-ssh-commands/badge.svg?branch=master)](https://coveralls.io/github/eclass/semantic-release-ssh-commands?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/f84f0bcb39c9a5c5fb99/maintainability)](https://codeclimate.com/github/eclass/semantic-release-ssh-commands/maintainability)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> [semantic-release](https://github.com/semantic-release/semantic-release) plugin to deploy app

| Step               | Description                                                                                 |
|--------------------|---------------------------------------------------------------------------------------------|
| `verifyConditions` | Verify the presence of the `CUSTOM_ENV` environment variable. |
| `publish`          | Deploy app.                                                                   |

## Install

```bash
npm i -D @eclass/semantic-release-ssh-commands
```

## Usage

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/caribou/docs/usage/configuration.md#configuration):

```json
{
  "plugins": [
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/git",
    "@semantic-release/gitlab",
    "@eclass/semantic-release-ssh-commands"
  ]
}
```

## Configuration

### Environment variables

| Variable             | Description                                                       |
| -------------------- | ----------------------------------------------------------------- |
| `CUSTOM_ENV` | A custom env var |

### Examples

```json
{
  "plugins": [
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/git",
    "@semantic-release/gitlab",
    "@eclass/semantic-release-ssh-commands"
  ]
}
```

```yml
# .gitlab-ci.yml
release:
  image: node:alpine
  stage: release
  script:
    - npx semantic-release
  only:
    - master
```

```yml
# .travis.yml
language: node_js
cache:
  directories:
    - ~/.npm
node_js:
  - "12"
stages:
  - test
  - name: deploy
    if: branch = master
jobs:
  include:
    - stage: test
      script: npm t
    - stage: deploy
      script: npx semantic-release

```

## License

[MIT](https://tldrlegal.com/license/mit-license)
