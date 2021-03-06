/**
 * @author SKAPHE 2013-JUN-20
 * @Mod juan.garzon 2015-JUL-20
 * @Mod juan.garzon 2016-OCT-31		
 */
var db = window.openDatabase("bdsigplus", "1.0", "Proyecto Sig Plus", 33554432);
var datos_pendientes;
var ttal_fotos;
var ttal_formularios;
var ttal_respuestas;
var msj_vacio = "No hay información pendiente para Cargar!!!";

function alerta(titulo,contenido,btn_nombre,link){
	localStorage.alert_titulo = titulo;
	localStorage.alert_contenido = contenido;
	localStorage.alert_btn_nombre = btn_nombre;
	localStorage.alert_href = link;
	window.location = "alert.html";
}


function errorCB_items(err) {
	if (err.code === undefined || err.message === undefined){
		$("#resultado").before("<br>No hay Items para sincronizar.<br>");
	}else
	{
		alert("Error procesando SQL: Codigo: " + err.code + " Mensaje: "+err.message);		
	}
}
function errorCB_Fotos(err) {
	if (err.code === undefined || err.message === undefined){
		$("#resultado").before("<br>Error al buscar las fotografias<br>");
	}else
	{ 
		alert("Error procesando SQL: Codigo: " + err.code + " Mensaje: "+err.message);
	}
	
}
function errorCB_Asignacion(err) {
	if (err.code === undefined || err.message === undefined){
		$("#resultado").before("<br>Error al buscar los cuestionarios<br>");
	}else
	{ 
		alert("Error procesando SQL: Codigo: " + err.code + " Mensaje: "+err.message);		
	}
}
function errorCB_Respuestas(err) {
	if (err.code === undefined || err.message === undefined){
		$("#resultado").before("<br>Error al buscar las Respuestas<br>");
	}else
	{ 
		alert("Error procesando SQL: Codigo: " + err.code + " Mensaje: "+err.message);		
	}
}

function ConsultaSincronizar(tx) {
	tx.executeSql('SELECT esquema FROM p_verticales order by esquema asc', [], ConsultaSincronizarCarga,errorCB_items);
}
function ConsultaSincronizarCarga(tx, results) {
	var ttal_ver = results.rows.length;	 //alert(len);
	for (cv = 0; cv < ttal_ver; cv++){
		var esquema = results.rows.item(cv).esquema;
		tx.executeSql('SELECT "'+esquema+'" as esquema,id,url_foto,id_envio,observacion FROM '+esquema+'t_fotos limit 50', [], 
		       (function(esquema){
		           return function(tx,results){
		               ConsultaSincronizarFotos(tx,results,esquema);
		           };
		       })(esquema),errorCB_Fotos);
   };

}

//SINCRONIZAR FOTOS
function ConsultaSincronizarFotos(tx, results, esquema) {
	//$.mobile.loading( 'show', { text: 'Cargando Fotografías....', textVisible: true, theme: 'a', html: "" });
	var len = results.rows.length;	//alert(len);
	if(len==0){
	   tx.executeSql('SELECT "'+esquema+'" as esquema,id,id_feature,feature,id_encuestador,id_categoria,estado,id_usuario_asign,fecha_asignacion,fecha_ejecucion,latitud_envio,longitud_envio,exactitud,id_envio,geotabla,tipo_ingreso FROM '+esquema+'t_asignacion_lugar where estado = "C"  limit 100', [], 
	   (function(esquema){
	       return function(tx,results){
	           ConsultaSincronizarAsignacion(tx,results,esquema);
	       };
	   })(esquema),errorCB_Asignacion);
	}else{
		for (i = 0; i < len; i++){
			var parametros = new Object();
			var esquema = results.rows.item(i).esquema;
			parametros['esquema'] = esquema;
			parametros['tabla'] = 't_fotos';
			parametros['url_foto'] = results.rows.item(i).url_foto;
			parametros['id'] = results.rows.item(i).id;
			parametros['observacion'] = results.rows.item(i).observacion;
			
			var cod_envio = results.rows.item(i).id_envio;
			parametros['id_envio'] = cod_envio;
			$("#resultado").html("<br>Fotos restantes: "+(ttal_fotos-i)+".<br>");
			$("#resultado").trigger("create");
			$.ajax({
				data:  parametros,
				url:'http://'+localStorage.url_servidor+'/SIG/servicios/sincronizar.php',
				type:  'post',
				async: false,		//timeout: 30000,
				success: function(responsef){	//alert(responsef);	//$("#resultado").text(responsef);	//QUITAR ALERT
						db.transaction(function(tx) {
							var respf = responsef.trim();
							var n=respf.split("@");
							//QUITAR COMENTARIO 
							tx.executeSql('DELETE from '+n[0]+'t_fotos where id_envio = "'+n[1]+'" and id = "'+n[2]+'"');
				        });
				},
				error: function (error) {
					$("#resultado").text('Error en ingreso de Fotos');
			    }
			});
			if((i+1) == len) {	//alert("continue a FOrm");
			   tx.executeSql('SELECT "'+esquema+'" as esquema,id,id_feature,feature,id_encuestador,id_categoria,estado,id_usuario_asign,fecha_asignacion,fecha_ejecucion,latitud_envio,longitud_envio,exactitud,id_envio,geotabla,tipo_ingreso FROM '+esquema+'t_asignacion_lugar where estado = "C" limit 100', [], 
			   (function(esquema){
			       return function(tx,results){
			           ConsultaSincronizarAsignacion(tx,results,esquema);
			       };
			   })(esquema),errorCB_Asignacion);
			}
	   	}		
	} /* */
}	

function ConsultaSincronizarAsignacion(tx, results, esquema) {
	var lon = results.rows.length;									//alert(lon);//$("#resultado").before("<br>Cuestionarios encontrados: "+len+".<br>");
	//$.mobile.loading( 'show', { text: 'Cargando Asignaciones....', textVisible: true, theme: 'a', html: "" });
	if(lon==0){
		tx.executeSql('SELECT "'+esquema+'" as esquema,id_asignacion,id_item,respuesta,id_envio FROM '+esquema+'t_rtas_formulario limit 200', [],
			   (function(esquema){
			       return function(tx,results){
			           ConsultaSincronizarRespuestas(tx,results,esquema);
			       };
			   })(esquema),errorCB_Respuestas);
	}else{
		for (i = 0; i < lon; i++){	console.log(results.rows.item(i));
			var parametros = new Object();
			var cod_envio = results.rows.item(i).id_envio;
			parametros['esquema'] = results.rows.item(i).esquema;
			parametros['tabla'] = 't_asignacion_lugar';
			parametros['id'] = results.rows.item(i).id;
			parametros['id_feature'] = results.rows.item(i).id_feature;
			parametros['feature'] = results.rows.item(i).feature;
			parametros['id_encuestador'] = results.rows.item(i).id_encuestador;
			parametros['id_categoria'] = results.rows.item(i).id_categoria;
			parametros['estado'] = results.rows.item(i).estado;
			parametros['id_usuario_asign'] = results.rows.item(i).id_usuario_asign;
			parametros['fecha_asignacion'] = results.rows.item(i).fecha_asignacion;
			parametros['fecha_ejecucion'] = results.rows.item(i).fecha_ejecucion;
			parametros['latitud_envio'] = results.rows.item(i).latitud_envio;
			parametros['longitud_envio'] = results.rows.item(i).longitud_envio;
			parametros['exactitud'] = results.rows.item(i).exactitud;
			parametros['id_envio'] = cod_envio;
			parametros['geotabla'] = results.rows.item(i).geotabla;
			parametros['tipo_ingreso'] = results.rows.item(i).tipo_ingreso;
			$("#resultado").html("<br>Formularios restantes: "+(ttal_formularios-i)+".<br>");
			$("#resultado").trigger("create");
			$.ajax({
				data:  parametros,
				url:'http://'+localStorage.url_servidor+'/SIG/servicios/sincronizar.php',
				type:  'post',
				async: false,
				success: function(responsea){	//alert(responsea);
					db.transaction(function(tx) {
						var respa = responsea.trim();  
						var n=respa.split("@"); 
			          	tx.executeSql('DELETE from '+n[0]+'t_asignacion_lugar where id_envio = "'+n[1]+'"');
			        });
				},
				error: function (error) {
					$("#resultado").text('Error en ingreso de Cuestionarios');
			    }
			});
			if((i+1) == lon) { //alert("continue a rtas");
				tx.executeSql('SELECT "'+esquema+'" as esquema,id_asignacion,id_item,respuesta,id_envio FROM '+esquema+'t_rtas_formulario limit 200', [],
				   (function(esquema){
				       return function(tx,results){
				           ConsultaSincronizarRespuestas(tx,results,esquema);
				       };
				   })(esquema),errorCB_Respuestas);
			}
	   	}
	}
}	

function ConsultaSincronizarRespuestas(tx, results, esquema) {
	var lon = results.rows.length;									//alert("Respuestas: "+lon);  //$("#resultado").before("<br>Cuestionarios encontrados: "+len+".<br>");
	//$.mobile.loading( 'show', { text: 'Cargando Respuestas....', textVisible: true, theme: 'a', html: "" });
	if(lon==0){
		salir(esquema);
	}else{
		for (i = 0; i < lon; i++){
			var parametros = new Object();
			var cod_envio = results.rows.item(i).id_envio;
			parametros['esquema'] = results.rows.item(i).esquema;
			parametros['tabla'] = 't_rtas_formulario';
			parametros['id_asignacion'] = results.rows.item(i).id_asignacion;
			parametros['id_item'] = results.rows.item(i).id_item;
			parametros['respuesta'] = results.rows.item(i).respuesta;
			parametros['id_envio'] = results.rows.item(i).id_envio;
			$("#resultado").html("<br>Datos restantes: "+(ttal_respuestas-i)+".<br>");
			$("#resultado").trigger("create");
			$.ajax({
				data:  parametros,
				url:'http://'+localStorage.url_servidor+'/SIG/servicios/sincronizar.php',
				type:  'post',
				async: false,		//timeout: 30000,
				success: function(responser){	//alert(responser);
					db.transaction(function(tx) {
						var respr = responser.trim();		//alert(resp);
						var res=respr.split("@");			
			          	tx.executeSql('DELETE from '+res[0]+'t_rtas_formulario where id_envio = "'+res[1]+'" and id_item = "'+res[2]+'"');
					});
				},
				error: function (error) {
					$("#resultado").text('Error en ingreso de Respuestas');
			    }
			});
			if((i+1) == lon) { salir(esquema); }
	   	}
	}
}

function salir (esquema){
	db.transaction(function(tx) {
		tx.executeSql('SELECT esquema FROM p_verticales order by esquema desc limit 1', [],
						(function(esquema){
								       return function(tx,results){
								           SalirResp(tx,results,esquema);
								       };
								   })(esquema),errorCB_Respuestas);
	});
}

function SalirResp(tx, results, esquema) {
	var lon = results.rows.length; 					//alert(lon);
	var esquemaSql = results.rows.item(0).esquema; 	//alert(esquemaSql);
		
	if (esquemaSql ==esquema){
		$("#resultado").html('');
	   	$.mobile.loading('hide');
	   	alerta("GeoMovil","Cargue exitoso","Ok","principal.html");
	}	
}

/*----------------LISTA INFORMACIÓN A CARGAR CUANDO INICIA EL APLICATIVO----------------*/
function Consulta(tx) {
	tx.executeSql('SELECT esquema FROM p_verticales', [], ConsultaCarga,errorCB_items);
}
function ConsultaCarga(tx, results) {
	var len = results.rows.length;	
	for (i = 0; i < len; i++){
		var esquema = results.rows.item(i).esquema;
		tx.executeSql('SELECT "'+esquema+'" as esquema,id,url_foto,id_envio FROM '+esquema+'t_fotos limit 50', [], ConsultaFotos,errorCB_Fotos);
		tx.executeSql('SELECT "'+esquema+'" as esquema,id,id_feature,feature,id_encuestador,id_categoria,estado,id_usuario_asign,fecha_asignacion,fecha_ejecucion,latitud_envio,longitud_envio,exactitud,id_envio,geotabla,tipo_ingreso FROM '+esquema+'t_asignacion_lugar where estado = "C" limit 100', [], ConsultaAsignacion,errorCB_Asignacion);
		tx.executeSql('SELECT "'+esquema+'" as esquema,id_asignacion,id_item,respuesta,id_envio FROM '+esquema+'t_rtas_formulario  limit 200', [], ConsultaRespuestas,errorCB_Respuestas);
   };

}

//CONSULTA DE FOTOS PENDIENTES PARA CARGAR
function ConsultaFotos(tx, results) {
	var len = results.rows.length;
	ttal_fotos = len;
	if(len>0){
		$("#resultado").before('<br>Fotos Pendientes envío - '+results.rows.item(0).esquema+': '+ttal_fotos);
		if(datos_pendientes==false){
			$("#btn_si").show();
			$("#Lpregunta").html("Seguro que deseas cargar la Información?");
		}
	}
}
//CONSULTA ASIGNACIÓN
function ConsultaAsignacion(tx, results) {
	var len = results.rows.length;
	ttal_formularios = len;
	if(len>0){
		$("#resultado").before('<br>Formularios Pendientes envío - '+results.rows.item(0).esquema+': '+ttal_formularios);
		if(datos_pendientes==false){
			$("#resultado").html('');
			$("#btn_si").show();
			$("#Lpregunta").html("Seguro que deseas cargar la Información?");
		}
	}
}
//CONSULTA RESPUESTAS
function ConsultaRespuestas(tx, results) {
	var len = results.rows.length;
	ttal_respuestas = len;
	if(len>0){
		$("#resultado").before('<br>Datos Pendientes envío - '+results.rows.item(0).esquema+': '+ttal_respuestas);
		if(datos_pendientes==false){
			$("#btn_si").show();
			$("#Lpregunta").html("Seguro que deseas cargar la Información?");
		}
	}
}

$(document).ready(function(){
	$("#resultado").append(msj_vacio);
	datos_pendientes=false;
	
	$("#btn_si").click(function(event) {
		$.mobile.loading( 'show', { text: 'Cargando Información....', textVisible: true, theme: 'a', html: "" });
		$("#btn_si").remove();					//$("#").remove();
		$("#Lpregunta").remove();
		db.transaction(ConsultaSincronizar);
	});
	
	$("#btn_si").hide();

	db.transaction(Consulta);
	
});
