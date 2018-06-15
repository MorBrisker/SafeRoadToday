$(document).ready(function() {/* google maps -----------------------------------------------------*/
    google.maps.event.addDomListener(window, 'load', initMap);


    var map;
    var glob_resp;
    var globi;
    var infowindow;
    var locations = [];
    var currentPos;
    var mark;
    var riskResults=[];

    function moveToLocation(lat, lng){
        var center = new google.maps.LatLng(lat, lng);
        // using global variable:
        map.panTo(center);
        map.setZoom(18);
    }



    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function initMap() {
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            zoom: 11,
            center: {lat: 32.258669, lng: 34.837276},
            styles: [
                {
                    featureType: "administrative.country",
                    elementType: "labels",
                    stylers: [{visibility: "off"}]
                },
                {
                    featureType: "administrative.city",
                    elementType: "labels.text",
                    stylers: [{visibility: "off"}]
                },
                {
                    featureType: 'administrative.locality',
                    elementType: 'labels.text.fill',
                    stylers: [{visibility: "off"}]
                },
            ]
        });

        infowindow = new google.maps.InfoWindow({});

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                //infowindow.setPosition(pos);
                //infowindow.setContent('Location found.');
                //infowindow.open(map);
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(pos.lat, pos.lng),
                    map: map,
                    visible: true
                });
                currentPos = pos;
                map.setCenter(pos);
            }, function() {
                handleLocationError(true, infowindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infowindow, map.getCenter());
        }

        document.getElementById("current-location").addEventListener("click", function() {
            moveToLocation(currentPos.lat, currentPos.lng);
        }, false);



        var marker, i, markerCount = 0;
        var posMarkers = [];


        var lat = "32.258669";
        var lng = "34.837276";

        marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: map,
            visible: false
        });

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent("<div id='content'>aa</div>");
                infowindow.open(map, marker);
            }
        })(marker, i));

        posMarkers[markerCount] = marker;
        markerCount++;


        $(document).ready(function () {
            console.log(posMarkers);
            $('#toggleMarkers').click(function () {
                console.log('toggleMarkers');
                for (var j = 0; j < posMarkers.length; j++) {
                    if (posMarkers[j].getVisible()) {
                        posMarkers[j].setVisible(false);
                    }
                    else {
                        posMarkers[j].setVisible(true);
                    }
                }
            });
        });


        /*        var ctaLayer = new google.maps.KmlLayer({
         url: 'https://maksico.com/police_map/kmls/2.kmz',
         // url: 'https://raw.githubusercontent.com/nidaniel/Hello-World/master/roads-201705140752.kml',
         map: map
         });*/

        new AutocompleteDirectionsHandler(map);

    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }

    /**
     * @constructor
     */
    function AutocompleteDirectionsHandler(map) {
        this.map = map;
        this.originPlaceId = null;
        this.destinationPlaceId = null;
        this.travelMode = "DRIVING";
        var originInput = document.getElementById('origin-input');
        var destinationInput = document.getElementById('destination-input');
        var modeSelector = document.getElementById('mode-selector');
        //var current-location = document.getElementById('current-location');
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(null);
        this.directionsDisplay.setMap(map);
        var originAutocomplete = new google.maps.places.Autocomplete(
            originInput, {placeIdOnly: true});
        var destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput, {placeIdOnly: true});
        //remember the location
        //document.getElementById('origin-input').value = "My value";
        $("#origin-input").val(getCookie("last_orig"));
        $("#destination-input").val(getCookie("last_dest"));
        $("#origin-input").focus();

        google.maps.event.addDomListener(window, 'load', function () {
            //$("#origin-input").val(getCookie("last_orig"));
            //$("#destination-input").val(getCookie("last_dest"));
            //$("#origin-input").focus();

        });

        this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
        //this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(current-location);
    }

    function drawMarker(placeId) {
        var infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.getDetails({placeId: placeId}, function(place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });
                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                        'Place ID: ' + placeId + '<br>' +
                        place.formatted_address + '</div>');
                    infowindow.open(map, this);
                });
            }
        });
    }

    AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function (autocomplete, mode) {
        var me = this;
        autocomplete.bindTo('bounds', this.map);
        autocomplete.addListener('place_changed', function () {
            var place = autocomplete.getPlace();
            if (!place.place_id) {
                window.alert("Please select an option from the dropdown list.");
                return;
            }
            if (mode === 'ORIG') {
                me.originPlaceId = place.place_id;
                drawMarker(me.originPlaceId);
            } else {
                me.destinationPlaceId = place.place_id;
                drawMarker(me.destinationPlaceId);

            }
            setCookie("last_orig", document.getElementById('origin-input').value, 1);
            setCookie("last_dest", document.getElementById('destination-input').value, 1);
            me.route();
        });

    };

    function getPlaceIds(locationsPoints, locations) {
        console.log("getPlaceIds");
        var roadNames=null;
        console.log("locations before pre if: " + locationsPoints);
        if (locationsPoints) {
            var url = "https://roads.googleapis.com/v1/nearestRoads?points=" + locationsPoints + "&key=AIzaSyCMR3XgOsDE99I9_YL4fVX9u3DHUSJNy60";
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                console.log("locations before 1st if: " + locationsPoints);
                if (this.readyState == 4 && this.status == 200) {
                    console.log("locations before 2nd if: " + locationsPoints);
                    if (this.responseText) {
                        console.log("locations after both ifs: " + locationsPoints);
                        getRoadNames(JSON.parse(this.responseText), locations);
                    }
                }
            };
            xhttp.open("GET", url, true);
            xhttp.send();
        }
    }

    function getRoadNames(placeIds, locations) {
        console.log("locations in getRoadNames: " + locations);
        console.log("getRoadNames");
        var url = "https://maps.googleapis.com/maps/api/geocode/json?place_id=";
        var singlePlaceId;
        var counter = 0;
        var newLocations = [];
        var singleLocation;
        if (placeIds) {
            // console.log(placeIds);
            risksLevels = [];
            for (var i = placeIds.snappedPoints.length - 1; i >= 0; i--) {
                url = "https://maps.googleapis.com/maps/api/geocode/json?place_id=";
                url += placeIds.snappedPoints[i].placeId;
                url += geocodeKey;

                console.log(url);

                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        // console.log("getRoadNames ajax result");
                        // console.log(counter);
                        var result = JSON.parse(this.responseText);

                        if (result["status"] == "OK") {
                            var address = result["results"][0]["address_components"];
                            // console.log(result);
                            // console.log(address);
                            for (var i = 0; i < address.length; i++) {
                                if (address[i]["types"].indexOf('route') > -1) {
                                    // console.log('1');
                                    // if only number
                                    if (address[i]['short_name'] != null){
                                    if (!isNaN(address[i]['short_name'])) {
                                        //glob_resp.routes[0].legs[0].steps[glob_counter].isInterurban=1
                                        // console.log('set route');
                                        // console.log(locations[counter]);
                                        console.log(address[i]['short_name']);
                                        console.log(parseInt(address[i]['short_name']));
                                        console.log(locations[counter]);
                                        locations[counter]["route"] = parseInt(address[i]['short_name']);
                                        singleLocation = locations[counter];

                                        newLocations.push(singleLocation);
                                        break;
                                    }
                                  }
                                    else {
                                        //glob_resp.routes[0].legs[0].steps[glob_counter].isInterurban=0
                                        continue
                                    }
                                    //glob_counter++
                                }
                                //glob_resp.routes[0].legs[0].steps[glob_counter].isInterurban=0
                                //glob_counter++

                            }
                        }
                        console.log(placeIds.snappedPoints);
                        if (counter == placeIds.snappedPoints.length - 1) {
                            console.log('finish');
                            console.log(newLocations);
                            console.log(getRouteRiskLevel(newLocations));
                        }
                        counter++;
                    }
                };
                xhttp.open("GET", url, true);
                xhttp.send();
            }
        }
    }

    var polylineOptions = {
        strokeColor: '#C83939',
        strokeOpacity: 1,
        strokeWeight: 4
    };

    var colors = ["Grey", "Aqua", "DarkBlue", "Yellow", "Orange", "Red", "Black"];
    var polylines = new Array();

    //getPlaceIds(locationsPoints, locations);
    /**check if  path array contains path**/
    function findPlace(path, path_array) {
        for (i = 0; i < path_array.length; i++) {
            if (path.startLat == path_array[i].startLat &&
                path.startLng == path_array[i].startLng &&
                path.endLat == path_array[i].endLat &&
                path.endLng == path_array[i].endLng)
                return i
        }
        return -1
    }

    function colorRouteOnClick(response, routeIndex) {
      var bounds = new google.maps.LatLngBounds();
      //TODO: does this deletes the map?
      /*        for (var i = 0; i < polylines.length; i++) {
      polylines[i].setMap(null);
    }*/
    for (var r = 0; r < response.routes.length; r++){
      var legs = response.routes[r].legs;
      for (i = 0; i < legs.length; i++) {
        var steps = legs[i].steps;
        for (j = 0; j < steps.length; j++) {
          var nextSegment = steps[j].path;
          var stepPolyline = new google.maps.Polyline(polylineOptions);
          place = findPlace(roadsLocations[r][j], riskResults[r])
          if (r != routeIndex){
            stepPolyline.setOptions({
              strokeColor: colors[6]
            })
          }
          else if (place != -1) {
            stepPolyline.setOptions({
              strokeColor: colors[riskResults[r][place].risk + 1]
            })
          }
          else {
            stepPolyline.setOptions({
              strokeColor: colors[0]
            })
          }
          for (k = 0; k < nextSegment.length; k++) {
            stepPolyline.getPath().push(nextSegment[k]);
            bounds.extend(nextSegment[k]);
          }
          indexInPolylines = findPlace(stepPolyline, polylines[r]);
          polylines[r][indexInPolylines] = stepPolyline;
          stepPolyline.setMap(map);
          // route click listeners, different one on each step
          google.maps.event.addListener(stepPolyline, 'click', function (evt) {

            infowindow.setContent("you clicked on the route<br>" + evt.latLng.toUrlValue(6));
            infowindow.setPosition(evt.latLng);
            infowindow.open(map);
            //var myRoute = response.routes[0].legs[0];
          })
        }
      }
    }
    map.fitBounds(bounds);
  }


    function renderDirectionsPolylines(response) {
        document.getElementById("r0").addEventListener("click", function() {
            colorRouteOnClick(response, 0);
        }, false);
        document.getElementById("r1").addEventListener("click", function() {
            colorRouteOnClick(response, 1);
        }, false);
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < polylines.length; i++) {
          for (var j = 0; j < polylines[i].length; j++)
            polylines[i][j].setMap(null);
        }
        for (var r = 0; r < response.routes.length; r++) {
          innerArray = new Array();
            var legs = response.routes[r].legs;
            var polyIndex = 0
            for (i = 0; i < legs.length; i++) {
                var steps = legs[i].steps;
                //TODO: change steps.lenght to locations.lenght?
                for (j = 0; j < steps.length; j++) {
                    var nextSegment = steps[j].path;
                    var stepPolyline = new google.maps.Polyline(polylineOptions);
                    stepPolyline.routeIndex = r;

                    stepPolyline.setOptions({strokeColor: "Black"});

                    for (k = 0; k < nextSegment.length; k++) {
                        stepPolyline.getPath().push(nextSegment[k]);

                        bounds.extend(nextSegment[k]);
                    }
                    innerArray.push(stepPolyline);
                    polyIndex++;
                    stepPolyline.setMap(map);
                    // route click listeners, different one on each step
                    /*google.maps.event.addListener(stepPolyline, 'click', function (evt) {
                         infowindow.setContent("you clicked on the route<br>" + evt.latLng.toUrlValue(6));
                         infowindow.setPosition(evt.latLng);
                         infowindow.open(map);
                         var myRoute = response.routes[0].legs[0];
                         colorRouteOnClick(response, stepPolyline.routeIndex);

                    })*/
                }
            }
            polylines[r] = innerArray;
        }
        map.fitBounds(bounds);
    }

    function getRouteRiskLevel(locations) {
        // console.log("getRouteRiskLevel");
        // var xhttp = new XMLHttpRequest();
        // xhttp.onreadystatechange = function() {
        //   if (this.readyState == 4 && this.status == 200) {
        //     console.log(this.responseText);
        //   }
        // }
        // xhttp.open("POST", "risk-route-level");
        // xhttp.setRequestHeader("Content-Type", "application/json");
        // xhttp.send(JSON.stringify({result : locations}));

        console.log("----");
        console.log(locations);


        for (var i = locations.length - 1; i >= 0; i--) {
            console.log(locations[i]["route"]);
        }

        console.log("A----");

        console.log(JSON.stringify({result: locations}));

        console.log("B----");

        var locations_string = JSON.stringify({result: locations})

        $.ajax({
            type: 'POST',
            url: 'getRouteRiskLevel.php',
            async: false,
            data: {
                route: locations_string
            },
            success: function (result) {
                // We do something with the returned data.
                alert("resulty: " + result);
                riskResults.push(JSON.parse(result));
                renderDirectionsPolylines(glob_resp);
            }
        });


        /*          $.post( "getRouteRiskLevel.php", {
         route: JSON.stringify({result : locations})
         }).done(function( result ) {
         alert( "resulty: " + result );
         globi = result;

         });*/
    }

    AutocompleteDirectionsHandler.prototype.route = function () {
        if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
        }
        this.directionsService.route({
            origin: {'placeId': this.originPlaceId},
            destination: {'placeId': this.destinationPlaceId},
            provideRouteAlternatives: true,
            travelMode: this.travelMode
        }, function (response, status) {
            if (status === 'OK') {
                var myRoutes = response.routes;
                //alert(JSON.stringify(myRoute));
                //console.log("origin: " + myRoute.end_location.lat.so);
                //console.log("desitination: " + myRoute.start_location.lat["[[Scopes]]"]["0"].a + "," + myRoute.start_location.lat["[[Scopes]]"]["0"].b);
                // for nearestRoad check
                var index = 0;
                glob_resp = response;
                roadsLocationsPoints = [];
                roadsLocations = [];
                results = [];
                for (var j = 0; j < myRoutes.length; j++) {
                    var locationsPoints = "";
                    var locations = [];
                    myRoute = myRoutes[j].legs[0];
                    for (var i = 0; i < myRoute.steps.length; i++) {
                        //TODO:was 1000-is 100 correct?
                        if (myRoute.steps[i].distance.value > 10) {
                            // create road
                            var road = {};
                            road.startLat = myRoute.steps[i].start_location.lat();
                            road.startLng = myRoute.steps[i].start_location.lng();
                            road.endLat = myRoute.steps[i].end_location.lat();
                            road.endLng = myRoute.steps[i].end_location.lng();
                            road.distance = myRoute.steps[i].distance.value;
                            road.index = index;
                            road.risk = 0;
                            locations.push(road);

                            if (!locationsPoints) {
                                locationsPoints += myRoute.steps[i].start_location.lat() + "," + myRoute.steps[i].start_location.lng();
                            } else {
                                locationsPoints += "|" + myRoute.steps[i].start_location.lat() + "," + myRoute.steps[i].start_location.lng();
                            }
                            index++;
                        }
                    }
                    console.log("locations before push: " + locationsPoints);
                    roadsLocations.push(locations);
                    roadsLocationsPoints.push(locationsPoints);
                    console.log("locations before getPlaceIds: " + locationsPoints);
                    getPlaceIds(roadsLocationsPoints[j], roadsLocations[j]);


                    //TODO:get resultys for the different routes
/*                    $.ajax({
                        type: 'POST',
                        url: 'getRouteRiskLevel.php',
                        async: false,
                        data: {
                            route: roadsLocationsString[j]
                        },
                        success: function (result) {
                            // We do something with the returned data.
                            //results.push(result);
                            alert("resulty: " + result);
                            results.push(JSON.parse(result));
                            //renderDirectionsPolylines(glob_resp, map);
                        }
                    });*/

                }

                //getPlaceIds will call the draw func
                //getPlaceIds(roadsLocationsPoints, roadsLocations);

                //draw the route
                //me.directionsDisplay.setDirections(response);
                //renderDirectionsPolylines(response, map);
                //TODO:was in old script- maybe necessary?
                //me.directionsDisplay.setDirections(response);

            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
        geocodeKey = "&key=AIzaSyC442vPndzful8EudL_A1pcfzXX60GR7fQ";

    };
});
