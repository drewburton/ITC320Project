"use strict";

var title;
var startHours;
var startMinutes;
var am;
var duration;
var date;

function getParams() {
	let params = location.search.substring(1).split('&');
	for (const param of params) {
		let parts = param.split('=');
		let key = parts[0];
		let value = parts[1];
		switch (key) {
			case 'title':
				title = value;
				break;
			case 'startHours':
				startHours = parseInt(value);
				break;
			case 'startMinutes':
				startMinutes = parseInt(value);
				break;
			case 'duration':
				duration = parseInt(value);
				break;
			case 'date':
				date = new Date(value);
		}
	}
	date.setHours(startHours);
	date.setMinutes(startMinutes);
	am = startHours > 12 ? "pm" : "am";
	startHours = startHours > 12 ? startHours - 12 : startHours;
	startHours = startHours.toString().padStart(2, 0);
	startMinutes = startMinutes.toString().padStart(2, 0);
}

function setInfo() {
	$('#title').text(title);
	$('#time').text("at " + startHours + ":" + startMinutes + " " + am);
	$('#duration').text("for " + duration + " minutes");
	setCountdown();
}

function setCountdown() {
	let millis = Math.max(date - new Date(), 0);
	let hours = Math.floor(millis / 1000 / 60 / 60);
	millis %= 1000 * 60 * 60;
	let minutes = Math.floor(millis / 1000 / 60);
	millis %= 1000 * 60;
	let seconds = Math.floor(millis / 1000);

	$('#countdown').text(hours.toString().padStart(2, 0) + ":" + minutes.toString().padStart(2, 0) + ":" + seconds.toString().padStart(2, 0));
}

function performAnimation() {
	let time = Math.max(date - new Date(), 0) / 1000;
	$('body').css('animation', `BackgroundAnimation ${time}s ease forwards`);
	$('.info').css('animation', `InfoAnimation ${time}s ease forwards`)
}

$(document).ready(() => {
	$("#home").click(() => location.href = "index.html");
	$("#wakeup").click(() => location.reload());
	$("#calendar").click(() => location.href = "calendar.html");
	$("#events").click(() => location.href = "config.html");
	$("#about").click(() => location.href = "about.html");

	getParams();
	setInfo();
	setInterval(setCountdown, 1000);

	performAnimation();
});