"use strict";

//Check if dark mode is on. If not, then light mode is enabled.
const dark = (sessionStorage.getItem("darkMode") == "on");

//Check to see if input matches any of the stored users.
//If valid redirect to page and store username as currentUser.
function loginUser(){
    //Stored array of User objects with attributes username and password
    let storedUsers = JSON.parse(localStorage.getItem("users"));

    let loginUsername = $("#username").val();
    let loginPassword = $("#password").val();

    for(let user of storedUsers){
        console.log(user);
        if(user.username == loginUsername && user.password == loginPassword) {
            sessionStorage.setItem("currentUser", loginUsername);
            
            location.href = "loginConfirmation.html";
            return false; //Prevent form submission so that redirect happens.
        }
    }

    //Login info does not match any of the stored users.
    $("#username").css("border","red 5px solid");
    $("#password").css("border","red 5px solid");
    $("#username").next().text("Login info is incorrect.");
    $("#password").next().text("Login info is incorrect.");

    //Prevent form from submitting
    console.log("Prevent form from submitting.");
    return false;
}

/**
 * Set dark or light mode for the page.
 */
$( document ).ready(function() {
    if(dark) {
        $("body").addClass("dark");
        $("input").addClass("darkInput");
        $("button").addClass("darkButton");
    } else {
        $("body").addClass("light");
        $("#submitButton").css("background-color", "limegreen");
        $("button").css("background-color", "red");
    }
});