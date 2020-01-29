const { describe, it, before, after } = require('mocha')
const { expect } = require('chai')
const mock = require('mock-require')

describe('Publish', () => {
  const ctx = {
    env: {
      SSH_USER: 'root',
      SSH_HOST: 'localhost'
    },
    nextRelease: { version: '1.0.0', gitTag: 'v1.0.0' }
  }
  let publish

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

    publish = require('../src/publish')
  })

  it('Return SemanticReleaseError if a get a error from ssh command', async () => {
    try {
      // @ts-ignore
      await publish({ publishCmd: 'stderr' }, ctx)
    } catch (err) {
      expect(err.name).to.equal('SemanticReleaseError')
      expect(err.code).to.equal('ESSHCOMMAND')
    }
  })

  it('Deploy app with a ssh command', async () => {
    // @ts-ignore
    expect(await publish({ publishCmd: 'sh /root/update.sh' }, ctx)).to.equal(
      ''
    )
  })

  it('Deploy app with a ssh command and custom ssh key', async () => {
    ctx.env.SSH_PRIVATE_KEY = 'myPrivateKey'
    // @ts-ignore
    expect(await publish({ publishCmd: 'sh /root/update.sh' }, ctx)).to.equal(
      ''
    )
  })

  after(() => mock.stopAll())
})
