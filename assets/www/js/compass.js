
// Start watching the compass
function startCompassWatch() {
	// Update compass every 0,5 seconds
	var options = { frequency: 100 };
	$('#compassneedle').show();
	compasswatchID = navigator.compass.watchHeading(onSuccessCompass, onErrorCompass, options);
}

// Stop watching the compass
function stopCompassWatch() {
	if (compasswatchID) {
		navigator.compass.clearWatch(compasswatchID);
		compasswatchID = null;
		$('#compassneedle').css('-webkit-transform', 'rotate(0deg)');
		$('#compassneedle').hide();
		map.getView().setRotation(0);
	}
}

// onSuccess: Get the current heading
function onSuccessCompass(heading) {
	var degheading = Math.round(heading.magneticHeading);
	
	//Kompass Grad angabe in Infofenster
	//$('#compassinfo').html('Heading:' + degheading);
	
	//Nadel drehen
	var cordeg = parseInt(360 - degheading);
	var rotateDeg = 'rotate(' + (cordeg) + 'deg)';
	$('#compassneedle').css('-webkit-transform', rotateDeg);
	
	//Karte drehen
	if(rotateMap){		
		map.getView().setRotation(getRadians(cordeg));
	}
}

// onError: Failed to get the heading
function onErrorCompass(compassError) {
	alert('Compass error: ' + compassError.code);
}
