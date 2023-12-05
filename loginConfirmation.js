/*
 * @Developer Brock Jones
 */
const dark = (sessionStorage.getItem("darkMode") == "on");

$( document ).ready(function() {
    if(dark) {
        $("body").addClass("dark");
    } else {
        $("body").addClass("light");
    }

    $("#welcome").text("Welcome, " + sessionStorage.getItem("currentUser"));
});