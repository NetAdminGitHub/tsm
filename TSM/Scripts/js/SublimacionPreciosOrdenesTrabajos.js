
let UrlClie = TSM_Web_APi + "Clientes";
var Permisos;
let VIdCliente = 0;
let data;
let xIdReqDes = 0;
//variables para mostrar los historicos
let xIdReqChis = 0;
let xIdCatPrendaChis = 0;
let xIdUbiChis = 0;
$(document).ready(function () {

    Kendo_CmbFiltrarGrid($("#CmbIdCliente"), UrlClie, "Nombre", "IdCliente", "Selecione un Cliente...");
    KdoCmbSetValue($("#CmbIdCliente"), "");
    KdoButton($("#btnCambioEstado"), "gear", "Cambiar estado");
    KdoButton($("#btnRefrescar"), "reload", "Actualizar");
    KdoButton($("#btnEditarOT"), "unlock", "Editar OT histórica");
    KdoButton($("#btnAceptarCambiar"), "check", "Cambiar Estado");
    KdoButton($("#btnCambiarPrecioApro"), "check", "Aceptar");
    KdoButtonEnable($("#btnCambioEstado"), fn_SNCambiarEstados(false));
    KdoButtonEnable($("#btnRefrescar"), false);
    KdoButtonEnable($("#btnEditarOT"), fn_SNCambiarEstados(false));
    KdoButton($("#btnConsular"), "search", "Consultar");
    KdoButton($("#btnGuardar"), "save", "Guardar Comentario");
    $("#TxtMotivo").autogrow({ vertical: true, horizontal: false, flickering: false });

    KdoMultiSelectDatos($("#CmbMultiComboNoDocmuento"), "[]", "NoDocumento", "IdRequerimiento", "Seleccione ...", 100, true);
    Kendo_CmbFiltrarGrid($("#cmbEstados"), TSM_Web_APi +"EstadosSiguientes/GetEstadosSiguientes/RequerimientoDesarrollos/DESARROLLO/true", "Nombre", "EstadoSiguiente", "Seleccione un estado ....");
    $("#TxtNoOrdeTrabajo").ControlSelecionOTSublimacionConfirmadas();
    $("#CmbOTaprob").ControlSelecionOTSublimacionConfirmadas();

    let dtfecha = new Date();
    $("#dFechaDesde").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaDesde").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(new Date(dtfecha.getFullYear(), dtfecha.getMonth() - 1, dtfecha.getUTCDate())), 's'));
    $("#dFechaHasta").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaHasta").data("kendoDatePicker").value(Fhoy());
    $("#TxtComentarios").autogrow({ vertical: true, horizontal: false, flickering: false });
    $("#TxtComentariosHis").autogrow({ vertical: true, horizontal: false, flickering: false });
    $("#TxtComentariosHis").attr("readonly", true);

    $('#chkRangFechas').prop('checked', 1);

    KdoDatePikerEnable($("#dFechaDesde"), false);
    KdoDatePikerEnable($("#dFechaHasta"), false);
    KdoCheckBoxEnable($('#chkRangFechas'), false);
    KdoButtonEnable($("#btnConsular"), false);
    KdoMultiColumnCmbEnable($("#TxtNoOrdeTrabajo"), false);
    KdoButtonEnable($("#btnGuardar"), false);
    $("#TxtComentarios").attr("disabled", true);

    $("#chkRangFechas").click(function () {
        if (this.checked) {
            KdoDatePikerEnable($("#dFechaDesde"), true);
            KdoDatePikerEnable($("#dFechaHasta"), true);

        } else {

            KdoDatePikerEnable($("#dFechaDesde"), false);
            KdoDatePikerEnable($("#dFechaHasta"), false);
        }
    });
    $("#TabPreciosSubli").kendoTabStrip({
        tabPosition: "top",
        animation: { open: { effects: "fadeIn" } }
    });
    $("#ModalCambioEstado").kendoDialog({
        height: "auto",
        width: "30%",
        title: "Cambio de estado",
        closable: true,
        modal: true,
        visible: false,
        maxHeight: 900
    });
    $("#ModalCambiaPrecioAprob").kendoDialog({
        height: "auto",
        width: "30%",
        title: "Editar OT histórica",
        closable: true,
        modal: true,
        visible: false,
        maxHeight: 900
    });

    $("#ModalPreciosHisCambios").kendoDialog({
        height: "auto",
        width: "60%",
        title: "Histórico cambios de precios aprobados",
        closable: true,
        modal: true,
        visible: false,
        maxHeight: 900
    });

    $("#btnCambioEstado").click(function () {
        let lista = "";
        let Datos;
        $("#CmbMultiComboNoDocmuento").data("kendoMultiSelect").value("");
        $("#CmbMultiComboNoDocmuento").data("kendoMultiSelect").setDataSource(fn_ComboNoDocumento());
        KdoCmbSetValue($("#cmbEstados"), "APROBADO");
        $("#TxtMotivo").val("");
        Datos = fn_GetNoDocumentosByCliente();
        $.each(Datos, function (index, elemento) {
            if (elemento.Completado===true) {
                lista = lista + elemento.IdRequerimiento + ",";
            }
          
        });
        $("#CmbMultiComboNoDocmuento").data("kendoMultiSelect").value(lista.split(","));

        $("#ModalCambioEstado").data("kendoDialog").open().toFront();
    });

    $("#btnRefrescar").click(function () {
        Fn_ConsultarSibli(KdoCmbGetValue($("#CmbIdCliente")));
    });

    $("#btnEditarOT").click(function () {
        KdoMultiColumnCmbSetValue($("#CmbOTaprob"), "");
        $("#CmbOTaprob").data("kendoMultiColumnComboBox").dataSource.read();
        $("#ModalCambiaPrecioAprob").data("kendoDialog").open().toFront();
    });

  
    //#region PROGRAMACION GRID PRINCIPAL PARA SIMULACION

    fn_partesSublimado();
    Grid_HabilitaToolbar($("#gridPartes"), false, false, false);

    //#endregion FIN GRID PRINCIPAL

    //#region seleccion de servicio y cliente

    $("#CmbIdCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            kdoChkSetValue($('#chkRangFechas'), true);
            Fn_ConsultarSibli(this.dataItem(e.item.index()).IdCliente.toString());
            KdoButtonEnable($("#btnCambioEstado"), fn_SNCambiarEstados(true));
            KdoButtonEnable($("#btnRefrescar"), true);
            KdoButtonEnable($("#btnEditarOT"), fn_SNCambiarEstados(true));
            KdoDatePikerEnable($("#dFechaDesde"), true);
            KdoDatePikerEnable($("#dFechaHasta"), true);
            KdoCheckBoxEnable($('#chkRangFechas'), true);
            KdoButtonEnable($("#btnConsular"), true);
            KdoMultiColumnCmbEnable($("#TxtNoOrdeTrabajo"), true);
            KdoMultiColumnCmbSetValue($("#TxtNoOrdeTrabajo"), "");
            $("#gridPartesHis").data("kendoGrid").dataSource.read("[]");
            KdoButtonEnable($("#btnGuardar"), true);
            $("#TxtComentarios").attr("disabled", false);
        } else {
            kdoChkSetValue($('#chkRangFechas'), true);
            Fn_ConsultarSibli(0);
            KdoButtonEnable($("#btnCambioEstado"), false);
            KdoButtonEnable($("#btnRefrescar"), false);
            KdoButtonEnable($("#btnEditarOT"), false);
            KdoDatePikerEnable($("#dFechaDesde"), false);
            KdoDatePikerEnable($("#dFechaHasta"), false);
            KdoCheckBoxEnable($('#chkRangFechas'), false);
            KdoButtonEnable($("#btnConsular"), false);
            KdoMultiColumnCmbEnable($("#TxtNoOrdeTrabajo"), false);
            KdoMultiColumnCmbSetValue($("#TxtNoOrdeTrabajo"), "");
            $("#gridPartesHis").data("kendoGrid").dataSource.read("[]");
            KdoButtonEnable($("#btnGuardar"), false);
            $("#TxtComentarios").attr("disabled", true);
            $("#TxtComentarios").val("");
            $("#TxtComentariosHis").val("");
        }
    });

    $("#CmbIdCliente").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            kdoChkSetValue($('#chkRangFechas'), true);
            Fn_ConsultarSibli(0);
            KdoButtonEnable($("#btnCambioEstado"), false);
            KdoButtonEnable($("#btnRefrescar"), false);
            KdoButtonEnable($("#btnEditarOT"), false);
            KdoDatePikerEnable($("#dFechaDesde"), false);
            KdoDatePikerEnable($("#dFechaHasta"), false);
            KdoCheckBoxEnable($('#chkRangFechas'), false);
            KdoButtonEnable($("#btnConsular"), false);
            KdoMultiColumnCmbEnable($("#TxtNoOrdeTrabajo"), false);
            KdoMultiColumnCmbSetValue($("#TxtNoOrdeTrabajo"), "");
            $("#gridPartesHis").data("kendoGrid").dataSource.read("[]");
            KdoButtonEnable($("#btnGuardar"), false);
            $("#TxtComentarios").attr("disabled", true);
            $("#TxtComentarios").val("");
            $("#TxtComentariosHis").val("");
        }
    });

    let ValidRD = $("#FrmModalCambioEstado").kendoValidator({
            rules: {
                vcmbEstados: function (input) {
                    if (input.is("[name='cmbEstados']")) {
                        return $("#cmbEstados").data("kendoComboBox").selectedIndex >= 0;
                    }
                    return true;
                },
                CmbMulti: function (input) {
                    if (input.is("[name='CmbMultiComboNoDocmuento']")) {
                        return $("#CmbMultiComboNoDocmuento").data("kendoMultiSelect").value().length > 0;
                    }
                    return true;
                },
                mtv: function (input) {
                    if (input.is("[name='TxtMotivo']") && KdoCmbGetValue($("#cmbEstados")) !== "APROBADO") {
                        return input.val().length > 0 && input.val().length <= 2000;
                    }
                    return true;
                }

            },
            messages: {
                vcmbEstados: "Requerido",
                CmbMulti: "Requerido",
                mtv:"Requerido"
            }
        }
    ).data("kendoValidator");

    let ValidHabilitar = $("#FrmModalCambioAprob").kendoValidator({
            rules: {
                vcmbEstados: function (input) {
                    if (input.is("[name='CmbOTaprob']")) {
                        return $("#CmbOTaprob").data("kendoMultiColumnComboBox").selectedIndex >= 0;
                    }
                    return true;
                }
            },
            messages: {
                vcmbEstados: "Requerido"
            }
        }
    ).data("kendoValidator");


    $("#btnAceptarCambiar").click(function () {
        if (ValidRD.validate()) {

            kendo.ui.progress($(".k-dialog"), true);
            $.ajax({
                url: TSM_Web_APi + "RequerimientoDesarrollos/RequerimientoDesarrollos_CambiarEstadoSublimacion",
                type: "Post",
                dataType: "json",
                data: JSON.stringify({
                    IdRequerimiento: 0,
                    EstadoSiguiente: KdoCmbGetValue($("#cmbEstados")),
                    Motivo: $("#TxtMotivo").val(),
                    StringIdRequerimiento: $("#CmbMultiComboNoDocmuento").data("kendoMultiSelect").value().toString()
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    kendo.ui.progress($(".k-dialog"), false);
                    fn_GridPartesLoad();
                    $("#ModalCambioEstado").data("kendoDialog").close();
                    RequestEndMsg(data, "Post");
                },
                error: function (data) {
                    kendo.ui.progress($(".k-dialog"), false);
                    ErrorMsg(data);
                }
            });
        }
        else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }
    });

    $("#btnCambiarPrecioApro").click(function () {
        if (ValidHabilitar.validate()) {

            kendo.ui.progress($(".k-dialog"), true);
            $.ajax({
                url: TSM_Web_APi + "RequerimientoDesarrollos/RequerimientoDesarrollos_CambiarEstadoSublimacion",
                type: "Post",
                dataType: "json",
                data: JSON.stringify({
                    IdRequerimiento: KdoMultiColumnCmbGetValue($("#CmbOTaprob")),
                    EstadoSiguiente: "DESARROLLO",
                    Motivo: "ACTIVACIÓN DE OT POR CAMBIO DE PRECIOS",
                    StringIdRequerimiento: ""
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    kendo.ui.progress($(".k-dialog"), false);
                    fn_GridPartesLoad();
                    $("#gridPartesHis").data("kendoGrid").dataSource.read();
                    $("#ModalCambiaPrecioAprob").data("kendoDialog").close();
                    RequestEndMsg(data, "Post");
                },
                error: function (data) {
                    kendo.ui.progress($(".k-dialog"), false);
                    ErrorMsg(data);
                }
            });
        }
        else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }
     
    });

    //Cargar grid precios historicos
    fn_partesHisSublimado();

    $("#btnConsular").click(function (e) {
        let g = $("#gridPartesHis").data("kendoGrid");
        g.dataSource.read();
        g.pager.page(1);
    });

    $("#gridPartes").data("kendoGrid").bind("change", function (e) {
        Fn_getRowPrecios($("#gridPartes").data("kendoGrid"));
       
    });

    var valReqDes = $("#ReqDes").kendoValidator(
        {
            rules: {
                InstruccionesEspecialesRuler: function (input) {
                    if (input.is("[name='TxtComentarios']")) {
                        return input.val().length >0 && input.val().length <= 2000;
                    }
                    return true;
                }
            },
            messages: {
                InstruccionesEspecialesRuler: "Longitud máxima del campo es 2000"
            }
        }).data("kendoValidator");


    $("#btnGuardar").click(function (event) {
        event.preventDefault();
        if (valReqDes.validate()) {
            fn_ActualizarReqSublimacion();
        } else {
            $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        }

    });


    //#endregion

    fn_partesHisCambios();
    $("#chkMostrarTodos").click(function () {
        $("#gridPartesHisCambios").data("kendoGrid").dataSource.read();
    });

});
let fn_verHisCambioPrecios = function (xidreq, xidCatPre, xidUbi, xNodoc) {
    xIdReqChis = xidreq;
    xIdCatPrendaChis = xidCatPre;
    xIdUbiChis = xidUbi;
    $("#TxtNoDoc").val(xNodoc);
    $("#gridPartesHisCambios").data("kendoGrid").dataSource.read();
    kdoChkSetValue($("#chkMostrarTodos"), false);
    $("#ModalPreciosHisCambios").data("kendoDialog").open();
};
let Fn_ConsultarSibli = function (IdCliente) {
    VIdCliente = Number(IdCliente);
    //leer grid
    fn_GridPartesLoad();
};

let fn_GridPartesLoad = function () {
    $("#gridPartes").data("kendoGrid").dataSource.read().then(function () {
        $("#gridPartes").data("kendoGrid").dataSource.total() === 0 ? Grid_HabilitaToolbar($("#gridPartes"), false, false, false) : Grid_HabilitaToolbar($("#gridPartes"), Permisos.SNAgregar, Permisos.SNEditar, false);
        $("#gridPartes").data("kendoGrid").dataSource.total() === 0 ? KdoButtonEnable($("#btnCambioEstado"), false) : KdoButtonEnable($("#btnCambioEstado"), fn_SNCambiarEstados(true));

        $("#gridPartes").data("kendoGrid").dataSource.total() === 0 ? KdoButtonEnable($("#btnGuardar"), false) : KdoButtonEnable($("#btnGuardar"), true);
        $("#gridPartes").data("kendoGrid").dataSource.total() === 0 ? $("#TxtComentarios").attr("disabled", true) : $("#TxtComentarios").attr("disabled", false);
    });

};
var fPermisos = function (datos) {
    Permisos = datos;
};
let fn_SNEditar = function (valor) {
    return Permisos.SNEditar ? valor : false;
};
let fn_SNAgregar = function (valor) {
    return Permisos.SNAgregar ? valor : false;
};
let fn_SNBorrar = function (valor) {
    return Permisos.SNBorrar ? valor : false;
};
let fn_SNProcesar = function (valor) {
    return Permisos.SNProcesar ? valor : false;
};
let fn_SNCambiarEstados = function (valor) {
    return Permisos.SNCambiarEstados ? valor : false;
};
let fn_partesSublimado = function () {
    //#region partes de sublimado
   

    let UrlPParte = TSM_Web_APi + "PrendasPartes";
    let UrlUbic = TSM_Web_APi + "Ubicaciones";
    let UrlUniMed = TSM_Web_APi + "UnidadesMedidas";
    let dset = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlPParte + "/GetByidCliente/" + VIdCliente; },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlPParte + "/" + datos.IdRequerimiento + "/" + datos.IdCategoriaPrenda + "/" + datos.IdUbicacion; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlPParte + "/" + datos.IdRequerimiento + "/" + datos.IdCategoriaPrenda + "/" + datos.IdUbicacion; },
                type: "DELETE"
            },
            create: {
                url: UrlPParte,
                type: "POST",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: function (e) {
            Grid_requestEnd(e);
            if (e.type === "create") {
                $("#gridPartes").data("kendoGrid").dataSource.read();
            }
           
        },
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdUbicacion",
                fields: {
                    IdRequerimiento: { type: "string" },
                    NombreProgra: {type:"string"},
                    IdCategoriaPrenda: {
                        type: "number"
                    },
                    NoDocumento: {type: "string"},
                    NombrePrenda: { type: "string" },
                    NombreDiseño: { type: "string" },
                    EstiloDiseno: { type: "string"},
                    IdUbicacion: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdUbicacion']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUbicacion").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdUnidad']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUnidad").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='Cantidad']")) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return $("[name='Cantidad']").data("kendoNumericTextBox").value() > 0;
                                }
                                if (input.is("[name='Precio']")) {
                                    input.attr("data-maxlength-msg", "Debe ser mayor a Cero.");
                                    return Permisos.SNConfidencial === true ? $("[name='Precio']").data("kendoNumericTextBox").value() > 0 : true;
                                }
                                if (input.is("[name='IdRequerimiento']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("[name='IdRequerimiento']").data("kendoMultiColumnComboBox").selectedIndex >= 0;
                                }
                                return true;

                            }
                        }
                    },
                    NombreParte: { type: "string" },
                    Cantidad: { type: "number" },
                    IdUnidad: { type: "string", defaultValue: 9 },
                    NombreUnidad: { type: "string" },
                    Precio: { type: "number" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    InstruccionesEspeciales: { type: "string" }
                }
            }
        },
        aggregate: [
            { field: "Cantidad", aggregate: "sum" },
            { field: "Precio", aggregate: "sum" }
        ]
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridPartes").kendoGrid({
        edit: function (e) {
            $('[name="IdUnidad"]').data("kendoComboBox").setDataSource(fn_DSIdUnidadFiltro("9,17"));
            KdoHideCampoPopup(e.container, "NoDocumento");
            KdoHideCampoPopup(e.container, "IdCategoriaPrenda");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "NombreParte");
            KdoHideCampoPopup(e.container, "NombreUnidad");
            KdoHideCampoPopup(e.container, "NombreProgra");
            KdoHideCampoPopup(e.container, "NombreDiseño");
            KdoHideCampoPopup(e.container, "NombrePrenda");
            KdoHideCampoPopup(e.container, "EstiloDiseno");
           
            $('[name="IdRequerimiento"]').data("kendoMultiColumnComboBox").bind("change", function () {
                var multicolumncombobox = $('[name="IdRequerimiento"]').data("kendoMultiColumnComboBox");
                let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdRequerimiento === Number($('[name="IdRequerimiento"]').data("kendoMultiColumnComboBox").value()));
                if (data !== undefined) {
                    $('[name="IdCategoriaPrenda"]').data("kendoNumericTextBox").value(data.Prenda);
                    $('[name="IdCategoriaPrenda"]').data("kendoNumericTextBox").trigger("change");
                }
              
            });

            if (!e.model.isNew()) {
                KdoHideCampoPopup(e.container, "IdUbicacion");
                TextBoxEnable($("[name='NoDocumento']"), false);
                var multicolumncombobox = $('[name="IdRequerimiento"]').data("kendoMultiColumnComboBox");
                multicolumncombobox.select(function (dataItem) { return dataItem.IdRequerimiento === e.model.IdRequerimiento; });
                multicolumncombobox.search(e.model.NoDocumento);
                multicolumncombobox.refresh();
                multicolumncombobox.text(e.model.NoDocumento);
                multicolumncombobox.close();
                multicolumncombobox.enable(false);
                Grid_Focus(e, "Cantidad");

            } else {
                Grid_Focus(e, "IdRequerimiento");
            }
          
           
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            {
                field: "IdRequerimiento", title: "No Orden Trabajo",
                editor: function (container, options) {
                    $('<input data-bind="value:' + options.field + '" name="' + options.field + '" />').appendTo(container).ControlSelecionOTSublimacion(KdoCmbGetValue($("#CmbIdCliente")));
                }, hidden: true
            },
            {
                field: "NombreProgra", title: "Programa",lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            { field: "NombreDiseño", title: "Nombre del Diseño" },
            {
                field: "NoDocumento", title: "No OT", lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                },
                template: function (data) {
                    return "<button class='btn btn-link nav-link' onclick='fn_verHisCambioPrecios(" + data["IdRequerimiento"] + "," + data["IdCategoriaPrenda"] + "," + data["IdUbicacion"] + ",\"" + data["NoDocumento"] +"\")'>" + data["NoDocumento"] + "</button>";
                }
            },
            { field: "IdCategoriaPrenda", title: "Codigo IdCategoriaPrenda", editor: Grid_ColNumeric, values: ["required", "0", "9999999999999999", "#", 0],   hidden: true },
            {
                field: "NombrePrenda", title: "Prenda", lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            { field: "IdUbicacion", title: "Parte", editor: Grid_Combox, values: ["IdUbicacion", "Nombre", UrlUbic, "", "Seleccione...."], hidden: true },
            {
                field: "NombreParte", title: "Parte", lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }

            },
            {
                field: "EstiloDiseno", title: "Estilo del Diseno",
                lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Cantidad", title: "Cantidad", editor: Grid_ColNumeric, values: ["required", "0", "9999999999999999", "#", 0], footerTemplate: "Total: #: data.Cantidad ? sum : 0 #",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "IdUnidad", title: "Unidad", editor: Grid_ComboxData, values: ["IdUnidad", "Abreviatura", "[]", "Seleccione....", "", "", ""], hidden: true,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "NombreUnidad", title: "Unidad",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "Precio", title: "Precio", editor: Grid_ColNumeric, values: ["required", "0.00", "99999999999999.99", "c2", 2], format: "{0:c2}", footerTemplate: "Total: #: data.Precio ? kendo.format('{0:c2}', sum) : 0 #", menu: false,
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridPartes").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, false, redimensionable.Si,600,true,"row");
    SetGrid_CRUD_ToolbarTop($("#gridPartes").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridPartes").data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource($("#gridPartes").data("kendoGrid"), dset);
  
    var selectedRows = [];
    $("#gridPartes").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridPartes"), selectedRows);
    });

    $("#gridPartes").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridPartes"), selectedRows);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridPartes"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#gridPartes"), $(window).height() - "371");

    //#endregion

    let fn_DSIdUnidadFiltro = function (filtro) {

        return new kendo.data.DataSource({
            dataType: 'json',
            sort: { field: "Nombre", dir: "asc" },
            transport: {
                read: function (datos) {
                    $.ajax({
                        dataType: 'json',
                        type: "POST",
                        async: false,
                        url: UrlUniMed + "/GetUnidadesMedidasByFiltro",
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

};

let fn_partesHisSublimado = function () {
    //#region partes de sublimado

    let dsethis = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: function (datos) {
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    url: TSM_Web_APi + "PrendasPartes/GetHisByidCliente",
                    data: JSON.stringify({
                        FechaDesde: $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                        FechaHasta: $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                        IdCliente: KdoCmbGetValue($("#CmbIdCliente")),
                        IdRequerimiento: KdoMultiColumnCmbGetValue($("#TxtNoOrdeTrabajo"))
                    }),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    },
                    error: function () {
                        options.error(result);
                    }
                });
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: function (e) {
            Grid_requestEnd(e);
        },
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdUbicacion",
                fields: {
                    IdRequerimiento: { type: "string" },
                    NombreProgra: { type: "string" },
                    IdCategoriaPrenda: {
                        type: "number"
                    },
                    NoDocumento: { type: "string" },
                    NombrePrenda: { type: "string" },
                    NombreDiseño: { type: "string" },
                    EstiloDiseno: { type: "string" },
                    IdUbicacion: {
                        type: "string"
                    },
                    NombreParte: { type: "string" },
                    Cantidad: { type: "number" },
                    IdUnidad: { type: "string"},
                    NombreUnidad: { type: "string" },
                    Precio: { type: "number" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    InstruccionesEspeciales: { type: "string" }
                }
            }
        },
        aggregate: [
            { field: "Cantidad", aggregate: "sum" },
            { field: "Precio", aggregate: "sum" }
        ]
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridPartesHis").kendoGrid({
        toolbar: ["excel"],
        excel: {
            fileName: "Sublimacion_Precios_Aprobados.xlsx",
            filterable: true,
            allPages: true
        },
        edit: function (e) {
            $('[name="IdUnidad"]').data("kendoComboBox").setDataSource(fn_DSIdUnidadFiltro("9,17"));
            KdoHideCampoPopup(e.container, "NoDocumento");
            KdoHideCampoPopup(e.container, "IdCategoriaPrenda");
            KdoHideCampoPopup(e.container, "FechaMod");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "NombreParte");
            KdoHideCampoPopup(e.container, "NombreUnidad");
            KdoHideCampoPopup(e.container, "NombreProgra");
            KdoHideCampoPopup(e.container, "NombreDiseño");
            KdoHideCampoPopup(e.container, "NombrePrenda");
            KdoHideCampoPopup(e.container, "EstiloDiseno");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            {
                field: "IdRequerimiento", title: "No Orden Trabajo",
                hidden: true
            },
            {
                field: "NombreProgra", title: "Programa", lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            { field: "NombreDiseño", title: "Nombre del Diseño" },
            {
                field: "NoDocumento", title: "No OT", lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }, template: function (data) {
                    return "<button class='btn btn-link nav-link' onclick='fn_verHisCambioPrecios(" + data["IdRequerimiento"] + "," + data["IdCategoriaPrenda"] + "," + data["IdUbicacion"] + ",\"" + data["NoDocumento"] +"\")'>" + data["NoDocumento"] + "</button>";
                }
            },
            { field: "IdCategoriaPrenda", title: "Codigo IdCategoriaPrenda", editor: Grid_ColNumeric, values: ["required", "0", "9999999999999999", "#", 0], hidden: true },
            {
                field: "NombrePrenda", title: "Prenda", lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "NombreParte", title: "Parte", lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }

            },
            {
                field: "EstiloDiseno", title: "Estilo del Diseno",
                lockable: true,
                filterable: {
                    cell: {
                        operator: "contains",
                        suggestionOperator: "contains"
                    }
                }
            },
            {
                field: "Cantidad", title: "Cantidad", footerTemplate: "Total: #: data.Cantidad ? sum : 0 #",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "NombreUnidad", title: "Unidad",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            {
                field: "Precio", title: "Precio", format: "{0:c2}", footerTemplate: "Total: #: data.Precio ? kendo.format('{0:c2}', sum) : 0 #",
                filterable: {
                    cell: {
                        enabled: false
                    }
                }
            },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "InstruccionesEspeciales", title:"Comentarios",menu:false,hidden:true}
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridPartesHis").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 600, true, "row");
    //SetGrid_CRUD_ToolbarTop($("#gridPartesHis").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridPartesHis").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridPartesHis").data("kendoGrid"), dsethis);

    var selectedRows1 = [];
    $("#gridPartesHis").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridPartesHis"), selectedRows1);
    });

    $("#gridPartesHis").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridPartesHis"), selectedRows1);
        Fn_getRowComentarioHis($("#gridPartesHis").data("kendoGrid"));
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridPartesHis"), $(window).height() - "370");
    });

    Fn_Grid_Resize($("#gridPartesHis"), $(window).height() - "370");

   

    //#endregion
};

let fn_ComboNoDocumento = function () {
    return new kendo.data.DataSource({
        dataType: 'json',
        sort: { field: "NoDocumento", dir: "asc" },
        transport: {
            read: function (datos) {
                $.ajax({
                    dataType: 'json',
                    type: "GET",
                    async: false,
                    url: TSM_Web_APi + "PrendasPartes/GetNoDocumentosByCliente/" + KdoCmbGetValue($("#CmbIdCliente")),
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);

                    }
                });
            }
        }
    });
};

var fn_GetNoDocumentosByCliente = function () {
    kendo.ui.progress($(document.body), true);
    let result = null;
    $.ajax({
        url: TSM_Web_APi + "PrendasPartes/GetNoDocumentosByCliente/" + KdoCmbGetValue($("#CmbIdCliente")),
        async: false,
        type: 'GET',
        success: function (datos) {
            result = datos;
        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
    return result;
};

$.fn.extend({
    ControlSelecionOTSublimacionConfirmadas: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "NoOT",
                dataValueField: "IdRequerimiento",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                placeholder:"Seleccione una OT...",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "Prendas/GetPrendasConfirmadas/" + (KdoCmbGetValue($("#CmbIdCliente")) === null ? 0 : KdoCmbGetValue($("#CmbIdCliente"))); },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "NoOT", title: "No Orden Trabajo", width: 150 },
                    { field: "NombrePrenda", title: "Nombre Prenda", width: 300 },
                    { field: "NombreDiseno", title: "Nombre Diseño", width: 300 },
                    { field: "NumeroDiseno", title: "Numero Diseño", width: 300 },
                    { field: "EstiloDiseno", title: "Estilo Diseño", width: 300 }

                ]
            });
        });
    }
});

let Fn_getRowPrecios = function (g) {
    var elemento = g.dataItem(g.select());
    $("#TxtComentarios").val(elemento.InstruccionesEspeciales);
    xIdReqDes = elemento.IdRequerimiento;

};

let Fn_getRowComentarioHis = function (g) {
    var elemento = g.dataItem(g.select());
    $("#TxtComentariosHis").val(elemento.InstruccionesEspeciales);
};

let fn_ActualizarReqSublimacion = function () {
    kendo.ui.progress($(document.body), true);

    $.ajax({
        url: TSM_Web_APi + "RequerimientoDesarrollos/UpdRequerimientoRow/" + xIdReqDes,
        type: "Put",
        dataType: "json",
        data: JSON.stringify({
            IdRequerimiento: xIdReqDes,
            InstruccionesEspeciales: $("#TxtComentarios").val()

        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            RequestEndMsg(data, "Put");
            kendo.ui.progress($(document.body), false);
            $("#gridPartes").data("kendoGrid").dataSource.read();
        },
        error: function (data) {
            kendo.ui.progress($(document.body), false);
        }
    });

};

let fn_partesHisCambios = function () {
    //#region partes de sublimado

    let dsethisCambios = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) {
                    return TSM_Web_APi + "PrendasPartesPreciosHis/" +( $("#chkMostrarTodos").is(':checked') === false ? "GetPrendasParteView/" + xIdReqChis.toString() + "/" + xIdCatPrendaChis.toString() + "/" + xIdUbiChis.toString() : "GetPrendasParteByidRequerimientoidCategoriaPrenda/" + xIdReqChis.toString() + "/" + xIdCatPrendaChis.toString()); },
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: function (e) {
            Grid_requestEnd(e);
        },
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdUbicacion",
                fields: {
                    IdRequerimiento: { type: "string" },
                    NombreProgra: { type: "string" },
                    IdCategoriaPrenda: {
                        type: "number"
                    },
                    NoDocumento: { type: "string" },
                    NombrePrenda: { type: "string" },
                    NombreDiseño: { type: "string" },
                    EstiloDiseno: { type: "string" },
                    IdUbicacion: {
                        type: "string"
                    },
                    NombreParte: { type: "string" },
                    Fecha: { type: "date" },
                    Cantidad: { type: "number" },
                    IdUnidad: { type: "string" },
                    NombreUnidad: { type: "string" },
                    Precio: { type: "number" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    InstruccionesEspeciales: { type: "string" }
                }
            }
        },
        group: {
            field: "Fecha", aggregates: [
                { field: "Cantidad", aggregate: "sum" },
                { field: "Precio", aggregate: "sum" }
            ]
        },
        aggregate: [
            { field: "Cantidad", aggregate: "sum" },
            { field: "Precio", aggregate: "sum" }
        ]
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridPartesHisCambios").kendoGrid({

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true },
            { field: "NoDocumento", title: "No Documento", hidden: true },
            { field: "IdCategoriaPrenda", title: "Código Categoria Prenda", hidden: true },
            { field: "NombrePrenda", title: "Prenda" },
            { field: "IdUbicacion", title: "Código de ubicación", hidden: true },
            { field: "NombreParte", title: "Parte" },
            { field: "Cantidad", title: "Cantidad", aggregates: ["Cantidad"], groupFooterTemplate: "Total: #: data.Cantidad ? sum : 0 #"  },
            { field: "NombreUnidad", title: "Unidad" },
            { field: "Precio", title: "Precio", format: "{0:c2}", aggregates: ["Precio"], groupFooterTemplate: "Total: #: data.Precio ? kendo.format('{0:c2}', sum) : 0 #" },
            { field: "IdUsuarioMod", title: "Usuario Mod", hidden: true },
            { field: "FechaMod", title: "Fecha Mod", format: "{0: dd/MM/yyyy HH:mm:ss.ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridPartesHisCambios").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 600);
    //SetGrid_CRUD_ToolbarTop($("#gridPartesHisCambios").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridPartesHisCambios").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridPartesHisCambios").data("kendoGrid"), dsethisCambios);

    var selectedRows1 = [];
    $("#gridPartesHisCambios").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridPartesHisCambios"), selectedRows1);
    });

    $("#gridPartesHisCambios").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridPartesHisCambios"), selectedRows1);
    });
    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridPartesHisCambios"), $(window).height() - "370");
    });

    Fn_Grid_Resize($("#gridPartesHisCambios"), $(window).height() - "370");


    //#endregion
};

let fn_getIdReq=function(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdRequerimiento;

};
let fn_getIdCategoriaPrenda = function(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdCategoriaPrenda;

};
let fn_getIdUbicacion = function(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdUbicacion;

};