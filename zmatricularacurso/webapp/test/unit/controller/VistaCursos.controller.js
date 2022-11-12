/*global QUnit*/

sap.ui.define([
	"nebulacom/zmatricularacurso/controller/VistaCursos.controller"
], function (Controller) {
	"use strict";

	QUnit.module("VistaCursos Controller");

	QUnit.test("I should test the VistaCursos controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
