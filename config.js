"use strict";

var sortType = "date";
var shouldDisplayEvents = false;

// defines comparators for display events sorted by different fields
var sortComparators = new Map();
sortComparators.set("date", (e1, e2) => {
	if (e1.date > e2.date)
		return 1;
	else if (e1.date < e2.date)
		return -1;
	return 0;
});
sortComparators.set("start", (e1, e2) => {
	if (e1.startHours > e2.startHours)
		return 1;
	else if (e1.startHours < e2.startHours)
		return -1;
	else if (e1.startMinutes > e2.startMinutes)
		return 1;
	else if (e1.startMinutes < e2.startMinutes)
		return -1;
	return 0;
});
sortComparators.set("duration", (e1, e2) => {
	if (e1.duration > e2.duration)
		return 1;
	else if (e1.duration < e2.duration)
		return -1;
	return 0;
}
);

class Event {
	constructor(user, title, date, startHours, startMinutes, duration) {
		this.user = user
		this.title = title;
		this.date = date;
		this.startHours = startHours;
		this.startMinutes = startMinutes;
		this.duration = duration
	}
}

/**
 * @param {*} title 
 * @param {*} date 
 * @param {*} hours 
 * @param {*} minutes 
 * @param {*} duration 
 * @param {*} user 
 * @returns whether form inputs and user are valid
 */
function validateForm(title, date, hours, minutes, duration, user) {
	let valid = true;

	// validate title
	if (!title) {
		$("#title").next("span").text("Please enter a title");
		valid = false;
	}

	// validate date
	if (date == "Invalid Date") {
		$("#date").next("span").text("Enter a valid date");
		valid = false;
	}

	// validate start time
	if (!hours && !minutes) {
		$("#start").next("span").text("Enter a valid time");
		valid = false;
	}

	// validate duration
	if (!duration || duration <= 0) {
		$("#duration").next("span").text("Enter a valid duration");
		valid = false;
	}

	// validate user
	if (!user) {
		alert("Please login to create events");
		valid = false;
	}
	return valid;
}

/**
 * @param {*} event 
 * @param {*} existingEvents 
 * @returns if an event starts at the same time as another event, 
 * or has the same title for a given user
 */
function isDuplicate(event, existingEvents) {
	for (let e of existingEvents) {
		let date = new Date(e.date);
		date.setHours(e.startHours, e.startMinutes);
		if ((date.getTime() === event.date.getTime() || e.title === event.title) && e.user === event.user) {
			return true;
		}
	}
	return false;
}

/**
 * adds event to events in local storage
 * @param {*} event 
 */
function addEvent(event) {
	// add to web storage
	let existingEvents = JSON.parse(localStorage.getItem("events")) || [];

	// display error if event already exists
	if (isDuplicate(event, existingEvents)) {
		$("#confirmation").toggleClass("duplicate");
		$("#confirmation").text("Your event already exists");
		setTimeout(() => {
			$("#confirmation").text("")
			$("#confirmation").toggleClass("duplicate");
		}, 3000);
	} else {
		console.log(event);
		console.log(JSON.stringify(event));
		existingEvents.push(event);
		let jsonString = JSON.stringify(existingEvents);
		localStorage.events = jsonString;

		// display confirmation message after submission
		$("#confirmation").text("Your event has been successfully added");
		setTimeout(() => $("#confirmation").text(""), 3000);
	}
	// clear fields and focus on first input
	$("#title").val("");
	$("#date").val("");
	$("#start").val("");
	$("#duration").val("");
	$("form input + span.afterInput").text("");

	$("#title").next("span").text("");
	$("#date").next("span").text("");
	$("#start").next("span").text("");
	$("#duration").next("span").text("");

	$("#title").focus();
}

/**
 * handles the logic for submiting the form
 * including retrieving the fields, validation,
 * and storing the event
 * @param {*} evt 
 */
const submitForm = evt => {
	evt.preventDefault();
	// get fields
	let title = $("#title").val();
	let date = $("#date").val().split("-");
	date = new Date(date[0], date[1] - 1, date[2]);
	let start = $("#start").val().split(":");
	let hours = parseInt(start[0]);
	let minutes = parseInt(start[1]);
	date.setHours(hours, minutes);
	let duration = parseInt($("#duration").val());
	let user = sessionStorage.currentUser || undefined;

	// add event if it is valid
	if (validateForm(title, date, hours, minutes, duration, user)) {
		let event = new Event(user, title, date, hours, minutes, duration);

		addEvent(event);
	}
	evt.preventDefault();
};

/**
 * displays the events from storage for the current user
 * sorted by the selected option 
 */
const displayEvents = () => {
	// read from web storage
	let user = sessionStorage.currentUser || undefined;
	if (!user) {
		alert("You must be logged in to view events");
		return;
	}

	// if no events to display, display there are no events
	if (!localStorage.events) {
		let span = document.createElement('span');
		$(span).text("No events to display");
		$("ol").append(span);
		return;
	}

	// get events for the current user
	let events = JSON.parse(localStorage.events).filter(event => event.user === user) || [];
	if (events.length === 0) {
		let span = document.createElement('span');
		$(span).text("No events to display");
		$("ol").append(span);
		return;
	}

	events.map(event => event.date = new Date(event.date));

	events.sort(sortComparators.get(sortType));

	// display in a list (remove any duplicates from web storage while doing this) 
	// creates HTML elements and sets their fields
	for (let i = 0; i < events.length; i++) {
		let entry = document.createElement('li');

		let title = document.createElement('span');
		$(title).text(events[i].title);
		$(title).css({
			'font-size': '1.2em',
		});

		let date = document.createElement('span');
		$(date).text("Date: " + events[i].date.toDateString());

		let startTime = document.createElement('span');
		let am = events[i].startHours > 12 ? "PM" : "AM";
		let hours = events[i].startHours > 12 ? events[i].startHours - 12 : events[i].startHours;
		let minutes = events[i].startMinutes.toString().padStart(2, 0);
		$(startTime).text("Time: " + hours + ":" + minutes + " " + am);

		let duration = document.createElement('span');
		$(duration).text("Duration: " + events[i].duration + " minutes");

		entry.appendChild(title);
		entry.appendChild(date);
		entry.appendChild(startTime);
		entry.appendChild(duration);

		$("ol").append(entry);
	}
};

/**
 * logic for the display button hiding or showing events
 */
const toggleEvents = () => {
	if (shouldDisplayEvents) {
		$("#display").text("Display");
		// removes the displayed elements
		$("ol").empty();
	} else {
		$("#display").text("Hide");
		displayEvents();
	}
	shouldDisplayEvents = !shouldDisplayEvents;
}

/**
 * sets the sort type when user selects a choice
 * hides the events displayed to prevent confusion
 * @param {*} evt 
 */
const sortEvents = evt => {
	// set global sort type and hide events
	sortType = evt.target.id.split("-")[0];

	$(".dropdown-content a").css({
		'color': 'white',
		'text-decoration': 'none'
	});
	$(evt.target).css({
		'color': 'lightblue',
		'text-decoration': 'underline'
	});

	shouldDisplayEvents = false;
	hideEvents();

	evt.preventDefault();
};

$(document).ready(() => {
	$("#home").click(() => location.href = "index.html");
	$("#calendar").click(() => location.href = "calendar.html");
	$("#events").click(() => location.reload());
	$("#about").click(() => location.href = "about.html");

	$("#submit").click(submitForm);

	$("#display").click(toggleEvents);
	$("#date-sort").click(sortEvents);
	$("#start-sort").click(sortEvents);
	$("#duration-sort").click(sortEvents);

	// read dark mode set on home page
	if (sessionStorage.darkMode === "on") {
		$('body').css("background-color", "grey");
	}
});