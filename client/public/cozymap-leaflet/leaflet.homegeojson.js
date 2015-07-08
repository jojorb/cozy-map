/**
* Leaflet.HomeGeoJson
* https://github.com/Leaflet/Leaflet/blob/master/PLUGIN-GUIDE.md#module-loaders
*/
(function(factory, window) {

  // define an AMD module that relies on 'leaflet'
  if (typeof define === 'function' && define.amd) {
    define(["leaflet"], factory);

  // define a Common JS module that relies on 'leaflet'
  } else if (typeof exports === 'object') {
    module.exports = factory(require('leaflet'));
  }

  // attach your plugin to the global 'L' variable
  if (typeof window !== 'undefined' && window.L) {
      window.L.HomeGeoJson = factory(L);
  }
}(this, function(L) {

return (function () {
  /* global L */
  'use strict';
  L.geoJson.HomeGeoJson = L.geoJson.extend({

    onAdd: function (map) {
      this._map = map;
      return this._initLayout();
    },
    setCenter: function (center) {
      this._center = center;
      return this;
    },
    setZoom: function (zoom) {
      this._zoom = zoom;
      return this;
    },
    _initLayout: function () {
      var container = L.DomUtil.create('div', 'leaflet-bar ' +
        this.options.className);
      this._container = container;
      this._fullExtentButton = this._createExtentButton(container);

      L.DomEvent.disableClickPropagation(container);

      this._map.whenReady(this._whenReady, this);

      return this._container;
    },
    _createExtentButton: function () {
      var link = L.DomUtil.create('a', this.options.className + '-toggle',
        this._container);
      link.href = '#';
      link.innerHTML = this.options.text;
      link.title = this.options.title;

      L.DomEvent
        .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
        .on(link, 'click', L.DomEvent.stop)
        .on(link, 'click', this._zoomToDefault, this);
      return link;
    },
    _whenReady: function () {
      if (!this._center) {
        this._center = this._map.getCenter();
      }
      if (!this._zoom) {
        this._zoom = this._map.getZoom();
      }
      return this;
    },
    _zoomToDefault: function () {
      this._map.setView(this._center, this._zoom);
    }
});


var request = new XMLHttpRequest();
request.open('GET', this.homegeojsonDir, true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    // console.log("Success!");
    var data = JSON.parse(request.responseText);
    L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng);
      },
      onEachFeature: function (feature, layer) {
        var lat = feature.geometry.coordinates[1];
        var lng = feature.geometry.coordinates[0];
        var zoom = feature.properties.zoom;
        var popupContent = L.popup()
          .setContent(
            '<div class="leaflet-homegeojson-popup-title">' +
            '[' + feature.geometry.coordinates[1] + ', ' +
            feature.geometry.coordinates[0] + '](' +
            feature.properties.zoom + ')' + '</div>' +
            '<labels class="leaflet-homegeojson-popup">' +
            feature.properties.title + ' / ' +
            feature.properties.name +
            '</labels>'
          );
        // map.panTo([lat, lng]);
        map.setView([lat, lng], zoom);
        layer.bindPopup(popupContent).openPopup();
      }
    }).addTo(map);
  } else {
    // console.log("We reached our target server, but it returned an error");
  }
};
request.onerror = function() {
  // console.log("There was a connection error of some sort");
};
request.send();


 return L.geoJson.HomeGeoJson;

}());

}, window));
