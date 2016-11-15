require('leaflet.icon.glyph');

module.exports = {

	dropUicon: L.icon({
		iconUrl: 'styles/images/pinpoi.png',
		iconRetinaUrl: 'styles/images/pinpoi.png',
		iconSize: [36, 47],
		iconAnchor: [18, 47],
		popupAnchor: [0, -48]
	}),

	dataUicon: L.icon({
		iconUrl: 'styles/images/datamarker.png',
		iconRetinaUrl: 'styles/images/datamarker.png',
		iconSize: [13, 23],
		iconAnchor: [6.5, 23],
		popupAnchor: [0, -24]
	}),

	route: L.icon.glyph({
		iconUrl: 'styles/images/routemarker.svg',
		iconSize: [37, 50],
		iconAnchor: [18.5, 50],
		glyphAnchor: [0, -7],
		popupAnchor: [0, -51],
		prefix: '',
		glyphColor: 'white',
		glyphSize: '15px'
		// glyph: String.fromCharCode(65 + i)
	}),

	question: L.icon.glyph({
		iconUrl: 'styles/images/geocodermarker.svg',
		iconSize: [37, 50],
		iconAnchor: [18.5, 50],
		glyphAnchor: [0, -8],
		popupAnchor: [0, -51],
		prefix: '',
		glyphColor: 'white',
		glyphSize: '23px',
		glyph: '?'
	}),

	mIcon: L.divIcon({
		className: 'pkey-sbig',
		iconSize: [26, 33],
		iconAnchor: [13, 16]
	}),

	msIcon: L.divIcon({
		className: 'pkey-hl',
		iconSize: [52, 70],
		iconAnchor: [26, 35]
	}),

	msfIcon: L.divIcon({
		className: 'pkey-hls',
		iconSize: [52, 70],
		iconAnchor: [26, 35]
	}),

	maIcon: L.divIcon({
		className: 'pkey',
		iconSize: [18, 24],
		iconAnchor: [8, 12]
	}),

	mafIcon: L.divIcon({
		className: 'pkey-a',
		iconSize: [18, 26],
		iconAnchor: [8, 13]
	})

};
