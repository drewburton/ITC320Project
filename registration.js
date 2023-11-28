/*
 * @Developer Brock Jones
 */
"use strict";

class User {
    constructor(username, password){
        this.username = username;
        this.password = password;
    }
}

function setBorderRed(element){
    element.css("border", "red 5px solid");
}

function validateForm(){
    let firstName = $("#firstName");
    let lastName = $("#lastName");
    let username = $("#username");
    let phoneNumber = $("#phoneNumber");
    let password = $("#password");
    let confirmPassword = $("#confirmPassword");
    let email = $("#email");
    let confirmEmail = $("#confirmEmail");
    let stateCode = $("#stateCode");
    let zipCode = $("#zipCode");

    let errorMessageDiv = document.getElementById("errorMessages");
    let valid = true;
    let requiredFieldEmpty = false;

    errorMessageDiv.innerHTML = "";

    if(firstName.val().trim() == "") {
        requiredFieldEmpty = true;
        valid = false;
        setBorderRed(firstName);
    }
    
    if(lastName.val().trim() == "") {
        requiredFieldEmpty = true;
        valid = false;
        setBorderRed(lastName);
    }
    
    if(username.val().trim() == "") {
        requiredFieldEmpty = true;
        valid = false;
        setBorderRed(username);
    }

    if(phoneNumber.val().trim() == "") {
        requiredFieldEmpty = true;
        valid = false;
        setBorderRed(phoneNumber);
    }
    
    if(password.val().trim() == "") {
        requiredFieldEmpty = true;
        valid = false;
        setBorderRed(password);
    }

    if(confirmPassword.val().trim() == "") {
        requiredFieldEmpty = true;
        valid = false;
        setBorderRed(confirmPassword);
    }

    if(email.val().trim() == "") {
        requiredFieldEmpty = true;
        valid = false;
        setBorderRed(email);
    }

    if(confirmEmail.val().trim() == "") {
        requiredFieldEmpty = true;
        valid = false;
        setBorderRed(confirmEmail);
    }

    if(stateCode.val().trim() == "") {
        requiredFieldEmpty = true;
        valid = false;
        setBorderRed(stateCode);
    }

    if(zipCode.val().trim() == "") {
        requiredFieldEmpty = true;
        valid = false;
        setBorderRed(zipCode);
    }

    if(requiredFieldEmpty) {
        let errorMessage = document.createElement("span");
        errorMessage.textContent = "One or more highlighted fields are required.";
        errorMessageDiv.appendChild(errorMessage);
    }

    return valid;
}

function storeUser(){
    //If Form values are valid, store the user.
    if(validateForm()){
        console.log("Running storeUser()");
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
        return false;
    } else {
        console.log("Preventing form submission");
        return false;
    }

}

