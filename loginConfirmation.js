/*
 * @Developer Brock Jones
 */

//Check if dark mode is on. If not, then light mode is enabled.
const dark = (sessionStorage.getItem("darkMode") == "on");

/**
 * Set dark or light mode for the page.
 * Also set welcome text to welcome the signed in user.
 */
$( document ).ready(function() {
    if(dark) {
        $("body").addClass("dark");
    } else {
        $("body").addClass("light");
    }

    $("#welcome").text("Welcome, " + sessionStorage.getItem("currentUser"));
});