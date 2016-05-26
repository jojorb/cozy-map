$('#syncmycontact').click(function () {

	var cList = 'function(doc) { emit(doc); }';
	cozysdk.defineRequest('Contact', 'all', cList, function (err, res) {
		if (err !== null) {
			return alert(err);
		}
		console.log('Contacts: ', res);
		cozysdk.run('Contact', 'all', {}, function (err, res) {
			if (err !== null) {
				return alert(err);
			}
			console.log('Contacts loading');
			var i;
			var HTML = '';
			for (i = 0; i < res.length; i++) {
				var mAd = _.findWhere(res[i].key.datapoints, {name: 'adr'}, {type: 'main'});
				if (mAd !== undefined && mAd.value !== undefined) {
					mAd.value.join('');
					var mAdz = mAd.value;
					console.log('Success: Get Contacts Address');
					var template =
					'<tr data-id="'  + res[i].id + '" class="cl">' +
						'<th rowspan="4" align="top">' +
						'<img height="42" width="42"src=' +
						'../contacts/contacts/' + res[i].id + '/picture.png' +
						// res[i].key.avatar +
						'>' +
						'</th>' +
						'<th align="left">' + res[i].key.fn + '</th>' +
					'</tr>' +
					'<tr>' +
						'<td class="data-add">' + mAdz[2] + '</td>' +
					'</tr>' +
					'<tr>' +
						'<td>' +
						'<input type="text" class="datalatlng" id="datalat" value="" disabled="disabled" />' +
						'<input type="text" class="datalatlng" id="datalng" value="" disabled="disabled" />' +
						'</td>' +
					'</tr>' +
					'<tr>' +
						'<td> link to </td>' +
					'</tr>';
					HTML = HTML + template;
				}
			} // end for
			document.querySelector('.contact-list').innerHTML = HTML;

			var contactsList = new L.LayerGroup().addTo(map);
			var overlayClist = {
				'Contacts List': contactsList
			};
			L.control.layers(baseLayers, overlayClist);

			$('tr.cl').click(function (event) {
				var id = event.currentTarget.dataset.id;
				geocoder = L.Control.Geocoder.nominatim();
				L.Control.geocoder({
					geocoder: geocoder
				});

				cozysdk.find('Contact', id, function (err, r) {
					if (err !== null) {
						return alert(err);
					}
					var m4dzCheck = _.findWhere(r.datapoints, {name: 'adr'}, {type: 'main'});
					if (m4dzCheck !== undefined && m4dzCheck.value !== undefined) {
						m4dzCheck.value.join('');
						var m4dz = m4dzCheck.value;
						console.log('process for: ', m4dz, ' loading...');
						geocoder.geocode(m4dz, function (results) {
							var r = results[0];
							var clmaRk = new L.Marker([r.properties.lat, r.properties.lon], {
								draggable: false,
								icon: clUicon
							}); // end clmaRk
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
							// TODO update contactsList with nominatim LatLng
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






// $('#syncmycontact').click(function () {
// 	console.log('get contacts...');
//
// 	var cList = 'function(doc) { emit(doc); }';
// 	cozysdk.defineRequest('Contact', 'all', cList, function (err, res) {
// 		if (err !== null) {
// 			return alert(err);
// 		}
// 		console.log(res);
//
// 		cozysdk.run('Contact', 'all', {}, function (err, res) {
// 			if (err !== null) {
// 				return alert(err);
// 			}
// 			console.log(res);
//
// 			var i;
// 			var HTML = '';
// 			for (i = 0; i < res.length; i++) {
//
// 				var mAd = _.findWhere(res[i].key.datapoints, {name: 'adr'}, {type: 'main'});
//
// 				if (mAd !== undefined && mAd.value !== undefined) {
// 					mAd.value.join('');
// 					// console.log('cl mAd:', mAd.value);
//
// 					var mAdz = mAd.value;
// 					// console.log('cl mAdz', mAdz);
// 					// console.log('cl mAdz', mAdz[2]);
// 					console.log('contacts loaded!');
// 					// https://remi.cozycloud.cc/apps/contacts/contacts/5b7754c21d121e98cf57d2148b006808
//
// 					var template =
// 					'<tr data-id="'  + res[i].id + '" class="cl">' +
// 						'<th rowspan="4" align="top">' +
// 						'<img height="42" width="42"src=' +
// 						'../contacts/contacts/' + res[i].id + '/picture.png' +
// 						// res[i].key.avatar +
// 						'>' +
// 						'</th>' +
// 						'<th align="left">' + res[i].key.fn + '</th>' +
// 					'</tr>' +
// 					'<tr>' +
// 						'<td class="data-add">' + mAdz[2] + '</td>' +
// 					'</tr>' +
// 					'<tr>' +
// 						'<td>' +
// 						'<input type="text" class="datalatlng" id="datalat" value="" disabled="disabled" />' +
// 						'<input type="text" class="datalatlng" id="datalng" value="" disabled="disabled" />' +
// 						'</td>' +
// 					'</tr>' +
// 					'<tr>' +
// 						'<td> link to </td>' +
// 					'</tr>';
// 					// '<tr data-id="'  + res[i].id + '" class="cl"><th>' +
// 					// '<span class="data-name" id="dataname">' + res[i].key.fn + '</span>' +
// 					// '<p class="data-add" id="dataadd">' + mAdz[2] + '</p>' +
// 					// '<input type="text" class="datalatlng" id="datalat" value="" disabled="disabled" />' +
// 					// '<input type="text" class="datalatlng" id="datalng" value="" disabled="disabled" />' +
// 					// '<br></th></tr>';
//
// 					HTML = HTML + template;
// 				}
// 			}
// 			document.querySelector('.contact-list').innerHTML = HTML;
// 			// return false;
//
// 			// create an empty layer for the data
// 			var contactsList = new L.LayerGroup().addTo(map);
// 			// keep it inside the controle Layer
// 			var overlayClist = {
// 				'Contacts List': contactsList
// 			};
// 			L.control.layers(baseLayers, overlayClist);
// 			console.log(overlayClist);
//
// 			// get address to geocoder and return lat, lng
// 			$('tr.cl').click(function (event) {
// 				console.log($(event.currentTarget));
// 				// console.log($(this));
// 				// console.log($(event.currentTarget.dataset.id));
//
// 				var id = event.currentTarget.dataset.id;
// 				console.log(id);
//
// 				// define the geocoder params
// 				geocoder = L.Control.Geocoder.nominatim();
// 				L.Control.geocoder({
// 					geocoder: geocoder
// 				});
//
// 				// get the right iteration address to build the right geocoder query
// 				cozysdk.find('Contact', id, function (err, r) {
// 				// .then(function (r) {
// 					console.log('find', r);
// 					var m4dzCheck = _.findWhere(r.datapoints, {name: 'adr'}, {type: 'main'});
// 					if (m4dzCheck !== undefined && m4dzCheck.value !== undefined) {
// 						m4dzCheck.value.join('');
// 						console.log('m4dzCheck:', m4dzCheck.value);
//
// 						var m4dzOk = m4dzCheck.value;
// 						console.log('m4dzOK', m4dzOk);
// 					}
// 					// r.title;
//
// 					// $('td.data-add').html();
//
//
// 					// build a simple query with nominatim and get the results in .json
// 					geocoder.geocode(m4dzOk, function (results) {
// 						var r = results[0];
// 						// console.log(results[0]);
// 						console.log(results[0].name);
// 						console.log(r.properties.boundingbox);
//
// 						// define the marker
// 						var clmaRk = new L.Marker([r.properties.lat, r.properties.lon], {
// 							draggable: false,
// 							icon: clUicon
// 						});
// 						// build a marker popup with the response name
// 						clmaRk.bindPopup(r.name, {
// 							className: 'uiconPopupcss'
// 						});
// 						// add the marker to the layer and open popup
// 						clmaRk.addTo(contactsList)
// 						.openPopup();
// 						// fit the map view to the new droped marker with the bbox provided
// 						map.fitBounds([
// 							[r.bbox._southWest.lat, r.bbox._southWest.lng],
// 							[r.bbox._northEast.lat, r.bbox._northEast.lng]
// 						]);
// 						// remove all the markers from the layer
// 						clmaRk.on('dblclick', function () {
// 							contactsList.clearLayers();
// 						});
// 						// render the lat and lng on inputs
// 						var getContlat = r.properties.lat;
// 						document.querySelector('#datalat').value = getContlat;
// 						var getContlng = r.properties.lon;
// 						document.querySelector('#datalng').value = getContlng;
// 					});
// 				});
// 				// console.log('m4dz said: ', m4dz);
// 			});
// 			return false;
// 		});
// 		return false;
// 	});
// 	// return false;
// });
// // });
