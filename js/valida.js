/**
 */
var db = window.openDatabase("bdsigplus", "1.0", "Proyecto Sig Plus", 33554432);
function LimpiarUsuario(tx) {
	tx.executeSql('UPDATE usuario set conectado = ""');
	window.location = "index.html";
}
if (localStorage.id_usr == "" || localStorage.id_usr === undefined) 
{
	db.transaction(LimpiarUsuario);
}