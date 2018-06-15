<!DOCTYPE html>
<html lang="en">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
</style>
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <title>2 column Google maps, foursquare (outer scroll)</title>
    <meta name="generator" content="Bootply"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script type="text/javascript" src="http://www.google.com/jsapi"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

    <!--[if lt IE 9]>
    <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>

    <![endif]-->
    <link href="css/styles.css" rel="stylesheet">
</head>
<body>
<!-- begin template -->
<div class="navbar navbar-custom navbar-fixed-top">
    <div class="navbar-header"><a class="navbar-brand" href="#">SafeRoadToday</a>
        <a class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </a>
    </div>
    <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav">
            <li class="active"><a href="#">Home</a></li>
            <li><a href="#">Accidents</a></li>
            <li><a href="#">Risk Today</a></li>
            <li><a href="#">Risk Tomorrow</a></li>
            <li>&nbsp;</li>
        </ul>
        <form class="navbar-form">
            <div class="form-group" style="display:inline;">
                <div class="input-group">
                    <div class="input-group-btn">
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span
                                    class="glyphicon glyphicon-chevron-down"></span></button>
                        <ul class="dropdown-menu">
                            <li><a href="#">Category 1</a></li>
                            <li><a href="#">Category 2</a></li>
                            <li><a href="#">Category 3</a></li>
                            <li><a href="#">Category 4</a></li>
                            <li><a href="#">Category 5</a></li>
                        </ul>
                    </div>
                    <input type="text" class="form-control" placeholder="Get me there safe">
                    <span class="input-group-addon"><span class="glyphicon glyphicon-search"></span> </span>
                </div>
            </div>
        </form>
    </div>
</div>

<div id="map-canvas"></div>
<div class="container-fluid" id="main">
    <div class="row">
        <div class="col-xs-3" id="left">
            <h2>Safe road today</h2>
            Demo version 2.0
            <br>
            <br>
            <a id="toggleMarkers" href="#" class="links">ToggleMarkers (By default hide) </a>
            <br>
            <a id="updateRoads" href="#" class="links">Update Roads</a>
            <input id="origin-input" class="controls" type="text"
                   placeholder="Enter an origin location">
            <input id="destination-input" class="controls" type="text"
                   placeholder="Enter a destination location">
            <input type="button" id="nodeGoto" />
            <div id="map-canvas"></div>
            <br>
            <br>
            <div class="panel panel-default">
                <div class="panel-heading" style="font-size: 20px">Type your origin location and destination and find
                    out what is the safest road today.
                </div>
            </div>
            <hr>
            <div class="panel panel-default">
                <div class="panel-heading" style="font-size: 15px">
                    <div class="vl-black">&ensp;Super High Risk</div>
                    <br>
                    <div class="vl-red">&ensp;Very High Risk</div>
                    <br>
                    <div class="vl-orange">&ensp;High Risk</div>
                    <br>
                    <div class="vl-yellow">&ensp;Medium - High Risk</div>
                    <br>
                    <div class="vl-darkblue">&ensp;Medium Risk</div>
                    <br>
                    <div class="vl-aqua">&ensp;Low Risk</div>
                    <br>
                    <div class="vl-grey">&ensp;Undefined risk</div>
                </div>
            </div>
            <p>
                <a href="http://bootply.com" target="_ext" class="center-block btn btn-primary">Set day and time</a>
                <br>
                <img src="biu_logo.jpg" width="240" style="padding-left: 20px;" align="center"/>

            </p\>
        </div>
        <div class="col-xs-9"><!--map-canvas will be postioned here--></div>
    </div>
</div>
<!-- end template -->
<!-- script references -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA0WDab4aGLy5FdxKQyE7Yy3mKQRZMjbEo&libraries=visualization&libraries=places&sensor=false&extension=.js&output=embed">
</script>
<script src="js/scripts.js"></script>
</body>
</html>