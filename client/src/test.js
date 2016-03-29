// url: 'http://overpass-api.de/api/interpreter?data=[out:json];node({lat1},{lon1},{lat2},{lon2})[amenity=bar; pub];out;',
// ["brewery"!="none"][amenity=bar]["brewery"!="none"][amenity=cafe]["cuisine"!="coffee_shop"]["brewery"!="none"]["brewery"!="none"][amenity=biergarten]["brewery"!="none"][amenity=pub]["brewery"!="none"];out;',
// [amenity=bar][microbrewery='yes'][amenity=fast_food][amenity=drinking_water][amenity=fuel][amenity=parking][amenity=marketplace]
//[amenity=cafe][name=Starbucks]
//[amenity=fast_food]
//[name="McDonald's"][name=KFC][name=Subway][name=Quick][name="Burger King"]["Big Fernand"]

L.layerJSON({
  url: "http://overpass-api.de/api/interpreter?data=[out:json];node({lat1},{lon1},{lat2},{lon2})[amenity=fast_food][name=Subway];out;",

  propertyItems:  'elements',
	propertyTitle:  'tags.name',
	propertyLoc:    ['lat','lon'],

 buildPopup: function(data, popup) {
	    return "<center><b>" +
          data.tags.name + "<br>" +
           "<a href="+data.tags.website+" target=_blank>" +
          (data.tags.website  || "n/a" || null) + "</a><br>" +
          (data.tags.opening_hours || "n/a" || null) + "</b></center>";
        },
}).addTo(map);
    // dataToMarker: function(data, latlng) {
    // 		return new L.marker(latlng, {
    //         icon: markerOverpass,
    //       });
    // 		},
  // updateOutBounds: function(data, marker);
