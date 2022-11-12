sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
        var id;
        return Controller.extend("nebula.com.zmatricularacurso.controller.VistaCursoDetalle", {
            onInit: function () {
                this.router = this.getOwnerComponent().getRouter(this);
                this.router.getRoute("VistaCursoDetalle").attachPatternMatched(this._onPatternMatched, this);
            },
            _onPatternMatched: function (evt) {
                var oArgument = evt.getParameter("arguments");
                id = oArgument.idCurso
                this.verCurso(id)
               
            },
            onBack: function (evt) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("VistaCursos", {}, true);
            },
            verCurso: function(idcours){
                var url_data = "./backendcapacitaciones/service/zcapacitacion/Courses/"+ idcours + "?&$expand=calendars";
                var objetoModel = {};
                var objetoModelTable = {};
                objetoModelTable.lista = [];
                jQuery.ajax({
                    method: 'GET',
                    cache: false,
                    headers: {
                        "X-CSRF-Token": "Fetch"
                    },
                    async: false,
                    url: url_data,
                    dataType: "json",
                    success: function (data, textStatus, jqXHR) {
                        objetoModel = data;
                        objetoModelTable.lista = objetoModel.calendars;
                        jQuery.sap.log.debug('Ok : ' + data);
                    },
                    error: function (xhr, readyState) {
                        jQuery.sap.log.debug('Error: ' + xhr);
                    }
                });

                //var oView = this.getView();
                //var modelCurso = new sap.ui.model.json.JSONModel();
                //modelCurso.setData(objetoModel);
                //oView.setModel(modelCurso, "modCurso");
                const listAux = [...objetoModelTable.lista]//asignacion mutable
                listAux.forEach((items,index)=>{
                    var url_aux = "./backendcapacitaciones/service/masteradmin/MasterModalitys/"+ items.masterModality_ID ;
                    //masterFrequence_ID
                    jQuery.ajax({
                        method: 'GET',
                        cache: false,
                        headers: {
                            "X-CSRF-Token": "Fetch"
                        },
                        async: false,
                        url: url_aux,
                        dataType: "json",
                        success: function (datasM, textStatus, jqXHR) {
                            //ASignadom objeto o variable
                            listAux[index].masterModality_ID = datasM.description;
                            jQuery.sap.log.debug('Ok : ' + datasM);
                        },
                        error: function (xhr, readyState) {
                            jQuery.sap.log.debug('Error: ' + xhr);
                        }
                    });
                });
                listAux.forEach((items,index)=>{
                    var url_aux = "./backendcapacitaciones/service/masteradmin/MasterFrequences/"+ items.masterFrequence_ID ;
                    //masterFrequence_ID
                    jQuery.ajax({
                        method: 'GET',
                        cache: false,
                        headers: {
                            "X-CSRF-Token": "Fetch"
                        },
                        async: false,
                        url: url_aux,
                        dataType: "json",
                        success: function (datasM, textStatus, jqXHR) {
                            //ASignadom objeto o variable
                            listAux[index].masterFrequence_ID = datasM.description;
                            jQuery.sap.log.debug('Ok : ' + datasM);
                        },
                        error: function (xhr, readyState) {
                            jQuery.sap.log.debug('Error: ' + xhr);
                        }
                    });
                });


                this.cargarModeloVista(objetoModel,objetoModelTable);

            },
            cargarModeloVista: function (objetoModel={},objetoModelTable={}) {
                var oView = this.getView();
                var modelParam = new sap.ui.model.json.JSONModel();
                modelParam.setData(objetoModel);
                oView.setModel(modelParam, "CoursesView");
                //Creando modelo solo para la tabla
                var modelTable = new sap.ui.model.json.JSONModel();
                //var objetoModelTable = {};
                //objetoModelTable.lista = [];
                modelTable.setData(objetoModelTable);
                oView.byId('id_tb_horario').setModel(modelTable);

            },
            onMatricular: function (evt){
                //var idCurso = evt.getParameter("listItem").getBindingContext().getProperty("ID");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo('VistaCursoMatricula', {});
            }
        });
    });
