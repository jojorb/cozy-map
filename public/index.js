/* Public map js*/
var mapboxToken = 'pk.eyJ1Ijoicm9ieXJlbXp5IiwiYSI6ImNpc2RtemNqazAwMTkyeG82MHBlemx6aTMifQ.wSeiG1ERx30Dwc27idsDfQ';
mapboxgl.accessToken = mapboxToken;



var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v9',
	// style: 'https://raw.githubusercontent.com/osm2vectortiles/mapbox-gl-styles/master/styles/bright-v9-cdn.json',
	// accessToken: 'no-token',
	zoom: 4,
	scrollZoom: false,
	attributionControl: true,
	hash: true
});

var nav = new mapboxgl.Navigation({position: 'top-right'});
map.addControl(nav);



var mCenterlat = map.getCenter().lat;
var mCenterlng = map.getCenter().lng;
console.log('longitude: ', mCenterlng, 'latitude: ', mCenterlat);
var coordinates = ([mCenterlng, mCenterlat]);
var img = document.createElement('img');
img.src = 'marker.svg';
img.style.width = '37px';
img.style.height = '50px';



var marker = new mapboxgl.Marker(img, {
	offset: {
		x: -18.5,
		y: -50
	}
}).setLngLat(coordinates);
marker.addTo(map);


//
// var popContainer =
// '<center>This marker will always stand on the map center<br>' +
// 'the page address will share the map view and the marker.</center>';
//
//
//
// var popup = new mapboxgl.Popup({
// 	closeButton: false,
// 	closeOnClick: false,
// 	offset: 54
// })
// .setLngLat(coordinates)
// .setHTML(popContainer);
// popup.addTo(map);
