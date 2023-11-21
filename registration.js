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
    
}

function validateForm(){
    let firstName = $("#firstName").val();
    let lastName = $("#lastName").val();
    let username = $("#username").val();
    let phoneNumber = $("#phoneNumber").val();
    let password = $("#password").val();
    let confirmPassword = $("#confirmPassword").val();
    let email = $("#email").val();
    let confirmEmail = $("#confirmEmail").val();
    let stateCode = $("#stateCode").val();
    let zipCode = $("#zipCode").val();
    let customerType = document.querySelector('input[name="customerType"]:checked').value;
    let paymentType = document.querySelector('input[name="paymentType"]:checked').value;
    let users = JSON.parse(localStorage.getItem("users"));

    return firstName !== "";
}

function storeUser(){
    //If Form values are valid, store the user.
    if(validateForm()){
        console.log("Running storeUser()");
        //List of stored users (empty array for first store)
        let users = JSON.parse(localStorage.getItem("users"));

        let username = $("#username").val();
        let password = $("#password").val();

        let newUser = new User(username, password);

        users[users.length] = newUser;

        localStorage.setItem("users", JSON.stringify(users));

        console.log("Users: " + localStorage.getItem("users"));
        localStorage.setItem("users", JSON.stringify([]));
        return true;
    } else {
        console.log("Preventing form submission");
        return false;
    }

    
}