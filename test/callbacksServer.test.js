// TODO: Make callbacksServer unit tests


const expect = require('chai').expect;
const zcs = require('../index').callbacksServer;

describe('callbacksServer', () => {
  it('should callbacksServer exists', () => {
    expect(zcs)
      .not
      .equal(null);
  });
});
