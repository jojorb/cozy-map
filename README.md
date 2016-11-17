# Cozy-Map
[![Build Status](https://travis-ci.org/RobyRemzy/cozy-map.svg?branch=master)](https://travis-ci.org/RobyRemzy/cozy-map)  
[![NPM](https://nodei.co/npm/cozy-map.png?compact=true)](https://npmjs.org/package/cozy-map)

![screeshot](https://raw.githubusercontent.com/RobyRemzy/cozy-map/master/screenshot.png)  



## basic map services to cross with your Cozy data.

- leafletjs v1.0.1
- mapillary-js v2.0.0
- cozysdk-client v0.0.7


**Cozy developer**  

>https://github.com/cozy-labs/cozy-sdk

`npm install -g cozy-sdk`

```shell
git clone https://github.com/RobyRemzy/cozy-map.git
cd cozy-map
npm install
npm run start

cozy-sdk . --remote https://user.cozycloud.cc/
```

**Non Cozy user**  

```shell
git clone https://github.com/RobyRemzy/cozy-map.git
cd cozy-map
npm install
npm run start
```

use you favorite server like `http-server`

```shell
npm install http-server -g
http-server -p9099 -o -s -i --cors
```

>Some services may not work like sync contacts.




## What is Cozy?

![Cozy Logo](https://raw.github.com/cozy/cozy-setup/gh-pages/assets/images/happycloud.png)

[Cozy](http://cozy.io) is a platform that brings all your web services in the
same private space.  With it, your web apps and your devices can share data
easily, providing you
with a new experience. You can install Cozy on your own hardware where no one
profiles you.

## Community

You can reach the Cozy Community by:

* Chatting with us on IRC #cozycloud on irc.freenode.net
* Posting on our [Forum](https://forum.cozy.io/)
* Posting issues on the [Github repos](https://github.com/cozy/)
* Mentioning us on [Twitter](http://twitter.com/mycozycloud)

## Thanks
To the [contributors](https://github.com/RobyRemzy/cozy-map/graphs/contributors)

 But this app relies also on a variety of plugins, but most importantly on the work of
[Vladimir Agafonkin](https://github.com/mourner),
[Per Liedman](https://github.com/perliedman),
[Tobias Bieniek](https://github.com/Turbo87),
[Stefano Cudini](https://github.com/stefanocudini)
