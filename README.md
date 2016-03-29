# Cozy-Map

Simple package of Cozy-sdk combined with Leaflet JavaScript library.

- NPM leaflet package version: "0.7.7"
- [Leaflet doc](http://leafletjs.com)
- [Leaflet on GutHub](https://github.com/Leaflet/Leaflet)


### Map
map tiles are provided by Open Street and ESRI Map in https.

### Geocoder
search are https request from [OSM/Nominatim](http://wiki.openstreetmap.org/wiki/Nominatim) and include also reverse geocoding `latitude longitude`.  
why there is no auto-completion [?](http://wiki.openstreetmap.org/wiki/Nominatim_usage_policy#Unacceptable_Use)  
For auto-completion there is a possibility to set up your own [OSRM server](https://github.com/Project-OSRM/osrm-backend/wiki/Running-OSRM)  
or use API such as [Mapzen](https://mapzen.com/projects/valhalla/) or [Mapbox's](https://www.mapbox.com/developers/api/directions/) geocoding services. Both of them are doing great things for Open street Map. Here for more informations about the Leaflet Routing Machine [LRM](http://www.liedman.net/leaflet-routing-machine/api/).

### Location
can be switch on/off.

### Hash address bar
update your position with the `#zomm/latitude/longitude` of the center of the map.  

ex: `http://localhost:9505/#3/46.86/3.87`  
***should be able to update your position by enter a new position directly inside the address bar.***



## Fork & Mod
check `client/src/app.js` and `client/public/styles.css`  
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
