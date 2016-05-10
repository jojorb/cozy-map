var L = require('leaflet');
require('./leaflet-routing-machine.js');
require('./Control.Geocoder.js');
require('./leaflet.MiniMap.js');
require('./leaflet.Locate.js');
require('./leaflet-sidebar.js');
require('./leaflet.Hash.js');
var osmAuth = require('osm-auth');
var osmtogeojson = require('osmtogeojson');

L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';


var losm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	maxZoom: '19',
	opacity: '1'
});

var lesri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
	maxZoom: '18',
	opacity: '1'
});

var myRastertile = L.tileLayer(null, {});

var date = new Date();
var jmoinszin = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + (date.getDate() - 1)).slice(-2);
// var edjj = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
var viirs = 'VIIRS_SNPP_CorrectedReflectance_TrueColor';

var lgibs = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/' + viirs + '/default/' + jmoinszin + '/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg', {
	minZoom: '3',
	maxZoom: '9',
	opacity: '1'
});

var map = new L.Map('map', {
	layers: [losm],
	attributionControl: false,
	zoomControl: false
});

var baseLayers = {
	'OSM': losm,
	'ESRI': lesri,
	'GIBS': lgibs,
	'MYRA': myRastertile
};

$('#switch_losm').click(function () {
	switchLayer(baseLayers, 'OSM');
});
$('#switch_lesri').click(function () {
	switchLayer(baseLayers, 'ESRI');
});
$('#switch_lgibs').click(function () {
	switchLayer(baseLayers, 'GIBS');
	map.setZoom('5');
});
$('#switch_myRastertile').click(function () {
	switchLayer(baseLayers, 'MYRA');
});

function switchLayer(collection, layerKey) {
	if (layerKey in collection) {
		$.each(collection, function (key, layer) {
			if (key === layerKey) {
				if (!map.hasLayer(layer)) {
					map.addLayer(layer);
				}
			} else if (map.hasLayer(layer)) {
				map.removeLayer(layer);
			}
		});
	} else {
		console.log('There is no layer key by the name "' + layerKey + '" in the specified object.');
	}
}


$(document).ready(function () {
	$('#mytileSubm').click(function () {

		map.removeLayer(losm);
		map.removeLayer(lesri);
		map.removeLayer(myRastertile);

		var myTile = $('#mytileInput').val();
		myRastertile.setUrl(myTile, {});
		map.addLayer(myRastertile);
		myRastertile.redraw(map);
		console.log('TileLayer New url:', myTile);
	});
});


var mytileInput = document.createElement('input');
mytileInput.id = 'mytileInput';
mytileInput.type = 'text';
mytileInput.className = 'nrminput';
mytileInput.value = '';
mytileInput.placeholder = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var pHtileinp = document.getElementById('myrtiles');
pHtileinp.appendChild(mytileInput);

var mytileSubm = document.createElement('input');
mytileSubm.id = 'mytileSubm';
mytileSubm.type = 'submit';
mytileSubm.className = 'nrminputval';
mytileSubm.value = 'ok';
mytileSubm.title = 'submit your query';
var pHtilesub = document.getElementById('myrtiles');
pHtilesub.appendChild(mytileSubm);


map.setView(new L.LatLng(46.8, 3.8), 3);

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
var dataUicon = L.icon({
	iconUrl: 'styles/images/datamarker.png',
	iconRetinaUrl: 'styles/images/datamarker.png',
	iconSize: [13, 23],
	iconAnchor: [6.5, 23],
	popupAnchor: [0, -24]
});


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
var lrmBlock = sidebarlrm.onAdd(map);
document.getElementById('sidebarlrm').appendChild(lrmBlock);


var geocoder = L.Control.geocoder({
	position: 'topleft',
	collapsed: false,
	placeholder: 'search...',
	errorMessage: '‘X’ never, ever marks the spot.'
});
var gecBlock = geocoder.onAdd(map);
document.getElementById('sidebarex').appendChild(gecBlock);


$(document).ready(function () {
	$('#opsdAmenity').click(function () {

		var bounds = map.getBounds();
		var swlat = bounds.getSouthWest().lat;
		var swlng = bounds.getSouthWest().lng;
		var nelat = bounds.getNorthEast().lat;
		var nelng = bounds.getNorthEast().lng;

		var qsOverpass =
		'http://overpass-api.de/api/interpreter?data=' +
		'[out:json];node(' +
		swlat + ',' + swlng + ',' + nelat + ',' + nelng +
		')' +
		$('#opAmenity').val() +
		';out;';

		var qsoLayer = L.geoJson().addTo(map);

		$.get(qsOverpass, function (resp) {

			var qsOntogeo = osmtogeojson(resp);
			qsoLayer = new L.GeoJSON(qsOntogeo, {
				pointToLayer: function (feature, latlng) {
					console.log(feature);
					console.log(latlng);

					var popAmenity =
					'<b>' + feature.properties.tags.name + '</b><br>' +
					feature.properties.type + ' (' + feature.properties.id + ')<br>' +
					'&#9660 ' +
					'<a href="' +
					'http://overpass-api.de/api/interpreter?data=[out:popup];node(' +
					feature.geometry.coordinates[1] + ',' + feature.geometry.coordinates[0] + ',' +
					feature.geometry.coordinates[1] + ',' + feature.geometry.coordinates[0] +
					');out;' +
					'" target=_blank>' +
					'More info...' +
					'</a><br>' +
					'&#9654 ' +
					'<a href="' +
					'https://www.openstreetmap.org/edit?' +
					feature.properties.type + feature.properties.id + '#map=19/' +
					feature.geometry.coordinates[1] + '/' + feature.geometry.coordinates[0] +
					'" target=_blank>' +
					'Edit with iD' +
					'</a>';

					return new L.Marker(latlng, {
						icon: dataUicon
					}).bindPopup(popAmenity, {
						className: 'uiconPopupcss'
					});
				}
			}).addTo(map);
			map.fitBounds(qsoLayer.getBounds());
		}).done(function (qsoLayer, feature) {
			console.log('Data Loaded: ' + feature);
		});
		$('#opunAmenity').click(function () {
			qsoLayer.clearLayers();
			console.log('Data removed');
		});
	});
});

var overinAmenity = document.createElement('input');
overinAmenity.id = 'opAmenity';
overinAmenity.type = 'text';
overinAmenity.className = 'overinput';
overinAmenity.value = '';
overinAmenity.placeholder = 'ex: [cuisine=japanese]';
var placeHolder = document.getElementById('optinput');
placeHolder.appendChild(overinAmenity);

var oversdAmenity = document.createElement('input');
oversdAmenity.id = 'opsdAmenity';
oversdAmenity.type = 'submit';
oversdAmenity.className = 'overinputval';
oversdAmenity.value = 'ok';
oversdAmenity.title = 'submit your query';
var placeHolder2 = document.getElementById('optinput');
placeHolder2.appendChild(oversdAmenity);

var overunAmenity = document.createElement('span');
overunAmenity.id = 'opunAmenity';
overunAmenity.title = 'remove all mini markers';
overunAmenity.className = 'overinputref';
overunAmenity.value = 're';
var placeHolder3 = document.getElementById('optinput');
placeHolder3.appendChild(overunAmenity);


var pinThis = document.createElement('div');
pinThis.id = 'dropMarker';
pinThis.className = 'dropMarker';
pinThis.title = 'click to drop on map center';
document.getElementById('pineditor').appendChild(pinThis);


$('#pineditor').click(function () {
	var mCenterlat  = map.getCenter().lat;
	var mCenterlng  = map.getCenter().lng;
	var zfocus = map.getZoom();
	var dropmaRk = new L.Marker([mCenterlat, mCenterlng], {
		draggable: true,
		icon: dropUicon
	});

	var dropmaRkpop =
	'<center>Drag marker to adjust location.<br>' +
	'(double click on the marker to remove)</center>';

	dropmaRk.addTo(map)
	.bindPopup(dropmaRkpop, {
		className: 'uiconPopupcss'
	}).openPopup();
	map.setView(new L.LatLng(mCenterlat, mCenterlng), (zfocus + 7));

	dropmaRk.on('dragend', function (e) {
		var dmRk = e.target.getLatLng();
		var dmrkLat = dmRk.lat;
		var dmrkLng = dmRk.lng;

		var dropmaRkpop =
		'Lat: ' + dmrkLat + '<br>' +
		'Lng: ' + dmrkLng + '<br>';
		// [bbox:{{bbox}}];node[~"."~"."];out meta;
		var ovquery = 'https://overpass-api.de/api/interpreter?data=' +
		'[out:json];' +
		'way(around:25,' + dmrkLat + ',' + dmrkLng + ')[highway];>->.a; ' +
		'(node(around:25,' + dmrkLat + ',' + dmrkLng + ') - .a);' +
		'out;';

		var layerresov = L.geoJson().addTo(map);

		$.get(ovquery, function (resp) {
			var helpovgeojson = osmtogeojson(resp);

			layerresov = new L.GeoJSON(helpovgeojson, {
				pointToLayer: function (feature, latlng) {

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
			map.fitBounds(layerresov.getBounds());
		}).done(function (layerresov, feature) {
			console.log('Data Loaded: ' + feature);
		}).fail(function (layerresov, feature, err) {
			console.log('Data Fail: ' + feature + err);
			// cannot get "TypeError: this._northEast is undefined"
		});
		dropmaRk.update(map)
		.bindPopup(dropmaRkpop, {
			className: 'uiconPopupcss'
		})
		.openPopup();
		dropmaRk.on('dblclick', function () {
			map.removeLayer(dropmaRk);
			layerresov.clearLayers();
		});
	});
});

$(document).ready(function () {
	$('.sbs').click(function () {
		var id = $(this).attr('id');
		if (id === 'qsearchplace') {
			$('#qsearchplace').removeClass('searchqueryion').addClass('searchqueryioff');
			$('#sidebarex').addClass('search-divshow').removeClass('search-divhidden');
			$('#qsearchroute').addClass('searchqueryion').removeClass('searchqueryioff');
			$('#sidebarlrm').addClass('search-divhidden').removeClass('search-divshow');
		} else if (id === 'qsearchroute') {
			$('#qsearchroute').removeClass('searchqueryion').addClass('searchqueryioff');
			$('#sidebarlrm').addClass('search-divshow').removeClass('search-divhidden');
			$('#qsearchplace').addClass('searchqueryion').removeClass('searchqueryioff');
			$('#sidebarex').addClass('search-divhidden').removeClass('search-divshow');
		}
	});
});


var esriUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var esriAttrib = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
var esri = new L.TileLayer(esriUrl, {
	minZoom: 0,
	maxZoom: 11,
	attribution: esriAttrib
});
var miniMap = new L.Control.MiniMap(esri, {
	position: 'bottomright',
	width: 80,
	height: 80
});
miniMap.addTo(map);

L.control.zoom({
	position:'bottomright'
}).addTo(map);

var markerLicon = {
	iconUrl: 'styles/images/bluedot.png',
	iconSize: [17, 17],
	iconAnchor: [9, 9],
	popupAnchor: [0, -10],
	labelAnchor: [3, -4]
};

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


L.control.sidebar('sidebar').addTo(map);

L.hash(map);


map.on('moveend', function () {
	var mapCenterlat  = map.getCenter().wrap().lat;
	var mapCenterlng  = map.getCenter().wrap().lng;
	var mapCenter     = mapCenterlat + '/' + mapCenterlng;
	var tarBlk       = ' target=_blank>';
	var iDeditor      = 'https://www.openstreetmap.org/edit?editor=id#map=18/' + mapCenter;
	var openiDeditor  = '<a href=' + iDeditor + tarBlk;

	document.querySelector('.urlzxy').innerHTML = openiDeditor +
	'<img src="./styles/images/view/ideditor.png" alt="iD" style="width:25px;height:25px;"></a><br>';
});

/* eslint-disable */
var osmkeysec = 'FvTtE9DuFiRjMCOp9g2chQAMf9ikQualSEh1SRX1';
var osmkeycon =  'xrtIUDNLPsEqGKGAOWeW8Jzm8F8LZJeFLvLLynlM';
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

var weatherStations = new L.LayerGroup().addTo(map);

function handle(response) {
	console.log('Handle');
	// clenning for buggy render
	// weatherStations.clearLayers();
	response.forEach(function (reps) {
		var popupPiw =
		'<center>' + reps.description + '<br>' +
		'<a target=_blank href=' + reps.url + '>link</a></center>' +
		reps.station;
		// new Date(Number(reps.last_seen)).toLocaleString();
		L.marker([reps.latitude, reps.longitude], {
			icon: dataUicon
		})
		.bindPopup(popupPiw, {
			className: 'uiconPopupcss'
		})
		.addTo(weatherStations);
		console.log('stations moved to weatherStations');
	});
}
var overlayWstations = {
	'Weather Stations': weatherStations
};
L.control.layers(baseLayers, overlayWstations);

var stations = [
	'src/data/wospi.json',
	'src/data/WeeWxStation.json',
	'src/data/cwop.json',
	'src/data/pws.json'
];

$('#weatherStations').change(function () {
	if ($(this).prop('checked')) {

		for (var i = 0; i < stations.length; i++) {
			$.getJSON(stations[i], handle);
		}

		map.addLayer(weatherStations);
	} else {
		map.removeLayer(weatherStations);
		console.log('weatherStations Layer removed');
		weatherStations.clearLayers();
		console.log('weatherStations Layer cleared');
	}
});

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

var earthQuake = L.geoJson(false, {
	pointToLayer: earthqMarker,
	onEachFeature: earthqPopup
});

var overlayQuake = {
	'Earthquake': earthQuake
};
L.control.layers(baseLayers, overlayQuake);

$('#earthQuake').change(function () {
	if ($(this).prop('checked')) {
		var eqUsgs =
		// 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';
		'https://raw.githubusercontent.com/RobyRemzy/cozy-map/master/src/data/significant_month.geojson';
		$.getJSON(eqUsgs, function (resp) {
			earthQuake.addData(resp);
			console.log('earthQuake data loaded', resp);
		});
		map.addLayer(earthQuake);
	} else {
		map.removeLayer(earthQuake);
		console.log('earthQuake Layer removed');
		earthQuake.clearLayers();
		console.log('earthQuake Layer cleared');
	}
});
