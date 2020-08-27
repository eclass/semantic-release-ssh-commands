# @eclass/semantic-release-ssh-commands

[![npm](https://img.shields.io/npm/v/@eclass/semantic-release-ssh-commands.svg)](https://www.npmjs.com/package/@eclass/semantic-release-ssh-commands)
![Node.js CI](https://github.com/eclass/semantic-release-ssh-commands/workflows/Node.js%20CI/badge.svg)
[![downloads](https://img.shields.io/npm/dt/@eclass/semantic-release-ssh-commands.svg)](https://www.npmjs.com/package/@eclass/semantic-release-ssh-commands)
[![dependencies](https://img.shields.io/david/eclass/semantic-release-ssh-commands.svg)](https://david-dm.org/eclass/semantic-release-ssh-commands)
[![devDependency Status](https://img.shields.io/david/dev/eclass/semantic-release-ssh-commands.svg)](https://david-dm.org/eclass/semantic-release-ssh-commands#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/github/eclass/semantic-release-ssh-commands/badge.svg?branch=master)](https://coveralls.io/github/eclass/semantic-release-ssh-commands?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/f84f0bcb39c9a5c5fb99/maintainability)](https://codeclimate.com/github/eclass/semantic-release-ssh-commands/maintainability)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> [semantic-release](https://github.com/semantic-release/semantic-release) plugin to deploy app with ssh commands

| Step               | Description                                                              |
|--------------------|--------------------------------------------------------------------------|
| `verifyConditions` | Verify the presence of the `SSH_USER`, `SSH_HOST` environment variables. |
| `publish`          | Deploy app over ssh.                                                     |

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
    [
      "@eclass/semantic-release-ssh-commands",
      {
        "verifyConditionsCmd": "bash verify.sh",
        "publishCmd": "bash deploy.sh ${nextRelease.version}",
      }
    ]
  ]
}
```

**NOTE: verify.sh and deploy.sh are script located in remote server**

## Configuration

### Environment variables

| Variable          | Description                           |
| ----------------- | ------------------------------------- |
| `SSH_USER`        | A ssh user                            |
| `SSH_HOST`        | A ssh host                            |
| `SSH_PRIVATE_KEY` | Content of private ssh key (Optional) |

### Options

| Variable              | Description                                                       |
| --------------------- | ----------------------------------------------------------------- |
| `verifyConditionsCmd` | A command to verificate. Required. Ex: "docker pull myuser/myapp" or "bash verify.sh" |
| `publishCmd`          | A command to publish new release. Required. Ex: "bash deploy.sh ${nextRelease.version}" |


### Examples

```json
{
  "plugins": [
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/git",
    "@semantic-release/gitlab",
    [
      "@eclass/semantic-release-ssh-commands",
      {
        "verifyConditionsCmd": "bash verify.sh",
        "publishCmd": "bash deploy.sh ${nextRelease.version}"
      }
    ]
  ]
}
```

```yml
# .gitlab-ci.yml
release:
  image: node:alpine
  stage: release
  before_script:
    - apk add --no-cache git openssh-client
    - mkdir -p /root/.ssh
    - chmod 0700 /root/.ssh
    - ssh-keyscan $SSH_HOST > /root/.ssh/known_hosts
    - echo "$SSH_PRIVATE_KEY" > /root/.ssh/id_rsa
    - chmod 600 /root/.ssh/id_rsa
    - echo "    IdentityFile /root/.ssh/id_rsa" >> /etc/ssh/ssh_config
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
      addons:
        ssh_known_hosts: $SSH_HOST
      before_deploy:
        - eval "$(ssh-agent -s)"
        - echo "$SSH_PRIVATE_KEY" > /tmp/deploy_rsa
        - chmod 600 /tmp/deploy_rsa
        - ssh-add /tmp/deploy_rsa
      script: npx semantic-release

```

## License

[MIT](https://tldrlegal.com/license/mit-license)
