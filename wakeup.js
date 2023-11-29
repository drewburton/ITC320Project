"use strict";

var title;
var startHours;
var startMinutes;
var am;
var duration;
var date;
var rollover;

function getParams() {
	let params = location.search.substring(1).split('&');
	for (const param of params) {
		let parts = param.split('=');
		let key = parts[0];
		let value = parts[1];
		switch (key) {
			case 'title':
				title = decodeURIComponent(value);
				break;
			case 'startHours':
				startHours = parseInt(decodeURIComponent(value));
				break;
			case 'startMinutes':
				startMinutes = parseInt(decodeURIComponent(value));
				break;
			case 'duration':
				duration = parseInt(decodeURIComponent(value));
				break;
			case 'date':
				date = new Date(decodeURIComponent(value));
				break;
			case 'rollover':
				rollover = decodeURIComponent(value);
		}
	}

	if (rollover)
		return;

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

	if (millis === 0)
		setDuration();

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

function setDuration() {
	// show a text saying that the event is currently occuring and will end
	// if the duration has already expired display that the event has ended
	// if rollover, display the next event instead
}

function getNextEvent() {
	const currentUser = sessionStorage.getItem('currentUser') || "admin";

	if (currentUser) {
		let storedEvents = JSON.parse(localStorage.getItem('events')) || [];
		storedEvents = storedEvents.filter(event => event.user === currentUser);
		storedEvents = storedEvents.filter(event => new Date(event.date) > new Date());
		return storedEvents.reduce((e1, e2) => {
			let d1 = new Date(e1.date);
			let d2 = new Date(e2.date);

			if (d1 < d2) return e1;
			if (d2 < d1) return e2;
			if (e1.startHours < e2.startHours) return e1;
			if (e2.startHours < e1.startHours) return e2;
			if (e1.startMinutes < e1.startMinutes) return e1;
			if (e2.startMinutes < e1.startMinutes) return e2;
			return e1;
		});
	}
	return undefined;
}

$(document).ready(() => {
	$("#home").click(() => location.href = "index.html");
	$("#wakeup").click(() => location.reload());
	$("#calendar").click(() => location.href = "calendar.html");
	$("#events").click(() => location.href = "config.html");
	$("#about").click(() => location.href = "about.html");

	getParams();

	if (rollover) {
		let event = getNextEvent();

		if (event) {
			date = new Date(event.date);
			title = event.title;
			startHours = event.startHours;
			startMinutes = event.startMinutes;
			duration = event.duration;

			date.setHours(startHours);
			date.setMinutes(startMinutes);
			am = startHours > 12 ? "pm" : "am";
			startHours = startHours > 12 ? startHours - 12 : startHours;
			startHours = startHours.toString().padStart(2, 0);
			startMinutes = startMinutes.toString().padStart(2, 0);


			setInfo();
			setInterval(setCountdown, 1000);
			performAnimation();

			// figure out a way to wait
		}
	} else {
		setInfo();
		setInterval(setCountdown, 1000);
		performAnimation();
	}
});