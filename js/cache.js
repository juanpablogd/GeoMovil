
var zoom;

function ConsultaItems(tx) {
	tx.executeSql('select zoom_level,tile_column,tile_row,hex(tile_data) as tile_data from publict_cache_movil ', [], ConsultaItemsCarga,errorCB);
}
function ConsultaItemsCarga(tx, results) {
	var len = results.rows.length;	//alert('Longitud:  '+len);
	for (i = 0; i < len; i++){

		var b = results.rows.item(i).tile_data; //console.log(b);
		
		var hex_pla = hex2a(b);
		
		console.log('ok: '+ encodePlain(hex_pla));

   	}

}
//function img_cache(){
db.transaction(ConsultaItems);	
//}
