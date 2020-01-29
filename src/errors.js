/* eslint-disable sonarjs/no-duplicate-string */
// @ts-ignore
const pkg = require('../package.json')

const [homepage] = pkg.homepage.split('#')
/**
 * @param {string} file -
 * @returns {string} -
 * @example
 * const link = linkify(href)
 */
const linkify = file => `${homepage}/blob/master/${file}`

/**
 * @typedef {import('./types').Context} Context
 */
/**
 * @typedef {Object} SemanticReleaseError
 * @property {string} message -
 * @property {string} details -
 */

module.exports = new Map([
  [
    'ENOSSHUSER',
    /**
     * @param {Context} ctx -
     * @returns {SemanticReleaseError} -
     */
    ctx => ({
      message: 'No ssh user specified.',
      details: `An [ssh user](${linkify(
        'README.md#environment-variables'
      )}) must be created and set in the \`SSH_USER\` environment variable on your CI environment.`
    })
  ],
  [
    'ENOSSHHOST',
    /**
     * @param {Context} ctx -
     * @returns {SemanticReleaseError} -
     */
    ctx => ({
      message: 'No ssh host specified.',
      details: `An [ssh host](${linkify(
        'README.md#environment-variables'
      )}) must be created and set in the \`SSH_HOST\` environment variable on your CI environment.`
    })
  ],
  [
    'ESSHCOMMAND',
    /**
     * @param {Context} ctx -
     * @returns {SemanticReleaseError} -
     */
    ctx => ({
      message: 'Error executing ssh command.',
      details: ctx.message
    })
  ]
])
/* eslint-enable sonarjs/no-duplicate-string */
