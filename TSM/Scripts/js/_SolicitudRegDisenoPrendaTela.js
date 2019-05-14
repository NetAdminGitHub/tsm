var Permisos;
$(document).ready(function () {
    var dataSourceTela = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlSdp + "/GetSolicitudesDisenoPrendaVistaByIdSolicitud/" + vIdSolicitud.toString(); },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlSdp + "/ActualizarSolicitud/" + datos.IdSolicitudDisenoPrenda + "/T"; },
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
                    EstiloDiseno: { type: "string"},
                    NombreDiseno: { type: "string" },
                    Combo: { type: "number" },
                    ColorTela: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='ColorTela']") && input.val().length > 200) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 200");
                                    return false;
                                }
                                if (input.is("[name='IdComposicionTela']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdComposicionTela").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdConstruccionTela']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdConstruccionTela").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    IdComposicionTela: { type: "string" },
                    Nombre4: { type: "string" },
                    IdConstruccionTela: { type: "string" },
                    Nombre5: { type: "string" }

                }
            }
        }
    });




    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridInfTela").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdSolicitud");
            KdoHideCampoPopup(e.container, "IdSolicitudDisenoPrenda");
            KdoHideCampoPopup(e.container, "IdCategoriaPrenda");
            KdoHideCampoPopup(e.container, "IdUbicacion");
            KdoHideCampoPopup(e.container, "Nombre4");
            KdoHideCampoPopup(e.container, "Nombre5");
            KdoHideCampoPopup(e.container, "Combo");
            KdoHideCampoPopup(e.container, "EstiloDiseno");
            TextBoxEnable($('[name="Nombre"]'), false);
            TextBoxEnable($('[name="Nombre1"]'), false);
            TextBoxEnable($('[name="EstiloDiseno"]'), false);
            TextBoxEnable($('[name="NombreDiseno"]'), false);
            KdoNumerictextboxEnable($('[name="Combo"]'), false);
            Grid_Focus(e, "ColorTela");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSolicitudDisenoPrenda", title: "Codigo Solicitud Diseño", hidden: true },
            { field: "IdSolicitud", title: "Codigo Solitud", hidden: true },
            { field: "IdCategoriaPrenda", title: "Prenda", hidden: true },
            {
                field: "Nombre", title: "Prenda", attributes: {
                    "class": "table-cell",
                    style: "background-color:rgba(0,0,0,0.10)"
                }
            },
            { field: "IdUbicacion", title: "Cod Ubicación", hidden: true },
            {
                field: "Nombre1", title: "Ubicación/Pieza",
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
            { field: "ColorTela", title: "Color Tela" },
            { field: "IdComposicionTela", title: "Composición tela", editor: Grid_Combox, values: ["IdComposicionTela", "Nombre", UrlComTel, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "Nombre4", title: "Composición tela" },
            { field: "IdConstruccionTela", title: "Construcción tela", editor: Grid_Combox, values: ["IdConstruccionTela", "Nombre", UrlConsTel, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "Nombre5", title: "Construcción tela" }

        ]
    });
    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridInfTela").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, false, redimensionable.Si);
    SetGrid_CRUD_Command($("#gridInfTela").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#gridInfTela").data("kendoGrid"), dataSourceTela);

    var selectedRows = [];
    $("#gridInfTela").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridInfTela"), selectedRows);
    });

    $("#gridInfTela").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridInfTela"), selectedRows);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridInfTela"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gridInfTela"), $(window).height() - "371");

});

fPermisos = function (datos) {
    Permisos = datos;
};