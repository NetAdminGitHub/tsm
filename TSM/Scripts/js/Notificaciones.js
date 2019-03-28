var Permisos;

$(document).ready(function () {
    var vIdTN = 0;
    var vIdN = 0;
    Kendo_CmbFiltrarGrid($("#cmbTipoNoti"), UrlTN, "Nombre", "IdTipoNotificacion", "Seleccione un notificación...");

    //#region Programacion Grid estapas procesos
    var dataSource = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlN + "/GetNotificacionesByIdTipoNotificacion/" + vIdTN; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return UrlN + "/" + datos.IdNotificacion; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlN + "/" + datos.IdNotificacion; },
                dataType: "json",
                type: "DELETE"
            },
            create: {
                url: UrlN,
                dataType: "json",
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
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdNotificacion",
                fields: {
                    IdNotificacion: {
                        type: "string", 
                        validation: {
                            required: true
                        }},
                    IdTipoNotificacion: {
                        type: "number",
                        defaultValue: function (e) {
                            return $("#cmbTipoNoti").val();
                        }
                    },
                    Asunto: {
                        type: "string",
                        validation: {
                            required: true
                        }
                    },
                    Cuerpo: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Asunto']") && input.val().length > 300) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 300");
                                    return false;
                                }
                                if (input.is("[name='Cuerpo']") && input.val().length > 8000) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 8000");
                                    return false;
                                }
                                if (input.is("[name='Estado']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#Estado").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    Prioridad: { type: "string" },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    Estado: { type: "string" },
                    Nombre1: { type: "string" }
                }
            }
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    $("#grid").kendoGrid({
        edit: function (e) {
            //$(e.container).parent().css({
            //    width: '1000px',
             
            //});
            // S BLOQUEA CAMPO LLAVE ( ID)
 
            KdoHideCampoPopup(e.container, "IdTipoNotificacion");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            $('[name="Asunto"').attr('mayus', 'no');
            KdoHideCampoPopup(e.container, "Nombre1");
            $('[name="Cuerpo"').attr('mayus', 'no');
            Grid_Focus(e, "IdTipoNotificacion");
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdNotificacion", title: "Cod. Notificacion" },
            { field: "IdTipoNotificacion", title: "Código tipo notificación", hidden: true },
            { field: "Asunto", title: "Asunto" },
            { field: "Cuerpo", title: "Cuerpo Notificación" },
            { field: "Prioridad", title: "Prioridad", editor: PrioridadDropDownEditor},
            { field: "IdUsuarioMod", title: "IdUsuarioMod", hidden: true },
            { field: "FechaMod", title: "FechaMod", format: "{0:dd/MM/yyyy HH:mm:ss}", hidden: true },
            { field: "Nombre1", title: "Estado" },
            { field: "Estado", title: "Estado", values: ["Estado", "Nombre", UrlE, "Notificaciones", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#grid").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#grid").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#grid").data("kendoGrid"), dataSource);
    Kendo_CmbFocus($("#cmbTipoNoti"));
    Grid_HabilitaToolbar($("#grid"), false, false, false);

    var selectedRows = [];
    $("#grid").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#grid"), selectedRows);
    });

    $("#grid").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#grid"), selectedRows);
        fn_consultargridNV();
        fn_consultargridND();
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    });

    Fn_Grid_Resize($("#grid"), $(window).height() - "371");
    //#endregion 

    //#region Programacion Etapas Procesos Siguientes
    var dsNotiV = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UrlNV + "/GetNotificacionesVariablesByIdNotificacion/" + vIdN; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UrlNV + "/" + datos.IdNotificacion + "/"+ datos.Campo; },
                dataType: "json",
                type: "DELETE"
            },
            update: {
                url: function (datos) { return UrlNV + "/" + datos.IdNotificacion + "/"+ datos.Campo; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: UrlNV,
                dataType: "json",
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
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "Campo",
                fields: {
                    Campo: {
                        type: "string",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='Campo']") && input.val().length > 20) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 300");
                                    return false;
                                }
                                if (input.is("[name='Formula']") && input.val().length > 8000) {
                                    input.attr("data-maxlength-msg", "Longitud máxima del campo es 8000");
                                    return false;
                                }
                                return true;
                            }
                        }
                    },
                    Formula: { type: "string" },
                    IdNotificacion: {
                        type: "string",
                        defaultValue: function (e) {
                            return fn_GetIdNoti($("#grid").data("kendoGrid"));
                        }
                    },
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" }
                }
            }
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridNV").kendoGrid({
        edit: function (e) {
            // S BLOQUEA CAMPO LLAVE ( ID)
            KdoHideCampoPopup(e.container, "IdNotificacion");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            $('[name="Formula"').attr('mayus', 'no');
            if (e.model.isNew()) {
                Grid_Focus(e, "Campo");
            } else {
                Grid_Focus(e, "Formula");
                KdoHideCampoPopup(e.container, "Campo");
            }
           
        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdNotificacion", title: "Código de Notificación",  hidden: true },
            { field: "Campo", title: "Campo" },
            { field: "Formula", title: "Formula" },
            { field: "IdUsuarioMod", title: "IdUsuarioMod", hidden: true },
            { field: "FechaMod", title: "FechaMod", format: "{0:dd/MM/yyyy HH:mm:ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridNV").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridNV").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridNV").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridNV").data("kendoGrid"), dsNotiV);
    Grid_HabilitaToolbar($("#gridNV"), false, false, false);

    var selRowsSig = [];
    $("#gridNV").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridNV"), selRowsSig);
    });

    $("#gridNV").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridNV"), selRowsSig);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridNV"), ($(window).height() - "420") / 2);
    });

    Fn_Grid_Resize($("#gridNV"), ($(window).height() - "420") / 2);

    //#endregion

    //#region Programacion Etapas Procesos Anteriores
    var dSNotiDes = new kendo.data.DataSource({
        dataType: "json",
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return UlrNVD + "/GetNotificacionesDestinatariosByIdNotificacion/" + vIdN; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            destroy: {
                url: function (datos) { return UlrNVD + "/" + datos.IdNotificacion + "/" + datos.Item; },
                dataType: "json",
                type: "DELETE"
            },
            update: {
                url: function (datos) { return UlrNVD + "/" + datos.IdNotificacion + "/" + datos.Item; },
                dataType: "json",
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            create: {
                url: UlrNVD,
                dataType: "json",
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
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "Item",
                fields: {
                    Item: {
                        type: "number",
                        validation: {
                            required: true,
                            maxlength: function (input) {
                                if (input.is("[name='IdUsuario']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdUsuario").data("kendoComboBox").selectedIndex >= 0;
                                }
                                if (input.is("[name='IdRol']")) {
                                    input.attr("data-maxlength-msg", "Requerido");
                                    return $("#IdRol").data("kendoComboBox").selectedIndex >= 0;
                                }
                                return true;
                            }
                        }
                    },
                    IdUsuario: { type: "string", defaultValue: null },
                    Nombre: { type: "string" },
                    IdRol: { type: "string", defaultValue: null },
                    Nombre1: { type: "string" },
                    Correo: { type: "string", defaultValue: null },
                    IdNotificacion: {
                        type: "string",
                        defaultValue: function (e) {
                            return fn_GetIdNoti($("#grid").data("kendoGrid"));
                        }
                    },
                  
                    IdUsuarioMod: { type: "string" },
                    FechaMod: { type: "date" },
                    Opcion: {type:"string"}
                }
            }
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridND").kendoGrid({
        edit: function (e) {
            // S BLOQUEA CAMPO LLAVE ( ID)
            KdoHideCampoPopup(e.container, "IdNotificacion");
            KdoHideCampoPopup(e.container, "Item");
            KdoHideCampoPopup(e.container, "Nombre");
            KdoHideCampoPopup(e.container, "Nombre1");
            KdoHideCampoPopup(e.container, "IdUsuarioMod");
            KdoHideCampoPopup(e.container, "FechaMod");
            $('[name="Correo"').attr('mayus', 'no');
            if (e.model.isNew()) {
                TextBoxEnable($('[name="Correo"]'), false);
                KdoComboBoxEnable($('[name="IdRol"]'), false);
                KdoComboBoxEnable($('[name="IdUsuario"]'), false);
            } else {

                if ($('[name="IdRol"]').data("kendoComboBox").value() !== "" && $('[name="IdUsuario"]').data("kendoComboBox").value() === "" && $('[name="Correo"]').val() === "") {
                    $('[name="Opcion"]').data("kendoDropDownList").value("1");
                }
                if ($('[name="IdRol"]').data("kendoComboBox").value() === "" && $('[name="IdUsuario"]').data("kendoComboBox").value() !== "" && $('[name="Correo"]').val() === "") {
                    $('[name="Opcion"]').data("kendoDropDownList").value("2");
                }
                if ($('[name="IdRol"]').data("kendoComboBox").value() === "" && $('[name="IdUsuario"]').data("kendoComboBox").value() === "" && $('[name="Correo"]').val() !== "") {
                    $('[name="Opcion"]').data("kendoDropDownList").value("3");
                }

                fn_habilita($('[name="Opcion"]').data("kendoDropDownList").value());

            }

            $('[name="Opcion"]').on('change', function (e) {
                fn_Limpiar();
                fn_habilita($('[name="Opcion"]').data("kendoDropDownList").value());
            });
            Grid_Focus(e, "IdUsuario");
          

        },

        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdNotificacion", title: "Código de Notificacion", hidden: true },
            { field: "Item", title: "item", editor:Grid_ColIntNumSinDecimal,hidden:true},
            { field: "Opcion", title: "Opción", editor: OpcionesDropDownEditor, hidden: true},
            { field: "IdUsuario", title: "Usuario", values: ["IdUsuario", "Nombre", UrlU, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre", title: "Usuario" },
            { field: "IdRol", title: "Rol", values: ["IdRol", "Nombre", UrlR, "", "Seleccione....", "required", "", "requerido"], editor: Grid_Combox, hidden: true },
            { field: "Nombre1", title: "Rol" },
            { field: "Correo", title: "Correo" },
            { field: "IdUsuarioMod", title: "IdUsuarioMod", hidden: true },
            { field: "FechaMod", title: "FechaMod", format: "{0:dd/MM/yyyy HH:mm:ss}", hidden: true }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridND").data("kendoGrid"), ModoEdicion.EnPopup, false, true, true, true, redimensionable.Si);
    SetGrid_CRUD_ToolbarTop($("#gridND").data("kendoGrid"), Permisos.SNAgregar);
    SetGrid_CRUD_Command($("#gridND").data("kendoGrid"), Permisos.SNEditar, Permisos.SNBorrar);
    Set_Grid_DataSource($("#gridND").data("kendoGrid"), dSNotiDes);
    Grid_HabilitaToolbar($("#gridND"), false, false, false);

    var fn_habilita = function (opc) {
        switch (opc) {
            case "1":
                TextBoxEnable($('[name="Correo"]'), false);
                KdoComboBoxEnable($('[name="IdRol"]'), true);
                KdoComboBoxEnable($('[name="IdUsuario"]'), false);
                $('[name="IdRol"]').data("kendoComboBox").input.focus();

                break;
            case "2":
                TextBoxEnable($('[name="Correo"]'), false);
                KdoComboBoxEnable($('[name="IdRol"]'), false);
                KdoComboBoxEnable($('[name="IdUsuario"]'), true);
                $('[name="IdUsuario"]').data("kendoComboBox").input.focus();
                break;

            case "3":
                TextBoxEnable($('[name="Correo"]'), true);
                KdoComboBoxEnable($('[name="IdRol"]'), false);
                KdoComboBoxEnable($('[name="IdUsuario"]'), false);
                $('[name="Correo"]').focus().select();

                break;
        }
    };
    var fn_Limpiar = function () {
        $('[name="Correo"]').val("");
        $('[name="IdRol"]').data("kendoComboBox").value("");
        $('[name="IdUsuario"]').data("kendoComboBox").value("");
    };

    var selRowsAnt = [];
    $("#gridND").data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow($("#gridND"), selRowsAnt);
    });

    $("#gridND").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridND"), selRowsAnt);
    });

    $(window).on("resize", function () {
        Fn_Grid_Resize($("#gridND"), ($(window).height() - "420") / 2);
    });

    Fn_Grid_Resize($("#gridND"), ($(window).height() - "420") / 2);
    //#endregion 



    //#region Programacion Combobox
    $("#cmbTipoNoti").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            vIdTN = this.dataItem(e.item.index()).IdTipoNotificacion;
            Fn_consultar();
        }
        else {
            vIdTN = 0;
            Grid_HabilitaToolbar($("#grid"), false, false, false);
            Grid_HabilitaToolbar($("#gridNV"), false, false, false);
            Grid_HabilitaToolbar($("#gridND"), false, false, false);
        }
    });
    $("#cmbTipoNoti").data("kendoComboBox").bind("change", function (e) {
        var value = this.value();
        if (value === "") {
            vIdTN = 0;
            $("#grid").data("kendoGrid").dataSource.data([]);
            $("#gridNV").data("kendoGrid").dataSource.data([]);
            $("#gridND").data("kendoGrid").dataSource.data([]);
            Grid_HabilitaToolbar($("#grid"), false, false, false);
            Grid_HabilitaToolbar($("#gridNV"), false, false, false);
            Grid_HabilitaToolbar($("#gridND"), false, false, false);
        }
    });
    //#endregion

    //#region metodos generales
    var Fn_consultar = function () {
        $("#grid").data("kendoGrid").dataSource.read().then(function () {
            fn_consultargridNV();
            fn_consultargridND();
        });
        Grid_HabilitaToolbar($("#grid"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar);
    };
    var fn_consultargridNV = function () {
        vIdN = fn_GetIdNoti($("#grid").data("kendoGrid"));
        $("#gridNV").data("kendoGrid").dataSource.read();
        $("#grid").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#gridNV"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#gridNV"), false, false, false);
    };
    var fn_consultargridND = function () {
        vIdN = fn_GetIdNoti($("#grid").data("kendoGrid"));
        $("#gridND").data("kendoGrid").dataSource.read();
        $("#grid").data("kendoGrid").dataSource.total() > 0 ? Grid_HabilitaToolbar($("#gridND"), Permisos.SNAgregar, Permisos.SNEditar, Permisos.SNBorrar) : Grid_HabilitaToolbar($("#gridND"), false, false, false);
    };
    //#endregion 

    function PrioridadDropDownEditor(container, options) {
        var ddlDataSource = [{
            value: "A",
            displayValue: "Alta"
        },
        {
            value: "M",
            displayValue: "Media"
        },
        {
            value: "B",
            displayValue: "Baja"
        }
        ];

        $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                dataTextField: "displayValue",
                dataValueField: "value",
                dataSource: ddlDataSource
            });
    }

    function OpcionesDropDownEditor(container, options) {
        var ddlDataSource = [{
            value: 1,
            displayValue: "Opción Rol"
        },
        {
            value: 2,
            displayValue: "Opción Usuario"
        },
        {
            value: 3,
            displayValue: "Opción Correo"
        }
        ];

        $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                dataTextField: "displayValue",
                dataValueField: "value",
                dataSource: ddlDataSource
            });
    }

});

var fn_GetIdNoti = function (g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.IdNotificacion;

};


fPermisos = function (datos) {
    Permisos = datos;
};