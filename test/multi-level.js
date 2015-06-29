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
    '/': 'multi-level example homepage!'
  },
  api: {
    '/': 'Welcome to our multi-level API!',
    '/users': '[{"name":"Luke"}]'
  }
};

describe('Multi-level tests', function () {

  //to be assigned in the 'before' hook (below)
  var server;

  before(function (done) {
    //////////////////////////////
    //         routes           //
    //////////////////////////////

    var Router = require('koa-router');
    var router = new Router();

    //api specific routes
    router.get('/', function *(next) {
        this.body = responses.api['/'];
    });

    router.get('/users', function*(next) {
        this.body = responses.api['/users'];
    });

    //////////////////////////////
    //       koa app            //
    //////////////////////////////

    app.use(subdomain('v1.api', router));

    app.use(function*(next) {
      this.body = responses.main['/'];
    });
    server = app.listen(config.PORT);
    done();
  });

 

  ///////////////////////////////
  //        example.com        //
  ///////////////////////////////


  it('http://'+ config.urls.BASE_URL, function (done) {
  
      http.get('http://'+ config.urls.BASE_URL+':'+config.PORT+'', function(res){
        res.on('data', function(data){
          expect(data.toString()).to.equal(responses.main['/']);
          done();
        });
      });
  });

  ///////////////////////////////
  //     v1.api.example.com    //
  ///////////////////////////////

  // main route
  it('GET ' + config.urls.V1_API_URL, function (done) {
    
      http.get('http://' + config.urls.V1_API_URL+':'+config.PORT+'', function(res){
        res.on('data', function(data){
          expect(data.toString()).to.equal(responses.api['/']);
          done();
        });
      });
  });
  // different resource users
  it('GET ' + config.urls.V1_API_URL + '/users', function (done) {
      http.get('http://' + config.urls.V1_API_URL+':'+config.PORT+'/users', function(res){
        res.on('data', function(data){
          expect(data.toString()).to.equal(responses.api['/users']);
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
