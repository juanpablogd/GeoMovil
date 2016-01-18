/**
 * @author DGPJ 20130904
 */
var db = window.openDatabase("bdsigplus", "1.0", "Proyecto Sig Plus", 33554432);

var id_categoria = localStorage.id_categoria;
var esquema = localStorage.esquema;
var num_col;

function ConsultaTablaCargaAsign(tx) {	
	tx.executeSql('select distinct geotabla FROM '+esquema+'t_asignacion_lugar where id_categoria = "'+id_categoria+'" order by fecha_asignacion asc', [], ConsultaTablaCargaAsignResp);
}
function ConsultaTablaCargaAsignResp(tx, resultsT) {
	var lon = resultsT.rows.length;						//alert(lon);
	for (i = 0; i < lon; i++){							
		tx.executeSql('select al.id as mid,geotabla as gt,g.* from '+esquema+'t_asignacion_lugar al inner join '+esquema+resultsT.rows.item(i).geotabla+' g on g.id = al.id_feature where al.estado = "A" and id_categoria = "'+id_categoria+'" and geotabla = "'+resultsT.rows.item(i).geotabla+'" and id_encuestador = "'+localStorage.id_usr+'" order by al.id_feature + 0', [], ConsultaItemsCargaAsignResp);
   	}
}

function ConsultaItemsCargaAsignResp(tx, resultsV) {
	var lonV = resultsV.rows.length;	//alert(lonV);
	for (v = 0; v < lonV; v++){
		var row = resultsV.rows.item(v);
		var string;
		num_col = 0;
		for (name in row)
		{
			if (num_col>1 && num_col<5){
				if (typeof row[name] !== 'function')
				{
					if(num_col==2){
						string = row[name] + " | ";	
					}else
					{
						string = string + row[name] + " | ";
					}
				}
			}
			num_col++;
		}
		var id_asignado = resultsV.rows.item(v).mid;			//Id Asignación
		var id_feature = resultsV.rows.item(v).id;				//Id Feature
		var geotabla = resultsV.rows.item(v).gt;				//Id Feature
		$("#items").append('<li><a href="#" id ="'+id_asignado+'@'+id_feature+'@'+geotabla+'">'+string+'</a></li>');
   	}
   	
   	//REFRESCA LA LISTA PARA CORREGIR EL ESTILO
   	$("#items").listview('refresh');
	//NO PUEDE IR ANTES  DEL REFRESH - Selecciona los elementos luego de ser cargados en tiempo de ejecucion    	
   	$("a[href*='#']").click(function() {	//alert($(this).text());
		var str=$(this).attr("id");
		var n=str.split("@");
		localStorage.asignado = "t";		//Si el registro fué asignado desde el sistema administrador!
	    localStorage.id_asignado = n[0];
	    localStorage.id_feature = n[1];
	    localStorage.geotabla = n[2];
	    window.open("formulario.html","_parent");
	});
}

$(document).ready(function(){
	// CARGAR MENU DE LA BASE DE DATOS
	db.transaction(ConsultaTablaCargaAsign); 
});