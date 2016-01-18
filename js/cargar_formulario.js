/**
 * @author SKAPHE 20130902
 */
var db = window.openDatabase("bdsigplus", "1.0", "Proyecto Sig Plus", 33554432);
var id;
var vertical;
var esquema;
var NoVerticales;

//FUNCION ALERTA
function alerta(titulo,contenido,btn_nombre,link){
	localStorage.alert_titulo = titulo;
	localStorage.alert_contenido = contenido;
	localStorage.alert_btn_nombre = btn_nombre;
	localStorage.alert_href = link;
	window.location = "alert.html";
}

//CONTROL DE ERRORES
function errorCB(err) {
	// Esto se puede ir a un Log de Error dir�a el purista de la oficina, pero como este es un ejemplo pongo el MessageBox.Show :P
	if (err.code != undefined && err.message != undefined){
		if(err.code==5){
			alerta("GeoMovil","Debe cargar los datos correctamente en la Vertical de Negocio","Ok","#");
		}else{
			alerta("GeoMovil","Error procesando SQL: Codigo: " + err.code + " Mensaje: "+err.message,"Ok","#");
		}
	}
}

//CONSULTA LAS VERTICALES EN EL MOVIL
function ConsultaItems(tx) {	
	tx.executeSql('select vertical,esquema from p_verticales order by vertical', [], ConsultaItemsCarga);
}
// RESPUESTA DE LA CONSULTA LAS VERTICALES EN EL MOVIL
function ConsultaItemsCarga(tx, results) {
	var len = results.rows.length;	
	NoVerticales= results.rows.length;
	for (i = 0; i < len; i++){
		  console.log('select distinct id,categoria,"'+results.rows.item(i).esquema+'" as esquema,"'+results.rows.item(i).vertical+'" as vertical,foto_calidad,foto_tamano,id_item_foto,geolocaliza_obligatorio,foto_obligatorio,video_obligatorio,geometria_obligatorio from '+results.rows.item(i).esquema+'p_categorias order by categoria');
		tx.executeSql('select distinct id,categoria,"'+results.rows.item(i).esquema+'" as esquema,"'+results.rows.item(i).vertical+'" as vertical,foto_calidad,foto_tamano,id_item_foto,geolocaliza_obligatorio,foto_obligatorio,video_obligatorio,geometria_obligatorio from '+results.rows.item(i).esquema+'p_categorias order by categoria', [], ConsultaItemsCargaAsignResp,errorCB);
		
   	}
}

function ConsultaItemsCargaAsignResp(tx, resultsV) {
var lon = resultsV.rows.length;								console.log("Total de Formularios: "+lon);
	for (i = 0; i < lon; i++){
		var id_categoria = resultsV.rows.item(i).id;
		var categoria = resultsV.rows.item(i).categoria;
		var foto_calidad = resultsV.rows.item(i).foto_calidad;
		var foto_tamano = resultsV.rows.item(i).foto_tamano;
		var id_item_foto = resultsV.rows.item(i).id_item_foto;
		var geolocaliza_obligatorio = resultsV.rows.item(i).geolocaliza_obligatorio;
		var foto_obligatorio = resultsV.rows.item(i).foto_obligatorio;
		var video_obligatorio = resultsV.rows.item(i).video_obligatorio;
		var geometria_obligatorio = resultsV.rows.item(i).geometria_obligatorio;
		var strID = id_categoria+'@'+resultsV.rows.item(i).esquema+'@'+foto_calidad+'@'+foto_tamano+'@'+id_item_foto+'@'+geolocaliza_obligatorio+'@'+foto_obligatorio+'@'+video_obligatorio+'@'+geometria_obligatorio;
		$("#items").append('<li><a href="#" id ="'+strID+'">'+resultsV.rows.item(i).vertical+'-'+categoria+'</a></li>');
		//alert(NoVerticales);
		if(NoVerticales==1 && lon==1) CargaFormulario(strID);
   	}
   	$("#items").listview('refresh');
	//NO PUEDE IR ANTES  DEL REFRESH - Selecciona los elementos luego de ser cargados en tiempo de ejecucion    	
   	$("a[href*='#']").click(function() {
   		var str=$(this).attr("id");
		CargaFormulario(str);
	});
}

function CargaFormulario(str) {
		var n=str.split("@");
	    localStorage.id_categoria = n[0];		//alert(localStorage.id_categoria);
	    localStorage.esquema = n[1];
	    localStorage.foto_calidad = n[2];
	    localStorage.foto_tamano = n[3];
	    localStorage.id_item_foto = n[4];
	    localStorage.geolocaliza_obligatorio = n[5];
	    localStorage.foto_obligatorio = n[6];
	    localStorage.video_obligatorio = n[7];
	    localStorage.geometria_obligatorio = n[8];
	    
		localStorage.asignado = "f"; 		//False (No asignado)
		localStorage.feature="";
		localStorage.geometria=""; 
	    window.location = "formulario.html";
}

$(document).ready(function(){
	// CARGAR MENU DE LA BASE DE DATOS
	db.transaction(ConsultaItems); 
});