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

// specify the path to the leaflet images folder
L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';



// Basemap Tiles Layers for the map // 	detectRetina: true // 	minZoom: 1,
var losm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '',
	maxZoom: '19',
	opacity: '1',
	scene: ''
});
var ldcarto = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
	attribution: '',
	maxZoom: '18',
	opacity: '1',
	scene: ''
});
var lesri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: '',
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
	'Sat Imagery': lesri,
	'Simple Dark': ldcarto
};
L.control.layers(baseMaps);

// switch baselayer for the map
function switchBasemap(type) {
	if (type === 'lesri') {
		map.removeLayer(losm);
		map.removeLayer(ldcarto);
		map.addLayer(lesri);
	}
	if (type === 'losm') {
		map.removeLayer(lesri);
		map.removeLayer(ldcarto);
		map.addLayer(losm);
	}
	if (type === 'ldcarto') {
		map.removeLayer(lesri);
		map.removeLayer(losm);
		map.addLayer(ldcarto);
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
// var endRicon = L.icon({
// 	iconUrl: 'styles/images/pinend.png',
// 	iconRetinaUrl: 'styles/images/pinend.png',
// 	iconSize: [36, 47],
// 	iconAnchor: [18, 47],
// 	popupAnchor: [0, -48]
// });



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
