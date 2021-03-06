const { template } = require('lodash')
const getError = require('./get-error')
const exec = require('./exec')

/**
 * @typedef {import('./types').Context} Context
 * @typedef {import('./types').Config} Config
 * @typedef {import('./types').ExecOptions} ExecOptions
 */
/**
 * @param {Config} pluginConfig -
 * @param {Context} ctx -
 * @returns {Promise<void>} -
 * @example
 * publish(pluginConfig, ctx)
 */
module.exports = async (pluginConfig, ctx) => {
  try {
    /** @type {ExecOptions} */
    const options = { user: ctx.env.SSH_USER, host: ctx.env.SSH_HOST }
    if (ctx.env.SSH_PRIVATE_KEY) {
      options.key = ctx.env.SSH_PRIVATE_KEY
    }
    const script = template(pluginConfig.publishCmd)({ pluginConfig, ...ctx })
    const output = await exec(script, options)
    process.stdout.write(output)
  } catch (err) {
    ctx.message = err.message
    throw getError('ESSHCOMMAND', ctx)
  }
}
