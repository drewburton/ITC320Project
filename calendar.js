"use strict";

$(document).ready(() => {
	$("#home").click(() => location.href = "index.html");
	$("#calendar").click(() => location.reload());
	$("#events").click(() => location.href = "config.html");
	$("#about").click(() => location.href = "about.html");

	$("#datepicker").datepicker();
});