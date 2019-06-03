var Permisos;
var IdSolDisPrenda = 0;

$(document).ready(function () {
    var dataSourceMue = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlSdp + "/GetSolicitudesDisenoPrendaVistaByIdSolicitud/" + vIdSolicitud.toString(); },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlSdp + "/ActualizarSolicitud/" + datos.IdSolicitudDisenoPrenda + "/M"; },
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
                    EstiloDiseno: { type: "string" },
                    NombreDiseno: { type: "string" },
                    RangoTallas: {
                        type: "string", validation: { required: true }
                    },
                    Combo: {
                        type: "number",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdTipoMuestra']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdTipoMuestra").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdUnidadYdPzs']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidadYdPzs").data("kendoComboBox").text() === "" ? true : $("#IdUnidadYdPzs").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdCategoriaTalla']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdCategoriaTalla").data("kendoComboBox").text() === "" ? true : $("#IdCategoriaTalla").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='RangoTallas']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    ReferenciaGrafica: { type: "string" },
                    IdTipoMuestra: { type: "string" },
                    Nombre6: { type: "string" },
                    IdTecnica: { type: "string" },
                    CantidadSTrikeOff: { type: "number" },
                    CantidadYardaPieza: { type: "number" },
                    IdUnidadYdPzs: { type: "string"},
                    Nombre7: { type: "string" },
                    NoDocumento: { type: "string" } ,
                    IdCategoriaTalla: { type: "string" },
                    Nombre11: {type :"string"}


                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridInfMue").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdSolicitud");
            KdoHideCampoPopup(e.container, "IdSolicitudDisenoPrenda");
            KdoHideCampoPopup(e.container, "IdCategoriaPrenda");
            KdoHideCampoPopup(e.container, "IdUbicacion");
            KdoHideCampoPopup(e.container, "Nombre4");
            KdoHideCampoPopup(e.container, "Nombre6");
            KdoHideCampoPopup(e.container, "Nombre5");
            KdoHideCampoPopup(e.container, "Nombre7");
            KdoHideCampoPopup(e.container, "Nombre11");
            KdoHideCampoPopup(e.container, "Combo");
            KdoHideCampoPopup(e.container, "EstiloDiseno");
            KdoHideCampoPopup(e.container, "ReferenciaGrafica");
            TextBoxEnable($('[name="NoDocumento"]'), false);
            TextBoxEnable($('[name="Nombre"]'), false);
            TextBoxEnable($('[name="Nombre1"]'), false);
            TextBoxEnable($('[name="EstiloDiseno"]'), false);
            TextBoxEnable($('[name="NombreDiseno"]'), false);
            KdoNumerictextboxEnable($('[name="Combo"]'), false);
            Grid_Focus(e, "IdTipoMuestra");

            IdSolDisPrenda = e.model.IdSolicitudDisenoPrenda;
            getSdpmMultiSelec();
            $("#IdTecnica").data("kendoMultiSelect").bind("deselect", function (e) {
                kendo.ui.progress($("#body"), true);
                url = UrlSdpt + "/" + IdSolDisPrenda.toString() + "/" + e.dataItem.IdTecnica;
                $.ajax({
                    url: url,//
                    type: "Delete",
                    dataType: "json",
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        RequestEndMsg(data, "Delete");
                        kendo.ui.progress($("#body"), false);
                    },
                    error: function (data) {
                        kendo.ui.progress($("#body"), false);
                        ErrorMsg(data);
                    }
                });


            });

            $("#IdTecnica").data("kendoMultiSelect").bind("select", function (e) {
                kendo.ui.progress($("#body"), true);
                //var item = e.item;
                $.ajax({
                    url: UrlSdpt,//
                    type: "Post",
                    dataType: "json",
                    data: JSON.stringify({
                        IdSolicitudDisenoPrenda: IdSolDisPrenda,
                        IdTecnica: e.dataItem.IdTecnica
                    }),
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        RequestEndMsg(data, "Post");
                        kendo.ui.progress($("#body"), false);
                    },
                    error: function (data) {
                        getSdpmMultiSelec();
                        kendo.ui.progress($("#body"), false);
                        ErrorMsg(data);
                    }
                });
            });

            $("#IdUnidadYdPzs").data("kendoComboBox").setDataSource(fn_DSudm("9,17"));

        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "NoDocumento", title: "No Registro Diseño", hidden: true },
            {
                template: "<div class='customer-photo'><img class='img-fluid mx-auto d-block' onerror='imgError(this)' onclick='fn_clickImg(this)' id='SDP#:data.IdSolicitudDisenoPrenda#' alt='#:data.ReferenciaGrafica#' style='max-width:70%; max-height: 70%' src ='/Adjuntos/#:data.NoDocumento#/#:data.ReferenciaGrafica#'/></div>",
                field: "ReferenciaGrafica", title: "Referencia Grafica"
            },
            { field: "IdSolicitudDisenoPrenda", title: "Codigo Solicitud Diseño", hidden: true },
            { field: "IdSolicitud", title: "Codigo Solitud", hidden: true },
            { field: "IdCategoriaPrenda", title: "Prenda", hidden: true },
            {
                field: "Nombre", title: "Prenda", attributes: {
                    "class": "table-cell",
                    style: "background-color:rgba(0,0,0,0.10)"
                }
            },
            { field: "IdUbicacion", title: "Cod. Ubicación", hidden: true },
            {
                field: "Nombre1", title: "Ubicacion/Pieza",
                attributes: {
                    "class": "table-cell",
                    style: "background-color:rgba(0,0,0,0.10)"
                }
            },
            {
                field: "EstiloDiseno", title: "Estilo diseño ",
                attributes: {
                    "class": "table-cell",
                    style: "background-color:rgba(0,0,0,0.10)"
                }
            },
            {
                field: "Combo", title: "Combo", editor: Grid_ColNumeric, values: ["required", "0", "999999999", "#", 0],
                attributes: {
                    "class": "table-cell",
                    style: "background-color:rgba(0,0,0,0.10);text-align: right"
                }
            },
            {
                field: "NombreDiseno", title: "Nombre diseño ",
                attributes: {
                    "class": "table-cell",
                    style: "background-color:rgba(0,0,0,0.10)"
                }
            },
            { field: "IdTipoMuestra", title: "Tipo de muestra", editor: Grid_Combox, values: ["IdTipoMuestra", "Nombre", UrlTm, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "Nombre6", title: "Tipo de muestras" },
            { field: "RangoTallas", title: "Rango de Tallas" },
            { field: "IdCategoriaTalla", title: "Talla a desarrollar", editor: Grid_Combox, values: ["IdCategoriaTalla", "Nombre", UrlCata, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "Nombre11", title: "Talla a desarrollar" },
            { field: "IdTecnica", title: "Tecnicas", editor: EMulti_Tecnicas, values: ["Nombre", "IdTecnica", UrlTec] },
            { field: "CantidadSTrikeOff", title: "STrike Off", editor: Grid_ColNumeric, values: ["required", "0", "999999999", "#", 0] },
            { field: "CantidadYardaPieza", title: "Piezas / Yardas", editor: Grid_ColNumeric, values: ["required", "0", "999999999", "#", 0] },
            { field: "IdUnidadYdPzs", title: "Unidad de medida", editor: Grid_Combox, values: ["IdUnidad", "Nombre", UrlUm, "", "Seleccione....", "", "", ""], hidden: true },
            { field: "Nombre7", title: "Unidad de medida" },
            { field: "Comentarios", title: "Comentarios" }


        ]
    });
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridInfMue").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, false, redimensionable.Si);
    SetGrid_CRUD_Command($("#gridInfMue").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#gridInfMue").data("kendoGrid"), dataSourceMue);


    var selectedRows = [];
    $("#gridInfMue").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridInfMue"), selectedRows);
    });
    $("#gridInfMue").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridInfMue"), selectedRows);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridInfMue"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gridInfMue"), $(window).height() - "371");

    let grid1 = $("#gridInfMue").data("kendoGrid");
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
                Fn_UpdFilaGridMue(grid1.dataItem("tr[data-uid='" + dest.uid + "']"), target);
                grid1.saveChanges();
            }

        },
        group: "gridGroup"
    });
    //#region CRUD Prendas multi select

    function getSdpmMultiSelec() {
        kendo.ui.progress($("#splitter"), true);
        $.ajax({
            url: UrlSdpt + "/" + IdSolDisPrenda.toString(),
            dataType: 'json',
            type: 'GET',
            success: function (respuesta) {
                var lista = "";
                $.each(respuesta, function (index, elemento) {
                    lista = lista + elemento.IdTecnica + ",";
                });
                $("#IdTecnica").data("kendoMultiSelect").value(lista.split(","));
                kendo.ui.progress($("#splitter"), false);
            },
            error: function (data) {
                kendo.ui.progress($("#splitter"), false);
            }
        });



    }

    function EMulti_Tecnicas(container, options) {

        var ds = new kendo.data.DataSource({
            dataType: "json",
            transport: {
                read: {
                    url: options.values[2] + "/GetbyServicio/" + vIdServSol

                }
            }
        });
        $("<select multiple='multiple' id='" + options.field + "' name ='"+ options.field +"'/>")
            .appendTo(container)
            .kendoMultiSelect({
                dataTextField: options.values[0],
                dataValueField: options.values[1],
                dataSource: ds
            });
    }

    let fn_DSudm = function (filtro) {

        return new kendo.data.DataSource({
            dataType: 'json',
            sort: { field: "Nombre", dir: "asc" },
            transport: {
                read: function (datos) {
                    $.ajax({
                        dataType: 'json',
                        type: "POST",
                        async: false,
                        url: TSM_Web_APi + "UnidadesMedidas/GetUnidadesMedidasByFiltro",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(filtro),
                        success: function (result) {
                            datos.success(result);

                        }
                    });
                }
            }
        });
    };
    //#endregion Fin Prendas multi select

});

let Fn_UpdFilaGridMue = function (g, data) {
    g.set("IdTipoMuestra", data.IdTipoMuestra);
    g.set("Nombre6", data.Nombre6);
    g.set("RangoTallas", data.RangoTallas);
    g.set("CantidadSTrikeOff", data.CantidadSTrikeOff);
    g.set("CantidadYardaPieza", data.CantidadYardaPieza);
    g.set("IdUnidadYdPzs", data.IdUnidadYdPzs);
    g.set("Nombre7", data.Nombre7);
    g.set("Comentarios", data.Comentarios);
    g.set("IdCategoriaTalla", data.IdCategoriaTalla);
};

fPermisos = function (datos) {
    Permisos = datos;
};