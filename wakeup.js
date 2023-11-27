"use strict";


function performAnimation() {
	$('body').css('animation', 'Animation 5s ease forwards');
}

$(document).ready(() => {
	$("#home").click(() => location.href = "index.html");
	$("#wakeup").click(() => location.reload());
	$("#calendar").click(() => location.href = "calendar.html");
	$("#events").click(() => location.href = "config.html");
	$("#about").click(() => location.href = "about.html");

	performAnimation();
});