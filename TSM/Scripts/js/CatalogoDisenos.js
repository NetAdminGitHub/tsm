var Permisos;
var xidClie = 0;
var xNoReferenciaCT = "";
var xNombreArchivoCT = "";
var xIdPrograma = 0;
var xIdOT = 0;
let dataSource
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
        KdoMultiColumnCmbEnable($("#CmbProg"), false);
        KdoComboBoxEnable($("#CmbMotivoDes"), false);
        KdoButtonEnable($("#btnGenOT_AX"), false);
        KdoCmbSetValue($("#CmbMotivoDes"), "");
        KdoMultiColumnCmbSetValue($("#CmbProg"), "");
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
    KdoCmbSetValue($("#CmbCliente"), sessionStorage.getItem("CatalogoDisenos_CmbCliente") === null ? "" : sessionStorage.getItem("CatalogoDisenos_CmbCliente")); 
    Kendo_CmbFiltrarGrid($("#CmbMotivoDes"), TSM_Web_APi + "MotivosDesarrollos/GetByIdServicio/1", "Nombre", "IdMotivoDesarrollo", "Seleccione motivo desarrollo...");
  
    KdoButton($("#btnAXaTSM"), "gear", "Importar FM");
    KdoButton($("#btnGenOT_AX"), "gear", "Importar FM");


    $("#CmbPrograma").ControlSelecionPrograma();
    $("#CmbProg").ControlSelecionProg();
    $("#CmbFM").ControlSelecionFM_AX();

    KdoMultiColumnCmbEnable($("#CmbProg"), false);
    KdoComboBoxEnable($("#CmbMotivoDes"), false);
    KdoButtonEnable($("#btnGenOT_AX"), false);

    KdoMultiColumnCmbSetValue($("#CmbPrograma"), sessionStorage.getItem("CatalogoDisenos_CmbPrograma") === null ? "" : sessionStorage.getItem("CatalogoDisenos_CmbPrograma")); 

    $("#CmbOrdenTrabajo").CatalogoOrdenesTrabajos();
    KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), sessionStorage.getItem("CatalogoDisenos_CmbOrdenTrabajo") === null ? "" : sessionStorage.getItem("CatalogoDisenos_CmbOrdenTrabajo"));
    Kendo_CmbFiltrarGrid($("#Cmb_Tallas"), TSM_Web_APi + "CategoriaTallas", "Nombre", "IdCategoriaTalla", "Selecione una talla...");
    KdoComboBoxEnable($("#Cmb_Tallas"), false);

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
            KdoMultiColumnCmbSetValue($("#CmbProg"), "");
            KdoMultiColumnCmbSetValue($("#CmbFM"), "");
            KdoCmbSetValue($("#Cmb_Tallas"), "");
            $("#CmbFM").data("kendoMultiColumnComboBox").dataSource.data([]);
            fn_getFM(null);
       
        }
    });

    dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    kendo.ui.progress($(document.body), true);
                    return TSM_Web_APi + "CatalogoDisenos/GetCatalogoDisenoConsulta/" + xidClie.toString() + "/" + xIdPrograma.toString() + "/" + xIdOT.toString();
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
                MsgPro: function (input) {
                    if (input.is("[name='CmbProg']")) {
                        return $("#CmbProg").data("kendoMultiColumnComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                MsgTalla: function (input) {
                    if (input.is("[name='Cmb_Tallas']")) {
                        return $("#Cmb_Tallas").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                }
            },
            messages: {
                MsgDesarrollo: "Requerido",
                MsgPro: "Requerido",
                MsgTalla: "Requerido"
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

    $("#CmbCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            xidClie = this.dataItem(e.item.index()).IdCliente;
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            dataSource.read();
            sessionStorage.setItem("CatalogoDisenos_CmbCliente", this.dataItem(e.item.index()).IdCliente);
        }
        else {
            xidClie = 0;
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            dataSource.read();
            sessionStorage.setItem("CatalogoDisenos_CmbCliente", "");
        }
    });

    $("#CmbCliente").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            xidClie = 0;
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            dataSource.read();
            sessionStorage.setItem("CatalogoDisenos_CmbCliente", "");
        }
    });

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            KdoCmbSetValue($("#CmbCliente"), this.dataItem(e.item.index()).IdCliente);
            xIdPrograma = this.dataItem(e.item.index()).IdPrograma;
            xidClie = this.dataItem(e.item.index()).IdCliente;
            dataSource.read();
            sessionStorage.setItem("CatalogoDisenos_CmbPrograma", this.dataItem(e.item.index()).IdPrograma);

        } else {
            xidClie = KdoCmbGetValue($("#CmbCliente")) === null ? 0 : KdoCmbGetValue($("#CmbCliente"));
            xIdPrograma = 0;
            dataSource.read();
            sessionStorage.setItem("CatalogoDisenos_CmbPrograma", "");
        }
    });

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
        if (data === undefined) {
            xidClie = KdoCmbGetValue($("#CmbCliente")) === null ? 0 : KdoCmbGetValue($("#CmbCliente"));
            xIdPrograma = 0;
            dataSource.read();
            sessionStorage.setItem("CatalogoDisenos_CmbPrograma", "");
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

    $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            KdoCmbSetValue($("#CmbCliente"), this.dataItem(e.item.index()).IdCliente);
            KdoMultiColumnCmbSetValue($("#CmbPrograma"), this.dataItem(e.item.index()).IdPrograma);
            xIdPrograma = this.dataItem(e.item.index()).IdPrograma;
            xidClie = this.dataItem(e.item.index()).IdCliente;
            xIdOT = this.dataItem(e.item.index()).IdOrdenTrabajo;
            dataSource.read();
            sessionStorage.setItem("CatalogoDisenos_CmbOrdenTrabajo", this.dataItem(e.item.index()).IdOrdenTrabajo);

        } else {
            xidClie = KdoCmbGetValue($("#CmbCliente")) === null ? 0 : KdoCmbGetValue($("#CmbCliente"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdOT = 0;
            dataSource.read();
            sessionStorage.setItem("CatalogoDisenos_CmbOrdenTrabajo", "");
        }
    });

    $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
        if (data === undefined) {
            xidClie = KdoCmbGetValue($("#CmbCliente")) === null ? 0 : KdoCmbGetValue($("#CmbCliente"));
            xIdPrograma = KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"));
            xIdOT = 0;
            dataSource.read();
            sessionStorage.setItem("CatalogoDisenos_CmbOrdenTrabajo", "");
        }

    });

    if (sessionStorage.getItem("CatalogoDisenos_CmbCliente") !== null || sessionStorage.getItem("CatalogoDisenos_CmbPrograma") !== null || sessionStorage.getItem("CatalogoDisenos_CmbOrdenTrabajo") !== null) {
        xidClie = sessionStorage.getItem("CatalogoDisenos_CmbCliente") === "" || sessionStorage.getItem("CatalogoDisenos_CmbCliente") === null ? 0 : sessionStorage.getItem("CatalogoDisenos_CmbCliente");
        xIdPrograma = sessionStorage.getItem("CatalogoDisenos_CmbPrograma") === "" || sessionStorage.getItem("CatalogoDisenos_CmbPrograma") === null ? 0 : sessionStorage.getItem("CatalogoDisenos_CmbPrograma");
        xIdOT = sessionStorage.getItem("CatalogoDisenos_CmbOrdenTrabajo") === "" || sessionStorage.getItem("CatalogoDisenos_CmbOrdenTrabajo") === null ? 0 : sessionStorage.getItem("CatalogoDisenos_CmbOrdenTrabajo");
    }
};

var fn_DibujarCatalogo = function (data) {

    let Pn = $("#RowPn31");
    Pn.children().remove();

    //$.each(data, function (index, elemento) {
    
    //    Pn.append('<div class="d-flex align-items-stretch col-lg-2">' +
    //        '<a href="#" class= "card rounded-0 w-100 bg-white mb-4" onClick="fn_CargarModal(this)" id="CCD-' + index.toString() +"-" + elemento.IdCatalogoDiseno + '" data-NombreDis="' + elemento.NombreDiseno + '">' +
    //        '<p></p>' +
    //        '<div class="card-block text-center ">' +
    //        '<h4 class="card-title font-weight-bold">' + elemento.NombreDiseno + '</h4>' +
    //        '<p class="card-subtitle">' + elemento.EstiloDiseno + '</p>' +
    //        '<p class="card-text">' + elemento.NumeroDiseno + '</p>' +
    //        '</div>' +
    //        '<p></p>'+
    //        '<img class="card-img-top img-responsive w-75 " src="/Adjuntos/' + elemento.NoReferencia + '/' + elemento.NombreArchivo + '" onerror="imgError(this)" alt="Card image cap">' +
    //        '</a>' +
    //        '</div');

    //    $("#CCD-" + index.toString() + "-" + elemento.IdCatalogoDiseno + "").data("IdCatalogoDiseno", elemento.IdCatalogoDiseno === null ? 0 : elemento.IdCatalogoDiseno);
    //    $("#CCD-" + index.toString() + "-" + elemento.IdCatalogoDiseno + "").data("IdArte", elemento.IdArte === null ? 0 : elemento.IdArte);
    //});


    $.each(data, function (index, elemento) {

        Pn.append('<div class="k-card">' +
            '<div class= "k-card-header" >' +
            '<h5 class="k-card-title">' + elemento.NombreDiseno + '</h5>' +
            '<h6 class="k-card-subtitle">Estilo: ' + elemento.EstiloDiseno + '</h6>' +
            '</div >' +
            '<img class="k-card-image"  src="/Adjuntos/' + elemento.NoReferencia + '/' + elemento.NombreArchivo + '" onerror="imgError(this)" />' +
            '<div class="k-card-body">' +
            '<p>Numero:' + elemento.NumeroDiseno + '</p>' +
            '<p>Archivo:' + elemento.NombreArchivo + '</p>' +
            '<p>#:' + elemento.NoReferencia + '</p>' +
            '</div>' +
            '<div class="k-card-footer">' +
            '<a class="k-button k-flat k-button-icon" onClick="fn_CargarModal(' + elemento.IdCatalogoDiseno + ',' + elemento.IdArte + ')"><span class="k-icon k-i-search" ></span></a>' +
            '</div>' +
            '</div >');

        //$("#CCD-" + index.toString() + "-" + elemento.IdCatalogoDiseno + "").data("IdCatalogoDiseno", elemento.IdCatalogoDiseno === null ? 0 : elemento.IdCatalogoDiseno);
        //$("#CCD-" + index.toString() + "-" + elemento.IdCatalogoDiseno + "").data("IdArte", elemento.IdArte === null ? 0 : elemento.IdArte);
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
                    { field: "NUMERODISENOCLIENTE", title: "Numero Diseño", width: 150 }
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
                            url: function (datos) { return TSM_Web_APi + "Programas/GetByCliente/" + (KdoCmbGetValue($("#CmbCliente")) === null ? 0 : KdoCmbGetValue($("#CmbCliente"))); },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "NoDocumento", title: "NoDocumento", width: 150 },
                    { field: "Nombre", title: "Programa", width: 300 },
                    { field: "Nombre1", title: "Temporada", width: 300 }
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
        $("#TxtPrograma").val(g.CODIGOPROGRAMA + " " + g.NOMBREPROGRAMA);
        $("#TxtFecha").val(kendo.toString(kendo.parseDate(g.FECHADISENO), 'dd/MM/yyyy'));
        KdoMultiColumnCmbEnable($("#CmbProg"), true);
        KdoComboBoxEnable($("#CmbMotivoDes"), true);
        KdoComboBoxEnable($("#Cmb_Tallas"), true);
        KdoButtonEnable($("#btnGenOT_AX"), true);

    } else {
        $("#TxtNomDisOT").val("");
        $("#TxtEstiloDisenoOT").val("");
        $("#txtNumDisenoOT").val("");
        $("#TxtTallas").val("");
        $("#TxtPrograma").val("");
        $("#TxtFecha").val("");
        KdoMultiColumnCmbEnable($("#CmbProg"), false);
        KdoComboBoxEnable($("#CmbMotivoDes"), false);
        KdoComboBoxEnable($("#Cmb_Tallas"), false);
        KdoButtonEnable($("#btnGenOT_AX"), false);
        KdoCmbSetValue($("#CmbMotivoDes"), "");
        KdoMultiColumnCmbSetValue($("#CmbProg"), "");
        KdoCmbSetValue($("#Cmb_Tallas"), "");
    }

};

let fn_GenerarOT_FMAX= function () {
    if (ValidarFrmGeneraOT_FMAX.validate()) {
        // obtener indice de la etapa siguiente
        kendo.ui.progress($(".k-dialog"), true);
        $.ajax({
            url: TSM_Web_APi + "CatalogoDisenos/GenerarOrdenTrabajoCatalogo_FMAX/" + KdoMultiColumnCmbGetValue($("#CmbFM")).toString() + "/" + KdoMultiColumnCmbGetValue($("#CmbProg")).toString() + "/1/" + KdoCmbGetValue($("#CmbMotivoDes")).toString() + "/" + KdoCmbGetValue($("#Cmb_Tallas")).toString() ,
            method: "POST",
            dataType: "json",
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

fPermisos = function (datos) {
    Permisos = datos;
};