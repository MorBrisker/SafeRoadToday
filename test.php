<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="initial-scale=1.0">
        <meta charset="utf-8">
        <title>JSP Page</title>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

        <style>
        /* Always set the map height explicitly to define the size of the div
         * element that contains the map. */
        #map {
          height: 100%;
        }
        /* Optional: Makes the sample page fill the window. */
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
        }

        .controls {
        margin-top: 10px;
        border: 1px solid transparent;
        border-radius: 2px 0 0 2px;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        height: 32px;
        outline: none;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      }

      #origin-input,
      #destination-input {
        background-color: #fff;
        font-family: Roboto;
        font-size: 15px;
        font-weight: 300;
        margin-left: 12px;
        padding: 0 11px 0 13px;
        text-overflow: ellipsis;
        width: 200px;
      }

      #origin-input:focus,
      #destination-input:focus {
        border-color: #4d90fe;
      }
      </style>
    </head>
    <body>
        <!--<% // out.print((String)request.getAttribute("kmlFileName") ); %>-->
        <button id="toggleMarkers" href="#">ToggleMarkers (By default hide) </button>
        <a id="updateRoads" href="#">Update Roads</a>

        <input id="origin-input" class="controls" type="text"
        placeholder="Enter an origin location">

        <input id="destination-input" class="controls" type="text"
        placeholder="Enter a destination location">

        <div id="map"></div>
    <script>

        var map;
        var glob_resp;
        var globi;
        var glob_counter=0;
        var infowindow;
        var locations = [];

        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
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
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 11,
          center: {lat: 32.258669, lng: 34.837276},
          styles: [
            {
              featureType: "administrative.country",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "administrative.city",
              elementType: "labels.text",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{visibility: "off"}]
            },
          ]
        });
        
        infowindow = new google.maps.InfoWindow({});

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
    
                
        $(document).ready(function(){
            console.log(posMarkers);
            $('#toggleMarkers').click(function(){
                console.log('toggleMarkers');
                for(var j=0; j<posMarkers.length; j++){
                    if(posMarkers[j].getVisible()) {
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
          this.directionsService = new google.maps.DirectionsService;
          this.directionsDisplay = new google.maps.DirectionsRenderer;
          this.directionsDisplay.setMap(null);
          this.directionsDisplay.setMap(map);
          var originAutocomplete = new google.maps.places.Autocomplete(
              originInput, {placeIdOnly: true});
          var destinationAutocomplete = new google.maps.places.Autocomplete(
              destinationInput, {placeIdOnly: true});

          google.maps.event.addDomListener(window, 'load', function() {
              $("#origin-input").val(getCookie("last_orig"));
              $("#destination-input").val(getCookie("last_dest"));
              $("#origin-input").focus();
          });

          this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
          this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
          this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
          this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
          this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
      }

      

      AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
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
              } else {
                  me.destinationPlaceId = place.place_id;
              }
              setCookie("last_orig", document.getElementById('origin-input').value, 1);
              setCookie("last_dest", document.getElementById('destination-input').value, 1);
              me.route();
          });

      };

	
        function getPlaceIds(locationsPoints, locations) {
            console.log("getPlaceIds");
            if (locationsPoints) {
                var url = "https://roads.googleapis.com/v1/nearestRoads?points=" + locationsPoints + "&key=AIzaSyCMR3XgOsDE99I9_YL4fVX9u3DHUSJNy60";
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        // console.log(this.responseText);
                        if (this.responseText) {
                            getRoadNames(JSON.parse(this.responseText), locations);
                        }
                    }
                };
                xhttp.open("GET", url, true);
                xhttp.send();
            }
        }
	
	function getRoadNames(placeIds, locations) {
        console.log("getRoadNames");
        var url = "https://maps.googleapis.com/maps/api/geocode/json?place_id=";
        var singlePlaceId;
        var counter = 0;
        var newLocations = [];
        var singleLocation;
        if (placeIds) {
            // console.log(placeIds);
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
                                    else{
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

        //var colors = ["#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];
        var colors = ["Grey", "Aqua", "DarkBlue", "Yellow", "Orange", "Red", "Black"];
        var polylines = [];

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

        function renderDirectionsPolylines(response) {
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < polylines.length; i++) {
                polylines[i].setMap(null);
            }
            var legs = response.routes[0].legs;
            for (i = 0; i < legs.length; i++) {
                var steps = legs[i].steps;
                var interurban_counter=0;
                //TODO: change steps.lenght to locations.lenght?
                for (j = 0; j < steps.length; j++) {
                    var nextSegment = steps[j].path;
                    var stepPolyline = new google.maps.Polyline(polylineOptions);
                    //if (steps[j].isInterurban){
                    place = findPlace(locations[j], globi)
                    if(place!= -1){
                        stepPolyline.setOptions({
                            strokeColor: colors[globi[place].risk+1]
                        })
                    }
                    else {
                        stepPolyline.setOptions({
                            strokeColor: colors[0]
                        })
                    }
                        //interurban_counter++
                    //}
/*                    else{
                        stepPolyline.setOptions({
                            strokeColor: colors[0]
                        })
                    }*/
                        //console.log(j);
                        //console.log(globi[j]);

                    for (k = 0; k < nextSegment.length; k++) {
                        stepPolyline.getPath().push(nextSegment[k]);
                        bounds.extend(nextSegment[k]);
                    }
                    polylines.push(stepPolyline);
                    stepPolyline.setMap(map);
                    // route click listeners, different one on each step
                    google.maps.event.addListener(stepPolyline, 'click', function(evt) {
                        infowindow.setContent("you clicked on the route<br>" + evt.latLng.toUrlValue(6));
                        infowindow.setPosition(evt.latLng);
                        infowindow.open(map);
                    })
                }
            }
            map.fitBounds(bounds);
        }

        function getRouteRiskLevel(locations){
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

          console.log(JSON.stringify({result : locations}));
          
          console.log("B----");

          var locations_string=JSON.stringify({result : locations})

            $.ajax({
                type: 'POST',
                url: 'getRouteRiskLevel.php',
                async: false,
                data:
                    {
                        route: locations_string
                    },
                success: function(result)
                {
                    // We do something with the returned data.
                    alert( "resulty: " + result);
                    globi = JSON.parse(result);
                    renderDirectionsPolylines(glob_resp, map);
                }
            });


/*          $.post( "getRouteRiskLevel.php", {
            route: JSON.stringify({result : locations})
          }).done(function( result ) {
            alert( "resulty: " + result );
              globi = result;

          });*/
        }

      AutocompleteDirectionsHandler.prototype.route = function() {
          if (!this.originPlaceId || !this.destinationPlaceId) {
              return;
          }
          var me = this;

          this.directionsService.route({
              origin: {'placeId': this.originPlaceId},
              destination: {'placeId': this.destinationPlaceId},
              travelMode: this.travelMode
          }, function (response, status) {
              if (status === 'OK') {
                  var locationsPoints = "";
                  var myRoute = response.routes[0].legs[0];
                  alert(JSON.stringify(myRoute));
                  //console.log("origin: " + myRoute.end_location.lat.so);
                  //console.log("desitination: " + myRoute.start_location.lat["[[Scopes]]"]["0"].a + "," + myRoute.start_location.lat["[[Scopes]]"]["0"].b);
                  var road = {};
                  // for nearestRoad check
                  var index = 0;
                  for (var i = 0; i < myRoute.steps.length; i++) {
                      //TODO:was 1000-is 100 correct?
                      if (myRoute.steps[i].distance.value > 10) {
                          // create road
                          road = {};
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
                  glob_resp = response;
                  getPlaceIds(locationsPoints, locations);

                  //draw the route
                  //me.directionsDisplay.setDirections(response);
                  //renderDirectionsPolylines(response, map);

              } else {
                  window.alert('Directions request failed due to ' + status);
              }
          });
          geocodeKey = "&key=AIzaSyC442vPndzful8EudL_A1pcfzXX60GR7fQ";
      };
    </script>
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC442vPndzful8EudL_A1pcfzXX60GR7fQ&libraries=places&callback=initMap">
    </script>
    </body>
</html>
