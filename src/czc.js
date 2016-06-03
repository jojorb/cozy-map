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
		title: 'Will be loading',
		text: 'over 1.000 personal weather stations accross the planet',
		type: 'info',
		showCancelButton: true,
		closeOnConfirm: false,
		showLoaderOnConfirm: true,
		confirmButtonText: 'GO!'
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
		title: 'Loading...',
		text: 'looking for Contact list',
		timer: 1337,
		showConfirmButton: false
	}),
	// show if err with contact address and Nominatim
	clu: ({
		title: 'Unknown address!',
		text: '<span style="color:#3D3D3D">' +
		'If this is a typo click on Edit then Cloud to save it</span><br><br>' +
		'<span style="color:#3D3D3D">' +
		'If not, Open Street Map may need an undate to find it</span>' +
		'<p style="color:#3D3D3D">' +
		'Use our search tool and ' +
		'<a target="_blank"' +
		'href="https://github.com/RobyRemzy/cozy-map/wiki/apphelp#edit-with-id">' +
		'Edit with iD</a></p>',
		html: true
	})
};
