
//generating certain number (based on @params count) of random coordinates based on @params lat lon radius(m) 
//default config in .env :- lat, lon, radius/distance(m),count

//method 1: getRandomLocations - generating points closer to either center (lat/lon) or edge (radius/distance)
exports.getRandomLocations = function (latitude, longitude, radiusInMeters,count) {
    const getRandomCoordinates = function (radius, uniform) {
        // Generate two random numbers
        var a = Math.random(),
            b = Math.random();
        // Flip for more uniformity.
        if (uniform) {
            if (b < a) {
                var c = b;
                b = a;
                a = c;
            }
        }
        // It's all triangles.
        return [
            b * radius * Math.cos(2 * Math.PI * a / b),
            b * radius * Math.sin(2 * Math.PI * a / b)
        ];
    };

    var randomCoordinates = [];
    for(let i=0;i<count;i++){
        const randomCoordinate = getRandomCoordinates(radiusInMeters, true, count);

        // Earths radius in meters via WGS 84 model.
        const earth = 6378137;

        // Offsets in meters.
        const northOffset = randomCoordinate[0],
        eastOffset = randomCoordinate[1];

        // Offset coordinates in radians.
        const offsetLatitude = northOffset / earth,
        offsetLongitude = eastOffset / (earth * Math.cos(Math.PI * (latitude / 180)));
        
        // Offset position in decimal degrees.
        randomCoordinates.push({
            latitude: latitude + (offsetLatitude * (180 / Math.PI)),
            longitude: longitude + (offsetLongitude * (180 / Math.PI))
        });
    }
   //console.log(randomCoordinates)
    return randomCoordinates;
};

//method 2: generating mid points between center (lat/lon) and edge (distance/radius)
//https://gis.stackexchange.com/questions/25877/generating-random-locations-nearby
//https://gis.stackexchange.com/questions/69328/generate-random-location-within-specified-distance-of-a-given-point
exports.getRandomGeo=function randomGeo(lat, lon, radius,count) {
    var radiusInDegrees = radius / 111300; 
    var randomCoordinates = [];
    for(let i = 0; i < count; i++){
        var u = Math.random();
        var v = Math.random();

        var lat_offset = (radiusInDegrees * Math.sqrt(u)) * Math.cos(2 * Math.PI * v); 
        var lon_offset = (radiusInDegrees * Math.sqrt(u)) * Math.sin(2 * Math.PI * v); 

        var lat_offset_tunned = lat_offset / Math.cos(lon * Math.PI / 180);

        randomCoordinates.push({
            longitude: lon_offset + lon,
            latitude: lat_offset_tunned + lat
        });
    }
   //console.log(randomCoordinates)
    return randomCoordinates;
}

//for testing only - to verify if the distance between any two random points generated is no greater than the radius distance (input param specified by user)
exports.getDistance = function distance(lat1, lon1, lat2, lon2) {
    var R = 6371000;//6378137
    var a = 0.5 - Math.cos((lat2 - lat1) * Math.PI / 180) / 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * (1 - Math.cos((lon2 - lon1) * Math.PI / 180)) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
}
