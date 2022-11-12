sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
        var cursos = [];
        return Controller.extend("nebula.com.zmatricularacurso.controller.VistaCursos", {
            onInit: function () {
                this.router = this.getOwnerComponent().getRouter(this);
                this.router.getRoute("VistaCursos").attachPatternMatched(this._onPatternMatched, this);
            },
            _onPatternMatched: function (evt) {
                this.cargarCabecera();
                this.verCursos();
            },
            cargarCabecera: function (){
                    var oView = this.getView();
                    var self = this;
                    var url_data = "./backendcapacitaciones/service/masteradmin/MasterData";
                    var modelParam = new sap.ui.model.json.JSONModel();
                    var objetoModel = {};
                    var listMasterLevel = [];
                    var listFrequence = [];
    
                    jQuery.ajax({
                        type: "GET",
                        cache: false,
                        contentType: "application/json",
                        url: url_data,
                        dataType: "json",
                        async: false,
                        success: function (data, textStatus, jqXHR) {
                            //objetoModel = data.value[0];                        
                            jQuery.sap.log.debug('Ok : ' + data);
                            var listaGeneralData = data.value;
                            for (var i = 0; i < listaGeneralData.length; i++) {
                                if (listaGeneralData[i].groupMaster === 'MasterLevels')
                                    listMasterLevel.push(listaGeneralData[i]);
                                if (listaGeneralData[i].groupMaster === 'MasterFrequences')
                                    listFrequence.push(listaGeneralData[i]);
                            }
                        },
                        error: function (xhr, readyState) {
                            jQuery.sap.log.debug('Error: ' + xhr);
                        }
                    });
                    objetoModel.listMasterLevel = listMasterLevel;
                    objetoModel.listFrequence = listFrequence;
                    modelParam.setData(objetoModel);
                    oView.setModel(modelParam, "modelLevels");
                    oView.setModel(modelParam, "modelFrequence");
            },
            verCursos: function () {
                var url_data = "./backendcapacitaciones/service/zcapacitacion/Courses"
                jQuery.ajax({
                    method: 'GET',
                    cache: false,
                    headers: {
                        "X-CSRF-Token": "Fetch"
                    },
                    async: false,
                    url: url_data
                }).then(function successCallback(result, xhr, data) {
                    cursos = result.value;
                }, function errorCallback(xhr, readyState) {
                    jQuery.sap.log.debug('Error: ' + xhr);
                });
                //Poblar datos
                //Obtener vista correspondiente
                var oView = this.getView();
                //Obtener modelo
                var modelTodo = new sap.ui.model.json.JSONModel();
                var obj = {
                    verCursos: cursos
                };
                //setear modelo a toda la vista
                modelTodo.setData(obj);
                oView.setModel(modelTodo);
            },
            onDetalleCurso: function (evt){
                var idCurso = evt.getParameter("listItem").getBindingContext().getProperty("ID");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo('VistaCursoDetalle', { idCurso: idCurso });
            }
        });
    });
