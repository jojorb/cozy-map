
var redIcon = L.icon({
  iconUrl: '/styles/images/marker2-icon.png',
  shadowUrl: '/styles/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// fonction for the draggable redmarker
function onMapClick(e) {
  marker = new L.marker(e.latlng,
    {icon: redIcon, draggable:'true', opacity: '0.65'});
  marker.on('dragend', function(event){
    var marker = event.target;
    var markerzoom = map.getZoom();
    var position = marker.getLatLng();
    var popupContent = L.popup()
        .setContent(
          '<form class="placemarker-form">' +
          '<div class="input-group"><input type="text" name="bookmark-name" ' +
          'placeholder="Bookmark name" class="placemarker-form-input" value="">' +
          '<input type="hidden" class="placemarker-form-id" value="id">' +
          '<button type="submit" class="placemarker-form-submit">' +
          '+</button></div>' +
          '<div class="placemarker-form-coords">[Lat; Lng](zoom) = [' +
          position.lat.toFixed(4) + '; ' + position.lng.toFixed(4) + '](' +
          markerzoom + ')</div></form>' +
          '<form class="placemarker-form">' +
          '<div class="input-group"><input type="text" name="past-position" ' +
          'placeholder="[Lat; Lng](zoom)" class="placemarker-form-input" value="">' +
          '<input type="hidden" class="placemarker-form-id" value="goto">' +
          '<button type="submit" class="placemarker-form-submit">' +
          '@</button></div></form>'
          );
    marker.setLatLng(new L.LatLng(position.lat, position.lng),{draggable:'true'});
    marker.bindPopup(popupContent).openPopup();
    map.panTo(new L.LatLng(position.lat, position.lng));
  });
  map.addLayer(marker);
}
map.on('dblclick', onMapClick);

// submit to base or path? if patch maybe use 'npm inotifywait' to import in base
// onClick '+' fadeout redIcon and bring up the Icon.Default n open the popup
// popup add menu btn Edit.
