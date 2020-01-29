const exec = require('ssh-exec')

/** @typedef {import('./types').ExecOptions} ExecOptions */
/**
 * @param {string} command - Command to send over ssh.
 * @param {ExecOptions} options - SSH client options.
 * @returns {Promise<string>} -
 * @example
 * await verify(data, token, org)
 */
module.exports = (command, options) =>
  new Promise((resolve, reject) => {
    exec(command, options, (err, stdout, stderr) => {
      if (err) return reject(err)
      if (stderr) return reject(new Error(stderr))
      resolve(stdout)
    })
  })
