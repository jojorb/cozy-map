// require modules
var L = require('leaflet');

require('./Control.Geocoder.js');
require('./leaflet.Bouncemarker.js');
require('./leaflet.Easybutton.js');
require('./leaflet.MiniMap.js');
require('./leaflet.Locate.js');
require('./leaflet.Sidebar-v2.js');
var Hash = require('./leaflet.Hash.js');

// specify the path to the leaflet images folder
L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';



//disable zoomControl (which is topleft by default) when initializing map&options
var map = new L.map('map', {
  zoomControl: false,
  attributionControl: false
});



new L.Control.Geocoder({
  // geocoder: new L.Control.Geocoder.photon(),
  position: 'topleft',
  collapsed: true,
  text: 'Locate',
  placeholder: '“Not all those who wander are lost.”',
  errorMessage: '“‘X’ never, ever marks the spot.”',
  callback: function (results) {
    var bbox = results.resourceSets[0].resources[0].bbox,
        first   = new L.LatLng(bbox[0], bbox[1]),
        second  = new L.LatLng(bbox[2], bbox[3]),
        bounds  = new L.LatLngBounds([first, second]);
    this._map.fitBounds(bounds);
  }
}).addTo(map);



// set your map url tiles layer
var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

// set OpenStreetMap attribution
var osmAttrib = " ";

// set Map tiles layer and Options
var osm = new L.TileLayer(osmUrl, {
  minZoom: 1,
  maxZoom: 19,
  detectRetina: true,
});

// add the tile layer to the map
map.addLayer(osm);

// set the position and zoom level of the map
map.setView(new L.LatLng(46.8, 3.8),3);



// MiniMap layer Options
var esriUrl='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

// set MiniMap attribution
var esriAttrib='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

// Set MiniMap
var esri = new L.TileLayer(esriUrl, {
  minZoom: 0,
  maxZoom: 11,
  attribution: esriAttrib
});

var miniMap = new L.Control.MiniMap(esri, {
  position: 'bottomright',
  width: 80,
  height: 80
}).addTo(map);



//add zoom control with your options
L.control.zoom({
  position:'bottomright'
}).addTo(map);



// icon for locate
var markerLicon = {
    iconUrl: 'public/images/bluedot.png',
    iconSize: [17, 17],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
    labelAnchor: [3, -4],
};



// locate controle on the top right side
L.control.locate(
  {
  position: 'topright',
  icon: 'fa fa-location-arrow',
  iconLoading: 'fa fa-refresh fa-spin',
  drawCircle: true,
  circlePadding: [20, 20],
  circleStyle: {
    color: "#FFF",
    fillColor: "#000",
    fillOpacity: "0.1",
    weight: "2",
  },
  follow: true,
  markerClass: L.marker,
  markerStyle: {
    icon: L.icon( markerLicon ),
    className: 'locatemarker-pulsate',
  },
  metric: true,
  strings: {
    title: "Show me where I am",
    metersUnit: "meters",
    feetUnit: "feet",
    popup: "<center>You are around " + "{distance} {unit} " + "from this point</center>",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
    },
  locateOptions: {
    enableHighAccuracy: true,
    maxZoom: 20
  }
  }).addTo(map);



// icon var to latter drag 'n drop by users
var addUicon = L.icon({
    iconUrl: 'public/images/pinpoi.png',
    iconRetinaUrl: 'public/images/pinpoi.png',
    iconSize: [36, 47],
    iconAnchor: [18, 47],
    popupAnchor: [0, -48],
});

// popup var for addUicon
var uiconPopup = "<b>Drag marker to adjust location.</b><br>" +
                  "Then click on " + "<i class='fa fa-thumb-tack'></i>" + " icon" +
                  "<br> to save it";

// css var for popups addUicon and results with L.Control.Geocoder search
var uiconPopupcss = {
  'className': 'uiconPopupcss',
  autoPan: false
};

// L.Marker contruction for addUicon
var uiconmarker = new L.Marker([46.8, 3.8],
  {
    icon: addUicon,
    draggable: true,
    bounceOnAdd: true,
    bounceOnAddOptions: {duration: 500, height: 400}
  });



// seconde top right side button with a toggle on/off for uiconmarker
var toggleUmarker = L.easyButton({

  // state to be able to drop the marker on map
  states: [{
    stateName: 'add-markers',
    icon: '<img src="public/images/mini_pinpoi.png">',
    title: 'add draggable markers',

    // drop the marker on map
    onClick: function(control) {
      uiconmarker.setLatLng(map.getCenter());
      uiconmarker.addTo(map);
      uiconmarker.bindPopup(uiconPopup, uiconPopupcss);
      uiconmarker.openPopup();

        // abilty to drag the marker with his features
        uiconmarker.on('dragend', function (e) {
          uiconmarker.getLatLng().lat.toFixed(6);
          uiconmarker.getLatLng().lng.toFixed(6);
          uiconmarker.setLatLng(uiconmarker.getLatLng());
          uiconmarker.bindPopup(uiconPopup, uiconPopupcss);
          uiconmarker.openPopup();
          console.log(uiconmarker.getLatLng());
          // console.log(uiconmarker.toGeoJSON());
          uiconmarker.bounce({duration: 200, height: 20});
          });

      // way to remove the marker
      control.state('remove-markers');
    }
  }, {

    // state to remove the marker
    icon: '<img src="public/images/mini_pinpoi_off.png">',
    stateName: 'remove-markers',

    // remove the marker from map
    onClick: function(control) {
      uiconmarker.remove(map);

      // way to add the marker on map
      control.state('add-markers');
    },
    title: 'remove markers'
  }]

  // performe the toggle from the button
});
toggleUmarker.addTo(map);



// Empty GeoJSON collection
var collection = {
    "type": "FeatureCollection",
    "features": []
};

// save/add all marker on map into GeoJSON --EasyButton
var pushMarkers = L.easyButton('fa fa-thumb-tack', function (btn, map){
    // Iterate the layers of the map
    map.eachLayer(function (layer) {
        // Check if layer is a marker
        if (layer instanceof L.Marker) {
            // Create GeoJSON object from marker
            var geojson = layer.toGeoJSON();
            // Push GeoJSON object to collection
            collection.features.push(geojson);
        }
    });
    console.log(collection);
  },
  "save marker"
).addTo(map);



var sidebar = L.control.sidebar('sidebar', {position: 'left'}).addTo(map);

// open sidebar EasyButton (not EasyBar)
var openThesidebar = L.easyButton('fa fa-bookmark',
     function(btn, map) {
       sidebar.open('home');
   }).addTo(map);



// hash the address bar
var hash = new L.Hash(map);
