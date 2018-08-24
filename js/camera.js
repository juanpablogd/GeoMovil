var NomIdimage=null; //id de la imagen disponible 

var foto_calidad;
var foto_tamano;


if(localStorage.foto_calidad==""){
	foto_calidad = "100";
}else{
	foto_calidad = localStorage.foto_calidad;
}	//alert(foto_calidad);

if(localStorage.foto_tamano==""){
	foto_tamano = "640";
}else{
	foto_tamano = localStorage.foto_tamano;
}	//alert(foto_tamano);

function elimina_foto(num){
	$("#bloque"+num).attr('src')=="";
	$("#bloque"+num).remove();
	$("#api-camera").trigger("create");
}

function onFail(message) {
	$("img").each(function() {
		if($(this).attr('src')=="" || $(this).attr('src')==null){
			$(this).remove();
		}
	});		
	
	//alert('Falla al capturar Foto'); //message
}
    
function take_pic() {
	//VERIFICA SI EXISTEN ELEMENTOS IMG, SI HAY VERIFICA SI HAY DISPONIBILIDAD PARA CAPTURA DE FOTOGRAFÍA
	var img_disponible = false;
	$("img").each(function() {
		if($(this).attr('src')=="" || $(this).attr('src')==null){
			NomIdimage=$(this).attr('id');
			img_disponible = true;
			return false; 											//Espacio Disponible
		}
	});																	//	alert(img_disponible);
	//SI NO EXISTE CREA EL ELEMENTO IMG PARA ALMACENAR LA FOTO
	if(img_disponible==false){
		$("#lista_fotos").append('<div id="bloque'+i_foto+'"><img id="cameraImage'+i_foto+'" src="" width="320" height="210" align="center"/><div id="campofoto_'+i_foto+'"></div><button type="button" onclick="elimina_foto('+i_foto+');" id="btn_elimina'+i_foto+'" class="ui-btn" data-mini="true" data-iconpos="right" data-icon="arrow-u"><i class="zmdi zmdi-triangle-up"></i>&nbsp;Eliminar Foto&nbsp;<i class="zmdi zmdi-triangle-up"></i></button></div>');
		$('#btn_elimina'+i_foto+'').button();
		NomIdimage = "cameraImage"+i_foto;
		i_foto++;
	}																//alert(NomIdimage);
	
	db.transaction(ConsultaItem_foto);
	
	/* PRUEBA FINAL */
	if (typeof cordova !== 'undefined'){
	    navigator.camera.getPicture(onPhotoDataSuccess, onFail, 
	       {	quality : foto_calidad//,
				//sourceType : Camera.PictureSourceType.CAMERA
				,destinationType : Camera.DestinationType.DATA_URL /**/ 
				//,encodingType: Camera.EncodingType.JPEG
				,targetWidth: foto_tamano
				,targetHeight: foto_tamano	
			});
	}else {
		/* PRUEBA INICIO */
		image = document.getElementById(NomIdimage);
		//image.src = "img/logoUnidosPodemosMas.png";
		image.src = "data:image/jpeg;base64,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";
	}


}

// api-camera
function onPhotoDataSuccess(imageData) {	//alert("camara ok");
    image = document.getElementById(NomIdimage);
    image.style.display = 'block';	//alert(imageData);
    image.src = "data:image/jpeg;base64," + imageData;				//alert(imageData);
    $("#api-camera").trigger("create");
    imageData = null;
}

function onPhotoURISuccess(imageURI) {
      // Get image handle
      var largeImage = document.getElementById(NomIdimage);

      // Unhide image elements
      largeImage.style.display = 'block';

      // Show the captured photo
      largeImage.src = imageURI;
      imageURI = null;
    }