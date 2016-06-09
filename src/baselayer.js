var L = require('leaflet'),
czc = require('./czc');

var date = new Date();
var jmoinszin = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + (date.getDate() - 1)).slice(-2);
// var edjj = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
var viirs = 'VIIRS_SNPP_CorrectedReflectance_TrueColor';
// var modis = 'MODIS_Terra_CorrectedReflectance_TrueColor';

module.exports = {
	'lmpb': L.tileLayer(
		'https://api.mapbox.com/styles/v1/robyremzy/cip0qeeez0003dnm6ixymeffw/tiles/{z}/{x}/{y}' + (L.Browser.retina ? '@2x' : '') + '?access_token=' + czc.mpb, {
			attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			minZoom: 3,
			maxZoom: 20
		}),
	'lmpbo': L.tileLayer(
		'https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/{z}/{x}/{y}' + (L.Browser.retina ? '@2x' : '') + '?access_token=' + czc.mpb, {
			attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			minZoom: 3,
			maxZoom: 20
		}),
	'lmpbd': L.tileLayer(
		'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}' + (L.Browser.retina ? '@2x' : '') + '?access_token=' + czc.mpb, {
			attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			minZoom: 3,
			maxZoom: 20
		}),
	'lesri': L.tileLayer(
		'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
			minZoom: 3,
			maxZoom: 18
		}),
	'losm': L.tileLayer(
		'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			minZoom: 1,
			maxZoom: 19
		}),
	'lgibs': L.tileLayer(
		'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/' + viirs + '/default/' + jmoinszin + '/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg', {
			attribution: 'gibs | earthdata.nasa.gov',
			minZoom: 3,
			maxZoom: 9
		}),
	'mini': L.tileLayer(
		'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/{z}/{x}/{y}' + (L.Browser.retina ? '@2x' : '') + '?access_token=' + czc.mpb, {
			attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			minZoom: 0,
			maxZoom: 11
		})
	// 'myRastertile': L.tileLayer(
	// 	null, {})
};
