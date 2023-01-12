let Gdet;
let xCliente = 0;
let xPlanta = 0;
let xidDM = 0;

$(document).ready(function () {

    KdoButton($("#btnEtapa"), "gear");
    KdoButton($("#btnRetornar"), "arrow-left", "Regresar");
    KdoButton($("#btnSaveNR"), "plus-outline", "Guardar Información");

    $("#dfDespacho").kendoDatePicker({ format: "dd/MM/yyyy" });

    TextBoxEnable($("#txtCliente"), false);
    TextBoxEnable($("#txtDireccion"), false);
    TextBoxEnable($("#txtOrdenDespacho"), false);
    KdoDatePikerEnable($("#dfDespacho"), false);
    fn_Get_DatosCab(xIdDespachoMercancia);
    Fn_VistaCambioEstado($("#vCambioEstado"), function () { return true; });

    xidDM = xIdDespachoMercancia;

    $("#btnRetornar").click(function () {
        window.location = window.location.origin + `/ConsultaDespacho/${xCliente}/`;
    });

    $("#btnEtapa").click(function () {

        let IdOD = xidDM;

        $.ajax({
            url: TSM_Web_APi + "DespachosMercancias/GetEtapaOD/" + IdOD,
            dataType: 'json',
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (respuesta) {
                EtapaActual = respuesta.IdEtapaProceso;
                NombreEtapaActual = respuesta.NombreEtapa;
            }
        });

        let strjson = {
            config: [{
                Div: "vCambioEtapa",
                Vista: "~/Views/Shared/_CambioEtapa.cshtml",
                Js: "CambioEtapa.js",
                Titulo: "Cambio Etapa",
                Width: "20%",
                MinWidth: "20%",
                Height: "45%"
            }],
            Param: { IdEtapaActual: EtapaActual, IdDespachoMercancia: IdOD, NombreEtapaActual: NombreEtapaActual },
            fn: { fnclose: "fn_NR_Actualizar", fnLoad: "fn_Ini_ConsultaEtapa", fnReg: "fn_con_ConsultaEtapa", fnActi: "" }
        };

        fn_GenLoadModalWindow(strjson);

    });

    ////////////////////////////////////////////NOTA REMISIÓN/////////////////////////////////////////////
    let dSNR = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "NotaRemision/GetNotaRemision/" + `${xidDM}` },
                contentType: "application/json; charset=utf-8"
            }
        },
        requestEnd: Grid_requestEnd,
        error: Grid_error,
        schema: {
            model: {
                id: "IdNotaRemision",
                fields: {
                    IdNotaRemision: { type: "number" },
                    FechaCreacion: { type: "string" },
                    NoReferencia: { type: "string" },
                    NoDocumento: { type: "string" },
                    Serie: { type: "string" },
                    Cantidad: { type: "number" },
                    Unidad: { type: "string" },
                    PrecioUnitario: { type: "number" },
                    Bultos: { type: "number" },
                    Peso: { type: "number" },
                    Placa: { type: "string" },
                    Modalidad: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    IdUsuario: { type: "string" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridNR").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdNotaRemision", title: "IdNotaRemision", hidden: true },
            { field: "FechaCreacion", title: "FechaCreacion" },
            { field: "NoReferencia", title: "ID NR" },
            { field: "NoDocumento", title: "No de NR" },
            { field: "Serie", title: "Serie" },
            { field: "Cantidad", title: "Cantidad" },
            { field: "Unidad", title: "Unidad" },
            { field: "PrecioUnitario", title: "Precio Unitario" },
            { field: "Bultos", title: "Bultos" },
            { field: "Peso", title: "Peso" },
            { field: "Placa", title: "Placa" },
            { field: "Modalidad", title: "Modalidad" },
            {
                field: "btnPrint", title: "&nbsp;",
                command: {
                    name: "btnPrint",
                    iconClass: "k-icon k-i-print",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {

                    }
                },
                width: "70px",
                attributes: {
                    style: "text-align: center"
                }
            }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridNR").data("kendoGrid"), ModoEdicion.EnPopup, true, false, false, false, redimensionable.Si, undefined, false);
    SetGrid_CRUD_ToolbarTop($("#gridNR").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridNR").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridNR").data("kendoGrid"), dSNR);
    /////////////////////////////////////////////FIN NOTA REMISIÓN//////////////////////////////////////////

    /////////////////////////////////////////DETALLE NOTA REMISIÓN//////////////////////////////////////////
    let dSDNR = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "NotaRemisionDetalle/GetNotaRemisionDetalle/" + `${IdNotaRemision}` },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "NotaRemisionDetalle/" + `${datos.IdListaEmpaque}`; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    if (type === "update") {
                        return kendo.stringify({
                            IdNotaRemisionDetalle: data.IdNotaRemisionDetalle,
                            IdNotaRemision: data.IdNotaRemision,
                            Bultos: data.Bultos,
                            Unidad: data.Unidad,
                            Cantidad: data.Cantidad,
                            Descripcion: data.Descripcion,
                            PrecioUnitario: data.PrecioUnitario,
                            VentasGravadas: data.VentasGravadas,
                            IdUsuarioMod: getUser()
                        });
                    } else {
                        return kendo.stringify(data);
                    }

                }
            }
        },
        requestEnd: Grid_requestEnd,
        error: Grid_error,
        schema: {
            model: {
                id: "IdNotaRemisionDetalle",
                fields: {
                    IdNotaRemisionDetalle: { type: "number" },
                    IdNotaRemision: { type: "number" },
                    Bultos: { type: "number" },
                    Unidad: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Descripcion']")) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return input.val().length <= 200 && input.val().length > 0;
                                }
                                return true;
                            }
                        }
                    },
                    Cantidad: { type: "number" },
                    Descripcion: { type: "string" },
                    PrecioUnitario: { type: "number" },
                    VentasGravadas: { type: "number" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridNRD").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdNotaRemisionDetalle");
            KdoHideCampoPopup(e.container, "IdNotaRemision");
            KdoHideCampoPopup(e.container, "Bultos");
            KdoHideCampoPopup(e.container, "Unidad");
            KdoHideCampoPopup(e.container, "Cantidad");
            KdoHideCampoPopup(e.container, "PrecioUnitario");
            KdoHideCampoPopup(e.container, "VentasGravadas");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            Grid_Focus(e, "Descripcion");
            if (!e.model.isNew()) {
                if (e.model.Estado === "FINALIZADO") {
                    TextBoxReadOnly($('[name="Descripcion"]'), false);
                    $('[name="Descripcion"]').css({ "background-color": "#CCCCCC" })
                    $(".k-grid-update").addClass("k-state-disabled")
                } else {
                    $(".k-grid-update").removeClass("k-state-disabled")
                }
            }
            e.container.data("kendoWindow").one("deactivate", function (e) {
                $("#gridNRD").data("kendoGrid").dataSource.read();
            });
        },
        detailInit: DIPL,
        //change: function (e) { $("#gridEmbalaje").data("kendoGrid").dataSource.read(); },
        //DEFINICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdNotaRemisionDetalle", title: "IdNotaRemisionDetalle", hidden: true },
            { field: "IdNotaRemision", title: "IdNotaRemision", hidden: true },
            { field: "Bultos", title: "Bultos" },
            { field: "Unidad", title: "Unidad" },
            { field: "Cantidad", title: "Cantidad" },
            { field: "Descripcion", title: "Descripcion", hidden: true, editor: Grid_ColTextArea, values: ["3"] },
            { field: "PrecioUnitario", title: "Precio Unitario" },
            { field: "VentasGravadas", title: "Ventas Gravadas" },
            { field: "CantidadCortes", title: "Cantidad de Corte" },
            { field: "Estado", title: "Estado" },
            {
                field: "btnEditDes", title: "&nbsp;",
                command: {
                    name: "btnEditDes",
                    iconClass: "k-icon k-i-pencil",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {

                    }
                },
                width: "70px",
                attributes: {
                    style: "text-align: center"
                }
            },
            { field: "IdUsuarioMod", title: "IdUsuarioMod", hidden: true },
            { field: "FechaMod", title: "FechaMod", hidden: true }
        ]
    });

    SetGrid($("#gridNRD").data("kendoGrid"), ModoEdicion.EnPopup, true, false, false, false, redimensionable.Si, undefined, false);
    SetGrid_CRUD_Command($("#gridNRD").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridNRD").data("kendoGrid"), dSDNR);
    /////////////////////////////////////////FIN DETALLE NOTA REMISIÓN//////////////////////////////////////

    /////////////////////////////////////////DETALLE ADICIONAL//////////////////////////////////////////
    let dSDNR = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "NotaRemisionDetalleAdicional/GetNotaRemisionDetalleAdicional/" + `${IdNotaRemision}` },
                contentType: "application/json; charset=utf-8"
            }
        },
        requestEnd: Grid_requestEnd,
        error: Grid_error,
        schema: {
            model: {
                //id: "IdNotaRemisionDetalle",
                fields: {
                    DMIngreso: { type: "string" },
                    Items: { type: "number" },
                    NRIngreso: { type: "string" },
                    FechaIngreso: { type: "date" },
                    FM: { type: "string" },
                    Diseño: { type: "string" },
                    Precio: { type: "number" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridDAPL").kendoGrid({
        detailInit: DIPL,
        columns: [
            { field: "DMIngreso", title: "DM Ingreso" },
            { field: "Items", title: "Items" },
            { field: "NRIngreso", title: "NR Ingreso" },
            { field: "FechaIngreso", title: "Fecha Ingreso" },
            { field: "FM", title: "FM" },
            { field: "Diseño", title: "Diseño" },
            { field: "Precio", title: "Precio" }
        ]
    });

    SetGrid($("#gridDAPL").data("kendoGrid"), ModoEdicion.EnPopup, true, false, false, false, redimensionable.Si, undefined, false);
    SetGrid_CRUD_Command($("#gridDAPL").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridDAPL").data("kendoGrid"), dSDNR);
    /////////////////////////////////////////FIN DETALLE ADICIONAL//////////////////////////////////////

});

let fn_Get_DatosCab = (IdOD) => {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "DespachosEmbalajesMercancias/GetDatosCab/" + `${IdOD}`,
        dataType: 'json',
        type: 'GET',
        async: false,
        success: function (dato) {
            if (dato !== null) {
                xCliente = dato.IdCliente;
                xPlanta = dato.IdPlanta;
                $("#txtCliente").val(dato.NombreCliente);
                $("#txtPlanta").val(dato.NombrePlanta);
                $("#txtNoDoc").val(dato.IdDespachoEmbalajeMercancia);
                $("#txtOrdenDespacho").val(dato.NoDocumento);
                $("#txtIdDespachoMerc").val(dato.IdDespachoMercancia);
                $("#dfDespacho").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(dato.FechaEntrega), 'dd/MM/yyyy'));

            }
            kendo.ui.progress($(document.body), false);
        },
        error: function () {
            kendo.ui.progress($(document.body), false);
        }
    });

};

var fn_NR_Actualizar = () => {
    if (cambioSuccess === 1) {
        window.location = window.location.origin + `/ConsultaDespacho/${xCliente}/`;
    }
}