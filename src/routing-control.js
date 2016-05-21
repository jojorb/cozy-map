// https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png
var L = require('leaflet'),
geolocate = require('./geolocate'),
// ElevationControl = require('./elevation'),
mpz = require('./mpz');
require('./leaflet-routing-machine.js');
// var addElevation = require('geojson-elevation').addElevation;
// var TileSet = require('node-hgt').TileSet;
require('leaflet.icon.glyph');


module.exports = L.Routing.Control.extend({
	initialize: function (map, initialWaypoints) {

		L.Routing.Control.prototype.initialize.call(this, {
			geocoder: L.Control.Geocoder.nominatim(),
			routeWhileDragging: true,
			reverseWaypoints: true,
			// language: 'fr',
			showAlternatives: true,
			lineOptions: {
				styles: [
					{color: '#0aa9fb', opacity: 0.3, weight: 9},
					{color: '#EEEEEE', opacity: 0.23, weight: 5},
					{color: '#0aa9fb', opacity: 0.65, weight: 2}
				]
			},
			altLineOptions: {
				styles: [
					{color: '#EEEEEE', opacity: 0.3, weight: 9},
					{color: '#EEEEEE', opacity: 0.23, weight: 2},
					{color: '#0aa9fb', opacity: 0.65, weight: 2}
				]
			},
			waypoints: initialWaypoints,
			createMarker: function (i, wp) {
				return L.marker(wp.latLng, {
					icon: L.icon.glyph({
						iconUrl: 'styles/images/routemarker.svg',
						iconSize: [37, 50],
						iconAnchor: [18.5, 50],
						glyphAnchor: [0, -7],
						popupAnchor: [0, -51],
						prefix: '',
						glyphColor: 'white',
						glyphSize: '15px',
						glyph: String.fromCharCode(65 + i)
					}),
					draggable: true
				});
			},
			createGeocoder: L.bind(function (i) {
				var geocoder = L.Routing.GeocoderElement.prototype.options.createGeocoder.call(this, i, this.getPlan().getWaypoints().length, this.getPlan().options),
				iplace = L.DomUtil.create('div', 'geocoder-iplace'),
				geolocateBtn = L.DomUtil.create('span', 'geocoder-geolocate-btn', geocoder.container);

				iplace.title = 'add a marker';
				iplace.innerHTML = String.fromCharCode(65 + i);
				geocoder.container.insertBefore(iplace, geocoder.container.firstChild);

				L.DomEvent.on(iplace, 'click', L.bind(function () {
					var mc = map.getCenter();
					this.spliceWaypoints(i, 1, mc);
				}, this));

				geolocateBtn.title = 'Find my position';
				geolocateBtn.innerHTML = '<i class="fa fa-location-arrow"></i>';
				geolocateBtn.className = 'geocoder-geolocate-btn';
				L.DomEvent.on(geolocateBtn, 'click', L.bind(function () {
					geolocate(map, L.bind(function (err, p) {
						if (err) {
							console.log(err);
							return;
						}
						this.spliceWaypoints(i, 1, p.latlng);
					}, this));
				}, this));

				return geocoder;
			}, this)
		});
		this.on('routeselected', function (e) {
			var r = e.route,
			// https://mapzen.com/documentation/elevation/elevation-service/
			mapzenel = {
				range: true,
				shape: r.coordinates.map(function (c) {
					return {'lat':c.lng, 'lon':c.lat};
				})
			},
			geojson = {
				type: 'LineString',
				coordinates: r.coordinates.map(function (c) {
					// console.log(c);
					return [c.lng, c.lat];
				})
			};
			var mje = JSON.stringify(mapzenel);
			var gj = JSON.stringify(geojson);
			console.log(gj);

			// addElevation(geojson, new TileSet('./data'), function (err) {
			// 	if (!err) {
			// 		console.log(JSON.stringify(geojson));
			// 	} else {
			// 		console.log(err);
			// 	}
			// });

			var elv = 'https://elevation.mapzen.com/height?json=' + mje + '&api_key=' + mpz.mapZenElvTk;
			// console.log(elv);
			$.get(elv, function (resp) {
				console.log(resp);
			});


		});
	},
	onAdd: function (map) {
		var container = L.Routing.Control.prototype.onAdd.call(this, map);

		return container;
	}
});
