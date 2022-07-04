var Permisos;
var xidClie = 0;
var xNoReferenciaCT = "";
var xNombreArchivoCT = "";
var xIdPrograma = 0;
var xIdOT = 0;
var XIdCata = 0;
let dataSource;
let obj_Pro;
let obj_OT;
let obj_Cliente;
let obj_IdCat;
let fn_GetMotivoDes = function () {
    //preparar crear datasource para obtner la tecnica filtrado por base
    return new kendo.data.DataSource({
        sort: { field: "Nombre", dir: "asc" },
        dataType: 'json',
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    async: false,
                    url: TSM_Web_APi + "MotivosDesarrollos/GetByIdServicio/1",
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    }
                });
            }
        }
    });
};

$(document).ready(function () {
    fn_getArtesAdjuntos();
    $("#btnAXaTSM").click(function () {
        $("#ModalGeneraOT_AX").data("kendoDialog").open();
        $("#CmbMotivoDes").data("kendoComboBox").setDataSource(fn_GetMotivoDes());
        KdoComboBoxEnable($("#CmbMotivoDes"), false);
        KdoButtonEnable($("#btnGenOT_AX"), false);
        KdoCmbSetValue($("#CmbMotivoDes"), "");
        KdoMultiColumnCmbSetValue($("#CmbFM"), "");
        KdoCmbSetValue($("#Cmb_Tallas"), "");
        var multicolumncombobox = $("#CmbFM").data("kendoMultiColumnComboBox");
        multicolumncombobox.dataSource.data([]);
        multicolumncombobox.focus();
    });

    $("#btnGenOT_AX").click(function () {
        fn_GenerarOT_FMAX();
    });
});

var fn_getArtesAdjuntos = function () {
    Kendo_CmbFiltrarGrid($("#CmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Selecione un cliente...");
    if (sessionStorage.CaDis_CmbCliente !== undefined && sessionStorage.CaDis_CmbCliente !== "") {
        KdoCmbSetValue($("#CmbCliente"), sessionStorage.CaDis_CmbCliente);
        obj_Cliente = sessionStorage.CaDis_CmbCliente;
    }
    Kendo_CmbFiltrarGrid($("#CmbMotivoDes"), TSM_Web_APi + "MotivosDesarrollos/GetByIdServicio/1", "Nombre", "IdMotivoDesarrollo", "Seleccione motivo desarrollo...");
  
    KdoButton($("#btnAXaTSM"), "gear", "Importar FM");
    KdoButton($("#btnGenOT_AX"), "gear", "Importar FM");


    $("#CmbPrograma").ControlSelecionProg();
    if (sessionStorage.CaDis_Pro !== undefined && sessionStorage.CaDis_Pro !== "") {
        fn_multiColumnSetJson($("#CmbPrograma"), sessionStorage.CaDis_Pro, JSON.parse(sessionStorage.CaDis_Pro).IdPrograma);
        obj_Pro = JSON.parse(sessionStorage.CaDis_Pro);
    }

    $("#CmbFM").ControlSelecionFM_AX();
    $("#CmbFmCata").CSFMCatalogo();
    if (sessionStorage.CaDis_IdCat !== undefined && sessionStorage.CaDis_IdCat !== "") {
        fn_multiColumnSetJson($("#CmbFmCata"), sessionStorage.CaDis_IdCat, JSON.parse(sessionStorage.CaDis_IdCat).IdCatalogoDiseno);
        obj_IdCat = JSON.parse(sessionStorage.CaDis_IdCat);
    }

    KdoComboBoxEnable($("#CmbMotivoDes"), false);
    KdoButtonEnable($("#btnGenOT_AX"), false);

    $("#CmbOrdenTrabajo").CatalogoOrdenesTrabajos();
    if (sessionStorage.CaDis_Ot !== undefined && sessionStorage.CaDis_Ot !== "") {
        fn_multiColumnSetJson($("#CmbOrdenTrabajo"), sessionStorage.CaDis_Ot, JSON.parse(sessionStorage.CaDis_Ot).IdOrdenTrabajo);
        obj_OT = JSON.parse(sessionStorage.CaDis_Ot);
    }

    Kendo_CmbFiltrarGrid($("#Cmb_Tallas"), TSM_Web_APi + "CategoriaTallas", "Nombre", "IdCategoriaTalla", "Selecione una talla...");
    Kendo_CmbFiltrarGrid($("#Cmb_Prenda"), TSM_Web_APi + "CategoriaPrendas", "Nombre", "IdCategoriaPrenda", "Selecione una prenda...");
    Kendo_CmbFiltrarGrid($("#Cmb_Partes"), TSM_Web_APi + "Ubicaciones", "Nombre", "IdUbicacion", "Selecione una parte de prenda...");

    KdoComboBoxEnable($("#Cmb_Tallas"), false);
    KdoComboBoxEnable($("#Cmb_Prenda"), false);
    KdoComboBoxEnable($("#Cmb_Partes"), false);

    $("#ModalGeneraOT_AX").kendoDialog({
        height: "auto",
        width: "50%",
        maxHeight: "700 px",
        title: "Generar OT desde un FM ",
        visible: false,
        closable: true,
        modal: true,
        close: function (e) {
            KdoCmbSetValue($("#CmbMotivoDes"), "");
            //KdoMultiColumnCmbSetValue($("#CmbProg"), "");
            KdoMultiColumnCmbSetValue($("#CmbFM"), "");
            KdoCmbSetValue($("#Cmb_Tallas"), "");
            KdoCmbSetValue($("#Cmb_Prenda"), "");
            KdoCmbSetValue($("#Cmb_Partes"), "");
            $("#CmbFM").data("kendoMultiColumnComboBox").dataSource.data([]);
            fn_getFM(null);
       
        }
    });

    dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    kendo.ui.progress($(document.body), true);
                    return TSM_Web_APi + "CatalogoDisenos/GetCatalogoDisenoConsulta/" + xidClie.toString() + "/" + xIdPrograma.toString() + "/" + xIdOT.toString() + "/" + XIdCata.toString();
                },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            }
        },
        pageSize: 20
    });

    dataSource.read();

    $("#pager").kendoPager({
        dataSource: dataSource,
        input: true,
        pageSizes: [20, 50, 100, "all"]
    });

     ValidarFrmGeneraOT_FMAX = $("#FrmGeneraOTAX").kendoValidator(
        {
            rules: {
                MsgDesarrollo: function (input) {
                    if (input.is("[name='CmbMotivoDes']")) {
                        return $("#CmbMotivoDes").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgTalla: function (input) {
                    if (input.is("[name='Cmb_Tallas']")) {
                        return $("#Cmb_Tallas").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgPrenda: function (input) {
                    if (input.is("[name='Cmb_Prenda']")) {
                        return $("#Cmb_Prenda").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgPartes: function (input) {
                    if (input.is("[name='Cmb_Partes']")) {
                        return $("#Cmb_Partes").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                }
            },
            messages: {
                MsgDesarrollo: "Requerido",
                MsgPro: "Requerido",
                MsgTalla: "Requerido",
                MsgPrenda: "Requerido",
                MsgPartes: "Requerido"
            }
        }).data("kendoValidator");


    dataSource.fetch(function () {
       
        dataSource.page(1);
        var view = dataSource.view();
        fn_DibujarCatalogo(view);
        kendo.ui.progress($(document.body), false);
    });


    dataSource.bind("change", function () {
        var view = dataSource.view();
        fn_DibujarCatalogo(view);
        kendo.ui.progress($(document.body), false);
        KdoCmbGetValue($("#CmbCliente")) === null ? KdoButtonEnable($("#btnAXaTSM"), false) : KdoButtonEnable($("#btnAXaTSM"), true);
    });

   
    $("#CmbCliente").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xidClie = 0;
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            dataSource.read();
            sessionStorage.setItem("CaDis_CmbCliente", "");
        } else {
            xidClie = value;
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            dataSource.read();
            sessionStorage.setItem("CaDis_CmbCliente", value);
        }
    });


    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
        if (data === undefined) {
            xidClie = KdoCmbGetValue($("#CmbCliente")) === null ? 0 : KdoCmbGetValue($("#CmbCliente"));
            xIdPrograma = 0;
            xIdOT = KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")) == null ? 0 : KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo"));
            dataSource.read();
            sessionStorage.setItem('CaDis_Pro', "");
        } else {
            KdoCmbSetValue($("#CmbCliente"), data.IdCliente);
            sessionStorage.setItem("CaDis_CmbCliente", data.IdCliente);
            xIdPrograma = data.IdPrograma;
            xidClie = data.IdCliente;
            xIdOT = KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")) == null ? 0 : KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo"));;
            dataSource.read();
            sessionStorage.setItem('CaDis_Pro', JSON.stringify(data.toJSON()));
        }

    });

    $("#CmbFM").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            fn_getFM(this.dataItem(e.item.index()));
        } else {
            fn_getFM(null);
        }
    });

    $("#CmbFM").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbFM").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.CODIGODISENO === this.value());
        if (data === undefined) {
            fn_getFM(null);
        }

    });

   

    $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdOrdenTrabajo === Number(this.value()));
        if (data === undefined) {
            xidClie = KdoCmbGetValue($("#CmbCliente")) === null ? 0 : KdoCmbGetValue($("#CmbCliente"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdOT = 0;
            dataSource.read();
            sessionStorage.setItem('CaDis_Ot', "");

        } else {

            KdoCmbSetValue($("#CmbCliente"), data.IdCliente);
            if (KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null) { fn_SetValueMulticolumIdPrograma($("#CmbPrograma"), data.IdPrograma); }
            sessionStorage.setItem("CaDis_CmbCliente", data.IdCliente);
            xIdPrograma = data.IdPrograma;
            xidClie = data.IdCliente;
            xIdOT = data.IdOrdenTrabajo;
            kdoChkSetValue($("#CmbCliente"), xIdOT);
            dataSource.read();
            sessionStorage.setItem('CaDis_Ot', JSON.stringify(data.toJSON()));
            

        }

    });

 

    $("#CmbFmCata").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbFmCata").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdCatalogoDiseno === Number(this.value()));
        if (data === undefined) {
            xidClie = KdoCmbGetValue($("#CmbCliente")) === null ? 0 : KdoCmbGetValue($("#CmbCliente"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdOT = 0;
            XIdCata = 0;
            dataSource.read();
            sessionStorage.setItem('CaDis_IdCat', "");
        } else {
            KdoCmbSetValue($("#CmbCliente"), data.IdCliente);
            if (KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null) { fn_SetValueMulticolumIdPrograma($("#CmbPrograma"), data.IdPrograma);}
            sessionStorage.setItem("CaDis_CmbCliente", data.IdCliente);
            xidClie = data.IdCliente;
            xIdPrograma = 0;
            xIdOT = 0;
            XIdCata = data.IdCatalogoDiseno;
            dataSource.read();
            sessionStorage.setItem('CaDis_IdCat', JSON.stringify(data.toJSON()));
        }

    });


    if (obj_Cliente !== undefined || obj_Pro !== undefined || obj_OT !== undefined || obj_IdCat===undefined ) {
        xidClie = obj_Cliente === "" || obj_Cliente === undefined ? 0 : obj_Cliente;
        xIdPrograma = obj_Pro === "" || obj_Pro === undefined ? 0 : obj_Pro.IdPrograma;
        xIdOT = obj_OT === "" || obj_OT === undefined ? 0 : obj_OT.IdOrdenTrabajo;
        XIdCata = obj_IdCat === "" || obj_IdCat === undefined ? 0 : obj_IdCat.IdCatalogoDiseno;
        dataSource.read();
    }

    $("#CmbCliente").data("kendoComboBox").focus()
};

var fn_DibujarCatalogo = function (data) {

    let Pn = $("#RowPn31");
    Pn.children().remove();

   
    $.each(data, function (index, elemento) {

        Pn.append('<div class="k-card">' +
            '<div class= "k-card-header" >' +
            '<h5 class="k-card-title">' + elemento.NombreDiseno + '</h5>' +
            '<h6 class="k-card-subtitle">Estilo: ' + elemento.EstiloDiseno + '</h6>' +
            '</div >' +
            '<img class="k-card-image"  id="Img_' + elemento.IdCatalogoDiseno + '" src="/Adjuntos/' + elemento.NoReferencia + '/' + elemento.NombreArchivo + '" onerror="imgError(this)" onclick="fn_click_Imagen(this)" />' +
            '<div class="k-card-body">' +
            '<p>Numero:' + elemento.NumeroDiseno + '</p>' +
            '<p>Archivo:' + elemento.NombreArchivo + '</p>' +
            '<p>#:' + elemento.NoReferencia + '</p>' +
            '</div>' +
            '<div class="k-card-footer">' +
            '<a class="k-button k-flat k-button-icon" onClick="fn_CargarModal(' + elemento.IdCatalogoDiseno + ',' + elemento.IdArte + ')"><span class="k-icon k-i-search" ></span></a>' +
            '</div>' +
            '</div >');
    });
};


var fn_CargarModal = function (xIdCatalogoDiseno, xIdArte) {
  
    fn_ConsultarCatalogoDisenoInf("ModalCDinf", xIdCatalogoDiseno === null ? 0 : xIdCatalogoDiseno, xIdArte === null ? 0 : xIdArte,function () { fn_CloseInf();});
};

var fn_CloseInf = function () {
    $("#tab_inf").data("kendoTabStrip").select(0);
    $("#gConOT").data("kendoGrid").dataSource.read("[]");
};

$.fn.extend({
    CatalogoOrdenesTrabajos: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "NoDocumento",
                dataValueField: "IdOrdenTrabajo",
                filter: "contains",
                autoBind: false,
                //minLength: 3,
                height: 400,
                placeholder: "Selección de Ordenes de trabajo",
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function () { return TSM_Web_APi + "CatalogoDisenos/GetCatalogoDisenoOrdenesTrabajos/" + (KdoCmbGetValue($("#CmbCliente")) === null ? 0 : KdoCmbGetValue($("#CmbCliente"))) + "/" + (KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"))); },
                            contentType: "application/json; charset=utf-8"
                        }
                    }

                },
                columns: [
                    { field: "NoDocumento", title: "Orden Trabajo", width: 100 },
                    { field: "NoDocReq", title: "Requerimiento", width: 100 },
                    { field: "Nombre", title: "Nombre del Diseño", width: 200 },
                    { field: "NumeroDiseno", title: "Numero de Diseño", width: 100 },
                    { field: "EstiloDiseno", title: "Estilo Diseño", width: 200 }

                ]
            });
        });
    }
});

$.fn.extend({
    ControlSelecionFM_AX: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "CODIGODISENO",
                dataValueField: "CODIGODISENO",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                placeholder: "Seleccione un FM",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "CatalogoDisenos/GetCatalogoDiseno_FM_AX/" + (KdoCmbGetValue($("#CmbCliente")) === null ? 0 : KdoCmbGetValue($("#CmbCliente"))); },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "CODIGODISENO", title: "Código de Diseño", width: 100 },
                    { field: "CODIGOPROGRAMA", title: "Código de Programa", width: 100 },
                    { field: "NOMBREPROGRAMA", title: "Nombre de Programa", width: 250 },
                    { field: "CODIGOPROGRAMA", title: "Código de Programa", width: 100 },
                    { field: "NOMBREDISENO", title: "Nombre Diseño", width: 200 },
                    { field: "ESTILODISENO", title: "Estilo Diseño", width: 150 },
                    { field: "NUMERODISENOCLIENTE", title: "Numero Diseño", width: 150 },
                    { field: "PRENDADISENO", title: "Prenda", width: 200 },
                    { field: "PARTEDISENO", title: "Parte", width: 200 },
                    { field: "TALLAS", title: "Tallas", width: 200 }
                ]
            });
        });
    }
});

$.fn.extend({
    ControlSelecionProg: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Nombre",
                dataValueField: "IdPrograma",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                placeholder: "Selección de Programas",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "Programas/GetProgramasFiltroCliente/" + (KdoCmbGetValue($("#CmbCliente")) === null ? 0 : KdoCmbGetValue($("#CmbCliente"))); },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "NoDocumento", title: "NoDocumento", width: 150 },
                    { field: "Nombre", title: "Programa", width: 300 },
                    { field: "NombreTemporada", title: "Temporada", width: 300 }
                ]
            });
        });
    }
});

$.fn.extend({
    CSFMCatalogo: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "NoReferencia",
                dataValueField: "IdCatalogoDiseno",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                placeholder: "Selección de FM",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "CatalogoDisenos/GetbyidClienteIdPrograma/" + (KdoCmbGetValue($("#CmbCliente")) == null ? 0 : KdoCmbGetValue($("#CmbCliente"))) + "/" + (KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"))); },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "NoReferencia", title: "No FM", width: 300 },
                    { field: "Nombre", title: "Nombre", width: 300 },
                    { field: "NombreCliente", title: "Cliente", width: 300 }
                ]
            });
        });
    }
});

let fn_getFM = function (g) {
    if (g !== null) {
        $("#TxtNomDisOT").val(g.NOMBREDISENO);
        $("#TxtEstiloDisenoOT").val(g.ESTILODISENO);
        $("#txtNumDisenoOT").val(g.NUMERODISENOCLIENTE);
        $("#TxtTallas").val(g.TALLAS);
        $("#TxtPrenda").val(g.PRENDADISENO);
        $("#TxtParte").val(g.PARTEDISENO);
        $("#TxtPrograma").val(g.CODIGOPROGRAMA + " " + g.NOMBREPROGRAMA);
        $("#TxtFecha").val(kendo.toString(kendo.parseDate(g.FECHADISENO), 'dd/MM/yyyy'));
        KdoComboBoxEnable($("#CmbMotivoDes"), true);
        KdoComboBoxEnable($("#Cmb_Tallas"), true);
        KdoComboBoxEnable($("#Cmb_Prenda"), true);
        KdoComboBoxEnable($("#Cmb_Partes"), true);
        KdoButtonEnable($("#btnGenOT_AX"), true);

    } else {
        $("#TxtNomDisOT").val("");
        $("#TxtEstiloDisenoOT").val("");
        $("#txtNumDisenoOT").val("");
        $("#TxtTallas").val("");
        $("#TxtPrograma").val("");
        $("#TxtFecha").val("");
        $("#TxtPrenda").val("");
        $("#TxtParte").val("");
        //KdoMultiColumnCmbEnable($("#CmbProg"), false);
        KdoComboBoxEnable($("#CmbMotivoDes"), false);
        KdoComboBoxEnable($("#Cmb_Tallas"), false);
        KdoComboBoxEnable($("#Cmb_Prenda"), false);
        KdoComboBoxEnable($("#Cmb_Partes"), false);
        KdoButtonEnable($("#btnGenOT_AX"), false);
        KdoComboBoxEnable($("#Cmb_Prenda"), false);
        KdoComboBoxEnable($("#Cmb_Partes"), false);
        KdoCmbSetValue($("#CmbMotivoDes"), "");
        //KdoMultiColumnCmbSetValue($("#CmbProg"), "");
        KdoCmbSetValue($("#Cmb_Tallas"), "");
    }

};

let fn_GenerarOT_FMAX= function () {
    if (ValidarFrmGeneraOT_FMAX.validate()) {
        // obtener indice de la etapa siguiente

   
        kendo.ui.progress($(".k-dialog"), true);
        $.ajax({
            url: TSM_Web_APi + "CatalogoDisenos/GenerarOrdenTrabajoCatalogo_FMAX",
            method: "POST",
            dataType: "json",
            data: JSON.stringify({
                codigoDiseno: KdoMultiColumnCmbGetValue($("#CmbFM")).toString(),
                //idPrograma: KdoMultiColumnCmbGetValue($("#CmbProg")).toString(),
                IdServicio: 1,
                idMotivoDesarrollo: KdoCmbGetValue($("#CmbMotivoDes")).toString(),
                idCategoriaTalla: KdoCmbGetValue($("#Cmb_Tallas")).toString(),
                RutaArchivo: RutaFisicaAdj,
                idCategoriaPrenda: KdoCmbGetValue($("#Cmb_Prenda")).toString(),
                idUbicacion: KdoCmbGetValue($("#Cmb_Partes")).toString()
            }),
            contentType: "application/json; charset=utf-8",
            success: function (datos) {
                RequestEndMsg(datos, "Post");
                $("#ModalGeneraOT_AX").data("kendoDialog").close();
                dataSource.read();
            },
            error: function (data) {
                ErrorMsg(data);
            },
            complete: function () {
                kendo.ui.progress($(".k-dialog"), false);
            }
        });
    } else {
        $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
    }
};

// obtiene el programa y el resultado se lo paso al source del objeto para encontrar el valor
let fn_SetValueMulticolumIdPrograma = (e, id) => {
    $.ajax({
        url: TSM_Web_APi + "Programas/GetProgramasbyId/" + id.toString(),
        type: 'GET',
        dataType: "json",
        success: function (data) {
            fn_multiColumnSetJson(e, JSON.stringify(data[0]), id);
            sessionStorage.setItem('CaDis_Pro', JSON.stringify(data[0]));
        }
    });
}

// obtiene la orden de trabajo y el resultado se lo paso al source del objeto para encontrar el valor
let fn_SetValueMulticolumIdOT = (e, id) => {
    $.ajax({
        url: TSM_Web_APi + "Programas/GetProgramasbyId/" + id.toString(),
        type: 'GET',
        dataType: "json",
        success: function (data) {
            fn_multiColumnSetJson(e, JSON.stringify(data[0]), id);
            sessionStorage.setItem('CaDis_Pro', JSON.stringify(data[0]));
        }
    });
}

fPermisos = function (datos) {
    Permisos = datos;
};