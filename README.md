# Cozy-Map
![screenshot](https://raw.githubusercontent.com/RobyRemzy/cozy-map/master/client/public/screenshot/m.png)  

## Description
Cozy-Map is a standalone interactive maps built with [LeafletJs](http://leafletjs.com/) API, design to working on [Cozy](https://cozy.io/en/).
## Development
>I am not a developer, but more a pre school SandBox foreman :)  

This project is still an attempt to provide a user friendly Geolocalisation WebbApp.
It's also a part of a French [mentorship programme](https://forum.cozy.io/t/app-geozy-en-developpement/511) with Cozy members.
## Project status
**WARNING: This project is underdevelopment, not ready for production.**  
Let's [contribute](#contributing) together!
## Releases

- V0.1: Original Mockup (made on the [GeoZy](https://github.com/ChironGizmo/GeoZy/tree/v0.1.0) repo)
- V0.2: Work In Progress
	- [x] remove CDN
	- [x] dealing with technologies <del>(need improvement)</del>
	- [x] organize / hack some leaflets on map
	- [x] rendering points on map from an imported .geojson (depreciate for now)
	- [x] JSON base
	- [ ] REST API
		- [x] URIs
		- [ ] SOPA-RCP
		- [ ] Representation

## Configuration & Programming style
The server is based  on [shareable-app-coffee-americano](https://github.com/frankrousseau/shareable-app-coffee-americano/), with a standalone focus but also [CozyCloud](https://github.com/mycozycloud) friendly. The front-end is built with [React](https://facebook.github.io/react/), and [leaflet](http://leafletjs.com/)
with [OSM](http://osm.org).  
- Leaflet Follow "mostly" the [Airbnb JavaScript Style Guide](https://github.com/Leaflet/Leaflet/blob/master/PLUGIN-GUIDE.md#code-conventions)
- React [Getting Started](https://facebook.github.io/react/docs/getting-started.html)
- CoffeeScript [The Little Book on CoffeeScript](https://arcturo.github.io/library/coffeescript/02_syntax.html)
- [coffeelint](https://github.com/clutchski/coffeelint/blob/master/doc/user.md)

## Usage as a standalone App  

##### install what you need first
```shell
$ sudo apt-get install npm
$ sudo apt-get install nodejs
$ npm install -g coffee-script
```
##### create a new folder and clone this repository
```shell
$ touch Cozy-Map && cd Cozy-Map
$ git clone https://github.com/RobyRemzy/cozy-map.git ~/Cozy-Map
```
##### install Cozy-Map
```shell
$ sudo npm install
$ coffee server.coffee
```
open the link : [http://localhost:9240](http://localhost:9240)  

you may want to debug the App with:
```shell
$ cd client
$ sudo npm install
$ npm start
```
note: `Ctrl+c` to stop the process (server and/or the debug)
## Usage as a Cozy App
**i hope soon!!! not working yet**  
But should be:  
inside your Cozy instance go to `Platform` - `Store`  
At the bottom of the page you are able to past the HTTPS clone URL of a CozyCloud friendly project ex: `https://github.com/RobyRemzy/cozy-map.git`  
![screenshot](https://raw.githubusercontent.com/RobyRemzy/cozy-map/master/client/public/screenshot/oncozy.png)  

## Contributing
If you would like to contribute enhancements, fixes or say hi! with IRC #cozycloud on irc.freenode.net
please do the following:

- Make a pull requests
	- Fork the `master` repository.
	- Hack on a separate topic branch.
	- Commit and push the topic branch.
	- Make a pull request.
	- Welcome to the Cozy community and thank you.
- For issues [follow this link](https://github.com/RobyRemzy/cozy-map/issues).
- IRC if you don't have IRC installed yet, [just follow this link](http://webchat.freenode.net/?channels=cozycloud)  

**Thanks allready to [CozyTeam](https://cozy.io/en/#about) and [Contributors](https://github.com/RobyRemzy/cozy-map/graphs/contributors)**  

## links
[https://switch2osm.org](https://switch2osm.org)  
[GPX file](http://en.wikipedia.org/wiki/GPS_Exchange_Format)  
[geojson](http://geojson.org/)  
[SuperAgent](http://visionmedia.github.io/superagent/#setting-the%20content-type)
