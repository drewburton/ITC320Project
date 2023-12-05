/*
 * @Developer Brock Jones
 */
"use strict";

const dark = (sessionStorage.getItem("darkMode") == "on");

function displayResults() {
    let results = JSON.parse(sessionStorage.getItem("registrationResults"));

    $("#date").text(results[0]);
    $("#firstName").text(results[1]);
    $("#lastName").text(results[2]);
    $("#username").text(results[3]);
    $("#phoneNumber").text(results[4]);
    $("#email").text(results[5]);
    $("#stateCode").text(results[6]);
    $("#zipCode").text(results[7]);
    $("#customerType").text(results[8]);
    $("#paymentType").text(results[9]);
    $("#student").text(results[10] != null);
    $("#veteran").text(results[11] != null);
    $("#seniorCitizen").text(results[12] != null);
}

$( document ).ready(function() {
    if(dark) {
        $("body").addClass("dark");
        $("table").addClass("darkTable");
    } else {
        $("body").addClass("light");
        $("table").addClass("lightTable")
    }

    displayResults();
});