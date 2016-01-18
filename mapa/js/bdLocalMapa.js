/**
 * @author DGPJ 20130904
 */
var db = window.openDatabase("bdsigplus", "1.0", "Proyecto Sig Plus", 200000);

var id_categoria = localStorage.id_categoria;
var esquema = localStorage.esquema;
var geotabla;
var num_col;

//CONTROL DE ERRORES
function errorCB(err) {
	// Esto se puede ir a un Log de Error dir�a el purista de la oficina, pero como este es un ejemplo pongo el MessageBox.Show :P
	if (err.code != undefined && err.message != undefined){
		alert("Error procesando SQL: Codigo: " + err.code + " Mensaje: "+err.message);
	}
}


function ConsultaTablaCargaAsign(tx) {	
	tx.executeSql('select distinct geotabla FROM '+esquema+'t_asignacion_lugar where id_categoria = "'+id_categoria+'" order by fecha_asignacion asc', [], ConsultaTablaCargaAsignResp);
}
function ConsultaTablaCargaAsignResp(tx, resultsT) {
	var lon = resultsT.rows.length;						//alert(lon);
	for (i = 0; i < lon; i++){							//geotabla = resultsT.rows.item(i).geotabla;
		tx.executeSql('select al.id as mid,geotabla as gt,g.* from '+esquema+'t_asignacion_lugar al inner join '+esquema+resultsT.rows.item(i).geotabla+' g on g.id = al.id_feature where id_categoria = "'+id_categoria+'" and geotabla = "'+resultsT.rows.item(i).geotabla+'" and id_encuestador = "'+localStorage.id_usr+'" order by al.id_feature', [], ConsultaItemsCargaAsignResp);
   	}
}

function ConsultaItemsCargaAsignResp(tx, resultsV) {
	var lonV = resultsV.rows.length;	//alert(lonV);
	
	var geojson_format = new OpenLayers.Format.GeoJSON();
	/*var mLayers = map.layers;
	for(var a = 0; a < mLayers.length; a++ ){
	    alert(mLayers[a].name);
	};*/
	var vector_edit=map.getLayersByName("ins_geojson")[0];
	
	var feature;
	//console.log(vector_edit);
	for (v = 0; v < lonV; v++){
		var row = resultsV.rows.item(v);
		//console.log(row);
		var string;
		num_col = 0;
		for (name in row){
			if (num_col<3){
				if (typeof row[name] !== 'function')
				{
					if(num_col==0){
						string = row[name] + " | ";	
					}else
					{
						string = string + row[name] + " | ";
					}
					
				}
				num_col++;
			}
		}
		var id = resultsV.rows.item(v).id;
		/*feature_conect[contador] = new OpenLayers.Feature.Vector(geojson_format.read(values[2],"Geometry"), null, styleline);
		vector_conect.addFeatures(feature_conect[contador]);*/
							
		//COLOCA LAS COMILLAS AL GEOJSON
		var geometria=resultsV.rows.item(v).g.replace(/&quot;/g,'"');
		
		//LEE EL JSON
		feature=new OpenLayers.Feature.Vector(geojson_format.read(geometria,"Geometry"),row);
		
		vector_edit.addFeatures(feature);
   	}
   //REALZA EL ZOOM EXTEND EN AL CAPA A VISITAR
   	map.zoomToExtent(vector_edit.getDataExtent());
   
}

 
