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
        
        return Controller.extend("nebula.com.zmatricularacurso.controller.VistaNuevoParticipante", {
            onInit: function () {
                alert("Hola vista nuevo particpante ")
                this.router = this.getOwnerComponent().getRouter(this);
                this.router.getRoute("VistaNuevoParticipante").attachPatternMatched(this._onPatternMatched, this);
            },
            _getFormFragment: function (sFragmentName) {
                var pFormFragment = this._formFragments[sFragmentName],
                    oView = this.getView();
    
                if (!pFormFragment) {
                    pFormFragment = Fragment.load({
                        id: oView.getId(),
                        name: "nebula.com.zmatricularacurso.fragmentviews.Horario" + sFragmentName
                    });
                    this._formFragments[sFragmentName] = pFormFragment;
                }
    
                return pFormFragment;
            },
            _showFormFragment : function (sFragmentName) {
                var oView = this.getView();
                var oPage = oView.byId("pageD");
                oPage.removeAllContent();
                this._getFormFragment(sFragmentName).then(function(oVBox){
                    oPage.insertContent(oVBox);
                });
            },            
            _onPatternMatched: function (evt) {
                var oArgument = evt.getParameter("arguments");
                idCalendar = oArgument.idCalendar
                this.cargarCabecera();
                this._formFragments = {};
                // Set the initial form to be the display one
                this._showFormFragment("Display");   
            },
            cargarCabecera: function (){
                var oView = this.getView();
                var self = this;
                var url_data = "./backendcapacitaciones/service/masteradmin/MasterData";
                var modelParam = new sap.ui.model.json.JSONModel();
                var objetoModel = {};
                var listMasterProf = [];
                
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
                            if (listaGeneralData[i].groupMaster === 'MasterProfesions')
                            listMasterProf.push(listaGeneralData[i]);
                        }
                    },
                    error: function (xhr, readyState) {
                        jQuery.sap.log.debug('Error: ' + xhr);
                    }
                });
                objetoModel.listMasterProfesion = listMasterProf;
                modelParam.setData(objetoModel);
                oView.setModel(modelParam, "MaestroProfesion");
                
                var listaRol = [];
                listaRol.push({ID:'ADMIN', description:'Administrador'});
                listaRol.push({ID:'COMPETITOR', description:'Competidor'});
                objetoModel.listMasterRol = listaRol;
                modelParam.setData(objetoModel);
                oView.setModel(modelParam, "modeloRolPart");
        },
        onBack: function (evt){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("VistaCursoMatricula", {}, true);
        },
             onSave: function (evt,idCalendar) {
                var oView = this.getView();
                //var dataMasterLevel = this.getView().getModel("mdlMasterLevels").getData();
                var datosCompetitor = this.getView().getModel("NewCompetitor").getData();
                var dataAux = {};
                dataAux.idCalendar = idCalendar
                dataAux.nombreCurso = datosCompetitor.nombreCurso;//aqui
                dataAux.nameTuition = datosCompetitor.nameTuition;
                //dataAux.lastNameTuition = parseInt(datosCompetitor.lastNameTuition);
                dataAux.lastNameTuition = datosCompetitor.lastNameTuition;
                dataAux.idMasterProfesionCompetitor = datosCompetitor.idMasterProfesionCompetitor;
                dataAux.documentNumberCompetitor = datosCompetitor.documentNumberCompetitor;
                dataAux.sexCompetitor = datosCompetitor.sexCompetitor;
                dataAux.roleCompetitor=datosCompetitor.roleCompetitor;
                dataAux.ageCompetitor=parseInt(datosCompetitor.ageCompetitor);
 

                var table = oView.byId('id_tb_horario');
                var modelTable = table.getModel();
                var dataTable = modelTable.getData();
                var listaHorario = dataTable.lista;
                dataAux.calendars = []; 

                //var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "YYYY/MM/DD" });   
              
                listaHorario.forEach((item, index) => {
                    //item.startDate = formatDate(item.startDate);
                    //item.startDate = anio + "-" + mes + '-' + dia;
                    //item.startDate = dateFormat.format(item.startDate);
                    item.startDate = item.startDate
                    item.masterModality_ID = parseInt(item.masterModality_ID);
                    item.masterFrequence_ID = parseInt(item.masterFrequence_ID);
                    dataAux.calendars.push(item);
                });

                var urlAux = '';
                if (this.metodoOperacion === 'PUT')
                    urlAux = '/' + id;
                var jsonObject = JSON.stringify(dataAux);
                var url_data = "./backendcapacitaciones/service/zcapacitacion/Courses" + urlAux;
                var flagCorrecto = true;

                var aData = jQuery.ajax({
                    type: this.metodoOperacion,
                    cache: false,
                    contentType: "application/json",
                    url: url_data,
                    dataType: "json",
                    async: false,
                    data: jsonObject,

                    success: function (data, textStatus, jqXHR) {
                        flagCorrecto = true;
                    },
                    error: function (xhr, readyState) {
                        flagCorrecto = false;

                    }
                });
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                if (flagCorrecto) {
                    MessageBox.show(
                        "Los datos se grabaron correctamente", {
                        icon: sap.m.MessageBox.Icon.SUCCESS,
                        title: "EXITO!!!",
                        actions: ['OK'],
                        onClose: function (sActionClicked) {
                            if (sActionClicked === 'OK') {
                                
                                oRouter.navTo("CoursesListMantein", {}, true);
                                
                            }
                        }
                    }
                    );

                } else {
                    MessageBox.error(aData.responseText);
                }
            },
        onValidar: function (evt) {
            var self = this;
            var oView = this.getView();
            var aMockMessages = [];
            var flag = true;
            var fieldsKey = ["id_cbx_profesion", "id_cbx_rol"];//son id los campos que son combobox
            var fieldsRequire = [
                "ipt_NombreCurso",
                "ipt_Nombres",
                "ipt_Apellidos",
                "ipt_Dni",
                "ipt_Nivel",
                "ipt_Edad"
            ];//Todos los Ids de todos los campos requeridos(obligatorios)
            var myMapDesc = {
                "ipt_NombreCurso": "Nombre de Curso",
                "ipt_Nombres": "Nombres de Participante",
                "ipt_Apellidos": "Apellidos de Participante",
                "ipt_Dni": "Dni de Participante",
                "ipt_Nivel": "Nivel",
                "ipt_Edad": "Edad",
                "id_cbx_profesion": "Profesión",
                "id_cbx_rol": "Rol"
            };//Descriones de label de todos los campos

            fieldsRequire.forEach((items,index)=> {
                var field=null;
                if (fieldsKey.indexOf(fieldsRequire[index])>=0){
                    field = oview.byId(fieldsRequire[index]).getSelectedKey();
                }else{
                    field = oView.byId(fieldsRequire[index]).getValue();
                }
                if (this.isEmpty(field)) {
                    aMockMessages.push({
                        type: 'Error',
                        title: myMapDesc[fieldsRequire[index]],
                        description: 'Debes agregar un valor',
                        subtitle: 'El campo no debe estar vacío'
                    });
                    oView.byId(fieldsRequire[index]).setValueState(sap.ui.core.ValueState.Error);
                    oView.byId(fieldsRequire[index]).setValueStateText("El campo no debe estar vacío");
                    flag = false;
                } else {
                    oView.byId(fieldsRequire[index]).setValueState(sap.ui.core.ValueState.None);
                }

            });

            if (!flag) {
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(aMockMessages);

                var oMessageTemplate = new sap.m.MessagePopoverItem({
                    type: '{type}',
                    title: '{title}',
                    description: '{description}',
                    subtitle: '{subtitle}'
                });
                self._messagePopover = new sap.m.MessagePopover({
                    items: {
                        path: '/',
                        template: oMessageTemplate
                    }
                });
                self._messagePopover.setModel(oModel);
                self._messagePopover.toggle(evt.getSource());

            } else {
                if (self._messagePopover != null) {
                    self._messagePopover.destroy();
                }
            }
            if (flag) {
                this.onSave(evt);
           
            }
        },
        
            isEmpty: function (inputStr) {
                var flag = false;
                if (inputStr === '') {
                    flag = true;
                }
                if (inputStr === null) {
                    flag = true;
                }
                if (inputStr === undefined) {
                    flag = true;
                }
                if (inputStr == null) {
                    flag = true;
                }
                return flag;
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
