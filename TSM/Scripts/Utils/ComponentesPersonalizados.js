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
                    { field: "IdTipoPantonera", title: "Cod. Pantonera", width: 25 },
                    { field: "Item", title: "Posición", width: 25 },
                    { field: "NomIdTipoPantonera", title: "Pantonera", width: 200 },
                    { field: "Codigo", title: "Pantone", width: 200 },
                    { field: "Nombre", title: "Nombre", width: 200 },
                    { field: "ColorHex", title: "&nbsp;", width: 50, template: '<span style="background-color: #:ColorHex#; width: 25px; height: 25px; border-radius: 50%; background-size: 100%; background-repeat: no-repeat; display: inline-block;"></span>' }
                ]
            });
        });
    }
});