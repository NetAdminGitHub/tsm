﻿var Permisos;
$(document).ready(function () {
    var dataSource = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlSdp + "/GetSolicitudesDisenoPrendaVistaByIdSolicitud/" + vIdSolicitud.toString(); },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlSdp + "/ActualizarSolicitud/" + datos.IdSolicitudDisenoPrenda + "/P"; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlSdp + "/" + datos.IdSolicitudDisenoPrenda; },
                dataType: "json",
                type: "DELETE"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdSolicitudDisenoPrenda",
                fields: {
                    IdSolicitudDisenoPrenda: { type: "number" },
                    IdSolicitud: { type: "number" },
                    IdCategoriaPrenda: { type: "number" },
                    Nombre: { type: "string" },
                    IdUbicacion: { type: "number" },
                    Nombre1: { type: "string" },
                    EstiloDiseno: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='EstiloDiseno']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='NombreDiseno']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='IdTemporada']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdTemporada").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdPrograma']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdPrograma").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdMotivoDesarrollo']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdMotivoDesarrollo").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdPrioridadOrdenTrabajo']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdPrioridadOrdenTrabajo").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    NombreDiseno: {
                        type: "string", validation: {
                            required: true
                        }
                    },
                    IdTemporada: { type: "string" },
                    Nombre2: { type: "string" },
                    IdPrograma: { type: "string" },
                    Nombre3: { type: "string" },
                    Combo: { type: "number" },
                    IdMotivoDesarrollo: { type: "string" },
                    Nombre9: { type: "string" },
                    IdPrioridadOrdenTrabajo: { type: "string" },
                    Nombre10: { type: "string" }


                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridInfPieza").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdSolicitud");
            KdoHideCampoPopup(e.container, "IdSolicitudDisenoPrenda");
            KdoHideCampoPopup(e.container, "IdCategoriaPrenda");
            KdoHideCampoPopup(e.container, "IdUbicacion");
            KdoHideCampoPopup(e.container, "Nombre2");
            KdoHideCampoPopup(e.container, "Nombre3");
            KdoHideCampoPopup(e.container, "Nombre9");
            KdoHideCampoPopup(e.container, "Nombre10");
            TextBoxEnable($('[name="Nombre"]'), false);
            TextBoxEnable($('[name="Nombre1"]'), false);
            $("[name='IdPrograma']").data("kendoComboBox").setDataSource(fn_getDsPro());
            $("[name='IdMotivoDesarrollo']").data("kendoComboBox").setDataSource(fn_getMd());
            Grid_Focus(e, "IdMotivoDesarrollo");
     
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSolicitudDisenoPrenda", title: "Codigo Solicitud Diseño", hidden: true },
            { field: "IdSolicitud", title: "Código Solitud", hidden: true },
            { field: "IdCategoriaPrenda", title: "Prenda", hidden: true },
            {
                field: "Nombre", title: "Prenda", attributes: {
                    "class": "table-cell",
                    style: "background-color:rgba(0,0,0,0.10)"
                }
            },
            { field: "IdUbicacion", title: "Cod. Ubicación", hidden: true },
            {
                field: "Nombre1", title: "Ubicación/Pieza",
                attributes: {
                    "class": "table-cell",
                    style: "background-color:rgba(0,0,0,0.10)"
                }
            },
            { field: "IdMotivoDesarrollo", title: "Código motivo desarrollo", editor: Grid_Combox, values: ["IdMotivoDesarrollo", "Nombre", UrlMd, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "Nombre9", title: "Motivo de desarrollo" },
            { field: "IdPrioridadOrdenTrabajo", title: "Prioridad", editor: Grid_Combox, values: ["IdPrioridadOrdenTrabajo", "Nombre", UrlPot, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "Nombre10", title: "Prioridad" },
            { field: "EstiloDiseno", title: "Estilo diseño " },
            { field: "NombreDiseno", title: "Nombre diseño " },
            { field: "IdTemporada", title: "Temporada", editor: Grid_Combox, values: ["IdTemporada", "Nombre", UrlTem, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "Nombre2", title: "Temporada" },
            { field: "IdPrograma", title: "Programa", editor: Grid_Combox, values: ["IdPrograma", "Nombre", UrlPro, "", "Seleccione....", "required", "IdTemporada", "Requerido"], hidden: true },
            { field: "Nombre3", title: "Programa" },
            {
                field: "Combo", title: "Combo", editor: Grid_ColNumeric, values: ["required", "0", "999999999", "#", 0],
                attributes: {
                    "class": "table-cell",
                    style: "text-align: right"
                }
            }

        ]
    });
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridInfPieza").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, false, redimensionable.Si);
    SetGrid_CRUD_Command($("#gridInfPieza").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#gridInfPieza").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#gridInfPieza").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridInfPieza"), selectedRows);
    });

    $("#gridInfPieza").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridInfPieza"), selectedRows);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridInfPieza"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gridInfPieza"), $(window).height() - "371");

    let grid1 = $("#gridInfPieza").data("kendoGrid");
    $(grid1.element).kendoDraggable({
        filter: "tbody > tr",
        cursorOffset: {
            top: 10,
            left: 10
        },
        hint: function (e) {
            let item = $('<div class="k-grid k-widget" style="background-color: DarkOrange; color: black;"><table><tbody><tr>' + e.html() + '</tr></tbody></table></div>');
            return item;
        },
        group: "gridGroup"
    });

    $(grid1.element).kendoDropTarget({
        drop: function (e) {
            e.draggable.hint.hide();
            var target = grid1.dataSource.getByUid($(e.draggable.currentTarget).data("uid")),
                dest = $(e.target);
                //dest = $(document.elementFromPoint(e.clientX, e.clientY));
            if (dest.is("th") || dest.is("thead") || dest.is("span") || dest.parent().is("th")) {
                return;
            }
            //en caso que contenga imagen
            else if (dest.is("img")) {
                dest = grid1.dataSource.getByUid(dest.parent().parent().data("uid"));
            }
            else {
                dest = grid1.dataSource.getByUid(dest.parent().data("uid"));
            }
            if (dest !== undefined) {
                Fn_UpdFilaGrid(grid1.dataItem("tr[data-uid='" + dest.uid + "']"), target);
                grid1.saveChanges();
            }

        },
        group: "gridGroup"
    });

});

let Fn_UpdFilaGrid = function (g, data) {
    g.set("IdMotivoDesarrollo", data.IdMotivoDesarrollo);
    g.set("Nombre9", data.Nombre9);
    g.set("IdPrioridadOrdenTrabajo", data.IdPrioridadOrdenTrabajo);
    g.set("Nombre10", data.Nombre10);
    g.set("EstiloDiseno", data.EstiloDiseno);
    g.set("NombreDiseno", data.NombreDiseno);
    g.set("IdTemporada", data.IdTemporada);
    g.set("Nombre2", data.Nombre2);
    g.set("IdPrograma", data.IdPrograma);
    g.set("Nombre3", data.Nombre3);
    g.set("Combo", data.Combo);
};


var fn_getDsPro = function () {
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: UrlPro + "/GetByCliente/" + KdoCmbGetValue($("#CmbCli")),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

var fn_getMd = function () {
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: UrlMd + "/GetMotivosDesarrolloVistasByIdTipoOrdenTrabajo/" + KdoCmbGetValue($("#CmbTipoOT")),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

let Fn_GetRow = function (ds, IdCategoriaPrenda) {
    var dset = JSON.parse(JSON.stringify(ds)).filter(function (entry) {
        return entry.IdMotivoDesarrollo !== null;
    });
    return dset.length - 1 < 0 ? null : dset[dset.length - 1];
};



fPermisos = function (datos) {
    Permisos = datos;
};