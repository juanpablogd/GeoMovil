/**
 * @author DGPJ
 * @Fecha 20130831
 * @Fecha 20130930
 */
var id_usuario = window.localStorage.id_usr;
var datos_pendientes=false;

function alerta(titulo,contenido,btn_nombre,link){
	localStorage.alert_titulo = titulo;
	localStorage.alert_contenido = contenido;
	localStorage.alert_btn_nombre = btn_nombre;
	localStorage.alert_href = link;
	window.location = "alert.html";
}

function descargar()
{
	cargando = true;
		console.log('http://'+localStorage.url_servidor+'/SIG/servicios/actualizar_parametros.php?id_usuario='+id_usuario);
		$.mobile.loading( 'show', { text: 'Buscando Información....', textVisible: true, theme: 'a', html: "" });
		//alert('http://'+localStorage.url_servidor+'/SIG/servicios/actualizar_parametros.php?id_usuario='+id_usuario);
		$.ajax({
			url:'http://'+localStorage.url_servidor+'/SIG/servicios/actualizar_parametros.php?id_usuario='+id_usuario,
			dataType: 'json',
			success: function(data){
				console.log(data);	//return false;
				if (data[0].encontrado == "true"){
						$.mobile.loading( 'show', { text: 'Descargando Información....', textVisible: true, theme: 'a', html: "" });
						arr_ListaTabla = new Array();
						arr_tabla = new Array();
						var ttal_reg = 0;
						
					 	for(var json in data){ 						
						 	json++; 							//Omite el registro 'encontrado'
						    for(var i in data[json]){			//Por cada  Tabla

								var ValTabla="";				
								var columnas="";			
						    	for(var j in data[json][i]){ 	//Por cada reg	//alert(j+':'+data[json][i][j]);
						    		if(j==0){
						    			columnas = data[json][i][j];
						    		}else
						    		{
						    			var col_valores="";
						    			
						    			for(var k in data[json][i][j]){ //Codifica cada dato para su inserción
											if (col_valores==""){
								        		col_valores = '"'+data[json][i][j][k]+'"';
								        	}else col_valores = col_valores+',"'+data[json][i][j][k]+'"';
						    			}

										arr_tabla[ttal_reg] = [];
										arr_tabla[ttal_reg][0] = i;
										arr_tabla[ttal_reg][1] = columnas;
										arr_tabla[ttal_reg][2] = col_valores;
										ttal_reg++;
						    		}
						    	}
								
								if (i != "" && i != null) {
									var numm  = json-1;								//alert('MMM: '+numm);
									arr_ListaTabla[json-1] = [];
									arr_ListaTabla[json-1][0] = i;					//alert('Reg: '+json-1+': '+arr_ListaTabla[json-1][0]);
									arr_ListaTabla[json-1][1] = columnas;			//alert('Reg: '+json-1+': '+arr_ListaTabla[json-1][1]);
								}
							} 
						}

						TablaGuardar();
				}else{
					$.mobile.loading( 'hide' );
					alerta("Geomovil","No hay Actualizaciones pendientes","Ok","#");
					//alert("No hay Actualizaciones pendientes");
				}
			},
			error: function (error) {
					$.mobile.loading( 'hide' );
					alerta("Geomovil","No hay conexión en el servidor Principal","Ok","principal.html");
                  	//alert("No hay conexión en el servidor Principal");
					//window.location = "principal.html";
            }
		});
}

function descargar_cartografia()
{
	cargando = true;
		$.mobile.loading( 'show', { text: 'Buscando Información....', textVisible: true, theme: 'a', html: "" });
		$.ajax({
			url:'http://'+localStorage.url_servidor+'/SIG/servicios/actualizar_cartografia.php',
			dataType: 'json',
			success: function(data){
				if (data[0].encontrado == "true"){
						$.mobile.loading( 'show', { text: 'Descargando Información....', textVisible: true, theme: 'a', html: "" });
						arr_ListaTabla = new Array();
						arr_tabla = new Array();
						var ttal_reg = 0;
						
					 	for(var json in data){ 						
						 	json++; 							//Omite el registro 'encontrado'
						    for(var i in data[json]){			//Por cada  Tabla

								var ValTabla="";				
								var columnas="";			
						    	for(var j in data[json][i]){ 	//Por cada reg	//alert(j+':'+data[json][i][j]);
						    		if(j==0){
						    			columnas = data[json][i][j];
						    		}else
						    		{
						    			//LOCALSTORAGE
						    			/*try
  										{
						    					window.localStorage.setItem(data[json][i][j][0],"data:image/jpeg;base64,"+data[json][i][j][1]);
						    			}
										catch(err)
										  {
											$.mobile.loading( 'hide' );
											alerta("Geomovil","El espacio ha sido completado en su totalidad","Ok","principal.html");
											return false;
										  }*/
										  
						    			
						    			var col_valores="";
						    			
						    			for(var k in data[json][i][j]){ //Codifica cada dato para su inserción 
						    				//alert(k);
											if (col_valores==""){
								        		col_valores = '"'+data[json][i][j][k]+'"';
								        	}else{
								        		/* HEXADECIMAL
								        		 if(k==4){

													col_valores = col_valores+','+data[json][i][j][k];
	
								        		}else col_valores = col_valores+',"'+data[json][i][j][k]+'"';
								        		*/ 
								        		col_valores = col_valores+',"'+data[json][i][j][k]+'"';
								        	}
						    			}

										arr_tabla[ttal_reg] = [];
										arr_tabla[ttal_reg][0] = i;
										arr_tabla[ttal_reg][1] = columnas;
										arr_tabla[ttal_reg][2] = col_valores;
										ttal_reg++;
										
						    		}
						    	}
								
								//alert(i);
								
								if (i != "" && i != null) {
									var numm  = json-1;								//alert('MMM: '+numm);
									arr_ListaTabla[json-1] = [];
									arr_ListaTabla[json-1][0] = i;					//alert('Reg: '+json-1+': '+arr_ListaTabla[json-1][0]);
									arr_ListaTabla[json-1][1] = columnas;			//alert('Reg: '+json-1+': '+arr_ListaTabla[json-1][1]);
								}
							} 
						}
						//LOCALSTORAGE $.mobile.loading( 'hide' );
						//LOCALSTORAGE alerta("Geomovil","Actualización exitosa","Ok","principal.html");
						TablaGuardar_cartografia();
				}else{
					$.mobile.loading( 'hide' );
					alerta("Geomovil","No hay Actualizaciones pendientes","Ok","#");
					//alert("No hay Actualizaciones pendientes");
				}
			},
			error: function (error) {
					alert(error);
					//$.mobile.loading( 'hide' );
					//alerta("Geomovil","No hay conexión en el servidor Principal","Ok","principal.html");

            }
		});
}

/*----------------LISTA INFORMACIÓN A CARGAR CUANDO INICIA EL APLICATIVO----------------*/
function Consulta(tx) {
	tx.executeSql('SELECT esquema FROM p_verticales', [], ConsultaCarga);
}
function ConsultaCarga(tx, results) {
	var len = results.rows.length;	
	for (i = 0; i < len; i++){
		var esquema = results.rows.item(i).esquema;
		tx.executeSql('SELECT "'+esquema+'" as esquema FROM '+esquema+'t_fotos limit 1', [], ConsultaFotos);
		tx.executeSql('SELECT "'+esquema+'" as esquema,id,id_feature,feature,id_encuestador,id_categoria,estado,id_usuario_asign,fecha_asignacion,fecha_ejecucion,latitud_envio,longitud_envio,exactitud,id_envio,geotabla,tipo_ingreso FROM '+esquema+'t_asignacion_lugar where estado = "C" limit 1', [], ConsultaAsignacion);
   };

}

//CONSULTA DE FOTOS PENDIENTES PARA CARGAR
function ConsultaFotos(tx, results) {
	var len = results.rows.length;
	ttal_fotos = len;
	if(len>0){
		if(!$('#div_enviar').is(':visible')) {
			$("#div_descargar").hide();
			$("#div_enviar").show();
		}
	}
}
//CONSULTA ASIGNACIÓN
function ConsultaAsignacion(tx, results) {
	var len = results.rows.length;
	ttal_formularios = len;
	if(len>0){
		if(!$('#div_enviar').is(':visible')) {
			$("#div_descargar").hide();
			$("#div_enviar").show();
		}
	}
}


$( document ).ready(function() {
    $("#btn_si").click(function( event ) {
    	$("#btn_si").remove();
    	$("#btn_no").remove();
 		descargar();
	});
    $("#btn_no").click(function( event ) {
 		window.location = "principal.html";
	});
    $("#btn_enviar").click(function( event ) {
 		window.location = "cargar.html";
	});
	
    $("#btn_si_carto").click(function( event ) {
    	$("#btn_si_carto").remove();
    	$("#btn_no_carto").remove();
 		descargar_cartografia();
	});
    $("#btn_no_carto").click(function( event ) {
 		window.location = "principal.html";
	});
	
	$("#div_descargar").show();
	$("#div_enviar").hide();
	
	db.transaction(Consulta);
 });