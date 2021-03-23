var Permisos;
var fn_TintasFCargarConfiguracion = function () {
    maq = fn_GetMaquinas();
    TiEst = fn_GetTipoEstaciones();

    // crea dataSource para grid
    var dataSource = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: function (datos) {
                $.ajax({
                    type: "GET",
                    dataType: 'json',
                    url: TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/GetResumenbyIdSeteo/"+ maq[0]["IdSeteo"],
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        datos.success(result);
                    },
                    error: function () {
                        options.error(result);
                    }
                });
            }
        },
        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,
        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        error: Grid_error,
        schema: {
            model: {
                id: "IdSeteo",
                fields: {
                    IdSeda: { type: "number" },
                    DesSeda: {type:"string"},
                    IdTipoEmulsion: { type: "number" },
                    DesTipoEmulsion: {type:"string"},
                    CantidadEstaciones: { type: "string" },
                    Estaciones: { type: "string" },
                    Capilar: {type: "string" }
                   
                }
            }
        }
    });

    var selectedRows = [];
    //CONFIGURACION DEL GRID,CAMPOS
    $("#gridresumen").kendoGrid({

        dataBound: function () {
            for (var i = 0; i < this.columns.length; i++) {
                this.autoFitColumn(i);
                this.columnResizeHandleWidth;
            }
        
           // Grid_SetSelectRow($("#gridresumen"), selectedRows);
        },
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "IdSeteo", title: "IdSeteo", hidden:true },
            { field: "IdSeda", title: "Id Seda", minResizableWidth: 120 ,hidden:true},
            { field:"DesSeda", title: "Seda" , minResizableWidth:100},
            { field: "IdTipoEmulsion", title: "Id Tipo Emulsión", minResizableWidth: 120, hidden:true },
            { field: "DesTipoEmulsion", title: "Emulsión", minResizableWidth: 110 },
            { field: "Capilar", title: "Capilar", minResizableWidth: 100 },
            { field: "CantidadEstaciones", title: "Cant. de Marcos", minResizableWidth: 100 },
            { field: "Estaciones", title: "Lista de Estaciones ", minResizableWidth: 100 }
            
            //{ field: "NombrePrenda", title: "Prenda", minResizableWidth: 120 },
            
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridresumen").data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si,300);
    SetGrid_CRUD_ToolbarTop($("#gridresumen").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridresumen").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridresumen").data("kendoGrid"), dataSource);

    $("#gridresumen").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridresumen"), selectedRows);
    });

    $("#maquinaTintasRev").maquinaSerigrafia({
        maquina: {
            data: maq,
            formaMaquina: maq[0].NomFiguraMaquina,
            cantidadBrazos: maq[0].CantidadEstaciones,
            eventos: {
                nuevaEstacion: function (e) {
                    AgregaEstacion(e);
                    maq = fn_GetMaquinas();
                    $("#maquinaTintasRev").data("maquinaSerigrafia").cargarDataMaquina(maq);
                },
                abrirEstacion: fn_VerDetalleBrazoMaquina,
                editarEstacion: fn_VerDetalleBrazoMaquina
            }
        }

    });

    fn_ConsultaEstacionesCambioEstado($("#gridCamEstadoMarco"));
};


var fn_TintasFCargarEtapa = function () {
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true; // verifica estado si esta activo
    $("#maquinaTintasRev").data("maquinaSerigrafia").activarSoloLectura(!vhb);
    $("#gridresumen").data("kendoGrid").dataSource.read();
    $("#gridCamEstadoMarco").data("kendoGrid").dataSource.read();
    vhb === true ? $("#gridCamEstadoMarco").data("kendoGrid").showColumn("Finalizar") : $("#gridCamEstadoMarco").data("kendoGrid").hideColumn("Finalizar");
};

var fn_ConsultaEstacionesCambioEstado = function (gd) {

    var dsMp = new kendo.data.DataSource({
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function () { return TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/GetByIdSeteoMaquina/" + maq[0].IdSeteo; },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            update: {
                url: function (datos) { return TSM_Web_APi + "SeteoMaquinasEstacionesMarcos/UpdEstatusMarcoFinalizado/" + datos.IdSeteo + "/" + datos.IdEstacion; },
                type: "PUT",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }
            }
        },
        schema: {
            model: {
                id: "IdEstacion",
                fields: {
                    IdSeteo: {
                        type: "number"
                    },
                    IdEstacion: {
                        type: "number"
                    },
                    DescripcionEstacion: {
                        type: "string"

                    },
                    ColorHex: {
                        type: "string"

                    },
                    NombreColorEstacion: {
                        type: "string"
                    },
                    Peso: { type: "number" },
                    IdSeda: {
                        type: "number"
                    },
                    NombreSeda: {
                        type: "string"

                    },
                    IdTipoEmulsion: {
                        type: "number"
                    },
                    NombreEmulsion: {
                        type: "string"

                    },
                    Capilar: {
                        type: "number"
                    },
                    Estado: {
                        type: "string"
                    },
                    NombreEstado: {
                        type: "string"

                    },
                    Finalizado: {
                        type: "bool"

                    }
                }
            }
        },
        requestEnd: function (e) {
            Grid_requestEnd(e);
        }
    });
    //CONFIGURACION DEL GRID,CAMPOS
    gd.kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS

        columns: [
            { field: "Finalizado", title: "Finalizado", editor: Grid_ColCheckbox, template: function (dataItem) { return Grid_ColTemplateCheckBox(dataItem, "Finalizado"); } },
            { field: "Estado", title: "Cod. estado", hidden: true },
            { field: "NombreEstado", title: "Estado", minResizableWidth: 120 },
            { field: "IdEstacion", title: "Estación", minResizableWidth: 50},
            { field: "IdSeteo", title: "Cod. Seteo", hidden: true },
            { field: "DescripcionEstacion", title: "Color", minResizableWidth: 120 },
            {
                field: "ColorHex", title: "Color Muestra", minResizableWidth: 120,
                template: '<span style="background-color: #:ColorHex#; width: 25px; height: 25px; border-radius: 50%; background-size: 100%; background-repeat: no-repeat; display: inline-block;"></span>'
            },
            { field: "NombreColorEstacion", title: "Color Estacion", minResizableWidth: 120, hidden: true},
            { field: "IdSeda", title: "Cod. Seda", hidden: true },
            { field: "NombreSeda", title: "Seda", minResizableWidth: 120 },
            { field: "IdTipoEmulsion", title: "Cod. emulsion", hidden: true },
            { field: "NombreEmulsion", title: "Emulsión", minResizableWidth: 120 },
            { field: "Capilar", title: "Capilar" },
            {
                field: "Finalizar", title: "&nbsp;",
                command: {
                    name: "Finalizar",
          
                    iconClass: "k-icon k-i-success",
                    text: "",
                    title: "&nbsp;",
                    click: function (e) {
                        e.preventDefault();
                        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                        dataItem.set("Estado", "FINALIZADO");
                        this.saveChanges();
                    }
                },
                width: "70px",
                attributes: {
                    style: "text-align: center"
                }
            }
        

        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID

    SetGrid(gd.data("kendoGrid"), ModoEdicion.EnPopup, false, false, true, false, redimensionable.Si, 300);
    SetGrid_CRUD_ToolbarTop(gd.data("kendoGrid"), false);
    SetGrid_CRUD_Command(gd.data("kendoGrid"), false, false);
    Set_Grid_DataSource(gd.data("kendoGrid"), dsMp);

    var srowgr = [];
    gd.data("kendoGrid").bind("dataBound", function (e) { //foco en la fila
        Grid_SetSelectRow(gd, srowgr);
    });

    gd.data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow(gd, srowgr);
    });
};

//Agregar a Lista de ejecucion funcion configurar 
fun_List.push(fn_TintasFCargarConfiguracion);

//Agregar a Lista de ejecucion funcion validación 
var EtapaPush3 = {};
EtapaPush3.IdEtapa = idEtapaProceso;
EtapaPush3.FnEtapa = fn_TintasFCargarEtapa;
fun_ListDatos.push(EtapaPush3);

// Agregar a lista de ejecucion funcion dibujado de maquina.
var EtapaPush = {};
EtapaPush.IdEtapa = idEtapaProceso;
EtapaPush.FnEtapa = function () { return $("#maquinaTintasRev").data("maquinaSerigrafia").cargarDataMaquina(maq); };
fun_ListDatos.push(EtapaPush);

fPermisos = function (datos) {
    Permisos = datos;
};