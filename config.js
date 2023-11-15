"use strict";

const submitForm = evt => {
	let valid = true;

	// validate date
	let date = $("#date").val().split("-");
	date = new Date(date[0], date[1], date[2]);
	if (date == "Invalid Date") {
		valid = false;
		$("#date").next("span").text("Enter a valid date");
	}

	// validate start time
	let start = $("#start").val().split(":");
	let hours = parseInt(start[0]);
	let minutes = parseInt(start[1]);
	if (!hours && !minutes) {
		valid = false;
		$("#start").next("span").text("Enter a valid time");
	}

	// validate duration
	let duration = parseInt($("#duration").val());
	if (!duration) {
		valid = false;
		$("#duration").next("span").text("Enter a valid duration");
	}

	// validate user
	let user = sessionStorage.currentUser || "admin";
	if (!user) {
		valid = false;
		alert("Please login to create events");
	}

	// display errors and prevent submission if invalid
	if (!valid) {
		evt.preventDefault();
	} else {
		// create event object
		let event = {
			date: date,
			startHours: hours,
			startMinutes: minutes,
			duration: duration
		};
		console.log(event);

		// add to web storage
		let existingEvents = JSON.parse(localStorage.getItem("events")) || [];
		existingEvents.push(event);
		let jsonString = JSON.stringify(existingEvents);
		localStorage.events = jsonString;

		// clear fields, display confirmation message,
		// and focus on date input
		$("#date").val("");
		$("#start").val("");
		$("#duration").val("");
		$("form span").text("");

		$("#date").focus();

		$("#confirmation").text("Your event has been successfully added");
		setTimeout(() => $("#confirmation").text(""), 5000);

		evt.preventDefault();
	}
};

const displayEvents = () => {
	// read from web storage

	// if no events display, no events to display

	// sort the elements by sort type

	// display in a list (remove any duplicates from web storage while doing this) 
};

const sortEvents = type => {
	// set global sort type and display events
};

$(document).ready(() => {
	$("#home").click(() => location.href = "index.html");
	$("#calendar").click(() => location.href = "calendar.html");
	$("#events").click(() => location.reload());
	$("#about").click(() => location.href = "about.html");

	$("#submit").click(submitForm);

	$("#display").click(displayEvents);
	$("#date-sort").click(sortEvents("date"));
	$("#start-sort").click(sortEvents("start"));
	$("#duration-sort").click(sortEvents("duration"));
});