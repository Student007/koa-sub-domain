var http = require('http');
var app = require('koa')();
var config = require('./config.json');
var expect = require('chai').expect;
var subdomain = require('../lib/koa-sub-domain');

//////////////////////////////
//    expected responses    //
//////////////////////////////
var responses = {
  main: {
    '/': 'Simple example homepage!'
  },
  api: {
    '/': 'Welcome to our simple API!',
    '/users': [{ name: "Brian" }]
  }
};

//////////////////////////////
//         routes           //
//////////////////////////////
var Router = require('koa-router');
var router = new Router();

//api specific routes
router.get('/', function*(next) {
    this.body = responses.api['/'];
});

router.get('/users', function*(next) {
    this.body = responses.api['/users'];
});

//////////////////////////////
//       Koa app            //
//////////////////////////////

app.use(subdomain('api', router));

router.get('/', function *(next) {
  this.body = responses.main['/'];
});

describe('Simple tests', function () {

  //to be assigned in the 'before' hook (below)
  var server;
  
  before(function (done) {
    app.use(function*(next) {
      this.body = responses.main['/'];
    });
    server = app.listen(config.PORT);
    done();
  });

  ///////////////////////////////
  //        example.com        //
  ///////////////////////////////

  it('GET ' + config.urls.BASE_URL, function (done) {
    http.get('http://'+ config.urls.BASE_URL+':'+config.PORT+'', function (res) {
      res.on('data', function(data){
        expect(data.toString()).to.equal(responses.main['/']);
        done();
      });
    });
  });

  ///////////////////////////////
  //      api.example.com      //
  ///////////////////////////////

  it('GET ' + config.urls.API_URL, function (done) {
    http.get('http://' + config.urls.API_URL+':'+config.PORT+'', function (res) {
       res.on('data', function(data){
          expect(data.toString()).to.equal(responses.api['/']);
          done();
        });
    });
  });

  it('GET ' + config.urls.API_URL + '/users', function (done) {
    http.get('http://' + config.urls.API_URL + ':'+config.PORT+'/users', function (res) {
      res.on('data', function(data){
        expect(data.toString()).to.equal( JSON.stringify(responses.api['/users']) );
        done();
      });
    });
  });

  after(function(done) {
    server.close(function() {
      console.log('    ♻ server recycled');
      done();
    });
  });

});