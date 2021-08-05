console.log("Step 1");

var graymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
    }
);

var map =  L.map("map", {
    center: [
        40.7, -94.5
    ],
    zoom: 3
});

graymap.addTo(map);


// call in D# json data from the website
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
})

function styleInfo(feature) {
return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.geometry.coordiates[2]),
    color: "#000000",
    radius: getRadius(geature.properties.mag),
    stroke: true,
    weight: 0.5
};
}

function getColor(depth) {
    switch (true) {
    case depth > 90:
        return "#ea2c2c";
    case depth > 70:
        return "#ea822c";
    case depth > 50:
        return "#ee9c00";
    case depth > 30:
        return "#eecc00";
    case depth > 10:
        return "#d4ee00";
    default:
        return "#98ee00";
    }

}

function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1
    }
    return magnitude * 4;
}

L.geoJson(data, {
    pointToLayer: function(feature, lating) {
        return L.circleMarker(lating);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer){
        layer.bindPopup(
            "Magnitude: "
            +feature.properties.mag
            +"<br>Depth: "
            +feature.geometry.coordiates[2]
            +"<br>Location: "
            +feature.properties.place
        );
    }
}).addTo(map);

var legend  = L.control({
    position: "bottomleft"
});

legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = [
        "#98ee00",
        "#d4ee00",
        "#eeccoo",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c",
    ];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + grades[i] + (grades[1 + 1] ? "&andash;" + grades[i + 1] + "<br>" : "+");   
    }
    return div;
};

legend.addTo(map);

