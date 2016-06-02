var L = require('leaflet'),
RoutingControl = require('./routing-control');
require('./Control.Geocoder.js');
require('./leaflet.MiniMap.js');
require('./leaflet.Locate.js');
require('./leaflet-sidebar.js');
require('./leaflet.Hash.js');
require('leaflet.icon.glyph');
var _ = require('../vendor/underscore-min.js');
var swal = require('../vendor/sweetalert.min.js');
var czc = require('./czc.js');
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
// var modis = 'MODIS_Terra_CorrectedReflectance_TrueColor';

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
map.setView(new L.LatLng(49.78, -21.97), 3);


var userTz = function getUserTimeZone() {

	var uTz = 'function(doc) { emit(doc); }';
	cozysdk.defineRequest('User', 'all', uTz, function (err, res) {
		console.log('Get timezone', res);
		if (err !== undefined) {
			return swal(czc.err);
		}
		cozysdk.run('User', 'all', {}, function (err, res) {
			if (err !== null) {
				return swal(czc.err);
			}

			var geocoder = L.Control.Geocoder.nominatim();
			L.Control.geocoder({
				geocoder: geocoder
			});

			var geLnior = res[0].key.timezone;

			geocoder.geocode(geLnior, function (results) {
				var r = results[0];
				map.setView(new L.LatLng(r.properties.lat, r.properties.lon), 3);
			});
			return false;
		});
		return false;
	});
};


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
		map.removeLayer(lgibs);
		map.removeLayer(myRastertile);

		var myTile = $('#mytileInput').val();
		myRastertile.setUrl(myTile, {});
		map.addLayer(myRastertile);
		// myRastertile.redraw(map);
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


var sidebarlrm = new RoutingControl(map);
var lrmBlock = sidebarlrm.onAdd(map);
document.getElementById('sidebarlrm').appendChild(lrmBlock);


var geocoder = L.Control.geocoder({
	position: 'topleft',
	collapsed: false,
	placeholder: 'search...',
	showResultIcons: true,
	errorMessage: '‘X’ never, ever marks the spot.'
});

geocoder.markGeocode = function (result) {
	console.log(result);
	map.fitBounds(result.bbox, {
		maxZoom: 17
	});
	var uiconPopupcss = {
		'className': 'uiconPopupcss'
	};
	var edosm = 'https://www.openstreetmap.org/edit?';
	var stype = result.properties.osm_type;
	var sosmid = result.properties.osm_id;
	var slat = result.properties.lat;
	var slng = result.properties.lon;

	var spop = '<b>' + result.properties.display_name + '</b><br>' +
	'&#9654 <a href="' + edosm + stype + sosmid + '#map=19/' + slat + '/' + slng +
	'" target=_blank>Edit with iD</a>';
	if (result.icon === undefined) {
		var xitim = '?';
		var xbabo = new L.Marker(result.center, {
			icon: L.icon.glyph({
				iconUrl: 'styles/images/geocodermarker.svg',
				iconSize: [37, 50],
				iconAnchor: [18.5, 50],
				glyphAnchor: [0, -8],
				popupAnchor: [0, -51],
				prefix: '',
				glyphColor: 'white',
				glyphSize: '23px',
				glyph: xitim
			})
		})
		.once('dblclick', function () {
			map.removeLayer(xbabo);
		})
		.bindPopup(spop, uiconPopupcss)
		.addTo(map)
		.openPopup();
	} else {
		var itim = '<img src=' + result.icon + '>';
		var babo = new L.Marker(result.center, {
			icon: L.icon.glyph({
				iconUrl: 'styles/images/geocodermarker.svg',
				iconSize: [37, 50],
				iconAnchor: [18.5, 50],
				glyphAnchor: [0, 7],
				popupAnchor: [0, -51],
				prefix: '',
				glyphColor: 'white',
				glyphSize: '25px',
				glyph: itim
			})
		})
		.once('dblclick', function () {
			map.removeLayer(babo);
		})
		.bindPopup(spop, uiconPopupcss)
		.addTo(map)
		.openPopup();
	}
};
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
		'https://overpass-api.de/api/interpreter?data=' +
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
					'https://overpass-api.de/api/interpreter?data=[out:popup];node(' +
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

L.control.locate(
	{
		position: 'topright',
		icon: 'fa fa-location-arrow',
		iconLoading: 'fa fa-refresh fa-spin',
		setView: 'untilPan',
		drawCircle: true,
		circlePadding: [20, 20],
		circleStyle: {
			color: '#0E3C96',
			fillColor: '#0aa9fb',
			fillOpacity: '0.1',
			weight: '2'
		},
		followCircleStyle: {
			color: '#FFF',
			fillColor: '#000'
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


var userLocate = function () {

	map.locate({setView: true, watch: false})
	.on('locationfound', function () {
		console.log('W3C Geolocation found');
	})
	.on('locationerror', function (e) {
		console.log(e);
		alert('Location access denied.');
	});
};

var onStartnLoad = function () {
	$('#mapLoad input').on('change', function () {
		var mapLoading = $('input[name=radioLoc]:checked', '#mapLoad').val();
		console.log(mapLoading);

		if (mapLoading === ('userTz')) {
			userTz('map');
		}
		if (mapLoading === ('userLocate')) {
			userLocate('map');
		}
		if (mapLoading === ('null')) {
			console.log('Default location');
		}
	});
};
// onStartnLoad('map');
document.addEventListener('DOMContentLoaded', onStartnLoad);


L.control.sidebar('sidebar').addTo(map);

L.hash(map);


map.on('moveend', function () {
	var mapCenterlat  = map.getCenter().wrap().lat;
	var mapCenterlng  = map.getCenter().wrap().lng;
	var mapCenter     = mapCenterlat + '/' + mapCenterlng;
	var tarBlk       	= ' target=_blank>';
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
			$('#user').html('<a href="https://www.openstreetmap.org/user/" +user+">"+user+"</a>"');
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

// create a Sync btn for Contact
var upcontat = document.createElement('input');
upcontat.id = 'upcontat';
upcontat.type = 'button';
upcontat.className = 'syncmycontact';
upcontat.value = 'sync your contact';
// <i class="fa fa-cloud-download"></i>
var syncontact = document.getElementById('syncmycontact');
syncontact.appendChild(upcontat);

// create a btn to edit address
var cupdate = document.createElement('input');
cupdate.id = 'cupdate';
cupdate.type = 'button';
cupdate.className = 'updatecontact';
cupdate.name = 'Edit';
cupdate.value = 'Edit';
cupdate.title = 'edit this contact';

// create a btn to update the contact address
var upc = document.createElement('span');
upc.id = 'maptoc';
upc.title = 'update TO Cozy-Contacts';
upc.className = 'maptocontact';

// Sync action onclick btn
$('#syncmycontact').click(function () {
	// define request for Contact liste
	var cList = 'function(doc) { emit(doc); }';
	cozysdk.defineRequest('Contact', 'all', cList, function (err, res) {
		if (err !== null) {
			return swal(czc.err);
		}
		console.log('Contacts: ', res);
		swal(czc.lcl);
		// Get le contact liste
		cozysdk.run('Contact', 'all', {}, function (err, res) {
			if (err !== null) {
				return swal(czc.err);
			}
			console.log('Contacts loading', res);
			var i;
			var HTML = '';
			// Get only contact with main address filled up
			for (i = 0; i < res.length; i++) {
				var mAd = _.findWhere(res[i].key.datapoints, {name: 'adr'}, {type: 'main'});
				if (mAd !== undefined && mAd.value !== undefined) {
					mAd.value.join('');
					var mAdz = mAd.value;
					console.log('Success: Get Contacts Address');
					// stick a default user png if avatar empty
					var altUpics;
					if (res[i].key._attachments === undefined) {
						altUpics =
						'<img src="./styles/images/user.png" alt="iD" style="width:42px;height:42px;">';
					} else {
						altUpics =
						'<img height="42" width="42"src=../contacts/contacts/' +
						res[i].id + '/picture.png>';
					}
					// Display the contact liste into the sidebar
					var template =
					'<tr>' +
						'<th data-id="'  + res[i].id +
						'" class="contactmap" rowspan="4" align="top">' + altUpics +
						'</th>' +
						'<th align="left">' + res[i].key.fn + '</th>' +
					'</tr>' +
					'<tr>' +
						'<td class="data-add" id="updatecontact' + res[i].id + '">' +
						// '<a title="update ON Cozy-Contacts" href=../../#apps/contacts/contacts/' + res[i].id +
						// '>' +
						// '<i class="fa fa-pencil-square-o"></i>' +
						// '</a>' +
						'<input name="cc" type="text" class="datamadz" id="dataadd" value="' +
						mAdz[2] + '" readonly required />' +
						 '</td>' +
					'</tr>' +
					'<tr>' +
						'<td>' +
						'</td>' +
					'</tr>' +
					'<tr>' +
						// '<td></td>' +
					'</tr>';
					HTML = HTML + template;
				}
			} // end for
			document.querySelector('.contact-list').innerHTML = HTML;
			swal('contact', 'loaded', 'success');
			// Add a layer to display contacts marker on map
			var contactsList = new L.LayerGroup().addTo(map);
			var overlayClist = {
				'Contacts List': contactsList
			};
			L.control.layers(baseLayers, overlayClist);
			// click on avatar to display the contact on map
			$('th.contactmap').click(function (event) {
				// Get the id with the event
				var id = event.currentTarget.dataset.id;
				// define the geocoder to send the address to geocode
				geocoder = L.Control.Geocoder.nominatim();
				L.Control.geocoder({
					geocoder: geocoder
				});
				// Get event contact info
				cozysdk.find('Contact', id, function (err, r) {
					console.log(r);
					var zer = r;
					if (err !== null) {
						return alert(err);
					}
					// Get event contact avart or give him a default one
					if (r._attachments === undefined) {
						altUpics =
						'<img src="./styles/images/user.png" alt="iD" style="width:30px;height:30px;">';
					} else {
						altUpics =
						'<img height="30" width="30"src=../contacts/contacts/' + r._id + '/picture.png>';
					}
					// Get event contact address with a clean string to geocode
					var m4dzCheck = _.findWhere(r.datapoints, {name: 'adr'}, {type: 'main'});
					if (m4dzCheck !== undefined && m4dzCheck.value !== undefined) {
						m4dzCheck.value.join('');
						var m4dz = m4dzCheck.value;
						console.log('process for: ', m4dz, ' loading...');
						// geocode the string address
						geocoder.geocode(m4dz, function (results) {
							if (results[0] === undefined) {
								console.log('error with conctat address!', id);
								swal(czc.clu);

								// if error with the address bring tool to mod the address
								// // create a btn to edit address
								// var cupdate = document.createElement('input');
								// cupdate.id = 'cupdate';
								// cupdate.type = 'button';
								// cupdate.className = 'updatecontact';
								// cupdate.name = 'Edit';
								// cupdate.value = 'Edit';
								// cupdate.title = 'edit this contact';
								var updatec = document.getElementById('updatecontact' + id);
								updatec.appendChild(cupdate);

								// $('[name="Edit"]').ready(function () {
								// });

								// unlock or lock the input to edit
								$('[name="Edit"]').on('click', function () {
									var prev = $(this).prev('input'),
									ro = prev.prop('readonly');
									prev.prop('readonly', !ro).focus();
									$(this).val(ro ? 'Save' : 'Edit');

								});

								// // create a btn to update the contact address
								// var upc = document.createElement('span');
								// upc.id = 'maptoc';
								// upc.title = 'update TO Cozy-Contacts';
								// upc.className = 'maptocontact';
								var mupc = document.getElementById('updatecontact' + id);
								mupc.appendChild(upc);

								// update to Cozy-contact DB the new input address
								$('#maptoc').click(function () {
									var caa = $(this).prevAll('input[name=cc]').val();
									var inside = ['', '', caa, '', '', '', ''];
									// var dps = zer.datapoints[0];
									// var c = dps.value = inside;

									var pushAdd = {
										datapoints: [
											{mediatype: '', name: 'adr', type: 'main', value: inside}
										]
									};
									cozysdk.updateAttributes('Contact', id, pushAdd, function () {
										console.log('contact :', id, 'Attr @Address:');
										console.log(zer.datapoints[0], ' updated with -> ', pushAdd);
										console.log(zer.datapoints);
									});
								});
							}
							// without error!
							// get the lat, lng for the marker
							var r = results[0];
							var clmaRk = new L.Marker([r.properties.lat, r.properties.lon], {
								draggable: false,
								icon: L.icon.glyph({
									iconUrl: 'styles/images/pinuser.svg',
									iconSize: [48, 48],
									iconAnchor: [24, 50],
									glyphAnchor: [0, 6],
									popupAnchor: [0, -50],
									prefix: '',
									glyphColor: 'white',
									glyphSize: '30px',
									glyph: altUpics
								})
							});
							// update contactsList with nominatim LatLng
							// https://en.wikipedia.org/wiki/Geo_URI_scheme
							var uCoords = {geo: [r.properties.lat, r.properties.lon, null]};
							cozysdk.updateAttributes('Contact', id, uCoords, function () {});
							// define the popup on marker on map & diplay r.name info
							clmaRk.bindPopup(r.name, {
								className: 'uiconPopupcss'
							});
							// drop the maker on contact layer and open the popup
							clmaRk.addTo(contactsList)
							.openPopup();
							// zoomin panto the maker with bbox provided by the nominatim zone
							map.fitBounds([
								[r.bbox._southWest.lat, r.bbox._southWest.lng],
								[r.bbox._northEast.lat, r.bbox._northEast.lng]
							]);
							// how to remove the maker, All marker will be removed 'layer'
							console.log('contact: ', id, ' ON Map!');
							clmaRk.on('dblclick', function () {
								contactsList.clearLayers();
							});
							// TODO if result = err then check GEO and show r.datapoints.adr
							// TODO if err result and no GEO ask to locate with a marker?
						});// end geocoder
					} // end if cz.find
					return false;
				}); // end cz.find
			}); // end $('tr.cl')
			return false;
		}); // cz.run
		return false;
	}); // cz.defineRequest
});// $('syncmycontact')
