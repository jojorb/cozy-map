# Cozy-Map
[![Build Status](https://travis-ci.org/RobyRemzy/cozy-map.svg?branch=master)](https://travis-ci.org/RobyRemzy/cozy-map)  
[![NPM](https://nodei.co/npm/cozy-map.png?compact=true)](https://npmjs.org/package/cozy-map)

![screeshot](https://raw.githubusercontent.com/RobyRemzy/cozy-map/master/screenshot.png)  

Simple package of Cozy-sdk combined with Leaflet JavaScript library.  
And still... in [Vanilla JS](http://vanilla-js.com/)

- NPM leaflet package version: "0.7.7"
- [Leaflet doc](http://leafletjs.com)
- [Leaflet on GutHub](https://github.com/Leaflet/Leaflet)


### Map
map tiles are provided by Open Street Map and ESRI in https.

### Geocoder
search are https request from [OSM/Nominatim](http://wiki.openstreetmap.org/wiki/Nominatim) and include also reverse geocoding `latitude longitude`.  
why is there no auto-completion [?](http://wiki.openstreetmap.org/wiki/Nominatim_usage_policy#Unacceptable_Use)  
For auto-completion there is a possibility to set up your own [OSRM server](https://github.com/Project-OSRM/osrm-backend/wiki/Running-OSRM)  
or use API such as [Mapzen](https://mapzen.com/projects/valhalla/) or [Mapbox's](https://www.mapbox.com/developers/api/directions/) geocoding services. Both of them are doing great things for Open street Map. Here for more informations about the Leaflet Routing Machine [LRM](http://www.liedman.net/leaflet-routing-machine/api/).

### Location
Location can be switch on/off and is based on informations from your web browser [W3C Geolocation API](https://en.wikipedia.org/wiki/W3C_Geolocation_API).

### Hash address bar
Expose the center of the map inside the address bar `#zomm/latitude/longitude`.  

ex: `http://localhost:9099/#3/46.86/3.87`  
*should be able to update your position by enter a new position directly inside the address bar.*



## Mod
Fork the [developer](https://github.com/RobyRemzy/cozy-map/tree/developer) repository  
lint is done with `npm install -g eslint eslint-config-mourner`  
`cd` to the Cozy-Map folder  
`eslint --fix src/app.js`  

load your server or get one with [http-server](https://www.npmjs.com/package/http-server)  

```shell
$ http-server -p9099 -o --cors
```
check/mod `src/app.js` & `build/styles.css`  
Discussion on the [Cozy.io/Forum](https://forum.cozy.io/t/app-leaflet-map-here-i-am-there-you-go/2114)


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
To the [contributors](https://github.com/RobyRemzy/cozy-map/graphs/contributors), and this app relies also on a variety of plugins, but most importantly on the work of
[Vladimir Agafonkin](https://github.com/mourner),
[Per Liedman](https://github.com/perliedman),
[Tobias Bieniek](https://github.com/Turbo87),
[Stefano Cudini](https://github.com/stefanocudini)
