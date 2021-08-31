var Permisos;
let _IdOrdenTrabajo;
let _IdPiezaDesarrollada;
let dataItem;
let Turnos = [{ "nombre": "A","valor":"A" }, { "nombre": "B", "valor":"B"}];
$(document).ready(function () {
    KdoButton($("#btnCambiarEstado"), "check-circle");
    KdoButton($("#btnCriteriosCalidad"), "track-changes-accept");
    KdoButtonEnable($("#btnCambiarEstado"), false);
    KdoButtonEnable($("#btnCriteriosCalidad"), false);
    Kendo_CmbFiltrarGrid($("#CmbCalidadPrueba"), TSM_Web_APi + "CalidadPruebas/", "Nombre", "IdCalidadPrueba", "Seleccione...");
    $("#CmbOrdenTrabajo").ControlSeleccionOrdenesTrabajos();
    
    $("#ComentariosLab").kendoTextArea({
        rows: 5,
        maxLength: 500,
        placeholder: "Ingrese su comentario..."
    });
  
    $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            fn_ObtenerMuestras(this.dataItem(e.item.index()).IdOrdenTrabajo);
            SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
            KdoButtonEnable($("#btnCambiarEstado"), true);
            KdoButtonEnable($("#btnCriteriosCalidad"), true);
        } else {
            fn_ObtenerMuestras(null);
            SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), false);
            KdoButtonEnable($("#btnCambiarEstado"), false);
            KdoButtonEnable($("#btnCriteriosCalidad"), false);
        }
    });

    $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdOrdenTrabajo === Number(this.value()));
        if (data === undefined) {
            fn_ObtenerMuestras(null);
            SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), false);
            KdoButtonEnable($("#btnCambiarEstado"), false);
            KdoButtonEnable($("#btnCriteriosCalidad"), false);
        }
    });

    let dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) {
                    return crudServiceBaseUrl + "/ConsultarPiezas/" + (_IdOrdenTrabajo === undefined || _IdOrdenTrabajo === null ? 0 : _IdOrdenTrabajo);
                },
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdPiezaDesarrollada; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return crudServiceBaseUrl + "/" + datos.IdPiezaDesarrollada; },
                type: "DELETE"
            },
            create: {
                url: crudServiceBaseUrl,
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
            if (e.type === "update" || e.type === "create" || e.type === "destroy") {
                $("#grid").data("kendoGrid").dataSource.read();
            }
        },
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdPiezaDesarrollada",
                fields: {
                    IdOrdenTrabajo: {
                        type: "numeric",
                        defaultValue: function () {
                            return KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo"));
                        }
                    },
                    NoDocumento: { type: "string" },
                    IdPiezaDesarrollada: { type: "number" },
                    IdSeteo: { type: "numeric" },
                    NoPieza: { type: "numeric" },
                    IdTipoPieza: { type: "numeric" },
                    NomTipoPieza: { type: "string" },
                    IdUsuario: {
                        type: "string",
                        defaultValue: function () { return getUser(); }
                    },
                    IdUsuarioEstampador: { type: "numeric" },
                    Estado: { type: "string" },
                    NomEstado: { type: "string" },
                    Comentarios: {
                        type: "string"
                    },
                    IdPlanta: { type: "numeric" },
                    IdTurno: { type: "numeric" },
                    Enmienda: { type: "boolean" },
                    Segunda: { type: "boolean" },
                    AuditoriaExterna: { type: "boolean" },
                    FechaRegistro: {type:"date"},
                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            KdoHideCampoPopup(e.container, "IdPiezaDesarrollada");
            KdoHideCampoPopup(e.container, "IdOrdenTrabajo");
            KdoHideCampoPopup(e.container, "IdSeteo");
            KdoHideCampoPopup(e.container, "NoPieza");
            KdoHideCampoPopup(e.container, "Estado");
            KdoHideCampoPopup(e.container, "NomEstado");
            KdoHideCampoPopup(e.container, "NomTipoPieza");
            KdoHideCampoPopup(e.container, "FechaRegistro");
            Grid_Focus(e, "NoPieza");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdOrdenTrabajo", title: "IdOrdenTrabajo", hidden: true },
            { field: "IdPiezaDesarrollada", title: "IdPiezaDesarrollada", hidden: true },
            { field: "IdSeteo", title: "Seteo", hidden: true },
            { field: "NoPieza", title: "No. Muestra" },
            { field: "FechaRegistro", title: "Fecha Registrada", format: "{0:dd/MM/yyyy HH:MM}" },
            { field: "IdTipoPieza", title: "Tipo de Pieza", editor: Grid_Combox, values: ["IdTipoPieza", "Nombre", varTiposPiezas, "", "Seleccione....", "required", "", "Requerido"], hidden: true },
            { field: "NomTipoPieza", title: "Tipo de Pieza" },
            { field: "Estado", title: "Resultado", hidden: true },
            { field: "NomEstado", title: "Resultado" },
            { field: "Comentarios", title: "Comentarios" },
            { field: "IdPlanta", title: "Planta", editor: Grid_ColNumeric, values: ["required", "1", "3", "#", 0] },
            { field: "IdTurno", title: "Turno", editor: Grid_ColRadiobuttonGroup, values: [Turnos] },
            { field: "Enmienda", title: "Enmienda", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Enmienda"); } },
            { field: "Segunda", title: "Segunda", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Segunda"); } },
            { field: "AuditoriaExterna", title: "Auditoria Externa", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "AuditoriaExterna"); } },
            {
                command: {
                    name: "Enviar a laboratorio ",
                    iconClass: "k-icon k-i-file",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                         dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                        Grid_SetSelectRow($("#grid"), selectedRows);
                        let dialog = $("#ModalInfoComplementariaLab").data("kendoDialog");
                        dialog.open();
                        dialog.title("Información de solicitud " + dataItem.NoPieza);
                        

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
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);

   

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
    });




    // carga vista para el cambio de estado
    // 1. configurar vista.
    Fn_VistaCambioEstado($("#vCambioEstadoPD"), function () {
        fn_ObtenerMuestras(_IdOrdenTrabajo);
    });
    // 2. boton cambio de estado.
    $("#btnCambiarEstado").click(function () {

        var lstId = {
            IdPiezaDesarrollada: fn_getIdPiezaDesarrollada($("#grid").data("kendoGrid"))
        };
        Fn_VistaCambioEstadoMostrar("PiezasDesarrolladas", fn_getEstadoPD($("#grid").data("kendoGrid")), TSM_Web_APi + "PiezasDesarrolladas/CambiarEstado", "Sp_CambioEstado", lstId, undefined);
    });


    let dataSourceEstados = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) {
                    return crudServiceBaseUrl + "/GetEstados/" + (_IdPiezaDesarrollada === undefined || _IdPiezaDesarrollada === null ? 0 : _IdPiezaDesarrollada);
                },
                contentType: "application/json; charset=utf-8"
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
                id: "IdPiezaDesarrollada",
                fields: {
                    IdPiezaDesarrollada: {
                        type: "numeric"

                    },
                    FechaEstado: { type: "date" },
                    Estado: { type: "string" },
                    Motivo: { type: "string" },
                    IdUsuario: { type: "string" },

                }
            }
        }
    });

    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridEstados").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdPiezaDesarrollada", title: "Pieza desarrollada", hidden: true },
            { field: "FechaEstado", title: "Fecha de cambio", hidden: false, format: "{0:dd/MM/yyyy HH:MM}" },
            { field: "Estado", title: "Estado" },
            { field: "Motivo", title: "Motivo" },
            { field: "IdUsuario", title: "Usuario", format: "{0:dd/MM/yyyy HH:MM}" }

        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridEstados").data("kendoGrid"), ModoEdicion.NoEditable, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridEstados").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridEstados").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridEstados").data("kendoGrid"), dataSourceEstados);

    if (Permisos.SNConfidencial === false) { $("#statusSection").hide();   }

    var seleRows2 = []
    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), seleRows2);
        _IdPiezaDesarrollada = fn_getIdPiezaDesarrollada($("#grid").data("kendoGrid"));
        let nombrePieza = fn_getNoPiezaDesarrollada($("#grid").data("kendoGrid"));
        if (_IdPiezaDesarrollada != undefined && Permisos.SNConfidencial === true) {
            $("#gridEstados").data("kendoGrid").dataSource.read();


            document.getElementById('lblstatus').innerHTML = "<h3>Cambios de estados de " + nombrePieza + " </h3>";
        }


    });

    


    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), $(window).height() - "371");
        Fn_Grid_Resize($("#gridEstados"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#grid"), $(window).height() - "371");

    Fn_Grid_Resize($("#gridEstados"), $(window).height() - "371");

    $("#ModalInfoComplementariaLab").kendoDialog({
        height: "60%",
        width: "40%",
        title: "Solicitud de laboratorio",
        visible: false,
        closable: true,
        modal: true,
        actions: [
            { text: '<span class="k-icon k-i-check"></span>&nbspCrear solicitud', primary: false, action: function () { return fn_CrearSolicitudLaboratorio(); } },
            { text: '<span class="k-icon k-i-cancel"></span>&nbsp;Cerrar' }
        ],
        close: function (e) {
           
        }
    });

    $("#NumCantLavadas").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });
    $("#NumCantQuemadas").kendoNumericTextBox({
        min: 0,
        max: 999999999,
        format: "#",
        restrictDecimals: true,
        decimals: 0,
        value: 0
    });


});

$("#btnCriteriosCalidad").click(function (e) {
    fn_CriteriosCriticos("CriteriosCriticos", fn_getIdPiezaDesarrollada($("#grid").data("kendoGrid")));
});

let fn_CriteriosCriticos = function (div, idPiezaDesarrollada, fnclose) {
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + div + "").children().length === 0) {
        $.ajax({
            url: "/PiezasDesarrolladas/CriteriosCriticos",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_CargarVistaModalCriteriosCriticos(resultado, div, idPiezaDesarrollada, fnclose);
            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_CargarVistaModalCriteriosCriticos("", div, idPiezaDesarrollada, fnclose);
    }
};

let fn_LimpiaModal = function () {
    $("#CmbCalidadPrueba").data("kendoComboBox").value("");
    $("#NumCantLavadas").data("kendoNumericTextBox").value("0");
    $("#NumCantQuemadas").data("kendoNumericTextBox").value("0");
    $("#ComentariosLab").data("kendoTextArea").value("");
    $("#SNLectura").is(':unchecked');
};


let fn_CrearSolicitudLaboratorio = function (ditem) {
    kendo.ui.progress($("#FrmPruebaGeneral"), true);
    
    $.ajax({
        url: TSM_Web_APi + "PruebasLaboratorio/Crear",
        type: "Post",
        dataType: "json",
        data: JSON.stringify({
            IdPruebaLaboratorio: 0,
            IdCalidadPrueba: $("#CmbCalidadPrueba").data("kendoComboBox").value(),
            Estado: 'ING',
            CantidadLavadas: $("#NumCantLavadas").data("kendoNumericTextBox").value(),
            CantidadQuemadas: $("#NumCantQuemadas").data("kendoNumericTextBox").value(),
           IdOrigenPrueba: 1,
           IdPlanta: dataItem.IdPlanta,//fn_getIdPLanta($("#grid").data("kendoGrid")),
           IdTurno: dataItem.IdTurno,//fn_getIdTurno($("#grid").data("kendoGrid")),
            Lectura: $("#SNLectura").is(':checked'),
            IdUsuario: getUser(),
            OrigenPieza: true,
            IdPiezaPrueba: dataItem.IdPiezaDesarrollada,//fn_getIdPiezaDesarrollada($("#grid").data("kendoGrid")),
            Comentario: $("#ComentariosLab").data("kendoTextArea").value(),
             IdCorte: null,
            IdBulto: 0,
            IdMaquina: 0,
            IdTipoOrdenTrabajo: 0,
            IdCatalogoDiseno: 0,
            IdCliente: 0



        }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
           
            RequestEndMsg(data, "Put");
            kendo.ui.progress($("#FrmPruebaGeneral"), false);

            fn_LimpiaModal();
            this.close();
            RequestEndMsg(data, "Post");

        },
        error: function (data) {

            kendo.ui.progress($("#FrmPruebaGeneral"), false);
            ErrorMsg(data);
            
        }
    });

};

let fn_CargarVistaModalCriteriosCriticos = function (data, divVerCriteriosCriticos, idPiezaDesarrollada, fnclose) {

    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    if (listJs.filter(listJs => listJs.toString().endsWith("_CriteriosCriticos.js")).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/_CriteriosCriticos.js";
        script.onload = function () {
            fn_ShowModalCriteriosCriticos(true, data, divVerCriteriosCriticos, idPiezaDesarrollada, fnclose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {
        fn_ShowModalCriteriosCriticos(false, data, divVerCriteriosCriticos, idPiezaDesarrollada, fnclose);
    }
};

let fn_ShowModalCriteriosCriticos = function (cargarJs, data, divVerCriteriosCriticos, idPiezaDesarrollada, fnclose) {
    let onShow = function () {
        if (cargarJs === true) {
            fn_InicializarCriteriosCriticos(idPiezaDesarrollada);
        } else {
            fn_CargarCriteriosCriticos(idPiezaDesarrollada);
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined || fn === "") {
            return true;
        } else {
            return fnclose();
        }
    };

    $("#" + divVerCriteriosCriticos + "").kendoDialog({
        height: "60%",
        width: "70%",
        title: "Resultados de Criterios de Calidad",
        closable: true,
        modal: {
            preventScroll: true
        },
        content: data,
        visible: false,
        //maxHeight: 800,
        minWidth: "50%",
        show: onShow,
        close: fn_CloseSIC
    });

    $("#" + divVerCriteriosCriticos + "").data("kendoDialog").open().toFront();    
};

let fn_ObtenerMuestras = function (xIdOrdenTrabajo) {
    if (xIdOrdenTrabajo !== undefined && xIdOrdenTrabajo !== null) {
        kendo.ui.progress($(document.body), true);
        _IdOrdenTrabajo = xIdOrdenTrabajo;
        $("#grid").data("kendoGrid").dataSource.read();
        kendo.ui.progress($(document.body), false);
    }
    else {
        _IdOrdenTrabajo = 0;
        $("#grid").data("kendoGrid").dataSource.read([]);
    }
};
let fn_getIdPiezaDesarrollada = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdPiezaDesarrollada;
};

let fn_getIdPLanta = function (g) {
    let SetPlanta = g.dataItem(g.select());
    return SetPlanta === null ? 0 : SetPlanta.IdPlanta;
};

let fn_getIdTurno = function (g) {
    let SetIdTurno = g.dataItem(g.select());
    return SetIdTurno === null ? 0 : SetIdTurno.IdPlanta;
};



let fn_getNoPiezaDesarrollada = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.NoPieza;
};

let fn_getEstadoPD = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.Estado;
};


fPermisos = function (datos) {
    Permisos = datos;
};