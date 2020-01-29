const AggregateError = require('aggregate-error')
const getError = require('./get-error')
const exec = require('./exec')

/**
 * @typedef {import('./types').Context} Context
 * @typedef {import('./types').Config} Config
 */
/**
 * @param {Config} pluginConfig -
 * @param {Context} ctx -
 * @returns {Promise<*>} -
 * @example
 * verifyConditions(pluginConfig, ctx)
 */
module.exports = async (pluginConfig, ctx) => {
  const errors = []
  if (!ctx.env.SSH_USER) {
    errors.push(getError('ENOSSHUSER', ctx))
  }
  if (!ctx.env.SSH_HOST) {
    errors.push(getError('ENOSSHHOST', ctx))
  }
  if (errors.length > 0) {
    throw new AggregateError(errors)
  }
  if (pluginConfig.verifyConditionsCmd) {
    try {
      const options = { user: ctx.env.SSH_USER, host: ctx.env.SSH_HOST }
      if (ctx.env.SSH_PRIVATE_KEY) {
        options.key = ctx.env.SSH_PRIVATE_KEY
      }
      return await exec(pluginConfig.verifyConditionsCmd, options)
    } catch (err) {
      ctx.message = err.message
      throw new AggregateError([getError('ESSHCOMMAND', ctx)])
    }
  }
}
