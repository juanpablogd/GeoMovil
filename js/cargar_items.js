/**
 * @author SKAPHE 20130902
 * @Modifi SKAPHE 20130917
 * @Modifi SKAPHE 20160118
 */
/*VARIABLES GLOBALES*/
var db = window.openDatabase("bdsigplus", "1.0", "Proyecto Sig Plus", 33554432);
var esquema = localStorage.esquema;				//Esquema
var id_categoria = localStorage.id_categoria;	//Id Categoria
var id_usr = localStorage.id_usr;				//Id Usuario
var asignado = localStorage.asignado;			//Asignado = t Nuevo = f
var id_asignacion = localStorage.id_asignado;	//SI Asignado = t. Entonces retorna el Id de Asignación
var geotabla = localStorage.geotabla;			//SI Asignado = t. Nombre de la tabla Geometrica
var id_feature = localStorage.id_feature;		//SI Asignado = t. Id de la tabla geometrica
var i_foto=0;
localStorage.id_unico ="";

/*VARIABLES LOCALES*/
var id_item_last;

function alerta(titulo,contenido,btn_nombre,link){
	localStorage.alert_titulo = titulo;
	localStorage.alert_contenido = contenido;
	localStorage.alert_btn_nombre = btn_nombre;
	localStorage.alert_href = link;
	window.location = "alert.html";
}

function SeleccionItemsOcultar(tx) {	//console.log('select iadd.id_rta,iadd.id_item from '+esquema+'p_items_adicional iadd inner join '+esquema+'p_rtas_seleccion rtas on iadd.id_rta = rtas.id inner join '+esquema+'p_items_formulario item on item.id_item = rtas.id_item where id_categoria = "'+localStorage.id_categoria+'" and item.id_item = "'+localStorage.tmp_id_item+'" order by iadd.id_item desc');
	tx.executeSql('select iadd.id_rta,iadd.id_item from '+esquema+'p_items_adicional iadd inner join '+esquema+'p_rtas_seleccion rtas on iadd.id_rta = rtas.id inner join '+esquema+'p_items_formulario item on item.id_item = rtas.id_item where id_categoria = "'+localStorage.id_categoria+'" and item.id_item = "'+localStorage.tmp_id_item+'" order by iadd.id_item desc', [], SeleccionItemsOcultarResult,errorCB);
}
function SeleccionItemsOcultarResult(tx, results) {
	var len = results.rows.length;	//alert(len);
	for (i = 0; i < len; i++){
		var id_item = results.rows.item(i).id_item;
		var id_rta = results.rows.item(i).id_rta; console.log(localStorage.id_rta + " Loop: " + id_rta);
		if(localStorage.tmp_id_rta == id_rta){
			console.log("Mostrar elemento: "+id_item);
			$("#l"+id_item+"").show();
			$("#"+id_item+"").show();
			$("#f"+id_item+"").show();
			$("#"+id_item+"").prop('required',true);
			$("#"+id_item+"").attr('visible','true');
			$("#f"+id_item+"").addClass('required');
		}else{
			console.log("Ocultar elemento: "+id_item);
			$("#"+id_item+"").removeAttr('required');
			$("#"+id_item+"").attr('visible','false');
			$("#f"+id_item+"").removeClass('required');
			$("#l"+id_item+"").hide();
			$("#"+id_item+"").hide();
			$("#f"+id_item+"").hide();			
		}
			

   	}
   
}

function getval(sel) {
	console.log("Id: "+sel.id);
	var res = sel.value.split("@");
	// VALOR FINAL A GUARDAR
	var tmp_id_rta = res[1];
	// VALOR FINAL A GUARDAR
	var tmp_id_item = res[2];
	//Variable Global como localStorage
	localStorage.tmp_id_item = sel.id;
	localStorage.tmp_id_rta = tmp_id_rta;
	console.log("ORIGEN Id rta: " + localStorage.tmp_id_item + " - " + localStorage.tmp_id_rta);
	
	// CARGAR ITEMS DE LA BASE DE DATOS
	db.transaction(SeleccionItemsOcultar);
}
    
/****************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************/
function errorCB(err) {
	// Esto se puede ir a un Log de Error dir�a el purista de la oficina, pero como este es un ejemplo pongo el MessageBox.Show :P
	if (err.code !== undefined && err.message !== undefined){
    	alerta("GeoMovil","Error procesando SQL: Codigo: " + err.code + " Mensaje: "+err.message,"Ok","#");
   	}
}

function validar_campos(){
	var valido = true;
	
	//SELECCIONA LOS ELEMENTOS DEL FORMULARIO
	 $(':input').each(function () {
			var $this = $(this),required = $this.attr('required');
			var cant_val = $(this).val();
			console.log("required: " + required + " Val: " + cant_val);
			if(required=="required" && cant_val == ""){
				valido  = false;
				$(this).focus();
				return false;
			}
	 });
		 
	return valido;
}
/****************************************************************************************************************************************************************/
/**OCULTAR ITEMS POR DEFECTO******OCULTAR ITEMS POR DEFECTO******OCULTAR ITEMS POR DEFECTO******OCULTAR ITEMS POR DEFECTO******OCULTAR ITEMS POR DEFECTO******OCULTAR ITEMS POR DEFECTO*****/ 
function OcultarItems(tx) { console.log('SELECT iadd.id_item FROM '+esquema+'p_items_formulario itemfor inner join '+esquema+'p_items_adicional iadd on itemfor.id_item = iadd.id_item where id_categoria = "'+id_categoria+'" order by iadd.id_item desc');
	
	tx.executeSql('SELECT iadd.id_item FROM '+esquema+'p_items_formulario itemfor inner join '+esquema+'p_items_adicional iadd on itemfor.id_item = iadd.id_item where id_categoria = "'+id_categoria+'" order by iadd.id_item desc', [], OcultartemsResult,errorCB);
}
function OcultartemsResult(tx, results) {
	var len = results.rows.length;	//alert(len);
	for (i = 0; i < len; i++){
		var id_item = results.rows.item(i).id_item;
		console.log("Ocultar: " + id_item);
		$("#l"+id_item+"").hide();
		$("#"+id_item+"").removeAttr('required');
		$("#"+id_item+"").attr('visible','false');
		$("#f"+id_item+"").removeClass("required");
		$("#f"+id_item+"").hide();
		$("#"+id_item+"").hide();
   	}
   	$("#items").trigger("create");

}
/***FIN OCULTAR ITEMS*************************************************************************************************************************************************************/

/****************************************************************************************************************************************************************/
/**CARGAR ITEMS****CARGAR ITEMS****CARGAR ITEMS****CARGAR ITEMS****CARGAR ITEMS****CARGAR ITEMS****CARGAR ITEMS****CARGAR ITEMS****CARGAR ITEMS****CARGAR ITEMS**/ 
function ConsultaItems(tx) {
	  console.log('select it.id_item, it.descripcion_item, it.tipo_rta, it.obligatorio,rt.descripcion,rt.valor,rt.id id_add from '+esquema+'p_items_formulario it left join '+esquema+'p_rtas_seleccion rt on it.id_item = rt.id_item where id_categoria="'+id_categoria+'" order by cast(orden as integer)');	
	tx.executeSql('select it.id_item, it.descripcion_item, it.tipo_rta, it.obligatorio,rt.descripcion,rt.valor,rt.id id_add from '+esquema+'p_items_formulario it left join '+esquema+'p_rtas_seleccion rt on it.id_item = rt.id_item where id_categoria="'+id_categoria+'" order by cast(orden as integer)', [], ConsultaItemsCarga,errorCB);
}
function ConsultaItemsCarga(tx, results) {
	var len = results.rows.length;	//alert(len);
	for (i = 0; i < len; i++){
		var rta = results.rows.item(i).tipo_rta;
		var id_item = results.rows.item(i).id_item;	//console.log(localStorage.id_item_foto); console.log(id_item);
		if(localStorage.id_item_foto != id_item){ //SI NO ES LA PREGUNTA DE LA FOTO
			var descripcion_item = results.rows.item(i).descripcion_item;
			var obligatorio = "";		console.log(results.rows.item(i).obligatorio);
			if(results.rows.item(i).obligatorio == "S") {obligatorio = "required";}
			
			if (rta == "TEXTO" && id_item_last != id_item){
				$("#items").append('<div data-role="fieldcontain" id="f'+id_item+'"><label name="l'+id_item+'" id="l'+id_item+'" for="'+id_item+'">'+descripcion_item+'</label><input type="text" name="'+id_item+'" id="'+id_item+'" placeholder="'+descripcion_item+'" value="" data-mini="true" maxlength="255" '+obligatorio+' visible="true"/></div>');
			}else if (rta == "PARRAFO" && id_item_last != id_item) {
				$("#items").append('<div data-role="fieldcontain" id="f'+id_item+'"><label name="l'+id_item+'" id="l'+id_item+'" for="'+id_item+'">'+descripcion_item+'</label><textarea class="form-control" cols="40" rows="8"  name="'+id_item+'" id="'+id_item+'" value="" '+obligatorio+' visible="true"/></textarea></div>');	/* $('#'+id_item).textinput(); */				
			}else if (rta == "CANTIDAD" && id_item_last != id_item) {
				$("#items").append('<div data-role="fieldcontain" id="f'+id_item+'"><label name="l'+id_item+'" id="l'+id_item+'" for="'+id_item+'">'+descripcion_item+'</label><input type="number" name="'+id_item+'" id="'+id_item+'" placeholder="'+descripcion_item+'" value="" data-mini="true" '+obligatorio+' onkeypress="if (event.keyCode< 48 || event.keyCode > 57) event.returnValue = false;" visible="true"/></div>');	/* $('#'+id_item).textinput(); */
			}else if (rta == "FECHA" && id_item_last != id_item) {
				$("#items").append('<div data-role="fieldcontain" id="f'+id_item+'"><label for="'+id_item+'" name="l'+id_item+'" id="l'+id_item+'" class="control-label" >'+descripcion_item+'</label><input type="date" tipo="fecha" name="'+id_item+'" id="'+id_item+'" value="" '+obligatorio+' onkeypress="if (event.keyCode< 47 || event.keyCode > 57) event.returnValue = false;" visible="true"/></div>');
			}else if (rta == "SELECCION") {
				if(id_item_last != id_item){
					$("#items").append('<div data-role="fieldcontain" id="f'+id_item+'">'+
											'<label name="l'+id_item+'" id="l'+id_item+'" for="'+id_item+'" class="select">'+descripcion_item+'</label>'+
												'<select name="'+id_item+'" id="'+id_item+'" data-mini="true" '+obligatorio+' onchange="getval(this);" visible="true">'+
													'<option value="">---Seleccione---</option>'+
												'</select>'+
										'</div>');	
				}
				if(results.rows.item(i).valor != null) { $('#'+id_item).append('<option value="'+results.rows.item(i).valor+'@'+results.rows.item(i).id_add+'">'+results.rows.item(i).descripcion+'</option>'); }	
			}else if (rta == "LISTA") {
				if(id_item_last != id_item){
					$("#items").append('<div data-role="fieldcontain" id="f'+id_item+'" class="form-group '+obligatorio+'"><label name="l'+id_item+'" id="l'+id_item+'" class="select control-label"" >'+descripcion_item+'</label></div>');
				}
				if(results.rows.item(i).valor != null) { $('#f'+id_item).append('<input type="checkbox" name="'+id_item+'" id="'+id_item+'" value="'+results.rows.item(i).valor+'" visible="true"> '+results.rows.item(i).descripcion+'<br>'); }	
			}
			//console.log("Ttal Registros: " +len + " Consecutivo: " + i + " id_item_last: " + id_item_last + " id_item: " + id_item);
			if((i+1)==len){		//DESPUES DE CARGAR TODOS LOS REGISTROS
				// OCULTAR ITEMS
				db.transaction(OcultarItems);
			}
	
				id_item_last = id_item;		//console.log(id_item);
			}
   	}
   	/*Adiciona al formulario Botón de cancelar y Guardar*/
   	$("#items").append('<a id="Salir" href="formulario_dialog.html" data-rel="dialog" data-mini="true" data-role="button" data-transition="flip" data-icon="delete">Cancelar</a>');
   	$("#items").append('<button id="btn_save" data-theme="b" data-mini="false" data-icon="check">Guardar</button>');
   	
   	/* ADICIONA LA FUNCIÓN PARA VALIDAR LOS CAMPOS*/
   	$("#btn_save").click(function () {
   		var valido = validar_campos();
   		//alert(valido);
		valido = $.trim(valido);
   		//alert(valido);
		if(valido=="true"){
			//alert("GuardarItems");
			db.transaction(GuardarItems);
		}
	    return false;
   	});
   	
	/*Refresca estilo para cada uno de los controles*/
    $("#items").trigger("create");
}
/****************************************************************************************************************************************************************/
/*********************************************************************************************************************************************************************/
/**CARGAR ITEM FOTO****CARGAR ITEM FOTO****CARGAR ITEM FOTO****CARGAR ITEM FOTO****CARGAR ITEM FOTO****CARGAR ITEM FOTO****CARGAR ITITEM FOTOEMS****CARGAR ITEM FOTO**/ 
function ConsultaItem_foto(tx) {
		console.log('select it.id_item, it.descripcion_item, it.tipo_rta, it.obligatorio,rt.descripcion,rt.valor from '+esquema+'p_items_formulario it left join '+esquema+'p_rtas_seleccion rt on it.id_item = rt.id_item where rt.id_item="'+localStorage.id_item_foto+'" order by orden');	
	tx.executeSql('select it.id_item, it.descripcion_item, it.tipo_rta, it.obligatorio,rt.descripcion,rt.valor from '+esquema+'p_items_formulario it left join '+esquema+'p_rtas_seleccion rt on it.id_item = rt.id_item where rt.id_item="'+localStorage.id_item_foto+'" order by orden', [], ConsultaItemCarga_foto,errorCB);
}
function ConsultaItemCarga_foto(tx, results) {
	var len = results.rows.length;	//alert(len);
	for (i = 0; i < len; i++){
		var rta = results.rows.item(i).tipo_rta;
		var id_item = results.rows.item(i).id_item;
		var descripcion_item = results.rows.item(i).descripcion_item;
		var obligatorio = "";
		var i_foto_tmp = i_foto-1;
		if(results.rows.item(i).obligatorio == "S") {obligatorio = "required";}		console.log("campofoto_"+i_foto_tmp);

		if (rta == "TEXTO"){
			$('#campofoto_'+i_foto_tmp).append('<div data-role="fieldcontain"><label for="frow'+i_foto_tmp+'">'+descripcion_item+'</label><input type="text" name="'+id_item+'" id="frow'+i_foto_tmp+'" value="" data-mini="true" maxlength="255" '+obligatorio+'/></div>');	/* $('#'+id_item).textinput(); */
		}else if (rta == "PARRAFO" ) {
			$('#campofoto_'+i_foto_tmp).append('<div data-role="fieldcontain"><label for="frow'+i_foto_tmp+'">'+descripcion_item+'</label><textarea class="form-control" cols="40" rows="8"  name="'+id_item+'" id="'+i_foto_tmp+'" value="" '+obligatorio+' visible="true"/></textarea></div>');	/* $('#'+id_item).textinput(); */
//$("#items").append('<div id="f'+id_item+'" class="form-group '+obligatorio+'"><label name="l'+id_item+'" id="l'+id_item+'" class="control-label">'+descripcion_item+'</label><textarea class="form-control" cols="40" rows="8"  name="'+id_item+'" id="'+id_item+'" value="" '+obligatorio+' visible="true"/></textarea></div>');	/* $('#'+id_item).textinput(); */
		}else if (rta == "CANTIDAD") {
			$('#campofoto_'+i_foto_tmp).append('<div data-role="fieldcontain"><label for="frow'+i_foto_tmp+'">'+descripcion_item+'</label><input type="number" name="'+id_item+'" id="frow'+i_foto_tmp+'" value="" data-mini="true" required onkeypress="if (event.keyCode< 48 || event.keyCode > 57) event.returnValue = false;"/></div>');	/* $('#'+id_item).textinput(); */
		}else if (rta == "FECHA") {
			$('#campofoto_'+i_foto_tmp).append('<div data-role="fieldcontain"><label for="frow'+i_foto_tmp+'">'+descripcion_item+'</label><input type="date" name="'+id_item+'" id="frow'+i_foto_tmp+'" value="" '+obligatorio+'/></div>');
		}else if (rta == "BOOLEANO") {
			$('#campofoto_'+i_foto_tmp).append('<div data-role="fieldcontain"><label for="frow'+i_foto_tmp+'">'+descripcion_item+'</label><select name="'+id_item+'" id="frow'+i_foto_tmp+'" data-role="slider" data-mini="true"><option value="NO"selected >NO</option><option value="SI" >SI</option></select></div>');
		}else if (rta == "SELECCION") {
			if(id_item_last != (id_item+"_"+i_foto_tmp)){
				$("#campofoto_"+i_foto_tmp).append('<div data-role="fieldcontain"><label for="frow'+i_foto_tmp+'" class="select">'+descripcion_item+'</label><select name="'+id_item+'" id="frow'+i_foto_tmp+'" data-mini="true"></select></div>');	
			}
			if(results.rows.item(i).valor != null) { $('#frow'+i_foto_tmp).append('<option value="'+results.rows.item(i).valor+'">'+results.rows.item(i).descripcion+'</option>'); }	
		}
	id_item_last = id_item+"_"+i_foto_tmp;		console.log(id_item);
   	}
   	/*Adiciona al formulario Botón de cancelar y Guardar
   	$("#items").append('<a id="Salir" href="formulario_dialog.html" data-rel="dialog" data-mini="true" data-role="button" data-transition="flip" data-icon="delete">Cancelar</a>');
   	$("#items").append('<button type="submit" data-theme="b" data-mini="true" data-icon="check">Guardar</button>');		*/
	/*Refresca estilo para cada uno de los controles*/
    $("#campofoto_"+i_foto_tmp).trigger("create");
}
/*********************************************************************************************************************************************************************/
/**************************************************************************************************************************************************************************/
/**GUARDAR ITEMS****GUARDAR ITEMS****GUARDAR ITEMS****GUARDAR ITEMS****GUARDAR ITEMS****GUARDAR ITEMS****GUARDAR ITEMS****GUARDAR ITEMS****GUARDAR ITEMS****GUARDAR ITEMS**/
function GuardarItems(){
	db.transaction(GuardarItemsExe, errorCB);
}
function GuardarItemsExe(tx) {	
	var now = new Date();
	var fecha_captura = now.getFullYear()+'-'+(1+now.getMonth())+'-'+now.getDate()+'-'+now.getHours()+'_'+now.getMinutes()+'_'+now.getSeconds();
	var id_unico = fecha_captura+'-'+id_usr;
	if (myLatitud===undefined || myLatitud=="undefined"){myLatitud="";}
	if (myLongitud===undefined || myLongitud=="undefined"){myLongitud="";}
	if (myPrecision===undefined || myPrecision=="undefined"){myPrecision="";}
	if (localStorage.geolocaliza_obligatorio == "S" && (myLatitud=="" || myLongitud=="")){
		alert("No hay coordenadas registradas, active el GPS y busque un lugar abierto");
	}else{
		
/*		//GUARDA Y ACTUALIZA LA TABLA ASIGNACION		*/
		if(asignado=="t"){	//si es asignado
			tx.executeSql('UPDATE '+esquema+'t_asignacion_lugar set id_envio = "'+id_unico+'",fecha_ejecucion = "'+fecha_captura+'",latitud_envio="'+myLatitud+'",longitud_envio="'+myLongitud+'",exactitud="'+myPrecision+'",id_encuestador = "'+id_usr+'",estado="C",feature="'+localStorage.geometria+'" where id = "'+id_asignacion+'"');
		}else				//si es Nuevo
		{
			localStorage.id_unico = id_unico;
			tx.executeSql('INSERT INTO '+esquema+'t_asignacion_lugar (id_encuestador,id_categoria,estado,id_usuario_asign,fecha_asignacion,fecha_ejecucion,latitud_envio,longitud_envio,exactitud,id_envio,tipo_ingreso,feature) values ("'+id_usr+'","'+id_categoria+'","C","'+id_usr+'","'+fecha_captura+'","'+fecha_captura+'","'+myLatitud+'","'+myLongitud+'","'+myPrecision+'","'+id_unico+'","N","'+localStorage.geometria+'")');
		}
	
			//SELECCIONA LOS ELEMENTOS DEL FORMULARIO
			 $(':input').each(function () {
					var $this = $(this),id_item = $this.attr('name');
					if(id_item!==undefined && id_item!="" && id_item!="id_geometria" && id_item != localStorage.id_item_foto){
						//LLAMA VALOR
						var cant_val = $(this).val();
						//SI ES TIPO SELECT QUITA EL ID DE OCULTAR O MOSTRAR
						var res = cant_val.split("@");
						// VALOR FINAL A GUARDAR
						var cant_val = res[0].trim(); 					console.log (id_item + " : " + cant_val + "Visible: " + $(this).attr('visible') + " Checked: " + $(this).attr('type'));
						if( ( $(this).attr('type') != 'checkbox' && $(this).attr('visible') == 'true' && cant_val != "") || ($(this).attr('type') == 'checkbox' && $(this).is(':checked')) ){
							if(asignado=="t"){	//si es asignado
								tx.executeSql('INSERT INTO '+esquema+'t_rtas_formulario (id_asignacion,id_item,respuesta,id_envio) values ("'+id_asignacion+'","'+id_item+'","'+cant_val+'","'+id_unico+'")');
							}else				//si es Nuevo registro no asignado
							{
								tx.executeSql('INSERT INTO '+esquema+'t_rtas_formulario (id_item,respuesta,id_envio) values ("'+id_item+'","'+cant_val+'","'+id_unico+'")');
								console.log('INSERT INTO '+esquema+'t_rtas_formulario (id_item,respuesta,id_envio) values ("'+id_item+'","'+cant_val+'","'+id_unico+'")');
							}
						}
		           }
			 });

/*		//SELECCIONA LOS ELEMENTOS DEL FORMULARIO
		 $(':input').each(function () {
				var $this = $(this),id_item = $this.attr('name');
				console.log(id_item + "  --" + localStorage.id_item_foto);
				if(id_item!==undefined && id_item!="" && id_item!="id_geometria" && id_item != localStorage.id_item_foto){
					var cant_val = $(this).val(); 					//alert (id_item); alert(cant_val);
					if(asignado=="t"){	//si es asignado
						//alert('INSERT INTO '+esquema+'t_rtas_formulario (id_asignacion,id_item,respuesta,id_envio) values ("'+id_asignacion+'","'+id_item+'","'+cant_val+'","'+id_unico+'")');
						tx.executeSql('INSERT INTO '+esquema+'t_rtas_formulario (id_asignacion,id_item,respuesta,id_envio) values ("'+id_asignacion+'","'+id_item+'","'+cant_val+'","'+id_unico+'")');
					}else				//si es Nuevo registro no asignado
					{
						console.log('INSERT INTO '+esquema+'t_rtas_formulario (id_item,respuesta,id_envio) values ("'+id_item+'","'+cant_val+'","'+id_unico+'")');
						tx.executeSql('INSERT INTO '+esquema+'t_rtas_formulario (id_item,respuesta,id_envio) values ("'+id_item+'","'+cant_val+'","'+id_unico+'")');
					}
	           }
		 });	*/			 
		 
		 var num_foto = 0;
		 $("img").each(function() {
				if($(this).attr('src')!="")
				{
					var currentId = $(this).attr('id'); currentId = currentId.split('cameraImage');		console.log(currentId[1]);
					var observacion = $("#frow"+currentId[1]).val();	if(observacion === undefined)	observacion = "";
					console.log('INSERT INTO '+esquema+'t_fotos (id,url_foto,id_envio,observacion) values ("'+num_foto+'","'+$(this).attr('src')+'","'+id_unico+'","'+observacion+'")');
					tx.executeSql('INSERT INTO '+esquema+'t_fotos (id,url_foto,id_envio,observacion) values ("'+num_foto+'","'+$(this).attr('src')+'","'+id_unico+'","'+observacion+'")');
					num_foto++;
				}
			}
		);
	
		localStorage.feature="";
		localStorage.geometria="";
		if(asignado=="t"){	//si es asignado
			alerta("GeoMovil","Información almacenada exitosamente","Ok","mapa/mobile-jq.html");
		}else{
			alerta("GeoMovil","Información almacenada exitosamente","Ok","categorias.html");
		}
		
	}
}
/**************************************************************************************************************************************************************************/
/****CONSULTA GENERAL********CONSULTA GENERAL********CONSULTA GENERAL********CONSULTA GENERAL********CONSULTA GENERAL****/
function ConsultaGeneral(tx) {
	tx.executeSql('select * from '+esquema+geotabla+' where id = "'+id_feature+'"', [], ConsultaGeneralResp);
}
function ConsultaGeneralResp(tx, resultsT) {
	var lon = resultsT.rows.length;						//alert(lon);
	for (i = 0; i < lon; i++){
		var row = resultsT.rows.item(i);
		var string;
		var num_col = 0;
		for (name in row)
		{
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
			}
			num_col++;
		}
		$("#titulo").html(string);
   	}
}
/************************************************************************************************************************/
$(document).ready(function(){

	if(asignado=="t"){
		// CARGAR INFORMACION GENERAL SI ES ASIGNADO
		db.transaction(ConsultaGeneral);
		$("#Subtitulo").html("Asignaci&oacute;n n&uacute;mero "+id_asignacion);
	}else
	{
		$("#Subtitulo").html("Registro Nuevo");
	}
	
	//localStorage.feature = "add"; //Si es registro nuevo limpia la variable geometria
	if (localStorage.feature != "add") {
			localStorage.geometria = "";
	}else{
		$("#Subtitulo").append("<br><label style='color:#d0d683'>Geomertría correctamente cargada</label>");
	}
	
	// CARGAR ITEMS(PREGUNTAS/RESPUESTAS) DE LA BASE DE DATOS
	db.transaction(ConsultaItems);
	
	//QUITA LOS ELEMENTOS QUE NO ESTÁN CONFIGURADOS EN EL FORMULARIO	titulo_fotos	
	if (localStorage.geometria_obligatorio == "N" || localStorage.geometria_obligatorio == "0") {
		$("#Lid_geometria").hide();
		$("#id_geometria-button").hide();
	}
	if (localStorage.foto_obligatorio == "N" || localStorage.foto_obligatorio == "0") {
		$("#titulo_fotos").hide();
		$("#api-camera").hide();
	}
	$("form").bind("keypress", function (e) {
	    if (e.keyCode == 13) {
	      	e.stopPropagation();
			e.preventDefault();
	        return false;
	    }
	});
	
	$("#id_geometria").change(function() {
		var v = $(this).val();
		if (v != null ){
			localStorage.feature = v;
			window.location = "mapa/mobile-jq-geom.html";
		}
		
	});
	//SINCRONIZACION AUTOMATICA CON EL SERVIDOR DEL FORMULARIO ACTUAL
	console.log("Sincronizar con el servidor");
	db.transaction(ConsultaSincronizar);
	setInterval(function(){ db.transaction(ConsultaSincronizar); }, 1000*30);
	
	
});