// require modules
var L = require('leaflet'),
mMap = require('leaflet-minimap'),
bs = require('./baselayer'),
mk = require('./markers'),
lc = require('leaflet.locatecontrol'),
sb = require('../node_modules/sidebar-v2/js/leaflet-sidebar.js'),
RoutingControl = require('./routing-control'),
moment = require('moment'),
// cozysdk = require('cozysdk-client'),
_ = require('underscore'),
osmtogeojson = require('osmtogeojson'),
Mapillary = require('mapillary-js');
require('./leaflet.Hash.js');
require('leaflet-routing-machine');
require('leaflet-control-geocoder');
require('leaflet-rotatedmarker');
// var osmAuth = require('osm-auth');



// path to the leaflet images folder
L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';

// disable zoomControl (which is topleft by default) when initializing map&options
var map = new L.Map('map', {
	layers: [bs.losm],
	attributionControl: false,
	zoomControl: false
});

map.setView(new L.LatLng(49.78, -21.97), 3);
L.hash(map);

// var basemaps = {
// 	osm: bs.losm,
// 	mapbox: bs.lmpb,
// 	thunderforest: bs.thoutdoors,
// 	cartodb: bs.cartodbd,
// 	earthdata: bs.lgibs,
// 	rasterTile: bs.myRastertile
// };

var minibasemaps = {
	osm: bs.mini,
	mapbox: bs.lmpbs,
	thunderforest: bs.mini,
	cartodb: bs.mini,
	earthdata: bs.lmpbs,
	rasterTile: bs.mini
};

var baseLayers = {};



// var lclbb = L.control.layers(basemaps, baseLayers, {
// 	position: 'bottomleft'
// });
// lclbb.addTo(map);
//
// var mmlc = lclbb
// // .expand()
// .onAdd(map);
// document.getElementById('mylayerssb').appendChild(mmlc);



mMap = new L.Control.MiniMap(minibasemaps.osm, {
	position: 'bottomright',
	width: 230,
	height: 138,
	zoomLevelOffset: -4,
	aimingRectOptions: {color: '#33A6FF', weight: 4, clickable: false},
	shadowRectOptions: {color: '#000000', weight: 1, clickable: false, opacity: 0, fillOpacity: 0},
	mapOptions: {}
});

mMap.addTo(map);
map.on('baselayerchange', function (e) {
	console.log(e.name);
	mMap.changeLayer(minibasemaps[e.name]);
});



lc = L.control.locate({
	position: 'topright',
	icon: 'fa fa-location-arrow',
	iconLoading: 'fa fa-refresh fa-spin',
	setView: 'untilPan',
	drawCircle: true,
	circlePadding: [20, 20],
	circleStyle: {
		color: '#2B90DE',
		fillColor: '#33A6FF',
		fillOpacity: '0.1',
		weight: '2'
	},
	followCircleStyle: {
		color: '#F8F9F9',
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
});
lc.addTo(map);



L.Control.ZoomHome = L.Control.extend({
	options: {
		position: 'topright',
		zoomInText: '<i class="ms ms-plus" style="line-height:1.65;"></i>',
		zoomInTitle: 'Zoom in',
		zoomOutText: '<i class="ms ms-minus" style="line-height:1.65;"></i>',
		zoomOutTitle: 'Zoom out',
		zoomHomeText: '<i class="ms ms-search-zoom" style="line-height:1.65;"></i>',
		zoomHomeTitle: 'Zoom out to your Timezone'
	},

	onAdd: function (map) {
		var controlName = 'gin-control-zoom',
		container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
		options = this.options;

		this._zoomHomeButton = this._createButton(
			options.zoomHomeText, options.zoomHomeTitle, controlName + '-home', container,
			this._zoomHome);

		this._zoomInButton = this._createButton(
			options.zoomInText, options.zoomInTitle, controlName + '-in', container,
			this._zoomIn);
		this._zoomOutButton = this._createButton(
			options.zoomOutText, options.zoomOutTitle, controlName + '-out', container,
			this._zoomOut);

		this._updateDisabled();
		map.on('zoomend zoomlevelschange', this._updateDisabled, this);

		return container;
	},

	onRemove: function (map) {
		map.off('zoomend zoomlevelschange', this._updateDisabled, this);
	},

	_zoomIn: function (e) {
		this._map.zoomIn(e.shiftKey ? 3 : 1);
	},

	_zoomOut: function (e) {
		this._map.zoomOut(e.shiftKey ? 3 : 1);
	},

	_zoomHome: function () {
		var userTz = function getUserTimeZone() {

			var uTz = 'function(doc) { emit(doc); }';
			cozysdk.defineRequest('User', 'all', uTz, function (err, res) {
				console.log('Get timezone', res);
				if (err !== null) {
					return console.log('nope'); // swal(czc.err);
				}
				// swal(czc.ltz);
				cozysdk.run('User', 'all', {}, function (err, res) {
					if (err !== null) {
						// return swal(czc.err);
					}

					var geocoder = L.Control.Geocoder.nominatim();
					L.Control.geocoder({
						geocoder: geocoder
					});

					var geLnior = res[0].key.timezone;

					geocoder.geocode(geLnior, function (results) {
						var r = results[0];
						map.setView([r.properties.lat, r.properties.lon], 3);
					});
					return false;
				});
				return false;
			});
		};
		userTz('map');
	},

	_createButton: function (html, title, className, container, fn) {
		var link = L.DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

		L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
			.on(link, 'click', L.DomEvent.stop)
			.on(link, 'click', fn, this)
			.on(link, 'click', this._refocusOnMap, this);

		return link;
	},

	_updateDisabled: function () {
		var map = this._map,
		className = 'leaflet-disabled';

		L.DomUtil.removeClass(this._zoomInButton, className);
		L.DomUtil.removeClass(this._zoomOutButton, className);

		if (map._zoom === map.getMinZoom()) {
			L.DomUtil.addClass(this._zoomOutButton, className);
		}
		if (map._zoom === map.getMaxZoom()) {
			L.DomUtil.addClass(this._zoomInButton, className);
		}
	}
});

var ZoomHome = new L.Control.ZoomHome();
ZoomHome.addTo(map);



L.Control.ShareMap = L.Control.extend({
	options: {
		position: 'topright',
		shareText: '<i class="fa fa-share-alt" style="line-height:1.65;"></i>',
		shareTitle: 'Share'
	},
	onAdd: function (map) {
		var controlDiv = L.DomUtil.create('div', 'leaf-circle-icon');
		L.DomEvent
		.addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
		.addListener(controlDiv, 'click', L.DomEvent.preventDefault)
		.addListener(controlDiv, 'click', function () {

			var sosm = 'https://www.openstreetmap.org/?mlat=';
			var smpy = 'https://www.mapillary.com/app/?lat=';
			var sgog = 'https://www.google.com/maps/dir/';
			var mlat = map.getCenter().lat;
			var mlng = map.getCenter().lng;
			var mzoom = map.getZoom();


			var shareMrkr = new L.Marker([mlat, mlng], {
				draggable: true,
				icon: mk.dropUicon
			});

			var shareMrkrPop =
			'<center>Drag marker to adjust location.<br>' +
			'(double click on the marker to remove)</center>';

			shareMrkr.addTo(map)
			.bindPopup(shareMrkrPop, {
				className: 'uiconPopupcss'
			}).openPopup();

			map.setView(new L.LatLng(mlat, mlng), (mzoom + 7));

			shareMrkr.on('dragend', function (e) {
				var smRk = e.target.getLatLng();
				var smrkLat = smRk.lat;
				var smrkLng = smRk.lng;

				// PopUp share Updated
				var shareMrkrPop = '<b>Share with</b><br>&#9654' +
				'<a href="' + sosm + smrkLat + '&mlon=' + smrkLng + '#map=' + mzoom + '/' +
				smrkLat + '/' + smrkLng + '&layers=T" target=_blank>OSM</a> ' +
				'&#9654<a href="' + smpy + smrkLat + '&lng=' + smrkLng + '&z=' + mzoom + '" target=_blank>MAPILLARY</a> ' +
				'&#9654<a href="' + sgog + smrkLat + ',' + smrkLng + '//@' + smrkLat + ',' + smrkLng + ',' + mzoom + 'z" target=_blank>GMAP</a>';

				shareMrkr.update(map)
				.bindPopup(shareMrkrPop, {
					className: 'uiconPopupcss'
				})
				.openPopup();
				shareMrkr.on('dblclick', function () {
					map.removeLayer(shareMrkr);
				});
			});
		});

		var options = this.options;
		var controlUI = L.DomUtil.create('a', '', controlDiv);
		controlUI.title = options.shareTitle;
		controlUI.innerHTML = options.shareText;
		controlUI.href = '#';
		return controlDiv;
	}
});

var ShareMap = new L.Control.ShareMap();
ShareMap.addTo(map);



sb = L.control.sidebar('sidebar');
sb.addTo(map);



L.Control.SbCtrl = L.Control.extend({
	options: {
		position: 'topleft',
		sbText: '<i class="fa fa-bars" style="line-height:1.65;"></i>',
		sbTitle: 'open the sidebar'
	},
	onAdd: function (map) {
		this._map = map;
		var controlDiv = L.DomUtil.create('div', 'leaf-circle-icon');
		L.DomEvent
		.addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
		.addListener(controlDiv, 'click', L.DomEvent.preventDefault)
		.addListener(controlDiv, 'click', function () {

			sb.open('explore');

		});

		var options = this.options;
		var controlUI = L.DomUtil.create('a', '', controlDiv);
		controlUI.title = options.sbTitle;
		controlUI.innerHTML = options.sbText;
		controlUI.href = '#';
		return controlDiv;
	}
});

var SbCtrl = new L.Control.SbCtrl();
SbCtrl.addTo(map);



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
	map.fitBounds(result.geocode.bbox, {
		maxZoom: 17
	});
	var uiconPopupcss = {
		'className': 'uiconPopupcss'
	};
	var edosm = 'https://www.openstreetmap.org/edit?';
	var stype = result.geocode.properties.osm_type;
	var sosmid = result.geocode.properties.osm_id;
	var osmicon = result.geocode.properties.icon;
	var slat = result.geocode.properties.lat;
	var slng = result.geocode.properties.lon;
	var sosm = 'https://www.openstreetmap.org/?mlat=';

	var spop = '<b>' + result.geocode.properties.display_name + '</b><br>' +
	'&#9654 <a href="' + edosm + stype + sosmid + '#map=19/' + slat + '/' + slng +
	'" target=_blank>Edit with iD</a><br>&#9654 <a href="' + sosm + slat + '&mlon=' +
	slng + '#map=17/' + slat + '/' + slng + '&layers=T" target=_blank>Share with OSM</a>';
	if (osmicon === undefined) {

		var xbabo = new L.Marker([slat, slng], {
			icon: mk.question
		})
		.once('dblclick', function () {
			map.removeLayer(xbabo);
		})
		.bindPopup(spop, uiconPopupcss)
		.addTo(map)
		.openPopup();
	} else {
		var itim = '<img src=' + osmicon + '>';
		var babo = new L.Marker([slat, slng], {
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



// Weather Stations Request
var weatherStations = new L.LayerGroup().addTo(map);

function handle(response) {
	console.log('Handle');
	// clenning for buggy render
	weatherStations.clearLayers();
	response.forEach(function (reps) {
		var popupPiw =
		'<center>' + reps.description + '<br>' +
		'<a target=_blank href=' + reps.url + '>link</a></center>' +
		reps.station;
		L.marker([reps.latitude, reps.longitude], {
			icon: mk.dataUicon
		})
		.bindPopup(popupPiw, {
			className: 'uiconPopupcss'
		})
		.addTo(weatherStations);
		console.log('stations moved to weatherStations');
	});
	// swal(czc.pwss);
}

var overlayWstations = {
	'Weather Stations': weatherStations
};
L.control.layers(baseLayers, overlayWstations);

var stations = [
	'src/data/cwop.json',
	'src/data/pws.json',
	'src/data/WeeWxStation.json',
	'src/data/wospi.json'
];

$('#weatherStations').change(function () {
	if ($(this).prop('checked')) {
		// swal(czc.pws);
		for (var i = 0; i < stations.length; i++) {
			$.getJSON(stations[i], handle);
		}
	} else {
		// map.removeLayer(weatherStations);
		// console.log('weatherStations Layer removed');
		weatherStations.clearLayers();
		console.log('weatherStations Layer cleared');
	}
});



// EarthQuake Request
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
		// 'https://raw.githubusercontent.com/RobyRemzy/cozy-map/master/src/data/significant_month.geojson';
		'https://u4h2tjydjl.execute-api.us-west-2.amazonaws.com/remotepixel/https?url=http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson';
		$.getJSON(eqUsgs, function (resp) {
			console.log('earthQuake data loaded', resp);
		}).done(function (resp) {
			earthQuake.addData(resp);
			map.addLayer(earthQuake);
			// swal(czc.eq);
		}).fail(function () {
			// swal(czc.bad);
		});
	} else {
		map.removeLayer(earthQuake);
		console.log('earthQuake Layer removed');
		earthQuake.clearLayers();
		console.log('earthQuake Layer cleared');
	}
});



// natEvents Request
var natEvents = new L.LayerGroup().addTo(map);

function proc(response) {
	console.log('Processing');
	// clenning for buggy render
	natEvents.clearLayers();

	response.events.forEach(function (reps) {
		if (reps.geometries[0].type === 'Point' &&
		reps.categories[0].title !== 'Earthquakes') {
			var lat = reps.geometries[0].coordinates[1];
			var lng = reps.geometries[0].coordinates[0];
			var title = reps.title;
			var temps = reps.geometries[0].date;
			var id = reps.sources[0].id;
			var url = reps.sources[0].url;
			var pp =
			'<center>' + title + '<br>' +
			moment.utc(temps).format('YYYY-MM-DD') + '<br>' +
			id + ': <a target=_blank href=' + url + '>link</a></center>';
			var ll = [lat, lng];
			var tt;

			if (reps.categories[0].title === 'Severe Storms') {
				tt = '<i class="cm cm-Storms"></i>';
			} else {
				tt = '<i class="cm cm-' + reps.categories[0].title + '"></i>';
			}
			var nateventicon = L.icon.glyph({
				iconUrl: 'styles/images/geocodermarker.svg',
				iconSize: [37, 50],
				iconAnchor: [18.5, 50],
				glyphAnchor: [0, 8],
				popupAnchor: [0, -51],
				prefix: '',
				glyphColor: 'white',
				glyphSize: '20px',
				glyph: tt
			});
			L.marker(ll, {
				icon: nateventicon
			})
			.bindPopup(pp, {
				className: 'uiconPopupcss'
			})
			.addTo(natEvents);
			console.log('Events moved to natEvents');
		}
	});
	// swal(czc.pwss);
}

var overlayNevents = {
	'Natural Events': natEvents
};
L.control.layers(baseLayers, overlayNevents);

var eonet = 'https://eonet.sci.gsfc.nasa.gov/api/v2.1/events?days=60';

$('#natEvents').change(function () {
	if ($(this).prop('checked')) {
		// swal(czc.pws);
		for (var i = 0; i < eonet[i].length; i++) {
			$.getJSON(eonet, proc);
		}
	} else {
		// map.removeLayer(natEvents);
		// console.log('natEvents Layer removed');
		natEvents.clearLayers();
		console.log('natEvents Layer cleared');
	}
});



// Sync Contacts
$('#syncmycontacto').click(function () {
	var cList = 'function(doc) { emit(doc); }';
	cozysdk.defineRequest('Contact', 'all', cList, function (err, res) {
		if (err !== null) {
			// return swal(czc.err);
		}
		console.log('Contacts: ', res);
		// swal(czc.lcl);

		cozysdk.run('Contact', 'all', {}, function (err, res) {
			if (err !== null) {
				return console.log('nope'); // swal(czc.err);
			}
			console.log('Contacts loading', res);
			var i;
			var HTML = '';

			for (i = 0; i < res.length; i++) {
				var mAd = _.findWhere(res[i].key.datapoints, {name: 'adr'}, {type: 'main'});
				if (mAd !== undefined && mAd.value !== undefined) {
					// mAd.value.join('\n');
					var adrr = mAd.value.join('');
					var mAdz = adrr.replace(/\n/g, ' ');
					console.log('Success: Get Contacts Address');

					var altUpics;
					if (res[i].key._attachments === undefined) {
						altUpics =
						'<img src="./styles/images/user.png" alt="iD" style="width:42px;height:42px;">';
					} else {
						altUpics =
						'<img height="42" width="42"src=../contacts/contacts/' +
						res[i].id + '/picture.png>';
					}

					var adrsidebar = '<textarea placeholder="' +
					mAdz + '" rows="2" cols="42" readonly disabled class=datamadz ></textarea>';

					var template =
					'<tr><th data-id="' + res[i].id +
					'" class="contactmap" rowspan="4" align="top">' + altUpics +
					'</th><th align="left">' + res[i].key.fn + '</th></tr><tr>' +
					'<td class="data-add" id="updatecontact' + res[i].id + '">' +
					adrsidebar +
					'</td></tr><tr><td></td></tr><tr></tr>';

					HTML = HTML + template;
				}
			}
			document.querySelector('.contact-list').innerHTML = HTML;
			// swal(czc.lcls);

			var contactsList = new L.LayerGroup().addTo(map);
			var overlayClist = {
				'Contacts List': contactsList
			};
			L.control.layers(baseLayers, overlayClist);


			$('th.contactmap').click(function (event) {
				var id = event.currentTarget.dataset.id;
				geocoder = L.Control.Geocoder.nominatim();
				L.Control.geocoder({
					geocoder: geocoder
				});

				cozysdk.find('Contact', id, function (err, r) {
					console.log(r);

					if (err !== null) {
						return console.log('nope'); // swal(czc.bad);
					}
					if (r._attachments === undefined) {
						altUpics =
						'<img src="./styles/images/user.png" alt="iD" style="width:30px;height:30px;">';
					} else {
						altUpics =
						'<img height="30" width="30"src=../contacts/contacts/' + r._id + '/picture.png>';
					}

					var m4dzCheck = _.findWhere(r.datapoints, {name: 'adr'}, {type: 'main'});
					if (m4dzCheck !== undefined && m4dzCheck.value !== undefined) {
						// m4dzCheck.value.join('');
						var m4dz = m4dzCheck.value.join('');
						var adrs = m4dz.replace(/\n/g, ' ');
						console.log('process for: ', adrs, ' loading...');

						geocoder.geocode(adrs, function (results) {
							if (results[0] === undefined) {
								console.log('error with conctat address!', id);
								// swal(czc.clu);
							}
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
							clmaRk.bindPopup(r.name, {
								className: 'uiconPopupcss'
							});
							clmaRk.addTo(contactsList)
							.openPopup();
							map.fitBounds([
								[r.bbox._southWest.lat, r.bbox._southWest.lng],
								[r.bbox._northEast.lat, r.bbox._northEast.lng]
							]);
							console.log('contact: ', id, ' ON Map!');
							clmaRk.on('dblclick', function () {
								contactsList.clearLayers();
							});
							// TODO if result = err then check GEO and show r.datapoints.adr
							// TODO if err result and no GEO ask to locate with a marker?
						});
					}
					return false;
				});
			});
			return false;
		});
		return false;
	});
});



// OverPass: Custom query with OverPass API
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
						icon: mk.dataUicon
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
	var mCenterlat = map.getCenter().lat;
	var mCenterlng = map.getCenter().lng;
	var zfocus = map.getZoom();
	var dropmaRk = new L.Marker([mCenterlat, mCenterlng], {
		draggable: true,
		icon: mk.dropUicon
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



// OverPass: Custom Tiles Layers
$(document).ready(function () {
	$('#mytileSubm').click(function () {

		map.removeLayer(bs.losm);
		map.removeLayer(bs.cartodbd);
		map.removeLayer(bs.lgibs);
		map.removeLayer(bs.lmpb);
		map.removeLayer(bs.thoutdoors);
		map.removeLayer(bs.myRastertile);

		var myTile = $('#mytileInput').val();
		bs.myRastertile.setUrl(myTile, {});
		map.addLayer(bs.myRastertile);
		bs.myRastertile.redraw(map);

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



$('#MapillaryLayer').change(function () {
	if ($(this).prop('checked')) {
		// swal(czc.pws);
		map.addLayer(bs.MapillaryLayer);
		console.log('mapillary layer ON');
	} else {
		map.removeLayer(bs.MapillaryLayer);
		console.log('MapillaryLayer Layer cleared');
	}
});



// Mapillary
/* eslint-disable */
var visible, shown, mly;
/* eslint-enable */
$('.mly-wrapper').hide();
$('#mapi').hide();
$('#reduced').hide();

visible = false;
shown = false;

// mapillaryIcon Big yellow
// var mIcon = mk.mIcon;
// mapillaryIcon blue
// var msIcon = mk.msIcon;
// mapillaryIcon blue focused
// var msfIcon = mk.msfIcon;
// mapillaryIcon green
// var maIcon = mk.maIcon;
// mapillaryIcon green focused
// var mafIcon = mk.mafIcon;
// mapiblue #00BCFF
// mapigreen #36AF6D



var tempiLlary = L.geoJson(false, {
	style: function () {
		return {
			color: '#36AF6D',
			weight: 3,
			opacity: 1
		};
	}
});

// tempiLlary = new L.LayerGroup().addTo(map);

var overlayPillary = {
	'Mapillary': tempiLlary
};
L.control.layers(baseLayers, overlayPillary);


// above zoom 16 and if resp Mapillary is ON then just show the logo
map.on('zoomend ', function () {
	if (map.getZoom() > 16) {
		map.removeLayer(bs.MapillaryLayer);
		$('#MapillaryLayer').prop('checked', false);
		$('#MapillaryLayer').attr('disabled', true);

		// Get sequence
		var bounds = map.getBounds();
		var swlat = bounds.getSouthWest().lat;
		var swlng = bounds.getSouthWest().lng;
		var nelat = bounds.getNorthEast().lat;
		var nelng = bounds.getNorthEast().lng;
		var secn  = 1;

		var getsec = 'https://a.mapillary.com/v2/search/s/geojson?client_id=' +
		bs.mpy + '&max_lat=' + swlat + '&max_lon=' + swlng + '&min_lat=' + nelat +
		'&min_lon=' + nelng + '&limit=' + secn + '&page=0';

		$.getJSON(getsec, function (resps) {
			// console.log(resps);
			console.log('Peoples Mapillaring around here!');
			if (resps.features.length >= 1) {
				$('#mapi').fadeIn('slow');
			}
		});

	} else if (map.getZoom() <= 17) {
		$('#mapi').fadeOut('slow');
		$('#MapillaryLayer').attr('disabled', false);
	}
});



$('#mpl').click(function () {
	$('.mly-wrapper').fadeIn('slow');
	$('.leaflet-control-minimap').fadeOut('slow');
	if (!shown) {
		shown = true;
	}
	visible = true;

	// instantiateViewer();
	// load the miniview with a close img
	var mClat = map.getCenter().lat;
	var mClng = map.getCenter().lng;
	var rad   = 500;
	var getImg = 'https://a.mapillary.com/v2/search/im/close?client_id=' +
	bs.mpy + '&lat=' + mClat + '&limit=1&lon=' + mClng + '&distance=' + rad;

	$.getJSON(getImg, function (resp) {
		// console.log('done', resp);

		var svl = resp.ims[0].key;
		var lat = resp.ims[0].lat;
		var lng = resp.ims[0].lon;
		var dir = resp.ims[0].ca;


		// Set and show the miniview
		mly = new Mapillary.Viewer(
			'mly',
			bs.mpy,
			svl, {
				// see options: http://mapillary.github.io/mapillary-js/interfaces/ivieweroptions.html
				baseImageSize: Mapillary.ImageSize.Size320,
				component: {
					cover: false,
					cache: true,
					keyboard: false,
					marker: true,
					sequence: {
						maxWidth: 150,
						minWidth: 80
					}
				},
				renderMode: Mapillary.RenderMode.Fill,
				basePanoramaSize: Mapillary.ImageSize.Size2048,
				maxImageSize: Mapillary.ImageSize.Size2048
			}
		);

		// Get sequence and the marker on Map
		var bounds = map.getBounds();
		var swlat = bounds.getSouthWest().lat;
		var swlng = bounds.getSouthWest().lng;
		var nelat = bounds.getNorthEast().lat;
		var nelng = bounds.getNorthEast().lng;
		var secn  = 500;
		var getsec = 'https://a.mapillary.com/v2/search/s/geojson?client_id=' +
		bs.mpy + '&max_lat=' + swlat + '&max_lon=' + swlng + '&min_lat=' + nelat +
		'&min_lon=' + nelng + '&limit=' + secn + '&page=0';

		$.getJSON(getsec, function (res) {
			console.log(res);

			var mapillaring = new L.Marker([lat, lng], {
				icon: mk.mIcon,
				rotationAngle: dir
			});
			mapillaring.addTo(tempiLlary);
			tempiLlary.addData(res);


			// if ($('.leaflet-control-minimap').hide()) {
			mly.on('nodechanged', function (node) {
				if (!mapillaring) {
					mapillaring = L.marker(node.latLon, {
						icon: mk.mIcon,
						rotationAngle: node.orientation
					}).addTo(map);
				} else {
					mapillaring.setLatLng(node.latLon);
				}
			});

			map.on('click', function (e) {
				mly.moveCloseTo(e.latlng.lat, e.latlng.lng);
			});
			// }



		});
		map.addLayer(tempiLlary);



	}); // END GetImg


	// map.on('moveend', function () {
	// });

});



// miniview upper buttons
$('#minimize').click(function () {
	// $('#reduced').fadeOut('slow');
	$('.mly-wrapper').fadeOut('slow');
	$('.leaflet-control-minimap').fadeIn('slow');
	map.removeLayer(tempiLlary);
	// tempiLlary.clearLayers();
	visible = false;
});

$('#maxamize').click(function () {
	if ($('.mly-wrapper').css('height') === '600px') {
		$('.mly-wrapper').css('height', 192 + 'px');
		$('.mly-wrapper').css('width', 320 + 'px');
		$('.mapillary-js').css('width', 320 + 'px');
		$('.mapillary-js').css('height', 192 + 'px');
		$('.mapillary-js').css('bottom', 10 + 'px');
		$('.mapillary-js').css('right', 10 + 'px');
		mly.resize();

	} else {
		$('#maxamize').fadeOut('slow');
		$('#minimize').fadeOut('slow');
		$('#reduced').fadeIn('slow');
		$('.mly-wrapper').css('height', 100 + '%');
		$('.mly-wrapper').css('width', 100 + '%');
		$('.mapillary-js').css('width', 100 + '%');
		$('.mapillary-js').css('height', 100 + '%');
		$('.mapillary-js').css('bottom', 0 + 'px');
		$('.mapillary-js').css('right', 0 + 'px');
		mly.resize();
	}
});

$('#reduced').click(function () {
	$('#reduced').fadeOut('slow');
	$('#minimize').fadeIn('slow');
	$('#maxamize').fadeIn('slow');
	$('.mly-wrapper').css('height', 192 + 'px');
	$('.mly-wrapper').css('width', 320 + 'px');
	$('.mapillary-js').css('width', 320 + 'px');
	$('.mapillary-js').css('height', 192 + 'px');
	$('.mapillary-js').css('bottom', 10 + 'px');
	$('.mapillary-js').css('right', 10 + 'px');
	mly.resize();
});

// function instantiateViewer() {
// 	mly = new Mapillary.Viewer(
// 		'mly',
// 		bs.mpy,
// 		'', {
// 			cover: false,
// 			renderMode: Mapillary.RenderMode.Fill
// 		});
//
// 	mly.on('nodechanged', function (node) {
// 		mly.resize();
// 		$('.loader').hide();
// 		var latlng = [node.latLon.lat, node.latLon.lon];
// 		L.marker.setLatLng(L.latLng(latlng));
// 	});
// 	mly.on('loadingchanged', function (node) {
// 		$('.loader').hide();
// 	});
// }
