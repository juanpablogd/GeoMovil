/**
 * @author DGPJ 20130902
 */
var db = window.openDatabase("bdsigplus", "1.0", "Proyecto Sig Plus", 33554432);
var id;
var vertical;
var esquema;

function alerta(titulo,contenido,btn_nombre,link){
	localStorage.alert_titulo = titulo;
	localStorage.alert_contenido = contenido;
	localStorage.alert_btn_nombre = btn_nombre;
	localStorage.alert_href = link;
	window.location = "alert.html";
}

//CONTROL DE ERRORES
function errorCB(err) {
	console.log("Errores");
	// Esto se puede ir a un Log de Error dir�a el purista de la oficina, pero como este es un ejemplo pongo el MessageBox.Show :P
	if (err.code != undefined && err.message != undefined){
		if(err.code==5){
			alerta("GeoMovil","Debe cargar los datos correctamente en la Vertical de Negocio","Ok","#");
		}else{
			alerta("GeoMovil","Error procesando SQL: Codigo: " + err.code + " Mensaje: "+err.message,"Ok","#");
		}
	}else{
		console.log("No existe la base de datos");
		alerta("Geomovil","No existe información, por favor sincronice","ir","descargar.html");
/*		alert("No existe información, por favor sincronice");
		window.location = "descargar.html";		 */
	}
}

//CONSULTA LAS VERTICALES EN EL MOVIL
function ConsultaItems(tx) {
	console.log("Consulta Verticales");	
	tx.executeSql('select vertical,esquema from p_verticales order by vertical', [], ConsultaItemsCarga, errorCB);
}
// RESPUESTA DE LA CONSULTA LAS VERTICALES EN EL MOVIL
function ConsultaItemsCarga(tx, results) {
	var len = results.rows.length; console.log("Verticales Encontradas: ");	
	for (i = 0; i < len; i++){	
		
		tx.executeSql('select distinct al.id_categoria,ca.categoria,"'+results.rows.item(i).esquema+'" as esquema,"'+results.rows.item(i).vertical+'" as vertical,ca.foto_calidad,ca.foto_tamano from '+results.rows.item(i).esquema+'t_asignacion_lugar al inner join '+results.rows.item(i).esquema+'p_categorias ca on ca.id = al.id_categoria where al.id_encuestador = "'+localStorage.id_usr+'" order by categoria', [], ConsultaItemsCargaAsignResp,errorCB);
   	}
}



function ConsultaItemsCargaAsignResp(tx, resultsV) {
	var lon = resultsV.rows.length;								//alert(lon);
	if(lon==0){
		console.log("No encontrado");
		alerta("Geomovil","No tiene información asignada","Regresar","principal.html");
		
	}
	for (i = 0; i < lon; i++){
		var id_categoria = resultsV.rows.item(i).id_categoria;
		var categoria = resultsV.rows.item(i).categoria;
		var foto_calidad = resultsV.rows.item(i).foto_calidad;
		var foto_tamano = resultsV.rows.item(i).foto_tamano;
		$("#items").append('<li><a href="#" id ="'+id_categoria+'@'+resultsV.rows.item(i).esquema+'@'+foto_calidad+'@'+foto_tamano+'">'+resultsV.rows.item(i).vertical+'-'+categoria+'</a></li>');
   	}
   	$("#items").listview('refresh');
	//NO PUEDE IR ANTES  DEL REFRESH - Selecciona los elementos luego de ser cargados en tiempo de ejecucion    	
   	$("a[href*='#']").click(function() {
   		var str=$(this).attr("id");
		var n=str.split("@");
	    localStorage.id_categoria = n[0];
	    localStorage.esquema = n[1];					
	    localStorage.foto_calidad = n[2];
	    localStorage.foto_tamano = n[3];
	    
	    localStorage.feature="";
		localStorage.geometria="";
	    window.location = "mapa/mobile-jq.html";
	});
}

$(document).ready(function(){
	// CARGAR MENU DE LA BASE DE DATOS
	db.transaction(ConsultaItems); 
});