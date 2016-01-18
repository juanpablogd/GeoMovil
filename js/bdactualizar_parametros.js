var db = window.openDatabase("bdsigplus", "1.0", "Proyecto Sig Plus", 33554432);
var arr_tabla = new Array();
var arr_ListaTabla = new Array();

function alerta(titulo,contenido,btn_nombre,link){
	localStorage.alert_titulo = titulo;
	localStorage.alert_contenido = contenido;
	localStorage.alert_btn_nombre = btn_nombre;
	localStorage.alert_href = link;
	window.location = "alert.html";
}

function errorCB(err) {
	// Esto se puede ir a un Log de Error dir�a el purista de la oficina, pero como este es un ejemplo pongo el MessageBox.Show :P
	if (err.code != "undefined" && err.message != "undefined"){
    	alert("Error procesando SQL: Codigo: " + err.code + " Mensaje: "+err.message);
   	}
}

function successCB() {
    //alert("TRANSACION Ok!");
}

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}
var b64array = "ABCDEFGHIJKLMNOP" +
           "QRSTUVWXYZabcdef" +
           "ghijklmnopqrstuv" +
           "wxyz0123456789+/" +
           "=";

function encodePlain(input) {

    var base64 = "";
    var hex = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
    
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
    
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        base64  = base64  +
            b64array.charAt(enc1) +
            b64array.charAt(enc2) +
            b64array.charAt(enc3) +
            b64array.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);

	return base64;
}

function TablaGuardar(){
	db.transaction(TablaGuardarExe, errorCB);
	
}
function TablaGuardarExe(tx) {
	$.mobile.loading( 'show', { text: 'Almacenando Información....', textVisible: true, theme: 'a', html: "" });
	
	for(var fil = 0; fil < arr_ListaTabla.length; fil++) {																	//alert('Registro: '+fil+': '+arr_ListaTabla[fil]);				
		$.mobile.loading( 'show', { text: 'Creando '+arr_ListaTabla[fil][0], textVisible: true, theme: 'a', html: "" });	//alert('DROP TABLE IF EXISTS '+arr_ListaTabla[fil][0]+';');
		tx.executeSql('DROP TABLE IF EXISTS '+arr_ListaTabla[fil][0]);														//alert('CREATE TABLE IF NOT EXISTS '+arr_ListaTabla[fil][0]+' ('+arr_ListaTabla[fil][1]+')');
		tx.executeSql('CREATE TABLE IF NOT EXISTS '+arr_ListaTabla[fil][0]+' ('+arr_ListaTabla[fil][1]+')');				
	}																														//alert("Longitud: "+arr_tabla.length);
	
	$.mobile.loading( 'show', { text: 'Ingresando datos... ', textVisible: true, theme: 'a', html: "" });

	for(var fil = 0; fil < arr_tabla.length; fil++) { //arr_tabla.length					
		tx.executeSql('INSERT INTO '+arr_tabla[fil][0]+' ('+arr_tabla[fil][1]+') values ('+arr_tabla[fil][2]+');'); //alert('INSERT INTO '+arr_tabla[fil][0]+' ('+arr_tabla[fil][1]+') values ('+arr_tabla[fil][2]+');');
	}
	
	$.mobile.loading( 'hide' );
	alerta("Geomovil","Actualización exitosa","Ok","principal.html");
	
/*	alert("Actualización exitosa");
	window.location = "principal.html";  */
	
}




function TablaGuardar_cartografia(){
	db.transaction(TablaGuardarExe_cartografia, errorCB);
	
}
function TablaGuardarExe_cartografia(tx) {
	$.mobile.loading( 'show', { text: 'Almacenando Información....', textVisible: true, theme: 'a', html: "" });
	
	for(var fil = 0; fil < arr_ListaTabla.length; fil++) {																	//alert('Registro: '+fil+': '+arr_ListaTabla[fil]);				
		$.mobile.loading( 'show', { text: 'Creando '+arr_ListaTabla[fil][0], textVisible: true, theme: 'a', html: "" });	//alert('DROP TABLE IF EXISTS '+arr_ListaTabla[fil][0]+';');
		tx.executeSql('DROP TABLE IF EXISTS '+arr_ListaTabla[fil][0]);														//alert('CREATE TABLE IF NOT EXISTS '+arr_ListaTabla[fil][0]+' ('+arr_ListaTabla[fil][1]+' blob)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS '+arr_ListaTabla[fil][0]+' ('+arr_ListaTabla[fil][1]+')');				
	}																														//alert("Longitud: "+arr_tabla.length);
	
	$.mobile.loading( 'show', { text: 'Ingresando datos... ', textVisible: true, theme: 'a', html: "" });

	for(var fil = 0; fil < arr_tabla.length; fil++) { //arr_tabla.length					
		//alert ('INSERT INTO publict_cache_movil ('+arr_tabla[fil][1]+') values ('+arr_tabla[fil][2]+');');
		tx.executeSql('INSERT INTO publict_cache_movil ('+arr_tabla[fil][1]+') values ('+arr_tabla[fil][2]+');'); //alert('INSERT INTO '+arr_tabla[fil][0]+' ('+arr_tabla[fil][1]+') values ('+arr_tabla[fil][2]+');');
	}
	
	$.mobile.loading( 'hide' );
	alerta("Geomovil","Actualización exitosa","Ok","principal.html");
	
/*	alert("Actualización exitosa");
	window.location = "principal.html";  */
	
}
