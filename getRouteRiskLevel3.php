<?php
//system("echo ".$_POST['route']." > test.txt");
//$input = $_POST['route'];
//$jsonObject = json_decode($input, true);
//print_r($retval);
exec('cd ./BackEnd && java -jar ./dist/RiscsProject.jar get_risk_level ./roads_risk_levels.txt \'' .$input .'\'',$retval);

//exec('cd ./BackEnd && java -jar ./dist/RiscsProject.jar get_risk_level ./roads_risk_levels.txt \'{"result":[{"startLat":31.9681049,"startLng":34.78790090000007,"endLat":31.964783,"endLng":34.78553510000006,"distance":435,"index":5,"risk":0,"route":44},{"startLat":31.9607934,"startLng":34.785302799999954,"endLat":31.9585797,"endLng":34.785413999999946,"distance":248,"index":7,"risk":0,"route":44}]}\'',$retval);
//exec('ls', $retval);
//cd Sites/SafeRoadToday/BackEnd && java -jar ./dist/RiscsProject.jar get_risk_level ./roads_risk_levels.txt '{"result":[{"startLat":31.9681049,"startLng":34.78790090000007,"endLat":31.964783,"endLng":34.78553510000006,"distance":435,"index":5,"risk":0,"route":44},{"startLat":31.9607934,"startLng":34.785302799999954,"endLat":31.9585797,"endLng":34.785413999999946,"distance":248,"index":7,"risk":0,"route":44}]}'


//echo "<script>console.log($retval);</script>";
#print_r (explode(", ",$retval));
print_r($retval);

?>
