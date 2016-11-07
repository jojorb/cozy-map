var mapboxToken = 'pk.eyJ1Ijoicm9ieXJlbXp5IiwiYSI6ImNpc2RtemNqazAwMTkyeG82MHBlemx6aTMifQ.wSeiG1ERx30Dwc27idsDfQ';

mapboxgl.accessToken = mapboxToken;
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/outdoors-v9',
	zoom: 4,
	scrollZoom: false,
	attributionControl: true,
	hash: true
});

var nav = new mapboxgl.Navigation({position: 'bottom-right'});
map.addControl(nav);

map.on('style.load', function () {

	// map.setCenter([33, 10]);
	var mCenterlat = map.getCenter().lat;
	var mCenterlng = map.getCenter().lng;

	// Add circle marker
	map.addSource('markers', {
		'type': 'geojson',
		'data': {
			'type': 'FeatureCollection',
			'features': [{
				'type': 'Feature',
				'geometry': {
					'type': 'Point',
					'coordinates': [mCenterlng, mCenterlat]
				},
				'properties': {
					'title': 'test'
				}
			}]
		}
	});

	map.addLayer({
		'id': 'markers',
		'source': 'markers',
		'type': 'circle',
		'paint': {
			'circle-radius': 9,
			'circle-color': '#FF0082',
			'circle-blur': 0.2,
			'circle-opacity': 0.65
		}
	});
});
