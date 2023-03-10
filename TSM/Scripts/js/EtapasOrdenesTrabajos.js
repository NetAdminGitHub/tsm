var Permisos;
let ListadoOT;
let xIdOrdenTrabajo;
let xIdEtapaProceso;
let xItem;
let xIdUsuarioTo;
let xIdUsuarioFrom;
let Mul1;
let Mul2;
let Mul3;
var fn_VerOt = function (xidOrdenTrabajo, xidEtapaProceso) {
    window.location.href = "/OrdenesTrabajo/ElementoTrabajo/" + xidOrdenTrabajo + "/" + xidEtapaProceso;
};
var fn_VerKanbanAsig = function (xidOrdenTrabajo, xidEtapaProceso) {
    window.location.href = "/GestionOTAsignaciones/" + xidEtapaProceso + "/" + xidOrdenTrabajo;
};
$(document).ready(function () {



    let dtfecha = new Date();

    Kendo_CmbFiltrarGrid($("#CmbEtapasProcesos"), TSM_Web_APi + "EtapasProcesos/GetByModuloActivas/2", "Nombre", "IdEtapaProceso", "Seleccione una etapa", "");
    KdoCmbSetValue($("#CmbEtapasProcesos"), sessionStorage.getItem("eOT_CmbEtapasProcesos") === null ? "" : sessionStorage.getItem("eOT_CmbEtapasProcesos")); 

    Kendo_CmbFiltrarGrid($("#CmbTiposOrdenesTrabajos"), TSM_Web_APi + "TiposOrdenesTrabajos", "Nombre", "IdTipoOrdenTrabajo", "Seleccione un Tipo de Orden de trabajo", "");
    KdoCmbSetValue($("#CmbTiposOrdenesTrabajos"), sessionStorage.getItem("eOT_CmbTiposOrdenesTrabajos") === null ? "" : sessionStorage.getItem("eOT_CmbTiposOrdenesTrabajos")); 

    Kendo_CmbFiltrarGrid($("#CmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Selecione un cliente...");
    KdoCmbSetValue($("#CmbCliente"), sessionStorage.getItem("eOT_CmbCliente") === null ? "" : sessionStorage.getItem("eOT_CmbCliente")); 


    $("#CmbPrograma").ControlSelecionPrograma();
    //KdoMultiColumnCmbSetValue($("#CmbPrograma"), sessionStorage.getItem("eOT_CmbPrograma") === null ? "" : sessionStorage.getItem("eOT_CmbPrograma")); 
    if (sessionStorage.getItem("eOT_CmbPrograma") !== null && sessionStorage.getItem("eOT_CmbPrograma") !== "") {
        Mul3 = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        Mul3.search(sessionStorage.getItem("eOT_NombrePrograma"));
        Mul3.text(sessionStorage.getItem("eOT_NombrePrograma") === null ? "" : sessionStorage.getItem("eOT_NombrePrograma"));
        Mul3.trigger("change");
        Mul3.close();

    }


    $("#CmbOrdenTrabajo").ControlSeleccionOrdenesTrabajos();
    //KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), sessionStorage.getItem("eOT_CmbOrdenTrabajo") === null ? "" : sessionStorage.getItem("eOT_CmbOrdenTrabajo")); 
    if (sessionStorage.getItem("eOT_CmbOrdenTrabajo") !== null && sessionStorage.getItem("eOT_CmbOrdenTrabajo") !== "") {
        Mul1 = $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox");
        Mul1.search(sessionStorage.getItem("eOT_NoDocumento"));
        Mul1.text(sessionStorage.getItem("eOT_NoDocumento") === null ? "" : sessionStorage.getItem("eOT_NoDocumento"));
        Mul1.trigger("change");
        Mul1.close();
    }


    $("#dFechaDesde").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaDesde").data("kendoDatePicker").value(sessionStorage.getItem("eOT_dFechaDesde") === null ? kendo.toString(kendo.parseDate(new Date(dtfecha.getFullYear(), dtfecha.getMonth() - 1, dtfecha.getUTCDate())), 's') : sessionStorage.getItem("eOT_dFechaDesde"));
    $("#dFechaHasta").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaHasta").data("kendoDatePicker").value(Fhoy());
    $("#dFechaHasta").data("kendoDatePicker").value(sessionStorage.getItem("eOT_dFechaHasta") === null ? Fhoy() : sessionStorage.getItem("eOT_dFechaHasta"));

    $('#chkRangFechas').prop('checked', sessionStorage.getItem("eOT_chkRangFechas") === null ? 0 : sessionStorage.getItem("eOT_chkRangFechas") === "true" ? 1 : 0);
    $('#chkMe').prop('checked', sessionStorage.getItem("eOT_chkMe") === null ? 0 : sessionStorage.getItem("eOT_chkMe") === "true" ? 1 : 0);

    KdoDatePikerEnable($("#dFechaDesde"), false);
    KdoDatePikerEnable($("#dFechaHasta"), false);
   

    $("#CmbTiposOrdenesTrabajos").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );

            sessionStorage.setItem("eOT_CmbTiposOrdenesTrabajos", "");
        }

        
    });


    $("#CmbCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                this.dataItem(e.item.index()).IdCliente,
                KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
                $("#chkRangFechas").is(':checked')=== false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );

            sessionStorage.setItem("eOT_CmbCliente", this.dataItem(e.item.index()).IdCliente);
        }
        else {
            fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                null, KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'),
                KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );

            sessionStorage.setItem("eOT_CmbCliente","");
        }
    });

    $("#CmbCliente").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                null, KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'),
                KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );

            sessionStorage.setItem("eOT_CmbCliente", "");
        }
    });

    //$("#CmbPrograma").data("kendoMultiColumnComboBox").bind("select", function (e) {
    //    if (e.item) {
    //        fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
    //            this.dataItem(e.item.index()).IdCliente,
    //            this.dataItem(e.item.index()).IdPrograma,
    //            $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
    //            $("#chkRangFechas").is(':checked')=== false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
    //            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
    //            $("#chkMe").is(':checked')
    //        );

    //        sessionStorage.setItem("eOT_CmbPrograma", this.dataItem(e.item.index()).IdPrograma);


    //    } else {
    //        fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
    //            KdoCmbGetValue($("#CmbCliente")),
    //            null, $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
    //            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
    //            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
    //            $("#chkMe").is(':checked')
    //        );

    //        sessionStorage.setItem("eOT_CmbPrograma", "");
    //    }
    //});

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
        if (data === undefined) {
            fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                null, $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );

            sessionStorage.setItem("eOT_CmbPrograma", "");
            sessionStorage.setItem("eOT_NombrePrograma", "");

        } else {

            fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                data.IdPrograma, $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );

            sessionStorage.setItem("eOT_CmbPrograma", data.IdPrograma);
            sessionStorage.setItem("eOT_NombrePrograma", data.Nombre);
        }

    });


    //$("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("select", function (e) {
    //    if (e.item) {
          
    //        fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), this.dataItem(e.item.index()).IdOrdenTrabajo,
    //            this.dataItem(e.item.index()).IdCliente,
    //            this.dataItem(e.item.index()).IdPrograma, $("#chkVerTodas").is(':checked'),
    //            KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
    //            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
    //            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
    //            $("#chkMe").is(':checked')
    //        );

    //        sessionStorage.setItem("eOT_CmbOrdenTrabajo", this.dataItem(e.item.index()).IdOrdenTrabajo);
    //        sessionStorage.setItem("eOT_NoDocumento", this.dataItem(e.item.index()).NoDocumento);

    //    } else {
    //        fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), null,
    //            KdoCmbGetValue($("#CmbCliente")),
    //            KdoMultiColumnCmbGetValue($("#CmbPrograma"))
    //            , $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
    //            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
    //            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
    //            $("#chkMe").is(':checked')
    //        );

    //        sessionStorage.setItem("eOT_CmbOrdenTrabajo", "");
    //        sessionStorage.setItem("eOT_NoDocumento", "");
    //    }
    //});
   

    $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdOrdenTrabajo === Number(this.value()));
        if (data === undefined) {
            fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), null,
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                $("#chkVerTodas").is(':checked'),
                KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );

            sessionStorage.setItem("eOT_CmbOrdenTrabajo", "");
            sessionStorage.setItem("eOT_NoDocumento", "");
        } else {
            fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), data.IdOrdenTrabajo,
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                $("#chkVerTodas").is(':checked'),
                KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );
            sessionStorage.setItem("eOT_CmbOrdenTrabajo", data.IdOrdenTrabajo);
            sessionStorage.setItem("eOT_NoDocumento", data.NoDocumento);
        }

    });

    $("#dFechaDesde").data("kendoDatePicker").bind("change", function () {
        fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
            $("#chkMe").is(':checked')
        );

        sessionStorage.setItem("eOT_dFechaDesde", kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'));
    });

    $("#dFechaHasta").data("kendoDatePicker").bind("change", function () {
        fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
            $("#chkMe").is(':checked')
        );
        sessionStorage.setItem("eOT_dFechaHasta", kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'));
    });
    $("#chkVerTodas").click(function () {
        fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma"))
            , this.checked, KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
            $("#chkMe").is(':checked')
        );
        sessionStorage.setItem("eOT_chkVerTodas", this.checked);
    });

    $("#chkRangFechas").click(function () {

        KdoDatePikerEnable($("#dFechaDesde"), this.checked);
        KdoDatePikerEnable($("#dFechaHasta"), this.checked);
        fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
            this.checked === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            this.checked === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
            $("#chkMe").is(':checked')
        );

        sessionStorage.setItem("eOT_chkRangFechas", this.checked);
    });

    $("#chkMe").click(function () {
        fn_ObtenerOTs(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
            this.checked === false ? null : $("#chkRangFechas").is(':checked') ? kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'):null,
            this.checked === false ? null : $("#chkRangFechas").is(':checked') ? kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'):null,
            $("#chkMe").is(':checked')
        );

        sessionStorage.setItem("eOT_chkMe", this.checked);
    });


    if (Catalogo_IdOrdenTrabajo > 0) {
        KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), Catalogo_IdOrdenTrabajo);
        $('#chkVerTodas').prop('checked', 1);
        $('#chkRangFechas').prop('checked', 0);
        $("#chkMe").prop('checked', 0);
        fn_ObtenerOTs(null, Catalogo_IdOrdenTrabajo, null, null, $("#chkVerTodas").is(':checked'), null, $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'), $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'), $("#chkMe").is(':checked'));
    } else {
        $('#chkVerTodas').prop('checked', sessionStorage.getItem("eOT_chkVerTodas") === "true" ? 1 : 0);
        $('#chkRangFechas').prop('checked', sessionStorage.getItem("eOT_chkRangFechas") === "true" ? 1 : 0);
        $('#chkMe').prop('checked', sessionStorage.getItem("eOT_chkMe") === "true" ? 1 : 0);

        KdoDatePikerEnable($("#dFechaDesde"), sessionStorage.getItem("eOT_chkRangFechas") === "true" ? 1 : 0);
        KdoDatePikerEnable($("#dFechaHasta"), sessionStorage.getItem("eOT_chkRangFechas") === "true" ? 1 : 0);

        fn_ObtenerOTs(sessionStorage.getItem("eOT_CmbEtapasProcesos") === null || sessionStorage.getItem("eOT_CmbEtapasProcesos") === "" ? null : sessionStorage.getItem("eOT_CmbEtapasProcesos"),
            sessionStorage.getItem("eOT_CmbOrdenTrabajo") === null || sessionStorage.getItem("eOT_CmbOrdenTrabajo") === "" ? null : sessionStorage.getItem("eOT_CmbOrdenTrabajo"),
            sessionStorage.getItem("eOT_CmbCliente") === null || sessionStorage.getItem("eOT_CmbCliente") === ""? null : sessionStorage.getItem("eOT_CmbCliente"),
            sessionStorage.getItem("eOT_CmbPrograma") === null || sessionStorage.getItem("eOT_CmbPrograma") === ""? null : sessionStorage.getItem("eOT_CmbPrograma"),
            $("#chkVerTodas").is(':checked'),
            sessionStorage.getItem("eOT_CmbTiposOrdenesTrabajos") === null || sessionStorage.getItem("eOT_CmbTiposOrdenesTrabajos") === "" ? null : sessionStorage.getItem("eOT_CmbTiposOrdenesTrabajos"),
            !$("#chkRangFechas").is(':checked')  ? null : kendo.toString(kendo.parseDate(sessionStorage.getItem("eOT_dFechaDesde") === null ? $("#dFechaDesde").val() : null), 's'),
            !$("#chkRangFechas").is(':checked') ? null : kendo.toString(kendo.parseDate(sessionStorage.getItem("eOT_dFechaHasta") === null ? $("#dFechaHasta").val() : null), 's'),
            $("#chkMe").is(':checked'));

    }



    $(".Kanban-view-topscroll").scroll(function () {
        $(".board")
            .scrollLeft($(".Kanban-view-topscroll").scrollLeft());
    });
    $(".board").scroll(function () {
        $(".Kanban-view-topscroll")
            .scrollLeft($(".board").scrollLeft());
    });

});

let fn_DibujarKanban = function (ds) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "ConfiguracionEtapasOrdenes/GetByIdTipoOrdenTrabajoVista/" + (KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")) === null ? 0 : KdoCmbGetValue($("#CmbTiposOrdenesTrabajos"))),
        type: 'GET',
        success: function (datos) {
            let MyKanban = $("#myKanban");
            MyKanban.children().remove();
            $.each(datos, function (index, elemento) {
                MyKanban.append('<div data-id="_' + elemento.IdEtapaProceso + '" class="kanban-board form-group col-lg-12 sortable-drag" draggable="false">' +
                    '<header class="kanban-board-header">' +
                    '<div class="kanban-title-board">' + elemento.Nombre + '</div>' +
                    '</header>' +
                    '<div><br/></div>' +
                    '<main class="kanban-drag" id="Etp-' + elemento.IdEtapaProceso + '">' +
                    '</main>' +
                    '<footer></footer>' +
                    '</div>'
                );
                let filtro = [];
                JSON.parse(JSON.stringify(ds), function (key, value) {
                    if (value !== null) {
                        if (value.IdEtapaProceso === elemento.IdEtapaProceso) filtro.push(value);

                    }
                    return value;
                });

                let MainKanba = $("#Etp-" + elemento.IdEtapaProceso + "");
                MainKanba.children().remove();
                let usuario = elemento.IdUsuario;

                $.each(filtro, function (index, elemento) {
                    let NoRegPrenda = elemento.NoDocumentoRegPrenda === null ? '' : elemento.NoDocumentoRegPrenda;
                    let NoReferencia = elemento.NoReferencia === null ? '' : elemento.NoReferencia;
                    let StyleEstadoOT = elemento.ColorEstadoOT === null ? "" : 'style=\"background-color:' + elemento.ColorEstadoOT + ';\"';
                    let UsuarioKB = elemento.NombreUsuario === null ? '</br>' : elemento.NombreUsuario;
                    let CodigoDisenoAX = (elemento.CodigoDisenoAX === undefined || elemento.CodigoDisenoAX === null) ? '' : elemento.CodigoDisenoAX;
                    let CodigoOTOrigen = elemento.NoOtOrigen === null ? '' : elemento.NoOtOrigen;

                    MainKanba.append('<div class="kanban-item" style="" draggable="false" id="' + elemento.IdRow + '" >' +
                        //'<div class= "form-group col-lg-2">' +
                        '<div class="card border-success mb-3" style="max-width: 18rem;">' +
                        '<div class= "TSM-card-header bg-transparent border-success" style = "white-space:normal;font-weight: bold;">' +
                        // '< a class= "btn-link stretched-link" target = "_blank" href = "/OrdenesTrabajo/ElementoTrabajo/' + elemento.IdOrdenTrabajo + '/' + elemento.IdEtapaProceso + '" > ' + elemento.NoDocumento + '</a >' +
                        '<ul id="Menu_' + elemento.IdRow + '" ' + StyleEstadoOT + '>' +
                        '<li class="emptyItem">' +
                        '<span class="empty">' + elemento.NoDocumento + '</span>' +
                        '<ul>' +
                        '<li onclick=\"fn_VerOt(' + elemento.IdOrdenTrabajo + "," + elemento.IdEtapaProceso + ');\"> <span class="k-icon k-i-file-txt"></span>Ver orden de trabajo</li>' +
                        '<li  onclick=\"fn_VerKanbanAsig(' + elemento.IdOrdenTrabajo + "," + elemento.IdEtapaProceso + ');\"><span class="k-icon k-i-user"></span>Asignar orden trabajo</li>' +
                        '</ul>' +
                        '</li>' +
                        '</ul>' +
                        '</div > ' +
                        '<div class="card-body">' +
                        '<h5 class="TSM-card-title" style="white-space:normal;font-weight: bold;">' + elemento.NombreDiseño + '</h5>' +
                        '<h1 class="TSM-card-title" style="white-space:normal;font-weight: bold;">' + elemento.TallaDesarrollar + '</h1>' +
                        '<h1 class="TSM-card-subtitle" style="white-space:normal;">' + NoReferencia + '</h1>' +
                        '<h1 class="TSM-card-subtitle" style="white-space:normal;">' + elemento.NoPrograma  + '</h1>' +
                        '<h1 class="TSM-card-subtitle" style="white-space:normal;">' + NoRegPrenda + '</h1>' +                 
                        '<table class="table TSM-table">' +
                        '<tbody id="U_' + elemento.IdRow + '">' +
                        '</tbody>' +
                        '</table>' +
                        '<p class="card-text" style="white-space:normal;"><br/><span style="white-space:normal;font-weight: bold;">' + (elemento.NombreTipoOrden === null ? "" : elemento.NombreTipoOrden) + '</span><br/>Programa: ' + elemento.NombrePrograma + "<br/>Prenda: " + elemento.Prenda + "<br/> " +
                        'Color Tela: ' + elemento.ColorTela + (CodigoDisenoAX !== "" ? "<br/>" + 'Diseño AX: ' + CodigoDisenoAX : "") + "<br/>Tallas: " + elemento.Tallas + (CodigoOTOrigen === "" ? "</p>" : "<br/><b>OT Origen: " + CodigoOTOrigen + "</b></p>") +
                        '</div>' +
                        '<div class="TSM-card-footer bg-transparent border-success" style="white-space:normal;font-weight: bold;">Fecha OT: ' + kendo.toString(kendo.parseDate(elemento.FechaOrdenTrabajo), "dd/MM/yyyy HH:mm:ss") + '</div>' +
                        '</div>' +
                        //'</div>' + 
                        '</div>');



                    $("#" + elemento.IdRow + "").data("IdOrdenTrabajo", elemento.IdOrdenTrabajo);
                    $("#" + elemento.IdRow + "").data("IdEtapaProceso", elemento.IdEtapaProceso);
                    $("#" + elemento.IdRow + "").data("Item", elemento.Item);

                    $("#Menu_" + elemento.IdRow + "").kendoMenu({
                        openOnClick: true
                    });

                    var KanbanUsuarios = elemento.NombreUsuariosAsigConcat;
                    var ArrNombreUsuarios = KanbanUsuarios.split(',');
                    let TbUsuario = $("#U_" + elemento.IdRow + "");
                    TbUsuario.children().remove();

                    $.each(ArrNombreUsuarios, function (index, elemento) {

                        TbUsuario.append('<tr class="d-flex">' + //columna Id de Tabla
                            '<th class="col-12" scope="row"> ' +
                            '<div class="user" style="font-size:inherit;">' +
                            '<div class="TSM-avatar-sm float-left mr-2" id="MyPhoto1">' +
                            '<img src="/Images/DefaultUser.png" alt="..." class="avatar-img rounded-circle">' +
                            '</div>' +
                            //'<div class="info">' +
                            //'<a data-toggle="collapse">' +
                            //'<span>' +
                            '<span id="MyUserName" style="white-space:normal;">' + elemento.toString() + '</span>' +
                            //'</span>' +
                            //'</a>' +
                            //'</div>' +
                            '</div>' +
                            '</th>' +
                            '</tr>');
                      



                    });

                });

            });

            $(".scroll-div1").css("width", $(".board")[0].scrollWidth);
            $(".Kanban-view-topscroll").css("width", $(".board")[0].scrollWidth);
            //fn_IniciarKanban();


        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });


};



let fn_ObtenerOTs = function (xIdEtapaProceso, xIdOrdenTrabajo, xIdCliente, xIdPrograma, xSNTodas, xIdTipoOrdenTrabajo, xFechaDesde, xFechaHasta, xSNAsignadas) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: TSM_Web_APi + "OrdenesTrabajos/GetOrdenesTrabajosEtapas",
        data: JSON.stringify({
            IdEtapaProceso: xIdEtapaProceso,
            IdOrdenTrabajo: xIdOrdenTrabajo,
            IdCliente: xIdCliente,
            IdPrograma: xIdPrograma,
            SNTodas: xSNTodas,
            IdTipoOrdenTrabajo: xIdTipoOrdenTrabajo,
            FechaDesde: xFechaDesde,
            FechaHasta: xFechaHasta,
            SNAsignadas: xSNAsignadas,
            Opcion:0

        }),
        contentType: "application/json; charset=utf-8",
        success: function (datos) {
            fn_DibujarKanban(datos);

        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });
};


let fn_IniciarKanban = function () {

    var TSMboardK = {
        init: function init() {

            this.bindUIActions();
        },
        bindUIActions: function bindUIActions() {

            // event handlers
            this.handleBoardStyle();
            this.handleSortable();
        },
        byId: function byId(id) {
            return document.getElementById(id);
        },
        handleBoardStyle: function handleBoardStyle() {
            $(document).on('mouseenter mouseleave', '.kanban-board-header', function (e) {
                var isHover = e.type === 'mouseenter';
                $(this).parent().toggleClass('hover', isHover);
            });
        },
        handleSortable: function handleSortable() {
            //obtener el elemento MyKanban
            var board = this.byId('myKanban');
            // Multi groups
            Sortable.create(board, {
                animation: 150,
                draggable: '.kanban-board', // Especifica qué elementos dentro del elemento deben ser arrastrables
                handle: '.kanban-board-header', // Arrastre el selector de manejadores dentro de los elementos de la lista 
                filter: '.ignore-sort', //Selectores que no conducen al arrastre(String o Function)
                delay: 100,
                forceFallback: true//ignora el comportamiento de DnD HTML5 y fuerza el retroceso para que se active

            });
            [].forEach.call(board.querySelectorAll('.kanban-drag'), function (el) {
                Sortable.create(el, {
                    group: 'tasks',
                    animation: 150,
                    filter: '.ignore-sort',
                    delay: 100,
                    forceFallback: true, // ignora el comportamiento de DnD HTML5 y fuerza el retroceso para que se active  
                    //Element dragging started
                    onStart: function (/**Event*/evt) {
                        var itemEl = evt.item;  // dragged HTMLElement
                        xIdOrdenTrabajo = $("#" + itemEl.id).data("IdOrdenTrabajo");
                        xIdEtapaProceso = $("#" + itemEl.id).data("IdEtapaProceso");
                        xItem = $("#" + itemEl.id).data("Item");
                        xIdUsuarioFrom = $("#" + itemEl.id).data("UsuarioFrom");

                    },
                    // Element is dropped into the list from another list
                   
                    onMove: function (/**Event*/evt, /**Event*/originalEvent) {
                 
                            return false;
                    }
                });
            });
        }
    };

    TSMboardK.init();

};

fPermisos = function (datos) {
    Permisos = datos;
};