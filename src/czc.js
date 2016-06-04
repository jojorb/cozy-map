// var swal = require('../vendor/sweetalert.min.js');


module.exports = {
	// error type func(cozysdk) if err
	err: ({
		title: 'Error',
		text: 'cannot reach Cozy!',
		timer: 2000,
		showConfirmButton: false
	}),
	// error type undefined or so
	bad: ({
		title: 'Snap!',
		text: 'Something went wrong!',
		showConfirmButton: true
	}),
	// show during loading pers. weather
	pws: ({
		title:
		'<span style="color:#FF8F33">' +
		'<i class="fa fa-sun-o fa-2x"></i></span>' +
		'<span style="color:#B6EDF1">' +
		'<i class="fa fa-bolt fa-2x"></i></span>' +
		'<span style="color:#323C44">' +
		'<i class="fa fa-cloud fa-2x"</i></span>',
		text: 'checking over 1.000 personal weather stations',
		showConfirmButton: false,
		html: true
	}),
	// show with a success for loading pers. weather
	pwss: ({
		title:
		'<span style="color:#33A6FF">' +
		'<i class="fa fa-cloud-download fa-2x"</i></span>',
		text: 'loaded on Map!',
		timer: 1000,
		showConfirmButton: false,
		html: true
	}),
	eq: ({
		title: 'Earthquake',
		text: 'last data over 5mg loaded',
		timer: '800',
		showConfirmButton: false
	}),
	// show during timezone loading
	ltz: ({
		title: 'Loading...',
		text: 'looking for User timezone',
		timer: 1500,
		showConfirmButton: false
	}),
	// show during contact loading
	lcl: ({
		title: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>',
		text: 'loading the Contact list',
		showConfirmButton: false,
		html: true
	}),
	// show when contact list success
	lcls: ({
		title:
		'<span style="color:#33A6FF">' +
		'<i class="fa fa-cloud-download fa-2x"</i></span>',
		text: 'Contacts loaded!',
		timer: 1000,
		showConfirmButton: false,
		html: true
	}),
	// show if err with contact address and Nominatim
	clu: ({
		title: 'Unknown address!',
		text: '<span style="color:#3D3D3D">' +
		'If this is a typo, please Edit with Cozy-Contact.</span><br><br>' +
		'<span style="color:#3D3D3D">' +
		'If not, Open Street Map may need an undate to find it.</span><br><br>' +
		'<p style="color:#3D3D3D">' +
		'Use our search tool ' +
		'<i class="fa fa-search"></i> and ' +
		'<a target="_blank"' +
		'href="https://github.com/RobyRemzy/cozy-map/wiki/apphelp#edit-with-id">' +
		'Edit with iD</a></p>',
		html: true
	}),
	mpb: 'pk.eyJ1Ijoicm9ieXJlbXp5IiwiYSI6ImNpcDBub25maTAwMXY3bmx3NGZsNGZ0a3YifQ.bmBwsePJ4QCsaGO85cLwhA',
	mpbx: ({
		title: 'Sneak Peek of MapBox!',
		text: 'enjoy the Satellite view from Mapbox during a week',
		imageUrl: '../styles/images/view/mapbox.png'
	})
};
