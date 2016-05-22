var L = require('leaflet'),
    hasGeolocate = navigator.geolocation;

module.exports = function(map, cb, options) {
    var success = function(p) {
            var lat = p.coords.latitude,
                lng = p.coords.longitude,
                latAccuracy = 180 * p.coords.accuracy / 40075017,
                lngAccuracy = latAccuracy / Math.cos(L.LatLng.DEG_TO_RAD * lat),
                bounds = L.latLngBounds(
                    [lat - latAccuracy, lng - lngAccuracy],
                    [lat + latAccuracy, lng + lngAccuracy]);

            if (!completed) {
                cb(undefined, {
                    latlng: L.latLng(lat, lng),
                    alt: p.coords.altitude,
                    accuracy: p.coords.accuracy,
                    zoom: map.getBoundsZoom(bounds)
                });
                clearTimeout(timer);
            }
        },
        error = function(e) {
            if (!completed) {
                cb(e);
                clearTimeout(timer);
            }
        },
        timer,
        completed;

    options = options || {};

    if (!hasGeolocate) {
        cb({
            code: 'NOT_SUPPORTED',
            message: 'Geolocation API not supported by browser.'
        });
    }

    navigator.geolocation.getCurrentPosition(success, error, options);

    if (options.timeout) {
        // Since timeout will not trigger if the user
        // does not answer for example.
        timer = setTimeout(function() {
            cb({
                code: 'TIMEOUT',
                message: 'Geolocation timed out'
            });
            completed = true;
        }, options.timeout);
    }
};
