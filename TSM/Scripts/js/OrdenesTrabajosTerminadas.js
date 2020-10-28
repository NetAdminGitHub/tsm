var Permisos;
let ListadoOT;
let xIdOrdenTrabajo;
let xIdEtapaProceso;
let xItem;
let xIdUsuarioTo;
let xIdUsuarioFrom;
var fn_VerOt = function (xidOrdenTrabajo, xidEtapaProceso) {
    window.location.href = "/OrdenesTrabajo/ElementoTrabajo/" + xidOrdenTrabajo + "/" + xidEtapaProceso;
};
$(document).ready(function () {

    let dtfecha = new Date();

    Kendo_CmbFiltrarGrid($("#CmbCliente"), TSM_Web_APi + "Clientes", "Nombre", "IdCliente", "Selecione un cliente...");
    KdoCmbSetValue($("#CmbCliente"), sessionStorage.getItem("OrdenesTrabajosTerminadas_CmbCliente") === null ? "" : sessionStorage.getItem("OrdenesTrabajosTerminadas_CmbCliente"));

    $("#CmbPrograma").ControlSelecionPrograma();
    KdoMultiColumnCmbSetValue($("#CmbPrograma"), sessionStorage.getItem("OrdenesTrabajosTerminadas_CmbPrograma") === null ? "" : sessionStorage.getItem("OrdenesTrabajosTerminadas_CmbPrograma"));

    $("#CmbOrdenTrabajo").ControlSeleccionOrdenesTrabajos();
    KdoMultiColumnCmbSetValue($("#CmbOrdenTrabajo"), sessionStorage.getItem("OrdenesTrabajosTerminadas_CmbOrdenTrabajo") === null ? "" : sessionStorage.getItem("OrdenesTrabajosTerminadas_CmbOrdenTrabajo"));

    $("#dFechaDesde").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaDesde").data("kendoDatePicker").value(sessionStorage.getItem("OrdenesTrabajosTerminadas_dFechaDesde") === null ? kendo.toString(kendo.parseDate(new Date(dtfecha.getFullYear(), dtfecha.getMonth() - 1, dtfecha.getUTCDate())), 's') : sessionStorage.getItem("OrdenesTrabajosTerminadas_dFechaDesde"));
    $("#dFechaHasta").kendoDatePicker({ format: "dd/MM/yyyy" });
    $("#dFechaHasta").data("kendoDatePicker").value(Fhoy());
    $("#dFechaHasta").data("kendoDatePicker").value(sessionStorage.getItem("OrdenesTrabajosTerminadas_dFechaHasta") === null ? Fhoy() : sessionStorage.getItem("OrdenesTrabajosTerminadas_dFechaHasta"));


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

            sessionStorage.setItem("OrdenesTrabajosTerminadas_CmbCliente", this.dataItem(e.item.index()).IdCliente);
        }
        else {
            fn_ObtenerOTKbsFinalizadas(null, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                null, KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'),
                null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("OrdenesTrabajosTerminadas_CmbCliente", "");
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

            sessionStorage.setItem("OrdenesTrabajosTerminadas_CmbCliente", "");
        }
    });

    $("#CmbPrograma").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {
            fn_ObtenerOTKbsFinalizadas(null, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                this.dataItem(e.item.index()).IdCliente,
                this.dataItem(e.item.index()).IdPrograma,
                $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("OrdenesTrabajosTerminadas_CmbPrograma", this.dataItem(e.item.index()).IdPrograma);

        } else {
            fn_ObtenerOTKbsFinalizadas(null, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
                KdoCmbGetValue($("#CmbCliente")),
                null, $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("OrdenesTrabajosTerminadas_CmbPrograma", "");
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

            sessionStorage.setItem("OrdenesTrabajosTerminadas_CmbPrograma", "");
        }

    });


    $("#CmbOrdenTrabajo").data("kendoMultiColumnComboBox").bind("select", function (e) {
        if (e.item) {

            KdoCmbSetValue($("#CmbCliente"), this.dataItem(e.item.index()).IdCliente);
            KdoMultiColumnCmbSetValue($("#CmbPrograma"), this.dataItem(e.item.index()).IdPrograma);

            fn_ObtenerOTKbsFinalizadas(null, this.dataItem(e.item.index()).IdOrdenTrabajo,
                this.dataItem(e.item.index()).IdCliente,
                this.dataItem(e.item.index()).IdPrograma, $("#chkVerTodas").is(':checked'),
                null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("OrdenesTrabajosTerminadas_CmbOrdenTrabajo", this.dataItem(e.item.index()).IdOrdenTrabajo);

        } else {
            fn_ObtenerOTKbsFinalizadas(null, null,
                KdoCmbGetValue($("#CmbCliente")),
                KdoMultiColumnCmbGetValue($("#CmbPrograma"))
                , $("#chkVerTodas").is(':checked'), null,
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
                $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
            );

            sessionStorage.setItem("OrdenesTrabajosTerminadas_CmbOrdenTrabajo", "");
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

            sessionStorage.setItem("OrdenesTrabajosTerminadas_CmbOrdenTrabajo", "");
        }

    });

    $("#dFechaDesde").data("kendoDatePicker").bind("change", function () {
        fn_ObtenerOTKbsFinalizadas(null, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'), null,
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
        );

        sessionStorage.setItem("OrdenesTrabajosTerminadas_dFechaDesde", kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'));
    });

    $("#dFechaHasta").data("kendoDatePicker").bind("change", function () {
        fn_ObtenerOTKbsFinalizadas(null, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma")), $("#chkVerTodas").is(':checked'), null,
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
        );
        sessionStorage.setItem("OrdenesTrabajosTerminadas_dFechaHasta", kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's'));
    });

    $("#chkVerTodas").click(function () {
        fn_ObtenerOTKbsFinalizadas(null, KdoMultiColumnCmbGetValue($("#CmbOrdenTrabajo")),
            KdoCmbGetValue($("#CmbCliente")),
            KdoMultiColumnCmbGetValue($("#CmbPrograma"))
            , this.checked, null,
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaDesde").val()), 's'),
            $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate($("#dFechaHasta").val()), 's')
        );
        sessionStorage.setItem("OrdenesTrabajosTerminadas_chkVerTodas", this.checked);
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

        sessionStorage.setItem("OrdenesTrabajosTerminadas_chkRangFechas", this.checked);
    });


    $('#chkVerTodas').prop('checked', sessionStorage.getItem("OrdenesTrabajosTerminadas_chkVerTodas") === "true" ? 1 : 0);
    $('#chkRangFechas').prop('checked', sessionStorage.getItem("OrdenesTrabajosTerminadas_chkRangFechas") === null ? 1 : sessionStorage.getItem("OrdenesTrabajosTerminadas_chkRangFechas") === "true" ? 1 : 0);

    KdoDatePikerEnable($("#dFechaDesde"), sessionStorage.getItem("OrdenesTrabajosTerminadas_chkRangFechas") === null ? 1 : sessionStorage.getItem("OrdenesTrabajosTerminadas_chkRangFechas") === "true" ? 1 : 0);
    KdoDatePikerEnable($("#dFechaHasta"), sessionStorage.getItem("OrdenesTrabajosTerminadas_chkRangFechas") === null ? 1 : sessionStorage.getItem("OrdenesTrabajosTerminadas_chkRangFechas") === "true" ? 1 : 0);

    fn_ObtenerOTKbsFinalizadas(sessionStorage.getItem("OrdenesTrabajosTerminadas_CmbEtapasProcesos") === null || sessionStorage.getItem("OrdenesTrabajosTerminadas_CmbEtapasProcesos") === "" ? null : sessionStorage.getItem("OrdenesTrabajosTerminadas_CmbEtapasProcesos"),
        sessionStorage.getItem("OrdenesTrabajosTerminadas_CmbOrdenTrabajo") === null || sessionStorage.getItem("OrdenesTrabajosTerminadas_CmbOrdenTrabajo") === "" ? null : sessionStorage.getItem("OrdenesTrabajosTerminadas_CmbOrdenTrabajo"),
        sessionStorage.getItem("OrdenesTrabajosTerminadas_CmbCliente") === null || sessionStorage.getItem("OrdenesTrabajosTerminadas_CmbCliente") === "" ? null : sessionStorage.getItem("OrdenesTrabajosTerminadas_CmbCliente"),
        sessionStorage.getItem("OrdenesTrabajosTerminadas_CmbPrograma") === null || sessionStorage.getItem("OrdenesTrabajosTerminadas_CmbPrograma") === "" ? null : sessionStorage.getItem("OrdenesTrabajosTerminadas_CmbPrograma"),
        $("#chkVerTodas").is(':checked'),
        null,
        $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate(sessionStorage.getItem("OrdenesTrabajosTerminadas_dFechaDesde") === null ? $("#dFechaDesde").val() : null), 's'),
        $("#chkRangFechas").is(':checked') === false ? null : kendo.toString(kendo.parseDate(sessionStorage.getItem("OrdenesTrabajosTerminadas_dFechaHasta") === null ? $("#dFechaHasta").val() : null), 's'));



});

let fn_DibujarKanban = function (ds) {
    kendo.ui.progress($(document.body), true);

    const result = [];
    const map = new Map();
    for (const item of ds) {
        if (!map.has(item.IdEstatusColumna)) {
            map.set(item.IdEstatusColumna, true);    // set any value to Map
            result.push({
                IdEstatusColumna: item.IdEstatusColumna,
                EstatusColumna: item.EstatusColumna
            });
        }
    }

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
            let StyleEstadoOT = elemento.ColorEstadoOT === null ? "" : 'style=\"background-color:' + elemento.ColorEstadoOT + ';\"';
            let IdUsuarioKB = (elemento.IdUsuarioAsignado === undefined || elemento.IdUsuarioAsignado === null) ? '' : elemento.IdUsuarioAsignado;
            MainKanba.append('<div class="kanban-item" style="" draggable="false" id="' + elemento.IdRow + '" >' +
                //'<div class= "form-group col-lg-2">' +
                '<div class="card border-success mb-3" style="max-width: 18rem;">' +
                '<div class= "card-header bg-transparent border-success" style = "white-space:normal;font-weight: bold;">' +
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
                '<h5 class="card-title" style="white-space:normal;font-weight: bold;">' + elemento.NombreDiseño + '</h5>' +
                '<h1 class="card-title" style="white-space:normal;font-weight: bold;">' + NoRegPrenda + '</h1>' +
                '<h1 class="card-title" style="white-space:normal;font-weight: bold;">' + elemento.NombreEtapa + '</h1>' +
                '<p class="card-text" style="white-space:normal;">Usuario:' + IdUsuarioKB + '<br/> Programa: ' + elemento.NoPrograma + " " + elemento.NombrePrograma + "<br/>Prenda: " + elemento.Prenda + "<br/>" +
                'Color Tela: ' + elemento.ColorTela + '</p>' +
                '</div>' +
                '<div class="card-footer bg-transparent border-success" style="white-space:normal;font-weight: bold;">Fecha OT: ' + kendo.toString(kendo.parseDate(elemento.FechaOrdenTrabajo), "dd/MM/yyyy HH:mm:ss") + '</div>' +
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