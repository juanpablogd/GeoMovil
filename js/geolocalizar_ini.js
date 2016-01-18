var myLatitud;
var myLongitud;
var myPrecision;
var watchID = null;
var options = { timeout: 20000, enableHighAccuracy: true };

var success = function(pos) {
	 myLatitud = pos.coords.latitude;
	 myLongitud = pos.coords.longitude;
	 myPrecision = pos.coords.accuracy;		 	//text = "<div>Latitude: " + myLatitud + "<br/>" + "Longitude: " + myLongitud + "<br/>" + "Accuracy: " + myPrecision + " m<br/>" + "</div>";
	 text = "<div>Latitud: " + myLatitud + "<br/>" + "Longitud: " + myLongitud + "<br/>" + "Precisi&oacute;n: " + myPrecision + " m <br/>Fecha: "+ new Date(pos.timestamp)+" <br/>" + "</div>";
	 document.getElementById('cur_position').innerHTML = text;
	 document.getElementById('search_cur_position').innerHTML = "Actualizado!";
};

var failw = function(error) {
    document.getElementById('search_cur_position').innerHTML = "Esperando...";
	watchID = navigator.geolocation.getCurrentPosition(success);
};

var getCurrentPosition = function() {
    document.getElementById('search_cur_position').innerHTML = "Ubicando...";
	watchID = navigator.geolocation.watchPosition(success, failw, options);
};

if (localStorage.geolocaliza_obligatorio != "N" && localStorage.geolocaliza_obligatorio != "0") {
	getCurrentPosition();
	console.log("Geolocaliza cada N tiempo");
	setInterval(function(){ getCurrentPosition(); },1000*60);
}	