
var Permisos;
var vNoDocumento = "";
var Fila = "";
var Md = "";
let SeAdj = false;
var IdSolDisPrenda = 0;
let IdImgSolDisPrenda = 0;
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
                    Combo: { type: "number" },
                    ColorTela: {
                        type: "string",
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
                                if (input.is("[name='IdTipoMuestra']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdTipoMuestra").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdUnidadYdPzs']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidadYdPzs").data("kendoComboBox").text() === "" ? true : $("#IdUnidadYdPzs").data("kendoComboBox").selectedIndex >= 0;
                                }
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
                    ReferenciaGrafica: { type: "string" },
                    Adjunto: { type: "string" },
                    UbicacionVertical: { type: "string" },
                    UbicacionHorizontal: { type: "string" },
                    DirectorioArchivos: { type: "string" },
                    NoDocumento: { type: "string" },
                    NombreRefGrafica: { type: "string" },
                    IdTipoMuestra: { type: "string" },
                    Nombre6: { type: "string" },
                    IdTecnica: { type: "string" },
                    CantidadSTrikeOff: { type: "number" },
                    CantidadYardaPieza: { type: "number" },
                    IdUnidadYdPzs: { type: "string" },
                    Nombre7: { type: "string" },
                    Nombre11: { type: "string" },
                    IdComposicionTela: { type: "string" },
                    Nombre4: { type: "string" },
                    IdConstruccionTela: { type: "string" },
                    Nombre5: { type: "string" },            
                    NoDocSol: { type: "string" }


                }
            }
        },
        group: [{ field: "NombreDiseno", title: "Diseño" },
            { field: "Nombre11", title: "Tallas a Desarrollar" },
            { field: "Nombre", title: "Prenda" }
        ]
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridInfUbi").kendoGrid({
        dataBound: function (e) {
            let grid = this;
            grid.tbody.find("tr").mousedown("tr[role='row']", function (e) {
                if (e.which === 3) {
                    //$(this).addClass("k-state-selected");
                    let gview = $('#gridInfUbi').data("kendoGrid");
                    let selectedRow = gview.dataItem($(this));
                    IdImgSolDisPrenda = selectedRow.IdSolicitudDisenoPrenda;
                }
            });

        },
        edit: function (e) {
            KdoHideCampoPopup(e.container, "NoDocumento");
            KdoHideCampoPopup(e.container, "IdSolicitud");
            KdoHideCampoPopup(e.container, "IdSolicitudDisenoPrenda");
            KdoHideCampoPopup(e.container, "IdCategoriaPrenda");
            KdoHideCampoPopup(e.container, "IdUbicacion");
            KdoHideCampoPopup(e.container, "ReferenciaGrafica");
            KdoHideCampoPopup(e.container, "Adjunto");
            KdoHideCampoPopup(e.container, "Combo");
            KdoHideCampoPopup(e.container, "Nombre4");
            KdoHideCampoPopup(e.container, "Nombre5");
            KdoHideCampoPopup(e.container, "Nombre6");
            KdoHideCampoPopup(e.container, "Nombre7");
            KdoHideCampoPopup(e.container, "EstiloDiseno");
            KdoHideCampoPopup(e.container, "UbicacionHorizontal");
            KdoHideCampoPopup(e.container, "UbicacionVertical");
            KdoHideCampoPopup(e.container, "Nombre11");
            KdoHideCampoPopup(e.container, "NombreDiseno");
            KdoHideCampoPopup(e.container, "Nombre");
            TextBoxEnable($('[name="NoDocumento"]'), false);
            TextBoxEnable($('[name="Nombre1"]'), false);
            TextBoxEnable($('[name="EstiloDiseno"]'), false);
            KdoHideCampoPopup(e.container, "IdSolicitud");
            KdoNumerictextboxEnable($('[name="Combo"]'), false);
            $('[name="DirectorioArchivos"').attr('mayus', 'no');
            Grid_Focus(e, "UbicacionVertical");
            Md = e.model;

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

            $("#IdUnidadYdPzs").data("kendoComboBox").setDataSource(fn_DSudm(vIdServSol));

        },
        cancel: function (e) {
            if (SeAdj === true)
                this.dataSource.read();

        },
        save: function () {
            if (SeAdj === true)
                SeAdj = false;
        },
        //change: function () {
        //    var row = this.select();
        //    var id = row.data("uid");   
        //    alert(id);
        //},
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "NoDocumento", title: "No Registro Diseño", hidden: true },
            {
                field: "NombreDiseno", title: "Nombre diseño",
                attributes: {
                    "class": "table-cell",
                    style: "background-color:rgba(0,0,0,0.10)"
                }, hidden: true, menu: false
            },
            {
                field: "EstiloDiseno", title: "Estilo diseño ", attributes: {
                    "class": "table-cell",
                    style: "background-color:rgba(0,0,0,0.10)"
                }, hidden: true
            },
            {
                field: "Nombre", title: "Prenda", attributes: {
                    "class": "table-cell",
                    style: "background-color:rgba(0,0,0,0.10)"
                }, hidden: true, menu: false
            },
            {
                field: "Nombre1", title: "Parte", attributes: {
                    "class": "table-cell",
                    style: "background-color:rgba(0,0,0,0.10)"
                }
            },
            {
                template: "<div class='customer-photo'><img class='img-fluid mx-auto d-block' onerror='imgError(this)' onclick='fn_clickImg(this)' id='SDP#:data.IdSolicitudDisenoPrenda#' alt='#:data.ReferenciaGrafica#' style='max-width:50%; max-height:50%' src ='/Adjuntos/#:data.NoDocumento#/#:data.ReferenciaGrafica#'/></div>",
                field: "ReferenciaGrafica", title: "Referencia Grafica"
            },
            { field: "IdSolicitudDisenoPrenda", title: "Codigo Solicitud Diseño", hidden: true },
            { field: "IdSolicitud", title: "Codigo Solitud", hidden: true },
            { field: "IdCategoriaPrenda", title: "Prenda", hidden: true },

            { field: "IdUbicacion", title: "Prenda", hidden: true },
            {
                field: "Combo", title: "Combo", editor: Grid_ColNumeric, values: ["required", "0", "999999999", "#", 0], hidden: true,
                attributes: {
                    "class": "table-cell",
                    style: "background-color:rgba(0,0,0,0.10);text-align: right"
                }
            },
            { field: "ColorTela", title: "Color Tela" },
            { field: "IdComposicionTela", title: "Composición tela", editor: Grid_Combox, values: ["IdComposicionTela", "Nombre", UrlComTel, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "Nombre4", title: "Composición tela" },
            { field: "IdConstruccionTela", title: "Construcción tela", editor: Grid_Combox, values: ["IdConstruccionTela", "Nombre", UrlConsTel, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "Nombre5", title: "Construcción tela" },
            { field: "IdTipoMuestra", title: "Tipo de muestra", editor: Grid_Combox, values: ["IdTipoMuestra", "Nombre", UrlTm, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "Nombre6", title: "Tipo de muestras" },
            { field: "UbicacionVertical", title: "Ubicacion Vertical", editor: Grid_ColTextArea, values: ["4"], hidden: true, menu: false },
            { field: "UbicacionHorizontal", title: "Ubicacion Horizontal", editor: Grid_ColTextArea, values: ["4"], hidden: true, menu: false },
            { field: "DirectorioArchivos", title: "Directorio Archivos", editor: Grid_ColTextArea, values: ["2"] },
            { field: "IdTecnica", title: "Tecnicas", editor: EMulti_Tecnicas, values: ["Nombre", "IdTecnica", UrlTec] },
            { field: "CantidadSTrikeOff", title: "S.O", editor: Grid_ColNumeric, values: ["required", "0", "999999999", "#", 0] },
            { field: "CantidadYardaPieza", title: "Piezas O Yardas", editor: Grid_ColNumeric, values: ["required", "0", "999999999", "#", 0] },
            { field: "IdUnidadYdPzs", title: "Unidad de medida", editor: Grid_Combox, values: ["IdUnidad", "Nombre", UrlUm, "", "Seleccione....", "", "", ""], hidden: true },
            { field: "Nombre7", title: "Unidad M." },
            { field: "Referencia", title: "Referencia Grafica", editor: AdjuntoEditor, hidden: true, menu: false },
            {
                field: "NombreRefGrafica", title: " ", hidden: true, menu: false, editor: fn_BotonEliminarRG
            },
            { field: "Comentarios", title: "Comentario" },
            { field: "Nombre11", title: "Tallas a Desarrollar", hidden: true, menu: false }


        ]
    });

    //    .on('contextmenu', function (e) {
    //    // avoid the grid pager, headers and toolbar
    //    if ($(e.target).is(".k-link, .k-grid-toolbar, .k-grid-pager")) {
    //        return;
    //    }
    //    // Get the position of the Grid.
    //    var offset = $(this).find("table").offset();
    //    // Crete a textarea element which will act as a clipboard.
    //    var textarea = $("<textarea>");
    //    // Position the textarea on top of the Grid and make it transparent.
    //    textarea.css({
    //        position: 'absolute',
    //        opacity: 0,
    //        top: offset.top,
    //        left: offset.left,
    //        border: 'none',
    //        width: $(this).find("table").width(),
    //        height: $(this).find(".k-grid-content").height()
    //    })
    //        .appendTo('body')
    //        .on("click", function (e) {
    //            // in case user clicks to edit but the context menu is open and the textarea is over the grid's body
    //            textarea.remove();
    //            $(document.elementFromPoint(e.clientX, e.clientY)).click();
    //        })
    //        .on('paste', function (event) {

    //            var items = (event.clipboardData || event.originalEvent.clipboardData).items;
              

    //            console.log(JSON.stringify(items)); // will give you the mime types
    //            // find pasted image among pasted items
    //            var blob = null;
    //            for (var i = 0; i < items.length; i++) {
    //                if (items[i].type.indexOf("image") === 0) {
    //                    blob = items[i].getAsFile();
    //                }
    //            }
    //            // load image if there is a pasted image
    //            if (blob !== null) {
    //                var reader = new FileReader();
    //                reader.onload = function (event) {
    //                    //console.log(event.target.result); // data url!
    //                    document.getElementById("" + IdImgSolDisPrenda +"").src = event.target.result;
    //                };
    //                reader.readAsDataURL(blob);
    //            }
    //            textarea.remove();

    //            //setTimeout(function (){
    //            //    var value = $.trim(textarea.val());
    //            //    //var grid = $("[data-role='grid']").data("kendoGrid");
    //            //    //var rows = value.split('\n');
    //            //    //var data = [];

    //            //    //for (var i = 0; i < rows.length; i++) {
    //            //    //    var cells = rows[i].split('\t');
    //            //    //    var newItem = {
    //            //    //        ProductName: cells[0],
    //            //    //        UnitPrice: cells[1]
    //            //    //    }
    //            //    //    grid.dataSource.insert(0, newItem);
    //            //    //}

    //            //    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    //            //    console.log(JSON.stringify(items)); // will give you the mime types
    //            //    // find pasted image among pasted items
    //            //    var blob = null;
    //            //    for (var i = 0; i < items.length; i++) {
    //            //        if (items[i].type.indexOf("image") === 0) {
    //            //            blob = items[i].getAsFile();
    //            //        }
    //            //    }
    //            //    // load image if there is a pasted image
    //            //    if (blob !== null) {
    //            //        var reader = new FileReader();
    //            //        reader.onload = function (event) {
    //            //            console.log(event.target.result); // data url!
    //            //            document.getElementById("pastedImage").src = event.target.result;
    //            //        };
    //            //        reader.readAsDataURL(blob);
    //            //    }
    //            //    textarea.remove();
    //            //});
    //        }).focus();
    //});

    
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
        $("<select multiple='multiple' id='" + options.field + "' name ='" + options.field + "'/>")
            .appendTo(container)
            .kendoMultiSelect({
                dataTextField: options.values[0],
                dataValueField: options.values[1],
                dataSource: ds
            });
    }

    let fn_DSudm = function (IdServ) {
        let filtro = "";
        switch (IdServ) {
            case 1:
                filtro ="9";
                break;
            case 2:
                filtro = "9,17";
                break;
            default:
                filtro = "9,17";
                break;
        }
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

    //document.getElementById('pasteArea').onpaste = function (event) {
    //    // use event.originalEvent.clipboard for newer chrome versions
    //    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    //    console.log(JSON.stringify(items)); // will give you the mime types
    //    // find pasted image among pasted items
    //    var blob = null;
    //    for (var i = 0; i < items.length; i++) {
    //        if (items[i].type.indexOf("image") === 0) {
    //            blob = items[i].getAsFile();
    //        }
    //    }
    //    // load image if there is a pasted image
    //    if (blob !== null) {
    //        var reader = new FileReader();
    //        reader.onload = function (event) {
    //            console.log(event.target.result); // data url!
    //            document.getElementById("pastedImage").src = event.target.result;
    //        };
    //        reader.readAsDataURL(blob);
    //    }
    //}

    //$(".k-grid").on("mousedown", "tr[role='row']", function (e) {
    //    if (e.which === 3) {
    //        $(this).siblings().removeClass("k-state-selected");
    //        $(this).addClass("k-state-selected");
    //    }
    //});

});

function fn_BotonEliminarRG(container, options) {
    //container.append("<a class='k-button' id='btneref' onclick='fn_BorrarRefG()' ><span class='k-icon k-i-delete'></span></a> " + options.model.NombreRefGrafica + "");
    container.append("<a class='k-button k-button-md k-rounded-md k-button-solid k-button-solid-base' id='btneref' onclick='fn_BorrarRefG()' ><span class='k-icon k-i-delete'></span></a>");
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
    g.set("IdTipoMuestra", data.IdTipoMuestra);
    g.set("Nombre6", data.Nombre6);
    g.set("RangoTallas", data.RangoTallas);
    g.set("CantidadSTrikeOff", data.CantidadSTrikeOff);
    g.set("CantidadYardaPieza", data.CantidadYardaPieza);
    g.set("IdUnidadYdPzs", data.IdUnidadYdPzs);
    g.set("Nombre7", data.Nombre7);
    g.set("Comentarios", data.Comentarios);
    g.set("IdCategoriaTalla", data.IdCategoriaTalla);
    g.set("ColorTela", data.ColorTela);
    g.set("IdComposicionTela", data.IdComposicionTela);
    g.set("Nombre4", data.Nombre4);
    g.set("IdConstruccionTela", data.IdConstruccionTela);
    g.set("Nombre5", data.Nombre5);
};

fPermisos = function (datos) {
    Permisos = datos;
};