var subdomain = require('../lib/koa-sub-domain');
var expect = require('chai').expect;
describe('Validation checks', function () {
  
  it('No params are passed', function () {
    var fn = function() { subdomain(); };
    expect(fn).to.throw(Error);
  });

  it('First param is not a string', function () {
    var fn = function () {
      subdomain(23, function *(next) {});
    };
    expect(fn).to.throw(Error);
  });

  it('Only one param is passed', function () {
    var fn = function () {
      subdomain('sub');
    };
    expect(fn).to.throw(Error);

    var fnn = function () {
      subdomain(function *(next) {})
    };
    expect(fnn).to.throw(Error);
  });

  it('Second param is not a object or generator function', function () {
    var fn = function () {
      subdomain('sub', 'abc');
    };
    expect(fn).to.throw(Error);
  });

});
