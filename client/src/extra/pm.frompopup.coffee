L = global.L or require('leaflet')


# WOP...


popupContent = L.popup().setContent(
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
    '@</button></div></form>')
