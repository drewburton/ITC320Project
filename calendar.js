"use strict";

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

function formatDateString(inputDateString) {
	const date = new Date(inputDateString);

	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
	const day = date.getDate().toString().padStart(2, '0');

	const formattedDate = `${year}-${month}-${day}`;

	return formattedDate;
}

function validateEdit(title, date, hours, minutes, duration) {
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

	return valid;
}

const getUserEvents = () => {
	const currentUser = sessionStorage.getItem('currentUser') || undefined;

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

const autofillEdit = event => {
	$(".edit").toggleClass("edit-inactive");

	$("#title").val(event.title);
	$("#date").val(formatDateString(event.date));
	$("#start").val(event.startHours.toString().padStart(2, 0) + ":" + event.startMinutes.toString().padStart(2, 0));
	$("#duration").val(event.duration);

	$("#confirm").off("click");
	$("#confirm").on("click", () => {
		let title = $("#title").val();
		let date = $("#date").val().split("-");
		date = new Date(date[0], date[1] - 1, date[2]);
		let start = $("#start").val().split(":");
		let hours = parseInt(start[0]);
		let minutes = parseInt(start[1]);
		let duration = parseInt($("#duration").val());
		let user = sessionStorage.currentUser || undefined;

		if (validateEdit(title, date, hours, minutes, duration)) {
			let remainingEvents = JSON.parse(localStorage.events).filter(e =>
				e.title !== event.title ||
				e.date !== event.date ||
				e.user !== event.user
			);
			remainingEvents.filter(e => {
				e.date !== event.date ||
					e.startHours !== event.startHours ||
					e.startMinutes !== event.startMinutes
			});

			let newEvent = new Event(user, title, date, hours, minutes, duration);
			remainingEvents.push(newEvent);
			localStorage.events = JSON.stringify(remainingEvents);
			$(".edit").toggleClass("edit-inactive");
			$("#datepicker").datepicker("refresh");
			$(".events").css("display", "none");
		}
	});
};

const deleteEvent = event => {
	const isConfirmed = window.confirm("Are you sure you want to delete " + event.title + "?");

	if (isConfirmed) {
		// get events in storage
		let remainingEvents = JSON.parse(localStorage.events).filter(e =>
			e.title !== event.title ||
			e.date !== event.date ||
			e.user !== event.user);
		remainingEvents.filter(e => {
			e.date !== event.date ||
				e.startHours !== event.startHours ||
				e.startMinutes !== event.startMinutes
		});

		localStorage.events = JSON.stringify(remainingEvents);
		$("#datepicker").datepicker("refresh");
		$(".events").css("display", "none");
	}
};

const generateQR = async (event, date) => {
	if (location.pathname.endsWith('/'))
		location.pathname = location.pathname.substring(0, location.pathname.length - 1);
	let path = location.pathname.substring(0, location.pathname.lastIndexOf('/')) + "/wakeup.html";
	let link = location.protocol + "//" + location.hostname + path +
		"?title=" + event.title + "&startHours=" + event.startHours +
		"&startMinutes=" + event.startMinutes + "&duration=" +
		event.duration + "&date=" + date;
	let domain = "https://api.qrserver.com/v1/create-qr-code";
	let params = "?data=" + encodeURIComponent(link) + "&size=200x200";
	let url = new URL(domain + params);
	await fetch(url)
		.then(res => { return res.blob() })
		.then(blob => {
			var img = URL.createObjectURL(blob);

			let elem = $("<img>");
			elem.attr('src', img);
			$('#qr').empty();
			$('#qr').append(elem);
		});
	let hide = $("<button>");
	hide.text("hide");
	hide.click(() => {
		$('#qr').empty();
	});
	$('#qr').append(hide);
};

const displayEvents = date => {
	$(".events").css("display", "block");
	$(".edit").addClass("edit-inactive");
	$("ol").empty();
	const events = getEventsByDate(formatDateString(date));

	for (const e of events) {
		let entry = $("<li>");
		let link = $("<button>");
		link.addClass("event");
		link.click(() => {
			let query = "?title=" + e.title + "&startHours=" + e.startHours + "&startMinutes=" + e.startMinutes + "&duration=" + e.duration + "&date=" + date;
			if (location.pathname.endsWith('/'))
				location.pathname = location.pathname.substring(0, location.pathname.length - 1);
			let path = location.pathname.substring(0, location.pathname.lastIndexOf('/')) + "/wakeup.html";
			location.href = path + query;
		});

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
		edit.click(evt => {
			autofillEdit(e)
			evt.stopPropagation();
		});

		let del = $("<button>");
		del.text("Delete");
		del.click(evt => {
			deleteEvent(e)
			evt.stopPropagation();
		});

		let qr = $("<button>");
		qr.text("Generate QR code");
		qr.click(async evt => {
			evt.stopPropagation();
			qr.text("Loading...");
			await generateQR(e, date);
			qr.text("Generate QR code");
		});

		link.append(title);
		link.append(startTime);
		link.append(duration);
		link.append(edit);
		link.append(del);
		link.append(qr);
		entry.append(link);
		$("ol").append(entry);
	}
};

const viewNextEvent = () => {
	let query = "?rollover=true";
	if (location.pathname.endsWith('/'))
		location.pathname = location.pathname.substring(0, location.pathname.length - 1);
	let path = location.pathname.substring(0, location.pathname.lastIndexOf('/')) + "/wakeup.html";
	location.href = path + query;
}

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

	if (sessionStorage.darkMode === "on") {
		$('body').css("background-color", "grey");
		$('.ui-datepicker').css("background-color", "grey");
	}

	if (sessionStorage.currentUser) {
		$(".next").click(viewNextEvent);
	} else {
		$(".next").css('display', 'none');
	}
});