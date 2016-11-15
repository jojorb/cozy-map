var L = require('leaflet');
var mpb = 'pk.eyJ1Ijoicm9ieXJlbXp5IiwiYSI6ImNpcDBub25maTAwMXY3bmx3NGZsNGZ0a3YifQ.bmBwsePJ4QCsaGO85cLwhA';
var mpy = 'enpzOU5oNGZIQW1NLTI0T2JrdGFmQTpkNjliYWFiMTEyNmQ5YzVi';
var date = new Date();
var jmoinszin = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + (date.getDate() - 1)).slice(-2);
// var edjj = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
var viirs = 'VIIRS_SNPP_CorrectedReflectance_TrueColor';
// var modis = 'MODIS_Terra_CorrectedReflectance_TrueColor';

module.exports = {
	mpb: mpb,
	mpy: mpy,
	lmpb: L.tileLayer(
		'https://api.mapbox.com/styles/v1/robyremzy/cip0qeeez0003dnm6ixymeffw/tiles/{z}/{x}/{y}' + (L.Browser.retina ? '@2x' : '') + '?access_token=' + mpb, {
			attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			minZoom: 3,
			maxZoom: 18,
			label: 'Mapbox'
		}),
	lmpbo: L.tileLayer(
		'https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/{z}/{x}/{y}' + (L.Browser.retina ? '@2x' : '') + '?access_token=' + mpb, {
			attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			minZoom: 3,
			maxZoom: 20,
			label: 'Outdoors'
		}),
	lmpbs: L.tileLayer(
		'https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}' + (L.Browser.retina ? '@2x' : '') + '?access_token=' + mpb, {
			attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			minZoom: 3,
			maxZoom: 20,
			label: 'light'
		}),
	lmpbd: L.tileLayer(
		'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}' + (L.Browser.retina ? '@2x' : '') + '?access_token=' + mpb, {
			attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			minZoom: 3,
			maxZoom: 20,
			label: 'Dark'
		}),
	lesri: L.tileLayer(
		'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
			minZoom: 3,
			maxZoom: 18,
			label: 'ESRI'
		}),
	losm: L.tileLayer(
		'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			minZoom: 1,
			maxZoom: 19,
			label: 'OpenstreetMap'
		}),
	lhot: L.tileLayer(
		'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
			minZoom: 1,
			maxZoom: 19,
			label: 'Humanitarian OpenStreetMap Team'
		}),
	lgibs: L.tileLayer(
		'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/' + viirs + '/default/' + jmoinszin + '/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg', {
			attribution: 'gibs | earthdata.nasa.gov',
			minZoom: 2,
			maxZoom: 9,
			label: 'Nasa'
		}),
	mini: L.tileLayer(
		'https://api.mapbox.com/styles/v1/robyremzy/cip9jiy1u003qcunstx86hibr/tiles/{z}/{x}/{y}' + (L.Browser.retina ? '@2x' : '') + '?access_token=' + mpb, {
			attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			minZoom: 0,
			maxZoom: 11
		}),
	thcycle: L.tileLayer(
		'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
			attribution: 'Maps © Thunderforest, Data © OpenStreetMap contributors',
			minZoom: 0,
			maxZoom: 19,
			label: 'cycle'
		}),
	thoutdoors: L.tileLayer(
		'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', {
			attribution: 'Maps © Thunderforest, Data © OpenStreetMap contributors',
			minZoom: 0,
			maxZoom: 19,
			label: 'outdoors'
		}),
	cartodbd: L.tileLayer(
		'https://dnv9my2eseobd.cloudfront.net/v3/cartodb.map-4xtxp73f/{z}/{x}/{y}.png', {
		// 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
			minZoom: 0,
			maxZoom: 18,
			label: 'dark'
		}),
	cartodbl: L.tileLayer(
		'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
			minZoom: 0,
			maxZoom: 18,
			label: 'light'
		}),
	myRastertile: L.tileLayer(
		'styles/images/{z}/{x}/{y}.png', {
			attribution: '',
			minZoom: 0,
			maxZoom: 18,
			label: 'Your own tiles see left menu OSM/Custom Tiles Layers'
		}),
	MapillaryLayer: L.tileLayer(
		'https://d2munx5tg0hw47.cloudfront.net/tiles/{z}/{x}/{y}.png', {
			minZoom: 0,
			maxZoom: 18
		})
};
