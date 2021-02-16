var Permisos;
let UrlArf = TSM_Web_APi + "AnalisisRequerimientoFactibilidades";
let UrlArfDet = TSM_Web_APi + "AnalisisRequerimientoFactibilidadesRevisiones";
let StrIdCatalogoInsu = "";
let vIdPlan = 0;
let gAlto = 300;

//#region Programacion Analisis Requerimiento Factibilidad
var fn_RTCargarConfiguracion = function () {
    maq = fn_GetMaquinas();
    TiEst = fn_GetTipoEstaciones();

    $("#maquinaRevTec").maquinaSerigrafia({
        maquina: {
            data: maq,
            eventos: {
                nuevaEstacion: function (e) {
                    AgregaEstacion(e);
                    maq = fn_GetMaquinas();
                    $("#maquinaRevTec").data("maquinaSerigrafia").cargarDataMaquina(maq);
                },
                abrirEstacion: fn_VerDetalleBrazoMaquina,
                editarEstacion: fn_VerDetalleBrazoMaquina,
                pegarEstacion: function (e) {
                    var dataCopy = e.detail[0];
                    fn_DuplicarBrazoMaquina($("#maquinaRevTec").data("maquinaSerigrafia").maquina, dataCopy);
                },
                trasladarEstacion: function () {
                    var informacionTraslado = e.detail[0];
                    $("#maquinaRevTec").data("maquinaSerigrafia").maquinaVue.aplicarTraspaso(informacionTraslado.brazoDestino, informacionTraslado.tipo, informacionTraslado.data, informacionTraslado.brazoInicio);
                },
                desplazamientoEstacion: function () {
                    var elementoADesplazar = e.detail[0];
                    $("#maquinaRevTec").data("maquinaSerigrafia").maquinaVue.desplazarBrazo(elementoADesplazar.number, 2, 'R');
                },
                eliminarEstacion: function (e) {
                    fn_EliminarEstacion(maq[0].IdSeteo, e.detail[0].number);
                }
            }
        },
        tipoMaquina:
        {
            mostrar: true,
            eventos: {
                onChange: elementoSeleccionado
            }
        },
        colores: { mostrar: true },
        tecnicas: { mostrar: true },
        bases: { mostrar: true },
        accesorios: { mostrar: true }
    });

    fn_GetFormasMaquina($("#maquinaRevTec").data("maquinaSerigrafia"));
    fn_GetColores($("#maquinaRevTec").data("maquinaSerigrafia"), maq[0].IdSeteo)
    fn_Tecnicas($("#maquinaRevTec").data("maquinaSerigrafia"), maq[0].IdSeteo);
    fn_Bases($("#maquinaRevTec").data("maquinaSerigrafia"));
    fn_Accesorios($("#maquinaRevTec").data("maquinaSerigrafia"));

    //$("#maquina").data("maquinaSerigrafia").maquinaVue.readOnly(true);
};


let fn_VerDetalle = 

var fn_RTMostrarGrid = function () {
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true;
};

var elementoSeleccionado = function (e) {
    $("#maquinaRevTec").data("maquinaSerigrafia").maquinaVue.initialize(e.detail[0].CantidadEstaciones, e.detail[0].NomFiguraMaquina);
};

///*Funciones para Maquina de Vue*/
//var accesoriosSecundarios = document.getElementById('accesoriosSecundariosEl');

//accesoriosSecundarios.addEventListener('nuevo-accesorio', (e) => {
//    accesoriosSecundarios.vueComponent.agregarAccesorio(e.detail[0]);
//});

//accesoriosSecundarios.addEventListener('detalle-accesorio', (e) => {
//    console.log('informacion del accesorio', e.detail[0]);
//});



//var accesoriosSecundarios = document.getElementById('accesoriosSecundariosEl');

//accesoriosSecundarios.addEventListener('nuevo-accesorio', (e) => {
//    accesoriosSecundarios.vueComponent.agregarAccesorio(e.detail[0]);
//})

//accesoriosSecundarios.addEventListener('detalle-accesorio', (e) => {
//    console.log('informacion del accesorio', e.detail[0]);
//})






//Agregar a Lista de ejecucion funcion configurar grid
fun_List.push(fn_RTCargarConfiguracion);

//Agregar a lista de ejecucion funcion mostrar grid.
var EtapaPush2 = {};
EtapaPush2.IdEtapa = idEtapaProceso;
EtapaPush2.FnEtapa = fn_RTMostrarGrid;
fun_ListDatos.push(EtapaPush2);

fPermisos = function (datos) {
    Permisos = datos;
};