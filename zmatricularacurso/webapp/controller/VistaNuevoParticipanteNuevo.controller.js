sap.ui.define([
    "sap/ui/core/Fragment",
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Fragment,Controller) {
        "use strict";
        var idCalendar
        
        return Controller.extend("nebula.com.zmatricularacurso.controller.VistaNuevoParticipanteEdit", {
            onInit: function () {
                
            },
            onPopupHorario: function(evt) {
                //alert('hi');
                var oView = this.getView();
                var self = this;
                var oDialog = oView.byId("id_horario_popup");
                //Poblar el modelo
                var url_data = "./backendcapacitaciones/service/zcapacitacion/CalendarsCustom";
                var modelPopup = new sap.ui.model.json.JSONModel();
                var objetoModel = {};
                objetoModel.listaHorarios = [];
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
                        objetoModel.listaHorarios = data.value;
                       
                    },
                    error: function (xhr, readyState) {
                        jQuery.sap.log.debug('Error: ' + xhr);
                    }
                });
                modelPopup.setData(objetoModel);
				oView.setModel(modelPopup, "modelPopup");

				if (!oDialog) {
					oDialog = sap.ui.xmlfragment(oView.getId(), "nebula.com.zmatricularacurso.fragmentviews.Horario", this);
				}

				oView.addDependent(oDialog);

				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
				oDialog.open();
            },

            selectRow: function(evt) {
            //var oView = this.getView().getModel() //Ok para entrega de datos individual
            var item = evt.getSource().getBindingContext("modelPopup").getObject();//captura fila seleccionada
            var oView = this.getView();
            var modelParam = new sap.ui.model.json.JSONModel();
                        
            /*modelParam.setData(item);
            oView.setModel(modelParam, "NewCompetitor");*/ //Entrega datos como conjunto al modelo
            oView.byId("ipt_NombreCurso").setValue(item.nombreCurso);
            idCalendar = item.idCalendar;
            /*
            oView.byId("txtNivel").setValue(item.descLevel); //Entrega datos de forma individual al modelo "RegCurso"
            oView.byId("txtNombreCurso").setValue(item.nombreCurso); */
			this.onClosePopUpHorario();
            },

            onClosePopUpHorario:function(evt) {
                //alert('onClosePopUpHorario');
            var oView = this.getView();
			var oDialog = oView.byId("id_horario_popup");
			if (oDialog) {
				oDialog.destroy();
    			}
            }
        });
    });