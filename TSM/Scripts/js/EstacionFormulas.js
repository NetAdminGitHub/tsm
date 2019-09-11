var fn_VistaEstacionFormulasDocuReady = function () {
    KdoButton($("#btnAddMForE"), "check", "Guardar");
    KdoButton($("#btnAddMFAjus"), "check", "Guardar");
    KdoButton($("#btnAddMFAjuste"), "gear", "Ajuste");
    KdoButton($("#btnAddMFEditar"), "edit", "Editar");
    KdoButton($("#btnAddMFAHistori"), "search", "Formulas Historica");
    KdoButton($("#btnConfirAjuste"), "check", "Confirmar");
    KdoButton($("#btnAcepAjuste"), "check", "Aceptar");

    kdoRbSetValue($("#rbAjuste"), true);

    $("#NumCntRecibidoAjus").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });
    $("#NumCntRecibida").kendoNumericTextBox({
        min: 0.00,
        max: 99999999999999.99,
        format: "{0:n2}",
        restrictDecimals: false,
        decimals: 2,
        value: 0
    });

    $("#TxtNombreQuiForm").val(NombreQui);

    $("#btnAddMForE").data("kendoButton").bind("click", function (e) {
        e.preventDefault();
        $("#MEstacionFormulas").modal('hide');
        //if (frmColor.validate()) {
        //    fn_GuardarEstacionColor();

        //} else {
        //    $("#kendoNotificaciones").data("kendoNotification").show("Debe completar los campos requeridos", "error");
        //}

    });
   

    fn_gridFormulas($("#gridFormulas"));
    fn_gridMateriaPrima($("#gridFormulasMP"));
    fn_gridAjustePrima($("#gridFormulasAjusMP"));

    $("#MbtnAjuste").kendoDialog({
        height: "auto",
        width: "60%",
        title: "Crear Ajuste",
        closable: true,
        modal: true,
        visible: false,
        maxHeight: 900
        //actions: [
        //    { text: '<span class="k-icon k-i-check"></span>&nbspAceptar', primary: true },
        //    { text: '<span class="k-icon k-i-cancel"></span>&nbspCancelar' }

        //],
        //show: onShow
        //initOpen: onInitOpen,
        //open: onOpen,
        //close: onClose,
        //show: onShow,
        //hide: onHide

    });
    $("#MbtnEditForm").kendoDialog({
        height: "auto",
        width: "60%",
        title: "Ajuste de formulas",
        closable: true,
        modal: true,
        visible: false,
        maxHeight: 900
        //actions: [
        //    { text: '<span class="k-icon k-i-check"></span>&nbspAceptar', primary: true },
        //    { text: '<span class="k-icon k-i-cancel"></span>&nbspCancelar' }

        //],
        //show: onShow
        //initOpen: onInitOpen,
        //open: onOpen,
        //close: onClose,
        //show: onShow,
        //hide: onHide

    });

    $("#btnAddMFEditar").bind("click", function () {
        $("#MbtnEditForm").data("kendoDialog").open();
    });

    $("#btnAddMFAjuste").bind("click", function () {
        $("#MbtnAjuste").data("kendoDialog").open();
    });
};

var fn_VistaEstacionFormulas = function () {
    TextBoxEnable($("#TxtOpcSelecFormulas"), false);
    TextBoxEnable($("#TxtNombreQuiForm"), false);
    $("#TxtOpcSelecFormulas").val($("#TxtOpcSelecFormulas").data("name"));
    idBra = $("#TxtOpcSelecFormulas").data("IdBrazo").replace("TxtInfo", "").replace("txtEdit", "");
    Te = $("#TxtOpcSelecFormulas").data("Formulacion");
    setFor = fn_GetMarcoFormulacion(maq[0].IdSeteo, idBra);
    if (setFor !== null) {
        switch (Te) {
            case "COLOR":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelecFormulas").data("IdRequerimientoColor", setFor.IdRequerimientoColor === undefined ? "" : setFor.IdRequerimientoColor);
                $("#" + ModalEstacion + "").find('[id="OpcSelecFormulas"]').text('Nombre de Color');
                $("#TxtOpcSelecFormulas").val(setFor.NomIdRequerimientoColor === undefined ? "" : setFor.NomIdRequerimientoColor);
                break;
            case "TECNICA":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelecFormulas").data("IdRequerimientoTecnica", setFor.IdRequerimientoTecnica === undefined ? "" : setFor.IdRequerimientoTecnica);
                $("#" + ModalEstacion + "").find('[id="OpcSelecFormulas"]').text('Nombre de Técnica');
                $("#TxtOpcSelecFormulas").val(setFor.NomIdTecnica === undefined ? "" : setFor.NomIdTecnica);
                break;
            case "BASE":
                //guardo en Memoria la llave del tipo de selección
                $("#TxtOpcSelecFormulas").data("IdBase", setFor.IdBase === undefined ? "" : setFor.IdBase);
                $("#" + ModalEstacion + "").find('[id="OpcSelecFormulas"]').text('Nombre de Base');
                $("#TxtOpcSelecFormulas").val(setFor.NomIdBase === undefined ? "" : setFor.NomIdBase);
                break;
        }
    }
};

var fn_gridFormulas = function (gd) {

    var dsFormulas = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url:  "https://www.mocky.io/v2/5d72cf982f0000fda57d4e9e",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            //update: {
            //    url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicas/" + datos.IdRequerimientoTecnica; },
            //    type: "PUT",
            //    contentType: "application/json; charset=utf-8"
            //},
            //destroy: {
            //    url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicas/" + datos.IdRequerimientoTecnica; },
            //    type: "DELETE"
            //},
            //create: {
            //    url: TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicas",
            //    type: "POST",
            //    contentType: "application/json; charset=utf-8"

            //},
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        schema: {
            model: {
                id: "IdBalanceo",
                fields: {
                    IdBalanceo: {
                        type: "number"

                    },
                    Fecha: {
                        type: "date"
                    },
                    MasaEntregada: {
                        type: "number"

                    },
                    Devolucion: {
                        type: "number"

                    },
                    Total: {
                        type: "number"

                    },
                    Motivo: {
                        type: "number"
                    },
                    NombreMotivo: {
                        type: "string"
                    },
                    Estado: {
                        type: "string"
                    }
                }
            }
        }

    });

    let Urltec = TSM_Web_APi + "Tecnicas";
    //CONFIGURACION DEL GRID,CAMPOS
    gd.kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdBalanceo", title: "Código. Balanceo" },
            { field: "Fecha", title: "Fecha", format: "{0: dd/MM/yyyy HH:mm:ss.ss}" },
            { field: "MasaEntregada", title: "Masa Entregada", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2]  },
            { field: "Devolucion", title: "Devolucion", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2] },
            { field: "Total", title: "Total", editor: Grid_ColNumeric, values: ["required", "0", "999999999999999999", "#", 0] },
            { field: "Motivo", title: "Motivo",hidden:true },
            { field: "NombreMotivo", title: "Nombre Motivo" },
            { field: "Estado", title: "Estado" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si,250);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsFormulas);

    var srow2 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow2);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow2);
    });

};

var fn_gridMateriaPrima = function (gd) {

    var dsMp = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: "https://www.mocky.io/v2/5d72dfd02f00007ca57d4eaf",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            //update: {
            //    url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicas/" + datos.IdRequerimientoTecnica; },
            //    type: "PUT",
            //    contentType: "application/json; charset=utf-8"
            //},
            //destroy: {
            //    url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicas/" + datos.IdRequerimientoTecnica; },
            //    type: "DELETE"
            //},
            //create: {
            //    url: TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicas",
            //    type: "POST",
            //    contentType: "application/json; charset=utf-8"

            //},
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        schema: {
            model: {
                id: "Articulo",
                fields: {
                    Articulo: {
                        type: "string"

                    },
                    Nombre: {
                        type: "string"

                    },
                    Masa: {
                        type: "number"

                    },
                    Porcentaje: {
                        type: "number"

                    }
                }
            }
        },
        aggregate: [
            { field: "Porcentaje", aggregate: "sum" }
        ]

    });

    let Urltec = TSM_Web_APi + "Tecnicas";
    //CONFIGURACION DEL GRID,CAMPOS
    gd.kendoGrid({
        edit: function (e) {
            // Ocultar
            KdoHideCampoPopup(e.container, "Nombre");
            Grid_Focus(e, "Articulo");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "Articulo", title: "Materia Prima" },
            { field: "Nombre", title: "Nombre" },
            { field: "Masa", title: "Masa", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2] },
            { field: "Porcentaje", title: "Porcentaje", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "Total: #: data.Porcentaje ? sum*100: 0 #" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si,250);
    SetGrid_CRUD_Command(gd.data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsMp);

    var srow3 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow3);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow3);
    });

};

var fn_gridAjustePrima = function (gd) {

    var dsAjusMp = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: "https://www.mocky.io/v2/5d7588af3100004b3395063f",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            //update: {
            //    url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicas/" + datos.IdRequerimientoTecnica; },
            //    type: "PUT",
            //    contentType: "application/json; charset=utf-8"
            //},
            //destroy: {
            //    url: function (datos) { return TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicas/" + datos.IdRequerimientoTecnica; },
            //    type: "DELETE"
            //},
            //create: {
            //    url: TSM_Web_APi + "RequerimientoDesarrollosMuestrasTecnicas",
            //    type: "POST",
            //    contentType: "application/json; charset=utf-8"

            //},
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        schema: {
            model: {
                id: "Articulo",
                fields: {
                    Articulo: {
                        type: "string"

                    },
                    Nombre: {
                        type: "string"

                    },
                    MasInicial: {
                        type: "number"

                    },
                    Porcentaje: {
                        type: "number"

                    },
                    MasaAdicional: {
                        type: "number"

                    },
                    PorcentajeAd: {
                        type: "number"

                    },
                    MasaFinal: {
                        type: "number"

                    },
                    PorcentajeFinal: {
                        type: "number"

                    }

                }
            }
        },
        aggregate: [
            { field: "Porcentaje", aggregate: "sum" },
            { field: "PorcentajeAd", aggregate: "sum" },
            { field: "PorcentajeFinal", aggregate: "sum" }
        ]

    });

    let Urltec = TSM_Web_APi + "Tecnicas";
    //CONFIGURACION DEL GRID,CAMPOS
    gd.kendoGrid({
        edit: function (e) {
            // Ocultar
            KdoHideCampoPopup(e.container, "Nombre");
            Grid_Focus(e, "Articulo");
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "Articulo", title: "Materia Prima" },
            { field: "Nombre", title: "Nombre" },
            { field: "MasInicial", title: "MasInicial", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2] },
            { field: "Porcentaje", title: "Porcentaje", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "Total: #: data.Porcentaje ? sum*100: 0 #" },
            { field: "MasaAdicional", title: "MasaAdicional", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2] },
            { field: "PorcentajeAd", title: "PorcentajeAd", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "Total: #: data.MasaAdicional ? sum*100: 0 #" },
            { field: "MasaFinal", title: "MasaFinal", editor: Grid_ColNumeric, values: ["required", "0.00", "9999999999999999.99", "n2", 2] },
            { field: "PorcentajeFinal", title: "PorcentajeFinal", editor: Grid_ColNumeric, values: ["required", "0", "1", "P2", 4, "0.01"], format: "{0:P2}", footerTemplate: "Total: #: data.PorcentajeFinal ? sum*100: 0 #" }
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 300);
    SetGrid_CRUD_Command(gd.data("kendoGrid"), Permisos.SNEditar, false);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsAjusMp);

    var srow3 = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srow3);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srow3);
    });

};
fn_PWList.push(fn_VistaEstacionFormulas);
fn_PWConfList.push(fn_VistaEstacionFormulasDocuReady);