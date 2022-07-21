$.fn.extend({
    ControlPantones: function () {
     
        
            return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Codigo",
                dataValueField: "ID",
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
    ControlPantonesLaboratorio: function (opt) {
        var strcontroller = "";
        var defaults = {
            modoNuevo: false,
            idSeteo: 0
        }
        var params = $.extend({}, defaults, opt);
        if (params.modoNuevo === true || params.idSeteo ===0) {
            strcontroller = "/Pantoneras/GetBusquedaPantoneraLab";
        } else {

            strcontroller = "/ResultadosPiezasPruebasLaboratorio/ColoresDiseno/" + params.idSeteo;
        }
       // strcontroller: "/Pantoneras/GetBusquedaPantoneraLab",



        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Codigo",
                dataValueField: "ID",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + strcontroller; },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "IdTipoPantonera", title: "Cod. Pantonera", width: 50},
                    { field: "Item", title: "Posición", width: 50 },
                    { field: "NomIdTipoPantonera", title: "Pantonera"  },
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
                valuePrimitive: true,
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
                            url: function (datos) { return TSM_Web_APi + "Articulos/GetArticulosMateriaPrima/" + idQuimica + "/1"; },
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
                placeholder: "Selección de Programas",
                valuePrimitive: true,
                clearButton:false,
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
    },
    ControlSeleccionOrdenesTrabajos: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "NoDocumento",
                dataValueField: "IdOrdenTrabajo",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                clearButton:false,
                placeholder: "Selección de Ordenes de Trabajo",
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function () {
                                return TSM_Web_APi + "OrdenesTrabajos/GetOrdenesTrabajosConsulta";
                            },
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
    },
    ControlSelecionSolicitudesCambios: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Nombre",
                dataValueField: "IdSolicitudCambio",
                filter: "contains",
                autoBind: false,
                height: 400,
                placeholder: "Selección de solicitudes cambio",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "SolicitudesCambios/GetEtapasImpacto"; },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "IdSolicitudCambio", title: "Solicitud Cambio", width: 150 },
                    { field: "Nombre", title: "Nombre", width: 300 },
                    { field: "EtapasImpacto", title: "Etapas de impacto", width: 500 }
                ]
            });
        });
    },
    ControlSelecionSolicitudesCambiosAjustes: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Nombre",
                dataValueField: "IdSolicitudCambio",
                filter: "contains",
                autoBind: false,
                height: 400,
                placeholder: "Selección de solicitudes cambio",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "SolicitudesCambios/GetEtapasImpactoAjuste"; },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "IdSolicitudCambio", title: "Solicitud Cambio", width: 150 },
                    { field: "Nombre", title: "Nombre", width: 300 },
                    { field: "EtapasImpacto", title: "Etapas de impacto", width: 500 }
                ]
            });
        });
    },
    ControlSelecionSolicitudesCambiosAjustesTipoOT: function (idTipoOT) {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Nombre",
                dataValueField: "IdSolicitudCambio",
                filter: "contains",
                autoBind: false,
                height: 400,
                placeholder: "Selección de solicitudes cambio",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "SolicitudesCambios/GetEtapasImpactoAjusteTipoOT/" + idTipoOT; },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "IdSolicitudCambio", title: "Solicitud Cambio", width: 150 },
                    { field: "Nombre", title: "Nombre", width: 300 },
                    { field: "EtapasImpacto", title: "Etapas de impacto", width: 500 }
                ]
            });
        });
    },
    ControlSelecionFMCatalogo: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "NoReferencia",
                dataValueField: "IdCatalogoDiseno",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                clearButton:false,
                placeholder: "Selección de FM",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                //filterFields: ["NoReferencia", "Nombre"],
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "CatalogoDisenos/GetCatalogoDisenoFiltro"; },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "NoReferencia", title: "No FM", width: 300 },
                    { field: "Nombre", title: "Nombre", width: 300 },
                    { field: "NombreCliente", title: "Cliente", width: 300 }
                ]
            });
        });
    },
    ControlSelecionByClienteFMCatalogo: function (xidCliente) {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "NoReferencia",
                dataValueField: "IdCatalogoDiseno",
                filter: "contains",
                autoBind: false,
                /*minLength: 3,*/
                height: 400,
                clearButton: false,
                placeholder: "Selección de FM",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                //filterFields: ["NoReferencia", "Nombre"],
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "CatalogoDisenos/GetCatalogoDisenobyClienteFiltro/" + `${xidCliente}`; },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "NoReferencia", title: "No FM", width: 300 },
                    { field: "Nombre", title: "Nombre", width: 300 }
                ]
            });

        });
    },
    ControlSeleccionRequerimeintoSubli: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "NoDocumento",
                dataValueField: "IdRequerimiento",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                placeholder: "Selección de Ordenes de trabajo",
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function () {
                                return TSM_Web_APi + "RequerimientoDesarrollos/GetSubliConsulta";
                            },
                            contentType: "application/json; charset=utf-8"
                        }
                    }

                },
                columns: [
                    { field: "NoDocumento", title: "Orden Trabajo", width: 100 },
                    { field: "Nombre", title: "Nombre del Diseño", width: 200 },
                    { field: "NumeroDiseno", title: "Numero de Diseño", width: 100 },
                    { field: "EstiloDiseno", title: "Estilo Diseño", width: 200 }

                ]
            });
        });
    },
    ControlSelecionSolicitudesCambiosTipoOT: function (idTipoOt) {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Nombre",
                dataValueField: "IdSolicitudCambio",
                filter: "contains",
                autoBind: false,
                height: 400,
                placeholder: "Selección de solicitudes cambio",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "SolicitudesCambios/GetEtapasImpactoTipoOT/" + idTipoOt; },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "IdSolicitudCambio", title: "Solicitud Cambio", width: 150 },
                    { field: "Nombre", title: "Nombre", width: 300 },
                    { field: "EtapasImpacto", title: "Etapas de impacto", width: 500 }
                ]
            });
        });
    },
    ControlSelecionSolicitudProdOT: function (idOT) {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "NoDocumento",
                dataValueField: "IdOrdenTrabajo",
                filter: "contains",
                autoBind: false,
                height: 400,
                placeholder: "Selección de ordenes para producción",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "SolicitudProduccionesOrdenesTrabajos/GetOrdenesTrabajoFichaProd/" + idOT; },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "NoDocumento", title: "No Orden Trabajo", width: 150 },
                    { field: "Tamaño", title: "Tamaño", width: 300 }
                ]
            });
        });
    },
    ControlSeleccionOts: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "NoDocumento",
                dataValueField: "IdOrdenTrabajo",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                placeholder: "Selección de ordenes de Trabajo",
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function () {
                                return TSM_Web_APi + "OrdenesTrabajos/GetOrdenesTrabajosConsulta";
                            },
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
    }, ControlSeleccionRDs: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "NoDocumento",
                dataValueField: "IdRequerimiento",
                filter: "contains",
                autoBind: false,
                minLength: 3,
                height: 400,
                placeholder: "Selección de requerimientos",
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function () {
                                return TSM_Web_APi + "RequerimientoDesarrollos/GetRequerimientoDesarrollosCambios";
                            },
                            contentType: "application/json; charset=utf-8"
                        }
                    }

                },
                columns: [
                    { field: "NoDocumento", title: "Requerimiento", width: 100 },
                    { field: "Nombre", title: "Nombre del Diseño", width: 200 },
                    { field: "NumeroDiseno", title: "Numero de Diseño", width: 100 },
                    { field: "EstiloDiseno", title: "Estilo Diseño", width: 200 }

                ]
            });
        });

    }, ControlSeleccionBodegaClie: function (idCliente) {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Nombre",
                dataValueField: "IdBodegaCliente",
                filter: "contains",
                autoBind: false,
                height: 400,
                placeholder: "Selección de bodega",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "BodegasClientes/GetbyCliente/" + idCliente; },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "IdBodegaCliente", title: "Bodega", width: 150 },
                    { field: "Nombre", title: "Nombre", width: 300 },
                    { field: "Direccion", title: "Dirección", width: 500 }
                ]
            });
        });
    },ControlSeleccionIngresoMerca: function (idCliente) {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "NoDocumento",
                dataValueField: "IdIngreso",
                filter: "contains",
                autoBind: false,
                height: 400,
                placeholder: "Selección de Ingreso",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) { return TSM_Web_APi + "IngresoMercancias/GetIngresosMercanciasFiltro/" + idCliente; },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "NoDocumento", title: "Ingreso", width: 100},                 
                    { field: "ReferenciaPL", title: "No. Referencia PL.", width: 300 },
                    { field: "CortesCliente", title: "Cortes", width: 300 },
                    { field: "TotalCuantia", title: "Total Cuantía", width:100 },
                    { field: "FechaIngreso", title: "Fecha", width: 200 },
                    { field: "NombreCliente", title: "Cliente", width: 300 }
                ]
            });
        });
    },
    ControlSeleccionPaises: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Nombre",
                dataValueField: "IdPais",
                filter: "contains",
                autoBind: false,
                minLength: 2,
                height: 400,
                placeholder: "Selección de Paises",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function (datos) {
                                return TSM_Web_APi + "Paises/GetFiltroPais";
                            },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "Nombre", title: "País", width: 300 },
                    { field: "ISO2", title: "ISO 2", width: 100 }                   
                ]
            });
        });
    },
    ControlSeleccionAduanas: function () {
        return this.each(function () {
            $(this).kendoMultiColumnComboBox({
                dataTextField: "Nombre",
                dataValueField: "IdAduana",
                filter: "contains",
                autoBind: false,
                minLength: 2,
                height: 400,
                placeholder: "Selección de Aduanas",
                valuePrimitive: true,
                footerTemplate: 'Total #: instance.dataSource.total() # registros.',
                dataSource: {
                    serverFiltering: true,
                    transport: {
                        read: {
                            url: function () {
                                return TSM_Web_APi + "Aduanas/GetFiltroAduanas";
                            },
                            contentType: "application/json; charset=utf-8"
                        }
                    }
                },
                columns: [
                    { field: "Nombre", title: "Nombre", width: 300 },
                    { field: "CodigoAduana", title: "Código de Aduana", width: 100 }                 
                ]
            });
        });
    },
});