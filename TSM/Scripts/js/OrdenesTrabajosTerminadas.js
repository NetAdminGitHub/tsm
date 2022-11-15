var Permisos;
let ListadoOT;
let xIdOrdenTrabajo;
let xIdEtapaProceso;
let xItem;
let xIdUsuarioTo;
let xIdUsuarioFrom;
let obj_Pro;
let obj_OT;
var fn_VerOt = function (xidOrdenTrabajo, xidEtapaProceso) {
    window.location.href = "/OrdenesTrabajo/ElementoTrabajo/" + xidOrdenTrabajo + "/" + xidEtapaProceso;
};
$(document).ready(function () {

    let dtfecha = new Date();
    KdoButton($("#btnEliminaFiltros"), "filter-clear", "Borrar todos los filtros");
    Kendo_CmbFiltrarGrid($("#CmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Selecione un cliente...");
    KdoCmbSetValue($("#CmbCliente"), sessionStorage.getItem("OTer_CmbCliente") === null ? "" : sessionStorage.getItem("OTer_CmbCliente"));

    $("#CmbPrograma").ControlSelecionProg();
    if (sessionStorage.OTer_CmbPrograma !== undefined && sessionStorage.OTer_CmbPrograma !== "") {
        fn_multiColumnSetJson($("#CmbPrograma"), sessionStorage.OTer_CmbPrograma, JSON.parse(sessionStorage.OTer_CmbPrograma).IdPrograma);
        obj_Pro = JSON.parse(sessionStorage.OTer_CmbPrograma);
    }

    $("#CmbOrdenTrabajo").GetOrdenesTrabajos();
    //*** buscar ot y asignar filtro**/
    if (sessionStorage.OTer_CmbOrdenTrabajo !== undefined && sessionStorage.OTer_CmbOrdenTrabajo !== "") {
        fn_multiColumnSetJson($("#CmbOrdenTrabajo"), sessionStorage.OTer_CmbOrdenTrabajo, JSON.parse(sessionStorage.OTer_CmbOrdenTrabajo).IdOrdenTrabajo);
        obj_OT = JSON.parse(sessionStorage.OTer_CmbOrdenTrabajo);
    }


    $("#dFechaDesde").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaDesde").data("kendoDatePicker").value(sessionStorage.getItem("OTer_dFechaDesde") === null ? kendo.toString(kendo.parseDate(new Date(dtfecha.getFullYear(), dtfecha.getMonth() - 1, dtfecha.getUTCDate())), 's') : sessionStorage.getItem("OTer_dFechaDesde"));
    $("#dFechaHasta").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaHasta").data("kendoDatePicker").value(Fhoy());
    $("#dFechaHasta").data("kendoDatePicker").value(sessionStorage.getItem("OTer_dFechaHasta") === null ? Fhoy() : sessionStorage.getItem("OTer_dFechaHasta"));
    $('#chkVerTodas').prop('checked', sessionStorage.getItem("OTer_chkVerTodas") === null ? 0 : sessionStorage.getItem("OTer_chkVerTodas") === "true" ? 1 : 0);

    //Dibujar html


    $("#CmbCliente").data("kendoComboBox").bind("change", function () {
        var colum = $("#CmbCliente").data("kendoComboBox");
        let data = colum.listView.dataSource.data().find(q => q.IdCliente === Number(this.value()));
        if (data === undefined) {
            //limpiar filtros
            KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), "");
            sessionStorage.setItem('OTer_CmbOrdenTrabajo', "");
            KdoMultiColumnCmbSetValue($("#CmbPrograma"), "");
            sessionStorage.setItem('OTer_CmbPrograma', "");
            $('#chkVerTodas').prop('checked', 0);
            sessionStorage.setItem("OTer_chkVerTodas", 0);

            fn_ObtenerOTKbsFinalizadas(null,
                KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                null,
                KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                $("#chkVerTodas").is(':checked'),
                null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("OTer_CmbCliente", "");
        } else {
            KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), "");
            sessionStorage.setItem('OTer_CmbOrdenTrabajo', "");
            KdoMultiColumnCmbSetValue($("#CmbPrograma"), "");
            sessionStorage.setItem('OTer_CmbPrograma', "");
            $('#chkVerTodas').prop('checked', 0);
            sessionStorage.setItem("OTer_chkVerTodas", 0);

            fn_ObtenerOTKbsFinalizadas(null,
                KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                this.value(),
                KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                $("#chkVerTodas").is(':checked'),
                null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("OTer_CmbCliente", this.value());
        }
    });

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
        if (data === undefined) {
            //limpiar filtros
            KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), "");
            sessionStorage.setItem('OTer_CmbOrdenTrabajo', "");
            $('#chkVerTodas').prop('checked', 0);
            sessionStorage.setItem("OTer_chkVerTodas", 0);

            fn_ObtenerOTKbsFinalizadas(null,
                KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                null,
                $("#chkVerTodas").is(':checked'),
                null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("OTer_CmbPrograma", "");
        } else {
            KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), "");
            sessionStorage.setItem('OTer_CmbOrdenTrabajo', "");
            $('#chkVerTodas').prop('checked', 0);
            sessionStorage.setItem("OTer_chkVerTodas", 0);

            KdoCmbSetValue($("#CmbCliente"), data.IdCliente);
            sessionStorage.setItem("OTer_CmbCliente", data.IdCliente);
            fn_ObtenerOTKbsFinalizadas(null,
                KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                data.IdPrograma,
                $("#chkVerTodas").is(':checked'),
                null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );
            sessionStorage.setItem("OTer_CmbPrograma", JSON.stringify(data.toJSON()));
        }

    });

    $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdOrdenTrabajo === Number(this.value()));
        if (data === undefined) {
            //limpiar filtros
            $('#chkVerTodas').prop('checked', 0);
            sessionStorage.setItem("OTer_chkVerTodas", 0);
            fn_ObtenerOTKbsFinalizadas(
                null,
                null,
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("OTer_CmbOrdenTrabajo", "");

        } else {
            $('#chkVerTodas').prop('checked', 0);
            sessionStorage.setItem("OTer_chkVerTodas", 0);

            if (KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null) { fn_SetValueMulticolumIdProgramaCfd($("#CmbPrograma"), data.IdPrograma); }
            KdoCmbSetValue($("#CmbCliente"), data.IdCliente);
            sessionStorage.setItem("OTer_CmbCliente", data.IdCliente);

            fn_ObtenerOTKbsFinalizadas(
                null,
                data.IdOrdenTrabajo,
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma")),
                $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );
            sessionStorage.setItem("OTer_CmbOrdenTrabajo", JSON.stringify(data.toJSON()));
        }

    });

    $("#dFechaDesde").data("kendoDatePicker").bind("change", function () {
        fn_ObtenerOTKbsFinalizadas(null, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'), null,
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
        );

        sessionStorage.setItem("OTer_dFechaDesde", kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'));
    });

    $("#dFechaHasta").data("kendoDatePicker").bind("change", function () {
        fn_ObtenerOTKbsFinalizadas(null, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'), null,
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
        );
        sessionStorage.setItem("OTer_dFechaHasta", kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'));
    });

    $("#chkVerTodas").click(function () {
        fn_ObtenerOTKbsFinalizadas(null, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma"))
            , this.checked, null,
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
        );
        sessionStorage.setItem("OTer_chkVerTodas", this.checked);
    });

    $("#chkRangFechas").click(function () {

        KdoDatePikerEnable($("#dFechaDesde"), this.checked);
        KdoDatePikerEnable($("#dFechaHasta"), this.checked);
        fn_ObtenerOTKbsFinalizadas(null, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'), null,
            this.checked === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            this.checked === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
        );

        sessionStorage.setItem("OTer_chkRangFechas", this.checked);
    });


    $('#chkVerTodas').prop('checked', sessionStorage.getItem("OTer_chkVerTodas") === "true" ? 1 : 0);
    $('#chkRangFechas').prop('checked', sessionStorage.getItem("OTer_chkRangFechas") === null ? 1 : sessionStorage.getItem("OTer_chkRangFechas") === "true" ? 1 : 0);

    KdoDatePikerEnable($("#dFechaDesde"), sessionStorage.getItem("OTer_chkRangFechas") === null ? true : sessionStorage.getItem("OTer_chkRangFechas") === "true" ? true : false);
    KdoDatePikerEnable($("#dFechaHasta"), sessionStorage.getItem("OTer_chkRangFechas") === null ? true : sessionStorage.getItem("OTer_chkRangFechas") === "true" ? true : false);

    fn_ObtenerOTKbsFinalizadas(
        null,
        obj_OT === "" || obj_OT === undefined ? null : obj_OT.IdOrdenTrabajo,
        sessionStorage.getItem("OTer_CmbCliente") === null || sessionStorage.getItem("OTer_CmbCliente") === "" ? null : sessionStorage.getItem("OTer_CmbCliente"),
        obj_Pro === "" || obj_Pro === undefined ? null : obj_Pro.IdPrograma,
        $("#chkVerTodas").is(':checked'),
        null,
        $("#chkRangFechas").is(':checked')===false ? null : kendo.toString(kendo.parseDate(sessionStorage.getItem("OTer_dFechaDesde") === null ? $("#dFechaDesde").val() : sessionStorage.getItem("OTer_dFechaDesde")), 's'),
        $("#chkRangFechas").is(':checked') ===false? null : kendo.toString(kendo.parseDate(sessionStorage.getItem("OTer_dFechaHasta") === null ? $("#dFechaHasta").val() : sessionStorage.getItem("OTer_dFechaHasta")), 's')
    );

    $("#btnEliminaFiltros").click(function (event) {
        //limpiar filtros
        KdoCmbSetValue($("#CmbCliente"), "");
        sessionStorage.setItem("OTer_CmbCliente", "");
        KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), "");
        sessionStorage.setItem('OTer_CmbOrdenTrabajo', "");
        KdoMultiColumnCmbSetValue($("#CmbPrograma"), "");
        sessionStorage.setItem('OTer_CmbPrograma', "");
        $('#chkVerTodas').prop('checked', 0);
        sessionStorage.setItem("OTer_chkVerTodas", 0);
        $('#chkRangFechas').prop('checked', 1);
        sessionStorage.setItem("OTer_chkRangFechas", 1);

        $("#dFechaDesde").data("kendoDatePicker").value(kendo.toString(kendo.parseDate(new Date(dtfecha.getFullYear(), dtfecha.getMonth() - 1, dtfecha.getUTCDate())), 's'));
        $("#dFechaHasta").data("kendoDatePicker").value(Fhoy());
        KdoDatePikerEnable($("#dFechaHasta"), true);
        KdoDatePikerEnable($("#dFechaDesde"), true);
        sessionStorage.setItem("OTer_dFechaDesde", kendo.toString(kendo.parseDate(new Date(dtfecha.getFullYear(), dtfecha.getMonth() - 1, dtfecha.getUTCDate())), 's'));
        sessionStorage.setItem("OTer_dFechaHasta", kendo.toString(kendo.parseDate(Fhoy()), 's'));

        // consultar nuevamente
        fn_ObtenerOTKbsFinalizadas(null,
            KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma")),
            $("#chkVerTodas").is(':checked'),
            null,
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
        );

    });

});

let fn_DibujarKanban = function (ds) {
    kendo.ui.progress($(document.body), true);

    const result = [];
   
    result.push({
        IdEstatusColumna: "C1",
        EstatusColumna: "PENDIENTE"
    });

    result.push({
        IdEstatusColumna: "C2",
        EstatusColumna: "EN PROGRESO"
    });
    result.push({
        IdEstatusColumna: "C3",
        EstatusColumna: "FINALIZADO"
    });

    result.push({
        IdEstatusColumna: "C4",
        EstatusColumna: "EN SIMULACIÓN"
    });

    ResultOrden = [];
    ResultOrden = sortByKeyAsc(result, "IdEstatusColumna");

    let MyKanban = $("#myKanban");
    MyKanban.children().remove();
    $.each(ResultOrden, function (index, elemento) {
        let EstatusColumna = elemento.EstatusColumna === null ? '</br>' : elemento.EstatusColumna;

        MyKanban.append('<div data-id="_' + elemento.IdEstatusColumna + '" class="kanban-board form-group col-lg-12 sortable-drag" draggable="false">' +
            '<header class="kanban-board-header">' +
            '<div class="kanban-title-board"></div>' +
            '<div class="user">' +
            '<div class="avatar-sm float-left mr-2" id="MyPhoto1">' +
            //'<img src="/Images/DefaultUser.png" alt="..." class="avatar-img rounded-circle" draggable="false">' +
            '</div>' +
            '<div class="info">' +
            '<a data-toggle="collapse" aria-expanded="true" class="">' +
            '<span>' +
            '<span id="MyUserName"><strong>' + EstatusColumna + '</strong></span>' +
            '</span>' +
            '</br>' +
            ' </a>' +
            '</div>' +
            '</div>' +
            '</header>' +
            '<div><br/></div>' +
            '<main class="kanban-drag" id="' + elemento.IdEstatusColumna + '">' +
            '</main>' +
            '<footer></footer>' +
            '</div>'
        );
        let filtro = [];
        JSON.parse(JSON.stringify(ds), function (key, value) {
            if (value !== null) {
                if (value.IdEstatusColumna === elemento.IdEstatusColumna) filtro.push(value);

            }
            return value;
        });

        let MainKanba = $("#" + elemento.IdEstatusColumna + "");
        MainKanba.children().remove();
  

        $.each(filtro, function (index, elemento) {
            let NoRegPrenda = elemento.NoDocumentoRegPrenda === null ? '' : elemento.NoDocumentoRegPrenda;
            let NoReferencia = elemento.NoReferencia === null ? '' : elemento.NoReferencia;
            let StyleEstadoOT = elemento.ColorEstadoOT === null ? "" : 'style=\"background-color:' + elemento.ColorEstadoOT + ';\"';
            let IdUsuarioKB = (elemento.IdUsuarioAsignado === undefined || elemento.IdUsuarioAsignado === null) ? '' : elemento.IdUsuarioAsignado;
            let CodigoDisenoAX = (elemento.CodigoDisenoAX === undefined || elemento.CodigoDisenoAX === null) ? '' : elemento.CodigoDisenoAX;
            let CodigoOTOrigen = elemento.NoOtOrigen === null ? '' : elemento.NoOtOrigen;
            MainKanba.append('<div class="kanban-item" style="" draggable="false" id="' + elemento.IdRow + '" >' +
                //'<div class= "form-group col-lg-2">' +
                '<div class="card border-success mb-3" style="max-width: 18rem;">' +
                '<div class= "TSM-card-header bg-transparent border-success" style = "white-space:normal;font-weight: bold;">' +
                //'<a class="btn-link stretched-link" target="_blank" href="/OrdenesTrabajo/ElementoTrabajo/' + elemento.IdOrdenTrabajo + '/' + elemento.IdEtapaProceso + '">' + elemento.NoDocumento + '<a />' +
                '<ul id="Menu_' + elemento.IdRow + '" ' + StyleEstadoOT + '>' +
                '<li class="emptyItem">' +
                '<span class="empty">' + elemento.NoDocumento + '</span>' +
                '<ul>' +
                '<li onclick=\"fn_VerOt(' + elemento.IdOrdenTrabajo + "," + elemento.IdEtapaProceso + ');\"> <span class="k-icon k-i-file-txt"></span>Ver orden de trabajo</li>' +
                '</ul>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div class="card-body">' +
                '<h5 class="TSM-card-title" style="white-space:normal;font-weight: bold;">' + elemento.NombreDiseño + '</h5>' +
                '<h1 class="TSM-card-title" style="white-space:normal;font-weight: bold;">' + elemento.TallaDesarrollar + '</h1>' +
                '<h1 class="TSM-card-subtitle" style="white-space:normal;font-weight: bold;">' + NoReferencia + '</h1>' +
                '<h1 class="TSM-card-subtitle" style="white-space:normal;font-weight: bold;">' + elemento.NoPrograma + '</h1>' +
                '<h1 class="TSM-card-subtitle" style="white-space:normal;font-weight: bold;">' + NoRegPrenda + '</h1>' +
                '<h1 class="TSM-card-subtitle" style="white-space:normal;font-weight: bold;">' + elemento.NombreEtapa + '</h1>' +
                '<p class="card-text" style="white-space:normal;">Usuario:' + IdUsuarioKB + '<br/><span style="white-space:normal;font-weight: bold;">' + (elemento.NombreTipoOrden === null ? "" : elemento.NombreTipoOrden) + '</span><br/> Programa: ' + elemento.NombrePrograma + "<br/>Prenda: " + elemento.Prenda + "<br/>" +
                'Color Tela: ' + elemento.ColorTela + (CodigoDisenoAX !== "" ? "<br/>" + 'Diseño AX: ' + CodigoDisenoAX : "") + "<br/>Tallas: " + elemento.Tallas + (CodigoOTOrigen === "" ? "</p>" : "<br/><b>OT Origen: " + CodigoOTOrigen + "</b> </p>") +
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


        });

    });


    //fn_IniciarKanban();

    kendo.ui.progress($(document.body), false);


};

let fn_ObtenerOTKbsFinalizadas = function (xIdEtapaProceso, xIdOrdenTrabajo, xIdCliente, xIdPrograma, xsnTodos, xIdTipoOrdenTrabajo, xFechaDesde, xFechaHasta) {
    kendo.ui.progress($(document.body), true);
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: TSM_Web_APi + "OrdenesTrabajos/GetOrdenesTrabajosTerminadas",
        data: JSON.stringify({
            IdOrdenTrabajo: xIdOrdenTrabajo,
            IdCliente: xIdCliente,
            IdPrograma: xIdPrograma,
            IdTipoOrdenTrabajo: xIdTipoOrdenTrabajo,
            FechaDesde: xFechaDesde,
            FechaHasta: xFechaHasta,
            snTodos: xsnTodos

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

//#region Filtros 
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
    GetOrdenesTrabajos: function () {
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
                            url: function () { return TSM_Web_APi + "OrdenesTrabajos/GetOTConsulta/" + (KdoCmbGetValue($("#CmbCliente")) === null ? 0 : KdoCmbGetValue($("#CmbCliente"))) + "/" + (KdoMultiColumnCmbGetValue($("#CmbPrograma")) === null ? 0 : KdoMultiColumnCmbGetValue($("#CmbPrograma"))); },
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
//#endregion


// obtiene el programa y el resultado se lo paso al source del objeto para encontrar el valor
let fn_SetValueMulticolumIdProgramaCfd = (e, id) => {
    $.ajax({
        url: TSM_Web_APi + "Programas/GetProgramasbyId/" + id.toString(),
        type: 'GET',
        dataType: "json",
        success: function (data) {
            fn_multiColumnSetJson(e, JSON.stringify(data[0]), id);
            sessionStorage.setItem('OTer_CmbPrograma', JSON.stringify(data[0]));
        }
    });
}
// obtiene la orden de trabajo y el resultado se lo paso al source del objeto para encontrar el valor
let fn_SetValueMulticolumIdOTCfd = (e, id) => {
    $.ajax({
        url: TSM_Web_APi + "Programas/GetProgramasbyId/" + id.toString(),
        type: 'GET',
        dataType: "json",
        success: function (data) {
            fn_multiColumnSetJson(e, JSON.stringify(data[0]), id);
            sessionStorage.setItem('OTer_CmbOrdenTrabajo', JSON.stringify(data[0]));
        }
    });
}
let sortByKeyDesc = function (array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
};
let sortByKeyAsc = function (array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
};

fPermisos = function (datos) {
    Permisos = datos;
};