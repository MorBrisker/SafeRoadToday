

$(document).ready(function(){/* google maps -----------------------------------------------------*/
google.maps.event.addDomListener(window, 'load', initMap);


             
    function initMap() {
      var map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 13,
        scrollWheel: false,
        center: {lat: 31.949497, lng: 34.893386},
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
      
      var infowindow = new google.maps.InfoWindow({});

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


      var ctaLayer = new google.maps.KmlLayer({
        url: 'https://maksico.com/police_map/kmls/2.kmz',
        // url: 'https://raw.githubusercontent.com/nidaniel/Hello-World/master/roads-201705140752.kml',
        map: map
      });

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
      this.directionsDisplay.setMap(map);

      var originAutocomplete = new google.maps.places.Autocomplete(
          originInput, {placeIdOnly: true});
      var destinationAutocomplete = new google.maps.places.Autocomplete(
          destinationInput, {placeIdOnly: true});

      

      this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
      this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
    }

    

    AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
      var me = this;
      autocomplete.bindTo('bounds', this.map);
      autocomplete.addListener('place_changed', function() {
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
        me.route();
      });

    };

    AutocompleteDirectionsHandler.prototype.route = function() {
      if (!this.originPlaceId || !this.destinationPlaceId) {
        return;
      }
      var me = this;

      this.directionsService.route({
        origin: {'placeId': this.originPlaceId},
        destination: {'placeId': this.destinationPlaceId},
        travelMode: this.travelMode
      }, function(response, status) {
        if (status === 'OK') {
          var locationsPoints = "";
          var locations = [];
          var myRoute = response.routes[0].legs[0];
          var road = {};
          // for nearestRoad check
          var index = 0;
          for (var i = 0; i < myRoute.steps.length; i++) {
            if(myRoute.steps[i].distance.value > 1000){
              // create road
              road = {};
              road.startLat = myRoute.steps[i].start_location.lat();
              road.startLng = myRoute.steps[i].start_location.lng();
              road.endLat = myRoute.steps[i].end_location.lat();
              road.endLng = myRoute.steps[i].end_location.lng();
              road.distance = myRoute.steps[i].distance.value;
              road.index = index;

              locations.push(road);

              if (!locationsPoints){
                locationsPoints += myRoute.steps[i].start_location.lat() + "," + myRoute.steps[i].start_location.lng();
              } else {
                locationsPoints += "|" + myRoute.steps[i].start_location.lat() + "," + myRoute.steps[i].start_location.lng();
              }
              index++;
            }
          }
          getPlaceIds(locationsPoints, locations);
          

          me.directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });


      function getPlaceIds(locationsPoints, locations){
        console.log("getPlaceIds");
        if(locationsPoints){
          var url = "https://roads.googleapis.com/v1/nearestRoads?points=" + locationsPoints + "&key=AIzaSyCMR3XgOsDE99I9_YL4fVX9u3DHUSJNy60";
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              // console.log(this.responseText);
              if(this.responseText){
                getRoadNames(JSON.parse(this.responseText), locations);
              }
            }
          };
          xhttp.open("GET", url, true);
          xhttp.send();
        }
      }
      geocodeKey = "&key=AIzaSyC442vPndzful8EudL_A1pcfzXX60GR7fQ";
      function getRoadNames(placeIds, locations){
        console.log("getRoadNames");
        var url = "https://maps.googleapis.com/maps/api/geocode/json?place_id=";
        var singlePlaceId;
        var counter = 0;
        var newLocations = [];
        var singleLocation;
        if(placeIds){
          // console.log(placeIds);
          for (var i = placeIds.snappedPoints.length - 1; i >= 0; i--) {
            url = "https://maps.googleapis.com/maps/api/geocode/json?place_id=";
            url += placeIds.snappedPoints[i].placeId;
            url += geocodeKey;

            console.log(url);

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                // console.log("getRoadNames ajax result");
                // console.log(counter);
                var result = JSON.parse(this.responseText);
                
                if(result["status"] == "OK"){
                  var address = result["results"][0]["address_components"];
                  // console.log(result);
                  // console.log(address);
                  for(var i = 0; i < address.length; i++){
                    if(address[i]["types"].indexOf('route') > -1){
                      // console.log('1');
                      // if only number
                      if(!isNaN(address[i]['short_name'])){
                        // console.log('set route');
                        // console.log(locations[counter]);
                        locations[counter]["route"] = parseInt(address[i]['short_name']);
                        singleLocation = locations[counter];

                        newLocations.push(singleLocation);
                        break;
                      }
                    }
                  }                    
                }
                console.log(placeIds.snappedPoints);
                if(counter == placeIds.snappedPoints.length - 1){
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

        console.log("----");
      }
    };
});

// function initialize() {

//   /* position Amsterdam */
//   var latlng = new google.maps.LatLng(31.949497, 34.893386);

//   var mapOptions = {
//     center: latlng,
//     scrollWheel: false,
//     zoom: 13
//   };
  
//   var marker = new google.maps.Marker({
//     position: latlng,
//     url: '/',
//     animation: google.maps.Animation.DROP
//   });
  

//   var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
//   marker.setMap(map);

//   var src = 'https://maksico.com/police_map/kmls/2.kmz';
//   // var src = 'https://maksico.com/police_map/kmls/1.kmz';

//   var kmlLayer = new google.maps.KmlLayer(src, {
//             // suppressInfoWindows: true,
//             preserveViewport: true,
//             map: map
//           });

// };
// /* end google maps -----------------------------------------------------*/
// });