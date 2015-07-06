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

- V0.1: Original Mockup
- V0.2: Work In Progress
	- [x] remove CDN
	- [x] dealing with technologies <del>(need improvement)</del>
	- [x] organize / hack some leaflets on map
	- [ ] rendering bookmarks on map from an imported .geojson
	- [ ] REST API

## Configuration & Programming style
The server is based  on [shareable-app-coffee-americano](https://github.com/frankrousseau/shareable-app-coffee-americano/), with a standalone focus but also [CozyCloud](https://github.com/mycozycloud) friendly. The front-end is built with [React](https://facebook.github.io/react/), and [leaflet](http://leafletjs.com/)
with [OSM](http://osm.org).  
- Leaflet Follow "mostly" the [Airbnb JavaScript Style Guide](https://github.com/Leaflet/Leaflet/blob/master/PLUGIN-GUIDE.md#code-conventions)
- React [Getting Started](https://facebook.github.io/react/docs/getting-started.html)
- CoffeeScript [The Little Book on CoffeeScript](https://arcturo.github.io/library/coffeescript/02_syntax.html)

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
i hope soon!!!
## Contributing

* pull request `gh-pages`
* issues
* comments
* say hi! on IRC #cozycloud on irc.freenode.net

## links
[https://switch2osm.org](https://switch2osm.org)  
[GPX file](http://en.wikipedia.org/wiki/GPS_Exchange_Format)  
[geojson](http://geojson.org/)  
[SuperAgent](http://visionmedia.github.io/superagent/#setting-the%20content-type)
### shareable-app-coffee-americano:
A propos de NPM
### Publication

S'inscrire à NPM :

```
npm set init.author.name "Brent Ertz"
npm set init.author.email "brent.ertz@gmail.com"
npm set init.author.url "http://brentertz.com"

npm adduser
```

Publier :

```
npm version patch
npm publish
```


### Installation et utilisation


```
sudo npm install monapp -g
monapp
```


### Démonisation


On utilse Supervisor:

```
sudo apt-get install supervisor
```

Ajouter le fichier `/etc/supervisor/conf.d/monapp.conf` :

```
[program:monapp]
autorestart=false
command=monapp
redirect_stderr=true
user=nonuser
```

On met à jour Supervisor :

```
supervisorctl update
```
