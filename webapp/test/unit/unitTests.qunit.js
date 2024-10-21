/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"cominbetta/rnc_fornecedor/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
