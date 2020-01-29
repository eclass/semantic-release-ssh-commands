const { describe, it, before, after } = require('mocha')
const { expect } = require('chai')
const mock = require('mock-require')

describe('Verify', () => {
  const env = {}
  let verify

  before(() => {
    mock('ssh-exec', (command, options, cb) => {
      if (/error/.test(command)) {
        return cb(new Error(command), '', '')
      }
      if (/stderr/.test(command)) {
        return cb(null, '', command)
      }
      return cb(null, '', '')
    })

    verify = require('../src/verify')
  })

  it('Return SemanticReleaseError if a SSH_USER environment variable is not defined', async () => {
    try {
      // @ts-ignore
      await verify({}, { env })
    } catch (errs) {
      const err = errs._errors[0]
      expect(err.name).to.equal('SemanticReleaseError')
      expect(err.code).to.equal('ENOSSHUSER')
    }
  })

  it('Return SemanticReleaseError if a SSH_HOST environment variable is not defined', async () => {
    try {
      env.SSH_USER = 'root'
      // @ts-ignore
      await verify({}, { env })
    } catch (errs) {
      const err = errs._errors[0]
      expect(err.name).to.equal('SemanticReleaseError')
      expect(err.code).to.equal('ENOSSHHOST')
    }
  })

  it('Return SemanticReleaseError if a ssh command fail', async () => {
    try {
      env.SSH_HOST = 'localhost'
      // @ts-ignore
      await verify({ verifyConditionsCmd: 'error' }, { env })
    } catch (errs) {
      const err = errs._errors[0]
      expect(err.name).to.equal('SemanticReleaseError')
      expect(err.code).to.equal('ESSHCOMMAND')
    }
  })

  it('Verify with a ssh command', async () => {
    // @ts-ignore
    expect(await verify({ verifyConditionsCmd: 'exit' }, { env })).to.equal('')
  })

  it('Verify with a ssh command and custom private key', async () => {
    env.SSH_PRIVATE_KEY = 'myPrivateKey'
    // @ts-ignore
    expect(await verify({ verifyConditionsCmd: 'exit' }, { env })).to.equal('')
  })

  it('Verify without ssh command', async () => {
    // @ts-ignore
    expect(await verify({}, { env })).to.be.a('undefined')
  })

  after(() => mock.stopAll())
})
