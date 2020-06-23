$.fn.extend({
    ControlPantones: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Codigo",
                dataValueField: "IdTipoPantonera",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "/Pantoneras/GetBusquedaPantonera"; },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "IdTipoPantonera", title: "Cod. Pantonera", width: 50 },
                    { field: "Item", title: "Posición", width: 50 },
                    { field: "NomIdTipoPantonera", title: "Pantonera", width: 200 },
                    { field: "Codigo", title: "Pantone", width: 200 },
                    { field: "Nombre", title: "Nombre", width: 200 },
                    { field: "ColorHex", title: "&nbsp;", width: 50, template: '<span style="background-color: #:ColorHex#; width: 25px; height: 25px; border-radius: 50%; background-size: 100%; background-repeat: no-repeat; display: inline-block;"></span>' }
                ]
            });
        });
    },
    ControlSelecionMateriaPrima: function (idQuimica) {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Nombre",
                dataValueField: "IdArticulo",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                valuePrimitive:true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "Articulos/GetArticulosMateriaPrima/" + idQuimica + "/0"; },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "IdArticulo", title: "Código. Articulo", width: 150 },
                    { field: "Nombre", title: "Nombre", width: 300 },
                    { field: "Alias", title: "Alias", width: 300 }
                ]
            });
        });
    },
    ControlSelecionMateriaPrimaOEKOTEX: function (idQuimica) {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Nombre",
                dataValueField: "IdArticulo",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) {  return TSM_Web_APi + "Articulos/GetArticulosMateriaPrima/" + idQuimica + "/1"; },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "IdArticulo", title: "Código. Articulo", width: 150 },
                    { field: "Nombre", title: "Nombre", width: 300 },
                    { field: "Alias", title: "Alias", width: 300 },
                    { field: "ClaseOEKOTEX", title: "Clase OEKOTEX", width: 150 },
                    { field: "CumpleOEKOTEX", title: "Cumple OEKOTEX", width: 150 },
                    { field: "EstatusOEKOTEX", title: "Estatus OEKOTEX", width: 150 }
                ]
            });
        });
    },
    ControlSelecionOTSublimacion: function (idCliente) {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "NoOT",
                dataValueField: "IdRequerimiento",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                placeholder: "Selección de No Documento",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "Prendas/GetPrendasEnDesarrollo/" + idCliente; },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "NoOT", title: "No Orden Trabajo", width: 150 },
                    { field: "NombrePrenda", title: "Nombre Prenda", width: 300 }
                ]
            });
        });
    },
    ControlSelecionPrograma: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Nombre",
                dataValueField: "IdPrograma",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                placeholder:"Selección de Programas",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "Programas/GetProgramasFiltro"; },
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