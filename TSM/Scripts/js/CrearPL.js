var banLoad = 0;
var banTReg = 0;
var NoPL = 0;
let tempEmb;

var fn_Ini_create =  (pJson) => {
    tempEmb = pJson;
    if (banLoad == 0) {
        KdoButton($("#btnGuardarPL"), "save", "Cambiar");
        KdoButton($("#btnCancelarPL"), "cancel", "Cancelar");
        $("#btnCancelarPL").on("click", function () {
            $("#vCrearPL").data("kendoWindow").close();
        });

        
        Kendo_CmbFiltrarGrid($("#cmbPL"), TSM_Web_APi + "ListaEmpaques/ListaEmpaques_GetListaEmpaquesEncabezadoOD/" + pJson.IdCabPL, "NoDocumento", "IdListaEmpaque", "Seleccione una lista de Empaque");

        $("#cmbPL").data("kendoComboBox").bind("select", function (e) {
            if (e.item) {
                let obs = this.dataItem(e.item.index()).Observacion;
                $("#TxtObservacionPL").val(obs);
            }
            else {
                $("#TxtObservacionPL").val("");
            }
        });

        $("#cmbPL").data("kendoComboBox").bind("change", function () {
            var value = this.value();
            if (value === "") {
                $("#TxtObservacionPL").val("");
            }
        });

        banLoad = 1;
    }

    $('#chkNuevoPL').prop('checked', true);
    $("#divPL").hide();

    $("#chkNuevoPL").click(function () {
        if (this.checked) {
            $("#divPL").hide("slow");
            banTReg = 0;
        } else {
            $("#divPL").show("slow");
            banTReg = 1;
        }
    });

    $("#btnGuardarPL").on("click", function () {
        if (banTReg==0) {
            $.ajax({
                url: TSM_Web_APi + "ListaEmpaquesEmbalajesMercancias/ListaEmpaque_AgregarEmbalajesMercancias",
                data: JSON.stringify({
                    IdDespachoListaEmpaque: tempEmb.IdCabPL,
                    IdListaEmpaque: null,
                    IdEmbalajeMercancias: tempEmb.Embalajes,
                    Observacion: $("#TxtObservacionPL").val(),
                    IdUsuario: getUser()
                }),
                type: "POST",
                dataType: "json",
                async: false,
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    cambioSuccess = 1;
                    $("#vCrearPL").data("kendoWindow").close();
                    $("#kendoNotificaciones").data("kendoNotification").show("Lista de Empaque creada existosamente", "success");
                    $("#gridEmbalaje").data("kendoGrid").dataSource.read();
                    $("#gridPL").data("kendoGrid").dataSource.read();
                },
                error: function (data) {
                    ErrorMsg(data);
                }

            });
        }
        else
        {
            NoPL = KdoCmbGetValue($("#cmbPL"));
            if (NoPL != 0 && NoPL != "" && NoPL != null && NoPL != undefined) {
                $.ajax({
                    url: TSM_Web_APi + "ListaEmpaquesEmbalajesMercancias/ListaEmpaque_AgregarEmbalajesMercancias",
                    data: JSON.stringify({
                        IdDespachoListaEmpaque: tempEmb.IdCabPL,
                        IdListaEmpaque: NoPL,
                        IdEmbalajeMercancias: tempEmb.Embalajes,
                        Observacion: $("#TxtObservacionPL").val(),
                        IdUsuario: getUser()
                    }),
                    type: "POST",
                    dataType: "json",
                    async: false,
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        cambioSuccess = 1;
                        $("#vCrearPL").data("kendoWindow").close();
                        $("#kendoNotificaciones").data("kendoNotification").show("Lista de Empaque creada existosamente", "success");
                        $("#gridEmbalaje").data("kendoGrid").dataSource.read();
                        $("#gridPL").data("kendoGrid").dataSource.read();
                    },
                    error: function (data) {
                        ErrorMsg(data);
                    }

                });
            }
            else
            {
                $("#kendoNotificaciones").data("kendoNotification").show("Debe seleccionar una Lista de Empaque.", "error");
            }
        }

    });

}

var fn_Reg_create = (pJson) => {
    tempEmb = pJson;
    if (banLoad == 0) {
        KdoButton($("#btnGuardarPL"), "save", "Cambiar");
        KdoButton($("#btnCancelarPL"), "cancel", "Cancelar");
        $("#btnCancelarPL").on("click", function () {
            $("#vCrearPL").data("kendoWindow").close();
        });

        Kendo_CmbFiltrarGrid($("#cmbPL"), TSM_Web_APi + "ListaEmpaques/ListaEmpaques_GetListaEmpaquesEncabezadoOD/" + pJson.IdCabPL, "NoDocumento", "IdListaEmpaque", "Seleccione una lista de Empaque");

        $("#cmbPL").data("kendoComboBox").bind("select", function (e) {
            if (e.item) {
                let obs = this.dataItem(e.item.index()).Observacion;
                $("#TxtObservacionPL").val(obs);
            }
            else {
                $("#TxtObservacionPL").val("");
            }
        });

        $("#cmbPL").data("kendoComboBox").bind("change", function () {
            var value = this.value();
            if (value === "") {
                $("#TxtObservacionPL").val("");
            }
        });

        banLoad = 1;
    }

    let dspl = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return TSM_Web_APi +
                        "ListaEmpaques/ListaEmpaques_GetListaEmpaquesEncabezadoOD/" + pJson.IdCabPL;
                },
                contentType: "application/json; charset=utf-8"
            }
        }
    });

    $("#cmbPL").data("kendoComboBox").setDataSource(dspl);

    $('#chkNuevoPL').prop('checked', true);
    $("#divPL").hide();

    $("#TxtObservacionPL").val("");
    KdoCmbSetValue($('#cmbPL'), "");

}