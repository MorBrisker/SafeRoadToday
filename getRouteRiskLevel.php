<?php
system("echo ".$_POST['route']." > test.txt");
$input = $_POST['route'];
//echo $input;
$jsonObject = json_decode($input, true);
//echo "EEEEEENNNNNNNDDDDDD";
#echo implode(" ",$jsonObject);
//echo "EEEEEENNNNNNNDDDDDD";
//echo implode(" ",$jsonObject['result']);
//echo "EEEEEENNNNNNNDDDDDD";
//$obj = json_decode($input);
//echo json_decode($jsonObject->result);

//$data = json_decode($jsonstring, true);
//$hashtags = $data['input'][0]['entities']['hashtags']; // this will be an array


//echo $input;


#var_dump(json_decode($input, true)['result'][0]['startLat']);

//print_r(json_decode($input)['result'][0]);

#echo $jsonObject->result;
#echo $input;y/BackEnd/PoliceGui.jar get_risk_level roads_risk_levels.txt "."'".$_POST["route"]."'");

// system("java -jar /var/www/SafeRoadToda
//exec('cd /var/www/SafeRoadToday/BackEnd/ && java -jar ./dist/PoliceGui.jar get_risk_level ./roads_risk_levels.txt \'{"result":[{"startLat":31.9365147,"startLng":38.92852270000003,"endLat":31.7969893,"endLng":35.15391669999997,"distance":30967,"index":2,"route":471},{"startLat":31.7864052,"startLng":35.206978299999946,"endLat":31.77627,"endLng":35.20906400000001,"distance":1156,"index":5,"route":1}]}\'',$retval);
//echo $input;

exec('cd /var/www/SafeRoadToday/BackEnd/ && java -jar ./dist/RiscsProject.jar get_risk_level ./roads_risk_levels.txt \'' .$input .'\'',$retval);

//echo "<script>console.log($retval);</script>";
#print_r (explode(", ",$retval));
print_r($retval[0]);

?>

