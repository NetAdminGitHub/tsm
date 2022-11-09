var Permisos;
let ListadoOT;
let xIdOrdenTrabajo;
let xIdEtapaProceso;
let xItem;
let xIdUsuarioTo;
let xIdUsuarioFrom;
let Catalogo_IdOrdenTrabajo = 0;

var fn_VerOt = function (xidOrdenTrabajo, xidEtapaProceso) {
    window.location.href = "/OrdenesTrabajo/ElementoTrabajo/" + xidOrdenTrabajo + "/" + xidEtapaProceso;
};
var fn_VerKanbanAsig = function (xidOrdenTrabajo, xidEtapaProceso) {
    window.location.href = "/GestionOTAsignaciones/" + xidEtapaProceso + "/" + xidOrdenTrabajo;
};
$(document).ready(function () {
    let dtfecha = new Date();

    KdoButton($("#btnNuevaSolicitud"), "plus-outline","Nueva solicitud");
    KdoButtonEnable($("#btnNuevaSolicitud"), true);

    Kendo_CmbFiltrarGrid($("#CmbEtapasProcesos"), TSM_Web_APi + "EtapasProcesos/GetByModuloActivas/2", "Nombre", "IdEtapaProceso", "Seleccione una etapa", "");
    KdoCmbSetValue($("#CmbEtapasProcesos"), sessionStorage.getItem("EtapasOrdenesTrabajos_CmbEtapasProcesos") === null ? "" : sessionStorage.getItem("EtapasOrdenesTrabajos_CmbEtapasProcesos")); 

    Kendo_CmbFiltrarGrid($("#CmbTiposOrdenesTrabajos"), TSM_Web_APi + "TiposOrdenesTrabajos", "Nombre", "IdTipoOrdenTrabajo", "Seleccione un Tipo de Orden de trabajo", "");
    KdoCmbSetValue($("#CmbTiposOrdenesTrabajos"), sessionStorage.getItem("EtapasOrdenesTrabajos_CmbTiposOrdenesTrabajos") === null ? "" : sessionStorage.getItem("EtapasOrdenesTrabajos_CmbTiposOrdenesTrabajos")); 

    Kendo_CmbFiltrarGrid($("#CmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Selecione un cliente...");
    KdoCmbSetValue($("#CmbCliente"), sessionStorage.getItem("EtapasOrdenesTrabajos_CmbCliente") === null ? "" : sessionStorage.getItem("EtapasOrdenesTrabajos_CmbCliente")); 


    $("#CmbPrograma").ControlSelecionPrograma();
    KdoMultiColumnCmbSetValue($("#CmbPrograma"), sessionStorage.getItem("EtapasOrdenesTrabajos_CmbPrograma") === null ? "" : sessionStorage.getItem("EtapasOrdenesTrabajos_CmbPrograma")); 

    $("#CmbOrdenTrabajo").ControlSeleccionOrdenesTrabajos();
    KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), sessionStorage.getItem("EtapasOrdenesTrabajos_CmbOrdenTrabajo") === null ? "" : sessionStorage.getItem("EtapasOrdenesTrabajos_CmbOrdenTrabajo")); 


    $("#dFechaDesde").kendoDatePicker({
        size: "large",
        format: "dd/MM/yyyy"
    });
    $("#dFechaDesde").data("kendoDatePicker").value(sessionStorage.getItem("EtapasOrdenesTrabajos_dFechaDesde") === null ? kendo.toString(kendo.parseDate(new Date(dtfecha.getFullYear(), dtfecha.getMonth() - 1, dtfecha.getUTCDate())), 's') : sessionStorage.getItem("EtapasOrdenesTrabajos_dFechaDesde"));
    $("#dFechaHasta").kendoDatePicker({
        size: "large",
        format: "dd/MM/yyyy"
    });
    $("#dFechaHasta").data("kendoDatePicker").value(Fhoy());
    $("#dFechaHasta").data("kendoDatePicker").value(sessionStorage.getItem("EtapasOrdenesTrabajos_dFechaHasta") === null ? Fhoy() : sessionStorage.getItem("EtapasOrdenesTrabajos_dFechaHasta"));

    $('#chkRangFechas').prop('checked', sessionStorage.getItem("EtapasOrdenesTrabajos_chkRangFechas") === null ? 0 : sessionStorage.getItem("EtapasOrdenesTrabajos_chkRangFechas") === "true" ? 1 : 0);
    $('#chkMe').prop('checked', sessionStorage.getItem("EtapasOrdenesTrabajos_chkMe") === null ? 0 : sessionStorage.getItem("EtapasOrdenesTrabajos_chkMe") === "true" ? 1 : 0);

    KdoDatePikerEnable($("#dFechaDesde"), false);
    KdoDatePikerEnable($("#dFechaHasta"), false);


    $("#CmbEtapasProcesos").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            fn_ObtenerSol(this.dataItem(e.item.index()).IdEtapaProceso.toString(), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );
            sessionStorage.setItem("EtapasOrdenesTrabajos_CmbEtapasProcesos", this.dataItem(e.item.index()).IdEtapaProceso);
        } else {
            fn_ObtenerSol(null, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );
            sessionStorage.setItem("EtapasOrdenesTrabajos_CmbEtapasProcesos", "");
        }
    });

    $("#CmbEtapasProcesos").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            fn_ObtenerSol(null, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );

            sessionStorage.setItem("EtapasOrdenesTrabajos_CmbEtapasProcesos", "");
        }
    });


    $("#CmbTiposOrdenesTrabajos").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            fn_ObtenerSol(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                $("#chkVerTodas").is(':checked'), this.dataItem(e.item.index()).IdTipoOrdenTrabajo,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );
            sessionStorage.setItem("EtapasOrdenesTrabajos_CmbTiposOrdenesTrabajos", this.dataItem(e.item.index()).IdTipoOrdenTrabajo);

        } else {
            fn_ObtenerSol(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );

            sessionStorage.setItem("EtapasOrdenesTrabajos_CmbTiposOrdenesTrabajos", "");
        }
    });

    $("#CmbTiposOrdenesTrabajos").data("kendoComboBox").bind("change", function (e) {
        let value = this.value();
        if (value === "") {
            fn_ObtenerSol(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );

            sessionStorage.setItem("EtapasOrdenesTrabajos_CmbTiposOrdenesTrabajos", "");

        }
    });


    $("#CmbCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            fn_ObtenerSol(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                this.dataItem(e.item.index()).IdCliente,
                KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
                $("#chkRangFechas").is(':checked')=== false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );

            sessionStorage.setItem("EtapasOrdenesTrabajos_CmbCliente", this.dataItem(e.item.index()).IdCliente);
        }
        else {
            fn_ObtenerSol(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                null, KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'),
                KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );

            sessionStorage.setItem("EtapasOrdenesTrabajos_CmbCliente","");
        }
    });

    $("#CmbCliente").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            fn_ObtenerSol(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                null, KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'),
                KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );

            sessionStorage.setItem("EtapasOrdenesTrabajos_CmbCliente", "");
        }
    });

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            fn_ObtenerSol(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                this.dataItem(e.item.index()).IdCliente,
                this.dataItem(e.item.index()).IdPrograma,
                $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
                $("#chkRangFechas").is(':checked')=== false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );

            sessionStorage.setItem("EtapasOrdenesTrabajos_CmbPrograma", this.dataItem(e.item.index()).IdPrograma);


        } else {
            fn_ObtenerSol(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                null, $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );

            sessionStorage.setItem("EtapasOrdenesTrabajos_CmbPrograma", "");
        }
    });

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
        if (data === undefined) {
            fn_ObtenerSol(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                null, $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );

            sessionStorage.setItem("EtapasOrdenesTrabajos_CmbPrograma", "");
        }

    });


    $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
          
            fn_ObtenerSol(KdoCmbGetValue($("#CmbEtapasProcesos")), this.dataItem(e.item.index()).IdOrdenTrabajo,
                this.dataItem(e.item.index()).IdCliente,
                this.dataItem(e.item.index()).IdPrograma, $("#chkVerTodas").is(':checked'),
                KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );

            sessionStorage.setItem("EtapasOrdenesTrabajos_CmbOrdenTrabajo", this.dataItem(e.item.index()).IdOrdenTrabajo);

        } else {
            fn_ObtenerSol(KdoCmbGetValue($("#CmbEtapasProcesos")), null,
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );

            sessionStorage.setItem("EtapasOrdenesTrabajos_CmbOrdenTrabajo", "");
        }
    });

    $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdOrdenTrabajo === Number(this.value()));
        if (data === undefined) {
            fn_ObtenerSol(KdoCmbGetValue($("#CmbEtapasProcesos")), null,
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                $("#chkVerTodas").is(':checked'),
                KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
                $("#chkMe").is(':checked')
            );

            sessionStorage.setItem("EtapasOrdenesTrabajos_CmbOrdenTrabajo", "");
        }

    });

    $("#dFechaDesde").data("kendoDatePicker").bind("change", function () {
        fn_ObtenerSol(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
            $("#chkMe").is(':checked')
        );

        sessionStorage.setItem("EtapasOrdenesTrabajos_dFechaDesde", kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'));
    });

    $("#dFechaHasta").data("kendoDatePicker").bind("change", function () {
        fn_ObtenerSol(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
            $("#chkMe").is(':checked')
        );
        sessionStorage.setItem("EtapasOrdenesTrabajos_dFechaHasta", kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'));
    });
    $("#chkVerTodas").click(function () {
        fn_ObtenerSol(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma"))
            , this.checked, KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
            $("#chkMe").is(':checked')
        );
        sessionStorage.setItem("EtapasOrdenesTrabajos_chkVerTodas", this.checked);
    });

    $("#chkRangFechas").click(function () {

        KdoDatePikerEnable($("#dFechaDesde"), this.checked);
        KdoDatePikerEnable($("#dFechaHasta"), this.checked);
        fn_ObtenerSol(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
            this.checked === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            this.checked === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'),
            $("#chkMe").is(':checked')
        );

        sessionStorage.setItem("EtapasOrdenesTrabajos_chkRangFechas", this.checked);
    });

    $("#chkMe").click(function () {
        fn_ObtenerSol(KdoCmbGetValue($("#CmbEtapasProcesos")), KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'), KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")),
            this.checked === false ? null : $("#chkRangFechas").is(':checked') ? kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'):null,
            this.checked === false ? null : $("#chkRangFechas").is(':checked') ? kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'):null,
            $("#chkMe").is(':checked')
        );

        sessionStorage.setItem("EtapasOrdenesTrabajos_chkMe", this.checked);
    });


    if (Catalogo_IdOrdenTrabajo > 0) {
        KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), Catalogo_IdOrdenTrabajo);
        $('#chkVerTodas').prop('checked', 1);
        $('#chkRangFechas').prop('checked', 0);
        $("#chkMe").prop('checked', 0);
        fn_ObtenerSol(null, Catalogo_IdOrdenTrabajo, null, null, $("#chkVerTodas").is(':checked'), null, $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'), $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'), $("#chkMe").is(':checked'));
    } else {
        $('#chkVerTodas').prop('checked', sessionStorage.getItem("EtapasOrdenesTrabajos_chkVerTodas") === "true" ? 1 : 0);
        $('#chkRangFechas').prop('checked', sessionStorage.getItem("EtapasOrdenesTrabajos_chkRangFechas") === "true" ? 1 : 0);
        $('#chkMe').prop('checked', sessionStorage.getItem("EtapasOrdenesTrabajos_chkMe") === "true" ? 1 : 0);

        KdoDatePikerEnable($("#dFechaDesde"), sessionStorage.getItem("EtapasOrdenesTrabajos_chkRangFechas") === "true" ? 1 : 0);
        KdoDatePikerEnable($("#dFechaHasta"), sessionStorage.getItem("EtapasOrdenesTrabajos_chkRangFechas") === "true" ? 1 : 0);

        fn_ObtenerSol(sessionStorage.getItem("EtapasOrdenesTrabajos_CmbEtapasProcesos") === null || sessionStorage.getItem("EtapasOrdenesTrabajos_CmbEtapasProcesos") === "" ? null : sessionStorage.getItem("EtapasOrdenesTrabajos_CmbEtapasProcesos"),
            sessionStorage.getItem("EtapasOrdenesTrabajos_CmbOrdenTrabajo") === null || sessionStorage.getItem("EtapasOrdenesTrabajos_CmbOrdenTrabajo") === "" ? null : sessionStorage.getItem("EtapasOrdenesTrabajos_CmbOrdenTrabajo"),
            sessionStorage.getItem("EtapasOrdenesTrabajos_CmbCliente") === null || sessionStorage.getItem("EtapasOrdenesTrabajos_CmbCliente") === ""? null : sessionStorage.getItem("EtapasOrdenesTrabajos_CmbCliente"),
            sessionStorage.getItem("EtapasOrdenesTrabajos_CmbPrograma") === null || sessionStorage.getItem("EtapasOrdenesTrabajos_CmbPrograma") === ""? null : sessionStorage.getItem("EtapasOrdenesTrabajos_CmbPrograma"),
            $("#chkVerTodas").is(':checked'),
            sessionStorage.getItem("EtapasOrdenesTrabajos_CmbTiposOrdenesTrabajos") === null || sessionStorage.getItem("EtapasOrdenesTrabajos_CmbTiposOrdenesTrabajos") === "" ? null : sessionStorage.getItem("EtapasOrdenesTrabajos_CmbTiposOrdenesTrabajos"),
            !$("#chkRangFechas").is(':checked')  ? null : kendo.toString(kendo.parseDate(sessionStorage.getItem("EtapasOrdenesTrabajos_dFechaDesde") === null ? $("#dFechaDesde").val() : null), 's'),
            !$("#chkRangFechas").is(':checked') ? null : kendo.toString(kendo.parseDate(sessionStorage.getItem("EtapasOrdenesTrabajos_dFechaHasta") === null ? $("#dFechaHasta").val() : null), 's'),
            $("#chkMe").is(':checked'));

    }

    //fn_DibujarKanban("[]");

    /*
     * $("#btnCriteriosCalidad").click(function (e) {
        fn_CriteriosCriticos("CriteriosCriticos", fn_getIdPiezaDesarrollada($("#grid").data("kendoGrid")));
    });
    */
    $("#btnNuevaSolicitud").click(function () {

        fn_Obtieneinfosolicitud('InfoPruebaLaboratorio', 0, true, function() { fn_filtraEnBlanco(); }   );
    });



    $(".Kanban-view-topscroll").scroll(function () {
        $(".board")
            .scrollLeft($(".Kanban-view-topscroll").scrollLeft());
    });
    $(".board").scroll(function () {
        $(".Kanban-view-topscroll")
            .scrollLeft($(".board").scrollLeft());
    });




});

let fn_filtraEnBlanco = function () {


        fn_ObtenerSol(sessionStorage.getItem("EtapasOrdenesTrabajos_CmbEtapasProcesos") === null || sessionStorage.getItem("EtapasOrdenesTrabajos_CmbEtapasProcesos") === "" ? null : sessionStorage.getItem("EtapasOrdenesTrabajos_CmbEtapasProcesos"),
            sessionStorage.getItem("EtapasOrdenesTrabajos_CmbOrdenTrabajo") === null || sessionStorage.getItem("EtapasOrdenesTrabajos_CmbOrdenTrabajo") === "" ? null : sessionStorage.getItem("EtapasOrdenesTrabajos_CmbOrdenTrabajo"),
            sessionStorage.getItem("EtapasOrdenesTrabajos_CmbCliente") === null || sessionStorage.getItem("EtapasOrdenesTrabajos_CmbCliente") === "" ? null : sessionStorage.getItem("EtapasOrdenesTrabajos_CmbCliente"),
            sessionStorage.getItem("EtapasOrdenesTrabajos_CmbPrograma") === null || sessionStorage.getItem("EtapasOrdenesTrabajos_CmbPrograma") === "" ? null : sessionStorage.getItem("EtapasOrdenesTrabajos_CmbPrograma"),
            $("#chkVerTodas").is(':checked'),
            sessionStorage.getItem("EtapasOrdenesTrabajos_CmbTiposOrdenesTrabajos") === null || sessionStorage.getItem("EtapasOrdenesTrabajos_CmbTiposOrdenesTrabajos") === "" ? null : sessionStorage.getItem("EtapasOrdenesTrabajos_CmbTiposOrdenesTrabajos"),
            !$("#chkRangFechas").is(':checked') ? null : kendo.toString(kendo.parseDate(sessionStorage.getItem("EtapasOrdenesTrabajos_dFechaDesde") === null ? $("#dFechaDesde").val() : null), 's'),
            !$("#chkRangFechas").is(':checked') ? null : kendo.toString(kendo.parseDate(sessionStorage.getItem("EtapasOrdenesTrabajos_dFechaHasta") === null ? $("#dFechaHasta").val() : null), 's'),
            $("#chkMe").is(':checked'));
 

}

let fn_Obtieneinfosolicitud = function (div, idPruebaLaboratorio,ModoNuevo, fnclose) {
    
    kendo.ui.progress($(document.activeElement), true);
    if ($("#" + div + "").children().length === 0) {
        $.ajax({
            url:  "PruebasLaboratorio/InfoPruebaLaboratorio",
            type: 'GET',
            contentType: "text/html; charset=utf-8",
            datatype: "html",
            success: function (resultado) {
                kendo.ui.progress($(document.activeElement), false);
                fn_CargarVistaModalInfoLaboratorio(resultado, div, idPruebaLaboratorio,ModoNuevo, fnclose);
            }
        });
    } else {
        kendo.ui.progress($(document.activeElement), false);
        fn_CargarVistaModalInfoLaboratorio("", div, idPruebaLaboratorio,ModoNuevo, fnclose);
    }
};


let fn_CargarVistaModalInfoLaboratorio = function (data, divPruebaLab, idPruebaLaboratorio, ModoNuevo, fnclose) {

    let a = document.getElementsByTagName("script");
    let listJs = [];
    $.each(a, function (index, elemento) {
        listJs.push(elemento.src.toString());
    });
    if (listJs.filter(listJs => listJs.toString().endsWith("_InfoPruebaLaboratorio.js")).length === 0) {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "/Scripts/js/_InfoPruebaLaboratorio.js";
        script.onload = function () {
            fn_ShowModalInfoLaboratorio(true, data, divPruebaLab, idPruebaLaboratorio, ModoNuevo,fnclose);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {
        fn_ShowModalInfoLaboratorio(false, data, divPruebaLab, idPruebaLaboratorio,ModoNuevo, fnclose);
    }
};


let fn_ShowModalInfoLaboratorio = function (cargarJs, data, divVerInfoLaboratorio, idPruebaLaboratorio,Nuevo, fnclose) {
    let onShow = function () {
        if (cargarJs === true) {
            fn_InicializarInfoLaboratorio(idPruebaLaboratorio,Nuevo);
        } else {
           // fn_InicializarInfoLaboratorio(idPruebaLaboratorio, Nuevo);
            fn_CargarInfoLaboratorio(idPruebaLaboratorio);
        }
    };

    let fn_CloseSIC = function () {
        if (fnclose === undefined || fnclose === "") {
            return true;
        } else {
            return fnclose();
        }
    };


    $("#" + divVerInfoLaboratorio + "").kendoDialog({
        height: "78%",
        width: "80%",
        title: "Información de solicitud de laboratorio",
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
    $("#" + divVerInfoLaboratorio + "").data("kendoDialog").open().toFront();
};



let fn_DibujarKanbanSolicitudesLab = function (ds) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        url: TSM_Web_APi + "PruebasLaboratorio/GetEstados/" +"0" ,//(null === null ? "" : KdoCmbGetValue($("#CmbTiposOrdenesTrabajos")))
        type: 'GET',
        success: function (datos) {
            let solKanban = $("#solKanban");
            solKanban.children().remove();
            $.each(datos, function (index, elemento) {
                solKanban.append('<div data-id="_' + elemento.Estado + '" class="kanban-board form-group col-lg-12 sortable-drag" draggable="false">' +
                    '<header class="kanban-board-header">' +
                    '<div class="kanban-title-board">' + elemento.Nombre + '</div>' +
                    '</header>' +
                    '<div><br/></div>' +
                    '<main class="kanban-drag" id="Est-' + elemento.Estado + '">' +
                    '</main>' +
                    '<footer></footer>' +
                    '</div>'
                );
                let filtro = [];
                JSON.parse(JSON.stringify(ds), function (key, value) {
                    if (value !== null) {
                        if (value.Estado === elemento.Estado) filtro.push(value);

                    }
                    return value;
                });

              

                let MainKanba = $("#Est-" + elemento.Estado + "");
                MainKanba.children().remove();
                let usuario = elemento.IdUsuario;
                
                $.each(filtro, function (index, elemento) {
                    //let NoRegPrenda = elemento.NoDocumentoRegPrenda === null ? '' : elemento.NoDocumentoRegPrenda;
                    //let NoReferencia = elemento.NoReferencia === null ? '' : elemento.NoReferencia;
                   // let StyleEstadoOT = elemento.ColorEstadoOT === null ? "" : 'style=\"background-color:' + elemento.ColorEstadoOT + ';\"';
                    //let UsuarioKB = elemento.NombreUsuario === null ? '</br>' : elemento.NombreUsuario;
                    //let CodigoDisenoAX = (elemento.CodigoDisenoAX === undefined || elemento.CodigoDisenoAX === null) ? '' : elemento.CodigoDisenoAX;

                    let vClass;
                    if (elemento.IconoPrueba === "" || elemento.IconoPrueba === null) {
                        vClass = 'class= "k-icon k-i-check k-icon-32"';
                    } else {
                        vClass = (elemento.IconoPrueba === null ? '' : elemento.IconoPrueba).startsWith('k-i') === true ? 'class= "k-icon ' + elemento.IconoPrueba + '"' : 'class= "' + elemento.IconoPrueba + '"';
                    }

                    MainKanba.append('<div class="kanban-item" style="" draggable="false" id="' + elemento.Rowid + '" >' +
                        //'<div class= "form-group col-lg-2">' +
                        '<div class="card border-success mb-3 " style="max-width: 18rem;" onclick="fn_Obtieneinfosolicitud(\'InfoPruebaLaboratorio\',' + elemento.IdPruebaLaboratorio + ', ' + false + ', ' + function(){ fn_filtraEnBlanco(); }  +');">' +
                        '<div ' + vClass + ' style="font-size: 32px;position:absolute;"  data-toggle="tooltip" title="'+elemento.CalidadPrueba  +'" > ' +
                                '</div >' +   
                        '<div class= "TSM-card-header bg-transparent border-success" style = "white-space:normal;font-weight: bold;">' +
                      
                        '<a class= "btn-link stretched-link" onclick="fn_Obtieneinfosolicitud(1,1,1);" > </a >' +
                        '<ul id="Menu_' + elemento.Rowid + '" >' + // + StyleEstadoOT + '>' +
                        '<li class="emptyItem">' +
                        '<span class="empty">' + elemento.NoSolicitud + '</span>' +
                       
                        '</li>' +
                        '</ul>' +
                        '</div > ' +
                        '<div class="card-body">' +
                        '<h5 class="TSM-card-title" style="white-space:normal;font-weight: bold;">Diseño: '  + elemento.NombreDiseno + '</h5>' +
                        '<h1 class="TSM-card-title" style="white-space:normal;font-weight: bold;">Prueba: ' + elemento.CalidadPrueba + '</h1>' +
                        '<h1 class="TSM-card-subtitle" style="white-space:normal;">Origen: ' + elemento.OrigenPrueba + '</h1>' +
                        
                       // '<h1 class="TSM-card-subtitle" style="white-space:normal;">' + elemento.NoPrograma  + '</h1>' +
                        //'<h1 class="TSM-card-subtitle" style="white-space:normal;">' + NoRegPrenda + '</h1>' +
                        '<table class="table TSM-table">' +
                        '<tbody id="U_' + elemento.Rowid + '">' +
                        '</tbody>' +
                        '</table>' +
                        '<p class="card-text" style="white-space:normal;"><br/><span style="white-space:normal;font-weight: bold;">Tipo de OT: ' + elemento.TipoOrdenTrabajo + '</span><br/>Programa: ' + elemento.NombrePrograma + 
                        '</div>' +
                        '<div class="TSM-card-footer bg-transparent border-success" style="white-space:normal;font-weight: bold;">Fecha creación: ' + kendo.toString(kendo.parseDate(elemento.FechaCreacion), "dd/MM/yyyy HH:mm:ss") + '</div>' +
                        '</div>' +
                        //'</div>' + 
                        '</div>');



                    //$("#" + elemento.IdRow + "").data("IdOrdenTrabajo", elemento.IdOrdenTrabajo);
                    //$("#" + elemento.IdRow + "").data("IdEtapaProceso", elemento.IdEtapaProceso);
                    //$("#" + elemento.IdRow + "").data("Item", elemento.Item);

                    //$("#Menu_" + elemento.IdRow + "").kendoMenu({
                    //    openOnClick: true
                    //});
                    /*
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
                    */
                });

            });


            $(".scroll-div1").css("width", $(".board")[0].scrollWidth);
            $(".Kanban-view-topscroll").css("width", $(".board")[0].scrollWidth);
            fn_IniciarKanban();


        },
        complete: function () {
            kendo.ui.progress($(document.body), false);
        }
    });


};



let fn_ObtenerSol = function (xIdEtapaProceso, xIdOrdenTrabajo, xIdCliente, xIdPrograma, xSNTodas, xIdTipoOrdenTrabajo, xFechaDesde, xFechaHasta, xSNAsignadas) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: TSM_Web_APi + "PruebasLaboratorio/GetSolicitudesPruebas",
        data: JSON.stringify({
            IdEstado: xIdEtapaProceso,
            IdPruebaLaboratorio: xIdOrdenTrabajo,
            IdCliente: xIdCliente,
            IdPrograma: xIdPrograma,
            IdTipoOrdenTrabajo: xIdTipoOrdenTrabajo,
            FechaDesde: xFechaDesde,
            FechaHasta: xFechaHasta,
            Opcion: 0,
            SNCanceladas: xSNAsignadas
            

        }),
        contentType: "application/json; charset=utf-8",
        success: function (datos) {
            fn_DibujarKanbanSolicitudesLab(datos);

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
            //obtener el elemento solKanban
            var board = this.byId('solKanban');
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
                        xIdOrdenTrabajo = $("#" + itemEl.id).data("IdPruebaLaboratorio");
                        xIdEtapaProceso = $("#" + itemEl.id).data("Estado");
                        xItem = $("#" + itemEl.id).data("Rowid");
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