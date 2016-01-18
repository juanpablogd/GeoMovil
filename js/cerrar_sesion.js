/**
 * @author DGPJ
 * @Fecha 20130831
 * @Fecha 20130930
 */
var db = window.openDatabase("bdsigplus", "1.0", "Proyecto Sig Plus", 33554432);
var nombre = window.localStorage.nombre;
function LimpiarUsuario(tx) {
	tx.executeSql('UPDATE usuario set conectado = ""');
	window.location = "index.html";
}
function descargar()
{
	localStorage.clear();
	db.transaction(LimpiarUsuario);
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
	$("#Lpregunta").text(nombre+'! Seguro que desea cerrar sesión?');
 });