/*global QUnit*/

sap.ui.define([
	"cominbetta/rnc_fornecedor/controller/RNCFornecedor.controller"
], function (Controller) {
	"use strict";

	QUnit.module("RNCFornecedor Controller");

	QUnit.test("I should test the RNCFornecedor controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
