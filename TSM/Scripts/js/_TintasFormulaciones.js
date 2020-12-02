var Permisos;
var fn_TintasFCargarConfiguracion = function () {
    KdoButton($("#btnBTTintas"), "delete", "Limpiar");
    KdoButtonEnable($("#btnBTTintas"), false);
    maq = fn_GetMaquinas();
    TiEst = fn_GetTipoEstaciones();
    let UrlMq = TSM_Web_APi + "Maquinas";
    Kendo_CmbFiltrarGrid($("#CmbMaquinaTintas"), UrlMq, "Nombre", "IdMaquina", "Seleccione una maquina ....");
    KdoComboBoxEnable($("#CmbMaquinaTintas"), false);
    KdoCmbSetValue($("#CmbMaquinaTintas"), maq[0].IdMaquina);


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
            { field:"DesSeda", title: "Seda" , minResizableWidth:120},
            { field: "IdTipoEmulsion", title: "Id Tipo Emulsión", minResizableWidth: 120, hidden:true },
            { field: "DesTipoEmulsion", title: "Tipo de Emulsión", minResizableWidth: 120 },
            { field: "Capilar", title: "Capilar", minResizableWidth: 120 },
            { field: "CantidadEstaciones", title: "Cant. de estaciones", minResizableWidth: 120 },
            { field: "Estaciones", title: "Estaciones ", minResizableWidth: 120 }
            
            //{ field: "NombrePrenda", title: "Prenda", minResizableWidth: 120 },
            
        ]
    });

    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID
    SetGrid($("#gridresumen").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si,300);
    SetGrid_CRUD_ToolbarTop($("#gridresumen").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#gridresumen").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#gridresumen").data("kendoGrid"), dataSource);

    $("#gridresumen").data("kendoGrid").bind("change", function (e) {
        Grid_SelectRow($("#gridresumen"), selectedRows);
    });

    

};


var fn_TintasFCargarEtapa = function () {
    vhb = $("#txtEstado").val() !== "ACTIVO" || EtpSeguidor === true || EtpAsignado === false ? false : true; // verifica estado si esta activo
};
// Agregar a lista de ejecucion funcion dibujado de maquina.
var EtapaPush = {};
EtapaPush.IdEtapa = idEtapaProceso;
EtapaPush.FnEtapa = fn_RTCargarMaquina;
fun_ListDatos.push(EtapaPush);

//Agregar a Lista de ejecucion funcion configurar 
var EtapaPush2 = {};
EtapaPush2.IdEtapa = idEtapaProceso;
EtapaPush2.FnEtapa = fn_TintasFCargarConfiguracion;
fun_ListDatos.push(EtapaPush2);

//Agregar a Lista de ejecucion funcion validación 
var EtapaPush3 = {};
EtapaPush3.IdEtapa = idEtapaProceso;
EtapaPush3.FnEtapa = fn_TintasFCargarEtapa;
fun_ListDatos.push(EtapaPush3);


fPermisos = function (datos) {
    Permisos = datos;
};