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
$(document).ready(function () {

    let dtfecha = new Date();

    Kendo_CmbFiltrarGrid($("#CmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Selecione un cliente...");
    KdoCmbSetValue($("#CmbCliente"), sessionStorage.getItem("OTer_CmbCliente") === null ? "" : sessionStorage.getItem("OTer_CmbCliente"));

    $("#CmbPrograma").ControlSelecionPrograma();

    if (sessionStorage.getItem("OTer_CmbPrograma") !== null && sessionStorage.getItem("OTer_CmbPrograma") !== "") {
        Mul3 = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        Mul3.search(sessionStorage.getItem("OTer_NombrePrograma"));
        Mul3.text(sessionStorage.getItem("OTer_NombrePrograma") === null ? "" : sessionStorage.getItem("OTer_NombrePrograma"));
        Mul3.trigger("change");
        Mul3.close();

    }

    $("#CmbOrdenTrabajo").ControlSeleccionOrdenesTrabajos();


    if (sessionStorage.getItem("OTer_CmbOrdenTrabajo") !== null && sessionStorage.getItem("OTer_CmbOrdenTrabajo") !== "") {
        Mul1 = $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox");
        Mul1.search(sessionStorage.getItem("OTer_NoDocumento"));
        Mul1.text(sessionStorage.getItem("OTer_NoDocumento") === null ? "" : sessionStorage.getItem("OTer_NoDocumento"));
        Mul1.trigger("change");
        Mul1.close();
    }


    $("#dFechaDesde").kendoDatePicker({
        size: "large",
        format: "dd/MM/yyyy"
    });
    $("#dFechaDesde").data("kendoDatePicker").value(sessionStorage.getItem("OTer_dFechaDesde") === null ? kendo.toString(kendo.parseDate(new Date(dtfecha.getFullYear(), dtfecha.getMonth() - 1, dtfecha.getUTCDate())), 's') : sessionStorage.getItem("OTer_dFechaDesde"));
    $("#dFechaHasta").kendoDatePicker({
        size: "large",
        format: "dd/MM/yyyy"
    });
    $("#dFechaHasta").data("kendoDatePicker").value(Fhoy());
    $("#dFechaHasta").data("kendoDatePicker").value(sessionStorage.getItem("OTer_dFechaHasta") === null ? Fhoy() : sessionStorage.getItem("OTer_dFechaHasta"));


    //Dibujar html



    $("#CmbCliente").data("kendoComboBox").bind("select", function (e) {
        if (e.item) {
            fn_ObtenerOTKbsFinalizadas(null, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                this.dataItem(e.item.index()).IdCliente,
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("OTer_CmbCliente", this.dataItem(e.item.index()).IdCliente);
        }
        else {
            fn_ObtenerOTKbsFinalizadas(null, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                null, KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'),
                null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("OTer_CmbCliente", "");
        }
    });

    $("#CmbCliente").data("kendoComboBox").bind("change", function () {
        var value = this.value();
        if (value === "") {
            fn_ObtenerOTKbsFinalizadas(null, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                null, KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'),
                null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("OTer_CmbCliente", "");
        }
    });

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbPrograma").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdPrograma === Number(this.value()));
        if (data === undefined) {
            fn_ObtenerOTKbsFinalizadas(null, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                null, $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("OTer_CmbPrograma", "");
            sessionStorage.setItem("OTer_NombrePrograma", "");
        } else {
            fn_ObtenerOTKbsFinalizadas(null, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                data.IdPrograma, $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );
            sessionStorage.setItem("OTer_CmbPrograma", data.IdPrograma);
            sessionStorage.setItem("OTer_NombrePrograma", data.Nombre);
        } 

    });

    $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("change", function () {
        var multicolumncombobox = $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox");
        let data = multicolumncombobox.listView.dataSource.data().find(q => q.IdOrdenTrabajo === Number(this.value()));
        if (data === undefined) {
            fn_ObtenerOTKbsFinalizadas(null, null,
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("OTer_CmbOrdenTrabajo", "");
            sessionStorage.setItem("OTer_NoDocumento", "");
        } else {

            fn_ObtenerOTKbsFinalizadas(null, data.IdOrdenTrabajo,
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("OTer_CmbOrdenTrabajo", data.IdOrdenTrabajo);
            sessionStorage.setItem("OTer_NoDocumento", data.NoDocumento);
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

    KdoDatePikerEnable($("#dFechaDesde"), sessionStorage.getItem("OTer_chkRangFechas") === null ? 1 : sessionStorage.getItem("OTer_chkRangFechas") === "true" ? 1 : 0);
    KdoDatePikerEnable($("#dFechaHasta"), sessionStorage.getItem("OTer_chkRangFechas") === null ? 1 : sessionStorage.getItem("OTer_chkRangFechas") === "true" ? 1 : 0);

    fn_ObtenerOTKbsFinalizadas(sessionStorage.getItem("OTer_CmbEtapasProcesos") === null || sessionStorage.getItem("OTer_CmbEtapasProcesos") === "" ? null : sessionStorage.getItem("OTer_CmbEtapasProcesos"),
        sessionStorage.getItem("OTer_CmbOrdenTrabajo") === null || sessionStorage.getItem("OTer_CmbOrdenTrabajo") === "" ? null : sessionStorage.getItem("OTer_CmbOrdenTrabajo"),
        sessionStorage.getItem("OTer_CmbCliente") === null || sessionStorage.getItem("OTer_CmbCliente") === "" ? null : sessionStorage.getItem("OTer_CmbCliente"),
        sessionStorage.getItem("OTer_CmbPrograma") === null || sessionStorage.getItem("OTer_CmbPrograma") === "" ? null : sessionStorage.getItem("OTer_CmbPrograma"),
        $("#chkVerTodas").is(':checked'),
        null,
        $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate(sessionStorage.getItem("OTer_dFechaDesde") === null ? $("#dFechaDesde").val() : null), 's'),
        $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate(sessionStorage.getItem("OTer_dFechaHasta") === null ? $("#dFechaHasta").val() : null), 's'));



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

let fn_ObtenerOTKbsFinalizadas = function (xIdEtapaProceso, xIdOrdenTrabajo, xIdCliente, xIdPrograma, xSNAsignadas, xIdTipoOrdenTrabajo, xFechaDesde, xFechaHasta) {
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
            SNAsignadas: xSNAsignadas

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