/* Public map js*/
var mapboxToken = 'pk.eyJ1Ijoicm9ieXJlbXp5IiwiYSI6ImNpc2RtemNqazAwMTkyeG82MHBlemx6aTMifQ.wSeiG1ERx30Dwc27idsDfQ';
mapboxgl.accessToken = mapboxToken;

var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v9',
	zoom: 4,
	scrollZoom: false,
	attributionControl: true,
	hash: true
});

var nav = new mapboxgl.Navigation({position: 'bottom-right'});
map.addControl(nav);

map.on('style.load', function () {

	var mCenterlat = map.getCenter().lat;
	var mCenterlng = map.getCenter().lng;

	map.addSource('markers', {
		'type': 'geojson',
		'data': {
			'type': 'FeatureCollection',
			'features': [{
				'type': 'Feature',
				'geometry': {
					'type': 'Point',
					'coordinates': [mCenterlat, mCenterlng]
				},
				'properties': {
					'title': 'From my Cozy!'
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

var popup = new mapboxgl.Popup({
	closeButton: false,
	closeOnClick: false
});

map.on('mousemove', function (e) {
	var features = map.queryRenderedFeatures(e.point, {
		layers: ['markers']
	});

	map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

	if (!features.length) {
		popup.remove();
		return;
	}

	var feature = features[0];

	popup.setLngLat(feature.geometry.coordinates)
	.setHTML(
		feature.properties.title
	)
	.addTo(map);
});
