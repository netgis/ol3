//Globals
var map;
var gpswatch;
var gpsmarker;
var startview = setnewView(739207,6404074,4);
var zoomres = 4.777314267823516;
var maxZoomlevel = 19;
var rotateMap = false;
var compasswatchID = null;

var layers = [
		new ol.layer.TileLayer({
		  source: new ol.source.MapQuestOSM(),
		  visible:true
		}),
		new ol.layer.TileLayer({
		  source: new ol.source.OSM(),
		  visible:false
		}),
		new ol.layer.TileLayer({
		  source: new ol.source.MapQuestOpenAerial(),
		  visible:false
		})
	  ];

// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

 // Cordova is ready
 function onDeviceReady() {   
 	navigator.splashscreen.show();	
 }

//Initialisieren
$(document).ready(function(){
	setmapsize();
	$('#compassneedle').hide();	
	map = new ol.Map({
	  controls: ol.control.defaults({}, [
		new ol.control.ScaleLine({
		  units: ol.control.ScaleLineUnits.IMPERIAL
		})
	  ]),
	  layers: layers,
	  renderers: ol.RendererHints.createFromQueryData(),
	  target: 'map',
	  view: startview 
	});
	
	//Resizen der Map
	$(window).resize(function() {
		setmapsize();
	});
		
	map.getView().setRotation(getRadians(0));
	//map.getView().setCenter(getTranspoint(8,51,4326,900913));
	
	//GPS Marker
	gpsmarker = new ol.Overlay({
	  map: map,
	  element: /** @type {Element} */ ($('<i/>').addClass('gpspoint').get(0))
	});
	
	//GPS Status ändern
	$("#gpsstatus").change(function(){
        var mystatus = this.value;
		if(mystatus === "on"){
			startgpsWatch();
		}
		else{
			stopgpsWatch();
		}
    });
	
	//Compass Status ändern
	$("#compassstatus").change(function(){
        var mystatus = this.value;
		if(mystatus === "on"){
			startCompassWatch();
			$('#compassmapstatusdiv').show();
		}
		else{
			stopCompassWatch();
			map.getView().setRotation(getRadians(0));
			$('#compassmapstatusdiv').hide();
		}
    });
	
	//Karte Rotieren
	$("#compassmapstatus").change(function(){
		var mystatus = this.value;
		if(mystatus === "on"){
			rotateMap = true;
		}
		else{
			rotateMap = false;
			map.getView().setRotation(getRadians(0));
		}
	});
	
	$('#compassmapstatusdiv').hide();
	
	//Change Layer quick and dirty
	$('input[name=bglayer]:radio').click(function(){
		jQuery.each(layers, function(index, value) {
			   this.setVisible(false);
		 });
		layers[$(this).val()].setVisible(true);
	});
	

});

//Aktuelle Mapparameter ausgeben (Hilfsfunktion)
function getMapinfo(){
	var msg = '<div id="infomessagebox">' +
	'Actual Resolution: ' + startview.getResolution() + "<br>" +
	//'Actual Zoom: ' + startview.zoom + "<br>" +
	'</div>';
	$('#infomessage').html(msg);
}

//Auf Punkt zoomen
function zoomPoint(point,zoomres){
//Ansicht wechseln mit Animation
 var duration = 1000;
  var start = +new Date();
  var pan = ol.animation.pan({
    duration: duration,
    source: startview.getCenter(),
    start: start
  });
  var bounce = ol.animation.bounce({
    duration: duration,
    resolution: 4 * startview.getResolution(),
    start: start
  });
  //Flightmodus
  //map.addPreRenderFunctions([pan, bounce]);
  //Panmodus
  //map.addPreRenderFunction(pan);
  //Falls aktuelle Zoomresolution kleiner als übergebene
  if(startview.getResolution() < zoomres){
	  zoomres = startview.getResolution();
  }
  startview.setResolution(zoomres);
  startview.setCenter(point);  
}

//Radians ermitteln
function getRadians(d){
	var radians = d * (Math.PI / 180);
	return radians;
}

//Punkt ermitteln
function getTranspoint(x,y,i,o){
 var mypoint = ol.projection.transform(
    [x, y], 'EPSG:'+i, 'EPSG:'+o);
	return mypoint;
}

//neuen View erzeugen
function setnewView(x,y,z){
var myview = new ol.View2D({
      center: [x, y],
      zoom: z,
	  maxZoom: maxZoomlevel
    })
	return myview;
}

//GPS Start Watch Funktion
var startgpsWatch = function(){
	if(navigator.geolocation){
		$('#gpsmessage').html('<div id="gpsmessagebox">start watching...</div>');
		gpswatch = navigator.geolocation.watchPosition(gpsokCallback, gpsfailCallback, gpsOptions);
	}
}

//GPS Stop Watch  Funktion
var stopgpsWatch = function(){
	navigator.geolocation.clearWatch(gpswatch);
	$('.gpspoint').hide();
	$('#gpsmessage').html("");
}

//GPS Erfolgs Callback
var gpsokCallback = function(position){
	var msg = '<div id="gpsmessagebox">' +
	'Lat: ' + position.coords.latitude + "<br>" +
	'Lon: ' + position.coords.longitude + "<br>" +
	'Accuracy: ' + Math.round(position.coords.accuracy) + " m<br>" +
	//'Höhe: ' + Math.round(position.coords.altitude) + " m NN<br>" +	
	//'Präzision Höhenmessung: ' + Math.round(position.coords.altitudeAccuracy) + "<br>" +
	//'Richtung: ' + Math.round(position.coords.heading) + "<br>" +
	//'Geschwindigkeit: ' + Math.round(position.coords.speed) + 
	'<a href="#" id="setGpspoint" data-role="button" data-icon="arrow-r" data-iconpos="right" data-inline="true"  data-mini="true" >Zoom to position</a></div>';
	$('#gpsmessage').html(msg);
	var gpscoord = getTranspoint(position.coords.longitude,position.coords.latitude,4326,900913);
	gpsmarker.setPosition(gpscoord);
	$('.gpspoint').show();
	$("#setGpspoint").bind( "click", function(event, ui) {
		zoomPoint(gpscoord,zoomres);
	});
	$("#setGpspoint").button();
};

//GPS Fehler Callback
var gpsfailCallback = function(e){
	var msg = 'Fehler ' + e.code + ': ' + e.message;
	//console.log(msg);
};

//GPS Optionen
var gpsOptions = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
};

//Mapsize auf vollen Contentbereich skalieren.
function setmapsize(){
	window.scrollTo(0,0);
	var winhigh = $.mobile.getScreenHeight(); //Get available screen height, not including any browser chrome
	var headhigh = $('[data-role="header"]').first().outerHeight(); //Get height of first page's header
	var foothigh = $('[data-role="footer"]').first().outerHeight(); //Get height of first page's header
	var $content=$('[data-role="content"]');
	var contentpaddingheight=parseInt($content.css("padding-top").replace("px", ""))+parseInt($('[data-role="content"]').css("padding-bottom").replace("px", ""));
	winhigh = winhigh - headhigh - foothigh - contentpaddingheight; 
	$("#map").css('height',winhigh + 'px'); //Change div to maximum visible area
}