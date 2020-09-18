var UrlEstado = "";
var UrlCambioEstado = "", xDkParametros = "";
var ValidCambio = "";
var VistaCambioEsta = "";

var fn_DocRIniciaVistaCambio = function () {
    UrlEstado = TSM_Web_APi + "EstadosSiguientes/GetEstadosSiguientes";
    Kendo_CmbFiltrarGrid($("#cmbEstados"), UrlEstado + "/Estados/undefined/true", "Nombre", "EstadoSiguiente", "Seleccione un Servicio ....","","",false);
};
/**
 * Inicializa la ventana modal
  * @param {any} e vista
 * @param {string} pUrlCambioEstado url para el cambio de estado
 * @param {JSON} Param valores pasados a la funcion
 */
var fn_CambioEstadoInicializacion = function (e,pUrlCambioEstado,Param) {
    VistaCambioEsta = e;

    var DSestado = new kendo.data.DataSource({
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    url: UrlEstado + "/" + Param["Tabla"] + "/" + Param["EstadoActual"] + "/true",
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
    // pasa el valor a ls variables globales xDkParametros y UrlCambioEstado
    xDkParametros = Param;
    UrlCambioEstado = pUrlCambioEstado;

    $("#cmbEstados").data("kendoComboBox").setDataSource(DSestado);

    $("#cmbEstados").data("kendoComboBox").value("");
    $("#TxtMotivo").val("");

    Kendo_CmbFocus($("#cmbEstados"));

    ValidCambio = $("#FrmCambioEstado").kendoValidator(
        {
            rules: {

                MsgcmbEstados: function (input) {
                    if (input.is("[name='cmbEstados']")) {
                        return $("#cmbEstados").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },


                MsgMotivo: function (input) {
                    if (input.is("[name='TxtMotivo']")) {
                        return (input.val().length > 0 && input.val().length <= 2000);
                    }
                    return true;
                }

            },
            messages: {

                MsgcmbEstados: "Requerido",
                MsgMotivo: "Campo requerido, logitud  máxima del campo es 2000"
            }
        }).data("kendoValidator");
};

/**
 * funcion que se ejecuta en el boton cambio de estado en la ventana modal
 * @returns {boolean} retorna true o false
 */
function Fn_Cambio() {
    if (ValidCambio.validate()) {

        // asignar motivo y estado siguiente al arreglo.
        xDkParametros.Motivo = $("#TxtMotivo").val();
        xDkParametros.EstadoSiguiente = $("#cmbEstados").data("kendoComboBox").value();

        return Fn_CambiarEstado(UrlCambioEstado, xDkParametros);
    }
    else {
        return false;
    }
    
}
/**
 * ejecuta el evento ajax para el cambio de estado
 * @param {string} Url url de cambio de estado
 * @param {Dictionary<string,object>} DkParametros coleccion de parametros
 * @returns {boolean} RETORNA VERDADERO / FALSO
 */
function Fn_CambiarEstado(Url,DkParametros) {
    kendo.ui.progress($("#TxtMotivo"), true);
    var Realizocambio = false;
    var proceder = true;

    if (DkParametros["fnGuardado"] === undefined) {
        proceder = true;
    }
    else {
        proceder = DkParametros["fnGuardado"].call(document, jQuery);
    }
   
    if (proceder) {
        kendo.ui.progress($(".k-dialog"), true);
        $.ajax({
            url: Url,
            data: JSON.stringify(DkParametros),
            type: "Post",
            dataType: "json",
            async: false,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                kendo.ui.progress($("#TxtMotivo"), false);
                RequestEndMsg(data, "Post");
                Realizocambio = true;
                kendo.ui.progress($(".k-dialog"), false);
                if (DkParametros["fn_AfterChange"] === undefined) {
                    DkParametros["fn_AfterChange"].call(document, jQuery);
                }
            },
            error: function (data) {
                VistaCambioEsta.data("kendoDialog").close();
                kendo.ui.progress($("#TxtMotivo"), false);
                ErrorMsg(data);
                Realizocambio = false;
                kendo.ui.progress($(".k-dialog"), false);
            }

        });
    }
    else {
        VistaCambioEsta.data("kendoDialog").close();
    }
   

    return Realizocambio;

}

