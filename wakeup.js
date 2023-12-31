"use strict";

var title;
var startHours;
var startMinutes;
var am;
var duration;
var date;
var rollover;

class Gradient {
	constructor(user, gradient) {
		this.user = user;
		this.gradient = gradient;
	}
}

// define map of gradients options
var gradients = new Map();
gradients.set("sunrise", "linear-gradient(to bottom, #191970, #ffa700)");
gradients.set("bliss", "linear-gradient(to bottom, #1a1a2e, #30475e, #5c6b7f, #c0a7b8, #f4e1d2)")
gradients.set("dawn", "linear-gradient(to bottom, #2b5876, #4e4376, #d15959)");
gradients.set("twilight", "linear-gradient(to bottom, #1a1a1a, #4d394b, #7c5973, #ab789b, #db98c4)");

/**
 * Sets the global variables from the query parameters
 */
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

/**
 * Sets the text of the pages HTML elements
 */
function setInfo() {
	$('#title').text(title);
	$('#time').text("at " + startHours + ":" + startMinutes + " " + am);
	$('#duration').text("for " + duration + " minutes");
}

/**
 * Sets the countdown timer until the event starts
 * resolves when timer reaches 0
 */
async function setCountdown() {
	$('#status').text('');
	await new Promise(resolve => {
		const interval = setInterval(() => {
			let millis = Math.max(date - new Date(), 0);
			if (millis === 0) {
				resolve();
				clearInterval(interval);
			};

			let hours = Math.floor(millis / 1000 / 60 / 60);
			millis %= 1000 * 60 * 60;
			let minutes = Math.floor(millis / 1000 / 60);
			millis %= 1000 * 60;
			let seconds = Math.floor(millis / 1000);

			$('#countdown').text(hours.toString().padStart(2, 0) +
				":" + minutes.toString().padStart(2, 0) +
				":" + seconds.toString().padStart(2, 0));
		});
	});


}

/**
 * Sets the background gradient in motion based on the time left
 */
function performAnimation() {
	let time = Math.max(date - new Date(), 0) / 1000;
	console.log("animation: ", time);

	if ($('body').css('background-position') != "0% 0%")
		location.reload();

	$('body').css('animation', `BackgroundAnimation ${time}s ease forwards`);
	$('.info').css('animation', `InfoAnimation ${time}s ease forwards`);
}

/**
 * Sets the countdown timer to what is left of the duration of the event
 * that has started
 */
async function setDuration() {
	$('#status').text('This event is currently occuring');

	await new Promise(resolve => {
		const interval = setInterval(() => {
			let dateFinish = new Date(date.getTime() + (duration * 60 * 1000));
			let millis = Math.max(dateFinish - new Date(), 0);
			if (millis === 0) {
				resolve();
				clearInterval(interval);
			};

			let hours = Math.floor(millis / 1000 / 60 / 60);
			millis %= 1000 * 60 * 60;
			let minutes = Math.floor(millis / 1000 / 60);
			millis %= 1000 * 60;
			let seconds = Math.floor(millis / 1000);

			$('#countdown').text(hours.toString().padStart(2, 0) +
				":" + minutes.toString().padStart(2, 0) +
				":" + seconds.toString().padStart(2, 0));
		});
	});
}

/**
 * @returns the next event starting or currently happening for the current user
 */
function getNextEvent() {
	const currentUser = sessionStorage.getItem('currentUser') || undefined;

	if (currentUser) {
		let storedEvents = JSON.parse(localStorage.getItem('events')) || [];
		storedEvents = storedEvents.filter(event => event.user === currentUser);
		storedEvents = storedEvents.filter(event => new Date(event.date).setHours(event.startHours, event.startMinutes + event.duration) >= new Date());
		if (storedEvents.length === 0)
			return undefined;
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

/**
 * sets the color of the gradient to the given value
 * @param {*} value 
 */
function setGradient(value) {
	$('body').css('background', gradients.get(value));
	$('body').css('background-size', "400% 400%");
}

$(document).ready(async () => {
	$("#home").click(() => location.href = "index.html");
	$("#wakeup").click(() => location.reload());
	$("#calendar").click(() => location.href = "calendar.html");
	$("#events").click(() => location.href = "config.html");
	$("#about").click(() => location.href = "about.html");

	// define the select menu for the gradient
	$("#gradient").selectmenu({
		// get the value of the gradient stored or default to sunrise
		create: function (evt, ui) {
			let gradient = JSON.parse(localStorage.gradient ?? '{"gradient":"sunrise"}');
			if (!localStorage.gradient && sessionStorage.currentUser) {
				localStorage.gradient = JSON.stringify(new Gradient(sessionStorage.currentUser, "sunrise"));
			}
			$('#gradient').val(gradient.gradient);
			$(this).selectmenu('refresh');
			setGradient(gradient.gradient);
		},
		// store the gradient and update the background on change
		change: function (evt, ui) {
			if (sessionStorage.currentUser) {
				localStorage.gradient = JSON.stringify(new Gradient(sessionStorage.currentUser, ui.item.value));
			}
			setGradient(ui.item.value);
		}
	});

	getParams();

	// handle looping through the next events until all have occured
	if (rollover) {
		let event = getNextEvent();

		while (event) {
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
			performAnimation();
			await setCountdown();
			await setDuration();
			event = getNextEvent();
		}

		if ($('body').css('background-position') != "0% 0%")
			location.reload();

		$('#status').text('There are no new events');
		$('#countdown').text('');
		$('#title').text('');
		$('#time').text('');
		$('#duration').text('');
	} else { // display the countdown for the selected event only
		setInfo();
		performAnimation();
		await setCountdown();
		await setDuration();
		$('#status').text('This event has ended');
		$('#countdown').text('');
	}
});