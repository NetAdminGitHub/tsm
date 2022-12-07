let Gdet;
let xCliente = 0;
let xPlanta = 0;
let IdCabPL = 0;
let xestado = "";

$(document).ready(function () {

    KdoButton($("#btnEtapa"), "gear");
    KdoButton($("#btnRetornar"), "arrow-left", "Regresar");
    KdoButton($("#btnCrearPL"), "plus-outline", "Crear Lista de Empaque");

    $("#dfDespacho").kendoDatePicker({ format: "dd/MM/yyyy" });

    TextBoxEnable($("#txtCliente"), false);
    TextBoxEnable($("#txtPlanta"), false);
    TextBoxEnable($("#txtOrdenDespacho"), false);
    KdoDatePikerEnable($("#dfDespacho"), false);
    fn_Get_DatosCab(xIdDespachoMercancia);
    Fn_VistaCambioEstado($("#vCambioEstado"), function () { return true; });

    $("#btnRetornar").click(function () {
        window.location = window.location.origin + `/ConsultaDespacho/${xCliente}/`;
    });

    $.ajax({
        url: TSM_Web_APi + "DespachosListaEmpaques/GetCabeceraPL/" + xIdDespachoMercancia,
        dataType: 'json',
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (respuesta) {
            if (respuesta != null)
            {
                IdCabPL = respuesta.IdDespachoListaEmpaque;
            }
        }
    });

    $.ajax({
        url: TSM_Web_APi + "DespachosListaEmpaques/" + IdCabPL,
        dataType: 'json',
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (respuesta) {
            if (respuesta != null) {
                xestado = respuesta.Estado;
                KdoButtonEnable($("#btnEtapa"), xestado === 'FINALIZADO' ? false : true);
                KdoButtonEnable($("#btnCrearPL"), xestado === 'FINALIZADO' ? false : true);
            }
        }
    });

    let dS = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "EmbalajesMercancias/GetEmbalajesFinalizadosxDespachar/" + `${xIdDespachoMercancia}` },
                contentType: "application/json; charset=utf-8"
            }
        },
        requestEnd: Grid_requestEnd,
        error: Grid_error,
        schema: {
            model: {
                id: "IdEmbalajeMercancia",
                fields: {
                    IdEmbalajeMercancia: { type: "number" },
                    UnidadEmbalaje: { type: "string" },
                    NoDocumento: { type: "string" },
                    CantidadCortes: { type: "number" },
                    CantidadTallas: { type: "number" },
                    CantidadBultos: { type: "number" },
                    Cuantia: { type: "number" },
                    Peso: { type: "number" }
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridEmbalaje").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { selectable: true, width: "35px" },
            { field: "IdEmbalajeMercancia", title: "IdEmbalajeMercancia", hidden: true },
            { field: "UnidadEmbalaje", title: "Unidad de Embalaje" },
            { field: "NoDocumento", title: "# Embalaje" },
            { field: "CantidadCortes", title: "Cantidad Cortes" },
            { field: "CantidadTallas", title: "Cantidad Tallas" },
            { field: "CantidadBultos", title: "Cantidad Bultos" },
            { field: "Cuantia", title: "Cuantía" },
            { field: "Peso", title: "Peso" },
            {
                field: "btnDet", title: "&nbsp;",
                command: {
                    name: "btnDet",
                    iconClass: "k-icon k-i-eye",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {

                        e.preventDefault();
                        let tr = $(e.target).closest("tr"); 
                        let data = this.dataItem(tr);

                        let strjson = {
                            config: [{
                                Div: "vInfEmbDes",
                                Vista: "~/Views/Shared/_InfoEmbalajeDisponibles.cshtml",
                                Js: "InfoEmbalajeDisponibles.js",
                                Titulo: "Consulta de Embalaje - Contenido de Cortes",
                                Width: "70%",
                                MinWidth: "90%",
                                Height: "90%"
                            }],
                            Param: { IdEmbalajeMercancia: data.IdEmbalajeMercancia },
                            fn: { fnclose: "", fnLoad: "fn_Ini_Info_Emb_Dis", fnReg: "fn_Reg_Info_Emb_Dis", fnActi: "" }
                        };

                        fn_GenLoadModalWindow(strjson);
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
    SetGrid($("#gridEmbalaje").data("kendoGrid"), ModoEdicion.EnPopup, true, false, false, false, redimensionable.Si, undefined, "multiple");
    SetGrid_CRUD_ToolbarTop($("#gridEmbalaje").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridEmbalaje").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridEmbalaje").data("kendoGrid"), dS);

    let dSPL = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "ListaEmpaques/ListaEmpaques_GetListaEmpaquesEncabezadoOD/" + `${IdCabPL}` },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "ListaEmpaques/" + `${datos.IdListaEmpaque}`; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    if (type === "update") {
                        return kendo.stringify({
                            IdListaEmpaque: data.IdListaEmpaque,
                            NoDocumento: data.NoDocumento,
                            Peso: data.Peso,
                            Estado: data.Estado,
                            IdUsuarioMod: getUser(),
                            Observacion: data.Observacion,
                            IdDespachoListaEmpaque: data.IdDespachoListaEmpaque,
                            IdUsuario: data.IdUsuario,
                            FechaCreacion: data.FechaCreacion
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
                id: "IdListaEmpaque",
                fields: {
                    IdListaEmpaque: { type: "number" },
                    IdDespachoListaEmpaque: { type: "number" },
                    NoDocumento: { type: "string" },
                    Observacion: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Observacion']")) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return input.val().length <= 2000 && input.val().length > 0;
                                }
                                return true;
                            }
                        }
                    },
                    FechaRegistro: { type: "date" },
                    Colaborador: { type: "string" },
                    CantidadEmbalaje: { type: "number" },
                    CantidadCortes: { type: "number" },
                    Estado: { type: "string" },
                    plSplit: { editable: false },
                    Peso: { type: "number" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    IdUsuario: { type: "string" },
                    FechaCreacion: { type: "string" },
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridPL").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdListaEmpaque");
            KdoHideCampoPopup(e.container, "IdDespachoListaEmpaque");
            KdoHideCampoPopup(e.container, "NoDocumento");
            KdoHideCampoPopup(e.container, "FechaRegistro");
            KdoHideCampoPopup(e.container, "Colaborador");
            KdoHideCampoPopup(e.container, "CantidadEmbalaje");
            KdoHideCampoPopup(e.container, "CantidadCortes");
            KdoHideCampoPopup(e.container, "Estado");
            KdoHideCampoPopup(e.container, "plSplit");
            KdoHideCampoPopup(e.container, "Peso");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuario");
            KdoHideCampoPopup(e.container, "FechaCreacion");
            Grid_Focus(e, "Observacion");
            if (!e.model.isNew()) {
                if (e.model.Estado === "FINALIZADO") {
                    TextBoxReadOnly($('[name="Observacion"]'), false);
                    $('[name="Observacion"]').css({ "background-color": "#CCCCCC" })
                    $(".k-grid-update").addClass("k-state-disabled")
                } else {
                    $(".k-grid-update").removeClass("k-state-disabled")
                }
            }
            e.container.data("kendoWindow").one("deactivate", function (e) {
                $("#gridPL").data("kendoGrid").dataSource.read();
            });
        },
        detailInit: DIPL,
        change: function (e) { $("#gridEmbalaje").data("kendoGrid").dataSource.read();  },
        //DEFINICIÓN DE LOS CAMPOS
        dataBound: function (e) {
            let gridem = this;

            gridem.table.find("tr").each(function () {
                let dataItem = gridem.dataItem(this);
                let closest = this.closest('tr');
                //Configuracion del split 
                $(this).find(".plSplit").kendoSplitButton({
                    items: [
                        {
                            id: "CambioEst" + dataItem.IdListaEmpaque,
                            text: "Cambio Estado",
                            icon: "gear",
                            click: function (e) {
                                e.preventDefault();
                                Fn_VistaCambioEstadoMostrar("ListaEmpaques", dataItem.Estado, TSM_Web_APi + "ListaEmpaques/ListaEmpaques_CambioEstado/", "", dataItem.IdListaEmpaque, undefined, function () { return fn_updGrid(); });
                            },
                            enabled: xestado === 'FINALIZADO' ? false : true

                        },
                        {
                            id: "Editar" + dataItem.IdListaEmpaque,
                            text: "Editar",
                            icon: "pencil",
                            click: function (e) {
                                e.preventDefault();
                                gridem.editRow(closest);
                            },
                            enabled: xestado === 'FINALIZADO' ? false : true
                        },
                        {
                            id: "Borrar" + dataItem.IdListaEmpaque,
                            text: "Borrar",
                            icon: "trash",
                            click: function (e) {
                                $.ajax({
                                    url: TSM_Web_APi + "ListaEmpaques/ListaEmpaques_Eliminar/" + dataItem.IdListaEmpaque,
                                    dataType: 'json',
                                    type: 'DELETE',
                                    contentType: "application/json; charset=utf-8",
                                    async: false,
                                    success: function (respuesta) {
                                        if (respuesta != null) {
                                            $("#gridEmbalaje").data("kendoGrid").dataSource.read();
                                            $("#gridPL").data("kendoGrid").dataSource.read();
                                        }
                                    }
                                });
                            },
                            enabled: xestado === 'FINALIZADO' ? false : true
                        }]

                })
            });
        },
        columns: [
            { field: "IdListaEmpaque", title: "IdListaEmpaque", hidden: true },
            { field: "IdDespachoListaEmpaque", title: "IdDespachoListaEmpaque", hidden: true },
            { field: "NoDocumento", title: "Correlativo LDE" },
            { field: "Observacion", title: "Observacion", hidden: true, editor: Grid_ColTextArea, values: ["3"] },
            { field: "FechaRegistro", title: "Fecha de Registro", format: "{0: dd/MM/yyyy}" },
            { field: "Colaborador", title: "Colaborador" },
            { field: "CantidadEmbalaje", title: "Cantidad de Embalaje" },
            { field: "CantidadCortes", title: "Cantidad de Corte" },
            { field: "Estado", title: "Estado" },
            {
                field: "plSplit",
                title: "&nbsp",
                template: "<div id='split_#= IdListaEmpaque#' class='plSplit'>Opciones</div>", width: "118px"

            },
            { field: "Peso", title: "Peso", hidden: true },
            { field: "IdUsuarioMod", title: "IdUsuarioMod", hidden: true },
            { field: "FechaMod", title: "FechaMod", hidden: true },
            { field: "IdUsuario", title: "IdUsuario", hidden: true },
            { field: "FechaCreacion", title: "FechaCreacion", hidden: true },
        ]
    });

    SetGrid($("#gridPL").data("kendoGrid"), ModoEdicion.EnPopup, true, false, false, false, redimensionable.Si, undefined, false);
    SetGrid_CRUD_Command($("#gridPL").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridPL").data("kendoGrid"), dSPL);

    $("#btnCrearPL").on("click", function () {

        let rows = [];
        let Embalajes = [];

        $.each($(".k-master-row.k-selected"), function (index, elemento) {
            rows.push(elemento);         
        });

        $.each($(rows), function (index, elemento) {
            Embalajes.push(parseInt(elemento.cells[1].innerText));
        });

        if (Embalajes.length > 0) {
            let strjson = {
                config: [{
                    Div: "vCrearPL",
                    Vista: "~/Views/Shared/_CrearPL.cshtml",
                    Js: "CrearPL.js",
                    Titulo: "Crear Lista de Empaque",
                    Width: "30%",
                    MinWidth: "30%",
                    Height: "45%"
                }],
                Param: { IdCabPL: IdCabPL, Embalajes: Embalajes },
                fn: { fnclose: "", fnLoad: "fn_Ini_create", fnReg: "fn_Reg_create", fnActi: "" }
            };

            fn_GenLoadModalWindow(strjson);
        }
        else
        {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe seleccionar al menos un embalaje.", "error");
        }

    });


});

fPermisos = function (datos) {
    Permisos = datos;

}

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

var DIPL = (e) => {

    let vidPL = e.masterRow[0].cells[1].innerText === null ? 0 : e.masterRow[0].cells[1].innerText;
    let rowId2 = e.masterRow[0].cells[1].innerText;

    let VdSDM = {
        transport: {
            read: {
                url: function () { return TSM_Web_APi + `ListaEmpaques/ListaEmpaques_GetEmbalajesEnListaEmpaqueOD/${vidPL}`; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return TSM_Web_APi + "ListaEmpaques/ListaEmpaquesDetalle_Eliminar/" + vidPL + "/" + datos.IdEmbalajeMercancia; },
                dataType: "json",
                type: "DELETE"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        requestEnd: function (e) {
            Grid_requestEnd(e);
            if (Gdet !== undefined) {
                if (Gdet.dataSource.total() === 0 && e.type === "destroy") {
                    $("#gridPL").data("kendoGrid").dataSource.read();
                    $("#gridEmbalaje").data("kendoGrid").dataSource.read();
                }
            }
        },
        error: Grid_error,
        schema: {
            model: {
                id: "IdEmbalajeMercancia",
                fields: {
                    IdEmbalajeMercancia: { type: "number" },
                    UnidadEmbalaje: { type: "string" },
                    CantidadCortes: { type: "number" },
                    CantidadTallas: { type: "number" },
                    CantidadBultos: { type: "number" },
                    Cuantia: { type: "number" },
                    Peso: { type: "number" }
                }
            }
        },
        //filter: { field: "IdListaEmpaque", operator: "eq", value: e.masterRow[0].cells[1].innerText }
    };

    let gt = $(`<div id= "gridPL${rowId2}"></div>`).appendTo(e.detailCell).kendoGrid({
        //DEFINICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdEmbalajeMercancia", title: "IdEmbalajeMercancia", hidden: true },
            { field: "UnidadEmbalaje", title: "Unidad de Embalaje" },
            { field: "CantidadCortes", title: "Cantidad Cortes" },
            { field: "CantidadTallas", title: "Cantidad Tallas" },
            { field: "CantidadBultos", title: "Cantidad Bultos" },
            { field: "Cuantia", title: "Cuantía" },
            { field: "Peso", title: "Peso" }
        ]
    });

    ConfGDetallePL(gt.data("kendoGrid"), VdSDM, "gFor_detallePL" + vidPL);

    gt.data("kendoGrid").bind("dataBound", function (e) {
        $("#gridEmbalaje").data("kendoGrid").dataSource.read();
        Gdet = gt.data("kendoGrid");
    });

    let selectedRowsTec = [];
    gt.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gt, selectedRowsTec);
    });
};

var ConfGDetallePL = (gt, ds2, Id_gCHForDetalleX) => {
    SetGrid(gt, ModoEdicion.EnPopup, false, false, false, false, redimensionable.Si, 0);
    SetGrid_CRUD_Command(gt, false, Permisos.SNBorrar, Id_gCHForDetalleX);
    Set_Grid_DataSource(gt, ds2);
}

var fn_updGrid = () => {

    $.ajax({
        url: TSM_Web_APi + "DespachosListaEmpaques/" + IdCabPL,
        dataType: 'json',
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (respuesta) {
            if (respuesta != null) {
                xestado = respuesta.Estado;
                KdoButtonEnable($("#btnEtapa"), xestado === 'FINALIZADO' ? false : true);
                KdoButtonEnable($("#btnCrearPL"), xestado === 'FINALIZADO' ? false : true);
                $("#gridPL").data("kendoGrid").dataSource.read();
            }
        }
    });
    return true;

}