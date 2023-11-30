/*
 * @Developer Brock Jones
 */
"use strict";

const dark = (sessionStorage.getItem("darkMode") == "on");

class User {
    constructor(username, password){
        this.username = username;
        this.password = password;
    }
}

function setBorderRed(element){
    element.css("border", "red 4px solid");
}

function resetBorder(element){
    if(dark) {
        element.css("border", "3px whitesmoke solid");
    } else {
        element.css("border", "3px black solid");
    }
}

function validateForm(){
    let valid = true;

    //Validate First Name Field.
    let firstName = $("#firstName").val().trim();
    if(firstName == "") {
        $("#firstName").next().text("This is a required field.");
        valid = false;
        setBorderRed($("#firstName"));
    } else {
        $("#firstName").next().text("*");
        resetBorder($("#firstName"));
    }
    $("#firstName").val(firstName);
    
    //Validate Last Name Field.
    let lastName = $("#lastName").val().trim();
    if(lastName == "") {
        $("#lastName").next().text("This is a required field.");
        valid = false;
        setBorderRed($("#lastName"));
    } else {
        $("#lastName").next().text("*");
        resetBorder($("#lastName"));
    }
    $("#lastName").val(lastName);
    
    //Validate Username Field.
    let username = $("#username").val().trim();
    if(username == "") {
        $("#username").next().text("This is a required field.");
        valid = false;
        setBorderRed($("#username"));
    } else {
        $("#username").next().text("*");
        resetBorder($("#username"));
    }
    $("#username").val(username);

    //Validate Phone Number Field.
    let phoneNumber = $("#phoneNumber").val().trim();
    if(phoneNumber == "") {
        $("#phoneNumber").next().text("This is a required field.");
        valid = false;
        setBorderRed($("#phoneNumber"));
    } else {
        $("#phoneNumber").next().text("*");
        resetBorder($("#phoneNumber"));
    }
    $("#phoneNumber").val(phoneNumber);
    
    //Validate Password Field.
    let password = $("#password").val().trim();
    if(password == "") {
        $("#password").next().text("This is a required field.");
        valid = false;
        setBorderRed($("#password"));
    } else {
        $("#password").next().text("*");
        resetBorder($("#password"));
    }
    $("#password").val(password);

    //Validate Confirm Password Field.
    let confirmPassword = $("#confirmPassword").val().trim();
    if(confirmPassword == "") {
        $("#confirmPassword").next().text("This is a required field.");
        valid = false;
        setBorderRed($("#confirmPassword"));
    } else {
        $("#confirmPassword").next().text("*");
        resetBorder($("#confirmPassword"));
    }
    $("#confirmPassword").val(confirmPassword);

    //Validate Email Field.
    let email = $("#email").val().trim();
    if(email == "") {
        $("#email").next().text("This is a required field.");
        valid = false;
        setBorderRed($("#email"));
    } else {
        $("#email").next().text("*");
        resetBorder($("#email"));
    }
    $("#email").val(email);

    //Validate Confirm Email Field.
    let confirmEmail = $("#confirmEmail").val().trim();
    if(confirmEmail == "") {
        $("#confirmEmail").next().text("This is a required field.");
        valid = false;
        setBorderRed($("#confirmEmail"));
    } else {
        $("#confirmEmail").next().text("*");
        resetBorder($("#confirmEmail"));
    }
    $("#confirmEmail").val(confirmEmail);

    //Validate State Code Field.
    let stateCode = $("#stateCode").val().trim();
    if(stateCode == "") {
        $("#stateCode").next().text("This is a required field.");
        valid = false;
        setBorderRed($("#stateCode"));
    } else {
        $("#stateCode").next().text("*");
        resetBorder($("#stateCode"));
    }
    $("#stateCode").val(stateCode);

    //Validate Zip Code Field.
    let zipCode = $("#zipCode").val().trim();
    if(zipCode == "") {
        $("#zipCode").next().text("This is a required field.");
        valid = false;
        setBorderRed($("#zipCode"));
    } else {
        $("#zipCode").next().text("*");
        resetBorder($("#zipCode"));
    }
    $("#zipCode").val(zipCode);

    return valid;
}

function storeUser(){
    //If Form values are valid, store the user.
    if(validateForm()){
        console.log("Form is valid, running storeUser()");
        //List of stored users (empty array for first store)
        let users = JSON.parse(localStorage.getItem("users")) || [];

        let username = $("#username").val().trim();
        let password = $("#password").val().trim();

        let notPresent = true;

        for(let user of users){
            console.log(user.username);
            if(user.username == username) {
                notPresent = false;
                break;
            }
        }

        if(notPresent) {
            let newUser = new User(username, password);

            users[users.length] = newUser;

            localStorage.setItem("users", JSON.stringify(users));

            console.log("Users: " + localStorage.getItem("users"));
            return true;
        } 

        console.log("This username is already registered");
        $("#username").next().text("This username is already registered.");
        setBorderRed($("#username"));

        return false;
    } else {
        console.log("Preventing form submission");
        return false;
    }

}

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
