// require modules
var L = require('leaflet');
require('./leaflet-routing-machine.js');
require('./Control.Geocoder.js');
require('./leaflet.MiniMap.js');
require('./leaflet.Locate.js');
require('./leaflet-sidebar.js');
require('./leaflet.Hash.js');
require('./leaflet-layerjson.js');
var osmAuth = require('osm-auth');
var osmtogeojson = require('osmtogeojson');

// specify the path to the leaflet images folder
L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';



// Basemap Tiles Layers for the map // 	detectRetina: true // 	minZoom: 1,
var losm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	maxZoom: '19',
	opacity: '1',
	scene: ''
});
var lhot = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
	maxZoom: '19',
	opacity: '1',
	scene: ''
});
var lesri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
	maxZoom: '18',
	opacity: '1',
	scene: ''
});
var ldcarto = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	maxZoom: '18',
	opacity: '1',
	scene: ''
});
var ldcartow = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	maxZoom: '18',
	opacity: '1',
	scene: ''
});



// disable zoomControl (which is topleft by default) when initializing map&options
var map = new L.Map('map', {
	layers: [losm],
	attributionControl: false,
	zoomControl: false
});

var baseMaps = {
	'Map OSM': losm,
	'Humanitarian': lhot,
	'Sat Imagery': lesri,
	'Simple Dark': ldcarto,
	'Simple Clear': ldcartow
};
L.control.layers(baseMaps);

// switch baselayer for the map
function switchBasemap(type) {
	if (type === 'lesri') {
		map.removeLayer(losm);
		map.removeLayer(ldcarto);
		map.removeLayer(ldcartow);
		map.removeLayer(lhot);
		map.addLayer(lesri);
	}
	if (type === 'losm') {
		map.removeLayer(lesri);
		map.removeLayer(ldcarto);
		map.removeLayer(lhot);
		map.removeLayer(ldcartow);
		map.addLayer(losm);
	}
	if (type === 'lhot') {
		map.removeLayer(lesri);
		map.removeLayer(losm);
		map.removeLayer(ldcarto);
		map.removeLayer(ldcartow);
		map.addLayer(lhot);
	}
	if (type === 'ldcarto') {
		map.removeLayer(lesri);
		map.removeLayer(losm);
		map.removeLayer(lhot);
		map.removeLayer(ldcartow);
		map.addLayer(ldcarto);
	}
	if (type === 'ldcartow') {
		map.removeLayer(lesri);
		map.removeLayer(losm);
		map.removeLayer(lhot);
		map.removeLayer(ldcarto);
		map.addLayer(ldcartow);
	}
}
// change the value of the basemap
$('[name=basemap]').change(function () {
	switchBasemap(this.value);
});



// set the position and zoom level of the map
map.setView(new L.LatLng(46.8, 3.8), 3);



// icon for the routing machine
var startRicon = L.icon({
	iconUrl: 'styles/images/pinstart.png',
	iconRetinaUrl: 'styles/images/pinstart.png',
	iconSize: [36, 47],
	iconAnchor: [18, 47],
	popupAnchor: [0, -48]
});
var dropUicon = L.icon({
	iconUrl: 'styles/images/pinpoi.png',
	iconRetinaUrl: 'styles/images/pinpoi.png',
	iconSize: [36, 47],
	iconAnchor: [18, 47],
	popupAnchor: [0, -48]
});



// Routing machine features
var sidebarlrm = L.Routing.control({
	plan: L.Routing.plan(null, {
		createMarker: function (i, startwp) {
			return L.marker(startwp.latLng, {
				draggable: true,
				icon: startRicon
			});
		},
		geocoder: L.Control.Geocoder.nominatim(),
		routeWhileDragging: true,
		reverseWaypoints: true,
		draggable: true
	}),
	position: 'topleft',
	collapsible: false,
	routeWhileDragging: true,
	routeDragTimeout: 250,
	draggableWaypoints:true
});
// include the routing machine into the sidebar
var lrmBlock = sidebarlrm.onAdd(map);
document.getElementById('sidebarlrm').appendChild(lrmBlock);



// Stand alone Geocoder features
var geocoder = L.Control.geocoder({
	position: 'topleft',
	collapsed: false,
	placeholder: 'search...',
	errorMessage: '‘X’ never, ever marks the spot.'
});
// include the geocoder into the sidebar
var gecBlock = geocoder.onAdd(map);
document.getElementById('sidebarex').appendChild(gecBlock);



// search from OpenStreetMap with OverPass
$(document).ready(function () {
	$('#opsdAmenity').click(function () {
		L.layerJSON({
			url: 'https://overpass-api.de/api/interpreter?data=' +
			'[out:json];node({lat1},{lon1},{lat2},{lon2})' +
			$('#opAmenity').val() +
			';out;',
			propertyItems: 'elements',
			propertyTitle: 'tags.name',
			propertyLoc:   ['lat', 'lon'],
			minZoom: 14,
			minShift: 500,
			buildIcon: function () {
				return new L.Icon({
					iconUrl: 'styles/images/datamarker.png',
					iconRetinaUrl: 'styles/images/datamarker.png',
					iconSize: [13, 23],
					iconAnchor: [6.5, 23],
					popupAnchor: [0, -24]
				});
			},
			buildPopup: function (data) {
				return data.tags.name || null;
			}
		})
		.addTo(map);
	});
});

var overinAmenity = document.createElement('input');
overinAmenity.id = 'opAmenity';
overinAmenity.type = 'text';
overinAmenity.className = 'overinput';
overinAmenity.value = '';
overinAmenity.placeholder = 'ex: [amenity=cafe][name="Starbucks"]';
var placeHolder = document.getElementById('optinput');
placeHolder.appendChild(overinAmenity);

var oversdAmenity = document.createElement('input');
oversdAmenity.id = 'opsdAmenity';
oversdAmenity.type = 'submit';
oversdAmenity.className = 'overinputval';
oversdAmenity.value = 'ok';
var placeHolder2 = document.getElementById('optinput');
placeHolder2.appendChild(oversdAmenity);



// drop a marker to Edit on osm
var pinThis = document.createElement('div');
pinThis.id = 'dropMarker';
pinThis.className = 'dropMarker';
document.getElementById('pineditor').appendChild(pinThis);


$('#pineditor').click(function () {
	// first get the point where to drop the marker
	var mCenterlat  = map.getCenter().lat;
	var mCenterlng  = map.getCenter().lng;

	// define the marker
	var dropmaRk = new L.Marker([mCenterlat, mCenterlng], {
		draggable: true,
		icon: dropUicon
	});

	// define the first popup
	var dropmaRkpop =
	'<center>Drag marker to adjust location.<br>' +
	'(double click on the marker to remove)</center>';

	// drop the marker and open the popup
	dropmaRk.addTo(map)
	.bindPopup(dropmaRkpop, {
		className: 'uiconPopupcss'
	}).openPopup();

	// get the LatLng after dragging the marker
	dropmaRk.on('dragend', function (e) {
		var dmRk = e.target.getLatLng();
		var dmrkLat = dmRk.lat;
		var dmrkLng = dmRk.lng;

		// define the second popup
		var dropmaRkpop =
		'Lat: ' + dmrkLat + '<br>' +
		'Lng: ' + dmrkLng + '<br>';

		// define the OverPass Query
		// [bbox:{{bbox}}];node[~"."~"."];out meta;
		var ovquery = 'https://overpass-api.de/api/interpreter?data=' +
		'[out:json];' +
		'way(around:25,' + dmrkLat + ',' + dmrkLng + ')[highway];>->.a; ' +
		'(node(around:25,' + dmrkLat + ',' + dmrkLng + ') - .a);' +
		'out;';

		// create an empty layer for the features
		var layerresov = L.geoJson().addTo(map);

		// render the Query on map
		$.get(ovquery, function (resp) {
			// console.log(resp);
			// grab the elements from the .json
			// loop inside to get resp.elements[i].id

			// osm resp .JSON to .GeoJson
			var helpovgeojson = osmtogeojson(resp);

			// move GeoJson into the layer created
			layerresov = new L.GeoJSON(helpovgeojson, {
				pointToLayer: function (feature, latlng) {
					// console.log(feature);
					// console.log(latlng);

					// define the features popup
					var editosm = 'https://www.openstreetmap.org/edit?';
					var typWN = feature.properties.type;
					var featId = feature.properties.id;
					var featLat = feature.geometry.coordinates[1];
					var featLng = feature.geometry.coordinates[0];

					var deepovquery = 'https://overpass-api.de/api/interpreter?data=' +
					'[out:json];' +
					'way(around:25,' + featLat + ',' + featLng + ')[highway];>->.a; ' +
					'(node(around:5,' + featLat + ',' + featLng + ') - .a);' +
					'out;';

					var popGeojson =
					'<b>' + feature.properties.tags.name + '</b><br>' +
					typWN + '(' + featId + ')<br>' +
					featLat + ', ' + featLng + '<br>' +
					'&#9654 ' +
					'<a href="' + editosm + typWN + featId + '#map=19/' + featLat + '/' +
					featLng + '" target=_blank>' +
					'Edit with iD' +
					'</a><br>' +
					'&#9660 ' +
					'<a href="' + deepovquery + '" target=_blank>' +
					'More features ...' +
					'</a><br>';

					return new L.CircleMarker(latlng, {
						color: '#0E3C96',
						fillcolor: '#0E3C96'
					}).bindPopup(popGeojson, {
						className: 'uiconPopupcss'
					});
				}
			}).addTo(map);
			// zomm to the render features
			map.fitBounds(layerresov.getBounds());
		}).done(function (layerresov, feature) {
			console.log('Data Loaded: ' + feature);
		}).fail(function (layerresov, feature, err) {
			console.log('Data Fail: ' + feature + err);
			// cannot get "TypeError: this._northEast is undefined"
		});

		// update data after moveend
		dropmaRk.update(map)
		.bindPopup(dropmaRkpop, {
			className: 'uiconPopupcss'
		})
		.openPopup();

		// remove the marker from map
		dropmaRk.on('dblclick', function () {
			map.removeLayer(dropmaRk);
			layerresov.clearLayers();
		});
	});
});



// switch search mod
$(document).ready(function () {
	$('.sbs').click(function () {
		var id = $(this).attr('id');
		if (id === 'qsearchplace') {
			$('#qsearchplace').removeClass('searchqueryion').addClass('searchqueryioff');
			$('#sidebarex').addClass('search-divshow').removeClass('search-divhidden');
			$('#qsearchroute').addClass('searchqueryion').removeClass('searchqueryioff');
			$('#sidebarlrm').addClass('search-divhidden').removeClass('search-divshow');
			$('#qsearchop').addClass('searchqueryion').removeClass('searchqueryioff');
			$('#sidebaroverpass').addClass('search-divhidden').removeClass('search-divshow');
		} else if (id === 'qsearchroute') {
			$('#qsearchroute').removeClass('searchqueryion').addClass('searchqueryioff');
			$('#sidebarlrm').addClass('search-divshow').removeClass('search-divhidden');
			$('#qsearchplace').addClass('searchqueryion').removeClass('searchqueryioff');
			$('#sidebarex').addClass('search-divhidden').removeClass('search-divshow');
			$('#qsearchop').addClass('searchqueryion').removeClass('searchqueryioff');
			$('#sidebaroverpass').addClass('search-divhidden').removeClass('search-divshow');
		} else if (id === 'qsearchop') {
			$('#qsearchop').removeClass('searchqueryion').addClass('searchqueryioff');
			$('#sidebaroverpass').addClass('search-divshow').removeClass('search-divhidden');
			$('#qsearchplace').addClass('searchqueryion').removeClass('searchqueryioff');
			$('#sidebarex').addClass('search-divhidden').removeClass('search-divshow');
			$('#qsearchroute').addClass('searchqueryion').removeClass('searchqueryioff');
			$('#sidebarlrm').addClass('search-divhidden').removeClass('search-divshow');
		}
	});
});



// MiniMap layer Options
var esriUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

// set MiniMap attribution
var esriAttrib = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

// set MiniMap features
var esri = new L.TileLayer(esriUrl, {
	minZoom: 0,
	maxZoom: 11,
	attribution: esriAttrib
});

// set MiniMap on map
var miniMap = new L.Control.MiniMap(esri, {
	position: 'bottomright',
	width: 80,
	height: 80
});
miniMap.addTo(map);



// add zoom control with options
L.control.zoom({
	position:'bottomright'
}).addTo(map);



// icon for locate
var markerLicon = {
	iconUrl: 'styles/images/bluedot.png',
	iconSize: [17, 17],
	iconAnchor: [9, 9],
	popupAnchor: [0, -10],
	labelAnchor: [3, -4]
};

// locate controle on the top right side
L.control.locate(
	{
		position: 'topright',
		icon: 'fa fa-location-arrow',
		iconLoading: 'fa fa-refresh fa-spin',
		drawCircle: true,
		circlePadding: [20, 20],
		circlestyles: {
			color: '#FFF',
			fillColor: '#000',
			fillOpacity: '0.1',
			weight: '2'
		},
		follow: true,
		markerClass: L.marker,
		markerStyle: {
			icon: L.icon(markerLicon),
			className: 'locatemarker-pulsate'
		},
		metric: true,
		strings: {
			title: 'Show me where I am',
			metersUnit: 'meters',
			feetUnit: 'feet',
			popup: '<center>You are around ' +
							'{distance} {unit} ' +
							'from this point</center>',
			outsideMapBoundsMsg: 'You seem located outside the boundaries of the map'
		},
		locateOptions: {
			enableHighAccuracy: true,
			maxZoom: 20
		}
	}).addTo(map);



// spawn the sidebar on map
L.control.sidebar('sidebar').addTo(map);



// hash the address bar with the {./#ZOOM/LAT/LNG} center of the map
L.hash(map);



map.on('moveend', function () {
	var mapCenterlat  = map.getCenter().wrap().lat;
	var mapCenterlng  = map.getCenter().wrap().lng;
	// var mapBounds     = map.getBounds();
	// var mapBoundleft  = mapBounds.getNorthWest().lng;
	// var mapBoundright = mapBounds.getSouthEast().lng;
	// var mapBoundtop   = mapBounds.getNorthWest().lat;
	// var mapBoundtop   = mapBounds.getNorthEast().lat;
	// var mapBoundbottom= mapBounds.getSouthEast().lat;
	var mapCenter     = mapCenterlat + '/' + mapCenterlng;
	var tarBlk       = ' target=_blank>';
	var iDeditor      = 'https://www.openstreetmap.org/edit?editor=id#map=18/' + mapCenter;
	var openiDeditor  = '<a href=' + iDeditor + tarBlk;

	// Side bar links
	document.querySelector('i.urlzxy').innerHTML = openiDeditor +
	'<i class="fa fa-share"></i> Edit with iDeditor in a new tab</a><br>';
});

/* eslint-disable */
// OSM OAuth_secret
var osmkeysec = 'FvTtE9DuFiRjMCOp9g2chQAMf9ikQualSEh1SRX1';
// OSM OAuth_consumer_key
var osmkeycon =  'xrtIUDNLPsEqGKGAOWeW8Jzm8F8LZJeFLvLLynlM';
// OAuth ON OSM
var auth = osmAuth({
	oauth_secret: osmkeysec,
	oauth_consumer_key: osmkeycon,
	auto: true
});

/* eslint-enable */
$('#authenticate,#authorize-btn').click(function () {
	auth.authenticate(function () {
		getUser();
	});
	return false;
});

$('#logout').click(function () {
	auth.logout();
	getUser();
	return false;
});

$('#auth-cancel-btn').click(function () {
	return false;
});

/* eslint-disable */
function getUser() {
	if (auth.authenticated()) {
		auth.xhr({
			method: 'GET',
			path: '/api/0.6/user/details'
		}, function (err, details) {
			var user = details.getElementsByTagName('user')[0].getAttribute('display_name');
			$('#logout').html('<i class="fa fa-user"></i> Log out <span class="uk-text-bold">' + user + '</span>').show();
			$('#user').html('<a href="http://www.openstreetmap.org/user/" +user+">"+user+"</a>"');
			$('#authenticate').hide();
		});
	} else {
		$('#logout').hide();
		$('#authenticate').show();
	}
}
/* eslint-enable */



// Fetch Pi Weather Stations database
var urlwwxs = 'src/data/WeeWxStation.json';

// define Popup for Pi Stations
var popupPiw =
'<center>{description}<br>' +
'<a href={url} target="_blank">{url}</a></center> {data}';

// Setup the rendering of the Pi Weather Db (.json)
var weeStations = new L.LayerJSON({
	url: urlwwxs,
	propertyLoc: ['latitude', 'longitude'],
	propertyTitle: 'station',
	minZoom: 12,
	buildIcon: function () {
		return new L.Icon({
			iconUrl: 'styles/images/datamarker.png',
			iconRetinaUrl: 'styles/images/datamarker.png',
			iconSize: [13, 23],
			iconAnchor: [6.5, 23],
			popupAnchor: [0, -24]
		});
	},
	buildPopup: function (data) {
		return L.Util.template(
			'<center>{description}<br>' +
			'<a href={url} target="_blank">{url}</a></center> {data}', {
				description: data.description,
				url: data.url,
				data: (function () {
					var out = '';
					for (var i = 0; i < data.last_seen.length; i++) {
						out += L.Util.template(popupPiw, data.last_seen[i]);
					}
					return out;
				})
			}
		);
	}
});
// map.addLayer(weeStations);	//not selected by default
// add a quick way to select the layer
var overlayMaps = {
	'Weather Stations': weeStations
};
L.control.layers(baseMaps, overlayMaps);

// switch overlay weeStations
$('#weeStations').change(function () {
	if ($(this).prop('checked')) {
		map.addLayer(weeStations);
	} else {
		map.removeLayer(weeStations);
	}
});



// Define EarthQuake Marker
function earthqMarker(feature, latlng) {
	return new L.CircleMarker(latlng, {
		radius: feature.properties.mag * 3,
		color: '#0E3C96',
		fillColor: feature.properties.alert,
		weight: feature.properties.tsunami,
		opacity: 0.45,
		fillOpacity: 0.35
	});
}
// Define EarthQuake Popup
function earthqPopup(feature, earthquakeLayer) {
	if (feature.properties) {
		var earthqPopup =
		'<b>Magnitude ' + feature.properties.mag + '</b><br>' +
		new Date(Number(feature.properties.time)).toLocaleString() +
		'<br>' + feature.properties.place +
		'<br><a href=' + feature.properties.url + ' target=_blank>More info</a>';
		earthquakeLayer.bindPopup(earthqPopup, {
			className: 'uiconPopupcss'
		});
	}
}
// Create an empty layer for the features
var earthQuake = L.geoJson(false, {
	pointToLayer: earthqMarker,
	onEachFeature: earthqPopup
});

// keep it inside the controle Layer
var overlayQuake = {
	'Earthquake': earthQuake
};
L.control.layers(baseMaps, overlayQuake);

// switch overlay earthQuake
$('#earthQuake').change(function () {
	if ($(this).prop('checked')) {
		// render the Query on map
		var eqUsgs =
		// 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';
		// 'https://raw.githubusercontent.com/RobyRemzy/cozy-map/master/src/data/significant_month.geojson';
		'https://remi.cozycloud.cc/public/files/files/bdbb3c5f555ef5a2ceb0a985ad87f5e6/attach/significant_month.geojson';
		$.getJSON(eqUsgs, function (resp) {
			earthQuake.addData(resp);
			console.log(resp);
		});
		map.addLayer(earthQuake);
	} else {
		map.removeLayer(earthQuake);
		earthQuake.clearLayers();
	}
});
