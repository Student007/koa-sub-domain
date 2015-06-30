
<a href='https://pledgie.com/campaigns/29613'><img align='right' alt='Click here to lend your support to: Koa-sub-domain middleware and make a donation at pledgie.com !' src='https://pledgie.com/campaigns/29613.png?skin_name=chrome' border='0' ></a>

<a href="https://flattr.com/submit/auto?user_id=Student007&url=https%3A%2F%2Fgithub.com%2FStudent007%2Fkoa-sub-domain" target="_blank"><img src="http://button.flattr.com/flattr-badge-large.png" alt="Flattr this" title="Flattr this" border="0"></a>
[![Stories in Ready](https://badge.waffle.io/Student007/koa-sub-domain.png?label=ready&title=Ready)](https://waffle.io/Student007/koa-sub-domain) [![Build Status](https://travis-ci.org/Student007/koa-sub-domain.svg)](https://travis-ci.org/Student007/koa-sub-domain) ![Dependency](https://david-dm.org/student007/koa-sub-domain.svg) [![npm version](https://badge.fury.io/js/koa-sub-domain.svg)](http://badge.fury.io/js/koa-sub-domain)
# koa-sub-domain
Simple and lightweight Koa middleware to handle multilevel and wildcard subdomains

### Install

```
npm install koa-sub-domain
```

### Usage

```
var koa = require('koa');
var app = koa();
var subdomain = require('koa-sub-domain');

app.use(subdomain('sub',function *(next){
  this.body = 'Hey, you got it :-)';
}));
app.listen(3000);
```

### Advantage usage

In the case you are running multiple domains on this server, you can add FQDN instead of only sub. Also you may user [Koa-router](https://github.com/alexmingoia/koa-router) routes same as generator functions as target of a domain.

```
app.use(subdomain('sub.example.com', exampleRoute)); // not exampleRoute.routes() !!!
app.use(subdomain('sub.foobar.com', function*(next){...}));
```

Also wildcards for the last sub domain are handled same as deeper domains below the * 

```
app.use(subdomain('*.example.com',wildcardRoute));

```
So `intranet.management.example.com` is matched by `*.example.com`

Of cause you can handle multilevel subdomains in chain:

```
app.use(subdomain('api', router));
app.use(subdomain('v1.api', router));
app.use(subdomain('*.v1.api', router));
```
**Note:** The order of chaining is important !

### Tipps for development 

You need a DNS server or you can add all the FQDNs into your `/etc/hosts` (if you are using Linux or Mac OS X). On Windows 7 and 8, the hosts file path is `%systemroot%\system32\drivers\etc`.

```
172.0.0.1  example.com
172.0.0.1  sub.example.com
172.0.0.1  sub.foo.bar.example.com
172.0.0.1  wildcard.sub.foo.bar.example.com
```

An other way would be to use [dnsmasq](http://thekelleys.org.uk/dnsmasq/doc.html). You need simple one line in the `dnsmasq.conf`:

```
address=/.example.com/192.168.0.1
```
**Note:** the `.` before `example.com` - this means all requests to sub-domains are landing on `192.168.0.1`.

### Performance

You can optimize performance by knowing the steps Koa-sub-domain is resolving:


1. `sub === this.hostname`
2. `this.subdomain[0] === sub`
3. `typeof this.subdomain[1] === 'string'` // or wildcard => sub sub domain ?

That means FQDNs should be resolved the fastest.

### License
MIT

###Notes
**TODO**: checking out whether yield has to be replaced by return because of there is no more following match !
