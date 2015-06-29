var http = require('http');
var app = require('koa')();
var config = require('./config.json');
var expect = require('chai').expect;
var subdomain = require('../lib/koa-sub-domain');

//////////////////////////////
//    expected responses    //
//////////////////////////////
var responses = {
  error: 'Permission denied.',
  main: {
    '/': 'complex example homepage!'
  },
  api: {
    main: {
      '/': 'Welcome to our API! - please visit either v1.api.example.com or v2.api.example.com',
    },
    v1: {
      '/': 'API - version 1',
      '/users': [{ name: 'Jimmy'}]
    },
    v2: {
      '/': 'API - version 2',
      '/users': [{ name: 'Joe'}]
    }
  }
};

//////////////////////////////
//         routes           //
//////////////////////////////
var Router = require('koa-router');
var router = new Router();
var v1Router = new Router();
var v2Router = new Router();

v1Router.get('/', function*(next) {
  this.body = responses.api.v1['/'];
});

v1Router.get('/users', function*(next) {
  this.body = responses.api.v1['/users'];
});

v2Router.get('/', function*(next) {
  this.body = responses.api.v2['/'];
});

v2Router.get('/users', function*(next) {
  this.body = responses.api.v2['/users'];
});

//basic routing..
router.get('/', function*(next) {
  this.body = responses.api.main['/'];
});


app.use(subdomain('api', router));

app.use(subdomain('v1.api', v1Router));
app.use(subdomain('*.v1.api', v1Router));

app.use(subdomain('v2.api', v2Router));
app.use(subdomain('*.v2.api', v2Router));


//////////////////////////////
//       koa app            //
//////////////////////////////
app.use(subdomain('example.com', function*(next) {
    this.body = responses.main['/'];
    console.log('done');
}));

describe('Divide and Conquer tests', function () {

  //to be assigned in the 'before' hook (below)
  var server;

  before(function (done) {

    server = app.listen(config.PORT);
    done();
  });

  after(function(done) {
    server.close(function() {
      console.log('    ♻ server recycled');
      done();
    });
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
        expect(data.toString()).to.equal(responses.api.main['/']);
        done();
      });
    });
  });

  ///////////////////////////////
  //    v1.api.example.com     //
  ///////////////////////////////

  it('GET ' + config.urls.V1_API_URL, function (done) {
    http.get('http://' + config.urls.V1_API_URL+':'+config.PORT+'', function (res) {
      res.on('data', function(data){
        expect(data.toString()).to.equal(responses.api.v1['/']);
        done();
      });
    });
  });

  it('GET ' + config.urls.V1_API_URL + '/users', function (done) {
    http.get('http://' + config.urls.V1_API_URL+':'+config.PORT+'' + '/users', function (res) {
      res.on('data', function(data){
        expect(data.toString()).to.equal( JSON.stringify(responses.api.v1['/users']) );
        done();
      });
    });
  });

  //curve ball..
  it('GET c.b.a.' + config.urls.V1_API_URL, function (done) {
    http.get('http://c.b.a.' + config.urls.V1_API_URL+':'+config.PORT+'', function (res) {
      res.on('data', function(data){
        expect(data.toString()).to.equal(responses.api.v1['/']);
        done();
      });
    });
  });

  ///////////////////////////////
  //    v2.api.example.com     //
  ///////////////////////////////


  it('GET ' + config.urls.V2_API_URL, function (done) {
    http.get('http://' + config.urls.V2_API_URL+':'+config.PORT+'', function (res) {
      res.on('data', function(data){
        expect(data.toString()).to.equal(responses.api.v2['/']);
        done();
      });
    });
  });

  it('GET ' + config.urls.V2_API_URL + '/users', function (done) {
    http.get('http://' + config.urls.V2_API_URL+':'+config.PORT+'' + '/users', function (res) {
      res.on('data', function(data){
        expect(data.toString()).to.equal(JSON.stringify(responses.api.v2['/users']) );
        done();
      });
    });
  });

  //curve ball..
  it('GET c.b.a.' + config.urls.V2_API_URL, function (done) {
    http.get('http://c.b.a.' + config.urls.V2_API_URL+':'+config.PORT+'', function (res) {
      res.on('data', function(data){
        expect(data.toString()).to.equal(responses.api.v2['/']);
        done();
      });
    });
  });

});