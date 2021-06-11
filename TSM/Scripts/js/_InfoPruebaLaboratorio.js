let _idPruebaLaboratorio;
let tabStrip;
var NuevoRegistro = false;// inicializa la variable modo nuevo registro
let EstadoActual = 'ING'; // lo inicializa como ingresado si el form está en blanco
var fn_InicializarInfoLaboratorio = function (vIdPruebaLaboratorio) {
    _idPruebaLaboratorio = vIdPruebaLaboratorio;

    tabStrip = $("#TabDesplazar").kendoTabStrip({
        tabPosition: "top",
        animation: { open: { effects: "fadeIn" } }
    }).data("kendoTabStrip");

    KdoButton($("#GuardarSolicitud"), "save", "Guardar solicitud");
    $("#FechaCreacion").kendoDatePicker({ format: "dd/MM/yyyy" });
  //  $("#FechaCreacion").data("kendoDatePicker").value(Fhoy());
   
    //Kendo_CmbFiltrarGrid($("#CmbEstado"), TSM_Web_APi + "Estados/", "Nombre", "Estado", "Seleccione...");

    $("#NoSolicitud").kendoTextBox();
    $("#IdTurno").kendoTextBox();
    $("#IdCorte").kendoTextBox();
    $("#IdBulto").kendoTextBox();
    Kendo_CmbFiltrarGrid($("#CmbTipoOrdenTrabajo"), TSM_Web_APi + "TiposOrdenesTrabajos/", "Nombre", "IdTipoOrdenTrabajo", "Seleccione...");

    Kendo_CmbFiltrarGrid($("#CmbClientePrueba"), TSM_Web_APi + "Clientes/", "Nombre", "IdCliente", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#CmbCalidadPrueba"), TSM_Web_APi + "CalidadPruebas/" , "Nombre", "IdCalidadPrueba", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#CmbNombreDiseno"), TSM_Web_APi + "CatalogoDisenos/", "Nombre", "IdCatalogoDiseno", "Seleccione...");
    Kendo_CmbFiltrarGrid($("#CmbOrigenPrueba"), TSM_Web_APi + "OrigenesPruebasLaboratorio/", "OrigenPrueba", "IdOrigenPrueba", "Seleccione...");
    $("#NumCantLavadas").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#NumCantQuemadas").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#IdPlanta").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#IdMaquina").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });




    getSolicitud();

    //var dsPiezasLaboratorio = new kendo.data.DataSource({
    //    transport: {
    //        read: {
    //            url: function () {
    //                return TSM_Web_APi + "PiezasDesarrolladasCriteriosCriticos/" + _idPiezaDesarrollada;
    //            },
    //            contentType: "application/json; charset=utf-8"
    //        },
    //        update: {
    //            url: function (datos) { return TSM_Web_APi + "PiezasDesarrolladasCriteriosCriticos/" + datos.IdPiezaDesarrollada + "/" + datos.IdCriterioItem; },
    //            type: "PUT",
    //            contentType: "application/json; charset=utf-8"
    //        },
    //        parameterMap: function (data, type) {
    //            if (type !== "read") {
    //                return kendo.stringify({
    //                    IdPiezaDesarrollada: data.IdPiezaDesarrollada,
    //                    IdCriterioItem: data.IdCriterioItem,
    //                    Cumple: data.Cumple,
    //                    Comentario: data.Comentario,
    //                    IdUsuarioMod: null,
    //                    FechaMod: null
    //                });
    //            }
    //        }
    //    },
    //    requestEnd: Grid_requestEnd,
    //    schema: {
    //        model: {
    //            id: "IdCriterioItem",
    //            fields: {
    //                IdPiezaDesarrollada: { type: "number" },
    //                IdCriterioItem: { type: "number" },
    //                IdCriterio: { type: "number" },
    //                Criterio: { type: "string" },
    //                Cumple: { type: "boolean" },
    //                IdPerfilCriterio: { type: "number" },
    //                IdNivelExigencia: { type: "number" },
    //                NivelExigencia: { type: "string" },
    //                Comentario: { type: "string" }
    //            }
    //        }
    //    }
    //});

    ////CONFIGURACION DEL gCHFor,CAMPOS
    //$("#gridCriteriosCriticos").kendoGrid({
    //    edit: function (e) {
    //        KdoHideCampoPopup(e.container, "IdPiezaDesarrollada");
    //        KdoHideCampoPopup(e.container, "IdCriterioItem");
    //        KdoHideCampoPopup(e.container, "IdCriterio");
    //        KdoHideCampoPopup(e.container, "IdPerfilCriterio");
    //        KdoHideCampoPopup(e.container, "IdNivelExigencia");
    //        KdoHideCampoPopup(e.container, "Criterio");
    //        KdoHideCampoPopup(e.container, "NivelExigencia");

    //        Grid_Focus(e, "Comentario");
    //    },
    //    //DEFICNICIÓN DE LOS CAMPOS
    //    columns: [
    //        { field: "IdPiezaDesarrollada", title: "IdPiezaDesarrollada", hidden: true, menu: false },
    //        { field: "IdCriterioItem", title: "IdCriterioItem", hidden: true, menu: false },
    //        { field: "IdCriterio", title: "IdCriterio", hidden: true, menu: false },
    //        { field: "Criterio", title: "Criterio" },
    //        { field: "NivelExigencia", title: "Nivel Exigencia" },
    //        { field: "Comentario", title: "Comentario" },
    //        { field: "Cumple", title: "Cumple", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Cumple"); } },
    //        { field: "IdPerfilCriterio", title: "IdPerfilCriterio", width: 100, hidden: true },
    //        { field: "IdNivelExigencia", title: "IdNivelExigencia", hidden: true }
    //    ]
    //});

    //// FUNCIONES STANDAR PARA LA CONFIGURACION DEL gCHFor
    //SetGrid($("#gridCriteriosCriticos").data("kendoGrid"), ModoEdicion.EnLinea, true, true, true, false, redimensionable.Si, 450);
    //SetGrid_CRUD_ToolbarTop($("#gridCriteriosCriticos").data("kendoGrid"), false);
    //SetGrid_CRUD_Command($("#gridCriteriosCriticos").data("kendoGrid"), Permisos.SNEditar, false);
    //Set_Grid_DataSource($("#gridCriteriosCriticos").data("kendoGrid"), dsPiezasLaboratorio, 20);

    //var verSeteoSelrows = [];
    //$("#gridCriteriosCriticos").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
    //    Grid_SetSelectRow($("#gridCriteriosCriticos"), verSeteoSelrows);
    //});

    //$("#gridCriteriosCriticos").data("kendoGrid").bind("change", function (e) {
    //    Grid_SelectRow($("#gridCriteriosCriticos"), verSeteoSelrows);
    //});


    let ValidaFormSolicitud = $("#FrmPruebaGeneral").kendoValidator(
        {
            rules: {

                msgCliente: function (input) {
                    if (input.is("[name='CmbCliente']")) {
                        return $("#CmbCliente").data("kendoComboBox").value() > 0;
                    }
                    return true;
                }

            },
            messages: {

                msgCliente: "Debe seleccionar el cliente"

            }
        }
    ).data("kendoValidator");


    $("#GuardarSolicitud").click(function (event) {
        event.preventDefault();
        if (ValidaFormSolicitud.validate()) {
            GuardarHeaderSolicitud(UrlRD);
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }

    });
};







let getSolicitud = function () {
    kendo.ui.progress($("#vistaParcial"), true);
    $.ajax({
        url: TSM_Web_APi + "PruebasLaboratorio/" + _idPruebaLaboratorio,
        dataType: 'json',
        type: 'GET',
        async: false,
        success: function (respuesta) {
            if (respuesta !== null) {
                EstadoActual = respuesta.Estado;
                $("#NoSolicitud").data("kendoTextBox").value(respuesta.NoSolicitud);
               // $("#CmbEstado").data("kendoComboBox").value(respuesta.Estado);
                $("#FechaCreacion").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(respuesta.FechaCreacion), 'dd/MM/yyyy'));
                $("#CmbClientePrueba").data("kendoComboBox").value(respuesta.IdCliente);
                $("#CmbCalidadPrueba").data("kendoComboBox").value(respuesta.IdCalidadPrueba);
                $("#CmbNombreDiseno").data("kendoComboBox").value(respuesta.IdCatalogoDiseno);
                $("#CmbTipoOrdenTrabajo").data("kendoComboBox").value(respuesta.IdTipoOrdenTrabajo);
                $("#CmbOrigenPrueba").data("kendoComboBox").value(respuesta.IdOrigenPrueba);
                $("#NumCantLavadas").data("kendoNumericTextBox").value(respuesta.CantidadLavadas);
                $("#NumCantQuemadas").data("kendoNumericTextBox").value(respuesta.CantidadQuemadas);
                $('#SNLectura').prop('checked', respuesta.Lectura );
                $("#IdPlanta").data("kendoNumericTextBox").value(respuesta.IdPlanta);
                $("#IdTurno").data("kendoTextBox").value(respuesta.IdTurno);
                $("#IdMaquina").data("kendoNumericTextBox").value(respuesta.IdMaquina);
                $("#IdCorte").data("kendoTextBox").value(respuesta.IdCorte);
                $("#IdBulto").data("kendoTextBox").value(respuesta.IdBulto);


                kendo.ui.progress($("#vistaParcial"), false);
              //  UrlApiArteAdj = UrlApiArteAdj + "/GetVistaImagenes/" + respuesta.IdArte;
               // getAdjun(UrlApiArteAdj);
                //KdoButtonEnable($("#myBtnAdjunto"), $("#txtEstado").val() !== "ACTIVO" ? false : true);
                //$("#GridAdjuntos").data("kendoGrid").dataSource.read();

            } else {
                //LimpiarArte();
               // Fn_DibujarCarrousel($("#Mycarousel"), "", null);
                kendo.ui.progress($("#vistaParcial"), false);
             //   $("#myBtnAdjunto").data("kendoButton").enable(false);
               // $("#IdArte").val("0");
            }


         //   $("#IdRequerimiento").val() !== "0" && $("#Estado").val() === "EDICION" && $("#IdArte").val() !== "0" ? KdoButtonEnable($("#myBtnAdjunto"), $("#txtEstado").val() !== "ACTIVO" ? false : true) : $("#myBtnAdjunto").data("kendoButton").enable(false);
        },
        error: function () {
            kendo.ui.progress($("#vistaParcial"), false);
        }
    });





};




let GuardarHeaderSolicitud = function () {
    kendo.ui.progress($("#FrmPruebaGeneral"), true);

    $.ajax({
        url: TSM_Web_APi + "PruebasLaboratorio/" + _idPruebaLaboratorio,
        type: "Put",
        dataType: "json",
        data: JSON.stringify({
            IdPruebaLaboratorio: _idPruebaLaboratorio,
            IdCalidadPrueba: $("#CmbCalidadPrueba").data("kendoComboBox").value(),
            Estado: null,
            FechaCreacion: kendo.toString(kendo.parseDate($("#FechaCreacion").val()), 's'),
            CantidadLavadas: $("#NumCantLavadas").data("kendoNumericTextBox").value(),
            CantidadQuemadas: $("#NumCantQuemadas").data("kendoNumericTextBox").value(),
            IdCliente: $("#CmbClientePrueba").data("kendoComboBox").value(),
            IdOrigenPrueba: $("#CmbOrigenPrueba").data("kendoComboBox").value(),
            IdCatalogoDiseno: $("#CmbNombreDiseno").data("kendoComboBox").value(),
            IdTipoOrdenTrabajo: KdoCmbGetValue($("#CmbTipoOrdenTrabajo")),
            IdPlanta: $("#NoDocumento").val(),
            IdTurno: $("#IdSolicitudDisenoPrenda").val(),
            IdMaquina: $("#IdModulo").val(),
            IdCorte: $("#IdEjecutivoCuenta").val(),
            IdBulto: $("#UbicacionHor").val(),
            Lectura: $("#SNLectura").is(':checked'),
            NoSolicitud: $("#NoSolicitud").data("kendoTextBox").value()
           
            
            //Entidad prendas
           // IdCategoriaPrenda: $("#IdCategoriaPrenda").data("kendoMultiSelect").value().toString(),
          
            //PoseeDocumentacionAduanal: $("#swchPoseeDocumentacionAduanal").data("kendoSwitch").check(),
            
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            getSolicitud();
            console.log("success");

            //Grid_HabilitaToolbar($("#GRDimension"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            //Grid_HabilitaToolbar($("#GRReqDesColor"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            //Grid_HabilitaToolbar($("#GRReqDesTec"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            //Grid_HabilitaToolbar($("#GRReqDesFoil"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
            //Grid_HabilitaToolbar($("#GRReqDesArtSug"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);



            //habilitar botones
            //$("#myBtnAdjunto").data("kendoButton").enable(true);
            RequestEndMsg(data, "Put");
            kendo.ui.progress($("#FrmPruebaGeneral"), false);

           
        },
        error: function (data) {

            kendo.ui.progress($("#BPform"), false);
            ErrorMsg(data);
           // $("#Nombre").focus().select();
        }
    });

};



var fn_CargarInfoLaboratorio = function (vIdPruebaLaboratorio) {
    _idPiezaDesarrollada = vIdPruebaLaboratorio;
   // $("#gridEspecimen").data("kendoGrid").dataSource.read();
};