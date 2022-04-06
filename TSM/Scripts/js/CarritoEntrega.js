var Permisos;
$(document).ready(function () {
    Kendo_CmbFiltrarGrid($("#dropdMaquina"), TSM_Web_APi + "CatalogoMaquinas", "NoMaquina", "IdCatalogoMaquina", "Seleccione Máquina");

});
fPermisos = function (datos) {
    Permisos = datos;
};