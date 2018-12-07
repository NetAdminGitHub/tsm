var Permisos;
var crudServiceBaseUrl = "";
var Tabla = "RequerimientoDesarrollosEstados";
var IdRequerimiento = "0";
var fn_RequerimientoEstados = function () {
    crudServiceBaseUrl = TSM_Web_APi + "RequerimientoDesarrollosEstados";

    $("#TxtMotivo_consulta").prop("readonly", "readonly");
    var dataSource = new kendo.data.DataSource({
        dataType: "json",
        sort: { field: "Fecha", dir: "desc" },
        //CONFIGURACION DEL CRUD
        transport: {
            read: {
                url: function (datos) { return crudServiceBaseUrl + "/GetVistaRequerimientoDesarrollosEstados/" + Tabla + "/" + IdRequerimiento.toString(); }  ,
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            },
            parameterMap: function (data, type) {
                if (type !== "read") {
                    return kendo.stringify(data);
                }

            }
        },


        //FINALIZACIÓN DE UNA PETICIÓN
        requestEnd: Grid_requestEnd,

        // VALIDAR ERROR
        error: Grid_error,

        // DEFINICIÓN DEL ESQUEMA, MODELO Y COLUMNAS
        schema: {
            model: {
                id: "Tabla",
                fields: {
                    Fecha: { type: "date" },
                    Tabla: { type: "number" },
                    IdRequerimiento: { type: "number" },
                    Id: { type: "number" },
                    Estado: { type: "string" },
                    Motivo: { type: "string" },
                    IdUsuario: { type: "string" },
                    NoDocumento: { type: "string" },
                    EtapaProceso: { type: "string" }
             
                }
            }
        }

    });

    //CONFIGURACION DEL GRID,CAMPOS

    $("#dbg_Grid").kendoGrid({
        //DEFICNICIÓN DE LOS CAMPOS
        columns: [
            { field: "Fecha", title: "Fecha hora", format: "{0: dd/MM/yyyy HH:mm:ss.ss}" },
            { field: "Tabla", title: "Tabla", hidden: true },
            { field: "IdRequerimiento", title: "IdRequerimiento", hidden: true },
            { field: "Id", title: "Código", hidden: true },
            { field: "EtapaProceso", title: "Etapa del Proceso"},
            { field: "NoDocumento", title: "NoDocumento del requerimiento" },
            { field: "IdUsuario", title: "Usuario registrado" },
            {field: "Estado", title: "Estado"},
            { field: "Motivo", title: "Motivo Registrado" }


        ]

    });


    // FUNCIONES STANDAR PARA LA CONFIGURACION DEL GRID

    SetGrid($("#dbg_Grid").data("kendoGrid"), ModoEdicion.EnPopup, true, true, true, true, redimensionable.Si, 600);
    SetGrid_CRUD_ToolbarTop($("#dbg_Grid").data("kendoGrid"), false);
    SetGrid_CRUD_Command($("#dbg_Grid").data("kendoGrid"), false, false);
    Set_Grid_DataSource($("#dbg_Grid").data("kendoGrid"), dataSource);

    var selectedRows = [];
    $("#dbg_Grid").data("kendoGrid").bind("dataBound", function (e) {
        Grid_SetSelectRow($("#dbg_Grid"), selectedRows);
    });


    $("#dbg_Grid").data("kendoGrid").bind("change", function (e) {
        $("#TxtMotivo_consulta").val(getMotivo($("#dbg_Grid").data("kendoGrid")));
        Grid_SelectRow($("#dbg_Grid"), selectedRows);
    });


};

var fn_CargarRequerimientoEstados = function (PTabla, PIdRequerimiento) {
    Tabla = PTabla;
    IdRequerimiento = PIdRequerimiento;
    $("#dbg_Grid").data("kendoGrid").dataSource.read();
};

fPermisos = function (datos) {
    Permisos = datos;
};

function getMotivo(g) {
    var SelItem = g.dataItem(g.select());
    return SelItem === null ? 0 : SelItem.Motivo;

}












