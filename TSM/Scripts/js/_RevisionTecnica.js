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
            formaMaquina: maq[0].NomFiguraMaquina,
            cantidadBrazos: maq[0].CantidadEstaciones,
            eventos: {
                nuevaEstacion: function (e) {
                    AgregaEstacion(e);
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
                desplazamientoEstacion: function (e) {
                    var elementoADesplazar = e.detail[0];
                    var sType = $("#maquinaRevTec").data("maquinaSerigrafia").tipoMaquinaVue.selectedType;
                    fn_OpenModalDesplazamiento(elementoADesplazar.number, $("#maquinaRevTec"), sType.CantidadEstaciones);
                },
                eliminarEstacion: function (e) {
                        fn_EliminarEstacion(maq[0].IdSeteo, e, $("#maquinaRevTec"));
                },
                reduccionMaquina: function (e) {
                    var selType = $("#maquinaRevTec").data("maquinaSerigrafia").tipoMaquinaVue.selectedType;
                    fn_UpdFormaRevTec(selType.CantidadEstaciones, selType.IdFormaMaquina, selType.NomFiguraMaquina, $("#maquinaRevTec"),1); 


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
    $("#maquinaRevTec").data("maquinaSerigrafia").tipoMaquinaVue.setSelected(maq[0].IdFormaMaquina);
    fn_GetColores($("#maquinaRevTec").data("maquinaSerigrafia"), maq[0].IdSeteo);
    fn_Tecnicas($("#maquinaRevTec").data("maquinaSerigrafia"), maq[0].IdSeteo);
    fn_Bases($("#maquinaRevTec").data("maquinaSerigrafia"));
    fn_Accesorios($("#maquinaRevTec").data("maquinaSerigrafia"));

    //$("#maquina").data("maquinaSerigrafia").maquinaVue.readOnly(true);
};


//let fn_VerDetalle = 

var fn_RTMostrarGrid = function () {
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true;
    $("#maquinaRevTec").data("maquinaSerigrafia").activarSoloLectura(!vhb);
};

var elementoSeleccionado = function (e) {
    if (Number(maq[0].IdFormaMaquina) !== Number(e.detail[0].IdFormaMaquina)) {
        if ($("#maquinaRevTec").data("maquinaSerigrafia").maquinaVue.initialize(e.detail[0].CantidadEstaciones, e.detail[0].NomFiguraMaquina) === "OK") {
            fn_UpdFormaRevTec(e.detail[0].CantidadEstaciones, e.detail[0].IdFormaMaquina, e.detail[0].NomFiguraMaquina, $("#maquinaRevTec"),0); 
        }
    } 
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