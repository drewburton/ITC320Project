"use strict";

function formatDateString(inputDateString) {
	const date = new Date(inputDateString);

	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
	const day = date.getDate().toString().padStart(2, '0');

	const formattedDate = `${year}-${month}-${day}`;

	return formattedDate;
}

const getUserEvents = () => {
	const currentUser = sessionStorage.getItem('currentUser') || "admin";

	if (currentUser) {
		const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
		return storedEvents.filter(event => event.user === currentUser);
	}
	return undefined;
};

const getEventsByDate = date => {
	const events = getUserEvents();
	if (events) {
		const matchingEvents = events.filter(event => event.date.startsWith(date));

		return matchingEvents;
	}
	return undefined;
}

const editEvent = event => {
	$(".edit").toggleClass("edit-inactive");

	$("#title").val(event.title);
	$("#date").val(formatDateString(event.date));
	$("#start").val(event.startHours + ":" + event.startMinutes.toString().padStart(2, 0));
	$("#duration").val(event.duration);

	// add validation
	// event listener for confirm button
};

const generateQR = event => {

}

const displayEvents = date => {
	$(".events").css("display", "block");
	$(".edit").addClass("edit-inactive");
	$("ol").empty();
	const events = getEventsByDate(formatDateString(date));

	for (const e of events) {
		let entry = $("<li>");
		let title = $("<p>");
		title.text(e.title);

		let startTime = $("<p>");
		let pm = e.startHours > 12 ? " PM" : " AM";
		let hours = e.startHours > 12 ? e.startHours - 12 : e.startHours;
		let minutes = e.startMinutes.toString().padStart(2, 0);
		startTime.text("at " + hours + ":" + minutes + pm);

		let duration = $("<p>");
		duration.text("for " + e.duration + " minutes");

		let edit = $("<button>");
		edit.text("Edit");
		edit.click(() => editEvent(e));

		let qr = $("<button>");
		qr.text("Generate QR code");
		qr.click(() => generateQR(e));

		entry.append(title);
		entry.append(startTime);
		entry.append(duration);
		entry.append(edit);
		entry.append(qr);
		$("ol").append(entry);
	}
};

$(document).ready(() => {
	$("#home").click(() => location.href = "index.html");
	$("#calendar").click(() => location.reload());
	$("#events").click(() => location.href = "config.html");
	$("#about").click(() => location.href = "about.html");

	$("#datepicker").datepicker({
		beforeShowDay: function (date) {
			const dateString = $.datepicker.formatDate('yy-mm-dd', date);

			const events = getEventsByDate(dateString);
			if (events) {
				return [events.length > 0, 'highlighted'];
			}
			return [false, 'highlighted'];
		},
		onSelect: function (dateText, inst) {
			displayEvents(dateText);
		}
	});
});