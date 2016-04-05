// require modules
var L = require('leaflet');
require('./leaflet-routing-machine.js');
require('./Control.Geocoder.js');
require('./leaflet.MiniMap.js');
require('./leaflet.Locate.js');
require('./leaflet-sidebar.js');
require('./leaflet.Hash.js');
// specify the path to the leaflet images folder
L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';



// disable zoomControl (which is topleft by default) when initializing map&options
var map = new L.Map('map', {
	attributionControl: false,
	zoomControl: false
});



// set map url tiles layer
var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

// set OpenStreetMap attribution
// var osmAttrib = '';

// set Map tiles layer and Options
var osm = new L.TileLayer(osmUrl, {
	minZoom: 1,
	maxZoom: 19,
	detectRetina: true
});

// add the tile layer to the map
map.addLayer(osm);

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
	placeholder: 'search',
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



// add zoom control with your options
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



// render Cozy-Files
function initialize() {
	document.querySelector('.send').addEventListener('change', onSendChanged);
	attachEventHandler('table .edit', 'blur', onUpdatePressed);
	attachEventHandler('table .edit', 'keypress', onUpdateKeyPressed);
	attachEventHandler('.destroy', 'click', onButtonDestroyClicked);
	updateFileList();
}


function onSendChanged() {
	var fileName = document.querySelector('.send').value;

	if (fileName.trim() === '') {
		return;
	}

	var file = {
		n: fileName.trim()
	};
	cozysdk.create('File', file, function (err, res) {
		if (err !== null) {
			return alert(err);
		} else {
			document.querySelector('.send').value = '';
			updateFileList();
		}
	});
}

function onUpdatePressed(event) {
	var file = {
		n: event.target.value.trim()
	};

	cozysdk.updateAttributes('File', getIDFromElement(event.target), file, function (err, res) {
		if (err) {
			return alert(err);
		} else {
			updateFileList();
		}
	});
}

function onUpdateKeyPressed(event) {
	if (event.keyCode === 13) {
		event.target.blur();
	}
}

function onButtonDestroyClicked(event) {
	cozysdk.destroy('File', getIDFromElement(event.target), function (err, res) {
		if (err) {
			return alert(err);
		} else {
			updateFileList();
		}
	});
}

function attachEventHandler(klass, action, listener) {
	var useCapture = action === 'blur';
	document.querySelector('.file-list').addEventListener(action, function (event) {
		if (event.target.matches(klass)) {
			listener.call(event.target, event);
		}
	}, !!useCapture);
}

function getIDFromElement(element) {
	if (element.parentNode.dataset.id) {
		return element.parentNode.dataset.id;
	}
	return getIDFromElement(element.parentNode);
}

function updateFileList() {
	cozysdk.defineRequest('File', 'all', 'function(doc) { emit(doc.n); }', function (err, res) {
		if (err !== null) {
			return alert(err);
		} else {
			cozysdk.run('File', 'all', {}, function (err, res) {
				if (err !== null) {
					return alert(err);
				} else {
					var files = JSON.parse('' + res);
					files.forEach(function (fileName) {
						fileName.key = fileName.key.replace(/ /g, '\u00a0');
					});
					render(files);
				}
			});
		}
	});
}

function render(files) {
	var i;
	var HTML = '';
	for (i = 0; i < files.length; i++) {
		var template = '<tr data-id="' + files[i].id + '">' +
		'<td><input value="' + files[i].key + '"" class="edit"></td>' +
		'<td><input type="button" class="update" value="Update"></td>' +
		'<td><input type="button" class="destroy" value="Destroy"></td>' +
		'</tr>';
		HTML = HTML + template;
	}
	document.querySelector('.file-list').innerHTML = HTML;
}

document.addEventListener('DOMContentLoaded', initialize);
