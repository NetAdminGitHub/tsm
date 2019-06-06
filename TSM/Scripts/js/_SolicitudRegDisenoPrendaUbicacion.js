

var Permisos;
var vNoDocumento = "";
var Fila = "";
var Md = "";
let SeAdj = false;
$(document).ready(function () {

    var dataSourceUbi = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlSdp + "/GetSolicitudesDisenoPrendaVistaByIdSolicitud/" + vIdSolicitud.toString(); },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlSdp + "/ActualizarSolicitud/" + datos.IdSolicitudDisenoPrenda + "/U"; },
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
                    Combo: {
                        type: "number",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='UbicacionVertical']") && input.val().length > 2000) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 2000");
                                    return false;
                                }
                                if (input.is("[name='UbicacionHorizontal']") && input.val().length > 2000) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 2000");
                                    return false;
                                }
                                if (input.is("[name='DirectorioArchivos']") && input.val().length > 2000) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 2000");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    ReferenciaGrafica: { type: "string" },
                    Adjunto: { type: "string" },
                    UbicacionVertical: { type: "string" },
                    UbicacionHorizontal: { type: "string" },
                    DirectorioArchivos: { type: "string" },
                    NoDocumento: { type: "string" },
                    NombreRefGrafica: { type: "string" }


                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridInfUbi").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdSolicitud");
            KdoHideCampoPopup(e.container, "IdSolicitudDisenoPrenda");
            KdoHideCampoPopup(e.container, "IdCategoriaPrenda");
            KdoHideCampoPopup(e.container, "IdUbicacion");
            KdoHideCampoPopup(e.container, "ReferenciaGrafica");
            KdoHideCampoPopup(e.container, "Adjunto");
            KdoHideCampoPopup(e.container, "Combo");
            KdoHideCampoPopup(e.container, "EstiloDiseno");
            TextBoxEnable($('[name="NoDocumento"]'), false);
            TextBoxEnable($('[name="Nombre"]'), false);
            TextBoxEnable($('[name="Nombre1"]'), false);
            TextBoxEnable($('[name="EstiloDiseno"]'), false);
            TextBoxEnable($('[name="NombreDiseno"]'), false);
            //TextBoxEnable($('[name="NombreRefGrafica"]'), false);
            KdoNumerictextboxEnable($('[name="Combo"]'), false);
            $('[name="DirectorioArchivos"').attr('mayus', 'no');
            Grid_Focus(e, "UbicacionVertical");
            Md = e.model;

        },
        cancel: function (e) {
            if (SeAdj === true)
                this.dataSource.read();

        },
        save: function () {
            if (SeAdj === true)
                SeAdj = false;
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "NoDocumento", title: "No Registro Diseño", hidden: true },
            {
                template: "<div class='customer-photo'><img class='img-fluid mx-auto d-block' onerror='imgError(this)' onclick='fn_clickImg(this)' id='SDP#:data.IdSolicitudDisenoPrenda#' alt='#:data.ReferenciaGrafica#' style='max-width:50%; max-height:50%' src ='/Adjuntos/#:data.NoDocumento#/#:data.ReferenciaGrafica#'/></div>",
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
            { field: "IdUbicacion", title: "Prenda", hidden: true },
            {
                field: "Nombre1", title: "Ubicacion/Pieza", attributes: {
                    "class": "table-cell",
                    style: "background-color:rgba(0,0,0,0.10)"
                }
            },
            {
                field: "EstiloDiseno", title: "Estilo diseño ", attributes: {
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
                field: "NombreDiseno", title: "Nombre diseño",
                attributes: {
                    "class": "table-cell",
                    style: "background-color:rgba(0,0,0,0.10)"
                }
            },
            { field: "UbicacionVertical", title: "Ubicacion Vertical", editor: Grid_ColTextArea, values:["4"]},
            { field: "UbicacionHorizontal", title: "Ubicacion Horizontal", editor: Grid_ColTextArea, values: ["4"] },
            { field: "DirectorioArchivos", title: "Directorio Archivos", editor: Grid_ColTextArea, values: ["2"]},
            { field: "Referencia", title: "Referencia Grafica", editor: AdjuntoEditor, hidden: true, menu: false },
            {
                field: "NombreRefGrafica", title: " ", hidden: true, menu: false, editor: fn_BotonEliminarRG
            }


        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridInfUbi").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, false, redimensionable.Si);
    SetGrid_CRUD_Command($("#gridInfUbi").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#gridInfUbi").data("kendoGrid"), dataSourceUbi);

    var selectedRows = [];
    $("#gridInfUbi").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridInfUbi"), selectedRows);
    });

    $("#gridInfUbi").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridInfUbi"), selectedRows);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridInfUbi"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gridInfUbi"), $(window).height() - "371");

    let grid1 = $("#gridInfUbi").data("kendoGrid");
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
                Fn_UpdFilaGridUbi(grid1.dataItem("tr[data-uid='" + dest.uid + "']"), target);
                grid1.saveChanges();
            }

        },
        group: "gridGroup"
    });

});

function fn_BotonEliminarRG(container, options) {

    container.append("<a class='k-button' id='btneref' onclick='fn_BorrarRefG()' ><span class='k-icon k-i-delete'></span></a> " + options.model.NombreRefGrafica + "");
}
function AdjuntoEditor(container, options) {
    Fila = options.model;
    $('<input type="file" id="Adjunto" name="Adjunto" />')
        .appendTo(container)
        .kendoUpload({
            async: {
                saveUrl: "/Solicitudes/SubirArchivo",
                autoUpload: true,
                type: "post"
            },
            localization: {
                select: '<div class="k-icon k-i-attachment-45"></div>&nbsp;Adjuntar referencia grafica'
            },
            upload: function (e) {
                e.sender.options.async.saveUrl = "/Solicitudes/SubirArchivo/" + options.model.NoDocumento;
            },
            showFileList: false,
            success: function (e) {
                if (e.operation === "upload") {
                    GuardarNombreAdj(Fila, e.files[0].name);
                }
            }
        });
}

function GuardarNombreAdj(row, NameRef) {

    $.ajax({
        url: UrlSdp + "/ActualizarSolicitud/" + row.IdSolicitudDisenoPrenda + "/A",
        type: "Put",
        dataType: "json",
        data: JSON.stringify({
            IdSolicitudDisenoPrenda: row.IdSolicitudDisenoPrenda,
            Combo: row.Combo,
            CantidadSTrikeOff: row.CantidadSTrikeOff,
            CantidadYardaPieza: row.CantidadYardaPieza,
            IdUbicacion: row.IdUbicacion,
            Estado: row.Estado,
            IdSolicitud: row.IdSolicitud,
            IdUsuarioMod: row.IdUsuarioMod,
            FechaMod: row.FechaMod,
            IdCategoriaPrenda: row.IdCategoriaPrenda,
            ReferenciaGrafica: NameRef
        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $('[name="ReferenciaGrafica"]').val(data[0].ReferenciaGrafica);
            $('[name="ReferenciaGrafica"]').trigger("change");
            $('[name="NombreRefGrafica"]').val(data[0].ReferenciaGrafica);
            $('[name="NombreRefGrafica"]').trigger("change");
            SeAdj = true;
            RequestEndMsg(data, "PUT");
        },
        error: function (data) {
            ErrorMsg(data);
        }
    });
}

function LimpiaMarcaCelda() {
    $(".k-dirty-cell", $("#gridInfUbi")).removeClass("k-dirty-cell");
    $(".k-dirty", $("#gridInfUbi")).remove();
}

function fn_BorrarRefG() {
    var eliminado = false;
    $.ajax({
        url: "/Solicitudes/BorrarArchivo",
        type: "post",
        data: { id: Md.NoDocumento, fileName: Md.NombreRefGrafica },
        async: false,
        success: function (data) {
            if (data.Resultado === true) {
                GuardarNombreAdj(Md, "");
            }
        },
        error: function (data) {
            eliminado = false;
        }
    });
    return eliminado;
}

let Fn_UpdFilaGridUbi = function (g, data) {
    g.set("UbicacionVertical", data.UbicacionVertical);
    g.set("UbicacionHorizontal", data.UbicacionHorizontal);
    g.set("DirectorioArchivos", data.DirectorioArchivos);
};

fPermisos = function (datos) {
    Permisos = datos;
};