// var swal = require('../vendor/sweetalert.min.js');


module.exports = {
	// error type func(cozysdk) if err
	err: ({
		title: 'Error',
		text: 'cannot reach Cozy!',
		timer: 2000,
		showConfirmButton: false
	}),
	lcl: ({
		title: 'Loading...',
		text: 'looking for Contact list',
		timer: 1337,
		showConfirmButton: false
	}),
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
